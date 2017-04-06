---
layout: post
title: "ng-conf 2017 Summary - Day 1"
description: "Overview of ng-conf 2017 (April 5) Day 1 talks."
date: 2017-04-05 8:30
category: Conference, Growth
banner:
  text: "Auth0 makes it easy to add authentication to your Angular application."
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
- angular
- javascript
related:
- 2017-03-07-managing-state-in-angular-with-ngrx-store
- 2017-02-13-making-use-of-rxjs-angular
- 2016-11-07-migrating-an-angular-1-app-to-angular-2-part-1
---

**TL;DR:** Learn about the topics covered by speakers at [ng-conf 2017](https://www.ng-conf.org/) on April 5, 2017 (Day 1 of 3).

---

## ng-conf 2017

**[ng-conf](https://ngconf.org)** is the flagship [Angular](https://angular.io) / [AngularJS](https://angularjs.org) conference in Salt Lake City, Utah. The conference typically features talks from Angular core team members as well as ancillary Angular projects (such as [Material](https://material.angular.io/) and [Protractor](http://www.protractortest.org)) and members of the community. The conference is primarily single track but does have a Fair Day of workshops and fun events in between the two main talk days. This year's ng-conf runs from April 4-6, 2017. I am attending **ng-conf 2017** in Salt Lake City and bringing you summaries of the sessions and activities each day of the conference.

This year's ng-conf opened with a theme of _empathy and inclusivity_. The code of conduct was reviewed and emphasized, as community is extremely important to Angular, its creators, and the developers who support and use it.

![Empathy is the new bacon - inclusivity sign](https://cdn.auth0.com/blog/ng-conf17/empathy-ngconf17.jpg)

## Keynote

**Speakers:** [Igor Minar](https://twitter.com/IgorMinar), [Stephen Fluin](https://twitter.com/stephenfluin), Brian Martin
  
### Major Takeaways (tl;dr)

* Angular fosters a community of inclusivity and wants to enable creation of apps that people love to use and developers love to build.
* The Angular ecosystem is thriving and growing, with intentions to extend in several directions.
* Language Services intelligence for IDEs was announced.
* Ionic version 3 was announced.
* Angular v4 is better for users and developers and is state of the art.
* Semantic version and time-based releases were covered with major releases every 6 months.
* Major releases will be simple upgrades, aiming to mitigate upgrade obstacles.
* Angular version 5 will use AOT by default in both dev and production.
* "You can build with us!" is the Angular team's overall message to the developer community this year.

### Full Summary

Igor Minar kicked off the keynote speaking about why the Angular team builds Angular: to enable creation of applications that people love to use and that developers love to build. He spoke about the desire for the community to be welcoming and inclusive, upholding and protecting values of mutual respect. Angular has a [code of conduct](http://github.com/angular/code-of-conduct) as well as an email where people can reach out regarding conduct concerns (conduct@angular.io).

Stephen Fluin then went on to speak about the Angular ecosystem. For consistency, _AngularJS_ should be used to refer to the framework version 1.x and _Angular_ should refer to version 2 and above. This helps peole entering the community to understand the famework version and branding, and will also improve and clarify SEO.

Next, some community metrics were presented. There are currently 727 Angular Meetup groups worldwide in over 100 countries. Stack Overflow developer survey results for 2017 reported that 44% of JavaScript framework/library users use AngularJS or Angular.

The Angular team wants to continue to support companies that provide support or training for developers getting started or needing help with AngularJS or Angular. Community projects are also an important part of the Angular ecosystem, including integrated dev environments, scaffolding education, seed apps, tools for linting, and more.

The concept of **"Build on Us"** was introduced next. This is the premise that frameworks can be built on top of Angular. Guidelines  called the Library Spec were announced for how to build and ship libraries with Angular. These guidelines will describe how to build and distribute extension projects in a way that is easy for devlelopers to use and consume. Angular Material is an example of a component library built on Angular; its purpose is to build tools that make component authoring easier. Angular Material's component dev kit demonstrates best practices for a variety of features, such overlays, gestures, and accessibility.

The **Angular CLI** reached version 1.0 a few weeks ago and is one of the best ways to build Angular applications today. Best practices and wisdom is built into the CLI, and the Angular team is exploring ways to extract those best practices into SDKs. For example, [Angular IDE by Webclipse](https://www.genuitec.com/products/angular-ide/) builds on the CLI.

**Language Services** was also announced. This is a set of intelligence building on top of Angular that is now available in VS Code, WebStorm, and Angular IDE.

**Ionic** version 3 was announced today, built on Angular v4. The Ionic team maintained open communication and collaboration with the Angular team while building the latest version. Version 2 has over one million installs.

The **state of Angular today** covered some additional metrics. There are 100 applications launching in Angular per day. Although a vast majority (90%) of Angular applications are behind a firewall, 17% of public domain Angular apps are already using Angular v4. Angular's use within Google is also extremely significant. Over 200 Google apps are built with Angular.

Brian Martin then spoke about using Angular on [NBA.com](http://nba.com). His development team likes Angular because of TypeScript, its standards-first approach, and that Drupal and Angular share programming principles, allowing developers to switch between the two easily while integrating. He also cited the great Angular ecosystem (integration with Dragula, Redux, and D3), performance, and data integration that meets all NBA.com's use cases.

Igor and Stephen went on to speak about Angular v4, covering the following:

**v4 is Better for Users:**

* There was a need for Angular to evolve, and v4 is the first step in that direction.
* Ease of use was enhanced.
* Migration from v2 to v4 is easy.
* Apps are smaller with faster bootstrap (build size of apps was reudced by approximately 60%).

**v4 is Better for Developers:**

* New APIs (ngIf, ngFor) with an improved reactive paradigm.
* The way Angular is packaged has been changed to achieve a smaller build size and reduce latency for a faster build.
* Version 4 is the first Angular release with a stable release of Angular CLI.
* No breaking changes to stable APIs or common usage patterns.

**v4 is State of the Art:**

* The Angular Universal community project was brought into the core repository.
* Angular Universal allows the entire Angular app to run and load on the server, and bootstrap Angular on top of that.
* Applications are then a little bit faster; the time the user has to wait to see a fully rendered application is reduced.
* Service workers are shipped as a flag in the CLI that can be turned on.
* The team is excited to continue to invest in this.

Finally, Igor spoke about **what's next** for Angular. Angular will continue to evolve incrementally and predictably to keep pace with the continually evolving ecosystem _outside_ of Angular itself.

**Semantic versioning** was specified with **time-based releases**:

* Patch releases: `4.0.x` (every week)
* Minor releases: `4.x.0` (every month during the first three periods of the release cycle), contain new features and/or automated updates 
* Major releases: `x.0.0` (every 6 months), will have new features but still support simple upgrades so a major version update doesn't result in an obstacle

Igor also talked about **how Angular is used at Google**. All Google apps use the latest pre-release version of Angular with a large test suite, upgraded pull request by pull request. The version of Angular used at Google is latest in the master branch. The Angular team encourages users to stay as close to head as they're comfortable with. This way, they will receive the latest features and fixes and these are the versions that will afford compatibility with the latest tools.

The Angular team also understands that some people can't always upgrade, so **LTS (Long Term Support)** was announced. Version 4 LTS will provide critical bugfixes and security patches until October, 2018.

Finally, **version 5 themes** were presented. Angular version 5 aims to simplify the way new applications are compiled. Currently, JIT (Just In Time) compilation is used in development mode, then AOT (Ahead of Time) compilation is used when going to production. Version 5 aims to make AOT the default to reduce friction when moving an app to production. Speed and size are also a focus, particularly when using component libraries like Material or Ionic, with better tree-shaking for components.

The keynote concluded by revisiting last year's final keynote takeaway. In 2016, the core Angular team established "come sit with us" as their invitation to the community to establish a rapport, to contribute, share, and ask questions. This year, the mantra was **"You can build with us!"**

---

## I am One with Angular, and Angular is One with Me

**Speaker:** [John Papa](https://twitter.com/john_papa)

### Major Takeaways (tl;dr)

* The Angular CLI can easily generate components, services, models, and more with minimal effort and very few keystrokes.
* The CLI supports full customization and extension with the ability to eject Webpack.
* Tools like the Angular CLI help reduce cognitive burden when developing while ensuring standards and best practices are followed at the same time.

### Full Summary

John Papa emphasized the importance of being able to code efficiently and effectively with whatever tools you like to use; the right tools make a huge difference. Angular has a host of development tools, and he prefers Angular CLI, VS Code, Angular Snippets (extension for VS Code), and Language Service.

The Angular CLI makes it easy to create an application that works and follows solid practices as well. The `--dry-run` flag doesn't write files, but it reports them so the developer can have a clear picture of what their CLI commands will do when executed. The `--skip-install` flag skips npm install, enabling the developer to use Yarn instead if they choose.

> **Tip:** `ng new [your-app-name] --routing --prefix [your-prefix] --style scss --dry-run`, removing `--dry-run` when happy with the results to generate files.

John demonstrated several CLI commands using a sample `one-with-angular` application, including the following:

* `ng serve -o` launches the app in the browser
* `ng g c nav` shortcuts `ng generate component nav`; the CLI now adds generated components to the `app.module.ts` for you
* `ng g cl rebels` creates a class with the specified name (useful for models)
* `ng g s data -m app.module` creates a service and provides it in the `app.module.ts` file

John briefly touched on lazy loading. It was extremely difficult to get lazy loading to work in AngularJS, but is significantly simpler in Angular. The Angular CLI automatically detects that you're using a lazy loaded route and creates a load split bundle to load on the fly (provided that you fulfill certain requirements first, see the Module to Module talk summary to learn more).

The Angular CLI also supports `ng eject`, which ejects Webpack from the CLI. This provides NPM scripts that can be run instead of using `ng` commands and reveals package dependencies. The Webpack configuration file is also added in so it can be fully customized by the developer.

John emphasizes that the Angular CLI takes away the monotony of our jobs: it gets rid of boilerplate and enables us to build apps in the most optimized way possible. The CLI also evolves with the framework. 

The return on investment with regard to the CLI has many facets. We can generate code fast and correctly, as well as follow the styleguide and deviate where we need to. We're provided with an efficient development and debug experience, a solid and powerful build process, out of the box testing, and an easy exit strategy with ejection.

John Papa's [Pluralsight course on the Angular CLI is available here](http://jpapa.me/ps-ng-cli).

---

## Mad Science with the Angular Compiler

**Speaker:** [Minko Gechev](http://blog.mgechev.com/)

### Major Takeaways (tl;dr)

* A front-end compiler accepts input and performs lexical and static program analysis before producing output.
* The Angular compiler can be leveraged to determine if a program is compatible with the styleguide.
* The compiler can also be used to detect deprecations and remove them.
* The compiler can produce Abstract Syntax Trees of Angular applications in highly visual ways.

### Full Summary

Minko Gechev is the author of [angular-seed](https://github.com/mgechev/angular-seed) and [Codelyzer](https://github.com/mgechev/codelyzer). Minko spoke about the Angular compiler. The compiler transforms the source code of an Angular app to achieve higher efficiency in terms of bundle size. It renders components in most efficient way and instantiates each component's controller, sets up the change detection mechanism, generates views, and instantiates providers. The compiler tansforms the application. It can analyze the source code, visualize the source code, and more.

How does a compiler work? The compiler accepts input and produces output (ie., TypeScript -> Compiler -> JavaScript. In the case of front end compilers like Angular's, the compiler performs both lexical and syntax analysis.

**Lexical analysis** takes a string and tokenizes it: this creates an object and then parses the token to produce an [Abstract Syntax Tree (AST)](https://en.wikipedia.org/wiki/Abstract_syntax_tree).

**Static program analysis** is the analysis of computer software that is performed without actually executing programs. For example, Codelyzer can show whether a program is compatible with the Angular styleguide. It uses the TypeScript compiler for lexical analysis and can perform an analysis of styles and templates. It's hard to find all the dead styles manually, so the AST can be used for templates and styles. Both are matched against each other to see which styles and classes are actually in use.

There are almost no breaking changes between Angular v2 and v4, but there were some deprecations that should be cleaned up before moving on to version 5. How can these be detected? Finding and replacing strings works in _some_ cases (ie., `template` to `ng-template` in HTML files, but not in classes). Context-aware replacement is a better option. [ngMigrate](http://ngmigrate.telerik.com/) will find and suggest deprecations, and developers can allow it to fix these deprecations automatically.

Minko demonstrated code visualization, which aids in understanding a large system. A lot of code which is hard to digest, as it mixes different levels of abstraction. However, humans are good at "visual thinking", so visualizations can greatly aid here. The compiler provides primitives for parsing an Angular application. Minko's [ngast](https://github.com/mgechev/ngast) (parser) + [ngrev](https://github.com/mgechev/ngrev) (reverse engineering app) can utilize an application's `tsconfig.json` to render out a visualization showing the app's dependencies in a chart. In addition, Minko demonstrated a Minecraft-like 3D modeling of AST with his [`ngworld`](https://github.com/mgechev/ngworld) demo, a rendering which displayed an Angular app's AST as gardens with trees in 3D space. This was an impressive display of what can be achieved with the Angular compiler.

---

## Aside: Unofficial Angular Docs

Joe Eames announced the [Unofficial Angular Docs](http://ngdoc.io/) as a community collection of articles, tutorials, and resources for learning Angular.

---

## Creating VR Experiences with Angular and WebGL

**Speaker:** Austin McDaniel

### Major Takeaways (tl;dr)

* WebVR requires WebGL.
* A-frame framework for building VR web experiences is similar to Angular.
* Custom renderers need to abstract away the creation of DOM elements and addition of styles and components to a scene.
* Third party libraries and polyfills are currently necessary to produce stereoscopy and duplicate camera.
* WebVR in Angular needs to run outside of zones to be removed from change detection.
* Compilers could potentially take Angular components and compile to native VR headset applications.

### Full Summary

Virtual Reality is simply old tricks turned new. **Stereoscopy** is an old concept. The effect is created by putting two images beside each other with a little bit of overlap. This creates the illusion of depth.

[**WebVR**](https://webvr.info/) is an open standard and requires [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) to create rich and immersive environments.

VR introduces more challenges to the creation of these environments. VR faces hurdles such as desktop/mobile, head tracking, voice, gestures, shaders, and more. There are many changes to the way we're going to be building our interfaces to accommodate VR.

[A-frame](https://aframe.io/) is a web framework for building VR experiences. It utilizes markup-like component composition similar to what we have in Angular today; it isn't Angular, but the characteristics are similar, so what if it could be? Google has been considering all the ways we might wnat to render Angular today. This means that we can do lots of things with custom renderers.

We need to use custom renderers to abstract away the creation of DOM elements, adding styles, and adding components to the scene. Austin talks about how we first need to override DOM renderer: the meshes created there are not exactly DOM objects. Browsers don't like lots of HTML, so we need to override the DOM renderer and blacklist any WebGL components that we have.

WebGL is accomplished using HTML5 `<canvas>`. We can construct Angular WebGL markup (ie., `<ngx-renderer>`) with scene, camera, lights, and items, such as spheres. Components for each piece as well as the scene can be rendered with `<ngx-renderer>`'s child components. To apply stereoscopic filters, we can copy the DOM structure and components and lay them out beside each other ([three.js](https://threejs.org/) can duplicate the camera, for instance). Polyfills are required to normalize browser APIs and add events for position, orientation, poses, enable chromeless, head-tracking, etc.

Austin presented a demo of fifty bouncing spheres. In the absence of VR headsets for the audience, the VR effect could be emulated with a [WebVR Chrome browser extension](https://chrome.google.com/webstore/detail/webvr-api-emulation/gbdnpaebafagioggnhkacnaaahpiefil?hl=en).

> **Note:** We want to run animations outside of Angular zones because we don't want Angular change detection.

What's next? Austin noted that performance starts to bottleneck, so we need to take it a step further: better rendering, running outside of zones, and possibly native compilation. There is potential for using compilers to take Angular components and compile them down to be native applications for headsets.

---

## Module vs. Module

* Deborah Kurata (@deborahkurata)

### OUTLINE

* JS has issues (namespaces, code organizations), modules are supposed to be solving those issues
* Angular uses ES2015 modules, but also has its own modules
* ES2015 module - a code file `export` / `import`: "micro" in nature
* Angular modules - "macro" in nature: define a set of components, related files, dependencies, more features = more modules `@NgModule` a class with a specific decorator, pass a set of arrays to this
* Angular modules are, themselves, also ES2015 modules (exported and imported)
* Demo - products list with filtering, ratings, and detail pages
* Every Angular application has at least one Angular module (the `app` module)
  * Every component belongs to one and only one Angular module - `declarations` array
  * `bootstrap` array contains our startup component
  * `providers` array for custom services, if we use a service from somewhere else, it doesn't go here. Has special functionality associated with it, so only services sould go here. At runtime, the service's provider is registered with the application-wide injector and can be injected into any other codefile associated with the app.
  * `imports` array for Angular modules: system pieces or third party modules like material or ngrx, any of our other modules
      * Router module - declares several router directives and exports them to make them available, also registers router service. It's very important to only register this service _once_. `forRoot` method on `RouterModule` ensures that this is only registered once. Otherwise, we would use `forChild` for other modules that we create so that the router service is not called again.
  * `exports` array lets other modules take advantage of things
* Break up Angular module into additional modules when it gets too long: these are "feature modules" (in Angular docs). 
  * Services are always registered application-wide, so even if a service is declared in a feature module, it's accessible to the app module.
  * Common module is exported by BrowserModule (import BrowserModule in Angular app module and then use CommonModule for all the feature modules)
  * Look at what's in your components to know what modules to import into the parent module's `imports` array
  * When you see modules being repeatedly imported (like CommonModule, FormsModule for two-way binding, etc.), set up a SharedModule
      * SharedModule can combine the common imports - import SharedModule instead of repeatedly importing lots of things
* Angular modules organize pieces of application, extend our app with capabilities from external libraries, provide a template resolution environment. Module defines what template can access. Aggregate and re-export (ie., SharedModule), can create libraries (such as Material Design). Can be loaded eagerly or lazy-loaded.
* Lazy-loading: "lazy but fast"
  * 3 things you must do:
      * Need feature modules (otherwise there's nothing to load!) You have to lazy load modules
      * Need to group routes under a single component-less parent route: path with children of a single route, components are associated with the children, not the parent.
      * Do not import the feature module, this defeats the purpose of lazy loading.
  * Then we can move the path and declare `loadChildren` with the name of the module class

### Major Takeaways (tl;dr)

---

## Embrace Component Tranquility

* Jason Schwartzenberger

### OUTLINE

* Angular 2 embraces the component model
* Web components, Polymer, React -> following in footsteps of component-based architecture
* With Angular, need to become component architects
* Scope styling to components, send input and output to / from components
* We want to componentize all the things!
  * Then start to think, "this can't be good"
  * Is there a price to be paid for overusing components?
      * Component Tax
          * Angular component: rendering engine, execution and tracking, pre-run compilation - Angular must do these things for each component we have in an application
          * Payload Tax: Creating lots of components increases this workload / adds to JS payload.
          * Execution Tax: Bootstrapping, lazy loading, compilation
          * BUT we need that payload, we want that execution. Angular works to streamline this process. We need to understand costs to become component architects
          * Container element tax: too many custom elements use a container element as their top-level node: we care about the inner contents of the element, but we don't need that container which then needs to be set `:host { display: block; }`, etc. This increases payload. 
              * Container element tax can be dealt with by targeting existing elements with attribute selectors.
              * Component is a subset of a directive
              * We commonly take a custom-element-first approach rather than using class, attribute, etc.
* Component composition
  * Decision and presentation pattern
      * Parent components - load and alter data (smart)
      * Child components - present data and use input/output (dumb)
      * This architecture has a tax too: the Tree Coupling Tax
      * This can get too deep and you get things that are only there for chaining and passthrough.
* Everything always has a tax: "As developers, we're always battling to put queen size sheets on a king size bed."
  * We could use services, but this creates challenges too: now components need lots of services injected
  * Working in harmony but not being coupled is a challenge
  * Redux can help here: dispatch actions to change state, then our components can just deal with the store
  * A combination of decision/presentation, services, observables, redux can work toward solving the tree-coupling tax
      * Atomic design - use multiple patterns to solve problems and decouple when necessary
* Ultimately, need a balanced approach while being aware of cost. We can now make decisions with intent: our decisions adapted for our scenarios.

### Major Takeaways (tl;dr)

---

## Animations in Angular 4.0.0

* Matias Niemela

### OUTLINE

* For v4.1
* Setup - with 4.0, @angular/animations module: now separate from core
* Lots of changes in the internal API
* Animation modules
  * BrowserAnimationsModule for users
  * NoopAnimationsModule for testing
* Basic example - how to fade in/out something?
```
<div [@fade]="active ? 'in" : 'out' />
```
* New verb: `animation()` function - defines a reusable animation
* Can define a `fadeIn` animation and a `fadeOut` animation and `animateChild()`
* `animateChild()` can accept input variables: duration, start, end, with defaults
* `query()` and `queryAll()` collects inner items
* programmatic animations
  * AnimationBuilder inject into component and allows building animations on the fly: scrubbing, speeding the animation up and down, etc.
  * Can then use a player
* route animations
  * RouteOutlet contains the data and metadata
  * data is passed to the transitions and you can determine what kind of transition you want
  * transitions = route changes
  * can pass additional variables to route that will be consumed by the animation code (ie., do something different if back was used, etc)
* slides: yom.nu/ng-conf-2017
* demo: yom.nu/ng-conf-2017-demo

### Major Takeaways (tl;dr)

---

## ng-rap

* Shai Reznik

### OUTLINE

* GET VIDEO

### Major Takeaways (tl;dr)

---

## Keeping the Sand Out of Your Eyes: No Sandbox, No Problem

* Tim Ehat (@tim_ehat), Technical Lead, Performance @ Domo

### OUTLINE

* AngularJS 1.6 - removal of the sandbox
* Injection
  * When you let your users inadvertantly run code on your system
  * "yours" + NotYours
  * The potential of executing user content is bad
  * Vulnerabilities in LastPass in the last couple of weeks
* Angular expressions
  * {{1 + 1}} -> 2
  * {{user.name}} -> timehat
  * User code is not executed, it's just ugly text on the screen
* Expression sandbox
  * Gone as of AngularJS 1.6
  * Same idea as injection
  * Couldn't reference the prototype of an object or items on the global scope
* What happened?
  * People determined how to get out of the sandbox / security vulnerabilities, had to keep patching the sandbox to make it stronger
  * Sandbox wasn't meant for security, it was to help developers
  * The real problem is that users are able to define things in your template
* Passing user content to $compile - expressions can flow through escape logic
* Dynamically building your Angular templates server-side: {{somethingbad}} can be injected and will render
* Ryan Hanson - How I stole Plunker session tokens with an Angular expression
* Dangerous expressions: user could set their name to an exploit string which will be parsed as an expression by Angular. If it was just `<script>` it'll just be ugly text. However, using `{{` will render.
* Important Guidelines:
  * 1. Don't mix server templates with client templates. 
  * 2. Don't generate template source code by concatenating user input and templates.
  * 3. Be suspicious. User content might show up in unexpected places.
  * 4. Hack your app. It's fun. (Don't do it in production.)
* What do I have to do?
  * Stop mixing server and client-side templates.
  * Use `ng-non-bindable` / `ngNonBindable`
* User content is dangerous in other places in Angular as well
  * Don't pass user content to $watch, $watchGroup, $watchCollection, $apply, $applyAsync, $compile, etc, etc.
  * Your templates might do more than you think. Ie., if `ng-app` is on HTML or body, everything within that is Angular.
  * Bootstrap Angular where you need it and make sure that everything within there is under your control.
* User content might be more extensive than you think.
* Final word: keep the injection vulnerabilities out of your app.

### Major Takeaways (tl;dr)

---

## Thoughtful Component Design

* Jeremy Elbourn
* Miles Malerba

### OUTLINE

* For some components, augmenting the native element is preferable over hiding the element inside some custom element, ie.: `<button md-button>`, `<nav md-tab-nav-bar ...>`, etc.
  * Familiar API: devs know how to use HTML
  * If using all custom elements, it's hard to know if the right thing is being done for accessibility underneath: how will it interact with a screen reader? roles? aria?
  * Can make components simpler: can avoid a huge mess of code and binding so that the user can interact directly with the native element
* If there is no native element (such as a datepicker), need thoughtful component composition
  * Can turn into a mess of attributes
  * Can have separate elements that are connected to each other `[mdMenuTriggerFor]="menu"`
  * Breaking up components benefits: single responsibility, flexibility, friendly to native elements
* What if you want to be able to directly manipulate the DOM??
  * You might be tempted to go straight to the DOM and skip over Angular
  * Measuring, sizing, or positioning of elements might present a case for wanting to touch the DOM directly with the native DOM APIs
  * Reaching outside the Angular app to find information can require this as well (ie., needing to find out if the layout is right to left or left to right, `<html dir="rtl">`
  * Times we need to use the native APIs are:
      * In response to user interaction - good to pre-render
      * On initial render - a bit trickier, try to avoid situations like this. Measuring something dependent on CSS is a common example
* Avoid manual templating (XSS) when dealing directly with DOM APIs. Angular has good measures in place to protect against XSS vectors, so if you circumvent Angular, this opens up possibility for more vulnerabilities
* DOM manipulation in Angular: avoid where possible, use carefully if necessary, beware XSS, make sure it will play nicely with pre-rendering
* The Angular Zone - thoughtful interactions with zone
  * Zone provides an asynchronous execution context for Angular
  * Zones are Angular's way of knowing about everything that happens in the app, including async like settimeout or http requests
  * What can we do with zones? Have more control over when change detection runs
      * `ngZone.runOutsideAngular(() => { ... });` runs outside Angular context and won't cause Angular change detection
      * Running custom animation, requestAnimationFrame, good cases for this to avoid unintended slowdown in your application.

### Major Takeaways (tl;dr)

---

## Back from the past: A tale of helping others upgrade from Angular 1.x

* Sergio Cruze

### OUTLINE

* 2013 - wrote first AngularJS app
  * Idea to conception in no time - super fast prototyping
  * Great separation of concerns
  * Similar MVC as backend code
* 2017 - Whoa, what happened?
  * Lots of magic - where to go for help?
  * This is the problem with modern JS in 2017
      * More tooling (Node, Webpack)
      * Modern languages (ES2015, TypeScript)
      * Not limited to browsers
      * All of this while...
          * Backwards compatible
          * Learning best practices as we go (making them up every other week)
      * Not as simple as script tags anymore
      * Dev onboarding is more difficult
      * Lots to gain, but comes at a price
* Tweet: "JavaScript has gotten harder, let's take it upon ourselves to help newcomers get going! #ngconf2017"
* Common difficulties when upgrading
  * TypeScript?
  * Template syntax? `*`, `[]`, `()`
  * Command line tools? Make things easy but also intimidating
* Actual challenges helping people upgrade
  * A lot of code mixed with server side code - this is mostly okay with AngularJS, but less so with Angular: competing priorities in the codebase
  * CoffeeScript - change this to TypeScript
  * Bower
  * Grunt
* We wanted to understand if this was representative of the community at large - we used science. Asked developers about their upgrade process: timeline, tools, etc.
  * Upgrade pain points
      * Time and priority
      * Business incentive (don't necessarily make more $$ by using latest and greatest, can be a hard sell)
      * Team proficiency (hesitation, fear of needing to learn a new framework from scratch)
      * 3rd party libraries
      * AngularJS -> Angular, often talking about a rewrite
      * All the tooling
  * Syntax is not a factor: time to learn and fear of change were primary concerns
* How to go about it?
  * Component-based architecture (start with v1.5+) Look at a page and rearchitect it in your mind in a component-based way
  * Write full SPAs (don't use a container within a website)
  * Install dependencies with NPM (or Yarn) instead of downloading code from a website and inserting script tags
  * Bring in Webpack
  * Use TypeScript
* If there is a legitimate reason why you cannot upgrade, know that we feel your pain and will do our best to help you move forward.
* **You can sit with us.** Empathy - "If you're experienced, take the time to help somebody out."
* If you haven't learned Angular, why not? How can we help?

### Major Takeaways (tl;dr)

---

## Mischief Maker

* Lukas Ruebbelke
* Roger Tipping

### OUTLINE

* You can do some amazing things with JS these days
* Observables - everything is a stream
* Tone.js - can be used to visualize music
* Recorder.js, Wavesurfer.js
* Roger on keyboard / singing (feat. Shai Reznik)
* (Is the video available???)

### Major Takeaways (tl;dr)

---

## ng-STEAM

* Joe Skeen
* Gwen Skeen

### OUTLINE

* STEM - world we're growing up in is different than the world parents grew up in (Gwen, 6 yo)
  * Learning about STEM can be hard and even boring
  * Even before learning to read and write, can explore world with hands
  * Add "A" to add "Art" - STEAM
* Gwen's been interested in dad's programming
  * Last year she went to ng-kids and got to control a computer with a banana
  * Used scratch to make mom a mother's day card
* studio.code.org - nonprofit site about helping kids learn to program: prereader thru highschool
* Started with quick start Angular on Plunker
* Made an Angular app to pick your favorite color
* Programming with Gwen has been a fun and rewarding experience.
* "I love programming because I get to do fun things." --Gwen
* STEM should be much more interactive; our kids will be more prepared for the struggles and challenges that lie ahead

### Major Takeaways (tl;dr)

---

## The Memory Leak Brain Drain

* John Boyd

### OUTLINE

* What is a memory leak?
  * Memory that should be released back to the system because it's no longer needed and it's not correctly released back to the operating system.
  * Significant performance issues over time - experience degrades over time
* Types of memory leaks
  * Contrived examples
  * The real ones you find in your giant application that the contrived example didn't show you at all
* Easy to solve memory leaks
  * console.log removal
  * long-lived observables
* Chrome devtools - timeline view gives great insights into overall performance, when is the leak happening? Can it be isolated to some certain event? How big is it?
  * Allocation timeline offers a more detailed view
* Outside the tools
  * What actions cause the leak?
  * Test like a real user
  * Remove code

### Major Takeaways (tl;dr)

---

## There and Back Again: A Developer’s Tale

* Jacob Turner

### OUTLINE

* Professional experience using both AngularJS and React
* Learned AngularJS at a Bootcamp called DevMountain
* Then worked at a startup doing React
* Currently work for Domo doing Angular
* Have you ever had a phase in your development career where you weren't sure what you do? 
  * Wanted to define himself by his framework
  * Thought AngularJS was awesome
  * Had fulltime job doing React - defined self as a React developer: everything was great until it wasn't
  * Two opportunities: Angular with Domo or React with another company - Domo was the overall better opportunity, no regrets
* Transition - now "doing Angular as a React developer"
  * Decided wanted to be "a builder"
  * An "X Developer" is defined by their tools
  * A "Builder" uses the best tool for the job
* The most important thing is to provide value - your efforts should be helping you accomplish the goals of your projects
* Practice, effort, and skill will always be far more important than the tools that you use

### Major Takeaways (tl;dr)

---

## The Little Tool That Dreams Big

* Hans Larsen - Angular team: lead for Angular CLI

### OUTLINE

* Started on Material project, wanted to help people build great apps
* There was a problem Material was not solving: what happens before we can use Material?
* When you start up a new project, really hard to keep track of all the configurations and boilerplate, and it should be simple, not complex.
* Built this tool so that "it just works". You shouldn't have to think too hard about it, it should just work.
* General sentiment is that the CLI saves hours and hours of working on Webpack configs.
* Small tool with a lot of big ambitions - wants to fit your needs for large or small projects.
* What is going on under the hood?
  * `ng build/serve`
      * Do you want to run in developer mode or production environment?
      * Dev mode -> run static analysis and keep track of lazy routes
          * Keeps routes in memory and compiles the TypeScript to JS
          * Then passes the JS and lazy routes down to Webpack for bundling
          * Then the code is ready to ship to the browser
          * @ngtools does all of the above
  * Detecting lazy routes?
      * CLI uses same static analysis as Angular compiler to look for router module and everything that provides routes
      * Then takes `loadChildren` and resolves the string to an actual class, verifies that everything is in place, and takes normal dependencies and creates two bundles with them: deps in first bundle, then creates a second bundle that might be needed, maybe later
  * Refactoring
      * In dev mode (JIT compilation), take template and style URLs and change them to use require calls so that Webpack can understand and include in the bundle
      * In prod mode (AOT compilation), no longer need the component decorator anymore. Create static `ctorParameters` to inject necessary services. Everything can be tree-shaken properly by Webpack to remove what's not needed.
* `ng eject` - there are cases where the CLI just doesn't fit the bill, you want to manage it yourself (ie., if you've outgrown it)
  * Creates a `webpack.config.js`
  * Can pass any argument that you would pass to `ng build` and eject with that proper Webpack configuration
  * Please eject responsibly.
* 2 weeks ago, CLI 1.0.0 final was released
* Coming up in CLI 1.x:
  * Reduce the size of bundles with more aggressive tree-shaking
  * Want to increase performance of AOT compiling so that you can develop in AOT instead of JIT (reduce prod bugs)
  * Improve error messaging - with actionable messages
* CLI 2.0? 
  * Possibly more like an SDK
  * Support plugins
  * Set of libraries that can be used by other tools like IDEs, other CLIs
  * Custom templates, test frameworks, build systems: mix and match
  * Same small interface
  * Will feel familiar if you keep using the CLI, but will integrate with more - dream bigger
* Thanks to team and to contributors (issues, PRs, Gitter chat)

### Major Takeaways (tl;dr)

---

## The Angular Compiler 4.0

* Tobias Bosch

### OUTLINE

* Angular compiler takes all your metadata, templates, stylesheets, and analyzes them
* Builds Abstract Syntax Tree
* Transforms TypeScript to JS
* Insantiates the templates
* If using AOT, generates `*.ngfactory.ts` files
  * Elements: viewDef contains a property called nodes. Nodes are POJOs.
  * Instantiate component: everything that needs to be created multiple times goes into ViewData
* Element hierarchy
  * If each node knows how many children it has, you can put all the elements in an array and it knows who is a child of whom
* Directives
  * Template
  * Class
  * DirectiveDef helper function
  * Lifecycle hooks: Angular calls you back when something is destroyed or something happens. These are `flags` in the definition.
* Bindings
  * NodeDef stores names of bindings
  * viewDef has update function with change detection (CheckFn) take expressions from your template and translate them into one expression in JavaScript.
  * Need old values (only fires if something changes): array in viewData tracks old values
* Angular 2 vs. Angular 4 code generation
  * Angular 2 would generate a class per template and creates all elements and directives and stores them in properties
  * In Angular 4, uses arrays to reduce size (v2 used only properties): trade-off
* Focus on one of the benchmarking metrics and make it super fast, but then other metrics suffered. Dial it in a different direction, there are always trade-offs.
* Example benchmark metrics demonstrating how size was reduced by release candidates of Angular 4.
  * No regression for Bootstrap.
  * Routing time (destroying everything and creating it again), there was regression from 40ms to 50ms for simple components, but with more complex components, there was no regression.
  * Update - no regression
* What's next?
  * AOT will be the default
      * Need watch mode
      * Better error messaging indicating what needs to change
      * Type checking templates - if you misspell a property, need to be able to pinpoint that and report location in the template
      * More flexible metadata
      * Remove `ngfactory.ts` files to inline this in your code while compiling - simpler, fewer concepts you need to know

### Major Takeaways (tl;dr)

---

## Reactive Programming with RxJS: A Beginner & Expert’s Perspective

* Ben Lesh (lead author of RxJS 5) @benlesh
* Tracy Lee @ladyleet

### OUTLINE

* Learning RxJS is really hard but once you get it and master it, it's amazing (Tracy)
* Couldn't find the right docs
* Creating a new observable
  * `new Observable` constructor, has methods for next, error, and complete
  * observableOf, observableFrom also options
* RxJS Pun App
  * Lookahead Search - the idiomatic RxJS example
      * Subjects are observables and observers
      * Allows us to push values through by using `next` 
      * Can use all operators
* Imports: specifically get what you want, this is slow. ONly include what you need: import from the module path directly. Ie., `import {Subject} from 'rxjs/Subject';` Import specific operators. 
* Lookahead search again: we need an observable of keywords
  * Pun service: `suggestKeywords`, `getPuns`
  * `.catch(err => { return Observable.empty(); }`
  * Every time there's a text input change, an observable of suggested keywords is returned.
  * `switchMap` operator: converts the value to a new observable, switches to that observable, and unsubscribes from the previous observable.
  * `| async` - immediately when Angular initializes, subscribes to the observable. When removed from view, unsubscribes.
  * `share()` operator - makes your observables multicast: it allows one subscription and multiple subscribers
* Same Shaped-ness
  * Let's add another data source
  * Web speech API
      * Returns an array of things the API thinks you said
      * Can wrap this with an observable
      * Can then use observer to `next()` out the results
  * Observables are both lazy and cancellable
      * If someone unsubscribes from speech recognition observable, it can turn the mic off / stop listening
  * Angular service: injectable, actually use all results, add error handling
  * `switchMap` clicks into speech recognition
  * Spoken keywords and typed keywords (observables of arrays of strings) can be merged together and therefore shared - benefit of Same Shaped-ness
* Google image recognition API can be used too
* Resources available (repo)

### Major Takeaways (tl;dr)

---

## How to Scratch an Itch (in 200 Repos or Less)

* Justin Searls @searls co-founded Test Double

### OUTLINE

* What is creativity?
  * Passion? - fizzles out, nope, not passion
  * Art? - coding is creative but not all code is artistic on its merits
  * Vision? - vision doesn't create anything
  * Are YOU creative? Programming is one of the most creative endeavors humankind has undertaken
  * Concept of a creative spark - you get an idea that pops into your head
* Creativity is a chronic illness
  * Get riled up by something, and then create a new library.
  * "I pass npm modules like kidney stones."
* Inadequacy - dad was a pro golfer
* Brought up religious, hold firm to intangible concepts - "I carry indignation with me wherever I go"
* Taking negative and toxic emotion and turning it into creativity
* Privilege
  * At Test Double, it's baked into the mentality that everyone has the time and opportunity to grow
* I feel (express indignation), but I (admit incompetence). Maybe if I build it, I'll (feel less incompetent).
* "Fear of bad code can paralyze you."
* Finding a safe space where working was more important than perfect was important.
* Joined first Ruby team, looked at their tests and was not impressed - built gimme
  * Get out of the line of fire - lower pressure, and build something to impress
  * Working code can sell ideas - bring a demo to the table
* Midwestern programming
  * east coast - smart
  * west coast - cool tech
  * midwest - boring - rockstar envy (so created Must Stache)
      * serverless
      * face.com got shut down
      * popularity without purpose is toxic
* The Thoughtleader's Dilemma
  * Do interesting work
  * Stop doing work
  * Danger of thoughtleading people off a cliff because you're not doing the work anymore
* How can I spend 20 hours to save myself 20 seconds? Home control (set alarm, IoT, etc.) simplisafe
  * Went too long without validating ideas
  * Approach was too hand-wavey
  * Everything seems simple at a distance (as you get detached from the work, everything seems simpler - managers)
* Pattern recognition yields generic advice - trust the people who are closest to the work to make decisions regarding the work
* Test doubles are like stunt doubles - a fake for a test
  * If something runs in the cloud, fake out the cloud and test that
  * sinon.js most popular test double library for JS
* Learn about something, build tool, share with others, go back to learning
  * testdouble.js
      * works pretty well
      * shares what we learned clearly
      * better than being cynical and complaining
* Not getting through? Tweak your message.
* Not winning != not worthwhile
* Open source - you create, then businesses come to depend on it, entitled developers, leads to sadness at entitlement - happiness inversely proportional to the popularity of their libraries
  * Build something no business could ever want
  * Designed own programming language: emoruby - 0 github issues
* It's okay to build stuff for yourself / for fun!
* Negative feelings are a symptom, not the problem - root cause analysis: reflect on your feels, accept those emotions as being valid. Then ideas will just come down, find a creative outlet for those ideas.

### Major Takeaways (tl;dr)

---

## Conclusion





