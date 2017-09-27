---
layout: post
title: "SAP to Acquire Gigya IAM Platform"
description: "Learn what features to assess when your IAM product changes ownership."
date: 2017-09-26 8:30
category: Announcements
banner:
  text: "Auth0 makes it easy to add authentication to your application."
author:
  name: "Kim Maida"
  url: "https://twitter.com/kimmaida"
  mail: "kim.maida@auth0.com"
  avatar: "https://en.gravatar.com/userimage/20807150/4c9e5bd34750ec1dcedd71cb40b4a9ba.png"
design:
  image: https://cdn.auth0.com/blog/...
  bg_color: "#"
tags:
- migration
- gigya
- sap
related:
- 2017-03-06-how-to-migrate-your-existing-stormpath-users-to-auth0
---

## SAP to Acquire Gigya 

[On September 24, 2017 Gigya announced that they will be acquired by SAP](http://www.gigya.com/gigya-the-market-leader-in-customer-identity-and-access-management-to-be-acquired-by-sap/). [Gigya](http://gigya.com) offers a Customer Identity and Access Management (IAM) platform. [SAP](https://www.sap.com/index.html) is buying Gigya to enhance its [Hybris Profile service](https://www.yaas.io/products/saphybrisprofile.html). Gigya currently manages 1.3 billion customer identities.

![SAP acquires Gigya](https://cdn.auth0.com/blog/gigya/gigya.jpg)

With this news, current Gigya customers should be very interested in learning more about SAP's plans for an integration strategy. The acquisition announcement stated the following:

> "Gigya’s consent-based identity data platform and SAP Hybris® Profile data matching and enrichment capabilities to be integrated" —[Gigya Press Release](http://www.gigya.com/gigya-the-market-leader-in-customer-identity-and-access-management-to-be-acquired-by-sap/)

SAP has announced that the acquisition will allow them to offer a cloud-based data platform for user data collection and that Gigya's 300+ employees will become part of the SAP Hybris business unit.

## Assessing an IAM Platform

It is currently unclear whether Gigya's services and APIs will remain functionally equivalent after the business transaction with SAP is completed. At the time of writing, SAP has not announced its _integration strategy_ for Gigya. This creates uncertainty for customers.

There are several features and key interests to look for when assessing a new IAM platform, or _re-assessing_ your existing platform when it is acquired by a different company. Let's explore them now:

### Customer and Platform Support

Excellent **customer support** is a key feature of any product, and especially so with products offered as-a-service. Make sure  the platform has a robust and responsive support system with a dedicated and knowledgeable team of experts who can assist with both administrator and developer needs.

Continued **platform support and development** is vital as well. A product should be actively supported and improved. Potential customers should look for continued innovation, features, and added support for new security regulations, technologies, and applications.

### Core Competency of the Company

When assessing the future of a platform that has been bought by a different company, it's especially important to assess the core competency of the acquiring company. **Core competency** refers to the main strengths and technical capacity of the company in the marketplace.

For example, if you are responsible for a healthcare institution and you have an IAM solution already, you likely chose that solution with certain things in mind, such as HIPAA compliance, enterprise federation, and auditing and monitoring capabilities. However, if your current platform is then acquired by a company whose core competency is limited to retail and e-commerce, your platform's support for the features you need may decrease significantly or even be discontinued altogether.

### Flexibility to Manage Multiple Business Use Cases on a Single Platform

A platform's **ability to fully support multiple business use cases** is a key feature to look for. Regardless of your _current_ primary use case, you should assess the product's capability to use a single platform for [B2B](https://auth0.com/b2b-enterprise-identity-management), [B2C](https://auth0.com/b2c-customer-identity-management), [B2E](https://auth0.com/b2e-identity-management-for-employees), [IoT](https://auth0.com/docs/tutorials/authenticating-devices-using-mqtt), [Cloud IAM](https://auth0.com/learn/cloud-identity-access-management/), and more. This flexibility means that as your business grows and expands its needs, your IAM platform will enable and support that growth with ease.

### Independent Authentication Layer with Robust Integration Capabilities

When selecting an IAM platform, you should look for a solution that **specializes in authentication, identity, and access management while maintaining independence from any software that might utilize it**. An IAM platform should support easy integration with a large variety of Identity Providers (IdPs) and applications.

For example, a company may distribute a specific suite of applications. They may also offer an IAM platform that enables authentication and shared identity across all applications in that suite. However, if the IAM platform is tightly integrated with a specific set of software, you should carefully assess whether the platform has good support for IdPs or applications _outside_ that ecosystem.

### Extensibility

A first-class IAM platform should be extensible. Every company is different and has its own needs and requirements. An IAM platform needs to be able to **meet the needs of _all_ of its customers, necessitating extensibility** in a number of different ways. A few ways in which the platform should be extensible include, but are not limited to:

* The ability to add custom functionality to the platform.
* Support for customization of authentication and authorization experiences, including profile enrichment, access roles, and more.
* Support for custom actions during the exchange of credentials as well as before, during, and after user registration.

### Deployment Options

Your IAM platform should support multiple deployment options to best suit the customer's needs. You may require a public _or_ private Software-as-a-Service (SaaS) deployment, or may require deployment on-premises. When assessing an IAM platform, you should ensure that the solution provides not only the option you currently require, but others that may become necessary to your business in the future.

## Summary

SAP and Gigya have an acquisition agreement in place. At the time of the announcement, there is no established integration strategy for Gigya customers to review and consider. Hopefully additional clarity around the future of Gigya's product and customers is coming in the near future. Depending on what SAP plans for the future of Gigya's IAM platform, it may be prudent to consider all possibilities, including potential opportunities with other IAM offerings.

When assessing IAM platforms, there are many key features you should investigate. You should also ensure that if your current IAM platform is acquired by a different company, you carefully assess any changes to the product and make sure that the integration strategy is transparent and clearly communicated to existing customers.

## About Auth0

[Auth0](https://auth0.com)'s platform for Identity and Access Management is powerful and straightforward to use for admins, developers, and end users. Auth0 provides friendly [user interface tools to help administrators manage user identities](https://auth0.com/user-management), including password resets, provisioning, blocking, and deleting users. Migration of users to and from Auth0 is easy, as is social IdP implementation and enterprise federation.

If you'd like to explore what Auth0 has to offer, simply <a href="javascript:signup()">sign up for a free account</a> and try it out!
