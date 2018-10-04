---
layout: post
title: "A much better People Picker for SharePoint"
date: 2013-05-04 8:29
outdated: true
alias: /2013/05/04/A-much-better-People-Picker-for-SharePoint/
author:
  name: Sebastian Iacomuzzi
  mail: sebastian@auth0.com
  url: https://github.com/siacomuzzi
  avatar: https://secure.gravatar.com/avatar/c35416d45481332127c88e4cd355555f?s=400&d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png
description: "When you claims enable SharePoint with Auth0, you also get an enhanced People Picker. This is optional, because it doesn't intervene in the authentication process"
category: Auth0-based Tutorial
related:
- 2013-03-15-Integrating-Auth0-with-Rights-Management-Services
- 2013-03-07-On-Premises-SharePoint-Federated-with-Partner-AD
- 2013-02-28-SaaS-App-Federated-with-Office-365
tags:
- microsoft
---


When you _"claims enable"_ SharePoint with Auth0, you also get an enhanced __People Picker__. This is optional, because it doesn't intervene in then authentication process, but is a very handy feature that prevents common mistakes, errors, and a superior user experience.

If you enable the __Auth0 People Picker__ you will be able to resolve names and search contacts across all configured identity providers.

![](https://s3.amazonaws.com/blog.auth0.com/img/sp-people-picker.png)

<!-- more -->

##How does it work?

The __Auth0 People Picker__ uses Auth0's Users API, that offers a uniform, normalized query API across directories and users repositories. (If you have an account with Auth0 you can test this very quickly using the API Explorer. If you don't have an account, [go get one!](https://auth0.com)...or read [the docs here](https://docs.auth0.com/api-reference)).

__Auth0 People Picker__ implements SharePoint's [`SPClaimsProvider` contract](http://msdn.microsoft.com/en-us/library/microsoft.sharepoint.administration.claims.spclaimprovider(v=office.14).aspx):

![](https://s3.amazonaws.com/blog.auth0.com/img/sp-auth0-architecture.png)

Configuring SharePoint with Auth0 is straight forward as [we explained here](http://blog.auth0.com/2013/03/27/Automating-SharePoint-Federation-Setup-With-Auth0/).

Enabling the __People Picker__ requires just a few extra step:

1. Run the `Enable-ClaimsProvider` cmdlet (this will enable it on any web app configured with Auth0)
2. Go to "General Security" section
3. Select "Configure Auth0 Claims Provider"
4. Enter the three parameters: your `tenant`, your `client_secret` and your `client_id`.

You are done!

### Demo

This is a very short demo of the entire experience:

1. Login to SharePoint with the __Auth0 Login Widget__ using Google
2. Searching for a user ("eugenio") across all configured connections in Auth0

<iframe width="700" height="394" src="https://www.youtube.com/embed/NP-7wei3e8Q?rel=0" frameborder="0" allowfullscreen></iframe>

[Try Auth0 yourself!](https://auth0.com)
