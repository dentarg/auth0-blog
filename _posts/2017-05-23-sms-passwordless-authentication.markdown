---
layout: post
title: "SMS Passwordless Authentication"
description: Learn how SMS Passwordless Authentication works!
date: 2016-11-23 08:30
category: Technical Guide, Identity, Passwordless
design:
  bg_color: "#001D3F"
  image: https://cdn.auth0.com/blog/PasswordlessLogo.png
author:
  name: Prosper Otemuyiwa
  url: http://twitter.com/unicodeveloper?lang=en
  mail: prosper.otemuyiwa@auth0.com
  avatar: https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200
tags:
- passwordless
- authentication
- touchID
related:
- 2016-04-21-facebook-account-kit-passwordless-authentication
- 2016-05-14-how-passwordless-sms-authentication-can-improve-your-app
- 2016-09-09-analysis-of-passwordless-connections

---

---

**TL;DR:** Passwordless authentication is not a new concept in the world of authentication. Platforms like Slack and Whatsapp already adopt this form of authentication. Passwordless authentication employs a form of strategy that requires authentication without passwords. However, there are different forms of passwordless authentication. In this article, you'll get to understand how SMS passwordless authentication works and build an app alongside.

---

## What is SMS Passwordless Authentication?

SMS Passwordless authentication is a type of authentication where users do not need to login with passwords. This form of authentication totally makes passwords obsolete. With this form of authentication, users are presented with the option of logging in simply via a token that is delivered via text message.

## Benefits of Passwordless Authentication

Without much ado, passwordless authentication helps:

* **Improve User Experience:** The faster users can sign up and use your service, the more users your app tends to attract. Users dread having to fill out forms and go through a rigorous registration process. Imagine eliminating that extra five minutes of asking users to remember their grandmother's maiden name as a security question. Passwordless authentication helps improve user experience in this regard!

* **Increase Security:** [59%](https://auth0.com/blog/2015/09/30/auth0-passwordless-email-authentication-and-sms-login-without-passwords/) of internet users admit to using the same password for multiple accounts. Once an attacker gets hold of one account's password, he or she can compromise other accounts that use the same password. However, once you go passwordless, there are no passwords to be hacked.

## How Does SMS Passwordless Authentication Work?

Let's take a look at how SMS passwordless authentication actually works. This form of authentication works via SMS. Check out the process below:

* The user is asked to enter a valid phone number. 

	![](https://cdn.auth0.com/blog/sms-authentication/sms-lock.png)
	_User enters a valid phone number_

* A unique onetime code is then sent to the phone number. 

	![Onetime code is received](https://cdn.auth0.com/blog/sms-authentication/auth0-sms.png)
	_One time code is received_

* Once the user enters this code into your application, your app validates that the code is correct and that the phone number exists and belongs to a user, a session is initiated, and the user is logged in.

	![SMS Confirmation](https://cdn.auth0.com/blog/sms-authentication/sms-confirmation.png)
	_In Auth0's case, user has five minutes to input the code into the app & get logged-in_


Take a look at Auth0's onetime code via SMS implementation below:

![Authentication with a onetime code via SMS](https://cdn.auth0.com/docs/media/articles/connections/passwordless/passwordless-create-user-flow.png)

If the phone number matches an existing user, Auth0 just authenticates the user like so:

![Authenticates user](https://cdn.auth0.com/docs/media/articles/connections/passwordless/passwordless-authenticated-flow.png)

Other forms of passwordless authentication are:

* Authentication with a magic link via email
* Authentication with a onetime code via e-mail
* Authentication with Fingerprint

Check out this [excellent article](https://auth0.com/blog/how-passwordless-authentication-works/) to have an in-depth understanding of how these other forms of passwordless authentication work!

## Aside: Phone Number / SMS Passwordless Authentication with Auth0

With Auth0, passwordless authentication is dead simple to implement. There are diagrams earlier in this post that already show the passwordless authentication flow using Auth0. You must have noticed `Passwordless API` in those diagrams. This is a battle-tested and efficient [API implementation](https://auth0.com/docs/api/authentication#passwordless) of passwordless authentication. You can check out how it works under the hood or simply build your own implementation on top of it.

We can also easily configure our applications to use **Auth0 Lock** for passwordless authentication. Let's quickly create an application that implements magic link by following the steps below:

- Clone this [repo](https://github.com/auth0-samples/auth0-jquery-passwordless-sample)
- Create an <a href="javascript:signup()">Auth0 account for free</a>
- On the dashboard, click on the red `Create Client` button to create a new app like so:
![Create a Passwordless Application](https://cdn.auth0.com/blog/passwordlessApp.png)

- Head over to the [Passwordless Connections](https://manage.auth0.com/#/connections/passwordless) side of the dashboard and enable email option
![Enable Passwordless App](https://cdn.auth0.com/blog/enableEmailOne.png)
_Enable Passwordless App_

![Enable Magic Link](https://cdn.auth0.com/blog/enableEmailLink.png)
_Enable Magic Link_

![Save Configuration for Passwordless App](https://cdn.auth0.com/blog/enableEmailForApp.png)
_Save Configuration for Passwordless App_

- Head over to your settings tab for the `Passwordless App` and copy your `client_id` and `domain`
![Passwordless Authentication Settings](https://cdn.auth0.com/blog/passwordlessSettings.png)
_Settings Tab_

- Open up `auth0-variables.js` in your code and replace the `AUTH0_CLIENT_ID` and `AUTH0_DOMAIN` values with your real Auth0 keys
-  Run and test the app
![Click Magic Link Button](https://cdn.auth0.com/blog/clickMagicLink.png)
_Click the Magic Link Button_

![Sign in without passwords](https://cdn.auth0.com/blog/lock-magic-link.png)
_Follow the instruction and sign in_

![Email Modal](https://cdn.auth0.com/blog/inputEmail.png)
_Submit your email on the Lock Widget_

![Magic link email notification](https://cdn.auth0.com/blog/notificationBox.png)
_Notification Modal to show that the link has been sent_

![Magic Link from email](https://cdn.auth0.com/blog/magicLinkPasswordless.png)
_Magic Link From Email_

![Signed in via the Magic Link](https://cdn.auth0.com/blog/welcomeEmailFromLink.png)
_Signed in via the Magic Link_

If you don't want to go through the process of creating an app, there is an online version you can play with [here.](https://auth0.github.io/lock-passwordless/)


## Conclusion

There is no doubt that passwords have become more susceptible to being compromised in recent years. [Passwordless](https://auth0.com/passwordless/) authentication aims to eliminate authentication vulnerabilities. This recent [analysis of passwordless connections](https://auth0.com/blog/analysis-of-passwordless-connections/) shows that passwordless adoption is increasing. Passwordless authentication is also very useful and gaining ground in the IoT world. It's easier, friendlier, and faster to be authenticated into an IoT device via Touch ID, push notification, or even a onetime passcode than with traditional means. If you really care about security, you should look into passwordless authentication!

We have covered how to implement practical passwordless authentication in an application using magic links. You can follow a similar process to achieve the same objective using a onetime code via SMS. <a href="javascript:signup()">Sign up for Auth0</a> and implement passwordless authentication today!

{% include tweet_quote.html quote_text="If you care about security, you should look into passwordless authentication" %}
