---
layout: post
title: "Developing Real-time Apps with Meteor"
description: "Let’s learn how to use Meteor to build a real-time web application and add authentication to it"
date: 2017-11-02 8:30
category: Technical Guide, JavaScript, Meteor
banner:
  text: "Auth0 makes it easy to add authentication to your Angular application."
author:
  name: "Prosper Otemuyiwa"
  url: "https://twitter.com/unicodeveloper"
  mail: "prosper.otemuyiwa@auth0.com"
  avatar: "https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200"
design:
  image: https://cdn.auth0.com/blog/meteor/logo.png
  bg_color: "#1B1C20"
tags:
- meteor
- meteorjs
- mdg
- opensource
- javascript
- authentication
- auth
- real-time
- restful
- fullstack
related:
- 2017-09-19-building-an-app-with-Nette-and-adding-authentication
- 2017-09-07-developing-restful-apis-with-loopback
- 2017-08-10-implementing-jwt-authentication-on-spring-boot
---

**TL;DR:** In this tutorial, I'll show you how easy it is to build a real-time web application with Meteor. Check out the [repo](https://github.com/auth0-blog/meteor-app) to get the code.

---

**Meteor** is a full-stack JavaScript platform for developing modern web and mobile applications. Meteor provides a suite of technologies for building connected-client reactive applications, APIs, and a curated set of packages from the Node.js and general JavaScript community. It allows you develop in just one language, JavaScript, in all environments: server, web and mobile.

**Meteor** is a project backed by the _Meteor Development Group_ company. They are friends of the open source community. The _MDG_ group also manages [Apollo](http://dev.apollodata.com), the flexible production ready GraphQL client for React and Native apps. Meteor as a JavaScript platform has built a community around it over the years. Currently, there is a [discussion forum](https://forums.meteor.com), [Stack Overflow channel](http://stackoverflow.com/questions/tagged/meteor), and [Atmosphere - a repository of community packages](https://atmospherejs.com). In addition, there is a community-curated list of meteor packages and resources on GitHub known as [Awesome Meteor](https://github.com/Urigo/awesome-meteor).

There are several websites and applications that run on Meteor. A few of them are [Favro - a collaboration app](https://www.favro.com/), [Reaction commerce - OSS platform for e-commerce sites](https://reactioncommerce.com/), [Oculus Health](https://www.oculushealth.com/) and [Game Raven - An online gaming community](https://gameraven.com/).

## Meteor Features

Meteor provides a lot out of the box. It ships with a lot of features that makes it worthy to consider when looking for a framework for your next project.

* **Authentication** : Meteor ships with session management and authentication features out of the box.
* **Real-time Feature**: Meteor is built from the ground up on the Distributed Data Protocol (DDP) to allow data transfer in both directions. In Meteor, you create publication endpoints that can push data from server to client.
* **Routing**: Meteor provides a `flow-router` package that allows client-side routing.
* **Custom Templating Engines**:  Meteor ships with its own templating engine but allows you to use other view libraries.
* **Packaging for Mobile**: Meteor allows you to easily package your web app into an Android an iOs app. With meteor, you can build for mobile.
* **Galaxy**: The Meteor Development Group (MDG) provides a service to run Meteor apps. [Galaxy](https://galaxy.meteor.com) is a distributed system that runs on Amazon AWS. It saves you a lot of trouble in configuring and deploying your app to production.

## Meteor Key Requirements

In order to use Meteor, you need to have the following tools installed on your machine.

* If you are operating on a windows machine, you need to have [Chocolatey](https://chocolatey.org/install) installed.
* If you are operating on an OS X or Linux machine, you do not need to have any special tool installed. Your terminal should be able to make a `curl` request.
* iOS development requires the latest Xcode.
* **MongoDB**: Navigate to the [mongodb website](https://www.mongodb.com/download-center?ct=false#atlas) and install the MongoDB community server edition. If you are using a Mac, I'll recommend following this [instruction](https://treehouse.github.io/installation-guides/mac/mongo-mac.html). To avoid micromanaging from the terminal, I'll also recommend installing a MongoDB GUI, [Robo 3T](https://robomongo.org), formerly known as RoboMongo. You can then run `mongod` from the terminal to start up the MongoDB service on your machine.


## Understanding Key Concepts in Meteor

Meteor uses the Publish and subscribe model. Check out this [excellent article on how publications and data loading works in Meteor](https://guide.meteor.com/data-loading.html). In a typical framework architecture, there exists a seperation of concern of functionalities; presentation, business, and data access realm.

* **Data Layer**: This is the data access layer. The data layer is typically stored in MongoDB.

* **View Layer**: In a typical framework, the view simply presents data to the screen. In Meteor, there are template files. These files containes the view logic that accesses the Mongo Schemas. The view logic is typically placed in the `client/imports/ui` directory.

* **Business Logic Layer**: In Meteor, the `client` and `server` directories exist.  The business logic is typically placed in the `client/imports/api` directory. However, any sensitive code that you don’t want served to the client, such as code containing passwords or authentication mechanisms, should be kept in the `server/` directory.

## Build a Real-time Web App With Meteor

In this tutorial, we'll build a simple application called **SlangBucket**. This app will allow users to add all sorts of slangs with their respective meanings. The _SlangBucket_ is a mini version of [Urban Dictionary](https://www.urbandictionary.com/). Users will be able to add and delete slangs from the bucket.

### Install Meteor and Scaffold SlangBucket

Linux and Mac users can run the following command in the terminal to install Meteor:

```bash
curl https://install.meteor.com/ | sh
```

Windows users can install Meteor like so:

```bash
choco install meteor
```

> The command above will install the latest version of Meteor. At the time of this writing, Meteor's latest version is 1.6.

Next, go ahead and create the _SlangBucket_ app like so:

```
meteor create slangbucket
```

The command above will create a new `slangbucket` directory with some boilerplate files.

Run the following command to get the app up and running in the browser:

```bash
cd slangbucket
meteor
```

Open the URL, `http://localhost:3000`, in the web browser to see the app running.

![Slang Bucket - Default page](https://cdn.auth0.com/blog/slangbucket/default.png)
_Slang Bucket: Default page_

### Directory Structure

Open up the `slangbucket` code repository in an editor. These are the files that were created when you ran the command to scaffold the app.

- client
  - main.js        # a JavaScript entry point loaded on the client
  - main.html      # an HTML file that defines view templates
  - main.css       # a CSS file to define your app's styles
- server
  - main.js        # a JavaScript entry point loaded on the server
- package.json     # a control file for installing NPM packages
- .meteor          # internal Meteor files
- .gitignore       # a control file for git

### Select Templating Engine

Meteor ships with a templating engine called `Blaze`. Blaze renders responses from HTML files and has a very familiar expression language. It uses double braces, `{{ }}`, and `{{> }}`.

* `{{> }}` - Used to include Meteor templates in HTML files
* `{{ }}` - Used to display data and logic from JavaScript files in the view(HTML) files.

Meteor is very configurable. You can use _Angular_ and _React_ with Meteor. If you want to use React as the view library, all you need to do is add react:

```
meteor npm install --save react react-dom
```

And configure it like so:

_client/main.html_

```
<head>
  <title>Todo List</title>
</head>

<body>
  <div id="render-target"></div>
</body>
```

_client/main.jsx_

```js
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import App from '../imports/ui/App.jsx';

Meteor.startup(() => {
  render(<App />, document.getElementById('render-target'));
});
```

Your UI elements can now be written with JSX.

If you want to use Angular, all you need to do is remove `blaze`:

```bash
meteor remove blaze-html-templates
```

And replace it with the UI package for Angular:

```bash
meteor add angular-templates
```

Furthermore, install `angular` and `angular-meteor`:

```bash
meteor npm install --save angular angular-meteor
```

Go ahead and configure your templates like so:

_client/main.html_

```
<head>
  <title>Todo List</title>
</head>

<body>
  <div class="container" ng-app="slang-bucket">

  </div>
</body>
```

_client/main.js_

```js
import angular from 'angular';
import angularMeteor from 'angular-meteor';

angular.module('simple-todos', [
  angularMeteor
]);
```

In this tutorial, we'll use the default Meteor templating engine, **Blaze**.

### Create SlangBucket Views and Display Static Data

First, add bootstrap by running the command below:

```bash
meteor add twbs:bootstrap
```

Create a new directory, _imports_ in the _slangbucket_ project folder. Inside the _imports_ directory, create a _ui_ folder.

Go ahead and create the following files:

_ui/body.html_

```
<body>
  <div class="container">
    <header>
      <h1 class="text-center">Slang Bucket</h1>
    </header>

    <div class="col-sm-12">
      {{#each slangs}}
        {{> slang}}
      {{/each}}
    </div>
  </div>
</body>

<template name="slang">
    <div class="panel panel-primary">
      <div class="panel-heading">
        <h3 class="panel-title"><span class="btn">{{ slang }}</span></h3>
      </div>
      <div class="panel-body">
        <p> {{ definition }} </p>
      </div>
    </div>
</template>
```

_ui/body.js_

```js
import { Template } from 'meteor/templating';

import './body.html';

Template.body.helpers({
  slangs: [
    { slang: "Yoruba Demon",
      definition: "Nigerian guy (yoruba) who goes after a young lady's heart with no intention of loving her. They are typically met at parties, and would mostly wear white agbada."
    },
    { slang: "Bye Felicia",
      definition: "The perfect dismissal phrase for waving goodbye to someone or something unimportant."
    },
    { slang: "GOAT",
      definition: "An acronym for praising someone doing well in a certain activity. 'Greatest of all time'."
    },
    { slang: "Low key",
      definition: "Keeping some activity or news under wraps."
    },
  ],
});
```

Head over to `client/main.js`. Remove everything there and replace with:

```js
import '../imports/ui/body.js';
```

Right now, your web app should look like this:

![Meteor - Static Data](https://cdn.auth0.com/blog/slangbucket/staticdata.png)
_Meteor: Static Data_

What's happening in the code above?

The `client/main.js` loads up the `body.js` file. In the `body.js` file, we have a couple of things going on. The `body.html` file is been imported. You can pass data into templates from JavaScript code using the `Template.body.helpers`. Here, we defined a `slangs` helper that returns an array of objects.

In `body.html`, we invoked the data returned from the `slangs` helper with the code below:

```
{{#each slangs}}
  {{> slang}}
{{/each}}
```

It loops through the array and inserts a slang template for each value. The slang template is shown below:

```
<template name="slang">
  <div class="panel panel-primary">
    <div class="panel-heading">
      <h3 class="panel-title"><span class="btn">{{ slang }}</span></h3>
    </div>
    <div class="panel-body">
      <p> {{ definition }} </p>
    </div>
  </div>
</template>
```

### Data Storage

Currently, our data is stored in an array. Let's move our data to MongoDB. Meteor uses MongoDB by default. Meteor provides a way of storing and manipulating data from both the client and server side. However, there are ways to ensure that no one can inject data into the database from the browser's dev tools.

Create a new `imports/api` directory. We'll put our database logic in this directory.

Go ahead and create an `imports/api/slangs.js` file and add code to it like so:

```js
import { Mongo } from 'meteor/mongo';

export const Slangs = new Mongo.Collection('slangs');
```

Import the module on the server to enable the creation of the collection and data-sending to the client.

_server/main.js_

```js
import { Slangs } from '../imports/api/slangs.js';

import { Meteor } from 'meteor/meteor';

Meteor.startup(function () {
    // code to run on server at startup
});
```

Update `body.js` to fetch slangs from the Slangs collection rather than an a static array.

_imports/ui/body.js_

```js
import { Template } from 'meteor/templating';

import { Slangs } from '../api/slangs.js';

import './body.html';

Template.body.helpers({
  slangs() {
    return Slangs.find({}, { sort: { createdAt: -1 } });
  },
});
```

> **Note: Check out the app. Nothing seems to appear again. Yes, nothing shows because our database is currently empty.

Let's add data to the database. We can decide to enter data from the mongo console via the terminal or we can write a script. The former is very tedious.

Go to _server/main.js_ and update code to be like so:

```js
import { Slangs } from '../imports/api/slangs.js';

import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  Slangs.insert({slang: "Yoruba Demon", definition: "Nigerian guy (yoruba) who goes after a young lady's heart with no intention of loving her. They are typically met at parties, and would mostly wear white agbada."});
  Slangs.insert({slang: "Bye Felicia", definition: "The perfect dismissal phrase for waving goodbye to someone or something unimportant."});
  Slangs.insert({slang: "GOAT", definition: "An acronym for praising someone doing well in a certain activity. 'Greatest of all time'."});
  Slangs.insert({slang: "Low key", definition: "Keeping some activity or news under wraps."});
});
```

When the server starts up, it automatically inserts the data defined here into the database. Now, run your app again, you should see the data. Slick!

> Note: Once it populates the database once, go ahead and remove the code to avoid duplicate insertion of data.

### Add New Slangs

Let's add a form to our app to enable users add new slangs. Within the body tag, update the code to be like so:

_imports/ui/body.html_

```
...
<div class="container">
    <header>
      <h1 class="text-center">Slang Bucket</h1>
    </header>

    <div class="col-sm-12">
      <form class="new-slang">
        <div class="form-group">
          <input type="text" name="slang" class="form-control" placeholder="Add new slangs" required="required" />
        </div>
        <div class="form-group">
          <textarea class="form-control" name="definition" placeholder="Add new slang definitions" required></textarea>
        </div>
         <div class="form-group">
          <input class="btn btn-small btn-info" type="submit" value="Add New Slang" />
        </div>
      </form>

      {{#each slangs}}
        {{> slang}}
      {{/each}}
    </div>
  </div>
...
```

Add the JavaScript code to listen to the submit event on the form:

_imports/ui/body.js_

```js
...
Template.body.events({
  'submit .new-slang'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const slang = target.slang.value;
    const definition = target.definition.value;

    // Insert a task into the collection
    Slangs.insert({
      slang,
      definition,
      createdAt: new Date(), // current time
    });

    // Clear form
    target.slang.value = '';
    target.definition.value = '';
  },
});
```

In the code above, it listens to the submit event of the form, grab the values and inserts them into the database. Run your app and try it out. Yes, it works!

### Delete Slangs

Let's add functionality to delete existing slangs. Let's move the slang template to its own file. Create two files: `imports/ui/slang.html` and `imports/ui/task.js`.

_imports/ui/slang.html_

```
<template name="slang">
    <div class="panel panel-primary">
      <div class="panel-heading">
        <h3 class="panel-title"><span class="btn">{{ slang }}</span> <button class="delete btn btn-danger pull-right">&times;</button></h3>
      </div>
      <div class="panel-body">
        <p> {{ definition }} </p>
      </div>
    </div>
</template>
```

> **Note: Make sure you remove the slang template that was in the `body.html` file.

_imports/ui/slang.js_

```js
import { Template } from 'meteor/templating';

import { Slangs } from '../api/slangs.js';

import './slang.html';

Template.slang.events({
  'click .delete'() {
    Slangs.remove(this._id);
  },
});
```

In the code above, we imported the slang template, `slang.html`. And we have a click event that invokes the remove method when a user clicks the delete button on a slang.

`this` refers to an individual slang object in the collection. `_id` is the unique field that MongoDB assigns to a document in a collection. With this `_id`, we can do almost anything, `delete`, `update`, and `create`.

One more thing. Import `slang.js` into the `body.js` file:

```js
...
import './slang.js';
...
```

Run your app, click the delete button on any slang and watch it disappear instantly. It removes it from the UI and deletes it from the database.

### Add Authentication

Meteor ships with an authentication system. Go ahead and install the auth packages via the terminal:

```bash
meteor add accounts-ui accounts-password
```

Add the authentication drop-down widget to the _body.html_ file like so:

```
<body>
  <div class="container">
    <header>
      <h1 class="text-center">Slang Bucket</h1>
    </header>

    <div class="col-sm-12">

      {{> loginButtons}}
    ....

```

Create an _imports/startup/accounts-config.js_ file and add the code below to it like so:

```js
import { Accounts } from 'meteor/accounts-base';

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
});
```

Also import the _imports/startup/accounts-config.js_ file in _client/main.js_:

```js
import '../imports/startup/accounts-config.js';
import '../imports/ui/body.js';
```

Right now, we should be able to create an account. However, authentication is useless if we can't restrict access to some functionalities. Let's make sure only registered users can add new slangs. In addition, we can also reference the username of the user that added a slang.

A quick breakdown. We'll need to add new attributes to our `Slang` collection.

* **adderID**: this will hold the `_id` of the user that added the slang.
* **username**: this will hold the `username` of the user that added the slang.

> **Note: There are other efficient ways to handle the authentication schema of this app. However, for the sake of this tutorial, we'll keep things simple.

Open up `imports/ui/body.js` and modify it like so:

_imports/ui/body.js_

```js
import { Meteor } from 'meteor/meteor';
...
...
// Insert a task into the collection
Slangs.insert({
  slang,
  definition,
  createdAt: new Date(), // current time
  adderID: Meteor.userId(),
  username: Meteor.user().username,
});
...
```

Open up `imports/ui/body.html` and modify it like so:

```
...
 {{> loginButtons}}

      {{#if currentUser}}
      <form class="new-slang">
        <div class="form-group">
          <input type="text" name="slang" class="form-control" placeholder="Add new slangs" required="required" />
        </div>
        <div class="form-group">
          <textarea class="form-control" name="definition" placeholder="Add new slang definitions" required></textarea>
        </div>
         <div class="form-group">
          <input class="btn btn-small btn-info" type="submit" value="Add New Slang" />
        </div>
      </form>
      {{/if}}
...
```

In the code above, we added the `{{#if currentUser}}` block helper. `currentUser` is a built-in helper that refers to the logged-in user. If the user is logged-in, show the _add new slang_ form else hide the form.

Now, run your app.

![Meteor - Nonlogged-in user](https://cdn.auth0.com/blog/slangbucket/non-loggedinuser.png)
_User not logged in_

No user is logged in, so no form to add new slangs. Now, create an account.

![Meteor - Log In](https://cdn.auth0.com/blog/slangbucket/login.png)
_User about to log in_

![Meteor - Loggedin User](https://cdn.auth0.com/blog/slangbucket/loggedinuser.png)
_User is logged in_

Here, the user is logged in, so he or she is able to create a new slang.

One more thing, let's display the username of the logged-in user next to the slang.

Update `imports/ui/slang.html` to the code below:

```
<template name="slang">
  <div class="panel panel-primary">
    <div class="panel-heading">
      <h3 class="panel-title"><span class="btn">{{ slang }}</span><button class="delete btn btn-danger pull-right">&times;</button></h3>
      <span>@{{username}}</span>
    </div>
    <div class="panel-body">
      <p> {{ definition }} </p>
    </div>
  </div>
</template>
```

![Meteor - Username of Slang Adder](https://cdn.auth0.com/blog/slangbucket/username.png)
_Username displayed next to Slang_

### Eliminate Client Update

Meteor is robust. They factored in the fact that people usually create quick demos so user can update the database directly from the client side. However, in a real-world project, you want to be sure that the server validates everything that comes into the app and allows users to complete an action only if they are authorized!

The first step is to remove the `insecure` package. Meteor ships with this built-in package. This is the package that allows us to edit the database from the client.

```bash
meteor remove insecure
```

Next, we need to add some code to ensure validation happens right before the database methods are executed.

Open up `imports/api/slangs.js`. Add code to it like so:

```js
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Slangs = new Mongo.Collection('slangs');

Meteor.methods({
  'slangs.insert'(slang, definition) {
    check(slang, String);
    check(definition, String);

    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Slangs.insert({
      slang,
      definition,
      createdAt: new Date(),
      adderID: Meteor.userId(),
      username: Meteor.user().username,
    });
  },
  'slangs.remove'(slangId) {
    check(slangId, String);

    Slangs.remove(slangId);
  },
});
```

Next, let's update the sections of the app that were executing some database operations.

_imports/ui/body.js_

```js
...
...
Template.body.events({
  'submit .new-slang'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const slang = target.slang.value;
    const definition = target.definition.value;

    // Insert a slang into the collection
    Meteor.call('slangs.insert', slang, definition);

    // Clear form
    target.slang.value = '';
    target.definition.value = '';
  },
});
```

We replaced the _slang insert section_ with ` Meteor.call('slangs.insert', slang, definition);`.

_imports/ui/slang.js_

```js
...

Template.slang.events({
  'click .delete'() {
    Meteor.call('slangs.remove', this._id);
  },
});
```

We replaced the _slang remove_ code with `Meteor.call('slangs.remove', this._id);`.

`Meteor.call` sends a request to the server to run the method in a secure environment via an AJAX.

### Security Concerns - Filter Data

With emphasis on security, we need to control which data Meteor sends to the client-side database. Go ahead and remove the `autopublish` package via the terminal:

```bash
meteor remove autopublish
```

Without the `autopublish` package, no data will be sent to the client and no access will be granted to the database. Therefore, the app will not show any data on the screen. To combat this scenario, we'll have to explicitly request the data from the server to the client. Meteor uses the `Meteor.publish` and `Meteor.subscribe` methods to accomplish this feat.

Open _imports/api/slangs.js_ and add this code to it:

```js
...
...

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('slangs', function tasksPublication() {
    return Slangs.find();
  });
}
...
```

The code above adds a publication for all slangs. Next, let's subscribe to this publication.

Open _imports/ui/body.js_ and add this code to it:

```js
...
Template.body.onCreated(function bodyOnCreated() {
  Meteor.subscribe('slangs');
});
...
```

In the code above, it subscribes to the slangs publication once the body template is created. Now, our app is secure.

Run the app again. The app should work!

## Extra Functionality - Packages

There are lots of packages available for Meteor on [AtmosphereJS](https://atmospherejs.com). If there is a feature you want to implement, there is a high probability that it has been done by a developer before now and made available as a package. Explore!

## Securing Meteor Applications with Auth0

Right now, anyone can make `GET` and `POST` requests to all of the endpoints present in our API. In a real-world scenario, we should restrict `POST`, `DELETE` and `PUT` requests to certain registered and authorized users.

We'll go ahead and secure some of these API endpoints with [JSON Web Tokens](https://jwt.io).

JSON Web Tokens, commonly known as JWTs, are tokens that are used to authenticate users on applications. This technology has gained popularity over the past few years because it enables backends to accept requests simply by validating the contents of these JWTs. That is, applications that use JWTs no longer have to hold cookies or other session data about their users. This characteristic facilitates scalability while keeping applications secure.

Whenever the user wants to access a protected route or resource (an endpoint), the user agent must send the JWT, usually in the _Authorization_ header using the [Bearer schema](http://self-issued.info/docs/draft-ietf-oauth-v2-bearer.html), along with the request.

When the API receives a request with a JWT, the first thing it does is to validate the token. This consists of a series of steps, and if any of these fails then, the request must be rejected. The following list shows the validation steps needed:

* Check that the JWT is well formed
* Check the signature
* Validate the standard claims
* Check the Client permissions (scopes)

We will make use of Auth0 to issue our JSON Web Tokens. With Auth0, we have to write just a few lines of code to get a solid [identity management solution](https://auth0.com/docs/identityproviders), including [single sign-on](https://auth0.com/docs/sso/single-sign-on), [user management](https://auth0.com/docs/user-profile), support for [social identity providers (like Facebook, GitHub, Twitter, etc.)](https://auth0.com/docs/identityproviders), [enterprise (Active Directory, LDAP, SAML, etc.)](https://auth0.com/enterprise), and your [own database of users](https://auth0.com/docs/connections/database/mysql).

For starters, if you haven't done so yet, this is a good time to sign up for a [free Auth0 account](javascript:signup\(\)). Having an Auth0 account, the first thing that we must do is to [create a new API on the dashboard](https://manage.auth0.com/#/apis). An API is an entity that represents an external resource, capable of accepting and responding to protected resource requests made by clients. And we are dealing with an API here, SWAPI (Star Wars API).

> [Auth0 offers a generous **free tier**](https://auth0.com/pricing) to get started with modern authentication.

Login to your Auth0 [management dashboard](https://manage.auth0.com) and create a new API client.

Click on the APIs menu item and then the **Create API** button. You will need to give your API a name and an identifier. The name can be anything you choose, so make it as descriptive as you want.

The identifier will be used to identify your API, this field cannot be changed once set. For our example, I'll name the API, **Star Wars API**, and for the identifier I'll set it as **https://starwarsapi.com**. We'll leave the signing algorithm as **RS256** and click on the **Create API** button.

![New API to be created](https://cdn.auth0.com/blog/loopback/newapitobecreated.png)
_Create a New API_

![Star Wars API](https://cdn.auth0.com/blog/loopback/starwarsapi.png)
_Creating the Star Wars API_

![Define the scopes](https://cdn.auth0.com/blog/loopback/starwarscope.png)
_You can define scopes in this section_

Head over to your terminal and install the following node modules:

```bash
npm install express-jwt jwks-rsa --save
```

Open your `routes/index.js` file. Just before the route bindings, add this code:

```js
...
var authCheck = jwt({
  secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        // YOUR-AUTH0-DOMAIN name e.g https://prosper.auth0.com
        jwksUri: "{YOUR-AUTH0-DOMAIN}/.well-known/jwks.json"
    }),
    // This is the identifier we set when we created the API
    audience: '{YOUR-API-AUDIENCE-ATTRIBUTE}',
    issuer: '{YOUR-AUTH0-DOMAIN}',
    algorithms: ['RS256']
});
```

Also, make sure you require the `express-jwt` and `jwks-rsa` modules at the top of the file.

```js
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');
```

Add the `authCheck` function to the endpoints as a middleware like so:

```js
// Setup Route Bindings
exports = module.exports = function (app) {
  // Views
  app.get('/', routes.views.index);

  // API
  app.get('/api/people', routes.api.people.list);
  app.get('/api/people/:id', routes.api.people.get);
  app.post('/api/people', authCheck, routes.api.people.create);
  app.put('/api/people/:id', authCheck, routes.api.people.update);
  app.delete('/api/people/:id', authCheck, routes.api.people.remove);

  app.get('/api/planets', routes.api.planet.list);
  app.get('/api/planets/:id', routes.api.planet.get);
  app.post('/api/planets', authCheck, routes.api.planet.create);
  app.put('/api/planets/:id', authCheck, routes.api.planet.update);
  app.delete('/api/planets/:id', authCheck, routes.api.planet.remove);

  app.get('/api/starships', routes.api.starship.list);
  app.get('/api/starships/:id', routes.api.starship.get);
  app.post('/api/starships', authCheck, routes.api.starship.create);
  app.put('/api/starships/:id', authCheck, routes.api.starship.update);
  app.delete('/api/starships/:id', authCheck, routes.api.starship.remove);


  // NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
  // app.get('/protected', middleware.requireUser, routes.views.protected);

};
```

* The `express-jwt` module is an express middleware that validates a JSON Web Token and set the `req.user` with the attributes.
* The `jwks-rsa` module is a library that helps retrieve RSA public keys from a JSON Web Key Set endpoint.

The `authCheck` variable does the check to validate the access tokens that are sent as Authorization headers. It validates the `audience`, `issuer` and algorithm used to sign the token.

**Note:** Replace the `YOUR-API-AUDIENCE-ATTRIBUTE` and `YOUR-AUTH0-DOMAIN` placeholders with the API audience and Auth0 domain values from your Auth0 dashboard.

We just secured all the `post`, `put`, and `delete` API endpoints with JWT. If a user accesses these API endpoint/route without a valid access token or no token at all, it returns an error. Try it out.

![Invalid token](https://cdn.auth0.com/blog/keystonejs/authorizationerror.png)
_Accessing the POST people endpoint without an access token_

Now, let's test it with a valid access token. Head over to the `test` tab of your newly created API on your Auth0 dashboard.

Grab the Access token from the _Test_ tab

![Get the Access token](https://cdn.auth0.com/blog/keystonejs/gettoken.png)
_Grab the Access Token_

Now use this `access token` in Postman by sending it as an Authorization header to make a POST request to `api/people` endpoint.

![Accessing the endpoint securely](https://cdn.auth0.com/blog/keystonejs/authorizationbearer.png)
_Accessing the endpoint securely_

It validates the access token and successfully makes the POST request.

Wondering how to integrate the secure API with a frontend? Check out our amazing [React](https://auth0.com/blog/reactjs-authentication-tutorial/) and [Vue.js authentication tutorials](https://auth0.com/blog/vuejs2-authentication-tutorial/).


## Conclusion

Well done! You have learned how to build a real-time web app with Meteor. It's a platform that enables you to cut down on development time. Meteor makes it incredibly easy to also flesh out an API like you can do with [KeystoneJS](https://auth0.com/blog/developing-web-apps-and-restful-apis-with-keystonejs) and [Loopback](https://auth0.com/blog/developing-restful-apis-with-loopback/).

{% include tweet_quote.html quote_text="Meteor is a platform that enables you to cut down on development time." %}

In addition, Auth0 can help secure your **API** easily. Auth0 provides more than just username-password authentication. It provides features like [multifactor auth](https://auth0.com/multifactor-authentication), [breached password detection](https://auth0.com/breached-passwords), [anomaly detection](https://auth0.com/docs/anomaly-detection), [enterprise federation](https://auth0.com/docs/identityproviders), [single sign on (SSO)](https://auth0.com/docs/sso), and more. [Sign up](javascript:signup\(\)) today so you can focus on building features unique to your app.

Please, let me know if you have any questions or observations in the comment section. 😊
