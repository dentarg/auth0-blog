---
layout: post
title: "SAP to Acquire Gigya: What's Next for Identity Management?"
description: "Learn what features to assess when your IAM platform changes ownership."
date: 2017-10-02 8:30
category: Announcements
is_non-tech: true
banner:
  text: "Auth0 makes it easy to add authentication to your application."
author:
  name: "Kim Maida"
  url: "https://twitter.com/kimmaida"
  mail: "kim.maida@auth0.com"
  avatar: "https://secure.gravatar.com/avatar/a208cda2b3b21dc8d7896507f5ff60fc"
design:
  image: https://cdn.auth0.com/blog/gigya/logo01.png
  bg_color: "#285AA6"
tags:
- migration
- gigya
- sap
- identity
- authentication
related:
- 2017-03-06-how-to-migrate-your-existing-stormpath-users-to-auth0
---

## SAP to Acquire Gigya

[On September 24, 2017 Gigya announced that they will be acquired by SAP](http://www.gigya.com/gigya-the-market-leader-in-customer-identity-and-access-management-to-be-acquired-by-sap/). [Gigya’s](http://gigya.com) Customer Identity and Access Management (IAM) platform, which currently manages 1.3 billion customer identities, will be integrated into SAP’s Hybris Profile Service.

With this news, current Gigya customers will be very interested in learning more about SAP's plans for an integration strategy. The acquisition announcement stated the following:

> "Gigya’s consent-based identity data platform and SAP Hybris® Profile data matching and enrichment capabilities to be integrated" —[Gigya Press Release](http://www.gigya.com/gigya-the-market-leader-in-customer-identity-and-access-management-to-be-acquired-by-sap/)

SAP has announced that the acquisition will allow them to offer a cloud-based data platform for user data collection and that Gigya's 300+ employees will become part of the SAP Hybris business unit.

{% include tweet_quote.html quote_text="SAP acquisition of Gigya: current Gigya customers will be interested to learn plans for integration." %}

## Assessing an IAM Platform

It is currently unclear whether Gigya's services and APIs will remain functionally equivalent after the business transaction with SAP is completed. At the time of writing, SAP has not announced its _integration strategy_ for Gigya. This may create uncertainty for customers.

There are several features and key interests to look for when re-assessing your IAM platform when it is acquired by a different company. Let's explore them now:

### Customer and Platform Support

Excellent **customer support** is a key feature of any product, and especially so with products offered as-a-service. Make sure the platform has a robust and responsive support system with a dedicated and knowledgeable team of experts who can assist with both administrator and developer needs.

Continued **platform support and development** is vital as well. A product should be actively supported and improved. Potential customers should look for continued innovation, features, and added support for new security regulations, technologies, and applications.

### Core Competency of the Company

When selecting a company that provides an IAM platform, you should look for one that **specializes in authentication, identity, and access management**. When a company’s _core competency_ is authentication and security, their IAM platform’s support, development, and advancement is considered first-class. In this way, customers are assured that their IAM platform will be continuously improved and never downgraded when it comes to the company’s development and support priorities.

This also ensures that the IAM platform maintains **independence from any software that might utilize it**. An IAM platform should support easy integration with a large variety of IdPs (including enterprise Identity Providers such as Active Directory as well as social providers like Facebook) and applications. For example, a company may sell a specific suite of applications. They may also offer an IAM platform that enables authentication and shared identity across all applications in that suite. However, if the IAM platform is tightly coupled with a specific set of integrated software components, you should carefully assess whether the platform has good support for IdPs or applications _outside_ that ecosystem.

In addition, an excellent IAM platform should **integrate easily with other best-of-breed platforms**. Integration with services in areas such as Business Intelligence and Analytics enable your IAM to collect more data and enrich customer identities, better serving your business.

### Flexibility to Manage Multiple Business Use Cases on a Single Platform

A platform's **ability to fully support multiple business use cases** is a key feature to look for. Regardless of your _current_ primary use case, you should assess the product's capability to use a single platform for [B2B](https://auth0.com/b2b-enterprise-identity-management), [B2C](https://auth0.com/b2c-customer-identity-management), [B2E](https://auth0.com/b2e-identity-management-for-employees), [IoT](https://auth0.com/docs/tutorials/authenticating-devices-using-mqtt), [Cloud IAM](https://auth0.com/learn/cloud-identity-access-management/), and more. This flexibility means that as your business grows and expands its needs, your IAM platform will enable and support that growth with ease.

### Ease of Use for Developers

When considering an IAM platform, ease of use for developers should be a key interest for any business. An IAM platform should be featureful _and_ **easy to implement**. A platform with a difficult or complex integration requires expending excessive development hours, reducing time to market. It also causes issues for your developers both at initial implementation as well as into the future if you need additional features or functionality later.

Look for an IAM platform that utilizes **industry standards** rather than proprietary APIs for implementation. This makes integration easier and more secure, as well as ensuring uncomplicated migrations. Should you choose to switch platforms in the future, the process of outward migration should be straightforward with reduced vendor lock.

Your IAM platform should be easy to use and developer-friendly, ensuring that your engineers are able to spend less time on authentication and more time focusing on what makes your business unique.

### Extensibility

A first-class IAM platform should be extensible. Every company is different and has its own needs and requirements. An IAM platform needs to be able to **meet the needs of _all_ of its customers, necessitating extensibility** in a number of different ways. A few ways in which the platform should be extensible include, but are not limited to:

* The ability to add custom functionality to the platform.
* Support for customization of authentication and authorization experiences, including profile enrichment, access roles, and more.
* Support for custom actions during the exchange of credentials as well as before, during, and after user registration.

### Deployment Options

Your IAM platform should support multiple deployment options to best suit the customer's needs. You may require a public _or_ private Software-as-a-Service (SaaS) deployment, or may require deployment on-premises. When assessing an IAM platform, you should ensure that the solution provides not only the option you currently require, but others that may become necessary to your business in the future.

## Summary

SAP and Gigya have an acquisition agreement in place. At the time of writing, there is no announced integration strategy for Gigya customers to review and consider. Hopefully additional clarity around the future of Gigya's product and customers is coming in the near future. Depending on what SAP plans for Gigya's IAM platform, it may be prudent to consider all possibilities, including potential opportunities with other IAM offerings.

When assessing IAM platforms, there are many key features you should investigate to ensure that the resulting product and service fully continues to address all your identity management needs.

{% include tweet_quote.html quote_text="Assess support, company core competency, flexibility, and extensibility when choosing an IAM platform." %}

## About Auth0

{% include asides/about-auth0.markdown %}

If you'd like to explore what Auth0 has to offer, simply <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">sign up for a free account</a> and try it out! You can also check out our [Pricing](https://auth0.com/pricing) and read what [customers have to say about Auth0](https://auth0.com/resources/case-studies).
