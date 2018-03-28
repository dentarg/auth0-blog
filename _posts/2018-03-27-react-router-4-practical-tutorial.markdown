---
layout: post
title: "React Router 4: A Practical Introduction"
description: "A gentle introduction to React Router 4 through practical examples."
longdescription: "React Router 4 uses declarative approach to routing. In this tutorial, you'll learn how to use React Router 4 in your web projects via practical examples."
date: 2018-03-27 8:30
category: Technical Guide, JavaScript, React
design:
  bg_color: "#1A1A1A"
  image: https://cdn.auth0.com/blog/reactjs16/logo.png
author:
  name: Prosper Otemuyiwa
  url: http://twitter.com/unicodeveloper?lang=en
  mail: prosper.otemuyiwa@auth0.com
  avatar: https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200
tags:
- redux
- node
- javascript
- react
- react-router-4
- react-router
- declarative
- routing
related:
- 2017-11-16-spring-5-embedded-tomcat-8-gradle-tutorial
- 2017-02-21-reactjs-authentication-tutorial
- 2017-10-26-whats-new-in-react16
---

**TL;DR:** **React Router 4** is a body of navigational components that offers declarative routing in your React apps. In this tutorial, you are going to learn how to use React Router 4 through practical examples.

---

Routing is of uttermost importance in almost every application's architecture. The larger your app becomes, the more your routing functionality becomes complex, from simple to deeply nested routing scenarios.

[React Router](https://github.com/ReactTraining/react-router) is the most popular and commonly used library for routing in React applications. As your application grows to require several views and routes, it's ideal you choose a good router to help manage the transition between views, redirects, getting URL parameters easily, et al.

{% include tweet_quote.html quote_text="React Router is the most popular and commonly used library for routing in React applications. " %}

Before now, previous versions of React Router involved declaring your app's routes upfront, declaring all the routes in a file as part of your app's initialization before rendering occurs. With **React Router 4**, you get to route declaratively. React Router 4's API is basically just components thus making it easy to use if you already compose components in React. Let's dive in!

## Setup and Installation

You'll need:

* [Node.js](https://nodejs.org/en/) (version 6.0 or greater) and [npm](https://www.npmjs.com/get-npm).
* [create-react-app](https://github.com/facebook/create-react-app) for bootstrapping a new project.

React Router is composed of these packages: `react-router`, `react-router-dom`, and `react-router-native`.

* **react-router:** comprises of the core routing components.
* **react-router-dom:** comprises of the routing API required for browsers.
* **react-router-native:** comprises of routing API for mobile applications.

Create a new project with _create_react_app_ and navigate to the directory created as shown below:

```bash
create-react-app bose
cd bose
```

Install `react-router-dom`.

```bash
npm install --save react-router-dom
```

## What we'll cover

We'll focus on using React Router 4 for the browser. We'll cover the very important concepts listed below:

* Basic Routing
* Nested Routing and URL Parameters
* Route Protection and Authentication
* Link Component Customization
* Handling Non-existent Routes
* SideBar Rendering


### Basic Routing

There are two types of Router components that you can use in your React web application. The `BrowserRouter` and `HashRouter`. The former gives you a URL without the `#`, while the latter gives you a URL with the `#`.

> **Note:** If you are building a web application that supports legacy browsers, it's recommended that you use the `HashRouter`.

Open up your `src/index.js` and add the code below to it:

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Router>
    <App />
  </Router>, document.getElementById('root'));
registerServiceWorker();
```

In the code above, I imported the `BrowserRouter`, `Route`, and `Link` component from `react-router-dom`. And I wrapped the `<App/>` component with `Router` which is the alias of `BrowserRouter`. The Router component is the first step to routing successfully. It serves as the container for every other route component. Furthermore, the Router component can only have one child element or component. Now, how do we define our routes?

Open up `src/App.js`. Here, we will define our routes.

```js
import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import './App.css';


const Home = () => (
  <div>
    <h2> Home </h2>
  </div>
);

const Airport = () => (
  <div>
     <ul>
      <li>Jomo Kenyatta</li>
      <li>Tambo</li>
      <li>Murtala Mohammed</li>
    </ul>
  </div>
);

const City = () => (
  <div>
    <ul>
      <li>San Francisco</li>
      <li>Istanbul</li>
      <li>Tokyo</li>
    </ul>
  </div>
);

class App extends Component {
  render() {
    return (
      <div>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/airports">Airports</Link></li>
          <li><Link to="/cities">Cities</Link></li>
        </ul>

        <Route path="/" component={Home}/>
        <Route path="/airports" component={Airport}/>
        <Route path="/cities" component={City}/>
      </div>
    );
  }
}

export default App;
```

In the code above, we have links that should direct the user to `/`, `/airports`, and `cities` using the `<Link>` component. Each of these links has a component that should be rendered once the current location matches the route's path. However, something is off here. Let's check the results.

![Airports route](https://cdn.auth0.com/blog/reactrouter4/notexact.png)
_Airports route_

`Home` which is the UI for `Home` component should be rendered only on the `/`, root route. However, it is rendered on all the routes. The `/` matches `/airports` and `/cities` routes, therefore rendering its component in these two other routes. The solution to this is to simply add the `exact` prop to the `/` route.

_src/App.js_

```js
<Route path="/" exact component={Home}/>
<Route path="/airports" component={Airport}/>
<Route path="/cities" component={City}/>
```

![Airports route with exact component rendering](https://cdn.auth0.com/blog/reactrouter4/exact.png)
_The Airports route without rendering Home component UI_

In the examples above, all the `<Route />` components have a `component` prop that renders a component when the URL visited matches the Route's path. What if you just want to render a small function instead of a whole component? You can use the `render` prop as shown in the code below.

```js
<Route path="/airports" 
       render={() => (<div> This is the airport route </div>)}/>
```

### Nested Routing & URL Parameters

What if you needed URLs like `/courses/business`, and  `/courses/technology/`? How would you accomplish this?

_src/App.js_

```js
import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import './App.css';


const Courses = ({ match }) => (
  <div>
     <ul>
        <li><Link to="/courses/technology">Technology</Link></li>
        <li><Link to="/courses/business">Business</Link></li>
        <li><Link to="/courses/economics">Economics</Link></li>
    </ul>


    <Route exact path="/courses/technology" render={() => (<div> This is technology </div>)}/>
    <Route path="/courses/business" component={() => (<div> This is business </div>)}/>
    <Route path="/courses/economics" component={() => (<div> This is economics </div>)}/>
  </div>
);

/* Home Component */ // code hidden

/* City Component */ //code hidden

class App extends Component {
  render() {
    return (
      <div>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/courses">Courses</Link></li>
          <li><Link to="/cities">Cities</Link></li>
        </ul>

        <Route path="/" exact component={Home}/>
        <Route path="/courses" component={Courses}/>
        <Route path="/cities" component={City}/>
      </div>
    );
  }
}

export default App;
```

If the URL location matches the `/courses` path, then the technology, business, and economics links are rendered via the `Courses` component. Going one step further, if the URL location matches `/courses/technology`, `/courses/business`, and `/courses/economics` path, then `This is technology`, `This is business`, and `This is economics` are rendered respectively.


As a developer, I'm sure you are already looking at this approach with a set of refactoring eyes. In the code sample above, there's a lot of repetition and hardcoding. The more the lines of code, the harder it becomes to change a route. Let's refactor.

React Router 4 ships with a `match` API. The `match` object is created when a router's path and URL location successfully matches. The `match` object has some properties but I'll outline the properties you should immediately know about:

* **match.url:** returns a string that shows the URL location. Used for <Link>s
* **match.path:** returns a string that shows the route's path. Used for <Route>s
* **match.params:** returns an object with values parsed from the URL.

Let's refactor step by step. Refactor the Courses component to have the `match` object like so:

```js
const Courses = ({ match }) => (
  <div>
     <ul>
        <li><Link to={`${match.url}/technology`}>Technology</Link></li>
        <li><Link to={`${match.url}/business`}>Business</Link></li>
        <li><Link to={`${match.url}/economics`}>Economics</Link></li>
    </ul>

    <Route exact path="/courses/technology" render={() => (<div> This is technology </div>)}/>
    <Route path="/courses/business" component={() => (<div> This is business </div>)}/>
    <Route path="/courses/economics" component={() => (<div> This is economics </div>)}/>
  </div>
);
```

Test if your URLs are working. Now do the same for the routes but with `match.path`.

```js
const Courses = ({ match }) => (
  <div>
     <ul>
        <li><Link to={`${match.url}/technology`}>Technology</Link></li>
        <li><Link to={`${match.url}/business`}>Business</Link></li>
        <li><Link to={`${match.url}/economics`}>Economics</Link></li>
    </ul>

    <Route exact path={`${match.path}/technology`} render={() => (<div> This is technology </div>)}/>
    <Route path={`${match.path}/business`} component={() => (<div> This is business </div>)}/>
    <Route path={`${match.path}/economics`} component={() => (<div> This is economics </div>)}/>
  </div>
);
```

Check your app. Everything should work fine. Now one last step. We can actually replace those three lines of `<Route>` code with just one line.

```js
const Courses = ({ match }) => (
  <div>
     <ul>
        <li><Link to={`${match.url}/technology`}>Technology</Link></li>
        <li><Link to={`${match.url}/business`}>Business</Link></li>
        <li><Link to={`${match.url}/economics`}>Economics</Link></li>
    </ul>

    <Route exact path={`${match.path}/:course`} render={({match}) => (<div> This is {match.params.course} </div>)}/>
  </div>
);
```

We used the `match.params` which provides a key/value object of the URL location. `:course` is the URL param. Therefore, `match.params.course` will provide the value of the correct URL location. Awesome!

### Route Protection and Authentication

When developing web applications, there are scenarios where certain routes have to be protected from access. Most times, these routes can only be accessed by authorized users.

In previous versions of React Router such as v3, route protection code looks like this:

_index.js_

```js
const Root = () => {
  return (
    <div className="container">
      <Router history={browserHistory}>
        <Route path="/" component={Display}/>
        <Route path="/upload" component={Upload} onEnter={requireAuth} />
        <Route path="/callback" component={Callback} />
      </Router>
    </div>
  )
}
```

The `<Route/>` component had a `onEnter` prop that accepts a method that allows entry or refusal to a URL location based on a user's authentication status. Now, it's different for React Router 4.

Let's build out three components, `Public`, `Private`, and `Login`.

_App.js_

{% highlight html %}
{% raw %}

import React, { Component } from 'react';
import {
  Route,
  Link,
  BrowserRouter as Router,
} from 'react-router-dom';

const Public = () => (
  <div> This is a public page </div>
);

const Private = () => (
  <div> This is a private page </div>
);

const Login = () => (
  <div> Login Page <button>login</button> </div>
);



class App extends Component {
  render() {
    return (
      <Router>
        <div style={{width: 1000, margin: '0 auto'}}>
          <ul>
            <li><Link to='/public'> Public </Link></li>
            <li><Link to='/private'> Private </Link></li>
          </ul>

          <hr/>

          <Route path='/public' component={Public} />
          <Route path='/private' component={Private} />
        </div>
      </Router>
    );
  }
}
export default App;
{% endraw %}
{% endhighlight %}

Right now, we can access both routes, `/public`, and `/private`. Now, let's make sure the `/private` route can't be accessed until a user is logged in. React Router 4 uses a declarative approach, so it's convenient that we have a component such as `<SecretRoute />` that we can use. However, the react router 4 library doesn't provide it. We'll build it. But let's come up with an Auth Service.

In this example, the Auth Service will simply be an object like so:

```js
const AuthService = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true
    setTimeout(cb, 100)
  },
  logout(cb) {
    this.isAuthenticated = false
    setTimeout(cb, 100)
  }
}
```

Now, let's build the `<SecretRoute />` like so:

```js
const SecretRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    AuthService.isAuthenticated === true
      ? <Component {...props} />
      : <Redirect to='/login' />
  )} />
);
```
_SecretRoute component_

The code above simply illustrates that if the authentication status of the user is true, then a component would be rendered else the user would be redirected to the `/login` route. Let's try it out.

_App.js_

{% highlight html %}
{% raw %}

import React, { Component } from 'react';
import {
  Route,
  Link,
  Redirect,
  BrowserRouter as Router,
} from 'react-router-dom';

const Login = () => (
  <div> Login Page <button>login</button> </div>
);

const AuthService = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true
    setTimeout(cb, 100)
  },
  logout(cb) {
    this.isAuthenticated = false
    setTimeout(cb, 100)
  }
};

const SecretRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    AuthService.isAuthenticated === true
      ? <Component {...props} />
      : <Redirect to='/login' />
  )} />
);

class App extends Component {
  render() {
    return (
      <Router>
        <div style={{width: 1000, margin: '0 auto'}}>
          <ul>
            <li><Link to='/public'> Public </Link></li>
            <li><Link to='/private'> Private </Link></li>
          </ul>

          <hr/>

          <Route path='/public' component={Public} />
          <SecretRoute path='/private' component={Private} />
        </div>
      </Router>
    );
  }
}

export default App;
{% endraw %}
{% endhighlight %}

When you click on the `Private` link, you are redirected back to `/login` route. Great! Let's take it a step further by trying to actually log in and log out. Modify the login component like so:

_App.js_

```js
...
class Login extends React.Component {
  state = {
    redirectToPreviousRoute: false
  };

  login = () => {
    AuthService.authenticate(() => {
      this.setState({ redirectToPreviousRoute: true });
    });
  };

  render() {
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    const { redirectToPreviousRoute } = this.state;

    if (redirectToPreviousRoute) {
      return <Redirect to={from} />;
    }

    return (
      <div>
        <p>You must log in to view the page at {from.pathname}</p>
        <button onClick={this.login}>Log in</button>
      </div>
    );
  }
}
```

We have modified the Login Component to be able to have a `login` function and also redirect back to the route that the user was trying to log onto when the user was denied access. This should be typical behavior of your routing system else users will always be redirected to a particular page rather than where they came from!

Now, we'll have to modify the props of the `<Redirect />` component in `<SecretRoute />`.

_App.js_

{% highlight html %}
{% raw %}

const SecretRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    AuthService.isAuthenticated === true
      ? <Component {...props} />
      : <Redirect to={{
          pathname: '/login',
          state: { from: props.location }
        }} />
  )} />
);

{% endraw %}
{% endhighlight %}

We are almost done. However, wouldn't it be nice if we can provide a logout button for the user after successful authentication? Let's create an `<AuthStatus />` component.

_App.js_

```js
...
const AuthStatus = withRouter(({ history }) => (
  AuthService.isAuthenticated ? (
    <p>
      Welcome! <button onClick={() => {
        AuthService.logout(() => history.push('/'))
      }}>Sign out</button>
    </p>
  ) : (
    <p>You are not logged in.</p>
  )
));
```

In the above code sample, we used `withRouter` and `history.push`. `withRouter` is a higher order component from React Router that allows re-rendering of its component every time the route changes with the same props. `history.push` is one way of redirecting asides using the `<Redirect />` component from React Router.

Now, go ahead and render the `<AuthStatus />` component.

_App.js_

{% highlight html %}
{% raw %}

class App extends Component {
  render() {
    return (
      <Router>
        <div style={{width: 1000, margin: '0 auto'}}>
          <AuthStatus />
          <ul>
            <li><Link to='/public'> Public </Link></li>
            <li><Link to='/private'> Private </Link></li>
          </ul>

          <hr/>

          <Route path='/public' component={Public} />
          <Route path="/login" component={Login}/>
          <SecretRoute path='/private' component={Private} />
        </div>
      </Router>
    );
  }
}

{% endraw %}
{% endhighlight %}

Now, try it in the browser again. You should be able to log in and log out successfully!

### Link Component Customization

Link Component Customization? What's that? It's simple. You'll learn how to customize your links to have a distinctive look when a particular link is active. React Router 4 has an easy way of accomplishing this task.

Have the code below in your `App.js` like so:

```js
import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'


const Home = () => (
  <div>
    <h2>Home Page</h2>
  </div>
)

const Contact = () => (
  <div>
    <h2>Contact Page</h2>
  </div>
)

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
            <CustomLink exact={true} to="/">
              Home
            </CustomLink>
            <CustomLink to="/contact">
              Contact
            </CustomLink>

          <hr/>

          <Route exact path="/" component={Home}/>
          <Route path="/contact" component={Contact}/>
        </div>
      </Router>
    )
  }
}

export default App;
```

The `<CustomLink />` is in charge of making the active link distinct. Now, what makes up the`<CustomLink />` component? Check out the code below:

```js
const CustomLink = ({ children, to, exact }) => (
  <Route path={to} exact={exact} children={({ match }) => (
    <div className={match ? 'active' : ''}>
      {match ? '> ' : ''}
      <Link to={to}>
        {children}
      </Link>
    </div>
  )}/>
);
```

It's not complex. The `<CustomLink>` harnessed the power of `<Route>`. In the code above, it uses the `match` object to determine whether to add `>` symbol whenever the path matches the URL location. 

There are 3 ways to render something with a `<Route>`; `<Route component>`, `<Route render>`, and `<Route children>`.  The code above used the `children` prop. This render prop takes in a function that receives all the same route props as the `component` and `render` methods, except when a route doesn't match the URL location. This process gives you the power to dynamically adjust your UI based on whether or not the route matches. And that's all we need to create a custom Link!

### Handling Non-existent Routes

As a developer, you need to handle scenarios where certain routes don't exist. If a user stumbles upon your site and visits a non-existent route such as `/babalawo`. What do you do? Do you just allow your site to break?

This is how to handle this scenario. Add code to your `App.js` like so:

_App.js_

```js
import React, { Component } from 'react';
import {
  Route,
  Link,
  Redirect,
  Switch,
  BrowserRouter as Router,
} from 'react-router-dom';

const Home = () => (
  <div>
    <h2>Home Page</h2>
  </div>
)

const Contact = () => (
  <div>
    <h2>Contact Page</h2>
  </div>
)

class App extends Component {
  render() {
    return (
       <Router>
        <div>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>

        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/contact" component={Contact}/>
          <Route render={() => (<div> Sorry, this page does not exist. </div>)} />
        </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
```

In the code above, we imported a new component, `<Switch />` from React Router. And we wrapped our routes inside the `<Switch />` component. Now, if none of the URLs visited matches the routes defined with a path, then the `<Switch />` component invokes the `<Route />` with no path and a render function. 

Try it out in your browser. Visit a URL that doesn't exist. Your app will display a `Sorry, this page does not exist` message.

### SideBar Rendering

Sidebars in apps have been in existence for a very long time. Let's learn how to make a sidebar using React Router 4. The first step is to throw our routes into an array like so:

{% highlight html %}
{% raw %}

import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom'

const routes = [
  { path: '/',
    exact: true,
    leftbar: () => <div>Home</div>,
    main: () => <h2>Home</h2>
  },
  { path: '/about',
    leftbar: () => <div>About</div>,
    main: () => <h2>About</h2>
  },
  { path: '/contact',
    leftbar: () => <div>Contact</div>,
    main: () => <h2>Contact</h2>
  }
]

class App extends React.Component {
  render() {
    return (
      <Router>
        <div style={{ display: 'flex' }}>
          <div style={{
            padding: '10px',
            width: '40%',
            background: '#FF6347'
          }}>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>

          </div>
        </div>
      </Router>
    )
  }
}

export default App

{% endraw %}
{% endhighlight %}


In the code above, we have a `leftbar` and a `main` key. They'll come in handy soon and make our work super easy. 

Now, all we need to do is map over the routes array as shown in the code below:

_App.js_

{% highlight html %}
{% raw %}

render() {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <div style={{
          padding: '10px',
          width: '40%',
          background: '#FF6347'
        }}>
          <ul style={{ listStyleType: 'none' }}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              exact={route.exact}
              component={route.leftbar}
            />
          ))}
        </div>

        <div style={{ flex: 1, padding: '20px' }}>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              exact={route.exact}
              component={route.main}
            />
          ))}
        </div>
      </div>
    </Router>
  )
}

{% endraw %}
{% endhighlight %}

In the code above, whenever the route's path matches the URL location, the leftbar component will be rendered. Try it out in your browser and see your left sidebar in action!

{% include asides/react.markdown %}

## Conclusion

Understanding React Router 4 requires a shift in your mental model of routing. I covered the main API concepts for using React Router 4 for the web in this tutorial. However, you can always consult the [official documentation](https://reacttraining.com/react-router/web) for more information.

{% include tweet_quote.html quote_text="Understanding React Router 4 requires a shift in your mental model of routing." %}
