---
layout: post
title: "Glossary of Modern JavaScript Concepts: Part 1"
description: "Learn the fundamentals of functional programming, reactive programming, and functional reactive programming in JavaScript."
date: 2017-02-13 8:30
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
- functional-programming
- reactive-programming
- functional-reactive-programming
related:
- 2017-01-16-a-brief-history-of-javascript
- 2016-03-23-intro-to-immutable-js
---

**TL;DR:** In the first part of the Glossary of Modern JS Concepts series, gain an understanding of _functional programming_, _reactive programming_, and _functional reactive programming_. We'll learn about purity, statefulness and statelessness, immutability and mutability, imperative and declarative programming, higher-order functions, observables, and the FP, RP, and FRP paradigms.

---

## Introduction

Modern JavaScript has experienced massive proliferation over the last few years and shows no signs of slowing. Numerous programming concepts are surfacing that are unfamiliar to many front-end developers. In this post series, we'll take a look at intermediate and advanced fundamental concepts in the front-end landscape and explore how they apply to modern JavaScript.

---

## Concepts

In this article, we'll address concepts that are crucial to understanding **functional programming, reactive programming, and functional reactive programming and their use with JavaScript**.

You can jump straight into each concept here, or continue reading to learn about them in order.

* <a href="#purity" target="_self">Purity: Pure Functions, Impure Functions, Side Effects</a>
* <a href="#state" target="_self">State: Stateful and Stateless</a>
* <a href="#immutable-mutable" target="_self">Immutability and Mutability</a>
* <a href="#imperative-declarative" target="_self">Imperative and Declarative Programming</a>
* <a href="#higher-order-functions" target="_self">Higher-order Functions</a>
* <a href="#functional-programming" target="_self">Functional Programming</a>
* <a href="#observables" target="_self">Observables: Hot and Cold</a>
* <a href="#reactive-programming" target="_self">Reactive Programming</a>
* <a href="#functional-reactive-programming" target="_self">Functional Reactive Programming</a>

---

## <span id="purity"></span>Purity: Pure Functions, Impure Functions, Side Effects

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

// this is NOT a pure function
function impureHalf() {
  return someNum / 2;
}
```

In summary:

* In pure functions, the same input will always produce the same output.
* Pure functions rely only on local state and do not mutate external state.
* Pure functions produce no [_side effects_](https://en.wikipedia.org/wiki/Side_effect_%28computer_science%29).

### Impure Functions

An **impure function** mutates state outside its scope. Any function that has _side effects_ (see below) is impure. Procedural functions with no utilized return value are also impure. Consider the following examples:

```js
// impure function producing a side effect
function showAlert() {
  alert('This is a side effect!');
}

// impure function mutating external state
var globalVal = 1;
function incrementGlobalVal() {
  globalVal++;
}

// impure function calling pure functions procedurally
function proceduralFn() {
  const result1 = pureFnFirst(1);
  const result2 = pureFnLast(2);
  console.log(`Done with ${result1} and ${result2}!`);
}
```

### Side Effects

When a function or expression modifies state outside its own context, the result is a **side effect**. Examples of side effects include making a call to an API, manipulating the DOM, raising an alert dialog, etc. If a function produces side effects, it is considered _impure_. Functions that cause side effects are less predictable and harder to test since they result in changes outside their local scope.

### Purity Takeaways

Plenty of quality code consists of _impure_ functions that procedurally invoke _pure_ functions. This still produces advantages for testing and immutability. Referential transparency also enables [_memoization_](https://www.interviewcake.com/concept/python/memoization): caching and storing function call results and [reusing the cached results](https://www.sitepoint.com/implementing-memoization-in-javascript/) when the same inputs are used again.

To learn more about **purity**, check out the following resources:

* [Pure versus impure functions](https://toddmotto.com/pure-versus-impure-functions)
* [Master the JavaScript Interview: What is a Pure Function?](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-a-pure-function-d1c076bec976#.kt48h2bfa)
* [Functional Programming: Pure Functions](https://www.sitepoint.com/functional-programming-pure-functions/)

---

## <span id="state"></span>State

**State** refers to the stored information a program has access to at a point in time. The contents of variables in an application at any given instant is the application's _state_.

### Stateful

**Stateful** programs, apps, or components store data in memory about the current state. They can modify the state as well as access its history. The following example is _stateful_:

```js
// stateful
var number = 1;
function increment() {
  return number++;
}
increment();
```

### Stateless

**Stateless** programs, apps, or components perform tasks as though running them for the first time, every time. This means they do not reference or utilize any information from earlier in their execution. Statelessness enables _referential transparency_. Functions depend only on their arguments and do not access or need knowledge of anything outside their scope. <a href="#purity" target="_self">Pure functions</a> are stateless. See the following example:

```js
// stateless
var number = 1;
function increment(n) {
  return n++;
}
increment(number);
```

### State Takeaways

To learn more about **state**, check out the following resources:

* <a href="https://en.wikipedia.org/wiki/State_(computer_science)">State</a>
* [Advantages of stateless programming](http://stackoverflow.com/questions/844536/advantages-of-stateless-programming)
* [Stateful and stateless components, the missing manual](https://toddmotto.com/stateful-stateless-components)

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
// result: arr = [1, 2, 3, 4]

var obj = { greeting: 'Hello' };
obj.name = 'Jon';
// result: obj = { greeting: 'Hello', name: 'Jon' }
```

In these examples, the _original_ objects are mutated. New objects are not returned.

To learn more about mutability in other languages, check out [Mutable vs Immutable Objects](https://www.interviewcake.com/concept/java/mutable).

### In Practice: Immutability in JavaScript

Functional programming in JS has gained a lot of momentum. But by design, JS is a very mutable, multi-paradigm language. Functional programming emphasizes _immutability_. Other functional languages will raise errors when a developer tries to mutate an immutable object. So how can we reconcile the innate mutability of JS when writing functional or functional reactive JS?

When we talk about functional programming in JS, the word "immutable" is used a lot, but it's dependent on the developer to write their code with immutability in mind. For example, [Redux relies on a single, immutable state tree](https://egghead.io/lessons/javascript-redux-the-single-immutable-state-tree). However, _JavaScript itself_ is capable of mutating the state object. To implement an immutable state tree, we need to [return a _new_](https://egghead.io/lessons/javascript-redux-avoiding-array-mutations-with-concat-slice-and-spread) [state object](https://egghead.io/lessons/javascript-redux-avoiding-object-mutations-with-object-assign-and-spread) each time the state changes.

JavaScript objects [can also be frozen](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) with `Object.freeze(obj)` [to make them immutable](http://adripofjavascript.com/blog/drips/immutable-objects-with-object-freeze.html). Note that this is _shallow_, meaning object values within a frozen object can still be mutated. To further ensure immutability, [functions like Mozilla's deepFreeze()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) and [npm packages like deep-freeze](https://www.npmjs.com/package/deep-freeze) can recursively freeze objects. Freezing is most practical when used in _tests_ rather than in application code. This way, tests will alert developers when mutations occur so they can be corrected and avoided in the actual build without cluttering the core code.

There are also libraries available to support immutability in JS. [Mori](http://swannodette.github.io/mori/) delivers persistent data structures based on Clojure. [Immutable.js](https://facebook.github.io/immutable-js/) by Facebook also provides immutable collections for JS. Utility libraries like [Underscore.js](http://underscorejs.org) and [lodash](http://www.lodash.com) provide methods and modules to promote a more immutable, [functional programming style](https://github.com/lodash/lodash/wiki/FP-Guide).

### Immutability and Mutability Takeaways

Overall, JS is a very mutable language. Some styles of JS coding _rely_ on this innate mutability. When writing functional JS, however, implementing immutability requires mindfulness. JS will not natively throw type errors when you modify something unintentionally. Testing and libraries can assist, but working with immutability in JS takes practice and methodology.

To learn more about **immutability and mutability**, check out the following resources:

* [Immutability in JavaScript](https://www.sitepoint.com/immutability-javascript/)
* [Immutable Objects with Object Freeze](http://adripofjavascript.com/blog/drips/immutable-objects-with-object-freeze.html)
* [Mutable vs Immutable Objects](https://www.interviewcake.com/concept/java/mutable)
* [Using Immutable Data Stuctures in JavaScript](http://jlongster.com/Using-Immutable-Data-Structures-in-JavaScript)
* [Getting Started with Redux](https://egghead.io/courses/getting-started-with-redux) (includes examples for addressing immutable state)

---

## <span id="imperative-declarative"></span>Imperative and Declarative Programming

While some languages are **imperative** (C#, Java, PHP) or **declarative** (SQL, HTML), JavaScript supports both paradigms.

Most developers familiar with even the most basic JavaScript have written imperative code: instructions informing the computer _how_ to achieve a desired result. If you've written a `for` loop, you've written imperative JS. 

Declarative code tells the computer _what_ you want to achieve rather than how, and the computer takes care of how to achieve the end result without explicit description from the developer. If you've used `Array.map`, you've written declarative JS.

### Imperative Programming

**Imperative programming** describes _how_ a program's logic works in explicit commands with statements that modify the program state.

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

This function shows exactly _how_ the function's logic works: we iterate over the array and explicitly increase each number, pushing it to a new array. We then return the resulting array. This is a step-by-step description of the function's logic.

### Declarative Programming

**Declarative programming** describes _what_ a program's logic accomplishes _without_ describing how.

Consider the `incrementArray()` function we implemented imperatively above. Let's implement this declaratively now:

```js
function incrementArray(arr) {
  return arr.map(item => item++);
}
```

Using declarative programming, we show _what_ we want to achieve, but not how it works. The [`Array.map()` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) returns a new array with the results of running the callback on each item from the passed array. This approach does not modify program state, nor does it include any sequential logic showing _how_ it creates the new array.

> **Note:** JavaScript's [`map`, `reduce`,](https://www.sitepoint.com/map-reduce-functional-javascript/) [and `filter`](https://danmartensen.svbtle.com/javascripts-map-reduce-and-filter) are declarative, <a href="#functional-programming" target="_self">functional</a> array methods. Utility libraries like [lodash](https://lodash.com/) provide declarative methods like [`every`](https://lodash.com/docs/4.17.4#every), [`sortBy`](https://lodash.com/docs/4.17.4#sortBy), [`uniq`](https://lodash.com/docs/4.17.4#uniq), and more in addition to `map`, `reduce`, and `filter`.

### Imperative and Declarative Programming Takeaways

As a language, JavaScript allows both **imperative and declarative programming** paradigms. Much of the JS code we read and write is and has been imperative. However, with the rise of <a href="#functional-programming" target="_self">functional programming</a> in JS, declarative approaches are becoming more common.

Declarative programming has obvious advantages with regard to brevity and readability, but at the same time it can feel magical.  Many JavaScript beginners can benefit from gaining experience writing imperative JS before diving too deep into declarative programming.

To learn more about **imperative and declarative programming**, check out the following resources:

* [Imperative vs Declarative Programming](https://tylermcginnis.com/imperative-vs-declarative-programming/)
* [What's the Difference Between Imperative, Procedural, and Structured Programming?](http://softwareengineering.stackexchange.com/questions/117092/whats-the-difference-between-imperative-procedural-and-structured-programming)
* [Imperative and (Functional) Declarative JS In Practice](http://www.redotheweb.com/2015/09/18/declarative-imperative-js.html)
* [JavaScript's Map, Reduce, and Filter](https://danmartensen.svbtle.com/javascripts-map-reduce-and-filter)

---

## <span id="higher-order-functions"></span>Higher-order Functions

A **higher-order function** is a function that:

* accepts another function as an argument, or
* returns a function as a result.

In JavaScript, functions are [_first-class objects_](http://helephant.com/2008/08/19/functions-are-first-class-objects-in-javascript/). They can be stored and passed around as _values_: we can assign a function to a variable or pass a function to another function.

```js
const double = function(x) {
  return x * 2;
}
const timesTwo = double;

timesTwo(4); // 8
```

One example of taking a function as an argument is a _callback_. Callbacks can be inline anonymous functions or named functions:

```js
const myBtn = document.getElementById('myButton');

// anonymous callback function
myBtn.addEventListener('click', function(e) { console.log(`Click event: ${e}`); });

// named callback function
function btnHandler(e) {
  console.log(`Click event: ${e}`);
}
myBtn.addEventListener('click', btnHandler);
```

We can also pass a function as an argument to any other function we create and then execute that argument:

```js
function sayHi() {
  alert('Hi!');
}
function greet(greeting) {
  greeting();
}
greet(sayHi); // alerts "Hi!"
```

> **Note:** When _passing a named function as an argument_, as in the two examples above, we don't use parentheses `()`. This way we're passing the function as an object. Parentheses _execute_ the function and return the result.

Higher-order functions can also return another function:

```js
function sayHi() {
  alert('Hi!');
}
function whenMeetingJohn() {
  return sayHi;
}
var atLunchToday = whenMeetingJohn;

atLunchToday(); // alerts "Hi!"
```

### Higher-order Function Takeaways

The nature of JavaScript functions as first-class objects make them prime for facilitating <a href="#functional-programming" target="_self">functional programming</a>. 

To learn more about **higher-order functions**, check out the following resources:

* [Functions are first class objects in JavaScript](http://helephant.com/2008/08/19/functions-are-first-class-objects-in-javascript/)
* [Higher-Order Functions in JavaScript](https://www.sitepoint.com/higher-order-functions-javascript/)
* [Higher-order functions - Part 1 of Functional Programming in JavaScript](https://www.youtube.com/watch?v=BMUiFMZr7vk)
* [Eloquent JavaScript - Higher-order Functions](http://eloquentjavascript.net/05_higher_order.html)
* [Higher Order Functions](https://medium.com/functional-javascript/higher-order-functions-78084829fff4#.dwg58papp)

---

## <span id="functional-programming"></span>Functional Programming

Now we've learned about purity, statelessness, immutability, declarative programming, and higher-order functions. These are all concepts that are important in understanding the functional programming paradigm.

**Functional programming** encompasses the above concepts in the following ways:

* Core functionality is implemented using pure functions without side effects. 
* Data is immutable.
* Functional programs are stateless.
* Imperative container code manages side effects and executes declarative, pure core code.*

> *If we tried to write a JavaScript web application composed of nothing but pure functions with no side effects, it couldn't interact with its environment and therefore wouldn't be particularly useful.

Let's examine an example. Say we have some text and we want to count the words as well as output keywords that are longer than five characters:

```js
const fpCopy = `Functional programming is powerful and enjoyable to write. It's very cool!`;

// remove punctuation from string 
const stripPunctuation = (str) =>
  str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');

// split passed string on spaces to create an array
const getArr = (str) =>
  str.split(' ');

// count items in the passed array
const getWordCount = (arr) =>
  arr.length;

// find items in the passed array longer than 5 characters
// make items lower case
const getKeywords = (arr) =>
  arr
    .filter(item => item.length > 5)
    .map(item => item.toLowerCase());

// process copy to prep the string, create an array, count words, and get keywords
function processCopy(str, prepFn, arrFn, countFn, kwFn) {
  const copyArray = arrFn(prepFn(str));
  
  console.log(`Word count: ${countFn(copyArray)}`);
  console.log(`Keywords: ${kwFn(copyArray)}`);
}

processCopy(fpCopy, stripPunctuation, getArr, getWordCount, getKeywords);
```

This code is available to run at this [JSFiddle: Functional Programming with JavaScript](https://jsfiddle.net/kmaida/xxc7g0ve/). It's broken into digestible, declarative functions with clear purpose. If we step through it and read the comments, no further explanation of the code should be necessary. Each _core_ function is modular and relies only on its inputs (<a href="#purity" target="_self">pure</a>). The last function processes the core to generate the collective outputs. This function, `processCopy()`, is the impure container that executes the core and manages side effects, though we've used a <a href="#higher-order-functions" target="_self">higher-order function</a> that accepts the other functions as arguments to maintain a functional style.

### Functional Programming Takeaways

Immutable data and statelessness mean that the program's existing state is not modified. Instead, new values are returned. Pure functions are used for core functionality. In order to implement the program and handle necessary side effects, impure functions can call pure functions imperatively.

To learn more about **functional programming**, check out the following resources:

* [Introduction to Immutable.js and Functional Programming Concepts](https://auth0.com/blog/intro-to-immutable-js/)
* [Functional Programming For The Rest of Us](http://www.defmacro.org/ramblings/fp.html)
* [Functional Programming with JavaScript](http://stephen-young.me.uk/2013/01/20/functional-programming-with-javascript.html)
* [Don't be Scared of Functional Programming](https://www.smashingmagazine.com/2014/07/dont-be-scared-of-functional-programming/)
* [So You Want to be a Functional Programmer](https://medium.com/@cscalfani/so-you-want-to-be-a-functional-programmer-part-1-1f15e387e536#.q8a7nwjat)
* [lodash - Functional Programming Guide](https://github.com/lodash/lodash/wiki/FP-Guide)
* [What is the difference between functional and imperative programming languages?](http://stackoverflow.com/questions/17826380/what-is-difference-between-functional-and-imperative-programming-languages)
* [Eloquent JavaScript, 1st Edition - Functional Programming](http://eloquentjavascript.net/1st_edition/chapter6.html)
* [Functional Programming by Example](http://tobyho.com/2015/11/09/functional-programming-by-example/)
* [Functional Programming in JavaScript - Video Series](https://www.youtube.com/watch?v=BMUiFMZr7vk&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84)
* [Introduction to Functional JavaScript](https://medium.com/functional-javascript/introduction-to-functional-javascript-45a9dca6c64a#.2qjh0i04y)
* [How to perform side effects in pure functional programming](http://stackoverflow.com/questions/18172947/how-to-perform-side-effects-in-pure-functional-programming)
* [Preventing Side Effects in JavaScript](https://davidwalsh.name/preventing-sideeffects-javascript)

---

## <span id="observables"></span>Observables

**Observables** are asynchronous collections arriving over time (also called _streams_). An observable is similar to an array, except instead of being stored in memory, items arrive asynchronously over time. We can _subscribe_ to observables and react to events emitted by them. Observables are a JS implementation of the [_observer pattern_](http://stackoverflow.com/a/15596243). [Reactive Extensions](http://reactivex.io/) (commonly known as Rx*) provides an observables library for JavaScript via [RxJS](https://github.com/ReactiveX/rxjs).

To demonstrate the concept of observables, let's consider a simple example: resizing the browser window. It's easy to understand observables in this context. Resizing the browser window emits a stream of events over a period of time as the window is dragged to its desired size. We can create an observable and subscribe to it to react to the stream of resize events.

The example code below shows that as the window size changes, we can declaratively throttle the observable stream and subscribe to the changes to respond to new values in the collection:

```js
// create window resize stream
// throttle resize events
const resize$ = 
  Rx.Observable
    .fromEvent(window, 'resize')
    .throttleTime(350);

// subscribe to the resize$ observable
// log window width x height
const subscription = 
  resize$.subscribe((event) => {
    let t = event.target;
    console.log(`${t.innerWidth}px x ${t.innerHeight}px`);
  });
```

### Hot Observables

A **hot observable** pushes whether or not it's been subscribed to. For example, UI events like button clicks, mouse movement, etc. are _hot_. They will always push even if we're not specifically reacting to them with a subscription. The window resize example above is a hot observable. The `resize$` observable would fire whether or not `subscription` exists.

### Cold Observables

A **cold observable** begins pushing when we subscribe to it. If we subscribe again, it will start over.

Let's create an observable collection of numbers ranging from `1` to `5`. We can [`subscribe()`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/subscribe.md) to the `source$` observable we just created:

```js
// create source number stream
const source$ = Rx.Observable.range(1, 5);

// subscribe to source$ observable
const subscription = source$.subscribe(
  (value) => { console.log(`Next: ${value}`); }, // onNext
  (event) => { console.log(`Error: ${event}`); }, // onError
  () => { console.log('Completed!'); }  // onCompleted
);
```

Upon subscription, the values are sent in sequence to the observer. The `onNext` callback logs the values: `Next: 1`, `Next: 2`, etc. until completion: `Completed!`. The cold `source$` observable we created doesn't push unless we _subscribe_ to it.

### Observables Takeaways

Observables are streams. We can observe any stream: from resize events to existing arrays to API responses; we can create observables from almost anything. A _promise_ is an observable with a single emitted value. However, observables (streams) can return many values over time.

We can operate on observables in many ways. [RxJS has many operators](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators). Observables are often visualized using circles ("marbles") on a line, as demonstrated on the [RxMarbles](http://rxmarbles.com) site. Since the stream consists of asynchronous events over _time_, it's easy to conceptualize this in a linear fashion and use such visualizations to understand Rx* operators.

To learn more about **observables**, check out the following resources:

* [Reactive Extensions: Observable](http://reactivex.io/documentation/observable.html)
* [Creating and Subscribing to Simple Observable Sequences](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/gettingstarted/creating.md)
* [The introduction to Reactive Programming you've been missing: Request and Response](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754#request-and-response)
* [Introducing the Observable](https://egghead.io/lessons/javascript-introducing-the-observable)
* [RxMarbles](http://rxmarbles.com/)
* [Rx Book - Observable](https://xgrommx.github.io/rx-book/content/observable/index.html)
* [Introducing the Observable](https://egghead.io/lessons/javascript-introducing-the-observable)

---

## <span id="reactive-programming"></span>Reactive Programming

**Reactive programming** is concerned with propagating and responding to incoming events over time, <a href="#imperative-delcarative" target="_self">declaratively</a> (describing _what_ to do rather than _how_).

Reactive programming is often associated with [Reactive Extensions](http://reactivex.io/), an API for asynchronous programming with <a href="#observables" target="_self">observable streams</a>. Rx* [provides libraries for a variety of languages](http://reactivex.io/languages.html), including JavaScript ([RxJS](https://github.com/Reactive-Extensions/RxJS)).

Here is a simple example of reactive programming with observables. Let's say we have an input where the user can enter a six-character confirmation code and we want to print out the latest valid code attempt:

{% highlight html %}
<!-- HTML -->
<input id="confirmation-code" type="text">
<p>
  <strong>Valid code attempt:</strong>
  <code id="attempted-code"></code>
</p>
{% endhighlight %}

We'll use RxJS and create a stream of inputs, like so:

```js
// JS
const confCodeInput = document.getElementById('confirmation-code');
const attemptedCode = document.getElementById('attempted-code');

const confCodes$ = 
  Rx.Observable
    .fromEvent(confCodeInput, 'input')
    .map(e => e.target.value)
    .filter(code => code.length === 6);
    
const subscription = confCodes$.subscribe(
  (value) => attemptedCode.innerText = value,
  (event) => { console.warn(`Error: ${event}`); },
  () => { console.info('Completed!'); }
);
```

This code can be run at this [JSFiddle: Reactive Programming with JavaScript](https://jsfiddle.net/kmaida/v1ozuwgu/). We'll observe inputs to the `confCodeInput` input element. Then we'll use `map` to get the `value` from each input event. Next, we'll `filter` any results that are not six characters so they won't appear in the returned stream. Finally, we can print out the latest valid confirmation code attempt. Note that this was done in response to events over time, declaratively: this is the crux of _reactive programming_.

### Reactive Programming Takeaways

Reactive programming is a paradigm involving observing and reacting to events in asynchronous data streams. RxJS is used in [Angular](https://medium.com/google-developer-experts/angular-introduction-to-reactive-extensions-rxjs-a86a7430a61f#.41aap1i8a) and is gaining popularity as a JavaScript solution for reactive programming.

To learn more about **reactive programming** in general as well as with JavaScript, check out the following resources:

* [The introduction to Reactive Programming you've been missing](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754)
* [Introduction to Rx](http://www.introtorx.com/)
* [The Reactive Manifesto](http://www.reactivemanifesto.org/)
* [Understanding Reactive Programming and RxJS](https://auth0.com/blog/understanding-reactive-programming-and-rxjs/)
* [Reactive Programming](http://paulstovell.com/blog/reactive-programming)
* [Modernization of Reactivity](https://davidwalsh.name/modernization-reactivity)
* [Reactive-Extensions RxJS API Core](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core)

---

## <span id="functional-reactive-programming"></span>Functional Reactive Programming

In simple terms, functional reactive programming could be summarized as declaratively responding to events or behaviors over time. To understand the tenets of FRP in more depth, let's take a look at FRP's formulation. Then we'll examine its use in relation to JavaScript.

### What is Functional Reactive Programming?

A [more complete definition](http://stackoverflow.com/a/5386908) from [Conal Elliot, FRP's formulator](https://twitter.com/conal), would be that **functional reactive programming** is "[denotative](https://en.wikibooks.org/wiki/Haskell/Denotational_semantics) and temporally continuous". Elliot mentions that he prefers to describe this programming paradigm as _denotative continuous-time programming_ as opposed to "functional reactive programming".

**Functional reactive programming**, at its most basic, original  definition, has two fundamental properties:

* **denotative**: the meaning of each function or type is precise, simple, and implementation-independent ("functional" references this)
* **continuous time**: [variables have a particular value for a very short time: between any two points are an infinite number of other points](https://en.wikipedia.org/wiki/Discrete_time_and_continuous_time#Continuous_time); provides transformation flexibility, efficiency, modularity, and accuracy ("reactive" references this)

Again, when we put it simply: [**functional reactive programming** is programming declaratively with time-varying values](https://www.quora.com/What-is-Functional-Reactive-Programming).

To understand _continuous time / temporal continuity_, consider an analogy using vector graphics. Vector graphics have an _infinite resolution_. Unlike bitmap graphics (discrete resolution), vector graphics scale indefinitely. They never pixellate or become indistinct when particularly large or small the way bitmap graphics do.

> "FRP expressions describe entire evolutions of values over time, representing these evolutions directly as first-class values."
>
> —_Conal Elliot_

Functional reactive programming should be:

* dynamic: can react over time _or_ to input changes
* time-varying: reactive _behaviors_ can change continually while reactive _values_ change discretely
* efficient: minimize amount of processing necessary when inputs change
* historically aware: pure functions map state from a previous point in time to the next point in time; state changes concern the local element and not the global program state

Conal Elliot's slides on the [Essence and Origins of FRP can be viewed here](http://conal.net/talks/essence-and-origins-of-frp-lambdajam-2015.pdf). An example of a functional reactive language is [Haskell](https://wiki.haskell.org/Functional_Reactive_Programming). Evan Czaplicki, the creator of [Elm](http://elm-lang.org), also gives a great overview of FRP in his talk [Controlling Time and Space: Understanding the Many Formulations of FRP](https://www.youtube.com/watch?v=Agu6jipKfYw).

In fact, let's talk briefly about [Evan Czapliki](http://people.seas.harvard.edu/~chong/pubs/pldi13-elm.pdf)'s [Elm](https://auth0.com/blog/creating-your-first-elm-app-part-1/). Elm is a functional, typed language for building web applications. It compiles to JavaScript, CSS, and HTML. [The Elm Architecture](https://guide.elm-lang.org/architecture/) was the inspiration for the [Redux](http://redux.js.org/) state container for JS apps. [Elm was originally considered a true functional reactive programming language](https://www.youtube.com/watch?v=Agu6jipKfYw), but as of version 0.17, it implemented _subscriptions_ instead of signals in the interest of making the language easier to learn and use. In doing so, Elm [bid farewell to FRP](http://elm-lang.org/blog/farewell-to-frp).

### In Practice: Functional Reactive Programming and JavaScript

The traditional definition of FRP can be difficult to grasp, especially for developers who don't have experience with languages like Haskell or Elm. However, the term has come up more frequently in the front-end ecosystem, so let's shed some light on its application in JavaScript.

In order to reconcile what you may have read about FRP in JS, it's important to understand that [Rx*](https://www.sitepoint.com/functional-reactive-programming-rxjs/), [Bacon.js](https://baconjs.github.io/), [Angular](http://blog.angular-university.io/functional-reactive-programming-for-angular-2-developers-rxjs-and-observables/), and others are _not_ consistent with the two primary fundamentals of Conal Elliot's definition of FRP. [Elliot states that Rx* and Bacon.js are not FRP. Instead, they are "compositional event systems _inspired_ by FRP"](https://stackoverflow.com/questions/5875929/specification-for-a-functional-reactive-programming-language#comment36554089_5878525). 

Functional reactive programming, _as it relates specifically to JavaScript implementations_, refers to programming in a <a href="#functional-programming" target="_self">functional</a> style while creating and reacting to <a href="#observables" target="_self">streams</a>. This is fairly far from Elliot's original formulation (which [specifically _excludes_ streams as a component](http://conal.net/talks/essence-and-origins-of-frp-lambdajam-2015.pdf)), but is nevertheless inspired by traditional FRP.

It's also crucial to understand that JavaScript inherently interacts with the user and UI, the DOM, and often a backend. <a href="#purity" target="_self">Side effects</a> and <a href="#imperative-declarative" target="_self">imperative</a> code are par for the course, even when taking a <a href="#functional-programming" target="_self">functional</a> or functional reactive approach. Without imperative or impure code, a dynamic JS web application wouldn't be much use because it wouldn't interact with its environment.

Let's take a look at an example to demonstrate the basic principles of FRP-inspired JavaScript. This sample prints out mouse movements over a period of ten seconds:

```js
// create a time observable that adds an item every 1 second
// map so resulting stream contains event values
var time$ = 
  Rx.Observable
    .timer(0, 1000)
    .timeInterval()
    .map(e => e.value);

// create a mouse movement observable
// throttle to every 350ms
// map so resulting stream pushes objects with x and y coordinates
var move$ = 
  Rx.Observable
    .fromEvent(document, 'mousemove')
    .throttleTime(350)
    .map(e => { return {x: e.clientX, y: e.clientY} });

// merge time + mouse movement streams
// complete after 10 seconds
var source$ = 
  Rx.Observable
    .merge(time$, move$)
    .takeUntil(Rx.Observable.timer(10000));

// subscribe to merged source$ observable
// if value is a number, createTimeset()
// if value is a coordinates object, addPoint()
var subscription = 
  source$.subscribe(
    // onNext
    (x) => { 
      if (typeof x === 'number') {
        createTimeset(x);
      } else {
        addPoint(x);
      }
    },
    // onError
    (err) => { console.warn('Error:', err); },
    // onCompleted
    () => { console.info('Completed'); }
  );

// add element to DOM to list out points touched in a particular second
function createTimeset(n) {
  let elem = document.createElement('div');
  let num = n + 1;
  elem.id = 't' + num;
  elem.innerHTML = `<strong>${num}</strong>: `;
  document.body.appendChild(elem);
}

// add points touched to latest time in stream
function addPoint(pointObj) {
  // add point to last appended element
  let numberElem = document.getElementsByTagName('body')[0].lastChild;
  numberElem.innerHTML += ` (${pointObj.x}, ${pointObj.y}) `;
}
```

You can check out this code in action in this [JSFiddle: FRP-inspired JavaScript](https://jsfiddle.net/kmaida/3v8yw02s/). Run the fiddle and move your mouse over the result area of the screen as it counts up to `10` seconds. You should see mouse coordinates appear along with the counter. This indicates where your mouse was during each 1-second time interval.

Let's briefly discuss this implementation step-by-step.

First, we'll create an <a href="#observables" target="_self">observable</a> called `time$`. This is a timer that adds a value to the collection every `1000ms` (every second). We need to map the timer event to extract its `value` and push it in the resulting stream.

Next, we'll create a `move$` observable from the `document.mousemove` event. Mouse movement is _continuous_. At any point in the sequence, there are an infinite number of points in between. We'll throttle this so the resulting stream is more manageable. Then we can map the event to return an object with `x` and `y` properties and values to represent mouse coordinates.

Next we want to merge the `time$` and `move$` streams. This is a _transformation_. This way we can plot which mouse movements occurred during each time interval. We'll call the resulting observable `source$`. We'll also limit the `source$` observable so that it completes after ten seconds (`10000ms`).

Now that we have our merged stream of time and movement, we'll create a `subscription` to the `source$` observable so we can react to it. In our `onNext` callback, we'll check to see if the value is a `number` or not. If it is, we want to call a function called `createTimeset()`. If it's a coordinates object, we'll call `addPoint()`. In the `onError` and `onCompleted` callbacks, we'll simply log some information.

Let's look at the `createTimeset(n)` function. We'll create a new `div` element for each second interval, label it, and append it to the `body`.

In the `addPoint(pointObj)` function, we'll print out the latest coordinates in the most recent timeset `div`. This will associate each coordinate with its corresponding time interval. We can now read where the mouse has been over time.

> **Note:** These functions are <a href="#purity" target="_self">impure and have side effects</a>: they modify external scope. The side effects are DOM manipulations. As mentioned earlier, the JavaScript we need to write for our apps frequently interacts with scope outside its functions.

### Functional Reactive Programming Takeaways

FRP encodes actions that react to events using pure functions that map state from a previous point in time to the next point in time.  FRP in JavaScript doesn't adhere to the two primary fundamentals of Conal Elliot's FRP, but there is certainly value in abstractions of the original concept. JavaScript relies heavily on side effects and imperative programming, but we can certainly take advantage of the power of FRP concepts to improve our JS.

Finally, consider this quote from the [first edition of Eloquent JavaScript](http://eloquentjavascript.net/1st_edition/) (the [second edition is available here](http://eloquentjavascript.net)):

> "Fu-Tzu had written a small program that was full of global state and dubious shortcuts. Reading it, a student asked 'You warned us against these techniques, yet I find them in your program. How can this be?'
> 
> Fu-Tzu said 'There is no need to fetch a water hose when the house is not on fire.' {This is not to be read as an encouragement of sloppy programming, but rather as a warning against neurotic adherence to rules of thumb.}"
>
> —_Marijn Haverbeke, [Eloquent JavaScript, 1st Edition, Chapter 6](http://eloquentjavascript.net/1st_edition/chapter6.html)_

To learn more about **functional reactive programming (FRP)**, check out the following resources:

* [Functional Reactive Programming for Beginners](https://www.youtube.com/watch?v=vLmaZxegahk)
* [The Functional Reactive Misconception](https://sideeffects.xyz/2015/the-functional-reactive-misconception/)
* [What is Functional Reactive Programming?](http://stackoverflow.com/questions/1028250/what-is-functional-reactive-programming/1030631#1030631)
* [Haskell - Functional Reactive Programming](https://wiki.haskell.org/Functional_Reactive_Programming)
* [Composing Reactive Animations](http://conal.net/fran/tutorial.htm)
* [Specification for a functional reactive programming language](https://stackoverflow.com/questions/5875929/specification-for-a-functional-reactive-programming-language#5878525)
* [A more elegant specification for FRP](https://github.com/conal/talk-2015-more-elegant-frp)
* [Functional Reactive Programming for Beginners](https://www.youtube.com/watch?v=vLmaZxegahk)
* [Elm - A Farewell to FRP](http://elm-lang.org/blog/farewell-to-frp)
* [Early inspirations and new directions in functional reactive programming](http://conal.net/blog/posts/early-inspirations-and-new-directions-in-functional-reactive-programming)
* [Breaking Down FRP](https://blogs.janestreet.com/breaking-down-frp/)
* [Rx* is not FRP](https://twitter.com/ReactiveX/status/483625917491970048)

---

## Conclusion

We'll conclude with another excellent quote from the first edition of [Eloquent JavaScript](http://eloquentjavascript.net/1st_edition/):

> "A student had been sitting motionless behind his computer for hours, frowning darkly. He was trying to write a beautiful solution to a difficult problem, but could not find the right approach. Fu-Tzu hit him on the back of his head and shouted '_Type something!_' The student started writing an ugly solution. After he had finished, he suddenly understood the beautiful solution."
>
> —_Marijn Haverbeke, [Eloquent JavaScript, 1st Edition, Chapter 6](http://eloquentjavascript.net/1st_edition/chapter6.html)_

The concepts necessary for understanding <a href="#functional-programming" target="_self">functional programming</a>, <a href="#reactive-programming" target="_self">reactive programming</a>, and <a href="#functional-reactive-programming" target="_self">functional reactive programming</a> can be difficult to grasp, let alone _master_. Writing code that takes advantage of a paradigm's fundamentals is the initial step, even if it isn't entirely faithful at first. Practice illuminates the path ahead and also reveals potential revisions. If anything is still unclear regarding these topics, please consult the links in each section for additional resources.

With this glossary as a starting point, you can begin taking advantage of these concepts and programming paradigms to increase your JavaScript expertise. We'll cover additional topics in the next Modern JS Glossary post!