---
layout: post
title: "The Complete Guide To Deploying JavaScript Applications"
description: "Learn how to deploy JavaScript applications on different platforms."
longdescription: "We are constantly faced with deploying and configuring Single Page Applications running in a browser and Server-side applications running on Node.js. Equip yourself with the knowledge to deploy JavaScript applications to production on different platforms in this guide."
date: 2017-12-21 08:30
category: Technical guide, Frameworks, JavaScript
design:
  bg_color: "#484C89"
  image: https://cdn2.auth0.com/blog/ultimateguide.png
author:
  name: Prosper Otemuyiwa
  url: http://twitter.com/unicodeveloper?lang=en
  mail: prosper.otemuyiwa@auth0.com
  avatar: https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200
tags:
- php
- laravel
- heroku
- deployment
related:
- 2017-02-02-migrating-a-php5-app-to-php7-part-one
- 2017-02-07-migrating-a-php5-app-to-php7-part-two
- 2017-05-08-the-ultimate-guide-to-deploying-php-applications
---

**TL;DR:** Atwood's law states that _Any application that can be written in JavaScript, will eventually be written in JavaScript._  In 2018, eleven years after this law was proposed, JavaScript is now the [most popular language](https://insights.stackoverflow.com/survey/2017#technology-programming-languages) in the world. In this tutorial, I'll show you how to deploy your JavaScript applications to diferent cloud platforms such as [Google Cloud](https://cloud.google.com), [Microsoft Azure](https://azure.microsoft.com), [Netlify](https://www.netlify.com/), and others. This article is not about performance.

---


## The Client-Server Architecture

Modern applications employ the client-server architecture. This architecture separates application software into two categories, **clients** and **servers** to better employ available computing resources and share data processing loads. These categories are otherwise known as, **front-end**, and **back-end**. The client and server application can be hosted on the same machine but it's more efficient and effective when the client and server applications are hosted and executed on different machines connected via a network.

The client-server architecture aids efficiency by allowing the option of having different _clients_ consume a server resource. These _clients_ could be Single Page Applications (SPAs), mobile applications, or non-interactive clients such as CLIs or Daemons.

In recent times, most JavaScript applications are bundled and deployed as Single Page Applications running on _Vanilla JS_, _Vue_, _React_, _Polymer_, _Angular_, consuming and pushing data to a backend application running on _Node_. The _front-end/back-end_ model of building software is common not only in the JavaScript community, but the developer community at large. And these applications are deployed to cloud servers.

## Introduction to Cloud Server

Cloud servers are basically virtual servers that run within a cloud computing environment. There are various benefits to hosting and deploying your applications on the cloud. They are:

- Economically efficient.
- You have the freedom to modify the server software to your needs.
- Cloud servers scale very well.
- Stability and security.

In fact, many companies have moved their infrastructure to the cloud in order to reduce cost and complexity. It's a great option for small, mid-sized, and enterprise scale businesses. If you write a lot of tutorials and do POCs (Proof-of-concepts) like me, it's also a great choice for you!

A generic JavaScript application involves a:

- **Front-end:** _HTML_, _CSS_, and _JavaScript_. A couple of CSS frameworks that can be used on the front-end are:

  <ul>
    <li>**[Bootstrap](https://getbootstrap.com/):** The most popular CSS framework in the world </li>
    <li>**[Bulma](https://bulma.io):** A modern CSS framework based on Flexbox </li>
    <li>**[Tailwind](https://tailwindcss.com/):** A utility-first CSS framework for rapid UI development </li>
  </ul>

A couple of JavaScript front-end frameworks that can be used on the front-end are:

  <ul>
    <li>**[React](https://getbootstrap.com/)**</li>
    <li>**[Vue](https://vuejs.org/)**</li>
    <li>**[Angular](https://angular.io/)**</li>
    <li>**[Preact](https://preactjs.com/)**</li>
    <li>**[Polymer](https://www.polymer-project.org/)**</li>
    <li>**[Svelte](https://svelte.technology/)**</li>
    <li>**[Mithril](https://mithril.js.org/)**</li>
  </ul>

- **Back-end:** JavaScript running on a Node.js server. Some frameworks that can be used on the back-end are:

  <ul>
    <li>**[Express](https://expressjs.com/):** Fast, unopinionated, minimalist web framework for Node.js. </li>
    <li>**[Hapi](https://hapijs.com/):** Rich framework for building applications and services. </li>
    <li>**[Koa](http://koajs.com/):** Next generation web framework for Node.js. </li>
    <li>**[Sails](https://sailsjs.com/):** Realtime MVC framework for Node.js. </li>
  </ul>

Examples of Databases that can be used are:

  <ul>
    <li>**[MongoDB](https://www.mongodb.com/)**</li>
    <li>**[MySQL](https://www.mysql.com/)**</li>
    <li>**[PostgreSQL](https://www.postgresql.org/)**</li>
  </ul>


## Application To Deploy 

In this tutorial, we'll be deploying this sample application, **Meetups**. The Architecture is not complex. It's composed of a back-end and a front-end.

The back-end comprises of the following:

- **A MongoDB Database**
- **A Node.js web framework - Express**

The front-end comprises of the following:

- **Vue.js** - JavaScript Front-end framework.
- **Twitter Bootstrap** - CSS framework for styling our app.

### Application Key Requirements

In order to run **Meetups**, you need to have the following tools installed on your machine.

* **Node.js**: Navigate to the [Node.js website](https://nodejs.org/en/download/) and install the latest version on your machine. Ensure that `npm` works via the terminal.
* **MongoDB**: Navigate to the [mongodb website](https://www.mongodb.com/download-center?ct=false#atlas) and install the MongoDB community server edition. If you are using a Mac, I'll recommend following this [instruction](https://treehouse.github.io/installation-guides/mac/mongo-mac.html). To avoid micromanaging from the terminal, I'll also recommend installing a MongoDB GUI, [Robo 3T](https://robomongo.org), formerly known as RoboMongo. You can then run `mongod` from the terminal to start up the MongoDB service on your machine.

> MongoDB works seamlessly with Node.js backends.

Next, let's cover how to deploy this sample JavaScript application. First, we'll hand over the database management to a cloud service. One great benefit of operating a remote database is having several apps pull data from the database service. In addition, you can optimize as much as possible because of the dedicated service your database runs on.

## Database Deployment

There are several database cloud services that can manage your database effectively. For relational databases, we have some great services such as:

- **Amazon RDS (SQL) / Amazon Aurora**
- **Microsoft Azure SQL**
- **Google Cloud SQL**
- **Elephant SQL**

For NoSQL databases such as the database _Meetups_ operates, we have some services such as:

- [mlab](https://mlab.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Amazon DynamoDB](https://aws.amazon.com/dynamodb/)
- [Microsoft Azure CosmosDB](https://azure.microsoft.com/en-us/services/cosmos-db/)
- [Cloud Firestore](https://firebase.google.com/docs/firestore/)

### mLab

mLab is a cloud platform that provides Database-as-a-service for MongoDB. The free version provides developers with 500MB storage. Let's go ahead and create a database for our app on mLab. 

Make sure you follow these steps below:

- Create an account with [mLab](https://mlab.com/signup/)
- Go to the [mLab Dashboard](https://mlab.com/home) and click the "Create new" button.
- Choose a **Cloud Provider** amongst these three providers, _Amazon Web Services_, _Google Cloud Platform_, and _Microsoft Azure_. For this tutorial, I chose _Amazon Web Services_.
- Select a **Plan type** amongst these plans: _Sandbox_, _Shared_, and _Dedicated_. For app prototyping, POCs, and demos, I recommend the _Sandbox_ option which is free and has up to 0.5GB storage.
- Choose a region for the Cloud Provider you previously selected and click on _"Continue"_. It's always recommended to choose a region closer to you or your target market.
- Choose a database name. I chose `meetup` as the db name.

  ![JavaScript Deploy - Choosing Database name](https://cdn.auth0.com/blog/jsdeploy/dbnamemlab.png)

- Click "Continue". Once it has been created, you'll see the database in the dashboard like so:

  ![JavaScript Deploy - Recently created database](https://cdn.auth0.com/blog/jsdeploy/recentlycreateddb.png)

- Click on the recently created database. An interface will be presented to you with a connection string like so:

  ![JavaScript Deploy - Connection to the database](https://cdn.auth0.com/blog/jsdeploy/connectingtothedb.png)

This is the connection string: `mongodb://<dbuser>:<dbpassword>@ds235827.mlab.com:35827/meetup`. `<dbuser>` is the database user required to connect to the db. `<password>` is the password assigned to the database user. In the diagram above, there is a notice that states that _A database user is required to connect to this database_.

All I need to do is replace my local connection string with that of mLabs.

![JavaScript Deploy - Connection String](https://cdn.auth0.com/blog/jsdeploy/dbconnectionstring.png)

> Note: In a real-world scenario, you should have a config file with the local and production connection strings. You can use `process.env` to determine whether the app is running locally or on production and assign the appropriate database connection string based on the environment.

### MongoDB Atlas

MongoDB Atlas is a cloud platform that also provides Database-as-a-service for MongoDB. The free version provides developers with 512MB storage. Let's go ahead and create a database for our app on MongoDBAtlas. 

Make sure you follow these steps below:

- Create an account with [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- A dialog box will be presented to you with a lot of form fields.
- Choose a name for your cluster, a cloud provider, and region like so:
  
  ![JavaScript Deploy - Cluster details](https://cdn.auth0.com/blog/jsdeploy/atlasclusterdetails.png)

- Scroll down a bit to **Instance size**. Here you can choose a plan for your app. I chose the free version for the purpose of this tutorial. The free version is also great for prototyping, POCs and demos.

  ![JavaScript Deploy - Select plan](https://cdn.auth0.com/blog/jsdeploy/atlasselectplan.png)

- Scroll down and provide a username and password that your app will use to connect to your cluster.

  ![JavaScript Deploy - Atlas connection details](https://cdn.auth0.com/blog/jsdeploy/atlasconnectiondetailstocluster.png)

- Click on _Confirm and Deploy_. Confirm that you are not a robot and your cluster will be created within seven to ten minutes. It's noteworthy to let you know that this is the longest time I've seen a service take to provision a fresh database cluster.
- Once it is done provisioning, your dashboard should look like so:

![JavaScript Deploy - Atlas dashboard](https://cdn.auth0.com/blog/jsdeploy/atlasdashboard.png)

- The next step is to click the **Connect** button. You'll be asked to whitelist an IP address or you can simply allow access from anywhere. I particularly like this feature, for security reasons.
- Choose a connection method. I chose **Connect Your Application** because that's what is needed for our use case.
- Select the MongoDB driver appropriate for your use case and copy the respective URI connection string. Mine is `mongodb://unicodeveloper:<PASSWORD>@meetup-shard-00-00-hjyfh.mongodb.net:27017,meetup-shard-00-01-hjyfh.mongodb.net:27017,meetup-shard-00-02-hjyfh.mongodb.net:27017/test?ssl=true&replicaSet=meetup-shard-0&authSource=admin`. 

> Note: Replace `test` with the name of your database, else all your data will be stored in `test` database.

### Amazon DynamoDB

Amazon DynamoDB is a cloud platform that provides a fast and flexible NoSQL database service. Head over to [Amazon DynamoDB](https://aws.amazon.com/dynamodb/).

- If you don't have an AWS account, sign up for one.
- Head over to the database section and select _Amazon DynamoDB_.
- Create a table.

  ![JavaScript Deploy - AWS Table creation](https://cdn.auth0.com/blog/jsdeploy/awscreatetable.png)

  ![JavaScript Deploy - AWS table](https://cdn.auth0.com/blog/jsdeploy/awstable.png)
- Follow [this instruction to install the Node.js AWS SDK](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.html), get the access key and connect to the DynamoDB table.
- You can't have more than 256 tables per account.

### Microsoft Azure CosmosDB

Microsoft Azure CosmosDB is a cloud platform that provides a globally distributed, multi-model database service. It provides native support for NoSQL choices, and offers multiple well-defined consistency models. To provision a database on Microsoft Azure platform, you need to follow these steps:

- Create a new [account](https://portal.azure.com).
- Select `Azure Cosmos DB` by the left sidebar and create database.

  ![Create Cosmos DB](https://cdn.auth0.com/blog/jsdeploy/createcosmosdb.png)

- During creation, select the type of database you want under **API**.

  ![MongoDB creation](https://cdn.auth0.com/blog/jsdeploy/chooseapi.png)

- Once you are done, create the database and click on _Show database connection strings_.
  
  ![Show MongoDB database connection strings](https://cdn.auth0.com/blog/jsdeploy/azureconnectionstring.png)

Use the URL Connection string in your application to connect to the remote database.

### Cloud Firestore

Cloud Firestore is a cloud-hosted, NoSQL database that your iOS, Android, and web apps can access directly via native SDKs. It is currently in beta release. It supports the following:

- Flexible, hierarchical data structures.
- Stores data in documents, organized into collections.
- Queries for retrieving individual, specific documents or to retrieve all the documents in a collection that match your query parameters.
- Realtime updates via data synchronization.
- Offline usage.

Follow the steps below to create a database.

- Signup for an [account on Firebase](https://console.firebase.google.com/).
- Create a new project.

  ![Create Firebase Project](https://cdn.auth0.com/blog/jsdeploy/createfirebaseproject.png)

- In the database section, scroll down and click **TRY FIRESTORE BETA**. Choose **test mode** to get started. However, do not forget to switch away from this mode in production.

  ![Firestore mode](https://cdn.auth0.com/blog/jsdeploy/firestoremode.png)
- Go ahead and install the Firebase admin SDK via `npm`.

  ```bash
    npm install --save firebase-admin@^5.5.1
  ```
- If your Node.js server is running on **Google Cloud Platform**, all you need to do is initialize it like so:

    ```js
    const admin = require('firebase-admin');

    admin.initializeApp({
        credential: admin.credential.applicationDefault()
    });

    var db = admin.firestore();
    ```
- If your Node.js server is running on a different platform, you'll need a [Google service account](https://cloud.google.com/compute/docs/authentication). Head over to **Project Settings > Service Accounts** in the Cloud Platform Console. Generate a new private key and save the JSON file. Then use the file to initialize the SDK:

    ```js
    const admin = require('firebase-admin');

    var serviceAccount = require("path/to/serviceAccountKey.json");

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    var db = admin.firestore();
    ```
- Creating a new collection, `meetups` is as easy as:

    ```js
    var meetupRef = db.collection('meetups').doc('meets')

    var publicMeetup = meetupRef.set({
        'name': 'forLoop Lagos',
        'host': 'Prosper Otemuyiwa',
        'attendees': '700',
        'type': 'public'
    });
    ```
- Reading data from the `meetups` collection, is as easy as:

    ```js
    db.collection('meetups').get()
    .then((snapshot) => {
        snapshot.forEach((meetup) => {
            console.log(meetup.name);
        });
    })
    .catch((err) => {
        console.log('Error getting documents', err);
    });
    ```

Check out more [information on using Firestore](https://firebase.google.com/docs/firestore/data-model). Next, let's cover SQL databases.

### Google Cloud SQL

**Google Cloud SQL** is a fully-managed database service that makes it easy to set up, maintain, manage, and administer your relational `PostgreSQL BETA` and `MySQL` databases in the cloud. Cloud SQL offers high performance, scalability, and convenience. Hosted on Google Cloud Platform, Cloud SQL provides a database infrastructure for applications running anywhere.

It offers:

- Up to 10TB of storage capacity, 40,000 IOPS, and 416GB of RAM per instance.
- Automatic data encryption.
- Google Cloud SQL is SSAE 16, ISO 27001, PCI DSS v3.0, and HIPAA compliant.
- High performance and more.

You can follow the steps below to get started with provisioning a database.

- Head over to [Google Cloud SQL](https://console.cloud.google.com/sql/). If you don't have a google acount, sign up for one.
- Create a new project.

  ![Create a new project](https://cdn.auth0.com/blog/jsdeploy/createprojectgcs.png)

- Create a new cluster instance.

  ![Create a new instance](https://cdn.auth0.com/blog/jsdeploy/createinstancegcs.png)

- Choose the type of database, **MySQL**, or **PostgreSQL**.

  ![Choose the type of database](https://cdn.auth0.com/blog/jsdeploy/choosemysql.png)

- Select the region, choose an ID and password for database access and finally create the instance.

  ![Finally create an instance](https://cdn.auth0.com/blog/jsdeploy/createinstance.png)

- You should be presented with a dashboard after the instance has been created.

  ![Google Cloud SQL dashboard](https://cdn.auth0.com/blog/jsdeploy/gcsdashboard.png)

- Head over to the **DATABASES** section and create a database for your application.

  ![Create database in GCS dashboard](https://cdn.auth0.com/blog/jsdeploy/createdatabase.png)


The next step is to choose the connection methods. Check out the [documentation](https://cloud.google.com/sql/docs/mysql/external-connection-methods) on the connection options for external applications.

### Elephant SQL

**Elephant SQL** is a cloud platform that offers PostgreSQL as a service. It offers a shared and dedicated instance. The free shared instance offers 20MB data storage and 5 concurrent connections.

You can follow the steps below to get started with provisioning a database.

- Create a new [account](https://customer.elephantsql.com/instance/create?plan=turtle#).
- Create a new instance.

  ![Create Elephant SQL instance](https://cdn.auth0.com/blog/jsdeploy/createelephantinstance.png)

  ![Created Elephant SQL instance](https://cdn.auth0.com/blog/jsdeploy/createdinstance.png)

- Click on the recently created instance. You'll be directed to a dashboard that shows the URL connection string.

  ![URL Connection string](https://cdn.auth0.com/blog/jsdeploy/urlconnectionstring.png)

Use the URL Connection string in your application to connect to the remote database. It's really simple.

### Microsoft Azure SQL

**Microsoft Azure SQL** is a cloud platform that offers SQL Server as a service. 

You can follow the steps below to get started with provisioning a database.

- Create a new [account](https://portal.azure.com).
- Select `SQL Databases` by the left sidebar and create database.

  ![Create SQL database](https://cdn.auth0.com/blog/jsdeploy/createsqldatabase.png)

- During creation, create a new server by filling in the right details and clicking on `Select`.

  ![SQL server creation](https://cdn.auth0.com/blog/jsdeploy/sqlserver.png)

- Once you are done, create the database and click on _Show database connection strings_.
  
  ![Show database connection strings](https://cdn.auth0.com/blog/jsdeploy/showdatabaseconnection.png)

Use the URL Connection string in your application to connect to the remote database.

### Amazon RDS

Amazon Relational Database Service (RDS) is a cloud platform that makes it easy to set up a relational database. It provides six popular database engines:

- [Aurora](https://aws.amazon.com/rds/aurora/)
- [PostgreSQL](https://aws.amazon.com/rds/postgresql/)
- [MySQL](https://aws.amazon.com/rds/mysql/)
- [MariaDB](https://aws.amazon.com/rds/mariadb/)
- [Oracle](https://aws.amazon.com/rds/oracle/)
- [Microsoft SQL Server](https://aws.amazon.com/rds/sqlserver/)

It is higly optimized for memory, I/O and performance.






  








- A dialog box will be presented to you with a lot of form fields.
- Choose a name for your cluster, a cloud provider, and region like so:
  
  ![JavaScript Deploy - Cluster details](https://cdn.auth0.com/blog/jsdeploy/atlasclusterdetails.png)

- Scroll down a bit to **Instance size**. Here you can choose a plan for your app. I chose the free version for the purpose of this tutorial. The free version is also great for prototyping, POCs and demos.

  ![JavaScript Deploy - Select plan](https://cdn.auth0.com/blog/jsdeploy/atlasselectplan.png)

- Scroll down and provide a username and password that your app will use to connect to your cluster.

  ![JavaScript Deploy - Atlas connection details](https://cdn.auth0.com/blog/jsdeploy/atlasconnectiondetailstocluster.png)

- Click on _Confirm and Deploy_. Confirm that you are not a robot and your cluster will be created within seven to ten minutes. It's noteworthy to let you know that this is the longest time I've seen a service take to provision a fresh database cluster.
- Once it is done provisioning, your dashboard should look like so:

![JavaScript Deploy - Atlas dashboard](https://cdn.auth0.com/blog/jsdeploy/atlasdashboard.png)

- The next step is to click the **Connect** button. You'll be asked to whitelist an IP address or you can simply allow access from anywhere. I particularly like this feature, for security reasons.
- Choose a connection method. I chose **Connect Your Application** because that's what is needed for our use case.
- Select the MongoDB driver appropriate for your use case and copy the respective URI connection string. Mine is `mongodb://unicodeveloper:<PASSWORD>@meetup-shard-00-00-hjyfh.mongodb.net:27017,meetup-shard-00-01-hjyfh.mongodb.net:27017,meetup-shard-00-02-hjyfh.mongodb.net:27017/test?ssl=true&replicaSet=meetup-shard-0&authSource=admin`. 

> Note: Replace `test` with the name of your database, else all your data will be stored in `test` database.



- Go to the [mLab Dashboard](https://mlab.com/home) and click the "Create new" button.
- Choose a **Cloud Provider** amongst these three providers, _Amazon Web Services_, _Google Cloud Platform_, and _Microsoft Azure_. For this tutorial, I chose _Amazon Web Services_.
- Select a **Plan type** amongst these plans: _Sandbox_, _Shared_, and _Dedicated_. For app prototyping, POCs, and demos, I recommend the _Sandbox_ option which is free and has up to 0.5GB storage.
- Choose a region for the Cloud Provider you previously selected and click on _"Continue"_. It's always recommended to choose a region closer to you or your target market.
- Choose a database name. I chose `meetup` as the db name.

  ![JavaScript Deploy - Choosing Database name](https://cdn.auth0.com/blog/jsdeploy/dbnamemlab.png)

- Click "Continue". Once it has been created, you'll see the database in the dashboard like so:

  ![JavaScript Deploy - Recently created database](https://cdn.auth0.com/blog/jsdeploy/recentlycreateddb.png)

- Click on the recently created database. An interface will be presented to you with a connection string like so:

  ![JavaScript Deploy - Connection to the database](https://cdn.auth0.com/blog/jsdeploy/connectingtothedb.png)

This is the connection string: `mongodb://<dbuser>:<dbpassword>@ds235827.mlab.com:35827/meetup`. `<dbuser>` is the database user required to connect to the db. `<password>` is the password assigned to the database user. In the diagram above, there is a notice that states that _A database user is required to connect to this database_.

All I need to do is replace my local connection string with that of mLabs.

![JavaScript Deploy - Connection String](https://cdn.auth0.com/blog/jsdeploy/dbconnectionstring.png)

> Note: In a real-world scenario, you should have a config file with the local and production connection strings. You can use `process.env` to determine whether the app is running locally or on production and assign the appropriate database connection string based on the environment.


## Heroku

Heroku is a cloud platform that helps you deploy and host your applications the modern way. It does all the heavy-lifting for you. Let's quickly take a look at how to deploy and maintain a PHP application on heroku.

![PHP-Heroku Architecture](https://cdn2.auth0.com/blog/ultimateguide/php-heroku-architecture.png)
_PHP Heroku Architecture_

If you don't have an account, go ahead and create one on [heroku.com](https://www.heroku.com/). Go ahead and install the [heroku cli](https://devcenter.heroku.com/articles/heroku-cli). Once you have that installed, go ahead and clone this simple [starwars PHP application](https://github.com/auth0-blog/starwars-phpapp).

> Heroku runs your PHP app in a dyno, a smart container which provides a modern stack with your choice of web server(Apache or Nginx) and runtime(PHP or HHVM).

Make sure you follow these steps below:

- Create a `.env` file from `.env.example`.
- You need to have an account with [Auth0](https://auth0.com/signup).
- Go to your [Auth0 Dashboard](https://manage.auth0.com/#/) and click the "create a new client" button.
- Name your new app and select "Regular Web Applications".
- In the Settings for your new Auth0 client app, add `http://localhost:8000` to the Allowed Callback URLs.
- Copy out your *client id*, *client secret*, *domain* and *callback url*. Ensure you assign them to the right variables in your `.env` file.

> [Auth0 offers a generous **free tier**](https://auth0.com/pricing) to get started with modern authentication.

Now, we have a `composer.json` file which contains the list of packages that the application needs. Go ahead and run `composer install` on your local machine to install these packages. Get [composer here](https://getcomposer.org/download/) if you don't have it installed already.

Go ahead and run the app. The app should be running like so:

![Landing page](https://cdn2.auth0.com/blog/ultimateguide/landing.png)
_Landing page_

![Logged In User](https://cdn2.auth0.com/blog/ultimateguide/welcome.png)
_Logged In User_

Awesome! Our app works locally. Time to deploy! The first thing we'll do is to add a `Procfile` to the root directory of our app.

Create a new file called `Procfile` without any file extension and add this:

```bash
web: vendor/bin/heroku-php-apache2
```

>A Procfile is a text file in the root directory of your application that defines process types and explicitly declares what command should be executed to start your app on heroku.

If you are interested in using *Nginx* as the web server, then the content of your *Procfile* would be:

```bash
web: vendor/bin/heroku-php-nginx
```

Now that you have added the Procfile, go ahead and upload the project to [GitHub](https://github.com) or [Bitbucket](https://bitbucket.org/). Mine is [starwazapp](https://github.com/unicodeveloper/starwazapp).

Head over to [dashboard.heroku.com/apps](https://dashboard.heroku.com/apps) and create a new app like so:

![Create a new app](https://cdn2.auth0.com/blog/ultimateguide/create_new_app.png)
_Create a new app from the dashboard_

Give it a name like so:

![Give the app a name](https://cdn2.auth0.com/blog/ultimateguide/giveappaname.png)
_Give app a name_

Choose a deployment method. In our case, we'll use GitHub like so:

![Connect to GitHub](https://cdn2.auth0.com/blog/ultimateguide/connecttogithub.png)
_Connect to GitHub_

> The reason for choosing GitHub is to make development and maintenance process very smooth. Developers can work on new features using the git workflow.

Now, type the name of the repo in the circled area and click **Search**. Heroku will search for your repo under your GitHub account and display it like so

![Search for repo](https://cdn2.auth0.com/blog/ultimateguide/searchforrepo.png)
_Search for repo_

Click on `connect` like so

![Click on connect](https://cdn2.auth0.com/blog/ultimateguide/clickonconnect.png)
_Click on the connect button_

Heroku will connect the repo like so

![Connected repo](https://cdn2.auth0.com/blog/ultimateguide/connected.png)
_Connected Project_

Scroll down a bit. This is the interesting part. Heroku allows you to enable automatic deploys with the push of a button. It also gives you an option to wait for your continuous integration process to pass before deploying to production. In a real world app, you'll have a test suite for your codebase. A developers' code runs against the test suite. If it passes, the code will be pushed to production.

![Option to enable deploy](https://cdn2.auth0.com/blog/ultimateguide/enabling_deploy_button.png)

Click to enable automatic deploys. We don't have any CI service, so we don't need to enable that option. Now, let's deploy the master branch.

> **Note:** You can have other branches and specify which branch you want for production. In our case, the master branch is the prod. branch.

Click on the **Deploy branch**. Heroku will scan through your `composer.lock` file, install the necessary packages and deploy!

![Deploy](https://cdn2.auth0.com/blog/ultimateguide/deployprocess.png)
_Deploy finally_

Click on the **View** button to check out your app.

![Ooops](https://cdn2.auth0.com/blog/ultimateguide/herokuoops.png)
_Error 500_

Ooops! We are experiencing a 500 error. Aha, we haven't set any environment variables yet. Locally, we had a `.env` file. On heroku, there is no `.env` file, but there is a way to set environment variables. Go to **Settings** on your dashboard and add them as config variables like so:

![Add config variables](https://cdn2.auth0.com/blog/ultimateguideheroku/config_variable.png)

Oh, one more thing! The new callback url in my case is `http://starwazapp.herokuapp.com`. Make sure you add your new callback url to the *Allowed Callback URLs* in your [Auth0 dashboard](https://manage.auth0.com).

Your app should be live & working now!

![App working](https://cdn2.auth0.com/blog/ultimateguideheroku/appworking.png)
_Live App_

### Make a small change

Let's make a small change to our app and see how effortlessly it deploys it to production.

Open `index.php` and change the content of the `<p>` tag from `Heard you don't want to migrate to PHP 7? Dare us!` to `Star Wars - The Awakening!`. Commit and push to your master branch. Now, go to the **Activity** tab of your Heroku Dashboard and notice the build. Reload your app and you'll see the difference.

![Build Succeeded](https://cdn2.auth0.com/blog/ultimateguideheroku/build_succeeded.png)
_Build Succeeded_

![New version of app](https://cdn2.auth0.com/blog/ultimateguideheroku/starwarzawakening.png)
_New version_

### Database, Caching & Cron Jobs

Let's quickly talk about how to handle database, caching and cron jobs. On heroku, you can use [ClearDB](http://w2.cleardb.net/) and [Postgres](https://elements.heroku.com/addons/heroku-postgresql) with PHP. Add ClearDB to your app like so:

```bash
heroku addons:create cleardb:ignite
```

This command provisions a new ClearDB database returns the URL that the app will use to access it. All you simply need to do is add it to your app as an environment variable and parse it in your app config like so:

> ClearDB is a powerful, fault tolerant database-as-a-service in the cloud for your MySQL powered applications.

```php
<?php
$url = parse_url(getenv("CLEARDB_DATABASE_URL"));

$server = $url["host"];
$username = $url["user"];
$password = $url["pass"];
$db = substr($url["path"], 1);

$conn = new mysqli($server, $username, $password, $db);
?>
```
_using mysqli_

You can tweak that to suit PDO style. Add Postgres to your app like so:

```bash
heroku addons:create heroku-postgresql:hobby-dev
```

Head over to the [addons](https://elements.heroku.com/addons), you'll see other kinds of databases that you can use with your PHP app.

Heroku provides an array of addons for caching, from `memcache` to `fastly` to `ironcache` and others. You can check out how to use [memcache with PHP on heroku](https://devcenter.heroku.com/articles/memcachedcloud#using-memcached-from-php).

Finally, you can use the [Heroku Scheduler](https://devcenter.heroku.com/articles/scheduler) for running jobs on your app at scheduled time intervals.

## Google Cloud

The [Google Cloud platform](https://cloud.google.com) is a giant and trusted cloud platform that a lot of companies all over the world have adopted in deploying and hosting their apps. Your apps will be running on the same infrastructure that powers all of Google's products. What other form of confidence do you need to assure you that your application will scale well enough to serve your thousands and millions of users easily?

Google Cloud offers different options for hosting PHP apps. The platform offers [App Engine (Full managed)](https://cloud.google.com/appengine/), [Compute Engine (Scalabe VMs)](https://cloud.google.com/compute/) and [Container Engine (Kubernetes Clusters)](https://cloud.google.com/container-engine/).

In our case, we'll use App Engine. It abstracts the infrastucture away. Let's jump into deploying our famous **Star Wars** app to Google App Engine.

When using Google App Engine, you can choose the **Standard** or **Flexible** environment. The latter, like the name implies allows you to install any PHP extension that works on Debian Linux, has a configurable Nginx web server, writable filesystem, latest PHP versions and allows you to run deployment scripts using `composer.json`.

We'll use the flexible environment. So, go ahead and [create a new project](https://console.cloud.google.com/projectselector/appengine/create?lang=flex_php&st=true). Click on **Create**, give the project a name, select the region you'll like to serve your app and enable billing.

> **Note:** You won't be charged without your permission.

Now, download the [Google SDK](https://cloud.google.com/sdk/docs/) and install the Google Cloud tools.

![Installing Google SDK](https://cdn2.auth0.com/blog/ultimateguidegc/install.png)
_Installing Google SDK_

![Running gcloud](https://cdn2.auth0.com/blog/ultimateguidegc/cloudinit.png)
_Running gcloud_

Go ahead and create an `app.yaml` file in the root of our project like so:

_app.yaml_

```bash
runtime: php
env: flex
```

So, our `.env` file has been pushed to Google Cloud. An alternative to using that is to add the environment variables to the `app.yaml` file like so:

```yaml
...
env_variables:
  # The values here will override those in ".env". This is useful for
  # production-specific configuration. However, feel free to set these
  # values in ".env" instead if you prefer.
  APP_LOG: errorlog

```

Now, deploy your application from your console by running `gcloud app deploy`.

**Note:** Now grab the URL, in my case it is `https://starwars-166515.appspot.com/` and add to **Allowed Origins(CORS)** and **Allowed Callback URLs** in your [Auth0 dashboard](https://manage.auth0.com). Also add the URL to `AUTH0_CALLBACK_URL` in your `.env` file.

Run `gcloud app deploy` again to provision a new version of the app. Check out your app now. It should be live like so:

![Live App](https://cdn2.auth0.com/blog/ultimateguidegc/landingpage.png)
_Live App_

### Database, Caching & Cron Jobs

Google Cloud provides a Cloud SQL Instance platform. Check out how to [configure, connect and create MySQL instances for your app](https://cloud.google.com/sql/docs/mysql/create-instance).

Oh, You can also use [phpMyAdmin](https://www.phpmyadmin.net/) on [Google App Engine](https://cloud.google.com/sql/docs/mysql/phpmyadmin-on-app-engine).

Google App Engine includes implementations of the standard [Memcache](http://php.net/manual/en/book.memcache.php) and [Memcached](http://php.net/manual/en/book.memcached.php) APIs. Check out how to use [Memcache in your app on Google Cloud](https://cloud.google.com/appengine/docs/standard/php/memcache/using).

The App Engine Cron Service allows you to configure regularly scheduled tasks that operate at defined times or regular intervals. Check out how to [schedule cron jobs and use task queues with PHP on Google Cloud](https://cloud.google.com/appengine/docs/standard/php/config/cron).

It's relatively easy to deploy [Laravel](https://cloud.google.com/community/tutorials/run-laravel-on-appengine-flexible), [Symfony](https://cloud.google.com/community/tutorials/run-symfony-on-appengine-flexible) and [Wordpress](https://cloud.google.com/php/tutorials/wordpress-app-engine-flexible) apps to the Google Cloud Platform.

## IBM BlueMix

IBM Bluemix allows you to easily configure, deploy and scale on a powerful, high performance global cloud infrastructure. Let's jump into deploying our famous **Star Wars** app to IBM Bluemix.

[Sign up on Bluemix](https://console.ng.bluemix.net/registration/) like so:

![BlueMix Signup](https://cdn2.auth0.com/blog/bluemix/signup.png)
_Signup on Bluemix_

> **Note:** The Bluemix platform offers a 30-day free trial so you have a chance to try deploying your own application before handing over your credit card details.

Go ahead and create an organization and space. I named my space `prod`.

![Dashboard](https://cdn2.auth0.com/blog/ultimateguideibm/dashboard.png)

Now, go ahead and install the [Cloud Foundry CLI](https://github.com/cloudfoundry/cli#downloads). Once you have done that, go head and login from your terminal like so:

```bash
cf api https://api.ng.bluemix.net/
cf login
```

![Authenticating via the terminal](https://cdn2.auth0.com/blog/ultimateguideibm/authenticate.png)
_Log in to Bluemix_

The next step is to create a `manifest.yml` file in the root directory of the app. The `manifest.yml` includes basic information about your app, such as the name, how much memory to allocate for each instance and the route. Our manifest file should look like so:

```bash
---
applications:
  - name: starwarsapp
    memory: 512M
    instances: 1
    host: starwarsapp
```

You can also explicitly specify the buildpack in the manifest file. Thankfully, Cloud Foundry automatically detects which [buildpack](https://github.com/cloudfoundry/php-buildpac) is required when you push an app.

> Buildpacks provide framework and runtime support for your applications. Buildpacks typically examine user-provided artifacts to determine what dependencies to download and how to configure applications to communicate with bound services.

Finally, deploy your app by running the following command like so:

```bash
cf push <yourapp>
```

`<yourapp>` has to be a unique name.

![Starting Deploy](https://cdn2.auth0.com/blog/ultimateguideibm/starting_deploy.png)
_Starting Deploy_

![Ending Deploy](https://cdn2.auth0.com/blog/ultimateguideibm/ending_deploy.png)
_Ending Deploy_

Try to run the app now. In my case, the url is `starwarsapp.mybluemix.net`. Oops, a 500 error. We haven't loaded our environment variables yet. How do we do that with Bluemix.

You can either use the Cloud Foundry CLI or the Bluemix user interface to set environment variables. Let's use the Bluemix user interface. So, follow the steps below:

- Open the Bluemix [dashboard](https://console.ng.bluemix.net/dashboard/apps/).

  ![Dashboard - App running](https://cdn2.auth0.com/blog/ultimateguideibm/dashboardapprunning.png)

- Click on the app. You'll be redirected to another page with more details about the app.
- Select **Runtime** from the left panel.

  ![Click on Runtime](https://cdn2.auth0.com/blog/ultimateguideibm/select_runtime.png)

-  Now, click on **Environment variables** tab like so

  ![Select Environment Variables](https://cdn2.auth0.com/blog/ultimateguideibm/select_environmentvariable.png)

- Scroll down and click the **Add** button to add the environment variables like so

  ![Add environment variables](https://cdn2.auth0.com/blog/ultimateguideibm/add_env_variables.png)

- Click the `Save` button. Once you do that, your app will restart automatically.

**Note:** Now grab the URL, in my case it is `https://starwarsapp.mybluemix.net/` and add to **Allowed Origins(CORS)** and **Allowed Callback URLs** in your [Auth0 dashboard](https://manage.auth0.com).

Now check out your app. Your app should be live!

### Database, Caching & Cron Jobs

Cloud Foundry provides the ability to create services. IBM Bluemix offers the Cloudant NoSQL database(the Bluemix name for CouchDB). So, you can use the `cf` tool to create database services like so:

```bash
cf create-service cloudantNoSQLDB Lite starwarsapp
```

IBM Bluemix also offers the ClearDB MySQL service. So, you can use the `cf` tool to create one like so:

```bash
cf create-service cleardb spark starwarsapp
```

They offer [MongoDB](https://new-console.stage1.ng.bluemix.net/catalog/services/compose-for-mongodb/), [PostgreSQL](https://new-console.stage1.ng.bluemix.net/catalog/services/compose-for-postgresql/), [RethinkDB](https://new-console.stage1.ng.bluemix.net/catalog/services/compose-for-rethinkdb/).

You can always use the Cloud Foundry tool to check out a lot of things such as logs, environment variables like so:

- `cf logs --recent yourapp` - Shows the logs of your apps.
- `cf env yourapp` - Shows the environment variables associated with your app.
- `cf marketplace` - Shows all the services that Bluemix has to offer.

IBM Bluemix also offers [Redis Cloud](https://console.ng.bluemix.net/catalog/services/redis-cloud), a fully-managed cloud service for hosting and running your Redis dataset in BlueMix in a highly-available and scalable manner.

IBM Bluemix provides the [**Workload Scheduler**](https://console.ng.bluemix.net/catalog/services/workload-scheduler) service. This service allows you to integrate your application with the capability to schedule workflows. Far beyond Cron, exploit job scheduling within and outside Bluemix. Easily create workflows in your application to run on a regular basis, at a specific time, on event basis (for example, when a file is deleted or updated), according to your needs. You can either use the *Workload Scheduler User Interface* or use the APIs.

Get started with [Scheduling Jobs here](https://console.ng.bluemix.net/docs/services/WorkloadScheduler/index.html).

Oh, one more thing, here is how to [deploy your Laravel app on IBM Bluemix](https://www.ibm.com/blogs/bluemix/2014/06/getting-started-laravel-bluemix/).

## Microsoft Azure

Microsoft Azure is another massive cloud platform that allows you to scale your apps easily. Let's get started with deploying our Star Wars app on Azure.

With Microsoft Azure, you can deploy via:

- FTP.
- Syncing with a cloud folder.
- Local Git.
- Cloud based source control service such as GitHub or Bitbucket.

In our case, we'll set up deployment with Git.

1. First, create an [account with Microsoft Azure](https://portal.azure.com).

    ![Dashboard](https://cdn2.auth0.com/blog/ultimateguidems/dashboard.png)
    _Dashboard_
2. Click on **New** on the left panel.
3. Click **See all** just next to Marketplace.
4. Click **Web + SQL**, then go ahead and create.

    ![Web + SQL](https://cdn2.auth0.com/blog/ultimateguidems/websql.png)

5. You'll be prompted to select an offer for the type of subscription you are comfortable with. I chose *Free Trial*. With that, you'll be given a $200 Azure Credit.
6. Give your name an app, then create an SQL database. Well, it's not needed for our app but for some reasons Azure forces you to create it.

    ![Create a new app](https://cdn2.auth0.com/blog/ultimateguidems/createnewapp.png)
    _Create a new app_

7. Now that our app has been created. Click on **App Services** by the left panel to see your app.

    ![App services](https://cdn2.auth0.com/blog/ultimateguidems/appservices.png)
    _New app_

8. Click on the app, choose *Deployment options*, then click on `GitHub`.
9. Authorize GitHub to access your repo. Choose the Project. Choose the branch. In my case, I have an `azure` branch. That's the branch I'll use for deploying my code to the Azure platform.

    ![Configuration on your app](https://cdn2.auth0.com/blog/ultimateguidems/configuration.png)

10. Check out the deployment notifications.

    ![Deployment Notifications](https://cdn2.auth0.com/blog/ultimateguidems/deployment_notifications.png)

    Now, browse to `http://[yoursitename].azurewebsites.net`. In my case, it is `http://starwarzapp.azurewebsites.net`.

    Oops!, there is an HTTP 500 error. What's happening? Okay, we need to set the environment variables.

11. Go to your app in **App Services**, Click on **Application Settings** and then add the environment variables by the right.

    **Note:** Now grab the app URL, in my case it is `http://starwarzapp.azurewebsites.net/` and add to **Allowed Origins(CORS)** and **Allowed Callback URLs** in your [Auth0 dashboard](https://manage.auth0.com).

12. By default, azure deployment doesn't do anything with our `composer.json` or `composer.lock` file. So, no package is getting installed. Now go back to **App Services**, click on your app, then go to **Development Tools** and select **Extension**. Choose the `Composer` extension and agree to the legal agreements.

    ![Add extension](https://cdn2.auth0.com/blog/ultimateguidems/addextension.png)

13. Now, make a little change to your app and push again to GitHub. You should see it deploying like so:

    ![Make a change](https://cdn2.auth0.com/blog/ultimateguidems/make_a_change.png)

    ![Deployment details](https://cdn2.auth0.com/blog/ultimateguidems/deploymentdetails.png)

14. Now check out your app again. It should be [live](http://starwarzapp.azurewebsites.net) & working!

    ![Landing Page](https://cdn2.auth0.com/blog/ultimateguidems/landingpage.png)

### Database, Caching & Cron Jobs

Microsoft Azure offers *Azure Redis Cache*. It is based on the popular open source Redis cache. It's easy to create and use like so:

1. Click **New > Data + Storage > Redis Cache**.
2. Enter the name of the cache, select the region and create it.

Check out the [documentation](https://azure.microsoft.com/en-us/services/cache) on how to use it.

For scheduling and running tasks, Azure offers a [Scheduler](https://azure.microsoft.com/en-us/services/scheduler/). It allows you to:

- Call services inside or outside of Azure.
- Run jobs on any schedule.
- Use Azure Storage queues for long-running or offline jobs.
- Invoke Azure Service Bus queues.

Check out [how to create and manage jobs using the Scheduler](https://docs.microsoft.com/en-us/azure/scheduler/scheduler-get-started-portal).

We already talked a little about setting up a database earlier while we were deploying our app, but let's quickly look at how to setup a MySQL database.

1. Log into the Azure Portal.
2. Click **New** on the left panel of the dashboard. Choose **Data + Storage** in the Marketplace, then select MySQL database.
3. Go ahead and configure your new MySQL database. Enter a name, choose your subscription, location and fill the required fields. Create!
4. Connect to the database.

    ![The connection info](https://docs.microsoft.com/en-us/azure/media/store-php-create-mysql-database/create-db-5-finished-db-blade.png)

Laravel developers can easily [configure a MySQL database for their apps on Azure](https://docs.microsoft.com/en-us/azure/store-php-create-mysql-database).

## Amazon Web Services

More companies use AWS(Amazon Web Services) for storing all sorts of data ranging from images, mp3 files to videos than any other cloud platform. In fact, a lot of organizations like Uber, Spotify, Salesforce use Amazon Web Services wholy for hosting, deployment and infrastructure. AWS has a ton of developer products.

The service we'll use for deploying our famous StarWars app is **Amazon Elastic Beanstalk**. Let's get started.

- Sign up for an [AWS account](https://aws.amazon.com/account/) if you don't have one.
- Head over to [Elastic Beanstalk console](https://us-west-2.console.aws.amazon.com/elasticbeanstalk).
- Create a new app.
    ![Create new app](https://cdn2.auth0.com/blog/ultimateguideaws/createnewapp.png)
- Click on `create web server`.
    ![Create web server](https://cdn2.auth0.com/blog/ultimateguideaws/createwebserver.png)
- Create the webserver environment.
    ![Environment type](https://cdn2.auth0.com/blog/ultimateguideaws/environmentype.png)
- Upload your code. Elastic Beanstalk requires that you upload a zip file of your codebase. You can manually zip it up. But I prefer to do that from my terminal like so:

    ```bash
     zip ../starwarsapp.zip -r * .[^.]*
    ```
- Now, upload it to AWS like so:
    ![Upload code to AWS](https://cdn2.auth0.com/blog/ultimateguideaws/uploadcode.png)
- Check availability for the app URL. Mine looks like this:
    ![URL](https://cdn2.auth0.com/blog/ultimateguideaws/url.png)
- The next page allows us to configure Database Instance. Now our app doesn't require one, so we can skip it.
    ![Skip setting up DB Instance](https://cdn2.auth0.com/blog/ultimateguideaws/skip.png)
- This step allows to modify our configuration details. The default one is okay for our app.
    ![Configuration details](https://cdn2.auth0.com/blog/ultimateguideaws/config.png)
- Now, add your environment variables like so:
    ![Environment Variables](https://cdn2.auth0.com/blog/ultimateguideaws/environment_vars.png)

  **Note:** Now grab the URL, in my case it is `http://starwarzapp.us-west-2.elasticbeanstalk.com` and add to **Allowed Origins(CORS)** and **Allowed Callback URLs** in your [Auth0 dashboard](https://manage.auth0.com). Ensure that you add it as an environment variable in Elastic Beanstalk too.

- Add Permission like so:
    ![Permission](https://cdn2.auth0.com/blog/ultimateguideaws/permission.png)
- Review the information before launching.
    ![Review](https://cdn2.auth0.com/blog/ultimateguideaws/review.png)
- Launch.

![Deployed](https://cdn2.auth0.com/blog/ultimateguideaws/deployed.png)

![Live app](https://cdn2.auth0.com/blog/ultimateguideaws/landingpage.png)
_Live app_

Check out how to deploy:

- [A Laravel app to Elastic Beanstalk](http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/php-laravel-tutorial.html).
- [A CakePHP app to Elastic Beanstalk](http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/php-cakephp-tutorial.html).
- [A Symfony2 app to Elastic Beanstalk](http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_PHP_symfony2.html).
- [A Wordpress website to Elastic Beanstalk](http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/php-hawordpress-tutorial.html).
- [A Drupal website to Elastic Beanstalk](http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/php-hadrupal-tutorial.html).

### Database, Caching and Cron Jobs

You can use an Amazon Relational Database Service (Amazon RDS) DB instance to store data gathered and modified by your application. The database can be attached to your environment and managed by Elastic Beanstalk, or created and managed externally. Check out how to [easily add a DB instance to your app](http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_PHP.rds.html).

For caching, Amazon Web Services offers [ElastiCache](https://aws.amazon.com/elasticache). It is a web service that makes it easy to deploy, operate, and scale an in-memory data store or cache in the cloud. Amazon ElastiCache supports two open-source in-memory engines:

- [Redis](https://aws.amazon.com/elasticache/redis).
- Memcached.

Amazon ElastiCache automatically detects and replaces failed nodes, reducing the overhead associated with self-managed infrastructures and provides a resilient system that mitigates the risk of overloaded databases, which slow website and application load times. Through integration with [Amazon CloudWatch](https://aws.amazon.com/cloudwatch), Amazon ElastiCache provides enhanced visibility into key performance metrics associated with your Redis or Memcached nodes.

Companies like [AirBnb](https://www.airbnb.com), [Healthguru](http://www.healthguru.com), [PlaceIQ](http://www.placeiq.com) and [Tokyo Data Network](http://www.tdn.co.jp) use ElastiCache for caching at multiple layers spanning HTML fragments, results of expensive DB queries, ephemeral session data and search results.

> Check out [how to install the ElastiCache Cluster Client for PHP here](http://docs.aws.amazon.com/AmazonElastiCache/latest/UserGuide/Appendix.PHPAutoDiscoverySetup.html).

Here is an [excellent post on building a PHP visitor counter with ElastiCache and Elastic Beanstalk](https://linuxacademy.com/howtoguides/posts/show/topic/13716-php-visitor-counter-with-elasticache-and-elastic-beanstalk)

You can set up a cron job on Elastic Beanstalk. Learn how to run cron jobs on [Amazon Web Services(AWS) Elastic Beanstalk](https://medium.com/@joelennon/running-cron-jobs-on-amazon-web-services-aws-elastic-beanstalk-a41d91d1c571).

## Laravel Forge

[Laravel Forge](https://forge.laravel.com) , created by [Taylor Otwell](https://twitter.com/taylorotwell) is a platform that helps you deploy and launch your application in minutes. It does the heavy-lifting for you. Forge takes care of provisioning your servers on popular cloud hosting providers such as Linode, Digital Ocean and AWS. It was initially built for Laravel apps, but now it has support for virtually any PHP application.

![Laravel Forge](https://cdn2.auth0.com/blog/ultimateguideaws/laravelforge.png)
_Laravel Forge_

Laravel Forge allows you to easily do the following apart from provisioning servers:

- It integrates with LetsEncrypt to generate Free SSL Certificates for your apps.
- Easily manage jobs and queues.
- Collaboration with your team by sharing your server's management dashboard with co-workers.

Matt Stauffer has an [amazing post on deploying your first Laravel app to Forge](https://mattstauffer.co/blog/getting-your-first-site-up-and-running-in-laravel-forge).

James Fairhurst also has a [great guide on using Laravel Forge to setup an AWS Server](https://medium.com/@james_fairhurst/using-laravel-forge-to-setup-an-aws-server-7da83f760a56).

Finally, the most popular educational PHP platform, [laracasts.com](https://laracasts.com) has a [series on server management with Forge](https://laracasts.com/series/server-management-with-forge)

## Envoyer

[Envoyer](https://envoyer.io) is a platform that allows zero downtime PHP deployment. It allows you integrate with various services such as Gitlab, Slack, Bitbucket e.t.c.

With Envoyer, you can perform:

- Seamless Deployment rollbacks.
- Deploy to multiple servers.
- Monitor Cron Jobs.
- Perform Application Health Checks.

## Deployer

[Deployer](https://deployer.org) is a deployment tool for PHP. It allows you to do the following:

- Run tasks in parallel.
- Atomic deploys.
- Rollbacks.
- Create deployment scripts in form of recipes.

It works with *Laravel*, *Symfony*, *CakePHP*, *Yiiframework*, *Zend*, *FuelPHP*, *Drupal*, *Wordpress*, and *Magento*. Check out this [excellent article on deploying PHP applications with Deployer](https://www.sitepoint.com/deploying-php-applications-with-deployer).

## Conclusion

There is no way we can cover all the different options available for deploying PHP applications. PHP is an enterprise language that has evolved over the years, thus calling for more efficient ways for deploying PHP apps from a local machine to production. Hopefully, this guide covers all your basic needs for deploying your PHP apps to all the major cloud providers. However, there is another resource I recommend for extensive knowledge in [learning to deploy PHP applications](http://www.deployingphpapplications.com).

> Auth0 provides the simplest and easiest to use [user interface tools to help administrators manage user identities](https://auth0.com/user-management) including password resets, creating and provisioning, blocking and deleting users.

How have you been handling your deployments? Please, let me know in the comments section below!
