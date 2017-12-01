---
layout: post
title: "AWS re:Invent Day 4 Recap"
description: "AWS re:Invent officially runs through tomorrow, but for all intents and purposes day four was the final day with big announcements. Dr. Werner Vogles, CTO of AWS, had just a few announcements but they were some of the most exciting ones. Read on to find out what they were."
date: 2017-12-01 8:30
category: Growth, Conferences, AWS
author:
  name: Ado Kukic
  url: http://twitter.com/kukicado
  mail: ado@auth0.com
  avatar: https://s.gravatar.com/avatar/99c4080f412ccf46b9b564db7f482907?s=200
is_non-tech: true
design:
  image: https://cdn.auth0.com/blog/aws-reinvent-2017/logo.png
  bg_color: "#222228"
tags:
- aws
- reinvent
- auth0
- amazon
- serverless
- identity
- compliance
- security
related:
- 2017-11-30-aws-reinvent-day-3-recap
- 2017-11-29-aws-reinvent-day-2-recap
- 2017-11-28-aws-reinvent-day-1-recap
---

At AWS re:Invent 2017, Amazon showed their cards for the next year and doubled down on providing an "everything platform" for developers. Key services included serverless computing, containers, machine learning, and IoT. Day four was led by CTO of AWS, Dr. Werner Vogles, and he had some very exciting announcements. Let's dive right in. 

## Announcement: AWS Cloud9

[AWS Cloud9](https://aws.amazon.com/cloud9/) is a cloud-based IDE that is going to allow developers to build, debug, and deploy applications directly in the AWS management console. If the name Cloud9 seems familiar, it is the name of a cloud-based IDE that Amazon acquired last year. AWS Cloud9 brings a powerful integrated developer environment with deep integration into the AWS ecosystem and an improved developer experience, allowing for easy pair programming, sharing of code, code reviews, and much more.

![AWS Cloud9](https://cdn.auth0.com/blog/aws-reinvent-2017/cloud9.jpg)

What developers are excited about is no longer having to set up a local development environment. They can access all of their code from the browser and have a very consistent experience. From my brief time playing with AWS Cloud9, I really enjoyed the experience and am looking forward to spending more time with it.

## Announcement: Alexa for Business

Alexa and the Amazon Echo are ushering in a new era of computer interaction with just your voice. The product has been very successful so far and Amazon has a whole suite of Echo devices now ranging from the original, mini, on tap, as well as third party devices integrating Alexa functionality. Alexa has personally taken over my home with four devices spread throughout different parts of my house.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Introducing Alexa For Business: <a href="https://t.co/zD2ALbcwoy">https://t.co/zD2ALbcwoy</a> <a href="https://twitter.com/hashtag/reinvent?src=hash&amp;ref_src=twsrc%5Etfw">#reinvent</a></p>&mdash; Matt Wood (@mza) <a href="https://twitter.com/mza/status/936279344669847552?ref_src=twsrc%5Etfw">November 30, 2017</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>


[Alexa for Business](https://aws.amazon.com/alexaforbusiness/) is aiming to take the success that the Echo has had in the consumer space and adapt it to the office. Integrations with conference room hardware and software, corporate device management for the hardware, and other features will make it easy for businesses to add Echo devices in the workplace. I am curious to see if businesses will adopt it. 

## Announcement: AWS Lambda

Amazon is betting big on its serverless framework [AWS Lambda](https://aws.amazon.com/lambda/) and for good reason. Its usage is growing tremendously and it is solving many use cases for organizations within the AWS ecosystem. Today, Dr. Vogles had five new announcements for AWS Lambda.

![AWS Lambda announcements](https://cdn.auth0.com/blog/aws-reinvent-2017/lambda-announcements.jpg)

* **API Gateway VPC integration**.
* **Concurrency controls**.
* **3GB Memory support**.
* **.NET Core 2.0 language support**.
* **Go(lang) support**.

I literally jumped for joy when I saw that last one. I can't wait for native Go support in AWS Lambda. If you are interested in [learning more about Go, check out this tutorial](https://auth0.com/blog/authentication-in-golang/) I wrote on building Go APIs and adding authentication to them.

## Session: Identity Management for Your Users and Apps: A Deep Dive on Amazon Cognito

[Amazon Cognito](https://aws.amazon.com/cognito/) is getting some advanced security features, and this session offered a deep dive into what's new and how it works. The new features that Cognito is getting include passwordless authentication, anomaly detection, breached password detection, and multifactor authentication. We at Auth0 also provide [multifactor authentication](https://auth0.com/multifactor-authentication), [breached password detection](https://auth0.com/breached-passwords), and [anomaly detection](https://auth0.com/docs/anomaly-detection) so I was very curious to see how our technology stacked up.

Overall, I left impressed with the new capabilities of Cognito. They are making great strides in offering AWS developers the tools to better secure their users' identity and that, to me, is always a win. I'm sure I will get the Auth0 vs Cognito question, and of course, my answer will be a little (or very) biased, but I really think it's great that Amazon is adding these advanced security features as it validates the hard work our engineering team is doing every day. That's all I'll say on that topic. :)

## Session: Amazon Macie: Data Visibility Powered by Machine Learning for Security and Compliance Workloads

[Amazon Macie](https://aws.amazon.com/macie/) is a machine-learning service used to discover, classify, and protect sensitive data. Think about how many developers check in code to public GitHub repos with access and secret keys embedded in the code. Macie tries to identify issues like this, but is not limited to just secret keys; it can be used to identify PII, business-critical data, or other forms of sensitive data.

![AWS Macie](https://cdn.auth0.com/blog/aws-reinvent-2017/macie.jpg)

This session focused on how you can use Amazon Macie to monitor and identify when your applications are potentially leaking sensitive information so that you can act on that data. Ajit Zadgaonkar from Edmunds shared real-world scenarios and use cases where Macie is used in production and how it helps Edmunds run a much tighter ship.

## Aside: Auth0 and AWS

If you are using AWS to manage your infrastructure, whether it be traditional, serverless, or a mix, and are looking to better manage identity in your applications, Auth0 can help you to:

* Add authentication through traditional username/password databases.
* Add support for linking different user accounts with the same user.
* Support for generating signed JSON Web Tokens to call your APIs and flow the user identity securely.
* Analytics of how, when, and where users are logging in.
* Pull data from other sources and add it to the user profile, through [JavaScript rules](https://docs.auth0.com/rules).
* Achieve [SSO (Single Sign-On)](https://auth0.com/docs/sso) seamlessly.

<a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">Sign up</a> for a free account today and enjoy fast, seamless, and hassle-free authentication in your apps.

## Closing the Keynote

Throughout the keynote, Dr. Vogles focused on what the future of application development was going to be like. He spent a lot of time talking about the [Well Architected Framework](https://aws.amazon.com/architecture/well-architected/) principles and how these guidelines are used at AWS. I highly recommend you check it out, especially the section on [AWS Cloud Security](https://aws.amazon.com/security/). If you are interested in how our architecture works at [Auth0, be sure to check out our security](https://auth0.com/security) and [Auth0 availability and trust](https://auth0.com/availability-trust) documents for insights.

![AWS re:Invent Closing Statement](https://cdn.auth0.com/blog/aws-reinvent-2017/closing.png)

Dr. Vogles closed out the keynote with a powerful statement on where he sees the future of application development. **All the code you ever write is business logic** is what he is predicting. I agree with his statement. At Auth0, we strongly believe in focusing on your core competency and outsourcing everything else, whether it be messaging, payment processing, or even identity. Check out our [guide on deciding whether or not you should build identity in-house or buy an existing solution](https://auth0.com/learn/build-or-buy-20-identity-management-questions/).

## Summary

Day four of AWS re:Invent 2017 was my personal favorite because of the Go support for AWS Lambda announcement. Overall, I feel that the conference was a big success with many announcements being exactly what developers wanted. Managed Kubernetes, a powerful cloud IDE, expanded Lambda, and better user security: what more could you ask for? The only thing I could ask for is more time to attend additional sessions, but many of these will be available online shortly, so I will be sure to tune in and catch what I missed. What did you think of AWS re:Invent this year? Does it make you more likely to use the platform?

Previous recaps:

* [Day One](https://auth0.com/blog/aws-reinvent-day-1-recap/)
* [Day Two](https://auth0.com/blog/aws-reinvent-day-2-recap/)
* [Day Three](https://auth0.com/blog/aws-reinvent-day-3-recap/)
