---
layout: post
title: "Load Balancing Node.js Applications with NGINX and Docker"
description: "Let's dockerize two instances of a Node.js application and load balance them with NGINX."
date: 2017-05-22 19:58
category: Technical Guide, Architecture, Performance
author:
  name: "Bruno Krebs"
  url: "https://twitter.com/brunoskrebs"
  mail: "bruno.krebs@auth0.com"
  avatar: "https://www.gravatar.com/avatar/76ea40cbf67675babe924eecf167b9b8?s=60"
design:
  bg_color: "#1C69A5"
  image: "https://cdn2.auth0.com/blog/docker-nginx/logo.png"
tags:
- nodejs
- docker
- nginx
related:
- 2016-07-12-docker-101-for-developers
- 2016-02-22-12-steps-to-a-faster-web-app
- 2016-09-06-use-nginx-plus-and-auth0-to-authenticate-api-clients
---

**TL;DR:** In this article we will see how easy it is to load balance *dockerized* Node.js applications with NGINX. We will create a simple Node.js application that serves an HTML file, containerize it with Docker, and containerize an NGINX instance that uses round-robin algorithm to load balance between two running instances of this application.

{% include tweet_quote.html quote_text="Check out how easy it is to load balance dockerized Node.js applications with NGINX." %}

## Docker and Containers

Docker is a software container platform. Developers use [Docker](https://www.docker.com/) to eliminate “works on my machine” problem when collaborating with co-workers. This is done by putting pieces of a software architecture on containers (a.k.a. *dockerize* or containerize).

Using containers, everything required to make a piece of software run is packaged into isolated containers. Unlike [Virtual Machines (VMs)](https://en.wikipedia.org/wiki/Virtual_machine), containers do not bundle a full operating system—only libraries and settings required to make the software work are needed. This makes them efficient, lightweight, self-contained and guarantees that software will always run on the same configuration, regardless of where it’s deployed.

To learn more about Docker, take a look at [this webinar](https://auth0.com/blog/docker-101-for-developers/).

## Installing Docker

Everything that we will need to test this architecture is Docker. As the instances of our [Node.js](https://nodejs.org/en/) application and [NGINX](https://www.nginx.com) will run inside Docker containers, we won't need to install them on our development machine. To install Docker, [simply follow the instructions on their website](https://www.docker.com/community-edition#/download).

## Creating the Node.js Application

To show NGINX load balancing in action, we are going to create a simple Node.js application that serves a static HTML file. After that, we are going to containerize this application and run it twice. Lastly, we will configure a *dockerized* NGINX instance to dispatch requests to both instances of our application.

In the end, we will be able to reach `http://localhost:8080` on our local machine to "randomly" get results from one or another instance. In fact, the result won't be randomly decided, we will configure NGINX to use round-robin algorithm to decide which instance will respond on each request.

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

Everything that this Node.js script does is to answer HTTP requests to `http://localhost:8080` with and HTML tag that contains a message defined in the `MESSAGE` environment variable. To better understand how this works, we can run the following commands:

```bash
export MESSAGE=Howdy!
node index
```

And then open `http://localhost:8080` on a web browser. See? We got simple web page with the `Howdy!` message. Before proceeding, let's stop our application by hitting `Ctrl + C`.

## Dockerizing the Node.js Applications

To *dockerize* our Node.js application, we will need to create a file called `Dockerfile` in the `application` directory. The content of this file will be:

```bash
FROM node
RUN mkdir -p /usr/src/app
COPY index.js /usr/src/app
EXPOSE 8080
CMD [ "node", "/usr/src/app/index" ]
```

> **Note:** If you don't understand how a Dockerfile works, check out [this reference](https://docs.docker.com/engine/reference/builder/).

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

This file will be used to configure NGINX. On it we define an [`upstream`](http://nginx.org/en/docs/http/ngx_http_upstream_module.html) group of servers containing both URLs that respond for the instances of our application. By not defining any particular algorithm to load balance requests, we are using round-robin, which is the default on NGINX. There are several other options to load balance requests with NGINX, for example [the least number of active connections](http://nginx.org/en/docs/http/ngx_http_upstream_module.html#least_conn), or [the least average response time](http://nginx.org/en/docs/http/ngx_http_upstream_module.html#least_time).

After that, we define a `server` property that configures NGINX to pass HTTP requests to `http://my-app`, which is handled by the `upstream` defined before. Also, note that we hardcoded `172.17.0.1` as the gateway IP, this is the default gateway when using Docker. If needed, you can change it to meet your local configuration.

Now we will create the `Dockerfile` that will be used to *dockerize* NGINX with this configuration. This file will contain the following code:

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

{% include tweet_quote.html quote_text="Learn how to load balancing Node.js apps with NGINX and Docker." %}

> **Note:** To use the other algorithms available on NGINX, [check their documentation for more information](https://www.nginx.com/resources/admin-guide/load-balancer/).

{% include asides/node.markdown %}

## Conclusion

Loading balancing applications with Docker and NGINX is an easy process. In this article we have managed to achieve this goal with a few simple steps. All we had to do was to install Docker on our development machine, run two instances of a *dockerized* applications and then configure a *dockerized* NGINX instance to round-robin requests to the application instances.

To learn more about **load balancing, NGINX and Docker**, check out the following resources:

- [Using nginx as HTTP load balancer](http://nginx.org/en/docs/http/load_balancing.html)
- [NGINX Load Balancing - HTTP and TCP Load Balancer](https://www.nginx.com/resources/admin-guide/load-balancer/)
- [How to Set Up NGINX Load Balancing](https://www.digitalocean.com/community/tutorials/how-to-set-up-nginx-load-balancing)
- [Docker Swarm Load Balancing with NGINX and NGINX Plus](https://www.nginx.com/blog/docker-swarm-load-balancing-nginx-plus/)
- [How to run a load-balanced service in Docker containers](http://superuser.openstack.org/articles/run-load-balanced-service-docker-containers-openstack/)
