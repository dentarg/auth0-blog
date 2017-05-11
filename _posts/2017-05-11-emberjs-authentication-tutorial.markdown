---
layout: post
title: "EmberJS 2 Authentication Tutorial"
description: Learn how to quickly build ambitious apps with EmberJS 2 and add authentication the right way.
date: 2017-05-11 8:30
category: Technical Guide, Frontend, EmberJS
author:
  name: Prosper Otemuyiwa
  url: https://twitter.com/unicodeveloper?lang=en
  avatar: https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200
  mail: prosper.otemuyiwa@auth0.com
design:
  bg_color: "#35495E"
  image: https://cdn2.auth0.com/blog/vuejs/logo.png
tags:
- emberjs
- javascript
- authentication
- web-app
- auth0
related:
- 2016-09-29-angular-2-authentication
- 2017-02-21-reactjs-authentication-tutorial
- 2017-04-18-vuejs2-authentication-tutorial
---

---

**TL;DR:** Emberjs is a JavaScript framework for building ambitious web applications. It's a framework that was built for productivity and designed with developer ergonomics in mind. Currently, EmberJS has over 15,000 stars on [GitHub](https://github.com/emberjs/ember.js). In this tutorial, I'll show you how easy it is to build a web application with EmberJS 2 and add authentication to it. Check out the [repo](https://github.com/auth0-blog/emberjs2authenticationtutorial) to get the code.

---

[**EmberJS**](https://vuejs.org/) was developed by [Yehuda Katz](https://twitter.com/wycats). It was initially released in December 2011. **EmberJS** was also formerly known as SproutCore MVC framework. New applications now run on EmberJS 2 which was released in August, 2015. EmberJS 2.0 introduced new APIs, and removed deprecated ones from Ember 1. The goal of Ember 2 is to remove badly designed and unecessarily complicated code from Ember 1. And apps that run on Ember 1.13 without any deprecation warnings should run without issues on Ember 2.0. Currently, many popular products use **EmberJS** to build their user interfaces. Such platforms include *LinkedIn*, *Yahoo*, *Zendesk*, *Square*, *PlayStation Now*, *Apple Music*, *Heroku Dashboard*, *Twitch*, *Discourse*, *IndieHackers* and more. There is a comprehensive list of [projects using Emberjs on builtwithember.io](http://builtwithember.io). EmberJS [documentation](https://guides.emberjs.com/v2.13.0) is very detailed, and there is a vibrant [community](http://emberjs.com/community) of users.


## Understanding Core Concepts in EmberJS

If you have experience with frameworks like VueJS, Angular and React, then you'll understand how **EmberJS** works in a split second. Developers coming from the [jQuery](https://jquery.com) world might find it difficult to comprehend at first glance. But if you are familiar with frameworks like [Laravel](https://laravel.com) and [Rails](http://rubyonrails.org), then you'll discover a pattern that'll make fall in love with **EmberJS**.

I'll give a basic overview of these concepts to nourish your understanding of **EmberJS**. They are:

* **Routing**
* **Templates**
* **Models**
* **Components** 
* **Controllers**

### Routing

Let's take a good look at how a typical EmberJS app works. Our fictitious app is a *Student Management System* and the URL is `https://studember.ng`. One of the URLs in this app is `https://studember.ng/students`. This route simply returns the details of all the students registered on this app. Now, check out what happens when the user loads the app for the first time.

* Ember router maps the URL to a route handler. The route handler then renders a template and loads a model that is available to the template.

```js
import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('students');
});

export default Router;
``
_router_

```js
import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        return [
            'David Ajimobi',
            'Olorigbeske Ojuyobo',
            'Orieja Michael'
        ]
    }
});
```
_Route Handler_

You can easily create a route using the Ember CLI's `generate` command like so:

```bash
ember generate route route-name
```

This creates a route file at `app/routes/route-name.js`, a template for the route at `app/templates/route-name.hbs`, and a unit test file at `tests/unit/routes/route-name-test.js`. It also adds the route to the router.

### Templates

Templates are used to organize the HTML layout of the application. By default, **EmberJS** uses [Handlebars](http://handlebarsjs.com) templates. Templates can display properties provided to them from a controller or a component. The screen rendered to the user is composed of handlebars templates. A typical example is this:

{% highlight html %}
{% raw %}
<h3> {{title}} </h3>

<ul>
    {{#each people as |person| }}
        <li>{{person}}</li>
    {{/each}}
</ul>
{% endraw %}
{% endhighlight %}

_template.hbs_

The template extension is *.hbs*.

### Model

Models are objects that represent the underlying data that your application presents to the user. The structure and scope of your app will determine the types and number of models that will present in it.

A typical example is this:

Our student management app might have a `Student` model to represent a particular student. Models are also used to persist data. Typically, most models fetch and persist data to a store. The store could be a database on a server or simply a JSON file.

```js
import DS from 'ember-data';

export default DS.Model.extend({
  first_name: DS.attr(),
  last_name: DS.attr(),
  city: DS.attr(),
  age: DS.attr(),
});
```
_app/models/student.js_

Ember comes with a data management library called [Ember Data](https://github.com/emberjs/data) to help deal with persistent application data. The library requires you to define the structure of the data you wish to provide to your application by extending `DS.Model`. At first, using Ember Data may feel different than the way you're used to writing JavaScript applications. Many developers are familiar with using AJAX to fetch raw JSON data from an endpoint, which may appear easy at first. Over time, however, complexity leaks out into your application code, making it hard to maintain. Ember Data helps you manage your models in a simple way as your application grows.

Ember Data gives you a single store that is the central repository of models in your application. Components and routes can ask the store for models, and the store is responsible for knowing how to fetch them.

You can easily create a model using the Ember CLI's `generate` command like so:

```bash
ember generate model student
```

This creates a model at `app/models/student.js` file:

```js
import DS from 'ember-data';

export default DS.Model.extend({
});
```

### Components

Ember Components consist basically of two parts: a Handlebars template, and a JavaScript file that defines the component's behavior.

Components must have at least one dash in their name, e.g `active-list`. This helps Ember differentiate it from native HTML tags. Components control how the user interface behaves. Components are represented in the view with the curly brace rather than the angle tag like this:

{% highlight html %}
{% raw %}

{{active-list}}

{% endraw %}
{% endhighlight %}


Ember provides some methods that are triggered at various points from creating a component up until the component is destroyed. This is called the *Component's Lifecycle*. You can declare methods to hook into the component's lifecycle to control the behaviour of components in your app. 

On **Initial Render**, we have:

* init 
* didReceiveAttrs
* willRender
* didInsertElement
* didRender

On **Re-render**, we have:

* didUpdateAttrs
* didReceiveAttrs
* willUpdate
* willRender
* didUpdate
* didRender

On **Component Destroy**, we have:

* willDestroyElement
* willClearRender
* didDestroyElement

A typical example of a component is this:

```js
import Ember from 'ember';

export default Ember.Component.extend({
  init() {
    this._super(...arguments);
    this.errors = [];
  },

  didUpdateAttrs() {
    this._super(...arguments);
    this.set('errors', []);
  },

  actions: {
    required(event) {
      if (!event.target.value) {
        this.get('errors').pushObject({ message: `${event.target.name} is required`});
      }
    }
  }
});
```

You can easily create a component using the Ember CLI's `generate` command like so:

```bash
ember generate component student-list
```

This creates a component file at `app/components/student-list.js`, a template for the component at `app/templates/components/student-list.hbs`, and an integration test file at `tests/integration/components/student-list-test.js`.

### Controllers

Ember Controllers are routable objects meant to decorate a model with display logic. They sit between the template and model to deal with logic and properties that do not belong to the view or the model. 

When you have a property that needs to be in the template but doesn't exist in the model, you can place it the controller:

```js
import Ember from 'ember';

export default Ember.Controller.extend({
  canDelete: true
});
```

This property can now be accessed in the template:

{% highlight html %}
{% raw %}

{{#if canDelete}}
// Go ahead and delete the student
{{/if}}

{% endraw %}
{% endhighlight %}

The controller can also be used to make model data more readable to the user. An example is returning the fullname of the user:

```js
import Ember from 'ember';

export default Ember.Controller.extend({
  getFullName() {
    return `${this.get('model.firstName')} - ${this.get('model.lastName')}`
  }
});
```

We can just call `getFullName` in the template:


{% highlight html %}
{% raw %}
  <span>{{ getFullName }} is the senior prefect.</span>
{% endraw %}
{% endhighlight %}

You can easily create a controller using the Ember CLI's `generate` command like so:

```bash
ember generate controller students
```

This creates a controller file at `app/controllers/students.js`, and a unit test file at `tests/unit/controllers/students-test.js`.


Next, let's build an application with *Emberjs 2*.

## Our App: Whistle Blower 

![Whistle Blower](https://cdn.auth0.com/blog/emberjsauth/appscreenshot.png)

The app we will build today is called `Whistle Blower`. A *Whistle Blower* is a person who exposes any kind of information or activity that is deemed illegal, unethical, or not correct within an organization that is either private or public. The Whistle Blower app does the following:

* It gives information about whistle blowing activities in your region. 
* It's a small community of whistle blowers. 
* A guest user on the *Whistle Blower* app will only have acess to basic information about the whistle blowing activities on the landing page. 
* An authenticated user will have access to whistle blowers and their profile.
* An authenticated user will have access to whistle blower meetups/gatherings.

## Build The Back-End

Let's build an API for our app. We'll quickly build the API with [Node.js](https://nodejs.org). The API is simple. This is what we need:

* An endpoint to serve latest whistle blowing activities in a region - `/api/activities`.
* An endpoint to serve whistle blowers and their profile - `/api/whistleblowers`. 
* An endpoint to serve whistle blower meetups - `/api/meetups`.
* Securing the endpoint that serves whistle blowers profiles and meetups, so that it can only be accessed by registered users.

Go ahead and fetch the [Node.js backend from GitHub](https://github.com/auth0-blog/emberjs2authenticationtutorial/blob/master/server/).

**Note:** We'll be securing the backend with Auth0, so make sure you have an account already or [sign up](javascript:signup\(\)) for one. 

Your `server.js` should look like this:

```js
'use strict';

const express = require('express');
const app = express();
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const authCheck = jwt({
  secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://{YOUR-AUTH0-DOMAIN}/.well-known/jwks.json"
    }),
    // This is the identifier we set when we created the API
    audience: '{YOUR-API-AUDIENCE-ATTRIBUTE}',
    issuer: "{YOUR-AUTH0-DOMAIN}",
    algorithms: ['RS256']
});

app.get('/api/activities', (req, res) => {
  let whistleBlowerActivities = [
  {
    title: '200 Million dollars cash found in Burger King, Utah',
    location: 'Salt Lake City, Utah, America'
  },
  {
    title: '52 billion naira found by EFCC in a Bungalow in Ikoyi',
    location: 'Lagos, Nigeria',
  },
  {
    title: '2 Million Kenyan Shillings found in Yaya Supermarket laundry',
    location: 'Nairobi, Kenya',
  },
  {
    title: '10 Ferraris discovered in underground apartment in Bueno Aires',
    location: 'Bueno Aires, Argentina',
  },
  {
    title: 'Central Bank Printing Machine found in a church at Guanajuato',
    location: 'Guanajuato, Mexico',
  }];

  res.json(whistleBlowerActivities);
})

app.get('/api/whistleblowers', (req,res) => {
  let whistleBlowers = [
  {
    id: 1111,
    name: 'Mark Fish',
    level: 'Junior Whistle Blower',
    avatar: 'http://svgavatars.com/style/svg/11.svg',
    uncoveredSpoils: 2
  },
  {
    id: 1112,
    name: 'Garly Sticker',
    level: 'Intermediate Whistle Blower',
    avatar: 'http://svgavatars.com/style/svg/01.svg',
    uncoveredSpoils: 10
  },
  {
    id: 1113,
    name: 'Prosper Otemuyiwa',
    level: 'Senior Whistle Blower',
    avatar: 'http://svgavatars.com/style/svg/15.svg',
    uncoveredSpoils: 186
  },
  {
    id: 1114,
    name: 'Lovelyn Tigereek',
    level: 'Intermediate Whistle Blower',
    avatar: 'http://svgavatars.com/style/svg/02.svg',
    uncoveredSpoils: 25
  },
  {
    id: 1115,
    name: 'Thank-God Okogbulor',
    level: 'Senior Whistle Blower',
    avatar: 'http://svgavatars.com/style/svg/03.svg',
    uncoveredSpoils: 174
  }];

  res.json(whistleBlowers);
})

app.get('/api/meetups', (req,res) => {
  let meetups = [
  {
    name: 'WhistleBlower London Meetup',
    date: '25, May 2017'
  },
  {
    name: 'WhistleBlower Lagos Meetup',
    date: '5, August 2017'
  },
  {
    name: 'WhistleBlower Nairobi Meetup',
    date: '15, September 2017'
  },
  {
    name: 'WhistleBlower Utah Meetup',
    date: '20, August 2017'
  },
  {
    name: 'WhistleBlower Oslo Meetup',
    date: '7, October 2017'
  }];

  res.json(meetups);
})

app.listen(3333);
console.log('Listening on localhost:3333');
```

Check out the [full server.js file here](https://github.com/auth0-blog/emberjs2authenticationtutorial/blob/master/server/server.js).

**Note:** `YOUR-AUTH0-DOMAIN` should be replaced with your Auth0 domain.

_server.js_

Your `package.json` file should look like this:

```js
{
  "name": "whistleblower",
  "version": "0.0.1",
  "description": "",
  "main": "server.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "author": "Auth0",
  "license": "MIT",
  "dependencies": {
    "body-parser": "^1.15.2",
    "cors": "^2.8.1",
    "express": "^4.14.0",
    "express-jwt": "^3.4.0",
    "jwks-rsa": "^1.1.1"
  }
}
```

> **Note:** Make sure you have [`nodemon`](https://github.com/remy/nodemon) installed globally.

_package.json_

Once you have cloned the project, run an `npm install`, then use [postman](https://www.getpostman.com) to serve your routes like so:

![API serving meetups](https://cdn.auth0.com/blog/emberjsauth/meetups.png)
_API serving meetups_

![API serving whistle blowers](https://cdn.auth0.com/blog/emberjsauth/whistleblowersapi.png)
_API serving whistle blowers_

![API serving whistle blowing activities](https://cdn.auth0.com/blog/emberjsauth/activities.png)
_API serving whistle blowing activities_

The public whistle blowing activities endpoint should be `http://localhost:3333/api/activities`.

The private meetup endpoint should be `http://localhost:3333/api/meetups`.

The private whistle blower endpoint should be `http://localhost:3333/api/whistleblowers`.

Don't worry about the middleware in charge of securing our endpoint for now. We'll deal with that later. Now, let's build our frontend with EmberJS 2. 

## Build The Front-End With EmberJS 2

**EmberJS** has a very nice tool for scaffolding your apps. It's called the [ember-cli](https://github.com/ember-cli/ember-cli). It's being maintained by the Ember team.

Go ahead and install the ember-cli tool globally like so:

```bash

npm install -g ember-cli

```

After installing globally, go ahead and scaffold a new **EmberJS 2** app like so:

```bash

ember new whistleblower

```

![Provisioning a new ember app](https://cdn.auth0.com/blog/emberjsauth/installation.png)

Move into the new directory, `whistleblower` and run `ember serve` to start up your app.

![Default Page](https://cdn.auth0.com/blog/emberjsauth/defaultpage.png)

Let's check out the structure of our newly scaffolded app.

![Scaffolded App](https://cdn.auth0.com/blog/emberjsauth/appstructure.png)

```bash
whistleblower/
  app/ - All the controllers, components, routes and templates reside here
  config/ - All environment config files are here
  node_modules/ - All the packages required for the emberjs app resides here
  public/
  tests/ - All the tests file resides here
  vendor/
  .editorconfig 
  .ember-cli
  .eslintrc.js
  .gitignore
  .travis.yml
  .watchmanconfig
  ember-cli-build.js
  package.json - File that contains the names of all the packages residing in node_modules folder
  README.md
  testem.js
```

**Note:** We are not writing any tests for this application. It's out of the scope of this tutorial.

We need to remove the default page content that ember presents in our app. Open `app/templates/application.hbs` file and remove this:

{% highlight html %}
{% raw %}

{!-- The following component displays Ember's default welcome message. --}}
{{welcome-page}}
{{!-- Feel free to remove this! --}}

{% endraw %}
{% endhighlight %}

Now, our app will show a blank screen. Sweet! let's get started.

## Style with Bootstrap

Go ahead and open `app/index.html` file. Here, we will add the link to the bootstrap css and js file:

{% highlight html %}
{% raw %}

<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Whistleblower</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{content-for "head"}}

    <link rel="stylesheet" href="{{rootURL}}assets/vendor.css">
    <link rel="stylesheet" href="{{rootURL}}assets/whistleblower.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">


    {{content-for "head-footer"}}
  </head>
  <body>
    {{content-for "body"}}

    <script src="{{rootURL}}assets/vendor.js"></script>
    <script src="{{rootURL}}assets/whistleblower.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js">

    {{content-for "body-footer"}}
  </body>
</html>

{% endraw %}
{% endhighlight %}

Ember already provides a directory and a stylesheet file for your custom css. So, open `app/styles/app.css` and add the [css here](https://github.com/auth0-blog/emberjs2authenticationtutorial/blob/master/app/styles/app.css).

That's all about our styling. Next, let's create our routes.

## Create the Routes

We need users to be able to access a URL:

* that provides details about whistle blower meetups.
* that provides details about whistle blowers.

We also need a callback URL. I'll tell why we need that later in the tutorial. Let's create these routes ASAP. The *ember-cli* provides generator commands that makes this easy. So go ahead and run the following commands in your terminal:

```bash
ember generate route whistle-blowers
ember generate route meetups
ember generate route callback
```

The route files are generated together with their respective template files. EmberJS route handler renders a template when a route is invoked. 

## Building the Nav Component

Let's build the Nav Component. This component will be shared amongst all the pages. Generate the component using the *ember-cli*:

```bash
ember generate component app-nav
```

This command generates a component and a template for the app nav. Open up `app/templates/components/app-nav.hbs` and add this to it:

{% highlight html %}
{% raw %}

<nav class="navbar navbar-default">
    <div class="navbar-header">
       Whistle Blower 
    </div>

    <ul class="nav navbar-nav navbar-right">
      <li>
      
            <button class="btn btn-danger log">Log out</button>
      
            <button class="btn btn-info log">Log In</button>
     
      </li>
    </ul>
</nav>

{% endraw %}
{% endhighlight %}

Now, next we need to create an utility file for authentication and fetching API data for our routes from the backend. Well, Ember allows us to create utilities, but this is better suited for services. An Ember service is a long lived Ember object that can be made available in different parts of your application. This is exactly what we need.

## Creating Services

We need to create two services, the auth and api service. The former for everything related to user authentication and the latter for fetching API data from our server. Go ahead and create both services using the ember-cli:

```bash
ember generate service auth
ember generate service whistleblowerapi
```

`app/services/auth.js` and `app/services/whistleblowerapi.js` will be created. Now, open the auth service and add this to it:

_app/services/auth.js_

```js
import Ember from 'ember';
import decode from 'npm:jwt-decode';
import auth0 from 'npm:auth0-js';
const ID_TOKEN_KEY = 'id_token';
const ACCESS_TOKEN_KEY = 'access_token';

const CLIENT_ID = '{AUTH0_CLIENT_ID}';
const CLIENT_DOMAIN = '{AUTH0_DOMAIN}';
const REDIRECT = '{CALLBACK_URL}';
const SCOPE = '{SCOPE}';
const AUDIENCE = '{API IDENTIFIER}';

export default Ember.Service.extend({

    auth: new auth0.WebAuth({
        clientID: CLIENT_ID,
        domain: CLIENT_DOMAIN
    }),

    login() {
        this.get('auth').authorize({
            responseType: 'token id_token',
            redirectUri: REDIRECT,
            audience: AUDIENCE,
            scope: SCOPE
        });
    },

    logout() {
        this.clearIdToken();
        this.clearAccessToken();
        window.location.href = "/";
    },

    getIdToken() {
        return localStorage.getItem(ID_TOKEN_KEY);
    },

    getAccessToken() {
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    },

    clearIdToken() {
        localStorage.removeItem(ID_TOKEN_KEY);
    },

    clearAccessToken() {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
    },

    // Helper function that will allow us to extract the access_token and id_token
    getParameterByName(name) {
        let match = RegExp('[#&]' + name + '=([^&]*)').exec(window.location.hash);
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    },

    // Get and store access_token in local storage
    setAccessToken() {
        let accessToken = this.getParameterByName('access_token');
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    },

    // Get and store id_token in local storage
    setIdToken() {
        let idToken = this.getParameterByName('id_token');
        localStorage.setItem(ID_TOKEN_KEY, idToken);
    },

    isLoggedIn() {
        const idToken = this.getIdToken();
        return !!idToken && !this.isTokenExpired(idToken);
    },

    getTokenExpirationDate(encodedToken) {
        const token = decode(encodedToken);
        if (!token.exp) { return null; }

        const date = new Date(0);
        date.setUTCSeconds(token.exp);

        return date;
    },

    isTokenExpired(token) {
        const expirationDate = this.getTokenExpirationDate(token);
        return expirationDate < new Date();
    }
});
```

Go ahead and install the `auth0-js` and `jwt-decode` packages from the terminal:

```bash
npm install auth0-js jwt-decode --save
```

> Our auth service contain different functions for authenticating using auth0 hosted lock,saving/extracting tokens, checking expiry date and checking if a user is logged in or not.

**Note:** You fetch an property in a service using the `this.get('<name-of-property>')` syntax.

Now, you might have noticed that we are importing them, using this syntax `import module from npm:package`. It turns out that CommonJS(Node) module doesn't play nice with ES6 import statements in Ember. It throws an error indicating that the module can't be found. As usual, we got a work around. To get our  NPM CommonJS version of our node modules to work with our ES6 import, all we have to do is:

```bash
ember install ember-browserify
```

and append `npm` to the module name like we did in the code snippet for the auth service above.

Open the whistleblower api service and add this to it:

_app/services/whistleblowerapi.js_

```js
import Ember from 'ember';
import axios from 'npm:axios';

const ACCESS_TOKEN_KEY = 'access_token';
const BASE_URL = 'http://localhost:3333';

export default Ember.Service.extend({

    getMeetups() {
        const url = `${BASE_URL}/api/meetups`;
        return axios.get(url, { headers: { Authorization: `Bearer ${this.getAccessToken()}` }}).then(response => response.data);
    },

    getWhistleBlowers() {
        const url = `${BASE_URL}/api/whistleblowers`;
        return axios.get(url, { headers: { Authorization: `Bearer ${this.getAccessToken()}` }}).then(response => response.data);
    },

    getActivities() {
        const url = `${BASE_URL}/api/activities`;
        return axios.get(url).then(response => response.data);
    },

    getAccessToken() {
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    }
});
```

Install the `axios` module via your terminal:

```bash
npm install axios --save
```

> Here, we fetched the meetups, whistleblowers and activities from the API. Now, Ember already provides jQuery by default. So, an alternative is to use `Ember.$.get(url)` instead of axios. I personally love using axios, hence the reason I chose to use it here.

Ember Services are injectable. You can inject them into different parts of your application as the need arises.

## Build the Routes

We have created our routes already. Now we need to pass data to the templates of these routes. Once a user hits a URL, they should be able to get data presented to them.

Ember provides a `model` method in routes that allows us fetch data and pass it down to the route template. So, we'll add the model method into our routes, inject the api service and call the api service methods to provide data to the model hook so that it can be passed down to the templates.

Open `app/routes/meetups.js` and add this:

```js
import Ember from 'ember';

export default Ember.Route.extend({

    api: Ember.inject.service('whistleblowerapi'),

    model() {
        return this.get('api').getMeetups();
    }
});
```
_app/routes/meetups.js_

Open `app/routes/whistle-blowers.js` and add this:

```js
import Ember from 'ember';

export default Ember.Route.extend({

    api: Ember.inject.service('whistleblowerapi'),
  
    model() {
        return this.get('api').getMeetups();
    }
});
```
_app/routes/whistle-blowers.js_

Now, we need to create a route for our index page, which is the landing page. 

```bash
ember generate route index
```

Open `app/routes/index` and add this:

```js
import Ember from 'ember';

export default Ember.Route.extend({
    
    api: Ember.inject.service('whistleblowerapi'),

    model() {
        return this.get('api').getActivities();
    }
});
```
_app/routes/index.js_

Next, we need to display data in their respective templates.

## Bring Templates to Life

Open `app/templates/index.hbs` and add this:

{% highlight html %}
{% raw %}

{{app-nav}}

<div class="container">
    <h3 class="text-center">Whistle Blowing Updates From Across The World</h3>
</div>

<br/>

{{#each model as |update|}}
    <div class="col-sm-6">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title"> {{ update.title }} </h3>
        </div>
        <div class="panel-body">
          <p><span class="badge alert-danger"> Location: </span><strong> {{ update.location }} </strong></p>
        </div>
      </div>
    </div>
{{/each}}

{% endraw %}
{% endhighlight %}

> We imported the app-nav component into this template to provide navigation menu for our app.

We also looped through the model data coming from the index route using the `#each` helper method.

Open `app/templates/meetups.hbs` and add this:

{% highlight html %}
{% raw %}

{{app-nav}}

<div class="container">
    <h3 class="text-center">Whistle Blower Meetups Across The World </h3>
</div>

<br/>

{{#each model as |meetup|}}
    <div class="col-sm-6">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title"> {{ meetup.name }} </h3>
        </div>
        <div class="panel-body">
          <p><span class="badge alert-danger"> Location: </span><strong> {{ meetup.date }} </strong></p>
        </div>
      </div>
    </div>
{{/each}}

{{outlet}}

{% endraw %}
{% endhighlight %}


Open `app/templates/whistle-blowers.hbs` and add this:

{% highlight html %}
{% raw %}

{{app-nav}}

<div class="container">
    <h3 class="text-center">Whistle Blowers Across The World </h3>
</div>

<br/>

{{#each model as |whistleblower|}}
    <div class="col-lg-2 col-sm-4">
        <div class="card hovercard">
            <div class="cardheader">
            </div>
            <div class="avatar">
                <img alt="" src="{{whistleblower.avatar}}">
            </div>
            <div class="info">
                <div class="title">
                    <a target="_blank" href="http://scripteden.com/">{{ whistleblower.name }}</a>
                </div>
                <div class="desc">
                    <p><strong>{{whistleblower.level}}</strong></p></div>
                <div class="desc">
                    <p><span class="badge alert-danger"> Uncovered Spoils: </span> {{whistleblower.uncoveredSpoils}} </p></div>
            </div>
        </div>
    </div>
{{/each}}

{{outlet}}

{% endraw %}
{% endhighlight %}

Go to your browser and check out all the routes. They should be displaying the right data:

![Index page](https://cdn.auth0.com/blog/emberjsauth/indexpage.png)
_Landing page_

![Meetups route](https://cdn.auth0.com/blog/emberjs/meetupspage.png)
_Meetups Route_

![Whistleblowers route](https://cdn.auth0.com/blog/emberjsauth/whistleblowerspage.png)
_Whistleblowers route_

Next, let's add authentication to our app.

## Adding Authentication to Your EmberJS 2 App

The majority of the apps we use on a daily basis have a means of authenticating users. I'll show you how to easily add authentication to our **Emberjs 2** application. We'll use [Auth0](https://auth0.com/) as our authentication service.

Auth0 allows us to issue [JSON Web Tokens (JWTs)](https://jwt.io). If you don't already have an Auth0 account, [sign up](javascript:signup\(\)) for a free one now.

Login to your Auth0 [management dashboard](https://manage.auth0.com) and let's create a new API client. If you don't already have the APIs menu item, you can enable it by going to your [Account Settings](https://manage.auth0.com/#/account/advanced) and in the **Advanced** tab, scroll down until you see **Enable APIs Section** and flip the switch.

From here, click on the APIs menu item and then the **Create API** button. You will need to give your API a name and an identifier. The name can be anything you choose, so make it as descriptive as you want. The identifier will be used to identify your API, this field cannot be changed once set. For our example, I'll name the API **Startup Battle API** and for the identifier I'll set it as **http://whistleblower.com**. We'll leave the signing algorithm as RS256 and click on the **Create API** button.

![Creating the Whistle Blower API](https://cdn.auth0.com/blog/emberjsauth/createwhistleblowersapi.png)
_Creating the Whistle Blower API_

Next, let's define some scopes for our API. Scopes allow us to manage access to our API. We can define as few or as many scopes as we want. For our simple example, we'll just create a single scope that will grant users full access to the API.

![Locate scopes bar](https://cdn.auth0.com/blog/emberjsauth/whistleblowerscope.png)
_Locate Scopes bar_

![Adding Scope to API](https://cdn.auth0.com/blog/emberjsauth/addscopes.png)
_Adding scope_

### Secure The Node API

We need to secure the API so that the meetups and whistle blowers endpoints will only be accessible to authenticated users. We can secure it easily with Auth0.

Open up your `server.js` file and add the `authCheck` middleware to the private battles endpoint like so:

```js

app.get('/api/meetups', authCheck, (req,res) => {
  let meetups = [
    // Array of meetups
  ];

  res.json(meetups);
})

app.get('/api/whistleblowers', authCheck, (req,res) => {
  let whistleBlowers = [
    // Array of whistle blowers
  ];

  res.json(whistleBlowers);
})

app.listen(3333);
console.log('Listening on localhost:3333');

```

Try accessing the `http://localhost:3333/api/meetups` endpoint again from Postman. You should be denied access like so:

![Unauthorized Access](https://cdn.auth0.com/blog/emberjsauth/restrictaccesstomeetups.png)
_Unauthorized Access_

Next, let's add authentication to our front-end.

### Adding Authentication to our EmberJS 2 Front-end

We created an `auth` service earlier. Open up `app/services/auth.js` again.

In the code present in this file, we are using an hosted version of Auth0 Lock in the `login` method and passed in our credentials. 

The auth0 package calls the Auth0's authorize endpoint. With all the details we passed to the method, our client app will be validated and authorized to perform authentication. You can learn more about the specific values that can be passed to the authorize method [here](https://auth0.com/docs/libraries/auth0js/v8#login).

The parameters that you do not have yet are the `{AUTH0-CLIENT-ID}` and the `{CALLBACK-URL}`. This will be an Auth0 client. When you created your API, Auth0 also created a test client which you can use. Additionally, you can use any existing Auth0 client found in Clients section of your [management dashboard](https://manage.auth0.com/#/clients). 

Check the `Test` panel of your API from the dashboard. You'll see the test client like so:

![Startup Client](https://cdn.auth0.com/blog/emberjsauth/whistleblowerclient.png)
_WhistleBlower API Client_

Now, go to the clients area and check for the test client. Open the client and change the **Client Type**from `Non Interactive Client` to `Single Page Application`.

> Non interactive clients are meant to be used in machine to machine interactions. We are using an SPA to interact with the API so the client should be an SPA client. Check out [Implicit Grant](https://auth0.com/docs/api-auth/grant/implicit) and [client credentials exchange](https://auth0.com/docs/api-auth/grant/client-credentials) for more information.

Copy the **CLIENT ID** and replace it with the value of `CLIENT-ID` constant variable. Replace your callback url with `http://localhost:4200/callback`. Replace your client domain, scope and audience values with the domain from your Auth0 dashboard, scope from your API and API identifier respectively.

We checked whether the token has expired via the `getTokenExpirationDate` and `isTokenExpired` methods. The `isLoggedIn` method returns `true` or `false` based on the presence and validity of a user `id_token`.

Let's go update the `app-nav` component to hide/show the `login` and `logout` buttons based on the user's authentication status.

Now, your `app-nav` component template file should look like this:

{% highlight html %}
{% raw %}

<nav class="navbar navbar-default">
    <div class="navbar-header">
      {{#link-to 'index' class="navbar-brand"}} Whistle Blower {{/link-to}}
    </div>

    <ul class="nav navbar-nav">
        <li>
            {{#if loggedIn }}
                {{#link-to 'meetups' class="navbar-brand"}} Meetups {{/link-to}}
                {{#link-to 'whistle-blowers' class="navbar-brand"}} Whistle Blowers {{/link-to}}
            {{/if}}
        </li>
    </ul>

    <ul class="nav navbar-nav navbar-right">
      <li>
        {{#if loggedIn }}
            <button {{ action "logout" }} class="btn btn-danger log">Log out</button>
        {{else}}
            <button {{ action "login" }} class="btn btn-info log">Log In</button>
        {{/if}}
      </li>
    </ul>
</nav>

{% endraw %}
{% endhighlight %}
 
_app/templates/components/app-nav.hbs_

Now, we used some handlebars helpers in the code above such as `#if` for conditional operations, `#link-to` for linking to a route.

We have a `loggedIn` variable that is set as a flag for alternating the display of the `login` and `logout` buttons. Now, where did that variable come from?

Open the component file responsible for the `app-nav` template and add this:

```js
import Ember from 'ember';

export default Ember.Component.extend({
    auth: Ember.inject.service('auth'),

    init() {
        this._super(...arguments);
        this.set('loggedIn', this.get('auth').isLoggedIn());
    },

    actions: {
        login() {
            this.get('auth').login();
        },
        logout() {
            this.get('auth').logout();
        }
    }
});
```

_app/components/app-nav.js_

We injected the `auth` service. Then we called the `init` method which is a component hook that is called whenever a component is been initialized. In the `init` method, we set a variable `loggedIn` with the value of the user's authentication status gotten from the `auth` service.

> `this._super(..arguments)` has to be called to override the init method that ships with Ember components.

Next, we defined the `actions`. In Ember, components use actions to communicate events and changes. The methods defined in the actions object get called when the user needs to trigger an action on the UI either via buttons or any form field elements.

In our `app-nav` template, we have the `logout` and `login` buttons that trigger some actions:

{% highlight html %}
{% raw %}

{{#if loggedIn }}
  <button {{ action "logout" }} class="btn btn-danger log">Log out</button>
{{else}}
  <button {{ action "login" }} class="btn btn-info log">Log In</button>
{{/if}}

{% endraw %}
{% endhighlight %}

### Activate the Callback Route

We created a callback route earlier. This route will be called when a redirect is made from Auth0 after a successful authentication. The route will process the redirect and store the `access_token` and `id_token` coming from Auth0. Open `app/routes/callback.js` and add this:

```js
import Ember from 'ember';

export default Ember.Route.extend({

    auth: Ember.inject.service('auth'),
    
    beforeModel() {
        this.get('auth').setAccessToken();
        this.get('auth').setIdToken();
        this.transitionTo('/');
    },
});
```
_app/routes/callback.js_

Once a user is authenticated, Auth0 will redirect back to our application and call the `/callback` route. Auth0 will also append the `id_token` as well as the `access_token` to this request, and our callback route will make sure to properly process and store those tokens in localStorage. If all is well, meaning we recieved an `id_token`, `access_token`, we will be redirected back to the `/` page and will be in a logged in state.

> Ember Routes provide a `beforeModel` hook that is called before the model is initialized. It can be used to conditionally prevent access to a route. It can also be used to perfom some actions like a middleware.

### Add some values to Auth0 Dashboard

Just before you try to log in or sign up, head over to your [Auth0 dashboard](https://manage.auth0.com/#/) and add `http://localhost:4200/callback` to the **Allowed Callback URLs** and `http://localhost:4200` to **Allowed Origins (CORS)** of your client.

### Secure Meetups and WhistleBlowers Routes

We need to ensure that no one can go to the browser and just type `/meetups` and `whistle-blowers` to access the meetups and whistleblowers routes respectively.

Open up `app/routes/meetups.js`. Modify it to have the `beforeModel` hook and inject the `auth` service:

```js
import Ember from 'ember';

export default Ember.Route.extend({

    auth: Ember.inject.service('auth'),

    api: Ember.inject.service('whistleblowerapi'),
    
    beforeModel() {
        if(!this.get('auth').isLoggedIn()) {
            this.transitionTo('/');
        }
    },

    model() {
        return this.get('api').getMeetups();
    }
});
```
_app/routes/meetups.js_

Open up `app/routes/whistle-blowers.js`. Modify it to also have the `beforeModel` hook and inject the `auth` service:

```js
import Ember from 'ember';

export default Ember.Route.extend({

    auth: Ember.inject.service('auth'),

    api: Ember.inject.service('whistleblowerapi'),
    
    beforeModel() {
        if(!this.get('auth').isLoggedIn()) {
            this.transitionTo('/');
        }
    },

    model() {
        return this.get('api').getWhistleBlowers();
    }
});
```
_app/routes/whistle-blowers.js_

In both routes, just before the model initializes, we check if the user is logged in. If the user has not be authenticated, we redirect the user back to the landing page.

Now, try to log in.

![Lock Login Widget](https://cdn.auth0.com/blog/emberjsauth/login.png)
_Lock Login Widget_

For the first time, the user will be shown a user consent dialog that will show the scope available. Once a user authorizes, it goes ahead to login the user and give him access based on the scopes.

![User consent dialog](https://cdn.auth0.com/blog/emberjsauth/authorize.png)
_User presented with an option to authorize_

**Note:** Since we are using `localhost` for our domain, once a user logs in the first time, subsequent logins will not need a user consent authorization dialog. This consent dialog will not be displayed if you are using a non-localhost domain, and the client is a first-party client.

![Logged In and Athorized to see the private meetups page](https://cdn.auth0.com/blog/emberjsauth/authorizedmeetups.png)
_Logged In and authorized see the private meetups page_

![Logged In and Athorized to see the private whistleblowers page](https://cdn.auth0.com/blog/emberjsauth/authorizedwhistleblowers.png)
_Logged In and authorized to see the private whistleblowers page_

We have successfully logged in and can access the content of both private routes. We passed an option to send an `Authorization` header with a Bearer `access_token` along with the `GET` request in our api service. The request sends the JWT to the secured backend. The backend verifies it. If it is valid, the user is granted access to the resources.

```js
...
  getMeetups() {
        const url = `${BASE_URL}/api/meetups`;
        return axios.get(url, { headers: { Authorization: `Bearer ${this.getAccessToken()}` }}).then(response => response.data);
    },

    getWhistleBlowers() {
        const url = `${BASE_URL}/api/whistleblowers`;
        return axios.get(url, { headers: { Authorization: `Bearer ${this.getAccessToken()}` }}).then(response => response.data);
    },
...
```

What happens if we don't send an `access_token`? Go ahead and remove the Authorization header. Make the request a plain get request that doesn't send any JWT to the backend.

Aha, we get a blank page. The Chrome Dev tools shows us that we are unauthorized to make that request.

![Unauthorized](https://cdn.auth0.com/blog/emberjsauth/401unauthorized.png)
_401 Unauthorized_

You have just successfully built a **Vuejs 2** app and added authentication to it! 

**Important API Security Note:** Anytime you intend using Auth0 authentication to authorize _API requests_, note that you'll need to use [a different flow depending on your use case](https://auth0.com/docs/api-auth/which-oauth-flow-to-use). Auth0 `idToken` should only be used on the client-side. [Access tokens should be used to authorize APIs](https://auth0.com/blog/why-should-use-accesstokens-to-secure-an-api/). You can read more about [making API calls with Auth0 here](https://auth0.com/docs/apis).

## Conclusion

You have just successfully built an **EmberJS 2** app and added authentication to it. To be honest, Ember has a steep learning curve. It takes a while to navigate where to find different files and where to put certain logic but once you get a hang of it, then it becomes a [Saber](http://www.dictionary.com/browse/saber) for architecting and building ambitious web applications.

In addition, Auth0 can help secure your **EmberJS** apps with more than just username-password authentication. It provides features like [multifactor auth](https://auth0.com/docs/multifactor-authentication), [anomaly detection](https://auth0.com/docs/anomaly-detection), [enterprise federation](https://auth0.com/docs/identityproviders), [single sign on (SSO)](https://auth0.com/docs/sso), and more. [Sign up](javascript:signup\(\)) today so you can focus on building features unique to your app.
