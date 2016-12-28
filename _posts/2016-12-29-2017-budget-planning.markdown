---
layout: post
title: "2017 Budget Planning for Technology Startups: Authentication is Key"
description: "We take a look at budget planning for startups and find out why making authentication part of the budget is more important now than ever"
date: 2016-12-29 13:00
category: Technical Guide, Frontend, JavaScript
author:
  name: Sebastián Peyrott
  url: https://twitter.com/speyrott?lang=en
  mail: speyrott@auth0.com
  avatar: https://en.gravatar.com/userimage/92476393/001c9ddc5ceb9829b6aaf24f5d28502a.png?size=200
design:
  bg_color: "#222228"
  image: https://cdn.auth0.com/blog/es6rundown/logo.png
  image_size: "100%"
  image_bg_color: "#222228"
  blog_series: false
tags:
- budget
- authentication
- expansion
- scaling
- startup
- startups
related:

---

2017 is coming and with it so do many tough decisions for startups and small businesses alike. Budget planning is perhaps the hardest of them. In this short article we will take a look at what is important for tech startups, how to aim for success in the coming year, and why you should consider authentication an important part of your budget. Read on!

{% include tweet_quote.html quote_text="Budget planning is tough, and authentication should be a part of it" %}

-----

## Introduction
December, the perfect time to review the failures and successes of last year. Startups fail and succeed based on their vision, so sitting back and reflecting on the things that went wrong is key to eventually becoming a successful, self sustaining company. An important part of this job is finding where exactly it is wise to use (or invest) the precious money from your investors. And in the world of ever cheaper, commoditized, software engineers, it is tempting to say "let's roll this feature in-house". This *might* be a great call. Think of Amazon: they developed a whole class of internal appliances and services. They invested millions on the necessary infrastructure, and, now, in retrospective we can say it *was* the right call. 

But what would have happened had Amazon made that same decision, to invest millions upon millions on the development of their own infrastructure and software, today? Would Amazon Web Services have been a success? Would their investment have payed off eventually? It is hard to say, but it probably would have costed them more. 

So finding the right idea on which to invest, or develop, is not just about the idea, but about the right time to do so. It is safe to say there are great alternatives for many things today. Buy, or develop them in-house? This is probably the single most difficult call software startups have to make today. An error in this area can make or break a startup or small business.

## Playing It Safe
There's no success without some risk, so identifying areas where your company *can* fail is of the utmost importance. Not only will this way of thinking show you great growth or investment opportunities, but it will also make it very clear which wars are worth fighting. For Amazon, yeah, developing world-class, globally distributed, datacenters was a war worth fighting. They had the vision, the opportunity, the time, and, fundamentally, a war chest big enough to survive failure in case they could not monetize their investment later on.

A different example: take a look at state-of-the-art chip companies. Keeping up with the pace of development and manufacturing requirements for the products that are coming out to the market is so crushingly exhausting, from an economic point of view, that it makes absolutely no sense to invest in manufacturing facilities unless you can keep the facilities at 100% full capacity. This results in interesting scenarios where competitors in the market are associates in manufacturing competing products!

Intel, probably the most advanced CPU manufacturer in the world, is the only CPU company that also owns their own manufacturing facilities (called "fabs" in the semiconductor industry). AMD used to own their own fabs, but it was so difficult to justify the expense of keeping manufacturing in-house, that they had to sell them. ARM, Nvidia and Apple do not own any fabs either.

We can spot a certain trend when it comes to technology companies: it is usually the first-to-market company that can reap most of the benefits of a big investment. This may sound too far removed with regards to startups, but think of it this way: most of the time, a startup is operating so close to running out of money, that, unless that startup is developing a first-to-market product, it is usually not worth investing in keeping that something in-house.

In the old days, every company kept their own mail server. Now you would be crazy to use something other than one of the corporate email providers such as Gmail or Outlook. They do what you could do much better and at a fraction of the cost.

> There are specific cases where a company might decide to invest in keeping a critical piece of infrastructure in-house. For example, a government institution might consider keeping an in-house email server a requirement to avoid denial-of-service attacks in case of conflict with the country that hosts Google or Microsoft's servers. Most of the time, this is not the case, however.

## Why You Should Not Develop Authentication In-House
Authentication is essential to all technology startups. Unfortunately, it is a complex subject. Not only a simple username/password is simply not enough (and inconvenient), but sensitive stuff can be accessed if your authentication system is compromised. In a sense, authentication and authorization are probably one of the most sensitive areas for technology startups. It appears deceivingly simple from the outside, but becomes a thorny subject as you start to learn its intricacies. Is your authentication system secured by two-factor authentication? Is an SMS fallback available? Are your users using passwords which have already been leaked from other sources? Are social logins implemented to bring more users to your platform? Can your system handle hundreds of thousands of users? Are your enterprise accounts supported and linked with your newer services? These are all tough questions for every startup. But with Auth0 things need not be this way.

<a href="">Sign up for a free Auth0</a> account and learn why more and more companies are using an external authentication solution. You can get up and running in a matter of minutes, with support for features such as:

- [A visual dashboard for managing all settings](https://auth0.com/docs/user-profile)
- [Top tier security and availability](https://auth0.com/security)
- [Username/password authentication](https://auth0.com/docs/connections/database)
- [Social logins](https://auth0.com/docs/identityproviders)
- [Enterprise federation](https://auth0.com/docs/identityproviders#enterprise)
- [Passwordless logins](https://auth0.com/passwordless)
- [Multifactor authentication](https://auth0.com/docs/multifactor-authentication)
- [Single-sign-on](https://auth0.com/docs/sso)
- [Breached password detection](https://auth0.com/breached-passwords)
- [Programmable rules](https://auth0.com/docs/rules)
- [Easy integration for mobile and web apps](https://auth0.com/lock)

Let us handle authentication for you so you can truly focus on what matters: delivering your product.

## Other Stuff To Keep In Mind
Unfortunately, budget planning is not all about what you can do in-house or buy from external providers. It also has to do with strategy. Here are some things we have found can make a whole world of difference:

- **Marketing**: we have found marketing is not all about showing your product or letting other people know your product or service exists. It is also about creating an audience. Rather than develop a product and then try to get people to but it, plan a marketing budget that includes elements that are useful to the audience your product caters for. In other words, consider reducing the money spent (or keeping it stable) in promoting a product, and increasing the money spent on building a community around your company.

- **Keep your employees happy**: this might seem obvious, but how many times have we seen a key developer leave early on becase he or she just wasn't happy with their job? Startups must value their top employees. It it the people that fundamentally trust the company and invest more than just their working hours in it that can make or break a product. Startups don't have the time or money to cope with employee turnaround. But don't be naive: keeping employees happy is not all about compensation. Consider keeping a part of the budget dedicated to out-of-office activities that employees can enjoy. Consider buying them equipment that they can take home. Consider running polls and asking them what would improve their mood at the office. Of course, this should never cause compensations to be affected.

- **Use data to make choices**: this can be applied to any department in your organization. Whenever you make a choice, make sure you have some way of collecting quantifiable data that can later be analyzed and turned into cold, hard facts about whether that choice was right. Consider including a dedicated data team for this purposes in the budget. Give them access to as many choices as possible and listen to their results.

- **Create a planning team**: using data has to do with learning about the results of a previous choice. A planning team, on the other hand, tries to analyze things before making a choice. For instance, have a dedicated team come up with budget and time-to-market figures for the development of in-house solutions before committing to doing them. Compare that with the external alternatives. In fact, do this for the authentication aspect of your company, you will be surprised.

## Conclusion
Budget planning is always a tough time for big and small companies. However, startups depend on making the right calls to survive until they can deliver a product. Keeping sharp focus on your product lets you use your resources and time in a much more efficient way. There is no point in developing in-house solutions to solved problems unless forced to do so. Successful companies understand this from the get-go and invest appropriately in the right external services and products. Authentication is, today, one of those services: tough to get right from the ground-up, and with great choices in the market. Invest wisely and reap the benefits. The sky is the limit!
