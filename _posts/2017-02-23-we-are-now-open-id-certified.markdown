---
layout: post
title: "Auth0 is OpenID Connect Certified"
description: "Auth0 conforms to OpenID Connect protocol and allows clients to verify the identity of the end-users though a reliable implementation."
date: 2017-02-23 10:00
category: Growth, Certifications
is_non-tech: true
author:
  name: Martin Gontovnikas
  url: http://twitter.com/mgonto
  mail: gonto@auth0.com
  avatar: https://www.gravatar.com/avatar/df6c864847fba9687d962cb80b482764??s=60design
design:
  bg_color: #4a4a4a
  image: "https://cdn.auth0.com/blog/open-id-certified/logo.png"
tags:
- openid
- auth0
- oauth
related:
- 2015-09-23-what-is-and-how-does-single-sign-on-work
- 2015-12-16-how-to-use-social-login-to-drive-your-apps-growth
- 2015-09-23-what-is-and-how-does-single-sign-on-work
---

In May of last year, Auth0 officially gained certifications for *OP Basic* and *OP Config* profiles of the OpenID Connect spec. As of February this year, Auth0 has gained two new [OpenID Connect certifications: *OP Implicit* and *Hybrid OP*](http://oixnet.org/openid-certifications/auth0/). With these certifications we're thrilled to join the ranks of industry leaders such as Google, Microsoft, PayPal, and others who are embracing standards based authentication.

OpenID Connect, as a layer on top of the OAuth 2.0 authorization protocol, allows for decentralized authentication and improves user access to websites and apps.

Getting certified means ensuring that our implementation of the protocol meets the official specifications as outlined by [OpenID](http://openid.net/developers/specs/).

OpenID is a cornerstone of the modern, open web, and we're proud that our implementation has the official stamp of approval.

## What Is OpenID Connect?

OpenID Connect is an open identity standard. It acts as an authentication layer (proving who you are) on top of the OAuth 2.0 authorization standard (granting you access).

A user gets an OpenID account through an OpenID identity provider. The user uses that account to sign into any site (a relying party) that accepts OpenID authentication (for example, YouTube). This open-source framework, provided by the OpenID standard, lets the user, relying party and the identity provider “just work” together.

Instead of having to sign up on a website and keep track of your passwords, you only need to sign up once and use that login across various applications.

On a website, it might look something like this:

![login](https://cdn.auth0.com/blog/open-id-certified/sign-in-form.png)

A user is already logged into Facebook or Google (an identity provider) with a set of credentials. This set of credentials can then be used to log into another website or application, a relying party. This site or app will ask the user "Sign up with Facebook or Google?"

When a user clicks on Google or Facebook, they're authorizing that identity provider to back up their claim. Then the user is redirected to the website or application.

![authorization](https://cdn.auth0.com/blog/open-id-certified/social-provider-authorization.png)

This use of linked identities means you only have to manage a single username and password for websites.

With OpenID, users don't need traditional authentication tokens like a username and password. All they need is to be registered on a site with an OpenID identity provider. It's decentralized; any website can use OpenID as a way to log users in.

## Why is OpenID Connect Important?

Before OpenID, people built site-specific networks with their own signup and login systems. The idea that you could select your own identity provider for logging into a website and a common standard that would connect all these systems didn't exist. Some big players, like Facebook, had built their own solutions for SSO. But the decentralized OpenID model was so powerful and beneficial that even they eventually adopted it. Like VentureBeat's Eric Eldon [wrote](http://venturebeat.com/2009/04/14/single-sign-on-service-openid-getting-more-usage/) upon its release,

> *The point of OpenID, as all of these companies seem to accept, is that users don’t want to use just any one service to sign in everywhere. Instead, users should have the choice to log into any site using any other identity. Making it easier for people to log in anywhere just means more people will log in overall — and potentially become users of any of these companies.*

Think of OpenID as your driver's license for the entire internet.

Websites that use OpenID won't ask for your information constantly, making it faster and easier to sign up. Plus, you can associate information with your OpenID such as your name and email address, and decide how much websites get to know about you. So, websites that use OpenID won't bug you for the same information every single time you sign up.

Since you're uniquely identified over the internet, OpenID Connect is also a good way connect your accounts into a more unified persona. The moment you establish yourself as the individual who uses a specific OpenID, whenever someone sees you're using your OpenID online, they'll know it's you.

If your friend opens a website and sees someone with your OpenID has made a comment, they can be certain it was you, not someone with the same name coincidentally.

## Why Get OpenID Certification?

You've carried rounds and rounds of tests to check your OpenID specs. The results were great with strong participation. So what's the point of getting certified?

Certification ensures credibility. In your own testing, you can pick and choose what aspects of your OpenID implementation you want to test. Certification involves meeting a set of minimum criteria that are standard across the board, and your results (and the process you used to get there) are open for public oversight.

When you're done, you can prove that your [OpenID implementation](https://auth0.com/learn/how-auth0-uses-identity-industry-standards/) is conformant with the [official specs](http://openid.net/certification/) — not just for your customers and potential customers, but for yourself.

## Aside: Securing Applications with Auth0

Are you building a product and want to support OAuth and OpenID Connect? We at Auth0, can help help you with that while you keep focused on what matters the most to you, the special features of your product.

[Auth0](https://auth0.com/) can help you make your product secure with state-of-the-art features like [passwordless](https://auth0.com/passwordless), [breached password surveillance](https://auth0.com/breached-passwords), and [multifactor authentication](https://auth0.com/multifactor-authentication). [We offer a generous **free tier**](https://auth0.com/pricing) to get started with modern authentication.
