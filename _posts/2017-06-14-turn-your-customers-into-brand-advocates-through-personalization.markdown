---
layout: post
title: "Turn Your Customers Into Brand Advocates Through Personalization"
description: "Brand advocates are your best and most authentic influencers — so how can you create more of them?"
date: 2017-06-14 8:30
category: Growth, Industries
author:
  name: Diego Poza
  url: https://twitter.com/diegopoza
  avatar: https://avatars3.githubusercontent.com/u/604869?v=3&s=200
  mail: diego.poza@auth0.com
design:
  bg_color: "#380962"
  image: https://cdn.auth0.com/blog/personalization/logo.png
tags:
- security
- retail
- customer
- vision
- auth0
related:
- 2016-09-22-yahoo-confirms-data-breach-of-half-a-billion-user-accounts
- 2016-08-16-how-real-state-companies-can-implement-open-id-connect-with-auth0
- 2017-02-08-is-multifactor-authentication-the-best-way-to-secure-your-accounts-myths-and-reality
---

Brand advocates are the holy grail of customers. They're a key part of growing your customer base because they love your product and encourage others to use it. Of course you wish every customer were a brand advocate.

So, can you better connect with *regular* customers to turn them into all-important brand advocates? Creating that valuable, personal connection to your brand is difficult. Especially today, when you're communicating across multiple channels, and trying to stitch together your customers' behaviors from in-store purchases to tweets.

Identity management is your secret weapon for this — it helps consolidate customer information so you can add that personal touch whenever people log in or stroll into a store and interact with your brand.

## Use social login to kickstart personalization

Login is the beginning of getting to know your customer. It's a great way to start collecting information about them that you can use to better their brand experience and personalize your interactions.

One of the easiest ways to do this is to use social login. Customers often want an easy login that doesn't require them to open yet another account with yet another username and password, and social removes that barrier for customers. It also streamlines their login after they create an account; if they are logged into the social network, they'll be able to log in with one click and no keystrokes at all.

In addition, shopping is a social experience, something that's replicated on a lot of eCommerce sites. Referral programs that use customer's social login to suggest sharing rewards with friends, and even allowing personalized gift wrapping and messages through websites speak to the social nature of shopping. If you have any social rewards or features, social login is the way to go.

![Social brand](https://cdn.auth0.com/blog/customers/socialbrand.png)

There's a lot more you can do on the back-end to kickstart your personalization as well. With Auth0, you can grab information from social login, like email, birthday and Facebook pages liked. You can use this across marketing efforts — those make for the start of a pretty good birthday coupon email, for example.

In this way, social login encourages a better relationship between brand and customer, especially when that customer might not get to step into a brick and mortar store with their friends and make connections with salespeople and products.

## Engage over time with progressive profiling

You want to build a relationship with your customers, and that means learning about them over time, it doesn't happen just because you ask a customer what they're like on day one. There's no way a customer would ever sit through a survey that asks everything you want to know about them, but they still want that personal touch.

That's where progressive profiling comes in. Progressive profiling is slowly nudging the customer over time and learning about their preferences, likes, dislikes. It's also about knowing when the right time to ask for information is. You want to identify when customers will share the information you need, which probably aligns with how much they've realized the value of your product.

Progressive profiling is easy when done by triggering questions at login. Maybe the first login you only take their basic information, but the third or fourth time they log in, you ask them where they work or what types of deals they'd like to see from you in their inbox.

![Progressive profiling](https://cdn.auth0.com/blog/customers/progressiveprofiling.png)

This will allow you to foster your relationship based on the personal information an individual consumer gives you. Maybe you're an online cosmetics retailer and you send a free sample with every purchase over $50. You can give different people different gifts, ones they'll actually want, based on what they tell you.

So, instead of sending everyone the same sample, you can send perfume samples to those who are interested in fragrance, and a hair mask to those who told you their concern was healthy hair.

Gathering personal information from a customer can lead to forging a more meaningful and valuable relationship between you and them. They are actually better served by your business, because you can cater to their individual needs. In turn, they'll be more likely to recommend and talk up your brand to others. And that's a cycle that can continue for their entire lifetime as a customer.

## Streamline your personalization with a single view of your customer

We've just discussed gathering information on customers to make their experience more personal. But where do you store that information, and who has access to it?

With Auth0, each user in your system has a centralized profile where information is stored. Their login history, the information from their social login, progressive profiling, and other information you collect can be stored in that profile, which gives you a 360-degree view of the customer. You can set access so that everyone who is interacting with customers has real-time access to that information.

This profile within Auth0 also helps maintain a single view of your customer in other ways:

* **Accounts are linked and centralized.** If a user has multiple social accounts that they log in with, or if they log in with social one time and email the next, Auth0 can link these accounts to a single, central profile. No more duplicate users will be lingering in your system.

* **Brand umbrella challenges are eased.** If a single retailer has multiple portals or different brands under the same umbrella, it can be a difficult task to centralize those to get one profile for every user. Using Auth0 across portals and brands takes some complexity out of matching profiles for different brands.

* **Cross-device use is streamlined.** Just as using Auth0 helps with keeping track of users across brands, using a sophisticated IAM helps consolidate users who log in across different devices. The same, centralized profile is able to consolidate no matter where users log in, or with what device.

## Better personalization with Auth0 Rules

That centralized profile is also the perfect way to take advantage of the true power of a robust identity management system like Auth0. With Auth0 in particular, it's a great way to take advantage of Auth0 Rules, snippets of code that you add to kick in things like grabbing information from a user's profile.

While you can write your own Rule to help your marketing efforts, you can also rely on a library of existing rules. Many of them can help with bolstering personalization efforts in marketing. A couple that highlight this focus are:

* **Adding demographic data to a user profile.** Using [this](https://auth0.com/rules/add-income) Rule, you can add median household income to your user profile based on the zip code of their IP address. Zip codes can open up a lot of possibilities for personalization, and this is a great one.

* **Using FullContact to enrich your profiles.** With [this](https://auth0.com/rules/get-FullContact-profile) Rule, you can enhance your users' profiles with data from FullContact using their email address. The data that's collected, for example, job title, is automatically added to your profiles.

By incorporating information with Rules, you can easily pull in what you need to personalize your interactions with customers. Best of all, it's zero friction for users, who don't have to answer questions or fill out surveys.

![Auth0 Rules](https://cdn.auth0.com/blog/customers/rules.png)

_Attributes you can add to a customer's profile using [Auth0 Rules](https://auth0.com/docs/rules)._

So, if a customer comes into the store and you've pulled their birthday from their Facebook, an associate can automatically apply a birthday month discount. Marketers can look at individuals, or overall trends to set up more effective campaigns. This single view of your customer helps that customer get the same, personal touch every and anytime they interact with your brand.

It strengthens your brand as a whole, and makes that customer feel like they're not just another number in your system that nobody pays attention to. When customers feel that they're being valued as an individual, they associate that with your brand and, in turn are more likely to go from customer to advocate.

## Encouraging brand advocacy

Making your best customers your brand advocates means fostering deep customer engagement. One of the best places to start fostering that engagement is by personalizing your interactions with customers.

The best way to get into that personalization is to capture all the information your customer is giving you and make that accessible for marketers, sales people, and anyone who could help the customer benefit through personalization. You're aiming to nurture your customer relationship over that user's lifetime. Paying attention to and asking them about their likes, dislikes, and habits is a key component of that.

This is a tough task, but using your identity management to track and store information takes what you already have, **login**, and turns it into a valuable tool for encouraging customers to become brand advocates.