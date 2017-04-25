---
layout: post
title: "Glossary of Modern JavaScript Concepts: Part 2"
description: "Learn about scope, closures, data flow, and concepts commonly utilized in modern JS frameworks & applications."
date: 2017-04-10 8:30
category: Glossary, Technical guide
banner:
  text: "Auth0 makes it easy to add authentication to your JS application."
author:
  name: "Kim Maida"
  url: "https://twitter.com/KimMaida"
  mail: "kim.maida@auth0.com"
  avatar: "https://en.gravatar.com/userimage/20807150/4c9e5bd34750ec1dcedd71cb40b4a9ba.png"
design:
  image: https://cdn.auth0.com/blog/js-fatigue/JSLogo.png
  bg_color: "#222228"
tags:
- javascript
related:
- 2017-02-10-glossary-of-modern-javascript-concepts
- 2017-03-22-how-to-manage-javascript-fatigue
---

**TL;DR:** In the [first part of the Glossary of Modern JS Concepts](https://auth0.com/blog/glossary-of-modern-javascript-concepts/) series, we learned about functional, reactive, and functional reactive programming. In **Part 2**, we'll gain an understanding of concepts like _scope_, _closures_, _tree shaking_, _components_, and more, as well as JavaScript application topics such as _data flow_ and _change detection_.

---

## Introduction

Modern JavaScript has experienced massive proliferation over recent years and shows no signs of slowing. Numerous concepts appearing in JS blogs and documentation are still unfamiliar to many front-end developers. In this post series, we'll learn intermediate and advanced concepts in the current front-end programming landscape and explore how they apply to modern JavaScript, JS frameworks, and JS applications.

---

## Concepts

In this article, we'll address concepts that are crucial to understanding modern JavaScript and JS applications, including **scope and closures, data flow, change detection, components, compilation, and more**.

You can jump straight into each concept here, or continue reading to learn about them in order.

* <a href="#scope-closures" target="_self">Scope (Global, Local, Lexical) and Closures</a>
* <a href="#data-flow-binding" target="_self">One-way Data Flow and Two-way Data Binding</a>
* <a href="#change-detection" target="_self">Change Detection in JS Frameworks: Dirty Checking, Accessors, Virtual DOM</a>
* <a href="#web-components" target="_self">Web Components</a>
* <a href="#smart-dumb-components" target="_self">Smart and Dumb Components</a>
* <a href="#jit" target="_jit">JIT (Just-In-Time) Compilation</a>
* <a href="#aot" target="_self">AoT (Ahead-of-Time) Compilation</a>
* <a href="#tree-shaking" target="_self">Tree Shaking</a>

---

## <span id="scope-closures"></span>Scope (Global, Local, Lexical) and Closures

_"Explain closures"_ is a famous (and occasionally dreaded) JavaScript technical interview question. The truth is that plenty of skilled JS developers have difficulty explaining closures, even if they conceptually _understand_ (and even use) them. Let's back up and talk about the concepts necessary to explain a closure.

### Scope

In order to grasp _closures_, we need to understand **scope** first. Scope is simply the context of our code: where variables and functions are accessible.

The following example demonstrates two scopes, **global scope** and **local scope**:

```js
// Global scope
var globalVar = 'Hello, ';
console.log(localVar); // Uncaught ReferenceError: localVar is not defined

someFunction() {
  // Local scope
  var localVar = 'World!';
  console.log(globalVar + localVar); // 'Hello, World!'
}
```

Everything has access to the **global scope**. If we open an empty `.js` file and type `var globalVar`, this variable is accessible to anything else we'll create. If we executed the file in a browser, `globalVar`'s function scope would be `window`.

> **Note:** If we declare a new variable without the `var` keyword, it will be placed in the _global_ scope. You may have encountered this before (perhaps accidentally).

The `someFunction` function creates its own **local scope**. It also inherits access to the global scope. We can freely use `globalVar` _inside_ `someFunction`. However, the global scope does _not_ have access to nested contexts, such as `someFunction`'s local scope. If we try to log `localVar` from the global scope, we will receive an error because `localVar` is not defined in the global scope.

In a nutshell, nested functions have their own scope. Functions declared inside another function also have access to their parent functions' scopes. This is called the **scope chain**.

**Lexical scope** (or _static scope_) refers to the fact that every nested function can access the functions that contain it.

Consider this example:

```js
// Lexical scope and scope chain
var a = 1;

function outerFunc() {
  var b = 2;
  console.log(a + b);
  
  function middleFunc() {
    var c = 3;
    console.log(a + b + c);
    
    function innerFunc() {
      var d = 4;
      console.log(a + b + c + d);
    }
    
    innerFunc(); // logs 10 (1 + 2 + 3 + 4)
  }
  
  middleFunc(); // logs 6 (1 + 2 + 3)
}

outerFunc(); // logs 3 (1 + 2)
```

This code is available to run at this [JSFiddle: JS Scope](https://jsfiddle.net/kmaida/7frrzym4/). `innerFunc` is the innermost function. It is declared inside `middleFunc`, which is in turn declared in `outerFunc`.

The `innerFunc` function can access variables declared in all of its parent scopes. Its scope chain allows access to:

* `a` from the _global_ scope,
* `b` from `outerFunc`,
* `c` from `middleFunc`, and
* `d` from `innerFunc`'s own local scope.

This only works _down the nested functions, not up_. For instance, the locally scoped variable `d` is declared in `innerFunc` and is _not_ accessible to `middleFunc`, `outerFunc`, or the global scope.

### Closures

In the [first part of the Glossary of Modern JavaScript Concepts](https://auth0.com/blog/glossary-of-modern-javascript-concepts/), we learned about _higher-order functions_ and functions as first-class objects. If this doesn't sound familiar, take a moment to review the section on [Higher-order Functions](https://auth0.com/blog/glossary-of-modern-javascript-concepts/#higher-order-functions).

Now let's revisit this higher-order function example from Part 1:

```js
// Higher-order function
function whenMeetingJohn() {
  return function() {
    alert('Hi!');
  }
}
var atLunchToday = whenMeetingJohn();

atLunchToday(); // alerts "Hi!"
```

This is a function that returns another function. Let's update this example to add an argument (`salutation`) and a `greeting` variable to `whenMeetingJohn`'s local scope. We'll also name the returned function `alertGreeting` so we can refer to it more easily:

```js
// Closures
function whenMeetingJohn(salutation) {
  var greeting = salutation + ', John!';
  
  function alertGreeting() {
    alert(greeting);
  }
  return alertGreeting;
}
var atLunchToday = whenMeetingJohn('Hi');

atLunchToday(); // alerts "Hi, John!"
whenMeetingJohn('Whassup')(); // alerts "Whassup, John!"
```

This code is available to run at this [JSFiddle: JS Closures](https://jsfiddle.net/kmaida/c9wuupz8/). 

A **closure** is formed when a function (`alertGreeting`) declared inside an outer function (`whenMeetingJohn`) references variables from the outer function's local scope (such as the `greeting` variable).

The term **closure** refers to the function _and_ the lexical environment (any local variables that were in scope when the closure was created) in which that function was declared.

When we execute `atLunchToday()`, we receive an alert with the argument we passed during assignment (`'Hi'` in this case) and the `greeting` variable that was accessible in `alertGreeting`'s lexical environment.

> **Note:** We can also call the _returned_ function (`alertGreeting`) _without_ assigning it. Doing so looks like this: `whenMeetingJohn('Whassup')()`.

Hopefully we can see the value in closures when looking at this simple example. We can greet John with several different salutations and each time we create a closure with access to the particular salutation data in scope at the time of creation.

Another common example demonstrating closures uses a simple addition expression:

```js
// Closures
function addCreator(x) {
  return function(y) {
    alert(x + y);
  }
}
var add1 = addCreator(1);
var add5 = addCreator(5);

add1(2); // alerts 3
add5(2); // alerts 7
```

This code can be run at this [JSFiddle: JS Closures - Adder](https://jsfiddle.net/kmaida/qfvyofcs/). Both `add1` and `add5` are closures with different lexical environments storing different values for the `x` argument.

### Scope and Closures Takeaways

Scope is something that many JS developers learn early on, but may not have had to _explain_ in words or with specific examples. Understanding scope is vital to writing good JavaScript.

> **Note:** There is more to scope than we covered here. There are some great resources available to aid in achieving greater understanding, especially with regard to the [`this` keyword](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this). See below for more links.

Closures associate data with a function utilizing the lexical environment the function was declared in.

To learn more about **scope and closures** (and `this`), check out the following resources:

* [Everything you wanted to know about JavaScript scope](https://toddmotto.com/everything-you-wanted-to-know-about-javascript-scope/)
* [Explaining JavaScript Scope and Closures](https://robertnyman.com/2008/10/09/explaining-javascript-scope-and-closures/)
* [Scope in JavaScript](http://www.digital-web.com/articles/scope_in_javascript/)
* [What is lexical scope?](http://stackoverflow.com/a/1047491)
* [MDN: Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)
* [What is "this"?](https://howtonode.org/what-is-this)
* [MDN: this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)
* [Understand JavaScript's "this" With Clarity, and Master It](http://javascriptissexy.com/understand-javascripts-this-with-clarity-and-master-it/)
* [JavaScript: How does the "this" keyword work?](http://stackoverflow.com/a/3127440)

---

## <span id="data-flow-binding"></span>One-way Data Flow and Two-way Data Binding

With the proliferation of JavaScript frameworks and single-page applications, it's important for JS developers to understand concepts like data flow / binding, and how the tools we're using manage this.

### One-way Data Flow

An application or framework with **one-way data flow** uses the model as the single source of truth. [React](https://facebook.github.io/react/) is a widely recognized example of one-way data flow (or _one-way data binding_). Messages are sent from the UI in the form of events to signal the model to update.

Take a look at the following React example:

```js
// One-way data flow with React
class OneWay extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    // set initial this.state.text to an empty string
    this.state = {
      text: ''
    };
  }
  handleChange(e) {
    // get new input value from the event and update state
    this.setState({
      text: e.target.value
    });
  }
  render() {
    return (
      <div>
        <input type="text" onChange={this.handleChange} />
        <p>Text: {this.state.text}</p>
      </div>
    );
  }
}
```

This code is available to run at [JSFiddle: React One-way Data Flow](https://jsfiddle.net/kmaida/045znrsf/). We can see that the `state` object model is established in the `constructor` function. The initial value of `this.state.text` is an empty string. In our `render()` function, we add an `onChange` handler to our `<input>` element. We use this handler to `setState()`, signalling the `state` object model to update the `text` property with the new value of the input field.

Data is _only flowing in one direction_: from the model down. The UI input does _not_ have direct access to the model. If we want to update state in response to changes from the UI, the input must send a message carrying the payload. The only way the UI can influence the model is through this event and the [`setState()` method](https://facebook.github.io/react/docs/react-component.html#setstate). The UI will never [automagically](https://en.wiktionary.org/wiki/automagical) update the model.

> **Note:** In order to reflect changes from the model _to_ the UI, React creates a new virtual DOM and diffs the old virtual DOM with the updated virtual DOM. Only the _changes_ are then rendered in the real DOM. We'll talk more about this in the section on <a href="#change-detection" target="_self">change detection</a>.

### Two-way Data Binding

In **two-way data binding**, the data flows in both directions. This means that the JS can update the model _and_ the UI can do so as well. A common example of two-way data binding is with [AngularJS](https://angularjs.org).

> **Note:** In this article, _AngularJS_ refers specifically to version 1.x of the framework while _Angular_ refers to versions 2.x and up, as per the [Branding Guidelines for Angular](http://angularjs.blogspot.com/2017/01/branding-guidelines-for-angular-and.html).

Let's implement the same example from above, but with AngularJS two-way data binding:

```js
// AngularJS two-way data binding
// script.js
(function() {
  angular
    .module('myApp', [])
    .controller('MyCtrl', function($scope) {
      // set initial $scope.text to an empty string
      $scope.text = '';
      // watch $scope.text for changes
      $scope.$watch('text', function(newVal, oldVal) {
        console.log(`Old value: ${oldVal}. New value: ${newVal}`);
      });
    });
}());
```

```html
<!-- AngularJS two-way data binding -->
<!-- index.html -->
<body ng-app="myApp">
  <div ng-controller="MyCtrl">
    <input type="text" ng-model="text" />
    <p>Text: {{text}}</p>
  </div>
</body>
```

This code is available to run at [Plunker: AngularJS two-way binding](http://plnkr.co/edit/guuX5XYIYwI7OcoflTur?p=preview). 

In our controller, we set up the `$scope.text` model. In our template, we associate this model with the `<input>` using `ng-model="text"`. When we change the input value in the UI, the model will also be updated in the controller. We can see this in the `$watch()`.

> **Note:** Using `$watch()` in a controller is debateable practice. We've done it here for _example purposes_. In your own AngularJS apps, take into consideration that there are alternatives to using `$watch()` in controllers (such as events), and if you do use `$watch()`, always [deregister your watches `$onDestroy`](https://www.bennadel.com/blog/2480-unbinding-watch-listeners-in-angularjs.htm). 

This is two-way binding in AngularJS. As you can see, we didn't set up any events or handlers to explicitly signal the controller that the model was updated in the UI. The `text` data binding in the template automatically uses a [watcher](https://medium.com/@kentcdodds/counting-angularjs-watchers-11c5134dc2ef) to display changes to the model. We can also `$watch()` the model. Watching should be done in services or directive `link` functions, not in controllers

> **Note:** AngularJS uses what's called the [digest cycle](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$digest) (dirty checking) to compare a value with the previous value. You can read more about dirty checking in AngularJS in the section on <a href="#change-detection" target="_self">change detection</a>.

### Aside: Two-way Data Binding in Angular

But wait! [Angular](https://angular.io) has the "banana-in-a-box" `[(ngModel)]`, right? On the surface, this may look like persistence of automagical two-way data binding. However, that is not the case. [Angular's two-way binding `[()]` syntax](https://angular.io/docs/ts/latest/guide/template-syntax.html#!#two-way) simply shortcuts property and event binding in a template, and the [`ngModel` directive](https://angular.io/docs/ts/latest/api/forms/index/NgModel-directive.html) supplies an `ngModelChange` event for you. To learn more about this, check out [this article on two-way binding in Angular](https://blog.thoughtram.io/angular/2016/10/13/two-way-data-binding-in-angular-2.html).

The following are functionally equivalent and demonstrate the `ngModel` directive:

```js
// ngModel directive: two-way binding syntax
<input [(ngModel)]="text" />
<p>{{text}}</p>

// ngModel property and event binding
<input [ngModel]="text" (ngModelChange)="text=$event" />
<p>{{text}}</p>
```

The [Angular docs on two-way binding](https://angular.io/docs/ts/latest/guide/template-syntax.html#!#two-way) cover this syntax thoroughly.

### Data Flow and Binding Takeaways

Many modern JavaScript frameworks and libraries utilize unidirectional data flow ([React](https://facebook.github.io/react/), [Angular](https://angular.io), [Inferno](http://infernojs.org/), [Redux](http://redux.js.org/), etc.). Why? One-way data flow encourages clean architecture with regard to how data moves through an application. Application state is also easier to manage, updates are more predictable, and performance can be better as well.

Although automagical two-way data binding was one of [AngularJS](https://angularjs.org/)'s most popular demos back in 2009, [Angular](https://angular.io) has left it behind. Some Angular developers lamented this initially, but ultimately, many found that performance gains and greater control outweighed automagic.

As we saw in the React example above, it's important to remember that one-way data flow does _not_ mean that it's difficult to update the store from the UI. It only means that such updates are done deliberately with specific instruction. It's less magical, but much more manageable.

> **Note:** Generally when developers mention "implementing two-way data binding" in frameworks with one-way data flow (such as React), they are referring to the steps necessary to have UI changes notify the state that it should be updated. They are not looking for a way to implement _automagical_ two-way binding.

To learn more about **one-way data flow and two-way data binding**, check out the following resources:

* [Video: Introducing One-Way Data Flow](https://www.sitepoint.com/video-introducing-one-way-data-flow/)
* [Diagrams comparing one-way and two-way data binding](http://stackoverflow.com/a/37566693)
* [Why does React emphasize unidirectional data flow and Flux architecture?](https://hashnode.com/post/why-does-react-emphasize-on-unidirectional-data-flow-and-flux-architecture-ciibz8ej600n2j3xtxgc0n1f0)
* [Data binding code in 9 JavaScript frameworks](http://engineering.paiza.io/entry/2015/03/12/145216) (from 2015, but still worth a look)
* [Two-way Data Binding in Angular (v2+)](https://blog.thoughtram.io/angular/2016/10/13/two-way-data-binding-in-angular-2.html)
* [AngularJS Docs - Data Binding](https://docs.angularjs.org/guide/databinding)
* [Thinking in React](https://facebook.github.io/react/docs/thinking-in-react.html)

---

## <span id="change-detection"></span>Change Detection in JS Frameworks: Dirty Checking, Accessors, Virtual DOM

Change detection is an important for any dynamic JavaScript Single Page Application (SPA). When the user updates something, the app must have a way to detect and react to that change appropriately. Some kind of change detection is therefore vital to SPA frameworks.

At a fairly high level, let's explore a few methods of change detection used in popular JavaScript frameworks today.

### Dirty Checking

Although [Angular](https://angular.io) was released, [AngularJS](https://angularjs.org) still accounts for multitudes of apps that are in production or development right now. AngularJS uses what's known as the [_digest cycle_](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$digest) to detect changes in an application. Under the hood, the digest cycle is _dirty checking_. What does this mean?

**Dirty checking** refers to a deep comparison that is run on all models in the view to check for a changed value. AngularJS's digest cycle adds a _watcher_ for every property we add to the `$scope` and bind in the UI. Another watcher is added when we want to watch values for changes using `$scope.$watch()`.

> <em>"AngularJS remembers the value and compares it to a previous value. This is basic dirty-checking. If there is a change in value, then it fires the change event."</em> —[Miško Hevery](https://twitter.com/mhevery), creator of Angular

The digest cycle is a _loop_. AngularJS runs through its list of watchers and checks to see if any of the watched`$scope` variables have changed (aka, are "dirty"). If a variable has not changed, it moves on to the next watched variable. If it finds one that is dirty, it remembers its new value and _re-enters the loop_. When no changes are detected in the entire watch list, the DOM is updated.

The major advantages of dirty checking are that it's simple and predictable: there is no extending of objects and there are no APIs involved. However, it's also inefficient. Whenever _anything_ changes, the the digest cycle is triggered. Therefore, it's important that care is taken when creating watchers in AngularJS. Every time a `$scope` property is bound to the UI, a watcher is added. Every time a `$watch()` is implemented, another watcher is added. Many directives also add watchers, and so do scope variables, filters, and repeaters.

Though dirty checking can still be fast in a simple app, we can easily see how this can get out of hand in a complex implementation. This has led to articles such as [11 Tips to Improve AngularJS Performance: 1. Minimize/Avoid Watchers](https://www.alexkras.com/11-tips-to-improve-angularjs-performance/#watchers) and [Speeding up AngularJS's $digest loop](https://coderwall.com/p/d_aisq/speeding-up-angularjs-s-digest-loop).

> **Note:** Angular (v2+) [no longer](https://gofore.com/en/angular-2-change-detection-part-2/) [uses](https://blog.thoughtram.io/angular/2016/02/22/angular-2-change-detection-explained.html) [dirty checking](https://vsavkin.com/change-detection-in-angular-2-4f216b855d4c).

### Accessors

[Ember](https://emberjs.com/) and [Backbone](http://backbonejs.org/) use **data accessors** (_getters_ and _setters_) for change detection. [Ember objects](https://emberjs.com/api/classes/Ember.Object.html) inherit from Ember's APIs and have [`get()`](https://emberjs.com/api/classes/Ember.Object.html#method_get) and [`set()`](https://emberjs.com/api/classes/Ember.Object.html#method_set) methods that must be used to update models with data binding. This enables the binding between the UI and the data model and Ember then knows _exactly_ what changed. In turn, only the modified data triggers change events to update the app.

> **Note:** In Backbone, this is done with [Backbone models](http://backbonejs.org/#Model) with [`get()`](http://backbonejs.org/#Model-get) and [`set()`](http://backbonejs.org/#Model-set) methods.

This method is straightforward and enforces that the application author be very deliberate regarding their data bindings. However, on the flipside of the same coin, it can occasionally lead to confusion _because_ `Ember.Object`s are only used when data binding. This mixed data update approach can result in the developer scratching their head when things aren't updating because of a forgotten setter or getter.

### Virtual DOM

**Virtual DOM** is used by [React](https://facebook.github.io/react/) (and [Inferno.js](https://infernojs.org)) to implement change detection. React doesn't specifically detect each change. Instead, [the _virtual_ DOM](https://medium.com/@rajikaimal/react-js-internals-virtual-dom-d054347b7f00) is used to _diff_ the previous state of the UI and the new state when a change occurs. React is notified of such changes by the use of [`setState()`](https://facebook.github.io/react/docs/react-component.html#setstate), which triggers the [`render()`](https://facebook.github.io/react/docs/react-component.html#render) method to perform the diff.

Virtual DOM (occasionally known as V-DOM) is a JavaScript data model that _represents_ the real DOM tree. When a virtual DOM is generated, nothing is rendered to the browser. The [old model is compared to the new model](https://facebook.github.io/react/docs/reconciliation.html) and once React determines which parts of the virtual DOM have changed, only those parts are patched in the real DOM.

### Change Detection Takeaways

There are many ways that JavaScript frameworks manage change detection, including [more that](https://vuejs.org/v2/guide/reactivity.html#How-Changes-Are-Tracked) [weren't](https://www.polymer-project.org/2.0/docs/devguide/observers) [covered here](https://auth0.com/blog/understanding-angular-2-change-detection/). They each have strengths and weaknesses, but the modern trend is toward more deliberate and less automagical methods, many utilizing [_observer pattern_](https://addyosmani.com/resources/essentialjsdesignpatterns/book/#observerpatternjavascript) under the hood.

To learn more about **change detection** in JS frameworks, check out the following resources:

* [Change and its Detection in JavaScript Frameworks](https://teropa.info/blog/2015/03/02/change-and-its-detection-in-javascript-frameworks.html)
* [Change Detection Overview](https://gofore.com/en/change-detection-overview-part-1/)
* [Dirty checking in AngularJS](http://stackoverflow.com/questions/9682092/how-does-data-binding-work-in-angularjs/9693933#9693933)
* [The Digest Loop and Apply](https://www.ng-book.com/p/The-Digest-Loop-and-apply/)
* [Ember.Object Class](https://emberjs.com/api/classes/Ember.Object.html)
* [Accessors vs. Dirty Checking in JavaScript Frameworks](http://blog.bguiz.com/2013/08/05/accessors-vs-dirty-checking-in-javascript-frameworks/)
* [React.JS internals: Virtual DOM](http://reactkungfu.com/2015/10/the-difference-between-virtual-dom-and-dom/)
* [The Difference Between Virtual DOM and DOM](http://reactkungfu.com/2015/10/the-difference-between-virtual-dom-and-dom/)
* [React: Reconciliation](https://facebook.github.io/react/docs/reconciliation.html)
* [virtual-dom](https://github.com/Matt-Esch/virtual-dom)
* [VueJS: How Changes are Tracked](https://vuejs.org/v2/guide/reactivity.html#How-Changes-Are-Tracked)
* [Polymer 2.0: Observers and Computed Properties](https://www.polymer-project.org/2.0/docs/devguide/observers)
* [Understanding Angular 2 Change Detection](https://auth0.com/blog/understanding-angular-2-change-detection/)
* [Angular Change Detection Explained](https://blog.thoughtram.io/angular/2016/02/22/angular-2-change-detection-explained.html)

---

## <span id="web-components"></span>Web Components

**Web components** are encapsulated, reusable widgets based on web platform APIs. They are composed of four standards:

* [Custom Elements](https://w3c.github.io/webcomponents/spec/custom/)
* [HTML Templates](https://html.spec.whatwg.org/multipage/scripting.html#the-template-element)
* [Shadow DOM](https://w3c.github.io/webcomponents/spec/shadow/)
* [HTML Imports](https://w3c.github.io/webcomponents/spec/imports/)

Web components allow us to architect and import custom elements that automatically associate JS behavior with templates and can utilize shadow DOM to provide CSS scoping and DOM encapsulation. 

Web components consist of a set of [web platform APIs](https://www.w3.org/standards/techs/components). There are libraries (such as [Polymer](https://www.polymer-project.org/)) and polyfills (such as [webcomponents.js](https://github.com/webcomponents/webcomponentsjs)) to bridge the gap between [current browser support](http://jonrimmer.github.io/are-we-componentized-yet/) and future web API support.

Let's say we want to create a simple web component (`my-component`) that shows some static text. We'd like to use HTML attributes to have the component change its text color and log something to the console. To display the `<my-component>` custom element in our website or app, we might import and use it like so:

```html
<!-- index.html -->
<html>
  <head>
    ...
    <script src="./bower_components/webcomponentsjs/webcomponents.min.js"></script>
    <link rel="import" href="my-web-cmpnt.html">
  </head>
  <body>
    <my-web-cmpnt color="red" log="Hello"></my-web-cmpnt>
    ...
```

To create the `my-component` web component utilizing shadow DOM, our `my-component.html`'s `<template>` might look something like this:

```html
<!-- my-component.html -->
<template>
  <style>
    .my-component {
      display: block;
      padding: 20px;
    }
  </style>

  <div class="my-component">
    <p>This is a custom element!</p>
  </div>
</template>
```

The `<template>` defines the element's CSS styling and HTML markup. Then, to take advantage of shadow DOM and JS functionality, we would add a `<script>` tag to our `my-component.html` file after the closing `</template>` tag. For example:

```js
<template>...</template>

<script>
  // my-component.html <script> tag
  // (separated code block for syntax highlighting)
  (function(window, document, undefined) {
    var doc = document;
    // my-component document
    var self = (doc._currentScript || doc.currentScript).ownerDocument;
    var template = self.querySelector('template').content;

    // ShadowCSS shim, if needed
    if (window.ShadowDOMPolyfill) {
      WebComponents.ShadowCSS.shimStyling(template, 'my-component');
    }

    class MyComponent extends HTMLElement {
      constructor() {
        super();
      }
      connectedCallback() {
        // get attributes
        var color = this.getAttribute('color');
        var log = this.getAttribute('log');
        // utilize shadow DOM
        var shadowRoot = this.attachShadow({mode:'open'});  
        var clone = doc.importNode(template, true);
        var myComponent;
        
        shadowRoot.appendChild(clone);
        myComponent = shadowRoot.querySelector('.my-component');

        // style with color and output log
        myComponent.style.color = color;
        console.log(log);
      }
    }
    window.customElements.define('my-component', MyComponent);
  }(window, document));
</script>
```

When inspected in the browser, our component looks like this:

![custom web component in Chrome inspector](https://cdn2.auth0.com/blog/js-glossary-2/screenshot_web-component.jpg)

For a much more indepth tutorial, check out [Web Components: How To Craft Your Own Custom Components](https://auth0.com/blog/web-components-how-to-craft-your-own-custom-components/).

Web components bring powerful, framework-like capabilities to browsers, and while the spec and support are still being finalized, the concepts have inspired frameworks such as [Angular](https://angular.io/docs/ts/latest/api/core/index/Component-decorator.html) (which initially attempted to use Web API web components, but ended up with its own implementation). Many JS frameworks ([Angular](https://angular.io/docs/ts/latest/api/core/index/Component-decorator.html), [React](https://facebook.github.io/react/docs/react-component.html), [Ember](https://www.emberjs.com/api/classes/Ember.Component.html), [Vue](https://vuejs.org/v2/guide/components.html)) leverage the concept of componetization with varying degrees of similarity to the web components API.

### Web Components Takeaways

Web components allow us to create and use custom HTML elements with JS. They can also utilize the shadow DOM to provide CSS scoping and DOM encapsulation. By themselves, web components alone aren't a substitute for all the features of a SPA framework. However, their core concepts are heavily leveraged by many frameworks in use today and their future in the front-end landscape offers many opportunities for a growing [community of resources](https://www.webcomponents.org/).

To learn more about **web components**, check out the following resources:

* [W3C Web Components Current Status](https://www.w3.org/standards/techs/components)
* [webcomponents.org](https://www.webcomponents.org/introduction)
* [Web Components: How To Craft Your Own Custom Components](https://auth0.com/blog/web-components-how-to-craft-your-own-custom-components/)
* [MDN: Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
* [Using Web Components in React](https://facebook.github.io/react/docs/web-components.html)
* [Build Your First App with Polymer and Web Components](https://auth0.com/blog/build-your-first-app-with-polymer-and-web-components/)
* [Are We Componetized Yet?](http://jonrimmer.github.io/are-we-componentized-yet/)
* [webcomponentjs on GitHub](https://github.com/webcomponents/webcomponentsjs)
* [Google Polymer](https://www.polymer-project.org/)

---

## <span id="smart-dumb-components"></span>Smart and Dumb Components

As we talked about above, some modern JS frameworks are heavily component-based. This leads to concepts of _component architecture_ and _component communication_. In some cases (such as in [React](https://facebook.github.io/react/) and [Angular](https://angular.io)), component architecture utilizes **smart and dumb components**. They are also referred to as "container" (smart) and "presentational" (dumb) components.

### Smart Components

Also known as _container_ components, **smart components** can manage interactions with the application's [state](https://auth0.com/blog/glossary-of-modern-javascript-concepts/#state) and data. They handle business logic and respond to events emitted from children (which are often dumb components).

### Dumb Components

Also known as _presentational_ components, **dumb components** rely on _inputs_ supplied by their parents and are ignorant of application state. They can be sometimes be considered [pure](https://auth0.com/blog/glossary-of-modern-javascript-concepts/#purity) and are modular and reusable. They can communicate to their parents when reacting to an event, but they don't _handle_ the event themselves.

### Presentational and Container Components in React

[Dan Abramov](https://github.com/gaearon), the co-author of [Redux](http://redux.js.org/), [Create React App](https://github.com/facebookincubator/create-react-app), [React Hot Loader](https://github.com/gaearon/react-hot-loader), and more, originally wrote about [presentational and container components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) and their meaning in [React](https://facebook.github.io/react/), particularly when used with state management like Flux or Redux. In a nutshell, the concepts can be summarized as follows:

**Presentational (aka Dumb) Components:**

* Focus on "_How things look_"
* Allow containment with `this.props.children`
* No dependencies on the rest of the app (ie., no Flux or Redux actions or stores)
* Only receive data; do not load or mutate it
* Are generally [functional](https://facebook.github.io/react/blog/2015/10/07/react-v0.14.html#stateless-functional-components) (with exceptions)

**Container (aka Smart) Components:**

* Focus on "_How things work_"
* Provide data and behavior to other components
* Usually have no or very little DOM markup, and never have styles
* Are often stateful data sources
* Are generally generated from [higher order components](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750)

Check out [his article](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) for more details and explanation.

### Example: Smart and Dumb Components in Angular

For a quick example that doesn't involve a state container, let's look at some simple smart and dumb components using [Angular](https://angular.io).

Let's say we want a madlib-style feature where we [apologize for lashing out](https://www.threadless.com/product/7719/im_sorry_for_what_i_said_when_i_was_hungry) while hungry, tired, or debugging. When we're done, it should look like this in the browser:

![Angular smart and dumb components](https://cdn2.auth0.com/blog/js-glossary-2/angular-smart-dumb.gif)

The smart (container) component looks like this:

```js
// app/smart.component.ts
import { Component } from '@angular/core';
import { DumbComponent } from './dumb.component';

@Component({
  selector: 'my-smart-cmpnt',
  template: `
    <h1>I'm sorry for what I said when I was {{selectedOption}}.</h1>
    
    <my-dumb-cmpnt
      [options]="optionsArr"
      (changedOption)="onOptionChange($event)"></my-dumb-cmpnt>
  `
})
export class SmartComponent { 
  optionsArr = ['hungry', 'tired', 'debugging'];
  selectedOption = '______';
  
  onOptionChange(e: string) {
    this.selectedOption = e;
  }
}
```

This component manages all of the data necessary for this feature. It provides the options for the madlib (`optionsArr`) and then handles when the user chooses an option (`onOptionChange()`). It stores the `selectedOption`, passes the possible options into the dumb component, and sets the selected option when the dumb component emits a `changedOption` event.

```js
// app/dumb.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'my-dumb-cmpnt',
  template: `
    <div *ngFor="let option of options">
      <button (click)="select(option)">{{option}}</button>
    </div>
  `
})
export class DumbComponent { 
  @Input() options: Array;
  @Output() changedOption = new EventEmitter();
  
  select(option) {
    this.changedOption.emit(option);
  }
}
```

In turn, the dumb component accepts the options array as input and iterates over each item to create the buttons to select an option. When an option is clicked, the `changedOption` event is emitted with the selected option as its payload. The parent smart component then handles this event and sets its `selectedOption` for display in the UI.

This code is available to run at [Plunker: Angular Smart and Dumb Components](https://embed.plnkr.co/OeUYze7djU90AWmc2Sno/).

### Smart and Dumb Components Takeaways

Smart (container) components manage data, implement business logic, and handle events. Dumb (presentational) components accept inputs and can emit events, which are handled by a parent smart component. Dumb components are modular and can be reused throughout an application due to their more stateless nature. When using a state container like [Redux](https://egghead.io/courses/getting-started-with-redux) or [ngrx/store](https://auth0.com/blog/managing-state-in-angular-with-ngrx-store/), only smart components would dispatch actions or interact with the store.

To learn more about **smart and dumb components**, check out the following resources:

* [Container Components](https://medium.com/@learnreact/container-components-c0e67432e005)
* [Presentational and Container Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)
* [Presentational vs container components](https://twitter.com/dan_abramov/status/711614407537774594?lang=en)
* [React at Preact: Smart Components](https://preact.gitbooks.io/react-book/content/jsx/smart.html)
* [React at Preact: Dumb Components](https://preact.gitbooks.io/react-book/content/jsx/dumb.html)
* [Angular Smart Components vs Presentation Components: What's the Difference, When to Use Each and Why?](http://blog.angular-university.io/angular-2-smart-components-vs-presentation-components-whats-the-difference-when-to-use-each-and-why/)
* [Managing State in Angular with ngrx/store](https://auth0.com/blog/managing-state-in-angular-with-ngrx-store/)

---

## <span id="jit"></span>JIT (Just-In-Time) Compilation

**Just-in-time (JIT) compilation** is the process of translating code written in a programming language to machine code at runtime (during a program or application's execution). At runtime, certain dynamic information is available, such as type identification. A JIT compiler _monitors_ to detect functions or loops of code that are run multiple times ("warm"). These pieces of code are then compiled. If they're quite commonly executed ("hot"), JIT will optimize them and also store the optimized, compiled code for execution.

When the compiler optimizes hot code, it makes assumptions about its types and shape based on consistency of previous executions. At any iteration, if those assumptions turn out to be inaccurate, the optimized code is discarded.

[Browsers use](https://softwareengineering.stackexchange.com/a/291343) [JIT compilation to run JavaScript](https://hacks.mozilla.org/2017/02/a-crash-course-in-just-in-time-jit-compilers/). In the modern JavaScript framework landscape, build tools like the [Angular CLI](https://github.com/angular/angular-cli) can use JIT to compile TypeScript and Angular code to JS to machine code in the browser during local development, compiling each file separately. This provides certain advantages, such as no need to rebuild the project when watching for code changes and a faster initial build time.

### JIT Compilation Takeaways

JIT compilation is used by browsers to compile JavaScript at runtime, and by tools like the Angular CLI to provide a fast local development experience.

To learn more about **JIT compilation**, check out the following resources:

* [What does a just-in-time (JIT) compiler do?](http://stackoverflow.com/a/95679)
* [JIT compiler overview](https://www.ibm.com/support/knowledgecenter/SSYKE2_7.0.0/com.ibm.java.win.70.doc/diag/understanding/jit_overview.html)
* [1/3 A cartoon intro to WebAssembly](https://hacks.mozilla.org/2017/02/a-cartoon-intro-to-webassembly/)
* [2/3 A crash course in just-in-time (JIT) compilers](https://hacks.mozilla.org/2017/02/a-crash-course-in-just-in-time-jit-compilers/)
* [3/3 A crash course in assembly](https://hacks.mozilla.org/2017/02/a-crash-course-in-assembly/)
* [The race for speed part 2: How JavaScript compilers work](http://creativejs.com/2013/06/the-race-for-speed-part-2-how-javascript-compilers-work/)
* [Mozilla TraceMonkey](https://wiki.mozilla.org/JavaScript:TraceMonkey)
* [How the V8 engine works?](http://thibaultlaurens.github.io/javascript/2013/04/29/how-the-v8-engine-works/)
* [JIT vs AOT in Angular2 and how to use it](https://pub.scotch.io/@kashyapmukkamala/jit-vs-aot-in-angular2-and-how-to-use-it)

---

## <span id="aot"></span>AoT (Ahead-of-Time) Compilation

### AoT Compilation Takeaways

To learn more about **AoT compilation**, check out the following resources:

* [Angular: Is AOT Worth It?](https://blog.nrwl.io/angular-is-aot-worth-it-8fa02eaf64d4)

---

## <span id="tree-shaking"></span>Tree Shaking

**Tree shaking** is a JavaScript module bundling term that refers to the static analysis of all imported code and exclusion of anything that isn't actually used.

In a more literal analogy, consider a living tree. The tree is shaken and this causes the dead leaves to fall off, leaving behind the leaves the tree is actively using for photosynthesis. The concept behind tree shaking is _live code inclusion_: we include the parts that are needed to begin with, as opposed to removing the parts that are unneeded at the end (_dead code elimination_).

Tree shaking relies on ES2015 module [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) and [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export). The `import` and `export` statements are compose an app's [static module structure](http://exploringjs.com/es6/ch_modules.html#static-module-structure). When the modules are bundled for deployment, the tree shaker analyzes the static module structure so that unused exports can be excluded, reducing the size of the final bundle.

ES2015 enables us to specify explicit imports. For example, rather than importing the entire RxJS library, we can only import exactly what we want:

```js
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
```

Tree shaking uses this principle to walk the dependency graph and exclude things that aren't needed in order to reduce the size of deployment bundles.

### Tree Shaking Takeaways

_Tree shaking_ is term for JavaScript live code inclusion in module bundlers that use [ES2015](https://auth0.com/blog/a-rundown-of-es6-features/) static `import` and `export` to "shake out" unneeded dependencies on a more granular level, differing from the dynamic `require` statement used by CommonJS or AMD. The principle of tree shaking has been _popularized_ by the [rollup.js](https://rollupjs.org/) module bundler, but it's not exclusive to rollup Tree shaking is utilized in [Webpack 2](https://webpack.js.org/guides/tree-shaking/) as well. The concept of tree shaking and writing code that promotes it is also prevalent in [Angular with](https://angular.io/docs/ts/latest/cookbook/aot-compiler.html#!#tree-shaking) <a href="#aot" target="_self">AoT compilation</a>. 

To learn more about **tree shaking**, check out the following resources:

* [Tree-shaking versus dead code elimination](https://medium.com/@Rich_Harris/tree-shaking-versus-dead-code-elimination-d3765df85c80)
* [rollup.js](https://rollupjs.org/)
* [Tree Shaking with Webpack](https://webpack.js.org/guides/tree-shaking/)
* [Tree-shaking with webpack 2 and Babel 6](http://2ality.com/2015/12/webpack-tree-shaking.html)
* [Angular Docs: Tree shaking](https://angular.io/docs/ts/latest/cookbook/aot-compiler.html#!#tree-shaking)
* [Kendo UI for Angular: Tree Shaking](http://www.telerik.com/kendo-angular-ui/components/framework/tree-shaking/)
* [How To Clean Up Your JavaScript Build With Tree Shaking](https://blog.engineyard.com/2016/tree-shaking)

---

## Conclusion

With the swift rise of JavaScript Single Page Application frameworks and component-based paradigms, it's important to understand JS topics relating to scoping, components, compilation, and bundling.

With this glossary as a starting point, you can begin taking advantage of these concepts and programming paradigms to increase your JavaScript expertise. If anything is still unclear regarding these topics, please consult the links in each section for additional resources. You can also check out the [first part of the Glossary of Modern JS Concepts](https://auth0.com/blog/glossary-of-modern-javascript-concepts/) to learn about the concepts necessary to understand functional programming, reactive programming, and functional reactive programming.