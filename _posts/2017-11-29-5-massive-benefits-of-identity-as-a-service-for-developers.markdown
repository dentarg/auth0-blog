---
layout: post
title: "5 Massive Benefits Of Identity As A Service For Developers"
description: "Identity as a service provides lots of benefits for companies and developers looking to iterate quickly. Focus on building customer value not authentication."
date: 2017-11-29 16:55
category: Growth, Identity, Auth0
is_non-tech: true
author: 
  name: Kyle Galbraith
  url: https://twitter.com/kylegalbraith
  mail: kyle.galbraith459@gmail.com
  avatar: https://secure.gravatar.com/avatar/605c451dd844eedb6b4b3f1e8619280b
design: 
  bg_color: "#312E87"
  image: https://cdn.auth0.com/blog/idaas-benefits/logo.png
tags:
- identity
- user
- management
- service
- auth0
---
The old adage goes, “don’t reinvent the wheel”. We say this over and over again as developers. Yet we are often sucked down rabbit trails where we end up doing the one thing we don’t want to do: reinventing the wheel.

Encryption is the textbook example used when we say “don’t roll your own”. Hundreds of researchers with very long names prefixed with a Ph.D. have already analyzed it. They test and verify different encryption algorithms. We trust these people because, quite frankly, encryption is hard. It is one of the higher risk things a developer can do. So we don’t roll our own encryption algorithms because it’s error-prone, we’re not experts in it, and we would rather not risk screwing it up.

The same is true for authentication and obtaining users identity in an application. It is hard, error-prone, and the risk is very high.
Yet, many developers, entrepreneurs, and indie hackers implement their own authentication flow. This shocks me. Why are you creating your own ad-hoc identity service when there are lots of better options? To be fair, some are using built-in frameworks for authentication which is less sinister than truly rolling your own. Even then you have to store user identity information often in your own databases.

Did you hear that? It’s the door of uncertainty, pending failure, and errors opening right back up.

{% include tweet_quote.html quote_text="Doing authentication correctly is as hard, error-prone, and risky as rolling your own encryption." %}

There are tools and services that exist right now that can cut your risk. They can reduce your error rate, and ease your anxiety overnight.

## Enter Identity as a Service
Where there are hard problems there is often someone that has already done it.

In this case, there are many Identity as a Service providers out there today. They aim to help developers solve the problem of authentication for their applications. Not by rolling their own but by abstracting it away. Developers no longer need to be responsible for developing their own identity service. The identity service manages authentication and the complexity associated.

[Auth0](https://auth0.com) is one of these providers. They offer identity as a service to you the developer. Users log in via your Auth0 client, land back at your application, and you now have an authenticated user that can use your application.

In this post, I am going to cover 5 benefits to leveraging Auth0 instead of rolling your own authentication service.

## Benefit 1: Decentralizing Identity from Applications
When a user goes to use your application what are some things you care about? It’s an important question and one you should think about. To simplify, the one thing every application developer cares about is that the user is associated with an identity.

Why the simplification? Because at the basic level you only want authorized users to use your application. In other words, if they are who they say they are and that identity can access the system, let them access the system.

This is a nice benefit of identity as a service like Auth0. It allows you to decentralize the identity from the application. A few benefits the developer gains from this are:

* No longer having to store user identity information in their own databases. If you don't need the user's password, then why have the overhead of storing it?

* The identity of a user is completely separate from an application. Done right, the only thing a developer will care about is a unique identifier. Nothing more.

* All the non-feature work like user CRUD, password CRUD, etc. goes away. That is all managed by the identity service.

Developers can focus on business value by moving identity and authentication to an external service. The user gains from the extra separation of concerns. Then the application can rely on a few bits of identity and nothing else. Wins all around.

## Benefit 2: Streamlined External Authentication
How much fun is it to configure Google authentication for an application? I would argue not the most fun thing to spend a few hours of my life on.

With a service like Auth0, I can enable this for my users with a few clicks of a button via their [extensive identity providers](https://auth0.com/docs/identityproviders).

Remember, application developers only care that the user is who they say they are. Remove the need for passwords at all by using external providers like Google or Facebook. By toggling the connection on users can leverage that connection to login if they choose. The key is that the user now gets to choose how they want to provide their identity, not the developer.

## Benefit 3: Ready to Go Authentication UI
As a developer, I would be alright with never having to have a username/password form on a website I maintain. Not that I mind the responsibility, but I would rather delegate that to a team that focuses on that. Provide me the ability to customize it so that it can match the “feel” of my application and I am good to go from there.

Spoiler alert, identity as a service often provides this ability as well. Auth0 offers a [hosted login page](https://auth0.com/docs/hosted-pages/login) that you can customize to match your “feel”. This makes it easy to have an authentication and sign up flow for your application in minutes.

## Benefit 4: Strong Communities
Hard problems often have communities of people that have developed best practices. These communities are great for getting help. An identity as a service provider like Auth0 has dozens of [open source projects](https://github.com/auth0/). There is an open source project for about any type of application you are building.

Not sure about something? Post a question in an issue tracker and you get a reply within a few hours. Just because identity is being abstracted away from your application doesn’t mean this is “easy”. You as a developer will have questions and the open source communities help you get answers.

## Benefit 5: Low Pricing for Most Projects
Pricing based on use is a big deal when it comes to leveraging any third-party service within your application. This is largely because we as developers only want to pay for what we actually use. If we don’t need more than 7,000 active users and two social providers than we can use Auth0 for the low price of $0. Yup, zero dollars a month if your application has under 7,000 users a month based on [Auth0 pricing](https://auth0.com/pricing).

Of course, if you have a need more logins, unlimited social providers, customization, or migration strategies then there are plans for that. Most plans are fairly inexpensive and definitely worth the monthly spend when you add up the other benefits. Often times for me I can leverage the free tier for most applications as I don’t need a lot of other bells and whistles. If you are working on enterprise applications than of course you want to reach out to the identity service.

## Conclusion
Is authentication a core business value for your product or service? Is it why your market is purchasing your product or service? Typically, the answer is no. But it is important and you can’t screw it up because then you're **out of business**. As a developer, you must take user authentication serious at all times.

Identity as a service provides developers with users identity. An identity without the code, risk, and tech debt that comes from doing it yourself. 

{% include tweet_quote.html quote_text="Now development can focus on building business value features instead of authentication." %}

User information is external from the application and developers. Remove all the code associated with login, resetting passwords, etc.

Moving your users' identity to a service that focuses on that is an all-around good idea. This doesn’t mean you are not accountable for the authentication of your application. You still are, but it becomes much simpler and far harder to screw up.

### More from Kyle Galbraith
I have begun putting a book together that focuses on learning AWS by actually using it. Instead of getting lost in the documentation, focus on a problem and learn the services that help you solve it as you are using them. If you are interested in learning more about AWS, sign up to stay updated on the progress of the book [Learning AWS By Using It](https://www.kylegalbraith.com/learn-aws).






