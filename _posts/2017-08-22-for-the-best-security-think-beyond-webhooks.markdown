---
layout: post_extend
title: "For the Best Security, Think Beyond Webhooks"
description: "Don't limit yourself to webhooks. With Auth0, you can fully customize your identity management."
date: 2017-08-22 8:30
is_extend: true
category: Extend, Technical, Webtasks
canonical_url: true
author: 
  name: "Bobby Johnson"
  url: "https://twitter.com/NotMyself"
  mail: "bobby.johnson@auth0.com"
  avatar: "https://cdn.auth0.com/website/blog/profiles/bobbyjohnson.png"
design:
  bg_color: "#3445DC"
  image: https://cdn.auth0.com/blog/beyond-webhooks/logo.png
tags:
  - extend
  - Auth0 Webtasks
  - Webtasks
  - Identity
  - serverless
  - webhooks
  - extensibility
related:
  - 2017-05-16-introducing-auth0-extend-the-new-way-to-extend-your-saas
  - 2017-05-19-serverless-webhooks-with-auth0-extend
  - 2017-08-15-extend-salesforce-with-node
---

It's easy to get locked into an authentication service.

Once you've put all that time and effort into system integration and training employees to use the new service, it's really hard to leave. Some authentication providers even purposely try to make moving off them difficult because they think ([mistakenly](https://auth0.com/blog/why-using-open-standards-helps-close-enterprise-deals/)) that it will help them retain customers.

The problem is, your security needs are constantly changing. If your provider can't keep up, you'll either need to drop clients or go through the arduous process of switching providers, neither of which is an attractive option.

What you really need is to be able to add your own code on the fly. Many services now have webhooks so you can do just that. It's a great idea, but webhooks have limited capability and force *you* to be responsible for hosting them. This can defeat the purpose of having third-party authentication in the first place.

All of these struggles and pains lie behind our creation of [Auth0 Extend](https://auth0.com/extend/) and the underlying [Webtasks](https://webtask.io/) platform. Webtasks can run backend code, without a backend. We use them to execute [Auth0 Rules](https://auth0.com/docs/rules/current), which are customizations you can add to our service, right on our platform. Our Rules are serverless extensions, so you can add all the security features you want without the hassle.

## Are extensions really necessary?

Short answer: yes. As your company grows, so do your security needs. No matter how great your authentication provider is, they can't predict or cater to all the features you'll want in the future.

For example, any enterprise customer you woo is going to be using a ton of internal tools already. If you can't alter your application so it can integrate with all these tools, you're never going to make the sell.

![Communication tools](https://cdn.auth0.com/blog/communication/tools.png)

But you still don't want to resort to figuring out your own security. Why?

* **It's too much work:** Developing your own identity security is hard work, and you can't commit so much time and personnel to a process that doesn't add value to your product.
* **Scaling isn't easy:** As you grow, [scaling your security needs](https://auth0.com/learn/build-or-buy-20-identity-management-questions/) is going to become a problem. You may be able to handle a single identity provider for 1,000 customers, but extending that to fully operational identity management for 100,000 customers later on is a different story.
* **Mistakes are deadly:** There are so many small ways to go wrong in identity management, you can't risk ruining your reputation. It's not worth trying to save money by implementing your own security if you end up missing a tiny but essential detail. [The Ponemon Institute](https://www-01.ibm.com/common/ssi/cgi-bin/ssialias?htmlfid=SEL03130WWEN) found that a data breach costs on average $3.62 million in support, investigation, and loss of customers, you can't afford that.

That's why you need to find an authentication provider who allows you to easily add features on your own.

Instead of having to switch providers as you grow or give up on new features, you can just expand your current security. This is especially important for attracting larger customers. Once you snag that big enterprise customer who requires an extra security measure you can just add it on, instead of telling them they have to take their business elsewhere.

## Webhooks aren't good enough

Security, especially identity security, is complicated. Declarative customization options like radio buttons aren't going to get you all the way to the security your application needs. Odds are, you're going to need to program some things on your own.

Major platforms know this, so they've started exposing [webhooks](https://developer.github.com/webhooks/) so users can add custom code. But webhooks have two major issues: they're work intensive and they're limited.

### YOU HAVE TO DO ALL THE WORK

When you set up a webhook, you now have to be responsible for finding a place to host it, scaling it, doing maintenance, all of the complications involved in running a service. So much for the effort you're supposed to be saving by using a third-party provider.

![Graph](https://cdn.auth0.com/blog/security/graph.png)

This all adds up, so [customized features often won't get added](https://www.youtube.com/watch?v=D3sEJeOYvKA) because it's simply too much work. The fact that you *can* extend a security protocol doesn't mean much if it's too costly to actually do it.

### YOU CAN ONLY WRITE A ONE-WAY EXTENSION

Most platforms just offer webhooks that work [asynchronously](https://tomasz.janczuk.org/2015/07/extensibility-through-http-with-webtasks.html). That is, you can have your extra code executed at some point in the platform's behavior, but you can't use that code to change what the platform does. For example, you can add code to have your identity service provider notify you when a user logs in, but you can't tell the platform to add an additional authentication requirement if that user is logging in from a different state.

![Asynchronous nature of Webhooks](https://cdn.auth0.com/blog/webhook/asynchronous.png)

These one-way webhooks can only accomplish a small subset of all the extensions you might want. To truly customize your identity management, you need more.

## Extensibility with Auth0

With Auth0, you can fully customize your security without putting in so much effort.

Instead of using webhooks, we have [Webtasks](https://webtask.io/), which allow you to directly extend our platform with [Rules](https://auth0.com/docs/rules/current). The Webtask acts as a sandbox to host the code you add. You can access the Rules page right from your dashboard and then create, try out, and implement new customizations within minutes.

![Rules](https://cdn.auth0.com/blog/security/auth0rules.png)

### WE DO THE HARD WORK FOR YOU

With Webtasks we can [execute custom Node.js code](https://auth0.com/blog/extensibility-through-code-using-webtasks/) securely in a multi-tenant environment with low latency. Essentially, Webtasks allow you to add customized code to extend Auth0 without a server. That means you can get all the functionality of a webhook without any of the hosting requirements. We do all the work of sustaining your extension while you just write the code. And you can write your code directly into our platform, no need to have a separate setup.

![Auth0 Rules](https://cdn.auth0.com/blog/diagram/auth0rules.png)

All this comes with our strong isolation guarantee that your code will not interact with anyone else's. Each customer gets their own Webtask container to execute in.

### YOU CAN DO MORE

Unlike one-way webhooks, Auth0 Rules execute as a part of the authentication transaction, so you can use your Rules to customize the process itself.

![Webtask Extensibility](https://cdn.auth0.com/blog/webtask/extensibility.png)

Webtasks have full access to more than 400k modules hosted on [NPM](https://www.npmjs.com/), so you should be able to implement whatever scenario you want, whenever you want. It's easy to add extra authentication requirements or create an interaction with an external system as your security needs change.

To make things even easier we also provide Rule templates for some of the more common extensions, which range from getting a Slack notification when a new user signs up to adding multi-factor authentication.

![Web task - Rule Editor](https://cdn.auth0.com/blog/wehook/ruleseditor.png)

Click [here](https://webtask.io/docs/how) to learn more about how Webtasks work.

With Webtasks, you and Auth0 can combine forces to build authentication tailored for what your application is now, and what it will be.

## Your future with extensibility

Imagine being able to have the perfect security throughout the growth of your business. No more long hours spent researching new providers whenever you need to make a change. No more struggling to set up hosting for a webhook. No more realizing there's no way to add that multi-factor authentication feature a customer requires.

When you work with Auth0, you just have to figure out what your business needs, we'll take care of the rest.

And this helps your customers, too. If you use a flexible, extendable provider, then your company becomes flexible and extendable as well.
