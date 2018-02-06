---
layout: post
title: "Developing Web Apps with ASP.NET Core 2.0 and React - Part 2"
description: "A practical tutorial showing how to setup and develop a modern Web application based on ASP.NET Core 2.0 and React."
longdescription: "In this series of posts, you will build a Web application based on ASP.NET Core 2.0 and React. To solve the identity management feature, you will integrate this stack with Auth0. In this second part of the series, you are going to create a Single Page Application (SPA) client based on React and integrate it with the ASP.NET Core API created in the previous part."
date: 2017-12-07 08:30
category: Technical Guide, React, Auth0
author:
  name: "Andrea Chiarelli"
  url: "https://twitter.com/andychiare"
  mail: "andrea.chiarelli.ac@gmail.com"
  avatar: "https://pbs.twimg.com/profile_images/827888770510880769/nnvUxzSd_400x400.jpg"
design:
  bg_color: "#3A1C5D"
  image: https://cdn.auth0.com/blog/asp-net-core-tutorial/logo.png
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
---

**TL;DR:** This is the second part of the series about developing a Web application based on ASP.NET Core 2.0 and React. [In the previous post](http://auth0.com/blog/developing-web-apps-with-asp-dot-net-core-2-dot-0-and-react-part-1), you built a secured Web API application that provides a list of books with ASP.NET Core 2.0. In this post, you will create a *Single Page Application* (SPA) client based on React to consume this API. You can find [the final code of the React client in this GitHub repository](https://github.com/andychiare/react-auth0).

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

## Creating an Auth0 SPA Client

Since you need to access a Web API secured with *Auth0*, the first thing you have to do is to create and configure an [Auth0 Client](https://auth0.com/docs/clients). In the previous part, you have used `curl` as a non-interactive client. Besides that, you have used the same client type for the integration tests.

Now, you are building a React SPA client. That is, your client is going to be guided by user interaction. As such, you need to head to [the Clients page on the Auth0 dashboard](https://manage.auth0.com/#/clients) and hit the *Create Client* button.

After clicking on this button, the dashboard will present to you a form where you will have to type a *Name* to your client and select its *type*. For this tutorial, you can set the name of your client as *React Auth0* and choose *Single Page Web Applications* as its type.

![Creating a React SPA client on Auth0](https://cdn.auth0.com/blog/react-aspnet-core/creating-an-auth0-client.png)

After that, you can click on the *Create* button. Clicking on it will make the dashboard redirect you to a tab called *Quick Start* inside your new client. As you are going to learn how to integrate your React app with the ASP.NET Core 2.0 API in this tutorial, you won't need to follow the instructions there. For now, what you will need to do is to set the *Allowed Callback URLs* field to `http://localhost:3000` in the *Settings* tab.

![Settings tab of a React SPA client on Auth0](https://cdn.auth0.com/blog/react-aspnet-core/settings-tab-on-auth0-client.png)

## Integrate the React App with Auth0

Now that you have created an Auth0 Client, you are ready to integrate your React application with Auth0.

As a first step, you will need to install the [`auth0.js`](https://github.com/auth0/auth0.js) NPM package. You can do this by typing the following command in the root directory of your project:

```shell
npm install --save auth0-js
```

Your users will authenticate themselves through [the Auth0 hosted login page](https://auth0.com/docs/hosted-pages/login). This is the simplest and most secure way to secure your application. In short, this service redirects users to a login page hosted by Auth0 where the authentication process happens. After that, users are redirected again to your application with tokens that can be used to fetch sensitive data from your ASP.NET Core 2.0 API.

After installing the `auth0-js` package, you will need to create a file called `Auth0Config.js` in the `src` directory of your React application project. Add the following content to this file:

```javascript
export const AUTH_CONFIG = {
    domain: 'YOUR_AUTH0_DOMAIN',
    clientID: 'YOUR_CLIENT_ID',
    redirectUri: 'http://localhost:3000',
    audience: 'https://onlinebookstore.mycompany.com'
};
```

As you can see, you are defining an object that contains the configuration properties of your Auth0 Client in this file. **Note that**, you will need to replace `YOUR_AUTH0_DOMAIN` and `YOUR_CLIENT_ID` placeholders with the corresponding values from your Auth0 Client. So, head to [the Clients page on the Auth0 Management Dashboard](https://manage.auth0.com/#/clients), choose the client that you have created in the previous section, select the *Settings* tab, and use the *Client ID* and the *Domain* values to replace these placeholders.

This file also contains another two properties:

1. `redirectUri`: This property contains the URL that your users will be redirected to after the authentication process. Currently, you set it to the home page of your React app. However, you will change it soon.
2. `audience`: This property contains the unique identifier of the Auth0 API that you have created in [the first article of this series](http://auth0.com/blog/developing-web-apps-with-asp-dot-net-core-2-dot-0-and-react-part-1).

## Create the Authentication Service

Next, you will need to create another JavaScript module. You will define this module inside a new file called `AuthService.js` in the `src` directory with the following code:

```javascript
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

As you can see, you imported the `auth0` namespace from the `auth0-js` package and the `AUTH_CONFIG` object from the module defined in the previous section. Then, you used the `auth0.WebAuth()` constructor to create an instance of the `auth0` client. To create this instance, you provided your Auth0 Client properties to this constructor. Alongside with these properties, you also provided values for the `responseType` property (which defines the type of response you want from the authorization server) and for the `scope` (which defines that you are expecting the server to send [the `sub` claim back to your app](https://auth0.com/docs/scopes/current#standard-claims)).

Finally, you defined a `login()` method that wraps the `auth0.authorize()` one.

With that, you are now ready to use the `AuthService` class in your application. So, open the `App.js` file and replace its code with this:

```javascript
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

You might be wondering: how can you add authorized users to your application? With Auth0, you have two options. First, which is the most common option, is to let visitors register themselves by submitting the *Sign Up* form shown by Auth0 or [by choosing one of the multiple identity providers that you can easily configure in your Auth0 clients](https://auth0.com/docs/identityproviders).

The second option is to manually register users through the Auth0 dashboard. You can do this by heading to the *Users* page on the Auth0 management dashboard. There, you will need to click on the *Create User* button in the upper right corner. This will make the dashboard show a form where you can provide the credentials for the new user.

![Creating users through the Auth0 management dashboard](https://cdn.auth0.com/blog/react-aspnet-core/auth0-user-creation-form.png)

## Managing sessions

 Until now we have an application that shows the [Auth0 hosted login page](https://auth0.com/docs/hosted-pages/login) when the user accesses its home page. Currently, if the user provides his credentials, he will get a result similar to the following:

![./xxx-images/auth0-active-session.png](./xxx-images/auth0-active-session.png)

This happens because we specified the application's home page as the page to redirect to after the user authentication. Our home page has an unconditional request to authenticate the user, so it redirects the user to the *Auth0* login page, but here the authentication service detects that the user is already authenticated and asks him if he wants to change his account in order to use the application.

This is a loop without escape since we didn't truly managed user authentication in our application. We need a way to track if a user is authenticated or not. In other words, we need a session management.

Let's add a few methods to the *AuthService* class that will help us to manage sessions:

```javascript
export default class AuthService {
...

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

The first method *handleAuthentication()* analyzes the authentication result from the *Auth0* login page by using the *auth0.parseHash()* method provided by the *auth0-js* library. If a valid result is received, a new session is created and the user is redirected back to the home page of our application. The *handleAuthentication()* method gets the *history* parameter: it represents the browser's history, but we will be back to it in a while. We also notice that the *handleAuthentication()* method calls the *setSession()* method to create a new session. In fact, this is the method that stores the info about the current session so that the application can verify if a session is live and can retrieve relevant data.

As we can see, *setSession()* stores the session's data in the *localStorage* of the browser. This means that data are kept even if the user closes the browser window. If we want a different behaviour, we could store that data in *sessionStorage*, so that the browser cleans session data when it is closed.

The last method *isAuthenticated()* checks if the session data stored in *localStorage* are still valid.

## Adding routing and callback URL

Before going to use the new methods of the *AuthService* class, we need to add routing support to our application. This allows us to separate the new session creation from the application's real point of access. In other words, we want to specify a different URL to which the authentication service will redirect the user.

In order to do this, we need to provide a callback URL in the *Bookstore* client configuration of the [Auth0 dashboard](https://manage.auth0.com), as shown in the following picture:

![./xxx-images/callback-url.png](./xxx-images/callback-url.png)

With this configuration, we are saying to *Auth0* authentication service that the provided URL is a valid URL to redirect to after authentication. This is a security measure to avoid unauthorized redirections.

We also need to specify the callback URL in the *Auth0Config.js* file:

```javascript
export const AUTH_CONFIG = {
    domain: 'YOUR_AUTH0_DOMAIN',
    clientID: 'YOUR_CLIENT_ID',
    redirectUri: 'http://localhost:3000/startSession',
    audience: 'http://localhost:63939/'
}
```

This setting says to the authentication service to redirect the user to the specified URL.

Let's now add routing support to our React application by installing [react-router](https://reacttraining.com/react-router/). So let's type the following command in the project's folder:

```shell
npm install --save react-router-dom
```

Now we can configure routing for our React application.



## Completing session management

With all the previous preparation, let's see how the *App* component code changes:

```javascript
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

The main changes concern the definition of two routes: the home page route, matching the root path, and the session creation route, matching the */startSession* path. Both routes are mapped to *render* functions.

The session creation route is mapped to a function that invokes *startSession()* method passing the browser's history as a parameter. The *startSession()* method calls the *handleAuthentication()* method of the *AuthService* class we analyzed earlier. This method returns a waiting React element to show while the asynchronous process is running.

The home page route is mapped to a function that calls the *renderHome()* method. The renderHome() method returns the *Home* component if the user is authenticated. Otherwise, it invokes the *login()* service and returns a waiting React element.

Now the user will be authenticated and redirected to the *Home* component content.



## Connecting the app and the secured Web API

Now that the authentication process is working fine, let's connect our client to the Web API providing the book list. We will implement it in the *Home* component as follows:

```javascript
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

In the constructor, we define the component's initial state. This state will be used in the *render()* method to show as an HTML unordered list the data contained in its *bookList* property. Such data will be retrieved after the component is mounted on the DOM (*componentDidMount*) by calling the */api/books* via *fetch()*.

Unfortunately, this code doesn't work for a couple of reasons. Provided that the Web API application we built in Part 1 of this series (**LINK TO PART 1**) is running, we need to enable our React application to call the Web API application. In fact, both are Web applications but running on different domains: the React application runs on *localhost:3000* domain while the Web API application runs on *localhost: 63939* domain. Due to the [same origin policy](https://en.wikipedia.org/wiki/Same-origin_policy) applied by browsers, the React application cannot send a HTTP request to a server in a different domain. In the development environment, we can enable the communication between the two application by simply adding a *proxy* value in the *package.json* file, as shown below:

```json
{
  "name": "react-auth0",
  "version": "0.1.0",
  "private": true,
  "proxy": "http://localhost:63939",
  ...
}
```

In the production environment, we should adopt a different approach, such as put the two applications under the same domain o enabling [CORS](https://auth0.com/docs/cross-origin-authentication) or using a reverse proxy.

Even with this change, we are still unable to get the data from the Web API because it is protected and we need to provide an access token. So, let's integrate once again the *AuthService* class by adding a method that returns the access token associated with the current session:

```javascript
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

Now we will use the new method to get the access token and pass it to the Web API as an authorization header, as shown by the following code:

```javascript
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

Finally, now we can get the book list and show it:

![./xxx-images/book-list.png](./xxx-images/book-list.png)



## Handling logout

As a final touch, we will add a logout button to allow the user to quit our application. So we add a *logout()* method to *AuthService* class as in the following:

```javascript
export default class AuthService {
...
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
	window.location.href = '/';
  }
}
```

The method simply removes the session data from the *localStorage* and redirects the user to the root page.

We use this method in the *App* component as depicted in the following code:

```javascript
class App extends Component {
  ...
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

We add a *logoutButton* React element to the *App* component markup when the user is authenticated. That button will call the *logout()* method when clicked allowing the user to remove the session data and move to the root URL of the application.

## Summary

In this second part of the series, we created a React-based client for the Web API application we implemented in the first part (**LINK TO PART 1**). We explored how to configure the client on the *Auth0* dashboard side and how to integrate its code with *auth0-js* library. Then we connected the React client with the Web API and finally showed the book list returned by the server. We described how to build the client in an incremental way, however the final code can be downloaded from the [GitHub repository](https://github.com/andychiare/react-auth0).
