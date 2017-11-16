---
layout: post
title: "Building a Symfony blog"
description: In this tutorial we create an open blog in Symfony which allows users to sign up and become authors, using Auth0 to authenticate
date: 2017-11-15 15:49
category: key
author:
  name: Greg Holmes
  url: https://github.com/GregHolmes
  mail: iam@gregholmes.co.uk
design:
  bg_color: "#3B3B3B"
  image: https://cdn.auth0.com/blog/Symfony/Logo.png
tags:
- symfony
- bootstrap
- authentication
- web-app
- auth0
related:
-
---

**TL;DR:** Symfony is a PHP framework as well as a set of reusable PHP components and libraries. It uses the Model-View-Controller design pattern, and can be scaled to be used in any requirement.  It aims to speed up the creation and maintenance of web applications, replacing repetitive code. In this tutorial, I'll show you how to create your very own blog, with the content stored on a third party called Contentful and authentication through Auth0. The finished code can be found at this [repo](https://github.com/GregHolmes/symfony-blog).

---

## Introduction

### What is Symfony?

* TODO: Talk about Symfony

## Prerequisites

* TODO: Step by step instruction on registering and setting up Auth0

## Implementation of a basic Symfony blog

### Installing Symfony

Install symfony via composer with the following command: `composer create-project symfony/framework-standard-edition:"3.3.11" blog`

Once composer has finished downloading all the required third party libraries, it will ask you to input a number of parameters. Please just leave these empty, pressing return on each line.

Change directory into your project with: `cd blog`

### Installing Bootstrap

In order to install Bootstrap we need Symfony's Webpack Encore, which is a simpler way to integrate Webpack into your application. You can install this by running the following command:

`yarn add @symfony/webpack-encore --dev`

You will see in your root directory of your project, 2 new files (`package.json`, `yarn.lock`) and a new directory (`node_modules`), if committing this to version control, you should add node_modules directory to .gitignore.

Create `webpack.config.js` in the root of the project, this is just the file that contains all of your web pack configurations.

Paste the following code into this file:

```
    // webpack.config.js
    var Encore = require('@symfony/webpack-encore');

    Encore
        // directory where all compiled assets will be stored
        .setOutputPath('web/build/')

        // what's the public path to this directory (relative to your project's document root dir)
        .setPublicPath('/build')

        // empty the outputPath dir before each build
        .cleanupOutputBeforeBuild()

        // will output as web/build/app.js
        .addEntry('app', './assets/js/main.js')

        // will output as web/build/global.css
        .addStyleEntry('global', './assets/css/global.scss')

        // allow sass/scss files to be processed
        .enableSassLoader()

        // allow legacy applications to use $/jQuery as a global variable
        .autoProvidejQuery()

        .enableSourceMaps(!Encore.isProduction())

        // create hashed filenames (e.g. app.abc123.css)
        // .enableVersioning()
    ;

    // export the final configuration
    module.exports = Encore.getWebpackConfig();
```

Lets create a SCSS and Javascript file in our assets directory to be used in the configuration above, they can be left empty for now. We will populate them further in the tutorial.

* `assets/js/main.js`
* `assets/css/global.scss`

Running this command, `yarn run encore dev --watch`, will allow you to compile your javascript and CSS into assets to be used in your Symfony templates.

**NOTE** You may need extra packages installed, Encore will tell you these when you run the command above. Please do as Encore suggests to proceed. It will likely be to run this command: `yarn add sass-loader node-sass --dev`

**NOTE** When you put your code in production please run this command: `yarn run encore production`, It will not only compile the assets but also minify and optimize them.

Open your base twig template which can be found: `app/Resources/views/base.html.twig`

Find the following line (It should be line 6): `{% block stylesheets %}{% endblock %}`.

Within this block we need to include the global.css file. So it will look like:

```
    {% block stylesheets %}
        <link rel="stylesheet" href="{{ asset('build/global.css') }}">
    {% endblock %}
```

Then in the same file find `{% block javascripts %}{% endblock %}` and place the `app.js` include in between. So it will look like:

```
    {% block javascripts %}
        <script src="{{ asset('build/app.js') }}"></script>
    {% endblock %}
```

We've now included both our empty compiled CSS and Javascript files into our base template to be used throughout our app!

**NOTE** If you are running `yarn run encore dev --watch` (Which is advisable for the duration of this tutorial), you will need to open a second Terminal to run the other commands required.

In order to make use of Bootstrap we need to install jQuery, so in your second Terminal run: `yarn add jquery --dev`

Once installed at the top of your empty `assets/js/main.js` file, insert `var $ = require('jquery');`.

We want an app css assets file so, lets create the following file `assets/css/main.scss`
And in `assets/js/main.js` at the bottom paste the following: `require('../css/main.scss');`

Finally, in your `base.html.twig` In the Stylesheets block, paste the following: `<link rel="stylesheet" href="{{ asset('build/app.css') }}">`

Now we need to install bootstrap-sass with the following command: `yarn add bootstrap-sass --dev`
We need to import this into our Sass file. So in `assets/css/global.scss` lets put in the following lines:

```
// customize some Bootstrap variables
$brand-primary: darken(#428bca, 20%);

// the ~ allows you to reference things in node_modules
@import '~bootstrap-sass/assets/stylesheets/bootstrap';
```

There is a possibility your Webpack builds can reduce in speed. So a solution to this is to use the `resolveUrlLoader` by placing the following code into your `webpack.config.js`

```
     .enableSassLoader(function(sassOptions) {}, {
         resolveUrlLoader: false
     })
```

We're going to want to override the path to icons by loading Bootstrap in your `global.scss` file:

```
    $icon-font-path: "~bootstrap-sass/assets/fonts/bootstrap/";
```

Finally in your `main.js` file you need to require bootstrap-sass under your `var $ = require('jquery');` line
```
    // JS is equivalent to the normal "bootstrap" package
    // no need to set this to a variable, just require it
    require('bootstrap-sass');
```

You've now set up Bootstrap to be used in your Symfony Blog.

### Installing dependencies
### Showing blog posts
### Showing specific blog post
### Showing author details

## Advanced functionality with Auth0

### Installing HWIOAuth Bundle
### Create an author page
### Creating event listener to ensure author exists before accessing further functionality
### Creating blog posts created by authenticated author
### Creating delete functionality for author's posts
### Creating a blog post

## Conclusion

* TODO: Write conclusion
