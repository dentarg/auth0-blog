---
layout: post
title: "Anomaly Detection: Safer Login with ThisData and Auth0"
description: "Learn how to detect authentication anomalies with ThisData to improve login security."
date: 2017-03-20 8:30
category: Technical guide
banner:
  text: "Auth0 makes it easy to add authentication to your application."
author:
  name: "Nick Malcolm"
  url: "https://twitter.com/nickmalcolm"
  mail: ""
  avatar: "https://cdn.auth0.com/blog/thisdata/nickmalcolm.jpeg"
design:
  image: https://cdn.auth0.com/blog/thisdata/ThisData-logo.png
  bg_color: "#6D3CEB"
tags:
- ThisData
- anomaly-detection
- security
related:
- 2017-01-27-machine-learning-for-everyone-part-2-abnormal-behavior
- 2016-12-02-modern-authentication-for-your-clients-made-easy
---

_Guest post by [Nick Malcolm](https://twitter.com/nickmalcolm), CTO at [ThisData](https://thisdata.com)_

Anomaly Detection is the process of identifying events which are out of place or unusual. Detecting anomalies in web applications can reveal signs of malicious activity or hackers, and responding to those anomalies automatically helps keep our users safe.

A common example is the email you might have gotten from Google or Facebook when you log in from a new computer or location. You usually log in using a MacBook from your beachfront office in Fiji, and now you're logging in from Siberia using Linux. The “was this you?” email is a result of anomaly detection, and in this post we're going to supercharge your Auth0 login process with ThisData's login intelligence to achieve the same results.

[ThisData](https://thisdata.com) gives you real-time detection of account takeover for web and mobile apps. It identifies users based on context and notifies you or your users immediately if an account has been breached, just like Google.

In a [previous guest post on the ThisData blog](https://thisdata.com/blog/auth0-guest-post-adding-thisdata-to-your-auth-process-for-anomaly-detection-2/) we learned how to use ThisData's anomaly detection rules to stop attackers from logging in to your user's accounts via Auth0.

In this post, you’ll learn how to implement **Account Takeover Detection** via ThisData in your Auth0 app in just 6 simple steps.

## Let's Get Started

### 1. Sign Up for a ThisData Account

Browse to [thisdata.com](https://thisdata.com) and create a free 30 day trial account, as shown below.

![Sign up for a ThisData account to implement anomaly detection](https://cdn.auth0.com/blog/thisdata/1-sign-up.png)

### 2. Get Your API Key

In the first step of ThisData's quickstart is your API key. Please make note of it, as you will be needing it later.

![Get ThisData API key](https://cdn.auth0.com/blog/thisdata/2-get-api-key.png)

### 3. Set Up an Auth0 App

In the [Auth0 Dashboard](https://manage.auth0.com/), create a new client and choose Single Page Web Application, as shown in the following screenshot.

![Set up an Auth0 app client](https://cdn.auth0.com/blog/thisdata/3-1-set-up-auth0-app.png)

Once you’ve created a client, head over to the **Settings** section of the dashboard and take note of your **Domain**, **Client ID**, and **Client Secret** as shown below.

![Set up an Auth0 app and grab client information](https://cdn.auth0.com/blog/thisdata/3-2-auth0-secrets.png)

Clone [this sample app from Github](https://github.com/thisdata/auth0-thisdata), open up `auth0-variables.js`, and add your Auth0 credentials like so:

```js
var AUTH0_CLIENT_ID='xxxxxxxxxxx';  
var AUTH0_DOMAIN='xxxxxxx.auth0.com';  
var AUTH0_CALLBACK_URL=location.href;  
```

### 4. Integrate ThisData

In the Auth0 dashboard, click on the **Rules** section in the main navigation, then click on  the **"Create Rule"** button located at the top right of the page.

![Create an Auth0 rule to integrate with ThisData](https://cdn.auth0.com/blog/thisdata/4-1-create-rule.png)

A list of available rule templates will be presented to you as shown in the diagram below. Choose the **“Account Takeover Detection via ThisData”** rule.

![Choose Account Takeover Detection via ThisData rule](https://cdn.auth0.com/blog/thisdata/4-2-thisdata-rule.png)

This rule is designed to detect phished or compromised user accounts. Even if the primary user authentication is approved, it will deny access to a user if the login appears to be highly suspicious. It relies on ThisData anomaly detection algorithms which take into account factors like:

* Devices
* Time of the day
* Tor usage
* Location & Velocity
* Risky IP addresses
* Machine Learning 
* ...and much more.

ThisData has a risk score that is attached to every login event. A higher risk score indicates a more significant anomaly was  detected. If the risk is high, the user can still log in, but we can also send a notification to their email address to verify it was really them.

> The **"Account Takeover Prevention via ThisData"** rule will _block_ a login attempt if the risk is too high.

After clicking on the rule, the rule editor will show up. Here, you can see the code that integrates ThisData with your login process. It's nice and simple—it pushes some metadata to ThisData's API when your user logs in.

![Auth0 rule editor](https://cdn.auth0.com/blog/thisdata/4-3-rule.png)

Get your ThisData API key and paste it in the **Settings** section, as shown in the following screenshot. The rule will have access to it as an environment variable.

![Paste ThisData API key into Auth0 rule settings](https://cdn.auth0.com/blog/thisdata/4-4-configure-variables.png)

### 5. Turn on Notifications

Turning on notifications is optional, but awesome! Notifications help your users take action when their account is attacked.

Head over to your ThisData account and browse to **API Settings**. In the sidebar, click **User Notifications**. Click the checkbox next to **Send email** to turn on end user notifications.

![Turn on user notification emails in ThisData](https://cdn.auth0.com/blog/thisdata/5-1-notifications.png)

You can also upload your company logo here, or enable Slack notifications by clicking **Integrations** in the sidebar.

### 6. Run & Test Your App

Now let's run our sample Auth0 app and see how it all works.

> On a mac you can run the app by typing `python -m SimpleHTTPServer 8000` in the command line.

Open up your browser and run the app like so:

![Run app in browser](https://cdn.auth0.com/blog/thisdata/6-1-run-test-app.png)

Log into your application, and then head over to the ThisData website. You will see the recorded login event with an associated risk score, as follows:

![ThisData login event risk score](https://cdn.auth0.com/blog/thisdata/6-2-thisdata-dashboard.png)

If there is irregular activity like a sudden change in device or location, accessing the website at an unusual time, using Tor, or other anomalies, then your user will receive an email like this:

![Email notification from anomaly detection with ThisData](https://cdn.auth0.com/blog/thisdata/6-3-email-notification.png)

And your Slack channel might look like this:

![Slack notification from anomaly detection with ThisData](https://cdn.auth0.com/blog/thisdata/6-4-slack-notification.png)

In the example above, the user was immediately notified of suspicious access to their account. They then responded by clicking **"No it wasn't [me]"** in the email. The initial alert and the response are also visible to your ops team in Slack.

You can configure ThisData to take automated action too—learn how by reading ["Create a security workflow with Alert Webhooks"](http://help.thisdata.com/docs/create-a-security-workflow-with-thisdatas-alert-webhooks) in ThisData's documentation.

## Conclusion

It is super simple to integrate ThisData into your authentication process when building an app that uses Auth0. ThisData allows you to detect login anomalies to better protect your users and your app from cyber-criminals.

Cyber-attacks are on the rise, so taking these simple security precautions helps ensure that your users and apps are safe. Make your applications more secure today with ThisData and Auth0!

