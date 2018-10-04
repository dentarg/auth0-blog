---
layout: post
title: "Create a Desktop App with Angular 2 and Electron"
description: "Build a simple image calculator app with Angular 2 and Electron"
date: 2015-12-15 16:00
alias: /2015/12/15/create-a-desktop-app-with-angular-2-and-electron/
category: Technical Guide, Frontend, Electron
author:
  name: Ryan Chenkie
  url: https://twitter.com/ryanchenkie?lang=en
  mail: ryanchenkie@gmail.com
  avatar: https://www.gravatar.com/avatar/7f4ec37467f2f7db6fffc7b4d2cc8dc2?size=200
design:
  image: https://cdn.auth0.com/blog/angular2-electron/angular2-electron-logo.png
  bg_color: "#076274"
  image_size: "75%"
  image_bg_color: "#fff"
tags:
- angular2
- angular
- electron
- native
- app
related:
- 2015-09-02-angular2-series-working-with-pipes
- 2016-03-28-xamarin-authentication-and-cross-platform-app-development
- 2016-02-03-getting-started-with-auth0-lock-series-implementing-lock
---

<div class="alert alert-danger alert-icon">
  <i class="icon-budicon-500"></i>
  <strong>This post is out of date.</strong> Angular and Electron have undergone many changes since the publication of this article, and the method of authentication utilized in this post is not up-to-date with current best practices. We are currently working to bring you an updated tutorial on this topic!
</div>

---
**TL;DR:** Electron is an open-source project from GitHub that lets us create cross-platform desktop applications with web technologies. It doesn't matter which specific framework we use; if it works for the web, it works for Electron. We can use Angular 2 for Electron apps, and in this tutorial, we explore how to get a desktop image size calculator app wired up. Check out the [code on GitHub](https://github.com/auth0/angular2-electron).

You can also check out our other Angular 2 material, including tutorials on working with **[pipes](https://auth0.com/blog/2015/09/03/angular2-series-working-with-pipes/)**, **[models](https://auth0.com/blog/2015/09/17/angular-2-series-part-2-domain-models-and-dependency-injection/)**, and **[Http](https://auth0.com/blog/2015/10/15/angular-2-series-part-3-using-http/)**.

---

Developing desktop applications is arguably harder than developing for the web. Throw in the fact that you would need three versions of the same desktop app to make it available for all the popular operating systems, plus all the work that needs to go into preparing for distribution, and it can be a daunting task for web developers to port their skills to native. This is where Electron comes in.

[Electron](http://electron.atom.io/) is an open-source project from GitHub that makes it easy to build cross-platform desktop apps using web technologies. With it, we get a nice set of APIs for interacting with Windows, OS X, and Linux operating systems, and all we need is JavaScript. There are, of course, other ways to create desktop applications with web technologies, but Electron is unique in its ability to easily target three operating systems at once. The other nice part of building apps with Electron is that we're not barred from using any particular framework. As long as it works on the web, it works for Electron.

In this article, we'll explore how to wire up a simple image size calculator app using Electron and Angular 2. While the steps here are specific to Angular 2, remember that any front end framework will work with Electron, so these instructions could be adapted to make use of others.

![image-size-calculator app angular2 electron](https://cdn.auth0.com/blog/angular2-electron/angular2-electron-5.png)

## Setting Up Angular 2 and Electron

We'll use [Webpack](https://webpack.github.io/) for our Angular 2 setup, and we'll base the config loosely on the awesome [Angular 2 Webpack Starter](https://github.com/AngularClass/angular2-webpack-starter) by [AngularClass](https://angularclass.com/).

Let's start with our `package.json` file to list our dependencies, along with some `scripts` that will let us easily run our `webpack` commands and also run the `electron` command to start the app.

```js
// package.json
...

  "scripts": {
    "build": "webpack --progress --profile --colors --display-error-details --display-cached",
    "watch": "webpack --watch --progress --profile --colors --display-error-details --display-cached",
    "electron": "electron app"
  },
  "devDependencies": {
    "electron-prebuilt": "^0.35.4",
    "es6-shim": "^0.34.0",
    "ts-loader": "^0.7.2",
    "typescript": "^1.7.3",
    "webpack": "^1.12.9",
    "webpack-dev-server": "^1.14.0"
  },
  "dependencies": {
    "angular2": "2.0.0-beta.0",
    "zone.js": "^0.5.10",
    "bootstrap": "^3.3.6",
    "gulp": "^3.9.0",
    "es6-shim": "^0.33.3",
    "reflect-metadata": "0.1.2",
    "rxjs": "5.0.0-beta.0"
  }
}

...
```

Next, we need some configuration for Webpack.

```js
// webpack.config.js

var path = require('path');
var webpack = require('webpack');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

module.exports = {
  devtool: 'source-map',
  debug: true,

  entry: {
    'angular2': [
      'rxjs',
      'reflect-metadata',
      'angular2/core',
      'angular2/router',
      'angular2/http'
    ],
    'app': './app/app'
  },

  output: {
    path: __dirname + '/build/',
    publicPath: 'build/',
    filename: '[name].js',
    sourceMapFilename: '[name].js.map',
    chunkFilename: '[id].chunk.js'
  },

  resolve: {
    extensions: ['','.ts','.js','.json', '.css', '.html']
  },

  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'ts',
        exclude: [ /node_modules/ ]
      }
    ]
  },

  plugins: [
    new CommonsChunkPlugin({ name: 'angular2', filename: 'angular2.js', minChunks: Infinity }),
    new CommonsChunkPlugin({ name: 'common',   filename: 'common.js' })
  ]
};
```

We're telling Webpack to bundle up the Angular 2 scripts and serve them from a single `angular2.js` bundle that will be in the `build` directory. The scripts for our app will be served from a separate bundle called `app.js`.

We also need some TypeScript configuration in a `tsconfig.json` file at the project root.

```js
{
  "compilerOptions": {
    "target": "ES5",
    "module": "commonjs",
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "sourceMap": true
  },
  "files": [
    "app/app.ts"
  ]
}
```

All the files specific to our application will live inside the `app` subdirectory. There, we need to provide a `package.json` file that will simply tell Electron which script to use for bootstrapping. This will be the `main.js` file, and in it, we will tell Electron how to open and close our app.

```js
// app/package.json

...

{
  "name": "image-size-calculator-app",
  "version": "0.0.1",
  "main": "main.js"
}

...
```

Now let's configure the application window.

```js
// app/main.js

var app = require('app');

// browser-window creates a native window
var BrowserWindow = require('browser-window');
var mainWindow = null;

app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function () {

  // Initialize the window to our specified dimensions
  mainWindow = new BrowserWindow({ width: 1200, height: 900 });

  // Tell Electron where to load the entry point from
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // Clear out the main window when the app is closed
  mainWindow.on('closed', function () {

    mainWindow = null;

  });

});
```

The `main.js` script is really just some boilerplate that Electron needs to fire up. We are keeping a reference to `mainWindow` so that garbage collection doesn't interfere and close the window on us. We create a browser window with specific dimensions and then load an `index.html` file from the `app` directory. Let's create this file next.

Just like with a regular web app, we need an `index.html` entry point.

```html
  <!-- app/index.html -->

  <html>
    <head>
      <meta charset="UTF-8">
      <title>Image Size Calculator</title>
      <link rel="stylesheet" href="../node_modules/bootstrap/dist/css/bootstrap.min.css">
    </head>
    <body>

      <div class="container">
        <h1>Hello Electron</h1>
      </div>

      <script src="../node_modules/angular2/bundles/angular2-polyfills.js"></script>
      <script src="../build/common.js"></script>
      <script src="../build/angular2.js"></script>
      <script src="../build/app.js"></script>
    </body>
  </html>
```

Aside from `angular2-polyfills.js`, The scripts that we're referencing aren't actually there yet, and that's because we haven't run our `webpack` command to generate them. The last thing we need to do before bundling our scripts is to create an empty `app.ts` file, as this is what our `webpack.config.js` file expects.

With an empty `app.ts` in place, let's bundle the scripts.

```bash
npm run watch
```

This command was set up in our `package.json` file in the project root, and it runs `webpack` with some options. One of these options is to watch for changes, so we can now edit our `app.ts` file and everything will automatically get bundled again.

If we look in our project root, we should now see our `build` directory. With all these files in place, we should be able to run the app. Remember that we've set up a command in our `package.json` file to do this.

```bash
npm run electron
```

If everything is wired up properly, we should now see our "Hello Electron" message.

![image-size-calculator app angular2 electron](https://cdn.auth0.com/blog/angular2-electron/angular2-electron-1.png)

Yikes, that was a lot of boilerplate needed just to set things up! It's worth noting that a lot of this was just to set up Angular 2 and wasn't because of Electron specifically. If we were using a simpler framework (e.g., no TypeScript) or just plain JavaScript, then we wouldn't have needed as much boilerplate. The good news is that all we need to worry about now is the actual Angular 2 code. It's time to start building the app just as we would if it were on the web!

## Creating the Image Uploader

Our simple app will let users drop images in so that they can find out their sizes. Why wouldn't they just check the image's properties? Good point. However, this app will give us a chance to see how Electron adapts web APIs for the desktop.

Let's create the dropzone first. We'll do all of our Angular 2 work in one top-level component.

```js
// app/app.ts

import {bootstrap} from 'angular2/platform/browser';
import {Component} from 'angular2/core';
import {NgFor} from 'angular2/common';

@Component({
  selector: 'app',
  template: `
    <div
      (dragover)="false"
      (dragend)="false"
      (drop)="handleDrop($event)"
      style="height: 300px; border: 5px dotted #ccc;">
      <p style="margin: 10px; text-align: center">
        <strong>Drop Your Images Here</strong>
      </p>
    </div>
  `
})

export class App {

  constructor() {}

  handleDrop(e) {
    var files:File = e.dataTransfer.files;
    Object.keys(files).forEach((key) => {
      console.log(files[key]);
    });

    return false;
  }

}

bootstrap(App);
```

```html
  <!-- app/index.html -->

  ...

  <div class="container">
    <app></app>
  </div>

  ...
```

To define some custom behavior for dropping an image into our app, we need to first pass `false` to the `dragover` and `dragend` events. The `drop` event is what we want to hook into, and for now we are simply logging out the details of the images we drop. That's right--we can see the same dev tools that we would in Chrome. If you're on a Mac, just do `Option + Command + I` to open them up.

Note that to get hold of the event information for the drop, we pass `$event`, just like we would in Angular 1.x.

![image-size-calculator app angular2 electron](https://cdn.auth0.com/blog/angular2-electron/angular2-electron-2.png)

So how are we getting this information, exactly? Electron provides an abstraction around native files so that we can use the HTML5 file API. With this, we get the path to the file on the filesystem. This is useful in our case, because we can link to our images and show them in our app. Let's set that up now.

## Displaying the Images

Let's now put in some templating to display the images. For this, we'll want to use `ngFor` to iterate over the images we drop in.

> **Note:** As of Beta, templates are now case-sensitive. This means that what used to be `ng-for` is now `ngFor`.

```js
// app/app.ts

...

  template: `
    <div class="media" *ngFor="#image of images">
      <div class="media-left">
        <a href="#">
          <img class="media-object" src="{{ "{{ image.path " }}}}" style="max-width:200px">
        </a>
      </div>
      <div class="media-body">
        <h4 class="media-heading">{{ "{{ image.name " }}}}</h4>
        <p>{{ "{{ image.size " }}}} bytes</p>
      </div>
    </div>
`

...

export class App {

  images:Array<Object> = [];

  constructor() {}

  handleDrop(e) {
    var files:File = e.dataTransfer.files;
    var self = this;
    Object.keys(files).forEach((key) => {
      if(files[key].type === "image/png" || files[key].type === "image/jpeg") {
        self.images.push(files[key]);
      }
      else {
        alert("File must be a PNG or JPEG!");
      }
    });

    return false;
  }

}

...
```

Now we push the dropped files onto an array called `images` and iterate over it in our template to get the details. To avoid other file types being dropped in, we are only accepting `png` and `jpeg`.

![image-size-calculator app angular2 electron](https://cdn.auth0.com/blog/angular2-electron/angular2-electron-3.png)

## Getting the Image Stats

We want to have a way to display the total number of images dropped into the app, as well as the total size of those images. For this, we can create an `imageStats` function that returns these details.

```js
// app/app.ts

...

  template: `
    <h1>Total Images: {{ "{{ imageStats().count " }}}}</h1>
    <h1>Total Size: {{ "{{ imageStats().size " }}}} bytes</h1>
  `
...

  imageStats() {

    let sizes:Array<Number> = [];
    let totalSize:number = 0;

    this
      .images
      .forEach((image:File) => sizes.push(image.size));

    sizes
      .forEach((size:number) => totalSize += size);

    return {
      size: totalSize,
      count: this.images.length
    }

  }

...
```

![image-size-calculator app angular2 electron](https://cdn.auth0.com/blog/angular2-electron/angular2-electron-4.png)

## Adding a Byte Conversion Pipe

We're getting the number of bytes for each image, but ideally we would be able to get them in different units. It would be great if we had something to automatically convert the bytes to KB, MB, and GB, and display the appropriate units. We can do this easily with a custom pipe.

```js
// app/app.ts

import {bootstrap} from 'angular2/platform/browser';
import {Component, Pipe, PipeTransform} from 'angular2/core';
import {NgFor} from 'angular2/common';

@Pipe({ name: 'byteFormat'})
class ByteFormatPipe implements PipeTransform {
  // Credit: http://stackoverflow.com/a/18650828
  transform(bytes, args) {
    if(bytes == 0) return '0 Bytes';
    var k = 1000;
    var sizes = ['Bytes', 'KB', 'MB', 'GB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(1) + ' ' + sizes[i];
  }
}

@Component({
  selector: 'app',
  pipes: [ByteFormatPipe],
  template: `
    <h1>Total Images: {{ "{{ imageStats().count " }}}}</h1>
    <h1>Total Size: {{ "{{ imageStats().size | byteFormat " }}}}</h1>
  `
...
```

This pipe checks for the file size in bytes and returns the appropriate conversion. We then just apply the pipe to our template and we're able to get the desired output.

![image-size-calculator app angular2 electron](https://cdn.auth0.com/blog/angular2-electron/angular2-electron-5.png)

## Preparing for Distribution

When distributing Electron apps, it's essential to generate an archive of the application files so that the source code is concealed. This can be done with the `asar` utility.

{% include tweet_quote.html quote_text="When distributing Electron apps, generate an archive of the application files so that the source is concealed." %}

```bash
npm install -g asar
asar pack image-size-calculator app.asar
```

The archive file can then be used for the app, and it will be read-only.

We'll obviously want to change the name of the application and also provide a unique icon. Instructions for this, along with the other steps involved with distribution, can be found in the [Electron docs](http://electron.atom.io/docs/v0.35.0/tutorial/application-packaging/).

## Aside: Authentication with Auth0

No matter which framework you use with your Electron app, you can easily add authentication to it with Auth0! Our Lock widget allows you to get up and running quickly. Sign up for your <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">free Auth0 account</a> to work with these directions.

Before getting started with the code, you'll need to whitelist the `file://*` protocol in your Auth0 dashboard. This can be done in the **Allowed Origins (CORS)** area.

To begin, include the **Auth0-Lock** library from the CDN and provide a button or other element to hook into.

```html
  <!-- index.html -->

  ...

  <!-- Auth0Lock script -->
  <script src="https://cdn.auth0.com/js/lock-7.12.min.js"></script>

  <!-- Setting the right viewport -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

  <body>
    <h1>Authenticate with Auth0!</h1>
    <button id="login">Login</button>

  ...
```

Next, create a new instance of Lock and set `window.electron` to an empty object to trigger the proper login flow for Electron.

```html
  <!-- index.html -->

  <script>

    var lock = new Auth0Lock('YOUR_CLIENT_ID', 'YOUR_CLIENT_DOMAIN');

    window.electron = {};

  </script>
```

Finally, trigger the Lock widget to be shown when the user clicks the **Login** button. In the callback, set the returned user profile and token into local storage for use later.

```html
  <!-- index.html -->

  <script>

    ...

    document.getElementById('login').addEventListener('click', function() {
      lock.show(function(err, profile, token) {
        if (err) {

          // Error callback
          console.error("Something went wrong: ", err);

        } else {

          // Success calback. Save the profile and JWT token.
          localStorage.setItem('profile', JSON.stringify(profile));
          localStorage.setItem('id_token', token);

        }
      });
    });

  </script>
```

> **Important API Security Note:** If you want to use Auth0 authentication to authorize _API requests_, note that you'll need to use [a flow that provides an access token](https://auth0.com/docs/api-auth/grant/implicit). Auth0 [`idToken` should only be used on the client-side, whereas access tokens should be used to authorize APIs](https://auth0.com/blog/why-should-use-accesstokens-to-secure-an-api/). You can read more about [making API calls with Auth0 here](https://auth0.com/docs/apis).
> 
> The way to attach the header to HTTP calls differs depending on which library or framework you're using. If you're using Angular v2+ in your Electron app, you can use **[angular2-jwt](https://www.npmjs.com/package/angular2-jwt)**. Follow the steps in the [Angular docs](https://auth0.com/docs/quickstart/spa/angular2/no-api) for more details. Not using Angular v2+? We have got [integrations](https://auth0.com/docs) for many other frameworks and libraries as well!

## Wrapping Up

Electron offers developers a way to create desktop applications with the web technologies they already know instead of needing to learn new languages that are specific to various operating systems. This is great, because skills can easily be ported, and code can be reused.

Electron doesn't care about which framework we use for our apps. Even though it's in beta, Angular 2 is a great framework to use inside an Electron app and, once everything is set up, works just the same as if we were developing for the web.
