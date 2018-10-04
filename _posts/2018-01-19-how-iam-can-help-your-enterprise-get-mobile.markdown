---
layout: post
title: "How IAM Can Help Your Enterprise Get Mobile"
description: "Give your employees flexibility without compromising security"
long_description: Workers want mobility and flexibility, but this implies stronger security for mobile devices. You need a sophisticated Identity and Access Management system like Auth0 with features such as automatic log out, multifactor authentication and the ability to immediately scale to the enterprise.
date: 2018-01-19 09:41
category: Growth, Identity
author:
  name: Martin Gontovnikas
  url: http://twitter.com/mgonto
  mail: gonto@auth0.com
  avatar: https://www.gravatar.com/avatar/df6c864847fba9687d962cb80b482764??s=60
is_non-tech: true
design:
  bg_color: "#4A4A4A"
  image: "https://cdn.auth0.com/blog/iam-mobile/logo.png"
tags:
- identity
- management
- mobile
- millennials
- multifactor-authentication
- security
- mobile-security
- remote
related:
- 2017-12-15-why-your-iam-definition-of-user-could-be-costing-you-millions
- 2017-12-29-why-every-business-needs-two-factor-authentication-security
- 2017-12-04-ten-mobile-security-threats-and-what-you-can-do-to-fight-back
---

Workers want mobility and flexibility and you want to give it to them. Young people, especially, have heard the siren song of flex time, and they've [made it a priority](https://www.forbes.com/sites/katetaylor/2013/08/23/why-millennials-are-ending-the-9-to-5/#1c17d54f715d) in their job search.

Even traditional workplaces are being liberated by technology to allow work to be done outside of the office — you no longer have to be a startup to have employees asking for [remote opportunities](http://money.cnn.com/2017/06/21/pf/jobs/working-from-home/index.html), or the option to stay at home when the mood strikes.

So yes, you want to keep workers happy and be attractive to the best and the brightest of the new generation in the workforce. But you also need security, which gets harder the more your employees move around and portable devices they use. Public wifi? Work computers that leave the office? Workers traveling with a personal *and* work cell phone — it's a security nightmare.

{% include tweet_quote.html quote_text="Millenials are ending the 9am to 5pm but this don't need to be a security issue." %}

Here's how you can give employees what they want *and* stay secure to the highest available standards.

## Outsource your security management

One of the most important things you can do to enable good security for your mobile workforce is [outsource your security](https://auth0.com/blog/5-reasons-your-company-needs-identity-and-access-management/). Your enterprise company has enough on its plate without adding a robust in-house identity management system to the mix.

Let's say you did set aside engineers to work on your IAM (Identity and Access Management), months to complete the project, and the money it takes to get your security fully functional. You'd still have to:

* Stay up to date on the latest security protocol, and make changes as necessary to continually keep your IAM at the cutting edge.
* Monitor and support your security system 24/7 to ensure that there's always a responder in the event of an emergency.
* Scale immediately to encompass the needs and numbers of your entire organization, and be able to keep pace with scaling up or down as your company needs.
* Add features as new identity management is developed and allows for easier use of biotech, etc.
* Maintain the entire system to make sure that all of it is always functioning optimally.

It's not easy to build and support your own identity management system when you *need* the best possible security but aren't service built to make it. That's why sophisticated IAM systems like [Auth0](https://auth0.com) exist. They can immediately scale to the enterprise. They'll have the features you need to keep your mobile workforce secure.

And they're backed up by experts who spend each and every day thinking about nothing else but how to keep you safe.

## Automate log out

Especially when employees are using mobile devices for work, triggering an automatic log out after a certain period of inactivity for any of your work systems is a must. If a work tablet gets left in a coffee shop or in a hotel on a work trip, there's an automatic layer of protection when no accounts have active sessions on a device. You can set up these [automated logouts](https://auth0.com/docs/logout) with your IAM of choice to kick employees out of your systems.

You should also force employees to use some form of authentication every time they want to access sensitive information. Employees might be able to log into their email and project tools and stay logged in without a problem. But even if they're still logged into your system, they shouldn't be able to access sensitive documents without logging in every time:

![Employees should log in every time](https://cdn.auth0.com/blog/iam-mobile.png)

*Depending on the system function, you may want your users to be able to access it without logging in anew every time. For others, you'll want to verify their identity each and every time.*

This complicates your identity management setup. Instead of just making sure the whole system is secure, you're now trying to enact different protocols for different items, which takes more time and energy to deploy. Still, you want to structure your internal systems to protect what is most sensitive without roadblocking employees who don't want to log in *every single time* they do anything at work.

Identity management can help you add this protective layering automatically, without the hassle. This will help your employees get work done wherever they are, but put up your best defenses for your most sensitive data.

## Partition users to protect data

When you're an enterprise company with employees at all levels working in the same system, it's important that you can identify each individual and their unique permissions. Interns don't need to see everything that your CFO does, and it's likely that you're going to need to partition users regardless of how mobile your employees are.

Here's an example of how much company sales and marketing information various members of a sales department might need, with Head of Sales having access to everything, and the rest of sales working off of slightly less:

![How much information different members of save have access to.](https://cdn.auth0.com/blog/iam-mobile/information-access-per-role.png)

It may not always be the case that the information that people don't need access to for their job is highly sensitive. Still, if you give everyone the same permissions as Head of Sales, you are needlessly putting that extra information at risk.

This is especially important when employees are taking work devices with them to get work done in their own space and time. Restricting access to tools and systems means you're also protecting yourself in case one person has their account compromised — instead of getting carte blanche access to everything, you're keeping at least some of your information safe.

Auth0's system is perfectly poised to help enact this partitioning because it keeps each user stored with a [unique profile](https://auth0.com/docs/user-profile). Each user holds unique attributes, so different users can be treated in different ways, which boosts your ability to restrict access through your IAM.

## Multifactor Authentication

The world is a-buzz with companies trying to get their users to enable [multifactor authentication](https://auth0.com/docs/multifactor-authentication) (MFA), and with good reason. MFA can help you safeguard your accounts from all sorts of threats by requiring that users submit multiple forms of proof that they are who they say they are when they try to login. You'll often see MFA implemented with a code that's sent to your mobile phone that you must enter alongside your username and password, for example.

This means that even if a computer is stolen, or someone gets the password for an account — two things that become much more likely with a workforce on the move — data remains secure because there's another layer of security added.

If you're trying to implement MFA yourself, you're tacking on extra time, energy and upkeep; robust IAM systems will have multiple forms of MFA ready for you so you can choose what works best for your business. Auth0, for example, offers MFA with SMS, one-time password services and push notification through our Guardian app, [among others](https://auth0.com/docs/multifactor-authentication).  

You can also use MFA to add that extra layer of security where you want it, but not for everything. The Guardian app allows you to trigger MFA for some but not all of your requests. Want access to sensitive data? You'll need to authenticate with your Guardian app. Just want to log in for the day? You're free to go.

![The Guardian app allows you to trigger MFA for some but not all of your request](https://cdn.auth0.com/blog/iam-mobile/step-up-flow.png)

(*An example of the Guardian app's capability on Fabrikam Intranet's system, where anyone can sign in without MFA, but a push notification is triggered when users try to access the employees page.* | [Source](https://auth0.com/docs/multifactor-authentication/developer/step-up-with-acr))

## Refresh (and enforce) good personal habits

Make sure your employees know the best habits to use when dealing with security. A good personal refresher is *[How Not To Get Your Identity Stolen](https://auth0.com/blog/how-to-not-get-your-identity-stolen/)*, which lays out some common sense advice to keep yourself secure online. While not everything is directly applicable to work, some of the most salient points that translate to the workplace are:

* Don't use unsecured public internet connections
* Set up a password for your home wifi network, especially if you're working from home
* Don't use shared device to access sensitive material
* Always sign out of your accounts when your session is done

These are easy, no-nonsense tips, but they often fall through the cracks, especially when workers are more frequently on the move or are working from home. Refreshing common sense security protocol regularly is important.

Some suggestions you can help enforce internally. Forcing sign out, as we've seen, is something that you can automatically initiate rather than relying on employees to remember. Wherever you can nudge along good behavior lessens the risk of having a security breach. After all, employee error accounts for [2/3](https://www.foley.com/employee-error-accounts-for-most-security-breaches-06-07-2016/) of security breaches.

## Don't compromise for anyone

You simply cannot leave your company's digital security up to chance. The best way to protect your identity data, especially in today's mobile environment, is to set yourself up for success by turning to experts in identity management.

Then, you need to foster a culture of safe cyber habits to keep everything that needs to say internal, internal.

With these plans in the books, you can offer flex time or remote opportunities to your workers' desire.
