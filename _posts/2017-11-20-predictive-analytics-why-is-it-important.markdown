---
layout: post
title: "Predictive Analytics: Why Is It Important?"
description: "Explore how staying a step ahead of your customers can revolutionize your company."
date: 2017-11-20 08:30
category: Growth, Data
is_non-tech: true   
author:
  name: Diego Poza
  url: https://twitter.com/diegopoza
  avatar: https://avatars3.githubusercontent.com/u/604869?v=3&s=200
  mail: diego.poza@auth0.com
design:
  bg_color: "#526C33"
  image: https://cdn.auth0.com/blog/predictive-analytics/predictive-analytics-main.png
tags:
- analytics
- predictive-analytics
- data
- data-science
- machine-learning
- user-behavior
- customer-behavior
- progressive-profiling
---

**TL;DR:**  Predictive analytics is the term used to describe using data to make highly informed guesses about future outcomes.  In this article, we will explore the technique and see the benefits.


During the 2010 FIFA World Cup, soccer fans around the world were absolutely captivated — by a German octopus. Paul, as he became known, correctly [predicted](https://en.wikipedia.org/wiki/Paul_the_Octopus) the outcomes of all the games that the German national team played in *and* correctly predicted Spain would win the entire tournament. 

He was heralded as a soothsayer, an oracle, a being somehow able to see into the future. The Spanish Prime Minister even offered him state protection! 

But Paul was just an octopus picking flags on a whim. It was just luck — nobody can predict the future, right?

![Paul the Octopus](https://cdn.auth0.com/blog/predictive-analysis/paul-the-octopus.jpg)

Well, an octopus probably can't, even if Paul gave it one heck of a run. But the odds that your business could might be higher than you think. That's in large part due to the huge amount of data that businesses are now privy to, and the tools we have available to analyze it. 

These ideas are encompassed by the term *predictive analytics*, and it's what we'll talk about today. How do they work? What types of prediction can your business expect? And how do you get the right data to make good predictions? While Paul may keep his mystical secrets, the answers to all these questions are yours for the taking.

## What is predictive analytics?

Simply put, predictive analytics is using data to make highly informed guesses about future outcomes. For businesses, the most common application of this is in [user behavior](https://amplitude.com/blog/2016/06/14/10-steps-behavioral-analytics/). By observing what past users have done, you should be able to better understand what future users will do. Businesses use this to shape users' paths to increase predictability. 

For example, Tesco, a UK grocer, [used](https://hbr.org/2011/12/know-what-your-customers-want-before-they-do) user behavior data to see what their rewards program members were buying together. They noticed that “Clubcard shoppers who buy diapers for the first time at a Tesco store are mailed coupons not only for baby wipes and toys but also for beer.” Why? “Data analysis revealed that new fathers tend to buy more beer because they are spending less time at the pub.”

This is a clean example, and to get to a place where your business can boast good predictive modeling requires a couple of things that are implicit in the mascara/eyeliner scenario:

- **Good data collection** from all parts of your business at all times.
- **Deep understanding of customer behavior** that is based in data and not gut feeling or supposition
- **Predictive analytics tools** that makes your data workable and tracks your experiments

This forms the groundwork of success with predictive analytics. There's no reason why any company can't start utilizing their data in order to make predictive analytics work for them, and most companies will have some — if not all — of these systems set up already. 

But whether you're all set up or just starting out, you probably aren't fulfilling your predictive analytic potential. For example, how are you using your identity management (IAM) to help with predictive modeling? Are you using it at all? If you really want to get serious about your predictive capability, then you can't overlook it as a powerful avenue for predictive analytics. 


## How does IAM contribute to predictive analytics?

There are a number of ways that IAM can contribute to predictive analytics, but one of the biggest and most underutilized is gathering information with your identity management system. Login can give you a window into who your users are, what they're doing, when they're doing it and how often. 

Some of the data that your IAM can collect is:

* Location
* Device type
* IP Address
* Number of logins
* Timestamp of logins

These are all important factors when figuring out user behavior, especially number of logins, behavioral data which shows how engaged a user is with you. 

But that's not all that an IAM can help you learn. Beyond the obvious, an IAM can help you gather information by:

- **Gathering social data** by requesting access to all of the preferences and information stored in a user's social platform of choice if they're using social login.
- **Customizing profiles** by automating questions to be asked at login. When done properly, [progressive profiling](https://auth0.com/blog/how-profile-enrichment-and-progressive-profiling-can-boost-your-marketing/) can give you the data *you *want about your customers without inconveniencing them or invading their privacy. 
- **Enabling demographic research** by running your users through 3rd-party data APIs to get more information about them. With Auth0, you can automate this process by integrating APIs into profile creation with [Rules](https://auth0.com/docs/rules/current), automated functions that trigger at login. If you want more data about, say, the professions, company sizes and professional roles of your users, for example, you could use Auth0 Rules to automatically run users' emails through [Clearbit](https://clearbit.com/), an API that pulls professional information. 

All of these types of data can be directly funneled into predictive models. Remember that one of the key components to creating predictive analytics for your company is *good data collection* and another is a *deep and unbiased understanding of your users*. If you aren't utilizing your IAM to help you get both of these things, you're missing a huge opportunity and setting yourself back in the process. 


## Easy ways to use predictive analytics

The potential of predictive analytics is huge, but it's a complex field that can be intimidating to unravel. Here are some of the easier ways to use predictive analytics — but keep in mind that even the simplest application will still require that rigorous back-end work to be successful. 

### Marketing

Our Tesco example was a hint at this, but one of the most predominant ways to utilize predictive analytics is marketing. This helps you tailor your marketing efforts to better sell to specific customers by looking at past data on what similar customers have bought or done. 

A great example of tailoring your marketing efforts based on data is Geckoboard's [system](https://clearbit.com/books/data-driven-sales/inbound-lead-qualification) for qualifying leads. They realized that their template for their “ideal customer” was leaving out the majority of the leads they were generating, leaving marketing with a soup of people to manually sort through. 

They decided to enrich their data to get a more complete view of their users, and use new information about the types of leads they were pulling in to autoscore leads with a more complex system:

![Point Based Lead Scoring](https://cdn.auth0.com/blog/predictive-analysis/advanced-point-based-lead-scoring@1x.png)

This system was developed based on a combination of user behavior and good data that they automated into their system through the Clearbit API. 

These tactics are obviously not limited to discounts or leads — they could be different email copy, coupons, or ads that speak to the likely purchases, desires and vulnerabilities of a given consumer. 

### Sales revenue

Predictive analytics can lead to better sales projections because you are making a more concerted effort to collect data on customers and use it to predict outcomes. 

Take [Microsoft](https://www.microsoft.com/itshowcase/Article/Content/770/Predictive-analytics-improves-the-accuracy-of-forecasted-sales-revenue) — the company recently revealed that they've ramped up predictive analytics in their sales department in a big way. By integrating predictive analysis into their sales process, they're getting more accurate sales predictions from top down. Here's what they say about how individual reps are helped by predictive analytics: 


> “[Our most recent] model uses machine-learning algorithms and opportunity-scoring data for near real-time win/loss predictions of a sale. It helps sellers prioritize by showing whether an opportunity is hot, warm, or cold, and advises them about actions to take.”

### IAM security

{% include tweet_quote.html quote_text="When you have a good IAM in place, you can use predictive analytics to help keep you and your users more secure." %}

One of the best examples of this is anomaly detection, a security measure that flags unusual behaviors to keep users safe. For example, Auth0 offers [brute force protection](https://auth0.com/docs/anomaly-detection), which allows you to trigger security measures if someone makes too many attempts on a login. 

This type of security relies on regular user behavior — like not trying to sign in to their account 20 times in a row — and uses it to help keep users safe. You've probably been the beneficiary of protection based on your behavior without even realizing it. An email that says, “we got a login from a new computer or location — is this you?” is another type of identity protection that relies on predicting user behaviors. 

![Dropbox Signin Warning](https://cdn.auth0.com/blog/predictive-analysis/dropbox-signin-warning.png)

*A security email from Dropbox notes what location, time, web browser and computer are used in a login attempt that doesn't match a users' predicted (i.e. previous) behavior.*

With an IAM system like Auth0, turning on security features like brute force protection is as simple as choosing a couple of preset options, and should be a no-brainer to incorporate this type of predictive analytics technology into your business. 


## Keep looking into the crystal ball

{% include tweet_quote.html quote_text="When you start to see the power of what your data can do, you'll want to dive in with both feet." %}

Predictive analytics isn't a short-haul adventure. And when you start to see the power of what your data can do, you'll want to dive in with both feet. 

Yes, it takes time to collect good data, devise a pipeline for sorting through it, and find your correct predictive variables. That fact is probably not going to change anytime soon. You can make an easy start by getting your current software tools — like your IAM — to work for you.
