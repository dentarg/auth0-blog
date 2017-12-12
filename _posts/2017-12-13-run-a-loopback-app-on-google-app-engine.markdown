---
layout: post
title: "Run a Loopback app on Google App Engine"
description: "Learn how to host and run a Loopback app on Google App Engine."
date: 2017-12-13 08:30
category: Technical Guide, Backend, Loopback
author:
  name: "Chidume Nnamdi"
  url: "twitter.com/ngArchangel"
  mail: "kurtwanger40@gmail.com"
  avatar: "https://secure.gravatar.com/avatar/dbafebf712fa816299231d2763fd292e?s=200"
design:
  bg_color: "#3445DC"
  image: https://res.cloudinary.com/chidumennamdi/image/upload/v1511973279/Running-WordPress-in-App-Engine_-_Copy_jpd5yz.png
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
- 2017-09-07-developing-restful-apis-with-loopback
---

## Introduction

**TL;DR:** In this article, we are going to see how to setup a Google App Engine and host a Loopback app on it. We'll deploy a sample Loopback application to Google App Engine. By the end, you'll have learned how to:

* create a project in Google Cloud Platform;
* configure deployments;
* scaffold a Loopback project using the loopback-cli;
* learn how to config your App Engine environment in a YAML file;
* deploy apps with Google Cloud Shell.

This is a real Google App Engine deployment, so when the tutorial is over you can keep working on it.

It's easy to get started developing Loopback.js apps running on Google Cloud Platform. Besides that, the apps you create will be running on the same infrastructure that powers all Google products. Therefore, you can rest assured that they will scale to serve all of your users, whether there are a few or millions of them.

__Note__: This article assumes that you are familiar with [Node.js and that you have it installed](https://nodejs.org/en/download/).

## What is Loopback

[LoopBack is a framework for creating APIs and connecting them with backend data sources](https://loopback.io/). Built on top of Express, it can take a data model definition and easily generate a fully functional end-to-end REST API that can be called by any client.

LoopBack comes with a built-in client, a API Explorer. We’ll use this since it makes it easier to see the results of our work, and so that our example can focus on building the API itself.

LoopBack is a highly-extensible, open-source Node.js framework that enables you to:

* create dynamic end-to-end REST APIs with little or no coding;
* access data from Oracle, MySQL, PostgreSQL, MS SQL Server, MongoDB, SOAP and other REST APIs;
* incorporate model relationships and access controls for complex APIs;
* run your application on-premises or in the cloud.

## What is Google App Engine

[Google App Engine](https://cloud.google.com/appengine/) is a web framework and cloud computing platform for developing and hosting web applications in Google-managed data centers. App Engine provides all of the required elements to run and host applications, be it on mobile or Web. Without all these features, developers would have to source their own servers, database software and the APIs that would make all of them work properly together, not to mention the entire configuration that must be done.

Google App Engine providing all of the environment requirements, means that you simply deploy your code, and the platform does everything else for you. For example, if you app becomes very successful, Google App Engine can help you scale it properly.

Google App Engine takes burden off the developers so they can concentrate on the app's special features, driving better user experience.

Advantages of Google App Engine include:

* readily available servers with no configuration requirement;
* power scaling function all the way down to "free" when resource usage is minimal;
* automated cloud computing tools.

## Create a Google Cloud Platform project

Projects on Google Cloud Platform form the basis for creating, enabling, and using all Cloud Platform services. This includes managing APIs, enabling billing, adding and removing collaborators, and managing permissions for Cloud Platform resources.

You can use an already existing project, but let's see how to create a new project if you don't have any.

To create a new project:

* go to the [Google Cloud Platform Resource Manager](https://console.cloud.google.com/cloud-resource-manager) resources page;
* click Create Project;
* in the New Project window that appears, enter a project name;
* then click on "Create".

__Note__: You can also create a Google Cloud Platform project from Google SDK console when initializing your SDK.

### Enable Billing on Google App Engine

In order to create Google Cloud Platform resources, the project needs to have a billing account associated with it. To activate it, do the following:

* click on "Enable billing";
* click on "Create Billing Account" on the modal window that appears;
* fill in the form in the next window that appears. Click on "Agree and Continue";
* in the next window that appears, Fill in all the requirements especially the Payment Info;
* click on "Start my free trial".

### Install the Google SDK

The [Google Cloud SDK](https://cloud.google.com/sdk/) is a set of tools for Cloud Platform. It contains the `gcloud`, `gsutil`, and `bq` tool that you can use to access [Google Compute Engine](https://cloud.google.com/compute/), [Google Cloud Storage](https://cloud.google.com/storage/), [Google BigQuery](https://cloud.google.com/bigquery/), and other products and services from the command-line. You can run these tools interactively or in your automated scripts.

The process of installing the Google SDK differs among platforms (MacOSX, Linux and Windows). Go to [Google Cloud SDK Quickstarts](https://cloud.google.com/sdk/docs/quickstarts) to see download the SDK installer based on your OS. After that, launch the installer.

After the installing, many options be presented. Make sure all of them are selected and click the "Finish" button.

If any error occurs, keep reading. Otherwise, move to the _Prepare the LoopBack App_ section.

Open up your terminal and run the command:

```sh
gcloud init
```

Accept the option to log in using your Google user account. In your browser, log in to your Google user account when prompted and click "Allow" to grant permission to access Google Cloud Platform resources.

After that, at the command prompt, select a Cloud Platform project from the list of those where you have Owner, Editor or Viewer permissions:

```sh
Pick cloud project to use:
 [1] [YOUR-CLOUD-PRJ-1]
 [2] [YOUR-CLOUD-PRJ-2]
 [3] Create a new project
 ...
 Please enter your numeric choice or text value (must exactly match list item):
```

If you only have one project, `gcloud` init selects it for you.

## Prepare the LoopBack App

Having setup our Google App Engine project, the next step is to prepare our Loopback app. We are going to build a RESTful API similar to Spotify. As you probably know, Spotify is an online music service that lets users search for their favourite music or artistes.

You will create three models for this demo. The following list shows them with their model structure:

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

Based on these models, you use LoopBack to create the following RESTful endpoints.

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

### Install the Loopback CLI

[Loopback CLI](https://github.com/strongloop/loopback-cli), like the Angular CLI, is a command-line tool that helps to quickly create LoopBack applications, models, and data sources. In other words, Loopback CLI is an application generator.

To install the Loopback CLI tool, you can use [NPM as follows](https://www.npmjs.com/):

```sh
npm install -g loopback-cli
```

After the installation is complete, you can run `lb` to start creating an application:

```sh
lb
```

This will prompt you a set of questions to create your app. First, it will ask the app's name. Enter `spotify-app`. Then the generator will prompt you for the name of the directory to contain the project. Press Enter to accept the default (the same as the application name):

```sh
[?] What\'s the name of your application? spotify-app
[?] Enter name of the directory to contain the project: spotify-app
```

The third question will be about LoopBack version. You can choose `3.x (current)`:

```sh
? Which version of LoopBack would you like to use? (Use arrow keys)
  2.x (long term support)
❯ 3.x (current)
```

The last question will be about what kind of application to create. Scroll down and choose `hello-world`:

```sh
? What kind of application do you have in mind? (Use arrow keys)
  api-server (A LoopBack API server with local User auth)
  empty-server (An empty LoopBack API, without any configured models or datasources)
❯ hello-world (A project containing a controller, including a single vanilla Message and
    a single remote method)
  notes (A project containing a basic working example, including a memory database)
```

The generator will then display messages as it scaffolds the application including.

### Create Models on LoopBack

As mentioned before, you will creating three models: `Tracks`, `Artists`, and `Albums`. Go into your new application directory, then run the LoopBack model generator:

```sh
cd spotify-app

lb model
```

The generator will prompt for a model name. Enter `Artists`. After that, it will ask if you want to attach the model to any data sources that have already been defined. Select `db (memory)` as the datasource. It will prompt for the base class. Select `PersistedModel`.

The fourth question will be about whether you want to expose this REST API. Hit Enter to accept the default (yes) option and expose the Artists model via REST.

Then, you will be asked to enter a custom plural form. Press Enter to accept the default plural form.

Next, you’ll be asked whether you want to create the model on the server only or in the `common` directory, where it can potentially be used by both server and client LoopBack APIs. Keep the default (`common`) even though in this application you’ll only be working with server-side models.

Right now, we’re going to define properties for the Artists model.

The Artists model will contain `name`, `popularity`, `genres`, and `image` as properties. For each of the properties, you will inform LoopBack about properties' `name`, `type`, whether it is `required`, and the default value. Use the structure below to fill in the prompts.

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

End the model creation process by pressing Enter when prompted for the name of the next property.

You have seen how to make a model. Do the same for the `Albums` and `Tracks` models with the properties shown in the next two sections.

#### Albums

* Property name: `name`, Property type: `string`, Required? `Yes`
* Property name: `popularity`, Property type: `number`, Required? `Yes`
* Property name: `genres`, Property type: `array`, Type of array items: `string`, Required? `Yes`
* Property name: `image`, Property type: `string`, Required? `Yes`

#### Tracks

* Property name: `artists`, Property type: `array`, Type of array items: `string`, Required? `Yes`
* Property name: `albums`, Property type: `array`, Type of array items: `string`, Required? `Yes`
* Property name: `duration`, Property type: `string`, Required? `Yes`
* Property name: `image`, Property type: `string`, Required? `Yes`
* Property name: `name`, Property type: `string`, Required? `Yes`

All this questions and answers will make the model generator to create `.js` and `.json` files in the application’s `common/models` directory.

{% include tweet_quote.html quote_text="One of the powerful advantages of LoopBack is that it automatically generates a REST API for your model." %}

### Connect API to Google Cloud Firestore

Now you will connect your models to a datasource. You will use [Cloud Firestore](https://firebase.google.com/docs/firestore/), a cloud-hosted NoSQL database from Firebase.

To use Cloud Firestore, you need to add the Google Cloud Platform account we created earlier to Firebase. Follow these steps to import your Google Cloud Platform project to Firebase:

* navigate to [Firebase console](https://console.firebase.google.com);
* click on `Add project`;
* on the modal that pops up, click the `Project name` dropdown box;
* select the Google Platform account, then click on `Add Firebase`;
* a modal window will show up, click on `Enable API`;
* on the window that appears, Click on `Try Firestore Beta`;
* select `Start in test mode` on the modal that shows up, then click on `Enable`;

Now, we will have a Cloud Firestore database ready for use.

To connect our API to the Cloud Firestore datasource, run the following command on your terminal:

```sh
lb datasource
```

Then the data source generator will ask four questions. The following code block shows the questions and possible answers:

```
Enter the data-source name: firestore
Select the connector for firestore: other
Enter the connector\'s module name loopback-connector-firestore
Install loopback-connector-firestore (Y/n) Y
```

Then you should use a service account. Go to [Project Settings > Service Accounts](https://console.cloud.google.com/projectselector/iam-admin/serviceaccounts), generate a new private key, and save the JSON file. You will have to choose your Google App Engine project for LoopBack and then click on the "Create Key" option of "App Engine default service account".

Next, fill the application's datasource file (which is located in `./server/datasources.json`) with those details. You can find them in the downloaded JSON file from the Google Cloud Platform.

```sh
    # everything else ...
    "firestore": {
        "name": "firestore",
        "connector": "loopback-connector-firestore",
        "type": "service_account",
        "projectId": "<PROJECT_ID>",
        "privateKey": "-----BEGIN PRIVATE KEY-----<KEY>-----END PRIVATE KEY-----\n",
        "clientEmail": "<PROJECT_ID>@appspot.gserviceaccount.com"
    }
    # everything else ...
```

Open up `./server/model-config.json` and change the value of the `dataSource` property from `db` to `firestore` for all three models.

### Create Model Collections

To see your database, you will create a migration script. You will use them for testing our API.
Create a file `./server/boot/create-data-tables.js`, and add the following to it:

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

LoopBack will execute this file will when during the next boot. It will programmatically seed your Firestore database with the data provided.

### Secure the Spotify API

We will secure our APIs with Auth0. You'll need an [Auth0](https://auth0.com) account to manage authentication. You can sign up for a [free account here](javascript:signup\(\)). Next, set up an Auth0 Client and API so Auth0 can interface with your app and API.

Follow these steps to set up a Client App

1. Go to your [**Auth0 Dashboard**](https://manage.auth0.com/#/) and click the "[create a new client](https://manage.auth0.com/#/clients/create)" button.
2. Name your new app, select "Single Page Web Applications", and click the "Create" button.
3. In the **Settings** for your new Auth0 client app, add `http://localhost:[PORT]/callback` to the **Allowed Callback URLs**.
4. Scroll down to the bottom of the **Settings** section and click "Show Advanced Settings". Choose the **OAuth** tab and verify that the **JsonWebToken Signature Algorithm** is set to `RS256`.
5. Click the "Save Changes" button.
6. If you'd like, you can [set up some social connections](https://manage.auth0.com/#/connections/social). You can then enable them for your app in the **Client** options under the **Connections** tab. The example shown in the screenshot above utilizes username/password database, Facebook, Google, and Twitter.

After completing the above, you wiil now set up an API

Go to [**APIs**](https://manage.auth0.com/#/apis) in your dashboard and click on the "Create API" button.

![](https://IMAGE_URL_HERE)

Enter a name for the API. Set the **Identifier** to your API endpoint URL. In this example, this is `http://localhost:[PORT]/api/`. The **Signing Algorithm** should be `RS256`.
Head over to your terminal and install the following node modules:

```bash
npm install express-jwt jwks-rsa --save
```

Open up your `server/server.js` file and modify the code to look like this:

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
        jwksUri: "https://{YOUR-AUTH0-URL-HERE}.auth0.com/.well-known/jwks.json"
    }),
    audience: '{YOUR-API-AUDIENCE-GOES-HERE}',
    issuer: "{YOUR-AUTH0-ISSUER-HERE}",
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
## Deploy the app

Here comes the important part of this article. We now have a loopback app fully setup. We can run the app locally using the command `node .` or `npm run start`. Instead of, running this app on our system, we will push it on Google App Engine, a NodeJS environment, there the App Engine will take care of the resources our app needs to run and also, give our app a good perfomance boost.

Let's get started. Create a app.yaml in the root directory of the app and enter the following content:

```sh
runtime: nodejs
env: flex
```

`app.yaml` contains our Node.js App Engine's runtime configurations such as cpu, memory, network and disk resource, automatic or manual scaling configurations and other general settings. It's kind of like .htaccess in php. You can read more about app.yaml at its official documentation.

Run the following command to deploy your app:

```sh
gcloud app deploy
```
![](https://IMAGE_URL_HERE)

Note: You must be in the root folder of your project folder.

Series of text and progress will fill in your terminal after running the above command. It will take about 4 to 6 minutes for the deployment to complete. At a point, it will demand where you want your App Engine located.

```sh
Please choose the region where you want your App Engine application located :
[1] europe-west (supports standard and flexible)
[2] europe-west2 (supports standard and flexible)
[3] europe-west3 (supports standard and flexible)
[4] us-east1 (supports standard and flexible)
[4] us-central (supports standard and flexible)
Please enter your numeric choice:
```
![](https://IMAGE_URL_HERE)

Type in your numeric choice. Also, it will ask you for your consent to proceed.

```sh
Do you want to continue (Y/n)?
```
After successfully deploying our app, we can view the deployed app:

![](https://IMAGE_URL_HERE)

Note: The Deployed service URL, will be where we will direct all our requests.

```sh
gcloud app browse
```

## Test the app

We will test our APIs using Postman.

Note: Replace the YOUR-AUTH0-URL-HERE, YOUR-API-AUDIENCE-GOES-HERE and, YOUR-AUTH0-ISSUER-HERE placeholders with the API audience and Auth0 domain values from your Auth0 dashboard.

Before we start the test. Go to your Auth0 dashboard and copy the access token. We will use the access token for authorization when sending request to our APIs.

![](https://IMAGE_URL_HERE)

Now use this access token in Postman by sending it as an Authorization header to access any API endpoint.

![](https://IMAGE_URL_HERE)

We will test for the Tracks API.

Tracks GET test

![](https://IMAGE_URL_HERE)

Tracks POST test

![](https://IMAGE_URL_HERE)
