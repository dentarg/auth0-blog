---
layout: post
title: "Preact Authentication Tutorial"
description: Preact is a fast 3kb React alternative with the same ES6 API. Learn how to build fast apps with Preact and add authentication the right way.
date: 2017-05-30 8:30
category: Technical Guide, Frontend, Preact
author:
  name: Prosper Otemuyiwa
  url: https://twitter.com/unicodeveloper?lang=en
  avatar: https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200
  mail: prosper.otemuyiwa@auth0.com
design:
  bg_color: "#222425"
  image: https://cdn.auth0.com/blog/blog/React-logo.png
tags:
- preact
- pwa
- javascript
- authentication
- singlepageapp
- auth0
related:
- 2017-05-11-emberjs-authentication-tutorial
- 2016-01-04-reactjs-authentication-tutorial
- 2016-09-29-angular-2-authentication
---

---

**TL;DR:** Preact is a JavaScript library that offers a fast 3kb alternative to React with the same ES6 API. Currently, Preact has over 9,000 stars on [GitHub](https://github.com/developit/preact). Preact gives the developer an edge to build super fast JavaScript web applications without the constant headache of performance improvement because of its lightweight footprint. In this tutorial, I'll show you how easy it is to build a web application with Preact and add authentication to it. We'll also compare the speed of this application with its [ReactJS equivalent](https://github.com/auth0-blog/reactjs-authentication-tutorial). Check out the [repo](https://github.com/auth0-blog/preact-authentication-tutorial) to get the code.

---

**Preact** is a JavaScript library, built and maintained by [Jason Miller](https://twitter.com/_developit). It has tremendously gained a lot of attention in the JavaScript community in the past one year. In addition, it was mentioned in [Addy Osmani's talk](https://www.youtube.com/watch?v=aCMbSyngXB4) at Google I/O 2017. **Preact** recently dabbled into the Progressive Web Apps community by launching a [cli](https://github.com/developit/preact-cli) that provisions a new Preact [Progressive Web App](https://auth0.com/blog/introduction-to-progressive-apps-part-one) in 30 seconds. Whoop! Whoop!

**Preact** supports modern browsers and IE9+. And there is a growing community of [Preact](https://preact-slack.now.sh) users. A plethora of **Preact** libraries and addons exist on [GitHub](https://github.com/developit/preact/#libraries--add-ons) for easy inclusion in your project for whatever functionality you are trying to build.

## Understanding Key Concepts in Preact

When I initially came across **Preact**, I asked myself one question: *Why do we need another React implementation?* I couldn't come to terms with the fact that it promised a smaller and faster alternative to ReactJS with the same API. Hold on a second! *The same API?* You mean I don't need to relinquish my ReactJS superpowers just to learn how Preact works? I went through the documentation a second time and a bunch of questions magically strolled in to my brain.

* Is Preact really that fast?
* Is Jason trying to sell his open source project to the public by throwing in the *fast* slogan?
* Compared to ReactJS, does the user experience a significant difference in the speed of the web app?

Don't worry, you'll have answers to my questions soon! If you are new to *ReactJS*, I'll advise you check out this [excellent ReactJS tutorial](https://auth0.com/blog/reactjs-authentication-tutorial). If you already know *ReactJS*, then you need to know what makes *Preact* stand out in the list of JavaScript UI frameworks.

The key concepts in Preact are virtually thesame with ReactJS and I covered them [extensively here](https://auth0.com/blog/reactjs-authentication-tutorial). Let's quickly go over a few similarities.

> **Note**: Preact is to a large extent a petite version of React. In fact the P in Preact stands for `petite`.

{% include tweet_quote.html quote_text="Preact is to a large extent a petite version of React. In fact the P in Preact stands for petite." %}

* The Lifecycle methods in Preact are the same with ReactJS.
* Working with [Forms](https://preactjs.com/guide/forms) in Preact is really no different from [ReactJS](https://facebook.github.io/react/docs/forms.html) except for non-existent support for static props.
* Classical components and stateless functional components exist in both frameworks.

<blockquote class="twitter-tweet" data-partner="tweetdeck"><p lang="en" dir="ltr">this is <a href="https://twitter.com/notwaldorf">@notwaldorf</a>&#39;s fault</p>&mdash; Jason Miller 🦊⚛ (@_developit) <a href="https://twitter.com/_developit/status/870274885213458433">June 1, 2017</a></blockquote>

Next, let's go over the differences between Preact and ReactJS.

### Differences between Preact and ReactJS

There are trivial differences between Preact and ReactJS. Although, using [preact-compat](https://github.com/developit/preact-compat) attempts to achieve 100% compatibility with React.

* *No PropType Validation*: With preact-compat, you can include PropType support in your app.
* [React.children](https://facebook.github.io/react/docs/react-api.html#react.children) is not supported in Preact. With preact-compat, you can use it.
* In Preact, the `render()` method accepts a third argument. This argument is the root node to replace or append.
* Preact components don't implement `contextTypes` or `childContextTypes`.
* In Preact, you can simply use `class` for CSS classes. You want to go the *ReactJS* way? No problem. *className* is supported.
* In place of using `React.createElement`, Preact offers an `h()` function that turns your JSX into Virtual DOM elements.
* *props* and *state* are passed as arguments to the `render` method in Preact. This allows for automatic destructuring of props and state into local variables to be referenced from JSX. Check this out:

    ```js
    import { h, render, Component } from 'preact';

    class Food extends Component {
        state = { desert: 'custard', appetizer: 'french fries' };

        componentDidMount() {
          ...
        }

        componentWillUnmount() {
          ...
        }

        render(props, state) {
          return <span> { state.desert } </span>;
        }
    }

    // render an instance of Food into <body>:
    render(<Food />, document.body);
    ```

    ```js
    import { render, Component } from 'preact';

    class Unite extends Component {
        render(props, state) {
            return <a href={props.href}>{ props.children }</a>;
        }
    }
    ```

    This component can now be rendered as:

    {% highlight html %}
    {% raw %}
    <Unite href="http://preact.com">Preact</Unite>
    {% endraw %}
    {% endhighlight %}

* Preact renders components asynchronously for `state` changes and synchronously for `props` changes.
* In ReactJS, updating state in response to events involved doing something like this:

    ```js
    import { render, Component } from 'preact';

    class Food extends Component {
        handleChange = e => {
            this.setState({ text: e.target.value });
        }

        render({ }, { text }) {
            return <input value={text} onInput={this.handleChange} />;
        }
    }
    ```

Meanwhile, Preact handles this better with **Linked State** that involves lesser code like this:

    ```js
    import { render, Component } from 'preact';
    import linkState from 'linkstate';

    class Food extends Component {
        render({ }, { text }) {
            return <input value={text} onInput={linkState(this, 'text')} />;
        }
    }
    ```

The `linkState()` function handles linking state from any input type and automatically derives the appropriate value from an event. More information on [Linked State](https://preactjs.com/guide/linked-state) here.

## Performance

I used [preact-perf](https://developit.github.io/preact-perf/) to run tests with different JavaScript frameworks for a Todo app, and this was the result below:

![Benchmark](https://cdn.auth0.com/blog/preact/benchmark.png)
_Preact and other JavaScript frameworks_

Wow, so **Preact** is really that fast. Sorry for doubting you Jason!

After building our app, we'll check out the app size and compare it with its ReactJS equivalent. Stay tuned!

Next, let's re-write the [Chuck Norris World app](https://github.com/auth0-blog/reactjs-authentication-tutorial) we built with ReactJS in **Preact**.

## Our App: Chuck Norris World

![Chuck Norris World](https://cdn.auth0.com/blog/react/app.png)

The app we will build today is called Chuck Norris World. Our app is an eye into the world of Chuck Norris and his greatness. The Chuck Norris World app will display different jokes about the legend. A list of common food jokes will be available to the general public, while the celebrity jokes will only be accessible to registered members.

## Build The Back-End

Let's build an API to serve the list of jokes to our app. We'll quickly build the API with [Node.js](https://nodejs.org). The API is simple. This is what we need:

* An endpoint to serve jokes about food - `/api/jokes/food`.
* An endpoint to serve jokes about celebrities - `/api/jokes/celebrity`.
* Secure the endpoint that serves celebrity jokes, so that it can only be accessed by registered users.

Go ahead and fetch the [Node.js backend from GitHub](https://github.com/auth0-blog/preact-authentication-tutorial/tree/master/server).

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

Don't worry about the middleware in charge of securing our endpoint for now. We'll deal with that later. Now, let's build our frontend with Preact. Woot! Woot!

## Build The Front-End With Preact

With **ReactJS**, we have the infamous [create-react-app](https://github.com/facebookincubator/create-react-app) for scaffolding new react apps. Currently, there is no similar tool for creating preact apps. However, the team behind `create-react-app` tool made it very easy for developers to configure it to suit their needs via react-scripts.

> Learn how to configure create-react-app with this [excellent tutorial](https://auth0.com/blog/how-to-configure-create-react-app/).

Thanks to the open source community, *Boris Serdiuk* already did the hard work of configuring `create-react-app` to create preact apps. Now, all you need is to have the `create-react-app` tool installed globally, then create a new preact app like this:

```bash
create-react-app chucknorrisworld --scripts-version @just-boris/preact-scripts
```

Another alternative to setting up preact apps is via the [preact-boilerplate](https://github.com/developit/preact-boilerplate) created by the author of Preact.

We will use the `preact-boilerplate` in this tutorial. Go ahead and run the following command on your terminal to clone the boilerplate:

```bash
git clone --depth 1 https://github.com/developit/preact-boilerplate.git chucknorrisworld
cd chucknorrisworld
```

Then install the dependencies like this:

```bash
npm install
```

Now run `npm run dev` to see your app at `http://localhost:8080`.

![App recently scaffolded and showing at Localhost](https://cdn.auth0.com/blog/preact/scaffoldedapp.png)

Open up the `src/components` directory and delete all the existing directories.

**Note:** We are not writing any tests for this application. It's out of the scope of this tutorial.

Make the following modifications like so:

In the `src/components` directory, go ahead and:

* Create a `celebrityjokes` folder and an `index.js` file inside the folder you just created. This component will take care of fetching the celebrity jokes and displaying them to the user.
* Create a `foodjokes` folder and an `index.js` file inside the folder you just created. This component will take care of fetching the food jokes and displaying them to the user.
* Create a `nav` folder and an `index.js` file inside the folder you just created. This component will be in charge of our navigation throughout the app.
* Create a folder called `utils` inside the `src` directory. This will house our helper functions.

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

The `index.js` file in the `nav` folder is our Nav component. Go ahead and add code to it like so:

```js

import { h, Component } from 'preact';
import { Link } from 'preact-router';
import './App.css';

export default class Nav extends Component {

  render() {
    return (
      <nav class="navbar navbar-default">
        <div class="navbar-header">
          <Link class="navbar-brand" href="/">Chuck Norris World</Link>
        </div>
        <ul class="nav navbar-nav">
          <li>
            <Link href="/">Food Jokes</Link>
          </li>
          <li>
           <Link href="/special">Celebrity Jokes</Link>
          </li>
        </ul>
        <ul class="nav navbar-nav navbar-right">
          <li><button class="btn btn-info log">Log In</button></li>
          <li><button class="btn btn-danger log">Log out </button></li>
        </ul>
      </nav>
    );
  }
};
```

The `Link` Component from `preact-router` uses the `href` attribute unlike ReactJS that uses the `to` attribute.

## Build the CelebrityJokes and FoodJokes Component

By default, these two components will look similar in functionalities. They both display data from different endpoints. Let's start with the `FoodJokes` component.

```js

import { h, Component } from 'preact';
import { Link } from 'preact-router';
import { getFoodData } from '../../utils/chucknorris-api';


class FoodJokes extends Component {

  state = { jokes: [] };

  getFoodJokes() {
    getFoodData().then((jokes) => {
      this.setState({ jokes });
    });
  }

  componentDidMount() {
    this.getFoodJokes();
  }

  render({}, { jokes }) {

    return (
      <div>
        <h3 class="text-center">Chuck Norris Food Jokes</h3>
        <hr/>

        { jokes.map((joke, index) => (
              <div class="col-sm-6" key={index}>
                <div class="panel panel-primary">
                  <div class="panel-heading">
                    <h3 class="panel-title"> <span class="btn">#{ joke.id }</span></h3>
                  </div>
                  <div class="panel-body">
                    <p> { joke.joke } </p>
                  </div>
                </div>
              </div>
          ))}

        <div class="col-sm-12">
          <div class="jumbotron text-center">
            <h2>Get Access to Celebrity Jokes By Logging In</h2>
          </div>
        </div>

        <div class="col-sm-12">
            <div class="jumbotron text-center">
              <h2>View Celebrity Jokes</h2>
              <Link class="btn btn-lg btn-success" to='/special'> Celebrity Jokes </Link>
            </div>
        </div>
      </div>
    );
  }
}

export default FoodJokes;
```
_foodjokes/index.js_

> **Note:** In Preact, you can just declare state without necessarily putting it in the constructor method.

Let's analyze the code above. The `FoodJoke` component is pulling data from an API, so it needs a way of holding that data. That's where `state` comes in. In **Preact**, you can use `props` to pass data around and use `state` to hold/manage that data.

In the constructor, we define the initial state as seen in the code below:

```js
...
 state = { jokes: [] };
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

Now, we took advantage of one of the **Preact** lifecycle hooks, `componentDidMount`. Whatever is defined in this method is applied immediately after a component is mounted on the browser screen. So, we invoked the `getFoodJokes` method in the hook as seen below:

```js
...
 componentDidMount() {
    this.getFoodJokes();
  }
...
```

All we are trying to do is tell **Preact** to load the data from the API immediately the `FoodJokes` component gets rendered.

Finally, we rendered the component with the **Preact** `render` method. This is the method that does the actual rendering on the screen

We looped through the `jokes` variable passed as an argument to the `render` method which is now an array to display the contents on the screen.

```js
...
{ jokes.map((joke, index) => (
            <div class="col-sm-6" key={index}>
              <div class="panel panel-primary">
                <div class="panel-heading">
                  <h3 class="panel-title"> <span class="btn">#{ joke.id }</span></h3>
                </div>
                <div class="panel-body">
                  <p> { joke.joke } </p>
                </div>
              </div>
            </div>
))}
...
````

Now, let's build the `CelebrityJokes` component in the same way:

```js

import { h, Component } from 'preact';
import { Link } from 'preact-router';
import { getCelebrityData } from '../../utils/chucknorris-api';

class CelebrityJokes extends Component {

  state = { jokes: [] };

  getCelebrityJokes() {
    getCelebrityData().then((jokes) => {
      this.setState({ jokes });
    });
  }

  componentDidMount() {
    this.getCelebrityJokes();
  }

  render({}, { jokes }) {
    return (
      <div>
        <h3 class="text-center">Privileged Chuck Norris Celebrity Jokes</h3>
        <hr/>

        { jokes.map((joke, index) => (
              <div class="col-sm-6" key={index}>
                <div class="panel panel-danger">
                  <div class="panel-heading">
                    <h3 class="panel-title"><span class="btn">#{ joke.id }</span></h3>
                  </div>
                  <div class="panel-body">
                    <p> { joke.joke } </p>
                  </div>
                </div>
              </div>
          ))}

        <div class="col-sm-12">
          <div class="jumbotron text-center">
            <h2>View Food Jokes</h2>
            <Link class="btn btn-lg btn-success" href='/'>Chuck Norris Food Jokes </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default CelebrityJokes;

```
_celebrityjokes/index.js_

We need to take care of one more component so that our app can function. The App component!

## Build the App Component

This is the component where we get to define how routing should work in our application and also bind it to a div that holds the entire UI for the app.

Open up `src/components/app.js` and add code to it like so:

```js
import { h, Component } from 'preact';
import { Router } from 'preact-router';

import Nav from './nav';
import CelebrityJokes from './celebrityjokes';
import FoodJokes from './foodjokes';
import Callback from './callback';

export default class App extends Component {
  /** Gets fired when the route changes.
   *  @param {Object} event   "change" event from [preact-router](http://git.io/preact-router)
   *  @param {string} event.url The newly routed URL
   */
  handleRoute = e => {
    this.currentUrl = e.url;
  };

  render() {
    return (
      <div id="app">
        <Nav />
        <Router onChange={this.handleRoute}>
          <FoodJokes path="/" />
          <FoodJokes path="/foodjokes" />
          <CelebrityJokes path="/special" />
          <Callback path="/callback" />
        </Router>
      </div>
    );
  }
}

```
_app.js_

The routing is simple. Each component is a route in the `Router` component. We have defined the `FoodJokes` component to be called once a user hits the `/` route/path. It displays the `CelebrityJokes` component once a user hits the `/special` route/path. Also, when a user hits the `foodjokes` route, it displays the `FoodJokes` component.

Just a few more things before we add authentication to our application.

* Open up `src/index.ejs` and add [bootstrap](http://getbootstrap.com). Now the content of the index file should look like this:

{% highlight html %}
{% raw %}
 <!DOCTYPE html>
<html>
<head>
  <% for (var chunk in htmlWebpackPlugin.files.css) { %>
    <link rel="preload" href="<%= htmlWebpackPlugin.files.css[chunk] %>"  as="style">
  <% } %>
  <% for (var chunk in htmlWebpackPlugin.files.chunks) { %>
    <link rel="preload" href="<%= htmlWebpackPlugin.files.chunks[chunk].entry %>" as="script">
  <% } %>
  <meta charset="utf-8">
  <title>preact-boilerplate</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimal-ui">
  <meta name="description" content="preact-boilerplate">
  <meta name="msapplication-TileColor" content="#673ab8">
  <meta name="msapplication-TileImage" content="./assets/icons/mstile-150x150.png">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="preact-boilerplate">
  <meta name="application-name" content="preact-boilerplate">
  <meta name="format-detection" content="telephone=no">
  <meta name="theme-color" content="#673ab8">
  <link rel="apple-touch-icon" sizes="180x180" href="./assets/icons/apple-touch-icon.png">
  <link rel="icon" type="image/png" href="/assets/icons/favicon-32x32.png" sizes="32x32">
  <link rel="icon" type="image/png" href="/assets/icons/favicon-16x16.png" sizes="16x16">
  <link rel="manifest" href="./manifest.json">
  <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
</head>
<body></body>
</html>

{% endraw %}
{% endhighlight %}

* Now create an `app.css` in the `src` directory and add this style to it like so:

  {% highlight css %}
  .navbar-right { margin-right: 0px !important}
  .log {
    margin: 5px 10px 0 0;
  }
  {% endhighlight %}

Now, feel free to check out your application in the browser.

Next, let's add authentication to the app.

## Adding Authentication to Chuck Norris World App

The majority of the apps we use on a daily basis have a means of authenticating users. I'll show you how to easily add authentication to our **Preact** application. We'll use [Auth0](https://auth0.com/) as our authentication service.

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
    ....
    // Array of jokes
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

### Adding Authentication to our Preact Front-end

We'll create an authentication service to handle everything about authentication in our app. Go ahead and create an `AuthService.js` file inside the `utils` directory.

Before we add code, you need to install `jwt-decode` and `auth0-js` node packages like so:

```bash

npm install jwt-decode auth0-js --save

```

Open up the `AuthService.js` file and add code to it like so:

```js
import decode from 'jwt-decode';
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
  window.location.href = "/";
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

> Changing the Client name is totally optional.

Copy the **CLIENT ID** and replace it with the value of `AUTH0_CLIENT_ID` in the variable `CLIENT_ID`. Replace your callback url with `http://localhost:8080/callback`. Don't forget to add that URL to the **Allowed Callback URLs** and `http://localhost:8080` to the **Allowed Origins (CORS)**.

We also checked whether the token has expired via the `getTokenExpirationDate` and `isTokenExpired` methods. The `isLoggedIn` method returns `true` or `false` based on the presence and validity of a user `id_token`.

Let's go update the `Nav` component to hide/show the `login` and `logout` buttons based on the user's authentication status.

Now, your `Nav` component should look like this:

```js
import { h, Component } from 'preact';
import { Link } from 'preact-router';
import { login, logout, isLoggedIn } from '../../utils/AuthService';
import '../../app.css';

export default class Nav extends Component {

  render() {
    return (
      <nav className="navbar navbar-default">
        <div className="navbar-header">
          <Link className="navbar-brand" href="/">Chuck Norris World</Link>
        </div>
        <ul className="nav navbar-nav">
          <li>
            <Link href="/">Food Jokes</Link>
          </li>
          <li>
            {
             ( isLoggedIn() ) ? <Link href="/special">Celebrity Jokes</Link> :  ''
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
};

```
_nav/index.js_

We imported `login`, `logout` and `isLoggedIn` functions from the `AuthService`. Then, we attached the `login()` and `logout()` functions to the `login` and `logout` buttons respectively.

We also hid the `/special` link by checking the authentication status of the user via the `isLoggedIn()` function.

Open up the `FoodJokes` Component and modify it like so:

```js

import { h, Component } from 'preact';
import { Link } from 'preact-router';
import { isLoggedIn } from '../../utils/AuthService';
import { getFoodData } from '../../utils/chucknorris-api';


class FoodJokes extends Component {

  state = { jokes: [] };

  getFoodJokes() {
    getFoodData().then((jokes) => {
      this.setState({ jokes });
    });
  }

  componentDidMount() {
    this.getFoodJokes();
  }

  render({}, { jokes }) {

    return (
      <div>
        <h3 class="text-center">Chuck Norris Food Jokes</h3>
        <hr/>

        { jokes.map((joke, index) => (
              <div class="col-sm-6" key={index}>
                <div class="panel panel-primary">
                  <div class="panel-heading">
                    <h3 class="panel-title"> <span className="btn">#{ joke.id }</span></h3>
                  </div>
                  <div class="panel-body">
                    <p> { joke.joke } </p>
                  </div>
                </div>
              </div>
          ))}

        <div class="col-sm-12">
          { isLoggedIn() ?
          <div class="jumbotron text-center">
            <h2>View Celebrity Jokes</h2>
            <Link class="btn btn-lg btn-success" href='/special'> Celebrity Jokes </Link>
          </div> : <div class="jumbotron text-center"><h2>Get Access to Celebrity Jokes By Logging In</h2></div>
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

We will create a new component by adding a `callback` folder with an `index.js` file to the `components` directory. This component will be activated when the `localhost:8080/callback` route is called and it will process the redirect from Auth0 and ensure we received the right data back after a successful authentication. The component will store the `access_token` and `id_token`.

_callback/index.js_

```js
import { h, Component } from 'preact';
import { setIdToken, setAccessToken } from '../../utils/AuthService';

class Callback extends Component {

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

### Secure The Special Route

We need to ensure that no one can go to the browser and just type `/special` to access the celebrity route. In **ReactJS**, we can achieve that with the `onEnter` hook. Unfortunately, we don't have that in **Preact**. We need to improvise!

What if we allow anyone access the route but only display useful content based on a users' authentication status?

Open up `src/components/celebrityjokes/index.js` file and modify it like this:

```js
import { h, Component } from 'preact';
import { Link } from 'preact-router';
import { getCelebrityData } from '../../utils/chucknorris-api';
import { login, logout, isLoggedIn } from '../../utils/AuthService';

class CelebrityJokes extends Component {

  state = { jokes: [] };

  getCelebrityJokes() {
    getCelebrityData().then((jokes) => {
      this.setState({ jokes });
    });
  }

  componentDidMount() {
    this.getCelebrityJokes();
  }

  render({}, { jokes }) {

    if(!isLoggedIn()) {
      return (
        <div class="jumbotron text-center">
          <h3> You need to be logged in to view celebrity jokes </h3>
        </div>
      );
    } else {
      return (
        <div>
          <h3 class="text-center">Privileged Chuck Norris Celebrity Jokes</h3>
          <hr/>

          { jokes.map((joke, index) => (
                <div class="col-sm-6" key={index}>
                  <div class="panel panel-danger">
                    <div class="panel-heading">
                      <h3 class="panel-title"><span className="btn">#{ joke.id }</span></h3>
                    </div>
                    <div class="panel-body">
                      <p> { joke.joke } </p>
                    </div>
                  </div>
                </div>
            ))}

          <div class="col-sm-12">
            <div class="jumbotron text-center">
              <h2>View Food Jokes</h2>
              <Link class="btn btn-lg btn-success" ='/'>Chuck Norris Food Jokes </Link>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default CelebrityJokes;

```
_celebrityjokes/index.js_

In the code above, if the user is not logged in, it simply gives the user a notice to log in to view the content. However, if the user is logged-in, it displays all the celebrity jokes.

Just one more thing before we test the app. Register the `/callback` route in App component, `src/app.js` file like so:

```js
...
...
export default class App extends Component {
  /** Gets fired when the route changes.
   *  @param {Object} event   "change" event from [preact-router](http://git.io/preact-router)
   *  @param {string} event.url The newly routed URL
   */
  handleRoute = e => {
    this.currentUrl = e.url;
  };

  render() {
    return (
      <div id="app">
        <Nav />
        <Router onChange={this.handleRoute}>
          <FoodJokes path="/" />
          <FoodJokes path="/foodjokes" />
          <CelebrityJokes path="/special" />
          <Callback path="/callback" />
        </Router>
      </div>
    );
  }
}

```

Now, try to log in.

![Lock Login Widget](https://cdn.auth0.com/blog/preact/loginbox.png)
_Hosted Lock Login Widget_

For the first time, the user will be shown a user consent dialog that will show the scope available. Once a user authorizes, it goes ahead to login the user and give them access based on the scopes.

![User consent dialog](https://cdn2.auth0.com/blog/chucknorris/clientconsent.png)
_User presented with an option to authorize_

**Note:** Since we are using `localhost` for our domain, once a user logs in the first time, subsequent logins will not need a user consent authorization dialog. This consent dialog will not be displayed if you are using a non-localhost domain, and the client is a first-party client.

![Logged In and authorized to see the celebrity content](https://cdn.auth0.com/blog/preact/special.png)
_Logged In, and authorized to see the celebrity content_

Yaaaay! We have successfully logged in. And we can see the celebrity jokes rendered on the `/special` route.

Log out, log in again and check that everything works fine. You have just successfully built a **Preact** app and added authentication to it!

## Check The Bundle Size

Go ahead and run the command below to make our preact app ready for production.

```bash
npm run build
```

![App size](https://cdn.auth0.com/blog/preact/bundlesize.png)
_app size before gzipping_

The bundle.js size before gzipping is **132kb**.

By default, *preact-boilerplate* was not configured to gzip your files. I installed the compression-webpack-plugin and submitted a [PR](https://github.com/developit/preact-boilerplate/pull/199) to enable further optimization via gzipping.


![App size](https://cdn.auth0.com/blog/preact/gzippedappsize.png)
_app size after gzipping_

App size after gzipping is **39.3kb**.

Clone the equivalent [React app](https://github.com/auth0-blog/reactjs-authentication-tutorial), run `npm install` to install the required modules, then go ahead and make it ready for production too by invoking the same command, `npm run build`.

![App size](https://cdn.auth0.com/blog/react/gzippedappsize.png)
_app size after gzipping_

React app size after gzipping is **96.81kb**.

Alas!, our Preact app size is smaller than that of ReactJS.

## Conclusion

**Preact** is small enough that your code is the largest part of your application. It has one of the fastest Virtual DOM libraries out there, thus making it very fast.

Bulding a web experience with Preact means having less JavaScript code to download, parse and execute. I bet everyone wants that!

In addition, Auth0 can help secure your **Preact** apps with more than just username-password authentication. It provides features like [multifactor auth](https://auth0.com/docs/multifactor-authentication), [anomaly detection](https://auth0.com/docs/anomaly-detection), [enterprise federation](https://auth0.com/docs/identityproviders), [single sign on (SSO)](https://auth0.com/docs/sso), and more. [Sign up](javascript:signup\(\)) today so you can focus on building features unique to your app.
