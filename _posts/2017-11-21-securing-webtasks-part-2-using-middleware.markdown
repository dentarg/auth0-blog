---
layout: post_extend
title: "Securing Webtasks Part 2: Using Middleware"
description: "Learn how to quickly secure your Auth0 Webtasks using middleware so only authorized callers can execute them."
date: 2017-11-21 12:00
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
  - 2017-08-22-for-the-best-security-think-beyond-webhooks
  - 2017-10-04-securing-webtasks-part-1-shared-secret-authorization
---

This is **Part 2** in a series detailing security concerns with the Auth0 Webtask platform. [Securing Webtasks Part 1: Shared Secret Authorization](https://auth0.com/blog/securing-webtasks-part-1-shared-secret-authorization/) covered the following:

- Preventing execution by unauthorized clients
- Using the Log Viewer
- Using the Webtask Editor Runner to test right in the browser
- Using the Full HTTP Control Programming Model
- Using Secrets to securely store sensitive information

In Part 2, we will cover:

- Creating and updating Webtasks using the CLI
- Using Middleware to share crosscutting concerns
- Using Middleware to authorize clients

Let's jump right in and review the current state of our webtask.

```javascript
module.exports = function(context, request, response) {
  if(context.query.secret !== context.secrets['auth-secret']) {
    response.writeHead(401);
    response.end();
  } else {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ question: 'Am I secure?', answer: 'Yes!' }));
  }
};
```

This code currently has two distinct responsibilities. The first is to respond with an HTTP 200 and pass along a JSON formatted object. The second is to check the query string for a secret value and ensure it matches an expected value, sending an HTTP 401 if the check fails.

The code works, but it has several deficiencies. The logic needed to ensure only authorized clients can execute the task obscures what the task does. We must duplicate the authorization code in each webtask we want to be secured. Finally, the shared secret key is being passed along on the query string; this could expose the secret to any infrastructure that might be logging requests.

We can address these deficiencies by separating the authorization logic from the webtask logic and moving the secret key from the query string to an authorization header.

## Understanding Middleware

One way of organizing shared functionality like authorization is to apply it as middleware - a self-contained bit of code that acts on a request before your webtask. Middleware can be built up as a chain of handlers in a stack; this allows them to act as plugins that can be mixed and matched to accomplish the desired result.

Let's look at a simple diagram to illustrate this concept.

![middleware](https://cdn.auth0.com/website/blog/extend/securing-webtasks-part-2-middleware/middleware2.png)

The middleware pipeline starts on the left with an incoming HTTP request. The web framework calls the first middleware in the stack handing off the request and response.

Each middleware in the stack is executed and has the opportunity to pass control on to the next middleware or respond directly. If all middleware pass control on, then the underlying webtask will be executed.

Creating middleware to be used by webtasks is simple, it follows the following format.

```javascript
module.exports = function() {
  return function middlware(request, response, next) {
    // logic to be executed before the webtask
    next(); //call the next middleware
  }
}
```

This code exports a function that when called returns a middleware function that takes the raw HTTP request & response and a next function.

## Implementing Middleware

Previously, we worked exclusively with the Webtask.io Editor. For this example, let's work with the CLI. If you do not have it installed and configured currently, you can find instructions [here](https://webtask.io/cli). It takes about a minute.

If you have the CLI installed, please make sure it is at least version 8.2.0. To update just run the following command.

```bash
npm update -g wt-cli
```

There are two ways to use middlware with webtasks; publish them on [NPM](https://www.npmjs.com/) as node modules or make them available via a URL.

Publishing to NPM is excellent when you intend to share your middleware heavily, and it tends not to change frequently.

Making them available via a URL is handy when you are actively developing your middleware. You can quickly iterate on it and only publish to NPM when it is complete.

[Gists](https://gist.github.com/) are an easy way to host middleware via a URL. The downside is that every time you update a gist the URL changes. So, let's use a simple trick and set up a webtask to host our middleware.

To accomplish this, we will create a webtask that returns our javascript middleware.

- Open your terminal.
- Make a directory for us to work, `mkdir middleware_sample`.
- Change directory, `cd middleware_sample`.
- Create a javascript file, `touch middleware1.js`.
- Open it in your favorite text editor.
- Copy the following code into the file.

```javascript
'use strict';

function createMiddleware() {
  return function middleware(req, res, next) {
    console.log('middleware1:', 'execute');
    next();
  }
}

module.exports = createMiddleware;
```

The first middleware example defines a factory function, which returns middleware function when called. The middleware logs a message to the console when a request is received, then calls the next function.

We want our webtask to return this exact code. So, let's wrap it in a template literal and assign it to a constant.

- Modify the code to wrap the middleware in a template literal.

```javascript
const middleware = `
'use strict';

function createMiddleware() {
  return function middleware(req, res, next) {
    console.log('middleware1:', 'execute');
    next();
  }
}

module.exports = createMiddleware;
`;
```

Next, let's create a webtask export that returns the template literal to all requests.

- Add an export that defines a webtask to return the template literal.

```javascript
module.exports = function(ctx, req, res) {
  console.log('middleware1 factory:', 'execute');
  res.writeHead(200, {'content-type': 'application/javascript'});
  res.end(middleware);
};
```

The webtask code logs a message to the console similar to the middleware function; it also writes a header setting the response content type to `application/javascript` and sends the template literal as the body of the response.

We can publish the task and test it out using the following commands.

```bash
container=$(wt profile get -f container)
wt create --name middleware1 middleware1.js
curl -s -X GET -I "https://$container.run.webtask.io/middleware1" \
  | grep "^content-type:"
curl -X GET "https://$container.run.webtask.io/middleware1"
```

**Note:** These commands assume you are using bash. If you are using another terminal like PowerShell or CMD.exe, the commands may be slightly different.

![create and test middleware](https://cdn.auth0.com/website/blog/extend/securing-webtasks-part-2-middleware/create_test_middleware3.png)

The first command gets a reference to our container, we need this to easily create the URLs used on the following steps. The second command creates the webtask. The next retrieves the headers for the webtask endpoint. The content type `application/javascript` is in the header output. The last command verifies the body contains the middleware script.

 Now, let's create a simple webtask that uses the middleware url as middleware.

- Create a javascript file, `touch task.js`.
- Open it in your favorite text editor.
- Copy the following code into the file.

```javascript
'use strict';

module.exports = function(ctx, cb){
  console.log('task:', 'execute');
  cb(null, { question: 'Am I secure?', answer: 'Not quite yet.' });
};
```

We can publish this task and make it use our middleware endpoint using the following command.

```bash
container=$(wt profile get -f container)
wt create --name sample1 \
  --middleware "https://$container.run.webtask.io/middleware1" \
  task.js
```

![create sample task](https://cdn.auth0.com/website/blog/extend/securing-webtasks-part-2-middleware/create_sample_task2.png)

The CLI created the webtask successfully, but it also recognized we specified a middleware parameter. So, it added a synthetic dependency on the middleware-compiler package for us.

Let's inspect the webtask and take a look at all the things specifying middleware has set up for us. You can inspect your webtask using the following command.

```bash
wt inspect sample1
```

![inspect sample task](https://cdn.auth0.com/website/blog/extend/securing-webtasks-part-2-middleware/inspect_sample_task2.png)

The CLI displays information about the sample webtask. Note that the middleware compiler has been added as a dependency and referenced by the `wt-compiler` meta value. These settings configure the webtask runtime to use middleware in the execution pipeline.

Compilers are an advanced topic that is beyond the scope of this post. However, if you would like to know more, the documentation can be found [here](https://webtask.io/docs/webtask-compilers).

The `wt-middleware` meta value contains a reference to our middleware URL. This value can contain an array of values to define a stack of middleware.

Let's duplicate our middleware URL and create a new webtask that is configured to consume both middlewares.

- Create a copy of middleware1.js, `cp middleware1.js middleware2.js`
- Open it in your favorite text editor.
- Modify the code to change all log messages to use **middleware2**.
- Create a new webtask using the following command.

```bash
wt create --name middleware2 middleware2.js
```

Now we can create a new webtask that uses both middleware URLs.

```bash
container=$(wt profile get -f container)
wt create --name sample2 \
  --middleware "https://$container.run.webtask.io/middleware1" \
  --middleware "https://$container.run.webtask.io/middleware2" \
  task.js
```

If you run the command `wt inspect sample2`, you should now see that the `wt-middleware` setting contains references to both middleware URLs.

Let's connect to the real-time logs using the CLI and execute the webtask.

- Start up the CLI log viewer, `wt logs`.
- Open a new terminal window.
- Execute the following command.

```bash
curl -X GET "https://$(wt profile get -f container).run.webtask.io/sample2"
```

If we look in the terminal window containing our real-time logs, we see the following output.

![real time logs](https://cdn.auth0.com/website/blog/extend/securing-webtasks-part-2-middleware/real_time_logs2.png)

Red dots mark the log messages from our code. We can see the middleware factories, then the middleware, then the webtask executing in order.

Be aware that the middleware factories execute only once per container lifecycle. The webtask runtime fetches the middleware code while it is setting up the container to execute the webtask. That container stays around to service any other requests for a few minutes.

Try executing the previous command again and look at the output from the real-time logs. The factory messages are gone.

## Implementing Shared Secret Middleware

Based on what we have learned about middleware, it should easy to implement middleware that handles our shared secret authorization check.

We also want to change the way we pass our shared secret to use an authorization header instead of leaving it in the query string.

A simple middleware implementation that accomplishes this would look like the following.

```javascript
'use strict';

function createMiddleware() {
  return function middleware(req, res, next) {
    console.log('middleware auth:', 'execute');
    const ctx = req.webtaskContext;

    if (ctx.secrets && ctx.secrets['auth-secret']) {
      const match = (ctx.headers['authorization'] || '')
          .trim()
          .match(/^bearer (.+)$/i);

      if (match && match[1] === ctx.secrets['auth-secret']) {
        console.log('middleware auth:', 'authorized');
        next();
      } else {
        console.log('middleware auth:', 'not authorized');
        const error = new Error('not authorized');
        error.statusCode = 401;
        next(error);
      }
    } else {
      console.log('middleware auth:', 'no secrets, why are you using me?');
      next();
    }
  }
}

module.exports = createMiddleware;
```

This code, while a bit more complex, is straightforward. It pulls the webtask context out of the request giving us access to secrets. It checks to see if a secret value is defined. If it is, it ensures the bearer token value of the authorization header matches the secret. If it does, it allows the execution to continue. If it does not, it creates an error with HTTP status 403 and passes it to the next function. Finally, if there is no secret, there is nothing to do so it allows execution as well.

Let's wrap this middleware up in a factory and publish it as webtask.

- Create a copy of middleware1.js, `cp middleware1.js middleware-auth.js`
- Open it in your favorite text editor.
- Modify the code to change all log messages to use **middleware auth**.
- Replace the contents of the template literal with the middlware code above.
- Create a new webtask using the following command.

```bash
wt create --name middleware-auth middleware-auth.js
```

Now we can create a new webtask that uses all of our middleware URLs.

```bash
container=$(wt profile get -f container)
wt create --name sample-auth \
  --secret auth-secret=open-sesame \
  --middleware "https://$container.run.webtask.io/middleware1" \
  --middleware "https://$container.run.webtask.io/middleware2" \
  --middleware "https://$container.run.webtask.io/middleware-auth" \
  task.js
```

Note that in this `create` command we are passing all three middlewares and setting our `auth-secret` value to 'open-sesame'.

Let's test our new secure webtask.

- Start up the CLI log viewer, `wt logs`.
- Open a new terminal window.
- Execute the following command.

```bash
curl -X GET \
  "https://$(wt profile get -f container).run.webtask.io/sample-auth"
```

We see the following response.

```javascript
{ "message":"not authorized", "statusCode":401 }
```

Flip back to the real-time logs terminal, and we see the following.

![real time logs secure](https://cdn.auth0.com/website/blog/extend/securing-webtasks-part-2-middleware/real_time_logs_secure2.png)

Notice that once again each middleware in the pipeline is executed in order. Until we get to the authorization middleware, the request is not authorized, so execution stops. The webtask is never called.

Now execute the following command.

```bash
curl -X GET \
  -H "Authorization: Bearer open-sesame" \
  "https://$(wt profile get -f container).run.webtask.io/sample-auth"
```

We see the expected payload returned and if we look at the real-time logs, we see all middleware executions followed by the webtask execution.

Wasn't that easy?

One final note, don't worry about writing your own bearer authorization middleware. We already did it for you and [published](https://www.npmjs.com/package/@webtask/bearer-auth-middleware) it to NPM.

To secure your webtasks using it, create them using a command like the following.

```bash
wt create --name module-auth \
  --secret wt-auth-secret=SUPER_LONG_SECURE_TOKEN_VALUE \
  --middleware @webtask/bearer-auth-middleware \
  task.js
```

## Summary

So, let's step back and consider where we are now. We have made significant progress securing our webtask. We have moved our shared secret authorization to middleware that can be easily shared with other webtasks. We have also stopped sending the authorization key as a query string value; handing over as a bearer auth token instead.

This is a pretty good implementation. We do need to make sure that our shared secret remains secure. If it were to leak out, we would have to change it. It would be better if we were using a token authority that uses expiring tokens.

In the next post, we will work on using Auth0 to issue tokens and authorize our webtasks.