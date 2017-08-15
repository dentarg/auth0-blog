---
layout: post_extend
title: "Extend Salesforce with Node.js"
description: "Introducing Auth0 Extend for Salesforce! Extend Salesforce using Node.js in just a few clicks."
date: 2017-08-15 12:00
is_extend: true
category: Extend, Technical, Salesforce
author: 
  name: "Bobby Johnson"
  url: "https://twitter.com/NotMyself"
  mail: "bobby.johnson@auth0.com"
  avatar: "https://cdn.auth0.com/website/blog/profiles/bobbyjohnson.png"
design: 
  bg_color: "#3445dc"
  image_size: "100%"
  image_bg_color: "#3445dc"
  image: "https://cdn.auth0.com/website/blog/extend/auth0-extend-salesforce-with-node/salesforce_header.svg"
tags: 
  - extend
  - Auth0 Webtasks
  - Webtasks
related:
  - 2017-05-16-introducing-auth0-extend-the-new-way-to-extend-your-saas
  - 2017-05-19-serverless-webhooks-with-auth0-extend
  - 2016-06-28-building-serverless-apps-with-webtask
banner: 
  action: https://auth0.com/extend/salesforce
  text: Extend for Salesforce with Node 8
  cta: Try It Out

---

**tl;dr**: Extend for Salesforce lets you implement triggers in Node 8 with full access to 400k NPM modules. Check it out [auth0.com/extend/salesforce](https://auth0.com/extend/salesforce).

---

Salesforce is a powerful and mature SaaS CRM platform that developers can customize to meet their organization's business needs. For instance, you can author custom triggers which attach to the lifecycle of Salesforce objects. One catch, you need to learn Apex. If you are a NodeJS/Javascript developer, who has never worked with Apex, this can be a big jump. You need to move to a new language and ecosystem. That is until now.

We want to enable NodeJS developers to harness the power of the Salesforce platform using the language and ecosystem they already know.

---

### Extend for Salesforce

<script src="//fast.wistia.com/embed/medias/9rbvygfpkj.jsonp" async></script>
<script src="//fast.wistia.com/assets/external/E-v1.js" async></script>
<div class="empower-video-button wistia_embed wistia_async_9rbvygfpkj popover=true popoverContent=html">
  <img class="video-button" src="https://cdn.auth0.com/website/auth0-extend/icons/empower-button-video.svg" alt="button">
  <img class="video-screen" src="https://cdn.auth0.com/auth0-extend/assets/extend-salesforce-screen-2.jpg" alt="Screen">
</div>

---

Today we are announcing the public beta of [Extend for Salesforce](https://auth0.com/extend/salesforce). You can now implement triggers in Node v8 and you can leverage any of the more than 400K modules in the NPM ecosystem. Best of all you can do this right from the browser. With Extend for Salesforce, your team can quickly and easily customize your Salesforce logic using a language many modern programmers already use.

Want to notify your employees every time a big deal closes? You can quickly create a Node trigger on the Opportunity object so that when it closes, a notification is sent to Slack.

Wouldn't it be nice if every time you added a lead in Salesforce, it was also added to your Marketo campaigns? Add a trigger on the lead object, pull in the [marketo-rest-api](https://www.npmjs.com/package/marketo-rest-api) module, and use it to send the lead along.

Extend for Salesforce is built on [Auth0 Extend](https://auth0.com/extend/), our extensibility as a service platform. It can let your customers create extensions to your SaaS quickly and easily. Sign up for our free developer account [here](https://auth0.com/extend/try).

---

### Take It for a Spin

Let's walk through a simple use case for sending a Slack notification to the team whenever a new lead is created. First, you need to create an **Incoming Webhook** in Slack.

- Naviate to [Incoming Webhooks](https://my.slack.com/services/new/incoming-webhook/) on Slack
- Select #general from the Post to Channel drop down
- Click the Add Incoming WebHooks integration button
- Copy the Webhook URL

![get webhook url](https://cdn.auth0.com/website/blog/extend/auth0-extend-salesforce-with-node/get_webhook_url.gif)

---

Head over to [Extend for Salesforce](https://auth0.com/extend/salesforce/app) and log in, if you have not done so already. Follow these steps.

- Click the Create New Trigger button
- Name it "SendToSlack"
- Select the *Lead* Salesforce object
- Select the *After Insert* event
- Finally, click the Create button

You should now see the Extend Editor. Click the double headed arrow icon in the lower left-hand corner of the editor to give you some room to work.

![create trigger](https://cdn.auth0.com/website/blog/extend/auth0-extend-salesforce-with-node/create_trigger3.gif)

---

Secrets are a secure storage feature of Extend for Salesforce. The values are encrypted while stored and decrypted only for execution. Let's hide your Slack Webhook URL there.

- Click the wrench icon in the upper left-hand corner of the editor
- Select Secrets
- Click the Add Secret button
- Enter "slack_url" as the key
- Enter the Slack Webhook URL as the value
- Click the Save button
- Close Secrets

![add secret](https://cdn.auth0.com/website/blog/extend/auth0-extend-salesforce-with-node/add_secret.gif)

---

You will be using the slack-notify NPM module to send mesages to Slack. You will need to add it as a dependency.

- Click the wrench icon in the upper left-hand corner of the editor
- Select NPM Modules
- Click the Add Module button
- Enter "slack-notify"
- Hit Enter
- Close NPM Modules

![add NPM module](https://cdn.auth0.com/website/blog/extend/auth0-extend-salesforce-with-node/add_module2.gif)

---

We have added some helpful comments to get you started. However, for now, add the following code and click the Save button.

```javascript
module.exports = (ctx, cb) => {

  var slack = require('slack-notify')(ctx.secrets.slack_url);
  var item = ctx.body.new[0];

  var message = {
    channel: 'general',
    username: 'Salesforce',
    icon_emoji: ':moneybag: ',
    text: `New Lead: ${item.FirstName} ${item.LastName} from ${item.Company}`
  };

  slack.send(message);
  cb();
};
```

This code uses the slack-notify NPM module that was previously added, to send a message to the #general channel in Slack with the username Salesforce. Within your trigger you can use the context object to access secrets like the Slack Webhook url. This code uses `ctx.secrets.slack_url` to initialize the Slack object.

That is all there is to it. Go add a new lead in Salesforce and watch a notification magically sent to Slack. This is just a basic message, you can make it much fancier. Take a look [here](https://api.slack.com/docs/messages) for details on customizing messages for Slack.

---

### Tell Us What You Think

With Extend for Salesforce you have a new way to write triggers, using Node.js! Go try it out [here](https://auth0.com/extend/salesforce/app). We cannot wait to see what you will create with it! Over the coming months, we will be working diligently to add new features based on your feedback.

If your organization is interested in using Extend for Salesforce or you have a tip/suggestion, [let us know](https://auth0.com/extend/salesforce/) via the Talk to Sales link.

**Note:** Special thanks to [James Ward](https://twitter.com/_jamesward) from Salesforce for his [Salesforce Webhook Creator](https://www.jamesward.com/2014/06/30/create-webhooks-on-salesforce-com) which provided inspiration for the approach we used for creating Extend for Salesforce.
