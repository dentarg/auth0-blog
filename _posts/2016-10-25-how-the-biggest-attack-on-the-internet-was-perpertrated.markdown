---
layout: post
title: "How was the biggest attack in Internet history perpetrated?"
description: Learn how the Dyn attack was perpetrated, how it could have been prevented and how to avoid similar attacks in the future
date: 2016-10-25 08:30
category: Internet Attack, IoT
design:
  bg_color: "#305F96"
  image: https://cdn.auth0.com/blog/SSO-Logo.png
author:
  name: Prosper Otemuyiwa
  url: http://twitter.com/unicodeveloper?lang=en
  mail: prosper.otemuyiwa@auth0.com
  avatar: https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200
tags:
- internet-history
- iot
- internet-attack
- dyn
related:
- 2016-07-11-pokemon-go-catches-all-your-data
- 2015-12-28-securing-your-nodebots-with-json-web-tokens
- 2015-11-06-surprised-turns-out-consumers-dont-trust-iot-security/
---

---

**TL;DR:** Last week, one of the biggest attacks in the internet history was perpetrated via a group of hackers during which popular websites like **Twitter**, **Netflix**, **GitHub**, **Amazon**, **Spotify** were knocked offline. These web sites were not accessible for the period the attacks lasted. A Distributed Denial of Service (DDOS) attack on Dyn - a domain name server company -  affected the online availability of these popular platforms.

---

## How did it happen?

Investigations about the recent DDOS attacks primarily revolved around **Internet of Things(IoT)**. It was revealed that several cameras, digital video recorders(DVRs) were hacked to create a massive botnet that struck Dyn with lots of traffic, about a trillion bits of data per second. These cameras and devices were vulnerable because they used default and common guessable passwords.

The attack on Dyn came from tens of millions of IP addresses according to the formal statement that was released on Dyn's website. The botnet that invoked the attack looks for smart home and **Internet of things** devices and transforms them into bots to use in cyberattacks. It was also discovered that one of the reasons this was so easily done was that most IoT devices still use the default username and password combination that they were shipped with. An example of a common username is `root`. These credentials are easy to find on the Internet, and were probably used to compromise thousands of devices with minimal effort.

## How could it have been prevented?

It is not new that in the **Internet of things** world, a lot of default and guessable passwords are used for these devices. In short, it's been a thing of concern for a long time that a lot of these devices are not well secured. For instance, several security cameras such as the one produced by Hangzhou XiongMai Technologies (XM) have a web app which requires a username and password to gain access to. But according to Wikholm, it's actually possible to bypass the login process by providing the IP address of a target device and adding "DVR.htm" to the end. These simple steps shown below will go a long way in preventing a lot of the cyber attacks happening frequently.

* Always change default passwords - Most of these devices hardcode the default passwords, so in most cases it would involve a firmware rewrite from the manufacturer. Companies responsible for creating these devices can provide an over-the-air update capability to enable the change from default to a complex username and password combination. In cases where the default passwords can be changed easily, please change it as soon as you purchase the device.
* Brute Force Protection - A certain limit can be set on failed login attempts on a device. If it exceeds a certain number, you can block the user!
* Change passwords frequently - The more devices, apps and systems get hacked, the likelihood that your password is leaked increases. Make a habit of frequently changing your passwords. More details can be found [here](https://auth0.com/blog/avoiding-password-reuse-attacks/)

## How can Auth0 help secure IoT?

Here at Auth0, we conducted a survey about both developer and consumer sentiments when it comes to the state of IoT security and what people think about the future. This very interesting [post](https://auth0.com/blog/surprised-turns-out-consumers-dont-trust-iot-security/) gives full details about the survey.

![Do you believe IoT devices are secure](https://cdn.auth0.com/blog/iot-survey/do-you-believe-iot-devices-are-secure-2.png)

![Do you trust your personal data to IoT devices](https://cdn.auth0.com/blog/iot-survey/do-you-trust-your-personal-data-to-iot-devices.png)

You can use **Auth0** to simplify the implementation of your identity security. Auth0 provides the following:

- Can function as your authentication server, providing you with secure Json Web Tokens (JWTs)
- Keeps you up to date on the latest security vulnerabilities
- Provides [passwordless](https://auth0.com/passwordless) authentication, thus removing the vulnerabilities involved with hacked passwords.
- Provides [Anomaly Detection](https://auth0.com/learn/anomaly-detection/)
- Provides [Breached Password](https://auth0.com/breached-passwords) detection

## Conclusion

Cyber attacks are becoming the order of the day and many companies that develop IoT devices constantly think about user experience before security. Security should be *first-class* when dealing with connected devices and any type of application.

{% include tweet_quote.html quote_text="Security should be first-class when dealing with connected devices and any type of application!" %}