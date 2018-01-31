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

The game that you will develop in this series is called *Aliens, Go Home!* The idea of this game is simple, you will have a cannon and will have to kill flying discs that are trying to invade the Earth. To kill these flying discs you will have to point and click on an SVG canvas to make your cannon shoot.

If you are curious, you can find [the final game up and running here](http://bang-bang.digituz.com.br/). But don't play too much, you have work to do!

## Previously, on Part 1

In the first part of this series, you have used [`create-react-app`](https://github.com/facebookincubator/create-react-app) to bootstrap your React application and you have installed and configured Redux to manage the game state. After that, you have learned how to use SVG with React components while creating game elements like `Sky`, `Ground`, the `CannonBase`, and the `CannonPipe`. In the end, you've added the aiming capability to your cannon by using an event listener and a [JavaScript interval](https://www.w3schools.com/jsref/met_win_setinterval.asp) to trigger a Redux *action* that updates the `CannonPipe` angle.

These accomplishments paved the way to understand how you can create your game (and other animations) with React, Redux, and SVG.

> **Note:** If, for whatever reason, you don't have the code created in the first part of the series, you can simply clone it from [this GitHub repository](https://github.com/auth0-blog/aliens-go-home-part-1). After cloning it, you will be able to follow the instructions in the sections that follow.

## Creating More SVG React Components

### Creating the Cannon Ball React Component

### Creating the Current Score React Component

### Creating the Flying Disc React Component

### Creating the Heart React Component

### Creating the Start Game Button React Component

### Creating the Title React Component

## Making Flying Discs Appear Randomly

### Using CSS Animation to Move Flying Discs

## Making the Cannon Shoot
