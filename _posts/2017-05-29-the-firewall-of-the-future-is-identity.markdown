---
layout: post
title: "The Firewall of the Future Is Identity"
description: "Focus your protection on the most precious assets"
date: 2017-05-29 8:30
category: Growth, Identity
author:
  name: Martin Gontovnikas
  url: http://twitter.com/mgonto
  mail: gonto@auth0.com
  avatar: https://www.gravatar.com/avatar/df6c864847fba9687d962cb80b482764??s=60
design:
  bg_color: "#4a4a4a"
  image: "https://cdn.auth0.com/blog/identity-firewall/logo.png"
is_non-tech: true
tags:
- identity
- firewall
- security
related:
- 2017-03-24-360-view-of-customer-by-managing-identity
- 2017-03-15-5-reasons-your-company-needs-identity-and-access-management
- 2017-03-20-anomaly-detection-safer-login-with-thisdata-and-auth0
---

It's estimated by the analysts at [MarketsandMarkets](http://www.marketsandmarkets.com/Market-Reports/identity-access-management-iam-market-1168.html) that the total identity management market will grow from $8 billion in 2016 to nearly $15 billion by 2021.

In total, it's expected that businesses worldwide are going to spend just over [$100 billion](http://fortune.com/2016/10/12/cybersecurity-global-spending/) on cybersecurity software and services by 2020, up from $73 billion today.

That's about an 8% Compound Annual Growth Rate (CAGR) in overall cybersecurity spending, and about 13% in identity management specifically.

The amount being spent on identity management is projected to increase faster than the amount spent on security as a whole—and that has a lot to do with the growing recognition of how important properly secured, audited and compliant identity management is to preserving network security.  

## The Problem with Simply Spending More on Security

Just looking at the overall amount of money being spent on network security, you might think that companies are responding well to the increased threat of breaches—and the constant drumbeat of networks being compromised/passwords being leaked that we hear in the news.

But if you look at the increase in spending alongside how those breaches have changed, you start to see a different story. While we're spending more on security, we're also seeing bigger and more frequent breaches take place—[of more sensitive data](http://www.informationisbeautiful.net/visualizations/worlds-biggest-data-breaches-hacks/).   

In 2005, [137 data breaches](http://www.privacyrights.org/data-breach) were reported by the Privacy Rights Clearinghouse. That number spiked to 783 in 2014, and 1,093 in 2016.

![Data breaches](https://cdn.auth0.com/blog/identity-firewall/data-breaches.png)

Simply spending more and more on cybersecurity while the number of breaches grows greater each year—the juxtaposition of these two facts should give you pause. Where, exactly, has all that money been going?

In many cases, it's been going to the same things for years and years. The security budget, while bumped up, has been wasted in exactly the same way over and over again.

As Vormetric's Vice President of Marketing Tina Stewart [puts it](https://betanews.com/2016/03/24/federal-agency-threats/), "Albert Einstein's oft-used quote is fitting -- if doing the same thing over and over and expecting a different result isn't the definition of insanity, it is certainly a recipe for placing our nation’s critical assets at risk.”

## Where We Should Spend Money—the New Firewall

When you look at the attack vectors and consequences of the biggest data breaches [of the last decade](https://betanews.com/2014/07/03/the-top-10-data-breaches-and-how-they-happened/), one thing stands out:

* **Adobe** (2013): weak password requirements abetted exposure of customer data (152 million customers affected)
* **eBay** (2014): employee credentials stolen (145 million customers affected)
* **Target** (2013): personal information exposed (110 million customers)
* **Epsilon** (2011): customer names and email addresses exposed
* **Sony** (2011): names, emails, passwords, and credit cards exposed (77 million users affected)

The people who are attacking these systems are very rarely doing so as a form of corporate espionage. They're rarely (at least not for bigger sites) doing it for ransom, as “hacktivism,” or out of boredom.

They're doing it to gain access to **user identities.** They're often even using one compromised identity to gain access to the entire network of identities that you are responsible for maintaining.

They're doing that to get at sensitive information like names, email addresses, credit cards—but also things like API tokens and secrets that can be harnessed to *find* your users' more precious personal secrets.  

### Why you need risk-based security

![Banks are looking at you](https://cdn.auth0.com/blog/identity-firewall/dolar-eye.png)

Think of yourself like a bank. Customers come and do business with you—you provide them a product or a service, they pay you, and alongside all of this, there's an expectation that you will keep their data—or investment—safe.     

How do you design a bank to make sure you keep the valuables safe?

You don't make people come in through blast doors or get fingerprinted the moment they walk in—that would be insane. You'd make the very act of doing business with your bank extremely unpleasant. Nor would protecting against unauthorized entry *into your lobby* be much good for protecting against the dedicated attacker.  

No—you leave the lobby as it is. In fact, upon walking into the bank, there's very little visible security infrastructure at all. In fact, **you could probably walk right into the secure area if you wanted to**. It would be trivial to get access.

It would be easy to get *to* the safe. What you're not going to be able to do is actually crack it open.

The way a bank's security operates hinges on this idea of risk-based security. The bank knows that people are going to come and try to rob it. They also know that the vast majority of people are not there to rob it. Therefore, it makes sense to build a system that focuses only on [stopping attackers](http://www.delfigosecurity.com/iamblog/security-vulnerabilities/are-we-ready-for-a-poach-breach-mindset), not on building the maximally secure bank lobby.

![Man in the middle](https://cdn.auth0.com/blog/identity-firewall/man-in-the-middle.png)

You can't keep a dedicated criminal from getting into the bank. You can stop them from getting anything of value and leaving with it, though. This is how you should also treat your network security.

## Protecting Your Most Valuable Information

There are many different ways to compromise an account, from exploits to the abuse of features built into programs to social engineering.

Attackers [sometimes go as far](https://medium.com/@botherder/on-the-banality-of-attacks-and-on-mindful-engineering-fc0a50e5cff5#.b2v9n4xe0) as to “befriend victims, impersonate their relatives and co-workers, and create all the pre-conditions to make the attack as credible as possible.”

But the fact that accounts can be compromised from many directions and through many vectors [does not mean](https://medium.com/@botherder/on-the-banality-of-attacks-and-on-mindful-engineering-fc0a50e5cff5#.b2v9n4xe0) “that we should leave all doors open.” As hacker and security researcher Nex says, “Reducing the number of possible attack points allows us to deal and watch for the fewer remaining ones more efficiently.”

Three of the major methods for reducing attack points are:

* **[Multifactor authentication](https://auth0.com/learn/multifactor-authentication/)**: The requiring of multiple authentication stages for users to be identified—can operate through Time-based One-Time Password (TOTP), mobile verification, hardware, SMS, etc. Also, can solely be triggered through context—a new geographic location for login, a specific time of day, or a specific type of network.    
* **[Breached password detection](https://auth0.com/breached-passwords)**: Continuously updating a list of credentials identified as breached, so all user attempts to login or signup with them can be verified as non-breached, and matches can be blocked.
* **[Anomaly detection](https://auth0.com/learn/anomaly-detection/):** Monitoring network traffic and alerting users upon outlier events—logins from new IP addresses or devices, multiple failed login events in a short period of time, using [Tor network](http://lifehacker.com/what-is-tor-and-should-i-use-it-1527891029), and others.

Multifactor authentication, breached password detection, and anomaly detection are just three of the risk based security features that Auth0 offers customers. But these are the kinds of things that businesses need to be pursuing in this age when breaches are frequent, breaches are significant, and the amount of customer data in the cloud grows larger and larger each day.

## Intelligent and Adaptive Security

Even the most dedicated and advanced attackers can be caught out when the right measures are in place and the right data is being collected—in cybersecurity as elsewhere.

Says security expert [the Grugq](https://grugq.tumblr.com/post/142637754018/elusive-midday-bandit-robs-11th-bank-fbi-patch): If a [small-time robber takes $70](https://grugq.tumblr.com/post/142637754018/elusive-midday-bandit-robs-11th-bank-fbi-patch) one day, and then two weeks later takes $350, and then one week later takes $1000, investigators can infer how much they're spending per day ($50~) and precisely when the next robbery will occur (in 3 weeks~). “If they’ve profiled more, such as his geographic operations zone, and what type of bank he usually targets,” he continues, “They can place assets in the area and be ready for him.”

Risk based security is part of acknowledging the world we live in today. Breaches are going to happen. Attacks are going to happen. Don't hope that the flood will never come—build above sea level, mitigate its effects, and above all, protect what really matters.
