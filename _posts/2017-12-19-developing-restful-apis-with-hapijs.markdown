---
layout: post
title: "Developing RESTful APIs with Hapi"
description: "Hapi 17 brings major changes to the server framework for Node.js. Learn what's new and how to build and secure RESTful APIs with Hapi"
date: 2017-12-19 8:30
category: Technical Guide, JavaScript, Hapi
banner:
  text: "Auth0 makes it easy to add authentication to your Angular application."
author:
  name: "Prosper Otemuyiwa"
  url: "https://twitter.com/unicodeveloper"
  mail: "prosper.otemuyiwa@auth0.com"
  avatar: "https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200"
design:
  image: https://cdn.auth0.com/blog/hapi/hapi-logo-1.png
  bg_color: "#4F4D40"
tags:
- hapi
- hapi-17
- hapijs
- javascript
- authentication
- auth
- nodejs
- restful
- api
related:
- 2017-10-10-developing-web-apps-and-restful-apis-with-keystonejs
- 2017-09-07-developing-restful-apis-with-loopback
- 2017-08-10-implementing-jwt-authentication-on-spring-boot
---

**TL;DR:** In this tutorial, I'll show you how easy it is to build and secure an API with Hapi. Check out the [repo](https://github.com/auth0-blog/hapi-dog-api) to get the code.

---

**Hapi** is an open-source and rich Node.js framework created and actively maintained by [Eran Hammer](https://twitter.com/eranhammer). Hapi is a rich framework for building applications and services. It enables developers to focus on writing reusable application logic instead of spending time building infrastructure. 

Several organizations such as _Paypal_, _Vendigo_, _Clarify_, _Pling_, and _Npm_ already use **Hapi** in production. **Hapi** is a framework that gives you greater flexibility when compared to other Node.js frameworks. It is also perfect for grounds up development. The [documentation](https://hapijs.com/tutorials) is detailed, and there is a [vibrant](https://gitter.im/hapijs/hapi) [community](http://webchat.freenode.net/?channels=hapi) of users. Furthermore, there are dozens of [plugins](https://hapijs.com/plugins) for virtually any feature you are trying to build into your application.

{% include tweet_quote.html quote_text="Hapi is a framework that gives you greater flexibility when compared to other Node.js frameworks." %}

## Hapi Features

**Hapi** is a simple to use configuration-centric framework that provides an amazing set of built-in functionality, which allows developers build web applications and services quickly and effectively with JavaScript. Check out some of the features below that makes it a worthy framework to consider for your next project.

{% include tweet_quote.html quote_text="Hapi is a simple to use configuration-centric framework that provides a set of amazing built-in functionalities that allows developers build web applications and services quickly." %}

* **Authentication and Authorization**: Hapi ships with built-in authentication and authorization schemes and strategies. Anonymous, basic-auth, cookie-based and token-based authentication schemes are provided in the Node.js framework.
* **Caching**: Hapi provides powerful client and server side caching via [catbox](https://github.com/hapijs/catbox) and makes using cache very convenient.
* **Routing**: Hapi provides a router that allows you to express how your web application or API routes should look.
* **Validation**: With `Joi`, object schema validation is a breeze in Hapi.
* **Cookies**: Hapi provides several configuration options for making dealing with cookies flexible, safe and simple.
* **Logging**: Logging is key when building quality software. Hapi ships with built-in logging methods.
* **Simplified Error Handling**: [Boom](https://github.com/hapijs/boom) provides a set of utilities for returning HTTP-friendly error objects.
* **Process Monitoring**: [Good](https://github.com/hapijs/good) is a Hapi plugin to monitor and report on a variety of hapi server events as well as ops information from the host machine. It listens for events emitted by hapi server instances and pushes standardized events to a collection of streams.

## Hapi Key Requirements

In order to use Hapi, you need to have the following tools installed on your machine.

* **Node.js**: Navigate to the [Node.js website](https://nodejs.org/en/download/) and install the latest version on your machine.
* Familiarity with database concepts, and a working knowledge of JavaScript.

> **Note:** You'll need MongoDB for this tutorial. Navigate to the [mongodb website](https://www.mongodb.com/download-center?ct=false#atlas) and install the MongoDB community server edition. If you are using a Mac, I'll recommend following this [instruction](https://treehouse.github.io/installation-guides/mac/mongo-mac.html). To avoid micromanaging from the terminal, I'll also recommend installing a MongoDB GUI, [Robo 3T](https://robomongo.org), formerly known as RoboMongo. You can then run `mongod` from the terminal to start up the MongoDB service on your machine.

## Hapi Vs Express

[Express](https://expressjs.com/) is a very popular and widely used node.js framework. Many developers get introduced to express before they become familiar with other node.js frameworks. Ultimately, the developer weighs express and hapi and decides which framework suits their use case. Express is very minimal. You need to add more packages for several functionalities while Hapi, on the other hand, provides a robust API for several functionalities out-of-the-box.

Performance-wise, [Apache Bench](https://httpd.apache.org/docs/2.4/programs/ab.html) was used to test sample apps built with Hapi, Express and other Node.js frameworks. Apache Bench was configured to make 100 requests concurrently until 50,000 requests had completed or 20 seconds had elapsed. The request responses per second were then recorded. Apache Bench and the server were hosted within the same environment to avoid extra factors setting in. And tests were repeated five times in each environment.

* **Framework version**: Hapi v16.1.1 and Express 4.15.2
* **Test Environment**: The Ubuntu subsystem environment running on Windows 10 PC – 32 GB RAM, i7-4790 CPU and a $20 Digital Ocean VM running Ubuntu 16.04 – 2GB Memory, 2 Cores
* **Requests per second**: Express - `2875 r/s`, Hapi - `688 r/s` on an Ubuntu VM on Digital Ocean. Express - `1745 r/s`, Hapi - `1094 r/s` on an Ubuntu Subsystem on Windows 10. 

![Performance Results - Hapi, Express](https://raygun.com/blog/wp-content/uploads/2017/04/performance-results-1.png)

Check out the [full performance result and analysis on RayGun](https://raygun.com/blog/node-js-performance-2017/).


## Hapi v17: What's New?

**Hapi** is now at version 17. This is the latest major release version of the Node.js framework, and it was tagged on November 5, 2017. It's a major rewrite of the Hapi codebase such as replacing all callbacks with a fully  `async/await` interface and the `reply()` method passed to handlers with the new lifecycle methods. Hapi v17 requires node v8+. Let's go through the major changes in version 17.

* **Single Connection Per Server**: In Hapi v17, you have a single connection per server. The `server.connection` method has been removed. You need to initialize the connection details with the server's constructor.

```js
const server = new Hapi.Server({
  host: 'localhost',
  port: 3000
})
```

* **Starting and Stopping Hapi Server**: In Hapi v17, the `server.start` and `server.stop` methods are fully async. No more error callbacks.

```js
try {
  await server.start()
}
catch (err) {
  console.log(err)
}

try {
  await server.stop()
}
catch (err) {
  console.log(err)
}
 ```

* **reply() Callbacks removed**: In Hapi v17, the `reply` interface isn’t available anymore and you can return values from route handlers directly. The `response.hold()` and `response.resume()` methods are no longer available. A new response toolkit, `h`, is provided with helpers(instead of the `reply()` decorations).

```js
// Before

const handler = function (request, reply) {
  return reply('ok');
};

// After

const handler = function (request, h) {
  return 'ok';
};
```

More examples on how to use the `h` response toolkit can be found below:

```js
const handler = (request, h) => {
  // return a string
  return 'ok'

  // return an object and hapi creates JSON out of it
  return { name: 'Authentication Library', library: true }

  // redirect to 404
  return h.redirect('/404')

  // return a view
  return h.view('index', { name: 'Authentication Library' })

  // use the "h" response toolkit to create a response
  return h
    .response(thisHTML)
    .type('text/html')
    .header('X-Custom', 'my-value')
    .code(201)
}
```

* **Events**: In Hapi v17, the three request event types(`request`, `request-interval`, and `request-error`) have been merged into a single `request` event. Emitter methods such as `server.on`, `request.on`, `response.on` should be replaced with `server.events.on()`, `request.events.on()`, and `response.events.on()` respectively. Applies to every emitter method.

* **New Request Extension: onCredentials**: Before now, Hapi had `onPreAuth` and `onPostAuth`. In Hapi v17, there's a new request extension, `onCredentials`. With `onCredentials`, you have the ability to customize credentials before request authorization.

```js
server.ext('onPreAuth', (request, h) => { … })
server.ext('onCredentials', (request, h) => { … })
server.ext('onPostAuth', (request, h) => { … }) ]
```

* **Replace `config` with `options` in Route definition**: In Hapi v17, replace `config` with `options` when adding routes. For now, `config` will still work but will be removed in the future.

```js
server.route({
  method: 'POST',
  path: '/',
  options: { … }
})
```

* **Plugins**: In Hapi v17, the plugin function with object properties style has been replaced with a plain object. Replace the `exports.register()` and the matching `exports.register.attributes` with `exports.plugin = { register, name, version, multiple, dependencies, once, pkg }` and remove the `connections` attribute.

Check out the full release note on [GitHub](https://github.com/hapijs/hapi/issues/3658).


## Building a Dog API With Hapi

Let's build a Dog API with Hapi. The design of this API is simple. It's an API to manage the collection of dogs. For the purpose of the tutorial, the data will be very limited, but I'll put the API structure in place and you'll learn how to secure it.

A few core API principles you should be aware of:

*  REST describes how to make resources available in a client-server relationship.
*  Data should be organized around resources.
*  API should respond to common HTTP verbs, `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.
*  Server should be stateless.

In this tutorial, given some `dogs` resource, we want different API endpoints for CRUD operations.

* Get all dogs  - `GET /dogs`
* Get one dog   - `GET /dog/11`
* Create a dog  - `POST /dogs`
* Edit a dog    - `PUT /dogs/11`
* Delete a dog  - `DELETE /dogs/11`

A dog will have the following attributes:

* name
* breed
* age
* image

Create a `src` directory in the root folder. Move into the `src` directory and create two folders, `controllers` and `models` respectively.

* The `controllers` folder will house the logic of saving and retrieving data from the database.
* The `models` folder will house the schema for the Dog API.

Let's create the Dog Schema. Open up `src/models` and create a `dog.js` file with the code below:

_src/models/dog.js_

```js
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dogModel = new Schema({
  name: { type: String, required: true, index: { unique: true } },
  breed: { type: String, required: true },
  age: { type: Number, required: true },
  image: { type: String, required: true }
});

module.exports = mongoose.model('Dog', dogModel, 'dogs'); 
```

The code above is quite explanatory. We have defined the dog attributes using the mongoose Schema. This Schema gives our API data structure. 

The next step is to create the controller. Open up `src/controllers` and create a new file, `dog.js` with the code below:

_src/controllers/dog.js_

```js
var Dog =  require('../models/dog');

/**
 * List Dogs
 */
exports.list = (req, h) => {
  return Dog.find({}).exec().then((dog) => {

    return { dogs: dog };

  }).catch((err) => {

    return { err: err };

  });
}

/**
 * Get Dog by ID
 */
exports.get = (req, h) => {
  
  return Dog.findById(req.params.id).exec().then((dog) => {

    if(!dog) return { message: 'Dog not Found' };

    return { dog: dog };

  }).catch((err) => {

    return { err: err };

  });
}


/**
 * POST a Dog
 */
exports.create = (req, h) => {

  const dogData = {
    name: req.payload.name,
    breed: req.payload.breed,
    age: req.payload.age,
    image: req.payload.image
  };

  return Dog.create(dogData).then((dog) => {

     return { message: "Dog created successfully", dog: dog };

  }).catch((err) => {

    return { err: err };

  });
}

/**
 * PUT | Update Dog by ID
 */
exports.update = (req, h) => {

  return Dog.findById(req.params.id).exec().then((dog) => {

    if (!dog) return { err: 'Dog not found' };

    dog.name = req.payload.name;
    dog.breed = req.payload.breed;
    dog.age = req.payload.age;
    dog.image = req.payload.image;

    dog.save(dogData);

  }).then((data) => {

      return { message: "Dog data updated successfully" };

  }).catch((err) => {

      return { err: err };

  });
}

/**
 * Delete Dog by ID
 */
exports.remove = (req, h) => {
  
  return Dog.findById(req.params.id).exec(function (err, dog) {

    if (err) return { dberror: err };
    if (!dog) return { message: 'Dog not found' };

    dog.remove(function (err) {
      if (err) return { dberror: err };

      return { success: true };
    });
  });
}
```

Let's analyze the code above. We have four functions in the `src/controllers/dog.js` file. `list`, `create`, `update` and `remove`. These functions are mapped to HTTP operations like so:

* `list` - /GET
* `create` - /POST
* `get` - /GET
* `update` - /PUT
* `remove` - /DELETE

For example, if you make a POST request to `/dog` API endpoint, the `create` function will be invoked.

- The `list` function checks the document for all the resources.
- The `create` function creates a new resource.
- The `get` function checks the document store for a single resource.
- The `update` function checks if a resource exists and allows the resource to be updated.
- The `remove` function checks if a resource exists and deletes it.

Now, we need to map these functions to the API routes for a functional API to exist. Head over to the `server.js` file and modify it like so:

```js
'use strict';

const Hapi = require('hapi');
const mongoose = require('mongoose');
const DogController =  require('./src/controllers/dog');
const MongoDBUrl = 'mongodb://localhost:27017/dogapi';

const server = new Hapi.Server({
  port: 3000,
  host: 'localhost'
});

server.route({
  method: 'GET',
  path: '/dogs',
  handler: DogController.list
});

server.route({
  method: 'GET',
  path: '/dogs/{id}',
  handler: DogController.get
});
server.route({
  method: 'POST',
  path: '/dogs',
  handler: DogController.create
});

server.route({
  method: 'PUT',
  path: '/dogs/{id}',
  handler: DogController.update
});

server.route({
  method: 'DELETE',
  path: '/dogs/{id}',
  handler: DogController.remove
});

(async () => {
  try {  
    await server.start();
    // Once started, connect to Mongo through Mongoose
    mongoose.connect(MongoDBUrl, {}).then(() => { console.log(`Connected to Mongo server`) }, err => { console.log(err) });
    console.log(`Server running at: ${server.info.uri}`);
  }
  catch (err) {  
    console.log(err)
  }
})();
```

The `server.route` methods have a `method`, `path`, and `handler` object attribute. The `handler` value is invoked when the user hits the `path`. 

Check this out:

```js
server.route({
  method: 'GET',
  path: '/dogs',
  handler: (req, h) => {
    return "This is the dog route";
  }
});
```

We abstracted the functionality in the route handler to the controller file and called the methods instead!

Finally, test the API routes with [Postman](https://www.getpostman.com/).

![Hapi GET operation](https://cdn.auth0.com/blog/hapi/read.png)
_Dog GET operation_

![Hapi POST operation](https://cdn.auth0.com/blog/hapi/create.png)
_Dog POST operation_

![Hapi DELETE operation](https://cdn.auth0.com/blog/hapi/delete.png)
_Dog DELETE operation_

Our API works. Awesome!

## Securing a Dog API with Auth0

Right now, anyone can make `GET` and `POST` requests to all of the endpoints present in our API. In a real-world scenario, we should restrict `POST`, `DELETE` and `PUT` requests to certain registered and authorized users.

We'll go ahead and secure some of these API endpoints with [JSON Web Tokens](https://jwt.io).

JSON Web Tokens, commonly known as JWTs, are tokens that are used to authenticate users on applications. This technology has gained popularity over the past few years because it enables backends to accept requests simply by validating the contents of these JWTs. That is, applications that use JWTs no longer have to hold cookies or other session data about their users. This characteristic facilitates scalability while keeping applications secure.

Whenever the user wants to access a protected route or resource (an endpoint), the user agent must send the JWT, usually in the _Authorization_ header using the [Bearer schema](http://self-issued.info/docs/draft-ietf-oauth-v2-bearer.html), along with the request.

When the API receives a request with a JWT, the first thing it does is to validate the token. This consists of a series of steps, and if any of these fails then, the request must be rejected. The following list shows the validation steps needed:

* Check that the JWT is well-formed.
* Check the signature.
* Validate the standard claims.
* Check the Client permissions (scopes).

We will make use of Auth0 to issue our JSON Web Tokens. With Auth0, we have to write just a few lines of code to get a solid [identity management solution](https://auth0.com/docs/identityproviders), including [single sign-on](https://auth0.com/docs/sso/single-sign-on), [user management](https://auth0.com/docs/user-profile), support for [social identity providers (like Facebook, GitHub, Twitter, etc.)](https://auth0.com/docs/identityproviders), [enterprise (Active Directory, LDAP, SAML, etc.)](https://auth0.com/enterprise), and your [own database of users](https://auth0.com/docs/connections/database/mysql).

For starters, if you haven't done so yet, this is a good time to sign up for a <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">free Auth0 account</a>. Having an Auth0 account, the first thing that we must do is to [create a new API on the dashboard](https://manage.auth0.com/#/apis). An API is an entity that represents an external resource, capable of accepting and responding to protected resource requests made by clients. And we are dealing with an API here, SWAPI (Star Wars API).

> [Auth0 offers a generous **free tier**](https://auth0.com/pricing) to get started with modern authentication.

Login to your Auth0 [management dashboard](https://manage.auth0.com) and create a new API client.

Click on the APIs menu item and then the **Create API** button. You will need to give your API a name and an identifier. The name can be anything you choose, so make it as descriptive as you want.

The identifier will be used to identify your API, this field cannot be changed once set. For our example, I'll name the API, **Dog API**, and for the identifier, I'll set it as **https://mydogapi.com**. We'll leave the signing algorithm as **RS256** and click on the **Create API** button.

![New API to be created](https://cdn.auth0.com/blog/loopback/newapitobecreated.png)
_Create a New API_

![Dog API](https://cdn.auth0.com/blog/hapi/dogsapi.png)
_Creating the Dog API_


Head over to your terminal and install the following node modules:

```bash
npm install jwks-rsa salzhrani/hapi-auth-jwt2#v-17 --save
```

Open your `server.js` file and modify it like so:

```js
'use strict';

const Hapi = require('hapi');
const mongoose = require('mongoose');
const hapiAuthJWT = require('hapi-auth-jwt2');
const jwksRsa = require('jwks-rsa');
const DogController =  require('./src/controllers/dog');
const MongoDBUrl = 'mongodb://localhost:27017/dogapi';

const server = new Hapi.Server({
  port: 3000,
  host: 'localhost'
});

const validateUser = (decoded, request, callback) => {
  // This is a simple check that the `sub` claim
  // exists in the access token. Modify it to suit
  // the needs of your application
  console.log("Decoded", decoded);
  if (decoded && decoded.sub) {
    return callback(null, true, {});
  }

  return callback(null, false, {});
}

const registerRoutes = () => {
  server.route({
    method: 'GET',
    path: '/dogs',
    options: {
      handler: DogController.list
    }
  });

  server.route({
    method: 'GET',
    path: '/dogs/{id}',
    options: {
      handler: DogController.get
    }
  });

  server.route({
    method: 'POST',
    path: '/dogs',
    handler: DogController.create
  });

  server.route({
    method: 'PUT',
    path: '/dogs/{id}',
    handler: DogController.update
  });

  server.route({
    method: 'DELETE',
    path: '/dogs/{id}',
    handler: DogController.remove
  });
}

const init = async() => {
  await server.register(hapiAuthJWT);
  // see: http://Hapi.com/api#serverauthschemename-scheme
  server.auth.strategy('jwt', 'jwt', { 
    key: jwksRsa.hapiJwt2Key({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      // YOUR-AUTH0-DOMAIN name e.g https://prosper.auth0.com
      jwksUri: '{YOUR-AUTH0-DOMAIN}/.well-known/jwks.json'
    }),
    verifyOptions: { 
      audience: '{YOUR-API-AUDIENCE-ATTRIBUTE}',
      issuer: "{YOUR-AUTH0-DOMAIN}",
      algorithms: ['RS256']
    },
    validate: validateUser
  });

  server.auth.default('jwt');

  registerRoutes();

  await server.start();
  return server;

};

init().then(server => {
  console.log('Server running at:', server.info.uri);
}).catch(err => {
  console.log(err);
});
```

* The `hapi-auth-jwt2` module is a library that validates a JSON Web Token in your headers, query or cookies for your application. At the time of this writing, a [PR](https://github.com/dwyl/hapi-auth-jwt2/pull/249) has been submitted to support Hapi v17. We can only make use of the repo by installing it via the GitHub repo.
* The `jwks-rsa` module is a library that helps retrieve RSA public keys from a JSON Web Key Set endpoint.

The `validate` function validates the API for any scopes defined in the token. In this example, we did not explicitly define any scope.

**Note:** Replace the `YOUR-API-AUDIENCE-ATTRIBUTE` and `YOUR-AUTH0-DOMAIN` placeholders with the API audience and Auth0 domain values from your Auth0 dashboard.

We just secured all the `post`, `put`, and `delete` API endpoints with JWT. If a user accesses these API endpoint/route without a valid access token or no token at all, it returns an error. Try it out.

![Invalid/No token](https://cdn.auth0.com/blog/hapi/missing-authentication.png)
_Accessing the GET people endpoint without an access token_

Go ahead and test it with a valid access token. Head over to the `test` tab of your newly created API on your Auth0 dashboard.

Grab the Access token from the _Test_ tab

![Get the Access token](https://cdn.auth0.com/blog/keystonejs/gettoken.png)
_Grab the Access Token_

Now use this `access token` in Postman by sending it as an Authorization header to make a GET request to `/dogs` endpoint. It validates the access token and successfully makes the GET request.

## Conclusion

You have successfully learned how to build and secure an API with Hapi. A lot of changes were made in the latest release of Hapi (v17). And there are several organizations to thank for supporting Hapi FOSS. The active sponsors were [Lob](http://bit.ly/lobh-rn), [Auth0](https://auth0.com), **CNN Digital**, [Contentful](https://www.contentful.com), [Creative Artists Agency](http://www.caa.com) and [Conde Nast Technology](http://bit.ly/cn-rn). Still working with version 16 of Hapi? check out this [excellent article](https://auth0.com/blog/hapijs-authentication-secure-your-api-with-json-web-tokens/).

In addition, Auth0 can help secure your **API** easily. Auth0 provides more than just username-password authentication. It provides features like [multifactor auth](https://auth0.com/multifactor-authentication), [breached password detection](https://auth0.com/breached-passwords), [anomaly detection](https://auth0.com/docs/anomaly-detection), [enterprise federation](https://auth0.com/docs/identityproviders), [single sign on (SSO)](https://auth0.com/docs/sso), and more. <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">Sign up</a> today so you can focus on building features unique to your app.

Please, let me know if you have any questions or observations in the comment section. 😊
