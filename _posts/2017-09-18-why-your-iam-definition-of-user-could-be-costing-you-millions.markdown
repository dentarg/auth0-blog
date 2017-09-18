---
layout: post
title: "Why Your IAM's Definition Of “User” Could Be Costing You Millions"
description: "Because paying “per user” doesn't factor in activity levels, you could be drastically overpaying"
date: 2017-09-18 8:30
category: Growth
banner:
  text: "Auth0 makes it easy to add authentication to your application."
author:
  name: Diego Poza
  url: https://twitter.com/diegopoza
  avatar: https://avatars3.githubusercontent.com/u/604869?v=3&s=200
  mail: diego.poza@auth0.com
is_non-tech: true
design:
  image:
  bg_color: "#"
tags:
- legacy
- modernization
- digital transformation
related:
- 2017-07-21-the-role-of-identity-in-application-modernization
- 2017-07-14-getting-a-competitive-edge-with-a-microservices-based-architecture
- 2017-08-22-for-the-best-security-think-beyond-webhooks
---

Depending on your industry, the traditional identity and access management (IAM) provider's pricing structure could be costing you millions of dollars every year.

It comes down to how they define a “user.” Most IAMs charge on a direct per-user rate: $2 a user per month, $4 per user per month, and up from there.

What they don't do is distinguish between registered user and **active user**, someone who actually uses your product once a month(or more).

The VC Fred Wilson has observed that for virtually all web and mobile companies, only 30% of those who register/download the product are active on a [monthly basis](http://avc.com/2011/07/301010/).

For companies in some specialized industries, that percentage can dip even lower. In fields like insurance or healthcare, most “users” active once or twice a year, if that.

Despite this, the majority of IAMs still charge them every single month for _every single user_ they have on the books:

[Charges](https://cdn.auth0.com/blog/iam/charges.png)

[Another pricing](https://cdn.auth0.com/blog/iam/another-charges.png)

[Centrify App Services](https://cdn.auth0.com/blog/iam/centrifyappservices.png)

This pricing system can cost businesses millions of dollars a year because while they may have a total of 5 million users signed up with their service, only a given 100,000 use the service with any regularity.

Or, because while hundreds of thousands may need to have accounts in order to protect sensitive information (like healthcare information or financial records), few need to sign in on a monthly basis. Or, some do, but they're mostly other healthcare providers using enterprise connections, not consumers.

For many types of businesses, paying “per user” as if all of these kinds of usage were the same simply doesn't make sense.

### What Gyms and IAMs Have In Common

For many types of businesses, the “per user” identity management pricing model is the worst of the classic seat-based pricing model combined with the psychology of the gym membership.

The business model of many gyms today relies on people [not showing up.](http://www.npr.org/sections/money/2014/12/30/373996649/why-we-sign-up-for-gym-memberships-but-don-t-go-to-the-gym) People sign up for yearly gym memberships, ambitiously. Then, they neglect to actually go. The fact that a majority of gym members do not regularly visit the gym drives prices down for everyone, and so the slackers subsidize everyone else.

While not exactly the same type of business, Americans only visit their doctors [4 times a year](https://www.forbes.com/sites/niallmccarthy/2014/09/04/americans-visit-their-doctor-4-times-a-year-people-in-japan-visit-13-times-a-year-infographic/#56a1f24ee347). Even if you assume that people will interact with their healthcare provider's online dashboard upon each occasion of them visiting, that's still only 4 logins per year. If you're paying your IAM a flat fee per “user” every month, but only a handful of those users use your product every year, you're paying for a lot of services you don't really need.

Avoiding the topic of consumption when talking about pricing is a [common problem](https://hbr.org/2002/09/pricing-and-the-psychology-of-consumption). Companies try to get you to pay upfront for services, knowing you probably won't use them to the fullest extent possible.

[Payments](https://cdn.auth0.com/blog/iam/payments.gif)
(Source: [HBR](https://hbr.org/2002/09/pricing-and-the-psychology-of-consumption)) _When you pay annually for a service, your usage drops off steadily throughout the year as the financial impact of payment becomes a distant memory._

However, businesses that mask how much you've spent on a service (vs. how much value you've gotten out of it) often wind up “trading off long-term customer retention for short-term increases in sales.”

Sooner or later, in other words, we realize that we've been paying $50 a month for a gym membership we never use, we do the mental math, and we cancel.

### The Low-Active-User Enterprise

There are many industries out there affected by the kind of inefficient pricing model described above, with insurance and healthcare as two of the most prominent.

Americans file auto collision insurance claims about [once every 17.9 years](http://www.foxbusiness.com/features/2011/06/17/heres-how-many-car-accidents-youll-have.html). They file homeowners insurance claims every [9 to 10 years](http://finance.zacks.com/average-homeowner-file-insurance-claims-8387.html). During the 4 visits Americans make to the doctor annually, they don't log in to their healthcare provider's online dashboard—they just hand their identifying information over. And yet in these industries, healthcare and insurance, having continuous, HIPAA—certified, secure identity management is a must.

Let's say you're an insurance company and only about 5% of your overall users actually sign into your online portal each month.

We give away Auth0 support for up to 7,000 active users for free. However, you could support 140,000 _registered _users on that plan if only 5% of your users log in every month.

When you're ready for multifactor authentication, compliance-ready reporting and enterprise connections, you can upgrade to a fuller plan and _still _pay per active user—just $1,025/mo with 7,000 active users and 100 enterprise customers.

[Auth0 Pricing](https://cdn.auth0.com/blog/auth0/pricing.png)

If you have 140,000 overall users, but only 5% log in every month, you're still going to pay $4 per _every _user every month. That's $560,000 every month.

That's a price point that just doesn't make sense if you're a business with a low overall active user count. When usage of a product varies so greatly across different industries, per seat pricing models should take that into account.

It's not just insurance and healthcare that face these kinds of problems. Government agencies experience them too, as we can see from a FEMA Request for Information drafted while the agency was in search of a new IAM solution:


<blockquote> It is a desire of the Agency to obtain a pricing approach that supports the **variable nature of the size of the FEMA user community**. During periods after large disasters and other events, the Agency user-base may substantially increase in size for a period of time. The vendors should provide creative pricing structures, where possible **such that FEMA does not have to pay / pay less for accounts that are infrequently used**, but still active (e.g., FEMA’s Disaster Reserve Workforce needs quick access when they are activated, but may not be active for long periods of time). </blockquote>

(Source: [FCW](https://fcw.com/articles/2009/01/27/fema-seeks-it.aspx))


FEMA doesn't want their IAM to charge them for hundreds of thousands of users when the total number in the Agency's userbase will be far lower the majority of the time. Nor do insurance providers, healthcare companies, or any business with these kinds of variable levels of activity. When they do, they're effectively subsidizing the price paid by B2C and B2B products with much higher activity-to-user ratios.

### Transparency In Pricing

[Value-based pricing](https://en.wikipedia.org/wiki/Value-based_pricing), as opposed to competitor or cost-based pricing, aims to track the price of a product or service to the perceived value that it delivers to its customers.

We believe transparency and pay-for-what-you-use pricing help us get our pricing in line with our value.

If you need secure login, enterprise connections, and multifactor authentication, but the level of activity among your user base is unevenly distributed or highly variable, we believe you should pay a different amount than a product where 50% of all users are active on a monthly basis.

Not just because it can be a cost savings for you, but because it means that you're paying for the services you're receiving, and no more—not subsidizing all of the social apps and networks of the world. 