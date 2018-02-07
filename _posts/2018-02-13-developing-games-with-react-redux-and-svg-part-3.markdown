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
