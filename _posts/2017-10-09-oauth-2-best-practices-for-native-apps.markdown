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

**TL;DR:** In October, 2017, the [Internet Engineering Task Force (IETF)](https://www.ietf.org/) released the [Best Current Practices (BCP) when using OAuth 2.0 with native mobile applications](https://www.rfc-editor.org/rfc/rfc8252.txt). This BCP states that OAuth 2.0 authorization requests from native apps should _only_ be made through external user agents, primarily the user's browser.

---

## OAuth 2.0 Best Current Practice for Native Apps

The IETF ([Internet Engineering Task Force](https://www.ietf.org/)) recently released the [Best Current Practice for OAuth 2.0 for Native Apps Request For Comments](https://www.rfc-editor.org/rfc/rfc8252.txt). This document requires that, in accordance with best practices, only external user agents (such as the browser) should be used with the [OAuth 2.0 Authorization Framework](https://tools.ietf.org/html/rfc6749) by native applications; this is known as the "AppAuth pattern". Embedded user agents should not be implemented.

> _For authorizing users in native apps, the best current practice is to perform the OAuth authorization request in an external user agent (typically the browser) rather than an embedded user agent (such as one implemented with web-views)._
>
> -_[OAuth 2.0 for Native Apps](https://www.rfc-editor.org/rfc/rfc8252.txt)_

Using the browser to make native app authorization requests results in better security. It also enables use of the user's current authentication state, making single sign-on possible. In addition, authorization flow support can be implemented without changing the OAuth protocol itself, since the request and response are predefined by URIs. We'll go into the security and implementation advantages in more detail below.

### Authorization Flow for Native Apps Using the Browser

The authorization flow for native apps using the browser acts as illustrated in the following diagram:

![Authorization flow for native apps using the browser](/Users/kimmaida-auth0/Documents/Auth0/Blog/OAuth 2 assets/oauth-native-apps.png)

> 1. Client app opens a browser tab with the authorization request.
2. Authorization endpoint receives the authorization request, authenticates the user, and obtains authorization. Authenticating the user may involve chaining to other authentication systems.
3. Authorization server issues an authorization code to the redirect URI.
4. Client receives the authorization code from the redirect URI.
5. Client app presents the authorization code at the token endpoint.
6. Token endpoint validates the authorization code and issues the tokens requested.
>
> _Figure 1, [OAuth 2.0 for Native Apps](https://www.rfc-editor.org/rfc/rfc8252.txt)_

URIs are used for OAuth 2.0 on the web for authorization requests and responses. Similarly, URIs can also be used in native apps. This brings the same advantages to the native environment, such as the ability to use a single sign-on session and additional security afforded by an authentication context that is separated from the app. In addition, supporting and implementing the same approach in web and native apps reduces complexity and increases interoperability.

### Initiating and Receiving Authorization Requests

Native apps now must request user authorization by creating a URI with the appropriate [grant type specified in the OAuth 2.0 Authorization Framework](https://tools.ietf.org/html/rfc6749#section-4.1). They must also supply a redirect URI that the native app can receive and parse appropriately. This must be implemented using an _external user agent_. Use of the device browser is recommended.

The authorization server must offer at least three redirect URI options for the response sent back to the native app:

* Private-Use URI Scheme Redirection
* Claimed "https" Scheme URI Redirection
* Loopback Interface Redirection

You can read about these three options in detail in Section 7 of [OAuth 2.0 for Native Apps](https://www.rfc-editor.org/rfc/rfc8252.txt).

## Security Considerations

When implementing OAuth 2.0, there are a number of security considerations that developers must be mindful of when using best current practice with an external user agent. We'll go over a few of them now.

### Authorization Code and Grant Flow

Using the redirect options above means that the authorization code can only be received by native apps on the same device. While this increases security, it does still mean that another app on the same device could potentially intercept the code. The [Proof Key for Code Exchange (PKCE) protocol](https://tools.ietf.org/html/rfc7636) was created to defend against this attack vector. Public apps as well as servers should use PKCE, and servers should reject authorization requests from apps that do not.

It is _not_ recommended to implement [implicit grant flow](https://auth0.com/docs/api-auth/grant/implicit) in native apps because this flow cannot be protected by PKCE. Instead, [authorization code grant flow with PKCE](https://auth0.com/docs/api-auth/grant/authorization-code-pkce) should be used.

### Authorization Servers and Clients

In most cases, native apps are considered public clients and must be registered with the authorization server. Authorization servers must also register a client's complete redirect URI. If an authorization request does not match the registered redirect URI, the request must be rejected.



### User Agents

## About Auth0

### Auth0 Centralized Login

## Conclusion

### Additional Links & Resources