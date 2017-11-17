---
layout: post
title: "Redux in Action"
description: "Let's learn about Redux through practical examples."
date: 2017-11-17 13:05
category: Technical Guide, JavaScript, Redux
author:
  name: "Bruno Krebs"
  url: "https://twitter.com/brunoskrebs"
  mail: "bruno.krebs@auth0.com"
  avatar: "https://www.gravatar.com/avatar/76ea40cbf67675babe924eecf167b9b8?s=60"
design:
  bg_color: "rgb(25, 25, 25)"
  image: https://cdn.auth0.com/blog/react-js/react.png
  image_size: "80%"
  image_bg_color: "rgb(25, 25, 25)"
tags:
- redux
- node
- javascript
related:
- 2017-11-16-spring-5-embedded-tomcat-8-gradle-tutorial
---

## What is Redux

Mostly used with React, Redux is storage facility that helps JavaScript applications to manage state. Note that I started the introductory sentence with "Mostly used". What I mean is that we do not have to use Redux with React. We don't even need a browser to use Redux. We can use it to control the state of a Node.js backend application, for example.

To learn how to properly use Redux, we have to understand three basic concepts of this library. The first one is called _store_. When using Redux to manage our state, we let it keep an updated version of this state in the store. This is the main purpose of this piece of Redux. The store exists to hold (store) the current state of our data and to become the single source of truth.

The second concept is called _reducer_. Reducer is nothing but a [pure function](https://auth0.com/blog/glossary-of-modern-javascript-concepts/#purity) that gets our app's current state and generates a new state based on an _action_. Actions are the third concept that we are interested in. To define an action to be applied to our state, we simply create an object with a `type` and any arbitrary number (`0..N`) of properties.

For example, we can have as the current state an object with a person’s name and a reducer that, based on an action, updates the person with a birthday. The following code snippet illustrates the interaction among all three concepts.

```js
const BIRTHDAY_UPDATE = 'BIRTHDAY_UPDATE';
const initialState = {name: 'Bruno Krebs'};

function reducer(state, action) {
    const { birthday } = action;
    switch (action.type) {
        case BIRTHDAY_UPDATE:
            return {
                ...state,
                birthday
            };
        default:
            return state;
    }
}

const updateAction = {
    type: BIRTHDAY_UPDATE,
    birthday: new Date(1984, 10, 20)
};

const newState = reducer(initialState, updateAction);

console.assert(initialState.birthday === undefined, 'Initial state must not be changed');

console.assert(
    newState.birthday !== undefined &&
    newState.birthday.getTime() === new Date(1984, 10, 20).getTime(),
    'New state must contain 1984/10/20 as the birthday'
);
```

> Note that the [spread operator (`…state`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator) used in the example above is a feature recently introduced to JavaScript and might not be available on all environments. For example, it is [not available on Node.js prior to version `8.2.1`](http://node.green/). Therefore, we must have a Node.js newer than `8.2.1` or we need to run this in a browser compatible with this feature.

In the snippet exhibited, we can see that we use the `initialState` to generate a `newState`. This new state is the product of calling the `reducer` function with the `updateAction` object and the `initialState`. After passing the state and the action to the reducer, we get a new state where we can still find the name of the person, and the new `birthday` property correctly applied.

Although simple, the code snippet used above shows another concept that is quite important when using Redux. The state **does not** change. What happens is that we have to generate a new state (or return the same) when using Redux. The pros of creating new states instead of updating the current one is that, by following this paradigm, we enable [traceability](https://en.wikipedia.org/wiki/Traceability) in our application's state. By enabling traceability in our app, we also enable other great features like the possibility to [time travel](https://github.com/gaearon/redux-devtools).

Understanding this three concepts (four with state immutability), we are ready to start using Redux in practice. In the following sections, we are going to create a small web API, based on Node.js and Express, that takes advantage of Redux and the [Redux DevTools](https://github.com/gaearon/redux-devtools) to manage state and allow time traveling. In the last section, we are going to take a brief look at how to use Redux with React (they are such good friends:)).
