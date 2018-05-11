---
layout: post
title: "Google I/O 2018 Summary - Day 3"
description: "Check out our summary of the Google I/O Conference 2018, Day 3."
longdescription: "The third and final day of the Google I/O 18 consisted of several talks including Node.js, Serverless deployment, Polymer, Chrome Dev Tools, Flutter and Artificial Intelligence."
date: 2018-05-11 08:30
category: Technical Guide, Conferences, Google I/O
author:
  name: "Prosper Otemuyiwa"
  url: "https://twitter.com/unicodeveloper"
  mail: "prosper.otemuyiwa@auth0.com"
  avatar: "https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200"
design:
  bg_color: "#334192"
  image: "https://cdn.auth0.com/blog/google-io-summary/logo.png"
tags:
- conference
- googleio
- io18
- googleio18
- google
- google-io
- io
related:
- 2018-05-09-googleio-summary-day-one
- 2018-05-10-googleio-summary-day-two
- 2016-11-15-chromedevsummit-summary

---

The final day of Google I/O 18 consisted of a few talks including Node.js, Serverless deployment, Tensorflow, Android Security, etc.

Let's get started. 

## Deploying Serverless Node.js microservices

[Myles Borins](https://twitter.com/MylesBorins) and [Steren Giannini](https://twitter.com/steren) gave a talk on _Deploying Serverless Node.js microservices_.

They announced that in a couple of weeks, Node.js will start running on Google AppEngine. Developers would be able to deploy a Node.js app easily to Google Cloud. 

The Node.js app would simply have an _app.yaml_ file that specifies the runtime. And then the developer can run `gcloud app deploy`. That's it!

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">In a few weeks, Node.js will now run on AppEngine Standard. 👌<br><br>All it will take to have your node apps be deployed on AppEngine Standard <a href="https://twitter.com/hashtag/io18?src=hash&amp;ref_src=twsrc%5Etfw">#io18</a> 🔥 <a href="https://t.co/oNPEvIZjEF">pic.twitter.com/oNPEvIZjEF</a></p>&mdash; Prosper @ Google I/O 18 🔥🚀 (@unicodeveloper) <a href="https://twitter.com/unicodeveloper/status/994709191905308679?ref_src=twsrc%5Etfw">May 10, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Node.js deployment process on AppEngine <a href="https://twitter.com/hashtag/io18?src=hash&amp;ref_src=twsrc%5Etfw">#io18</a> <a href="https://t.co/TyCSbUFpLT">pic.twitter.com/TyCSbUFpLT</a></p>&mdash; Prosper @ Google I/O 18 🔥🚀 (@unicodeveloper) <a href="https://twitter.com/unicodeveloper/status/994710527518502913?ref_src=twsrc%5Etfw">May 10, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## TensorFlow without a PhD

This talk gave techniques about deep reinforcement learning with TensorFlow. There was a demo of a pong game driven by Neural network. There was also a demo of an animation character that learned how to move and jump via machine learning exposed by TensorFlow.

Check out the demo below:

<blockquote class="twitter-tweet" data-lang="en"><p lang="fr" dir="ltr">TensorFlow. Artificial Intelligence <a href="https://twitter.com/hashtag/io18?src=hash&amp;ref_src=twsrc%5Etfw">#io18</a> <a href="https://t.co/uCVC9IdshI">pic.twitter.com/uCVC9IdshI</a></p>&mdash; Prosper @ Google I/O 18 🔥🚀 (@unicodeveloper) <a href="https://twitter.com/unicodeveloper/status/994654638816223232?ref_src=twsrc%5Etfw">May 10, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

The tools for the demo include:

* TensorFlow for the models
* Google ML engine for the training
* Tensorboard Visualization Kit

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">TensorFlow without a PhD. <br><br>Get the keys to the machine learning kingdom today 🔥 <a href="https://twitter.com/hashtag/io18?src=hash&amp;ref_src=twsrc%5Etfw">#io18</a> <br><br>1. TensorFlow for the models <br>2. ML engine for the training<br>3. Tensorboard for the Visualization <a href="https://t.co/m0Q9KU3bFA">pic.twitter.com/m0Q9KU3bFA</a></p>&mdash; Prosper @ Google I/O 18 🔥🚀 (@unicodeveloper) <a href="https://twitter.com/unicodeveloper/status/994656270601760768?ref_src=twsrc%5Etfw">May 10, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## Search Friendly JavaScript-powered Websites

Several tips for building search-friendly JavaScript-powered websites were given in this talk.

* Add a robot.txt to the top level domain of your site which specifies the URLs to crawl and not to.
* Use good URLs such as `example.com/about` rather than fragmented URLs such as `example.com/#home`.
* Use consistent URLs for the same page.
* Add the critical metadata such as canonical links, viewport, title and description of each page, etc.
* Use href elements when linking between pages. Don't use non-semantic elements such as `<div onclick=goTo('/contact')></div>` if you don't have to!

Tools such as [Puppeteer](https://developers.google.com/web/tools/puppeteer) and [Rendertron](https://github.com/GoogleChrome/rendertron) were recommnended for dynamic rendering.

> **Note:** The rendering of JavaScript-powered websites in Google search is deferred until Googlebot has resources available to process that content.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">🌟 Tips for SEO<br><br>1. Use meaningful URLs<br><br>E.g. <br>✅ <a href="https://t.co/jTx8E7mblc">https://t.co/jTx8E7mblc</a> <br>❌ <a href="https://t.co/Qo9zfpbcLH">https://t.co/Qo9zfpbcLH</a> <a href="https://t.co/NUZ1V33d3d">pic.twitter.com/NUZ1V33d3d</a></p>&mdash; Ire Aderinokun (@ireaderinokun) <a href="https://twitter.com/ireaderinokun/status/994664766571405312?ref_src=twsrc%5Etfw">May 10, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Watch all the talks from Day 1 at the [Google Developers Youtube Channel](https://www.youtube.com/user/GoogleDevelopers).

{% include asides/about-auth0.markdown %}


## Conclusion

It's been an amazing three days of awesomeness. A lot of talks and announcements. A lot of new kits for developers to build amazing products with. I'm stoked for all the great things that will be rolled out in the coming months. The future is A.I!

{% include tweet_quote.html quote_text="The future is A.I!" %}