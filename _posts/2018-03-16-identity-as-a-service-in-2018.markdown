---
layout: post
title: "Identity-as-a-Service in 2018: What's New?"
description: "Between GDPR, biometrics and the blockchain, 2018 promises to be a big year for identity."
longdescription: "Blockchain, with its immutable nature for data storage; Biometrics with Apple's Face ID at the front; and EU's with its new GDPR enforcement, are changing the landscape of identity. Keep reading for the breakdown of the top identity-as-a-service trends of 2018."
date: 2018-03-16 12:30
category: Hot Topics, Trends
is_non-tech: true
author:
  name: Martin Gontovnikas
  url: http://twitter.com/mgonto
  mail: gonto@auth0.com
  avatar: https://www.gravatar.com/avatar/df6c864847fba9687d962cb80b482764??s=60
design:
  image: https://cdn.auth0.com/blog/idaas-in-2018/logo.png
  bg_color: "#222228"
  image_size: "70%"
tags:
- identity
- identity-as-a-service
- identity-management
- idaas
- blockchain
- face-id
- gdpr
related:
- 2018-01-26-security-predictions-for-2018-that-go-beyond-gdpr-compliance
- 2018-02-02-3-ways-to-get-an-iam-budget-in-2018
- 2017-12-08-how-poor-identity-access-management-equals-security-breaches
---

# What Is Identity as a Service (IDaaS)?

## We break down the core components of identity and access management and highlight solutions that can help your team move forward in a difficult threat environment.
If you're a growing company, particularly one that deals with a large volume of customer information, it's critical to know what solutions are available to help you protect all of this sensitive data.

The phrase identity as a service (or IDaaS) comes up repeatedly in conversations about protecting users. In the wake of scandals like [Facebook's](https://auth0.com/blog/what-facebook-disinformation-scandal-means-for-your-company/), many companies are turning to [identity as a service providers](https://auth0.com/) to help them secure and manage online identities.

But what exactly is identity as a service? What do these providers actually offer that can help you in such a challenging environment?
In this piece we define identity as a service and break it down into core components that can help teams be more secure.

## IDaaS Defined
Identity as a service (IDaaS) comprises cloud-based solutions for identity and access management (IAM) functions, such as single sign-on ([_SSO_](https://auth0.com/blog/4-vital-ways-enterprise-sso-saves-your-employees-time/)). These methods allow all users (customers, employees, and third parties) to more securely access sensitive information both on and off-premises. 

IDaaS also means collecting intelligence (i.e., logging events and reporting on which users accessed what information and when) to better understand, monitor, and improve their behaviors.
Multi-factor authentication (MFA), including biometrics, are core components of IDaaS.

### Multi-factor authentication (MFA)
Multi-factor authentication (MFA) is an increasingly popular way of verifying a user's identity. MFA requires more than one piece of identifying information (i.e., a password). 
Typically, two or more of the following criteria are used:

* **Knowledge:** Something the user knows (such as a password)
* **Possession:** Something the user has (such as a cell phone)
* **Inheritance:** Something the user is (such as a fingerprint or retina scan)

For example, some apps like Amazon have implemented [Touch ID](https://auth0.com/docs/multifactor-authentication/touchid). 
In order to enter the app, a user must possess their cell phone and know their password.

![touch-id](https://cdn.auth0.com/blog/idaas-2018/touch-id)

Multi-factor or two-factor authentication provides an additional layer of security and diminishes the likelihood of unauthorized access. If a cyber thief gets ahold of your password, they still won't be able to access your account without your thumb and phone. 

[Google 2-Step Verification](https://www.google.com/landing/2step/) and [Microsoft Authenticator](https://www.microsoft.com/en-us/account/authenticator)are other examples of how multi-factor authentication can work. Both of these rely on a TOTP (time-based one-time password algorithm).

Despite numerous reports on [the benefits of multi-factor authentication for stopping data breaches](https://auth0.com/blog/how-two-factor-authentication-can-help-financial-institutions-reduce-data-breaches/), widespread adoption is still low:

![mfa-graph](https://cdn.auth0.com/blog/idaas-2018/mfa-graph)

([Source](https://www.statista.com/statistics/789473/us-use-of-two-factor-authentication/))
One of the reasons for this is that it's relatively technical to get going — and users must be involved. Full deployment often requires issuing tokens or embedding cryptographic keys in specific devices. 
Multi-factor authentication is also not bulletproof (although it is certainly safer than a simple password-protected system). New and safer iterations of multi-factor authentication are becoming popular, such as biometrics.

### Biometrics
Biometrics means the use of an "inheritance" criteria — something the user *is* as a means of verification. 
In addition to touch ID, other common multi-factor authentication methods include SMS and voice verifications. 
Some teams are even turning to thumbprints, iris or retina recognition, full [facial recognition](https://www.syte.ai/blog/brief-history-image-search/), fingerprint, hand, and DNA usage.
Additional emerging technologies include:

* **Voice recognition**. (Auth0 already has a means of helping users [_authenticate_](https://auth0.com/blog/two-factor-authentication-using-biometrics/) via voice recognition with our partner, Twilio.)

* **Typing recognition**. (While this has been slower to stick in U.S. markets, many financial firms in Norway have widely adopted the strategy. One company boasted a [_99.7%_](https://www.hottopics.ht/stories/consumer/dont-go-hacking-my-heart-10-startups-at-the-frontier-of-biometric-authentication/) success rate for distinguishing real users from fake.)
Body modifications (body mod) is one more pioneering method.

![chip-in-hand](https://cdn.auth0.com/blog/idaas-2018/chip-in-hand)

Above, a senior BuzzFeed reporter [_implanted a chip in his hand_](https://www.buzzfeed.com/charliewarzel/yes-we-scan?utm_term=.rvybjNzVOX#.hgpyDE14O2) and successfully purchased goods by connecting it to a mobile paying app.
While many of these represent exciting new frontiers for biometrics and multi-factor authentication, Touch ID, SMS, and voice verifications are good places to begin.

## New Regulations to Help Protect Users' Identities
One of the reasons that IDaaS has become so important recently is the rush to comply with the EU's [_General Data Protection Regulation_](https://www.eugdpr.org/) (GDPR). Officially approved April 14, 2016, GDPR officially became enforceable May 25, 2018. It applies to all businesses globally that collect and process the data of EU citizens.
A slew of other related regulations are springing up, such as [the California Consumer Privacy Act (CCPA)](https://auth0.com/blog/brace-yourself-the-gdpr-ripple-effect-in-california/).
Today, organizations that are audited and don't have adequate security measures in place for consumer data can be fined up to 20 million euros or 4 percent of annual global turnover — whichever is higher.

![gdpr-compliance](https://cdn.auth0.com/blog/idaas-2018/gdpr-compliance)

[_Image source_](https://www.lepide.com/infographics/gdpr-compliance-checklist.png)

Despite these stiff punishments, a lot of companies are far from ready. Studies show that in Ireland, for example, [_a quarter of organizations_](https://www.independent.ie/business/technology/gdpr/almost-one-quarter-of-irish-firms-will-be-forced-to-close-if-subject-to-gdpr-fines-survey-36131915.html) would be forced to shut down if audited — and [60%](https://www.theverge.com/2018/5/22/17378688/gdpr-general-data-protection-regulation-eu) of tech companies aren't fully prepared.
This opens more possibilities for IDaaS providers in 2018. Strong, flexible identity management is essential to keeping user identities safe and allowing them to [comply with the new GDPR rules](https://www.godaddy.com/garage/practical-steps-for-website-gdpr-compliance/) like:
* A new Right to Data Portability
* An extended Right to Be Forgotten (also called the Right to Erasure)
* An enhanced Subject Access Right - to be free and with a shorter time to reply
Although an IDaaS provider like Auth0 can't ensure your organization will be fully compliant, we have lots of [tools](https://auth0.com/gdpr) that can help.

## IDaaS and Blockchain
2017 and 2018 have been enormous years for Bitcoin, Ethereum, and other cryptocurrencies. Although the technology remains divisive ([_PwC_](https://www.pwc.com/us/en/financial-services/publications/assets/pwc-cryptocurrency-evolution.pdf) calls cryptocurrencies one of the "greatest technological breakthroughs since the Internet," while others describe them as a money-sucking "black holes"), it still highlights some incredible IDaaS opportunities.

![ethereum](https://cdn.auth0.com/blog/idaas-2018/1-ethereum-price-fb.jpg)

[_Image source._](https://ethereumprice.org/wp-content/uploads/2017/12/ethereum-price-fb.jpg)

The decentralized nature of blockchain avoids large, consolidated pools of data, which are ripe for hackers. Distributed ledgers can separate personal data, duplicate it thousands of times, and disperse it globally — but true ownership of the data remains with the individual.
While no one truly knows how (or whether) blockchain will definitely be used to manage personal identities going forward, many argue that because of its [success in tracking inventory and payments](https://auth0.com/blog/how-the-blockchain-could-change-the-idea-of-identity/), similar techniques could help verify individuals and their behaviors.

## What's Ahead for IDaaS
Demand from new regulations, paired with a lot of excitement and funding for new solutions, has opened a lot of avenues for IDaaS. 
Teams of all sizes are [taking security seriously](http://blog.idonethis.com/security-ringcaptcha/) and making investments so they can move forward with less worry.
Incorporating tactics like multi-factor authentication, including biometrics like Touch ID, making sure you're in compliance with GDPR and other identity regulations, and even brainstorming how blockchain might help verify your users in the future will help your team secure its most critical data so you can grow safely.