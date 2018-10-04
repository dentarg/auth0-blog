---
layout: post_extend
title: "Our Journey toward SaaS Customization and Extensibility at Auth0"
description: "Learn about the four-year-long journey Auth0 took to deliver the tools needed by both field engineers and our customers to implement last mile identity solutions quickly."
date: 2017-12-13 10:00
category: Extend, Business
canonical_url: true
author:
  name: "Bobby Johnson"
  url: "https://twitter.com/NotMyself"
  mail: "bobby.johnson@auth0.com"
  avatar: "https://cdn.auth0.com/website/blog/profiles/bobbyjohnson.png"
design:
  bg_color: "#3445DC"
  image: https://cdn.auth0.com/website/blog/extend/why-auth0-chose-serverless-extensibility/logo.png
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

Previously, we wrote about the emerging pattern of [Serverless Extensibility](https://auth0.com/blog/why-is-serverless-extensibility-better-than-webhooks/). Examples of the concept are popping up in many of the services you use daily like [Twilio](https://www.twilio.com/functions) and here at [Auth0](https://auth0.com/). In this post, I will talk about challenges our customers were facing with our Auth0 Identity product. This led us down the path toward implementing the pattern, and ultimately toward creating a brand new product.

## The problem

![NASA Engineers working on MAVEN](https://cdn.auth0.com/website/blog/extend/why-auth0-chose-serverless-extensibility/engineers_working_on_the_high-gain_antenna_of_the_MAVEN_spacecraft.jpg)

*Placed into the public domain by [NASA](http://mars.jpl.nasa.gov/multimedia/images/?s=1) using [Creative Commons](https://creativecommons.org/publicdomain/zero/1.0/)*

In the early days at Auth0, there were two groups: Core and Field Engineering. Core focused on the core functionality of the authentication product, and the field engineers helped customers use the product in their applications. The company was discovering what customers needed in the product.

Our customers' focus was on the authentication transaction. A lot of interesting features can attach to the process of someone trying to login:

- Profile Enrichment
- Progressive Profiling
- Authorization
- Claims Transformation

Customers will come up with an unlimited supply of feature requests. We could not possibly build every feature at once.

Moreover, sometimes building features into the core product for customers is not the right approach. We needed a way to try ideas out. An idea may sound great, but in practice be problematic. Investing core engineering resources to these ideas is very expensive.

> **"The primary use case for extensibility at Auth0 was to empower field engineers to work on the last mile solutions for the customer without involving core engineering."**<br />
> Eugenio Pace - Co-Founder, CEO

If every interaction with a customer involved identifying an idea, putting it in the backlog and coming back to them at a later date, it would add friction to the process and turn customers away.

For example, we had customers who wanted to do profile enrichment. They used services like [FullContact](https://www.fullcontact.com/) to look up a new user and grab related information about them such as their company, role, and social media accounts. FullContact is just one service as there are several others. We had prospects that were depending on these capabilities to have confidence in using us as a platform, and without it would not become customers.

## Custom code extensibility

![NASA's "Webb-cam" Captures Engineers at Work on Webb at Johnson Space Center](https://cdn.auth0.com/website/blog/extend/why-auth0-chose-serverless-extensibility/34827899312_571fa2a976_k.jpg)

*[NASA](https://www.flickr.com/photos/gsfc/34827899312) licensed under [Creative Commons 2.0](https://creativecommons.org/licenses/by/2.0/)*

To solve this problem, we introduced a method of adding custom code into the platform that could be defined by customers. The inspiration for custom code extensibility as a solution came from spreadsheets. Excel has significant functionality out of the box, but you can always add a function, macro or calculation that better reflects your goal. However, you can write them yourself directly in Excel removing the dependency on Microsoft engineers.

> **"We wanted a similar experience for our users. A user should be able to log in to the dashboard, write a small amount of node.js code that executes later during authorization transactions."**<br />
> Eugenio Pace - Co-Founder, CEO

Like Excel, we wanted to offer users a really simple experience for customizing our product through code. We believed a user should be able to write their logic in an editor, debug it in place, and make it live in production, all without having to stand up a service. This differed from the prevalent approach at the time for dealing with customization through webhooks, which were hosted by the user.

We quickly implemented an MVP to prove out the concept. It created a process boundary between the core Auth0 stack and the customer's code. It primarily prevented well behaved, well-intentioned code from accidentally bringing down the authorization service or other sandboxed code.

Although the MVP had its limitations, it proved that the user experience for customization could be greatly improved, aligning well with our philosophy of "Identity made simple for developers."

## Evolving customization features

![NASA engineers cleaning mirror with carbon dioxide snow](https://cdn.auth0.com/website/blog/extend/why-auth0-chose-serverless-extensibility/17402277412_5e2834517c_k.jpg)

*[NASA](https://www.flickr.com/photos/gsfc/17402277412) licensed under [Creative Commons 2.0](https://creativecommons.org/licenses/by/2.0/)*

Custom code extensibility is exposed in our customer dashboard in three ways: Auth0 Rules, Hooks, and Extensions.

**[Auth0 Rules](https://auth0.com/docs/rules/current)** were the first publically available use case where our customers could easily add custom functionality to their authorization flow directly in the dashboard. Rules execute after authentication but before authorization. We offer a gallery of Rule templates that make it easy for customers to address common scenarios out of the box. Because Rules are code though, customers can easily customize the logic further to meet their specific needs.

A customer clicks a button to add a new Rule, selects one from a set of standard templates which they can customize with a simple editor right in their browser. When saved, the Rule is active on their account for all authentication requests.

![Rules UI](https://cdn.auth0.com/website/blog/extend/why-auth0-chose-serverless-extensibility/rules.png)

Rules allow you to easily customize and extend Auth0's capabilities. They can be chained together for modular coding and can be turned on and off individually.

Rules were really powerful but were limited only to login. Once customers got a taste of rules, they started to ask us for more places where they can customize the product, and so Hooks were born.

**[Auth0 Hooks](https://auth0.com/docs/hooks)** allow you to customize the behavior of Auth0 using custom code that is executed against several extensibility points. Not only can you introduce customization during the client credentials exchange, but also pre and post user registration. Hooks also take advantage of a more feature rich editor.

![Hooks UI](https://cdn.auth0.com/website/blog/extend/why-auth0-chose-serverless-extensibility/hooks.png)

Hooks are intended to completely replace Auth0 Rules.

While both Auth0 Rules and Hooks give you fine-grained control of the authentication pipeline, **[Auth0 Extensions](https://auth0.com/docs/extensions)** are are mini-applications that extend the Auth0 identity product with 3rd party integrations.

They do not directly tie to any specific event in the system. Instead, they can invoke any Auth0 API, can configure the customer tenant, deploy Hooks or Rules on installation and even have an associated user interface. They are extremely powerful and opened up many use cases.

![Extensions UI](https://cdn.auth0.com/website/blog/extend/why-auth0-chose-serverless-extensibility/extensions.png)

Auth0 Extensions are written using the Webtasks infrastructure. Customers can select an Extension from our gallery and provide a set of configuration options to begin using one.

This is just the beginning. We're constantly looking to enable richer and richer customization in our product, and you'll continue to see us opening new doors as we learn.

## The impact on our sales engineers and customers

![NASA engineers celebrating curiosity](https://cdn.auth0.com/website/blog/extend/why-auth0-chose-serverless-extensibility/celebrating_curiosity.jpg)

*Placed into the public domain by [NASA](https://commons.wikimedia.org/wiki/File:Celebrating_Curiosity.jpg) using [Creative Commons](https://creativecommons.org/publicdomain/zero/1.0/)*

Adding extensibility to the identity product opened up a window of customization where field engineers could work independently from core engineering. They could deliver customizations very quickly without waiting weeks or even days, enabling many successful sales engagements.

> **"In some cases, we were able to deliver demos where we implemented feature requests in the demo during the meeting. It was amazing for field engineers and our customers."**<br />
> Eugenio Pace - Co-Founder, CEO

Putting extensibility into the hands of customers also gives us great insights into where the market is going. If we see an extension being implemented again and again through the use of custom code, that is a validation of that feature and an opportunity to add in the core product.

Multi-Factor Authentication came about this way. MFA was not a switch on the dashboard initially. It was merely a rule you applied to your account. Over time, our customers' usage of this rule indicated MFA was an important feature to have in the core product.

For more examples, take a look at our [rules repository](https://github.com/auth0/rules) on Github. Every single one comes from a real-world customer use case.

> **"Every event in the life cycle of the user can be expressed through code and in that way we can support any backend out there in a flash. No matter how customers encrypt or hash passwords; whatever they do is supported because they can provide the details using custom code."**<br />
> Sandrino Di Mattia - Engineering Lead

## The impact on our business

![Happy Employees](https://cdn.auth0.com/website/careers/culture-2.jpg)

Not only did we make our customers happier, opening up customization provided us a direct return on revenue. Looking at our data, we found our customer retention increased up to 10x for those users that took advantage of customizing. Not only that, but our largest deals depend on these customizations even today, bringing 70% of our cloud revenue.

## Auth0 Extend, the next logical evolution

After shipping Auth0 Rules, Hooks, and Extensions, we found they were really well received by our customers, many of which have their own SaaS products. Over the next few years we started to get more and more requests, to enable them to offer a similar experience within their own SaaS products. Similar to Auth0, they started telling us they wanted to make it easy for _their_ customers and sales engineers to customize.  We realized there was an opportunity here for us to provide value with a new product. This is why we created [Auth0 Extend](https://auth0.com/extend). 

When [Jeff Lindsay](https://twitter.com/progrium) was introduced to Extend he certainly felt we were on to something. Jeff was the person who coined the phrase [Webhook](http://progrium.com/blog/2007/05/03/web-hooks-to-revolutionize-the-web/), which has become ubiquitous on the web as a way to offer extension points from applications online.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">This was the whole point of pushing webhooks in 2007. Literally built this as a prototype. <a href="https://t.co/Wyoz0qXO9P">https://t.co/Wyoz0qXO9P</a></p>&mdash; Jeff Lindsay (@progrium) <a href="https://twitter.com/progrium/status/864588610858881029?ref_src=twsrc%5Etfw">May 16, 2017</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## Summary
In the past four years, we've been exploring how to better enable our users to customize and extend our SaaS. On our journey, we discovered the Serverless Extensibility pattern provided a great solution. We found that allowing extensions to be authored in-line, provided tremendous value both to our customers and to the business. It allowed us to close more deals, and deliver customer features much more quickly and cheaply than before. 

If you'd like to see similar benefits within your SaaS product, then give Auth0 Extend a [try](https://auth0.com/extend/try).

_I would like to thank [Eugenio Pace](https://twitter.com/eugenio_pace), [Sandrino Di Mattia](https://twitter.com/sandrinodm) and [Tomasz Janczuk](https://twitter.com/tjanczuk) for taking time out of their busy schedules to be interviewed for this post._
