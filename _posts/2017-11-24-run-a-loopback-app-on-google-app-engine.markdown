---
layout: post
title: "Run a Loopback app on Google App Engine"
description: "Learn how to host and run a Loopback app on Google App Engine."
date: 2017-11-24 03:55
category: Technical Guide, Backend, Loopback, Google App Engine, mLab
author: 
  name: "Chidume Nnamdi"
  url: "twitter.com/ngArchangel"
  mail: "kurtwanger40@gmail.com"
  avatar: "https://secure.gravatar.com/avatar/dbafebf712fa816299231d2763fd292e?s=200"
design: 
  bg_color: "#3445DC"
  image: https://res.cloudinary.com/chidumennamdi/image/upload/v1511973279/Running-WordPress-in-App-Engine_-_Copy_jpd5yz.png
tags:
- google app engine
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

**TL;DR:** In this article, we are going to see how to setup a Google App Engine and host a Loopback app on it.
We'll deploy a sample Loopback application to Google App Engine. By the end, you'll have learned how to:

*    Create a project in Google Cloud Platform
*    Configure Deployments
*    Scaffold a Loopback project using the loopback-cli
*    Learn how to config your App Engine environment in a YAML file
*    Deploy apps with Google Cloud Shell

This is a real App Engine deployment, so when the tutorial is over you can keep working on it.

It's easy to get started developing Loopback.js apps running on Google Cloud Platform. And because the apps you create will be running on the same infrastructure that powers all of Google's products, you can be confident that they will scale to serve all of your users, whether there are a few or millions of them.

Recap: This article assumes that you are familiar with Node.js and that you have installed Node.js.

## What is Loopback

LoopBack is a framework for creating APIs and connecting them with backend data sources. Built on top of Express, it can take a data model definition and easily generate a fully functional end-to-end REST API that can be called by any client.

LoopBack comes with a built-in client, API Explorer. We’ll use this since it makes it easier to see the results of our work, and so that our example can focus on building the API itself.

LoopBack is a highly-extensible, open-source Node.js framework that enables you to:

*    Create dynamic end-to-end REST APIs with little or no coding.
*    Access data from Oracle, MySQL, PostgreSQL, MS SQL Server, MongoDB, SOAP and other REST APIs.
*    Incorporate model relationships and access controls for complex APIs.
*    Run your application on-premises or in the cloud.

## What is Google App Engine

Google App Engine is a web framework and cloud computing platform for developing and hosting web applications in Google-managed data centers. App Engine provides all of the required elements to run and host Web applications, be it on mobile or Web. Without all this features, developers would have to source their own servers, database software and the APIs that would make all of them work properly together, not to mention the entire configuration that must be done.

Google App Engine providing all of the environment requirements, means that you simply deploy your code, and the platform does everything else for you. For example, if you app becomes very successful, App Engine will automatically create more instances to handle the increased volume.

Google App Engine takes burden off the developers so they can concentrate on the app front end and functionality, driving better user experience.

Advantages of Google App Engine include:

*    Readily available servers with no configuration requirement
*    Power scaling function all the way down to "free" when resource usage is minimal
*    Automated cloud computing tools


## Create a Google Cloud Platform project

Google Cloud Platform projects form the basis for creating, enabling, and using all Cloud Platform services including managing APIs, enabling billing, adding and removing collaborators, and managing permissions for Cloud Platform resources.

You can use an already existing project, but let's see how to create a new project if you don't have any.

To create a new project:

*    Go to the [Google Cloud Platform Resource Manager](https://console.cloud.google.com/cloud-resource-manager) resources page.
*    Click Create Project
*    In the New Project window that appears, enter a project name.
*    click on "Create".

Note: This part is optional. You can create a Google Cloud Platform project from Google SDK console when initializing your SDK.

### Enable billing

In order to create Google Cloud Platform resources the project needs to have a billing account associated with it.

* Click on "Enable billing"
* Click on "Create Billing Account" on the modal window that appears.
* Fill in the form in the next window that appears. Click on "Agree and Continue".
* In the next window that appears, Fill in all the requirements especially the Payment Info.
* Click on "Start my free trial".

### Install the Google SDK

The Cloud SDK is a set of tools for Cloud Platform. It contains `gcloud`, `gsutil`, and `bq`, which you can use to access Google Compute Engine, Google Cloud Storage, Google BigQuery, and other products and services from the command-line. You can run these tools interactively or in your automated scripts.

The process of installing the Google SDK differs on different platforms (MacOSX, Linux and Windows).
Go to [Google Cloud SDK Quickstarts](https://cloud.google.com/sdk/docs/quickstarts) to see how to install the SDK on different platforms.
Download the SDK installer based on your OS and launch the installer. 

After the installation has completed, the installer will present many options, make sure all the options are selected and click the finish button.

If any error occurs, not to worry I got your back.

Open up your terminal and run the command:

```sh
gcloud init
```

Accept the option to log in using your Google user account:

```sh
To continue, you must log in. Would you like to log in (Y/n)? Y
```
![](https://IMAGE_URL_HERE)

In your browser, log in to your Google user account when prompted and click Allow to grant permission to access Google Cloud Platform resources.

![](https://IMAGE_URL_HERE)

![](https://IMAGE_URL_HERE)

At the command prompt, select a Cloud Platform project from the list of those where you have Owner, Editor or Viewer permissions:

```sh
Pick cloud project to use:
 [1] [YOUR-CLOUD-PRJ-1]
 [2] [YOUR-CLOUD-PRJ-2]
 [3] Create a new project
 ...
 Please enter your numeric choice or text value (must exactly match list item):
```
![](https://IMAGE_URL_HERE)

If you only have one project, gcloud init selects it for you.

gcloud init after series of set ups and configurations completes successfully

![](https://IMAGE_URL_HERE)

## Prepare the app

Having setup our cloud project, the next step is to prepare our Loopback app.

we are going to build a RESTful API for Spotify. Spotify is an online music service that lets users search for their favourite music or artistes.

I created three models for this demo `Albums`, `Tracks` and `Artists`.

* Albums Model Structure

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

* Tracks Model Structure

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

* Artists Model Structure

```sh
    "name": "",
    "popularity": "",
    "genres": [{
     "name": ""
    }],
    "image": ""
```

## API Endpoints


1. **Albums** - This resource is about the albums.

    * POST - /albums/  Creates a new album instance.
    * GET - /albums/  Returns all albums.
    * GET - /albums/`<id>`  Returns the specified album id.
    * PUT - /albums/`<id>`  Update album attributes.
    * DELETE - /albums/`<id>`  Delete album.

2. **Tracks**

    * POST - /tracks/  Creates a new track instance.
    * GET - /tracks/  Returns all tracks.
    * GET - /tracks/`<id>`  Returns the specified track id
    * PUT - /tracks/`<id>`  Update track attributes.
    * DELETE - /tracks/`<id>`  Delete track.

3. **Artists**

    * POST - /artists/  Creates a new artist instance.
    * GET - /artists/  Returns all artists.
    * GET - /artists/`<id>`  Returns the specified artist id.
    * PUT - /artists/`<id>`  Update artist attributes.
    * DELETE - /artists/`<id>`  Delete artist.

### Install the Loopback CLI

Loopback CLI, like the Angular CLI is a command-line tool provided by StrongLoop that helps to quickly create a LoopBack application, models, and data sources.
In other words, Loopback CLI is an application generator.

To install the Loopback CLI tool:

```sh
npm install -g loopback-cli
```

After the installation has completed, we will run the command.

```sh
lb
```

The LoopBack application generator will greet you with some friendly ASCII art and prompt you for the name of the application.

Enter spotify-app. Then the generator will prompt you for the name of the directory to contain the project; press Enter to accept the default (the same as the application name):

```sh
[?] What's the name of your application? spotify-app
[?] Enter name of the directory to contain the project: spotify-app
```
![](https://IMAGE_URL_HERE)

Then the tool will ask you what kind of application to create:

```sh
? What kind of application do you have in mind? (Use arrow keys)
  api-server (A LoopBack API server with local User auth)
  empty-server (An empty LoopBack API, without any configured models or datasources)
❯ hello-world (A project containing a controller, including a single vanilla Message and
    a single remote method)
  notes (A project containing a basic working example, including a memory database)
```
![](https://IMAGE_URL_HERE)

Scroll down and choose hello-world.

The generator will then display messages as it scaffolds the application including:

```sh
Generating .yo-rc.json
I'm all done. Running npm install for you to install the required dependencies.
If this fails try running the command your self.
```
![](https://IMAGE_URL_HERE)

### Create Models

We wil be creating three models `Tracks`, `Artists` and `Albums`.
Go into your new application directory, then run the LoopBack model generator:

```sh
 cd spotify-app
```

Then, run the command:

```sh
 lb model
 ```

The generator will prompt for a model name.  Enter Artists. It will ask if you want to attach the model to any data sources that have already been defined. Select `db (memory)` as the datasource. It will prompt for the base class. Select `PersistedModel`.

PersistedModel is the base object for all models connected to a persistent data source such as a database.

One of the powerful advantages of LoopBack is that it automatically generates a REST API for your model.  The generator will ask whether you want to expose this REST API.

Hit Enter again to accept the default and expose the Artists model via REST.

You will be asked to enter a Custom plural form. Press Enter to accept the default plural form.

Next, you’ll be asked whether you want to create the model on the server only or in the /common directory, where it can potentially be used by both server and client LoopBack APIs.  Keep, the default, common, even though in this application you’ll only be working with server-side models.

Right now, we’re going to define properties for the Artists model.

The Artists model has `name`, `popularity`, `genres` and `image` as properties. For each of the properties, it will prompt you for the `name`, the `type`, Whether it is `Required` and the default value. Use the below structure to fill in the prompts.

* Property name: name
* Property type: string
* Required?: Yes


* Property name: popularity
* Property type: number
* Required?: Yes


* Property name: genres
* Property type: array
* Type of array item: string
* Required?: Yes


* Property name: image
* Property type: string
* Required?: Yes

![](https://IMAGE_URL_HERE)

End the model creation process by pressing Enter when prompted for the name of the next property.

You have seen how to make a model. Do the same for the `Albums` and `Tracks` models with these properties:

#### Artists

* Property name: name, Property type: string, Required? Yes
* Property name: popularity, Property type: number, Required? Yes
* Property name: genres, Property type: array, Type of array items: string, Required? Yes
* Property name: image, Property type: string, Required? Yes

#### Tracks

* Property name: artists, Property type: array, Type of array items: string, Required? Yes
* Property name: albums, Property type: array, Type of array items: string, Required? Yes
* Property name: duration, Property type: string, Required? Yes
* Property name: image, Property type: string, Required? Yes
* Property name: name, Property type: string, Required? Yes

The model generator will create `.js` and `.json` files in the application’s common/models directory that define our models.


### Connect API to mLab

Now, our models set we will connect our API to a datasource. We are going to use mLab, a cloud-hosted MongoDB. 

The first thing that we have to do is to head to their website and sign up for a free account. After verifying your email address, create a new deployment and choose the Single Node plan. Next, create a database, choose any name you like. Create a user to connect to the database. Now, at the top of the screen, you will see a box with your connection infomation. Copy the `MongoDB URI`, that is the connection URL, you will be using.

To connect our API to datasource, run the following command on your terminal:

```sh
lb datasource
```
It will promt you for a name. Enter `mongodb`. Next, select MongoDB as the connector for mongodb and hit Enter. Go ahead and supply the values for the connection string. 

Click Enter for host, port, user, password, and database. And enter Yes to install the `loopback-connector-mongodb` tool.

![](https://IMAGE_URL_HERE)

Open up `server/model-config.json` and change the value of the `dataSource` property from `db` to `mongodb` for each of the models.


### Create model collections

We will write a migration script that will seed our database. We will use them for testing our API.
Create a file `server/boot/create-data-tables.js`, and add the following to it:

```js
module.exports = function(app) {
    app.dataSources.mongodb.automigrate('Albums', function(err) {
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

    app.dataSources.mongodb.automigrate('Tracks', function(err) {
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

    app.dataSources.mongodb.automigrate('Artists', function(err) {
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
This file wil execute when we boot our server. It will programatically seed our mLab database with the data provided.


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




