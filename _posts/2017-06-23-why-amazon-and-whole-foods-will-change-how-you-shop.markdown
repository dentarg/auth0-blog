---
layout: post
title: "Why Amazon and Whole Foods Will Change How You Shop"
description: "Amazon's bold play for Whole Foods isn't just about the impending automation of the retail sector, it's about the increasing importance of IAM in redefining consumer behavior."
date: 2017-06-23 8:30
is_non-tech: true
category: Growth, Industries
author:
  name: Diego Poza
  url: https://twitter.com/diegopoza
  avatar: https://avatars3.githubusercontent.com/u/604869?v=3&s=200
  mail: diego.poza@auth0.com
design:
  bg_color: "#3D0249"
  image: https://cdn.auth0.com/blog/singlevision/logo.png
tags:
- security
- retail
- customer
- vision
- auth0
related:
- 2016-09-22-yahoo-confirms-data-breach-of-half-a-billion-user-accounts
- 2016-08-16-how-real-state-companies-can-implement-open-id-connect-with-auth0
- 2017-02-08-is-multifactor-authentication-the-best-way-to-secure-your-accounts-myths-and-reality
---

Amazon is poised to reinvent the grocery store from the ground up. They've been experimenting with cutting-edge retail automation through their Amazon Go experiment, leading to strong speculation about how they're going to enter the brick and mortar grocery market. Now we've got our answer: with Whole Foods.

The high-end organic retailer is likely going to be a pilot for applying the highly anticipated Amazon Go model: a way for consumers to shop without ever waiting in line for a register — a massive shift that brings identity to the center of the retail experience. This is a bold play that is going to change the way IAM works in retail, and forever change consumer expectations and behavior.

In this article, we're going to break down the underlying architecture of Amazon's retail automation model, its impact on consumers, and highlight the ways in which identity management stands as the keystone of this entire retail revolution.

## How Amazon Rethinks Shopper's Identities

Amazon has well-established forays into the grocery space with its Prime Pantry and Amazon Fresh services, but its first brick and mortar entry is the Amazon Go beta store in Seattle. As an entirely cashierless store, customers scan their phones as they enter the store, shop for the items they want, and leave the store without waiting.

![Wholefoods](https://cdn.auth0.com/blog/wholefoods/new.png)
_[Source](https://www.engadget.com/2016/12/05/amazon-go-grocery-store/)_

The technology is an ingenious combination of computer vision, sensor fusion, and Amazon's ability to assign these datapoints to specific customers. Cameras observe, track, and identify customers as they make purchases, and these are matched up with their Amazon accounts, allowing them to simply leave the store knowing that their purchases have been attributed to their accounts.

This is possible due to Amazon's 2014 [patent filing](http://bit.ly/2tWF8gB) for “Transitioning Items From a Materials Handling Facility”, which reveals the underlying systems at play that enable sensor data to be applied to specific customer identities.

According to the patent, an item identifier list — a customer's cart, so to speak is said to use skin tone identification to keep a customer's carts distinct from one another while in-store. Upon exiting the store, the user is identified so this internal store shopping list can be attributed to a customer's Amazon account. This reveals that identity is the key to seamlessly merging back-end stock logistics to front-facing customer billing.

Amazon Go is clearly a new benchmark for IoT retail. With its system, a store can at once know the real-time status of every item, attribute these items to individuals, and then instantly bill them for it.

The behavioral analytics potential of linking all stages of the supply and purchasing funnel is immense, allowing Amazon to pursue a more agile and responsive brick and mortar retail strategy. Customers might even be able to get real-time suggestions based on their shopping lists, or even get coupons for items they're mulling over — all because of identity.

## Implications for Whole Foods

Amazon's announcement of its intent to purchase Whole Foods not only has the potential to upend the grocery sector, it also promises to radically alter the retail sector in terms of identity management and employment policy.

![Whole foods Market](https://cdn.auth0.com/blog/whole/foods.png)
_[Source](http://www.wholefoodsmarket.com/stores/southlakeunion)_

Amazon's blueprint for a hyperconnected identity and authentication management system is in many ways unchartered territory. Grocers already do track shopping analytics through [reward card incentives](https://www.theguardian.com/money/2013/jun/08/supermarkets-get-your-data), which allow them to develop a complex view of their customer's behaviors. However, Amazon's novel unification of these backend analytics with specific customer identities increases the value of this data collection.

The consolidation of both front-end analytics and back-end logistics may be able to offer a whole host of new efficiencies in the grocery sector. Whether it be through a more agile inventory management system that reduces waste and spoilage, or by automation-led workforce reduction, Whole Foods may be able to pursue a more targeted and lean approach to its operations.

Additionally, given Whole Food's affluent and aspirational demographic reach, the experimental appeal of a new, automated shopping experience could prove to be a huge draw, not only for those who are excited to try the latest tech, but for those who will benefit from a more effortless shopping experience.

## Implications for Customers

It's still unclear as to how Amazon intends to scale its Amazon Go technology across hundreds of much larger stores across the US. Even murkier is how customers will react to these large, systemic changes in consumer behavior. Amazon will have to work to ensure that the friction of getting customers up and running in an Amazon Go-style store isn't prohibitive.

### Advantages for Customers:

The advantages of this shift to identity-centric IoT retail are pretty clear:

* Eliminations of lines, shoplifting, and cashiers could lead to savings that are passed along to consumers.
* Customers can access new insights into their spending and consumption patterns.
* The personalized experience of online shopping with hyper-targeted discounts and suggestions can now be experienced offline.
* Store stock can be more responsive to the needs and preferences of customers.

### Disadvantages for Customers

With all this flexibility that comes with identity-centric automation, there also comes the sense that Amazon is seeking to expand its walled garden ever outward.

* Consumers may not be comfortable with the accuracy of automated cashierless stores, or they might reject attempts to customize their shopping experience based on identification.
* Given Amazon's recent patent filing for [blocking comparison shopping-in store](http://tu9srvbirvvtmtukd3d3lnbhddjwzgyub3jn.g00.pcmag.com/g00/2_d3d3LnBjbWFnLmNvbQ%3D%3D_/TU9SRVBIRVVTMTUkaHR0cHM6Ly93d3cucGF0MnBkZi5vcmcvcGF0ZW50cy9wYXQ5NjY1ODgxLnBkZg%3D%3D_$/$/$), it seems like the overall approach isn't simply to make shopping more effortless for its customers, but also to proactively shape buyer behavior.
* While the convenience and hyper-targeting afforded by the Amazon Go model is a draw, there's also a chance that it alienates customers who already feel overly reliant on Amazon's retail ecosystem.

As retail automation becomes more reliant on customer identity to function, retailers should keep in mind that customers are willing to play along if there's a net benefit to them. Once they start to feel walled in or beholden to a monopolized retail experience, things can go awry, so it is in the best interest of retailers to not visibly commodify customer identity when developing IAM-centric automated retail platforms.

## The Road Ahead

Amazon's bold acquisition of Whole Foods indicates its willingness to radically upend one of the most staid and reliable sectors of consumer spending. While Amazon Go is a clear model for what Amazon wants to do in the grocery space, it's still unclear as to how it will apply this model to Whole Foods.

Regardless, it is clear that the future of retail is just as much about identity management as it is about the waning days of the cashier age. Amazon is betting that consumers are willing opt-into the necessary identity procedures that enable them to take advantage of seamless checkout and billing procedures. With Whole Foods now in its portfolio, Amazon will surely have plenty of room to experiment and refine this new paradigm of the retail experience.