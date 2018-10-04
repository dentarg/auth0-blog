---
layout: post
title: "Real-World Angular Series - Part 8: Lazy Loading, Production Deployment, SSL"
description: "Build and deploy a real-world app with MongoDB, Express, Angular, and Node (MEAN): lazy loading, production deployment, SSL."
date: 2017-07-20 8:30
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
- 2017-07-11-real-world-angular-series-part-5
- 2017-07-13-real-world-angular-series-part-6
- 2017-07-18-real-world-angular-series-part-7

---

<div class="alert alert-danger alert-icon">
  <i class="icon-budicon-487"></i>
  <strong>WARNING: This series of articles uses Angular 5 and RxJS 5.</strong> Please be aware that code changes are necessary to use Angular 6 and RxJS 6 with this tutorial. We are in the process of upgrading the series to latest versions. In the meantime, you can <a href="https://update.angular.io/">follow the update instructions here</a> for more information. Thank you for your patience!
</div>

**TL;DR:** This 8-part tutorial series covers building and deploying a full-stack JavaScript application from the ground up with hosted [MongoDB](https://www.mongodb.com/), [Express](https://expressjs.com/), [Angular (v2+)](https://angular.io), and [Node.js](https://nodejs.org) (MEAN stack). The completed code is available in the [mean-rsvp-auth0 GitHub repo](https://github.com/auth0-blog/mean-rsvp-auth0/) and a deployed sample app is available at [https://rsvp.kmaida.net](https://rsvp.kmaida.net).  **Part 8 of the tutorial series covers NgModule refactoring, lazy loading, and production deployment on VPS with nginx and SSL.**

---

## Real-World Angular Series

You can view all sections of the tutorial series here:

1. [Real-World Angular Series - Part 1: MEAN Setup & Angular Architecture](https://auth0.com/blog/real-world-angular-series-part-1)
2. [Real-World Angular Series - Part 2: Authentication and Data Modeling](https://auth0.com/blog/real-world-angular-series-part-2)
3. [Real-World Angular Series - Part 3: Fetching and Displaying API Data](https://auth0.com/blog/real-world-angular-series-part-3)
4. [Real-World Angular Series - Part 4: Access Management, Admin, and Detail Pages](https://auth0.com/blog/real-world-angular-series-part-4)
5. [Real-World Angular Series - Part 5: Animation and Template-Driven Forms](https://auth0.com/blog/real-world-angular-series-part-5)
6. [Real-World Angular Series - Part 6: Reactive Forms and Custom Validation](https://auth0.com/blog/real-world-angular-series-part-6)
7. [Real-World Angular Series - Part 7: Relational Data and Token Renewal](https://auth0.com/blog/real-world-angular-series-part-7)
8. [Real-World Angular Series - Part 8: Lazy Loading, Production Deployment, SSL](https://auth0.com/blog/real-world-angular-series-part-8) (congratulations, you are here!)

---

## Part 8: Lazy Loading, Production Deployment, SSL

The [seventh part of this tutorial](https://auth0.com/blog/real-world-angular-series-part-7) covered deleting events, retrieving relational data from MongoDB to list events a user has RSVPed to, and silently renewing authentication tokens.

The eighth and final installment in the series covers NgModule refactoring, lazy loading, and production deployment on VPS with nginx and SSL.

1. <a href="#ngmodules" target="_self">Angular: Refactor NgModules</a>
2. <a href="#lazy-loading" target="_self">Angular: Lazy Loading</a>
3. <a href="#deployment-intro" target="_self">Intro to Deploying a MEAN App</a>
4. <a href="#do-setup" target="_self">Digital Ocean Setup</a>
5. <a href="#ssl-setup" target="_self">Set Up SSL</a>
6. <a href="#deploy" target="_self">Deploy Application on Digital Ocean</a>
7. <a href="#prod-settings" target="_self">Production Auth0 Settings</a>
8. <a href="#conclusion" target="_self">Conclusion</a>

---

## <span id="ngmodules"></span>Angular: Refactor NgModules

Let's pick up right where we left off [last time](https://auth0.com/blog/real-world-angular-series-part-7). Angular uses [NgModules](https://angular.io/guide/ngmodule) to organize an application into cohesive blocks of functionality. We currently have just one NgModule: our [root module](https://angular.io/guide/bootstrapping), called `AppModule`. To improve our app's organization and enable lazy loading, we're going to do some refactoring by adding additional NgModules.

Let's start the NgModules refactor by creating modules for our `src/app/auth` and `src/app/core` directories. This will start to help clean up our `app.module.ts` file.

### Create Auth Module

Create a module with the Angular CLI like so:

```bash
$ ng g module auth
```

This command generates an `auth.module.ts` file in our existing `auth` folder. Let's open this file and make the following updates:

```typescript
// src/app/auth/auth.module.ts
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class AuthModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AuthModule,
      providers: [
        AuthService
      ]
    };
  }
}
```

This module now makes the `AuthService` provider available to our application when imported. It's important to note that in addition to importing `NgModule`, we also import `ModuleWithProviders`. We then create a static `forRoot()` method in the exported module class that returns an object that includes any necessary providers. The `forRoot()` method may look familiar; recall that we used it when implementing our app routing module.

Why do we need to do this?

Services provided at the module level should only have one instance (they should be _singletons_). However, if we are lazy loading modules, there's a possibility that services can be provided more than once, which can result in unintended multiple instances. This way, rather than providing the service in the module, we can call the `forRoot()` method on modules when they are imported in order to provide any associated services.

### Create Core Module

Now we'll create a core module the same way:

```bash
$ ng g module core
```

Open the new `core.module.ts` file and add:

```typescript
// src/app/core/core.module.ts
import { NgModule, ModuleWithProviders } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ApiService } from './api.service';
import { UtilsService } from './utils.service';
import { FilterSortService } from './filter-sort.service';
import { SubmittingComponent } from './forms/submitting.component';
import { LoadingComponent } from './loading.component';
import { HeaderComponent } from './../header/header.component';
import { FooterComponent } from './../footer/footer.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    LoadingComponent,
    SubmittingComponent
  ],
  exports: [
    HttpClientModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    FooterComponent,
    LoadingComponent,
    SubmittingComponent
  ]
})
export class CoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        Title,
        DatePipe,
        ApiService,
        UtilsService,
        FilterSortService
      ]
    };
  }
}
```

We'll move HTTP and forms modules to our core module, as well as the title service and necessary features in the `src/app/core` directory and our header and footer. We'll import the appropriate modules and components. We also need to _add_ `RouterModule` in order to support the Header component's navigation directives. We'll add the modules to the NgModule's `imports` array, the components to the `declarations` array. Then we'll also need to `export` the modules and components if we want to be able to use them in the components of other NgModules. Finally, we'll use the `forRoot()` method to add the services to the `providers` array in the `ModuleWithProviders` object.

> **Note:** We are _not_ moving the `BrowserAnimationsModule`. This is because this module is in `@angular/platform-browser`. Because `BrowserModule` needs to be imported in the app module, all ancillary modules from `@angular/platform-browser` need to be imported in the _same_ module. Otherwise, we will get a `BrowserModule has already been loaded` error when we implement lazy loading.

Our core module is fairly substantial, but collects the shared features of our application in one place. They're no longer mixed in with all of our app's other components.

### Update App Module

We need to add our new modules to our app module, as well as clean up the imports we moved. Open the `app.module.ts` file and modify it like so:

```typescript
// src/app/app.module.ts
// @TODO: remove auth and core imports/declarations
...
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
...
@NgModule({
  ...
  imports: [
    ...
    AuthModule.forRoot(),
    CoreModule.forRoot()
  ],
  ...
```

We'll import the two new modules we created at the top of the file, and also add them to the `imports` array in the `@NgModule()`. Recall that we then need to call `forRoot()` in order to provide their services and ensure that they are only provided _once_. (When we call these shared modules in any lazy loaded modules we create later, we should _not_ call `forRoot()` again, we can simply provide them to take advantage of the app module's single instance.)

We also need to clean up the `app.module.ts` file so we don't have duplicates of anything; this will cause compiler errors. Make sure all the imports and references to moved features have been removed.

> **Note:** Your IDE's intellisense and any Angular compiler errors in the browser should help you clean this up fairly easily.

You'll notice that most of the remaining imports in our app module (with a few exceptions) are now page components. The file looks much cleaner and more manageable. Now we will create a few more modules to manage _features_.

### Create Event Module

Our Event component has several child components, including event details, RSVPs, and the RSVP form. Let's create a module for this page as a whole.

```bash
$ ng g module pages/event
```

Open the `event.module.ts` file and add:

```typescript
// src/app/pages/event/event.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from './../../core/core.module';
import { EventComponent } from './event.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { RsvpComponent } from './rsvp/rsvp.component';
import { RsvpFormComponent } from './rsvp/rsvp-form/rsvp-form.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule
  ],
  declarations: [
    EventComponent,
    EventDetailComponent,
    RsvpComponent,
    RsvpFormComponent
  ]
})
export class EventModule { }
```

We'll need to import the `CoreModule` we created earlier in order for our event components to access its exports. We'll then import all of our event components and add them to the `declarations` array.

### Create Admin Module

Now we'll do the same with our Admin component and its children.

Create the new module:

```bash
$ ng g module pages/admin
```

Open the `admin.module.ts` file and add the following:

```typescript
// src/app/pages/admin/admin.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from './../../core/core.module';
import { AdminComponent } from './admin.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { UpdateEventComponent } from './update-event/update-event.component';
import { EventFormComponent } from './event-form/event-form.component';
import { DeleteEventComponent } from './update-event/delete-event/delete-event.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule
  ],
  declarations: [
    AdminComponent,
    CreateEventComponent,
    UpdateEventComponent,
    EventFormComponent,
    DeleteEventComponent
  ]
})
export class AdminModule { }
```

Like in our event module, we'll import `CoreModule` and all the components associated with our admin page.

### Update App Module

Now it's time to update `app.module.ts` again. We'll delete all the imports and references that we moved. Then we'll import the two new modules we created:

```js
// src/app/app.module.ts
// @TODO: remove event and admin component imports/declarations
...
import { EventModule } from './pages/event/event.module';
import { AdminModule } from './pages/admin/admin.module';
...
@NgModule({
  ...
  imports: [
    ...
    EventModule,
    AdminModule
  ],
  ...
```

> **Note:** After we verify that refactored modules work, we'll be removing these imports in favor of <a href="#lazy-loading" target="_self">lazy loading</a> them instead.

Our app should continue to function the way it always did, but we have a cleaner architecture in place. We're now ready to implement lazy loading for our event and admin routes.

---

## <span id="lazy-loading"></span>Angular: Lazy Loading

Currently, all of our routes are _eagerly_ loaded. This means all routes are compiled in the same bundle, which loads on initialization of our single page app (SPA) in the browser. It's often a better approach to only load routes when they're needed (_lazy_ loading). With this approach, bundle _chunks_ are compiled as separate JavaScript files. Each chunk is only loaded when the user navigates to the route that needs that code.

{% include tweet_quote.html quote_text="Use NgModules to implement lazy loading with Angular." %}

[Lazy loading](https://angular.io/guide/ngmodule#lazy-loading-modules-with-the-router) in Angular relies on _modules_. In addition to gaining improved architecture, we also get the ability to easily add lazy loading as a result of creating an `EventModule` and `AdminModule`. Instead of loading _components_ with our routes, we'll use `loadChildren` with a string pointing to the proper NgModule.

> **Note:** You could lazy load _all_ routes in your application by adding NgModules for each route. We'll only lazy load the event and admin routes in this tutorial, but feel free to add more lazy loading in your apps.

Let's implement lazy loading!

### Lazy Load Event Route

We'll lazy load our event module first. The event feature is a substantial amount of code and functionality, so we'll load it on demand. We can implement lazy loading in three simple steps.

The first thing we need to do is move routing for our event component to the `EventModule`. We'll create a new file that exports an `EVENT_ROUTES` constant. Make a new file in `src/app/pages/event` called `event.routes.ts`:

```typescript
// src/app/pages/event/event.routes.ts
import { Routes } from '@angular/router';
import { EventComponent } from './event.component';

export const EVENT_ROUTES: Routes = [
  {
    path: '',
    component: EventComponent
  }
];
```

This is a _child_ route of our existing `'event/:id'` route, hence the empty `path` (it inherits its route from the `'event/:id'` parent). The parent `'event/:id'` in our `app-routing.module.ts` will become _componentless_ and will reference the event NgModule instead of the `EventComponent`.

Let's import the `EVENT_ROUTES` constant into our `event.module.ts` and implement it:

```js
// src/app/pages/event/event.module.ts
...
import { RouterModule } from '@angular/router';
import { EVENT_ROUTES } from './event.routes';

@NgModule({
  imports: [
    ...,
    RouterModule.forChild(EVENT_ROUTES)
  ],
  ...
})
...
```

We'll import the `RouterModule` and the `EVENT_ROUTES` constant. Then we'll import `RouterModule` and set `forChild()`, passing the event routes we just created.

Now open the `app-routing.module.ts`:

```typescript
// src/app/app-routing.module.ts
// @TODO: remove EventComponent import
...

const routes: Routes = [
  ...,
  {
    path: 'event/:id',
    loadChildren: './pages/event/event.module#EventModule',
    canActivate: [
      AuthGuard
    ]
  },
  ...
];

...
```

First we'll remove the `EventComponent` import. Then we'll replace the `component: EventComponent` in our `'event/:id'` route with the following:

```typescript
loadChildren: './pages/event/event.module#EventModule',
```

This is a string referencing the path to our `event.module.ts` and the module's name, `EventModule`. The code will then look in the event module for routes and load them on demand.

#### Lazy Load Admin Routes

Now we'll lazy load the admin routes. This is a _set_ of routes rather than a single one, unlike our event route. Lazy loading the admin routes together is useful because any user who logs in who is _not_ an admin will never need to download the admin components. However, if the user _is_ an admin, we can load all the admin routes together the first time they access an admin page. The implementation is the same as above, so let's begin.

Create a new file that exports an `ADMIN_ROUTES` constant. Make a new file in `src/app/pages/admin` called `admin.routes.ts`:

```typescript
// src/app/pages/admin/admin.routes.ts
import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { UpdateEventComponent } from './update-event/update-event.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminComponent,
  },
  {
    path: 'event/new',
    component: CreateEventComponent
  },
  {
    path: 'event/update/:id',
    component: UpdateEventComponent
  }
];
```

This is the same as the `children` array from the `app-routing.module.ts`.

Now implement these routes in the `admin.module.ts`:

```js
// src/app/pages/admin/admin.module.ts
...
import { RouterModule } from '@angular/router';
import { ADMIN_ROUTES } from './admin.routes';

@NgModule({
  imports: [
    ...,
    RouterModule.forChild(ADMIN_ROUTES)
  ],
  ...
})
...
```

Lastly, update the `app-routing.module.ts`:

```typescript
// src/app/app-routing.module.ts
// @TODO: remove all admin route component imports
...

const routes: Routes = [
  ...,
  {
    path: 'admin',
    loadChildren: './pages/admin/admin.module#AdminModule',
    canActivate: [
      AuthGuard,
      AdminGuard
    ]
  },
  ...
];

...
```

Remove the admin component imports (`AdminComponent`, `CreateEventComponent`, and `UpdateEventComponent`). Then replace the `children` array with `loadChildren` instead.

### Remove Event and Admin Modules From App Module

Now that our event and admin modules are set up to be loaded lazily, we no longer need to import them in our root `AppModule`. Instead, they will be loaded on demand.

Open the `app.module.ts` file and delete the `import` statements for `EventModule` and `AdminModule`. In addition, delete these modules from the NgModule's `imports` array.

### Production Build to Verify Lazy Loading

Lazy loading is now implemented! Visit the app in the browser. Everything should continue to work as expected. Verify that you can access all the routes without errors.

We can see that everything works, but in order to really see our lazy loading in action, we need to create a _production_ build. This will use [Ahead-of-Time (AOT) compilation instead of Just-in-Time (JIT)](http://blog.mgechev.com/2016/08/14/ahead-of-time-compilation-angular-offline-precompilation/). It will split our bundles into separate chunks the way we expect for lazy loading.

Stop both the Angular CLI server and the Node server. Then run:

```bash
$ ng build --prod
$ node server
```

The `ng build --prod` command will create a `/dist` folder containing our compiled production Angular app. Running `node server` without the `NODE_ENV=dev` environment variable will serve our application from Node, running the API while also serving the Angular front end from the production `/dist` folder.

> **Note:** AOT is the default compilation for production builds in the Angular CLI as of v1.0.0-beta.28.

We can now access our production build at [http://localhost:8083](http://localhost:8083). The app should load and run as expected.

> **Note:** Silent <a href="https://auth0.com/blog/real-world-angular-series-part-7#renew-auth">token renewal</a> will produce errors on a production build if you don't update the redirect URLs in the `silent.html` file. However, this is actually the perfect opportunity to test token renewal _error handling_. You may want to decrease the token expiration again in your [Auth0 API](https://manage.auth0.com/#/apis/) to trigger a renewal attempt that will fail due to improper configuration. Then you can ensure that your app handles silent authentication errors gracefully and as expected.

Once you have the app running on [http://localhost:8083](http://localhost:8083), open the browser developer tools to the Network tab. Then navigate through the app, keeping an eye on which resources are loaded.

> **Note:** You can change the Network output to `JS` instead of `All` to make it easier to see the bundles that are being loaded.

On initial load of an eagerly loaded route such as the homepage, the network panel should look something like this:

![Network panel lazy loading eager route](https://cdn.auth0.com/blog/mean-series/network-app.png)

On first load, there are several JS files here. Notice there is a `main...bundle.js` file. This is the JS for our app module, associated code, and eagerly loaded routes. If we hadn't implemented lazy loading, there wouldn't be any additional bundle loads appearing as long as we continue using our single page app in this session.

However, if you navigate from the homepage to a lazy loaded route such as an event details page, you should see a `...chunk.js` file loaded, like so:

![Angular lazy loaded route network](https://cdn.auth0.com/blog/mean-series/network-ll.png)

This is JavaScript loaded on demand for our lazy loaded route. Click through the app while paying attention to the network panel to verify that lazy loading is functioning properly. The first admin route visited should load one more chunk that covers _all_ admin pages. If the user isn't an admin, that code will never burden the network by loading needlessly.

If everything is working as we expect, it's time to get ready to deploy our application!

---

## <span id="deployment-intro"></span>Intro to Deploying a MEAN App

We now have a production build of our RSVP application! The obvious next step is to deploy it. Let's take a look at the requirements for production deployment.

### VPS Hosting

We can't use _shared_ hosting for our application. We're going to be running a Node server, so a [VPS (Virtual Private Server)](https://en.wikipedia.org/wiki/Virtual_private_server) is our best bet. Fortunately, there are robust and affordable options.

In this tutorial, we will deploy our app to a [DigitalOcean](https://digitalocean.com) VPS. We'll talk about this in more detail shortly.

> **Note:** [Heroku](https://heroku.com) is another option, but requires that things be done a specific way. Because of this, if Heroku is your intended production platform, it's strongly recommended that you follow a [Heroku-specific MEAN tutorial](https://devcenter.heroku.com/articles/mean-apps-restful-api) instead.

### MongoDB

You can also consider upgrading your [mLab](https://mlab.com) account where the MongoDB is hosted. If the free Sandbox plan will not be sufficient for your production app, you can upgrade to [a larger plan](https://mlab.com/plans/pricing/). If you're only looking to develop and sandbox, the current free plan should be fine.

Alternatively, you could host your MongoDB locally on your VPS. If it grows large, it will take up space on the server, but will be located in the same place as your app. You can find [instructions on how to set up MongoDB on DigitalOcean here](https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-16-04).

### Domain Name

You'll need a domain name to associate with your VPS so that you can access your app in the browser and secure it with SSL. If you need to register a domain name, you can do so through any number of registrars. Personally, I like to use [namecheap](https://www.namecheap.com/domains/registration.aspx).

### Deployment Summary

Let's do a quick summary of the steps we need to take in order to deploy our app to production:

* Spin up an Ubuntu droplet on [DigitalOcean](https://digitalocean.com) and set up the server
* Install [Node](https://nodejs.org)
* Prep our app for VPS deployment via Git
* Clone and set up our project on VPS
* Keep app running with [pm2](https://github.com/Unitech/pm2)
* Set up a domain name with VPS (either use one you already own or register a new one)
* Get SSL certificate with [Let's Encrypt](https://letsencrypt.org/)
* Install [nginx](https://nginx.org/en/) and configure with domain and SSL
* Update [Auth0 Client](https://manage.auth0.com/#/clients) settings for production

There are a quite a few steps here and we'll be relying on a few [tutorials from DigitalOcean's community](https://www.digitalocean.com/community/tutorials/) to get going.

{% include tweet_quote.html quote_text="MEAN deployment checklist: Ubuntu VPS, domain name, SSL certificate." %}

Let's begin now!

---

## <span id="do-setup"></span>Digital Ocean Setup

The first thing we need is a place to host our app. In this tutorial, I'll show you how to deploy to [DigitalOcean](https://digitalocean.com).

### Create an Ubuntu Digital Ocean Droplet

Create a new droplet on Digital Ocean. **[Signing up with this link will issue a $10 credit to your new account](https://m.do.co/c/8fd2b22aeab7)**. If you choose the $10 plan, that's one month free, or two months free on the $5 plan!

Go through the registration steps. When you create your new droplet, choose the `Ubuntu 16.04` distribution image:

![Digital Ocean Ubuntu distribution image](https://cdn.auth0.com/blog/mean-series/do-ubuntu.png)

> **Note:** Ubuntu `16.04.2 x64` is the default at the time of writing. This may change over time. If so, make sure you find applicable tutorials for the version of Ubuntu you chose.

### Initial Ubuntu Server Setup

Once your droplet is set up, select it in your [DigitalOcean dashboard](https://cloud.digitalocean.com/droplets) and follow the steps here: **[Initial Server Setup with Ubuntu 16.04](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-16-04)**.

This tutorial instructs you on how to [create a new user](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-16-04#step-two-—-create-a-new-user) [with `sudo` privileges](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-16-04#step-three-—-root-privileges). This is the user you should always log in with after initial setup (never as `root`). The tutorial also shows you how to [Add Public Key Authentication](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-16-04#step-four-—-add-public-key-authentication-recommended) and [set up a basic firewall](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-16-04#step-seven-—-set-up-a-basic-firewall).

### Add a Host Domain

In order to easily access your app in the browser and secure it with an SSL certificate, you'll need to add a host domain name in the Digital Ocean dashboard. If you've already [registered a domain](https://www.namecheap.com/domains/registration.aspx), you can set it up by following the **[How To Set Up a Host Name with DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-host-name-with-digitalocean)** tutorial.

I am using `kmaida.net` as my host. I also created a subdomain `rsvp.kmaida.net` CNAME record for my RSVP app. After setup, my DigitalOcean droplet's **Domains** look like this:

![DigitalOcean DNS records](https://cdn.auth0.com/blog/mean-series/do-dns.png)

After following the above tutorial, yours should look similar.

### Install Node.js and PM2

Now it's time to install some dependencies on our VPS. The first thing we'll need for our app is [Node.js](https://nodejs.org/en/).

Please use the following tutorial to install Node on your DigitalOcean VPS: **[How To Install Node.js on Ubuntu 16.04](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-16-04#how-to-install-using-a-ppa)**.

> **Note:** Using the [PPA](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-16-04#how-to-install-using-a-ppa) _or_ [nvm](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-16-04#how-to-install-using-nvm) method will allow you to install a more recent version of Node beyond the distro-stable version for Ubuntu. Installing via PPA or nvm is recommended if you need a newer version. Using PPA, I installed the latest stable version at the time of writing, which is Node v8.1.0.

After installing Node (and with it, [npm](https://www.npmjs.com/)), we can install [PM2](https://github.com/Unitech/pm2), a Node production process manager. PM2 will enable us to keep our app process running, and to restart it automatically if anything disrupts it.

Install PM2 globally on your VPS with the following command:

```bash
$ sudo npm install pm2 -g
```

You can read more about using PM2 in this tutorial: **[How To Set Up a Node.js Application for Production on Ubuntu 16.04 - Install PM2](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04#install-pm2)**.

### Install Nginx

The next step is to install [nginx](https://nginx.org/en/). We will use nginx as a [reverse proxy](https://www.nginx.com/resources/glossary/reverse-proxy-server/) to direct client requests to our MEAN stack app.

> **Side Note:** Around the web, you may see various capitalizations of nginx/Nginx versus NGINX. Outside of the logo (which is always the same), the casual use of capitalization often has to do with the type of distribution. When denoted with lowercase letters, "nginx" (or sometimes "Nginx") generally refers to the [open-source distribution](https://nginx.org/en/). NGINX in uppercase letters frequently refers to [NGINX Plus](https://www.nginx.com/), the commercial application delivery platform.
>
> However, to make things more confusing, the website for the open-source version of nginx says "nginx", whereas the website for the commercial platform refers to _both_ as "NGINX" (differentiating the two using the word "Plus").

Use this tutorial to install nginx on your VPS: **[How To Install Nginx on Ubuntu 16.04](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-16-04)**.

> **Note:** In [Step 2: Adjust the Firewall](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-16-04#step-2-adjust-the-firewall), enable `Nginx Full`, since we're going to set up SSL and we want to redirect traffic from HTTP to HTTPS.

---

## <span id="ssl-setup"></span> Set Up SSL

Since our app deals with user authentication and potentially sensitive information, we want to secure it with [SSL](http://info.ssl.com/article.aspx?id=10241), an encrypted link between the browser and web server. In order to do this, we'll need to acquire an SSL certificate. We'll do this with [Let's Encrypt](https://letsencrypt.org/), a free certificate authority.

There are [several steps involved](https://certbot.eff.org/#ubuntuxenial-other), so let's begin.

### Install Certbot

On our VPS, we'll install the tools that Let's Encrypt needs in order to acquire and manage certificates:

```bash
$ sudo apt-get install software-properties-common
$ sudo add-apt-repository ppa:certbot/certbot
$ sudo apt-get update
$ sudo apt-get install certbot
```

The tool we need to obtain certificates from Let's Encrypt is called [certbot](https://github.com/certbot/certbot). These commands will install it and its dependencies. Throughout the installation, you will be prompted a few times to proceed.

### Obtain a Certificate

Let's obtain a certificate now with the following command:

```bash
# e.g., sudo certbot certonly --standalone -d kmaida.net -d www.kmaida.net -d rsvp.kmaida.net
$ sudo certbot certonly --standalone -d [example.com] -d [rsvp.example.com]
```

The `certbot certonly` command obtains a certificate but does not assume anything about the software that serves our content. We'll be using nginx, but we'll configure it manually. Because our Node app runs on a `localhost` webserver and not from the `~/var/www` directory, we'll use the `--standalone` flag.

Make sure you replace the domains in square brackets (`[example.com]`, etc.) with all the domains and subdomains you wish the certificate to include. You may be prompted to enter an admin email and accept terms. Once certbot is finished obtaining your certificate, you should see a `Congratulations!` message that looks something like this:

<p align="center">
<img src="https://cdn.auth0.com/blog/mean-series/letsencrypt-success.png" alt="Let's Encrypt certbot successfully obtained SSL cert">
</p>

### Automatically Renew Certificate

SSL certificates from Let's Encrypt expire every 90 days. To avoid having to manually renew the certificate every three months, we can set up a [cron](http://www.unixgeeks.org/security/newbie/unix/cron-1.html) job to do this for us automatically.

To create a [cron job](https://code.tutsplus.com/tutorials/scheduling-tasks-with-cron-jobs--net-8800), run this command:

```bash
$ sudo crontab -e
```

Then enter the following:

```bash
# Automatically renew certificate
46 0,12 * * * /usr/bin/certbot renew --quiet --renew-hook "/usr/local/bin/systemctl reload nginx"
```

This schedules certbot to check to see if the certificate is close to expiring twice a day at 12:46 AM and PM. Certbot recommends that the auto-renewal check [runs at a random minute within the hour twice a day](https://certbot.eff.org/all-instructions/). If the certificate is close to expiration, certbot will [renew](https://certbot.eff.org/docs/using.html#renewal) it. The `--quiet` flag silences all output except errors. Upon successful renewal (`--renew-hook`), nginx is reloaded. If the certificate is not due for renewal, nothing will happen.

> **Note:** You should double-check where your `certbot` and `systemctl` executables are located to ensure that the local paths in your cron job are correct. You can do this by running `which [cmd]`, like so:
>
>```bash
$ which certbot # e.g., /usr/bin/certbot
$ which systemctl # e.g., /usr/local/bin/systemctl
```
>
> If necessary, update the paths in the cron code with your appropriate paths.

When finished, use `Ctrl` + `x` to exit the nano editor. You'll be prompted to confirm your changes, so enter `y` to accept. You should receive a message confirming a new crontab was installed.

### Create Diffie-Hellman Group

To further secure our connection, let's create a [Diffie-Hellman](https://security.stackexchange.com/a/45971) group. This is a method of securely exchanging cryptographic keys over a public channel.

We can create a DH group with the following command:

```bash
$ sudo openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048
```

It will take a little while for the DH to be generated. We'll add the generated file to our nginx SSL configuration shortly.

> **Note:** You can learn more about the [Diffie-Hellman key exchange here](https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange).

### Nginx SSL Configuration

Let's create a file containing the SSL configuration for nginx:

```bash
$ sudo nano /etc/nginx/snippets/ssl-params.conf
```

Add the following code in the new `ssl-params.conf` file:

```bash
# /etc/nginx/snippets/ssl-params.conf
# cipherli.st
ssl_protocols TLSv1.2;
ssl_prefer_server_ciphers on;
ssl_ciphers "EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH";
ssl_ecdh_curve secp384r1; # Requires nginx >= 1.1.0
ssl_session_cache shared:SSL:10m;
ssl_session_tickets off; # Requires nginx >= 1.5.9
ssl_stapling on; # Requires nginx >= 1.3.7
ssl_stapling_verify on; # Requires nginx => 1.3.7
resolver 8.8.8.8 8.8.4.4 valid=300s;
resolver_timeout 5s;
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
add_header X-Frame-Options SAMEORIGIN;
add_header X-Content-Type-Options nosniff;

# Diffie-Hellman group
ssl_dhparam /etc/ssl/certs/dhparam.pem;
```

The first section is comprised of strong SSL security settings from [cipherli.st](https://cipherli.st)'s nginx example. In the code above, the `resolver` parameter is set to [Google's DNS resolvers](https://developers.google.com/speed/public-dns/) (`8.8.8.8` and `8.8.4.4`).

It's important to note that we also changed the `X-Frame-Options` to `SAMEORIGIN`. This is because Auth0's token renewal takes place in an iframe. If we don't allow the call to take place in an iframe, we _cannot_ renew authentication silently for our app.

Last, we'll add the Diffie-Hellman `ssl-params.conf` file we created above. Exit this file and confirm that changes should be saved.

Congratulations! We're now set up to use SSL. We'll do a little more configuration in the next section when we deploy our app.

---

## <span id="deploy"></span>Deploy Application on Digital Ocean

We're in the home stretch now: deployment! There are a couple of minor things we'll need to do before we deploy our application.

### Don't Ignore Dist Folder

Our production app lives in the `/dist` directory in our project folder. By default, the Angular CLI has a `.gitignore` file that excludes this directory from source control. However, we need this folder to be in the Git repo if we want to avoid installing the Angular CLI on the server. This is very easy to fix.

In the `.gitignore` file in the project root, simply comment out `/dist`:

```bash
# .gitignore
...
# compiled output
# /dist
...
```

Commit this change. This also allows us to commit our production `/dist` folder.

> **Important Note:** Make sure your repo is located somewhere that is accessible to your VPS server through Git, such as on [GitHub](https://github.com) or [BitBucket](https://bitbucket.org). Alternatively, you can clone the app from the sample repo for this tutorial series, which is located at [https://github.com/auth0-blog/mean-rsvp-auth0](https://github.com/auth0-blog/mean-rsvp-auth0). If you clone the app from the sample repo, make sure you update the files indicated in the repo's README and still follow these production deployment steps.

### Clone RSVP App on DigitalOcean VPS

You should have already set up a superuser for your VPS in the [initial server setup tutorial from DigitalOcean](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-16-04). Now open a terminal and connect to the server. Once you're connected, clone the repo that your app lives in and install its Node dependencies, like so:

```bash
$ ssh [superuser]@[DigitalOcean_server_IP]
$ cd /
# Clone your own repo, or the sample one below:
$ sudo git clone https://github.com/auth0-blog/mean-rsvp-auth0.git
$ cd mean-rsvp-auth0
$ sudo npm install
```

> **Note:** Git should already be installed on your DigitalOcean droplet. If it isn't, you can install it like so:
>
> ```
$ sudo apt-get update
$ sudo apt-get git
```

If you're so inclined, you can clean up the app so that only the production files are present. (Or you can modify the `.gitignore` locally to exclude the `/app` folder.) A final option, of course, is to leave the entire app as it is. In production, it will only _access_ the server files and the `/dist` contents.

### Update App Configuration

As it is, the app is missing some backend configuration. The original `config.js` should never be checked into source control if the repo is available publicly. Therefore, we now need to recreate our `server/config.js` file with the appropriate information for the app.

On the server, execute the following commands:

```bash
$ cd server
$ sudo nano config.js # in this file, paste your config.js contents
```

Save and exit with `Ctrl` + `x` and then `y`. 

> **Note:** If you cloned the sample repo, there is a `config.js.SAMPLE` file which can be renamed and modified like so:
>
> ```bash
$ cd server
$ sudo mv config.js.SAMPLE config.js
$ sudo nano config.js # in this file, make changes to reflect your config.js contents
```

### Configure Nginx for the App

We already <a href="#ssl-setup" target="_self">set up encryption with an SSL certificate</a> from [Let's Encrypt](https://letsencrypt.org/). Now it's time to set up the reverse proxy with [nginx](https://nginx.org/en/) for our application.

We're going to use an individual configuration file for our RSVP app, so first we'll disable the `default` file. We can do this with the following commands:

```bash
$ cd /etc/nginx/sites-enabled
$ sudo mv default default.bak
```

Now we can create a _new_ file to store our app's nginx server blocks. Name the file after your _full_ domain with `.conf` as an extension, like so:

```bash
$ sudo nano /etc/nginx/conf.d/[YOUR_DOMAIN].conf # e.g., rsvp.kmaida.net.conf
```

Configuration files in the `conf.d` folder are already imported in the `/etc/nginx/nginx.conf` file, so it's a great way to keep our configurations organized, especially if we'll have additional domains on our VPS in the future.

We'll then set up our new `[YOUR_DOMAIN].conf` file to redirect all traffic to HTTPS and use our SSL certificate:

```bash
# /etc/nginx/conf.d/[YOUR_DOMAIN].conf
server {
  listen 80;
  listen [::]:80;
  server_name [YOUR_DOMAIN];
  return 301 https://$server_name$request_uri;
}
server {
  listen 443 ssl http2;
  listen [::]:443 ssl http2;
  server_name [YOUR_DOMAIN];

  # SSL certificate
  ssl_certificate /etc/letsencrypt/live/[YOUR_CERTIFICATE]/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/[YOUR_CERTIFICATE]/privkey.pem;

  # SSL configuration from cipherli.st
  include snippets/ssl-params.conf;

  location / {
    proxy_pass http://localhost:8083/;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-NginX-Proxy true;
    proxy_set_header Host $http_host;
    proxy_ssl_session_reuse off;
    proxy_cache_bypass $http_upgrade;
    proxy_redirect off;
  }
}
```

Make sure you've replaced `[YOUR_DOMAIN]` and `[YOUR_CERTIFICATE]` with your own information wherever they appear in the code above.

The first `server` block redirects our domain's traffic from HTTP (port `80`) to HTTPS (port `443`). The second block listens on port `443` and uses the SSL certificate and key as well as the SSL configuration. The `location` block then sets the `localhost` location and establishes necessary headers and settings. When you're finished, save this file.

We're almost done! Let's start our app's Node webserver. Change directories to your `mean-rsvp` folder on your VPS. This is likely to be:

```bash
$ cd /mean-rsvp
```

Once you're in your project folder, start the webserver with PM2 with the following command:

```bash
$ sudo pm2 start server.js --name "mean-rsvp"
```

> **Note:** If you already have other Node webservers running with PM2 on your VPS, you should specify the full path to your `server.js` file when `pm2 start`ing your new webserver for the first time. After the initial start, you can distinguish the servers from each other by `name`, which is much easier than distinguishing them by ID.

The final step is to start the nginx reverse proxy:

```bash
$ sudo systemctl start nginx
```

You should now be able to access your site in the browser. It should redirect to a secure connection if `https` is not specified when entering the URL.

> **Note:** We haven't updated our Auth0 Client settings yet, so we'll get an error if we try to log in. We'll fix that next!

---

## <span id="prod-settings"></span>Production Auth0 Settings

There's only one step left, and that's to update our app's Auth0 Client settings to accommodate the production environment.

Log into Auth0 and head to your [Auth0 Dashboard Clients](https://manage.auth0.com/#/clients). Select your RSVP app Client and add the production URLs to your settings:

* **Allowed Callback URLs** - `https://[YOUR_DOMAIN]/callback`
* **Allowed Web Origins** - `https://[YOUR_DOMAIN]`

> **Note:** Take note that these are secure URLs using HTTPS.

If you have [social connections](https://manage.auth0.com/#/connections/social) set up for login, make sure they aren't using Auth0 dev keys. There will be an orange `!` icon next to any that are. If so, you'll need to provide your own App or Client ID instead of leaving the field blank. Each connection has instructions on how to obtain your own ID.

After saving your changes in the Auth0 dashboard, you should be able to log into your production application! Try logging in as the admin user and adding some events.

---

## <span id="conclusion"></span>Conclusion

We've now built and deployed a MEAN stack single page app to production, complete with:

* API with authorized CRUD operations
* NoSQL database
* Authentication and access management with automatic JWT renewal
* Simple and complex forms with custom validation
* Lazy loading
* SSL

### Homework

There were a few topics that I didn't cover in this tutorial series in the interest of keeping it more manageable. If you'd like to dig deeper, I highly recommend that you look into the following:

#### Testing

* [Angular - Testing](https://angular.io/guide/testing)
* [Angular Testing In Depth: Services](https://auth0.com/blog/angular-2-testing-in-depth-services/)
* [Angular Testing In Depth: HTTP Services](https://auth0.com/blog/angular-testing-in-depth-http-services/)
* [Angular Testing In Depth: Components](https://auth0.com/blog/angular-testing-in-depth-components)
* [How to correctly test Angular 4 application with Auth0 integration](https://stackoverflow.com/questions/43784314/how-to-correctly-test-angular4-application-with-auth0-integration)

#### Self-hosted MongoDB

* [Install MongoDB](https://docs.mongodb.com/manual/installation/)
* [Getting Started with MongoDB (MongoDB Shell Edition)](https://docs.mongodb.com/getting-started/shell/)
* [MongoDB Node Quick Start](http://mongodb.github.io/node-mongodb-native/2.2/quick-start/quick-start/)
* [DigitalOcean - How to Install MongoDB on Ubuntu 16.04](https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-16-04)

### Congratulations!

You've completed a real-world, full-stack JavaScript project and even had a little taste of [operations / sysadmin](https://xkcd.com/705/). You should now be prepared to build and deploy your own MEAN stack applications from the ground up!