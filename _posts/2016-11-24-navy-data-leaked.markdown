---
layout: post
title: "US Navy Data Leaked: 10 Tips to Protect Sensitive Data from Theft"
description: "The recent leak of US Navy's personal sailor information puts in the spotlight the difficulties of keeping sensitive data secure, here's what you can do about it"
date: 2016-11-24 13:00
category: Security
author:
  name: Sebastián Peyrott
  url: https://twitter.com/speyrott?lang=en
  mail: speyrott@auth0.com
  avatar: https://en.gravatar.com/userimage/92476393/001c9ddc5ceb9829b6aaf24f5d28502a.png?size=200
design:
  bg_color: "#004071"
  image: https://cdn.auth0.com/blog/es6rundown/logo.png
  image_size: "100%"
  image_bg_color: "#222228"
  blog_series: false
tags:
- security
- navy leak
- navy
- us navy leak
- sailor information leak
- sailor personal information leak
- navy personal information leak
- personal information
- device theft
- data theft
- security policies
- policy
- policies
- security policy
- secure data
- securing data
related:
- 2016-01-26-four-types-of-leaks-in-your-javascript-code-and-how-to-get-rid-of-them
- 2016-03-15-javascript-module-systems-showdown
- 2015-10-14-7-things-you-should-know-about-web-assembly
---

The US Navy was [recently notified](http://www.navy.mil/submit/display.asp?story_id=97820) by a contractor of a major leak of sailor's personal information. Although the leak is currently under investigation, the perpetrators purpotedly used a stolen laptop with either compromised credentials or downloaded data. In this post we will study the different ways in which sensitive data can be protected in case of device theft. Read on!

{% include tweet_quote.html quote_text="Property theft MUST be accounted for when sensitive data is at stake" %}

-----

## Introduction
In this post we will go over a very common scenario: theft of portable devices carrying sensitive information. When this happens, proper policies can make all the difference between minor and major losses. In this case, it was the personal information of more than 130,000 sailors, including their social security numbers. The immediate impact of the leak may not be major, but the long term ramifications are hard to guess at this point. But what if corporate banking account credentials were leaked? Or insider information that could crash stock prices? Sometimes it is something as little as a laptop or smartphone that can change the course of a major company or a person's life. So what can be done about it?

## The usual scenarios
At this point, we know next to nothing about what the perpetrators did to access the sailor's information. So let's consider three different hypothetical scenarios. All of them are based on the premise of a stolen device with sensitive information stored in it.

### Scenario 1: cached credentials
Cached credentials are probably one of the most common cases. Most users rely on password managers or active sessions to access most of their services. Think of your email: once you have logged in, it rarely asks again for a password. Certain providers, such as Google, make sure to reauthenticate after a certain number of days. This is a good policy. However, it is not enough. Once you have accessed a compromised email account, it is very easy to access other accounts through password recovery mechanisms. This is a case where two factor authentication makes a big difference: even if a malicious user can reset your password, he or she cannot access an account protected with two factor authentication without controlling the second factor. However, most services do not reauthenticate.

In the case of email, things can even be worse! E-mail not only is the gateway to password recovery mechanisms, but to impersonation and social engineering, which we will discuss below.

![Cached Credentials]()

### Scenario 2: cached data
Another possible scenario deals with actual cached data on the stolen device. Although unlikely for big amounts of data, storage is cheap. It is not preposterous to think a developer working on a critical piece of infrastructure would keep some data local to speed up development. This is a case were encryption and policies for sensitive data storage help tremendously. But even then, encryption is only as strong as its authentication mechanism: a weak password defeats any encryption. 

![Cached Data]()

### Scenario 3: social engineering
This scenario is often overlooked. Once you have enough tools to impersonate a user, you can start to pull strings until you get the level of access required for your malicious purposes. The owner of the laptop may not have had access to the sailor's data, but what if he had an active email session in his computer. The malicious user could have used his or her email account to request temporary access to the protected resource (to run tests for instance). This is another scenario were proper policies and development practices can make or break your chain of security.

![Social Engineering]()

## Policies to Protect Your Data
So what do all of these scenarios have in common? That there are proper policies that can be used to mitigate the effects of device theft. Some of these policies are easy to enforce, while others require strict adherence from users. This is a key factor in security that is often overlooked: the weakest links in the chain are usually people. So the more you can automatically enforce, the better. Unfortunately, people do not like to feel constrained, so balance must be sought. What policies could we use to prevent theft of information in the above scenarios? Let's find out.

### 1. Enforce device encryption and strong passwords
Device encryption is cheap nowadays. Corporate laptops and all modern smartphones support encryption out of the box. The level of encryption should be such that no access to a user's profile or account is possible without authentication. In other words, partial encryption is not enough. Encrypting the `Documents` directory is good, but it is much better to encrypt the whole user account. Consider what would happen if you sent a key document through email and your local account password was reset. An active email session could be used to download the encrypted file you forgot to delete from your email.

macOS provides **FileVault**, Windows provides **BitLocker**, iOS provides encryption by default when an unlock code is set, and Android has the option as well. There is just no excuse to leave any of these options off.

Even better, do encrypt your `Documents` folder using any tried-and-true encryption tool, even after setting up **FileVault** or **BitLocker**. Do not reuse credentials. Sensitive information can never be too safe.

For our laptop theft scenario, encryption may have been disabled or enabled only for certain folders. If such is the case, it is simple to reset a user's account password with physical access to a system. And if the password is reset and no encryption is in place, any local data is readable.

### 2. Set authentication timeouts and triggers
Encryption may as well be disabled if reauthentication is not performed regularly. Think of it: you are at a coffee shop logged-in. You have encryption on and all is safe. You feel the urge to go to the bathroom, you close the laptop and you put it in your backpack. You ask your friend to look after your backpack while you are away. You come back only to realize your friend got distracted for a second and your backpack is missing. What if your account does not require reauthentication after closing the lid? You are now compromised. Proper triggers for this are:

- Short timeouts. Ten minutes is an eternity for sensitive data, consider a timeout as short as possible. Consider enforcing a personal policy of closing or locking the laptop whenever you are away.

- Require reauthenticating after the lid is closed or the browser is closed. The incognito or private browsing modes of all browsers enforce this: any session opened will be closed after closing the tab containing it. Do not use the "lock after X minutes when the lid is closed" option, this leaves a short windows of opportunity for an attacker.

- Require reauthentication after any screen off timeout. This applies to both laptops and phones. Do not use the "lock after X minutes when the screen is off" option, make it lock itself whenever the screen goes blank.

### 3. Require the use of two factor authentication
Two factor authentication makes single-device theft much less of a threat. Even if the malicious user were to gain access past the screen lock, access to a protected resource would require another device to authenticate the user. Two factor authentication can be defeated if it is not required for frequent access. Sensitive information should always require authentication, including two factor authentication.

In our laptop scenario, if two factor authentication were not enabled and access to an opened browser were available, password autocompletion could be used to access a protected resource. Two factor authentication would require access to a device that was not stolen.

### 4. Require authentication for every stored password entry procedure
Password managers are quite common today. The combination of strong password requirements plus a plethora of services makes remembering passwords quite a feat. Password managers attempt to help in this matter by providing secure and convenient storage for passwords. The downside of having a central place for passwords is that if the master password gets out, access to many different services is possible. Therefore, master passwords must be strong and never reused. Furthermore, access to the password database must only be performed after immediate authentication. Cached access to it can leave a short window of access for potential malicious users (even a full password database dump!).

In our laptop scenario, a password manager could have been available in the stolen computer. If the malicious user gained access to an unencrypted user session, using the password manager without authentication might have been possible.

### 5. Require authentication every time access to a sensitive resource is requested
Some resources are more sensitive than others. Although quick access whenever you want to send an email is convenient, keeping full access to a database of 130,000 users enabled is not. Establish access policies for each resource according to its sensitivity. In our laptop scenerio, access to the user database should have been only possible after authentication and only for short period of time (and credentials should not have been cached).

You have probably seen this practice in the wild already: Gmail requires authentication when changing account settings, even if you have recently authenticated. Most sites also require authentication whenever changing the password. This prevents common away-from-keyboard or leaked session attacks.

### 6. Teach users to follow a no-local-copy policy for sensitive information
This is a key policy for users and developers alike. Although it is hard to enforce from a device policy point of view, users can be educated to only store sensitive data as long as necessary. A developer requesting access to a production database to test a corner case is acceptable. Letting that developer make a full dump of the database for quick testing purposes is not. Storing sensible data in client side apps is not acceptable either. As usual, the pros and cons for each resource must be weighed appropriately. For each case consider: what would happen if the data were compromised? Can I trust users to follow the policy? If not, can I automate it somehow?

This is one of the likely scenarios for our laptop theft case. If the contractor had stored a local copy of the database to perform tests or develop a feature, that would be a violation of this policy. See tip 10 for a way for developers to do their job without making this policy a pain to follow. 

### 7. Have a remote or automated wipe procedure in place
After everything has gone wrong, there is one other possible way to keep data safe: wipe it. Most portable devices have some form of internet connectivity. Exploit this (sometimes problematic) feature to your advantage. Have a remote wipe procedure in place. This is already available in most smartphones. And in combination with tip 1 it really provides strong guarantees: by keeping the data encrypted, a secure remote wipe procedure can be performed almost instantaneously. In the old days, when keeping large amounts of data encrypted was not practical due to performance, securely wiping the data would take time. Due to the physical nature of storage devices, multiple writes are required to make sure no data can be recovered. Doing this for all stored data takes time. Nowadays, encryption can be combined with remote wipe procedures: by securely wiping the encryption keys required to decrypt the data, recovering what is stored is impractical (unless the encryption can be broken).

Automated wiping is also very useful. Some smartphones, for instance, have the option to perform a secure wipe after a certain number of wrong attempts to unlock it are performed. This limits the chances an attacker gets to access secure data.

Of course, remote wiping is only useful if the user reports this occurrence in time (or performs the remote wipe himself).

In our laptop theft scenario, the user may have reported the occurrence to the IT team. However, the attacker may have had enough time to access critical data. Or, as many attackers do to increase their chances, he or she may have disabled WiFi or cellular connectivity to prevent the remote wipe command from being received. This is were automated wiping is essential (as long as the device is encrypted).

A skillful attacker may attempt to increase his or her chances of accessing data by imaging the storage device of the stolen device. For certain devices, this requires advanced electronics knowledge and equipment. For other devices, it is as simple as taking a couple of screws out. Therefore, encryption and the no-local-policy for data are essential in combination with this policy to increase the chances of keeping data safe. 

### 8. Use geofencing and geographical checks to report suspect accesses to sensitive data
This tip is of great use when combined with tip 7. Geofencing and geographical checks can quickly alert an IT team of suspicious activity from a compromised device. You may have experienced this yourself already: Google alerts users when simultaneous logins from distant places are active at the same time. Except for VPNs or tunnels, users usually operate their account from a single place at a specific time.

When geographical checks fail, authentication can be requested, or other actions, such as remotely wiping the device or invalidating credentials, can be taken.

In contrast with geographical checks, which usually compare the distance of simultaneous activity from the same set of credentials, geofencing checks for the physical location of a device using WiFi location services or GPS hardware if available. Geofencing can enforce other policies or take specific actions when a device is taken outside its usual area of operation.

In our laptop scenario, if the laptop had been enabled to operate freely only while on the premises or the developer's home, and authentication were to be required when far from those areas, the attackers would have had a harder time doing their deeds. This policy requires the presence of other policies to be truly effective. For instance, two factor authentication might thwart an attacker's action after geofencing forcefully closes an open or cached session. Encryption might make it harder for him or her to reset the user account's local password, therefore blocking future attempts to access the system. 

### 9. Keep your software up-to-date
This might seem like a no-brainer, but it is in fact ignored many times. How many times have we postponed an update to "just finish this one thing", or to prevent reopening a complex working session. Vulnerable software may prevent all other policies from working as they should. A recently patched vulnerability may be used against a user who did not update his or her system to workaround the screen lock. Or it may be used to defeat encryption, or to disable the automatic wipe policy. Up-to-date software is just another link in the long chain of security policies and must always be followed.

This does not prevent the use of 0-day exploits, but it limits the tools an attacker has at his or her disposal, giving you more time to secure your data (via a remote wipe, revoking credentials, a connectivity blackout, etc.).

### 10. For developers: have usable mock data and credentials for local tests
This is an extension of the no-local-copy policy (tip 6). Developers sometimes (in fact, most of the time) need actual data to develop and test software features. Sometimes, very specific data may be needed to test or develop a feature. Think of a rare corner case were some feature fails. It may be caused by a very specific set of factors that may only be reproducible using production data. This is probably the worst case scenario for development, because production systems are sensitive in various ways (not only from a security point of view). One way to go about this is to have mock or test data. In other words, a specially crafted development environment where development can be performed. This environment should not use old (but still sensitive) data, because setting it up in that way opens the possibility for leaks such as the one we have seen this week.

Truth is sometimes not even mock data can be used to debug certain corner cases. In this case, real data can be used, but only after a proper policy for removal (after fixing the problem) is in place. This need not be automated, but it is generally better if it is. Debugging using real data can also be limited to on-premise systems. In other words, it can be limited to non-portable systems for which the risk of theft is generally low. As usual, security is about finding the right set of compromises for your case. If in doubt, lean towards the more restrictive, less-convenient-but-more-secure, option.  

## Aside: how Auth0 helps to protect your data
At Auth0 security is of the utmost importance. Our authentication and authorization services let you set up multiple policies that help greatly whem it comes to security. Some of these are [two factor authentication](https://auth0.com/docs/multifactor-authentication); [custom rules](https://auth0.com/docs/rules) for logging out users automatically, revoking credentials or even [selectively enabling two factor auth](https://auth0.com/docs/multifactor-authentication/guardian/admin-guide#customize-mfa-for-select-users); [automatic breached password detection](https://auth0.com/docs/anomaly-detection#breached-password-detection) using a huge database of leaks; [Auth0 Guardian](https://auth0.com/guardian/) to simplify multiple factor auth, or per resource authentication (using email, [TOTP](https://auth0.com/learn/get-started-with-mfa/), SMS or [push notifications](https://auth0.com/docs/multifactor-authentication/guardian/admin-guide#support-for-push-notifications)); [passwordless authentication](https://auth0.com/passwordless/), to remove the need for users to come up with secure passwords; and per-client [on-site installations](), to keep things in house for the most sensitive systems.

<a href="javascript:signup()">Sign up today</a> and try a free account to get a taste of how easy these features can be set up. 

## Conclusion
Security is hard. One of the ways of dealing with the difficulties associated with it is by keeping multiple layers of security that complement each other. The policies and tips discussed in this article are some of the most basic and simple to implement. When it comes to sensitive information, the more layers, the better. With the advances in modern operating systems and portable devices, enabling many of these is just a matter of a couple of clicks. Others require disciplined users and contrained environments. If your job involves working with sensitive data, there is no excuse to not follow some of these tips. Make sure you only keep as much data as necessary to complete the job. Make sure it is not easy to access it in case of theft, and keep proper automated and remote procedures to make sure that data is wiped whenever it is not required anymore. Following these tips might just save your job (or your employer's).
