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

## Google Apps (G Suite)

## Microsoft Office 365

## SSO on Office 365 with Google Apps - Scenario Overview

## Enabling SSO

### Create Google Apps

### Create Azure AD Application

1. Go to [Azure Portal](https://portal.azure.com)
2. Choose *Azure Active Directory*
3. Click on *New application registration*
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
