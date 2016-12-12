---
layout: post
title: "Introducing the Auth0 Authorization Extension v2!"
description: "Introducing the new version of our Authorization Extension which adds supports for roles and permissions."
date: 2016-12-13 08:30
alias: /2016/12/13/announcing-authorization-extension-v2/
category: Announcement, Extensions
author:
  name: "Sandrino Di Mattia"
  url: "https://www.twitter.com/sandrinodm"
  mail: "sandrino@auth0.com"
  avatar: "https://s.gravatar.com/avatar/e8a46264ec428f6b37018e1b962b893a.png"
tags:
- Auth0
- Auth0 Extensions
- RBAC
- Authorization
---

## Background

Authentication has always been the core of Auth0. But once you know who the user is, you’ll probably also need to know what they can do. So after authenticating users, you’ll need to authorize them. And there are so many different ways to do this, from complex products to home grown solutions. Then using our rules engine, you could also consume this information during the login process.

## Concepts

The Authorization Extension which you can now install using the Extensions tab in the dashboard tries to provide customers with a generic approach of managing authorization using 3 top level concepts:

 - Groups
 - Roles
 - Permissions

### Groups

Groups are collections of users and are a common way to organize users in enterprise directories like Active Directory. A company might create a group for every department:

- HR
- Finance
- Accounting
- IT

Users can then be added to one or more groups. But groups can also be nested, where members of a group are automatically added as members of another group.

The main reason of having groups is because it allows us to group people that have the same profile within the company. This makes it easy to assign roles and permissions to groups than it is to individual people (because these people can get sick, go on holidays or leave the company).

### Permissions and Roles

While groups are bound to an organization and not an application, the same is not true for roles and permissions.

If you look at an application that you are building, you’ll notice that users can do many things within your application. Opening a record, updating one, deleting one, reporting, changing settings, … Everything your users can do are actions. And a permission could express if you are allowed to execute that action or not, eg:


- `read:users`
- `run:reports`
- `update:settings`
- …

These permissions only make sense within the application. A `generate:invoice` permission might make a lot of sense in your accounting application, but not sense at all in your planning tool. So permissions represent actions that you can execute as a user within an application and roles are there to group these permissions in logical collections.

A timesheet application can have a **Timesheet User** role and a **Timesheet Manager** role. A user will have permissions like `read:timesheets update:timesheets create:timesheets` while a manager will have additional permissions like `approve:timesheet` and `reject:timesheet`.
`
Finally these roles can be assigned to specific users or to groups, and in that case every user of that group will receive these roles (and permissions).

## Consuming this information in your Applications

After setting up everything in the extension your applications will need to consume this information. The extension support 3 ways to do this:

 - Adding information to the **id_token**
 - Adding information to the user’s **app_metadata**
 - Get the information from a **policy decision point** (PDP)

In the configuration section you can configure the behavior of the extension. Any change you make here will deploy a rule to your Auth0 account which will add the information to the token, the app_metadata or both.

If you’re implementing RBAC for example, you could just check the box to store the Roles in the token. But if at some point later on you need to understand what permissions a user has in a specific application, you could for example make the following call:

```
GET https://sandrino-dev.us.webtask.io/adf6e2f2b84784b57522e3b19dfc9201/api/...
```

This will return the groups, roles and permissions of a user in the context of the current application.

## Feedback?

This extension was built using React, Redux, Hapi and Webtask. When you install it in your account, the whole application is then deployed in the Webtask container of your Auth0 account.

The whole source is available here and feel free to open a GitHub issue if you have any feedback: https://github.com/auth0/auth0-authorization-extension

## What lies ahead

Our API Authorization feature has been in public preview for some time now and also in that context will it be interesting to use the Authorization Extension. Because depending on your use case your permissions can be represented as **scopes** in your access token.

Here are some additional resources that can get your started:

- [Official documentation](https://github.com/auth0/docs/blob/master/articles/extensions/authorization-extension.md)
- [Automatically provisioning Groups, Roles and Permissions](https://github.com/auth0-extensions/authz-extension-automation-sample)
