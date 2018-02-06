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

## Creating a React application

The client application we are going to create is a Web application based on [React](https://reactjs.org/) that will use the API we built in Part 1 (**LINK TO PART 1**) of this series. The Web API returns a list of books, but since an authorization token is required in order to get the data, we will also deal with authentication and authorization issues.

Let's start by creating a very basic React application. We have a few alternatives to create a new application: starting from scratch, using one of the several [boilerplates](https://www.google.it/search?q=react+js+boilerplate&oq=reactjs+blierplate&aqs=chrome.1.69i57j0l5.9552j0j7&sourceid=chrome&ie=UTF-8) we can found on the Web or using [create-react-app](https://github.com/facebook/create-react-app). Using  [create-react-app](https://github.com/facebook/create-react-app) has a lot of benefits: it sets up a React application in a few minutes, it provides a ready to use development environment that doesn't require to deal with complex configuration, it is well documented, if we need it allows to export the application project so that we are no longer bound to the tool itself and, last but not least, the tool has been developed by the React team, and this guarantees that the best practices for working with React are applied.

But what is [create-react-app](https://github.com/facebook/create-react-app)? It is a *command line interface* (CLI) that allows us to setup a React-based application without needing to configure transpilers, syntax checkers, module bundlers, task runners and other tools required by modern JavaScript development. It is based on *Node.js* and can be installed on your machine by typing the following command:

```shell
npm install -g create-react-app
```

After installation we can create our React application by typing the following command in a console window:

```shell
create-react-app react-auth0
```

This will create in the current folder a folder named *react-auth0* and will put in it all the stuff needed for a minimal but working React-based application. The creation process may take a few minutes since it has to download the *npm* packages needed for the project.

Once the application setup is complete, we can run the application by typing:

```shell
npm start
```

After a few seconds, the default browser will be opened and we will see the following page:

![./xxx-images/react-app-ok.png](./xxx-images/react-app-ok.png)

This means that the app is working and ready to be changed.



## Creating an Auth0 SPA client

Since we need to access a Web API secured with *Auth0*, the first thing we have to do is getting the data to configure the client. In the previous part, we used Postman as a non-interactive client, and we used the same type of configuration for the integration tests. Now we are building an interactive client, that is a client that will be guided by user interaction, so we need to create a new client on the [Auth0 dashboard](https://manage.auth0.com) and specify that we are building a SPA client:

![./xxx-images/auth0-create-client.png](./xxx-images/auth0-create-client.png)

We will get a new configuration whose data are provided on a screen like the following:

![./xxx-images/bookstore-client-config.png](./xxx-images/bookstore-client-config.png)



If you compare these new configuration data with the data for a non-interactive client, you will find that there are a few small differences, but we will integrate these data with other info in order to correctly manage the user authentication process. Of course, we need to use these new configuration data to reconfigure the Web API application so that the client and the server are aligned.



## Integrate the React app with Auth0

Now we are ready to integrate our basic React application with the [Auth0](https://auth0.com/) security services.

As a first step let's install the [auth0.js](https://github.com/auth0/auth0.js) library. We can do it by typing the following command in a console:

```shell
npm install --save auth0-js
```

Now we can add *Auth0* authentication support by enabling the [Auth0 hosted login page](https://auth0.com/docs/hosted-pages/login). This is the simplest and more secure way to integrate the *Auth0* authentication service in your application. In short, this service redirects the user to a login page hosted on *Auth0* servers where the authentication process happens. After the user is authenticated, he is redirected again to the pages of your application with the data proving user's identity and possible authorization.

So we add an *Auth0Config.js* file in the *src* folder of our React application project with the following content:

```javascript
export const AUTH_CONFIG = {
    domain: 'YOUR_AUTH0_DOMAIN',
    clientID: 'YOUR_CLIENT_ID',
    redirectUri: 'http://localhost:3000',
    audience: 'http://localhost:63939/'
}
```

This module defines an object containing the configuration data of our client. Of course, you need to replace *YOUR_AUTH0_DOMAIN* and *YOUR_CLIENT_ID* placeholders with the corresponding data from your Auth0 dashboard.

The *redirectUri* property contains the URL where the user will be redirected after the authentication. Currently is the home page of our client, but we will change it later.

The *audience* property contains the URL of the server and it must match the configured audience on the server side.

## Create the authentication service

Now we need to create another JavaScript module, *AuthService.js*, containing the definition of an authentication service, as shown below:

```javascript
import auth0 from 'auth0-js';
import {AUTH_CONFIG} from './Auth0Config';

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

As we can see, we imported the *auth0* namespace from the *auth0-js* library and the *AUTH_CONFIG* object from the module we defined before. Then we used *auth0.WebAuth()* constructor to create an instance of the *Auth0* client provided by the *auth0-js* library. We provided the *Auth0* configuration data to the constructor. We also provided values for the *responseType* property, saying the type of response we want from the authorization server, and for the scope, saying that we want an [OpenID Connect conformant](https://auth0.com/docs/api-auth/tutorials/adoption) authentication.

Finally, we defined a *login()* method that wraps the *auth0.authorize()* method. The *AuthService* class is now ready to be used.

Now we can open the *App.js* file and change its code as follows:

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

We imported the *AuthService* class, added a constructor to the *App* component and created an instance of the *AuthService*. Finally we invoked the *login()* method inside the *render()* method of the component.

Now, when running the app we will no longer see the standard *create-react-app* home page, but we will see the following one:

![./xxx-images/auth0-login-page.png](./xxx-images/auth0-login-page.png)

This is the *Auth0 hosted login page* asking the user to provide his credentials in order to access our application.

## Create users for the app

How can we add users authorized to access our application? We have two options: let the users to autonomously register or adding them from the *Auth0* dashboard.

The first option allows the user to register by selecting the *Sign Up* tab and providing an e-mail address and a password.

![./xxx-images/auth0-signup.png](./xxx-images/auth0-signup.png)

After submitting the required data, a confirmation e-mail is sent to the user to complete the registration process. The first time a user accesses our application a warning message is shown like the following:

![./xxx-images/auth0-warning.png](./xxx-images/auth0-warning.png)



The second option requires that we create a user from the *Auth0* dashboard by selecting the *Users* item on the left menu and then by clicking the *Create User* button in the upper right corner:

![./xxx-images/auth0-users-dashboard.png](./xxx-images/auth0-users-dashboard.png)

A form will be shown where you can provide the credentials for the new user:

![./xxx-images/autho-dashboard-create-user.png](./xxx-images/autho-dashboard-create-user.png)

After user creation, the same process as the sign up happens, that is a confirmation e-mail is sent to the user in order to complete the registration.



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
