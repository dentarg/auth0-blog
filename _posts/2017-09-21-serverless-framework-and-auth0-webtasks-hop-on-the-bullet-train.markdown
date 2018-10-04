---
layout: post_extend
title: "Serverless and Auth0 Webtasks, hop on the bullet train"
description: "Learn how you can use the Serverless Framework and Auth0 Webtasks with the new Serverless Webtasks plugin."
date: 2017-09-21 10:21
is_extend: true
category: Extend, Webtask, Serverless
canonical_url: true
author:
  name: "Glenn Block"
  url: "https://twitter.com/gblock"
  mail: "glenn.block@auth0.com"
  avatar: "https://cdn.auth0.com/blog/profiles/glennblock.jpg"
design: 
  bg_color: "#3445DC"
  image: "https://cdn.auth0.com/blog/serverless-webtask/logo.png"
tags: 
  - extend
  - serverless
  - tools
  - extensibility
related:
  - 2017-05-16-introducing-auth0-extend-the-new-way-to-extend-your-saas
  - 2017-05-19-serverless-webhooks-with-auth0-extend
  - 2017-09-11-why-is-serverless-extensibility-better-than-webhooks
---

<img width="75%" src="https://cdn.auth0.com/website/blog/extend/serverless/bullet_train.jpg"/>

If you are developing solutions using Serverless architecture then there's a good chance you've heard of the [Serverless Framework](https://serverless.com/). Serverless provides a tool that makes it much easier for you to deploy functions to the cloud, by handling all the setup and plumbing for you.

Initially Serverless was only available for AWS Lambda. Recently times have changed, and you can now use Serverless for a growing list of providers. 

Today we're announcing the new [Auth0 Webtasks](https://webtask.io) plugin for Serverless! You can use it with our freemium Sandbox, or with your [Auth0 Extend](https://auth0.com/extend) paid subscription. In this post, I'll show you can use the new plugin to develop at maximum velocity. 

*Note*: The Sandbox has a soft limit of 1 execution per second (eps)

## Why
For a while, we've been getting requests to enable using Auth0 Webtasks with Serverless. When we were at Serverlessconf Austin, we heard this directly from the Serverless team. The main reasons we heard, are the same reasons developers love to use Webtasks:

* It is effortless to ramp up.
* Ultra-fast deployment. 
* Simple to use.
* Great HTTP fidelity, really simple to deploy Webhooks or create simple APIs.
* Low latency.
* It is free! 

The ramp-up is something the community really wants, as today you often jump through quite a few hoops to get going. In fact, some went so far as to say we'd have the best ramp-up ever for Serverless! We think they are right.

## The Ramp-up
Let's walk through the setup which is just a few steps.  Getting started with Serverless and Auth0 Webtasks is simple as simple can be:

### Install the latest version of the Serverless framework: 
```
$ npm install -g serverless
```

### Create a new service
Now that serverless is installed, you can create your first service using the new `webtask-nodejs` template.

```
$ serverless create --template webtasks-nodejs --path my-service
```

This will scaffold out a basic service in the `my-service` directory: `handler.js`, `serverless.yml` and `package.json`.

Now install the packages, which will bring down the serverless-webtasks plugin.

```
$ npm install
```

### Create an account with Auth0 Webtasks
Use the following command to setup your account.

```
$ serverless config credentials --provider webtasks
```

You will be asked to supply a phone number or email. Once you do you'll get sent a verification code. Enter the code and you are **DONE** with the setup! 

Didn't I say it was simple?

### Deploy
Go deploy the service.

```
$ serverless deploy
```

Within _seconds_ you should get a response indicating your service is deployed. I measured the deployment with the `time` command, look how fast it was!
<p align="center"><img width="75%" src="https://cdn.auth0.com/website//blog/extend/serverless/deploy_time"/></p>
### Invoke the service
With the service deployed you can now invoke it.

```
$ serverless invoke --function main
```

If everything has worked properly, you should see the following response:

```
{
    "statusCode": 200,
    "body": "{\"message\":\"Go Serverless & Webtasks! Your function executed successfully!\"}"
}
```

*Piece of cake!*

### Handler code
If you open handler.js you'll see the following code. 

```javascript
'use strict';

module.exports = (context, cb) => {
    const message = 'Go Serverless & Webtasks! Your function executed successfully!';
    cb(null, { message });
};
```

A few things to note:

* Auth0 Webtasks are Node.js functions.
  * With the new Serverless plugin, you can author your handlers in **Node 8**. This gives you access to new ES7 features like the `await` keyword. Support for Node 8 is something new that we're rolling out today specifically for the Serverless community!
  * Webtasks support several different [programming models](https://webtask.io/docs/model). The example above shows the most common form. 
* Each Webtask is exposed directly as an HTTP endpoint. There is no special gateway or binding configuration, it is immediately available. 
* The [context](https://webtask.io/docs/context) object allows you to access the request body, query string params, secrets and more.
* The callback object is a standard node callback, which you invoke to tell Webtask the request has completed.

## Going further with Express, Pug and Nexmo.
Now that you've seen the basics, let's go into a more advanced use case where Webtasks really shine. As I mentioned earlier, Webtasks give you strong HTTP fidelity. You can even use `Express` to create handlers that have multiple routes, use connect middleware, etc. 

Let's add a new endpoint to our service that will serve up a web page that we can use to send an SMS message. We'll use `Express` to create a webtask that has 2 routes. The first will render a `Pug` template with a form to collect the phone number and message. The second endpoint will be posted to from the form and use Nexmo's messaging service to send an SMS message.

### Configure the new handler and variables
Open up the serverless.yml file and add a new handler called `smssend`. Also configure the environment to read from a new secrets.yml file that you are going to create in the root.

Your serverless.yml body should look like the following:

```
service: 
  name: webtasks-nodejs  # NOTE: update this with your service name

provider:
  name: webtasks

  # you can define service wide environment variables here
  environment: ${file(secrets.yml)}

functions:
  main:
    handler: handler
  smssend:
    handler: smssend

plugins:
  - '@webtask/serverless-webtasks'
```

## Sign up for Nexmo and set secrets
You'll need a Nexmo account. You can sign up for a free trial account [here](https://dashboard.nexmo.com/sign-up). Once you've signed up, you'll be able to log in the dashboard. From there you can grab your `api_key` and `api_secret` and `from` values from the curl snippet.

Create a new secrets.yml file in the root of your service, and the three key/values pairs you copied from Nexmo. The file should look similar to the following.

```
api_key: 0ae2ea9d
api_secret: 0878134fa9051cc4
from: 12036768629
```

*Note*: If you are publishing your service to a git repo, please add this file to your `.gitignore` before you do it ;-).

## Install packages
There are several npm packages you'll need. Use the following command to install them.

```
npm install --save webtask-tools body-parser express nexmo pug
```

Here is a list of the modules that you have installed.

* webtask-tools - provides a helper for building Express webtasks
* express - used for having multiple routes in our task
* body-parser - middleware used for parsing the HTML FORM body that will be posted.
* pug - used for rendering the HTML page
* nexmo - user for sending SMS messages.

## Create the handler
Create a new smssend.js file and paste the following

```javascript

// require modules
var express = require('express');
var fromExpress = require('webtask-tools').fromExpress;
var bodyParser = require('body-parser');
var Nexmo = require('nexmo');
var pug = require('pug');
var app = express();

// configure to support form url encoding
app.use(bodyParser.urlencoded({ extended: true }));

// define a route for returning the HTML page
app.get('/', (req, res) => {
  res.send(renderView());
});

// define a route for sending the SMS message
app.post('/send', (req,res) => {
  // to get the context in an Express Webtask, you access webtaskContext off of the request.
  var ctx = req.webtaskContext;

  // grab the secrets
  var secrets = ctx.secrets;
  var api_key = secrets.api_key;
  var api_secret = secrets.api_secret;
  var from = secrets.from;

  // initialize Nexmo
  var nexmo = new Nexmo({
      apiKey: api_key,
      apiSecret: api_secret,
    });

  // output the posted body to the logs
  console.log(req.body);

  // send the message
  nexmo.message.sendSms(from, req.body.to, req.body.message, (err, data) => {
    const status = err ? 400 : 200;
    const message = err ? err.message : 'Sent!';
    res.writeHead(status, { 'Content-Type': 'text/html' });
    return res.end('<h1>' + message + '</h1>');
  });
});

// the page
var page=`
h1 Serverless SMS
form(action='/webtasks-nodejs-dev-smssend/send' method='POST' enctype='application/x-www-form-urlencoded')
  table
    tr
      td 
        p Phone # (including country code)
      td 
        input(name='to' type='text')
    tr
      td 
        p Message
      td 
        input(name='message' type='text')
    tr
      td(colspan='2')
        input(type='submit' text='Send')
    tr`;

// render the page using pug
function renderView() {
  return pug.render(page);
}

module.exports = fromExpress(app); 
```

Here is what the code is doing at a high level:

* Initializes modules, creates an Express app, and configures the `body-parser` middleware.
* Defines the root route. The handler calls a function which renders a `pug` page. 
* Defines the send route. The handler accesses the `context` to grab the secrets that were previously defined in the `secrets.yml` file. Next, Nexmo is initialized and invoked to send the SMS. HTML Output is returned to the user to inform whether or not the send was successful.

## Deploy and Run
```
serverless deploy
```

After deploying you should see that multiple endpoints have been created.  The `severless-webtasks` plugin allows you to have multiple handlers for your service, and will automatically create a separate endpoint / webtask for each one.

```
$ serverless deploy
Serverless: Packaging service...
Serverless: Packaging disabled for function: "main"
Serverless: Packaging disabled for function: "smssend"
Serverless: Deploying function: main...
Serverless: Deploying function: smssend...
Serverless: Successfully deployed function: main
Serverless: Successfully deployed function: smssend
Service Information
service: webtasks-nodejs
stage: dev
endpoints:
  * - https://$$$$$$$$$$.sandbox.auth0-extend.com/webtasks-nodejs-dev-main
  * - https://$$$$$$$$$$.sandbox.auth0-extend.com/webtasks-nodejs-dev-smssend
functions:
  main: webtasks-nodejs-dev-main
  smssend: webtasks-nodejs-dev-smssend
$ 
```

Copy the URL for the `smssend` endpoint and then open your browser and paste it into the address bar. You should see the following form. (I am not a UX developer :-))

![smspage](https://cdn.auth0.com/website/blog/extend/serverless/smspage.jpg)

Enter the destination phone number including the country code, and enter a message. Then click "Send". In a few seconds, you should receive an SMS message!

![message](https://cdn.auth0.com/website/blog/extend/serverless/sms1.png)

## Move to Production
Up until now, you've been deploying to the dev stage, which is the default. Now that you are confident the app works, you can deploy it to to the prod stage.

```
$ serverless deploy --stage prod
Serverless: Packaging service...
Serverless: Packaging disabled for function: "main"
Serverless: Packaging disabled for function: "smssend"
Serverless: Deploying function: main...
Serverless: Deploying function: smssend...
Serverless: Successfully deployed function: main
Serverless: Successfully deployed function: smssend
Service Information
service: webtasks-nodejs
stage: prod
endpoints:
  * - https://$$$$$$$$$$.sandbox.auth0-extend.com/webtasks-nodejs-prod-main
  * - https://$$$$$$$$$$.sandbox.auth0-extend.com/webtasks-nodejs-prod-smssend
functions:
  main: webtasks-nodejs-prod-main
  smssend: webtasks-nodejs-prod-smssend
$ 
```
Once the deployment is done, you'll see the URLs for your production endpoints. Combining stages with Github branches, gives you the power to implement your own dev/test/prod workflows.

## Using your Auth0 Extend subscription.
The freemium Sandbox is great for fairly low-volume / periodic executions (around 1 per second max). If you are a paid Extend customer, you have much greater throughput at your disposal and you can use your subscription with the new plugin. To do this, first install wt-cli.

```
npm install wt-cli -g
```

Create a profile for your Extend instance as specified in our docs [here](https://auth0.com/extend/docs/developer-guide#enabling-command-line-tool-for-your-users)

```
wt init -p {profile-name} \
  --url {host_url} \
  --token {tenant_webtask_token} \
  --container {webtask_container}
```

Once you have created your profile, you can configure your service to deploy using that profile. Open your `serverless.yml` file and add your profile under the webtasks provider.

```
provider: 
  name: webtasks
  profile: my-extend-profile
```

Now the next time you deploy that service, it will use your Extend instance!

## Summary and Next steps
In this post you've seen how you can move at bullet speed in developing Serverless applications using Auth0 Webtasks. This is just the tip of the iceberg of what you can do with the new `severless-webtasks` plugin. [David Wells](https://twitter.com/davidwells) from the Serverless team has a great [post](https://serverless.com/blog/serverless-webtasks/) on the release where he includes a list of common use cases.

* setting up webhook listeners
* running chat bots & slack automation
* glue code & data transformation
* backend apis for static sites
* handling site forms
* github automation
* payment processing with stripe
* ...(use your imagination)

Go check out his post which includes additional resources, several videos, and more! In the videos, you'll also learn how you can use scheduled events.

You can find out more on the plugin in the Serverless [documentation](https://www.serverless.com/framework/docs/providers/webtasks/guide/intro). The plugin is open source, and you can grab the source, file bugs, or contribute (PRs welcome!) in our repo [here](https://github.com/auth0/serverless-webtasks). To learn more about Auth0 Webtasks, head [here](https://webtask.io).

So what are you waiting for? Take it for a spin! Let us know about your experience with using Auth0 Webtasks and Serverless!

*Special thanks to David Wells, and the rest of the Serverless team for helping us make this a reality!*

**Like the new plugin? Give us some love on [Product Hunt](https://www.producthunt.com/posts/serverless-auth0-webtasks)!**

