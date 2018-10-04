---
layout: post
title: "Cookies vs Tokens: The Definitive Guide"
description: "The cookie vs token debate favors token-based authentication. Learn the advantages and get answers to common concerns regarding token authentication."
date: 2016-05-31 08:30
alias: /2016/05/31/cookies-vs-tokens-definitive-guide/
category: Technical Guide, Identity, Cookies vs Tokens
author: 
  name: "Ado Kukic"
  url: "https://twitter.com/kukicadnan"
  mail: "ado@auth0.com"
  avatar: "https://s.gravatar.com/avatar/99c4080f412ccf46b9b564db7f482907?s=200"
design: 
  bg_color: "#08192D"
  image: "https://cdn.auth0.com/blog/cookies-vs-tokens/cvt-logo.png"
tags: 
- Cookies vs Tokens
- Cookies
- Tokens
- JWT
- Progressive Web App
related:
- 2014-01-27-ten-things-you-should-know-about-tokens-and-cookies
- 2015-12-17-json-web-token-signing-algorithms-overview
- 2015-09-28-5-steps-to-add-modern-authentication-to-legacy-apps-using-jwts
alternate_locale_ja: jp-cookies-vs-tokens-definitive-guide
---

---

**TL;DR** Tokens-based authentication is more relevant than ever. We examine the differences and similarities between cookie and token-based authentication, advantages of using tokens, and address common questions and concerns developers have regarding token-based auth. Finally, putting theory to practice, we'll build an application that uses token authentication and make it a progressive web app.

We will be writing an Angular 2 app that uses JWT for authentication. Grab the [Github repo](https://github.com/auth0-blog/angular-auth0-aside) if you would like to follow along.

---

Our [last article](https://auth0.com/blog/2014/01/07/angularjs-authentication-with-cookies-vs-token/) comparing cookie to token authentication was over two years ago. Since then, we've written extensively on how to integrate token authentication across many different languages and frameworks.

The rise of single page applications (SPAs) and decoupling of the front-end from the back-end is in full force. Frameworks like [Angular](https://angularjs.org/), [React](https://facebook.github.io/react/), and [Vue](https://vuejs.org/) allow developers to build bigger, better, and more performant single page applications than ever before. Token-based authentication goes hand in hand with these frameworks.

{% include tweet_quote.html quote_text="Token-based authentication goes hand in hand with SPA frameworks like Angular, React and Vue." %}

## Cookie vs Token Authentication - Recap

Before we dive further, let's quickly recap how these two authentication systems work. If you are already familiar with how cookie and token authentication works, feel free to skip this section, otherwise read on for an in-depth overview. 

This diagram is a great introduction and simplified overview of the difference between cookie and token approaches to authentication.

![Cookie vs Token-Based Authentication](https://cdn.auth0.com/blog/cookies-vs-tokens/cookie-token-auth.png)

### Cookie Based Authentication

Cookie based authentication has been the default, tried-and-true method for handling user authentication for a long time.
 
Cookie based authentication is **stateful**. This means that an authentication record or session must be kept both server and client-side. The server needs to keep track of active sessions in a database, while on the front-end a cookie is created that holds a session identifier, thus the name cookie based authentication. Let's look at the flow of traditional cookie based authentication:

1. User enters their login credentials
2. Server verifies the credentials are correct and creates a session which is then stored in a database
3. A cookie with the session ID is placed in the users browser
4. On subsequent requests, the session ID is verified against the database and if valid the request processed
5. Once a user logs out of the app, the session is destroyed both client and server side

### Token-Based Authentication

Token-based authentication has gained prevalence over the last few years due to rise of single page applications, web APIs, and the Internet of Things (IoT). When we talk about authentication with tokens, we generally talk about authentication with [JSON Web Tokens](https://jwt.io/introduction) (JWTs). While there are different ways to implement tokens, JWTs have become the de-facto standard. With this context in mind, the rest of the article will use tokens and JWTs interchangeably. 

Token-based authentication is **stateless**. The server does not keep a record of which users are logged in or which JWTs have been issued. Instead, every request to the server is accompanied by a token which the server uses to verify the authenticity of the request. The token is generally sent as an addition Authorization header in form of `Bearer {JWT}`, but can additionally be sent in the body of a POST request or even as a query parameter. Let's see how this flow works:

1. User enters their login credentials
2. Server verifies the credentials are correct and returns a signed token
3. This token is stored client-side, most commonly in local storage - but can be stored in session storage or a cookie as well
4. Subsequent requests to the server include this token as an additional Authorization header or through one of the other methods mentioned above
5. The server decodes the JWT and if the token is valid processes the request
6. Once a user logs out, the token is destroyed client-side, no interaction with the server is necessary

## Advantages of Token-Based Authentication

Understanding **how** something works is only half the battle. Next, we'll cover the reasons **why** token authentication is preferable over the traditional cookie based approach.

### Stateless, Scalable and Decoupled

Perhaps the biggest advantage to using tokens over cookies is the fact that token authentication is stateless. The back-end does not need to keep a record of tokens. Each token is self-contained, containing all the data required to check its validity as well as convey user information through claims. 

The server's only job then, becomes to sign tokens on a successful login request and verify that incoming tokens are valid. In fact, the server does not even need to sign tokens. Third party services such as Auth0 can handle the issuing of tokens and then the server only needs to verify the validity of the token.

### Cross Domain and CORS

Cookies work well with singular domains and sub-domains, but when it comes to managing cookies across different domains, it can get hairy. In contrast, a token-based approach with CORS enabled makes it trivial to expose APIs to different services and domains. Since the JWT is required and checked with each and every call to the back-end, as long as there is a valid token, requests can be processed. There are a few caveats to this and we'll address those in the Common Questions and Concerns section below.

### Store Data in the JWT

With a cookie based approach, you simply store the session id in a cookie. JWT's on the other hand allow you to store any type of metadata, as long as it's valid JSON. The [JWT spec](https://tools.ietf.org/html/rfc7519) specifies different types of claims that can be included such as reserved, public and private. You can learn more about the specifics and the differences between the types of claims on the [jwt.io](https://jwt.io/introduction/) website.
 
In practice, what this means is that a JWT can contain any type of data. Depending on your use case you may choose to make the minimal amount of claims such as the user id and expiration of the token, or you may decide to include additional claims such as the users email address, who issued the token, scopes or permissions for the user, and more. 

### Performance

When using the cookie based authentication, the back-end has to do a lookup, whether that be a traditional SQL database or a NoSQL alternative, and the roundtrip is likely to take longer compared to decoding a token. Additionally, since you can store additional data inside the JWT, such as the users permission level, you can save yourself additional lookup calls to get and process the requested data.
 
For example, say you had an API resource `/api/orders` that retrieves the latest orders placed via your app, but only users with the role of **admin** have access to view this data. In a cookie based approach, once the request is made, you'd have one call to the database to verify that the session is valid, another to get the user data and verify that the user has the role of **admin**, and finally a third call to get the data. On the other hand, with a JWT approach, you can store the user role in the JWT, so once the request is made and the JWT verified, you can make a single call to the database to retrieve the orders.

### Mobile Ready

Modern APIs do not only interact with the browser. Written properly a single API can serve both the browser and native mobile platforms like iOS and Android. Native mobile platforms and cookies do not mix well. While possible, there are many limitations and considerations to using cookies with mobile platforms. Tokens on the other hand are much easier to implement on both iOS and Android. Tokens are also easier to implement for Internet of Things applications and services that do not have a concept of a cookie store.

## Common Questions and Concerns

In this section, we'll take a look at some common questions and concerns that frequently arise when the topic of token authentication comes up. The key focus here will be security but we'll examine use cases concerning token size, storage and encryption.

### JWT Size

The biggest disadvantage of token authentication is the size of JWTs. A session cookie is relatively tiny compared to even the smallest JWT. Depending on your use case, the size of the token could become problematic if you add many claims to it. Remember, each request to the server must include the JWT along with it.

### Where to Store Tokens?

With token-based auth, you are given the choice of where to store the JWT. Commonly, the JWT is placed in the browsers local storage and this works well for most use cases. There are some issues with storing JWTs in local storage to be aware of. Unlike cookies, local storage is sandboxed to a specific domain and its data cannot be accessed by any other domain including sub-domains.

You can store the token in a cookie instead, but the max size of a cookie is only 4kb so that may be problematic if you have many claims attached to the token. Additionally, you can store the token in session storage which is similar to local storage but is cleared as soon as the user closes the browser.

### XSS and XSRF Protection

Protecting your users and servers is always a top priority. One of the most common concerns developers have when deciding on whether to use token-based authentication is the security implications. Two of the most common attack vectors facing websites are Cross Site Scripting (XSS) and Cross Site Request Forgery (XSRF or CSRF).

[Cross Site Scripting](https://www.owasp.org/index.php/Cross-site_Scripting_(XSS)) attacks occur when an outside entity is able to execute code within your website or app. The most common attack vector here is if your website allows inputs that are not properly sanitized. If an attacker can execute code on your domain, your JWT tokens are vulnerable. Our CTO has [argued](https://auth0.com/blog/2014/01/27/ten-things-you-should-know-about-tokens-and-cookies/#xss-xsrf) in the past that XSS attacks are much easier to deal with compared to XSRF attacks because they are generally better understood. Many frameworks, including Angular, automatically sanitize inputs and prevent arbitrary code execution. If you are not using a framework that sanitizes input/output out-of-the-box, you can look at plugins like [caja](https://github.com/google/caja) developed by Google to assist. Sanitizing inputs is a solved issue in many frameworks and languages and I would recommend using a framework or plugin vs building your own.

Cross Site Request Forgery attacks are not an issue if you are using JWT with local storage. On the other hand, if your use case requires you to store the JWT in a cookie, you will need to protect against XSRF. XSRF are not as easily understood as XSS attacks. Explaining how XSRF attacks work can be time consuming, so instead, check out [this](https://en.wikipedia.org/wiki/Cross-site_request_forgery) guide that explains in-depth how XSRF attacks work. Luckily, preventing XSRF attacks is a fairly simple matter. To over-simplify, protecting against an XSRF attack, your server, upon establishing a session with a client will generate a unique token (note this is not a JWT). Then, anytime data is submitted to your server, a hidden input field will contain this token and the server will check to make sure the tokens match. Again, as our recommendation is to store the JWT in local storage, you probably will not have to worry about XSRF attacks.

One of the best ways to protect your users and servers is to have a short expiration time for tokens. That way, even if a token is compromised, it will quickly become useless. Additionally, you may maintain a [blacklist](https://auth0.com/blog/2015/03/10/blacklist-json-web-token-api-keys/) of compromised tokens and not allow those tokens access to the system. Finally, the nuclear approach would be to change the signing algorithm, which would invalidate all active tokens and require all of your users to login again. This approach is not easily recommended, but is available in the event of a severe breach.

### Tokens Are Signed, Not Encrypted

A JSON Web Token is comprised of three parts: the header, payload, and signature. The format of a JWT is `header.payload.signature`. If we were to sign a JWT with the HMACSHA256 algorithm, the secret 'shhhh' and the payload of:

```
{
  "sub": "1234567890",
  "name": "Ado Kukic",
  "admin": true
}
```

The JWT generated would be:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkbyBLdWtpYyIsImFkbWluIjp0cnVlLCJpYXQiOjE0NjQyOTc4ODV9.Y47kJvnHzU9qeJIN48_bVna6O0EDFiMiQ9LpNVDFymM
```

The **very** important thing to note here, is that, this token is signed by the HMACSHA256 algorithm, and the header and payload are Base64URL encoded, it is **not** encrypted. If I go to [jwt.io](https://jwt.io), paste this token and select the HMACSHA256 algorithm, I could decode the token and read its contents. Therefore, it should go without saying that sensitive data, such as passwords, should never be stored in the payload.

If you must store sensitive data in the payload or your use case calls for the JWT to be obscured, you can use JSON Web Encryption (JWE). JWE allows you to encrypt the contents of a JWT so that it is not readable by anyone but the server. [JOSE](http://jose.readthedocs.io/en/latest/) provides a great framework and different options for JWE and has SDKs for many popular frameworks including [NodeJS](https://github.com/cisco/node-jose) and [Java](https://bitbucket.org/connect2id/nimbus-jose-jwt/wiki/Home). Anyway, I encourage you to learn more about [AngularJS Authentication](https://auth0.com/learn/angularjs-authentication/).

## Token-Based Authentication in Action with Auth0

Here at Auth0, we've written SDKs, guides, and quickstarts for working with JWTs for many languages and frameworks including [NodeJS](https://github.com/auth0/express-jwt), [Java](https://github.com/auth0/java-jwt), [Python](https://github.com/auth0/auth0-python), [GoLang](https://github.com/auth0/go-jwt-middleware), and [many more](https://auth0.com/docs). Our last "Cookies vs. Tokens" article used the AngularJS framework, so it's fitting to use Angular 2 for our code samples today.

You can download the sample code from our [GitHub repo](https://github.com/auth0-blog/angular-auth0-aside) created by [Kim Maida](https://twitter.com/kimmaida). Downloading the code samples is preferable as Angular 2 requires a lot of initial setup to get going. If you haven't already, <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">sign up</a> for a free Auth0 account so you can do the implementation yourself and experiment with different features and options. Let's get started.

{% include asides/angular.markdown %}

## Conclusion

In today's article we compared the differences between cookie and token-based authentication. We highlighted the advantages and concerns of using tokens and also wrote a simple app to showcase how JWT works in practice. There are many reasons to use tokens and Auth0 is here to ensure that implementing token authentication is easy and secure. Finally, we introduced Progressive Web Apps to help make your web applications feel more native on mobile devices. <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">Sign up</a> for a free account today and be up and running in minutes.