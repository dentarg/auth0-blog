---
layout: post
title: "Cookies vs Tokens: The Definitive Guide"
description: "The cookie vs token debate favors token-based authentication. Learn the advantages and get answers to common concerns regarding token authentication."
date: 2016-05-31 08:30
alias: /2016/05/31/cookies-vs-tokens-definitive-guide/
category: Technical Guide, Identity, Cookies vs Tokens
author: 
  name: "Ado Kukic"
  url: "https://twitter.com/kukicadnan"
  mail: "ado@auth0.com"
  avatar: "https://s.gravatar.com/avatar/99c4080f412ccf46b9b564db7f482907?s=200"
design: 
  bg_color: "#08192D"
  image: "https://cdn.auth0.com/blog/cookies-vs-tokens/cvt-logo.png"
tags: 
- Cookies vs Tokens
- Cookies
- Tokens
- JWT
- Progressive Web App
related:
- 2014-01-27-ten-things-you-should-know-about-tokens-and-cookies
- 2015-12-17-json-web-token-signing-algorithms-overview
- 2015-09-28-5-steps-to-add-modern-authentication-to-legacy-apps-using-jwts
---

---

**TL;DR** Tokens-based authentication is more relevant than ever. We examine the differences and similarities between cookie and token-based authentication, advantages of using tokens, and address common questions and concerns developers have regarding token-based auth. Finally, putting theory to practice, we'll build an application that uses token authentication and make it a progressive web app.

We will be writing an Angular 2 app that uses JWT for authentication. Grab the [Github repo](https://github.com/auth0-blog/angular-auth0-aside) if you would like to follow along.

---

Our [last article](https://auth0.com/blog/2014/01/07/angularjs-authentication-with-cookies-vs-token/) comparing cookie to token authentication was over two years ago. Since then, we've written extensively on how to integrate token authentication across many different languages and frameworks.

The rise of single page applications (SPAs) and decoupling of the front-end from the back-end is in full force. Frameworks like [Angular](https://angularjs.org/), [React](https://facebook.github.io/react/), and [Vue](https://vuejs.org/) allow developers to build bigger, better, and more performant single page applications than ever before. Token-based authentication goes hand in hand with these frameworks.

{% include tweet_quote.html quote_text="Token-based authentication goes hand in hand with SPA frameworks like Angular, React and Vue." %}

## Cookie vs Token Authentication - Recap

Before we dive further, let's quickly recap how these two authentication systems work. If you are already familiar with how cookie and token authentication works, feel free to skip this section, otherwise read on for an in-depth overview. 

This diagram is a great introduction and simplified overview of the difference between cookie and token approaches to authentication.

![Cookie vs Token-Based Authentication](https://cdn.auth0.com/blog/cookies-vs-tokens/cookie-token-auth.png)

### Cookie Based Authentication

Cookie based authentication has been the default, tried-and-true method for handling user authentication for a long time.
 
Cookie based authentication is **stateful**. This means that an authentication record or session must be kept both server and client-side. The server needs to keep track of active sessions in a database, while on the front-end a cookie is created that holds a session identifier, thus the name cookie based authentication. Let's look at the flow of traditional cookie based authentication:

1. User enters their login credentials
2. Server verifies the credentials are correct and creates a session which is then stored in a database
3. A cookie with the session ID is placed in the users browser
4. On subsequent requests, the session ID is verified against the database and if valid the request processed
5. Once a user logs out of the app, the session is destroyed both client and server side

### Token-Based Authentication

Token-based authentication has gained prevalence over the last few years due to rise of single page applications, web APIs, and the Internet of Things (IoT). When we talk about authentication with tokens, we generally talk about authentication with [JSON Web Tokens](https://jwt.io/introduction) (JWTs). While there are different ways to implement tokens, JWTs have become the de-facto standard. With this context in mind, the rest of the article will use tokens and JWTs interchangeably. 

Token-based authentication is **stateless**. The server does not keep a record of which users are logged in or which JWTs have been issued. Instead, every request to the server is accompanied by a token which the server uses to verify the authenticity of the request. The token is generally sent as an addition Authorization header in form of `Bearer {JWT}`, but can additionally be sent in the body of a POST request or even as a query parameter. Let's see how this flow works:

1. User enters their login credentials
2. Server verifies the credentials are correct and returns a signed token
3. This token is stored client-side, most commonly in local storage - but can be stored in session storage or a cookie as well
4. Subsequent requests to the server include this token as an additional Authorization header or through one of the other methods mentioned above
5. The server decodes the JWT and if the token is valid processes the request
6. Once a user logs out, the token is destroyed client-side, no interaction with the server is necessary

## Advantages of Token-Based Authentication

Understanding **how** something works is only half the battle. Next, we'll cover the reasons **why** token authentication is preferable over the traditional cookie based approach.

### Stateless, Scalable and Decoupled

Perhaps the biggest advantage to using tokens over cookies is the fact that token authentication is stateless. The back-end does not need to keep a record of tokens. Each token is self-contained, containing all the data required to check its validity as well as convey user information through claims. 

The server's only job then, becomes to sign tokens on a successful login request and verify that incoming tokens are valid. In fact, the server does not even need to sign tokens. Third party services such as Auth0 can handle the issuing of tokens and then the server only needs to verify the validity of the token.

### Cross Domain and CORS

Cookies work well with singular domains and sub-domains, but when it comes to managing cookies across different domains, it can get hairy. In contrast, a token-based approach with CORS enabled makes it trivial to expose APIs to different services and domains. Since the JWT is required and checked with each and every call to the back-end, as long as there is a valid token, requests can be processed. There are a few caveats to this and we'll address those in the Common Questions and Concerns section below.

### Store Data in the JWT

With a cookie based approach, you simply store the session id in a cookie. JWT's on the other hand allow you to store any type of metadata, as long as it's valid JSON. The [JWT spec](https://tools.ietf.org/html/rfc7519) specifies different types of claims that can be included such as reserved, public and private. You can learn more about the specifics and the differences between the types of claims on the [jwt.io](https://jwt.io/introduction/) website.
 
In practice, what this means is that a JWT can contain any type of data. Depending on your use case you may choose to make the minimal amount of claims such as the user id and expiration of the token, or you may decide to include additional claims such as the users email address, who issued the token, scopes or permissions for the user, and more. 

### Performance

When using the cookie based authentication, the back-end has to do a lookup, whether that be a traditional SQL database or a NoSQL alternative, and the roundtrip is likely to take longer compared to decoding a token. Additionally, since you can store additional data inside the JWT, such as the users permission level, you can save yourself additional lookup calls to get and process the requested data.
 
For example, say you had an API resource `/api/orders` that retrieves the latest orders placed via your app, but only users with the role of **admin** have access to view this data. In a cookie based approach, once the request is made, you'd have one call to the database to verify that the session is valid, another to get the user data and verify that the user has the role of **admin**, and finally a third call to get the data. On the other hand, with a JWT approach, you can store the user role in the JWT, so once the request is made and the JWT verified, you can make a single call to the database to retrieve the orders.

### Mobile Ready

Modern APIs do not only interact with the browser. Written properly a single API can serve both the browser and native mobile platforms like iOS and Android. Native mobile platforms and cookies do not mix well. While possible, there are many limitations and considerations to using cookies with mobile platforms. Tokens on the other hand are much easier to implement on both iOS and Android. Tokens are also easier to implement for Internet of Things applications and services that do not have a concept of a cookie store.

## Common Questions and Concerns

In this section, we'll take a look at some common questions and concerns that frequently arise when the topic of token authentication comes up. The key focus here will be security but we'll examine use cases concerning token size, storage and encryption.

### JWT Size

The biggest disadvantage of token authentication is the size of JWTs. A session cookie is relatively tiny compared to even the smallest JWT. Depending on your use case, the size of the token could become problematic if you add many claims to it. Remember, each request to the server must include the JWT along with it.

### Where to Store Tokens?

With token-based auth, you are given the choice of where to store the JWT. Commonly, the JWT is placed in the browsers local storage and this works well for most use cases. There are some issues with storing JWTs in local storage to be aware of. Unlike cookies, local storage is sandboxed to a specific domain and its data cannot be accessed by any other domain including sub-domains.

You can store the token in a cookie instead, but the max size of a cookie is only 4kb so that may be problematic if you have many claims attached to the token. Additionally, you can store the token in session storage which is similar to local storage but is cleared as soon as the user closes the browser.

### XSS and XSRF Protection

Protecting your users and servers is always a top priority. One of the most common concerns developers have when deciding on whether to use token-based authentication is the security implications. Two of the most common attack vectors facing websites are Cross Site Scripting (XSS) and Cross Site Request Forgery (XSRF or CSRF).

[Cross Site Scripting](https://www.owasp.org/index.php/Cross-site_Scripting_(XSS)) attacks occur when an outside entity is able to execute code within your website or app. The most common attack vector here is if your website allows inputs that are not properly sanitized. If an attacker can execute code on your domain, your JWT tokens are vulnerable. Our CTO has [argued](https://auth0.com/blog/2014/01/27/ten-things-you-should-know-about-tokens-and-cookies/#xss-xsrf) in the past that XSS attacks are much easier to deal with compared to XSRF attacks because they are generally better understood. Many frameworks, including Angular, automatically sanitize inputs and prevent arbitrary code execution. If you are not using a framework that sanitizes input/output out-of-the-box, you can look at plugins like [caja](https://github.com/google/caja) developed by Google to assist. Sanitizing inputs is a solved issue in many frameworks and languages and I would recommend using a framework or plugin vs building your own.

Cross Site Request Forgery attacks are not an issue if you are using JWT with local storage. On the other hand, if your use case requires you to store the JWT in a cookie, you will need to protect against XSRF. XSRF are not as easily understood as XSS attacks. Explaining how XSRF attacks work can be time consuming, so instead, check out [this](http://www.gnucitizen.org/blog/csrf-demystified/) really good guide that explains in-depth how XSRF attacks work. Luckily, preventing XSRF attacks is a fairly simple matter. To over-simplify, protecting against an XSRF attack, your server, upon establishing a session with a client will generate a unique token (note this is not a JWT). Then, anytime data is submitted to your server, a hidden input field will contain this token and the server will check to make sure the tokens match. Again, as our recommendation is to store the JWT in local storage, you probably will not have to worry about XSRF attacks.

One of the best ways to protect your users and servers is to have a short expiration time for tokens. That way, even if a token is compromised, it will quickly become useless. Additionally, you may maintain a [blacklist](https://auth0.com/blog/2015/03/10/blacklist-json-web-token-api-keys/) of compromised tokens and not allow those tokens access to the system. Finally, the nuclear approach would be to change the signing algorithm, which would invalidate all active tokens and require all of your users to login again. This approach is not easily recommended, but is available in the event of a severe breach.

### Tokens Are Signed, Not Encrypted

A JSON Web Token is comprised of three parts: the header, payload, and signature. The format of a JWT is `header.payload.signature`. If we were to sign a JWT with the HMACSHA256 algorithm, the secret 'shhhh' and the payload of:

```
{
  "sub": "1234567890",
  "name": "Ado Kukic",
  "admin": true
}
```

The JWT generated would be:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkbyBLdWtpYyIsImFkbWluIjp0cnVlLCJpYXQiOjE0NjQyOTc4ODV9.Y47kJvnHzU9qeJIN48_bVna6O0EDFiMiQ9LpNVDFymM
```

The **very** important thing to note here, is that, this token is signed by the HMACSHA256 algorithm, and the header and payload are Base64URL encoded, it is **not** encrypted. If I go to [jwt.io](https://jwt.io), paste this token and select the HMACSHA256 algorithm, I could decode the token and read its contents. Therefore, it should go without saying that sensitive data, such as passwords, should never be stored in the payload.

If you must store sensitive data in the payload or your use case calls for the JWT to be obscured, you can use JSON Web Encryption (JWE). JWE allows you to encrypt the contents of a JWT so that it is not readable by anyone but the server. [JOSE](http://jose.readthedocs.io/en/latest/) provides a great framework and different options for JWE and has SDKs for many popular frameworks including [NodeJS](https://github.com/cisco/node-jose) and [Java](https://bitbucket.org/connect2id/nimbus-jose-jwt/wiki/Home). Anyway, I encourage you to learn more about [AngularJS Authentication](https://auth0.com/learn/angularjs-authentication/).

## Token-Based Authentication in Action with Auth0

Here at Auth0, we've written SDKs, guides, and quickstarts for working with JWTs for many languages and frameworks including [NodeJS](https://github.com/auth0/express-jwt), [Java](https://github.com/auth0/java-jwt), [Python](https://github.com/auth0/auth0-python), [GoLang](https://github.com/auth0/go-jwt-middleware), and [many more](https://auth0.com/docs). Our last "Cookies vs. Tokens" article used the AngularJS framework, so it's fitting to use Angular 2 for our code samples today.

You can download the sample code from our [GitHub repo](https://github.com/auth0-blog/angular-auth0-aside) created by [Kim Maida](https://twitter.com/kimmaida). Downloading the code samples is preferable as Angular 2 requires a lot of initial setup to get going. If you haven't already, [sign up](javascript:signup\(\)) for a free Auth0 account so you can do the implementation yourself and experiment with different features and options. Let's get started.

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

### Set Up a Client App

1. Go to your [**Auth0 Dashboard**](https://manage.auth0.com/#/) and click the "[create a new client](https://manage.auth0.com/#/clients/create)" button. 
2. Name your new app and select "Single Page Web Applications". 
3. In the **Settings** for your new Auth0 client app, add `http://localhost:4200/callback` to the **Allowed Callback URLs** and `http://localhost:4200` to the **Allowed Origins (CORS)**.
4. Scroll down to the bottom of the **Settings** section and click "Show Advanced Settings". Choose the **OAuth** tab and change the **JsonWebToken Signature Algorithm** to `RS256`.
5. If you'd like, you can [set up some social connections](https://manage.auth0.com/#/connections/social). You can then enable them for your app in the **Client** options under the **Connections** tab. The example shown in the screenshot above utilizes username/password database, Facebook, Google, and Twitter.

### Set Up an API

1. Under your account name in the upper right corner of your [**Auth0 Dashboard**](https://manage.auth0.com/#/), choose **Account Settings** from the dropdown, then select the [**Advanced**](https://manage.auth0.com/#/account/advanced) tab. Scroll down to the **Settings** section and turn on the toggle for **Enable APIs Section**. Now you will have a link to manage [APIs](https://manage.auth0.com/#/apis) in your dashboard left sidebar navigation.
2. Go to [**APIs**](https://manage.auth0.com/#/apis) in your dashboard and click on the "Create API" button. Enter a name for the API. Set the **Identifier** to your API endpoint URL. In this example, this is `http://localhost:3001/api/`. The **Signing Algorithm** should be `RS256`.
3. Once your API is created, navigate to the **Non-Interactive Clients** tab and flip the switch on the client you created above. This will ensure that your front-end client can access the backend API.
4. You can consult the Node.js example under the **Quick Start** tab in your new API's settings. We'll implement our Node API in this fashion, using [Express](https://expressjs.com/), [express-jwt](https://github.com/auth0/express-jwt), and [jwks-rsa](https://github.com/auth0/node-jwks-rsa).

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

Change the `CLIENT_DOMAIN` variable to your Auth0 client domain and `AUTH0_AUDIENCE` to whatever you set your API audience to. The `/api/dragons` route will be protected with [express-jwt](https://github.com/auth0/express-jwt) and [jwks-rsa](https://github.com/auth0/node-jwks-rsa).

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

> **Note:** If it's the user's first visit to our app and our callback is on localhost, they'll also be presented with a consent screen where they can grant access to our API. A first party client on a non-localhost domain would be highly trusted, so the consent dialog would not be presented in this case. You can modify this by editing your Auth0 Dashboard API Settings. Look for the "Allow Skipping User Consent" toggle.

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

## Conclusion

In today's article we compared the differences between cookie and token-based authentication. We highlighted the advantages and concerns of using tokens and also wrote a simple app to showcase how JWT works in practice. There are many reasons to use tokens and Auth0 is here to ensure that implementing token authentication is easy and secure. Finally, we introduced Progressive Web Apps to help make your web applications feel more native on mobile devices. [Sign up](javascript:signup\(\)) for a free account today and be up and running in minutes.