---
layout: post
title: "Migrating an AngularJS App to Angular - Part 2"
description: "Learn how to migrate real-world features of an AngularJS 1 application to a fresh Angular 2+ build (Part 2): routing, API, and filtering."
date: 2016-11-09 8:30
category: Technical Guide, Angular, Migration
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
- angular2
- angular
- migrate
related:
- 2016-11-07-migrating-an-angular-1-app-to-angular-2-part-1
- 2016-11-14-migrating-an-angular-1-app-to-angular-2-part-3
---

<div class="alert alert-info alert-icon">
  <i class="icon-budicon-664"></i>
  <strong>Check out the Real-World Angular Series to learn how to build and deploy a full-featured MEAN stack application</strong>, from ideation to production! Start the series here: <a href="https://auth0.com/blog/real-world-angular-series-part-1">Real-World Angular Series - Part 1: MEAN Setup and Angular Architecture</a>.
</div>

<div class="alert alert-info alert-icon">
  <i class="icon-budicon-487"></i>
  The <a href="http://angularjs.blogspot.com/2017/01/branding-guidelines-for-angular-and.html">Branding Guidelines for Angular</a> state that version 1.x should be referred to as <em>AngularJS</em>, whereas all releases from version 2 and up are named <em>Angular</em>. This migration article will continue to use "Angular 1" to refer to AngularJS (1.x) and "Angular 2" to refer to Angular (2 and up) in order to clearly differentiate the frameworks and reduce confusion.
</div>

**TL;DR:** Many AngularJS 1.x developers are interested in Angular 2, but the major differences between versions 1 and 2 are daunting when we have so many Angular 1 apps already in production or maintenance. In the [first part of this tutorial](http://auth0.com/blog/migrating-an-angular-1-app-to-angular-2-part-1) we set up our Angular 2 app and migrated the basic architecture. This time we'll implement some real-world features like routing, calling an API, and more. The final code for our Angular 2 app can be cloned from the [ng2-dinos GitHub repo](https://github.com/auth0-blog/ng2-dinos).

---

## Recap and Introduction to Part 2

In [Migrating an Angular 1 App to Angular 2 - Part 1](http://auth0.com/blog/migrating-an-angular-1-app-to-angular-2-part-1) we introduced the Angular 1 [**ng1-dinos**](https://github.com/auth0-blog/ng1-dinos) Single Page Application and began migrating it to Angular 2 [**ng2-dinos**](https://github.com/auth0-blog/ng2-dinos). So far we've migrated global styles, custom off-canvas navigation, header, and footer. This part of this tutorial will cover:

* Page components and routing
* Using a service to call the [sample-nodeserver-dinos](https://github.com/auth0-blog/sample-nodeserver-dinos) API
* Displaying all dinosaurs in a list view
* Filtering dinosaurs by query

> **Note:** Remember that we're migrating an Angular 1 app to Angular 2 with a _fresh build_. We're not _upgrading_ the original Angular 1 codebase.

## Setup and Dependencies

Part 2 has the same dependencies as [Part 1](http://auth0.com/blog/migrating-an-angular-1-app-to-angular-2-part-1) of our tutorial, so make sure you have:

* [NodeJS with npm](https://nodejs.org)
* [sample-nodeserver-dinos](https://github.com/auth0-blog/sample-nodeserver-dinos) local API for both Angular 1 and 2 apps
* [Gulp](http://gulpjs.com) (for building and serving ng1-dinos)
* [ng1-dinos](https://github.com/auth0-blog/ng1-dinos) project cloned and available for reference
* [Angular CLI](https://github.com/angular/angular-cli) (for developing, serving, and building ng2-dinos)
* Your ng2-dinos project so far from [Part 1](http://auth0.com/blog/migrating-an-angular-1-app-to-angular-2-part-1) (the code-complete [ng2-dinos GitHub repo](https://github.com/auth0-blog/ng2-dinos) is also available)

We'll pick up right where we left off. 

## Migrating Angular 2 Pages

In [Part 1](http://auth0.com/blog/migrating-an-angular-1-app-to-angular-2-part-1), we implemented some links in our navigation, but we don't have pages to display when the links are clicked. Let's create some components so we can implement routing.

### Create Home, About, and 404 Page Components

In order to implement routing, the first thing we need is multiple pages. Let's quickly create home, about, and 404  components. These will be pages so create a subdirectory in the `ng2-dinos/src/app/` folder called `pages`. Stop the server and execute the following commands:

* Home page component: `$ ng g component pages/home`
* About page component: `$ ng g component pages/about`
* 404 page component: `$ ng g component pages/error404`

### Add Title Provider to App Module

We want to update the document `<title>` tag for each page. Recall that `<title>` is outside the `<app-root>` element in the document `<head>`, but Angular 2 provides a useful service to set the title.

We want the `Title` service to be registered in the root injector so it's available to the entire application. Let's add it to our `app.module.ts`:

```typescript
// ng2-dinos/src/app/app.module.ts

import { BrowserModule, Title } from '@angular/platform-browser';
...

@NgModule({
  ...
  providers: [
    Title
  ]
})
export class AppModule { }
```

To learn more about this, read the Angular 2 docs on [Dependency Injection](https://angular.io/docs/ts/latest/guide/dependency-injection.html).

### Add Title to Page Components

The page components should each display a heading and update the `<title>` with the `Title` service we provided in the step above. Let's implement this in each of our new page components. We _don't_ have to provide `Title` at the component level (`@Component({ providers: [Title]...`)  because we're providing it at an application level in `app.module.ts` (above).

Open the `home.component.ts` file and make the following changes:

```typescript
// ng2-dinos/src/app/pages/home/home.component.ts

import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  pageName = 'Dinosaurs';

  constructor(private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle(this.pageName);
  }

}
```

First we'll import the `Title` class from `@angular/platform-browser`. In our `HomeComponent` class, we'll create a `pageName` property and set it to "Dinosaurs". Then we'll add the `private titleService: Title` to our constructor function. In our `ngOnInit()` function, we'll set the title to the `pageName`. You can consult the Angular 2 docs to [learn more about the Title service](https://angular.io/docs/ts/latest/cookbook/set-document-title.html).

Now let's do the same for the about and 404 components: `about.component.ts` and `error404.component.ts`. We'll also _delete_ the `about.component.scss` and `error404.component.scss` files and any references to them. The about and 404 components will be plain pages with some static copy. We can use Bootstrap classes to style both and don't need componetized SCSS.

Now open the about component `about.component.ts`:

```typescript
// ng2-dinos/src/app/pages/about/about.component.ts

import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html'
})
export class AboutComponent implements OnInit {
  pageName = 'About';

  constructor(private titleService: Title) { }

  ngOnInit() { 
    this.titleService.setTitle(this.pageName);
  }

}
```

Finally we'll update the error404 component `error404.component.ts`:

```typescript
// ng2-dinos/src/app/pages/error404/error404.component.ts

import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-error404',
  templateUrl: './error404.component.html'
})
export class Error404Component implements OnInit {
  pageName = '404 Page Not Found';

  constructor(private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle(this.pageName);
  }

}
```

### Home Component Template

Now we have a document title but we also want to display `pageName` in a heading in our HTML. Let's write some basic markup.

In the `home.component.html` file, add an `<article>` and a heading with an interpolated binding to display `pageName`. 

{% highlight html %}
{% raw %}
<!-- ng2-dinos/src/app/pages/home/home.component.html -->

<article id="content-wrapper" class="content-wrapper">
  <h2 class="content-heading">{{pageName}}</h2>

</article>
{% endraw %}
{% endhighlight %}

We'll add a lot more to this component later.

### About Component Template

Let's add some basic information about our app in the `about.component.html` template:

{% highlight html %}
{% raw %}
<!-- ng2-dinos/src/app/pages/about/about.component.html -->

<article id="content-wrapper" class="content-wrapper lead">
  <h2 class="content-heading">{{pageName}}</h2>
  
  <p><strong>ng2-dinos</strong> is a sample application built with Angular 2 with the following features:</p>

  <ul>
    <li>Routing</li>
    <li>Dynamic <code>&lt;title&gt;</code> metadata</li>
    <li>External <code>GET</code> API</li>
    <li>Custom off-canvas navigation</li>
    <li>Filtering by predicate</li>
    <li>Bootstrap</li>
    <li>SCSS</li>
    <li>Angular CLI (Webpack) build</li>
  </ul>

  <p>Download the code for this app from the <a ng-href="http://github.com/auth0-blog/ng2-dinos">ng2-dinos GitHub repo</a>. The API can be downloaded from the <a ng-href="http://github.com/auth0-blog/sample-nodeserver-dinos">sample-nodeserver-dinos repo</a>. The purpose of this project is to demonstrate an AngularJS 1.x app (<em>without</em> backported v2 features) "migration"/translation to Angular 2.</p>
</article>
{% endraw %}
{% endhighlight %}

### 404 Component Template

This component will show when the route the user attempts to access does not exist. We'll apply a couple of Bootstrap classes in the `error404.component.html` template:

{% highlight html %}
{% raw %}
<!-- ng2-dinos/src/app/pages/error404/error404.component.html -->

<article id="content-wrapper" class="content-wrapper">
  <h2 class="content-heading text-danger">{{pageName}}</h2>
  
  <p class="lead">The page you are attempting to access does not exist.</p>
</article>
{% endraw %}
{% endhighlight %}

> **Note:** Our Angular 1 ng1-dinos app had classes like `.home-wrapper` and `.about-wrapper` on the article elements but Angular 2's view encapsulation negates the need for this!

## Migrating Angular 1 Routing to Angular 2

Routing is an essential feature of our ng1-dinos app. For ng2-dinos, we're going to create a new `@NgModule` to handle routing. This gives us more flexibility to expand routing later, if needed, without bloating the `app.module.ts`.

### Create a Routing Module

Because of how the CLI generates multiple files per component in its own subdirectory, sometimes it's more straightforward to create a new feature manually. Regardless, we should know how to do this. Let's create a routing module in the `ng2-dinos/src/app/core/` folder. We'll name this file `app-routing.module.ts`:

```typescript
// ng2-dinos/src/app/core/app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HomeComponent } from '../pages/home/home.component';
import { AboutComponent } from '../pages/about/about.component';
import { Error404Component } from '../pages/error404/error404.component';

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'about',
        component: AboutComponent
      },
      {
        path: '**',
        component: Error404Component
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
```

At its heart, this doesn't look much different from the Angular 1 route config at [`ng1-dinos/src/app/core/app.config.js`](https://github.com/auth0-blog/ng1-dinos/blob/master/src/app/core/app.config.js). We declare a path and a component that should display when routed to that path. We need to import the `RouterModule` as well as any components we want to use. The wildcard path `**` should be the last one.

> **Note:** You can read more about [routing in the Angular 2 docs](https://angular.io/docs/ts/latest/guide/router.html). At time of writing, the docs are the most reliable source of information on the Angular 2 router. When searching for blog articles or Stack Overflow answers, be mindful of publish dates and versioning: the Angular 2 router was one of the last pieces to reach completion and has undergone rewrites and breaking changes throughout the beta and release candidate phases.

Let's take a quick break to verify our `ng2-dinos/src/app` file structure:

```text
ng2-dinos
  |-src/
    |-app/
      |-core/
        |-app.component[.html|.scss|.ts]
        |-app-routing.module.ts
      |-header/
        |-_nav.scss
        |-header.component[.html|.scss|.ts]
      |-footer/
        |-footer.component[.html|.scss|.ts]
      |-pages/
        |-about/
          |-about.component[.html|.ts]
        |-error404/
          |-error404.component[.html|.ts]
        |-home/
          |-home.component[.html|.scss|.ts]
      |-app.module.ts
```

### Import Routing Module in App Module

We have a new module to handle routing but it isn't being imported anywhere in our app right now. We need to add it to our `app.module.ts`:

```typescript
// ng2-dinos/src/app/app.module.ts

...
import { AppRoutingModule } from './core/app-routing.module';
...

@NgModule({
  declarations: [
    ...
  ],
  imports: [
    ...,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Import the `AppRoutingModule` class and then add it to the `imports` array.

### Display Routed Components

Routing is now configured! Now we just need to display our routed components in the view. In Angular 1, this was done with the `ng-view` directive. In Angular 2, we'll add the `<router-outlet>` element where we want our page components to display in our `app.component.html` template:

{% highlight html %}
<!-- ng2-dinos/src/app/core/app.component.html -->

...
    <!-- CONTENT -->
    <div id="layout-view" class="layout-view">
    	<router-outlet></router-outlet>  
    </div>
...
{% endhighlight %}

If we serve and view the app in the browser, we should see the home component when we visit [http://localhost:4200](http://localhost:4200).

### Route Navigation

Right now, we don't have any live links to our routes. We still need to make some updates to the `header.component.html` to enable route navigation and active link highlighting.

Our Angular 1 [ng1-dinos app header controller](https://github.com/auth0-blog/ng1-dinos/blob/master/src/app/header/Header.ctrl.js) had to utilize a custom `navIsActive(path)` function to compare the URL path with the link `href` to apply an `active` class in the navigation markup. The Angular 2 router can do this for us!

Open the `header.component.html` file and let's make some changes to the first two links in the menu:

{% highlight html %}
{% raw %}
<!-- ng2-dinos/src/app/header/header.component.html -->

...
    <ul class="nav-list">
      <li>
        <a 
          routerLink="/"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: true }">Dinosaurs</a>
      </li>
      <li>
        <a routerLink="/about" routerLinkActive="active">About</a>
      </li>
      ...
{% endraw %}
{% endhighlight %}

In Angular 1, we used the `ng-href` directive. In Angular 2, we'll use the [routerLink directive](https://angular.io/docs/ts/latest/guide/router.html#!#router-link) instead. We can also add `routerLinkActive="[active-class-name]"` and Angular 2 will automatically apply our desired class to the link when that route is active.

> **Note:** The caveat is that this needs an additional option when dealing with the root URL. The [routerLinkActive directive](https://angular.io/docs/ts/latest/guide/router.html#!#router-link-active) returns a match if the `routerLink` is contained in the URL tree. This means that `routerLink="/"` is also matched by all other routes with a `/` in them. To enable exact matching, we need to add `[routerLinkActiveOptions]="{ exact: true }"` to our root link.

Now we should be able to click the links in the off-canvas menu and be routed appropriately with proper active link classes. Try it out.

### Router Events

You probably noticed that there's still one thing missing that ng1-dinos had: automatic navigation closing on route change. We definitely don't want to manually close the off-canvas menu every time we switch pages.

In ng1-dinos, we used `$scope.$on('$locationChangeStart', ...)` in the [`navControl` directive](https://github.com/auth0-blog/ng1-dinos/blob/master/src/app/core/ui/navControl.dir.js) to bind a handler and close the menu. Something similar exists in Angular 2, so let's implement it!

### Auto-close Menu in Header Component

We'll do this in our `header.component.ts` file where we emitted the event earlier to notify the app component parent. This way we can ensure that both components know about the change and the nav states don't get out of sync: 

```typescript
// ng2-dinos/src/app/header/header.component.ts

...
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  ...
  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events
      .filter(event => event instanceof NavigationStart && this.navOpen)
      .subscribe(event => this.toggleNav());
  }
  ...
```

We need to import `Router` and `NavigationStart` from `@angular/router`. Next we need to make `private router: Router` available in our constructor function.

[Router.events](https://angular.io/docs/ts/latest/api/router/index/Event-type-alias.html) is an observable of route events. We'll filter for when the event is an instance of `NavigationStart` and the navigation is open. We'll then subscribe to it to set `navOpen` to `false`.

Now when we click on links in the menu the correct component displays and the navigation closes. Our app homepage now looks like this:

![Migrating AngularJS app to Angular: Angular 2 single page application with routing](https://cdn.auth0.com/blog/ng1-to-ng2/part2-start.jpg)

## Calling an API in Angular 2

Now our architecture and navigation is in place! We've arrived at the business logic portion of our app. Angular 1 ng1-dinos used a [service to call the API: `ng1-dinos/src/app/core/Dinos.service.js`](https://github.com/auth0-blog/ng1-dinos/blob/master/src/app/core/Dinos.service.js).

We're going to author a service for this in our Angular 2 migration too. Let's start by creating the file. Use the following Angular CLI command to create a service boilerplate:

```bash
$ ng g service core/dinos
```

When we run this command, note the warning output informing us that the service was generated but not provided. We'll provide it at the component level this time instead of application-wide like we did with the `Title` service. This means we _won't_ put `DinosService` in the `app.module.ts`.

The purpose of `DinosService` is to call the API and get dinosaur information. To do this, we'll use HTTP observables. We also need to create TypeScript _models_ for our fetched data.

### Dinosaur API Data Model

Let's create a model for the data we're going to retrieve for the main listing of dinosaurs. In order to do this, we need to know the format of the API response. We can determine this simply by making an API request in the browser (and consulting the [sample-nodeserver-dinos API README](https://github.com/auth0-blog/sample-nodeserver-dinos)).

The API route we want to use is [http://localhost:3001/api/dinosaurs](http://localhost:3001/api/dinosaurs). Assuming you have the API running locally, let's access this route in the browser and look at the response:

> **Note:** You may want to install/enable a JSON formatting browser extension to view the response.

```js
// http://localhost:3001/api/dinosaurs

[
  {
    "id": 1,
    "name": "Allosaurus"
  },
  {
    "id": 2,
    "name": "Apatosaurus"
  },
  {
    "id": 3,
    "name": "Brachiosaurus"
  },
  ...
]
```

We can see that the response is an array of dinosaur objects. Each dinosaur has an `id` and a `name`. We can see the `id` is a number and the `name` is a string. Now we can create a model.

We'll have more than one model, so let's create a folder for models to keep our app scalable: `ng2-dinos/src/app/core/models/`. In this folder, we'll make our model file: `dino.model.ts`.

```typescript
export class Dino {
  constructor(
    public id: number,
    public name: string
  ) { }
}
```

### Add HTTP Client Module to App Module

Now we have the "shape" of a dinosaur defined. Let's work on getting the data from the API.

First we need to import the `HttpClientModule` in our `app.module.ts`:

```typescript
// ng2-dinos/src/app/app.module.ts

...
import { HttpClientModule } from '@angular/common/http';
...
@NgModule({
  ...,
  imports: [
    ...,
    HttpClientModule
  ],
  ...
```

Import `HttpClientModule` from `@angular/common/http` and then add it to the NgModule's `imports` array.

### Get API Data with Dinos Service

Next let's fetch the API data in our `dinos.service.ts`:

```typescript
// ng2-dinos/src/app/core/dinos.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';

import { Dino } from './models/dino.model';

@Injectable()
export class DinosService {
  private baseUrl = 'http://localhost:3001/api/';

  constructor(private http: HttpClient) { }

  getAllDinos$(): Observable<Dino[]> {
    return this.http
      .get(`${this.baseUrl}dinosaurs`)
      .catch(this.handleError);
  }

  private handleError(err: HttpErrorResponse | any) {
    let errorMsg = err.message || 'Unable to retrieve data';
    return Observable.throw(errorMsg);
  }

}
```

This is pretty straightforward and it doesn't look that much different from our [ng1-dinos Dinos service](https://github.com/auth0-blog/ng1-dinos/blob/master/src/app/core/Dinos.service.js). Aside from Angular 2 format, the primary difference is that we're returning typed observables instead of promises (and we haven't added the API call to get a single dinosaur's details by `id` yet—we'll do that later).

Starting from the top: we import our dependencies. Services are _injectable_. The CLI adds the `Injectable` class for us. We also need `HttpClient` and `HttpErrorResponse` from `@angular/common/http`, `Observable` from RxJS, and the `catch` operator. Finally we need our `Dino` model.

> **Note:** RxJS [observables are preferable over promises](https://angular-2-training-book.rangle.io/handout/observables/observables_vs_promises.html). Angular 2's `http.get` returns an observable but we _could_ convert it to a promise with `.toPromise()` if we had to (but we won't in this tutorial). 

We set our private API `baseUrl` property and make `private http: HttpClient` available in the constructor function. 

Then we define our `getAllDinos$()` function. The `$` at the end of the function name indicates that an observable is returned and we can subscribe to it. The `getAllDinos$(): Observable<Dino[]>` type annotation declares that we expect an array of items matching the `Dino` model we created previously.

Finally we manage successes and errors. The `map` operator processes the result from the observable. In our case, we're returning the response as JSON. We'll use the `catch` operator to handle failed API responses and generate an observable that terminates with an error.

> **Note:** In the Angular 1 [ng1-dinos Dinos service](https://github.com/auth0-blog/ng1-dinos/blob/master/src/app/core/Dinos.service.js), the success function checks for an object because some server configurations (such as NGINX) will return a successful XHR response with an HTML error page in the case of an API failure. The front-end promise incorrectly resolves this as the appropriate data. We do _not_ need to do this check in Angular 2 ng2-dinos because we have TypeScript ensuring that the shape of the data matches our `Dino` model. Pay attention to your data though: if you have a response that occasionally changes shape, you'll need to address that in the model so you don't receive errors. You can read more about [TypeScript functions and optional parameters here](https://www.typescriptlang.org/docs/handbook/functions.html).

### Provide the Dinos Service in App Module

We want the dinos service to be a singleton. Unlike Angular 1, Angular 2 services can be singletons _or_ have multiple instances depending on how they're provided. To create a global singleton, we'll provide the service in the `app.module.ts`:

```typescript
// ng2-dinos/src/app/app.module.ts

...
import { DinosService } from './core/dinos.service';

@NgModule({
  ...,
  providers: [
    ...,
    DinosService
  ],
  ...
```

We import the `DinosService` and then add it to the `providers` array. It's now available for use in our components.

### Use the Dinos Service in Home Component

Now we have a service that fetches data from the API. We'll use this service in our home component to display a list of dinosaurs. Open the `home.component.ts` file:

```typescript
// ng2-dinos/src/app/pages/home/home.component.ts

...
import { DinosService } from '../../core/dinos.service';
import { Dino } from '../../core/models/dino.model';

@Component({
  ...
})
export class HomeComponent implements OnInit {
  dinos: Dino[];
  error: boolean;
  pageName = 'Dinosaurs';

  constructor(
    private titleService: Title,
    private dinosService: DinosService) { }

  getDinos() {
    this.dinosService
      .getAllDinos$()
      .subscribe(
        res => {
          this.dinos = res;
        },
        err => {
          this.error = true;
        }
      );
  }

  ngOnInit() {
    this.titleService.setTitle(this.pageName);
    this.getDinos();
  }

}
```

As always, we import our dependencies. We need our new `DinosService` and `Dino` model.

Then we'll implement the functionality to use this service. We'll declare that the `dinos` property should be of type `Dino[]` (an array of items matching the `Dino` model). We'll also create an `error` boolean property. We'll add the `private dinosService: DinosService` to the constructor parameters.

We can then write the `getDinos()` method to subscribe to the `getAllDinos$()` observable and assign the response to the `dinos` property. In the function for error handling, we'll set the `error` property to true.

Finally, we'll call the `getDinos()` method in our `ngOnInit()` function.

### Display a List of Dinosaurs

We now have dinosaur data available, we just need to render it in the `home.component.html` template. We'll start by displaying it in a simple unordered list. We also want to show an error if something goes wrong retrieving data from the API:

{% highlight html %}
{% raw %}
<!-- ng2-dinos/src/app/pages/home/home.component.html -->

...
  <!-- Dinosaurs -->
  <ul *ngIf="dinos">
    <li *ngFor="let dino of dinos">{{dino.id}} - {{dino.name}}</li>
  </ul>

  <!-- Error -->
  <p *ngIf="error" class="alert alert-danger">
    <strong>Rawr!</strong> There was an error retrieving dinosaur data.
  </p>
...
{% endraw %}
{% endhighlight %}

The `ng-repeat` of Angular 1 has been replaced by the [`ngFor` repeater directive](https://angular.io/docs/ts/latest/guide/template-syntax.html#!#ngFor). 

> **Note:** The `*` asterisk before `ngIf` and `ngFor` is syntactic sugar that allows us to skip wrapping subtrees in `<template>` tags. You can read more about [* and `<template>` in the docs](https://angular.io/docs/ts/latest/guide/template-syntax.html#!#star-template).

We now have a list of all the dinosaurs returned from the API. Our app homepage looks like this in the browser:

![Migrating AngularJS app to Angular: Angular 2 app showing list with API data](https://cdn.auth0.com/blog/ng1-to-ng2/home-simple-list.jpg)

We can also test the error state by stopping the local Node dinos server and then reloading our Angular 2 app. We should see this:

![Migrating AngularJS app to Angular: Angular 2 app showing data error](https://cdn.auth0.com/blog/ng1-to-ng2/error-no-data.jpg)

## Display Dino Cards

Our Angular 1 ng1-dinos app repeats a [`dinoCard` directive with a template](https://github.com/auth0-blog/ng1-dinos/tree/master/src/app/pages/home/dino-card) that displays each dinosaur's name and detail link in a card styled with Bootstrap. The implementation in ng2-dinos will be similar.

We'll start by generating the new dino card component in the same folder as our home component:

```bash
$ ng g component pages/home/dino-card
```

### Dino Card Component TypeScript

The dino card won't have to do much processing, but we want to use the `@Input` decorator to give it dinosaur data. Let's set this up in the `dino-card.component.ts`:

```typescript
// ng2-dinos/src/app/pages/home/dino-card/dino-card.component.ts

import { Component, Input } from '@angular/core';

import { Dino } from '../../../core/models/dino.model';

@Component({
  selector: 'app-dino-card',
  templateUrl: './dino-card.component.html'
})
export class DinoCardComponent {
  @Input() dino: Dino;
}
```

We need to import `Input` from `@angular/core`. We also need our trusty `Dino` model. Then we'll declare our `@Input() dino: Dino` typed property. We don't need to add anything to the constructor so the `constructor() { }` function can be deleted. We also aren't using the `OnInit` lifecycle hook so we can remove it from imports, the exported class, and the `ngOnInit()` function. Keep in mind that if we expand functionality at some future date, we may need to replace things we've cleaned up for brevity.

### Dino Card Component Template

Let's create the template for the dino card component. This file will be very similar to the ng1-dinos dino card template:

{% highlight html %}
{% raw %}
<!-- ng2-dinos/src/app/pages/home/dino-card/dino-card.component.html -->

<div class="dinoCard panel panel-info">
  <div class="panel-heading">
    <h3 class="panel-title text-center">{{dino.name}}</h3>
  </div>
  <div class="panel-body">
    <p class="text-center">
      <a class="btn btn-primary" href>Details</a>
    </p>
  </div>
</div>
{% endraw %}
{% endhighlight %}

Notice that the Details button doesn't go anywhere yet. We'll hook this up when we add the dinosaur detail component and routing.

### Display Dino Card in Home Component Template

Now let's replace the unordered list with our new dino card component in `home.component.html`:

{% highlight html %}
<!-- ng2-dinos/src/app/pages/home/home.component.html -->

...
  <!-- Dinosaurs -->
  <section *ngIf="dinos" class="row">
    <div class="col-xs-12 col-sm-4" *ngFor="let dino of dinos">
      <app-dino-card [dino]="dino"></app-dino-card>
    </div>
  </section>
...
{% endhighlight %}

We'll add some Bootstrap classes so our cards display nicely in a grid. Then we'll implement the `<app-dino-card>` element in our repeater. We'll pass `dino` data to it with property binding.

Our ng2-dinos homepage now looks like this:

![Migrating AngularJS app to Angular: Angular 2 app showing child component cards with API data](https://cdn.auth0.com/blog/ng1-to-ng2/home-dino-cards.jpg)

Our migration is coming together. The Angular 2 app is finally starting to look more like ng1-dinos!

## Migrating Angular 1 Filtering to Angular 2

You may have heard about [Angular 2 pipes](https://angular.io/docs/ts/latest/guide/pipes.html). Pipes transform displayed values within a template. In Angular 1, we used the pipe character (`|`) to do similar things with [filters](https://docs.angularjs.org/api/ng/filter/filter). However, filters are _gone_ in Angular 2.

### No Filter or OrderBy Pipes

In our Angular 1 ng1-dinos app, we could filter our dinosaurs repeater by binding an `ng-model="query"` to an input and then using `item in array | filter: query` on the repeater. This is no longer built-in in Angular 2. The Angular 2 team recommends _against_ replicating this functionality with a custom filtering pipe due to concerns over performance and minification. 

Instead, we'll create a _service_ that performs filtering. You may already be familiar with filtering this way on Angular 1 apps with large amounts of data where performance becomes an issue. Angular 1 apps can slow to a crawl if care isn't taken with how filtering is handled. If you've ever had to search hundreds or thousands of items or implemented faceted search, you should be familiar with the pitfalls and workarounds.

> **Note:** How is a filtering service different from a custom pipe? Filtering lists is very expensive. With a service, we can control when and how often the filtering logic is executed. You can read more in the ["No _FilterPipe_ or _OrderByPipe_" section of the Pipes docs](https://angular.io/docs/ts/latest/guide/pipes.html) (at the very bottom).

### Create a Filter Service

Let's create a service for filtering:

```bash
$ ng g service core/filter
```

We want our filter service to provide a `search()` method that accepts an array and a query string. It should check objects in the array for strings that contain the query and return a new array of all objects with a match. Let's implement this in `filter.service.ts`:

```typescript
// ng2-dinos/src/app/core/filter.service.ts

import { Injectable } from '@angular/core';

@Injectable()
export class FilterService {
  search(array: any[], query: string) {
    const lQuery = query.toLowerCase();

    if (!query) {
      return array;
    } else if (array) {
      const filteredArray = array.filter(item => {
        for (const key in item) {
          if ((typeof item[key] === 'string') && (item[key].toLowerCase().indexOf(lQuery) !== -1)) {
            return true;
          }
        }
      });
      return filteredArray;
    }
  }

}
```

We want search to be case-insensitive so we'll convert the query and values to lowercase when checking for matches. If the method is called with a falsey query, we'll return the original array instead of trying to check for matches. For our ng2-dinos search, we're only going to check string values in the objects. If you need a more robust search (ie., one that also checks dates, numbers, etc.) you'll want to handle that specifically. This is one of the benefits of implementing filters this way over the old Angular 1 filter: we have more fine-grained control.

## Use Angular 2 Filter Service to Search

Now that we have a way to filter by query, let's implement this in our home component. 

### Filter in Home Component TypeScript

Open the `home.component.ts` file:

```typescript
// ng2-dinos/src/app/pages/home/home.component.ts

...
import { FilterService } from '../../core/filter.service';

@Component({
  ...
  providers: [DinosService, FilterService]
})
export class HomeComponent implements OnInit {
  dinos: Dino[];
  filteredDinos: Dino[];
  error: boolean;
  pageName = 'Dinosaurs';
  query = '';

  constructor(..., private filterService: FilterService) { }

  getDinos() {
    this.dinosService.getAllDinos$()
      .subscribe(
        res => {
          this.dinos = res;
          this.filteredDinos = res;
        },
        err => {
          this.error = true;
        }
      );
  }

  ngOnInit() {
    this.titleService.setTitle(this.pageName);
    this.getDinos();
  }

  filterDinos() {
    this.filteredDinos = this.filterService.search(this.dinos, this.query);
  }

  resetQuery() {
    this.query = '';
    this.filteredDinos = this.dinos;
  }

  get noSearchResults() {
    return this.dinos && !this.filteredDinos.length && this.query && !this.error;
  }

}
```

We need to import and then provide our `FilterService`. Next we'll set its parameter in the constructor function. Now we can use it in our home component.

> **Note:** By providing the filter service in the component instead of `app.module.ts`, we're creating an instance unique to _this component_. We're doing this here because there is only one place we're filtering. If you add filters to additional components in the future, consider using a global singleton if there's no compelling reason to create multiple instances.

We're going to create a property called `filteredDinos` alongside our `dinos` property. The filtered collection should also have the `Dino[]` type. When we successfully retrieve data from the API, we'll set `filteredDinos` as well as `dinos`. At this point it is the full collection.

Next we need a method for the template to use to filter the dinosaur list. We'll call this method `filterDinos()`. Inside this function, we'll pass the `query` and our full `dinos` collection to the `FilterService` method we created and set its results: `this.filteredDinos = this.filterService.search(this.dinos, this.query)`.

Our ng1-dinos app has a way to instantly clear the search with a button. We want the same feature in ng2-dinos, so let's create a `resetQuery()` method. This method sets the `query` to an empty string and then sets `filteredDinos` to the original, unfiltered `dinos` array. The reason we have to manually reset the array is because we're going to declaratively run `filterDinos()` on `keyup` in the query input field. This won't be triggered when the user clicks the button to clear the query.

Finally, we need a method that returns an expression informing the template that no search results match the query. If there is a `dinos` array, the `filteredDinos` array is empty, there is a query, and (as a catch-all), there is no API error, then we can conclude the user's search has produced no results. In our ng1-dinos app, we used this expression in the `ng-if` in the view. Angular 2 recommends [shifting logic of this type into the component](https://angular.io/docs/ts/latest/guide/template-syntax.html#!#simplicity).

### Filter in Home Component Template

You can reference the Angular 1 [ng1-dinos `Home.view.html`](https://github.com/auth0-blog/ng1-dinos/blob/master/src/app/pages/home/Home.view.html) to check out the markup for searching. We're going to copy and then modify it for ng2-dinos `home.component.html`:

{% highlight html %}
{% raw %}
<!-- ng2-dinos/src/app/pages/home/home.component.html -->

...
  <!-- Search dinosaurs -->
  <section *ngIf="dinos" class="home-search input-group">
    <label class="input-group-addon" for="search">Search</label>

    <input
      id="search" 
      type="text"
      class="form-control"
      [(ngModel)]="query"
      (keyup)="filterDinos()" />

    <span class="input-group-btn">
      <button
        class="btn btn-danger"
        (click)="resetQuery()"
        [disabled]="!query">&times;</button>
    </span>
  </section>

  <!-- Dinosaurs -->
  <section *ngIf="dinos" class="row">
    <div class="col-xs-12 col-sm-4" *ngFor="let dino of filteredDinos">
      <app-dino-card [dino]="dino"></app-dino-card>
    </div>
  </section>

  <!-- No search results -->
  <p *ngIf="noSearchResults" class="alert alert-warning">
    No information available on a dinosaur called <em class="text-danger">{{query}}</em>, sorry!
  </p>
...
{% endraw %}
{% endhighlight %}

We want to use [two-way binding with `ngModel`](https://angular.io/docs/ts/latest/guide/template-syntax.html#!#ngModel) to bind the `query` to the search input. On the `keyup` event, we'll run our `filterDinos()` function. This will update the `filteredDinos` array. We also have a button to clear the search query. On `click`, we'll execute `resetQuery()`. If there's no query, we can disable the button.

> **Note:** `ngModel` now requires the `FormsModule` from `@angular/forms`. The Angular CLI creates new projects with this dependency in `app.module.ts` automatically but it's important to know why and how we utilize it in our app.

In order for our filtering to work in the template, we need to update the `*ngFor` repeater to use the `filteredDinos` array instead of the `dinos` array.

We also want to show a message if a user searches and there are no matching results. This message should show if the `noSearchResults` getter returns `true`.

### Filter in Home Component Styles

If we view our app, you may notice we could use a bit of styling to put some space between the search and the dinosaur list. Open the `home.component.scss` file and add:

```scss
/* ng2-dinos/src/app/pages/home/home.component.scss */

/*--------------------
         HOME
--------------------*/

.home-search {
  margin-bottom: 20px;
}
```

We should now be able to search for dinosaurs by name:

![Migrating AngularJS app to Angular: Angular 2 app with search filtering](https://cdn.auth0.com/blog/ng1-to-ng2/search.jpg)

If the search doesn't return any results, we should see a message:

![Migrating AngularJS app to Angular: Angular 2 app with search filtering](https://cdn.auth0.com/blog/ng1-to-ng2/search-no-results.jpg)

## Aside: Refactoring Suggestions

Here is my refactoring suggestion from part two of our migration tutorial:

* You may want to consider using additional `@NgModule`s to manage dependencies. Modules can make dependency management easier. Read the [Angular Modules docs](https://angular.io/docs/ts/latest/guide/ngmodule.html) and [Use @NgModule to Manage Dependencies in your Angular 2 Apps](https://auth0.com/blog/angular-2-ngmodules/) to learn more.

> **Note:** You may want to wait to refactor until you complete all parts of the tutorial.

## Conclusion

Our ng2-dinos app now calls an API and supports searching! We've successfully migrated the main dinosaurs listing, dino cards, and search form. We've covered HTTP observables and building a filtering service. Make sure you've run `ng lint --type-check` and corrected any issues. With clean code, we shouldn't have any errors.

In the final part of the tutorial, we'll create a dinosaur detail component with routing and we'll show loading states while waiting for API calls to complete.

Migrating an existing application can be a great way to learn a new framework or technology. We experience familiar and new patterns and implement real-world features. Please join me again for the final lesson: [Migrating an AngularJS App to Angular - Part 3](https://auth0.com/blog/migrating-an-angular-1-app-to-angular-2-part-3)!
