---
layout: post
title: "How to Not Get Your Identity Stolen"
description: "Practical advice for mitigating your risk of identity theft."
date: 2017-04-10 8:30
category: Growth, Identity
author:
  name: "Ado Kukic"
  url: "https://twitter.com/kukicado"
  mail: "ado@auth0.com"
  avatar: "https://s.gravatar.com/avatar/99c4080f412ccf46b9b564db7f482907?s=200"
design:
  image: https://cdn.auth0.com/blog/migrate-stormpath-users/stormpath_logo.png
  bg_color: "#244EC6"
related:
  - 2016-11-30-different-ways-to-implement-multifactor
  - 2015-12-17-json-web-token-signing-algorithms-overview
tags:
  - identity
  - identity-management
  - identity-tips
---

Nobody wants to get their identity stolen. In fact, it's probably one thing that is pretty much universally feared. Not only is it scary to think that someone else could access your personal information and take your debit card on a joyride, it can also be a hassle to get everything back in order after suffering from identity theft.

We've put together this article to help you protect yourself from identity theft. Short of going off the grid and living anonymously in the woods, here are the best practices to reduce your risk of having your identity stolen.

## Refresher on personal security

This isn't the first time we've talked about protecting your identity on the Auth0 blog. So, here's a refresher of what we covered in our [most recent article](https://auth0.com/blog/personal-information-security-identity-guide/) on the topic before we begin: 

* **Use multifactor authentication.** Most apps, email platforms, and websites offer some form of multifactor authentication, the practice of using multiple devices to verify entry into an account, so check if it's available for your accounts (email, etc.) and set it up. 
* **Stay secure on social.** Use strong passwords, and update your security settings. 
* **Learn to identify and avoid phishing emails and phone scams.**
* **Protect your home wifi network** by setting up a password. 
* **Use a password manager** so that you can use a unique, strong password for each of your logins.
* **Only use secure wireless networks** and try to avoid unsecured, public wifi.

These are all common-sense suggestions to keep your accounts safe — we all know that we should use a strong password and install an antivirus. So now that we've covered the basics, let's look at some more ways you can protect yourself from identity theft and keep your information secure.

## Signs of phishing

In our previous post, we warned of email scams that can be malicious attempts to collect passwords and other data. Here are some more tips to avoid being duped by phishing.

* **If an email asks you to login to your account and provides a link — don't click!** Instead, type the link directly into your browser. For example, [this](https://twitter.com/benthompson/status/843855792587460610) fake email contains a link that could be legitimate, but redirects you to a malicious website:

![Phising Email](https://cdn.auth0.com/blog/how-to-not-get-your-identity-stolen/phishing.png)

* **Pay attention to the URL of the websites you use to log in or enter other information.** Most websites have a lock to indicate that they are “secure.” This is an indication that any data moved between the website and the web browser is encrypted, but it **isn't** an indication that the website itself is not malicious. This means websites like “www.login-paypal-inc.com” can be marked as secure, despite obviously posing as an extension of PayPal. If you're putting in a password or payment, double check the URL — and if it seems a little fishy, do a quick search of the company you're trying to interact with and see if the URLs match.

![Checking HTTPS](https://cdn.auth0.com/blog/how-to-not-get-your-identity-stolen/https-check.png)

## Securing your email

Aside from having a strong, unique password, you should:

* **Use fake answers to security questions.** Instead of really using your dog's name or hometown, either make up answers that you can remember, or use answers that are close, but not quite — for example, your best friend's hometown instead of your own.
* **Take advantage of account security checkups.** Check to see if your email provider has a security checkup option, and set aside some time to run a checkup on a regular basis. For example, Gmail offers security and privacy checkups:

![Google Privacy Checkup](https://cdn.auth0.com/blog/how-to-not-get-your-identity-stolen/privacy-check.png)

* **Keep your recovery information up to date.**
* **Log out.** If you log in to your email on a friend's or a communal computer, make sure you log out and remove your email from being an automatic option for sign in.

## Protecting your financial information

Financial information is always a target for theft. Follow your common sense:

* **Check your bank, credit, and debit card statements.** The more often you check, the more likely you are to notice a fraudulent charge. While it's probably best practice to look in on your accounts every day, aim for at least once a week.
* **Sign up for account alerts.** Most banks offer alerts via email, text, and push notifications. Depending on your banking provider, you should be able to trigger an alert when your account goes under a certain balance, when a payment is made, or even every time a purchase is charged to your account. 

![Account Alerts](https://cdn.auth0.com/blog/how-to-not-get-your-identity-stolen/avail.png)

* **Check security settings on payment apps.** Most apps that allow you to easily transfer money from person to person, like Venmo, have more security available than what is set as default. Make sure you take advantage of all available security options.
* **Don't use a shared device to check accounts.** 
* **Don't save your cards on any websites.** Although the convenience of having a card available on your favorite websites is tempting, resist! If a hacker figures out your email and password on a shopping website, storing your card information only paves the way for people tapping into your bank.

## Avoiding skimmers

Another big piece of keeping your financial information safe and avoiding identity fraud is not getting your card information and PIN number “skimmed” at an ATM. Here are some ways to combat this particular issue:

* **Always cover your PIN number.** Some thieves will place cameras on ATMs to nab your PIN number. Cup your hand around the keypad to block your hand from view when you punch in your number.
* **Use ATMs in banks when possible.** Since bank ATMs are monitored with cameras, they are less likely to be the target of thieves using skimmers. Even if you have to pay a small transaction fee, it could be worth heading to the nearest bank to make a withdrawal. 
* **Give your ATM a jiggle.** Although it might look weird, trying to move the plastic around an ATM's card reader is a good habit to get into. ATMs that haven't been tampered with will not budge, but if you feel a wiggle, someone might have attached a skimmer to the card slot. 
* **Use a credit card instead of a debit card.** Debit cards are cash transfers that [require](http://www.pcmag.com/article2/0,2817,2469560,00.asp) a FDIC claim to reverse, which can take weeks. Credit card transactions, however, can be stopped or reversed almost immediately.

## Medical insurance

Although most of us do not store our own medical data in our houses or on our computers, one big target of identity theft and fraud is your medical insurance. 

While it's important to keep your insurance card handy, make sure that any copies or record of its data is secure. 

Most importantly, **check your explanation of benefits**, which shows services that your insurer helped cover. If you notice any procedures that you didn't get, contact your provider immediately. Aside from being a victim of fraud, having your medical insurance stolen can put you in the unfortunate position of having inaccurate medical data tied to your record if you don't deal with it swiftly.

## Device disposal 

When you're ready to move on from your old computer, phone or tablet, make sure to properly remove or destroy all information that you had on the device. This is an especially important step if you're passing your device along to be used by someone else.

**For computers**, wipe or destroy the hard drive prior to disposal. Accessible advice for wiping your computer can be found on the [FTC website](https://www.consumer.ftc.gov/articles/0010-disposing-old-computers).

**For phones**, wipe the memory and remove any SD cards, destroy them if you don't plan on putting them in another device. Accessible basics of wiping your phone can be found on the [FTC website](https://www.consumer.ftc.gov/articles/0200-disposing-your-mobile-device), and [CNET](https://www.cnet.com/how-to/how-to-wipe-your-phone-or-tablet-before-selling/).

## Get your setup running and then build good habits

If this list seems overwhelming, take a deep breath! It all boils down to two things: getting a good setup in place, and getting into good habits. 

Make sure your passwords are secure and update your social media privacy settings. 

Then, try to build good security habits into your everyday life, whether that's checking the charges on your credit card, or setting a calendar reminder to check in on your explanation of benefits every once in a while. 

Although we all want to think of identity theft as something that happens to someone else, it's not worth putting your identity at risk when there are relatively easy steps you can take to mitigate the risk. 
