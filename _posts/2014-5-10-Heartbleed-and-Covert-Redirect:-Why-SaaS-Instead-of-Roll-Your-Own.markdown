---
layout: post
title: "Heartbleed and Covert Redirect: Why SaaS Instead of Roll-Your-Own "
date: 2014-05-10 15:00
author: 
  name: Jon Gelsey
  mail: jon@auth0.com
  url:  http://www.twitter.com/jgelsey
  avatar: https://auth0.com/about/img/jon.png
---
Auth0’s been fortunate to have great success in helping developers eliminate the pain of integrating their apps into complex identity environments.  But occasionally we are asked why a developer would pay for Auth0 if they simply want to enable SSO with a few mainstream social IdPs like Google and Facebook. The argument is that for simple scenarios Auth0 only saves a few hours of work, so is that worth the monthly subscription fee?

If it was just a matter of a few hours of work the answer is likely “no”.  But identity (and security in general) is brittle, as Heartbleed and Covert Redirect demonstrate.  As Schneier says, security is a process, not a product - do you really want to spend your time on maintaining identity infrastructure instead of your core product?

Auth0 users were never vulnerable to Covert Redirect, because we had long been aware of the vulnerability and designed Auth0 not to be susceptible.   We had new certs in place to patch Heartbleed before the first customer reached out to us about it.  We have yet to see the first lawsuits against companies that didn’t patch properly, but they will come.  The value of a cloud service like Auth0 is not just the up-front implementation savings, it’s that we spend 24x7 obsessing over identity so you don’t have to.  

<blockquote class="twitter-tweet" lang="en"><p>Great reason to use SaaS, note from <a href="https://twitter.com/authzero">@authzero</a> - heard of Covert Redirect vulnerability in short, if you use Auth0 your app is not vulnerable</p>&mdash; Dave Messinger (@dmessing) <a href="https://twitter.com/dmessing/statuses/462796740555726848">May 4, 2014</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>


