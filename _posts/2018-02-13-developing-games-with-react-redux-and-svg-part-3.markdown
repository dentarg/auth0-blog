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

In [the second part](https://auth0.com/blog/developing-games-with-react-redux-and-svg-part-2/), you have created the other elements needed in your game (e.g. `Heart`, `FlyingObject`, and `CannonBall`), enabled your players to start the game, and used CSS animations to make flying objects fly (that's what they do right?).

Although these are awesome features to have, they don't make a complete game yet. You still have to make your cannon shoot cannon balls and implement an algorithm to detect collision between these balls and flying objects. Besides that, you have to increment the `CurrentScore` component when your players kill some aliens.

Killing aliens and seeing the current score increase is cool, but you probably can make this game more attractive. That's why you are going to add a leaderboard feature to your game. This will make your players spend more time trying to reach the top of the leaderboard.

With these features, you can say that you have a complete game. So, without wasting more time, it's time to focus on them.

> **Note:** If, for whatever reason, you don't have the code created in [the first two parts of the series](https://auth0.com/blog/developing-games-with-react-redux-and-svg-part-2/), you can simply clone it from [this GitHub repository](https://github.com/auth0-blog/aliens-go-home-part-2). After cloning it, you will be able to follow the instructions in the sections that follow.

## Implementing the Leaderboard Feature in Your React Game

The first thing you will do to make your game look like a real game is to implement the leaderboard feature. This feature will enable players to sign in, so your game can track their max score and show their rank.

## Integrating React and Auth0

To make Auth0 manage the identity of your players, you have to have an Auth0 account. If you don't have one yet, you can <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">**sign up for a free Auth0 account** here</a>.

After creating your account, you just have to create an [Auth0 Client](https://auth0.com/docs/clients) to represent your game. To do this, head to [the Clients page on the Auth0 dashboard](https://manage.auth0.com/#/clients) and click on the *Create Client* button. The dashboard will show you a form where you will have to inform the *name* of your client and its *type*. You can type *Aliens, Go Home!* as the name and choose the *Single Page Web Application* type (your game is a SPA based on React after all). Then, you can click on *Create*.

![Creating the Auth0 Client to represent your React game.](https://cdn.auth0.com/blog/aliens-go-home/creating-the-auth0-client-for-your-react-game.png)

When you click this button, the dashboard will redirect you to the *Quick Start* tab of your new client. As you will learn how to integrate React and Auth0 in this article, you won't need to use this tab. Instead, you will need to use the *Settings* tab, so head to it.

There are three things that you will need to do in this tab. The first one is to add the `http://localhost:3000` value to the field called *Allowed Callback URLs*. As the dashboard explains, *after the player authenticates, Auth0 will only call back one of the URLs on this field*. So, if you are going to publish your game on the web, be sure to add its public URL there as well (e.g. `http://aliens-go-home.digituz.com.br`).

After inputing all your URLs on this field, hit the *Save* button or press `ctrl` + `s` (if you are using a MacBook, you will need to press `command` + `s` instead).

The last two things you will need to do is to copy the values from the *Domain* and *Client ID* fields. However, before using these values, you will need to code a little.

For starters, you will need to issue the following command in the root directory of your game to install the `auth0-web` package:

```bash
npm i auth0-web
```

As you will see, this package facilitates the integration between Auth0 and SPAs.

The next step is to add a login button in your game, so your players can authenticate via Auth0. To do this, create a new file called `Login.jsx` inside the `./src/components` directory with the following code:

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

As you can see, in this new version, you have imported the `Login` component and the `signIn` function of the `auth0-web` package. Then, you have added your new component to the block of code that is shown only if players have not started the game. Also, you have indicated that, when clicked, the login button must trigger the `signIn` function.

With these changes in place, the last thing you will have to do is to configure the `auth0-web` with your Auth0 Client properties. To do this, open the `App.js` file and update it as follows:

```js
// ... other import statements
import * as Auth0 from 'auth0-web';

Auth0.configure({
  domain: 'YOUR_AUTH0_DOMAIN',
  clientID: 'YOUR_AUTH0_CLIENT_ID',
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
2. `handleAuthCallback`: You triggered this function in [the `componentDidMount` lifecycle hook](https://reactjs.org/docs/react-component.html#componentdidmount) to evaluate if the player is returning from Auth0 after authenticating. This function simply tries to fetch tokens from the URL and, if it succeeds, fetches the player profile and persists everything in the `localstorage`.
3. `subscribe`: You used this function to log if the player is authenticated or not (`true` for authenticated and `false` otherwise).

That's it, your game is already [using Auth0 as its identity management service](https://auth0.com/learn/cloud-identity-access-management/). If you run your app now (`npm start`) and head to it in your browser ([`http://localhost:3000`](http://localhost:3000)), you will see the login button. Clicking on it will redirect you to [the Auth0 login page](https://auth0.com/docs/hosted-pages/login) where you will be able to sign in.

After you finish the sign in process, Auth0 will redirect you to your game again where the `handleAuthCallback` function will fetch your tokens. Then, as you have told your app to `console.log` any changes on the authentication state, you will be able to see it logging `true` in your browser console.

![Showing the login button on your React and Redux game](https://cdn.auth0.com/blog/aliens-go-home/showing-the-login-button-in-your-react-game.png)

## Creating the Leaderboard React Component

Now that you have configured Auth0 as your identity management system, you will need to create the components that will show the leaderboard and the max score for the current player. For that, you will create two components: `Leaderboard` and `Rank`. You will need to split this feature into two components because, as you will see, it's not that simple to show player's data (like max score, name, position, and picture) in a nice way. It's not hard either, but you will have to type some good amount of code. So, adding everything into one component would make it look clumsy.

As your game does not have any players yet, the first thing you will need to do is to define some mock data to populate the leaderboard. The best place to do this is in the `Canvas` component. Also, since you are going to update your canvas, you can go ahead and replace the `Login` component with the `Leaderboard` (you will add `Login` inside the `Leaderboard` in a moment):

```js
// ... other import statements
// replace Login with the following line
import Leaderboard from './Leaderboard';

const Canvas = (props) => {
  // ... const definitions
  const leaderboard = [
    { id: 'd4', maxScore: 82, name: 'Ado Kukic', picture: 'https://twitter.com/KukicAdo/profile_image', },
    { id: 'a1', maxScore: 235, name: 'Bruno Krebs', picture: 'https://twitter.com/brunoskrebs/profile_image', },
    { id: 'c3', maxScore: 99, name: 'Diego Poza', picture: 'https://twitter.com/diegopoza/profile_image', },
    { id: 'b2', maxScore: 129, name: 'Jeana Tahnk', picture: 'https://twitter.com/jeanatahnk/profile_image', },
    { id: 'e5', maxScore: 34, name: 'Jenny Obrien', picture: 'https://twitter.com/jenny_obrien/profile_image', },
    { id: 'f6', maxScore: 153, name: 'Kim Maida', picture: 'https://twitter.com/KimMaida/profile_image', },
    { id: 'g7', maxScore: 55, name: 'Luke Oliff', picture: 'https://twitter.com/mroliff/profile_image', },
    { id: 'h8', maxScore: 146, name: 'Sebastián Peyrott', picture: 'https://twitter.com/speyrott/profile_image', },
  ];
  return (
    <svg ...>
      // ... other elements

      { ! props.gameState.started &&
      <g>
        // ... StartGame and Title
        <Leaderboard currentPlayer={leaderboard[6]} authenticate={signIn} leaderboard={leaderboard} />
      </g>
      }

      // ... flyingObjects.map
    </svg>
  );
};

// ... propTypes definition and export statement
```

In the new version of this file, you defined a constant called `leaderboard` that holds an array of fake players. These players have the following properties: `id`, `maxScore`, `name`, and `picture`. Then, inside the `svg` element, you added the `Leaderboard` component with the following parameters:

- `currentPlayer`: This defines who the current player is. For now, you are using one of the fake players defined before so you can see how everything works. The purpose of passing this parameter is to make your leaderboard highlight the current player.
- `authenticate`: This is the same parameter that you were adding to the `Login` component in the previous version.
- `leaderboard`: This is the array of fake players. Your leaderboard will use it to show the current ranking.

Now, you have to define the `Leaderboard` component. To do this, create a new file called `Leaderboard.jsx` in the `./src/components` directory and add the following code to it:

```js
import React from 'react';
import PropTypes from 'prop-types';
import Login from './Login';
import Rank from "./Rank";

const Leaderboard = (props) => {
  const style = {
    fill: 'transparent',
    stroke: 'black',
    strokeDasharray: '15',
  };

  const leaderboardTitle = {
    fontFamily: '"Joti One", cursive',
    fontSize: 50,
    fill: '#88da85',
    cursor: 'default',
  };

  let leaderboard = props.leaderboard || [];
  leaderboard = leaderboard.sort((prev, next) => {
    if (prev.maxScore === next.maxScore) {
      return prev.name <= next.name ? 1 : -1;
    }
    return prev.maxScore < next.maxScore ? 1 : -1;
  }).map((member, index) => ({
    ...member,
    rank: index + 1,
    currentPlayer: member.id === props.currentPlayer.id,
  })).filter((member, index) => {
    if (index < 3 || member.id === props.currentPlayer.id) return member;
    return null;
  });

  return (
    <g>
      <text filter="url(#shadow)" style={leaderboardTitle} x="-150" y="-630">Leaderboard</text>
      <rect style={style} x="-350" y="-600" width="700" height="330" />
      {
        props.currentPlayer && leaderboard.map((player, idx) => {
          const position = {
            x: -100,
            y: -530 + (70 * idx)
          };
          return <Rank key={player.id} player={player} position={position}/>
        })
      }
      {
        ! props.currentPlayer && <Login authenticate={props.authenticate} />
      }
    </g>
  );
};

Leaderboard.propTypes = {
  currentPlayer: PropTypes.shape({
    id: PropTypes.string.isRequired,
    maxScore: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    picture: PropTypes.string.isRequired,
  }),
  authenticate: PropTypes.func.isRequired,
  leaderboard: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    maxScore: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    picture: PropTypes.string.isRequired,
    ranking: PropTypes.number,
  })),
};

Leaderboard.defaultProps = {
  currentPlayer: null,
  leaderboard: null,
};

export default Leaderboard;
```

Don't be scared! The code of this component is quite simple:

1. You are defining the `leaderboardTitle` constant to set how the leaderboard title will look like.
2. You are defining the `dashedRectangle` constant to style a `rect` element that will work as the container of the leaderboard.
3. You are calling the `sort` function of the `props.leaderboard` variable to order the ranking. After that, your leaderboard will have the highest max score on top and the lowest max score on bottom. Also, if there is a tie between two players, you are ordering them based on their names.
4. You are calling the `map` function on the result of the previous step (the `sort` function) to complement players with their `rank` and with a flag called `currentPlayer`. You will use this flag to highlight the row where the current player appears.
5. You are using the `filter` function on the result of the previous step (the `map` function) to remove everyone who are not among the top three players. Actually, you are letting the current player stay on the final array if they don't belong to this select group.
6. Lastly, you are simply iterating over the filtered array to show `Rank` elements if there is a player logged in (`props.currentPlayer && leaderboard.map`) or showing the `Login` button otherwise.

Then, the last thing you will need to do is to create the `Rank` React component. To do this, create a new file called `Rank.jsx` beside the `Leaderboard.jsx` file with the following code:

```js
import React from 'react';
import PropTypes from 'prop-types';

const Rank = (props) => {
  const { x, y } = props.position;

  const rectId = 'rect' + props.player.rank;
  const clipId = 'clip' + props.player.rank;

  const pictureStyle = {
    height: 60,
    width: 60,
  };

  const textStyle = {
    fontFamily: '"Joti One", cursive',
    fontSize: 35,
    fill: '#e3e3e3',
    cursor: 'default',
  };

  if (props.player.currentPlayer) textStyle.fill = '#e9ea64';

  const pictureProperties = {
    style: pictureStyle,
    x: x - 140,
    y: y - 40,
    href: props.player.picture,
    clipPath: `url(#${clipId})`,
  };

  const frameProperties = {
    width: 55,
    height: 55,
    rx: 30,
    x: pictureProperties.x,
    y: pictureProperties.y,
  };

  return (
    <g>
      <defs>
        <rect id={rectId} {...frameProperties} />
        <clipPath id={clipId}>
          <use xlinkHref={'#' + rectId} />
        </clipPath>
      </defs>
      <use xlinkHref={'#' + rectId} strokeWidth="2" stroke="black" />
      <text filter="url(#shadow)" style={textStyle} x={x - 200} y={y}>{props.player.rank}º</text>
      <image {...pictureProperties} />
      <text filter="url(#shadow)" style={textStyle} x={x - 60} y={y}>{props.player.name}</text>
      <text filter="url(#shadow)" style={textStyle} x={x + 350} y={y}>{props.player.maxScore}</text>
    </g>
  );
};

Rank.propTypes = {
  player: PropTypes.shape({
    id: PropTypes.string.isRequired,
    maxScore: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    picture: PropTypes.string.isRequired,
    rank: PropTypes.number.isRequired,
    currentPlayer: PropTypes.bool.isRequired,
  }).isRequired,
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }).isRequired,
};

export default Rank;
```

Nothing to be scared of about this code either. The only unordinary thing that you are adding to this component is [the `clipPath` element](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/clipPath) and a `rect` inside the `defs` element to create a rounded portrait.

With these new files in place, you can head to your app ([`http://localhost:3000/`](http://localhost:3000/)) to see your new leaderboard feature.

![Showing the leaderboard in your React Game](https://cdn.auth0.com/blog/aliens-go-home/showing-the-leaderboard-in-your-react-game.png)

## Developing a Real-Time Leaderboard with Socket.IO

Cool, you are already using Auth0 as the identity management service and you also created the components needed to show the leaderboard. So, what do you need next? That's right, you need a backend capable of emitting real-time events to update the leaderboard.

This may make you think: isn't it hard to develop a real-time backend server? No, it is not. With [Socket.IO](https://socket.io/), you can develop this feature in no time. However, before diving into it, you will probably want to secure this backend service, right? To do this, you will need to create an [Auth0 API](https://auth0.com/docs/apis) to represent your service.

Doing so is quite easy. Just head to [the APIs page on your Auth0 dashboard](https://manage.auth0.com/#/apis) and click on the *Create API* button. After that, Auth0 will present to you a small form where it will ask for three things:

1. The *Name* of the API: Here, you need to inform just a friendly name so you don't forget what this API represents. So, just type *Aliens, Go Home!* for this field.
2. The *Identifier* of the API: The recommended value here is the final URL of your game, but the truth is that it can be anything. Nevertheless, insert `https://aliens-go-home.digituz.com.br` in this field.
3. The *Signing Algorithm*: There are two options here, *RS256* and *HS256*. You will be better off leaving this field untouched (i.e. stick with *RS256*). If you want to learn the difference between them, check [this answer](https://community.auth0.com/answers/6945/view).

![Creating the Auth0 API for the Socket.IO real-time server.](https://cdn.auth0.com/blog/aliens-go-home/creating-the-auth0-api-for-the-socket-io-server.png)

After filling this form, click on the *Create* button. This will redirect you to a tab called *Quick Start* inside your new API. From there, click on the *Scopes* tab and add a new scope called `manage:points` with the following description: "Read and write Max Score". [It's a good practice to define scopes on Auth0 APIs](https://auth0.com/docs/scopes/current#api-scopes).

After adding this scope, you can go back coding. To implement your real-time leaderboard service, do the following:

```bash
# create a server directory in the project root
mkdir server

# move into it
cd server

# start it as a NPM project
npm init -y

# install some dependencies
npm i express jsonwebtoken jwks-rsa socket.io socketio-jwt

# create a file to hold your server source code
touch index.js
```

Then, in this new file, add the following code:

```js
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const client = jwksClient({
  jwksUri: 'https://YOUR_AUTH0_DOMAIN/.well-known/jwks.json'
});

const players = [
  { id: 'a1', maxScore: 235, name: 'Bruno Krebs', picture: 'https://twitter.com/brunoskrebs/profile_image', },
  { id: 'c3', maxScore: 99, name: 'Diego Poza', picture: 'https://twitter.com/diegopoza/profile_image', },
  { id: 'b2', maxScore: 129, name: 'Jeana Tahnk', picture: 'https://twitter.com/jeanatahnk/profile_image', },
  { id: 'f6', maxScore: 153, name: 'Kim Maida', picture: 'https://twitter.com/KimMaida/profile_image', },
  { id: 'e5', maxScore: 55, name: 'Luke Oliff', picture: 'https://twitter.com/mroliff/profile_image', },
  { id: 'd4', maxScore: 146, name: 'Sebastián Peyrott', picture: 'https://twitter.com/speyrott/profile_image', },
];

const verifyPlayer = (token, cb) => {
  const uncheckedToken = jwt.decode(token, {complete: true});
  const kid = uncheckedToken.header.kid;

  client.getSigningKey(kid, (err, key) => {
    const signingKey = key.publicKey || key.rsaPublicKey;

    jwt.verify(token, signingKey, cb);
  });
};

const newMaxScoreHandler = (payload) => {
  let foundPlayer = false;
  players.forEach((player) => {
    if (player.id === payload.id) {
      foundPlayer = true;
      player.maxScore = Math.max(player.maxScore, payload.maxScore);
    }
  });

  if (!foundPlayer) {
    players.push(payload);
  }

  io.emit('players', players);
};

io.on('connection', (socket) => {
  const { token } = socket.handshake.query;

  verifyPlayer(token, (err) => {
    if (err) socket.disconnect();
    io.emit('players', players);
  });

  socket.on('new-max-score', newMaxScoreHandler);
});

http.listen(3001, () => {
  console.log('listening on port 3001');
});
```

Before learning about what this code does, replace `YOUR_AUTH0_DOMAIN` with your Auth0 domain (the same one that you added to the `App.js` file). You will find this placeholder in the value of the `jwksUri` property.

Now, to understand how this thing works, check out this list:

- `express` and `socket.io`: This is simply an [Express](https://expressjs.com/) server enhanced with Socket.IO to make it real-time. If you haven't used Socket.IO before, checkout their *Get Started* tutorial. It's really simple.
- `jwt` and `jwksClient`: When authenticating with Auth0, your players will get (among other things) an `access_token` in the form of a JWT (JSON Web Token). Since you are using the *RS256* signing algorithm, you need to use the `jwksClient` package to fetch the correct public key to validate JWTs. The JWTs that you receive contain a `kid` property (Key ID) that you can use to get the correct public key (if curious, [you can learn more about JWKS here](https://auth0.com/docs/jwks)).
- `jwt.verify`: After finding the correct key, you use this function to decode and validate JWTs. If they are fine, you just send the `players` list to whomever is requesting. If they are not valid, you just `disconnect` the `socket` (client).
- `on('new-max-score', ...)`: Lastly, you are attaching the `newMaxScoreHandler` function to the `new-max-score` event. As such, whenever you need to update the max score of a user, you will need to emit this event from your React app.

The rest of the code is pretty intuitive. Therefore, you can focus on integrating this service in your game.

## Socket.IO and React

After creating your real-time backend service, it's time to integrate your React game with it. The best way to use React and Socket.IO is by installing [the `socket.io-client` package](https://github.com/socketio/socket.io-client). To do this, issue the following code in the root directory of your React app:

```bash
npm i socket.io-client
```

Then, after that, you will make your game connect to your service whenever your players authenticate (you won't show the leaderboard for unauthenticated players). As you are using Redux to hold the state of your game, you will need two actions to keep your Redux store up to date. As such, open the `./src/actions/index.js` file and update it as follows:

```js
export const LEADERBOARD_LOADED = 'LEADERBOARD_LOADED';
export const LOGGED_IN = 'LOGGED_IN';
// ... MOVE_OBJECTS and START_GAME ...

export const leaderboardLoaded = players => ({
  type: LEADERBOARD_LOADED,
  players,
});

export const loggedIn = player => ({
  type: LOGGED_IN,
  player,
});

// ... moveObjects and startGame ...
```

This new version defines actions to be triggered in two moments:

1. `LOGGED_IN`: When a player logs in, you will use this action to connect your React game to the real-time service.
2. `LEADERBOARD_LOADED`: When the real-time service sends the list of players, you will use this action to update the Redux store with these players.

To make you Redux store respond to these actions, open the `./src/reducers/index.js` file and update it as follows:

```js
import {
  LEADERBOARD_LOADED, LOGGED_IN,
  MOVE_OBJECTS, START_GAME
} from '../actions';
// ... other import statements

const initialGameState = {
  // ... other game state properties
  currentPlayer: null,
  players: null,
};

// ... initialState definition

function reducer(state = initialState, action) {
  switch (action.type) {
    case LEADERBOARD_LOADED:
      return {
        ...state,
        players: action.players,
      };
    case LOGGED_IN:
      return {
        ...state,
        currentPlayer: action.player,
      };
    // ... MOVE_OBJECTS, START_GAME, and default cases
  }
}

export default reducer;
```

Now, whenever your game triggers the `LEADERBOARD_LOADED` action, you will update the Redux store with the new array of players. Besides that, whenever a player logs in (`LOGGED_IN`), you will update the `currentPlayer` in the store.

Then, to make your game use these new actions, open the `./src/containers/Game.js` file and update it as follows:

```js
// ... other import statements
import {
  leaderboardLoaded, loggedIn,
  moveObjects, startGame
} from '../actions/index';

const mapStateToProps = state => ({
  // ... angle and gameState
  currentPlayer: state.currentPlayer,
  players: state.players,
});

const mapDispatchToProps = dispatch => ({
  leaderboardLoaded: (players) => {
    dispatch(leaderboardLoaded(players));
  },
  loggedIn: (player) => {
    dispatch(loggedIn(player));
  },
  // ... moveObjects and startGame
});

// ... connect and export statement
```

With that, you are ready to make your game connect to the real-time service to load and update the leaderboard. Therefore, open the `./src/App.js` file and update it with the following code:

```js
// ... other import statements
import io from 'socket.io-client';

Auth0.configure({
  // ... other properties
  audience: 'https://aliens-go-home.digituz.com.br',
});

class App extends Component {
  // ... constructor

  componentDidMount() {
    const self = this;

    Auth0.handleAuthCallback();

    Auth0.subscribe((auth) => {
      if (!auth) return;

      const playerProfile = Auth0.getProfile();
      const currentPlayer = {
        id: playerProfile.sub,
        maxScore: 0,
        name: playerProfile.name,
        picture: playerProfile.picture,
      };

      this.props.loggedIn(currentPlayer);

      const socket = io('http://localhost:3001', {
        query: `token=${Auth0.getAccessToken()}`,
      });

      let emitted = false;
      socket.on('players', (players) => {
        this.props.leaderboardLoaded(players);

        if (emitted) return;
        socket.emit('new-max-score', {
          id: playerProfile.sub,
          maxScore: 120,
          name: playerProfile.name,
          picture: playerProfile.picture,
        });
        emitted = true;
        setTimeout(() => {
          socket.emit('new-max-score', {
            id: playerProfile.sub,
            maxScore: 222,
            name: playerProfile.name,
            picture: playerProfile.picture,
          });
        }, 5000);
      });
    });

    // ... setInterval and onresize
  }

  // ... trackMouse

  render() {
    return (
      <Canvas
        angle={this.props.angle}
        currentPlayer={this.props.currentPlayer}
        gameState={this.props.gameState}
        players={this.props.players}
        startGame={this.props.startGame}
        trackMouse={event => (this.trackMouse(event))}
      />
    );
  }
}

App.propTypes = {
  // ... other propTypes definitions
  currentPlayer: PropTypes.shape({
    id: PropTypes.string.isRequired,
    maxScore: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    picture: PropTypes.string.isRequired,
  }),
  leaderboardLoaded: PropTypes.func.isRequired,
  loggedIn: PropTypes.func.isRequired,
  players: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    maxScore: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    picture: PropTypes.string.isRequired,
  })),
};

App.defaultProps = {
  currentPlayer: null,
  players: null,
};

export default App;
```

As you can see in the code above, what you had to:

1. configure the `audience` property on the `Auth0` module;
2. fetch the profile of the current player (`Auth0.getProfile()`) to create the `currentPlayer` constant and update the Redux store (`this.props.loggedIn(...)`);
3. connect to your real-time service (`io('http://localhost:3001', ...)`) with the player's `access_token` (`Auth0.getAccessToken()`);
4. and listen to the `players` event emitted by your real-time service to update the Redux store (`this.props.leaderboardLoaded(...)`);

Then, as your game is not complete and your players cannot kill aliens yet, you added some temporary code to simulate `new-max-score` events. First, you emitted a new `maxScore` of `120`, which puts the logged in player in the fifth position. Then, after five seconds (`setTimeout(..., 5000)`), you emitted a new action with a new `maxScore` of `222`, putting the logged in player in the second position.

Besides these changes, you passed two new properties to your `Canvas`: `currentPlayer` and `players`. Therefore, you need to open the `./src/components/Canvas.jsx` file and update it:

```js
// ... import statements

const Canvas = (props) => {
  // ... gameHeight and viewBox constants

  // REMOVE the leaderboard constant !!!!

  return (
    <svg ...>
      // ... other elements

      { ! props.gameState.started &&
      <g>
        // ... StartGame and Title
        <Leaderboard currentPlayer={props.currentPlayer} authenticate={signIn} leaderboard={props.players} />
      </g>
      }

      // ... flyingObjects.map
    </svg>
  );
};

Canvas.propTypes = {
  // ... other propTypes definitions
  currentPlayer: PropTypes.shape({
    id: PropTypes.string.isRequired,
    maxScore: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    picture: PropTypes.string.isRequired,
  }),
  players: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    maxScore: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    picture: PropTypes.string.isRequired,
  })),
};

Canvas.defaultProps = {
  currentPlayer: null,
  players: null,
};

export default Canvas;
```

In this file, you had to make the following changes:

1. Remove the `leaderboard` constant. Now, you are loading this constant from your real-time service.
2. Update the `<Leaderboard />` element. You have some more realistic data now: `props.currentPlayer` and `props.players`.
3. Enhance the `propTypes` definition to declare that the `Canvas` component can use the `currentPlayer` and `players` value.

Done! You have integrated your React game leaderboard with the Socket.IO real-time service. To test everything, issue the following commands:

```bash
# move to the real-time service directory
cd server

# run it on the background
node index.js &

# move back to your game
cd ..

# start the React development server
npm start
```

Then, open your game on your browser ([`http://localhost:3000`](http://localhost:3000)). There, you will see that, after logging in, you will appear in the fifth position and that, after 5 seconds, you will jump to the second position.

![Testing the Socket.IO real-time leaderboard of your React game](https://cdn.auth0.com/blog/aliens-go-home/real-time-leaderboard.png)
