---
layout: post
title: "OAuth 2.0 Best Practices for Native Apps"
description: "The IETF has released Best Current Practice (BCP) for OAuth 2.0 in native apps. Learn about it now."
date: 2017-10-19 8:30
category: Growth, Best Practices, OAuth
banner:
  text: "Auth0 makes it easy to add authentication to your native application."
author:
  name: "Kim Maida"
  url: "https://twitter.com/KimMaida"
  mail: "kim.maida@auth0.com"
  avatar: "https://en.gravatar.com/userimage/20807150/4c9e5bd34750ec1dcedd71cb40b4a9ba.png"
design:
  image: https://cdn.auth0.com/blog/oauth2bcp/oauthlogo.png
  bg_color: "#222228"
tags:
- oauth
- oauth-2
- ietf
- best-practices
- native-apps
- centralized-login
related:
- 2016-04-20-everything-you-wanted-to-know-about-oauth-2-but-were-too-afraid-to-ask
- 2017-11-22-using-centralized-login-to-add-authentication-to-your-ios-apps
---

**TL;DR:** In October, 2017, the [Internet Engineering Task Force (IETF)](https://www.ietf.org/) released the [Best Current Practices (BCP) when using OAuth 2.0 with native mobile applications](https://www.rfc-editor.org/rfc/rfc8252.txt). This BCP states that OAuth 2.0 authorization requests from native apps should _only_ be made through external user agents, primarily the user's browser. We'll discuss what this means for developers and users and any security considerations involved.

---

## OAuth 2.0 Best Current Practice for Native Apps

The IETF ([Internet Engineering Task Force](https://www.ietf.org/)) recently released the [Best Current Practice for OAuth 2.0 for Native Apps Request For Comments](https://www.rfc-editor.org/rfc/rfc8252.txt). This document requires that, in accordance with best practices, only external user agents (such as the browser) should be used with the [OAuth 2.0 Authorization Framework](https://tools.ietf.org/html/rfc6749) by native applications; this is known as the "AppAuth pattern". Embedded user agents should not be implemented.

> _For authorizing users in native apps, the best current practice is to perform the OAuth authorization request in an external user agent (typically the browser) rather than an embedded user agent (such as one implemented with web-views)._
>
> -_[OAuth 2.0 for Native Apps](https://www.rfc-editor.org/rfc/rfc8252.txt)_

Using the browser to make native app authorization requests results in better security. It also enables use of the user's current authentication state, making single sign-on possible. Embedded user agents are unsafe for third parties. If used, the app has access to the OAuth authorization grant as well as the user's credentials, leaving this data vulnerable to recording or malicious use. Embedded user agents also don't share authentication state, meaning no single sign-on benefits can be conferred.

We'll go into the security and implementation advantages of using the browser for authorization requests in more detail below.

{% include tweet_quote.html quote_text="Using the browser to make native app authorization requests results in better security." %}

### Authorization Flow for Native Apps Using the Browser

The authorization flow for native apps using the browser acts as illustrated in the following diagram:

![Authorization flow for OAuth 2.0 in native apps using the browser](https://cdn.auth0.com/blog/oath2bcp/hoauth-flow.png)

> 1. Client app opens a browser tab with the authorization request.
2. Authorization endpoint receives the authorization request, authenticates the user, and obtains authorization. Authenticating the user may involve chaining to other authentication systems.
3. Authorization server issues an authorization code to the redirect URI.
4. Client receives the authorization code from the redirect URI.
5. Client app presents the authorization code at the token endpoint.
6. Token endpoint validates the authorization code and issues the tokens requested.
>
> _Figure 1, [OAuth 2.0 for Native Apps](https://www.rfc-editor.org/rfc/rfc8252.txt)_

URIs are used for OAuth 2.0 on the web for authorization requests and responses. Similarly, URIs can also be used in native apps. When the built-in browser is employed by the user for all native app logins, certain advantages are conferred, such as the ability to use a single sign-on session stored in a central location and additional security afforded by an authentication context that is separated from the app. Browser security is also a major focus of vendors, and they tend to manage security and sessions policies quite well. In addition, supporting and implementing the same approach in web and native apps reduces complexity and increases interoperability.

{% include tweet_quote.html quote_text="Implementing external user agents in both web & native apps reduces complexity and increases interop." %}

### Initiating and Receiving Authorization Requests

Native apps now must request user authorization by creating a URI with the appropriate [grant type specified in the OAuth 2.0 Authorization Framework](https://tools.ietf.org/html/rfc6749#section-4.1). The app then redirects the user to this request URI. A redirect URI that the native app can receive and parse appropriately must also be supplied. This must be implemented using an _external user agent_. Use of the device browser is recommended.

The authorization server must permit at least three redirect URI options for the response sent back to the native app:

* Private-Use URI Scheme Redirection
* Claimed "https" Scheme URI Redirection
* Loopback Interface Redirection

You can read about these three options in detail in Section 7 of [OAuth 2.0 for Native Apps](https://www.rfc-editor.org/rfc/rfc8252.txt).

## OAuth 2.0 Security Considerations for Native Apps

When implementing OAuth 2.0, there are a number of security considerations that developers must be mindful of when using best current practice with an external user agent. We'll go over a few of them now.

### Authorization Code and Grant Flow

Using the redirect options above means that the authorization code can only be received by native apps on the same device. While this increases security, it does still mean that another app on the same device could potentially intercept the code. The [Proof Key for Code Exchange (PKCE) protocol](https://tools.ietf.org/html/rfc7636) was created to defend against this attack vector. Public apps as well as servers _must_ use PKCE, and servers should reject authorization requests from apps that do not.

It is _not_ recommended to implement [implicit grant flow](https://auth0.com/docs/api-auth/grant/implicit) in native apps because this flow cannot be protected by PKCE. Instead, [authorization code grant flow with PKCE](https://auth0.com/docs/api-auth/grant/authorization-code-pkce) should be used.

### Authorization Servers and Clients

In most cases, native apps are considered public clients and must be registered with the authorization server. Authorization servers must also register a client's complete redirect URI. If an authorization request does not match the registered redirect URI, the request must be rejected.

User authentication and consent will be required by the authorization server, as per any other web browser based OAuth 2.0 flows.

### User Agents

Embedded user agents should not be used to masquerade as an external user agent. Authorization servers can protect against these fake agents by requiring an authentication factor only available to genuine external user agents.

Cross-Site Request Forgery (CSRF) attacks should also be mitigated by using the `state` parameter to link client requests and responses. More details are available in section 5.3.5 of [OAuth 2.0 Threat Model and Security Considerations](https://tools.ietf.org/html/rfc6819).

The user's browser is the recommended external user agent. Embedded user agents must not be used for authorization requests. Authorization servers may detect and block requests from embedded user agents, as they are unsafe for third parties, such as the authorization server itself. The reason for this is because the app can then access not only the OAuth authorization grant, but also the user's full authentication credentials. The app could then potentially record or use this information maliciously. In addition, embedded user agents don't share authentication state with other apps or the browser and therefore disabling single sign-on benefits.

## Conclusion

If you're a native app developer, it's very important to adhere to best current practices. Please take the time to read over the [OAuth 2.0 for Native Apps](https://www.rfc-editor.org/rfc/rfc8252.txt) RFC yourself. Using an external user agent for OAuth 2.0 authorization requests provides better security as well as an improved user experience as it enables [single sign-on](https://auth0.com/blog/what-is-and-how-does-single-sign-on-work/) across the device's apps and browser.

### Centralized Login with Auth0

[Auth0](https://auth0.com) provides a [centralized login approach](https://auth0.com/docs/hosted-pages/login) that adheres to the OAuth 2.0 Best Current Practice for native apps. Centralized login provides the most secure experience and is also easy to implement for developers. A URI is used to trigger an authentication request and the centralized login page is shown to users. This login page can use the [Auth0 Lock widget](https://auth0.com/lock) or your own custom UI. After authorization, the user is returned to your app via your provided redirect. Auth0 provides extensive documentation to help you easily implement the appropriate flows to keep your apps secure and user-friendly as well.

Check out the following resources to learn more about implementing Auth0 with centralized login in your native apps in accordance with the OAuth 2.0 Best Current Practice:

* [Centralized Login Page](https://auth0.com/docs/hosted-pages/login)
* [OAuth 2.0](https://auth0.com/docs/protocols/oauth2)
* [Calling APIs from Mobile Apps (Authorization Code PKCE)](https://auth0.com/docs/api-auth/grant/authorization-code-pkce)
* [iOS Swift Quickstart - Login](https://auth0.com/docs/quickstart/native/ios-swift/00-login)
* [Android Quickstart - Login](https://auth0.com/docs/quickstart/native/android/00-login)

You can sign up for a <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">free Auth0 account now</a> and get started right away, or check out [Auth0's pricing here](https://auth0.com/pricing).
