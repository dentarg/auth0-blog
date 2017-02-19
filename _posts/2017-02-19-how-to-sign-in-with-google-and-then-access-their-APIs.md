---
layout: post
title: "How to sign in with google and then access their APIs"
description: "???"
date: 2017-02-19 8:30
category: ??
author:
  name: Steve Lee
  url: https://twitter.com/SteveALee
  avatar: ??
design:
  bg_color: "#16214D"
  image: https://cdn.auth0.com/blog/ultimate-abm-machine/ABM-logo.png
tags:
- ??
related:
- ??
---

*Guest post by SteveALee of OpenDirective.com*

Without a doubt, authentication of web apps is a particularly difficult problem and if you are not careful it will eat a large chunk of you developer time. 
Worse, if you don't get it right you're open to being hacked, which will take even more of your precious time, not to manage damaging your reputation. Auth0 help mitigate this problem with an excellent and flexible solution along with some of the best documents and support in the business.
But, even when using Auth0 some scenareos are still complex to figure out and "true to form", I picked one of these cases as my first attempt at auth.
This post is the story of my experience and some working code using AzureFunctions with Auth0.

## The problem
I'm developing a set of open source components and commercial SaaS design to support the needs of people with cognitive disabilities or low digital literacy.
The initial components and product will provide simplified access to shared photographs and email. Given this, Google seemed like a natural choice for the initial underlying service. 
The software stack i've settled on is: [cyclejs](https://cycle.js.org/) for the a reactive SPA front end and [Microsoft Azure Functions](https://azure.microsoft.com/en-us/services/functions/) 
for a serverless backend APIs and more. Not surprisingly, I also chose Auth0 for authentication and authorization duties. 

My plan was that users will authenticate using Google and the code would then access the Picas and GMail APIs authorizing with the authenticated user credentials.

```
User Story: As a user I want to log in with my Google account so I can view my google photos in a simple viewer
```

That all seemed fairly straight forward after spending time learning the basics of OAuth and OpenID flows. Then I read the various Google docs and ended up being nicely confused. Google spread the docs around and are not always very precise. They are often unclear on whether access is from client or backend or which authentication flows they are talking about.

## Getting nowhere very slowly

After attempting a few spikes that accessed the Google APIs directly from the SPA I ended up pulling my hair out. 
The Picasa API in particular is very flaky in how it handles CORS and authentication. I started to think that backend access was going to be the solution for relable API access. And then theirs the question of what to do when tokens expire? The code will need to avoid having users keep loging in, so a refresh tokens will be required and they have to be kept server side as they effectively allow endless access.

Plan , then, was to use Auth0 do do all the heavy lifting. My hope was it would solve the technical issues relatively easily and also be flexible in options for the user experience of authetication, alowing the addition of services.
And yes, this did eventually work out with Auth0 Lock easily providing the authentication UI. 
However, authorisation to the google APIs caused me conciderable confusion and required help from support as I managed to miss the important docs.

## Auth0 and AzureFunctions: making live easy

Without further a-do, here's the low down on what you need to do to let a user sign in with Google via the Auth0 Lock and then access a Google API with their credentials. I'll also present some a links to important docs. But first, here's the flow we use.

* SPA displays the lock passing suitable options
* User logs in with Google, approving access to listed scopes (eg read emails)
* If required Auth0 creates a new Auth0 user linked to the google user
* SPA gets the auth0 user id_token and access_token
* SPA calls the backend HTTP endpoint to get a list of email etc. It passes the id_token 
* Backend AzureFunction uses the userid in the id_token to find out the user profile using the Auth0 admin API
* Backend extracts the google access_token from the users profile.
* Backend calls the GMail api and returns the results

In order for this to all work you need to have configured the following

* A gmail account - d'oh
* Auth0 web Client for the SPA
* Google API auth0 clientid for the SPA
* Auth0 non interactive client for the backend
* Auth0 API management API for backend access

The docs describing these are in links above

The example SPA code is as follows (note I actually use the Auth0 CycleJS integration but this imperative code should be easy to understand). 

```
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
  <link rel="icon" href="/favicon.ico" type="image/x-icon">
  <title>My Awesome Cycle.js app</title>
  <script src="https://cdn.auth0.com/js/lock/10.9.1/lock.min.js"></script>
</head>
<body>
    <button id="btn-login">Press me</button>
  <h2>Welcome <span id="nick" class="nickname"></span></h2>
  <pre id="profile"/>

  <script>
  
  function getGoogleAlbums(authToken, idToken) {
    var funct = 'YOUR AZURE FUNCTION ENDPOINT HERE'
    var xmlhttp = new XMLHttpRequest()
    xmlhttp.onreadystatechange = function() {
          if (this.readyState == 4 /*&& this.status == 200*/) {
              alert(this.status+' '+this.responseText)
          }
      }
      xmlhttp.open("GET", funct+'&at='+authToken+'&it='+idToken, true);
      xmlhttp.send();
  }

  var lock = new Auth0Lock(
    'YOUR AUTH0 CLIENT ID HERE',
    'YOUR AUTH0 DOMAIN HERE',
    {
      allowedConnections: ['google-oauth2'],
      allowForgotPassword: false,
      allowSignUp: false,
      closable: false,
      auth: {
        connection_scopes: { 
          'google-oauth2': ['https://picasaweb.google.com/data/' ] 
        },                
        params: { scope: 'openid nickname name email' },
        responseType: "token"
      },
      theme: {
        primaryColor: '#31324F'
      },
      languageDictionary: {
        title: "Sign into Google"
      }
  }
  );

  // Listening for the authenticated event
lock.on("authenticated", function(authResult) {
  // Use the token in authResult to getUserInfo() and save it to localStorage
  lock.getUserInfo(authResult.accessToken, function(error, profile) {
    if (error) {
      // Handle error
      return;
    }

    localStorage.setItem('accessToken', authResult.accessToken);
    localStorage.setItem('profile', JSON.stringify(profile));

    getGoogleAlbums(authResult.accessToken, authResult.idToken)
  });
});  
  
  document.getElementById('btn-login').addEventListener('click', function() {
  lock.show();
});

// Verify that there's a token in localStorage
var token = localStorage.getItem('accessToken');
if (token) {
  showLoggedIn();
  showProfile();
}

// Display the user's profile
function showLoggedIn() {
  var profile = JSON.parse(localStorage.getItem('profile'));
  document.getElementById('nick').textContent = profile.nickname;
}
function showProfile() {
  var profile = JSON.stringify(JSON.parse(localStorage.getItem('profile')),null,2);
  document.getElementById('profile').textContent = profile;
}

  </script>
</body>
</html>
```

The Azure Function code. This is a javascript HTTP Function with method of GET. Tokens are passed in the URL

```
const request = require("request")
const jwt = require('jsonwebtoken')

const DOMAIN = 'YOUR AUTH0 DOMAIN HERE'
const ADMIN_CLIENT_ID = 'YOUR ADMIN APP CLIENT ID HERE'
const ADMIN_CLIENT_SECRET = 'YOUR ADMIN APP CLIENT SECRET HERE'
const APP_CLIENT_SECRET = 'YOUR SPA APP SECRET HERE'

function requestObject(options) {
    return new Promise((resolve, reject) => {
        request(options, function (error, response, body) {
            if (error) {
                reject(error);
            } else if ((200 > response.statusCode) || (299 < response.statusCode)) {
                reject(new Error(`Remote resource ${options.url} returned status code: ${response.statusCode}: ${body}`))
            } else {
                const object = (typeof body === 'string') ? JSON.parse(body) : body // FIXME throws
                resolve({code: response.statusCode, object})
            }
        })
    })
}

function getAdminAccessToken() {
    const options = {
        method: 'POST',
        url: `https://${DOMAIN}/oauth/token`,
        headers: { 'content-type': 'application/json' },
        body: { client_id: ADMIN_CLIENT_ID,
            client_secret: ADMIN_CLIENT_SECRET,
            audience: `https://${DOMAIN}/api/v2/`,
            grant_type: 'client_credentials' 
        },
        json: true 
    }
    return requestObject(options)
}

function getUserAccessToken(accessToken, userID) {
  const options = {
    method: 'GET',
    url: `https://${DOMAIN}/api/v2/users/${userID}`,
    headers: { 'content-type': 'application/json',
               'Authorization': `Bearer ${accessToken}` 
             } 
    }
    return requestObject(options)
}

function getAlbums(accessToken) {
    const options = {
        method: 'GET',
        //url: `https://www.googleapis.com/gmail/v1/users/me/labels`,
        url: 'https://picasaweb.google.com/data/feed/api/user/default?alt=json',
        headers: { 'Authorization': `Bearer ${accessToken}` 
        } 
    }
    return requestObject(options)
}

module.exports = function (context, req) {

    const idtoken = req.query.it
    let payload
    try {
        payload = jwt.verify(idtoken, APP_CLIENT_SECRET)
    } catch(err) {
        res = {
            status: 400,
            body: "The ID token doesn't check out"
        }
        context.done(null, res)
        return
    }
    const userid = payload.sub

    if (userid) {
        getAdminAccessToken()
        .then(({object: {access_token}}) => { 
            return getUserAccessToken(access_token, userid)
        })
        .then(({object}) => {
            const access_token = object.identities[0].access_token
            return getAlbums(access_token)
        })
        .then(({object: {feed: {entry}}}) => {  // FIXME handle no entry
            const titles = entry.map(ent => ent.title.$t)
            return {
                status: 200,
                body: JSON.stringify(titles),
                headers: {'Content-Type': 'application/json'}
            }
        })
        .catch(err => {
            return {
                status: 400,
                body: err.message
            }
        })
        .then(res => {   
            context.done(null, res)
        })
    }
}
```

In production code you'd need to check that the access_token is good and that the user Authorised alowed to run then endpoint. You'd also probably also move out the security details to applications settings

If you want to try out this code you'll need to install the 2 npm dependencies; goto to "Functions App Settings"->"Console" and then cd to the folder for your function and ```npm install jsonwebtoken request```. You'll also need to set up CORS in the App Settings by adding your client URL - eg ```localhost:8000``` 

For client development server I simply installed npm package lite-serve configured to port 8000

