---
layout: post_extend
title: "Serverless Webhooks with Auth0 Extend"
description: Extend your SaaS with Node.js using Auth0 Extend
date: 2017-05-19 09:23
is_extend: true
category: Product
canonical_url: true
author:
  name: "Tomasz Janczuk"
  url: "https://twitter.com/tjanczuk"
  mail: "tomek@auth0.com"
  avatar: "https://s.gravatar.com/avatar/53f70144dc9d7c76455fa91f858d4cec?s=200"
design:
  bg_color: "#3445dc"
  image: "https://cdn.auth0.com/website/extend/developer/blocks-graphic.svg"
tags:
- extend

---

If you are a developer of a SaaS product, one of the most important features you will add to your platform is extensibility. [Extensibility allows your customers to customize and integrate your platform with the ecosystem around it](https://auth0.com/extend/), creating synergy, accelerating growth, and increasing loyalty.

![Auth0 Extend](https://cdn.auth0.com/website/auth0-extend/images/landing-hero.svg)

You don't have to look far to see how this strategy pays off: virtually all successful SaaS platforms thrive on extensibility: from Slack, SalesForce, to GitHub and Zendesk.

> Add extensibility to your SaaS. Your users will thank you, your CFO will love you, and your boss will give you a raise.

---

### Today: webhooks

The most popular mechanism used by SaaS products today to offer extensibility is based on webhooks. Webhooks enable the customer to create a web service that will be called when a certain event occurs in your platform. Webhooks are very powerful and flexible: they allow customers to implement arbitrary business logic to extend your core product.

![Today: webhooks](https://cdn.auth0.com/blog/extend-webhooks/settings.png)

Yet webhooks have their disadvantages. Using webhooks requires your customers to invest in and address several layers of concerns related to running a web service: hosting, monitoring, securing, ensuring availability, and more. All this increases the barrier to extending your product and the required development and maintenance.

### Tomorrow: serverless webhooks with Auth0 Extend

Auth0 Extend helps you add extensibility to your SaaS product in a way that addresses these concerns. Instead of having your customers provide a webhook URL to a service they need to host elsewhere, your users can implement their extension logic directly within your product [using the Auth0 Extend editor](https://auth0.com/extend/try).

![Tomorrow: serverless webhooks with Auth0 Extend](https://cdn.auth0.com/blog/extend-webhooks/settings-edit-code.png)

Using Auth0 Extend is a win-win for you and your customers. Everybody benefits from the reduced time to market and the enablement of platform economy around your SaaS product. Your customers are going to be delighted with the state of the art, in-product development experience Auth0 Extend provides. They will appreciate being able to focus on business logic behind extending your system as opposed to servers, hosting, and maintence of their code.

### Use case: Apollo Launchpad, the GraphQL playground

A great example of using Auth0 Extend to provide a sandboxed execution environment for server side scripts is the just released [Apollo Launchpad](https://dev-blog.apollodata.com/introducing-launchpad-the-graphql-server-demo-platform-cc4e7481fcba), brought to you by the people behind [Meteor](https://www.meteor.com/).

![Apollo Launchpad](https://cdn.auth0.com/blog/extend-webhooks/apollo.png)

Apollo Launchpad is an in-browser GraphQL server playground. It allows developers to share examples and patterns of GraphQL endpoints based on an arbitrary GraphQL schema. The actual endpoint is executing in Auth0 Extend environment to provide adequate isolation and sandboxing of untrusted user code from individual projects.

Check out the [Apollo Launchpad](https://launchpad.graphql.com/new) yourself!

### What exactly is Auth0 Extend?

Auth0 Extend is a managed service that can be integrated into your SaaS product to support authoring and execution of custom code your customers write to extend your platform. The service supports a rich development environment your customers can use to develop and debug Node.js code that you can embed directly in your web site. The second part of the Auth0 Extend service supports secure, "serverless" execution of these extensions on behalf of your customers, therefore removing all your customers' concerns related to hosting and maintaining a service. [Read more about the benefits of Auth0 Extend here](https://auth0.com/extend/developers).

### Lap around Auth0 Extend

While you can provide your own authoring experience for custom code and use only the secure, multi-tenant runtime Auth0 Extend provides to execute it, the Auth0 Extend editor is the best way to highlight what the platform has to offer. Let's take a lap around Auth0 Extend from the perspective of your customers.

### Sky is the limit with Node.js and NPM

The primary programming environment in Auth0 Extend is Node.js. Your users can use Node.js with the vast majority of Node.js modules on NPM across all the versions they desire. The Extend Editor provides a great authoring experience for JavaScript with all the usual creature comforts developers are used to, from syntax highlighting to intellisense.

![Sky is the limit with Node.js and NPM](https://cdn.auth0.com/blog/extend-webhooks/request.png)

Thanks to an innovative way of handling module dependencies by the Auth0 Extend runtime, the latency of code execution is much less affected by the number or size of them compared to tranditional ways of provisioning Node.js applications.

### High HTTP fidelity

Auth0 Extend offers very high fidelity with the HTTP protocol. The developer remains in full control of request and response headers and content type. If you can do it with webhooks and Node.js, you can also do it with Auth0 Extend - without additional translation layers.

![High HTTP fidelity](https://cdn.auth0.com/blog/extend-webhooks/reswritehead.png)

### Secrets and configuration

The majority of extensions of your plarform will communicate with external systems to do their job. It may be a Mongo database, Twilio or Sendgrid APIs, Salesforce, or any other system that expose endpoints. Auth0 Extend provides a very convenient and secure way of provisioning and handling API keys and other secret configuration necessary for extensions to do their job.

![Secrets and configuration](https://cdn.auth0.com/blog/extend-webhooks/secrets.png)

Secrets are encrypted at rest and stored alongside the code of the extension. They are only decrypted when the time comes to execute the extension, which provides security-in-depth for protecting your customers' data.

### Integrated runner

Auth0 Extend editor includes a runner component that allows your customers to test their code without using external tools. When you integrate Auth0 Extend into your SaaS, you can configure the runner with sample data specific to your extensibility points, so that your users are only a click away from testing their code with matching and meaningful payloads.

![Integrated runner](https://cdn.auth0.com/blog/extend-webhooks/runner.png)

### Real-time logging

Testing of the code during development is further facilitated with access to real-time logging information generated by the code. This functionality is integrated into Auth0 Extend editor and can be used as needed by your users to capture any output generated by their code to *stdout*.

![Real-time logging](https://cdn.auth0.com/blog/extend-webhooks/logs.png)

### GitHub integration

The Auth0 Extend system stores and manages the code your users write in order to execute it at runtime. But it also supports bi-directional synchronization of that code with a GitHub repository.

Any changes to the code on GitHub can be automatically put into production. Also any changes made in the Auth0 Extend editor can generate a commit to the repo.

### Custom programming models and DSLs

While the primary programming environment of Auth0 Extend is based on Node.js, you can expose custom programming models and domain specific languages (DSLs) to your users. This is made possible with the built-in concept of *middleware*, which is code that executes before the code of your customers. You can use this customization point to transpile custom programming models or DSLs to the model Auth0 Extend expects, perform custom logging, authentication or authorization, and more.

![Custom programming models and DSLs](https://cdn.auth0.com/blog/extend-webhooks/stripe.png)

Auth0 Extend middleware is a Swiss army knife that allows you to truly customize the programming experience you provide your users.

### White-labelled experience

The Auth0 Extend editor itself is highly customizable and extensible. You can expose only the features you want to your users, and you can augment the look & feel of what remains. This includes using your own logo or CSS styles.

### Durable logs

In addition to the real-time logs which provide your users with immediate access to logging information during development, you can also configure Auth0 Extend to externalize all logging information to AWS Firehose. This provides you with the ability to store and process logs in Amazon S3, Redshift, or ElasticSearch for analytics and historical record.

### Battle tested technology

Auth0 Extend is not a new product, it a result of scratching our own itch at Auth0. Auth0 Extend is based on the same [Webtask](https://webtask.io) technology we have developed and have been using at [Auth0](https://auth0.com) to power extensibility through custom code in our identity management platform. We've been running it for years (yes, it predates the word *serverless*), at scale, and around the world. We've taken it through the long and sometimes painful stabilization process so that we can offer the best in stability, reliability, failure recovery, security, and performance.

### Getting started

Start integrating Auth0 Extend into your product today. We not only make your customer's life simple, we also care about your own experience integratig Auth0 Extend into your SaaS.

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.auth0.com/auth0-extend/1/extend-editor.js"></script>
</head>
<body>
  <div id="extend-editor" style="height: 400px; width: 600px"></div>
  <script>
    ExtendEditor.create(document.getElementById('extend-editor'), {
      hostUrl: '{host_url}',
      webtaskContainer: '{webtask_container}',
      token: '{webtask_token}'
    });
  </script>
</body>
</html>
```

To get started, [try Auth0 Extend for free](https://auth0.com/extend/try).

## Aside: Securing Applications with Auth0

Are you building a [B2C](https://auth0.com/b2c-customer-identity-management), [B2B](https://auth0.com/b2b-enterprise-identity-management), or [B2E](https://auth0.com/b2e-identity-management-for-employees) tool? Auth0, can help you focus on what matters the most to you, the special features of your product. [Auth0](https://auth0.com/) can improve your product's security with state-of-the-art features like [passwordless](https://auth0.com/passwordless), [breached password surveillance](https://auth0.com/breached-passwords), and [multifactor authentication](https://auth0.com/multifactor-authentication).

[We offer a generous **free tier**](https://auth0.com/pricing) so you can get started with modern authentication.
