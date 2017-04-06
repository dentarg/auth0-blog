---
layout: post
title: "How Identity Can Help You Create a Great User Onboarding"
description: "Identity management can be a tool that enhances your onboarding efforts to help you create great user onboarding experiences. Find out how."
date: 2017-04-10 8:30
category: Onboarding
author:
  name: "Ado Kukic"
  url: "https://twitter.com/kukicado"
  mail: "ado@auth0.com"
  avatar: "https://s.gravatar.com/avatar/99c4080f412ccf46b9b564db7f482907?s=200"
design:
  image: https://cdn.auth0.com/blog/how-identity-helps-user-onboarding/logo.png
  bg_color: "#8BA371"
related:
  - 2016-11-30-different-ways-to-implement-multifactor
  - 2015-12-17-json-web-token-signing-algorithms-overview
tags:
  - onboarding
  - user-experience
  - identity-management
---

User onboarding is not the most straightforward thing to build. You want to get people into the value of your product, and you want to appeal to them from their first interaction with your product. Do you use tooltips? How long is your first onboarding tour? Which features do you point out? 

In all of this, the role that login plays in your onboarding can become an afterthought. Who has time to develop identity management when there's an entire product tour to design and build?! 

If you're falling prey to that thinking, then you're missing out on a great way to upgrade your user onboarding. Identity management can be a tool that enhances your onboarding efforts to help you create great user onboarding — whether you want to create your first flow or your tenth.

## Nail the first step: actually signing customers up

One of the first interactions a customer has with a product is a login screen that asks them to sign up for an account. Since onboarding is about helping a user get to know your product and dig into its value, a signup that drives people away will negate even the best onboarding. 

![Auth0 Lock Widget](https://cdn.auth0.com/blog/how-identity-helps-user-onboarding/lock.png)

So you need signup that reduces friction and helps people get straight into your product. That's where social login comes in. Because users don't feel like they're making yet another account with yet another password, they are much more likely to sign up — social login has the ability to boost your conversion by up to [20%](https://www.quora.com/What-impact-does-social-login-have-on-conversion-rates), in fact. 

The benefits of social login don't end there, either. With [Auth0](https://auth0.com/docs/identityproviders), you can pull data from someone's social profile straight into their user profile, eliminating the need for people to fill in questions about their location and birthday. When someone signs up, they can get right into your product, and not get caught in a cumbersome signup that detracts from your product's first impression.

## Use login to customize your onboarding

Let's say you're an e-commerce platform. Single craftspeople with a small inventory are going to need and want different things from your product then that enterprise customer who ships hundreds of items a day. 

Onboarding experts, like the folks at [Chameleon](https://www.trychameleon.com/), suggest that these different personas should receive [custom user onboarding](https://www.trychameleon.com/blog/user-onboarding-more-than-first-user-experience). They say it's best to “identify specific user types within an application and present functionality that’s most relevant to them.” Only one catch — how do you know what type a user is when they sign up?

The answer: profile enrichment.

Profile enrichment is the process of adding publicly available information to a user's profile. With Auth0, you can automate this process at login with snippets of code called [Rules](https://auth0.com/docs/rules). Add a Rule to fetch information from a database like [Clearbit's]((https://clearbit.com/)), which taps into business information, and you can have profession and job titles as soon as users sign up.

![Clearbit](https://cdn.auth0.com/blog/how-identity-helps-user-onboarding/clearbit.png)

([source](https://clearbit.com/enrichment))

If your customer is part of a small business, you can then point them to your SMB flow. If they're enterprise, you might email them letting them know you're available for team onboarding sessions. 

These touches will help get users into your product's value, and show them how they can get exactly what they need out of your product. Between automated profile enrichment and the option to use tools like Chameleon that allow you to quickly build several onboarding flows, there's no reason not to customize at login.

## Ramp things up with login integrations

With a fully developed identity management system, the possibilities for integrations at login extend much further than profile enrichment. 

For example, Auth0 integrates with SalesForce. This means that you can institute a Rule that makes a new lead in SalesForce any time a new user logs in. If you have any personalized onboarding from your sales team, they'll be able to catch everyone that signs up for your product.

Another integration that might be particularly useful for onboarding is setting up a Rule to trigger an email either at first, second or third login. You could open with a welcome message, highlight a useful feature, or point to a help center early in the game to keep users engaged with your product, no matter how much of your onboarding they get through on any given login. 

You can use your preferred email service, or trigger emails at login [right from Auth0](https://auth0.com/docs/email/custom).

![Auth0 Email](https://cdn.auth0.com/blog/how-identity-helps-user-onboarding/auth0-email.png)

Whatever tools you want to use with your onboarding, there's a good chance you'll be able to find or write a Rule to get it done. The flexibility of an identity management system to easily interact with other platforms is key to using your onboarding to create great onboarding.

## Improving your onboarding, one step at a time

Obviously, taking advantage of your login isn't going to solve all your onboarding problems or single-handedly build you the best onboarding ever. But it is an easy way to focus your onboarding improvement to be more customized, and more appealing to users. 

Since login is the first thing that new users experience of your company, tackling it as the first step to making better onboarding is pragmatic. Starting with a robust, contemporary identity management platform will help you unlock all the ways identity can help you build great user onboarding.