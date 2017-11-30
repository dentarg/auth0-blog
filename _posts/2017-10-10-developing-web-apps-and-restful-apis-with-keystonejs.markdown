---
layout: post
title: "Developing Web Apps and RESTful APIs with KeystoneJS"
description: "Learn how to build and secure RESTful APIs with KeystoneJS"
date: 2017-10-10 8:30
category: Technical Guide, JavaScript, KeystoneJS
banner:
  text: "Auth0 makes it easy to add authentication to your Angular application."
author:
  name: "Prosper Otemuyiwa"
  url: "https://twitter.com/unicodeveloper"
  mail: "prosper.otemuyiwa@auth0.com"
  avatar: "https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200"
design:
  image: https://cdn.auth0.com/blog/keystonejs/keystonejs-logo.png
  bg_color: "#4A4A4A"
tags:
- keystonejs
- angular
- javascript
- authentication
- auth
- nodejs
- restful
- api
related:
- 2017-09-19-building-an-app-with-Nette-and-adding-authentication
- 2017-09-07-developing-restful-apis-with-loopback
- 2017-08-10-implementing-jwt-authentication-on-spring-boot
---

**TL;DR:** In this tutorial, I'll show you how easy it is to build a web application and secure an API with KeystoneJS. Check out the [repo](https://github.com/auth0-blog/keystonejs-auth) to get the code.

---

**KeystoneJS** is an open-source Node.js based CMS and web application framework created by [Jed Watson](https://twitter.com/jedwatson) in 2013. KeystoneJS makes it very easy to build database-driven websites, applications & APIs. The framework is built upon [Express](https://expressjs.com) and [MongoDB](https://www.mongodb.com).

**Express** is a minimalist web framework for Node.js. It provides a myriad of HTTP utility methods and middleware at your disposal. **MongoDB** is a very powerful non-relational database.

A lot of folks such as [MacMillan](http://www.macmillanconnect.com.au/), [Suitshop](http://www.suitshop.com.au) already use **KeystoneJS** to power their CMSes. It's a great tool for quickly developing a blog, portal, forum or any form of managment system that really needs a content management system.

## KeystoneJS Architecture

KeystoneJS uses the Model View Template pattern. In a typical framework architecture, there exists a seperation of concern of functionalities; presentation, business, and data access realm.

* **Data Access - Model**: This is the data access layer. It defines how data is being interacted with in the application. Validation, behaviour, and transformation of data.

* **Business Logic - View**: In a typical framework, the view simply presents data to the screen. In KeystoneJS, it serves as the busines logic layer that contains the logic that accesses the model, otherwise known as controllers. It serves as a bridge between the models and templates.

* **Presentation - Templates**: This is the presentation layer. It displays data on the screen.

## KeystoneJS Features

KeystoneJS provides a standardized set of components that allows developers to build web applications quickly with JavaScript. It has a number of features that makes it a worthy framework to consider when looking for a good tool for your next project.

* **Session Management** : KeystoneJS ships with session management and authentication features out of the box.
* **Routing**: KeystoneJS provides a router that allows you to express how your web application or API routes should look like.
* **Form Validation**: KeystoneJS provides form validation out of the box.
* **Modularity**: KeystoneJS configures Express for you. It also uses [Mongoose](http://mongoosejs.com) to connect seamlessly with MongoDB and it separates views, routes and templates nicely by providing their specific directories.
* **Admin UI**: KeystoneJS has an auto-generated Admin UI that saves you a lot of time and makes managing data from your database so easy.
* **Email Administration**: With KeystoneJS, you can set up, preview and send template-based emails for your application seamlessly. It offers a [Mandrill](https://www.mandrill.com) integration out of the box.

## KeystoneJS Key Requirements

In order to use KeystoneJS, you need to have the following tools installed on your machine.

* **Node.js**: Navigate to the [Node.js website](https://nodejs.org/en/download/) and install the latest version on your machine.
* **MongoDB**: Navigate to the [mongodb website](https://www.mongodb.com/download-center?ct=false#atlas) and install the MongoDB community server edition. If you are using a Mac, I'll recommend following this [instruction](https://treehouse.github.io/installation-guides/mac/mongo-mac.html). To avoid micromanaging from the terminal, I'll also recommend installing a MongoDB GUI, [Robo 3T](https://robomongo.org), formerly known as RoboMongo. You can then run `mongod` from the terminal to start up the MongoDB service on your machine.
* **Yeoman**: Make sure yeoman is installed on your machine by running `npm install -g yo`.
* Familiarity with database concepts, and working knowledge of JavaScript.

## Building a Blog Rapidly With KeystoneJS

I mentioned earlier that KeystoneJS is a tool for rapidly building out web applications. What you might not be aware of is that it is even easier to set up a blog with KeystoneJS. Let's quickly go through how to setup one.

### Use Keystone Yeoman Generator

Run the following command in your terminal to install the powerful [Yeoman](http://yeoman.io/) generator for KeystoneJS:

```bash
npm install -g generator-keystone
```

Create a `blog` directory and `cd` into it.

```bash
mkdir && cd blog
```

Now, run the generator.

```bash
yo keystone
```

A wizard comes up and several questions are asked, including if you want a blog, image gallery and contact form. Answer the questions like I did in the image below:

![KeystoneJS generator wizard](https://cdn.auth0.com/blog/keystonejs/generator.png)
_Keystone wizard_

Go ahead and run your newly created project with the following command:

```bash
node keystone
```

The blog should run on port 3000 by default. Check out your new blog on `http://localhost:3000`.

![Homepage](https://cdn.auth0.com/blog/keystonejs/bloghomepage.png)
_Homepage_

Sign in to the AdminUI with the credentials you passed in during the wizard generation process.

![AdminUI Sign In](https://cdn.auth0.com/blog/keystonejs/adminlogin.png)
_AdminUI Sign In_

_Admin Dashboard_
![Admin Dashboard](https://cdn.auth0.com/blog/keystonejs/adminloggedin.png)

Try to create new posts and mark them as published. Also create new users. The Admin UI makes it so easy to do that. Check out the blog, _http://localhost:3000/blog_ itself and see the posts.

You might be asking some questions already. How do I change the style of the blog? How do I create pages? Let's look into that now.

### Create Pages

Head over to the code directory. In the directory structure, you'll see a `models` directory that contains `Post`, `PostCategory`, `User` and `Enquiry` models.

Create a `Page.js` model inside the `models` directory and add code to it like so:

```js
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Page Model
 * ==========
 */
var Page = new keystone.List('Page', {
  map: { name: 'title' },
  autokey: { path: 'slug', from: 'title', unique: true },
});

Page.add({
  title: { type: String, required: true },
  state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
  publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
  image: { type: Types.CloudinaryImage },
  content: {
    brief: { type: Types.Html, wysiwyg: true, height: 150 },
    extended: { type: Types.Html, wysiwyg: true, height: 400 },
  }
});

Page.schema.virtual('content.full').get(function () {
  return this.content.extended || this.content.brief;
});

Page.defaultColumns = 'title, state|20%';
Page.register();
```

It's similar to the Post model. I specified the Page model attributes and in the Admin UI we only want to display page title and state, which is why I have `Page.defaultColumns = 'title, state|20%';`. 20% refers to the column width.

Rerun your app with `node keystone` and go to `http://localhost:3000/keystone/pages`. You should be able to create new pages now.

Let's add `Pages` to the Admin UI top navigation for easy access. Open `keystone.js` file located in the root of our project directory and add a new route to `keystone.set(nav)` section like so:

```js
// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
  posts: ['posts', 'post-categories'],
  enquiries: 'enquiries',
  users: 'users',
  pages: 'pages'
});
```

**Note:** If you don't want to keep stopping and running your app over and over again, you can install a node module called `nodemon`. Then just run: `nodemon keystone`. Once we make any change to our app, it automatically restarts the server.

Now, check your Admin UI:

![Admin UI pages](https://cdn.auth0.com/blog/keystonejs/adminuipages.png)
_Admin UI Pages Nav_

Now, let's configure Pages to show on the user facing end.

Head over to `routes/views` and create a `page.js` file. Add code to it:

```js
var keystone = require('keystone');

exports = module.exports = function (req, res) {

  var view = new keystone.View(req, res);
  var locals = res.locals;

  // Set locals
  locals.section = 'pages';
  locals.filters = {
    post: req.params.page,
  };
  locals.data = {
    posts: [],
  };

  // Load the current post
  view.on('init', function (next) {

    var q = keystone.list('Page').model.findOne({
      state: 'published',
      slug: locals.filters.post,
    });

    q.exec(function (err, result) {
      locals.data.post = result;
      next(err);
    });

  });

  // Load other posts
  view.on('init', function (next) {

    var q = keystone.list('Page').model.find().where('state', 'published').sort('-publishedDate').limit('4');

    q.exec(function (err, results) {
      locals.data.posts = results;
      next(err);
    });

  });

  // Render the view
  view.render('page');
};
```

This is a page view. It manipulates the data from the model and renders a template. It basically pulls in the slug of the page from the URL and checks if that page slug exists in the database. And it renders the result to the view.

Next step, add the page template. Go to `templates/views`,create a `page.pug` file and add code to it like so:

{% highlight html %}
{% raw %}
{% extends "../layouts/default.twig" %}

{% block content %}
  <div class="container">
    <div class="row">
      <div class="col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2">
        <article>
          <p>
            <a href="/blog">&larr; back to the blog</a>
          </p>
          <hr>
          {% if not data.post %}
            <h2>Invalid Page.</h2>
          {% else %}
            <header>
              <h1>{{ data.post.title }}</h1>
              <h5>Posted</h5>
              {% if data.post.publishedDate %}
                on {{ data.post.publishedDate|date("M d, Y") }}
              {% endif %}
              {% if data.post.categories and data.post.categories.length %}
                in
                {% for cat in data.post.categories %}
                  <a href="/blog/{{ cat.key }}">{{ cat.name }}</a>
                  {% if not loop.last %}, {% endif %}
                {% endfor %}
              {% endif %}
            </header>
            <div class="post">
              {% if data.post.image.exists %}
                <div class="image-wrap">
                  <img src="{{ data.post._.image.fit(750,450) }}" class="img-responsive">
                </div>
              {% endif %}
              {{ data.post.content.full | raw }}
            </div>
          {% endif %}
        </article>
      </div>
    </div>
  </div>
{% endblock %}
{% endraw %}
{% endhighlight %}

Finally, we'll define a new route for pages.

Head over to `routes/index.js` file, navigate to the routes section and add `app.get('/pages/:page', routes.views.page);` like so:

```js
...
app.get('/', routes.views.index);
app.get('/blog/:category?', routes.views.blog);
app.get('/blog/post/:post', routes.views.post);
app.all('/contact', routes.views.contact);
app.get('/pages/:page', routes.views.page);
```

Now, let's add a Page to our user-facing navigation. One of the pages I created from the backend is a page called `team`. This is how to add it:

Head over to `routes/middleware.js` and add `{ label: 'Team', key: 'team', href: '/pages/team' }` to the list of navLinks like so:

```js
...
exports.initLocals = function (req, res, next) {
  res.locals.navLinks = [
    { label: 'Home', key: 'home', href: '/' },
    { label: 'Blog', key: 'blog', href: '/blog' },
    { label: 'Team', key: 'team', href: '/pages/team' },
    { label: 'Contact', key: 'contact', href: '/contact' },
  ];
  res.locals.user = req.user;
  next();
};
```

That's all.

Check your app, you should see a `Team` nav item or whatever page you created.

![Team page](https://cdn.auth0.com/blog/keystonejs/teampage.png)

We have just built a blog with a functional Admin UI within just a few minutes. You can add more functionalities or extend it to be a hotel or ticket or booking or any type of management system.

Instead of building another application, let's look at how to build a functional API with KeystoneJS.

## Building a Star Wars API Rapidly With KeystoneJS

Let's build a Star Wars API with KeystoneJS. The Star Wars API will grant developers access to all the Star Wars data they have ever wanted. Well, this is a KeystoneJS tutorial therefore the data will be very limited, but we'll put the API structure in place and learn how to secure it.

* Create an `api` folder inside the `routes` directory. This is where we will place our logic for fetching data from the database and returning it to the user.

* Let's create models for our API. We'll have three models namely, _People_, _Starship_ and _Planet_. Each of these models will have certain attributes. Let's outline them:

People:
  - name
  - height
  - mass
  - gender

Starship:
  - name
  - model
  - manufacturer
  - crew

Planet:
  - name
  - diameter
  - population
  - rotation_period

Now, let's create the models. Create `models/People.js`, `models/Starship.js`, and `models/Planet.js` respectively and add code to them like so:

_models/People.js_

```js
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * People Model
 * ==========
 */
var People = new keystone.List('People');

People.add({
  name: { type: Types.Name, required: true },
  height: { type: Types.Number, required: true, initial: false },
  mass: { type: Types.Number, required: true, initial: false },
  gender: { type: String },
});


/**
 * Registration
 */
People.register();
```

_models/Starship.js_

```js
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Starship Model
 * ==========
 */
var Starship = new keystone.List('Starship');

Starship.add({
  name: { type: String, required: true },
  model: { type: String, required: true, initial: false  },
  manufacturer: { type: String, required: true, initial: false  },
  crew: { type: Number, required: true, initial: false },
});


/**
 * Registration
 */
Starship.register();
```

_models/Planet.js_

```js
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Planet Model
 * ==========
 */
var Planet = new keystone.List('Planet');

Planet.add({
  name: { type: Types.Name, required: true },
  diameter: { type: Types.Number, required: true, initial: false  },
  population: { type: Types.Number, required: true, initial: false },
  rotation_period: { type: Types.Number, required: true, initial: false  },
});


/**
 * Registration
 */
Planet.register();
```

These models are basically our Database Schemas.

The next step is to create a Keystone view-like logic. In this case, we are dealing with APIs, so we will write them in a different way. Inside the `routes/api` directory, create these three files, `people.js`, `planet.js` and `starship.js` respectively.

Go ahead and add code to them like so:

_routes/api/people.js_

```js
var keystone = require('keystone');

var People = keystone.list('People');

/**
 * List People
 */
exports.list = function(req, res) {
  People.model.find(function(err, items) {

    if (err) return res.json({ err: err });

    res.json({
      people: items
    });

  });
}

/**
 * Get People by ID
 */
exports.get = function(req, res) {
  People.model.findById(req.params.id).exec(function(err, item) {

    if (err) return res.json({ err: err });
    if (!item) return res.json('not found');

    res.json({
      people: item
    });

  });
}


/**
 * Create a People
 */
exports.create = function(req, res) {

  var item = new People.model(),
    data = (req.method == 'POST') ? req.body : req.query;

  item.getUpdateHandler(req).process(data, function(err) {

    if (err) return res.json({ error: err });

    res.json({
      people: item
    });

  });
}

/**
 * Patch People by ID
 */
exports.update = function(req, res) {

  People.model.findById(req.params.id).exec(function(err, item) {

    if (err) return res.json({ err: err });
    if (!item) return res.json({ err: 'not found' });

    var data = (req.method == 'PUT') ? req.body : req.query;

    item.getUpdateHandler(req).process(data, function(err) {

      if (err) return res.json({ err: err });

      res.json({
        people: item
      });

    });

  });
}

/**
 * Delete People by ID
 */
exports.remove = function(req, res) {
  People.model.findById(req.params.id).exec(function (err, item) {

    if (err) return res.json({ dberror: err });
    if (!item) return res.json('not found');

    item.remove(function (err) {
      if (err) return res.json({ dberror: err });

      return res.json({
        success: true
      });
    });

  });
}
```

_routes/api/planet.js_

[Planet API code here](https://github.com/auth0-blog/keystonejs-auth/blob/master/routes/api/planet.js)

_routes/api/starship.js_

[Starship API code here](https://github.com/auth0-blog/keystonejs-auth/blob/master/routes/api/starship.js)

Let's analyze the code above. We have four functions in each of the files. `list`, `create`, `update` and `remove`. These functions are mapped to HTTP operations like so:

* `list` - /GET
* `create` - /POST
* `get` - /GET
* `update` - /PUT
* `remove` - /DELETE

For example, if you make a POST request to `/people` API endpoint, the `create` function will be invoked.

- The `list` function checks the document for all the resources for an API endpoint.
- The `create` function creates a new resource for an API endpoint.
- The `get` function checks the document store for a single resource for an API endpoint.
- The `update` function checks if a resource exists and allows the resource to be updated for an API endpoint.
- The `remove` function checks if a resource exists and deletes it for an API endpoint.

Now, we need to map these functions to the API routes for a functional API to exist. Head over to the `routes/index.js` file. In the Route binding section, add this code to it like so:

```js
// Setup Route Bindings
exports = module.exports = function (app) {
  // Views
  app.get('/', routes.views.index);

  // API
  app.get('/api/people', routes.api.people.list);
  app.get('/api/people/:id', routes.api.people.get);
  app.post('/api/people', routes.api.people.create);
  app.put('/api/people/:id', routes.api.people.update);
  app.delete('/api/people/:id', routes.api.people.remove);

  app.get('/api/planets', routes.api.planet.list);
  app.get('/api/planets/:id', routes.api.planet.get);
  app.post('/api/planets', routes.api.planet.create);
  app.put('/api/planets/:id', routes.api.planet.update);
  app.delete('/api/planets/:id', routes.api.planet.remove);

  app.get('/api/starships', routes.api.starship.list);
  app.get('/api/starships/:id', routes.api.starship.get);
  app.post('/api/starships', routes.api.starship.create);
  app.put('/api/starships/:id', routes.api.starship.update);
  app.delete('/api/starships/:id', routes.api.starship.remove);


  // NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
  // app.get('/protected', middleware.requireUser, routes.views.protected);

};
```

Finally, test the API routes with [Postman](https://www.getpostman.com/).

![KeystoneJS GET operation](https://cdn.auth0.com/blog/keystonejs/read.png)
_People GET operation_

![KeystoneJS POST operation](https://cdn.auth0.com/blog/keystonejs/create.png)
_People POST operation_

![KeystoneJS DELETE operation](https://cdn.auth0.com/blog/keystonejs/delete.png)
_People DELETE operation_

Our API works. Awesome!

## Securing a Star Wars API with Auth0

Right now, anyone can make `GET` and `POST` requests to all of the endpoints present in our API. In a real-world scenario, we should restrict `POST`, `DELETE` and `PUT` requests to certain registered and authorized users.

We'll go ahead and secure some of these API endpoints with [JSON Web Tokens](https://jwt.io).

JSON Web Tokens, commonly known as JWTs, are tokens that are used to authenticate users on applications. This technology has gained popularity over the past few years because it enables backends to accept requests simply by validating the contents of these JWTs. That is, applications that use JWTs no longer have to hold cookies or other session data about their users. This characteristic facilitates scalability while keeping applications secure.

Whenever the user wants to access a protected route or resource (an endpoint), the user agent must send the JWT, usually in the _Authorization_ header using the [Bearer schema](http://self-issued.info/docs/draft-ietf-oauth-v2-bearer.html), along with the request.

When the API receives a request with a JWT, the first thing it does is to validate the token. This consists of a series of steps, and if any of these fails then, the request must be rejected. The following list shows the validation steps needed:

* Check that the JWT is well formed
* Check the signature
* Validate the standard claims
* Check the Client permissions (scopes)

We will make use of Auth0 to issue our JSON Web Tokens. With Auth0, we have to write just a few lines of code to get a solid [identity management solution](https://auth0.com/docs/identityproviders), including [single sign-on](https://auth0.com/docs/sso/single-sign-on), [user management](https://auth0.com/docs/user-profile), support for [social identity providers (like Facebook, GitHub, Twitter, etc.)](https://auth0.com/docs/identityproviders), [enterprise (Active Directory, LDAP, SAML, etc.)](https://auth0.com/enterprise), and your [own database of users](https://auth0.com/docs/connections/database/mysql).

For starters, if you haven't done so yet, this is a good time to sign up for a <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">free Auth0 account</a>. Having an Auth0 account, the first thing that we must do is to [create a new API on the dashboard](https://manage.auth0.com/#/apis). An API is an entity that represents an external resource, capable of accepting and responding to protected resource requests made by clients. And we are dealing with an API here, SWAPI (Star Wars API).

> [Auth0 offers a generous **free tier**](https://auth0.com/pricing) to get started with modern authentication.

Login to your Auth0 [management dashboard](https://manage.auth0.com) and create a new API client.

Click on the APIs menu item and then the **Create API** button. You will need to give your API a name and an identifier. The name can be anything you choose, so make it as descriptive as you want.

The identifier will be used to identify your API, this field cannot be changed once set. For our example, I'll name the API, **Star Wars API**, and for the identifier I'll set it as **https://starwarsapi.com**. We'll leave the signing algorithm as **RS256** and click on the **Create API** button.

![New API to be created](https://cdn.auth0.com/blog/loopback/newapitobecreated.png)
_Create a New API_

![Star Wars API](https://cdn.auth0.com/blog/loopback/starwarsapi.png)
_Creating the Star Wars API_

![Define the scopes](https://cdn.auth0.com/blog/loopback/starwarscope.png)
_You can define scopes in this section_

Head over to your terminal and install the following node modules:

```bash
npm install express-jwt jwks-rsa --save
```

Open your `routes/index.js` file. Just before the route bindings, add this code:

```js
...
var authCheck = jwt({
  secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        // YOUR-AUTH0-DOMAIN name e.g https://prosper.auth0.com
        jwksUri: "{YOUR-AUTH0-DOMAIN}/.well-known/jwks.json"
    }),
    // This is the identifier we set when we created the API
    audience: '{YOUR-API-AUDIENCE-ATTRIBUTE}',
    issuer: '{YOUR-AUTH0-DOMAIN}',
    algorithms: ['RS256']
});
```

Also, make sure you require the `express-jwt` and `jwks-rsa` modules at the top of the file.

```js
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');
```

Add the `authCheck` function to the endpoints as a middleware like so:

```js
// Setup Route Bindings
exports = module.exports = function (app) {
  // Views
  app.get('/', routes.views.index);

  // API
  app.get('/api/people', routes.api.people.list);
  app.get('/api/people/:id', routes.api.people.get);
  app.post('/api/people', authCheck, routes.api.people.create);
  app.put('/api/people/:id', authCheck, routes.api.people.update);
  app.delete('/api/people/:id', authCheck, routes.api.people.remove);

  app.get('/api/planets', routes.api.planet.list);
  app.get('/api/planets/:id', routes.api.planet.get);
  app.post('/api/planets', authCheck, routes.api.planet.create);
  app.put('/api/planets/:id', authCheck, routes.api.planet.update);
  app.delete('/api/planets/:id', authCheck, routes.api.planet.remove);

  app.get('/api/starships', routes.api.starship.list);
  app.get('/api/starships/:id', routes.api.starship.get);
  app.post('/api/starships', authCheck, routes.api.starship.create);
  app.put('/api/starships/:id', authCheck, routes.api.starship.update);
  app.delete('/api/starships/:id', authCheck, routes.api.starship.remove);


  // NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
  // app.get('/protected', middleware.requireUser, routes.views.protected);

};
```

* The `express-jwt` module is an express middleware that validates a JSON Web Token and set the `req.user` with the attributes.
* The `jwks-rsa` module is a library that helps retrieve RSA public keys from a JSON Web Key Set endpoint.

The `authCheck` variable does the check to validate the access tokens that are sent as Authorization headers. It validates the `audience`, `issuer` and algorithm used to sign the token.

**Note:** Replace the `YOUR-API-AUDIENCE-ATTRIBUTE` and `YOUR-AUTH0-DOMAIN` placeholders with the API audience and Auth0 domain values from your Auth0 dashboard.

We just secured all the `post`, `put`, and `delete` API endpoints with JWT. If a user accesses these API endpoint/route without a valid access token or no token at all, it returns an error. Try it out.

![Invalid token](https://cdn.auth0.com/blog/keystonejs/authorizationerror.png)
_Accessing the POST people endpoint without an access token_

Now, let's test it with a valid access token. Head over to the `test` tab of your newly created API on your Auth0 dashboard.

Grab the Access token from the _Test_ tab

![Get the Access token](https://cdn.auth0.com/blog/keystonejs/gettoken.png)
_Grab the Access Token_

Now use this `access token` in Postman by sending it as an Authorization header to make a POST request to `api/people` endpoint.

![Accessing the endpoint securely](https://cdn.auth0.com/blog/keystonejs/authorizationbearer.png)
_Accessing the endpoint securely_

It validates the access token and successfully makes the POST request.

Wondering how to integrate the secure API with a frontend? Check out our amazing [React](https://auth0.com/blog/reactjs-authentication-tutorial/) and [Vue.js authentication tutorials](https://auth0.com/blog/vuejs2-authentication-tutorial/).


## Conclusion

Well done! You have learned how to build a blog and an API with KeystoneJS. The KeystoneJS tutorial focuses on building a content management system as fast as possible and fleshing out secure APIs.

KeystoneJS definitely saves a developer a lot of time during development because of the amazing out-of-the-box features.

{% include tweet_quote.html quote_text="KeystoneJS definitely saves a developer a lot of time during development because of the amazing out-of-the-box features." %}

In addition, Auth0 can help secure your **API** easily. Auth0 provides more than just username-password authentication. It provides features like [multifactor auth](https://auth0.com/multifactor-authentication), [breached password detection](https://auth0.com/breached-passwords), [anomaly detection](https://auth0.com/docs/anomaly-detection), [enterprise federation](https://auth0.com/docs/identityproviders), [single sign on (SSO)](https://auth0.com/docs/sso), and more. <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">Sign up</a> today so you can focus on building features unique to your app.

Please, let me know if you have any questions or observations in the comment section. 😊
