---
layout: post
title: "ng-conf 2017 Summary - Day 3"
description: "Angular v4, realtime, rendering on the server, best practices, and more. Read about the sessions from ng-conf 2017 (April 7) Day 3."
date: 2017-04-10 8:30
category: Conference, Growth
banner:
  text: "Auth0 makes it easy to add authentication to your Angular application."
author:
  name: "Kim Maida"
  url: "https://twitter.com/KimMaida"
  mail: "kim.maida@auth0.com"
  avatar: "https://en.gravatar.com/userimage/20807150/4c9e5bd34750ec1dcedd71cb40b4a9ba.png"
design:
  image: https://cdn.auth0.com/blog/ng-conf-2017/logo.png
  bg_color: "#000000"
tags:
- angular
- javascript
related:
- 2017-04-05-ngconf2017-summary-day1
- 2017-04-07-ngconf2017-summary-day2
---

**TL;DR:** Learn about the topics covered by speakers at [ng-conf 2017](https://www.ng-conf.org/) on April 7, 2017 (Day 3 of 3).

---

## ng-conf 2017

The final day of ng-conf 2017 was comprised of single track speaker sessions. You can read about them here.

twitter: #ngmovie

---

## Keynote

**Speakers:** [Brad Green](https://twitter.com/bradlygreen), [Rob Wormald](https://twitter.com/robwormald)
  
### Major Takeaways (TL;DR)

* Almost 200 Google apps are built with Angular.
* Google's internal process does not mirror the community's because Google has much more stringent rules regarding tooling and language use.
* The Angular team got TypeScript approved for use at Google, a process that took 2 years.
* Performance on mobile is extremely important and Angular platform-server (formerly Angular Universal) helps to solve this.

### Full Summary

> _"The business of Google actually runs on Angular."_ —Brad Green

At Google, internal apps for product approval, hiring, promotions, payroll, bug filing, and more are all written in Angular. All total, there are almost 200 of these apps. Google uses automatic Closure to TypeScript and has been doing typed JS for over a decade. Google has built courses to help developers learn Angular and 59 software engineers at Google volunteered to teach these courses. Google also has public-facing apps that are written in Angular, including Cloud Platform, Google Analytics, and more.

When Google didn't open source their software, many people copied and rebuilt it in the open source space. [Open sourcing](https://opensource.google.com/) lets Google receives credit, community tools like linters, training offered by the community, less ramp-up when hiring, and quality benefits from seeing diverse use cases from outside of Google.

Google is allowed to use a certain set of canonical languages. Closure-style JavaScript uses types in comments ([Closure](https://developers.google.com/closure/) is open-source). The Google team collaborated with Microsoft to contribute to TypeScript: this was a wonderful solution on the outside, but couldn't be used on projects inside Google. Google has a language approval process that includes the following steps:

1. Apply
2. Fulfill checklist
3. Prove that the new language had benefits over and above the existing languages
4. Committee
5. Approval

Nobody had ever actually done this before. Google had to go through this process (it took 2 years!) to add TypeScript to the languages approved at Google.

The benefits of TypeScript are:

* Inline types (easier to read / write)
* Fast recompile
* Decorators
* Built tooling so that it could be Closure compatible
* IDE support
* Automatic build files
* Automated conversion to make it easier to migrate Closure to TS
* A vibrant community outside of Google

Google still can't use the Angular CLI. Google has their own build tools: Blaze and Closure. Currently there is an open source version of Blaze called [Bazel](http://bazel.build).

There is a project inside the Angular team called ABC: Angular with Bazel and Closure. Google is going to start implementing this on the Angular core and then move it to Angular Material and then early adopters to address big scale. 

Google is trying to move the outside world and the way things are done within Google closer together.

> _"**Platform**: a raised level surface on which people or things can stand. / a declared policy of a group."_

The Angular team is trying to build "apps that people love to use". But how do we measure love?

Rob Wormald discussed some statistics: 

* 53% of mobile visits are abandoned if it takes more than 3 seconds to lead.
* 1 out of 2 people expect a page to load in less than 2 seconds.
* 77% of mobile sites longer than 10 seconds to load.
* The average mobile site takes 19 seconds to load on a 3G connection.
* Sites that are interactive in 5 seconds or less see longer average sessions, lower bounce rates, and higher ad viewability.

> _"The whole point of frameworks should be to make delivering great things easier."_ —Rob Wormald

The team's primary focus when starting with Angular was to have interactive apps that are fast and reliable on mobile. However, there are other use cases that weren't considered as much, such as content-first sites (such as blogs). The question arose: what if we could use Angular to manage our entire web presence?

This resulted in `@angular/platform-server` (formerly Angular Universal). Interactive apps that load more swiftly with an app shell is a broadly applicable use case: everyone wants faster apps. We can render the app shell on the server at build time. Transitioning between the server and client is difficult, and Angular wants to make it as easy as possible to link the two. The app shell might consist of the header, menu, footer, sidebar, so the user gets to see the outer container without waiting. The app shell with the service worker takes this further so that instead of going out to the network, it's installed on your device.

Angular's router works the exact same on the server as it does on the client. This means we can pre-render pages on the server: this is good for mixed content sites with static sections and interactive sections.

Rob talked about Google Accelerated Mobile Pages (AMP) are a new idea where Google has defined a very strict set of rules about what you can do on a website to promote a superior experience. This includes no interactivity, no third-party JavaScript, etc. If you adhere to these rules, you can show up in the Google carousel in search results. Rob then discussed the idea of combining AMP + Progressive Web Apps, since service workers _are_ allowed with AMP.

---

## Angular Router: Authentication & Authorization

Shai Reznik had volunteers enact a stage play that he directed on the topic of authentication and authorization with the goal of learning the process of securing your components.

> **Caveat**: routing with authentication and authorization is purely cosmetic; security should also be done on the server side!

The main topics were:

* Authentication: verifying identity
* Authorization: who is allowed to see and do what
* Angular guards apply the logic that decides if a visitor can see the component

![Angular authentication and authorization with the router - stage play with Shai Reznik](https://cdn.auth0.com/blog/ngconf17/shai.jpg)

To see the full stage play, view [the ng-conf 2017 livestream segment here](https://youtu.be/EzRZOoRXNUM?t=55m30s).

---

## Upgrading Enterprise Angular Apps

Victor Savkin talked about methodologies for upgrading enterprise Angular apps:

Enterprise apps often need to be upgraded gradually step-by-step / component-by-component. [NgUpgrade](https://angular.io/docs/ts/latest/guide/upgrade.html#!#upgrading-with-the-upgrade-module) bootstraps an AngularJS application in a specific way so that the AngularJS injector sees the Angular injector so the two can live alongside each other. This allows you to bootstrap the AngularJS app from the Angular app. Finally, there is an upgrade shell strategy which involves taking an existing AngularJS app and upgrading the root component.

### Vertical Slicing Upgrade Strategy

Often it's not feasible to upgrade the whole app, but we can do it route by route or feature by feature. This way, you only have to deal with one version of Angular at a time: each screen is either fully AngularJS or fully Angular. This is easy to debug and understand, it encapsulates migration, and is fast, but can have code duplication and is coarse-grained.

### Horizontal Slicing Upgrade Strategy (bottom-up)

In this strategy, you upgrade child components first, then upgrade the components that use those components, etc. If you open any screen, you'll be viewing with both versions of the framework at the same time. This is easy to get started with and doesn't have code duplication, but is harder to debug and understand, coordinate with multiple teams, hinders refactoring, and hinders performance.

### Managing URL

URL is a global, mutable object that the user can interact with directly, making management difficult during a gradual migration. With single ownership of routes, sibling outlets can be used to manage this: the AngularJS `ng-view` and Angular `router-outlet` would both be present, but only one is active at a time. With mixed ownership, one part of the URL is managed by AngularJS and the other is managed by Angular. We can control this by writing a custom URL handling strategy and extracting and merging URLs. 

> **Note:** These same principles apply to state management.

### Lazy Loading AngularJS

With the new router, we can lazy load easily. We can put the existing (legacy) AngularJS app in a separate bundle and only load it when necessary. We can use Angular to load a module that bootstraps AngularJS. This is very fast and doesn't require a download of AngularJS until it's needed. It can be preloaded in the background and then we can bootstrap it after preloading. This is difficult and needs to be thought through carefully.

---

## Angular with NativeScript and Firebase

Jen Looper, Tara Manicsic, and TJ Vanoll talked about building a realtime voting app providing "Emoji as a Service" called [EmotiNg](https://emoting.me/).

> _"Building realtime apps is now easy."_

Realtime response behavior is becoming an expectation of users. For example, Dropbox and Slack have realtime syncing across mobile (native) and web apps. Traditionally, building realtime apps has been really hard. This is now much easier, ie. with Angular, [NativeScript](https://www.nativescript.org/), [Firebase](https://firebase.google.com/). EmotiNg is both a web and native app.

EmotiNg uses NativeScript. With native, the sky's the limit, allowing you to build cross-platform with ease. The magic in the background is observables with the Firebase plugin so that data is watched in realtime. There are many community-sourced plugins that make the native experience smoother.

### Why web?

We have the ability and technology to sync in realtime between a native app and a web app. AngularFire 2 from Firebase can be implemented in Angular and provides realtime binding. Kendo UI was then used to implement chart visualizations. Check out the [full presentation and EmotiNg demo here](https://www.youtube.com/watch?v=j2S5OrMUj9g).

---

## Language Service

The Angular Language Service can be installed as an extension in common IDEs. Autocompletion and code help is provided as you would expect in any language intelligence. TypeScript version 2.3 has a Language Service plugin.

### How does the language service work?

The editor starts a separate process to do a remote procedure call (RPC) and any changes you make to the file are sent across to the RPC. Any resulting completion or diagnostic messages come back across the RPC. The problem right now is that there is also a separate process doing the same thing for TypeScript, maintaining almost all of the same information. With 2.3, Angular Language Service will run as a plugin for TypeScript and only one process will be run.

Language Service completion workflow takes the HTML AST (Abstract Syntax Tree) and the template AST and assesses the meaning of each element and associated components. It can then assess where the cursor is located within the template AST. From this, it asks what can be a child of this and offers a completion list of options. If the cursor is in an interpolation expression, the template parser has to get involved. The expression AST is generated by the compiler and the language service inserts what's missing and then determines what could potentially be there. TypeScript Language Service then gets involved to determine the list of possible members to autocomplete.

Rolling your own editor integration was also briefly discussed. The Language Service host interface would need to be implemented to create an extension for your editor of choice. If you already have an integration for TypeScript, you can use a TypeScript host and therein create an Angular Language Service host.

In the future, the Language Service wants to:

* Unify architecture with TypeScript
* Be able to find all references
* Refactor/rename
* Implement quick fixes
* Provide improved diagnostics
* Add support in more editors

---

## Form Validation
  
For every form element in the DOM, there's a corresponding form control object. Validators are just functions that take a form control instance to return validation errors or `null`. Angular allows you to build your own custom validators. When composing multiple validators, it's helpful to return error maps rather than a simple boolean.

In some cases, you have server validation. Async validators can handle this and are simply functions that return an observable from a request. Observables need to be completed (`http.get` does this for you).

We can also style based on validation status. Classes are applied that mirror validation status so that styling can be easily added.

### Upcoming Features

The entire validation process can be visualized as streams like [RxMarbles](http://rxmarbles.com/).

You can insert your own validation chain `.let()` operator, which takes a function that takes an observable and returns an observable. Your application then completely controls the order and timing of your validation. This allows low-level customizations if that's what you need, and in addition, opens the possibility for push updates for realtime validation.

---

## TypeScript II - Functional Programming

Sean May presented a strategy guide to functional programming in TypeScript.

### Basics

**Pure functions** don't modify anything outside their own scope. This results in no races, no surprises, referential transparency, and easy debugging.

**Higher-order functions** are functions that return a function or functions that accept a function.

Being explicit is not always a great thing with type-checking and TypeScript. This type of programming is reusable, configurable, has good separation of concerns, and can be combined. Logic is separated from the flow and the pattern is easy to pick up and chain.

### Combine functions as a pipeline for data

Referential transparency means that a function call can be replaced by a value represented by its return. You can simplify this with `compose`, ie.: `const compose = (g, f) => (x) => g(f(x));` Compose takes three generic arguments and returns a transformed function. We can compose composed functions; this is just input and output and TypeScript will be happy with it.

> **Note:** Mapping is not about loops at all: it's about going from type A to type B.

This becomes easy to reason about, with practice. Data flow is predictable. It's easy to add or change links in the chain and easy to compose functions in a chain. If each link is pure, the whole chain is pure and it's testable.

* `Readonly` is a useful type that is an interface which will take in whatever generic you pass to it and it will tell the compiler that all members of that type are read-only.
* `Pick` picks a subset of an object with the types intact.
* You can build a `record` to specify types of keys.

---

## Reducing Package Size and Complexity with NgModule
  
[AngularFire2](https://github.com/angular/angularfire2) is the official Angular library for Firebase. Compared to AngularJS, Angular is less magical and has a smaller footprint with tree shaking. In other frameworks, complexity is often hidden way under the surface so it takes a lot of experience to increase the performance of your app.

[Firebase](https://firebase.google.com/) is Google's backend business service. Firebase has taken over most of Google's mobile and Java SDKs. Firebase has monolithic SDKs for iOS, Android, and the mobile web. The keystone of Firebase is its realtime database. The database streams any writes to all connected clients within a matter of milliseconds.

In AngularFire2, observables wrap callbacks and promises. This is a more Angular-style API. AngularFire2 uses observables throughout. Any data that changes will stream to you. 

### So what's the problem?

Firebase JS SDK contains realtime database, authentication, cloud storage, cloud messaging, and undetermined features in the future. This results in a large package size containing things users may not necessarily be using.

By using `@NgModule`, package size was reduced to 30% of what it used to be. The Firebase JS SDK is already modular. During compilation, it can tree shake and unused modules can be left out. Package size is therefore reduced and we can increase functionality: less is more.

In addition to NgModule, other steps can be taken to reduce package size. Firebase is proposing taking authentication and just returning an observable. If package size and complexity are reduced, more Angular-specific behavior can be introduced, such as route guards, lazy loading, and universal support.

---

## Addicted to AngularJS
  
Many projects are big apps maintained by small teams and they don't have the time or resources to re-develop AngularJS apps in Angular.

NgUpgrade allows you run AngularJS and Angular at the same time in a hybrid application. In a hybrid app, each element is owned by _either_ AngularJS or Angular.

1. **Bootstrap a hybrid app**: two frameworks running side by side with injectors that know about each other.
2. **Downgrading components**: "downgrade" means to make an Angular component or service available to AngularJS. Downgrade components and use them in AngularJS HTML templates. Syntax and structural directives still need to be in AngularJS.
3. **Downgrading services**: use a helper function that ensures the instance you get in AngularJS is the exact same instance you use in Angular.
4. **Upgrading components**: "upgrade" means to make an AngularJS component and make it available to Angular. AngularJS components can be wrapped by an Angular component facade. 
5. **Upgrading services**: create a provider inside Angular that gives it access to the same instance.

> **Note:** ngUpgrade is still in active development.

[Hybrid app available at this repo.](https://github.com/angular-upgrade-examples/todo-app)

---

## Angular Pre-Rendering (universal rendering)

**Pre-rendering** refers to rendering an Angular application in whole or in part before sending HTML to the browser. Angular Universal has graduated into a first-class part of Angular and has been brought into core as `platform-server`.

### Why pre-render?

If we have a blog, some of our priorities might be:

* Fast loading
* Scrapeable
* Crawlable

Ahead of Time (AOT) and lazy loading make Angular load pretty quickly, but there's improvement to be had between HTML loading and Angular bootstrapping. Key metrics are "time to first meaningful paint" and "time to interactive". With the standard Angular CLI, first meaningful paint and interactive are both only available after HTML has loaded _and_ bootstrapping is completed. With pre-render, first meaningful paint is after HTML is loaded and interactive is after bootstrapping.

Another consideration is that social scrapers prefer specific meta tags, canonical URLs, etc. Search engine crawlers want to see a page title, meta description, and canonical URLs. They also look at page content. Crawlers will execute JavaScript, but pre-rendering is still recommended.

### Pre-rendering in Angular 4.x

When pre-rendering, a promise of fully rendered HTML is returned. The `AppServerModule` brings in the app module and server module. The server module overrides platform-specific features.

* **Render**: applications can be partially or fully rendered at build time or request time.
* **Serve**: ideally you've already got a page rendered and just need to kick it back to the browser.
* **Bootstrap and swap**: pre-rendered document is served and partial content is present. When finished bootstrapping, a dynamic element replaces a static placeholder.
* **Record and replay**: the pre-rendered page is just HTML and CSS, and JS starts loading. If a user interacts, you can either only load items that can't be interacted with, or you can record and replay interactions, ie., with the [preboot library](https://github.com/angular/preboot). This should be used sparingly and consciously.

---

## Packaging Angular Libraries

Components are the cornerstone of Angular. Application developers would like to be able to `npm` install libraries, import components into their application module, and take advantage of Ahead of Time compilation (AOT) and tree shaking.

### AOT Support

When surveying existing libraries, it was discovered that not all of them support AOT compilation. The requirements for supporting AOT are:

* Type definitions (`*.dts` files)
* Metadata files (`*.metadata.json`: these come from the Angular compiler)

### Basic Optimizations

A strategy for optimization is to intelligently concatenate files into a single file to publish fewer ES modules. [Rollup](https://rollupjs.org/) is the suggested tool to implement this. The result of running Rollup is a Flat ECMAScript Module (FESM). Finally, inline templates and styles are recommended.

### Avoid a "Kitchen Sink" NgModule

You should avoid re-exporting all components in NgModule. This completely breaks tree shaking, meaning the entire library is included in your bundle even if you only use one module. One NgModule per component is recommended to enable tree shaking.

### Advanced Optimizations

Closure Compiler is optimized for ES2015 sources. It's recommended to publish FESMs with ES5 as well as with ES2015.

---

## Firebase and Google Cloud Functions

"Serverless" does not actually mean _no servers_. **Serverless** means abstracting all the server-ish concerns away from the developer (such as load balancing, networking, pubsub, etc.).

Serverless is:

* Fully managed: you don't have to think about servers
* Only pay for what you use and no up front provisioning 
* Scales up or down as necessary

[Firebase](https://firebase.google.com/) is "Backend as a Service" (BaaS). Firebase is multiplatform and provides a realtime database with realtime synchronization and offline support to reconcile your requests from when you were disconnected. Firebase also handles authentication out of the box, including anonymous login, email and password, social, and existing auth system integration.

[Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging/) is a no-cost cross-platform messaging solution using notifications to drive user interactions with versatile messaging targeting.

If you need code that runs on the server and not in the client, this would traditionally be done with a server communicating with an API.

### Serverless

"Not-Yet-a-Service-as-a-Service" means that you're creating business logic as a service: [Google Cloud Functions](http://cloud.google.com/functions) can provide Functions as a Service (FaaS).

Cloud events can trigger cloud functions. Cloud storage, Firebase database, analytics, and auth can also execute serverless functions. HTTP functions can integrate with cloud functions, ie., Google Home, If This Then That, etc.

**Cold start** refers to the fact that because the cloud functions aren't running all the time, the first time, it may take a significant amount of time to run.

---

## Best Practices

Stephen Fluin shared tips to reduce bundle size for faster applications.

### 1. Measure your bundles

The NPM package [`source-map-explorer`](https://www.npmjs.com/package/source-map-explorer) will generate source map files in a build. You can then inspect your bundle. Looking at source maps gives you an understanding of what is filling up the bundle.

### 2. Use Ahead of Time (AOT) compilation

Applications shipped to production need to use AOT. The compiler itself is more than twice the size of the rest of Angular. With AOT, `ngFactory` files are shipped _instead_ of the compiler.

### 3. Stay up to date

You can take advantage of improvements to bundle size by simply staying up to date with Angular. Igor Minar manually assessed a bundle and detailed which items were too large. Then improvements were made to remove those items from the bundle. By keeping up to date, you can gain from all the newest improvements to the framework.

### 4. Import carefully

It's easy to take a bundle that was reasonable before and make it unreasonable by importing incorrectly. For example, importing RxJS bare (`import 'rxjs'`), you add every single feature and operator in RxJS. Instead, selectively include the pieces you need. The same is true of Angular Material. Using the source map explorer, you can determine if there are better ways to import libraries. 

> **Note:** Tree shaking will help long term, but in general the tools that we use every day aren't capable of doing this at this time. We do expect this to get better in the future.

### 5. Lazy load

Lazy loading is very easy. You take a module of your application and all its dependencies and refer to the module in routes. 

Recommendations:

* Lazy load your home screen.
* Lazy load your admin section.
* Lazy load your content views.
* Lazy load **everything**.

If you lazy load every route, everything is taken out of the critical path, allowing deferral of extra processing and a fast load of the app shell. This way users only pay for the pieces of the app that they need.

### 6. Polyfill responsibly

Take a look at your userbase and their demographics and then go through the Angular CLI polyfill file and make adjustments as necessary. For example, `es6/reflect` and `es7/reflect` aren't necessary with AOT.

[For more best practices, check out the Angular styleguide here.](https:/angular.io/styleguide)

---

## Angular Team Panel

The conference concluded with an Angular core team panel where the audience could ask questions. Here are some key takeaways from this Q&A session.

![Angular core team panel](https://cdn.auth0.com/blog/ngconf17/angularteam.jpg)

### What if you can't upgrade from AngularJS to Angular?

If you _can't_ upgrade from AngularJS to Angular, don't be under the impression that you _need_ to upgrade. AngularJS will continue to be supported and if you don't have the time to upgrade to Angular, then you shouldn't feel that you need to. AngularJS is not going to go away. Backporting useful features should help to bring new patterns to AngularJS and the Angular team wants to make it easier and easier to upgrade.

### NgModules and components

NgModules are used at the compiler level to understand dependencies. This is an organizational feature. There's a distinction between a component and a compiled component and the need for a registry between them goes away in TypeScript v2.3.

### Getting involved in the Angular design process

All the source code at Google is in a single repository. Self-driving cars are next to Gmail and Angular. Google has a build system that builds everything from sources. Everything is built from scratch for every developer. Changes can be made anywhere in the process, so changes in Angular affect all the Angular applications. This allows fast iteration.

All design changes that impact Angular are planned thoroughly and thought through. Google has taken a few community members through this process, so reach out to be sent a design doc if you're interested in getting involved in the Angular design process.

### Sass variables in components

From a build perspective, it's difficult to be able to overwrite Sass variables. In order to change these, you need to insert a dependency _on_ a dependency. Most build tools don't have a way to do this. At Google, the Sass variables are fixed and people are expected to override the CSS. However, theming with global styles does work. In the future, this problem will get easier to solve once CSS native variables are supported cross-browser. With that support, this issue go away completely.

### Enterprise app sample

The Angular team will eventually provide an enterprise app sample, but there is no scheduled date for this. Enterprise complex applications are certainly a use case that Angular values. However, the challenge with providing an example for this is that all enterprise applications are very different. If you're an enterprise application builder with the capability to open source an application to help with this, please reach out to the Angular team.

### Contributing to Angular

The best way to start contributing to Angular is to start with small fixes in the documentation, triaging issues, and performing code reviews on pull requests. This helps contributors learn about the Angular team's process and code, then people move on to fixing bugs. It's difficult for large, complex open source projects to accept feature requests. Look for the community hotlist label on issues in GitHub as well.

### Will there be LTS for AngularJS?

The Angular team wants to know what the community wants out of an LTS for AngularJS. Committing to an LTS for AngularJS potentially sends an incorrect message that AngularJS is _done_, which it isn't.

---

## Aside: Auth0 for Angular

It's a great time to explore Angular for your single page JavaScript applications. Auth0 can help out by providing authentication, a JWT library, Quick Start documentation, and tutorials. Check out some of the following resources:

* [JWT library for Angular](https://github.com/auth0/angular2-jwt)
* [Angular 2+ Quick Start with Auth0](https://auth0.com/docs/quickstart/spa/angular2)
* [Migrating an AngularJS App to Angular eBook](https://auth0.com/e-books/migrating-to-angular2)
* [Managing State in Angular with ngrx/store](https://auth0.com/blog/managing-state-in-angular-with-ngrx-store/)
* [Angular 2 Authentication Tutorial](https://auth0.com/blog/angular-2-authentication/)

You can [sign up for a free Auth0 account here](javascript:signup\(\))!

---

## Conclusion

Day 3 of ng-conf 2017 was packed with information and great sessions. Key points today covered the addition of Angular Universal into the core, realtime apps with Firebase, NgModules, packaging, and more. There were also lightning talks on accessibility, starting meetups, eliminating Bootstrap, avoiding JS fatigue by doing more with less, and the [ngGirls](https://github.com/ng-girls) initiative. Overall, ng-conf 2017 was a great experience with excellent sessions and plentiful opportunities to mingle and network with the speakers, organizers, and community.

You can watch recorded streams from [ng-conf 2017 here](https://www.ng-conf.org/livestream). Individual talk videos are also available on the [ng-conf 2017 YouTube playlist](https://www.youtube.com/watch?v=0BikjL858OQ&list=PLOETEcp3DkCoS_2cW205cfRGl-Xp5jw4K).