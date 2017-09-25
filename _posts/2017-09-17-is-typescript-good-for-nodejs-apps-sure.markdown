---
layout: post
title: "TypeScript on Node.js Web Apps? Yes, Meet Nest!"
description: ""
date: 2017-09-17 00:21
category: Technical Guide
author:
  name: "Bruno Krebs"
  url: "https://twitter.com/brunoskrebs"
  mail: "bruno.krebs@auth0.com"
  avatar: "https://www.gravatar.com/avatar/76ea40cbf67675babe924eecf167b9b8?s=60"
design:
  bg_color: "#3F6426"
  image: https://cdn.auth0.com/blog/spring-boot-auth/logo.png
tags:
- nest
- nodejs
- typescript
related:
- 2017-09-07-developing-restful-apis-with-loopback
---

TL;DR:

## Nest? Is it a new Framework?

## Nest Building Blocks

### Controllers
### Components
### Modules
### Middlewares
### Exception Filters
### Pipes
### Guards
### Interceptors

## Building a Nest Application

Now that we understand the building blocks available on Nest, let's create a small application with this framework. Through this app, we will be able to see some of the core concepts of Nest in action.

Nest provides two easy ways to start a new application. We could clone [the Nest TypeScript Starter project available on GitHub](https://github.com/kamilmysliwiec/nest-typescript-starter), or we could use the [CLI tool for Nest applications](https://github.com/nestjs/nest-cli). Both alternatives are equally good and provide a solid foundation to build apps. Though, as we want to understand how a Nest application is built, we are going to create a new one from scratch.

### What We'll Build

During this article, we are going to create a small RESTful API that enables users to create, retrieve, update, and delete companies. To keep things simple, we will handle companies without interacting with any external database. That is, we will hold companies in memory just while the application is up and running.

The application, although small, will help us understand from what pieces a Nest application is made of and how these pieces work together. In the end, we will have the same configuration we would get by using the Nest CLI tool or by cloning the starter project.

## Creating Nest Controllers

### Handling Get Requests on Nest
### Handling Post Requests on Nest

## Validating Data on Nest

## Aside: Securing Nest Applications with Auth0

## Final Thoughts

WebSockets, Automated Tests, i18n, Database Integration

Conclusion
