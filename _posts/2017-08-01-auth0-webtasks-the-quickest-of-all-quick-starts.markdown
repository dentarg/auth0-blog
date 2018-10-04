---
layout: post_extend
title: "Auth0 Webtasks: The Quickest of All Quick Starts"
description: "How fast can you stand up an HTTPS endpoint on the internet? With Auth0 Webtasks, you can go from code to done in less than a minute."
date: 2017-08-01 10:00
is_extend: true
category: Extend, Webtask
canonical_url: true
author: 
  name: "Randall Tombaugh"
  url: "https://github.com/rwtombaugh"
  mail: "randall.tombaugh@auth0.com"
  avatar: "https://cdn.auth0.com/website/blog/profiles/randalltombaugh.png"
design: 
  bg_color: "#3445dc"
  image_size: "95%"
  image_bg_color: "#D8E6FF"
  image: "https://cdn.auth0.com/website/blog/extend/webtasks-getting-started/stopwatch2.png"
tags: 
  - extend
  - Auth0 Webtasks
  - Webtasks
related:
  - 2017-05-16-introducing-auth0-extend-the-new-way-to-extend-your-saas
  - 2017-05-19-serverless-webhooks-with-auth0-extend
  - 2016-06-28-building-serverless-apps-with-webtask

---

*Got your stopwatch out? Are you ready?*

Here's the challenge: In less than a minute, stand up an HTTPS endpoint on the internet that returns a randomly generated unique identifier, or [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier). And do it from scratch--no vendor account setup, no tools installed. Think you can do it?

The Node.js code for our endpoint is simple. It is literally just a single line. And I mean *literally* literally, not *figuratively* literally. The code is only interesting because it takes a dependency on a public NPM module, but as we will see, that won't be a problem at all. Here's the code:

```javascript
module.exports = cb => cb(null, require('node-uuid').v4());
```

With Auth0 Webtasks, I can get this code deployed and up on the internet in under a minute. And I'll show you how you can do the same, even when you don't yet have an account on the platform.

![Ready, Set, Go](https://cdn.auth0.com/website/blog/extend/webtasks-getting-started/stopwatch.jpg)

We're going to deploy code first, answer questions later. So hold your questions till the end. I promise you won't have to wait long. Like I said, it will only take a minute.

---

### On Your Mark, Get Set...

Without further ado, let's deploy our UUID generator endpoint using the [Auth0 Webtask.io Editor](https://webtask.io/make). I suggest you first read over the steps from start to finish and watch the animated gif below. Then you can try it for yourself. 

*Ok, start the timer... now!*

- Click on this link to launch the editor at **[https://webtask.io/make](https://webtask.io/make)**

- Login with the identity provider of your choice. 

- Congrats! You now have an account on the Webtask.io platform!

- Select the 'Webtask' option in the 'Create New' dialogue box.

- Enter 'UUID' for the webtask name and click on the 'Save' button.

- Replace the default code in the editor with our UUID generation code: `module.exports = cb => cb(null, require('node-uuid').v4());`

- Click on the 'Toolbox' button. It's the wrench icon.

- Select 'NPM Modules' from the dropdown.

- Click on 'Add Module' in the NPM Modules panel.

- Enter 'node-uuid' in the module search and select the first result.

- Click on the 'Save' button. It's the old floppy disk icon. [⌘CMD-s]

- The URL for your webtask is at the bottom of the editor.

- Click on the small 'Copy' button next to the URL.

- Open a new tab in your browser and paste in the URL.

- Ta-da! There is your randomly generated UUID.

---

Here is an animated gif of the entire process, sans login. It has a runtime of 28 seconds. That gives you 32 seconds to login with your identity provider and still beat the one minute mark!

![In Under a Minute](https://cdn.auth0.com/website/blog/extend/webtasks-getting-started/editor2.gif)

Ok. Now it's your turn. Good luck! Although, you really won't need it.

---

### One More Time!

Well, that was so much fun, let's do it all over again! 

We just used the online [Webtask.io](https://webtask.io/make) Editor, which is full-featured and enables you to completely leverage the Auth0 Webtasks platform. 

But maybe you're one of those developers that is particular about using your own code editor because you've got a hundred different optimized custom shortcuts setup or such. Well, then you just might prefer the `wt-cli` command line tool. So, just for you we'll deploy our UUID generator service again via the terminal. 

*Ready, and... GO!*

- Install the command line tool: `npm i -g wt-cli`

- Initialize the tool with your email: `wt init <your-name@some-domain.com>`

- Enter your verification code from the email you receive.

- Congrats! You now have an account on the Webtask.io platform!

- Create the code file: `echo "module.exports = cb => cb(null, require('node-uuid').v4());" > uuid.js`

- Create the webtask: `wt create uuid.js --dependencies node-uuid`

- Copy the URL returned from the 'create' command.

- Hit the webtask URL: `curl https://<your-container-id>.run.webtask.io/uuid`

- Ta-da! There is your randomly generated UUID.

---

And just for the sake of completeness, here's an animated gif of me entering the above commands. It's thrilling stuff!

But in all seriousness, to download the tool, create an account, deploy the code and execute it within the span of time that an animated gif executes is pretty impressive.

![And Now From the Command Line](https://cdn.auth0.com/website/blog/extend/webtasks-getting-started/cmd-line2.gif)

---

### So what is the Auth0 Webtasks platform exactly?

Auth0 Webtasks is a technology we developed here at Auth0 for safely executing code behind an HTTP endpoint without having to provision and maintain a server. Call it "serverless". Call it "Function-as-a-Service" (FaaS). Call it a "microservices" platform. Call it whatever you want--it is a flexible and feature-rich platform for getting code--and possibly untrusted code at that--quickly deployed in an isolated environment where it will execute securely and with low latency. We've been using the technology for many years both internally and in [Auth0's flagship identity product](https://auth0.com).

Just recently we also launched a new product, [Auth0 Extend](https://authom.com/extend), which you can read more about [here](https://auth0.com/blog/introducing-auth0-extend-the-new-way-to-extend-your-saas/). Auth0 Extend allows SaaS providers to leverage the Auth0 Webtasks technology to give their customers a far superior extensibility experience than with traditional webhooks. Auth0 Extend is extensibility as a service.

We also created the Auth0 [Webtask.io](https://webtask.io/) site, which is a free playground for trying out the Auth0 Webtask technology when you're considering integrating Auth0 Extend into your SaaS product. Earlier in this post we used the Auth0 Webtask Editor to deploy our UUID generator endpoint.

I highly encourage you to check out [Auth0 Extend](https://authom.com/extend) to learn more about the Auth0 Webtasks technology and all of the features it offers.


