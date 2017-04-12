---
layout: post
title: "Is Multifactor Authentication The Best Way To Secure Your Accounts? Myths And Reality"
description: "Multifactor authentication is important, but the question of implementation is more complex than it seems."
date: 2017-02-08 12:31
category: Growth, Identity, Multifactor
is_non-tech: true
author:
  name: Diego Poza
  url: https://twitter.com/diegopoza
  avatar: https://avatars3.githubusercontent.com/u/604869?v=3&s=200
  mail: diego.poza@auth0.com
design:
  bg_color: #000000
  image: https://cdn.auth0.com/blog/mfa-myths/logo.png
related:
  - 2016-11-30-different-ways-to-implement-multifactor
  - 2015-12-17-json-web-token-signing-algorithms-overview
tags:
  - mfa
  - authentication
  - security
  - rsa
  - totp
---

## Intro

In recent years, multifactor authentication has become quite the buzzword in information security. Products from Twitter to Instagram have implemented their own two-step login processes, responding to widespread user demand for better security and the ever-present reality of hackers cracking accounts and selling them across the internet.

All this popularity has also led to the creation and perpetuation of various myths about multifactor authentication — what it is, what it's for — that can mislead developers and users alike.  

Going with multifactor authentication is almost always going to be an improvement over not. But it's table stakes now. Sophisticated attackers aren't deterred by poorly configured multifactor authentication systems. To keep internal and user information secure, you need to know what you're doing.

## Myth #1: There are only a few different forms of MFA

An authentication [factor](https://auth0.com/identity-glossary) is a vector through which identity can be confirmed or denied, from fingerprint scanners to passwords, from USB sticks to PIN codes. The commonly used term “multifactor authentication” simply refers to an authentication scheme that uses **more than one** of these methods.

It was once true that most MFA systems operated basically the same way. Today, however, there's a great variety of factors you can request from your users, from push notification receipt to SMS to email to fingerprint.

### Reality: MFA is extremely customizable

![MFA alternatives](https://cdn.auth0.com/blog/mfa-myths/mfa-alternatives.png)

There are three entire genres of factor—knowledge, possession, and inherence:

* **Knowledge:** Something only a particular user knows, such as a password or the answer to a secret question.
* **Possession:** Something only a particular user has, such as a USB stick or identifying badge.
* **Inherence:** Someone only a particular user is, such as determined through a fingerprint scanner or GPS recognition system.

Every multifactor authentication system out there is built upon some combination of these three basic factors. A simple password/secret question system would be made up of two separate knowledge factors, while one that asked you for an [RSA hardware token](https://www.rsa.com/en-us/products-services/identity-access-management/securid/hardware-tokens) in addition to your password would be made up of both knowledge and possession factors.

A passwordless login system relies upon you being in possession of, and able to access, your email inbox. And so on. There are so many different forms of authentication out there now that you can freely choose whether you want something that maximizes ease of use, something that maximizes security through obscurity, or something in between.

## Myth #2: Your use case for MFA doesn't matter

[RSA](https://en.wikipedia.org/wiki/RSA_Security) and [TOTP](https://en.wikipedia.org/wiki/Time-based_One-time_Password_Algorithm) are two of the most popular methods for generating secure codes that we have today, but they are not interchangeable — both have their pros and cons.

The main technical difference between them is that RSA operates asymmetrically, with a public and a private key, and TOTP operates symmetrically, with a single private key shared between both parties. But this isn't just a minor detail about how the two systems work. This single difference affects the appropriate context for each one and the trade-offs you will be making.

### Reality: You have to choose your method based on your needs

The security of the public/private key pair of RSA “relies on the computational difficulty of factoring large integers”:

1. Two extremely large prime numbers are generated using the [Rabin-Miller primality test algorithm](http://searchsecurity.techtarget.com/definition/RSA).
2. The public key is generated from the modulus of those two prime numbers and a public exponent.
3. The private key is generated from the modulus of those two prime numbers and an exponent calculated with the Extended Euclidean algorithm.

This also means that computational power is required to encrypt and decrypt RSA when it's used properly. That makes RSA slower, but the benefit is that only one side of the transaction needs to actually [possess the private key](http://crypto.stackexchange.com/questions/11293/hmac-sha256-vs-rsa-sha256-which-one-to-use).

TOTP, on the other hand, operates symmetrically. A secret key is known to both the signer and the signee at the same time. A hash function is used to blend the secret key with the time at the moment of authentication (requiring fairly precise clock synchronization) and a one-time password is generated that is valid only for a short amount of time.

![TOTP screenshots](https://cdn.auth0.com/blog/mfa-myths/totp-screenshot.png)

This takes significantly less time and processing power than RSA, but it does mean certain vulnerabilities become hypothetically possible. If a key was somehow compromised on the server-side, for instance, an employee of an organization could potentially impersonate a user to malicious ends. With RSA, the same employee would have to [change the codebase](http://crypto.stackexchange.com/questions/11293/hmac-sha256-vs-rsa-sha256-which-one-to-use) to do such a thing—likely leaving a paper trail.  

If you absolutely need your users to be able to download and store their private keys on their own systems—maybe you're working with [financial data](http://resources.docs.salesforce.com/204/14/en-us/sfdc/pdf/salesforce_security_impl_guide.pdf) like credit cards, health records, or other forms of sensitive information—you may want to go with an asymmetric method like RSA.

## Myth #3: All MFA solutions work basically the same way

Mass adoption of multifactor authentication is still a significant work in progress, and it's fair to say that most sites should simply focus on implementing it in some form or another—not which method is the absolute perfect one.

That does not, however, mean that every single form of multifactor authentication is equally secure. Each occupies a different position on the axes of security and ease of use, which means that each one will be optimal under a different set of circumstances.

### Reality:  you have to choose what you value most

SMS is one of the older and more common forms of multifactor authentication that you see out there. You log in to a website, and then to double-check your identity, a code is sent to a phone number that you have on file. You receive a text on your mobile phone that contains a code, and then you enter that code into the website to verify yourself. Simple.

But the U.S National Institute of Standards and Technology has recently come out with a report saying they believe that SMS multifactor is vulnerable to hijacking, [particularly when used](http://thehackernews.com/2016/07/two-factor-authentication.html) by subscribers to a VoIP phone service like Google Voice. SMS is also vulnerable to social engineering—in some instances, attackers have been able to simply call up a victim's phone company and, impersonating their target, ask that all text messages to that account be forwarded to a different one.  

These vulnerabilities, plus the fact that other forms of authentication have become more user-friendly, mean that many sites and apps enabled with multifactor authentication are moving on to different methods.

![Different multifactor alternatives](https://cdn.auth0.com/blog/mfa-myths/apps-of-mfa.png)

There's the time-based one-time password algorithm, or TOTP, which is most notable used by apps like Google Authenticator. A single-use password is generated from the combination of a secret key and the current time, and you enter that into the app asking for authentication rather than a code that could have been intercepted in transmission.  

TOTP, because it often involves users manually copying a six-digit code from their phone to their computer, is often considered to be a burden on users. With [Auth0 Rules](https://auth0.com/docs/rules), though, you can get the benefit of MFA without that annoyance by setting up special conditions under which authentication will be requested.

Say someone tries to call your bank's customer support to reset your password — as they did to [Brian Krebs](https://auth0.com/blog/how-paypal-could-have-avoided-account-hack/) — that event could be flagged as requiring a temporary extra authentication. You could trigger the same kind of request in the event of a new email account being added, an address being changed, and the like. This will keep your users' personal information and account more secure without disrupting their usage of your product, as they likely won't be performing these kinds of actions very often.

## Myth #4: MFA is always annoying for users

At many companies where multifactor authentication is tried but fails, one of the most common complaints is that it makes logging in too much of a hassle for users.

They have to first enter in their username and password, and *then* open up their email client or take out their phone, and *then* manually copy a code. Or they lose the hardware key that they were given during onboarding, or they misplace their mobile device and are no longer able to login to anything.

 These companies get so many annoyed emails from their employees, or start noticing users forgetting their passwords and consequently churning, that they finally turn MFA off.

### Reality: MFA can be as easy as tapping a push notification

MFA does not have to be troublesome for users. It doesn't have to require keeping track of a token, manually writing a code, or copying and pasting a code from a mobile device to your computer.

With [Auth0 Guardian](https://auth0.com/guardian/), you can make logging in through multifactor authentication a simple matter of swiping and tapping a push notification from your [phone's lock screen](https://auth0.com/blog/announcing-Auth0-Guardian-a-new-way-to-login/).

![Auth0's Guardian App](https://cdn.auth0.com/blog/mfa-myths/auth0-guardian-mfa.png)

It's available for both iOS and Android, and can be enabled with a [simple toggle](https://auth0.com/guardian). Check out the full docs [here](https://auth0.com/docs/multifactor-authentication/guardian).

## Myths Busted

There's no doubt that implementing multifactor authentication is one of the best ways to improve the security of a website or an app that doesn't have it. But as with any decision regarding the privacy and security of your users and their information, nothing is as simple as it appears at first glance.

At [Auth0](https://auth0.com/), we want to make sure that MFA is something you can implement knowing that it will protect your accounts without harming the user experience. With [Guardian](https://auth0.com/guardian/), we're pushing that project forward, and we're really excited to have you try it out. Check it out!
