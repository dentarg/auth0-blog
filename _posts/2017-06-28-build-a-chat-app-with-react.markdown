---
layout: post
title: "Build a Chat App with React, Auth0 and Pusher"
description: "Learn how to integrate React, Pusher, and Auth0 to create realtime applications."
date: 2017-06-28 08:00
category: Technical Guide, Frontend, ReactJS
author:
  name: "Yomi Eluwande"
  url: "https://twitter.com/yomieluwande"
  mail: "yomi.eluwande@gmail.com"
  avatar: https://cdn.auth0.com/blog/avatar/yomi-eluwande.png
design:
  bg_color: "#3666A5"
  image: https://cdn.auth0.com/blog/auth0-pusher/logo.png
tags:
- reactjs
- auth0
- pusher
related:
- 2017-02-21-reactjs-authentication-tutorial
- 2016-01-04-secure-your-react-and-redux-app-with-jwt-authentication
---

**TL;DR:** In this tutorial, I’ll show you how to build a secure chat app with React and Pusher using the Auth0 authentication service and a Node + Express Backend Server. We will use Auth0 to authenticate users so they can access the chat feature of a website.

[Auth0](http://auth0.com) is a platform that allows developers add authentication to their applications easily. It offers products like [Lock](https://auth0.com/docs/libraries/lock/v10), [Passwordless Authentication](https://auth0.com/passwordless), [Multifactor Authentication](https://auth0.com/docs/multifactor-authentication) and [Breached Password Detection](https://auth0.com/breached-passwords). It’s a service that helps to eliminate the headaches of authentication when building modern applications.

[Pusher](http://pusher.com) is a platform that builds realtime and scalable infrastructures for developers so you can spend more time building awesome features. Pusher offers features like [Presence Channels](https://pusher.com/docs/client_api_guide/client_presence_channels), [Pub/Sub Messaging](https://pusher.com/docs) and [Access Control](https://pusher.com/docs/authenticating_users).

As we go through the tutorial, we will be using these two awesome services to build an application that authenticates users via Auth0 and also features a group chat thanks to Pusher.

Here’s a preview of what we will be building.

![Chat app written with React, Auth0, and Pusher](https://cdn.auth0.com/blog/react-pusher/react-pusher-chat.gif)

An understanding of Javascript (ES6) and React is needed for this tutorial. An excellent primer on using React with Auth0 can be seen [here](https://auth0.com/docs/quickstart/spa/react/01-login).

## React Up - Creating the React App

We’ll be using the create-react-app command to bootstrap the app. The create-react-app CLI was built by the Facebook team to help users of React (especially beginners) start a React app with zero configurations. It helps to scaffold a React app with zero build configuration and just works out of the box.

Let’s install create-react-app and also scaffold a new React app so we can start building our chat app. We do that with the following commands:

```bash
yarn add create-react-app

create-react-app react-pusher
```

Once that’s completed, you can `cd` in to the react-pusher directory and run `yarn start` to start the app and see it on `localhost:3000` but before we do that, let’s install some dependencies. We’ll be using these dependencies later as we build our chat app:

```bash
yarn add auth0-js bootstrap events history react-bootstrap react-router react-router-dom
```

So, why do we need these dependencies?

1. `auth0-js` is the client side Javascript toolkit for the Auth0 API and how we connect to the Auth0 service/dashboard.
2. Bootstrap is a CSS framework and it comes with CSS features that will help in styling the chat app. It’s also needed for the `react-bootstrap` module.
3. `events` is Node's event emitter for all engines.
4. `history` is a JavaScript library that lets you easily manage session history anywhere JavaScript runs and we’ll be using it in our routes to manage navigation.
5. `react-bootstrap` is a library of reusable front-end components built with Bootstrap.
6. `react-router` and `react-router-dom` helps with routing in our React app.

At this point, your project directory should be very similar to the image below.

![React app structure](https://cdn.auth0.com/blog/react-pusher/react-project-structure.png)

Open up `index.js` inside the `src` folder and edit with the following code:

```jsx
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import { makeMainRoutes } from './routes';

const routes = makeMainRoutes();

ReactDOM.render(
  routes,
  document.getElementById('root')
);
```

We basically just imported ReactDOM, the `index.css` file, Bootstrap CSS framework, and a `routes` file that we will create later.

Now that we are done with scaffolding the React app, we can leave it and come back to it after setting up Pusher.

## Setting Up Pusher

Setting up Pusher means logging in to your dashboard (or [creating a](https://pusher.com/) [free](https://pusher.com/) [account](https://pusher.com/) if you don’t already have one) and creating a new app. Copy your app_id, key, secret and cluster and store them somewhere as we’ll be needing them later.

![Push management tool](https://cdn.auth0.com/blog/react-pusher/pusher-management-tool.png)

## Setting Up The Node Server

As mentioned above, we’ll need to create a Node.js server. We’ll be using Express as the Node.js framework. Let’s install the dependencies needed.

```bash
yarn add express pusher body-parser nodemon
```

The server will require an entry point so create a `server.js` file and type in the following code:

```js
// server.js
const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const app = express();
const Pusher = require('pusher');

//initialize Pusher with your appId, key and secret
const pusher = new Pusher({
    appId: 'APP_ID',
    key: 'APP_KEY',
    secret: 'SECRET',
    cluster: 'YOUR CLUSTER',
    encrypted: true
});

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// API route which the chat messages will be sent to
app.post('/message/send', (req, res) => {
  // 'private' is prefixed to indicate that this is a private channel
    pusher.trigger( 'private-reactchat', 'messages', {
        message: req.body.message,
        username: req.body.username
    });
    res.sendStatus(200);
});

// API route used by Pusher as a way of authenticating users
app.post('/pusher/auth', (req, res) => {
    const socketId = req.body.socket_id;
    const channel = req.body.channel_name;
    const auth = pusher.authenticate(socketId, channel);
    res.send(auth);
});

// Set port to be used by Node.js
app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
```

In the code block above, Pusher is initialized with the dashboard credentials, and the various API routes are also defined.
Now, let’s get back to building the ReactJS app.

## ReactJS App

Remember, we already scaffolded the ReactJS app s to make sure everything works fine, run the following command in the root of your project folder:

```bash
yarn start
```

That will run the required scripts necessary and your ReactJS app should work now at `http://localhost:3000`

![ReactJS hello world](https://cdn.auth0.com/blog/react-pusher/react-welcome.png)

Let's begin adding Auth0 to the React app.

**Set Up Auth0**

We’ll be using Auth0 to authenticate the users so go to [auth0.com](https://auth0.com/) and create an account. Once you are done creating the new account, you will be prompted to create a new client, so create one and name it anything you want or just use the default app. Take note of your client details in the settings tab.

![Auth0 management tool](https://cdn.auth0.com/blog/react-pusher/auth0-management-tool.png)

**Adding a Callback URL**

One more thing you'll need to configure on your Auth0 dashboard is the callback URL. A callback URL is a URL that your ReactJS application will redirect to after a successful authentication from Auth0. Under the settings tab in the Auth0 Dashboard, set your callback URL to `http://localhost:3000/callback`.

**Writing Auth0 Code**

Inside the `src` folder, create a folder `Auth`. In that folder, we'll create two JS files called `Auth.js` and `auth0-variables.js`.

The `auth0-variables.js` will contain our Auth0 credentials. Open the `auth0-variables.js` file and type in the following code:

```js
export const AUTH_CONFIG = {
    domain: 'yourname.auth0.com',
    clientId: 'xxxxxxxxxxxxxx',
    callbackUrl: 'http://localhost:3000/callback' //Callback URL set in the Auth0 dasbhoard.
}
```

Remember to edit with the credentials from your Auth0 dashboard. Next, open the `Auth.js` file and type in the following code:

```jsx
// imports EventEmitter
import { EventEmitter } from 'events';
// imports the Auth0 JS library
import auth0 from 'auth0-js';
// imports Auth0 credentials from the auth0-variables.js file
import { AUTH_CONFIG } from './auth0-variables';
// imports the history module, which will be created later
import history from '../history';

export default class Auth extends EventEmitter {
    // An instance of Auth0 is instantiated with Auth0 credentials gotten from the auth0-variables.js file
  auth0 = new auth0.WebAuth({
    domain: AUTH_CONFIG.domain,
    clientID: AUTH_CONFIG.clientId,
    redirectUri: AUTH_CONFIG.callbackUrl,
    audience: `https://${AUTH_CONFIG.domain}/userinfo`,
    // Telling Auth0 what to return after a successful authentication, in this case, the token and the id_token
    responseType: 'token id_token',
    // To retrieve a user's profile after authentication, we need to add openid profile to the the scope.
    scope: 'openid profile'
  });

    // Local variable to hold a user's profile after authentication
  userProfile;

    // The methods below are bound in the constructor with 'this'
  constructor() {
    super();
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getProfile = this.getProfile.bind(this);
  }

  login() {
    this.auth0.authorize();
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        history.replace('/home');
      } else if (err) {
        history.replace('/home');
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  setSession(authResult) {
    if (authResult && authResult.accessToken && authResult.idToken) {
      // Set the time that the access token will expire at
      let expiresAt = JSON.stringify(
        authResult.expiresIn * 1000 + new Date().getTime()
      );
      localStorage.setItem('access_token', authResult.accessToken);
      localStorage.setItem('id_token', authResult.idToken);
      localStorage.setItem('expires_at', expiresAt);
      // navigate to the home route
      history.replace('/home');
    }
  }

  getAccessToken() {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('No access token found');
    }
    return accessToken;
  }

  getProfile(cb) {
    let accessToken = this.getAccessToken();
    this.auth0.client.userInfo(accessToken, (err, profile) => {
      if (profile) {
        this.userProfile = profile;
        localStorage.username = profile.nickname;
      }
      cb(err, profile);
    });
  }

  logout() {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    this.userProfile = null;
    // navigate to the home route
    history.replace('/home');
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }
}
```

Let's go over the Authentication service above. The basic gist of the code block is that when a user is successfully authenticated at Auth0's login/signup page, they are redirected back to your page and there will be a hash in the URL containing their authentication information. We have some methods above and I'll go over them and what they do:

**login()**

The `login()` method calls the authorize function from auth0.js.

**handleAuthentication()**

The `handleAuthentication()` method looks for a result after a successful authentication in the browser URL hash and processes it with the parseHash method from auth0.js.

**setSession()**

This method sets the user's `access_token`, `id_token`, and a time at which the `access_token` will expire.

**getAccessToken()**

This method checks for an a`ccess_token` in the localStorage and throws an error if there's none.

**getProfile(cb)**

The `getProfile()` method utilizes Auth0's `clientInfo` which calls the `/userinfo` endpoint and retrieves the user's information. An `access_token` must be passed into the method as the first argument, and the second argument should have variables for error handling and to hold the user's profile. We then set the profile information to the `userProfile` variable declared above.

**logout()**

The `logout()` method removes the user's tokens from browser storage and effectively signs them out.

**isAuthenticated()**

The `isAuthenticated()` method checks whether the expiry time for the access_token has passed.

In the code above, we imported an `history.js` file which hadn't been created yet. `history` was used in some of our methods above to help with navigation, so let's create that now. Create a file named `history.js` inside the `src` folder and type in the following code:

```jsx
import createHistory from 'history/createBrowserHistory'
export default createHistory({
  forceRefresh: true
})
```

Now that we have the Auth0 part down, let's begin to test if the Authentication service we wrote above actually works and also begin to build our UI.

**Adding Routes**

We'll have four different routes in this application.

- Home route --> `/`
- Profile route --> `/profile`
- Chat route --> `/chat`
- Callback route --> `/callback`

So basically, a page that serves as the homepage, a page that will be used to authenticate users, a page that shows the user's profile, a page where users can chat and lastly the callback page route in which users will be redirected to after authentication. Let's create a route file and also the components above.

**Adding A Route file**

Inside the `src` folder, create a file named `routes.js` and type in the following code:

```jsx
import React from 'react';
import { Redirect, Route, BrowserRouter } from 'react-router-dom';
import App from './App';
import Auth from './Auth/Auth';
import history from './history';
// These components which will be created later will serve the various routes below
import Home from './Home/Home'; // The / route
import Profile from './Profile/Profile'; // The /profile route
import Chat from './Chat/Chat'; // The /chat route
import Callback from './Callback/Callback'; // The /callback route


//Instantiate the Auth0 service
const auth = new Auth();

// This function utilizes the handleAuthentication() method in Auth/Auth.js
const handleAuthentication = (nextState, replace) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication();
  }
}

// Routes are declared here and also exported for use in other components.
export const makeMainRoutes = () => {
  return (
    <BrowserRouter history={history} component={App}>
        <div>
          {/* '/' route*/}
          <Route path="/" render={(props) => <App auth={auth} {...props} />} />
          {/* 'Homepage' route*/}
          <Route path="/home" render={(props) => <Home auth={auth} {...props} />} />
          {/* 'Chat' route*/}
          <Route path="/chat" render={(props) => (
            !auth.isAuthenticated() ? (
              <Redirect to="/home"/>
            ) : (
              <Chat auth={auth} {...props} />
            )
          )} />
          {/* 'Profile' route*/}
          <Route path="/profile" render={(props) => (
            !auth.isAuthenticated() ? (
              <Redirect to="/home"/>
            ) : (
              <Profile auth={auth} {...props} />
            )
          )} />
          {/* 'Callback' route*/}
          <Route path="/callback" render={(props) => {
            handleAuthentication(props);
            return <Callback {...props} />
          }}/>        
        </div>
      </BrowserRouter>
  );
}
```

In the code block above, we declared the routes that we will be using in this ReactJS application, although the components for the routes are not created yet (that will be done soon).

One other thing we do in the code above is in the `/profile` and `/chat` route, as we check that a user is authenticated first before going to that route. If the user is not authenticated, they are automatically redirected to the `/home` page.

Before we start writing code for the various components, let's edit the `App.js` file inside the `src` folder. Open the `App.js` file and edit it with the following code:

```jsx
// Import React and Component from React
import React, { Component } from 'react';
// Import the Navbar, Nav, Button component from the react-bootstrap
import { Navbar, Nav, Button } from 'react-bootstrap';
// Import the CSS styles from the App.css file
import './App.css';

class App extends Component {
    // This function helps with navigation of different routes
  goTo(route) {
    this.props.history.replace(`/${route}`)
  }
    // This function calls on the auth login() function and logs in a user with Auth0
  login() {
    this.props.auth.login();
  }
    // This function calls on the auth logout() function and clears the localStorage thereby logging a user out.
  logout() {
    this.props.auth.logout();
  }

  render() {
        // Destructuring assignment syntax is used to get the isAuthenticated function from the Authentication service in Auth.js
    const { isAuthenticated } = this.props.auth;

    return (
      <div>
        <Navbar className="no-border" fluid inverse>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/home">ReactChat</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav className="pull-right">
            <Button
                className="btn-margin"
                onClick={this.goTo.bind(this, 'home')}
            >
              Home
            </Button>
              {
                  !isAuthenticated() && (
                      <Button
                          className="btn-margin"
                          onClick={this.login.bind(this)}
                      >
                        Login
                      </Button>
                  )
              }
              {
                  isAuthenticated() && (
                      <Button
                          className="btn-margin"
                          onClick={this.goTo.bind(this, 'profile')}
                      >
                        Profile
                      </Button>
                  )
              }
              {
                  isAuthenticated() && (
                      <Button
                          className="btn-margin"
                          onClick={this.goTo.bind(this, 'chat')}
                      >
                        Chat
                      </Button>
                  )
              }
              {
                  isAuthenticated() && (
                      <Button
                          className="btn-margin"
                          onClick={this.logout.bind(this)}
                      >
                        Log Out
                      </Button>
                  )
              }
          </Nav>
        </Navbar>
      </div>
    );
  }
}

export default App;
```

The Login and Logout buttons make calls to the Auth service in the `Auth.js` file via the onClick function attached to them so as to allow a user log in and out. These buttons will be shown based on the user's authentication state.
Therefore, when the Login button is clicked, the user will be redirected to Auth0's hosted login page.

![Auth0 hosted login page](https://cdn.auth0.com/blog/react-pusher/auth0-hosted0-login-page.png)

Let's also edit the `App.css` with the following:

```css
.btn-margin {
  margin: 7px 3px;
}
.no-border {
  border-radius: 0px;
}
```

**Adding a Home Component**

Inside the `src` folder, create a folder titled `Home`, and in it create a file named `Home.js`. Let's edit it with the following code:

```jsx
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Home extends Component {
  componentWillMount() {
      const { isAuthenticated, getProfile } = this.props.auth;
      if (isAuthenticated() ) {
          getProfile();
      }
  }
  login() {
    this.props.auth.login();
  }
  render() {
    const { isAuthenticated } = this.props.auth;
    return (
        <div className="container">
          <div className="jumbotron">
            <h1>Welcome to ReactChat!</h1>
              {
                  !isAuthenticated() && (
                      <div>
                        <p>We need you to sign in/sign up with Auth0 before you can access our chat. 😁</p>
                        <p><a className="btn btn-primary btn-lg" onClick={this.login.bind(this)}>Login</a></p>
                      </div>
                  )
              }
              {
                  isAuthenticated() && (
                      <div>
                        <p>Let's chat. 😁</p>
                        <Link className="btn btn-primary btn-lg" to="chat">Chat</Link>
                      </div>
                  )
              }
          </div>
            {this.props.children}
        </div>
    );
  }
}

export default Home;
```

We are simply displaying a welcome section for the users on this page. The content of the welcome section is displayed conditionally depending on the user's current authentication state.
If a user is signed in, they see a button to begin chatting and if a user isn't signed in, they see a button to log in. We also used `componentWillMount()` to get a user’s profile only if they are authenticated. This is important, as if we don’t do that, the Chat page would show an empty username on first load.

![ReactJS & Pusher Chat - welcome screen](https://cdn.auth0.com/blog/react-pusher/react-pusher-chat-welcome.png)

**Adding a Callback Component**

We mentioned the callback URL as a page the user sees after a successful authentication so let's create the page for that route.
Inside the `src` folder, create a folder titled `Callback`, and in it create a file named `Callback.js`. Let's edit it with the following code:

```jsx
import React, { Component } from 'react';
import loading from './loading.svg';

class Callback extends Component {
  render() {
    const style = {
      position: 'absolute',
      display: 'flex',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
    }

    return (
      <div style={style}>
        <img src={loading} alt="loading"/>
      </div>
    );
  }
}

export default Callback;
```

We’ll need a `loading.svg` file of some sort. I’ve created one [here](https://gist.github.com/yomete/d3b60f638306aad592cfa14edd70aae7) which you can download and place inside the `Callback` folder.

**Adding a Profile Component**

We want to be able to show a user’s profile and information gotten from Auth0, so let’s add the profile component.
Inside the `src` folder, create a folder titled `Profile`, and in it create a file named `Profile.js`. Let's edit it with the following code:

```jsx
import React, { Component } from 'react';
// Import Bootstrap components from react-bootstrap
import { Panel, ControlLabel, Glyphicon } from 'react-bootstrap';
// Import custom CSS from Profile.css
import './Profile.css';

class Profile extends Component {
  // componentWillMount() is invoked immediately before mounting occurs and we are setting the profile state to the value gotten from getprofile() which is called from the Auth service in Auth.js.
  componentWillMount() {
    this.setState({ profile: {} });
    const { userProfile, getProfile } = this.props.auth;

    // Check if there's a user profile, if there's none use the getProfile method from Auth. js to get a a profile and set it to the profile state.
    if (!userProfile) {
      getProfile((err, profile) => {
        this.setState({ profile });
      });
    } else {
      this.setState({ profile: userProfile });
    }
  }
  render() {
    // Using destructuring assignment to set the constant profile to the state
    const { profile } = this.state;
    return (
      <div className="container">
        <div className="profile-area">
          <h1>{profile.name}</h1>
          <Panel header="Profile">
            <img src={profile.picture} alt="profile" />
            <div>
              <ControlLabel><Glyphicon glyph="user" /> Nickname</ControlLabel>
              <h3>{profile.nickname}</h3>
            </div>
            <pre>{JSON.stringify(profile, null, 2)}</pre>
          </Panel>
        </div>
      </div>
    );
  }
}

export default Profile;
```

In the code above, we initially set the profile state inside the componentWillMount() method and we also check if there's a user profile. If there's not, use the getProfile method from Auth.js to get a a profile and set it to the profile state.
Inside the `render()` function we use the profile state values to populate the view with the user’s information.

We’ll also need a `Profile.css` inside the `Profile` folder. Create a file with that name and edit with the following code:

```css
.profile-area img {
  max-width: 150px;
  margin-bottom: 20px;
}

.panel-body h3 {
  margin-top: 0;
}
```

The profile page should look like this:

![User profile retrieved from Auth0](https://cdn.auth0.com/blog/react-pusher/user-profile.png)

**Adding a Chat Component + Pusher**

Let’s add the chat component so we can begin chatting. We will also integrate Pusher so we can see our chat messages update in realtime. Inside the `src` folder, create a folder titled `Chat`, and in it create a file named `Chat.js`. Let's edit it with the following code:

```jsx
import React, { Component } from 'react'
// Import CSS styles for Chat page
import './Chat.css'
// Import Bootstrap components from react-bootstrap
import { FormControl, Grid, Row, Col } from 'react-bootstrap';
// Import the axios library
import axios from 'axios'
// Import the Pusher JS library
import Pusher from 'pusher-js'

class Chat extends Component {
  // The state is initialized in the constructor and the functions below are bound with 'this'.
    constructor() {
        super();
        this.state = {
            value: '',
            username: '',
            messages: []
        };
        this.sendMessage = this.sendMessage.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    // componentWillMount() is invoked immediately before mounting occurs and we are setting the username state to the value gotten from the localStorage.
    componentWillMount() {
        this.setState({ username: localStorage.username });
        // Establish a connection to Pusher.
        this.pusher = new Pusher('APP_KEY', {
            authEndpoint: '/pusher/auth',
            cluster: 'YOUR_CLUSTER',
            encrypted: true
        });
        // Subscribe to the 'private-reactchat' channel
        this.chatRoom = this.pusher.subscribe('private-reactchat');
    }
    // componentDidMount() is invoked immediately after a component is mounted. Listen for changes to the 'messages' state via Pusher and updates it.
    componentDidMount() {
        this.chatRoom.bind('messages', newmessage => {
            this.setState({messages: this.state.messages.concat(newmessage)})
        }, this);

    }
    // Used to update the value of the input form in which we type in our chat message
    handleChange(event) {
        this.setState({value: event.target.value});
    }
    // This sends the message inside the input form and sends it to Pusher.
    sendMessage(event) {
        event.preventDefault();
        if (this.state.value !== '') {
            axios.post('/message/send', {
                username: this.state.username,
                message: this.state.value
            })
                .then(response => {
                    console.log(response)
                })
                .catch(error => {
                    console.log(error)
                })
            this.setState({value: ''})
        }
        else {
            // console.log('enter message')
        }
    }
    render() {
        // Renders the chat messages
        const messages = this.state.messages;
        const message = messages.map(item => {
            return (
                <Grid>
                    {message}
                    <Row className="show-grid">
                        <Col xs={12}>
                            <div className="chatmessage-container">
                                <div key={item.id} className="message-box">
                                    <p><strong>{item.username}</strong></p>
                                    <p>{item.message}</p>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Grid>
            )
        })
        // Renders the input form where the message to be sent is typed.
        return (
            <Grid>
                <Row className="show-grid">
                    <Col xs={12}>
                        {message}
                        <div className="chat-container">
                            <form onSubmit={this.sendMessage}>
                                <Col xs={5} xsOffset={3}>
                                    <FormControl
                                        type="text"
                                        value={this.state.value}
                                        placeholder="Enter message here"
                                        onChange={this.handleChange}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <input className="btn btn-primary" value="Send" type="submit" />
                                </Col>
                            </form>
                            <h4 className="text-center">Welcome, {this.state.username}</h4>
                            <h5 className="text-center">Begin chatting here.</h5>
                        </div>
                    </Col>
                </Row>
            </Grid>
        )
    }
}

export default Chat;
```

In the code block above, we established a connection to Pusher with the `APP_KEY`, created a function that uses the `/message/send` API route to send the chat message to Pusher and we also used the `componentDidMount()` method to listen to changes to the `messages` state and automatically render it on the chat page.

Let’s create the the `Chat.css` file and type in the following code:

```css
.chat-container {
    margin-top: 50px;
}
.chatmessage-container {
    border: 1px solid #ccc;
    border-radius: 5px;
    margin: 20px auto;
    width: 700px;
    display: table;
}
.message-box {
    background-color: #eee;
    padding: 20px;
    border-bottom: 1px solid #cccccc;
}
```

Before we run the app to test, we need to do one more thing.

**API Proxying**

Since we are also running a backend server, we need to find a way to run the React app and backend server together. API proxying helps with that.  To tell the development server to proxy any unknown requests (`/message/send`) to your API server in development, add a `proxy` field to your `package.json` immediately after the `scripts` object.

```bash
"proxy": "http://localhost:5000"
```

We’ll also edit the `scripts` object. Edit the `scripts.start` key to this `"nodemon server.js & react-scripts start"`. Your final `package.json` file should look like this:

```json
{
  "name": "pusher-auth0",
  "version": "0.1.0",
  "private": true,
  "devDependencies": {
    "react-scripts": "0.9.5"
  },
  "dependencies": {
    "auth0-js": "^8.7.0",
    "axios": "^0.16.2",
    "body-parser": "^1.17.2",
    "bootstrap": "^3.3.7",
    "events": "^1.1.1",
    "express": "^4.15.3",
    "history": "^4.6.1",
    "nodemon": "^1.11.0",
    "pusher": "^1.5.1",
    "pusher-js": "^4.1.0",
    "react": "^15.5.4",
    "react-bootstrap": "^0.31.0",
    "react-dom": "^15.5.4",
    "react-router": "^4.1.1",
    "react-router-dom": "^4.1.1"
  },
  "scripts": {
    "start": "nodemon server.js & react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  },
  "proxy": "http://localhost:5000"
}
```

You can now run `yarn start` in your terminal and see the app work on `http://localhost:3000/home`.

## Conclusion

We’ve seen how to use ReactJS, Auth0 and Pusher to build a chat app. We also saw how to use the `-private` channel and how to authenticate a user using the `/pusher/auth` endpoint.

ReactJS works very well with Pusher because of its declarative, unidirectional data flow. You can see more examples on React and Pusher [here](https://blog.pusher.com/making-reactjs-realtime-with-websockets/) and [here](https://blog.pusher.com/how-to-add-message-history-to-your-pusher-apps/).

The combination of Pusher and Auth0 can be extended to build wonderful use cases and applications. We could add social sign-ins with Auth0 and implement a “Who’s Online” feature thanks to Pusher. The possibilities are endless. You can learn more about both services by visiting their websites([Pusher](http://pusher.com) and [Auth0](http://auth0.com)).

You can check the [Github repository](https://github.com/yomete/pusher-auth0) for the source code.
