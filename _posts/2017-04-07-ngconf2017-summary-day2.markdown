---
layout: post
title: "ng-conf 2017 Summary - Day 2 (Fair Day)"
description: "Angular v4 has been released. Read about Fair Day from ng-conf 2017 (April 6) Day 2."
date: 2017-04-07 8:30
category: Technical Guide, Conferences, Angular
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
- 2017-03-07-managing-state-in-angular-with-ngrx-store
- 2016-11-07-migrating-an-angular-1-app-to-angular-2-part-1
---

**TL;DR:** Learn about the "open-track" Fair Day at [ng-conf 2017](https://www.ng-conf.org/) on April 6, 2017 (Day 2 of 3).

---

## ng-conf 2017: Fair Day

Day 2 of ng-conf 2017 was Fair Day. There were workshops and sessions running simultaneously with other activities and entertainment such as combat bots, board games, VR park, Prison Escape Bus, Experts Rooms, and lounge/hack rooms. In addition to general fair activities, I attended sessions on ngrx, Apollo and GraphQL, machine learning with Angular, and improving components. You can check out summaries of these sessions below.

---

## ngrx

[Ngrx](https://github.com/ngrx) consists of small, concise libraries built with RxJS to solve problems such as state management and side effect management in Angular.

### ngrx/store

Ngrx/store is an [RxJS state management container](https://auth0.com/blog/managing-state-in-angular-with-ngrx-store/) heavily based on Redux. It uses actions, reducers, and a single store. A reducer is a function of state. The initial state goes in, then handles each action and returns the new state. Reducers are pure functions. ngrx/store abstracts away the application reducer so that child reducers only handle one piece of the state. New reducers can be added to manage their own individual slices of state.

The `dispatch()` and `select()` methods are used to send actions to the reducer to update state, and return an observable of only changed state, respectively. We may want to write concise components and refactor `select()` out to _selectors_. This way, we can share the selectors across the application. Selectors should be stored where our state is defined. Abstracting the selectors puts less responsibility on the component to know how to get the selected data.

### ngrx/effects

Any code that interacts with the outside world is a [side effect](https://auth0.com/blog/glossary-of-modern-javascript-concepts/#purity). We don't know how they're going to behave when that code is run. For example, API calls are side effects. Isolating side effects out of the component tree makes them easier to test.

Ngrx/effects is a side effect model. With it, we can listen for certain actions, perform side effects, and deliver new actions back to the store. The `@Effect()` decorator hints to tell the store to subscribe and returns an observable of an action. This can be mapped to its payload. When implementing ngrx/effects to manage side effects, we've performed the same action but the component has a lot less responsibility. Components are now a pure representation of state.

### ngrx Performance Improvements

Reducers are pure, so we don't need Angular to perform any deep dirty checking. Angular only needs to check if the reference has changed.

### Redux Devtools Extension

We can also wire up the Redux Devtools Chrome extension in our ngrx application. Importing `StoreDevtoolsModule` provides a bridge to the Chrome extension, and we can then instrument store in the `app` module. Doing so incurs a performance penalty, so it's important to only use in development. The Redux Devtools extension provides an interface to see what the state of the application looks like, complete with a time traveling debugger.

> _"Redux is not great for making simple things quickly. It's great for making complex things simple."_ —Brandon Roberts & Mike Ryan

---

## Managing Data with GraphQL

Angular has solved developer issues and concerns with initial loading and size, prerendering, rendering, transitions, and animations. These are no longer concerns.

However, we are still left with a concern regarding network latency. Users expect instant feedback, ie., when liking something on Facebook. Caching and prefetching can reduce network latency. When looking for a library that handles network and data management problems, [Apollo](http://dev.apollodata.com/angular2/) offers solutions along with its dev tools.

Improving network performance is not an all-or-nothing solution. Think about data and the network when creating your apps. Every effort makes your app a little bit faster, so anything you do helps. Here are two things we can address:

* Send fewer requests.
* Send less data in the requests.

When using REST APIs, particularly those we have little control over, we call the server and can frequently get a _lot_ of information back. This can be a mess, but we can use [GraphQL](http://graphql.org/) to describe what info we want and get just this information at the field level.

With GraphQL and Apollo:

* It doesn't matter how many resources we query, we'll get everything in one single response in the structure desired.
* We can create an Apollo query with the exact structure we want back and it returns an observable.
* We can take advantage of code autocompletion with the data that could come back from the server; this creates a good separation of concerns regarding the front end and back end.
* We can also change data with post and put requests (mutation).

By using queries inside components, we create a "super Redux or ngrx" that understands the larger picture and brings back only what we need from the server. Within components, we can query only for what is needed for that particular component.

We do _not_ need a GraphQL backend in order to take advantage of GraphQL on the client. We can achieve the benefits without touching the server at all, _or_ we can build middleware that can query any data sources.

Check out [urigo's repos on GitHub for examples](http://github.com/urigo).

---

## Build, Measure, and Machine Learn with Angular

### Build Measure Learn

**Conversion** refers to crafting solutions that lead to users doing what you want them to do. For example, this might be downloading an ebook, subscribing to your service, signing up for a newsletter, etc.

We build features and then we want to measure the features and see if visitors like the features or not. We then learn about the visitors and using this information, build better features in the next cycle to increase conversion.

The most important part of any data analysis is how the data captured. [Redux Beacon](https://github.com/rangle/redux-beacon) is an open source library created at [Rangle](http://rangle.io). Redux Beacon wiretaps Redux sections in an app and sends them to a target of your choice for conversion and reporting purposes, allowing you to map Redux or ngrx actions and state to your analytics data model.

### A/B Testing

When just gathering data is not enough, A/B testing can also be performed with [feature toggles](https://github.com/rangle/feature-toggle-ng2-redux). Almost anything on your website that affects visitor behavior can be A/B tested. This includes features, colors, buttons, CTAs, headlines, etc. The problem with A/B testing is that we learn the more successful option, but we don't know the user demographic that caused this result, and analysts want to know this information.

Regionally, visitors might pick different options. For example, if  a visitor is close to your office geographically, they might choose an "In Office Training" call to action whereas people located far away may only select "Online Training".

### Machine Learning

A custom Redux Beacon target sends raw data set for each user showing the pages they visited, their location, and more. This data can be passed to a machine learning algorithm that can use patterns to generate a model. This can then show scores with a probability of given user behaviors. This is called a **decision tree model**. Machine learning can predit the probability of which decision a user will make based on the user's behavior.

In a nutshell, the steps to do this are:

* Save the data.
* Convert that data to vectors.
* Train the predictive model.
* Generate the rules.
* Do the predictions.

---

## Using Directives

Mike Brocchi talked about utilizing directives in Angular. When building out an application, we build out a component tree, but where do we go from there? If we want to reuse logic, we factor it out into a service. What happens if we have behavior in the component that we want to be able to use elsewhere? The answer is directives, which are underused in the current version of Angular. 

There are three types of directives:

* Attribute-based, ie. `[ngClass]`
* Structural, ie. `*ngFor`, `*ngIf`
* Components

Mike focused on attribute-based directives. With directives, we can add behaviors just by adding an attribute to an existing element. We can then pass values in using `@Input()` and use host binding to access DOM properties and manipulate them. We can also use host listeners to handle events, such as clicks. After applying a directive, we can expose events by emitting them to the parent component with event emitters and outputs.

Directives provide a way to share both logic and behavior throughout an application _without_ the burden of unneeded templates. They are underused in the current version of Angular, but can provide powerful shared functionality.

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

Day 2 of ng-conf 2017 was packed with workshops, networking, and fun activities. Day 3 will be normal single track sessions. 

You can tune into the [ng-conf 2017 livestream here](https://www.ng-conf.org/livestream) as well as watch recorded streams from previous days.
