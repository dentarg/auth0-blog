---
layout: post
title: "Authentication Best Practices: Centralized Login"
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
- centralized-login
related:
- 2017-10-19-oauth-2-best-practices-for-native-apps
---

**TL;DR:** Centralized login is the best practice strategy for authenticating with a provider. Learn why centralized login is the most secure and flexibile approach. You can explore an authenticated MEAN stack application with Auth0 centralized login and passwordless at the [messageboard GitHub repo here](https://www.github.com/auth0-blog/messageboard).

---

## Introduction

High standards of security and ease of use have been set for modern authentication platforms and APIs. Users expect seamless logins that work across apps and entities without requiring them to log in over and over on the same device. Companies and developers expect robust security for their data and top-notch protection for their customers, preferably without incurring intensive implementation or maintenance overhead.

[Auth0](https://auth0.com)'s Identity and Access Management (IAM) platform strives to satisfy these needs. In doing so, we'll cover why using **centralized login** to authenticate your users is the most secure and easy-to-use approach for both developers and users.

### What is Centralized Login?

**Centralized login** refers to a [method of login hosted by the authentication provider](https://auth0.com/docs/hosted-pages/login) for your app or site. A link or button in your app triggers an authentication request and users are then presented with a login experience provided by the authentication provider. Because authentication is taking place on the same domain as the login, credentials are not sent across origins. Centralized login is the most _secure_ way to authenticate users, as well as the most _flexible_. We'll cover <a href="#why-use-centralized-login" target="_self">how and why</a> in much more detail below.

### What is Embedded Login?

**Embedded login** refers to a method of authentication wherein credentials are entered via an experience that is _embedded_ on a web app's domain or in a WebView (in the case of native apps). Credentials are then sent to the authentication provider for login. In a web app, this is a _cross-origin_ request. Embedded logins present a range of potential security and implementation challenges that cause issues for developers and users; as a matter of fact, [Google no longer supports an embedded approach when implementing OAuth](https://developers.googleblog.com/2016/08/modernizing-oauth-interactions-in-native-apps.html).

## A Tale of Two Companies

Let's begin with two hypothetical timelines from the perspective of tech teams at companies with imaginary products. These examples can help us visualize and relate to the challenges presented when implementing authentication in a way that doesn't afford enough flexibility.

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

These scenarios are simplified, but they still demonstrate a few of the advantages of starting with centralized login and [OAuth protocols](https://tools.ietf.org/html/draft-ietf-oauth-native-apps-12) from the beginning. Doing so helps you future-proof your applications, making it easy to grow and integrate with other systems.

## <span id="why-use-centralized-login"></span>Why Centralized Login is Best Practice

Centralized login has many advantages over an embedded login approach, including better security, improved Single Sign-On, simpler maintainability, native app implementation, and more. Let's explore these in more detail.

### Security

Centralized login is more secure than embedded login. Authentication takes place over the same domain, eliminating cross-origin requests. Cross-origin authentication is inherently more dangerous. Collecting user credentials in an application served from one origin and then sending them to another origin can present certain security vulnerabilities. [Phishing attacks](https://auth0.com/blog/all-you-need-to-know-about-the-google-docs-phishing-attack/) are more likely, as are [man-in-the-middle attacks](https://auth0.com/docs/security/common-threats#man-in-the-middle-mitm-attacks). Centralized login does not send information between origins, thereby negating cross-origin concerns.

Embedded user agents are unsafe for third parties, including the authorization server itself. If an embedded login is used, the app has access to both the authorization grant and the user's authentication credentials. As a consequence, this data is left vulnerable to recording or malicious use.

### Single Sign-On

Centralized login orchestrates single sign-on between multiple apps while providing cookies from the same origin. Once a user has logged in using a centralized login, a cookie is created and stored. Any future calls to the authentication provider's authorization endpoint will then check the cookie. If the user has already signed on, the login page will not be shown again and the user will be logged in via SSO. On the other hand, embedded user agents don't share authentication state, meaning that they cannot be used for SSO.

### Easier to Implement and Maintain

Centralized login is easier to implement as well as maintain for app developers. Cross-origin authentication is inherently more dangerous, but centralized login mitigates this risk entirely. A centralized login page is already fully implemented, negating the need for the developer to build out the login UI if a custom UI is not required. The authorization server providing the centralized login page can also ensure a consistent and secure experience across all apps that utilize it.

### Best Practice on Native Mobile

The [OAuth 2.0 Best Current Practice for Native Apps RFC](https://www.rfc-editor.org/rfc/rfc8252.txt) requires that _only_ external user agents, such as centralized login, should be used for authenticating with OAuth 2.0 in native mobile applications. This is considered best practice for reasons cited above, including security and single sign-on. You can [read more about the OAuth 2.0 BCP for Native Apps here](https://auth0.com/blog/oauth-2-best-practices-for-native-apps/).

### User Experience

Centralized login has clear benefits for security and maintainability. It also provides a comfortable and consistent user experience that confers the benefits of SSO. With Auth0, the [centralized login](https://auth0.com/docs/hosted-pages/login) page is a [fully customizable UI](https://auth0.com/docs/hosted-pages/login#3-customization). In addition, Auth0's [CNAME](https://en.wikipedia.org/wiki/CNAME_record) functionality to persist the same domain across the centralized login page and the app is scheduled to launch before the end of 2017. Modern users are very familiar with being redirected to an authorization provider's login page to authenticate (e.g., Google or Facebook OAuth), in turn gaining the benefits of single sign-on and not being required to repeatedly log into other apps on the same device as long as they are using the same authentication provider.

## Aside: How to Implement Centralized Login and Passwordless with Auth0

![Auth0 centralized login with email passwordless](https://cdn.auth0.com/blog/centralized-login/auth0_login_passwordless-email.jpg)

## Conclusion