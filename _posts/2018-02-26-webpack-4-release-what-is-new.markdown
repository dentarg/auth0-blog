---
layout: post
title: "Webpack 4.0 Release: What's New?"
description: "Webpack 4.0 has officially been released. What's new? What improvements were made? Learn how to build faster web applications with this new release."
longdescription: "Webpack 4.0 is a major release to the most powerful module bundler for JavaScript applications. Legato (Webpack 4.0's codename) ships with notable additions and ensures build times are now about 98% faster."
date: 2018-02-26 08:30
category: Technical Guide, JavaScript, Webpack
design:
  bg_color: "#165B91"
  image: https://cdn.auth0.com/blog/logos/webpack.png
author:
  name: Prosper Otemuyiwa
  url: https://twitter.com/unicodeveloper
  mail: prosper.otemuyiwa@auth0.com
  avatar: https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200
tags:
- webpack
- bundler
- transpiler
- build
- javascript
- automation
- webpack-4
- legato
related:
- 2017-12-05-webpack-a-gentle-introduction
- 2017-10-17-automate-your-development-workflow-with-gulpjs
- 2017-02-10-glossary-of-modern-javascript-concepts
---

---

**TL;DR:** On Sunday, February 25, 2018, **Webpack 4.0**, was released to the public. **Legato** _(Weboack 4.0's codename)_ is a major release to the JavaScript module bundler. It has taken about eight months since the release of 3.0. In this article, I'll cover the new features in **Webpack 4.0** and several other changes and deprecations.

---

Webpack is a capable module bundler for JavaScript applications. It bundles every one of the modules in your application into at least one file (frequently, only one) and serves it to the browser. In any case, Webpack is something beyond a module bundler. With the assistance of loaders and plugins, it can change, minify and optimize a wide range of files before serving them as a bundle to the browser. It takes in different resources, for example, JavaScript, CSS, Fonts, Images, and HTML, and afterwards changes these assets into a configuration that is helpful to use through a browser. The genuine energy of Webpack is the whole of its parts. 

Alright, that's enough, [this article](https://auth0.com/blog/webpack-a-gentle-introduction/) provides a gentle introduction to webpack. Now, what's new in Webpack 4.0?

# What's new in Webpack 4.0?

## 1. Node.js 4 Support Dropped

Node.js 4 is no longer supported. The source code was upgraded to a higher ECMAScript version.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Make sure to use node &gt;= 8.9.4 when using <a href="https://twitter.com/hashtag/webpack?src=hash&amp;ref_src=twsrc%5Etfw">#webpack</a> 4 legato.<br><br>Older versions will have reduced performance, because we started using newer JS features, which are less optimized in older V8 versions.<br><br>Btw. awesome work of the v8 team regarding performance.</p>&mdash; Tobias Koppers (@wSokra) <a href="https://twitter.com/wSokra/status/967852475918274561?ref_src=twsrc%5Etfw">February 25, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

The creator of Webpack, Tobias, warns users to use Node >= 8.9.4 for optimal performance because of newer JavaScript features now used in the codebase.

## 2. Farewell CommonsChunkPlugin, Hello SplitChunksPlugin

It's sad to see you go, dear `CommonsChunkPlugin`. The infamous _CommonsChunkPlugin_ has been removed and replaced with two new smooth APIs called `optimize.splitChunks` and `optimization.runtimeChunk`. Let me explain!

Webpack 4 shipped with huge improvements to the chunk graph and a new optimization technique for chunk splitting. A new plugin was born in the process of improvements called `SplitChunksPlugin`. The `SplitChunksPlugin` automatically identifies modules which should be split by heuristics and splits the chunks. And it has some other great features such as working efficiently on async chunks, and handling vendor splitting with multiple vendor chunks.

By default, shared chunks will be automatically generated for you out of the box in Webpack 4. And it is configurable via `optimize.splitChunks`. The `optimization.runtimeChunk: true` option adds an additional chunk to each entry point containing only the runtime.

Tobias has [compelling examples of how the new optimization technique works!](https://gist.github.com/sokra/1522d586b8e5c0f5072d7565c2bee693).

## 3. WebAssembly Support Out of the Box

WebAssembly (wasm) is a new portable, and load-time-efficient format suitable for compilation to the web. It's really fast and the developer community is embracing it rapidly. For this reason, Webpack 4 now supports WebAssembly out of the box. In Webpack 4, you can import and export any local WebAssembly module. And you can write loaders that allow you to import C++, C and Rust directly.

**Note:** The WebAssembly modules can only be used in async chunks.

## 4. Support for various Module Types

Webpack 4 now supports five module types. These module types are:

* **javascript/auto:** Webpack 3 shipped with support for this module type with all module systems enabled, `CommonJS`, `AMD`, `ESM`.
* **javascript/esm:** Supports only ECMAScript modules.
* **javascript/dynamic:** Supports only CommonJS and AMD.
* **json:** Supports only JSON data, It's available via `require` and `import`.
* **webassembly/experimental:** Supports only WebAssembly modules. For now, it is currently experimental.

{% include tweet_quote.html quote_text="Webpack 4 now supports five module types." %}

## 5. Lighting the Fire with Mode

I am more excited about this feature than everyone in the universe at the moment. The Webpack team has introduced a new config property called `mode` all in the quest to achieve a zero-config (#0CJS) module bundler. The `mode` option can be set to either of these two values; `development` or `production`. Out of the box, it defaults to `production`.

The `production` option provides a set of sensible defaults that allows for:

* Small output size.
* Fast code at runtime.
* Omitting development-only code.
* Not exposing source code or file paths.
* Easy to use output assets.

The `development` option provides a set of sensible defaults that allows for:

* Better tooling for in-browser debugging.
* Fast incremental compilation for a fast development cycle.
* Better error messages at runtime.

Check out the [configuration options affected by `mode`](https://medium.com/webpack/webpack-4-mode-and-optimization-5423a6bc597a).

**Note:** Without the `mode` option in your Webpack config, a warning will be thrown at you.

![Webpack 4 Mode warning](https://cdn.auth0.com/blog/webpack4/modewarning.png)

## 6. Zero Config Module Bundler #OCJS

Before now, an entry point had to be defined inside a `webpack.config.js` file for Webpack to bundle your app. However, with Webpack 4, there is no need to define the entry point, it will take `./src/index.js` as the default. 

Furthermore, there's also no need to define the output file, it emits the bundle to `/.dist/main.js`.

{% include tweet_quote.html quote_text="Webpack 4 supports zero-config (#0CJS) setups. For example, it will use ./src/index.js as the default entry point." %}

The significance of this slick feature comes to play when spinning up small projects. No need for a configuration file. Just webpack away! 

![Webpack 4 without entry](https://cdn.auth0.com/blog/webpack4/withoutindex.png)
_Webpack 4 without any config and entry file._

![Webpack 4 with index.js](https://cdn.auth0.com/blog/webpack4/withindex.png)
_Webpack 4 without any config file. Just a src/index.js file._

## 7. Faster Build Times

Webpack 4's build times are now up to about 98% faster than the previous major version. Don't take my word for it. Try it out yourself. You can get started with Webpack 4 like so:

```bash
npm i webpack --save-dev
```

or use yarn like so:

```bash
yarn add webpack --dev
```

In your package.json's `devDependencies` section, you should now have:

```js
"webpack": "^4.0.0"
 ```

Webpack 3: 2405ms
![Webpack 3's build time](https://cdn.auth0.com/blog/webpack3/buildtime.png)
_Webpack 3's build time_

Webpack 4: 1388ms
![Webpack 4's build time](https://cdn.auth0.com/blog/webpack4/buildtime.png)
_Webpack 4's build time_

Webpack v4 is almost 2x faster than v3 in build time! 

Other performance tests from the community can be found below:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">6 entries, dev mode, source maps off, using a bunch of loaders and plugins. dat speed ⚡️ <a href="https://t.co/fgzYPN24k1">pic.twitter.com/fgzYPN24k1</a></p>&mdash; Evan Scott (@probablyup) <a href="https://twitter.com/probablyup/status/965128389307846657?ref_src=twsrc%5Etfw">February 18, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## 8. Fresh Plugin System

Webpack 4 ships with a complete overhaul of the plugin system. There is a new simple API for plugins and hooks which comes with the following configuration:

* The `hooks` object houses all hooks as property of the extensible class.
* Multiple `Hook` classes now exist depending on the hook type: `sync`, `async`, `normal`, `bailing`, `waterfall`, `looping`.
* You must provide a name when adding plugins.
* You can choose the type of the plugin (sync/callback/promise) when adding plugins.
* `this.hooks = { myHook: new SyncHook(...) }` is the new way of registering hooks. Creating a new Hook object as a property of the `hooks` object.

Tobias wrote a [comprehensive note on how the new plugin system works](https://medium.com/webpack/the-new-plugin-system-week-22-23-c24e3b22e95). The plugin method is backward-compatible.

## 9. Giant Move to webpack-cli

The Webpack's command line interface has been moved to [webpack-cli](https://github.com/webpack/webpack-cli), you need to install `webpack-cli` to use the CLI.

The [Webpack CLI documentation](https://webpack.js.org/api/cli/) can get you started on using the `webpack-cli` effectively.

## Deprecations and Other Updates

* These plugins have been deprecated, `NoEmitOnErrorsPlugin`, `ModuleConcatenationPlugin`, `NamedModulesPlugin`. You can now use `optimization.noEmitOnErrors`, `optimization.concatenateModules`, and `optimization.namedModules` respectively.
* `import()` always returns a namespace object. 
* Webpack now removes dead branches by default.
* The use of `System.import()` now emits a warning.
* `webpackInclude` and `webpackExclude` are supported by the magic comment for `import()`. They allow to filter files when using a dynamic expression.

## Road to Webpack 5

There are several plans underway for Webpack 5. Some of these plans include:

* Stable WebAssembly support.
* The ability to create a custom module type and have Webpack support it.
* Eliminating `ExtractTextWebpackPlugin` and supporting a CSS module type out of the box.
* Supporting HTML module type out of the box.
* Persistent Caching

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

Get the [full example using this code](https://github.com/auth0-blog/es2015-rundown-example).

Go ahead and check out our [quickstarts](https://auth0.com/docs/quickstarts) for how to implement authentication using different languages and frameworks in your apps.

## Conclusion

You have now learned the new additions to Webpack. Webpack 4.0 shipped with a lot of new features and improvements. The Webpack team is close to having a complete migration and additions guide to Webpack 4. In the upcoming weeks and months, they'll be out. New to Webpack? I wrote a [gentle introduction to the module bundler](https://auth0.com/blog/webpack-a-gentle-introduction). [Sean Larkin](https://twitter.com/thelarkinn) also has some awesome Webpack courses on [Webpack Academy](https://webpack.academy/).

Have you started working with Webpack 4 yet? What are your thoughts? Let me know in the comments section! 😊