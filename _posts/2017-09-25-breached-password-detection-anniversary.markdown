---
layout: post
title: "Breached Password Detection: Protect Your Users’ Data Before It’s Too Late"
description: "Recent breach affecting up to 711M email addresses shows critical need for protection and detection."
date: 2017-09-25 17:34
category: Product, Features, Breached Password Detection
press_release: true
is_non-tech: true
author:
  name: Jeana Tahnk
  url: http://twitter.com/jeanatahnk
  mail: jeana.tahnk@auth0.com
  avatar: https://pbs.twimg.com/profile_images/1891692507/JeanaTahnk2_crop_400x400.jpg
design:
  bg_color: "#000000"
  image: "https://cdn.auth0.com/blog/breached-passwords/main.png"
tags:
- data-breaches
- security
- identity
- auth0
related:
- 2017-05-11-data-breaches-by-the-numbers
- 2016-10-25-how-the-biggest-attack-in-internet-was-perpetrated
- 2016-09-22-yahoo-confirms-data-breach-of-half-a-billion-user-accounts
---
No business is immune to the threat of breached passwords and devastating hacks. We’ve seen it one too many times with the [largest businesses](https://auth0.com/blog/data-breaches-by-the-numbers/) in the world falling victim to database leaks — Yahoo, eBay, Target, and most recently, [Equifax](https://auth0.com/blog/equifax-data-breach/), possibly one of the largest breaches in history. Cyber criminals hacked into the Equifax database, stealing names, social security numbers, birth dates, addresses, and private information of up to **143M people**. As a result, Equifax now faces a [multibillion dollar lawsuit](https://www.bloomberg.com/news/articles/2017-09-08/equifax-sued-over-massive-hack-in-multibillion-dollar-lawsuit) for its negligence. 

There’s no denying that the impact of any database hack is crushing, both financially and for customer trust. 

![Breached Passwords Counter](https://cdn.auth0.com/blog/breached-passwords/counter.png)

Another alarming breach was recently uncovered: a new, highly sophisticated spambot called **Onliner** that has infiltrated systems worldwide, targeting a whopping **711M email addresses**. Troy Hunt, a Microsoft developer, well-known security researcher and creator of [haveibeenpwned.com](https://haveibeenpwned.com/) (HIBP), outlined the insidious nature of this spambot in a [recent blog post](https://www.troyhunt.com/inside-the-massive-711-million-record-onliner-spambot-dump/) that highlights the diversity of the data that was breached. Notable examples, like: 

* 29m rows of email address and password pairs 
* 142k email addresses, passwords, SMTP servers and ports
* Random selection of a dozen different email addresses checked against HIBP showed that *every single one of them* was in the LinkedIn data breach
* 4.2m email address and password pairs, this time with every single account having a hit on [the massive Exploit.In combo list](https://www.troyhunt.com/password-reuse-credential-stuffing-and-another-1-billion-records-in-have-i-been-pwned/)

Millions of emails and passwords are compromised every day, as clearly evident by Onliner, and yet there is a very simple solution that can avert this cyber-crisis or dramatically mitigate its disastrous effects: **[Breached Password Detection](https://auth0.com/breached-passwords).** 

![Breached Passwords Getty-Image](https://cdn.auth0.com/blog/breached-password/secondary.jpg)

##Breached Password Detection
Auth0’s Breached Password Detection just celebrated its [one-year anniversary](https://auth0.com/blog/announcing-password-breach-detection/), and in the past year alone has protected millions of passwords. Our continuously-updated database of breached credentials containing hundreds of millions of entries serves as the clearinghouse for the legitimacy of any password-based logins. Any matches are denied and blocked in real-time; and users are instantly alerted to the attempt, forcing them to change their passwords immediately. 

Breached Password Detection is a crucial feature in our identity platform that is used by our [global customers](https://auth0.com/customers) for safeguarding valuable data. Here are compelling stats: 

* Thus far in 2017, our database has identified 3,602,290 instances of detection
* And from September 2016 to now, that tally increases to 3,951,160
* Auth0’s Breached Password Detection database averages 450,286 blocked breached passwords per month and 14,885 per day 

It’s a foolproof way to ensure you’re protecting your assets, and that of your customers. 

Implementing this essential measure is seamless on our authentication platform and requires simply toggling the feature on. Simple. 

This level of protection, bolstered by additional Auth0 measures like [Single Sign On](https://auth0.com/learn/how-to-implement-single-sign-on/) and [Multifactor Authentication](https://auth0.com/multifactor-authentication), makes your [service more secure](https://auth0.com/blog/5-ways-to-make-your-app-more-secure-in-less-than-20-minutes/), but more importantly, builds customer trust that’s beyond measure. 

What are you waiting for? 

Try Auth0 for free today to learn more about how you can protect your data and customers with Breached Password Detection.

