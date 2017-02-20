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

Without a doubt authentication for web apps is one of the most complex features to implement correctly and if you are not careful it will eat a large chunk of you developement time. 
Worse, if you don't get it **exactly** right you're open to being hacked, which will take even more of your precious time, not to manage damaging your reputation. So it's nice to have Auth0 around to help mitigate this problem with their flexible service along with some of the best documents and support in the business.
But, even when using Auth0 some scenareos are still complex to figure out and code. Typically and "true to form", I picked one of these complex cases as my first attempt at auth for a SPA + SaaS.

This post then, is the story of my experience plus some working Javascript code for AzureFunctions with Auth0.

## The Problem
I'm developing a set of open source components used in a commercial SaaS designed to support the needs of people with cognitive disabilities or low digital literacy.
The initial components and product will provide simplified access to shared photographs and email. Given this, Google Picas and GMail seemed like a natural choice for the initial underlying service. Unfortunately however, the Picasa API has been feature stripped recently when Google moved over to Google Photos.  

My requirment was that users will authenticate using Google signon and the code would then access the user's photos and emails, using the Picasa and GMail APIs while authorizing access with the authenticated user credentials.

```
User Story: As a user I want to log into the app with my Google account so I get a list my Google photo albums
```

That all seemed fairly straight forward after spending some time learning the basics of OAuth and OpenID flows from a mixture of Auth0 and OpenID documentation. Then, I read the various Google API and auth docs and ended up being nicely confused. Google spread the documentation around several places and are not always consistent or precise. In addition. they are often unclear on whether they are describing access from a client or backend or which specific authentication flows they are talking about. Finally, they often use their own SDKs (or libraries) which obscure the details and are largely irrelevent and another large download for client users

## Getting nowhere very slowly

After attempting a few spikes accessing the Google APIs directly from the SPA I ended up pulling my hair out. 
The Picasa API in particular is very flaky in how it handles CORS and authentication. Plan B then, was to use Auth0 do do all the heavy lifting. My hope was their Lock widget would solve the technical issues relatively easily. For example it handles the 'nonce' and 'state' attributes used to stop hacking. Lock is also flexible in user experience options, for example it easily alows the addition of extra services. However, I soon found out the access_token that lock provides to a SPA is not usable in Google APIs and it was hard to find any answers.

At this point I started to think that backend access was going to be the solution. In addition to reliable access there's also the question of what to do when tokens expire. We need to avoid having the user keep logging in, so refresh tokens will be required which must be kept safely backend side as they effectively allow endless access. Several other design requirements pointed to backend access and using AzureFunctions meant a rapid development and relatively low DevOps requirments. Win - win.   

So more rapiding spikes and this did eventually work out. But only after I stumbled across a highly relevant Auth0 document and requested help from the awesome Nico at Auth0. As Nico pointed out, if you use Auth0 as the identity provider then even when proxying other 3rd party identity providers the access_tokens you get are from Auth0. They can be used with Auth0 APIs or your own, but are not what 3rd party APIs require. Auth0 does provide a mechanism for backend code to get the access_token from 3rd part identity providers. However, the token is hidden in the Auth0 UI for security purposes.

## Auth0 and AzureFunctions: making live easy

Without further delay, here's the low-down on what you need to do to let a user sign in with Google via the Auth0 Lock and then access a Google API with their credentials, using the Google access_token. I'll also present some a links to important docs. But first, here's the complete flow we use:

* SPA displays the Auth0 Lock passing suitable options
* User logs in with Google, approving access to requested scopes (eg read photos, read emails)
* If required Auth0 creates a new Auth0 user linked to the google user
* SPA gets the Auth0 user id_token and access_token
* SPA calls the backend HTTP endpoint to get a list of photos etc. It passes the id_token 
* Backend AzureFunction uses the userid in the id_token to find the user profile using the Auth0 admin API
* Backend extracts the google access_token from the users profile.
* Backend calls the Google Picas API and processing the results and return to the SPA on the HTTP response

In order for this to all work you need to have configured the following:

* A gmail account with some photos - d'oh
* Auth0 web Client for the SPA - [Authentication for Client-side Web Apps](https://auth0.com/docs/client-auth/client-side-web)
* Google oauth client for backend access to APIs - [Connect Your Client to Google](https://auth0.com/docs/connections/social/google)
* Auth0 non interactive client for backend access to Auth0 management API- [Call an Identity Provider API](https://auth0.com/docs/tutorials/calling-an-external-idp-api)

You should also read:
* [Auth0 Overview](https://auth0.com/docs/overview)
* [Call APIs from Client-side Web Apps](https://auth0.com/docs/api-auth/grant/implicit) - though the example code skips this step.
* [Identity Provider Access Tokens](https://auth0.com/docs/tokens/idp)
* [Lock for Web](https://auth0.com/docs/libraries/lock)

Here is a basic SPA example code:

```
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Google API test</title>
  <script src="https://cdn.auth0.com/js/lock/10.9.1/lock.min.js"></script>
</head>
<body>
  <button id="btn-login">Press me</button>
  <pre id="profile"/>

  <script>
  
  // Config
  var FUNCTION_ENDPOINT = 'YOUR AZURE FUNCTION ENDPOINT URL HERE'
  var AUTH0_CLIENT_ID = 'YOUR AUTH0 CLIENT ID HERE'
  var AUTH0_DOMAIN = 'YOUR AUTH0 DOMAIN HERE'
    
  // Call our backend with the access and id tokens
  // For simplicity we pop up an alert with the outcome
  function getGoogleAlbums(authToken, idToken) {
    var xmlhttp = new XMLHttpRequest()
    xmlhttp.onreadystatechange = function() {
          if (this.readyState == 4 /*&& this.status == 200*/) {
              alert(this.status+' '+this.responseText)
          }
      }
      xmlhttp.open("GET", FUNCTION_ENDPOINT+'&at='+authToken+'&it='+idToken, true);
      xmlhttp.send();
  }

  var lock = new Auth0Lock(
    AUTH0_CLIENT_ID,
    AUTH0_DOMAIN,
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
      languageDictionary: {
        title: "Sign into Google"
      }
    }
  );

  lock.on("authenticated", function(authResult) {
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
    showProfile();
  }

  // Display the user's profile
  function showProfile() {
    var profile = JSON.stringify(JSON.parse(localStorage.getItem('profile')),null,2);
    document.getElementById('profile').textContent = profile;
  }

  </script>
</body>
</html>
```

And here's The AzureFunction backend code. This is a JavaScript HTTP Function with method of GET. Tokens are passed from ther SPA in the URL.

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

In production code you'd need to check that the access_token is good and that the user is uthorised to access then endpoint. You'd also probably also move the security details out to applications settings (if only to stop you accidently checking them into GitHub).

## Running the Code

For a client development server I simply installed npm package 'lite-server' configured to port 8000

For the backend you'll need to create a HTTP Function with the method set to GET. You'll needto install the 2 npm dependencies; goto to "Functions App Settings" -> "Console" and then 'cd' to the folder for your function and ```npm install jsonwebtoken request```. You'll also need to set up CORS in the App Settings by adding your client URL - eg ```localhost:8000```. Finally, copy the function URL to the SPA code. 

## Observations

While this works just fine I'm concerned about speed. It takes a second or two to respond (ignoring the Function warm up time after a period of inactivity). I don't think the speed will be the Function code execution, but rather the cumulative over-the-wire and response times. I also need to check the geographic regions all align (Europe in my case).

As this is a serverless backend with no state storage the same code will run for every similar endpoint. Apart from the speed concern, we can tidy up the code to be more DRY by moving the code to get the access_token into a module shared by all the Functions in the Function App. Or even making it a npm package.

A final question exists on how to handle token expiry. We can get new tokens, possibly with a Refresh Toekns but it's not clear how to update the access token that Auth0 holds. If we can't then the code will hsve to be changed so Auth0's copy is not treaded as the master record.

Please do ping me if you have any comments or optimisations.
