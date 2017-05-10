---
layout: post
title: "Load Balancing NodeJS Applications with NGINX and Docker"
description: "Let's dockerize two instances of a NodeJS application and load balance them with NGINX."
date: 2017-05-09 19:58
category: Technical Guide, Architecture, Performance
author:
  name: "Bruno Krebs"
  url: "https://twitter.com/brunoskrebs"
  mail: "bruno.krebs@auth0.com"
  avatar: "https://www.gravatar.com/avatar/76ea40cbf67675babe924eecf167b9b8?s=60"
design:
  bg_color: "#2E668D"
  image: "https://cdn2.auth0.com/blog/boot-faces/jsf-logo.png"
tags:
- nodejs
- docker
- nginx
related:
- 2016-07-12-docker-101-for-developers
- 2016-02-22-12-steps-to-a-faster-web-app
- 2016-09-06-use-nginx-plus-and-auth0-to-authenticate-api-clients
---

**TL;DR:** In this article we will see how easy it is to load balance dockerized NodeJS applications with NGINX. We will create a simple NodeJS application that serves an HTML file, containerize it with Docker, and containerize an NGINX instance that uses round-robin algorithm to load balance between two running instances of this application.

## Installing Docker

Everything that we will need to test this architecture is [Docker](https://www.docker.com/). As the instances of our NodeJS application and the [NGINX](https://www.nginx.com) will run inside Docker containers, we won't need to install anything else on our development machine. To install Docker, [simply follow the instructions on their website](https://www.docker.com/community-edition#/download).

## Creating the NodeJS Application

To show NGINX load balancing in action, we are going to create a simple NodeJS application that serves a static HTML file. After that, we are going to containerize this application and run it twice. Lastly, we will configure a dockerized NGINX instance to dispatch requests to both instances of our application.

In the end, we will be able to reach `http://localhost:8080` on our local machine to "randomly" get results from one or another instance. In fact it is not random, we will configure NGINX to use round-robin algorithm to decide which instance will respond on each request.

But let's tackle one step at a time. To create this application we will first create a directory for the application, and then create an `index.js` file that will respond to HTTP requests.

To create the directory, let's issue the following command: `mkdir application`. After that, let's create the `index.js` file in this directory and paste the following source code:

```js
var http = require('http');
var fs = require('fs');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(`<h1>${process.env.MESSAGE}</h1>`);
}).listen(8080);
```

Everything that this NodeJS script does is to answer HTTP requests to `http://localhost:8080` with and HTML tag that contains a message defined in the `MESSAGE` environment variable. To better understand how this works, we can run the following commands:

```bash
export MESSAGE=Howdy!
node index
```

And then open `http://localhost:8080` on a web browser. See? We got simple web page with the `Howdy!` message. Before proceeding, let's stop our application by hitting `Ctrl + C`.

## Dockerizing the NodeJS Applications

To dockerize our NodeJS applications, we will need to create a file called `Dockerfile` in the `application` directory. The content of this file will be:

```bash
FROM node
RUN mkdir -p /usr/src/app
COPY index.js /usr/src/app
EXPOSE 8080
CMD [ "node", "/usr/src/app/index" ]
```

> **Note:** If you don't understand how Docker or Dockerfile works, check out [this article](https://auth0.com/blog/docker-101-for-developers/) and [this reference](https://docs.docker.com/engine/reference/builder/).

After that we need to create an image, from this `Dockerfile`, which can be done through the following command:

```bash
docker build -t load-balanced-app .
```

And then we can run both instances of our application with the following commands:

```bash
docker run -e "MESSAGE=First instance" -p 8081:8080 -d load-balanced-app
docker run -e "MESSAGE=Second instance" -p 8082:8080 -d load-balanced-app
```

After running both commands, we will be able to open both instances on a web browser by going to `http://localhost:8081` and `http://localhost:8082`. The first URL will show a message saying "First instance", the second URL will show a message saying "Second instance".

## Load Balancing with a Dockerized NGINX Instance

Now that we have both instances of our application running on different Docker containers and responding on different ports on our host machine, let's configure an instance of NGINX to load balance requests between them. First we will start by creating a new directory.

```bash
mkdir nginx-docker
```

In this directory, we will create a file called `nginx.conf` with the following code:

```bash
upstream my-app {
    server 172.17.0.1:8081 weight=1;
    server 172.17.0.1:8082 weight=1;
}

server {
    location / {
        proxy_pass http://my-app;
    }
}
```

This file will be used to configure NGINX. On it we can see that we first define an [`upstream`](http://nginx.org/en/docs/http/ngx_http_upstream_module.html) group of servers, with both URLs that respond for the instances of our application. After that we define a `server` property that configures NGINX to pass HTTP requests to `http://my-app`, which is handled by the `upstream` defined before. Also, note that we hardcoded `172.17.0.1` as the gateway IP. If needed, you can change it to meet your local configuration.

Now we will create the `Dockerfile` that will be used to dockerize NGINX with this configuration. This file will contain the following code:

```bash
FROM nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

Having created both files, we can now build and run NGINX containerized on Docker. We achieve that by running the following commands:

```bash
docker build -t load-balance-nginx .
docker run -p 8080:80 -d load-balance-nginx
```

After issuing these commands, let's open a web browser and access `http://localhost:8080`. If everything went well, we will see a web page with one of the two messages: `First instance` or `Second instance`. If we hit reload on our web browser a few times, we will realized that from time to time the message displayed switches between `First instance` and `Second instance`. This is the round-robin load balancing algorithm in action.

> **Note:** There are other algorithms available on NGINX, [check their documentation for more info](https://www.nginx.com/resources/admin-guide/load-balancer/).

## Aside: Securing NodeJS Applications with Auth0

One of the most complex features to implement in an application is user authentication and identity management. [Security for authentication and identity](https://auth0.com/docs/security) is [an entire glossary](https://auth0.com/identity-glossary) unto itself.

![Auth0 hosted login screen](https://cdn2.auth0.com/blog/angular-aside/angular-aside-login.jpg)

If you need to implement a robust, highly customizable [identity and access management](https://auth0.com/learn/cloud-identity-access-management/) system quickly and easily for your NodeJS application, Auth0 can help. Take a look at [Auth0 NodeJS SDK Quickstart](https://auth0.com/docs/quickstart/webapp/nodejs/00-intro) to properly secure your application.

## Conclusion

Loading balancing applications with Docker and NGINX is an easy process. In this article we have managed to achieve this goal with a few simple steps. All we had to do was to install Docker on our development machine, run two instances of a dockerized applications and then configure a dockerized NGINX instance to round-robin requests to the application instances.
