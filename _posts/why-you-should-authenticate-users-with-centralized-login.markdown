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

**Embedded login** refers to a method of authentication wherein credentials are entered via an experience that is _embedded_ on a web app's domain or in a WebView (in the case of native apps). Credentials are then sent to the authentication provider for login. In a web app, this is a _cross-origin_ request. Embedded logins present a range of potential security and implementation challenges that cause issues for developers and users; as a matter of fact, [Google no longer supports an embedded approach when implementing OAuth](https://developers.googleblog.com/2016/08/modernizing-oauth-interactions-in-native-apps.html).

## A Tale of Two Companies

Let's begin with two hypothetical timelines from the perspective of tech teams at companies with imaginary products. These examples can help us visualize and relate to the challenges many companies face when implementing authentication in a way that doesn't afford enough flexibility.

### Company A

The engineering team at our first make-believe company (let's call them Company A) has produced the following timeline of sentiments:

* **Year 0**: We're building an online video streaming service. Login is performed using an embedded username and password form on the homepage.
* **Year 1**: We're doing great! People love our service. We're now developing an API so that third party tools can upload videos to the service.
* **Year 2**: Due to high demand, we're building native mobile apps for Android and iOS. Users need to sign in every time they open the app.
* **Year 3**: We've been acquired by Google! However, our proprietary authentication does _not_ integrate easily with other systems. It's become a nightmare to overhaul authentication for our site, mobile apps, and APIs! 😩

### Company B

Now let's consider a second make-believe company called Company B. Their engineering team's timeline looks like this:

* **Year 0**: We're building an online photo storage and sharing service. Login is centralized and implemented with OAuth 2.0 and Google as a social Identity Provider (IdP).
* **Year 1**: We're doing great! People love our service. We're now developing an API so that third party tools can upload photos to the service. API security and third party authentication has been easy with OAuth.
* **Year 2**: Due to high demand, we're building native mobile apps for Android and iOS. We avoided authenticating our mobile apps in embedded WebView. This way, our users won't have to sign in again if they're already authenticated on their phone with another app that uses Google OAuth.
* **Year 3**: We've been acquired by Google! Integration was fast and easy! 🎉

These scenarios are heavily simplified, but they still demonstrate a few of the advantages of starting with centralized login and [OAuth protocols](https://tools.ietf.org/html/draft-ietf-oauth-native-apps-12) from the beginning. Doing so helps you future-proof your applications, making it easy to grow and integrate with other systems.

## <span id="why-use-centralized-login"></span>Why Centralized Login is Considered Best Practice

Centralized login has many advantages over an embedded login approach, including better security, improved Single Sign-On, simpler maintainability, native app implementation, and more. Let's explore these in more detail.

### Security

Centralized login is more secure than embedded login. Authentication takes place over the same domain, eliminating cross-origin requests. Cross-origin authentication is inherently more dangerous. Collecting user credentials in an application served from one origin and then sending them to another origin can present certain security vulnerabilities. [Phishing attacks](https://auth0.com/blog/all-you-need-to-know-about-the-google-docs-phishing-attack/) are more likely, as are [man-in-the-middle attacks](https://auth0.com/docs/security/common-threats#man-in-the-middle-mitm-attacks). Centralized login does not send information between origins, thereby negating cross-origin concerns.

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