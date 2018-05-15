---
layout: post
title: "React 16.3: What’s New?"
description: "Learn about the new features in React 16.3. New Lifecycles, Context, Strict Mode, createRef, and forwardRef"
longdescription: "React 16 keeps evolving. It's important to understand the changes that enable you to build ergonomic React applications. Learn what's new in React 16.3!"
date: 2018-05-15 08:30
category: Technical Guide, FrontEnd, React
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
- ref
- context
- forwardref
- authentication
related:
- 2017-02-21-reactjs-authentication-tutorial
- 2018-02-06-developing-games-with-react-redux-and-svg-part-1
- 2018-03-27-react-router-4-practical-tutorial
---


[ReactJS 16 shipped with a lot of new features](https://auth0.com/blog/whats-new-in-react16). Since then, even more features have been introduced to the library.

_React 16.3_ ships with a few major changes that I'll like to highlight in this article. Let's dive in!


## StrictMode Component

JavaScript developers are very familiar with the `strict` keyword. This keyword keeps you in check while developing your apps and raises an alarm during development to let you know about potential problems in your codebase.

_React 16.3_ ships with a `StrictMode` component that highlights potential problems in your ReactJS codebase. 

This component runs a check in development mode to determine if there are issues with the descendant components such as using an unsafe lifecycle method, legacy ref API, etc.

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

## New Lifecycle Methods

_React 16.3_ ships with new lifecycle methods such as `getDerivedStateFromProps`, and `getSnapshotBeforeUpdate`. 

The current lifecycle methods `componentWillMount`, `componentWillReceiveProps`, and `componentWillUpdate` will be deprecated in a future ReactJS 16.x release because they have been known to be problematic and behave in unintended ways. These methods will continue to be available for use in the next major release, _React 17_.

* **getDerivedStateFromProps** can be used instead of `componentWillReceiveProps`.
* **componentDidMount** can be used instead of **componentWillMount**.
* **componentDidUpdate** can be used instead of **componentWillUpdate**.

The new `getDerivedStateFromProps` method is static and will be called on the initial mounting of the component and also when the component is re-rendered.

{% include tweet_quote.html quote_text="The new getDerivedStateFromProps method is static and will be called on the initial mounting of the component." %}

```js
class Speaker extends Component {
  static getDerivedStateFromProps() {
    if (nextProps.value !== prevState.value) {
      return ({ value: nextProps.value });
    }
  }
}
```

The new `getSnapshotBeforeUpdate` method is called before any DOM mutations happen. It's great to perform any sort of calculations needed for your component here and then pass it to `componentDidUpdate` as the third argument like so:

{% include tweet_quote.html quote_text="The new getSnapshotBeforeUpdate method is called before any DOM mutations happen." %}

```js
...
getSnapShotBeforeUpdate(prevProps, prevState) {
  return prevProps.list.length < this.props.list.length ? this.listRef.scrollHeight : null;
}

componentDidUpdate(prevProps, prevState, snapshot) {
  if (snapshot !== null) {
    const listRef = this.listRef;
    listRef.scrollTop += listRef.scrollHeight - snapshot;
  }
}
...
```

## forwardRef

**Refs** provide a way to access ReactJS elements or DOM nodes created in the render method. They are great for getting values from input elements, working with third-party DOM libraries, et al. However, there were some challenges with **refs** regarding component encapsulation.

`forwardRef` automatically passes a `ref` received by a parent component to its children. It's great for reusable components in component libraries. As the name implies, the component is forwarding the `ref` to its child.

Check out the example below:

```js
import React, { Component } from 'react';

const LoginButton = React.forwardRef((props, ref) => (
  <button ref={ref} class="Login"> {props.children} </button>
));


class Display extends Component {
  myRef = React.createRef();

  componentDidMount() {
    this.myRef.current.focus();
  }

  render() {
    return (
      <div className="container">
        <LoginButton ref={this.myRef}> Get In! </LoginButton>
      </div>
    ) 
  }
} 
```

The use of `forwardRef` is more valuable in Higher Order Components. The [ReactJS blog](https://reactjs.org/docs/forwarding-refs.html) has the perfect example of this scenario.

## createRef

Previously, ReactJS developers had two ways of using refs: You either made use of the callback API or the legacy string ref API.

With _React 16.3_, you can make use of the `createRef` API for managing refs without any negative implications. It's simpler and developer friendly too. Check out the example below:

_without createRef API_

```js
class SpeakerComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <input type="text" ref={(input) => {
      this.inputRef = input;
    }} />;
  }
}
```

_with createRef API_

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

The `Context` API has been available for a while but in experimental mode. _React 16.3_ ships with an ergonomic Context API that supports static type checking and deep updates. This API solves the challenge most developers experience which is the complexity of passing data from child to parent and back and make them quickly reach out for [Redux](https://redux.js.org). 

Check out this example below:

```js
import React, { Component } from 'react';

const Dog = (props) => (
  <div>
    <Animal name={props.name} />
  </div>
);

}
class Animal extends Component {
  render() {
    return (
      <div>
        <p> Hey, I'm a {this.props.name} </p>
      </div>
    )
  }
}


class App extends Component {
  state = {
    name: 'Casanova',
    food: 'bone',
  }

  render() {
    return (
      <div>
        <Dog name={this.state.name} />
      </div>
    )
  }
}

export default App;
```

This is a simple example, but the way we pass data from component to component with the use of props is not developer friendly and could get out of hand very quickly! At this point, most developers quickly reach out for a data store or state management library to manage this process efficiently. However, the new Context API in _React 16.3_ can be used to eliminate this challenge.

With this new API, we'll need a **Provider** and a **Consumer**. The data will live in the **Provider** while the **Consumer** represents where the data needs to be accessed.

```js
import React, { Component } from 'react';

// create a new context
const MyContext = React.createContext();

// create a provider component
class MyProvider extents Component {
  state = {
    name: 'Casanova',
    food: 'bone'
  }

  render() {
    return (
      {% raw %}
      <MyContext.Provider value={{ state: this.state }}>
        { this.props.children }
      </MyContext.Provider>
      {% endraw %}
    )
  }
}

const Dog = (props) => (
  <div>
    <Animal />
  </div>
);

class Animal extends Component {
  render() {
    return (
      <div>
        <MyContext.Consumer>
          {(context) => (
            <React.Fragment>
              <h3> Food: { context.state.food } </h3>
              <h3> Name: { context.state.name } </h3>
            </React.Fragment>
          )}
        </MyContext.Consumer>
      </div>
    )
  }
}

class App extends Component {
  render() {
    return (
      <MyProvider>
        <div>
          <Dog />
        </div>
      </MyProvider>
    )
  }
}

export default App;
```

In the code above, there is a provider, `<MyProvider />`, that houses the state and renders a Context provider. 

The Context provider provides the ability to render children components as evident in the `<App />` component. We simply called the consumer, `<MyContext.Consumer />`, in the Animal component to render the data we needed. This is more organized, and avoids the case of _props drilling hell_!

{% include asides/react.markdown %}

## Conclusion

_React 16_ has been on a roller-coaster. And it's amazing how ReactJS is becoming more of a way of life than a library, in my opinion.

Have you upgraded to _React 16.3_ yet? What are your thoughts? Let me know in the comments section! 😊
