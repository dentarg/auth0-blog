---
layout: post
title: "Glossary of Modern JavaScript Concepts"
description: "Learn many of the common terms and concepts of today's JavaScript landscape."
date: 2017-02-05 8:30
category: Glossary, Technical guide
banner:
  text: "Auth0 makes it easy to add authentication to your JS application."
author:
  name: "Kim Maida"
  url: "https://twitter.com/KimMaida"
  mail: "kim.maida@auth0.com"
  avatar: "https://en.gravatar.com/userimage/20807150/4c9e5bd34750ec1dcedd71cb40b4a9ba.png"
design:
  image: https://cdn.auth0.com/blog/...
  bg_color: "#"
tags:
- javascript
related:
- 2017-01-16-a-brief-history-of-javascript
- 2016-11-16-a-rundown-of-es6-features
---

## Introduction

Modern JavaScript has experienced massive proliferation over the last few years and shows no signs of slowing. There are new topics surfacing as well as numerous classical programming concepts that are unfamiliar to many front-end developers. We'll take a look at some of the common concepts in the current front-end landscape and explore how they apply to modern JavaScript.

---

## Concepts

You can jump straight into the following topics:

* <a href="#pure-impure-side-effects" target="_self">Pure Functions, Impure Functions, Side Effects</a>
* <a href="#state" target="_self">State: Stateful and Stateless</a>
* <a href="#immutable-mutable" target="_self">Immutability and Mutability</a>
* <a href="#imperative-declarative" target="_self">Imperative and Declarative Programming</a>
* <a href="#functional-programming" target="_self">Functional Programming</a>
* <a href="#observables" target="_self">Observables</a>
* <a href="#reactive-programming" target="_self">Reactive Programming</a>
* <a href="#functional-reactive-programming" target="_self">Functional Reactive Programming</a>
* <a href="#web-components" target="_self">Web Components</a>
* <a href="#dumb-smart-components" target="_self">Dumb and Smart Components</a>

---

## <span id="pure-impure-side-effects"></span>Pure Functions, Impure Functions, Side Effects

### Pure Functions

A **pure function**'s _return value_ is determined only by its _input values_ (arguments) with no side effects. When given the same argument, the result will always be the same. Here is an example:

```js
function half(x) {
  return x / 2;
}
```

The `half(x)` function takes a number `x` and returns a value of half of `x`. If we pass an argument of `8` to this function, the function will always return `4`. When invoked, a pure function can be replaced by its result. For example, we could replace `half(8)` with `4` wherever used in our code with no change to the final outcome. This is called **[_referential transparency_](https://en.wikipedia.org/wiki/Referential_transparency)**.

Pure functions only depend on what's passed to them. For example, a pure function cannot reference variables from a parent scope unless they are explicitly passed into the function as arguments. Even then, they may _not modify_ the parent scope.

```js
var someNum = 8;

// This is NOT a pure function
function impureHalf() {
  return someNum / 2;
}
```

In summary:

* In pure functions, the same input will always produce the same output.
* Pure functions rely only on local state and do not mutate external state.
* Pure functions produce no [_side effects_](https://en.wikipedia.org/wiki/Side_effect_%28computer_science%29).

### Impure Functions

An **impure function** mutates state outside its scope. Any function that has side effects is impure. Procedural functions with no utilized return value are also impure. Consider the following examples:

```js
// This impure function produces a side effect.
function showAlert() {
  alert('This is a side effect!');
}

// This impure function mutates external state.
var globalVal = 1;
function incrementGlobalVal() {
  globalVal++;
}

// This impure function calls pure functions procedurally.
function proceduralFn() {
  const result1 = pureFnFirst(1);
  const result2 = pureFnLast(2);
  console.log(`Done with ${result1} and ${result2}!`);
}
```

### Side Effects

When a function or expression modifies state outside its own context, this is a **side effect**. Examples of side effects include making a call to an API, writing data, raising an alert dialog, modifying an external variable, etc. If a function produces side effects, it is considered _impure_.

### Pure and Impure Function Takeaways

Plenty of quality code consists of impure functions that procedurally invoke pure functions. This still produces advantages for testing and immutability. Referential transparency also enables [_memoization_](https://www.interviewcake.com/concept/python/memoization): caching and storing function call results and [reusing the cached results](https://www.sitepoint.com/implementing-memoization-in-javascript/) when the same inputs are used again.

To learn more about **pure and impure functions**, check out the following resources:

* [Pure versus impure functions](https://toddmotto.com/pure-versus-impure-functions)
* [Master the JavaScript Interview: What is a Pure Function?](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-a-pure-function-d1c076bec976#.kt48h2bfa)
* [Functional Programming: Pure Functions](https://www.sitepoint.com/functional-programming-pure-functions/)

---

## <span id="state"></span>State

**State** refers to the stored information a program has access to at a point in time. The contents of variables in an application at any given instant is the application's _state_.

### Stateful

**Stateful** programs, apps, or components store data in memory about the current state. They can modify the state as well as access its history. The following example is _stateful_:

```js
// Stateful
var number = 1;
function increment() {
  return number++;
}
increment();
```

### Stateless

**Stateless** programs, apps, or components perform tasks as though running them for the first time, every time. This means they do not reference or utilize any information from earlier in their execution. Statelessness enables _referential transparency_. Functions depend only on their arguments and do not access or need knowledge of anything outside their scope. The following example is _stateless_:

```js
// Stateless
var number = 1;
function increment(n) {
  return n++;
}
increment(number);
```

### State Takeaways

To learn more about **state**, check out the following resources:

* TBD

---

## <span id="immutable-mutable"></span>Immutability and Mutability

The concepts of **immutability and mutability** are slightly more nebulous in JavaScript than in some other programming languages. However, you will hear a lot about immutability when reading about functional programming in JS. It's important to know what these terms mean classically and also how they are referenced and implemented in JavaScript.

### Immutable

If an object is **immutable**, its state cannot be modified after creation.

### Mutable

If an object is **mutable**, its state can be modified after creation.

### By Design: Immutability and Mutability in JavaScript

In JavaScript, `strings` and `numbers` are _immutable by design_. This is easily understandable if we consider how we operate on them:

```js
var str = 'Hello!';
var anotherStr = str.substring(2);
```

Our first string will always be `Hello!`, but we can operate on this string to create _new_ strings. We could also reassign the `str` _variable value_ to something else, but the actual string `Hello!` will always be `Hello!`.

Numbers are immutable as well. The following will always have the same result:

```js
var three = 1 + 2;
```

Under no circumstances could `1 + 2` evaluate to anything other than `3`.

This demonstrates that immutability by design does exist in JavaScript. However, JS developers are aware that the language allows most things to be changed. For example, objects and arrays are _mutable by design_. Consider the following:

```js
var arr = [1, 2, 3];
arr.push(4);
// Result: arr = [1, 2, 3, 4]

var obj = { greeting: 'Hello' };
obj.name = 'Jon';
// Result: obj = { greeting: 'Hello', name: 'Jon' }
```

In these examples, the _original_ objects are mutated. New objects are not returned.

To learn more about mutability in other languages, check out [Mutable vs Immutable Objects](https://www.interviewcake.com/concept/java/mutable).

### In Practice: Immutability in JavaScript

Functional programming in JS has gained a lot of momentum. But by design, JS is a very mutable language. Functional programming emphasizes _immutability_. Many other languages will raise errors when a developer tries to mutate an immutable object. So how can we reconcile the innate mutability of JS when writing functional or functional reactive JS?

When we talk about functional programming in JS, the word "immutable" is used a lot, but it's dependent on the developer to write their code with immutability in mind. For example, [Redux relies on a single, immutable state tree](https://egghead.io/lessons/javascript-redux-the-single-immutable-state-tree). However, _JavaScript itself_ is capable of mutating the state object. To implement an immutable state tree, we need to [return a _new_](https://egghead.io/lessons/javascript-redux-avoiding-array-mutations-with-concat-slice-and-spread) [state object](https://egghead.io/lessons/javascript-redux-avoiding-object-mutations-with-object-assign-and-spread) each time the state changes.

JavaScript objects [can also be frozen](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) with `Object.freeze(obj)` [to make them immutable](http://adripofjavascript.com/blog/drips/immutable-objects-with-object-freeze.html). Note that this is _shallow_, meaning object values in a frozen object can still be mutated. To further ensure immutability, packages like [deep-freeze](https://www.npmjs.com/package/deep-freeze) can recursively freeze objects. Freezing and deep freezing are most practical when used in _tests_ rather than in application code. This way, tests will alert developers when mutations occur so they can be corrected and avoided in the actual build.

There are also libraries available to support immutability in JS. [Mori](http://swannodette.github.io/mori/) delivers persistent data structures based on Clojure. [Immutable.js](https://facebook.github.io/immutable-js/) by Facebook also provides immutable collections for JS. Utility libraries like [Underscore.js](http://underscorejs.org) and [lodash](http://www.lodash.com) provide methods and modules to promote a more immutable, [functional programming style](https://github.com/lodash/lodash/wiki/FP-Guide).

### Immutability and Mutability Takeaways

Overall, JS is a very mutable language. Some styles of JS coding _rely_ on this innate mutability. When writing functional JS, however, implementing immutability requires mindfulness. JS will not natively throw type errors when you modify something unintentionally. Testing and libraries can assist, but working with immutability in JS takes practice and methodology.

To learn more about **immutability and mutability**, check out the following resources:

* [Immutability in JavaScript](https://www.sitepoint.com/immutability-javascript/)
* [Immutable Objects with Object Freeze](http://adripofjavascript.com/blog/drips/immutable-objects-with-object-freeze.html)
* [Mutable vs Immutable Objects](https://www.interviewcake.com/concept/java/mutable)
* [Using Immutable Data Stuctures in JavaScript](http://jlongster.com/Using-Immutable-Data-Structures-in-JavaScript)
* [Getting Started with Redux](https://egghead.io/courses/getting-started-with-redux) (includes great examples on addressing immutable state)

---

## <span id="imperative-declarative"></span>Imperative and Declarative Programming

While some languages are **imperative** (C#, Java, PHP) or **declarative** (SQL, HTML), JavaScript supports both paradigms.

Those familiar with even the most basic JavaScript have written imperative code: instructions informing the computer _how_ to achieve a desired result. If you've written a `for` loop, you've written imperative JS. 

Declarative code tells the computer _what_ you want to achieve rather than how, and the computer takes care of how to get to the end result without explicit description from the developer. If you've used the `map` method, you've written declarative JS.

### Imperative

**Imperative** programming describes _how_ a program's logic works in explicit commands with statements that modify the program state.

Consider a function that increments every number in an array of integers. An imperative JavaScript example of this might be:

```js
function incrementArray(arr) {
  let resultArr = [];
  
  for (let i = 0; i < arr.length; i++) {
    resultArr.push(arr[i]++);
  }
  return resultArr;
}
```

This function shows exactly _how_ the function's logic works. We iterate over the array and explicitly increase each number, pushing it to a new array. We then return the new, resulting array. This is a step-by-step description of the function's logic.

### Declarative

**Declarative** programming describes _what_ a program's logic accomplishes without describing _how_.

Consider the `incrementArray()` function we implemented imperatively above. Let's implement this declaratively:

```js
function incrementArray(arr) {
  return arr.map((item) => item++);
}
```

Using the declarative programming paradigm, we show _what_ we want to achieve, but not how it works. The [`.map()` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) returns a new array with the results of running the callback on each item from the passed array. This approach does not modify program state.

> **Note:** JavaScript's [`map`, `reduce`,](https://www.sitepoint.com/map-reduce-functional-javascript/) [and `filter`](https://danmartensen.svbtle.com/javascripts-map-reduce-and-filter) are functional array methods.

### Imperative and Declarative Programming Takeaways

JavaScript allows both **imperative and declarative programming** paradigms. Much of the JS code we read and write is and has been imperative. However, with the rise of functional programming in JS, the declarative approach is rapidly becoming more common.

To learn more about **imperative and declarative programming**, check out the following resources:

* [Imperative vs Declarative Programming](https://tylermcginnis.com/imperative-vs-declarative-programming/)
* [What's the Difference Between Imperative, Procedural, and Structured Programming?](http://softwareengineering.stackexchange.com/questions/117092/whats-the-difference-between-imperative-procedural-and-structured-programming)
* [Imperative and (Functional) Declarative JS In Practice](http://www.redotheweb.com/2015/09/18/declarative-imperative-js.html)
* [JavaScript's Map, Reduce, and Filter](https://danmartensen.svbtle.com/javascripts-map-reduce-and-filter)

---

## <span id="functional-programming"></span>Functional Programming

Now that we've learned about pure functions, statelessness, immutability, and declarative programming, let's look briefly into the functional programming paradigm.

**Functional programming** encompasses the above concepts in the following ways:

* Core functionality with pure functions without side effects. 
* Data is immutable.
* Functional programs are stateless.
* Imperative outer code contains and executes pure core code.

### Functional Programming Takeaways

Immutable data and statelessness mean that the program's existing state is not modified. Instead, new values are returned. Pure functions are used for core functionality. In order to implement the program and manage necessary side effects, impure functions can call pure functions imperatively.

To learn more about **functional programming**, check out the following resources:

* [Functional Programming with JavaScript](http://stephen-young.me.uk/2013/01/20/functional-programming-with-javascript.html)
* [Don't be Scared of Functional Programming](https://www.smashingmagazine.com/2014/07/dont-be-scared-of-functional-programming/)
* [So You Want to be a Functional Programmer](https://medium.com/@cscalfani/so-you-want-to-be-a-functional-programmer-part-1-1f15e387e536#.q8a7nwjat)
* [What is the difference between functional and imperative programming languages?](http://stackoverflow.com/questions/17826380/what-is-difference-between-functional-and-imperative-programming-languages)

---

## <span id="observables"></span>Observables

**Observables** are asynchronous collections arriving over time (also called _streams_). An observable is similar to an array, except instead of being stored in memory, items arrive asynchronously over time. We can _subscribe_ to observables and react to events emitted by them. Observables are a JS implementation of the [_observer pattern_](http://stackoverflow.com/a/15596243). [Reactive Extensions](http://reactivex.io/) provides an observables library for JavaScript via [RxJS](https://github.com/ReactiveX/rxjs).

To demonstrate the concept of observables, let's consider a simple example: resizing the browser window. It's easy to understand observables in this context. Resizing the browser window emits a stream of events over a period of time (as the window is dragged to its desired size). We can create an observable and subscribe to it to react to the stream of resize events. As the window size changes, we can declaratively debounce the stream and observe the changes.

```js
var resize$ = Rx.Observable.fromEvent(window, 'resize').debounceTime(250);

resize$.subscribe((event) => {
  let t = event.target;
  console.log(`${t.innerWidth}px x ${t.innerHeight}px`);
});
```

### Observables Takeaways

Observables are streams and almost anything can be a stream. A stream could be resize events from dragging a browser window to API responses. A _promise_ is an observable with a single emitted value. However, observables (streams) can return many values over time.

Observables are often visualized using circles ("marbles") on a line, as demonstrated on the [RxMarbles](http://rxmarbles.com) site. Since the stream consists of asynchronous events over _time_, it's easy to conceptualize this in a linear fashion.

To learn more about **observables**, check out the following resources:

* [Reactive Extensions: Observable](http://reactivex.io/documentation/observable.html)
* [The introduction to Reactive Programming you've been missing: Request and Response](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754#request-and-response)
* [Introducing the Observable](https://egghead.io/lessons/javascript-introducing-the-observable)
* [RxMarbles](http://rxmarbles.com/)
* [Rx Book - Observable](https://xgrommx.github.io/rx-book/content/observable/index.html)

---

## <span id="reactive-programming"></span>Reactive Programming

**Reactive programming** is concerned with propagating and responding to incoming events over time, declaratively (describing _what_ to do rather than _how_).

[Reactive Extensions](http://reactivex.io/) is an API for asynchronous programming with observable streams. Reactive Extensions is abbreviated Rx, and [provides libraries for a variety of languages](http://reactivex.io/languages.html) including JavaScript ([RxJS](https://github.com/Reactive-Extensions/RxJS)).

### Reactive Programming Takeaways

Reactive programming is a paradigm involving observing and reacting to events in asynchronous data streams.

To learn more about **reactive programming**, check out the following resources:

* [The introduction to Reactive Programming you've been missing](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754)
* [Introduction to Rx](http://www.introtorx.com/)
* [The Reactive Manifesto](http://www.reactivemanifesto.org/)
* [Understanding Reactive Programming and RxJS](https://auth0.com/blog/understanding-reactive-programming-and-rxjs/)
* [Reactive Programming](http://paulstovell.com/blog/reactive-programming)
* [Modernization of Reactivity](https://davidwalsh.name/modernization-reactivity)

---

## <span id="functional-reactive-programming"></span>Functional Reactive Programming

In some simplified definitions, **functional reactive programming (FRP)** is a subset of reactive programming using the principles of functional programming such as referential transparency. However, a more accurate definition from [Conal Elliot, FRP's formulator](http://stackoverflow.com/a/5386908), would be that FRP is [denotative](http://www.dictionary.com/browse/denotation) and temporally continuous. Elliot mentions that he prefers the term _denotative continuous-time programming_.

**Functional reactive programming** is:

* dynamic: can react to changes of input
* temporally continuous: 

### Functional Reactive Programming Takeaways

To learn more about **functional reactive programming (FRP)**, check out the following resources:

* [The Functional Reactive Misconception](https://sideeffects.xyz/2015/the-functional-reactive-misconception/)
* [What is Functional Reactive Programming?](http://stackoverflow.com/questions/1028250/what-is-functional-reactive-programming/1030631#1030631)
* [Haskell - Functional Reactive Programming](https://wiki.haskell.org/Functional_Reactive_Programming)
* [Composing Reactive Animations](http://conal.net/fran/tutorial.htm)
* [Specification for a functional reactive programming language](https://stackoverflow.com/questions/5875929/specification-for-a-functional-reactive-programming-language#5878525)
* [A more elegant specification for FRP](https://github.com/conal/talk-2015-more-elegant-frp)
* [Elm - A Farewell to FRP](http://elm-lang.org/blog/farewell-to-frp)
* [Early inspirations and new directions in functional reactive programming](http://conal.net/blog/posts/early-inspirations-and-new-directions-in-functional-reactive-programming)
* [Breaking Down FRP](https://blogs.janestreet.com/breaking-down-frp/)

---

## <span id="web-components"></span>Web Components

---

## <span id="dumb-smart-components"></span>Dumb Components and Smart Components



