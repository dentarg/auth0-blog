---
layout: post
title: "Migrating an Angular 1 App to Angular 2 - Part 1"
description: "Learn how to migrate real-world features of an Angular 1 application to a fresh Angular 2 build."
date: 2016-11-07 8:30
category: Technical guide, Angular, Angular2
banner:
  text: "Auth0 makes it easy to add authentication to your AngularJS application."
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
- 2016-09-29-angular-2-authentication
- 2016-09-15-angular-2-ngmodules
---

**TL;DR:** Many AngularJS 1.x developers are interested in Angular 2, but the major differences between versions 1 and 2 are daunting when we have so many Angular 1 apps already in production or maintenance. Learn how to migrate a real-world Angular 1 app to a fresh Angular 2 build: what's the same, what's similar, and what's completely different. After this tutorial, you should be prepared to tackle your own migrations as well as new Angular 2 projects. Clone the code for our Angular 2 app from the [ng2-dinos GitHub repo](https://github.com/auth0-blog/ng2-dinos).

---

## Angular 1 and Angular 2

[AngularJS 1.x](https://angularjs.org/) has been a frontrunner among JavaScript frameworks over the past few years. There are thousands of production sites and apps [built with Google's "superheroic MVW framework"](https://www.madewithangular.com) and many more still in development. In mid-September 2016, [Angular 2 was released](http://angularjs.blogspot.com/2016/09/angular2-final.html) after a lengthy period of betas and release candidates. Angular developers knew this was coming and that [Angular 2](https://angular.io/) was a full rewrite and platform implementation, not an incremental update. 

While Angular developers were and _are_ eager to try Angular 2, adoption can be challenging. Many of us have Angular 1 apps in development or maintenance and aren't in a position to migrate them to Angular 2 due to tight deadlines, budget constraints, client or management reluctance, etc. Angular 1 is [still being maintained](https://github.com/angular/angular.js/blob/master/CHANGELOG.md); in fact, at time of writing [Angular 1.6 is in release candidate](https://github.com/angular/angular.js/blob/master/CHANGELOG.md#160-rc0-bracing-vortex-2016-10-26) and Angular 1 apps are not about to go away.

> **NOTE:** [Angular 2 uses SemVer (Semantic Versioning)](http://angularjs.blogspot.com/2016/10/versioning-and-releasing-angular.html?view=classic). This means that unlike Angular 1, there will no longer be breaking changes in point releases. Currently, version 3.0 is scheduled for launch in early 2017.

## Migrate vs. Upgrade

Angular 2 is a powerful and attractive platform. Many developers will have their first opportunity to dig in when they tackle migrating an existing Angular 1 app to Angular 2. At this time, **_upgrading_** the original codebase is extremely difficult: Angular 2 is not an iteration of Angular 1. Moving between them is more straightforward when **_migrating_** to a fresh build that implements the same features on a new platform.

We'll walk through the process of migrating an Angular 1 app to Angular 2. Our Angular 1 project is relatively small but it represents a scalable, real-world Single Page Application. After following this tutorial, you should have a better understanding of how to get started with Angular 2 and how features from Angular 1 translate to Angular 2.

**This tutorial assumes you are comfortable developing apps with AngularJS version 1.x.** If you're just looking to learn Angular 2, check out resources like [Angular 2 Authentication](https://auth0.com/blog/angular-2-authentication/) and [Getting Started with Angular 2](https://school.scotch.io/getting-started-with-angular-2).

## Angular 1 "ng1-dinos"

Our Angular 1 app is called **ng1-dinos** and the code is available at the [ng1-dinos GitHub repo](https://github.com/auth0-blog/ng1-dinos). It has the following features:

* Routing (dinosaurs listing with individual detail pages)
* Filtering (search for dinosaurs by name)
* Calls an [external Node API](https://github.com/auth0-blog/sample-nodeserver-dinos) to get dinosaur data
* SCSS and [Bootstrap CSS](http://getbootstrap.com/css/)
* Custom off-canvas navigation
* Metadata factory to provide dynamic `<title>`
* [Gulp](http://gulpjs.com/) build
* Guided by the [Angular 1 Style Guide](https://github.com/johnpapa/angular-styleguide/tree/master/a1#angular-1-style-guide)
* Scalability

## ng1-dinos Setup

Let's set up **ng1-dinos** and get it running locally.

### Dependencies

Follow the instructions on the following sites to install these dependencies:

* [NodeJS with npm](https://nodejs.org)
* [Gulp](http://gulpjs.com) (install globally with `npm install -g gulp`)

We'll also need to clone **[sample-nodeserver-dinos](https://github.com/auth0-blog/sample-nodeserver-dinos)**. This local Node server will provide the external API for both our ng1-dinos and ng2-dinos apps. Follow the instructions in the [sample-nodeserver-dinos README](https://github.com/auth0-blog/sample-nodeserver-dinos/blob/master/README.md) to get it installed and running on [http://localhost:3001](http://localhost:3001).

### Install and Run "ng1-dinos"

1. Clone **[ng1-dinos](https://github.com/auth0-blog/ng1-dinos)** from GitHub to a local directory of your choosing.
2. Run `npm install` from the root directory.
3. Run `gulp` to serve the application (runs locally on [http://localhost:8000](http://localhost:8000))

Once you have the app and the Dinos Node server running, the app should look like this in the browser:

![ng1-dinos screenshot](https://cdn.auth0.com/blog/ng1-to-ng2/ng1-dinos-home.jpg)

Take some time to familiarize with the file structure, code, and features. We won't be making any _changes_ to this application, but it's important to get comfortable with it because everything we do in our Angular 2 app will be a migration of ng1-dinos. 

## Introducing "ng2-dinos"

Our migrated Angular 2 application will be called **ng2-dinos**. The full source code for the completed app can be cloned from the [ng2-dinos GitHub repo](https://github.com/auth0-blog/ng2-dinos). This app will use the same Node API. From a user's perspective, we want ng2-dinos to be indistinguishable from ng1-dinos. Under the hood, we'll rewrite the app to take advantage of the powerful new features of Angular 2.

Angular 2 brings in several technologies that ng1-dinos does not take advantage of. Instead of a Gulp build, we'll use the [Angular CLI](https://cli.angular.io/) to set up and serve ng2-dinos. We're going to write the app using [TypeScript](https://www.typescriptlang.org/) and [ES6](http://es6-features.org/) which will be transpiled by the Angular CLI. 

We'll follow the [Angular 2 Style Guide](https://angular.io/docs/ts/latest/guide/style-guide.html) for the most part, with a few minor exceptions regarding file structure. For this tutorial, we want to preserve as much of a correlation with ng1-dinos as we can. This will make it easier to follow the migration of features.

## Angular 2 Setup

Let's get started with our ng2-dinos build! 

### Dependencies

You should have [NodeJS with npm](https://nodejs.org) installed already.

Next, install the [Angular CLI](https://github.com/angular/angular-cli) globally with the following command: 

```bash
npm install -g angular-cli
```

> **NOTE:** At the time of writing, the Angular CLI is quite useful but in beta and still very much under development. There may be times when you encounter errors using it. Please consult the [angular-cli GitHub issues](https://github.com/angular/angular-cli/issues/) for resolutions if this occurs.

### Initialize ng2-dinos

The first thing we'll do is initialize our new Angular 2 app and get it running. We'll use the Angular CLI to generate a new project with SCSS support using the following command: 

```bash
ng new ng2-dinos --style=scss
```

Next we can serve the app by running `ng serve` from the root directory of our new app. You should be able to view the site in the browser at [http://localhost:4200](http://localhost:4200). The app should look like this:

![ng2-dinos initialized](https://cdn.auth0.com/blog/ng1-to-ng2/app-works.jpg)

Take a look at the file structure for your new ng2-dinos app. You may notice there are test files and configuration, but **we won't cover testing in this tutorial**. If you'd like to learn more about testing Angular 2, check out [Testing in the Angular docs](https://angular.io/docs/ts/latest/guide/testing.html) and articles like [Angular 2 Testing In Depth: Services](https://auth0.com/blog/angular-2-testing-in-depth-services/) and [Three Ways to Test Angular 2 Components](https://vsavkin.com/three-ways-to-test-angular-2-components-dcea8e90bd8d#.m3gh6p8bb).

### Linting and Style Guide

The Angular CLI provides code linting with [TSLint](https://palantir.github.io/tslint/) and [Codelyzer](https://github.com/mgechev/codelyzer). TSLint provides TypeScript linting and Codelyzer provides TSLint rules that adhere to the [Angular 2 Style Guide](https://angular.io/docs/ts/latest/guide/style-guide.html). We can view all of these linting rules at `ng2-dinos/tslint.json`. We can lint our project using the following command:

```bash
ng lint
```

This tutorial follows the Style Guide and adheres to the default rules in the TSLint config file. It's good to lint your project periodically to make sure your code is clean and free of linter errors.

## Customizing Our Angular 2 Project

Now that we have a working starter project for our ng2-dinos app, we want to restructure it and add some libraries.

### Bootstrap CSS

Let's start by adding the [Bootstrap CSS](http://getbootstrap.com/css/) CDN to the `ng2-dinos/src/index.html` file. We can also add a default `<title>` and some `<meta>` tags:

{% highlight html %}
<!-- ng2-dinos/src/index.html -->

<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>ng2-dinos</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="author" content="Auth0">
  <meta name="description" content="Learn about some popular as well as obscure dinosaurs!">
  <base href="/">

  <!-- Bootstrap CDN stylesheet -->
  <link 
    rel="stylesheet"
    href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
    integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
    crossorigin="anonymous">
</head>

<body>
  <app-root>Loading...</app-root>
</body>
</html>
{% endhighlight %}

> **NOTE:** The code for including the Bootstrap CSS can be found at [Bootstrap CDN](http://getbootstrap.com/getting-started/#download-cdn). We're using version 3.3.7 because it is latest stable at the time of writing. Please note that if you upgrade to version 4.x, there are major changes that would need to be addressed.

### Third Party Libraries

The only third party JavaScript we'll add is a custom build of [Modernizr](https://modernizr.com/). You can grab this file from the Angular 1 ng1-dinos app. We'll be doing quite a bit of copying and pasting since we're doing a migration, so it's best to keep your local ng1-dinos project handy. 

Our minified, custom Modernizr build can be found at [`ng1-dinos/src/assets/js/vendor/modernizr.min.js`](https://github.com/auth0-blog/ng1-dinos/blob/master/src/assets/js/vendor/modernizr.min.js). Create the necessary folder structure in ng2-dinos:

```text
ng2-dinos
  |-src/
    |-assets/
      |-js/
        |-vendor/
          |-modernizr.min.js
```

Angular CLI uses Webpack to bundle local dependencies, so we _won't_ add Modernizr to our ng2-dinos index file. Instead, we'll add a reference to the `angular-cli.json` app's `scripts`:

```js
// ng2-dinos/angular-cli.json

{
  "project": {
    "version": "1.0.0-beta.19-3",
    "name": "ng2-dinos"
  },
  "apps": [
    {...
      "scripts": [
        "assets/js/vendor/modernizr.min.js"
      ],
      ...
```

### Global SCSS

We initialized our project with the `--styles=scss` flag so SCSS is supported and a global `styles.scss` file has already been generated. However, it's currently located at the root of the `ng2-dinos/src/` folder. To maintain a similar file structure with ng1-dinos, it needs to live in `ng2-dinos/src/assets/scss/` instead.

Create a `ng2-dinos/src/assets/scss/` folder and move the `ng2-dinos/src/styles.scss` file into it. Then update the `angular-cli.json` app's `styles` reference:

```js
// ng2-dinos/angular-cli.json

{...
  "apps": [
    {...
      "styles": [
        "assets/scss/styles.scss"
      ],
      ...
```

> **NOTE:** When moving or adding new files, you'll need to stop and restart the Angular CLI server (`Ctrl+C`, `ng serve`) to avoid module build errors. Changes within files are watched and live reloaded, but reorganizing the file structure can break this.

Now let's add some global SCSS from ng1-dinos. We'll copy the files and subdirectories from [`ng1-dinos/src/assets/css/scss/core/`](https://github.com/auth0-blog/ng1-dinos/tree/master/src/assets/css/scss/core) to `ng2-dinos/src/assets/scss/`.

> **NOTE:** If you paid close attention, you'll notice that we're left off a folder in ng2-dinos. Our Angular 1 ng1-dinos app had a `css` folder with `scss` inside it. We don't need the `css` folder in ng2-dinos because of the Angular CLI Webpack bundling.

When we're done, our ng2-dinos global styles file structure should look like this:

```text
ng2-dinos
  |-src/
    |-assets/
      |-scss/
        |-partials/
          |-_layout.vars.scss
           |-_responsive.partial.scss
         |-_base.scss
         |-_layout.scss
         |-_presentation.scss
         |-styles.scss
```

Now we'll `@import` these SCSS files in the ng2-dinos global `styles.scss`:

```scss
/* ng2-dinos/src/assets/scss/styles.scss */

// partials
@import 'partials/layout.vars';
@import 'partials/responsive.partial';

// global styles
@import 'base';
@import 'presentation';
@import 'layout';
```

Restart the Angular CLI server and the background color should change to grey. This is a visual indicator that our new global styles are working. If you inspect the page, you should see the global `<body>` styles applied.

Finally, we'll clean up the `_base.scss` file. Angular 2 doesn't utilize `ng-cloak` so we'll remove the `ng-cloak` ruleset. Afterwards, this is what remains:

```scss
/* ng2-dinos/src/assets/scss/_base.scss */

/*--------------------
       BASICS
--------------------*/

/*-- Cursor --*/

a, 
input[type=button], 
input[type=submit], 
button { 
  cursor: pointer; 
}

/*-- Forms --*/

input[type="text"],
input[type="number"],
input[type="password"],
input[type="date"],
select option,
textarea {
  font-size: 16px;	/* for iOS to prevent autozoom */
}
```

### Update App File Structure

The Angular CLI creates all app files (modules, components, services, pipes, etc.) relative to `ng2-dinos/src/app/`. Note that the ng2-dinos app has a component (`app.component.ts|.html|.scss|.spec.ts`) in the root of this folder. This is our app's root component, but we want to move it into a subfolder to keep ng2-dinos organized, scalable, and correlated with ng1-dinos.

> **NOTE:** Recall that this tutorial won't cover testing, so the `.spec.ts` files have been largely removed from the sample [ng2-dinos repo](http://github.com/auth0-blog/ng2-dinos) to make it simpler to view. The Angular CLI creates these files automatically when generating new architecture. Feel free to keep them in your project and write tests. For brevity, **the rest of the tutorial will no longer mention `.spec.ts` files.** If you're using them, just remember to include them whenever managing files.

Let's move the `app.module.ts` and `app.component[.html|.scss|.ts]` files to a new folder: `ng2-dinos/src/app/core/`. The app file structure should now look like this:

```text
ng2-dinos
  |-src/
    |-app/
      |-core/
        |-app.component[.html|.scss|.ts]
        |-app.module.ts
      |-index.ts

```

This breaks our build. We can fix it by updating the `ng2-dinos/src/app/index.ts` file. If you have a TypeScript extension enabled in your code editor or IDE, you should see syntax highlighting where TypeScript detects problems. We need to update the path to `app.component` like so:

```typescript
// ng2-dinos/src/app/index.ts

export * from './core/app.component';
export * from './core/app.module';
```

> **NOTE:** Always keep in mind that Angular 2 is very interconnected with regard to dependency imports. When we move files, we break references in other places. The CLI tells us where the problems are when we build and TS code hinting in our editor can help too. To address the issue at its root, we can use additional `@NgModule`s to manage dependencies; you can learn more by reading [Use @NgModule to Manage Dependencies in your Angular 2 Apps](https://auth0.com/blog/angular-2-ngmodules/).

That's it for setup! We can officially start migrating ng1-dinos to ng2-dinos.

## Root App Component

In the ng1-dinos Angular 1 app, `ng-app` was on the `<html>` element. This provided Angular control over the `<head>`, allowing us to dynamically update the `<title>` with a custom metadata factory. In Angular 2, our root app component is located inside the `<body>`. Angular 2 provides a service to manage page `<title>`s, so we no longer need an `<html>`-level app root.

As we saw above, the body of our Angular 2 **ng2-dinos** `index.html` file looks like this:

{% highlight html %}
<!-- ng2-dinos/src/index.html -->

...
<body>
  <app-root>Loading...</app-root>
</body>
{% endhighlight %}

In comparison, the body of our Angular 1 **ng1-dinos** `index.html` file looks like this:

{% highlight html %}
{% raw %}
<!-- ng1-dinos/src/index.html -->

...
<body>
  <div class="layout-overflow">
    <div 
      class="layout-canvas" 
      nav-control 
      ng-class="{'nav-open': nav.navOpen, 'nav-closed': !nav.navOpen}">
    
      <!-- HEADER -->
      <header 
        id="header" 
        class="header" 
        ng-include="'app/header/header.tpl.html'"></header>

      <!-- CONTENT (Angular View) -->
      <div
        id="layout-view" 
        class="layout-view" 
        ng-view autoscroll="true"></div>

      <!-- FOOTER -->
      <footer 
        id="footer" 
        class="footer clearfix" 
        ng-include="'app/footer/footer.tpl.html'"></footer>

    </div> <!-- /.layout-canvas -->
  </div> <!-- /.layout-overflow -->
  ...
</body>
{% endraw %}
{% endhighlight %}

The layout markup, header, content, and footer children will now move to the ng2-dinos root component `app.component` (`<app-root>`).

### App Component HTML

Let's stub out `app.component.html`:

{% highlight html %}
{% raw %}
<!-- ng2-dinos/src/app/core/app.component.html -->

<div class="layout-overflow">
  <div
    class="layout-canvas"
    [ngClass]="{'nav-open': navOpen, 'nav-closed': !navOpen}">

    <!-- HEADER -->

    <!-- CONTENT -->
    <div id="layout-view" class="layout-view">
    	...content goes here...  
    </div>

    <!-- FOOTER -->

  </div> <!-- /.layout-canvas -->
</div> <!-- /.layout-overflow -->
{% endraw %}
{% endhighlight %} 

### App Component SCSS

We already included global SCSS for the site layout and off-canvas nav functionality. Because the styles for the layout, header, and navigation interact with each other, we won't componetize all of them in this tutorial. We want to maintain a fairly direct migration path with ng1-dinos, but there will be room for refactoring after the app is migrated. We won't use the `app.component.scss` file so let's delete it.

Now we'll add the `navOpen` boolean we referenced for controlling the `nav-open`/`nav-closed` classes in the `app.component.html` above. We also need to remove the reference to `app.component.scss` since we deleted that file:

```typescript
// ng2-dinos/src/app/core/app.component.ts

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  navOpen: boolean;
  
  constructor() { }
}
```

If we restart the Angular CLI server now and inspect the DOM in the browser, we'll see a `nav-closed` class on the `<div class="layout-canvas">` element. We can use the inspector to change `nav-closed` to `nav-open`. If we do this, we should see the page content slide to the right:

![ng2-dinos app root nav open](https://cdn.auth0.com/blog/ng1-to-ng2/app-root-nav-open.jpg)

Now we're ready to create the header.

## Header Component

We can use the Angular CLI's `g` command to [generate new components](https://github.com/angular/angular-cli#generating-components-directives-pipes-and-services) for our app. Stop the server (`Ctrl+C`) and let's create a header component:

```bash
ng g component header
```

New components are created relative to the `ng2-dinos/src/app` root. The resulting output should resemble the following:

![create Angular 2 component with Angular CLI](https://cdn.auth0.com/blog/ng1-to-ng2/create-header.jpg)

We can see from the terminal output that new files were created, but let's also look at the `app.module.ts` file so we're familiar with everything necessary for adding new components to an Angular 2 app.

`app.module.ts` is our app's primary `@NgModule`. It now looks like this:

```typescript
// ng2-dinos/src/app/core/app.module.ts

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from '../header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

As you can see, the `HeaderComponent` class is imported and has also been added to the `@NgModule`'s `declarations` array.

### Add Header Element to App Component HTML

If we open the `header.component.ts` file, we can see that the `@Component`'s `selector` is `app-header`. We generally want custom elements to be hyphenated as per the [W3C spec for custom elements](http://w3c.github.io/webcomponents/spec/custom/#prod-potentialcustomelementname). This is also covered by the [Angular 2 Style Guide](https://angular.io/docs/ts/latest/guide/style-guide.html#!#02-07). The Angular CLI generates new component selectors with a prefix. By default, this prefix is `app`. This way, we won't get conflicts when calling this component since the  `<header>` element already exists. 

Let's add `<app-header>` to our `app.component.html`:

{% highlight html %}
<!-- ng2-dinos/src/app/core/app.component.html -->

...
    <!-- HEADER -->
    <app-header></app-header>
...
{% endhighlight %}

### Header Component HTML

Let's add our markup to the header component. Open `header.component.html` and add HTML for the header, off-canvas  toggle, and navigation menu:

{% highlight html %}
<!-- ng2-dinos/src/app/header/header.component.html -->

<header id="header" class="header">
  <div class="header-page bg-primary">
    <a class="toggle-offcanvas bg-primary" (click)="toggleNav()"><span></span></a>
    <h1 class="header-page-siteTitle">
      <a href="/">ng2-dinos</a>
    </h1>
  </div>

  <nav id="nav" class="nav" role="navigation">
    <ul class="nav-list">
      <li>
        <a href>Dinosaurs</a>
      </li>
      <li>
        <a href>About</a>
      </li>
      <li>
        <a href="https://github.com/auth0-blog/sample-nodeserver-dinos">Dino API on GitHub</a>
      </li>
    </ul>
  </nav>
</header>
{% endhighlight %}

This is mostly standard markup. The only Angular 2 functionality so far is a `click` handler on the link to toggle the off-canvas menu. We'll add more Angular later once we have multiple views and routing in place.

### Header Component SCSS

First grab the Angular 1 [`ng1-dinos/src/assets/css/scss/components/_nav.scss`](https://github.com/auth0-blog/ng1-dinos/blob/master/src/assets/css/scss/components/_nav.scss) file and copy it into the ng2-dinos header component folder.

Now let's `@import` it and add SCSS to `header.component.scss`:

```scss
/* ng2-dinos/src/app/header/header.component.scss */

/*--------------------
       HEADER
--------------------*/

@import '../../assets/scss/partials/layout.vars';
@import 'nav';

.header-page {
  color: #fff;
  height: 50px;
  margin-bottom: 10px;
  position: relative;

  &-siteTitle {
    font-size: 30px;
    line-height: 50px;
    margin: 0;
    padding: 0 0 0 50px;
    position: absolute;
      top: 0;
    text-align: center;
    width: 100%;

    a {
      color: #fff;
      text-decoration: none;
    }
  }
}
```

We need to make one modification in the `_nav.scss` file. We'll change the `.nav-open &` selector to `:host-context(.nav-open) &` instead:

```scss
/* ng2-dinos/src/app/header/_nav.scss */

...
  :host-context(.nav-open) & {
    span {
      background: transparent;

      &:before,
      &:after { ...
```

This has to do with how Angular 2 encapsulates DOM node styles. If you've ever used [native web components](http://webcomponents.org/) or [Google Polymer](https://www.polymer-project.org/), you should be familiar with shadow DOM encapsulation in components. Regardless, you may want to read about [View Encapsulation in Angular 2](http://blog.thoughtram.io/angular/2015/06/29/shadow-dom-strategies-in-angular2.html).

In a nutshell, Angular 2's default encapsulation mode is `Emulated`. This means styles are scoped to their components with unique attributes that Angular 2 creates. Having component-isolated styles is often very useful, except for when we want to reach up the DOM tree and have our component styles affected by ancestors.

We don't need to change [View Encapsulation](https://angular.io/docs/ts/latest/guide/component-styles.html#!#view-encapsulation) in the header component class though. There is only one reference to an ancestor in `_nav.scss`. We can use [special selectors](https://angular.io/docs/ts/latest/guide/component-styles.html#!#special-selectors) like `:host-context()` to look up the cascade instead.

Now the component CSS can access the `.nav-open` class up the DOM tree from the header component.

> **NOTE:** Recall that the site layout and navigation functionality styles remained global rather than being componetized in `app.component.scss` (instead we deleted that file). We could have moved the sections of the global `_layout.scss` into different child components and replaced references to parent styles with `:host-context()`. We didn't do this because the goal of this tutorial is to demonstrate _as close to a 1:1 migration as possible_ while covering many topics. When we're finished migrating the entire app, I encourage you to refactor where desirable! We'll highlight refactoring suggestions in the summaries of each part of this tutorial.

### Component Interaction

Let's make our header component functional. We need the header to communicate with the root app component to implement the off-canvas navigation.

#### Header Component TypeScript

Open the `header.component.ts` file. We'll implement component communication with [inputs/outputs](https://angular.io/docs/ts/latest/guide/template-syntax.html#!#inputs-outputs) and events. Remember that we added a `click` event handler to our header HTML that looked like this:

{% highlight html %}
<a class="toggle-offcanvas bg-primary" (click)="toggleNav()"><span></span></a>
{% endhighlight %}

> **NOTE:** `[]`, `()`, and `[()]` are "binding punctuation" and refer to the direction of data flow. `()` indicates a binding to an event. You can read more about [binding syntax in the Angular 2 docs](https://angular.io/docs/ts/latest/guide/template-syntax.html#!#binding-syntax).

There are a few things we need to do to make this event handler functional.

```typescript
// ng2-dinos/src/app/header/header.component.ts

import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() navToggled = new EventEmitter();
  navOpen: boolean = false;
  
  constructor() { }
  
  ngOnInit() {
  }

  toggleNav() {
    this.navOpen = !this.navOpen;
    this.navToggled.emit(this.navOpen);
  }

}
```

The header component is a child of the root app component. We need a way to notify the parent when the user clicks the hamburger to open or close the menu. We'll do this by [emitting an event that the parent can listen for](https://angular.io/docs/ts/latest/cookbook/component-communication.html#!#child-to-parent). 

We'll import `Output` and [`EventEmitter`](https://angular.io/docs/ts/latest/api/core/index/EventEmitter-class.html) from `@angular/core` and then create a new event emitter `@Output` decorator. We also need a way to track whether the navigation is open or closed, so we'll add a boolean `navOpen` member that defaults to `false`.

Now we need to define the `click` event handler. We already named this function `toggleNav()` in our `header.component.html`. The function will simply toggle the `navOpen` boolean and emit the `navToggled` event with the current state of `navOpen`.

#### Header Communication with App Component

Next we need to listen for the `navToggled` event in the parent. Add the declarative code to `app.component.html`:

{% highlight html %}
<!-- ng2-dinos/src/app/core/app.component.html -->

...
    <!-- HEADER -->
    <app-header (navToggled)="navToggleHandler($event)"></app-header>
...
{% endhighlight %}

Now we'll create the `navToggleHandler($event)` in `app.component.ts`:

```typescript
// ng2-dinos/src/app/core/app.component.ts

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  navOpen: boolean;

  navToggleHandler(e: boolean) {
    this.navOpen = e;
  }
}
```

If we build now, we should be able to open and close the off-canvas navigation by clicking the hamburger icon. When open, the icon should animate into an X and the app should look like this:

![Angular 2 app with off-canvas navigation](https://cdn.auth0.com/blog/ng1-to-ng2/oc-nav-short.jpg)

Everything is working correctly but this doesn't look very good. Let's fix it!

## Observables and Properties

In ng1-dinos, all off-canvas nav functionality was handled by  [`ng1-dinos/src/app/core/ui/navControl.dir.js`](https://github.com.com/auth0-blog/ng1-dinos/blob/master/src/app/core/ui/navControl.dir.js), including menu toggling and layout height. We've migrated the navigation functionality but we're still missing the layout height fix.

We want our minimum page height to be the height of the window no matter how tall the content is. This way, the off-canvas navigation will never look prematurely cut off. To address this, we'll use an RxJS observable and the `window.resize` event.

> **NOTE:** In ng1-dinos, we referenced the `navControl` directive's DOM `$element` and applied `min-height` styles with JS. We did this to [avoid an additional watcher](https://www.alexkras.com/11-tips-to-improve-angularjs-performance/#watchers) in Angular 1. However, [Angular 2's change detection](https://auth0.com/blog/understanding-angular-2-change-detection/) is vastly improved so we can shift our concerns over watchers to other things instead.

Angular 2 strongly recommends _avoiding_ direct DOM manipulation. There is an [`ElementRef`](https://angular.io/docs/ts/latest/api/core/index/ElementRef-class.html) class that provides access to the native element, but using it is not recommended and is usually avoidable. We'll use [property data binding](https://angular.io/docs/ts/latest/guide/template-syntax.html#!#binding-syntax) instead.

### Add Observable to App Component TypeScript

Our `app.component.ts` will look like this:

```typescript
// ng2-dinos/src/app/core/app.component.ts

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  navOpen: boolean;
  minHeight: string;
  private initWinHeight: number = 0;

  ngOnInit() {
    Observable.fromEvent(window, 'resize')
      .debounceTime(200)
      .subscribe((event) => {
        this.resizeFn(event);
      });

    this.initWinHeight = window.innerHeight;
    this.resizeFn(null);
  }

  navToggleHandler(e: boolean) {
    this.navOpen = e;
  }

  private resizeFn(e) {
    let winHeight: number = e ? e.target.innerHeight : this.initWinHeight;
    this.minHeight = `${winHeight}px`;
  }
}
```

Let's talk about the code above.

First we'll import dependencies. We're going to use the `OnInit` [lifecycle hook](https://angular.io/docs/ts/latest/guide/lifecycle-hooks.html) from `@angular/core` to manage the observable and implement initial layout height. Then we need `Observable` from the [RxJS library](https://github.com/Reactive-Extensions/RxJS) which is packaged with Angular 2.

We're using an [RxJS observable](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html) to subscribe to the `window.resize` event and execute a debounced function that sets a `min-height`. The `window.resize` event doesn't automatically fire on page load, so we need to trigger the handler manually in `ngOnInit`.

> **NOTE:** This tutorial does _not_ cover Functional Reactive Programming (FRP) and RxJS in depth. If FRP and RxJS are new to you, please read [Understanding Reactive Programming and RxJS](https://auth0.com/blog/understanding-reactive-programming-and-rxjs/), or for a more Angular 2-centric approach: [Functional Reactive Programming for Angular 2 Developers - RxJs and Observables](http://blog.angular-university.io/functional-reactive-programming-for-angular-2-developers-rxjs-and-observables/).

### Add Property to App Component HTML

We can then bind `minHeight` to the `[style.min-height]` property on the layout canvas element in `app.component.html`:

{% highlight html %}
{% raw %}
<!-- ng2-dinos/src/app/core/app.component.html -->

...
  <div
    class="layout-canvas"
    [ngClass]="{'nav-open': navOpen, 'nav-closed': !navOpen}"
    [style.min-height]="minHeight">
...
{% endraw %}
{% endhighlight %}

> **NOTE:** Angular 2 binds to **DOM properties**, _not_ HTML attributes. This may seem counter-intuitive because we're declaratively adding things like `[disabled]` or `[style.min-height]` to our markup, but these refer to properties, not attributes. Please read [Binding syntax: An overview](https://angular.io/docs/ts/latest/guide/template-syntax.html#!#binding-syntax) for a mental model shift regarding this.

Now our app should be the height of the window even if the content is short. If the navigation grows longer than the content, the CSS we imported from ng1-dinos will ensure that it gets a scrollbar. With the menu open, our app should look like this in the browser:

![Angular 2 app with off-canvas navigation](https://cdn.auth0.com/blog/ng1-to-ng2/oc-nav-full.jpg)

## Footer Component

We have a header, so let's add the simple footer from ng1-dinos too. Run the `ng g` command to create a new component:

```bash
ng g component footer
```

### Footer Component TypeScript

The `footer.component.ts` should be very simple. There's no dynamic functionality; we just need to create the component and display it. Let's simplify the component:

```typescript
// ng2-dinos/src/app/footer/footer.component.ts

import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {}
```

### Footer Component HTML

We can copy the footer markup from [`ng1-dinos/src/app/footer/footer.tpl.html`](https://github.com/auth0-blog/ng1-dinos/blob/master/src/app/footer/footer.tpl.html) to our ng2-dinos `footer.component.html` file. We just need to update the link so that it references ng2-dinos instead of ng1-dinos:

{% highlight html %}
<!-- ng2-dinos/src/app/footer/footer.component.html -->

<p>
  <small>MIT 2016 | <a href="https://github.com/auth0-blog/ng2-dinos">ng2-dinos @ GitHub</a></small>
</p>
{% endhighlight %}

### Footer Component SCSS

The ng1-dinos footer SCSS comes from [`ng1-dinos/src/assets/css/scss/components/_footer.scss`](https://github.com/auth0-blog/ng1-dinos/blob/master/src/assets/css/scss/components/_footer.scss). We need to add `@import`s so that our Angular 2 component can access the layout variables and responsive mixins. We're also going to change the `.footer` class to `:host` since this class no longer exists and we need to style the host element and not children of the component:

```scss
/* ng2-dinos/src/app/footer/footer.component.scss */

/*--------------------
        FOOTER
--------------------*/

@import '../../assets/scss/partials/layout.vars';
@import '../../assets/scss/partials/responsive.partial';

:host {
  padding: $padding-screen-small;
  text-align: center;

  @include mq($large) {
    padding: $padding-screen-large;
  }
}
```

### Add Footer to App Component HTML

Finally, we'll add the `<app-footer>` element to the `app.component.html`:

{% highlight html %}
<!-- ng2-dinos/src/app/core/app.component.html -->

...
    <!-- FOOTER -->
    <app-footer></app-footer>
...
{% endhighlight %}

Restart `ng serve` and we should see the simple footer in our app.

## Aside: Refactoring Suggestions

As mentioned before, this is a migration tutorial so one of our goals is to maintain close to 1:1 correlation with ng1-dinos while still implementing Angular 2 best practices. This will be the continued goal in subsequent parts of the tutorial. However, there are refactoring opportunities that we shouldn't ignore.

> **NOTE:** You may want to wait to refactor until you complete all parts of the tutorial.

Here is my refactoring suggestion from part one of our migration tutorial:

* Consider componetizing more global SCSS, breaking files like `_layout.scss` up into respective `*.component.scss` files and utilizing selectors like `:host` and `:host-context()`.

Keep an eye out for more refactoring suggestions in subsequent lessons.

## Conclusion

We now have basic architecture for our ng2-dinos app! We've successfully migrated global styles, custom off-canvas navigation, header, and footer. We've covered Angular 2 setup, components, child-to-parent component communicaton, binding syntax, and even touched on observables. If we run `ng lint`, our app should be free of linter errors.

In the next parts of the tutorial, we'll enable navigation by creating page components and implementing routing. Then we'll call the API and use HTTP and observables to get and display dinosaur data and detail subpages, create type models, learn about filtering, implement error handling, and show loading states. We'll even address authentication.

Migrating an existing application can be a great way to learn a new framework or technology. We experience familiar and new patterns and implement real-world features. Please join me again for parts two and three of Migrating an Angular 1 App to Angular 2 (coming soon)!