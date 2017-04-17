---
layout: post
title: "Understanding Angular 2 change detection"
description: "Angular 2 introduces a new change detection system that makes apps much faster and allows developers fine-tune the process."
date: 2016-09-23 8:30
category: Technical Guide, Angular, Angular2
banner:
  text: "Auth0 makes it easy to add authentication to your AngularJS application."
author:
  name: "Wojciech Kwiatek"
  url: "https://twitter.com/WojciechKwiatek"
  mail: "wojtek.kwiatek@gmail.com"
  avatar: "https://en.gravatar.com/userimage/102277541/a28d70be6ae2b9389db9ad815cab510e.png?size=200"
design:
  image: https://cdn.auth0.com/blog/angular/logo.png
  image_size: "75%"
  image_bg_color: "rgb(1, 70, 166)"
  bg_color: "rgb(1, 70, 166)"
  bg_merge: true
tags:
- angular2
- angularjs
- change-detection
- performance
- immutable
related:
- introducing-angular2-jwt-a-library-for-angular2-authentication
- create-a-desktop-app-with-angular-2-and-electron
- creating-your-first-real-world-angular-2-app-from-authentication-to-calling-an-api-and-everything-in-between

---

<div class="alert alert-info alert-icon">
  <i class="icon-budicon-664"></i>
  <strong>Get the "Migrating an Angular 1 App to Angular 2" book for Free.</strong> Spread the word and <a href="https://auth0.com/e-books/migrating-to-angular2">download it now!</a>
</div>

---

**TL;DR** Angular 2 introduces a reinvented change detection system that drops digest cycles in favor of one-way flow. Additionally, change detection can now be controlled and fine-tuned by developers to get the most of the framework's performance.

---

## Introduction to Change Detection
Angular 2 final has been released. You've probably heard about some of the changes due to the major version bump: it's has been completely rewritten, TypeScript was selected as the language of choice, reinvented forms, RxJS, a completely new router, etc. In my opinion, the most valuable thing is the redesign of the core change detection system. As you may remember, the digest loop performance of AngularJS (aka Angular 1) was problematic. Now it's not.

### Why Do We Need Change Detection?
Why bother? Generally, the power of modern JavaScript frameworks works something like this: an event changes in the model and forcing a change in the UI. This is change detection, the system that monitors events and acts on them. Something has to trigger this propagation to the view. As mentioned before, in Angular 1 we had digest loops that checked every single reference that was set to be watched for value changes. When Angular found out that everything was stable (no infinite loops, etc.), it propagated changes to the view. Although this was not efficient, it worked for a long time. Also, the problem was tracking asynchronous events. You also probably used `$scope.$apply(...)` if you worked with Angular 1. To understand why it was needed, let's start from the beginning.

### How Javascript works
The JavaScript runtime works on a single threaded engine. You've probably heard about the stack (possibly from other programming languages). Let's take the code below:

```js
console.log('Hey')
setTimeout(() => {
   console.log('Hello from timeout!')
}, 1000);
console.log('Hi')
```

We'll see this in a console as:

```html
Hey
Hi
Hello from timeout!
```

Moreover, nothing is blocked during the one-second wait period. So how would the JS engine do this with a single thread?

#### Synchronous code
Let's go step by step. If you have code like this:

```js
console.log('1')
console.log('2')
console.log('3')
```

every instruction will be put onto the stack and will run one by one. There's no possibility of seeing 3 before 2 or 1. So we'll end up with the following:

```
1
2
3
```

Every time. Everywhere.

#### Asynchronous code
But let's go back to the timeout:

```js
console.log('1')
setTimeout(() => {
  console.log('2')
}, 0)
console.log('3')
```

What happens now? On the stack, we'll have:

```js
console.log
setTimeout
console.log
```

The trick here is how `setTimeout` works and what it really is. Yes, it will be invoked as a normal synchronous action, but all the JS engine does is give the wheel to something else. There's a bunch of browser APIs that aren't part of this single threaded process. And there's a thing called event loop. This event loop goes one by one through the stack instructions, and if it's empty, it then goes to the *callback queue*. The reference to the `setTimeout` code is there. Once callback is done, the code will go to the stack.

What does it mean? Two things:

- Everything that's inside an asynchronous callback (as in `setTimeout`) will be run *after* any other synchronous code; this is why hacks like `setTimeout(() => {}, 0)` work.
- We have no way of ensuring 1000ms is *exactly* 1000ms (but we know it's at least 1000ms).

For complete understanding of event loop and what's going on in the browser, I encourage you to take a look at this [Philip Roberts talk](https://www.youtube.com/watch?v=8aGhZQkoFbQ).

### How Zones Relate to Change Detection
How does all of this relate to Angular and change detection? Tracking objects with synchronous code is fairly easy. However, when it comes to asynchronous code, things get complicated. That's because Angular 1 forced us to use `$scope.$apply(...)` each time an asynchronous action was made or use the Angular way of doing asynchronous actions: `$timeout`, `$http`, and so on. The thing is, if something was made outside of the controller (even a perfectly valid change to the reference object), Angular didn't know about it, so it didn't fire any event to reflect changes to the UI.

On the other hand, we now have Angular 2. It dropped all of the stuff connected to digest cycles and now uses *Zones*. Zones are able to track the context of asynchronous actions by monkey-patching them (i.e., overwriting them with its own code), which then invokes the desired action but with some additional information attached. This additional information is the context. This way, Angular will know which component the asynchronous action was invoked from.

The big win of this approach is that we can use the browser APIs natively, and Angular will know what's going on without forcing us to manually tell it a change has occured. The drawback is that Zones overwrite asynchronous actions, which is kind of a hacky solution and may affect other (existing) code if we're not relying only on Angular in the app.

But exactly how is Angular notified of the change? Angular uses its own version of the Zone called `NgZone`, which relays finished asynchronous actions with the `onTurnDone` event. Angular change detection waits for the event to perform change detection and checks what needs to be updated in the UI. That's the core behavior.

## Make Use of Change Detection In Your App
Everything described above is going on under the hood. Equally important is how we can make use of it. Unlike Angular 1, Angular 2 gives us the possibility of controlling the change detection. However, the Angular team claims that even without any performance tweaking, it's 3 to 10 times faster than the previous one, and for most apps this will be fast enough. But it can be much faster. Let's look at an example.

<iframe src="https://embed.plnkr.co/HR7ssEuPaWwlVKJPzZtJ/" width="100%" height="800"></iframe>

Here's a very typical problem: rendering a list. There's one component containing a list of other components that have some input data. Generally, we have a container with data and a dumb component just for rendering a single list item. Nothing fancy here, just the getter and `ngOnChange`. What's being done here? `ngOnChange` reacts on every input change, and the getter adds additional logging each time `rowData` are fetched. Note that we're not using it anywhere outside of the template.

This means the getter is fired by Angular itself. And guess what happens? We have a single change on the input, but there are hundreds of getter logs over there.

Why is that?

Angular is notified about the change from some component and has to check how that affects the current state, so it checks all the values for the change. Actually, the team says it can make thousands of such checks in milliseconds, but it's still a waste of time and can even harm our big data-driven application.

### Immutability
The cool thing about the new change detection system is that now we can tune it. Let's take a break from Angular and consider following code:

```js
const users = [{
  name: 'John',
  age: 27
}, {
  name: 'Anna',
  age: 23
}]

users.push({
  name: 'Max',
  age: 30
})
```

The most important thing here is the `const` declaration. If `users` is constant, how can we modify it? Well, that's how JavaScript works! The `const` prevents us from modifying a reference to the particular object in JavaScript. What the `push` method of `Array` is really doing is appending another object to the existing array (with no reference change). Let's go on to another very typical example:

```js
const user = {
  name: 'Max',
  age: 30
}

user.age = 31
```

The same thing applies. Although we can't modify the whole object to make it be another one (reference change), we still can change part of the object!

This is why the checks we discussed before aren't so good. If you want to check whether the object is the same as it was before, you have to *deeply check all of its properties*. It's not efficient.

How can we force the object to be a new one with the changed property? It's actually quite easy with the new [ECMAScript Object spread properties proposal](https://github.com/sebmarkbage/ecmascript-rest-spread):

```js
const user = {
  name: 'Max',
  age: 30
}

const modifiedUser = { ...user, age: 31 }
```

### Change Detection Strategies
The good part about all this is that now we can say to Angular that *we know what we're doing*. To modify the change detection behavior, we can use the `ChangeDetectionStrategy` API, which has one very interesting value: `OnPush`. It makes a component with this strategy applied look at the values inside only when the reference on the input changes or some event has been fired from the component.

Let's add the `OnPush` strategy to our previous example:

```ts
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'row',
  template: `
    <pre>{{ rowData }}</pre>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RowComponent {
  ...
}
```

You can try it on Plunker and see the difference.

<iframe src="https://embed.plnkr.co/d9b07qginx7z9hGYyeME/" width="100%" height="800"></iframe>

 The huge improvement is that there's now only one getter call for one change! We didn't need anything more as our input data are strings that are being changed, so that reference on input changes. The reference for the rest of the components hasn't changed, so Angular doesn't even look at it.

### App Structure
How can we build a highly performing app? With Angular 2, it's actually quite easy. As in all of the component frameworks nowadays, you should have dumb and smart components. The dumb components, which are meant only for displaying data from the input or handling user events, are ideal volunteers for having the `OnPush` strategy. Smart components will sometimes require that you watch for more things than the input and the events, so be careful with setting the `OnPush` strategy there.

## Aside: Authenticate an Angular App and Node API with Auth0

We can protect our applications and APIs so that only authenticated users can access them. Let's explore how to do this with an Angular application and a Node API using [Auth0](https://auth0.com). You can clone this sample app and API from the [angular-auth0-aside repo on GitHub](https://github.com/auth0-blog/angular-auth0-aside).

![Auth0 hosted login screen](https://cdn2.auth0.com/blog/angular-aside/angular-aside-login.jpg)

### Features

The [sample Angular application and API](https://github.com/auth0-blog/angular-auth0-aside) has the following features:

* Angular application generated with [Angular CLI](https://github.com/angular/angular-cli) and served at [http://localhost:4200](http://localhost:4200)
* Authentication with [auth0.js](https://auth0.com/docs/libraries/auth0js/v8) using a hosted [Lock](https://auth0.com/lock) instance
* Node server protected API route `http://localhost:3001/api/dragons` returns JSON data for authenticated `GET` requests
* Angular app fetches data from API once user is authenticated with Auth0
* Profile page requires authentication for access using route guards
* Authentication service uses a subject to propagate authentication status events to the entire app
* User profile is fetched on authentication and stored in authentication service
* Access token, ID token, and profile are stored in local storage and removed upon logout
* Authenticated API requests are made with the [angular2-jwt](https://github.com/auth0/angular2-jwt) helper library

### Sign Up for Auth0

You'll need an [Auth0](https://auth0.com) account to manage authentication. You can sign up for a [free account here](javascript:signup\(\)). Next, set up an Auth0 client app and API so Auth0 can interface with an Angular app and Node API.

### Set Up a Client App

1. Go to your [**Auth0 Dashboard**](https://manage.auth0.com/#/) and click the "[create a new client](https://manage.auth0.com/#/clients/create)" button. 
2. Name your new app and select "Single Page Web Applications". 
3. In the **Settings** for your new Auth0 client app, add `http://localhost:4200/callback` to the **Allowed Callback URLs** and `http://localhost:4200` to the **Allowed Origins (CORS)**.
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

Once you've cloned [the project](https://github.com/auth0-blog/angular-auth0-aside), install the Node dependencies for both the Angular app and the Node server by running the following commands in the root of your project folder:

```bash
$ npm install
$ cd server
$ npm install
```

The Node API is located in the [`/server` folder](https://github.com/auth0-blog/angular-auth0-aside/tree/master/server) at the root of our sample application.

Open the [`server.js` file](https://github.com/auth0-blog/angular-auth0-aside/blob/master/server/server.js):

```js
// server/server.js
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
//--- GET protected dragons route
app.get('/api/dragons', jwtCheck, function (req, res) {
  res.json(dragonsJson);
});
...
```

Change the `CLIENT_DOMAIN` variable to your Auth0 client domain. The `/api/dragons` route will be protected with [express-jwt](https://github.com/auth0/express-jwt) and [jwks-rsa](https://github.com/auth0/node-jwks-rsa).

> **Note:** To learn more about RS256 and JSON Web Key Set, read [Navigating RS256 and JWKS](https://auth0.com/blog/navigating-rs256-and-jwks/).

Our API is now protected, so let's make sure that our Angular application can also interface with Auth0. To do this, we'll activate the [`src/app/auth/auth0-variables.ts.example` file](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/auth/auth0-variables.ts.example) by deleting the `.example` from the file extension. Then open the file and change the `[CLIENT_ID]` and `[CLIENT_DOMAIN]` strings to your Auth0 information:

```js
// src/app/auth/auth0-variables.ts
...
export const AUTH_CONFIG: AuthConfig = {
  CLIENT_ID: '[CLIENT_ID]',
  CLIENT_DOMAIN: '[CLIENT_DOMAIN].auth0.com',
  ...
```

Our app and API are now set up. They can be served by running `$ ng serve` from the root folder and `$ node server.js` from the `/server` folder.

With the Node API and Angular app running, let's take a look at how authentication is implemented.

### Authentication Service

Authentication logic on the front end is handled with an `AuthService` authentication service: [`src/app/auth/auth.service.ts` file](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/auth/auth.service.ts). 

```js
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AUTH_CONFIG } from './auth0-variables';
import { tokenNotExpired } from 'angular2-jwt';
import { UserProfile } from './profile.model';

// Avoid name not found warnings
declare var auth0: any;

@Injectable()
export class AuthService {
  // Create Auth0 web auth instance
  // @TODO: Update AUTH_CONFIG and remove .example extension in src/app/auth/auth0-variables.ts.example
  auth0 = new auth0.WebAuth({
    clientID: AUTH_CONFIG.CLIENT_ID,
    domain: AUTH_CONFIG.CLIENT_DOMAIN
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

> **Note:** If it's the user's first visit to our app _and_ our callback is on `localhost`, they'll also be presented with a consent screen where they can grant access to our API. First party clients on non-localhost domains will not be presented with the consent dialog.

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

Finally, we have a `logout()` method that clears data from local storage and updates the `loggedIn$` subject and an `authenticated()` accessor to return current authentication status.

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

### Final Touches: Route Guard and Profile Page

A [profile page component](https://github.com/auth0-blog/angular-auth0-aside/tree/master/src/app/profile) can show an authenticated user's profile information. However, we only want this component to be accessible if the user is logged in.

With an [authenticated API request and login/logout](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/home/home.component.ts) implemented, the final touch is to protect our profile route from unauthorized access. The [`auth.guard.ts` route guard](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/auth/auth.guard.ts) can check authentication and activate routes conditionally. The guard is implemented on specific routes of our choosing in the [`app-routing.module.ts` file](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/app-routing.module.ts) like so:

```js
// src/app/app-routing.module.ts
...
import { AuthGuard } from './auth/auth.guard';
...
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [
          AuthGuard
        ]
      },
...
```

### More Resources

That's it! We have an authenticated Node API and Angular application with login, logout, profile information, and protected routes. To learn more, check out the following resources:

* [Why You Should Always Use Access Tokens to Secure an API](https://auth0.com/blog/why-should-use-accesstokens-to-secure-an-api/)
* [Navigating RS256 and JWKS](https://auth0.com/blog/navigating-rs256-and-jwks/)
* [Access Token](https://auth0.com/docs/tokens/access-token)
* [Verify Access Tokens](https://auth0.com/docs/api-auth/tutorials/verify-access-token)
* [Call APIs from Client-side Web Apps](https://auth0.com/docs/api-auth/grant/implicit)
* [How to implement the Implicit Grant](https://auth0.com/docs/api-auth/tutorials/implicit-grant)
* [Auth0.js v8 Documentation](https://auth0.com/docs/libraries/auth0js/v8)
* [OpenID Standard Claims](https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims)

## Conclusions

### Performance Advantages
One of the big advantages of using stricter change detection is the performance gains. Angular is meant to be used for large applications that can handle lots of dynamic data. The Angular team has given the developer the tools necessary to fine-tune and improve performance from the get-go. By default, every change should be reflected on the UI, as Angular takes care of that, but the price is lower performance. Immutable or reactive code is harder to write but easier to maintain and reason out. The choice is yours.

### Eventually Angular can be tweaked
The good thing is that we have a choice with Angular 2. In Angular 1, it was impossible to get away from the digest cycle. At a certain point, it was advantageous to use React or another library to render UI instead of Angular templates, as it was too slow when handling a large amount of dynamic data. Now, you have a complete solution with much more control over the internal behavior. This, in combination with the other changes made to Angular 2, makes the learning curve of the framework steeper but worth it.
