---
layout: post
title: "API : The Less Scary Approach"
description: "Complete beginner introduction to API and implementation"
date: 2017-10-04 13:00
category: Technical Guide, Backend
banner:
    text: "Auth0 makes it easy to add authentication to your application."
author:
    name: "Biodun Chris"
    url: "https://twitter.com/biodunch"
    mail: "biodunch@gmail.com"
    avatar: "https://en.gravatar.com/userimage/102410915/af10368821da83614ac2ce480baa5439.jpg"
design:
    image: https://goo.gl/5ejbBP
    bg_color: "#FF4500"
tags:
- api
- javascript
- identity
- auth0
- authentication
related:

---

# Introduction to API

![API](https://cdn-images-1.medium.com/max/2000/1*w3FVjskCNAY1vNCMu936Sw.gif)

_Image source : [Wikibon](http://wikibon.org/blog/cloud-api-standards/)_
> > An API is a set of functions and procedures that allow the creation of applications which access the features or data of an operating system, application, or other service
— Google

> > An Application Programming Interface (API) is a set of subroutine definitions, protocols, and tools for building application software…
— Wikipedia

These definitions are just combinations of multiple unfamiliar terms which most likely scare you at first read and you then end up spending a whole day trying to look up every term most times forgetting why you were there in the first place the chain just never ends.

This happens to everyone. What you should never do is give up. Well, we are here to discuss API in a less scary way, let’s get started!

## To Do:
* What API is.
* Why API.
* Simple App using Auth0 API

The magnificent, “Application Programming Interface”, highly exalted in the previous definitions above is simply a messenger. Think of API as a waiter. You go to your favorite classy restaurant to buy food, you have to place your order ( make a request ) somehow right? Someone walks up to you with list of meals available, the waiter ( API ) . The well dressed waiter takes your order, goes to the kitchen to get your order and comes back with the meal.

![waiter image](https://cdn-images-1.medium.com/max/1600/1*du7nMX43KrP-h3c9ckeKTQ.jpeg)

## How requests were made before APIs

Take a look at the cheap restaurants, where there are no waiters, no menu list, you just walk straight to the kitchen to get your meal. I believe you know how messy and inconvenient that can get, lots of customers barking their orders, each struggling to get attention. You don’t want to be caught up in that mess.

Well, before APIs, clients interacted with the data store directly which has lots of downsides to it; the biggest of which is the lack of security.

---

In computing, APIs take the request from the user of an app (Web, Mobile, etc.) to get / send something. Say you just placed an order for a MacBook from an online store. The online store’s API takes the order information and sends to the Server to process the order, then returns with a response, notifying you whether it was successful or not. The Data has to be represented in a way (format) both the app and the server will understand, just the way the menu is written in a specific language you and the waiter understand so he can place the right order for you at the kitchen. The modern / generally accepted format is JSON (JavaScript Object Notation). The order information (data) will look like this:

```javascript
{ 
   "customerName" : "John Doe", 
   "item" : "MacBook Pro", 
   "price" : 1000 
}
```

This data is then carried by the API (messenger) to the Data Store, which saves the order information and API returns with response for the Client. Example response :

```javascript
{
   "status": true,
   "message": "Your order has been successfully placed, Kindly
             anticipate delivery in couple days"
}
```
Upon receipt of this response, the client APP traverses the data to fetch the needed info. Most times the message is the only thing the user of the app gets to see, others are abstracted. 

---

## Why do you need an API?

Let’s say you want to display motivational quotes on a section of your web site. You might decide to write all these quotes or copy them off the internet, then save in your database. But don’t forget you need sufficient amount of these, you don’t want to bore your readers with same quotes all the time. So imagine the stress to get these quotes and save everything in the database and fetch every time, that’s some overhead right there.

Note: This is just a use case for APIs, your db is still very much important.

![take orders](https://cdn-images-1.medium.com/max/1600/1*o5dz30z2iTiZm2SGZlH14A.jpeg)

_Image source: [The Bitchy Waiter](http://thebitchywaiter.com/2014/02)_

Some rather hardworking & kind folk has most likely done something similar and was kind enough to make it open. So anytime you need to get quote, you only need to send a request to the API, describing exactly what you want based on the author’s documentation.
APIs are accessed though endpoints. Endpoints refers to the location of the resources on a particular server. So when a request hits the API, it knows just what you want and how to respond to the call.
Take a look at a sample endpoints from [talaikis.com](https://talaikis.com/random_quotes_api/) :

### Endpoints available:
* https://talaikis.com/api/quotes/random — Returns One Random Quote.
* https://talaikis.com/api/quotes  — Returns 100 random quotes at a time.

From the above, call to those endpoints returns different resource. The first returns a random quote everytime it’s called, while the other gives random 100. For your app, I believe the first is just perfect, the user never gets bored!

NOTE: Before you can make use of any API, you have to read the documentation, know the type of request it takes, queries, parameters and the structure of the expected response.

A sample request using [`jQuery.getJSON()`](https://www.w3schools.com/jquery/jquery_ref_ajax.asp) method to call the first endpoint:

```javascript
jQuery.getJSON('https://talaikis.com/api/quotes/random/', function(quote){
//code to display your quote on the website goes here.
})
```

Response:

```javascript
{
    "quote": "I'd like to talk about free markets. Information in  
             the computer age is the last genuine free market left 
             on earth except those free markets where indigenous 
             people are still surviving. And that's basically 
             becoming limited.",
    "author": "Russell Means",
    "cat": "age"
}
```

Does that look familiar? Yea, that’s JSON again. So we got our quote from one call, now you can simply set a timer to make the call multiple times to generate random quote at intervals.

The above is just one of a thousand reasons you should start using API. I will highlight some below:

* Security — API makes this possible because you get to abstract your project complexity and Database structure hiding some vulnerabilities you might have…
* Partner Connectivity — Imagine you own a huge company that sells airtime to retailers via the internet, you need something to connect you to the numerous customers, that’s API.

There’s a lot more we can do with API, but that’s all we will cover for now.

---

# Quotes Web App
## To Do:
* Building Quotes WebApp with ExpressJS
* Quick intro to Auth0
* Using Auth0 for User Authentication

## Building Qoutes Web App with ExpressJS
(This session assumes you know basic nodejs & express framework, if not take time out to read up here)

Create an ExpressJS (a framework built on top of Node) project using express-generator. Run the commands below to setup express and create a new project.

```bash
$ npm install -g express-generator
$ express quotesGenerator
$ cd quotesGenerator
```

The second command creates a folder and basic files to start up your project, open the folder with your favorite IDE / Text Editor.

Run the command below to install the dependencies described in `package.json`.

```bash
$ npm install
```

## Install more dependencies:

```bash
$ npm install connect-flash express-session passport hbs --save
```

* [connect-flash](https://github.com/jaredhanson/connect-flash) stores flash messages in the session.
* [express-session](https://github.com/expressjs/session) a nodejs middleware for handling sessions.
* [passport](https://github.com/jaredhanson/passport) is an authentication middleware for nodejs
* [hbs](https://handlebarsjs.com/) is a templating engine for nodejs.

Open up `app.js` and make the following changes:

_app.js_

```javascript
//require the modules
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');

// set up hbs for templating
app.set('view engine', 'hbs');

//Replace the line below app.use(cookieParser()) with the codes below;

//required for passport
app.use(
  session({
    secret: 'APP_SECRET',
    resave: true,
    saveUninitialized: true
  })
);

app.use(passport.initialize()) //initialize passport
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

//set static files / assets directory
app.use(express.static(path.join(__dirname, 'public'))); 

// Handle authentication failure error messages
app.use(function(req, res, next) {
 if (req && req.query && req.query.error) {
   req.flash("error", req.query.error);
 }
 if (req && req.query && req.query.error_description) {
   req.flash("error_description", req.query.error_description);
 }
 next();
});

// Check logged in
app.use(function(req, res, next) {
  res.locals.loggedIn = false;
  if (req.session.passport && typeof req.session.passport.user != 'undefined') {
    res.locals.loggedIn = true;
  }
  next();
});
```

Next thing is to create the views:
* Index.hbs
* Profile.hbs
* error.hbs
* layout.hbs

Create those files inside your view directory and rename any `.jade` file to `.hbs`.

_views/error.hbs_

```hbs
<h2>{{message}}</h2>
<h2>{{error.message}}</h2>
<pre>{{error.stack}}</pre>
```

The file above display errors while developing with stack traces. The double curly braces allows us to get variables passed from the server-side, you will be seeing more of it.

_views/layout.hbs_

```hbs
<html>

<head>
  <title> {{title}} </title>
  <!-- Latest compiled and minified CSS -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
  <!-- Latest compiled and minified jQuery -->
  <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
  <!-- Latest compiled and minified JavaScript -->
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
</head>

<body>
  <nav class="navbar navbar-inverse navbar-fixed-top">
    <div class="container-fluid">
      <!-- Brand and toggle get grouped for better mobile display -->
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1"
          aria-expanded="false">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
        <a class="navbar-brand" href="/">Quotes Generator</a>
      </div>

      <!-- Collect the nav links, forms, and other content for toggling -->
      <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
        <ul class="nav navbar-nav">
          <li class="active"><a href="/">Home <span class="sr-only">(current)</span></a></li>
          <li><a href="/user">Profile</a></li>
        </ul>
        <ul class="nav navbar-nav navbar-right">
          <li><a href="/logout">Logout</a></li>
        </ul>
      </div>
      <!-- /.navbar-collapse -->
    </div>
    <!-- /.container-fluid -->
  </nav>
  <div class="container" style="margin-top:40px">
    {{{ body }}}
  </div>
</body>

</html>
```

This is a parent view every other view file will have to inherit from. I have included the required assets we need; bootstrap.min.css, jquery.min.js, bootstrap.min.js.

_views/index.hbs_

```hbs
<h1>Famous Quotes</h1>
 
<blockquote>
  <p id="quoteBody">Fetching...</p>
  <footer id="quoteAuthor"></footer>
</blockquote>


<script>
//ensure the page has completely loaded
  $(document).ready(function(){
    //send a get request to get random quote once page loads
    jQuery.getJSON('https://talaikis.com/api/quotes/random', function(data){
      //update the view with the quote
      $('#quoteBody').text(data.quote)
      $('#quoteAuthor').text(data.author)
    })
  })
</script>
```

This is the landing page, it displays random post everytime it’s loaded. The tiny script embedded in it calls the talaikis.com quotes api to obtain random quote.

_views/profile.hbs_

```hbs
<div class="col-sm-4 col-sm-offset-4" style="margin-top:100px">
    <div class="panel panel-info">
        <div class="panel-heading">
            <h2>Short Bio</h2>
        </div>
        <div class="panel-body">
            <img src="{{ user.picture }}" class="img-circle img-responsive" alt="profile-pic">
            <h2>Name : <span> {{ user.displayName }} </span> </h2>
            <h2>Nickname : <span> {{ user.nickname }}</span></h2>
            <h2>Gender : <span> {{ user.gender }} </span> </h2>
        </div>
    </div>
</div>
```

## Run the App
Start up your server if it’s not running.

```bash
$ npm start
```

_landing page_

![landing page](https://cdn-images-1.medium.com/max/1600/1*JbQ4_Vi9WS7hjm1g-nVsYQ.png)

_profile page_

![profile page](https://cdn-images-1.medium.com/max/1600/1*g3b-RfCQwhAzoMnpjenrww.png)

So that’s all we got for now but we want to be a little stingy with the quotes, users have to be logged in to see them, this is where Auth0 comes in.

## What is Auth0?

![auth0](https://cdn-images-1.medium.com/max/1600/1*k0tT97Exkku4h3KBOexREQ.png)

Auth0 provides modern identity platform with [user management](https://auth0.com/user-management), [multifactor authentication](https://auth0.com/multifactor-authentication), [lock](https://auth0.com/lock), [paswordless login](https://auth0.com/passwordless) amongst others.

Auth0 issues [JSON Web Tokens](https://jwt.io/) on every login for your users with support for social identity providers (Facebook, Github, Twitter, etc.) amongst others. First thing, create a free account on Auth0.com if you don’t already have one, done ?

On your dashboard, create a new client, a client is simply the app we want to manage.

![client dashboard](https://cdn-images-1.medium.com/max/1600/1*n31Js4KvIqHT_RJUb0nRBA.png)

Give it a name and select **“Regular Web Application (with refresh)”**.

![create client](https://cdn-images-1.medium.com/max/1600/1*kLKm3HnLnMxSBaFVsnIm1g.png)

Next is to choose the technology for the project which is NodeJs.
Navigate to the settings tab, take note of your __domain__, __client id__ and __client secret__.

![client details](https://cdn-images-1.medium.com/max/1600/1*rZS0Mrotwusp3xovgsuL8A.png)

## Step 1: Install the Middleware Dependencies

Make sure you are in the root directory of the project, then run the command:
```bash
$ npm install passport-auth0 connect-ensure-login --save
```

* [passport-auth0](https://github.com/auth0/passport-auth0) is a nodejs Auth0 package using passport.
* [connect-ensure-login](https://github.com/jaredhanson/connect-ensure-login) middleware ensures that a user is logged in.

## Step 2: Configure the Middlewares
Create a new instance of the Auth0Strategy strategy. Enter your Auth0 client details as configuration values. Tell passport to use the strategy.

Update the app.js file to include this configuration.

_app.js_

```javascript
//requiring dependencies

//Auth0 aunentication configuration
const Auth0Strategy = require('passport-auth0');

// Configure Passport to use Auth0
const strategy = new Auth0Strategy(
  {
    domain: 'YOUR_DOMAIN',
    clientID: 'YOUR_CLIENT_ID',
    clientSecret: 'YOUR_CLIENT_SECRET',
    callbackURL: 'http://localhost:3000/callback'
  },
  (accessToken, refreshToken, extraParams, profile, done) => {
    return done(null, profile);
  }
);

passport.use(strategy);

// This can be used to keep a smaller payload
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
```

Place this snippet just above the part we set the view engine.

Replace the placeholder values with the credentials on your [dashboard](https://manage.auth0.com/login#/clients). I recommend that you load them from environment variables to prevent your credentials from been leaked. Make sure your `app.js` file looks like this.

## Step 3: Configure the Callback URL
Head over to your Auth0 dashboard and register a callback url in __Allowed Callback URLs__ like this:

![callback url configuration](https://cdn-images-1.medium.com/max/1600/1*rEdRYdYB21aXJgNxQklohg.png)

```
localhost:3000/callback
```

Replace the content ofindex.jsfile in routes folder with this:

_routes/index.js_

```javascript
const express = require('express');
const passport = require('passport');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

// Perform the login
router.get(
  '/login',
  passport.authenticate('auth0', {
    clientID: 'YOUR_CLIENT_ID',
    domain: 'YOUR_DOMAIN',
    redirectUri: localhost:3000/callback,
    audience: 'https://' + 'YOUR_DOMAIN' + '/userinfo',
    responseType: 'code',
    scope: 'openid profile'
  }),
  function(req, res) {
    res.redirect('/');
  }
);

// Perform session logout and redirect to homepage
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Perform the final stage of authentication and redirect to '/users'
router.get(
  '/callback',
  passport.authenticate('auth0', {
    failureRedirect: '/'
  }),
  function(req, res) {
    res.redirect('/');
  }
);
```

Open `users.js`, let’s modify that to send data of logged in use to the view, `profile.hbs`.

_users.js_

```javascript
const express = require('express');
const passport = require('passport');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const router = express.Router(); 

/* GET user profile. */
router.get('/', ensureLoggedIn, function(req, res, next) {
  //req.user holds the details of authenticated user
  //render profile.hbs with the user data
  res.render('profile',{ user: req.user }); 
});

module.exports = router;
```

Modify `profile.hbs` to use data provided by the route above.

_views/profile.hbs_

```hbs
<div class="col-sm-4 col-sm-offset-4" style="margin-top:100px">
    <div class="panel panel-info">
        <div class="panel-heading">
            <h2>Short Bio</h2>
        </div>
        <div class="panel-body">
            <img src="{{ user.picture }}" class="img-circle img-responsive" alt="profile-pic">
            <h2>Name : <span> {{ user.displayName }} </span> </h2>
            <h2>Nickname : <span> {{ user.nickname }}</span></h2>
            <h2>Gender : <span> {{ user.gender }} </span> </h2>
        </div>
    </div>
</div>
```

You will notice that i have replaced the hardcoded names with the user details rendered with the view.

Add a check to `index.hbs` to ensure user is logged in before they can see the quotes using the `connect-ensure-login`.

_views/index.hbs_

```hbs
{{#if loggedIn }}
  <h1>Famous Quotes</h1>
  <blockquote>
    <p id="quoteBody">Fetching...</p>
    <footer id="quoteAuthor"></footer>
  </blockquote>
{{else}}
  <div class="alert alert-danger">
    <h3> Kindly login to see the amazing quotes</h3>
    <h4>Please <a href="/login"> Log In</a> to continue.</h4>
  </div>
{{/if}}

<script>
//ensure the page has completely loaded
  $(document).ready(function(){
    //send a get request to get random quote once page loads
    jQuery.getJSON('https://talaikis.com/api/quotes/random', function(data){
      //update the view with the quote
      $('#quoteBody').text(data.quote)
      $('#quoteAuthor').text(data.author)
    })
  })
</script>
```

Let’s update layout.hbs to toggle the login/logout based on user’s logged in state.

_layout.hbs_

```hbs
<html>

<head>
  <title> {{title}} </title>
  <!-- Latest compiled and minified CSS -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
  <!-- Latest compiled and minified jQuery -->
  <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
  <!-- Latest compiled and minified JavaScript -->
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
</head>

<body>
  <nav class="navbar navbar-inverse navbar-fixed-top">
    <div class="container-fluid">
      <!-- Brand and toggle get grouped for better mobile display -->
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1"
          aria-expanded="false">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
        <a class="navbar-brand" href="/">Quotes Generator</a>
      </div>

      <!-- Collect the nav links, forms, and other content for toggling -->
      <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
        <ul class="nav navbar-nav">
          <li class="active"><a href="/">Home <span class="sr-only">(current)</span></a></li>
          <li><a href="/user">Profile</a></li>
        </ul>
        <ul class="nav navbar-nav navbar-right">
          {{#if loggedIn}}
            <li><a href="/logout">Logout</a></li>
          {{else}}
            <li><a href="/login">Login</a></li>
          {{/if}}
        </ul>
      </div>
      <!-- /.navbar-collapse -->
    </div>
    <!-- /.container-fluid -->
  </nav>
  <div class="container" style="margin-top:40px">
    {{{ body }}}
  </div>
</body>

</html>
```

## Run the App

_localhost:3000_

![localhost:3000](https://cdn-images-1.medium.com/max/1600/1*AvFnY7gD23ClBeIuyqGe5w.png)

_localhost:3000/login_

![localhost:3000/login](https://cdn-images-1.medium.com/max/1600/1*QC2-n34p2ExFl_gLq7nUKA.png)

_localhost:3000/user_

![localhost:3000/user](https://cdn-images-1.medium.com/max/1600/1*qyuAkEeD8j0fk0jYl4sbWA.png)

## Conclusion

Well Done! You have just built a simple web app using ExpressJS Framework as Backend and Auth0 to authenticate and manage users. This tutorial was designed to help you understand APIs and how they work. Now you can use the knowledge gained to build even better apps with scalable user management and authentication using Auth0.

You can find the repo for the app [here](https://github.com/biodunch/quotesGenApp). Also I’ve deployed a demo on [heroku](https://quotesgen.herokuapp.com).

Kindly let me know if you have any questions or recommendations in the comment section.

This [link](https://www.computersciencezone.org/50-most-useful-apis-for-developers) contains list of useful APIs for programmers. Have fun tearing them down.

Read up and Practice More!
