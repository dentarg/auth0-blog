---
published: false
layout: post
title: "Firebase Authentication with the Firebase 3.0 SDK and Auth0 Integration"
description: "Build a serverless Firebase app using the new Firebase 3.0 SDK. Secure your app with Firebase authentication and learn about custom authentication through Auth0."
date: 2016-06-08 08:30
alias: /2016/06/08/firebase-authentication-with-firebase-3.0-and-auth0-integration/
category: Technical Guide, Data, Firebase
author:
  name: "Ado Kukic"
  url: "https://twitter.com/kukicadnan"
  mail: "ado@auth0.com"
  avatar: "https://s.gravatar.com/avatar/99c4080f412ccf46b9b564db7f482907?s=200"
design:
  bg_color: "#003C6A"
  image: "https://cdn.auth0.com/blog/new-firebase/firebase_logo.png"
tags:
- Firebase
- Firebase 3.0 SDK
- Firebase Authentication
- Firebase Custom Authentication
- Auth0 Delegation
related:
- 2016-05-14-how-passwordless-sms-authentication-can-improve-your-app
- 2016-04-20-everything-you-wanted-to-know-about-oauth-2-but-were-too-afraid-to-ask
- 2016-04-07-integrate-auth0-into-your-existing-saas-tools
---

---

**TL;DR** Firebase is a real-time platform that allows developers to build serverless web and mobile apps. Release of the Firebase 3.0 SDK brings a refined API and additional features to the platform. We'll build an app with the new SDK, implement Firebase authentication and show how you can integrate Auth0 for additional functionality.

As the new SDK has not propogated to the official Firebase helper libraries, such as [AngularFire2](https://github.com/angular/angularfire2) or [EmberFire](https://github.com/firebase/emberfire/), our app will be written in plain ol' JavaScript. Grab the [Github repo](https://github.com/auth0-blog/fireteller) if you would like to follow along.

---

At this year's Google I/O conference, [Firebase](https://firebase.google.com) took the spotlight and ran with it. A major update pushes Firebase closer to becoming *the* platform for building real-time web and mobile apps. Firebase can now be a one-stop shop for your entire application, from inception to post-deployment.

Firebase is a real-time database-as-a-service platform that allows developers to build apps that propagate updates in real-time. Through the Firebase SDK, apps can talk directly to the database without the need for a backend - but is not limited to this paradigm. The new Firebase offers much more and we'll look at what's new next.

{% include tweet_quote.html quote_text="Firebase can be a one-stop shop for your entire app, from inception to post-deployment." %}

## The New Firebase

![The New Firebase](https://cdn.auth0.com/blog/new-firebase/firebase-home.png)

The new updates to the platform have been categorized into three sections: **Develop**, **Grow**, and **Earn**. A new SDK, version 3.0, accompanies the new Firebase. The new SDK has many breaking changes and is incompatible with earlier versions. While there are many changes, the functionality remains familiar.

For example, with Firebase SDK 2.x, if you wanted to retrieve a list of records from an endpoint you would do so like this:

```
// Get a database reference to our posts
var ref = new Firebase("https://docs-examples.firebaseio.com/web/saving-data/fireblog/posts");
// Attach an asynchronous callback to read the data at our posts reference
ref.on("value", function(snapshot) {
  console.log(snapshot.val());
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});
```

With the new Firebase SDK 3.0, to retrieve a list of records you would do:

```
firebase.database().ref('posts').on('value', function(snapshot) {
  console.log(snapshot.val());
});
```

Check out the [migration guide](https://firebase.google.com/support/guides/firebase-web) to learn about all the changes if you are migrating an existing Firebase app to the new SDK. Let's examine how the new Firebase makes developing apps awesome.

### Develop

When we talk about Firebase, we generally are talking about the real-time database feature of the platform, but there is much more to it than that. Website **hosting** as well as **file storage** allow you to get your app up and running without thinking about servers and infrastructure. Additionally, utilities for authentication, testing, analytics, and crash reporting are included. Finally, the [Firebase CLI](https://firebase.google.com/docs/cli/) allows you to easily create and deploy your app with just a few simple commands.

### Grow

Once your app is built, Firebase offers a suite of tools to help you grow your audience. **Notifications** allow you to engage users and **Dynamic Links** allow you to set the context for the user, while **App Indexing** allows your app to be discovered. **Invites** and **AdWords** allow you to spread the word to a wider audience. The features in this section primarily target mobile applications.

### Earn

Monetizing your app can be done via **AdMob**. The integration can simply be turned on from your Firebase console once you have an active AdMob account.

{% include tweet_quote.html quote_text="The new Firebase allows you to Develop, Grow, and Earn. Make it even better with Auth0!" %}

## FireTeller - Our Firebase 3.0 App

The app we'll be building is called FireTeller. It is a collaborative storytelling app with a twist - anyone can contribute a piece to the story and the stories are told through *emojis*. To see the app in action, [click here](https://project-8302152786657556368.firebaseapp.com/), if you would like to get the completed code and follow along, check out the [GitHub repo](https://github.com/auth0-blog/fireteller). [Sign up](https://firebase.google.com) for a free Firebase account before continuing.

### From Humble Beginnings

To get started, we'll install the Firebase CLI. You'll need [NodeJS](https://nodejs.org) and [npm](https://npmjs.com), so once you have those installed, in a terminal window enter the following command: `npm install -g firebase-tools`. Once the install is complete, type `firebase login` and you will be prompted to log in to your Firebase account and grant permissions so the CLI can do its thing. Finally, navigate to a directory where you want your app to live and type `firebase init` to create a new application. You will go through a number of steps to setup the initial app, selecting the default for each should work just fine.

![Creating a new Firebase application](https://cdn.auth0.com/blog/new-firebase/firebase-init.png)

Once the setup is complete, run the `firebase serve` command and your application will launch at `localhost:5000`. Navigate to `localhost:5000` now to make sure everything is running smoothly. If it is, you'll see a splash screen telling you that you are ready to go.

![Firebase Splash Screen](https://cdn.auth0.com/blog/new-firebase/firebase-splash.png)

### Building the UI

We will build our entire UI in the `index.html` file located in the `public` directory that the CLI has already created for us. Open the file and strip out the existing code. Here is what our app is going to look like:

![Fireteller App](https://cdn.auth0.com/blog/new-firebase/fireteller-app.png)

Let's build that UI.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>FireTeller</title>
    <link href="https://afeld.github.io/emoji-css/emoji.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/css/bootstrap.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
    <script src="https://www.gstatic.com/firebasejs/live/3.0/firebase.js"></script>
  </head>
  <body>
    <div class="container">
      <div class="col-sm-8 col-sm-offset-2">
        <div class="clearfix top-bar">
          <div id="email" class="pull-left"></div>
          <div class="pull-right">
            <a onclick="logout()" class="btn btn-danger" id="logout-btn">Logout</a>
          </div>
        </div>
      </div>

      <div class="col-sm-10 col-sm-offset-1">
        <h2 class="text-center">Once Upon a Time...</h2>

        <div class="jumbotron">
          <div id="story"></div>
        </div>
      </div>

      <div class="col-sm-8 col-sm-offset-2">
        <div id="signin-btn" class="btn btn-success btn-block" onclick="login()">Sign Up To Contribute</div>
        <div id="contrinbute">
          <p><strong>Contribute <small>(Select an emoji to add it to the story)</small> <span class="pull-right" onclick="getRandomEmoji()">Refresh</span></strong></p>
          <div id="options"></div>
        </div>
      </div>

      <div class="col-sm-8 col-sm-offset-2">
        <h2 class="text-center">Stories</h2>
        <div id="stories"></div>
      </div>
    </div>
  </body>
</html>
```

Next, let's create an `app.js` file that will handle our app logic. For now, we'll just initialize our Firebase app. The values for the config can be found in your [Firebase console on](https://console.firebase.google.com) the homepage of your app.

```js
var config = {
  apiKey: "YOUR-API-KEY",
  authDomain: "YOUR-DATABASE-NAME.firebaseapp.com",
  databaseURL: "https://YOUR-DATABASE-NAME.firebaseio.com",
};
firebase.initializeApp(config);
```

Finally, we'll create an `emoji.js` file that will contain an array of all the possible emojis. We'll also add a variable that will give us the total count of emojis which we'll use later in the app. *Note: As this is a demo app, we are declaring some global variables, this should be avoided in real applications.*

This file will look like:

```
var emoji = [...]; // Array of all possible emojis
var emoji_count = emoji.length;
```

Be sure to include both the `app.js` and the `emoji.js` files in your `index.html` page.

### Setting Up Our Data Model

Our data model will consist of the current story being written and an array of all existing stories. Let's update our `app.js` file to retrieve our current story and existing stories.

```js
// Anytime the stories endpoint changes data, we'll call this function
// which empties the current list of stories and generates a new list
// The generateStory(story) function is described below
firebase.database().ref('stories').on('value', function(data) {
  $('#stories').empty();
  data.forEach(function(story) {
    generateStory(story);
  });
});

// Anytime the story endpoint is changed, we similarly update
// the current story.
firebase.database().ref('story').on('value', function(data) {
  $('#story').empty();
  data.forEach(function(data) {
    var emoji = data.val();
    $('#story').append('<i class="em em-' + emoji + '"></i>');
  });
})

// The generate story function renders a story for each item in
// the stories array and sets the latest story to the top of the stack.
function generateStory(story) {
  var $div = $("<div>");
  $('#stories').prepend($div);
  story.forEach(function(page) {
    $($div).append('<i class="em em-' + page.val() + '"></i>');
  });
}

// We'll add this code which will track changes to user authentication
// and will hide or show certain features based on the users
// authentication state
// We'll comment out this code for now though.
/*
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    $('#logout-btn').show();
    $('#signin-btn').hide();
    $('#contrinbute').show();
  } else {
    $('#logout-btn').hide();
    $('#signin-btn').show();
    $('#contrinbute').hide();
  }
});
*/
```

If we had data in our database we would now see it in our application - but alas we do not. Let's add the functionality to create stories next.

```js
// We have over 800 emojis, rather than display them all at once
// we'll show the user a list of 20 random emojis. We'll also
// call this function to get an initial list of emojis for the user.
function getRandomEmoji() {
  $('#options').empty();
  for(var i = 0; i < 30; i++) {
    var number = randomNum();
    $('#options').append('<i class="em em-' + emoji[number] + '" onclick="addToStory('+ number +')"></i>');
  }
}

// Remember when we created that variable that stored the emoji count?
// We'll use that here so that we always get valid emojis back.
function randomNum() {
  return Math.floor(Math.random() * (emoji_count - 0)) + 0;
}
// We'll call the function once to get an initial list of emoji.
getRandomEmoji();

// Finally, we'll implement our function that will allow a user to add an
// emoji to the story. Clicking on an emoji will add it to the story.
// Our stories are going to be 10 emojis long, so once we have 10 items
// we'll automatically publish the story.
// This is a pretty hacky way to go around implementing this particular
// feature. Homework: Can you improve it?
function addToStory(number) {
  var current = firebase.database().ref('story');
  // We are using a transaction to ensure that if two users
  // submit the final emoji at the same time we don't
  // publish the story twice.
  current.transaction(function(data) {
    if(data) {
      if(Object.keys(data).length == 9) {
        data.final = emoji[number];
        firebase.database().ref('stories').push(data);
        firebase.database().ref('story').remove();
      } else {
        firebase.database().ref('story').push(emoji[number]);
      }
    } else {
      firebase.database().ref('story').push(emoji[number]);
    }
  })
```

Now we are ready to test our application. Head over to `localhost:5000` and start writing your emoji masterpiece. Data is updated in real-time, so if you open up another browser window and add an emoji in the first window you'll see the change instantly reflected in the second window. Once your app is deployed and live, anyone will be able to collaboratively create stories with you and the changes will again be reflected in real time.

We don't want just anyone to add stories to our app, so we'll set up a user authentication system and require users to be logged in to contribute. Let's do that next.

## Firebase Authentication

Firebase provides an authentication service that supports email/password, social, and anonymous authentication. Firebase also has support for integrating with external authentication providers, which we'll be doing with Auth0 a little bit later in this post. Enabling Firebase authentication can be done by going to the **Auth** section in the [dashboard](https://console.firebase.google.com), then navigating to the **Sign In Methods** tab and selecting which methods of authentication you would like to enable.

![Enable Google Authentication with Firebase Authentication](https://cdn.auth0.com/blog/new-firebase/enable-google-auth.png)

Since Firebase is a Google product, we'll add authentication with Google. In the dashboard, we'll enable the Google sign-in provider. In our code, lets create a function called `loginWithGoogle()` in our `app.js` file that will handle the authentication.

```js
function loginWithGoogle() {
  // Instantiate the Google authentication provider
  var provider = new firebase.auth.GoogleAuthProvider();
  // Handle the authentication request using the Popup method
  firebase.auth().signInWithPopup(provider).then(function(result) {
    var user = result.user;
  }).catch(function(error) {
    console.log(error);
  });
}
```

In our UI, let's add this function to the **Sign Up to Contribute** button. Next, navigate to the app and click the button to login. You'll see a popup which will ask you to log in to your Google account and then it will prompt you to grant our app permissions. Once you hit accept, the popup will close and you will be logged in.

![Authentication with Google](https://cdn.auth0.com/blog/new-firebase/auth-google.png)

Uncomment the code we wrote earlier that watches for changes to user authentication. Once you've done this, the UI will change based on the user's state. If the user is logged in, they will be able to log out as well as contribute to the story. If they are logged out, they will only have the option to log in, see the current story being written, and see existing stories, but will not be able to contribute.

With the `onAuthStateChanged()` observable, we are able to control the UI, but to further protect our database, let's update our Firebase database rules to only allow authenticated users to submit emoji to the story. We'll do this in the Firebase dashboard. Navigate to the **Database** section in the main nav, then the **Rules** tab. Here we can define **read** and **write** permissions for our database.

The default rule set allows anyone to read and write data to the entire database. Let's change this to allow anyone to read the contents of the database, but only authenticated users will be able to write. We can accomplish that with the following rule:

```
{ "rules":
  { ".read" : true,
    ".write": "auth != null"
  }
}
```

The rules system can get pretty complex and you can learn a lot more about it in the [Firebase docs](https://firebase.google.com/docs/database/security/), there is even a handy simulator that will allow you to experiment with the rules to make sure they meet your needs.

## Aside: Firebase SDK 3.0 and Auth0

Auth0 is fully compatible with the new Firebase 3.0 SDK. A big thank you to **Jacob Wegner** for helping with the integration. With Firebase authentication available, why integrate Auth0? While Firebase does have an authentication service, Auth0 can greatly enhance the user experience and add additional features that Firebase does not offer such as [single sign on](https://auth0.com/docs/sso/single-sign-on), [30+ social providers](https://auth0.com/docs/identityproviders), [multifactor authentication](https://auth0.com/learn/get-started-with-mfa/), [passwordless authentication](https://auth0.com/passwordless), and more.

Let's see how we can integrate Auth0 with the new Firebase SDK.

### Setting Up A Custom Provider with Firebase

The first step will be to enable our Firebase server to generate custom authorization tokens. To do this, we will need our server keys from Firebase. Navigate to the [Google Developer Console](https://console.developers.google.com/projectselector/apis/credentials) and select your Firebase application. Click on the **Credentials** menu option, then **Create Credentials** and finally select the **Service Account Key** option.

![Google Developer Console](https://cdn.auth0.com/blog/new-firebase/google-developer-console.png)

On the next screen, you will be prompted to enter the name for the account. The name doesn't really matter, so add whatever you prefer, and click the **Create** button. A `json` file will automatically download containing the keys we requested. *Note: This will be the only copy of the file so if you lose it you will have to create a new one*

### Integrating Auth0 into Firebase

If you don't already have an Auth0 account, <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">sign up</a> for one now. Navigate to the Auth0 [management dashboard](https://manage.auth0.com), select **Applications** from the navigational menu, then select the app you want to connect with Firebase. Once you are on the app page, select the **Add-Ons** tab and flip the **Firebase** toggle.

![Activate Firebase Addon](https://cdn.auth0.com/blog/new-firebase/add-firebase.png)

A dialog will open with three different options: **QuickStart**, **Settings** and **Usage**. Select the **Settings** tab. By default, the toggle to use the Firebase SDK 3 is enabled, but if for whatever reason it is not, flip the switch to on, then paste in the information for the **Private Key Id**, **Private Key**, and **Client Email**. All three of these can be found in the `json` file we downloaded from the Google Developer Console earlier.

![Firebase Addon Settings](https://cdn.auth0.com/blog/new-firebase/firebase-addon.png)

We are now set to do the integration in our FireTeller app. Before continuing, be sure to add `localhost:5000` as well as `https://*.firebaseapp.com` domains to the list of allowed callback urls.

### Adding Auth0 Authentication to FireTeller

We will be utilizing the Auth0 [Lock](https://auth0.com/lock) widget as well as the Auth0 [js library](https://auth0.com/docs/libraries/auth0js) to handle the user authentication and token exchange between Auth0 and Firebase. The Lock widget will give us a beautiful UI to handle sign in and sign up requests, while the Auth0 JS library will provide a helper function to get a delegation token which we will exchange for a Firebase auth token.

First, let's update our `index.html` file to include these libraries.

```html
...
    <!-- Include the scripts from the auth0 CDN -->
    <script src="https://cdn.auth0.com/js/lock/10.0/lock.min.js"></script>
    <script src="https://cdn.auth0.com/w2/auth0-6.7.js"></script>
...
  <body>
  ...
         <!-- We'll also add the ability to logout as well as provide some additional
              user info once a user is logged in -->
          <div class="col-sm-8 col-sm-offset-2">
            <div class="clearfix top-bar">
              <div id="email" class="pull-left"></div>
              <div class="pull-right">
                <a onclick="logout()" class="btn btn-danger" id="logout-btn">Logout</a>
              </div>
            </div>
          </div>
  ...
```

Next, we'll implement the login function in our `app.js` file.

``` js
function login() {
  // Instantiate the lock and auth0 libraries
  var lock = new Auth0Lock('YOUR-AUTH0-CLIENT-ID', 'YOUR-AUTH0-DOMAIN.auth0.com');
  var auth0 = new Auth0({ domain : 'YOUR-AUTH0-DOMAIN.auth0.com', clientID: 'YOUR-AUTH0-CLIENT-ID'})

  // Display the default lock widget
   lock.show();

  // listen to when the user gets authenticated and then save the profile
   lock.on("authenticated", function(authResult) {
      lock.getProfile(authResult.idToken, function(error, profile) {

        if (error) {
          // handle error
          return;
        }

        localStorage.setItem('profile', JSON.stringify(profile))

        // Set the options to retreive a firebase delegation token
        var options = {
          id_token : authResult.idToken,
          api : 'firebase',
          scope : 'openid name email displayName',
          target: 'YOUR-AUTH0-CLIENT-ID'
        };

        // Make a call to the Auth0 '/delegate'
        auth0.getDelegationToken(options, function(err, result) {
          if(!err) {
            // Exchange the delegate token for a Firebase auth token
            firebase.auth().signInWithCustomToken(result.id_token).catch(function(error) {
              console.log(error);
            });
          }
        });
      });
    });
}

// Finally, we'll implement a logout function to allow the user
// to logout once they are done creating stories
function logout() {
  localStorage.removeItem('profile');
  firebase.auth().signOut().then(function() {
    console.log("Signout Successful")
  }, function(error) {
    console.log(error);
  });
}
```

With this code now in place, we are ready to test our Auth0 and Firebase implementation. Navigate to `localhost:5000` and click the **Sign Up to Contribute** button. You will be prompted to login via the Lock widget. We've used the default settings for Lock, you can customize it in many ways, find out all the options in the [docs](https://auth0.com/docs/libraries/lock).

![Lock Widget Login](https://cdn.auth0.com/blog/new-firebase/lock.png)

If you already have an account, you can login, otherwise signup using the Lock widget. Upon a successful sign up or sign in, you will be authenticated and have the option to contribute to the story. Once you are done, click the logout button to log out.

### Deploying a Firebase App

![Deploying a Firebase app](https://cdn.auth0.com/blog/new-firebase/firebase-deploy.png)

To conclude our tutorial today, let's deploy our application using the Firebase CLI. You can deploy a static Firebase app by running the `firebase deploy` command from the terminal. Within seconds, your app will be deployed and live. Check out the app we just built [here](https://project-8302152786657556368.firebaseapp.com/).

## Serverless Apps

What we just built was a serverless app. Our Firebase application does not need a backend server to process requests, the Firebase 3 SDK running on the front-end coupled with the database rules we defined allow us to build apps without the need for a back-end server. The Firebase database for all intents and purposes is our backend.

Auth0 additionally offers a platform for building serverless apps called [Webtask](https://webtask.io). Firebase can run as a serverless app, but it can also run on the server. You can even have Firebase communicate with Webtask! [Learn more](https://webtask.io/docs/how) about how Webtask works and how it can change the way you build apps.

## Putting It All Together

Today, we built a storytelling app called FireTeller on the new Firebase 3.0 SDK and integrated Auth0 to handle user authentication. We showed how Firebase simplifies the development and deployment of web apps and how we can utilize the real-time capabilities of the database to foster collaboration. Adding authentication with Auth0 allowed us to extend the platform with additional capabilities.

Check out the GitHub [repo](https://github.com/auth0-blog/fireteller) to get the code and sign up for a free [Auth0](javascript:signup\(\)) and [Firebase](https://firebase.google.com) account to get started today. How will you extend the FireTeller app? Here are some ideas:

* Round Robin Storytelling - instead of everyone contributing whenever they want, make it so that only one person can add to the story at a time
* Private Stories - allow authenticated users to create and collaborate with only the users they allow
* Story Voting - implement a voting mechanism for existing stories and display the highest rated stories at the top