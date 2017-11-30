---
layout: post
title: "AWS re:Invent Day 3 Recap"
description: "AWS re:Invent continues with day two. Here is our recap of the exciting announcements and interesting talks we were able to attend."
date: 2017-11-30 8:30
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
- 2017-11-29-aws-reinvent-day-2-recap
- 2017-11-28-aws-reinvent-day-1-recap
- 2017-07-21-the-role-of-identity-in-application-modernization
---

Thank you for tuning back in to our TL;DR of the AWS re:Invent conference. Day three kicked off with a keynote by AWS CEO Andy Jassy where he announced a large number of new services that really go above and beyond and cement AWS as the premier cloud platform for organizations large and small. I was also able to sneak into a couple of great talks and sessions after the keynote, but the highlight of the day was the keynote. Here's a TL;DR of all the announcements.

## Announcement: Compute

### New EC2 Instances

AWS already has one of the broadset sets of compute offerings. Today, they announced three more elastic compute instances: **M5**, **H1**, and [**I3M**](), a bare metal offering for organizations wanting to have direct access to the hardware. In addition to the new instances, they also announces a new pricing model for their spot instances, which allow developers to use EC2 resources at reduced prices.

### ECS for Kubernetes

[Kubernetes]() is making some pretty large waves in the container orchestration space and until now it was very much a manual process to setup Kubernetes on AWS. That is about to change with Amazon Elastic Container Service for Kubernetes or EKS which is laucnhing in preview this week. Amazon EKS fully manages the availability and scalability of the Kubernetes control plane for each cluster and will allow organizations to easily run Kubernetes without having expert Kubernetes knowledge.

### AWS Fargate

What if you didn't want to manage contrainer clusters at all? AWS may just have a solution for that as well. [AWS Fargate]() is a service that they announced today that can deploy and manage containers for you so you don't have to manage any of the underlying architecture. This service is not ready yet, but will be coming in early 2018.

## Databases

I have a love/hate relationship with databases. They power the applications that I build and I actually have fun working with traditional relational database systems, especially PostgreSQL, but I hate setting up database servers. Andy had a few announcements in the database space that really got me excited for the future of database management, or should I say lack of management?

### Amazon Aurora Serverless

We already have serverless functionality for our applications, why not our databases? That is the question Amazon is asking as well. [Aurora Serverless]() aims to bring the benefits of serverless computing to database management where you only get charged for the resources that you consume. This is perhaps the biggest announcement of Andy's keynote for me personally and I think a real game-changer in the database management space.

### Amazon DynamoDB Global Tables

[DynamoDB]() is Amazon's key/value database offering and it is a pretty impressive one at that. During Prime Day, DynamoDB served over 12.9 million requests per second bringing a whole new meaning to the term big data and web scale. Over 3.34 trillion requests were served for Prime Day in total. DynamoDB Global Tables provides a fully managed multi-region NoSQL database that allow you to provide localized reads and writes to your data wherever your users may be.

### Amazon Neptune

Graph databases have been growing in popularity recently and Amazon will have an official player in the game with [Amazon Neptune](). The promise of this graph database is that it will be fast, reliable, and of course fully managed by AWS. Another big benefit of Neptune is the ability to use multiplate graph query languages such as TinkerPop and SPARQL.

## Machine Learning

If "Big Data" was the buzzword that dominated our industry the last five years, "Machine Learning" will be the buzzword that dominates the next five. The promise of machine learning is that it will allow organizations the ability to provide much more personal and relevant experiences to each and every user. We're seeing machine learning used in everything from image recognition, recommendation engines, and healthcare. AWS had lots of announcements in this space.

### Amazon Rekognition Video

The [Amazon Rekognition]() service provides developers with an API to make sense of images. For example, you feed it an image and it will tell you what's it sees for example correctly identifying humans and other objects that it sees. [Amazon Rekognition Video]() does the same exact thing, but for video content. It will be able to track people, detect various activities, recognize various objects, celebrities, and even inappropriate objects. This can be done with existing video and even live streams which opens up a wide array of potential use cases.

### Amazon Transcribe

[Amazon Transcribe]() will equip developers with automatic speech recognition (ASR), allowing developers to easily add speech-to-text capability to their applications.

### Amazon Translate

With more and more apps reaching a global audience, having correct localized translations for various languages is a challenge that [Amazon Translate]() is hoping to tackle with its neural machine translation service. The service promises to allow developers to localize websites and applications for international users with ease.

### Amazon Comprehend

[Amazon Comprehend]() is an interesting service that uses natural language processing and machine learning to find insights and relationships in text. Developers can use this API to extract places, people, brands, and events to get a better understanding of what is presented in the text. Analyzing large quantities of documents, developers will be able to extract key topics and meaning from their datasets.

### Amazon SageMaker

If you aren't looking to translate, transcribe, or understand your content, perhaps you want to do something else with it. [Amazon SageMaker]() is a fully managed service enabling data scientists to build, train, and deploy maching learning models for any dataset. SageMaker will work with a variety of different platforms such as [TenserFlow](), [MXNet](), and others and through its managed capability will help data scientists make sense of their data faster and with greater accuracy.

### AWS DeepLens

[AWS DeepLens]() is a a wireless video camera and development kit that allows developers to get a better understanding of machine learning concepts. DeepLens will be released next year and will come with various samples to help developers learn more about what's possible with machine learning and how to get started.

## IoT

IoT is another buzzword that has been around for a little while but seems ready to take the world by storm. AWS had many announcements that will make working with IoT a much more pleasent experience than before.

### AWS IoT 1-Click

[AWS IoT 1-Click]() is a service that makes it easy to trigger [AWS Lambda]() functions from devices. If you've used [Amazon Dash]() buttons in the past, the concept is fairly similar but just applied to any IoT device.

### AWS IoT Analytics

[AWS IoT Analytics]() will give developers greater insight into the data their IoT devicees collect. This fully managed service will collect, process, enrich, and analyze IoT device data at scale.

### Amazon FreeRTOS

[Amazon FreeRTOS]() is an IoT operating system for low-power edge devices that is easy to program, deploy, secure, connect to, and maintain. It is available free of charge, is full open source, and best of all available to all today.

## Security, Identity, and Compliance

I was very excited to learn about what identity and security announcements Amazon was going to announce today, and I gotta say I did not leave disappointed. Cognito is becoming a fully fledged identity platform, but that's not all Andy had up his sleeve.

### Advanced Security Features for Amazon Cognito

Amazon announced a number of advanced security features for [Amazon Cognito]() including multifactor authentication, breached password detection, and various anomaly detection features. All of these features launched in beta today. If you need these features in a production ready capacity today, we at Auth0 also provide [multifactor authentication](), [breached password detection](), and [anomaly detection]().

### Amazon GuardDuty

Keeping your servers secure is important. [Amazon GuardDuty]() aims to make security a little easier by providing a manged threat detection service that allows your devops team to continuously monitor and protect your AWS accounts and workloads. The best part? It can be enabled with a few simple toggles in the AWS management console.

That sums up the major announcements from today's keynote. I'm sure we missed a couple as they were coming at us one after another. Werner Vogels, CTO of AWS, will deliver his two-hour keynote tomorrow and we will be sure to cover all of the announcements that he makes as well. As for the sessions I attended today, two really stood out:

## Session: AWS Security State of the Union

Steve Schmidt, chief information security officer of AWS, delivered the AWS Security State of the Union talk. The key takeaway from his talk was his mechanisms to drive security in an organization, and they are:

* Buy-in from leadership - security cannot be an afterthought.
* Radically restricting and monitoring human access to data - humans and data don't mix, follow the principle of least priviledge.
* Source code security.
* Patching - everybody hates doning it, but it must be done.
* Log retention duration - storage is fairly cheap, once deleted logs are lost forever.
* Credential blast radius detection - use IAM roles properly to ensure that if credentials are leaked damage will be minimal.
* Credentials lifespan reduction - no long lived tokens and continous rotation of credentials.
* TLS implementation - encrypt data in motion and at rest.
* AWS encryption everywhere.
* Canaries and invariants for security functionality.

We at Auth0 follow many of these principles to the T to ensure that we are delivering the most secure platform for our customers and users.

## Session: Best Security Practices in the Intelligence Community

This breakout session include guest speakers from the US Intelligence Community, including Scott Kaplan, Deputy Chief of the NGA and John Nicely, Chief of Cloud Security for the US Government. They shared their lessons learned from moving their infrastructures from on-premise deployments to the cloud and how it allowed their organizations to respond quicker and with greater accuracy. This is definitely a talk I look forward to revisiting once it is posted online after AWS re:Invent 2017 concludes.

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
