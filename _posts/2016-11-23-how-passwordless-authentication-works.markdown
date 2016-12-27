---
layout: post
title: "How Passwordless Authentication Works"
description: Learn the nitty-gritty of Passwordless Authentication
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

**TL;DR:** Security is a key aspect of software development. Securing your authentication and authorization process can't be overemphasized. Over the years, developers have come up with different strategies for handling authentication in a way that provides maximum security for the user. One of the latest strategies is authenticating without passwords. Popular applications like Medium, Slack, and WhatsApp widely support and encourage passwordless authentication. In this article, you'll get to understand the nitty-gritty of passwordless authentication.

---

## What is Passwordless Authentication?

Passwordless authentication is a type of authentication where users do not need to login with passwords. This form of authentication totally makes passwords obsolete. With this form of authentication, users are presented with the options of either logging in simply via a magic link, fingerprint, or using a token that is delivered via email or text message.

## How Did Passwordless Authentication Come About?

Over the years, cases of stolen and hacked passwords have been on the rise. So many cases, such as the [Yahoo data breach](https://auth0.com/blog/yahoo-confirms-data-breach-of-half-a-billion-user-accounts/), [Dropbox user accounts leak](http://www.foxnews.com/tech/2016/08/31/dropbox-data-breach-68-million-user-account-details-leaked.html), and [LinkedIn Data Breach](http://fortune.com/2016/05/18/linkedin-data-breach-email-password/), had to do with having several passwords leaked.

In addition, platforms and applications keep emerging by the day and users have to register and set passwords for almost every one of them. Users are finding it really hard to keep up, thus encouraging them to use the same password for several applications. This is a very [common occurrence](https://nakedsecurity.sophos.com/2013/04/23/users-same-password-most-websites/). Now, there is a problem with this approach. Once a hacker gets access to user's password for one application, the hacker has a high probability of gaining access to every other account the user possesses. Password managers like [LastPass](https://www.lastpass.com) and [1Password](https://1password.com/) attempt to combat the challenge of users having to remember strong, crazy, and unique passwords across various systems.

With these challenges staring down at us like a monster, what if there are no more passwords to be hacked? What if there are no more passwords for users to remember? What if we discard the use of passwords totally? Passwordless authentication to the rescue!

## Benefits of Passwordless Authentication

Without much ado, passwordless authentication helps:

* **Improve User Experience:** The faster users can sign up and use your service, the more users your app tends to attract. Users dread having to fill out forms and go through a rigorous registration process. Imagine eliminating that extra five minutes of asking users to remember their grandmother's maiden name as a security question. Passwordless authentication helps improve user experience in this regard!

* **Increase Security:** Once you go passwordless, there are no passwords to be hacked.

## How Does Passwordless Authentication Really Work?

Having given a refresher on what passwordless authentication is and the benefits of its implementation, let's take an in-depth look at the process of implementing passwordless authentication in a typical application. Passwordless authentication can be implemented in various forms:

* **Authentication with a magic link via email:** With this form of authentication, the user is asked to enter their email address. Once the user submits the email address, a unique token or code is created and stored. An email with a URL that contains the unique token will be generated and sent to the user. When the link is clicked by the user, your server verifies that the unique token is valid and exchanges it for a long-lived token, which is stored in your database and sent back to the client to be stored typically as a browser cookie. There will also be checks on the server to ensure that the link was clicked within a certain period, e.g, three minutes.

Let's take a look at Auth0's magic link implementation below:

![Email Magic Link](https://cdn.auth0.com/docs/media/articles/connections/passwordless/passwordless-email-magic-link-start-flow.png)

Auth0 sends a clickable link to your email

![Email link received in inbox](https://cdn.auth0.com/docs/media/articles/connections/passwordless/passwordless-email-receive-link.png)

User is then logged in

![User Authenticated without using password](https://cdn.auth0.com/docs/media/articles/connections/passwordless/passwordless-authenticated-magic-flow.png)

* **Authentication with a onetime code via e-mail:** With this form of authentication, the user is requested to enter their email address. An email is sent to the user with a unique onetime code. Once the user enters this code into your application, your app validates that the code is correct, a session is initiated and the user is logged in.

Let's take a look at Auth0's onetime code via email implementation below:

![Authentication with a onetime code via email](https://cdn.auth0.com/docs/media/articles/connections/passwordless/passwordless-create-user-flow.png)

If the email address matches an existing user, Auth0 just authenticates the user like so:

![Authenticates user](https://cdn.auth0.com/docs/media/articles/connections/passwordless/passwordless-authenticated-flow.png)

* **Authentication with a one-time code via SMS:** With this form of authentication, the user is asked to enter a valid phone number. A unique onetime code is then sent to the phone number. Once the user enters this code into your application, your app validates that the code is correct and that the phone number exists and belongs to a user, a session is initiated, and the user logged in.

Let's take a look at Auth0's onetime code via SMS implementation below:

![Authentication with a onetime code via SMS](https://cdn.auth0.com/docs/media/articles/connections/passwordless/passwordless-create-user-flow.png)

If the phone number matches an existing user, Auth0 just authenticates the user like so:

![Authenticates user](https://cdn.auth0.com/docs/media/articles/connections/passwordless/passwordless-authenticated-flow.png)

* **Authentication with Fingerprint:** With this form of authentication, the user is asked to place their finger on a mobile device. A unique key pair is generated on the device and a new user is created on the server that maps to the key. A session is initiated and the user is logged in.

Let's take a look at Auth0's fingerprint implementation. Auth0 supports **Touch ID** for iOs. This is the authentication flow:

![Authentication with Fingerprint](https://cdn.auth0.com/docs/media/articles/connections/passwordless/passwordless-touchid-flow.png)

## Aside: Passwordless Authentication with Auth0

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
