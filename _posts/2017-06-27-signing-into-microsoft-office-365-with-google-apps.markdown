---
layout: post
title: "Signing into Microsoft Office 365 with Google Apps"
description: "Let's check how to sign into Microsoft products, like Office 365, with Google Apps users."
date: 2017-06-27 09:18
category: Technical Guide, Identity, Single Sign On
author:
  name: "Bruno Krebs"
  url: "https://twitter.com/brunoskrebs"
  mail: "bruno.krebs@auth0.com"
  avatar: "https://www.gravatar.com/avatar/76ea40cbf67675babe924eecf167b9b8?s=60"
tags:
- google apps
- microsoft
- identity
- sso
related:
- 2013-05-29-Authenticate-users-with-Amazon-accounts
- 2013-05-22-SSO-with-Dropbox-only-a-checkbox-away
---

**TL;DR;** In this blog post, I'm going to that it's possible to sign into Microsoft products with Google Apps users. This is a great example of unique integrations that only Auth0 can provide.

**https://login.microsoftonline.com/login.srf** logout url on https://manage.auth0.com/#/account/advanced

## Google Apps (G Suite)

## Microsoft Office 365

## SSO on Office 365 with Google Apps - Scenario Overview

## Enabling SSO

### Create Google Apps

### Create Azure AD Application

1. Go to [Azure Portal](https://portal.azure.com)
2. Choose *Azure Active Directory*
3. Click on *New application registration*.
    Resources: https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-integrating-applications
4. Fill the name of the application (e.g. *Auth0 Provisioning*), the sign-on URL (e.g. http://digituz.com.br/auth0-provision) and select *Web app / API* as the *Application type*.
5. Choose the recently create application and add a new key to it. Feel free to decide the *Description* and the *Duration* of the key, but remember to copy the *Client Key* after saving it. You won't be able to retrieve this key after you leave this page.
6. Still in the configuration page of the application, you will need to enable the *Read and write directory data* permission to the *Windows Azure Active Directory* API. This will allow you to create new users in Azure AD through the graph API, which will be needed in a future step.

Client ID: 2129dc62-dba9-459d-96a6-5ef43dc02858
Client Key: UFdB62SNvK3NjGH6xx/eXXmFh07bvkRLQgSzhU3e0fs=

### Sinchronize

1. Go to [the *Rules* page on the management tool of Auth0](https://manage.auth0.com/#/rules).
2. Click on *Create Rule* (or *Create Your First Rule* if you have no other rules).
3.

## Conclusion

talk about other kind of integrations, like connecting to Office 365 with Dropbox and so on


```js
function (user, context, callback) {
    var rp = require('request-promise');
    var uuidv4 = require('uuid');

    var AAD_CUSTOM_DOMAIN = 'digituz.com.br';
    var AAD_TENANT_NAME = 'digituz.onmicrosoft.com';
    var AAD_CLIENT_ID = 'fc776c73-ce83-4d1e-9da4-ceca45460489';
    var AAD_CLIENT_SECRET = 'ZqnwPIciNP07Wz7AQkx0RsM6mXWElny1tpKot8lizE0=';
    var AAD_USAGE_LOCATION = 'US';
    var AAD_USER_CREATE_DELAY = 15000;
    var OFFICE365_KEY = 'O365_BUSINESS';

    var token;
    var userPrincipalName;
    var mailNickname = user.email.split('@')[0];
    var uuid = uuidv4.v4();
    var immutableId = new Buffer(uuid).toString('base64');
    var userId;

    if (user.app_metadata.office365_provisioned) {
        return connectWithUser();
    }

    getAzureADToken()
        .then(createAzureADUser)
        .then(getAvailableLicenses)
        .then(assignOffice365License)
        .then(saveUserMetadata)
        .then(waitCreateDelay)
        .then(connectWithUser)
        .catch(callback);

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

    function saveUserMetadata() {
        user.app_metadata = user.app_metadata || {};

        user.app_metadata.office365Provisioned = true;
        user.app_metadata.office365UPN = userPrincipalName;
        user.app_metadata.office365ImmutableId = immutableId;

        return auth0.users.updateAppMetadata(user.user_id, user.app_metadata);
    }

    function waitCreateDelay() {
        // Azure AD API doesn't recognize an user straight away.
        // Therefore we need to wait a few seconds before enabling the user to move on
        console.log('start waiting');
        return new Promise(function (resolve) {
            setTimeout(function() {
                console.log('done waiting');
                resolve();
            }, AAD_USER_CREATE_DELAY);
        });
    }

    function connectWithUser() {
        user.upn = user.app_metadata.office365UPN;
        user.inmutableid = user.app_metadata.office365ImmutableId;
        return callback(null, user, context);
    }
}
```
