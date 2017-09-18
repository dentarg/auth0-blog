---
layout: post
title: "Is TypeScript Good for Nodejs Web Apps? Sure, Meet Nest!"
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

## Nest Build Blocks

### Controllers

Controllers, on Nest, are the objects responsible for handling incoming requests. As we will see, controllers are classes

### Components
### Modules
### Middlewares
### Exception Filters
### Pipes
### Guards
### Interceptors

## Bootstrapping a Nest Application

Three alternatives: cloning GitHub repository, https://github.com/nestjs/nest-cli, or

- npm install
- ./src/modules/app.module.ts
- ./src/server.ts
- ./index.js
- ./tsconfig.json
- tslint.json

won't clone or use nest-cli to learn the Nest way.

## Creating Nest Controllers

### Handling Get Requests on Nest

### Handling Post Requests on Nest

- install and configure bodyParser
- import controller on app.module.ts

## Validating Data on Nest

- install the [`class-validator` package](https://github.com/pleerock/class-validator)
- create ValidationPipe.ts
- create HttpExceptionFilter.ts

## Aside: Securing Nest Applications with Auth0

- Short note about the possibility of creating a Middleware (or anything else) to encapsulate JWT validation.
- comment on GitHub about that the idea is to release this blog post as soon as possible to see the traction
- if the community show interest, we can further elaborate securing Nest with Auth0. Who knows, we might even create a OSS module to easily handle this on Nest

## Final Thoughts

WebSockets, Automated Tests, i18n, Database Integration

Conclusion
