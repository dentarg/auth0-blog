---
layout: post
title: "An Easy Way for Users to Link Accounts"
description: "Give your users a choice to link their accounts when accidentally using another provider with the same email address."
date: 2017-10-20 20:30
category: Announcements, Feature
author:
  name: "Matthew Machuga"
  url: "https://twitter.com/machuga"
  mail: "matthew.machuga@auth0.com"
  avatar: https://gravatar.com/avatar/8f9f6a577da77a9add9cadbb90e66b75
design:
  bg_color: "#4E0D61"
  image: "https://cdn.auth0.com/blog/account-link-extension/logo.png"
tags:
- identity
- management
- auth0
- extension
related:
- 2017-06-09-the-three-best-ways-to-create-the-single-vision-of-a-customer
- 2017-08-11-how-identity-can-help-you-create-a-great-user-onboarding
- 2017-07-21-the-role-of-identity-in-application-modernization
---

# An Easy Way for Users to Link Accounts

A few months ago, Diego Poza wrote an article on [The 3 Best Ways To Create the Single Vision of A Customer](https://auth0.com/blog/the-three-best-ways-to-create-the-single-vision-of-a-customer/).
In it he said the number one must-have is Centralized Identity Management. He 
described that in Auth0, if a user signed in with their Facebook login, then 
their Google account next, they would have two accounts. Auth0 already
provides rules for allowing these accounts to be linked back together 
automatically, but we're happy to announce a new option that gives the
user a choice as to whether they'd like to link the accounts or not.

This happens as part of our [Account Link extension](https://auth0.com/docs/extensions/account-link). It's extremely simple to
set up and can save your users a lot of hassle.

Let's walk through how this gets presented to your users to demonstrate how the
functionality is helpful. Let's say one of your users has the email address
`spencer@example.com`. They've used this email address to sign up for Facebook,
Twitter, Google Apps, and your site. If your site offers all of these social
sign in options and database users, it can be understandably hard for a user
to remember what account they used to sign up for your site. Like in our
example above, we'll assume that `spencer@example.com` signed up with their
Facebook account originally, but now that they're back on the site they can't
remember. They incorrectly guess they used Google to sign in.

With the extension enabled, instead of being taken to your site with a new
account, they are sent to a prompt from the extension, notifying them that they
appear to already have an account registered with that email address on your
site. The most prominent option is to continue linking the accounts. When
**Continue** is clicked, the user will be redirected to log in with the account
that's already detected on your site. Assuming their authentication is
successful, they'll be redirected to your site successfully as their original
account, with the new account merged in as an identity of the original. This
then, conveniently, lets them sign in with either option to the same account.

![Image of extension page](https://cdn2.auth0.com/docs/media/articles/extensions/account-link/hosted-page-example.png)
<!-- Image in docs going through code review -->

But let's assume the opposite for a moment: that your user has intentionally
tried to create a second account with a different provider. Not a problem! They
can simply click the small, diminished link saying, "I want to skip this and
create a new account." and they'll continue to your site logged in as a
new user under their new provider.

Providing the ability to link accounts through the Account Link extension
makes it so your user retains a choice as to whether they'd like their accounts
linked, but will encourage them to link by default since it tends to be the 
most common intent.

You can install it from the [Extensions Gallery](https://manage.auth0.com/#extensions)
and give your users a choice that will make their experience, and your management, easier.

# Aside: Securing Applications with Auth0

Are you building a [B2C](https://auth0.com/b2c-customer-identity-management), [B2B](https://auth0.com/b2b-enterprise-identity-management), or [B2E](https://auth0.com/b2e-identity-management-for-employees) tool? Auth0, can help you focus on what matters the most to you, the special features of your product. [Auth0](https://auth0.com/) can improve your product's security with state-of-the-art features like [passwordless](https://auth0.com/passwordless), [breached password surveillance](https://auth0.com/breached-passwords), and [multifactor authentication](https://auth0.com/multifactor-authentication).

[We offer a generous **free tier**](https://auth0.com/pricing) so you can get started with modern authentication.

