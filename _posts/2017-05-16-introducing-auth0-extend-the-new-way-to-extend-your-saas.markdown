---
layout: post_extend
is_extend: true
title: "Introducing Auth0 Extend: The new way to extend your SaaS"
description: "Learn about Auth0 Extend, a new Serverless extensibility platform that enables rapid extension and customization of your SaaS"
date: 2017-05-16 10:00
category: Announcement
alias: /Introducing_Auth0_Extend_the_new_way_to_extend_your_SaaS/
is_non-tech: false
canonical_url: true
author:
  name: "Glenn Block"
  url: "https://twitter.com/gblock"
  mail: "glenn.block@auth0.com"
  avatar: "https://cdn.auth0.com/blog/profiles/glennblock.jpg"
design:
  image: "https://cdn.auth0.com/website/blog/extend/auth0-extend_avatar.png"
  bg_color: "#3445dc"
  image_bg_color: "#3445dc"
  bg_merge: trues
  image_size: 80%
tags:
- serverless
- extensibility
- webtask
press_release: true
---
# Introducing Auth0 Extend, the new way to extend your SaaS  

Today is an exciting day, as we add a new product to the Auth0 family: [Auth0 Extend](https://www.auth0.com/extend?utm_medium=blog&utm_campaign=extend_launch&utm_source=auth0.com)! Auth0 Extend gives you a [Serverless](https://martinfowler.com/articles/serverless.html) extensibility platform you can plug right into your SaaS. Basically, it's Extensibility as a Service. With Auth0 Extend, your customers, partners, as well as your own engineers and sales engineers can quickly and easily extend your product.

Watch this short video below to discover how Extend can help you:

<script src="//fast.wistia.com/embed/medias/gdmdh89ehj.jsonp" async></script>
<script src="//fast.wistia.com/assets/external/E-v1.js" async></script>


<div class="empower-video-button wistia_embed wistia_async_gdmdh89ehj popover=true popoverContent=html"><img class="video-button" src="https://cdn.auth0.com/website/auth0-extend/icons/empower-button-video.svg" alt="button"><img class="video-screen" src="https://cdn.auth0.com/website/auth0-extend/images/empower-screen-video.jpg" alt="Screen"></div>

# Why you need extensibility

If you're a decision-maker for an SaaS product, then you're constantly dealing with a stream of requirements for new features. These requirements arise from sales calls with prospective customers, or they come from your existing base. It may be that your SaaS needs to integrate with an external system the customer uses, or that there's some custom validation logic that's an absolute requirement.

Regardless of the requirement, feature requests inevitably end up on an ever growing product backlog. Resources on your team are finite, so unless there's a critical mass of interest in the feature, or enough high-paying customers, there's a good chance those features will never get done.
<p><p><p>
<img src="https://cdn.auth0.com/website/blog/extend_launch_dibert.jpg"/>
<p>

Making your SaaS extensible can remove the bottlenecks to delivering value. Done right, it enables new features to be introduced and requirements to be met, without being blocked by the product backlog.

# What about Webhooks

<img src="https://cdn.auth0.com/website/blog/extend/flow2.png"/>

The most common way to handle extensibility for SaaS products today is through exposing Webhooks. This is how you extend Slack, Github, Zoho, Concur, Intercom, and many other services.  

Webhooks offer distinct advantages that make them an attractive choice for extensibility:

* They are deployed outside of your product and managed externally.
* They run securely and in isolation from your SaaS application. The SaaS will not go down due to a faulty Webhook.
* They are generally easy for a developer to create, whether it's your own engineers, customers, or partners.
* They can be authored in a number of programming languages.
* They can use whatever third-party dependencies they need.

Here's the catch, though: a Webhook _is_ a service. Just like any other service, it needs to be properly designed, hosted somewhere, managed, and monitored by someone, and that someone is often your customer. The burden has shifted: the backlog hasn't gone away, it's just moved to a different backlog.

As a result, there are _a lot_ of extensions that simply won't be built, because standing up and managing a Webhook is a hassle. A picture tells a thousand words, [Tomek](https://tomasz.janczuk.org/) said it best with this one.

<img src="https://cdn.auth0.com/website/blog/extend/graph2.png"/>

# How Auth0 Extend is better

Auth0 Extend gives you the power of Webhooks and more, without the pain.
One of the key differentiators of our [Identity platform](https://auth0.com/how-it-works) has been how easy it is to customize by creating [Auth0 Rules](https://auth0.com/docs/rules). You can create rules in JavaScript right within the Auth0 Management portal, and they are immediately able to execute in the cloud on demand. There are no servers or endpoints to deploy or manage as in the case of Webhooks, thanks to its [Serverless](https://martinfowler.com/articles/serverless.html) architecture. Auth0 Rules are powered by Auth0 Extend. Below you can see the authoring of a rule that creates users in Intercom.

You can now have the same great experience in your SaaS product. Auth0 Extend includes the Extend Editor, a white-label editor component that you can host in your SaaS UI for authoring extensions in JavaScript. And it includes our extensibility runtime, powered by [Webtask](https://webtask.io), which can securely execute extensions on demand, in a multi-tenant fashion, and at scale.

Just look at the screenshot of our Zero CRM sample, and see how easy it is to embed the Extend editor.

<img src="https://cdn.auth0.com/website/blog/extend/screenshot-editor.png"/>

# Auth0 Extend, more revenue and happier customers

> According to the numbers, rules resulted in more than 10x retention from our customers,
> and customers using rules represent 70% of our cloud-based revenue.

Having Extend in our own product opened new doors and directly translated into new business. Our Sales Engineers jumped on rules as a key way to land deals, such as integrating with external systems that are a deal-breaker. Our field and developer success teams use rules continually to address our customers' emerging requirements. According to the numbers, rules resulted in more than 10x retention from our customers, and customers using rules represent 70% of our cloud-based revenue.

# A better way to extend your SaaS

Can you imagine the flexibility of your users being able to quickly and easily extend _your_ product through code without having to leave your SaaS or deploy and manage servers? Developers just love Auth0 Extend because of how simple it is to create extensions. No servers, no hosting--just code.

Auth0 Extend can help you just as it has helped Auth0 and customers such as [Stamplay](https://stamplay.com), [Meteor Development Group](https://meteor.com), and [Graphcool](https://graph.cool).

Learn more at https://www.auth0.com/extend and sign up for our free developer account [here](https://auth0.com/extend/try). You can also follow us on our new [@auth0_extend](https://twitter.com/auth0_extend) Twitter account. There's much more to come for Auth0 Extend, so stay tuned!

# Aside: Securing Applications with Auth0

Are you building a [B2C](https://auth0.com/b2c-customer-identity-management), [B2B](https://auth0.com/b2b-enterprise-identity-management), or [B2E](https://auth0.com/b2e-identity-management-for-employees) tool? Auth0, can help you focus on what matters the most to you, the special features of your product. [Auth0](https://auth0.com/) can improve your product's security with state-of-the-art features like [passwordless](https://auth0.com/passwordless), [breached password surveillance](https://auth0.com/breached-passwords), and [multifactor authentication](https://auth0.com/multifactor-authentication).

[We offer a generous **free tier**](https://auth0.com/pricing) so you can get started with modern authentication.
