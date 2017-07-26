---
layout: post
title: "Signing into Microsoft Office 365 with Google Apps"
description: "Let's check how to sign into Microsoft products, like Office 365, with Google Apps users."
date: 2017-07-26 09:18
category: Technical Guide, Identity, Single Sign On
author:
  name: "Bruno Krebs"
  url: "https://twitter.com/brunoskrebs"
  mail: "bruno.krebs@auth0.com"
  avatar: "https://www.gravatar.com/avatar/76ea40cbf67675babe924eecf167b9b8?s=60"
design:
  image: https://cdn.auth0.com/blog/office365-googleapps/logo.png
  bg_color: "#295399"
tags:
- google apps
- microsoft
- identity
- sso
related:
- 2017-05-26-go-beyond-username-password-with-modern-auth
- 2016-10-17-sso-login-key-benefits-and-implementation
- 2017-07-21-the-role-of-identity-in-application-modernization
---

**TL;DR;** In this blog post, we are going to learn how to allow Google Apps users to sign into Microsoft products, like Office 365, without needing an extra pair of credentials. The scenario described here can help many companies to achieve single sign-on between the most popular office suites available, enhancing employee productivity while keeping authentication and authorization centralized in one of the providers.

## Google Apps (G Suite) Overview

[G Suite](https://gsuite.google.com/), formerly known as Google Apps, is a set of cloud-based tools that help employees of organizations to work together online. Among the available tools, one will find an [spreadsheet editor (like Microsoft Excel)](https://gsuite.google.com/products/sheets/), a [graphical word processing program](https://gsuite.google.com/products/docs/), a [tool to create beautiful presentations](https://gsuite.google.com/products/slides/), a [huge email inbox](https://gsuite.google.com/products/gmail/), and [much more](https://gsuite.google.com/).

## Microsoft Office 365 Overview

Office 365 is a subscription service provided by Microsoft that comes along with popular tools like [Word](https://products.office.com/en/word), [Excel](https://products.office.com/en/excel), and [PowerPoint](https://products.office.com/en/powerpoint). Microsoft offers Office 365 plans for personal use and for businesses of all sizes.

## SSO on Office 365 with Google Apps: Scenario Overview

Let's imagine that we work for a company that has standardized everything on Google Apps. All identity, email inboxes, documents, etc, are shared and persisted on Google infrastructure. But, all of a sudden, a specific department of the company figured out that they would achieve better performance by using [Microsoft Dynamics 365](https://www.microsoft.com/en-us/dynamics365/home).

Out of the box, it's not possible for the employees of this department to use their existing Google Apps users to access the Microsoft tool. A possible solution, for this case, would be to create a second user for every single employee, now on [Microsoft Azure Active Directory (AD)](https://support.office.com/en-us/article/Understanding-Office-365-identity-and-Azure-Active-Directory-06a189e7-5ec6-4af2-94bf-a22ea225a7a9). Azure AD is the authentication service that companies have to use to manage users that can access Microsoft tools.

This might be a feasible solution for a couple of users, or when the company does not have security policies and programs well defined. However, for companies that care about securing sensitive data and streamlining security measures, this is a no-go. The security department would have much more trouble managing users between the two identity providers: Google Apps and Microsoft Azure AD.

So how would we handle this issue?

## SSO on Office 365 with Google Apps: Scenario Solution

Auth0 provides an enterprise-grade identity platform that secures billions of logins every year. Auth0 makes it easy to implement even the most complex identity solutions, just like the scenario described above. With Auth0, we can integrate the identity solution provided by Google Apps with Microsoft Azure AD. We achieve that by writing an [Auth0 Rule](https://auth0.com/docs/rules) that automates user provisioning on Microsoft Azure AD.

First, we configure Auth0 to handle single sign-on with Google Apps users, and then we configure Microsoft to use Auth0 as the identity provider. This way, whenever a user tries to access a Microsoft product, they are redirected to [Auth0 login page](https://auth0.com/docs/hosted-pages/login) (where a *Login With Google* button will be available) and then the user gets auto-provisioned on Azure AD.

The rest of this blog post shows exactly how to achieve this integration.

## Enabling SSO

First, it's expected that we already have two subscriptions: [Google Apps](https://gsuite.google.com/pricing.html) and [Office 365 for Businesses](https://products.office.com/en-us/business/office). As we are going to use Google Apps as our identity provider, it's also expected that this solution is properly configured and some users registered.

To use Auth0 as the identity management integration tool, we are going to [sign up](javascript:signup\(\)) for a *free* account. For now, we won't make any configuration on our account, but let's keep the dashboard open as we will need to make changes to it soon.

### Create Google Apps Project

To properly enable single sign-on with Google on Auth0, we are going to need a Google Apps project. More specifically, we are going to need a *Google Client ID* and a *Client Secret*.

1. While logged into our Google account, let's access the [API Manager](https://console.developers.google.com/projectselector/apis/credentials).
2. Then we are going to create a new app by navigating to *Credentials* using the left-hand menu:
![API Manager Credentials](https://cdn2.auth0.com/docs/media/articles/connections/social/google/credentials.png)
3. While on the *Credentials* page, let's click on *Create a project*.
4. In the dialog box that appears, let's provide a *Project name*, answer Google's email and privacy-related questions, and then click *Create*:
![Create New Project](https://cdn2.auth0.com/docs/media/articles/connections/social/google/create-new-project.png)
5. Google will take a moment to create our project. When the process completes, Google will prompt us to create the credentials we need.
![Create Google Credentials](https://cdn2.auth0.com/docs/media/articles/connections/social/google/create-credentials.png)
6. Let's click on *Create Credentials* to display a pop-up menu listing the types of credentials we can create. Let's select the *OAuth client ID* option.
7. At this point, Google will display a warning banner that says, "To create an OAuth client ID, you must first set a product name on the consent screen.". Let's click *Configure consent screen* to begin this process.
![Configure Consent Screen](https://cdn2.auth0.com/docs/media/articles/connections/social/google/create-client-id.png)
8. Then we need to provide a *Product Name* that will be shown to users when they log in through Google.
![OAuth Consent Screen](https://cdn2.auth0.com/docs/media/articles/connections/social/google/oauth-consent-screen.png)
9. Let's save it.
10. At this point, we will be prompted to provide additional information about our newly created app.
![Web App Credentials Configuration](https://cdn2.auth0.com/docs/media/articles/connections/social/google/create-client-id-config.png)
11. Let's select Web application and provide a name for our app.
12. Under *Restrictions*, enter the following information (note that we have to replace **YOUR-AUTH0-DOMAIN** with our own Auth0 domain):
    1. Authorized JavaScript origins: https://YOUR-AUTH0-DOMAIN (e.g. `http://mydomain.auth0.com`)
    2. Authorized redirect URI: https://YOUR-AUTH0-DOMAIN/login/callback
13. Let's click Create. Our *Client ID* and *Client Secret* will be displayed.
![OAuth Client ID and Secret](https://cdn2.auth0.com/docs/media/articles/connections/social/google/oauth-client-info.png)
14. Let's copy the *Client ID* and *Client Secret* to enter in the *Connection settings* in Auth0.

### Configure Sign In with Google on Auth0

As we have our Google Apps project properly created and we have both *Client ID* and the *Client Secret*, we will now configure Sign In with Google on Auth0. The steps to achieve that are:

1. Log into the [Auth0 Dashboard](https://manage.auth0.com/) and select [Connections > Social](https://manage.auth0.com/#/connections/social).
2. Select the connection with the Google logo to access this connection's *Settings* page:
![Sign In with Google on Auth0](https://cdn2.auth0.com/docs/media/articles/connections/social/google/goog-settings.png)
3. Switch over to the *Settings* tab. Insert the *Client ID* and *Client Secret* copied from the Google API Manager.

### Create Azure AD Application

The next step to enable the Google Apps users to sign into Microsoft products is to create an application on our Microsoft account. Let's follow the steps below to achieve that:

1. Log into the [Azure Portal](https://portal.azure.com).
2. Choose [*Azure Active Directory* in the left navigation](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview).
3. Select *App registrations* in the new menu.
4. Click on *New application registration*.
5. Fill the form:
    1. Input a name for the application (e.g. *Auth0 Provisioning*)
    2. Select *Web app / API* as the *Application type*.
    3. Insert a sign-on URL. Any valid url as this won't be really used.
5. The recently created app will appear in the *App registrations* list. Select it.
6. In the *Settings* blade (Microsoft call these sections as blade), choose *Keys*.
7. Input a *Description* (like *auth0 provision*) and choose a *Duration* for the new key.
8. Click on save the key and copy the *Client Key*. This key will be shown only once and it's needed for the Auth0 rule.
![Creating a key on Azure AD apps registration](https://cdn.auth0.com/blog/googleapps-office365/azure-ad-app.png)
9. Choose *Required permissions* and click *Add* in the new blade.
10. Select the *Microsoft Graph* API and then check *Read and write directory data* under *Application Permissions*.
11. Back in the *Required permissions*, click on the *Grant Permissions* button and then click *Yes* to grant the requested permissions.

### Add an Office 365 Single Sign-On Integration on Auth0

To enable an *Office 365* single sign-on integration on Auth0, we first need to register our main domain in the *Admin center* of *Office 365*. To do that, follow these steps:

1. Log into the [*Admin center*](https://portal.office.com/adminportal/).
2. Head to [*Settings > Domains*](https://portal.office.com/adminportal/home#/Domains).
3. Click on *Add domain*.
4. Enter the domain of the company.
5. Follow the instructions to verify the domain on Office 365.

After verifying the domain, we can configure the *Office 365* single sign-on integration in Auth0's dashboard:

1. Log into the [Auth0 Dashboard](https://manage.auth0.com/).
2. Click on *SSO Integrations* in the left menu.
3. Click on *Create SSO Integration*.
4. Choose *Office 365* and then click the *Create* button.
5. Execute the *Configuration Instructions* shown in the screen that appears.
6. Choose the *Settings* tab in the *SSO Integration* created.
7. Enter the subdomain that Microsoft generated (e.g. `mycompanyurl.onmicrosoft.com`) while subscribing to their products.
8. Save the changes.

### Integrate Google Apps and Microsoft AAD with a Auth0 Rule

The last task to complete the integration between Google Apps and Microsoft Azure AD is to create an Auth0 Rule. To do that, let's execute the following steps:

1. Go to the [*Advanced* tab of the *Auth0 Dashboard*](https://manage.auth0.com/#/account/advanced).
2. Add `https://login.microsoftonline.com/login.srf` as an *Allowed Logout URL* to properly handle logouts.
3. Select [Rules](https://manage.auth0.com/#/rules) in the left navigation.
4. Click *Create Rule*.
5. Choose the *empty rule* template.
6. Enter a name for the new rule, something like *Microsoft AD provisioning*.
7. Paste the following JavaScript code:

> Read the comments in the source code to understand how this rule works.

```js
function (user, context, callback) {
  // Require the Node.js packages that we are going to use.
  // Check this website for a complete list of the packages available:
  // https://tehsis.github.io/webtaskio-canirequire/
  var rp = require('request-promise');
  var uuidv4 = require('uuid');

  // The main domain of our company.
  var AAD_CUSTOM_DOMAIN = 'mycompanyurl.com';
  // The subdomain of the company on Microsoft.
  var AAD_TENANT_NAME = 'mycompanyurl.onmicrosoft.com';
  // The client ID generated while creating the Azure AD app.
  var AAD_CLIENT_ID = 'fc885c73-ce83-4d1e-9fo3-kako45460489';
  // The client secret generated while creating a key for the Azure AD app.
  var AAD_CLIENT_SECRET = 'ZqnwPIsiMP07Wz7AQkx0RsD7mYTElny1tpKot8lizE9=';
  // The location of the users that are going to access Microsoft products.
  var AAD_USAGE_LOCATION = 'US';
  // Azure AD doesn't recognize the user instantly, it needs a few seconds
  var AAD_USER_CREATE_DELAY = 15000;
  // The key that represents the license that we want to give the new user.
  // Take a look in the following URL for a list of the existing licenses:
  // https://gist.github.com/Lillecarl/3c4727e6dcd1334467e0
  var OFFICE365_KEY = 'O365_BUSINESS';

  // Global variables that we will use in the different steps while
  // provisioning a new user.
  var token;
  var userPrincipalName;
  var mailNickname = user.email.split('@')[0];
  var uuid = uuidv4.v4();
  var immutableId = new Buffer(uuid).toString('base64');
  var userId;

  // If the user is already provisioned on Microsoft AD, we skip
  // the rest of this rule
  if (user.app_metadata.office365Provisioned) {
    return connectWithUser();
  }

  // All the steps performed to provision new Microsoft AD users.
  // The definition of each function are below.
  getAzureADToken()
    .then(createAzureADUser)
    .then(getAvailableLicenses)
    .then(assignOffice365License)
    .then(saveUserMetadata)
    .then(waitCreateDelay)
    .then(connectWithUser)
    .catch(callback);

  // Requests an access_token to interact with Windows Graph API.
  function getAzureADToken() {
    var options = {
      method: 'POST',
      url: 'https://login.windows.net/' + AAD_TENANT_NAME + '/oauth2/token?api-version=1.5',
      headers: {
        'Content-type': 'application/json',
        },
      json: true,
      form: {
        client_id: AAD_CLIENT_ID,
        client_secret: AAD_CLIENT_SECRET,
        grant_type: 'client_credentials',
        resource: 'https://graph.windows.net'
      },
    };

    return rp(options);
  }

  // Gets the access_token requested above and assembles a new request
  // to provision the new Microsoft AD user.
  function createAzureADUser(response) {
    token = response.access_token;
    userPrincipalName = 'auth0-' + uuid + '@' + AAD_CUSTOM_DOMAIN;

    var options = {
      url: 'https://graph.windows.net/' + AAD_TENANT_NAME + '/users?api-version=1.6',
      headers: {
        'Content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      json: true,
      body: {
        accountEnabled: true,
        displayName: user.nickname,
        mailNickname: mailNickname,
        userPrincipalName: userPrincipalName,
        passwordProfile: {
          password: immutableId,
          forceChangePasswordNextLogin: false
        },
        immutableId: immutableId,
        usageLocation: AAD_USAGE_LOCATION
      },
    };

    return rp(options);
  }

  // After provisioning the user, we issue a request to get the list
  // of available Microsoft products licenses.
  function getAvailableLicenses(response) {
    userId = response.objectId;
    var options = {
      url: 'https://graph.windows.net/' + AAD_TENANT_NAME + '/subscribedSkus?api-version=1.6',
      json: true,
      headers: {
        'Content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    };
    return rp(options);
  }

  // With the licenses list, we iterate over it to get the id (skuId) of the
  // license that we want to give to the new user (office 365 in this case).
  // We also issue a new request to the Graph API to tie the user and the
  // license together.
  function assignOffice365License(response) {
    var office365License;

    for (var i = 0; i < response.value.length; i++) {
      if (response.value[i].skuPartNumber === OFFICE365_KEY) {
        office365License = response.value[i].skuId;
        break;
      }
    }

    var options = {
      url: ' https://graph.windows.net/' + AAD_TENANT_NAME + '/users/' + userId + '/assignLicense?api-version=1.6',
      headers: {
        'Content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      json: true,
      body: {
        'addLicenses': [
          {
            'disabledPlans': [],
            'skuId': office365License
          }
        ],
        'removeLicenses': []
      }
    };
    return rp(options);
  }

  // After provisioning the user and giving a license to them, we record
  // (on Auth) that this Google Apps user has already been provisioned. We
  // also record the user's principal username and immutableId to properly
  // redirect them on future logins.
  function saveUserMetadata() {
    user.app_metadata = user.app_metadata || {};

    user.app_metadata.office365Provisioned = true;
    user.app_metadata.office365UPN = userPrincipalName;
    user.app_metadata.office365ImmutableId = immutableId;

    return auth0.users.updateAppMetadata(user.user_id, user.app_metadata);
  }

  // As mentioned, Windows Graph API needs around 10 seconds to finish
  // provisioning new users (even though it returns ok straight away)
  function waitCreateDelay() {
    return new Promise(function (resolve) {
      setTimeout(function() {
        resolve();
      }, AAD_USER_CREATE_DELAY);
    });
  }

  // Adds the principal username and immutableId to the user object and ends
  // the rule.
  function connectWithUser() {
    user.upn = user.app_metadata.office365UPN;
    user.inmutableid = user.app_metadata.office365ImmutableId;
      return callback(null, user, context);
  }
}
```

After copying and pasting the rule above, we need to replace the values of the following constants: `AAD_CUSTOM_DOMAIN`, `AAD_TENANT_NAME`, `AAD_CLIENT_ID`, `AAD_CLIENT_SECRET`. The first two constants refer to our company main domain and the subdomain that Microsoft assigned to us while subscribing for their products. The last two constants refer to the app that we registered on the Azure Portal.

Note that the rule above does not distinguish users by any means. Every new user that connects to Microsoft products with a Google Apps user will get an Office 365 license. You can tweak this rule at will to properly decide what licenses you are going to provision to what users. For example, you could easily change the rule to give a *Microsoft Dynamics 365* license to users of a specific Google Apps group while giving *Office 365* to everybody else. The functions `getAvailableLicenses` and `assignOffice365License` above are the ones that hold the logic that define that everybody gets an *Office 365* license.

## Conclusion

The integration described in this article enables companies to make the most of the enterprise tools provided by two of the most important companies around, Microsoft and Google. The approach shown enables companies to rely on a single source of truth (Google Apps in this case), when talking about identity management, to automatically provision users and licenses on another software provider (Microsoft). In addition, the strategy used here is generic. With Auth0 Rules we can integrate any other software providers that expose APIs to manage resources and identities.

Besides that, by using Auth0 we also get access to state-of-the-art features that can help protect valuable information. For example, with Auth0 we can easily add [Multifactor Authentication](https://auth0.com/docs/multifactor-authentication) to enhance authentication security, or configure [Passwordless authentication](https://auth0.com/passwordless) to smooth the authentication process.
