---
layout: post
title: "JWT.io and JWT Debugger Extension Updates"
description: "We have released new versions of JWT.io and the JWT Debugger extension, learn what's new."
longdescription: "We have been working on new features for JWT.io and the JWT Debugger extension. New algorithms, improved public-key handling, human readable timestamps and more. Take a look at the new features!"
date: 2018-03-08 12:30
category: Announcements, Content
author:
  name: Sebastián Peyrott
  url: https://twitter.com/speyrott?lang=en
  mail: speyrott@auth0.com
  avatar: https://en.gravatar.com/userimage/92476393/001c9ddc5ceb9829b6aaf24f5d28502a.png?size=200
design:
  bg_color: "#222228"
  image: https://cdn.auth0.com/blog/jwtalgos/logo.png
  image_size: "100%"
  image_bg_color: "#222228"
tags:
- jwt
- jwt-io
- jwt-debugger
- debugger
- json-web-token
- json-web-tokens
- extension
- chrome
- firefox
related:
- 2015-12-17-json-web-token-signing-algorithms-overview
- ten-things-you-should-know-about-tokens-and-cookies
- critical-vulnerabilities-in-json-web-token-libraries
---

We have released a major update to our [JWT.io](https://jwt.io/) website and the [JWT Debugger](https://chrome.google.com/webstore/detail/jwt-debugger/ppmmlchacdbknfphdeafcbmklcghghmd) extension based on it. Among the new features, there are new signing algorithms, improved public-key handling, human-readable timestamps, and even [Firefox support](https://addons.mozilla.org/en-US/firefox/addon/jwtio-debugger) for the extension! In this post, we will go over these new features.

{% include tweet_quote.html quote_text="JWT.io and the JWT Debugger extension have been updated with new features!" %}

---

## JWT.io and the JWT Debugger extension
[JSON Web Tokens (JWTs)](https://jwt.io/introduction/) are a convenient way to exchange claims between parties. The key features of JWTs are their simple format (Base64-encoded JSON) and the use of signatures and/or encryption. [JWT.io](https://jwt.io/) provides a convenient way to debug and inspect [JSON Web Tokens (JWTs)](https://auth0.com/e-books/jwt-handbook), along with an introduction to some of the key concepts behind them. It also provides a list of libraries and frameworks that can be used with them in many different programming languages.

The [JWT Debugger extension](https://chrome.google.com/webstore/detail/jwt-debugger/ppmmlchacdbknfphdeafcbmklcghghmd) is the [Web Extension](https://browserext.github.io/browserext/) version of JWT.io. The debugger has the same features as the website but can be used offline. It also provides additional features like automatic inspection of web storage and cookies to easily find and edit JWTs in websites!

New versions of JWT.io and the JWT Debugger extension have been released. Let's go over the changes.

## New Features
### New Signing Algorithms
For a long time, JWT.io and the JWT Debugger extension only supported the two most popular algorithms: HS256 and RS256. HS256 is an HMAC-based algorithm that relies on a shared secret between parties to produce and verify signatures. On the other hand, RS256 is an RSA-based algorithm, relying on public and private key pairs to sign and verify signatures. The advantages of RS256 are clear: signatures can only be produced by the private-key holder, while verification can be performed by anyone holding the public key. However, the complexity of the implementation for RS256 can make HS256 signatures better for certain use cases (embedded, small devices, etc.).

![New algorithms](https://cdn.auth0.com/blog/jwtio-update/1-new-algs.png)

The new version of JWT.io and the extensions support many more algorithms:

#### HMAC
- HS384
- HS512

These are variants of HS256. HMAC signatures rely on a hash function to produce and verify the signature. In the case of HS256, the hash function is SHA-256. For the other two, the hash functions are SHA-384 and SHA-512. For certain use cases, SHA-512 exhibits better performance than the other two. Security wise, none of these hash functions has been broken.

#### RSA
- RS384
- RS512
- PS256
- PS384

Much like the HMAC counterparts, RSA signatures also rely on a hash function to produce and verify a signature. The same thing changes between RS256, RS384, and RS512.

PS256/384 use a different type of signature (RSA-PSS) that also relies on the RSA algorithm as the baseline. In particular, it uses an encoding method that relies on a random salt value. This produces probabilistic rather than deterministic signatures. It is considered stronger than RS256/384/512 signatures as long as the random salt is truly random. In case the salt is not truly random, it provides the same level of strength as the baseline RSA algorithm

#### ECDSA
- ES256
- ES384

These algorithms rely on the elliptic-curve digital signing algorithm (ECDSA) rather than RSA. The main advantage of ECDSA is that keys can be smaller for a similar level of cryptographic strength. A 256-bit ECDSA key provides a cryptographic strength similar to a 3248-bit RSA key. This makes ECDSA keys better for certain hardware limited devices.

> If you are interested in a detailed rundown of JWT signing algorithms, don't forget to check our [JWT Handbook](https://auth0.com/e-books/jwt-handbook). Chapter 7 goes over all signing algorithms in detail.

#### "none"
JWTs also support setting the `alg` claim to `none`. This means that the JWT is not signed. Unfortunately, this has resulted in [critical vulnerabilities in JSON Web Token libraries](https://auth0.com/blog/critical-vulnerabilities-in-json-web-token-libraries/). For this reason, JWT.io and the JWT Debugger extensions now consider `alg: "none"` tokens always _invalid_.

### Automatic Public-Key Download
Another interesting feature that has been added is automatic public key downloads. Public-key algorithms, such as RSA, RSA-PSS, and ECDSA, rely on public-keys to verify signatures. Public-keys, like their name implies, can be safely shared without compromising the security of the signature. For this reason, it is not uncommon for JWT public-keys to be available either embedded in the token itself, or in a public URL.

JWT.io and the JWT Debugger extensions now attempt to get public keys in different ways according to the claims embedded in the token.

If the token contains both the `iss` and `kid` claims, JWT.io will attempt to download the token from a specially crafted URL. For example:

```javascript
header: {
  kid: 1
},
payload: {
  iss: "https://username.auth0.com/"
}
```

In this case, JWT.io and the extensions will attempt to download the key with `kid = 1` from the special URL `https://username.auth0.com/.well-known/jwks.json`. This is a [common scheme used by Auth0](https://auth0.com/docs/jwks). In other words, all Auth0 JWTs can now be verified in JWT.io and the JWT Debugger extension by simply pasting the token!

{% include tweet_quote.html quote_text="With automatic key downloads, all Auth0 JWTs can now be verified in JWT.io and the JWT Debugger extension by simply pasting the token!" %}

Of course, since the JWK and JWS standards declare other common schemes for specifying keys, these are also supported: the `jwk`, `jku`, `x5c`, and `x5u` claims. These are used to either embed a key within the token (`jwk` and `x5c`) or to declare a URL to get the keys or certificates (`jku` and `x5u`). For example:

```javascript
header: {
  kid: 1,
  jku: "https://username.auth0.com/.well-known/jwks.json"
}
```

In this case, JWT.io and the extensions will attempt to download the key with `kid = 1` from the URL `https://username.auth0.com/.well-known/jwks.json` specified in the `jku` claim.

### Human Readable Timestamps
Several JWT claims are time-based. For instance, the `iat` claim specifies the exact time the JWT was issued at, the `exp` claim specifies the expiration time for the JWT, the `nbf` sets the time when the JWT becomes valid, etc. Unfortunately, these claims are based on the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time): they specify the number of seconds elapsed since January 1st, 1970. Understanding these values by simply looking at them is hard. For this reason, now JWT.io and the JWT Debugger extensions display a tooltip when the mouse hovers over a supported time claim.

![Human readable timestamps](https://cdn.auth0.com/blog/jwtio-update/2-timestamps.png)

The supported claims are: `exp`, `iat`, `nbf`, `auth_time`, and `updated_at`.

### Firefox Support
Yes! It's finally here. Ever since the first release of the JWT Debugger extension for Chrome we have received requests for a Firefox version. Now it's here and supports all the features of the Chrome extension. [Get it here](https://addons.mozilla.org/en-US/firefox/addon/jwtio-debugger)!

![JWT Debugger on Firefox](https://cdn.auth0.com/blog/jwtio-update/3-firefox.png)

## Streamlined Codebase
Although the new features are the cool part of the release, we have also done a ton of internal work on both JWT.io and the extensions. In particular:

- We have closed over 40 issues and merged over 15 pull requests (some with more libraries!).
- We have synchronized the codebases of JWT.io and the JWT Debugger extensions to always get the latest features out to you, regardless of what you use more.
- We have updated all internal dependencies to the latest versions. This has fixed many bugs here and there and also improved the experience on mobile platforms.
- We have performed a major refactor to improve code quality and latencies during page load. JWT.io is now faster than ever!
- We have added more tests to our test suite. Do check that these pass before submitting new PRs!
- Build scripts are now simpler. Want to contribute? Doing so is as simple as:

Steps:

1. [Checkout from Git](https://github.com/jsonwebtoken/jsonwebtoken.github.io/).
2. `npm install`
3. `grunt`

That's it! You will now find JWT.io available on [http://localhost:8000](http://localhost:8000) and ready for your changes. The extension is also built but you'll need to load it manually in your browser, see the Chrome or Firefox docs for help with this. The resulting code can always be found in the `dist` folder. Send your PRs!

## What's Next
Although we have just finished with these changes, there's still more in our pipeline! 

- **Key-length tips:** we will show you tooltips when your shared secrets are not long enough.
- **Share button:** the extensions already support this, now it's coming to JWT.io!
- **Library submission process:** we get tons of PRs with new libraries, we want to formalize the process and setup tools so that you can easily review any steps that are required to add your library to JWT.io

We hope you enjoy all the new features and changes at [JWT.io](https://jwt.io/) and the JWT Debugger extensions. Please report any bugs at the [GitHub repository](https://github.com/jsonwebtoken/jsonwebtoken.github.io/) and don't forget to leave us your comments or requests here or in the issue tracker at GitHub. Cheers!

