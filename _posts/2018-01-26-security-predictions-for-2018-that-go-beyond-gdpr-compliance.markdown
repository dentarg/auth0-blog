---
layout: post
title: "Security Predictions for 2018 That Go Beyond GDPR Compliance"
description: "Here are 5 trends that will help you keep your organization secure in 2018."
date: 2018-01-26 08:30
category: Growth, Security 
author:
  name: Diego Poza
  url: https://twitter.com/diegopoza
  avatar: https://avatars3.githubusercontent.com/u/604869?v=3&s=200
  mail: diego.poza@auth0.com
is_non-tech: true
design:
  bg_color: "#222228"
  image: https://cdn2.auth0.com/blog/get-ready-for-gdpr/logo.png
tags:
- security
- gdpr
- identity
- compliance
- data-protection
- passwords
- data
- iot
- phishing
- mfa
- multifactor-authentication
related:
 - 2018-01-15-mission-possible-reality-for-7-gdpr-misconceptions
 - 2017-12-08-how-poor-identity-access-management-equals-security-breaches
 - 2017-12-11-business-identity-theft-is-on-the-rise
---

<div class="alert alert-info alert-icon">
  <i class="icon-budicon-500"></i>
  <strong>GDPR is around the corner. Are you Ready? Take our GDPR Readiness Assessment to find out. <a href="https://auth0.com/gdpr-assessment/tool-1">Start the survey</a>.</strong>
</div>

---

**TL;DR:**  It's easy to predict the security threat for 2018 (Hint: It will be bigger and more sophisticated than 2017). It's another thing to prepare for what lies ahead. Here are 5 trends that will help you keep your organization secure in 2018.


{% include tweet_quote.html quote_text="Here are 5 trends that will help you keep your organization secure in 2018" %}


[GDPR compliance](https://auth0.com/gdpr) is dominating the 2018 security discussion. With the May 25th deadline quickly approaching, the first half of 2018 will likely be consumed with making the necessary changes for compliance, which is an enormous task for any size company.

While GDPR is extremely important and failure to comply comes with [stiff penalties](https://resources.auth0.com/whitepaper/gdpr-fine-determination/), don't let it distract you from anticipating the security threats that await your organization. If you thought 2017 was a massive year of cyber attacks, there are unfortunately no signs of slowing down in 2018.

Here are our 5 security predictions to help you prepare for 2018.

### 1. Customers Are Fed Up With Passwords

The weaknesses of traditional credentials are well documented, yet most organizations continue to use them as the primary security method. Customers have had enough.

The Equifax breach was the straw that broke the camel's back. While security experts have known of the vulnerabilities of password reliance, the high-profile breaches of 2017 have brought a higher level of awareness to the general public.

People want security alternatives. A recent [survey](https://www.csoonline.com/article/3242866/security/our-top-7-cyber-security-predictions-for-2018.html) showed that people are now more concerned with someone stealing their personal data than they are with a home break-in. A company's reluctance to add stronger authentication will have to deal with fierce customer demand for additional security beyond the password.

The first logical step to strengthening traditional credentials is to implement [multifactor authentication](https://auth0.com/docs/multifactor-authentication) (MFA).  

![Multi-factor Auth](https://cdn.auth0.com/blog/2018-security/Multifactor-Authentication.png)

MFA is a method used to verify a user's identity when they are trying to access an application. In addition to a password, MFA requires you to provide additional information such as an SMS code or a fingerprint to confirm your identity.

Consumer-oriented companies like Google, Apple, and PayPal have made MFA a standard feature and the trend will continue in 2018 with both consumer and enterprise accounts.


### 2. Preventing Aftershock Breaches

Companies that are breathing a sigh of relief that they weren't hit by a cyber attack in 2017 need to worry about a different type of threat — the aftershock breach.

The millions of compromised credentials taken from previous breaches now pose a liability for every company that uses passwords for security (which is everyone). Most people use the same credentials for all of their accounts, which heightens this risk of an aftershock breach, where hackers use the stolen credentials to access other accounts.

Experian's recent Data Breach [Report](https://www.experian.com/assets/data-breach/white-papers/2017-experian-data-breach-industry-forecast.pdf) notes:

> Given the continued success of aftershock breaches involving username and passwords, we predict that attackers are going to take the same approach with other types of attacks involving even more personal information, such as social security numbers or medical information.

Aftershock breaches can be minimized by using risk-based authentication, such as[ anomaly detection](https://auth0.com/docs/anomaly-detection) which monitors user behavior data to determine suspicious activity. By[ collecting signals](https://auth0.com/university/1/4/how-to-use-auth0-s-rules-feature) such as an IP address or the location of a user, anomaly detection can compare previously established behavior in order to spot inconsistencies.

![Password Breach Block](https://cdn.auth0.com/blog/2018-security/breached-pass-lock.png)

Auth0's anomaly detection also tracks [password breaches](https://auth0.com/breached-passwords) of major third-party sites to help keep your users and systems secure. When a company like Equifax is breached, you can block your users from logging into your accounts until they go through a new authentication protocol.

When combined with MFA, anomaly detection makes it really hard for hackers to leverage their stolen credentials and initiate an aftershock breach.


### 3. Weaponizing Data Rather Than Stealing It

A few years ago, someone hacked into the Associated Press' Twitter account and tweeted a false report that President Obama had been injured in an explosion. The news caused a 150-point drop in the stock market.

![Source](https://cdn.auth0.com/blog/2018-security/67201644_ap.jpg)

This type of data manipulation, known as a data integrity attack, will become more prevalent in 2018. While stealing millions of credit card numbers might seem like a huge score, it only works if you have a buyer on the other end. Hackers are realizing that it is much easier to capitalize on the data itself.

For example, an attacker could doctor a bank's routing numbers for a large financial gain. Or, one could erode public confidence by shutting down electrical grids. Regardless of the intention, the new target is in using the data, not stealing it.

Integrity attacks are hard to detect, which could leave companies defenseless with their current monitoring systems. The immediate solution to this threat is [data encryption](https://digitalguardian.com/blog/what-data-encryption). Most companies have an encryption policy that protects their most sensitive data, but the definition of sensitive data must be expanded to protect all potential attacks.

![Source](https://cdn.auth0.com/blog/2018-security/data-encryption.png)

The idea behind data encryption is to make your data incoherent to outsiders without the decryption key. **Why does this matter?**

The breaches in the past five years have shown that hackers can infiltrate the most sophisticated cyber security systems in the world. Traditional security like firewalls, intrusion monitoring and antivirus software are not very effective once hackers get inside. The last line of defense is to encrypt your data.


### 4. Rise of the Bots Against IoT

Bots are supposed to be our friends. They take care of the tedious, repetitive tasks so we can focus on the more important work. **But what happens when bots turn to the dark side?**

In 2016, a [botnet](https://www.csoonline.com/article/3240364/hacking/what-is-a-botnet-and-why-they-arent-going-away-anytime-soon.html) of more than 500,000 devices [attacked ](https://en.wikipedia.org/wiki/2016_Dyn_cyberattack) Dyn, a domain name service providers, crippling the internet and impacting huge websites like Amazon, Spotify, and Netflix. These types of attacks are often executed through internet-connected devices, and the threat for 2018 has never been greater.

![Source](https://cdn.auth0.com/blog/2018-security/botnet2_1238990.jpg)

IoT is expected to surpass 10 billion devices in 2018 and over [22 billion by 2021](http://uk.businessinsider.com/the-internet-of-things-2017-report-2017-1?r=DE&IR=T). Every one of these devices poses a security risk as the surface area for an attack expands well beyond what current security measures can handle. In fact, [HP](http://www8.hp.com/de/de/hp-news/press-release.html?id=1744676#.WMFmT1XyiUk) found that at least 70 percent of IoT devices are vulnerable to an attack.

Hackers can simply buy a botnet kit, which gives them everything they need to launch an attack. The three most popular kits—Andromeda, Gamarue, and Wauchos—have already helped attackers infiltrate millions of devices. Once inside, the bots are capable of a myriad of debilitating tasks from taking down networks to compromising data or even controlling a device. **It will make you think twice about who is driving your self-driving car.**


### 5. Phishing is Still King

Major data breaches, ransomware attacks, and identity theft often start the same way—with a simple phishing scheme.

Phishing is still the most effective method for attackers to infiltrate a system, mainly because it relies on human error, which renders technical security useless. The only real defense is to train people to identify schemes and remain aware at all times.

While awareness will help prevent traditional phishing, attackers are creating more sophisticated techniques to outsmart the uneducated. They've also found success with other channels beyond email like phishing with SMS, also known as smishing.

![https://cdn.auth0.com/blog/2018-security/phishing-bank.png](https://cdn.auth0.com/blog/2018-security/phishing-bank.png)

Smishing scams are harder to detect because they take advantage of people's sense of urgency. Let's say you receive a text that appears to be an important message from your credit card company. An urgent message can catch you off guard and before you know it, you've compromised your information. 

Awareness training becomes more difficult with smishing because of its heightened nature. You can't always prevent someone from being tricked by phishing, but you can anticipate it and secure your accounts beyond credentials. Password managers like [1Password](https://1password.com/) can be useful, but adding more layers of defense with MFA will help keep your accounts safe.


## Security in 2018 is About Proactive Prevention

Sadly, many of the breaches in 2017 could have been prevented with stronger security measures, especially around identity access management. Archaic methods like passwords and unprotected data made it easy for hackers to pull off some of the biggest heists of 2017 including corporate giants like Equifax and Deloitte.

The attack tactics might evolve, but at the end of the day, taking proactive measures will help deter the majority of attempts. By understanding the different threats, you can get ahead of them before they occur. 

**_READ MORE:_**  [How Poor Identity Access Management Equals Security Breaches](https://auth0.com/blog/how-poor-identity-access-management-equals-security-breaches/)
