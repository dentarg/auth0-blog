---
layout: post
title: "Guide to OAuth 2.0"
description: "Describing OAuth 2.0 for the masses, demystifying the technology behind this common authorization technique"
longdescription: "Describing OAuth 2.0 for the masses, demystifying the technology behind this common authorization technique. Includes how OAuth enables us to enhance our online experience while limiting exposure of sensitive information and how roles help us separate the responsibilities of OAuth requests"
date: 2018-01-11 11:44
category: Growth, Identity, Authentication
is_non-tech: true
author:
  name: Luke Oliff
  url: https://twitter.com/mroliff
  avatar: https://avatars1.githubusercontent.com/u/956290?s=200
  mail: luke.oliff@auth0.com
design:
  bg_color: <A HEX BACKGROUND COLOR>
  image: <A PATH TO A 200x200 IMAGE>
tags:
- oauth2
- authorization
related:
- 2017-12-12-authentication-provider-best-practices-centralized-login
---

Have you visited a site recently, where you are given the option of connecting or signing up using Google, Facebook or Twitter? Sure you have! This is basically what OAuth is all about; granting third-party services permission to do something for you–like logging you in. In this article, you will learn what OAuth is, how it started and how it works. 

> **Note:** For the purposes of this article and the comfort of the target audience, OAuth is to be assumed as OAuth 2.0 unless specifically mentioning another version.

## So what is OAuth?

OAuth (or Open Authorization) is a framework that gives users the ability to grant access to their information stored in one place, from another place. For example, granting Spotify access to your Facebook profile.

![Spotify and Facebook](https://cdn.auth0.com/blog/guide-to-oauth2/spotify-signup-with-facebook.png)

The idea is that you're giving Spotify certain permission to access your Facebook details, so that Facebook can provide Spotify with enough information to sign you up, enhance your profile details, or display what your friends are listening to. Meanwhile, more sensitive information–perhaps your conversations–remain entirely closed off to Spotify. They only get access to the bits they're *authorized* to see.

![Spotify requests access to Facebook](https://cdn.auth0.com/blog/guide-to-oauth2/spotify-access-to-facebook.png)

> _"Many luxury cars today come with a valet key. It is a special key you give the parking attendant and unlike your regular key, will not allow the car to drive more than a mile or two. You give someone limited access to your car with a special key, while using your regular key to unlock everything."_ — OAuth.net

## How did it start?

Before initiatives like OAuth appeared, you would have had to give Spotify access to your Facebook login details for Spotify to be able to access your information on Facebook.

Previous versions were first developed in 2007 by a group seeking to standardize how we can delegate permissions between different software applications. The latest version, OAuth 2.0, is not backwards compatible with previous versions which have now been deprecated. Despite deprecating old versions, they remain in use widely across the web, including by one of the original drivers behind the general OAuth movement, Twitter. Some feel that it is less secure and it has been described as a [road to hell](http://hueniverse.com/2012/07/26/oauth-2-0-and-the-road-to-hell/).

## How does it work?

To understand how OAuth works, we need to understand Roles, grant types and access tokens.

![Generic OAuth Flow](https://cdn2.auth0.com/docs/media/articles/protocols/oauth2-generic-flow.png)

### Roles

First we need to understand how it separates the responsibility of our requests. Roles are used to define the separate entities involved in a request.

#### The Client

The client is the application trying to access to the user's account. It needs Authorization to do so. This might be the website you're on, or the app you've installed to your phone. In our example, this would be Spotify.

#### The Resource Server

The resource server is the place storing the user's information. In our example, this would be Facebook.

#### The Authorization Server

This is the server that asks the user to approve or deny the request. This would also be Facebook, but a separate service that Facebook operate with the purpose of handling authorization.

#### The Resource Owner

The resource owner is the person who is giving access to their account. So if you're giving Spotify permission to access your Facebook info, you're the resource owner.

### Grant types

A grant represents the user's permission to access their data and can be used to acquire an access token. The OAuth Specification describes four flows for acquiring an access token. These flows are called grant types. Which one is more suitable for you will most likely depend on the type of client.

**[Authorization Code](https://auth0.com/docs/api-auth/grant/authorization-code):** used by Web Apps executing on a server. This is also used by mobile apps, using the [Proof Key for Code Exchange (PKCE) technique](https://auth0.com/docs/api-auth/grant/authorization-code-pkce).

**[Implicit](https://auth0.com/docs/api-auth/grant/implicit):** used by JavaScript-centric apps (Single Page Applications) executing on the user's browser.

**[Resource Owner Password Credentials](https://auth0.com/docs/api-auth/grant/password):** used by trusted apps.

**[Client Credentials](https://auth0.com/docs/api-auth/grant/client-credentials):** used for machine-to-machine communication.

To start with, this article will touch on the most common form of grant type which is going to help us shed light on OAuth, without overcomplicating it. [Read more about OAuth 2.0 and the other grant types](https://auth0.com/docs/protocols/oauth2).

#### Authorization code grant

An authorization code grant is what we'd encounter in our example.

**The Client** will redirect the user to the **The Authorization Server** with some information about what they're requesting and where they're requesting it from, among other things. 

The user will be asked to login to **The Authorization Server** and approve **The Client**, receiving an authorization code. 

**The Client** can now send that code and our grant type to **The Authorization Server** and receive back an access token. 

![Authorization Code Grant](https://cdn2.auth0.com/docs/media/articles/api-auth/authorization-code-grant.png)

### Access tokens

Access tokens represents your authorization to access **The Resource Owner**'s information on **The Resource Server**. You're required to exchange your grant for an access token, which will often have an expiry time.

## OAuth at Auth0

Auth0 is a global leader in Identity-as-a-Service (IDaaS) and provides thousands of customers in every market sector with the only identity solution they need for their web, mobile, IoT, and internal applications.

At Auth0 we utilize OAuth 2.0 along with Open ID Connect (OIDC) which is an identity layer built upon OAuth 2.0. OAuth is not the only authorization protocol we use, but it is one of the most popular.

For more information, visit https://auth0.com or follow @auth0 on Twitter.
