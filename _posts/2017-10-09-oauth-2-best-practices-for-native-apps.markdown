---
layout: post
title: "OAuth 2.0 Best Practices for Native Apps"
description: "The IETF has released Best Current Practice (BCP) for OAuth 2.0 in native apps. Learn about it now."
date: 2017-10-05 8:30
category: Announcement
banner:
  text: "Auth0 makes it easy to add authentication to your native application."
author:
  name: "Kim Maida"
  url: "https://twitter.com/KimMaida"
  mail: "kim.maida@auth0.com"
  avatar: "https://en.gravatar.com/userimage/20807150/4c9e5bd34750ec1dcedd71cb40b4a9ba.png"
design:
  image: https://cdn.auth0.com/blog/...
  bg_color: "#"
tags:
- hyphenated-tags
- 
related:
- date-postname
- date-postname
---

**TL;DR:** In October, 2017, the [Internet Engineering Task Force (IETF)](https://www.ietf.org/) released the [Best Current Practices (BCP) when using OAuth 2.0 with native mobile applications](https://www.rfc-editor.org/rfc/rfc8252.txt). This BCP states that OAuth 2.0 authorization requests from native apps should _only_ be made through external user-agents, primarily the user's browser.

---

## OAuth 2.0 Best Current Practice for Native Apps

The IETF ([Internet Engineering Task Force](https://www.ietf.org/)) recently released the [Best Current Practice for OAuth 2.0 for Native Apps Request For Comments](https://www.rfc-editor.org/rfc/rfc8252.txt). This document requires that, in accordance with best practices, only external user-agents (such as the browser) should be used with the [OAuth 2.0 Authorization Framework](https://tools.ietf.org/html/rfc6749) by native applications; this is known as the "AppAuth pattern". Embedded user-agents should not be implemented.

> _For authorizing users in native apps, the best current practice is to perform the OAuth authorization request in an external user-agent (typically the browser) rather than an embedded user-agent (such as one implemented with web-views)._
>
> -[Oauth 2.0 BCP for Native Apps](https://www.rfc-editor.org/rfc/rfc8252.txt)

Using the browser to make native app authorization requests results in better security. It also enables use of the user's current authentication state, making single sign-on possible. In addition, authorization flow support can be implemented without changing the OAuth protocol itself, since the request and response are predefined by URIs. We'll go into the security and implementation advantages in more detail below.

### Authorization Flow for Native Apps Using the Browser

The authorization flow for native apps using the browser acts as illustrated in the following diagram:

![Authorization flow for native apps using the browser](/Users/kimmaida-auth0/Documents/Auth0/Blog/OAuth 2 assets/oauth-native-apps.png)

### Initiating and Receiving Authorization Requests

## Security Considerations

### Authorization and Implicit Grant

### Clients

### User Agents

## About Auth0

### Auth0 Centralized Login

## Conclusion

### Additional Links & Resources