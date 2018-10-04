---
layout: post_extend
title: "Why is Serverless Extensibility better than Webhooks?"
description: "Webhooks are a clean and simple way to add extensibility points into your SaaS, but Serverless Extensibility removes several points of friction on your customers."
date: 2017-09-11 10:21
is_extend: true
category: Extend, Business
canonical_url: true
author: 
  name: "Bobby Johnson"
  url: "https://twitter.com/NotMyself"
  mail: "bobby.johnson@auth0.com"
  avatar: "https://cdn.auth0.com/website/blog/profiles/bobbyjohnson.png"
design: 
  bg_color: "#3445DC"
  image: https://cdn.auth0.com/blog/beyond-webhooks/logo.png
tags: 
  - extend
  - serverless
  - webhooks
  - extensibility
related:
  - 2017-05-16-introducing-auth0-extend-the-new-way-to-extend-your-saas
  - 2017-05-19-serverless-webhooks-with-auth0-extend
  - 2017-08-22-for-the-best-security-think-beyond-webhooks
---

So you have shipped your first SaaS and customers are beating down your door to sign up and hand you buckets of money. Your code is tight. Your servers are humming. The venture capitalists are talking IPO. Everything's coming up roses.

Then it starts; Some customers want complex data flow logic added, others want instant notifications via SMS for each order placed, and then there is a host of other SaaS systems they all want you to integrate with.

How do you handle these requirements? You obviously can't do them all, so you have to choose, meaning some customers will be left unsatisfied and possibly move off your product. Beyond that, there is a different problem. Any work that you decide to do for these one-offs takes away from focusing on your core value proposition, and adds additional maintenance and supports costs.

This problem is of course nothing new. Every successful internet service has experienced  it in some form since long before web 2.0 was a thing.

## Webhooks Are the Answer!

A common solution is to introduce Webhooks into your platform. They are relatively straightforward to implement; identify the critical extension points of your platform, craft the perfect payload at each point, wire up a subscription administration interface and release it to your customers.

![Webhook Diagram](https://cdn.auth0.com/website/blog/extend/why-is-serverless-extensibility-better-than-webhooks/webhook-model.png)

You don't have to build the customizations. Your engineering team can stay focused on solving the core business for your SaaS.

- You don't have to build the customizations. Your platform can stay tight and focused on solving the business problem it was intended to address.
- You don't have to host the custom logic anymore. The code triggered by the webhook runs completely isolated and secure from your platform and your other customers, dramatically reducing the resources needed to keep your SasS up and running.
- Customers are free to choose any language or technology stack they prefer to process the Webhook payloads.
- You enable other SaaS providers and partners to build integrations with your product to satisfy their customers.

## The Flip Side of Webhooks

Webhooks have effectively allowed you to externalize the customization overload on your platform. What you may not realize is that you have effectively placed that burden directly on your customers.

Mary, who heads IT at one of your customers, a 20 person law firm in Atlanta, did not sign up for this. Your Webhook strategy created a bunch of ongoing work for her and her team.

- She has to figure out how to build the service the Webhook is calling. It needs to be robust and resilient under load.
- She has to find hosting for this service. Heroku and AWS may be great options for this, but maybe completely unfamiliar to her.
- She needs to consider security concerns with exposing the service to the internet. Setting up HTTPS is no cakewalk.
- On top of all this, she needs to find a monitoring solution that will alert her to outages or problems; not to mention dealing with being on call to address them.

In a big company, this is even more of a challenge. Budgets need to be considered and appropriated. Coordinating between different departments deciding who is going to build it, deploy it and pay for it can become an impediment. Large SaaS products like Salesforce may require engaging an integration team.

All of this contributes to taking longer to deliver the value the customer wanted in the first place.

{% include tweet_quote.html quote_text="Webhooks are deceptively simple on the surface." %}

Webhooks are deceptively simple on the surface. Many platforms offer Webhooks, but consuming them has a high barrier to entry. Your customers need to think carefully about pursuing them. They are committing to the maintenance of that infrastructure for a very long time. All of this contributes to taking longer to deliver the value the customer wanted in the first place.

![Hidden Complexity](https://cdn.auth0.com/website/blog/extend/why-is-serverless-extensibility-better-than-webhooks/hidden-complexity.png)

## Serverless Extensibility, Going Beyond Webhooks

A new approach is starting to emerge in the industry, one that we call Serverless Extensibility. Instead of placing the burden on customers, SaaS products can leverage a Serverless platform to allow users to author and execute extensions directly in the product.

![Serverless Extensibility](https://cdn.auth0.com/website/blog/extend/why-is-serverless-extensibility-better-than-webhooks/serverless-extensibility.png)

Users can now create custom extensions within the product using an inline code editor, choosing from a pre-defined selection. At runtime, The SaaS calls out to a Serverless provider to securely execute the code.

Serverless Extensibility makes it much easier and faster to customize your product and get the value to your users. Not only that, but it saves your customers money as they substantially reduce up-front development cost, and they no longer have to deal with ongoing hosting and maintenance. Removing that friction and cost means higher user retention, which our data shows can be as high as 10x.

## Serverless Extensibility in the Wild

### Auth0

Here at Auth0, we have been working on extensibility for a while. We are known for offering the simplest set of tools to solve the most complex identity use cases. With Auth0 Identity, you can easily authenticate and authorize apps and APIs with any identity provider running on any stack, device, or cloud.

For several years customers have been able to execute arbitrary Node.js code during the authorization process using [Rules](https://auth0.com/docs/rules/current). Several templates are available or they can create an empty Rule to customize right in the management dashboard.

Recently, we added [Hooks](https://auth0.com/docs/hooks) allowing users to customize the behavior of Auth0 at credential exchange, or at pre and post user registration extension points.

![Auth0 Hook Editor](https://cdn.auth0.com/website/blog/extend/why-is-serverless-extensibility-better-than-webhooks/hooks-editor2.png)

Using Auth0's extensibility has enabled our customers to easily customize the product to handle custom business logic and integrate with a variety of 3rd party services.

### Twilio

Twilio is a cloud communications platform that provides building blocks to add messaging, voice, and video to your web and mobile applications.

With Twilio, you can provision a phone number that accepts calls, faxes, MMS or SMS messages. You can quickly respond to the incoming events using TwiML, an XML based message format that allows you to define simple non-interactive responses. For interactivity, you need to configure a Webhook processor that interacts with the Twilio API.

Twilio recently augmented their Webhook based extensibility with [Twilio Functions](https://www.twilio.com/blog/2017/05/introducing-twilio-functions.html). In the introduction presentation at Signal 2017, Carter Rabasa explained the reasoning this way.

> **"The first thing that Twilio tells you to do is download a web application. And then we ask you to go deploy that web application to some server, somewhere."**<br />
> Carter Rabasa - Product Manager @ Twilio

Now you can easily create a function that handles incoming voice calls or messages right in the Twilio console. When saved, the function is deployed to a serverless environment and can now be attached to incoming events.

![Twillio Editor](https://cdn.auth0.com/website/blog/extend/why-is-serverless-extensibility-better-than-webhooks/twilio-editor.png)

Using Twilio Functions enables customers to now on board much more quickly to using Twilio's platform, than was previously possible.

### Stamplay

Stamplay is a business automation platform that provides the ability to connect any application, database or service regardless of if data is sitting in the cloud or on-premises.

With Stamplay you can plug in a large and growing list of integrations and use them to orchestrate communication between systems based on event triggers. It offers a beautiful point and click task editor that allows any business professional to wire together interactions.

In January of 2016, Stamplay released Code Blocks a built in extensibility point that solved a specific need in their product. Giuliano Lacobelli introduced it this way.

> **"Sometimes you cannot get around the need for some custom code."**<br />
> Giuliano Lacobelli - Co-Founder @ Stamplay

Now Stamplay customers can create custom integrations within the inline editor, and use them directly on Stamplay's drag and drop environment.

![Stamplay Editor](https://cdn.auth0.com/website/blog/extend/why-is-serverless-extensibility-better-than-webhooks/stamplay-editor2.png)

Using Stamplay Blocks allows customers to go well beyond the out-of-the-box integrations, providing a stickier experience.

## Serverless Extensibility in your SaaS

Implementing Serverless Extensibility is hard. We know as we have been building out our own solution which we run at scale, globally, for 3 years. Fortunately, with [Auth0 Extend](https://auth0.com/extend/), you can do it much more easily.

Auth0 Extend is a managed extensibility platform that you can plug into your SaaS. It makes it easy for your customers, sales engineers, and partners to quickly extend your SaaS. Extend includes an embeddable, customizable code editor and a cloud-based service for running extensions on demand, securely, and at scale.

You can [create a trial account](https://auth0.com/extend/try) today that allows you to explore the capabilities at no cost.

## Summary

Webhooks are a clean and easy way for you to add extensibility points into your SaaS, but they put an extra on-going burden on your customers, making them less useful.

Serverless Extensibility removes as much friction as possible, allowing customers to customize usage of your platform in a secure, scalable, and reliable way that is offered directly in the product.

Removing this friction makes customers stickier to your product, allowing them to focus on their core business and more quickly to deliver value to the market.
