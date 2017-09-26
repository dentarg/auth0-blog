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

### Modules

[Modules on Nest.js are the most basic building blocks](http://docs.nestjs.com/modules). Through modules we encapsulate related code that composes our application, like components and controllers. To start Nest.js, we need to inform the root module of our application. Although not needed, breaking an app into multiple modules is advised, as it helps keeping different matters encapsulated.

For example, let's say that we have an application that manages users and their personal finances. Even though personal finances are related to users, we would rather avoid [high coupling](https://en.wikipedia.org/wiki/Coupling_(computer_programming)) between the classes and [low cohesion](https://en.wikipedia.org/wiki/Cohesion_(computer_science)) by splitting them into separate modules.

Defining a module on Nest.js is simple:

```typescript
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

@Module({
    components: [UsersService],
    exports: [UsersService]
})
export class UsersModule {}
```

In this case, we are exporting a module called `UsersModule` that contains a single component, `UsersService`. As this component is defined in the `exports` property of the `@Module` decorator, other modules that import `UsersModule` will be able to use it.

To start a new Nest.js application using `UsersModule` as the root module is as simple as calling `NestFactory` like this:

```typescript
import { NestFactory } from '@nestjs/core';
import { UsersModule } from './modules/users.module';

async function bootstrap() {
    const app = await NestFactory.create(UsersModule);
    await app.listen(3000);
}
bootstrap();
```

Running this code will trigger a Nest.js application and bootstrap all components defined on `UsersModule`.

### Controllers

As in many other platforms (like [Spring](https://docs.spring.io/spring/docs/current/spring-framework-reference/html/mvc.html#mvc-controller) and [ASP.NET](https://msdn.microsoft.com/en-us/library/dd410269(v=vs.98).aspx)), Controllers on Nest.js are responsible for handling HTTP requests. To define a new controller on a module, we need to:

- create a new class
- decorate the class with `@Controller()`
- and add the controller to the module definition.

As we want this controller to expose some content or accept new data, we also need to create a method on it decorated with one endpoint decorator (e.g. `@Get` or `@Post`). Therefore, this is the minimum code we need to create a controller:

```typescript
import {Controller, Get} from '@nestjs/common';

@Controller('friendly-guy')
export default class FriendlyGuyController {

    @Get()
    sayHi() {
        return "Howdy!"
    }
}
```

And this is how we add it to a module:

```typescript
import { Module } from '@nestjs/common';
import FriendlyGuyController from './friendly-guy-controller';

@Module({
    modules: [],
    controllers: [FriendlyGuyController]
})
export class ApplicationModule {}
```

### Components
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

### Basic Structure

A Nest application is nothing more than a Node.js app. As such, we will create a new directory to hold the source code of our app, and will use NPM to manage our dependencies. We achieve that by running the following commands:

```bash
# create a new directory
mkdir nest-companies

# move to new directory
cd nest-companies

# starts NPM with default properties
npm init -y
```

The last command, [`npm init -y`](https://docs.npmjs.com/cli/init), starts the `nest-companies` directory as a Node.js project by creating the [`package.json`](https://docs.npmjs.com/files/package.json) file with the [default properties](https://github.com/auth0-blog/nest-companies/commit/d4f60e7244ca1976d71bf8fbcd14b6fe9a072093). With this file in place, we can add the minimum dependencies to boot a Nest application. To do that, we use `npm` as follows:

```bash
npm i @nestjs/common \
      @nestjs/core \
      @nestjs/microservices \
      @nestjs/websockets \
      rxjs \
      typescript \
      reflect-metadata

npm i -D @types/node \
         ts-node
```

There is no way we can create a Nest app with less dependencies than this. Therefore it's worthwhile to understand why we have to add each dependency above.

The first dependency, [`@nestjs/common`](https://github.com/nestjs/nest/tree/master/src/common), adds the most commonly used components on a Nest application. For example, having this dependency we can define a [Module](https://docs.nestjs.com/modules) for our application, as we will see soon.

The second dependency, [`@nestjs/core`](https://github.com/nestjs/nest/tree/master/src/core), defines the core functionality of Nest.js. Through this library, we can create, among other things, an instance of [NestApplication](https://github.com/nestjs/nest/blob/master/src/core/nest-application.ts) to run our Nest.js module.

The third dependency, [`@nestjs/microservices`](https://github.com/nestjs/nest/tree/master/src/microservices), won't be used by us directly. Even though this library is internally used by `@nestjs/common`, we need to add it as a dependency because Nest.js team marked it as a [peer dependency](https://docs.npmjs.com/files/package.json#peerdependencies). An issue on GitHub has been created a while ago to discuss [why @nestjs/core is required as a peerDependency on `@nestjs/common`](https://github.com/nestjs/nest/issues/116). Though, as nothing concrete has been achieved yet, we need to add the dependency explicitly.

Just like the `@nestjs/microservices`, `@nestjs/websockets` also is also required internally by one Nest.js library. Though marked as a peer dependency. Therefore, the solution for now is the same, explicitly add it as a dependency of our project.

The fifth dependency is a well-known library: `rxjs`. As this [library's README file on GitHub states](https://github.com/Reactive-Extensions/RxJS), `rxjs` is a set of libraries to compose asynchronous and event-based programs using observable collections and [Array#extras](https://blogs.msdn.microsoft.com/ie/2010/12/13/ecmascript-5-part-2-array-extras/) style composition in JavaScript.

[TypeScript](https://www.typescriptlang.org/), the sixth dependency, is a superset of JavaScript that compiles to clean JavaScript output. This language adds types, classes, and modules to JavaScript. It helps developers to be more productive and produce more reliable code through tooling that supports autocompletion and type checking. The whole Nest.js framework has been written in TypeScript, and using this language is advised when developing applications with this framework.

The last runtime dependency, [`reflect-metadata`](https://github.com/rbuckton/reflect-metadata), is also used internally by Nest.js framework while it's marked as a peer dependency. This library gives Nest.js the ability to manage decorators on runtime through a reflective API. Being a peer dependency, we also explicitly define it in our project.

Besides this seven runtime dependencies, we also needed to define two [development dependencies](https://docs.npmjs.com/files/package.json#devdependencies) on our app. The first one, `@types/node`, provides TypeScript definition of the Node.js API. With it, we can use count on TypeScript to check if our code is valid while interacting with Node.js directly. The second development dependency, [`ts-node`](https://github.com/TypeStrong/ts-node) allows us to execute TypeScript files directly without transpiling it to JavaScript first. Using this library on production is not advised, as it adds a lot of burden to the process.

- index.js

```js
require('ts-node/register');
require('./src/server');  
```

- src/server.ts

```typescript

```

## Creating Nest Controllers

### Handling Get Requests on Nest
### Handling Post Requests on Nest

## Validating Data on Nest

## Aside: Securing Nest Applications with Auth0

## Final Thoughts

WebSockets, Automated Tests, i18n, Database Integration

Conclusion
