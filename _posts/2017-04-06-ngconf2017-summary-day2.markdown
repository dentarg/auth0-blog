---
layout: post
title: "ng-conf 2017 Summary - Day 2 (Fair Day)"
description: "Angular v4 has been released. Read about Fair Day from ng-conf 2017 (April 6) Day 2."
date: 2017-04-07 8:30
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
- 2017-03-07-managing-state-in-angular-with-ngrx-store
- 2016-11-07-migrating-an-angular-1-app-to-angular-2-part-1
---

**TL;DR:** Learn about the "open-track" Fair Day at [ng-conf 2017](https://www.ng-conf.org/) on April 6, 2017 (Day 2 of 3).

---

## ng-conf 2017: Fair Day

Day 2 of ng-conf 2017 was Fair Day. There were a large number of workshops and sessions running simultaneously with other activities and entertainment such as combat bots, board games, VR park, Prison Escape Bus, Experts Rooms, and lounge/hack rooms. I attended sessions on ngrx, Apollo and GraphQL, machine learning with Angular, and improving components. Summaries follow.

---

## ngrx

[Ngrx](https://github.com/ngrx) consists of small, concise libraries built with RxJS to solve problems such as state management and side effect management in Angular.

### ngrx/store

Ngrx/store is an [RxJS state management container](https://auth0.com/blog/managing-state-in-angular-with-ngrx-store/) heavily based on Redux. It uses actions, reducers, and a single store.

* ngrx/store abstracts away the application reducer: child reducers only handle one piece of the state. New reducers can be added to manage their own individual slices of state.
* reducer is a function of state: initial state goes in, then handles each action and returns the new state. Reducers are pure functions.
* select / dispatch - select returns observable of only that piece of state if it's changed. dispatch sends actions to reducer to update state.
* want to write concise components and refactor select out to selectors. Then we can share these across the application.
* We want to store our selectors where our state is defined. Less responsibility on the component to know how to get the selected data.

### ngrx/effects

* API requests are side effects: any code that interacts with the outside world. We don't know how they're going to behave when that code is run.
* Isolating side effects out of the component tree makes them easier to test.
* ngrx/effects is a side effect model: we can listen for certain actions, perform side effects, and deliver new actions back to the store.
* `@Effect()` decorator hints to tell the store to subscribe
* Returns an observable of an action
* Map action to its payload
* Use switchMap to get results back so previous requests are canceled when a new one is made
* can then map the results
* performed the same action but the component has a lot less responsibility. components are now pure representation of state.

### Performance improvements

Reducers are pure, so we don't need Angular to perform any deep dirty checking. Angular only needs to check if the reference has changed.

### Redux Devtools Extension

* Wire up extension to our application: import `StoreDevtoolsModule` provides a bridge to the Chrome extension, and instrument store in app module (incurs a performance penalty, only use in development) can instrumentOnlyWithExtension(), detects if extension is installed
* provides an interface to see what the state of the application looks like
* time traveling debugger to see history of state

Redux is not great for making simple things quickly. It's great for making complex things simple.

## Managing Data with GraphQL

[Apollo](http://dev.apollodata.com/angular2/), [GraphQL](http://graphql.org/)

* Angular solved: initial loading and size, prerendering, rendering, transitions and animations. No longer concerns.
* Network latency - instant feedback, ie., liking something on Facebook. Caching and prefetching: can reduce network latency. 
* We should have a library that handles network and data management problems: Apollo solves this part. Apollo dev tools.
* Think about data and the network when creating your apps. Every effort makes your app a little bit faster, so everything helps.
  * Send less requests
  * Less data in the requests
* In rest, for example with a chat app:
  * We call the server to get the user and each chat. We often receive a lot of information back.
* GraphQL: describe what info we want and get just this information at the field level.
  * It doesn't matter how many resources we query, we'll get everything in one single response in the structure desired.
  * Can create an apollo query with the exact structure we want back and it returns an observable.
  * Can also do autocompletion with the things that could come back from the server: separates FE and BE in a very easy way
* Changing data: POST in REST (`mutation`)
* Use queries inside components and then we have a "super ngrx" that understands the larger picture and brings back what we need from the server.
* Only query for what you need for a particular component
* Can also do realtime with subscriptions
* You do NOT need a GraphQL backend in order to use GraphQL - you can run GraphQL on your client and get the benefits without touching the server at all, OR build middleware that can query ANY data sources
* schemehub.io
* http://github.com/urigo for examples

## Build, Measure, and Machine Learn with Angular

* By knowing your customers, you get more organic conversions.
* Easily capture analytics data and switch analytics.

https://github.com/rangle/redux-beacon, https://github.com/rangle/feature-toggle-ng2-redux

### Build Measure Learn

We build features and then we want to measure the features and see if visitors like the features or not. We then learn about the visitors and using this information, build better features in the next cycle.

The most important part of any data analysis is how is the data captured? Redux Beacon open source library created at Rangle. Wiretaps Redux sections and sends them to a target of your choice for conversion and reporting purposes.

Conversion: converting users / making users do what you want them to do (downloading an ebook, subscribing, etc.)

Redux Beacon allows you to map Redux or ngrx actions and state to your analytics data model. Sometimes just gathering data is not enough; AB testing can also be performed with feature toggles.

### AB Testing

Almost anything on your website that affects visitor behavior can be AB tested. Features, colors, buttons, CTAs, headlines, etc. Problem with AB testing is that we get the winner, but we don't know the user demographic: analysts want to know this information.

### Personalization

Regionally, visitors might pick different options. Ie, if close to the office geographically, might choose "In office training" whereas people located far away may choose "Online training".

### Machine Learning

A custom Redux Beacon target sends raw data set for each user showing the pages visited, location, and more. This data can be passed to a machine learning algorithm that can take patterns and generate a model. This can score with a probability of user behaviors: decision tree model. Machine learning can predit the probability of which decision a user will make based on the user's behavior.

* save the data
* convert that data to vectors
* train the predictive model
* generate the rules
* do the predictions

## Kick your components up a notch with directives

When building out an application, we build out a component tree-- where do you go from there? If we want to reuse logic, we factor it out into a service. What happens if you have behavior in the component that you want to be able to use elsewhere? Directives!

Directives are underused in the current version of Angular. 

3 types of directives:

* attribute-based [ngClass]
* structural *ngFor, *ngIf
* components

Focus on attribute-based directives. Declaration and usage:

selector is `[blink]`
`@HostBinding()` 

Can add behaviors just by adding an attribute. Want to be able to pass values in using `@Input()` and then use host binding to access a DOM property and manipulate it.

Handling events: use host listener, like: `@HostListener('click') onClick() { ... }`

Exposing events: when you've applied a directive, you may want to let the component know using EventEmitter and `@Output()` (letting the parent component know that something has happened).

### Practical Usage

Security service with user roles: typically we use the service in a component with DI. But now in order to use that, we need security _and_ logic detailing how to apply the information from the security service to the DOM elements in the component (and replicate that logic to turn elements on and off).

> "Let's use directives!"

Going to inject the service into a directive and then drop the directive into component(s). Selector and input can both share a name so that values can be passed into the attribute selector. We can subscribe and unsubscribe in directives if necessary. Can use a host binding to bind to a property and execute logic.

Most people aren't taking advantage of directives, but there's a lot you can do with them to expand logic and behaviors in your application.