---
layout: post
title: "How to Authenticate Firebase and Angular with Auth0: Part 1 - Custom Tokens & Lazy Loading"
description: "Learn how to authenticate a realtime Firebase and Angular app with an API using Auth0 with custom Firebase tokens."
longdescription: "Learn how to authenticate a realtime Firebase and Angular app with an API using Auth0 with custom Firebase tokens. Set up Angular with scalable, real-world architecture with lazy loading and implement Auth0 authentication on the client and server."
date: 2018-01-23 8:30
category: Technical guide, Firebase, Angular
banner:
  text: "Auth0 makes it easy to add authentication to your Angular application."
author:
  name: "Kim Maida"
  url: "https://twitter.com/KimMaida"
  mail: "kim.maida@auth0.com"
  avatar: "https://secure.gravatar.com/avatar/a208cda2b3b21dc8d7896507f5ff60fc"
design:
  image: https://cdn.auth0.com/blog/firebasephoneauth/logo.png
  bg_color: "#4236C9"
tags:
- firebase
- angular
- tokens
- node
- api
- angularfire2
- realtime-database
- cloud-firestore
- firestore
- real-time
- async
- auth0
- authentication
related:
- 2018-01-24-how-to-authenticate-firebase-and-angular-with-auth0-part-2
- 2017-06-28-real-world-angular-series-part-1
---

<div class="alert alert-danger alert-icon">
  <i class="icon-budicon-487"></i>
  <strong>WARNING: This article uses Angular 5 and RxJS 5.</strong> Please be aware that angularfire2 is currently not compatible with changes in Angular 6. We will update this tutorial once angularfire2 compatibility is completed. Thank you for your patience!
</div>

**TL;DR:** In this 2-part tutorial series, we'll learn how to build an application that secures a Node back end and an Angular front end with [Auth0](https://auth0.com) authentication. Our server and app will also authenticate a [Firebase](https://firebase.google.com) [Cloud Firestore database](https://firebase.google.com/docs/firestore/) with custom tokens so that users can leave realtime comments in a secure manner after logging in with Auth0. The Angular application code can be found at the [angular-firebase GitHub repo](https://github.com/auth0-blog/angular-firebase) and the Node API can be found in the [firebase-auth0-nodeserver repo](https://github.com/auth0-blog/firebase-auth0-nodeserver).

---

## How to Authenticate Firebase and Angular with Auth0: Part 1

Part 1 of our tutorial will cover:

1. <a href="#firebase-auth0" target="_self">Firebase and Auth0</a>
2. <a href="#what-well-build" target="_self">What We'll Build</a>
3. <a href="#angular-cli" target="_self">Angular CLI</a>
4. <a href="#auth0-client-api" target="_self">Auth0 Application and API</a>
5. <a href="#firebase-project-service-account" target="_self">Firebase Project with Service Account</a>
6. <a href="#node-api" target="_self">Node API</a>
7. <a href="#set-up-angular-app" target="_self">Set Up Angular App</a>
8. <a href="#angular-app-architecture" target="_self">Angular App Architecture</a>
9. <a href="#shared-modules" target="_self">Implement Shared Modules</a>
10. <a href="#routing-lazy-loading" target="_self">Implement Routing and Lazy Loaded Modules</a>
11. <a href="#loading-error-components" target="_self">Loading and Error Components</a>
12. <a href="#auth-logic" target="_self">Authentication Logic</a>
13. <a href="#core-logic" target="_self">Core Logic</a>
14. <a href="#next-steps" target="_self">Next Steps</a>

## <span id="firebase-auth0"></span>Firebase and Auth0

**[Firebase](https://firebase.google.com)** is a mobile and web application development platform. Firebase was acquired by Google in 2014, and continues to be developed under the Google umbrella. Firebase provides NoSQL databases ([RTDB, or Realtime Database](https://firebase.google.com/docs/database/) and [Cloud Firestore, in beta at the time of writing](https://firebase.google.com/docs/firestore/)) hosted in the cloud and connected using web sockets to provide realtime capabilities to apps.

**[Auth0](https://auth0.com)** is a cloud-based platform that provides authentication and authorization as a service. As an authentication provider, Auth0 enables developers to easily implement and customize login and authorization security for their apps.

### Choosing Auth0 + Firebase Authentication

If you're already familiar with Firebase's offerings, you might be asking: why would we implement Auth0 with custom tokens in Firebase instead of sticking with [Firebase's built-in authentication](https://firebase.google.com/docs/auth/) by itself?

Firstly, there is an important distinction to make here. Using Auth0 to secure Firebase does not mean you are _not_ using Firebase auth. Firebase has a [custom authentication approach](https://firebase.google.com/docs/auth/web/custom-auth) that allows developers to integrate their preferred identity solution _with_ Firebase auth. This approach enables developers to implement Firebase auth so that it functions seamlessly with proprietary systems or other authentication providers.

There are many potential reasons we might want to integrate Auth0 with Firebase authentication. Alternatively, there are scenarios where using basic Firebase auth by itself could suffice. Let's explore.

You can use **Firebase's built-in authentication by itself** if you:

* Only want to authenticate Firebase RTDB or Firestore and have no need to authenticate additional back ends
* Only need a small handful of login options and do not need enterprise identity providers, integration with your own user storage databases, etc.
* Do not need extensive user management, profile enrichment, etc. and are comfortable [managing users strictly through an API](https://firebase.google.com/docs/auth/web/manage-users)
* Have no need to customize authentication flows
* Do not need to adhere to compliance regulations regarding the storage of user data

You should consider **Auth0 with a custom Firebase token** if you:

* Already have Auth0 implemented and want to add realtime capabilities to your app
* Need to easily use issued tokens to [secure a back end](https://auth0.com/docs/apis) that is _not_ provided by Firebase
* Need to integrate [social identity providers](https://auth0.com/docs/identityproviders#social) beyond just Google, Facebook, Twitter, and GitHub
* Need to integrate [enterprise identity providers](https://auth0.com/docs/identityproviders#enterprise), such as Active Directory, LDAP, ADFS, SAMLP, etc.
* Need a [customized authentication flow](https://auth0.com/docs/rules/current)
* Need robust [user management with APIs _and_ an admin-friendly dashboard](https://auth0.com/docs/users)
* Want to be able to dynamically [enrich user profiles](https://auth0.com/docs/monitoring/track-signups-enrich-user-profile-generate-leads)
* Want features like customizable [passwordless login](https://auth0.com/docs/connections/passwordless), [multifactor authentication](https://auth0.com/docs/multifactor-authentication), [breached password security](https://auth0.com/docs/anomaly-detection/breached-passwords), [anomaly detection](https://auth0.com/docs/anomaly-detection), etc.
* Must adhere to [compliance regulations](https://auth0.com/docs/compliance) such as HIPAA, GDPR, SOC2, etc.

Essentially, Firebase's basic authentication providers should suffice if you have a very simple app with bare-bones authentication needs and are only using Firebase databases. However, should you need more than that, [Firebase offers a great way to use their services _with_ other authentication solutions](https://firebase.google.com/docs/admin/setup). This is a much more realistic scenario that many developers will be faced with, so we'll explore it in detail here.

{% include tweet_quote.html quote_text="If you need more than simple login with Firebase, using custom tokens with an IDaaS authentication provider like Auth0 is a great option." %}

## <span id="what-well-build"><span>What We'll Build

We're going to build a Node.js API secured with Auth0 that mints custom Firebase tokens and also returns data on ten different dog breeds.

We'll also build an Angular front end app called "Popular Dogs" that displays information about the ten most popular dogs in 2016, ranked by public popularity by the American Kennel Club (AKC). Our app will be secured by Auth0, call the Node API to fetch dog data, and call the API to acquire Firebase tokens to authorize users to add and delete comments in realtime with Cloud Firestore. The app will use shared modules as well as implement lazy loading.

![Angular Firebase app with Auth0 custom tokens](https://cdn.auth0.com/blog/firebase-auth0/dogs.jpg)

To implement the app, you will need the following:

* Angular CLI
* A free Auth0 account with an Application and an API configured
* A free Firebase project with a service account

Let's get started!

## <span id="angular-cli"></span>Angular CLI

Make sure you have [Node.js with NPM](https://nodejs.org) installed on your local machine. Run the following command to install the [Angular CLI](https://github.com/angular/angular-cli) globally:

```bash
$ npm install -g @angular/cli@latest
```

We will generate our Angular app and nearly all of its architecture using the CLI.

## <span id="auth0-client-api"></span>Auth0 Application and API

You'll need an [Auth0](https://auth0.com) account to manage authentication. You can <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">sign up for a free account here</a>.

![Auth0 login screen](https://cdn.auth0.com/blog/resources/auth0-centralized-login.jpg)

Next, set up an Auth0 Application and API so Auth0 can interface with the Angular app and Node API.

### Set Up an Auth0 Application

1. Go to your [**Auth0 Dashboard**](https://manage.auth0.com/#/) and click the "[Create a New Application](https://manage.auth0.com/#/applications/create)" button.
2. Name your new app (something like `Angular Firebase`) and select "Single Page Web Applications".
3. In the **Settings** for your new Auth0 application app, add `http://localhost:4200/callback` to the **Allowed Callback URLs**.
4. Enable the toggle for **Use Auth0 instead of the IdP to do Single Sign On**. 
5. At the bottom of the **Settings** section, click "Show Advanced Settings". Choose the **OAuth** tab and verify that the **JsonWebToken Signature Algorithm** is set to "RS256".
6. If you'd like, you can [set up some social connections](https://manage.auth0.com/#/connections/social). You can then enable them for your app in the **Application** options under the **Connections** tab. The example shown in the screenshot above uses username/password database, Facebook, Google, and Twitter. 

> **Note:** For production, make sure you set up your own social keys and do not leave social connections set to use Auth0 dev keys.

### Set Up an Auth0 API

1. Go to [**APIs**](https://manage.auth0.com/#/apis) in your Auth0 dashboard and click on the "Create API" button. Enter a name for the API, such as `Firebase Dogs API`. Set the **Identifier** to your API endpoint URL. In this tutorial, our API identifier is `http://localhost:1337/`. The **Signing Algorithm** should be "RS256".
2. You can consult the Node.js example under the **Quick Start** tab in your new API's settings. In the next steps, we'll implement our Node API in this fashion using [Express](https://expressjs.com/), [express-jwt](https://github.com/auth0/express-jwt), and [jwks-rsa](https://github.com/auth0/node-jwks-rsa).

We're now ready to implement Auth0 authentication on both our Angular client and Node back end API.

## <span id="firebase-project-service-account"></span>Firebase Project with Service Account

Next you will need a free [Firebase](https://firebase.google.com) project.

### Create a Firebase Project

1. Go to the **[Firebase Console](https://console.firebase.google.com)** and sign in with your Google account. 
2. Click on **Add Project**.
3. In the dialog that pops up, give your project a name (such as `Angular Firebase Auth0`). A project ID will be generated based on the name you chose. You can then select your country/region.
4. Click the "Create Project" button.

### Generate an Admin SDK Key

In order to [mint custom Firebase tokens](https://firebase.google.com/docs/auth/admin/create-custom-tokens), you'll need access to the [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup). To obtain access, you must create a service account in your new Firebase project.

Click on the gear wheel icon next to your Project Overview in the Firebase console sidebar and select **Project Settings** from the menu that appears:

<p align="center"><img src="https://cdn.auth0.com/blog/firebase-auth0/firebase-project-settings.png"></p>

In the settings view, click the [Service Accounts](https://console.firebase.google.com/u/0/project/_/settings/serviceaccounts/adminsdk) tab. The **Firebase Admin SDK** UI will appear, showing a configuration code snippet. Node.js is selected by default. This is the technology we want, and we will implement it in our Node API. Click on the "Generate New Private Key" button.

A dialog will appear warning you to store your private key confidentially. We will take care never to check this key into a public repository. Click on the "Generate Key" button to download the key as a `.json` file. We will add this file to our Node API shortly.

## <span id="node-api"></span>Node API

The completed Node.js API for this tutorial can be found at the [firebase-auth0-nodeserver GitHub repo](https://github.com/auth0-blog/firebase-auth0-nodeserver). Let's learn how to build this API.

### Node API File Structure

We'll want to set up the following file structure:

```text
firebase-auth0-nodeserver/
  |--firebase/
     |--.gitignore
     |--<your-firebase-admin-sdk-key>.json
  |--.gitignore
  |--config.js
  |--dogs.json
  |--package.json
  |--routes.js
  |--server.js  
```

You can generate the necessary folders and files with the command line like so:

```bash
$ mkdir firebase-auth0-nodeserver
$ cd firebase-auth0-nodeserver
$ mkdir firebase
$ touch firebase/.gitignore
$ touch .gitignore
$ touch config.js
$ touch dogs.json
$ touch package.json
$ touch routes.js
$ touch server.js
```

### Firebase Admin SDK Key and Git Ignore

Now move the Firebase Admin SDK `.json` key file you downloaded earlier into the `firebase` folder. We will take care to make sure the folder is checked in, but its _contents_ are never pushed to a repo using the `firebase/.gitignore` like so:

```bash
# firebase/.gitignore
*
*/
!.gitignore
```

This `.gitignore` configuration ensures that Git will ignore any files and folders inside the `firebase` directory _except_ for the `.gitignore` file itself. This allows us to commit an (essentially) empty folder. Our `.json` Firebase Admin SDK key can live in this folder and we won't have to worry about gitignoring it by _filename_.

> **Note:** This is particularly useful if we have the project pulled down on multiple machines and have different keys (with different filenames) generated.

Next let's add the code for the root directory's `.gitignore`:

```bash
# .gitignore
config.js
node_modules
```

### Dogs JSON Data

Next we'll add the data for ten dog breeds. For brevity, you can simply **[copy and paste this data](https://raw.githubusercontent.com/auth0-blog/firebase-auth0-nodeserver/master/dogs.json)** into your `dogs.json` file.

### Dependencies

Let's add our `package.json` file like so:

```json
{
  "name": "firebase-auth0-nodeserver",
  "version": "0.1.0",
  "description": "Node.js server that authenticates with an Auth0 access token and returns a Firebase auth token.",
  "repository": "https://github.com/auth0-blog/firebase-auth0-nodeserver",
  "main": "server.js",
  "scripts": {
    "start": "node server"
  },
  "author": "Auth0",
  "license": "MIT",
  "dependencies": {},
  "devDependencies": {}
}
```

We'll install the dependencies with the command line and latest versions will be saved automatically to the `package.json` file:

```bash
$ npm install --save body-parser cors express express-jwt jwks-rsa firebase-admin
```

We'll need `body-parser`, `cors`, and `express` to serve our API endpoints. Authentication will rely on `express-jwt` and `jwks-rsa`, while Firebase token minting is implemented with the `firebase-admin` SDK (which we'll have access to using the key we generated).

### Configuration

In the `config.js` file, add the following code and replace the placeholder values with your own settings:

```js
// config.js
module.exports = {
  AUTH0_DOMAIN: '<Auth0 Domain>', // e.g., you.auth0.com
  AUTH0_API_AUDIENCE: '<Auth0 API Audience>', // e.g., http://localhost:1337/
  FIREBASE_KEY: './firebase/<Firebase JSON>', // e.g., your-project-firebase-adminsdk-xxxxx-xxxxxxxxxx.json
  FIREBASE_DB: '<Firebase Database URL>' // e.g., https://your-project.firebaseio.com
};
```

### Server

With our data, configuration, and dependencies in place, we can now implement our Node server. Open the `server.js` file and add:

```js
// server.js
// Modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// App
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Set port
const port = process.env.PORT || '1337';
app.set('port', port);

// Routes
require('./routes')(app);

// Server
app.listen(port, () => console.log(`Server running on localhost:${port}`));
```

This will launch our Node server with Express at `http://localhost:1337/`.

> **Note:** Notice that this is the API identifier we set up in Auth0.

### API Routes

Next open the `routes.js` file. This is where we'll define our API endpoints, secure them, and mint custom Firebase tokens. Add the following code:

```js
// routes.js
// Dependencies
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const firebaseAdmin = require('firebase-admin');
// Config
const config = require('./config');

module.exports = function(app) {
  // Auth0 athentication middleware
  const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${config.AUTH0_DOMAIN}/.well-known/jwks.json`
    }),
    audience: config.AUTH0_API_AUDIENCE,
    issuer: `https://${config.AUTH0_DOMAIN}/`,
    algorithm: 'RS256'
  });

  // Initialize Firebase Admin with service account
  const serviceAccount = require(config.FIREBASE_KEY);
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: config.FIREBASE_DB
  });

  // GET object containing Firebase custom token
  app.get('/auth/firebase', jwtCheck, (req, res) => {
    // Create UID from authenticated Auth0 user
    const uid = req.user.sub;
    // Mint token using Firebase Admin SDK
    firebaseAdmin.auth().createCustomToken(uid)
      .then(customToken => 
        // Response must be an object or Firebase errors
        res.json({firebaseToken: customToken})
      )
      .catch(err => 
        res.status(500).send({
          message: 'Something went wrong acquiring a Firebase token.',
          error: err
        })
      );
  });

  // Set up dogs JSON data for API
  const dogs = require('./dogs.json');
  const getDogsBasic = () => {
    const dogsBasicArr = dogs.map(dog => {
      return {
        rank: dog.rank,
        breed: dog.breed,
        image: dog.image
      }
    });
    return dogsBasicArr;
  }

  // GET dogs (public)
  app.get('/api/dogs', (req, res) => {
    res.send(getDogsBasic());
  });

  // GET dog details by rank (private)
  app.get('/api/dog/:rank', jwtCheck, (req, res) => {
    const rank = req.params.rank * 1;
    const thisDog = dogs.find(dog => dog.rank === rank);
    res.send(thisDog);
  });
};
```

At a high level, our routes file does the following:

* Sets up authentication checking to ensure that only logged in users can access routes with `jwtCheck` middleware
* Initializes the Firebase Admin SDK with the private key generated from the Firebase project service account
* Provides a secure `GET` endpoint that returns a custom Firebase token
* Provides a public `GET`* endpoint that returns a short version of the dogs data
* Provides a secure `GET`* endpoint that returns a specific dog's detailed data, requested by rank

_*Endpoints use variations of the same base dataset to simulate a more complex API._

You can read the code comments for more detail.

### Serve the API

You can serve the Node API by running:

```bash
$ node server
```

The API will then be available at [http://localhost:1337](http://localhost:1337).

> **Note:** If you try to access secure routes in the browser, you should receive a `401 Unauthorized` error.

That's it for our server! Keep the API running so that it will be accessible to the Angular app, which we'll set up next.

## <span id="set-up-angular-app"></span>Set Up Angular App

Now it's time to create our Angular app and set up some additional dependencies.

### Create New Angular App

You should have already installed the [Angular CLI](https://github.com/angular/angular-cli) earlier. We can now use the CLI to generate our project and its architecture. To create a new app, choose a containing folder and then run the following command:

```bash
$ ng new angular-firebase --routing --skip-tests
```

The `--routing` flag generates an app with a routing module and `--skip-tests` generates the root component with no `.spec.ts` file.

> **Note:** For brevity, we are not going to cover testing in this article. If you'd like to learn more about testing in Angular, check out the tutorial's conclusion for more resources.

### Install Front End Dependencies

Now let's install our front end dependencies:

```bash
$ cd angular-firebase
$ npm install --save auth0-js@latest firebase@latest angularfire2@latest
```

We will need the [`auth0-js` library](https://github.com/auth0/auth0.js) to implement Auth0 authentication in our Angular app. We'll also need the [`firebase` JS SDK](https://github.com/firebase/firebase-js-sdk) and the [`angularfire2` Angular Firebase library](https://github.com/angular/angularfire2/) to implement our realtime comments with Firebase.

### Add Bootstrap CSS

To simplify styling, we'll add the [Bootstrap CSS](https://getbootstrap.com) CDN link to the `<head>` of our `index.html` file like so:

{% highlight html %}
{% raw %}
<!-- src/index.html -->
...
<head>
  ...
  <title>Top 10 Dogs</title>
  ...
  <link
    rel="stylesheet"
    href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
    integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
    crossorigin="anonymous">
</head>
...
{% endraw %}
{% endhighlight %}

### Serve the Angular App

You can serve the Angular app with the following command:

```bash
$ ng serve
```

The app will run in the browser at [http://localhost:4200](http://localhost:4200).

## <span id="angular-app-architecture"></span>Angular App Architecture

We're going to use the Angular CLI to generate the complete architecture for our app up front. This way, we can make sure that our modules are functioning properly before we implement our logic and templates.

Our app is going to use a **modular approach with lazy loading**. The sample app in this tutorial is small, but we want to build it in a **scalable, real-world** manner.

{% include tweet_quote.html quote_text="The sample app in this tutorial is small, but we want to build it in a scalable, real-world manner: modular with lazy loading." %}

### Root Module

The root module has already been created when the Angular app was generated with the `ng new` command. The root module lives at `src/app/app.module.ts`. Any components we generate in our Angular app without another module's subdirectory specified will be automatically imported and declared in our root module.

Let's generate a component with the CLI now:

```bash
# create CallbackComponent:
$ ng g component callback --is --it --flat --no-spec
```

This command is composed of the following:

* `ng g component`: generates a `callback` component file with:
* `--is` inline styles
* `--it` inline template
* `--flat` no containing folder
* `--no-spec` no `.spec` test file

We'll use the callback component to handle redirection after the user logs into our application. It's a very simple component.

> **Note:** `g` is a shortcut for `generate`. We could also use `c` as a shortcut for `component`, making this command `ng g c`. However, this tutorial will not use shortcuts for the type of files generated, in the interest of clarity.

### Core Module Architecture

Next we'll create the `CoreModule` and its components and services. This is a _shared_ module. From the root of your Angular project folder, run the following CLI commands. Make sure you run the `ng g module core` command _first_, like so:

```bash
# create Core module:
$ ng g module core
# create API service with no .spec file:
$ ng g service core/api --no-spec
# create HeaderComponent with inline styles, no .spec file, and export in module:
$ ng g component core/header --is --no-spec --export=true
# create LoadingComponent with inline styles, inline template, no folder, no .spec file, and export in module:
$ ng g component core/loading --is --it --flat --no-spec --export=true
# create ErrorComponent with inline styles, inline template, no folder, no .spec file, and export in module:
$ ng g component core/error --is --it --flat --no-spec --export=true
# create Dog type interface:
$ ng g interface core/dog
# create DogDetail type interface:
$ ng g interface core/dog-detail
```

Creating the module first ensures that components created in that module's folder will then be imported and declared automatically in that parent module instead of the app's root module.

> **Note:** If you wish to use a shared module's components in another module, you need to `export` the components as well as declare them. We can do this automatically with the CLI using the `--export=true` flag.

This is the basic architecture for the shared core services, components, and models that our app will need access to.

### Auth Module Architecture

Next we'll create our `AuthModule`. Execute the following CLI commands (again, making sure to generate the module first):

```bash
# create Auth module:
$ ng g module auth
# create AuthService with no .spec file:
$ ng g service auth/auth --no-spec
# create Auth route guard with no .spec file:
$ ng g guard auth/auth --no-spec
```

Our `Auth` module supplies the service and route guard we need to manage authentication, but does not have any components. This is also a _shared_ module.

### Dogs Module Architecture

Our app's homepage will be provided by the `DogsModule`. This will be the list of ten most popular dogs in 2016 as ranked by the AKC. Use the following CLI commands to generate the structure for this lazy-loaded page module:

```bash
# create Dogs module:
$ ng g module dogs
# create DogsComponent with inline styles and no .spec file:
$ ng g component dogs/dogs --is --no-spec
```

### Dog Module Architecture

Our app will also have detail pages for each dog listed in the Dogs component so that users can learn more about each breed. Use the following CLI commands to generate the structure for the lazy-loaded `DogModule`:

```bash
# create Dog module:
$ ng g module dog
# create DogComponent with inline styles and no .spec file:
$ ng g component dog/dog --is --no-spec
```

### Comments Module Architecture

Finally, we need to implement the architecture necessary for our Firebase realtime comments. Use the following CLI commands to generate the structure for the `CommentsModule`:

```bash
# create Comments module:
$ ng g module comments
# create Comment model class:
$ ng g class comments/comment
# create CommentsComponent with no .spec file:
$ ng g component comments/comments --no-spec --export=true
# create CommentFormComponent with inline styles and no .spec file:
$ ng g component comments/comments/comment-form --is --no-spec
```

### Environment Configuration

Let's add our configuration information for Auth0 and Firebase to our Angular front end. Open the `environment.ts` file and add:

```js
// src/environments/environment.ts
const FB_PROJECT_ID = '<FIREBASE_PROJECT_ID>';

export const environment = {
  production: false,
  auth: {
    clientId: '<AUTH0_CLIENT_ID>',
    clientDomain: '<AUTH0_DOMAIN>', // e.g., you.auth0.com
    audience: '<AUTH0_API_AUDIENCE>', // e.g., http://localhost:1337/
    redirect: 'http://localhost:4200/callback',
    scope: 'openid profile email'
  },
  firebase: {
    apiKey: '<FIREBASE_API_KEY>',
    authDomain: `${FB_PROJECT_ID}.firebaseapp.com`,
    databaseURL: `https://${FB_PROJECT_ID}.firebaseio.com`,
    projectId: FB_PROJECT_ID,
    storageBucket: `${FB_PROJECT_ID}.appspot.com`,
    messagingSenderId: '<FIREBASE_MESSAGING_SENDER_ID>'
  },
  apiRoot: '<API URL>' // e.g., http://localhost:1337/ (DO include trailing slash)
};
```

Replace placeholders in `<angle brackets>` with your appropriate Auth0, Firebase, and API information. 

You can find your Auth0 configuration in your [Auth0 Dashboard](https://manage.auth0.com) in the settings for the application and API you created for this tutorial.

You can find your Firebase configuration in the [Firebase Console Project Overview](https://console.firebase.google.com/u/0/project/_/overview) after clicking the large icon labeled **Add Firebase to your web app**, as shown below:

<p align="center"><img src="https://cdn.auth0.com/blog/firebase-auth0/firebase-add-to-web-app.png" alt="Add Firebase to your web app"></p>

### Add Loading Image

The last thing we'll do before we begin implementing functionality in our Angular app is add a loading image. Create the following folder: `src/assets/images`.

Then save [this loading SVG image](https://cdn.auth0.com/blog/firebase-auth0/loading.svg) into that folder:

<p align="center"><img src="https://cdn.auth0.com/blog/firebase-auth0/loading.svg" alt="Loading SVG"></p>

## <span id="shared-modules"></span>Implement Shared Modules

Let's set up our modules. We'll import the shared modules (`CoreModule` and `AuthModule`) in our root `AppModule`.

### Core Module

First we'll implement our `CoreModule`. Open the `core.module.ts` file and update to the following code:

```js
// src/app/core/core.module.ts
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { ApiService } from './api.service';
import { LoadingComponent } from './loading.component';
import { ErrorComponent } from './error.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule, // AuthModule is a sibling and can use this without us exporting it
    FormsModule
  ],
  declarations: [
    HeaderComponent,
    LoadingComponent,
    ErrorComponent
  ],
  exports: [
    FormsModule, // Export FormsModule so CommentsModule can use it
    HeaderComponent,
    LoadingComponent,
    ErrorComponent
  ]
})
export class CoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        Title,
        DatePipe,
        ApiService
      ]
    };
  }
}
```

Since this is a shared module, we'll import the other modules, services, and components that we'll need access to _throughout_ our app. 

> **Note:** The `CommonModule` is imported in all modules that are _not_ the root module.

In our `imports` array, we'll add any modules that may be needed by services or components in the `CoreModule`, or that need to be available to _other_ modules in our app. The CLI should have automatically added any generated components to the `declarations` array. The `exports` array should contain any modules or components that we want to make available to other modules.

Note that we have imported `ModuleWithProviders` from `@angular/core`. Using this module, we can create a `forRoot()` method that can be called on import in the root `app.module.ts` when `CoreModule` is imported. This way, we can ensure that any services we add to a `providers` array returned by the `forRoot()` method remain _singletons_ in our application. In this manner, we can avoid unintentional multiple instances if other modules in our app also need to import the `CoreModule`.

### Auth Module

Next let's add some code to our `AuthModule` in the `auth.module.ts` file:

```js
// src/app/auth/auth.module.ts
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { AngularFireAuthModule } from 'angularfire2/auth';

@NgModule({
  imports: [
    CommonModule,
    AngularFireAuthModule
  ]
})
export class AuthModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AuthModule,
      providers: [
        AuthService,
        AuthGuard
      ]
    };
  }
}
```

We'll import `ModuleWithProviders` to implement a `forRoot()` method like we did with our `CoreModule`. Then we'll import our `AuthService` and `AuthGuard`. We also need to import `AngularFireAuthModule` from `angularfire2/auth` so we can secure our Firebase connections in our `AuthService`. The service and guard should then be returned in the `providers` array in the `forRoot()` method.

### Comments Module

Open the `comments.module.ts` file to implement the `CommentsModule` like so:

```js
// src/app/comments/comments.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { environment } from './../../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { CommentsComponent } from './comments/comments.component';
import { CommentFormComponent } from './comments/comment-form/comment-form.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule, // Access FormsModule, Loading, and Error components
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule
  ],
  declarations: [
    CommentsComponent,
    CommentFormComponent
  ],
  exports: [
    CommentsComponent
  ]
})
export class CommentsModule { }
```

We'll need to import the `CoreModule` so we can utilize its exported `FormsModule`, `LoadingComponent`, and `ErrorComponent`. We also need to access our configuration from the `environment.ts` file. Comments use Firebase's Cloud Firestore database, so let's import the `AngularFireModule` and `AngularFirestoreModule` as well as our two components: `CommentsComponent` and `CommentFormComponent`.

When we add `AngularFireModule` to the @NgModule's `imports` array, we'll call its `initializeApp()` method, passing in our Firebase configuration. Both of our components should already be in the `declarations` array, and the `CommentsComponent` should already be added to the `exports` array so that other components from other modules can use it. 

> **Note:** We don't need to export `CommentsFormComponent` because it's a child of `CommentsComponent`.

The `CommentsModule` does not provide any services, so there's no need to implement a `forRoot()` method.

### App Module

Now that our `CoreModule`, `AuthModule`, and `CommentsModule` have been implemented, we need to import them in our root module, the `AppModule` located in the `app.module.ts` file:

```js
// src/app/app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { AppComponent } from './app.component';
import { CallbackComponent } from './callback.component';

@NgModule({
  declarations: [
    AppComponent,
    CallbackComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule.forRoot(),
    AuthModule.forRoot(),
    CommentsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

The `AppComponent` and `CallbackComponent` have already been added automatically by the CLI. When we add our `CoreModule` and `AuthModule` to the `imports` array, we'll call the `forRoot()` method to ensure no extra instances are created for their services. The `CommentsModule` doesn't provide any services, so this is not a concern for that module.

## <span id="routing-lazy-loading"></span>Implement Routing and Lazy Loaded Modules

We have two modules that require routing: the `DogsModule` for the main listing of dogs, and the `DogModule`, which contains the component showing a dog breed's detail page.

### App Routing

First let's implement our app's routing. Open the `app-routing.module.ts` file and add this code:

```js
// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CallbackComponent } from './callback.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: './dogs/dogs.module#DogsModule',
    pathMatch: 'full'
  },
  {
    path: 'dog',
    loadChildren: './dog/dog.module#DogModule',
    canActivate: [
      AuthGuard
    ]
  },
  {
    path: 'callback',
    component: CallbackComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

We'll import our `CallbackComponent` and `AuthGuard`. The remaining routes will be string _references_ to modules rather than imported components using the `loadChildren` property.

We will set the default `''` path to load route children from the `DogsModule`, and the `'dog'` path to load route children from the `DogModule`. The `'dog'` path should also be protected by the `AuthGuard`, which we declare using the `canActivate` property. This can hold an array of route guards should we require more than one. Finally, the `'callback'` route should simply point to the `CallbackComponent`.

### Dogs Module

Let's add some code to the `dogs.module.ts` file:

```js
// src/app/dogs/dogs.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CoreModule } from '../core/core.module';
import { CommentsModule } from '../comments/comments.module';
import { DogsComponent } from './dogs/dogs.component';

const DOGS_ROUTES: Routes = [
  {
    path: '',
    component: DogsComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    RouterModule.forChild(DOGS_ROUTES),
    CommentsModule
  ],
  declarations: [
    DogsComponent
  ]
})
export class DogsModule { }
```

We'll import `Routes` and `RouterModule` in addition to our `CoreModule` and `CommentsModule` (comments will appear on the main dogs listing page).

This module has a child route, so we'll create a constant that contains an array to hold our route object. The only child route we'll need inherits the `''` path from `app-routing.module.ts`, so its path should also be `''`. It will load the `DogsComponent`. In our `imports` array, we'll pass our `DOGS_ROUTES` constant to the `RouterModule`'s `forChild()` method.

### Dog Module

The `DogModule` works similarly to the `DogsModule` above. Open `dog.module.ts` and add the following:

```js
// src/app/dog/dog.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CoreModule } from '../core/core.module';
import { DogComponent } from './dog/dog.component';

const DOG_ROUTES: Routes = [
  {
    path: ':rank',
    component: DogComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    RouterModule.forChild(DOG_ROUTES)
  ],
  declarations: [
    DogComponent
  ]
})
export class DogModule { }
```

One difference between this module and the `DogsModule` is that our `DOG_ROUTES` has a path of `:rank`. This way, the route for any specific dog's details is passed as a URL segment matching the dog's rank in our list of top ten dog breeds, like so:

```text
http://localhost:4200/dog/3
```

Another difference is that we will _not_ import the `CommentsModule`. However, we could add comments to dog details in the future if we wished.

Our app's architecture and routing are now complete! The app should successfully compile and display in the browser, with lazy loading functioning properly to load shared code and the code for the specific route requested.

We're now ready to implement our application's logic.

## <span id="loading-error-components"></span>Loading and Error Components

The loading and error components are basic, core UI elements that can be used in many different places in our app. Let's set them up now.

### Loading Component

The `LoadingComponent` should simply show a loading image. (Recall that we already saved one when we set up the architecture of our app.) However, it should be capable of displaying the image large and centered, _or_ small and inline.

Open the `loading.component.ts` file and add:

```js
// src/app/core/loading.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  template: `
    <div [ngClass]="{'inline': inline, 'text-center': !inline, 'py-2': !inline }">
      <img src="/assets/images/loading.svg">
    </div>
  `,
  styles: [`
    .inline {
      display: inline-block;
    }
    img {
      height: 80px;
      width: 80px;
    }
    .inline img {
      height: 24px;
      width: 24px;
    }
  `]
})
export class LoadingComponent {
  @Input() inline: boolean;
}
```

Using the [`@Input()` decorator](https://angular.io/guide/component-interaction#pass-data-from-parent-to-child-with-input-binding), we can pass information into the component from its parent, telling it whether we should display the component inline or not. We'll use the [NgClass directive](https://angular.io/api/common/NgClass) (`[ngClass]`) in our template to conditionally add the appropriate styles for the display we want. Displaying this component in another template will look like this:

{% highlight html %}
{% raw %}
<!-- Large, full width, centered: -->
<app-loading></app-loading>
<!-- Inline: -->
<app-loading inline="true"></app-loading>
{% endraw %}
{% endhighlight %}

### Error Component

Next let's quickly implement our `ErrorComponent`. This component will display a simple error message if shown. Open the `error.component.ts` file and add:

```js
// src/app/core/error.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-error',
  template: `
    <p class="alert alert-danger">
      <strong>Error:</strong> There was an error retrieving data.
    </p>
  `
})
export class ErrorComponent {
}
```

## <span id="auth-logic"></span>Authentication Logic

Now let's implement the code necessary to get our `AuthModule`'s features working. We'll need the authentication service in order to build out the header in the `CoreModule`, so it makes sense to start here. We've already installed the necessary dependencies (Auth0 and FirebaseAuth), so let's begin.

### Authentication Service

Before we write any code, we'll determine what the requirements are for this service. We need to:

* Create a `login()` method that will allow users to authenticate using Auth0
* If user was prompted to log in by attempting to access a protected route, make sure they can be redirected to that route after successful authentication
* Get the user's profile information and set up their session
* Establish a way for the app to know whether the user is logged in or not
* Request a Firebase custom token from the API with authorization from the Auth0 access token
* If successful in acquiring a Firebase token, sign into Firebase using the returned token and establish a way for the app to know whether the user is logged into Firebase or not
* Custom tokens minted by Firebase expire after an hour, so we should set up a way to automatically renew tokens that expire
* Create a `logout()` method to clear session and sign out of Firebase 

Open the `auth.service.ts` file that we generated earlier. 

For tutorial brevity, please **check out the full code in the [GitHub repo's `auth.service.ts` file here](https://github.com/auth0-blog/angular-firebase/blob/master/src/app/auth/auth.service.ts)**.

There's a lot going on, so let's go through it step by step.

First, as always, we'll import our dependencies. This includes our `environment` configuration we set up earlier to provide our Auth0, Firebase, and API settings, as well as `auth0` and `firebase` libraries, `AngularFireAuth`, `HttpClient` to call the API to get a custom Firebase token, and the necessary RxJS imports.

You can refer to the code comments for descriptions of the private and public members of our `AuthService` class.

Next is our constructor function, where we'll make `Router`, `AngularFireAuth`, and `HttpClient` available for use in our class.

The `login()` method looks like this:

```typescript
  login(redirect?: string) {
    // Set redirect after login
    const _redirect = redirect ? redirect : this.router.url;
    localStorage.setItem('auth_redirect', _redirect);
    // Auth0 authorize request
    this._auth0.authorize();
  }
```

If a `redirect` URL segment is passed into the method, we'll save it in local storage. If no redirect is passed, we'll simply store the current URL. We'll then use the `_auth0` instance we created in our members and call [Auth0's `authorize()` method](https://auth0.com/docs/libraries/auth0js/v9#webauth-authorize-) to go to the [Auth0 login page](https://auth0.com/docs/hosted-pages/login) so our user can authenticate.

The next three methods are `handleLoginCallback()`, `getUserInfo()`, and `_setSession()`:

```typescript
  handleLoginCallback() {
    this.loading = true;
    // When Auth0 hash parsed, get profile
    this._auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken) {
        window.location.hash = '';
        // Store access token
        this.accessToken = authResult.accessToken;
        // Get user info: set up session, get Firebase token
        this.getUserInfo(authResult);
      } else if (err) {
        this.router.navigate(['/']);
        this.loading = false;
        console.error(`Error authenticating: ${err.error}`);
      }
    });
  }

  getUserInfo(authResult) {
    // Use access token to retrieve user's profile and set session
    this._auth0.client.userInfo(this.accessToken, (err, profile) => {
      if (profile) {
        this._setSession(authResult, profile);
      } else if (err) {
        console.warn(`Error retrieving profile: ${err.error}`);
      }
    });
  }

  private _setSession(authResult, profile) {
    // Set tokens and expiration in localStorage
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + Date.now());
    localStorage.setItem('expires_at', expiresAt);
    this.userProfile = profile;
    // Session set; set loggedIn and loading
    this.loggedIn = true;
    this.loading = false;
    // Get Firebase token
    this._getFirebaseToken();
    // Redirect to desired route
    this.router.navigateByUrl(localStorage.getItem('auth_redirect'));
```

These methods are fairly self-explanatory: they use Auth0 methods [`parseHash()` and `userInfo()` to extract authentication results and get the user's profile](https://auth0.com/docs/libraries/auth0js/v9#extract-the-authresult-and-get-user-info). We'll also set our service's properties to store necessary state (such as whether the user's authentication state is loading and if they're logged in or not), handle errors, save data to our service and local storage, and redirect to the appropriate route.

We are also going to use the authentication result's access token to authorize an HTTP request to our API to get a Firebase token. This is done with the `_getFirebaseToken()` and `_firebaseAuth()` methods:

```typescript
  private _getFirebaseToken() {
    // Prompt for login if no access token
    if (!this.accessToken) {
      this.login();
    }
    const getToken$ = () => {
      return this.http
        .get(`${environment.apiRoot}auth/firebase`, {
          headers: new HttpHeaders().set('Authorization', `Bearer ${this.accessToken}`)
        });
    };
    this.firebaseSub = getToken$().subscribe(
      res => this._firebaseAuth(res),
      err => console.error(`An error occurred fetching Firebase token: ${err.message}`)
    );
  }

  private _firebaseAuth(tokenObj) {
    this.afAuth.auth.signInWithCustomToken(tokenObj.firebaseToken)
      .then(res => {
        this.loggedInFirebase = true;
        // Schedule token renewal
        this.scheduleFirebaseRenewal();
        console.log('Successfully authenticated with Firebase!');
      })
      .catch(err => {
        const errorCode = err.code;
        const errorMessage = err.message;
        console.error(`${errorCode} Could not log into Firebase: ${errorMessage}`);
        this.loggedInFirebase = false;
      });
  }
```

We'll create a `getToken$` observable from the `GET` request to our API's `/auth/firebase` endpoint and subscribe to it. If successful, we'll pass the returned object with the custom Firebase token to the `_firebaseAuth()` method, which will authenticate with Firebase using [Firebase's `signInWithCustomToken()` method](https://firebase.google.com/docs/auth/web/custom-auth). This method returns a promise, and when the promise is resolved, we can tell our app that Firebase login was successful. We can also schedule Firebase token renewal (we'll look at this shortly). We'll handle any errors appropriately.

Our custom Firebase token will expire in `3600` seconds (1 hour). This is only _half_ as long as our default Auth0 access token lifetime (which is `7200` seconds, or 2 hours). To avoid having our users lose access to Firebase unexpectedly in the middle of a session, we'll set up automatic Firebase token renewal with two methods: `scheduleFirebaseRenewal()` and `unscheduleFirebaseRenewal()`.

> **Note:** You can also implement automatic session renewal with Auth0 in a similar manner using the [`checkSession()` method](https://auth0.com/docs/libraries/auth0js/v9#using-checksession-to-acquire-new-tokens). In addition, you could use `checkSession()` to restore an unexpired authentication session in the constructor if a user navigates away from the app and then returns later. We won't cover that in this tutorial, but this is something you should try on your own!

```typescript
  scheduleFirebaseRenewal() {
    // If user isn't authenticated, check for Firebase subscription
    // and unsubscribe, then return (don't schedule renewal)
    if (!this.loggedInFirebase) {
      if (this.firebaseSub) {
        this.firebaseSub.unsubscribe();
      }
      return;
    }
    // Unsubscribe from previous expiration observable
    this.unscheduleFirebaseRenewal();
    // Create and subscribe to expiration observable
    // Custom Firebase tokens minted by Firebase
    // expire after 3600 seconds (1 hour)
    const expiresAt = new Date().getTime() + (3600 * 1000);
    const expiresIn$ = Observable.of(expiresAt)
      .pipe(
        mergeMap(
          expires => {
            const now = Date.now();
            // Use timer to track delay until expiration
            // to run the refresh at the proper time
            return Observable.timer(Math.max(1, expires - now));
          }
        )
      );

    this.refreshFirebaseSub = expiresIn$
      .subscribe(
        () => {
          console.log('Firebase token expired; fetching a new one');
          this._getFirebaseToken();
        }
      );
  }

  unscheduleFirebaseRenewal() {
    if (this.refreshFirebaseSub) {
      this.refreshFirebaseSub.unsubscribe();
    }
  }
```

To schedule automatic token renewal, we'll create a timer observable that counts down to the token's expiration time. We can subscribe to the `expiresIn$` observable and then call our `_getFirebaseToken()` method again to acquire a new token. The  `signInWithCustomToken()` angularfire2 auth method returns a promise. When the promise resolves, `scheduleFirebaseRenewal()` is called, which in turn ensures that the token will continue to be renewed as long as the user is logged into our app.

We'll also need to be able to unsubscribe from token renewal, so we'll create a method for that as well.

Finally, the last two methods in our authentication service are `logout()` and `tokenValid()`:

```typescript
  logout() {
    // Ensure all auth items removed
    localStorage.removeItem('expires_at');
    localStorage.removeItem('auth_redirect');
    this.accessToken = undefined;
    this.userProfile = undefined;
    this.loggedIn = false;
    // Sign out of Firebase
    this.loggedInFirebase = false;
    this.afAuth.auth.signOut();
    // Return to homepage
    this.router.navigate(['/']);
  }

  get tokenValid(): boolean {
    // Check if current time is past access token's expiration
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return Date.now() < expiresAt;
  }
```

The `logout()` method removes all session information from local storage and from our service, signs out of Firebase Auth, and redirects the user back to the homepage (the only public route in our app).

The `tokenValid` accessor method checks whether the Auth0 access token is expired or not by comparing its expiration to the current datetime. This can be useful for determining if the user needs a new access token; we won't cover that in this tutorial, but you may want to explore Auth0 session renewal further on your own.

That's it for our `AuthService`!

### Callback Component

Recall that we created a `CallbackComponent` in our root module. In addition, we set our `environment`'s Auth0 `redirect` to the callback component's route. That means that when the user logs in with Auth0, they will return to our app at the `/callback` route with the authentication hash appended to the URI.

We created our `AuthService` with methods to handle authentication and set sessions, but currently these methods aren't being called from anywhere. The callback component is the appropriate place for this code to execute.

Open the `callback.component.ts` file and add:

```typescript
// src/app/callback.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-callback',
  template: `
    <app-loading></app-loading>
  `
})
export class CallbackComponent implements OnInit {

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.auth.handleLoginCallback();
  }

}
```

All our callback component needs to do is show the `LoadingComponent` while the `AuthService`'s `handleAuth()` method executes. The `handleLoginCallback()` method will parse the authentication hash, get the user's profile info, set their session, and redirect to the appropriate route in the app.

### Auth Guard

Now that we've implemented the authentication service, we have access to the properties and methods necessary to effectively use authentication state throughout our Angular application. Let's use this logic to implement our `AuthGuard` for protecting routes.

Using the Angular CLI should have generated some helpful boilerplate code, and we only have to make a few minor changes to ensure that our guarded routes are only accessible to authenticated users.

> **Note:** It's important to note that route guards _on their own_ do not confer sufficient security. You should always secure your API endpoints, as we have done in this tutorial, and never rely _solely_ on the client side to authorize access to protected data.

Open the `auth.guard.ts` file and make the following changes:

```typescript
// src/app/auth/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.auth.loggedIn) {
      return true;
    } else {
      // Send guarded route to redirect after logging in
      this.auth.login(state.url);
      return false;
    }
  }
}
```

We'll import `AuthService` add a `constructor()` function to make the service available in our route guard. The `canActivate()` method should return `true` if conditions are met to grant access to a route, and `false` if not. In our case, the user should be able to access the guarded route if they are authenticated. The `loggedIn` property from our `AuthService` provides this information.

If the user does not have a valid token, we'll prompt them to log in. We want them to be redirected back to the guarded route after they authenticate, so we'll call the `login()` method and pass the guarded route (`state.url`) as the redirect parameter.

> **Note:** Remember that we set up our entire app's architecture and routing earlier. We already added `AuthGuard` to our dog details route, so it should be protected now that we've implemented the guard.

## <span id="core-logic"></span>Core Logic

The last thing we'll do in this section of our tutorial is build out the remaining components and services that belong to our `CoreModule`. We've already taken care of the `LoadingComponent` and `ErrorComponent`, so let's move on to the header.

### Header Component

The header will use methods and logic from our authentication service to show login and logout buttons as well as display the user's name and picture if they're authenticated. Open the `header.component.ts` file and add:

```js
// src/app/core/header/header.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [`
    img {
      border-radius: 100px;
      width: 30px;
    }
    .loading { line-height: 31px; }
    .home-link { color: #212529; }
    .home-link:hover { text-decoration: none; }
  `]
})
export class HeaderComponent {

  constructor(public auth: AuthService) {}

}
```

We'll add a few simple styles and import our `AuthService` to make its members publicly available to our header component's template.

Next open the `header.component.html` file and add:

{% highlight html %}
{% raw %}
<!-- src/app/core/header/header.component.html -->
<nav class="nav justify-content-between mt-2 mx-2 mb-3">
  <div class="d-flex align-items-center">
    <strong class="mr-1"><a routerLink="/" class="home-link">Popular Dogs ❤</a></strong>
  </div>
  <div class="ml-3">
    <small *ngIf="auth.loading" class="loading">
      Logging in...
    </small>
    <ng-template [ngIf]="!auth.loading">
      <button
        *ngIf="!auth.loggedIn"
        class="btn btn-primary btn-sm"
        (click)="auth.login()">Log In</button>
      <span *ngIf="auth.loggedIn">
        <img [src]="auth.userProfile.picture">
        <small>{{ auth.userProfile.name }}</small>
        <button
          class="btn btn-danger btn-sm"
          (click)="auth.logout()">Log Out</button>
      </span>
    </ng-template>
  </div>
</nav>
{% endraw %}
{% endhighlight %}

The header now shows:

* The name of our app ("Popular Dogs") with a link to the `/` route
* A login button if the user is not authenticated
* A "Logging in..." message if the user is currently authenticating
* The user's picture, name, and a logout button if the user is authenticated

Now that we have our header component built, we need to display it in our app.

Open the `app.component.html` file and add:

{% highlight html %}
{% raw %}
<!-- src/app/app.component.html -->
<app-header></app-header>
<div class="container">
  <router-outlet></router-outlet>
</div>
{% endraw %}
{% endhighlight %}

The header component will now be displayed in our app with the current routed component showing beneath it. Check it out in the browser and try logging in!

### Dog and DogDetail Models

Let's implement our `dog.ts` and `dog-detail.ts` [interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html). These are models that specify types for the _shape_ of values that we'll use in our app. Using models ensures that our data has the structure that we expect.

We'll start with the `dog.ts` interface:

```typescript
// src/app/core/dog.ts
export interface Dog {
  breed: string;
  rank: number;
  image: string;
}
```

Next let's implement the `dog-detail.ts` interface:

```typescript
// src/app/core/dog-detail.ts
export interface DogDetail {
  breed: string;
  rank: number;
  description: string;
  personality: string;
  energy: string;
  group: string;
  image: string;
  link: string;
}
```

### API Service

With our <a href="#node-api" target="_self">Node API</a> and models in place, we're ready to implement the service that will call our API in the Angular front end.

Open the `api.service.ts` file and add this code:

```typescript
// src/app/core/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { AuthService } from './../auth/auth.service';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import 'rxjs/add/observable/throw';
import { Dog } from './../core/dog';
import { DogDetail } from './../core/dog-detail';

@Injectable()
export class ApiService {
  private _API = `${environment.apiRoot}api`;

  constructor(
    private http: HttpClient,
    private auth: AuthService) { }

  getDogs$(): Observable<Dog[]> {
    return this.http
      .get(`${this._API}/dogs`)
      .pipe(
        catchError((err, caught) => this._onError(err, caught))
      );
  }

  getDogByRank$(rank: number): Observable<DogDetail> {
    return this.http
      .get(`${this._API}/dog/${rank}`, {
        headers: new HttpHeaders().set('Authorization', `Bearer ${this.auth.accessToken}`)
      })
      .pipe(
        catchError((err, caught) => this._onError(err, caught))
      );
  }

  private _onError(err, caught) {
    let errorMsg = 'Error: Unable to complete request.';
    if (err instanceof HttpErrorResponse) {
      errorMsg = err.message;
      if (err.status === 401 || errorMsg.indexOf('No JWT') > -1 || errorMsg.indexOf('Unauthorized') > -1) {
        this.auth.login();
      }
    }
    return Observable.throw(errorMsg);
  }

}
```

We'll add the necessary imports to handle HTTP in Angular along with the environment configuration, `AuthService`, RxJS imports, and `Dog` and `DogDetail` models we just created. We'll set up private members for the `_API` and to store the `_accessToken`, then make the `HttpClient` and `AuthService` available privately to our API service.

Our API methods will return observables that emit one value when the API is either called successfully or an error is thrown. The `getDogs$()` stream returns an observable with an array of objects that are `Dog`-shaped. The `getDogByRank$(rank)` stream requires a numeric rank to be passed in, and will then call the API to retrieve the requested `Dog`'s data. This API call will send an `Authorization` header containing the authenticated user's access token.

Finally, we'll create an error handler that checks for errors and assesses if the user is not authenticated and prompts for login if so. The observable will then terminate with an error.

> **Note:** We are using arrow functions to pass parameters to our handler functions for [RxJS pipeable operators](https://github.com/ReactiveX/rxjs/blob/master/doc/pipeable-operators.md) (such as `catchError`). This is done to preserve the scope of the `this` keyword (see the "No separate `this`" section of the [MDN arrow functions documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)).

## <span id="next-steps"></span>Next Steps

We've already accomplished a lot in the first part of our tutorial series. In the next part, we'll finish our Popular Dogs application. In the meantime, here are some additional resources that you may want to check out:

### Angular Testing Resources

If you're interested in learning more about testing in Angular, which we did not cover in this tutorial, please check out some of the following resources:

* [Angular - Testing](https://angular.io/guide/testing)
* [Angular Testing In Depth: Services](https://auth0.com/blog/angular-2-testing-in-depth-services/)
* [Angular Testing In Depth: HTTP Services](https://auth0.com/blog/angular-testing-in-depth-http-services/)
* [Angular Testing In Depth: Components](https://auth0.com/blog/angular-testing-in-depth-components)
* [How to correctly test Angular 4 application with Auth0 integration](https://stackoverflow.com/questions/43784314/how-to-correctly-test-angular4-application-with-auth0-integration)

### Additional Resources

You can find more resources on Firebase, Auth0, and Angular here:

* [Firebase documentation](https://firebase.google.com/docs/)
* [Cloud Firestore documentation](https://firebase.google.com/docs/firestore/)
* [angularfire2 documentation](https://github.com/angular/angularfire2/tree/master/docs)
* [Auth0 documentation](https://auth0.com/docs)
* [Auth0 pricing and features](https://auth0.com/pricing)
* [Angular documentation](https://angular.io/docs)
* [Angular CLI](https://github.com/angular/angular-cli)
* [Angular Cheatsheet](https://angular.io/guide/cheatsheet)

In the next installment of our Auth0 + Firebase + Angular tutorial, we'll **display data from our dogs API** and learn how to **set up and implement realtime comments with Firebase**! Check out [How to Authenticate Firebase and Angular with Auth0: Part 2 - Async and Realtime](https://auth0.com/blog/how-to-authenticate-firebase-and-angular-with-auth0-part-2/) now.