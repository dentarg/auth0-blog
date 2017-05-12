---
layout: post
title: "Google Blocks OAuth Requests Made Via Embedded Browsers"
description: "OAuth authorization requests made to Google via embedded browsers have been blocked by Google."
date: 2017-05-12 08:30
category: Hot Topics, Security
author:
  name: "Prosper Otemuyiwa"
  url: "https://twitter.com/unicodeveloper"
  mail: "prosper.otemuyiwa@auth0.com"
  avatar: "https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200"
design:
  bg_color: "#4A4A4A"
  image: "https://cdn.auth0.com/blog/googleoauth/logo.png"
tags:
- security
- identity
- OAuth
- authorization
- guide
---

Last year, Google warned that starting **April 20, 2017**, it will no longer allow OAuth requests to Google via embedded browsers, otherwise known as web views. Before now, developers could successfully use web views such as the WebView UI element in Android, UIWebView/WKWebView in iOS, and the equivalents on Windows and OS X to make OAuth requests to Google.

In November, 2016, Google added a notification to their iOS consent page to create awareness amongst developers of the forthcoming deprecation. Earlier this year, **March 2017**, Google added the same notification on the Android consent page.

As of April 20, 2017, Google has blocked OAuth authorization requests via web views. Unfortunately, a lot of developers have not migrated their current apps away from using embedded browsers to make such requests. Therefore, users trying to use their Google accounts to sign in to third party apps that still make use of web views for OAuth logins constantly get the dreaded **403 disallowed_useragent** error like the one below:

![403 error](https://cdn.auth0.com/blog/403/403error.jpeg)

---

## Solution for Users and Developers

One way to fix this challenge is for developers to upgrade their apps to use the recommended **Google Sign-in** SDK for sign-in and OAuth with Google Accounts for [Android](https://developers.google.com/identity/sign-in/android) and [iOS](https://developers.google.com/identity/sign-in/ios).

Another option is to make use of *AppAuth* (open source OAuth client library) for [Android](http://openid.github.io/AppAuth-Android), [iOS and OSX](http://openid.github.io/AppAuth-iOS).

Google also offers [GTMAppAuth library](https://github.com/google/GTMAppAuth)(iOS and OSX), which enables you to use [AppAuth](http://openid.github.io/AppAuth-iOS) with the [Google Toolbox for Mac - Session Fetcher](https://github.com/google/gtm-session-fetcher) and [Google APIs Client Library for Objective-C For REST](https://github.com/google/google-api-objectivec-client-for-rest) libraries by providing an implementation of `GTMFetcherAuthorizationProtocol` for authorizing requests with AppAuth.

Windows developers can check the [OAuth for Apps: Windows Samples](https://github.com/googlesamples/oauth-apps-for-windows) to learn how to use the device browser (and not an embedded browser) to implement an OAuth Authorizatiom flow to Google in a native app. These are the specific samples:

* [OAuthUniversalApp](https://github.com/googlesamples/oauth-apps-for-windows/blob/master/OAuthUniversalApp/README.md) - Universal Windows Platform app sample.
* [OAuthDesktopApp](https://github.com/googlesamples/oauth-apps-for-windows/blob/master/OAuthDesktopApp/README.md) - Traditional desktop app sample, **WPF(Windows Presentation Foundation)**.
* [OAuthConsoleApp](https://github.com/googlesamples/oauth-apps-for-windows/blob/master/OAuthConsoleApp/README.md) - Console application sample.

## Aside: Using Auth0

One of the most complex features to implement in an application is user authentication and identity management. Auth0 ships by default with the ability to use device browsers (and not embedded browsers) for Google Sign-in and OAuth with Google accounts. As a developer, using companies like Auth0 to implement this functionality saves you a lot of headache. You won't have to care about changes in the implementation, as Auth0 will take care of them.

![Auth0 hosted login screen](https://cdn2.auth0.com/blog/angular-aside/angular-aside-login.jpg)

Check out how to us Auth0 Lock for [Web](https://auth0.com/docs/libraries/lock/v10), [iOS](https://auth0.com/docs/libraries/lock-ios/v2), and [Android](https://auth0.com/docs/libraries/lock-android). Also check out our [quickstarts](https://auth0.com/docs/quickstart/).  

## Conclusion

Switching away from embedded browsers might be a bit of work, but it provides a large user benefit. This should increase the conversion rate of your sign-in flow because users who are already signed into Google will be able to sign into your app via the tap of a single button. Furthermore, users will experience a smooth login experience, as those that are not signed in will have to sign into Google for the first app they use, but then won't have to sign in again for subsequent apps.

