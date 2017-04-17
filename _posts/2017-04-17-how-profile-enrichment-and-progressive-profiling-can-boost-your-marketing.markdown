---
layout: post
title: "How Profile Enrichment and Progressive Profiling Can Boost Your Marketing"
description: "Learn how to use Auth0's Social Login and upcoming Progressive Profiling Plugin to target customers more effectively"
date: 2017-04-17 09:38
category: Growth, Analytics
is_non-tech: true
author:
  name: Federico Molina
  url: https://twitter.com/federicomolina
  mail: federico.molina@auth0.com
  avatar: https://cdn.auth0.com/blog/profiles/fedemolina.png
design:
  bg_color: "#2A5383"
  image: https://cdn.auth0.com/blog/profile-enrichment/logo.png
  tags:
  - profile-enrichment
  - social-login
  - growth-hacking
  related:
  - 2016-07-08-why-your-project-estimations-are-always-wrong
  - 2016-07-05-growth-hacking-is-dead-long-live-growth-hacking
  - 2016-08-19-why-you-should-ab-test-everything
---

Good marketing hinges on communicating the usefulness of your product. That means knowing who your customers are and how they'll use your product.

But you can't tell your customers apart if they are all just a name attached to an email address. You have no idea what they need from your product, where they work, or who they are. If your company hosts videos for businesses, HR will use the product differently than developers. So why would you market to them the same way?

Profile enrichment and progressive profiling are two ways you can build a robust view of your customers to differentiate them. This will allow you to boost your marketing and sales techniques by appealing to who your customers are, and how they want to use your product.

## Progressive profiling

[Progressive profiling](https://auth0.com/blog/progressive-profiling/) is a great technique for getting more information from your customers. Instead of asking your users a million questions when they sign up, you ask them a few questions each time they log in.

Think of it as making a little small talk with them every so often when they log on, rather than asking for a three-hour long conversation the first time you meet. So, when you ask questions progressively, you can get needed information without adding a lot of friction to your sign-up process (consider that [86%](http://www.sampleforms.org/wp-content/uploads/2012/12/How-to-optimize-registration-forms.jpg) of customers say that they will leave a website if the signup form is too long!).

For example, the first time someone logs in, you might ask for:

* Their name
* Their email address
* Their password

At second login, or at purchase, you might ask for:

* Their address
* Their birthday
* Their phone number

At third login, follow up by asking for:

* Their company
* How many people work for them
* Their industry

When you set up your progressive profiling in [Auth0](https://auth0.com/docs/user-profile/progressive-profiling#implementing-progressive-profiling-with-auth0) it's completely customizable, so you can put in any questions in any order you want.

While progressive profiling is certainly a useful tool, you aren't going to get to ask users every single thing you want to know, no matter how many logins you spread it out over. When you want demographic data, that's when you turn to the raw power of profile enrichment.

## Profile enrichment

There is a lot of information out there about your users that your sales and marketing teams are probably itching to get their hands on. But just as you can't ask someone for all of it, nobody in your company is going to sit down and manually look up pieces of information to add to every profile, either. It's simply not possible.

That's where profile enrichment comes in.

Profile enrichment is when you automatically grab publicly available information and add it to a user's profile. You do this by using 3rd-party data APIs, such as Clearbit or FullContact, and integrate them in your application by using Auth0 Rules. Rules are snippets of code that run at signup or login.

For enrichment, your Rule would trigger an API that grabs the data for you, and then deposit that information into the profile that every user gets when they sign up through Auth0.

![User profile on Auth0](https://cdn.auth0.com/blog/auth0-profile-enrichment/user-profile.png)

Let's say you wanted to use Clearbit to enrich the profiles of your users. [Clearbit](https://clearbit.com/) provides business-centered data APIs, and can give you personal information about your customers. They add 85 unique data points to a customer's profile, including where a person works, how many people are in their company, and their social media accounts.

![Clearbit Business Intelligence](https://cdn.auth0.com/blog/auth0-profile-enrichment/clearbit-bi.png)

So, you would use [Auth0 Rules](https://auth0.com/docs/rules) to query your customers through Clearbit's API and add the information to your user profile. This Rule, and many others, are written and ready to be added to your system in minutes.

Now you know how many employees their company has, where they're located, what their job title is — all without forcing users to fill out a sign up form.

## Marketing with your enriched profiles

Keeping more information on your users turns them from a single datapoint into an actual human that you can connect with as more than just a generic customer. Your marketing and sales teams have plenty of options as to what to do with all the information that transforms users into people.

* **Personalize your emails.** From birthday offers to targeted onboarding, sending something other than another sales-y email will pay off. According to MailChimp, segmented email campaigns see about a [15% higher open rate](http://mailchimp.com/resources/research/effects-of-list-segmentation-on-email-marketing-stats/) across the board when compared to non-segmented email campaigns. So whether you're sending tips specifically to customer success reps or alerting your enterprise liaisons to new features in their plan, using segmented campaigns will help you reach customers.
* **Boost your conversions.** Let's say someone signed up for your free trial. Of course, you grabbed their email, worked your API magic, and came back with information on their company and position there. Now that you know they work for a mid-sized PR company, you can help your marketing and sales people connect with that user to help them realize the value of your product in the PR space. If they connect with questions, you can point them right to the things that matter most to PR people.
* **Customize your marketing campaigns.** When you have demographic data on users, you can translate that to better marketing campaigns. Maybe you find that 25% of users are startups with fewer than 30 people, or that the majority of your enterprise customers generate reports on a weekly basis. Or maybe you find that teen boys in cities use your app more than any other group. Any of these pieces of information can help you shape marketing campaigns that speak directly to the interests of those groups.

## Conclusion

To market effectively, you need to understand both your product and your customers. Understanding your product is the easy part — you spend every day with it. But getting to know your customers is a unique challenge.

Yes, you can do focus groups and send out surveys, but neither of those will reach every single customer. When you institute progressive profiling and profile enrichment, you're guaranteed a window into every customer's identity. From there, it's a matter of putting that information to use so you can knock your marketing out of the park.
