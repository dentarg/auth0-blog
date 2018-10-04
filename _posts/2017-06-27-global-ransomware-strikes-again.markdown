---
layout: post
title: "Global Ransomware Strikes Again"
description: "A new global ransomware attack is affecting European countries and governments"
date: 2017-06-27 16:00
category: Security, Data Breach, Cyberattack
author:
  name: "Bruno Krebs"
  url: "https://twitter.com/brunoskrebs"
  mail: "bruno.krebs@auth0.com"
  avatar: "https://www.gravatar.com/avatar/76ea40cbf67675babe924eecf167b9b8?s=60"
design:
    bg_color: "#7F2833"
    image: https://cdn.auth0.com/blog/petya-ransomware/petya-logo.png
related:
  - 2017-05-13-a-massive-ransomware-attack-targets-organizations-around-the-globe
  - 2015-12-15-security-trends-for-2016
tags:
  - security
  - data-breach
  - ransomware
  - wannacry
---

In May, a ransomware called [WannaCry](https://auth0.com/blog/a-massive-ransomware-attack-targets-organizations-around-the-globe/) became famous around the world for holding computers' file systems as hostages. Today, government institutions (like [Ukraine's national bank](http://www.independent.co.uk/news/world/americas/petya-cyber-attack-us-pharma-merck-ukraine-ransomware-national-bank-power-wpp-ad-agency-wannacry-nhs-a7810906.html)) and companies from the private sector reported that another outbreak has started.

The ransomware responsible for haunting organizations today is called Petya, although this name originates from a [ransomware that attacked last year](https://blog.kaspersky.com/petya-ransomware/11715/). Similarly to WannyCry, today's Petya ransomware starts by encrypting a computers file systems and then it demands payments to restore access to these files.

## What Is a Ransomware?

The very definition of ransomware is a malware that blocks access to the victim's data until a ransom is paid. There are some ransomwares that lock the systems in a way that is not difficult to reverse, but the more advanced ones are using a technique called [cryptoviral extortion](https://en.wikipedia.org/wiki/Cryptoviral_extortion). This technique consists of encrypting victims files, makes them inaccessible. To regain access, the authors demand a ransom payment to reverse the encryption. Nowadays, most ransomwares are requesting [Bitcoins](https://bitcoin.org/) as ransom payment, to [take advantage of cryptocurrency's anonymity](https://bitcoinmagazine.com/articles/is-bitcoin-anonymous-a-complete-beginner-s-guide-1447875283/).

## What Is Petya Ransomware?

The real name of the ransomware that is striking today has not been defined. But, as this ransomware is supposed to be a variant of [Petya](https://blog.kaspersky.com/petya-ransomware/11715/), the name is being reused. Petya locks a computers hard drive as well as individual files stored on it. It's not easy to recover data from the computers affected by this malware.

One interesting fact is that cyber security experts at Kaspersky Lab have released a report that said the ransomware was not related to Petya but was in fact a new ransomware it called [NotPetya](https://www.forbes.com/sites/thomasbrewster/2017/06/27/petya-notpetya-ransomware-is-more-powerful-than-wannacry/#16c86cff532e). The contradictions are yet to be clarified.

![NotPetya/Petya screenshot](https://cdn.auth0.com/blog/petya-ransomware/notpetya.png)

## How Petya Started?

[A Ukrainian software firm is alleged to be the source of today's outbreak](https://www.forbes.com/sites/thomasbrewster/2017/06/27/medoc-firm-blamed-for-ransomware-outbreak/#20ca49ae73c8). Although there is no confirmation about this, and that the company has denied these claims in a [Facebook post](https://www.facebook.com/medoc.ua/posts/1904044929883085), the outbreak is indeed striking Ukraine harder then any country.

![Petya/NotPetya attacks by country](https://cdn.auth0.com/blog/petya-ransomware/by-country.png)

## How The Petya Ransomware Spreads?

Researchers are saying that the this new outbreak is hitting systems via the same leaked NSA vulnerabilities used by [WannaCry](https://auth0.com/blog/a-massive-ransomware-attack-targets-organizations-around-the-globe/). The analysis of some of Petya's samples confirmed that the malware author used the [EternalBlue exploits](https://en.wikipedia.org/wiki/EternalBlue), which targeted a vulnerability in Microsoft Windows. [Microsoft already created patches to solve EternalBlue vulnerability](https://www.theverge.com/2017/4/15/15311846/microsoft-windows-shadow-brokers-nsa-hacks-patched), but many computers out there don't have this patch applied.

## How Do I Protect Myself?

Although no solutions were found for retrieving data from computers affected by Petya so far, you can review and [update your devices](https://www.theverge.com/2017/4/15/15311846/microsoft-windows-shadow-brokers-nsa-hacks-patched) and also check that your approach to security is good. Recently we wrote a blog post that shares some good practices regarding [Personal Information Security Guide for Family and Friends](https://auth0.com/blog/personal-information-security-identity-guide/).

Be sure to check out this [guide](https://auth0.com/blog/personal-information-security-identity-guide/) to learn how to secure your wireless network, backup your data so that it is not lost if you become a victim of ransomware such as WannaCry, detect phishing scams, and more.

## Aside: Securing Applications with Auth0

Are you building a [B2C](https://auth0.com/b2c-customer-identity-management), [B2B](https://auth0.com/b2b-enterprise-identity-management), or [B2E](https://auth0.com/b2e-identity-management-for-employees) tool? Auth0, can help you focus on what matters the most to you, the special features of your product. [Auth0](https://auth0.com/) can improve your product's security with state-of-the-art features like [passwordless](https://auth0.com/passwordless), [breached password surveillance](https://auth0.com/breached-passwords), and [multifactor authentication](https://auth0.com/multifactor-authentication).

[We offer a generous **free tier**](https://auth0.com/pricing) so you can get started with modern authentication.
