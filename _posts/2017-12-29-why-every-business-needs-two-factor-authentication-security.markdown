---
layout: post
title: "Why Every Business Needs Two-Factor Authentication Security"
description: "Add Extra security to your company's Data without giving up the mobility your employees expect."
date: 2017-12-29 08:30
category: Growth, Security, Multifactor
author:
  name: Martin Gontovnikas
  url: http://twitter.com/mgonto
  mail: gonto@auth0.com
  avatar: https://www.gravatar.com/avatar/df6c864847fba9687d962cb80b482764??s=60
is_non-tech: true
design:
  image: https://cdn.auth0.com/blog/why-two-factor/logo.png
  bg_color: "#362570"
tags:
- security
- two-factor
- multifactor
- business
related:
- 2017-11-29-5-massive-benefits-of-identity-as-a-service-for-developers
- 2017-11-27-how-data-analytics-can-transform-your-business
- 2017-12-15-why-your-iam-definition-of-user-could-be-costing-you-millions
---

When is the last time you saw a jewelry shop protect their diamonds with a simple lock and key? Even before extra layers of security like alarms, motion detectors, and [biometrics](https://en.wikipedia.org/wiki/Biometrics) were invented, jewelers hid their diamonds and even put out fakes to deter criminals.   

In your company, data is as valuable as those diamonds — so why are you protecting it with a [simple username and password?](https://auth0.com/blog/modern-authentication-for-your-clients-made-easy/;)

Passwords are the keys that access your company's data, but like the traditional lock and key, any mediocre cybercriminal can easily decipher your password. In fact, it's now possible for your mother to easily hack your Facebook account.

![Your mom can hack your Facebook account.](https://cdn.auth0.com/blog/why-two-factor/facebook-account-Password-Hacker.png)

Technology enables hackers to test billions of password combinations per second, exposing  [_90% of all passwords_](http://www.telegraph.co.uk/technology/news/9802062/90-of-passwords-vulnerable-to-hacking.html). Facebook realized this when they [discovered](http://www.businessinsider.fr/us/90-percent-of-passwords-vulnerable-to-hacking-2013-1/) 600,000 imposters were attempting to access users' personal information every day using stolen passwords.

Companies like LinkedIn, Google and Twitter decided that they needed extra layers of security to strengthen passwords and protect their users' data. The solution: two-factor authentication (2FA).

{% include tweet_quote.html quote_text="Even your mom can try hacking your Facebook account." %}

## Two-Factor Authentication Adds the Extra Security You Need

If you have logged into Facebook, Twitter, or Google within the past few years, you have come across two-factor authentication.

Two-factor authentication (2FA), sometimes referred to as [multifactor authentication](https://auth0.com/learn/multifactor-authentication/), is a method used to verify a user's identity when they are trying to access an application. In addition to a password, 2FA requires you to provide a second piece of information to confirm your identity.

The first step is to sign into your account with a username and a password. This is the first factor of the two-step process.

![First factor of two-factor authentication: username and password.](https://cdn.auth0.com/blog/why-two-factor/Gmail-login-procedure-email-and-password.png)

Unlike the ineffective security questions such as your mom's maiden name or your school's mascot, the second piece of information used in 2FA is extremely hard for cybercriminals to acquire. The idea is to create a second factor that is unique to the user, which is often something they possess, like a smartphone, or even something biological, like a fingerprint.

After you enter your credentials in step one, you will be prompted to add the second factor. There are several pieces of information that can be used, which we'll share below. In this case, the user chooses an SMS verification.

![Google asking SMS verification on two-factor authentication](https://cdn.auth0.com/blog/why-two-factor/2-step-verification-google.png)

Hacking a password is extremely easy, but obtaining a physical device that generates the second code or stealing biological features is not as easy, which is why 2FA is one of the most effective security approaches available.

### 2FA Approaches to Give Your Employees Convenient Options

If you are considering 2FA for your business, there are several approaches for the second factor known as one-time passwords (OTP) that don't require the technical sophistication of biometrics (fingerprints, retina scans).

Your OTP options include:

* **SMS (Text Messages):** SMS is the most popular method of 2FA. After a successful login, the user receives a 5-10 digit code via SMS on their phone, which they then enter into the application for access.
  - **_Pros:_** Employees are comfortable receiving text messages and it is cost-effective to implement.
  - **_Cons:_** Relies on cell reception and a physical phone. If stolen, you can't authenticate.
* **Email:** An OTP can be sent to a secondary email account for verification. This technique works in the same way as SMS, where a 5-10 digit code is sent to the email address.
  - **_Pros:_** Employees can get emails on multiple devices, it’s cost-effective and everyone uses email.
  - **_Cons:_** Emails sometimes fail to deliver, and hackers can gain access to your email and get the code.
* **Voice Call:** Although not a common practice, users can choose to receive a call to a designated phone number with the OTP delivered using a text-to-speech service.
  * **_Pros:_** All employees are comfortable with phone calls and voice doesn't require a data connection.
  * **_Cons:_** Calls can be intercepted, forwarded or voicemails hacked. If stolen, you can't authenticate.

![Multiple two-factor authentication screens](https://cdn.auth0.com/blog/why-two-factor/Twitter-Card-Multifactor.png)

* **Hardware Tokens:** This is a common enterprise practice, where employees are given a physical device such a [*key fob*](https://en.wikipedia.org/wiki/RSA_SecurID), or other devices that dynamically generates a code for the user.
    * **_Pros:_** It is a standalone solution that doesn’t require reception or WiFi connection.
    * **_Cons:_** The pieces are expensive, hard to manage and devices are easily misplaced or lost.
* **Software Tokens:** Instead of carrying around a device, software tokens require employees to install an application that runs on their computer or mobile device.
    * **_Pros:_** Apps are easy to use, easy to update and easy to apply patches when needed.* *
    * **_Cons:_** Employees must download to their personal device. Apps can be compromised without user knowledge.
* **Push Notification:** Apps like Auth0 [Guardian](https://auth0.com/docs/multifactor-authentication/guardian) enable you to receive a push notification in the same way you get alerts from your calendar app or news activity. The notifications request a response of either a “Yes” or a “No.”
    * **_Pros:_** There's a direct and secure communication between authentication and the smartphone application.* *
    * **_Cons:_** If a device is stolen, users must go online to cancel the device before it is compromised.

Although there are pros and cons to every 2FA option, keep in mind that it is impossible to get your enterprise authentication 100% secure. Implementing 2FA increases your security no matter what, so select a second factor that works best for your employees.

## 2FA Goes Beyond Security to Improve Output

While the primary reason businesses implement 2FA is for the extra layers of security, the methodology of 2FA also enhances employee productivity and operational efficiencies.

Simply by requiring a second form of identification, there is a low probability that a hacker can successfully impersonate an employee and gain access to your systems. If an employee loses a mobile device or a password is stolen, 2FA provides enough time for your company to remedy the issue before too much damage is done.

Beyond these obvious mobile security benefits, 2FA also provides the enterprise with a few other advantages that affect your bottom line.

### Increased Productivity

Employees are now mobile, working on their personal devices outside the office. As a result, they are more productive and businesses are reaping the rewards of this newfound flexibility.

2FA is an [effective method](https://auth0.com/blog/enhancing-productivity-with-identity-and-access-management/) to secure mobile devices where employees can safely access company-owned applications, data, shared documents, and other systems from virtually any device without putting the company at risk. Corporate IT can rest assured that if a device is compromised, 2FA will make it really hard for anyone to gain illegal access.

![Nowadays, multiple devices are used by employees.](https://cdn.auth0.com/blog/why-two-factor/DifferentDevices2.jpg)

Employee mobility has created a happier and [more productive](https://www.forbes.com/sites/danielnewman/2016/03/29/is-mobility-the-answer-to-better-employee-productivity/#6c493277131c) workforce, and 2FA is the best method to provide the security measure that reaches outside the firewall to make it all possible.

{% include tweet_quote.html quote_text="Two-factor authentication also means increased productivity." %}

### Increased Awareness

Stolen credentials are the biggest security risk for every business, but most companies don't even know when an employee's credentials have been compromised until it is too late.

In the devastating 2014 [eBay data breach](https://www.alertlogic.com/blog/the-ebay-breach-in-review/), the attackers spent over 229 days within eBay's systems because the stolen passwords were logged as appropriate access. 2FA notifies the account owner immediately that their credentials are being used by someone other than them.

![Google showing an alert that a non-regular sign in was blocked.](https://cdn.auth0.com/blog/why-two-factor/Google-block-sign-in-attempt-prevented-email.png)

If the hacker has both security factors, there is a good chance that the account owner has already reported a security concern because it means they are missing a device or received an alert that is inconsistent with their activities. 2FA gives the business a new level of awareness level to stop crimes before they start.

### Cost Savings

There are several ways 2FA can help your company save money. The biggest is in preventing a data breach, which can cost a company up [to $3 million](https://www-03.ibm.com/security/uk-en/data-breach/). Beyond mitigating theft, there are two other ways 2FA can help you save money:

1. **Reduced Help Desk Inquiries:** Time is money and reducing the amount of time your IT expert is spending resetting passwords can save the company a lot of money. According to HDI, at least 35-40% of help desk calls are related to password resets, which require an average of 20 minutes of the help desk technician’s time to complete. 2FA gives employees a secure way to reset their own passwords, resulting in fewer calls and more productive employees.

2. **Cloud-based 2FA:** Some larger companies have implemented 2FA using hardware tokens (or "fobs") that employees carry around like a thumb drive. These tokens generate one-time passwords, but they are expensive and hard to manage as employees often lose them or keep them after they leave the company. [Cloud-based tools](https://auth0.com/learn/cloud-identity-access-management/) like Auth0 provide soft tokens like SMS and Push Notifications, giving companies a new, cost-effective way to utilize 2FA.

![Crypto card two factor authentication](https://cdn.auth0.com/blog/why-two-factor/CryptoCard_two_factor-1024x690.jpg)

Identity access management [tools](https://auth0.com/learn/cloud-identity-access-management/) allow businesses to [implement 2FA ](https://auth0.com/learn/two-factor-authentication/)for their internal systems in the same way Google, Twitter and Facebook use it to address consumer concerns. Not only will you gain that added layer of security, but the enhanced productivity, awareness and cost savings make 2FA a viable tool for your bottom line.

## Empower Your Passwords, Improve Your Business

In the same way we still use keys to unlock our doors, passwords are our preferred method of accessing our digital worlds. Passwords have been part of humanity for ages and are not going anywhere, but that doesn't mean we need to rely on them solely to protect our company's valuable assets.

2FA augments passwords in a unique way that not only adds an important layer of extra security but also enhances employee productivity helping your bottom line.
