---
layout: post
title: "Real-World Angular Series - Part 1: MEAN Setup & Angular Architecture"
description: "Build and deploy a real-world app with MongoDB, Express, Angular, and Node (MEAN): MEAN setup and Angular architecture."
date: 2017-06-28 8:30
category: Technical guide, Angular, Angular 4
banner:
  text: "Auth0 makes it easy to add authentication to your Angular application."
author:
  name: "Kim Maida"
  url: "https://twitter.com/KimMaida"
  mail: "kim.maida@auth0.com"
  avatar: "https://en.gravatar.com/userimage/20807150/4c9e5bd34750ec1dcedd71cb40b4a9ba.png"
design:
  image: https://cdn.auth0.com/blog/angular/logo3.png
  bg_color: "#012C6C"
tags:
- javascript
- angular
- node
- mongodb
- express
- mean
related:
- 2017-03-07-managing-state-in-angular-with-ngrx-store
- 2016-11-07-migrating-an-angular-1-app-to-angular-2-part-1

---

<div class="alert alert-danger alert-icon">
  <i class="icon-budicon-487"></i>
  <strong>WARNING: This series of articles uses Angular 5 and RxJS 5.</strong> Please be aware that code changes are necessary to use Angular 6 and RxJS 6 with this tutorial. We are in the process of upgrading the series to latest versions. In the meantime, you can <a href="https://update.angular.io/">follow the update instructions here</a> for more information. Thank you for your patience!
</div>

**TL;DR:** This 8-part tutorial series covers building and deploying a full-stack JavaScript application from the ground up with hosted [MongoDB](https://www.mongodb.com/), [Express](https://expressjs.com/), [Angular (v2+)](https://angular.io), and [Node.js](https://nodejs.org) (MEAN stack). The completed code is available in the [mean-rsvp-auth0 GitHub repo](https://github.com/auth0-blog/mean-rsvp-auth0/) and a deployed sample app is available at [https://rsvp.kmaida.net](https://rsvp.kmaida.net).  **Part 1 of the tutorial series covers MEAN setup and the architecture for our Angular app.**

---

## Real-World Angular Series

You can view all sections of the tutorial series here:

1. [Real-World Angular Series - Part 1: MEAN Setup & Angular Architecture](https://auth0.com/blog/real-world-angular-series-part-1) (you are here!)
2. [Real-World Angular Series - Part 2: Authentication and Data Modeling](https://auth0.com/blog/real-world-angular-series-part-2)
3. [Real-World Angular Series - Part 3: Fetching and Displaying API Data](https://auth0.com/blog/real-world-angular-series-part-3)
4. [Real-World Angular Series - Part 4: Access Management, Admin, and Detail Pages](https://auth0.com/blog/real-world-angular-series-part-4)
5. [Real-World Angular Series - Part 5: Animation and Template-Driven Forms](https://auth0.com/blog/real-world-angular-series-part-5)
6. [Real-World Angular Series - Part 6: Reactive Forms and Custom Validation](https://auth0.com/blog/real-world-angular-series-part-6)
7. [Real-World Angular Series - Part 7: Relational Data and Token Renewal](https://auth0.com/blog/real-world-angular-series-part-7)
8. [Real-World Angular Series - Part 8: Lazy Loading, Production Deployment, SSL](https://auth0.com/blog/real-world-angular-series-part-8)

---

## Part 1: MEAN Setup and Angular Architecture

The first part of this tutorial will cover how to set up the cloud-hosted MongoDB database, Node server, and front end for our real-world Angular application.

1. <a href="#intro" target="_self">Introduction: What We'll Build</a>
2. <a href="#angular-setup" target="_self">Angular App Setup</a>
3. <a href="#mongodb-setup" target="_self">Hosted MongoDB Setup</a>
4. <a href="#auth0-setup" target="_self">Auth0 Account and Setup</a>
5. <a href="#server-setup" target="_self">Node.js Server Setup</a>
6. <a href="#angular-home" target="_self">Angular: Add a Home Component</a>
7. <a href="#angular-layout" target="_self">Angular: Layout and Global Components</a>

---

## <span id="intro"></span>Introduction: What We'll Build

This tutorial series will teach you how to build a real-world MEAN stack application, covering everything from ideation and data modeling to production deployment.

We will _not_ be building your run-of-the-mill to-do app. In order to learn the ins and outs of production-level JavaScript web application development, we'll build an app to create and RSVP to events. With our RSVP app, an administrator will be able to create, update, and delete events. Other users will then be able to RSVP to events. Our RSVP app's features will include the following (and more):

* Authentication and role authorization (client _and_ server)
* CRUD operations with an API
* Searching and filtering
* Template-driven forms
* Reactive forms with custom validation
* Simple UI animation
* Lazy loading
* Production deployment on VPS with nginx and SSL

We'll do all of the above (including SSL and production deployment) at minimal cost to the developer. There's no reason you shouldn't be able to get your own apps launched to production at low-to-no cost!

To explore the final product, check out the deployed, completed app here: [**https://rsvp.kmaida.net**](https://rsvp.kmaida.net). In your own app, _you'll_ be the administrator and will be able to create and modify events yourself (not just RSVP to existing events).

{% include tweet_quote.html quote_text="There's no reason you shouldn't get your own MEAN stack apps launched to production at low-to-no cost!" %}

Let's begin!

---

## <span id="angular-setup"></span>Angular App Setup

We'll use the [Angular CLI](https://github.com/angular/angular-cli) to create and build out our Angular application. Make sure you have the CLI installed globally:

```bash
$ npm install -g @angular/cli
```

The other thing you'll likely want is an Angular Language Service extension for your editor or IDE of choice. The Angular Language Service provides Angular intellisense and autocompletion. To learn more about the Language Service, check out [this summary of Day 3 of ng-conf 2017](https://auth0.com/blog/ngconf2017-summary-day3/). Check your editor's extension database for "Angular Language Service" and install if found ([instructions for VS Code, WebStorm, and Sublime Text are available here](http://brianflove.com/2017/04/11/angular-language-service/)).

### Create an Angular Project

Once the CLI and Language Service are installed, open a terminal or command prompt at the location you'd like your project folder created and run the following command:

```bash
$ ng new mean-rsvp --routing --style scss
```

This creates and installs a new Angular project with a [routing](https://github.com/angular/angular-cli/blob/master/docs/documentation/stories/routing.md) module and [SCSS](https://github.com/angular/angular-cli/wiki/stories-css-preprocessors) support.

Once the Angular CLI has finished creating the app and installing its dependencies, we're ready to get going on the basic customization necessary for our RSVP app.

### Add Title Service

In order to change the page titles for our routes, we'll need to use Angular's [Title service](https://angular.io/guide/set-document-title). This is because the `<title>` tag lives outside our Angular application, so we can't simply access it and add a property to change it with data binding.

Open the `app.module.ts` file and add the Title service to imports and to the `providers` array like so:

```typescript
// src/app/app.module.ts
import { BrowserModule, Title } from '@angular/platform-browser';
...
@NgModule({
  ...,
  providers: [
    Title
  ],
  ...
})
```

### Add Bootstrap

Now open the `src/index.html` file and add a link to the [Bootstrap](https://v4-alpha.getbootstrap.com/) CSS on CDN like so:

{% highlight html %}
<!-- src/index.html -->
...
<head>
  ...
  <title>RSVP</title>
  ...
  <link
    rel="stylesheet"
    href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css"
    integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ"
    crossorigin="anonymous">
</head>
...
{% endhighlight %}

> **Note:** At the time of writing, we're using the v4 alpha version of Bootstrap to take advantage of newer features such as the flex grid. As with any pre-release tool, there may be bugs. If a later release is available, please upgrade. If you choose to downgrade to v3, be aware that many of the classes in the provided HTML templates _will not work_ and will need to be replaced.

### Global SCSS

We'll now add some SCSS to manage global styling for our application. This will support basic layout and media queries.

First, open your `src/assets` folder and create a new `scss` folder. Now find the `src/styles.scss` file and move it into `src/assets/scss`.

Next, open the `.angular-cli.json` file. Find the `styles` property and change it to the following:

```js
...
      "styles": [
        "assets/scss/styles.scss"
      ],
...
```

Now our project will look for this file in the `assets` folder rather than in the root.

> **Note:** If you have the Angular CLI server running, you'll need to stop and restart it after making changes to the `.angular-cli.json` configuration file.

Next, let's create a few SCSS files.

#### Base Styles

First we'll create our `_base.scss` styles. Create this file and add the following SCSS to it:

```scss
/* src/assets/scss/_base.scss */
/*--------------------
       BASICS
--------------------*/

body {
  min-width: 320px;
}

/*-- Cursor --*/

a,
input[type=button],
input[type=submit],
button {
  cursor: pointer;
}

/*-- Link Buttons --*/

.btn-link {
  color: #0275d8;

  &:hover {
    text-decoration: underline !important;
  }
  &:focus {
    box-shadow: none !important;
    color: #0275d8;
    text-decoration: none;
  }
}

/*-- Forms --*/

input[type="text"],
input[type="number"],
input[type="password"],
input[type="date"],
select option,
textarea {
  font-size: 16px; /* for iOS to prevent autozoom */
}
.formErrors {
  padding-top: 6px;
}
.ng-invalid.ng-dirty,
.ng-invalid.ng-dirty:focus {
  border-color: #D9534E !important;
}
input::-webkit-input-placeholder { /* Chrome/Opera/Safari */
  color: rgba(0,0,0,.25) !important;
  opacity: 1 !important;
}
input::-moz-placeholder { /* Firefox 19+ */
  color: rgba(0,0,0,.25) !important;
  opacity: 1 !important;
}
input:-moz-placeholder { /* Firefox 18- */
  color: rgba(0,0,0,.25) !important;
  opacity: 1 !important;
}
input:-ms-input-placeholder { /* IE 10+ */
  color: rgba(0,0,0,.25) !important;
  opacity: 1 !important;
}

/*-- Helpers --*/

.opacity-half {
  opacity: .5;
}
.list-group-item > strong {
  padding-right: 5px;
}
```

Bootstrap provides a CSS reset and plenty of styling. Our local `_base.scss` provides some basic helpers and improvements.

#### Variables and Partials

Now we'll add a few files for variables and partials. Create a new  folder in your `src/assets/scss` directory called `partials`.

In the `partials` folder, add a new file called `_layout.vars.scss` and add the following:

```scss
/* src/assets/scss/partials/_layout.vars.scss */
/*--------------------
   LAYOUT VARIABLES
--------------------*/

$padding-screen-small: 3%;
$padding-screen-large: 1.5% 3%;
```

In the same `partials` folder, create a file called `_responsive.partial.scss`:

```scss
/* src/assets/scss/partials/_responsive.partial.scss */
/*--------------------
      RESPONSIVE
--------------------*/

/*-- Variables --*/

$large: 'screen and (min-width: 768px)';

/*-- Mixins --*/

@mixin mq($mqString) {
  @media #{$mqString} {
    @content;
  }
}
```

This file contains a `$large` variable with a media query for large screen sizes and an `mq()` mixin for easily targeting media queries in our SCSS. If necessary, we can add more variables to this file as our app grows.

#### Import Global SCSS

Finally, we need to import all the files we just created. Open the `styles.scss` file and add:

```scss
/* src/assets/scss/styles.scss */
// partials
@import 'partials/layout.vars';
@import 'partials/responsive.partial';

// global styles
@import 'base';
```

Now our Angular app has everything we need to get started developing features. However, before we move forward with any more client side development, let's set up MongoDB and our Node.js API!

---

## <span id="mongodb-setup"></span>Hosted MongoDB Setup

[MongoDB](https://docs.mongodb.com/manual/) is an [open-source](https://github.com/mongodb/mongo) document database. For speed and ease, we'll use [mLab's free, cloud-hosted MongoDB](https://mlab.com/plans/pricing/#plan-type=sandbox) deployment for our application's database. We'll also set up a handy tool called [MongoBooster](https://mongobooster.com/) for simple MongoDB access and management.

### Create mLab Account and Database

Let's sign up and create our new database.

1. Go to [mLab](https://mlab.com/signup) and sign up for an account.
2. Confirm your email address. Doing so will take you to your account dashboard.
3. Under **MongoDB Deployments**, click the "Create new" button.
4. Select your desired Cloud Provider and Region.
5. Change the Plan to **Single-node** and select the free "Sandbox" option.
6. Scroll down and give your database a name, like `mean`.
7. Click the "Create new MongoDB deployment" button.

![mLab new MongoDB deployment](https://cdn.auth0.com/blog/mean-series/mLab-new-deployment.png)

The new database can now be selected from our deployments. It should look something like this:

![mLab MongoDB database](https://cdn.auth0.com/blog/mean-series/mLab-db.png)

We now need to add a user in order to connect to our database. Click on the database to edit it.

1. Select the **Users** tab and click the "Add database user" button.
2. Enter a database username and password in the modal. These credentials will be needed to read and write to the database with Node.
3. Make a note of the database's MongoDB URI. This should be in the format: `mongodb://<dbuser>:<dbpassword>@<ds111111>.mlab.com:<port>/<dbname>`.

![mLab MongoDB URI](https://cdn.auth0.com/blog/mean-series/mLab-uri.png)

Now we're ready to use our MongoDB database.

> **Note:** If you prefer, you can host MongoDB locally. [Follow these instructions](https://docs.mongodb.com/manual/installation/) to install MongoDB on your operating system.

### Set Up MongoBooster

For easy database management, we can use an app called [MongoBooster](https://mongobooster.com/). The free version will serve our purposes just fine. [Download MongoBooster for your OS](https://mongobooster.com/downloads) and open it.

1. In the upper left of the Connections prompt, click "Create" to set up a new connection.
2. A **Connection Editor** dialog will appear with the **Basic** tab open.
3. Enter the server address. This will be the MongoDB URI that we made note of earlier, something like: `<ds111111>.mlab.com`.
4. Enter the port number in the field after the `:`.
5. Enter a name for the connection, such as `mLab - mean`.

![Set up MongoBooster with MongoDB connection from mLab](https://cdn.auth0.com/blog/mean-series/mongobooster-connection.png)

Next, switch to the **Authentication** tab.

1. For Mode, select "Basic(Username/Password)" from the dropdown.
2. Enter your mLab database name, likely `mean`.
3. Enter the user name for the user you created in mLab.
4. Enter the password you created for the user in mLab.

![Set up MongoBooster with MongoDB authentication](https://cdn.auth0.com/blog/mean-series/mongobooster-auth.png)

We should now be able to click the "Test Connection" button to confirm our configuration. If everything was entered correctly, we should receive a **Test Connection** dialog that confirms we were able to connect and authorize with a status of `OK`.

> **Note:** If you encounter a failure, double-check the information you entered.

Close the test dialog and click the "Save" button. We can now select and connect to our mLab `mean` database with MongoBooster.

---

## <span id="auth0-setup"></span>Auth0 Account and Setup

Our Angular application and Node API will use the IDaaS (Identity-as-a-Service) platform [Auth0](https://auth0.com) for authentication and route authorization.

![Auth0 hosted login screen](https://cdn2.auth0.com/blog/angular-aside/angular-aside-login.jpg)

### Sign Up for a Free Auth0 Account

You'll need an [Auth0](https://auth0.com) account to manage authentication. You can sign up for a <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">free account here</a>. Next, set up an Auth0 client app and API so Auth0 can interface with an Angular app and Node API.

> Auth0 provides the simplest and easiest to use [user interface tools to help administrators manage user identities](https://auth0.com/user-management) including password resets, creating and provisioning, blocking and deleting users. [A generous **free tier**](https://auth0.com/pricing) is offered so you can get started with modern authentication.

### Set Up a Client App

1. Go to your [**Auth0 Dashboard**](https://manage.auth0.com/#/) and click the "[create a new client](https://manage.auth0.com/#/clients/create)" button.
2. Give your new app a name (for example: `RSVP MEAN App`) and select "Single Page Web Applications".
3. In the **Settings** for your new Auth0 client app, add `http://localhost:8083/callback` and `http://localhost:4200/callback` to the **Allowed Callback URLs**.
4. In **Allowed Web Origins**, add `http://localhost:8083` and `http://localhost:4200`.
5. Scroll down to the bottom of the **Settings** section and click "Show Advanced Settings". Choose the **OAuth** tab and make sure the **JsonWebToken Signature Algorithm** is set to "RS256".
6. If you'd like, you can [set up some social connections](https://manage.auth0.com/#/connections/social). You can then enable them for your app in the **Client** options under the **Connections** tab. The example shown in the screenshot above utilizes username/password database, Facebook, Google, and Twitter.

We added two ports to the callback URLs and allowed web origins because we'll be running and testing the app from both during development. Port `4200` is the port the Angular CLI serves the Angular app from. Port `8083` is the port our Node API and server uses: this will be necessary in order to test the production build. When we launch to a production URL, we can either create a new production Auth0 Client or add our production URL to the client as well.

> **Note:** If you set up social connections, enter App/Client IDs as per the instructions for each connection instead of leaving those fields blank and using Auth0 dev keys. This will be important for token renewal and deployment later.

### Set Up an API

1. Go to [**APIs**](https://manage.auth0.com/#/apis) in your dashboard and click the "Create API" button.
2. Enter a name for the API (for example: `RSVP MEAN API`).
3. Set the **Identifier** to your API endpoint URL. This identifier is the `audience` parameter on authorization calls. In our app, this is `http://localhost:8083/api/`.
4. The **Signing Algorithm** should be "RS256".

---

## <span id="server-setup"></span>Node.js Server Setup

Our next order of business is the Node server and API.

### Install Dependencies

In the _root_ folder of our new Angular app, install the following dependencies with npm, saving them to the `package.json` like so:

```bash
$ npm install express body-parser express-jwt jwks-rsa method-override mongoose cors --save
```

### File Structure

Create a new folder at the root of the project called `server`. Inside this folder, add two new files: `server/api.js` and `server/config.js`. At the root of the project, create a `server.js` file. The file structure should now look like this:

```text
...
server/
 |- api.js
 |- config.js
src/
...
server.js
...
```

### Configuration

Open the `server/config.js` file and add the following to it:

```js
// server/config.js
module.exports = {
  AUTH0_DOMAIN: '[YOUR_AUTH0_DOMAIN]', // e.g., kmaida.auth0.com
  AUTH0_API_AUDIENCE: '[YOUR_AUTH0_API_NAME]', // e.g., 'http://localhost:8083/api/'
  MONGO_URI: process.env.MONGO_URI || 'mongodb://[USER]:[PASSWORD]@[DS######].mlab.com:[PORT]/[DB_NAME]'
};
```

Replace the Auth0 domain, API audience, and MongoDB URI with the appropriate data from your <a href="#auth0-setup" target="_self">Auth0 account</a> and <a href="#mongodb-setup" target="_self">mLab database</a>.

### Server

Now let's develop our `server.js`. Open the empty file we created and add the following to it:

```js
// server.js
/*
 |--------------------------------------
 | Dependencies
 |--------------------------------------
 */

// Modules
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const cors = require('cors');
// Config
const config = require('./server/config');

/*
 |--------------------------------------
 | MongoDB
 |--------------------------------------
 */

mongoose.connect(config.MONGO_URI);
const monDb = mongoose.connection;

monDb.on('error', function() {
  console.error('MongoDB Connection Error. Please make sure that', config.MONGO_URI, 'is running.');
});

monDb.once('open', function callback() {
  console.info('Connected to MongoDB:', config.MONGO_URI);
});

/*
 |--------------------------------------
 | App
 |--------------------------------------
 */

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(cors());

// Set port
const port = process.env.PORT || '8083';
app.set('port', port);

// Set static path to Angular app in dist
// Don't run in dev
if (process.env.NODE_ENV !== 'dev') {
  app.use('/', express.static(path.join(__dirname, './dist')));
}

/*
 |--------------------------------------
 | Routes
 |--------------------------------------
 */

require('./server/api')(app, config);

// Pass routing to Angular app
// Don't run in dev
if (process.env.NODE_ENV !== 'dev') {
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '/dist/index.html'));
  });
}

/*
 |--------------------------------------
 | Server
 |--------------------------------------
 */

app.listen(port, () => console.log(`Server running on localhost:${port}`));
```

Notice that there are a few sections that are environment-dependent. For development, we want to be able to take advantage of the Angular CLI's ability to serve and watch files with [JIT](https://auth0.com/blog/glossary-of-modern-javascript-concepts-part-2#jit) without requiring an entire project build each time we want to check our work. In order to facilitate this, we'll start by separating our Node.js server from our Angular front end in development.

This way, we can run the Node API on [localhost:8083](http://localhost:8083) while the Angular app runs on [localhost:4200](http://localhost:4200). For _production_, we want the Node server to run the API _and_ use a static path to serve the front end. Our MEAN stack should pass routing to the compiled Angular app for deployment.

### API Routes

Open the `api.js` file and add the following:

```js
// server/api.js
/*
 |--------------------------------------
 | Dependencies
 |--------------------------------------
 */

const jwt = require('express-jwt');
const jwks = require('jwks-rsa');

/*
 |--------------------------------------
 | Authentication Middleware
 |--------------------------------------
 */

module.exports = function(app, config) {
  // Authentication middleware
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

/*
 |--------------------------------------
 | API Routes
 |--------------------------------------
 */

  // GET API root
  app.get('/api/', (req, res) => {
    res.send('API works');
  });

};
```

Using [express-jwt](https://github.com/auth0/express-jwt) and [jwks-rsa](https://github.com/auth0/node-jwks-rsa) with our [Auth0 API](https://manage.auth0.com/#/apis), we can implement protection for selected API routes when necessary. We'll do this by adding a `jwtCheck` middleware function to routes we want to secure. We'll discuss this more later.

### Serve and Watch the App and API

Let's install [nodemon](https://github.com/remy/nodemon) globally to watch the Node server for changes without needing to restart after making updates:

```bash
$ npm install nodemon -g
```

> **Note:** If you encounter `EACCESS` errors when using npm, you may need to execute some commands either with the command prompt running as administrator (Windows) or with `sudo` (Mac/Linux).

We should now be able to access both the Angular application and the API in the browser on `localhost`. We can do so by running each of the following commands from the root of our project in separate terminal windows ([VS Code is great at this](https://code.visualstudio.com/docs/editor/integrated-terminal#_managing-multiple-terminals)).

> **Note:** We'll be using separate terminal windows a lot so we can keep watching the app and API while adding components with the Angular CLI.

We can use this command to serve the Angular app:

```bash
$ ng serve
```

In another terminal, set the environment variable and then serve the Node API:

```bash
# Windows:
$ SET NODE_ENV=dev
$ nodemon server
# OR Mac:
$ NODE_ENV=dev nodemon server
```

> **Note:** On Mac, these commands can be combined: `NODE_ENV=dev nodemon server`.

If we've done everything correctly, the Angular app will compile and show a success message in its terminal. We should also see a message in the Node server terminal confirming that the server is running and that we've successfully connected to MongoDB.

We can then navigate to [http://localhost:4200](http://localhost:4200) to see our Angular app running in the browser:

![Angular app works running on localhost on Node backend](https://cdn.auth0.com/blog/mean-series/app-works.jpg)

We can also navigate to [http://localhost:8083/api](http://localhost:8083/api) to see our API running:

![Node API works running on localhost](https://cdn.auth0.com/blog/mean-series/api-works-final.jpg)

> **Note:** Eventually we'll be serving everything from the Node server, but since this requires the Angular app to be built and no longer watched, we won't do this until later. However, if you'd like to see what this looks like now, you can run `ng build` followed by `node server`. This will build and serve the app _and_ API on [http://localhost:8083](http://localhost:8083).

Our Node API and Angular app are now up and running in a development environment!

---

## <span id="angular-home"></span>Angular: Add a Home Component

Let's generate a component for our app's homepage. We'll run the following Angular CLI command from the root of our project:

```bash
$ ng g component pages/home
```

Now let's add our Home component to routing. Open the `app-routing.module.ts` file and import the `HomeComponent`:

```typescript
// src/app/app-routing.module.ts
...
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  }
];
...
```

We'll set the `''` path to use our new Home component. Now when we view our app in the browser, we should see our Home component rendered:

![Angular app home works](https://cdn.auth0.com/blog/mean-series/home-works.jpg)

### Use Title Service

Let's add a `<title>` to our home component. We'll do this by using the [Title service](https://angular.io/guide/set-document-title). We already provided `Title` in <a href="#angular-setup" target="_self">Angular App Setup</a>, so we can use it immediately.

Open the `home.component.ts` file:

```typescript
// src/app/pages/home/home.component.ts
...
import { Title } from '@angular/platform-browser';

...
export class HomeComponent implements OnInit {
  pageTitle = 'Events';

  constructor(private title: Title) { }

  ngOnInit() {
    this.title.setTitle(this.pageTitle);
  }

}
```

We'll import the `Title` service and then add a property called `pageTitle` with a value of `Events`. Then we'll pass the Title service to the constructor and in the [`ngOnInit()` lifecycle method](https://angular.io/guide/lifecycle-hooks#oninit), we'll use the `title.setTitle()` method to change the document title to the value of our local `pageTitle`. By storing this title in a property, we can also use it in our component's template to set a heading. Let's do that now.

Open `home.component.html` and add:

{% highlight html %}
{% raw %}
<!-- src/app/pages/home/home.component.html -->
<h1 class="text-center">{{pageTitle}}</h1>
{% endraw %}
{% endhighlight %}

The document title and heading should now show up in the browser. We have routing and a home component in place, so now we can get started on the global layout of our Angular app.

---

## <span id="angular-layout"></span>Angular: Layout and Global Components

Next we need to set up our Angular app's layout and global elements, such as header, navigation, and footer. We want our app to work in any size browser, so we'll implement off-canvas navigation. To do so, we need to add some markup and functionality to our root `app` component as well as create a header and footer.

Let's generate the components for our app's global header and footer:

```bash
$ ng g component header
$ ng g component footer
```

> **Note:** For the sake of brevity in this tutorial, we're going to ignore `.spec.ts` files, as we won't cover testing. However, feel free to write your own tests during development. If you wish to generate components _without_ creating test files, you can add the `--no-spec` flag to your `g` commands.

### Header Component

Let's start with the Header component we just generated. Open the `header.component.ts` file and add:

```typescript
// src/app/header/header.component.ts
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() navToggled = new EventEmitter();
  navOpen = false;

  constructor(private router: Router) { }

  ngOnInit() {
    // If nav is open after routing, close it
    this.router.events
      .filter(event => event instanceof NavigationStart && this.navOpen)
      .subscribe(event => this.toggleNav());
  }

  toggleNav() {
    this.navOpen = !this.navOpen;
    this.navToggled.emit(this.navOpen);
  }
}
```

This component handles interaction with the hamburger menu toggle and route changes from the navigation links. There are many ways that [Angular can tackle component interaction](https://angular.io/guide/component-interaction). In this case, we want [a parent to listen for a child event](https://angular.io/guide/component-interaction#parent-listens-for-child-event) (App listens for an event from Header). We'll use the [`@Output` decorator](https://angular.io/guide/template-syntax#input-and-output-properties--input-and-output-) to create an [EventEmitter](https://angular.io/api/core/EventEmitter) to notify the parent component when the user has clicked on the hamburger menu toggle to open or close the nav panel.

The `navOpen` property defaults to `false` (the off-canvas navigation panel is closed on load). We need access to the `Router` to determine when navigation has taken place, so we'll add it to the constructor.

When the [component initializes](https://angular.io/guide/lifecycle-hooks#oninit), we'll use the [router events observable](https://angular.io/api/router/Router) to check if `navOpen` is `true` on [`NavigationStart`](https://angular.io/api/router/NavigationStart). If this is the case, we want to close the panel so it's not still open when we arrive at a new route.

The `toggleNav()` method is executed when the user clicks the hamburger toggle button in the template. It emits a `navToggled` _event_ that the parent component can then listen for and handle. When the user clicks the toggle, we'll change the value of `navOpen` and then emit the event with this new value.

This click event is implemented in the `header.component.html` template:

{% highlight html %}
<!-- src/app/header/header.component.html -->
<header id="header" class="header">
  <div class="header-page bg-primary">
    <a class="toggle-offcanvas bg-primary" (click)="toggleNav()"><span></span></a>
    <h1 class="header-page-siteTitle">
      <a routerLink="/">RSVP</a>
    </h1>
  </div>

  <nav id="nav" class="nav" role="navigation">
    <ul class="nav-list">
      <li>
        <a
          routerLink="/"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: true }">Events</a>
      </li>
    </ul>
  </nav>
</header>
{% endhighlight %}

> **Note:** Please take a look at [Angular's binding syntax](https://angular.io/guide/template-syntax#binding-syntax-an-overview). Parentheses `()` indicate event binding and square brackets `[]` indicate expression binding.

The `<nav>` element contains an unordered list of our routes. For now, we only have the "Events" link (which routes to our Home component). We'll use the [`routerLink`](https://angular.io/api/router/RouterLink) and [`routerLinkActive`](https://angular.io/api/router/RouterLinkActive) directives on an anchor tag to handle links to our routes. We'll specify the route we want to navigate to and the class to be applied when that route is active.

We need to add `[routerLinkActiveOptions]` to ensure an exact match to the `/` path in the case of the root route. Otherwise, this link will receive the `active` class whenever _any_ route containing `/` is active.

Our `header.component.scss` contains the styles for our hamburger menu toggle, site title, and navigation list. Open this file and add the following:

```scss
/* src/app/header/header.component.scss */
/*--------------------
       HEADER
--------------------*/

@import '../../assets/scss/partials/layout.vars';

/*-- Navigation --*/

.nav {
  background: #eee;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  box-shadow: inset -8px 0 8px -6px rgba(0,0,0,0.2);
  display: none; /* deal with FOUC */
  height: 100%;
  overflow-y: auto;
  padding: $padding-screen-small;
  position: absolute;
    top: 0;
  transform: translate3d(-100%,0,0);
  width: 270px;

  :host-context(.nav-closed) &,
  :host-context(.nav-open) & {
    display: block; /* deal with FOUC */
  }
  .active {
    font-weight: bold;
  }
  &-list {
    list-style: none;
    margin-bottom: 0;
    padding-left: 0;

    a {
      display: block;
      padding: 6px;

      &:hover,
      &:active,
      &:focus {
        text-decoration: none;
      }
    }
  }
}

/*-- Hamburger toggle --*/

.toggle-offcanvas {
  border-right: 1px solid rgba(255,255,255,.5);
  display: inline-block;
  height: 50px;
  padding: 23.5px 13px;
  position: relative;
  text-align: center;
  width: 50px;
  z-index: 100;

  span,
  span:before,
  span:after {
    background: #fff;
    border-radius: 1px;
    content: '';
    display: block;
    height: 3px;
    position: absolute;
    transition: all 250ms ease-in-out;
    width: 24px;
  }
  span {
    &:before {
      top: -9px;
    }
    &:after {
      bottom: -9px;
    }
  }
  :host-context(.nav-open) & {
    span {
      background: transparent;

      &:before,
      &:after {
        top: 0;
      }
      &:before {
        transform: rotate(45deg);
      }
      &:after {
        transform: rotate(-45deg);
      }
    }
  }
}

/*-- Header and title --*/

.header-page {
  color: #fff;
  height: 50px;
  margin-bottom: 10px;
  position: relative;

  &-siteTitle {
    font-size: 30px;
    line-height: 50px;
    margin: 0;
    padding: 0 0 0 60px;
    position: absolute;
      top: 0;
    width: 100%;
  }
  a {
    color: #fff;
    text-decoration: none;
  }
}
```

> **Note:** If we need access to partials (such as `_layout.vars.scss`) in our [encapsulated](https://angular.io/guide/component-styles#view-encapsulation) component styles, we need to _import_ those files.

This file provides styles for the nav and header as well as CSS to animate the hamburger icon into an `X` and back. When accessing classes outside the current component, we can use the [special selector `:host-context(.ancestor-class)`](https://angular.io/guide/component-styles#host-context) to reach out of the component's encapsulation and up the tree.

### Footer Component

Our Footer component is very simple: just a static paragraph with a link to the source repo. Open the `footer.component.html` template and add:

{% highlight html %}
<!-- src/app/footer/footer.component.html -->
<p class="text-center">
  MIT 2017
</p>
{% endhighlight %}

> **Note:** You could put something fancier here if you wish.

Add the following styles to `footer.component.scss`:

```scss
/* src/app/footer/footer.component.scss */
/*--------------------
       FOOTER
--------------------*/

:host {
  display: block;
  padding-bottom: 10px;
}
p {
  font-size: 12px;
  margin-bottom: 0;
}
```

We'll shift the bottom margin/padding to the [host element](https://angular.io/guide/component-styles#host) so the paragraph margin doesn't interfere with our calculation of window height in the next step.

### App Component

Now we'll add the Header and Footer components to our App component, along with markup and logic to enable off-canvas navigation.

Open the `app.component.ts` file:

```typescript
// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  navOpen: boolean;
  minHeight: string;
  private _initWinHeight = 0;

  constructor() {}

  ngOnInit() {
    Observable.fromEvent(window, 'resize')
      .debounceTime(200)
      .subscribe((event) => this._resizeFn(event));

    this._initWinHeight = window.innerHeight;
    this._resizeFn(null);
  }

  navToggledHandler(e: boolean) {
    this.navOpen = e;
  }

  private _resizeFn(e) {
    const winHeight: number = e ? e.target.innerHeight : this._initWinHeight;
    this.minHeight = `${winHeight}px`;
  }
}
```

We'll create a `navOpen` property to sync the state of the navigation panel with our Header component. This is where we'll store the event data that the Header component sends when the `navToggled` event is emitted. We'll use a `navToggledHandler()` method with an `$event` argument to react to this event.

We'll use an observable [fromEvent](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/fromevent.md) to subscribe to the window resize event. We can run a `_resizeFn()` handler that ensures that the height of the layout canvas matches the height of the browser viewport.

> **Note:** We could also achieve close to the same thing by setting `height: 100vh` on the layout canvas element in our CSS, but we're going with a JS option due to [inconsistencies with `vh` in mobile browsers](http://stackoverflow.com/questions/37112218/css3-100vh-not-constant-in-mobile-browser).

Open the `app.component.html` file and add:

{% highlight html %}
<!-- src/app/app.component.html -->
<div class="layout-overflow">
  <div
    class="layout-canvas"
    [ngClass]="{'nav-open': navOpen, 'nav-closed': !navOpen}"
    [style.min-height]="minHeight">

    <!-- HEADER -->
    <app-header (navToggled)="navToggledHandler($event)"></app-header>

    <!-- CONTENT -->
    <div id="layout-view" class="layout-view">
      <router-outlet></router-outlet>
    </div>

    <!-- FOOTER -->
    <app-footer></app-footer>

  </div> <!-- /.layout-canvas -->
</div> <!-- /.layout-overflow -->
{% endhighlight %}

We have several layouting containers to manage the off-canvas panel that slides in and out from the left side of the screen, pushing the rest of the content over. We also use the `navOpen` property to apply or remove `.nav-open` and `.nav-closed` classes on the `<div class="layout-canvas">` element with the [ngClass directive](https://angular.io/api/common/NgClass).

> **Note:** These are the classes that we used `:host-context()` to access in the child Header component.

We'll also apply the calculated `minHeight` using a `[style.min-height]` property.

> **Note:** This is a _DOM property_, not an HTML attribute. It's important to note the difference. Make sure to read through [Binding Syntax: HTML attribute vs. DOM property](https://angular.io/guide/template-syntax#html-attribute-vs-dom-property) to learn about this new mental model.

The `<app-header>` component listens for the `navToggled` event and then handles it with our `navToggledHandler()` method. We then have a container element with the [router-outlet directive](https://angular.io/api/router/RouterOutlet) inside it. This is where all of our routed components will render. Finally, we have our `<app-footer>` component.

The styles for our `app.component.scss` should look like this:

```scss
/* src/app/app.component.scss */
/*--------------------
    APP COMPONENT
--------------------*/

@import '../assets/scss/partials/layout.vars';
@import '../assets/scss/partials/responsive.partial';

.layout-overflow {
  overflow: hidden; /* necessary to handle offcanvas scrollbar behavior */
}
.layout-canvas {
  background: #fff;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden; /* Safari: http://caniuse.com/#search=css3%203d */
  position: relative;
    left: 0;
  transition: transform 250ms ease;
  transform: translate3d(0,0,0);
  width: 100%;

  &.nav-open {
    transform: translate3d(270px,0,0);
  }
}
.layout-view {
  padding: $padding-screen-small;

  @include mq($large) {
    margin: 0 auto;
    max-width: 960px;
    padding: $padding-screen-large;
  }
}
```

When the navigation is open, the layout canvas should slide over. We also have a few styles for the container for routed components (layout view).

That's it for the layout and global navigation! The app should look like this in the browser:

![animated Angular app with global off-canvas navigation](https://cdn.auth0.com/blog/mean-series/layout-nav-animation.gif)

Now that we have our structure and global components in place, we're ready to start developing features next time.

### Aside: Linting

The Angular CLI uses [Codelyzer](https://github.com/mgechev/codelyzer) to lint Angular projects and raise warnings when the developer has used practices that do not adhere to the [Angular Style Guide](https://angular.io/guide/styleguide). Now might be a good time to run `ng lint` to lint our project and make sure there are no errors.

{% include tweet_quote.html quote_text="Angular CLI lints projects and raises warnings when the dev doesn't adhere to the @angular styleguide." %}

## Aside: Securing Applications with Auth0

Are you building a [B2C](https://auth0.com/b2c-customer-identity-management), [B2B](https://auth0.com/b2b-enterprise-identity-management), or [B2E](https://auth0.com/b2e-identity-management-for-employees) tool? Auth0 can help you focus on what matters the most to you, the special features of your product. [Auth0](https://auth0.com/) can improve your product's security with state-of-the-art features like [passwordless](https://auth0.com/passwordless), [breached password surveillance](https://auth0.com/breached-passwords), and [multifactor authentication](https://auth0.com/multifactor-authentication).

[We offer a generous **free tier**](https://auth0.com/pricing) so you can get started with modern authentication.

---

## Summary

We've covered setup and dependencies for the software and tools needed for our MEAN stack application. We've also established the basic layout and architecture of our Angular front end. In the [next part of the Real-World Angular Series](https://auth0.com/blog/real-world-angular-series-part-2), we'll tackle authentication and authorization, feature planning, and data modeling.
