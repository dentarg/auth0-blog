---
layout: post
title: "Reactive Programming in Python"
description: "Learn how to use reactive programming in Python to process data streams asynchronously."
longdescription: "Let's learn how to use reactive programming in Python to create asynchronous and event-based programs by implementing observables, observers/subscribers, and subjects. We will start by getting our data stream from the GitHub with a Tornado web socket and then we will filter and process it asynchronously."
date: "2018-01-25 08:30"
author:
  name: "Valery Calderon"
  url: "https://twitter.com/valerybriz"
  mail: "valerybriz@gmail.com"
  avatar: "https://twitter.com/valerybriz/profile_image?size=original"
design:
  bg_color: "#4A4A4A"
  image: https://cdn.auth0.com/blog/python-restful/logo.png
tags:
- python
- reactive
- programming
- reactive-programming
- rxpy
- functional
- github
- tornado
related:
- 2017-09-28-developing-restful-apis-with-python-and-flask
- 2017-04-20-image-processing-in-python-with-pillow
- 2017-12-06-mocking-api-calls-in-python
---

**TL;DR:** In this tutorial, we’ll be learning how to use the [RxPy](https://rxpy.codeplex.com/) library to create asynchronous and event-based programs by implementing observables, observers/subscribers, and subjects. We will start by getting our data stream from the [GitHub API](https://developer.github.com/v3/) with a [Tornado](http://www.tornadoweb.org) web socket and then we will filter and process it asynchronously. [In this GitHub repository](https://github.com/valerybriz/RxGithubSearcher), you can find the code that we are going to create in this tutorial.

## Why Reactive Programming?

In a way, reactive programming isn't a new thing. Our typical click events are an asynchronous data stream which we can observe and trigger actions from it. That's how it works, but Reactive Programming makes things so much easier by adding a toolbox of operators to filter, create, transform, and unify any of those streams. In just a few lines of maintainable code, we can have web sockets that receive multiple requests and handle them on an asynchronous process that serves a filtered output.

Web applications contain lots of database operations, network calls, nested callbacks, and other computationally expensive tasks that might take a long time to complete (or even block other threads until it's done). This is where Reactive Programming enters, it gives us the facility to convert almost anything to streams (like variables, properties, user inputs, caches, etc) to manage it asynchronously. Besides that, it also gives us an easy way to handle errors. A task that is usually hard task within asynchronous programming. Reactive Programming makes our code more flexible, readable, maintainable, and easy to write.

{% include tweet_quote.html quote_text="Reactive Programming makes our code more flexible, readable, maintainable, and easy to write." %}

## What Does Reactive Programming Really Means?

The main difference between [Event-Driven programming](https://en.wikipedia.org/wiki/Event-driven_programming) and Reactive Programming is the real trigger of the action. While the Event-Driven programming focuses on handling any event (such as a button click) to trigger the corresponding action, Reactive Programming wraps data into the reactive system as events. This enables us to do things like listening to user inputs as events that trigger actions only if the input changed from the previous one.

{% include tweet_quote.html quote_text="Reactive, in Reactive Programming, means a dynamic reaction to change in streams." %}

Reactive Programming is a programming paradigm oriented around data flows and the propagation of change. This means that, when a data flow is emitted by one component, the Reactive Programming library will automatically propagate those changes to other components until it reaches the final receiver.

## What Does Reactive Programming Works?

Let's take into consideration [ReactiveX](http://reactivex.io/), the most famous implementation of the Reactive Programming paradigm. ReactiveX is mainly based on two classes: the `Observable` and `Observer` classes. The `Observable` class is the source of data streams or events and the `Observer` class is the one that consumes (or reacts to) the emitted elements.

### Observables in Reactive Programming

An `Observable` packs the incoming data so it can be passed from one thread to another. The `Observable` can be configured so it regulates when to supply data. For example, it could be triggered periodically or only once in their life cycle. There are also various functions that can be used to filter or transform the observable so the observer only emits certain data. All this is used instead of callbacks, which means that our code becomes more readable and less fallible.

```python
from rx import Observable, Observer

source = Observable.from_list([1,2,3,4,5,6])
```

It’s common to use `Observables` in a way that it doesn’t give data until some `Observer` subscribes to it. Known as ["call by need"](https://en.wikipedia.org/wiki/Evaluation_strategy#Call_by_need), this is an evaluation strategy which delays the evaluation of an event until its value is needed.

### Observers in Reactive Programming

The `Observer` consumes the data stream emitted by the `Observable`. An `Observable` can have multiple `Observers` so each data item emitted will be received by each `Observer`. The "listening" to the stream is called subscribing. `Observers` subscribe to the `Observable` with the `subscribe()` method to receive the emitted data.

The `Observer` can receive three types of events:

* **on_next()**: when there is an element in the data stream;
* **on_completed()**: when no more items are coming, it implies end of emission.
* **on_error()**: when there is an error thrown from the `Observable` (it also implies end of emission);

```python
class PrintObserver(Observer):

    def on_next(self, value):
        print("Received {0}".format(value))

    def on_completed(self):
        print("Done!")

    def on_error(self, error):
        print("Error Occurred: {0}".format(error))

source.subscribe(PrintObserver())
```

We don't have to specify all three event types in the code. We can choose which events to observe using the named arguments, or simply providing a lambda for the `on_next` function. Typically, in production, we will want to provide an `on_error` handler so errors are explicitly handled by the subscriber.

```python
source = Observable.from_list([1,2,3,4,5,6])

source.subscribe(lambda value: print("Received {0}".format(value)))
```

### Subjects in Reactive Programming

The `Subject` is the `Observable` extension that simultaneously implements the `Observer` interface. That is, `Subjects` acts like both `Observers` and `Observables`. They receive messages about events (like `Observers`) and notify their subscribers (like `Observables`). This implies two things:

* We can subscribe to a `Subject`, just like an `Observ­able`.
* A `Sub­ject` can sub­scribe to other `Observables`.

Therefore, the main dif­fer­ence between a `Sub­ject` and an `Observable` is that all of the `Sub­ject` subscribers share the same action. This means that, when a `Sub­ject` pro­duces data, all of its sub­scribers will receive the same data. This is unlike `Observ­ables`, where each sub­scrip­tion causes an inde­pen­dent exe­cu­tion of the observable.

A `Subscriber` can not only subscribe to an `Observable` but also unsubscribe from it. It is important to remember to unsubscribe from the asynchronous calls. When calling `unsubscribe()`, all the operators unsubscribe from one another in sequence from top to bottom. So we can avoid memory leaks. In the case of the `Subjects`, we will use the `dispose` method which can be thought of as the subscription itself, or perhaps a token representing the subscription. Disposing it will dispose the subscription and also unsubscribe. The unsubscribe call can be placed in the socket `on_close()` method:

```python
def on_close(self):
    self.combine_latest_sbs.dispose()
    print("WebSocket closed")
```

### Data Operators in Reactive Programming

The essence of Reactive Programming is working with streams. As we saw before, we have an `Observable` class that supplies the data stream and an `Observer` which consumes it. But, along the way from the `Observable` to the subscriber, we can apply many `Operators` to the stream. These `Operators` define how and when the `Observables` should emit streams.

Most `Operators` execute a function on an `Observable` and return an `Observable`. So we can apply these operators one after the other, in a chain. Each operator in the chain modifies the `Observable` that results from the operation of the previous operator.

There are plenty of operators available. We will be exploring only the ones that we use for this tutorial. The operators can be classified by categories of their utility as:

* Creating Observables
* Transforming Observables
* Filtering Observables
* Combining Observables
* Error Handling Operators
* Observable Utility Operators
* Conditional and Boolean Operators
* Mathematical and Aggregate Operators
* Connectable Observable Operators

#### **Creating Observables Category**

The `just()` operator, as the name suggests, emits `Observables` with the same values provided in the arguments.

![Just operator marble diagram](https://cdn.auth0.com/blog/rxpy/just.png)

As we can see in the following example, our `Observable` just emits `a`, `b`, `c`, `d` one after another:

```python
Observable.just(a,b,c,d)
```

The `interval()` operator creates an `Observable` that emits a sequence of integers spaced by a given time interval.

![Interval operator marble diagram](https://cdn.auth0.com/blog/rxpy/interval.png)

For example, the following `Observable` refreshes the value every 60 Seconds for periodic updates:

```python
Observable.interval(60000)
```

#### **Filtering Observables Category**

The `filter()` operator emits only those items from an `Observable` that pass a predicate test.

![ Filter operator marble diagram](https://cdn.auth0.com/blog/rxpy/filter.png)

In the following example, we are filtering by the text size so it emits only the strings that exceed a length of 2 characters.

```python
Subject.filter( lambda text: not text or len(text) > 2 )
```

The `throttle_last()` operator emits the most recent items emitted by an `Observable` within periodic time intervals.

![ ThrottleLast operator marble diagram](https://cdn.auth0.com/blog/rxpy/throttlelast.png)

For example, to get the last value in a given time interval we could use RxPy as follows:

```python
Subject.throttle_last( 1000 )
```

#### **Transforming Observables Category**

The `flat_map()` operator transforms the items emitted by an `Observable` into `Observables`, then flatten the emissions from those into a single `Observable`.

![Flat_Map operator marble diagram](https://cdn.auth0.com/blog/rxpy/flat_map.png)

Here we get the repositories information by the user input which is the name of the organization repository. As you can see, we are calling a `from_future()` observable, since we use an asynchronous tornado web socket to request the API information.

```python
Subject.flat_map( lambda name: Observable.from_future(self.get_org_repos(name)) )
```

#### **Observable Utility Operators Category**

The `do_action()` operator registers an action to take upon a variety of `Observable` lifecycle events.

![ Do_action operator marble diagram](https://cdn.auth0.com/blog/rxpy/do_action.png)

Here we call the `send_response` function for each item in the data stream.

```python
Subject.do_action( lambda x: send_response('clear') )
```

#### **Combining Observables Category**

The `combine_latest()` operator combines, when an item is emitted by either of two `Observables`, the latest item emitted by each `Observable` via a specified function and emit items based on the results of this function.

![Combine_lastest operator marble diagram](https://cdn.auth0.com/blog/rxpy/combine_lastest.png)

Here we combine an interval `Observable` which will be sending the last input of the user every 60 seconds and the `input_value` `Observable` itself which will be emitted every time it changes:

```python
user_input.combine_latest( interval_observable, lambda input_value, i: input_value )
```

## Advantages of Reactive Programming

With Reactive Programming, we can raise the level of abstraction of our code so we can focus on the interdependence of events that define the business logic, rather than having to constantly fiddle with a large number of implementation details. With the help of the functional programming, the code will also be more concise.

We can use Reactive Programming to process asynchronous incoming data—perhaps tasks with a lot of user interaction (clicks, gestures, etc.)—or processing system events (sensors, gyroscope, etc.). That is, we can use with all kind of interactions where the events are portrayed as the object states. Such an approach allows better dynamic process description, also simplifying the asynchronous code writing. Finally, we've got better performance in the asynchronous context and the parallel processing of the data streams.

## Building an App with RxPy

First of all, we need to set up our environment by installing all the requirements we need to get our reactive web socket working. To do that in an easier and more organiz
