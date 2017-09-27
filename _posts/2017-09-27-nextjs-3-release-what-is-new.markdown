---
layout: post
title: "Next.js 3.0 Release: What's New?"
description: Next.js 3.0 has officially been released. What's new? What improvements were made? Learn how to build highly performant Universal JavaScript apps with this new release.
date: 2017-09-27 08:30
category: Hot Topics, Frameworks, Next.js
design:
  bg_color: "#222228"
  image: https://cdn.auth0.com/blog/next3/logo.png
author:
  name: Prosper Otemuyiwa
  url: http://twitter.com/unicodeveloper
  mail: prosper.otemuyiwa@auth0.com
  avatar: https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200
tags:
- nextjs
- universal-webapp
- javascript
- auth
related:
- 2016-11-01-building-universal-apps-with-nextjs
- 2017-04-24-build-better-universal-apps-with-nextjs2
- 2016-10-05-build-your-first-app-with-polymer-and-web-components
---

---

**TL;DR:** On Tuesday, October 25 2016, a small JavaScript framework, **Next.js** was released to the public. It's a minimal framework for building server-rendered universal JavaScript web apps. Within a few months of its existence, it gathered a lot of attention from the JavaScript community. The React community was set ablaze with joy for finally having a tool that can help build server-side rendering apps without hassle and in-depth technical know-how. In fact, we covered [how to build a universal JavaScript web app](https://auth0.com/blog/building-universal-apps-with-nextjs) with it. In this article, I'll highlight the notable additions to Next.js's new release, **Next.js 3.0**.

---

## Primer: What is a Universal JavaScript Application?

First, I'll provide a little context for the individuals that find *Universal JavaScript* to be a new term.

The term *Universal* simply means the ability to run the same code on the server, browsers, mobile devices and any other platform. *Universal Javascript* is a term people are leaning towards these days. A lot of developers also call it **Isomorphic JavaScript**. In short, there is a debate on the [React repo](https://github.com/facebook/react/pull/4041) about this term. Michael Jackson, a popular ReactJS developer, wrote a blog post on [Universal JavaScript](https://medium.com/@mjackson/universal-javascript-4761051b7ae9#.ij2c0zh8j). It's indeed true that *naming things* is one of the most difficult aspects of Computer Science.

## What's new in Next.js 3.0 ?

### 1. Dynamic Import Support

Next.js now ships with [Dynamic Import](https://github.com/tc39/proposal-dynamic-import). The import function in all its glory allows a codebase to be split into a set of chunks that can be dynamically loaded later.

In Next.js, you can now use dynamic import as seen below:

```js
const lodash = import('lodash');
...
```

```js
button.addEventListener('click', event => {
    import('./dialogBox.js')
    .then(dialogBox => {
        dialogBox.open();
    })
    .catch(error => {
        /* Error handling */
    })
});
```

This helps to load functionality on demand. Next.js supports server side rendering for dynamic imports which makes it incredibly awesome for you to avoid displaying the clients blank pages, flickering, or loading spinners.

### 2. Static Export Support

Next.js now allows you to generate a truly static site by exporting your project to an `out` directory with _.html_ and _.css_ files. The good thing about this feature is that it was community-driven.

![Static Export Support](https://cdn.auth0.com/blog/next/export.png)
_Community Driven Static Export feature_

You need to do the following:

* Create a custom next.config.js file like so:

    ```js
    exports.exportPathMap = () => ({
      "/": { page: "/" },
      "/about": { page: "/about" }
    });
    ```

* Now run the command like so:

    ```bash
    next build && next export
    ```


**Note:** It's advisable you configure the command in your package.json file like so:

```js
"scripts": {
    "export": "next build && next export",
}
```

So you can just run `npm run export` and it will build your Next.js app as a static website. This simply means you don't need any server to deploy it. Whoop! Whoop!

Change directory into the new `out` directory and deploy your app to a cloud platform, e.g `[now](https://zeit.co/now)`.

### 3. Better Error Handling

The error color theme has been updated to be more accessible and easier on the eyes.

![Beautiful Error Handling](https://cdn.auth0.com/blog/next3/beautifulerror.png)

![Better Error Handling](https://cdn.auth0.com/blog/next3/beautifulerrordisplay.png)

![Live error reloading](https://res.cloudinary.com/zeit-inc/image/upload/front/blog/next3/1.gif)
_Source: Zeit_

### 4. Improved Startup Time

Startup time for a Next.js app is now 5 times faster. The bootup time for a typical Next.js 3 app was cut down from [1000ms to about 200ms](https://github.com/zeit/next.js/pull/2566).

### 5. Optimized Bundle

The bundle size of Next.js core is now smaller. In fact, here is the webpack bundle analyzer output after optimization:

![Optimized Bundle](https://user-images.githubusercontent.com/50838/27760078-542abbea-5e5c-11e7-9ae4-2d1beb6fad3b.png)
_Optimized Bundle_

### 6. Improved Hot Module Replacement

Before now, there were some bugs with HMR, (hot module replacement), One of which was the `ERR_INCOMPLETE_CHUNK_ENCODING` error that shows up when using Node.js 8.0. That issue has been solved. Yaay!

Furthermore, if you return a wrong type, Next.js shows you the right error message and also recovers smoothly from it once the right type is returned.

![Returning of Bad Type](https://res.cloudinary.com/zeit-inc/image/upload/front/blog/next3/4.gif)
_Better Bad Type Returns_

One more thing: _undefined is not a function_ is now obsolete. Next.js now correctly identifies any type of runtime error thrown and catches it effectively. A typical example of this scenario can be seen below:

![Undefined is now a function](https://res.cloudinary.com/zeit-inc/image/upload/front/blog/next3/5.gif)
_Source: Next.js Blog_

### 7. Dynamic React Components

Next.js now ships with a powerful opt-in utility called `next/dynamic` which helps you to create dynamically loaded React Components easily.

Before now, code splitting was route based. In Next.js 3, you will be able to load code as a function of the data that the user gets.

```js
import dynamic from 'next/dynamic'
const DialogComponent = dynamic(import('../components/DialogBox'))

export default () => (
  <div>
    <Header />
    <DialogComponent />
    <p>Weclome to the landing Page</p>
  </div>
)
```

**Note:** If the dynamic component is loaded in the initial rendering, server-rendering also works. Awesome!

## Aside: Authenticating a Next.js 3.0 App with Auth0

You can check out how to implement authentication with Auth0 in the [Next.js 1.0](https://auth0.com/blog/building-universal-apps-with-nextjs/) and [Next.js 2.0 release](https://auth0.com/blog/build-better-universal-apps-with-nextjs2/) tutorials.

## Conclusion

With **Next.js 3**, the [GitHub repo](https://github.com/zeit/next.js/) now has over 16,000 stars and we have seen lots of significant improvements and major upgrades from the initial version that was released last year. Kudos to the team behind this project and the JavaScript community for their continuous support. In fact, they already have plans for **[Next.js 4](https://zeit.co/blog/next3#4.0-and-beyond)**.
