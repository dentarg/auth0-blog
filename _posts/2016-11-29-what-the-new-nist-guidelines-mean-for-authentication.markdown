---
layout: post
title: "What the New NIST Guidelines Mean for Authentication"
description: "Learn about NIST's Digital Authentication Guideline and what it means for authentication security."
date: 2016-11-29 8:30
category: Hot Topics, Authentication
author:
  name: "Kim Maida"
  url: "https://twitter.com/KimMaida"
  mail: "kim.maida@auth0.com"
  avatar: "https://en.gravatar.com/userimage/20807150/4c9e5bd34750ec1dcedd71cb40b4a9ba.png"
design:
  bg_color: "#485FB8"
  image: https://cdn.auth0.com/blog/nist-auth-guideline/NISTimage.png
tags:
- security
- passwords
- authentication
- NIST
related:
- 2016-10-06-announcing-auth0-eu-us-privacy-shield-certification
- 2016-08-25-announcing-Auth0-Guardian-a-new-way-to-login
---

**TL;DR:** The US National Institute of Standards and Technology ([NIST](https://www.nist.gov/)) is creating new policies for Federal agencies implementing authentication. Learn about [NIST Special Publication 800-63-3: Digital Authentication Guideline](https://pages.nist.gov/800-63-3/sp800-63-3.html) and what it means for authentication security. 

---

## NIST Digital Authentication Guideline

The [US National Institute of Standards and Technology (NIST)](https://www.nist.gov/) is creating new policies for Federal agencies implementing authentication.

![Digital Authentication Guideline: US NIST logo](https://cdn.auth0.com/blog/nist-auth-guideline/nist.png)

The draft, called **Special Publication 800-63-3**, is available [on the NIST website](https://pages.nist.gov/800-63-3) as well as [on NIST's GitHub](https://github.com/usnistgov/800-63-3). The suite of documents includes the following:

* [800-63-3: Digital Authentication Guideline](https://pages.nist.gov/800-63-3/sp800-63-3.html) (overview)
* [800-63A: Enrollment & Identity Proofing](https://pages.nist.gov/800-63-3/sp800-63a.html)
* [800-63B: Authentication & Lifecycle Management](https://pages.nist.gov/800-63-3/sp800-63b.html)
* [800-63C: Federation & Assertions](https://pages.nist.gov/800-63-3/sp800-63c.html)

The policies are intended for Federal agency applications, but serve as a standard for many others as well.

## NIST Improved Password Requirements

The NIST Digital Authentication Guideline strives for improved password requirements. One of the guiding principles is _better user experience_ and shifting the burden to the verifier whenever possible. In order to support the creation of passwords that users will remember while implementing excellent security, several guidelines are important:

* Length: 8 character minimum, >64 character maximum
* Compare new passwords to a [dictionary](https://auth0.com/docs/connections/database/password-options#password-dictionary) and don't allow common, easily-guessed passwords (such as `password`, `abc123`, etc.)
* Allow all printing characters + spaces
* Should offer option to show password rather than dots or asterisks; helps typing accuracy
* Don't enforce composition rules (ie., no "passwords must include uppercase and lowercase letters, a number...", etc.); such rules provide a poor user experience
* Don't use password hints; they weaken authentication 
* Don't expire passwords arbitrarily; regular expiration encourages users to choose easy-to-guess, less secure passwords
* Don't use [Knowledge-based Authentication (KBA)](https://en.wikipedia.org/wiki/Knowledge-based_authentication)

## NIST Guidelines for Password Storage

NIST also supplies guidelines for the verifier's encryption and storage of passwords. These policies ensure that [passwords are stored securely](https://nakedsecurity.sophos.com/2013/11/20/serious-security-how-to-store-your-users-passwords-safely/):

* Passwords shall be hashed with 32-bit (or greater) random salt
* Use approved key derivation function [PBKDF2](https://www.ietf.org/rfc/rfc6070.txt) using [SHA-1, SHA-2, or SHA-3](https://en.wikipedia.org/wiki/Secure_Hash_Algorithm) with at least 10,000 iterations
* Passwords should use keyed [HMAC](https://tools.ietf.org/html/rfc2104) hash with the key stored separately

## NIST on Multifactor Authentication

NIST recommends utilizing [out-of-band (OOB) authentication](https://www.techopedia.com/definition/29532/out-of-band-authentication-ooba) to provide [2-factor Authentication (2FA)](https://auth0.com/learn/two-factor-authentication/). The guidelines also state that **SMS is _deprecated_ for OOB authentication**. SMS can be compromised by a variety of threats such as smartphone malware, [SS7 attacks](https://www.theguardian.com/technology/2016/apr/19/ss7-hack-explained-mobile-phone-vulnerability-snooping-texts-calls), forwarding, change of phone number, and more.

Examples of non-SMS OOB authenticators include [Auth0 Guardian](https://auth0.com/docs/multifactor-authentication/guardian), [Duo Mobile](https://duo.com/solutions/features/two-factor-authentication-methods/duo-mobile), and [Google Authenticator](https://support.google.com/accounts/answer/1066447?hl=en). NIST states that use of biometrics must be _with_ another authentication factor for [Multifactor Authentication](https://auth0.com/docs/multifactor-authentication).

## Conclusion

Overall, the new guidelines put the user experience at the forefront while also establishing more robust storage and authentication methods. Although the NIST Digital Authentication Guideline governs Federal sites, its tenets are good standards for _any_ app or site with authentication. The guideline is currently in draft. When the policies are final, Federal agencies as well as many other companies and vendors will make strides to comply with the new guidelines for improved authentication security and user experience. To learn more, check out the [NIST Draft 800-63-3](https://pages.nist.gov/800-63-3) itself and [Jim Fenton's "Toward Better Password Requirements"](http://www.slideshare.net/jim_fenton/toward-better-password-requirements) presentation. 


