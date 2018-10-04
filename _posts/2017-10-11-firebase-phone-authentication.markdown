---
layout: post
title: "Phone Number Authentication With Firebase"
description: Learn how Firebase phone number authentication works.
date: 2017-10-11 8:30
category: Technical Guide, Data, Firebase
author:
  name: Prosper Otemuyiwa
  url: https://twitter.com/unicodeveloper?lang=en
  avatar: https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200
  mail: prosper.otemuyiwa@auth0.com
design:
  bg_color: "#4236C9"
  image: https://cdn.auth0.com/blog/firebasephoneauth/logo.png
tags:
- firebase
- phone
- passwordless
- authentication
- web-app
- auth0
related:
- 2016-05-14-how-passwordless-sms-authentication-can-improve-your-app
- 2016-01-27-setting-up-passwordless-authentication-with-the-auth0-dashboard
- 2017-04-21-facebook-account-kit-passwordless-authentication
---

---

**TL;DR:** In this tutorial, I'll show you how easy it is to authenticate users using phone numbers with Firebase. Check out the [repo](https://github.com/auth0-blog/firebase-phone-auth) to get the code.

---

Firebase Phone Number authentication offers a form of passwordless authentication, wherein users are authenticated on their access to another secure platform, instead of authenticated based on their possession of a password.

The secure platform in the case of Firebase phone number authentication is the user's cell phone. Authentication requires the users to have both the correct cell phone number and physical access to that phone. However, authentication using only a phone number can also be less secure than the other available methods because possession of a phone number can be easily transferred between users.

## Firebase Authentication Flow

The authentication flow is really simple.

* A user logs on to your web app and is presented with a login field that asks for their phone number.
* The user enters their phone number into the login field.
* Firebase's reCAPTCHA verifier swings into action by ensuring that the phone number verification request comes from one of the app's allowed domains.
* Once the user clicks `Log In`, a verification code is sent to the user's phone.
* The user is now requested to type the verification code they received by SMS.
* Firebase validates the verification code. If correct, a new user account is created and linked to the phone number.

## Setting Up Phone Number Authentication With Firebase

If you don't already have a Firebase account, [sign up](https://console.firebase.google.com) for one.

* Create a new project
* Open the **Authentication** section by the left side bar.
* On the **Sign-in Method** page, enable the **Phone Number** sign-in method.
* Ensure that your domain is listed in the **Authorized Domains** section. `localhost` is listed by default.

### Step 1: Set Up Firebase Config

In your fresh project directory, create an `index.html` file. Now, go back to the overview screen for your project and click on it. Then click `Add Firebase to your Web app`.  A popup will show like so:

![Popup](https://cdn.auth0.com/blog/firebasephoneauth/credentials.png)

Copy and paste it into your `index.html` file like so:

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Firebase Phone Authentication</title>
  <script src="https://www.gstatic.com/firebasejs/4.3.1/firebase.js"></script>
  <script>
    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyDGQQUw4xRJagflxcmct5k5Bqgc4x1_Yik",
      authDomain: "phoneauth-bbe99.firebaseapp.com",
      databaseURL: "https://phoneauth-bbe99.firebaseio.com",
      projectId: "phoneauth-bbe99",
      storageBucket: "phoneauth-bbe99.appspot.com",
      messagingSenderId: "1071451028890"
    };
    firebase.initializeApp(config);
  </script>
  <script src="https://cdn.firebase.com/libs/firebaseui/2.3.0/firebaseui.js"></script>
  <link type="text/css" rel="stylesheet" href="https://cdn.firebase.com/libs/firebaseui/2.3.0/firebaseui.css" />
  <link href="style.css" rel="stylesheet" type="text/css" media="screen" />
</head>
<body>
</body>
</html>
```

**Note:** We referenced the Firebase and FirebaseUI libraries. The FirebaseUI library provides simple, customizable UI bindings on top of Firebase SDKs to eliminate boilerplate code and promote best practices.

Create a `style.css` file and add the code to it:

_style.css_

```bash
* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

#container {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.clearfix {
  clear: both;
}

.hidden {
  display: none;
}

#user-info {
  border: 1px solid #CCC;
  clear: both;
  margin: 0 auto 20px;
  max-width: 400px;
  padding: 10px;
  text-align: left;
}

#photo-container {
  background-color: #EEE;
  border: 1px solid #CCC;
  float: left;
  height: 80px;
  margin-right: 10px;
  width: 80px;
}

#photo {
  height: 80px;
  margin: 0;
  width: 80px;
}

@media (max-width: 300px) {
  #photo-container,
  #photo {
    height: 40px;
    width: 40px;
  }
}
```

### Step 2: Set Up HTML Body Structure

Head over to your `index.html` file and add code to the body like so:


```
<body>
  <div id="container">
      <h3>Firebase Phone Number Auth. Demo</h3>
      <div id="loading">Loading...</div>
      <div id="loaded" class="hidden">
        <div id="main">
          <div id="user-signed-in" class="hidden">
            <div id="user-info">
              <div id="photo-container">
                <img id="photo">
              </div>
              <div id="name"></div>
              <div id="email"></div>
              <div id="phone"></div>
              <div class="clearfix"></div>
            </div>
            <p>
              <button id="sign-out">Sign Out</button>
              <button id="delete-account">Delete account</button>
            </p>
          </div>
          <div id="user-signed-out" class="hidden">
            <h4>You are signed out.</h4>
            <div id="firebaseui-spa">
              <h3>Single Page App mode:</h3>
              <div id="firebaseui-container"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <script src="app.js"></script>
</body>
</html>
```

We are fleshing out our app little by little. The `firebaseui-container` div will contain our login button. The `app.js` file will contain the app logic for authentication. This leads us to the next stage.

### Step 3: Set up Phone Number Authentication

Create an `app.js` file and add the code below to it:

```js
/**
 * @return {!Object} The FirebaseUI config.
 */
function getUiConfig() {
  return {
    'callbacks': {
      // Called when the user has been successfully signed in.
      'signInSuccess': function(user, credential, redirectUrl) {
        handleSignedInUser(user);
        // Do not redirect.
        return false;
      }
    },
    // Opens IDP Providers sign-in flow in a popup.
    'signInFlow': 'popup',
    'signInOptions': [
      // The Provider you need for your app. We need the Phone Auth
      firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      {
        provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
        recaptchaParameters: {
          type: 'image', // another option is 'audio'
          size: 'invisible', // other options are 'normal' or 'compact'
          badge: 'bottomleft' // 'bottomright' or 'inline' applies to invisible.
        }
      }
    ],
    // Terms of service url.
    'tosUrl': 'https://www.google.com'
  };
}

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

/**
 * Displays the UI for a signed in user.
 * @param {!firebase.User} user
 */
var handleSignedInUser = function(user) {
  document.getElementById('user-signed-in').style.display = 'block';
  document.getElementById('user-signed-out').style.display = 'none';
  document.getElementById('name').textContent = user.displayName;
  document.getElementById('email').textContent = user.email;
  document.getElementById('phone').textContent = user.phoneNumber;
  if (user.photoURL){
    document.getElementById('photo').src = user.photoURL;
    document.getElementById('photo').style.display = 'block';
  } else {
    document.getElementById('photo').style.display = 'none';
  }
};


/**
 * Displays the UI for a signed out user.
 */
var handleSignedOutUser = function() {
  document.getElementById('user-signed-in').style.display = 'none';
  document.getElementById('user-signed-out').style.display = 'block';
  ui.start('#firebaseui-container', getUiConfig());
};

// Listen to change in auth state so it displays the correct UI for when
// the user is signed in or not.
firebase.auth().onAuthStateChanged(function(user) {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('loaded').style.display = 'block';
  user ? handleSignedInUser(user) : handleSignedOutUser();
});

/**
 * Deletes the user's account.
 */
var deleteAccount = function() {
  firebase.auth().currentUser.delete().catch(function(error) {
    if (error.code == 'auth/requires-recent-login') {
      // The user's credential is too old. She needs to sign in again.
      firebase.auth().signOut().then(function() {
        // The timeout allows the message to be displayed after the UI has
        // changed to the signed out state.
        setTimeout(function() {
          alert('Please sign in again to delete your account.');
        }, 1);
      });
    }
  });
};

/**
 * Initializes the app.
 */
var initApp = function() {
  document.getElementById('sign-out').addEventListener('click', function() {
    firebase.auth().signOut();
  });
  document.getElementById('delete-account').addEventListener(
      'click', function() {
        deleteAccount();
      });
};

window.addEventListener('load', initApp);
```

Relax. Let's step through the code to understand what's really happening here.

The `getUiConfig` function is responsible for configuring the kind of authentication provider we want. The `Phone Number` and `Twitter login` options were specified here. The `reCaptchaParameters` option is configured to have the invisible reCaptcha.

The `reCaptchaParameters` options for our reCaptcha:

* **type:** We selected the _image_ type. Another option is _audio_.
* **size:** We selected _invisible_ size. Other options are _normal_ or _compact_.
* **badge:** We selected the reCaptcha badge to come in from the _bottomleft_, other options are _bottomright_ or _inline_.

Two sign in flows are available in Firebase:

* `redirect`, the default, will perform a full page redirect to the sign-in page of the provider (Google, Facebook...). This is recommended for mobile apps.
* The `popup` flow will open a popup to the sign-in page of the provider. If the popup is blocked by the browser, it will fall back to a full page redirect.

Here, we choose the `popup` option for convenience.

The first property in the `getUiConfig` is the `callbacks`. `signInSuccess` is one of the available callbacks. It takes in the `currentUser`, `credential` and `redirectUrl` arguments, then calls the `handleSignedInUser` function.

The callback returns `false`, meaning the page is not automatically redirected.

The `handleSignedInUser` function consists of the following:

```js
/**
 * Displays the UI for a signed in user.
 * @param {!firebase.User} user
 */
var handleSignedInUser = function(user) {
  document.getElementById('user-signed-in').style.display = 'block';
  document.getElementById('user-signed-out').style.display = 'none';
  document.getElementById('name').textContent = user.displayName;
  document.getElementById('email').textContent = user.email;
  document.getElementById('phone').textContent = user.phoneNumber;
  if (user.photoURL){
    document.getElementById('photo').src = user.photoURL;
    document.getElementById('photo').style.display = 'block';
  } else {
    document.getElementById('photo').style.display = 'none';
  }
};
```

The function displays the user's details on the screen. The `handleSignedOutUser` function does the same thing when the user signs out.

The function below simply listens to authentication state changes and displays the right UI based on those changes.

```js
firebase.auth().onAuthStateChanged(function(user) {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('loaded').style.display = 'block';
  user ? handleSignedInUser(user) : handleSignedOutUser();
});
```

The _delete_ function is pretty straightforward.

The _initApp_ function simply adds event listeners to the _sign-out_ and _delete-account_ buttons. When any of these buttons are clicked, they execute their respective handler functions.

```js
var initApp = function() {
  document.getElementById('sign-out').addEventListener('click', function() {
    firebase.auth().signOut();
  });
  document.getElementById('delete-account').addEventListener(
      'click', function() {
        deleteAccount();
      });
};
```

### Step 4: Run the App

**Note:** The twitter button login does not work. It is just there to beautify the UI and give the user a feel that there is an alternative login option. In production, there should always be alternative login options.

* Click on the `Sign in with phone` button.
    ![Sign in with Phone](https://cdn.auth0.com/blog/firebasephoneauth/landing.png)

* Choose your country, input your phone number and click `Verify`.
    ![Form](https://cdn.auth0.com/blog/firebasephoneauth/form.png)

* Recieve the short code sent by Firebase to your phone.
    <div class="phone-mockup">
      <img src="https://cdn.auth0.com/blog/firebasephoneauth/code.png" alt="Auth0's SMS received">
    </div>

* Input the short code into the verification form.
    ![Input Short code](https://cdn.auth0.com/blog/firebasephoneauth/verifyphonenumber.png)

* Click continue. Firebase will verify the code.
    ![Verify](https://cdn.auth0.com/blog/firebasephoneauth/verifyingandloggingin.png)

* Logged In User
    ![LoggedIn User](https://cdn.auth0.com/blog/firebasephoneauth/loggedin.png)


In your firebase project console, the `users` tab will reflect the newly logged-in user.

![Firebase User Console](https://cdn.auth0.com/blog/firebasephoneauth/firebaseuserbase.png)

## Aside: Passwordless Authentication With Auth0

**Auth0** issues [JSON Web Tokens](https://jwt.io/) on every login for your users. This means that you can have a solid [identity infrastructure](https://auth0.com/docs/identityproviders), including [single sign-on](https://auth0.com/docs/sso/single-sign-on), user management, support for social identity providers (Facebook, Github, Twitter, etc.), enterprise identity providers (Active Directory, LDAP, SAML, etc.) and your own database of users with just a few lines of code.

Auth0 also supports passwordless authentication. In Auth0's SMS authentication, users enter their phone number into a login field:

![sms-lock](https://cdn.auth0.com/blog/sms-authentication/sms-lock.png)

Users then receive a text message with a one-time password:

<div class="phone-mockup">
  <img src="https://cdn.auth0.com/blog/sms-authentication/auth0-sms.png" alt="Auth0's SMS received">
</div>

They then have five minutes to input that password into the app:

![sms-confirmation](https://cdn.auth0.com/blog/sms-authentication/sms-confirmation.png)

If this is a user’s first time logging in, a new account is created for their phone number. If their phone number matches an existing account, they are authenticated and logged into that account.

Check out how to authenticate users using passwordless on [Single Page Apps](https://auth0.com/docs/connections/passwordless#passwordless-on-single-page-apps), [Regular Web Apps](https://auth0.com/docs/connections/passwordless#passwordless-on-regular-web-apps), [iOS](https://auth0.com/docs/connections/passwordless#passwordless-on-ios) and [Android](https://auth0.com/docs/connections/passwordless#passwordless-on-android).

## Wrapping Up

Well done! You have learned how to authenticate users using phone numbers with Firebase. You should know that phone numbers that end-users provide for authentication will be sent and stored by Google to improve their spam and abuse prevention across Google services, including but not limited to Firebase.

As developers, you should ensure that users have appropriate end-user consent prior to using the Firebase Authentication phone number sign-in service.

One more thing. To prevent abuse, Firebase enforces a limit on the number of SMS messages that can be sent to a single phone number within a period of time. If you exceed this limit, phone number verification requests might be throttled. If you encounter this issue during development, use a different phone number for testing, or try the request again later.

Please let me know if you have any questions or observations in the comment section. 😊
