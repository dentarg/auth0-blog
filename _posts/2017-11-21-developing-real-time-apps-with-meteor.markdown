---
layout: post
title: "Developing Real-time Apps with Meteor"
description: "Let’s learn how to use Meteor to build a real-time web application and add authentication to it"
date: 2017-11-21 8:30
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

**Meteor** is a full-stack JavaScript platform for developing modern web and mobile applications. Meteor provides a suite of technologies for building connected-client reactive applications, APIs, and a curated set of packages from the Node.js and general JavaScript community. It allows you develop in just one language, JavaScript, in all environments: server, web, and mobile.

**Meteor** is a project backed by the _Meteor Development Group_ company. They are friends of the open source community. The _MDG_ group also manages [Apollo](http://dev.apollodata.com), the flexible production ready GraphQL client for React and Native apps. Meteor as a JavaScript platform has built a community around it over the years. Currently, there is a [discussion forum](https://forums.meteor.com), [Stack Overflow channel](http://stackoverflow.com/questions/tagged/meteor), and [Atmosphere - a repository of community packages](https://atmospherejs.com). In addition, there is a community-curated list of meteor packages and resources on GitHub known as [Awesome Meteor](https://github.com/Urigo/awesome-meteor).

There are several websites and applications that run on Meteor. A few of them are [Favro - a collaboration app](https://www.favro.com/), [Reaction commerce - OSS platform for e-commerce sites](https://reactioncommerce.com/), [Oculus Health](https://www.oculushealth.com/) and [Game Raven - An online gaming community](https://gameraven.com/).

## Meteor Features

Meteor provides a lot out of the box. It ships with many features that make it worth considering when looking for a framework for your next project.

* **Authentication**: Meteor ships with session management and authentication features out of the box.
* **Real-time Feature**: Meteor is built from the ground up on the Distributed Data Protocol (DDP) to allow data transfer in both directions. In Meteor, you create publication endpoints that can push data from server to client.
* **Routing**: Meteor provides a `flow-router` package that allows client-side routing.
* **Custom Templating Engines**:  Meteor ships with its own templating engine but allows you to use other view libraries.
* **Packaging for Mobile**: Meteor allows you to easily package your web app into Android and iOS apps. With meteor, you can build for mobile.
* **Galaxy**: The Meteor Development Group (MDG) provides a service to run Meteor apps. [Galaxy](https://galaxy.meteor.com) is a distributed system that runs on Amazon AWS. It saves you a lot of trouble in configuring and deploying your app to production.

## Meteor Key Requirements

In order to use Meteor, you need to have the following tools installed on your machine.

* If you are operating on a windows machine, you need to have [Chocolatey](https://chocolatey.org/install) installed.
* If you are operating on an OS X or Linux machine, you do not need to have any special tool installed. Your terminal should be able to make a `curl` request.
* iOS development requires the latest Xcode.
* **MongoDB**: Navigate to the [mongodb website](https://www.mongodb.com/download-center?ct=false#atlas) and install the MongoDB community server edition. If you are using a Mac, I'll recommend following this [instruction](https://treehouse.github.io/installation-guides/mac/mongo-mac.html). To avoid micromanaging from the terminal, I'll also recommend installing a MongoDB GUI, [Robo 3T](https://robomongo.org), formerly known as RoboMongo. You can then run `mongod` from the terminal to start up the MongoDB service on your machine.


## Understanding Key Concepts in Meteor

Meteor uses the Publish-subscribe model. Check out this [excellent article on how publications and data loading works in Meteor](https://guide.meteor.com/data-loading.html). In a typical framework architecture, there exists a separation of concern of functionalities; presentation, business, and data access realm.

{% include tweet_quote.html quote_text="Meteor uses the Publish and subscribe model." %}

* **Data Layer**: This is the data access layer. The data layer is typically stored in MongoDB.

* **View Layer**: In a typical framework, the view simply presents data to the screen. In Meteor, there are template files. These files contains the view logic that accesses the Mongo Schemas. The view logic is typically placed in the `client/imports/ui` directory.

* **Business Logic Layer**: In Meteor, the `client` and `server` directories exist.  The business logic is typically placed in the `client/imports/api` directory. However, any sensitive code that you don’t want to be served to the client, such as code containing passwords or authentication mechanisms, should be kept in the `server/` directory.

## Build a Real-time Web App With Meteor

In this tutorial, we'll build a simple application called **Slang Bucket**. This app will allow users to add all sorts of slangs with their respective meanings. The _Slang Bucket_ is a mini version of [Urban Dictionary](https://www.urbandictionary.com/). Users will be able to add and delete slangs from the bucket.

### Install Meteor and Scaffold Slang Bucket

Linux and Mac users can run the following command in the terminal to install Meteor:

```bash
curl https://install.meteor.com/ | sh
```

Windows users can install Meteor like so:

```bash
choco install meteor
```

> The command above will install the latest version of Meteor. At the time of this writing, Meteor's latest version is 1.6.

Next, go ahead and create the _Slang Bucket_ app like so:

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

Meteor ships with a templating engine called `Blaze`. Blaze renders responses from HTML files and has a very familiar expression language. It uses double braces, {% raw %}{{ }}{% endraw %}, and {% raw %}{{> }}{% endraw %}.

* {% raw %}{{> }}{% endraw %} - Used to include Meteor templates in HTML files
* {% raw %}{{ }}{% endraw %} - Used to display data and logic from JavaScript files in the view(HTML) files.

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

### Create Slang Bucket Views and Display Static Data

First, add bootstrap by running the command below:

```bash
meteor add twbs:bootstrap
```

Create a new directory, _imports_ in the _slangbucket_ project folder. Inside the _imports_ directory, create a _ui_ folder.

Go ahead and create the following files:

_ui/body.html_

{% highlight html %}
{% raw %}
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
{% endraw %}
{% endhighlight %}

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

{% highlight html %}
{% raw %}
{{#each slangs}}
  {{> slang}}
{{/each}}
{% endraw %}
{% endhighlight %}

It loops through the array and inserts a slang template for each value. The slang template is shown below:

{% highlight html %}
{% raw %}
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
{% endraw %}
{% endhighlight %}

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

Update `body.js` to fetch slangs from the Slangs collection rather than a static array.

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

> **Note:** Run the app. Nothing seems to appear again. Yes, nothing shows because our database is currently empty.

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

> **Note:** Once it populates the database once, go ahead and remove the code to avoid duplicate insertion of data.

### Add New Slangs

Let's add a form to our app to enable users to add new slangs. Within the body tag, update the code to be like so:

_imports/ui/body.html_


{% highlight html %}
{% raw %}
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
{% endraw %}
{% endhighlight %}

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

In the code above, it listens to the submit event of the form, grabs the values and inserts them into the database. Run your app and try it out. Yes, it works!

### Delete Slangs

Let's add functionality to delete existing slangs. We need to move the slang template to its own file. Create two files: `imports/ui/slang.html` and `imports/ui/task.js`.

_imports/ui/slang.html_

{% highlight html %}
{% raw %}
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
{% endraw %}
{% endhighlight %}

> **Note:** Make sure you remove the slang template that was in the `body.html` file.

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

In the code above, we imported the slang template, `slang.html`, and we have a _click_ event that invokes the `remove` method when a user clicks on a slang's delete button.

`this` refers to an individual slang object in the collection. `_id` is the unique field that MongoDB assigns to a document in a collection. With this `_id`, we can do almost anything: `delete`, `update`, and `create`.

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

{% highlight html %}
{% raw %}
<body>
  <div class="container">
    <header>
      <h1 class="text-center">Slang Bucket</h1>
    </header>

    <div class="col-sm-12">

      {{> loginButtons}}
    ....
{% endraw %}
{% endhighlight %}

Create an `imports/startup/accounts-config.js` file and add the code below to it like so:

```js
import { Accounts } from 'meteor/accounts-base';

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
});
```

Also import the `imports/startup/accounts-config.js` file in `client/main.js`:

```js
import '../imports/startup/accounts-config.js';
import '../imports/ui/body.js';
```

Right now, we should be able to create an account. However, authentication is useless if we can't restrict access to functionality. Let's make sure only registered users can add new slangs. In addition, we can also reference the username of the user that added a slang.

A quick breakdown. We'll need to add new attributes to our `Slang` collection.

* **adderID**: this will hold the `_id` of the user that added the slang.
* **username**: this will hold the `username` of the user that added the slang.

> **Note:** There are other efficient ways to handle the authentication schema of this app. However, for the sake of this tutorial, we'll keep things simple.

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

{% highlight html %}
{% raw %}
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
{% endraw %}
{% endhighlight %}

In the code above, we added the {% raw %}{{#if currentUser}}{% endraw %} block helper. `currentUser` is a built-in helper that refers to the logged-in user. If the user is logged-in, show the _add new slang_ form, or else hide the form.

Now, run your app.

![Meteor - Nonlogged-in user](https://cdn.auth0.com/blog/slangbucket/nonloggedinuser.png)
_User not logged in_

No user is logged in, so no form to add new slangs. Now, create an account.

![Meteor - Log In](https://cdn.auth0.com/blog/slangbucket/login.png)
_User about to log in_

![Meteor - Loggedin User](https://cdn.auth0.com/blog/slangbucket/loggedinuser.png)
_User is logged in_

Here, the user is logged in, so he or she is able to create a new slang.

One more thing, let's display the username of the logged-in user next to the slang.

Update `imports/ui/slang.html` to the code below:

{% highlight html %}
{% raw %}
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
{% endraw %}
{% endhighlight %}


![Meteor - Username of Slang Adder](https://cdn.auth0.com/blog/slangbucket/username.png)
_Username displayed next to Slang_

### Eliminate Client Update

Meteor is robust. They factored in the fact that people usually create quick demos so a user can update the database directly from the client side. However, in a real-world project, you want to be sure that the server validates everything that comes into the app and allows users to complete an action only if they are authorized!

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

`Meteor.call` sends a request to the server to run the method in a secure environment via an AJAX request.

### Security Concerns - Filter Data

With an emphasis on security, we need to control which data Meteor sends to the client-side database. Go ahead and remove the `autopublish` package via the terminal:

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

Run the app again. Everything should be in full working order!

## Extra Functionality - Packages

There are lots of packages available for Meteor on [AtmosphereJS](https://atmospherejs.com). If there is a feature you want to implement, there is a high probability that it has been done by a developer before now and made available as a package. Explore!

## Securing Meteor Applications with Auth0

Meteor is a hybrid framework that takes care of your client and server needs. In addition, it's very easy to create server-side APIs. Right now, let's go ahead and secure our Meteor API with [JSON Web Tokens](https://jwt.io).

JSON Web Tokens, commonly known as JWTs, are tokens that are used to authenticate users on applications. This technology has gained popularity over the past few years because it enables backends to accept requests simply by validating the contents of these JWTs. That is, applications that use JWTs no longer have to hold cookies or other session data about their users. This characteristic facilitates scalability while keeping applications secure.

{% include tweet_quote.html quote_text="Applications that use JWTs no longer have to hold cookies or other session data about their users." %}

Whenever the user wants to access a protected route or resource (an endpoint), the user agent must send the JWT, usually in the _Authorization_ header using the [Bearer schema](http://self-issued.info/docs/draft-ietf-oauth-v2-bearer.html), along with the request.

When the API receives a request with a JWT, the first thing it does is to validate the token. This consists of a series of steps, and if any of these fail, the request must be rejected. The following list shows the validation steps needed:

* Check that the JWT is well-formed
* Check the signature
* Validate the standard claims
* Check the Client permissions (scopes)

We will make use of Auth0 to issue our JSON Web Tokens. With Auth0, we have to write just a few lines of code to get a solid [identity management solution](https://auth0.com/docs/identityproviders), including [single sign-on](https://auth0.com/docs/sso/single-sign-on), [user management](https://auth0.com/docs/user-profile), support for [social identity providers (like Facebook, GitHub, Twitter, etc.)](https://auth0.com/docs/identityproviders), [enterprise (Active Directory, LDAP, SAML, etc.)](https://auth0.com/enterprise), and your [own database of users](https://auth0.com/docs/connections/database/mysql).

For starters, if you haven't done so yet, this is a good time to sign up for a <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">free Auth0 account</a>. Having an Auth0 account, the first thing that we must do is to [create a new API on the dashboard](https://manage.auth0.com/#/apis). An API is an entity that represents an external resource, capable of accepting and responding to protected resource requests made by clients. And we are dealing with an API here, SWAPI (Star Wars API).

> [Auth0 offers a generous **free tier**](https://auth0.com/pricing) to get started with modern authentication.

Login to your Auth0 [management dashboard](https://manage.auth0.com) and create a new API client.

Click on the APIs menu item and then the **Create API** button. You will need to give your API a name and an identifier. The name can be anything you choose, so make it as descriptive as you want.

The identifier will be used to identify your API, and this field cannot be changed once set. For our example, I'll name the API, **Slang API**, and for the identifier, I'll set it as **https://slangsapi.com**. We'll leave the signing algorithm as **RS256** and click on the **Create API** button.

![New API to be created](https://cdn.auth0.com/blog/meteor/creatingslangapi.png)
_Create a New API_

![Slangs API](https://cdn.auth0.com/blog/meteor/nameofapi.png)
_Creating the Slangs API_

Head over to your terminal and install the following node modules:

```bash
meteor npm install express express-jwt jwks-rsa --save
```

Open your `server/main.js` file. Add this code at the top:

```js
import express from 'express';
import jwt from 'express-jwt';
import { expressJwtSecret } from 'jwks-rsa';

const app = express();
WebApp.connectHandlers.use(app);
```

In the code above, we imported `express`, `express-jwt`, and `jwks-rsa`.

* The `express-jwt` module is an express middleware that validates a JSON Web Token and sets the `req.user` with the attributes.
* The `jwks-rsa` module is a library that helps retrieve RSA public keys from a JSON Web Key Set endpoint.

Then the code just below the `imports` statements starts up express server and hooks it into the port Meteor uses:

```js
...
const app = express();
WebApp.connectHandlers.use(app);
```

Next, go ahead and add the following code:

_server/main.js_

```js
...
const authCheck = jwt({
  secret: expressJwtSecret({
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

app.get('/api/slangs', (req, res) => {
  const slangs = Slangs.find().fetch();
  res.status(200).json({ message: slangs });
});
```

**Note:** Replace the `YOUR-API-AUDIENCE-ATTRIBUTE` and `YOUR-AUTH0-DOMAIN` placeholders with the API audience and Auth0 domain values from your Auth0 dashboard.

Run your app by going to the `/api/slangs` route. You should see the set of slangs displayed.

Now, go ahead and modify the route code by adding the `authCheck` variable as a middleware.

_server/main.js_

```js
...
app.get('/api/slangs', authCheck, Meteor.bindEnvironment(function(req, res) {
  const slangs = Slangs.find().fetch();
  res.status(200).json({ message: slangs });
});
```

The `authCheck` variable does the check to validate the access tokens that are sent as Authorization headers. It validates the `audience`, `issuer` and `algorithm` used to sign the token.

Now, run your app with [Postman](https://www.getpostman.com/) again.

![Invalid token](https://cdn.auth0.com/blog/meteor/notoken.png)
_Accessing the endpoint without an access token_

Now, let's test it with a valid access token. Head over to the `test` tab of your newly created API on your Auth0 dashboard.

Grab the Access token from the _Test_ tab

![Get the Access token](https://cdn.auth0.com/blog/keystonejs/gettoken.png)
_Grab the Access Token_

Now use this `access token` in Postman by sending it as an Authorization header to make a GET request to `api/slangs` endpoint.

It validates the access token and successfully makes the request.

## Conclusion

Well done! You have learned how to build a real-time web app with Meteor, and authenticate it using JWTs. It's a platform that enables you to cut down on development time. Meteor makes it incredibly easy to also flesh out an API like you can do with [KeystoneJS](https://auth0.com/blog/developing-web-apps-and-restful-apis-with-keystonejs) and [Loopback](https://auth0.com/blog/developing-restful-apis-with-loopback/).

{% include tweet_quote.html quote_text="Meteor is a platform that enables you to cut down on development time." %}

In addition, Auth0 can help secure your **API** easily. Auth0 provides more than just username-password authentication. It provides features like [multifactor auth](https://auth0.com/multifactor-authentication), [breached password detection](https://auth0.com/breached-passwords), [anomaly detection](https://auth0.com/docs/anomaly-detection), [enterprise federation](https://auth0.com/docs/identityproviders), [single sign on (SSO)](https://auth0.com/docs/sso), and more. <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">Sign up</a> today so you can focus on building features unique to your app.

Please, let me know if you have any questions or observations in the comment section. 😊
