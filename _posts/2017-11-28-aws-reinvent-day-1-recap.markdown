---
layout: post
title: "AWS re:Invent Day 1 Recap"
description: "The annual Amazon Web Services (AWS) re:Invent conference kicks off this week. Here's a TL;DR of all the big announcements as well as our observations and things we learned."
date: 2017-11-28 8:30
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
- 2017-11-30-aws-reinvent-day-3-recap
- 2017-12-01-aws-reinvent-day-4-recap
---

The AWS re:Invent conference is back in Las Vegas this week and with it comes **five** days of awesome talks, deep-dives, and of course, huge announcements that promise to boost developer productivity, make DevOps simpler, and help companies grow and scale. This year the conference is spread across five hotels on the Las Vegas Strip and features over 1,500 different talks. I would love to be able to attend each one, but since I can't be in 100 places at once, I will share what I learned at the talks I could attend as well as the general announcements that Amazon will have when they host their keynotes on Wednesday and Thursday this week.

![AWS Registration](https://cdn.auth0.com/blog/aws-reinvent-2017/registration.jpg)

At Auth0, we deeply care about **security, compliance, and identity**, and as luck would have it, re:Invent features 117 sessions on just that. The other topic that I focused on today was **serverless** computing and I learned a ton. Since there was no keynote today, below are things I learned at the breakout sessions.

## Session: IAM for Enterprises: How Vanguard Strikes the Balance Between Agility, Governance, and Security

This session was hosted by AWS Security Consultant Reef Dsouza and Senior Security Architect for [Vanguard](https://investor.vanguard.com/corporate-portal/), Rajeev Sharma. Reef set the stage by sharing some best practices when it comes to Identity and Access Management (IAM) and how AWS can help. Some general tips shared include:

* **Defense in Depth** - multiple layers of security.
* **Separation of Duties** - well-defined roles and permissions.
* **Principle of Least Privilege** - users should only have access to what they absolutely need.

Rajeev went on to explain how Vanguard, one of the largest investment companies in the world, applied these guidelines when moving their architecture to the AWS cloud and the numerous benefits that it brought them. 

Many of the best practices that Reef shared, we at [Auth0](https://auth0.com) have been very vocal about as well. [Read our five tips on how you can make your app more secure in less than 20 minutes](https://auth0.com/blog/5-ways-to-make-your-app-more-secure-in-less-than-20-minutes/).  

## Session: Serverless for Security Officers: Paradigm Walkthrough and Comprehensive Security Best Practices

This session, hosted by Jonathan Desrocher, Eugene Yu, and Henrik Johansson, focused on best security practices as they pertain to serverless applications. Serverless applications are gaining more and more momentum, and whether you go with [AWS Lambda](https://aws.amazon.com/lambda/), [Auth0 Webtask](https://webtask.io), or another serverless platform, you are sure to have questions on the various security considerations that arise when using these platforms.

![Serverless Security Paradigm](https://cdn.auth0.com/blog/aws-reinvent-2017/security.jpg)

The good news is that essentially all the best security practices that pertain to traditional applications also apply to serverless applications as well. The bad news is that each function is a potential attack vector, so they require a bit more effort and attention to properly secure. Additionally, with serverless, the platform provider takes on a much larger role when it comes to securing the application, but at the end of the day, security is everyone's responsibility.

## Session: Credentials, Credentials, Credentials, Oh My!

Quint Van Deman of AWS hosted this **chalk talk**, which consisted of a 10-15 minute presentation on best practices when it comes to managing the various credentials in the AWS ecosystem, and then a 45 minute Q&A session where he asked the audience for use cases and worked out best practices for those use cases. We covered many complex use cases involving the various AWS credential services including Cognito, Secure Token Service (STS), and various forms of credential exchanges whether internal at AWS or exchanging credentials from a third party service like Auth0.

![AWS Credentials](https://cdn.auth0.com/blog/aws-reinvent-2017/credentials.jpg)

One of the key takeaways from this session was that having a centralized source of truth and federating that identity throughout your infrastructure was superior to having multiple identity stores for the different applications in your infrastructure. [Learn more about Single Sign On](https://auth0.com/blog/what-is-and-how-does-single-sign-on-work/) and [how you can call AWS APIs with Auth0 tokens](https://auth0.com/docs/integrations/aws).

## Session: Evolution of Serverless Architectures Through the Lens of Community

Serverless is taking the development world by storm. This was a very enlightening talk by Peter Sbarski and Sam Kroonenburg of [A Cloud Guru](https://acloud.guru/), one of the early adopters of serverless technology. Sam, the founder of A Cloud Guru, even showed that their production account had no active Amazon EC2 instances. This session focused on the growth of serverless architectures over the last three years and highlighted some of the providers as well as consumers of serverless technologies. Sam also covered the growing community around serverless which included quotes from many prominent members of the community, serverless meetups around the world, and even a conference!

![Auth0 at AWS](https://cdn.auth0.com/blog/aws-reinvent-2017/auth0.png)

Auth0's [Webtask](https://webtask.io) also got a shout-out, as did [Auth0's identity solution](https://auth0.com). Sam closed out his talk by sharing some emerging patterns in the serverless community, especially [application modernization and microservices, which you can learn much more about here](https://auth0.com/blog/getting-a-competitive-edge-with-a-microservices-based-architecture/).

Finally, Hernan Garcia of [CityWallet](https://www.citywallet.net/) gave a real-world example of how he and his team achieved success with a serverless architecture when their more traditional methods failed and put their startup at risk.

## Session: Compliance and Top Security Threats in the Cloud—Are You Protected?

We closed out the day with a very informational session on top security threats that organizations face by Teri Radichel of [WatchGuard Technologies](https://www.watchguard.com/) and Boyan Dimitrov of [Sixt](https://www.sixt.com/). The top threats included were:

* **Unprotected keys and credentials.**
* **Broad permissions for engineers.**
* **Unpatched software.**
* **Malicious software updates.**
* **Open network ports.**
* **Flat network design.**
* **Broad permissions for applications.**
* **Bad configuration management.**
* and **Data Exfiltration.**

Teri discussed how these threats led to large data breaches such as the [Equifax Data Breach](https://auth0.com/blog/equifax-data-breach/) that leaked the Social Security Numbers of almost all Americans and the [WannaCry Ransomware](https://auth0.com/blog/a-massive-ransomware-attack-targets-organizations-around-the-globe/) which locked out banks, airlines, and even hospitals. 

Boyan discussed strategies on how to mitigate risk and the key takeaway was that compliance does not equal security. Many of the companies that experienced data breaches were compliant with many standards and organizations but were still breached. Security is something that must be constantly monitored to be effective.

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

Day 1 of the re:Invent was very eventful. I wish I could have attended more talks, but the talks I could make it to were very insightful and left me wanting more. Tune in the rest of the week as I cover more in-depth sessions as well as the keynotes. I hope you find this TL;DR useful.
