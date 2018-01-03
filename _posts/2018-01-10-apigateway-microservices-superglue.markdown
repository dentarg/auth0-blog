---
layout: post
title: "API Gateway: the Microservices Superglue"
description: "Express Gateway is an API Gateway that sits at the heart of any microservices architecture, securing your microservices and exposing them through APIs."
longdescription: "Express Gateway is an API Gateway that sits at the heart of any microservices architecture (regardless of what language or platform you're using), securing your microservices and exposing them through APIs. In this tutorial, I'll show you how an API Gateway can be a great tool when you have multiple microservices."
date: 2018-01-10 10:00
category: Technical Guide, Backend, NodeJS
banner:
  text: "Auth0 makes it easy to issue JWT for your API Gateway and act as system of records."
author:
  name: "Vincenzo Chianese"
  url: "https://twitter.com/d3dvincent"
  mail: "vincenzo@express-gateway.io"
  avatar: "https://pbs.twimg.com/profile_images/932249086333464576/DacF9HCu_400x400.jpg"
design:
  image: https://github.com/ExpressGateway/express-gateway/blob/master/logo/mark-only/ExpressGateway_logomark.png?raw=true
  image_size: 85%
  image_bg_color: "#ffffff"
  bg_color: "#00728E"
tags:
- javascript
- nodejs
- authentication
- auth
- api
- rest
- apigateway
---

**TL;DR:** In this tutorial, I'll show you how an API Gateway can be a great tool when you have multiple
microservices that need to share multiple tasks. You can get the code example [here](https://github.com/XVincentX/apigateway-playground).

---

## Introduction

[Microservices](https://auth0.com/blog/an-introduction-to-microservices-part-1/) is an architectural style with the basic idea of **decomposing** a system in a collection of services, each one implementing a particular capability/feature of the system itself based on business, technical, and other requirements.

[This has several benefits compared to a monolithic approach](https://auth0.com/blog/getting-a-competitive-edge-with-a-microservices-based-architecture/):

* It enables the **continuous delivery** of large, complex applications by deploying the singular pieces **independently**.
* It enables to select the framework and the programming language that you think it's the best for the job. You can use the latest technologies on a microservice while keep the other parts in legacy mode.
* It improves your teams agility, the ability to iterate on a small, focused piece of functionality quickly and to see results.
* It improves the resiliency of your system because a crash of a microservice **does not halt** your entire system (you can gracefully degrade the user experience).

The above points can be summarized with two keywords: **independence** and **isolation**.

This concept has been riding high during the last years with [blog posts][https://auth0.com/blog/tags/microservices/], articles, [websites](http://microservices.io), and even dedicated conferences although this is nothing really new—but rather a culmination of **best practices** in the modern web era, pushed by a tech giant that felt the need almost [ten years ago](http://www.zdnet.com/article/soa-done-right-the-amazon-strategy/).

Most of the time we don't necessarily have the same web scale, but we can benefit anyway from the paradigm of microservices.

## Challenges

The challenge though is that with microservices the knowledge is spread among multiple little pieces. However, on the other hand, the end game of your application is, most of the time, the exposure of what you're building through an **uniform API**.

So, we have two sides of the same coin: on one side, we want to break up our app into a set of services and [evergreen](https://blog.juriba.com/evergreen-it-concept-or-reality) them; on the other, we still want to offer an uniform experience.

Suppose you need to create a `Coffee` order system that will let people, registered as `Customers`, request for a coffee through an `Order`.

After a bunch of meetings, everybody in the company agrees that the `User` and registration part of your application will be written in JavaScript and run on [Node.js](https://nodejs.org/en/), while the `Order` system will be written in Go. Among the technical requirements, you want all the requests must be authenticated and, in order to prevent flooding, you want to put a [rate limiting policy](https://auth0.com/docs/connections/database/rate-limits).

Now, with such requirements, a couple of questions stand:

1. Writing **idiomatic** JavaScript is different than writing idiomatic Go. According to the programming language and the framework you're using the API you're exposing in Go might be **completely** different with regards to the other one exposed from the JavaScript microservice. How do you make sure that the final API—intended as the the whole surface exposed by your application—is _uniform_ and _consistent_?
2. _Rate limiting_, _authentication_, _authorization_, and a bunch of other stuff are things that should be shared across multiple microservices in your organisation. If you re-implement these things in each single microservice, you are **duplicating** the code at first, but more importantly you have two different pieces of software to maintain. This will mean that you will also need to make sure they behave in the same way (that's not trivial, since you could be potentially using two libraries for that).

## Solution

It turns out that, no matter the way you're doing microservices (whether you're dividing your system by business features, by domain, or coming up with a microservice architecture starting from your data), there are parts of them that are sharing functionalities.

[Microservices need a **superglue** and that glue is an **API Gateway**](https://auth0.com/blog/an-introduction-to-microservices-part-2-API-gateway/).

## API Gateway

An _API Gateway_ is a centralized middleware that encapsulates the internal system architecture and provides an API that can be shaped based on real client needs rather than simply returning what the particular microservice is sending you back. These gateways are effectively implementing the [**facade pattern**](https://en.wikipedia.org/wiki/Facade_pattern) in the microservices world.

API Gateway can have other responsibilities such as _authentication_, _monitoring_, _load balancing_, _caching_, _request shaping and management_, and _static response handling_.

## API Gateway in Practice

Let's move from theory to practice and see how to configure an API Gateway to serve our needs.

Let's suppose that we have `Customer` and `Order` microservices listening to `http://customers` and `http://orders` respectively. Using [Docker](https://docker.com) or [Kubernetes](https://kubernetes.io) achieving such scenario should be fairly easy.

We will configure an instance of an API Gateway that will sit on the edge of our system. This gateway will serve as a router for our microservices, but we'll also move some shared logic from the microservices to it. This will enable our applications to focus on the business logic.

This gateway will also throttle all the requests based on clients' IP addresses and make sure that all the
requests are authenticated based on a **JWT** that _Auth0_ is going to provide. [Auth0e will work as our **system of record** for our users](https://auth0.com/blog/360-view-of-customer-by-managing-identity/).

There are multiple API Gateways on the market. Some of them are offered by big software companies as a managed hosted solution and others are open source products. Of course, you can technically write your own solution too, but why reinvent the wheel? Instead, let's take advantage of [Express-Gateway](https://express-gateway.io).

## Meet Express-Gateway

Express Gateway is an API Gateway that sits at the heart of any microservices architecture, regardless of what language
or platform you're using, **securing** your microservices and exposing them through **APIs** using [Node.js][11],
[ExpressJS][12] and [Express middleware][13].

![](https://gist.githubusercontent.com/XVincentX/8c1c844727cadd071ea3a04a328aad50/raw/30c4d5148cbf200fd8fe4bc610a82dac411156b4/eg-diagram.png)

It centralizes all of the application configuration for the API use case into one YAML(or JSON) file. Within the YAML
file is an easy to understand description of how and what is configured.

Express Gateway entities, like _policies_, _pipelines_, _conditions_, and _actions_, wrap around Express middleware to
make it **dynamic**. Any Express middleware can be plugged into Express Gateway to take advantage of its dynamic
capabilities. It also features an hot-reload mechanism so you can change its configuration without having to restart
the gateway at all.

### Hands on

Installing [express-gateway](https://express-gateway.io) is dead simple:

`~$ npm i -g express-gateway`

This will install the command line `eg` in your system, so we can now bootstrap a new gateway instance:

```shell
~$ eg gateway create
? What's the name of your Express Gateway? eg-example
? Where would you like to install your Express Gateway? eg-example
? What type of Express Gateway do you want to create? Getting Started with…
     created package.json
     created server.js
      ...  To start eg-example, run the following commands:
     cd eg-example && npm start
```

Next, cd into `eg-example` directory and modify the [gateway.config.yml][4] file. This is the file that controls your
gateway’s behavior. For a complete configuration reference, you can see the [documentation][5].

```yml
http:
  port: 8080
apiEndpoints:
  customers:
    host: customers.company.com
  orders:
    host: orders.company.com
serviceEndpoints:
  customers:
    url: 'http://customers'
  orders:
    url: 'http://orders'
policies:
  - jwt
  - proxy
  - rate-limit
pipelines:
  customers:
    apiEndpoints:
      - customers
    policies:
      - rate-limit:
        - action:
            max: 1
            windowMs: 1000
      - jwt:
        - action:
            secretOrPublicKeyFile: /key/pubKey.pem
            checkCredentialExistence: false
      - proxy:
          - action:
              serviceEndpoint: customers
              changeOrigin: true
  orders:
    apiEndpoints:
      - orders
    policies:
      - rate-limit:
        - action:
            max: 1
            windowMs: 1000
      - jwt:
        - action:
            secretOrPublicKeyFile: /key/pubKey.pem
            checkCredentialExistence: false
      - proxy:
          - action:
              serviceEndpoint: orders
              changeOrigin: true
```

Let's go through the main part of the current configuration:

The gateway will listen for Http requests on port `8080` (you might want to change it to `80` when going in production).
Then we have defined two **pipelines**, one per microservice, where we have enabled the [rate limit policy][6] and the
[jwt][7] verification policy.

> **Note:** the configuration is shown in a extended form for clarity. However it can be DRYed using [YAML references][8].

> **Note:** If you want to test this locally, you'll need to make sure that `company.com` domain will point to your
local machine. This can be achieved usind [dnsmasq](http://www.thekelleys.org.uk/dnsmasq/doc.html) or modyfing your
hosts file, putting both `customers.company.com` *AND* `orders.company.com` to point to localhost. Another alternative
woud be to manually put the `HOST` header to the correct value while issuing requests.

## Configure the client and the user in Auth0

Let's now configure Auth0 so it will be our **system of record** for the users and **issue JWTs** for us.

If you don't already have an Auth0 account, sign up for a free one [now](https://auth0.com/signup).

From here, click on the **APIs** menu item and then the **Create API** button. You will need to give your API a name
and an identifier. The name can be anything you choose, so make it as descriptive as you want. The identifier will be
used to identify your API, this field cannot be changed once set.

For our example, I'll name the API **billings** and for the identifier I'll set it as `http://orders`. We'll leave the
signing algorithm as RS256 and click on the **Create API** button.

![](https://gist.githubusercontent.com/XVincentX/8c1c844727cadd071ea3a04a328aad50/raw/30c4d5148cbf200fd8fe4bc610a82dac411156b4/create-api.png)

Now point your browser to `https://yourApi.auth.com/pem` and download the **public key** file. This is the key we will
use to verify that the JSON Web Tokens issued by Auth0 are valid. Save it as `pubKey.pem` and place it in the same
directory specified in `secretOrPublicKeyFile` parameter of the `jwt` policy.

The API Gateway has now been configured correctly to handle the scenarios.

### Test drive

Start the gateway using `npm start` in the gateway directory. Once running, let's try to issue a couple of requests to
it:

```shell
$ curl http://customers.company.com & curl http://customers.company.com
$ [1] 4495
$ Unauthorized
$ [1]+  Done
$ Too many requests, please try again later.
```

You can see that the first request has been denied with `Unauthorized` as response text. That's because we didn't
provide any JWT with the request, and it didn't go through.

Moreover, the second request has been refused by the rate limiting policy, without event arriving to the
**authentication** phase (policies are executed following the definition order in the configuration file).

Now grab any Http client and let's configure it to start an OAuth2 authorization process against our API hosted in Auth0.
We can grab all the necessary parameters going on _Clients_ -> _Settings_ -> _Advanced Settings_ -> _Endpoints_

![](https://gist.githubusercontent.com/XVincentX/8c1c844727cadd071ea3a04a328aad50/raw/30c4d5148cbf200fd8fe4bc610a82dac411156b4/auth0-endpoints.png)

In my case, I am going to use [Insomnia](https://insomnia.rest) but you can use the one you prefer.

![](https://gist.githubusercontent.com/XVincentX/8c1c844727cadd071ea3a04a328aad50/raw/30c4d5148cbf200fd8fe4bc610a82dac411156b4/insomnia.png)

Now by simply clicking on the _Fetch token_ button, the oAuth2 flow will be initiated and once over, a JWT will
be populated under the *access_token* field.

You can verify the returned informations using [JWT.io](https://jwt.io/#debugger), as well as the signature.

That is the token to be used in order to access the protected resource. So just try to issue the request again
making sure that the token is now sent as a `Bearer` Authorization endpoint. The response should hopefully be `200`.

## Conclusions

Thanks to [Express-Gateway](https://express-gateway.io), we have moved two shared concerns (authentication and rate limiting) from the
microservices to a centralized middleware that — no matter how many microservices we're going to have — it is going to
behave in a consistent way.

We can now safely remove the code handling that from our microservices and assume that, if they're receiving a request,
it's both **authenticated** and it passed the **rate-limit** checks. You now have **guarantees**.

However, this is just the tip of the iceberg.

The benefits of an API Gateway do not stop here. In this example, we've shown how it can make some checks on **inboud**
requests, but it can also be used to modify the **outbound** responses.

In the initial part of the article, we were talking about the uniform API. An API Gateway could transform the response
coming from a particular microservice so that the returned payload is consistent with the other microservices, even
though the original data is shaped in a different way. Hopefully, we will explore this in a future article.

In meantime, you can see some other interesting use cases on
[Express-Gateway website](http://www.express-gateway.io/resources/).

[4]: https://www.express-gateway.io/docs/configuration/gateway.config.yml/
[5]: http://www.express-gateway.io/docs/
[6]: https://www.express-gateway.io/docs/policies/rate-limiter
[7]: https://www.express-gateway.io/docs/policies/jwt
[8]: http://blog.daemonl.com/2016/02/yaml.html
[11]: https://nodejs.org
[12]: https://expressjs.com/
[13]: https://expressjs.com/en/guide/writing-middleware.html
