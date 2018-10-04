---
layout: post
title: "Run a LoopBack App on Google App Engine"
description: "In this article, we are going to learn how to host and run a LoopBack application on Google App Engine. We will also set up Firestore as the database of our application."
date: 2018-01-02 08:30
category: Technical Guide, Backend, LoopBack
author:
  name: "Chidume Nnamdi"
  url: "https://twitter.com/ngArchangel"
  mail: "kurtwanger40@gmail.com"
  avatar: "https://secure.gravatar.com/avatar/dbafebf712fa816299231d2763fd292e?s=200"
design:
  bg_color: "#3445DC"
  image: https://cdn.auth0.com/blog/loopback-googlecloud/logo.png
tags:
- google-app-engine
- loopback
- mongodb
- mlab
- backend
- javascript
- authentication
- auth0
- nodejs
- restful
- api
related:
- 2017-11-17-moving-your-app-to-cloud
- 2017-09-07-developing-restful-apis-with-loopback
- 2016-11-21-building-and-authenticating-nodejs-apps
---

**TL;DR:** In this article, we are going to see how to setup a Google App Engine and host a LoopBack app on it. We'll deploy a sample LoopBack application to Google App Engine. By the end, we'll have learned how to:

* create a project in Google Cloud Platform;
* configure deployments;
* scaffold a LoopBack project using the` loopback-cli`;
* learn how to config our App Engine environment in a YAML file;
* deploy apps with Google Cloud Shell.

This is a real Google App Engine deployment, so when the tutorial is over we can keep improving the application.

It's easy to develop LoopBack apps and run them on Google Cloud Platform. Besides that, the apps we create will be running on the same infrastructure that powers all Google products. Therefore, we can rest assured that they will scale to serve all of our users, whether there are a few or millions of them.

> __Note__: This article assumes that we are familiar with [Node.js and that we have it installed](https://nodejs.org/en/download/).

## What is LoopBack

[LoopBack is a framework for creating APIs and connecting them with backend data sources](https://loopback.io/). Built on top of Express, it can take a data model definition and easily generate a fully functional end-to-end REST API that can be called by any client.

LoopBack is a highly-extensible, open-source Node.js framework that enables us to:

* create dynamic end-to-end REST APIs with little or no coding;
* access data on Oracle, MySQL, PostgreSQL, SQL Server, MongoDB, SOAP and other REST APIs;
* incorporate model relationships and access controls for complex APIs;
* run our application on-premises or in the cloud.

## What is Google App Engine

[Google App Engine](https://cloud.google.com/appengine/) is a web framework and cloud computing platform for developing and hosting web applications in Google-managed data centers. App Engine provides all of the required elements to run and host applications, be it on mobile or Web. Without all these features, developers would have to source their own servers, database software and the APIs that would make all of them work properly together.

Google App Engine provides all of the environment requirements. This means that we simply deploy our code, and the platform does everything else for us. For example, if our app becomes very successful, Google App Engine will help us scaling it.

Google App Engine takes burden off the developers so they can concentrate on the app's special features, driving better user experience.

Advantages of Google App Engine include:

* readily available servers with no configuration requirement;
* power scaling function all the way down to "free" when resource usage is minimal;
* automated cloud computing tools.

## Create a Google Cloud Platform Project

Projects on Google Cloud Platform form the basis for creating, enabling, and using all Google Cloud Platform services. This includes managing APIs, enabling billing, adding and removing collaborators, and managing permissions for Cloud Platform resources.

We can use an already existing project, but let's see how to create a new project if we don't have any.

To create a new project we have to:

* go to the [Google Cloud Platform Resource Manager](https://console.cloud.google.com/cloud-resource-manager) resources page;
* click Create Project;
* in the New Project window that appears, enter a project name;
* then click on "Create".

> __Note__: We can also create a Google Cloud Platform project from Google SDK.

### Enable Billing on Google App Engine

In order to create Google Cloud Platform resources, the project needs to have a billing account associated with it. To activate it, let's do the following:

* click on "Enable billing";
* click on "Create Billing Account" on the modal window that appears;
* fill in the form in the next window that appears and click on "Agree and Continue";
* in the next window that appears, fill in all the requirements (especially the Payment Info);
* click on "Start my free trial".

> Google will give us 300 USD to test Google App Engine. This is more than enough to cover this article. However, even if we spend all 300 dollars, Google won't charge us anything before asking for our explicitly permission.

### Install the Google SDK

The [Google Cloud SDK](https://cloud.google.com/sdk/) is a set of tools for Cloud Platform. It contains the `gcloud`, `gsutil`, and `bq` tool that we can use to access [Google Compute Engine](https://cloud.google.com/compute/), [Google Cloud Storage](https://cloud.google.com/storage/), [Google BigQuery](https://cloud.google.com/bigquery/), and other products and services from the command-line. We can run these tools interactively or in our automated scripts.

The process of installing the Google SDK differs among platforms (MacOSX, Linux, and Windows). We have to go to [Google Cloud SDK Quickstarts](https://cloud.google.com/sdk/docs/quickstarts) to download the appropriate SDK installer. After download it, we can launch the installer.

The last step during installation will present a set of options. Let's make sure all of them are selected and click the "Finish" button.

If any error occurs, keep reading. Otherwise, move to the _Prepare the LoopBack App_ section.

Let's open a terminal and run this command:

```sh
gcloud init
```

Then we have to accept the option to log in using our Google user account. In our browser, let's log in to our Google user account. Then, when prompted, let's click "Allow" to grant permission to access Google Cloud Platform resources.

After that, at the command prompt, let's select a Cloud Platform project from the list of those where we have Owner, Editor or Viewer permissions:

```sh
Pick cloud project to use:
 [1] [OUR-CLOUD-PRJ-1]
 [2] [OUR-CLOUD-PRJ-2]
 [3] Create a new project
 ...
 Please enter your numeric choice or text value (must exactly match list item):
```

If we only have one project, `gcloud` init selects it for us.

## Prepare the LoopBack App

Having setup our Google App Engine project, the next step is to prepare our LoopBack app. We are going to build a RESTful API similar to Spotify. As everybody knows, Spotify is an online music service that let's users search for their favorite music or artistes.

We will create three models for this demo. The following list shows them with their model structure:

* `Albums`

```sh
    "artists": [{
     "name": ""
    }],
    "album_type": "",
    "image": "",
    "tracks": [{
     "name": ""
    }],
    "release_date": ""
```

* `Tracks`

```sh
   "artists": [{
    "name": ""
   }],
   "albums": [{
    "name": ""
   }],
   "duration": "",
   "image": "",
   "name": ""
```

* `Artists`

```sh
    "name": "",
    "popularity": "",
    "genres": [{
     "name": ""
    }],
    "image": ""
```

## LoopBack API Endpoints

Based on these models, we will use LoopBack to create the following RESTful endpoints.

1. **Albums**

    * POST - `/albums/`: Creates a new album instance.
    * GET - `/albums/`: Returns all albums.
    * GET - `/albums/<id>`: Returns the specified album id.
    * PUT - `/albums/<id>`: Update album attributes.
    * DELETE - `/albums/<id>`: Delete album.

2. **Tracks**

    * POST - `/tracks/`: Creates a new track instance.
    * GET - `/tracks/`: Returns all tracks.
    * GET - `/tracks/<id>`: Returns the specified track id
    * PUT - `/tracks/<id>`: Update track attributes.
    * DELETE - `/tracks/<id>`: Delete track.

3. **Artists**

    * POST - `/artists/`: Creates a new artist instance.
    * GET - `/artists/`: Returns all artists.
    * GET - `/artists/<id>`: Returns the specified artist id.
    * PUT - `/artists/<id>`: Update artist attributes.
    * DELETE - `/artists/<id>`: Delete artist.

### Install the LoopBack CLI

[LoopBack CLI](https://github.com/strongloop/loopback-cli), like the Angular CLI, is a command-line tool that helps to quickly create LoopBack applications, models, and data sources. In other words, LoopBack CLI is an application generator.

To install the LoopBack CLI tool, we can use [NPM as follows](https://www.npmjs.com/):

```sh
npm install -g loopback-cli
```

After the installation is complete, we can run `lb` to start creating an application:

```sh
lb
```

This will prompt us a set of questions to create our app. First, it will ask the app's name. Let's enter `spotify-app`. Then the generator will ask for the name of the directory to contain the project. Let's press _enter_ to accept the default (the same as the application name):

```sh
[?] What\'s the name of your application? spotify-app
[?] Enter name of the directory to contain the project: spotify-app
```

The third question will be about LoopBack version. We can choose `3.x (current)`:

```sh
? Which version of LoopBack would you like to use? (Use arrow keys)
  2.x (long term support)
❯ 3.x (current)
```

Then the last question will be about what kind of application to create. Let's scroll down and choose `hello-world`:

```sh
? What kind of application do you have in mind? (Use arrow keys)
  api-server (A LoopBack API server with local User auth)
  empty-server (An empty LoopBack API, without any configured models or datasources)
❯ hello-world (A project containing a controller, including a single vanilla Message and
    a single remote method)
  notes (A project containing a basic working example, including a memory database)
```

The generator will finally display messages as it scaffolds the application.

### Create Models on LoopBack

As mentioned before, we will creating three models: `Tracks`, `Artists`, and `Albums`. Let's go to our new application directory, then run the LoopBack model generator:

```sh
cd spotify-app

lb model
```

The generator will prompt for a model name. Let's enter `Artists`. After that, it will ask if we want to attach the model to any data sources that have already been defined. Let's select `db (memory)` as the datasource. It will prompt for the base class. Let's select `PersistedModel`.

The fourth question will be about whether we want to expose this REST API. Let's hit _enter_ to accept the default option (yes) and expose `Artists` via REST.

Then, LoopBack will ask us to enter a custom plural form. Let's hit _enter_ to accept the default plural form.

Next, we will be asked whether we want to create the model on the server only or in the `common` directory, where it can potentially be used by both server and client LoopBack APIs. Let's keep the default (`common`) even though in this application you’ll only be working with server-side models.

Right now, we’re going to define properties for the Artists model.

The Artists model will contain `name`, `popularity`, `genres`, and `image` as properties. For each of the properties, we will inform LoopBack about properties' `name`, `type`, whether it is `required` or not, and the default value. Let's use the structure below to fill in the prompts.

* Property name: `name`
* Property type: `string`
* Required?: `Yes`

* Property name: `popularity`
* Property type: `number`
* Required?: `Yes`

* Property name: `genres`
* Property type: `array`
* Type of array item: `string`
* Required?: `Yes`

* Property name: `image`
* Property type: `string`
* Required?: `Yes`

To end the model creation process we can press _enter_ when prompted for the name of the next property.

We have seen how to use LoopBack to generate a model. Let's do the same for the `Albums` and `Tracks` models with the properties shown in the next two sections.

#### Albums

* Property name: `name`, Property type: `string`, Required? `Yes`
* Property name: `artists`, Property type: `array`, Type of array items: `object`, Required? `Yes`
* Property name: `album_type`, Property type: `string`, Required? `Yes`
* Property name: `tracks`, Property type: `array`, Type of array items: `object`, Required? `Yes`
* Property name: `image`, Property type: `string`, Required? `Yes`
* Property name: `release_date`, Property type: `string`, Required? `Yes`

#### Tracks

* Property name: `artists`, Property type: `array`, Type of array items: `object`, Required? `Yes`
* Property name: `albums`, Property type: `array`, Type of array items: `object`, Required? `Yes`
* Property name: `duration`, Property type: `string`, Required? `Yes`
* Property name: `image`, Property type: `string`, Required? `Yes`
* Property name: `name`, Property type: `string`, Required? `Yes`

All these questions and answers will make the model generator to create `.js` and `.json` files in the application’s `common/models` directory.

{% include tweet_quote.html quote_text="One of the powerful advantages of LoopBack is that it automatically generates a REST API for our model." %}

### Connect API to Google Cloud Firestore

Now we will connect our models to a datasource. We will use [Cloud Firestore](https://firebase.google.com/docs/firestore/), a cloud-hosted NoSQL database from Firebase.

To use Cloud Firestore, you need to add the Google Cloud Platform account we created earlier to Firebase. Follow these steps to import your Google Cloud Platform project to [Firebase](https://firebase.google.com/). Therefore, let's:

* navigate to [Firebase console](https://console.firebase.google.com);
* click on `Add project`;
* on the modal that pops up, click the `Project name` dropdown box;
* select the Google Platform account, then click on `Add Firebase`;
* a modal window will show up, click on `Enable API`;
* on the window that appears, Click on `Try Firestore Beta`;
* select `Start in test mode` on the modal that shows up, then click on `Enable`;

Now, we will have a Cloud Firestore database ready for use.

To connect our API to the Cloud Firestore datasource, let's run the following command on our terminal:

```sh
lb datasource
```

Then the data source generator will ask four questions. The following code block shows the questions and possible answers:

```
Enter the data-source name: firestore
Select the connector for firestore: other
Enter the connector\'s module name: loopback-connector-firestore
Install loopback-connector-firestore (Y/n): Y
```

Then we should use a service account. Let's go to [Project Settings > Service Accounts](https://console.cloud.google.com/projectselector/iam-admin/serviceaccounts), generate a new private key, and save the JSON file. We will have to choose our Google App Engine project for LoopBack and then click on the "Create Key" option of "App Engine default service account".

Next, let's fill the application's datasource file (which is located in `./server/datasources.json`) with these details. We can find them in the downloaded JSON file from the Google Cloud Platform.

```sh
{
  # everything else ...
  "firestore": {
      "name": "firestore",
      "connector": "loopback-connector-firestore",
      "type": "service_account",
      "projectId": "<PROJECT_ID>",
      "privateKey": "-----BEGIN PRIVATE KEY-----<KEY>-----END PRIVATE KEY-----\n",
      "clientEmail": "<PROJECT_ID>@appspot.gserviceaccount.com"
  }
}
```

Now let's open up `./server/model-config.json` and change the value of the `dataSource` property from `db` to `firestore` for all three models.

### Create Model Collections

To populate our database, we will create a migration script. We will use this fake value to test our API. Therefore, let's create a file called `./server/boot/create-data-tables.js` and add the following to it:

```js
module.exports = function(app) {
    app.dataSources.firestore.automigrate('Albums', function(err) {
        if (err) throw err;

        app.models.Albums.create([{
            name: 'Arrival',
            artists: [{ name: 'Abba' }],
            album_type: 'Pop',
            image: 'http://www.softshoe-slim.com/covers2/a/abba04.jpg',
            tracks: [{
                name: 'Fernando',
                image: 'http://images.eil.com/large_image/ABBA_FERNANDO-551337.jpg',
                duration: 8989
            }],
            release_date: "1976"
        }, {
            name: 'Thriller',
            artists: [{ name: 'Michael Jackson' }],
            album_type: 'Pop',
            image: 'https://upload.wikimedia.org/wikipedia/en/8/89/Michael_jackson_thriller_12_inch_single_USA.jpg',
            tracks: [{
                name: 'Billie Jean',
                image: 'https://orig00.deviantart.net/cb71/f/2011/050/c/1/michael_jackson___billie_jean_by_prozdesign-d39xo4g.jpg',
                duration: 8989,
            }],
            release_date: "1982"
        }], function(err, Artists) {
            if (err) throw err;

            console.log('Models created: \n', Artists);
        });
    });

    app.dataSources.firestore.automigrate('Tracks', function(err) {
        if (err) throw err;

        app.models.Tracks.create([{
            name: 'Fernando',
            image: 'http://images.eil.com/large_image/ABBA_FERNANDO-551337.jpg',
            duration: 8989,
            albums: [{ name: 'Arrival' }],
            artists: [{ name: 'Abba' }]
        }, {
            name: 'Billie Jean',
            image: 'https://orig00.deviantart.net/cb71/f/2011/050/c/1/michael_jackson___billie_jean_by_prozdesign-d39xo4g.jpg',
            duration: 9894,
            albums: [{ name: 'Thriller' }],
            artists: [{ name: 'Michael Jackson' }]
        }], function(err, Tracks) {
            if (err) throw err;

            console.log('Models created: \n', Tracks);
        });
    });

    app.dataSources.firestore.automigrate('Artists', function(err) {
        if (err) throw err;

        app.models.Artists.create([{
            name: 'Abba',
            popularity: 100,
            genres: [{ name: 'Pop' }],
            image: 'https://upload.wikimedia.org/wikipedia/en/2/27/ABBA_-_The_Album_%28Polar%29.jpg'
        }, {
            name: 'Michael Jackson',
            popularity: 100,
            genres: [{ name: 'Pop' }],
            image: 'https://i.ebayimg.com/images/a/T2eC16JHJGIE9nnWphDbBQdqYRwKD!~~/s-l300.jpg'
        }], function(err, Albums) {
            if (err) throw err;

            console.log('Models created: \n', Albums);
        });
    });

};
```

LoopBack will execute this file during the next boot. It will programmatically seed our Firestore database with the data provided.

## Secure the LoopBack API with Auth0

As responsible developers, we want to secure our API. That's why we will use [Auth0](https://auth0.com). We'll need an Auth0 account to manage authentication, so <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">let's sign up for a free Auth0 account</a>. Next, let's set up an Auth0 API so Auth0 can interface with our LoopBack app.

Let's go to [**APIs**](https://manage.auth0.com/#/apis) in our Auth0 management dashboard and click on the "Create API" button.

Then, let's enter a name for the API and set the **Identifier** to something meaningful like `https://spotify-app.mycompany.com/` (this does not have to be an existing URL, it won't be called). We can leave the **Signing Algorithm** as `RS256`.

Now, let's head over to our terminal and install the following Node.js modules:

```bash
npm install express-jwt jwks-rsa --save
```

After that, let's open our `./server/server.js` file and modify the code to look like this:

```js
'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');

var app = module.exports = loopback();


var jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://{OUR-AUTH0-DOMAIN}/.well-known/jwks.json"
    }),
    audience: '{OUR-AUTH0-API-AUDIENCE}',
    issuer: "https://{OUR-AUTH0-DOMAIN}/",
    algorithms: ['RS256']
});

app.use(jwtCheck);


// apply to a path
app.use('/api/artist', function(req, res, next) {
    res.json("It has valid token", req.user);
});

// catch error
app.use(function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('Invalid token, or no token supplied!');
    } else {
        res.status(401).send(err);
    }
});


app.start = function() {
    // start the web server
    return app.listen(function() {
        app.emit('started');
        var baseUrl = app.get('url').replace(/\/$/, '');
        console.log('Web server listening at: %s', baseUrl);
        if (app.get('loopback-component-explorer')) {
            var explorerPath = app.get('loopback-component-explorer').mountPath;
            console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
        }
    });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
    if (err) throw err;

    // start the server if `$ node server.js`
    if (require.main === module)
        app.start();
});
```

Then, we have to change `{OUR-AUTH0-API-AUDIENCE}` and both apparitions of `{OUR-AUTH0-DOMAIN}` with our Auth0 data. For example:

- `{OUR-AUTH0-DOMAIN}` => `bk-samples.auth0.com`.
- `{OUR-AUTH0-API-AUDIENCE}` => `https://spotify-app.mycompany.com/`.

## Deploy LoopBack to Google App Engine

Great! We are now ready to deploy our application. We can run the app locally using the command `node .` or `npm run start`. However, instead of running this app on our computer, we will push it on Google App Engine in a NodeJS environment. There, the App Engine will take care of the resources our app needs to run and also give our app a good performance boost.

Let's get started by creating a `app.yaml` in the root directory of the app and entering the following content:

```sh
runtime: nodejs
env: flex
```

This `app.yaml` file contains our Node.js App Engine's runtime configurations such as cpu, memory, network and disk resource, automatic or manual scaling configurations and other general settings. It's kind of like `.htaccess` in PHP. [We can read more about `app.yaml` at its official documentation](https://cloud.google.com/appengine/docs/standard/python/config/appref).

Now, let's run the following command to deploy your app:

```sh
gcloud app deploy
```

> __Note__: We must be in the root folder of our project folder.

A series of text and progress will fill in our terminal after running the above command. It will take a few minutes for the deployment to complete. At a point, it will demand where we want our App Engine located.

```sh
Please choose the region where you want your App Engine application located :
[1] europe-west (supports standard and flexible)
[2] europe-west2 (supports standard and flexible)
[3] europe-west3 (supports standard and flexible)
[4] us-east1 (supports standard and flexible)
[4] us-central (supports standard and flexible)
Please enter your numeric choice:
```

Let's type in our numeric choice. Also, it will ask us for our consent to proceed. After successfully deploying our app, we can view the deployed app.

```sh
gcloud app browse
```

## Test LoopBack on Google App Engine

We will test our APIs using [cURL](https://curl.haxx.se/). We need an `access_token` to this. If a user accesses any API endpoint/route without a valid access token or no token at all, our LoopBack application will return a 401 status. To keep things simple, we will request a fresh and new `access_token` from Auth0 for API operation so we don't have to deal with an expired `access_token`.

### Fetching Access Tokens

To a token from Auth0 for any of our authorized applications, let's issue a `POST` request to the `/oauth/token` endpoint. This request will also have a payload in the following format:

```sh
CLIENT_ID="<SOME-AUTH0-CLIENT-ID>";
CLIENT_SECRET="<SOME-AUTH0-CLIENT-SECRET>";

JWT=$(curl --request POST \
  --url https://<OUR-AUTH0-DOMAIN>.auth0.com/oauth/token \
  --header 'content-type: application/json' \
  --data '{"client_id":"'$CLIENT_ID'","client_secret":"'$CLIENT_SECRET'","audience":"https://spotify-app.mycompany.com/","grant_type":"client_credentials"}' | jq .access_token);
```

> Let's not forget [to replace `<SOME-AUTH0-CLIENT-ID>` and `<SOME-AUTH0-CLIENT-SECRET>` with real values from an Auth0 application](https://auth0.com/docs/applications). We also have to replace `<OUR-AUTH0-DOMAIN>` with our Auth0 domain (something like `bk-samples.auth0.com`).

Where:

* `grant_type`: This must be `client_credentials`.
* `client_id`: Our application's Client ID. We can find this value in the [Settings tab of an Auth0 application](https://manage.auth0.com/#/applications).
* `client_secret`: Our application's Client Secret. We can find this value in the [Settings tab of an Auth0 application](https://manage.auth0.com/#/applications).
* `audience`: The Identifier value in the [Settings](https://manage.auth0.com/#/apis) tab of our Auth0 API.

The response contains a [signed JSON Web Token](https://auth0.com/docs/jwt), the token's type (which is `Bearer`), and in how much time it will expire (`86400` seconds, which means `24` hours).

```json
{
  "access_token":"<OUR-ACCESS-TOKEN>",
  "token_type":"Bearer",
  "expires_in":86400
}
```

Now we can use this `access token` in `curl` by sending it as the `Authorization` header to access any of our LoopBack API endpoints.

> **Note**: If we run into any error like `jq command not found`, we have to head over to [Download jq](https://stedolan.github.io/jq/download/) and download the executable for our OS.

Let's test the `Tracks` API.

#### Tracks GET test

```sh
CLIENT_ID="<SOME-AUTH0-CLIENT-ID>";
CLIENT_SECRET="<SOME-AUTH0-CLIENT-SECRET>";

JWT=$(curl --request POST \
  --url https://<OUR-AUTH0-DOMAIN>.auth0.com/oauth/token \
  --header 'content-type: application/json' \
  --data '{"client_id":"'$CLIENT_ID'","client_secret":"'$CLIENT_SECRET'","audience":"https://spotify-app.mycompany.com/","grant_type":"client_credentials"}' | jq .access_token);

curl --request GET \
  --url http://loopback-gae.appspot.com/api/tracks \
  --header "authorization: Bearer "$JWT
```

#### Tracks POST test

```sh
CLIENT_ID="<SOME-AUTH0-CLIENT-ID>";
CLIENT_SECRET="<SOME-AUTH0-CLIENT-SECRET>";

JWT=$(curl --request POST \
  --url https://<OUR-AUTH0-DOMAIN>.auth0.com/oauth/token \
  --header 'content-type: application/json' \
  --data '{"client_id":"'$CLIENT_ID'","client_secret":"'$CLIENT_SECRET'","audience":"https://spotify-app.mycompany.com/","grant_type":"client_credentials"}' | jq .access_token);

curl --request POST \
  --url http://<OUR-APP-URL-HERE>.appspot.com/api/tracks \
  --header 'authorization: Bearer '$JWT \
  --header 'content-type: application/json' \
  --data '{"artists":[{"name":"Michael Jackson"}],"albums":[{"name":"Thriller"}],"duration":90,"image":"billiejean.png","name":"Beat It"}'
```

## Conclusion

We covered some new technologies in this article:

* LoopBack
* Google App Engine
* Google Cloud Firestore
* Auth0 authentication

We have also seen how easy it is to host and run a LoopBack apps on `Google App Engine`, how to use `Google Cloud Firestore` for data persistence, and how to secure our app with JWTs.

Please, feel free to ask if you have any questions or comments in the comment section. 😊
