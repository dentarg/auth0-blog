---
layout: post
title: "Authentication Provider Best Practices: Centralized Login"
description: "Learn why centralized login is the most secure, standards-based strategy when authenticating with a provider."
date: 2017-12-12 8:30
category: Technical guide, Centralized login
banner:
  text: "Auth0 makes it easy to add authentication to your application."
author:
  name: "Kim Maida"
  url: "https://twitter.com/KimMaida"
  mail: "kim.maida@auth0.com"
  avatar: "https://secure.gravatar.com/avatar/a208cda2b3b21dc8d7896507f5ff60fc"
design:
  image: https://cdn.auth0.com/blog/centralized-login/logo.png
  bg_color: "#420973"
tags:
- login
- authentication
- best-practices
- security
- centralized-login
- mobile
related:
- 2017-10-19-oauth-2-best-practices-for-native-apps
- 2017-05-11-google-blocks-oauth-requests-from-embedded-browsers
- 2017-11-22-using-centralized-login-to-add-authentication-to-your-ios-apps
---

**TL;DR:** To maintain a successful application, sooner rather than later you will need a centralized account system, as opposed to embedding login within your application. This is more secure, standard-based, maintainable, and future proof. This is where the industry is moving, and in this post, we will explore this trend.

---

## Introduction

High standards of security and ease of use have been set for modern authentication platforms and APIs. Users expect seamless logins that work across apps and entities without requiring them to log in over and over on the same device. Companies and developers expect robust security for their data and top-notch protection for their customers, preferably without incurring intensive implementation or maintenance overhead.

### What is Centralized Login?

**Centralized login** refers to a [method of login hosted by the authentication provider](https://auth0.com/docs/hosted-pages/login) for your app or site. A link or button in your app triggers an authentication request and users are then presented with a login experience provided by the authentication provider. Because authentication is taking place on the same domain as the login, credentials are not sent across origins. Centralized login is the most _secure_ way to authenticate users, as well as the most _standards-based_. We'll cover <a href="#why-use-centralized-login" target="_self">how and why</a> in much more detail below.

### What is Embedded Login?

**Embedded login** refers to a method of authentication wherein credentials are entered via an experience that is _embedded_ on an app's domain with text inputs and are then sent to an authentication provider for verification and login. This is a _cross-origin_ request. Embedded logins present a range of potential security and implementation challenges that cause issues for developers and users; as a matter of fact, [Google no longer supports an embedded approach when implementing OAuth](https://auth0.com/blog/google-blocks-oauth-requests-from-embedded-browsers/).

### What Do Centralized and Embedded Login Look Like?

![centralized vs. embedded login](https://cdn.auth0.com/blog/centralized-login/centralized-embedded-diagram.jpg)

1. **Centralized Login** - When clicking a button or link to authenticate in both the browser and native app, the centralized login URL at [accounts.google.com](https://accounts.google.com) is loaded.
2. **Embedded Login** - When clicking a button or link to authenticate in the browser, an overlay modal is opened on the same domain, prompting the user to log in. The mobile app also displays input fields within the app.

## Why Centralized Login is a Long-Term Investment

Let's look at a hypothetical example using a timeline from an imaginary company. Let's say our make-believe company, "SourceCentral", provides public and private source control repository hosting. Their timeline looks something like this:

![Hypothetical timeline for a service switching to centralized login](https://cdn.auth0.com/blog/centralized-login/timeline2.png)

* **Year 0: Launch!** We launched a source control repository hosting service. Our homegrown authentication is working out alright for our needs, since we are still small and only have one service.
* **Year 1: Going native** Lots of people have signed up and outlook is great! People love our service. We are launching native Android and iOS mobile apps as well as desktop apps for Windows and MacOS, and we need to implement login for all of them.
* **Year 1.5: APIs** We're now developing an API so that we can better serve our customerbase of developers who want to be able to integrate our service with third parties, but...
* **Year 2: Auth for third parties** Authentication has been a huge challenge now that we have an API that requires authorization as well as several apps and third party integrations. 😧 To address the complexities and issues this is presenting, we're implementing OAuth in order to provide a much more _centralized_ authentication and authorization process for our product and APIs.
* **Year 3: SSO** With a centralized login approach, we're now able to leverage Single Sign-On. Our customers love this. This was easy with a centralized login; instead of having to change every single service, we only had to do it once! It's much easier to maintain and enhance.
* **Year 4: Multi-factor Authentication** Our users demand more security, so we're adding Multi-factor Authentication. We can do this for all our apps at once using centralized login!
* **Years 5, 6, etc: Growing and scaling!** We're rolling out new properties and apps at a steady pace. We have a desktop app, a community, chat hosting for repositories, and several other services as well. Securing and authenticating all our new services is a non-issue with centralized authentication! 🎉

This is a hypothetical timeline, but many companies have undergone very similar processes over the years, including (in case you haven't already guessed!) [GitHub](https://github.com). Implementing centralized login is a long-term investment. Doing so _early_ paves the way for growth, development, maintainability, and new feature integration far into the future.

{% include tweet_quote.html quote_text="Centralized login is a long-term investment. Implementing early paves the way for growth and new feature integration far into the future." %}

## <span id="why-use-centralized-login"></span>Why Centralized Login is Best Practice

Centralized login has many advantages over an embedded login approach, including better security, single sign-on benefits, simpler maintainability, modern user experience, and more. Let's explore these in more detail.

{% include tweet_quote.html quote_text="Centralized login provides security, SSO, maintainability, best practice native app implementation, and more." %}

### Security

Centralized login is more secure than embedded login. Authentication takes place over the same domain, eliminating cross-origin requests. Cross-origin authentication is inherently more dangerous. Collecting user credentials in an application served from one origin and then sending them to another origin can present certain security vulnerabilities. [Phishing attacks](https://auth0.com/blog/all-you-need-to-know-about-the-google-docs-phishing-attack/) are more likely, as are [man-in-the-middle attacks](https://auth0.com/docs/security/common-threats#man-in-the-middle-mitm-attacks). Centralized login does not send information between origins, thereby negating cross-origin concerns.

Embedded user agents are unsafe for third parties, including the authorization server itself. If an embedded login is used, the app has access to both the authorization grant and the user's authentication credentials. As a consequence, this data is left vulnerable to recording or malicious use. Even if the app is trusted, allowing it to access the authorization grant as well as the user's _full_ credentials is unecessary. This violates the [principle of least privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege) and increases the potential for attack.

### Single Sign-On

Centralized login orchestrates [single sign-on](https://auth0.com/docs/sso/current) (SSO) between multiple apps while providing cookies from the same origin. Once a user has logged in using a centralized login, a cookie is created and stored. Any future calls to the authentication provider's authorization endpoint will then check the cookie. If the user has already signed on, the login page will not be shown again and the user will be logged in via SSO. On the other hand, embedded user agents don't share authentication state, meaning that they cannot be used for SSO.

![centralized login with Google](https://cdn.auth0.com/blog/centralized-login/google-login.jpg)

### Easier to Implement and Maintain

Centralized login is easier to implement as well as maintain for app developers. Cross-origin authentication is inherently more dangerous, but centralized login mitigates this risk entirely. Developers do not need to manage the dangers of cross-origin attack vectors if they use centralized login instead of embedded login. A centralized login page is also already fully implemented, negating the need for the developer to build out their own embedded login UI. The authorization server providing the centralized login page can also ensure a consistent and secure experience across all apps that utilize it.

### Best Practice on Native Mobile

The [OAuth 2.0 Best Current Practice for Native Apps RFC](https://www.rfc-editor.org/rfc/rfc8252.txt) requires that _only_ external user agents, such as centralized login, should be used for authenticating with OAuth 2.0 in native mobile applications. This is considered best practice for reasons cited above, including security and single sign-on. You can [read more about the OAuth 2.0 BCP for Native Apps here](https://auth0.com/blog/oauth-2-best-practices-for-native-apps/).

<p style="text-align: center; font-size: 16px;"><img src="https://cdn.auth0.com/blog/centralized-login/google-login-mobile.jpg" alt="Google login on mobile app"><br>
<em>Native mobile apps that use OAuth 2.0 (such as Gmail, YouTube, and others) use the device browser as an external user agent for centralized login.</em></p>

### User Experience

Modern users are comfortable with signing in at the authorization provider's centralized login page to authenticate (e.g., OAuth with Google, Facebook, GitHub, etc.), in turn gaining the benefits of single sign-on and not being required to repeatedly log into other apps on the same device as long as they are using the same authentication provider.

![centralized login with Facebook](https://cdn.auth0.com/blog/centralized-login/facebook-login.jpg)

These login pages are on the authorization provider's domain. However, most people don't even notice the redirect because the modern flow of centralized login functions so seamlessly. After signing in, they're brought back to the application and are now authenticated. The user experience of centralized login is easy and natural, and is the standard expectation for users of modern web and mobile apps. In addition to being more secure, it provides transparency. In doing so, the user is assured that they are securely logging in with a trusted and familiar entity.

![centralized login with GitHub](https://cdn.auth0.com/blog/centralized-login/github-login.jpg)

## Conclusion

Centralized login is the most secure and maintainable standards-based approach to logging in with an authentication provider. Unlike embedded login, it is safer from cross-origin attack vectors and poses no danger to the authorization server. Centralized login is the [best current practice for native mobile apps](https://auth0.com/blog/oauth-2-best-practices-for-native-apps/), and OAuth providers like [Google no longer support embedded login strategies](https://auth0.com/blog/google-blocks-oauth-requests-from-embedded-browsers/). It also provides a comfortable and consistent user experience that confers the benefits of SSO.

{% include tweet_quote.html quote_text="Centralized login is safer from cross-origin attack vectors and poses no danger to the authorization server." %}

In keeping with app modernization and current best practices, [Auth0](https://auth0.com) provides a robust [centralized login](https://auth0.com/docs/hosted-pages/login) solution with integrations for dozens of [social identity providers](https://auth0.com/docs/identityproviders#social), [enterprise identity providers](https://auth0.com/docs/identityproviders#enterprise), custom [OAuth 2.0 integrations](https://auth0.com/docs/protocols/oauth2), [username/password databases](https://auth0.com/docs/connections#database-and-custom-connections), features like [passwordless authentication](https://auth0.com/passwordless) (with SMS, email, or TouchID), and more.

With Auth0, the centralized login page is a [fully customizable UI](https://auth0.com/docs/hosted-pages/login#3-customization). In addition, Auth0's [CNAME](https://en.wikipedia.org/wiki/CNAME_record) functionality to persist the same domain across the centralized login page and the app is scheduled to launch before the end of 2017.

![Auth0 centralized login page](https://cdn.auth0.com/blog/resources/auth0-centralized-login.jpg)

You can <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">sign up for a free Auth0 account</a> to try out these features and more to modernize your app's authentication and follow standards-based best practices.