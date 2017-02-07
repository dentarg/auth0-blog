---
layout: post
title: "Social Login On The Rise: How Secure Is It?"
description: "Find out if social login is really all it's hyped up to be."
date: 2017-02-10 8:30
category: Marketing
author:
  name: Martin Gontovnikas
  url: http://twitter.com/mgonto
  mail: gonto@auth0.com
  avatar: https://www.gravatar.com/avatar/df6c864847fba9687d962cb80b482764??s=60
design:
  image: https://cdn.auth0.com/blog/ga/budgetlogo.png
  bg_color: "#00715A"
tags:
- identity
- social-login
- security
- social-connections
related:
- auth0-lock-is-here-for-b2b-and-b2c
- customer-data-is-king-four-ways-to-know-your-customers-better
- growth-hacking-is-dead-long-live-growth-hacking
---

The popularity of social login is on the [rise](https://auth0.com/blog/analysis-of-social-connection-data/).

For users, it provides a seamless, frictionless way to login to the sites and apps that they use most frequently. 

For developers, it provides a way to quickly implement a secure signup and login system—and creates tons of opportunities for [personalization of the user experience](https://auth0.com/blog/how-to-use-social-login-to-drive-your-apps-growth/).

This seemingly win-win scenario can smell a little suspicious—is social login too good to be true? More to the point, is it really as **secure** as everyone thinks?

The answer is yes: social login really is secure. But even the most secure method of authentication is still liable to user error and risk.

## Social Identity Providers Give You Peace of Mind

One of the biggest value propositions of social login is also the reason that it really *is* as secure as you think it is: Google, Facebook, LinkedIn and others have millions of users.

With these three social login options you could give the vast majority of your user base a social option for logging into your app. The more popular the site, [the more popular](https://auth0.com/blog/analysis-of-social-connection-data/) the social login integration.

![Social Connections Growth](https://cdn.auth0.com/blog/social-login-on-the-rise/social-connections-usage.png)

Because of all those users, companies of that size also have a ton to lose in the event of a password breach, and they employ some of the world's top security experts to make sure that never happens. 

Smaller sites just don't have the same kinds of incentives pushing them to put security first. Sometimes even well-known sites, like [Gawker](http://www.pcmag.com/article2/0,2817,2484486,00.asp), just aren't thinking that someone would try and compromise their users' information. That's largely because they don't face the same kind of public cataclysm that a Google or a Facebook would face in the same kind of situation. 

When holes in the security systems of larger, more well-known sites are discovered, they do tend to make the news—which can easily bias you to think that they're insecure. The truth is that these incidents are almost always the results of white hat hackers exposing flaws for the purpose of bolstering their reputations or collecting on lucrative [bug bounties](https://www.facebook.com/whitehat). 

## Password Reuse is Still a Problem

The one major flaw with social login, if we're pragmatic about how users really behave, is password reuse. 59% of people have reported using the same password [across multiple sites](http://betanews.com/2015/07/30/59-percent-of-consumers-reuse-passwords/). That makes their accounts significantly more vulnerable, because a breach anywhere can lead to multiple compromised accounts. 

This problem gets worse when you're talking about a social account linked to many different apps and sites. If you use the same password across different sites, and your password is hacked on a site that takes security less seriously, attackers could gain access to your main social media account. If you're using that account to log in elsewhere, you could suddenly have a huge problem on your hands.

Back in 2011, when the service Trapster was hacked, [that's exactly what happened](https://www.troyhunt.com/only-secure-password-is-one-you-cant/) to its users—and not just current ones. Some people had tried Trapster years prior, deleted the app, and Trapster was still storing their passwords.

![Account Hacked Tweet](https://cdn.auth0.com/blog/social-login-on-the-rise/10701069image2.png)

The lesson here is that if you're using social login, you should absolutely make sure that the password you're using for your Google/Facebook/etc. account is unique from all the other passwords you use. 

Better yet, implement multifactor authentication on that account. Most people don't want to have MFA on every single account that they have across the internet, but if it's at least implemented on your main Google or Facebook account, then you have a higher bar of security on the one site or app where you need it the most—you'll have the best annoyance:value ratio that you can get. 

## Privacy Settings Need to be Monitored

Social login gives app developers great opportunities to personalize the user experience and leverage [mobile analytics](https://amplitude.com/mobile-analytics) for growth. But all that power has to come in balance with users' needs for privacy.

When you permit one of these platforms to act as your identity provider on other sites, they're accessing your personal data and giving other apps access to that personal data. Staying on top of the permissions you're giving out is good security practice—as many learned in 2016 when Niantic's Pokemon GO requested (and received) full access to [their Google accounts](https://auth0.com/blog/pokemon-go-catches-all-your-data/).

Google offers a [dashboard](https://security.google.com/settings/security/permissions?pli=1) to remove apps connected to your account, though you can't refine permissions—only block apps out completely.

![Google Social Settings](https://cdn.auth0.com/blog/social-login-on-the-rise/google-settings.png)

With Facebook, you have some more flexibility about the kind of information that you want apps to be able to access. Scroll down on the Settings → Apps page and you can specify on a granular level what you want other developers to be able to pull from your profile:

![Facebook Social Settings](https://cdn.auth0.com/blog/social-login-on-the-rise/facebook-settings.png)

You can do this on an individual basis the moment you choose to sign up for a site through your Facebook login.

![Social Login with Indeed](https://cdn.auth0.com/blog/social-login-on-the-rise/sign-in-indeed.png)

![Social Settings with Indeed](https://cdn.auth0.com/blog/social-login-on-the-rise/login-with-facebook-settings-indeed.png)

![Social Settings with Indeed](https://cdn.auth0.com/blog/social-login-on-the-rise/login-with-facebook-settings-indeed-2.png)

The best way to know what you're giving up to the different apps you use is simply being vigilant when you sign up for a new service. Inspect the permissions that you're granting, and if anything looks really off, reconsider whether you need this particular tool. No app should be asking for full access to your Google account, as Niantic did. Doing so puts your sensitive personal information in the hands of a service you know little about.

## How Auth0 Can Help Securely Implement Social Login

In the end, social login is only as secure as your implementation of it. Auth0 has a wide range of SDKs to make it easy to get social login working with a wide range of providers, as well as a fully extensible system for creating custom social connections with [any OAuth2 provider](https://manage.auth0.com/#/extensions).

![Auth0 Social Identity Providers](https://cdn.auth0.com/blog/social-login-on-the-rise/providers.png)

Setting up social login in Auth0 is easy:

1. In your Management Dashboard, navigate to Connections and then Social.
2. Find the social provider you want to use and hit the toggle.
3. Select your application where you want to use the provider.
4. Select the attributes and permissions you want to get from the provider, and hit save.

What are you waiting for? [Check it out today](https://auth0.com/) 😄
