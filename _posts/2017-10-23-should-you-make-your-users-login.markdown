---
layout: post
title: "Should You Make Your Users Log In?"
description: "Pros, cons, and exceptions to asking users to create an account."
date: 2017-10-23 8:30
category: Growth, Identity, User Experience
is_non-tech: true
author:
  name: "Diego Poza"
  url: "https://twitter.com/diegopoza"
  mail: "diego.poza@auth0.com"
  avatar: "https://avatars3.githubusercontent.com/u/604869?v=3&s=200"
design:
  image: https://cdn.auth0.com/blog/should-you-make-your-users-login/logo.png
  bg_color: "#676363"
related:
  - 2016-10-17-bad-login-experiences
  - 2017-04-12-social-login-on-the-rise
  - 2017-08-04-how-identity-management-helps-you-personalize-your-user-experience
tags:
  - user-experience
  - identity-management
  - identity
  - login
---

Most of the time on the Auth0 blog, we talk about logging in and signing up as though it's obvious that everyone will do it. However, asking users to sign up for your product isn't always an easy decision to make. Some people are worried about the friction it causes, or if it's necessary for their product. Sometimes, worries about maintaining secure logins make asking for signups seem like more trouble than not asking users to sign up at all. 

As experts on signup and login, we've thought of — and encountered — use case after use case, and find that asking users to log in almost always offers benefits to both the business and the user. From security to enterprise concerns to customer support, the power that login has to better your product is something you should seriously consider as you build and grow your business.

This isn't an exhaustive list of every reason why you should ask users to log in. Rather, it's an overview of why you should have users create accounts, why login is mutually beneficial, and the very few exceptions where this isn't the case. 

## The basics of login

Whether you're using a username and password or a complex multi-factor setup, the core principles of login remain the same:

* **Login requires a signup for your product.** This means that there is only a certain group of users who are allowed access your product, although login doesn't have to mean that your product is 'exclusive.' For example, anyone may be able to sign up for a gaming app, but only paying customers for an analytics software. 
* **Login creates a user account.** This means that users are uniquely identifiable within your product.
    * **For users** this frequently means that they can see their own profile and information, change that information, and keep track of what are the identifiers on their account (profile picture, username, etc.)
    * **For companies** this means that user data can be linked to an individual profile. This profile probably contains all the information the user inputs, and can also be a home for any other data that a company chooses to attach to that profile (type of device, for example).

## Security and accountability

### User Accounts

Enabling a user to create an account and log in, is equipping them with security for and control over their information. 

When a user can see the information they've given you in their user profile, they understand what you're using to connect with them. So when a user gets, for example, a promotional email, they know where it came from. They can simply go into their settings, change their email, check and unsubscribe from promotions. 

Otherwise, users might be wondering what happened to the email address they used to make an in-app purchase.

If they want, they can also change privacy settings, update personal information, and delete their projects and profile, leaving no question about what is hanging around in your product. 

**For your users:** Accounts help put users in the driver's seat for their data. 

**For your company:** Letting users see and control their data builds trust with users, which helps foster transparency about what information is stored by a company (especially when [nobody](https://www.theguardian.com/money/2011/may/11/terms-conditions-small-print-big-problems) reads terms and conditions). 

### Enterprise concerns

Login is also incredibly important for enterprise customers, for a number of reasons. 

* **Security.** Enterprise customers want to have everything within their system secured, which means providing a sign up that works with [enterprise login requirements](https://auth0.com/blog/how-enterprise-federation-helps-shorten-the-sales-cycle/).

![Enterprise Connections](https://cdn.auth0.com/blog/should-you-make-your-users-login/enterprise-connections.png)

* **Managing roles.** With potentially hundreds of employees all needing to access your product, enterprise customers want to be able to designate and manage roles. The head of marketing might need admin access to an analytics platform, but a sales person definitely doesn't. 
* **Tracking employee data.** When each employee has an account, it's easy to track who is making changes, who is working on what projects, and how teams are working together. Enterprise companies especially are interested in keeping track of who is doing what, so anything that comes up down the line, whether mistake or triumph, can be properly attributed.

**For your users:** Accounts and login helps enterprise customers trust your product and integrate it with their existing tools.

**For your company:** If you are considering working with enterprise customers, you will need to implement a sign on feature. Truthfully, we've only scratched the surface of what enterprise customers expect out of their login — it can be make or break for you if you don't have a login to fit their needs, no matter what your product. 
 
### Customer experience

Login can be a powerful tool for shaping customer experiences. Beyond simply getting someone into a product, login can be a way to manage data on a user and help them get the most out of your product. 

* **Giving better support.** When a customer contacts support with a problem, imagine if they could get welcoming, customized support — like being greeted by name, and not having to answer a long list of questions about their product history or what devices they're using. If you don't have a user account to store data like name and device type, that's simply not possible. Keeping an internal profile of every customer through your login is a great way to personalize your support.
* **Catering to a multi-device world.** When there's no login, there's no easy way for a user to use your product on multiple devices without starting fresh. Even if you're a simple game app, letting people save their progress and access from different devices can keep users habitually engaging with your product.  

![Multi-device world](https://cdn.auth0.com/blog/should-you-make-your-users-login/multi-device.png)

* **Offering a social component**. Whether people want to share their favorite songs, their pictures and videos, their high score or their sales data, any sort of social or sharing component in a product can benefit from a login. By giving people an account and a profile at login, you make it easy for someone to find just the right person to connect with, whether that's for business or friendship. Without login, finding and sharing things to a select group is difficult.

If you're still worried about having the login as a barrier between potential users and your product, consider offering options like passwordless login and social login, that ask less of users than traditional or multifactor authentications. 

## Exceptions to the rule

So, we've been over many reasons why using a login is a good idea. But there's always exceptions to the rule — here are the three biggest. 

* **Product demos:** Although some companies have you create an account to access a product demo, most require only your email or sometimes nothing at all. When you're giving people the chance to try out your product, it doesn't always make sense to have them go through the process of creating an account, especially if it's a short demo and not a free trial. If a user just wants to see what you're about, sometimes it's better to let them get some time to explore without having to sign up.
* **Checkout:** Users shopping online are skittish about signing up in order to check out, especially if they're a new customer and aren't sure if they like your product yet. Removing a requirement to sign up and allowing a guest checkout can benefit your conversions at checkout. Clothing retailer ASOS [halved](https://econsultancy.com/blog/10355-eight-out-of-top-10-us-retailers-offer-guest-checkout/) it's abandonment rate by adding a guest checkout. 

![Checkout experience](https://cdn.auth0.com/blog/should-you-make-your-users-login/checkout.png)

* **Mobile**: It seems like almost every mobile app requires a login, save for weather apps and a few games. One reason for this may be that the [download is the real source of friction](https://www.quora.com/Is-it-better-to-force-a-login-signup-to-use-an-app-or-let-users-use-it-freely-until-they-hit-a-feature-that-requires-a-login) to adopting use of a mobile app — once you've gone through the trouble of actually getting the app from the app store, the time it takes to sign up is negligible. Still, if you're offering a simple mobile service without any social features, it might be worth skipping the extra step. 

These exceptions come with deep understanding of your product, and how users are moving through it. When login becomes a big source of friction, it can make sense to remove it. Take the “[$300 million dollar change](https://articles.uie.com/three_hund_million_button/)” that one major e-commerce company made.

They didn't see their request for users to login as a problem — but their users sure did. When interviewed, they expressed that having to login before checkout was a huge nuisance, and when they looked at their analytics they saw 160,000 requests for forgotten password a day — clearly, login was hampering their customers from checking out, not helping them. 

When they dropped their login requirement, they immediately saw a huge sales boost.

So, if you are thinking about ditching your login, do some exploratory work and see what is tripping people up as they're trying to use your product. If it seems to be login, it could be worth a shot to remove it and see how things go.

## Let your login lead the way

If you're trying to decide whether or not to add a login feature to your product, don't fall prey to thinking that all login is is a box for a username and password that only creates friction for your users. When you're actually thinking about what login can do for you, it's clear that there's a host of benefits for both you *and *your users that simply aren't possible if you don't require a login.

Of course, making these benefits a reality means implementing a more sophisticated login than that box for your username and password, and that's where Auth0 is ready to help. When you implement that sophisticated login, you're letting it lead you to better customer experiences, no matter the product.

**Aside: Securing Applications with Auth0**

Are you building a [B2C](https://auth0.com/b2c-customer-identity-management), [B2B](https://auth0.com/b2b-enterprise-identity-management), or [B2E](https://auth0.com/b2e-identity-management-for-employees) tool? Auth0, can help you focus on what matters the most to you, the special features of your product. [Auth0](https://auth0.com/) can improve your product's security with state-of-the-art features like [passwordless](https://auth0.com/passwordless), [breached password surveillance](https://auth0.com/breached-passwords), and [multifactor authentication](https://auth0.com/multifactor-authentication).

[We offer a generous **free tier**](https://auth0.com/pricing) so you can get started with modern authentication.
