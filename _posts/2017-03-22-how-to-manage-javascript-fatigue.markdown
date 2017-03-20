---
layout: post
title: "How to Manage JavaScript Fatigue"
description: "Many developers are overwhelmed by the rapidly expanding ecosystem of modern JavaScript. Learn how to manage and mitigate JS fatigue."
date: 2017-03-22 8:30
category: Growth, Generic
banner:
  text: "Auth0 makes it easy to add authentication to your JS application."
author:
  name: "Kim Maida"
  url: "https://twitter.com/KimMaida"
  mail: "kim.maida@auth0.com"
  avatar: "https://en.gravatar.com/userimage/20807150/4c9e5bd34750ec1dcedd71cb40b4a9ba.png"
design:
  image: https://cdn.auth0.com/blog/js-fatigue/JSLogo.png
  bg_color: "#222228"
tags:
- javascript-fatigue
- javascript
- tooling
related:
- 2017-02-10-glossary-of-modern-javascript-concepts
- 2016-10-07-managing-tech-job-stress-when-9-5-is-unrealistic
---

**TL;DR:** Most JavaScript developers have heard of or experienced JavaScript fatigue. JS fatigue is the overwhelming sense that we need to learn most of the hottest emerging technologies in order to do our jobs well. This is unattainable and the stress we feel to achieve it is unjustified; so how do we manage and combat JavaScript fatigue?

---

![JavaScript fatigue comic](https://cdn.auth0.com/blog/js-fatigue/comic.png)

## What is JavaScript Fatigue?

Putting satire aside, _JavaScript fatigue_ is on a lot of developers' tongues and blogs recently, and with valid reason. But what does it mean to have JS fatigue? It's often mentioned when someone hears about a new library, framework, dependency manager, build tool, etc. Let's do a quick breakdown of what JS fatigue means.

### JS Fatigue vs. Analysis Paralysis

JS fatigue is often linked with [analysis paralysis](https://en.wikipedia.org/wiki/Analysis_paralysis) (also called _choice paralysis_). JS analysis paralysis can occur because of the huge range of options when selecting a framework, tooling, testing suites, and more for a new application. Choosing the right framework or library can be challenging and occasionally even paralyzing, but having a wealth of tools at our disposal allows us to be more selective about what's best for the job at hand. In some cases, options help us to _avoid_ fatigue by supplying an ideal solution for a specific project.

### What it Means to Have JS Fatigue

We get JS fatigue when the requirements (either actual or self-imposed) for learning something are so daunting that a developer becomes exhausted and overwhelmed.

JS fatigue can refer to:

* the fear that we'll fall behind or become obsolete if we don't know and use the newest, hottest tools;
* the sense that we never become experts in anything because everything changes too quickly and the tools we're trying to learn are already being replaced;
* picking up a new framework and then becoming overwhelmed thinking we need to master everything in the toolchain in order to use it;
* the fear that we'll pick a tool that will get displaced, resulting in a lack of support and obsolete resources;
* frustration with a lack of user empathy when consulting documentation or resources while trying to learn a new framework or toolchain.

## JavaScript's Astonishing Growth Rate

In a nutshell, JS fatigue has become a phenomenon because the JS landscape is ever-changing. Various build tools, transpilers, and syntax additions are considered par for the course. There are even [dozens of _entire languages_ that compile to JS](https://github.com/jashkenas/coffeescript/wiki/list-of-languages-that-compile-to-js).

The exponential and unslowed growth of JS has opened the doors for great tools, languages, and frameworks. However, this also promotes change so rapid it can make any developer's head spin. [The Deep Roots of Javascript Fatigue](https://segment.com/blog/the-deep-roots-of-js-fatigue/) delves into the history of JS and its swift evolution over a short amount of time. It's a great read and highly recommended.

Only a few years ago, most programmers considered _front-end development_ to consist primarily of HTML, CSS, and UI-enhancing JavaScript (such as jQuery). Since then, JS alone has proliferated into [isomorphic JS](http://isomorphic.net/javascript), [functional reactive programming](https://auth0.com/blog/glossary-of-modern-javascript-concepts/#functional-reactive-programming) [in](https://www.sitepoint.com/functional-reactive-programming-rxjs/) [JS](https://www.infoq.com/articles/virtual-panel-reactive-javascript-and-elm-in-2016), [frameworks, libraries, build](https://medium.com/javascript-scene/top-javascript-frameworks-topics-to-learn-in-2017-700a397b711#.fuxwtb909) [tools, package managers, and much more](http://stackoverflow.com/questions/35062852/npm-vs-bower-vs-browserify-vs-gulp-vs-grunt-vs-webpack). We used to refer to "front-end" wholistically as all client-side development, but JS has evolved to support a specialization: _JavaScript developers_.

## How to Manage JS Fatigue

At this time, JS proliferation is _not_ showing signs of slowing. JS fatigue doesn't have a magic bullet cure, but there are things we can do to manage and also mitigate it. **The following tips are useful for overwhelmed new developers as well as experienced, fatigued JS engineers.**

### Pick Your Battles

The first thing to focus on is picking your battles. We get easily overwhelmed trying to follow every hot new thing that emerges. **It's good to be _aware_ of the sea of new technologies, but not to drown in it.** If something starts to come up a lot, read a little about it. You'll want to know just enough to answer the following:

1. What is its primary purpose?
2. Is it popular enough to have a stable, growing community and easily accessible support? (Who is behind it? Who is using it?)
3. Does it _solve_ a problem I frequently run into with my current tools?

If #1 isn't practical for your use case and the answers to #2 and #3 are not both _yes_, don't expend precious time and effort learning this if you're already fatigued. **It can be best to wait and see, or to take a pass on tools that don't serve your goals.** [Make peace with your focus](https://medium.com/javascript-scene/why-im-thankful-for-js-fatigue-i-know-you-re-sick-of-those-words-but-this-is-different-296fae0c888f#.h81mamgiv) and remember that _no_ JS developer is an expert in every new tool that lands.

{% include tweet_quote.html quote_text="Pick your battles: It can be best to wait and see, or to take a pass on tools that don't serve your goals." %}

In fact, it can make us _better developers_ to know when to be okay with _not_ learning some new tool. You may have heard the expression "[Jack of all trades, master of none](https://en.wikipedia.org/wiki/Jack_of_all_trades,_master_of_none)", which implies superficial knowledge in many things but expertise in none of them. Remember that **you're _not_ obligated to learn everything** and you can excel at your craft without jumping on every bandwagon that rolls up to the curb.

On the other hand, **if a tool has gained critical mass _and_ will help you solve a problem you're having, it's worth further exploration**. Don't feel like you have to commit to learning it right away, but it might help to find out a little more and keep an eye on it.

{% include tweet_quote.html quote_text="Pick your battles: if a tool has gained critical mass and helps you solve a problem, it's worth exploration." %}

### Make Something Interesting / Useful

For many developers, there are two primary ways we learn something new in a short amount of time:

1. We need to learn it in order to complete a project with predefined requirements and a deadline, or:
2. We build something on our own that we're interested in.

Learning anything can be arduous and tedious if we don't have a clear view of the end result or real-world practicality. On the same token, **learning is much more gratifying when we're building something interesting or useful**.

One good way to learn new tools and frameworks is to make the same thing (something useful that you like) using different tools.  This [shouldn't be the ubiquitious and tiresome TODO app](https://hackernoon.com/cure-for-js-fatigue-build-something-more-interesting-afaf74b95682#.bi5mnqt96). It should be something that covers many common features of modern applications, such as:

* Routing
* Global header and footer
* CSS framework integration
* Responsive UI and custom styles
* Global application data
* External API
* Services and utilities

This has several advantages for learning.

* **Familiarity**: knowing what you're trying to achieve and not making it up as you go along makes development more straightfoward.
* **Comparison**: rebuilding something reveals similarities and differences as well as highlights strengths and weaknesses between frameworks.
* **Iteration**: you may find that each time you go through this exercise, you see things you can refine and improve.

It's important to maintain a high level of interest and/or usefulness with your learning app. Creating a robust starter project can help you quickly learn the ins and outs of setup and common features while providing a practical beginning point for future apps you build.

### Be Aware of Common Concepts

Even as JS grows and changes, there are always [concepts shared amongst many new frameworks and libraries](https://auth0.com/blog/glossary-of-modern-javascript-concepts/#functional-reactive-programming). It's useful to keep an eye out for these tools and topics. For example, [ES6](https://auth0.com/blog/a-rundown-of-es6-features) and [TypeScript](https://www.typescriptlang.org/) are becoming more heavily used, as well as [Webpack](https://webpack.github.io/), [functional reactive programming](https://vincenttunru.com/Javascript-reactive-programming/), and [web components](https://auth0.com/blog/web-components-how-to-craft-your-own-custom-components/). **Knowing about common dependencies makes different frameworks feel more similar.**

When you take the plunge with a new framework and toolchain, you'll learn some of the common topics. You'll be pleased to find that other modern frameworks leverage many of the same tools and concepts and are now much easier to pick up.

### Learn Iteratively

Many developers are fatigued by the fact that new frameworks have so many complex dependencies that it takes weeks to set up a new app. Don't be afraid to use tools if they help. If a CLI is available or the community offers starter projects, take advantage of them. **Getting off the ground quickly allows you to focus on learning the core features and avoid getting discouraged by difficult setup.**

It's ideal to know how and why something works so it's less magical, but [that _doesn't_ mean you need to frontload that knowledge before getting started](https://medium.com/building-kwoosh/you-dont-need-more-knowledge-83c5247e8f60#.yvz0arns4). Don't worry if you find yourself picking it up along the way. When you hit a roadblock, work through it. Remember to take breaks if you get frustrated. **"Learn as you go" is a legitimate, effective method for absorbing lots of new information over time.** Once you've done the basics, the _how_ and _why_ reveal themselves, either in "Ah-ha!" moments or gradually with repeated use.

{% include tweet_quote.html quote_text="'Learn as you go' is a legitimate, effective way to absorb lots of new information over time." %}

## Aside: Use Auth0 For Authentication in JS Apps

Taking advantage of knowledge, tools, and solutions from others is extremely valuable when combating JS fatigue. Authentication can be one of the most complex, time-consuming features to build for _any_ application. Developers who are already learning a new toolchain, library, or framework can become even more overwhelmed building secure, complicated features like authentication. 

If you have a JS app that needs authentication, Auth0 can bear the load for any framework. Auth0's [Single Page Application QuickStart guides](https://auth0.com/docs/quickstart/spa) and [Auth0 SDK for Web](https://auth0.com/docs/libraries/auth0js) provide indepth documentation for robust identity and user management in JS apps. Auth0 makes authentication straightforward, greatly reducing fatigue and cognitive burden for busy developers.

Don't be hesitant to utilize the proper tools and services that will help you do your job and do it well. We're much less fatigued by new things when we have help completing difficult tasks. If authentication is one of your primary needs, you can learn more in the [Auth0 docs](https://auth0.com/docs) or [sign up for a free account here](https://auth0.com/signup).

## Conclusion

We'll finish with an analogy. If JS is the world around you, there are a few ways to view and take it in.

If you look at the JS world through a **telescope**, you can see _one thing very clearly_. However, you're essentially blind to everything _else_ around you. It's important to be comfortable with your focus, but not to the point that you shut out awareness of any other possibilities.

If you view the world as a panorama through a **wide-angle lens**, you get a vast, comprehensive picture but it's hard to know where to look. Everything in the scene competes for your attention and you can get easily distracted when trying to focus if something else catches your eye. This can be exhausting.

Now consider a normal **pair of glasses**. You can see everything more clearly, but still focus your attention on one (or a few) things without losing sight of what's in your periphery. 

When viewing the modern JavaScript landscape, glasses are a good approach. Don't feel like you have to take in all your surroundings at once, but don't blind yourself to the larger world either. Focus your time and effort on what's in front of you while surveying occasionally for potential improvements. Hopefully you'll find yourself feeling more refreshed and enthusiastic about the great things JavaScript has in store for the future.