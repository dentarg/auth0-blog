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
  <strong>Forrester Research conducted a comprehensive analysis of our identity platform and determined significant quantifiable benefits after implementation. Read the full report: <a href="https://resources.auth0.com/forrester-tei-research-case-study/">Total Economic Impact of Auth0</a>.</strong>
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

Despite all these problems, companies ~~are~~ often loathe ~~to spend~~ spending the time and money to replace these systems because it can cripple their short-term ability to innovate. They also risk eroding customer confidence in the product if a [customer might experience](https://www.zendesk.com/resources/why-companies-should-invest-in-the-customer-experience/) adverse, if temporary, effects.

For example, a football stats app may not want to make drastic changes which could cause downtime right before the playoffs, the night before the Super Bowl, right before the draft, or when fantasy football starts, leaving them feeling like there might not be any good moment to tackle upgrades.

But the issues with legacy systems will get larger and larger over time—the longer you wait, the more entrenched you'll be, and the less vendor support you'll have during a switch.

![How legacy systems problems get bigger and bigger](https://cdn.auth0.com/blog/modernize-legacy-system/legacy-system-dilbert-02.png)
_[source](http://dilbert.com/strip/2017-02-22)_

In addition to all the other problems above, legacy systems can cause you to miss out on new security protocols. In an area near and dear to our hearts, [authentication](https://auth0.com/blog/is-passwordless-authentication-more-secure-than-passwords/), legacy systems using sessions and cookies no longer cut it with modern applications.

You can learn more about how sessions and cookies work [here](https://auth0.com/blog/5-steps-to-add-modern-authentication-to-legacy-apps-using-jwts/), but what you really need to know is that the process requires the server to save the user's authentication state. This state is then referenced whenever the user makes a request. This protocol works fine for traditional apps, but today apps are deployed across many servers, use RESTful APIs, and rely on downstream services. All of this runs slower when using [stateful](https://nordicapis.com/defining-stateful-vs-stateless-web-services/) systems rather than stateless ones, like JSON Web Tokens (JWTs).

Sticking with your legacy systems prevents you from harnessing the full benefits of this new technology.

## Identifying ways to modernize your system

If your system does need an upgrade pretty much everywhere, how do you know where to start? You likely only have the resources to take care of a few issue at ~~the moment~~ any one time.

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

This will form the basis of selection 
