---
layout: post
title: "Moving Your App to the Cloud"
description: "Integrating cloud security services into your app not only keeps you and your users safe, it can actually accelerate your development process."
date: 2017-07-12 8:30
category: Growth, Industries, Retail
author:
  name: Diego Poza
  url: https://twitter.com/diegopoza
  avatar: https://avatars3.githubusercontent.com/u/604869?v=3&s=200
  mail: diego.poza@auth0.com
design:
  bg_color: "#284E7B"
  image: https://cdn.auth0.com/blog/appCloud/logo.png
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

Over the course of the 2010s, cloud computing has shifted from being a bleeding edge solution to a standard expectation in data management. Not only has it allowed consumers and the enterprise to flexibly scale their storage needs, it has also redefined the software industry towards a cloud-based service model.

There are a ton of other benefits, allowing developers to streamline their development process and offer users a more refined and accessible experience. But what's one cloud advantage that the mobile app industry hasn't taken full advantage of? Security.

By delegating specialized tasks like IAM and encryption to cloud services that are 100% committed to following the latest security standards, you can spend more time building out your app without sacrificing the security of your users. In a cutthroat marketplace, delegating high-stakes features such as IAM to cloud providers can give you the competitive advantage you need to succeed, all while improving the security practices of your users.

## Security Advantages of The Cloud

Relying on a distributed cloud model for your security and authentication needs is a bit of a no brainer, as a developer you'll have more time to commit to making your app the best it can be, all while making sure your users are well taken care of.

The main advantage of cloud services in security and authentication contexts stems from their distributed nature. If you had an in-house authentication or data storage platform, a single point of failure might emerge, leaving your users stranded. But by relying on distributed authentication or hosting services, with multiple backups and agile update schedules, you can count on a more stable and scalable backend to keep your users happy and safe.

![Amazon EC1](https://cdn.auth0.com/blog/securityadvantages/ecs1.png)
_[Source:](http://www.allthingsdistributed.com/2015/07/under-the-hood-of-the-amazon-ec2-container-service.html)  Amazon's EC2 Container Service helps reliably balance cloud resources and clusters within a system._

In the case of Amazon Web Services, their concept of [“systems containers”](https://aws.amazon.com/blogs/publicsector/improving-security-with-cloud-computing-six-advantages-of-cloud-security/) sheds light on how cloud security structures can actually serve as powerful analytics tools. Due to the bubble-like nature of cloud systems as they surround traditional systems, they can provide insight into irregular behaviors and perform load balancing. Even if a cloud system isn't actively aware of the inner workings of each system element, it can create reactive responses and protect the integrity of your platforms.

By allowing your backend to be self-regulating, scalable, and constantly updated to the latest standards, you can make your app far more responsive to changing security threats and technologies.

## Why Outsource Identity?

At the end of the day, most developers simply don't have the time or expertise to build out robust IAM or data encryption platforms — developers need to delegate in order to give their users access to the best service possible. Luckily, that's where the cloud services model has proven to be most valuable, enabling you to externalize the most difficult platforms to the experts.

### USE YOUR RESOURCES EFFICIENTLY

As a developer, one of the most overlooked aspects of the development process is figuring out how to design your app to adhere to the most stringent security and authentication standards. It's a tall order — you can't be expected to be an expert in everything, yet nightmares stemming from bad security practices loom large.

What's worse, many users rely on developers, designers and onboarding to nudge them towards responsible identity behaviors, but mandating the strictest security practices can be a turn-off — that's a lot to balance.

By integrating a cloud IAM framework into your app, not only are you able to ensure that your users are adhering to industry standards, you also can actually make both development and user experience easier.

### ADHERE TO INDUSTRY STANDARDS

One of the best practices for rock-solid IAM is to use [Multifactor Authentication](https://auth0.com/docs/multifactor-authentication)(MFA). MFA allows your app to verify users using multiple devices, such as SMS, allowing you to mitigate impostors.

![Guardian Push](https://cdn.auth0.com/blog/security/guardian-push.png)

_Source: Auth0's [Guardian](https://auth0.com/multifactor-authentication) multi-factor authentication platform makes it easy to add Identity verification in your app._

MFA has quickly become an industry standard, but it requires a ton of backend work, ranging from SMS integration architecture to hardware tokens. For smaller developers, creating an MFA strategy from the ground up is an inefficient use of resources, so it makes sense to use an external cloud-based service like Auth0 to integrate with your login and onboarding flows.

### STREAMLINE YOUR SIGNUP

Social login is popular because it helps users who are less motivated to sign up using their email and password to simply sign up using their Facebook or Google accounts in just 1 or 2 clicks, avoiding the often cumbersome nature of traditional signup flows.

As a result, social login is becoming increasingly ubiquitous, and it has allowed developers to become familiar with integrating Identity APIs in their code. If developers are willing to use plugins and APIs to make their users' experiences just a little bit easier, they should also consider external cloud IAM solutions to bolster their security strategy.

The decision to outsource identity is ultimately up to each developer, for use cases as audience needs are highly variable. But developers should consider how easy it is to add cloud services to their stack, and learn about the benefits of additional identity-driven [analytics capabilities](https://auth0.com/learn/powering-user-analytics-identity/) that they enable. In such a competitive market, any efficiency and/or experience improvement can have a profound impact on the success of products.

## How Auth0 implements Cloud Identity

While it might seem like it's overwhelming to implement a cloud IAM architecture like Auth0, it's actually quite easy. Auth0 is immensely flexible, offering SDKs for a wide range of platforms, ranging from Java, PHP, Python, and iOS, among others, and allows developers to build upon it with C# or JavaScript to suit their needs.

Structurally, Auth0 serves as a bridge between apps and users, aiding in authentication and identity processes using the [OAuth2](https://auth0.com/docs/protocols/oauth2) protocol. The OAuth2 protocol enables users to grant regulated permissions from one site onto a different site, without having to expose their credentials. This is done through access tokens, which represent the granted permissions:

![Mobile API](https://cdn.auth0.com/blog/security/mobile-api.png)

By default, Auth0 runs in the public cloud, but you can choose to run it privately on large cloud hosting services like AWS, or even locally if you're so inclined. Regardless of the structure of your app and its dependence on either local or cloud platforms, Auth0's cloud IAM acts as a stable go-between that can provide consistent service and agile updates as security standards evolve.

Whether you're in a time crunch or simply just want to have bulletproof IAM built into your app, implementing Auth0 into your product is quick and easy. If you're an iOS developer, all you need to do is add a few lines of code into your app for the [Lock](https://auth0.com/docs/libraries/lock-ios/v2) embeddable login form to start working.

## Embrace Cloud Security for a Competitive Edge

When developing a new app, creating high-stakes tools for authentication and data security can seem insurmountable. Instead of building out an imperfect system and putting you and your customers at risk, you could always rely on a service like Auth0 to take care of the hard details, enabling you to make better use of your resources.

The app space can be incredibly cutthroat, so any way to make your app more efficient and robust can translate into a real competitive advantage. By delivering a product with top-tier IAM and cloud architectures, you can deliver a more scalable and agile product that will be able to stand out in the marketplace.