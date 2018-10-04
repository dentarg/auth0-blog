---
layout: post
title: "Logging &amp; Debugging in React with Flux: Replaying your user’s actions"
description: "Making it easy to reproduce end-user issues and bugs with Flux."
date: 2015-08-25 09:00
alias: /2015/08/25/logging-and-debugging-in-react-with-flux-replaying-your-users-actions/
category: Technical Guide, Frontend, React
author:
  name: Sandrino Di Mattia
  url: https://twitter.com/sandrinodm
  mail: sandrino@auth0.com
  avatar: https://secure.gravatar.com/avatar/e8a46264ec428f6b37018e1b962b893a?s=200
design:
  bg_color: "rgb(25, 25, 25)"
  bg_merge: true
  image: https://cdn.auth0.com/blog/react-js/react.png
  image_size: "80%"
  image_bg_color: "rgb(25, 25, 25)"
tags:
- react
- flux
- debug
- logging
- store
- action
- dispatcher
- webpack
- bug
- issue
- user
- troubleshooting
related:
- 2016-04-15-angularjs-authentication-screencast-series-part-1
- 2016-01-04-secure-your-react-and-redux-app-with-jwt-authentication
- 2015-06-26-auth0-ember-simple-auth
---
---

**TL;DR**: You can check out the sample application in [this Github repository](https://github.com/auth0/react-flux-debug-actions-sample)

---

Troubleshooting applications running in production is not always easy. You might get bug reports like "Nothing works!" In addition, some errors might only occur based on the data that the user is working with, and reproducing the issue could be challenging because of specific dependencies (e.g., user, API) … the list goes on and on!

There are plenty of tools available out there that can catch any errors with a stack trace and very detailed information, but even then the error might be hard to reproduce.

In this blog post, we'll show how you can leverage your existing React and Flux infrastructure in order to have a better logging and debugging experience.

## Example: Customer Service Application

The example in this blog post is a customer service application that allows you to manage open tickets. You can view the open tickets and close tickets that have been resolved.

<img src="https://cdn.auth0.com/blog/react-flux-debugging/react-flux-debugging-tickets.png" class="expand" />

John, an end user, is solving the open tickets and closing them one by one. But suddenly... a crash! So John goes ahead and opens a bug: "Nothing works!"

<img src="https://cdn.auth0.com/blog/react-flux-debugging/react-flux-debugging-end-user.gif" class="expand" />

Jane, a developer, is now assigned to work on the "Nothing works!" bug. Great. Luckily, their application is recording all Flux actions executed by users. These actions are linked to a user's session, so she can just go ahead and look for John's session. After that, she can replay John's session and try to figure out the problem.

<img src="https://cdn.auth0.com/blog/react-flux-debugging/react-flux-debugging-developer.gif" class="expand" />

Aha! While replaying John's session, an error pops up in the developer console. It looks like there might be a bug in the `Error.jsx` component.

## How does this work?

Implementing this in your own Flux applications is really easy. In our blog post about [ReactJS authentication](https://auth0.com/blog/2015/04/09/adding-authentication-to-your-react-flux-app/) using Flux, we explain what a typical Flux application looks like. Actions are dispatched to stores, and stores will notify components to update themselves. So if we want to keep track of all actions, we'll need to start with the dispatcher:

```javascript
import Dispatcher from './dispatcher';
import LogActions from './actions/LogActions';

// Export the dispatch method.
export default function dispatch(action) {
  Dispatcher.dispatch(action);
  LogActions.log(action);
}
```

{% include tweet_quote.html quote_text="Actions are dispatched to stores, and stores will notify components to update themselves." %}

The `dispatch` method we're exposing here will forward the action to the dispatcher, but after that, it will forward the data to `LogActions.log`. This method will then send the action to our back-end:

```javascript
import httpClient from '../httpClient';
import LoginStore from '../stores/LoginStore'

export default {
  log: (action) => {
    console.log('Action:', action);

    if (LoginStore.sessionId && !action.debug) {
      httpClient.post(null, { url: `/sessions/${LoginStore.sessionId}/logs`, data: action }).catch(err => {
        console.log('Error sending log:', err);
      });
    }
  }
};
```

The message will first be logged to the console. This could be something you want to activate for your non-production builds. Then, if the user is logged in and it's not a "debug action", the data is posted to the back-end.

When we replay actions in a troubleshooting session, we'll mark these as "debug actions" to make sure that these actions are not sent to the server again.

And that's basically it. Our backend will store all actions in a "session" in chronological order. Then a developer might choose to replay a session:

```javascript
debugSession: (session, untilAction) => {
  console.log('Debugging session:', session);

  dispatch({ debug: true, actionType: RESET });
  dispatch({ debug: true, actionType: START_DEBUG });

  // Replay all actions with a delay.
  for (var i = 0; i < session.actions.length; i++) {
    let action = session.actions[i];

    setTimeout(() => {
      console.log(' > Dispatching debug action:', action);
      dispatch({
        ...action,
        debug: true
      });
    }, i * 250);

    if (untilAction && untilAction === action) {
      break;
    }
  }

  dispatch({ debug: true, actionType: STOP_DEBUG });
}
```

When replaying a session, we'll first dispatch the `RESET` and the `START_DEBUG` actions. The `RESET` action can be handled by all stores to reset their state (clear all data, clear alerts, etc.).

The `START_DEBUG` action tells the rest of the applications that we are now going to replay certain actions. This is very important because one thing we'll want to avoid is our application making calls to the API. So our HttpClient will not be making calls during this time (in the next section, we'll explain how this works and how we're leveraging Flux to record every request and every response so we can replay everything later without requiring interaction with the API).

Then we go over each action and dispatch it, after which we introduce a small delay. As a result, the developer will see every action that is replayed (in fast-forward, as the delay is always 250ms). And finally, the `STOP_DEBUG` action is sent to notify that we're done replaying the actions, which re-enables the HttpClient.

## Improving our API calls

When Jane was debugging John's session, we immediately noticed a bug in one of our components, so this approach is good to catch runtime errors. But what about API calls? When replaying the actions, the HttpClient will not be making any calls to our API, so how can we effectively replay and troubleshoot API calls? Well, we'll just need to dispatch an action each time we want to make a request, each time we get a successful response, and each time the API returns an error.

Here's what this could look like when we're making the request:

```javascript
{
  actionType: 'LOAD_OPEN_TICKETS',
  user: 'sandrino',
  sort: 'date'
}
```

When the request is successfully executed, we can dispatch the result.

```javascript
{
  actionType: 'LOAD_OPEN_TICKETS_SUCCESS',
  tickets: [...]
}
```

And in the case that something goes wrong, we will also dispatch this action with the actual error message:

```javascript
{
  actionType: 'LOAD_OPEN_TICKETS_FAILED',
  err: {
   message: 'The user "sandrino" has been disabled. You cannot load tickets for this user.'
  }
}
```

Frameworks like `redux` support concepts like middleware, which make it much easier to implement this in a generic way, but we'll just create a wrapper around a library like `axios` or `superagent` that handles this for us:

```javascript
class HttpClient {

  get(action, options) {
    var request = superagent.get(`${BASE_URL}${options.url}`);
    if (options.query) {
      request = request.query(options.query);
    }

    return this._execute(action, request);
  }

  post(action, options) {
    var request = superagent.post(`${BASE_URL}${options.url}`);
    if (options.data) {
      request = request.send(options.data);
    }

    return this._execute(action, request);
  }

  _execute(action, request) {
    if (debug.isActive) {
      console.log('Debug mode active - not executing Http Request:', request);
      return;
    }

    return new Promise((resolve, reject) => {
      request.end((err, res) => {
        if (err) {
          dispatch({ actionType: action + '_FAILED', err: err });
          return reject(err);
        }

        dispatch({ actionType: action + '_SUCCESS', res: res });
        return resolve(res);
      });
    });
  }
}

export default new HttpClient();
```

This class will dispatch `YOUR_ACTION` before the call is made to the API. Then, it will dispatch `YOUR_ACTION_SUCCESS` when the request has been executed or `YOUR_ACTION_FAILED` in the event of an error. This means that every request and response is dispatched and also being logged to our back-end. Thus, we can easily replay all actions, including the data returned by possible API calls, without having to interact with the actual API. This is useful if you need to reproduce an issue that occurred a few days ago for which the data might no longer exist or might have changed.

## Trying it out

The complete source of this application is available on GitHub: [https://github.com/auth0/react-flux-debug-actions-sample](https://github.com/auth0/react-flux-debug-actions-sample). Follow the instructions here to start the front-end and the back-end.

Happy troubleshooting!
