---
layout: post
title: "Go Beyond Username/Password with Modern Authentication"
description: "Learn how to leave usernames and passwords behind with social and passwordless authentication."
date: 2017-05-26 8:30
category: Growth, Modern Authentication
banner:
  text: "Auth0 makes it easy to add authentication to your application."
author:
  name: Diego Poza
  url: https://twitter.com/diegopoza
  avatar: https://avatars3.githubusercontent.com/u/604869?v=3&s=200
  mail: diego.poza@auth0.com
design:
  image: https://cdn.auth0.com/blog/go-beyond-up-auth/logo.png
  bg_color: "#01B48F"
tags:
- security
- passwordless
- social-login
is_non-tech: true
related:
- 2016-11-23-how-passwordless-authentication-works
- 2016-10-17-sso-login-key-benefits-and-implementation
---

**TL;DR:** Learn how to leave usernames and passwords behind with social and [passwordless authentication](https://auth0.com/passwordless) with Auth0's [Identity and Access Management solution](https://auth0.com/user-management).

---

After months and months of developing your new app, it's finally ready to launch. You feel confident that you've got all the features and functionality you need. But with all of that work, you've let your login fall by the wayside. A simple a username and a password will do the trick, right?

Wrong. In the age of modern authentication, you need to go beyond usernames and passwords to protect customer information and give users frictionless logins that they trust. Embracing login as identity management rather than as a simple gate to access is imperative.

Here's what you need to know.

## Implement Easy Login Options for Users

Between the growing number of passwords users have to remember and the multiple steps needed to reset a forgotten password, users are demanding easier login options.

Making it as easy as possible for them to visit your site means they'll [stick around longer](https://blog.fullstory.com/the-best-products-will-win-7ec43a93186#.onq2r8lau). By removing the friction usually associated with activating a new account or simply signing in, you'll reduce your abandon rate.

Using modern authentication practices, [Auth0](https://auth0.com) has built a system that can be quickly integrated into your site to give users the easy access they've been asking for. [Social login](https://auth0.com/learn/social-login/) and [passwordless authentication](https://auth0.com/passwordless) are two options that provide freedom from usernames and passwords.

With social login, users confirm their identity by using a third party site that has already vetted their authenticity.

![Social authentication](https://cdn.auth0.com/blog/userpass/social-login.png)
[Source](http://tradablebits.com/social-login)

It takes less time for users to set up an account and profile since their personal information is automatically filtered into the new site. Almost everyone has at least one social media profile, so it's perfect for users who want one fewer password.

With passwordless authentication, users are sent timed codes via SMS or email, or they can use their iPhone’s TouchID to access their account.

![Auth0 passwordless authentication](https://cdn.auth0.com/blog/userpass/auth0-passwordless.png)

They only need to have immediate access to their phone or email to quickly access their account. Again, this saves them time and effort while their account remains accessible and secure.

## Provide Enterprises with Centralized Oversight

Enterprise customers need to maintain control of their many employees' login access. They want a secure, central place to manage user identity, and often want the benefits of [Single Sign-On (SSO)](https://auth0.com/learn/how-to-implement-single-sign-on/) as well.

They also need you to be able to comply with whatever their given enterprise connection is, whether that's AD, LDAP, ADFS, SAML, Ping, or Google Apps. These connections can be difficult and time-consuming to implement, and that's _without_ looking at getting everything up to specific industry standards.

If identity isn't part of your core business, scaling up to support enterprise authentication only serves to take attention away from what you do best.

In this case, enterprise federation is the best approach for enterprises. Scaling up to an enterprise platform is quick and easy to set up with an [IAM (Identity and Access Management) solution like Auth0](https://auth0.com). Once up and running, it's easy to choose who will manage and monitor access based on identity, add and remove users, manage login requirements, and run any necessary analytics.

From the Auth0 dashboard, go to Connections > Enterprise to view available connections or to create new ones.

![Auth0 enterprise connections dashboard](https://cdn.auth0.com/blog/userpass/auth0-enterprise.png)

With this platform, enterprises can monitor user accounts from one central dashboard.

## Make Security a Top Priority

Both users and enterprises want secure logins. Users expect a certain level of protection from the sites they access and enterprises want to secure their internal data. Unfortunately, simply relying on the username and password approach might not get you very far.

Just look at companies like [LinkedIn](http://fortune.com/2016/05/18/linkedin-data-breach-email-password/) and [Yahoo](https://auth0.com/blog/yahoo-confirms-data-breach-of-half-a-billion-user-accounts/). They are some of the largest companies out there, but were still susceptible to data breaches. User data was easily accessed by hackers due to inadequate security parameters.

That's why modern authentication is so important. Instead of building a system from scratch, you can access ready-made platforms that provide encryption, brute force protection, constant monitoring for attacks, and the ability to promptly notify users.

With Auth0's approach to modern authentication, we take away the need for in-house custom builds that don't meet compliance standards.

For example, as part of a suite of [security features](https://auth0.com/security), Auth0 offers anomaly detection to fight against brute force attacks. If suspicious activity is detected, users are notified immediately. All of Auth0's automated blocking features are built with resilience in mind.

Another important security feature is credential and user login monitoring.

![Auth0 log tracking](https://cdn.auth0.com/blog/userpass/auth0-logs.png)

From the dashboard, you can easily track logs and be confident in knowing that security compliance and regulations are automatically taken into consideration and deployed across your site.

## Moving Forward with Modern Authentication

Now more than ever, authentication involves more than just supporting usernames and passwords. Modern authentication puts the emphasis on creating and protecting identity for users, whether they're an individual using an app or enterprise employees.

Usernames and passwords aren't going to disappear, but authentication is complex, and it's only going to get harder to manage.

There's no need to struggle to keep up using in-house solutions when you can rely on experts that live and breathe identity management. Your IAM solution can support everything you want to offer your users, while letting you focus on the product that got users to sign up in the first place.

## Aside: Securing Applications with Auth0

Are you building a [B2C](https://auth0.com/b2c-customer-identity-management), [B2B](https://auth0.com/b2b-enterprise-identity-management), or [B2E](https://auth0.com/b2e-identity-management-for-employees) tool? Auth0, can help you focus on what matters the most to you, the special features of your product. [Auth0](https://auth0.com/) can improve your product's security with state-of-the-art features like [passwordless](https://auth0.com/passwordless), [breached password surveillance](https://auth0.com/breached-passwords), and [multifactor authentication](https://auth0.com/multifactor-authentication).

[We offer a generous **free tier**](https://auth0.com/pricing) so you can get started with modern authentication.
