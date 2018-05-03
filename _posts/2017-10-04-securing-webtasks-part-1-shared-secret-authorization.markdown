---
layout: post_extend
title: "Securing Webtasks Part 1: Shared Secret Authorization"
description: "Learn how to quickly secure your Auth0 Webtasks with a shared secret so only authorized callers can execute them."
date: 2017-10-04 8:30
is_extend: true
category: Extend, Technical, Webtasks
canonical_url: true
author:
  name: "Bobby Johnson"
  url: "https://twitter.com/NotMyself"
  mail: "bobby.johnson@auth0.com"
  avatar: "https://cdn.auth0.com/website/blog/profiles/bobbyjohnson.png"
design:
  bg_color: "#3445DC"
  image: https://cdn.auth0.com/website/blog/extend/securing-webtasks-part-1-shared-secret-authorization/webtasks.png
tags:
  - extend
  - Auth0 Webtasks
  - Webtasks
related:
  - 2017-08-01-auth0-webtasks-the-quickest-of-all-quick-starts
  - 2017-05-19-serverless-webhooks-with-auth0-extend
  - 2017-08-22-for-the-best-security-think-beyond-webhooks
---

Recently, [we've](https://auth0.com/blog/auth0-webtasks-the-quickest-of-all-quick-starts/) shown you how quickly you can stand up an HTTPS endpoint on the internet using Auth0 Webtasks with the Webtasks sandbox [webtask.io](https://webtask.io/). Shockingly, it takes less than a minute.

The ease with which you can deploy that endpoint and glue together the services you use like Github and Slack make Webtask.io very powerful.

However, if you create a webtask that sends messages to Slack channels when triggered by Github, you wouldn't want anyone but Github to be able to invoke your webtask.

This is the first in a series of posts on securing your Webtasks, these are the other posts in the series:

- [Securing Webtasks Part 1: Shared Secret Authorization](https://auth0.com/blog/securing-webtasks-part-1-shared-secret-authorization/)
- [Securing Webtasks Part 2: Using Middleware](https://auth0.com/blog/securing-webtasks-part-2-using-middleware/)

In this post, I will show you the simplest possible way to secure your webtasks using a shared secret for authorization.

To get started let's create a new webtask using the Webtask.io Editor.

- Click on this link to launch the editor at [https://webtask.io/make](https://webtask.io/make).
- Login with the identity provider of your choice.
- Click the **Create a new one** link located in the middle of the page.
- In the Create New modal select the **Create empty** option.
- Name the webtask `shared-secret`.
- Click the **Save** button.

![Create New](https://cdn.auth0.com/website/blog/extend/securing-webtasks-part-1-shared-secret-authorization/create-new.gif)

## Useful Editor Tools

For the rest of this post, we will be using the editor exclusively. So let's take a quick tour of the editor features we will be using. Just above the default code are a series of icons.

![Editor Tools](https://cdn.auth0.com/website/blog/extend/securing-webtasks-part-1-shared-secret-authorization/tools.png)

To the left is the **wrench** icon which is a drop-down menu containing several tools we can use to configure our webtask. To the right are **save**, **logs** and **runner** icons.

Let's open a few tools to help us develop our webtask.

- Click the **LOGS** icon.
  - This opens the logs panel, which will give us real time logs for our webtask. We can use `console.log` to write our own messages to this panel.
- Click the **RUNNER** icon.
  - This opens the runer panel, which will allow us to execute our webtask directly from the editor.

Give it a try, click the **Run** button located in the runner panel. Once complete the runner will display the status of the execution as well as the response sent by the webtask execution. You will also see a log entry added to the logs panel showing the execution.

Finally, in the footer of the editor is displayed the url for the webtask along with a copy icon.

- Copy the url.
- Paste it in to a new browser window.

As you can see, the webtask is completely unsecured and available to anyone with the URL.

![Open Tools](https://cdn.auth0.com/website/blog/extend/securing-webtasks-part-1-shared-secret-authorization/open_tools.gif)

## Securing The Webtask with a Shared Key

Next, let's add a bit of logic to ensure only authorized callers are able to execute the webtask by checking the query string for a secret. If the secret is correct, we will allow execution of the webtask. If not we will throw an error.

Modify the webtask code using this JavaScript and click the **Save** button.

```javascript
module.exports = function(context, cb) {
  if(context.query.secret !== 'open-sesame') {
    cb(new Error('Not Authorized'));
  } else {
    cb(null, { question: 'Am I secure?', answer: 'Yes!' });
  }
};
```

We can test this logic using the runner panel. The runner is currently displaying the response from our previous test. So we need to reset it by clicking the gear icon located near the top. Notice that the runner panel maintains a history so you can always look at previous run settings.

- Click the **gear** icon in the runner panel, if needed.
- In the **Url Params** section, add `secret` and `open-sesame` for the key and value.
- Click the **Run** button.

**Note:** Url Params are applied to the execution of the webtask as query string parameters.

The runner displays the same success result we saw before. Let's modify the secret value and run the webtask again.

- Click the **gear** icon in the runner panel.
- Modify the secret value to `wrong-key`.
- Click the **Run** button.

The runner now displays an HTTP status of 400 and a "Not Authorized" error object is displayed in the response section.

![Testing with the Runner](https://cdn.auth0.com/website/blog/extend/securing-webtasks-part-1-shared-secret-authorization/using-runner.gif)

## Handling HTTP Status Codes

The webtask is working as expected, but it would be nice if it would return an HTTP 403 status and not include a body when the request is not authorized. This allows client libraries to handle the authorization error gracefully.

Currently, the webtask uses a [programming model](https://webtask.io/docs/model) in which the code is invoked with a **context** object and a **callback** function. Simply by returning your own object via the callback, you were able to send back an HTTP 200 response with the object serialized as json. This programming model is simple and intuitive to use.

To send an HTTP 403 response you need access to more of the functionality of HTTP. Webtasks offer an alternative raw HTTP programming model that gives you direct access to the request and response objects used by Node.js.

Modify the webtask code using this javascript and click the **Save** button.

```javascript
module.exports = function(context, request, response) {
  if(context.query.secret !== 'open-sesame') {
    response.writeHead(403);
    response.end();
  } else {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ question: 'Am I secure?', answer: 'Yes!' }));
  }
};
```

**Note:** You have a lot more flexibility now, but it is your code's responsibility to correctly write the status code, headers, and content directly to the response stream. The code even has to stringify the secured response correctly!

Use the runner panel to verify the changes work as expected. You should now see an HTTP 403 if the shared key is incorrect.

![Retest with the Runner](https://cdn.auth0.com/website/blog/extend/securing-webtasks-part-1-shared-secret-authorization/retest-status-runner.gif)

Only callers that have access to the secret can invoke the webtask. Since all webtasks are hosted behind an HTTPS endpoint, the SSL/TSL connection ensures that the query-string is encrypted and so sending our secret over the wire is reasonably secure.

Generally speaking, it is a better practice to pass secrets in headers instead of using the query string. This makes it less likely that your secrets will be logged along the way. In part 2 of this series, I'll show you an example of accomplishing this.

## Securely Storing The Shared Key

Currently, the shared key is hardcoded in your webtask code. That means you have to make sure to keep your code just as secure as the webtask itself. Keeping secrets in code is an awful idea, and it soon becomes untenable with even the simplest of projects.

It's quite common to write code that contains secrets, whether these are credentials for connecting to a database, or API keys for integrating with a third-party service.

Secrets can be easily defined in the editor at any time. They are kept in an encrypted state separate from the code in the webtask infrastructure. The secrets decrypted and provided to the code via the **context** object only during execution.

Update the code to retrieve the shared secret from the **context** object. You need to identify the secret via a key name, so use the key `auth-secret` but any key name would suffice.

Modify the webtask code using this javascript and click the **Save** button.

```javascript
module.exports = function(context, request, response) {
  if(context.query.secret !== context.secrets['auth-secret']) {
    response.writeHead(403);
    response.end();
  } else {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ question: 'Am I secure?', answer: 'Yes!' }));
  }
};
```

Now store the shared secret key using the secrets panel.

- Click the **Wrench** icon
- Select the **Secrets** option from the dropdown menu.
- Click the **Add Secret** button.
- In the **Add Secret** modal:
  - Set the key to `auth-secret`.
  - Set the value to `open-sesame`.
- Click the **Save** button.

![Save Secret](https://cdn.auth0.com/website/blog/extend/securing-webtasks-part-1-shared-secret-authorization/save-secret.gif)

If you re-run the test case using the runner, you'll see the same behavior as before. However, now you aren't hard-coding the secret in your webtask code, so you don't have to worry about keeping out webtask code itself secret from other developers.

You have now successfully secured your Webtask with a shared secret. Wasn't that easy?

## Summary

So, consider where you are now. You've made some great strides in your attempt to secure your webtask. You're using a shared secret that only authorized callers should know. And that secret isn't hard-coded into your webtask code, so you don't have to worry about other developers having access to your code.

But look at the webtask code your currently have. The majority of the logic is dealing with the more sophisticated programming model needed to properly handle authorization. The inital unsecured webtask was three lines of code. Sure, the short and sweet code wasn't secure, but still nobody would deny that it would be nice to use the simpler programming model style webtask and yet still have the same authorization mechanism.

Well, it turns out we can write short and sweet webtasks and still have robust authorization. And in the next post I'll show you how it's done by using [Webtasks Middleware](https://auth0.com/blog/securing-webtasks-part-2-using-middleware/). We will also migrate from using query string based tokens to authorization headers.