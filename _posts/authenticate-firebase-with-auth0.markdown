---
layout: post
title: "Title Should be Less Than 56 characters"
description: "Description goes here and must be less than 156 characters."
longdescription: "Long description should be between 230-320 characters."
date: 2017-12-20 8:30
category: Technical guide, Firebase, Angular
banner:
  text: "Auth0 makes it easy to add authentication to your Angular application."
author:
  name: "Kim Maida"
  url: "https://twitter.com/KimMaida"
  mail: "kim.maida@auth0.com"
  avatar: "https://secure.gravatar.com/avatar/a208cda2b3b21dc8d7896507f5ff60fc"
design:
  image: https://cdn.auth0.com/blog/...
  bg_color: "#"
tags:
- firebase
- angular
- tokens
- node
- api
- angularfire2
- angularfire
- real-time-database
- rtdb
- real-time
- async
- auth0
- authentication
- centralized-login
related:
- date-postname
- date-postname
---

**TL;DR:** A brief synopsis that includes link to a [github repo](http://www.github.com/).

---

## Introduction

In this series of tutorials, we'll learn how to build an application that secures a Node backend and an Angular front-end with [Auth0](https://auth0.com) authentication. Our server and app will also authenticate a [Firebase](https://firebase.google.com) database with custom tokens so that users can leave comments in realtime in a secure manner after logging in with Auth0.

### What is Firebase?

Firebase is 

### Choosing Auth0+Firebase Authentication vs. Basic Firebase Auth

One great question that you might be asking is: why would we implement Auth0 with custom tokens in Firebase instead of sticking with [Firebase's built-in authentication](https://firebase.google.com/docs/auth/) by itself?

Firstly, there is an important distinction to make here. Using Auth0 to secure Firebase does not mean you are _not_ using Firebase auth. Firebase has a [custom auth approach](https://firebase.google.com/docs/auth/web/custom-auth) that allows developers to integrate their preferred authentication solution _with_ Firebase auth. This approach enables developers to implement Firebase auth so that it functions seamlessly with proprietary systems or other authentication providers.

There are many potential reasons we might want to integrate Auth0 with Firebase authentication. Alternatively, there are scenarios where using basic Firebase auth by itself could suffice. Let's explore.

You can use **Firebase's built-in authentication by itself** if you:

* Only want to authenticate Firebase RTDBs or Firestore and have no need to authenticate additional backends
* Only need a small handful of login options and do not need enterprise identity providers, integration with your own user storage databases, etc.
* Do not need robust user management, profile enrichment, etc. and are comfortable [managing users strictly through an API](https://firebase.google.com/docs/auth/web/manage-users)
* Have no need to customize authentication flows
* Do not need to adhere to compliance regulations regarding the storage of user data

You should consider **Auth0 with a custom Firebase token** if you:

* Already have Auth0 implemented and want to add realtime capabilities to your app
* Need to easily use issued tokens to [secure a backend](https://auth0.com/docs/apis) that is _not_ provided by Firebase
* Need to integrate [social identity providers](https://auth0.com/docs/identityproviders#social) beyond just Google, Facebook, Twitter, and GitHub
* Need to integrate [enterprise identity providers](https://auth0.com/docs/identityproviders#enterprise), such as Active Directory, LDAP, ADFS, SAMLP, etc.
* Need a [customized authentication flow](https://auth0.com/docs/rules/current)
* Need robust [user management with APIs _and_ an admin-friendly dashboard](https://auth0.com/docs/users)
* Want to be able to dynamically [enrich user profiles](https://auth0.com/docs/monitoring/track-signups-enrich-user-profile-generate-leads)
* Want features like customizable [passwordless login](https://auth0.com/docs/connections/passwordless), [multifactor authentication](https://auth0.com/docs/multifactor-authentication), [breached password security](https://auth0.com/docs/anomaly-detection/breached-passwords), [anomaly detection](https://auth0.com/docs/anomaly-detection), etc.
* Must adhere to [compliance regulations](https://auth0.com/docs/compliance) such as HIPAA, GDPR, SOC2, etc.

Essentially, Firebase's basic authentication providers should suffice if you have a very simple app with bare-bones authentication needs and are only using Firebase databases. However, should you need more than that, [Firebase offers a great way to use their services _with_ other authentication solutions](https://firebase.google.com/docs/admin/setup). This is a much more realistic scenario that many developers will be faced with, so we'll explore it in detail here.

## What We'll Build

We're going to build a Node.js API secured with Auth0 that mints custom Firebase tokens and also returns data on ten different dog breeds.

We'll also build an Angular front-end app called "Popular Dogs" that displays information about the ten most popular dogs in 2016, ranked by public popularity by the American Kennel Club (AKC). Our app will be secured by Auth0, call the Node API to fetch dog data, and call the API to acquire Firebase tokens to authorize users to add and delete comments in realtime. The app will use shared modules as well as implement lazy loading.

![Angular Firebase app with Auth0 custom tokens](https://cdn.auth0.com/blog/angular-firebase/dogs.jpg)

To implement the app, you will need the following:

* Angular CLI
* A free Auth0 account with a Client and an API configured
* A free Firebase project with a service account

Let's get started!

## Angular CLI

Make sure you have [Node.js with NPM](https://nodejs.org) installed on your local machine. Run the following command to install the [Angular CLI](https://github.com/angular/angular-cli) globally:

```bash
$ npm install -g @angular/cli@latest
```

We will generate our Angular app and nearly all of its architecture using the CLI.

## Auth0 Client and API

You'll need an [Auth0](https://auth0.com) account to manage authentication. You can <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">sign up for a free account here</a>. Next, set up an Auth0 client app and API so Auth0 can interface with the Angular app and Node API.

![Auth0 centralized login screen](https://cdn.auth0.com/blog/resources/auth0-centralized-login.jpg)

### Set Up an Auth0 Client

1. Go to your [**Auth0 Dashboard**](https://manage.auth0.com/#/) and click the "[create a new client](https://manage.auth0.com/#/clients/create)" button.
2. Name your new app (something like `angular-firebase`) and select "Single Page Web Applications".
3. In the **Settings** for your new Auth0 client app, add `http://localhost:4200/callback` to the **Allowed Callback URLs**.
4. Enable the toggle for **Use Auth0 instead of the IdP to do Single Sign On**. 
5. At the bottom of the **Settings** section, click "Show Advanced Settings". Choose the **OAuth** tab and verify that the **JsonWebToken Signature Algorithm** is set to `RS256`.
6. If you'd like, you can [set up some social connections](https://manage.auth0.com/#/connections/social). You can then enable them for your app in the **Client** options under the **Connections** tab. The example shown in the screenshot above utilizes username/password database, Facebook, Google, and Twitter. For production, make sure you set up your own social keys and do not leave social connections set to use Auth0 dev keys.

### Set Up an Auth0 API

1. Go to [**APIs**](https://manage.auth0.com/#/apis) in your Auth0 dashboard and click on the "Create API" button. Enter a name for the API, such as `Firebase Dogs API`. Set the **Identifier** to your API endpoint URL. In this example, this is `http://localhost:1337/`. The **Signing Algorithm** should be `RS256`.
2. You can consult the Node.js example under the **Quick Start** tab in your new API's settings. In the next steps, we'll implement our Node API in this fashion, using [Express](https://expressjs.com/), [express-jwt](https://github.com/auth0/express-jwt), and [jwks-rsa](https://github.com/auth0/node-jwks-rsa).

We're now ready to implement Auth0 authentication on both our Angular client and Node backend API.

## Firebase Project with Service Account

Next you will need a free [Firebase](https://firebase.google.com) project.

### Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com) and sign in with your Google account. 
2. Click on **Add Project**.
3. In the dialog that pops up, give your project a name (such as `Angular Firebase Auth0`). A project ID will be generated based on the name you chose. You can then select your country/region.
4. Click the **Create Project** button.

### Generate an Admin SDK Key

In order to mint custom Firebase tokens, you'll need access to the Firebase Admin SDK. To obtain access, you must create a service account in your new Firebase project.

Click on the gear wheel icon next to your Project Overview in the Firebase console sidebar and select **Project Settings** from the menu that appears:

<p align="center"><img src="https://cdn.auth0.com/blog/firebase-auth0/firebase-project-settings.png"></p>

In the settings view, click the [Service Accounts](https://console.firebase.google.com/u/0/project/_/settings/serviceaccounts/adminsdk) tab. The **Firebase Admin SDK** UI will appear, showing a configuration code snippet. Node.js is selected by default. This is the technology we want, and we will implement it in our Node API. Click on the **Generate New Private Key** button.

A dialog will appear warning you to store your private key confidentially. We will take care never to check this key into a public repository. Click on the **Generate Key** button to save the key as a `.json` file. We will add this file to our Node API shortly.

## Node API

The Node.js API for this tutorial can be found at the [firebase-auth0-nodeserver GitHub repo](https://github.com/auth0-blog/firebase-auth0-nodeserver).

### Node API File Structure

Let's learn how to build this API. Create a new folder and the following file structure:

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

Now move the Firebase Admin SDK `.json` key file you downloaded earlier into the `firebase/` folder. We will take care to make sure the folder is checked in, but its _contents_ are never pushed to a repo using the `firebase/.gitignore` like so:

```bash
# firebase/.gitignore
*
*/
!.gitignore
```

This `.gitignore` configuration ensures that Git will ignore any files and folders inside the `firebase/` directory _except_ for the `.gitignore` file itself. This allows us to commit an (essentially) empty folder.

Next let's add the code for the main directory's `.gitignore`:

```bash
# .gitignore
config.js
node_modules
```

### Dogs JSON Data

Next we'll add the data for ten dog breeds. For brevity, you can simply [copy and paste this data](https://raw.githubusercontent.com/auth0-blog/firebase-auth0-nodeserver/master/dogs.json) into your `dogs.json` file.

### Dependencies

Let's add our `package.json` file like so:

```json
{
  "name": "firebase-auth0-nodeserver",
  "version": "0.0.0",
  "description": "Node.js server that authenticates with an Auth0 access token and returns a Firebase auth token.",
  "repository": "https://github.com/auth0-blog/firebase-auth0-nodeserver",
  "main": "server.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
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

We'll need `body-parser`, `cors`, and `express` to serve our API endpoints. Authentication will rely on `express-jwt` and `jwks-rsa`, while Firebase token minting is implemented with `firebase-admin`.

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

> **Note:** Notice that this is the identifier we set up in Auth0 as our API.

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
      .then(customToken => {
        // Response must be an object or Firebase errors
        res.json({firebaseToken: customToken});
      })
      .catch(err => {
        res.status(500).send({
          message: 'Something went wrong acquiring a Firebase token.',
          error: err
        });
      });
  });

  // Set up dogs JSON data for API
  const dogs = require('./dogs.json');
  const getDogsBasic = () => {
    let dogsBasicArr = [];
    dogs.forEach(dog => {
      const newDog = {
        rank: dog.rank,
        breed: dog.breed,
        image: dog.image
      };
      dogsBasicArr.push(newDog);
    });
    return dogsBasicArr;
  }
  const dogsBasic = getDogsBasic();

  // GET dogs (public)
  app.get('/api/dogs', (req, res) => {
    res.send(dogsBasic);
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
* Provides a secure `GET`* endpoint that returns a dog's detailed data, requested by rank

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

## Set Up Angular App

Now it's time to create our Angular app and set up some additional dependencies.

### Create New Angular App

You should have already installed the [Angular CLI](https://github.com/angular/angular-cli) earlier. We can now use the CLI to generate our project and its architecture. To create a new app, choose a containing folder and then run the following command:

```bash
$ ng new angular-firebase --routing --skip-tests
```

The `--routing` flag implements an app with a routing module and `--skip-tests` implements the root component with no `.spec.ts` file.

> **Note:** For brevity, we are not going to cover testing in this article. If you'd like to learn more about testing in Angular, check out the tutorial's conclusion for more resources.

### Install Front-End Dependencies

Now let's install our front-end dependencies:

```bash
$ cd angular-firebase
$ npm install --save auth0-js@latest firebase@latest angularfire2@latest
```

We will need the [`auth0-js` library](https://github.com/auth0/auth0.js) to implement Auth0 authentication in our Angular app. We'll also need the [`firebase` JS SDK](https://github.com/firebase/firebase-js-sdk) and the [`angularfire2` Angular Firebase library](https://github.com/angular/angularfire2/) to implement our realtime comments with Firebase.

### Serve the Angular App

You can serve the Angular app with the following command:

```bash
$ ng serve
```

The app will run in the browser at [http://localhost:4200](http://localhost:4200).

## Angular App Architecture

We're going to use the Angular CLI to generate the complete architecture for our app upfront. This way, we can make sure that our modules are functioning properly before we implement our logic and templates.

Our app is going to use a modular approach with lazy loading. The sample app in this tutorial is small, but we want to build it in a scalable, real-world manner.

### Root Module

The root module has already been created when the Angular app was generated with the `ng new` command. The root module lives at `/src/app/app.module.ts`. Any components we generate in the root of our Angular app without a subdirectory specified will be imported in our root module.

Let's create a component now:

```bash
# create CallbackComponent:
$ ng g component callback --is --it --flat --no-spec
```

This command generates (`g`) a `CallbackComponent` file with inline styles (`--is`), an inline template (`--it`), no containing folder (`--flat`), and no `.spec` test file (`--no-spec`).

### Core Module Architecture

Next we'll create the `CoreModule` and its components and services. This is a shared module. From the root of your Angular project folder, run the following CLI commands. Make sure you run the `ng g module core` command _first_, like so:

```bash
# create Core module:
$ ng g module core
# create API service with no .spec file:
$ ng g service core/api --no-spec
# create HeaderComponent with inline styles and no .spec file:
$ ng g component core/header --is --no-spec
# create LoadingComponent with inline styles, inline template, no container, and no .spec file:
$ ng g component core/loading --is --it --flat --no-spec
# create Dog type interface:
$ ng g interface core/dog
# create DogDetail type interface:
$ ng g interface core/dog-detail
```

Creating the module first ensures that components created in that module's folder will then be imported automatically in that parent module instead of the app's root module.

This is the basic architecture for the _shared_ core services, components, and models that our app will need access to.

### Auth Module Architecture

Next we'll create our `AuthModule`. Execute the following CLI commands (again, making sure to generate the module first):

```bash
# create Auth module:
$ ng g module auth
# create AuthService with no .spec file:
$ ng g service auth/auth --no-spec
# create auth route guard with no .spec file:
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
# create CommentsComponent with inline styles and no .spec file:
$ ng g component comments/comments --is --no-spec
# create CommentFormComponent with inline styles and no .spec file:
$ ng g component comments/comments/comment-form --is --no-spec
```

### Environment Configuration

Let's add our configuration information for Auth0 and Firebase to our Angular front-end. Open the `/src/environments/environment.ts` file and add:

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
  }
};
```

Replace placeholders in `<angle brackets>` with your appropriate Auth0 and Firebase credentials. 

You can find your Auth0 configuration in your [Auth0 Dashboard - Clients](https://manage.auth0.com) in the settings for the Client and API you created for this tutorial.

You can find your Firebase configuration in the [Firebase Console Project Overview](https://console.firebase.google.com/u/0/project/_/overview), after clicking the large icon labeled **Add Firebase to your web app**, as shown below:

<p align="center"><img src="https://cdn.auth0.com/blog/firebase-auth0/firebase-add-to-web-app.png" alt="Add Firebase to your web app"></p>

### Add Loading Image

The last thing we'll do before we begin implementing functionality in our Angular app is add a loading image. Create the following folder: `/src/assets/images`

Then save [this loading SVG image](https://github.com/auth0-blog/angular-firebase/blob/master/src/assets/images/loading.svg) into that folder.

## Implement Shared Modules

Let's set up our modules. We'll import the shared modules (`CoreModule` and `AuthModule`) in our root `AppModule`.

### Core Module

First we'll implement our `CoreModule`. Open the `core.module.ts` file and add the following code:

```js
// src/ap/core/core.module.ts
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

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule, // AuthModule is a sibling and can use this without us exporting it
    FormsModule
  ],
  declarations: [
    HeaderComponent,
    LoadingComponent
  ],
  exports: [
    FormsModule, // Export FormsModule so CommentsModule can use it
    HeaderComponent,
    LoadingComponent
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

In our `imports` array, we'll add any modules that may be needed by services or components in the `CoreModule`, or that need to be exported so that _other_ modules can use them. The CLI should have automatically added any generated components to the `declarations` array. However, we also need to add an `exports` array for any modules or components that we want to make available to other modules in our app to use.

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
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { CommentsComponent } from './comments/comments.component';
import { CommentFormComponent } from './comments/comment-form/comment-form.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule, // Import FormsModule and Loading component
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule
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

We'll need to import the `CoreModule` so we can utilize its exported `FormsModule` and `LoadingComponent`. We also need to access our configuration from the `environment.ts` file. Comments use Firebase's realtime database, so let's import the `AngularFireModule` and `AngularFireDatabaseModule` as well as our two components: `CommentsComponent` and `CommentFormComponent`.

When we add `AngularFireModule` to the @NgModule's `imports` array, we'll call its `initializeApp()` method, passing in our Firebase configuration. Both of our components should already be in the `declarations` array, but we'll also need to add `CommentsComponent` to the `exports` array so that other components from other modules can use it. 

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

## Implement Routing and Lazy Loaded Modules

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

We'll import our `CallbackComponent` and `AuthGuard`. The remaining routes will be string _references_ to modules rather than imported components using the `loadChildren` property. We will set the default `''` path to load route children from the `DogsModule`, and the `'dog'` path to load route children from the `DogModule`. The `'dog'` path should also be protected by the `AuthGuard`, which we declare using the `canActivate` property, which can hold an array of route guards should we require more than one. Finally, the `'callback'` route should simply point to the `CallbackComponent`.

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
    CoreModule, // Import Loading component
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

We're not sharing any components or services with other modules, so we don't need to implement `forRoot()` or add an `exports` array.

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
    CoreModule, // Import Loading component
    RouterModule.forChild(DOG_ROUTES)
  ],
  declarations: [
    DogComponent
  ]
})
export class DogModule { }
```

One difference between this module and the `DogsModule` is that our `DOG_ROUTES` has a path of `:rank`. This way, the route for any specific dog's details is passed as a URL segment matching the dog's rank in our list of top ten dog breeds, like so:

```
http://localhost:4200/dog/3
```

We will also not import the `CommentsModule`. However, we could add comments to dog details in the future if we wished.

Our app's architecture and routing are now complete! The app should successfully compile and display in the browser, with lazy loading functioning properly to load shared code, and then additionally, only the code for the specific route requested. We're now ready to implement our application's logic.

