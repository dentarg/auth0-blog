---
layout: post
title: "Chrome Developer Summit 2017 Summary - Day 2"
description: "Check out our summary of the Chrome Developer Summit 2017, Day 2."
date: 2017-10-25 08:30
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
- 2017-10-25-chromedevsummit-summary-day-one
- 2017-10-05-nestjs-brings-typescript-to-nodejs-and-express
---


The second and final day of the fifth Chrome Developer Summit 2017 consisted of about nine talks and a Framework Panel. These talks were centered around VR, AR, Media, Polymer and developer tooling.

**[Tal Oppenheimer](https://twitter.com/taloppenheimer)** gave the opening talk titled **The Web for the Entire World**. She highlighted the top ten countries by internet usage. It's amazing _China_, _India_, and _Nigeria_ are on that list.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Top 10 Countries by Internet Usage <br><br>Nigeria 💥💥💅💅<a href="https://twitter.com/hashtag/ChromeDevSummit?src=hash&amp;ref_src=twsrc%5Etfw">#ChromeDevSummit</a> <a href="https://twitter.com/hashtag/NextBillionUsers?src=hash&amp;ref_src=twsrc%5Etfw">#NextBillionUsers</a> <a href="https://t.co/WQlUn6xwNt">pic.twitter.com/WQlUn6xwNt</a></p>&mdash; Chrome Dev Summit 🔥 (@unicodeveloper) <a href="https://twitter.com/unicodeveloper/status/922871766657089536?ref_src=twsrc%5Etfw">October 24, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Tal shared how many of the quickly growing countries still have data costs above 5% GNI. According to Tal, _fifty-three percent_ of mobile connections will still be 2G in India in 2020. She talked about how PWA reduces the install size of an app and used the _OLA_ service as a case study.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Peep the size. iOS, Android &amp; Web <a href="https://twitter.com/hashtag/ChromeDevSummit?src=hash&amp;ref_src=twsrc%5Etfw">#ChromeDevSummit</a> 🚀🚀🚀 <a href="https://t.co/HbXHJbUZU4">pic.twitter.com/HbXHJbUZU4</a></p>&mdash; Chrome Dev Summit 🔥 (@unicodeveloper) <a href="https://twitter.com/unicodeveloper/status/922875108816928768?ref_src=twsrc%5Etfw">October 24, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Check out her [session on Youtube](https://www.youtube.com/watch?v=eG0ILA2k5qo)

**[Paul Irish](https://twitter.com/paul_irish)** and **[Eric Bidelman](https://twitter.com/ebidel)** gave an amazing talk on **Modern Tooling, Testing, and Automation**. They uncovered new features in DevTools and unleashed Puppeteer, a new Node library for controlling headless Chrome. We have some crazy new features in Chrome DevTools. These features include:

* CSS Grid Layout Inspection.
* Color contrast evaluation.
* Local Overrides - This feature actually blew my mind. Developers like myself have secretly wished over time that there should be a way to make changes to the HTML structure, CSS and JavaScript of a website and have those changes persist even if the browser is reloaded for the purpose of development. _Local overrides_ takes care of that effectively. It allows you create a folder, and save these temporary changes to disk.
* Performance Monitor to show live streaming metrics.
* Filter Sidebar to enable filtering of errors in the console by _user messages_, _errors_, _warnings_ and _info_.
* Group Similar Checkbox to enable grouping of similar or repeating errors.
* Top-level await in Console.
* Storage Usage Summary for Progressive Web Apps. The _Clear Storage_ section now provides a graphical allocation of storage used by a PWA.
* Service Worker Upgrades - New _Push_ and _Sync_ feature in DevTools for the definition of custom payload in testing push notifications and background sync.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Local Overrides with DevTools<br><br>Mind Fucking Blowing!! 😱🔥🔥😱😱😱😱😱😱😱🔥🔥🔥🔥🔥<br><br>Reload your page &amp; changes will still remain. Damn!!<a href="https://twitter.com/hashtag/chromeDevSummit?src=hash&amp;ref_src=twsrc%5Etfw">#chromeDevSummit</a> <a href="https://t.co/H17zjQVYMM">pic.twitter.com/H17zjQVYMM</a></p>&mdash; Chrome Dev Summit 🔥 (@unicodeveloper) <a href="https://twitter.com/unicodeveloper/status/922880938014662658?ref_src=twsrc%5Etfw">October 24, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">What’s happening in Console now?<br><br>The Chrome Team is working! <a href="https://twitter.com/hashtag/ChromeDevSummit?src=hash&amp;ref_src=twsrc%5Etfw">#ChromeDevSummit</a> <a href="https://t.co/2HFbujT2dU">pic.twitter.com/2HFbujT2dU</a></p>&mdash; Chrome Dev Summit 🔥 (@unicodeveloper) <a href="https://twitter.com/unicodeveloper/status/922885286127947776?ref_src=twsrc%5Etfw">October 24, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Paul talked about improvements made to _Lighthouse_. A year ago, Lighthouse had just about fifty key issues and metrics. Today, Lighthouse has over a hundred metrics. He also highlighted a new project called, _Project Lantern_, for critical path analysis and modeling.

Eric talked about **Puppeteer**. Puppeteer is a modern Node.js library for headless Chrome. It has many powers such as:

* Intercepting network requests.
* Running code in page.
* Creating PDFs.

and so many others.


{% include tweet_quote.html quote_text="Puppeteer is a modern Node.js library for headless Chrome." %}

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">The many powers of Puppeteer 🔥 <a href="https://twitter.com/hashtag/ChromeDevSummit?src=hash&amp;ref_src=twsrc%5Etfw">#ChromeDevSummit</a> <a href="https://t.co/godSvAiSu3">pic.twitter.com/godSvAiSu3</a></p>&mdash; Chrome Dev Summit 🔥 (@unicodeveloper) <a href="https://twitter.com/unicodeveloper/status/922887043234926593?ref_src=twsrc%5Etfw">October 24, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

> Developers workflow just got better, all thanks to Chrome DevTools engineers!

Check out their [session on Youtube](https://www.youtube.com/watch?v=7-XnEMrQnn4).

**[Sam Saccone](https://twitter.com/samccone)** talked about **The future of performance on the Web**. Sam shared cutting-edge performance techniques and highlighted what the future of loading on the web may hold. Check out his [session on Youtube](https://www.youtube.com/watch?v=DKyHVGh666s).

**[Thomas Nattestad](https://twitter.com/thomasnat1)** gave a talk titled **V8 today and in the future**. Thomas shared the work the V8 team has done to improve the performance of JavaScript on the browser. V8's mission is to speed up real-world performance for modern JavaScript and enable developers to build a faster future web. The V8 team pays attention to two major test suites, _speedometer_, and _ares6_. He mentioned that V8 is now twenty-two and forty percent faster on _speedometer_ and _ares6_ respectively.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Ignition &amp; TurboFan - V8 Machinery <a href="https://twitter.com/hashtag/ChromeDevSummit?src=hash&amp;ref_src=twsrc%5Etfw">#ChromeDevSummit</a> <a href="https://t.co/1OciMM8a2k">pic.twitter.com/1OciMM8a2k</a></p>&mdash; Chrome Dev Summit 🔥 (@unicodeveloper) <a href="https://twitter.com/unicodeveloper/status/922906036834467841?ref_src=twsrc%5Etfw">October 24, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

V8 just recently moved to a new architecture. The V8 Ignition, an interpreter, allows for fast startup and low memory consumption. Furthermore, the V8 TurboFan, an optimizing compiler, enables peak performance and max optimization. Thomas talked about how developers can now use ES2015+ without transpiling and still get optimal performance in the browser.


{% include tweet_quote.html quote_text="The V8 Ignition, an interpreter, allows for fast startup and low memory consumption." %}

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Turn off ES2015 transpiling <a href="https://twitter.com/hashtag/ChromeDevSummit?src=hash&amp;ref_src=twsrc%5Etfw">#ChromeDevSummit</a> <a href="https://t.co/wSKsClBkrm">pic.twitter.com/wSKsClBkrm</a></p>&mdash; Chrome Dev Summit 🔥 (@unicodeveloper) <a href="https://twitter.com/unicodeveloper/status/922908961417728000?ref_src=twsrc%5Etfw">October 24, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Check out his [session on Youtube](https://www.youtube.com/watch?v=7rx9fSUG8H0).

**[Alex Danilo](https://twitter.com/alexanderdanilo)** and **[Deepti Gandluri](https://twitter.com/dptig)** talked about **Real World Assembly**. Web Assembly is a new capability for the web. It delivers a performant run-time to allow compiled languages such as C++ to be used in Web applications. Alex and Deepti demoed several real-world applications that leverage Web Assembly to run fast in the web browser. One of such applications is _WebSight_. [WebSight](https://www.websightjs.com) was compiled to Wasm(Web Assembly) and witnessed significant performance gains. [Construct3](https://www.construct.net), an in-browser editor, is another application that combines the best of the web with the best of native. Worthy of note is [Google Earth](https://www.google.com/earth) that leverages WASM runtime to give users a very good user experience.

Deepti highlighted a few things we should look out for in the future of Web Assembly:

* Threads.
* Improved support for debugging.
* Garbage Collection.
* Zero-cost Exception handling.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Web Assembly (WASM) <a href="https://twitter.com/hashtag/ChromeDevSummit?src=hash&amp;ref_src=twsrc%5Etfw">#ChromeDevSummit</a> <a href="https://t.co/kkh2f8uxaR">pic.twitter.com/kkh2f8uxaR</a></p>&mdash; Chrome Dev Summit 🔥 (@unicodeveloper) <a href="https://twitter.com/unicodeveloper/status/922911457590763520?ref_src=twsrc%5Etfw">October 24, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Web Assembly is significantly faster than JavaScript. Great for computer vision processing! <a href="https://twitter.com/hashtag/ChromeDevSummit?src=hash&amp;ref_src=twsrc%5Etfw">#ChromeDevSummit</a> <a href="https://t.co/MEq0jqI7u2">pic.twitter.com/MEq0jqI7u2</a></p>&mdash; Chrome Dev Summit 🔥 (@unicodeveloper) <a href="https://twitter.com/unicodeveloper/status/922912328089088000?ref_src=twsrc%5Etfw">October 24, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Check out their [session on Youtube](https://www.youtube.com/watch?v=PpuAqLCraAQ).

**[Taylor Savage](https://twitter.com/taylorthesavage)**, gave a talk on **End-to-End Polymer Apps with the Modern Web Platform**. Taylor extensively went through how the Polymer team envisions using web components, service workers and new web platform features to build great user experiences. Check out his [session on Youtube](https://www.youtube.com/watch?v=Wu2GCRkDecI).

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Redux ❤️ @ <a href="https://twitter.com/hashtag/ChromedevSummit?src=hash&amp;ref_src=twsrc%5Etfw">#ChromedevSummit</a> from <a href="https://twitter.com/TaylorTheSavage?ref_src=twsrc%5Etfw">@TaylorTheSavage</a>.Redux + web components = state mangement &amp; dev experience bliss cc <a href="https://twitter.com/dan_abramov?ref_src=twsrc%5Etfw">@dan_abramov</a> <a href="https://twitter.com/acemarke?ref_src=twsrc%5Etfw">@acemarke</a> <a href="https://t.co/S4d2Wjd10E">pic.twitter.com/S4d2Wjd10E</a></p>&mdash; Amal Hussein (@nomadtechie) <a href="https://twitter.com/nomadtechie/status/922949747870011395?ref_src=twsrc%5Etfw">October 24, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

**[Justin Fagnani](https://twitter.com/justinfagnani)** gave a talk on **lit-HTML**. Justin talked about HTML templating and announced the release of lit-HTML. lit-HTML is a next-generation templating library that combines powerful web platform primitives such as JavaScript tagged template literals and HTML templates to help you build expressive templates for efficient DOM manipulation. Check out his [session on Youtube](https://www.youtube.com/watch?v=Io6JjgckHbg).

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Lit-html is a game changer for bridging the gap between JS &amp; HTML. Love <a href="https://twitter.com/reactjs?ref_src=twsrc%5Etfw">@reactjs</a>? Then you will love lit-html.My fav talk @ <a href="https://twitter.com/hashtag/ChromedevSummit?src=hash&amp;ref_src=twsrc%5Etfw">#ChromedevSummit</a> <a href="https://t.co/wEwDYuydj9">pic.twitter.com/wEwDYuydj9</a></p>&mdash; Amal Hussein (@nomadtechie) <a href="https://twitter.com/nomadtechie/status/922959571601186816?ref_src=twsrc%5Etfw">October 24, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>


**[Mat Scales](https://twitter.com/sw12)** talked about **Creating Media on the Web**. Mat covered some of the new web APIs that make media creation seamless. In his talk, the Instagram team showed how they built their PWA leveraging some new Web APIs. The Instagram team uses [Workbox](https://github.com/GoogleChrome/workbox) for precaching, [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) and [Shaka Player](https://github.com/google/shaka-player). Furthermore, they showed how the offline functionality was implemented.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Instagram PWA in Action 🔥🔥🔥 <a href="https://twitter.com/hashtag/ChromeDevSummit?src=hash&amp;ref_src=twsrc%5Etfw">#ChromeDevSummit</a> <a href="https://t.co/z8eOxz3NDs">pic.twitter.com/z8eOxz3NDs</a></p>&mdash; Chrome Dev Summit 🔥 (@unicodeveloper) <a href="https://twitter.com/unicodeveloper/status/922976320736305153?ref_src=twsrc%5Etfw">October 25, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Instagram PWA Offline Implementation <a href="https://twitter.com/hashtag/ChromeDevSummit?src=hash&amp;ref_src=twsrc%5Etfw">#ChromeDevSummit</a> <a href="https://twitter.com/hashtag/NextBillionUsers?src=hash&amp;ref_src=twsrc%5Etfw">#NextBillionUsers</a> <a href="https://t.co/kwjbwVNBJk">pic.twitter.com/kwjbwVNBJk</a></p>&mdash; Chrome Dev Summit 🔥 (@unicodeveloper) <a href="https://twitter.com/unicodeveloper/status/922980101196619776?ref_src=twsrc%5Etfw">October 25, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Before &amp; After. <a href="https://twitter.com/hashtag/Implementation?src=hash&amp;ref_src=twsrc%5Etfw">#Implementation</a> <br><br>Reduced load time by 68% 😱😱😱<a href="https://twitter.com/hashtag/ChromeDevSummit?src=hash&amp;ref_src=twsrc%5Etfw">#ChromeDevSummit</a> <a href="https://t.co/XSMzrm2WKa">pic.twitter.com/XSMzrm2WKa</a></p>&mdash; Chrome Dev Summit 🔥 (@unicodeveloper) <a href="https://twitter.com/unicodeveloper/status/922979293218484224?ref_src=twsrc%5Etfw">October 25, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Adaptive Streaming in Instagram PWA<a href="https://twitter.com/cloudinary?ref_src=twsrc%5Etfw">@cloudinary</a> provides a seamless Adaptive Bitrate Streaming func. for playbacks <a href="https://twitter.com/hashtag/ChromeDevSummit?src=hash&amp;ref_src=twsrc%5Etfw">#ChromeDevSummit</a> <a href="https://t.co/yH1MKvSIvM">pic.twitter.com/yH1MKvSIvM</a></p>&mdash; Chrome Dev Summit 🔥 (@unicodeveloper) <a href="https://twitter.com/unicodeveloper/status/922978186429833216?ref_src=twsrc%5Etfw">October 25, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Check out the [session on Youtube](https://www.youtube.com/watch?v=UTZVXlcUK1w).

**Josh Carpenter** and **Brandon Jones** talked about **The Future of Immersive Experiences on the Web with VR and AR**. They highlighted best practices for building immersive WebVR experiences that work on desktop, mobile and in VR headsets. They also talked about the future of augmented reality on the web. Check out their [session on Youtube](https://www.youtube.com/watch?v=rqXbLb1Bd7o).

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Web VR tools <a href="https://twitter.com/hashtag/ChromeDevSummit?src=hash&amp;ref_src=twsrc%5Etfw">#ChromeDevSummit</a> <a href="https://t.co/C6gbPyJfU5">pic.twitter.com/C6gbPyJfU5</a></p>&mdash; Chrome Dev Summit 🔥 (@unicodeveloper) <a href="https://twitter.com/unicodeveloper/status/922984021906223104?ref_src=twsrc%5Etfw">October 25, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">WebVR across platforms <a href="https://twitter.com/hashtag/ChromeDevSummit?src=hash&amp;ref_src=twsrc%5Etfw">#ChromeDevSummit</a> <a href="https://t.co/8hkj14b88T">pic.twitter.com/8hkj14b88T</a></p>&mdash; Chrome Dev Summit 🔥 (@unicodeveloper) <a href="https://twitter.com/unicodeveloper/status/922984258829893634?ref_src=twsrc%5Etfw">October 25, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Augmented Reality on the Web <a href="https://twitter.com/hashtag/ChromeDevSummit?src=hash&amp;ref_src=twsrc%5Etfw">#ChromeDevSummit</a> <a href="https://t.co/PoWLirKzfO">pic.twitter.com/PoWLirKzfO</a></p>&mdash; Chrome Dev Summit 🔥 (@unicodeveloper) <a href="https://twitter.com/unicodeveloper/status/922989220783833088?ref_src=twsrc%5Etfw">October 25, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">WebAR Next Steps <a href="https://twitter.com/hashtag/ChromeDevSummit?src=hash&amp;ref_src=twsrc%5Etfw">#ChromeDevSummit</a> <a href="https://t.co/oEQTVJpe1C">pic.twitter.com/oEQTVJpe1C</a></p>&mdash; Chrome Dev Summit 🔥 (@unicodeveloper) <a href="https://twitter.com/unicodeveloper/status/922989938647343104?ref_src=twsrc%5Etfw">October 25, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

In between talks, there was a **Framework Panel** that consisted of _Addy Osmani_, _Andrew Clark_, _Jason Miller_, _Steve Orvell_, _Rob Wormald_, _Tracy Lee_, _Chad Hietala_, _Sean Larkin_, _Malte Ubl_, and _Alex Russell_. The audience asked several highly-engaging questions. Check out the [answers given by the panel to the audience](https://www.youtube.com/watch?v=q5HDhQtpDRU).

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

Chrome Dev Summit, 2017 was a success. It was an amazing gathering of developers from all over the world. The talks were fantastic, the booth demos were intriguing and I can boldly say that the Chrome team did a great job in putting this conference together. Huge thanks to *[Kosamari](https://twitter.com/kosamari)* and *[Monica](https://twitter.com/notwaldorf)*, amazing MC's, for entertaining developers throughout the event. If you missed the first day of the summit, [here is a recap](https://auth0.com/blog/chromedevsummit-summary-day-one/).

Were you around for the summit? Did you attend sessions for both days? Let me know about your experiences in the comment section. 😃