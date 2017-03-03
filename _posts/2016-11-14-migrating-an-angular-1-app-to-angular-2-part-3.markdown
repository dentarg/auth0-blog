---
layout: post
title: "Migrating an AngularJS App to Angular - Part 3"
description: "Learn how to migrate real-world features of an AngularJS 1 application to a fresh Angular 2+ build (Part 3): routing  & API with params, authentication."
date: 2016-11-14 8:30
category: Technical Guide, Angular, Migration
banner:
  text: "Auth0 makes it easy to add authentication to your Angular  application."
author:
  name: "Kim Maida"
  url: "https://twitter.com/KimMaida"
  mail: "kim.maida@auth0.com"
  avatar: "https://en.gravatar.com/userimage/20807150/4c9e5bd34750ec1dcedd71cb40b4a9ba.png"
design:
  image: https://cdn.auth0.com/blog/angular/logo.png
  image_size: "75%"
  image_bg_color: "rgb(1, 70, 166)"
  bg_color: "rgb(1, 70, 166)"
  bg_merge: true
tags:
- angular2
- angular
- migrate
related:
- 2016-11-07-migrating-an-angular-1-app-to-angular-2-part-1
- 2016-11-09-migrating-an-angular-1-app-to-angular-2-part-2
---

<div class="alert alert-info alert-icon">
  <i class="icon-budicon-664"></i>
  <strong>Get the "Migrating an AngularJS App to Angular book" for Free.</strong> Spread the word and <a href="https://auth0.com/e-books/migrating-to-angular2">download it now!</a>
</div>

<div class="alert alert-info alert-icon">
  <i class="icon-budicon-664"></i>
  The <a href="http://angularjs.blogspot.com/2017/01/branding-guidelines-for-angular-and.html">Branding Guidelines for Angular</a> state that version 1.x should be referred to as <em>AngularJS</em>, whereas all releases from version 2 and up are named <em>Angular</em>. This migration article will continue to use "Angular 1" to refer to AngularJS (1.x) and "Angular 2" to refer to Angular (2 and up) in order to clearly differentiate the frameworks and reduce confusion.
</div>

**TL;DR:** Many AngularJS 1.x developers are interested in Angular 2, but the major differences between versions 1 and 2 are daunting when we have so many Angular 1 apps already in production or maintenance. In [Part 1](http://auth0.com/blog/migrating-an-angular-1-app-to-angular-2-part-1) and [Part 2](http://auth0.com/blog/migrating-an-angular-1-app-to-angular-2-part-2) of this tutorial we set up our Angular 2 app, migrated the basic architecture, routing, API, and more. In this final installment we'll finish our app! The final code for our Angular 2 app can be cloned from the [ng2-dinos GitHub repo](https://github.com/auth0-blog/ng2-dinos).

---

## Recap and Introduction to Part 3

In [Migrating an Angular 1 App to Angular 2 - Part 1](http://auth0.com/blog/migrating-an-angular-1-app-to-angular-2-part-1) we introduced the Angular 1 [**ng1-dinos**](https://github.com/auth0-blog/ng1-dinos) Single Page Application and migrated the basic app architecture to Angular 2 [**ng2-dinos**](https://github.com/auth0-blog/ng2-dinos). After [Migrating an Angular 1 App to Angular 2 - Part 2](http://auth0.com/blog/migrating-an-angular-1-app-to-angular-2-part-2) we've migrated pages and routing, getting API data, and filtering. 

The third and final part of the tutorial will cover:

* Routing detail pages 
* Dinosaur detail model and calling the [sample-nodeserver-dinos](https://github.com/auth0-blog/sample-nodeserver-dinos) API for dino information by ID
* Loading states for API calls
* Bonus: user authentication with Auth0 and JSON Web Tokens

> **Note:** Remember that we're _migrating_ an Angular 1 app to Angular 2 with a fresh build. We're not _upgrading_ the original Angular 1 codebase.

## Setup and Dependencies

Part three has the same dependencies as the first two parts of our tutorial, so make sure you have:

* [NodeJS with npm](https://nodejs.org)
* [sample-nodeserver-dinos](https://github.com/auth0-blog/sample-nodeserver-dinos) local API for both Angular 1 and 2 apps
* [Gulp](http://gulpjs.com) (for building and serving ng1-dinos)
* [ng1-dinos](https://github.com/auth0-blog/ng1-dinos) project cloned and available for reference
* [Angular CLI](https://github.com/angular/angular-cli) (for developing, serving, and building ng2-dinos)
* Your ng2-dinos project so far from [Part 1](http://auth0.com/blog/migrating-an-angular-1-app-to-angular-2-part-1) + [Part 2](http://auth0.com/blog/migrating-an-angular-1-app-to-angular-2-part-2) (the code-complete [ng2-dinos GitHub repo](https://github.com/auth0-blog/ng2-dinos) is also available)

We'll pick up right where we left off. 

## Migrating Detail Component to Angular 2

Our Angular 1 ng1-dinos app shows a dinosaur's details when we click on one in the homepage listing. We'll implement this in our Angular 2 app now.

Let's create a new detail component:

```bash
$ ng g component pages/detail
```

### Routing with Parameters

Let's make our detail component accessible in the application. We want to show the detail page with a dinosaur ID, like this: `http://localhost:4200/dinosaur/5`. Open the `app-routing.module.ts` file:

```typescript
// ng2-dinos/src/app/core/app-routing.module.ts

...
import { DetailComponent } from '../pages/detail/detail.component';

...
    RouterModule.forRoot([
      ...
      {
        path: 'dinosaur/:id',
        component: DetailComponent
      },
      {
        path: '**',
        component: Error404Component
      }
    ])
...
```

We'll import our new detail component and then add a route with an `:id` parameter. This route should be placed above the `**` wildcard route.

### Linking to Routes with Parameters

Now we need to link each dinosaur with its detail page. Open `dino-card.component.html`:

{% highlight html %}
<!-- ng2-dinos/src/app/pages/home/dino-card/dino-card.component.html -->

...
    <p class="text-center">
      <a class="btn btn-primary" [routerLink]="['/dinosaur', dino.id]">Details</a>
    </p>
...
{% endhighlight %}

We'll use the [`routerLink` directive](https://angular.io/docs/ts/latest/api/router/index/RouterLink-directive.html) with the Details button and bind an array of the URL segments: `[routerLink]="['/dinosaur', dino.id]"`. Now we should be able to click on dinosaur Details in the homepage and see our detail component.

## Calling the API for Data by ID

Our detail component needs to make API calls to retrieve dinosaur data by ID. Let's implement this functionality using a new model and a new observable in the `Dinos` service.

### Create a Dino Details Model

The [Dinos Node API](http://github.com/auth0-blog/sample-nodeserver-dinos) supports a route that accepts an ID and returns detailed dinosaur information. Let's create a model for this. Make sure the local Node API is running and we'll test out the route by accessing it in the browser: [http://localhost:3001/api/dinosaur/1](http://localhost:3001/api/dinosaur/1). The response looks like this:

```js
// http://localhost:3001/api/dinosaur/1

{
  "id": 1,
  "name": "Allosaurus",
  "pronunciation": "AL-oh-sore-us",
  "meaningOfName": "other lizard",
  "diet": "carnivorous",
  "length": "12m",
  "period": "Late Jurassic",
  "mya": "156-144",
  "info": "Allosaurus was an apex predator in the Late Jurassic in North America."
}
```

Let's supply a model for this data shape. Create a new file in the `models` directory we created in [Part 2](http://auth0.com/blog/migrating-an-angular-1-app-to-angular-2-part-2) and name it `dino-detail.model.ts`:

```typescript
// ng2-dinos/src/app/core/models/dino-detail.model.ts

export class DinoDetail {
  constructor(
    public id: number,
    public name: string,
    public pronunciation: string,
    public meaningOfName: string,
    public diet: string,
    public length: string,
    public period: string,
    public mya: string,
    public info: string
  ) { }
}
```

### Add HTTP Observable to Get Dinosaur by ID

Next we'll add the HTTP observable to call the API and retrieve the dinosaur data by ID. Let's open our `dinos.service.ts` file and add a new method:

```typescript
// ng2-dinos/src/app/core/dinos.service.ts

...
import { DinoDetail } from './models/dino-detail.model';

...
  getDino$(id: number): Observable<DinoDetail> {
    return this.http
      .get(`${this.baseUrl}dinosaur/${id}`)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }
...

```

We'll import the `DinoDetail` model we just created. Then we'll create an HTTP observable that accepts an `id: number` as a parameter. The observable has a type annotation of `Observable<DinoDetail>`. The ID parameter is passed to the `GET` request. The handlers we set up in [Part 2](http://auth0.com/blog/migrating-an-angular-1-app-to-angular-2-part-2) are then used for successes and errors. The `map` operator will return the API data as JSON and the `catch` operator will generate an observable that terminates with an error.

## Using API Data in Detail Component

Now we're ready to get and display individual dinosaur information in our detail component.

### Detail Component TypeScript

Let's update the `detail.component.ts` file:

```typescript
// ng2-dinos/src/app/pages/detail/detail.component.ts

import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';

import { DinosService } from '../../core/dinos.service';
import { DinoDetail } from '../../core/models/dino-detail.model';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  dino: DinoDetail;
  error: boolean;

  constructor(
    private titleService: Title,
    private dinosService: DinosService,
    private route: ActivatedRoute) { }

  getDino() {
    this.route.params.forEach((params: Params) => {
      let id = +params['id'];	// convert string to number

      this.dinosService.getDino$(id)
        .subscribe(
          res => {
            this.dino = res;
            this.titleService.setTitle(this.dino.name);
          },
          err => {
            this.error = true;
          }
        );
    });
  }

  ngOnInit() {
    this.getDino();
  }

}
```

Most of this should look familiar from implementing our home component in [Part 2](http://auth0.com/blog/migrating-an-angular-1-app-to-angular-2-part-2) of the tutorial. 

Let's start by importing our dependencies. We need the `Title` service. We'll also need [`ActivatedRoute`](https://angular.io/docs/ts/latest/api/router/index/ActivatedRoute-interface.html) and `Params` from `@angular/router` in order to retrieve the route ID parameter to use to get the appropriate dinosaur data from the API. Finally, we'll also need the `DinosService` and `DinoDetail` model.

We'll create a couple of properties: `dino` will utilize the `DinoDetail` model type and `error` is a boolean, like in our `home.component.ts`. Then we'll add dependencies to the constructor function so we can use them.

The `getDino()` method iterates over the available route parameters. We'll convert the `id` string to a number and then pass it to the `getDino$(id)` observable. We'll subscribe to the observable and assign the JSON response to the `dino` property. We'll also set the page title as the dinosaur's `name`. If there's an error retrieving data, we'll simply set the `error` property to `true`.

Finally, we'll call the `getDino()` method in the `ngOnInit()` [lifecycle hook](https://angular.io/docs/ts/latest/guide/lifecycle-hooks.html). 

### Detail Component Template

Now we're ready to display the dinosaur detail information in our detail component template. Open the `detail.component.html` file:

{% highlight html %}
{% raw %}
<!-- ng2-dinos/src/app/pages/detail/detail.component.html -->

<article id="content-wrapper" class="content-wrapper">

  <section *ngIf="dino" id="detail-content-dinosaur" class="panel panel-default">
    <div class="panel-heading">
      <h2 class="text-center">{{dino.name}}</h2>
    </div>
    
    <ul class="list-group">
      <li class="list-group-item">
        <h4 class="list-group-item-heading">Pronunciation:</h4>
        <p class="list-group-item-text">
          <em>{{dino.pronunciation}}</em>	
        </p>
      </li>
      <li class="list-group-item">
        <h4 class="list-group-item-heading">Name Means:</h4>
        <p class="list-group-item-text">{{dino.meaningOfName}}</p>
      </li>
      <li class="list-group-item">
        <h4 class="list-group-item-heading">Length:</h4>
        <p class="list-group-item-text">{{dino.length}}</p>
      </li>
      <li class="list-group-item">
        <h4 class="list-group-item-heading">Diet:</h4>
        <p class="list-group-item-text">{{dino.diet}}</p>
      </li>
      <li class="list-group-item">
        <h4 class="list-group-item-heading">Lived:</h4>
        <p class="list-group-item-text">
          {{dino.period}}<br>
          <em>({{dino.mya}} million years ago)</em>
        </p>
      </li>
    </ul>

    <div class="panel-body">
      <p class="lead" [innerHTML]="dino.info"></p>
    </div>

    <div class="panel-footer">
      <a routerLink="/">&larr; All Dinosaurs</a>
    </div>
  </section>

  <!-- Error -->
  <p *ngIf="error" class="alert alert-danger">
    <strong>Rawr!</strong> There was an error retrieving data for the dinosaur you requested.
  </p>

</article>
{% endraw %}
{% endhighlight %}

Like with the other page components we migrated, we don't need a `.detail-wrapper` class in the template. In Angular 1 ng1-dinos we used these classes to "componetize" globally-declared CSS. Angular 2 encapsulates styles by component so we don't need specific wrapper classes anymore. 

We'll use Bootstrap to style most of our dinosaur details. Most of our data can be displayed simply using [interpolation with double-curly braces](https://angular.io/docs/ts/latest/guide/template-syntax.html#!#interpolation). The exception is the `info` paragraph. Our API sometimes returns HTML markup in this string. In Angular 1 ng-dinos, we used `ng-bind-html` to render markup in bindings. In Angular 2, we need to bind to the `innerHTML` DOM property like so: 

{% highlight html %}
<p class="lead" [innerHTML]="dino.info"></p>
{% endhighlight %}

We'll add a link back to the homepage and then finally, show an error message if there was a problem retrieving data from the API.

### Detail Component Styles

We'll just make one small tweak in the SCSS for our detail component to reduce the amount of extra space above the dinosaur name heading. In the Angular 1 app, the detail page styles were here: [`ng1-dinos/src/assets/css/scss/pages/_detail.scss`](https://github.com/auth0-blog/ng1-dinos/blob/master/src/assets/css/scss/pages/_detail.scss).

Our Angular 2 ng2-dinos detail component styles should look like this:

```scss
/* ng2-dinos/src/app/pages/detail/detail.component.scss */

/*--------------------
       DETAIL
--------------------*/

.panel-heading h2 {
  margin-top: 10px;
}
```

Now we have our detail component! When dinosaur details are clicked on the homepage, the detail pages should look something like this:

![Angular 1 migrate to Angular 2 detail route](https://cdn.auth0.com/blog/ng1-to-ng2/dino-detail.jpg)

Browse your app to make sure this is working as expected.

## Loading State for API Calls

Our Angular 1 to Angular 2 migration is almost complete! The last piece is a simple loading state that needs to be shown while API calls are resolving. Because we're running our app and API locally, communication between the two is almost instantaneous. In another environment this may not be the case. We'll implement a small loading state to show while data is being retrieved. This will show in the home and detail components.

In Angular 1 ng1-dinos, this loading state was a simple  [directive at `ng1-dinos/src/app/core/ui/loading.dir.js`](https://github.com/auth0-blog/ng1-dinos/blob/master/src/app/core/ui/loading.dir.js). In Angular 2, we'll create a very similar loading component.

### Loading Image Asset

The first thing we need is the image asset for the loading state. This can be downloaded from the Angular 1 ng1-dinos app here: [`ng1-dinos/src/assets/images/raptor-loading.gif`](https://github.com/auth0-blog/ng1-dinos/blob/master/src/assets/images/raptor-loading.gif). We'll place this image in our Angular 2 ng2-dinos app in an equivalent location: `ng2-dinos/src/assets/images/`.

### Loading Component TypeScript

Create a new folder called `ui` in the `ng2-dinos/src/app/core/` directory.

This component will only be one file so we'll create it manually instead of using the Angular CLI. This is good practice. Make a new file in the new `ng2-dinos/src/app/core/ui/` folder and call it `loading.component.ts`:

```typescript
// ng2-dinos/src/app/core/ui/loading.component.ts

import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  template: '<img class="loading" src="/assets/images/raptor-loading.gif">',
  styles: [`
    .loading { 
      display: block; 
      margin: 30px auto; }
  `]
})
export class LoadingComponent { }
```

It's possible to keep everything we need in the component without external template or style files. Instead of using `templateUrl` we'll use `template`. The template consists of an image tag with our `raptor-loading.gif` file. Instead of `styleUrls`, we can use a `styles` array and add CSS rulesets right in the component. We'll use an [ES6 template string literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) (in backticks) to maintain readability.

### Add Loading Component to App Module

In order to use our new component in our app, we need to add it to our `app.module.ts`:

```typescript
// ng2-dinos/src/app/app.module.ts

...
import { LoadingComponent } from './core/ui/loading.component';
...

@NgModule({
  declarations: [
	...
    LoadingComponent,
    ...
  ],
  ...
})
export class AppModule { }
```

We'll import the `LoadingComponent` class and then add it to the `declarations` array. Now we can use the `<app-loading>` element in other components.

## Add Loading Component to Home Component

The Angular 1 ng1-dinos app shows the loading directive in the home and detail views.

### Implement Loading Functionality in Home Component TypeScript

In `home.component.ts`, let's add the functionality we need to conditionally add our new loading component:

```typescript
// ng2-dinos/src/app/pages/home/home.component.ts

...

export class HomeComponent implements OnInit {
  ...
  loading: boolean;
  
  constructor(...) { }

  getDinos() {
    this.dinosService.getAllDinos$()
      .subscribe(
        res => {
          ...
          this.loading = false;
        },
        err => {
          ...
          this.loading = false;
        }
      );
  }

  ngOnInit() {
    ...
    this.loading = true;
    this.getDinos();
  }
  
  ...

  get isLoaded() {
    return this.loading === false;
  }

}
```

We'll add a boolean `loading` property to track loading state. Loading should be turned off when the API responds either with a success or a failure; we don't want to get stuck in an infinite loading state. We'll add `this.loading = false` in both the `onNext` and `onError` subscription functions.

> **Note:** This differs from our implemention in the Angular 1 app: [ng1-dinos used the promise method `.finally()`](https://github.com/auth0-blog/ng1-dinos/blob/master/src/app/pages/home/Home.ctrl.js). When [subscribing to observables](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/subscribe.md), the `onCompleted` function is only executed upon graceful termination of the observable sequence. Unlike `finally()` with promises, it will not run if an exception occurs. 

To initiate the loading state, we'll set the `loading` property to `true` in the `ngOnInit()` lifecycle hook.

Finally, we need a getter method `get isLoaded()` to tell the template when loading has completed. Angular 1 ng1-dinos implemented this expression in the template, but the [Angular 2 docs recommend moving this kind of logic to the component](https://angular.io/docs/ts/latest/guide/template-syntax.html#!#simplicity).

### Implement Loading Functionality in Home Component Template

Now we need to implement our loading component and some template logic in the home markup `home.component.html`:

{% highlight html %}
{% raw %}
<!-- ng2-dinos/src/app/pages/home/home.component.html -->

<article id="content-wrapper" class="content-wrapper">
  <h2 class="content-heading">{{pageName}}</h2>

  <app-loading *ngIf="loading"></app-loading>

  <div *ngIf="isLoaded">
    
    <!-- Search dinosaurs -->
    ...
    
    <!-- Dinosaurs -->
    ...
    
    <!-- No search results -->
    ...

    <!-- Error -->
    ...
  </div>

</article>
{% endraw %}
{% endhighlight %}

We'll add and remove the loading component with `<app-loading *ngIf="loading">`. We'll also add a container around the rest of the page content and only stamp it if the `isLoaded` getter is true.

When our app home component is loading, it now looks like this:

![Angular 2 app migration loading state](https://cdn.auth0.com/blog/ng1-to-ng2/loading.jpg)

The animated gif shows a running raptor until loading is completed.

## Add Loading Component to Detail Component

Now we'll make similar changes to the detail component to add the loading state. 

### Implement Loading Functionality in Detail Component TypeScript

Let's open our `detail.component.ts` file:

```typescript
// ng2-dinos/src/app/pages/detail/detail.component.ts

...

export class DetailComponent implements OnInit {
  ...
  loading: boolean;

  constructor(...) { }

  getDino() {
    ...
      this.dinosService.getDino$(id)
        .subscribe(
          res => {
            ...
            this.loading = false;
          },
          err => {
            ...
            this.loading = false;
          }
        );
    ...
  }

  ngOnInit() {
    this.loading = true;
    this.getDino();
  }

  get isLoaded() {
    return this.loading === false;
  }

}
```

We'll make the same changes to our detail component as the home component. We want to add a boolean `loading` property that is `true` on initialization and `false` `onNext` and `onError`. A `get isLoaded()` getter compares the loading state to check if it's been set to `false` and will be used to stamp content in the template.

### Implement Loading Functionality in Detail Component Template

Open `detail.component.html`:

{% highlight html %}
{% raw %}
<!-- ng2-dinos/src/app/pages/detail/detail.component.html -->

<article id="content-wrapper" class="content-wrapper">

  <app-loading *ngIf="loading"></app-loading>

  <div *ngIf="isLoaded">
    
    <!-- Dinosaur details -->
    ...

    <!-- Error -->
    ...
  </div>

</article>
{% endraw %}
{% endhighlight %}

Let's add the `<app-loading>` element and a wrapper to hide the content while loading is in progress. Now the loading gif should show while we retrieve API data for a dinosaur's detail information.

### Remove "Loading..." Text from Index HTML

Finally, we're going to remove the `Loading...` text from our `index.html` file's `<app-root>` element. This is the last thing we'll do to make our Angular 2 migration feature-match our Angular 1 ng1-dinos app:

{% highlight html %}
<!-- ng2-dinos/src/index.html -->

...
<body>
  <app-root></app-root>
</body>
...
{% endhighlight %}

## Completed Migration From Angular 1 to Angular 2

The migration of our [Angular 1 ng1-dinos app](https://github.com/auth0-blog/ng1-dinos) to [Angular 2 ng2-dinos](https://github.com/auth0-blog/ng2-dinos) is now complete! If you have both apps running, they should be functionally equivalent from a user's perspective. Please explore the two apps in the browser to make sure that our migration was successful.

## Aside: Refactoring Suggestions

Here are my refactoring suggestions from part three of our migration tutorial:

* As with [Part 2](http://auth0.com/blog/migrating-an-angular-1-app-to-angular-2-part-2), you may want to consider using additional `@NgModule`s to manage dependencies. Modules can make dependency management easier. Read the [Angular Modules docs](https://angular.io/docs/ts/latest/guide/ngmodule.html) and [Use @NgModule to Manage Dependencies in your Angular 2 Apps](https://auth0.com/blog/angular-2-ngmodules/) to learn more.
* You could potentially abstract the template API error markup into its own component. The error message is currently different between the home and detail page components, but you could use data binding to pass a custom string into the component each time it's utilized. This might help with scalability if additional API calls will be made in new components in the future.

## Aside: Authenticating an Angular 2 App with Auth0 Lock

Now we're going to go beyond our migration and explore authenticating our Angular 2 ng2-dinos app with [Auth0](https://auth0.com)! We'll implement [Auth0's Lock widget](https://auth0.com/lock/) to manage user identity. The completed code for implementing Auth0 Lock with ng2-dinos is available in the [ng2-dinos authentication-with-auth0 branch on GitHub](https://github.com/auth0-blog/ng2-dinos/tree/authentication-with-auth0). 

![Auth0 Lock implemented in Angular 2 app](https://cdn.auth0.com/blog/ng1-to-ng2/ng2-dinos-auth0.jpg)

### Configure Your Auth0 Client

The first thing you'll need is an Auth0 account. Follow these simple steps to get started:

1. Sign up for a [free Auth0 account](javascript:signup\(\)).
2. In your **Auth0 Dashboard**, [create a new client](https://manage.auth0.com/#/clients/create). 
3. Name your new app and select "Single Page Web Applications". 
4. In the **Settings** for your newly created app, add `http://localhost:4200` to the Allowed Callback URLs and Allowed Origins (CORS).
5. If you'd like, you can [set up some social connections](https://manage.auth0.com/#/connections/social). You can then enable them for your app in the **Client** options under the **Connections** tab. The example shown in the screenshot above utilizes username/password database, Facebook, Google, and Twitter.

### Setup and Dependencies

First we'll add the Auth0 Lock CDN link to our `index.html` file. We're using version 10.11 for our tutorial:

{% highlight html %}
<!-- ng2-dinos/src/index.html -->

...
  <!-- Auth0 Lock widget -->
  <script src="https://cdn.auth0.com/js/lock/10.11/lock.min.js"></script>
</head>
...
{% endhighlight %}

Next we need the [`angular2-jwt` helper library](https://github.com/auth0/angular2-jwt). Install this with npm:

```bash
npm install angular2-jwt --save
```

### Create an Authentication Service

We need an Angular 2 service to implement login functionality and authentication methods. We can use the CLI to generate the boilerplate in the `ng2-dinos/src/app/core/` folder:

```bash
$ ng g service core/auth
```

Open the new `auth.service.ts` file and add the following code. We'll go over this in detail below:

```typescript
// ng2-dinos/src/app/core/auth.service.ts

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';

// Avoid name not found warnings
declare var Auth0Lock: any;
declare var localStorage: any;
declare var window: any;

@Injectable()
export class AuthService {
  lock = new Auth0Lock('[YOUR_AUTH0_CLIENT_ID]', '[YOUR_AUTH0_CLIENT_DOMAIN]', {
    auth: {
      redirectUrl: 'http://localhost:4200',
      responseType: 'token'
    }
  });
  userProfile: Object;
  loginRedirect: string;

  constructor(private router: Router) {
    this.userProfile = JSON.parse(localStorage.getItem('profile'));
    this.loginRedirect = localStorage.getItem('login_redirect');

    // Add callback for lock 'hash_parsed' event
    // hash_parsed is needed because we're redirecting
    this.lock.on('hash_parsed', (authResult) => {
      if (authResult && authResult.idToken) {
        // Successful authentication result
        localStorage.setItem('id_token', authResult.idToken);

        // Get user profile
        this.lock.getProfile(authResult.idToken, (error, profile) => {
          if (error) {
            throw Error('There was an error retrieving profile data.');
          }

          localStorage.setItem('profile', JSON.stringify(profile));
          this.userProfile = profile;

          // Redirect on successful login
          if (this.loginRedirect) {
            this.router.navigate([this.loginRedirect]);
            localStorage.removeItem('login_redirect');
            this.loginRedirect = undefined;
          }
        });
      } else if (authResult && !authResult.idToken) {
        // Authentication failed
        throw Error(`There was an error authenticating: ${authResult}`);
      }
    });
  }

  login() {
    // Call the show method to display the Lock widget
    this.lock.show();
    // Store the redirect location when opening the login box
    localStorage.setItem('login_redirect', window.location.pathname);
  }

  logout() {
    // Remove token and profile
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
    this.userProfile = undefined;
  }

  get authenticated() {
    // Check if there's an unexpired JWT
    // This searches for an item in localStorage with key == 'id_token'
    return tokenNotExpired();
  }

}
```

As always, first we'll talk about the imports. `Injectable` is necessary for any injectable service and is provided by the boilerplate. We'll want to use `Router` to redirect the authenticated user back to the route they logged in from. We also need `tokenNotExpired` from `angular2-jwt` to get a user's authentication state.

In order to avoid TypeScript name not found warnings, we'll declare type annotations for `Auth0Lock`, `localStorage`, and `window`.

Then we'll create a new lock instance:

```typescript
lock = new Auth0Lock('[YOUR_AUTH0_CLIENT_ID]', '[YOUR_AUTH0_CLIENT_DOMAIN]', {
  auth: {
    redirectUrl: 'http://localhost:4200',
    responseType: 'token'
  }
});
```

Replace `[YOUR_AUTH0_CLIENT_ID]` with your Auth0 client ID and  `[YOUR_AUTH0_CLIENT_DOMAIN]` with your Auth0 domain. These can both be found in your [Auth0 dashboard](https://manage.auth0.com/#/clients) client settings. Upon successful login, we'll redirect back to the app root so dynamic redirection can then take over.

Next we'll create a couple of properties to store data. We need to set the `userProfile` object locally after fetching it. We also want to be able to dynamically redirect the user back to the route they logged in from so we'll implement a `loginRedirect` string property.

> **Note:** We want our login button to be in the global menu so users can sign in from anywhere in our app. If we didn't dynamically redirect them after authentication, we'd have to enter every possible app route in our Auth0 dashboard Allowed Callback URLs. Clearly this would _not_ be ideal. This tutorial will show you a method to easily manage dynamic redirection.

Now we'll add some functionality to the constructor function. Make `Router` available. Then we'll check local storage for existing data. If the user's profile is available, let's set it. If `login_redirect` is already in local storage (ie., the user has just authenticated and is now redirected back to the app), we'll retrieve and set that as well.

Next we need to implement a `hash_parsed` [Lock event callback](https://auth0.com/docs/libraries/lock/v10/api#on-event-callback-):

```typescript
this.lock.on('hash_parsed', (authResult) => { ... });
```

We need to use this low level event because the `authenticated` and `authorization_error` events aren't fired when using the `redirectUrl` option with Lock. Every time a new `Auth0Lock` object is initialized in redirect mode, a URL hash parse attempt is made. A successful login will return a result with a token. A failure will return an error. No hash present will return `null`. We can handle these cases in our `hash_parsed` event callback.

On a successful authentication, we'll do the following:

* Save the ID token to local storage
* Use the token to [get the user's profile](https://auth0.com/docs/libraries/lock/v10/api#getprofile-token-callback-)
* Save the profile to local storage and set our `userProfile` property
* Redirect the user to the page they logged in from

If authentication failed, we'll throw an error. If there was no hash (`null` result) when the hash parse attempt was made, we'll do nothing.

We're handling what happens when a user authenticates in the constructor, and now we need a `login()` method. This will be called when the user clicks the "Log In" button. We'll [`show` the Lock widget](https://auth0.com/docs/libraries/lock/v10/api#show-options-) and save the user's current location to local storage so we can retrieve it to redirect them upon authentication.

We also need a `logout()` method. This will simply remove the user's token and profile.

Finally, we'll implement a way to check the current authentication state of the user. We can use a getter `get authenticated()` that returns the [`angular2-jwt` method `tokenNotExpired()`](https://github.com/auth0/angular2-jwt#checking-authentication-to-hideshow-elements-and-handle-routing).

Our authentication service is now ready for use! We'll provide it at the app level in `app.module.ts`:

```typescript
// ng2-dinos/src/app/app.module.ts

...
import { AuthService } from './core/auth.service';
...

@NgModule({
  ...
  providers: [
    ...
    AuthService
  ],
  ...
})
export class AppModule { }
```

Now let's implement the template functionality so users can log in and out.

### Add Login to Header Component

Let's add a login button in the menu area. When we're done with this step and the user is logged out, our navigation should look like this:

![Log in Auth0 Angular 2 app](https://cdn.auth0.com/blog/ng1-to-ng2/ng2-dinos-log-in.jpg)

We want to be able to use methods from the `AuthService` in our header template so let's open `header.component.ts`, inject `AuthService`, and make it available in the constructor:

```typescript
// ng2-dinos/src/app/header/header.component.ts

...
import { AuthService } from '../core/auth.service';
...
constructor(..., private auth: AuthService) { }
...
```

Now we have access to `AuthService` methods in our `header.component.html` template. We can call them using `auth.[method_name]`. Let's add the login button:

{% highlight html %}
<!-- ng2-dinos/src/app/header/header.component.html -->

...
  <nav id="nav" class="nav" role="navigation">
    <ul class="nav-list">...</ul>

    <section class="authWrapper">
      <!-- Logged out -->
      <a
        class="btn btn-primary"
        (click)="auth.login()"
        *ngIf="!auth.authenticated">Log In</a>
    </section>

  </nav>
...
{% endhighlight %}

Below the navigation list element, we'll add a `<section class="authWrapper">` to contain anything having to do with login/logout. We'll add a login button with a `(click)` handler that executes the `auth.login()` method. We'll show this button with `*ngIf` if the user is not authenticated.

Open the `header.component.scss` file and let's add a margin to our `.authWrapper` element:

```scss
/* ng2-dinos/src/app/header/header.component.scss */

...
.authWrapper {
  margin: 6px;
}
```

Users can now log in!

### Add Greeting and Logout to Header Component

When a user is authenticated, we want to display a greeting and a logout button in the navigation instead of the login button:

![Log out Auth0 Angular 2 app](https://cdn.auth0.com/blog/ng1-to-ng2/ng2-dinos-authenticated.jpg)

We can add this to our `header.component.html` template like so:

{% highlight html %}
{% raw %}
<!-- ng2-dinos/src/app/header/header.component.html -->

...
    <section class="authWrapper">
      <!-- Logged out -->
      ...

      <!-- Logged in -->
      <div class="alert alert-info text-center" *ngIf="auth.authenticated">
        <p *ngIf="auth.userProfile">Hello, {{auth.userProfile.name}}!</p>

        <a
          class="btn btn-danger"
          (click)="auth.logout()"
          >Log Out</a>
      </div>
    </section>
...
{% endraw %}
{% endhighlight %}

If the user is authenticated, we'll show an info alert box greeting them by name. A logout button will be provided with a `(click)` handler calling the `auth.logout()` method.

Open the `header.component.scss` file and add one simple style to the `<p>` tag in the alert to add some margin:

```scss
/* ng2-dinos/src/app/header/header.component.scss */

...
.authWrapper {
  margin: 6px;

  .alert p {
    margin-bottom: 10px;
  }
}
```

We now have authentication in our Angular 2 ng2-dinos app!

### Next Steps

With Auth0 user authentication in place, we can do things like  authorize route access and call protected APIs with authenticated HTTP requests. To learn about how to implement this kind of functionality, check out these resources:

* [Angular 2 Auth0 Quickstart: Authorization](https://auth0.com/docs/quickstart/spa/angular2/07-authorization)
* [Angular 2 Auth0 Quickstart: Calling APIs](https://auth0.com/docs/quickstart/spa/angular2/08-calling-apis)
* [Angular 2 Authentication Tutorial](https://auth0.com/blog/angular-2-authentication/)
* [angular2-jwt Documentation](https://github.com/auth0/angular2-jwt)
* [express-jwt Node JWT middleware](https://github.com/auth0/express-jwt)

## Conclusion

Our ng2-dinos app is complete! Make sure you've run `$ ng lint` and corrected any issues. With clean code, we shouldn't have any errors. We've successfully migrated the dinosaur detail pages and implemented a simple loading state. We've even covered adding authentication with Auth0 so we can authorize routes or make secure API calls in the future. 

Hopefully you're now ready to dive into Angular migrations as well as new Angular 2 projects with confidence!