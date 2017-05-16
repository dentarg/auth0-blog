---
layout: post_extend
is_extend: true
title: "Introducing Auth0 Extend: The new way to extend your SaaS"
description: "Learn about Auth0 Extend, a new Serverless extensibility platform which enables rapidly extending and customizing your SaaS"
date: 2017-05-16 01:00
category: Announcement
is_non-tech: false
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
# Introducing Auth0 Extend: The new way to extend your SaaS 

Today is an exciting day as we add a new product to the Auth0 family, [Auth0 Extend](https://www.auth0.com/extend?utm_medium=blog&utm_campaign=extend_launch&utm_source=auth0.com)! Auth0 Extend gives you a [Serverless](https://martinfowler.com/articles/serverless.html) extensibility platform you can plug right into your SaaS, it is Extensibility As A Service.

<script src="//fast.wistia.com/embed/medias/gdmdh89ehj.jsonp" async></script>
<script src="//fast.wistia.com/assets/external/E-v1.js" async></script>


<div class="empower-video-button wistia_embed wistia_async_gdmdh89ehj popover=true popoverContent=html"><img class="video-button" src="https://cdn.auth0.com/website/auth0-extend/icons/empower-button-video.svg" alt="button"><img class="video-screen" src="https://cdn.auth0.com/website/auth0-extend/images/empower-screen-video.jpg" alt="Screen"></div>

# Why you need extensibility

If you are a decision maker for a SaaS product, then you are constantly dealing with a stream of requirements for new features. These requirements appear on Sales calls with prospective customers, or they come from your existing customer base. It may be that your SaaS needs to integrate with an external system the customer uses, or there's some custom validation logic that is absolute requirement. 

Regardless of the requirement, feature requests inevitably end up on an ever growing product backlog. Resources on your team are finite, so unless there is a critical mass of interest on the feature, or enough high paying customers, there's a good chance those features will never get done.
<p><p><p>
<img src="https://cdn.auth0.com/website/blog/extend_launch_dibert.jpg"/>
<p>

Making your SaaS extensible can remove the bottlenecks to delivering value. Done right, it enables new features to be introduced, and requirements met, without being blocked by the product backlog.

# What about Webhooks

<img src="https://cdn.auth0.com/website/blog/extend/flow.png"/>

The most common way to handle extensibility for SaaS products today is through exposing Webhooks. This is how you extend Slack, Github, Zoho, Concur, Intercom, and many more services. 

Webhooks offer distinct advantages that make them an attractive choice for extensibility:

* They are deployed outside of your product and managed externally.
* They run securely and in isolation of your SaaS application. The SaaS will not go down due to a faulty Webhook.
* They are generally easy for a developer to create, whether it is your own engineers, customer's or partners.
* They can be authored in a number of programming languages.
* They can use whatever 3rd party dependencies they need.

Here's the catch though, a Webhook _is_ a service. Just like any other service it needs to be properly designed, hosted somewhere, managed and monitored by someone, and that someone is often your customer. The burden has shifted, the backlog hasn't gone away, it's just moved to a different backlog. 

As a result there's _a lot_ of extensions that simply won't be built because standing up and managing a Webhook is a hassle. A picture tells a thousand words, [Tomek](https://tomasz.janczuk.org/) said it best with this one.

<img src="https://cdn.auth0.com/website/blog/extend/graph.png"/>
# How Auth0 Extend is better

Auth0 Extend gives you the power of Webhooks and more without the pain.
One of the key differentiators of our [Identity platform](https://auth0.com/how-it-works) has been how easy it is to customize by creating [Auth0 Rules](https://auth0.com/docs/rules). You can create rules in JavaScript right within the Auth0 Management portal and they immediately are able to execute in the cloud on demand. There's no servers or endpoints to deploy or manage as in the case of Webhooks thanks to its [Serverless](https://martinfowler.com/articles/serverless.html) architecture. Auth0 Rules are powered by Auth0 Extend. 

You can now have the same great experience in your SaaS product. Auth0 Extend includes the Extend Editor, a white-labeled editor component that you can host in your SaaS UI for authoring extensions in JavaScript. And it includes our extensibility runtime powered by [Webtask](https://webtask.io), which can securely execute extensions on-demand, in a multi-tenant fashion, at scale, and with very low latency.

Just look below at the screenshot of our Zero CRM sample, and see how easy it is to embed the Extend editor.

<img src="https://cdn.auth0.com/website/blog/extend/screenshot-editor.png"/>

# Auth0 Extend, more revenue and happier customers

> By the numbers, rules resulted in more than 10x retention from our customers, 
> and customers using rules represent 70% of our cloud-based revenue.

Having Extend in our own product opened new doors and directly translated to new business. Our Sales Engineers jumped on top of rules as a key way to land deals, such as integrating with external systems that lack of support for would otherwise have been deal-breakers. Our field and developer success teams use rules daily to address our customer's emerging requirements. By the numbers, rules resulted in more than 10x retention from our customers, and customers using rules represent 70% of our cloud-based revenue.

# A better way to extend your SaaS

Can you imagine the flexibility of your users being able to quickly and easily extend _your_ product through code without having to leave your SaaS or deploy and manage servers? Developers just love Auth0 Extend because of how simple it is to create extensions. No servers, no hosting, just code.

Auth0 Extend can help you, the same way it has helped Auth0, and customers such as [Stamplay](https://stamplay.com), [Meteor Development Group](https://meteor.com) and [Graphcool](https://gviraph.cool). 

Learn more at https://www.auth0.com/extend and sign up for our free developer account [here](https://www.auth0.com/try). Also follow our new [@auth0_extend](https://twitter.com/auth0_extend) twitter account. There's much more to come on Auth0 Extend, stay tuned!

