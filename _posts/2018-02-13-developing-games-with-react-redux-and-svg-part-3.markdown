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
