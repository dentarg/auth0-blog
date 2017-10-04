---
layout: post
title: "TypeScript Practical Introduction"
description: "Let's learn TypeScript features through practical examples."
date: 2017-10-07 08:00
category: Technical Guide, TypeScript
author:
  name: "Bruno Krebs"
  url: "https://twitter.com/brunoskrebs"
  mail: "bruno.krebs@auth0.com"
  avatar: "https://www.gravatar.com/avatar/76ea40cbf67675babe924eecf167b9b8?s=60"
design:
  bg_color: "#007acb"
  image: "https://d1xwtr0qwr70yv.cloudfront.net/assets/tech/typescript-54e94491fc5706284262529e85755946.svg"
tags:
- typescript
- javascript
- ecmascript
- node
- nodejs
- types
- definetely-typed
- definitelytyped
related:
- 2017-09-27-nextjs-3-release-what-is-new
- 2017-09-20-rxjs-advanced-tutorial-with-angular-web-speech-part-1
---

**TL;DR:** In this article we are going to learn the basic features of TypeScript through practical examples. We are going to start with a small introduction to TypeScript, then we are going to create a TypeScript project and use its features to learn the language in practice.

## What is TypeScript

[TypeScript](https://www.typescriptlang.org/) is a programming language, built by [Microsoft](https://www.microsoft.com), that extends JavaScript. The language has been built as an open source, [licensed under the Apache License 2.0](https://github.com/Microsoft/TypeScript/blob/master/LICENSE.txt), so the developer community can use it freely. Among its features, a remarkable one is that TypeScript brings [type safety](https://en.wikipedia.org/wiki/Type_system#Type_checking) to one of the most flexible, dynamic programming languages around: JavaScript. This characteristic enables developers to be very productive even on large codebases by introducing and facilitating tools and practices like static checking and code refactoring.

Besides enabling developers to check the correctness of their code before running it, TypeScript also brings to the table the state of the art JavaScript. That is, with TypeScript we can take advantage of the latests features of JavaScript, like those introduced on ECMAScript 2015, and features that are still under consideration (e.g. decorators). As the developers of TypeScript knew that applications written in the language would face a wide variety of environments (JavaScript engines), they made it easy to compile and [transpile](https://en.wikipedia.org/wiki/Source-to-source_compiler) TypeScript to the most different targets, like ECMAScript 3 and above.

### Advantages and Disadvantages

## Installing TypeScript

To compile and transpile TypeScript into JavaScript, we need to install the command-line compiler. As this compiler is in fact a Node.js program, we first need to [install Node.js and NPM](https://nodejs.org/en/download/current/) to, after that, install the compiler as a Node.js package:

```bash
# installing TypeScript compiler
npm install -g typescript
```

This will make the `tsc` (TypeScript Compiler) command available globally on our machine. To test the installation, let's create a simple TypeScript file called `index.ts` with the following code:

```typescript
console.log(1);
```

And then let's use the compiler to transform it to JavaScript:

```bash
# compiling index.ts
tsc index
```

This will generate a new file called `index.js` with the exact same code of the TypeScript file. To execute this new file, let's use Node.js:

```bash
# this will output 1
node index
```

Although the compiler did nothing else besides creating a JavaScript file and copying the original code to it, these steps helped us to validate that our TypeScript installation is on a good shape and ready to handle the next steps.

## Creating a TypeScript Project

To create a TypeScript project, everything that we need is a `tsconfig.json` file. The presence of this file in a directory denotes that this directory is the root of a TypeScript project. This file, among other things, instructs the compiler on which files to compile, which files to ignore, and what environment to target (e.g. ECMAScript 3).

To create our first TypeScript project, let's create a new directory and add the TypeScript configuration file to it:

```bash
# create the root directory of our TypeScript project
mkdir project-manager-ts

# move the working directory to it
cd project-manager-ts

# create an empty tsconfig.json file
touch tsconfig.json
```

### TypeScript Configuration

As TypeScript can aim different environments (like ECMAScript 3 and ECMAScript 2015) and can be configured to validate different things (like [implicit any](https://basarat.gitbooks.io/typescript/docs/options/noImplicitAny.html)), we use the `tsconfig.json` file to adjust the compiler to our needs. In our practical introduction to TypeScript, we will create a small program that runs on our terminal, through Node.js, to help us manage projects and its tasks.

Node.js is based on [Chrome V8](https://developers.google.com/v8/), one of the most up-to-date JavaScript engines available. The version 6 of Node.js ships with a Chrome V8 version capable of supporting 95% of the ECMAScript 2015 specification, [as shown by Node Green](http://node.green/), while the version 8 is capable of supporting 99%. In respect of ECMAScript 2017, both versions support 23% and 73% of the specification, respectively. Therefore, the best choice is to configure our project to be compiled to ECMAScript 2015, which will enable users with Node.js 6 and 8 to run our program without trouble.

Besides configuring the compiler to target ECMAScript 2015, we will also configure other three characteristics:

- `module`, to instruct TypeScript to use the [CommonJS module format](http://requirejs.org/docs/commonjs.html).
- `removeComments`, to avoid adding comments in the generated JavaScript files.
- `sourceMap`, to help us debugging the code generated.

We will also tell the compiler to process files under `./src`, a directory that we will create to add our TypeScript source code, and nothing else. To perform these configurations, let's open the `tsconfig.json` file and add the following content to it:

```typescript
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es2015",
    "removeComments": true,
    "sourceMap": true
  },
  "include": ["src/**/*"]
}
```

### Compiler Options

The options used in the configuration file so far are just a small subset of what TypeScript supports. For example,

The official website contains a [list of all options available on TypeScript](https://www.typescriptlang.org/docs/handbook/compiler-options.html) with their description.

## TypeScript Features

### Functions and Variables

### Classes

### Interfaces

### Decorators

### Iterators and Generators

### Modules

### Namespaces

## TypeScript Types Definition

### DefinitelyTyped

## Aside: Securing TypeScript with Auth0

## Conclusion

Although bringing type safety to JavaScript, TypeScript does it without being intrusive. That is, it helps us static checking variable types when we want, but don't force us to.
