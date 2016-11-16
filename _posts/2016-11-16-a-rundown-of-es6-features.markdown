---
layout: post
title: "A Rundown of JavaScript 2015 features"
description: "Take a look at the features from ECMAScript/JavaScript 2015 and learn how they can help you in your projects"
date: 2016-11-16 13:00
category: Technical guide, Feature list
author:
  name: Sebastián Peyrott
  url: https://twitter.com/speyrott?lang=en
  mail: speyrott@auth0.com
  avatar: https://en.gravatar.com/userimage/92476393/001c9ddc5ceb9829b6aaf24f5d28502a.png?size=200
design:
  bg_color: "#222228"
  image: https://cdn.auth0.com/blog/jsleaks/logo.png
  image_size: "100%"
  image_bg_color: "#222228"
  blog_series: false
tags:
- javascript
- ecmascript
- es2015
- es6
- ecmascript 6
- javascript 6
- async
- await
- javascript 2015
- ecmascript 2015
related:
- 2016-01-26-four-types-of-leaks-in-your-javascript-code-and-how-to-get-rid-of-them
- 2016-03-15-javascript-module-systems-showdown
- 2015-10-14-7-things-you-should-know-about-web-assembly
---

In this article we will go over the new features of JavaScript/ECMAScript 2015, a major update to the language. We will make special emphasis on how these features can help in the development of ever bigger systems and how they compare to the old way of doing things. We will also show you how to set up a modern project with ECMAScript 2015 plus async/await support. Read on!

{% include tweet_quote.html quote_text="ECMAScript 2015 is JavaScript for bigger projects!" %}

This rundown is based on the excellent work of Luke Hoban and his [es6features GitHub repository](https://github.com/lukehoban/es6features). Another great resource for those of you wishing to learn more is the [Mozilla Developer Network](https://developer.mozilla.org/en-US/). Of course, acknowledgements would not be complete without a reference to [Dr. Rauschmayer's blog](http://www.2ality.com) where you can find in-depth looks at ECMAScript 2015.

-----

## Introduction
After years of slow development, JavaScript has seen a rebirth. Node.js and newer frontend frameworks and libraries have renowed the enthusiasm behind the language. Its use for medium and big systems has put people thinking hard on how JavaScript needs to grow. The result of this is ECMAScript 2015, a big update to the language that brings many ideas that had been in the works for a long time. Let's see how these ideas help to make JavaScript a better language for all uses today. 

## The Features
### Let and Const
Since its inception, JavaScript had one way of declaring variables: `var`. The `var` statement, however, obeys the rules of **variable hoisting**. In other words, `var` declarations act as if the variables are declared at the top of the current execution context (function). This may result in unintuitive behavior:

```javascript
function test() {
    // Intended to write to a global variable named 'foo'.
    foo = 2;
    
    // A lot of code goes here

    for(var i = 0; i < 5; ++i) {
        // This declaration is moved to the top, causing the first
        // write to 'foo' to act on the local variable rather than a 
        // global one.
        var foo = i;
    }
}

test();
console.log(foo); //should print 2 but results in an exception.
``` 

For big codebases variable hoisting can result in unexpected and sometimes suprising behavior. In particular, variable declarations in many other popular languages are restricted to the lexical scope of the enclosing block, so newcomers to JavaScript may completely ignore the semantics of `var`.

ECMAScript 2015 introduces two new ways of declaring variables: `let` and `const`. The behavior of these statements is much more in line with what other languages do.

#### Let
The `let` statement works exactly as the `var` statement but with a big difference: `let` declarations are restricted to the enclosing scope and are only available from the point where the statement is located onwards. In other words, variables declared inside a `for` loop, or simply inside enclosing brackets, are only valid inside that block, and only after that `let` statement. This behavior is much more intuitive. Using `let` is encouraged in place of `var` in most cases.

#### Const
The notion of `const` is a bit more complex. All declarations in JavaScript are *rebindable*. A variable declaration establishes a connection between a `name` and a JavaScript object or primitive. This same name may later be rebound to a different object or primitive. In other words:

```javascript
var foo = 3; //foo is bound to the primitive 3.
foo = ["abc", "def"]; // foo is now bound to an array object.
```

The `const` statement, in contrast to the `let` and `var` statements, does not allow rebinding the name to a different object after the initial declaration:

```javascript
const foo = 3; //foo is bound to the primitive 3.
foo = ["abc", "def"]; // TypeError exception!
```

It is important to note that `const` does not affect *writability* in any way. This is in contrast to the notion of `const` from languages such as C and C++. Arguably, the choice of `const` as a name may have not been a good idea.

> Writability can be controlled using `Object.defineProperty()` and `Object.freeze()` and has nothing to do with the `const` statement. Do remember writing to read-only properties in non-strict mode is silently ignored. Strict-mode reports these errors as a TypeError exception.

Placing stricter requirements on the way certain bindings can be manipulated can prevent coding mistakes. In this sense, both `let` and `const` help greatly.

### Arrow functions and lexical this
JavaScript, by virtue of being a multi-paradigm language, makes use of many functional features. Of these features closures and anonymous functions are essential. Arrow functions introduce a new, shorter syntax for declaring them. Let's see:

```javascript
// Before ES2015
[1, 2, 3, 4].forEach(function(element, idx) {
    console.log(element);
});

// After ES2015: arrow functions
[1, 2, 3, 4].forEach((element, idx) => {
    console.log(element);
});
``` 

At first this may seem like little improvement. However, arrow functions behave differently when it comes to `this`, `arguments`, `super`, and `new.target`. All of these are local predefined declarations inside the scope of a function. Arrow functions, rather than declare their own version of these elements, inherit the values from the enclosing function. This prevents mistakes and unclutters certain common coding patterns:

```javascript
function Counter() {
    this.count = 20;

    setInterval(function callback{
        ++this.count; // BUG! this points to the global object 
                      // or is undefined (in strict mode) 
    }, 1000);
}

const counter = new Counter();
```

It is very easy to make a mistake like this. The old way of fixing this was rather cumbersome:

```javascript
function Counter() {
    // We will use this whenever we require a reference to this
    // inside a local function.
    var that = this;
    this.count = 20;

    setInterval(function callback{
        ++that.count; 
    }, 1000);
}

const counter = new Counter();
```

With ECMAScript 2015 things are simpler and obvious:

```javascript
function Counter() {
    this.count = 20;

    setInterval(() => {
        // this is bound to the enclosing scope's this value.
        ++this.count; 
    }, 1000);
}

const counter = new Counter();
```

### Classes
Since its inception JavaScript has supported object-oriented programming. However the form of OOP implemented by JavaScript was not entirely familiar for many developers, especially those coming from the Java and C++ family of languages. These two languages, and many others, implement objects in the spirit of Simula 67. JavaScript, however, implements objects in the spirit of Self. This model of OOP is known as *prototype based programming*.

Prototype-based programming can be unintuitive for developers coming from other object models. This has resulted in many JavaScript libraries coming up with their own way of using objects. These ways are sometimes incompatible. Prototype-based programming is powerful enough to model a class-based programming model, and library writers have come up with many ways of doing so.

The lack of consensus on the way of doing this has caused fragmentation and coupling problems between libraries. ECMAScript 2015 attempts to fix this by providing a common way of doing class-based programming on top of prototypes. This has resulted in some controversy in the community as many view the prototype based approach as superior.

Classes in ECMAScript 2015 are syntactic sugar for modeling classes on top of prototypes:

```javascript
class Vehicle {
    constructor(maxSpeed) {
        this.maxSpeed = maxSpeed;
    }

    get maxSpeed() {
        return maxSpeed;
    }
}

class Car extends Vehicle {
    constructor(maxSpeed) {
        super(maxSpeed);
        this.wheelCount = 4;
    }
}
```

Which in a prototype based approach could look like:

```javascript
function Vehicle(maxSpeed) {
    this.maxSpeed = maxSpeed;
}

Vehicle.prototype.maxSpeed = function() {
    return this.maxSpeed;
}

function Car(maxSpeed) {
    Vehicle.call(this, maxSpeed);
}

Car.prototype = new Vehicle();
``` 

The exact steps taken by the JavaScript interpreter to translate classes to a prototype chain are available in the [JavaScript specification](https://tc39.github.io/ecma262/#sec-runtime-semantics-classdefinitionevaluation).

The actual usefulness of classes compared to lean prototypes for big projects is a matter of active discussion. Some people argue that class based designs are harder to extend as the codebase grows, or, to paraphrase, that class-based designs require more forethought. Class proponents, on the other hand, argue that classes are more easily understood by developers coming from other languages and tried and proved designs are readily available as proof of their usefulness.

> One of the design objectives of Self, the language that inspired JavaScript's prototypes, was to avoid the problems of Simula-style objects. In particular, the dichotomy between classes and instances was seen as the cause for many of the inherent problems in Simula's approach. It was argued that as classes provided a certain archetype for object instances, as the code evolved and grew bigger, it was harder and harder to adapt those base classes to unexpected new requirements. By making instances the archetypes from which new objects could be constructed, this limitation was to be removed. Thus the concept of *prototypes*: an instance that fills in the gaps of a new instance by providing its own behavior. If a prototype is deemed inapropiate for a new object, it can simply be cloned and modified without affecting all other child instances. This is arguably harder to do in a class-based approach (i.e. modify base classes).

Whatever your thoughts on the matter, one thing is clear: if you prefer to stick to a class-based approach, there is now one officially sanctioned way of doing so. Otherwise, use prototypes to your heart's content.

### Object-literal Improvements
Another feature born out of practicality are the improvements to object literal declarations. Take a look:

```javascript
function getKey() {
    return 'some key';
}

let obj = {
    // Prototypes can be set this way
    __proto__: prototypeObject,
    // key === value, shorthand for someObject: someObject
    someObject,
    // Methods can now be defined this way    
    method() {
        return 3;
    },
    // Dynamic values for keys
    [getKey()]: 'some value'
};
```

For contrast, the old way of doing things would require something like:

```javascript
let obj = {
    someObject: someObject,
    method: function() {
        return 3;
    }
};

obj.prototype = prototypeObject;
obj[getKey()] = 'some value';

```

Anything that aids in readability and keeps blocks of code that should belong together as close as possible helps to reduce the chances of making a mistake.

### Template String Literals
There comes a time in every project in which you will need to interpolate values into a string. The standard way of doing this in JavaScript was through repeated concatenations:

```javascript
var str = 'The result of operation ' + op + ' is ' + someNumber;
``` 

Not very pretty, or maintainable for that matter. Imagine a much longer string with more values. Things can get out of hand rather quickly.

For this reason libraries such as `sprintf`, inspired by C's `sprintf` function, were created:

```javascript
var str = sprintf('The result of operation %s is %s', op, someNumber);
```

Much better, but very much like C's sprintf, perfect correlation between the format string and the values passed to sprintf is required. Remove an argument from the call and now you have a bug.

ECMAScript 2015 brings a much better solution to the table:

```javascript
const str = `The result of operation ${op} is ${someNumber}`;
```

Simple and harder to break! An additional feature of these new string literals is multiline support:

```javascript
const str = `This is a very long string.
We have broken it into multiple lines to make it easier to read.`;
```

Other additions with regards to strings are raw strings and tag functions. Raw strings can help to prevent mistakes related to escape sequences and quote characters:

```javascript
String.raw`Hi\u000A!`; //The unicode escape sequence is not processed
```

The syntax may look odd if you don't grok string tags yet:

```javascript
function tag(strings, ...values) {
  console.log(strings[0]); // "Hello "
  console.log(strings[1]); // " world "
  console.log(strings[2]); // ""
  console.log(values[0]);  // 1
  console.log(values[1]);  // 'something'

  return "This is the returned string, it needn't use the arguments";
}

const foo = 1;
const bar = 'something';

tag`Hello ${a} world ${b}`;
```

Tag functions are essentially functions that transform string literals in arbitrary ways. As you can imagine, they can be abused in ways that impair readability, so use them with care.

### Promises
One of the biggest features in ECMAScript 2015. Promises attempt to bring some sanity to the asynchronous nature of JavaScript. If you are a seasoned JavaScript developer you know callbacks and closures rule the day. You do know, as well, they are pretty flexible. That means everyone gets to choose how to use them. And in a dynamic language noone will hold your hand if mix two callback conventions unexpectedly.

Here's what JavaScript looked like without promises:

```javascript
var updateStatement = '...';

function apiDoSomething(withThis) {
    var url = 'https://some.cool.backend.com/api/justDoIt';
    httpLib.request(url, withThis, function(result) {
        try { 
            database.update(updateStatement, parseResult(result), 
                function(err) {
                    logger.error('HELP! ' + err);
                    apiRollbackSomething(withThis);
                }
            );
        } catch(e) {
            logger.error('EXCEPTION ' + e.toString());
            apiRollbackSomething(withThis);
        }
    }, function(error) {
        logger.error('HELP! ' + error + ' (from: ' + url + ')');
    });
}
```   

This is deceptively simple. Why "deceptively"? Because it is actually a minefield for future coders (or yourself!). Let's go through it step by step. What we see first is `updateStatement`. Presumably, this variable contains a statement or command in a database specific language. It could say something like "take this value and update the database in the right place". But `var` does not prevent rebinding `updateStatement` to something else later, so if by chance someone writes:

```javascript
function buggedFunction() {
    // Rebinds the global updateStatement!
    updateStatement = 'some function local update statement';
    // ...
}
```

rather than

```javascript
function buggedFunction() {
    // Shadows the global updateStatement
    var updateStatement = 'some function local update statement';
    // ...
}
```

what you get is...a BUG! 

But this has nothing to do with promises, let's move on:

```javascript
httpLib.request(url, withThis, function(result) {
    try { 
        database.update(updateStatement, parseResult(result), 
            function(err) {
                logger.error('HELP! ' + err);
                apiRollbackSomething(withThis);
            }
        );
    } catch(e) {
        logger.error('EXCEPTION ' + e.toString());
        apiRollbackSomething(withThis);
    }
}, function(error) {
    logger.error('HELP! ' + error + ' (from: ' + url + ')');
});
```

Take a closer look at this code. You can see here two types of callbacks, one nested in the other, with different conventions regarding how to handle errors and how to pass the results of a successful call. Inconsistency is a big factor when it comes to dumb mistakes. Not only that, the way they are nested prevents the exception handler from being the sole point of failure in the block, so `apiRollbackSomething` needs to be called twice with the exact same arguments. This is particularly dangerous. What if someone changes the code in the future to add a new failing branch. Will he or she remember to do the rollback? Will he or she even *see* it? Lastly, the logger is also called multiple times just to show the current error, and the argument passed to it is constructed using string concatenation, another source of dumb mistakes. In other words, this function leaves the door open to many bugs. Let's see how ECMAScript 2015 can help us prevent them: 

```javascript
// This won't get rebound in the future! Plus strings are constant, so this
// is assured to never change.
const updateStatement = '...'; 

function apiDoSomething(withThis) {
    const url = 'https://some.cool.backend.com/api/justDoIt';
    httpLib.request(url, withThis).then(result => {
        // database.update returns a promise as well
        return database.update(updateStatement, parseResult(result));
    }).catch(error => {
        logger.error(`ERROR: ${error} (from url: ${url})`);
        // Our API is such that rollbacks are considered no-ops in case 
        // the original request did not succeed, so it is OK to call it here.
        apiRollbackSomething(withThis);
    });
}
```

This is beautiful. All of the conflict points outlined before are neutralized by ECMAScript 2015. It is much harder to make mistakes when presented with code like this, and it is much simpler to read. Win-win.

If you are asking yourself why we return the result from `database.update` it is because promises can be *chained*. In other words, a promise can take the result of the next promise in the chain in case it succeeds, or it can perform the right action in case of failure. Let's see how that works in the example above.

The first promise is the one created by `httpLib.request`. This is our outtermost promise and will be the one that tells us if everything went well or something failed. To do something in any of those cases, we can use `then` or `catch`. It is not necessary to call any of these functions. You can call one, you can call both (as we do above) or you can disregard the results completely. Now, inside any of these handlers two things can happen:

1. You can do something with the data passed to your function (either the result or the error) and return a value, a promise or nothing.
2. You can throw an exception.

In case an exception is thrown, both `then` and `catch` know how to handle that: as an error condition. In other words, the next `catch` in the chain will get the exception. In our case, the outtermost catch gets all errors, both those generated by the `httpLib.request` promise and those generated inside `then`. It is important to note what happens with exceptions thrown inside the outtermost `catch`: they are *stored* inside the promise for a future call to `catch` or `then`. If no call is performed (as happens in the example above), it will get ignored. Fortunately, `apiRollbackSomething` does not throw any exceptions.

> Functions `then` and `catch` always return promises (even when there are no more promises in the chain). That means you can call `then` or `catch` after any call to these functions again. This is why it is said promises can be "chained". When everything is done, any further calls to `then` or `catch` execute the callback passed to them immediately.

It is important to note that chaining promises is usually the right thing to do. In the example above, we could have ommitted the `return` statement in from of `database.update`. The code would have worked the same in case no errors were caused by the database operation. However, the code would behave differently if an error where to occur: if the database operation were to fail, the `catch` block below would not get called, as the promise would not be chained to the outtermost one.

So how can you create your own promises? Easy enough:

```javascript
const p = new Promise((resolve, reject) => {
    try {
        const result = action(data);
        resolve(result);
    } catch(e) {
        logger.error(e.toString());
        reject(e);
    }
});
```

Promises can be chained inside the promise constructor as well:

```javascript
const p = new Promise((resolve, reject) => {
    const url = getUrl();
    resolve(
        httpLib.request(url).then(result => {
            const newUrl = parseResult(result);
            return httpLib.request(newUrl); 
        })
    );
});
```

Here the full power of promises can be seen: two HTTP requests are chained together into a single promise. Data resulting from the first request is processed and then used to construct the second request. All errors are handled internally by the promise logic.

In short, promises make asynchronous code more readable and reduce the chances of making mistakes. They also end the discussion of how promises should work, as before ECMAScript 2015 there were competing solutions with their own API.

### Generators, iterators, iterables and for...of
Another big feature from ECMAScript 2015. If you come from Python you will get JavaScript generators right away as they are very similar. Take a look:

```javascript
function* counter() {
    let i = 0;
    while(true) {
        yield i;
    }
}
```

If you are not a Python developer then your brain will throw `SyntaxError` a couple of times while parsing the code from above. Let's take a look at what's going on. The first thing that looks odd is the asterisk right beside the `function` keyboard. This is the new way of declaring a generator in ECMAScript 2015. After that there's `yield` right inside the function. `yield` is a new keyword that signals the interpreter to temporarily halt the execution of the generator and return the value passed to it. In this case, `yield` will return whatever value is in `i`. Repeated calls to the generator will *resume* execution from the point of the last yield, preserving all state.

```javascript
const gen = counter();
console.log(gen.next().value); // 0
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2
``` 

If all of this sounds familiar to you it may be because there is a very similar concept in computer science called **coroutine**. But coroutines have an additional feature when compared to exceptions: they can accept new data from the outside after each call to `yield`. In fact, JavaScript supports this! So JavaScript generators are in fact coroutines.

```javascript
function* counter() {
    let i = 0;
    while(true) {
        const reset = yield i;
        if(reset) {
            i = 0;
        }
    }
}

const gen = counter();
console.log(gen.next().value); // 0
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2
console.log(gen.next(true).value); // 0
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2
```

However, all of this may look superfluous at this point. Why add generators? In which way can they help to keep code tidier and error free? Generators were added to make it easier to bring the concept of **iterators** into the language. Now, iterators do come up quite a bit in most projects. So what was going on with iterators before ECMAScript 2015? Well, everybody was doing them their way:

```javascript
function arrayIterator(array) {
    var i = 0;
    return {
        next: function() {
            // May throw
            return array[i++];
        },
        ended: i >= array.length,
        reset: function() {
            i = 0;
        }
    }
}

var data = [0, 1, 2, 3, 4];
var iter = arrayIterator(data);
console.log(iter.next()); // 0
console.log(iter.next()); // 1
console.log(iter.next()); // 2
```

So, in a way, generators attempt to bring a standard way of using iterators. In fact, iterators in JavaScript are nothing more than a protocol, that is, a sanctioned API for creating objects that can be used to iterate over iterables. The protocol is best described by an example:

```javascript
function arrayIterator(array) {
    var i = 0;
    return {
        next: function() {
            return i < array.length ? {
                value: array[i++],
                done: false
            } : {
                done: true
            };
        }
    }
}
```

Take a special look at the object returned from the `arrayIterator` function: it describes the protocol required by JavaScript iterators. In other words, an iterator is an object that:

- Contains a `next` function taking no arguments.
- The `next` function returns an object containing either one or two members. If the member `done` is true, then no other member is present. `done` flags whether iteration has completed. The other member shall be `value` and represent the current iteration value.

So any object that adheres to this protocol can be called a JavaScript iterator. This is good, having an official way of doing this means mixing different libraries won't result in 6 different types of iterators being present (and having to use adapters between them if necessary!). Conventions and protocols are good for maintainability, because there are less chances of mixing things that look alike but aren't the same. A thing dangerously easy to do in JavaScript.

So, having to write iterators this way, although simple, can be cumbersome. What if JavaScript provided a way to create these objects easily? These *are* generators. Generator functions in fact return iterators. In other words, JavaScript generators are helpers to create iterators in a more convenient way. In particular, the use of generators and the `yield` keyword helps in making it simpler to understand the way state is managed inside the iterator. For example, the example above could be written as simply:

```javascript
function* arrayIterator(array) {
    array.forEach(i => yield i);
}
```

Simple, and much easier to read and understand, even for an inexperienced developer. Code clarity is crucial for maintainability.

But we are missing one key piece in the generator and iterators puzzle: there are many things that are *iterable*. In particular, collections are generally iterated over. Of course, the way elements are iterated over in a collection changes according to the collection in question, but the concept of iteration applies nonetheless. So ECMAScript 2015 provides two more pieces that complete the iterators and generators puzzle: the **iterable** protocol and `for..of`.

Iterables are objects that provide a convenient interface to construct iterators from them. In other words, iterables are objects that provide the following key:

```javascript
const infiniteSequence = {
    value: 0
    [Symbol.iterator]: function* () {
        while(true) {
            yield value++; 
        }
    }
};
``` 

`Symbol.iterator` and the `Symbol` object are new in ECMAScript 2015, so this looks very odd. We will go over `Symbol` later on in this guide, but for now think of it as a way to create unique identifiers (symbols) that can be used to index other objects. Another odd thing here is the literal object syntax. We are using `[Symbol.iterator]` inside an object literal to set its key. We've gone over this extension of object literals above. This is no different from the example we presented there:

```javascript
let obj = {
    // ...
    // Dynamic values for keys
    [getKey()]: 'some value'
}
```

So, in short, iterables are objects that provide a `Symbol.iterator` key whose value is a generator function.

So now we have a new key inside objects that can be iterated over. Do we need to explicitly get the generator from them everytime we want to iterate over the elements managed by them? The answer is no! Seeing this is quite a common pattern (iterating over elements managed by a container), JavaScript now provides a new version of the `for` control structure:

```javascript
for(let num of infiniteSequence) {
    if(num > 1000) {
        break;
    }
    console.log(num);
}
```

Yes! All iterable objects can be easily iterated over with the use of the new `for..of` loop. And the good thing about `for..of` is that existing collections have been adapted for use with it. So, arrays and the new collections (`Map`, `Set`, `WeakMap`) can all be used this way:

```javascript
const array = [1, 2, 3, 4];
// We will talk about Map later in this article
const map = new Map([['key1', 1], 
                     ['key2', 2], 
                     ['key3', 3]]);

for(let elem of array) {
    console.log(elem);
}

for(let [key, value] of map) {
    console.log(`${key}: ${value}`);
}
```

Note the odd syntax in the last `for..of` loop: `let [key, value]`. This is called destructuring and is another new feature of ECMAScript 2015. We will talk about it later.

Consistency and simplicity can do wonders for readability and maintainability, and this is exactly what iterators, iterables, generators and the `for..of` loop bring to the table.

### Functions: Default Arguments and the Rest Operator
Functions now support default arguments, simplifying the common pattern of checking whether an argument exists and then setting its value.

```javascript
function request(url, method = 'GET') {
    // (...)
}
```

As the number of arguments grows, default arguments simplify the flow of the checks required at the start of the function. And simplicity is good when coding.

```javascript
function request(url, method) {
    // Picture repeating this for every default argument without ECMAScript 2015
    // Yikes!
    if(typeof method === 'undefined') {
        method = 'GET';
    }
}
```

Default arguments also work with the `undefined` value. In other words, when passing `undefined` to a default argument, the argument will take its default value instead.

```javascript
function request(url, method = 'GET', data = {}, contentType = 'application/json') {
    // (...)
}

request('https://my-api.com/endpoint', undefined, { hello: 'world' });
```

This, however, does not preclude proper API design. In the example above, users might be tempted to pass the third argument as the second one, in particular when using `HTTP GET`. So, although this can help to redeuce boilerplate inside functions, care must be taken when picking the right order of arguments and their default values.

The `rest` operator is a new operator inspired by the one from C, take a look:

```javascript
function manyArgs(a, b, ...args) {
    // args === ['Hello', 'World', true]
}

manyArgs(1, 2, 'Hello', 'World', true);
```

Of course, JavaScript did allow access to arguments not declared in the argument list of a function through `arguments`. So why use the rest operator? There are two good reasons:

- To remove the need to manually find the first argument that is not named in the argument list. This prevents silly off-by-one mistakes that usually happen when arguments are added or removed to a function.
- To be able to use the variable containing non-declared arguments as a true JavaScript array. Since its inception, `arguments` has always behaved like an array without actually being one. In contrast, the variable created with the rest operator is a true array, bringing consistency, which is always good.

Since the variable declared through the rest operator is a true array, extensions such as `caller` and `callee`, present in `arguments`, are not available. 

### Spread Syntax
A way to quickly understand spread syntax is to think of it as the opposite to the rest operator. Spread syntax substitutes argument lists with the elements from an array (or any iterable, in fact). In other words:

```javascript
function manyArgs(a, b, c, d) {
    // (...)
}

let arr = [1, 2, 3, 4];

manyArgs(...arr);

//manyArgs.apply(null, arr); //Old way, less readable
```

Spread syntax can be used in places other than function calls. This opens the possibility for interesting applications:

```javascript
const firstNumbers = [1, 2, 3, 4];
const manyNumbers = [-2, -1, 0, ...firstNumbers, 5, 6, 7];

const arrayCopy = [...firstNumbers];
```

Spread syntax removes one troublesome limitation from past versions of JavaScript: the `new` operator could not be used with `apply`. `apply` takes a function object as a parameter, and `new` is an operator. In other words, it was not possible to do something like:

```javascript
const nums = [1, 2, 3, 4, 5];
function NumberList(a, b, c, d, e) {
    this.a = a;
    // (...)
}

//NumberList.apply(new NumberList(), nums); //No params passed to NumberList!
``` 

We can now do:

```javascript
const numList = new NumberList(...nums);
```

Spread syntax simplifies a number of common patterns. And simplicity is always good for readability and maintainability.

### Destructuring
Destructuring is an extension of JavaScript's syntax that allows for certain interesting ways of transforming a single variable into multiple variables bound to its internals. We have already seen one example of this above:

```javascript
for(let [key, value] of map) {
    console.log(`${key}: ${value}`);
}
```

In this case, the variable `map` is bound to a `Map`. This data structure conforms to the iterable protocol and provides to values per iteration: a key, and an associated value to that key. These two values are returned inside an array of two elements. The key if the first element, and the value is the second element.

Without destructuring, the above code would look like this:

```javascript
for(let tuple of map) {
    console.log(`${tuple[0]}: ${tuple[1]}`);
}
```

The ability to map the internal structure of objects to variables using syntax that is identical to the original structure clarifies code. Let's see other examples:

```javascript
let [a, b, c, d, e] = [1, 2, 3, 4, 5];
console.log(a); // 1
console.log(b); // 2
```

That was simple array destructuring. What about objects?

```javascript
const obj = {
    hello: 'world',
    arr: [1, 2, 3, 4],
    subObj: {
        a: true,
        b: null
    }
};

let { hello, arr, subObj: { b } } = obj;

console.log(hello); // world
console.log(b); // null
```

This is getting interesting. Look at this example:

```javascript
const items = [
    {
        id: 0,
        name: 'iPhone 7'
    },
    {
        id: 1,
        name: 'Samsung Galaxy S7'
    },
    {
        id: 2,
        name: 'Google Pixel'
    }
];

for(let { name } of items) {
    console.log(name);
}
```

Destructuring also works in function arguments:

```javascript
items.forEach(({ name }) => console.log(name));
```

It is possible to pick different names for destructured elements:

```javascript
items.forEach(({ name: phone }) => console.log(phone));
```

Failure to destructure and object correctly will result in variables with undefined values.

Destructuring can be combined with default arguments (another new feature in ECMAScript 2015). This simplifies certain common coding patterns:

```javascript
function request(url, { method: 'GET', data }) {
    // (...)
}
```

Proper care must be taken with default arguments and destructuring as ECMAScript 2015 does not allow the capture of any keys not declared in the destructuring expression. In other words, if the object passed as the second argument in the example above had a third key (let's say key `contentType`), it would not be possible to access it (except by going through `arguments`, which would be cumbersome and impair readability). This omission will be fixed in ECMAScript 2016.

Arrays do possess this ability in ECMAScript 2015:

```javascript
let arr = [1, 2, 3, 4, 5];
let [a, b, ...rest] = arr; // rest === [3, 4, 5]
```

Array allow skipping items as well:

```javascript
let arr = [1, 2, 3, 4, 5];
let [a, , ...rest] = arr; // rest === [3, 4, 5], number 2 skipped
```

Arguably, destructuring is a new way rather than a better way of doing things. My personal advice is to keep things simple and readable. Do not overuse destructuring when a simple reference to an inner variable can be written as `let a = obj.subObj.a`. Destructuring is of particular use when "picking" multiple elements from objects at different nest levels. In this case, readability can be improved. It is also useful in function arguments and `for` loops to reduce the number of helper variables needed.

### Modules
One of the most expected features from ECMAScript 2015. Modules put an end to endless discussions regarding the proper way of extending JavaScript to do what most languages already do: separate code in different places in a convenient, portable and performant way.

> If you are relatively new to programming, it might be hard to see why modularity is such an essential requirement for proper development practice. Think of modules as a way to organize code in self-contained units of work. These units define a clear way to interact with other units. This separation promotes maintainability, readability and allows more people to develop concurrently without stepping on each other's toes. Keeping things small and simple also helps tremendously in the process of design and implementation.

As JavaScript was conceived as a language for the web, it has always been associated to HTML files. HTML files tell browsers to load scripts placed in other files or inline. Previously loaded scripts can create global objects that are available for future scripts. Up to ECMAScript 2015 this was the only rudimentary way in which code from different JavaScript files could communicate with each other. This resulted in a plethora of different ways of handling this. Module "bundlers" were born out of necessity to bring some sanity to this situation. JavaScript interpreters for other environments (such as Node.js) adapted solutions such as Common.js. Other specifications such as Asynchronous Module Definition (AMD) also appeared. The lack of concensus in the community forced the ECMAScript working group to take a look at the situtation. The result is ECMAScript 2015 modules.

> To learn more about the differences between Common.js, AMD and ECMAScript 2015 modules take a look at [JavaScript Module Systems Showdown: CommonJS vs AMD vs ES2015](https://auth0.com/blog/javascript-module-systems-showdown/).

```javascript
// helloworld.js

export function hello() {
    console.log('hello');
}
export function world() {
    console.log('world');
}

export default hello;

console.log('Module helloworld.js');
```

```javascript
// main.js

import { hello, world } from 'helloworld.js';

hello();
world();
```

ECMAScript 2015 add a couple of keywords to the language: `import` and `export`. The `import` keyword lets you bring elements from other modules into the current module. These elements can be renamed during import, or can be bulk imported. The export keyword does the oposite: it marks elements from the current module as available for import. Elements imported from other modules can be re-exported.

```javascript
// hello and world available.
import * from 'helloworld.js';
// HelloWorld is an object that contains hello and world.
import * as HelloWorld from 'helloworld.js';
// helloFn is hello and worldFn is world in this module.
import { hello as helloFn, world as worldFn } from 'helloworld.js';
// h is the default export from helloworld.js, namely hello.
import h from 'helloworld.js'; 
// No elements are imported, but side-effects from the helloworld.js module
// are run (the console.log statement in it is a side-effect).
import 'helloworld.js';
```

An interesting aspect of ECMAScript 2015 modules is that the semantics of `import` allow for either parallel or sequential loading of modules. In other words, interpreters are free to choose what is more appropriate. This is in stark contrast with Common.js (sequential) and AMD modules (asynchronous).

#### Why are browsers taking so long to implement modules?
If modules are so important for the reasons described above, then why aren't them available yet? As of November 2016, most major browsers implement most of ECMAScript 2015 natively, but modules are still missing. What is going on?

Although ECMAScript 2015 did define modules in a syntax, the specification makes no mention of how they should be implemented with regards to the web. In other words, a conforming implementation need only parse JavaScript files containing `import` and `export` statements. It is not necessary to actually do anything with that! This might look like a big omission, but it is not. As mentioned at the beginning of this section, JavaScript has always been married to HTML in the web. However, the ECMAScript 2015 specification concerns itself with JavaScript and JavaScript only. It has nothing to do with HTML and how JavaScript files are accessed. In other words, although an `import` statement makes it clear an interpreter should attempt to load a file with a specific name, it says nothing regarding how to get it. In the web, this means performing a request to a server with a specific URL. Furthermore, ECMAScript says nothing about the relation of HTML and JavaScript. This is expected to be resolved by the [JavaScript Loader Standard](https://github.com/whatwg/loader) which attempts to bring forth a loader spec for browsers and standalone interpreters alike. HTML is also expected to add the necessary syntax to differentiate JavaScript modules from otherwise common scripts (a proposed syntax for this is `<script type="module" src="file.js">`).

#### Static nature of import and export
Both `import` and `export` are static in nature. In other words, effects from using these keywords must be fully computable before execution of the script. This opens up the possibility for static analyzers and module bundlers to do their magic. Module bundlers such as Webpack could construct a dependecy tree at packing-time that would be complete and deterministic. In other words, removing unneeded dependencies and other optimizations are possible and entirely supported by the specification. This is a big difference with regards to both Common.js and AMD.

But static modules do remove some flexibility that is handy in some scenarios. Unfortunately, the dynamic loader proposal did not make it into ECMAScript 2015. It is expected to be added in future versions. A proposal already exists in the form of `System.import`.

#### Can we use modules now?
Yes, and you should! Although module loading is not implemented in browsers yet, bundlers, compilers and libraries such as Babel, Webpack and System.js have implemented ECMAScript 2015 modules. The benefit of adopting modules early is that they are already part of the spec! You know one way or the other, modules are set in stone and won't see major changes in future versions of JavaScript. Using Common.js or AMD today implies taking a step back and adopting solutions that will fade out in the future.

### New Collections
Although JavaScript has the necessary power to implement many data structures, some of them are better implemented through optimizations only available to the interpreter. The ECMAScript 2015 working group decided to tackle this issue and came up with `Set`, `Map`, `WeakSet` and `WeakMap`.

`Set` stores unique objects. Objects can be tested for presence in the set. `Set` uses special comparison semantics (which mostly resemble `===`) to check for object equality.

`Map` extends `Set` to associate arbitrary values with unique keys. In other words, `Map` allows the use of arbitrary unique keys, in contrast with common JavaScript objects (which only allow strings as keys).

`WeakSet` behaves like a set but does not take ownership of the objects stored in it. In other words, objects inside a `WeakSet` become invalid after no references to them are available from outside the set. `WeakSet` only allows objects to be stored in it, primitive values are not allowed.

`WeakMap` is weak in the keys (like `WeakSet`) and strong in the values it stores.

JavaScript has always been lean in the data structures department. Sets and maps are one of the most used data structures, so integrating them in the language comes with a set of benefits:

- Reduced number of dependencies on external libraries
- Less code to test (if a map or set is implemented in-code, tests are required for their functionality)
- Consistent API for one of the most common requirements

Unfortunately, hash-based maps are still not available.

### Object Proxies
Another big addition to ECMAScript 2016. Object proxies let you customize the behavior of objects in interesting ways. JavaScript, by virtue of being a dynamic language, is very flexible when it comes to modifying objects. However, certain modifications are better expressed through the use of proxies. For example, let's see how we can modify all get operations of all properties of an object to add one in case the property is a number. Let's tackle this problem using ECMAScript 5 first.

```javascript
var obj = {
    a: 1,
    b: 2,
    c: 'hello',
    d: 3
};

var obj2 = Object.create(obj);

Object.keys(obj).forEach(function(k) {
    if(obj[k] instanceof Number || typeof obj[k] === 'number') {
        Object.defineProperty(obj2, k, {
            get: function() {
                return obj[k] + 1;
            },
            set: function(v) {
                obj[k] = v;
            }
        });
    }
});

console.log(obj2.a); // 2
console.log(obj.a);  // 1
obj2.a = 4;
console.log(obj.a);  // 4
console.log(obj2.a); // 5
```

Here we make use of the prototype mechanism in JavaScript to shadow variables in an object that looks like the original one. The shadow object has a custom setters and getters that access the variables from the prototype object. It works, but it is a bit hard to follow. Let's see how ECMAScript 2015 improves this.

```javascript
let obj = {
    a: 1,
    b: 2,
    c: 'hello',
    d: 3
};

let obj2 = new Proxy(obj, {
    get: function(object, property) {
        const value = object[property];
        if(value instanceof Number || typeof value === 'number') {
            return value + 1;
        } else {
            return value;
        }
    }
});

console.log(obj2.a); // 2
console.log(obj.a);  // 1
obj2.a = 4;
console.log(obj.a);  // 4
console.log(obj2.a); // 5
``` 

This is much clearer: no superfluous iteration of keys, no need to explicitly override the setter, no fiddling with the prototype chain. And as we have said before: clearer code is better code.

Another perk of proxies is that they can override operations that would be hard (or impossible) to override otherwise. For example, proxies can modify the behavior of constructors:

```javascript
let Obj = new Proxy(function () { return { a: 1 } }, {
    construct: function(target, args, newTarget) {
        target.extension = 'This is an extension!';
        return target;
    }
});

const o = new Obj;
console.log(o.extension); // 'This is an extension';
```

### Reflection
Proxies are a nice addition to the dynamic capabilities of JavaScript and the complement to them is reflection. For every operation that can be caught and overriden by a proxy, the `Reflect` object allows access to that operation with the same consistent API. In other words, if proxies provide a `get` operation that overrides access to properties, `Reflect` provides a `get` operation that provides access to a property.

```javascript
let obj = {
    a: 1,
    b: 2,
    c: 'hello',
    d: 3
};

// Equivalent to obj['a'];
console.log(Reflect.get(obj, 'a')); // 1

function SomeConstructor() {
    return { a: 1 };
}

// Equivalent to new SomeConstructor
const newObj = Reflect.construct(SomeConstructor, []);
console.log(newObj.a); // 1

// Equivalent to 'a' in newObj
console.log(Reflect.has(newObj, 'a'));
```

The objective of the reflection API is to bring consistency to certain operations that used to be performed in other ways. The utility of these functions is arguably not as important as the Proxy API, but still a welcome addition.

### Symbols 
Symbols are a new primitive data type in JavaScript. In contrast with existing data types, symbols have no real value. Their strength lies in their uniqueness. All symbols are unique and immutable. Symbols are primarily used as object keys. Symbol object keys are distinct from string keys and are not enumerated by `Object.keys` nor seen by `JSON.stringify`.

The main use of symbols is to create special keys inside objects. ECMAScript 2015 uses the symbol facility to define certain very specific keys. For instance, iterable objects define their iterator using `Symbol.iterator`.

```javascript
const obj = {
    [Symbol.iterator]: function* () {
        yield 1;
        yield 2;
    }
}

for(const v of obj) {
    console.log(v);
}
```

Symbols can help you to prevent polluting an object with keys that are better opaque. Symbols can carry a helper message to ease debugging. However, two symbols carrying the same message are still distinct.

By keeping the namespace of special object keys separate from common keys, ECMAScript 2015 makes debugging easier, object serialization simpler, and it reduces the chances of hitting bugs caused by key name collisions.

### Typed Arrays
One of the pitfalls of JavaScript is the lack of proper numeric types. Most of the time, it is possible to get around this limitation somehow. However, efficient storage of big quantities of numeric values can't be achieved. This is solved with typed arrays.

```javascript
const arr = new Uint8Array(1024);
arr[8] = 255;
```

Typed arrays provide efficient storage for signed and unsigned integers of 8, 16 and 32 bits. There are also floating point versions for 32-bit and 64-bit values.

### Minor Features
#### Subclassing Built-ins
Adding to the controversial nature of ECMAScript 2015 classes, most built-in objects can now be subclassed.

```javascript
class SpecialArray extends Array {
    constructor(...args) {
        super(...args);
    }

    get lengthWithTerminator() {
        return this.length + 1;
    }
}

const arr = new SpecialArray(1, 2, 3);
console.log(arr.lengthWithTerminator);
```

Subclassing should be preferred to manipulating the prototype of built-ins, and proxies should be preferred over these two options. Ultimately it is up to you to pick the best option for your use case. In general terms, behavior reuse is better expressed through composition or proxies than subclassing, so use this feature with care.

#### Guaranteed Tail-call Optimization
Many functional programming languages perform tail-call optimization. Tail-call optimization handles the conversion of certain recursive function calls into loops. This conversion avoids stack overflows. JavaScript brings many functional features to the table, but this one was sorely missing until ECMAScript 2015. Certain algorithms are better expressed through recursion rather than loops.

```javascript
function factorial(n) {
    "use strict";
    function helper(n, result) {
        return n <= 1 ? result : helper(n - 1, result * n);
    }
    return helper(n, 1);
}
```

Tail-call optimization requires functions to be in tail-call position, that is, the branch that spawns the next call to the recursive function must be the last call of that branch, no pending operations should remain there. This is the reason the example above is a bit more convoluted than the straight implementation shown below.

```javascript
function factorial(n) {
    return n <= 0 ? 1 : n * factorial(n - 1);
}
```

In this example the last operation in one of the branches is the multiplication of `n` by the recursive function. In other words, the recursive function is not in tail position and tail call optimization cannot be performed.

Some language implementations are smart enough to convert this last example into the former, enabling tail call optimization. This is not required nor expected of ECMAScript 2015 implementations, so one should not depend on it.

Tail-call optimization is an interesting addition to the JavaScript toolbox. However, it should only be used when clarity is improved by it.

#### Unicode
Although JavaScript did support Unicode before ECMAScript 2015, there are some interesting additions. The new Unicode escape sequence is the most prominent of them:

```javascript
const str = '\u{10437}'; // 𐐷
str.codePointAt(0) === 0x10437;
```

Before ECMAScript 2015, to specify a character such as the above without putting it literally in the source, one would have to put the explicit surrogate-pair:

```javascript
const str = '\uD801\uDC37'; // 𐐷
```

Regular expressions now support embedded codepoints in the pattern via de `u` flag:

```javascript
'\u{10437}'.match(/./u)[0].length == 2; //Surrogate-pair
```

#### New numeric literals
Binary and octal literals are now available:

```javascript
0b10100001 === 0xA1 === 0o241 === 161;
```

## What Comes Next
The next versions of ECMAScript will probably not be as big as ECMAScript 2015, however interesting additions are expected. Let's see some of the major ones.

### Async/Await
We have seen how ECMAScript 2015 improves asynchronous programming by the way of promises. Still, for all their merits, promises come with a considerable syntactic weight. Is there any way we could improve this? Fortunately, yes! That's what async/await will attempt to do in ECMAScript 2017.

Here is one the samples from the promises section above:

```javascript
const updateStatement = '...'; 

function apiDoSomething(withThis) {
    const url = 'https://some.cool.backend.com/api/justDoIt';
    httpLib.request(url, withThis).then(result => {
        // database.update returns a promise as well
        return database.update(updateStatement, parseResult(result));
    }).catch(error => {
        logger.error(`ERROR: ${error} (from url: ${url})`);
        // Our API is such that rollbacks are considered no-ops in case 
        // the original request did not succeed, so it is OK to call it here.
        apiRollbackSomething(withThis);
    });
}
```

Here is how it will look like in ECMAScript 2017:

```javascript
const updateStatement = '...'; 

async function apiDoSomething(withThis) {
    const url = 'https://some.cool.backend.com/api/justDoIt';
    try {
        const result = await httpLib.request(url, withThis);
        return database.update(updateStatement, parseResult(result));
    } catch(e) {
        logger.error(`ERROR: ${e} (from url: ${url})`);
        // Our API is such that rollbacks are considered no-ops in case 
        // the original request did not succeed, so it is OK to call it here.
        apiRollbackSomething(withThis);
    }
}
```

This might not look like much of an improvement, so let's take a look at a more complex example.

```javascript
function apiDoSomethingMoreComplex(withThis) {
    const urlA = '...';
    const urlB = '...';

    httpLib.request(urlA, withThis).then(result => {
        const parsed = parseResult(result);
        return new Promise((resolve, reject) => {
            database.update(updateStatement, parsed).then(() => {
                resolve(parsed);
            }, error => {
                reject(error);
            });
        });
    }).then(result => {
        return httpLib.request(urlB, result);
    }).then(result => {
        return worker.processData(result);
    }).then(result => {
        logger.info(`apiDoSomethingMoreComplex success (${result})`);
    }, error => {
        logger.error(error);
    });
}
```

In this example we have a chain of asynchronous operations that depend on results from previous operations. Furthermore, the result passed to the next operation is not necessarily the result of the previous operation, so some fiddling with `resolve` and `reject` is necessary. It is important to note that in spite of looking a bit hard to follow, this code is much better than what would be necessary without promises. Let's take a look at how async/await improve this even more:

```javascript
async function apiDoSomethingMoreComplex(withThis) {
    const urlA = '...';
    const urlB = '...';

    try { 
        let result = await httpLib.request(urlA, withThis);
        const parsed = parseResult(result);
        await database.update(updateStatement, parsed);
        result = await httpLib.request(urlB, parsed);
        result = await worker.processData(result);
        logger.info(`apiDoSomethingMoreComplex success (${result})`);
    } catch(e) {
        logger.error(e);
    }
}
```

The improvement is notable. Readability is so much better that one might even confuse this for synchronous code. `async`/`await` make an asynchronous function look like a synchronous function by acting as syntactic sugar to hide the behavior of promises working in the back. Yes, that's right, `async`/`await` are little more than syntactic sugar for promises! So, whatever code works with promises today already supports `async`/`await`! To make it clear how `async`/`await` relate to promises we'll make the behavior more explicit.

- `await` can only be used inside `async` functions.
- An `async` function returns a promise. The value returned from the function is the result of the promise. If the function throws, then the promise is rejected. The function may return a promise instead, resulting in a chained promise. In other words, async functions always wrap their result in a promise.
- `await` causes the current `async` function to wait on a promise. When the promise is resolved successfully, the result from that promise is unwrapped and becomes the result of the await expression, ready to be used. If the promise fails, then an exception is thrown with the rejected value of that promise. If the exception is caught, the async function may continue normally. Otherwise it will be rejected.

It may not be obvious from the above how `async` functions are used with normal functions. Let's see:

```javascript
function normalFunction() {
    const data = getData();
    // Yup, async functions are nothing more than promises.
    apiDoSomethingMoreComplex(data).then(result => {
        console.log(`Success! ${result}`);
    }, error => {
        console.log(`Error: ${error}`);
    });
}
```

An `async` function is simply a promise. Outside other `async` functions, you are required to follow the `Promise` API. That is it! `Async`/`await` take the power of promises and make them much more readable. And readable is always better: better for code, and better for you and future coders.

### Single Intruction Multiple Data (SIMD)
As JavaScript gets used for more and more purposes, it becomes evident how access to certain hardware operations can make things more efficient. Single instruction multiple data (SIMD) instructions are a series of hardware operations that work on multiple elements of data at the same time. Certain operations can be sped up greatly when access to these instructions is available. They are of particular use in image, audio and cryptographic operations, all areas where JavaScript has started to be used.

```javascript
const a = SIMD.Float32x4(1, 2, 3, 4);
const b = SIMD.Float32x4(5, 6, 7, 8);
const c = SIMD.Float32x4.add(a, b); // [6,8,10,12]
```

This example, taken from the [MDN SIMD page](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SIMD) shows how four floating point values can be added together in a single operation. Although not evident from the API, if a hardware operation is available to perform the addition in less instructions than four independent additions, it will be used.

SIMD operations open the door to more possibilities for JavaScript.

### Asynchronous Iteration
Asynchronous iteration takes three great features from ECMAScript 2015 and 2017 and mixes them together: iterators, generators and async/await. This is an early proposal, so the syntax is not set in stone yet. Here's what it could look like:

```javascript
for await (const line of readLines(filePath)) {
  console.log(line);
}
```

`readLines` is a generator function that returns a promise in each iteration. By extending the syntax of `for` to handle promises through the `await` keyword, uses like the above become possible. It is important to note that the restriction of using `await` inside `async` functions remains in place. Here's what an async generator like `readLines` could look like:

```javascript
async function* readLines(path) {
  let file = await fileOpen(path);

  try {
    while (!file.EOF) {
      yield await file.readLine();
    }
  } finally {
    await file.close();
  }
}
```

To learn more about this proposal, visit its [GitHub repository](https://github.com/tc39/proposal-async-iteration).

## Aside: Auth0 Lock with ECMAScript 2015 + Async/Await
You can use ECMAScript 2015 and async/await today! We will see how to do this using Webpack + Babel. For this example we will adapt one of the Auth0 VanillaJS Lock examples to use ECMAScript 2015 and async/await.

First, get the code and <a href="javascript:signup()">signup for a free Auth0 account</a>:

```sh
$ git clone git@github.com:auth0-samples/auth0-javascript-spa.git
```

Enter the `01-Login` directory and init a new NPM project.

```sh
npm init
```

Now install all our development dependencies:

```
npm install --save-dev http-server webpack babel-loader babel-core babel-preset-es2015 babel-plugin-transform-runtime babel-preset-stage-3 bluebird 
```

A simple Webpack + Babel setup requires two simple configuration files:

```javascript
// webpack.config.js
module.exports = {
    entry: "./app.js",
    output: {
        path: __dirname,
        filename: "app.bundle.js"
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel',
            query: {
                presets: ['es2015', 'stage-3']
            }
        }]
    }
};
```

```javascript
// .babelrc
{
  "plugins": ["transform-runtime"]
}
```

Now edit the HTML file to point to our new compiled bundle:

```html
<script src="app.bundle.js"></script>
```

Now let's modify the `auth0-variables.js` file to use the new `export` keyword from ECMAScript 2015:

```javascript
export const AUTH0_CLIENT_ID='E799daQPbejDsFx57FecbKLjAvkmjEvo';
export const AUTH0_DOMAIN='speyrott.auth0.com';
export const AUTH0_CALLBACK_URL=location.href;
```

Now comes the big part, we will refactor the `app.js` file to use some features from ECMAScript 2015 and async/await. But first, let's use `Bluebird` to convert Auth0 Lock's old Node.js callbacks to promises.

```javascript
import {
  AUTH0_CLIENT_ID,
  AUTH0_DOMAIN,
  AUTH0_CALLBACK_URL
} from './auth0-variables.js';

import Promise from 'bluebird';

var lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN);
const getProfile = Promise.promisify(lock.getProfile, { context: lock });
```

And now let's use promises and async/await:

```javascript
async function retrieveProfile() {
  var idToken = localStorage.getItem('id_token');
  if (idToken) {
    try {
      const profile = await getProfile(idToken);
      showProfileInfo(profile);
    } catch(err) {
      alert('There was an error getting the profile: ' + err.message);
    }
  }
}

async function afterLoad() {
  // buttons
  var btnLogin = document.getElementById('btn-login');
  var btnLogout = document.getElementById('btn-logout');

  btnLogin.addEventListener('click', function () {
    lock.show();
  });

  btnLogout.addEventListener('click', function () {
    logout();
  });

  lock.on("authenticated", function(authResult) {
    getProfile(authResult.idToken).then(profile => {
      localStorage.setItem('id_token', authResult.idToken);
      showProfileInfo(profile); 
    }, error => {
      // Handle error
    });
  });

  return retrieveProfile();
}

window.addEventListener('load', function () {
  afterLoad().then();
});
```

The `getProfile` function is a promise. You can either use it as such, or `await` for its result inside `async` functions.

[Get the fully working example](https://github.com/auth0-blog/es2015-rundown-example).

## Conclusion
ECMAScript 2015 is a major update to JavaScript. Many of the improvements talked about for years are now available. These features make JavaScript much more suitable for big-scale development. Certain common patterns are simplified, clarity is improved and expressiveness is increased. Although ECMAScript 2015 support is a problem when targetting old browsers or environments, transpilers such as Babel and Traceur let you reap the benefits today. As most JavaScript projects nowadays make use of bundlers, the use of transpilers is simple and convenient. There is no reason you should not use ECMAScript 2015 and reap the benefits today!
