---
layout: post
title: "SSO Login: Key Benefits and Implementation"
description: Learn the benefits of Single Sign On login and how to achieve it with Auth0
date: 2016-10-17 08:30
design:
  bg_color: "#1D6A8D"
  image: https://cdn.auth0.com/blog/yarn-logo.png
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
---

---

**TL;DR:** As companies and organizations grow, they have to deal with an increasing number of application and services. More often than not, these applications and services all need some form of authentication to deal with people accessing items and features. Maintaining multiple set of credentials to login to different applications within an organization can be excruciating. **SSO Login** can take away that pain. In this post, I'll show you how **sso login** works and the key benefits of integrating sso login into your application development workflow.

---

## What is SSO Login?

**SSO(Single Sign On) login** refers to when a user logs in to an application with a single set of credentials and is then automatically signed into multiple applications. With sso login, a user gains access to multiple software systems without maintaining different login credentials such as usernames and passwords.

A very popular example of sso login is Google's implementation for their software products. Once a user is logged in to Gmail, the user automatically gains access to Youtube, Google Sheets, Google Photos and other products.

![SSO login example - Google apps](https://cdn.auth0.com/blog/sso-google-upload.png)
_I signed into gmail and already have access to all those products around the red marker_

## Key Benefits of SSO Login

Why should you implement **SSO login**? What are the benefits of sso login? How does it increase your product's conversion rate? I'll simply highlight some of the benefits of sso login below:

* Eliminating the time spent re-entering user credentials; thus improving productivity for the user and increasing conversion rate for the product owner. Don’t make your internal employees nor your external users go through the hassle of maintaining and remembering yet another credential.
* Eliminating password fatigue from having to store or remember different usernames and passwords.
* Reduced complaints about password problems; thus reducing costs associated with setting up several helpdesk systems having to do with password-reset issues, invalid credentials and so on.
* SSO login minimizes [phishing](https://en.wikipedia.org/wiki/Phishing); thus improving security.
* Streamlines the local, desktop and remote application workflow; thus improving users productive capacity.

## How SSO login works

Let's look at an ideal scenario before going into the nitty-gritty of how sso login works. Three apps have been developed separately namely **App FOO**, **App BAR** and **App BAZ**. They are also hosted on three different domains, **foo.com**, **bar.com** and **baz.com** respectively.

**Challenge**: Users have to enter different usernames and passwords for the three different apps to gain access to certain resources.

**Proposed solution**: Eliminate the different login systems that are present. Users should be able to log in to **foo.com** and then be signed in to  **bar.com** and **baz.com** automatically without having to re-enter authentication credentials.

**SSO login to the rescue**: With SSO login, a *central authentication server* needs to exist. Let's call our central authentication server **foobaraz.com**. This is how the process flow will look like in this scenario:

1. The user accesses **foo.com**.
2. The user is redirected to **foobaraz.com** where an authentication-related cookie is generated.
3. The user navigates to **bar.com**.
4. The user is redirected to **foobaraz.com**
5. **foobaraz.com** checks whether the user already has an authentication-related cookie, so it redirects the user back to **bar.com** with access to its features and content.
6. The same process applies to **baz.com**.

The simple take-away concept, worthy of note, is that there is a central domain, through which authentication is performed and then the session is shared with other domains in some secure way e.g a signed JWT(Json Web Token).

![A typical SSO example](https://cdn.auth0.com/blog/sso/typical-sso.png)
_A typical graphical SSO example_

## SSO Integrations

There are different integrations for SSO login. SSO integrations are external services that you can use for single sign-on. You can enable SSO login for your corporate applications such as *Salesforce*, *Dropbox*, *Microsoft Azure Active Directory*, *Slack*, *Sharepoint*, *New Relic*, *Zendesk* and so on.

## Aside: SSO Login with Auth0

The process flow using Auth0 as the central authentication server can be seen below:

![Using Auth0 as the central authentication domain](https://cdn.auth0.com/blog/sso/auth0.png)
_Using Auth0 as the central authentication domain_

With Auth0, SSO login is just a few clicks away. **Auth0** provides out-of-the-box support for more than 15 cloud applications. These applications are: **Microsoft Azure Active Directory**, **Box**, **CloudBees**, **Concur**, **Dropbox**, **Microsoft Dynamics CRM**, **Adobe Echosign**, **Egnyte**, **New Relic**, **Office 365**, **Salesforce**, **Sharepoint**, **Slack**, **Springcm**, **Zendesk**, and **Zoom**.

We also support industry standards such as **SAML**, **WS-Fed** and **OAuth 2.0** so you can hook any third-party application that you need.

If you don't already have an Auth0 account, [sign up](https://auth0.com/signup) for one now to enable SSO login for your applications without hassle. Check out the very comprehensive [SSO login docs](https://auth0.com/docs/sso/single-sign-on) on how to implement SSO for your apps. Also you can dive straight in to the [code samples](https://github.com/auth0-samples/auth0-sso-sample) that show how to implement SSO login between Single Page Apps and Regular Web apps using Auth0.

## Conclusion

The benefits of using SSO login to manage a large ecosystem of applications and services are numerous as highlighted in this post. Modern application development crazily supports having distributed and decentralized systems. With an efficient SSO login in place, it's easier to add more applications to the existing suite of services without having to worry about authentication every time. If Google can implement SSO login and succeed, you too can do it and succed with Auth0!

{% include tweet_quote.html quote_text="If Google can implement SSO login and succeed, you too can do it and succeed with Auth0!" %}
