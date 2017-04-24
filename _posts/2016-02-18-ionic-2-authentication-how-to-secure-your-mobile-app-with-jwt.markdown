---
layout: post
title: "Ionic 2 Authentication: How to Secure Your Mobile App with JWT"
description: "Ionic 2 Beta has been released. Learn how to add JWT authentication to your Ionic 2 app and make secure calls to an API."
date: 2016-02-18 08:30
alias: /2016/02/18/ionic-2-authentication-how-to-secure-your-mobile-app-with-jwt/
category: Technical Guide, Mobile, Ionic
author:
  name: Ryan Chenkie
  url: https://twitter.com/ryanchenkie?lang=en
  mail: ryanchenkie@gmail.com
  avatar: https://www.gravatar.com/avatar/7f4ec37467f2f7db6fffc7b4d2cc8dc2?size=200
design:
  bg_color: "#133D82"
  image: https://cdn.auth0.com/blog/ionic2-auth/ionic-logo.png
  image_size: "101%"
tags:
- angular2
- angularjs
- ionic
- mobile
- authentication
- jwt
- javascript
related:
- 2016-04-15-angularjs-authentication-screencast-series-part-1
- 2015-11-10-introducing-angular2-jwt-a-library-for-angular2-authentication
- 2015-08-11-create-your-first-ember-2-dot-0-app-from-authentication-to-calling-an-api
---

**TL;DR:** Ionic 2 Beta, which is built on Angular 2, has been released, and brings with it some excellent features. In this article we explore how to add JWT authentication to an Ionic 2 app. Check out [the repo](https://github.com/auth0/ionic2-auth) to go straight to the code.

---

Ionic 2 Beta has been released and, just as Angular 2 is vastly different from Angular 1.x, the brand new Ionic is completely revamped as well. Ionic 2 brings all the power of Angular 2, and provides several of its own decorators for crafting cross-platform mobile applications easily. We still get a lot of the great features from Ionic 1, plus a lot more.

{% include tweet_quote.html quote_text="Ionic 2 brings to the table all the power of Angular 2" %}

Authentication is a critical component of non-trivial mobile apps, and with Ionic 2, we can add JWT authentication easily by following the same process we would for an Angular 2 app.

In this tutorial we'll build a simple Ionic 2 application that can authenticate users and provide access to protected resources that are secured with JWT authentication from a NodeJS server. We'll use our [NodeJS JWT Authentication Sample](https://github.com/auth0/nodejs-jwt-authentication-sample) to allow users to create accounts, log in, and retrieve public and private Chuck Norris quotes.

![Ionic 2 Authentication](https://cdn.auth0.com/blog/ionic2-auth/ionic2-auth-6.png)

## Getting Started with Ionic Authentication

To get started, let's first install Ionic and Cordova so we can create our new project.

> **Note:** Cordova is a project that provides web access to native plugins. It is not specifically related to Ionic, and can be used with any other framework. But Ionic can take advantage of Cordova's extensive [set of plugins](https://cordova.apache.org/plugins) to implement features such as *scan barcodes*, *receive push notifications*, *access smartphone image gallery*, and so on.

```bash
# Install Ionic and Cordova globally
npm install -g ionic cordova

# Then use Ionic CLI to create a template project
ionic start chuck-norris-quotes --v2
```

Next we can clone the backend repo into a directory called `server`. Even though we won't need it until a little later, we can also start the server now to have it ready to go.

```bash
git clone git@github.com:auth0/nodejs-jwt-authentication-sample.git server
cd server && npm install
node server.js
```

Now we can serve the Ionic application to make sure it's coming through ok. From a new terminal tab, go to the directory created by Ionic, and issue `ionic serve`.

> **Note:** We'll develop in the browser in this tutorial, but you can also emulate a device as you develop if you like. Take a look at the [Ionic docs](http://ionicframework.com/docs/intro/installation/#platform-guides) for steps on how to emulate iOS and Android.

By default we are given a "tabs" style layout that has three pages linked in a tab strip along the bottom of the app view. We can also choose from other [starter templates](https://market.ionic.io/starters/) such as "complex-list" or "sidemenu" if we like.

## Bootstrapping the Application

All of the action starts with the root component which is found in `app/app.module.ts`. Ionic apps are bootstrapped a bit differently than a regular Angular 2 application. With Ionic, we have to instruct our Angular 2 application to `bootstrap` with `IonicApp` class. Fortunately, this is automatically configured to us by the `ionic start` command that we've issued before.

Since we'll be making authenticated HTTP requests, we'll need to use the [angular2-jwt](https://github.com/auth0/angular2-jwt) library. Install it by through the following command:

```bash
npm install --save angular2-jwt
```

## Creating the Profile Page for Authentication

We'll really just need two pages for our app: one that retrieves quotes and another that acts as a profile area where the user can log in and out. Let's set up the profile page first.

You'll notice that the template that comes with Ionic 2 has three generic pages and a `TabsPage` component in the `pages` directory. The `TabsPage` is used to provide navigation to the other pages and gives us the tab strip at the bottom of the app.

The other ones are just generic placeholder pages and, as such, we can delete them. To do so, let's remove the following directories: `pages/about`, `pages/contact`, and `pages/home`. And remove their utilization from the `app/app.module.ts` file. This last step is achieved by removing these components:

* `import` statements
* from the `declarations` and `entryComponents` properties of `@NgModule`

 And then we generate the two pages that our app will have, through the Ionic's CLI:

 ```bash
 ionic g page profile
 ionic g page quotes
 ```

 We'll need to change up the SASS files we import in `app/app.scss`:

 ```css
@import "../pages/profile/profile";
@import "../pages/quotes/quotes";
```

We'll also need to adjust the `TabsPage` component so that it knows about our new pages. To do that, let's update two files: `pages/tabs/tabs.html` and `page/tabs/tabs.ts`.

{% highlight html %}
<!-- pages/tabs/tabs.html -->
<ion-tabs>
  <ion-tab [root]="quotesPage" tabTitle="Quotes" tabIcon="quote"></ion-tab>
  <ion-tab [root]="profilePage" tabTitle="Profile" tabIcon="person"></ion-tab>
</ion-tabs>
{% endhighlight %}

```ts
// pages/tabs/tabs.ts

import {Component} from '@angular/core';
import {Profile} from '../profile/profile';
import {Quotes} from '../quotes/quotes';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  profilePage = Profile;
  quotesPage = Quotes;

  constructor() {
  }
}
```

With both files in place, let's set up the the profile page. We can start with the `Profile` component.

```js
// pages/profile/profile.ts
import {Component} from "@angular/core";
import {IonicPage} from "ionic-angular";
import {Headers, Http} from "@angular/http";
import {JwtHelper} from "angular2-jwt";
import {Storage} from "@ionic/storage";
import {AuthService} from "../../app/services/auth/auth";
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class Profile {

  private LOGIN_URL = "http://localhost:3001/sessions/create";
  private SIGNUP_URL = "http://localhost:3001/users";

  auth: AuthService;

  // When the page loads, we want the Login segment to be selected
  authType: string = "login";

  // We need to set the content type for the server
  contentHeader = new Headers({"Content-Type": "application/json"});
  error: string;
  jwtHelper = new JwtHelper();
  user: string;

  constructor(private http: Http, private storage: Storage) {
    this.auth = AuthService;

    storage.ready().then(() => {
      storage.get('profile').then(profile => {
        this.user = JSON.parse(profile);
      }).catch(console.log);
    });
  }

  authenticate(credentials) {
    this.authType == 'login' ? this.login(credentials) : this.signup(credentials);
  }

  login(credentials) {
    this.http.post(this.LOGIN_URL, JSON.stringify(credentials), { headers: this.contentHeader })
      .map(res => res.json())
      .subscribe(
        data => this.authSuccess(data.id_token),
        err => this.error = err
      );
  }

  signup(credentials) {
    this.http.post(this.SIGNUP_URL, JSON.stringify(credentials), { headers: this.contentHeader })
      .map(res => res.json())
      .subscribe(
        data => this.authSuccess(data.id_token),
        err => this.error = err
      );
  }

  logout() {
    this.storage.remove('token');
    this.user = null;
  }

  authSuccess(token) {
    this.error = null;
    this.storage.set('token', token);
    this.user = this.jwtHelper.decodeToken(token).username;
    this.storage.set('profile', this.user);
  }
}
```

The `login` and `signup` methods send the user's credentials to the server. If the user successfully authenticates, a JWT is sent back in the response. To save the returned token, we're using the `Storage` class that comes from Ionic, which provide a local storage engine for us. The standard `localStorage` browser API would still work, but it's recommended that we use this class. Note that to properly setup `Storage`, we need to add configure it in the `pages/profile/profile.module.ts` file. Add `IonicStorageModule.forRoot()` in the `imports` property of the `@NgModule` decoration of the class in this file, and import `IonicStorageModule` from the `@ionic/storage` module.

The `authSuccess` method saves the token and also sets the `user` object with the user details contained in the token. The tokens returned from our server have a `username` claim, which we can use to greet the user. The `JwtHelper` class that comes with **angular2-jwt** can decode the token and give us access to the claims on it, which is how we access the username here.

Logging out is a simple matter of removing the user's JWT from local storage and setting the user property to `null`.

We've set a property called `authType` to the value `"login"`. We'll be needing this for our view (which we'll set up next) to control the "segment" UI element. You'll also notice that we're using an `AuthService` class that we've yet to create. This service will be used to give us an indication of whether or not the user has a valid JWT in local storage, which is helpful for conditionally showing or hiding certain parts of the UI.

Let's now create the view.

{% highlight html %}
{% raw %}
<!-- pages/profile/profile.html -->
<ion-navbar *navbar>
  <ion-title>Profile</ion-title>
</ion-navbar>

<ion-content class="login" *ngIf="!auth.authenticated()">
  <ion-segment [(ngModel)]="authType" color="primary">
    <ion-segment-button value="login">
      Login
    </ion-segment-button>
    <ion-segment-button value="signup">
      Sign Up
    </ion-segment-button>
  </ion-segment>

  <form #signForm="ngForm" (ngSubmit)="authenticate(signForm.value)">
    <ion-item>
      <ion-label>Username</ion-label>
      <ion-input type="text" name="username" ngModel></ion-input>
    </ion-item>

    <ion-item>
      <ion-label>Password</ion-label>
      <ion-input type="password" name="password" ngModel></ion-input>
    </ion-item>

    <div padding>
      <button block type="submit">Login</button>
    </div>
  </form>
</ion-content>

<ion-content *ngIf="auth.authenticated()">
  <h1>Welcome, {{ user }}</h1>
  <div padding>
    <button block (click)="logout()">Logout</button>
  </div>
</ion-content>
{% endraw %}
{% endhighlight %}

The segment UI component gives us controls to switch between various views or "segments", and this is a useful component to use for login and signup. The `ion-segment` selector has the `authType` property that we saw in the `ProfilePage` component bound to it, and we use this property to conditionally decide which method to execute, `login` or `signup`. Angular's form directives allow us to pass the input from each form directly to the `authenticate` method through the `ngSubmit` event handler.

We don't want to show the login/signup form when the user is already authenticated. To hide it, we're checking if `auth.authenticated()`—which comes from the `AuthService` we'll create next—is `false`. Likewise, we check if it is `true` to conditionally show the user's welcome message.

### Creating the Authentication Service

The `AuthService` just needs a single method called `authenticated` which will check if the user has an unexpired JWT in local storage.

```js
// app/services/auth/auth.ts
import {tokenNotExpired} from 'angular2-jwt';

export class AuthService {
  constructor() {}

  public static authenticated() {
    return tokenNotExpired('/_ionickv/token');
  }
}
```

The **angular2-jwt** library provides a function called `tokenNotExpired` which checks the user's JWT for us and will return `true` if it is unexpired or `false` if it is expired.

Now that the profile page is in place, we are able to sign up for an account and log in.

![ionic2 authentication](https://cdn.auth0.com/blog/ionic2-auth/ionic2-auth-6.png)

## Creating the Quotes Page

Now that we have an authenticated user, let's build out the `Quotes` component to access our secured API route.

```js
// pages/quotes/quotes.ts
import { Component } from '@angular/core';
import { IonicPage} from 'ionic-angular';
import {AuthService} from "../../app/services/auth/auth";
import {Http, Headers} from "@angular/http";
import 'rxjs/add/operator/map';
import {Storage} from "@ionic/storage";

@IonicPage()
@Component({
  selector: 'page-quotes',
  templateUrl: 'quotes.html',
})
export class Quotes {
  API: string = "http://localhost:3001/api";
  quote: string;
  error: string;
  auth: AuthService;

  constructor(private http: Http, private storage: Storage) {
    this.auth = AuthService;
  }

  getQuote() {
    // Use a regular Http call to access unsecured routes
    this.http.get(`${this.API}/random-quote`)
      .map(res => res.text())
      .subscribe(
        data => this.quote = data,
        err => this.error = err
      );
  }

  getSecretQuote() {
    // Use authHttp to access secured routes
    this.storage.get('token').then((token) => {
      let headers = new Headers();
      headers.append('Authorization', 'Bearer ' + token);

      this.http.get(`${this.API}/protected/random-quote`, {
        headers: headers
      }).map(res => res.text())
        .subscribe(
          data => this.quote = data,
          err => this.error = err
        );
    })
  }
}
```

In this component we have two methods, `getQuote` and `getSecretQuote` which will send HTTP requests to the server for the quotes. The difference between them is that `getSecretQuote` adds an `Authorization` header with a bearer token on it, so that the backend can identify the requester.


{% highlight html %}
{% raw %}
<!-- pages/quotes/quotes.html -->
<ion-navbar *navbar>
  <ion-title>Get a Quote!</ion-title>
</ion-navbar>

<ion-content padding class="quotes">
  <h2>Welcome to the Ionic 2 Quotes App!</h2>
  <p>You can get a regular quote below, or you can sign in to get a secret quote.</p>

  <button (click)="getQuote()">Get Quote</button>
  <button *ngIf="auth.authenticated()" (click)="getSecretQuote()">Get Secret Quote</button>

  <h3>{{ quote }}</h3>

  <p class="error" *ngIf="error">{{ error }}</p>
</ion-content>

{% endraw %}
{% endhighlight %}

We only want to show the button for retrieving a secret quote if the user has an unexpired JWT, and once again we use the `AuthService` to perform this check.

We should now be able to get quotes from the **Quotes** page.

![ionic2 authentication](https://cdn.auth0.com/blog/ionic2-auth/ionic2-auth-7.png)

## Aside: Adding Authentication with Auth0

Let's explore how to protect our applications and APIs, so that only authenticated users can access them, using [Auth0](https://auth0.com). You can clone this sample app and API from the [angular-auth0-aside repo on GitHub](https://github.com/auth0-blog/angular-auth0-aside).

![Auth0 hosted login screen](https://cdn2.auth0.com/blog/angular-aside/angular-aside-login.jpg)

### Sign Up for Auth0

You'll need an [Auth0](https://auth0.com) account to manage authentication. You can sign up for a [free account here](javascript:signup\(\)). Next, set up an Auth0 client app and API so Auth0 can interface with an Angular app and Node API.

### Set Up a Client App

1. Go to your [**Auth0 Dashboard**](https://manage.auth0.com/#/) and click the "[create a new client](https://manage.auth0.com/#/clients/create)" button.
2. Name your new app and select "Single Page Web Applications".
3. In the **Settings** for your new Auth0 client app, add `http://localhost:8100/callback` to the **Allowed Callback URLs** and `http://localhost:8100` to the **Allowed Origins (CORS)**.
4. Scroll down to the bottom of the **Settings** section and click "Show Advanced Settings". Choose the **OAuth** tab and change the **JsonWebToken Signature Algorithm** to `RS256`.
5. If you'd like, you can [set up some social connections](https://manage.auth0.com/#/connections/social). You can then enable them for your app in the **Client** options under the **Connections** tab. The example shown in the screenshot above utilizes username/password database, Facebook, Google, and Twitter.

### Set Up an API

1. Under your account name in the upper right corner of your [**Auth0 Dashboard**](https://manage.auth0.com/#/), choose **Account Settings** from the dropdown, then select the [**Advanced**](https://manage.auth0.com/#/account/advanced) tab. Scroll down to the **Settings** section and turn on the toggle for **Enable APIs Section**. Now you will have a link to manage [APIs](https://manage.auth0.com/#/apis) in your dashboard left sidebar navigation.
2. Go to [**APIs**](https://manage.auth0.com/#/apis) in your dashboard and click on the "Create API" button. Enter a name for the API. Set the **Identifier** to your API endpoint URL. In this example, this is `http://localhost:3001/api/`. The **Signing Algorithm** should be `RS256`.
3. You can consult the Node.js example under the **Quick Start** tab in your new API's settings. We'll implement our Node API in this fashion, using [Express](https://expressjs.com/), [express-jwt](https://github.com/auth0/express-jwt), and [jwks-rsa](https://github.com/auth0/node-jwks-rsa).

We're now ready to implement Auth0 authentication on both our Angular client and Node backend API.

### Dependencies and Setup

The Angular app utilizes the [Angular CLI](https://github.com/angular/angular-cli). Make sure you have the CLI installed globally:

```bash
$ npm install -g @angular/cli
```

Install the Node dependencies for both the Angular app and the Node server by running the following commands in the root of your project folder:

```bash
$ cd server
$ npm install --save jwks-rsa
```

The Node API is located in the `/server` folder at the root of our sample application.

Open the `server/protected-routes.js` file:

```js
// server/protected-routes.js
...
// @TODO: change [CLIENT_DOMAIN] to your Auth0 domain name.
// @TODO: change [AUTH0_API_AUDIENCE] to your Auth0 API audience.
var CLIENT_DOMAIN = '[CLIENT_DOMAIN].auth0.com';
var AUTH0_AUDIENCE = '[AUTH0_API_AUDIENCE]';  // http://localhost:3001/api in this example

var jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${CLIENT_DOMAIN}/.well-known/jwks.json`
    }),
    audience: AUTH0_AUDIENCE,
    issuer: `https://${CLIENT_DOMAIN}/`,
    algorithms: ['RS256']
});
...
```

Change the `CLIENT_DOMAIN` variable to your Auth0 client domain. The `/api/protected` route will be protected with [express-jwt](https://github.com/auth0/express-jwt) and [jwks-rsa](https://github.com/auth0/node-jwks-rsa).

> **Note:** To learn more about RS256 and JSON Web Key Set, read [Navigating RS256 and JWKS](https://auth0.com/blog/navigating-rs256-and-jwks/).

### Authentication Service

Authentication logic on the front end is handled with by the `Profile` component: `src/pages/profile/profile.ts` file.

```js
import {Component} from "@angular/core";
import {IonicPage} from "ionic-angular";
import {Headers, Http} from "@angular/http";
import {JwtHelper} from "angular2-jwt";
import {Storage} from "@ionic/storage";
import {AuthService} from "../../app/services/auth/auth";
import 'rxjs/add/operator/map';

// Avoid name not found warnings
declare var auth0: any;

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class AuthService {
  // Create Auth0 web auth instance
  // @TODO: Replace {YOUR_CLIENT_ID} and {YOUR_CLIENT_DOMAIN}
  private auth0 = new auth0.WebAuth({
    clientID: '{YOUR_CLIENT_ID}',
    domain: '{YOUR_CLIENT_DOMAIN}'
  });

  userProfile: UserProfile;

  // Create a stream of logged in status to communicate throughout app
  loggedIn: boolean;
  loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);

  constructor(private router: Router) {
    // If authenticated, set local profile property and update login status subject
    if (this.authenticated) {
      this.userProfile = JSON.parse(localStorage.getItem('profile'));
      this.setLoggedIn(true);
    }
  }

  setLoggedIn(value: boolean) {
    // Update login status subject
    this.loggedIn$.next(value);
    this.loggedIn = value;
  }

  login() {
    // Auth0 authorize request
    // Note: nonce is automatically generated: https://auth0.com/docs/libraries/auth0js/v8#using-nonce
    this.auth0.authorize({
      responseType: 'token id_token',
      redirectUri: AUTH_CONFIG.REDIRECT,
      audience: AUTH_CONFIG.AUDIENCE,
      scope: AUTH_CONFIG.SCOPE
    });
  }

  handleAuth() {
    // When Auth0 hash parsed, get profile
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this._getProfile(authResult);
        this.router.navigate(['/']);
      } else if (err) {
        this.router.navigate(['/']);
        console.error(`Error: ${err.error}`);
      }
    });
  }

  private _getProfile(authResult) {
    // Use access token to retrieve user's profile and set session
    this.auth0.client.userInfo(authResult.accessToken, (err, profile) => {
      this._setSession(authResult, profile);
    });
  }

  private _setSession(authResult, profile) {
    // Save session data and update login status subject
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('profile', JSON.stringify(profile));
    this.userProfile = profile;
    this.setLoggedIn(true);
  }

  logout() {
    // Remove tokens and profile and update login status subject
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
    this.userProfile = undefined;
    this.setLoggedIn(false);
  }

  get authenticated() {
    // Check if there's an unexpired access token
    return tokenNotExpired('access_token');
  }

}
```

This service uses the config variables from `auth0-variables.ts` to instantiate an `auth0.js` WebAuth instance.

> **Note:** `auth0.js` is linked in the `index.html` file from CDN.

An [RxJS `BehaviorSubject`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/subjects/behaviorsubject.md) is used to provide a stream of authentication status events that you can subscribe to anywhere in the app.

The `login()` method authorizes the authentication request with Auth0 using your config variables. An Auth0 hosted Lock instance will be shown to the user and they can then log in:

> **Note:** If it's the user's first visit to our app _and_ our callback is on `localhost`, they'll also be presented with a consent screen where they can grant access to our API. A first party client on a non-localhost domain would be highly trusted, so the consent dialog would not be presented in this case. You can modify this by editing your [Auth0 Dashboard API](https://manage.auth0.com/#/apis) **Settings**. Look for the "Allow Skipping User Consent" toggle.

We'll receive an `id_token` and an `access_token` in the hash from Auth0 when returning to our app. The `handleAuth()` method uses Auth0's `parseHash()` method callback to get the user's profile (`_getProfile()`) and set the session (`_setSession()`) by saving the tokens and profile to local storage and updating the `loggedIn$` subject so that any subscribed components in the app are informed that the user is now authenticated.

> **Note:** The profile takes the shape of [`profile.model.ts`](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/auth/profile.model.ts) from the [OpenID standard claims](https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims).

The `handleAuth()` method can then be called in the [`app.component.ts` constructor](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/app.component.ts) like so:

```js
// src/app/app.component.ts
import { AuthService } from './auth/auth.service';
...
  constructor(private auth: AuthService) {
    // Check for authentication and handle if hash present
    auth.handleAuth();
  }
...
```

Finally, we have a `logout()` method that clears data from local storage and updates the `loggedIn$` subject. We also have an `authenticated()` accessor to return current authentication status.

Once [`AuthService` is provided in `app.module.ts`](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/app.module.ts#L32), its methods and properties can be used anywhere in our app, such as the [home component](https://github.com/auth0-blog/angular-auth0-aside/tree/master/src/app/home).

The [callback component](https://github.com/auth0-blog/angular-auth0-aside/tree/master/src/app/callback) is where the app is redirected after authentication. This component simply shows a loading message until hash parsing is completed and the Angular app redirects back to the home page.

### Making Authenticated API Requests

In order to make authenticated HTTP requests, we're using [angular2-jwt](https://github.com/auth0/angular2-jwt). The [`auth-http.factory.ts` factory](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/auth/auth-http.factory.ts) supplies an `authHttp` method that sends the `access_token` from local storage. This is provided in the [`app.module.ts` file](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/app.module.ts):

```js
// src/app/app.module.ts
...
import { authHttpFactory } from './auth/auth-http.factory';
...
  providers: [
    ...,
    {
      provide: AuthHttp,
      useFactory: authHttpFactory,
      deps: [Http, RequestOptions]
    }
  ],
```

We can then call our API in the [`api.service.ts` file](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/api.service.ts) with `AuthHttp` to authorize requests.

```js
// src/app/api.service.ts
...
import { AuthHttp, AuthConfig } from 'angular2-jwt';
...
  getDragons$(): Observable<any[]> {
    return this.authHttp
      .get(`${this.baseUrl}dragons`)
      .map(this._handleSuccess)
      .catch(this._handleError);
  }
...
```

### Done!

That's it! You've now got authentication with Auth0 set up for your Ionic 2 app.

## Wrapping Up

Developing Ionic authentication is very similar to how it's done in an Angular 2 application. This is really beneficial because we can reuse a lot of the same libraries and logic between the two of them. We're likely to see many more great features from Ionic 2 as it continues to develop.
