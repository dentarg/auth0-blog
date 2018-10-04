---
layout: post
title: "How Do I Modernize my Legacy System?"
description: "Don't be daunted by how much of your system needs replacing. We'll show you how to get started."
date: 2017-10-13 8:30
category: Growth
banner:
  text: "Auth0 makes it easy to add authentication to your application."
author:
  name: Martin Gontovnikas
  url: http://twitter.com/mgonto
  mail: gonto@auth0.com
  avatar: https://www.gravatar.com/avatar/df6c864847fba9687d962cb80b482764??s=60
is_non-tech: true
design:
  image: https://cdn.auth0.com/blog/modernize/logo.png
  bg_color: "#376326"
tags:
- legacy
- modernization
- digital transformation
related:
- 2017-07-21-the-role-of-identity-in-application-modernization
- 2017-07-14-getting-a-competitive-edge-with-a-microservices-based-architecture
- 2017-08-22-for-the-best-security-think-beyond-webhooks
---

<div class="alert alert-info alert-icon">
  <i class="icon-budicon-500"></i>
  <strong>Forrester Consulting analysis determines that using Auth0 can yield a 548% ROI and $3.7M in identity-related savings. Read the full report: <a href="https://resources.auth0.com/forrester-tei-research-case-study/">Total Economic Impact of Auth0</a>.</strong>
</div>

---

If you're dealing with a legacy system, you might need a complete overhaul. It's likely that many services have become outdated over the last 10 years you've had it, and patches don't really work long-term.

Legacy systems aren't good for business or your engineers' sanity, they keep you from introducing modern features while forcing the team to run around fixing bugs. However, a lot of companies stick with their legacy systems even when they know how badly they [need to modernize](https://auth0.com/blog/the-role-of-identity-in-application-modernization/). A major factor holding teams back is that you can't do an overhaul all at once.

That's ok, you just need to find your pain points, prioritize, and get started with some quick wins. We'll first talk about how legacy systems are damaging, and then lead you through how to locate the places in your system that need the most work, how to prioritize by cost, benefits, and alternatives, and how to update one piece at a time.

## How legacy systems hurt you

Legacy systems are structures that run on outdated technology, but that a company is still heavily reliant on. Using legacy systems can cost you money, time, quality, and trust. These are some of the biggest headaches of legacy systems:

* The old hardware needed to run legacy systems is rare, and thus more expensive (consider pagers, still widely used by hospitals and costing them about [$180,000](https://www.altexsoft.com/whitepapers/legacy-system-modernization-how-to-transform-the-enterprise-for-digital-future/) a year).
* Legacy systems were often built without modularity, meaning they don't include the code-sharing of modern systems and thus require changing many blocks of code, instead of just one, to make an alteration.
* The vendor who sold you your system may no longer support it, or even exist, which makes patching the system much more difficult.
* As staff who implemented the legacy system leave or retire, you need to train newcomers to use the system.


![How legacy systems hurt you](https://cdn.auth0.com/blog/modernize-legacy-system/legacy-systems-dilbert.png)

_[Source](http://dilbert.com/strip/2006-12-08)_

* Legacy systems often have backdoors to databases built in, making you an easy target for hackers.
* As your system accumulates little patches over time, it becomes more complicated and more prone to breakages.
* Legacy systems don't rely on open standards, so integrating with new technology is sometimes impossible.

Despite all these problems, companies are often reluctant to spend the time and money to replace these systems because it can cripple their short-term ability to innovate. They also risk eroding customer confidence in the product if a [customer might experience](https://www.zendesk.com/resources/why-companies-should-invest-in-the-customer-experience/) adverse, if temporary, effects.

For example, a football stats app may not want to make drastic changes which could cause downtime right before the playoffs, the night before the Super Bowl, right before the draft, or when fantasy football starts, leaving them feeling like there might not be any good moment to tackle upgrades.

But the issues with legacy systems will get larger and larger over time—the longer you wait, the more entrenched you'll be, and the less vendor support you'll have during a switch.

![How legacy systems problems get bigger and bigger](https://cdn.auth0.com/blog/modernize-legacy-system/legacy-system-dilbert-02.png)
_[source](http://dilbert.com/strip/2017-02-22)_

In addition to all the other problems above, legacy systems can cause you to miss out on new security protocols. In an area near and dear to our hearts, [authentication](https://auth0.com/blog/is-passwordless-authentication-more-secure-than-passwords/), legacy systems using sessions and cookies no longer cut it with modern applications.

You can learn more about how sessions and cookies work [here](https://auth0.com/blog/5-steps-to-add-modern-authentication-to-legacy-apps-using-jwts/), but what you really need to know is that the process requires the server to save the user's authentication state. This state is then referenced whenever the user makes a request. This protocol works fine for traditional apps, but today apps are deployed across many servers, use RESTful APIs, and rely on downstream services. All of this runs slower when using [stateful](https://nordicapis.com/defining-stateful-vs-stateless-web-services/) systems rather than stateless ones, like JSON Web Tokens (JWTs).

Sticking with your legacy systems prevents you from harnessing the full benefits of this new technology.

## Identifying ways to modernize your system

If your system does need an upgrade pretty much everywhere, how do you know where to start? You likely only have the resources to take care of a few issues at any one time.

The first thing you need to do when looking to modernize your system is to [find your pain points](https://www.altexsoft.com/whitepapers/legacy-system-modernization-how-to-transform-the-enterprise-for-digital-future/) by following these three steps:

* Check which parts of your technology stack are no longer supported by their vendors.
* Conduct an architecture audit to determine how each area is performing, and how patched it is already.
* Create a flowchart, using a tool like [Gliffy](https://www.gliffy.com/), of how different parts of your legacy system work together.

The architecture audit is what comes to mind first when looking for pain points, but the other two steps are just as important. Checking for vendor support tells you how easy it will be to get help and updates for parts of your system, and the flowchart will reveal dependencies, one section may only appear weak because it's dependent on another one, which is actually the problem.

After you've created your list of pain points, you can perform a cost-benefit analysis for replacing those individual parts of your system with a new service, or simply patching them up. The short-term costs of replacement will always loom, but when you calculate the long-term saved repair costs, increased efficiency, and customer satisfaction, you may find that this outweighs the negatives.

## Prioritizing improvements

Once you know how much you'll gain (and lose) from replacing the parts of your system that hurt you the most, you need to be able to prioritize.

Distill your cost-benefit analysis of each of your pain points into the answers to three questions:

1. What will the company gain from replacing this portion of our system?
2. How much time/effort will we need to pull off this replacement?
3. How helpful would just patching this part be in the long-run?


This will form the basis of selection for what to work on first.

![Prioritizing Improvements](https://cdn.auth0.com/blog/modernize-legacy-system/prioritizing-improvements.png)

Check out our diagram above: You want to take on the problems that will get you the most value quickly. Notice that our chart shows preference for 'minimal time to replace' over 'higher benefit' (compare rows 3+4, or 5+6), that's because every bit that you update and separate from the rest of your legacy system declutters it and frees up your engineers' time.

Taking the time to dissect and prioritize at the beginning will ultimately make your modernization a shorter, easier process. It transforms your daunting update into a feasible plan.

## Updating one section at a time

Now we'll discuss how to get started on those improvements. The two things to focus on are a microservices-based approach and getting yourself some quick wins!

### Moving toward Microservices

You should look to remove pain points from the rest of your stack rather than simply replacing them. Following this process will guide you toward a microservice-based system, in which an application is separated into small sets of services. Once your monolithic legacy system is reconfigured as microservices, each service can further evolve without disrupting the rest of your system.

![Moving toward Microservices](https://cdn.auth0.com/blog/modernize-legacy-system/moving-toward-microservices.png)
[*[source](http://soolan.com/microservice-architecture-implementation/)*]

Keeping microservices in mind will help you today and in the future when small parts of your system can be easily updated as needed.  You don't want to keep your system monolithic and end up with the same complicated, entangled mess 5-10 years in the future.

### The quick first step

Every app is going to have a slightly different list of priorities. But three areas that are usually a great place to start for quick and high value are [payments, messaging, and identity](https://auth0.com/blog/getting-a-competitive-edge-with-a-microservices-based-architecture/). These areas all have comprehensive solutions which let you offload critical functionality to a 3rd party SaaS product in a snap.

* **Payments. **Customers have come to expect a seamless online payment system, and there's no point to risking turning them off by relying on your legacy system when platforms like Stripe and Zuora provide fast, well-trusted payment processing.
* **Messaging. **Messaging too has become an essential part of any app as customers no longer only interact with a product through email. But with products like Twilio, your team doesn't have to worry about any of it.
* **Digital identity.** Identity is one of the most complex items a company has to deal with, and one tiny mistake can result in a devastating data breach. Trying to constantly make changes to keep up with security protocols by adding [multifactor identification](https://auth0.com/learn/get-started-with-mfa/) and breached password detection to your legacy system is a disaster waiting to happen. When you work with providers like Auth0, all the facets of identity, [authentication, authorization, user profiles, and security](https://auth0.com/blog/the-role-of-identity-in-application-modernization/) are taken care of by us.

When you get started on modernizing your system, the rest of it will still be problematic. You want your first steps to be handled by experts, far away from your hiccuping legacy system. But once you get those first steps done, you'll already be so far ahead of your old system.

## Upgrade before you get left behind

Modernizing a legacy system can seem impossible, but breaking it down into small pieces will help you get started.

This is a task you cannot procrastinate on, it will just get harder and harder to maintain your legacy system. Switch over now and reap the benefits of a modern system instead of waiting to be forced into a more painful, more expensive switch later on.

Don't be like the [52%](http://www.techradar.com/news/more-than-half-of-businesses-still-rely-on-windows-xp) of businesses that still run instances on the long outdated Windows XP, you're better than that.
