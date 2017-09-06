---
layout: post
title: "Why You Should Not Manage Your Users' Identities"
description: "The risk far outweighs the reward if you aren't an identity management specialist"
date: 2017-09-06 19:48
category: Technical Guide, Security
author:
  name: Diego Poza
  url: https://twitter.com/diegopoza
  avatar: https://avatars3.githubusercontent.com/u/604869?v=3&s=200
  mail: diego.poza@auth0.com
design:
  bg_color: "#A46748"
  image: "https://cdn.auth0.com/blog/dont-manage-identities/logo.png"
tags:
- identity
- management
- build
- buy
related:
- 2017-08-11-how-identity-can-help-you-create-a-great-user-onboarding
- 2017-07-21-the-role-of-identity-in-application-modernization
- 2017-04-05-when-to-build-and-when-to-buy
---

When it comes time to add a login system to your product, it seems like a pretty easy feature to fit in. After all, you're building an entire product, you can surely handle building a way to create a username and password system. It wouldn't even take that long to add Facebook login!

This is exactly the kind of thinking that can get startups into trouble. By the time you figure out how difficult identity management is to build from scratch, you'll have wasted countless hours on it. Not to mention, anything you put in place is unlikely to properly secure your users data.

There's a lot of reasons why you probably won't get identity management right in house. At the end of the day, if you don't have a team of identity management specialists, building your own IAM is not just a steep, uphill climb—it's a sure path to an insecure product.

## Building identity management is harder than you think

An identity management system is no easy build. Right off the bat, the number of different systems you have to integrate can be difficult. It might be the case that your product is simple internally, but that doesn't get you out of the complexity that integrations with systems like social login or biometric login can bring you.

And even if you used streamlined stacks internally, you'd still be facing the need to incorporate proper form validation, some kind of parser to handle potentially damaging user input, and other preventative measures.

We've come far enough to have a variety of options, from passwordless login, to multifactor authentication, to mobile verification and people expect the best and most secure options for each.

![Multifactor authentication with Auth0](https://cdn.auth0.com/blog/dont-manage-identities/Auth0_Guardian_-_Auth0-2.png)

That means that you'll have to build more than just a username and password box.

If all of that weren't enough to dissuade you, that's only for the initial build. Every time you want to add another layer of security or if you want to change a login option, that means more coding. Your engineers will have more on their plate each time they bring your identity management up to scale with a just-released security protocol. When a new bug gets patched, when an API gets changed, when a vulnerability is disclosed—your engineers will need to stop whatever they're doing and fix your identity management system.

Yes, we've only skimmed the surface of each of these aspects of identity management, but it's no stretch to say that what looked like it was going to eat a small chunk of time just became weeks out of your calendar.

## The stakes for identity management are high

There's a lot on the line when you decide to jump into IAM. Whether you're trying to reach a niche market or sell to huge corporations, getting identity management wrong can cost you.

* **Customer trust.** If you don't take every precaution to bolster your login with the best security procedures, you're putting your customers at risk of being hacked. Although you can [prepare for handling a breach](https://auth0.com/blog/data-breach-response-planning-for-startups/), the best way to keep your reputation in tact and your customers safe is to have a constantly updated system that uses only the best security practices. Availability is also at stake. If login isn't scalable and reliable and sees downtime, you'll see customers churn simply because of an erosion of trust.
* **Enterprise deals.** Frequently, enterprise customers require different treatment than other, smaller customers. For your business, that might mean a special sales rep or [enterprise pricing](http://blog.profitwell.com/how-accurate-is-your-revenue-recognition). For your identity management, that means being able to cater to whatever [enterprise identity management](https://auth0.com/blog/how-enterprise-federation-helps-shorten-the-sales-cycle/) and security protocols they have in place. If that means Active Directory for one customer and SAML for another, you've got to work with both or you won't be able to close both deals—at least not without a lot of work by your developers.

![Easily manage identity with Auth0](https://cdn.auth0.com/blog/dont-manage-identities/Enterprise_Identity_Management_-_Auth0.png)

* **New users.** Not only will users be wary of signing up if you've had a hack, they also might not want to sign up if your only login option is a clumsy username and password. A clean, clear login with a single sign-on or a social or biometric option can [raise your conversion rates](https://auth0.com/blog/bad-login-experiences/).

Implementing proper security, catering to all different shapes and sizes of customers, and optimizing your login for conversions are not easy things to do, but they hold a real implication for the future of your business.  

## Outsource for expertise

It's rare that all your problems can go away with one simple solution, but identity management is about as close as you can get. When you decide to outsource your IAM to Auth0, you get the full weight of a team of identity experts behind your every move.

That takes a load off your shoulders when you're looking at securing sensitive data and implementing a variety of login options. It means that you'll be able to respond faster to a hack, if one ever comes your way. It also means that you'll be able to focus your team on building out your business's core application value—not trying to become experts in security:

![Outsource identity management](https://cdn.auth0.com/blog/dont-manage-identities/Enterprise_Identity_Management_-_Auth0-2.png)

If you're looking for a variety of login options, from social to enterprise federation, Auth0 can help you integrate with no heavy lifting for your engineers. From your dashboard, you can choose to enable a variety of login options — even things like multi-factor authentication are easy to implement.

When you have a scale challenge or want to set up your own integrations with your login, Auth0 can help you do that, too.

## Don't gamble with login

Your login is simply too important to mess with. As your business grows and login continues to develop, the best way to stay on top of optimizing your login isn't to build it yourself. It might seem scary to turn a part of your business over to another entity, but think of it this way: let your engineers focus on what they're experts at—building your product—and let security experts deal with security.
