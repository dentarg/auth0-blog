---
layout: post
title: "Slash Webtasks - All your chatops are belong to you"
description: Introducing Slash Webtask, an amazingly simple new way to author custom Slack commands using Webtask right from within Slack. Nothing to deploy, nothing to build. All you need is code!
date: 2016-10-17 18:28
category: Announcements, Features, Tools
author: 
  name: Glenn Block
  url: https://twitter.com/gblock
  mail: glenn@auth0.com
  avatar: https://cdn.auth0.com/blog/profiles/glennblock.jpg
design: 
  bg_color: "#222228"
  image: https://cdn.auth0.com/blog/slash-webtask-all-your-chatops-are-belong-to-you/logo-webtask-slack.png
tags: 
- automation
- serverless
- slack
- webtask
- devops
- chatops

related:
- 2016-09-14-build-a-serverless-slack-bot-with-webtask/
---
At [Auth0](https://auth0.com/) we live and breathe devops, and one thing we've been really gaga over is chatops. We're deploying servers globally right from [Slack](https://slack.com/), we're monitoring our infrastucture in Slack, and hey we've even integrated many of our SAAS / LOB systems in Slack. 

Up until now, doing that has been quite a bit of work as you generally end up building custom bots, or building custom commands. In either case you have to package it up, deploy and host. Tools like [Hubot](https://github.com/github/hubot) go a long way to make the authoring easier, but you still have to stand up a server, configure it, etc.

_But what if you didnt?_

![Slash Webtasks](https://cdn.auth0.com/blog/slash-webtask-all-your-chatops-are-belong-to-us/allyourbase2.jpg)

## Slash Webtasks!

Today we're announcing [Slash Webtasks](https://webtask.io/slack), custom Slack commands authored as Webtasks. Nothing to package up, nothing to deploy. Install the new Slash Webtasks Slack Extension and you can start creating new Slack commands _right from within Slack_.

We're bringing our *wt* CLI command right into the Slack environment in a new and powerful way. You can use */wt create* to create a new task and then edit it with our rich web-based editor. 

![Editor](https://cdn.auth0.com/blog/slash-webtask-all-your-chatops-are-belong-to-you/editor.png)

Once your task is authored, then you and the rest of your team can use it right from Slack using */wt [cmd]*. It is that easy.

Your teams can immediately start creating commands. Internally once we unleashed Slash Task on Auth0, this is exactly what happened. One of the first tasks that showed up was "wt status" which allows our teams to monitor the status of our Webtask clusters. You can see Matias and I using it below to try to determine if we have an outage in one of our clusters.

![wt](https://cdn.auth0.com/blog/slash-webtask-all-your-chatops-are-belong-to-you/wt_status.png)

That command was followed by an influx of new commands coming from all over our organization. Everyone is jazzed now about building their own commands!

## Getting started

Slash Webtasks are really easy to get going with and author. Head over to our landing [page](https://webtask.io/slack), install our new Slack app, and you can get started.

## All your chatops belong to YOU

Slash Webtasks dramatically reduce the cost of building new Slack commands. Start taking advantage of a really low friction way to do chatops NOW, powered by Webtask. We're excited to see what you are going to build!


