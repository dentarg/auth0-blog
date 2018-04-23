---
layout: post
title: "Developing AngularJS Applications - Part 2: Component-Based Application"
description: "Learn how to develop applications in AngularJS using a component-based architecture.""
longdescription: "Build AngularJS applications using newer features such as one-way dataflow, component-based architecture, lifecycle hooks, updated UI router flow. Components all the way."
date: 2018-04-22 8:30
category: Technical Guide, Frontend, AngularJS
author:
  name: Prosper Otemuyiwa
  url: https://twitter.com/unicodeveloper?lang=en
  avatar: https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200
  mail: prosper.otemuyiwa@auth0.com
design:
  bg_color: "#222228"
  image: https://cdn.auth0.com/blog/jsdeploy/logo.png
tags:
- angularjs
- javascript
- authentication
- web-app
- auth0
- components
related:
- 2016-01-04-secure-your-react-and-redux-app-with-jwt-authentication
- 2016-09-29-angular-2-authentication
- 2017-02-21-reactjs-authentication-tutorial
---

---

**TL;DR:** In this article, you'll develop a simple application in AngularJS 1.5. This application will show you how to use some of the features discussed in [Part 1 of this tutorial](#) to build component-based AngularJS applications. If you want to skip the tutorial and dive straight into the code, the [repo](https://github.com/auth0-blog/speakerhang) is publicly available.

---

Before AngularJS 1.5, developers relied solely on directives to be able to build reusable components in their applications. Currently, AngularJS 1.5+ offers the ability to use the `.component()` method to build isolated and reusable components like `React` and `Angular` applications.

## Introducing SpeakerHang

I admire several developers in the community because of their works, and one of them is [Nadia Odunayo](http://twitter.com/nodunayo). She's a Ruby developer and regular conference speaker. She built a pretty popular side project called [Speakerline](http://speakerline.io). Speakerline is an open source project to help demystify the tech conference CFP process for new speakers. The project is built in Rails. 

SpeakerHang, the project we'll build in this tutorial is largely inspired by Speakerline. It's a simpler version. SpeakerHang displays a list of conference speakers and their details. It also allows you to add a speaker. Worthy of note here is that there is no database or external REST API. The Speakers are added to a temporary in-memory store, array. The crux of this guide is to teach you how to build a component-based AngularJS application easily.

## Visualizing SpeakerHang

The best way to build apps is to visualize how the end product will look. Let's think about SpeakerHang in components. Check out the visualization below:

![SpeakerHang - Initial component visualization](https://cdn.auth0.com/blog/speakerhang/navbaraddspeaker.png)
_SpeakerHang - Component Visualization_

![SpeakerHang - Component Visualization](https://cdn.auth0.com/blog/speakerhang/components.png)
_SpeakerHang - Component Visualization_

From the diagram above, our visualization produced four components.

* First component for navigation.
* Second component for **Add Speaker** form.
* Third component for **Add Speaker** container.
* Fourth component for list of speakers.

**NOTE:** You can break up your app into as many components as you want, but be careful not to overengineer the process.

## Build SpeakerHang

I have a [starterpack](https://github.com/unicodeveloper/angularjs-starter) already configured for building AngularJS 1.5+ apps. The starterpack ships with webpack, sass compilation, autoreload, ES6 transpiling, component generation, angularjs uirouter, and test files generator. It's a forked and enhanced version of [NG6-Starter](https://github.com/gebidesign/NG6-starter-sass).

Clone the AngularJS starterpack, `cd` into the directory and run `npm install` to install all the dependencies.

Run `gulp serve` to start the starterpack app.

Your app should look like the diagram below:

![AngularJS Starter Pack](https://cdn.auth0.com/blog/speakerhang/starterpackindex.png)
_AngularJS Starter Pack Index_


Before proceeding, I'll like you to delete the following:

* The `app/common` directory.
* This line in `app/app.js`: `import Common from './common/common';`
* Remove `Common` from the required  dependencies in `angular.module` in `app.js`.
* The `about`, `home` components folder and `components.js` file in `app/components` directory.
* This line in `app/app.js`: `import Components from './components/components';`
* Remove `Components` from the required dependencies in `angular.module` in `app.js`.

Now, your app should show a blank page. If there are no errors, then you are on track.

### Set Up Routes

We'll nake use of the efficient [UIRouter](https://ui-router.github.io/ng1/). Open up `app.js` and replace the content with the code below:

```js
import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import AppComponent from './app.component';
import 'normalize.css';
import 'skeleton.css/skeleton.css';
import './app.scss';

angular.module('app', [
    uiRouter
  ])
  .config(($locationProvider, $stateProvider, $urlRouterProvider) => {
    "ngInject";

    $stateProvider
      .state('app', {
        url: '/app',
        abstract: true,
        template: '<app></app>'
      })

      .state('home', {
        url: '/home',
        template: '<h4>The Home of Speakers in the Developer Community</h4>'
      });

   // Default page for the router
   $urlRouterProvider.otherwise('/home');
  })

  .component('app', AppComponent);
```

In the code above, we defined the `home` and `app` state. We also configured the default page for the app. The default page that will be rendered when a user visits the app is the `/home` route. The `/home` route renders the template. 

**Note:** The template can be a component or simply a string.

Your app should render look like this below:

![SpeakerHang - Home Index](https://cdn.auth0.com/blog/speakerhang/homeindex.png)
_SpeakerHang - Home Index_

### Craft Components - NavBar

It's time to build our components. Earlier, we visualized the SpeakerHang app and came up with four components. 

* NavBar component
* Add Speaker Container component
* Speaker form component
* Speaker list component

Let's start with the NavBar component. 

Run the following command in your terminal to generate a component:

```bash
gulp component --name navbar
```

This command will generate a new component, `navbar`, inside the `components` folder with the following files:

* navar.component.js - The navbar component itself
* navbar.html - The navbar template
* navbar.scss - The style for the navbar template
* navbar.js - The navbar module that ties everything together
* navbar.controller.js - The navbar controller that defines the business logic
* navbar.spec.js - The navbar test file

The first step is to add meat to the navbar template. Replace the content with this:

```html
<div class="navigation">
  <ul>
    <li><a href="#" class="heading">SpeakerHang</a></li>
    <div class="inline align-right">
      <li><a ui-sref="speakers">Speakers</a></li>
      <li><a ui-sref="addspeaker">Add A Speaker</a></li>
    </div>
  </ul>
</div>
<hr>
```

Head over to `app.js` to import the navbar component.

_app/app.js_

```js
...
import NavBarComponent from './components/navbar/navbar';
...

angular.module('app', [
    uiRouter,
    NavBarComponent
  ])
  .config(.....)
  .component('app', AppComponent);
```

We have imported the Navbar component and registered it with our app's module. However, we need to take one more step to make sure it reflects on the page.

Call the `navbar` component in `app/app.html`.

_app/app.html_
```html
<!-- Place all UI elements intended to be present across all routes in this file -->
<div class="container">
  <navbar></navbar>
  <div ui-view></div>
</div>
```

Your app should show the navbar now. Awesome!!!

#### Speaker List component

Let's create the speaker list component. Run the component creation command in the terminal like so:

```bash
gulp component --name speakerlist
```

Now, we have the `speakerlist` components folder. Take a brief pause here. 

The speaker list component should list all the speakers on the platform. The question now is, *Where are the speakers?*, *Where will that data come from?* In a production app, these data will be made available to our app from an API. However, we'll simply make use of an array and use a service.

Let's create the speaker service. Create a new folder, `services`, inside the `app` directory. And create a `speakerservice.js` file inside the `services` folder. 

Add code to the file:

_services/speakerservice.js_

```js
function SpeakerService() {
  "ngInject";

  const speakers = [
    {
        id: 99,
        name: "Prosper Otemuyiwa",
        favConf: "Ruby Conf 2016",
        noOfConf: 13,
        favProgrammingQuote: "A C program is like a fast dance on a newly waxed dance floor by people carrying razors."
    },
    {
        id: 100,
        name: "Funsho Okubanjo",
        favConf: "Laracon 2016",
        noOfConf: 7,
        favProgrammingQuote: "Don’t worry if it doesn’t work right. If everything did, you’d be out of a job."
    },
    {
        id: 101,
        name: "Chilezie Unachukwu",
        favConf: "ReactRally 2017",
        noOfConf: 19,
        favProgrammingQuote: "Good design adds value faster than it adds cost"
    },
    {
        id: 102,
        name: "Damilola Adekoya",
        favConf: "Codefest Russia 2012",
        noOfConf: 25,
        favProgrammingQuote: "Talk is cheap. Show me the code."
    },
  ];

  return {

    // Will retrieve our speakers list for displaying
    getAllSpeakers() {
      return speakers;
    },

    // Creating a Speaker entry based on user input.
    addASpeaker(speaker) {
      const {name, favConf, noOfConf, favProgrammingQuote } = speaker;

      const newSpeaker = { name, favConf, noOfConf, favProgrammingQuote };

      speakers.push(tempSpeaker);
    }
  }
}

export default SpeakerService;
```

In the service above, we have a factory with two functions, `getAllSpeakers` responsible for returning a list of speakers and `addASpeaker`, responsible for adding a speaker.

Now, let's get back to the `speakerlist` component. Open up `app/components/speakerlist/speakerlist.component.js` file. In the `speakerlistComponent` object, we have `bindings`, `template`, `controller`, and `restrict`.

```js
...
let speakerlistComponent = {
  restrict: 'E',
  bindings: {},
  template,
  controller
};
...
```

* `restrict` - This means the component should be restricted to an element.
* `bindings` - This helps specify the binding option whether it's a one-way or two-way data binding. It's represented with a symbol. E.g `<` represents a one-way data binding.
* `template` - This is where we specify the view for the component
* `controller` - This is where we specify the controller which holds the logic for the component. by default, it ships with `$ctrl` as an alias that can be used in the view to invoke controller methods.
* `controllerAs`- This allows developers to specify their alias, e.g `vm` as commonly used in a lot of apps.

Update the `speakerlistComponent` object to have a `controllerAs` key and value like so:

```js
...
let speakerlistComponent = {
  restrict: 'E',
  bindings: {},
  template,
  controller,
  controllerAs: 'vm'
};
...
```

Open up `app/components/speakerlist/speakerlist.controller.js` and modify it like so:

```js
class SpeakerlistController {
  constructor(SpeakerService) {
    "ngInject";
    
    // This will keep the service instance across our class
    this.SpeakerService = SpeakerService;

   
    this.speakers = [];
  }

    // This method will be called each time the component will be initialised,
    // In our case, it will be called for every page route change.
  $onInit() {
    this.speakers = this.SpeakerService.getAllSpeakers();
  }
}

export default SpeakerlistController;
```

In the code above, we injected the `SpeakerService` into the controller and assigned it to an instance variable. The `$onInit()` lifecycle hook was invoked to initialize the speakers array with the list of speakers from the speaker service. The `$onInit()` hook is good for a controller's initialization code.

Update the speaker view, `speakerlist.html`, to have the necessary code to display the list of speakers.

_speakerlist.html_

```html
<section>
  <div class="row">
    <div class="row" ng-repeat="speaker in vm.speakers">
      <div class="four columns">
        <label for="control-label col-sm-2">Speaker Name:</label>
        <input class="u-full-width" type="text" placeholder="{{ speaker.name }}" readonly>
      </div>
      <div class="four columns">
        <label for="control-label col-sm-2">No. Of Conferences Attended: </label>
        <input class="u-full-width" type="text" placeholder="{{ speaker.noOfConf }}" readonly>
      </div>
      <div class="four columns">
        <label for="favConference">Favorite Conference So Far:</label>
        <input class="u-full-width" type="number" placeholder="{{ speaker.favConf }}" readonly>
      </div>
      <label for="FavoriteProgrammingQuote">Favorite Programming Quote:</label>
      <textarea class="u-full-width" placeholder="{{ speaker.favProgrammingQuote }}" readonly></textarea>
      <hr/>
    </div>
  </div>
</section>
```

Now, we need to import the speaker list component in the `app.js` file and define a route for `/speakers`.

Open up `app/app.js`, import the `speakerlist` component and define the `/speakers` route.

```js
...
import SpeakerListComponent from './components/speakerlist/speakerlist';
...
angular.module('app', [
    uiRouter,
    NavBarComponent,
    SpeakerListComponent
  ])
  .config(...
    ...
    // Speaker page to contain list of speakers
    .state('speakers', {
      url: '/speakers',
      template: '<speaker-list></speaker-list>'
    })
    ...

    )
  .component('app', AppComponent);
```

One more step before we can see the list of speakers on the page. Open up `app/app.js` and import the speaker service.

```js
...
import SpeakerService from './services/SpeakerService';
...
```

Now, call the `.factory` method on the angular module and reference the speaker service like so:

_app/app.js_

```js
...
angular.module('app', [
    uiRouter,
    NavBarComponent,
    SpeakerListComponent,
    AddSpeakerComponent,
  ])
  .config(...) => {
    ...
    })
  .component('app', AppComponent)
  .factory('SpeakerService', SpeakerService);
```

**Note:** Make sure it is `speakerList`, not `speakerlist` in `.component('speakerList', speakerlistComponent)` section of the `app/components/speakerlist/speakerlist.js` file.

Your app should look like this now:

![SpeakerHang - List of speakers](https://cdn.auth0.com/blog/speakerhang/speakerlist.png)
_SpeakerHang - List of speakers_

####Add Speaker component

Let's create the add speaker component. Run the component creation command in the terminal like so:

```bash 
gulp component --name addspeaker
```

The `addspeaker` component is the container for the forthcoming `speakerform` component.

Head over to `app/app.js` and import the `addspeaker` component. We'll also add the route for `/add-speaker`.

```js
...
import AddSpeakerComponent from './components/addspeaker/addspeaker';
...
angular.module('app', [
    uiRouter,
    NavBarComponent,
    SpeakerListComponent,
    AddSpeakerComponent,
  ])
  .config(($locationProvider, $stateProvider, $urlRouterProvider) => {
    ...
     //Create route for our goat listings creator
    .state('addspeaker', {
        url: '/add-speaker',
        template: '<add-speaker></add-speaker>'
    });
 
   // Default page for the router
   $urlRouterProvider.otherwise('/home');
  })
  .component('app', AppComponent)
  .factory('SpeakerService', SpeakerService);
```

Click on the `Add A Speaker` link on the navbar. You'll be directed to the `/addspeaker` route. Right now, it's empty but everything is working perfectly.

**Note:** We need to add a speaker form to the template of the `addspeaker` component, but we'll come back to it once we are done with creating the speaker form component.

#### Speaker Form component

Let's create the speaker form component. Run the component creation command in the terminal like so:

```bash 
gulp component --name speakerform
```

Open up `app/components/speakerform/speakerform.html` and add the form code to it like so:

```html
<form role="form" ng-submit="vm.addSpeaker()">
  <div class="row">
    <div class="six columns">
        <label for="control-label col-sm-2">Speaker Name:</label>
        <input class="u-full-width" type="text" placeholder="John Doe" ng-model="vm.speaker.name">
    </div>
    <div class="six columns">
        <label for="control-label col-sm-2">No. Of Conferences Attended:</label>
        <input class="u-full-width" type="number" placeholder="25" ng-model="vm.speaker.noOfConf">
    </div>
  </div>

  <label for="favConference">Favorite Conference So Far:</label>
  <input class="u-full-width" type="text" placeholder="All Superpower Dev Conf 2050" ng-model="vm.speaker.favConf">

  <label for="FavoriteProgrammingQuote">Favorite Programming Quote</label>
  <textarea class="u-full-width" placeholder="Organizational Skills Beat Algorithmic Wizadry - James Hague" ng-model="vm.speaker.favProgrammingQuote"></textarea>
  
  <input class="button-primary" type="submit" value="Submit">
</form>
```

In the code above, we have the `addSpeaker()` function that will be invoked when the form is submitted. The data of each input type will be submitted to the `speaker` object, made possible via `ng-model`.

Let's add the controller code to `app/components/speakerform/speakerform.component.js` file.

_speakerform.component.js_

```js
class SpeakerformController {
  constructor($state, SpeakerService) {
    "ngInject";

    this.$state       = $state;
    this.SpeakerService = SpeakerService;

    this.speaker = {};
  }

  // will handle the form submission,
  // validates the required field and then adds the goat to the service.
  // once added, we will go to the next page.
  addSpeaker() {
    if(!this.speaker.name) return alert('Speaker Name is Required');
    if(!this.speaker.noOfConf) return alert('No. Of Conferences Attended is required');
    if(!this.speaker.favConf) return alert('Favorite Conference So Far is required');
    if(!this.speaker.favProgrammingQuote) return alert('Favorite Programming Quote is required');

    this.SpeakerService.addASpeaker(this.speaker);

    // reset the form
    this.speaker = {};

    // go to home page, to see our entry
    this.$state.go('speakers');
  }
}

export default SpeakerformController;
```

In the code above, we injected the `state` and `SpeakerService` into the controller. The `addSpeaker()` function collects the values of the form and sends to the `addSpeaker` function.

Quickly add the `controllerAs` key with the value of `vm` to the `speakerform` component.

_app/components/speakerform/speakerform.component.js_

```js
import template from './speakerform.html';
import controller from './speakerform.controller';
import './speakerform.scss';

let speakerformComponent = {
  restrict: 'E',
  bindings: {},
  template,
  controller,
  controllerAs: 'vm'
};

export default speakerformComponent;
```

Now, go ahead and import the `speakerform` component in `addspeaker.js` like so:

```js
import angular from 'angular';
import addspeakerComponent from './addspeaker.component';
import speakerForm from '../speakerform/speakerform';

let addspeakerModule = angular.module('addspeaker', [
  speakerForm
])

.component('addSpeaker', addspeakerComponent)

.name;

export default addspeakerModule;
```

**Note:** Make sure it is `speakerForm`, not `speakerform` in `.component('speakerForm', speakerformComponent)` section of the `app/components/speakerform/speakerform.js` file.

One more thing, remember the `app/components/addspeaker/addspeaker.html` file? it's time to add the `<speaker-form>` component to it.

_app/components/addspeaker/addspeaker.html_

```html
<div>
  <speaker-form></speaker-form>
</div>
```

Try to add a speaker now. The speaker form works and it adds a new speaker to the list of speakers. Yaay!!!

![SpeakerHang - Add Speaker](https://cdn.auth0.com/blog/speakerhang/addspeaker.png)
_SpeakerHang - Add Speaker_

## Adding Authentication to Your AngularJS App

The majority of the apps we use on a daily basis have a means of authenticating users. I'll show you how to easily add authentication to our **AngularJS 1.5** application. We'll use [Auth0](https://auth0.com/) as our authentication service.

Auth0 allows us to issue [JSON Web Tokens (JWTs)](https://jwt.io). If you don't already have an Auth0 account, <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">sign up</a> for a free one now.

> [Auth0 offers a generous **free tier**](https://auth0.com/pricing) to get started with modern authentication.

Login to your Auth0 [management dashboard](https://manage.auth0.com) and let's create a new Auth0 API. To do so, click on the APIs menu item and then the **Create API** button. You will need to give your API a name and an identifier. The name can be anything you choose, so make it as descriptive as you want. The identifier will be used to identify your API, this field cannot be changed once set. For our example, I'll name the API **Startup Battle API** and for the identifier I'll set it as **http://startupbattle.com**. We'll leave the signing algorithm as RS256 and click on the **Create API** button.

![Creating the startupbattle API](https://cdn2.auth0.com/blog/startupbattle/api.png)
_Creating the Startup battle API_

Next, let's define some scopes for our API. Scopes allow us to manage access to our API. We can define as few or as many scopes as we want. For our simple example, we'll just create a single scope that will grant users full access to the API.

![Locate scopes bar](https://cdn2.auth0.com/blog/startupbattles/scope.png)
_Locate Scopes bar_

![Adding Scope to API](https://cdn2.auth0.com/blog/startupbattles/scopes.png)
_Adding scope_

We'll create an authentication helper to handle everything about authentication in our app. Go ahead and create an `auth.js` file inside the `utils` directory.

Before we add code, you need to install `jwt-decode` and `auth0-js` node package like so:

```bash
npm install jwt-decode auth0-js --save

```

Open up the `auth.js` file and add code to it like so:

```js
import decode from 'jwt-decode';
import axios from 'axios';
import auth0 from 'auth0-js';
import Router from 'vue-router';
import Auth0Lock from 'auth0-lock';
const ID_TOKEN_KEY = 'id_token';
const ACCESS_TOKEN_KEY = 'access_token';

const CLIENT_ID = '{AUTH0_CLIENT_ID}';
const CLIENT_DOMAIN = '{AUTH0_DOMAIN}';
const REDIRECT = 'YOUR_CALLBACK_URL';
const SCOPE = '{SCOPE}';
const AUDIENCE = 'AUDIENCE_ATTRIBUTE';

var auth = new auth0.WebAuth({
  clientID: CLIENT_ID,
  domain: CLIENT_DOMAIN
});

export function login() {
  auth.authorize({
    responseType: 'token id_token',
    redirectUri: REDIRECT,
    audience: AUDIENCE,
    scope: SCOPE
  });
}

var router = new Router({
   mode: 'history',
});

export function logout() {
  clearIdToken();
  clearAccessToken();
  router.go('/');
}

export function requireAuth(to, from, next) {
  if (!isLoggedIn()) {
    next({
      path: '/',
      query: { redirect: to.fullPath }
    });
  } else {
    next();
  }
}

export function getIdToken() {
  return localStorage.getItem(ID_TOKEN_KEY);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function clearIdToken() {
  localStorage.removeItem(ID_TOKEN_KEY);
}

function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

// Helper function that will allow us to extract the access_token and id_token
function getParameterByName(name) {
  let match = RegExp('[#&]' + name + '=([^&]*)').exec(window.location.hash);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

// Get and store access_token in local storage
export function setAccessToken() {
  let accessToken = getParameterByName('access_token');
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

// Get and store id_token in local storage
export function setIdToken() {
  let idToken = getParameterByName('id_token');
  localStorage.setItem(ID_TOKEN_KEY, idToken);
}

export function isLoggedIn() {
  const idToken = getIdToken();
  return !!idToken && !isTokenExpired(idToken);
}

function getTokenExpirationDate(encodedToken) {
  const token = decode(encodedToken);
  if (!token.exp) { return null; }

  const date = new Date(0);
  date.setUTCSeconds(token.exp);

  return date;
}

function isTokenExpired(token) {
  const expirationDate = getTokenExpirationDate(token);
  return expirationDate < new Date();
}
```

In the code above, we are using Auth0's [Login Page](https://auth0.com/docs/hosted-pages/login) in the `login` method and passed in our credentials.

The auth0 package calls the Auth0's authorize endpoint. With all the details we passed to the method, our client app will be validated and authorized to perform authentication. You can learn more about the specific values that can be passed to the authorize method [here](https://auth0.com/docs/libraries/auth0js).

The parameters that you do not have yet are the `{YOUR-AUTH0-CLIENT-ID}` and the `{YOUR-CALLBACK-URL}`. This will be an Auth0 application that will hold your users. When you created your API, Auth0 also created a test application which you can use. Additionally, you can use any existing Auth0 application found in Applications section of your [management dashboard](https://manage.auth0.com/#/applications).

Check the `Test` panel of your API from the dashboard. You'll see the test application like so:

![Startup Application](https://cdn2.auth0.com/blog/app/startupclient.png)
_Startup API Application_

Now, go to the Applications area and check for the test application. You should see it in your list of applications like so:

![Startup Battle Application](https://cdn2.auth0.com/blog/startupbattleapi/client.png)

Open the application and change the **Appication Type** from `Non Interactive Application` to `Single Page Application`.

Copy the **CLIENT ID** and replace it with the value of `YOUR-AUTH0-CLIENT-ID` in the login URL. Replace your callback url with `http://localhost:8080/callback`.

We also checked whether the token has expired via the `getTokenExpirationDate` and `isTokenExpired` methods. The `isLoggedIn` method returns `true` or `false` based on the presence and validity of a user `id_token`.

We imported the Vue router and created an instance of it. We need it for redirection after login and logout.

Finally, we implemented a middleware, the `requireAuth` method. We'll use this method to protect the `/private-battles` route from being accessed for non-loggedIn users.

Let's go update the `AppNav` component to hide/show the `login` and `logout` buttons based on the user's authentication status.

Now, your `AppNav` component should look like this:

{% highlight html %}
{% raw %}
<template>
  <nav class="navbar navbar-default">
    <div class="navbar-header">
      <router-link to="/" class="navbar-brand"> The Ultimate Startup Battle Ground</router-link>
    </div>
    <ul class="nav navbar-nav navbar-right">
      <li>
        <button class="btn btn-danger log" v-show="isLoggedIn()" @click="handleLogout()">Log out </button>
        <button class="btn btn-info log" v-show="!isLoggedIn()" @click="handleLogin()">Log In</button>
      </li>
    </ul>
  </nav>
</template>

<script>
import { isLoggedIn, login, logout } from '../../utils/auth';

export default {
  name: 'app-nav',
  methods: {
    handleLogin() {
      login();
    },
    handleLogout() {
      logout();
    },
    isLoggedIn() {
      return isLoggedIn();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.navbar-right { margin-right: 0px !important}

.log {
  margin: 5px 10px 0 0;
}
</style>
{% endraw %}
{% endhighlight %}

_AppNav.vue_

We imported `login`, `logout` and `isLoggedIn` functions from the `auth` helper file. Then, we attached the `login()` and `logout()` functions to the `login` and `logout` buttons respectively.

Open up the `PublicBattles` Component and modify it like so:

{% highlight html %}
{% raw %}
<template>
  <div>
    <app-nav></app-nav>
    <h3 class="text-center">Daily Startup Battles</h3>
    <hr/>

    <div class="col-sm-4" v-for="battle in publicBattles">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title"> {{ battle.name }} </h3>
        </div>
        <div class="panel-body">
          <p><span class="badge alert-info"> Sponsor: </span> {{ battle.sponsor }} </p>
          <p><span class="badge alert-danger"> SeedFund: </span><strong> ${{ battle.seedFund }} </strong></p>
        </div>
      </div>
    </div>

    <div class="col-sm-12">
      <div class="jumbotron text-center" v-if="isLoggedIn()">
        <h2>View Private Startup Battles</h2>
        <router-link class="btn btn-lg btn-success" to="/private-battles">Private Startup Battles</router-link>
      </div>
      <div class="jumbotron text-center" v-else>
        <h2>Get Access to Private Startup Battles by Logging In</h2>
      </div>
    </div>
  </div>
</template>

<script>
import AppNav from './AppNav';
import { isLoggedIn } from '../../utils/auth';
import { getPublicStartupBattles } from '../../utils/battles-api';

export default {
  name: 'publicBattles',
  components: {
    AppNav,
  },
  data() {
    return {
      publicBattles: '',
    };
  },
  methods: {
    isLoggedIn() {
      return isLoggedIn();
    },
    getPublicStartupBattles() {
      getPublicStartupBattles().then((battles) => {
        this.publicBattles = battles;
      });
    },
  },
  mounted() {
    this.getPublicStartupBattles();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
{% endraw %}
{% endhighlight %}

_publicBattles.vue_

We are enabling the link to private startup battles based on the login status of a user via the `isLoggedIn()` method.

### Add A Callback Component

We will create a new component and call it `callback.vue`. This component will be activated when the `localhost:8080/callback` route is called and it will process the redirect from Auth0 and ensure we recieved the right data back after a successful authentication. The component will store the `access_token` and `id_token`.

_callback.vue_

{% highlight html %}
<template>
</template>
<script>

import { setIdToken, setAccessToken } from '../../utils/auth';

export default {
  name: '',
  mounted() {
    this.$nextTick(() => {
      setAccessToken();
      setIdToken();
      window.location.href = '/';
    });
  },
};
</script>

{% endhighlight %}

Once a user is authenticated, Auth0 will redirect back to our application and call the `/callback` route. Auth0 will also append the `id_token` as well as the `access_token` to this request, and our Callback  component will make sure to properly process and store those tokens in localStorage. If all is well, meaning we recieved an `id_token`, `access_token`, and verified the `nonce`, we will be redirected back to the `/` page and will be in a logged in state.

### Add some values to Auth0 Dashboard

Just before you try to log in or sign up, head over to your [Auth0 dashboard](https://manage.auth0.com/#/) and add `http://localhost:8080/callback` to the **Allowed Callback URLs** and `http://localhost:8080` to **Allowed Origins (CORS)**.

### Secure The Private Battles Route

We need to ensure that no one can go to the browser and just type `/private-battles` to access the private battles route.

Open up `router/index.js` and modify it to import the `requireAuth` function and also add a `beforeEnter` property with a value of `requireAuth` to the `/private-battles` route like so:

```js
import Vue from 'vue';
import Router from 'vue-router';
import PrivateBattles from '@/components/privateBattles';
import PublicBattles from '@/components/publicBattles';
import { requireAuth } from '../../utils/auth';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'PublicBattles',
      component: PublicBattles,
    },
    {
      path: '/private-battles',
      name: 'PrivateBattles',
      beforeEnter: requireAuth,
      component: PrivateBattles,
    },
  ],
});

```
_index.js_

One more thing. Now, let's register the `/callback` route in our routes file like so:

```js
import Vue from 'vue';
import Router from 'vue-router';
import PrivateBattles from '@/components/privateBattles';
import PublicBattles from '@/components/publicBattles';
import Callback from '@/components/callback';
import { requireAuth } from '../../utils/auth';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'PublicBattles',
      component: PublicBattles,
    },
    {
      path: '/private-battles',
      name: 'PrivateBattles',
      beforeEnter: requireAuth,
      component: PrivateBattles,
    },
    {
      path: '/callback',
      component: Callback,
    },
  ],
});
```

Now, try to log in.

![Lock Login Widget](https://cdn2.auth0.com/blog/startupbattle/login.png)
_Lock Login Widget_

For the first time, the user will be shown a user consent dialog that will show the scope available. Once a user authorizes, it goes ahead to login the user and give him access based on the scopes.

![User consent dialog](https://cdn2.auth0.com/blog/startupbattle/authorize.png)
_User presented with an option to authorize_

**Note:** Since we are using `localhost` for our domain, once a user logs in the first time, subsequent logins will not need a user consent authorization dialog. This consent dialog will not be displayed if you are using a non-localhost domain, and the application is a first-party application.

![Logged In and Unauthorized to see the Private Startup Battle](https://cdn2.auth0.com/blog/startupbattle/unauthorized.png)
_Logged In, but unauthorized to see the Private Startup Battle_

We have successfully logged in but the content of the private startup battle is not showing up and in the console, we are getting a `401 Unauthorized` error. Why?

It's simple! We secured our endpoint earlier, but right now we are not passing the JWT to the backend yet. We need to send the JWT along with our request as a header to enable the secured endpoint's recognition of the logged-in user.

### Updating the Auth & Battles API helper

Go ahead and open up the `utils/battles-api.js` file. We will tweak the `getPrivateStartupBattles` function a bit. Currently, it initiates a `GET` request only to fetch data from the API.

Now, we will pass an option to send an `Authorization` header with a Bearer access_token along with the `GET` request like so:

```js

import { getAccessToken } from './auth';

function getPrivateStartupBattles() {
  const url = `${BASE_URL}/api/battles/private`;
  return axios.get(url, { headers: { Authorization: `Bearer ${getAccessToken()}` }}).then(response => response.data);
}

```

The `/api/battles/private` endpoint will receive the token in the header and validate the user. If it is valid, the content will be provided to us.

Now, try to log in again.

Everything should work fine. Pat yourself on the back. You have just successfully built a **Vuejs 2** app and added authentication to it!

## Conclusion

**AngularJS 1.5+** provides a component-based technique to build apps similar to React and Angular style way of building applications. In this tutorial, you've learned how to build and secure an app using the `.component` method and the new APIs introduced to the framework.

In addition, Auth0 can help secure your **AngularJS** apps with more than just username-password authentication. It provides features like [multifactor auth](https://auth0.com/docs/multifactor-authentication), [anomaly detection](https://auth0.com/docs/anomaly-detection), [enterprise federation](https://auth0.com/docs/identityproviders), [single sign on (SSO)](https://auth0.com/docs/sso), and more. <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">Sign up</a> today so you can focus on building features unique to your app.

> Auth0 provides the simplest and easiest to use [user interface tools to help administrators manage user identities](https://auth0.com/user-management) including password resets, creating and provisioning, blocking and deleting users.