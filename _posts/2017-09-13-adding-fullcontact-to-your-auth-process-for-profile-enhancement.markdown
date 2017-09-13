---
layout: post
title: "Adding FullContact to your Auth Process For Profile Enhancement"
description: "Learn how to enhance your users' profile by adding FullContact to your authentication process."
date: 2017-09-13 8:30
category: Technical Guide, Identity, Analytics
author:
  name: "Prosper Otemuyiwa"
  url: "https://twitter.com/unicodeveloper"
  mail: "prosper.otemuyiwa@auth0.com"
  avatar: "https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200"
design:
  image: https://cdn.auth0.com/blog/fullcontact/logo02.png
  bg_color: "#2A2626"
related:
  - 2017-04-17-how-profile-enrichment-and-progressive-profiling-can-boost-your-marketing
  - 2017-03-24-360-view-of-customer-by-managing-identity
  - 2017-05-26-go-beyond-username-password-with-modern-auth
tags:
  - fullcontact
  - profile-enhancement
  - authentication
  - auth0
---


**Profile Enhancement** is the ability to enhance user profiles by fetching user data from an external source. In an application, upon sign up of a new user, actions should be taken to automatically augment the user profile with additional public information. FullContact, the renown leading contact platform for professionals, teams, and businesses makes profile enhancement a breeze by providing substantial data.

![FullContact Signup](https://cdn.auth0.com/blog/fullcontact/signup.png)

## Typical Scenario

A new user signs up to a platform, say *platformxyz.com.* The signup form only provides fields for *email address*, *first name*, *last name* and *phone number*. Once the user fills the form and hits the submit button, the user is registered and automatically logged in.

*platformxyz.com* immediately queries an external service for more information on the user via one of the parameters used to sign up, e.g the email address.

Now, the user has an enhanced profile because data has been fetched from an external source during the login process. The platform didn’t even ask the user to explicitly fill so many form fields to provide additional personal information. That’s **Profile Enhancement** right there. Imagine the possibility of adding that to your own applications without stress!

## Let's Get Started

[FullContact](https://www.fullcontact.com/) keep contacts in sync across multiple devices and gives you up-to-date contacts with public data, including photos, jobs, and social profiles. It views company profiles for your contacts, including size, founded date, and many more.

In this post, you’ll learn how to implement **Profile Enhancement** via **FullContact** in your [Auth0](https://auth0.com) app in just 5 simple steps.

## 1. Sign up for a FullContact Account

Browse to [fullcontact.com](https://www.fullcontact.com) and create a free account, as shown below.

![FullContact Signup](https://cdn.auth0.com/blog/fullcontact/signup.png)

## 2. Get Your API Key

Head over to the [developer portal](https://portal.fullcontact.com/signin) and sign in with your credentials as shown below.

![Sign in to FullContact](https://cdn.auth0.com/blog/fullcontact/signin.png)

_Sign In Page_

You will go through a series of verifications for your account as shown below.

![Enable API access](https://cdn.auth0.com/blog/fullcontact/enableapiaccess.png)

_Verification Process_

Once you are verified successfully, you will be directed to the home page where your **API Key** will be displayed as shown below.

![Welcome](https://cdn.auth0.com/blog/fullcontact/welcome.png)

Please take note of your **FullContact’s** API key, as you will be needing it later.

## 3. Set Up an Auth0 App

In the [Auth0 Dashboard](https://manage.auth0.com) create your client Application, as shown in the following screenshot.

![Assign Type Of Application](https://cdn.auth0.com/blog/fullcontact/assigntypeofapplication.png)

_Create an Auth0 app_

Once you are done with that, head over to the **Settings** section of the dashboard and take note of your **Domain**, **Client ID** and **Client Secret** as shown below:

![Auth0 Credentials](https://cdn.auth0.com/blog/fullcontact/auth0credentials.png)

_Get your Auth0 Credentials_

Clone this [sample app from GitHub](https://github.com/auth0-blog/auth0-fullcontact), open up `auth0-variables.js` and add your Auth0 credentials like so:

```js

var AUTH0_CLIENT_ID='xxxxxxxxxxx';
var AUTH0_DOMAIN='xxxxxxx.auth0.com';
var AUTH0_CALLBACK_URL=location.href;

```
_auth0-variables.js_

**Note:** Don’t forget to put your url, *http://localhost:8080*, in the **Allowed Callback URLs** and **Allowed Origins (CORS).**

## 4. Integrate FullContact

In the Auth0 dashboard, Click on the **Rules** section in the main navigation, then create a rule via the **“Create Rule”** button located at the top right of the page.

![Rules](https://cdn.auth0.com/blog/fullcontact/rules.png)

_Create a new rule from the Auth0 Management Dashboard_

A list of available rules existing on the Auth0 dashboard will be presented to you as shown in the diagram below. Choose the **“Enrich Profile with FullContact”** rule.

![Select Rules](https://cdn.auth0.com/blog/fullcontact/selectrules.png)

_Click on the Enrich Profile with Full Contact Rule_

This rule is designed to get the user profile from FullContact using the users’ email. If the users’ email address is available with FullContact, it fetches the user’s profile and adds a new property *fullContactInfo* to the **user_metadata** that is returned.

After clicking on the rule, the rule editor will show up. Here, you can see the code that integrates **FullContact** with your login process.

![Rules Editor](https://cdn.auth0.com/blog/fullcontact/ruleseditor.png)

_Rule Editor_

Get your **FullContact** API key and paste it in the **rule editor**. Replace `FULLCONTACT_KEY` default value with this key.

**Note:** In your rule editor, you will see a slack integration that alerts errors generated while gathering data from **FullContact**. Feel free to delete this integration if it’s not needed for your application.

## 5. Run and Test Your App

Open up your browser and run the app like so:

![Auth0 Login Widget](https://cdn.auth0.com/blog/fullcontact/auth0loginwidget.png)

Log into your application. You will see the user profile gotten from **FullContact** in the console as shown in the image below.

![Total information](https://cdn.auth0.com/blog/fullcontact/totalinfo.png)

Just look at the enormous amount of data returned for this logged-in user. Facebook, Google, LinkedIn, GitHub and other forms of data that identifies the user. Oh yeah, that’s the power of **FullContact** in enhancing a user’s profile.

## Conclusion

It is very simple to integrate **FullContact** in your authentication process when building an app that uses **Auth0**.

**FullContact** allows you to enhance user profiles in your application without much ado. It handles it for you, so you don’t stress your users by giving lengthy forms that ask for personal data. Supercharge your application today with **FullContact** and **Auth0!**
