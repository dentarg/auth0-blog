---
layout: post
title: "Redux: A Practical Tutorial"
description: "A practical tutorial that teaches Redux through examples."
date: 2017-11-28 13:05
category: Technical Guide, JavaScript, Redux
author:
  name: "Bruno Krebs"
  url: "https://twitter.com/brunoskrebs"
  mail: "bruno.krebs@auth0.com"
  avatar: "https://www.gravatar.com/avatar/76ea40cbf67675babe924eecf167b9b8?s=60"
design:
  bg_color: "#461A8D"
  image: https://cdn.auth0.com/blog/redux-tutorial/logo.png
tags:
- redux
- node
- javascript
- react
related:
- 2017-11-16-spring-5-embedded-tomcat-8-gradle-tutorial
- 2017-02-21-reactjs-authentication-tutorial
- 2017-10-26-whats-new-in-react16
---

**TL;DR:** Actually, the idea is to create an article that is not too long at all (TL;DR stands for _Too Long; Didn't Read_ 😊). However, to summarize in a few words, the idea here is to show through practical, short examples how Redux works and what are its main pieces. To find the final code that we are going to create in this article, please check [this GitHub repository](https://github.com/auth0-blog/redux-in-action).

## What is Redux

Mostly used with React, Redux is a _storage facility_ that helps JavaScript applications to _manage state_. Note that I started the introductory sentence with "Mostly used". What I mean is that we do not have to use Redux with React. We don't even need a browser to use Redux. We can use it to control the state of a Node.js backend application, for example.

The biggest advantage of Redux is that this facility works as the single source of truth for our data. That is, whenever we want to know the state of our application, we have to look into a single place, the Redux Store. Another advantage of Redux, as we will see in the next section, is that to manage the state, we have only to deal with simple objects and pure functions. Redux does not rely on fancy, extensive APIs. It is quite the opposite actually.

{% include tweet_quote.html quote_text="Redux is as simple as it gets." %}

## Learning Redux

To learn how to properly use Redux, we have to understand three basic concepts of this library. The first one is called _store_. When using Redux to manage our state, we let it keep an updated version of this state in the store. This is the main purpose of this piece of Redux. The store exists to hold (store) the current state of our data and to become the single source of truth.

The second concept is called _reducer_. Reducer is nothing but a [pure function](https://auth0.com/blog/glossary-of-modern-javascript-concepts/#purity) that gets our app's current state and generates a new state based on an _action_. Actions are the third concept that we are interested in. To define an action to be applied to our state, we simply create an object with a `type` and any arbitrary number (`0..N`) of properties.

![Redux data flow.µ](https://cdn.auth0.com/blog/redux-tutorial/redux-graph.png)

For example, we can have as the current state a simple JavaScript object that contains a person’s name. To change this state (object), we use a reducer that, based on an action, updates the person with arbitrary data. The following code snippet illustrates these concepts.

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

Although simple, the code snippet used above shows another concept that is quite important when using Redux. The state **does not** change. What happens is that we have to generate a new state (or return the same) when using Redux. The pros of creating new states instead of updating the current one is that, by following this paradigm, we enable [traceability](https://en.wikipedia.org/wiki/Traceability) in our application's state. By enabling traceability, we also enable other great features like the possibility to [time travel](https://github.com/gaearon/redux-devtools).

After understanding these three concepts (well, four with state immutability), we are ready to start using Redux in practice. In the following sections, we are going to create a small Node.js script that uses Redux to manage state.

## Using Redux

You might have noticed that we haven't used Redux in the previous section. A great characteristic of Redux is that it relies on simple concepts and structures. As we will see, introducing Redux to manage states in apps is easy. The Redux library itself is quite small, have a great performance, and is really intuitive.

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

These commands will give us a brand new project with the basic structure that we will need. To makes our lives easier and before proceeding with the next steps, let's open this project on an IDE (like WebStorm or Visual Studio Code).

### Creating Redux Actions

Now, let's open the `src/actions.js` file and add the following action creators and action types to it:

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

These action creators are quite simple. They simply returns objects that contain `type`, to indicate if it is a removal or an addition, and an `expense` as the payload. We won't invest time creating automated tests to these action creators, as they are trivial.

### Creating Redux Reducers

We are going to add the business logic of our tutorial app in the reducer that we are going to create in this section. This reducer will have a `switch` statement that, based on an action, will trigger the proper function to generate the new state. Let's open the `src/reducers.js` file and add the following reducer definition to it:

```js
import {ADD_EXPENSE, REMOVE_EXPENSE} from "./actions";

export default expenses;

export const initialState = {
    expenses: [],
    balance: 0
};

function expenses(state = initialState, action = {}) {
    switch (action.type) {
        case ADD_EXPENSE:
            return addExpense(state, action.expense);
        case REMOVE_EXPENSE:
            return removeExpense(state, action.expense);
        default:
            return state;
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
    const persistedExpense = state.expenses.find(item => item.id === expense.id);
    return {
        ...state,
        expenses: state.expenses.filter(item => item.id !== expense.id),
        balance: state.balance - persistedExpense.amount
    }
}
```

To decide exactly what function to call (`addExpense` or `removeExpense`), the reducer created by this file (`expenses`) compares the `action.type` with both `ADD_EXPENSE` and `REMOVE_EXPENSE` constants. After identifying the correct type, it triggers the proper function passing the current `state` of the application and the `expense` in question.

### Testing Redux Reducers with Jest

It is easy to create an automated test to validate the behavior of this reducer. As reducers are pure functions, we don't need to mock anything. We just need to generate some samples of expenses and actions, trigger our reducer with them, and check the generated output. Let's install the [`jest`](https://facebook.github.io/jest/) test runner and [`babel`](https://babeljs.io/) to help us testing the reducer.

```bash
npm i -D jest babel-jest babel-preset-es2015
```

Also, let's update the `scripts` property in the `package.json` file so we can easily run `jest`:

```js
{
  // ...
  "scripts": {
    "test": "jest",
    "test:watch": "npm test -- --watch"
  }
  // ...
}
```

With these scripts in place, we can create the test suite that will validate the `expenses` reducer. Let's create a file called `reducers.test.js` alongside with `reducers.js` and define two tests in a new test suite, as follows:

```js
import {addExpense, removeExpense} from './actions';
import expenses, {initialState} from './reducers';

describe('reducers', () => {
    it('should be able to add expenses', () => {
        const stateStep1 = expenses(initialState, addExpense({
            id: 1,
            amount: 20
        }));
        expect(stateStep1.expenses.length).toEqual(1);
        expect(stateStep1.balance).toEqual(20);

        const stateStep2 = expenses(stateStep1, addExpense({
            id: 2,
            amount: 10
        }));
        expect(stateStep2.expenses.length).toEqual(2);
        expect(stateStep2.balance).toEqual(30);
    });

    it('should be able to remove expenses', () => {
        const stateStep1 = expenses(initialState, addExpense({
            id: 1,
            amount: 55
        }));
        expect(stateStep1.expenses.length).toEqual(1);
        expect(stateStep1.balance).toEqual(55);

        const stateStep2 = expenses(stateStep1, addExpense({
            id: 2,
            amount: 36
        }));
        expect(stateStep2.expenses.length).toEqual(2);
        expect(stateStep2.balance).toEqual(91);

        const stateStep3 = expenses(stateStep2, removeExpense({
            id: 1
        }));
        expect(stateStep3.expenses.length).toEqual(1);
        expect(stateStep3.balance).toEqual(36);
    });

    it('should return the default state', () => {
        expect(expenses()).toEqual(initialState);
    });
});
```

The test suite and its tests are a little bit verbose, but they are easy to understand. We start by importing the `addExpense` and `removeExpense` action creators. After that, we import the `expenses` reducer from its source alongside with the `initialState`. Lastly, we use the `describe` function to define the test suite and the `it` function to create three tests.

The first two tests are pretty similar. Therefore, let's analyze the first one to understand how they work. The first step executed by this test calls the `expenses` reducer passing to it the `initialState` and the `addExpense` action creator. As the parameter of this action creator, we pass an expense with `id = 1` and `amount = 20`. We then check if the result of the `expenses` execution, the `stateStep1`, contains a single expense and if the `balance` is equal 20. After that, we execute a similar process that validates if the `expenses` reducer accepts a new expense and updates the `balance` accordingly. The difference in the second test is that, after adding two expenses, we use the reducer to remove an expense.

Let's run the `npm test` command to verify our implementation. If we followed the steps above correctly, we should get an output similar this:

```
> redux-node@1.0.0 test /Users/brunokrebs/git/tmp/redux-node
> jest

 PASS  src/reducers.test.js
  reducers
    ✓ should be able to add expenses (3ms)
    ✓ should be able to remove expenses (1ms)
    ✓ should return the default state

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        0.834s, estimated 1s
Ran all test suites.
```

### Defining a Redux Store

So far, we haven't used the central piece of Redux, the Redux Store. We have only defined two functions to create Redux Actions and a Redux Reducer. Now it's time to create a Redux Store and put our reducer and our action creators to work.

As we want to use modern JavaScript code, let's install `babel-cli` and a plugin:

```bash
npm i -D babel-cli babel-plugin-transform-object-rest-spread
```

The plugin simply guarantees that we can use the spread operator with Babel. After installing both dependencies, let's open the `index.js` file and add the following code:

```js
import {createStore} from 'redux';
import {addExpense, removeExpense} from './actions';
import expenses from './reducers';

const store = createStore(expenses);

store.dispatch(addExpense({
    id: 1,
    amount: 45
}));

store.dispatch(addExpense({
    id: 2,
    amount: 20
}));

store.dispatch(addExpense({
    id: 3,
    amount: 30
}));

store.dispatch(removeExpense({
    id: 2
}));

console.assert(store.getState().balance === 75);
console.assert(store.getState().expenses.length === 2);
```

Pretty simple, right? To create a Redux Store, all we had to do was to import the `createStore` function from Redux and call it passing our reducer. Interacting with the store was not hard either. After importing the action creators, we simply called the `dispatch` function of the store, passing to it actions created by our action creators (`addExpense` and `removeExpense`).

In the end, to verify that the store ended up in the correct state, we added two `console.assert` calls. The first one showed that the `balance` is indeed 75, and the second one guaranteed that we finished with two expenses in the last state.

To run our code, we need to use the [`babel-node`](https://babeljs.io/docs/usage/cli/#babel-node) command provided by Babel. To easily run this command, let's edit the `package.json` file and add the following record to the `script` property:

```js
{
  // ...
  "scripts": {
    "start": "babel-node src/",
    // ...
  },
  // ...
}
```

After that, we can simply issue `npm start` and we will see Babel run our code and assert that we get the expected state.

{% include tweet_quote.html quote_text="I just finished a Redux tutorial." %}

{% include asides/javascript-at-auth0.markdown %}

## Conclusion

As we can see, Redux is an easy technology to reason about. Although not hard, correctly understanding its three main pieces (the store, reducers, and actions) is important before we move to other topics, like integrating with front-end frameworks. However, once we learn Redux's concepts, we can integrate it with, for example, React to get a great foundation for modern Single Page Apps.

By the way, in our blog we have an article that shows how to properly [secure React and Redux Apps with JWTs](https://auth0.com/blog/secure-your-react-and-redux-app-with-jwt-authentication/). Take a look at it if you are going to use these technologies in your next project.
