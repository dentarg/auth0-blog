---
layout: post
title: "How to Protect Yourself From Security Oversights"
description: "An inside look at how tech companies can improve their security — and what you can do to help yours, too"
date: 2017-06-06 8:30
category: Growth, Modern Authentication
author:
  name: Diego Poza
  url: https://twitter.com/diegopoza
  avatar: https://avatars3.githubusercontent.com/u/604869?v=3&s=200
  mail: diego.poza@auth0.com
design:
  image: https://cdn.auth0.com/blog/go-beyond-up-auth/logo.png
  bg_color: "#01B48F"
tags:
- security
- passwordless
- social-login
related:
- 2016-11-23-how-passwordless-authentication-works
- 2016-10-17-sso-login-key-benefits-and-implementation
---

Sometimes it's easy to assume that big-name companies like Google or Microsoft have flawless security practices, but even the mighty make mistakes. While they generally do a good job of building robust security protections into their products, things invariably fall through the cracks, whether it be through weak user authentication or overzealous app permissions.

These issues underscore the importance of rethinking how users and companies should approach their security concerns. An overreliance on the security practices of the tech giants fosters complacency, so it is important to take the lead in your own security needs. Not only does this protect your interests, it will allow you to learn from the mistakes of leaders and iterate on your own practices.

In this article, we'll explore some of the most significant oversights, and what you can do to mitigate these risks without giving up the services you need.

## Notable security oversights

When one looks at Google's machine learning capabilities or Apple's refined ecosystems, it's clear that tech companies are powerhouses of innovation. When using a product like Google Assistant, it's easy to assume that the company that produces it has limitless resources.

However, it's still worth having a critical eye directed towards them. Products like Google Assistant or Siri raise important privacy considerations that can have a substantial impact on consumer adoption.

Even the most careful tech giant occasionally lets a security concern slip through the cracks. Keeping track of how major companies conduct security can highlight relevant issues within your own businesses, so here are a few that will encourage you to reexamine your security practices.

**Apple:** Apple's iCloud offers a seamless integrated experience across its entire product line. However, there have been reports of issues with unvalidated email addresses in iCloud. InfoWorld columnist [Andrew C. Oliver](http://www.infoworld.com/article/3112124/security/the-catch-22-with-apple-security.html) recounts a personal experience where his Apple ID username got mixed up with another user's account due to inconsistent email authorization standards that grandfathered unvalidated credentials.

**Takeaway:** Routine maintenance of inactive or unvalidated accounts is crucial as authentication practices evolve, so companies should make this cleanup a priority.

**Microsoft:** Outlook native clients are among the most used in the world, due to the platform's top-tier productivity and enterprise integrations. But their lack of OAuth protocol support means that they can access both your username and password, unlike Apple Mail or Thunderbird, which reduce scopes to just email read/write access.

**Takeaway:** [OAuth](https://auth0.com/docs/protocols/oauth2) allows users to grant limited account access to a client, without exposing their credentials. This is so important that identity management services, like Auth0, are unable to support mail clients, like Outlook, which don't support the protocol.

**Google:** Google Docs is an essential productivity lifeline for millions due to its stability, flexibility, and shareability. However**, **Google's recent phishing problem on [Google Docs](https://auth0.com/blog/all-you-need-to-know-about-the-google-docs-phishing-attack/) has highlighted the limitations of its walled garden, as well as the strengths and weaknesses of OAuth. The phishing attack masqueraded as a shared document email from Google, using a third-party extension that Google then asked users to authorize. Google promptly removed the extension, and its use of OAuth meant that username and password credentials were kept safe from the attacker.

![Shared with me](https://cdn.auth0.com/blog/phish/sharedwithme.png)

**Takeaway:** An incident like this shows the need for improved third-party extension oversight on Google's part, but also highlights how users need to be more vigilant when approving account access requests.

These security weaknesses show that even the biggest tech giants have plenty of room for improvement. It's easy to assume that they can take care of all of your security needs, but ultimately that the responsibility comes down to you. Luckily, adhering to security best practices isn't as difficult as it seems.

## What should consumers do?

Ultimately, you are your own best advocate. For most consumers who use the basic functionality of these services, these authentication weaknesses probably have little effect on their daily usage. But being familiar with basic security practices can help you feel and stay safe.

Nearly everyone is guilty of scrolling past terms and conditions and clicking “I agree” without reading them. However, sifting through that legalese of **terms and conditions can help you find out how your data is being used.** From there, you can make the determination if you agree with the security and privacy standards of the platform. (And companies: urge your customers to read your terms and conditions, and clearly inform them of any changes.)

![Microsfot Services agreement](https://cdn.auth0.com/blog/microsft/servicesagreement.png)

When you download an app or start a service, **pay close attention to the permissions** it requests. You may be surprised by the extensive access some apps require, such as SMS or camera permissions. If you take the time to examine these, you can protect yourself from being subject to potentially malicious overreach and data collection.

With users juggling multiple accounts for their personal and professional needs, understanding authentication standards is probably the last thing on anyone's mind. They shouldn't be though because following authentication and [**identity best practices**](https://auth0.com/blog/personal-information-security-identity-guide/) can help make sure that you know how to mitigate future breaches, whether they be caused by yourself or a major company.

## Best practices for companies

![Cryptocard two factor](https://cdn.auth0.com/blog/companies/CryptoCard_two_factor.jpg)

Security oversights by tech giants are more difficult to look past when you're an SMB or enterprise setting. Companies have a whole host of additional privacy concerns, from financial data to intellectual property. Security oversights can limit what types of software and integrations you feel comfortable using at your company. In order to avoid costly compliance issues, consider following these best practices.

Companies should **stay on top of the latest security lapses**, and constantly try to contextualize them alongside their own platform. This may be daunting given the scale of these lapses, but you have to be proactive in order to identify potential weaknesses in your own security setup. Failing to keep up with security threats can put your customers and company at risk.

Consider **customizing enterprise agreements.** Before jumping into an agreement with a tech behemoth, see if you can get more favorable privacy terms or block weaker authentication protocols. A company shouldn't settle for the default terms under the assumption that it'll serve their needs right off the bat.

**Embrace outsourcing for issues relating to user authentication and identity management.** Much like Apple or Google can't commit 100% of their resources to security, your company's resources are better spent on innovation rather than security maintenance. Services like Auth0 help centralize and strengthen your [authentication needs](https://auth0.com/blog/5-reasons-your-company-needs-identity-and-access-management/), since Auth0 is in a position to commit all of their resources to maintaining the most up-to-date standards.

Unfortunately, as we all know, security mistakes happen. User behaviors and the technologies we rely on for everyday operations change at a rapid pace. By learning about security risks and seeking the assistance of specialists when you need to, your new commitment to security should ensure that you're always at the highest standard of security.

## Embrace proactive security knowledge

It is easy to become complacent when delegating all of your security needs to titans like Google and Apple. While they produce great products that we can't live without, there is always room for improvement on the security front. By taking the initiative to learn where and when these products fall short, individuals and companies alike are able to take a proactive stance on their security needs.

The benefits of taking a proactive approach to security also have a broader impact — they force you to constantly iterate and respond to the latest changes in the realm of security and authentication. Doing this not only improves safety outcomes, it will also ensure that you think more critically about your own use cases and products. With this, you'll be able to handle any future problems with ease.