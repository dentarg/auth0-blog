---
layout: post
title: "Build and Authenticate a Node.js App with JSON Web Tokens"
description: "Node.js allows you to build backend applications with JavaScript. In this tutorial we'll take a look at how you can secure your Node.js applications with JSON Web Tokens (JWTs)."
date: 2016-11-21 08:30
category: Technical Guide, Backend, NodeJS
banner:
  text: "Auth0 makes it easy to add authentication to your NodeJs application."
author:
  name: "Ado Kukic"
  url: "https://twitter.com/kukicado"
  mail: "ado@auth0.com"
  avatar: "https://s.gravatar.com/avatar/99c4080f412ccf46b9b564db7f482907?s=200"
design:
  image: https://cdn.auth0.com/blog/nodejs-awesome-polls/nodejs_logo.png
  bg_color: "#333333"
tags:
- nodejs
- expressjs
- nodejs-authentication
related:
- angular-2-ngmodules
- introducing-angular2-jwt-a-library-for-angular2-authentication
- create-a-desktop-app-with-angular-2-and-electron
alternate_locale_ja: jp-building-and-authenticating-nodejs-apps
---

---

**TL;DR** Node.js brings the simplicity of JavaScript to the backend. Today, we will build an entire application with Node.js, starting with a blank canvas and finishing with a fully functional application with multiple routes, authentication, and even remote data access. Check out the completed code example from our [GitHub repo](https://github.com/auth0-blog/nodejs-awesome-polls).

---

[Node.js](https://nodejs.org), or simply Node, was first released in 2009 by Ryan Dahl and has become one of the most popular backend programming languages today. Node.js is for all intents and purposes JavaScript but instead of running in the users browser, Node.js code is executed on the backend. Developers familiar with JavaScript will be able to dive right in and write Node.js code.

In our tutorial today, we will write a complete Node.js application using one of the most popular web frameworks for Node, [Express Js](http://expressjs.com). We'll cover everything from project setup to routing, calling external API's, and more. Before we dive into the code let's understand why Node.js is so popular and widely used to give you a deeper understand of why you may want to use Node.js for your applications.

## The Rise of Node.js

Node.js became an overnight sensation for multiple reasons. Performance played a huge factor. Node.js was built around an [event-based architecture](https://en.wikipedia.org/wiki/Event-driven_architecture) and [asynchronous I/O](https://en.wikipedia.org/wiki/Asynchronous_I/O). This allowed Node.js applications to achieve superior I/O and load performance compared to other programming languages. Node.js code is compiled to machine code via Google's [V8 JavaScript Engine](https://developers.google.com/v8/). Let's take a look at a few other factors that led to the rise of Node.js:  

### JavaScript on the Backend

JavaScript as a programming language has many [flaws](https://whydoesitsuck.com/why-does-javascript-suck/). It is also the only language that runs in the web browser today. If you want your website or app to have any type of dynamic functionality, you'll have to implement it in JavaScript. This fact led many developers to learn JavaScript, and soon many open source libraries followed.

Due to Node.js being JavaScript, many of these libraries, such as [`lodash`](https://lodash.com/), [`moment`](http://momentjs.com/), and [`request`](https://github.com/request/request) could be used on the backend without any modification whatsoever. In many instances, developers were able to write their code once, and have it run on both the frontend and the backend allowing many to quickly become full-stack developers.

### Node Package Manager

The [Node Package Mananger](https://www.npmjs.com/) or npm is one of the biggest reasons for Node's popularity. NPM allowed developers to easily manage all of the wonderful libraries released by the open source community. Developers could simply type a command like `npm install lodash`, and the Node Package Manager would go out and download the latest version of `lodash` into a special `node_modules` directory and then the developer could access the `lodash` library by just requiring it in their code.

NPM was revolutionary and to this day remains one of the best package managers around. It was not the first package manager: [NuGet](https://www.nuget.org/) exists for the .Net platform, [`pip`](https://pypi.python.org/pypi/pip) for Python, [gems](https://rubygems.org/) for Ruby, and so on, but the simplicity of NPM has had a major role in Node's success.

### Ecosystem

Node.js is not limited to building web applications. With [Electron](http://electron.atom.io/) for example, you can build native desktop applications with Node; we even have a tutorial on how to [here](https://auth0.com/blog/create-a-desktop-app-with-angular-2-and-electron/). Utilities and build systems are very popular candidates with Node.js, [Bower](https://bower.io/) is a popular front-end package manager built with Node, while [Gulp](http://gulpjs.com/), [Grunt](http://gruntjs.com/), and [WebPack](https://webpack.github.io/) are task runners and build systems built with Node that can improve workflows and increase developer efficiency.

Due to the small footprint and low resource requirements for running Node.js applications, Node.js is leading the charge in serverless computing with platforms like [Webtask](https://webtask.io/), [AWS Lambda](https://aws.amazon.com/lambda/), and [Google Cloud Functions](https://cloud.google.com/functions/docs/) all supporting Node.js almost exclusively.

## Is Node.js For Me?

The age-old debate and probably most difficult question to answer. It depends. This may seem like a cop-out answer, but it really depends. Here at Auth0, we use Node.js extensively and it's proven its worth in helping us scale. Check out our [Stories from the Trenches](https://auth0.engineering/) blog for more in-depth coverage on how we make use of various technologies throughout our organization.

Node.js is great for many use cases, but not so good in others. If you need high I/O that doesn't require a lot of computation, such as serving assets or webpages, then Node will keep you satisfied. If you are doing complex operations, such as hashing passwords or running simulations, Node.js will likely underperform. Examine your use case carefully and use the right tool for the job.

{% include tweet_quote.html quote_text="Node.js excels in many use cases, but is not a silver bullet for everything." %}

## Building an Application with Node.js

![Node.js App - Awesome Polls](https://cdn.auth0.com/blog/nodejs-awesome-polls/polls.png)

Now that we know more about Node.js, we are ready to get coding and building our application. The application we'll be building today is called Awesome Polls. The United States just had its presidential elections and we are going to build an app to help us analyse the results. Imagine you're building this app for a news organization that wishes to have the most up-to-date data so that it can provide accurate reports to it's viewers.

For this tutorial, we will assume that you have at least some JavaScript and general programming knowledge, but no Node.js exposure, so we'll take it step by step. As always, you can check out the completed code from the [GitHub repo](https://github.com/auth0-blog/nodejs-awesome-polls) if you would like to just follow along.

### Installing Node.js and NPM

To install Node.js head over to the official website located at [https://nodejs.org](https://nodejs.org) and you'll see a giant green download button for your operating system. In our tutorial today, we'll be running the 9.x LTS version of Node. Simply download the executable, run it, and go through the steps to install Node.js on your system.

If you are on a Mac, you can also install Node.js and NPM via [Homebrew](http://brew.sh/). Simply run `homebrew install node` from your terminal and in seconds Node and NPM will be installed.

We will want to ensure that both NPM and Node are installed. Once you've gone through the installation steps, either manually or via homebrew, we'll confirm that the installation was successful. To do that, close and re-open your terminal window and run the command `node -v`. This command will let you know the current version of Node installed. Next, run `npm -v`, and likewise you should see the version of the Node Package Manager installed on your system.

![Verify Node.js Installation](https://cdn.auth0.com/blog/nodejs-awesome-polls/test.png)

> **Note:** Node.js has two versions. A 8.x stable/long-term support version and 9.x which is the cutting edge version, that supports some of the latest ES6 features. Both versions are production-ready, and for this tutorial we'll be using the 9.x version of Node.

### Node.js Project Setup

Now that we have Node and NPM installed, we are ready to continue. One of the best things about Node applications, for me personally, is the ability to have your application live anywhere in the file system. Each Node application is self-contained, so to setup our project, let's just create a directory on our desktop called `awesome-polls` and we'll place our entire application in this directory.

The first file we'll add to this project is a `package.json` file. This file will keep track of all of our dependencies as well as provide some useful info about our application. You can either manually create this file, or run the `npm init -y` command to get one automatically. *Remember to navigate to the `awesome-polls` directory in your terminal first, otherwise your `package.json` file will be created elsewhere.*

Now that we have our `package.json` file, we can add and save our dependencies. There are multiple ways to do this. We could manually write our dependencies in the `package.json` file, for example, but the preferred way is to actually run the `npm install` command which will automatically add the dependency to your `package.json` file.

Let's see how this works. We will use the Express JavaScript web framework for building our application. Currently, we don't have Express installed on our machine. To get it, simply run `npm install express`. In just a few seconds, Express will be downloaded, and stored in a new directory in your file system called `node_modules`. This directory will be located in your `awesome-polls` directory and is a local dependency. You can also install global dependencies by passing a `-g` flag, but you probably won't want to do this for the majority of libraries you install.

You can also install multiple dependencies at once. Let's install the rest of our dependencies. Write the following:

```sh
npm i body-parser connect-ensure-login cookie-parser debug dotenv express-session jade morgan passport passport-auth0
```

> **Note:** `npm i` is a shortcut for `npm install`.

These are all of the 3rd party open source libraries we will rely on to write our application. It's ok if you don't understand what many of these mean or do just yet, we'll get there. To close out this section, take a look at your `package.json` file and you'll see that there is a new section now called `dependencies` with the libraries we've included. Also, you will notice that there is a new file called `package-lock.json`. [This file exists to avoid getting different versions of the same package on different installations](https://medium.com/@Quigley_Ja/everything-you-wanted-to-know-about-package-lock-json-b81911aa8ab8).

### Node.js Directory Structure

Node.js and Express Js are both pretty unopionionated when it comes to directory structure. You are free to define your own and won't be penalized for having too many or too few layers of abstraction. At the end of the day, the code is compiled and code structure flattened, so feel free to experiment with what works best for you. This will also depend a lot on the size and scope of your application. Our demo app is fairly small so our structure will look like:

```
.env - // We will store our global environmental variables here
package.json - // We will define our apps external dependencies here
app.js - // This file will be our entry point into the application
|- node_modules - // automatically generated, npm will store our external dependencies here
|- public
  |- stylesheets
    |- style.css - // We'll store our global styles here
|- routes
  |- index.js - // In this file we'll define our routes for the application
|- views - // We'll place all of our UI views here
  |- error.jade - // Our view for the error
  |- index.jade - // Our main homepage view
  ...
```

Our directory structure is fairly simple. We'll build our app in an MVC style fashion. Our `views` directory will hold all of our front-end views, while the `routes` directory will handle the traditional controller logic. We won't have any models for this simple application. Again, it's ok if some of these files don't make sense just yet. I'll explain them all in detail shortly.

![Node.js Directory Structure](https://cdn.auth0.com/blog/nodejs-awesome-polls/setup.png)

### Building Awesome Polls

Let's write some Node.js code. The first piece of functionality that we will implement is our main entry point into the application. Open up the `app.js` file, or create it if you haven't already. For now, let's add the following:

```js
// We saw how we could download dependencies via npm. To use those dependencies in our code we require them. The syntax to require a library is the keyword require and a string for the name of the library. We assign this require function to a variable and can then access methods from the library through that variable. Here we are requiring all of our dependencies at the top of the page as is good practice.
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');

// We are using the dotenv library to load our environmental variables from the .env file. We don't have anything in the .env file for now, but we will soon.
dotenv.load();

// Just like external libraries, we can import our application code using the require function. The major difference is that we have to give the exact path to our file. We saw in the directory structure section that we will have an index.js file in a routes directory. Go ahead and create it if you haven't already, otherwise you'll get errors when compiling the code.
const routes = require('./routes/index');

// This line of code instantiates the Express JS framework. We assign it to a variable called app, and will add our configruation to this variable.
const app = express();

// The .set method allows us to configure various options with the Express framework. Here we are setting our views directory as well as telling Express that our templating engine will be Jade. More on that soon.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// The .use method is similar to the .set method, where it allows us to set further configurations. The .use method also acts as a chain of events that will take place once a request hits our Node.js application. First we'll log the request data, parse any incoming data, and so on.
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
  secret: 'shhhhhhhhh',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// If our applicatione encounters an error, we'll display the error and stacktrace accordingly.
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
});

// Finally, we'll choose to have our app listen on port 3000. This means that once we launch our app, we'll be able to navigate to localhost:3000 and see our app in action. You are free to choose any port you want, so 8080, or 80, or really any number will work. The reason 3000 is typically used is because it's the lowest port number that can be used without requiring elevated privileges on Mac/Linux systems.
app.listen(3000, (err) => {
  if (err) console.log(err.message);
  console.log("App running on port 3000 of localhost");
});
```

Let's test our app so far. To run our app, we'll simply run the command `node app` in your terminal. Next, navigate to `locahost:3000` in your web browser. If all went as expected, you should just see a 404 page not found error. That is the expected behavior since we did not add any routes to our application, but we did add a page not found error handler. Next, let's add some routes.

### Express Js Routing

If you followed along with our directory structure, you'll have created an `index.js` file in a directory titled `routes`. If you haven't already done so, go ahead and create this file, and open it. We will define our application routes here. To accomplish this, we'll write the following:

```js
// Again we are importing the libraries we are going to use
const express = require('express');
const router = express.Router();

// On our router variable, we'll be able to include various methods. For our app we'll only make use of GET requests, so the method router.get will handle that interaction. This method takes a string as its first parameter and that is the url path, so for the first route we are just giving it '/', which means the default route.
router.get('/', (req, res) => {
    res.send('You are on the homepage');
});

// We are going to do the same thing for the remaining routes.
router.get('/login', (req, res) => {
    res.send('You are on the login page');
});

router.get('/logout', (req, res) => {
    res.send('You are on the logout page');
});

router.get('/polls', (req, res) => {
    res.send('You are on the polls page');
});

router.get('/user', (req, res) => {
    res.send('You are on the user page');
});

// Finally, we export this module so that we can import it in our app.js file and gain access to the routes we defined.
module.exports = router;
```

Before moving on, let me briefly explain how routing in Express works. When we define a route, say our `/user` route, and pass the callback function, we are telling Express that when the browser points to `localhost:3000/user`, the specified callback function will be called.

The `req` parameter will have all the details of the request such as the IP address, parameters passed with the route, and even items we attach to it through Express middleware.

The `res` parameter handles our response from the server to the browser. Here we can return a view, an error, JSON data, and so on. Finally, we can optionally add a `next` parameter.

Calling `next` will exit the current function and move down the middleware stack. The way requests are processed in Express Js is that they go through a stack of functions. At the end of each function, you can either call `next` to go the next function in the stack, or call `res` and send a response to the browser. Once an appropriate `res` method has been called, the execution of that request is stopped. Middleware is a great way to separate our code into logical pieces. For example, we can have middleware that transforms our request or checks to see if a user is logged in before continuing. We'll see how to do that in the next section.

Let's get back to our routes. We have defined them, but if we run our application and try to access `localhost:3000/login` for example, we'll still see the 404 error. We haven't linked our routes to our app. Let's do that next. Open the `app.js` file and we'll make the following changes.

```js
// require() statements ...

// dotenv.load();

// Just like external libraries, we can import our application code using the require function. The major difference is, we have to give the exact path to our file. We saw in the directory structure section that we will have an index.js file in a routes directory. Go ahead and create it if you haven't already, otherwise you'll get errors when compiling the code.
const routes = require('./routes/index');

// app definition ...

// app.use(express.static(path.join(__dirname, 'public')));

// We add our routes just after the express.static statement to link the routes we defined to our app.
app.use('/', routes);

// everything else ...
```

With this change saved, restart your Node server and now navigate to [`localhost:3000/user`](localhost:3000/user) and you should just see the text "Your are on the users page" displayed. If we go to a route that we haven't defined like `localhost:3000/yo`, we'll get the 404 page like we'd expect. Alright, so far so good. We have our routes working, next let's go ahead and build our UI views.

### Building the UI

Next, let's build our views. Node.js and Express are very extensible and we have a lot of choices and options when choosing a templating engine for our application. In this tutorial we will use [Jade](https://pugjs.org/api/getting-started.html) (recently renamed to Pug). Jade is perhaps one of the oldest view engines, but other options such as [EJS](http://www.embeddedjs.com/), [Mustache](https://mustache.github.io/), [Dust](http://www.dustjs.com/), and so on exist. In our `app.js` file, we already declared that our view engine is going to be Jade, and that our views will be stored in a directory titled views. In this tutorial, we won't go over the Jade/Pug syntax, so if you are unfamiliar, please check out the [official tutorial](https://pugjs.org/language/tags.html).

We are going to build five unique views. Jade/Pug allows us to extend one layout and build on top of it, so we are going to do that in this simple application. Let's create a file named `layout.jade`. Our views will extend this layout and add on their unique properties. The contents of this file will be as follows:

```jade
doctype html
html
  head
    meta(charset="utf-8")
    title= title
    link(rel='stylesheet', href='/stylesheets/style.css')
    link(href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css", rel="stylesheet")
    link(rel='stylesheet', href='https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css')
  body
    block content
```

Next, let's build our homepage. Our homepage will just display the name of our app and present the user a link to log in. Create a file called `index.jade` and paste in the following:

```jade
extends layout

block content  
  h1
    i.fa.fa-lg.fa-pie-chart
    span Awesome Polls
  h2 Welcome to the Awesome Polls Administrator website.
  p To access the polls, please login.
  br
  a(href="/login")
    button() Login
```

![Awesome Polls Homepage](https://cdn.auth0.com/blog/nodejs-awesome-polls/main.png)

For our next page, let's build the user details page. This is where we'll display the logged in user's information. Create a `user.jade` file and the implemenation is as follows:

```jade
extends layout

block content
  img(src="#{user.picture}")
  h2 Welcome #{user.nickname}!
  br
  a(href='/logout') Logout
```

![Awesome Polls User Details Page](https://cdn.auth0.com/blog/nodejs-awesome-polls/user.png)

With the users page done, next let's build the polls page. Create a file called `polls.jade`.

```jade
extends layout

block content  
  div.clearfix
    div.pull-left
      i.fa.fa-lg.fa-pie-chart
      span Awesome Polls
    div.pull-right
      img(src="#{user.picture}", style="height:24px; border-radius: 30px;")  
      strong(style="margin: 0px 10px;") #{user.nickname}
      a(href="/logout") Logout
  br
  div.jumbotron
    h1.text-center 2016 Presidential Election
  each poll, index in polls
    if (poll.estimates.length > 0)
      div.col-sm-4
        div(class="panel panel-default", style="min-height: 150px;")
          div.panel-title
            div.panel-heading=poll.short_title
          div(class="panel-body", style="min-height: 100px;")
            ul.list-unstyled
              each person, index in poll.estimates
                li
                  if index == 0
                    p
                      strong #{person.choice}
                    div.progress
                      div(class="progress-bar progress-bar-success", style="width: #{person.value}%", role="progressbar")
                        span=person.value
                  else
                    p
                      span #{person.choice}
                    div.progress
                      div(class="progress-bar progress-bar-info", style="width: #{person.value}%", role="progressbar")
                        span=person.value
          div.panel-footer
            a.btn.btn-sm View Results  
            a.btn.btn-sm.write-report Write Report
```

![Awesome Polls Details Page](https://cdn.auth0.com/blog/nodejs-awesome-polls/polls.png)

Next, let's pretty up our error page. We'll create a file called `error.jade` and paste the following code:

```jade
extends layout

block content
  h1= message
  h2= error.status
  pre #{error.stack}
```

![Awesome Polls Error Page](https://cdn.auth0.com/blog/nodejs-awesome-polls/pretty-error.png)

Lastly, we'll also create a stub for our login page by creating a file called `login.jade`, but we'll leave it blank for now.

### Wiring up our Views and Controllers

Finally, we are ready to wire up our views and controllers with actual functionality. Remember, we are storing our controllers in the `routes/index.js` file. Let's open up that file and make the following adjustments:

Also, for users of this application to be authenticated with Auth0, you need to setup a client in your [Auth0 dashboard](https://manage.auth0.com/#/). If you don't have an Auth0 account, <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">sign up for a **free** one now</a>.

After creating your free Auth0 account, visit the [Auth0 dashboard](https://manage.auth0.com/#/) and add click on the _New Client_ button. Auth0 will show a form where you will need to inform two things:

1. The _Name_ of the client: Here, you can add anything to represent your Node.js application.
2. The _Client Type_: Here, you will need to choose _Regular Web Applications_.

Then, click on _Create_ and go to the _Settings_ tab of your new client. From there, you will need to copy the _Client ID_, _Domain_, and _CLIENT SECRET_ properties.

Also, you will need to update the _Allowed Callback URLs_ field. In this field, add the following value: `http://localhost:3000/callback`. This is the URL that Auth0 uses to redirects users after they authenticate.

Now, create a file called `.env` in the project root directory and add the following content to it:

```bash
AUTH0_DOMAIN={YOUR_AUTH0_DOMAIN}
AUTH0_CLIENT_ID={YOUR_AUTH0_CLIENT_ID}
AUTH0_CLIENT_SECRET={YOUR_AUTH0_CLIENT_SECRET}
```

> **Note:** You will have to replace the `{YOUR_AUTH0_DOMAIN}`, `{YOUR_AUTH0_CLIENT_ID}`, and `{YOUR_AUTH0_CLIENT_SECRET}` placeholders with the properties copied from your Auth0 client (i.e. _Client ID_, _Domain_, and _CLIENT SECRET_).

```js
const express = require('express');
const passport = require('passport');
const router = express.Router();
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const request = require('request');

const env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
};

router.get('/', (req, res, next) => {
  // Now, rather then just sending the text "You are on the homepage", we are going to actually render the view we created using the res.render method. The second argument will allow us to pass in data from the backend to our view dynamically.
  res.render('index', { env: env });
});

router.get('/login', passport.authenticate('auth0', {
    clientID: env.AUTH0_CLIENT_ID,
    domain: env.AUTH0_DOMAIN,
    redirectUri: 'http://localhost:3000/callback',
    responseType: 'code',
    scope: 'openid profile email'
  }), (req, res) => {
    res.redirect("/");
  }
);

router.get('/logout', (req, res)=>{
  // For the logout page, we don't need to render a page, we just want the user to be logged out when they hit this page. We'll use the ExpressJS built in logout method, and then we'll redirect the user back to the homepage.
  req.logout();
  res.redirect('/');
});

router.get('/polls', ensureLoggedIn, (req, res)=>{
  // You may have noticed that we included two new require files, one of them being request. Request allows us to easily make HTTP requests. In our instance here, we are using the Huffington Post's API to pull the latest election results, and then we're sending that data to our polls view.
  // The second require was the connect-ensure-loggedin library, and from here we just required a method called ensureLoggedIn, which will check and see if the current user is logged in before rendering the page. If they are not, they will be redirected to the login page. We are doing this in a middleware pattern, we first call the ensureLoggedIn method, wait for the result of that action, and finally execute our /polls controller.
  request('http://elections.huffingtonpost.com/pollster/api/charts.json?topic=2016-president',  (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const polls = JSON.parse(body);
      // For this view, we are not only sending our environmental information, but the polls and user information as well.
      res.render('polls', {env: env, user: req.user, polls: polls});
    } else {
      res.render('error');
    }
  })
});

router.get('/user', ensureLoggedIn, (req, res, next) =>{
  // Same thing for our
  res.render('user', { env: env, user: req.user });
});

router.get('/callback', passport.authenticate('auth0',
  {failureRedirect: '/url-if-something-fails'}), (req, res) => {
  res.redirect(req.session.returnTo || '/polls');
});

module.exports = router;
```

This completes our controller's implementation. We did a lot in this section. We saw how we could send data between our server and front end, how to use the excellent Node.js request library to make calls to an external API, and also how to secure our routes and prevent unauthorized access. We haven't built the user authentication system just yet, we'll do that next.

Before we close out this section, let's make one quick change to our `app.js` file. If you recall, in our `app.js` file we built our error handler. In the last section, we created a pretty view for our errors, so let's make sure we're using that view.

```js
app.use((err, req, res, next) =>{
  res.status(err.status || 500);
  //res.send(err)
  res.render('error', {
    message: err.message,
    error: err
  });
});
```

## Conclusion

Node.js is a powerful language and framework for building modern applications. The community support through NPM is unrivaled and Auth0 can help secure your Node.js apps with not just state of the art authentication, but enhanced features like [multifactor auth](https://auth0.com/docs/multifactor-authentication), [anomaly detection](https://auth0.com/docs/anomaly-detection), [enterprise federation](https://auth0.com/docs/identityproviders), [single sign on (SSO)](https://auth0.com/docs/sso), and more. <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">Sign up</a> today so you can focus on building features unique to your app.

{% include tweet_quote.html quote_text="With Auth0, you can add authentication to your Node.js app in minutes." %}
