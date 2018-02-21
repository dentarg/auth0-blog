---
layout: post
title: The $6 Billion Reason Your Business Needs Advanced Fraud Protection
description: "Let your defenses down, and you could be giving money away."
longdescription: "In 2016, consumers lost $16 billion due to online fraud, up from $15 billion in 2015. Such crimes affected more than 15.4 million consumers. Let your defenses down, and you could be giving money away."
date: 2018-02-16 15:53
category: Growth
is_non-tech: true
author:
  name: Martin Gontovnikas
  url: http://twitter.com/mgonto
  mail: gonto@auth0.com
  avatar: https://www.gravatar.com/avatar/df6c864847fba9687d962cb80b482764??s=60
design:
  bg_color: "#657A4F"
  image: "https://cdn.auth0.com/blog/advanced-fraud-protection/logo.png"
tags:
- fraud-protection
- breach
- fraud
- protectiony
- infosec
- auth0-rules
- security
- cybersecurit
related:
- 2018-01-08-meltdown-and-spectre-what-auth0-customers-need-to-know
- 2017-12-29-why-every-business-needs-two-factor-authentication-security
- 2018-01-26-security-predictions-for-2018-that-go-beyond-gdpr-compliance
- 
---

In 2016, consumers lost [$16 billion](https://www.cnbc.com/2017/02/01/consumers-lost-more-than-16b-to-fraud-and-identity-theft-last-year.html) due to online fraud, up from $15 billion in 2015. Such crimes affected more than 15.4 million consumers.

None of this takes into account the enormous damages to companies' reputations when their security systems are breached.

Many organizations have taken initial steps to protect themselves against these types of losses (e.g., trying to keep pace with software updates) — but far more can be done.

## What Is Online Fraud Protection?

Online fraud protection encompasses an array of methods for preventing the theft of your organization’s most sensitive data. General forms can include, but are not limited to:

1. **Educating your employees about phishing:** Sophisticated email attacks can be indistinguishable from real emails. This can result in staggering breaches of end-user data. It's important to make sure that each member of your team understands [this](https://auth0.com/blog/the-new-trend-of-artisanal-spam/).
2. **Limiting the disclosure of sensitive information:** The more you distribute your company's EIN, the more surface area you're creating for possible attacks. Limit disclosure to only those cases, when it's absolutely necessary. In addition, try to communicate it over the phone or in-person rather than over a stored medium.
3. **Sign up for alerts with your local Secretary of State:** If anyone attempts to change your business's registration information, you can receive an email quickly from your local Secretary of State, notifying you of the update. If it's not something you authorized, you can have the fraud immediately rolled back.

Despite widespread education on these steps, hackers still manage to worm their way into companies at alarming rates.

## The Worst Cases of Identity Theft in Recent History

[When a data breach occurs](https://auth0.com/blog/data-breaches-by-the-numbers/), cyberthieves have the ability to open bank accounts, lines of credit, new credit cards, and even drivers' licenses in the name(s) of those they've scammed. This can happen within a day — or sooner.

![When a data breach occurs, cyberthieves have the ability to open bank accounts, lines of credit, etc.](https://cdn.auth0.com/blog/advanced-fraud-protection/equifax-breach-laptop-lg.png)

([Image Source](https://www.creditcards.com/credit-card-news/images/equifax-breach-laptop-lg.png))

In September 2017, criminals stole sensitive data, including names, birthdates, physical addresses, and Social Security numbers from a yet-to-be-determined number of drivers' licenses from Equifax customers. These hackers also stole 209,000 credit card numbers and 182,000 documents, also containing identifying information.

This is the tip of the iceberg. Other major breaches in the past few years include:

* **Yahoo:** 2013 *and* 2014 (both disclosed 2016); 3.5 billion accounts exposed in total (all Yahoo users); names, birthdates, phone numbers, email addresses, encrypted or unencrypted security questions and answers, and hashed passwords — now available for sale.
* **Myspace:** 2016; 360 million users threatened; more than 427 million passwords made vulnerable.

In the cases of Equifax and Myspace, hackers were able to carry out their breaches, due to outdated systems (e.g., a vulnerability in one of Equifax's web applications allowed access to the credit reporting agency’s most critical data). With Yahoo, an employee opened a spear-phishing email. From here, the hacker was able to explore the company's network, install a backdoor into its server, and obtain a copy of the user database.

## Three Extra Steps You Can Take to Protect Your Company

[Rules](https://auth0.com/blog/5-ways-to-make-your-app-more-secure-in-less-than-20-minutes/) are snippets of JavaScript code, which run as part of a customized login process on Auth0 servers. Rules allow customers to limit logins to a specific region, add information to a user profile (e.g., their security role), and/or check the last time a user reset their password.

![Rules (https://auth0.com/blog/5-ways-to-make-your-app-more-secure-in-less-than-20-minutes/) are snippets of JavaScript code, which run as part of a customized login process on Auth0 servers](https://cdn.auth0.com/blog/advanced-fraud-protection/flow.png)

Rules can be helpful in several ways.

* **They are easy to create & run:** Implementation is simply via a few lines of JavaScript in our Webtask sandbox — with no extra technical debt or product development needed.
* **They can provide real-time updates:** Depending on the service for which you are implementing Rules, you can get real-time updates of user sign-ins, along with any data you sent via the API.
* **They offer sequencing:** Any number of Rules can be run on a single log in. You can run each of the three Rules below (and more) every time a user logs in.
* **They bring improved reporting accuracy:** Server-side events complete with a much higher degree of confidence than client-side ones. (Client-side attempts can be blocked by firewalls, errant browser extensions, or code errors.)

### Rule 1: User Fraud Score

This Auth0 Rule is particularly helpful if you have built an online marketplace, such as Etsy or Airbnb. Protecting your buyers and sellers from fraud in this ecosystem is critical to maintaining its trustworthiness and ensuring more transactions happen there. This Rule will calculate a fraud score for every user, based on their email address and IP address.

```javascript
function (user, context, callback) {
  // score fraudscore once (if it's already set, skip this)
  user.app_metadata = user.app_metadata || {};
  if (user.app_metadata.socure_fraudscore) return callback(null, user, context);

  var SOCURE_KEY = 'YOUR SOCURE API KEY';

  if(!user.email) {
    // the profile doesn't have email so we can't query their api.
    return callback(null, user, context);
  }

  // socurekey=A678hF9A323172B78E9&email=jdoe@acmeinc.com&ipaddress=1.2.3.4&mobilephone=%2B12015550157
  request({
    url: 'https://service.socure.com/api/1/EmailAuthScore',
    qs: {
      email:  user.email,
      socurekey: SOCURE_KEY,
      ipaddress: context.request.ip
    }
  }, function (err, resp, body) {
    if (err) return callback(null, user, context);
    if (resp.statusCode !== 200) return callback(null, user, context);
    var socure_response = JSON.parse(body);
    if (socure_response.status !== 'Ok') return callback(null, user, context);

    user.app_metadata = user.app_metadata || {};
    user.app_metadata.socure_fraudscore = socure_response.data.fraudscore;
    user.app_metadata.socure_confidence = socure_response.data.confidence;
    // "details":[  
    //     "blacklisted":{  
    //        "industry":"Banking and Finance",
    //        "reporteddate":"2014-07-02",
    //        "reason":"ChargeBack Fraud"
    //     }
    // ]
    user.app_metadata.socure_details = socure_response.data.details;

    auth0.users.updateAppMetadata(user.user_id, user.app_metadata)
      .then(function(){
        callback(null, user, context);
      })
      .catch(function(err){
        callback(null, user, context);
      });
  });
}
```

(Auth0 Rule for [Socure](https://github.com/auth0/rules/blob/master/rules/socure_fraudscore.md))

Fraud Score works with [Socure](http://socure.com/), a cloud service that aggregates data from social media, offline identity verification services, and publicly available data, to determine if a user is real or fake. By putting users with high fraud scores on a watch list, and/or requiring additional verification before they can transact, Fraud Score can help protect your app and users. In addition, Fraud Score will deliver the information by the point of registration, instead of following a series of fraudulent transactions on the site.

### Rule 2: Checking Fraud with minFraud

minFraud identifies possible fraud in online transactions, as well as suspect account logins and signups, using geolocation, IP address, email, device and proxies. The minFraud rule will send the user’s IP address, email address, and username (both in MD5 format) to MaxMind’s minFraud API. In turn, the API will return the risk score for the transaction. This data can be leveraged within the Rule to block any login with a high-risk score.

```javascript
function (user, context, callback) {
  var _ = require('underscore');
  var request = require('request');
  var crypto = require('crypto');

  var MINFRAUD_API = 'https://minfraud.maxmind.com/app/ccv2r';

  var data = {
    i: context.request.ip,
    user_agent: context.request.userAgent,
    license_key: 'YOUR_LICENSE_KEY',
    emailMD5: user.email &&
        crypto.createHash('md5').update(user.email).digest("hex") || null,
    usernameMD5: user.username &&
        crypto.createHash('md5').update(user.username).digest("hex") || null
  };

  request.post(MINFRAUD_API, { form: data, timeout: 3000 }, function (err, res, body) {
    if (!err && res.statusCode === 200 && body && body.indexOf(';') >= 0) {
      var result = _.reduce(_.map(body.split(';'), function(val) {
        return { key: val.split('=')[0], value: val.split('=')[1] };
      }), function(result, currentItem) {
        result[currentItem.key] = currentItem.value;
        return result;
      });

      console.log('Fraud response: ' + JSON.stringify(result, null, 2));

      if (result && result.riskScore && (result.riskScore * 100) > 20) {
        return callback(new UnauthorizedError('Fraud prevention!'));
      }
    }

    if (err) {
      console.log('Error while attempting fraud check: ' + err.message);
    }
    if (res.statusCode !== 200) {
      console.log('Unexpected error while attempting fraud check: ' + err.message);
    }

    // If the service is down, the request failed, or the result is OK just continue.
    return callback(null, user, context);
  });
}
```

See this rule [here](https://github.com/auth0/rules/blob/master/rules/fraud-prevention-with-minfraud.md).

### Rule 3: Force Email Verification

As expected, this Rule denies any user who hasn’t verified their email address from logging in. This Rule is particularly helpful when working with multiple emails, which belong to networks, e.g., `@university.edu` or `@company.edu`. (The tactic of requesting these network emails is one of many critical ones, which help SaaS companies grow rapidly.)

```javascript
function (user, context, allback) {
  if (!user.email_verified) {
    return callback(new UnauthorizedError('Please verify your email before logging in.'));
  } else {
    return callback(null, user, context);
  }
}
```

(Auth0 Rule for [forcing email verification](https://github.com/auth0/rules/blob/master/rules/email-verified.md))

Without this email verification step, chances are high you could show an impostor sensitive company information. To ensure a user actually owns the email address and belongs to the network, signified by their email address, have your app email the user with a unique, obscure, automatically generated link to a page. This will force them to prove that they have access to the email account by logging in and clicking on the link to verify.

While a range of options is available for corporations and institutions to verify the identity of their users, Auth0 offers teams the chance to integrate their advanced options into existing SaaS tools.

## Stay Ahead of Cybercriminals In 2018

In 2018, identity theft will continue to rise as it has for decades. Cybercriminals only become more advanced in their techniques of usurping others’ identities; losses from these crimes have worsened.

Be sure your company isn't part of the headlines — and doesn't suffer significant financial losses. Auth0 Rules can deliver simple fixes — halting staggering problems before they arise.
