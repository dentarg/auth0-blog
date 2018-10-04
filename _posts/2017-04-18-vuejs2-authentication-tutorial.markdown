---
layout: post
title: "Vuejs 2 Authentication Tutorial"
description: Learn how to quickly build apps with Vuejs 2 and add authentication the right way.
date: 2017-04-18 8:30
category: Technical Guide, Frontend, VueJS
author:
  name: Prosper Otemuyiwa
  url: https://twitter.com/unicodeveloper?lang=en
  avatar: https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200
  mail: prosper.otemuyiwa@auth0.com
design:
  bg_color: "#35495E"
  image: https://cdn2.auth0.com/blog/vuejs/logo.png
tags:
- vuejs
- javascript
- authentication
- web-app
- auth0
related:
- 2016-01-04-secure-your-react-and-redux-app-with-jwt-authentication
- 2016-09-29-angular-2-authentication
- 2017-02-21-reactjs-authentication-tutorial
lang: en
alternate_locale_ja: jp-vuejs2-authentication-tutorial
---

---

**TL;DR:** Vuejs is a progressive JavaScript framework for building user interfaces on the web. It was launched shortly after ReactJS and over time, lots of developers started adopting it in their daily work. In fact, with the launch of Vuejs 2.0, the adoption and usage worldwide skyrocketed. Currently, Vuejs has over 49,000 stars on [GitHub](https://github.com/vuejs/vue). In this tutorial, I'll show you how easy it is to build a web application with Vuejs 2 and add authentication to it. Check out the [repo](https://github.com/auth0-blog/vuejs2-authentication-tutorial) to get the code.

---

[**Vuejs**](https://vuejs.org/) was developed by [Evan You](https://twitter.com/youyuxi), an ex-Google software engineer. Just before launching Vuejs 2.0, he started to work on Vue.js full time and as a result, Vue.js 2 is now  significantly lighter, smaller in size and faster. Currently, many popular products use **Vuejs** to build their user interfaces. Such platforms include *Laravel Spark*, *Grammarly*, *Statamic*, *Laracasts* and more. There is a comprehensive list of [projects using Vuejs on Github](https://github.com/vuejs/awesome-vue#projects-using-vuejs). Vuejs 2's [documentation](https://vuejs.org/v2/guide/) is very detailed, and there is a vibrant community of users.

## Vuejs 2, Angular 2 and React

Vuejs was inspired by AngularJS in it's early days of development, thus making some of its syntax look very similar to AngularJS, e.g `v-show`, `v-if` and `v-for`. Angular 2 came to the scene with a completely new framework in terms of API design, underlying language and many addons, which was initially disturbing for a lot of developers. Now Vuejs 2, despite being a full rewrite made its API largely compatible with Vuejs 1.0, thus making it super easy for developers to transition from Vuejs 1.0 to 2.0. Whoop! Whoop!

Vuejs 2.0 comes bundled with some major changes:

* The rendering layer is now based on a lightweight virtual-DOM implementation, [Snabbom](https://github.com/paldepind/snabbdom)
* Detection of static class names and attributes so that they are never diffed after the initial render
* Detection of sub trees without dynamic bindings and hoisting them out of the render function, which as a result leads to diff skipping on each re-render.
* It supports server-side rendering with client-side hydration. React and Angular 2 also provides server-side rendering.
* Support for JSX. The template syntax is still available for use, but you can always drop down to the virtual-DOM layer whenever you feel constrained by the use of templates.
* The template-to-virtual-DOM compiler and the runtime can be separated, so you can pre-compile templates and ship your app with only the runtime, which is less than 12kb min+gzip.

AngularJS(*Angular 1*) uses two-way binding between scopes, while Vue enforces a one-way data flow between components.

Vuejs 2 and Angular 2 are similar in a way because they both offer component-based systems.

React and Vue.js are also similar in many ways. They both:

* Utilize a virtual DOM.
* Provide composable view components.
* Have a core library & have sister libraries for handling state, routing, network requests, e.t.c.

**Note:** If you are coming from jQuery and new to Vuejs, [here is a refresher to bring you up to date](https://medium.freecodecamp.com/vue-js-introduction-for-people-who-know-just-enough-jquery-to-get-by-eab5aa193d77).

### Enter Performance Profiling

Vue.js and React utilize virtual DOM, but Vue's virtual DOM implementation allows rendering of UI to be faster than that of React, because it involves less overhead. Let's look at some performance statistics done by the Vue.js team. Check out the [repo here](https://github.com/chrisvfritz/vue-render-performance-comparisons).

This benchmark was run 20 times with results from the best runs on a 2014 MacBook Air.

![Vuejs - React Metrics](https://cdn.auth0.com/blog/vuereact/metrics.png)
_Vue, React Metrics_

By default, React triggers a re-render of an entire component subtree when state changes. To avoid unecessary re-rendering, you have to manually implement `shouldComponentUpdate`. In Vuejs, a component’s dependencies are automatically tracked during its render, so the system knows precisely which components actually need to re-render.

According to this [benchmark](http://stefankrause.net/js-frameworks-benchmark4/webdriver-ts/table.html), Vue 2's app size is smaller than Angular 2.

## Understanding Key Concepts in Vuejs 2

**Vuejs 2** is similar to React and Angular 2 in a few ways. There are few key concepts that will help you get started easily. I'll give a basic overview of these concepts to nourish your understanding of **Vuejs**. They are:

* **Directives**
* **Components**
* **Template/JSX**

You can decide to use *Vuejs 2* by simply invoking methods on a Vue instance or go the component-composing route.

{% highlight html %}
{% raw %}
<div id="app">
  <p>{{ message }}</p>
</div>
{% endraw %}
{% endhighlight %}


```js
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello, it is this easy!'
  }
})
```

The result of the code above on the browser will be *Hello, it is this easy!*.  The value of any property in the data object within a new Vue instance will be rendered to the DOM easily. The curly braces are used to display the property on the web page.

### Directives

It's very easy to toggle the display of items on a web page with inbuilt directives such as `v-if`, `v-show` like so:

{% highlight html %}
{% raw %}
  <div id="app">
    <p v-if="visible()">{{ message }}</p>
  </div>
{% endraw %}
{% endhighlight %}

```js
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello, it is this easy!'
  },
  methods: {
    visible: function() {
      return true;
    }
  }
});
```

If for any reason, the `visible` function returns false, the paragraph would not be displayed on the web page. What about iterations and loops? Check out the code below

{% highlight html %}
{% raw %}
  <div id="app">
    <ol>
      <li v-for="item in items">
        {{ item.name }}
      </li>
    </ol>
  </div>
{% endraw %}
{% endhighlight %}

```js
var app = new Vue({
  el: '#app',
  data: {
    items: [
      { name: 'Prosper Otemuyiwa' },
      { name: 'Goodness Kintakunte' },
      { name: 'Lynda' }
    ]
  }
});
```

On the page, it will simply display:

```bash
Prosper Otemuyiwa
Goodness Kintakunte
Lynda
```

### Components

Vuejs 2 also leverages components. It allows you to build large applications composed of small, self-contained smaller components.

An example of a component is an HTML5 tag, say `<header>`. A header can have attributes, it can be styled and also possess its own behaviour. In **Vuejs 2**, you'll be able to build your own custom component by registering it like so:

```js
Vue.component('app-nav', {
  template: "<li>This is the application's navbar</li>"
})
```

Then, you can use it in another component like so:

{% highlight html %}
<div>
  <app-nav></app-nav>
</div>
{% endhighlight %}

So, your component will now be `<app-nav></app-nav>`.

Vuejs 2 provides some methods that are triggered at various points from creating a component up until the component is destroyed. This is called the **Instance Lifecycle**, also known as the **Component's Lifecyle**. Each Vue instance goes through a series of initialization steps when it is created - for example, it needs to set up data observation, compile the template, mount the instance to the DOM, and update the DOM when data changes. So you can execute custom logic in these hooks. These lifecycle hooks are  `beforeCreate`, `created`, `beforeMount`, `mounted`, `beforeUpdate`, `updated`, `activated`, `deactivated`, `beforeDestroy` and `destroyed`.

![Vuejs 2 Lifeycycle hooks](https://vuejs.org/images/lifecycle.png)
_Vuejs 2 Lifecycle hooks_

* **beforeCreate()** : This method is called synchronously after the Vue instance has just been initialized, before data observation and event/watcher setup.
* **created()** : This method is called synchronously after the Vue instance is created. Data observation, computed properties, methods and event callbacks have already been set up at this stage but the mounting phase has not started yet.
* **beforeMount()** : This method is called right before the component is mounted. So it is called before the `render` method is executed.
* **mounted()** : This method is called after the component has just been mounted.
* **beforeUpdate()** : This method is called when the data changes, before the virtual DOM is re-rendered and patched.
* **updated()** : This method is called after a data change causes the virtual DOM to be re-rendered and patched.
* **activated()** : This method is called when a kept-alive component is activated.
* **deactivated()** : This method is called when a kept-alive component is deactivated.
* **beforeDestroy()** : This method is called right before a Vue instance or component is destroyed. At this stage the instance is still fully functional.
* **destroyed()** : This method is called after a Vue instance or component has been destroyed. When this hook is called, all directives of the Vue instance have been unbound, all event listeners have been removed, and all child Vue instances have also been destroyed.

Vuejs 2 possess some built-in components such as `component`, `transition`, `transition-group`, `keep-alive` and `slot`. You can take advantage of these components in your app. [Check out how to use them.](https://vuejs.org/v2/api/#component)

### Props

`Props` is the short form for `properties`. Properties are attributes of a component. In fact, props are how components talk to each other. A tag in HTML such as `<img>` has an attribute, a.k.a `prop` called `src` that points to the location of an image.

In Vue.js 2, you can pass data from the parent scope into child components. A typical example is this:

```js
Vue.component('tag-list', {
  props: ['item'],
  template: '<li>{{ item.tag}}</li>'
})

var app = new Vue({
  el: '#app',
  data: {
    tagList: [
      { tag: '5kbae' },
      { tag: 'Based on Logistics' },
      { tag: 'Image management' }
    ]
  }
})
```

{% highlight html %}
<div id="app">
  <ol>
    <tag-list v-for="list in tagList" v-bind:item="list"></tag-list>
  </ol>
</div>
{% endhighlight %}

It will display these items on the web page like so:

```bash
5kbae
Based on Logistics
Image management
```

### Template / JSX

Vue.js 2 uses an HTML-based template syntax that allows you to declaratively bind the rendered DOM to the underlying Vue instance’s data. All Vue.js templates are valid HTML that can be parsed by spec-compliant browsers and HTML parsers.

You can also decide to use JSX. JSX is the combination of HTML and JavaScript code in the same file. The browser is not meant to understand it. It must first be transpiled into standard JavaScript before the browser can understand. An example of JSX usage in Vuejs is:

```js
data: {
  text: 'Hello world'
},
render (h) {
  return (
    <div id='message'>
      { this.text }
    </div>
  );
}
```

Now, by default, Vue doesn't support JSX, but with the help of [babel-plugin-transform-vue-jsx](https://github.com/vuejs/babel-plugin-transform-vue-jsx) we can use JSX with Vue. Oh, the ecosystem should be thanked for this great tool. Whoop! Whoop!

With Vue 2, you can use the `render` function to create a reactive element. And you can use JSX in it like so:

```js
new Vue({
  el: '#app',
  data: {
    msg: 'Click to see the message.'
  },
  methods: {
    hello () {
      alert('This is the message.')
    }
  },
  render: function render(h) {
    return (
      <span
        class={{ 'my-class-3': true }}
        style={{ cursor: 'pointer' }}
        on-click={ this.hello }
      >
        { this.msg }
      </span>
    )
  }
});
```

Can you see the power of JSX manifesting itself in Vue? Awesome, you can check out more [information on JSX in Vue here](https://github.com/vuejs/babel-plugin-transform-vue-jsx).

Next, let's build an application with *Vuejs 2*.

## Our App: The Ultimate Startup Battle Ground

![The Ultimate Startup Battle Ground](https://cdn.auth0.com/blog/vuejs/appscreenshot.png)

The app we will build today is called `The Ultimate Startup Battle Ground`. Several startups are springing up all over the world. These startups are coming up with innovative technology but have limited funds. Our app hopes to alleviate the issue of funding by providing an up-to-date list of startup battles all over the world with details of sponsors and seed fund amount. The Ultimate Startup Battle Ground app will display a list of startup battles to the general public.

Interested startup founders can get hold of this list and ensure their team does not miss out on it. However, the app will also provide a list of secret startup battles. This list will only be accessible to registered members.

**Note:** The secret startup battles have bigger sponsors. How dare you miss that? Not gonna happen!

## Build The Back-End

Let's build an API to serve the list of startup battles to our app. We'll quickly build the API with [Node.js](https://nodejs.org). The API is simple. This is what we need:

* An endpoint to serve public startup battles - `/api/battles/public`.
* An endpoint to serve secret startup battles - `/api/battles/private`.
* Secure the endpoint that serves secret startup battles, so that it can only be accessed by registered users.

Go ahead and fetch the [Node.js backend from GitHub](https://github.com/auth0-blog/vuejs2-authentication-tutorial/tree/master/server).

**Note:** We'll be securing the backend with Auth0, so make sure you have an account already or <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">sign up</a> for one.

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
        jwksUri: "https://{{YOUR-AUTH0-DOMAIN}}/.well-known/jwks.json"
    }),
    // This is the identifier we set when we created the API
    audience: '{YOUR-API-AUDIENCE-ATTRIBUTE}',
    issuer: "https://{YOUR-AUTH0-DOMAIN}.auth0.com/",
    algorithms: ['RS256']
});

app.get('/api/battles/public', (req, res) => {
  let publicBattles = [
    // Array of public battles
  ];

  res.json(publicBattles);
})

app.get('/api/battles/private', authCheck, (req,res) => {
  let privateBattles = [
    // Array of private battles
  ];

  res.json(privateBattles);
})

app.listen(3333);
console.log('Listening on localhost:3333');
```
_server.js_

Check out the [full server.js file here](https://github.com/auth0-blog/vuejs2-authentication-tutorial/blob/master/server/server.js).

**Note:** Your `YOUR-AUTH0-DOMAIN` should be replaced with your auth0 domain.

Your `package.json` file should look like this:

```js
{
  "name": "startup-battle",
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

![API serving public startup battles](https://cdn.auth0.com/blog/vue/postmanpublic.png)
_API serving public startup battles_

![API serving private startup battles](https://cdn.auth0.com/blog/vue/postmanprivate.png)
_API serving private startup battles_

The public startup battles endpoint should be `http://localhost:3333/api/battles/public`.

The private startup battles endpoint should be `http://localhost:3333/api/battles/private`.

Don't worry about the middleware in charge of securing our endpoint for now. We'll deal with that later. Now, let's build our frontend with Vuejs 2.

## Build The Front-End With Vuejs 2

In the early days of **Vuejs**, there was no particular recommended tool or common way to set up a *Vuejs* app. However, there is a tool now for scaffolding your Vuejs apps. It's called the [Vuejs CLI](https://github.com/vuejs/vue-cli) tool. It's being maintained by the Vuejs team.

Go ahead and install the vue-cli tool globally like so:

```bash

npm install -g vue-cli

```

![Installation](https://cdn.auth0.com/blog/vuecli/installation.png)
_You will be greeted with a series of questions_

After installing globally, go ahead and scaffold a new **Vuejs 2** app like so:

```bash

vue init webpack ultimate-startup-battle

```

**Note:** In this context, `webpack` is a template. You can actually select the template you want `vue-cli` to scaffold your app with. Another alternative is to use `browserify`. Check out the [list of templates here](https://github.com/vuejs-templates/).

Move into the new directory, `ultimate-startup-battle` and run `npm install` to install all the dependencies required for your app.

Now run `npm run dev` from your terminal to start up your app. It should automatically open up your web browser at `http://localhost:8080` and serve your new app.

![App recently scaffolded and showing at Localhost](https://cdn.auth0.com/blog/vuejs/newscaffoldedapp.png)

Let's check out the structure of our newly scaffolded app.

![Scaffolded App](https://cdn.auth0.com/blog/vuecli/boilerplate.png)

```bash
ultimate-startup-battle/
  build/ - All build files are here
  config/ - All environment config files are here
  node_modules/ - All the packages required for the vuejs app resides here
  src/
    - assets - All assets reside here
    - components - All our Vue components resides here
    - router - Our router is defined here
    - App.vue - The Parent component
    - main.js - Starting point for our app where the router, template and App component are bound to the root app div
  static/ - contains static files
  .babelrc
  .editorconfig
  .eslintignore
  .eslintrc.js
  .gitignore
  .postcssrc.js
  index.html - Index file that declares the root div where the App component is been bound to
  package.json - File that contains the names of all the packages residing in node_modules folder
  README.md
  node_modules/ - All the packages required for the react app resides here
  package.json - File that contains the names of all the packages residing in node_modules folder
```

We will work with this structure but make some few modifications.


**Note:** We are not writing any tests for this application. It's out of the scope of this tutorial. So during the installation, I opted out by choosing the no option.

Make the following modifications like so:

* Create a `privateBattles.vue` file inside the `components` directory. This component will take care of fetching the private startup battles and displaying them to the user.
* Create a `publicBattles.vue` file inside the `components` directory. This component will take care of fetching the public startup battles and displaying them to the user.
* Create a `AppNav.vue` file inside the `components` directory. This component will be in charge of our navigation throughout the app.
* Create a folder called `utils` . This will house our helper functions.

## Fetch the API Data

The first thing we need to do is to fetch the API data from our Node backend to display in our app. Make sure the Node server is running.

Let's create a helper file to handle fetching the API. Create a `battles-api.js` file inside the `utils` directory.

Open up the file and add code to it like so:

```js

import axios from 'axios';

const BASE_URL = 'http://localhost:3333';

export {getPublicStartupBattles, getPrivateStartupBattles};

function getPublicStartupBattles() {
  const url = `${BASE_URL}/api/battles/public`;
  return axios.get(url).then(response => response.data);
}

function getPrivateStartupBattles() {
  const url = `${BASE_URL}/api/battles/private`;
  return axios.get(url).then(response => response.data);
}

```
_battles-api.js_

**Note:** Install `axios` in your app by running `npm install axios --save`.

We are using a very good promise based http client, [axios](https://github.com/mzabriskie/axios). An alternative for this is [superagent](https://github.com/visionmedia/superagent).

In the `getPublicStartupBattles` and `getPrivateStartupBattles` functions, axios fetches data from the API endpoints. Then we do this: `export {getPublicStartupBattles, getPrivateStartupBattles};` to make them ready for use in our components.

## Build the Nav Component

The `AppNav.vue` file is our Nav component. Go ahead and add code to it like so:

{% highlight html %}
<template>
  <nav class="navbar navbar-default">
    <div class="navbar-header">
      <router-link to="/" class="navbar-brand"> The Ultimate Startup Battle Ground</router-link>
    </div>
    <ul class="nav navbar-nav navbar-right">
      <li>
        <button class="btn btn-danger log" @click="handleLogout()">Log out </button>
        <button class="btn btn-info log" @click="handleLogin()">Log In</button>
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
{% endhighlight %}


The `router-link` Component from `vue-router` enables seamless client-side transition between routes without any page reload.

## Build the PublicBattles and PrivateBattles Component

By default, these two components will look similar in functionalities. They both display data from different endpoints. Let's start with the `PublicBattles` component.

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
      <div class="jumbotron text-center">
        <h2>View Private Startup Battles</h2>
        <router-link class="btn btn-lg btn-success" to="/private-battles">Private Startup Battles</router-link>
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

Let's analyze the code above. The `publicBattles` component is pulling data from an API, so it needs a way of holding that data. Vuejs has a `data` method where you can define properties to hold your data as some form of state. In the code above, we declared a `publicBattles` property.

The `methods` property also comes by default with Vuejs. In this property, you can define custom logic as functions within this property. So we defined `isLoggedIn` and `getPublicStartupBattles` functions.

In the `getPublicStartupBattles` method, we call the `getPublicStartupBattles` method we exported from the `battles-api.js` helper file and set state as seen below:

```js
...
 getPublicStartupBattles() {
      getPublicStartupBattles().then((battles) => {
        this.publicBattles = battles;
      });
  },
...
```

Now, we took advantage of one of the **Vuejs 2** lifecycle hooks, `mounted`. Whatever is defined in this method is applied just after a component is mounted on the browser screen. So, we invoked the `getPublicStartupBattles` method in the hook as seen below:

```js
...
 mounted() {
    this.getPublicStartupBattles();
  }
...
```

All we are trying to do is tell **Vuejs** to load the data from the API just after the `publicBattles` component gets rendered.

**Note:** You can add a loading indicator or spinner to present to the user while the data is been loaded from the API. This avoids flashing of blank screens. Check out [vuejs transition for loading data](https://laracasts.com/discuss/channels/vue/vuejs-transition-for-loading-data).

We imported the `AppNav` component and registered it under the `components` property. The `name` property has a value of `publicBattles`. What that simply means is this. If we need to use this component in a template, then we would have it as `<publicBattles></publicBattles>`.

Let's take a good look at what is enclosed in the `<template>` tag. This is what is rendered on the screen.

We looped through the `publicBattles` property which is now an array with the help of the `v-for` inbuilt directive to display the contents on the screen.

{% highlight html %}
{% raw %}
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
{% endraw %}
{% endhighlight %}

```js
...
  data() {
    return {
      publicBattles: '',
    };
  },
...
```

That's the `publicBattles` property right there. Vuejs automatically binds it to the DOM. So, we can just use it in the `<template>` tag.

Now, let's build the `PrivateBattles` component in the same way:

{% highlight html %}
{% raw %}
<template>
  <div>
    <app-nav></app-nav>
    <h3 class="text-center">Secret Startup Battles</h3>
    <hr/>

    <div class="col-sm-4" v-for="battle in privateBattles">
      <div class="panel panel-danger">
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
      <div class="jumbotron text-center">
        <h2>View Public Startup Battles</h2>
        <router-link class="btn btn-lg btn-success" to="/"> Public Startup Battles </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import AppNav from './AppNav';
import { isLoggedIn } from '../../utils/auth';
import { getPrivateStartupBattles } from '../../utils/battles-api';

export default {
  name: 'privateBattles',
  components: {
    AppNav,
  },
  data() {
    return {
      privateBattles: '',
    };
  },
  methods: {
    isLoggedIn() {
      return isLoggedIn();
    },
    getPrivateStartupBattles() {
      getPrivateStartupBattles().then((battles) => {
        this.privateBattles = battles;
      });
    },
  },
  mounted() {
    this.getPrivateStartupBattles();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
{% endraw %}
{% endhighlight %}

_privateBattles.vue_

Give yourself a pat on the back because you have successfully created the `AppNav`, `PublicBattles`, and `PrivateBattles` components. Whoop! Whoop!

We need to take care of one more thing so that our app can function. Routing!!!

## Build the Router

Open up `src/router/index.js` file, this is where the vue router is defined. So modify the code like so:

```js
import Vue from 'vue';
import Router from 'vue-router';
import PrivateBattles from '@/components/privateBattles';
import PublicBattles from '@/components/publicBattles';

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
      component: PrivateBattles,
    },
  ],
});
```

_index.js_

Each route has a path, name and the component to be rendered when that route is invoked by the user. By the ways, we already imported the components at the top of the file.

```js

import Vue from 'vue';
import Router from 'vue-router';
import PrivateBattles from '@/components/privateBattles';
import PublicBattles from '@/components/publicBattles';

```

Just a few things before we check our application in the browser:

* Open up `index.html` in the root directory and add [bootstrap](http://getbootstrap.com). Now the content of the html file should look like this:

{% highlight html %}

<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>startupbattle</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
  </head>
  <body>
    <div id="app"></div>
    <!-- built files will be auto injected -->
  </body>
</html>

{% endhighlight %}

Feel free to check out your application in the browser. Right now, you should have something like this:

![Homepage](https://cdn.auth0.com/blog/vuejs2/homepage.png)
_Homepage_

![Celebritypage](https://cdn.auth0.com/blog/vujes2/privatebattles.png)
_Private Battles Page_

## Adding Authentication to Your Vuejs 2 App

The majority of the apps we use on a daily basis have a means of authenticating users. I'll show you how to easily add authentication to our **Vuejs 2** application. We'll use [Auth0](https://auth0.com/) as our authentication service.

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

### Secure The Node API

We need to secure the API so that the private battles endpoint will only be accessible to authenticated users. We can secure it easily with Auth0.

Open up your `server.js` file and add the `authCheck` middleware to the private battles endpoint like so:

```js

app.get('/api/battles/private', authCheck, (req,res) => {
  let privateBattles = [
    // Array of private battles
  ];

  res.json(privateBattles);
})

app.listen(3333);
console.log('Listening on localhost:3333');

```


Try accessing the `http://localhost:3333/api/battles/private` endpoint again from Postman. You should be denied access like so:

![Unauthorized Access](https://cdn.auth0.com/blog/vuejs2/unauthorized.png)
_Unauthorized Access_

Next, let's add authentication to our front-end.

### Adding Authentication to our Vuejs 2 Front-end

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

**Vuejs 2** is a lightweight, fast and awesome library for building user interfaces. Its learning curve is gentle and its API is not complex to understand. It has a fast growing community and there are many components available to the public for different functionalities.

In addition, Auth0 can help secure your **Vuejs 2** apps with more than just username-password authentication. It provides features like [multifactor auth](https://auth0.com/docs/multifactor-authentication), [anomaly detection](https://auth0.com/docs/anomaly-detection), [enterprise federation](https://auth0.com/docs/identityproviders), [single sign on (SSO)](https://auth0.com/docs/sso), and more. <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">Sign up</a> today so you can focus on building features unique to your app.

> Auth0 provides the simplest and easiest to use [user interface tools to help administrators manage user identities](https://auth0.com/user-management) including password resets, creating and provisioning, blocking and deleting users.
