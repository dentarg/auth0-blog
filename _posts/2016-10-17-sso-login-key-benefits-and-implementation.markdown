---
layout: post
title: "SSO Login: Key Benefits and Implementation"
description: Learn the benefits of Single Sign On login and how to achieve it with Auth0
date: 2016-10-18 08:30
category: Technical Guide, Identity, Single Sign On
banner:
  text: "The Definitive Guide to Single Sign-On"
  action: "https://resources.auth0.com/definitive-guide-to-single-sign-on/?utm_source=blog"
  cta: "Download eBook"
design:
  bg_color: "#305F96"
  image: https://cdn.auth0.com/blog/SSO-Logo.png
author:
  name: Prosper Otemuyiwa
  url: http://twitter.com/unicodeveloper?lang=en
  mail: prosper.otemuyiwa@auth0.com
  avatar: https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200
tags:
- sso-login
- federated-identity
- single-sign-on
- credentials
related:
- 2015-09-23-what-is-and-how-does-single-sign-on-work
- 2014-08-22-sso-for-legacy-apps-with-auth0-openid-connect-and-apache
- 2014-07-02-wordpress-single-sign-on
lang: en
alternate_locale_ja: jp-sso-login-key-benefits-and-implementation
---

<div class="alert alert-info alert-icon">
  <i class="icon-budicon-500"></i>
  <strong>Forrester Consulting analysis determines that using Auth0 can yield a 548% ROI and $3.7M in identity-related savings. Read the full report: <a href="https://resources.auth0.com/forrester-tei-research-case-study/">Total Economic Impact of Auth0</a>.</strong>
</div>

---

**TL;DR:** As companies and organizations grow, they have to deal with an increasing number of applications and services. More often than not, these applications and services need authentication to manage access. Maintaining multiple sets of credentials to log in to different applications within an organization can be excruciating. **SSO login** can take away that pain. In this post, I'll show you how **SSO login** works and discuss the key benefits of integrating SSO login into your application development workflow.

---

## What is SSO Login?

**Single Sign On (SSO) login** refers to when a user logs in to an application with a single set of credentials and is then automatically signed into multiple applications. With SSO login, a user gains access to multiple software systems without maintaining different login credentials such as usernames and passwords.

A very popular example of SSO login is Google's implementation for their software products. Once a user is logged in to Gmail, the user automatically gains access to YouTube, Google Drive, Google Photos, and other Google products.

![SSO login example - Google apps](https://cdn.auth0.com/blog/sso-google-upload.png)
_I signed into gmail and already have access to all those products around the red marker_

## Key Benefits of SSO Login

Why should you implement **SSO login**? What are the benefits of SSO login? How does it increase your product's conversion rate? These are some of the benefits of SSO login:

* Eliminate the time spent re-entering user credentials, thus improving productivity for users and increasing conversion rates for product owners, which means your internal employees and your external users don't have to go through the hassle of maintaining and remembering yet another set of credentials
* Eliminate password fatigue from having to store or remember different usernames and passwords
* Reduce complaints about password problems, thus reducing the costs associated with setting up several helpdesk systems for password-reset issues, invalid credentials, etc.
* Minimize [phishing](https://en.wikipedia.org/wiki/Phishing), thus improving security
* Streamlines the local, desktop, and remote application workflows, thus improving users' productive capacity

## How SSO Login Works

Let's look at an ideal scenario before going into the nitty-gritty of how SSO login works. Three apps have been developed separately: **App FOO**, **App BAR**, and **App BAZ**. They are also hosted on three different domains: **foo.com**, **bar.com** and **baz.com** respectively.

**Challenge**: Users have to enter different usernames and passwords for the three different apps to gain access to certain resources.

**Proposed solution**: Eliminate the different login systems that are present. Users should be able to log in to **foo.com** and then be signed in to  **bar.com** and **baz.com** automatically without having to re-enter their authentication credentials.

**SSO login to the rescue**: With SSO login, a *central authentication server* needs to exist. Let's call our central authentication server **foobarbaz.com**. This is how the process flow will look in this scenario:

1. The user accesses **foo.com**.
2. The user is redirected to **foobarbaz.com**, where an authentication-related cookie is generated.
3. The user navigates to **bar.com**.
4. The user is redirected to **foobarbaz.com**.
5. **foobarbaz.com** checks whether the user already has an authentication-related cookie and redirects the user back to **bar.com**, providing access to its features and content.
6. The same process applies to **baz.com**.

The simple take-away concept is that there is one central domain through which authentication is performed, and then the session is shared with other domains in some secure way e.g., a signed JSON Web Token (JWT).

![A typical SSO example](https://cdn.auth0.com/blog/typical-sso.png)
_A typical graphical SSO example_

## SSO Integrations

There are different SSO login integrations: these are external services you can use for Single Sign On logins. You can enable SSO login for your corporate applications, such as *Salesforce*, *Dropbox*, *Microsoft Azure Active Directory*, *Slack*, *SharePoint*, *New Relic*, *Zendesk*, and so on.

## Aside: SSO Login with Auth0

The process flow using Auth0 as the central authentication server can be seen below:

![Using Auth0 as the central authentication domain](https://cdn.auth0.com/blog/auth0-sso-flow.png)
_Using Auth0 as the central authentication domain_

With Auth0, SSO login is just a few clicks away. **Auth0** provides out-of-the-box support for over 15 cloud applications including: **Microsoft Azure Active Directory**, **Box**, **CloudBees**, **Concur**, **Dropbox**, **Microsoft Dynamics CRM**, **Adobe Echosign**, **Egnyte**, **New Relic**, **Office 365**, **Salesforce**, **SharePoint**, **Slack**, **Springcm**, **Zendesk**, and **Zoom**.

We also support industry standards such as **SAML**, **WS-Fed**, and **OAuth 2.0** so you can hook up any third-party application you need.

If you don't already have an Auth0 account, <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">sign up</a> for one now to enable SSO login for your applications. Check out the comprehensive [SSO login docs](https://auth0.com/docs/sso) to learn how to implement SSO for your apps. In addition, you can dive straight into the [code samples](https://github.com/auth0-samples/auth0-sso-sample) that show how to implement SSO login between *Single Page Apps* and *Regular Web Apps* using Auth0.

## Conclusion

The benefits of using SSO login to manage a large ecosystem of applications and services are numerous. Modern application development supports distributed and decentralized systems. With an efficient SSO login in place, it's easier to add more applications to the existing suite of services without having to worry about authentication every time. If Google can implement SSO login and succeed, you can do it too with Auth0!

{% include tweet_quote.html quote_text="If Google can implement SSO login and succeed, you can do it too with Auth0!" %}

[Want to learn more about Single Sign-On? Get The Definitive Guide on SSO (74-page free eBook) here.](https://resources.auth0.com/definitive-guide-to-single-sign-on/?utm_source=blog)
