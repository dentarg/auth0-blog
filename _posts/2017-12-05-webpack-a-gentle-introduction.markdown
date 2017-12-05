---
layout: post
title: "Webpack: A Gentle Introduction to the Module Bundler"
description: Learn the basics of Webpack and how to configure it in your web application.
date: 2017-12-05 8:30
category: Technical Guide, JavaScript, Webpack
author:
  name: Prosper Otemuyiwa
  url: https://twitter.com/unicodeveloper?lang=en
  avatar: https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200
  mail: prosper.otemuyiwa@auth0.com
design:
  bg_color: "#165B91"
  image: https://cdn.auth0.com/blog/webpack/logo.png
tags:
- webpack
- bundler
- transpiler
- build
- javascript
- automation
related:
- 2017-09-20-rxjs-advanced-tutorial-with-angular-web-speech-part-1
- 2017-10-17-automate-your-development-workflow-with-gulpjs
- 2017-02-10-glossary-of-modern-javascript-concepts
---

---

**TL;DR:** In this tutorial, I'll introduce you to Webpack and show you how to configure it for performance optimization in your web application. Check out the [repo](https://github.com/auth0-blog/webpack-gentle-introduction) to get the code.

---

**[Webpack](https://webpack.js.org)** is an aggressive and powerful module bundler for JavaScript applications. It packages all the modules in your application into one or more bundles _(often, just one)_ and serves it to the browser. However, Webpack is more than just a module bundler. With the help of loaders and plugins, it can transform, minify and optimize all types of files before serving them as one bundle to the browser. It takes in various assets, such as JavaScript, CSS, Fonts, Images, and HTML, and then transforms these assets into a format that’s convenient to consume through a browser. The true power of Webpack is the sum of its parts.

{% include tweet_quote.html quote_text="The true power of Webpack is the sum of its parts." %}

**Webpack** is a JavaScript library, built and maintained by [Tobias Koppers and the team](https://twitter.com/wsokra). It is very well known and backed by the developer community. Virtually every JavaScript framework and project uses Webpack.

![Webpack - Backers](https://cdn.auth0.com/blog/webpack/backers.png)
_Webpack - Backers_

![Webpack - Sponsors](https://cdn.auth0.com/blog/webpack/sponsors.png)
_Webpack - Sponsors_

Currently, many web platforms use Webpack during development. Such platforms include Auth0, Netflix, Instagram, Airbnb, KhanAcademy, Trivago and more. The [documentation](https://webpack.js.org/concepts/) is very detailed, and there is a vibrant community of users. Webpack currently exists in two GitHub Organizations, [Webpack](https://github.com/webpack) and [Webpack-contrib](https://github.com/webpack-contrib). The _Webpack_ org consists of projects such as [webpack](https://github.com/webpack/webpack), [webpack-cli](https://github.com/webpack/webpack-cli), [tapable](https://github.com/webpack/tapable), while the _Webpack-contrib_ org consists of mostly plugins and loaders.


## Webpack - The Core Concepts

Webpack is popularly addressed as a beast in the JavaScript community. A lot of developers know how to use Webpack but are constantly confused as to how it actually works under the hood. Is it magic? Is Sean Larkin a sorcerer? What about Tobias? Is he a first-generation spell-caster? Well, I'll address this quite simply. I ask that you just grab your cup of coffee and follow along.

Webpack builds a dependency graph when it processes your application. It starts from a list of modules defined in its config file (`webpack.config.js`) and recursively builds a dependency graph that includes every module your application needs, then packages all of those modules into a small number of bundles to be loaded by the browser.

{% include tweet_quote.html quote_text="Webpack builds a dependency graph when it processes your application." %}

There are four core concepts you need to grasp to understand how Webpack functions:

* **Entry**
* **Output**
* **Loaders**
* **Plugins**

### Entry

Every Webpack setup has one or more _entry points._ The entry point tells Webpack where to start building its dependency graph from. Webpack starts processing the module at the entry point and roams around the application source code to look for other modules that depend on the entry module. Every direct or indirect dependency is captured, processed and outputted into a bundle(s).

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

> **Note:** Just simply reiterating. Multiple entry points can be specified in a Webpack config file.

### Output

Only one output point can be specified in a Webpack setup. The _output_ config property tells Webpack where to place the bundle(s) it creates and how to name them. It is as simple as specifying the `output` property in the config file like so:

```js
const config = {
    entry: './app/prosper.js',
    output: {
        path: '/unicodeveloper/project/public/dist',
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

In the code above, the `html-loader` processes HTML files and exports them as strings. There are several loaders such as [css-loader](https://github.com/webpack-contrib/css-loader), [less-loader](https://github.com/webpack-contrib/less-loader), [coffee-loader](https://github.com/webpack-contrib/coffee-loader) and many more.

### Plugins

Earlier in the post, I mentioned that loaders are like transformers. Plugins are _super-man-like_ in their operations. They can do a lot more tasks than loaders. In fact, just anything ranging from deleting files, to backing up files on services like [Cloudinary](https://cloudinary.com), to copying files, etc. Check out the example below:

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

In order to use Webpack, you need to have the tool mentioned below installed on your machine.

* **Node.js**: Navigate to the [Node.js website](https://nodejs.org/en/download/) and install the latest version on your machine. Verify that `npm` works by running `npm` in your terminal.


## Setting Up Webpack in an Application

Create a new project directory. Head over to the terminal and run `npm init` to create a `package.json` inside the directory.

Next, go ahead and add `webpack` to the project.

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

{% highlight html %}
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

With this action, we can just run `npm run build` from the terminal. The command will invoke `webpack`. Go ahead and try it out.

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

Remember the _**Project Lingo**_ we [architected with GulpJS?](https://auth0.com/blog/automate-your-development-workflow-with-gulpjs/) The people of Asokoro were very happy with the results. Now, they want the same results with _**Project Asokoro**_.

_**Project Asokoro**_ is a project that we have embarked upon for the people of _Asokoro_. It does exactly what _**Project Lingo**_ does. _**Project Lingo**_ allows a mere human click a button, input a destination and Lingo automatically teleports the human to their preferred destination in approximately 5 minutes.

In _**Project Asokoro**_, we'll have a bunch of JavaScript, Sass and Image files. We need to compress and optimize these files so that Asokoro can be super-fast. I mean, you don't want Asokoro taking over an hour to teleport a human because of our inefficient developer work-flow. We also don't want investors running way.

This is what we need to do:

* Concatenate all our JavaScript files into just one file. This will make sure our app makes one HTTP request while serving JavaScript rather than multiple HTTP requests.
* Compile our Sass files into CSS. The browser understands CSS, not Sass.
* Compress all our image files.

We have these requirements listed above. How do we approach tackling these tasks with Webpack?

## Project Asokoro - Install Webpack Loaders and Plugins

Let's continue from where we stopped earlier. Create a new `scss` folder in the root directory and add a `service.scss` file to it.

_service.scss_

{% highlight html %}
{% raw %}
$color: rgb(255, 123, 123);
$font-weight: 300;

h2 {
  color: $color;
  font-weight: $font-weight;
}

span {
    font-weight: $font-weight;
    color: rgb(255, 69, 69) ;
}
{% endraw %}
{% endhighlight %}

Head over to `js/factory.js` and import the sass file like so:

```js
import './service.js';
import '../scss/service.scss';
```

Go ahead and install the following loaders and plugins via your terminal:

```bash
npm install sass-loader node-sass extract-text-webpack-plugin css-loader style-loader --save-dev
```

A quick breakdown of what each of these plugins and loaders aims to accomplish.

* **[sass-loader](https://github.com/webpack-contrib/sass-loader)** - Loads a SASS/SCSS file and compiles it to CSS. It requires `node-sass` to work.
* **[node-sass](https://github.com/sass/node-sass)** - This libarary allows you to natively compile `.scss` files to `css` at incredible speed and automatically via a connect middleware.
* **[extract-text-webpack-plugin](https://webpack.js.org/plugins/extract-text-webpack-plugin/)** - Extract text from a bundle, or bundles, into a separate file.
* **[css-loader](https://github.com/webpack-contrib/css-loader)** - The `css-loader` interprets `@import` and `url()` like `import/require()` and resolves them.
* **[style-loader](https://github.com/webpack-contrib/style-loader)** - Add CSS to the DOM.

## Project Asokoro - Rewrite Webpack Config File

Open up the `webpack.config.js` file and modify it to this code below:

```js
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: './js/factory.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [{
            loader: 'css-loader'
          }, {
            loader: 'sass-loader'
          }],
          fallback: 'style-loader'
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('bundle.css')
  ]
};
```

In the code above, we have the `extract-text-webpack-plugin`. It extracts all the CSS code into `/dist/bundle.css`. Webpack roams the source code for `.scss` files then use `css-loader` and `sass-loader` to load and embed the stylesheets into the JavaScript bundle.

Quickly add a link to the `bundle.css` in `index.html` like so:


{% highlight html %}
{% raw %}
    <link rel="stylesheet" type="text/css" href="dist/bundle.css" />
{% endraw %}
{% endhighlight %}

Now, run the build again, `npm run build` and check out the app in the browser.

![Webpack - New Page](https://cdn.auth0.com/blog/webpack/newpage.png)

The styling was applied to the page and our JavaScript code still logs to the console.

## Project Asokoro - Compressing Images

Head over to your terminal and install these two loaders:

```bash
npm install file-loader image-webpack-loader
```

A quick breakdown of what these loaders aim to accomplish.

* **[file-loader](https://github.com/webpack-contrib/file-loader)** - Instructs webpack to emit the required object as file and to return its public URL.
* **[image-webpack-loader](https://github.com/tcoopman/image-webpack-loader)** - Minify PNG, JPEG, GIF and SVG images with `imagemin`.

Update `index.html` to have this div with class _lili_:

{% highlight html %}
{% raw %}
<div>
  <h2> Project Asokoro.... <span>The Joy of Webpack</span></h2>

  <div class="lili"></div>
</div>
{% endraw %}
{% endhighlight %}

Update `service.scss` file to have this piece of code.

_service.scss_

{% highlight html %}
{% raw %}
.lili {
  border: 1px solid black;
  background-image: url('../image/lambo.jpg');
  width: 1000px;
  height: 1000px;
}
{% endraw %}
{% endhighlight %}

> **Note:** Create an `image` directory and add the `lambo.jpg` file to it.

The `lambo.jpg` can be found [here](https://cdn.auth0.com/blog/webpack/lambo.jpg).

Update `webpack.config.js` to have the `file-loader` and `image-webpack-loader`.

```js
...
{
    test:  /\.(gif|png|jpe?g|svg)$/i,
    use: [
      'file-loader',
      {
        loader: 'image-webpack-loader',
        options: {
          bypassOnDebug: true,
        },
      },
    ],
}
...
```

In the code above, the `file-loader` loads any image file with these extensions and emits the file with a name that is the result of the MD5 hash of the file's contents in the `dist` directory. The `image-webpack-loader` compresses the file.

Now, run your build, `npm run build` and check your app in the browser.

![Webpack - Index Page](https://cdn.auth0.com/blog/webpack/bundlingimages.png)

Check out your code editor, you should see a new compressed version of the image in the `dist` directory.

![Webpack - Compressed and Uncompressed](https://cdn.auth0.com/blog/webpack/filestructure.png)
_Compressed and Uncompressed_

Furthermore, check out the version of the image that is served to the browser.

![Webpack - Image served to the browser](https://cdn.auth0.com/blog/webpack/servedtothebrowser.png)

![Webpack - Image loaded in CSS](https://cdn.auth0.com/blog/webpack/compressedservedincss.png)


There are several [loaders](https://webpack.js.org/loaders/) and [plugins](https://webpack.js.org/plugins/) available for Webpack. Head over there, search for any plugin that might suit your use case and take advantage of it.

## Webpack Performance Budgets

[Addy Osmani](https://twitter.com/addyosmani) submitted an [RFC](https://github.com/webpack/webpack/issues/3216) on October 31, 2016 about Webpack Performance Budgets. His argument was that many of the apps bundled with Webpack ship a large, single bundle that ends up pegging the main thread and taking longer than it should for web applications to be interactive.

![Webpack - Trace on Chrome](https://cloud.githubusercontent.com/assets/110953/19858610/5aaeea68-9f3f-11e6-8a14-d4ee64b92f66.jpg)

Webpack 2.2 shipped with the _Performance Budget_ feature. And made the feature an opt-out. By default, Webpack prescribes some default performance budgets (for entry points and assets). You can adjust them to suit your use case. All you need to do is add a _performance_ entry in your `webpack.config.js` and customize the _maxAssetSize_, _maxEntryPointSize_ and _hints_ attribute.

Let's try it in _Project Asokoro_. Add a performance entry to the `webpack.config.js` like so:

_webpack.config.js_

```js
...
performance: {
    maxAssetSize: 100,
    maxEntrypointSize: 100,
    hints: 'warning'
}
```

After running Webpack, this is the result shown below:

![Webpack Performance Budgets](https://cdn.auth0.com/blog/webpack/performance-budgets.png)

Learn more about [Webpack Performance Budgets here.](https://medium.com/webpack/webpack-performance-budgets-13d4880fbf6d)

## Aside: Webpack and JavaScript at Auth0

At [Auth0](https://auth0.com/) we use JavaScript heavily in development and automate tasks using build tools such as Webpack. Using our authentication and authorization server from your JavaScript web apps is a piece of cake.

> [Auth0 offers a **free tier**](https://auth0.com/pricing) to get started with modern authentication.

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

You have now learned the core concepts of Webpack and how to configure it in an application. You can leverage this gentle introduction for an understanding of intermediate and advanced concepts. [Sean Larkin](https://twitter.com/thelarkinn) has some awesome Webpack courses on [Webpack Academy](https://webpack.academy)

As at the time of this writing, Webpack is the most popular build tool amongst web developers. It is a beast that can be tamed to do your bidding in your JavaScript projects.

What's your experience with using Webpack? Let me know in the comments section.😊
