---
layout: post
title: Building a blog with GatsbyJS
description: <A SHORT DESCRIPTION OF THE POST <= 200 CHARACTERS >
longdescription: <A LONG DESCRIPTION OF THE POST BETWEEN 230 AND 320 CHARACTERS>
date: 2018-01-22 11:11
category: <FROM HERE: https://docs.google.com/spreadsheets/d/1e_RKzi8kVwzqPG8si8kyDOWPiBk9tI-XNGh0KgRIF7Q>
press_release: <true|false (FOR FALSE YOU COULD ALSO REMOVE THIS LINE)>
is_non-tech: <true|false (FOR FALSE YOU COULD ALSO REMOVE THIS LINE)>
author:
  name: <YOUR NAME>
  url: <YOUR URL>
  mail: <YOUR MAIL>
  avatar: <LINK TO PROFILE PIC>
design:
  bg_color: <A HEX BACKGROUND COLOR>
  image: <A PATH TO A 200x200 IMAGE>
tags:
- gatsby
- javascript
- react
- auth0
- metadata
- static
- cms
related:
- 2017-10-26-whats-new-in-react16
- 2017-12-14-elixir-and-phoenix-tutorial-build-an-authenticated-app
- 2017-12-28-symfony-tutorial-building-a-blog-part-1
---

**TL;DR:** A brief synopsis that includes link to a [github repo](http://www.github.com/).

# Gatsby blog with markdown

- tldr
- about gatsby (node/react/graphql/other features)
- prereq
- basic setup
- custom features like pagination/archives
- subscribe (with Auth0 auth)
- deploy

---

## About Gatsby

[Gatsby](https://www.gatsbyjs.org/) is a modern static content generator for [React](https://reactjs.org/) and it boasts an [impressive list](https://www.gatsbyjs.org/features/#legend) of out-the-box features. There are alternatives to Gatsby, like [Jekyll](https://jekyllrb.com/), [Hugo](https://gohugo.io/) and [Hexo](https://hexo.io/), [among others](https://www.staticgen.com/). Generally speaking there is one emerging for each preferable language stack. Traditionally, static site generators let you generate content for the web as HTML that can be cached, instead of compiling the HTML on request.

Before static site generators, a lot of us would have relied on software such as [Wordpress](https://wordpress.org/), [Drupal](https://www.drupal.org/) or services like [Squarespace](https://www.squarespace.com/) to allow us to both manage and deliver our content to the internet. Typically, they work by generating each page on-demand. They would get the content from a database and render it using a template engine. The problems can be reliability *AND* speed, everything you want from your website! If a developer introduced a bug in his wordpress plugin, you might encounter downtime or unexpected errors and for most sites this is completely unnecessary. A simple plugin update could introduce problems in security and performance.

A static site generator flips the entire process around. It generates all the pages on the site, once any changes have been made, ready for deployment. Static sites are secure by default as there are no working parts to exploit. Scaling is less of a consideration as there is no more overhead to a request than the delivery of already generated content. Read more about [static sites vs dynamic sites](https://www.webceo.com/blog/static-website-vs-dynamic-website-which-is-better-for-seo/) if you're still not convinced that static sites might just be the answer to [a lot of your problems](https://moz.com/learn/seo/page-speed).

## Another blog, with Gatsby

The [starter blog](https://github.com/gatsbyjs/gatsby-starter-blog) by [Kyle Mathews](https://twitter.com/kylemathews) is great! But I felt it was missing a few well known features you'd come to expect from a blog if you're familiar with [Wordpress](https://wordpress.org/) or similar blog frameworks.

In this guide we're going to use Gatsby to generate our content from [Markdown](https://en.wikipedia.org/wiki/Markdown) files along with pagination pages and allow our users to log in using [Auth0.js](https://auth0.com/docs/libraries/auth0js) and opt-in to updates when we publish new articles–we won't be actually sending emails though.

### React

Gatsby uses React for its ability to enable developers to build modular and reusable code. React has a large collection of open source components, guides and tools that are all relevant, as Gatsby acts close to a normal React application.

Newcomers to react can follow this [react for beginners](https://reactforbeginners.com/) guide to learn more.

### GraphQL

If a query language and an API had a baby, the result would be something like GraphQL. You can send GraphQL your query and it will return exactly the data you want, in the format you want, right out of your existing data.

Gatsby uses GraphQL for loading data into React components when it's needed. More importantly, it will handle many of your data transformation when generating the site, not when the pages are loaded.

If you're not familiar with it, you can look here to learn [how to use GraphQL](https://www.howtographql.com/).

## Pre-requisites for Gatsby

Gatsby requires `node`, `npm`, and features a handy command line tool for creating and running commands against your Gatsby sites.

### Node & NPM

To get started we're going to need `node` and `npm` installed. Lets check if they're installed by running:

```bash
node --version
```

```bash
npm --version
```

![Node versions for Gatsby](https://cdn.auth0.com/blog/gatsby-blog/node-versions-for-gatsby.png)

If you don’t have `node` and `npm` installed, check out [nodejs.org](https://nodejs.org/) and install the correct version for your operating system. 

### Gatsby CLI

So lets installed the gatsby CLI locally, then we can use it anywhere.

```bash
npm install --global gatsby-cli
```

## Create a basic Gatsby starter project

Now the CLI is installed, lets create a new project from the starter blog.

```bash
gatsby new auth0-gatsby-blog https://github.com/gatsbyjs/gatsby-starter-blog
```

This downloads all the files we need and initializes the site by running an `npm install` for us.

![Gatsby CLI building new project](https://cdn.auth0.com/blog/gatsby-blog/cli-building-new-gatsby-project.png)

```bash
cd auth0-gatsby-blog/
gatsby develop
```

Once it has compiled successfully, you can view the site at [localhost:8000](http://localhost:8000/).

![Gatsby development server first run](https://cdn.auth0.com/blog/gatsby-blog/gatsby-development-server-first-run.png)

And it should look *something* like this!

![Basic Gatsby install](https://cdn.auth0.com/blog/gatsby-blog/basic-gatsby-install.png)

## Enhancing our Gatsby blog

We're going to add some features to our blog that I've become accustomed to.

### Pagination

This helpful starter blog is just for starters. But like so many starter apps, it might not be immediately clear how to add a feature like pagination.

To build our pagination, we need to turn our starter blogs structure upside down. In our starter blog, we have the file `src/pages/index.js` which acts as our index page, which generates a list of all our blog content.

What we need to do is generate our index page based on constraints (like maximum articles per page) and every other page we might need, dynamically, based on how many articles we have.

So lets go ahead and just delete `src/pages/index.js` and see what it has done to our blog.

![Broken Gatsby homepage](https://cdn.auth0.com/blog/gatsby-blog/broken-gatsby-homepage.png)

[Constants (or `const`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) are new to [ES6 (ECMAScript 6)](https://codeburst.io/javascript-wtf-is-es6-es8-es-2017-ecmascript-dca859e4821c#9be0) and we're going to be using them in this guide.

They're block-scoped variables that can be either global or local to the block they were declared. Unlike traditional `var`'s they do not get attached to `window`. As they're constants, they cannot be reassigned. But, if you define one as a function, you can reuse the function with different values, but the workings of the function cannot be changed. **Handy!**  

[Lets (or `let`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) are also new to ES6, but we won't be using any in this guide. They are a block-scoped local variable that you intend to reassign.

Now, lets edit `gatsby-node.js` to start building our pagination, by adding a `const` for how many articles per page we want to display. Because our demo has 3 articles, make our page length `2`, giving us two pages.

```js
// gatsby-node.js
exports.createPages = ({ graphql, boundActionCreators }) => {
  ...
  const pageLength = 2;
  ...
})
```

We're going to need a function that takes a page index and creates us a path (with an optional prefix).

```js
// gatsby-node.js
exports.createPages = ({ graphql, boundActionCreators }) => {
  ...
  const pageToPath = (index, pathPrefix, maxPages) => {
    if (pathPrefix !== null) {
      pathPrefix = `/${pathPrefix}`
    } else {
      pathPrefix = ''
    }

    if (index === 1) {
      return `${pathPrefix}/`
    }

    if (index > 1 && index <= maxPages) {
      return `${pathPrefix}/${index}`
    }

    return ''
  };
  ...
})
```

We need one more function now, that will take a collection of articles (or "nodes") and create the paginated index pages. This could be a paginated list based on a category, a date or just all your articles.

```js
// gatsby-node.js
exports.createPages = ({ graphql, boundActionCreators }) => {
  ...
  const createPaginatedPages = ({
    edges,
    pathPrefix = null,
    component,
    context = {}
  }) => {
    const groupedPages = edges
      .map((edge, index) => {
        return index % pageLength === 0
          ? edges.slice(index, index + pageLength)
          : null
      })
      .filter(edge => edge);
    const maxPages = groupedPages.length;

    _.each(groupedPages, (group, index) => {
      const pageNumber = index + 1;

      return createPage({
        path: pageToPath(pageNumber, pathPrefix, maxPages),
        component: component,
        context: {
          group: group,
          nextPath: pageToPath(pageNumber - 1, pathPrefix, maxPages),
          prevPath: pageToPath(pageNumber + 1, pathPrefix, maxPages),
          extraContext: context
        }
      })
    })
  };
  ...
})
```

To recap, we have now created:
- a variable with our page length;
- a function to take a page number and return it's URL;
- a function that will take a collection of pages, create an index page and subsequent pages, each limited to our page length.

But at this very moment, we're still getting our 404. We need to use this code. Let's do it.

Create a new template file, `src/templates/index.js` and add the following content to it.

```js
// src/templates/index.js
import React from 'react';
import Link from 'gatsby-link'
import get from "lodash/get";
import Helmet from 'react-helmet'

import Bio from '../components/Bio'
import { rhythm } from '../utils/typography'

class IndexPage extends React.Component {
  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')
    const { data, pathContext } = this.props;
    const { group, nextPath, prevPath } = pathContext;

    return (
      <div>
        <Helmet title={siteTitle} />
        <Bio />
        {group.map(({ node }) => {
          const title = get(node, 'frontmatter.title') || node.fields.slug
          return (
            <div key={node.fields.slug}>
              <h3
                style={{
                  marginBottom: rhythm(1 / 4),
                }}
              >
                <Link style={{ boxShadow: 'none' }} to={node.fields.slug}>
                  {title}
                </Link>
              </h3>
              <small>{node.frontmatter.date}</small>
              <p dangerouslySetInnerHTML={{ __html: node.excerpt }} />
            </div>
          )
        })}
        <div>
          {prevPath.length > 0 &&
          <Link style={{ boxShadow: 'none' }} to={prevPath}>
            &lt; Older posts
          </Link>
          }
          {nextPath.length > 0 &&
          <Link style={{ boxShadow: 'none' }} to={prevPath}>
            Newer posts &gt;
          </Link>
          }
        </div>
      </div>
    )
  }
}

export default IndexPage;
```

If you still had our `src/pages/index.js` that we deleted earlier, you'll notice there are some similarities. Probably because I copy and pasted it, making the changes necessary. I'll talk you through the changes now.

The main difference between the original `src/pages/index.js` and our `src/templates/index.js` is that we don't need a `graphql` query to retrieve the articles for the page. Instead we're using the result of the data in our `gatsby-node.js` file to render to pages we need.

The other change is that we've now added our pagination below the articles. We've kept it simple and just passed a `previous` and `next` link into our template. Each paginated index we generate has the context of the previous and next pages in the list.

So we have our functions to generate our index pages and our template. Lets edit `gatsby-node.js` again and put it all together.

```js
// gatsby-node.js
...
exports.createPages = ({ graphql, boundActionCreators }) => {
  ...

  return new Promise((resolve, reject) => {
    const blogPost = path.resolve('./src/templates/blog-post.js');
    resolve(
      graphql(
      ...
      ).then(result => {
        ...
        // Create blog posts pages.
        const posts = result.data.allMarkdownRemark.edges;

        // Create main paginated index of posts.
        createPaginatedPages({
          edges: posts,
          component: path.resolve(`./src/templates/index.js`)
        });
        ...
      })
    )
  })
};
...
```

Gatsby uses a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) to contain the graphql request and subsequent handling of the result. This enables Gatsby to compile the site asynchronously and a Promise represents the eventual completion (or failure). 

We're adding our `createPaginatedPages` function to the Promise's result.

Let's see if it works, visit [localhost:8000](http://localhost:8000/).

![Paginated Gatsby page 1](https://cdn.auth0.com/blog/gatsby-blog/gatsby-paginated-page-1.png)

![Paginated Gatsby page 2 broken](https://cdn.auth0.com/blog/gatsby-blog/gatsby-paginated-page-2-broken.png)

Great, it works! But incase you missed it, there is clearly something wrong on page two. In our layout file, we have a condition around the default `<h1>` that turns it into a `<h3>` if we're not on the absolute homepage. Let's modify the styling on the `<h3>` to fix this little issue. This is a great opportunity for you to put your own stamp on your site.

Here's my fix, edit `src/layouts/index.js` and remove the following line.

```diff
// src/layouts/index.js
             fontFamily: 'Montserrat, sans-serif',
             marginTop: 0,
-            marginBottom: rhythm(-1),
```

![Paginated Gatsby page 2 fixed](https://cdn.auth0.com/blog/gatsby-blog/gatsby-paginated-page-2-fixed.png)

## Gatsby and Auth0

When you have a blog, you'll probably have readers (you hope) and you'll also want to let them know when you create a new post.

For this we're going to use [Auth0](https://auth0.com) to identify our users so they can turn email notifications on and off. This will show how Auth0 can store [metadata](https://auth0.com/docs/metadata) on users that isn't otherwise provided by your identity providers.

We're also going to be following the [Auth0 React Quickstart](https://auth0.com/docs/quickstart/spa/react) to get set up with Auth0 authentication on our new application. If you're confident with React you could skip straight to the quickstart or get the code you need from the [Auth0 React samples repository](https://github.com/auth0-samples/auth0-react-samples/tree/embedded-login).

The [Auth0 login page](https://auth0.com/docs/hosted-pages/login) is the easiest way to set up authentication in your application.

When a user logs in, Auth0 returns three items:
- `access_token`: to learn more, see the [access token documentation](https://auth0.com/docs/tokens/access-token)
- `id_token`: to learn more, see the [ID token documentation](https://auth0.com/docs/tokens/id-token)
- `expires_in`: the number of seconds before the access token expires

You can use these items in your application to set up and manage authentication.

### Sign Up for Auth0

You'll need an [Auth0](https://auth0.com) account to manage authentication. You can <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">sign up for a free Auth0 account here</a>. Next, set up an Auth0 Client so Auth0 can interface with your app.

### Set Up a Client App

1. Go to your [**Auth0 Dashboard**](https://manage.auth0.com/#/) and click the "[create a new client](https://manage.auth0.com/#/clients/create)" button. 
2. Name your new app, select "Single Page Web Applications", and click the "Create" button. 
3. In the **Settings** for your new Auth0 client app, add `http://localhost:8000/callback` to the **Allowed Callback URLs**.
4. Click the "Save Changes" button.
5. If you'd like, you can [set up some social connections](https://manage.auth0.com/#/connections/social). You can then enable them for your app in the **Client** options under the **Connections** tab. The example shown in the screenshot above utilizes username/password database, Facebook, Google, and Twitter.

> **Note:** Under the **OAuth** tab of **Advanced Settings** (at the bottom of the **Settings** section) you should see that the **JsonWebToken Signature Algorithm** is set to `RS256`. This is  the default for new clients. If it is set to `HS256`, please change it to `RS256`. You can [read more about RS256 vs. HS256 JWT signing algorithms here](https://community.auth0.com/questions/6942/jwt-signing-algorithms-rs256-vs-hs256).

### Install auth0.js

You need the auth0.js library to integrate Auth0 into your application.

Install auth0.js using npm.

```bash
npm install --save auth0-js
```

### Create the Auth component

We'll need a new React component to manage and coordinate user authentication. 

#### Basic component

Create a new file `src/components/Auth.js` and inside it put the following code:

```js
// src/components/Auth.js

import auth0 from 'auth0-js';

export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: 'blog-posts.eu.auth0.com',
    clientID: 'xNgxPa24lqJ37iiJyuldLk8G1aROE9b4',
    redirectUri: 'http://localhost:8000/callback',
    audience: 'https://blog-posts.eu.auth0.com/userinfo',
    responseType: 'token id_token',
    scope: 'openid'
  });

  login() {
    this.auth0.authorize();
  }
}
```

#### Test our component

Quickly, test that we can load our new component from any part of the app. To quickly do this we'll add the following code to our `src/templates/index.js` file.

```js
// src/templates/index.js
...
import { rhythm } from '../utils/typography'

// Add this to test we can load our Auth component
import Auth from '../components/Auth.js';
const auth = new Auth();
auth.login();

class IndexPage extends React.Component {
...
```

When you visit [localhost:8000](http://localhost:8000/) now, we'll be redirected to our login page. **Logging in won't work!** We haven't built our callback yet. But at least we know our library is loading just fine. 

![Gatsby Blog Auth0 login box](/Users/olaf/Desktop/gatsby-blog-auth0-login-box.png)

Now go ahead and remove the test code from `src/templates/index.js`.

#### Finish the component

We need a few more methods in the `Auth` component to handle authentication in the app. So add the following code to `src/component/Auth.js`:

```js
// src/component/Auth.js

import history from './history';

// ...
export default class Auth {
  // ...
  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        history.replace('/');
      } else if (err) {
        history.replace('/');
        console.log(err);
      }
    });
  }

  setSession(authResult) {
    // Set the time that the access token will expire at
    let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    // navigate to the home route
    history.replace('/');
  }

  logout() {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    // navigate to the home route
    history.replace('/');
  }

  isAuthenticated() {
    // Check whether the current time is past the 
    // access token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }
}
```

Now create a new file `src/components/history.js` so we can easily manage session history.

```js
// src/components/history.js

import createHistory from 'history/createBrowserHistory'

export default createHistory()
```

REACT QUICKSTART