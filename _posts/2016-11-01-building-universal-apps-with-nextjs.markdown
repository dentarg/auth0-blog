---
layout: post
title: "Build a Universal JavaScript App with Next.js"
description: Learn how to build Universal JavaScript apps with the new and shiny Next.js framework
date: 2016-11-01 08:30
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
- 2016-08-17-creating-your-first-app-with-adonisj-and-adding-authentication
- 2016-09-29-angular-2-authentication
- 2016-10-05-build-your-first-app-with-polymer-and-web-components
---

---

**TL;DR:** In the JavaScript land, there are a plethora of libraries and frameworks. And new libraries and frameworks keep showing up almost every other week. On Tuesday, October 25 2016, a small JavaScript framework, **Next.js** was released to the public. It's a minimal framework for building server-rendered universal JavaScript web apps. In this article, I'll walk you through how to create a universal JavaScript web app with **Next.js**.

---

## What is a Universal JavaScript Application?

Every now and then, buzzwords pop up in the programming world and sometimes developers don't have a full grasp of these words. What is a Universal JavaScript app? What does the term *Universal* mean in this context?

The term *Universal* simply means the ability to run the same code on the server, browsers, mobile devices and any other platform. *Universal Javascript* is a term people are leaning towards these days. A lot of developers still call it **Isomorphic JavaScript**. In short, there is a debate on the [React repo](https://github.com/facebook/react/pull/4041) about this term. Michael Jackson, a popular ReactJS developer wrote a blog post on [Universal JavaScript](https://medium.com/@mjackson/universal-javascript-4761051b7ae9#.ij2c0zh8j). It's indeed true that *naming things* is one of the most difficult aspects of Computer Science.

## Enter Next.js

**[Next.js](https://github.com/zeit/next.js/)** is a small framework that is built on top of React, Webpack and Babel. It was built to enable easy creation of server-rendered React applications. **Next.js** saves you time and effort because it ships with features out of the box that caters for server-rendering of JavaScript applications. These features include the following:

* Hot code reloading
* Automatic transpilation and bundling(using babel & webpack)
* Server rendering and indexing of JavaScript files in the `/pages` directory
* Serving of static files
* CSS isolation and modularization

**Next.js** makes good use of already written and well-tested modules from the JavaScript community. With **Next.js**, every component inside the **pages/** directory gets server-rendered automatically and their scripts inlined. Wow! is it that easy? Yes!!!

We'll be building a simple character-listing app with **Next.js 1.0.2**, just like we did with [Laravel](https://auth0.com/blog/creating-your-first-laravel-app-and-adding-authentication/).

## Our App: NexThrone

![NexThrone App](https://cdn.auth0.com/blog/nexthrone.png)

We are building a very simple app today, it is called **NexThrone**. The NexThrone app displays a list of Game of Thrones' characters. It also provides a detailed information about each character when clicked upon. We'll see how **Next.js** makes it so easy for us to build this server-rendered JavaScript web application. **Next.js** does the heavy-lifting for us, while we focus on the application's core functionality! The full source code for the completed app can be [cloned at this GitHub repo](https://github.com/auth0-blog/nextjs-got).

## Setup and Installation

The official [Next.js](https://github.com/zeit/next.js) documentation uses *npm*. We'll use [Yarn](https://github.com/yarnpkg/yarn), just because it's faster and more effective. You haven't tried Yarn before? check out [5 things you can do with Yarn here](https://auth0.com/blog/five-things-you-can-do-with-yarn/).

Let's get started!

Create a new directory, cd into the directory and run this command below:

```bash
yarn init
```

![Yarn Init](https://cdn.auth0.com/blog/yarnInit.png)
_Creating a package.json file_

Follow the instructions, also ensure that a `package.json` file was created in the end. Now, go ahead and install **Next.js** like so:

```bash
yarn add next
```

![Yarn next](https://cdn.auth0.com/blog/yarnNext.png)
_Installing Next.js with Yarn_

Once `next.js` has finished installing, open up your `package.json` file and add a script to it like so:

```js

{
  "scripts": {
    "dev": "next"
  }
}
```

![Add Script to package.json](https://cdn.auth0.com/blog/nextConfig.png)
_Add Script to package.json_

Go ahead and create a `pages` directory within the project. Add an `index.js` file to the `pages` directory like so:

```js

import React from 'react'
export default () => <div> Hello World!</div>
```

Now, run `yarn run dev` and go to http://localhost:3000. Your homepage should look like so:

![Hello World](https://cdn.auth0.com/blog/helloWorld.png)
_Homepage_

![Yarn run dev](https://cdn.auth0.com/blog/yarnRun.png)
_Run Next_

## Setting up Seed Data

We are dealing with the game of thrones' characters. So, we need their stage names, real names, bio and their avatars. Let's set up a file that contains such data.

Create a new `data` directory in your root folder, then add a `posts.js` file to it.

Open up the `posts.js` file and add this code to it like so:

_data/posts.js_

```js

const posts = [
   {
      "codeName":"Jon Snow",
      "realName":"Kit Harington",
      "id":"1161022966406956503",
      "display_src":"http://vignette4.wikia.nocookie.net/gameofthrones/images/5/56/Jon_Kill_the_Boy.jpg/revision/latest?cb=20150508120833",
      "story": "Ned Stark's bastard son, Jon joined the Night's Watch. On a mission for Lord Commander Mormont, Jon infiltrated the wildlings by pretending to forsake his Night Watch brothers. In doing so, he fell in love with Ygritte, a wildling woman"
   },
   {
      "codeName":"Arya Stark",
      "realName":"Maisie Williams",
      "id":"1160844458347054781",
      "display_src":"http://vignette1.wikia.nocookie.net/gameofthrones/images/e/e9/Arya_Stark_4.jpg/revision/latest?cb=20140428152515",
      "story": "The younger of the Stark daughters, Arya has put her survival skills to use as she continues to evade the Lannister forces that seek her. En route to the Twins in search of her mother and brother, she arrived at the castle after the Red Wedding."
   },
   {
      "codeName":"Melisandre",
      "realName":"Carice van Houten",
      "id":"1154606670337393752",
      "display_src":"http://vignette2.wikia.nocookie.net/gameofthrones/images/7/7c/Melisandre_The_Dance_of_Dragons.jpg/revision/latest?cb=20150604204859",
      "story": "A Red priestess from Asshai, Melisandre worships the Lord of Light. Her visions have told her that Stannis is the true king and as his advisor, she has encouraged him to pursue the throne at all costs"
   },
   {
      "codeName":"Tyrion Lannister",
      "realName":"Peter Dinklage",
      "id":"1157179863266871229",
      "display_src":"http://vignette1.wikia.nocookie.net/gameofthrones/images/6/61/The_children_Tyrion_with_Bow_S4.png/revision/latest?cb=20140616190514",
      "story": "What Tyrion lacks in size and strength, he makes up for in mental acuity. Former Hand of the King in his father's absence, he now serves as Master of Coin on the Small Council."
   },
   {
      "codeName":"Ramsay Bolton",
      "realName":"Iwan Rheon",
      "id":"1126293663140399053",
      "display_src":"http://i.lv3.hbo.com/assets/images/series/game-of-thrones/character/s5/ramsay-1920.jpg",
      "story": "A bastard son of Roose Bolton, Ramsay's bloodlust is even stronger than his father's. After taking Winterfell, he captured Theon Greyjoy and slowly tortured him into submission."
   },
   {
      "codeName":"Petyr Baelish",
      "realName":"Aidan Gillen",
      "id":"1117418173361145365",
      "display_src":"http://vignette3.wikia.nocookie.net/gameofthrones/images/f/f8/Book_of_the_Stranger_05.jpg/revision/latest?cb=20160512165329",
      "story": "Nakedly ambitious, Littlefinger left the Small Council to marry Lysa Arryn and secure the Vale to the Lannister's side. Beyond his official duties, he is the eyes and ears of King's Landing along with Varys."
   },
   {
      "codeName":"Brienne of Tarth",
      "realName":"Gwendoline Christie",
      "id":"1162418651480049646",
      "display_src":"http://vignette2.wikia.nocookie.net/gameofthrones/images/8/89/Brienne_Mother's_Mercy.jpg/revision/latest?cb=20150617011915",
      "story": "Brienne is a highborn lady who would rather be a knight. As Catelyn Stark's envoy, she escorted Jaime Lannister back to Kings Landing. The two fighters developed a mutual respect for each other during their journey."
   },
   {
      "codeName":"Lord Varys",
      "realName":"Conleth Hill",
      "id":"1152964002473690553",
      "display_src":"https://pbs.twimg.com/profile_images/3542727378/d0599ead6fda6e428c5dbf106e7161fa.jpeg",
      "story": "A eunuch and a member of the Small Council, Varys is also a master of disguise. Along with Littlefinger, he is always aware of what goes on in Court."
   },
   {
      "codeName":"Daenerys Targaryen",
      "realName":"Emilia Clarke",
      "id":"1150824171912152320",
      "display_src":"http://i.lv3.hbo.com/assets/images/series/game-of-thrones/character/s5/daenarys-1024.jpg",
      "story": "Princess of House Targaryen, Daenerys lives in exile in Essos with her advisors and dragons. Dany rallied the Unsullied of Astapor to her cause and continues to grow the army she needs to take back the throne."
   }
];

export default posts;
```

## Setting up the Index Page

We have an index page that displays *Hello World* to the screen. Let's change that! The index page should display a list of game of thrones' characters.

Open up your `index.js` file and this code to it like so:

_pages/index.js_

```js

import React from 'react'
import posts from '../data/posts'
import { style } from 'next/css'
import Link from 'next/link'

export default class extends React.Component {
  static getInitialProps () {
    return { posts: posts }
  }

  render () {
    return (
      <div>
      <div className={style(styles.header)}>
        <h3> NEXTHRONE - THE REVELATION OF GAME OF THRONES' CHARACTERS </h3>
      </div>
      <table className={style(styles.table)}>
        <thead>
          <tr>
              <th className={style(styles.th)}>Character</th>
              <th className={style(styles.th)}>Real Name</th>
          </tr>
        </thead>
        <tbody>
          {
              this.props.posts.map( (post, i) => (
                  <tr key={i}>
                      <td className={style(styles.td)}>{ post.codeName }</td>
                      <td className={style(styles.td)}>
                        <Link href={`/account?id=${post.id}`}>{ post.realName }</Link>
                      </td>
                  </tr>
              ))
          }
       </tbody>
      </table>
      </div>
    )
  }
}

const styles = {
  th: {
    background: '#00cccc',
    color: '#fff',
    textTransform: 'uppercase',
    fontSize: '12px',
    padding: '12px 35px',
  },

  header: {
    font: '15px Monaco',
    textAlign: 'center'
  },

  table: {
    fontFamily: 'Arial',
    margin: '25px auto',
    borderCollapse: 'collapse',
    border: '1px solid #eee',
    borderBottom: '2px solid #00cccc'
  },

  td: {
    color: '#999',
    border: '1px solid #eee',
    padding: '12px 35px',
    borderCollapse: 'collapse'
  },

  list: {
    padding: '50px',
    textAlign: 'center'
  },

  photo: {
    display: 'inline-block'
  },

  photoLink: {
    color: '#333',
    verticalAlign: 'middle',
    cursor: 'pointer',
    background: '#eee',
    display: 'inline-block',
    width: '250px',
    height: '250px',
    lineHeight: '250px',
    margin: '10px',
    border: '2px solid transparent',
    ':hover': {
      borderColor: 'blue'
    }
  }
}
```

Our Index page should look like this below:

![Index Page of NexThrone](https://cdn.auth0.com/blog/nexthrone.png)
_NexThrone Index Page_

This is basically React code but there are some new imports from the `next` framework. Every route within **Next.js** is simply an ES6 module that exports a function or class that extends from React.Component. In `getInitialProps`, we are returning the posts array from the `posts.js` we created earlier as a `prop`.

We know that the React `render` method actually does the UI rendering. Within the `render` method, we looped through the posts `prop` to display the characters in a table.

The awesome thing about **Next.js** is that it automatically maps a `.js` file within the `pages` directory to a route. So basically,

* `pages/index.js` maps to `/`
* `pages/about.js` maps to `/about`
* `pages/account.js` maps to `/account`

Now, we have a `styles` object in this file. **Next.js** provides us with a `style` function that we can use to select style properties and apply to DOM elements as shown in the example above. **Next.js** leverages the [glamor](https://github.com/threepointone/glamor) library for the CSS-in-JS pattern. Another way of using CSS inside the JSX file with *next.js* is by importing the `css` function from `next/css` like so:

```js
import React from 'react'
import css from 'next/css'

export default () => <p className={style}>Hello World!</p>

const style = css({
  color: 'blue'
})
```

Finally, we have a `<Link>` component. We used the `Link` component that *next.js* provides. This enables client-side transitions between routes. The `Link` component grabs the post id and  links to an account route when clicked. Next, let's create the account route to be able to accept the id and render the appropriate content.

## Setting up the Account Page

Create a new file `account.js` inside the `pages` directory and add this code to it like so:

_pages/account.js_

```js

import React from 'react'
import posts from '../data/posts'
import { style } from 'next/css'
import * as  _ from 'lodash'

export default ({ url: { query: { id } } }) => {
  const item =  _.find(posts, { id: id })

  return (
    <div className={style(styles.main)}>
      <div className={style(styles.header)}>
        <h3> NEXTHRONE - THE REVELATION OF GAME OF THRONES' CHARACTERS </h3>
      </div>
      <div className={style(styles.panel)}>
        <h1 className={style(styles.heading)}>
          Character: { item.codeName }
          <br/>
          <br/>
          Real Name: { item.realName }
          <br/>
          <br/>
          Brief Description:
          <br/>
          <br/>
          <span> { item.story } </span>
        </h1>
      </div>

      <div className={style(styles.singlePhoto)}>
        <img src={ item.display_src} alt={item.realName} width={500} height={500} />
      </div>
    </div>
  )
}


const styles = {
  main: {
    padding: '50px'
  },

  header: {
    font: '15px Monaco',
    textAlign: 'center'
  },

  panel: {
    float: 'right',
    marginRight: '140px',
    width: '300px'
  },

  singlePhoto: {
    border: '1px solid #999',
    width: '500px',
    height: '500px',
    float: 'left'
  },

  heading: {
    font: '15px Monaco'
  }
}
```

Go ahead and install [lodash](https://github.com/lodash/lodash). With the help of lodash, we can traverse the posts array to find the other properties of an object based on the `id` it receives from the query. This code  `export default ({ url: { query: { id } } })` grabs the value of `id` that is part of a url query. For example `https://auth0.com/learn?id=javascript` will return `javascript`. So, in our code above, it gets the `id` from the url, uses lodash to get the object properties based on the id, then assign them to the `item` variable. With that, we can now output the `realName`, `codeName`, `story` and `display_src` on the screen like we did above!

Now, when we click on a character from the index page, we should be redirected to an account page that shows the full info of the character like so:

![NexThrone-annotated](https://cdn.auth0.com/blog/nexthrone-annotated.png)
_Clicking on Index Page_

![Arya Stark Account Page](https://cdn.auth0.com/blog/aryastark.png)
_Arya Stark Account Page_

![Mellisandre Account Page](https://cdn.auth0.com/blog/mellisandre.png)
_Mellisandre Account Page_

It's that simple. Now, we have a fully functional server-rendered universal JavaScript web application.

## Custom Config and Error Handling

![404 Error](https://cdn.auth0.com/blog/404.png)
_Next.js 404 Error Page_

![500 Error](https://cdn.auth0.com/blog/500.png)
_Next.js 500 Error Page_

Sometimes you might need a more advanced routing than the option that **Next.js** provides, *Next.js* still allows you to intercept the request and do whatever you want. Check [here](https://github.com/zeit/next.js/issues/25) for comprehensive info on how to achieve that.

**Next.js** has a default component, *_error.js* that handles 404 and 500 errors on both client and server side. You can override it like so:

```js

import React from 'react'

export default class Error extends React.Component {
  static getInitialProps ({ res, xhr }) {
    const errorCode = res ? res.statusCode : xhr.status
    return { errorCode }
  }

  render () {
    return (
      <p>An error { this.props.errorCode } just occurred</p>
    )
  }
}
```

## Hosting | Deploying to Production

For Heroku lovers, there is a nice [build adapter here](https://github.com/mars/heroku-nextjs) that helps deploy your **Next.js** apps to Heroku.

The creators of **Next.js** also have a tool, [now](https://zeit.co/now) that you can deploy your app with. Check out the instructions on how to deploy [here](https://github.com/zeit/next.js#productiondeployment).

## Aside: Authenticating a Next.js App with Auth0

**Auth0** issues [JSON Web Tokens](https://jwt.io/) on every login for your users. This means that you can have a solid [identity infrastructure](https://auth0.com/docs/identityproviders), including [single sign-on](https://auth0.com/docs/sso/single-sign-on), user management, support for social identity providers (Facebook, Github, Twitter, etc.), enterprise identity providers (Active Directory, LDAP, SAML, etc.) and your own database of users with just a few lines of code.

We can easily set up authentication in our **Next.js** apps by using the [Lock Widget](https://auth0.com/lock). If you don't already have an Auth0 account, [sign up](javascript:signup\(\)) for one now. Navigate to the Auth0 [management dashboard](https://manage.auth0.com/), click on `New client` by the right hand side, select Regular Web App from the dialog box and then go ahead to the `Settings` tab where the client ID, client Secret and Domain can be retreived.

**Note:** Make sure you set the  `Allowed Callback URLs` to `http://localhost:3000/` or whatever url/port you are running on. Also set the `Allowed Origins (CORS)` to `http://localhost:3000/` or whatever domain url you are using, especially if it is hosted.

### Step 1

Open up `utils/AuthService.js` and modify the code to look like this below:

_utils/AuthService.js_

```js
import React from 'react'

export default class AuthService {
  constructor(clientId, domain) {
    // Configure Auth0
    this.clientId = clientId
    this.domain = domain

    this.lock = new Auth0Lock(clientId, domain, {})
    // Add callback for lock `authenticated` event
    this.lock.on('authenticated', this._doAuthentication.bind(this))
    // binds login functions to keep this context
    this.login = this.login.bind(this)
  }

  _doAuthentication(authResult){
    // Saves the user token
    this.setToken(authResult.idToken)
  }

  getLock() {
    // An instance of Lock
    return new Auth0Lock(this.clientId, this.domain, {});
  }

  login() {
    // Call the show method to display the widget.
    this.lock.show()
  }

  loggedIn(){
    // Checks if there is a saved token and it's still valid
    return !!this.getToken()
  }

  setToken(idToken){
    // Saves user token to localStorage
    localStorage.setItem('id_token', idToken)
  }

  getToken(){
    // Retrieves the user token from localStorage
    return localStorage.getItem('id_token')
  }

  logout(){
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token');
  }
}
```

### Step 2

Open up `pages/index.js` and modify the code to look like so:

_pages/index.js_

```js
import React from 'react'
import posts from '../data/posts'
import { style } from 'next/css'
import Link from 'next/link'
import AuthService from '../utils/AuthService'

export default class extends React.Component {
  static getInitialProps ({ req, res}) {
    return { posts: posts }
  }

  constructor(props) {
    super(props)
    this.state = { loggedIn: false }
  }

  componentDidMount() {
    this.auth = new AuthService('_AUTH0_CLIENT_ID_', '_AUTH0_DOMAIN_');
    this.setState({ loggedIn: this.auth.loggedIn() })
    // instance of Lock
    this.lock = this.auth.getLock();
    this.lock.on('authenticated', () => {
      this.setState({ loggedIn: this.auth.loggedIn() })
    });
  }

  login() {
    this.auth.login();
  }

  render() {

   const loginButton = this.state.loggedIn ? <div>HELLO</div> : <button onClick={this.login.bind(this)}>Login</button>;

    return (
      <div>
      <div className={style(styles.header)}>
        <script src="https://cdn.auth0.com/js/lock/10.5/lock.min.js"></script>
        { loginButton }
        <h3> NEXTHRONE - THE REVELATION OF GAME OF THRONES' CHARACTERS </h3>
      </div>
      <table className={style(styles.table)}>
        <thead>
          <tr>
              <th className={style(styles.th)}>Character</th>
              <th className={style(styles.th)}>Real Name</th>
          </tr>
        </thead>
        <tbody>
          {
              this.props.posts.map( (post, i) => (
                  <tr key={i}>
                      <td className={style(styles.td)}>{ post.codeName }</td>
                      <td className={style(styles.td)}>
                        { this.state.loggedIn ? <Link href={`/account?id=${post.id}`}>{ post.realName }</Link> : <div>You need to login</div> }
                      </td>
                  </tr>
              ))
          }
       </tbody>
      </table>
      </div>
    )
  }
}

const styles = {
  th: {
    background: '#00cccc',
    color: '#fff',
    textTransform: 'uppercase',
    fontSize: '12px',
    padding: '12px 35px',
  },

  header: {
    font: '15px Monaco',
    textAlign: 'center'
  },

  table: {
    fontFamily: 'Arial',
    margin: '25px auto',
    borderCollapse: 'collapse',
    border: '1px solid #eee',
    borderBottom: '2px solid #00cccc'
  },

  td: {
    color: '#999',
    border: '1px solid #eee',
    padding: '12px 35px',
    borderCollapse: 'collapse'
  },

  list: {
    padding: '50px',
    textAlign: 'center'
  },

  photo: {
    display: 'inline-block'
  },

  photoLink: {
    color: '#333',
    verticalAlign: 'middle',
    cursor: 'pointer',
    background: '#eee',
    display: 'inline-block',
    width: '250px',
    height: '250px',
    lineHeight: '250px',
    margin: '10px',
    border: '2px solid transparent',
    ':hover': {
      borderColor: 'blue'
    }
  }
}
```

Replace `_AUTH0_CLIENT_ID_` and `_AUTH0_DOMAIN_` with the values from your [dashboard](https://manage.auth0.com/#/applications). We created a state called `loggedIn` and instantiated the AuthService in `componentDidMount`. Now Auth0Lock is not isomorphic, so we need to load the lock script from the cdn to make it available in our component within the render method. Based on the state of `loggedIn`, you will have the ability to have access to the link that redirects to the account or not!

Now, run the app, the login button should appear at the top like so:

![NexThrone Index](https://cdn.auth0.com/blog/nexthrone-login.png)
_NexThrone Index Non-loggedIn Status_

User clicks on the login button and the Auth0 Lock displays like so:

![NexThrone Auth0 Lock Widget](https://cdn.auth0.com/blog/nexthrone-auth0lock.png)
_NexThrone Auth0 Lock Widget_

Once you log in successfully, you will now have access to the links like so:

![NexThrone Logged-in Status](https://cdn.auth0.com/blog/nexthrone-loggedin.png)
_NexThrone Logged-in Status_

Now you are logged-in and the `id-token` is present in the localStorage. You can now click on the link to have access to the account page.

### Step 3

We need to restrict access to the account page if the user is not logged-in. If the `id_token` doesn't exist, then it means the user has been logged out. So open up your `pages/account.js` and modify the code like so:

_pages/account.js_

```js
import React from 'react'
import posts from '../data/posts'
import { style } from 'next/css'
import * as  _ from 'lodash'
import AuthService from '../utils/AuthService'

export default class extends React.Component {

  componentDidMount() {
    this.auth = new AuthService('_AUTH0_CLIENT_ID_', '_AUTH0_DOMAIN_');
    if (!this.auth.loggedIn()) {
      this.props.url.replaceTo('/')
    }
  }

  render () {
    const item =  _.find(posts, { id: this.props.url.query.id })

    return (
      <div className={style(styles.main)}>
        <script src="https://cdn.auth0.com/js/lock/10.5/lock.min.js"></script>
        <div className={style(styles.header)}>
          <h3> NEXTHRONE - THE REVELATION OF GAME OF THRONES' CHARACTERS </h3>
        </div>
        <div className={style(styles.panel)}>
          <h1 className={style(styles.heading)}>
            Character: { item.codeName }
            <br/>
            <br/>
            Real Name: { item.realName }
            <br/>
            <br/>
            Brief Description:
            <br/>
            <br/>
            <span> { item.story } </span>
          </h1>
        </div>

        <div className={style(styles.singlePhoto)}>
          <img src={ item.display_src} alt={item.realName} width={500} height={500} />
        </div>
      </div>
    )
  }
}


const styles = {
  main: {
    padding: '50px'
  },

  header: {
    font: '15px Monaco',
    textAlign: 'center'
  },

  panel: {
    float: 'right',
    marginRight: '140px',
    width: '300px'
  },

  singlePhoto: {
    border: '1px solid #999',
    width: '500px',
    height: '500px',
    float: 'left'
  },

  heading: {
    font: '15px Monaco'
  }
}
```

In the `componentDidMount`, we just simply check if the user is logged in or not. If the user is not logged in, then the user will be redirected to the index page to log in.

**Note:** If you have an API for your application, the API should _always_ be secured. The [`id_token` should not be used to secure an API](https://auth0.com/blog/why-should-use-accesstokens-to-secure-an-api); instead use an `access_token` with the appropriate configuration. You can read about how to [implement API authentication with Auth0](https://auth0.com/docs/apis) with [implicit grant](https://auth0.com/docs/api-auth/tutorials/implicit-grant).


The source code for the authentication part of the NexThrone app can be found on the [adding-auth branch here](https://github.com/auth0-blog/nextjs-got/tree/adding-auth)

You can also check out [Luis Rudge's](https://github.com/luisrudge) sample app that shows how to [integrate Next.js with Auth0 here](https://github.com/luisrudge/next.js-auth0)


## Conclusion

With **Next.js**, we have been able to implement a Universal JavaScript web app in a very short time without overthinking the whole process. I'm optimistic that this young framework will grow very quickly and provide lots of options and configurations that will make building Universal JavaScript apps a breeze.

Have you used **Next.js** ? What are your thoughts about it? Please let me know in the comments section!
