---
layout: post
title: "How to Build Documentation That Will Drive Sales"
description: "Your API documentation can make or break a sale. Learn how to unleash its full potential."
date: 2017-07-12 8:30
category: Growth, Industries, Retail
author:
  name: Diego Poza
  url: https://twitter.com/diegopoza
  avatar: https://avatars3.githubusercontent.com/u/604869?v=3&s=200
  mail: diego.poza@auth0.com
design:
  bg_color: "#657A4F"
  image: https://cdn.auth0.com/blog/salesdocumentation/logo.png
tags:
- retail
- security
- retail
- customer
- vision
- auth0
related:
- 2017-06-19-how-to-keep-up-with-hyperconnected-consumers
- 2016-04-18-progressive-profiling
- 2017-05-26-go-beyond-username-password-with-modern-auth
---

The whole point of APIs is to save developers time.

Developers don't need to reinvent the wheel on mapping, or payments, or secure authentication because they can just plug into APIs that will take care of all of these issues.

To sell your API, you need to prove that it is the amazing shortcut developers have been looking for.

When your API's documentation is clunky, slow, and difficult to use, it's going to be hard to make that narrative work. There are a lot of APIs out there, not giving your users a clear path to what they want is a good way to drive them elsewhere.

Instead, imagine your documentation as a sales team. What would you want your sales team to do? Attract developers, make them understand why your API is so helpful, and provide them with straightforward, continuous, personalized customer support.

Documentation can perform all these tasks. Great documentation can quickly immerse developers in your product and provide them with simple, customized content from wherever they want.

## Get users into a demo quickly

Your API's documentation is competing for people's attention with everything else that's out there, Snapchat, The New York Times, iMessage, sleep which means it needs to make an impression fast. In under 15 seconds to be exact, according to [Chartbeat](http://time.com/12933/what-you-think-you-know-about-the-web-is-wrong/).

One way to do this is to get a developer playing around with your API before those 15 seconds are up.


[Stripe](https://stripe.com/docs) is a great example of an API that gets users trying out the product quickly. Right as you open their documentation, you see a 6 step demo that walks you through how Stripe creates and charges customers.

![Stripe docs trialbox](https://cdn.auth0.com/blog/documentation/stripedocstrialbox.png)

It takes about 3 seconds to get through step 1, which is just clicking a “Submit” button. This short first step is key as users are actively playing with the API before they can lose interest. Before those 15 seconds are up, they already have a great preview of the value the API can add to their app. By the end of the demo, they've seen how easy it is to add a new credit card, associate that card with a unique customer, and charge that customer. They even know how to set up recurring charges and subscribe the customer to a new payment plan.

Once the demo is completed, links pop up to take users to more detailed pages. These pages are more likely to be read by developers who have already experienced the worth of your API and want to learn more.

You have very little time to excite users and explain your product—so get them into a demo fast.

## Make it easy to understand

If developers find your documentation confusing, they won't stick around. No one wants to bother with an API they can't understand.

You could and should try out stylistic changes and test which creates the best pathway to understanding. However, at the end of the day you're going to come down to one issue—you wrote this, not the user. Why not reduce that imbalance?

Substituting user-created values for your own whenever possible helps the users truly understand what your API is doing.

Consider [Airtable's API documentation](http://airtable.com/api), which is customized specifically for the Airtable database already created by the user. You don't see generic field names or example values, you see the entries that you actually interact with in Airtable every day. Rather than “Field 2” you see “Assignee.” Rather than “task11” you see “Fix lion cage.” It makes the API immediately familiar and easy to get started using.

![Airtable API documentation](https://cdn.auth0.com/blog/documentation/Airtable_API_-_Theme_Park_Projects_and_How_to_Build_Documentation_That_Will_Drive_Sales-2.png)

Customizing the documentation for each user reduces confusion. What could be easier for a developer to understand than their own variables? If developers can easily understand your API's requests and responses they can get a better view of its value.

## Embed documentation everywhere

A developer who has already logged into your site is serious about trying your API. The last thing you want to do is remove them from this process by taking them back to your public page to view the documentation.

However, people will want to access your documentation from everywhere: your public page, logged in, Github, etc. You want it to be seamlessly available in all these places at once.

You could just have your documentation embedded on one page and link the user from place to place. However, every time you link a user out of the site they're in, they become less likely to go back.

If you're serious about accessibility and reducing friction for developers, embed your documentation everywhere. Of course you're not expected to actually write multiple copies. Rather, create your documentation in Markdown on Github. Then you can embed it anywhere using the wiki system Markdocs. That way, users can directly access your documentation from everywhere.

Creating your documentation in Markdown also lets you tailor it to different groups. Libraries like Lodash can be used to integrate user details into how the documentation is displayed. In your documentation, include “if” statements to reduce the amount of unnecessary information a user sees.

For example, the two images below are from the same page of Auth0 documentation. There are two distinct steps numbered 4, and Lodash is used to display one or the other based on whether or not the user has indicated that they would call a third party API or their own API. Thus, the developer does not have to waste time trying to find relevant information.

![Third Party API](https://cdn.auth0.com/blog/documentation/3rdpartyapiarrow.png)

![Third Party API - Lower section](https://cdn.auth0.com/blog/documentation/yourapiarrow.png)

Don't put any roadblocks in your user's way. Every piece of extraneous information, every link is a point where the user might reassess their focus on your product.

Let developers see what they want, where they want. Putting your documentation everywhere allows you to keep users engaged rather than taking them away.

## Offer customized sample projects

We learn best through [experiential learning](https://blog.readme.io/the-most-effective-api-quickstarts-in-8-examples/), so having a developer engage with a sample project is an excellent way to get them hooked.

Sample projects are now expected, but *customized* sample projects can really make your documentation accessible. The closer a sample project is to what would actually be purchased, the more likely a developer is to like it and buy it.

At [Auth0](https://auth0.com/docs), we have sample projects available for dozens of different front and back-end languages, each of which is fully customized with a user's API keys when downloaded.

![Auth0 documentation page](https://cdn.auth0.com/blog/documentation/auth0doc.png)

All of the necessary configurations are already done, the user gets a fully personalized README to work through, and they're spared all of the tedious setup usually involved in trying a new product. A developer should leave your documentation knowing how their app would function with your API and thinking, “that was easy.” That is what customized sample projects will get you.

## Stop wasting developers' time

Developers rely on APIs to reduce their workload, so use your documentation to reduce it as much as possible. Minimize the number of clicks and scrolls it takes to get someone playing with your product. Don't make it overly complicated. And customize it to their needs to the best of your abilities.

Documentation is a reflection of your API. If your documentation is quick, simple, and personalized it says your API will be too, and thus worth buying.

To learn more about creating great documentation, [check out my talk](https://www.youtube.com/watch?v=lw9R2qMCdqk) from the Forward 2 Web Summit.