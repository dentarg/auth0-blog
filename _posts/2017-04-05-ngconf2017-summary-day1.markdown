---
layout: post
title: "ng-conf 2017 Summary - Day 1"
description: "Angular v4 has been released. Read the major takeaways from ng-conf 2017 (April 5) Day 1."
date: 2017-04-06 8:30
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
  
### Major Takeaways (TL;DR)

* Angular fosters a community of inclusivity and wants to enable creation of apps that people love to use and developers love to build.
* The Angular ecosystem is thriving and growing, with intentions to extend in several directions.
* Language Services intelligence for IDEs was announced.
* Ionic version 3 was announced.
* Angular v4 is better for users and developers and is state of the art.
* Semantic version and time-based releases were covered with major releases every 6 months.
* Major releases will be simple upgrades, aiming to mitigate upgrade obstacles.
* Angular LTS (Long Term Support) was announced for Angular v4 through October, 2018.
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

## Angular CLI Tips

The [Angular CLI](https://github.com/angular/angular-cli) can easily generate components, services, models, and more with minimal effort and very few keystrokes. The `--dry-run` flag can report what will be outputted so you can check your work with the CLI before generating anything. The CLI also makes lazy loading much easier in Angular than AngularJS. Wwith the ability to eject Webpack, Angular CLI supports full customization and extension for any desired build configuration.

Tools like the Angular CLI help reduce cognitive burden when developing while ensuring standards and best practices are followed at the same time.

John Papa demonstrated several CLI commands using a sample application, including the following:

* `ng serve -o` launches the app in the browser
* `ng g c nav` shortcuts `ng generate component nav`; the CLI now adds generated components to the `app.module.ts` for you
* `ng g cl rebels` creates a class with the specified name (useful for models)
* `ng g s data -m app.module` creates a service and provides it in the `app.module.ts` file

> **Tip:** `ng new [your-app-name] --routing --prefix [your-prefix] --style scss --dry-run`, removing `--dry-run` when happy with the results to generate files.

John Papa's Pluralsight course on the [Angular CLI is available here](http://jpapa.me/ps-ng-cli).

---

## Angular Compiler

A front-end compiler accepts input and performs lexical and static program analysis before producing output. The Angular compiler can be leveraged to determine if a program is compatible with the styleguide. The compiler can also be used to detect deprecations and remove them. In addition, it is capable of producing [Abstract Syntax Trees (AST)](https://en.wikipedia.org/wiki/Abstract_syntax_tree) of Angular applications in highly visual ways.

Minko Gechev's impressive [`ngworld` 3-D AST visualizer is available here](https://github.com/mgechev/ngworld).

---

## Aside: Unofficial Angular Docs

Joe Eames announced the [Unofficial Angular Docs](http://ngdoc.io/) as a community collection of articles, tutorials, and resources for learning Angular.

---

## WebVR with Angular

[**WebVR**](https://webvr.info/) is an open standard and requires [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) to create rich and immersive environments. [A-frame](https://aframe.io/) framework for building VR web experiences is similar to Angular. Therefore, can we implement WebVR with Angular?

In order to implement WebVR in Angular, several things are needed. Custom renderers need to abstract away the creation of DOM elements and addition of styles and components to a scene. Third party libraries and polyfills are also currently necessary to produce stereoscopy and duplicate camera. Finally, WebVR in Angular needs to run outside of zones to be removed from change detection. 

Currently, performance starts to bottleneck. However, in the future, compilers could potentially take Angular components and compile to native VR headset applications.

---

## Modules

An ES2015 module is simply a code file with `export` / `import`. ES2015 modules are "micro" in nature, whereas Angular modules (`@NgModule`) are "macro" in nature and define a set of components, related files, and dependencies. Angular apps can have an app module, feature modules, and shared modules for better organization. Modules also enable [lazy loading](https://angular.io/docs/ts/latest/api/router/index/Routes-type-alias.html).

### 3 things are needed for lazy loading:

1. The app needs feature modules: otherwise there's nothing to load, because lazy loading _only_ loads modules.
2. Routes need to be grouped under a single component-less parent route. This is a path with children of a single route and components are associated with the children, not the parent.
3. Feature modules should _not_ be imported in the `app` module; this defeats the purpose of lazy loading.

---

## Using Components with Intent

Initially, Angular's ability to componetize can lead to developers wanting to "componetize all the things"! However, there are costs to doing this: 

* Component tax: every component costs resources to render, execute, and compile.
* Payload tax: creating lots of components increases the overall JavaScript payload.
* Execution tax: bootstrapping, lazy loading, and compilation cost resources.
* Container element tax: we usually default to custom elements, but we can cut down on extra containers by using attributes instead.
* Tree coupling tax: the Decision and Presentation pattern utilizes smart parent components with dumb child components, but this can result in deep nesting for no good purpose other than chaining and passthrough.

Ultimately, everything has a tax and the trick is to take a balanced approach so that decisions are made with intent. We can combine Decision/Presentation with services, observables, or Redux to solve problems and decouple when necessary. 

> _"As developers, we're always battling to put queen size sheets on a king size bed."_ —Justin Schwartzenberger

---

## Animations in Angular v4

As of Angular v4.0, the `@angular/animations` module is now separate from the Angular core. Lots of changes have been implemented in the internal API, as follows:

* `BrowserAnimationsModule` is for users.
* `NoopAnimationsModule` is for testing.
* The new `animation()` function defines a _reusable_ animation.
* The `animateChild()` function can accept input variables for duration, start, and end, with defaults.

Programmatic animations can be implemented by injecting `AnimationBuilder` into a component. This allows for building animations on the fly with scrubbing, playback controls, etc.

For route animations, data is passed to the transitions and the developer can determine what kind of transition is desired for the route change.

An animations demo is [available from Matias Niemela here](http://yom.nu/ng-conf-2017-demo).

---

## The Sandbox

Injection attacks take place when you let your users inadvertantly run code on your system. The potential of executing user content is bad. Escaping ensures that user code is not executed, it's just ugly text on the screen.

The **expression sandbox** prevented developers from being able to reference the prototype of an object or items on the global scope. The sandbox has been removed as of AngularJS 1.6. The sandbox wasn't meant for security, it was to help developers. However, the real problem is that it allowed users to define things in your template: passing user content to `$compile` allowed expressions to flow through escape logic. This can be demonstrated by Ryan Hanson's article on [How I Stole Plunker Session Tokens with an Angular Expression](https://royaljay.com/security/angular-expression-injections/). If users can set their information to an exploit string which will be parsed as an expression by Angular, malicious code will render.

### Important guidelines:

1. Don't mix server templates with client templates. 
2. Don't generate template source code by concatenating user input and templates.
3. Be suspicious. User content might show up in unexpected places.
4. Hack your app. It's fun. (Don't do it in production.)

### What do I have to do?

* Stop mixing server and client-side templates.
* Use `ng-non-bindable` / `ngNonBindable`
* Don't pass user content to `$watch`, `$watchGroup`, `$watchCollection`, `$apply`, `$compile`, etc.
* Your templates might do more than you think. Ie., if `ng-app` is on the HTML or body tag, everything within that is Angular, so bootstrap Angular where you need it and make sure that everything within is fully under your control.

---

## Thoughtful Component Design

This talk went more in-depth into some principles of better components. For some components, _augmenting_ the native element is preferable over hiding the element inside some custom element, ie.: `<button md-button>`, `<nav md-tab-nav-bar ...>`, etc.

What are the benefits of augmenting native elements? Firstly, familiar API: developers know how to use HTML. In addition, if we're concealing component internals within custom elements, it's hard to know if the right thing is being done for accessibility underneath. At a glance, how will we see how an input inside a custom component interact with a screen reader with roles or ARIA?
We can make components simpler and can avoid a huge mess of code and binding so that the user can interact directly with the native element.

If there is no native element (such as a datepicker), we need thoughtful component composition. It can be helpful to have separate elements that are connected to each other. This provides benefits such as single responsibility, flexibility, and friendliness to native elements.

### Manipulating the DOM

Care should be taken when it's necessary to directly manipulate the DOM; this should only be done if there is no Angular alternative, such as for measuring, sizing, or positioning of elements after CSS styles have been applied. Reaching outside the Angular app to find information can require this as well (ie., needing to find out if the layout is right to left or left to right, `<html dir="rtl">`.

Make sure that you are thoughtful about interactions with _zone_, Angular's change detection mechanism. Zones provide an asynchronous execution context for Angular and are Angular's way of knowing about everything that happens in the app, including asynchronous activity like `setTimeout` or HTTP requests. With zones, we have more control over when change detection runs. For example, we can implement `ngZone.runOutsideAngular(() => { ... });` to execute something outside the Angular context. This won't trigger Angular change detection. Running custom animation (as mentioned above with regard to WebVR) is a good example for needing this to avoid unintended slowdown in your application.

---

## Upgrading From Angular 1.x

For most developers, the primary upgrade pain points are **time and priority**. These are influenced by:

* Business incentive: companies don't necessarily make more money by using the latest and greatest technologies, so upgrading can be a hard sell.
* Team proficiency: engineering teams can experience hesitation or fear of the prospect of needing to learn a new framework from scratch.
* Upgrading from AngularJS to Angular often means a full rewrite.
* All the additional new tooling can be daunting.

> **Note:** Research showed that syntax is not a factor. The primary concerns with upgrading are time to learn and fear of change.

### Tips for making upgrading easier

* Start with a component-based architecture (AnglarJS v1.5+).
* Write _full SPAs_: don't use an AngularJS container within a website.
* Install dependencies with NPM (or Yarn) instead of downloading code from a website and inserting script tags.
* Bring in Webpack.
* Use TypeScript.

Finally, it was emphasized that if there is a legitimate reason why you cannot upgrade, know that the Angular team and community feels your pain and will do their best to help you move forward. The **"You can sit with us"** mantra from ng-conf 2016 was repeated: empathy is important. 

> _"If you're experienced, take the time to help somebody out."_ —Sergio Cruze

---

## Memory Leaks

A **memory leak** refers to memory that should be released back to the system because it's no longer needed and it's not correctly released back to the operating system. Memory leaks cause significant performance issues over time.

There are two types of memory leaks:

* Contrived examples
* The real ones you find in your giant application that the contrived example didn't show you at all

Some memory leaks in Angular are easy to solve, such as `console.log` removal and long-lived observables. Chrome devtools provides a timeline view that gives great insights into overall performance. This can show when the leak happening, allowing the devleper to determine if it be isolated to some certain event and how big it is. 

Final takeaways were:

* What actions cause the leak?
* Test like a real user.
* Remove code.

---

## Angular CLI in Detail

Hans Larsen, the Angular team lead for Angular CLI, spoke indepth about the history and future of the CLI. He understood that when you start up a new project, it's very difficult to keep track of all the configurations and boilerplate. The concern was that it **should be simple, not complex**. Angular CLI was built so that "it just works" without requiring too much thought or cognitive burden. The CLI saves hours and hours of working on Webpack configurations.

The Angular CLI is a small tool with a lot of big ambitions: it wants to fit your needs for large or small projects. Hans spoke about what's going on under the hood of the CLI in dev and prod modes and how the CLI detects lazy routes, creating multiple bundles to potentially be loaded later.

He then touched on `ng eject` (ejection of the `webpack.config.js` and Webpack dependencies for customization), concluding that segment with:

> _"Please eject responsibly."_ —Hans Larsen
 
### What's coming for CLI v1.x?

Future 1.x releases aim to reduce the size of bundles with more aggressive tree-shaking. There are also plans to increase performance of AOT compiling so that you can _develop_ in AOT instead of JIT and reduce production bugs. Error messaging will also be improved with actionable items detailing _how_ to fix errors.

### Angular CLI v2

Version 2.0 of the Angular CLI may possibly look more like an SDK, with plugin support and a set of libraries that can be used by other tools like IDEs and other CLIs. The CLI may also support more customizable templates, test frameworks, and build systems, allowing developers to mix and match.

However, the CLI will maintain the same small interface and feel familiar if you keep using the CLI. It will integrate with more and continue to dream bigger while remaining simple to use.

---

## Reactive Programming with RxJS

[Ben Lesh](https://twitter.com/benlesh) and [Tracy Lee](https://twitter.com/ladyleet) talked about how learning RxJS is difficult, but once mastered, it's extremely powerful and useful. Ben talked about creating new observables using the `new Observable` constructor, which has methods for `next`, `error`, and `complete`. There are other observable creation options, but they all use `new Observable` under the hood.

They then demonstrated an RxJS Pun App with lookahead search, API, and speech recognition.

### Tips

* Subjects are observables and observers which allow us to push values through by using the `next` method.
* When importing from RxJS, only include what you need by importing from the module path directly. For example: `import {Subject} from 'rxjs/Subject';`
* Remember to catch errors and return an empty observable: `.catch(err => { return Observable.empty(); }`
* The `switchMap` operator converts the value to a new observable, switches to that observable, and unsubscribes from the previous observable.
* The async pipe (`| async`) subscribes to the observable immediately when Angular initializes and unsubscribes when removed from the view.
* The `share()` operator makes your observables multicast, allowing one subscription and multiple subscribers.

### Same Shaped-ness

**Same Shaped-ness** refers to streams that share the same shape. For example, in the demo app, spoken keywords and typed keywords are both observables of arrays of strings. They are same shaped and can therefore be **merged and shared**.

[Slides for this talk are available here](https://www.slideshare.net/ladyleet/rxjs-a-beginner-experts-perspective-ngconf-2017).

---

## Creativity

[Justin Searls](https://twitter.com/searls), the co-founder of [Test Double](http://testdouble.com/), concluded Day 1 of ng-conf 2017 with an excellent talk on turning negative and toxic emotion and converting it to creativity.

### What is creativity?

* Passion? Passion fizzles out.
* Art? Coding is creative, but not all code is artistic on its merits.
* Vision? Vision doesn't create anything.

Programming is one of the most creative endeavors humankind has undertaken, but many programmers don't _consider_ themselves creative. Justin's creativity flows from getting riled up by something, and creating a new library as a result.

> _"I pass npm modules like kidney stones."_ —Justin Searls

### Taking negative and toxic emotion and turning it into creativity

Justin's fuel for creativity reads like a mad lib:

> _"I feel (express indignation), but I (admit incompetence). Maybe if I build it, I'll (feel less incompetent)."_ —Justin Searls

Fear of bad code can be paralyzing, so it's important to find a safe space where **working is more important than perfect**. Getting out of the line of fire lowers pressure and enables us to  build something to impress. Working code can sell ideas, so it's always helpful to bring a demo to the table.

Justin spoke about creating [Must Stache](https://github.com/searls/must-stache), a serverless Chrome browser extension that used _face.com_ facial recognition to overlay mustaches on photos of people. However, when face.com was shut down, former users were angry that the extension no longer worked, cultivating a toxic atmosphere as a result of popularity.

### The Thoughtleader's Dilemma

The thoughtleader's dilemma occurs when you:

* Do interesting work.
* Stop doing work.
* Are now in danger of thoughtleading people off a cliff because you're not doing the work anymore.

Justin spoke about how he went too long without validating his ideas, resulting in an approach that was too hand-wavey. Everything seems simple at a distance as you get detached from the work. Many managers have this problem. Pattern recognition yields generic advice.

The solution is to **trust the people who are closest to the work to make decisions regarding the work**.

To maintain creativity and avoid this dilemma, learn about something, build a tool, share it with others, then go back to learning. If you're not getting through, tweak your message.

### Not winning != not worthwhile

In the open source community, we often create something and then businesses come to depend on it. This results in entitled developers, which in turn leads to sadness at entitlement. Justin notes that the **happiness experienced by open source developers is often inversely proportional to the popularity of their libraries**.

The solution? Build something no business could ever want. Justin designed own programming language called [emoruby](https://github.com/searls/emoruby) to compile emojis to Ruby. The repo has 0 GitHub issues.

In conclusion: **it's okay to build stuff for fun!** Negative feelings are a symptom, not the problem. When performing root cause analysis, reflect on your feels and accept those emotions as being valid. Then ideas will just come down, so find a creative outlet for those ideas.

--- 

## Aside: Auth0 for Angular

Angular v4 was just released, the Angular CLI has a stable release, and Angular LTS was also announced. It's a great time to explore Angular for your single page JavaScript applications. Auth0 can help out by providing authentication, a JWT library, Quick Start documentation, and tutorials. Check out some of the following resources:

* [JWT library for Angular](https://github.com/auth0/angular2-jwt)
* [Angular 2+ Quick Start with Auth0](https://auth0.com/docs/quickstart/spa/angular2)
* [Migrating an AngularJS App to Angular eBook](https://auth0.com/e-books/migrating-to-angular2)
* [Managing State in Angular with ngrx/store](https://auth0.com/blog/managing-state-in-angular-with-ngrx-store/)
* [Angular 2 Authentication Tutorial](https://auth0.com/blog/angular-2-authentication/)

You can [sign up for a free Auth0 account here](javascript:signup\(\))!

---

## Conclusion

Day 1 of ng-conf 2017 was packed with information and great sessions. Day 2 is a Fair Day, comprised of activities for entertainment and networking as well as dozens of workshops running simultaneously. Day 3 returns to single track sessions. 

You can tune into the [ng-conf 2017 livestream here](https://www.ng-conf.org/livestream) as well as watch recorded streams from previous days.



