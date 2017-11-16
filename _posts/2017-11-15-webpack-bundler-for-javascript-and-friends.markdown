---
layout: post
title: "Webpack: A Gentle Introduction to the Module Bundler for JavaScript and Friends"
description: Learn the nitty-gritty of Webpack and how to configure it as a build system in your applications.
date: 2017-11-15 8:30
category: Technical Guide, JavaScript, Webpack
author:
  name: Prosper Otemuyiwa
  url: https://twitter.com/unicodeveloper?lang=en
  avatar: https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200
  mail: prosper.otemuyiwa@auth0.com
design:
  bg_color: "#5F2021"
  image: https://cdn.auth0.com/blog/gulpjs/logo.png
tags:
- webpack
- bundler
- transpiler
- build
- javascript
- task-runner
- automation
related:
- 2017-09-20-rxjs-advanced-tutorial-with-angular-web-speech-part-1
- 2017-10-17-automate-your-development-workflow-with-gulpjs
- 2017-02-10-glossary-of-modern-javascript-concepts
---

---

**TL;DR:** In this tutorial, I'll introduce you to Webpack and show you how to set up a build system with it in your application.

---

**[Webpack](https://webpack.js.org)** is an aggressive and powerful module bundler for JavaScript applications. It packages all the modules in your application into one or more bundles _(often, just one)_ and serves it to the browser. However, Webpack is more than just a module bundler. With the help of loaders and plugins, it can transform, minify and optimize all types of files before serving them as one bundle to the browser. It takes in various assets, such as JavaScript, CSS, Fonts, Images and HTML, and then transforms these assets into a format that’s convenient to consume through a browser. The true power of Webpack is the sum of its parts.

{% include tweet_quote.html quote_text="The true power of Webpack is the sum of its parts." %}

**Webpack** is a JavaScript library, built and maintained by [Tobias Koppers and the team](https://twitter.com/wsokra). It is very well adopted and backed by the developer community. Virtually every JavaScript framework and project uses Webpack.

![Webpack - Backers](https://cdn.auth0.com/blog/webpack/backers.png)
_Webpack - Backers_

![Webpack - Sponsors](https://cdn.auth0.com/blog/webpack/sponsors.png)
_Webpack - Sponsors_

Currently, many web platforms use Webpack during development. Such platforms include Auth0, Netflix, Instagram, Airbnb, KhanAcademy, Trivago and more. The [documentation](https://webpack.js.org/concepts/) is very detailed, and there is a vibrant community of users. Webpack currently exists in two GitHub Organizations, [Webpack](https://github.com/webpack) and [Webpack-contrib](https://github.com/webpack-contrib). The _Webpack_ org consists of projects such as [webpack](https://github.com/webpack/webpack), [webpack-cli](https://github.com/webpack/webpack-cli), [tapable](https://github.com/webpack/tapable), while the _Webpack-contrib_ org consists of mostly plugins and loaders.


## Webpack - The Core Concepts

Webpack is popularly addressed as a beast in the JavaScript community. A lot of developers know how to use Webpack but are constantly confused as to how it actually works under the hood. Is it magic? Is Sean Larkin a sourcerer? What about Tobias? Is he a first-generation spell-caster? Well, I'll address this quite simply. I ask that you just grab your cup of coffee and follow along.

Webpack builds a dependency graph when it processes your application. It starts from a list of modules defined in its config file (`webpack.config.js`) and recursively builds a dependency graph that includes every module your application needs, then packages all of those modules into a small number of bundles to be loaded by the browser.

There are four core concepts you need to grasp to understand how Webpack functions:

* Entry
* Output
* Loaders
* Plugins

### Entry

Every Webpack setup has one or more _entry points._ The entry point tells Webpack where to start building its dependency graph from. Webpack starts processing the module at the entry point and roams around the application source code to look for other modules that depends on the entry module. Every direct or indirect dependency is captured, processes and outputted into a bundle(s).

_webpack.config.js_

```js
const config = {
  entry: './app/prosper.js'
};

module.exports = config;

```

_webpack.config.js - separate entries_

```js
const config = {
  entry: {
    app: './src/app.js',
    vendors: './src/vendors.js'
  }
};

module.exports = config;
```

> **Note:** Just simply re-iterating. Multiple entry points can be specified in a Webpack config file.

### Output

Only one output point can be specified in a Webpack setup. The _output_ config property tells Webpack where to place the bundle(s) it creates and how to name them. It is as simple as specifying the `output` property in the config file like so:

```js
const config = {
    entry: './app/prosper.js',
    output: {
        path: /unicodeveloper/project/public/dist,
        filename: 'app.bundle.js'
    }
};

module.exports = config;
```

`output.filename` - The name of the _bundle_ webpack produces.
`output.path` - The directory to write `app.bundle.js` to.

### Loaders

Loaders are like transformers. With loaders, Webpack can process any type of file, not just JavaScript files. Loaders transform these files into modules that can be included in the app's dependency graph and bundle. Check out the example below:

```js
const config = {
  entry: './app/prosper.js',
  output: {
    path: '/unicodeveloper/project/public/dist',
    filename: 'app.bundle.js'
  },
  module: {
    rules: [
      { test: /\.(html)$/, use: 'html-loader' }
    ]
  }
};

module.exports = config;
```

In the code above, the `html-loader` processes HTML files and exports as strings. There are several loaders such as [css-loader](https://github.com/webpack-contrib/css-loader), [less-loader](https://github.com/webpack-contrib/less-loader), [coffee-loader](https://github.com/webpack-contrib/coffee-loader) and many more.

### Plugins

Earlier in the post, I mentioned that loaders are like transformers. Plugins are _super-man-like_ in their operations. They can do a lot more tasks than loaders. In fact, just any thing ranging from deleting files, to backing up files on services like [Cloudinary](https://cloudinary.com), to copying files, etc. Check out the example below:

```js
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const config = {
  entry: './app/prosper.js',
  output: {
    path: '/unicodeveloper/project/public/dist',
    filename: 'app.bundle.js'
  },
  module: {
    rules: [
      { test: /\.(html)$/, use: 'html-loader' }
    ]
  },
  plugins: [
    new CompressionWebpackPlugin({test: /\.js/})
  ]
};

module.exports = config;
```

In the code above, the `compression-webpack-plugin` compresses all the JavaScript files before serving them to the browser. There are several [plugins](https://webpack.js.org/plugins) such as [AggressiveSplittingPlugin](https://webpack.js.org/plugins/aggressive-splitting-plugin/), [CommonsChunkPlugin](https://webpack.js.org/plugins/commons-chunk-plugin/), [18nWebpackPlugin](https://webpack.js.org/plugins/i18n-webpack-plugin/) and many more.

## Webpack Requirements

In order to use Webpack, you need to have the following tools installed on your machine.

* **Node.js**: Navigate to the [Node.js website](https://nodejs.org/en/download/) and install the latest version on your machine. Verify that `npm` works by running `npm` in your terminal.
* **Webpack**: Install Webpack globally in your terminal so that the `webpack` command can be run from any directory.

```bash
npm install webpack -g
```

> **Note:** It's optional to install webpack globally and not recommended because it locks your all projects to a specific version of Webpack. You can as well just add it a dev-dependency while working on your project.


## Setting Up Webpack in an Application

Create a new project directory. Head over to the terminal and run `npm init` to create a `package.json` file inside the directory.

Next, go ahead and add `webpack` as a dependency to the project.

```bash
npm install webpack -D
```

![Webpack - Dev Dependency](https://cdn.auth0.com/blog/webpack/devdependency.png)
_package.json_

Create a `js` folder inside the directory with two files, `service.js` and `factory.js`.

_js/factory.js_

```js
import './service.js';
```

_js/service.js_

```js
console.log("This is a functioning service.");
```

Create a `webpack.config.js` file in the root directory and add the following code to it like so:

```js
const path = require('path');

module.exports = {
  entry: './js/factory.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
};
```

In the code above, we have an entry point, `factory.js`. This config file tells Webpack to start processing the dependency graph from this file, which is dependent on `service.js`. And outputs the result of its operation to `bundle.js` which is written to a new `dist` directory.

Create an `index.html` file in the root directory.

% highlight html %}
{% raw %}
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Test Webpack</title>
    </head>
    <script type="text/javascript" src="dist/bundle.js"></script>
    <body>
      <h2> Testing Webpack.... </h2>
    </body>
    </html>
{% endraw %}
{% endhighlight %}

One last step. Head over to `package.json`. Add `webpack` to the `scripts` section like so:

_package.json_

```js
{
  "name": "testwebpack",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "webpack": "^3.8.1"
  }
}
```

With this action, we can just run `npm run build` from the terminal. The command will invoke webpack. Go ahead and try it out.

```bash
npm run build
```

![Webpack build](https://cdn.auth0.com/blog/webpack/build.png)
_Build_

Now, open your `index.html` in the browser. You should see the result of `service.js` in the console.

![Webpack Results](https://cdn.auth0.com/blog/webpack/index.png)
_Index file - Results from Webpack_

By now, you should understand the basics of using Webpack in a project. Webpack can do a lot more. Let's examine a use case that gives us a better overview of using loaders and plugins with Webpack in a JavaScript project.

## Webpack Use Case: Project Asokoro

Remember the _Project Lingo_ we [architected with GulpJS?](https://auth0.com/blog/automate-your-development-workflow-with-gulpjs/). The people of Asokoro were very happy with the results. Now, they want the same results with _Project Asokoro_, but a little more.

**Project Asokoro** is a project that we have embarked upon for the people of _Asokoro_. It does exactly what **Project Lingo** does. _Project Lingo_ allows a mere human click a button, input a destination and Lingo automatically teleports the human to their preferred destination in approximately 5 minutes.

In _Project Asokoro_, we'll have a bunch of JavaScript, Less and Image files. We need to compress and optimize these files so that Asokoro can be super-fast. I mean, you don't want Asokoro taking over an hour to teleport a human because of our in-efficient developer work-flow. We also don't want investors running way.

This is what we need to do:

* Concatenate all our JavaScript files into just one file. This will make sure our app makes one HTTP request while serving JavaScript rather than multiple HTTP requests.
* Compile our Less files into CSS. The browser understands CSS, not LESS.
* Compress all our image files.

We have these requirements listed above. How do we approach tackling these tasks with Webpack?

## Project Asokoro - Install Webpack Plugins

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

## Webpack Loaders And Plugins

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

## Aside: Webpack and JavaScript at Auth0

At [Auth0](https://auth0.com/) we use JavaScript heavily in development and automate tasks using build tools such as Webpack. Using our authentication and authorization server from your JavaScript web apps is a piece of cake.

> [Auth0 offers a generous **free tier**](https://auth0.com/pricing) to get started with modern authentication.

It's as easy as installing the `auth0-js` and `jwt-decode` node modules like so:

```bash
npm install jwt-decode auth0-js --save
```

```js
import auth0 from 'auth0-js';

const auth0 = new auth0.WebAuth({
    clientID: "YOUR-AUTH0-CLIENT-ID",
    domain: "YOUR-AUTH0-DOMAIN",
    scope: "openid email profile YOUR-ADDITIONAL-SCOPES",
    audience: "YOUR-API-AUDIENCES", // See https://auth0.com/docs/api-auth
    responseType: "token id_token",
    redirectUri: "http://localhost:9000" //YOUR-REDIRECT-URL
});

function logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('access_token');
    window.location.href = "/";
}

function showProfileInfo(profile) {
    var btnLogin = document.getElementById('btn-login');
    var btnLogout = document.getElementById('btn-logout');
    var avatar = document.getElementById('avatar');
    document.getElementById('nickname').textContent = profile.nickname;
    btnLogin.style.display = "none";
    avatar.src = profile.picture;
    avatar.style.display = "block";
    btnLogout.style.display = "block";
}

function retrieveProfile() {
    var idToken = localStorage.getItem('id_token');
    if (idToken) {
        try {
            const profile = jwt_decode(idToken);
            showProfileInfo(profile);
        } catch (err) {
            alert('There was an error getting the profile: ' + err.message);
        }
    }
}

auth0.parseHash(window.location.hash, (err, result) => {
    if(err || !result) {
        // Handle error
        return;
    }

    // You can use the ID token to get user information in the frontend.
    localStorage.setItem('id_token', result.idToken);
    // You can use this token to interact with server-side APIs.
    localStorage.setItem('access_token', result.accessToken);
    retrieveProfile();
});

function afterLoad() {
    // buttons
    var btnLogin = document.getElementById('btn-login');
    var btnLogout = document.getElementById('btn-logout');

    btnLogin.addEventListener('click', function () {
        auth0.authorize();
    });

    btnLogout.addEventListener('click', function () {
        logout();
    });

    retrieveProfile();
}

window.addEventListener('load', afterLoad);
```

Go ahead and check out our [quickstarts](https://auth0.com/docs/quickstarts) for how to implement authentication using different languages and frameworks in your apps.

## Conclusion

You have now learned the core concepts of Webpack and how to configure it in an application. You can leverage this gentle introduction for understanding of intermediate and advanced concepts. [Sean Larkin](https://twitter.com/thelarkinn) has some awesome Webpack courses on [Webpack Academy](https://webpack.academy)

As at the time of this writing, Webpack is the most popular build tool amongst web developers. It is a beast that can be tamed to do your bidding in your JavaScript projects.

What's your experience with using Webpack? Let me know in the comments section.😊
