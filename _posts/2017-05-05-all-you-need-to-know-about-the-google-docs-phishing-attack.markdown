---
layout: post
title: "All You Need To Know About The Google Docs Phishing Attack"
description: "Learn how the Google Docs Phishing Scam was perpetrated and how it could have been avoided."
date: 2017-05-05 08:30
category: Hot Topics, Security
author:
  name: "Prosper Otemuyiwa"
  url: "https://twitter.com/unicodeveloper"
  mail: "prosper.otemuyiwa@auth0.com"
  avatar: "https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200"
design:
  bg_color: "#1564C0"
  image: "https://cdn2.auth0.com/blog/phishing/attacklogo.png"
tags:
- Security
- Identity
- Guide
---

Two days ago, there was a large phishing scam that plagued the internet. It was a *Google Doc* phishing attack perpetrated via Gmail. On Wednesday, a worm in the form of an email arrived in a lot of Gmail users' inboxes from contacts they knew. The email stated that a Google Doc document had been shared with them.

![Email claiming a document had been shared](https://cdn2.auth0.com/blog/phishingscam/sharedwithme.png)
_Email claiming a document had been shared_

If the user clicked the link to open the document, it immediately redirected the user to a Google account selection screen for authorization.

![Google Account Selection Screen](https://cdn2.auth0.com/blog/phishingscam/googleaccountselection.png)
_Google Account Selection Screen_

---

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Phishing (or malware) Google Doc links that appear to come from people you may know are going around. DELETE THE EMAIL. DON&#39;T CLICK. <a href="https://t.co/fSZcS7ljhu">pic.twitter.com/fSZcS7ljhu</a></p>&mdash; Zeynep Tufekci (@zeynep) <a href="https://twitter.com/zeynep/status/859840026082988038">May 3, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

If the user gave the fake app posing as *Google Docs* permission, it had the ability to *read*, *send*, *delete* and *manage* your email. It also had the ability to manage your accounts. These permissions allowed the worm to replicate itself by sending itself to all your contacts.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/zeynep">@zeynep</a> Just got this as well. Super sophisticated. <a href="https://t.co/l6c1ljSFIX">pic.twitter.com/l6c1ljSFIX</a></p>&mdash; Zach Latta (@zachlatta) <a href="https://twitter.com/zachlatta/status/859843151757955072">May 3, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

---

## Swift Combat Action From Google

Once Google got wind of this phishing scam, they swept into action by disabling the malicious accounts, removed fake pages and pushed updates through Safe Browsing to users within an hour. It is highly commendable that Google nipped it in the bud early enough. 

![Google Action](https://cdn2.auth0.com/blog/phishingscam/reddit.png)
_Googlers taking charge_

## What to Do if You Granted Permission

If you already gave the fake *Google Docs* app permission, here is how to protect yourself.

1. Head over to [https://myaccount.google.com/permissions](https://myaccount.google.com/permissions).
2. Find the app named **Google Docs**.
3. Revoke the permission by clicking the **Remove** button.

## How to Avoid Phishing Scams

Phishing scams have been around for a long time and they aren't going anywhere soon. Just last year, there was a case of a hacker who [stole nude pictures from celebrities](http://www.bbc.com/news/technology-36702837) via a phishing scam that targeted iCloud accounts. 

Here are a few tips to help you avoid falling victim to these scams.

1. **Look out for fake and forged Sites:** Verify that the site is secure by ensuring that the URL starts with https:// instead of http. Look out for typos in the site name and URL.
2. **Install an anti-phishing toolbar:** You can install these toolbars on your Internet browsers. They check the sites that you are visiting and compares them to lists of known phishing sites.
3. **Beware of links and attachments in your emails:** Before you click on a link in your email, hover over it and check if the link actually links to a legitimate secure site. Don't click on links that appear in random emails and instant messages.
4. **Regularly update your browser**.
5. **Beware of pop ups**: Virtually all browsers allow you to block pop-ups, so you can set that as the default action. You can allow pop-ups sparingly when you actually need them.

## Aside: Implementing API Authorization with Auth0 

Auth0 is a [certified OpenID Connect (OIDC) provider](http://openid.net/certification). One of the features we provide is [API Authentication and Authorization](https://auth0.com/docs/api-auth). Auth0's API authorization features allow you to manage the authorization requirements for server-to-server and client-to-server applications. If you want to use Auth0 authentication to authorize _API requests_, note that you'll need to use [a different flow depending on your use case](https://auth0.com/docs/api-auth/which-oauth-flow-to-use).

In addition, our *ODIC Conformant Authentication* pipeline allows you to create third-party clients for your APIs and display consent dialogs for authorization.

If a user is authenticating through a third-party client and is requesting authorization to access the user's information or perform some action at an API on their behalf, they will see a consent dialog like so: 

![Consent Dialog](https://cdn2.auth0.com/docs/media/articles/hosted-pages/consent-dialog.png)
_Consent Dialog_

If the user chooses to allow the application, this will create a user grant which represents this user's consent to this combination of client, resource server and scopes. The client application will then receive a successful authentication response from Auth0. However, if a user decides to reject consent to the application, they will be redirected to the `redirect_uri` specified in the request with an `access_denied` error like so:

```bash

HTTP/1.1 302 Found
Location: https://fabrikam.com/contoso_social#
    error=access_denied
    &state=...

```

## Conclusion

At Auth0, we are crazy about security. I hereby recommend this [personal information security identity guide for you, your friends and family](https://auth0.com/blog/personal-information-security-identity-guide). Take the time to go through this guide and protect yourself from cybercriminals and phishing scams.
