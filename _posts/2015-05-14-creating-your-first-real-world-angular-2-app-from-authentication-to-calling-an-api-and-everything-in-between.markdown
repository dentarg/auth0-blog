---
layout: post
title: "Build your Angular 2 App: From Auth to calling an API"
description: "Learn how to create a real world angular 2 app using Pipes, Directives, Components, DI, ES6 and much more! We'll implement from Authentication to calling an API and everything in between"
reply:
 twitter: https://twitter.com/auth0/status/598909226111631360
date: 2015-05-14 09:54AM
updated: 2016-10-26 12.30
category: Technical Guide, Angular, Angular 2
alias: /2015/05/14/creating-your-first-real-world-angular-2-app-from-authentication-to-calling-an-api-and-everything-in-between/
banner:
  text: "The Definitive Guide to Single Sign-On"
  action: "https://resources.auth0.com/definitive-guide-to-single-sign-on/?utm_source=blog"
  cta: "Download eBook"
author:
  name: Martin Gontovnikas
  url: http://twitter.com/mgonto
  mail: gonto@auth0.com
  avatar: https://www.gravatar.com/avatar/df6c864847fba9687d962cb80b482764??s=60design
design:
  image: https://cdn.auth0.com/blog/angular/logo3.png
  bg_color: "#012C6C"
tags:
- authentication
- angular2
- pipes
- component
- directive
- angular-2
- di
- bind
- real-world
- example
- talk
related:
- 2016-09-29-angular-2-authentication
- 2017-02-21-reactjs-authentication-tutorial
- 2017-04-18-vuejs2-authentication-tutorial
---

<div class="alert alert-info alert-icon">
  <i class="icon-budicon-500"></i>
  <strong>We just added a new updated article that covers the same topic. You can find it here: <a href="https://auth0.com/blog/angular-2-authentication/">Angular 2 Authentication Tutorial</a>.</strong>
</div>

----

**TL;DR:** Get the sample Angular 2 app from [this Github repository](https://github.com/auth0/angular2-authentication-sample). Also, check out [this talk](https://www.youtube.com/watch?v=pgFtp2LgwoE) I did where I explain and live-code this same example.

----

<div class="alert alert-danger alert-icon">
  <i class="icon-budicon-500"></i>
  <strong>This article was updated on Oct 26, 2016 to reflect the latest version of Angular 2.</strong>
</div>

Last week, the Angular team [announced](https://twitter.com/angularjs/status/593797019258359809) that **Angular 2 was moving from Alpha to Developer Preview**. Therefore, we figured **it was time to give it a try**.

After looking around the internet, I learned that **all of the existing examples were only one single page** with just 1 or 2 components. Those examples, while nice, weren't really useful for creating a real world app. Therefore, in order to learn and help the community, we decided to **create a fully working, real life small application that would have multiple pages and would handle authentication as well as calling an API**. In order to do all this, we'd use most of the new Angular 2 features like the router, components, directives, pipes and DI, as well as [Fetch](https://fetch.spec.whatwg.org/) for calling an API. In this article, we'll explain how we did it.

<!-- more -->

## Before we start

### Warning!

When we originally wrote this article, Angular 2 was constantly changing. Angular 2 is in a much better place now, so we are updating the content and code samples to reflect the latest version of the framework.

### Seed project

In order to start working with Angular 2, I strongly recommend checking [Pawel](https://twitter.com/pkozlowski_os)'s [ng2-play](https://github.com/pkozlowski-opensource/ng2-play). It makes it really easy to install and spin up a new project with Angular 2. The Angular 2 team has also released an official [Angular 2 CLI](https://cli.angular.io/) which can also make project setup a breeze.

### Read the comments!

Throughout this example, please **read the comments on the code**, which will give you insights about what each of the lines does.

### Install angular2-jwt

We can use [**angular2-jwt**](https://github.com/auth0/angular2-jwt) to make authenticated HTTP requests easily.

```bash
npm install angular2-jwt
```

## Let's code!

### Our Root Module

Angular 2 requires us to set up a root module for our application. This is done using the [@NgModule](https://angular.io/docs/ts/latest/guide/ngmodule.html) decorator which allows us to logically group our application into overarching modules. NgModules aims to simplify the way we manage dependencies in our Angular 2 apps. For our application, we'll group our entire application into a single module.

```js
// Import dependencies
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AUTH_PROVIDERS } from 'angular2-jwt';

import { AuthGuard } from './common/auth.guard';
import { Home } from './home';
import { Login } from './login';
import { Signup } from './signup';
import { App } from './app';

import { routes } from './app.routes';

// Declare the NgModule decorator
@NgModule({
  // Define the root component
  bootstrap: [App],
  // Define other components in our module
  declarations: [
    Home, Login, Signup, App
  ],
  // Define the services imported by our app
  imports: [
    HttpModule, BrowserModule, FormsModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  providers: [
    AuthGuard, ...AUTH_PROVIDERS
  ]
})
export class AppModule {}
```

You can learn much more about Angular 2 modules and how to better manage dependencies with them in this [post](https://auth0.com/blog/angular-2-ngmodules/).

### Setting Up the Router

Next we will set up the router. For each URL, our job is to setup which component should be loaded and where. Let's create a `app.routes.ts` file and we'll define our routes there.

```js
// Import our dependencies
import { Routes } from '@angular/router';
import { Home } from './home';
import { Login } from './login';
import { Signup } from './signup';
import { AuthGuard } from './common/auth.guard';

// Define which component should be loaded based on the current URL
export const routes: Routes = [
  { path: '',       component: Login },
  { path: 'login',  component: Login },
  { path: 'signup', component: Signup },
  { path: 'home',   component: Home, canActivate: [AuthGuard] },
  { path: '**',     component: Login },
];
```

### Building the Root Component

Our app needs an initial entry point. Let's create an `app.component.ts` file and define the specifics of our root component there.

```
import { Component } from '@angular/core';
import { Router } from '@angular/router';

const template = require('./app.html');

@Component({
  selector: 'auth-app',
  template: template
})

export class App {
  constructor(public router: Router) {}
}
```

You may have noticed that we are also importing an `app.html` file which will be our template. Let's create this file as well and add the following code to it:

```html
  <div class="container">
    <!-- Our components will be loaded here based on the current URL -->
    <router-outlet></router-outlet>
  </div>
```

### Bootstrapping our Application

Finally, we'll need to bootstrap our application to get it running.

Now we can `bootstrap` the application to get it running.

```js
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

// The bootstrap process in the final release of Angular 2 requires a module instead of a component
platformBrowserDynamic().bootstrapModule(AppModule);
```

We are now ready to start implementing our app specific logic.

### Restricting Access to Pages

We don't want anonymous users to be able to access the `Home` route, so we should redirect them if they aren't authenticated. For that, we can create our own `Guard`, which will only let authenticated users access the home route.

If we look at our routes code above we see that on the `Home` route we pass some additional code `canActivate: [AuthGuard]`. In this section we will implement the code for the `AuthGuard`. Once our app is running, each time the home route is hit, the AuthGuard function will be executed and decide whether or not a user can actually access the route.

```
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate() {
    // Check to see if a user has a valid JWT
    if (tokenNotExpired()) {
      // If they do, return true and allow the user to load the home component
      return true;
    }

    // If not, they redirect them to the login page
    this.router.navigate(['/login']);
    return false;
  }
```

### Creating the Login page

Now it's time to create our [Login](https://github.com/auth0/angular2-authentication-sample/blob/master/src/login/login.ts) component. Its main function will be displaying the login form and calling the login API using `Http`. Once the server successfully authenticates the user, we'll save the [JWT](http://jwt.io/) we get back in `localStorage` and then redirect the user to the home page.

```js
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { contentHeaders } from '../common/headers';

const styles   = require('./login.css');
const template = require('./login.html');

@Component({
  selector: 'login',
  template: template,
  styles: [ styles ]
})
export class Login {
  constructor(public router: Router, public http: Http) {
  }

  login(event, username, password) {
    event.preventDefault();
    let body = JSON.stringify({ username, password });
    this.http.post('http://localhost:3001/sessions/create', body, { headers: contentHeaders })
      .subscribe(
        response => {
          localStorage.setItem('id_token', response.json().id_token);
          this.router.navigate(['home']);
        },
        error => {
          alert(error.text());
          console.log(error.text());
        }
      );
  }

  signup(event) {
    event.preventDefault();
    this.router.navigate(['signup']);
  }
}
```

```html
 <div class="login jumbotron center-block">
   <h1>Login</h1>
   <form role="form" (submit)="login($event, username.value, password.value)">
   <div class="form-group">
     <label for="username">Username</label>
     <input type="text" #username class="form-control" id="username" placeholder="Username">
   </div>
   <div class="form-group">
     <label for="password">Password</label>
     <input type="password" #password class="form-control" id="password" placeholder="Password">
   </div>
   <button type="submit" class="btn btn-default">Submit</button>
     <a [routerLink]="['/signup']">Click here to Signup</a>
 </form>
 </div>
```

The sign up page is implemented in much the same way. For brevity, we will omit the implementation here, but you can view it on [GitHub](https://github.com/auth0-blog/angular2-authentication-sample/tree/master/src/signup).

### Creating the Home component

The user is logged in. It's time to create the [Home](https://github.com/auth0/angular2-authentication-sample/blob/master/src/home/home.ts) component, to which the user will arrive upon successful login. It will let the user call an authenticated API as well as display the JWT information.

```js
import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { AuthHttp } from 'angular2-jwt';

const styles = require('./home.css');
const template = require('./home.html');

@Component({
  selector: 'home',
  template: template,
  styles: [ styles ]
})
export class Home {
  jwt: string;
  decodedJwt: string;
  response: string;
  api: string;

  constructor(public router: Router, public http: Http, public authHttp: AuthHttp) {
    this.jwt = localStorage.getItem('id_token');
    this.decodedJwt = this.jwt && window.jwt_decode(this.jwt);
  }

  logout() {
    localStorage.removeItem('id_token');
    this.router.navigate(['login']);
  }

  callAnonymousApi() {
    this._callApi('Anonymous', 'http://localhost:3001/api/random-quote');
  }

  callSecuredApi() {
    this._callApi('Secured', 'http://localhost:3001/api/protected/random-quote');
  }

  _callApi(type, url) {
    this.response = null;
    if (type === 'Anonymous') {
      // For non-protected routes, just use Http
      this.http.get(url)
        .subscribe(
          response => this.response = response.text(),
          error => this.response = error.text()
        );
    }
    if (type === 'Secured') {
      // For protected routes, use AuthHttp
      this.authHttp.get(url)
        .subscribe(
          response => this.response = response.text(),
          error => this.response = error.text()
        );
    }
  }
}
```

```html
 <div>
  <div class="home jumbotron centered">
    <h1>Welcome to the angular2 authentication sample!</h1>
    <h2 *ngIf="jwt">Your JWT is:</h2>
    <pre *ngIf="jwt" class="jwt"><code>{{ jwt }}</code></pre>
    <pre *ngIf="jwt" class="jwt"><code>{{ decodedJwt | json }}</code></pre>
    <p>Click any of the buttons to call an API and get a response</p>
    <p><a class="btn btn-primary btn-lg" role="button" (click)="callAnonymousApi()">Call Anonymous API</a></p>
    <p><a class="btn btn-primary btn-lg" role="button" (click)="callSecuredApi()">Call Secure API</a></p>
    <p><a class="btn btn-primary btn-lg" role="button" (click)="logout()">Logout</a></p>
    <h2 *ngIf="response">The response of calling the <span class="red">{{ api }}</span> API is:</h2>
    <h3 *ngIf="response">{{ response }}</h3>
  </div>
</div>
```

That's it. We should be able to run and test our application now. If you are using the ng-play starter, simply run `npm start` and the app will compile and build. You can access the app on `localhost:3000`.

In the sample [GitHub repo](https://github.com/auth0-blog/angular2-authentication-sample/tree/master/backend) we also included a simple backend server that accompanies this tutorial. You can run this server by executing the `npm run server` command.

With both of these running, navigate to your app and try logging in with the credentials `gonto` for both the username and password. If all worked as expected, you will be redirected to the home page and can make calls to the API.

## Aside: Using Angular 2 with Auth0

<div class="alert alert-danger alert-icon">
  <i class="icon-budicon-500"></i>
  <strong>This article uses an outdated Auth0 authentication approach.</strong> For improved security, it is <strong>strongly advised</strong> that you refer to the following updated tutorial instead: <a href="https://auth0.com/blog/angular-2-authentication/">Angular 2 Authentication Tutorial</a>. 
</div>

Auth0 issues **JSON Web Tokens** on every login for your users. That means that you can have a solid identity infrastructure, including [single sign-on](https://resources.auth0.com/definitive-guide-to-single-sign-on/?utm_source=blog), user management, support for social (Facebook, Github, Twitter, etc.), enterprise (Active Directory, LDAP, SAML, etc.) and your own database of users with just a few lines of code.

We can add Auth0 to the app we just created really easily. There are just a few simple steps:

### Step 0: Sign Up for Auth0

If you don't already have any Auth0 account, [sign up](javascript:signup\(\)) for one now to follow along with the other steps.

### Step 1: Add Auth0Lock to Your App

[Lock](https://auth0.com/lock) is the beautiful (and totally customizable) login box widget that comes with Auth0. The script for it can be brought in from a CDN link or with npm.

> Note: If you use npm to get Auth0Lock, you will need to include it in your build step.

```html
  <!-- index.html -->
  ...

  <!-- Auth0 Lock script -->
  <script src="//cdn.auth0.com/js/lock/10.2.2/lock.min.js"></script>

  <!-- Setting the right viewport -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

  ...
```

### Step 2: Add an Authentication Service

It's best to set up an injectable service for authentication that can be used across the application.

With Auth0, we get access to the user's profile and JWT in the `lock.on('authenticated')` callback and these items can be saved in local storage for use later. Let's create a new file called `auth.service.ts` in our common directory. The implementation will be as follows:

```js
import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { Router } from '@angular/router';

declare var Auth0Lock: any;

@Injectable()
export class AuthService {
  // Set our Auth0 credentials
  lock = new Auth0Lock('YOUR-AUTH0-CLIENT-ID', 'YOUR-AUTH0-DOMAIN.auth0.com');

  constructor(private router: Router) {
    // Capture the user credentials when the user has succesfully logged in
    this.lock.on('authenticated', (authResult: any) => {
      localStorage.setItem('id_token', authResult.idToken);

      this.lock.getProfile(authResult.idToken, (error: any, profile: any) => {
        if (error) {
          console.log(error);
        }

        localStorage.setItem('profile', JSON.stringify(profile));
        this.router.navigateByUrl('/home');
      });

      this.lock.hide();
    });
  }

  // Display the lock login box
  login() {
    this.lock.show();
  }

  // Logout the user
  logout() {
    // To log out, just remove the token and profile
    // from local storage
    localStorage.removeItem('profile');
    localStorage.removeItem('id_token');

    // Send the user back to the dashboard after logout
    this.router.navigateByUrl('/login');
  }

  // Check whether the user is logged in or not
  loggedIn() {
    return tokenNotExpired();
  }
}
```

In order to use this service, we'll have to declare it in our NgModule in the `app.module.ts` file.

```js
// ... existing dependencies
import { AuthService } from './common/auth.service';

@NgModule({
  // ... existing declarations
  providers: [
    AuthGuard, ...AUTH_PROVIDERS, AuthService
  ]
})
```

### Step 3: Add a Click Handler to Login

We can use the methods from our authentication service in any of our components which means we can easily add a click handler to a "Login" and "Logout" button. Let's edit our login component to make use of Lock for authentication.

First we'll need to include the `AuthService` in our `Login` component.

```js
//... existing dependencies
import { AuthService } from '../common/auth.service';
// ...
export class Login {
  // Add the AuthService to our constructor
  constructor(public router: Router, public http: Http, private auth: AuthService) {
  }
  // ...
}
```

Next, we'll make the updates to our template.

```html
 <div class="login jumbotron center-block">

   <a class="btn btn-success" (click)="auth.login()" *ngIf="!auth.loggedIn()">Log In</a>

 </div>
```

Now, when a user clicks the Log In link, they will be presented with the Lock UI. Upon a succesful login, they will be redirected to the home page.

### Step 4: Make Authenticated HTTP Requests

We can again use `AuthHttp` from [**anuglar2-jwt**](https://github.com/auth0/angular2-jwt) to automatically have our JWTs sent in HTTP requests. You can read more over about [Angular 2 Http examples](https://auth0.com/blog/angular-2-series-part-3-using-http/).

```js
// src/home/home.ts

...

  _callApi(type, url) {
    this.response = null;
    if (type === 'Anonymous') {
      // For non-protected routes, just use Http
      this.http.get(url)
        .subscribe(
          response => this.response = response.text(),
          error => this.response = error.text()
        );
    }
    if (type === 'Secured') {
      // For protected routes, use AuthHttp
      this.authHttp.get(url)
        .subscribe(
          response => this.response = response.text(),
          error => this.response = error.text()
        );
    }
  }

...
```

### Step 5: Done!

That's all there is to it to add authentication to your Angular 2 app with Auth0! If you would like to see the completed demo with Auth0 Lock, you can view it [here](https://github.com/auth0-blog/angular2-authentication-sample/tree/auth0-lock).

## Conclusions

In this article, we've learned how to create a multiple page Angular 2 app that uses the router, templates, directives and components to implement both authentication and calling an API. You can see the complete example on [Github](https://github.com/auth0/angular2-authentication-sample), as well as a [talk that I did](https://www.youtube.com/watch?v=pgFtp2LgwoE), where this example is live-coded.

Before ending, I want to thank [David East](https://twitter.com/_davideast) for his support with some questions, [PatrickJS](https://twitter.com/gdi2290) for his help on coding parts of the example and to [Jesus Rodriguez](https://twitter.com/Foxandxss) for cleaning up some of the unused code.

Happy hacking :).
