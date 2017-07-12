---
layout: post
title: "How to Build Documentation That Will Drive Sales"
description: "Your API documentation can make or break a sale. Learn how to unleash its full potential."
date: 2017-07-12 8:30
category: Growth, Industries, Retail
author:
  name: Diego Poza
  url: https://twitter.com/diegopoza
  avatar: https://avatars3.githubusercontent.com/u/604869?v=3&s=200
  mail: diego.poza@auth0.com
design:
  bg_color: "#4A4A4A"
  image: https://cdn.auth0.com/blog/blog-logo/brand-advocate.png
tags:
- retail
- security
- retail
- customer
- vision
- auth0
related:
- 2017-06-19-how-to-keep-up-with-hyperconnected-consumers
- 2016-04-18-progressive-profiling
- 2017-05-26-go-beyond-username-password-with-modern-auth
---

The whole point of APIs is to save developers time.

Developers don't need to reinvent the wheel on mapping, or payments, or secure authentication because they can just plug into APIs that will take care of all of these issues.

To sell your API, you need to prove that it is the amazing shortcut developers have been looking for.

When your API's documentation is clunky, slow, and difficult to use, it's going to be hard to make that narrative work. There are a lot of APIs out there—not giving your users a clear path to what they want is a good way to drive them elsewhere.

Instead, imagine your documentation as a sales team. What would you want your sales team to do? Attract developers, make them understand why your API is so helpful, and provide them with straightforward, continuous, personalized customer support.

Documentation can perform all these tasks. Great documentation can quickly immerse developers in your product and provide them with simple, customized content from wherever they want.

## Get users into a demo quickly

Your API's documentation is competing for people's attention with everything else that's out there—Snapchat, The New York Times, iMessage, sleep—which means it needs to make an impression fast. In under 15 seconds to be exact, according to [Chartbeat](http://time.com/12933/what-you-think-you-know-about-the-web-is-wrong/).

One way to do this is to get a developer playing around with your API before those 15 seconds are up.


[Stripe](https://stripe.com/docs) is a great example of an API that gets users trying out the product quickly. Right as you open their documentation, you see a 6 step demo that walks you through how Stripe creates and charges customers.

![]()

It takes about 3 seconds to get through step 1, which is just clicking a “Submit” button. This short first step is key as users are actively playing with the API before they can lose interest. Before those 15 seconds are up, they already have a great preview of the value the API can add to their app. By the end of the demo, they've seen how easy it is to add a new credit card, associate that card with a unique customer, and charge that customer. They even know how to set up recurring charges and subscribe the customer to a new payment plan.

Once the demo is completed, links pop up to take users to more detailed pages. These pages are more likely to be read by developers who have already experienced the worth of your API and want to learn more.

You have very little time to excite users and explain your product—so get them into a demo fast.

## Make it easy to understand

If developers find your documentation confusing, they won't stick around. No one wants to bother with an API they can't understand.

You could and should try out stylistic changes and test which creates the best pathway to understanding. However, at the end of the day you're going to come down to one issue—you wrote this, not the user. Why not reduce that imbalance?

Substituting user-created values for your own whenever possible helps the users truly understand what your API is doing.

Consider [Airtable's API documentation](http://airtable.com/api), which is customized specifically for the Airtable database already created by the user. You don't see generic field names or example values—you see the entries that you actually interact with in Airtable every day. Rather than “Field 2” you see “Assignee.” Rather than “task11” you see “Fix lion cage.” It makes the API immediately familiar and easy to get started using.

![]()

Customizing the documentation for each user reduces confusion. What could be easier for a developer to understand than their own variables? If developers can easily understand your API's requests and responses they can get a better view of its value.

## Embed documentation everywhere

A developer who has already logged into your site is serious about trying your API. The last thing you want to do is remove them from this process by taking them back to your public page to view the documentation.

However, people will want to access your documentation from everywhere: your public page, logged in, Github, etc. You want it to be seamlessly available in all these places at once.

You could just have your documentation embedded on one page and link the user from place to place. However, every time you link a user out of the site they're in, they become less likely to go back.

If you're serious about accessibility and reducing friction for developers, embed your documentation everywhere. Of course you're not expected to actually write multiple copies. Rather, create your documentation in Markdown on Github. Then you can embed it anywhere using the wiki system Markdocs. That way, users can directly access your documentation from everywhere.

Creating your documentation in Markdown also lets you tailor it to different groups. Libraries like Lodash can be used to integrate user details into how the documentation is displayed. In your documentation, include “if” statements to reduce the amount of unnecessary information a user sees.

For example, the two images below are from the same page of Auth0 documentation. There are two distinct steps numbered 4, and Lodash is used to display one or the other based on whether or not the user has indicated that they would call a third party API or their own API. Thus, the developer does not have to waste time trying to find relevant information.

![]()

![]()

Don't put any roadblocks in your user's way. Every piece of extraneous information, every link is a point where the user might reassess their focus on your product.

Let developers see what they want, where they want. Putting your documentation everywhere allows you to keep users engaged rather than taking them away.

## Offer customized sample projects

We learn best through [experiential learning](https://blog.readme.io/the-most-effective-api-quickstarts-in-8-examples/), so having a developer engage with a sample project is an excellent way to get them hooked.

Sample projects are now expected, but *customized* sample projects can really make your documentation accessible. The closer a sample project is to what would actually be purchased, the more likely a developer is to like it and buy it.

At [Auth0](https://auth0.com/docs), we have sample projects available for dozens of different front and back-end languages, each of which is fully customized with a user's API keys when downloaded.

![]()

All of the necessary configurations are already done, the user gets a fully personalized README to work through, and they're spared all of the tedious setup usually involved in trying a new product. A developer should leave your documentation knowing how their app would function with your API and thinking, “that was easy.” That is what customized sample projects will get you.

## Stop wasting developers' time

Developers rely on APIs to reduce their workload, so use your documentation to reduce it as much as possible. Minimize the number of clicks and scrolls it takes to get someone playing with your product. Don't make it overly complicated. And customize it to their needs to the best of your abilities.

Documentation is a reflection of your API. If your documentation is quick, simple, and personalized it says your API will be too, and thus worth buying.

To learn more about creating great documentation, [check out my talk](https://www.youtube.com/watch?v=lw9R2qMCdqk) from the Forward 2 Web Summit.


Brand advocates are the holy grail of customers. They're a key part of growing your customer base because they love your product and encourage others to use it. Of course you wish every customer were a brand advocate.

So, can you better connect with *regular* customers to turn them into all-important brand advocates? Creating that valuable, personal connection to your brand is difficult. Especially today, when you're communicating across multiple channels, and trying to [stitch together your customers' behaviors](https://auth0.com/blog/how-to-keep-up-with-hyperconnected-consumers/) from in-store purchases to tweets.

[Identity management is your secret weapon for this](https://auth0.com/b2c-customer-identity-management) — it helps consolidate customer information so you can add that personal touch whenever people log in or stroll into a store and interact with your brand.

## Use social login to kickstart personalization

Login is the beginning of getting to know your customer. It's a great way to start collecting information about them that you can use to better their brand experience and personalize your interactions.

One of the easiest ways to do this is to use [social login](https://auth0.com/learn/social-login/). Customers often want an easy login that doesn't require them to open yet another account with yet another username and password, and social removes that barrier for customers. It also streamlines their login after they create an account; if they are logged into the social network, they'll be able to log in with one click and no keystrokes at all.

In addition, shopping is a social experience, something that's replicated on a lot of eCommerce sites. Referral programs that use customer's social login to suggest sharing rewards with friends, and even allowing personalized gift wrapping and messages through websites speak to the social nature of shopping. If you have any social rewards or features, social login is the way to go.

![Social brand](https://cdn.auth0.com/blog/customers/socialbrand.png)

There's a lot more you can do on the back-end to kickstart your personalization as well. [With Auth0](https://auth0.com/retail/), you can grab information from social login, like email, birthday and Facebook pages liked. You can use this across marketing efforts — those make for the start of a pretty good birthday coupon email, for example.

In this way, social login encourages a better relationship between brand and customer, especially when that customer might not get to step into a brick and mortar store with their friends and make connections with salespeople and products.

## Engage over time with progressive profiling

You want to build a relationship with your customers, and that means learning about them over time, it doesn't happen just because you ask a customer what they're like on day one. There's no way a customer would ever sit through a survey that asks everything you want to know about them, but they still want that personal touch.

That's where [progressive profiling](https://auth0.com/blog/progressive-profiling/) comes in. Progressive profiling is slowly nudging the customer over time and learning about their preferences, likes, dislikes. It's also about knowing when the right time to ask for information is. You want to identify when customers will share the information you need, which probably aligns with how much they've realized the value of your product.

Progressive profiling is easy when done by triggering questions at login. Maybe the first login you only take their basic information, but the third or fourth time they log in, you ask them where they work or what types of deals they'd like to see from you in their inbox.

![Progressive profiling](https://cdn.auth0.com/blog/customers/progressiveprofiling.png)

This will allow you to foster your relationship based on the personal information an individual consumer gives you. Maybe you're an online cosmetics retailer and you send a free sample with every purchase over $50. You can give different people different gifts, ones they'll actually want, based on what they tell you.

So, instead of sending everyone the same sample, you can send perfume samples to those who are interested in fragrance, and a hair mask to those who told you their concern was healthy hair.

Gathering personal information from a customer can lead to forging a more meaningful and valuable relationship between you and them. They are actually better served by your business, because you can cater to their individual needs. In turn, they'll be more likely to recommend and talk up your brand to others. And that's a cycle that can continue for their entire lifetime as a customer.

## Streamline your personalization with a single view of your customer

We've just discussed gathering information on customers to make their experience more personal. But where do you store that information, and who has access to it?

With Auth0, each user in your system has a centralized profile where information is stored. Their login history, the information from their social login, progressive profiling, and other information you collect can be stored in that profile, which gives you a [360-degree view of the customer](https://auth0.com/blog/360-view-of-customer-by-managing-identity/). You can set access so that everyone who is interacting with customers has real-time access to that information.

This profile within Auth0 also helps maintain a single view of your customer in other ways:

* **Accounts are linked and centralized.** If a user has multiple social accounts that they log in with, or if they log in with social one time and email the next, Auth0 can link these accounts to a single, central profile. No more duplicate users will be lingering in your system.

* **Brand umbrella challenges are eased.** If a single retailer has multiple portals or different brands under the same umbrella, it can be a difficult task to centralize those to get one profile for every user. Using Auth0 across portals and brands takes some complexity out of matching profiles for different brands.

* **Cross-device use is streamlined.** Just as using Auth0 helps with keeping track of users across brands, using a sophisticated IAM helps consolidate users who log in across different devices. The same, centralized profile is able to consolidate no matter where users log in, or with what device.

## Better personalization with Auth0 Rules

That centralized profile is also the perfect way to take advantage of the true power of a robust identity management system like Auth0. With Auth0 in particular, it's a great way to take advantage of [Auth0 Rules](https://auth0.com/docs/rules/current), snippets of code that you add to kick in things like grabbing information from a user's profile.

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
