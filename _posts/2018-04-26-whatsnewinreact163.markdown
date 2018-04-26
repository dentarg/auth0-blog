---
layout: post
title: "React 16.3: What’s New?"
description: "Learn about the new features in React 16.3. New Lifecycles, Context, Strict Mode, createRef and forward Ref"
longdescription: "React 16 keeps evolving. It's important to understand these changes to enable you build ergonomic applications with React. Learn what's new in React 16!"
date: 2018-04-26 08:30
category: Technical Guide, Angular, ReactJS
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
- 2017-10-26-twhats-new-in-react16
---

---

**TL;DR:** In this article, I'll cover the new  major features in React 16.3.

---

ReactJS 16 shipped with a lot of new features and paramount changes to the framework. And since the release, a lot more features have been shipped. React 16.3 ships with a few major changes I'll like to highlight in this article. Let's dive in!


## StrictMode Component

JavaScript developers are very familiar with the `strict` keyword. This keyword keeps you in check while developing your apps and raises an alarm during development to let you know about potential problems in your codebase.

_React 16.3_ ships with a `StrictMode` component that highlights potential problems in your ReactJS codebase. This component runs a check in development mode to determine if there are issues with the descendant components such as using an unsafe lifecycle method, legacy ref API, e.t.c.

```js
import React from 'react';

function WokeAlarm() {
  return (
    <div>
      <Header />
      <React.StrictMode>
        <div>
          <SetAlarm />
          <RingAlarm />
        </div>
      </React.StrictMode>
      <Footer />
    </div>
  );
}
```

## New Lifecycles

_React 16.3_ ships with new lifecycle methods such as `getDerivedStateFromProps`, and `getSnapshotBeforeUpdate`. 

These existing lifecycle methods, `componentWillMount`, `componentWillReceiveProps`, and `componentWillUpdate` will be deprecated in a future ReactJS 16.x release. These methods would still be available for use in future _React 17_.

* **getDerivedStateFromProps** is an alternative to `componentWillReceiveProps`.
* **getSnapshotBeforeUpdate**


## forwardRef

**Refs** provide a way to access ReactJS elements or DOM nodes created in the render method. They are great for text selection, working with third-party libraries, et al. However, as with anything, there were some challenges with **refs** as regards component encapsulation.

The premise of `forwardRef` is to automatically pass a `ref` received by a parent component to its children. It's great for reusable components in component libraries. As the name implies, the component is forwarding the `ref` to its child.

Check out the example below:

```js
const Login = React.forwardRef((props, ref) => (
  <button ref={ref} class="Login"> {props.children} </button>
));

// You can now get a ref directly to the DOM button:
const ref = React.createRef();

<Login ref={ref}> Get In! </Login>;
```

## createRef

Before now, ReactJS developers had two ways of using refs. You either make use of the callback API or the legacy string ref API.

With _React 16.3_, you can make use of the `createRef` API for managing refs without any negative implications. Check out the example below:

```js
class SpeakerComponent extends React.Component {
  constructor(props) {
    super(props);

    this.inputRef = React.createRef();
  }

  render() {
    return <input type="text" ref={this.inputRef} />;
  }

  componentDidMount() {
    this.inputRef.current.focus();
  }
}
```

## Context API

The `Context` API has been available for a while, but in experimental mode. _React 16.3_ ships with an ergonomic context API that supports static type checking and deep updates.


{% include asides/react.markdown %}

## Conclusion

_ React 16_ has been on a roller-coaster. And it's amazing how ReactJS is becoming more of a way of life than a library, in my opinion.

Have you upgraded to _React 16.3_ yet? What are your thoughts? Let me know in the comments section! 😊