---
layout: post
title: "rrtr is Dead. Here are Some React Router Alternatives."
description: "React Router and rrtr have reconciled. Explore React Router alternatives and learn how to use them in your apps."
date: 2016-04-19 08:30
alias: /2016/04/19/react-router-alternatives/
category: Technical Guide, Frontend, React
author:
  name: "Ado Kukic"
  url: "https://twitter.com/kukicadnan"
  mail: "ado@auth0.com"
  avatar: "https://s.gravatar.com/avatar/99c4080f412ccf46b9b564db7f482907?s=200"
design:
  bg_color: "#333333"
  image: "https://cdn.auth0.com/blog/react-router-alt/react.png"
tags:
- React
- React-Router
- rrtr
- React-Component-Router
- React-Mini-Router
- RRouter
- Universal-Router
- router5
related:
- 2016-04-13-authentication-in-golang
- 2015-09-04-an-introduction-to-microservices-part-1
- 2016-02-10-getting-started-with-lock-episode-2-using-customization-options
---

The JavaScript ecosystem, for better or worse, is in a constant state of change and disarray. From the NodeJS [fork](https://iojs.org/en/faq.html) to [io.js](https://iojs.org/en/) and later [reconciliation](https://nodejs.org/en/blog/announcements/foundation-v4-announce/) to the npm [package-gate](http://blog.npmjs.org/post/141577284765/kik-left-pad-and-npm) which broke many packages and ruined a lot of peoples day. The constant in all of this turbulence is that the JavaScript community was quick to react and resolve the issue for the better.

The latest discord comes from the popular and heavily-depended upon [**React Router**](https://github.com/reactjs/react-router) library, which provides a routing framework for applications built with React. React Router is a community project with no direct affiliation to Facebook or React but is a major dependency for many developers building React apps.

React Router was forked into [**rrtr**](https://github.com/taion/rrtr) by Jimmy Jia, a longtime contributor to the project, last week after complaints that React Router has fallen into a slow release cycle, is missing critical features and more. A few days later, the rrtr library was itself deprecated and users told to switch back to React Router. Jimmy was made an owner of the React Router project so that he could further his contributions to the project.

## React Router Alternatives

React Router is the de-facto routing library for React. In our brief post today, we'll take a look at some React Router alternatives.

{% include tweet_quote.html quote_text="React Router is the de-facto routing library for React apps." %}

### React Router Component
[**React Router Component**](https://github.com/STRML/react-router-component) is a declarative router component for React. Routes in this library are declared directly as part of your component hierarchy. Having routes defined as a part of your component hierarchy allows for dynamically reconfiguring routing based on application state. An example of the React Router Component in action:

```
var App = React.createClass({
  render: function() {
    return (
      <Locations>
        <Location path="/" handler={MainPage} />
        /* Check if user is logged in, redirect to login page if not */
        <Location path="/account/:username" logged_in={this.state.logged_in} handler={this.state.logged_in ? AccountPage : createRedirect("/login")} />
        <Location path={/\/friends\/(\d+)\/(photos|wall)/} logged_in={this.state.logged_in} handler={FriendsPage}
      matchKeys={['id', 'pageName']} />
      </Locations>
    )
  }
})
```

### React Mini Router

The [**React Mini Router**](https://github.com/larrymyers/react-mini-router) is a minimal routing library for React apps. It has few external dependencies and comes in at a tiny 4kb when gzipped. This routing library works by declaring the routes at the root level of the React app. This may be a good alternative for simple React apps. The React Mini Router library does not have pre or post hooks for routes so any logic for checking if a user is authenticated should be handled within the route itself.

```
var React = require('react'),
  RouterMixin = require('react-mini-router').RouterMixin;

var App = React.createClass({

  mixins: [RouterMixin],

  routes: {
    '/': 'home',
  },

  render: function() {
    return this.renderCurrentRoute();
  },

  home: function() {
    return <div>Hello World</div>;
  },

  notFound: function(path) {
    return <div class="not-found">Page Not Found: {path}</div>;
  }

});

module.exports = App;
```

### Universal Router

[**Universal Router**](https://www.kriasoft.com/universal-router/) provides a simple routing solution for JavaScript built apps including React. The benefits of universal router are that it uses the same middleware approach as [Express](http://expressjs.com/) which makes it very easy to pick up, learn and extend. An example of universal router in action:

```
const authorize = (state, next) => {
  // Check if user is logged in
  if (!state.isAuthenticated) {
    state.redirect = '/login'; next();
  }
}
const router = new Router(on => {
  on('*', async (state, next) => {
    const component = await next();
    return component && <App context={state.context}>{component}</App>;
  });

  on('/admin', async (state, next) => {
    // Ensure user is logged in
    authorize(state, next);
    return (
      <AdminPage />
    )
  });
})
```


### router5

[**router5**](http://router5.github.io/) is a framework agnostic routing solution that is not limited to only React. It treats routing like any other data or state and handles both route and data updates. router5 was designed for component trees which makes it a great fit for React based applications. Here is an example of router5 with React in action:

```
import Router5, { loggerPlugin } from 'router5';
const router = new Router5()
  .setOption('useHash', true)
  // .setOption('hashPrefix', '!')
  .setOption('defaultRoute', 'home')
  // Routes
  .addNode('home', '/home')
  .addNode('account', '/account', canActivate : isLoggedIn)
  .addNode('messages', '/messages', canActivate: isLoggedIn)
  // Plugins
  .usePlugin(loggerPlugin())

export default router;
```

For additional resources on router5 check out their [Github repo](https://github.com/router5/router5) and the [helper library](https://github.com/router5/react-router5) for React.

## Build Your Own React Router

If you are feeling adventurous and up for a challenge, [James K Nelson](https://twitter.com/james_k_nelson) has written a great [tutorial](http://jamesknelson.com/routing-with-raw-react/) on building your own routing solution with React. His tutorial covers a lot and is a great starting point for learning and understanding how state based routing works.

{% include asides/react.markdown %}

## Conclusion

The JavaScript community is constantly changing. Frameworks, libraries and conflicts come and go. React Router is and will likely remain the go-to routing library for React but that's not to say that there aren't great alternatives worth checking out. The co-maintainers of the React Router library have [pledged](https://medium.com/rackt-and-roll/rrtr-is-dead-long-live-react-router-ce982f6f1c10#.uc8anqeqb) to take better steps in terms of communication, release schedule and merging of pull requests for the React Router library and I'm excited to see those changes implemented.
