---
layout: post
title: "Why You Should Authenticate Users with Centralized Login"
description: "Learn why centralized login is more secure and flexible than embedded login."
date: 2017-10-05 8:30
category: Technical guide, Thing, Thing2, PR, Press
banner:
  text: "Auth0 makes it easy to add authentication to your application."
author:
  name: "Kim Maida"
  url: "https://twitter.com/KimMaida"
  mail: "kim.maida@auth0.com"
  avatar: "https://secure.gravatar.com/avatar/a208cda2b3b21dc8d7896507f5ff60fc"
design:
  image: https://cdn.auth0.com/blog/...
  bg_color: "#"
tags:
- login
- authentication
- best-practices
- security
related:
- date-postname
- date-postname
---

**TL;DR:** A brief synopsis that includes link to a [github repo](http://www.github.com/).

---

## Introduction

High standards of security and ease of use have been set for modern authentication platforms and APIs. Users expect seamless logins that work across apps and entities without requiring them to log in over and over on the same device. Companies and developers expect robust security for their data and top-notch protection for their customers, preferably without incurring intensive implementation or maintenance overhead.

[Auth0](https://auth0.com)'s Identity and Access Management (IAM) platform strives to satisfy these needs. In doing so, we'll cover why using **centralized login** to authenticate your users is the most secure and easy-to-use approach for both developers and users.

### What is Centralized Login?

**Centralized login** refers to a [method of login hosted by the authentication provider](https://auth0.com/docs/hosted-pages/login) for your app or site. A link or button in your app triggers an authentication request and users are then presented with a login experience provided by the authentication provider. Because authentication is taking place on the same domain as the login, credentials are not sent across origins. Centralized login is the most _secure_ way to authenticate users, as well as the most _flexible_. We'll cover <a href="#why-use-centralized-login" target="_self">how and why</a> in much more detail below.

### What is Embedded Login?

**Embedded login** refers to a method of authentication wherein credentials are entered using an experience that is _embedded_ on the app's domain or in a WebView (in the case of native apps). Credentials are then are sent cross-origin to the authentication provider for login. Embedded logins present a range of potential security and implementation challenges, and companies like [Google no longer support this approach with OAuth](https://developers.googleblog.com/2016/08/modernizing-oauth-interactions-in-native-apps.html).

## "A Tale of Scale, Featuring Authentication"

Let's begin with a hypothetical timeline from the perspective of the tech team of an imaginary company with an imaginary product. This story can help us visualize and relate to the challenges many companies face when implementing authentication in a way that doesn't afford enough flexibility.



## <span id="why-use-centralized-login"></span>Why You Should Use Centralized Login

Centralized login has many advantages over an embedded login approach, including better security, improved Single Sign-On, simpler maintainability, native app implementation, and more. Let's explore these in more detail. 

### Security

Cross-origin authentication, MITM attacks

### Single Sign-On

### Easier to Implement and Maintain

Developer ease of use

### Better Experience on Native Mobile

iOS, Android

### User Experience

Customizable UI, CNAME functionality to keep the same domain on centralized login to land before EOY (https://www.notion.so/How-to-setup-a-custom-domain-6f6a376f72ac4fd0830bbbf1f1fa73da)

## When _Not_ to Use Centralized Login

## How to Implement Centralized Login with Auth0

Passwordless?

## Conclusion