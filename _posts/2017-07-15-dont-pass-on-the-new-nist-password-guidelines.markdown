---
layout: post
title: "Don't Pass on the New NIST Password Guidelines"
description: "NIST Digital Identity Guidelines aren't just for federal agencies. Learn how to use them to improve your security."
date: 2017-07-15 8:30
category: Growth, Industries, Retail
author:
  name: Diego Poza
  url: https://twitter.com/diegopoza
  avatar: https://avatars3.githubusercontent.com/u/604869?v=3&s=200
  mail: diego.poza@auth0.com
design:
  bg_color: "#4A4A4A"
  image: https://cdn.auth0.com/blog/blog-logo/brand-advocate.png
tags:
- retail
- security
- retail
- customer
- vision
- auth0
related:
- 2017-06-19-how-to-keep-up-with-hyperconnected-consumers
- 2016-04-18-progressive-profiling
- 2017-05-26-go-beyond-username-password-with-modern-auth
---

According to [password cracking experts](http://www.cs.umd.edu/~jkatz/security/downloads/passwords_revealed-weir.pdf), “It is unlikely any other document has been as influential [as past NIST guidelines] in shaping password creation and use policies.”

For over a year, the NIST has been drafting new rules and recommendations for protecting digital identities. This June, [the result was finally published.](https://pages.nist.gov/800-63-3/sp800-63-3.html)

Substantial changes have been introduced since the NIST's last publication in August 2013—many concerned with passwords. The NIST advises agencies to jettison outdated password complexity rules in favor of user-friendliness. It also introduces new password encryption standards and requires multi-factor authentication for any service involving sensitive information.

## Why do the NIST guidelines matter?

You can use the NIST guidelines to build your security policies from the ground up. The NIST publication offers comprehensive, actionable practices for all aspects of digital identity security including detailed threat-mitigation strategies. If you don't yet have a security policy at your company, or if you're looking to give it an update, then the NIST may have the answers you need for free.

So don't ignore the NIST guidelines just because you're a private company — **the NIST guidelines can provide you with something even more powerful than [policies—credibility](http://www.networkcomputing.com/careers/do-nist-information-security-standards-matter/2143614969).**

Even though the NIST only regulates federal agencies, [corporate security teams are taking advantage of their guidelines.](https://venturebeat.com/2017/04/18/new-password-guidelines-say-everything-we-thought-about-passwords-is-wrong/) Companies use the NIST standards as a baseline and work toward their suggestions. The NIST, in turn, recognizes the importance of private-sector security by making their guidelines widely applicable.

NIST password regulations and suggestions are well-researched and well-trusted. Even if you are confident in your security, nothing can beat following standards that have been independently and painstakingly vetted.

Your company's success depends on users trusting you to take care of their sensitive information. If you follow the NIST guidelines, they have a reason to put their trust in you.

## The new user experience

Conventional wisdom says that password complexity can only be a good thing. But in reality, complex password requirements can do more harm than good. Making users' lives easier—not harder—is the way to ensure stronger passwords.

A big problem for all users is remembering their passwords, so they try to make them simple and use them over and over again. In 2016, Experian found that millennials had on average [40 services](https://threatpost.com/proposed-nist-password-guidelines-soften-length-complexity-focus/125393/) registered to a single email account—and only five distinct passwords.

To combat this, companies have begun requiring users to include a number, or symbol, or capital letter in their passwords to make them harder to decrypt.

**But the NIST recommends removing all password complexity rules****—they just create a false sense of security.**

A [2010 study by Weir et al.](http://www.cs.umd.edu/~jkatz/security/downloads/passwords_revealed-weir.pdf) found that users will simply capitalize the first letter of their password and add a “1” or “!” to the end, making the password no harder to crack. Any password cracker worth their salt knows about these patterns and has adjusted their tools accordingly.

When required to use numbers in their passwords, a full 70% of users on [rockyou.com](http://rockyou.com/) (which contained user info for several social networking sites) just added numbers before or after their password.

![]()

Clearly, your users aren't going to take the extra step to protect their digital identities if it makes remembering passwords harder. Stop wasting your time trying to make them do it.

Length matters a lot more—which is why the new guidelines call for a strict 8-character minimum and even suggested moving character maximums to at least 64.

Besides length minimums, what you can actually do to improve password security is to make it easier for users to have *better* passwords. Let's look at what the NIST recommends.


## NO PREIODIC PASSWORD RESETS

Making users reset their passwords every few months is a classic security measure. The thinking is, any unauthorized person who obtained a user's password will soon be locked out.

But this doesn't actually work. [Users change their passwords in predictable patterns](https://www.ftc.gov/news-events/blogs/techftc/2016/03/time-rethink-mandatory-password-changes), such as adding a single character to the end of their last password or replacing a letter with a symbol that looks like it (such as $ instead of S). So, if a hacker already knows a user's previous password, it won't be difficult for them to crack the new one.

Frequent mandatory password resets can even make security *worse*. It's hard enough to remember one good password a year. When users have to create new passwords regularly, they tend to make them [weaker from the start](https://www.ftc.gov/news-events/blogs/techftc/2016/03/time-rethink-mandatory-password-changes).

## ENABLE "SHOW PASSWORD WHILE TYPING"

Typos are common when entering passwords, and when characters turn into dots as soon as they're typed, it's difficult to tell where you went wrong. This motivates users to pick shorter passwords that they're less likely to mess up, especially on sites which only allow a low number of login attempts.

If a user can choose, when alone, to have the password displayed during typing, they have a much better shot at putting lengthy passwords in correctly on the first try.

## ALLOW PASTE IN PASSWORD FIELDS

“Paste” functionality is now advantageous due to the widespread use of password managers. Password managers generate and store long, complex passwords that a user can access through a single master password. If these lengthy, machine-generated passwords can be copied and pasted into a password field, they're not a problem for the user. However, a user faced with the prospect of memorizing and manually typing in such passwords may well decide to stick with short passwords.

## THE BOTTOM LINE

The new NIST guidelines reveal an important moral: easier, more convenient security will make more people take proper precautions. Your extraneous password rules are just making things worse.

## The new security focus

Most developers need to up their identity security; a fact made clear by the [Yahoo breach](https://threatpost.com/fsb-officers-criminal-hackers-indicted-in-yahoo-breach/124340/) revealed last year, in which information from half a billion accounts was stolen. The NIST guidelines provide new suggestions for handling password security holes by introducing password limitations, improving password storage, and not relying on passwords alone for authentication.

## PASSWORD LIMITATIONS

While the NIST guidelines recommend getting rid of ineffective password requirements, they don't want you to forget about restricting passwords entirely. Rather, they suggest shifting your strategy to three password limitations that are actually worthwhile.

### 1. Forbid commonly used passwords

### 2. Don't use password hints or knowledge-based authentication

### 3. Limit the number of password attempts


## PASSWORD STORAGE

Many security attacks have nothing to do with weak passwords and everything to do with the authenticator's storage of passwords.

Let's face it—password database breaches are going to happen. But you can still protect your users. Consider [Patreon](https://www.wired.com/2016/06/hacker-lexicon-password-hashing/), whose strong hashing scheme kept all passwords safely encrypted during a breach in 2015.

The NIST guidelines require that passwords be salted with at least 32 bits of data and hashed with a one-way key derivation function such as Password-Based Key Derivation Function 2 (PBKDF2) or Balloon.

The function should be iterated as much as possible (at least 10,000 times) without harming server performance. In addition, they recommend an additional hash with a salt stored separately from the hashed password. That way, even if the hashed passwords are stolen, brute-force attacks would prove impractical.

## MULTI-FACTOR AUTHENTICATION

Passwords are not enough. To make sure your users are properly protected, multi-factor authentication is the way to go.

The NIST requires multi-factor authentication, commonly referred to as 2FA (2-Factor Authentication), for any personal information available online. A verification that requires users to demonstrate at least two of “something you know” (like a password), “something you have” (like a phone), and “something you are” (like a fingerprint) drastically decreases the probability of a successful attack.

However, don't get complacent just because you're already using 2FA.

In the new guidelines, email joins voice-over-IP on the NIST's list of channels that cannot be considered out-of-band (OOB) authenticators as they do not necessarily prove possession of a specific device (“something you have”).

## The SMS Controversy

A prior draft of the NIST publication stated that OOB authentication using SMS was deprecated and could be disallowed in the future.

This led to a deluge of articles released by the security world declaring the death of SMS-based 2FA.

![]()

Yet, the final version of the NIST guidelines contained no mention of SMS deprecation.

After lobbying from the CTIA (https://blogs.sap.com/2017/07/06/rollback-the-united-states-nist-no-longer-recommends-deprecating-sms-for-2fa/), the NIST backtracked on its concerns, explicitly including SMS as a valid channel for OOB authentication.

Nevertheless, some concerns about SMS authentication remain valid. SMS channels can be attacked (https://auth0.com/blog/what-the-new-nist-guidelines-mean-for-authentication/) by smartphone malware and SS7 hacks. In addition, message forwarding and number changes mean that access to messages does not always prove possession of a device.

The NIST has not ignored this uncertainty.  The new guidelines do insist that authenticators make sure the user's telephone number is associated with a specific physical device when SMS (or voice) 2FA is used. They further recommend that authenticators watch out for behavior such as device swapping, SIM changes, and number porting, which could indicate a compromised channel.

However, the removal of recommendations against SMS indicates that this widely used 2FA channel is far from dead (https://blogs.sap.com/2017/07/06/rollback-the-united-states-nist-no-longer-recommends-deprecating-sms-for-2fa/). It remains much more secure than email, and an effective way to reduce your reliance on passwords.

## Your new guide

Don't ignore the NIST, use it to your advantage.

Recent studies have shown that the conventional wisdom on passwords is wrong, so you need to rethink your password strategies. Stop wasting your time on password complexity and focus your security on effective preventative measures like extra salting and 2FA.

The new NIST guidelines tell you what your next steps should be, so consider this publication an opportunity to make your service safe, trustworthy, and user-friendly.

NIST updates are highly influential in the private sector—their suggestions will form the next set of user expectations for your company. If you don't pay attention to the NIST now, you'll soon end up far behind on security.








