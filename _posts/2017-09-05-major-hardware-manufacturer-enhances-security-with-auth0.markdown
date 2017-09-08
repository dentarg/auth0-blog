---
layout: post
title: "Hardware Manufacturer Consolidates Identity with Auth0"
description: "Let's learn how Auth0 helped a major graphics cards manufacturer to consolidate identity for multiple applications."
date: 2017-09-05 15:51
category: Technical Guide, Security
author:
  name: "Bruno Krebs"
  url: "https://twitter.com/brunoskrebs"
  mail: "bruno.krebs@auth0.com"
  avatar: "https://www.gravatar.com/avatar/76ea40cbf67675babe924eecf167b9b8?s=60"
design:
  bg_color: "#3F6426"
  image: https://cdn.auth0.com/blog/spring-boot-auth/logo.png
tags:
- security
- identity
- auth0
related:
- 2017-08-30-battlefy-is-major-player-in-esports-arena-with-help-from-auth0
- 2017-07-21-the-role-of-identity-in-application-modernization
---

## Overview

Throughout this article, we're going to see how a huge graphics cards manufacturer took advantage of Auth0 to consolidate user identities from multiple applications. Before relying on Auth0, each application hosted by the manufacturer had its own identity management. That is, if John Doe had access to more than one app, he would have to manage (and remember) two or more credentials. Of course, he could have the same combination of email and password for all applications. But if, for whatever reason, he had to change the password for one of them, his other accounts wouldn't be affected. Not to say that its personal data, like address, would have to be manually updated on each application.

This kind of scenario, although common, is not good for the end user nor to the apps' owner. From the manufacturer point of view, if they wanted to implement a new security feature, they would have to refactor multiple applications. Even more, if they wanted to communicate with their users, they wouldn't have a single source of truth showing how many distinct users they had or the its personal details (as it could be out of date on one app, and up to date on another).

Gladly for the manufacturer, and for companies with similar scenarios, Auth0 facilitates the consolidation of identities on situations like that.

{% include tweet_quote.html quote_text="Consolidating users from multiple applications is easy with Auth0." %}

## Simulating Multiple Apps

To simulate the manufacturer's scenario, we will use two Node.js applications that are dependent on different databases. There are some users with the same credentials (email and password) on each application and some users that exist on one application but not on the other. When a user exists on both application, some details of its personal data will differ on one account and the other. These differences were created to show how merging profiles from different applications is easy with Auth0.

To follow along this article, and see the profile consolidation in practice, we will just need to [sign up for a free Auth0 account](javascript:signup\(\)) and configure a few settings on it. This Auth0 account will then communicate with both apps, hosted [here](http://node-app-1.tk/) and [here](http://node-app-2.tk/), to perform the following steps:

- Check, during sign in, if a credential is valid or not.
- Check, during a password retrieval or a sign up, if an email address exists on one of the applications.

The credential verification process and the email verification process occur through requests made by Auth0 to both applications. These requests are issued by two [Auth0 rules](https://auth0.com/docs/rules/current) that we will configure in our account. On both cases, if the user does exist and it contains profiles on both application, these profiles are merged and saved on Auth0.

## Consolidating Identity with Auth0


### Creating an Auth0 API

- Sample App
- http://sample-app/
- RS256

### Creating an Auth0 Client

- Non Interactive Clients
- Consolidating Identity

### Creating a Database Connection

- use my own database (custom database)
- Import Users to Auth0 (settings)
