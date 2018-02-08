---
layout: post
title: "Developing Games with React, Redux, and SVG - Part 3"
description: "Learn how to make React and Redux control a bunch of SVG elements to create a game."
longdescription: "In this series, you will learn how to make React and Redux control a bunch of SVG elements to create a game. The knowledge acquired throughout this series will also allow you to create other types of animations that are orchestrated by React and Redux, not only games."
date: 2018-02-08 08:30
category: Technical Guide, Frontend, React
author:
  name: "Bruno Krebs"
  url: "https://twitter.com/brunoskrebs"
  mail: "bruno.krebs@gmail.com"
  avatar: "https://twitter.com/brunoskrebs/profile_image?size=original"
design:
  image: https://cdn.auth0.com/blog/react-redux/logo.png
  bg_color: "#222228"
tags:
- react
- redux
- svg
- game
- auth0
- animation
- state
related:
- 2018-02-06-developing-games-with-react-redux-and-svg-part-1.markdown
- 2018-02-08-developing-games-with-react-redux-and-svg-part-2.markdown
- 2017-11-28-redux-practical-tutorial
---

**TL;DR:** In this series, you will learn how to make React and Redux control a bunch of SVG elements to create a game. The knowledge acquired throughout this series will also allow you to create other types of animations that are orchestrated by React and Redux, not only games. You can find the final code developed in this article in the following GitHub repository: [Aliens Go Home - Part 3](https://github.com/auth0-blog/aliens-go-home-part-3)

---

## The React Game: Aliens, Go Home!

The game that you will develop in this series is called *Aliens, Go Home!* The idea of this game is simple, you will have a cannon and will have to kill flying objects that are trying to invade the Earth. To kill these flying objects you will have to point and click on an SVG canvas to make your cannon shoot.

If you are curious, you can find [the final game up and running here](http://bang-bang.digituz.com.br/). But don't play too much, you have work to do!

{% include tweet_quote.html quote_text="I'm creating a game with React, Redux, and SVG elements." %}

## Previously, on Part 1 and Part 2

In [the first part of this series](https://auth0.com/blog/developing-games-with-react-redux-and-svg-part-1/), you have used [`create-react-app`](https://github.com/facebookincubator/create-react-app) to bootstrap your React application and you have installed and configured Redux to manage the game state. After that, you have learned how to use SVG with React components while creating game elements like `Sky`, `Ground`, the `CannonBase`, and the `CannonPipe`. Finally, you added the aiming capability to your cannon by using an event listener and a [JavaScript interval](https://www.w3schools.com/jsref/met_win_setinterval.asp) to trigger a Redux *action* that updates the `CannonPipe` angle.

These actions paved the way to understand how you can create your game (and other animations) with React, Redux, and SVG.

In [the second part](https://auth0.com/blog/developing-games-with-react-redux-and-svg-part-2/), you have created the other elements needed in your game (e.g. `Heart`, `FlyingObject`, and `CannonBall`), enabled your users to start the game, and used CSS animations to make flying objects fly (that's what they do right?).

Although these are awesome features to have, they don't make a complete game yet. You still have to make your cannon shoot cannon balls and implement an algorithm to detect collision between these balls and flying objects. Besides that, you have to increment the `CurrentScore` component when your users kill some aliens.

Killing aliens and seeing the current score increase is cool, but you probably can make this game more attractive. That's why you are going to add a leaderboard feature to your game. This will make your users spend more time trying to reach the top of the leaderboard.

With these features, you can say that you have a complete game. So, without wasting more time, it's time to focus on them.

> **Note:** If, for whatever reason, you don't have the code created in [the first two parts of the series](https://auth0.com/blog/developing-games-with-react-redux-and-svg-part-2/), you can simply clone it from [this GitHub repository](https://github.com/auth0-blog/aliens-go-home-part-2). After cloning it, you will be able to follow the instructions in the sections that follow.

## Implementing the Leaderboard Feature in Your React Game

The first thing you will do to make your game look like a real game is to implement the leaderboard feature. This feature will enable users to sign in, so your game can track their max score and show their rank.

## Integrating React and Auth0

To make Auth0 manage the identity of your users, you have to have an Auth0 account. If you don't have one yet, you can <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">**sign up for a free Auth0 account** here</a>.

After creating your account, you just have to create an [Auth0 Client](https://auth0.com/docs/clients) to represent your game. To do this, head to [the Clients page on the Auth0 dashboard](https://manage.auth0.com/#/clients) and click on the *Create Client* button. The dashboard will show you a form where you will have to inform the *name* of your client and its *type*. You can type *Aliens, Go Home!* as the name and choose the *Single Page Web Application* type (your game is a SPA based on React after all). Then, you can click on *Create*.

![Creating the Auth0 Client to represent your React game.](https://cdn.auth0.com/blog/aliens-go-home/creating-the-auth0-client-for-your-react-game.png)

When you click this button, the dashboard will redirect you to the *Quick Start* tab of your new client. As you will learn how to integrate React and Auth0 in this article, you won't need to use this tab. Instead, you will need to use the *Settings* tab, so head to it.

There are three things that you will need to do in this tab. The first one is to add the `http://localhost:3000` value to the field called *Allowed Callback URLs*. As the dashboard explains, *after the user authenticates, Auth0 will only call back one of the URLs on this field*. So, if you are going to publish your game on the web, be sure to add its public URL there as well (e.g. `http://aliens-go-home.digituz.com.br`).

After inputing all your URLs on this field, hit the *Save* button or press `ctrl` + `s` (if you are using a MacBook, you will need to press `command` + `s` instead).

The last two things you will need to do is to copy the values from the *Domain* and *Client ID* fields. However, before using these values, you will need to code a little.

For starters, you will need to issue the following command in the root directory of your game to install the `auth0-web` package:

```bash
npm i auth0-web
```

As you will see, this package facilitates the integration between Auth0 and SPAs.

The next step is to add a login button in your game, so your users can authenticate via Auth0. To do this, create a new file called `Login.jsx` inside the `./src/components` directory with the following code:

```js
import React from 'react';
import PropTypes from 'prop-types';

const Login = (props) => {
  const button = {
    x: -300, // half width
    y: -600, // minus means up (above 0)
    width: 600,
    height: 300,
    style: {
      fill: 'transparent',
      cursor: 'pointer',
    },
    onClick: props.authenticate,
  };

  const text = {
    textAnchor: 'middle', // center
    x: 0, // center relative to X axis
    y: -440, // 440 up
    style: {
      fontFamily: '"Joti One", cursive',
      fontSize: 45,
      fill: '#e3e3e3',
      cursor: 'pointer',
    },
    onClick: props.authenticate,
  };

  return (
    <g filter="url(#shadow)">
      <rect {...button} />
      <text {...text}>
        Login to participate!
      </text>
    </g>
  );
};

Login.propTypes = {
  authenticate: PropTypes.func.isRequired,
};

export default Login;
```

The component that you have just created is agnostic in terms of what it will do when clicked. You will define this action when adding it to the `Canvas` component. So, open the `Canvas.jsx` file and update it as follows:

```js
// ... other import statements
import Login from './Login';
import { signIn } from 'auth0-web';

const Canvas = (props) => {
  // ... const definitions
  return (
    <svg ...>
      // ... other elements

      { ! props.gameState.started &&
      <g>
        // ... StartGame and Title components
        <Login authenticate={signIn} />
      </g>
      }

      // ... flyingObjects.map
    </svg>
  );
};
// ... propTypes definition and export statement
```

As you can see, in this new version, you have imported the `Login` component and the `signIn` function of the `auth0-web` package. Then, you have added your new component to the block of code that is shown only if users have not started the game. Also, you have indicated that, when clicked, the login button must trigger the `signIn` function.

With these changes in place, the last thing you will have to do is to configure the `auth0-web` with your Auth0 Client properties. To do this, open the `App.js` file and update it as follows:

```js
// ... other import statements
import * as Auth0 from 'auth0-web';

Auth0.configure({
  domain: 'YOUR_AUTH0_DOMAIN',
  clientID: 'YOUR_AUTH0_CLIENT_ID',
  audience: 'https://aliens-go-home.digituz.com.br',
  redirectUri: 'http://localhost:3000/',
  responseType: 'token id_token',
  scope: 'openid profile manage:points',
});

class App extends Component {
  // ... constructor definition

  componentDidMount() {
    const self = this;

    Auth0.handleAuthCallback();

    Auth0.subscribe((auth) => {
      console.log(auth);
    });

    // ... setInterval and onresize
  }

  // ... trackMouse and render functions
}

// ... propTypes definition and export statement
```

> **Note:** You have to replace `YOUR_AUTH0_DOMAIN` and `YOUR_AUTH0_CLIENT_ID` with the values copied from the *Domain* and *Client ID* fields of your Auth0 client. Besides that, when publishing your game to the web, you will have to replace the `redirectUri` value as well.

The enhancements in this file are quite simple. This list summarizes them:

1. `configure`: You used this function to configure the `auth0-web` package with your Auth0 Client properties.
2. `handleAuthCallback`: You triggered this function in [the `componentDidMount` lifecycle hook](https://reactjs.org/docs/react-component.html#componentdidmount) to evaluate if the user is returning from Auth0 after authenticating. This function simply tries to fetch tokens from the URL and, if it succeeds, fetches the user profile and persists everything in the `localstorage`.
3. `subscribe`: You used this function to log if the user is authenticated or not (`true` for authenticated and `false` otherwise).

That's it, your game is already [using Auth0 as its identity management service](https://auth0.com/learn/cloud-identity-access-management/). If you run your app now (`npm start`) and head to it in your browser ([`http://localhost:3000`](http://localhost:3000)), you will see the login button. Clicking on it will redirect you to [the Auth0 login page](https://auth0.com/docs/hosted-pages/login) where you will be able to sign in.

After you finish the sign in process, Auth0 will redirect you to your game again where the `handleAuthCallback` function will fetch your tokens. Then, as you have told your app to `console.log` any changes on the authentication state, you will be able to see it logging `true` in your browser console.

![Showing the login button on your React and Redux game](https://cdn.auth0.com/blog/aliens-go-home/showing-the-login-button-in-your-react-game.png)
