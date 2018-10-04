---
layout: post
title: "Data Breaches by the Numbers"
description: "By failing to plan for data breaches, you leave yourself vulnerable to inevitable attacks"
date: 2017-05-11 14:47
category: Growth, Security, Breaches
author:
  name: Diego Poza
  url: https://twitter.com/diegopoza
  avatar: https://avatars3.githubusercontent.com/u/604869?v=3&s=200
  mail: diego.poza@auth0.com
design:
  bg_color: "#8B572A"
  image: https://cdn.auth0.com/blog/data-breaches/logo.png
tags:
- data
- security
- breaches
- hashing
- salt
related:
- 2016-08-24-announcing-password-breach-detection
- 2016-06-21-avoiding-password-reuse-attacks
- 2016-09-22-yahoo-confirms-data-breach-of-half-a-billion-user-accounts
---

While a total of 974 publicly disclosed data breaches may make 2016 sound like a hallmark year for data breaches, it gets worse when you realize how many organizations may not even know they were hacked.

Reporting is in some ways a lagging indicator. For example, it took Yahoo!, until December 2016 to report that 1.5 billion user accounts had been hacked—and that breach occurred all the way back in back in 2013.

The biggest mistake most companies make? Storing passwords without hashing and salting them. By not taking care of this very simple security precaution, companies leave themselves, and their users, vulnerable to attack.

1. Yahoo!: 1.5 billion accounts (2013 & 2014)
2. Friend Finder Network: 412 million accounts (2016)
3. MySpace: 360 million accounts (2016)
4. LinkedIn: 165 million accounts (2012)
5. Heartland Payment Systems: 130 million accounts (2008)
6. Target: 110  million accounts (2013)
7. Sony Online Entertainment: 102 million accounts  (2011)
8. Rambler: 98 million accounts (2014)
9. Dropbox: 68 million accounts (2012)

What's most concerning is that the trend does not appear to be abating or slowing over time. On the contrary, it appears that breaches are growing worse over time as user data is consolidated in increasingly large web repositories,  attackers become more sophisticated, and as large corporations remain slow to implement better security.

## How Breaches Happen

Storing passwords in a form other than plain-text adds an extra level of security to user data. Hashing is necessary, but for lost data to be rendered useless, passwords also need to be salted.

![Password salting and hashing](https://cdn.auth0.com/blog/data-breaches/password-salting.png)

Adding a salt string to passwords ensures a unique hash is stored. This added security is incredibly straightforward to implement, but it's alarming to think that more companies aren't using it.

For Rambler, the so-called Yahoo! of Russia, user passwords weren't even hashed—they were stored in plain-text. This major cyber security faux pas left them susceptible to attacks. The fallout was even bigger than originally thought, because millions of users used the same password on multiple sites, making it easy for hackers to breach those as well.

To its credit, the Friend Finder network employed the use of SHA1 hashing to protect user passwords. But it fell short of adequate protection by failing to salt the passwords. This oversight made it ridiculously easy for hackers to reverse engineer passwords to gain access.

Just how prevalent is this kind of mishandling of user data?

Of the 165 million passwords stolen from LinkedIn in 2012, **71%** of them were hashed but not salted. Any motivated hacker looking to turn a quick profit simply had to load the hashed passwords into an app to reverse them and sell them.

![SHA-1 conversion and lookup](https://cdn.auth0.com/blog/data-breaches/sha-1-reverse-lookup.png)

In the case of Yahoo!, after their first hack in 2013, they began hashing and salting their passwords using the Bcrypt method. However, not all stolen passwords were protected in the 2014 hack. It is possible that their failure to disclose the first hack meant users didn't change their passwords to take advantage of the additional security measures. Therefore, they weren't covered by the new encryption.

### Breach Stats

Since 2013, over [5 trillion user records have been stolen](http://breachlevelindex.com/). With the number of breaches growing, the reality is that they are inevitable. Until all companies take precautions to shore up their vulnerabilities, breaches will continue to haunt them and their users.

![Data breaches statistics](https://cdn.auth0.com/blog/data-breaches/data-breach-statistics.png)

Of these breaches, only **4%** of stolen information was secured by strong encryption, making them useless to hackers. Companies that take the added step of salting their passwords make them much harder to crack. Every password has a unique string added to it making password dictionaries like lookup and rainbow tables useless. Passwords and their corresponding known hashing no longer apply.

For the remaining **96%** of data, once stolen, hackers do not need an inordinate amount of time to unencrypt the passwords. For sites like LinkedIn that hashed user passwords but failed to salt them, each password can be exposed in a matter of seconds.

Companies have a huge responsibility to protect the sensitive data their users entrust them with, but users also play a role in re-enforcing cyber security.

As we've seen from combing through the anonymized data released from these leaks, it is clear users need to prioritize the use of stronger passwords.

## The Top 10 Most Commonly Used Passwords of 2016

Strong passwords, in combination with strong encryption, would make it extremely difficult for breaches to have the same negative impact they currently do.

Let's take a look at the [10 most common passwords](http://www.makeuseof.com/tag/keeper-worst-passwords-2016/) users tend to default to, as compiled by the makers of [Keeper Security](https://keepersecurity.com/), and how quickly each one of them could be brute-forced by an attacker, as determined by [How Secure Is My Password?](https://howsecureismypassword.net/):

1. 123456: Instantly
2. 123456789: Instantly
3. Qwerty: Instantly
4. 12345678: Instantly
5. 111111: Instantly
6. 1234567890: Instantly
7. 1234567: Instantly
8. password: Instantly
9. 123123: Instantly
10. 987654321: Instantly

As you can see, the top 10 most common passwords that people tend to use are pretty much the worst.

However, combinations of numbers and the word “password” aren't the only lousy passwords out there. You might think you're safe with your [FIRST_NAME][BIRTH_YEAR][SPECIAL_CHARACTER] password, such as:

* Johnson78!
* Alfred50%

and so on—but you're not. Yes, that was the easiest thing to type in when you were prompted for a better password, and officially it would take a computer about [six years](https://howsecureismypassword.net/) to crack this kind of password. But brute-forcing isn't the only method attackers have up their sleeves. If a hacker can infer it about you, or research you on social media to figure it out, don't put it in your password (no names or birth years!)

In the end, it's best in the long-term to avoid coming up with new passwords [at all](https://diogomonica.com/2014/10/11/password-security-why-the-horse-battery-staple-is-not-correct/).

## Total Impact of Breaches

More than anything, breaches cause short-term damage to company reputations. In the case of Dropbox, Yahoo! and LinkedIn, their brands were further damaged when they failed to immediately notify users of breaches. This lack of simple courtesy resulted in a dip in public perceptions of them.

![Dropbox data breach](https://cdn.auth0.com/blog/data-breaches/dropbox-data-breach.png)

For affected companies, the time and money lost trying to understand and fix breaches are astronomical. Sony estimated their cost to rectify the situation at **$171 million**. They also had to deal with **65** class-action lawsuits.

As for users affected by retail breaches such as Target's, an estimated [**$15 billion was stolen**](http://www.iii.org/fact-statistic/identity-theft-and-cybercrime) in 2015 alone. Users also have to spend time reclaiming their account after its been hacked. This can include updating their email settings, checking their devices for malware and checking if other accounts have been jeopardized. All of this takes time and energy and affects how they perceive the breached company.

## How to Protect Yourself

How do you protect against a breach?

First off, forget about teaching your users to create better passwords. People know what strong passwords look like in theory, but they do not care to remember a bunch of unique ones across different websites.

The most effective way to protect against breaches is to mandate the use of multi-factor authentication, at the very least when you have users logging in from unfamiliar IP addresses or other unusual circumstances.

At Auth0, we log approximately 16,000 login attempts using compromised passwords each month. These attacks target users not using [modern authentication](https://auth0.com/user-management) options like social connections or [passwordless authentication](https://auth0.com/passwordless). By putting the needs of our users first, we can use tools like our [Breached Password Detection](https://auth0.com/breached-passwords) feature to detect that users are typically exposed to six fraudulent login attempts each month.

For the safety of your users, use this approach and enable [password breach detection](https://auth0.com/breached-passwords). Make sure you have a [data breach response plan](https://auth0.com/blog/data-breach-response-planning-for-startups/)—it could be the difference between a cataclysmic breach and a disaster averted.

> [Auth0 offers a generous **free tier**](https://auth0.com/pricing) to get started with modern authentication.
