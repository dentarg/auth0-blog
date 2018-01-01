---
layout: post
title: "B2C Company Leverages User Experience Through Single Sign-On"
description: "Learn how a B2C Company implemented Single Sign-On to provide seamless integration between different e-commerce portals."
longdescription: "Learn how a B2C Company implemented Single Sign-On to provide seamless integration between different e-commerce portals."
date: 2017-12-29 20:10
category: Technical Guide, Identity, Single Sign-On
author:
  name: "Bruno Krebs"
  url: "https://twitter.com/brunoskrebs"
  mail: "bruno.krebs@gmail.com"
  avatar: "https://twitter.com/brunoskrebs/profile_image?size=original"
design:
  image: https://cdn.auth0.com/blog/iam/logo.png
  bg_color: "#0D346C"
tags:
- b2c
- sso
- identity
- auth0
- user-experience
- ux
related:
- 2017-12-18-retail-analytics-past-present-and-future
---

**TL;DR:** In this article, we will learn how a B2C company easily implemented Single Sign-On to provide seamless integration between different e-commerce portals. The first thing we will do is to bootstrap two instances of an application to simulate these portals. Then, we will secure these instances with Auth0 and will add Single Sign-On to show that it take only a few minutes to achieve our goal. The final code can be found in this GitHub repository.

## Single Sign-On Advantages

## Simulating B2C Portals

To simulate the B2C portals and to focus on the Single Sign-On integration process, we are going to clone a GitHub repository that contains two applications: one simple backend API written in JavaScript that runs on Node.js; and one client side application written with React.

In the following sections, we are going to use these applications to simulate two portals. These portals will be pretty similar. The difference between them is that one will simulate a portal that sells products to be used at home, and the other one will simulate a portal that sells products to be used by kids (toys).

To clone the GitHub repository, we can issue the following command:

```bash
# clone the repository in the current directory
git clone https://github.com/auth0-blog/react-b2c-sso.git
```

### Running the Backend Instances

After cloning this repository, we are going to install the dependencies of the backend and then we are going to bootstrap two instances to support our portals:

```bash
# change working directory
cd react-b2c-sso/server/

# install backend dependencies
npm i

# define port to run the first backend
export PORT=3000

# define the backend that will handle requests
export REACT_APP_REST_PORT=3001

# run the first backend instance
npm start &

# define port to run the second backend
export PORT=4000

# define the backend that will handle requests
export REACT_APP_REST_PORT=4001

# run the second backend instance
npm start &
```

Note that we are using an environment variable called `REACT_APP_REST_PORT` to define on what port our backend instances will run. Besides defining on what port they run, this variable also sets the type of the backend. The backend instance running on port `3001` will return products to be used at home. The backend running on port `4001` will return products to be used by kids.

Let's check if both backend instances are running properly:

```bash
# retrieve products used at home
curl localhost:3001/products

# retrieve products used by kids
curl localhost:4001
```

### Running the Client Side Applications

Now that we have both backend APIs ready to handle requests, let's take care of the client side applications. The process, as we will see, will be easy as before. The following commands will install the dependencies of the client side application and will run two different instances. The purpose of these instances, exactly like the backend instances, will be to simulate two different portals. One that exposes products to use at home and one to expose products to be used by kids.

```bash
# change working directory to client side app root
cd ..

# install client side dependencies
npm i

# run the first client side application
export PORT=3000
export REACT_APP_REST_PORT=3001
npm start &

# run the second client side application
export PORT=4000
export REACT_APP_REST_PORT=4001
npm start &
```

As we can see, the first portal (the one that will show products to be used at home) will run on port `3000` and the second portal (the one that will show product to be used by kids) will run on port `4000`.

We can see both portals running by opening [`http://localhost:3000`](http://localhost:3000) and [`http://localhost:4000`](http://localhost:4000) on a web browser.

![Client side application running without identity management](https://cdn.auth0.com/blog/react-b2c-sso/portal.png)

## Securing the Portals with Auth0

After bootstrapping both portals, it's time to secure them and add Single Sign-On to provide a seamless user experience to our customers. As we will see, with Auth0, we will be able to achieve our goal in minutes. For starters, if we haven't done so yet, this is a good time to sign up for a <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">free Auth0 account</a>.

### Creating Auth0 APIs

Having our free account, the first thing we will do is to create two [Auth0 APIs](https://auth0.com/docs/apis) to represent our backend instances. To do that, let's open [the APIs webpage in a web browser](https://manage.auth0.com/#/apis) and click on "Create API". In the form that is shown, let's fill the "Name" input with "Products API" and "Identifier" with "https://homeproducts.ourcompany.com". This "Identifier" doesn’t have to be a publicly available URL, as Auth0 will not call our API at all. The last field in this form, "Signing Algorithm", can be left with the "RS256" value.

![Creating Auth0 APIs](https://cdn.auth0.com/blog/react-b2c-sso/creating-auth0-apis.png)

Now that we have our first API registered on Auth0, let's add a [scope](https://auth0.com/docs/scopes/current#api-scopes) to it. Scopes allow us to define the API data accessible to our client applications. In our case, as we want our clients to `get` `products`, we will create one scope: `get:producs`. To create this scope, we have to head to the "Scopes" tab of our recently created API, fill the form, and click "Add".

![Creating API Scopes on Auth0](https://cdn.auth0.com/blog/react-b2c-sso/adding-api-scopes.png)

Now it's time to do the same process for our second API, the one that will show products to be used by kids. Therefore, let's head to [the APIs page](https://manage.auth0.com/#/apis) again, click on "Create API", and fill the form with:

- "Name": "Kids Products API"
- "Identifier": "https://kidsproducts.ourcompany.com"
- "Signing Algorithm": "RS256"

After that, we have to add the same scope to this new API. As such, let's click on the "Scopes" tab and add the `get:products` scope.

### Securing the Backend Application with Auth0

With both APIs correctly configured on our Auth0 account, it's time to secure the backend application. To understand how this is done, we will add a new endpoint to accept purchases from authenticated customers only. Unauthenticated visitor won't be able to use this endpoint.

As our backend is a Node.js API written with [Express](https://expressjs.com/), we will install and configure three NPM packages:

- [`express-jwt`](https://github.com/auth0/express-jwt), an Express middleware that validates JWTs;
- [`express-jwt-authz`](https://github.com/auth0/express-jwt-authz), an Express middleware that validates JWT scopes;
- and [`jwks-rsa`](https://github.com/auth0/node-jwks-rsa), a library to retrieve RSA public keys from a [JWKS (JSON Web Key Set) endpoint](https://auth0.com/docs/jwks).

Let's start by installing these dependencies:

```bash
# change working directory to server
cd server

# install NPM dependencies
npm i express-jwt express-jwt-authz jwks-rsa
```

After that, we will refactor the `server.js` file in the `server` directory to use these packages:

```javascript
// ... other imports
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');

// ... express app and products endpoint definition

const checkJwt = jwt({
  // dynamically provide a signing key based on the kid in the header
  // and the singing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  // Validate the audience and the issuer.
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

// new endpoint to accept purchases from authenticated customers
app.post('/buy', checkJwt, jwtAuthz([ 'get:products' ]), (req, res) => {
  res.status(201).send({message: 'Thank you for buying. You make me happy!'});
});

// ... call to app.listen
```

As we can see, securing backend applications with Auth0 is really easy. In the case of a Node.js and Express combo, we just imported the three packages that we installed and configured two middleware to validate JWTs and their scopes.

With these changes in place, we can run secured instances of our backend:

```bash
# configure env variable to point to our Auth0 domain
export REACT_APP_AUTH0_DOMAIN=bk-samples.auth0.com

# define the audience and port of the first backend application
export REACT_APP_AUTH0_AUDIENCE=https://homeproducts.ourcompany.com
export REACT_APP_REST_PORT=3001
npm start &

# define the audience and port of the second backend application
export REACT_APP_AUTH0_AUDIENCE=https://kidsproducts.ourcompany.com
export REACT_APP_REST_PORT=4001
npm start &
```

What is important to note here is that now we use three environment variables in our backend applications:

- `REACT_APP_AUTH0_DOMAIN`, an env variable that points to our Auth0 domain;
- `REACT_APP_AUTH0_AUDIENCE`, an env variable that points to the identifier of one of the Auth0 APIs that we created in the previous section;
- and `REACT_APP_REST_PORT`, an env variable that defines on what port our backend will listen for requests.

Now, our backend contains a new endpoint that accepts purchases from authenticated users. As such, we can focus on the client side application and the Single Sign-On integration.

## Conclusion
