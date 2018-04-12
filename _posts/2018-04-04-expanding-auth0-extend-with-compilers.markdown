---
layout: post_extend
title: Expanding Auth0 Extend with Compilers
description: A look at how webtask compilers can open your extensions to new possibilities.
longdescription: Compilers allow for incredible customizations for your webtasks, allowing for tasks to be created in different languages with completely different behaviors. 
date: 2018-04-04 12:36
category: Extend, Technical, Webtasks
is_non-tech: false
author:
  name: Raymond Camden
  url: https://www.raymondcamden.com
  mail: jedimaster@auth0.com
  avatar: "https://static.raymondcamden.com/images/ray3_2017.jpg"
design:
  bg_color: "#3445db"
  image: "https://cdn.auth0.com/website/blog/extend/auth0-extend_avatar.png"
tags:
- extend
- webtasks
- serverless
related:
- 2017-02-15-introducing-auth0-hooks
- 2018-03-14-troubleshooting-webtasks-using-the-editor
- 2017-12-13-our-journey-toward-saas-customization-and-extensibility-at-auth0
---

Compilers are easily the most powerful, and perhaps the hardest to grasp, capabilities of Webtask and [Auth0 Extend](https://auth0.com/extend). In a nutshell, compilers provide a way to completely modify, customize, and expand, how you (and if you are using Extend, your users) build serverless extensions. In this post I'm going to demonstrate how to use compilers and give you some ideas of how to use them with Auth0 Extend. 

{% include tweet_quote.html quote_text="Compilers are easily the most powerful, and perhaps the hardest to grasp, capabilities of Webtask and Auth0 Extend." %}

The Basics
---

If you have already used [Webtask.io](https://webtask.io/) then you are already familiar with the basic form of a webtask. Consider the archetypical Hello World:

```js
module.exports = function(context, cb) {

    cb(null, { result:"Hello World" });
}
```

An alternative version can be used to return HTML or other non-JSON responses:

```js
module.exports = function(context, request, result) {

  result.end('<h1>Hello World!</h1>');

}
```

This is roughly similar to other serverless platforms like OpenWhisk and Lambda. But here is where compilers throw a curveball. What if you could write your webtask using the Handlebars templating language?


{% highlight html %}
{% raw %}
<h1>Hello {{ name }}</h1>
{% endraw %}
{% endhighlight %}


Or Pug:

```html
h1 #{name}
```

Or heck - even Perl:

```js
print "Hello $name\n";
```

Compilers allow for this by giving you complete control over how the web task is executed. Let's look at a simple compiler that will do simple text substitutions on the script sent into it.

Creating the Compiler
---

Let's begin by using the sample compiler provided by the [docs](https://webtask.io/docs/webtask-compilers). This one simply returns the script of the task that uses the compiler.

```js
module.exports = function (options, cb) {

  return cb(null, function (cb) {
    cb(null, options.script);
  });

};
```

The compiler script basically defines a function that will handle the logic of the compiler - hence the function returning a function. The compiler is sent two arguments, `options` and `cb`. The `options` argument is an object containing the original text of the webtask (`script`), any secrets that were assigned to it (`secrets`), and a NodeJS compiler (`nodejsCompiler`) that can be used to execute your webtask, if it were Node-related code itself. The `cb` argument is simply the callback you'll use to return your function that implements the compiler. In case it isn't clear, the actual compiler "logic" here is this:

```js
function(cb) {
  cb(null, options.script);
} 
```

If you wanted to return a non-JSON based response, you can use any of the three forms allowed by webtask, so for example, this compiler would return HTML:

```js
module.exports = function (options, cb) {

  return cb(null, function (context, req, res) {
    res.end(`<p>Your Code:</p><pre>${options.script}</pre>`);
  });

};
```

So far so good - and it will make more sense once we start testing, but here is where you hit a bit of a roadblock. 

**This part is very, very important!** 

Your compiler code must be available on the Internet in **plain text format**. What that means is my code must be reachable via URL and not actually executed, but rather simply returned as the text of the file itself.

How you do that is up to you. A few options are:

* Gists - which allow you to put source code online. Be sure to use the URL for the Raw option. Here is an example: [https://gist.githubusercontent.com/cfjedimaster/336b6a96cd7481bee62784e57363ec04/raw/c77d35cc4d9e6af604eb1f6b6f78bc328b85eb3e/compiler1.js](https://gist.githubusercontent.com/cfjedimaster/336b6a96cd7481bee62784e57363ec04/raw/c77d35cc4d9e6af604eb1f6b6f78bc328b85eb3e/compiler1.js). While this is quick and easy, you get a new URL after every edit (specifically when you ask for the raw version). During editing, this can be a bit of a pain. 
* Github - which also allows you to view a "raw" version of a file. The good news here is that the URL won't change when you edit. The bad news is that it can take GitHub a few minutes to reflect your changes. So once again, during development this can be painful.
* NPM - if you feel comfortable sharing your code on NPM, you can use this option, otherwise you'll want to ensure you use a private submission.
* A fourth option to consider is slightly more complex, but resolves the issue of changing URLs or waiting for a cache to update. You can use a webtask to simply return the string value of the compiler. My coworker Bobby Johnson describes this approach in a blog post he wrote on securing webtasks with middleware: [Securing Webtasks Part 2: Using Middleware](https://auth0.com/blog/securing-webtasks-part-2-using-middleware/). I think his approach may be the best. It keeps you on the webtask platform and it gives you instant updates. The only real downside would be the lack of syntax checking in your editor, but I'll mention how to debug your compiler in a bit. 

For this tutorial, I'm going to use Gists as I have the luxury of being able to debug while I write and simply sharing the "final" URL after I've gotten past any silly typos. For our first test, I'll use the Gist in the first bullet above.

Using a Compiler
---

Ok, now we need an actual webtask to use the compiler. Let's create one in a file called helloWorld.txt:

```text
The code here doesn't actually matter. Hello!
```

When deploying this to Webtask.io, I would normally do: `wt create helloWorld.txt`. This would create a webtask that would completely fail to work. But instead, I'll pass an argument to the wt CLI to specify my compiler:

```bash
wt create helloWorld.txt --meta wt-compiler=https://gist.githubusercontent.com/cfjedimaster/336b6a96cd7481bee62784e57363ec04/raw/c77d35cc4d9e6af604eb1f6b6f78bc328b85eb3e/compiler1.js
```

Once run, you'll get an output URL you can then use to test your webtask. Here's mine (although there's no guarantee it will be up): [https://wt-c2bde7d7dfc8623f121b0eb5a7102930-0.run.webtask.io/helloWorld](https://wt-c2bde7d7dfc8623f121b0eb5a7102930-0.run.webtask.io/helloWorld). 

If you actually run the task, you just get the source back out again. That's not too exciting, so let's kick it up a notch. Let's build a compiler that accepts textual input with token attributes inside them. It will then replace those tokens with arguments sent to the web task. So for example, imagine our webtask "source code" is:

<pre><code class="bash">I like to eat &#123;&#123; food }} and drink &#123;&#123; drink }}.</code></pre>

I want to be able to call this "function" and pass in food and drink arguments. My compiler needs to pick up those arguments and replace the tokens in code. Here's one way of doing it:

<pre><code class="js">'use strict';
module.exports = function (options, cb) {

  return cb(null, function (context, req, res) {
    let source = options.script;
    if(context.query.food) source = source.replace(/&#123;&#123; food }}/g, context.query.food);
    if(context.query.drink) source = source.replace(/&#123;&#123; drink }}/g, context.query.drink);
    res.end(source);
  });

};</code></pre>

There's a few things to notice here. First, I'm using `context.query` to look for query string parameters. That makes for simpler testing, but you could look in `context.body` as well. I've got two hard coded checks (one for `food` and one for `drink`) so as a "template compiler", this isn't terribly powerful, but you could certainly enhance it, or simply make use of one of the many existing template engines that already exist. The last line simply spits out the resultant string.

This compiler may be found online here: [https://gist.githubusercontent.com/cfjedimaster/983cb26e6c36074bc9c061e846bb8aec/raw/41175b830465093169bdd18fe7b04effbfbb6f10/compiler2.js](https://gist.githubusercontent.com/cfjedimaster/983cb26e6c36074bc9c061e846bb8aec/raw/41175b830465093169bdd18fe7b04effbfbb6f10/compiler2.js).

I created a new web task with the simple text input shown above, created the web task, and tested it like so:

[https://wt-c2bde7d7dfc8623f121b0eb5a7102930-0.run.webtask.io/templateTest?food=meat&drink=coffee](https://wt-c2bde7d7dfc8623f121b0eb5a7102930-0.run.webtask.io/templateTest?food=meat&drink=coffee)

Feel free to modify the query string variables and notice how the replacements change. Just to recap - what we have here is a compiler that does text substitutions, a task that serves as the base input, and the ability to pass arguments to direct how the substitutions are done.

Cool - But Now What?
---

So you've seen how compilers can be used and you probably have a good appreciation for how radically they change the development model for how you work with webtasks. How about a few practical use cases? (Sorry, running Perl in a webtask isn't practical, but I'd love to see you do it!)

* Customizable Email Templates: Typically you may think to use Auth0 Extend as a way to let users write code to add customizations. But you could also use it for more text-based customizations, like email templates. By using a Handlebars compiler, a user could have an extension to allow for customizations of emails sent out by the service.
* Running Multiple Tasks: Generally, one webtask is just that - one webtask. While you can write code in your task to make HTTP requests to *other* webtasks, that's not very easy to work with. What is there was a compiler that took, as a task input, an array of other tasks to run? It would then run them in parallel and return the result of all the other tasks, once completed. I actually built that and you can see the source for it here: [https://github.com/cfjedimaster/Serverless-Examples/blob/master/webtask/parallel.js](https://github.com/cfjedimaster/Serverless-Examples/blob/master/webtask/parallel.js)
* Extensions in TypeScript: And finally - for your power users, you can allow for extensions written in TypeScript. Your compiler would simply transpile it to regular JavaScript and execute it via the NodeJS compiler passed to your compiler.

Hopefully you get the idea. At the end of the day, compilers completely expand what you can do with webtasks and Extend, opening up your development to pretty much anything you can imagine. 

---
