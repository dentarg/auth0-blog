## Aside: Authenticate a Vue App and Node API with Auth0

We can protect our applications and APIs so that only authenticated users can access them. Let's explore how to do this with a Vue application and a Node API using [Auth0](https://auth0.com). You can clone this sample app and API from the [vue-auth0-aside repo on GitHub](https://github.com/auth0-blog/vue-auth0-aside).

![Auth0 login screen](https://cdn.auth0.com/blog/resources/auth0-centralized-login.jpg)

### Features

The [sample Vue application and API](https://github.com/auth0-blog/vue-auth0-aside) has the following features:

* Vue application generated with [Vue CLI](https://github.com/vue/vue-cli) and served at [http://localhost:4200](http://localhost:4200)
* Authentication with [auth0.js](https://auth0.com/docs/libraries/auth0js/) using the Auth0 login page
* Node server protected API route `http://localhost:3001/api/meetups/private` returns JSON data for authenticated `GET` requests
* Vue app fetches data from API once user is authenticated with Auth0
* Authentication service uses a subject to propagate authentication status events to the entire app.
* Access token and token expiration are stored in local storage and removed upon logout.

### Sign Up for Auth0

You'll need an [Auth0](https://auth0.com) account to manage authentication. You can sign up for a <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">free account here</a>. Next, set up an Auth0 client app and API so Auth0 can interface with an Angular app and Node API.

### Set Up a Client App

1. Go to your [**Auth0 Dashboard**](https://manage.auth0.com/#/) and click the "[create a new client](https://manage.auth0.com/#/clients/create)" button.
2. Name your new app and select "Single Page Web Applications".
3. In the **Settings** for your new Auth0 client app, add `http://localhost:8080/callback` to the **Allowed Callback URLs**.
4. Scroll down to the bottom of the **Settings** section and click "Show Advanced Settings". Choose the **OAuth** tab and verify that the **JsonWebToken Signature Algorithm** is set to `RS256`.
5. If you'd like, you can [set up some social connections](https://manage.auth0.com/#/connections/social). You can then enable them for your app in the **Client** options under the **Connections** tab. The example shown in the screenshot above utilizes username/password database, Facebook, Google, and Twitter. For production, make sure you set up your own social keys and do not leave social connections set to use Auth0 dev keys.

### Set Up an API

1. Go to [**APIs**](https://manage.auth0.com/#/apis) in your Auth0 dashboard and click on the "Create API" button. Enter a name for the API. Set the **Identifier** to a URL. In this example, this is `http://meetupapi.com/`. The **Signing Algorithm** should be `RS256`.
2. You can consult the Node.js example under the **Quick Start** tab in your new API's settings. We'll implement our Node API in this fashion, using [Express](https://expressjs.com/), [express-jwt](https://github.com/auth0/express-jwt), and [jwks-rsa](https://github.com/auth0/node-jwks-rsa).

We're now ready to implement Auth0 authentication on both our Vue client and Node backend API.

### Dependencies and Setup

The Vue app utilizes the [Angular CLI](https://github.com/vue/vue-cli). Make sure you have the CLI installed globally:

```bash
$ npm install -g vue-cli
```

Once you've cloned [the project](https://github.com/auth0-blog/vue-auth0-aside), install the Node dependencies for both the Vue app and the Node server by running the following commands in the root of your project folder:

```bash
$ npm install
$ cd server
$ npm install
```

The Node API is located in the [`/server` folder](https://github.com/auth0-blog/vue-auth0-aside/tree/master/server) at the root of our sample application.

Find the [`config.js.example` file](https://github.com/auth0-blog/vue-auth0-aside/blob/master/server/config.js.example) and **remove** the `.example` extension from the filename. Then open the file:

```js
// server/config.js
// (formerly config.js.example)
module.exports = {
  CLIENT_DOMAIN: '[CLIENT_DOMAIN]', // e.g. 'you.auth0.com'
  AUTH0_AUDIENCE: 'http://meetupapi.com'
};
```

Change the `CLIENT_DOMAIN` variable to your Auth0 client domain and set the `AUTH0_AUDIENCE` to your audience (in this example, this is `http://meetupapi.com`). The `/api/examples/private` route will be protected with [express-jwt](https://github.com/auth0/express-jwt) and [jwks-rsa](https://github.com/auth0/node-jwks-rsa).

> **Note:** To learn more about RS256 and JSON Web Key Set, read [Navigating RS256 and JWKS](https://auth0.com/blog/navigating-rs256-and-jwks/).

Our app and API are now set up. They can be served by running `npm run dev` from the root folder and `node server.js` from the `/server` folder.

With the Node API and Angular app running, let's take a look at how authentication is implemented.

### Authentication Service

Authentication logic on the front end is handled with an `Auth` authentication service: [`src/auth/Auth.js` file](https://github.com/auth0-blog/vue-auth0-aside/blob/master/src/auth/Auth.js).

```js
// src/auth/Auth.js
/* eslint-disable */
import auth0 from 'auth0-js';
import router from '../router';

export default class Auth {
  
  auth0 = new auth0.WebAuth({
    domain: AUTH0_DOMAIN, // e.g., you.auth0.com
    clientID: AUTH0_CLIENT_ID, // e.g., i473732832832cfgajHYEUqiqwq
    redirectUri: CALLBACK_URL, // e.g., http://localhost:8080/callback
    audience: AUTH0_API_AUDIENCE, // e.g., https://meetupapi.com
    responseType: 'token',
    scope: 'openid'
  });

  constructor() {
    this.login = this.login.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.logout = this.logout.bind(this);
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken) {
        this.setSession(authResult);
        router.replace('/');
      } else if (err) {
        router.replace('/');
      }
    })
  }

  setSession(authResult) {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  requireAuth(to, from, next) {
    if (! (new Auth).isAuthenticated()) {
      next({
        path: '/',
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } 
  

  login() {
    this.auth0.authorize();
  }

  logout() {
    // Clear access token and expiration from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('expires_at');
    // navigate to the landing page route
    router.go('/');
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }
}
```

Replace the constants, `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, `AUTH0_API_AUDIENCE` with values from your Auth0 dashboard. Replace `CALLBACK_URL` with `http://localhost:8080/callback`.

The `login()` method authorizes the authentication request with Auth0. An Auth0 centralized login page will be shown to the user and they can then log in.

> **Note:** If it's the user's first visit to our app _and_ our callback is on `localhost`, they'll also be presented with a consent screen where they can grant access to our API. A first party client on a non-localhost domain would be highly trusted, so the consent dialog would not be presented in this case. You can modify this by editing your [Auth0 Dashboard API](https://manage.auth0.com/#/apis) **Settings**. Look for the "Allow Skipping User Consent" toggle.

We'll receive `accessToken` and `expiresIn` in the hash from Auth0 when returning to our app. The `handleAuthentication()` method uses Auth0's `parseHash()` method callback to set the session (`setSession()`) by saving the tokens, and token expiration to local storage. The `isAuthenticated` method informs the components in the app about the user's authentication status via checking the access token's expiry time.

Finally, we have a `logout()` method that clears data from local storage.

### Callback Component

The [callback component](https://github.com/auth0-blog/vue-auth0-aside/tree/master/src/components/Callback.vue) is where the app is redirected after authentication. This component simply shows a loading message until the login process is completed. It executes the `handleAuthentication()` method to parse the hash and extract authentication information.

```js
// src/components/Callback.vue
<template>
  <div>
      <h3>Loading....</h3>
  </div>
</template>
<script>

import Auth from '../auth/Auth.js';

const auth = new Auth();

export default {
  name: '',
  mounted() {
    this.$nextTick(() => {
      auth.handleAuthentication();
    });
  },
};
</script>
```

### Making Authenticated API Requests

In order to make authenticated HTTP requests, we need to add an `Authorization` header with the access token in our [`meetup-api.js` file](https://github.com/auth0-blog/vue-auth0-aside/blob/master/utils/meetup-api.js).

```js
// utils/meetup-api.js
/* eslint-disable */
import axios from 'axios';
import Auth from '../src/auth/Auth.js';

const auth = new Auth();
const BASE_URL = 'http://localhost:3333';

export function getPublicMeetups() {
  const url = `${BASE_URL}/api/meetups/public`;
  return axios.get(url).then(response => response.data).catch(err =>  err || 'Unable to retrieve data');
}

export function getPrivateMeetups() {
  const url = `${BASE_URL}/api/meetups/private`;
  return axios.get(url, { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }}).then(response => response.data).catch(err => err || 'Unable to retrieve data');
}
```

### Final Touches: Route Guard and Private Meetups Page

A [Private meetup page component](https://github.com/auth0-blog/angular-auth0-aside/tree/master/src/app/profile) can show information about private meetups. However, we only want this component to be accessible if the user is logged in.

The route guard is implemented on specific routes of our choosing in the [`router/index.js` file](https://github.com/auth0-blog/vue-auth0-aside/blob/master/src/router/index.js) like so:

```js
// src/router/index.js
import Vue from 'vue';
import Router from 'vue-router';
import PublicMeetups from '@/components/PublicMeetups';
import PrivateMeetups from '@/components/PrivateMeetups';
import Callback from '@/components/Callback';
import Auth from '../auth/Auth';

const auth = new Auth();

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'PublicMeetups',
      component: PublicMeetups,
    },
    {
      path: '/private-meetups',
      name: 'PrivateMeetups',
      beforeEnter: auth.requireAuth,
      component: PrivateMeetups,
    },
    {
      path: '/callback',
      component: Callback,
    },
  ],
});
```

### More Resources

That's it! We have an authenticated Node API and Angular application with login, logout, and protected routes. To learn more, check out the following resources:

* [Why You Should Always Use Access Tokens to Secure an API](https://auth0.com/blog/why-should-use-accesstokens-to-secure-an-api/)
* [Navigating RS256 and JWKS](https://auth0.com/blog/navigating-rs256-and-jwks/)
* [Access Token](https://auth0.com/docs/tokens/access-token)
* [Verify Access Tokens](https://auth0.com/docs/api-auth/tutorials/verify-access-token)
* [Call APIs from Client-side Web Apps](https://auth0.com/docs/api-auth/grant/implicit)
* [How to implement the Implicit Grant](https://auth0.com/docs/api-auth/tutorials/implicit-grant)
* [Auth0.js Documentation](https://auth0.com/docs/libraries/auth0js)
* [OpenID Standard Claims](https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims)
