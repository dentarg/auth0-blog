---
layout: post
title: "Chrome Developer Summit 2017 Summary - Day 1"
description: "Check out our summary of the Chrome Developer Summit 2017, Day 1."
date: 2017-10-24 08:30
category: Technical Guide, Conferences, Chrome Developer Summit
author:
  name: "Prosper Otemuyiwa"
  url: "https://twitter.com/unicodeveloper"
  mail: "prosper.otemuyiwa@auth0.com"
  avatar: "https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200"
design:
  bg_color: "#2D6189"
  image: "https://cdn.auth0.com/blog/ChromedevSummitLogo.png"
tags:
- Chrome
- Summit
- ChromeDevSummit
- ChromeDevSummit2017
related:
- 2016-11-15-chromedevsummit-summary
- 2016-12-19-introduction-to-progressive-apps-part-one
- 2017-10-05-nestjs-brings-typescript-to-nodejs-and-express
---


The first day of the fifth Chrome Developer Summit 2017 consisted of an opening keynote, five talks, and a Leadership Panel. As expected, several developers came from around the world for the summit. A lot of the talks were centered around improving web performance and driving progressive web app experiences to the user.

According to [Ben Galbraith](https://twitter.com/bgalbs) *(Product Lead for the Chrome Web Platform Team)*, and [Dion Almer](https://twitter.com/dalmaer) *(Developer Relations Lead)* who gave the keynote, the Webkit and Microsoft Edge teams have announced that they are working on adding service worker support to their browsers. Check out the [keynote on Youtube](https://youtu.be/1-g1rvkORQ8).

**[Thao Tran](https://twitter.com/thaotran)** and **[Chris Wilson](https://twitter.com/cwilso)** presented the first talk of the summit. Their talk was titled **A New bar for Web Experiences**. Chris said something profound; _"It's not just good enough to provide a service anymore, you have to prioritize your user experience"_. They emphasized about how Progressive Web Apps are just a higher bar for user experience. They announced that Magento is getting onboard with PWA for their mobile e-commerce platform. A case study about [Ele.me](https://h5.ele.me) which serves 260 million users was presented by Chris. _Ele.me_ rolled out a progressive web app that allows users with flaky user connections to have an awesome user experience. Thao talked about websites using AMP to provide better user experiences. Websites such as [Overstock](https://www.overstock.com/) and [Tasty.co](https://tasty.co/). Also, Thao mentioned that _four billion_ AMP Pages now run on twenty-five million domains. Check out the [session on Youtube.](https://www.youtube.com/watch?v=PsgW-0M67TQ)

{% include tweet_quote.html quote_text="It's not just good enough to provide a service anymore, you have to prioritize your user experience." %}

_PWA Experiences across the Globe_
<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Better User Experiences across the Globe <a href="https://twitter.com/hashtag/ChromeDevSummit?src=hash&amp;ref_src=twsrc%5Etfw">#ChromeDevSummit</a> <a href="https://t.co/TI5IBC5qmA">pic.twitter.com/TI5IBC5qmA</a></p>&mdash; Chrome Dev Summit 🔥 (@unicodeveloper) <a href="https://twitter.com/unicodeveloper/status/922527131216658432?ref_src=twsrc%5Etfw">October 23, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr"><a href="https://t.co/HuYTnT4Pdn">https://t.co/HuYTnT4Pdn</a> is smaller than most JavaScript libraries. It&#39;s built with <a href="https://twitter.com/preactjs?ref_src=twsrc%5Etfw">@preactjs</a> and craaazy magic. <a href="https://t.co/4RRpZDgyX6">pic.twitter.com/4RRpZDgyX6</a></p>&mdash; Jason Miller 🦊⚛@CDS (@_developit) <a href="https://twitter.com/_developit/status/922525910535847936?ref_src=twsrc%5Etfw">October 23, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

{% include tweet_quote.html quote_text="4 Billion AMP Pages now run on 25 million domains." %}

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Big changes to permissions coming in Chrome 63. Will be a modal. Will encourage good dev behavior. <a href="https://twitter.com/hashtag/ChromeDevSummit?src=hash&amp;ref_src=twsrc%5Etfw">#ChromeDevSummit</a> <a href="https://t.co/OTnYANrphM">pic.twitter.com/OTnYANrphM</a></p>&mdash; Jason Grigsby, ☁4 (@grigs) <a href="https://twitter.com/grigs/status/922524110961307649?ref_src=twsrc%5Etfw">October 23, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

**[Owen Campbell-Moore](https://twitter.com/owencm)** *(Product Manager, Chrome)* talked about how to make progressive web apps provide an immersive, integrated experience on all platforms and operating systems. He announced that the new _Improved Add to HomeScreen_ functionality has been launched fully for Chrome for Android users. He also talked about the new **Trusted Web Activities**, which allows Android apps to include app-like content served from the web. It integrates PWAs deeply into Android. He also gave some other updates such as:

* A new Image Upload UI for Progressive Web Apps on Mobile platforms. The new UI is rolling out this week.
* Major improvements to the Image Capture API.
* Improvements to the Background Sync and Media Session API.
* Payment Request API, which provides users a seamless way to checkout with Android Pay or whatever credit card they have originally added to their Google accounts.
* Identity - Google just launched a new [identity platform](https://developers.google.com/identity/one-tap/web/) called the _One-tap Sign-in_ and _One-tap sign-up_ that allows users sign up and sign in seamlessly.

Personally, I was blown away when he mentioned that Windows will be listing PWAs in the Windows store henceforth.

Check out his [session](https://www.youtube.com/watch?v=_sLa0qhuqcA).

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Improved Add to Home screen <br><br>- Add to Homescreen modal flow coming soon! <a href="https://twitter.com/hashtag/ChromeDevSummit?src=hash&amp;ref_src=twsrc%5Etfw">#ChromeDevSummit</a> <a href="https://t.co/MPiI3FPqCa">pic.twitter.com/MPiI3FPqCa</a></p>&mdash; Chrome Dev Summit 🔥 (@unicodeveloper) <a href="https://twitter.com/unicodeveloper/status/922542783331627008?ref_src=twsrc%5Etfw">October 23, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">If you want, you can promote your native app from within your mobile web app <a href="https://twitter.com/hashtag/ChromeDevSummit?src=hash&amp;ref_src=twsrc%5Etfw">#ChromeDevSummit</a> <br><br>- Trusted Web Activities 🙌🙌🙌 <a href="https://t.co/TtAhvWFlza">pic.twitter.com/TtAhvWFlza</a></p>&mdash; Chrome Dev Summit 🔥 (@unicodeveloper) <a href="https://twitter.com/unicodeveloper/status/922544060543332352?ref_src=twsrc%5Etfw">October 23, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Microsoft will be listing PWAs in the Windows store 😱😱😱😱😱😱😱 <a href="https://twitter.com/hashtag/ChromeDevSummit?src=hash&amp;ref_src=twsrc%5Etfw">#ChromeDevSummit</a> <a href="https://t.co/bDHJd8o16b">pic.twitter.com/bDHJd8o16b</a></p>&mdash; Chrome Dev Summit 🔥 (@unicodeveloper) <a href="https://twitter.com/unicodeveloper/status/922545235225276420?ref_src=twsrc%5Etfw">October 23, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

**[Ewa Gasperowicz](https://twitter.com/devnook)** gave a talk titled **Kickstart your PWA journey**. She covered how to take a website and turn it into a Progressive Web App. She called it, _The Process_. **The Process** includes the following steps: _Analyze_, _Prioritize_, _Choose tools_, _Implement_, and _Evaluate_. **Analyze** involves auditing your website before you start making improvements using tools like Lighthouse, Chrome DevTools, WebPageTest, etc. **Prioritize** involves ensuring your website is PWA-ready. This means making sure that the website optimizes images, leverages browser caching, doesn't run on blocking JavaScript code, etc. Furthermore, it involves the following:

* Users on 3G? Focus on offline.
* User Acquisition? Focus on performance.
* User retention? Focus on Add-to-Homescreen and notifications.
* User conversion? Try payments.

 **Choose tools** involves choosing the right tools for turning your website into a PWA. One such tool is [Workbox - JavaScript libraries for Offline Caching](https://github.com/GoogleChrome/workbox). **Implement** involves different patterns for different projects. Noteworthy are the following:

 * Don't block transitions on the network.
 * Use Skeleton screens to avoid blank screens while content is been loaded.
 * Prevent content jumping.
 * Cache the right things at the right time.
 * Avoid scrolling glitches.
 * Scroll fast with virtualized lists.
 * Don't ask for permissions on page load. Ask for permissions in context instead.

Ewa mentioned four selective Image strategies for PWA:

* Inline
* Precache
* Cache at runtime
* Fallback

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">4 Selective Image Strategies for PWA cc <a href="https://twitter.com/cloudinary?ref_src=twsrc%5Etfw">@cloudinary</a> <a href="https://twitter.com/hashtag/ChromeDevSummit?src=hash&amp;ref_src=twsrc%5Etfw">#ChromeDevSummit</a> <a href="https://twitter.com/hashtag/PWAJourney?src=hash&amp;ref_src=twsrc%5Etfw">#PWAJourney</a> <a href="https://t.co/WqcaZKV6lh">pic.twitter.com/WqcaZKV6lh</a></p>&mdash; Chrome Dev Summit 🔥 (@unicodeveloper) <a href="https://twitter.com/unicodeveloper/status/922557993698258944?ref_src=twsrc%5Etfw">October 23, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

**Evaluate** involves measuring performance at the end of the project. Comparing the audits from the initial report with the report at the end of the PWA implementation and providing business justifications for your new implementation. She emphasized that metrics are helpful, but they are only metrics. Nothing is better than actually checking user reactions to your product. Pay special attention to analytics and the voice of your users.

{% include tweet_quote.html quote_text="Metrics are helpful, but they are only metrics." %}

Check out her [session on Youtube](https://www.youtube.com/watch?v=goafiwzhKMI).

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">PWA Journey - Measurement with Lighthouse.<br><br>The business folks should have your report too <a href="https://twitter.com/hashtag/ChromeDevSummit?src=hash&amp;ref_src=twsrc%5Etfw">#ChromeDevSummit</a> <a href="https://t.co/m33ItL4zDY">pic.twitter.com/m33ItL4zDY</a></p>&mdash; Chrome Dev Summit 🔥 (@unicodeveloper) <a href="https://twitter.com/unicodeveloper/status/922552912806580229?ref_src=twsrc%5Etfw">October 23, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

**[Addy Osmani](https://twitter.com/addyosmani)** talked about **Fast By Default: Modern Loading Best Practices**. If you know Addy, you'll agree with me that he's a performance beast. There are hundreds of talks all over the internet where Addy Osmani talks about JavaScript performance in web apps and mobile sites. This talk is a new addition to the list. Addy talked about the 2017 best practices for loading. Practices such as preresolving DNS for critical origins, lazy-loading non-critical resources, using service workers to cache effectively, tree-shaking with Webpack and Rollup, etc. He mentioned that loading is a journey and sites may use only forty percent of the JavaScript they load upfront.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Performance <a href="https://twitter.com/addyosmani?ref_src=twsrc%5Etfw">@addyosmani</a> <a href="https://twitter.com/hashtag/ChromeDevSummit?src=hash&amp;ref_src=twsrc%5Etfw">#ChromeDevSummit</a> <a href="https://t.co/vkquyPU69Q">pic.twitter.com/vkquyPU69Q</a></p>&mdash; Chrome Dev Summit 🔥 (@unicodeveloper) <a href="https://twitter.com/unicodeveloper/status/922577844403716096?ref_src=twsrc%5Etfw">October 23, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Addy Osmani mentioned [httparchive](https://beta.httparchive.org) that is available for everyone today. It's a platform that provides all the data you need for performance comparison. He reiterated that everyone is responsible for performance.

{% include tweet_quote.html quote_text="Loading is a journey - Addy Osmani." %}

_State of the Web on Mobile_

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">State of the Mobile Web <a href="https://twitter.com/hashtag/ChromeDevSummit?src=hash&amp;ref_src=twsrc%5Etfw">#ChromeDevSummit</a> <a href="https://t.co/ez2zkr4aNw">pic.twitter.com/ez2zkr4aNw</a></p>&mdash; Chrome Dev Summit 🔥 (@unicodeveloper) <a href="https://twitter.com/unicodeveloper/status/922580306393104384?ref_src=twsrc%5Etfw">October 23, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

During Addy's session, the _Chrome User Experience Report_ was announced. This report is available as a public dataset on [Google Big Query](https://bigquery.cloud.google.com) and it provides real-world performance user experience metrics. The initial release focuses on metrics that capture loading experience.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Percentage of fast loads on <a href="https://t.co/L7B8WTKL5k">https://t.co/L7B8WTKL5k</a> <a href="https://twitter.com/hashtag/ChromeDevSummit?src=hash&amp;ref_src=twsrc%5Etfw">#ChromeDevSummit</a> <a href="https://twitter.com/hashtag/BigQuery?src=hash&amp;ref_src=twsrc%5Etfw">#BigQuery</a> <a href="https://t.co/UUBUgMJZU0">pic.twitter.com/UUBUgMJZU0</a></p>&mdash; Chrome Dev Summit 🔥 (@unicodeveloper) <a href="https://twitter.com/unicodeveloper/status/922581393611173888?ref_src=twsrc%5Etfw">October 23, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Addy mentioned that [Pinterest](https://www.pinterest.com) and [Tinder](https://tinder.com) have joined the Progressive Web Apps family. These two popular platforms have rolled out progressive web apps and seen fantastic improvements in user conversions.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Pinterest <br><br>Before &amp; After <a href="https://twitter.com/hashtag/Performance?src=hash&amp;ref_src=twsrc%5Etfw">#Performance</a> <a href="https://twitter.com/hashtag/ChromeDevSummit?src=hash&amp;ref_src=twsrc%5Etfw">#ChromeDevSummit</a> 🔥🔥🔥 <a href="https://t.co/NF3ZwRedIl">pic.twitter.com/NF3ZwRedIl</a></p>&mdash; Chrome Dev Summit 🔥 (@unicodeveloper) <a href="https://twitter.com/unicodeveloper/status/922583942212890624?ref_src=twsrc%5Etfw">October 23, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Pinterest - Code Splitting &amp; Performance Budget Strategy <a href="https://twitter.com/hashtag/Performance?src=hash&amp;ref_src=twsrc%5Etfw">#Performance</a> <a href="https://twitter.com/hashtag/ChromeDevSummit?src=hash&amp;ref_src=twsrc%5Etfw">#ChromeDevSummit</a> <a href="https://t.co/2tn67nm67u">pic.twitter.com/2tn67nm67u</a></p>&mdash; Chrome Dev Summit 🔥 (@unicodeveloper) <a href="https://twitter.com/unicodeveloper/status/922584870542499842?ref_src=twsrc%5Etfw">October 23, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

_Tinder Performance Budget and Strategy_

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Tinder - Performance Budget <a href="https://twitter.com/hashtag/ChromeDevSummit?src=hash&amp;ref_src=twsrc%5Etfw">#ChromeDevSummit</a> <a href="https://t.co/M3rDqzfJ8B">pic.twitter.com/M3rDqzfJ8B</a></p>&mdash; Chrome Dev Summit 🔥 (@unicodeveloper) <a href="https://twitter.com/unicodeveloper/status/922585449989685249?ref_src=twsrc%5Etfw">October 23, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Tinder - Performance Budget 2 <a href="https://twitter.com/hashtag/ChromeDevSummit?src=hash&amp;ref_src=twsrc%5Etfw">#ChromeDevSummit</a> <a href="https://t.co/e2S61p5ckL">pic.twitter.com/e2S61p5ckL</a></p>&mdash; Chrome Dev Summit 🔥 (@unicodeveloper) <a href="https://twitter.com/unicodeveloper/status/922585857344749569?ref_src=twsrc%5Etfw">October 23, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Check out his [session on Youtube](https://www.youtube.com/watch?v=_srJ7eHS3IM).

**[Jeff Posnick](https://twitter.com/jeffposnick)**, gave a talk on **Workbox: Flexible PWA Libraries**. [Workbox](https://github.com/GoogleChrome/workbox) is a set of libraries that work together to power your progressive web app's service worker. He mentioned that a service worker, properly configured, makes your web app fast and reliable. With Workbox, all you need to focus on is configuration rather than writing tons of boilerplate code. Jeff stated that _Pinterest_ already uses Workbox for pre-caching. Check out his [session on Youtube](https://www.youtube.com/watch?v=DtuJ55tmjps).

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">WorkBox - PWA Made extra easy! <a href="https://twitter.com/hashtag/ChromeDevSummit?src=hash&amp;ref_src=twsrc%5Etfw">#ChromeDevSummit</a> <a href="https://twitter.com/hashtag/Performance?src=hash&amp;ref_src=twsrc%5Etfw">#Performance</a> <a href="https://t.co/PNl1JwJWCo">pic.twitter.com/PNl1JwJWCo</a></p>&mdash; Chrome Dev Summit 🔥 (@unicodeveloper) <a href="https://twitter.com/unicodeveloper/status/922592899338002432?ref_src=twsrc%5Etfw">October 23, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

**[Surma Surma](https://twitter.com/dasSurma)** gave a talk on **Wordpress + PWA'S =  💖**. Surma built a proof-of-concept PWA app with Wordpress. He discussed the challenges involved in the integration of progressive technologies with CMSes and WordPress and went through the process of turning an existing CMS into a progressive web site. Check out his [session on Youtube](https://www.youtube.com/watch?v=Di7RvMlk9io).

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Wordpress + PWA ❤️❤️❤️❤️❤️ <a href="https://t.co/yqRIuFXCc6">pic.twitter.com/yqRIuFXCc6</a></p>&mdash; Chrome Dev Summit 🔥 (@unicodeveloper) <a href="https://twitter.com/unicodeveloper/status/922612856129929216?ref_src=twsrc%5Etfw">October 23, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Wordpress + PWA 🚀🚀🚀 <a href="https://t.co/vQuQxAblUk">pic.twitter.com/vQuQxAblUk</a></p>&mdash; Chrome Dev Summit 🔥 (@unicodeveloper) <a href="https://twitter.com/unicodeveloper/status/922613789593358336?ref_src=twsrc%5Etfw">October 24, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

**[Sam Dutton](https://twitter.com/sw12)** and **[Rowan Merewood](https://twitter.com/rowan_m)** gave a talk titled **Progressively improving e-commerce**. They mentioned that _$123 billion_ was spent on mobile e-commerce in 2016 in the US alone. They also highlighted that most purchases on mobile are now on the web but conversion rates are lower than on desktop. They talked about how to build better landing and browsing pages, reduce login and checkout friction, and implement network-resilient, offline-enabled search. Their session can be [found on Youtube](https://www.youtube.com/watch?v=F2GRAYyTF9Y).

**John Pallet** and **Francois Beaufort** talked about **Building a Modern Media Experience**. They highlighted best practices for building mobile web media. The best practices included how to pre-load your media assets, handle playback controls, autoplay and offline. Check out their [session on Youtube](https://www.youtube.com/watch?v=WRSEJCKu7zA).

In between talks, there was a **Leadership Panel** that consisted of _Darin Fisher_, _Paris Tabriz_, _Grace Kloba_, _Thao Tran_, _Tal Oppenheimer_, _Matthew McNulty_, _Alex Komoroske_, and _Alex Russell._ Several brilliant questions were asked by the audience. Check out the [answers given by the panel to the audience](https://www.youtube.com/watch?v=TU8fy8PHAl0).

**Aside: Authenticating with Auth0**

The [Credential Management API](https://developers.google.com/web/updates/2016/04/credential-management-api) and [One-tap API](https://developers.google.com/identity/one-tap/web/) are both great and will allow users get a better user experience while signing in to apps. Now, the cool thing about automatic sign-in across devices is that it works with multiple login providers. [This](https://developers.google.com/web/fundamentals/security/credential-management/retrieve-credentials) shows how you can federate with any provider. With [Auth0 Centralized Login](https://auth0.com/docs/hosted-pages/login), you also have access to [multiple authentication sources](https://docs.auth0.com/identityproviders) such as *Google, Facebook, Microsoft Account, LinkedIn, GitHub, Twitter, Box, Salesforce*, amongst others, or enterprise identity systems like *Windows Azure AD, Google Apps, Active Directory, ADFS or any SAML Identity Provider*. Auth0 helps you to:

* Add authentication through more traditional username/password databases.
* Add support for linking different user accounts with the same user.
* Support for generating signed JSON Web Tokens to call your APIs and flow the user identity securely.
* Analytics of how, when and where users are logging in.
* Pull data from other sources and add it to the user profile, through [JavaScript rules](https://docs.auth0.com/rules).
* Achieve [SSO(Single Sign-On)](https://auth0.com/docs/sso) seamlessly.

<a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">Sign up</a> for a free account today and enjoy fast, seamless, and hassle-free authentication in your apps.


## Conclusion

Chrome Dev Summit, Day 1, was amazing. The talks were mind-blowing. It's exciting that Google, Microsoft, Mozilla, Firefox, and Samsung are coming together to make the web more accessible, faster and better for everyone. Thanks to *[Kosamari](https://twitter.com/kosamari)* and *[Monica](https://twitter.com/notwaldorf)* for entertaining developers throughout the event. Already looking forward to **#Day2** and the fresh inspiring moments it will bring along with it!

If you were around for _#ChromeDevsummit2017 - Day 1_, let me know the talks you really loved in the comment section. 😃
