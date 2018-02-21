---
layout: post
title: "Laravel 5.6 Release: What's New?"
description: Laravel 5.6 has officially been released. What's new? What improvements were made? Learn how to build better PHP applications with this new release.
longdescription:
date: 2017-09-27 08:30
category: Hot Topics, Frameworks, Laravel
design:
  bg_color: "#222228"
  image: https://cdn.auth0.com/blog/next3/logo.png
author:
  name: Prosper Otemuyiwa
  url: http://twitter.com/unicodeveloper
  mail: prosper.otemuyiwa@auth0.com
  avatar: https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200
tags:
- laravel
- web-app
- php
- auth0
related:
- 2016-11-01-building-universal-apps-with-nextjs
- 2017-04-24-build-better-universal-apps-with-nextjs2
- 2016-10-05-build-your-first-app-with-polymer-and-web-components
---

---

**TL;DR:** On Wednesday, February 7 2018, **Laravel 5.6**, was released to the public. It's a major release to the most popular PHP framework on GitHub as of this writing. Furthermore, [Spark 6.0](https://spark.laravel.com) was also released alongside **Laravel 5.6**. According to the policy laid down by the Taylor and the core team, major Laravel framework releases are released every six months (February and August). In this article, I'll cover the new features in Laravel 5.6 and several other changes and deprecations.

---

Laravel is a free, open-source PHP framework designed for building web applications with an expressive and elegant syntax. Laravel has a high level of abstraction which shields the common developer from complex inner workings. Laravel saves you time and effort because it ships with a lot of features out of the box. Without further ado, let's dive right in to **Laravel 5.6**.

## What's new in Laravel 5.6?

### 1. Support For Argon Password Hashing

Argon2, the recommended password hashing algorithm by the Password Hashing Competition, is a modern algorithm for securely hashing passwords. And it comes in two distinct flavors, Argon 2i and Argon 2d. PHP 7.2 recently added support for Argon 2i password hashing. Therefore, [Michael Lundbol](https://github.com/morloderex) took the initiative to start the process of adding support for Argon hashing in Laravel.

![Argon Password Hashing Support](https://cdn.auth0.com/blog/laravel56/argon.png)
_Initiative to add Argon Password Hashing_

The `bcrypt` driver is the default driver for password hashing in Laravel. However, Laravel 5.6 now supports `argon`.

![Config File for Hashing](https://cdn.auth0.com/blog/laravel56/argondriversupport.png)
_Config file for hashing_

**Note:** Laravel 5.6 ships with a [hashing config file](https://github.com/laravel/laravel/blob/develop/config/hashing.php) as displayed above.

### Better Support For Dynamic Rate Limiting

One of the beautiful built-in features of Laravel is _API Rate Limiting_. Before now, Laravel's rate limiting configuration involved specifying a hard-coded number of requests on a group of routes. However, Laravel 5.6 adds icing to the cake by allowing you specify a maximum number of requests based on an authenticated User model attribute.

```php
Route::middleware('auth:api', 'throttle:rate_limit,1')->group(function () {
    Route::get('/users', function () {
        // do something awesome
    });
});
```

In the code above, the `rate_limit` parameter is an attribute of the `User` model in a Laravel 5.6 application.

### 3. Model Serialization on Steriods

Before now, there was a persistent bug on queued models. When queued models are finally processed, it's without their loaded relationships in place.

In Laravel 5.6, huge improvements have been made to ensure that relationships loaded on queued models are automatically re-loaded when the job is processed by the queue.

### 4. Improved Logging

There is a new [logging config](https://github.com/laravel/laravel/blob/develop/config/logging.php) file in Laravel 5.6. In this file, you can set up logging stacks that send log messages to various handlers.

Check out the example below:

```php
'channels' => [
  'stack' => [
      'driver' => 'stack',
      'channels' => ['syslog', 'slack'],
  ],

  'syslog' => [
      'driver' => 'syslog',
      'level' => 'debug',
  ],

  'slack' => [
      'driver' => 'slack',
      'url' => env('LOG_SLACK_WEBHOOK_URL'),
      'username' => 'Laravel Log',
      'emoji' => ':boom:',
      'level' => 'critical',
  ],
],
```

The `stack` driver allows you to combine multiple channels, in this case, `syslog` and `slack`, into a single log channel as shown above.

Furthermore, with the `tap` array on a channel's configuration, you can easily customize Monolog for an existing channel like so:

```php
'single' => [
    'driver' => 'single',
    'tap' => [App\Logging\CustomizeFormatter::class],
    'path' => storage_path('logs/laravel.log'),
    'level' => 'debug',
],
```

Check out more [information on Logging in Laravel 5.6](https://laravel.com/docs/5.6/logging).

### 5. Single Server Task Scheduling

Before now, if your app ran on multiple servers and the task scheduler was active on those servers, then your scheduled tasks also executed multiple times. However, in Laravel 5.6, you can schedule your task to execute on just a single server if your app runs on multiple servers.

```php
$schedule->command('launch:flasheavy')
         ->tuesdays()
         ->at('12:00')
         ->onOneServer();
```

### 6. Beautiful Error Reporting With Collision

[Collision](https://github.com/nunomaduro/collision) is an awesome package developed and maintained by [Nuno Maduro](https://twitter.com/enunomaduro). It is a detailed, beautiful and intuitive error handler for console/command-line PHP applications.

Laravel 5.6 now ships with Collision via the `dev` composer dependency. When working with your Laravel app via the command line, Collision provides an awesome error reporting interface like so:

![Collision Integration](https://cdn.auth0.com/blog/laravel56/collision.png)
_Collision Integration with Laravel 5.6_

### 7. Elevated Eloquent Date Formatting

### 8. Blade Component Aliases

### 9. Broadcasting Channel Classes

### 10.


## Aside: Authenticating a Laravel App with Auth0

**Auth0** issues [JSON Web Tokens](https://jwt.io/) on every login for your users. This means that you can have a solid [identity infrastructure](https://auth0.com/docs/identityproviders), including [single sign-on](https://auth0.com/docs/sso/single-sign-on), user management, support for social identity providers (Facebook, Github, Twitter, etc.), enterprise identity providers (Active Directory, LDAP, SAML, etc.) and your own database of users with just a few lines of code.

We can easily set up authentication in a **Next.js 3.0** apps by using the [Auth0.js library](https://github.com/auth0/auth0.js). If you don't already have an Auth0 account, <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">sign up</a> for one now. Navigate to the Auth0 [management dashboard](https://manage.auth0.com/), click on `New client` by the right hand side, select Regular Web App from the dialog box and then go ahead to the `Settings` tab where the client ID, client Secret and Domain can be retreived.

> [Auth0 offers a generous **free tier**](https://auth0.com/pricing) to get started with modern authentication.

**Note:** Make sure you set the  `Allowed Callback URLs` to `http://localhost:3000/auth/signed-in` or whatever url/port you are running on. Furthermore; set the `Allowed Logout URLs` to `http://localhost:3000/`.

Authentication in a Next.js app could be a little complicated because you have to ensure that the server-rendered pages are authenticated, meaning they need to have access to the token.

Check out the [complete app on GitHub](https://github.com/auth0-blog/next3-auth0).

**Note**: Don't forget to rename the `config.sample.json` file to `config.json` and add your credentials.

_utils/auth.js_

```js
import jwtDecode from 'jwt-decode'
import Cookie from 'js-cookie'

const getQueryParams = () => {
  const params = {}
  window.location.href.replace(/([^(?|#)=&]+)(=([^&]*))?/g, ($0, $1, $2, $3) => {
    params[$1] = $3
  })
  return params
}

export const setToken = (idToken, accessToken) => {
  if (!process.browser) {
    return
  }
  Cookie.set('user', jwtDecode(idToken))
  Cookie.set('idToken', idToken)
  Cookie.set('accessToken', accessToken)
}

export const unsetToken = () => {
  if (!process.browser) {
    return
  }
  Cookie.remove('idToken')
  Cookie.remove('accessToken')
  Cookie.remove('user')

  // to support logging out from all windows
  window.localStorage.setItem('logout', Date.now())
}

export const getUserFromServerCookie = (req) => {
  if (!req.headers.cookie) {
    return undefined
  }
  const jwtCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith('idToken='))
  if (!jwtCookie) {
    return undefined
  }
  const jwt = jwtCookie.split('=')[1]
  return jwtDecode(jwt)
}

export const getUserFromLocalCookie = () => {
  return Cookie.getJSON('user')
}
```

_utils/auth0.js_

```js
const getAuth0 = (options) => {
  const config = require('../config.json')
  const auth0 = require('auth0-js');
  return new auth0.WebAuth({
    clientID: config.AUTH0_CLIENT_ID,
    domain: config.AUTH0_CLIENT_DOMAIN,
  });
}

const getBaseUrl = () => `${window.location.protocol}//${window.location.host}`

const getOptions = (container) => {
  return {
    responseType: 'token id_token',
    redirectUri: `${getBaseUrl()}/auth/signed-in`,
    scope: 'openid profile email'
  }
}

export const authorize = () => getAuth0().authorize(getOptions())
export const logout = () => getAuth0().logout({ returnTo: getBaseUrl() })
export const parseHash = (callback) => getAuth0().parseHash(callback)
```

_pages/auth/sign-in.js_

```js
import React from 'react'

import defaultPage from '../../hocs/defaultPage'
import { authorize } from '../../utils/auth0'

class SignIn extends React.Component {
  componentDidMount () {
    authorize()
  }
  render () {
    return null
  }
}

export default defaultPage(SignIn)
```

Display the login page once the sign-in component gets mounted.

![Sign in](https://cdn.auth0.com/blog/nextjs3/login.png)
_Sign-in page_

_pages/auth/signed-in.js_

```js
import React, { PropTypes } from 'react'
import Router from 'next/router'

import { setToken } from '../../utils/auth'
import { parseHash } from '../../utils/auth0'

export default class SignedIn extends React.Component {
  static propTypes = {
    url: PropTypes.object.isRequired
  }

  componentDidMount () {
    parseHash((err, result) => {
      if(err) {
        console.error('Something happened with the Sign In request')
        return;
      }

      setToken(result.idToken, result.accessToken);
      Router.push('/')
    })
  }
  render () {
    return null
  }
}
```

Grab the token and ID token from Auth0 as it returns to the callback which is the signed-in page, save it and redirect to the index page.

![Signed in](https://cdn.auth0.com/blog/signedin/authenticated.png)
_Secret page shows that the user is signed in and can access it_

_pages/index.js_

```js

import React, { PropTypes } from 'react'
import Link from 'next/link'

import defaultPage from '../hocs/defaultPage'

const SuperSecretDiv = () => (
  <div>
    This is a super secret div.
    <style jsx>{`
      div {
        background-color: #ecf0f1;
        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
        border-radius: 2px;
        padding: 10px;
        min-height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #333;
        text-align: center;
        font-size: 40px;
        font-weight: 100;
        margin-bottom: 30px;
      }
    `}</style>
  </div>
)

const createLink = (href, text) => (
  <a href={href}>
    {text}
    <style jsx>{`
      a {
        color: #333;
        padding-bottom: 2px;
        border-bottom: 1px solid #ccc;
        text-decoration: none;
        font-weight: 400;
        line-height: 30px;
        transition: border-bottom .2s;
      }

      a:hover {
        border-bottom-color: #333;
      }
    `}</style>
  </a>
)

const Index = ({ isAuthenticated }) => (
  <div>
    {isAuthenticated && <SuperSecretDiv />}
    <div className='main'>
      <h1>Hello, friend!</h1>
      <p>
        This is a super simple example of how to use {createLink('https://github.com/zeit/next.js', 'next.js')} and {createLink('https://auth0.com/', 'Auth0')} together.
      </p>
      {!isAuthenticated && (
        <p>
          You're not authenticated yet. Maybe you want to <Link href='/auth/sign-in'>{createLink('/auth/sign-in', 'sign in')}</Link> and see what happens?
        </p>
      )}
      {isAuthenticated && (
        <p>
          Now that you're authenticated, maybe you should try going to our <Link href='/secret'>{createLink('/secret', 'super secret page')}</Link>!
        </p>
      )}
    </div>
    <style jsx>{`
      .main {
        max-width: 750px;
        margin: 0 auto;
        text-align: center;
      }

      h1 {
        font-size: 40;
        font-weight: 200;
        line-height: 40px;
      }

      p {
        font-size: 20px;
        font-weight: 200;
        line-height: 30px;
      }
    `}</style>
  </div>
)

Index.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
}

export default defaultPage(Index)

```

The index page is server-rendered. It checks if the user is authenticated or not and renders content based on the status.

The [secret page](https://github.com/auth0-blog/next3-auth0/blob/master/pages/secret.js) too checks if the user is logged in and determines content based on the user's status.

![Secret page unauthorized](https://cdn.auth0.com/blog/secret/notloggedin.png)
_Not displaying valid content because the user cant access the secret page without signing in_

**Note:** This example performs no server side validation of the token sent by the user in its cookies. For production-ready secure pages this is necessary.

> Auth0 provides the simplest and easiest to use [user interface tools to help administrators manage user identities](https://auth0.com/user-management) including password resets, creating and provisioning, blocking and deleting users.


## Deprecations and Other Updates

* The global font-size has been increased from `14px` to `16px`.
* The primary CSS unit is now `rem` rather than `px`. However, pixels are widely used for media queries.
* Bootstrap 4 dropped the Glyphicons icon font. Suggested options are [fontAwesome](http://fontawesome.io/) and [Octicons](https://octicons.github.com/).
* Bootstrap 4 also dropped the **Affix JQuery library**. Suggested option is to use the `position:sticky` polyfill.
* Bootstrap 4 dropped support for non-responsive usage of Bootstrap.
* Bootstrap 4 uses a user's system fonts, with a fallback to Helvetica Neue, Arial, and sans-serif.

Check out other [Angular 5 updates here](https://github.com/angular/angular/blob/master/CHANGELOG.md).

## Upgrading to Laravel 5.6

The Bootstrap team has a comprehensive guide for [migrating to Bootstrap v4](https://getbootstrap.com/docs/4.0/migration). However, there is a very [nifty tool](http://upgrade-bootstrap.bootply.com) from the community that allows you to drop in a piece of code and convert it to the Bootstrap v4 equivalent.

![Bootstrap v3](https://cdn.auth0.com/blog/bootstrap4/pieceofcode.png)
_Bootstrap v3_

![Bootstrap v4](https://cdn.auth0.com/blog/bootstrap4/convertedcode.png)
_Converted to Bootstrap v4 code_

{% include asides/{laravel}.markdown %}

## Conclusion

**Bootstrap 4** came loaded with new features and significant improvements. It is better, more customizable and slick. I am proud of what the Bootstrap team and the community achieved with this release.

{% include tweet_quote.html quote_text="Bootstrap 4 is a major rewrite of the entire project." %}

Have you switched to Bootstrap v4.0 yet? What are your thoughts? Let me know in the comments section! 😊