---
layout: post
title: "Build Better Universal JavaScript Apps with Next.js 2.0"
description: Next.js 2.0 has officially been released. What's new? What improvements were made? Learn how to build highly performant Universal JavaScript apps with this new release.
date: 2017-03-29 08:30
category: Hot Topics, Frameworks, Next.js
design:
  bg_color: "#222228"
  image: https://cdn.auth0.com/blog/next.jslogo.png
author:
  name: Prosper Otemuyiwa
  url: http://twitter.com/unicodeveloper?lang=en
  mail: prosper.otemuyiwa@auth0.com
  avatar: https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200
tags:
- nextjs
- universal-webapp
- javascript
- auth
related:
- 2016-11-01-building-universal-apps-with-nextjs
- 2016-09-29-angular-2-authentication
- 2016-10-05-build-your-first-app-with-polymer-and-web-components
---

---

**TL;DR:** On Tuesday, October 25 2016, a small JavaScript framework, **Next.js** was released to the public. It's a minimal framework for building server-rendered universal JavaScript web apps. Within a few months of its existence, it gathered a lot of attention from the JavaScript community. The React community was set ablaze with joy for finally having a tool that can help build server-side rendering apps without hassle and in-depth technical know-how. In fact, we covered [how to build a universal JavaScript web app](https://auth0.com/blog/building-universal-apps-with-nextjs) with it. The team behind **Next.js** did not take a break, they continued working tirelessly for months to fix several bugs, improve performance and still make the framework as simple as possible. Their efforts have yielded a **Next.js 2.0** release.

---

## What is a Universal JavaScript Application?

Just to provide a little context for the individuals that find *Universal JavaScript* to be a new term.

The term *Universal* simply means the ability to run the same code on the server, browsers, mobile devices and any other platform. *Universal Javascript* is a term people are leaning towards these days. A lot of developers also call it **Isomorphic JavaScript**. In short, there is a debate on the [React repo](https://github.com/facebook/react/pull/4041) about this term. Michael Jackson, a popular ReactJS developer wrote a blog post on [Universal JavaScript](https://medium.com/@mjackson/universal-javascript-4761051b7ae9#.ij2c0zh8j). It's indeed true that *naming things* is one of the most difficult aspects of Computer Science.

## What's new in Next.js 2.0 ?

Next.js 2.0 was released on On March 27, 2017. It comes bundled with a set of new features and improvements of existing features. **Next.js 1.0** already include the following features:

* Hot code reloading
* Automatic transpilation and bundling(using babel & webpack)
* Server rendering and indexing of JavaScript files in the `/pages` directory
* Serving of static files
* CSS isolation and modularization

So, what has changed? What improvements have been made? Are there new features? Will your Next.js apps built with this new release be truly production ready? Let's go through everything that **Next.js 2.0** has to offer.

### 1. Faster Compilation Times

Every developer and their dog need their apps to be highly performant from development stage up until production. A lot of work has been done to improve the dev build time that **Next.js 1.0** brought to the scene. With great joy, I hereby announce to you that **Next.js 2** comes bundled with shorter build/rebuild times. This was made possible by offering [Lazy compilation during development](https://github.com/zeit/next.js/pull/1111). This simply means that before now, when you run next, it compiles all the pages. But now, lazy compilation ensures that it is only when a user hits a page, that compilation happens. So each page that is called by the user is an on-demand entry.

![Lazy Compilation during development](https://cdn.auth0.com/blog/next20/lazycompilationdev.png)
_Lazy Compilation during development_

![Implement on-demand entries](https://cdn.auth0.com/blog/next20/lazycompilation.png)
_Implement on-demand entries_

### 2. Ahead-of-Time Gzip Compression

**Next.js 2.0** automatically gzips all your static JavaScript files and serves them when you build your app by running *next build* . This saves a lot of CPU power especially for apps deployed in cloud function-like environments.

### 3. Smaller and Efficient Builds

Apart from reducing the dev build times, **Next.js 2.0** offers much smaller and more-efficient builds than its' previous version. So by default, your app size is now smaller.

![Bundle sizes for 1.0 and 2.0](https://cdn.auth0.com/blog/next20/newbundlesize.png)
_Basic site with Next.js and React bundled_

_Source: [zeit.co](https://zeit.co/blog/next2)_


Page loads have also been made faster by making initial bundle files to be cached permanently on clients.

An issue was raised in Next.js 1.0 about shared dependencies between pages that caused latency when browsing through different server-rendered pages, and the ever-ready team found a way to solve it by setting up Webpack common chunks to avoid shipping repeated code across components.

![Shared dependency issues](https://cdn.auth0.com/blog/next20/sharedependenciesissue.png)
_Shared dependency issues_

![Shared dependency issues solved](https://cdn.auth0.com/blog/next20/shareloadsolved.png)
_Dependency issue solved with CommonsChunkPlugin_

### 4. Programmatic API for Routing

In the first major version of **Next.js**, dynamic routing was only possible with query strings. There was no way to acheive clean and fancy URLs and loading your own custom server code was a big challenge. With **Next.js 2**, those challenges are a thing of the past. 

![Custom routing](https://cdn.auth0.com/blog/next/customrouting.png)
_Issue raised last year_

You can now write your own custom server programmatically, customize routes and use different route patterns like so:

```js

const express = require('express')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {

const server = express()

  server.get('/p/:username', (req, res) => {
    return app.render(req, res, '/z', {
      ...req.query,
      username: req.params.username
    })
  })

  server.get('*', handle)
  server.listen(3333)
})

```

In the code sample above, you have set up a custom server. The path `/p/prosper` where `prosper` is the `:username` is resolved to `./pages/z` . The page gets access to the username parameter and can do whatever has been programmed in it. Check out this [example](https://github.com/zeit/next.js/blob/master/examples/custom-server).

### 5. Pre-fetching Pages 

**Next.js 2.0** comes bundled with an API that allows you prefetch pages. Any `<Link>` tag can accept a `prefetch` prop and prefetch the pages it links to in the background like so:

```js

import Link from 'next/link'

export default () => (
  <nav>
    <ul>
      <li><Link prefetch href='/pricing'><a>About</a></Link></li>
      <li><Link prefetch href='/auth0'><a>Contact</a></Link></li>
    </ul>
  </nav>
)

```

This gives you the performance of an SPA coupled with server rendering. Wow, that's better performance with little efforts. Whoop! Whoop!

### 6. Immutable Caching

When you build your app with `next build` and start your app, **Next.js 2** will serve your JavaScript files and other assets as immutable assets. This simply means that once the browser has downloaded any immutable asset, if you reload the browser page, your browser won't try to load these assets from the server again.

Another gain for performance and speed. Whoop! Whoop! 

### 7. Custom Babel and Webpack Configurations

**Next.js 2** is fully extensible. You have complete control over Babel's and Webpack's configuration. For example, if you want to extend Babel, you can simply define a `.babelrc` file at your app's root and apply `next/babel` preset. With that, you include whatever babel plugins you need like so:

```js

{
  "presets": ["next/babel"],
  "plugins": ["transform-flow-strip-types"]
}

```

Check out this [working example](https://github.com/zeit/next.js/tree/master/examples/with-custom-babel-config).

_sample .babelrc file_

To extend the usage of `Webpack` in Next.js, you can create a `next.config.js` file in the root of your project's directory. Once you have that, you can define a function in the Node.js module like so:

```js

module.exports = {
  webpack: (config, { dev }) => {
    // Perform customizations to config
    
    // Important: return the modified config
    return config
  }
}

```

**Note:** The `next.config.js` file is a regular Node.js module.

### 8. Composed CSS support

Before now, `next/css` was the default `CSS-in-JS` solution for Next.js. In **Next.js 2**, it has been deprecated in favor of [styled-jsx](https://github.com/zeit/styled-jsx), a Babel transformation that provides full, scoped and component-friendly CSS support for JSX (rendered on the server or the client).

```js

export default () => (
  <div>
    <textarea />
    <button>add comment</button>
    <style jsx>{`
      textarea {
        width: 400px;
        height: 100px;
        display: block;
        margin-bottom: 10px;
      }

      button {
        padding: 3px 4px;
      }
      @media (max-width: 750px) {
        textarea {
          width: 100%;
        }
      }
    `}</style>
  </div>
)

```

In the code example above, you can see how it provides scoped support for this JSX-written component.


### 9. Isolating React From Next

Before now, **Next.js** shipped with **React**. All you needed to do was:

```bash

npm install next --save

```

In **Next.js 2**, you now need to bring in `next` with `react` and `react-dom` like so:

```bash

npm install --save next react react-dom

```

This creates opportunity for you to use other React API implementations such as [Preact](https://github.com/zeit/next.js/tree/master/examples/using-preact). It also allows you to update React independently of Next.js.

### 9. Practical Examples of Backend Integrations

Many developers have been helping out in providing examples on how to integrate Next.js with several backend technologies.

* [Hapi Integration](https://github.com/zeit/next.js/blob/master/examples/custom-server-hapi)
* [Express Integration](https://github.com/zeit/next.js/blob/master/examples/custom-server-express)
* [Koa integration](https://github.com/zeit/next.js/blob/master/examples/custom-server-koa)

### 10. Availability of Learning Platforms

It's amazing to see that in a short time that Next.js has been in existence, lots of examples have been amassed and there is a learning platform that the Next.js team approves of. With the release of **Next.js 2**, we have:

* [About 48 examples of integrating Next.js with Apollo, Inferno, Preact](https://github.com/zeit/next.js/tree/master/examples) and ways of achieving different common functionalities with Next.js
* [learnnextjs.com](https://learnnextjs.com), built by [Arunoda Susiripala](https://twitter.com/arunoda)

![Learn Next.js](https://cdn.auth0.com/blog/next20/learnnextjs.png)
_learnnextjs.com Landing page_

![Logged In view](https://cdn.auth0.com/blog/next20/loggedinview.png)
_learnnextjs.com Logged in view_

Oh, the [UI](https://github.com/arunoda/coursebook-ui) and [Backend](https://github.com/arunoda/coursebook-server) for [learnnextjs.com](https://learnnextjs.com) is open-source. This presents another opportunity to learn **Next.js 2** by going through its source code. 

## Aside: Authenticating a Next.js 2.0 App with Auth0

**Auth0** issues [JSON Web Tokens](https://jwt.io/) on every login for your users. This means that you can have a solid [identity infrastructure](https://auth0.com/docs/identityproviders), including [single sign-on](https://auth0.com/docs/sso/single-sign-on), user management, support for social identity providers (Facebook, Github, Twitter, etc.), enterprise identity providers (Active Directory, LDAP, SAML, etc.) and your own database of users with just a few lines of code.

We can easily set up authentication in a **Next.js 2.0** apps by using the [Lock Widget](https://auth0.com/lock). If you don't already have an Auth0 account, [sign up](javascript:signup\(\)) for one now. Navigate to the Auth0 [management dashboard](https://manage.auth0.com/), click on `New client` by the right hand side, select Regular Web App from the dialog box and then go ahead to the `Settings` tab where the client ID, client Secret and Domain can be retreived.

**Note:** Make sure you set the  `Allowed Callback URLs` to `http://localhost:3000/` or whatever url/port you are running on. Also set the `Allowed Origins (CORS)` to `http://localhost:3000/` or whatever domain url you are using, especially if it is hosted.

Authentication in a Next.js app could be a little complicated because you have to ensure that the server-rendered pages are authenticated, meaning they need to have access to the token.

In the example below, the token returned from Auth0 is stored in LocalStorage and also as a cookie.

Check out the [completed app on Github](https://github.com/auth0-blog/next2-auth0).

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

export const extractInfoFromHash = () => {
  if (!process.browser) {
    return undefined
  }
  const {id_token, state} = getQueryParams()
  return {token: id_token, secret: state}
}

export const setToken = (token) => {
  if (!process.browser) {
    return
  }
  window.localStorage.setItem('token', token)
  window.localStorage.setItem('user', JSON.stringify(jwtDecode(token)))
  Cookie.set('jwt', token)
}

export const unsetToken = () => {
  if (!process.browser) {
    return
  }
  window.localStorage.removeItem('token')
  window.localStorage.removeItem('user')
  window.localStorage.removeItem('secret')
  Cookie.remove('jwt')

  window.localStorage.setItem('logout', Date.now())
}

export const getUserFromCookie = (req) => {
  if (!req.headers.cookie) {
    return undefined
  }
  const jwtCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith('jwt='))
  if (!jwtCookie) {
    return undefined
  }
  const jwt = jwtCookie.split('=')[1]
  return jwtDecode(jwt)
}

export const getUserFromLocalStorage = () => {
  const json = window.localStorage.user
  return json ? JSON.parse(json) : undefined
}

export const setSecret = (secret) => window.localStorage.setItem('secret', secret)

export const checkSecret = (secret) => window.localStorage.secret === secret

```

_utils/lock.js_

```js

import { setSecret } from './auth'

import uuid from 'uuid'

const getLock = (options) => {
  const config = require('../config.json')
  const Auth0Lock = require('auth0-lock').default
  return new Auth0Lock(config.AUTH0_CLIENT_ID, config.AUTH0_CLIENT_DOMAIN, options)
}

const getBaseUrl = () => `${window.location.protocol}//${window.location.host}`

const getOptions = (container) => {
  const secret = uuid.v4()
  setSecret(secret)
  return {
    container,
    closable: false,
    auth: {
      responseType: 'token',
      redirectUrl: `${getBaseUrl()}/auth/signed-in`,
      params: {
        scope: 'openid profile email',
        state: secret
      }
    }
  }
}

export const show = (container) => getLock(getOptions(container)).show()
export const logout = () => getLock().logout({ returnTo: getBaseUrl() })

```

_pages/auth/sign-in.js_

```js

import React from 'react'

import defaultPage from '../../hocs/defaultPage'
import { show } from '../../utils/lock'

const CONTAINER_ID = 'put-lock-here'

class SignIn extends React.Component {
  componentDidMount () {
    show(CONTAINER_ID)
  }
  render () {
    return <div id={CONTAINER_ID} />
  }
}

export default defaultPage(SignIn)

```

Display the login page once the sign-in component gets mounted.

![Sign in](https://cdn.auth0.com/blog/secret/sign-in.png)
_Sign-in page_

_pages/auth/signed-in.js_

```js

import React, { PropTypes } from 'react'

import { setToken, checkSecret, extractInfoFromHash } from '../../utils/auth'

export default class SignedIn extends React.Component {
  static propTypes = {
    url: PropTypes.object.isRequired
  }

  componentDidMount () {
    const {token, secret} = extractInfoFromHash()
    if (!checkSecret(secret) || !token) {
      console.error('Something happened with the Sign In request')
    }
    setToken(token)
    this.props.url.pushTo('/')
  }
  
  render () {
    return null
  }
}

```

Grab the token and secret from Auth0 as it returns to the callback which is the signed-in page, save it and redirect to the index page.

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

The [secret page](https://github.com/auth0-blog/next2-auth0/blob/master/pages/secret.js) too checks if the user is logged in and determines content based on the user's status.

![Secret page unauthorized](https://cdn.auth0.com/blog/secret/notloggedin.png)
_Not displaying valid content because the user cant access the secret page without signing in_

**Note:** Nextjs exposes virtually everything to the client. Secrets and environment variables are leaked to the frontend. So if you want to perform an API call and you need to validate a token based on a **secret**, then you will have to run a [custom express server](https://github.com/zeit/next.js/tree/master/examples/custom-server-express) so that your **secret** can be available only on the server. This also applies to other forms of operations that require loading some secret environment variables that the user of your app shouldn't have access to.


## Conclusion

With **Next.js 2**, the [Github repo](https://github.com/zeit/next.js/) now has over 11,000 stars and we have seen lots of significant improvements & major upgrades from the initial version that was released last year. Kudos to the team behind this lovely tool and the JavaScript community for their continuous support. In fact, they already have plans for **Next.js 3**. 

Try out **Next.js 2** and let me know what you think in the comments section!
