---
layout: post
title: "Developing Web Apps with ASP.NET Core 2.0 and React - Part 2"
description: "A practical tutorial showing how to setup and develop a modern Web application based on ASP.NET Core 2.0 and React."
longdescription: "In this series of posts, you will build a Web application based on ASP.NET Core 2.0 and React. To solve the identity management feature, you will integrate this stack with Auth0. In this second part of the series, you are going to create a Single Page Application (SPA) client based on React and integrate it with the ASP.NET Core API created in the previous part."
date: 2018-02-20 08:30
category: Technical Guide, Frontend, React
author:
  name: "Andrea Chiarelli"
  url: "https://twitter.com/andychiare"
  mail: "andrea.chiarelli.ac@gmail.com"
  avatar: "https://pbs.twimg.com/profile_images/827888770510880769/nnvUxzSd_400x400.jpg"
design:
  bg_color: "#2B1743"
  image: https://cdn.auth0.com/blog/webapps-aspnet2-react/logo.png
tags:
- react
- javascript
- auth0
- .net-core
- asp.net-core
- csharp
- oauth
- openid-connect
related:
- developing-web-apps-with-asp-dot-net-core-2-dot-0-and-react-part-1
- securing-asp-dot-net-core-2-applications-with-jwts
- 2018-02-06-developing-games-with-react-redux-and-svg-part-1
---

**TL;DR:** This is the second part of the series about developing a Web application based on ASP.NET Core 2.0 and React. [In the previous post](http://auth0.com/blog/developing-web-apps-with-asp-dot-net-core-2-dot-0-and-react-part-1), you built a secured Web API application that provides a list of books with ASP.NET Core 2.0. In this post, you will create a *Single Page Application* (SPA) client based on React to consume this API. You can find [the final code of the React client in this GitHub repository](https://github.com/andychiare/react-auth0).

{% include tweet_quote.html quote_text="Learn how to integrate React and ASP.NET Core apps in this practical tutorial." %}

---

## Creating a React Application

The client application you are going to create is a Web application based on [React](https://reactjs.org/) that will use [the API you built in Part 1 of this series](http://auth0.com/blog/developing-web-apps-with-asp-dot-net-core-2-dot-0-and-react-part-1). The Web API returns a list of books but, since an authorization token is required to get the data, you will also deal with authentication and authorization matters.

You will have to start by bootstrapping a React application skeleton. There are a few alternatives to create new React applications, like: starting from scratch; using one of the several [boilerplates](https://www.google.it/search?q=react+js+boilerplate&oq=reactjs+blierplate&aqs=chrome.1.69i57j0l5.9552j0j7&sourceid=chrome&ie=UTF-8) you can find on the Web; or using the  [`create-react-app`](https://github.com/facebook/create-react-app) tool.

Using the [`create-react-app`](https://github.com/facebook/create-react-app) tool has a lot of benefits:

- It sets up a React application in just a few minutes;
- It provides a ready to use development environment that doesn't require you to deal with complex configuration;
- It is well documented;
- And, last but not least, the tool has been developed by the React team itself. This guarantees that the best practices for working with React are applied.

But what is this `create-react-app` tool? It is a *Command Line Interface* (CLI) that allows you to setup a React-based SPA without needing to configure transpilers, syntax checkers, module bundlers, task runners, and other tasks/tools required by modern JavaScript development. This tool is based on [Node.js](https://nodejs.org/en/) and can be installed on your machine by typing the following command:

```shell
npm install -g create-react-app
```

> **Note:** If you don't have Node.js and NPM installed on your development machine, head to [the Node.js download page](https://nodejs.org/en/download/) and follow the instructions.

After installing the `create-react-app` tool, you can use it to create your React application by typing the following command in a console window:

```shell
create-react-app react-auth0
```

This command will create a folder named `react-auth0` in the current directory. It will also put, in this directory, all the stuff needed for a minimal (but working) React-based SPA. The creation process may take a few minutes since it has to download a bunch of *NPM* packages needed for the project.

Once the application setup is complete, you can run it by issuing the following commands:

```shell
# move into the new directory
cd react-auth0

# start the development server
npm start
```

After a few seconds, your default browser will be opened and you will see the following page:

![Default SPA create the create-react-app-tool](https://cdn.auth0.com/blog/react-aspnet-core/react-default-app.png)

This means that the app is working and that you are ready to start enhancing it.

## Creating an Auth0 Application

Since you need to access a Web API secured with *Auth0*, the first thing you have to do is to create and configure an [Auth0 Application](https://auth0.com/docs/applications). In the previous part, you have used `curl` as a _Machine to Machine Application_. Besides that, you have used the same application type for the integration tests.

Now, you are building a React SPA client. That is, your client is going to be guided by user interaction. As such, you need to head to [the Applications page on the Auth0 dashboard](https://manage.auth0.com/#/applications) and hit the *Create Application* button.

After clicking on this button, the dashboard will present to you a form where you will have to type a *Name* to your application and select its *type*. For this tutorial, you can set the name of your application as *React Auth0* and choose *Single Page Web Applications* as its type.

![Creating a React application on Auth0](https://cdn.auth0.com/blog/react-aspnet-core/creating-an-auth0-client.png)

After that, you can click on the *Create* button. Clicking on it will make the dashboard redirect you to a tab called *Quick Start* inside your new application. As you are going to learn how to integrate your React app with the ASP.NET Core 2.0 API in this tutorial, you won't need to follow the instructions there. For now, what you will need to do is to set the *Allowed Callback URLs* field to `http://localhost:3000` in the *Settings* tab.

![Settings tab of a React application on Auth0](https://cdn.auth0.com/blog/react-aspnet-core/settings-tab-on-auth0-client.png)

## Integrate the React App with Auth0

Now that you have created an Auth0 Application, you are ready to integrate your React application with Auth0.

As a first step, you will need to install the [`auth0.js`](https://github.com/auth0/auth0.js) NPM package. You can do this by typing the following command in the root directory of your project:

```shell
npm install --save auth0-js
```

Your users will authenticate themselves through [the Auth0 hosted login page](https://auth0.com/docs/hosted-pages/login). This is the simplest and most secure way to secure your application. In short, this service redirects users to a login page hosted by Auth0 where the authentication process happens. After that, users are redirected again to your application with tokens that can be used to fetch sensitive data from your ASP.NET Core 2.0 API.

After installing the `auth0-js` package, you will need to create a file called `Auth0Config.js` in the `src` directory of your React application project. Add the following content to this file:

```js
export const AUTH_CONFIG = {
    domain: 'YOUR_AUTH0_DOMAIN',
    clientID: 'YOUR_CLIENT_ID',
    redirectUri: 'http://localhost:3000',
    audience: 'https://onlinebookstore.mycompany.com'
};
```

As you can see, you are defining an object that contains the configuration properties of your Auth0 Application in this file. **Note that**, you will need to replace `YOUR_AUTH0_DOMAIN` and `YOUR_CLIENT_ID` placeholders with the corresponding values from your Auth0 Application. So, head to [the Applications page on the Auth0 Management Dashboard](https://manage.auth0.com/#/applications), choose the application that you have created in the previous section, select the *Settings* tab, and use the *Client ID* and the *Domain* values to replace these placeholders.

This file also contains another two properties:

1. `redirectUri`: This property contains the URL that your users will be redirected to after the authentication process. Currently, you set it to the home page of your React app. However, you will change it soon.
2. `audience`: This property contains the unique identifier of the Auth0 API that you have created in [the first article of this series](http://auth0.com/blog/developing-web-apps-with-asp-dot-net-core-2-dot-0-and-react-part-1).

## Create the Authentication Service

Next, you will need to create another JavaScript module. You will define this module inside a new file called `AuthService.js` in the `src` directory with the following code:

```js
import auth0 from 'auth0-js';
import { AUTH_CONFIG } from './Auth0Config';

export default class AuthService {
  auth0 = new auth0.WebAuth({
    domain: AUTH_CONFIG.domain,
    clientID: AUTH_CONFIG.clientID,
    redirectUri: AUTH_CONFIG.redirectUri,
    audience: AUTH_CONFIG.audience,
    responseType: 'token id_token',
    scope: 'openid'
  });

  login() {
    this.auth0.authorize();
  }
}
```

As you can see, you imported the `auth0` namespace from the `auth0-js` package and the `AUTH_CONFIG` object from the module defined in the previous section. Then, you used the `auth0.WebAuth()` constructor to create an instance of the `auth0` client. To create this instance, you provided your Auth0 Application properties to this constructor. Alongside with these properties, you also provided values for the `responseType` property (which defines the type of response you want from the authorization server) and for the `scope` (which defines that you are expecting the server to send [the `sub` claim back to your app](https://auth0.com/docs/scopes/current#standard-claims)).

Finally, you defined a `login()` method that wraps the `auth0.authorize()` one.

With that, you are now ready to use the `AuthService` class in your application. So, open the `App.js` file and replace its code with this:

```js
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import AuthService from './AuthService';

class App extends Component {
  constructor() {
    super();
    this.authService = new AuthService();
  }

  render() {
    this.authService.login();

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
```

In this new version, you imported the `AuthService` class, added a constructor to the `App` component, and created an instance of the `AuthService`. After that, you have defined that your app will trigger the authentication process when rendered (i.e. you called the `login()` method inside the `render()` method of the component.

Now, when running the app, you will no longer see the standard `create-react-app` home page. Instead, you will see the Auth0 hosted login page, which is similar to this one:

![The Auth0 hosted login page for a React app.](https://cdn.auth0.com/blog/react-aspnet-core/auth0-hosted-login-page.png)

## Create Users for the React App

You might be wondering: how can you add authorized users to your application? With Auth0, you have two options. First, which is the most common option, is to let visitors register themselves by submitting the *Sign Up* form shown by Auth0 or [by choosing one of the multiple identity providers that you can easily configure in your Auth0 applications](https://auth0.com/docs/identityproviders).

The second option is to manually register users through the Auth0 dashboard. You can do this by heading to the *Users* page on the Auth0 management dashboard. There, you will need to click on the *Create User* button in the upper right corner. This will make the dashboard show a form where you can provide the credentials for the new user.

![Creating users through the Auth0 management dashboard](https://cdn.auth0.com/blog/react-aspnet-core/auth0-user-creation-form.png)

## Managing Sessions on the React App

Until now, you just have an application that redirects to the [Auth0 hosted login page](https://auth0.com/docs/hosted-pages/login) when users access your home page.

Even if users have already authenticated themselves, your homepage will redirect them to the Auth0 hosted login page again. This happens because your app has an unconditional request to authenticate the user. To fix this infinite loop, you will need a way to track if users are authenticated or not. In other words, you need to control users' sessions on your React app.

To do this, you will need to add a few methods to the `AuthService` class:

```js
export default class AuthService {
  // ...

  handleAuthentication(history) {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        history.push("/");
      } else if (err) {
        console.log(err);
      }
    });
  }

  setSession(authResult) {
    let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  isAuthenticated() {
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }
}
```

The first method, called `handleAuthentication()`, analyzes the authentication result from the Auth0 login page by using the `auth0.parseHash()` method provided by the `auth0-js` library. If a valid result is received, a new session is created and the user is redirected back to the home page of your application. The `handleAuthentication()` method uses the `history` parameter to redirect your users. Besides that, the `handleAuthentication()`method calls the `setSession()` method to create a new session. In fact, this is the method that stores the info about the current user so that your react app can verify if there is an active session or not.

As you can see, `setSession()` stores the session's data in the browser's `localStorage`. This means that users' data are kept even if the user closes the browser window. If you want a different behavior, you could store that data in the `sessionStorage`, so that the browser cleans session data when closed.

The last method, called `isAuthenticated()`, checks if the session data stored in the `localStorage` is still valid.

## Adding Routing to the React App

Before you can use your new methods, you need to add routing support to your application. This allows you to separate the session creation route from the application's real point of access. In other words, you need to specify a different URL to which the authentication service (Auth0) will redirect your users.

To do this, you need to provide another callback URL in your Auth0 Application configuration. So, [head to the Applications page on the Auth0 management dashboard](https://manage.auth0.com/#/applications), choose your application again, and replace the value on the *Allowed Callback URLs* field to `http://localhost:3000/startSession`.

With this configuration you are saying to Auth0 that the provided URL is a valid place to redirect your users to after the authentication process. This is a security measure to avoid unauthorized redirections.

You also need to specify the new callback URL in the `Auth0Config.js` file:

```js
export const AUTH_CONFIG = {
    domain: 'YOUR_AUTH0_DOMAIN',
    clientID: 'YOUR_CLIENT_ID',
    redirectUri: 'http://localhost:3000/startSession',
    audience: 'https://onlinebookstore.mycompany.com'
}
```

This setting configures your app to inform Auth0 that users *must* be redirected to this URL after the authentication process.

After that, you can add routing support to your React application by installing [`react-router`](https://reacttraining.com/react-router/). To do this, type the following command in the project's root directory:

```shell
npm install --save react-router-dom
```

Now, you can configure routing for your React application.

The first thing you need to do is change the code of `index.js` as follows:

```js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter} from 'react-router-dom';

ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
document.getElementById('root'));
registerServiceWorker();
```

Here, you imported the `BrowserRouter` component from `react-router-dom` module and wrapped the `App` component inside it. This enriches the `App` component with routing capabilities.

## Completing the Session Management Feature

With all the previous preparation, you can replace the `App` component code with the following:

```js
import React, { Component } from 'react';
import './App.css';
import AuthService from './AuthService';
import {Switch, Route} from 'react-router-dom';
import Home from './Home'

class App extends Component {
  constructor() {
    super();
    this.authService = new AuthService();
  }

  renderHome() {
    let resultComponent = <Home auth={this.authService}/>;

    if (!this.authService.isAuthenticated()) {
      this.authService.login();
      resultComponent = <div><p>Redirecting to the authentication service...</p></div>
    }

    return resultComponent;
  }

  startSession(history) {
    this.authService.handleAuthentication(history);
    return <div><p>Starting session...</p></div>;
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">My Bookstore</h1>
        </header>
        <Switch>
          <Route exact path="/" render={() => this.renderHome()}/>
          <Route path="/startSession" render={({history}) => this.startSession(history)}/>
        </Switch>
      </div>
    );
  }
}

export default App;
```

The main changes in this file concern the definition of two routes by using `Switch` and `Route` components provided by the `react-router-dom` module. So, you have the home page route (which matches the root path) and the session creation route (which matches the `/startSession` path). Both routes are mapped to `render` functions.

The session creation route is mapped to a function that invokes `startSession()` method passing the browser's history as a parameter. The `startSession()` method calls the `handleAuthentication()` method of the `AuthService` class. This method returns a waiting React element that is shown while the asynchronous process is running.

The home page route is mapped to a function that calls the `renderHome()` method. The `renderHome()` method returns the `Home` component if the user is authenticated. Otherwise, it invokes the `login()` method and returns a waiting React element.

Now, your users will be authenticated and redirected to the `Home` component content.

## Connecting the App and the Secured Web API

To complete the authentication process, you will need to create the `Home` React component. You will use this component to connect your client to the Web API providing the book list. So, create a file called `Home.jsx` in the `./src/` directory with the following code:

```js
import React from 'react';
import './Home.css'

class Home extends React.Component {
  constructor() {
      super();
      this.state = {bookList: []};
  }

  componentDidMount() {
    fetch("/api/books", {headers: new Headers({
        "Accept": "application/json"    })})
        .then(response => response.json())
        .then(books => this.setState({bookList: books}))
        .catch(error => console.log(error))
  }

  render() {
    let bookList = this.state.bookList.map((book) =>
                               <li><i>{book.author}</i> - <h3>{book.title}</h3></li>);

    return <ul>
      {bookList}
    </ul>;
  }
}

export default Home;
```

In the constructor, you define the component's initial state. This state will be used in the `render()` method to show the data contained in its `bookList` property as an HTML unordered list. Such data will be retrieved after the component is mounted on the DOM (`componentDidMount`) by calling the `/api/books` via `fetch()`.

Also, notice the import of `Home.css` stylesheet. Importing a CSS file into a JavaScript module may seem a bit strange since you are dealing with JavaScript code most of the time. However, thanks to the development environment provided by `create-react-app`, you can use the same syntax even for CSS files. This allows you to use, inside your React component, classes and other rules defined in a CSS file. This helps to keep component specific styles close to the component definition itself.

To define this CSS rules, create the `Home.css` file the `./src/` directory with the following code:

```css
ul {
    list-style-type: none;
    text-align: left;
    margin-left: 20%;
}

ul h3 {
    display: inline;
}
```

If you try to run your code now, you will notice that the `Home` component is still not working. Due to the [same origin policy](https://en.wikipedia.org/wiki/Same-origin_policy) applied by browsers, the React application cannot send an HTTP request to a server in a different domain without some proper configuration.

Provided that you have followed the instructions in the [Part 1 of this series](http://auth0.com/blog/developing-web-apps-with-asp-dot-net-core-2-dot-0-and-react-part-1), you need to enable your React application to call the Web API application. In fact, both are Web applications but running on different ports: the React application runs on port `3000` while the Web API application runs on port `63939`.

In the development environment, you can enable the communication between the two applications by simply adding a `proxy` value in the `package.json` file, as shown below:

```json
{
  "name": "react-auth0",
  "version": "0.1.0",
  "private": true,
  "proxy": "http://localhost:63939",
  ...
}
```

In the production environment, you should adopt a different approach, such as put the two applications under the same domain, by enabling [CORS](https://auth0.com/docs/cross-origin-authentication), or by using a reverse proxy.

Even with this change, you are still unable to get the data from the Web API because it is protected and we need to provide an access token. So, enhance the *AuthService* class by adding a method that returns the access token associated with the current session:

```js
export default class AuthService {
...
  getAccessToken() {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('No access token found');
    }
    return accessToken;
  }
}
```

Now, you will use the new method to get the access token and pass it to the Web API as an authorization header, as shown by the following code:

```js
  componentDidMount() {
    const accessToken = this.props.auth.getAccessToken();

    fetch("/api/books", {headers: new Headers({
        "Accept": "application/json",
        "Authorization": `Bearer ${accessToken}`
    })})
        .then(response => response.json())
        .then(books => this.setState({bookList: books}))
        .catch(error => console.log(error))
  }
```

Finally, now you can get the book list and show it:

![Showing the book list in the React app integrated with ASP.NET Core 2.0](https://cdn.auth0.com/blog/react-aspnet-core/book-list.png)

## Handling Logout

As a final touch, you will add a logout button to allow the user to quit your application. To do this, add a `logout()` method to `AuthService` class as shown here:

```js
export default class AuthService {
  // ...
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    window.location.href = '/';
  }
}
```

The method simply removes the session data from the `localStorage` and redirects the user to the root page.

Use this method in the `App` component as depicted in the following code:

```js
class App extends Component {
  // ...
  createLogoutButton() {
  	let button = null;

  	if (this.authService.isAuthenticated()) {
  		button = <button onClick={()=>this.authService.logout()}>Logout</button>;
  	}

  	return button;
  }

  render() {
	   let logoutButton =  this.createLogoutButton();

    return (
      <div className="App">
        <header className="App-header">
		      {logoutButton}
          <h1 className="App-title">My Bookstore</h1>
        </header>
        <Switch>
          <Route exact path="/" render={() => this.renderHome()}/>
          <Route path="/startSession" render={({history}) => this.startSession(history)}/>
        </Switch>
      </div>
    );
  }
}
```

Here, you add a `logoutButton` React element to the `App` component markup when the user is authenticated. That button will call the `logout()` method when clicked, allowing the user to remove the session data. In the end, your unauthenticated user will be moved to the root URL of the application.

{% include tweet_quote.html quote_text="Developing secure React and ASP.NET Core apps is easy." %}

## Summary

In this second part of the series, you created a React-based client for [the Web API application implemented in the first part](http://auth0.com/blog/developing-web-apps-with-asp-dot-net-core-2-dot-0-and-react-part-1). You explored how to configure the client on the *Auth0* dashboard side and how to integrate its code with `auth0-js` library. Then, you connected the React client with the Web API and finally showed the book list returned by the server. If needed, you can find the final code and download it from the [GitHub repository](https://github.com/andychiare/react-auth0).
