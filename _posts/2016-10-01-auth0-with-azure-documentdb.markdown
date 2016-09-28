---
layout: post
title: "Planet-scale authentication with Auth0 and Azure DocumentDB"
description: Learn how to integrate Azure DocumentDB as your Auth0's custom user database and take advantage of this blazing fast cloud NoSQL database service.
date: 2016-10-01 12:00
design:
  bg_color: "#000000"
  image: https://cdn.auth0.com/blog/aspnet-core-web-apis/swagger.png
author:
  name: Matías Quaranta
  url: http://twitter.com/ealsur
  mail: ealsur@ealsur.com.ar
  avatar: https://s.gravatar.com/avatar/7752008352217db815996ab04aec46e6?s=80
tags:
- azure
- mongodb
- documentdb
- authentication
related:
- 2016-06-03-add-auth-to-native-desktop-csharp-apps-with-jwt
- 2016-06-13-authenticating-a-user-with-linkedin-in-aspnet-core
---

---

**TL;DR:** In this article you will learn how to integrate Auth0 with the fast and scalable Azure DocumentDB as a custom database connection and use it on your Auth0 Applications.

---

Auth0 offers a highly performant and secure user store to maintain your users’ profiles; it is also a common scenario if you want to **store** your users’ login information in your **own database** where you keep all of your application's data, in this case, Auth0 provides you with several identity providers you can use to **integrate**. One such database is **Azure DocumentDB**, a blazing fast **NoSQL** service for highly available and globally distributed applications.

During this article, we will guide you into **integrating Auth0 and Azure DocumentDB** so your users' profiles are stored on your cloud NoSQL database.

