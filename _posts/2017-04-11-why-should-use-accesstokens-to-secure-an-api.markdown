---
layout: post
title: "Why You Should Always Use Access Tokens to Secure an API"
description: "We explain the difference between access token and ID token and why the latter should never be used to secure an API."
date: 2017-04-11 8:30
category: Technical Guide, Security, JWT
author:
  name: "Maria Paktiti"
  url: "https://twitter.com/mariap__"
  mail: "maria@auth0.com"
  avatar: "https://www.gravatar.com/avatar/4ff2f1955778896cc06318b342dabf55?size=200"
design:
  image: https://cdn.auth0.com/blog/accesstokensforapi/Logo.png
  bg_color: "#8B572A"
tags:
- access-token
- id-token
- tokens
- apis
related:
- 2017-03-13-critical-vulnerability-in-json-web-encryption
- 2017-03-23-brute-forcing-hs256-is-possible-the-importance-of-using-strong-keys-to-sign-jwts
- 2017-04-03-navigating-rs256-and-jwks

---

**TL;DR:** There is much confusion on the Web about the differences between the OpenID Connect and OAuth 2.0 specifications, and their respective tokens. As a result many developers publish insecure applications, compromising their users security. The contradicting implementations between identity providers do not help either.

This article is an attempt to clear what is what and explain why you should always use an access token to secure an API, and never an ID token.

---

## Two complementary specifications

OAuth 2.0 is used to **grant authorization**. It enables you to authorize the Web App A to access your information from Web App B, without sharing your credentials. It was built with *only* authorization in mind and doesn't include any authentication mechanisms (in other words, it doesn't give the Authorization Server any way of verifying who the user is).

OpenID Connect builds on OAuth 2.0. It enables you, the user, to verify your identity and give some basic profile information, without sharing your credentials.

An example is a to-do application, that lets you log in using your Google account, and can push your to-do items as calendar entries, at your Google Calendar. The part where you authenticate your identity is implemented via OpenID Connect, while the part where you authorize the to-do application to modify your calendar by adding entries, is implemented via OAuth 2.0.

> OpenID Connect is about who someone is. OAuth 2.0 is about what they are allowed to do.

You may notice the *"without sharing your credentials"* part, at our definitions of the two specifications earlier. What you do share in both cases, is tokens.

OpenID Connect issues an identity token, known as `id_token`, while OAuth 2.0 issues an `access_token`.

## How to use each token

The `id_token` is a [JWT](https://auth0.com/docs/jwt) and is meant for the client only. In the example we used earlier, when you authenticate using Google, an `id_token` is sent from Google to the to-do application, that says who you are. The to-do application can parse [the token's contents](https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims) and use this information, like your name and your profile picture, to customize the user experience.

**Note:** You must never use the info in an `id_token` unless you have validated it! For more information refer to: [How to validate an ID token](https://auth0.com/docs/tokens/id-token#how-to-validate-an-id-token). For a list of libraries you can use to verify a JWT refer to [JWT.io](https://jwt.io/).

The `access_token` can be any type of token (not necessarily a JWT) and is meant for the API. Its purpose is to inform the API that the bearer of this token has been authorized to access the API and perform specific actions (as specified by the `scope` that has been granted). In the example we used earlier, after you authenticate, and provide your consent that the to-do application can have read/write access to your calendar, an `access_token` is sent from Google to the to-do application. Each time the to-do application wants to access your Google Calendar it will make a request to the Google Calendar API, using this `access_token` in an HTTP `Authorization` header.

**Note:** Access Tokens should be treated as opaque strings by clients. They are only meant for the API. Your client should not attempt to decode them or depend on a particular `access_token` format.

## How NOT to use each token

Now that we saw what these tokens can be used for, let's see what they cannot be used for.

* **An `access_token` cannot be used for authentication.** It holds no information about the user. It cannot tell us if the user has authenticated and when.

* **An `id_token` cannot be used for API access.** Each token contains information on the intended audience (recipient). According to the OpenID Connect specification, the audience (claim `aud`) of each `id_token` must be the `client_id` of the client making the authentication request. If it isn't you shouldn't trust the token. An API, on the other hand, expects a token with the audience set to the API's unique identifier. So unless you are in control of both the client and the API, sending an `id_token` to an API will not work. Furthermore, the `id_token` is signed with a secret that is known to the client (since it is issued to a particular client). This means that if an API were to accept such token, it would have no way of knowing if the client has modified the token (to add more scopes) and then signed it again.

## Compare Tokens

To better understand what we just read, let's look at the contents of example tokens.

The (decoded) contents of an `id_token` look like the following:

```js

{
  "iss": "http://${account.namespace}/",
  "sub": "auth0|123456",
  "aud": "${account.clientId}",
  "exp": 1311281970,
  "iat": 1311280970,
  "name": "Jane Doe",
  "given_name": "Jane",
  "family_name": "Doe",
  "gender": "female",
  "birthdate": "0000-10-31",
  "email": "janedoe@example.com",
  "picture": "http://example.com/janedoe/me.jpg"
}

```

This token is meant for **authenticating the user to the client**. Note that the audience (`aud` claim) of the token is set to the client's identifier, which means that only this specific client should consume this token.

For comparison, let's look at the contents of an `access_token`:

```js

{
  "iss": "https://${account.namespace}/",
  "sub": "auth0|123456",
  "aud": [
    "my-api-identifier",
    "https://${account.namespace}/userinfo"
  ],
  "azp": "${account.clientId}",
  "exp": 1489179954,
  "iat": 1489143954,
  "scope": "openid profile email address phone read:appointments email"
}

```

This token is meant for **authorizing the user to the API**. As such, it is completely opaque to clients, meaning that a client should not care about the contents of this token, decode it or depend on a particular token format. Note that the token does not contain any information about the user itself besides their ID (`sub` claim), it only contains authorization information about which actions the client is allowed to perform at the API (`scope` claim).

Since in many cases it is desirable to retrieve additional user information at the API, this token is also valid for calling the `/userinfo` API, which will return the user's profile information. So the intended audience (`aud` claim) of the token is either the API (`my-api-identifier`) or the `/userinfo` endpoint (`https://${account.namespace}/userinfo`).

### Recommended resources for further reading

* [Access Token](https://auth0.com/docs/tokens/access-token)
* [ID Token](https://auth0.com/docs/tokens/id-token)
* [The problem with OAuth for Authentication](http://www.thread-safe.com/2012/01/problem-with-oauth-for-authentication.html)
* [User Authentication with OAuth 2.0](https://oauth.net/articles/authentication/)
* [OAuth 2.0 Overview](https://auth0.com/docs/protocols/oauth2)
* [OpenID Connect Overview](https://auth0.com/docs/protocols/oidc)

## Securing Applications with Auth0

Are you building a [B2C](https://auth0.com/b2c-customer-identity-management), [B2B](https://auth0.com/b2b-enterprise-identity-management), or [B2E](https://auth0.com/b2e-identity-management-for-employees) tool? Auth0, can help you focus on what matters the most to you, the special features of your product. [Auth0](https://auth0.com/) can improve your product's security with state-of-the-art features like [passwordless](https://auth0.com/passwordless), [breached password surveillance](https://auth0.com/breached-passwords), and [multifactor authentication](https://auth0.com/multifactor-authentication).

[We offer a generous **free tier**](https://auth0.com/pricing) so you can get started with modern authentication.
