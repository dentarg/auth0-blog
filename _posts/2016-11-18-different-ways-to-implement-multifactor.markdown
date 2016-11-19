---
layout: post
title: "What are the different ways to implement multifactor"
description: "Learn how to implement multifactor authentication in different ways!"
date: 2016-11-18 08:30
category: Technical guide, Authentication, Multifactor
author:
  name: "Prosper Otemuyiwa"
  url: "https://twitter.com/unicodeveloper"
  mail: "prosper.otemuyiwa@auth0.com"
  avatar: "https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200"
design:
  bg_color: "#000000"
  image: "https://cdn.auth0.com/blog/MFALogo.png"
tags:
- Authentication
- Multifactor
- TOTP
---

**TL;DR:** Multifactor authentication involves providing an extra layer of security by ensuring users provide more than one piece of information for identification. It typically requires a combination of something the user knows (such as pins, passwords, secret questions) and something the user has (such as cards, hardware tokens, phone). Worthy of note is that two-factor authentication is the most used type of multifactor authentication (MFA). More information about [Multifactor Authentication (MFA) can be found here](https://auth0.com/docs/multifactor-authentication).

In this article we will go over why we should implement multifactor authentication and the different ways to implement it.

## Why should we implement Multifactor Authentication?

There have been several cases of stolen and hacked passwords. Systems with just simple username and password combinations getting hacked have been on the rise. In this situation, implementing multifactor authentication will prevent hackers from gaining access to your accounts even if your password is stolen. The extra layer of protection that **MFA** offers ensure that your account is more secure!

## What are the different ways to implement Multifactor?

I'll highlight various ways to implement multifactor below and an in-depth analysis of the process will be provided in the later part of this post. I'll cover multifactor via:

* **Time-based One-Time Password (TOTP)**
* **Short Message Service (SMS)**
* **Electronic Mail (Email)**
* **Push Notifications**

##How Time-based One-Time Password Works

TOTP involves the generation of a one-time password from a shared secret key and the current timestamp using a specific kind of cryptographic function. These cryptographic functions can vary across the board. A simple example of a cryptographic function is [*SHA-256*](https://en.wikipedia.org/wiki/SHA-2). TOTP is defined in [RFC 6238](https://tools.ietf.org/html/rfc6238). The process flow for a typical multifactor application using *TOTP* involves the **enrollment** and **login** processes.

The **enrollment** process is as follows:

* A user logs into a website/app with a username and password.
* If the credentials are valid, the next stage involves enabling [two-factor authentication](https://auth0.com/learn/two-factor-authentication/) for the user.
* A shared-key is requested (in form of text or QR code)
* The key is stored by an app that implements TOTP such as [**Google Authenticator**](https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en), or [**Auth0 Guardian**](https://auth0.com/blog/announcing-Auth0-Guardian-a-new-way-to-login/)
* Two-factor authentication is enabled.

The **login** process is as follows:

* A user logs into a website/app with a username and password.
* If the credentials are valid, the user is directed to another form where he/she is required to enter a one-time code generated from **Google Authenticator** or **Auth0 Guardian.**
* The server verifies that the code is valid and finally authenticates the user.

![Multifactor Flow Chart](https://cdn.auth0.com/blog/twofa/Flowchart.png)

An alternative implementation is the use of [**RSA** Keys](https://tools.ietf.org/html/draft-rsa-dsa-sha2-256-03). RSA authentication is basically based on two factors: A password/pin and an authenticator. The authenticator might be a [hardware](http://hitachi-id.com/concepts/hardware_token.html) or [software token](https://en.wikipedia.org/wiki/Software_token). A hardware or software token is assigned to a user. During login, after entering the password/pin, the user clicks on the token and an authentication code is generated at fixed intervals (usually about 60seconds) using a built-in clock and the device's factory-encoded random key. The key is different for each token and is loaded into the corresponding RSA Authentication Manager.

**Note:** The generated codes are time-based so the client and the server need to synchronize their clocks for this to work efficiently.

##How Short Message Service (SMS) Works

The process for a typical multifactor application using SMS also involves the **enrollment** and **login** stages.

The **enrollment** process is as follows:

* A user logs into a website/application with a username and password.
* A user is asked to enter a valid phone number, probably in the *settings* page.
* A unique one-time code is generated on the server and then sent to the phone number.
* The user enters the code into the app and multifactor is enabled.

The **login** process is as follows:

* A user logs into a website/application with a username and password.
* A unique one-time code is generated on the server and then sent to the registered user's phone number.
* The user enters the code into the app.
* If it's valid, the user is authenticated and a session is initiated.

##How Electronic Mail (Email)

The process for a typical multifactor application using email is as follows:

* A user logs into a website/application with a username and password.
* A unique one-time code is generated on the server and sent via email to the user.
* The user retrieves the code from the email and enters the code into the app.
* If it's valid, the user is authenticated and a session is initiated.

##How Push Notifications Work

The process for a typical multifactor application using push notification is as follows:

* A user logs into a website/application with a username and password.
* Typically, push notifications work with applications such as [**Auth0 Guardian**](https://auth0.com/blog/announcing-Auth0-Guardian-a-new-way-to-login/). A push notification is sent to the Guardian app on your mobile device.
* This notification is a login request.
* It includes information such as the application name, the OS and browser of the request, the location and the date of the request.
* The user accepts the request & automatically the user becomes logged in.

##Aside: Different ways to implement multifactor with Auth0

Implementing multifactor with Auth0 is a breeze. The various ways to implement multifactor with Auth0 are as follows:

* **Push Notifications with Auth0 Guardian:** Guardian offers a frictionless approach to implementing MFA for your apps, and provides a full MFA experience without requiring integration with third-party utilities. You can find out how to implement [push notifications with Auth0 Guardian](https://auth0.com/docs/multifactor-authentication/guardian)
* **SMS:** Auth0 supports [sending an SMS with a one-time password code](https://auth0.com/docs/multifactor-authentication/guardian/admin-guide#support-for-sms) to be used for another step of verification.
* **TOTP with Google Authenticator and Duo:** Learn how to enable [Google Authenticator](https://auth0.com/docs/multifactor-authentication/google-authenticator) and [Duo Security](https://auth0.com/docs/multifactor-authentication/duo)
* [Custom Providers such as *Yubikey*](https://auth0.com/docs/multifactor-authentication/yubikey)
* [Contextual MFA with custom scripted rules](https://auth0.com/docs/multifactor-authentication#mfa-using-custom-rules)

[Sign up](https://auth0.com/signup) for a free account today and enjoy fast, seamless, hassle-free multifactor authentication in your apps.

##Conclusion

We have covered the different ways of implementing multifactor authentication in an application. Sign up for Auth0 and add that extra layer of security to your apps today!