---
layout: post
title: "How To Stay Safe While Shopping Online For Cyber Monday"
description: Learn these six tips that will help you shop online safely on Cyber Monday
date: 2016-11-25 08:30
category: Growth, Security, Seasonal
is_non-tech: true
design:
  bg_color: "#222228"
  image: https://cdn.auth0.com/blog/cybermondaylogo.png
author:
  name: Prosper Otemuyiwa
  url: http://twitter.com/unicodeveloper?lang=en
  mail: prosper.otemuyiwa@auth0.com
  avatar: https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200
tags:
- shopping
- cyber-attacks
- security
- infosec
- retail
related:
- 2017-06-01-introducing-the-auth0-security-whitepaper
- 2016-12-15-personal-information-security-identity-guide
- 2017-10-30-are-your-security-questions-as-safe-as-you-think

---

---

Technology has made it very easy for people to purchase goods and services from the comfort of their homes. **Cyber Monday** is approaching, and a lot of people will be online watching the prices of their favorite items fall, ready to purchase them when the price drops far enough. Billions of dollars will be spent online during this popular *end-of-the-year sales* event. It's well known that a lot of online transactions happen during the months of October, November, and December. Unfortunately, a lot of fraudulent online activities happen during this time as well. Cyber criminals are most active during holidays, and a lot of online shoppers are negligent about cyber security threats. These kind of users make easy targets for hackers and cyber-criminals.

---

How do you stay safe while shopping online? I'll expatiate on six tips that can help you shop safely online on **Cyber Monday.**

## 1. Ensure that the site is secure by looking for https in the URL

Once you visit a website, ensure that the site has Secure Sockets Layer (SSL) encryption installed. The website will start with **https://** and a locked padlock will also be present in the address bar, near the URL. Don't attempt to buy anything with your credit/debit card on a website that has no SSL installed.

![Visit Secure Sites on CyberMonday](https://cdn.auth0.com/blog/top-5-threats-cyber-monday/Unsecure-Sites.png)
_Make sure you shop on secure sites_

## 2. Avoid using weak passwords

Hackers maintain a list of commonly used passwords that are deployed via bots to try on various websites at a time. Using a weak password increases the risk that your credentials could be randomly generated in those lists. If you currently have a weak password on the sites you shop with regularly, it's time to change to a very [strong](https://auth0.com/docs/connections/database/password-strength) password. Here are some tips to help you create a secure password:

* Use a long password, including at least 10 characters with a combination of numbers, symbols, and upper and lowercase letters.
* Avoid using common information such as your name, Social Security number, nickname, and so on.

![Avoid Weak Passwords on CyberMonday](https://cdn.auth0.com/blog/top-5-threats-cyber-monday/Weak-Password.png)

## 3. Look out for fake and forged Sites

During this shopping period, cyber criminals go to great lengths to replicate popular websites. Users can then get tricked into providing sensitive information such as usernames, passwords, Social Security numbers, and credit card details on fake versions of popular sites, thinking that they are logged into the real site.

Here are some tips to ensure that you don't log into a forged site:

* Look out for the encryption symbol, *padlock*, in the URL. Verify that the site is secure by ensuring that the URL starts with **https://** instead of **http**.
* Look out for typos in the site name and URL.
* Look out for fake ads and emails.
* Use anti-phishing software, such as **Kapersky** or **Avast**.

![Avoid Phishing Sites](https://cdn.auth0.com/blog/top-5-threats-cyber-monday/Phishing.png)

## 4. Try as much as possible to shop with trusted brands

There are various shopping websites that have earned a strong reputation over time. I advise that you shop on those websites that are globally recognized as trusted brands. These brands have experienced **Cyber Monday** events various times and have improved their **tech** to provide very robust security measures to handle the numerous online shoppers who will log into their platform.

**Note:** A lot of cyber criminals try to play on this mentality by creating fake versions of these popular websites. As I highlighted earlier in this post, look out for forged sites!

![Trusted Brands](https://thebrandthattimeforgot.files.wordpress.com/2013/10/brand-logos_various.png)
_Source: https://thebrandthattimeforgot.files.wordpress.com_

## 5. Look out for malware and ad scams

During this season, social network scams and malware are on the increase. Lots of fake deals exist on the Internet. These fake deals, when clicked, direct you to fake sites and trick you to download, in some cases, antivirus software or software that can make you claim hot deals. In most cases, this software is malware that can steal information from your computer when installed.

Here are some tips to ensure that you are not a victim of these scams:

* Ensure that you have an up-to-date antivirus program installed on your computer.
* Ensure that your computer's operating system is up to date.
* Don't open URLs that seem suspicious.

![Social Media Scams](http://adabouts.com/blog/wp-content/uploads/2015/08/Screen-Shot-2015-08-10-at-9.45.52-AM.png)
_Source: http://adabouts.com_

You might see various ads that say **Claim this..** or **Claim that..** like the one below:

![Phishing Ad Banners](https://cdn.auth0.com/blog/top-5-threats-cyber-monday/Malware-2.png)
_Scam Ads_

## 6. Avoid deals that are too good to be true

Humans, by nature, are said to be driven by greed, so cyber attackers prey on users with this mindset by tricking users with incredible deals. During this season, various deals appear on social media that are just too good to be true. There is a popular [twelve scams of Christmas list](http://www.mcafee.com/us/about/news/2011/q4/20111109-01.aspx) compiled by McAfee. This list contains the popular examples of *too good to be true* deals. Try as much as possible to avoid deals like this!

## Aside: Stay Secure with Auth0

As a developer, you can use [Auth0 Lock](https://auth0.com/docs/libraries/lock) to authenticate your users. The lock widget uses **https** to ensure that users' information is transmitted securely.

You can also use Auth0's [Breached Password Detection](https://auth0.com/breached-passwords/) feature to ensure your users are protected from compromised credentials.

Futhermore, you can define **password policies** to customize the level of complexity of the passwords a user enters during sign-ups. Auth0 offers five levels of security matching the [OWASP password recommendations](https://www.owasp.org/index.php/Authentication_Cheat_Sheet#Implement_Proper_Password_Strength_Controls):

- **None (default)**: The password must exist and be at least one character long.
- **Low**: The password must be at least six characters long.
- **Fair**: The password must be at least eight characters long and must contain a lower case letter, an upper case letter, and a number.
- **Good**: The password must be at least eight characters long and must contain at least three of the following four characters: a lower case letter, an upper case letter, a number, or a special character (e.g. !@#$%^&*)
- **Excellent**: The password must be at least 10 characters long. It must contain no more than two identical characters in a row (e.g., "aaa" is not allowed). It must contain at least three of the following four types of characters: a lower case letter, an upper case letter, a number, and a special character (e.g. !@#$%^&*).

![Password Strength](https://cdn.auth0.com/blog/top-5-threats-cyber-monday/password-strenght.png)


## Conclusion

We have covered various tips on how to stay safe while shopping online on Cyber Monday. **One more tip:** *Its safer to use credit cards to shop online.* With credit cards, if there are suspicious unauthorized transactions on your card, you can contact your bank to reject the transactions and have your money refunded.

Happy safe shopping!!!
