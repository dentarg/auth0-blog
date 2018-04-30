---
layout: post
title: "RxJS 6: What's new and what has changed?"
description: "RxJs 6 is out to provide developers with improvements in modularity, a boost in performance and easier to debug call stacks."
longdescription: "RxJs 6 is out and with it new exciting additions and changes! The motivation behind this release is to provide developers with improvements in modularity, a boost in performance and easier to debug call stacks. The RxJS team has made a solid effort on making this release as backward compatible as possible."
date: 2018-04-30 8:30
category: Technical Guide, Frontend, RxJS
design:
  bg_color: "#572D89"
  image: https://cdn.auth0.com/blog/reactive-programming/logo.png
author:
  name: Dan Arias
  url: http://twitter.com/getDanArias
  mail: dan.arias@auth.com
  avatar: https://pbs.twimg.com/profile_images/918124318076256256/wMFapJ1C_400x400.jpg
tags:
  - reactive-programming
  - javascript
  - rxjs
  - rxjs-6
  - front-end
  - reactive
  - reactivex
  - rxjs5
  - rxjs-5
related:
  - 2016-09-29-angular-2-authentication
  - 2018-03-13-using-python-flask-and-angular-to-build-modern-apps-part-1
  - 2018-01-25-reactive-programming-in-python
---

RxJs 6 is out and with it new exciting additions and changes! [Ben Lesh](https://twitter.com/BenLesh) [highlights that RxJS 6](https://twitter.com/BenLesh/status/988922021705756672) brings cleaner imports while having a smaller API, a backward compatibility package to update without changing your code, and automatic code migration for TypeScript.

These changes provide developers with improvements in modularity, a boost in performance and easier to debug call stacks. The RxJS team has made a solid effort on making this release as backward compatible as possible. However, in an effort to reduce the API surface of the RxJS library, some breaking changes were introduced.

{% include tweet_quote.html quote_text="RxJS 6 brings improvements in modularity, a boost in performance and easier to debug call stacks. The RxJS team has made a solid effort on making this release as backward compatible as possible" %}

Let's explore what the RxJS team has included and changed in this new release.

## RxJS 6 Backward Compatibility

To make the migration path from RxJS 5 to RxJS 6, the RxJS team has released a sibling package called `rxjs-compat`. This package creates a compatibility layer between the APIs of `v6` and `v5`.

The team recommends that most developer upgrade existing applications by installing both `rxjs` and [`rxjs-compat`](https://www.npmjs.com/package/rxjs-compat) at `^6.0.0`:

```bash
npm install rxjs@6 rxjs-compat@6 --save
```

This package allows you to continue running your existing codebase without issues while you implement the RxJS 6 upgrades. It supports functionality that is removed with the release of RxJS 6.

The bundle size of your application will increase with the installation of `rxjs-compat`; this effect is amplified if your project also integrates with Webpack < `4.0.0`. Therefore, it is recommended that `rxjs-compat` is removed from your project once the upgrade process has been completed.

{% include tweet_quote.html quote_text="rxjs-compat makes it easy to upgrade to RxJS 6 as it creates a compatibility layer between the APIs of v6 and v5. This layer provides your codebase with functionality that is being removed in v6 so that you can upgrade gradually." %}

> Upgrading to RxJS 6 may introduce type errors in your codebase that were not previously shown.

## Limitations of Upgrading to RxJS with rxjs-compat

There are only two breaking changes that are not covered by the `rxjs-compat` package:

### TypeScript prototype operators

In the rare instance that your codebase defines its own TypeScript prototype operators and modifies the `Observable` namespace, your operator code would need to be updated in order for TypeScript to compile.

From the release notes examples, a user-defined prototype operator can be created as follows:

```javascript
Observable.prototype.userDefined = () => {
  return new Observable((subscriber) => {
    this.subscribe({
      next(value) { subscriber.next(value); },
      error(err) { subscriber.error(err); },
      complete() { subscriber.complete(); },
   });
  });
});

source$.userDefined().subscribe();
```

To compile the previously custom operator, the following changes would need to be made:

```javascript
const userDefined = <T>() => (source: Observable<T>) => new Observable<T>((subscriber) => {
    this.subscribe({
      next(value) { subscriber.next(value); },
      error(err) { subscriber.error(err); },
      complete() { subscriber.complete(); },
   });
  });
});

source$.pipe(
  userDefined(),
)
```

### Synchronous error handling

Calling `Observable.subscribe()` within a `try/catch` block is no longer supported. Instead, replace the `try/catch` block with asynchronous error handling done with the `error` callback in the `Observable.subscribe()` method.

As shown in the release notes:

```javascript
// deprecated
try {
  source$.subscribe(nextFn, undefined, completeFn);
} catch (err) {
  handleError(err);
}

// use instead
source$.subscribe(nextFn, handleError, completeFn);
```

`Observable.subscribe()` now _must_ define an `error` callback to handle errors asynchronously.

## Changes to Make Before Dropping the RxJS Compatibility Layer

As mentioned earlier, `rxjs-compat` provides a temporary compatibility layer between the APIs of `v5` and `v6`. Essentially, `rxjs-compat` provisions your codebase with functionality from `v5` that it relies on, allowing you to gradually upgrade your codebase to `v6`. To complete the upgrade process and remove the `rxjs-compat` dependency from your project, your codebase would need to be refactored to stop relying on that `v5` functionality which includes:

### Changes to `import` paths

The recommendation for TypeScript developers is to use [`rxjs-tslint`](https://github.com/reactivex/rxjs-tslint) to refactor `import` paths.

The following rules have been designed by the RxJS team to help JavaScript developers refactor `import` paths:

* `rxjs`: Contains creation methods, types, schedulers, and utilities.

```javascript
import { Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs';
```

* `rxjs/operators`: Contains all pipeable operators.

```javascript
import { map, filter, scan } from 'rxjs/operators';
```

* `rxjs/webSocket`: Contains the web socket subject implementation.

```javascript
import { webSocket } from 'rxjs/webSocket';
```

* `rxjs/ajax`: Contains the Rx ajax implementation.

```javascript
import { ajax } from 'rxjs/ajax';
```

* `rxjs/testing`: Contains the testing utilities for RxJS.

```javascript
import { TestScheduler } from 'rxjs/testing';
```

<blockquote class="twitter-tweet" data-conversation="none" data-lang="en"><p lang="en" dir="ltr">Have you tried updating your app using rxjs-tslint?</p>&mdash; Ben Lesh 🛋️👑🔥 (@BenLesh) <a href="https://twitter.com/BenLesh/status/989268922556862464?ref_src=twsrc%5Etfw">April 25, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>


### Use Piping Instead of Chaining

Use piping instead of chaining as new operator syntax. The result of one operator is piped into another operator.

Don't remove `rxjs-compat` until you have refactored all chained operators into piped operators. If you are a TypeScript user, `ts-lint` can automate this refactoring to some extent for well-typed code.

During [ng-conf 2018](https://www.ng-conf.org/sessions/introducing-rxjs6/), Ben Lesh explained [why we should use pipeable operators](https://youtu.be/JCXZhe6KsxQ?t=2m30s):

<p style="text-align: center;">
  <img src="https://cdn.auth0.com/blog/rxjs6/ng-conf-ben-lesh-rxjs-6.png" alt="Ben Lesh explains why developers should use pipeable operators">
</p>

Follow these steps to reactor your operator chains into pipes:

* Install all operators used from `rxjs/operators`.

 > **Note** Some operators have a name change due to name collisions with JavaScript reserved words! These include: `do` -> `tap`, `catch` -> `catchError`, `switch` -> `switchAll`, `finally` -> `finalize`.

```javascript
import { map, filter, catchError, mergeMap } from 'rxjs/operators';
```

* Attach a [`pipe()`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-pipe) method to the source and wrap all the operators within it. Ensure that the `.` is removed from each operator name and that they are comma-delimited. Remember that some operators need to change their names.

The following is an example of a pipeable refactoring from the release notes:

```javascript
// an operator chain
source
  .map(x => x + x)
  .mergeMap(n => of(n + 1, n + 2)
    .filter(x => x % 1 == 0)
    .scan((acc, x) => acc + x, 0)
  )
  .catch(err => of('error found'))
  .subscribe(printResult);

// must be updated to a pipe flow

source.pipe(
  map(x => x + x),
  mergeMap(n => of(n + 1, n + 2).pipe(
    filter(x => x % 1 == 0),
    scan((acc, x) => acc + x, 0),
  )),
  catchError(err => of('error found')),
).subscribe(printResult);
```

Notice how we use `pipe()` twice in the above code as internal sources are also piped.

### Use Functions instead of Classes

Functions have replaced classes that operate on observables. All [observable classes](https://github.com/ReactiveX/rxjs/tree/5.5.8/src/observable) have been removed. Their functionality is replaced by existing operators, new operators, or functions. Each of their replacement has the same functionality that each class had.

For example:

```javascript
// removed
ArrayObservable.create(myArray)

// use instead

from(myArray)

// you may also use

new operator fromArray().
```

For a complete list of the `v6` creation functions that replace `v5` classes, please visit the [RxJS documentation](https://github.com/ReactiveX/rxjs).

**Special case:**

* [`ConnectableObservable`](https://github.com/ReactiveX/rxjs/blob/master/src/internal/observable/ConnectableObservable.ts) is hidden from direct use in `v6`. To access it, use the operators [`multicast`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-multicast), [`publish`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-publish), [`publishReplay`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-publishReplay), [`publishLast`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-publishLast).
* [`SubscribeOnObservable`](https://github.com/ReactiveX/rxjs/blob/master/spec/observables/SubscribeOnObservable-spec.ts) is hidden from direct use in `v6`. To access it, use the operator [`subscribeOn`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-subscribeOn).


### Removing resultSelector

Result selectors are a RxJS feature that is not widely used and in some cases wasn't even documented. However, result selectors did bloat the codebase significantly; thus, the RxJS team decided to deprecate or remove them.

For developers making use of result selectors, they would need to replace the `resultSelector` parameter with external result-selection code.

For two functions, [`first()`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-first) and [`last()`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-last) these parameters have been removed and must be updated before removing `rxjs-compat`.

For other functions that have `resultSelector` as a parameter, such as mapping operators, this parameter has been deprecated and their implementation has been re-written in a much more compact form. If you remove `rxjs-compat`, these function will continue to work; however, the RxJS team states that they must be removed before the `v7` release.

For more details on this rare implementation, please visit the [RxJS documentation](https://github.com/ReactiveX/rxjs).


## Other RxJS 6 Deprecations

### `Observable.if`  and `Observable.throw`.

[`Observable.if`](http://reactivex.io/rxjs/file/es6/observable/if.js.html) has been replaced by [`iif()`](https://github.com/ReactiveX/rxjs/blob/master/src/internal/observable/iif.ts) and [`Observable.throw`](http://reactivex.io/rxjs/file/es6/observable/throw.js.html) is now [`throwError()`](https://github.com/ReactiveX/rxjs/blob/master/src/internal/observable/throwError.ts). You can use `rxjs-tslint` to convert these deprecated `Observable` method calls into function calls.

The release notes gives us the following example:

#### Observable.if > iif()

```javascript
// deprecated
Observable.if(test, a$, b$);

// use instead

iif(test, a$, b$);
```

#### Observable.error > throwError()

```javascript
// deprecated
Observable.throw(new Error());

//use instead

throwError(new Error());
```

### Deprecated Methods

According to the migration guide, other methods have been deprecated and refactored:


**merge**

```javascript
import { merge } from 'rxjs/operators';
a$.pipe(merge(b$, c$));

// becomes

import { merge } from 'rxjs';
merge(a$, b$, c$);
```

**concat**

```javascript
import { concat } from 'rxjs/operators';
a$.pipe(concat(b$, c$));

// becomes

import { concat } from 'rxjs';
concat(a$, b$, c$);
```

**combineLatest**

```javascript
import { combineLatest } from 'rxjs/operators';
a$.pipe(combineLatest(b$, c$));

// becomes

import { combineLatest } from 'rxjs';
combineLatest(a$, b$, c$);
```

**race**

```javascript
import { race } from 'rxjs/operators';
a$.pipe(race(b$, c$));

// becomes

import { race } from 'rxjs';
race(a$, b$, c$);
```

**zip**

```javascript
import { zip } from 'rxjs/operators';
a$.pipe(zip(b$, c$));

// becomes

import { zip } from 'rxjs';
zip(a$, b$, c$);
```

## Recap

RxJS 6 brings some breaking changes but they are mitigated by the addition of the `rxjs-compat` package that allows you to gradually migrate while keeping your `v5` code operational. For TypeScript users, which cover the majority of Angular developers, `tslint` offers a great deal of automated refactoring to make the transition even easier.

As always, any upgrades and code changes may invite bugs into the codebase or even make elusive ones resurface. Solid testing practices should always be in place to ensure that your users keep receiving the same quality experience that you were providing them when `v5` was part of your codebase.

Watch the complete introduction to RxJS 6 by Ben Lesh:

<p style="text-align: center;">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/JCXZhe6KsxQ?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
</p>


{% include asides/about-auth0.markdown %}
