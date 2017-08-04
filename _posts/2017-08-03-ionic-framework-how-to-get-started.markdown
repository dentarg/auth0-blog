---
layout: post
title: "Ionic Framework: Getting Started"
description: "Learn how to use Ionic to build cross platform apps and add authentication the right way"
date: 2017-08-02 08:30
category: Technical Guide, Mobile, Ionic
design:
  bg_color: "#044A75"
  image: https://cdn.auth0.com/blog/drupal01/logo.png
author:
  name: Prosper Otemuyiwa
  url: http://twitter.com/unicodeveloper?lang=en
  mail: prosper.otemuyiwa@auth0.com
  avatar: https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200
tags:
- ionic
- auth0
- ionic-framework
- hybrid
related:
- 2017-05-08-the-ultimate-guide-to-deploying-php-applications
- creating-your-first-laravel-app-and-adding-authentication
- 2017-06-01-creating-your-first-cakephp-app
---

---

**TL;DR:** Ionic is an open source mobile framework that allows web developers use their skills to build cross platform mobile apps. It leverages [Cordova](https://cordova.apache.org) to allow you build mobile apps with JavaScript. In this article, we'll go through how to create mobile apps using the Ionic Framework and how to add authentication to it using Auth0.

---

[The Ionic Framework](https://ionicframework.com/) has built a vibrant community around it. **Ionic** has consistently delivered on its promise to create hybrid and progressive apps with ease. At the time of this writing, Ionic framework is the top open source framework for building hybrid mobile apps. With one codebase, you can have three apps running on Android, iOS and Windows.

The team behind the Ionic framework have released several products over time to simplify the process of building, deploying and testing Ionic apps. These products include:

* **Ionic Creator**: This is a drag and drop tool for rapidly prototyping your idea. It makes building your mobile apps dead-simple. With Ionic creator, you can drag and drop Ionic components, add your own code, use one-click addons for services like Google Maps and Analytics, preview, share across your team and export.
* **Ionic Enterprise**: This provides full support for your development team. Every Ionic enterprise subscription comes with a dedicated Account manager. You'll also have access to Ionic's full suite of products and services.
* **[Ionic View](http://view.ionic.io)**: This product allows you share your apps easily with the world. With Ionic View, you can share your Ionic apps with your organization and testers around the world without complications around provisioning.

## Let's Get Started

Without much ado, let's get started with building our first mobile app with the Ionic framework.

First, ensure you have [Node.js](http://nodejs.org) installed. Then go ahead and install `cordova` and `ionic` like so:

```bash
npm install -g cordova ionic
```



**Note:** Ensure you have a fully functional local PHP server.

## Installation

Navigate to the extracted Drupal folder and run the app:

```bash
php -S localhost:8000
```

Right now, the website should open in your browser and take you to the installation page:

![Drupal First Page](https://cdn.auth0.com/blog/drupal/installation.png)

Select the Standard Profile

![Standard Profile](https://cdn.auth0.com/blog/drupal/standard.png)

Verify Requirements

![Verify Requirements](https://cdn.auth0.com/blog/drupal/requirements.png)

Now, on to the database section. Ensure you have [MySQL](https://www.mysql.com/) or [MariaDB](https://mariadb.org) installed. Enter the right database credentials.

![Database](https://cdn.auth0.com/blog/drupal/database.png)

Proceed with Installation

![Installing Drupal](https://cdn.auth0.com/blog/drupal/installation.png)

Now, go ahead and configure your site:

![Configure your site](https://cdn.auth0.com/blog/drupal/configuration.png)

Once you are done configuring, save and continue. You will be redirected to the dashboard.

## Add Pages

Let's add a few pages to our new Drupal website. Click on `add content` in the Tools section by your left. You will be redirected to a new page. Click on `Basic Page`, then add the title and body.

Click on the `URL PATH SETTINGS` on the right and give the new page a URL alias, `/about`. Then hit the `Save and Publish` button.

![Add Page](https://cdn.auth0.com/blog/drupal/addpage.png)

You can create several pages on your website using this simple process. Next, let's focus on authentication.

## Authentication

Fortunately, Drupal comes with a basic user authentication system. The moment we configured our site, it registered the site maintenance account details and created the first user with those credentials. Log out and try to log in again.

![Login](https://cdn.auth0.com/blog/drupal/defaultLogin.png)

A new user can easily create an account too:

![Create new account](https://cdn.auth0.com/blog/drupal/create_new_account.png)

This is good. However, it is limited. If you want other forms of authentication such as Social Logins and Single Sign On functionalities, then you need to look for alternatives. Thankfully, Auth0 takes care of all your authentication needs.

## Authentication With Auth0

[Auth0](https://auth0.com) is a cloud-based service that makes authentication a breeze. It allows us to issue [JSON Web Tokens(JWTs)](https://jwt.io). [Auth0 offers a generous **free tier**](https://auth0.com/pricing) so you can get started with modern authentication right away.

There is a community maintained [Auth0 Drupal Plugin](https://github.com/auth0/auth0-drupal) that provides Single Sign On, Social Login, SAML and AD/LDAP Integration and [User Management](https://auth0.com/user-management).

* Download the [auth0-drupal zip file](https://github.com/auth0/auth0-drupal/archive/master.zip)
* Head over to `http://localhost:8000/admin/modules/install`
* Select the `auth0-drupal` zipped file from your local computer and click install.

    ![Install auth0 drupal plugin](https://cdn.auth0.com/blog/drupal/install_drupal_plugin.png)

* After installing successfully, head over to the modules section, `http://localhost:8000/admin/modules`, check the `Auth0` module and click the install button to activate the **Auth0** module.

    ![Activate the Auth0 module](https://cdn.auth0.com/blog/drupal/activatemodule.png)

* Go to `https://manage.auth0.com`, click on the `new client` button, select web application as the type of app and create the client. In the `Settings` tab, add `http://localhost:8000/auth0/callback` to the **Allowed Callback URLs** section. Add `http://localhost:8000` to **Allowed Origins(CORS)**

* Head over to `http://localhost:8000/admin/config/auth0`. Here, we'll add our Auth0 credentials. Copy the `Client ID`, `Domain`, and `Client Secret` from your Auth0 dashboard and paste it here. Also select `HS256` as the JWT Algorithm like so:

    ![Auth0 Config](https://cdn.auth0.com/blog/drupal/auth0config.png)

**Note:** HS256 is the default algorithm. Check out this [excellent article](https://auth0.com/blog/navigating-rs256-and-jwks/) to see why RS256 is recommended. Again, you can still use HS256 like I used here.

* Select the `Advanced` section of `http://localhost:8000/admin/config/auth0`. Check the box for `Redirect login for SSO` and save. We are doing that to ensure the system uses the Auth0 hosted lock page.

    ![Advanced Config](https://cdn.auth0.com/blog/drupal/advancedconfig.png)


### Install Dependencies

It is very important to take note of this step. Open the source code of your app in a text editor or IDE. Open the `composer.json` file and add this to the `require` section:

```bash
"auth0/auth0-php": "^5.0",
"ircmaxell/random-lib": "^1.2"
````

So the `require` section of your `composer.json` file should look like this:

```bash
"composer/installers": "^1.0.24",
"wikimedia/composer-merge-plugin": "~1.4",
"auth0/auth0-php": "^5.0",
"ircmaxell/random-lib": "^1.2"
```

Now, run `composer update` in your terminal to install all the dependencies. Look at the terminal and ensure the `auth0-php` library was installed.

Go ahead and run your app again. Click on login. You will be redirected to Auth0 Hosted Lock page and shown the sign in widget.

![Auth0 Login](https://cdn.auth0.com/blog/drupal/auth0login.png)
_Log In_


![LoggedIn State](https://cdn.auth0.com/blog/drupal/loggedinstate.png)
_Authenticated State_

Oh, snap! That's all? Is it that simple? Yes it is! You can check out the [source code](https://github.com/auth0-blog/drupal-auth0-app) for reference.

## Conclusion

Well done! You have just built your first site with Drupal. As we saw in this tutorial, you can easily add authentication to your Drupal sites/apps. This tutorial is designed to help you get started on building your own web sites and applications with Drupal. You can leverage the knowledge gained here to build bigger and better web sites.

In addition, Auth0 can help secure your [B2C](https://auth0.com/b2c-customer-identity-management), [B2B](https://auth0.com/b2b-enterprise-identity-management) and [B2E](https://auth0.com/b2e-identity-management-for-employees) organization with more than just username-password authentication. It provides features like [multifactor auth](https://auth0.com/multifactor-authentication), [anomaly detection](https://auth0.com/docs/anomaly-detection), [enterprise federation](https://auth0.com/docs/identityproviders), [Single Sign On (SSO)](https://auth0.com/docs/sso), and more. [Sign up](javascript:signup\(\)) today so you can focus on what really matters: growing your business.
