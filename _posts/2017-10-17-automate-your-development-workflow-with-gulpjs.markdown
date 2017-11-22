---
layout: post
title: "Automate Your Development Workflow With GulpJS"
description: Learn how to use GulpJS to automate time-consuming tasks in your development workflow.
date: 2017-10-17 8:30
category: Technical Guide, JavaScript, GulpJS
author:
  name: Prosper Otemuyiwa
  url: https://twitter.com/unicodeveloper?lang=en
  avatar: https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200
  mail: prosper.otemuyiwa@auth0.com
design:
  bg_color: "#5F2021"
  image: https://cdn.auth0.com/blog/gulpjs/logo.png
tags:
- gulp
- gulp.js
- gulpjs
- javascript
- task-runner
- automation
related:
- 2017-09-20-rxjs-advanced-tutorial-with-angular-web-speech-part-1
- 2017-10-05-nestjs-brings-typescript-to-nodejs-and-express
- 2017-02-10-glossary-of-modern-javascript-concepts
---

---

**TL;DR:** In this tutorial, I'll introduce you to GulpJS and show you how to set it up in your application for task automation.

---

**[GulpJS](https://gulpjs.com)** is a JavaScript task runner that lets you automate several tasks during development. These tasks involve minifying JavaScript and CSS files, automatically refreshing the browser once a file has been edited, compiling CSS preprocessors, running tests, compressing images, and several others. GulpJS solves the problem of repetition.

{% include tweet_quote.html quote_text="GulpJS solves the problem of repetition." %}

**GulpJS** is a build tool that helps you as a developer get rid of manually running such tasks as mentioned above during development for every project. Once you set up GulpJS, it automates the most frustrating tasks, supercharges your performance, and lets you focus on building your app logic.

## GulpJS Requirements

In order to use GulpJS, you need to have the following tools installed on your machine.

* **Node.js**: Navigate to the [Node.js website](https://nodejs.org/en/download/) and install the latest version on your machine.
* **GulpJS**: Install Gulp globally in your terminal so that the `gulp` command can be run from any directory.

```bash
npm install gulp-cli -g
```

## GulpJS Features

GulpJS provides a standardized API. The API methods allow you accomplish whatever work you want done with Gulp. See below a quick run down of the API methods:

* `gulp.task` - Define a task.

    ```js
    gulp.task('dosometask', () => {
      // Do some task
    });
    ```
* `gulp.src` - Read a file or set of files in.

    ```js
      gulp.src('client/templates/*.jade')
      .pipe(jade())
      .pipe(minify())
      .pipe(gulp.dest('build/minified_templates'));
    ```

* `gulp.dest` - Write files out to a directory.

    ```js
    gulp.src('./client/templates/*.jade')
    .pipe(jade())
    .pipe(gulp.dest('./build/templates'))
    .pipe(minify())
    .pipe(gulp.dest('./build/minified_templates'));
    ```

    ```js
    gulp.src('client/js/**/*.js') // Matches 'client/js/somedir/somefile.js' and resolves `base` to `client/js/`
    .pipe(minify())
    .pipe(gulp.dest('build'));  // Writes 'build/somedir/somefile.js'

    gulp.src('client/js/**/*.js', { base: 'client' })
      .pipe(minify())
      .pipe(gulp.dest('build'));  // Writes 'build/js/somedir/somefile.js'
    ```

* `gulp.watch` - Watch files and do something when a file changes.

    ```js
    gulp.watch('js/**/*.js', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
    ```

Next, let's look at how we can actually use GulpJS in an application. We need to create a gulpfile.

## Setting Up GulpFile in an Application

In a typical project, GulpJS needs some form of instructions to guide it in automating your tasks. These instructions are written in a file called the `gulpfile`. Let's go ahead and create this file.

Make sure you are in a new project directory. Inside the directory, create a `gulpfile.js` file.

In the `gulpfile.js` file, add this code to it like so:

```js
var gulp = require('gulp');

gulp.task('run-this-common-task', function(){
    console.log('This is a simple task. Now, run it');
});
```

We just added a very simple task to the gulpfile. You need to always require the `gulp` node module before you can define and run tasks.

Before running the task, go ahead and install gulp locally in your project like so:

```bash
npm install --save-dev gulp
```

Now, run your task with gulp:

```bash
gulp run-this-common-task
```

![GulpJS - Run common task](https://cdn.auth0.com/blog/gulp/run-common-task.png)
_GulpJS: Run common task_

The task had just one job - Log a sentence to the console. And it successfully executed this task.

Let's take a stab at something that gives us a better overview of the different kind of operations gulp can handle in your application.

## GulpJS Use Case: Project Lingo

This is a practical use case. We are going to paint a scenario of the tasks we need to accomplish in _Project Lingo_. Before we define such tasks, what the heck is _Project Lingo_?

**Lingo** is a project that we have embarked upon in Company TechnoVille. _Project Lingo_ is set to take over the world in ways you can't imagine. One of such ways is allowing a mere human click a button, input a destination and Lingo automatically teleports the human to their preferred destination in approximately 5 minutes.

In _Project Lingo_, we have a bunch of JavaScript, Less and Image files. We need to compress and optimize these files so that Lingo can be super-fast. I mean, you don't want Lingo taking 3 hours to teleport a human because of our in-efficient developer work-flow. We also don't want investors running way & Project Lingo dying when we could have done something about it.

This is what we need to do:

* Concatenate all our JavaScript files into just one file. This will make sure our app makes one HTTP request while serving JavaScript rather than multiple HTTP requests.
* Compile our Less files into CSS. The browser understands CSS, not LESS.
* Compress all our image files.
* Detect errors and potential problems in our JavaScript code. We need to make sure Lingo developers are writing quality JavaScript code.

We have these requirements listed above. How do we approach tackling these tasks with GulpJS?

## Project Lingo - Install GulpJS Plugins

Yes, GulpJS has an amazing [ecosystem of plugins](https://gulpjs.com/plugins). For every task a developer tries to accomplish, there is probably a GulpJS plugin out there for automating such task. Go ahead and install the following plugins via your terminal:

```bash
npm install gulp-imagemin gulp-less gulp-jshint gulp-concat gulp-uglify gulp-rename --save-dev
```

{% include tweet_quote.html quote_text="GulpJS has an amazing ecosystem of plugins." %}

A quick breakdown of what each of these plugins aim to accomplish.

* **[gulp-imagemin](https://www.npmjs.com/package/gulp-imagemin)** - Minify PNG, JPEG, GIF and SVG images.
* **[gulp-less](https://www.npmjs.com/package/gulp-less)** - Compile Less files to CSS.
* **[gulp-jshint](https://www.npmjs.com/package/gulp-jshint)** - Automatically detect errors and problems in our JavaScript code. Lint it!
* **[gulp-uglify](https://www.npmjs.com/package/gulp-uglify)** - Minify JavaScript files.
* **[gulp-rename](https://www.npmjs.com/package/gulp-rename)** - Rename a file.
* **[gulp-concat](https://www.npmjs.com/package/gulp-concat)** - Concatenate all the JavaScript files into one file.

## Project Lingo - Rewrite GulpFile

Open up the `gulpfile.js` file and modify it to this code below:

```js
const gulp = require('gulp');

const imagemin = require('gulp-imagemin');
const jshint = require('gulp-jshint');
const concat = require('gulp-concat');
const less = require('gulp-less');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

// Lint Task
gulp.task('lint', () => {
    return gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Project Lingo Less files
gulp.task('less', () => {
    return gulp.src('less/*.less')
        .pipe(less())
        .pipe(gulp.dest('dist/css'));
});

// Concatenate & Minify Project Lingo JS files
gulp.task('scripts', () => {
    return gulp.src('js/*.js')
        .pipe(concat('build.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('build.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

// Compress all Project Lingo image files
gulp.task('compress-images', () => {
     gulp.src('images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
});

// Watch Files For Changes
gulp.task('watch', () => {

    // JavaScript changes
    gulp.watch('js/*.js', ['lint', 'scripts']);

    // Less changes
    gulp.watch('less/*.less', ['less']);

    // Image changes
    gulp.watch('images/*', ['compress-images']);
});

// Run Project Lingo Task
gulp.task('lingo', ['less', 'scripts', 'compress-images', 'watch']);
```

In the code above, we have six tasks. Let's examine what each of these tasks do.

* **lint task** - This task checks all the JavaScript files in our `js` directory and runs them through `jshint`. Jshint ensures that the JavaScript code is well-written and rid of errors. If there are any errors, it reports them to the console.

    ```js
    gulp.task('lint', () => {
    return gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
    });
    ```
* **less task** - This task checks all the Less files in our `less` directory, compiles them to CSS and copies them to a `dist/css` directory. If you use sass more often, there is a [gulp-sass](https://www.npmjs.com/package/gulp-sass) plugin available to compile your sass files to CSS.

    ```js
    gulp.task('less', () => {
        return gulp.src('less/*.less')
            .pipe(less())
            .pipe(gulp.dest('dist/css'));
    });
    ```
* **scripts task** - This task checks all the JavaScript files in our `js` directory, concatenates them into a single file, `build.js`, copies the file into a `dist/js` directory, renames the file to `build.min.js` and uglifies it.

    ```js
    gulp.task('scripts', () => {
        return gulp.src('js/*.js')
            .pipe(concat('build.js'))
            .pipe(gulp.dest('dist'))
            .pipe(rename('build.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest('dist/js'));
    });
    ```
* **compress-images task** - This task checks all the files in our `images` directory, compresses them and copies them to a `dist/images` directory.

    ```js
    gulp.task('compress-images', () => {
         gulp.src('images/*')
            .pipe(imagemin())
            .pipe(gulp.dest('dist/images'))
    });
    ```
* **watch task** - This task listen for changes made in our files and automatically run all our tasks again.

    ```js
    gulp.task('watch', () => {

        // JavaScript changes
        gulp.watch('js/*.js', ['lint', 'scripts']);

        // Less changes
        gulp.watch('less/*.less', ['less']);

        // Image changes
        gulp.watch('images/*, ['compress-images']);
    });
    ```
* **lingo task** - This task is the father of all tasks. At the terminal, all we need to do is run `gulp lingo` and all the tasks defined in our gulfile will run in one command!

    ```js
    gulp.task('lingo', ['less', 'scripts', 'compress-images', 'watch']);
    ```

So, head over to the terminal, and try `gulp lingo` and watch all the tasks run. It's that simple.

**Note:** Ensure you have a `js`, `less` and `images` folder with multiple JavaScript, Less and image files respectively.

## Gulp Plugins

As demonstrated in _Project Lingo_, we took advantage of the Gulp Plugins ecosystem. Gulp Plugins are building blocks for your gulpfile.

There are several plugins available at [https://gulpjs.com/plugins](https://gulpjs.com/plugins/). Head over there, search for any plugin that might suit your use case and take advantage of it.

Check out other popular plugins that you might immediately find useful.

* **gulp-util** - Contains all sorts of utility functions such as color-coding and logging.
* **gulp-nodemon** - Automatically restarts your Node.js server using `nodemon`.
* **gulp-strip-debug** - Removes all `console` and `debugging` statements.
* **gulp-htmlclean** - Minify HTML code.

## Gulp Recipes

There are some tasks that you might want to implement, but not necessarily know the right way to go about it. Apart from the Gulp Plugins that exist, there are recipes that you can take advantage of. Some of the recipes you can use directly in your project include:

* [Running tasks in series](https://github.com/gulpjs/gulp/blob/master/docs/recipes/running-tasks-in-series.md)
* [Browserify builds with Watchify](https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md)
* [Templating with Swig and YAML front-matter](https://github.com/gulpjs/gulp/blob/master/docs/recipes/templating-with-swig-and-yaml-front-matter.md)
* [Deleting files and folders before running builds](https://github.com/gulpjs/gulp/blob/master/docs/recipes/delete-files-folder.md)
* [Run Grunt Tasks from Gulp](https://github.com/gulpjs/gulp/blob/master/docs/recipes/run-grunt-tasks-from-gulp.md)

Check out a great list of [Gulp Recipes](https://github.com/gulpjs/gulp/tree/master/docs/recipes).

{% include asides/javascript-at-auth0.markdown %}

## Conclusion

You have now learned how to automate your development workflow with GulpJS. This GulpJS tutorial simply covers how Gulp - the task runner and automation tool works and how it can automate common tasks in your application. I am rest assured _Project Lingo_ is now highly performant. All thanks to the optimization techniques we deployed using GulpJS.

There are other tasks runners and automation tools you should check out. Examples are [Grunt](https://gruntjs.com), [Broccoli](https://github.com/broccolijs/broccoli), [Brunch](https://brunch.io) and [Webpack](https://github.com/webpack/webpack). As at the time of this writing, Webpack is the most popular build tool/task runner amongst web developers.

Do you still use GulpJS? Are you now in the league of Webpackers? Are there specific reasons you would choose one over the other? Please let me know in the comment section. 😊
