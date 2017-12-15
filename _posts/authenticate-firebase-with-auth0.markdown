---
layout: post
title: "Title Should be Less Than 56 characters"
description: "Description goes here and must be less than 156 characters."
date: 2017-12-20 8:30
category: Technical guide, Firebase, Angular
banner:
  text: "Auth0 makes it easy to add authentication to your Angular application."
author:
  name: "Kim Maida"
  url: "https://twitter.com/KimMaida"
  mail: "kim.maida@auth0.com"
  avatar: "https://secure.gravatar.com/avatar/a208cda2b3b21dc8d7896507f5ff60fc"
design:
  image: https://cdn.auth0.com/blog/...
  bg_color: "#"
tags:
- firebase
- angular
- tokens
- node
- api
- angularfire2
- angularfire
- real-time-database
- rtdb
- real-time
- async
- auth0
- authentication
- centralized-login
related:
- date-postname
- date-postname
---

**TL;DR:** A brief synopsis that includes link to a [github repo](http://www.github.com/).

---

## Introduction

In this series of tutorials, we'll learn how to build an application that secures a Node backend and an Angular front-end with [Auth0](https://auth0.com) authentication. Our server and app will also authenticate a [Firebase](https://firebase.google.com) database with custom tokens so that users can leave comments in realtime in a secure manner after logging in with Auth0.

### What is Firebase?

Firebase is 

### Choosing Auth0+Firebase Authentication vs. Basic Firebase Auth

One great question that you might be asking is: why would we implement Auth0 with custom tokens in Firebase instead of sticking with [Firebase's built-in authentication](https://firebase.google.com/docs/auth/) by itself?

Firstly, there is an important distinction to make here. Using Auth0 to secure Firebase does not mean you are _not_ using Firebase auth. Firebase has a [custom auth approach](https://firebase.google.com/docs/auth/web/custom-auth) that allows developers to integrate their preferred authentication solution _with_ Firebase auth. This approach enables developers to implement Firebase auth so that it functions seamlessly with proprietary systems or other authentication providers.

There are many potential reasons we might want to integrate Auth0 with Firebase authentication. Alternatively, there are scenarios where using basic Firebase auth by itself could suffice. Let's explore.

You can use **Firebase's built-in authentication by itself** if you:

* Only want to authenticate Firebase RTDBs or Firestore and have no need to authenticate additional backends
* Only need a small handful of login options and do not need enterprise identity providers, integration with your own user storage databases, etc.
* Do not need robust user management, profile enrichment, etc. and are comfortable [managing users strictly through an API](https://firebase.google.com/docs/auth/web/manage-users)
* Have no need to customize authentication flows
* Do not need to adhere to compliance regulations regarding the storage of user data

You should use **Auth0 with a custom token** approach in Firebase if you:

* Already have Auth0 implemented and want to add realtime capabilities to your app
* Need to easily use issued tokens to [secure a backend](https://auth0.com/docs/apis) that is _not_ provided by Firebase
* Need to integrate [social identity providers](https://auth0.com/docs/identityproviders#social) beyond just Google, Facebook, Twitter, and GitHub
* Need to integrate [enterprise identity providers](https://auth0.com/docs/identityproviders#enterprise), such as Active Directory, LDAP, ADFS, SAMLP, etc.
* Need a [customized authentication flow](https://auth0.com/docs/rules/current)
* Need robust [user management with APIs and/or a dashboard](https://auth0.com/docs/users)
* Want to be able to dynamically [enrich user profiles](https://auth0.com/docs/monitoring/track-signups-enrich-user-profile-generate-leads)
* Want features like customizable [passwordless login](https://auth0.com/docs/connections/passwordless), [multifactor authentication](https://auth0.com/docs/multifactor-authentication), [breached password security](https://auth0.com/docs/anomaly-detection/breached-passwords), [anomaly detection](https://auth0.com/docs/anomaly-detection), etc.
* Must adhere to [compliance regulations](https://auth0.com/docs/compliance) such as HIPAA, GDPR, SOC2, etc.

Essentially, Firebase's basic authentication solution should suffice if you have a very simple app with bare-bones authentication needs and are only using Firebase databases. However, should you need more than that, [Firebase offers a great way to use their services _with_ other authentication solutions](https://firebase.google.com/docs/admin/setup). This is a much more realistic scenario that many developers will be faced with, so we'll explore it in detail here.

## What We'll Build

We're going to build a Node.js API secured with Auth0 that mints custom Firebase tokens and also returns data on ten different dog breeds.

We'll also build an Angular front-end app called "Popular Dogs" that displays information about the ten most popular dogs in 2016, as ranked by public popularity by the American Kennel Club. Our app will call the Node API to fetch dog data, and it will also call the API to acquire Firebase tokens to authorize users to add and delete comments in realtime on the popular dogs list.

Let's get started!

## Dependencies and Setup

## Node API

### Create New Angular Project

```bash
$ ng new angular-firebase --routing --skip-tests
```

### Install Dependencies

```bash
$ npm install auth0-js@latest firebase@latest angularfire2@latest --save
```


      
  