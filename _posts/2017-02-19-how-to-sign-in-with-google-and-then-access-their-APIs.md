---
layout: post
title: "Using Severless Azure Functions with Auth0 to Access Google APIss"
description: "TL;DR: Learn how Node.js backend code can access a Google API once a user logs in with Google via the Auth0 Lock widget."
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

*Guest post by @SteveALee of OpenDirective.com*

Without a doubt, authentication for web apps is one of the most complex features to implement correctly. If you’re not careful, it will eat a large chunk of your development time. Worse, if you don't get it exactly right you're left vulnerable to being hacked, which will take even more of your precious time, not to mention damaging your reputation. Therefore, it's nice to have Auth0 around to help mitigate this problem with their flexible service along with some of the best documents and support in the business. However, even when using Auth0 some scenarios are still complex to figure out and code. Typically and "true to form", I picked one of these complex cases as my first attempt at auth for a Single Page App (SPA) Software as a Service (SaaS) product.

This post is the story of my experience along with some working JavaScript code for Azure Functions with Auth0. 

##Serverless Architecture##
Azure Functions are part of Microsoft’s offering in the relatively new Serverless Architecture space. Sometime referred to as Functions as a Service (FaaS), Serverless Architecture allows you to concentrate your development offerts on you ‘Business Logic’ or backend application code. In this extension of Platform As a Service (PaaS), Microsoft manage all the lower layers of the hardware and software stack for you. For example: servers, operating systems, web servers and even platforms such as nodejs.  Note that serverless code is event driven and triggers may be HTTP requests but can also be from other sources such as a database update. This [introductory article](https://www.martinfowler.com/bliki/Serverless.html) on MartinFlower.com explains a web app use of Serverless Architecture and also links to a very thorough post by Mike Roberts.  

##The Problem##
I'm developing a set of open source components used in a commercial SaaS designed to support the needs of people with cognitive disabilities or low digital literacy. The initial components and product will provide simplified access to shared photographs and email. Given this, Google Picasa and Gmail seemed like natural choices for the initial underlying services. Unfortunately, the Picasa API has been feature stripped recently when Google moved over to Google Photos.

My initial requirement for the user experience is that they can easily authenticate by signing into their existing Google account. The code should then be able to access their photos and emails, using the Picasa and Gmail APIs. This will require authorized access based on the user credentials provided when they sign in. The initial user story that we cover in this post is:

>As a user I want to log into the app with my Google account so I get a list of my Google Photos albums.

That all seemed fairly straightforward after spending some time learning the basics of OAuth and OpenID flows from a mixture of Auth0 and OpenID documentation. Then I read the various Google API and auth docs and ended up confused. Google spreads the documentation around several places and it is not always consistent or precise. In addition, Google’s docs are often unclear on whether they are describing access from a client or backend and which specific authentication flows they are talking about. Finally, they often use their own SDKs (or libraries), which obscures the details and is largely irrelevant. This also adds another large download for client users.

##Getting Nowhere Very Slowly##

After exploring the Google APIs with some experimental code accessing them directly from the SPA I wanted to pull my hair out. The Picasa API in particular is very flaky in how it handles CORS and authentication. Plan B was to use Auth0 to do all the heavy lifting. My hope was their Lock widget would solve the technical issues relatively easily. For example, Lock handles the 'nonce' and 'state' attributes used to stop hacking. Lock is also flexible in user experience options, for example it easily allows the addition of extra services. However, I soon found out the access_token that lock provides to a SPA is not usable in Google APIs and it was hard to find any answers.

At this point, I started to think that backend access was going to be the solution. In addition to reliable access there's also the question of what to do when tokens expire. We need to avoid having the user keep logging in, so refresh tokens will be required which must be stored securely in the backend, as they effectively allow endless access. Several other design requirements pointed to backend access, and using Azure Functions meant a rapid development and relatively low DevOps requirements. Win - win.

I found after more experimental code that this did eventually work out, but only after I stumbled across a highly relevant Auth0 document and requested help from the awesome Nico, a Customer Success Engineer at Auth0. As Nico pointed out, if you use Auth0 as the identity provider then even when proxying other third party identity providers, the access_tokens you get are from Auth0. They can be used with Auth0 APIs or your own, but are not what third party APIs require. Auth0 does provide a mechanism for backend code to get the access_token from third party identity providers. However, the token is hidden in the Auth0 UI for security purposes.

##Auth0 and Azure Functions: Making Life Easy##

Without further delay, here's the low-down on what you need to do to let a user sign in with Google via the Auth0 Lock and then access a Google API with their credentials, using the Google access_token. I'll also present some links to important docs. Here's the complete flow we use:

1. SPA displays the Auth0 Lock passing suitable options
1. User logs in with Google, approving access to requested scopes (eg read photos, read emails)
1. If required, Auth0 creates a new Auth0 user linked to the Google user
1. SPA gets the Auth0 user id_token and access_token
1. SPA calls the backend HTTP endpoint to get a list of photos, etc., and passes the access_token with this request
1. Backend Azure Functions validates the JWT and optionally checks the user is allowed access
1. Backend uses the userid in the access_token to find the user profile using the Auth0 admin API
1. Backend extracts the Google access_token from the user’s profile.
1. Backend calls the Google Picasa API and processes the results, returning them to the SPA in the HTTP response

In order for this to work, you need to have the following configured:

* A Google Photos account with some photos, preferably in several albums
* Auth0 web Client for the SPA - [Authentication for Client-side Web Apps](https://auth0.com/docs/client-auth/client-side-web)
* Google OAuth client for backend access to APIs - [Connect Your Client to Google](https://auth0.com/docs/connections/social/google)
* Auth0 API definition for the API - [Call APIs from Client-side Web Apps](https://auth0.com/docs/api-auth/grant/implicit)
* Auth0 non-interactive client for backend access to Auth0 management API - [Call an Identity Provider API](Call an Identity Provider API)
* Azure account and an [Azure Functions App](https://azure.microsoft.com/en-us/services/functions/)

You should also read: 

* [Auth0 Overview](https://auth0.com/docs/overview) 
* [Identity Provider Access Tokens](https://auth0.com/docs/tokens/idp)
* [Lock for Web](https://auth0.com/docs/libraries/lock)
* [Create your first Azure Function](https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-first-azure-function)

Here is a simple vanilla HTML and JavaScript example that allows the user to sign in with the Auth0 Lock and then calls the Azure Functions backend to get a list of Google Photos albums:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Auth0 and Google APIs</title>
  <script src="https://cdn.auth0.com/js/lock/10.9.1/lock.min.js"></script>
</head>
<body>
  <button id="btn-login">Login</button>
  <button id="btn-get">Get Albums</button>
  <pre id="profile"/>

  <script>
 
  function getGoogleAlbums(accessToken) {
    var AZUREFUNCTION = 'AZURE FUNCTION URL HERE'
    var xmlhttp = new XMLHttpRequest()
    xmlhttp.onreadystatechange = function() {
          if (this.readyState == 4 /*&& this.status == 200*/) {
              alert(this.status+'\r\n'+this.responseText.replace(/\\"/g,''))
          }
      }
      xmlhttp.open("GET", AZUREFUNCTION, true);
      xmlhttp.setRequestHeader('Authorization', `Bearer ${accessToken}`)
      xmlhttp.send();
  }

  var lock = new Auth0Lock(
    'THIS CLIENTS ID HERE',
    'DOMAIN.eu.auth0.com',
    {
      allowedConnections: ['google-oauth2'],
      allowForgotPassword: false,
      allowSignUp: false,
      closable: false,
      auth: {
        connection_scopes: {
          'google-oauth2': ['https://picasaweb.google.com/data/']
        },                
        params: {
          scope: 'openid profile photos',
          audience: 'https://API_ID HERE'
           },
        responseType: "id_token token"
      },
      languageDictionary: {
        title: "Sign into Google"
      }
  }
  );

  // Listening for the Lock authenticated event
  lock.on("authenticated", function(authResult) {
    localStorage.setItem('accessToken', authResult.accessToken);
    localStorage.setItem('idToken', authResult.idToken);
    lock.getUserInfo(authResult.accessToken, function(error, profile) {
      if (error) {
        // Handle error
        return;
      }
      localStorage.setItem('profile', JSON.stringify(profile));
    });
  });  
    
  document.getElementById('btn-login').addEventListener('click', function() {
    lock.show();
  })
  document.getElementById('btn-get').addEventListener('click', function() {
    var accessToken = localStorage.getItem('accessToken')
    var idToken = localStorage.getItem('idToken')
    getGoogleAlbums(accessToken)
  })

  function view() {
    // Verify that there's a token in localStorage
    var token = localStorage.getItem('accessToken');
    if (token) {
      showProfile();
    }
  }
  function showProfile() {
      var profile = JSON.stringify(JSON.parse(localStorage.getItem('profile')),null,2);
      document.getElementById('profile').textContent = profile;
  }

  view()

  </script>
</body>
</html>
```

Now for the Azure Functions backend code. This is a JavaScript HTTP Azure Function with the method set to GET. Tokens are passed from the frontend code above in a URL parameter.

Note, this initial block of constants should not normally be included in the main code (if only to stop you accidently checking your secrets into GitHub). Rather it’s good practice to place them in the Function App Service’s Settings and reference them from the code. 

```js
// constants 
const AUTH0_DOMAIN_URL = 'https://DOMAIN.auth0.com'
const AUTH0_API_ID = 'https://API_ID'
const AUTH0_SIGNING_CERTIFICATE = `-----BEGIN CERTIFICATE-----
<Get this from the Auth0 client Advanced settings -> certificates>
-----END CERTIFICATE-----`
const AUTH0_ADMIN_CLIENT_ID = 'YOUR ADMIN CLIENT APP ID'
const AUTH0_ADMIN_CLIENT_SECRET = 'YOUR ADMIN APP CLIENT SECRET'
```

This main body of the code can be added via the Azure Functions console:

```js
// Create decorator that checks the JWT signature and specified fields
const jwtValidateDecorator = require('./azure-functions-auth0')({
  clientId: AUTH0_API_ID,
  clientSecret: AUTH0_SIGNING_CERTIFICATE,
  algorithms: ['RS256'],
  domain: `${AUTH0_DOMAIN_URL}/`
})

// The main Functions Function
module.exports = jwtValidateDecorator((context, req) => {
    if (req.user) {
        // Get a token to access the admin API
        getAdminAccessToken()
        .then(({object: {access_token}}) => {
            const userId = req.user.sub     // has been added to the req by the decorator
            return getUserProfile(access_token, userId)
        })
        // Get the album list from google
        .then(({object}) => {
            const google_access_token = object.identities[0].access_token  // hidden from the Auth0 console
            return getAlbums(google_access_token)
        })
        // Get the album titles
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
    else {
        const res = {
            status: 400,
            body: 'Something is wrong with the Authorization token'
        }
        context.done(null, res)
    }
})
```

Here are the supporting functions called from the main code block above. They can be placed in the same Function for simplicity. An alternative is to place them in a separate module file and “require” them as usual with nodejs. Azure Functions allows you to provide several Functions and supporting code in a single Functions App.
const request = require('request')

```js
// Call a remote HTTP endpoint and return a JSON object
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

// Get an access token for the Auth0 Admin API
function getAdminAccessToken() {
    const options = {
        method: 'POST',
        url: `${AUTH0_DOMAIN_URL}/oauth/token`,
        headers: { 'content-type': 'application/json' },
        body: { client_id: AUTH0_ADMIN_CLIENT_ID,
            client_secret: AUTH0_ADMIN_CLIENT_SECRET,
            audience: `${AUTH0_DOMAIN_URL}/api/v2/`,
            grant_type: 'client_credentials'
        },
        json: true
    }
    return requestObject(options)
}

// Get the user's profile from the Admin API
function getUserProfile(accessToken, userID) {
  const options = {
    method: 'GET',
    url: `${AUTH0_DOMAIN_URL}/api/v2/users/${userID}`,
    headers: { 'Authorization': `Bearer ${accessToken}`
             }
    }
    return requestObject(options)
}

// Get user Google Photos album list
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
```

We need to check the Auth0 access_token is valid before allowing the API code to be executed. This is done by a decorator (or wrapper) function based on the npm azure_functions_auth0 module but modified to work correctly with an Auth0 API access_token.

azure_functions_auth0.js

```js
// based on the npm package azure-functions-auth0
// But modified to handle the Auth0 API accessToken

const jwt = require('express-jwt');
//import ArgumentError from './errors/ArgumentError';
const ArgumentError = Error

module.exports = (options) => {
  if (!options || !(options instanceof Object)) {
    throw new ArgumentError('The options must be an object.');
  }

  if (!options.clientId || options.clientId.length === 0) {
    throw new ArgumentError('The Auth0 Client or API ID has to be provided.');
  }

  if (!options.clientSecret || options.clientSecret.length === 0) {
    throw new ArgumentError('The Auth0 Client or API Secret has to be provided.');
  }

  if (!options.domain || options.domain.length === 0) {
    throw new ArgumentError('The Auth0 Domain has to be provided.');
  }

  const middleware = jwt({
    secret: options.clientSecret,
    audience: options.clientId,
    issuer: options.domain,
    algorithms: options.algorithms
    })

  return (next) => {
    return (context, req) => {
      middleware(req, null, (err) => {
        if (err) {
          const res = {
            status: err.status || 500,
            body: {
              message: err.message
            }
          };

          return context.done(null, res);
        }

        return next(context, req);
      });
    };
  };
}; 
```

##Running the Code##

For a local client development server, I simply installed npm package ['lite-server'](https://www.npmjs.com/package/lite-server) configured to port 8000 with a ‘bs-config.json’ file.

For the backend, you'll need to create an HTTP Azure Function with the method set to GET. You'll also need to install the two npm dependencies of ‘express-jwt’ and ‘request’. In the Azure Functions control panel go to "Functions App Settings" -> "Console" to open up a console. Then 'cd' to the folder for your function and enter the following command:

```
npm install express-jwt request
```

You'll also need to set up CORS by adding your client URL - eg. localhost:8000. This is found in the Azure Functions console panel and click on ‘Function app settings’ -> ‘Configure CORS’. Finally, copy the Function’s URL into the SPA code constants block.

##Observations##

As this is a Serverless backend with no local state storage, the same authorization code will run for every similar endpoint. We can tidy up the code to be more DRY (Don’t Repeat Yourself) by moving the code to get the Auth0 Admin and Google access_tokens into a module shared by all your Functions in the Function App.

##Conclusion##

Auth0 provides all the features needed to access Google APIs with a user’s credentials. When a user signs in through Auth0 you get an Auth0 access token. You then need to obtain the third party access token for Google’s APIs. This is done with backend code for security. The code accesses the user’s profile via the Auth0 Admin API and can then obtain the access token provided when the user signed in with Google.

Azure Functions provides an ideal way to create the backend code in Node.js without the need to create and configure servers or Node itself. An HTTP function is easy to create and configure via the Azure Functions control panel, or everything can be done locally and then deployed to Azure.

Best of all, both Auth0 and Azure Functions provide free subscriptions that allow you to explore them in detail. Have fun!
