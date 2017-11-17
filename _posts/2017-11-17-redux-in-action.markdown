---
layout: post
title: "Redux in Action"
description: "A practical tutorial that teaches Redux through examples."
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

**TL;DR:** Actually, the idea is to create an article that is not too long at all (TL;DR stands for _Too Long; Didn't Read_ 😊). However, to summarize it in a few words, the idea here is to show through practical, short examples how Redux works and what are its main concepts. To find the code that we are going to create throughout the article, please check [this GitHub repository](https://github.com/auth0-blog/redux-in-action).

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

## Using Redux

You might have noticed that we haven't used Redux in the previous section. A great characteristic of Redux is that it relies on simple concepts and structures. As we will see, introducing Redux to manage states in apps is easy. The Redux library itself is quite small, performatic, and intuitive.

To keep things organized, let's create a new Node.js project, and add actions and reducers to it. In a terminal, let's issue the following commands:

```bash
# create a dir to our project
mkdir redux-node

# change working directory to it
cd redux-node

# initialize the directory as a NPM project
npm init -y

# create the source folder
mkdir src

# create files for the main app, actions, and reducers
touch src/index.js src/actions.js src/reducers.js
```

These commands will give us a brand new project with the basic structure that we will need. To makes our lives easier and before proceeding with the next steps, let's open this project on an IDE (like WebStorm and Visual Studio Code).

### Creating Redux Actions

Now, let's open the `src/actions.js` file and add the following action creators and action types:

```js
// action types
export const ADD_EXPENSE = 'ADD_EXPENSE';
export const REMOVE_EXPENSE = 'REMOVE_EXPENSE';

// action creators
export const addExpense = expense => ({
    type: ADD_EXPENSE,
    expense
});

export const removeExpense = expense => ({
    type: REMOVE_EXPENSE,
    expense
});
```

These action creators are quite simple. They simply returns objects that contain a `type`, to indicate if it is a removal or an addition, and an `expense` as the payload. We won't invest time creating automated tests to these action creators, as they are trivial.

### Creating Redux Reducers

We are going to add the business logic of our tutorial app in the reducer that we are going to create in this section. This reducer will have a `switch` statement that, based on an action, will trigger the proper function to generate a new state. Let's open the `src/reducers.js` file and add the following reducer definition to it:

```js
import {ADD_EXPENSE, REMOVE_EXPENSE} from "./actions";

export default expenses;

export const initialState = {
    expenses: [],
    balance: 0
};

function expenses(state = initialState, action) {
    switch (action.type) {
        case ADD_EXPENSE:
            return addExpense(state, action.expense);
        case REMOVE_EXPENSE:
            return removeExpense(state, action.expense);
    }
}

function addExpense(state, expense) {
    return {
        ...state,
        expenses: [...state.expenses, expense],
        balance: state.balance + expense.amount
    }
}

function removeExpense(state, expense) {
    const expenseIndex = state.expenses.findIndex(item => item.id === expense.id);
    const expenseAmount = state.expenses[expenseIndex].amount;
    return {
        ...state,
        expenses: state.expenses.filter(item => item.id !== expense.id),
        balance: state.balance - expenseAmount
    }
}
```

To decide exactly what function to call (`addExpense` or `removeExpense`), the reducer created by this file (`expenses`) compares the `action.type` with both `ADD_EXPENSE` and `REMOVE_EXPENSE` constants. After identifying the correct function, it triggers this function passing the current `state` of the application and the `expense` in question.

Creating an automated test to validate the behavior of this reducer is easy. As reducers are pure functions, we don't need to mock anything. We just need to generate some expenses and actions samples, trigger our reducer with them, and check the output generated.
