---
layout: post
title: "SHA-1 Has Been Compromised In Practice"
description: "The CWI Institute and Google have successfully demonstrated a practical SHA-1 collision attack by publishing two unique PDF files that produce the same hash value."
date: 2017-02-24 08:30
category: Security, Algorithms
author:
  name: "Ado Kukic"
  url: "https://twitter.com/kukicado"
  mail: "ado@auth0.com"
  avatar: "https://s.gravatar.com/avatar/99c4080f412ccf46b9b564db7f482907?s=200"
design:
  image: https://cdn.auth0.com/blog/delegated-admin-cloud-cakes/hero.png
  bg_color: "#222228"
tags:
- security
- algorithms
- sha-1
related:
- what-the-new-nist-guidelines-mean-for-authentication
- json-web-token-signing-algorithms-overview
- critical-vulnerabilities-in-json-web-token-libraries
---

---

**TL;DR** Researches published a technique for causing SHA-1 collisions and demonstrated it by providing two unique PDF documents that produced the same SHA1 hash value.

---

[Secure Hash Algorithm 1](https://en.wikipedia.org/wiki/SHA-1) or SHA-1 is a cryptographic hash function designed by the United States [National Security Agency](https://www.nsa.gov/) and released in 1995. The algorithm was widely adopted in the industry for digital signatures and data integrity purposes. For example, applications would use SHA-1 to convert plain-text passwords into a hash that would be useless to a hacker, unless of course, the hacker could reverse engineer the hash back into the original password, which they could not. As for data integrity, a SHA-1 hash ensured that no two files would have the same hash, and even the slightest change in a file would result in a new, completely unique hash.

According to [Wikipedia](https://en.wikipedia.org/wiki/Cryptographic_hash_function), the ideal cryptographic hash function has five main properties:

* it is deterministic so the same message always results in the same hash
* it is quick to compute the hash value for any given message
* it is infeasible to generate a message from its hash value except by trying all possible messages
* a small change to a message should change the hash value so extensively that the new hash value appears uncorrelated with the old hash value
* **it is infeasible to find two different messages with the same hash value**

In 2005, researchers discovered potential vulnerabilities in the SHA-1 algorithm and by 2010 many organizations stopped it as it was deemed insecure. The potential vulnerabilities had not been proven, until today, when CWI Institute and Google demonstrated a practical collision attack against SHA-1. The researchers were able to provide two unique PDF files that produced the same exact SHA-1 hash value.

![Data Integrity](https://cdn.auth0.com/blog/sha1-collision/example.png)

<p><small>Source: <a href="http://shattered.io/static/infographic.pdf" target="_blank">shattered.io</a></small></p>

The team published a practical technique showing how to generate a collision bringing the fears that SHA-1 was insecure to reality. The technique outlined required years of research and immense computation resources. From the research published, it would take a cluster of 110 powerful GPU’s running computations 24 hours a day for an entire year to cause a collision, or about 6,500 years on a single-CPU. So while this attack vector is fairly impractical, it is not impossible.

{% include tweet_quote.html quote_text="The SHA1 collision attack required 9,223,372,036,854,775,808 SHA1 computations." %} 

This is a big deal because even though many organization have stopped using SHA-1, underlying systems still often rely on SHA-1. Software updates, ISO checksums, PGP signatures, digital certificate signatures, git, and others still make use of SHA-1 for data integrity. If a malicious party were able to create a collision for a popular piece of software for example, and distributed it on the web, they could infect many unsuspecting users causing all sorts of damage.

On the bright side, the typical user does not have to worry too much. Certification Authorities are forbidden from issuing SHA-1 certificates, and Google and Mozilla will warn users accessing HTTPS websites that use SHA-1 signed certificates. More and more organizations are using safer alternatives like SHA-256 for their cryptographic needs. Additionally, since the published attack vector has only been proven with PDF files, the team created a website, shattered.io, which allows you to test your PDF files and see if they could have been compromised.

For most, security is not actively thought about, but for us at [Auth0](https://auth0.com), security is the only thing we think about. Ok, not the only thing, but it’s up there. In addition to embracing open authentication standards like [OAuth](https://oauth.net/2/) and [OpenID](http://openid.net/), we follow industry standards and best practices for security and when this popped up on our radar we just had to share it. Learn more about security practices [here](https://auth0.com/security).

For more info on the SHA-1 collision attack be sure to check out [shattered.io](http://shattered.io/) and Google’s Security Blog [post](https://security.googleblog.com/2017/02/announcing-first-sha1-collision.html).