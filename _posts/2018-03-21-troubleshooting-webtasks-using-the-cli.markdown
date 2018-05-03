---
layout: post_extend
title: "Troubleshooting Webtasks: Using the CLI"
description: "Learn how to troubleshoot webtasks from monitoring logs in the editor all the way to debugging locally using devtool and visual studio code."
longdescription: "The Webtasks technology that powers Auth0 Extend, Webtask.io and Auth0 Hooks is a very powerful system. Learn how to troubleshoot webtasks from monitoring logs in the editor all the way to debugging locally using devtool and visual studio code."
date: 2018-03-21 08:00
category: Extend, Technical, Webtasks
press_release: false
is_non-tech: false
canonical_url: true
author:
  name: "Bobby Johnson"
  url: "https://twitter.com/NotMyself"
  mail: "bobby.johnson@auth0.com"
  avatar: "https://cdn.auth0.com/website/blog/profiles/bobbyjohnson.png"
design:
  bg_color: "#3445DC"
  image: https://cdn.auth0.com/blog/troubleshooting-webtasks/logo.png
tags:
- extend
- webtasks
- debugging
related:
  - 2017-08-01-auth0-webtasks-the-quickest-of-all-quick-starts
  - 2018-03-14-troubleshooting-webtasks-using-the-editor
  - 2018-03-28-troubleshooting-webtasks-using-debuggers
---

**TL;DR:** In this series, we will learn how to troubleshoot webtasks from monitoring logs in the editor all the way to debugging locally using devtool and visual studio code.

The full list of posts in this series:

- [Troubleshooting Webtasks: Using the Editor](https://auth0.com/blog/troubleshooting-webtasks-using-the-editor/)
- [Troubleshooting Webtasks: Using the CLI](https://auth0.com/blog/troubleshooting-webtasks-using-the-cli/)
- [Troubleshooting Webtasks: Using Debuggers](https://auth0.com/blog/troubleshooting-webtasks-using-debuggers/)

This post covers the tools built into the WT CLI, here are some shortcuts to help you locate the topics you are interested in quickly.

- <a href="#connecting-to-the-log-stream" target="_self">Connecting to the log stream with the CLI</a>
- <a href="#run-webtask-locally" target="_self">Run webtask locally with the CLI</a>

---


The Webtasks technology that powers [Auth0 Extend](https://auth0.com/extend/), [Webtask.io](https://webtask.io/) and [Auth0 Hooks](https://auth0.com/docs/hooks) is a very powerful system. It allows end users to provide the functionality they need by writing simple logic in JavaScript. That JavaScript is then securely sandboxed and executed with extremely low latency while protecting the security and performance of other customers and the technology itself.

Whether you are building a fun weekend project, ensuring your authorized users are members of a specific domain or offering your customers an easy way to customize your SaaS; the Webtasks technology allows you to accomplish your goals without placing the burden of hosting, monitoring or scaling on you or your users.

Even with a technology this powerful, you are going to run into issues at times. A service you depend on may go down. Or a bit of logic might not consider all the possible cases that can arise during execution.

When unexpected events happen, how do you go about troubleshooting the issues? In this post, I will show you the most common ways of troubleshooting a webtask. From simple test executions to full local debugging support, we will cover it all.

## Troubleshooting with the CLI

The tools built directly into the editor are great for troubleshooting a single webtask; especially if it is simple. But using console log statements to troubleshoot a complex webtask or a set of collaborative tasks would quickly grow tedious.

The webtask CLI offers several tools out of the box to help troubleshoot issues with webtasks. The CLI can be used in this way for Auth0 Hooks, Webtask.io or Auth0 Extend deployments.

To set up the CLI for use with Webtask.io, visit [this interactive tutorial](https://webtask.io/cli) which will walk you through the process. Auth0 Hooks users can visit [their tenant settings](https://manage.auth0.com/#/tenant/webtasks) in their management dashboard for similar instructions. And finally, Auth0 Extend customers should already have instructions for setting the CLI up to work with your cluster. If you need help, feel free to [join us in our customer Slack](https://auth0-extend.run.webtask.io/slack-signup) for assistance.


### <span id="connecting-to-the-log-stream"></span>Connecting to the log stream

Using the Logs panel in the editor, we were able to watch live executions of our webtask in real time. With the CLI we can also connect to the log stream, with the added benefit of seeing the logs for all of our webtasks. This is particularly useful when you have scoped your webtasks functions to do a single thing and build functionality up through collaborative tasks.

Connecting to the log stream is a snap with the CLI.

- Open a terminal application
- Execute the command `wt logs`

![Terminal Logs Connect](https://cdn.auth0.com/website/blog/extend/troubleshooting-webtasks/terminal-logs-connect.png)

The webtask CLI will take over your console session and begin streaming log messages. We can see the connection message already.

We can test this functionality out pretty easily using the webtask we created earlier in the editor.

- Click on this link to launch the editor at [https://webtask.io/make](https://webtask.io/make)
- Open the **log-panel** webtask we created earlier
- Click the Runner icon
- Click the **Run** button

![Terminal Logs Error](https://cdn.auth0.com/website/blog/extend/troubleshooting-webtasks/terminal-logs-error.png)

We now see the same runtime exception we got earlier streaming to our console session. Let's create a new webtask that uses the request node module to call our existing webtask to see how the streaming logs show output for both webtasks.

- Click the **Create New** icon located in the left-hand navigation of  the editor
- In the Create New modal select the **Create empty** option
- Name the webtask `call-log-panel`
- Click the **Save** button
- Click the **Wrench** icon located in the upper left of the editor
- Select the **NPM Modules** option from the dropdown menu
- Click the **Add Module** button
- Type `request` in the search box
- Select the `request - 2.83.0` option
- Modify the code using the example below
- Click the **Save** button

```javascript
const request = require('request');

/**
* @param context {WebtaskContext}
*/
module.exports = function(context, cb) {
  const opts = {
        method: 'POST',
        url: '<COPY YOUR URL HERE>',
        json: {name: 'bobby'}
    };

  console.log('Posting Values: ', JSON.stringify(opts.json));

  request(opts, (err, res) => {
    if(err){
      return cb(err);
    }
    return cb(null, res.body);
  });
};
```
This code uses the request node module to post a JSON object to our previous webtask and then returns the response body using the callback function.

**Note:** You need to copy the url to our previous webtask into this code before it works.

We can test this using the Runner panel.

- Click the Runner icon
- Click the **Run** button

![Terminal Logs Multiple Webtasks](https://cdn.auth0.com/website/blog/extend/troubleshooting-webtasks/terminal-logs-multiple-webtasks.png)

We can see the custom logs messages from both the `call-log-panel` and the `log-panel` webtasks streamed to the console. Being able to see interleaved logs like this, makes it much easier to track down which webtask is causing a problem in a set of collaborative webtasks.

**Note:** At any time you can hit `CTRL-C` to disconnect from the log stream.


### <span id="run-webtask-locally"></span>Run webtask locally

At this point, we are still deploying a webtask every time we wish to test its execution. The webtask CLI gives us the ability to host our webtask logic locally. We can then iterate faster on the logic and only deploy once we are satisfied it is working correctly.

Let's create a local copy of our last webtask and host locally using the CLI.

- Open a terminal application
- Execute the command `touch task.js`
- Open the task.js file in a text editor
- Copy the `call-log-panel` code into the file
- Save the file

We now have a local version of our webtask. To execute it locally, we need access to the request node module. We can use a standard node package.json as if we were working on a regular node project.

- Execute the command `npm init`
- Accept the default values by hitting `Enter` until the package.json is written
- Execute the command `npm install request --save`

We can now run the webtask code locally using the CLI.

- Execute the command `wt serve task.js`

![Terminal Serve First Run](https://cdn.auth0.com/website/blog/extend/troubleshooting-webtasks/terminal-serve-first-run.png)

The CLI will spin up the webtask listening on port 8080 and begin waiting for a request.

- Open a new browser tab
- Navigate to [http://localhost:8080](http://localhost:8080)

![Terminal Serve Execution](https://cdn.auth0.com/website/blog/extend/troubleshooting-webtasks/terminal-serve-first-execution.png)

We can now see the logged messages from the webtask directly in our console. Note that the Webtasks backend messages are not there, we are running locally. Also, we are calling the `call-log` webtask and do not see the logs messages coming from it. When serving locally, we are completely isolated.

It is also worth pointing out that the local serve method does not support live reload when our task.js code is updated. As with the log stream, we can hit `CTRL-C` to stop the hosted task.

The serve functionality of the WT CLI gives you access to all of the Webtask functionality including meta and secret values as well as local storage simulation. For detailed instructions, see the [Webtask Workshop](https://github.com/auth0/webtask-workshop).


# Summary

In this post, we have covered various techniques available via the WT CLI to troubleshoot failures. These techniques work with all of the products using the Webtasks technology. Feel free to bookmark this post and reference it when you are working on your next project.

In the next post, we will cover using the [Webtask CLI, Devtool and Visual Studio Code](https://auth0.com/blog/troubleshooting-webtasks-using-debuggers/) to get a full IDE debugging experience.
