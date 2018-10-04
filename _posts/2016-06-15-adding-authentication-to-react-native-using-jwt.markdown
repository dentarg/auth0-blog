---
layout: post
title: "Adding Authentication to Your React Native App Using JSON Web Tokens"
description: Using JWTs to authenticate your React Native app will help it to be both secure and easy to integrate with a variety of services.
date: 2016-06-15 8:30
alias: /2016/06/15/adding-authentication-to-react-native-using-jwt/
category: Technical Guide, Mobile, React Native
author:
  name: "Jeff Smith"
  url: "https://twitter.com/jeffreylees"
  mail: "jeff@jeffreyleesmith.com"
  avatar: "https://secure.gravatar.com/avatar/d5365965372e0c5843d836f660b51a84?size=200"
design:
  bg_color: "#232323"
  image: https://cdn.auth0.com/blog/react-native/logo.png
tags:
- react-native
- mobile
- jwt
related:
- 2016-04-19-react-router-alternatives
- 2016-03-28-xamarin-authentication-and-cross-platform-app-development
- 2015-12-08-converting-your-web-app-to-mobile
---

<div class="alert alert-danger alert-icon">
  <i class="icon-budicon-487"></i>
  <strong>This post is out of date.</strong> Our <em>React Native Lock</em> library is now deprecated in favor of the <a href="https://github.com/auth0/react-native-auth0">React Native toolkit for Auth0 API</a>. Thank you for your patience while we work on bringing you an updated tutorial. We have a <a href="https://auth0.com/docs/quickstart/native/react-native/">React Native quickstart guide</a> that might be helpful in the meantime.
</div>

## TL;DR
We're going to look at getting started with a very simple React Native app and the use of JSON Web Tokens to provide authentication for it. React Native is an innovative way to use a common language to build native apps for multiple platforms, and JWTs go nicely along with it to provide stateless authentication for our users that integrates well with almost any service we would need. A perfect combination! Let's get started!

## Getting Started

**React** is one of the most popular JavaScript libraries in the wild today, and for good reason. With the backing of a giant like Facebook, the effort was bound to go far, even with the initial skepticism with which it was met. React does some interesting things, introducing **JSX**, combining the JS and HTML in apps. But the use of React has skyrocketed over time, and **React Native** is its next iteration. React Native aims to allow developers to build React applications that will run natively on iOS and Android devices. This, of course, opens up a _huge_ array of options for developers, who are now able to build a native mobile app alongside a web app, reusing a significant portion of the code. Using React _everywhere_ will create harmony amongst an organization's web and mobile offerings, and it makes it an excellent choice as a platform.

{% include tweet_quote.html quote_text="React Native aims to allow developers to build React applications that will run natively mobile devices." %}

Speaking of choices, we have many, many choices out there that can help us with user authentication. One such method of authentication in our React Native app is [JSON Web Tokens][7]. The advantages to using JWTs over other, more _traditional_ authentication methods are many. The app will be stateless, and we don’t have to worry about issues like load balancing with sessions, or cookie problems. We can authenticate users across multiple domains, integrate easily with other authentication services, and reduce the load on our servers. Sounds great, right?

Here’s the thing. We, as developers, don’t need more complication in our apps, in our projects, or in our lives. User authentication is always a pain. _Someone_ always wants more [SSO authentication](https://auth0.com/blog/what-is-and-how-does-single-sign-on-work/) options. _Someone_ always wants better security. _Someone_ always finds vulnerabilities. And yes, there are vulnerabilities in any system. But mitigating the _chances_ of problems of all kinds - technical problems, server problems, cookie problems, hacking problems - is what we’re all trying to do all the time, isn’t it? An easy-to-implement token-based authentication system provides just that. If we’re building a React Native app, we are probably intending to cover multiple platforms with minimal changes. Let’s take it one step further and have the same stateless authentication procedures for all versions of our app, too.

### What We’re Building

This tutorial will demonstrate how to authenticate our users to a React Native app using [JSON Web Tokens][1]. We’ll go ahead and use [this Auth0 sample API][2] as our app’s backend. We’ll be building a little app that deals in the ever-ubiquitous Chuck Norris quotes (Who doesn’t love a good Chuck Norris joke?), and we’ll be authenticating our users with JWTs, which will be the primary purpose of this tutorial. We'll be developing using the iOS Simulator in this tutorial, but Android options are also available via React Native's documentation.

OK, let’s get started with our setup.

### Setup and Installation

First, we should cover the basics. You'll need to have [Node.js installed][12], and you'll need to have [Xcode installed][11] if you're developing on OS X, as we are in this tutorial. OK, let’s start by setting up a React Native app. We can start with a brand new one, for the purposes of this tutorial, so just spin up a new project. For anyone who is unfamiliar with React Native, the [documentation][3] has an excellent Getting Started page to help you practice getting that set up. If you follow along with the Getting Started post, you’ll have already set up and run your starting project with `react-native run-ios` and will have had the iOS Simulator up and going with your starter app in it. We'll build on that basic knowledge as we create our app. If you didn't walk through the Getting Started article just now, make sure you have the iOS Simulator running before we begin.

We also want to go ahead and clone [this Auth0 sample API][4] backend, which employs Node.js, and get it running locally. We can just leave that in a separate folder, and start it up before we begin work on our React Native app. We’ll also want to go ahead and grab [Tcomb’s Form Library][5] for easily adding forms to our app. We can do this most quickly with npm ( `npm install tcomb-form-native` ).

## Authenticating our React Native App Using JWTs

OK, so we have our backend downloaded and running locally. Let’s hit the URL associated with it - by default `http://localhost:3001/api/random-quote` using our web browser. This will reassure us that our backend that provides fun-filled Chuck Norris quotes is indeed working. OK, and here we go:

![Test of the JWT API Sample][image-1]

## Laying Out Our App

OK. Let's get started, now that we are all passingly acquainted with React Native and have our environment ready. First, let’s go ahead and require both `react` and `react-native`. Let’s go ahead and pick up our `tcomb-form-native` library as well. Now the start of our app should look something like this:

```node
var React = require('react');
var ReactNative = require('react-native');
var t = require('tcomb-form-native');

var {
  AppRegistry,
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  AlertIOS,
} = ReactNative;
```

Awesome. Also, let’s go ahead and swap out the original stylesheet with the one we’re going to use here, and register our component. These pieces will be at the very end of our app, after the functionality and after `render`:

```node
var styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 30,
    alignSelf: 'center',
    marginBottom: 30
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
});

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);
```

## Getting Into It

So, we have the building blocks for our app all set up. What do we want to do with it?

We’re going to need a few parts. For simplicity’s sake, we’ll have one, very simple form, which has two inputs - username and password. The user can opt to signup, login, or logout, depending on whether they already have an account. Once they are signed up or logged in, they’ll be able to click a button to get a Chuck Norris quote in an iOS popup message. When logged out, or before signing up, they'll get an error.

### JSON Web Tokens and AsyncStorage

The crux of this demo app, of course, is authenticating our React Native app with JSON Web Tokens. When a user signs up, or logs in, the backend API’s response will be a JWT. Any request to the protected quotes endpoint will include the current user’s saved JWT - if there is one - and this will prove to the backend that the user is, in fact, a logged in, authenticated session and grant them access. So we’ll be using [AsyncStorage][6] for that.

AsyncStorage provides a safe way to locally store tokens and data. It can be, in some ways, compared to a `LocalStorage` option. In iOs, all applications live in their own sandbox, so all of the files and data associated with an application are secured, they can't be accessed by other applications. One very important thing to note is that it's only secured for non-jailbreak iOs devices.

The `async` keyword prepended to some of our function names will allow us, primarily, to use the `await` keyword in turn. Using `await` essentially tells our script to leave the function and return when the following task is done. This is particularly useful when we're storing and retrieving items from AsyncStorage, as it allows us to finish doing so before proceeding with our function.

### What We Need

We’ll need three major methods for this app, among other smaller helpers (and excluding `render`):

1. A method for `_userSignup`, which will `POST` request to the endpoint `/users`, providing a username and a password. If the user doesn’t already exist, it will be created, and a JWT will be returned for the current session.
2. We will also need a method for `_userLogin`, which will `POST` request to `/sessions/create` with a username and password. Again, if successful, this will return a JWT for the session.
3. Lastly, we’ll need a method called `_getProtectedQuote`, which will `GET` request the endpoint `api/protected/random-quote` , including the session’s stored JWT, if there is one. The response, will, of course, be a Chuck Norris quote, if we are successful.

## Creating our React Native App

Let’s take a look now at our completed demo app, and then walk through it piece by piece. Feel free to try it out and get an idea of what it does, to start with: [https://github.com/jeffreylees/reactnative-jwts/blob/master/index.ios.js][8]

```node
var STORAGE_KEY = 'id_token';

var Form = t.form.Form;

var Person = t.struct({
  username: t.String,
  password: t.String
});

const options = {};
```

First and foremost, we have a `STORAGE_KEY` variable that we’re stashing the key we’ll be using in - in this case, `id_token`. We then follow that with the setup for `tcombs` forms library. `Person` will be made up of `username` and `password`, both required fields, both strings. We aren’t adding any extra options, although we certainly could extend the form, or separate the login/signup forms, if we wanted to practice with the forms library we’re using.

### Storing JWTs to Authenticate Users of Our React Native App

```node
var AwesomeProject = React.createClass({

  async _onValueChange(item, selectedValue) {
    try {
      await AsyncStorage.setItem(item, selectedValue);
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  },

```

So of course we're beginning our class, and then we start with `_onValueChange`, which is called when the value of a AsyncStorage item is changed. It is passed the item and the value, and it changes that value and `sets` it.

### Authenticating via JWT and Getting a Chuck Norris Quote

```node
async _getProtectedQuote() {
  var DEMO_TOKEN = await AsyncStorage.getItem(STORAGE_KEY);
  fetch("http://localhost:3001/api/protected/random-quote", {
    method: "GET",
    headers: {
      'Authorization': 'Bearer ' + DEMO_TOKEN
    }
  })
  .then((response) => response.text())
  .then((quote) => {
    AlertIOS.alert(
      "Chuck Norris Quote:", quote)
  })
  .done();
},
```

Getting a quote returns a simple string, which is displayed in a popup. In your real world application, what sort of data could you retrieve via the API for a user that is authenticated to your app via JWTs? The possibilities are endless.

![Chuck Norris Quote!][image-3]

`_getProtectedQuote` will first call up the stored JWT, `id_token`, if there is one, and will then proceed to issue a `GET` request to our backend API, using the `fetch()` method. This will include an `Authorization` header, which is required to then have the backend verify the signature of our JWT and confirm that it is, in fact, the current token being used by an authorized user of the app. The method response includes an alert popup that contains our Chuck Norris quote, with all it’s wittiness.

### Signing up Users and Acquiring a JWT

```node
_userSignup() {
  var value = this.refs.form.getValue();
  if (value) { // if validation fails, value will be null
    fetch("http://localhost:3001/users", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: value.username,
        password: value.password,
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      this._onValueChange(STORAGE_KEY, responseData.id_token),
      AlertIOS.alert(
        "Signup Success!",
        "Click the button to get a Chuck Norris quote!"
      )
    })
    .done();
  }
},
```

![User Signup][image-4]

`_userSignup` is called by pressing the Signup button, and collects the values of the form fields `username` and `password` before submitting those values via a `POST` request to the backend API. The backend will verify that we are, indeed, signing up a new user and will then return the JWT for the current session. It finally calls the `_onValueChange` method and uses it to set the new token.

### Logging in Users and Acquiring a JWT

```node
_userLogin() {
  var value = this.refs.form.getValue();
  if (value) { // if validation fails, value will be null
    fetch("http://localhost:3001/sessions/create", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: value.username,
        password: value.password,
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      AlertIOS.alert(
        "Login Success!",
        "Click the button to get a Chuck Norris quote!"
      ),
      this._onValueChange(STORAGE_KEY, responseData.id_token)
    })
    .done();
  }
},
```

Logging in as a user returns a simple popup message, but could be harnessed to redirect the user. It also is saving their JWT behind the scenes.

![User Login][image-2]

`_userLogin` is called by pressing the Login button. This does the same thing, essentially, as `_userSignup` - it checks for an existing user with these credentials, this time, of course, only accepting the request if there _is_ such a user, and responds with a JWT for us to store.

### Logging out Users and Removing a JWT

```node
async _userLogout() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    AlertIOS.alert("Logout Success!")
  } catch (error) {
    console.log('AsyncStorage error: ' + error.message);
  }
},
```

Logging out returns a simple popup message, same as the others above, but again, this could be where we hook into whatever routing system we're intending to set up and redirect the user. And of course, we're removing their JWT from `AsyncStorage` behind the scenes. Any further attempts to get quotes will result in errors.

![User Logout][image-6]

`_userLogout` is called by pressing the Logout button. It very simply attempts to remove the `AsyncStorage` item with our `STORAGE_KEY`, so in this case, our `id_token`.

### Rendering our App UI

```node
render() {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.title}>Signup/Login below for Chuck Norris Quotes!</Text>
      </View>
      <View style={styles.row}>
        <Form
          ref="form"
          type={Person}
          options={options}
        />
      </View>
      <View style={styles.row}>
        <TouchableHighlight style={styles.button} onPress={this._userSignup} underlayColor='#99d9f4'>
          <Text style={styles.buttonText}>Signup</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.button} onPress={this._userLogin} underlayColor='#99d9f4'>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableHighlight>
      </View>
      <View style={styles.row}>
        <TouchableHighlight onPress={this._getProtectedQuote} style={styles.button}>
          <Text style={styles.buttonText}>Get a Chuck Norris Quote!</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
}

});
```

![Our React Native App][image-5]

`render`, last but not least, is what renders our app for the visitor to see. This is where we output our form, our buttons, and anything else we need the user to see.

Again, take a look here [https://github.com/jeffreylees/reactnative-jwts/blob/master/index.ios.js][8] for the completed code.

## Aside - Using Auth0 in Your React Native App

If you're convinced that using JSON Web Tokens to authenticate your React Native app is the way to go, take a look at Auth0's [Lock Widget][9]. Auth0 uses JSON Web Tokens for your logins, and also allows easy management of users, and easy integration of other social logins like Twitter or Facebook, or logins from a local database, or even from Active Directory. Let's take a quick look at installing the Auth0 Lock Widget in our React Native app. If you want a more detailed look, pop over to the [Auth0 Documentation][10].

### Adding Lock to our React Native Project

First, we will need to install `CocoaPods`, which is used for fetching native dependencies, using the following command:

```
gem install cocoapods
```

Then we need to install `react-native-lock`:

```
npm install --save react-native-lock
```

And then, rnpm:

```
npm install rnpm -g
```

Finally, link `react-native-lock` with your iOS project.

```
rnpm link react-native-lock
```

If you have any trouble, refer to the [Auth0 Documentation][10] for more information.

### Implementing the Lock Widget

OK, so everything is installed, let's get our Lock Widget going. Start out with our requirements:

```
var Auth0Lock = require('react-native-lock');
var lock = new Auth0Lock({clientId: YOUR_CLIENT_ID, domain: YOUR_DOMAIN});
```
You get the client ID and the domain from your Auth0 dashboard. Create your app there, and then take down the values needed and paste them in here.

Finally, you implement the Lock Widget. In the above app, this could be nested into `_userLogin` (removing the rest of its content) perhaps, to show when a user clicks the login button, or we could simply start out with a view of only the Lock Widget and then let a user proceed from there. How you want to implement it is entirely up to you!

```node
lock.show({}, (err, profile, token) => {
  if (err) {
    console.log(err);
    return;
  }
  // Authentication worked!
  console.log('Logged in with Auth0!');
});
```

When the login is successful, the callback will give `profile` and `token` parameters, which could be used to display further user information, if we were to expand our app and collect more user data. This could be particularly useful for welcoming a user (Hello, John!) or for displaying a brief profile. Again, how you want to expand from here is all up to you! Check out the [Auth0 Documentation][10] for more information on the Lock Widget, as well as the others, such as the Passwordless widgets.

## Conclusions

We have an extremely simple demo app here, a single two-field form, and a query that simply grabs a Chuck Norris quote from an API. If we want to further the exercise and get deeper into React Native, we could look up some information on routing to split the app into separate views, or do some research and learn about the conundrum of conditionals in JSX.

But even this little dabble into JWT authentication makes us see how incredibly useful it could be for React Native app development. With React Native, developers are able to create applications that perform nearly identically across Android and iOS devices, and coupled with React development for the Web, a fiercely competitive, cross-platform suite emerges. With this amount of cross-device and cross-platform work available, the need for easy authentication emerges, and with JSON Web Tokens, the ease with which it can be implemented on diverse types of applications is incredible.

Go ahead and implement JWT authentication in your own current React Native apps, or extend our demo app into something far greater, and get involved at [jwt.io][7]!

You can also learn more about [ReactJS Authentication](https://auth0.com/blog/adding-authentication-to-your-react-flux-app/) while using Flux.

[1]:  https://jwt.io/introduction/ "What are JSON Web Tokens?"
[2]:  https://github.com/auth0-blog/nodejs-jwt-authentication-sample "Auth0 JWT Sample Authentication API"
[3]:  https://facebook.github.io/react-native/docs/getting-started.html#content "React Native - Getting Started"
[4]:  https://github.com/auth0-blog/nodejs-jwt-authentication-sample "Auth0 JWT Sample Authentication API"
[5]:  https://github.com/gcanti/tcomb-form-native "Tcomb's Forms Library"
[6]:  https://facebook.github.io/react-native/docs/asyncstorage.html "AsyncStorage - React Native"
[7]:  https://jwt.io/ "JWT.io"
[8]:  https://github.com/jeffreylees/reactnative-jwts/blob/master/index.ios.js "reactnative-jwts - index.ios.js"
[9]:  https://auth0.com/lock "Auth0 Lock Widget"
[10]: https://auth0.com/docs/quickstart/native-mobile/react-native-ios/no-api "Auth0 Quickstart Documentation - React Native"
[11]: https://developer.apple.com/xcode/ "XCode"
[12]: https://nodejs.org/en/download/ "Node.js"

[image-1]:  https://cdn.auth0.com/blog/react-native/reactnative-jwts_api-test.png "API Sample Test"
[image-2]:  https://cdn.auth0.com/blog/react-native/login.png "Login Response"
[image-3]:  https://cdn.auth0.com/blog/react-native/quote.png "Chuck Norris Quote"
[image-4]:  https://cdn.auth0.com/blog/react-native/signup.png "Sign Up Response"
[image-5]:  https://cdn.auth0.com/blog/react-native/app.png "Our React Native App"
[image-6]:  https://cdn.auth0.com/blog/react-native/logout.png "Logout Response"
[reactnative_logo]: https://cdn.auth0.com/blog/react-native/react_native.png "React Native Logo"
[jwt_io_logo]:  https://cdn.auth0.com/blog/react-native/jwt_io.png "JWT.io Logo"
