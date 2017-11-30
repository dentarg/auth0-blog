---
layout: post
title: "React 16 Release: What’s New?"
description: "ReactJS 16 brings major changes to the popular JavaScript library for building user interfaces. Learn what's new in ReactJS!"
date: 2017-10-26 08:30
category: Technical Guide, Frontend, ReactJS
design:
  bg_color: "#1A1A1A"
  image: https://cdn.auth0.com/blog/reactjs16/logo.png
author:
  name: Prosper Otemuyiwa
  url: http://twitter.com/unicodeveloper?lang=en
  mail: prosper.otemuyiwa@auth0.com
  avatar: https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200
tags:
- react
- reactjs
- javascript
- reactfiber
- fiber
- frontend
- authentication
related:
- 2017-02-21-reactjs-authentication-tutorial
- 2017-01-24-optimizing-react
- 2017-01-26-testing-react-applications-with-jest
---

---

**TL;DR:** ReactJS is a UI library that has gained massive adoption by developers and organizations around the world because of its efficient and reactive model. In this article, we'll highlight notable additions to ReactJS 16 and dabble into the architecture it runs on.

---

ReactJS is a JavaScript library, built and maintained by Facebook. At the time of writing, ReactJS has over 78,000 stars on [GitHub](https://github.com/facebook/react). And many web platforms such as _Twitter_, _Airbnb_, _Lyft_, _Dropbox_, _Pinterest_, _Whatsapp_ and _Instagram_ use ReactJS to build their user interfaces. The ReactJS developer community is very robust. In fact, the community is so robust that when Facebook decided to implement the [BSD+ Patents license](https://code.facebook.com/posts/112130496157735/explaining-react-s-license/), there was a public outcry from the community. The complaints from developers were on every other blog and forum as well as at meetups and conferences. Developers and software shops around the world are pretty excited and relieved that ReactJS has been re-licensed under the **MIT** license.

ReactJS 16 was announced to the world on September 26, 2017. Facebook has been working on releasing this new version for a while now. It's great that there is a new release, but ReactJS 16 is a very special release. What's exciting about this new ReactJS release is the fact that it was entirely rewritten from scratch while ensuring that the public API remains unchanged. This major release brings a lot of new features, deprecations, and changes.

## ReactJS API-Compatible Rewrite - Why?

Questions have been flying around as to why Facebook decided to rewrite the internals of ReactJS while keeping the public API essentially unchanged. Facebook has been working on **React Fiber**, which is a reimplementation of ReactJS's core algorithm for about two years now. The goal of _React Fiber_ is to enable **incremental rendering**—the ability to split rendering work into chunks and spread it out over multiple frames. In addition, the ability to pause, abort, or reuse work as new updates come in and the ability to assign priority to different types of updates. There are many reasons as to why it was rewritten but I'll highlight a few reasons.

{% include tweet_quote.html quote_text="The goal of React Fiber is to enable incremental rendering." %}

1. ReactJS needed a way to support asynchronous rendering. The current architecture couldn't have handled this addition so it needed to be re-designed from the ground up.

2. Support for graceful and efficient error handling using error boundaries in ReactJS. It was difficult to add this frequently-demanded feature to the previously existing ReactJS architecture, so it needed to be re-designed from the ground up.

3. The need for a new foundation that is immensely extensible and powerful enough to accommodate new idea implementation going forward. Furthermore, the support for longstanding features such as having fragments, returning text from _render_, unification of the scheduling of different subtrees and simple, non-complex ways to write custom renderers for ReactJS.

## React Fiber

Let's talk a bit about **React Fiber**. As I mentioned earlier, React Fiber has been in development for a while. And there was a website made specially just to track the progress of React Fiber; [isfiberreadyyet.com](http://isfiberreadyyet.com).

_React Fiber_ is a complete, backward compatible rewrite of the ReactJS core which enables sophisticated scheduling of rendering work. It is a reimplementation of ReactJS's core algorithm. The goal of React Fiber is to increase its suitability for app development in sections like gestures, animation, and layouts. One key feature is the support for **incremental rendering**. _Incremental rendering_ is the ability to split the rendering process into chunks and spread it out over multiple frames.

_React Fiber_ is a reimplementation of a stack frame specialized for ReactJS components. Each fiber can be thought of as a virtual stack frame where information from the frame is preserved in memory on the heap, and because the info is saved on the heap, you can control and play with the data structures and process the relevant information as needed.

_React Fiber_ allows smooth rendering of the UI by pausing once in a while and checking for more important updates rather than waiting for all the changes to be propagated throughout the entirety of the component tree before updating the UI. The task scheduling ability of _React Fiber_ makes this possible.

In ReactJS, we have two important players: the **Reconciler** and the **Renderer**. The **Renderer** is a pluggable section of ReactJS that allows rendering of the UI to happen across and outside the DOM. It was originally created for the DOM but was later adapted to support native platforms. ReactJS has the _[ReactJS DOM Renderer](https://github.com/facebook/react/tree/master/packages/react-dom) - renders ReactJS components to the DOM_, _[ReactJS Native Renderer](https://github.com/facebook/react/tree/master/packages/react-native-renderer) - renders ReactJS components to native views_, and the _[ReactJS Test Renderer](https://github.com/facebook/react/tree/master/packages/react-test-renderer) - renders ReactJS components to JSON trees_.

The **Reconciler** is used by the renderer to perform updates to the DOM. Whenever a component updates, be it _mounting_, _unmounting_ or any form of update, the reconciler (_known as the stack reconciler_) processes the component tree from top to bottom synchronously in a single pass, checks for changes in the tree, then passes on these changes to the renderer. In previous versions of ReactJS, the reconciler did not have the ability to pause work, thus making performance suboptimal when deep updates occur and the CPU time is limited.

{% include tweet_quote.html quote_text=" In ReactJS, we have two important players: the Reconciler and the Renderer." %}

With React Fiber, the new reconciler has the ability to do the following:

* Split interruptible work into chunks.
* Pause work and come back to it later.
* Reuse previously completed work.
* And abort work.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">The Fiber Triangle demo now lets you toggle time-slicing on and off. Makes it much easier to see the effect. Thanks <a href="https://twitter.com/giamir?ref_src=twsrc%5Etfw">@giamir</a> for the PR! 🎉 <a href="https://t.co/qhsWUIyXPf">pic.twitter.com/qhsWUIyXPf</a></p>&mdash; Andrew Clark (@acdlite) <a href="https://twitter.com/acdlite/status/846456239693344769?ref_src=twsrc%5Etfw">March 27, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

> **Note:** Work is the result of an update. Updates are computations performed during the traversal of the component trees.

Check out more information on [Reconciliation](https://reactjs.org/docs/reconciliation.html) and the [React Fiber Architecture](https://github.com/acdlite/react-fiber-architecture).

## ReactJS 16 Features

Apart from the fact that ReactJS 16 runs on the new engine, _React Fiber_, ReactJS 16 ships with some new features.

* **Error handling using Error boundaries**: In ReactJS 16, the error handling has been greatly improved. Before now, ReactJS applications broke whenever a runtime error occurred and required a page refresh to recover from the broken state. The component is unmounted each time any error throw in the constructor, render method and lifecycle methods. In ReactJS 16, error boundaries have been introduced to capture errors and display a fallback UI instead of unmounting the component every time. **Error boundaries** are simply ReactJS components that catch JavaScript errors anywhere in a component and child trees, log those errors and display a fallback UI. It is important to know that error boundaries catch errors thrown in the constructor, render and lifecycle methods. The new lifecycle hook method that makes a class component an error boundary is `componentDidCatch(error, info)`. This method works like a try/catch block for components. Create an error boundary component once and call it everywhere it's needed in your application.

    ```js
    class ErrorBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false };
      }

      componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ hasError: true });
        // You can also log the error to an error reporting service
        logErrorToMyService(error, info);
      }

      render() {
        if (this.state.hasError) {
          // You can render any custom fallback UI
          return <h1>Something went wrong.</h1>;
        }
        return this.props.children;
      }
    }
    ```

* **Support for Defining Custom DOM Attributes**: Before now, if you used a custom DOM attribute, ReactJS would skip it. In ReactJS 16, unknown attributes will be passed onto the DOM. A typical example is shown below:

    ```
    <div alien="skullIsland" />

    // will be displayed in ReactJS 15 as:
    <div />
    ```

    ```js
    <div alien="skullIsland" />

    // will be displayed in ReactJS 16 as:
    <div alien="skullIsland" />
    ```

**Note:** Using the canonical ReactJS naming for known attributes still remain the same.

* **Fragments and Strings as new render return types**: In ReactJS 16, you can now return an array of multiple elements from a component's render method.

    ```js
    render() {
      // No need to wrap items in an extra element!
      return [
        // Don't forget the keys :)
        <p key="first">ReactJS</li>,
        <span key="second">PreactJS</li>,
        <span> key="third">VueJS</li>
      ];
    }
    ```
    _Returning arrays_

    ```js
    render() {
      return 'Boss, I just returned a string. Can you believe it? ReactJS 16  is dope!';
    }
    ```
    _Returning a string_

* **Portals**: This is a concept allows you to render children into a DOM node that exists outside of the hierarchy of the parent component. In layman terms, it simply means a child can be inserted into a different location in the DOM via Portals. For example, your app has a section component with a paragraph element as its child. Portals can be used to make the paragraph child element break out of its container.

    ```js
      ReactDOM.createPortal(child, container);
    ```
    _Render the child into the container DOM node_

    ```js
    render() {
      return ReactDOM.createPortal(
        this.props.children,
        domNode,
      );
    }
    ```
    _A typical example_

* **Improved server-side rendering**: The server renderer was completely rewritten in ReactJS 16 to be very fast. In addition, server-side rendering in ReactJS 16 is about three times faster than ReactJS 15 because the server renderer supports _streaming_. This makes sending of data from the server to the client faster than usual. In ReactJS 16, there are two different methods for rendering on the client side, `render()` and `hydrate()`. `render()` as we already know for rendering content solely on the client side, `hydrate()` for rendering on top of server-side rendered markup. Furthermore, ReactJS 16 is better at hydrating server-rendered HTML once it reaches the client. It no longer requires the initial render to exactly match the result from the server. Instead, it will attempt to reuse as much of the existing DOM as possible.

{% include tweet_quote.html quote_text="In ReactJS 16, there are two different methods for rendering on the client side, render() and hydrate()." %}

    ```js
      import { hydrate } from "react-dom"
      import Profile from "./Profile"
      hydrate(<Profile />, document.getElementById("profile-container"));
    ```

> **Note:** `render()` can still be used to render on top of server-side rendered markup, but it's recommended to use `hydrate()` now for that type of rendering in ReactJS 16.


![ReactJS 16 vs ReactJS 15 server-side rendering](https://cdn-images-1.medium.com/max/1600/1*E5Pmh6HSeybcF7C686B9pA.png)
_Source: hackernoon.com_

ReactJS 16 does not support error boundaries and portals in server-side rendering.

For more information, check out this [excellent article on server-side rendering in ReactJS 16.](https://hackernoon.com/whats-new-with-server-side-rendering-in-react-16-9b0d78585d67)

## ReactJS 16 Deprecations and Breaking Changes

There a few deprecations and a number of breaking changes in ReactJS 16.

* Discontinued support for React Add-ons.
* Calling `setState` with null no longer triggers an update.
* Calling `setState` directly inside the `render()` method always causes an update.
* `setState` callbacks now fire immediately after `componentDidMount` or `componentDidUpdate`.
* The `componentDidUpdate` lifecycle no longer accepts the `prevContext` parameter.
* `ReactDOM.render()` and `ReactDOM.unstable_renderIntoContainer()` now return `null` if called from inside a lifecycle method.
* Previously, changing the ref to a component would always detach the ref before that component's render was called. Now, we change the ref later, when applying the changes to the DOM.
* As I mentioned earlier, hydrating a server-rendered container now has an explicit API. Use `ReactDOM.hydrate` instead of `ReactDOM.render` if you're reviving server rendered HTML. Keep using `ReactDOM.render` if you're just doing the client-side rendering.

For more information, check out the full list of [deprecations and breaking changes on GitHub](https://github.com/facebook/react/releases/tag/v16.0.0).

There has been a lot of performance observation and testing done by apps that have made the upgrade to ReactJS 16. And so far, there have been a lot of cheer and positive feedback for ReactJS 16. In fact, Twitter Lite already uses ReactJS 16.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Twitter Lite is now on React v16. We&#39;ve seen from 5 to 32% increase in performance on React components. 🎉👏</p>&mdash; Paul Armstrong (@paularmstrong) <a href="https://twitter.com/paularmstrong/status/920700461388361728?ref_src=twsrc%5Etfw">October 18, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

The Twitter Lite engineering team discovered that the app's bundle size reduced a little and there were very clear improvements on large trees.

{% include asides/react.markdown %}

## Conclusion

ReactJS is an awesome front-end library to employ in building your user interfaces. It is faster now because it runs on _React Fiber_ and allows you to build more performant, smoothe UIs for your web and native applications.

**ReactJS 16** came loaded with lots of new features and significant improvements. Kudos to the ReactJS team and the JavaScript open source community for all their efforts in making ReactJS a better tool.

Have you switched to ReactJS 16 yet? What are your thoughts? Let me know in the comments section! 😊
