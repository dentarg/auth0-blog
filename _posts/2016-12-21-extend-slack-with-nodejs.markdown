---
layout: post_extend
title: "Extend Slack with Node.js"
description: Embrace the benefits of Slack extensibility with Slash Webtasks
date: 2016-12-21 8:46
category: Technical Guide, Serverless, Webtask
canonical_url: true
author:
  name: Tomasz Janczuk
  url: https://twitter.com/tjanczuk?lang=en
  mail: tomek@auth0.com
  avatar: https://s.gravatar.com/avatar/53f70144dc9d7c76455fa91f858d4cec?s=200
design:
  bg_color: "#222228"
  image: https://cdn.auth0.com/blog/extend-slack/logo.png
tags:
- webtask
- serverless
- faas
- slack
- devops
- chatops
related:
- 2016-09-14-build-a-serverless-slack-bot-with-webtask
- 2016-06-28-building-serverless-apps-with-webtask
- 2016-10-19-slash-webtasks-all-your-chatops-belong-to-you
---

It is 2016 and Slack is the new e-mail. For many distributed teams or companies like Auth0, Slack has become the default communication solution.

Yet the true power of Slack goes beyond communication. Slack can be extended with integrations to other systems. Being able to perform most daily tasks from within your team’s primary communication channel greatly increases productivity.

![Using Slack integrations](https://cdn.auth0.com/blog/extend-slack/slack-integrations.png)

In this post I will show how you can easily extend Slack with Node.js using [Slash Webtasks](https://webtask.io/slack?utm_source=blog&utm_medium=blog&utm_campaign=slash), a solution we have created at Auth0 that builds on the *serverless* concepts. Using this approach you can automate processes, run your devops, generate reports, and more, in a powerful yet simple and efficient way.

## Webhooks: the good parts

Slack has a rich directory of ready-made apps, but it is custom integrations that offer the ultimate flexibility in building team-specific solutions. Using the webhook model, you can extend Slack with arbitrary logic by writing custom code.

Webhooks can be exposed in the Slack interface as *slash commands* for all team members to invoke. The webhook code behind a slash command can post synchronous or asynchronous messages back to Slack, allowing for a range of useful applications. For example, system health checks…

![Health Check slash webtasks command](https://cdn.auth0.com/blog/extend-slack/system-health-checks-command.png)

…or on-demand reporting of your KPIs, whatever they may be:

![Signup report slash webtasks command](https://cdn.auth0.com/blog/extend-slack/signup-report-command.png)


Developers love webhooks because of the flexibility they offer. Once you can write custom code, only imagination limits what you can accomplish. Plus, writing code is fun.

But…

## Webhooks: the bad parts

Flexibility of the webhook model comes with strings attached. Once the code is written, turning it into an endpoint requires finding a place to host it, ensuring security, monitoring, planning for scaling, availability, etc. In other words, it requires you to run a service. Developers typically utilize hosting solutions like Heroku, AWS, or Windows Azure to set up and maintain a service behind the webhook.

Due to this added cost, some Slack extensibility ideas on your team never see the light of day. 

![Cost vs. value of implementing a feature](https://cdn.auth0.com/blog/extend-slack/cost-vs-value-of-implementing-a-feature.png)

If the perceived value of a potential Slack extension is large enough to offset the cost of setting up and running a service, it will likely be implemented. However, how many of those nice-to-have ideas did you have to forego because the benefit did not seem to justify the cost?

What if you could enable all that innovation lurking on your team and empower anyone with a great idea and ability to code to realize it at close to zero cost?

## Enter Slash Webtasks. All you need is code

What if you could just write code to extend Slack? Without worrying about servers, hosting, monitoring, scalability, etc.? What if that extension authoring experience was integrated into Slack itself?

Unhappy with how many good ideas were not realized on our team, these were some of the questions we started asking at Auth0. As a result, we’ve created [Slash Webtasks](https://webtask.io/slack?utm_source=blog&utm_medium=blog&utm_campaign=slash).

> Slash Webtasks enable you to extend Slack with Node.js. 
No servers, no hosting, just code. 

The Slash Webtask experience allows any member of a Slack team to use Node.js to create and run a new Slack extension from within Slack itself:

<iframe src="https://player.vimeo.com/video/192038965" width="640" height="497" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

Slash Webtasks enable you to go directly from a great idea to writing code and running it, cutting out the layer of concerns related to operating a service.

Once we rolled out Slash Webtasks in our own Slack team at Auth0, it generated an explosion of new applications and a lot of excitement.

![Cost Value of implementing a feature improved](https://cdn.auth0.com/blog/extend-slack/cost-value-of-implementing-a-feature-improved.png)

All the nice-to-have ideas people had to suppress due to cost considerations before finally found an easy outlet.

You can install Slash Webtasks on your own Slack team from [webtask.io](https://webtask.io/slack).

## All the Slack extensibility are belong to you

What have people at Auth0 done with the newfound powers?

We have seen a number of data-reporting extensions created that present real-time KPIs, or allow access to tailored reports from our Redshift data warehouse in AWS. For example, one extension generates a summary report of key information we have about a potential customer that informs our marketing and sales activities.

![Finding a lead slash webtasks command](https://cdn.auth0.com/blog/extend-slack/finding-a-lead-command.png)

Many extensions that help in devops and operations sprang up as well. We can now quickly find out what the current health status of all systems is:

![Alerts slash webtasks command](https://cdn.auth0.com/blog/extend-slack/alerts-command.png)


If systems are on fire and we need to bring a specific set of people to fix the problem, we can now send them an SMS message right from Slack. This Slash Webtask uses Twilio to send texts to phone numbers associated with a specific team, a redirection that allows us to easily implement servicing rotations:

![Wakeup slash webtasks command](https://cdn.auth0.com/blog/extend-slack/wakeup-command.png)

(And no, the *wakeup* name is not a joke. We mean business when this is used.)

In addition to reducing the cost of creating extensions that are critical to our operations, several nice-to-have ideas were also quickly implemented. For example, one can now add new product ideas to Product Board without ever leaving the Slack environment:

![Idea slash webtasks command](https://cdn.auth0.com/blog/extend-slack/add-idea-command.png)

You can see how this approach could be used to file GitHub or Pivotal issues as well.

Lastly, the technology enabled creation of a few lighthearted extensions that don’t directly support our core business but help nurture Auth0 culture and make Auth0 a great place to work. Since emoticons are so 2015 and by now we’ve used up all of them, we’ve devised a way to express one’s feelings in a more dynamic way in the midst of a Slack discussion:

![Slap slash webtask command](https://cdn.auth0.com/blog/extend-slack/slap-command.png)

The bottom line is that Slash Webtasks allowed us to greatly reduce the friction and cost of turning an idea into reality. All you need is code.

## Who killed the server: inside Slash Webtasks

Spoiler alert: it wasn’t the butler. Slash Webtasks are running on top of the [Auth0 Webtask](https://webtask.io/?utm_source=blog&utm_medium=blog&utm_campaign=slash) technology which provides the necessary computation and isolation primitives to securely execute custom Node.js code in a multi-tenant environment like the Slack platform.

Auth0 Webtasks were created to support extensibility of the [Auth0 identity platform](https://auth0.com/?utm_source=blog&utm_medium=blog&utm_campaign=slash) through custom code, and have been deployed and operated at scale since 2014. While the technology existed before serverless was a word, it embodies many of the same principles. The essence of the webtask platform is to make development focused primarily on writing code, rather than making servers a first class concept. The [What is serverless](https://auth0.com/blog/what-is-serverless/?utm_source=medium&utm_medium=blog&utm_campaign=slash) post describes these principles in more detail.

While dogfooding the webtask technology at Auth0, we realized its applicability goes well beyond our internal use case. Specifically, webtasks are [a great fit for any platform which uses webhooks as the extensibility mechanism](https://tomasz.janczuk.org/2015/07/extensibility-through-http-with-webtasks.html). Slash Webtasks build on top of that concept by embracing Slack’s webhook-based extensibility model.

When you [install Slash Webtasks](https://webtask.io/slack?utm_source=blog&utm_medium=blog&utm_campaign=slash) app in your Slack team, a new /wt slash command is created within your team. It is associated with a single, global webhook endpoint. All requests from any of the teams that chose to install Slash Webtasks are processed by that single endpoint. The implementation of that endpoint is a webtask itself. However, this is merely an illustration of the [Law of the Instrument](https://en.wikipedia.org/wiki/Law_of_the_instrument) rather than a critical aspect of the design.

The */wt*wt- slash command serves two purposes. First, it exposes a set of sub-commands that act as a management interface for creating, editing, listing, and removing individual extensions. Second, it acts as a proxy for executing the extensions.

![The wt slash webtasks command](https://cdn.auth0.com/blog/extend-slack/wt-command.png)

Several named Slash Webtask extensions can be created within a Slack team. Each of them is implemented as an individual webtask — a Node.js function that accepts Slack’s webhook payload on input and must respond with JSON payload that Slack expects. These webtasks are authored within the Webtask Editor which is an integral part of the Auth0 Webtask platform.

![Webtask Editor](https://cdn.auth0.com/blog/extend-slack/webtask-editor.png)

In addition to writing code, the Webtask Editor also allows you to specify secrets that the code will be provided with at runtime (via the *ctx.secrets* parameter). This gives you a very convenient way to pass API keys and other credentials (e.g. Twilio API key, MongoDB URL) into your webtask code without having to embed them in code or rely on external services. This is all part of the Auth0 Webtask platform itself, not specific to Slash Webtasks.

Once a Slash Webtask extension is created, it can be executed by anyone on the team using the */wt* slash command. At this point the webhook behind the */wt* command acts as a proxy. The individual Slash Webtask extensions are executed in isolated environments to ensure they do not affect each other’s execution within a team, and that Slash Webtasks of different Slack teams are completely isolated from one another. This isolation is achieved by running each Slash Webtask extension in its own *webtask container*. A webtask container is a fundamental isolation concept supported by the Auth0 Webtask platform: two webtasks running in *different* webtask containers are *guaranteed* to be isolated from one another in terms of memory, network, disk, and CPU. How this isolation is implemented within Auth0 Webtasks is a topic for another post.

So it was not the butler who killed the server. It was Auth0 scratching its own extensibility itch with webtasks, and then applying the battle-tested technology to the extensibility of the Slack platform. 

## Where do you go from here?
You go to https://webtask.io/slack and install Slash Webtasks in your own Slack team.

Slash Webtasks helped us fully embrace the benefits of Slack extensibility in driving our business at Auth0, and we hope you will realize similar benefits. 
