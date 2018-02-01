---
layout: post
title: "Developing Games with React, Redux, and SVG - Part 2"
description: "Learn how to make React and Redux control a bunch of SVG elements to create a game."
longdescription: "In this series, you will learn how to make React and Redux control a bunch of SVG elements to create a game. The knowledge acquired throughout this series will also allow you to create other types of animations that are orchestrated by React and Redux, not only games."
date: 2018-02-14 08:30
category: Technical Guide
author:
  name: "Bruno Krebs"
  url: "https://twitter.com/brunoskrebs"
  mail: "bruno.krebs@gmail.com"
  avatar: "https://twitter.com/brunoskrebs/profile_image?size=original"
design:
  image: https://cdn.auth0.com/blog/sso-b2c/logo.png
  bg_color: "#002C5F"
tags:
- react
- redux
- svg
- game
- auth0
- animation
- state
related:
- 2018-01-10-implementing-single-sign-on-in-b2c-applications
---

**TL;DR:** In this series, you will learn how to make React and Redux control a bunch of SVG elements to create a game. The knowledge acquired throughout this series will also allow you to create other types of animations that are orchestrated by React and Redux, not only games. You can find the final code developed in this article in the following GitHub repository: [Aliens Go Home - Part 2](https://github.com/auth0-blog/aliens-go-home-part-2)

---

## The React Game: Aliens, Go Home!

The game that you will develop in this series is called *Aliens, Go Home!* The idea of this game is simple, you will have a cannon and will have to kill flying objects that are trying to invade the Earth. To kill these flying objects you will have to point and click on an SVG canvas to make your cannon shoot.

If you are curious, you can find [the final game up and running here](http://bang-bang.digituz.com.br/). But don't play too much, you have work to do!

## Previously, on Part 1

In the first part of this series, you have used [`create-react-app`](https://github.com/facebookincubator/create-react-app) to bootstrap your React application and you have installed and configured Redux to manage the game state. After that, you have learned how to use SVG with React components while creating game elements like `Sky`, `Ground`, the `CannonBase`, and the `CannonPipe`. In the end, you've added the aiming capability to your cannon by using an event listener and a [JavaScript interval](https://www.w3schools.com/jsref/met_win_setinterval.asp) to trigger a Redux *action* that updates the `CannonPipe` angle.

These accomplishments paved the way to understand how you can create your game (and other animations) with React, Redux, and SVG.

> **Note:** If, for whatever reason, you don't have the code created in the first part of the series, you can simply clone it from [this GitHub repository](https://github.com/auth0-blog/aliens-go-home-part-1). After cloning it, you will be able to follow the instructions in the sections that follow.

## Creating More SVG React Components

The subsections that follow will show you how to create the rest of your game elements. Although they might look lengthy, they are quite simple and similar. Probably, you will be able to follow the instruction on these subsections in a matter of minutes.

After this section, you will find the most interesting topics of this part of the series. These topics are entitled *Making Flying Objects Appear Randomly* and *Making the Cannon Shoot*.

### Creating the Cannon Ball React Component

The next element that you will create is the `CannonBall`. Note that, for now, you will keep this element inanimate. But don't worry! Soon (after creating all other elements), you will make your cannon shoot multiple cannon balls and kill some aliens.

To create this component, add a new file called `CannonBall.jsx` inside the `./src/components` directory with the following code:

```js
import React from 'react';
import PropTypes from 'prop-types';

const CannonBall = (props) => {
  const ballStyle = {
    fill: '#777',
    stroke: '#444',
    strokeWidth: '2px',
  };
  return (
    <ellipse
      style={ballStyle}
      cx={props.position.x}
      cy={props.position.y}
      rx="16"
      ry="16"
    />
  );
};

CannonBall.propTypes = {
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }).isRequired,
};

export default CannonBall;
```

As you can see, to make a cannon ball appear in your canvas, you will have to pass to it an object that contains the `x` and `y` properties. If you don't have that much experience with `prop-types`, this might have been the first time that you have used `PropTypes.shape`. Luckily, this feature is self-explanatory.

After creating this component, you might want to see it in your canvas. To do that, simply add `<CannonBall position={{x: 0, y: -100}}/>` inside the `svg` element of the `Canvas` component (you will also need to add `import CannonBall from './CannonBall';`). Just keep in mind that, if you add it before an element that occupies the same position, you will not see it. So, to play safe, just add it as the last element (right after `<CannonBase />`). Then, you can open your game in a web browser to see your new component.

> If you don't remember how to do that, you just have to run `npm start` in the project root and then open [http://localhost:3000](http://localhost:3000) in your preferred browser. Also, **don't** forget to commit this code to your repository before moving on.

### Creating the Current Score React Component

Another React component that you will have to create is the `CurrentScore`. As the name states, you will use this component to show users what their current scores are. That is, whenever they kill a flying object, your game will increase the value in this component by one and show to them.

Before creating this component, you might want to add some neat font to use on it. Actually, you might want to configure and use a font on the whole game, so it won't look like a monotonous game. You can browse and choose a font from whatever place you want, but if you are not interested in investing time on this, you can simply add the following line at the top of the `./src/index.css` file:

```css
@import url('https://fonts.googleapis.com/css?family=Joti+One');

/* other rules ... */
```

This will make your game load [the Joti One font from Google](https://fonts.google.com/specimen/Joti+One).

After that, you can create the `CurrentScore.jsx` file inside the `./src/components` directory with the following code:

```js
import React from 'react';
import PropTypes from 'prop-types';

const CurrentScore = (props) => {
  const scoreStyle = {
    fontFamily: '"Joti One", cursive',
    fontSize: 80,
    fill: '#d6d33e',
  };

  return (
    <g filter="url(#shadow)">
      <text style={scoreStyle} x="300" y="80">
        {props.score}
      </text>
    </g>
  );
};

CurrentScore.propTypes = {
  score: PropTypes.number.isRequired,
};

export default CurrentScore;
```

> **Note:** If you haven't configured Joti One (or if you configured some other font), you will have to change this code accordingly. Besides that, this font is used by other components that you will create, so keep in mind that you might have to update these components as well.

As you can see, the `CurrentScore` component requires a single property: `score`. As your game is not currently counting the score, to see this component right now, you will have to add a hard-coded value. So, inside the `Canvas` component, add `<CurrentScore score={15} />` as the last element inside the `svg` element. Also, add the `import` statement to fetch this component (`import CurrentScore from './CurrentScore';`).

If you try to see your new component now, you **won't** be able to. This is because your component is using a `filter` called `shadow`. Although this shadow filter is not necessary, it will make your game looks nicer. Besides that, [adding a shadow to SVG elements is easy](https://www.w3schools.com/graphics/svg_feoffset.asp). To do that, simply add the following element at the top of your `svg`:

```xml
<defs>
  <filter id="shadow">
    <feDropShadow dx="1" dy="1" stdDeviation="2" />
  </filter>
</defs>
```

In the end, your `Canvas` component will look like this:

```js
import React from 'react';
import PropTypes from 'prop-types';
import Sky from './Sky';
import Ground from './Ground';
import CannonBase from './CannonBase';
import CannonPipe from './CannonPipe';
import CannonBall from './CannonBall';
import CurrentScore from './CurrentScore';

const Canvas = (props) => {
  const viewBox = [window.innerWidth / -2, 100 - window.innerHeight, window.innerWidth, window.innerHeight];
  return (
    <svg
      id="aliens-go-home-canvas"
      preserveAspectRatio="xMaxYMax none"
      onMouseMove={props.trackMouse}
      viewBox={viewBox}
    >
      <defs>
        <filter id="shadow">
          <feDropShadow dx="1" dy="1" stdDeviation="2" />
        </filter>
      </defs>
      <Sky />
      <Ground />
      <CannonPipe rotation={props.angle} />
      <CannonBase />
      <CannonBall position={{x: 0, y: -100}}/>
      <CurrentScore score={15} />
    </svg>
  );
};

Canvas.propTypes = {
  angle: PropTypes.number.isRequired,
  trackMouse: PropTypes.func.isRequired,
};

export default Canvas;
```

And your game will look like this:

![Showing current score and cannon ball in the Alien, Go Home! app.](https://cdn.auth0.com/blog/aliens-go-home/current-score-and-cannon-ball.png)

Not bad, huh?!

### Creating the Flying Object React Component

What about creating React components to represent your flying objects now? Flying objects are not circles, nor rectangles. They usually have two parts (the top and the base) and these parts are usually rounded. That's why you are going to use two React components to create your flying objects: the `FlyingObjectBase` and the `FlyingObjectTop`.

One of these components is going to use a Bezier Cubic curve to define its shapes. The other one is going to be an ellipse.

You can start by creating the first one, the `FlyingObjectBase`, in a new file called `FlyingObjectBase.jsx` inside the `./src/components` directory. This is the code to define this component:

```js
import React from 'react';
import PropTypes from 'prop-types';

const FlyingObjectBase = (props) => {
  const style = {
    fill: '#979797',
    stroke: '#5c5c5c',
  };

  return (
    <ellipse
      cx={props.position.x}
      cy={props.position.y}
      rx="40"
      ry="10"
      style={style}
    />
  );
};

FlyingObjectBase.propTypes = {
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }).isRequired,
};

export default FlyingObjectBase;
```

After that, you can define the top part of the flying object. To do that, create a file called `FlyingObjectTop.jsx` inside the `./src/components` directory and add the following code to it:

```js
import React from 'react';
import PropTypes from 'prop-types';
import { pathFromBezierCurve } from '../utils/formulas';

const FlyingObjectTop = (props) => {
  const style = {
    fill: '#b6b6b6',
    stroke: '#7d7d7d',
  };

  const baseWith = 40;
  const halfBase = 20;
  const height = 25;

  const cubicBezierCurve = {
    initialAxis: {
      x: props.position.x - halfBase,
      y: props.position.y,
    },
    initialControlPoint: {
      x: 10,
      y: -height,
    },
    endingControlPoint: {
      x: 30,
      y: -height,
    },
    endingAxis: {
      x: baseWith,
      y: 0,
    },
  };

  return (
    <path
      style={style}
      d={pathFromBezierCurve(cubicBezierCurve)}
    />
  );
};

FlyingObjectTop.propTypes = {
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }).isRequired,
};

export default FlyingObjectTop;
```

If you don't know how the Bezier Cubic curve works, [take a look at the previous article](https://auth0.com/blog/developing-games-with-react-redux-and-svg-part-1).

This is enough to show some flying objects but, as your are going to make them randomly appear in your game, it will be easier to treat these components as a single element. To do that, simply create a new file called `FlyingObject.jsx` alongside with the other two and add the following code to it:

```js
import React from 'react';
import PropTypes from 'prop-types';
import FlyingObjectBase from './FlyingObjectBase';
import FlyingObjectTop from './FlyingObjectTop';

const FlyingObject = props => (
  <g>
    <FlyingObjectBase position={props.position} />
    <FlyingObjectTop position={props.position} />
  </g>
);

FlyingObject.propTypes = {
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }).isRequired,
};

export default FlyingObject;
```

Now, to add flying objects in your game, you can simply use one React component. To see this in action, update your `Canvas` component as follows:

```js
// other imports ...
import FlyingObject from './FlyingObject';

const Canvas = (props) => {
  // ...
  return (
    <svg ...>
      // ...
      <FlyingObject position={{x: -150, y: -300}}/>
      <FlyingObject position={{x: 150, y: -300}}/>
    </svg>
  );
};

// propTypes and export ...
```

![Creating flying objects in your React game](https://cdn.auth0.com/blog/aliens-go-home/flying-objects.png)

### Creating the Heart React Component

The next component that you will need to create is the component that represents gamers' lives. There is nothing better to represent a life than a `Heart`. So, create a new file called `Heart.jsx` inside the `./src/components` directory and add the following code to it:

```js
import React from 'react';
import PropTypes from 'prop-types';
import { pathFromBezierCurve } from '../utils/formulas';

const Heart = (props) => {
  const heartStyle = {
    fill: '#da0d15',
    stroke: '#a51708',
    strokeWidth: '2px',
  };

  const leftSide = {
    initialAxis: {
      x: props.position.x,
      y: props.position.y,
    },
    initialControlPoint: {
      x: -20,
      y: -20,
    },
    endingControlPoint: {
      x: -40,
      y: 10,
    },
    endingAxis: {
      x: 0,
      y: 40,
    },
  };

  const rightSide = {
    initialAxis: {
      x: props.position.x,
      y: props.position.y,
    },
    initialControlPoint: {
      x: 20,
      y: -20,
    },
    endingControlPoint: {
      x: 40,
      y: 10,
    },
    endingAxis: {
      x: 0,
      y: 40,
    },
  };

  return (
    <g filter="url(#shadow)">
      <path
        style={heartStyle}
        d={pathFromBezierCurve(leftSide)}
      />
      <path
        style={heartStyle}
        d={pathFromBezierCurve(rightSide)}
      />
    </g>
  );
};

Heart.propTypes = {
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }).isRequired,
};

export default Heart;
```

As you can see, to create the shape of a heart with SVG, you need two Cubic Bezier curves: one for each side of the heart. You also had to add a `position` property to this component. You needed this because your game will provide users more than one life, so you will need to show each one of these hearts in a different position.

For now, you can simply add one heart to your canvas so you can confirm that everything is working properly. To do this, open the `Canvas` component and add `<Heart position={{x: -300, y: 35}} />` as the last element inside the `svg` element. Also, don't forget to add the import statement (`import Heart from './Heart';`).

### Creating the Start Game Button React Component

Every game needs an start button. So, to create one for your game, add a file called `StartGame.jsx` alongside with the other components and add the following code to it:

```js
import React from 'react';
import PropTypes from 'prop-types';
import { gameWidth } from '../utils/constants';

const StartGame = (props) => {
  const button = {
    x: gameWidth / -2, // half width
    y: -280, // minus means up (above 0)
    width: gameWidth,
    height: 200,
    rx: 10, // border radius
    ry: 10, // border radius
    style: {
      fill: 'transparent',
      cursor: 'pointer',
    },
    onClick: props.onClick,
  };

  const text = {
    textAnchor: 'middle', // center
    x: 0, // center relative to X axis
    y: -150, // 150 up
    style: {
      fontFamily: '"Joti One", cursive',
      fontSize: 60,
      fill: '#e3e3e3',
      cursor: 'pointer',
    },
    onClick: props.onClick,
  };
  return (
    <g filter="url(#shadow)">
      <rect {...button} />
      <text {...text}>
        Tap To Start!
      </text>
    </g>
  );
};

StartGame.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default StartGame;
```

As you don't need to show more than one `StartGame` button at a time, you have defined that this component is statically positioned in your game (`x: 0` and `y: -150`). There are other two differences between this component and the others that you have defined before:

- First, this component is expecting a function called `onClick`. This function is used to listen for clicks in this button and will trigger a Redux action to inform your app that it must start a new game.
- Second, this component is using a constant called `gameWidth` that you haven't defined yet. This constant will represent the area that is usable. Any area beyond that will have no purpose besides making your app fill the whole screen.

To define the `gameWidth` constant, open the `./src/utils/constants.js` file and add the following line to it:

```js
export const gameWidth = 800;
```

After that, you can add the `StartGame` component to your `Canvas` by appending `<StartGame onClick={() => console.log('Aliens, Go Home!')} />` as the last element inside the `svg` element. As always, don't forget to add the import statement (`import StartGame from './StartGame';`).

![Aliens, Go Home! game with the start game button](https://cdn.auth0.com/blog/aliens-go-home/adding-start-button.png)

### Creating the Title React Component

## Making Flying Objects Appear Randomly

### Using CSS Animation to Move Flying Objects

## Making the Cannon Shoot
