---
layout: post
title: "How to Become a Data-Driven Marketer"
description: "Learn about a data-informed marketing approach with buyer personas and lead generation."
date: 2017-03-20 8:30
category: Growth
banner:
  text: "Auth0 makes it easy to add authentication to your application."
author:
  name: Martin Gontovnikas
  url: http://twitter.com/mgonto
  mail: gonto@auth0.com
  avatar: https://www.gravatar.com/avatar/df6c864847fba9687d962cb80b482764??s=60
design:
  image: https://cdn.auth0.com/blog/data-driven/logo.png
  bg_color: "#593C62"
tags:
- analytics
- marketing
- data
related:
- date-post-name
- date-post-name
---

**TL;DR:** Data is a powerful marketing tool, but there's more to it than you think. Learn about how your marketing approach should use data in combination with buyer personas and lead generation.

---

Living in the digital age means customers can be more selective about the brands they interact with. This is great for shoppers, but poses a challenge for marketers: how do you stand out in such a noisy marketplace? 

The best companies stand out by using the personal data customers provide to make better marketing decisions. When you [use the data you get from customers](https://blog.fullstory.com/what-incentives-are-your-support-metrics-creating-4a633d449f0e#.sy379oznp), you can understand them and cater to them to get the results you want.

Let's take a closer look at how data can help marketers build more meaningful relationships with customers and make campaigns more impactful.

## Build Better Buyer Personas Through Analysis

Instead of looking at potential customers as an undefined group of people, use your data to create buyer personas. As a means to attract your ideal customers, buyer personas identify the specific characteristics that these customers have.

This creates a framework that you can use to understand what different groups of customers need from you. Buyer personas help you create targeted campaigns that resonate with consumers and are more meaningful.

Each persona should have its own set of characteristics. Start by asking yourself questions like: 

* How old are they?
* What gender are they?
* What kind of job do they have? 
* What's their title? 
* What industry do they work in?

One way to segment your users based on these characteristics is to use a tool that analyzes your social media followers. [Facebook's Audience Insights](https://adespresso.com/academy/blog/how-to-use-facebooks-audience-insights-to-create-buyer-personas/) tool offers a treasure trove of information that you can dig into. You can group users together and get to know them better. Take the folks that follow you and plug their data into an [analytics tool](https://amplitude.com/mobile-analytics) to find out how your customers find you, what they access on your site, or even their social media profiles. 

![Facebook Audience Insights - data-driven marketing](https://cdn.auth0.com/blog/data-driven/facebook-audience.png)
[Source](http://www.adweek.com/digital/audience-insights/)

Another way to create buyer personas is by gradually collecting data with a tool like [Clearbit](https://clearbit.com). Clearbit offers an Enrichment API that lets companies collect data on users and track them over time. By simply entering an email address or website, companies can access personal and business information for their target audience like:

* Social media profiles
* Where users work and company size
* Company type or industry
* Location

![Clearbit bio data driven marketing](https://cdn.auth0.com/blog/data-driven/bio.png)
[Source](http://blog.clearbit.com/5-ways-to-use-clearbits-enrichment-api/)

Clearbit then lets you segment customers based on the characteristics you're interested in (location, industry, social media preferences). From there you can build targeted campaigns. If you want to focus on developers in New York City who work for companies with more than 100 employees, now you have the data to do that.

Keep in mind that your buyer personas will evolve over time. As their characteristics shift, change your campaigns accordingly.

## Compare Lead Generation From Different Sources

Lead generation plays an essential role in marketing and attracting the right customers. If you're not actively pursuing it, you're ignoring a crucial piece needed to grow your business.  You likely won't see the returns you expect from your [growth strategies](https://amplitude.com/mobile-analytics) if they aren't seen by the folks they're designed for.

More and more of our transactions, both financial and social, take place in the digital world. You probably interact with your customers online, whether it's on Twitter or via comments on your blog.

But to turn casual interaction into lead generation, you have to be clear about who your ideal customers are and what channels work best for reaching out to them. If you've developed the latest wearable gadget for millennials, it probably doesn't make sense to use direct mail to get their attention. A few well-timed tweets are more likely to pique their interest.

One way to know what approach attracts people to your site is to track specific events. Whether it's newsletter subscriptions or signups to access an online tool, you can add a snippet of code to your site to track which events get the most leads. A tool like [Keen.io](https://keen.io/) helps you [see where leads are coming from](https://auth0.com/rules/send-events-keenio) once you've added their snippet.

```js
function(user, context, callback) {
  if (context.stats.loginsCount > 1) {
    return callback(null, user, context);
  }

  var MY_SLACK_WEBHOOK_URL = 'YOUR SLACK WEBHOOK URL';
  var slack = require('slack-notify')(MY_SLACK_WEBHOOK_URL);

  var writeKey = 'YOUR KEEN IO WRITE KEY';
  var projectId = 'YOUR KEEN IO PROJECT ID';
  var eventCollection = 'signups';

  var keenEvent = {
    userId: user.user_id,
    name: user.name,
    ip: context.request.ip //Potentially any other properties in the user profile/context
  };

  request.post({
    method: 'POST',
    url: 'https://api.keen.io/3.0/projects/' + projectId + '/events/' + eventCollection + '?api_key=' + writeKey,
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(keenEvent),
  },
  function (error, response, body) {

    if( error || (response && response.statusCode !== 200) ) {
      slack.alert({
        channel: '#some_channel',
        text: 'KEEN API ERROR',
        fields: {
          error: error ? error.toString() : (response ? response.statusCode + ' ' + body : '')
        }
      });
    }
  });

  callback(null, user, context);
}
```

Another way to compare lead generation is to focus on what generation methods work best for which channels. [Wistia](https://wistia.com/) targets companies who need video hosting services and want to use analytics in their marketing strategies. To attract these customers, Wistia uses inbound channels like their website, blog, and social media.

Within each channel, they've identified specific sources that help them generate lots of leads. For example, on their website, they provide resource downloads, webinars, and free product trials to attract them and turn browsers into leads. All require basic information like an email address.

![Lead generation, lead nurturing, lead scoring - data-driven marketing](https://cdn.auth0.com/blog/data-driven/leads.png)
[Source](https://wistia.com/library/video-and-marketing-automation)

They can take stock of what works best and focus on it. They have a massive video library and use it to maximize their marketing tactics. Marketing helps the sales teams by sending real-time alerts when specific videos are viewed. 

## Be Data-Informed, Not Data-Driven

Andrew Chen, part of Uber's growth team, put it best when [he said](http://andrewchen.co/know-the-difference-between-data-informed-and-versus-data-driven/), “Don’t let shallow analysis of data that happens to be cheap, easy and fast to collect, nudge you off-course in your entrepreneurial pursuits.”

Simply put, data tells you a story at a point in time, but this can be limiting when trying to figure out the future. A data-informed company uses data as one tool in their toolkit to develop forward looking strategies.

Data will tell you how many people buy your products in a given month or how many people opened your newsletter. What it won't tell you, at least not easily, is what type of social or economical impact your product had on these people. It won't tell you how it's improved their lives.

![data-driven, data-informed](https://cdn.auth0.com/blog/data-driven/data.png)
[Source](https://wistia.com/blog/data-informed-marketing)

Companies like Wistia include past experiences, intuition, judgement, and qualitative input to make decisions. Data _with_ a holistic approach captures analysis that would have been lost if based solely on data.

Data alone can be helpful, but the combination of these elements will help you build strategies that are more focused and better received by audiences.

## A Fresh Look at Data and Marketing

Once you've painted a clear picture of who you're marketing to and segmented them, your campaigns will be more targeted and meaningful. Your efforts will be in line with your goals because of your focused approach to connecting with customers.

While data is the engine that powers your company, your marketing approach should use data in combination with buyer personas and lead generation to get you to where you want to be.

Keep monitoring your data and continue iterating on what you've learned from your previous marketing strategies to keep your efforts running smoothly day in and day out. 
