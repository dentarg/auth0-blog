---
layout: post
title: "AWS re:Invent Day 2 Recap"
description: "AWS re:Invent continues with day two. Here is our recap of the exciting announcements and interesting talks we were able to attend."
date: 2017-11-29 17:30
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
- 2017-11-29-aws-reinvent-day-1-recap
- 2017-11-30-aws-reinvent-day-3-recap
- 2017-12-01-aws-reinvent-day-4-recap
---

Day two of AWS re:Invent was in many ways similar to day one. There was no huge keynote, that is coming tomorrow, but there were a few announcements that I think the developer community will enjoy very much. Just because there was no keynote doesn't mean there weren't amazing talks, demos, and so much more to do. Here is my recap of day two!

## Announcement: AWS AppSync - Fully Managed Serverless GraphQL

![AWS AppSync](https://cdn.auth0.com/blog/aws-reinvent-2017/aws-appsync.png)

[GraphQL](http://graphql.org/) is challenging the way we write APIs. It allows clients to ask only for the data they need and in many ways can be seen as superior to the tried and true [REST pattern](https://en.wikipedia.org/wiki/Representational_state_transfer). Today, AWS announced a fully managed serverless GraphQL service called [AWS AppSync](https://aws.amazon.com/blogs/aws/introducing-amazon-appsync/) that promises to give developers the tools to build powerful data-driven apps with ease.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">We’re launching 🚀 AWS AppSync as a new service for preview later today! Here are some of its features! <a href="https://twitter.com/apatel72001?ref_src=twsrc%5Etfw">@apatel72001</a> <a href="https://twitter.com/hashtag/reInvent?src=hash&amp;ref_src=twsrc%5Etfw">#reInvent</a> <a href="https://t.co/fG9thG6sAa">pic.twitter.com/fG9thG6sAa</a></p>&mdash; AWS re:Invent (@AWSreInvent) <a href="https://twitter.com/AWSreInvent/status/935573868260896768?ref_src=twsrc%5Etfw">November 28, 2017</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

There's no better way to learn a new technology than to play with it, and if GraphQL has piqued your interest, you can give it a shot with a great [GraphQL tutorial](https://auth0.com/blog/build-a-rottentomatoes-clone-with-graphql-and-auth0/).

## Announcement: Amazon Sumerian

If you haven't heard of AR or VR, you haven't been paying attention. With [Amazon Sumerian](https://aws.amazon.com/sumerian/), Amazon wants to enable developers and content creators to create powerful AR and VR experiences without having to learn specialized programming.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">.<a href="https://twitter.com/Werner?ref_src=twsrc%5Etfw">@Werner</a> joined the experts from the Sumerian team on <a href="https://t.co/y6ZuEKkzw1">https://t.co/y6ZuEKkzw1</a> to see how to use this new service to easily create virtual reality, augmented reality &amp; 3D experiences. <a href="https://twitter.com/hashtag/reInvent?src=hash&amp;ref_src=twsrc%5Etfw">#reInvent</a> <a href="https://t.co/6ssimERc1K">pic.twitter.com/6ssimERc1K</a></p>&mdash; Amazon Web Services (@awscloud) <a href="https://twitter.com/awscloud/status/935641180842344448?ref_src=twsrc%5Etfw">November 28, 2017</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Amazon Sumerian allows developers to create experiences for all the major AR and VR platforms include Vive, Oculus Rift, and iOS AR Kit, with Android AR support coming soon. I wonder when you'll be able to use your digital avatar's fingerprint for MFA.

## Announcement: AWS Elemental

Amazon announced a family of media service offerings that aim to make the experience of uploading, transcoding, and converting video simple and easy on AWS. The products announced include:

* [AWS Elemental MediaConvert](https://aws.amazon.com/about-aws/whats-new/2017/11/introducing-aws-elemental-mediaconvert/).
* [AWS Elemental MediaLive](https://aws.amazon.com/about-aws/whats-new/2017/11/introducing-aws-elemental-medialive).
* [AWS Elemental MediaPackage](https://aws.amazon.com/about-aws/whats-new/2017/11/introducing-aws-elemental-mediapackage).
* [AWS Elemental MediaStore](https://aws.amazon.com/about-aws/whats-new/2017/11/introducing-aws-elemental-mediastore/).
* [AWS Elemental MediaTailor](https://aws.amazon.com/about-aws/whats-new/2017/11/introducing-aws-elemental-mediatailor/).

Working with video on the Internet has always been a challenge and I am personally very excited about these new services.

## Session: Serverless Authentication and Authorization: Identity Management for Serverless Applications

![Signup and Login](https://cdn.auth0.com/blog/aws-reinvent-2017/signup.jpg)

The first session I attended today was focused on serverless authentication and authorization, and I have to say it was one of my favorite sessions so far. Justin Pirtle and Vladimir Budilov led the session by explaining why [modern identity management](https://auth0.com/blog/the-role-of-identity-in-application-modernization/) is important and then solidified it with a really great demo. They focused on [AWS Cognito](https://aws.amazon.com/cognito/) and [Identity Federation](https://aws.amazon.com/iam/details/manage-federation/) to show how you can implement a modern identity infrastructure with little effort. What made the talk really effective was that they started small with the simplest authentication use case, and kept adding complexity over time, showing how you can achieve higher and higher levels of security.

![AWS Cognito Process](https://cdn.auth0.com/blog/aws-reinvent-2017/process.jpg)

Cognito, like Auth0, handles authentication by signing and sending [JSON Web Tokens](https://jwt.io/introduction/) when a user is successfully authenticated. The AWS Identity Federation solution can work with any provider, including Auth0, and it was really great to see support for MFA, Hooks managed through serverless Lambda functions, and much more. If you are interested in [using Auth0 with AWS, check out integration docs](https://auth0.com/docs/integrations/aws).

## Session: Build a Serverless, Face-Recognizing IoT Security System with Amazon Rekognition and MongoDB Stitch

This session was led by [MongoDB](https://www.mongodb.com/) CTO and Co-Founder Eliot Horowitz, and focused on two big topics: **building serverless applications** and **security**. Eliot introduced a new framework for building applications called [Stitch](https://www.mongodb.com/cloud/stitch), which is essentially a REST API for your MongoDB database. Stitch can be used to augment your existing applications or power your entire backend.

![Stitch](https://cdn.auth0.com/blog/aws-reinvent-2017/stitch.jpg)

Eliot showcased and live-coded four demos. The first demonstrated how to implement Stitch in an existing application by adding commenting functionality to a blog. The second and third demos focused on running your entire application backend from Stitch with various rules, permissions, and third-party service integrations. The fourth demo was the exciting one!

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Excitement around <a href="https://twitter.com/eliothorowitz?ref_src=twsrc%5Etfw">@eliothorowitz</a> talk is building! <a href="https://twitter.com/hashtag/MongoDB?src=hash&amp;ref_src=twsrc%5Etfw">#MongoDB</a> <a href="https://twitter.com/hashtag/reinvent2017?src=hash&amp;ref_src=twsrc%5Etfw">#reinvent2017</a> <a href="https://t.co/BJkp205RzS">pic.twitter.com/BJkp205RzS</a></p>&mdash; Meagen Eisenberg (@meisenberg) <a href="https://twitter.com/meisenberg/status/935565910428884994?ref_src=twsrc%5Etfw">November 28, 2017</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

For the fourth demo, Eliot had a door with a smart lock installed and showed how you can use Stitch, [Twilio](https://www.twilio.com/), and [AWS Rekognition](https://aws.amazon.com/rekognition/) to unlock your door with just your face. The live demo unfortunately failed, but the use case it presents is very interesting nonetheless. Stitch seems like a very interesting framework for building serverless applications and we will be sure to write a blog post on how to use it in the near future.

## Session: Translating the Promise of IoT into Business Value and Customer Success

The first IoT session I attended was hosted by [SalesForce](https://www.salesforce.com/) and run by SalesForce VP of IoT Lindsey Irvine, and Mark Relph, AWS Head of Business Development for IoT and Emerging Technology. In this talk, Lindsey framed IoT and AI as the fourth industrial revolution and shared some very powerful stories that backed that assertion.

![IoT Revolution](https://cdn.auth0.com/blog/aws-reinvent-2017/revolution.jpg)

IoT is comprised of three concepts: smart "things", the cloud, and analytics and intelligence. A smart device by itself is not very useful. It is when it's connected to the cloud where actionable events can occur that a "thing" gains usefulness. Finally, having analytics and data on what that "thing" is doing and constantly improving it is what will drive the next wave of IoT smart devices.

The demo that was presented cemented these three concepts. They showed a small solar panel device that was connected to AWS IoT that would send status updates on its health. If the solar panel was unable to process light or had a malfunction, it would alert a service technician that something was wrong and in many cases was able to tell the technician exactly what the problem was. Gathering analytics on all the solar panel "things", a company could keep better track of their panels and even anticipate when they would need maintenance before sending out a technician to the field for manual evaluations.

## Session: The future of location services is here. Revolutionizing the user experience with machine learning and AI.

The second IoT session I attended focused on improving the user experience with machine learning and AI. Eric Motazedi and Matthew Lancaster of [Accenture](https://www.accenture.com/us-en/new-applied-now) introduced Rhythm.io, a platform for building revolutionary user experiences leveraging the power of location, machine learning, and serverless technologies.

![Rhythm](https://cdn.auth0.com/blog/aws-reinvent-2017/rhythm.jpg)

Rhythm allows developers to build experiences that focus on giving humans the tools to build more personalized interactions. The demo they gave was focused on a hotel guest checking into a hotel. Rather than going to a registration desk, the guest would simply get out of their car, walk towards the entrance of the hotel, and be automatically checked in. Their room could also be personalized by setting the temperature for example to their preferred temperature. Going a step further, when the Rhythm framework detects that a guest is checking in, it could alert the bellman of who the guest is so that they can greet them by name. 

It may seem like science fiction, but the Rhythm team is focused on delivering this platform through a series of affordable IoT devices, machine learning, and AI.

## Aside: Auth0 and AWS

If you are using AWS to manage your infrastructure, whether it be traditional, serverless, or a mix, and are looking to better manage identity in your applications, Auth0 can help you to:

* Add authentication through traditional username/password databases.
* Add support for linking different user accounts with the same user.
* Support for generating signed JSON Web Tokens to call your APIs and flow the user identity securely.
* Analytics of how, when, and where users are logging in.
* Pull data from other sources and add it to the user profile, through [JavaScript rules](https://docs.auth0.com/rules).
* Achieve [SSO (Single Sign-On)](https://auth0.com/docs/sso) seamlessly.

<a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">Sign up</a> for a free account today and enjoy fast, seamless, and hassle-free authentication in your apps.

## Summary

That wraps up day two of the re:Invent. Tomorrow, Andy Jassy, the CEO of Amazon Web Services, will deliver the first of two AWS keynotes, and I can't wait to see all the big announcements!

[Click here for a recap of day one of AWS re:Invent](https://auth0.com/blog/aws-reinvent-day-1-recap/).
