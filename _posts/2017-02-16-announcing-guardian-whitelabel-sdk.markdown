---
layout: post
title: "Announcing the Guardian Whitelabel SDK"
description: "Learn about the Guardian Whitelabel SDK and how you can easily build your own authenticator leveraging our battle-tested solution."
date: 2017-02-16 08:30
category: Announcement, Feature, Guardian
press_release: true
design:
  bg_color: "#222228"
  image: https://cdn.auth0.com/blog/guardian/Guardianlogo.png
author:
  name: "Prosper Otemuyiwa"
  url: "http://twitter.com/unicodeveloper?lang=en"
  mail: "prosper.otemuyiwa@auth0.com"
  avatar: "https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200"
tags:
- guardian
- auth0
- totp
- whitelabel
- sdk
- authenticator
related:
- 2016-09-28-announcing-identity-glossary
- 2016-08-25-announcing-Auth0-Guardian-a-new-way-to-login
- 2016-08-24-announcing-password-breach-detection
---

On November 23, 2016, we tagged the first release of [Guardian for iOS](https://github.com/auth0/Guardian.swift) and [Android](https://github.com/auth0/Guardian.Android), a whitelabel SDK to help users, developers, and organizations build their own authenticator and Guardian-like applications. Read on to find out how it works and how you can use it in your projects!

{% include tweet_quote.html quote_text="The Guardian Whitelabel SDK helps you build your own authenticator and Guardian-like applications." %}


## White-label Multifactor

You can use the Guardian Mobile SDKs - available for [iOS](https://auth0.com/docs/multifactor-authentication/developer/libraries/ios) and [Android](https://auth0.com/docs/multifactor-authentication/developer/libraries/android) to build your own white-label multifactor authentication application with complete control over the branding and look-and-feel.

![White label Multifactor](https://auth0.com/pages/guardian/assets/sdk.png)

## Guardian

[Guardian](https://auth0.com/docs/multifactor-authentication/guardian) is Auth0's multifactor authentication solution that provides a simple and secure way to implement Multifactor Authentication. It also supports [push notifications](https://auth0.com/docs/multifactor-authentication/administrator/push-notifications), removing the need for one time pass codes for a truly frictionless multifactor experience. 

<video autoplay loop width="600">
    <source src="https://cdn.auth0.com/blog/guardian/guardian-2.m4v"/>
</video>

The Guardian app can be downloaded from the [App Store](https://itunes.apple.com/us/app/auth0-guardian/id1093447833) or from [Google Play](https://play.google.com/store/apps/details?id=com.auth0.guardian).

With the Guardian SDK([iOS](https://github.com/auth0/Guardian.swift) and [Android](https://github.com/auth0/Guardian.Android)), you can build your own custom mobile applications that works like *Guardian* or integrate some Guardian functionalities, such as receiving *Push Notifications* in your existing mobile applications. 

A typical scenario could be: While building a banking app, you can make use of the Guardian SDK in your existing mobile app to receive and confirm push notifications when someone performs an ATM  transaction.

## How can I use it? 

Take a look at the [iOs](https://auth0.com/docs/multifactor-authentication/developer/libraries/ios) and [Android](https://auth0.com/docs/multifactor-authentication/developer/libraries/android) docs. You can also just enable push notifications and SMS by toggling the buttons below from the Auth0 [dashboard](management.auth0.com).

![Enable Push Notifications and SMS](https://cdn.auth0.com/blog/guardian/enable.png)
_Push Notifications and SMS_

## Conclusion

The Guardian Mobile SDK opens up a myriad of opportunities for developers and organizations wishing to leverage an already secure, tested and existing solution for building and enhancing their mobile apps. Try it today!
