---
layout: post
title: "How To Build Your User Analytics Funnel With Social Login"
description: "How to collect, send and analyze your user data for growth"
date: 2017-01-25 14:37
category: Growth, Identity, Analytics
is_non-tech: true
author:
  name: Diego Poza
  url: https://twitter.com/diegopoza
  avatar: https://avatars3.githubusercontent.com/u/604869?v=3&s=200
  mail: diego.poza@auth0.com
design:
  bg_color: "#00479A"
  image: https://cdn.auth0.com/blog/user-analytics-funnel-social-login/post-logo.png
tags:
- marketing
- social-login
- growth-hacks
- auth0
related:
- 7-ways-to-2x-your-revenue-growth-by-putting-your-user-data-to-work
- how-to-use-social-login-to-drive-your-apps-growth
- supercharge-your-registration-process
---

## Intro

Companies that want to make data-driven decisions know they need to learn as much about their users as they can.

But great companies know that the best way to get that data is not by asking — it's by building a funnel to collect what's already out there quickly and efficiently.

That's why social login is one of the most powerful analytics tools. With the option to log into your app using a social media account they've already set up, users save themselves the annoying step of creating a new username & password combination. And you save them the effort of telling you who they are.

> Auth0 can help B2C companies to enrich the profile of their customers through an easy to use [Modern Customer Identity Management solution](https://auth0.com/b2c-customer-identity-management).

With a few simple tools and pieces of code, you can use the information they've made publicly available to make better decisions about your marketing, product development, and user retention.

Let's go step-by-step through what you need to start using your user data better, from signup and login to analysis.

## 1. Set up social login

The first thing you have to decide is what kinds of social media platforms you want to support with your social login.

![Auth0 social login providers](https://cdn.auth0.com/blog/social-login-stats/enabling-social-connections.png)

Auth0 [can automatically reconcile](https://auth0.com/learn/social-login/) the different headers and response formats of different social APIs, so as the developer you don't need to think about which you (technically) can and can't enable.

What you should think about are the kinds of social profiles that *your* users want to use.

Both in terms of popularity and data accessibility, both Facebook and Google are sure bets. The two of them together represent [more than 3/4](https://auth0.com/blog/analysis-of-social-connection-data/) of all social logins on the web. If you're working on a fundamentally social app — messaging, communication, entertainment — it would be hard to avoid putting them on your site.

![Social connections share per provider](https://cdn.auth0.com/blog/social-login-stats/social-connections-usage.png)

But if you're working on anything specialized — from developer tools, to marketing & sales, to file-sharing — there are going to be other, better options for getting the best kind of user data.

Imagine pulling info on all of a dev's repositories and commits from their Github or Bitbucket profile, or automatically integrating all of a user's Dropbox uploads into your teamwork collaboration tool.

Imagine pulling your new signup's social graph so you can show them all their friends using your platform, or immediately give them content that they can start interacting with.

The social logins you support shouldn't just make it easier for people to login — they should integrate with platforms that will help you build a better user experience.

## 2. Set up rules

The kind of information you collect is going to vary depending on how you want to use the data and the platforms you're collecting it from, but you'll collect it in the same way regardless.

Let's say your users are signing up with your Twitter social login option and you want to collect what country is the user in. All collection in Auth0 is done through [Rules](https://auth0.com/docs/rules) — snippets of Javascript executed on the backend every time a user is authenticated.

![Auth0 rules](https://cdn.auth0.com/blog/integrate-your-saas-tools/rules-diagram.png)

If you wanted to collect the current country from all users logging in through Twitter, you'd set up the [add country to the user profile Auth0's Rule](https://github.com/auth0/rules/blob/master/rules/add-country.md) and then use this line of code to get the country:

```javascript
var country = user.country;
```

Using Auth0's [Segment Rule](https://github.com/auth0/rules/blob/master/rules/send-events-segmentio.md), you could then send that data to [Segment](https://segment.com/) and then to the email marketing tool of your choice:

```javascript
function(user, context, callback) {

  if(user.signedUp){
    sendEvent('login');
  } else {
    sendEvent('signup');
  }

  function sendEvent(e)
  {
    var sioTrack =
    {
      secret: "YOUR SEGMENTIO SECRET",
      userId: user.user_id,
      event: e,
      properties: {
        application: context.clientName,
        ip: context.ip,
        agent: context.userAgent
      },
      context: {
        "providers" : { "all": false }
      }
    };

    request({
      method: 'POST',
      url: '  https://api.segment.io/v1/track',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(sioTrack),
    },
    function (err, response, body) {
      if(err) return callback(err, user, context);
      if(e === 'signup'){ user.persistent.signedUp = true; }
      callback(null, user, context);
    });
  }
}
```

You could use additional rules to collect each user's [estimated median income](https://github.com/auth0/rules/blob/master/rules/add-income.md) (based on their IP address's zip code), link accounts with the [same email address](https://github.com/auth0/rules/blob/master/rules/link-users-by-email.md), and more.

## 3. Analyze and use your data

Auth0, as a clearing house for all user authentication in your app, can operate as a single source of truth for user data. When data is being drawn from discrete user identities, with Rules being executed on the backend, there's no risk of errant tags or false positives.

That makes Auth0 particularly suited for analysis that demands a high level of precision. Imagine you want to [segment all your users](https://auth0.com/learn/customer-loyalty-program/) by age, income, gender, region, interests, and marital status in order to analyze who should receive a pre-launch email announcing a new coupon code.

With social login, enriching your user profiles with that kind of data is painless. And there are endless applications for this kind of enrichment:

* **Personalized onboarding**: If everyone from product managers to marketers is using your SaaS product, use role attribution to send people to onboarding flows designed for their specific needs.
* **Retention analysis**: Segment your user base by activity and look at what kinds of users tend to stick around the longest, who takes the most advantage of your app, and who you should be trying to re-engage.
* **Building customer personas**: Grouping your customers into representative personas is a powerful way to focus your marketing and product development efforts. But you don't need to do it all by intuition when you can use analytics to build quantitative models of who your users are, where they come from, and what they do.

Auth0 users can use our pre-built Rules to send user information to a variety of applications. Besides that, we have recently released a product called [Auth0 Extend](https://auth0.com/extend/). This product enable companies to provide to their customers an easy to use extension point that accepts JavaScript code. With [Auth0 Extend](https://auth0.com/extend/), customers can create custom business rules, scheduled jobs, or connect to the ecosystem by integrating with other SaaS systems, like Marketo, Salesforce, and Concur. All using plain JavaScript and NPM modules.

### Slack

![Slack logo](https://cdn.auth0.com/blog/user-analytics-funnel-social-login/slacklogo.png)

[Slack](http://slack.com/) is more than a communication tool. With the right integrations, it can become more like a hub for all your critical business activities.

You can notify all users of a Slack channel of your choice with our [Slack Rule](https://github.com/auth0/rules/blob/master/rules/slack.md):

```javascript
function(user, context, callback) {
  // short-circuit if the user signed up alreadyif (context.stats.loginsCount > 1) return callback(null, user, context);

  // get your slack's hook url from: https://slack.com/services/10525858050var SLACK_HOOK = 'YOUR SLACK HOOK URL';

  var slack = require('slack-notify')(SLACK_HOOK);
  var message = 'New User: ' + (user.name || user.email) + ' (' + user.email + ')';
  var channel = '#some_channel';

  slack.success({
   text: message,
   channel: channel
  });

  // don’t wait for the Slack API call to finish, return right away (the request will continue on the sandbox)`callback(null, user, context);
}
```

###   Mixpanel

![Mixpanel logo](https://cdn.auth0.com/blog/integrate-your-saas-tools/Mixpanel.png)

[Mixpanel](https://mixpanel.com/) is an analytics provider that allows you to look at user behavior in both mobile and web applications. You can look at how specific features in your app are performing, what sets apart the users who come back to your app day in and day out from those who don't, and more.

The [Rule](https://github.com/auth0/rules/blob/master/rules/mixpanel-track-event.md) below sends a `Sign In` event to Mixpanel every time a unique user logs into your app. Check out Mixpanel's [HTTP API](https://mixpanel.com/help/reference/http) for more information.

```javascript
function (user, context, callback) {

  var mpEvent = {
    "event": "Sign In",
    "properties": {
        "distinct_id": user.user_id,
        "token": "{REPLACE_WITH_YOUR_MIXPANEL_TOKEN}",
        "application": context.clientName
    }
  };

  var base64Event = new Buffer(JSON.stringify(mpEvent)).toString('base64');

  request.get({
    url: 'http://api.mixpanel.com/track/',
    qs: {
      data: base64Event
    }
  }, function (e, r, b){
      // don’t wait for the MixPanel API call to finish, return right away (the request will continue on the sandbox)
      callback(null, user, context);
  });
}
```

### Fullcontact

![Fullcontact logo](https://cdn.auth0.com/blog/user-analytics-funnel-social-login/fullcontact-logo.png)

[FullContact](https://www.fullcontact.com/) is contact management software that's used to unify, de-dupe and clean lists of contacts — a big pain point for sales and marketing - heavy organizations, not to mention media companies.

Our FullContact [Rule](https://github.com/auth0/rules/blob/master/rules/get-FullContact-profile.md) allows you to get a user's profile from FullContact using their email address. It'll add a `fullContactInfo` property to their `user_metadata` if their information is available. For more, see the [FullContact API docs](http://www.fullcontact.com/developer/docs/).

```javascript
function (user, context, callback) {
  var FULLCONTACT_KEY = 'YOUR FULLCONTACT API KEY';
  var SLACK_HOOK = 'YOUR SLACK HOOK URL';

  var slack = require('slack-notify')(SLACK_HOOK);

  // skip if no email
  if(!user.email) return callback(null, user, context);
  // skip if fullcontact metadata is already there
  if(user.user_metadata && user.user_metadata.fullcontact) return callback(null, user, context);
  request({
    url: 'https://api.fullcontact.com/v2/person.json',
    qs: {
      email:  user.email,
      apiKey: FULLCONTACT_KEY
    }
  }, function (error, response, body) {
    if (error || (response && response.statusCode !== 200)) {

      slack.alert({
        channel: '#slack_channel',
        text: 'Fullcontact API Error',
        fields: {
          error: error ? error.toString() : (response ? response.statusCode + ' ' + body : '')
        }
      });

      // swallow fullcontact api errors and just continue login
      return callback(null, user, context);
    }


    // if we reach here, it means fullcontact returned info and we'll add it to the metadata
    user.user_metadata = user.user_metadata || {};
    user.user_metadata.fullcontact = JSON.parse(body);

    auth0.users.updateUserMetadata(user.user_id, user.user_metadata);
    return callback(null, user, context);
  });
}
```

There are endless ways to use customer data to build a better application. The key is to keep experimenting until you find something that really works — when you find that, double down.

There are no magic bullets. All you can do is look for an edge. Using analytics, however, you can find that edge a lot faster.

> [Auth0 offers a generous **free tier**](https://auth0.com/pricing) to get started with modern authentication on B2C, B2B, retail and CIAM products.
