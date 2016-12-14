---
layout: post
title: "Announcing Auth0 Authorization Extension v2!"
description: "Introducing the new version of our Authorization Extension which adds support for roles and permissions"
date: 2016-12-14 08:30
category: Announcement, Extensions
design:
  bg_color: "#4a4a4a"
  image: https://cdn.auth0.com/blog/auth-extensions-v2/logo.png
author:
  name: "Sandrino Di Mattia"
  url: "https://www.twitter.com/sandrinodm"
  mail: "sandrin@auth0.com"
  avatar: "https://s.gravatar.com/avatar/e8a46264ec428f6b37018e1b962b893a.png"
tags:
- auth0
- auth0-extensions
- RBAC
- authorization
related:
- 2016-09-28-announcing-identity-glossary
- 2016-08-25-announcing-Auth0-Guardian-a-new-way-to-login
- 2016-08-24-announcing-password-breach-detection
---

## Background

Authentication has always been the core of Auth0. But once you know who your users are, you’ll probably also need to know what they can do. Therefore, after authenticating users, you’ll need to authorize them. There are so many different ways to do this, from complex products to home-grown solutions. Using our rules engine, you could also consume this information during the login process.

## Concepts

The Authorization Extension which you can now install using the Extensions tab in the dashboard, tries to provide customers with a generic approach to managing authorization using three top-level concepts:

 - Groups
 - Roles
 - Permissions

### Groups

Groups are collections of users. They are a common way to organize users in enterprise directories like Active Directory. A company might create a group for every department, such as HR, Finance, Accounting, and IT.

Users can be added to one or more groups. But groups can also be nested, with members of one group automatically added as members of another group.

![An example of the "Finance Group"](https://cdn.auth0.com/blog/authorization-v2/group.png)

The main reason for having groups is that it allows us to group people who have the same profile within the company. It is easier to assign roles and permissions to groups than it is to individual people, who can can get sick, go on vacation or leave the company.

### Permissions and Roles

While groups are bound to an organization and not an application, the same is not true for roles and permissions.

If you look at an application that you are building, you’ll notice that users can do many things within your application. Everything your users can do are actions, including opening a record, updating one, deleting one, reporting, and changing settings. A permission determines whether you are allowed to execute an action or not, such as:

- `read:users`
- `run:reports`
- `update:settings`

![Permissions are granual actions that you can execute within an application](https://cdn.auth0.com/blog/authorization-v2/permissions.png)

These permissions only make sense within the application. A `generate:invoice` permission might make a lot of sense in your accounting application but no sense at all in your planning tool. Therefore, permissions represent actions that you can execute as a user within an application, and roles are there to group these permissions into logical collections.

A timesheet application can have a **Timesheet User** role and a **Timesheet Manager** role. A user will have certain permissions, such as `read:timesheets` `update:timesheets`, and `create:timesheets`, while a manager will have additional permissions, such as `approve:timesheet` and `reject:timesheet`.

![Roles are used to organize your permissions](https://cdn.auth0.com/blog/authorization-v2/role.png)

These roles can be assigned to specific users or to groups; if roles are assigned to a group, every user of that group will receive those roles (and permissions).

## Consuming this information in your applications

After setting up everything in the extension, your applications will need to consume this information. The extension offers three ways to do this:

 - Adding information to the **id_token**
 - Adding information to the user’s **app_metadata**
 - Getting the information from a **policy decision point** (PDP)

In the configuration section, you can configure the behavior of the extension. Any change you make here will deploy a rule to your Auth0 account, which will add the information to the token, the app_metadata, or both.

If you’re implementing RBAC, for example, you could just check the box to store the roles in the token. But if you need to understand which permissions a user has in a specific application later, you could make the following call to get the user’s authorization data in the context of an application:

```
POST https://sandrino-dev.us.webtask.io/api/users/ad|john@fabrikam.com/policy/9CDFQBunB9ZvYRCpFWJlzpH9tUwclGIO
```

This will return the groups, roles, and permissions for a user in the context of the current application:

```json
{
  "groups": [
    "Distribution",
    "Accounting"
  ],
  "permissions": [
    "read:own-receipts",
    "update:own-receipts",
    "update:delete-receipts",
    "read:own-reports",
    "update:own-reports",
    "delete:own-reports",
    "submit:own-reports",
    "read:receipts",
    "read:reports",
    "approve:reports",
    "reject:reports"
  ],
  "roles": [
    "Expense User",
    "Expense Manager"
  ]
}
```

## Feedback?

This extension was built using React, Redux, Hapi, and Webtask. When you install it, the entire application will run in the Webtask container of your Auth0 account.

The full source code is available at https://github.com/auth0/auth0-authorization-extension. Feel free to open a GitHub issue if you have any feedback. 

## What lies ahead

Our API authorization feature has been in public preview for some time now, and it will be interesting to use the authorization extension in that context. Depending on your use case, your permissions can be represented as **scopes** in your access token.

Here are some additional resources to get you started:

- [Official documentation](https://auth0.com/docs/extensions/authorization-extension)
- [Automatically provisioning groups, roles, and permissions](https://github.com/auth0-extensions/authz-extension-automation-sample)
