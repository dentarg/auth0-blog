---
layout: post_extend
is_extend: true
title: "Connecting Intercom and Slack with a Serverless Webhook"
description: "Learn how to dynamically route Intercom notifications to slack channels using a Serverless Webhook"
date: 2017-05-24 10:00
category: Serverless
is_non-tech: false
canonical_url: true
author:
  name: "Glenn Block"
  url: "https://twitter.com/gblock"
  mail: "glenn.block@auth0.com"
  avatar: "https://cdn.auth0.com/blog/profiles/glennblock.jpg"
design:
  image: "https://cdn.auth0.com/website/blog/extend/intercomslack/Intercom_slack_graphic2.png"
  bg_color: "#3445dc"
  image_bg_color: "#3445dc"
  bg_merge: trues
  image_size: 80%
tags:
- serverless
- extensibility
- webtask
- intercom
- slack
press_release: false
---
# Connecting Intercom and Slack with a Serverless Webhook

In this post I am going to show you how you can connect Intercom via Webhooks to dynamically route messages to Slack by standing up a Serverless Webhook endpoint.

One tool I work with a lot in my day job is [Intercom](https://intercom.com). It is a great product which we use to send Welcome Auto messages to customers when they sign up for our product. What's realy nice about Intercom as opposed to just email, is we can respond right from the Intercom UI where the whole thread is visible to the team. That's why when we decided to launch a [second product](https://auth0.com/extend/) it was a no brainer for us to use it again.

## Challenges integrating Intercom with Slack

As an organization we [live](https://auth0.com/blog/slash-webtasks-all-your-chatops-belong-to-you/) in Slack and as such, we integrate whatever we can to make our lives easier. Fortunately, Intercom has an [integration](https://docs.intercom.com/integrations/slack-integration) with Slack, which we already use. That integration sends all notifications from Intercom to a single Slack channel. For our Extend product, I wanted the Intercom notifications to go to a different channel in order to allow us to have better visibility and management across the products. It became clear the existing Slack integration wouldn't suit my needs.

## Webhooks, local tools, and standing up servers
Fortunately, I found Intercom supports [Webhooks](https://docs.intercom.com/integrations/webhooks). Using the `Create webhook` feature you can create a subscription which will send notifications to an endpoint for further handling. You can see the creation screen below.

<img src="https://uploads.intercomcdn.com/i/o/17010148/7d640259791c81c11d48ef01/New-create-webhook-form.png"/>

Notice the dialog requires you to provide `WEBHOOK URL`. This means you need to stand up an endpoint in order to get that URL. Looking in the [documentation](https://developers.intercom.com/v2.0/docs/webhooks) Intercom recommends developing locally using Sinatra, and exposing the endpoint using Ngrok. This means first you have to install a bunch of tools to develop and run locally. You'll then install deployment tools in order to deploy to a cloud provider like Heroku. Along the way you have plenty of reading to do. Feels very ancient.

![Facepalm](https://cdn.auth0.com/website/blog/extend/intercomslack/facepalm.jpg)

## Serverless Webhooks to the rescue
Thankfully we have a really easy way today to spin up a Webhook endpoint, and we don't need to run anything locally for development or deployment. The answer is [Serverless](https://auth0.com/blog/what-is-serverless/). If you are shaking your head at the name, YES, of course there are servers, the main difference is there are not servers you have to directly worry about or manage. Let's move on.

Using a Serverless platform, you can easily write the code for a Webhook endpoint and have it spin up on-demand in the cloud. There's a number of different options you can choose from and Serverless vendors differ in terms of the experience of creating a Webhook endpoint. Some require you to install tools and do development locally and some require you to jump through extra setup hoops. *Not Webtask*, it shines in this respect. Every Webtask you create IS a Webhook endpoint. Further, you can develop, test and deploy it completely in the browser in JavaScript, and with great support for NPM modules.

For me these qualities of Webtask made it an obvious choice to use for implementing my Webhook.

## Designing the Webtask
The diagram below shows at high level what I was trying to accomplish.

![Flow diagram](https://cdn.auth0.com/website/blog/extend/intercomslack/flow.png)

Whenever Webtask receives a notification, it will look at the contents, if it is a response related to Extend, then it will compose a Slack message and send it to our new `#mktg_intercom_extend channel`.

The devil is of course in the details on each of the above. Next, I'll show you the process I to went through to implement it.

## Quickly setting up a Webhook to inspect the payload.
Rather than read through documentation, when I work with APIs, I often start with exploring the actual payload. For APIs that I am calling, `curl` is often an easy way to do this. In the case of Webhooks, you need an endpoint in order to receive the Webhook. As I said, I didn't want to have to install anything locally. Thankfully with Webtask you don't have to. You can create a Webtask very quickly and plug it in as a Webhook to start seeing the data that is being sent, in this case from Intercom.

To create the webtask, open the browser to [https://webtask.io/make](https://webtask.io/make). Once you do you'll get a sign in prompt, where you can quickly log in with a variety of credentials including Github. Then you'll be taken to a screen to choose what kind of Webtask you want to create.

<a href="https://cdn.auth0.com/website/blog/extend/intercomslack/webtask-create.png" target="_blank"><img src="https://cdn.auth0.com/website/blog/extend/intercomslack/webtask-create.png"></a>

Choose "Webtask" and then then put `intercom-slack-handler`. Once your task is created, you'll see some basic starter code.

<a href="https://cdn.auth0.com/website/blog/extend/intercomslack/webtask-created.png" target="_blank"><img src="https://cdn.auth0.com/website/blog/extend/intercomslack/webtask-created.png"></a>

If you look at the bottom of the screen, you'll see a url for your Webtask. Press the copy button to put this on the clipboard as you will use this shortly.

![Webtask url](https://cdn.auth0.com/website/blog/extend/intercomslack/webask-url.png)

Now let's make a slight modification to the code to have the task write out the payload to the console.

Change the code to the following

```javascript
var util = require('util');

module.exports = function(ctx, cb) {
    console.log(util.inspect(ctx.body, {depth: null}));
    cb(null, null);    
}
```

This will grab the JSON body that Intercom sends and use the `inspect` function to dump it's contents to a string. Inspect is useful because if we just write the object directly with console.log, then nested objects just show as `[object]`. Click the "Save" button and you'll be ready to test.

First click on the `Logs` icon to bring up the log viewer which you'll use to see the output. Clicking on the area above the log viewer search text box, allows you to resize the viewer window. First you need to add the webhook to Intercom. To do this you can head to the developer's management page. From [https://app.intercom.io](https://app.intercom.io) go to `Settings` -> `App settings` -> `Developer Tools` -> `Webhooks`. Click on `Create webhook`. Paste your Webtask URL from the clipboard that you copied earlier into the `WEBHOOK URL` textbox. Next you need to set what notifications to watch. In this case we want to watch whenever there is a reply, so check the `Reply from a user` and `Reply from a teammate` boxes.

It should look similar to the following:

<a href="https://cdn.auth0.com/website/blog/extend/intercomslack/intercom_webhook.png" target="_blank"><img src="https://cdn.auth0.com/website/blog/extend/intercomslack/intercom_webhook.png"></a>

Now click create Webhook. Doing this will send a ping request to the Webhook, and you'll immediately see output.

<a href="https://cdn.auth0.com/website/blog/extend/intercomslack/webhook_ping.png" target="_blank"><img src="https://cdn.auth0.com/website/blog/extend/intercomslack/webhook_ping.png"></a>

The current output is not that helpful yet, however the important thing is you're now setup to iteratively develop the real functionality, and you haven't installed _anything_ locally.

## Inspecting a real notification

First clear the log viewer in the Webtask editor by clicking on the trash button. Now send a test message in order to fire the webhook and see what the real notification looks like. In the Intercom UI, go to your `Manual Messages` and create a new message. Set the audience to be an an account for an email that you own, if you don't have an account, create one. **Make sure the audience shows that you are only sending to your account, otherwise you might inadvertently upset a lot of people** ;-). Below you can see that I am sending a message to myself.

<a href="https://cdn.auth0.com/website/blog/extend/intercom/slack/intercom-test-manualmessage.png" target="_blank"><img src="https://cdn.auth0.com/website/blog/extend/intercom/slack/intercom-test-manualmessage.png"></a>

Check the email that you received and reply. The response should trigger the Webhook. Now when you look in the log viewer you can see what the real payload looks like.

<a href="https://cdn.auth0.com/website/blog/extend/intercom/slack/intercom-email-notification.png"><img src="https://cdn.auth0.com/website/blog/extend/intercom/slack/intercom-email-notification.png"></a>

You can see a gist of the full contents of the log viewer [here](https://gist.github.com/7a64df0bea309f2e413451920b58d72e).

Looking at the payload there are some elements that pop out that you'll need in order to create notifications similar to those created by the Intercom Slack plugin.

* The app id (app_id). This will be needed for generating URLs.
* The subject of the original message `data.item.conversation_message.subject`. You'll need this in order to route to the correct channel.
* The response message `data.item.conversation_parts.conversation_parts[0].body` which is in HTML format.
* The topic `topic`. Currently it is 'conversation.user.replied'. Looking in the docs I can also see that this can be 'conversation.admin.replied' if the reply is from an Intercom admin.
* The `user` and `assignee` information.

## Implementing the Webtask
To implement the Webtask you'll first need to setup an [Incoming Webhook](https://api.slack.com/incoming-webhooks) to get a Slack URL that you can send messages to. You can create this if you are a Slack admin, or talk to your admin. Save the URL for later.

As part of the implementation, you'll need some npm modules to help you extract the raw text from the HTML message body, and for sending to Slack. Webtask has the `html-to-text` and `slack_notify` modules built which will help here.

Here is the code for the completed Webtask, which you can replace your existing task with.

```javascript
//
// requires SLACK_URL and SUBJECT secrets to be defined
//
module.exports = function(context, cb) {
  var slack = require("slack-notify")(context.secrets.SLACK_URL);
  var subject = context.secrets.SUBJECT;
  var htmlToText = require("html-to-text");
  var body = context.body;
  var util = require('util');
  var item, parts, text, conversationUrl;

  function isAuth0ExtendMessage(item) {
    return (item.conversation_message !== null && item.conversation_message.subject.indexOf(subject) > -1);
  }

  function createMessage(color, msgText, channel) {
    var message = {
      channel: channel,
      icon_url: "https://fst.slack-edge.com/2fac/plugins/intercom/assets/service_36.png",
      text: "*Intercom*",
      attachments: [{
        color: color,
        text: msgText
      }]
    }
    return message;
  }

  function composeMessage(text) {
    var from = parts.author.name;
    var to;
    var color;

    if (parts.author.type === 'user') {
      to = item.assignee.name;
      var fromUrl = `https://app.intercom.io/apps/${body.app_id}/users/${parts.author.id}`;
      color = "#4277f4";
      msgText = `<${fromUrl}|${from}> replied to <${conversationUrl}|a conversation> with ${to}\n\n${text}`;
    }
    else
    {
      to = item.user.name;
      color = "#f4b541";

      msgText = `${from} replied to <${conversationUrl}|a conversation> with ${to}\n\n${text}`;
    }

    var channel;

    if (isAuth0ExtendMessage(item))
      channel = "mktg_intercom_extend"
    else
      channel = "mktg_intercom";

    var message = createMessage(color, msgText, channel);
    return message;
  }

  if (body !== null && body.data !== null && body.data.item !== null) {
    item = body.data.item;

    parts = item.conversation_parts.conversation_parts[0];
    text = htmlToText.fromString(parts.body, {
      wordwrap: 130
    });

    conversationUrl = item.links.conversation_web;

    if (text.length > 215) {
      text = text.substring(0, 214) + `... <${conversationUrl}|More>`
    }

    var message = composeMessage(text);
    slack.send(message);
  }

  cb(null, null);
};
```

You'll notice throughout the code the code references parameters of the `context.secrets` object. Secrets provide a way to provide secure data like connection strings, API keys, etc from outside the code. They can also be used for storing configuration information. You should use the [secrets](https://webtask.io/docs/editor/secrets) panel in the Webtask Editor to define the following secrets.

* SLACK_URL - The Slack incoming webhook url you saved earlier.
* SUBJECT - The subject of the email message to match on. The match is whether or not the mail subject contains SUBJECT. In my case the messages for Webtask and Extend have different subjects, so I matched on "Extend". This worked for us, but it might not work for your use case, in which case you should change the logic.

Here is what the code is doing at a high level.

* Checks to see if there is a `body`, and if it has a `data` and `data.item` field.
* Extracts the text from the HTML response message. Trims the text if it is too large.
* Determines the channel by checking if the subject matches
* Composes the message to Send to Slack. This part of the code does a few gymnastics to build up the a message that is almost identical in format to the existing Intercom Slack integration messages.
* Sends the message to Slack.

*Note* For simplicity this code only handles replies, but it can easily be changed to also support internal notes, which we did in our internal version. I'll leave that as a challenge for you.

Save the task. With everything wired up, send another test message as you did earlier. You should see a notification in Slack similar to the following:

<img src="https://cdn.auth0.com/website/blog/extend/intercomslack/slack-notification.png"/>

Success!

## Aside: Going beyond Webhooks with Auth0 Extend
Using Webhooks today for Intercom's extensibility places a burden. You have to sign up for a separate hosting provider, possibly install local tools, create your Webhook implementation, deploy it, and then configure the URL in Intercom. You are not done there though, you also have to now manage this extension for the long haul. Serverless platforms like Webtask make that easier, but that still doesn't remove the maintenance and monitoring burden. You still have to research the different options, stand up the endpoint, and maintain it.

What if that textbox could go away? What if you could just edit the code right in Intercom in an embedded editor? There'd be no seperate accounts to worry about, no seperate endpoints to stand up and manage, no switching contexts. You could stay completely focused on writing the code for the extension.

[Auth0 Extend](https://auth0.net/extend) makes this possible with an embedded code editor for creating extensions and a Serverless runtime for executing them. The demo below shows how Extend could enable you to create your extension right within Intercom!

<img src="https://cdn.auth0.com/website/blog/extend/intercomslack/intercom_video.gif">

## Aside: Securing Applications with Auth0

Are you building a [B2C](https://auth0.com/b2c-customer-identity-management), [B2B](https://auth0.com/b2b-enterprise-identity-management), or [B2E](https://auth0.com/b2e-identity-management-for-employees) tool? Auth0, can help you focus on what matters the most to you, the special features of your product. [Auth0](https://auth0.com/) can improve your product's security with state-of-the-art features like [passwordless](https://auth0.com/passwordless), [breached password surveillance](https://auth0.com/breached-passwords), and [multifactor authentication](https://auth0.com/multifactor-authentication).

[We offer a generous **free tier**](https://auth0.com/pricing) so you can get started with modern authentication.

## Recap
In this post you've seen how to customize Intercom via Webhooks to have custom routing logic for Slack messages. You've learned how to use the Webtask Editor to create a Serverless Webhook endpoint and how you can use the editor to explore the Webhook payload.

Tell us what your experiences have been creating Webhooks. Have you used Serverless platforms to do it? We look forward to hearing from you.
