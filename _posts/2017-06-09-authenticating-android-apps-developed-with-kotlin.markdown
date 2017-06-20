---
layout: post
title: "Authenticating Android Apps Developed with Kotlin"
description: "Let's learn how to develop a simple Android app, secured with JWTs, that communicates with a RESTful API."
date: 2017-06-09 09:45
category: Technical Guide, Mobile, Android
author:
  name: "Bruno Krebs"
  url: "https://twitter.com/brunoskrebs"
  mail: "bruno.krebs@auth0.com"
  avatar: "https://www.gravatar.com/avatar/76ea40cbf67675babe924eecf167b9b8?s=60"
design:
  bg_color: "#7370B3"
  image: https://cdn.auth0.com/blog/create-kotlin-app/logo.png
tags:
- android
- kotlin
- authentication
- security
related:
- 2016-02-08-how-to-authenticate-on-android-using-social-logins
- 2015-06-29-using-smartlock-on-android-in-3-simple-steps
---

**TL;DR:** On today's post we are going to learn how to create a simple Android application with Kotlin and add JWTs authentication to it. We are going to use Auth0 to issue authentication tokens for us, and will use one of these tokens to communicate with an API. In the end, we will also talk about how we would handle tokens issued by a home made solution, instead of Auth0.

## Is Kotlin a Good Choice for Android Development?

Last May, at the Google I/O keynote, [the Android team announced first-class support for Kotlin](https://blog.jetbrains.com/kotlin/2017/05/kotlin-on-android-now-official/). So, yes, Kotlin is a very good choice for Android development. Otherwise the Android team would never make a move like that. Besides that, [for the last 4 years or so, Android Studio has been based on the IntelliJ Platform](https://blog.jetbrains.com/blog/2013/05/15/intellij-idea-is-the-base-for-android-studio-the-new-ide-for-android-developers/). For those who don't know, [IntelliJ](https://www.jetbrains.com/idea/) is a product from [JetBrains](https://www.jetbrains.com/), the same creator of Kotlin. As such, we can rest assured that, when choosing Kotlin for our next project, the development experience will be very good.

## How Kotlin Differs From Java?

Kotlin is a whole new programming language with a new syntax. A Java developer won't have that much trouble when reading a project's source code written in Kotlin, but there are many differences, and many cool features that Java developers should learn before diving into Kotlin.

If you have never used Kotlin before, you can still follow this blog post along, as it won't have that much advanced subject. But, for the sake of completeness, I share here a list of good resources if you want to study about Kotlin:

- [Kotlin Reference](https://kotlinlang.org/docs/reference/)—where the details of Kotlin's syntax are explained
- [Try Kotlin](https://try.kotlinlang.org)—where you can do some hands on practices to learn Kotlin.
- [Kotlin in Action](https://manning.com/books/kotlin-in-action)—if you want to dive deep into this new language

Besides that, be aware that JetBrains has been investing a lot on tools to help Java developers migrate to Kotlin. For example, IntelliJ and Android Studio 3.0 both are shipped with a tool that automatically translates Java source code to Kotlin.

## Developing an Android App with Kotlin

- Android SDK Platform 25 
