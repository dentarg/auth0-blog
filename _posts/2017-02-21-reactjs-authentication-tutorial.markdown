---
layout: post
title: "ReactJS Authentication Tutorial"
description: Learn how to quickly build apps with ReactJS and add authentication the right way.
date: 2017-02-21 8:30
category: Technical Guide, Frontend, ReactJS
author:
  name: Prosper Otemuyiwa
  url: https://twitter.com/unicodeveloper?lang=en
  avatar: https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200
  mail: prosper.otemuyiwa@auth0.com
design:
  bg_color: "#222425"
  image: https://cdn.auth0.com/blog/blog/React-logo.png
tags:
- reactjs
- redux
- javascript
- authentication
- web-app
- auth0
related:
- 2015-04-09-adding-authentication-to-your-react-flux-app
- 2016-01-04-secure-your-react-and-redux-app-with-jwt-authentication
- 2016-09-29-angular-2-authentication
---

---

**TL;DR:** ReactJS is a declarative, efficient and flexible JavaScript library for building user interfaces. Currently, ReactJS has over 58,000 stars on [GitHub](https://github.com/facebook/react). ReactJS makes it easy for you to build your web applications in the form of encapsulated components that manage their own state. In this tutorial, I'll show you how easy it is to build a web application with ReactJS and add authentication to it. Check out the [repo](https://github.com/auth0-blog/reactjs-authentication-tutorial) to get the code.

---

**ReactJS** is a JavaScript library, built and maintained by Facebook. It was developed by [Jordan Walke](https://twitter.com/jordwalke), a software engineer at Facebook. It was open-sourced and announced to the developer community in March 2015. Since then, it has undergone tremendous growth and adoption in the developer community. In fact, as at the time of writing, **ReactJS** is the 5th most starred project of all time on GitHub.

Currently, many web platforms use **ReactJS** to build their user interfaces. Such platforms include *Netflix*, *Instagram*, *Airbnb*, *KhanAcademy*, *Walmart* and more. The [documentation](https://facebook.github.io/react) is very detailed, and there is a vibrant community of users. In addition, a plethora of **ReactJS** addons exist on GitHub for easy inclusion in your project for whatever functionality you are trying to build.

## Understanding Key Concepts in ReactJS

**ReactJS** was influenced by **XHP**, an augmentation of [PHP](https://github.com/php/php-src) and [Hack](http://hacklang.org) to allow XML syntax for the purpose of creating custom and reusable HTML elements. If you're coming from the world of [jQuery](https://jquery.com) and don't have experience with frameworks like Angular, Ember, or VueJS, you may find **ReactJS** very confusing. There are many questions you might have to ask yourself, such as:

* Why are JavaScript and HTML together in one script?
* What is JSX? Why is the syntax so weird?
* What is a state?
* Why do we need props?
* What are and why do we need components in our apps?

Don't worry, you'll have answers to your many questions soon! There are some key concepts you need to know when learning React. Once you have a basic understanding of these concepts, then you'll be able to create your first **ReactJS** app without banging your head on the wall.

These key concepts are:

* **Components - The Types and API** 
* **Props**
* **State**
* **JSX**

I'll give a basic overview of these concepts to nourish your understanding of **ReactJS**.

### Components - The Types and API

React is basically about components. A ReactJS app is just one big component made up of interoperable smaller components. Working with ReactJS means you are thinking in components most of the time.

An example of a component is an HTML 5 tag, say `<header>`. A header can have attributes, it can be styled and also possess its own behaviour. In **ReactJS**, you'll be able to build your own custom component using [**ES6**](https://auth0.com/blog/a-rundown-of-es6-features/) like so:

```js

class CustomComponent extends React.Component {
   render() {
      return '<h3> This is my custom component!!!</h3>';
   }
}

```

So, your component will now be `<CustomComponent></CustomComponent>`.

React provides some methods that are triggered at various points from creating a component up until the component is destroyed. This is called the [Component's Lifecycle](https://facebook.github.io/react/docs/state-and-lifecycle.html). You can declare methods to hook into the component's lifecycle to control the behaviour of components in your app. Some examples of these lifecycle hooks are `componentDidMount()`, `componentWillMount()`, `componentWillUnmount()`, `shouldComponentUpdate()`, `componentWillUpdate()` and more. 

* **componentWillMount()** : This method is called before the component is initially rendered. So it is called before the `render` method is executed. You can't perform any type of DOM manipulation here because the component isn't available in the DOM yet.
* **componentDidMount()** : This method is called right after the component has been rendered. So it is called immediately after the `render` method has been executed. It's the best place to perform network and AJAX calls.
* **componentWillUnmount()** : This method is called right before the component is removed from the DOM.
* **shouldComponentUpdate()** : This method determines if a re-rendering should occur or not. It is never called on initial rendering and it's always called before the render method.
* **componentWillUpdate()** : This method is called as soon as `shouldComponentUpdate` returns true. It is called just before the component is rendered with new data.

There are also methods like [`render`](https://facebook.github.io/react/docs/rendering-elements.html) and [`setState`](https://facebook.github.io/react/docs/state-and-lifecycle.html) that you can use to render an element on the DOM and set the state of a component respectively. 

Take this example for a spin and watch how these lifecycle hooks work. Observe the sequence of logs in the browser console.

```js

import React, { Component } from 'react';
import { render } from 'react-dom';

class Experiment extends Component {

  componentWillMount() {
    console.log("This will mount");
  }

  componentDidMount() {
    console.log("This did mount");
  }

  componentWillUnmount() {
    console.log("This will unmount");
  }

  render() {
    console.log("I am just rendering like a boss");
    return <div>I got rendered!</div>;
  }
  
}

render(
  <Experiment />,
  document.getElementById("root")
);

```

### Props

`Props` is the short form for `properties`. Properties are attributes of a component. In fact, props are how components talk to each other. A tag in HTML such as `<img>` has an attribute, a.k.a `prop` called `src` that points to the location of an image.

In React, you can have two components, `FatherComponent` and `SonComponent`. Let's see how they can talk to each other.

```js

class FatherComponent extends React.Component {
   render() {
      return <SonComponent quality="eye balls" />;
   }
}

```

_FatherComponent_

```js

class SonComponent extends React.Component {
    render() {
      return <p> I am a true son. I have my father's "{ this.props.quality }" . </p>;
    }
}

```

_SonComponent_

Now, when the page is served and a `<FatherComponent>` is called, `I am a true son. I have my father's eyes` will be rendered on the page.

### State

When developing *ReactJS* applications, it is important to know when and when not to use state in components. The question now is: *When do I use state?*, *When do I use props?*  Props are data that the component depends on to render correctly. Most times, it comes from above, meaning it is passed down from a parent component to a child component. Like `props`, `state` holds information about the component but it is handled differently.For example, the number of times a button was clicked, user input from a form, etc. When state changes in a component, the component automatically re-renders and updates the DOM.

Inside a component, state is managed using a `setState` function.

```js

class Layout extends React.Component {
  constructor() {
    super();
    this.state = {
      position: "right"
    };
  }

  render() {
    return (
      { this.state.position }
    )
  }
}

```

```js

class Button extends React.Component {
  constructor() {
    super();
    this.state = {
      count: 0,
    };
  }

  updateCount() {
    this.setState((prevState, props) => {
      return { count: prevState.count + 1 }
    });
  }

  render() {
    return (
      <button onClick={() => this.updateCount()} >
        Clicked {this.state.count} times
      </button>
    );
  }
}

```

Now, this works great for simple applications like the one we'll build in this tutorial. For medium and large apps, it is recommended to use a state management library like [Redux](http://redux.js.org) or [MobX](https://github.com/mobxjs/mobx) to avoid big balls of messy code and also to help you track every event happening within your app.

### JSX

Initially, looking at JSX seems awkward. JSX is the combination of HTML and JavaScript code in the same file. You can decide to name the extension of the file `.jsx` or just `.js`. An example of JSX is:

```js

class Layout extends React.Component {
  render() {
    return <p>Hello {this.props.layoutStructure ?  'Frontend layout' : 'Backend Layout'}</p>;
  }
}

```

You can check out more [information on JSX here](https://facebook.github.io/react/docs/introducing-jsx.html).

Next, let's build an application with *ReactJS*.

## Our App: Chuck Norris World

![Chuck Norris World](https://cdn.auth0.com/blog/react/app.png)

The app we will build today is called Chuck Norris World. Our app is an eye into the world of Chuck Norris and his greatness. The Chuck Norris World app will display different jokes about the legend. A list of common food jokes will be available to the general public, while the celebrity jokes will only be accessible to registered members. 

**Note:** These days, celebrities demand a lot of cash for jokes made at their expense, and Chuck Norris isn't helping matters. Always cracking jokes about them, sigh!

## Build The Back-End

Let's build an API to serve the list of jokes to our app. We'll quickly build the API with [Node.js](https://nodejs.org). The API is simple. This is what we need:

* An endpoint to serve jokes about food - `/api/jokes/food`. 
* An endpoint to serve jokes about celebrities - `/api/jokes/celebrity`.
* Secure the endpoint that serves celebrity jokes, so that it can only be accessed by registered users.

Go ahead and fetch the [Node.js backend from GitHub](https://github.com/auth0-blog/reactjs-authentication-tutorial/tree/master/server). 

Your `server.js` should look like this:

```js

'use strict';

const express = require('express');
const app = express();
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const authCheck = jwt({
  secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        // YOUR-AUTH0-DOMAIN name e.g prosper.auth0.com
        jwksUri: "https://{YOUR-AUTH0-DOMAIN}/.well-known/jwks.json"
    }),
    // This is the identifier we set when we created the API
    audience: '{YOUR-API-AUDIENCE-ATTRIBUTE}',
    issuer: '{YOUR-AUTH0-DOMAIN}',
    algorithms: ['RS256']
});

app.get('/api/jokes/food', (req, res) => {
  let foodJokes = [
  {
    id: 99991,
    joke: "When Chuck Norris was a baby, he didn't suck his mother's breast. His mother served him whiskey, straight out of the bottle."
  },
  {
    id: 99992,
    joke: 'When Chuck Norris makes a burrito, its main ingredient is real toes.'
  },
  {
    id: 99993,
    joke: 'Chuck Norris eats steak for every single meal. Most times he forgets to kill the cow.'
  },
  {
    id: 99994,
    joke: "Chuck Norris doesn't believe in ravioli. He stuffs a live turtle with beef and smothers it in pig's blood."
  },
  {
    id: 99995,
    joke: "Chuck Norris recently had the idea to sell his urine as a canned beverage. We know this beverage as Red Bull."
  },
  {
    id: 99996,
    joke: 'When Chuck Norris goes to out to eat, he orders a whole chicken, but he only eats its soul.'
  } 
  ];
  res.json(foodJokes);
})

app.get('/api/jokes/celebrity', (req,res) => {
  let CelebrityJokes = [
  {
    id: 88881,
    joke: 'As President Roosevelt said: "We have nothing to fear but fear itself. And Chuck Norris."'
  },
  {
    id: 88882,
    joke: "Chuck Norris only lets Charlie Sheen think he is winning. Chuck won a long time ago."
  },
  {
    id: 88883,
    joke: 'Everything King Midas touches turnes to gold. Everything Chuck Norris touches turns up dead.'
  },
  {
    id: 88884,
    joke: 'Each time you rate this, Chuck Norris hits Obama with Charlie Sheen and says, "Who is winning now?!"'
  },
  {
    id: 88885,
    joke: "For Charlie Sheen winning is just wishful thinking. For Chuck Norris it's a way of life."
  },
  {
    id: 88886,
    joke: "Hellen Keller's favorite color is Chuck Norris."
  } 
  ];
  res.json(CelebrityJokes);
})

app.listen(3333);
console.log('Listening on localhost:3333');

```

_server.js_


Your `package.json` file should look like this:

```js

{
    "name": "chuck-norris-jokes",
    "version": "0.0.1",
    "description": "",
    "main": "server.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "start": "node server.js",
        "dev": "nodemon server.js"
    },
    "author": "Auth0",
    "license": "MIT",
    "dependencies": {
        "body-parser": "^1.15.2",
        "cors": "^2.8.1",
        "express": "^4.14.0",
        "express-jwt": "^3.4.0"
    }
}

```

> **Note:** Make sure you have [`nodemon`](https://github.com/remy/nodemon) installed globally.

_package.json_

Once you have cloned the project, run an `npm install`, then use [postman](https://www.getpostman.com) to serve your routes like so:

![API serving food jokes](https://cdn.auth0.com/blog/react/postman.png)
_API serving food jokes_

![API serving celebrity jokes](https://cdn.auth0.com/blog/react/postmanfood.png)
_API serving celebrity jokes_

The Food jokes endpoint should be `http://localhost:3333/api/jokes/food`.

The Celebrity jokes endpoint should be `http://localhost:3333/api/jokes/celebrity`.

Don't worry about the middleware in charge of securing our endpoint for now. We'll deal with that later. Now, let's build our frontend with ReactJS. Woot! Woot!

## Build The Front-End With ReactJS

In the early days of **ReactJS**, there was no tool or common way to set up a *ReactJS* app. However, React is more mature now; plenty of boilerplates, starters, and open source tools are currently available to help you set up an app. There is one that stands out because of its simplicity. It's called the [Create-React-App (CRA) CLI](https://github.com/facebookincubator/create-react-app) tool. It's being maintained by Facebook.

> **Note:** We have a custom React script that comes bundled with Auth0 authentication. So you can use create-react-app to boostrap an app with authentication support like this `create-react-app my-app --scripts-version auth0-react-scripts`

Go ahead and install the CRA tool globally like so:

```bash

npm install -g create-react-app

```

After installing globally, go ahead and scaffold a new **ReactJS** app like so:

```bash

create-react-app chucknorrisworld

```

Then open [`http://localhost:3000`](http://localhost:3000) to see your app.

![App recently scaffolded and showing at Localhost](https://cdn.auth0.com/blog/react/ready-app.png)

**Note:** `create-react-app` automatically invokes Yarn for installation. If you don't have Yarn installed, it falls back to use npm.

Let's check out the structure of our newly scaffolded app.

![Scaffolded App](https://cdn.auth0.com/blog/react/folder-structure.png)


```bash
my-app/
  README.md
  node_modules/ - All the packages required for the react app resides here
  package.json - File that contains the names of all the packages residing in node_modules folder
  public/
    index.html -  Index file that declares the root div where the App component is been bound to
    favicon.ico - The app’s favicon
  src/
    App.css - File that contains styles for the App component
    App.js - Basic App Component
    App.test.js - Test file that contains tests for the App Component
    index.css - File that contains style for root div
    index.js - Javascript file that binds the root div to the parent App Component
    logo.svg
```

We will work with this structure but make some few modifications. First, delete the `App.test.js` file.

**Note:** We are not writing any tests for this application. It's out of the scope of this tutorial. If you want to learn how to test your **ReactJS** applications, check out [testing react applications with Jest](https://auth0.com/blog/testing-react-applications-with-jest/).

Make the following modifications like so:

* Create a folder called `components` inside the `src` directory. This will house our components.
* Create a `CelebrityJokes.js` file inside the `components` directory. This component will take care of fetching the celebrity jokes and displaying them to the user.
* Create a `FoodJokes.js` file inside the `components` directory. This component will take care of fetching the food jokes and displaying them to the user.
* Create a `Nav.js` file inside the `components` directory. This component will be in charge of our navigation throughout the app.
* Create a folder called `utils` inside the `src` directory. This will house our helper functions.
* Delete `App.js` file. Are you surprised? Don’t worry, we won’t need it.

## Fetch the API Data

The first thing we need to do is to fetch the API data from our Node backend to display in our app. Make sure the Node server is running.

Let's create a helper file to handle fetching the API. Create a `chucknorris-api.js` file inside the `utils` directory.

Open up the file and add code to it like so:

```js

import axios from 'axios';

const BASE_URL = 'http://localhost:3333';

export {getFoodData, getCelebrityData};

function getFoodData() {
  const url = `${BASE_URL}/api/jokes/food`;
  return axios.get(url).then(response => response.data);
}

function getCelebrityData() {
  const url = `${BASE_URL}/api/jokes/celebrity`;
  return axios.get(url).then(response => response.data);
}

```
_chucknorris-api.js_

**Note:** Install `axios` in your app by running `npm install axios --save`.

We are using a very good promise based http client, [axios](https://github.com/mzabriskie/axios). An alternative for this is [superagent](https://github.com/visionmedia/superagent).

In the `getFoodData` and `getCelebrityData` functions, axios fetches data from the API endpoints. Then we do this: `export {getFoodData, getCelebrityData};` to make them ready for use in our components.

## Build the Nav Component

The `Nav.js` file is our Nav component. Go ahead and add code to it like so:

```js

import React, { Component } from 'react';
import { Link } from 'react-router';
import '../App.css';

class Nav extends Component {

  render() {
    return (
      <nav className="navbar navbar-default">
        <div className="navbar-header">
          <Link className="navbar-brand" to="/">Chuck Norris World</Link>
        </div>
        <ul className="nav navbar-nav">
          <li>
            <Link to="/">Food Jokes</Link>
          </li>
          <li>
           <Link to="/special">Celebrity Jokes</Link>
          </li>
        </ul>
        <ul className="nav navbar-nav navbar-right">
          <li><button className="btn btn-info log">Log In</button></li>
          <li><button className="btn btn-danger log">Log out </button></li>
        </ul>
      </nav>
    );
  }
}

export default Nav;

```

**Note:** Open up your terminal and install `react-router` like so: `npm install react-router@3.0.0 --save`. At the time of this writing, `react-router` is in 4.0 alpha, so you can explore its features.

The `Link` Component from `react-router` enables seamless client-side transition between routes without any page reload.

## Build the CelebrityJokes and FoodJokes Component

By default, these two components will look similar in functionalities. They both display data from different endpoints. Let's start with the `FoodJokes` component.

```js

import React, { Component } from 'react';
import { Link } from 'react-router';
import Nav from './Nav';
import { getFoodData } from '../utils/chucknorris-api';


class FoodJokes extends Component {

  constructor() {
    super()
    this.state = { jokes: [] };
  }

  getFoodJokes() {
    getFoodData().then((jokes) => {
      this.setState({ jokes });
    });
  }

  componentDidMount() {
    this.getFoodJokes();
  }

  render() {

    const { jokes }  = this.state;

    return (
      <div>
        <Nav />
        <h3 className="text-center">Chuck Norris Food Jokes</h3>
        <hr/>

        { jokes.map((joke, index) => (
              <div className="col-sm-6" key={index}>
                <div className="panel panel-primary">
                  <div className="panel-heading">
                    <h3 className="panel-title"> <span className="btn">#{ joke.id }</span></h3>
                  </div>
                  <div className="panel-body">
                    <p> { joke.joke } </p>
                  </div>
                </div>
              </div>
          ))}

        <div className="col-sm-12">
          <div className="jumbotron text-center">
            <h2>Get Access to Celebrity Jokes By Logging In</h2>
          </div>
        </div>

        <div className="col-sm-12">
            <div className="jumbotron text-center">
              <h2>View Celebrity Jokes</h2>
              <Link className="btn btn-lg btn-success" to='/special'> Celebrity Jokes </Link>
            </div>
        </div>
      </div>
    );
  }
}

export default FoodJokes;

```
_FoodJokes.js_

> **Note:** Learn why I use [`super()` in the class constructor](http://cheng.logdown.com/posts/2016/03/26/683329).

Let's analyze the code above. The `FoodJoke` component is pulling data from an API, so it needs a way of holding that data. That's where `state` comes in. In **ReactJS**, you can use `props` to pass data around and use `state` to hold/manage that data.

In the constructor, we define the initial state as seen in the code below:

```js
...
 constructor() {
    super()
    this.state = { jokes: [] };
  }
...
```

In the `getFoodJokes` method, we call the `getFoodData` method we exported from the `chucknorris-api.js` helper file and set state as seen below:

```js
...
 getFoodJokes() {
    getFoodData().then((jokes) => {
      this.setState({ jokes });
    });
  }
...
```

Now, we took advantage of one of the **ReactJS** lifecycle hooks, `componentDidMount`. Whatever is defined in this method is applied immediately after a component is mounted on the browser screen. So, we invoked the `getFoodJokes` method in the hook as seen below:

```js
...
 componentDidMount() {
    this.getFoodJokes();
  }
...
```

All we are trying to do is tell **ReactJS** to load the data from the API immediately the `FoodJokes` component gets rendered.

Finally, we rendered the component with the **ReactJS** `render` method. This is the method that does the actual rendering on the screen.  As seen in the code below, we extracted the loaded jokes from the state into a `jokes` constant. 

We looped through the `jokes` constant which is now an array to display the contents on the screen.

**Note:** In **ReactJS**, when you loop through some form of data, you have to provide the `key` property and make sure it has a unique value, else an error will be thrown!

```js
...
 const { jokes }  = this.state;
...

{ jokes.map((joke, index) => (
            <div className="col-sm-6" key={index}>
              <div className="panel panel-primary">
                <div className="panel-heading">
                  <h3 className="panel-title"> <span className="btn">#{ joke.id }</span></h3>
                </div>
                <div className="panel-body">
                  <p> { joke.joke } </p>
                </div>
              </div>
            </div>
))}

.....

````

Now, let's build the `CelebrityJokes` component in the same way:

```js

import React, { Component } from 'react';
import { Link } from 'react-router';
import Nav from './Nav';
import { getCelebrityData } from '../utils/chucknorris-api';

class CelebrityJokes extends Component {

  constructor() {
    super();
    this.state = { jokes: [] };
  }

  getCelebrityJokes() {
    getCelebrityData().then((jokes) => {
      this.setState({ jokes });
    });
  }

  componentDidMount() {
    this.getCelebrityJokes();
  }

  render() {

    const { jokes } = this.state;

    return (
      <div>
        <Nav />
        <h3 className="text-center">Privileged Chuck Norris Celebrity Jokes</h3>
        <hr/>

        { jokes.map((joke, index) => (
              <div className="col-sm-6" key={index}>
                <div className="panel panel-danger">
                  <div className="panel-heading">
                    <h3 className="panel-title"><span className="btn">#{ joke.id }</span></h3>
                  </div>
                  <div className="panel-body">
                    <p> { joke.joke } </p>
                  </div>
                </div>
              </div>
          ))}
  
        <div className="col-sm-12">
          <div className="jumbotron text-center">
            <h2>View Food Jokes</h2>
            <Link className="btn btn-lg btn-success" to='/'>Chuck Norris Food Jokes </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default CelebrityJokes;

```
_CelebrityJokes.js_

Grab your coffee at this point because you have successfully created the `Nav`, `CelebrityJokes`, and `FoodJokes` components. Whoop! Whoop!

We need to take care of one more component so that our app can function. Can you guess? Yes, the root component!

## Build the Root Component

This is the component where we get to define how routing should work in our application and also bind it to the `root` div that holds the whole app.

Open up `index.js` and add code to it like so:

```js

import React from 'react';
import ReactDOM from 'react-dom';
import CelebrityJokes from './components/CelebrityJokes';
import FoodJokes from './components/FoodJokes';
import { Router, Route, browserHistory } from 'react-router';

const Root = () => {
  return (
    <div className="container">
      <Router history={browserHistory}>
        <Route path="/" component={FoodJokes}/>
        <Route path="/special" component={CelebrityJokes}/>
      </Router>
    </div>
  )
}

ReactDOM.render(<Root />, document.getElementById('root'));

```
_index.js_

You might quickly notice that we are not defining a class here, rather we just defined a `Root` function. **ReactJS** allows you to do that. Then, we imported the Router from `react-router`.

```js
...
<Router history={browserHistory}>
  <Route path="/" component={FoodJokes}/>
  <Route path="/special" component={CelebrityJokes}/>
</Router>
...
```

The routing is simple. We have defined it to display the `FoodJokes` component once a user hits the `/` route. It displays the `CelebrityJokes` component once a user hits the `/special` route. [The Beginner's guide to react router](https://medium.com/@dabit3/beginner-s-guide-to-react-router-53094349669#.7kmmo5n9a) will give you a better understanding of how routing works in **ReactJS**.

This `ReactDOM.render(<Root />, document.getElementById('root'));` renders the root component in the `root` div, which is the starting point of our **ReactJS** application.

We imported all the required components like so:

```js
import React from 'react';
import ReactDOM from 'react-dom';
import CelebrityJokes from './components/CelebrityJokes';
import FoodJokes from './components/FoodJokes';
import { Router, Route, browserHistory } from 'react-router';

```

Just a few things before we check our application in the browser:

* Open up `public/index.html` and add [bootstrap](http://getbootstrap.com). Now the content of the html file should look like this:

{% highlight html %}

  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
      <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
      <!--
        Notice the use of %PUBLIC_URL% in the tag above.
        It will be replaced with the URL of the `public` folder during the build.
        Only files inside the `public` folder can be referenced from the HTML.

        Unlike "/favicon.ico" or "favicon.ico", "%PUBLIC_URL%/favicon.ico" will
        work correctly both with client-side routing and a non-root public URL.
        Learn how to configure a non-root public URL by running `npm run build`.
      -->
      <title>React App</title>
    </head>
    <body>
      <div id="root"></div>
      <!--
        This HTML file is a template.
        If you open it directly in the browser, you will see an empty page.

        You can add webfonts, meta tags, or analytics to this file.
        The build step will place the bundled scripts into the <body> tag.

        To begin the development, run `npm start`.
        To create a production bundle, use `npm run build`.
      -->
    </body>
  </html>

{% endhighlight %}

* Open up `App.css` and add this style like so:

{% highlight css %}

.navbar-right { margin-right: 0px !important}
.log {
  margin: 5px 10px 0 0;
}

{% endhighlight %}


Feel free to check out your application in the browser. Right now, you should have something like this:

![Homepage](https://cdn.auth0.com/blog/react/homepage.png)
_Homepage_

![Celebritypage](https://cdn.auth0.com/blog/react/celebritypage.png)
_CelebrityPage_

![Chuck Norris World Demo](https://cdn.auth0.com/blog/react/chuck_norris_world.gif)
_Current Application_


## Adding Authentication to Your ReactJS App

The majority of the apps we use on a daily basis have a means of authenticating users. I'll show you how to easily add authentication to our **ReactJS** application. We'll use [Auth0](https://auth0.com/) as our authentication service.

Auth0 allows us to issue [JSON Web Tokens (JWTs)](https://jwt.io). If you don't already have an Auth0 account, [sign up](javascript:signup\(\)) for a free one now.

Login to your Auth0 [management dashboard](https://manage.auth0.com) and let's create a new API client. If you don't already have the APIs menu item, you can enable it by going to your [Account Settings](https://manage.auth0.com/#/account/advanced) and in the **Advanced** tab, scroll down until you see **Enable APIs Section** and flip the switch.

From here, click on the APIs menu item and then the **Create API** button. You will need to give your API a name and an identifier. The name can be anything you choose, so make it as descriptive as you want. The identifier will be used to identify your API, this field cannot be changed once set. For our example, I'll name the API **Chuck Norris World API** and for the identifier I'll set it as **http://chucknorrisworld.com**. We'll leave the signing algorithm as RS256 and click on the **Create API** button.

![Creating the Chuck Norris World API](https://cdn2.auth0.com/blog/chucknorris/api.png)
_Creating the Chuck Norris World API_

Next, let's define some scopes for our API. Scopes allow us to manage access to our API. We can define as few or as many scopes as we want. For our simple example, we'll just create a single scope that will grant users full access to the API.

![Locate scopes bar](https://cdn2.auth0.com/blog/chucknorris/scopes.png)
_Locate Scopes bar_

![Adding Scope to API](https://cdn2.auth0.com/blog/chucknorris/scopealljokes.png)
_Adding scope_

### Secure The Node API

We need to secure the API so that the celebrity endpoint will only be accessible to authenticated users. We can secure it easily with Auth0.

Open up your `server.js` file and replace the `YOUR-API-AUDIENCE-ATTRIBUTE`, and `YOUR-AUTH0-DOMAIN ` variables with the audience attribute of the API, and your auth0 domain respectively. Then add the `authCheck` middleware to the celebrity endpoint like so:

```js

app.get('/api/jokes/celebrity', authCheck, (req,res) => {
  let CelebrityJokes = [
  {
    id: 88881,
    joke: 'As President Roosevelt said: "We have nothing to fear but fear itself. And Chuck Norris."'
  },
  {
    id: 88882,
    joke: "Chuck Norris only let's Charlie Sheen think he is winning. Chuck won a long time ago."
  },
  {
    id: 88883,
    joke: 'Everything King Midas touches turnes to gold. Everything Chuck Norris touches turns up dead.'
  },
  {
    id: 88884,
    joke: 'Each time you rate this, Chuck Norris hits Obama with Charlie Sheen and says, "Who is winning now?!"'
  },
  {
    id: 88885,
    joke: "For Charlie Sheen winning is just wishful thinking. For Chuck Norris it's a way of life."
  },
  {
    id: 88886,
    joke: "Hellen Keller's favorite color is Chuck Norris."
  } 
  ];
  res.json(CelebrityJokes);
})

app.listen(3333);
console.log('Listening on localhost:3333');

```

**Note:** You should load these values from environment variables for security reasons. No one should have access to your Auth0 secret.

Try accessing the `http://localhost:3333/api/jokes/celebrity` endpoint again from Postman. You should be denied access like so:

![Unauthorized Access](https://cdn.auth0.com/blog/react/unauthorized.png)
_Unauthorized Access_

Next, let's add authentication to our front-end.

### Adding Authentication to our ReactJS Front-end

We'll create an authentication service to handle everything about authentication in our app. Go ahead and create an `AuthService.js` file inside the `utils` directory.

Before we add code, you need to install `jwt-decode` and `auth0-js` node packages like so:

```bash

npm install jwt-decode auth0-js --save

```

Open up the `AuthService.js` file and add code to it like so:

```js
import decode from 'jwt-decode';
import { browserHistory } from 'react-router';
import auth0 from 'auth0-js';
const ID_TOKEN_KEY = 'id_token';
const ACCESS_TOKEN_KEY = 'access_token';

const CLIENT_ID = '{AUTH0_CLIENT_ID}';
const CLIENT_DOMAIN = 'AUTH0_DOMAIN';
const REDIRECT = 'YOUR_CALLBACK_URL';
const SCOPE = 'YOUR_SCOPE';
const AUDIENCE = 'AUDIENCE_ATTRIBUTE';

var auth = new auth0.WebAuth({
  clientID: CLIENT_ID,
  domain: CLIENT_DOMAIN
});

export function login() {
  auth.authorize({
    responseType: 'token id_token',
    redirectUri: REDIRECT,
    audience: AUDIENCE,
    scope: SCOPE
  });
}

export function logout() {
  clearIdToken();
  clearAccessToken();
  browserHistory.push('/');
}

export function requireAuth(nextState, replace) {
  if (!isLoggedIn()) {
    replace({pathname: '/'});
  }
}

export function getIdToken() {
  return localStorage.getItem(ID_TOKEN_KEY);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function clearIdToken() {
  localStorage.removeItem(ID_TOKEN_KEY);
}

function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

// Helper function that will allow us to extract the access_token and id_token
function getParameterByName(name) {
  let match = RegExp('[#&]' + name + '=([^&]*)').exec(window.location.hash);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

// Get and store access_token in local storage
export function setAccessToken() {
  let accessToken = getParameterByName('access_token');
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

// Get and store id_token in local storage
export function setIdToken() {
  let idToken = getParameterByName('id_token');
  localStorage.setItem(ID_TOKEN_KEY, idToken);
}

export function isLoggedIn() {
  const idToken = getIdToken();
  return !!idToken && !isTokenExpired(idToken);
}

function getTokenExpirationDate(encodedToken) {
  const token = decode(encodedToken);
  if (!token.exp) { return null; }

  const date = new Date(0);
  date.setUTCSeconds(token.exp);

  return date;
}

function isTokenExpired(token) {
  const expirationDate = getTokenExpirationDate(token);
  return expirationDate < new Date();
}
```

In the code above, we are using an hosted version of Auth0 Lock in the `login` method and passed in our credentials. 

The auth0 package calls the Auth0's `authorize` endpoint. With all the details we passed to the method, our client app will be validated and authorized to perform authentication. You can learn more about the specific values that can be passed to the authorize method [here](https://auth0.com/docs/libraries/auth0js/v8#login).

The parameters that you do not have yet are the `{AUTH0_CLIENT_ID}` and the `{YOUR_CALLBACK_URL}`. When you created your API, Auth0 also created a test client which you can use. Additionally, you can use any existing SPA Auth0 client found in Clients section of your [management dashboard](https://manage.auth0.com/#/clients).

Check the `Test` panel of your API from the dashboard. You'll see the test client like so:

![Chuck Norris World Client](https://cdn2.auth0.com/blog/app/chucknorrisclient.png)
_Chuck Norris World API Client_

Now, go to the clients area and check for the test client. You should see it in your list of clients like so:

![Chuck Norris World Test Client](https://cdn2.auth0.com/blog/chucknorris/testclient.png)

Open the client and change the **Client Type** to *Single Page Application*.

> Non interactive clients are meant to be used in machine to machine interactions. We are using an SPA to interact with the API so the client should be an SPA client. Check out [Implicit Grant](https://auth0.com/docs/api-auth/grant/implicit) and [client credentials exchange](https://auth0.com/docs/api-auth/grant/client-credentials) for more information.

Let's quickly go ahead to change the title of the client to `Chuck Norris World` like so:

![Client Name Change](https://cdn2.auth0.com/blog/chucknorris/clientnamechange.png)

> Changing the Client name is totally optional.

Copy the **CLIENT ID** and replace it with the value of `AUTH0_CLIENT_ID` in the variable `CLIENT_ID`. Replace your callback url with `http://localhost:3000/callback`. Don't forget to add that to the **Allowed Callback URLs** and `http://localhost:3000` to the **Allowed Origins (CORS)**. 

We also checked whether the token has expired via the `getTokenExpirationDate` and `isTokenExpired` methods. The `isLoggedIn` method returns `true` or `false` based on the presence and validity of a user `id_token`.

Finally, we implemented a middleware, the `requireAuth` method. We'll use this method to protect the `/special` route from being accessed for non-loggedIn users.

Let's go update the `Nav` component to hide/show the `login` and `logout` buttons based on the user's authentication status.

Now, your `Nav` component should look like this:

```js

import React, { Component } from 'react';
import { Link } from 'react-router';
import { login, logout, isLoggedIn } from '../utils/AuthService';
import '../App.css';

class Nav extends Component {

  render() {
    return (
      <nav className="navbar navbar-default">
        <div className="navbar-header">
          <Link className="navbar-brand" to="/">Chuck Norris World</Link>
        </div>
        <ul className="nav navbar-nav">
          <li>
            <Link to="/">Food Jokes</Link>
          </li>
          <li>
            { 
             ( isLoggedIn() ) ? <Link to="/special">Celebrity Jokes</Link> :  ''
            }
          
          </li>
        </ul>
        <ul className="nav navbar-nav navbar-right">
          <li>
           { 
             (isLoggedIn()) ? ( <button className="btn btn-danger log" onClick={() => logout()}>Log out </button> ) : ( <button className="btn btn-info log" onClick={() => login()}>Log In</button> )
           }
          </li>
        </ul>
      </nav>
    );
  }
}

export default Nav;

``` 
_Nav.js_

> **Note:** We used an arrow function to wrap and execute the onClick handlers like so: `{() => login()}` . Check out how to [handle events in react with arrow function](https://medium.com/@machnicki/handle-events-in-react-with-arrow-functions-ede88184bbb#.ekwwbituw) to understand why we used arrow functions.

We imported `login`, `logout` and `isLoggedIn` functions from the `AuthService`. Then, we attached the `login()` and `logout()` functions to the `login` and `logout` buttons respectively.

We also hid the `/special` link by checking the authentication status of the user via the `isLoggedIn()` function.

Open up the `FoodJokes` Component and modify it like so:

```js

import React, { Component } from 'react';
import { Link } from 'react-router';
import Nav from './Nav';
import { isLoggedIn } from '../utils/AuthService';
import { getFoodData } from '../utils/chucknorris-api';

class FoodJokes extends Component {

  constructor() {
    super()
    this.state = { jokes: [] };
  }

  getFoodJokes() {
    getFoodData().then((jokes) => {
      this.setState({ jokes });
    });
  }

  componentDidMount() {
    this.getFoodJokes();
  }

  render() {

    const { jokes }  = this.state;

    return (
      <div>
        <Nav />
        <h3 className="text-center">Chuck Norris Food Jokes</h3>
        <hr/>

        { jokes.map((joke, index) => (
              <div className="col-sm-6" key={index}>
                <div className="panel panel-primary">
                  <div className="panel-heading">
                    <h3 className="panel-title"> <span className="btn">#{ joke.id }</span></h3>
                  </div>
                  <div className="panel-body">
                    <p> { joke.joke } </p>
                  </div>
                </div>
              </div>
          ))}

        <div className="col-sm-12">
          { isLoggedIn() ?
          <div className="jumbotron text-center">
            <h2>View Celebrity Jokes</h2>
            <Link className="btn btn-lg btn-success" to='/special'> Celebrity Jokes </Link>
          </div> : <div className="jumbotron text-center"><h2>Get Access to Celebrity Jokes By Logging In</h2></div>
          }
        </div>
      </div>
    );
  }
}

export default FoodJokes;

```

We are enabling the link to celebrity jokes based on the login status of a user via the `isLoggedIn()` method.

### Add A Callback Component

We will create a new component and call it `Callback.js`. This component will be activated when the `localhost:3000/callback` route is called and it will process the redirect from Auth0 and ensure we received the right data back after a successful authentication. The component will store the `access_token` and `id_token`.

_Callback.js_

```js

import { Component } from 'react';
import { setIdToken, setAccessToken } from '../utils/AuthService';

class Callback extends Component {

  constructor() {
    super()
  }

  componentDidMount() {
    setAccessToken();
    setIdToken();
    window.location.href = "/";
  }

  render() {
    return null;
  }
}

export default Callback;

```

Once a user is authenticated, Auth0 will redirect back to our application and call the `/callback` route. Auth0 will also append the `id_token` as well as the `access_token` to this request, and our Callback component will make sure to properly process and store those tokens in localStorage. If all is well, meaning we received an `id_token`, and `access_token`, we will be redirected back to the `/` page and will be in a logged-in state.

### Add some values to Auth0 Dashboard

Just before you try to log in or sign up, head over to your [Auth0 dashboard](https://manage.auth0.com/#/) and add `http://localhost:3000/callback` to the **Allowed Callback URLs** and `http://localhost:3000` to **Allowed Origins (CORS)**.

### Secure The Special Route

We need to ensure that no one can go to the browser and just type `/special` to access the celebrity route.

Open up `index.js` and add an `onEnter` prop with a value of `requireAuth` to the `/special` route like so:

```js
....
....
import { requireAuth } from './utils/AuthService';

const Root = () => {
  return (
    <div className="container">
      <Router history={browserHistory}>
        <Route path="/" component={FoodJokes}/>
        <Route path="/special" component={CelebrityJokes} onEnter={requireAuth} />
      </Router>
    </div>
  )
}

```
_index.js_

Just one more thing before we test the app. Register the `/callback` route in the routes file like so:

```js
import React from 'react';
import ReactDOM from 'react-dom';
import CelebrityJokes from './components/CelebrityJokes';
import FoodJokes from './components/FoodJokes';
import Callback from './components/Callback';
import { Router, Route, browserHistory } from 'react-router';
import { requireAuth } from './utils/AuthService';

const Root = () => {
  return (
    <div className="container">
      <Router history={browserHistory}>
        <Route path="/" component={FoodJokes}/>
        <Route path="/special" component={CelebrityJokes} onEnter={requireAuth} />
        <Route path="/callback" component={Callback} />
      </Router>
    </div>
  )
}

ReactDOM.render(<Root />, document.getElementById('root'));

```

Now, try to log in.

![Lock Login Widget](https://cdn2.auth0.com/blog/chucknorris/loginbox.png)
_Hosted Lock Login Widget_

For the first time, the user will be shown a user consent dialog that will show the scope available. Once a user authorizes, it goes ahead to login the user and give them access based on the scopes.

![User consent dialog](https://cdn2.auth0.com/blog/chucknorris/clientconsent.png)
_User presented with an option to authorize_

**Note:** Since we are using `localhost` for our domain, once a user logs in the first time, subsequent logins will not need a user consent authorization dialog. This consent dialog will not be displayed if you are using a non-localhost domain, and the client is a first-party client.

![Logged In and Unauthorized to see the celebrity content](https://cdn2.auth0.com/blog/chucknorris/unauthorized.png)
_Logged In, but unauthorized to see the celebrity content_


Oops! We have successfully logged in but the content of the celebrity jokes is not showing up and in the console, we are getting a `401 Unauthorized` error. Why?

It's simple! We secured our endpoint earlier, but right now we are not passing the `access_token` to the backend yet. We need to send the access token along with our request as a header to enable the secured endpoint's recognition of the logged-in user.

### Updating the ChuckNorris API helper

Go ahead and open up the `utils/chucknorris-api.js` file. We will tweak the `getCelebrityData` function a bit. Currently, it initiates a `GET` request only to fetch data from the API.

Now, we will pass an option to send an `Authorization` header with a Bearer access token along with the `GET` request like so:

```js
...
import { getAccessToken } from './AuthService';


function getCelebrityData() {
  const url = `${BASE_URL}/api/jokes/celebrity`;
  return axios.get(url, { headers: { Authorization: `Bearer ${getAccessToken()}` }}).then(response => response.data);
}

```

The `/api/jokes/celebrity` endpoint will receive the token in the header and validate the user. If it is valid, the content will be provided to us.

Now, try to log in again. 

![Working Chuck Norris World App](https://cdn.auth0.com/blog/react/working_chuck_norris_app.gif)
_Working Chuck Norris World App_

Everything is working fine. Pat yourself on the back. You have just successfully built a **ReactJS** app and added authentication to it! 

## Conclusion

**ReactJS** is an awesome front-end library to employ in building your user interfaces. It takes advantage of the Virtual DOM, it is fast and it has a bubbling community. There are several React plugins/addons that the community provides to allow you do almost anything in **ReactJS**. 

In addition, Auth0 can help secure your **ReactJS** apps with more than just username-password authentication. It provides features like [multifactor auth](https://auth0.com/docs/multifactor-authentication), [anomaly detection](https://auth0.com/docs/anomaly-detection), [enterprise federation](https://auth0.com/docs/identityproviders), [single sign on (SSO)](https://auth0.com/docs/sso), and more. [Sign up](javascript:signup\(\)) today so you can focus on building features unique to your app.
