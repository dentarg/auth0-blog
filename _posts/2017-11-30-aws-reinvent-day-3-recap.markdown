---
layout: post
title: "AWS re:Invent Day 3 Recap"
description: "AWS re:Invent continues with day three and Andy Jassy, the CEO of AWS, delivered his annual keynote address. Here is our recap of the exciting announcements he shared."
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

Thank you for tuning back in to our TL;DR of the AWS re:Invent conference. Day three kicked off with a keynote by AWS CEO Andy Jassy where he announced a large number of new services that really go above and beyond, and cement AWS as the premier cloud platform for organizations large and small. I was also able to sneak into a couple of great talks and sessions after the keynote, but the highlight of the day was the keynote. Here's a TL;DR of all the announcements.

## Compute

### New EC2 Instances

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">New instances. M5 as predicted, H1 for <a href="https://twitter.com/hashtag/BigData?src=hash&amp;ref_src=twsrc%5Etfw">#BigData</a> and I3M bare metal hi io. <a href="https://twitter.com/hashtag/ReInvent?src=hash&amp;ref_src=twsrc%5Etfw">#ReInvent</a> <a href="https://twitter.com/hashtag/Live?src=hash&amp;ref_src=twsrc%5Etfw">#Live</a> <a href="https://twitter.com/hashtag/launch?src=hash&amp;ref_src=twsrc%5Etfw">#launch</a> <a href="https://t.co/2og9C1IfM9">pic.twitter.com/2og9C1IfM9</a></p>&mdash; Peter Joseph (@CloudyNetwork) <a href="https://twitter.com/CloudyNetwork/status/935908201035325440?ref_src=twsrc%5Etfw">November 29, 2017</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

AWS already has one of the broadest sets of compute offerings. Today, they announced three more elastic compute instances: **M5**, **H1**, and [**I3M**](https://aws.amazon.com/blogs/aws/new-amazon-ec2-bare-metal-instances-with-direct-access-to-hardware/), a bare metal offering for organizations wanting to have direct access to the hardware. In addition to the new instances, they also announced a new pricing model for their spot instances, which allows developers to use EC2 resources at reduced prices.

### ECS for Kubernetes

[Kubernetes](https://kubernetes.io/) is making some pretty large waves in the container orchestration space and until now it was very much a manual process to set up Kubernetes on AWS. That is about to change with [Amazon Elastic Container Service for Kubernetes](http://www.businesswire.com/news/home/20171129006075/en/AWS-Announces-New-Container-Capabilities%E2%80%94Amazon-Elastic-Container) or EKS which is launching in preview this week. Amazon EKS fully manages the availability and scalability of the Kubernetes control plane for each cluster and will allow organizations to easily run Kubernetes without having expert Kubernetes knowledge.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Managed Kubernetes for AWS - The Elastic Container Service for Kubernetes (EKS) <a href="https://twitter.com/hashtag/reinvent?src=hash&amp;ref_src=twsrc%5Etfw">#reinvent</a> <a href="https://t.co/lqKpwoYjOK">pic.twitter.com/lqKpwoYjOK</a></p>&mdash; AWS re:Invent (@AWSreInvent) <a href="https://twitter.com/AWSreInvent/status/935909627224506368?ref_src=twsrc%5Etfw">November 29, 2017</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>


### AWS Fargate

What if you didn't want to manage container clusters at all? AWS may just have a solution for that as well. [AWS Fargate](https://aws.amazon.com/blogs/aws/aws-fargate/) is a service that they announced today that can deploy and manage containers for you so you don't have to manage any of the underlying architecture.

![AWS Fargate](https://cdn.auth0.com/blog/aws-reinvent-2017/fargate.jpg)

## Databases

I have a love/hate relationship with databases. They power the applications that I build and I actually have fun working with traditional relational database systems, especially PostgreSQL, but I hate setting up database servers. Andy had a few announcements in the database space that really got me excited for the future of database management—or should I say lack of management?

### Amazon Aurora Serverless

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Aurora Serverless &lt; <a href="https://twitter.com/ajassy?ref_src=twsrc%5Etfw">@ajassy</a> and <a href="https://twitter.com/awscloud?ref_src=twsrc%5Etfw">@awscloud</a> team is stealing my dreams and making them real<br><br>AMAZING NEW SERVICE/FEATURE<a href="https://twitter.com/hashtag/reinvent?src=hash&amp;ref_src=twsrc%5Etfw">#reinvent</a> <a href="https://t.co/MJFOOUOS2y">pic.twitter.com/MJFOOUOS2y</a></p>&mdash; Mark Nunnikhoven (@marknca) <a href="https://twitter.com/marknca/status/935913290676428802?ref_src=twsrc%5Etfw">November 29, 2017</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

We already have serverless functionality for our applications, why not our databases? That is the question Amazon is asking as well. [Aurora Serverless](https://aws.amazon.com/blogs/aws/in-the-works-amazon-aurora-serverless/) aims to bring the benefits of serverless computing to database management where you only get charged for the resources that you consume. This is perhaps the biggest announcement of Andy's keynote for me personally, and in my opinion, a real game-changer in the database management space.

### Amazon DynamoDB Global Tables

[DynamoDB](https://aws.amazon.com/blogs/aws/new-for-amazon-dynamodb-global-tables-and-on-demand-backup/) is Amazon's key/value database offering and it is a pretty impressive one at that. During Prime Day, DynamoDB served over 12.9 million requests per second bringing a whole new meaning to the term big data and web scale. Over 3.34 trillion requests were served for Prime Day in total. DynamoDB Global Tables provides a fully managed multi-region NoSQL database that allows you to provide localized reads and writes to your data wherever your users may be.

### Amazon Neptune

Graph databases have been growing in popularity recently and Amazon will have an official player in the game with [Amazon Neptune](http://www.businesswire.com/news/home/20171129006077/en/AWS-Announces-New-Capabilities-Amazon-Aurora-Amazon). The promise of this graph database is that it will be fast, reliable, and of course fully managed by AWS. Another big benefit of Neptune is the ability to use multiple graph query languages such as TinkerPop and SPARQL.

## Machine Learning

If "Big Data" was the buzzword that dominated our industry the last five years, "Machine Learning" will be the buzzword that dominates the next five. The promise of machine learning is that it will allow organizations the ability to provide much more personal and relevant experiences to each and every user. We're seeing machine learning used in everything from image recognition, recommendation engines, to healthcare. AWS had lots of announcements in this space.

### Amazon Rekognition Video

The [Amazon Rekognition](https://aws.amazon.com/rekognition/) service provides developers with an API to make sense of images. For example, you feed it an image and it will tell you what it sees, for example, correctly identifying humans and other objects. [Amazon Rekognition Video](https://aws.amazon.com/blogs/aws/launch-welcoming-amazon-rekognition-video-service/) does the same exact thing, but for video content. It will be able to track people, detect various activities, recognize various objects, celebrities, and even inappropriate objects. This can be done with existing video and even live streams, which opens up a wide array of potential use cases.

### Amazon Transcribe

[Amazon Transcribe](https://aws.amazon.com/blogs/aws/amazon-transcribe-scalable-and-accurate-automatic-speech-recognition/) will equip developers with automatic speech recognition (ASR), allowing them to easily add speech-to-text capability to their applications.

### Amazon Translate

With more and more apps reaching a global audience, having correct localized translations for various languages is a challenge that [Amazon Translate](https://aws.amazon.com/blogs/aws/introducing-amazon-translate-real-time-text-language-translation/) is hoping to tackle with its neural machine translation service. The service promises to allow developers to localize websites and applications for international users with ease.

### Amazon Comprehend

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Announcing Amazon Comprehend. A full managed natural language processing service. Extract entities, key phrases &amp; sentiment <a href="https://twitter.com/hashtag/reInvent?src=hash&amp;ref_src=twsrc%5Etfw">#reInvent</a> <a href="https://t.co/gZE4i7TUNM">pic.twitter.com/gZE4i7TUNM</a></p>&mdash; AWS re:Invent (@AWSreInvent) <a href="https://twitter.com/AWSreInvent/status/935933201888944130?ref_src=twsrc%5Etfw">November 29, 2017</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

[Amazon Comprehend](https://aws.amazon.com/blogs/aws/amazon-comprehend-continuously-trained-natural-language-processing/) is an interesting service that uses natural language processing and machine learning to find insights and relationships in text. Developers can use this API to extract places, people, brands, and events to get a better understanding of what is presented in the text. Analyzing large quantities of documents, developers will be able to extract key topics and meaning from their datasets.

### Amazon SageMaker

If you aren't looking to translate, transcribe, or understand your content, perhaps you want to do something else with it. [Amazon SageMaker](https://aws.amazon.com/blogs/aws/sagemaker/) is a fully managed service enabling data scientists to build, train, and deploy machine learning models for any dataset. SageMaker will work with a variety of different platforms such as [TenserFlow](https://www.tensorflow.org/), [MXNet](https://mxnet.incubator.apache.org/), and others. Through its managed capability, it will help data scientists make sense of their data faster and with greater accuracy.

![Amazon SageMaker](https://cdn.auth0.com/blog/aws-reinvent-2017/sagemaker.png)

### AWS DeepLens

[AWS DeepLens](https://aws.amazon.com/blogs/aws/deeplens/) is a wireless video camera and development kit that allows developers to get a better understanding of machine learning concepts. DeepLens will be released next year and will come with various samples to help developers learn more about what's possible with machine learning and how to get started.

## IoT

IoT is another buzzword that has been around for a little while but seems ready to take the world by storm. AWS had many announcements that will make working with IoT a much more pleasant experience than before.

### AWS IoT 1-Click

[AWS IoT 1-Click](http://www.businesswire.com/news/home/20171129006079/en/AWS-Announces-Slew-New-IoT-Services-Brings) is a service that makes it easy to trigger [AWS Lambda](https://aws.amazon.com/lambda/) functions from devices. If you've used [Amazon Dash](https://www.amazon.com/Dash-Buttons/b?ie=UTF8&node=10667898011) buttons in the past, the concept is fairly similar, only applied to any IoT device.

### AWS IoT Analytics

[AWS IoT Analytics](https://aws.amazon.com/blogs/aws/launch-presenting-aws-iot-analytics/) will give developers greater insight into the data their IoT devices collect. This fully managed service will collect, process, enrich, and analyze IoT device data at scale.

### Amazon FreeRTOS

[Amazon FreeRTOS](https://aws.amazon.com/blogs/aws/announcing-amazon-freertos/) is an IoT operating system for low-power edge devices that is easy to program, deploy, secure, connect to, and maintain. It is available free of charge, is fully open source, and best of all, available to all today.

## Security, Identity, and Compliance

I was very excited to learn about what identity and security announcements Amazon was going to announce today, and I have to say, I did not leave disappointed. Cognito is becoming a fully fledged identity platform, but that's not all Andy had up his sleeve.

### Advanced Security Features for Amazon Cognito

Amazon announced a number of advanced security features for [Amazon Cognito](https://aws.amazon.com/cognito/) including multifactor authentication, breached password detection, and various anomaly detection features. All of these features launched in beta today. If you need these features in a production-ready capacity right now, we at Auth0 also provide [multifactor authentication](https://auth0.com/multifactor-authentication), [breached password detection](https://auth0.com/breached-passwords), and [anomaly detection](https://auth0.com/docs/anomaly-detection).

### Amazon GuardDuty

Keeping your servers secure is important. [Amazon GuardDuty](https://aws.amazon.com/blogs/aws/amazon-guardduty-continuous-security-monitoring-threat-detection/) aims to make security a little easier by providing a managed threat detection service that allows your DevOps team to continuously monitor and protect your AWS accounts and workloads. The best part? It can be enabled with a few simple toggles in the AWS management console.

That sums up the major announcements from today's keynote. I'm sure we missed a couple as they were coming at us one after another. Werner Vogels, CTO of AWS, will deliver his two-hour keynote tomorrow and we will be sure to cover all of the announcements that he makes as well. As for the sessions I attended today, two really stood out:

## Session: AWS Security State of the Union

Steve Schmidt, chief information security officer of AWS, delivered the AWS Security State of the Union talk. The key takeaway from his talk was his mechanisms to drive security in an organization, and they are:

* **Buy-in from leadership** - security cannot be an afterthought.
* **Radically restricting and monitoring human access to data** - humans and data don't mix, follow the principle of least privilege.
* **Source code security**.
* **Patching** - everybody hates doing it, but it must be done.
* **Log retention duration** - storage is fairly cheap; once deleted, logs are lost forever.
* **Credential blast radius detection** - use IAM roles properly to ensure that if credentials are leaked, damage will be minimal.
* **Credentials lifespan reduction** - no long-lived tokens and continuous rotation of credentials.
* **TLS implementation** - encrypt data in motion and at rest.
* **AWS encryption everywhere**.
* **Canaries and invariants for security functionality**.

At Auth0, we follow many of these principles to the T to ensure that we are delivering the most secure platform for our customers and users.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">That’s a lot of 0’s... AWS <a href="https://twitter.com/hashtag/reInvent?src=hash&amp;ref_src=twsrc%5Etfw">#reInvent</a> Security State of The Union <a href="https://t.co/1PX9zuViS8">pic.twitter.com/1PX9zuViS8</a></p>&mdash; Teri Radichel (@TeriRadichel) <a href="https://twitter.com/TeriRadichel/status/935978817440530433?ref_src=twsrc%5Etfw">November 29, 2017</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>


## Session: Best Security Practices in the Intelligence Community

This breakout session included guest speakers from the US Intelligence Community, including Scott Kaplan, Deputy Chief of the NGA and John Nicely, Chief of Cloud Security for the US Government. They shared their lessons learned from moving their infrastructures from on-premise deployments to the cloud and how it allowed their organizations to respond quicker and with greater accuracy. This is definitely a talk I look forward to revisiting once it is posted online after AWS re:Invent 2017 concludes.

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

Day three of AWS re:Invent 2017 was very eventful. Andy's keynote has set the tone for the rest of the conference and that tone is "everything is everything." AWS wants to give you the best infrastructure to build and deploy your applications. Currently, the number of services offered by AWS is approaching 4,000! I can't wait to see what tomorrow has in store for us.

Previous recaps:

* [Day One](https://auth0.com/blog/aws-reinvent-day-1-recap/)
* [Day Two](https://auth0.com/blog/aws-reinvent-day-2-recap/)
