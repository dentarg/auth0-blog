---
layout: post
title: "What Cloudbleed Means for You and Your Customers"
description: "Tavis Ormandy, a vulnerability researcher at Google, discovered that Cloudflare was accidentally leaking sensitive data including passwords, private messages, and more. Learn how this may affect you and your customers and what to do next."
date: 2017-02-28 8:30
category: Security
author:
  name: Diego Poza
  url: https://twitter.com/diegopoza
  avatar: https://avatars3.githubusercontent.com/u/604869?v=3&s=200
  mail: diego.poza@auth0.com
design:
  bg_color: "#4A4A4A"
  image: https://cdn.auth0.com/blog/cloudbleed-post/cloudflare-logo.png
related:
  - 2016-11-30-different-ways-to-implement-multifactor
  - 2015-12-17-json-web-token-signing-algorithms-overview
tags:
  - security
  - cloudbleed
  - cloudflare
---

On February 17th, Tavis Ormandy, a vulnerabilities researcher at Google, sent the tweet that kicked off 2017's biggest security story yet:

![Tweet](https://cdn.auth0.com/blog/cloudbleed-post/tweet.png)

*Could someone from cloudflare security urgently contact me.* That's not something anyone wants to read on a Friday afternoon, but especially not when it's coming from one of the world's top infosec researchers.

The problem? While doing some routine bug checking, [Ormandy](https://twitter.com/taviso?lang=en) saw some data that did not match at all what he expected to find.

"It's not unusual to find garbage, corrupt data, mislabeled data or just crazy non-conforming data...but the format of the data this time was confusing enough that I spent some time trying to debug what had gone wrong, wondering if it was a bug in my code," [he wrote](https://bugs.chromium.org/p/project-zero/issues/detail?id=1139), "In fact, the data was bizarre enough that some colleagues around the Project Zero office even got intrigued." 

The rest of the Google Project Zero team (a team of security researchers employed specifically to find new [zero-day exploits](https://en.wikipedia.org/wiki/Project_Zero_(Google))) probably expected Google's announcement of the first [practical SHA-1 collision](https://auth0.com/blog/sha-1-collision-attack/) to be the big news of the week. 

As they looked closer, they found “encryption keys, cookies, passwords, chunks of POST data and even HTTPS requests” for all sorts of different sites using Cloudflare—private messages, reservations, plaintext API requests from a password manager, hotel bookings.

How did all of this happen? 

## Cloudflare was dumping memory across the web

It begins with a simple bug in the code to Cloudflare's highly popular reverse proxy service. HTTP requests to certain types of sites signed up with Cloudflare would trigger the bug, which would then "leak" data from random* *Cloudflare customers' sites (those that happened to be in memory at the time).

![Cloudflare](https://cdn.auth0.com/blog/cloudbleed-post/cloudflare.png)

*A simple depiction of how a reverse proxy like Cloudflare's works. Since reverse proxies are shared between customers, data from all was at risk of being disclosed.*

Since September, random bits of data have been coming out of initialized memory and leaking across random Cloudflare customer's sites. In other words, if you went to visit a site that used Cloudflare, you could have had other people's sensitive information “leaking” into your own browsing session.

 When search engines “crawled” these pages to index them, the same kind of information “leaked.” Because search engines cache the output they receive when they visit a page, all these leaked tokens, secrets, and messages were indexed, split up and spread across *millions *of pages of search results. 

![Search Results](https://cdn.auth0.com/blog/cloudbleed-post/SERPs.png)

(Source: [Wordfence](https://www.wordfence.com/blog/2017/02/cloudflare-data-leak/))

While Cloudflare is working with the major search engines to purge their caches of sensitive information now, it's hard to avoid thinking about the paranoid version of events. 

Paranoid version: state actors, or state-sponsored actors with significant resources, discovered this vulnerability before Google did. They found a way to send manipulated HTTP requests to Cloudflare sites that would output a predictable stream of user data—and have either packaged everything they found for resale or set about figuring out how to crack what could be billions of passwords, credit card numbers, and secret tokens.  

Cloudflare claims they can rule out this scenario with access logs, but whether or not that's true has been subject to [some debate](https://news.ycombinator.com/item?id=13721452). 

## What you should do now

The way that data was disclosed means that any site using Cloudflare could potentially have had its secrets and tokens compromised. Patreon, Yelp, Uber, Medium, Fitbit, and OKCupid all use Cloudflare—for a full list of sites you can [click here](https://github.com/pirate/sites-using-cloudflare). Several tools have also been [built to assess your risk](http://www.doesitusecloudflare.com/), like this script that [crawls your Chrome history](https://gist.github.com/kamaljoshi/2cce5f6d35cd28de8f6dbb27d586f064). 

Though many, many sites use Cloudflare, at least to some degree. It's still quite unlikely that your personal information has been exposed. Many of the individual sites mentioned have also come out and written posts to explain whether you should be concerned—perhaps most notably, 1Password, which was initially mentioned in Tavis's tweets as a [potentially compromised site](https://blog.agilebits.com/2017/02/23/three-layers-of-encryption-keeps-you-safe-when-ssltls-fails/). 

The first thing you want to do to protect yourself from this and future incidents is to enable [multifactor authentication](https://auth0.com/multifactor-authentication). The most important sites to enable MFA on are the ones you use as an SSO iDP—if you're logging into 20 different sites using your Google credentials, then you definitely want to enable some form of MFA there. 

While it's unlikely your passwords were exposed, this is as good a reminder as any that you should be using strong, unique passwords and organizing them using a password manager. 

Resetting individual passwords for sites doesn't make much sense—the list of compromised sites is simply so vast. The only solution is to do a mass reset and make sure you're using proper password hygiene going forward. 

## What you should do for your customers

As a site operator, you're probably wondering 1) if you're at risk, and 2) if any of your users' data was exposed in this incident.

Cloudflare has already reached out to domain owners that they have proactively identified as being at risk in this leak. However, the absence of notification does not mean that your domain (and customers) are safe.

First off, enable multifactor authentication [if you haven't already](https://auth0.com/multifactor-authentication). It's the easiest way to get a huge boost to the security of your site.

Many site operators have begun forcing password resets for all of their users. If you run a consumer site, it may not be worth the trouble and inconvenience. If your customers are in the enterprise, then it is probably a very good idea to force a change. If you're not going to make your users change their passwords (and from a cursory browse of the web this Monday morning, it appears that this is mostly the case), then you should at least recommend it.

As far as data invalidation, any secrets which you can easily rotate—session identifiers, tokens, keys—should immediately be changed. Customer SSL keys do not appear to have been compromised in this incident, but it would be prudent to change as much data as you can which may have passed through Cloudflare.  

If you or any of your customers are regulated by the Health Insurance Portability and Accountability Act (HIPAA), then you'll [definitely want](https://www.aptible.com/blog/aptible-was-not-affected-by-cloudbleed/) to have your security/compliance teams get in touch with your lawyers and discuss whether this is a breach that needs to be reported. 
