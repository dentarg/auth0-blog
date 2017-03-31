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

**TL;DR:** In the [first part of the Glossary of Modern JS Concepts](https://auth0.com/blog/glossary-of-modern-javascript-concepts/) series, we learned about functional, reactive, and functional reactive programming. In **Part 2**, we'll gain an understanding of core concepts like _scope_, _closures_, _tree-shaking_, and more, as well as JS application topics such as _data flow_ and _change detection_.

---

## Introduction

Modern JavaScript has experienced massive proliferation over recent years and shows no signs of slowing. Numerous concepts appearing in JS blogs and documentation are still unfamiliar to many front-end developers. In this post series, we'll learn intermediate and advanced concepts in the current front-end programming landscape and explore how they apply to modern JavaScript, JS frameworks, and JS applications.

---

## Concepts

In this article, we'll address concepts that are crucial to understanding modern JS and JS applications, including **scope and closures, data flow, change detection, components, compilers, and more**.

You can jump straight into each concept here, or continue reading to learn about them in order.

* <a href="#scope-closures" target="_self">Scope (Global, Local, Lexical) and Closures</a>
* <a href="#data-flow-binding" target="_self">One-way Data Flow and Two-way Data Binding</a>
* <a href="#change-detection" target="_self">Change Detection: Dirty Checking, Virtual DOM, Zones</a>
* <a href="#tree-shaking" target="_self">Tree-shaking</a>

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

This code is available to run at [Plunker: AngularJS two-way binding](http://plnkr.co/edit/guuX5XYIYwI7OcoflTur?p=preview). In our controller, we set up the `$scope.text` model. In our template, we associate this model with the `<input>` using `ng-model="text"`. When we change the input value in the UI, the model will also be updated in the controller.

This is two-way binding in AngularJS. As you can see, we didn't set up any events or handlers to explicitly signal the controller that the model was updated in the UI. The `text` data binding in the template automatically uses a [watcher](https://medium.com/@kentcdodds/counting-angularjs-watchers-11c5134dc2ef) to display changes to the model. We can also `$watch()` the model in the controller.

> **Note:** AngularJS uses what's called the [digest cycle](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$digest) (dirty checking) to compare a value with the previous value. You can read more about dirty checking in AngularJS in the section on <a href="#change-detection" target="_self">change detection</a>.

### Aside: "Two-way Data Binding" in Angular (v2+)

But wait! Angular still has the "banana-in-a-box" `[(ngModel)]`, right? On the surface, this may look like persistence of automagical two-way data binding. However, that is not the case. The [`[()]` syntax](https://angular.io/docs/ts/latest/guide/template-syntax.html#!#two-way) simply shortcuts property and event binding. To learn more about this, check out [this article on two-way binding in Angular](https://blog.thoughtram.io/angular/2016/10/13/two-way-data-binding-in-angular-2.html).

The following are functionally equivalent and demonstrate the [ngModel directive](https://angular.io/docs/ts/latest/api/forms/index/NgModel-directive.html) in Angular:

```js
// ngModel directive: two-way binding syntax
<input [(ngModel)]="text" />
<p>{{text}}</p>

// ngModel property and event binding
<input [ngModel]="text" (ngModelChange)="text=$event" />
<p>{{text}}</p>
```

The [Angular docs on two-way binding](https://angular.io/docs/ts/latest/guide/template-syntax.html#!#two-way) cover this thoroughly.

### Data Flow and Binding Takeaways

Several modern JavaScript frameworks and libraries utilize unidirectional data flow ([React](https://facebook.github.io/react/), [Angular](https://angular.io), [Inferno](http://infernojs.org/), [Redux](http://redux.js.org/), etc.). Why? One-way data flow encourages clean architecture with regard to how data moves through an application. Application state is also easier to manage, updates are more predictable, and performance can be better as well.

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

## <span id="change-detection"></span>Change Detection: Dirty Checking, Virtual DOM, Zones

Change detection is an important for any dynamic JavaScript Single Page Application (SPA). When the user updates something, the app must have a way to detect and react to that change appropriately. Some kind of change detection is therefore vital to SPA frameworks.

At a fairly high level, let's explore a few methods of change detection used in popular JavaScript frameworks today.

### Dirty Checking

Although Angular v2+ is out, [AngularJS v1.x](https://angularjs.org) still accounts for multitudes of apps that are live  and in development right now. AngularJS uses what's known as the [_digest cycle_](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$digest) to detect changes in an application. Under the hood, the digest cycle is **dirty checking**. What does this mean?

Dirty checking refers to a deep comparison that is run on all models in the view to check for a changed value. AngularJS's digest cycle adds a _watcher_ for every property we add to the `$scope` and bind in the UI.

### Virtual DOM

### Zones

### Change Detection Takeaways

To learn more about **change detection**, check out the following resources:

* [Change and its Detection in JavaScript Frameworks](https://teropa.info/blog/2015/03/02/change-and-its-detection-in-javascript-frameworks.html)
* [Change Detection Overview](https://gofore.com/en/change-detection-overview-part-1/)
* [The Digest Loop and Apply](https://www.ng-book.com/p/The-Digest-Loop-and-apply/)
* [Angular Change Detection Explained](https://blog.thoughtram.io/angular/2016/02/22/angular-2-change-detection-explained.html)

---

## Conclusion

...

With this glossary as a starting point, you can begin taking advantage of these concepts and programming paradigms to increase your JavaScript expertise. If anything is still unclear regarding these topics, please consult the links in each section for additional resources. We'll cover more concepts in the next Modern JS Glossary post!