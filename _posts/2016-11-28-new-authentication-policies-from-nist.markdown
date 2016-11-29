---
layout: post
title: "Title Should be Less Than 56 characters"
description: "Description goes here and must be less than 156 characters."
date: 2016-11-28 8:30
category: Passwords, Authentication, Security
author:
  name: "Kim Maida"
  url: "https://twitter.com/KimMaida"
  mail: "kim.maida@auth0.com"
  avatar: "https://en.gravatar.com/userimage/20807150/4c9e5bd34750ec1dcedd71cb40b4a9ba.png"
design:
  bg_color: "#1F3C5E"
  image: https://cdn.auth0.com/blog/federated-identity/logo.png
tags:
- security
- passwords
- authentication
- NIST
related:
- date-post-name
- date-post-name
---

**TL;DR:** The United States National Institute of Standards and Technology ([US NIST](https://www.nist.gov/)) is creating new policies for Federal agencies implementing authentication. Learn about [NIST 800-63-3: Digital Authentication Guideline](https://pages.nist.gov/800-63-3/sp800-63-3.html) and what it means for authentication security. 

---

## NIST Digital Authentication Guideline

The [US National Institute of Standards and Technology (NIST)](https://www.nist.gov/) is creating new policies for Federal agencies implementing authentication. The draft, called **Special Publication 800-63-3: Digital Authentication Guideline**, is available [on the NIST website](https://pages.nist.gov/800-63-3) as well as [on NIST's GitHub](https://github.com/usnistgov/800-63-3). The suite of documents includes the following:

* [800-63-3: Digital Authentication Guideline](https://pages.nist.gov/800-63-3/sp800-63-3.html) (overview)
* [800-63A: Enrollment & Identity Proofing](https://pages.nist.gov/800-63-3/sp800-63a.html)
* [800-63B: Authentication & Lifecycle Management](https://pages.nist.gov/800-63-3/sp800-63b.html)
* [800-63C: Federation & Assertions](https://pages.nist.gov/800-63-3/sp800-63c.html)

The policies are intended for Federal agency applications, but serve as a standard for many others as well.

## Improved Password Requirements

The NIST Digital Authentication Guideline strives for improved password requirements. One of the guiding principles is _better user experience_ and shifting the burden of . In order to support the creation of passwords that users will remember while implementing excellent security, several guidelines are important:

* Length: 8 character minimum, >64 character maximum
* Compare new passwords to a dictionary and don't allow common, easily-guessed passwords (such as `password`, `abc123`, etc.)
* Allow all printing characters + spaces
* Don't enforce composition rules (ie., no "passwords must include uppercase and lowercase letters, a number...", etc.); such rules provide a poor user experience
* Don't use password hints; they weaken authentication 
* Don't expire passwords without reason; regular expiration encourages users to choose easy-to-guess, less secure passwords
* Don't use [Knowledge-based Authentication (KBA)](https://en.wikipedia.org/wiki/Knowledge-based_authentication)

