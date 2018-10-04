---
layout: post
title: "A Massive Ransomware Attack Targets Organizations Around the Globe"
description: "A global cyber-attack using leaked NSA tools is targeting organizations worldwide including UK's National Health Service, Spain's Telefonica telecom, and many more."
date: 2017-05-13 8:30
category: Security, Data Breach, Cyberattack
author:
  name: "Ado Kukic"
  url: "https://twitter.com/kukicado"
  mail: "ado@auth0.com"
  avatar: "https://s.gravatar.com/avatar/99c4080f412ccf46b9b564db7f482907?s=200"
design:
  image: https://cdn.auth0.com/blog/this-the-season-for-cyber-criminals/logo.png
  bg_color: "#191716"
related:
  - 2016-11-30-different-ways-to-implement-multifactor
  - 2015-12-17-json-web-token-signing-algorithms-overview
tags:
  - security
  - data-breach
  - ransomware
  - wannacry
---

A ransomware, called [**WannaCry**](http://money.cnn.com/2017/05/12/technology/ransomware-attack-nsa-microsoft/), is making rounds across the globe and infecting vulnerable systems worldwide. Amongst the affected include FedEx, UK's National Health Service, Spain's Telefonica telecom, Russia's Interior Ministry, and many more. Hackers exploiting leaked NSA secrets and tools are said to be behind the massive attack, although no specific group has been identified as of yet.

The **WannaCry** ransomware encrypts a computer's file system and demands payment to restore access to the files. If a payment is not made in 7 days, the ransomware will delete all of the files on the machine. The attack, circulated initially through email, targets Windows machines that have not received the March 2017 security update where Microsoft fixed the vulnerability that makes this particular attack possible.

![WannaCry Ransomware](https://cdn.auth0.com/blog/wannacry/wannacry.png)

Ransomware attacks are nothing new. In 2016, a [Los Angeles hospital paid $17,000](https://www.nytimes.com/2016/02/19/business/los-angeles-hospital-pays-hackers-17000-after-attack.html) to regain access when hackers seized control. In fact, in our [Security Trends for 2016](https://auth0.com/blog/security-trends-for-2016/), we mentioned that **cyber extorsion** is likely to evolve and keep security specialists up at night, and we hate that we were right. The **WannaCry** cyber-attack is looking to be one of the biggest attacks recorded!

The **WannaCry** cyber-attack has been reported in 99 countries and over 75,000 attacks have been carried out so far, but perhaps the most concerning is the attack on UK's National Health Service (NHS), as it has life-or-death implications. An important thing to note is that these numbers are only from victims that have self-reported the attack, which means that the scope of this cyber-attack is most likely larger than reported.

Companies can protect themselves and their users agains cyber-attacks by developing strong incident response capabilities to complement their traditional security measures. As prevention can not be successful everytime, being capable of detecting and responding to incidents quickly is crucial. For individuals, the best way to prevent becoming a victim of ransomware and other cyber-attacks is to always keep your operating system up-to-date by enabling automatic updates. It may be annoying to see the *"You need to restart your computer to apply updates"* message, but a 5-10 minute downtime beats losing years worth of data.

## Personal Information Security Guide

Although you may not be affected by the **WannaCry** ransomware, it may be a good time to review our [personal information security guide](https://auth0.com/blog/personal-information-security-identity-guide/) which has plenty of tips on securing your personal information online, detecting phising scams, backing up data, and much more.

Top things to remember when it comes to choosing a good password:

* Don't reuse the same password for multiple accounts.
* Combine alphanumeric, special, lower and uppercase characters.
* Your password should be at least 10 characters long.
* If possible, enable [multifactor authentication](https://auth0.com/multifactor-authentication) for your account.

Be sure to check out the [personal information security guide](https://auth0.com/blog/personal-information-security-identity-guide/) to learn how to secure your wireless network, backup your data so that it is not lost if you become a victim of ransomware such as **WannaCry**, detect phishing scams, and more.

## Aside: Securing Applications with Auth0

Are you building a [B2C](https://auth0.com/b2c-customer-identity-management), [B2B](https://auth0.com/b2b-enterprise-identity-management), or [B2E](https://auth0.com/b2e-identity-management-for-employees) tool? Auth0, can help you focus on what matters the most to you, the special features of your product. [Auth0](https://auth0.com/) can improve your product's security with state-of-the-art features like [passwordless](https://auth0.com/passwordless), [breached password surveillance](https://auth0.com/breached-passwords), and [multifactor authentication](https://auth0.com/multifactor-authentication).

[We offer a generous **free tier**](https://auth0.com/pricing) so you can get started with modern authentication.
