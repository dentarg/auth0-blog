---
layout: post
title: "The History Behind When Build Becomes Buy"
description: "Although considered the easiest option, building has it limitations when compared to the benefits of buying."
date: 2017-04-25 10:02
category: Growth, BuildBuy
is_non-tech: true
author:
  name: Diego Poza
  url: https://twitter.com/diegopoza
  avatar: https://avatars3.githubusercontent.com/u/604869?v=3&s=200
  mail: diego.poza@auth0.com
design:
  bg_color: "#144987"
  image: https://cdn2.auth0.com/blog/build-becomes-buy/logo.png
tags:
- iam
- stripe
- salesforce
- security
- startups
related:
- 2017-02-08-is-multifactor-authentication-the-best-way-to-secure-your-accounts-myths-and-reality
- 2017-04-05-when-to-build-and-when-to-buy
- 2017-02-10-ultimate-account-based-marketing-machine-with-account-selection
---

<div class="alert alert-info alert-icon">
  <i class="icon-budicon-500"></i>
  <strong>Forrester Consulting analysis determines that using Auth0 can yield a 548% ROI and $3.7M in identity-related savings. Read the full report: <a href="https://resources.auth0.com/forrester-tei-research-case-study/">Total Economic Impact of Auth0</a>.</strong>
</div>

---

The buy-vs-build battle is an eternal one for startups. With limited time, resources, and manpower, you're always weighing the relative benefits of building a piece of software in-house and buying it from a third-party vendor.

Even enterprises with access to the necessary resources face this challenge. Do they build because they can or trust someone to do it better and more efficiently than they can?

As time passes and the needs of startups and enterprises become more complex, new products and services contribute to making the decision to buy an increasingly beneficial one.

Here's a look at the history of some major technological innovations and how they changed perceptions of whether to build or buy software and platforms.

## The Rise of Relational Databases

Businesses have always been interested in the collection of data, but the introduction of the desktop computer as a mainstay of the office (and the home) brought their data collection capabilities to a whole new level.

By the 1980s, buying software like dBASE (for databases) or Lotus 1-2-3 (for spreadsheets) had become commonplace. Oracle's market-leading database software was a few years old and had already permeated thousands of businesses.

This revolution started in the early 1970's, when [E.F Codd](https://en.wikipedia.org/wiki/Edgar_F._Codd) first presented the concept of relational databases.

Before Codd's groundbreaking paper, there had been two models for how computerized databases could work: the hierarchical model and the CODASYL model (or network model). These were both based on *navigational* data models, meaning you found entries primarily through references from other entries. Numerous shortcomings with this method, including the total lack of a “search” functionality, encouraged Codd to look for a new system.

His proposed relational system proved to be far more efficient, and it enhanced the productivity of those who used it greatly. Programmers who wanted to access and use a relational database didn't need to [worry about how the data was stored](http://avant.org/project/history-of-databases/). They only needed to run the queries outlined in the emergent Structured Query Language—or SQL.

![DBMS interaction](https://cdn.auth0.com/blog/build-becomes-buy/dbms_interaction.png)

While IBM fretted over how a relational database product would cut into the revenue they were generating from their navigational database product, Oracle CEO Larry Ellison had no such concerns. Within a few years, the relational database and SQL—the language used to interact with it—had become the default option. [Oracle](https://www.oracle.com/), based on the strength of their relational database product, reaped the rewards of this shift.

In the case of databases, the shift from build to buy came about as a result of the creation of **standards**. Prior to the relational takeover, there was no standout protocol, too many competing options, and no compelling reason to use any particular system over another.

With the rise of the relational database came not only standardization but the opportunity for companies to take that standard model and run with it, creating suites of applications *around* the database. With Oracle, for instance, every additional application that they released to their customers came bundled with, relied on, and expanded the utility of the customer's database. They aimed to become the hub around which a business's whole operations revolved, not just their database provider.

The standardization of the relational model made it possible for companies to begin providing truly great customer experiences. Here was a model that simply made more sense that everything that had come before—not only was it better for customers, it was better for entrepreneurs looking to solve problems for those customers.

## Access to Affordable CRM

The 1980's also marked the beginning of attempts to digitize the messy universe of *Customer Relationship Management* (CRM).

The earliest software was database-driven and was more [digital Rolodex](https://www.crmswitch.com/crm-industry/crm-industry-history/) than true relationship manager. The organization of customer contact information was its primary purpose. Siebel was born in the 1990's, becoming the first “sales force automation” product to really capture the market—but it was still limited in that it was exclusively sold to big enterprises (It's worth noting that founder Tom Siebel came from Oracle.)    

But the vast market of small to medium sized businesses remained largely without, relying on e-signatures and email to add order to the process of customer relationship management. That was until [Salesforce](https://www.salesforce.com). The *SaaS* (Software as a Service) model of Salesforce, driven home by founder Marc Benioff's guerrilla “software is dead” marketing, resulted in a product that was tailor-made (cost-wise) for *SMBs* (small and medium-sized business).

For the first time, a *CRM* tool could truly add value to the operations of an *SMB* and make buying a *CRM* a worthwhile endeavor. Their subscriber base grew rapidly.

![Salesforce growth](https://cdn.auth0.com/blog/build-becomes-buy/salesforce-subscribers.jpg)

What Hubspot's Dharmesh Shah calls their ["simple pricing and low-risk implementations"](https://www.quora.com/Why-did-Salesforce-com-succeed) allowed Salesforce to become the favored product of a massive market of *SMBs* in need of a *CRM*.

The introduction of Salesforce helped shift *CRM* from a transactional model where customers were just seen as data points to a relational model where customers were seen as business partners.

Like Oracle, they used the fact that they were becoming embedded in so many companies to begin offering add-ons that would cement their positioning. Look at their revenue today and it's clear that those add-ons—the Salesforce platform, analytics, marketing, and other services—are what drive Salesforce's [growth now](http://www.forbes.com/sites/greatspeculations/2015/11/25/here-is-the-reason-behind-salesforces-unabated-growth/):

![Salesforce Markets](https://cdn.auth0.com/blog/build-becomes-buy/salesforce-markets.jpg)

What those additional layers of services tell us is that once again, adding value on top of your core proposition is what can make buying (rather than building) a true no-brainer.

![Salesforce definition](https://cdn.auth0.com/blog/build-becomes-buy/salesforce-definition.png)

Even today, businesses might not want to spend the money to pay for Salesforce or another kind of *CRM*. But the value being proffered now is so much greater. It's not just the *CRM* tool that you're paying for—it's a whole suite of analytics and services to help drive more value out of that data.

## The Evolution of Payments

Tech companies have never been very well served by banks, making online payments processing a tricky process. Banks were more focused on helping large enterprises manage high-return credit opportunities.

By the 2000s, new companies like Authorize.net and PayPal were working on the problem of online payments—but not truly cracking it. With Authorize, companies had to have a bank account linked to it. PayPal, on the other hand, had acquired a reputation for not being very user-friendly (by occasionally holding funds, for instance) and so payment remained a thorny problem for upstart developers.

Both eventually moved upmarket, leaving startups without a simple way to process payments just as consumer demand for it was increasing. There was no simple option—until [Stripe](https://stripe.com/).

At its start, Stripe did one thing really well. They made it incredibly easy for businesses to collect payments online. Whatever the revenue model—one-time, transactional, subscription—you could take a developer, and have they set up a working payments portal in one afternoon with just a few simple API calls. The onboarding was simple, efficient, and it got people up and running fast.

![Stripe landing page](https://cdn.auth0.com/blog/build-becomes-buy/stripe-landing-page.png)

It's not enough to make something easy, of course.

What Stripe has done to move the tech world firmly into “buy” territory, when it comes to payments, is find the same kind of network effects that Oracle and Salesforce did.

When you use Stripe for payments, you're not just saving yourself the time it would have taken you to build a payments gateway. You're taking advantage of the fraud detection systems that Stripe has built. You're taking advantage of their massive marketplace of integrations. You're getting other features like international transfers and instant debit card payouts that are difficult to get whether your organization is small *or* large.

In other words, everyone has something to gain from buying Stripe vs. trying to build their own payments processor.

## Emergence of Identity as a Service

These technological shifts are just beginning. Every year, another industry is disrupted by the emergence of new back-end technologies that enable startups and enterprises alike to stop building and start buying. There's [Algolia](https://www.algolia.com/) for search, [SendGrid](https://sendgrid.com/) for email, [Zapier](https://zapier.com/) for workflow automation, and of course, there's *Identity and Access Management* (IAM).

When it comes to managing user identities, companies of all sizes used to build all of their own systems. This came with plenty of difficulties, like creating a flexible and secure *Single Sign-On* (SSO) system to maintaining security amidst ever-increasing threats.

These systems were also very expensive to build and maintain, but at the time, businesses had few options other than to build.

![Emergence of identity as a service](https://cdn.auth0.com/blog/build-becomes-buy/iam.png)

It wasn't until *IAM* was introduced as *Identity as a Service* (IDaaS) that businesses were able to outsource to get a comprehensive identity management solution. With *IDaaS*, businesses, especially startups, can feel secure in everything from *SSO* to using cloud-based environments for access controls and compliance.

Anyone can now trust their compliance, authentication and security needs with a specialized provider. They don't have to worry about exposing themselves to vulnerabilities because of the risks involved with building their own system.

Nor do they have to worry about the cost of revisions and upgrades for an in-house product. These can be expensive, time-consuming to handle and require constant involvement, especially as a business grows.

## Aside: Securing Applications with Auth0

Are you building a [B2C](https://auth0.com/b2c-customer-identity-management), [B2B](https://auth0.com/b2b-enterprise-identity-management), or [B2E](https://auth0.com/b2e-identity-management-for-employees) tool? Auth0, can help you focus on what matters the most to you, the special features of your product. [Auth0](https://auth0.com/) can improve your product's security with state-of-the-art features like [passwordless](https://auth0.com/passwordless), [breached password surveillance](https://auth0.com/breached-passwords), and [multifactor authentication](https://auth0.com/multifactor-authentication).

[We offer a generous **free tier**](https://auth0.com/pricing) so you can get started with modern authentication.

## To Buy or Not to Buy

Products and services for enterprises and startups have come a long way in many areas of technology. While it used to make sense to build in-house, customer needs and expectations have become more complex. This change means technology has to adjust accordingly.

You don't have to use your precious time trying to figure out something if you buy a third-party solution. Even if you have the capability and resources, chances are there's something you haven't thought of.

Let companies who've put in the time and research take care of processes that they can manage more effectively. If it makes sense for you to buy, your time is best spent on growing your business and focusing on what *you* do best.
