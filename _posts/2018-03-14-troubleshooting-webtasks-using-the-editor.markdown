---
layout: post_extend
title: "Troubleshooting Webtasks: Using the Editor"
description: "Learn how to troubleshoot webtasks from monitoring logs in the editor all the way to debugging locally using devtool and visual studio code."
longdescription: "The Webtasks platform that powers Auth0 Extend, Webtask.io and Auth0 Hooks is a very powerful system. Learn how to troubleshoot webtasks from monitoring logs in the editor all the way to debugging locally using devtool and visual studio code."
date: 2018-03-14 08:00
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
- serverless
- troubleshoot
- webtask-editor
related:
  - 2017-08-01-auth0-webtasks-the-quickest-of-all-quick-starts
  - 2018-03-21-troubleshooting-webtasks-using-the-cli
  - 2018-03-28-troubleshooting-webtasks-using-debuggers
---

**TL;DR:** In this series, we will learn how to troubleshoot webtasks from monitoring logs in the editor all the way to debugging locally using devtool and visual studio code.

The full list of posts in this series:

- [Troubleshooting Webtasks: Using the Editor](https://auth0.com/blog/troubleshooting-webtasks-using-the-editor/)
- [Troubleshooting Webtasks: Using the CLI](https://auth0.com/blog/troubleshooting-webtasks-using-the-cli/)
- [Troubleshooting Webtasks: Using Debuggers](https://auth0.com/blog/troubleshooting-webtasks-using-debuggers/)

This post covers the tools built into the Webtasks Editor, here are some shortcuts to help you locate the topics you are interested in quickly.

- <a href="#watching-execution-with-the-logs-panel" target="_self">Watching execution with the editor Logs panel</a>
- <a href="#testing-with-sample-data-using-the-runner-panel" target="_self">Testing with sample data using the editor Runner panel</a>

---


The Webtasks technology that powers [Auth0 Extend](https://auth0.com/extend/), [Webtask.io](https://webtask.io/) and [Auth0 Hooks](https://auth0.com/docs/hooks) is a very powerful system. It allows end users to provide the functionality they need by writing simple logic in JavaScript. That JavaScript is then securely sandboxed and executed with extremely low latency while protecting the security and performance of other customers and the technology itself.

Whether you are building a fun weekend project, ensuring your authorized users are members of a specific domain or offering your customers an easy way to customize your SaaS; the Webtasks technology allows you to accomplish your goals without placing the burden of hosting, monitoring or scaling on you or your users.

Even with a technology this powerful, you are going to run into issues at times. A service you depend on may go down. Or a bit of logic might not consider all the possible cases that can arise during execution.

When unexpected events happen, how do you go about troubleshooting the issues? In this series, I will show you the most common ways of troubleshooting a webtask. From simple test executions to full local debugging support, we will cover it all.

## The tools built right into the editor ##

The webtask editor is a full-featured development environment right in your browser. The editor can be embedded directly in your SaaS product and customized to look and feel just like a part of your user interface. 

![Auth0 Hooks Editor](https://cdn.auth0.com/website/blog/extend/troubleshooting-webtasks/auth0-hooks-editor.png)

Auth0 Hooks, the serverless extensibility feature of Auth0, uses the editor to offer templates tailored to the customization point. During the Client Credentials Exchange event, webtasks give access to the calling client, the requested scope, and audience that allows for customization of the generated access token.

![Webtask.io Editor](https://cdn.auth0.com/website/blog/extend/troubleshooting-webtasks/webtask-io-editor.png)

Webtask.io uses all the editor features available to give us as close to a local development experience as possible. It is a snap to add references to our favorite NPM modules, set up a task to run on a schedule or synchronize our code with a GitHub repository.

Auth0 Extend customers can use any of these built-in features or create their own that plug right into the editor.

### <span id="watching-execution-with-the-logs-panel"></span>Watching execution with the Logs panel

The simplest way to troubleshoot a webtask is to monitor its execution with the Logs panel. The Logs panel is available by default in both Auth0 Hooks and on Webtask.io.

When opened the Logs panel will connect to a live stream of events for our webtask. We can execute the webtask and see the execution happen in the log stream.

Let's give it a shot using Webtask.io. 

- Click on this link to launch the editor at [https://webtask.io/make](https://webtask.io/make)
- Login with the identity provider of your choice
- Click the **Create a new one** link located in the middle of the page
- In the Create New modal select the **Create empty** option
- Name the webtask `log-panel`
- Click the **Save** button

We now have a simple webtask we can use to experiment with the Logs panel. To access it, look for the Logs icon in the upper right-hand corner of the editor. We can also access it using the keyboard shortcut CMD/CTRL-L.

![Open Logs Icon](https://cdn.auth0.com/website/blog/extend/troubleshooting-webtasks/webtask-io-open-logs-icon.png)

The Logs panel has a simple interface giving us options to close, search, auto scroll and clear the log. We also see a message letting us know that we have successfully connected to the log stream.

![Logs Interface](https://cdn.auth0.com/website/blog/extend/troubleshooting-webtasks/webtask-io-logs-interface.png)

In the footer of the editor, we find the url for our webtask along with a copy icon.

![Copy Webtask](https://cdn.auth0.com/website/blog/extend/troubleshooting-webtasks/webtask-io-copy-webtask-url.png)

- Copy the url.
- Paste it into a new browser window.

![Logs First Execution](https://cdn.auth0.com/website/blog/extend/troubleshooting-webtasks/webtask-io-logs-first-execution.png)

Look at the Logs panel, and you will see information about the execution of the webtask. We can see that a request for webtask execution was received and it was completed successfully returning an HTTP status of 200 in about 100 milliseconds.

- Tick the autoscroll box
- Return to the browser we used to execute the webtask
- Execute the task a few more times by hitting refresh

![Logs Many Executions](https://cdn.auth0.com/website/blog/extend/troubleshooting-webtasks/webtask-io-logs-many-executions.png)

Look at the Logs panel again and notice that the log is staying in sync with the latest messages. We can search the text for completed webtask executions to ensure successful HTTP 200 responses easily.

- Click the search box in the Logs panel
- Enter the text `finished webtask request`

![Logs Search](https://cdn.auth0.com/website/blog/extend/troubleshooting-webtasks/webtask-io-logs-search.png)

The log messages are filtered to only the lines containing the search text where we can see that all the executions completed successfully.

We can easily write out messages to the log using the methods we are familiar with on the console object.

- Modify the code using the example below
- Click the **Save** button

```javascript
/**
* @param context {WebtaskContext}
*/
module.exports = function(context, cb) {
  console.log('Query String Values: ', JSON.stringify(context.query));
  cb(null, { hello: context.query.name || 'Anonymous' });
};
```

We have modified the code to log out the stringified version of the query object located on the webtask context.

- Click the **Save** button
- Return to the browser we used to execute the webtask
- Execute the task again
- Modify the url to add the query string `?name=bobby`
- Execute the task again

![Logs Search](https://cdn.auth0.com/website/blog/extend/troubleshooting-webtasks/webtask-io-logs-executions-console-log.png)

Return to the editor and look at the Logs panel. We can see both our executions along with our custom log message detailing the contents of the query string values passed during execution.

Using this simple method, we can quickly capture errors and log them into the log stream. 

Note that logs on Webtask.io are not persisted for review later, so you will need to connect via the Logs panel or the CLI and leave them connected while troubleshooting. We will see how to connect via the CLI shortly.

### <span id="testing-with-sample-data-using-the-runner-panel"></span>Testing with sample data using the Runner panel

In the previous section, we used a separate browser window to execute our webtask. This technique was a bit tedious and doesn't work if we need to POST data to our webtask.

Luckily the editor has a built-in way to execute a webtask providing sample data via the Runner panel. It allows us to execute all the HTTP verbs; GET, POST, PUT, PATCH and DELETE. We can set header values, url parameters, and body content.

To access the Runner panel, look for the Runner icon in the upper right-hand corner of the editor. We can also access it using the keyboard shortcut CMD/CTRL-ALT-R.

![Open Runner Icon](https://cdn.auth0.com/website/blog/extend/troubleshooting-webtasks/webtask-io-open-runner-icon.png)

Let's run our existing webtask using the Runner panel.

- Click the **Url Params** section of the Runner panel
- Enter `name` for the key
- Enter `bobby` for the value
- Click the **Run** button

![Url Param Execute](https://cdn.auth0.com/website/blog/extend/troubleshooting-webtasks/webtask-io-url-params-execute.png)

The Runner will execute our webtask and display the results including the HTTP status, any headers and the response returned.

![Url Param Execute Logs](https://cdn.auth0.com/website/blog/extend/troubleshooting-webtasks/webtask-io-url-params-execute-logs.png)

If the Logs panel is still open, we can see the execution logged there as well. No need to switch back and forth between multiple windows.

But what about POST data? Let's modify the webtask code so that it pulls information from the body of the request.

- Modify the code using the example below

```javascript
/**
* @param context {WebtaskContext}
*/
module.exports = function(context, cb) {
  console.log('Post Body Values: ', JSON.stringify(context.body));
  cb(null, { hello: context.body.name || 'Anonymous' });
};
```

We have modified the code so that it uses the body object located in the webtask context instead of the query object.

![Run Again Icon](https://cdn.auth0.com/website/blog/extend/troubleshooting-webtasks/webtask-io-run-again-icon.png)

Note that the icon for the Runner in the upper right-hand corner turns into a Run Again icon while the Runner panel is open.  Clicking it will cause the current webtask code to be saved and then execute using the last used values in the Runner panel.

Let's give it a try.

- Click the **Run Again** icon

<div style="text-align:center">
<img src="https://cdn.auth0.com/website/blog/extend/troubleshooting-webtasks/webtask-io-url-params-execute-error.png" />
</div>

We have now generated a runtime error! Notice that the Runner panel is displaying execution results including an HTTP status of 500. The response also shows details about the error encountered.

![Run Again Error Logs](https://cdn.auth0.com/website/blog/extend/troubleshooting-webtasks/webtask-io-url-params-execute-error-logs.png)

In the Logs panel, we also see the same information logged to the logs stream. The error we are receiving is a TypeError with the message "Cannot read property 'name' of undefined."

![Run Again Error Logs Console Log](https://cdn.auth0.com/website/blog/extend/troubleshooting-webtasks/webtask-io-url-params-execute-error-logs-console-log.png)

By scrolling up a bit in the Logs panel, we can see our custom message letting us know that the body object of the webtask context is undefined.

The reason we are receiving this error is that we executed an HTTP GET request against a webtask that is expecting an HTTP POST.

Let's fix our test case with the Runner panel.

- Click the gear icon located near the top right of the Runner panel
- Select `POST` from the url input dropdown menu
- Delete our previous query key/value pair by clicking the Trash icon under URL Params
- Select `JSON` from the Content-Type dropdown menu in the Body editor
- Add the following JSON to the text area
- Click the **Run** button

```javascript
{
  "name": "bobby"
}
```

![Post Execute](https://cdn.auth0.com/website/blog/extend/troubleshooting-webtasks/webtask-io-post-execute.png)

This execution will succeed, and the Runner panel results will display an HTTP status of 200 as well as our expected response. The custom log message has executed correctly as well.

One final note about the Runner panel functionality; located near the bottom of the panel is a label History. 

- Click the `+` icon located to the right of the History label

![Runner History](https://cdn.auth0.com/website/blog/extend/troubleshooting-webtasks/webtask-io-runner-history.png)

The Runner panel has kept a history of executions for us including HTTP verb and HTTP status code. If we click one of the entries, the panel shows details about that execution.

The Runner panel is handy when we have sample data that we know causes a runtime exception or just to use iteratively as a test while developing a webtask.



# Summary

In this post, we have covered the various techniques available via the Webtask Editor to troubleshoot failures. These techniques work with all of the products using the Webtasks technology. Feel free to bookmark this post and reference it when you are working on your next project.

In the next post, we will cover [using the Webtask CLI](https://auth0.com/blog/troubleshooting-webtasks-using-the-cli/) to monitor logs and execute webtasks locally.
