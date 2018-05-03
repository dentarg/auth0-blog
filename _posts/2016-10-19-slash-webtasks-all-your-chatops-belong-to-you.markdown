---
layout: post_extend
title: "Slash Webtasks - All your ChatOps are belong to you"
description: Introducing Slash Webtask, an amazingly simple new way to author custom Slack commands using Webtask right from within Slack. Nothing to deploy, nothing to build. All you need is code!
date: 2016-10-19 8:30
category: Announcement, Feature, Tools
canonical_url: true
author:
  name: Glenn Block
  url: https://twitter.com/gblock
  mail: glenn@auth0.com
  avatar: https://cdn.auth0.com/blog/profiles/glennblock.jpg
design:
  bg_color: "#222228"
  image: https://cdn.auth0.com/blog/slash-webtask-all-your-chatops-are-belong-to-you/logo-webtask-slack.png
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
---
At [Auth0](https://auth0.com/) we live and breathe devops, and one thing we've been really amped over is ChatOps. We're deploying servers globally right from [Slack](https://slack.com/), we're monitoring our infrastucture in Slack, and hey we've even integrated many of our SAAS / LOB systems in Slack.

Up until now, doing that has been quite a bit of work as you generally end up building custom bots, or building custom commands. In either case you have to package it up, deploy and host. Tools like [Hubot](https://github.com/github/hubot) go a long way to make the authoring easier, but you still have to stand up a server, configure it, etc.

_But what if you didnt?_

![Slash Webtasks](https://cdn.auth0.com/blog/slash-webtask-all-your-chatops-are-belong-to-us/allyourbase2.jpg)

## Slash Webtasks!

<script src="//fast.wistia.com/embed/medias/dh3jt3ras7.jsonp" async></script><script src="//fast.wistia.com/assets/external/E-v1.js" async></script><div class="wistia_responsive_padding" style="padding:56.25% 0 0 0;position:relative;"><div class="wistia_responsive_wrapper" style="height:100%;left:0;position:absolute;top:0;width:100%;"><div class="wistia_embed wistia_async_dh3jt3ras7 videoFoam=true" style="height:100%;width:100%">&nbsp;</div></div></div>

Today we're announcing [Slash Webtasks](https://webtask.io/slack), custom Slack commands authored as Webtasks. Nothing to package up, nothing to deploy. Install the new Slash Webtasks Slack Extension and you can start creating new Slack commands _right from within Slack_.

We're bringing our existing easy to use *wt-cli* command experience right into the Slack environment in a new and powerful way with a generic */wt* slash command. You can use */wt create* right in Slack to create a new task and then edit it immediately using our rich web-based editor.

![Editor](https://cdn.auth0.com/blog/slash-webtask-all-your-chatops-are-belong-to-you/editornew.png)

Once your task is authored, then you and the rest of your team can use it right from Slack using */wt [cmd]*. It is that easy.

Your teams can immediately start creating commands. Internally once we unleashed Slash Webtasks on Auth0, this is exactly what happened.

## How we're using Slash Webtasks at Auth0

One of the first tasks that showed up was "/wt status" which allows our teams to monitor the status of our Webtask clusters. That command was followed by an influx of new commands coming from all over our organization, such as a command to search our Data Warehouse for leads information, a command to wakeup another user in Slack, and most importantly a command to comically slap that annoying co-worker with a virtual trout. :-)

Everyone is jazzed now about building their own commands!

Below you can see the new commands in action, while Matias and I do some obviously cheeky improv.

<video autoplay loop width="600">
    <source src="https://embed-ssl.wistia.com/deliveries/b4e2914a1130d46053a973d6d9b6672374beb9f8/wt-slash-slack-statuslead.mp4"/>
</video>

## Getting started

Slash Webtasks are really easy to get going with and author. Head over to our landing [page](https://webtask.io/slack), install our new Slack app, and you can get started.

## All your ChatOps belong to YOU

Slash Webtasks dramatically reduce the cost of building new Slack commands. Start taking advantage of a really low friction way to do chatops NOW, powered by Webtask. We're excited to see what you are going to build!

Let us know about your experience. And if you like what you see, we're on [Product Hunt](https://www.producthunt.com/tech/slash-webtask), show us some love!
