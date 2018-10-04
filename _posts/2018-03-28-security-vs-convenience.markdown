---
layout: post
title: "Security vs. Convenience"
description: "Auth0 CISO Joan Pepin explains how making security easier makes things safer for users, but requires more planning from engineers to render security seamless."
longdescription: "Everybody used to believe that to be secure, something couldn’t be convenient. Making access hard kept info safe. Auth0 Ciso Joan Pepin explains how security experts have failed users by making passwords too complex. Turns out convenience can make things much safer, but it requires more planning from engineers."
date: 2018-03-28 8:30
category: Growth, Security
is_non-tech: true
banner:
  text: "Auth0 makes it easy to add authentication to your application."
author:
  name: "Joan Pepin"
  url: "https://twitter.com/cloudciso_joan"
  mail: "joan.pepin@auth0.com"
  avatar: "https://cdn.auth0.com/blog/meltdown-spectre/joanpepin.jpg"
design:
  image: https://cdn.auth0.com/blog/security-vs-convenience/logo.png
  bg_color: "#7B6C23"
tags:
- password
- security
- cybersecurity
- multifactor-authentication
- nist
related:
- 2018-02-14-what-is-data-security
- 2018-03-16-identity-as-a-service-in-2018
- 2018-01-26-security-predictions-for-2018-that-go-beyond-gdpr-compliance
---

**TL;DR:** Security vs. Convenience: To truly keep info safe you need to pull off both — here’s the why and the how.

---

In the security industry, everybody used to believe that to be secure, something couldn’t be convenient. Security and convenience functioned only in opposition. Making access hard was the best way to keep info safe.

But then we ran up against the human factor.

Since the first password breach — only a year after passwords were invented — we’ve been looking for ways to make passwords safer. First, we made them harder. Which means we added increasing levels of complexity to the the string of characters that served as an access key and made things even worse by demanding that passwords be changed at regular intervals. 
This gave birth to the password on a Post-It Note that gets put up right beside the monitor. 

For people who don’t want Post-Its everywhere, Amazon now sells a password diary. My review, which pointed out the security risks of this product, was voted “unhelpful” by 300 people. Apparently, many silent others disagreed with me. Amazon now carries multiple versions of the password diary, each of them with positive reviews in the hundreds.

{% include tweet_quote.html quote_text="@Auth0 Ciso Joan Pepin explains how making security easier makes it safer. @CloudCISO_Joan" %}

## The Argument for Easy

The proliferation of password diaries on Amazon is an understandable (if unwise) response to a technology landscape that is getting more diverse and more complicated daily. Consumers are demanding more customization and employees want the same kind of experience that they have on their consumer devices. We now have non-technical people accustomed to accessing very technical services throughout the course of their day — and they don’t want to remember five or more different passwords to get everything done.

Security teams can create systems and protocols — that’s a large part of what I do as Auth0’s CISO — but none of this keeps anything safe if people won’t use the systems as intended. So, if we know they are going to go around the procedures and protocols, why not make it easier for them to comply?

## NIST Simplifies Password Guidelines

After watching people try to respond to tortuously complex password requirements, NIST (the National Institute of Standards and Technology) revised [guidelines](https://auth0.com/blog/dont-pass-on-the-new-nist-password-guidelines/) last summer. As a non-regulatory division of the U.S. Dept. of Commerce, NIST only has power over standards for federal sites in the United States, but it exerts deep influence on corporate standards everywhere. Companies often use NIST as a basis for their own policies.

So NIST’s new take to digital identity offered a host of guidelines, including the recommendation to only change your password if you believe you’ve been compromised.

Ironically, asking people to create longer passwords that might be easier to remember and changing them infrequently increases security. 

Making it easier, makes it safer.

Except that NIST also recommends multifactor authentication, which can appear inconvenient, if not hard.

## Multifactor’s Already Convenient (Really)

You need a strong gate between the rest of the world and your set of authenticated users. As I mentioned earlier, you need that gate to be convenient or your users will figure out a way around your protection.

On the outside, NIST’s recommendations for multifactor authentication looks like they’re reverting to the need for security to offer a challenge, but really, what is multifactor authentication? 

Multifactor verification just requires that users demonstrate at least two of the “something you know” (like a password), “something you have” (like a phone), and “something you are” (like a fingerprint) drastically decreases the probability of a successful attack.

![If you’ve ever used an ATM, you’ve used multifactor authentication.](https://cdn.auth0.com/blog/security-vs-convenience/atm.jpg)
<p>_If you’ve ever used an ATM, you’ve used multifactor authentication._</p>

Multifactor authentication has been around since the 1980s, when ATMs came into use. “Something you know” is your PIN number and the “something you have” is your ATM or debit card. That stereotypical grandmother that people like to mention in their examples has been using multifactor authentication since before some of us were born.

## Easier Requires More Engineering Effort

Security industry experts weren’t entirely wrong when we first worried about the danger of ease. Easy can be risky if enough thought hasn’t gone into the user experience. 

An engineer has to do a lot of thinking to make things easy. Possible use cases, potential tech, interactions, and threat vectors like hacking, accidental use, and misconfiguration all require thorough consideration and planning.

Baby and pet cams are a prime example. 

After setting one up over your WiFi your customers check in on their kid (or dog) from work through their laptop or phone.

Seems like a great feature, right? 

Except now you’ve given end user the ability to access a live feed of a child over the internet. You need to think about how you’re going to secure that feature because if you just put a web server on the camera, Google will index it because Google indexes web servers. If someone knows how to do the search string, they can get all the babies in a single search.
Making this safe requires deliberate thought from an engineer.

Consumers and employees are starting to expect a seamless user experience tailored to their personal preferences, geographic location, and devices — all of which adds complexity engineering a flexible solution.

### Ease Satisfies End Users Need for a Positive Experience — and Security

As I mentioned during the Auth0 Security Meetup, I’m seeing a trend towards accountability from organizations and governments, but the driver of all that accountability is actually the end user.

Regulations like [GDPR](https://auth0.com/gdpr) give individuals the power to protect their personal data, while building in the expectation of swift breach notification.

Personal data protections are also under consideration in other countries. 

While lawmakers may not always understand cybersecurity best practices, they do understand constituent expectations. A huge portion of a constituent’s life happens online — and they expect to be safe.

In situations where they aren’t protected, I expect consumers will start holding companies accountable. If governments fail to protect them, they will vote with their wallets.

{% include tweet_quote.html quote_text="Security industry experts weren’t entirely wrong when we first worried about the danger of ease. Easy can be risky if enough thought hasn’t gone into the user experience. @CloudCISO_Joan" %}

## Getting Expert Help with How

When you’re creating a new app, your main focus is largely on what your customers are going to do with it. How they get access can be an afterthought or something that can be viewed as easy, because setting up a database and making it talk to a login box can be done quickly.

It’s much harder to keep all that data safe.

One of the smartest things an engineer can do is to turn to someone who fends off hacks on a daily basis. Not a cryptography expert? Great. You’ve realized you shouldn’t waste your time on encryption.

Companies like GM have leveraged the skills of experts in transmission and tires and other products to create their now profitable cars. That same strategy can be effective in a digital situation. Apply your considerable skills to your product’s core and let expert third-parties (like Auth0) handle the authentication and authorization to help you create a safe and seamless end user experience.

{% include asides/about-auth0.markdown %}
