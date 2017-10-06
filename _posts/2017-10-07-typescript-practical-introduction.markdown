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

The options used in the configuration file above are just a small subset of what TypeScript supports. For example, we could instruct the compiler to handle decorators, to support `jsx` files, or even to transpile pure JavaScript files. The official website contains a [list of all options available on TypeScript](https://www.typescriptlang.org/docs/handbook/compiler-options.html), but below there is the explanation of a few commonly used options:

- `allowJs`: this option makes TypeScript compiler process JavaScript as well. For example, if we create a JavaScript file that uses generator (ECMAScript 2015 feature), and use TypeScript to compile JavaScript targeting ECMAScript 5, the compiler would replace the generator function with JavaScript code capable of running on the target.
- `noImplicitAny`: this options makes the compiler to complain whenever it finds a variable declaration that can accept any type, but that [doesn't explicitly defines it](https://basarat.gitbooks.io/typescript/docs/options/noImplicitAny.html).
- `experimentalDecorators`: this option enables decorators on a TypeScript project. By default, [decorators](https://tc39.github.io/proposal-decorators/) are disabled since they are not part of any official JavaScript version yet.
- `emitDecoratorMetadata`: this option, alongside with the presence of the `reflect-metadata` package, [preserves type information in object's metadata](http://blog.wolksoftware.com/decorators-metadata-reflection-in-typescript-from-novice-to-expert-part-4).
- `watch`: this option makes TypeScript compiler run indefinitely. With it, whenever a source file is changed, the compiling process is triggered automatically to generate the new version.

## TypeScript Features

Now that we understand how to bootstrap a TypeScript project and configure the compiler, let's start learning about the features provided by TypeScript. Although the features that we are going to cover here (and a few more) are throughly explained in the [TypeScript handbook](https://www.typescriptlang.org/docs/handbook/basic-types.html), this article will focus on a more practical approach. We will learn the basic concepts of the most important features and put them to work together.

### Functions and Variables

### TypeScript Classes

In TypeScript, classes are very similar to what other object-oriented programming languages provide. That is, a class is the contract definition of what is supported by the instances of this class (objects). Besides that, a class can also inherit functionality from other classes and even from interfaces (more on that in the next section). One feature that distinguishes classes in TypeScript from most of the other languages, is that classes support only a single constructor. Although this might sound limiting, we will see that by supporting optional parameters, TypeScript mitigates this limitation.

To better understand these concepts, let's start creating our project management program by defining the four classes shown in the following diagram.

![Class diagram of the project management program that will be created with TypeScript](https://cdn.auth0.com/blog/typescript-intro/class-diagram.jpg)

#### Defining the Entity Class

The first class that we will create is `Entity`. This is an abstract class that defines common characteristics that will be inherited by the other classes. To define this class, let's create a file called `entity.ts` in the `./src` directory with the following code:

```typescript
export class Entity {
  private _id: number;
  private _title: string;
  private _creationDate: Date;

  constructor(id: number, title: string) {
    this._id = id;
    this._title = title;
    this._creationDate = new Date();
  }

  get id(): number {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  set title(title: string) {
    this._title = title;
  }

  get creationDate(): Date {
    return this._creationDate;
  }
}
```

We start the definition of this class by using the `export` keyword. Exporting the class is essential so we can import it in other files, as we will see in the definition of the other classes. After that, we define three properties: `_id`, `_title`, and `_creationDate`. Starting properties with underscore is important to differentiate them from their accessors (getters and setters). With the properties properly defined, we add the constructor of the class. This constructor accepts two parameters: a number to use it as the `_id` of the project; and a string to set in the `_title` property. The constructor also automatically defines the `_creationDate` to the current date. The last thing we do in this class definition is to add the getters and setters of the properties.

#### Defining the Task Class

Next, we will create `Task`, a concrete class that represents a task that needs to be executed. Users will be able to order tasks by priority, flag them as completed, and set a title to tasks (which will be inherited from `Entity`). To define this class, let's create a file called `task.ts` in the `./src` directory with the following code:

```typescript
import {Entity} from "./entity";

export class Task extends Entity {
  private _completed: boolean;
  private _priority: number;

  get completed(): boolean {
    return this._completed;
  }

  set completed(value: boolean) {
    this._completed = value;
  }

  get priority(): number {
    return this._priority;
  }

  set priority(value: number) {
    this._priority = value;
  }
}
```

As this class will inherit characteristics from `Entity`, we start this file by adding the `import` statement to bring the definition of `Entity`. After that we define the `Task` class and make it extend `Entity`. Besides that, there is nothing too special about this class. It contains only two properties (`_completed` and `_priority`) with its accessors. Note that we don't define a constructor on `Task` because we will use the one inherited from `Entity`.

#### Defining the Story Class

The third class that we will create will be `Story`, a concrete class that represents a user story. A story can be subdivided into multiple tasks to facilitate its execution, but only one person is responsible for a story and its tasks. Besides that, a story contains a title (inherited from `Entity`) and a flag that identifies if the story has been completed or not. To define the `Story` class, let's create a file called `story.ts` in the `./src` directory with the following code:

```typescript
import {Entity} from "./entity";
import {Task} from "./task";

export class Story extends Entity {
  private _completed: boolean;
  private _responsible: string;
  private _tasks: Array<Task> = [];

  get completed(): boolean {
    return this._completed;
  }

  set completed(value: boolean) {
    this._completed = value;
  }

  get responsible(): string {
    return this._responsible;
  }

  set responsible(value: string) {
    this._responsible = value;
  }

  public addTask(task: Task) {
    this._tasks.push(task);
  }

  get tasks(): Array<Task> {
    return this._tasks;
  }

  public removeTask(task: Task): void {
    let taskPosition = this._tasks.indexOf(task);
    this._tasks.splice(taskPosition, 1);
  }
}
```

Just like `Task`, we start `Story` by making it extend `Entity` to inherit its characteristics. After that we define three properties:

- `_completed`: a flag that identifies if the `Story` has been completed or not.
- `_responsible`: a string that defines who is in charge of executing the story and its tasks.
- `_tasks`: an array that contains zero or more instances of `Task` to be executed by the person responsible.

For the first two properties, `_completed` and `_responsible`, we define both accessors to enable their manipulation. For the `_tasks` property we add three methods. The first one, `addTask`, accepts an instance of `Task` to add to the array. The second one is the accessor to get all instances of `Task`. The third one, `removeTask`, receives a task to remove it from the array of tasks.

#### Defining the Project Class

The fourth and final class that we will create will be the `Project` class. A project contains zero or more stories, can be released when finished, and can have a title (inherited from `Entity`). To define this class, let's create a file called `project.ts` in the `./src` directory and add the following code:

```typescript
import {Entity} from "./entity";
import {Story} from "./story";

export class Project extends Entity {
  private _released: boolean;
  private _stories: Array<Story>;

  get released(): boolean {
    return this._released;
  }

  set released(value: boolean) {
    this._released = value;
  }

  public addStory(story: Story) {
    this._stories.push(story);
  }

  get stories(): Array<Story> {
    return this._stories;
  }

  public removeStory(story: Story) {
    let storyPosition = this._stories.indexOf(story);
    this._stories.splice(storyPosition, 1);
  }
}
```

We start the definition of `Project` by importing `Entity` to inherit its characteristics. After that we define two properties: `_released` and `_stories`. The functionality provided by `Project` is quite similar to `Story`. The difference is that instead of dealing with an array of tasks, a `Project` deals with an array of `Stories`. These stories are manipulated through three methods: `addStory`, `stories`, and `removeStory`. The resemblance between these three methods and the ones defined on `Story` to deal of `Tasks` is big, and therefore do not require explanation.

### TypeScript Interfaces

Interfaces, on TypeScript, enable developers to perform type checking during compile time. That is, using an interface makes the TypeScript compiler check if the variable in question fills the contract (have the structure) defined by the interface. As occurs on other programming languages, interfaces do not require an object to have exactly the same structure as defined by the interface. To be considered valid, objects can have any shape, as long as they define the functions and properties required by the interface.

For example, let's say that we want to trigger an email whenever a `Task` or a `Story` is marked as completed. Instead of creating two different functions to deal with each type in separately we can define an interface called `Completable` as follows:

```typescript
export interface Completable {
  title: string;
  completed: boolean;
  completedAt?: Date;
}
```

Then we can use this interface as the type of the parameter accepted by the function that triggers the email:

```typescript
import {Completable} from "./completable";

export function sendCompletionEmail(completable: Completable) {
  if (!completable.completed) {
    // ignore uncompleted entities
    console.error(`Please, complete ${completable.title} before sending email.`);
    return;
  }
  console.log(`Sending email about ${completable.title}`);
  // ...
}
```

Note that TypeScript does not force us to explicitly implement the `Completable` interface. The compiler, when run, simply checks the structure of the object being passed to see if it fits what the interface requires. Although TypeScript is flexible on that matter, it's a good practice to explicitly implement the interface. The code snippet below shows how we make `Task` implement `Completable`.

```typescript
import {Entity} from "./entity";
import {Completable} from "./completable";

export class Task extends Entity implements Completable {
  // ... nothing else changes here
}
```

An avid reader will notice that the `Completable` interface defined contains two properties that are not part of `Task` and `Story`. The first one, `title`, which is required by the interface is available because both classes inherit a property with the same name and shape from `Entity`. The second one, `completedAt`, is a property that is not defined on any class. TypeScript, when compiling our code, does not complain about this because the property is marked as optional through the question mark sign added after the property name.

### Decorators

### Iterators and Generators

### Modules

### Namespaces

## TypeScript Types Definition

### DefinitelyTyped

## Aside: Securing TypeScript with Auth0

## Conclusion

Although bringing type safety to JavaScript, TypeScript does it without being intrusive. That is, it helps us static checking variable types when we want, but don't force us to.
