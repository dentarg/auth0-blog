---
layout: post
title: "Angular 2 Testing In Depth: Services"
description: "Learn how to test services in Angular 2. We will start with setting up the environment and finish with using Dependency Injection."
date: 2016-10-27 08:23
category: Technical Guide, Angular, Angular2
banner:
  text: "Auth0 makes it easy to add authentication to your AngularJS application."
author:
  name: "Gábor Soós"
  url: "https://twitter.com/blacksonic86"
  mail: "soos.gabor86@gmail.com"
  avatar: "https://secure.gravatar.com/avatar/9d2e715baab928f5bedb837bfcb70b2b"
design:
  image: https://cdn.auth0.com/blog/angular/logo.png
  image_size: "75%"
  image_bg_color: "rgb(1, 70, 166)"
  bg_color: "rgb(1, 70, 166)"
  bg_merge: true
tags:
- angular2
- testing
- angular
- typescript
- jasmine
related:
- angular-2-ngmodules
- angular-2-testing-in-depth-http-services
- angular-2-authentication
---

<div class="alert alert-info alert-icon">
  <i class="icon-budicon-664"></i>
  <strong>Get the "Migrating an Angular 1 App to Angular 2 book" for Free.</strong> Spread the word and <a href="https://auth0.com/e-books/migrating-to-angular2">download it now!</a>
</div>

When I started developing and writing tests for Angularjs applications,
everything felt natural. The tools were mature and I easily got used to
developing applications in TDD ([Test-Driven Development](https://en.wikipedia.org/wiki/Test-driven_development)).
It gave me a high level of confidence, knowing that my application was working as I had imagined.
Just after Angular 2 came out and I learned the basics, I knew that the next step was to testing.

This article is the first part of a series in which
I share my experiences testing different building blocks of an Angular 2 application.
We will start with simple use cases and then head for more complex ones.

- Services (this article)
- [Http Services](https://auth0.com/blog/angular-2-testing-in-depth-http-services/)
- Components
- Pipes
- Routing

You may wonder why it is so important to write tests.

<p align="center">
  <img src="https://github.com/blacksonic/articles/raw/master/img/angular2-testing-services/tdd_guilty.png" alt="Angular 2 Testing Driven Development"/>
</p>

With tests, we can ensure the correctness of our application: that the code does what it was designed to do.
We can guard against someone breaking our code by refactoring or
adding new features. This might have happened to you when someone added a small feature
or equivalent code transformations and nothing worked afterwards.
Writing tests can clarify the intention of the code by giving usage examples.
It can also reveal design flaws. When a piece of code is hard to test,
there might be a problem with the underlying architecture.

If you are new to Test-Driven Development, I would recommend reading the Test-Driven Development book by Kent Beck.
It gives a nice overview about the concepts and best practices.

### Choosing the framework to test Angular 2

<p align="center">
  <img src="https://github.com/blacksonic/articles/raw/master/img/angular2-testing-services/jasmine-mocha.png" alt="Angular 2 Testing Framework"/>
</p>

The first thing we have to choose is the framework. The one suggested by Angular 2's core team is
[Jasmine](http://jasmine.github.io/edge/introduction.html).
For a long time it was the only supported testing framework, because test setups were hard wired into the framework.
Thanks to refactoring, now tests can also be written in [Mocha](https://mochajs.org/), or any other framework
that supports the ```beforeEach``` hook. This hook runs before every test run.
If your framework of choice doesn't support it, you have to add the following code snippet to your setup:

```typescript
import { resetFakeAsyncZone, TestBed } from '@angular/core/testing';

beforeEveryTestHook(() => {
  TestBed.resetTestingModule();
  resetFakeAsyncZone();
});
```

The first line within the hook resets the internal state of the Dependency Injection container.
It clears out any given provider or module.
If you are not familiar with Dependency Injection, I would recommend reading the
[official documentation](https://angular.io/docs/ts/latest/guide/dependency-injection.html) about it.

The second one clears out any remaining zone that fakes asynchronous operations like ```setTimeout```.
Detailed articles can be found on the Thoughtram blog about zones:
[Understanding zones](http://blog.thoughtram.io/angular/2016/01/22/understanding-zones.html) and
[Zones in Angular 2](http://blog.thoughtram.io/angular/2016/02/01/zones-in-angular-2.html).

For this series, we will be using Jasmine as the test framework.

### Writing the first Angular 2 test

Let's look at our first service that will be tested.

```typescript
import { Injectable } from '@angular/core';

@Injectable()
export class Engine {
  getHorsepower() {
    return 150;
  }

  getName() {
    return 'Basic engine';
  }
}
```

It has two getter methods and the ```Injectable``` decorator.
The tests will check whether these getter methods work as intended.
The decorator is needed to utilize dependency injection.

In Jasmine, we can group our tests with the ```describe``` method.
Within this method, we can create test cases with the ```it``` function.
It is advised to place one class per file (the service) and group the tests around it (with ```describe```).
We can further group test cases around methods of the class
by placing ```describe``` statements inside the top ```describe``` block.
For now we will only group our tests around the class.

```typescript
import { Engine } from './engine.service';

describe('Engine', () => {
  it('should return it\'s horsepower', () => {
    let subject = new Engine();

    expect(subject.getHorsepower()).toEqual(150);
  });
});
```

In this setup, only plain instantiation is used; we will introduce dependency injection later.
For basic services, plain instantiation can be enough.

We call the ```getHorsepower``` method of the engine and check that it's equal to the expected value.

The first test is green and has been passed. Let's write another one for the ```getName``` method.

```typescript
it('should return it\'s horsepower', () => {
  let subject = new Engine();

  expect(subject.getName()).toEqual('Basic engine');
});
```

If you run the tests, a similar output will be on the terminal.

![Angular 2 First Tests](https://github.com/blacksonic/articles/raw/master/img/angular2-testing-services/first_test_run.png)

Both tests have been passed; it is time to refactor.
There is duplication at the start of each Angular 2 test. Instantiation is exactly the same,
we can move it out into a setup block.

```typescript
describe('Engine', () => {
  let subject: Engine;

  beforeEach(() => {
    subject = new Engine();
  });

  it('should return it\'s horsepower', () => {
    expect(subject.getHorsepower()).toEqual(150);
  });

  it('should return it\'s horsepower', () => {
    expect(subject.getName()).toEqual('Basic engine');
  });
});
```

The ```subject``` variable is declared at the start of the ```describe``` block, and the creation of the service
is moved to the ```beforeEach``` block. This way we don't have to do it manually every time.
It is common to move the creation of the test case subject to a separate method,
because it offloads the tests and makes them more readable.

### Using Dependency Injection

Creating services directly can be good if the subject under test has no or few, dependencies.
But if it has multiple dependencies, or a deeper dependency tree, setting up all the classes becomes tedious.
For these situations, we can use Angular 2's dependency injection management.

The ```Car``` class uses the ```Engine``` class in the constructor and its instance in the ```getName``` method.

```typescript
import { Injectable } from '@angular/core';
import { Engine } from './engine.service';

@Injectable()
export class Car {
  constructor(private engine: Engine) {}

  getName() {
    return `Car with ${this.engine.getName()}(${this.engine.getHorsepower()} HP)`;
  }
}
```

We check for the ```getName``` method's output in the test after we set up the dependency injection container.

```typescript
import { TestBed, inject } from '@angular/core/testing';
import { Engine } from './engine.service';
import { Car } from './car.service';

describe('Car', () => {
  let subject: Car;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Engine, Car]
    });
  });

  beforeEach(inject([Car], (car: Car) => {
    subject = car;
  }));

  it('should display name with engine', () => {
    expect(subject.getName()).toEqual('Car with Basic engine(150 HP)');
  });
});
```

The difference here is that we configure the ```TestBed``` with the provided
services in the ```configureTestingModule``` method.
Only these classes can be instantiated with the ```inject``` method.
If we try to request something else, we get an error saying it is an unknown provider.

![Angular 2 Testing Error](https://github.com/blacksonic/articles/raw/master/img/angular2-testing-services/test_failure_missing_dep.png)

We can request instances of the services in an array from the ```inject``` method.
In the callback, we get the instances in the same order as in the dependency array with the first parameter.
The type hint inside the  callback is only for IDE completion; it also works without it.
In the example, it is placed inside the ```beforeEach``` function, but it can also be added to the ```it``` block.

```typescript
it('should display name with engine', inject([Car], (car: Car) => {
  expect(car.getName()).toEqual('Car with Basic engine(150 HP)');
}));
```

### Mocking

In unit tests for Angular 2, we want to execute the code in isolation.
This means it is not dependent on big, complex objects and is not calling methods that rely on external systems
(like [HTTP calls](https://auth0.com/blog/angular-2-series-part-3-using-http/) or database access).
In these cases, we want to simulate the original behavior while skipping the underlying implementation.

When achieved, it is called mocking.
We don't have to do it manually. Jasmine provides tools to make it work.
Let's assume that the method of the ```Engine``` class has a call through to the server
and we want to mock it.

```typescript
...
beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [Engine, Car]
  });

  spyOn(Engine.prototype, 'getHorsepower').and.returnValue(400);
  spyOn(Engine.prototype, 'getName').and.returnValue('V8 engine');
});

...

it('should display name with engine', () => {
  expect(subject.getName()).toEqual('Car with V8 engine(400 HP)');
});
```

We mock the class methods by calling the ```spyOn``` method on the class's prototype.
We also alter the return value of the function. This way the original method never gets called.
When mocking the prototype, it affects every instance of the class.

### Using Dependency Injection for Mocking

The previous solution for mocking can be achieved also with Angular 2's dependency injection mechanism.
We pass the ```Engine``` class as the provider token, but create the instances with a fake class.

```typescript
@Injectable()
class V8Engine {
  getHorsepower() {
    return 400;
  }

  getName() {
    return 'V8 engine';
  }
}
```

Then we pass this fake class to the setup.

```typescript
beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      { provide: Engine, useClass: V8Engine },
      Car
    ]
  });
});
```

With this setup, the ```inject``` call will return an instance of ```V8Engine``` when asked for ```Engine```.
We can also use ```useFactory``` with a callback, or ```useValue``` with an instance, to accomplish the same result.
The only drawback here is that every method of the class must be implemented and changed
whenever the original class changes.
The original class can be extended optionally in order to override only specific methods.

### Conclusion: What we've learned about Angular 2 Testing

In this tutorial, we managed to:

- create a basic service and write tests for it
- use dependency injection in tests
- fake dependencies with Jasmine
- fake dependencies with dependency injection

If you follow the steps introduced in this article and write tests for your Angular 2 application, you can sleep safe and sound.
The code will work as intended and when someone accidentally breaks it,
the tests will warn him that those changes are unsafe and shouldn't be committed until the tests are green again.

Jasmine will help you along the way with its easy syntax and batteries included (assertion and mocking library).

I hope this has convinced you that writing tests in Angular 2 is not an overly complicated thing.

To make the start even easier, the code is available in
[this GitHub repository](https://github.com/blacksonic/angular2-testing-ground "Angular 2 testing ground").
