---
layout: post
title: "How Identity Management Helps You Personalize Your User Experience"
description: "Keep up with product customization by letting your IAM do the heavy lifting"
date: 2017-08-04 17:10
category: Growth, Growth Hacking
is_non-tech: true
author:
  name: Martin Gontovnikas
  url: http://twitter.com/mgonto
  mail: gonto@auth0.com
  avatar: https://www.gravatar.com/avatar/df6c864847fba9687d962cb80b482764??s=60
design:
  bg_color: "#3F5C56"
  image: "https://cdn.auth0.com/blog/personalize-user-experience/logo.png"
tags:
- personalization
- growth
- identity
- auth0
related:
- 2017-07-21-the-role-of-identity-in-application-modernization
- 2017-03-24-360-view-of-customer-by-managing-identity
- 2017-03-15-5-reasons-your-company-needs-identity-and-access-management
---

<div class="alert alert-info alert-icon">
  <i class="icon-budicon-500"></i>
  <strong>Forrester Consulting analysis determines that using Auth0 can yield a 548% ROI and $3.7M in identity-related savings. Read the full report: <a href="https://resources.auth0.com/forrester-tei-research-case-study/">Total Economic Impact of Auth0</a>.</strong>
</div>

---
When it comes to appealing to customers, slowly but surely, personalization has become the name of the game. From Netflix's personalized recommendations algorithm to Amazon's suggested items, users are learning to expect that the interactions they have with a digital product or company will be catered to them.

However, most companies don't have the manpower to create a constantly updating algorithm that allows each user to experience a totally individualized version of their product. In fact, most companies leave personalization to a minimum, because it can be difficult to keep track of data for individual users and then put that data to work.

 Identity and Access Management (IAM) might not be able to build you a completely customized product, but it can help you understand your users and make smarter, more personalized choices about how you engage them. Moreover, because you're already utilizing IAM, you don't even need to have a dedicated team to do it.

## Individualize your analytics

An identity management system can help you to simplify the process of bringing in personalized data to your analytics.

One way it can do this is by providing a way to circumvent the problems of relying on client-side analytics while still getting data to your internal systems. Client-side analytics are not very reliable—for example, customers might use an ad blocker that disrupts your JavaScript, or click on and off pages too fast for all your code to run.

With Auth0, you can circumvent this problem by automating a variety of actions at login. You do this by adding a [Rule](https://auth0.com/docs/rules), a snippet of code, to your authentication sequence. When a user is authenticated—which, for example, won't be affected by an ad blocker—you can record that login or send their information to your CRM right from login.

![Auth0 rules](https://cdn.auth0.com/docs/media/articles/rules/flow.png)

So, say you want to trigger an onboarding email the third time someone logs into your site. You can set up a Rule that works with your email marketing system to fire them off a message on their third login that's tailored to their understanding of your service.

Or maybe you set up a Rule that collects and checks when a user has reset their password. If they reset their password a  certain number of times, you could trigger a question about setting up passwordless login, catering to their frustration at constantly forgetting what their password is.

Whether you're sending a user's first-time login to your CRM or automating specific moments at login, combining your IAM with even basic analytics—like the number of password resets—can give a more customized user experience.  

## Make sure your support has a personal touch

People don't want to spend half their time on the phone with support having to explain the basic details of their identity or product history.  

But centralizing their user information—their likes, dislikes, analytics, basic personal information, etc.—can be overly complicated. User preferences might be stored in one place, key analytics and in-product behavior in a totally different software, and sales information in yet another.

For a customer success person trying to give personalized support, it's difficult to juggle all the places user information can be stored while trying to give them real-time help.

This is where the concept of modern authentication really shines. Because identity management systems like Auth0 work to create a full view of a user, you can access most relevant data in one place.

Auth0 sets up a basic profile for every user in your system. It stores the information they provide, like their name and handle, but also has space for a lot more information. You can see things like what devices they have, how many times they've logged in, whether or not they've verified their email.

You can also add data to store customized information about users. You can modify any user's profile in your system manually. If you want to automate, you can do that with Rules. For example, you can add a Rule that enriches the user profile with information from a CRM like FullContact.

Or, you can ask users to give you specific pieces of information, like job title or company, at login. Those will be automatically stored and added to their profile.

![Rules to enrich profile on Auth0](https://cdn.auth0.com/blog/personalize-user-experience/auth0-enrich-profile-rules.png)

That way, if your support needs to pull up information on a user quickly, they can get a structured view of the user as an individual, and their general product use information. This makes providing more personalized support a no-brainer.

## Tap into the benefit of social login in no time

We've just looked at some ways that an IAM can help coordinate a more personalized user experience across complex systems. However, if you want to get jump started on setting up a more personalized user experience, the easiest way to do so is to set up social login.

With Auth0, you can [configure your login](https://auth0.com/docs/identityproviders) with a huge number of social sites in minutes. When people start logging in to your site via their social login, you will be able to take the information you want from their social profile (location, birthday, friends, etc.) and you can funnel all that valuable social data right into your user profile.

![Enrich profiles from social networks](https://cdn.auth0.com/blog/personalize-user-experience/enrich-from-social.png)

This makes it easy to start personalizing a user's experience from the first time they use your product, like being able to sync an in-app feature to the customer's location immediately. The information that you add to your user's profile from social login is a strong base for any customized experience. If you want the most amount of data and the least amount of hassle, start with social login and work outwards from there.

## Let your identity management work for you

There's much more to identity management than just securely storing passwords. When you have an identity management system that's capable of more than gatekeeping, it's worth taking the time to set up a few extra steps that help your IAM work for you. Those extra steps can turn into happier, more engaged customers, which turns into more revenue.

Especially as customization and personalization become more and more popular, having an IAM that can keep track of a variety of different data in one centralized place will become even more valuable. With all the data that online services continue to collect, using a sophisticated IAM will allow you to conquer personalization.
