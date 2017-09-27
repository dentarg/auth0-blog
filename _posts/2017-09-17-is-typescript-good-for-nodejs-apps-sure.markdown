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

Nest.js allows developers to create components that can be injected into other components or controllers. A component usually plays one of two roles on Nest.js applications. The first one is the `Service` role, when a component contains some business logic. The second one is the `Repository` role, when a component abstracts away the interaction with databases.

For example, let's say that we have a `Service` that handles checkouts on a store. To allow a checkout to consolidate, the `Service` has to interact with a `Repository` to check if there are enough items on the inventory for the desired product. In this scenario, we would have the `Service` defined as follows:

```typescript
import { Component } from '@nestjs/common';

@Component()
export class CheckoutService {
  constructor(private readonly inventoryRepository: InventoryRepository) {}

  checkout(cart: ShoppingCart) {
    for (let item of cart.items) {
      let inventory = this.inventoryRepository.getInventory(item.product);
      if (inventory.size < item.quantity) {
        throw new Error("Not enough items");
      }
    }
    // ...
  }
}
```

The `CheckoutService`, in this case, is a `@Component()` that can be injected on a controller or on another component. Besides that, the component itself depends on a repository called `InventoryRepository`. This repository is then used to retrieve the inventory for a specific product, so the service can check if there are enough items to be sold.

As Nest.js heavily uses the [Dependency Injection design pattern](https://angular.io/guide/dependency-injection), it's easy to manage dependencies between the building blocks. We just have to define dependencies in the constructor of a controller or component, and Nest.js will provide an instance for us.

```typescript
// ...
export class CheckoutService {
  constructor(private readonly inventoryRepository: InventoryRepository) {}
  // ...
}
```

### Middlewares

Whenever we want to act on a request before it reaches a controller, we can create a [`Middleware`](http://docs.nestjs.com/middlewares). On Nest.js, middlewares are classes that implement the [`NestMiddleware` interface](https://github.com/nestjs/nest/blob/master/src/common/interfaces/middlewares/nest-middleware.interface.ts) and that are decorated with `@Middleware()`. This interface expects us to define a concrete implementation of the `resolve` method to return a [Express middleware](https://expressjs.com/en/guide/writing-middleware.html): `(req, res, next) => void`.

Below we can see an example of a middleware that enables [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin):

```typescript
import { Middleware, NestMiddleware, ExpressMiddleware } from '@nestjs/common';

@Middleware()
export class CorsMiddleware implements NestMiddleware {
    resolve(...args: any[]): ExpressMiddleware {
        return (req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            next();
        };
    }
}
```

To activate this middleware, we need to make our module implement `NestModule` to provide a concrete method definition of `configure`:

```
import { Module, NestModule, MiddlewaresConsumer, RequestMethod } from '@nestjs/common';
import { CorsMiddleware } from './cors.middleware';

@Module({})
export class ApplicationModule implements NestModule {
    configure(consumer: MiddlewaresConsumer): void {
        consumer.apply(CorsMiddleware).forRoutes(
            { path: '/example', method: RequestMethod.GET }
        );
    }
}
```

In this case, `CorsMiddleware` has been activated only for `GET` requests that aim the `/example` path on our application. [The official documentation provides further explanation on how to use middlewares](http://docs.nestjs.com/middlewares).

### Exception Filters

One great feature provided by Nest.js is the addition of a layer responsible for catching unhandled exceptions. On this layer we can define custom [Exception Filters](http://docs.nestjs.com/exception-filters). To define an exception filter, we have to:

1. create a class that implements the `ExceptionFilter`,
2. decorate it with `@Catch()`,
3. and implement the `catch(exception: HttpException, response)` method.

For example, let's suppose that we have a custom exception called `BusinessException`. If we want to provide a default message to users whenever this exception occurs, we can create a exception filter like this:

```typescript
import { ExceptionFilter, Catch } from '@nestjs/common';
import { BusinessException } from './business.exception.ts';

@Catch(BusinessException)
export class BusinessExceptionFilter implements ExceptionFilter {
  catch(exception: BusinessException, response) {
    response.status(status).json({
      message: 'Oh, no! You are not doing business right!',
    });
  }
}
```

Then we can make a controller use this exception handler by using the `@UseFilters()` decorator:

```typescript
import { UseFilters } from `@nestjs/common`;

@UseFilters(new BusinessExceptionFilter())
export class BusinessController {}
```

Or we can make it a global exception handler by making our app instance use it:

```typescript
async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);

  // Adding global exception handler
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
}
bootstrap();
```

## Building a Nest Application

Now that we understand the building blocks available on Nest, let's create a small application with this framework. Through this app, we will be able to see some of the core concepts of Nest in action.

Nest provides two easy ways to start a new application. We could clone [the Nest TypeScript Starter project available on GitHub](https://github.com/kamilmysliwiec/nest-typescript-starter), or we could use the [CLI tool for Nest applications](https://github.com/nestjs/nest-cli). Both alternatives are equally good and provide a solid foundation to build apps. Though, as we want to understand how a Nest application is built, we are going to create a new one from scratch.

### What We'll Build

During this article, we are going to create a small RESTful API that enables users to create, retrieve, update, and delete companies. To keep things simple, we will handle companies without interacting with any external database. That is, we will hold companies in memory just while the application is up and running.

The application, although small, will help us understand from what pieces a Nest application is made of and how these pieces work together. In the end, we will have the same configuration we would get by using the Nest CLI tool or by cloning the starter project.

### Initializing NPM

A Nest application is nothing more than a Node.js app. As such, we will create a new directory to hold the source code of our app, and will use NPM to manage our dependencies. We achieve that by running the following commands:

```bash
# create a new directory
mkdir nest-companies

# move to new directory
cd nest-companies

# starts NPM with default properties
npm init -y
```

The last command, [`npm init -y`](https://docs.npmjs.com/cli/init), starts the `nest-companies` directory as a Node.js project by creating the [`package.json`](https://docs.npmjs.com/files/package.json) file with the [default properties](https://github.com/auth0-blog/nest-companies/commit/d4f60e7244ca1976d71bf8fbcd14b6fe9a072093).

### Adding Dependencies

With this file in place, we can add the minimum dependencies to boot a Nest application. To do that, we use `npm` as follows:

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

- The first dependency, [`@nestjs/common`](https://github.com/nestjs/nest/tree/master/src/common), adds the most commonly used components on a Nest application. For example, having this dependency we can define a [Module](https://docs.nestjs.com/modules) for our application, as we will see soon.

- The second dependency, [`@nestjs/core`](https://github.com/nestjs/nest/tree/master/src/core), defines the core functionality of Nest.js. Through this library, we can create, among other things, an instance of [NestApplication](https://github.com/nestjs/nest/blob/master/src/core/nest-application.ts) to run our Nest.js module.

- The third dependency, [`@nestjs/microservices`](https://github.com/nestjs/nest/tree/master/src/microservices), won't be used by us directly. Even though this library is internally used by `@nestjs/common`, we need to add it as a dependency because Nest.js team marked it as a [peer dependency](https://docs.npmjs.com/files/package.json#peerdependencies). An issue on GitHub has been created a while ago to discuss [why @nestjs/core is required as a peerDependency on `@nestjs/common`](https://github.com/nestjs/nest/issues/116). Though, as nothing concrete has been achieved yet, we need to add the dependency explicitly.

- Just like the `@nestjs/microservices`, `@nestjs/websockets` also is also required internally by one Nest.js library. Though marked as a peer dependency. Therefore, the solution for now is the same, explicitly add it as a dependency of our project.

- The fifth dependency is a well-known library: `rxjs`. As this [library's README file on GitHub states](https://github.com/Reactive-Extensions/RxJS), `rxjs` is a set of libraries to compose asynchronous and event-based programs using observable collections and [Array#extras](https://blogs.msdn.microsoft.com/ie/2010/12/13/ecmascript-5-part-2-array-extras/) style composition in JavaScript.

- [TypeScript](https://www.typescriptlang.org/), the sixth dependency, is a superset of JavaScript that compiles to clean JavaScript output. This language adds types, classes, and modules to JavaScript. It helps developers to be more productive and produce more reliable code through tooling that supports autocompletion and type checking. The whole Nest.js framework has been written in TypeScript, and using this language is advised when developing applications with this framework.

- The last runtime dependency, [`reflect-metadata`](https://github.com/rbuckton/reflect-metadata), is also used internally by Nest.js framework while it's marked as a peer dependency. This library gives Nest.js the ability to manage decorators on runtime through a reflective API. Being a peer dependency, we also explicitly define it in our project.

Besides these seven runtime dependencies, we also needed to define two [development dependencies](https://docs.npmjs.com/files/package.json#devdependencies) on our app. The first one, `@types/node`, provides TypeScript definition of the Node.js API. With it, we can use count on TypeScript to check if our code is valid while interacting with Node.js directly. The second development dependency, [`ts-node`](https://github.com/TypeStrong/ts-node), allows us to execute TypeScript files directly without transpiling it to JavaScript first. Using this library on production is not advised, as it adds a lot of burden to the process.

### Bootstrapping Nest.js Applications

After installing all dependencies, we now have to create the following files to bootstrap a Nest.js application:

1. A file that contains the definition of the root module of our application.
2. A file to create a Nest.js instance with our root module.
3. A file to load `ts-node` to run our source code without transpiling it.
4. A file to configure TypeScript to our needs.

Note that the third file will be used only during development. On other environments, like [staging](https://en.wikipedia.org/wiki/Deployment_environment#Staging) or production, we would run a pre-transpiled version of our app.

Before creating these files, let's create a directory to hold our source code:

```bash
# creating src folder
mkdir -p src
```

We will define our root module by creating a file called `app.module.ts` in the `src` directory and by adding the following code to it:

```typescript
import {Module} from '@nestjs/common';

@Module({
    modules: [],
    controllers: []
})
export class ApplicationModule { }
```

To start the Nest.js application with this module we will create a file called `server.ts` in the `src` directory with the following code:

```typescript
import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(ApplicationModule);
    await app.listen(3000);
}
bootstrap();
```

Then we will create the file that will load `ts-node` and execute our application. We will call this file `index.js` and add it to the root directory of our project with the following code:

```javascript
require('ts-node/register');
require('./src/server');
```

Lastly, we will indicate that our project is a TypeScript project by creating a file called `tsconfig.json` in the root directory with the following code:

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": false,
    "noImplicitAny": false,
    "removeComments": true,
    "noLib": false,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "target": "es6",
    "sourceMap": true,
    "allowJs": true,
    "outDir": "./dist"
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "**/*.spec.ts"
  ]
}
```

Note that the most important properties in this configuration for a Nest.js application is the presence of
`emitDecoratorMetadata` and `experimentalDecorators`. We need to activate decorators on any Nest.js application since the framework heavily uses this TypeScript feature to define controllers, modules, components, etc.

Having these four files in place, we can now start our application by running the following command:

```bash
node index
```

## Creating Nest Controllers

Even though our application is up and running, we can't do much with it now as there are no controllers to accept requests. Therefore, let's create our first Nest.js controller. We will define this controller in a new file called `companies.controller.ts` that we are going to create in the `src` directory with the following code:

```typescript
import {Controller, Get} from '@nestjs/common';

@Controller('companies')
export class CompaniesController {

    @Get()
    getCompanies() {
        return ["Coke", "Apple", "Tesla"]
    }
}
```

This controller is as simple as it gets. For now, we defined a single endpoint that responds with a list of companies when users send HTTP requests to the `/companies` path. To make this controller available, we need to add it in the `controllers` property of the `@Module` decorator of our root module (`./src/app.module.ts`):

```typescript
import {Module} from '@nestjs/common';
import {CompaniesController} from './companies.controller';

@Module({
    modules: [],
    controllers: [CompaniesController]
})
export class ApplicationModule { }
```

If we run our application again, we will be able to get the list of companies as shown here:

```bash
# starting the application
node index

# getting the list of companies
curl localhost:3000/companies

# ["Coke","Apple","Tesla"]
```

## Validating Data on Nest

## Final Thoughts

WebSockets, Automated Tests, i18n, Database Integration

Conclusion
