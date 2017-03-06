---
layout: post
title: "How to migrate your existing Stormpath users to Auth0"
description: "Stormpath is shutting down August 18, 2017. Learn how to effortlessly migrate your existing Stormpath users to Auth0 and gain a few new features out-of-the-box as well. "
date: 2017-03-06 8:30
category: Migration, Announcement
author:
  name: "Ado Kukic"
  url: "https://twitter.com/kukicado"
  mail: "ado@auth0.com"
  avatar: "https://s.gravatar.com/avatar/99c4080f412ccf46b9b564db7f482907?s=200"
design:
  image: https://cdn.auth0.com/blog/this-the-season-for-cyber-criminals/logo.png
  bg_color: "#191716"
related:
  - 2016-11-30-different-ways-to-implement-multifactor
  - 2015-12-17-json-web-token-signing-algorithms-overview
tags:
  - migration
  - stormpath
  - custom-migration
  - multifactor
---

---

**TL;DR** Stormpath announced today that it was acquired by Okta. As a result, the Stormpath API will be shutting down this coming August as the team transitions to Okta. Customers have until August 18, 2017 to export their user data to Okta or a different provider. Find out how to easily migrate your users to Auth0 and some additional benefits you'll gain by making the switch.

---

[Stormpath](https://stormpath.com) is an authentication as a service company that allows developers to offload their authentication and authorization needs to a third party. The company offered a RESTful API that customers could use to manage identity in their applications. Today, the company [announced](https://stormpath.com/blog/stormpaths-new-path) that it had been acquired by [Okta](https://www.okta.com), which is another company that provides identity management services.

Acquisitions in the software industry are a norm. What is surprising about this acquisition is that the Stormpath product will be shut down later this year as the team transitions to Okta leaving many customers to scramble to find an alternative. Customers have until **August 18, 2017** to find a new provider, get it up and running, and export their existing users. Quite a challenge in such a short time frame.

{% include tweet_quote.html quote_text="Ethereum marries the power of decentralized transactions with Turing-complete contracts!" %}

At [Auth0](https://auth0.com), our goal is to provide the best authentication and identity management solution that is also simple and easy for developers to work with. 

## Custom Database Migration Made Easy with Auth0

The most important thing you are probably concerend with right now is how to migrate your existing users with minimal impact to your applications. At Auth0 we hope to greatly reduce your stress and anxiety with our painless user import functionality. 

The way this feature works is by setting up a database connection and connecting it to your Stormpath account. When your users login the first time, they will enter their existing Stormpath credentials and, if authenticated successfully, we will automatically migrate that user account from Stormpath into Auth0. Your users will not have to change their password or jump through any additional hoops and you can decide what data to port over from Stormpath. Next time the user logs in, Auth0 will detect that they have been migrated and authenticate them with their Auth0 account.

![Auth0 User Migration](https://cdn.auth0.com/docs/media/articles/connections/database/migrating-diagram.png)

Talk is cheap, so let me actually walk you through the steps.

### Implementing the Database Migration Scripts

First of all you will need an Auth0 account. <a href="javascript:signup()">Signup for free here.</a> With your account created, let's setup a custom database connection. In your Auth0 [management dashboard](https://manage.auth0.com), navigate to the **Connections** and then **Database** menu. On this page, click on the **Create DB Connection** button in the top right corner.

![Create DB Connection]()

You can name your connection anything you like. Leave all the default settings as is for now and click the **Create** button to create the connection.

Next, let's go into this database connection and connect it to our Auth0 account. Click on your newly created connection and navigate to the **Custom Database** tab. Flip the switch titled "Use my own database" and the **Database Action Scripts** section will be enabled. This is where we will write our code to connect to your existing Stormpath user datastore. We will need to write two scripts: **Login** and **Get User**. **Login** will proxy the login process and **Get User** to manage looking up accounts when a user attempts to reset their password.

![Enable Custom Database]()

### Login
The **Login** script is executed when a user attempts to sign in but their account is not found in the Auth0 database. Here we will implement the functionality to pass the user credentials provided to our Stormpath user datastore and see if that user is valid. Auth0 provides templates for many common databases such as MongoDB, MySQL and Sql Server, but for Stormpath we will have to write our own. We will utilize Stormpath's REST API to authenticate the user. Let's look at the implementation below:

```js
function login (username, password, callback){
  // Replace the YOUR-CLIENT-ID attribute with your Stormpath ID
  var url = 'https://api.stormpath.com/v1/applications/{YOUR-CLIENT-ID}/loginAttempts'

  // Stormpath requires the user credentials be passed in as a base64 encoded message
  var message = username + ':' + password;
  var pass = new Buffer(message).toString('base64');

  // Here we are making the POST request to authenticate a user
  request({
    url: url,
    method: 'POST',
    auth: {
      // Your API Client ID
      user: '{STORMPATH-CLIENT-ID}',
      // YOUR API Client Secret
      password: '{STROMPATH-CLIENT-SECRET}'
    },
    headers: {
        'Content-Type': 'application/json'    
    },
    json : { 
      type: 'basic',
      // Passing in the base64 encoded credentials 
      value: pass
    }
  }, function(error, response, body){
     // If response is successful we'll continue
     if(response.statusCode === 200){
       // A successful response will return a URL to get the user information
       var accountUrl = body.account.href

       // We'll make a second request to get the user info. This time it will be a GET request
       request({
         url: accountUrl,
         method: 'GET',
         auth: {
           // Your API Client ID
           user: '{STORMPATH-CLIENT-ID}',
           // YOUR API Client Secret
           password: '{STROMPATH-CLIENT-SECRET}'
         },
       }, function(error, response, body){
         // If we get a successful response, we'll process it
         if(response.statusCode === 200){
           body = JSON.parse(body);
           // To get the user identifier, we'll strip out the Stormpath API
           var id = body.href.replace("https://api.stormpath.com/v1/accounts/", "");
           // Finally, we'll set the data we want to store in Auth0 and migrate the user
           callback(null, {
             user_id : id,
             username: body.username,
             email: body.email,
             // We set the users email_verified to true as we assume if they were a valid
             // user in Stormpath, they have already verified their email
             // If this field is not set, the user will get an email asking them to verify
             // their account
             email_verified: true,
             // Add any additional fields you would like to carry over from Strompath
           });
         } else {
           callback();
         }
       })
     } else {
       callback();
     }
  });
}
```

### Get User
The **Get User** script is executed when the user attempts to do a password reset but their account is not found in the Auth0 database. The **Get User** script interfaces with your Stormpath datastore and checks to see if the user exists there. If the user does exist, their data is sent back to Auth0 where the user is automigrated and a password reset email is sent out from Auth0. Once the user confirms the reset, they are good to go and can access your app. Subsequent logins will be authenticated against the Auth0 database as the users profile is now stored with Auth0.

Let's look at our implementation of the **Get User** script for Stormpath:

```js
function getByEmail (email, callback) {
  // Replace the YOUR-CLIENT-ID attribute with your Stormpath ID
  var url = 'https://api.stormpath.com/v1/applications/{YOUR-CLIENT-ID}/accounts'
  request({
    url: url,
    method: 'GET',
    auth: {
      // Your API Client ID
      user: '{STORMPATH-CLIENT-ID}',
      // YOUR API Client Secret
      password: '{STROMPATH-CLIENT-SECRET}'
    },
    qs: {q: email}
  }, function(error, response, body){
      if(response.statusCode === 200){
        body = JSON.parse(body);
        var user = body.items[0];
        if(user){
          var id = user.href.replace("https://api.stormpath.com/v1/accounts/", "");
          callback(null, {
             user_id : id,
             username: user.username,
             email: user.email,
             email_verified: true,
             // Add any additional fields you would like to carry over from Strompath
           });
        } else {
          callback()
        }
      } else {
        callback()
      }
  })
}
```

With these two scripts we have user migration setup and ready to go. To test it and make sure our code works, let's build a simple application that allows a user to login and request protected resources via an API. We'll build the frontend with Angular 2 and the backend we'll power with Spring.

### Building the Frontend

We will build our frontend with Angular 2. We'll use the [Auth0 Angular 2 Quickstart](https://github.com/auth0-samples/auth0-angularjs2-systemjs-sample/tree/master/01-Login) to get up and running quickly. With the project downloaded, we'll need to setup our Auth0 credentials. We'll do that in the `auth.config.js` file. Open the file and change the values to look like this:

```js
"use strict";
exports.myConfig = {
    // Your Auth0 ClientID.
    clientID: '{AUTH0-CLIENT-ID}',
    // Your Auth0 Domain
    domain: '{YOUR-AUTH0-DOMAIN}.auth0.com'
};
```

Both of these values can be found in your Auth0 [management dashboard](https://manage.auth0.com). In the dashboard, simply click on the **Clients** link from the main menu, and select the **Default Client** that was created when you signed up. *If you already had an Auth0 account, select the client that has the database connection with the custom database enabled*.

With these values configured save the file and run `npm install`. Once npm has installed all the required dependencies, run the project by executing `npm start`. Navigate to `localhost:3000` to see the app in action.

![Angular 2 Frontend]()

Click on the **Login** button to login to your application. Clicking the **Login** button will bring up the Auth0 [Lock](https://auth0.com/lock) widget and ask the user to provide their email and password. Here, the user will provide their Stormpath email and password credentials and if they are correct they will be logged in. If you don't already have a Stormpath user account you can login with, go into your Stormpath dashboard and create an account. Now login with your Stormpath user credentials.

Notice that you are instantly logged in. If we look at the response data from the transaction we'll see that the user is coming from the **Stormpath-Users** connection alongside other data that we imported. Let's make sure that this user was migrated to Auth0 as well. To check this we'll navigate to the [Users](https://manage.auth0.com/#/users) section of the Auth0 dashboard and we'll now see the user we logged in with.

This means that our migration was successful. This user is now migrated to Auth0. The next time they login to the application, we'll check their credentials against Auth0's database instead of making the extra call to Stormpath.

### Building the Backend

## Go Further with Auth0

I hope the user migration functionality I showed in this post helps with your use case. This gradual migration works great because it is transparent to your end-users. As the deadline approaches and Stormpath prepares to shut down their service, you may need to speed up the migration process. Auth0 can help here as well. You can [bulk import](https://auth0.com/docs/tutorials/bulk-importing-users-into-auth0) your existing user datastore into Auth0 or since we already wrote the **Get User** script you can send out a mass email to your users letting them know they need to change their password and by clicking on the link in the email their accounts will be migrated to Auth0.

Now that your migrates woes have been taken care of, let's briefly talk about what Auth0 brings to the table besides authentication and authorization. 

## Conclusion
