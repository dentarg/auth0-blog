---
layout: post
title: "How to Migrate Your Gigya Users to Auth0"
description: "Learn how to migrate your users from Gigya's IAM platform to Auth0."
date: 2017-10-03 8:30
category: Technical Guide, Migration
banner:
  text: "Auth0 makes it easy to add authentication to your application."
author:
  name: "Kim Maida"
  url: "https://twitter.com/kimmaida"
  mail: "kim.maida@auth0.com"
  avatar: "https://en.gravatar.com/userimage/20807150/4c9e5bd34750ec1dcedd71cb40b4a9ba.png"
design:
  image: https://cdn.auth0.com/blog/gigya/logo02.png
  bg_color: "#204498"
tags:
- migration
- gigya
- sap
- iam
- identity
- authentication
related:
- 2017-10-02-sap-to-acquire-gigya-whats-next-for-identity-management
- 2017-03-06-how-to-migrate-your-existing-stormpath-users-to-auth0
---

## Gigya to be Acquired by SAP 

[SAP](https://www.sap.com/index.html) announced an agreement to acquire [Gigya](http://www.gigya.com/)'s Customer Identity and Access Management (IAM) platform on September 24, 2017. The acquisition announcement should be very interesting to current Gigya customers. To learn about key features to reassess when your IAM platform is acquired, please check out [SAP to Acquire Gigya: What's Next for Identity Management?](https://auth0.com/blog/sap-to-acquire-gigya-whats-next-for-identity-management)

## How to Migrate to Auth0 IAM Platform

At [Auth0](https://auth0.com), our goal is to provide the best authentication and identity management solution that is also simple and easy for developers to work with. This means that migration into (and out of) the Auth0 platform is straightforward for developers while also providing a seamless experience for users.

Auth0 supports [bulk user import](https://auth0.com/docs/tutorials/bulk-importing-users-into-auth0) as well as a [user import/export extension](https://auth0.com/docs/extensions/user-import-export) to migrate existing users from another service into Auth0. Auth0 is also offering the [database migration feature](https://auth0.com/docs/connections/database/migrating) **free** to all Gigya customers.

{% include tweet_quote.html quote_text="Auth0 provides several easy-to-use features for migrating users into and out of the platform." %}

Let's explore how these features work.

## Set Up an Auth0 Client

You can **<a href="javascript:signup()">sign up for a free Auth0 account</a>**. Once you have your account, you will need a [Client](https://auth0.com/docs/clients) and a [Database Connection](https://auth0.com/docs/connections/database).

An Auth0 **Client** represents your application and allows use of Auth0 for user authentication. You can create a new Client by signing into your [Auth0 Dashboard](https://manage.auth0.com/#/)  and clicking on the **+ NEW CLIENT** button.

Doing so will present a screen like the one pictured below:

![Auth0 new client form](https://cdn.auth0.com/blog/gigya/new-client.jpg)

Enter a **Name** for your Client and [select the type of technology](https://auth0.com/docs/clients#client-types), then click the **Create** button.

At this stage, there are two options to move your Gigya database contents into Auth0. You can **export** your Gigya users and then **import** them into your new Auth0 database, _or_ you can **enable automatic migration**.

> **Important Note:** The automatic migration option requires that the Gigya account subscription remains active until _all_ users have signed in, since migration occurs at login. If the Gigya service or APIs will be heavily changed or sunsetted before you think your users will have a chance to log in on their own, you should use the <a href="#user-import" target="_self">Import Gigya Users to Auth0</a> option instead.

## <span id="user-import"></span>Import Gigya Users to Auth0

If you'd like to import your existing Gigya IAM users to Auth0, the next step is to create a database. You can click the **Connections > Database** item in the sidebar of the Dashboard, or visit [the Database section of the Dashboard directly via this link](https://manage.auth0.com/#/connections/database). Click the **+ CREATE DB CONNECTION** button to create a new database in Auth0.

You will then be presented with the following screen:

![New Auth0 database connection](https://cdn.auth0.com/blog/gigya/new-db.jpg)

Fill in your desired database **Name** and other desired settings, then click the **Create** button.

### Connect Database to Client

Now you'll need to connect your database with your Client. In the **Clients** tab of your database settings, find the Client you created under the **Clients Using This Connection** heading and toggle it to the "on" position. Your Client and database are now connected.

### Export Gigya Users

The user export must be done from your Gigya account. Each Gigya customer has different needs, so the user data that will be exported may adhere to different schema. Auth0 expects a specific user schema. You can [view Auth0's user schema in detail here](https://auth0.com/docs/tutorials/bulk-importing-users-into-auth0#file-schema).

[Gigya's IdentitySync](https://developers.gigya.com/display/GD/IdentitySync) provides a method of transforming and exporting user data to match a target schema. The steps to do so are detailed here: **[Gigya IdentitySync: Using IdentitySync](https://developers.gigya.com/display/GD/IdentitySync#IdentitySync-apiUsingIdentitySync)**.

You should follow the instructions in the IdentitySync documentation to transform your Gigya database's user data to [Auth0's schema](https://auth0.com/docs/tutorials/bulk-importing-users-into-auth0#file-schema). For an example of a dataflow, check out [Export from Gigya to SFTP](https://developers.gigya.com/display/GD/Export+from+Gigya+to+SFTP). You can export your transformed data to one of the supported file formats. In this case, JSON is desired.

### Import Users to Auth0 with User Import/Export Extension

You can now import users one of two different ways. First we'll cover using an Auth0 Extension. Click on the **Extensions** link in the Dashboard sidebar, or [visit the Extensions section directly here](https://manage.auth0.com/#/extensions). In the provided list, find the **User Import / Export** extension and install it.

Once the extension is installed, you can click it to open an import/export interface that looks like this:

![Auth0 user import/export extension](https://cdn.auth0.com/blog/gigya/import-users-ext.jpg)

You can now drag your exported Gigya users JSON file into the designated upload area and select the database you created earlier. Click the **Start Importing Users** button and your import will be underway.

### Import Users to Auth0 with Management API

As an alternative option to using the User Import/Export extension, you can follow the instructions in the **[Bulk Import Users to Auth0 documentation](https://auth0.com/docs/tutorials/bulk-importing-users-into-auth0)** to leverage the [Auth0 Management API](https://auth0.com/docs/api/management/v2) to create a **[job to add your users to your database](https://auth0.com/docs/api/management/v2#!/Jobs/post_users_imports)**. Simply upload your exported users JSON file and fill in the provided form to generate a curl command to import users:

![Auth0 management API import users create job](https://cdn.auth0.com/blog/gigya/import-users-api.jpg)

## Set Up Automatic Migration From Gigya to Auth0

Auth0's database migration feature will be enabled for no extra charge for Gigya customers who want to migrate their users to Auth0. This migration process is gradual and unobtrusive to users, but does require _time_. When a user logs in, their data is updated and added to Auth0's database. Because there is no bulk migration or forced password reset in this approach, if the movement of users to Auth0 is time-sensitive, you will likely want to use one of the import strategies detailed above instead.

The automatic database migration flow is as follows:

![Auth0 automatic database migration](https://cdn2.auth0.com/docs/media/articles/connections/database/migrating-diagram.png)

You can learn more about this process here: [Migrate A User Database to Auth0](https://auth0.com/learn/migrate-user-database-auth0/).

**This approach requires that the customer's Gigya account and APIs remain active until the migration is complete.** If you're interested in taking this approach, you can set up a Custom Database in Auth0 and enable automatic migration by following the instructions here: **[Auth0: Enable Automatic Migration](https://auth0.com/docs/connections/database/migrating#enable-automatic-migration)**.

## Conclusion

Migrating users into and out of [Auth0](https://auth0.com)'s Identity and Access Management platform is simple! Auth0 provides a powerful and easy-to-use IAM solution for admins, developers, and end users. The Auth0 platform supplies [robust extensibility](https://auth0.com/docs/topics/extensibility) and friendly [user interface tools to help administrators manage user identities](https://auth0.com/user-management), including password resets, provisioning, blocking, and deleting users. Migration of users to and from Auth0 is easy, as is [social IdP](https://auth0.com/learn/social-login/) implementation, [enterprise federation](https://auth0.com/b2b-enterprise-identity-management), [Single Sign-On](https://auth0.com/learn/how-to-implement-single-sign-on/), and security features such as [Multifactor Authentication](https://auth0.com/learn/multifactor-authentication/), and [Breached Password Detection](https://auth0.com/breached-passwords).

{% include tweet_quote.html quote_text="Migrating users into and out of Auth0's Identity and Access Management platform is simple!" %}

If you'd like to explore what Auth0 has to offer, simply **<a href="javascript:signup()">sign up for a free account</a>** and try it out! You can also check out our [Pricing](https://auth0.com/pricing) and read what [customers have to say about Auth0](https://auth0.com/resources/case-studies).
