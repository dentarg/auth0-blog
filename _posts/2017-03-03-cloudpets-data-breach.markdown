---
layout: post
title: "Cloudpets Data Breach Affects Over 820,000 Customers"
description: "An unsecured database allowed hackers to steal personal information from over 820,000 Cloudpets customers."
date: 2017-03-03 8:30
category: Security, Data Breach
author:
  name: "Ado Kukic"
  url: "https://twitter.com/kukicado"
  mail: "ado@auth0.com"
  avatar: "https://s.gravatar.com/avatar/99c4080f412ccf46b9b564db7f482907?s=200"
design:
  image: https://cdn.auth0.com/blog/delegated-admin-cloud-cakes/hero.png
  bg_color: "#222228"
design:
  bg_color: "#000000"
  image: https://cdn.auth0.com/blog/cloudbleed-post/cloudflare-logo.png
related:
  - 2016-11-30-different-ways-to-implement-multifactor
  - 2015-12-17-json-web-token-signing-algorithms-overview
tags:
  - security
  - data-breach
  - cloudpets
---

[Spiral Toys](http://spiraltoys.com/) is a company that creates toys for children. It has an internet-connected product called [CloudPets](http://cloudpets.com/) which allows parents and children to record and send voice messages to each other through a mobile app. On January 7, hackers discovered that the database the company was using to store data for this product was unsecured. Hackers took control of the database, deleted all information, and demanded a payment to restore the data.

![Cloudpets Homepage](https://cdn.auth0.com/blog/cloudpets-data-breach/cloudpets.png)

The database contained information for 820,000+ users containing emails, bcrypt hashed passwords, and links to voice recordings customers and their children had made which could now be publicly accessed. Additional information stored included pictures, names, birthdays, and relationships. Customers were not notified that their data had been compromised.

[Troy Hunt](https://twitter.com/troyhunt) wrote an excellent [article](https://www.troyhunt.com/data-from-connected-cloudpets-teddy-bears-leaked-and-ransomed-exposing-kids-voice-messages/) covering this incident. Some highlights include that the database used was publicly accessible and did not even require a password to access. Cloudpets was also notified at least four times that their database was exposed and the reporters never heard back from the company. Finally, staging and test databases were also discovered which had production data that could have also been compromised.

Aside from the devops failure to secure the database properly, password requirements for user accounts were non-existant. Although the passwords were stored as bcrypt hashes, Troy was able to use [Hashcat](https://hashcat.net/hashcat/) and find valid passwords such as "qwe", "password", and "123456". 

![Cracked Bcrypt Hashes](https://cdn.auth0.com/blog/cloudpets-data-breach/cracked-bcrypt-hashes.png)

Source: [Troy Hunt](https://www.troyhunt.com/data-from-connected-cloudpets-teddy-bears-leaked-and-ransomed-exposing-kids-voice-messages/)

Since the database has been publicly exposed since at least December 25, 2016, it is safe to assume that many malicious parties have accessed and downloaded the data. We urge customers that have Cloudpets accounts to change their passwords and monitor their other accounts for signs of malicious activity.

## Personal Information Security Guide

Even if you don't have a Cloudpets account, it may be a good time to review our [personal information security guide](https://auth0.com/blog/personal-information-security-identity-guide/) which has plenty of tips on securing your personal information online, best practices for choosing good passwords, and much more. 

Top things to remember when it comes to choosing a good password:

* Don't reuse the same password for multiple accounts.
* Combine alphanumeric, special, lower and uppercase characters.
* Your password should be at least 10 characters long.
* If possible, enable [multifactor authentication](https://auth0.com/multifactor-authentication) for your account.

## Auth0 Can Protect Your Users and Apps

Managing identity is a complex and difficult task. At [Auth0](https://auth0.com), our goal is to make identity simple for developers. A recent feature we launched called [Breached Password Detection](https://auth0.com/breached-passwords) can help alert your users that their credentials have been compromised in a data breach when they login to your app. This helps your users stay safe, but also protects your apps from malicious access. Additionally, Auth0 meets the standards for various [password strength requirements](https://auth0.com/docs/connections/database/password-strength), provides [multifactor authentication](https://auth0.com/multifactor-authentication), and more.

If you want to make identity simple and secure for your applications, give Auth0 a <a href="javascript:signup()">try</a>.
