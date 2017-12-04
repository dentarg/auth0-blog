---
layout: post
title: "Real-World Angular Series - Part 2: Authentication and Data Modeling"
description: "Build and deploy a real-world app with MongoDB, Express, Angular, and Node (MEAN): authentication, authorization, and data modeling."
date: 2017-06-29 8:30
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
- 2017-06-28-real-world-angular-series-part-1
- 2017-01-19-building-and-securing-a-koa-and-angular2-app-with-jwt
- 2016-11-07-migrating-an-angular-1-app-to-angular-2-part-1

---

**TL;DR:** This 8-part tutorial series covers building and deploying a full-stack JavaScript application from the ground up with hosted [MongoDB](https://www.mongodb.com/), [Express](https://expressjs.com/), [Angular (v2+)](https://angular.io), and [Node.js](https://nodejs.org) (MEAN stack). The completed code is available in the [mean-rsvp-auth0 GitHub repo](https://github.com/auth0-blog/mean-rsvp-auth0/) and a deployed sample app is available at [https://rsvp.kmaida.net](https://rsvp.kmaida.net).  **Part 2 of the tutorial series covers authentication, authorization, and data modeling.**

---

## Real-World Angular Series

You can view all sections of the tutorial series here:

1. [Real-World Angular Series - Part 1: MEAN Setup & Angular Architecture](https://auth0.com/blog/real-world-angular-series-part-1)
2. [Real-World Angular Series - Part 2: Authentication and Data Modeling](https://auth0.com/blog/real-world-angular-series-part-2) (you are here!)
3. [Real-World Angular Series - Part 3: Fetching and Displaying API Data](https://auth0.com/blog/real-world-angular-series-part-3)
4. [Real-World Angular Series - Part 4: Access Management, Admin, and Detail Pages](https://auth0.com/blog/real-world-angular-series-part-4)
5. [Real-World Angular Series - Part 5: Animation and Template-Driven Forms](https://auth0.com/blog/real-world-angular-series-part-5)
6. [Real-World Angular Series - Part 6: Reactive Forms and Custom Validation](https://auth0.com/blog/real-world-angular-series-part-6)
7. [Real-World Angular Series - Part 7: Relational Data and Token Renewal](https://auth0.com/blog/real-world-angular-series-part-7)
8. [Real-World Angular Series - Part 8: Lazy Loading, Production Deployment, SSL](https://auth0.com/blog/real-world-angular-series-part-8)

---

## Part 2: Authentication and Data Modeling

The [first part of this tutorial](https://auth0.com/blog/real-world-angular-series-part-1) covered how to set up the cloud-hosted MongoDB database, Node server, and front end for our real-world Angular application.

The second installment in the series covers authentication, authorization, feature planning, and data modeling.

1. <a href="#angular-auth" target="_self">Angular: Authentication</a>
2. <a href="#admin-authorization" target="_self">Admin Authorization</a>
3. <a href="#features" target="_self">Planning App Features</a>
4. <a href="#data-modeling" target="_self">Data Modeling</a>

---

## <span id="angular-auth"></span>Angular: Authentication

Let's pick up right where we left off [last time](https://auth0.com/blog/real-world-angular-series-part-1). We've built the main layout for our app. Now it's time to add an authentication feature. Our app's basic authentication should include:

* Login and logout
* User profile storage
* Access token storage
* Session persistence
* Factory to authorize HTTP requests with access token

### Install Auth0.js

First let's install a new dependency. We need the [auth0-js](https://www.npmjs.com/package/auth0-js) package to interface with our [Auth0 account](https://auth0.com/blog/real-world-angular-series-part-1#auth0-setup). Install this package with npm from the project root:

```bash
$ npm install auth0-js --save
```

### Environment Configuration

Let's create a file to store information about our app's environment. We're currently developing on `localhost:4200`, but the app will be deployed on the Node server eventually, and in production, it will run on a [reverse proxy](https://en.wikipedia.org/wiki/Reverse_proxy). We'll need to make sure our development environment doesn't break our production environment and vice versa.

Create a folder: `src/app/core`, then add a file there called `env.config.ts`:

```typescript
// src/app/core/env.config.ts
const _isDev = window.location.port.indexOf('4200') > -1;
const getHost = () => {
  const protocol = window.location.protocol;
  const host = window.location.host;
  return `${protocol}//${host}`;
};
const apiURI = _isDev ? 'http://localhost:8083/api/' : `/api/`;

export const ENV = {
  BASE_URI: getHost(),
  BASE_API: apiURI
};
```

This code detects the host environment and sets the app's base URI and base API URI. We'll import this `ENV` configuration wherever we need to detect and use these URIs.

### Authentication Configuration

We'll store our Auth0 authentication configuration in an `auth.config.ts` file. Create the following blank file: `src/app/auth/auth.config.ts`.

Open this file and customize the following code with your own [Auth0 client](https://manage.auth0.com/#/clients) and [API](https://manage.auth0.com/#/apis) information:

```typescript
// src/app/auth/auth.config.ts
import { ENV } from './../core/env.config';

interface AuthConfig {
  CLIENT_ID: string;
  CLIENT_DOMAIN: string;
  AUDIENCE: string;
  REDIRECT: string;
  SCOPE: string;
};

export const AUTH_CONFIG: AuthConfig = {
  CLIENT_ID: '[AUTH0_CLIENT_ID]',
  CLIENT_DOMAIN: '[AUTH0_CLIENT_DOMAIN]',
  AUDIENCE: '[YOUR_AUTH0_API_AUDIENCE]', // likely http://localhost:8083/api/
  REDIRECT: `${ENV.BASE_URI}/callback`,
  SCOPE: 'openid profile'
};
```

### Authentication Service

Authentication logic on the front end will be handled with an `AuthService` authentication service. Let's generate the boilerplate for a new service with the CLI:

```bash
$ ng g service auth/auth
```

Now open the generated `auth.service.ts` file and add the necessary code to our authentication service:

```typescript
// src/app/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AUTH_CONFIG } from './auth.config';
import * as auth0 from 'auth0-js';

@Injectable()
export class AuthService {
  // Create Auth0 web auth instance
  private _auth0 = new auth0.WebAuth({
    clientID: AUTH_CONFIG.CLIENT_ID,
    domain: AUTH_CONFIG.CLIENT_DOMAIN,
    responseType: 'token id_token',
    redirectUri: AUTH_CONFIG.REDIRECT,
    audience: AUTH_CONFIG.AUDIENCE,
    scope: AUTH_CONFIG.SCOPE
  });
  userProfile: any;
  // Create a stream of logged in status to communicate throughout app
  loggedIn: boolean;
  loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);

  constructor(private router: Router) {
    // If authenticated, set local profile property
    // and update login status subject.
    // If not authenticated but there are still items
    // in localStorage, log out.
    const lsProfile = localStorage.getItem('profile');

    if (this.tokenValid) {
      this.userProfile = JSON.parse(lsProfile);
      this.setLoggedIn(true);
    } else if (!this.tokenValid && lsProfile) {
      this.logout();
    }
  }

  setLoggedIn(value: boolean) {
    // Update login status subject
    this.loggedIn$.next(value);
    this.loggedIn = value;
  }

  login() {
    // Auth0 authorize request
    this._auth0.authorize();
  }

  handleAuth() {
    // When Auth0 hash parsed, get profile
    this._auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this._getProfile(authResult);
      } else if (err) {
        console.error(`Error authenticating: ${err.error}`);
      }
      this.router.navigate(['/']);
    });
  }

  private _getProfile(authResult) {
    // Use access token to retrieve user's profile and set session
    this._auth0.client.userInfo(authResult.accessToken, (err, profile) => {
      if (profile) {
        this._setSession(authResult, profile);
      } else if (err) {
        console.error(`Error authenticating: ${err.error}`);
      }
    });
  }

  private _setSession(authResult, profile) {
    // Save session data and update login status subject
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + Date.now());
    // Set tokens and expiration in localStorage and props
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    localStorage.setItem('profile', JSON.stringify(profile));
    this.userProfile = profile;
    // Update login status in loggedIn$ stream
    this.setLoggedIn(true);
  }

  logout() {
    // Ensure all auth items removed from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('authRedirect');
    // Reset local properties, update loggedIn$ stream
    this.userProfile = undefined;
    this.setLoggedIn(false);
    // Return to homepage
    this.router.navigate(['/']);
  }

  get tokenValid(): boolean {
    // Check if current time is past access token's expiration
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return Date.now() < expiresAt;
  }

}
```

This service uses the config variables from `auth.config.ts` to instantiate an [auth0.js](https://github.com/auth0/auth0.js) `WebAuth` instance.

An [RxJS `BehaviorSubject`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/subjects/behaviorsubject.md) is used to provide a stream of authentication status events that we can subscribe to anywhere in the app.

The constructor checks the current authentication status upon app initialization. If the user is still logged in from a previous session and their token has not expired, the local properties are set using data from local storage and the `loggedIn` property and `loggedIn$` subject are updated. If the token is expired but the user has not logged themselves out, the `logout()` method is executed to clear any expired session data.

The `login()` method authorizes the authentication request with Auth0 using the auth config variables. An Auth0 hosted Lock instance will be shown to the user and they can then log in.

> **Note:** If it's the user's first visit to our app _and_ our callback is on localhost, they'll also be presented with a consent screen where they can grant access to our API. A first party client on a non-localhost domain would be highly trusted, so the consent dialog would not be presented in this case. You can modify this by editing your [Auth0 Dashboard API](https://manage.auth0.com/#/apis) **Settings**. Look for the "Allow Skipping User Consent" toggle.

We'll receive an `id_token`, an `access_token`, and a time until token expiration (`expiresIn`) from Auth0 when returning to our app. The `handleAuth()` method uses Auth0's `parseHash()` method callback to get the user's profile (`_getProfile()`) and set the session (`_setSession()`) by saving the tokens, expiration, and profile to local storage and calling `setLoggedIn()` so that any components in the app are informed that the user is now authenticated.

Finally, we'll define a `logout()` method that clears data from local storage and updates `setLoggedIn()`. We also have a `tokenValid()` accessor to check whether the current datetime is less than the token expiration datetime.

### Provide AuthService in App Module

In order to use the `AuthService` methods and properties anywhere in our app, we need to add the service to the `providers` array in our `app.module.ts`:

```typescript
// src/app/app.module.ts
...
import { AuthService } from './auth/auth.service';
...
@NgModule({
  ...
  providers: [
    ...,
    AuthService
  ],
  ...
})
...
```

### Handle Authentication in App Component

The authentication service's `handleAuth()` method must be called in the `app.component.ts` constructor so it will run on initialization of our app:

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

### Create a Callback Component

Next we'll create a Callback component. This is where the app is redirected after authentication. This component simply shows a loading message until hash parsing is completed and the Angular app redirects back to the home page.

> **Note:** Recall that we already added `http://localhost:4200/callback` and `http://localhost:8083/callback` to our [Auth0 Client](https://manage.auth0.com/#/clients) **Allowed Callback URLs** setting.

Let's generate this component with the Angular CLI:

```bash
$ ng g component pages/callback
```

For now, all we need to do in this component is change the text in `callback.component.html` to `Loading...`, like so:

{% highlight html %}
<!-- src/app/pages/callback/callback.component.html -->
<div>
  Loading...
</div>
{% endhighlight %}

We'll spruce this up later with a nice loading icon. For now, let's add the component to our routing module, `app-routing.module.ts`:

```typescript
// src/app/app-routing.module.ts
...
import { CallbackComponent } from './pages/callback/callback.component';

const routes: Routes = [
  ...
  {
    path: 'callback',
    component: CallbackComponent
  }
];
...
```

### Add Login and Logout to Header Component

Now we have the logic necessary to authenticate users, but we still need a way for them to log in and out in the UI. Let's add this in the Header component.

Open up the `header.component.ts` file:

```typescript
// src/app/header/header.component.ts
...
import { AuthService } from './../auth/auth.service';
...
export class HeaderComponent implements OnInit {
  ...
  constructor(
    ...,
    public auth: AuthService) { }
  ...
}
```

We'll import our `AuthService` and declare it in the constructor function.

> **Note:** We're using `public` because the authentication service's methods will be used in the template, not just in the class.

Now let's add login, logout, and a user greeting to the `header.component.html` template:

{% highlight html %}
{% raw %}
<!-- src/app/header/header.component.html -->
<header id="header" class="header">
  <div class="header-page bg-primary">
    ...
    <div class="header-page-authStatus">
      <a *ngIf="!auth.loggedIn" (click)="auth.login()">Log In</a>
      <span *ngIf="auth.loggedIn">
        {{auth.userProfile?.name}} <span class="opacity-half">|</span> <a (click)="auth.logout()">Log Out</a>
      </span>
    </div>
  </div>
  ...
{% endraw %}
{% endhighlight %}

We've added a `<div class="header-page-authStatus>` element. We'll use the [ngIf directive](https://angular.io/api/common/NgIf) with the `loggedIn` property from our authentication service to determine if the user is logged in to show or hide the appropriate markup. If the user is not logged in, we'll show a "Log In" link. If they're already authenticated, we'll show their name and a link to log out.

> **Note:** Notice the `auth.userProfile?.name` binding. The `?.` is the [safe navigation operator](https://angular.io/guide/template-syntax#the-safe-navigation-operator----and-null-property-paths). This operator protects against `null` and `undefined` values in property paths. If the object is not yet defined, the safe navigation operator prevents an error from occurring and waits to render until the data is available.

Now let's add a little bit of CSS to style our new authentication status elements. Open the `header.component.scss` file:

```scss
/* src/app/header/header.component.scss */
...
.header-page {
  ...
  &-authStatus {
    color: #fff;
    font-size: 12px;
    line-height: 50px;
    padding: 0 10px;
    position: absolute;
      right: 0; top: 0;

    a:hover {
      text-decoration: underline;
    }
  }
}
```

We can now log into our app! Try it out in the browser.

![Auth0 hosted login screen](https://cdn2.auth0.com/blog/angular-aside/angular-aside-login.jpg)

Once logged in, you should see your name and a link to log out in the upper right corner of the header.

![Auth0 logged into Angular app](https://cdn.auth0.com/blog/mean-series/logged-in.jpg)

You should also be able to close the browser and reopen it to find your session has persisted (unless enough time has passed for the token to expire).

## <span id="admin-authorization"></span>Admin Authorization

For our RSVP app, only users with `admin` privileges should be able to create, edit, and delete events. All other users will only be able to RSVP to these events. In order to implement this, we'll need to assign and then utilize user roles in both our Node.js API and our Angular app.

First, let's take a look at the steps involved:

1. Use [Auth0 Rules](https://auth0.com/docs/rules) to establish user roles and then add them to the ID (client) and access (API) tokens.
2. Implement middleware in our Node.js API to ensure only `admin` users can access certain API routes.
3. Use the role information in the Angular app to restrict access to certain routes and features.

Let's get started!

### Use an Auth0 Rule for Admin Authorization

[**Rules**](https://auth0.com/docs/rules) are JavaScript functions that Auth0 executes each time a user authenticates. They provide an easy way to extend authentication functionality.

The first step is to log into your Auth0 dashboard and [create a new Rule](https://manage.auth0.com/#/rules/new). Select the "Set roles to a user" rule template:

![create new Auth0 rule](https://cdn.auth0.com/blog/mean-series/rule-new.jpg)

This opens up a JavaScript template. We only want to assign an `admin` role to our _own_ account at this time. It'd be a good idea to change the name of this rule so we can see at a glance what it does. I changed the name of the rule to `Set admin role for me`. We can easily modify `line 6` of the template where it checks the user's email for `indexOf()` a specific email domain.

I'll change this to my full Google email address because that is the OAuth account that I want to assign the `admin` role to. I'm also using social connections with Facebook and Twitter, and it's important to keep in mind that some connections don't return an `email` field. Therefore, I need to modify the rule so that it checks that `user.email` exists before using a comparison. I'll modify the `addRolesToUser()` function to the following:

```js
if (user.email && user.email === '[MY_FULL_GOOGLE_ACCOUNT_EMAIL]') {
  ...
```

Replace `[MY_FULL_GOOGLE_ACCOUNT_EMAIL]` with your own credentials. We're replacing `indexOf()` with a strict equality expression `===` because we want to match a full email address rather than just a domain as in the example rule template.

> **Note:** If you want to use a non-Google account, make sure you identify the account by an appropriate property. Not all properties are returned by all connection types. You can also be more explicit regarding the details of the account if you want _all_ accounts with that email to be set as administrators, or if you want only a Google account versus a username/password account to match the check. You can check your [Auth0 Users](https://manage.auth0.com/#/users) or test your [Auth0 Social Connections](https://manage.auth0.com/#/connections/social) to see what kind of data is returned and stored from logins from different identity providers.

When finished, click the "Save" button at the bottom of the page.

### Create an Auth0 Rule to Add Claims to Tokens

Now we'll create a second rule that will add this metadata from the Auth0 database to the ID token that is returned to the Angular app upon successful authentication, as well as the access token that is sent to the API to authorize endpoints.

[Create another new Rule](https://manage.auth0.com/#/rules/new) in your Auth0 dashboard. This time, we won't be using an existing template, so click the "empty rule" button:

![create new empty Auth0 rule](https://cdn.auth0.com/blog/mean-series/rule-empty.jpg)

We added `app_metadata` with a `roles` array to our users in the previous rule, but since this isn't part of the [OpenID standard claims](http://openid.net/specs/openid-connect-core-1_0.html#StandardClaims), we need to add [_custom_ claims](https://auth0.com/docs/scopes/preview#example-add-custom-claims) in order to include roles data in the ID and access tokens.

In the JavaScript template, enter a name for this rule, such as `Add user role to tokens`. Then add the following code:

```js
function (user, context, callback) {
  var namespace = 'http://myapp.com/roles';
  var userRoles = user.app_metadata.roles;
  context.idToken[namespace] = userRoles;
  context.accessToken[namespace] = userRoles;
  callback(null, user, context);
}
```

The `namespace` identifier can be any non-Auth0 HTTP or HTTPS URL and does not have to point to an actual resource. Auth0 enforces this [recommendation from OIDC regarding additional claims](https://openid.net/specs/openid-connect-core-1_0.html#AdditionalClaims) and will silently exclude any claims that do not have a namespace. You can read more about [implementing custom claims with Auth0 here](https://auth0.com/docs/scopes/preview#example-add-custom-claims).

The key for our custom claim will be `http://myapp.com/roles`. This is how we'll retrieve the `roles` array from the ID and access tokens in our Angular app and Node API. Our rule assigns the Auth0 user's `app_metadata.roles` to this property.

When finished, click the "Save" button to save this rule.

### Sign In with Admin Account

The next thing we need to do is _sign in_ with our intended admin user. This will trigger the rules to execute and the app metadata will be added to our targeted account. Then the roles data will also be available in the tokens whenever the user logs in.

Since we've implemented login in our Angular app already, all we need to do is sign in with the account we specified in our `Set admin role for me` rule. Visit your Angular app in the browser at [http://localhost:4200](http://localhost:4200) and click the "Log In" link we added in the header.

> **Note:** Recall that I used a Google account when setting up the `Set admin role for me` rule, so I'll log in using Google OAuth. (I enabled Google OAuth in [Auth0 Dashboard Social Connections](https://manage.auth0.com/#/connections/social) back in <a href="https://auth0.com/blog/real-world-angular-series-part-1#auth0-setup">Auth0 Account and Setup</a> in Part 1 of the tutorial series.)

Once you've logged in, you can check to verify that the appropriate role was added to your user account in the [Auth0 Dashboard Users section](https://manage.auth0.com/#/users). Find the user you just logged in with and click the name to view details. This user's **Metadata** section should now look like this:

![Admin user metadata](https://cdn.auth0.com/blog/mean-series/user-metadata.png)

### Admin Middleware in Node API

Now that we have role support with our authentication, we can use this to protect API routes that require administrator access.

Open the server `config.js` file and add a `NAMESPACE` property with the namespace we used when creating our `Add user role to tokens` rule:

```js
// server/config.js
module.exports = {
  ...,
  NAMESPACE: 'http://myapp.com/roles'
};
```

We can now implement middleware that will verify that a user is authenticated _and_ has admin privileges to access API endpoints.

Make the following additions to the server `api.js` file:

```js
// server/api.js
...
module.exports = function(app, config) {
  // Authentication middleware
  const jwtCheck = jwt({
    ...
  });

  // Check for an authenticated admin user
  const adminCheck = (req, res, next) => {
    const roles = req.user[config.NAMESPACE] || [];
    if (roles.indexOf('admin') > -1) {
      next();
    } else {
      res.status(401).send({message: 'Not authorized for admin access'});
    }
  }

...
```

Our `Add user role to tokens` rule added the following key/value pair to our ID and access tokens:

```js
"http://myapp.com/roles": ["admin"]
```

The [express-jwt](https://github.com/auth0/express-jwt) package adds the decoded token to `req.user` by default. The `adminCheck` middleware finds this property and looks for a value of `admin` in the array. If found, the request proceeds. If not, a `401 Unauthorized` status is returned with a short error message.

Now our API is set up to handle `admin` roles.

### Admin Authorization in Angular App

We also want the front end to know if the user is an `admin` or not, so let's update our `AuthService` to get and store this information.

First, we need to store the namespace in our `AUTH_CONFIG`. Open the `auth.config.ts` file and add a `NAMESPACE` key:

```typescript
// src/app/auth/auth.config.ts
...
interface AuthConfig {
  ...,
  NAMESPACE: string;
};

export const AUTH_CONFIG: AuthConfig = {
  ...,
  NAMESPACE: 'http://myapp.com/roles'
};
```

Now that we have the namespace stored, let's add support for storing admin status in the `auth.service.ts` file:

```typescript
// src/app/auth/auth.service.ts
...
export class AuthService {
  ...
  isAdmin: boolean;
  ...
  constructor(private router: Router) {
    // If authenticated, set local profile property,
    // admin status, and update login status subject.
    // If token is expired but user data still in localStorage, log out
    if (this.tokenValid) {
      this.userProfile = JSON.parse(localStorage.getItem('profile'));
      this.isAdmin = localStorage.getItem('isAdmin') === 'true';
      this.setLoggedIn(true);
    }
  }

  ...

  private _setSession(authResult, profile) {
    // Save session data and update login status subject
    ...
    this.isAdmin = this._checkAdmin(profile);
    localStorage.setItem('isAdmin', this.isAdmin.toString());
    this.setLoggedIn(true);
  }

  private _checkAdmin(profile) {
    // Check if the user has admin role
    const roles = profile[AUTH_CONFIG.NAMESPACE] || [];
    return roles.indexOf('admin') > -1;
  }

  logout() {
    // Ensure all auth items removed from localStorage
    ...
    localStorage.removeItem('isAdmin');
    // Reset local properties, update loggedIn$ stream
    this.userProfile = undefined;
    this.isAdmin = undefined;
    this.setLoggedIn(false);
  }

  ...
```

First we'll add a new property called `isAdmin: boolean`. This will store the user's admin status so we can use it in the front end.

In the constructor, if the user is authenticated, we'll look for an `isAdmin` key in local storage. Local storage stores values as strings, so we'll _cast_ it as a boolean.

Next we'll update the `_setSession()` function. After setting the local `userProfile` property, we'll use a private `_checkAdmin()` method to determine whether the user has `admin` in their roles.

> **Note:** We have to cast `isAdmin` to a string because its type is `boolean`, but local storage expects strings.

Finally, we'll remove `isAdmin` data from local storage and the service in the `logout()` method.

We now have the ability to check whether or not a user has admin privileges on the client side.

> **Security Note:** This should never be done on the client-side _alone_. Always ensure that API routes are protected as well, as we've done in the API middleware section above.

We now have admin authorization set up on both our API and in our Angular app. We'll do a lot more with this as we develop our application!

---

## <span id="features"></span>Planning App Features

We have our database, Angular app, authentication, and secured Node API structurally ready for further development. Now it's time to do some feature planning and data modeling. It's vitally important to plan an application's data structure before diving straight into writing endpoints and business logic.

{% include tweet_quote.html quote_text="It's vital to plan data structure before writing endpoints and business logic." %}

Let's consider our RSVP app's intended features at a high level, then we'll extrapolate what our database schema models should look like in order to bring these features to life.

### Events

* Main listing of public events available on homepage with search feature; this should only show future events
* Full listing of all events (public, private, future, past) available for admins
* Detail view of event allows authenticated users to RSVP and to view who else has RSVPed
* Events can only be created, edited, and deleted by admins
* Deleting an event should also delete all RSVPs for that event
* Events can be listed publicly on the homepage, or excluded from the listing and accessed directly with a link
* Event RSVPs should be retrieved by event ID

#### Event Fields

* Event ID (automatically generated by MongoDB, also serves as direct link)
* Title of event
* Location
* Start date and time
* End date and time
* Description
* Public listing vs. requires a link to view

### RSVPs

* Any authenticated user can RSVP for an event that is in the future, either via direct link or from the homepage listing
* Users cannot add or edit an RSVP for an event that has ended
* Users can update their own existing RSVP responses, but not delete them (RSVPs are deleted if the associated event is deleted)

#### RSVP Fields

* RSVP ID (automatically generated by MongoDB)
* User ID
* Name
* Event ID
* Attending / Not attending
* Number of additional (+1) guests (only applicable if attending)
* Comments

### Users

* Users should be able to view a list of all their own RSVPs in their profile
* User data handled through Auth0 authentication and profile retrieval; users aren't stored in MongoDB
* Users are associated with their RSVPs by user ID
* In order to edit an RSVP, the user's ID must be verified with the user ID in the RSVP
* Admin users can perform CRUD operations on events

---

## <span id="data-modeling"></span>Data Modeling

We now have an idea about what features our events and RSVPs need to support. Let's create both the server and client-side models necessary to support our application.

### Create Schema

First we'll create the necessary schema to leverage our database. Create a new folder in the `server` directory called `models`. In this folder, add a file called `Event.js` and a file called `Rsvp.js`. These will contain our Event and Rsvp models. We're using [mongoose](http://mongoosejs.com/index.html) for MongoDB object modeling. Each [mongoose schema](http://mongoosejs.com/docs/guide.html) maps to a MongoDB collection and defines the shape of the documents within that collection.

We'll start with `Event.js`. Open this file and add the following event schema:

```js
// server/models/Event.js
/*
 |--------------------------------------
 | Event Model
 |--------------------------------------
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  startDatetime: { type: Date, required: true },
  endDatetime: { type: Date, required: true },
  description: String,
  viewPublic: { type: Boolean, required: true }
});

module.exports = mongoose.model('Event', eventSchema);
```

This schema maps to our outlined <a href="#features" target="_self">features</a> for events.

> **Note:** We don't need to create an ID field because MongoDB object IDs will be generated automatically.

Now let's write the Rsvp schema in the `Rsvp.js` file:

```js
// server/models/Rsvp.js
/*
 |--------------------------------------
 | Rsvp Model
 |--------------------------------------
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rsvpSchema = new Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  eventId: { type: String, required: true },
  attending: { type: Boolean, required: true },
  guests: Number,
  comments: String
});

module.exports = mongoose.model('Rsvp', rsvpSchema);
```

Now we need to require our models in the API. Open the server `api.js` file and add the following:

```js
// server/api.js
/*
 |--------------------------------------
 | Dependencies
 |--------------------------------------
 */
...
const Event = require('./models/Event');
const Rsvp = require('./models/Rsvp');
...
```

We'll use these models to retrieve data from MongoDB in our endpoints, but first let's model the data on the front end as well.

### Add Models to Angular App

We'll also add event and RSVP models in the front end to define the shape of the data we expect to retrieve when making API calls. Create two new class files with the CLI:

```bash
$ ng g class core/models/event.model
$ ng g class core/models/rsvp.model
```

Let's add the event model code in `event.model.ts`:

```typescript
// src/app/core/models/event.model.ts
export class EventModel {
  constructor(
    public title: string,
    public location: string,
    public startDatetime: Date,
    public endDatetime: Date,
    public viewPublic: boolean,
    public description?: string,
    public _id?: string,
  ) { }
}
```

We're naming the models `EventModel` (and `RsvpModel`) to avoid conflicts with existing `Event` constructors if your editor or IDE uses [intelligent code completion](https://en.wikipedia.org/wiki/Intelligent_code_completion). Optional members must be listed after required members. The `_id` property is optional because it only exists if retrieving data from the database, but not if we're creating _new_ records.

Now add the RSVP model in `rsvp.model.ts`:

```typescript
// src/app/core/models/rsvp.model.ts
export class RsvpModel {
  constructor(
    public userId: string,
    public name: string,
    public eventId: string,
    public attending: boolean,
    public guests?: number,
    public comments?: string,
    public _id?: string
  ) { }
}
```

### Create and Seed Collections in MongoDB

In order to query the database, we first need to create the necessary collections and provide a little bit of seed data. There are a couple of ways we could do this: either through [mLab](https://mlab.com/), or in MongoBooster (with the Mongo shell), which we set up earlier. Let's use MongoBooster because this method can be used with _any_ MongoDB database, not just mLab.

#### Create Collections

Open your MongoBooster app to the mLab connection we created during our <a href="https://auth0.com/blog/real-world-angular-series-part-1#mongodb-setup">MongoDB Setup</a>.

Once you've connected, right-click the database in the left sidebar and select "Create Collection...". When prompted, enter the collection name `events`. Click "Ok" and then create a second collection called `rsvps`. You should now have two empty collections listed in your database.

#### Add Event Seed Documents

Now we'll add some documents to the `events` collection for seed data. Right-click the collection name in the sidebar and select "Insert Documents...". The Mongo shell will open with `db.events.insert([{}])` prompting you to add data. Replace this with the following:

```js
db.events.insert([{
  "title": "Test Event Past",
  "location": "Home",
  "startDatetime": ISODate("2017-05-04T18:00:00.000-04:00"),
  "endDatetime": ISODate("2017-05-04T20:00:00.000-04:00"),
  "viewPublic": true
}, {
  "title": "MongoBooster Test",
  "location": "Seattle, WA",
  "startDatetime": ISODate("2017-08-12T20:00:00.000-04:00"),
  "endDatetime": ISODate("2017-08-13T10:00:00.000-04:00"),
  "viewPublic": true
}, {
  "title": "Bob's Private Event",
  "location": "Bob's House",
  "startDatetime": ISODate("2017-10-05T12:30:00.000-04:00"),
  "endDatetime": ISODate("2017-10-05T14:30:00.000-04:00"),
  "viewPublic": false
}])
```

> **Note:** Make sure you update the seed data dates so that most of them are in the future and at least one is in the past. You may need to make changes depending on the _current_ date versus the publication date of this tutorial. You'll also want at least one to have a `viewPublic` value of `false`.

When finished, click "Run" in the top bar. A console tab and a result tab should appear. You can then double-click on the `events` collection again to see your new documents listed. They should each have an `_id` property containing the automatically-generated [object ID](https://docs.mongodb.com/manual/reference/method/ObjectId/) and should look something like this:

<p align="center">
<img alt="MongoBooster MongoDB events collection with seed data" src="https://cdn.auth0.com/blog/mean-series/db-seed-event.png">
</p>

#### Add RSVP Seed Documents

Let's add a few documents to the `rsvps` collection as well. We'll assign the RSVPs to the seed events, so make sure you copy the object ID string (for the RSVP `eventId`) from a couple of event documents. You can do this by right-clicking an event document and selecting "View Document...". You can then copy the string from the `"_id" : ObjectId(string)` in the JSON Viewer.

We also need to assign RSVPs to user IDs. You can get specific user IDs by going to the [Auth0 Dashboard Users](https://manage.auth0.com/#/users) and copying the `user_id` from the **Identity Provider Attributes** of whichever accounts you'd like to associate RSVPs to. Then when you log into the app with any of those accounts, the seed data RSVPs will be associated with the authentication service's `userProfile.sub` property.

<p align="center">
<img alt="Get user ID from Auth0 Users" src="https://cdn.auth0.com/blog/mean-series/user_id.jpg">
</p>

Using this information, we can create some seed data for RSVPs. Let's add a couple of documents to the `rsvps` collection in our MongoDB database:

```js
db.rsvps.insert([{
  "userId": "<IDP>|<USER_ID>",
  "eventId": "<EVENT_OBJECT_ID_STRING>",
  "attending": true,
  "guests": 3,
  "comments": "Really looking forward to this!"
}, {
  "userId": "<IDP>|<USER_ID>",
  "eventId": "<EVENT_OBJECT_ID_STRING>",
  "attending": false,
  "comments": "Regretfully, I can't make it."
}, {
  "userId": "<IDP>|<USER_ID>",
  "eventId": "<EVENT_OBJECT_ID_STRING>",
  "attending": true,
  "guests": 2
}])
```

Replace the information in angle brackets `< >` with `user_id`s from Auth0 and event IDs from the data we entered previously. This will set up the appropriate relationships.

The database should then look something like this in MongoBooster:

<p align="center">
<img alt="MongoBooster seed data for RSVPs" src="https://cdn.auth0.com/blog/mean-series/db-seed-rsvp.png">
</p>

MongoBooster makes it simple to manipulate collections and documents as well as query the database with both the Mongo shell _and_ a GUI. It's a handy tool to have at your disposal for any MongoDB project, and particularly useful if you need to work with a database that is not hosted on your local machine.

We now have some seed documents to work with so we can get our API and Angular app up and running with data available right off the bat.

## Aside: Securing Applications with Auth0

Are you building a [B2C](https://auth0.com/b2c-customer-identity-management), [B2B](https://auth0.com/b2b-enterprise-identity-management), or [B2E](https://auth0.com/b2e-identity-management-for-employees) tool? Auth0 can help you focus on what matters the most to you, the special features of your product. [Auth0](https://auth0.com/) can improve your product's security with state-of-the-art features like [passwordless](https://auth0.com/passwordless), [breached password surveillance](https://auth0.com/breached-passwords), and [multifactor authentication](https://auth0.com/multifactor-authentication).

[We offer a generous **free tier**](https://auth0.com/pricing) so you can get started with modern authentication.

---

## Summary

In Part 2 of our Real-World Angular Series, we've covered authentication and authorization, feature planning, and data modeling for our MEAN stack application. In the next part of the tutorial series, we'll tackle fetching data from the database with a Node API and displaying data with Angular, complete with filtering and sorting.
