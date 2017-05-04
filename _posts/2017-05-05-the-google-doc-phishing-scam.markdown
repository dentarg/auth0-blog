---
layout: post
title: "Google Docs Phishing Scam"
description: "Learn how the Google Docs Phishing Scam was penetrated and how it could have been avoided."
date: 2017-05-05 08:30
category: Hot Topics, Security
is_non-tech: true
author:
  name: "Prosper Otemuyiwa"
  url: "https://twitter.com/unicodeveloper"
  mail: "prosper.otemuyiwa@auth0.com"
  avatar: "https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200"
design:
  bg_color: "#222228"
  image: "https://cdn.auth0.com/blog/personal-info-security-guide/logo.png"
tags:
- Security
- Identity
- Guide
---

Two days ago, there was a large phishing scam that plagued the internet. It was a Google Doc Phishing attack penetrated via Gmail. On Wednesday, a worm in form of an email arrived in a lot of gmail user's inboxes from contacts they knew. The email stated that a Google Doc document had been shared with them.

![Email claiming a document had been shared](https://cdn2.auth0.com/blog/phishingscam/sharedwithme.png)
_Email claiming a document had been shared_

Once a user clicked the link to open the document, it immediately redirected the user to a Google account selection screen for authorization.

![Google Account Selection Screen](https://cdn2.auth0.com/blog/phishingscam/googleaccountselection.png)
_Google Account Selection Screen_

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Phishing (or malware) Google Doc links that appear to come from people you may know are going around. DELETE THE EMAIL. DON&#39;T CLICK. <a href="https://t.co/fSZcS7ljhu">pic.twitter.com/fSZcS7ljhu</a></p>&mdash; Zeynep Tufekci (@zeynep) <a href="https://twitter.com/zeynep/status/859840026082988038">May 3, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Once the user gives the fake app posing as *Google Docs* permission, it would have the ability to *read*, *send*, *delete* and *manage* your email. It would also be able to manage your accounts. These permissions allowed the worm to replicate itself by sending itself to all your contacts.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/zeynep">@zeynep</a> Just got this as well. Super sophisticated. <a href="https://t.co/l6c1ljSFIX">pic.twitter.com/l6c1ljSFIX</a></p>&mdash; Zach Latta (@zachlatta) <a href="https://twitter.com/zachlatta/status/859843151757955072">May 3, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

## Swift Combat Action From Google

Once Google got wind of this phishing scam, they swept into action by disabling the malicious accounts, removed fake pages and pushed updates through Safe Browsing to users within an hour. Highly commendable that Google nipped it in the bud early enough. 

![Google Action](https://cdn2.auth0.com/blog/phishingscam/reddit.png)
_Googlers taking charge_

## What to do if you granted Permission

If you already gave the fake *Google Docs* app permission, here is how to protect yourself.

1. Head over to [https://myaccount.google.com/permissions](https://myaccount.google.com/permissions).
2. Find the app named **Google Docs**.
3. Revoke the permission by clicking the **Remove** button.

## How to avoid Phishing Scams

Phishing scams have been around for a long time and they aren't going anywhere soon. Here are just a few tips to prevent you from falling victim to these scams.

1. **Look out for fake and forged Sites:** Verify that the site is secure by ensuring that the URL starts with https:// instead of http. Look out for typos in the site name and URL.
2. **Install an Anti-Phishing Toolbar:** You can install these toolbars on your Internet browsers. It checks the sites that you are visiting and compares them to lists of known phishing sites.
3. **Beware of Links and Attachments in your emails:** Before you click on a link in your email, hover on it, check if the link actually links to a legitimate secure site. Don't click on links that appear in random emails and instant messages.
4. **Regularly update your browser**.
5. **Beware of Pop ups**: Virtually all browsers allow you to block pop-ups, so you can set that as the default action. You can allow pop-ups sparingly when you actually need them.

## Conclusion

At Auth0, we are crazy about security. I hereby recommend this [personal information security identity guide for you, your friends and family](https://auth0.com/blog/personal-information-security-identity-guide). Take the time to go through this guide and protect yourself from cybercriminals and phishing scams.