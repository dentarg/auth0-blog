---
layout: post
title: The Difference Between Web Access Management and Identity Management
description: "The risks of legacy authentication and why you should migrate to IAM"
longdescription: "Organizations are migrating from Web Access Management systems to more integrated Identity Management (IdM) and Identity and Access Management (IAM) solutions. Learn the difference between Web Access Management and Identity Management"
date: 2018-03-19 10:31
category: Growth, Identity
is_non-tech: true
author:
  name: "Diego Poza"
  url: "https://twitter.com/diegopoza"
  mail: "diego.poza@auth0.com"
  avatar: "https://avatars3.githubusercontent.com/u/604869?v=3&s=200"
design:
  bg_color: "#6E2D18"
  image: https://cdn.auth0.com/blog/difference-wam-iam/logo.png
tags:
- iam
- identity
- identity-management
- web-access-management
related:
- 2017-12-08-how-poor-identity-access-management-equals-security-breaches
- 2018-01-19-how-iam-can-help-your-enterprise-get-mobile
- 2018-02-02-3-ways-to-get-an-iam-budget-in-2018
---

Many businesses, especially those that appeared online in the 1990s, invested large amounts of time and money deploying complex identity authorization systems across their business.

A large number of these systems have web access management, or WAM, as their central design metaphor. At one point, WAM was one of the most common ways for large companies to handle identification and resource access inside their businesses.

As time passed, however, these kinds of systems have grown increasingly expensive to maintain, and most are unprepared for the kind of threats and issues that businesses need to worry about today. In other words, legacy WAM solutions leave your business exposed. 

{% include tweet_quote.html quote_text="Web access management systems are expensive to maintime and unprepared for the threats of today." %}

## What Is Web Access Management?

Web access management systems are focused on providing security to web-based tools and applications, and they focus on two main identity operations:

* **Authentication**: Ensuring a given user is who they claim to be
* **Authorization**: Ensuring a given user has permission to access a particular web page/area of a web product

First appearing in the 1990s, most WAM products also permitted the use of limited single sign on (SSO)—allowing users to sign in with their credentials on one domain and then use those same credentials to access data on other domains without signing in a second time. 

WAM products were generally deployed using one centralized authentication server and as many individual agents as necessary to cover all of a corporation's web servers. 

![Web access management](https://cdn.auth0.com/blog/the-difference-between-wam-and-idm/web-access-management.png)
 
In this traditional on-premises setup, requests for access went from users to the agents on individual servers, each of which would call back to an external server to either approve or deny access.

Web access management systems could also be set up using proxy servers (in which all requests would flow through a single proxy server) or tokens (in which users use individual tokens to gain access to the resources they need).

![Proxy server request flow](https://cdn.auth0.com/blog/the-difference-between-wam-and-idm/proxy-server-request-flow.png)

_How a proxy server works. Requests flow from servers within the library (network) to a proxy server on that local network, and finally out to the external internet._ 

All of these types of deployments were complicated, expensive (and even more expensive to maintain) and rooted tightly in an “on-premises” model—where the perimeter of your network is limited by the perimeter of your building.

Today, most organizations are moving on and migrating to more integrated identity management (IdM) and identity and access management (IAM) solutions.

## What Is Identity Management (IdM)?

Identity management (IdM) is an umbrella term for all  of the core logic around identity in a corporate environment.That means:

* **Provisioning**: Assigning identities to users
* **Account management**: Maintaining those identities
* **Identity governance**: Assigning them to groups and roles and adjusting permissions as needed

IdM is often used interchangeably with IAM, or identity and access management. IAM, however, is most often used to refer not just to identification but to the whole suite of practices that a corporation needs to manage their users and data, including:

* **Authentication**: Ensuring that a given user is the user they identify as
* **Authorization**: Ensuring the given user has the proper permissions to access a certain piece of data
* **Identity federation**: Ensuring users can use the same identification data to access resources on related domains

In other words, [IAM](https://auth0.com/learn/cloud-identity-access-management/) is the entire set of practices around identity that an organization needs to allow “the right individuals to access the right resources at the right times for the right reasons.”

## The Difference Between Web Access Management and Identity Management

The primary difference between legacy web access management and more modern identity and access management is the comprehensiveness and flexibility of the solutions they offer.

Web access management systems don't generate user identities, provision them or maintain those identities over time. They rely on an identity provider—an IdP—to do that.

![Auth0 dashboard](https://cdn.auth0.com/blog/the-difference-between-wam-and-idm/auth0-dashboard.png)

_The Auth0 web management dashboard._

At the same time, because their standards are often a few years behind, legacy WAM providers generally don't allow for the use of technologies like Google Authenticator, multifactor authentication, and Touch ID. And that's just the tip of the iceberg—other shortcomings of WAM solutions include:

* **Slowed development time**: Maintaining interoperability between your IdP and WAM—and maintaining your network architecture requirements more generally—means you'll be slower to push out new applications, both internally and for your customers.
* **Security vulnerabilities**: Because of the maintenance needs of legacy WAM setups, and their general inflexibility to new technologies, they can leave both you and your customers vulnerable to security breaches.
* **Customer engagement**: Modern marketing and analytics tools that can help you leverage customer data in powerful ways to retain and acquire new revenue require modern, integrated identity solutions.

An IAM like Auth0, on the other hand, can serve as an IdP or identity provider (although you can use your own IdP as well, of course), an identity manager (for provisioning/maintaining user identities) and an access manager (for your native, mobile or web applications).

It can connect to a wide variety of social and enterprise identity providers and APIs and applications—and provide single sign on, granular user management, extensibility with JavaScript and the most up-to-date security protocols.

![IAM in the cloud](https://cdn.auth0.com/blog/the-difference-between-wam-and-idm/iam-in-the-cloud.png)

The biggest reason why IAM is surpassing the role of WAM in the modern day is the cloud. The traditional on-premises identity management that many enterprises have used for decades served its purpose. Today, however, more and more of the activity in the workplace is not literally in the workplace. It's in the coffee shop, or at a co-working space, or at home, or on the road—and no matter where your employees are, they will most likely need to access some kind of privileged resources every day.

{% include tweet_quote.html quote_text="Identity management is surpassing the role of web access management because of the cloud." %}

The cloud makes identities more complex because it removes the on-prem notion of “perimeter security.” You can no longer protect your company's network by just securing your four walls—your notion of security must extend to all the BYOD devices and public wireless networks that your employees are using to do their work.

## Identity Management in the Cloud

Legacy authentication tools sold themselves to their customers with the promise of airtight, long-term security. But the world those authentication tools must live in has changed.

Auth0 is [SOC 2 Type II certified](https://auth0.com/why-auth0) and offers HIPAA BAA agreements to healthcare companies that must comply with HIPAA regulations as part of their business. Auth0 also conforms to the OpenID Connect protocol and the new EU-U.S. Privacy Shield Framework for data privacy. 

Whether you're migrating from a WAM provider, looking to extend your current system of [enterprise federation](https://auth0.com/learn/identity-management-matters-finance-2/), or just looking to learn more about what identity and access management looks like today, [read more about us here](https://auth0.com/learn/).
