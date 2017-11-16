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

* Install symfony via composer with the following command: `composer create-project symfony/framework-standard-edition:"3.3.11" blog`

Once composer has finished downloading all the required third party libraries, it will ask you to input a number of parameters. Please just leave these empty, pressing return on each line.

### Installing Bootstrap

* `yarn add @symfony/webpack-encore --dev`
* create files: `assets/js/main.js` and `assets/css/global.scss`
* create `webpack.config.js` in the root of the project. Paste the following code into this file:

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

* Running the following command will allow you to compile your javascript and CSS into assets to be used in your Symfony templates `yarn run encore dev --watch`

**NOTE** You may need extra packages installed, Encore will tell you these when you run the command above. Please do as Encore suggests to proceed.

**NOTE** When you put your code in production please run this command: `yarn run encore production`, I twill not only compile the assets but also minify and optimize them.

Open the `base.html.twig` template and find: `{% block stylesheets %}{% endblock %}`. Within this block we need to include the global.css file. So it will look like:
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

In order to make use of Bootstrap we need to install jQuery, so in your Terminal run the following command: `yarn add jquery --dev`
And at the top of your `assets/js/main.js` file, paste `var $ = require('jquery');`.

We want an app css asset file so, lets create the following file `assets/css/main.scss`
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
