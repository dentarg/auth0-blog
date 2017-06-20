---
layout: post
title: "Massive Data Leak Exposes 198 Million US Voters"
description: "Sensitive personal information of 198 million Americans citizens, with potential political inclinations, was exposed by a data analysis firm."
date: 2017-06-20 10:00
category: Hot Topics, Security, Breaches
author:
  name: "Bruno Krebs"
  url: "https://twitter.com/brunoskrebs"
  mail: "bruno.krebs@auth0.com"
  avatar: "https://www.gravatar.com/avatar/76ea40cbf67675babe924eecf167b9b8?s=60"
design:
  bg_color: "#191716"
  image: https://cdn.auth0.com/blog/this-the-season-for-cyber-criminals/logo.png
tags:
- security
- data-breaches
- election
related:
- 2016-11-25-navy-data-leaked
- 2016-09-22-yahoo-confirms-data-breach-of-half-a-billion-user-accounts
---

On June 19, 2017, a cybersecurity company called [UpGuard](https://www.upguard.com) reported that a huge amount of data about Americans citizens and their political inclinations was publicly available on an AWS S3 bucket. More precisely, personal information of over 198 million American voters was left exposed to the internet. The leak revealed sensitive personal information like voter's date of birth, mailing addresses, phone numbers, political inclinations, voter registration status, and so on.

## The Data Leak

One week before announcing the leak, a Cyber Risk Analyst of UpGuard found out that a AWS S3 bucket (a cloud storage) was misconfigured. This misconfiguration enabled anyone with an internet connection to gain access to the data simply by navigating to a six-character Amazon subdomain called "dra-dw". The cloud storage bucket and its contents were owned by [Deep Root Analytics](https://www.deeprootanalytics.com/), a data firm that identifies audiences for political ads, and were created to feed the Republican National Committee in their efforts to elect Donald Trump.

The data included 1.1 terabytes of unsecured personal information compiled by Deep Root Analytics and two other contractors: TargetPoint Consulting, Inc. and Data Trust. In total, the personal information of potentially all of America's 200 million registered voters was exposed, including names, dates of birth, home addresses, phone numbers, and voter registration details.

{% include tweet_quote.html quote_text="1.1 terabytes of U.S. citizens leaked by an analytics contractor." %}

## The Nature of the Data

Two critical directories entitled *data_trust* and *target_point* were found in the cloud storage. The first folder, *data_trust*, contained data gathered on an effort to host a comprehensive and detailed information about potential 2016 voters. This data was organized on two file repositories: one for the 2008 presidential election; and the other one for 2012. Each of these repositories contained a file for every state in the U.S, formatted as a comma separated value (CSV), and uniquely identified every potential voter in the database.

Chris Vickery, the researcher that discovered the leak, and Dan O'Sullivan, the reporter that wrote the [data leak announcement](https://www.upguard.com/breaches/the-rnc-files), looked up in the spreadsheets (CSV are usually read as spreadsheet) found and confirmed that the files contained accurate and sensitive personal information. They have identified one hundred and forty seven different categories of data in these spreadsheets, with columns like: "State", "Town", "MT10_ObamaDisapproval", "SD_NextElection", "SDProper_NextElection", "NamePrefix", "FirstName", "MiddleName", "LastName", "Sex", etc.

The second directory, *target_point*, contained information about voters' likely positions on 48 different political subjects. Ranging from how likely it is the individual voted for Obama in 2012, to whether they agree with the Trump foreign policy of "[America First](https://www.whitehouse.gov/america-first-foreign-policy)", to how likely they are to be concerned with auto manufacturing as an issue, among others.

The reporter responsible for the official announcement was able, after determining his identifier in the spreadsheets, to view his modeled policy preferences and political actions as calculated by the contractors. He stated, to his surprise, that the results forecasted by the companies were pretty accurate. Therefore, what we can see here is that a reckless action taken by Deep Root Analytics, ignoring the most basic security measures, exposed a very detailed and precise dossier about virtually all potential voters in America.

{% include tweet_quote.html quote_text="Virtually all potential voters in America had their personal data leaked." %}

To take a deeper look in the security breach details, [check the official announcement made by UpGuard](https://www.upguard.com/breaches/the-rnc-files).

## Aside: How Auth0 Helps to Protect Your Data

At Auth0 security is of the utmost importance. Our authentication and authorization services let you set up multiple policies that greatly improves the security of your web and native applications. Some features that customers can benefit from are:

- [Multifactor Authentication](https://auth0.com/docs/multifactor-authentication?utm_source=blog&utm_medium=sc&utm_campaign=navy_leak),
- [Automatic Breached Password Detection](https://auth0.com/docs/anomaly-detection?utm_source=blog&utm_medium=sc&utm_campaign=navy_leak#breached-password-detection),
- [Custom Rules](https://auth0.com/docs/rules?utm_source=blog&utm_medium=sc&utm_campaign=navy_leak),
- [Passwordless Authentication](https://auth0.com/passwordless/?utm_source=blog&utm_medium=sc&utm_campaign=navy_leak),
- and [Per-Client On-Site Installations](https://auth0.com/docs/overview/deployment-models)

To check how we protect the most sensitive data of our customers and their users, visit our [Security & Privacy webpage](https://auth0.com/security). There you are going to find an overview about our security approach, and a list of certifications and compliance capabilities. You will also find a link to our *Information Security White Paper* with a detailed explanation about our security measures, practices, and certifications.

<a href="javascript:signup()">Sign up today</a> and try a free account to get a taste of how easy these features can be set up on application of any size.

## Conclusion

Security has always been hard and it will become even harder as companies continue to migrate to cloud solutions. One of the ways to approach security is by [keeping multiple layers that complement each other](https://auth0.com/blog/navy-data-leaked/). But, when it comes to sensitive data, like personal information, it is better to rely on companies where employees are fully focused on improving data security, at rest and in motion, like Auth0.

While one can (and must) invest time on, at least, basic security checks and configuration, they will never be able to achieve the same level of security of companies that are specialized on handling sensitive data. [That's why sometimes it is better to buy external solutions, from reliable companies, than building your own](https://auth0.com/blog/when-to-build-and-when-to-buy/).
