---
layout: post
title: "2016 Social, Passwordless and SSO Data: What Can We Learn?"
description: "Username and password still dominates, but not for long"
date: 2017-07-31 19:00
category: Growth, Identity
author:
  name: Diego Poza
  url: https://twitter.com/diegopoza
  avatar: https://avatars3.githubusercontent.com/u/604869?v=3&s=200
  mail: diego.poza@auth0.com
design:
  bg_color: "#001D3F"
  image: "https://cdn.auth0.com/blog/passwordless-data-2016/logo.png"
tags:
- passwordless
- auth0
- password
- credentials
- statistics
related:
- 2016-09-09-analysis-of-passwordless-connections
- 2017-05-26-go-beyond-username-password-with-modern-auth
- 2017-03-15-5-reasons-your-company-needs-identity-and-access-management
---

In 2017 we have more options than ever before for strong password management. Between [social](https://auth0.com/docs/extensions/custom-social-extensions#social), [enterprise,](https://auth0.com/docs/extensions/custom-social-extensions#enterprise) and [Passwordless](https://auth0.com/docs/extensions/custom-social-extensions#passwordless) connections, companies that are ready to offer more than username and password have several good options.

This is great news, considering that [59% of consumers](https://www.passwordboss.com/password-habits-survey-part-1/) will admit that they reuse the same password—simply because it's too hard to remember a unique password for every account. In 2017, companies are offering simpler, safer options than just traditional username and password. And we're already seeing a big shift happen.

Throughout 2016 we gathered data on how Auth0's users and our user's users were using Auth0. Let's check in on how things are changing, and what's staying the same.

## What Types of Connections Are On The Rise?

Single Sign On (SSO) and Passwordless have been around for a while, even as traditional username and password (U/P) have been around much longer. In 2015 we launched Auth0 Passwordless, which  removes passwords from the login process completely and instead uses TouchID, or “Magic Links” sent through SMS.

Since 2015 we've seen Passwordless grow at a fairly steady rate of 10,000-20,000 connections [per month](https://auth0.com/blog/analysis-of-passwordless-connections/), though it hasn't yet caught up to social or enterprise login. Social connections have seen a big increase in 2016 and it's easy to see why. Users log into your site with existing login information from a social network provider. It's quick and takes out a lot of friction for the user.

Here's our data for 2016. We can see how U/P, enterprise (authentication through LDAP, Microsoft, Google Apps, and other clients), social, and Passwordless connections stack up:

![Username & Password vs Enterprise vs Social vs Passwordless](https://cdn.auth0.com/blog/2016-social/enterprise-social-passwordless.png)

While traditional username and password logins still dominate at 67% in 2016, we also saw the number of social connections **double** from 2015.

In 2015, Passwordless and social together only amounted to **5%** of our total use. We grouped them together as SSO here:

![Total users](https://cdn.auth0.com/blog/2016-social/total-users.png)

Yet in 2016, **11.10%** of all logins were social connections. This tells us that more and more users are beginning to see social connection as a stronger, more convenient option than U/P.

Companies too are finding U/P [less effective](https://auth0.com/blog/2015/12/16/how-to-use-social-login-to-drive-your-apps-growth/) and less attractive, as offering [social connection](https://auth0.com/blog/analysis-of-social-connection-data/) can increase conversion rates by as much as 50%. With more login options becoming available over the past few years, it can seem daunting to pick the right one and stick with it. Customer-facing apps would do well to include social in the mix.

## Top Used Social Connections

Now that we've seen how social is rapidly becoming more popular with a 2x growth in connections from 2015 to 2016, let's take a closer look at *which* social platforms users are using to log in.

Throughout 2016, we collected data to find out which social connections were being used most often:

![Social connections by popularity](https://cdn.auth0.com/blog/2016-social/social-connections-by-popularity.png)

In 2016 Google was the most popular social connection at **48.7%**, nearly double Facebook's share at **26.6%**. GitHub came in third place at **9%** before Windows Live at **3.6%**.

The biggest shift from our [2015 data](https://auth0.com/blog/analysis-of-social-connection-data/) is that **Twitter** dropped from fourth to seventh place, at **2.6%**.

As in 2015, these distributions are roughly reflected in the estimated monthly site visits of each of these sites, according to data from [Alexa.com](http://alexa.com/), Google's and Facebook's visitor numbers are in the billions, while Windows Live and Twitter are dwarfed in the millions, with [Twitter's use declining](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=9&cad=rja&uact=8&ved=0ahUKEwivlKXtxvzTAhXJqFQKHQ2dCYoQFghSMAg&url=https%3A%2F%2Fhbr.org%2F2016%2F02%2Fthe-reason-twitters-losing-active-users&usg=AFQjCNHTzjPHEveNh03-RjDUqEQ75et4nQ&sig2=_uqjOMNw9-vN9hh94-l6Fg).

So, social connection is clearly growing in popularity, and as these numbers suggest, Google and Facebook are still driving a lot of that growth. Yet dark horse **GitHub** climbed up to third place for social login in 2016. A full 9% of social connections through Auth0 came through Github, a developer-focused site that barely has a fraction Google's user numbers.

If you want to personalize your site's experience with social connection, go deeper than Google and Facebook and think about what smaller platforms your users are on. If your users are all developers who are on GitHub everyday, take note of that. If your users are in sales and marketing, have them log in through Salesforce. If they tend towards editorial and publishing, have them go through WordPress.

## When Will Single Sign On Surpass Username & Password?

In 2015, using the data we collected, we projected growth estimates for Passwordless implementation in relation to traditional U/P. We predicted that Passwordless would overtake U/P in mid-2027:

![Forecast username & password vs Passwordless](https://cdn.auth0.com/blog/2016-social/forecast-up-vs-passwordless.png)

Using our data from 2016, we ran the same growth estimates for Passwordless implementation against U&P and came up with an even more surprising outcome.

At this point we can see that Passwordless is projected to overtake U/P in mid 2020:

### Editorial Note: Insert graph here. We didn't have the REQUISITE data to mock up this one ourselves.

When looking at our first chart in this post, Passwordless seems like a small player. Among Auth0 users and our users' users, 67% of logins are still U/P.

But once we take into account the growing share of social connections, and how different platforms are positioning themselves within the social login space, we can see big shifts happening. And they're happening faster than we thought a year ago.

With so many other options available for authentication, including social, enterprise, and Passwordless, the number of people using U/P is likely to decrease significantly. As more users begin to understand U/P as the most inconvenient and least secure option, we could very well see its share drop below 50% in 2020. It's already down to 67%.

## Looking to 2017 and Beyond

From 2015 to 2016 we saw the dominance of U/P slip even further. It still makes up about 67% of our users' logins, but that's changing fast. With social connections jumping up 2x and some interesting changes within that group, we could see SSO overtake U/P much faster than we're expecting right now.

In running this analysis of our 2016 data we found 16,972 logins with breached passwords being entered every month, on average. In April of this year, 4.42% of logins were with leaked credentials. On average, we added 40 million new leaked credentials to our database in 2016.

These numbers may seem startling, but they also illustrate why companies are moving away from U/P so rapidly. Safer, simpler options are available and the industry is having a lot of success nudging users towards social, enterprise, and finally Passwordless options like TouchID and Magic Links.
