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
  image: https://cdn.auth0.com/blog/angular/logo3.png
  bg_color: "#012C6C"
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
  <strong>Check out the Real-World Angular Series to learn how to build and deploy a full-featured MEAN stack application</strong>, from ideation to production! Start the series here: <a href="https://auth0.com/blog/real-world-angular-series-part-1">Real-World Angular Series - Part 1: MEAN Setup and Angular Architecture</a>.
</div>

<div class="alert alert-info alert-icon">
  <i class="icon-budicon-487"></i>
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
* Aside: user and API authentication with Auth0 and JSON Web Tokens

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
      .catch(this.handleError);
  }
...

```

We'll import the `DinoDetail` model we just created. Then we'll create an HTTP observable that accepts an `id: number` as a parameter. The observable has a type annotation of `Observable<DinoDetail>`. The ID parameter is passed to the `GET` request. The handlers we set up in [Part 2](http://auth0.com/blog/migrating-an-angular-1-app-to-angular-2-part-2) are then used for successes and errors. The `catch` operator will generate an observable that terminates with an error.

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

The loading component will be one flat file, so we'll add some flags to the CLI to generate it:

```bash
ng g component core/ui/loading --it --is --flat
```

The `--it` flag is shorthand for `inline-template`. The `--is` is shorthand for `inline-styles`, and `--flat` indicates a containing folder should not be generated. 

> **Note:** You can also add `--no-spec` when generating CLI files if you don't want test files.

Open the new `loading.component.ts`:

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
* Access token, ID token, profile, and token expiration are stored in local storage and removed upon logout

### Sign Up for Auth0

You'll need an [Auth0](https://auth0.com) account to manage authentication. You can sign up for a <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">free account here</a>. Next, set up an Auth0 client app and API so Auth0 can interface with an Angular app and Node API.

### Set Up a Client App

1. Go to your [**Auth0 Dashboard**](https://manage.auth0.com/#/) and click the "[create a new client](https://manage.auth0.com/#/clients/create)" button.
2. Name your new app and select "Single Page Web Applications".
3. In the **Settings** for your new Auth0 client app, add `http://localhost:4200/callback` to the **Allowed Callback URLs** and `http://localhost:4200` to the **Allowed Origins (CORS)**.
4. Scroll down to the bottom of the **Settings** section and click "Show Advanced Settings". Choose the **OAuth** tab and set the **JsonWebToken Signature Algorithm** to `RS256`.
5. If you'd like, you can [set up some social connections](https://manage.auth0.com/#/connections/social). You can then enable them for your app in the **Client** options under the **Connections** tab. The example shown in the screenshot above utilizes username/password database, Facebook, Google, and Twitter. For production, make sure you set up your own social keys and do not leave social connections set to use Auth0 dev keys.

### Set Up an API

1. Go to [**APIs**](https://manage.auth0.com/#/apis) in your Auth0 dashboard and click on the "Create API" button. Enter a name for the API. Set the **Identifier** to your API endpoint URL. In this example, this is `http://localhost:3001/api/`. The **Signing Algorithm** should be `RS256`.
2. You can consult the Node.js example under the **Quick Start** tab in your new API's settings. We'll implement our Node API in this fashion, using [Express](https://expressjs.com/), [express-jwt](https://github.com/auth0/express-jwt), and [jwks-rsa](https://github.com/auth0/node-jwks-rsa).

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
var CLIENT_DOMAIN = '[CLIENT_DOMAIN]'; // e.g., youraccount.auth0.com
var AUTH0_AUDIENCE = '[AUTH0_API_AUDIENCE]'; // http://localhost:3001/api in this example

var jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${CLIENT_DOMAIN}/.well-known/jwks.json`
    }),
    aud: AUTH0_AUDIENCE,
    issuer: `https://${CLIENT_DOMAIN}/`,
    algorithm: 'RS256'
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
  CLIENT_DOMAIN: '[CLIENT_DOMAIN]',
  ...
```

Our app and API are now set up. They can be served by running `ng serve` from the root folder and `node server.js` from the `/server` folder.

With the Node API and Angular app running, let's take a look at how authentication is implemented.

### Authentication Service

Authentication logic on the front end is handled with an `AuthService` authentication service: [`src/app/auth/auth.service.ts` file](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/auth/auth.service.ts).

```js
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as auth0 from 'auth0-js';
import { AUTH_CONFIG } from './auth0-variables';
import { UserProfile } from './profile.model';

@Injectable()
export class AuthService {
  // Create Auth0 web auth instance
  // @TODO: Update AUTH_CONFIG and remove .example extension in src/app/auth/auth0-variables.ts.example
  auth0 = new auth0.WebAuth({
    clientID: AUTH_CONFIG.CLIENT_ID,
    domain: AUTH_CONFIG.CLIENT_DOMAIN,
    responseType: 'token id_token',
    redirectUri: AUTH_CONFIG.REDIRECT,
    audience: AUTH_CONFIG.AUDIENCE,
    scope: AUTH_CONFIG.SCOPE
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
    this.auth0.authorize();
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
    localStorage.setItem('expires_at', authResult.expiresAt);
    this.userProfile = profile;
    this.setLoggedIn(true);
  }

  logout() {
    // Remove tokens and profile and update login status subject
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
    localStorage.removeItem('expires_at');
    this.userProfile = undefined;
    this.setLoggedIn(false);
  }

  get authenticated(): boolean {
    // Check if current time is past access token's expiration
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return Date.now() < expiresAt;
  }

}
```

This service uses the config variables from `auth0-variables.ts` to instantiate an `auth0.js` WebAuth instance.

An [RxJS `BehaviorSubject`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/subjects/behaviorsubject.md) is used to provide a stream of authentication status events that you can subscribe to anywhere in the app.

The `login()` method authorizes the authentication request with Auth0 using your config variables. An Auth0 hosted Lock instance will be shown to the user and they can then log in.

> **Note:** If it's the user's first visit to our app _and_ our callback is on `localhost`, they'll also be presented with a consent screen where they can grant access to our API. A first party client on a non-localhost domain would be highly trusted, so the consent dialog would not be presented in this case. You can modify this by editing your [Auth0 Dashboard API](https://manage.auth0.com/#/apis) **Settings**. Look for the "Allow Skipping User Consent" toggle.

We'll receive an `id_token`, `access_token`, and `expires_at` in the hash from Auth0 when returning to our app. The `handleAuth()` method uses Auth0's `parseHash()` method callback to get the user's profile (`_getProfile()`) and set the session (`_setSession()`) by saving the tokens, profile, and token expiration to local storage and updating the `loggedIn$` subject so that any subscribed components in the app are informed that the user is now authenticated.

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

Finally, we have a `logout()` method that clears data from local storage and updates the `loggedIn$` subject. We also have an `authenticated` accessor to return current authentication status.

Once [`AuthService` is provided in `app.module.ts`](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/app.module.ts#L32), its methods and properties can be used anywhere in our app, such as the [home component](https://github.com/auth0-blog/angular-auth0-aside/tree/master/src/app/home).

The [callback component](https://github.com/auth0-blog/angular-auth0-aside/tree/master/src/app/callback) is where the app is redirected after authentication. This component simply shows a loading message until hash parsing is completed and the Angular app redirects back to the home page.

### Making Authenticated API Requests

In order to make authenticated HTTP requests, we need to add a `Authorization` header with the access token in our [`api.service.ts` file](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/api.service.ts).

```js
// src/app/api.service.ts
...
  getDragons$(): Observable<any[]> {
    return this.http
      .get(`${this.baseUrl}dragons`, {
        headers: new HttpHeaders().set(
          'Authorization', `Bearer ${localStorage.getItem('access_token')}`
        )
      })
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

Our ng2-dinos app is complete! Make sure you've run `ng lint` and corrected any issues. With clean code, we shouldn't have any errors. We've successfully migrated the dinosaur detail pages and implemented a simple loading state.

Hopefully you're now ready to dive into Angular migrations as well as new Angular 2 projects with confidence!
