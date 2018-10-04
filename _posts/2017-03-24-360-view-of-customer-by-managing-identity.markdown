---
layout: post
title: "How To Get A 360 View of Your Customer By Managing Identity"
description: "Get inside your customers' heads by centralizing your data."
date: 2017-03-24 8:30
category: Growth, B2C
is_non-tech: true
author:
  name: Diego Poza
  url: https://twitter.com/diegopoza
  avatar: https://avatars3.githubusercontent.com/u/604869?v=3&s=200
  mail: diego.poza@auth0.com
design:
  image: https://cdn.auth0.com/blog/360-view-by-identity/managing-identity-logo.png
  bg_color: "#4a4a4a"
tags:
- identity
- federation
- enterprise
- sales
- identity
related:
- auth0-lock-is-here-for-b2b-and-b2c
- customer-data-is-king-four-ways-to-know-your-customers-better
- growth-hacking-is-dead-long-live-growth-hacking
---

---

Having a 360 view of your customers might sound like just another marketing cliche designed to sell CRM software. But the idea—that you should have a comprehensive understanding of your customers at all stages of the lifecycle, from acquisition to referral, is essentially the holy grail of all growth marketing efforts.

> Auth0 can help B2C companies to enrich the profile of their customers through an easy to use [Modern Customer Identity Management solution](https://auth0.com/b2c-customer-identity-management). Increase brand loyalty with better conversion, boost your revenue with new user acquisition, and secure customer identity with state-of-the-art technology.

Back in the early days of apps and the internet, a 360 view was easier to acquire. User identities were simply more consolidated. You didn't have dozens of SaaS tools running off the cloud, your users' identities weren't dispersed across Google, Facebook, and every other social platform —  all your users' data was stored in your own system. You were in charge.

Those days are gone. The landscape is fragmented by all different kinds of identity providers, authentication protocols, and tools.

What you have instead is a vast explosion of user data and tools for analyzing that data. That's made getting a 360 view of your customers more technically complicated—but it's also made it far more powerful.

## Your Identity Management System Needs a Single Source of Truth

The biggest roadblock to getting a 360 view of your users is how identity is managed. The complexity begins when a user signs up for your app and it expands entropically as they use it. Your different SaaS tools and monitoring systems collect all of this information, send it back to their servers, and then you wind up fighting with their APIs and integrations to make sense of all of it.

That's why the best analytics teams begin the process of collecting data at the root—when a user first signs up for an app.

The easiest way to do that is to set up a classic 1:1 authentication system. You control user registration and login, you manage their passwords, and you are the only entity that is involved. Therefore, you have total access to your users' data and the data of any external APIs you might integrate with.   

What makes this tricky today is that federated identity management is such an established practice. You want to be enabling social and enterprise login if you have an app of any size, or a new app that you want people to feel comfortable using. Federated identity managers are simply not based on a centralized model—consolidating your customer view into one place will involve a ton of development time and effort.

That's why we built [Auth0](https://auth0.com), an identity provider that acts as both a classical identity provider and a federated identity manager.

![Auth0 Value Prop](https://cdn.auth0.com/blog/360-view-by-identity/venndiagram.jpg)

This allows you create the foundations on which to start building and acting upon your 360 view of your customer:

* **Classic identity management**:
    * **Auth0**:
        * stores login credentials for every unique user
        * provides user information on an analytics dashboard
        * manages all of the users in your organization, no matter what they used to log in

* **Federated identity management:**
    * **Social login**: User and password from Facebook, Google, Twitter, etc. serve as login information for connection to the desired platform through Auth0
    ![Auth0 Providers](https://cdn.auth0.com/blog/360-view-by-identity/auth0-social-login.jpeg)
    * **Enterprise login**: Enterprise credentials are used to access a variety of systems and platforms, where the username and login are stored in an internal identity provider but connected through Auth0

> Auth0 provides the simplest and easiest to use [user interface tools to help administrators manage user identities](https://auth0.com/user-management) including password resets, creating and provisioning, blocking and deleting users.

This type of data collection means that you can connect user information that would otherwise be stored in completely separate places — maybe data that isn't even collected directly by your app. Putting the missing pieces in your user profile for a 360 view gives you what you need to customize your user interaction, from onboarding to upselling.

## Automate the Error Out of Your Data Centralization

Within your own system, you use a variety of tools to help you monitor and engage with users. Maybe you have an app analytics platform to gather behavioral data, an email management system to send personalized emails, a CRM, and a login platform like Auth0. These systems tend to rely on client-side analytics, which makes the perfect storm for data to slip through the cracks.

Client-side analytics are notoriously unreliable. Because they have to be executed on the user's end when they first visit your site, they can easily be disrupted:

* Users might exit out of a page before your code runs
* They could block JavaScript (with an ad blocker, for instance)
* They might click on a link before the page has finished loading and interrupt the loading script

Meanwhile, server-side analytics are unwieldy and difficult to implement. In order to get all of your desired server-side analytics running with your system, you'll end up running through a web of APIs and [writing more and more code](https://segment.com/blog/the-way-server-side-analytics-should-be/) just to get everything working smoothly.

That's where Auth0 Rules come in. Rules are snippets of server-side Javascript that run as soon as a user logs in, eliminating the client-side reliability problem while being just as easy to set up and get going.

![Auth0 Identity Flow](https://cdn.auth0.com/blog/360-view-by-identity/flow.png)

With [Auth0 Rules](https://auth0.com/docs/rules), your server-side automation always gets information from your user to your tools. For example, if you wanted to create a lead in Salesforce the first time a user logs in, you can [use an Auth0 Rule to instantly send] (https://github.com/auth0/rules/blob/master/rules/creates-lead-salesforce.md) the signal to Salesforce to make a new lead.

In fact, you can connect Auth0 with pretty much any platform by creating automated actions at sign in using JavaScript. And they're just a few lines of code — not a forest of API integrations.

You need to know that your tools are going to get the data they need to help you understand how your customers are behaving, and automating a cross-platform integration ensures that you [realize the power of all of your SaaS platforms](https://auth0.com/blog/integrate-auth0-into-your-existing-saas-tools/).

## Use Your Centralized Data to Cater to Your Customers

A rich, 360 view of your customers is a springboard for fine-tuning your product to increase customer satisfaction. The way you interact with your users  from login onwards can make or break whether or not you retain those customers, no matter how good your product is.

When you're unable to consolidate all the information that you know about your customers, you can easily wind up asking them the same questions twice. Getting information about who your customers really are turns into a slow and error-prone process. When you have a centralized repository of knowledge about your users and a reliable infrastructure for gathering data on them, however, you can put much more effective and subtle collection practices into place.

A great example of this is [progressive profiling](https://auth0.com/blog/progressive-profiling/). You want to ask your users questions about who they are and why they're using your product, but you know that slamming your users with a huge form as soon as they sign up kills your conversion rates. With Auth0, you can create a Rule that triggers every time your users log in. You can ask them questions intermittently—throughout their customer journey—rather than giving them a huge survey up-front.

![Progressive Profiling](https://cdn.auth0.com/blog/360-view-by-identity/progressive-profiling-2.png)

Auth0 helps you store all of this information through creating profile records. You can gather information from an existing identity (like a Facebook profile), an Auth0 Rule, or information the user adds to their profile. Each users' profile record will get updated as data rolls in, to keep all of that valuable information accessible.


Capturing and centralizing log in information is a great way to make your users' experience better, especially when it is part of a larger customer profile. When the user experience is good, your customers are satisfied, and there's nothing better for business than satisfied customers.

## Aside: Securing Applications with Auth0

Are you building a [B2C](https://auth0.com/b2c-customer-identity-management), [B2B](https://auth0.com/b2b-enterprise-identity-management), or [B2E](https://auth0.com/b2e-identity-management-for-employees) tool? Auth0, can help you focus on what matters the most to you, the special features of your product. [Auth0](https://auth0.com/) can help you make your product secure with state-of-the-art features like [passwordless](https://auth0.com/passwordless), [breached password surveillance](https://auth0.com/breached-passwords), and [multifactor authentication](https://auth0.com/multifactor-authentication).

[We offer a generous **free tier**](https://auth0.com/pricing) to get started with modern authentication.

## To Delight, You Must First Understand

Creating a complete profile for your customer is one of the most important steps you can take to turn your users' actions into insights.

Think of all the bad email marketing campaigns you've deleted from your inbox, or marked as spam. Think of all the irrelevant push notifications you've gotten. Think of all the products you've downloaded with high hopes only to see an onboarding process that seems like it wasn't designed with *anyone in mind.*

When you centralize your data collection and build up the right infrastructure around it—the kind that lets everyone on your team get on the same page—then you become capable of building truly personalized, delightful experiences across every part of your app.
