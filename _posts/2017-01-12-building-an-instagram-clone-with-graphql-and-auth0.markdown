---
layout: post
title: "Building An Instagram Clone With GraphQL and Auth0"
description: "Learn how authentication and authorization works with GraphQL and Auth0 by building an Instagram clone."
date: 2017-01-12 08:30
category: Technical Guide, Data, GraphQL
author:
  name: "Nilan Marktanner"
  url: "https://twitter.com/_marktani"
  mail: "nilan@graph.cool"
  avatar: "https://cdn.auth0.com/blog/graphworker/nilan.png"
design:
  image: https://cdn.auth0.com/blog/graphcool/logo.png
  bg_color: "#103E24"
tags:
- frameworks
- graphql
- instagram
- authentication 
- authorization
related:
- building-and-authenticating-nodejs-apps
- building-universal-apps-with-nextjs
- xamarin-authentication-and-cross-platform-app-development
---

## Introduction to GraphQL

GraphQL is a query language for APIs created by Facebook that offers declarative data fetching in the client and is already used by companies such as Coursera and GitHub.

A GraphQL server exposes a schema that describes its API including queries (to fetch data) and mutations (to modify data).

This allows clients to specify their data requirements with queries and send it to one GraphQL endpoint, instead of collecting information from multiple endpoints as is typical with REST. While queries are a very easy and quick way for clients to get exactly the data they need in one request, the GraphQL server has to parse and validate the query, check which fields are included and return the underlying data from the database.

The type-safe schema unlocks new possibilities for tooling, as demonstrated by GraphiQL which is maintained by Facebook. With features like auto completion (as shown in the gif) and an included documentation it offers a great developer experience.

![Autocompletion]()
_Autocompletion_

Let's learn more about GraphQL queries and mutations by building an Instagram clone.

## Building An Instagram Clone

![Youtube video](https://www.youtube.com/watch?v=5uxq8Om-AZQ)
_User Authentication with Auth0 for React and Apollo_

We want to build an application that displays a feed of posts with an appropriate image and description. Everyone should be able to see these posts, but to prevent spam we only allow registered users to create new ones. We also send occasional email updates to subscribed users.

A simple type schema for our application might look like this:

```js

type User {
  id: String!
  email: String
  emailSubscription: Boolean
  name: String
  posts: [Post]
}

type Post {
  id: String!
  description: String
  imageUrl: String
  author: User
}

```

We have a *User* object type that consists of the fields *emailSubscription* of type Boolean, *email* and *name* of type String, and *posts* of list type Post (denoted by [Post]). The *Post* object type consists of a *description* and an *imageUrl* field of type String and an *author* field of type User.

Additionally, both object types have the *id* field which is a required String (denoted by String!).

These types are then used by our GraphQL server to expose different queries and mutations in its GraphQL schema. Typically, you will see queries to fetch a specific node (single data items) and queries to fetch multiple or even all nodes of a certain type. For mutations, there are usually those for creating, updating and deleting a node of a certain type.

In our case, one available query is *allPosts* which we already saw above:

```js

query {
  allPosts {
    description
    imageUrl
  }
}

```

When we send this query as a HTTP request to our GraphQL server, we get a JSON response with the same structure as the query:

```js

{
  "data": {
    "allPosts": [
      {
        "description": "#Auth0",
        "imageUrl": "https://styleguide.auth0.com/lib/logos/img/logo-blue.png"
      },
      {
        "description": "#GraphQL",
        "imageUrl": "https://raw.githubusercontent.com/facebook/graphql/master/resources/GraphQL%20Logo.png"
      }
    ]
  }
}

```

In our frontend application, we can then use the *allPosts* array in the response to display the posts.

With GraphQL queries, we can choose exactly what information we are interested in. For example, if we also want to display the author id and name for every post, we can simply include it in the query

```js

query {
  allPosts {
    description
    imageUrl
    author {
      id
      name
    }
  }
}

```

which will be reflected in the response:

```js

{
  "data": {
    "allPosts": [
      {
        "description": "#Auth0",
        "imageUrl": "https://styleguide.auth0.com/lib/logos/img/logo-blue.png",
        "author": {
          "id": "nilan-id",
          "name": "Nilan"
        }
      },
      {
        "description": "#GraphQL",
        "imageUrl": "https://raw.githubusercontent.com/facebook/graphql/master/resources/GraphQL%20Logo.png",
        "author": {
          "id": "nilan-id",
          "name": "Nilan"
        }
      }
    ]
  }
}

```

As GraphQL queries are hierarchical, we simply include the *author* object with the desired fields in our query. Note that we changed the query without even touching our GraphQL server. As for creating new posts, we can use the *createPost* mutation exposed by our GraphQL server. Here, we have to supply parameters that describe our new post. If the user with id *nilan-id* wants to create a new post, we could send this mutation:

```js

mutation {
  createPost(
    description: "Found this #auth0 badge",
    imageUrl: "https://styleguide.auth0.com/lib/logos/img/badge.png",
    authorId: "nilan-id"
  ) {
    id
  }
}

```

Mutations have responses too. In this case we get the id of the new post in return:

```js

{
  "data": {
    "createPost": {
      "id": "another-id"
    }
  }
}

``` 

Now that we saw queries and mutations in action, we can think about authentication and authorization.

## AUTHENTICATING GRAPHQL REQUESTS

The authentication workflow we are focusing on goes like this:

* a user is signing in with *Auth0 Lock*, obtaining a signed *JSON Web Token* that contains the Auth0 user id associated with that user

* Via the authorization header of the *user* query, the token is sent to the server which validates if the token is correctly signed and if so, also checks if the embedded Auth0 user id refers to a user already registered at the server.

```js

query {
  user {
    name
  }
}

``

* for a valid token that contains the Auth0 user id of a user already registered at the GraphQL server, the name will be returned:

```js

{
    "data": {
      "user": {
        "name": "Nilan"
      }
    }
}

```

They are then logged into the application and can create new posts.

![Login with Auth0](https://cdn.auth0.com/blog/graph/login.gif)

* for invalid tokens or valid tokens that contain the Auth0 user id of a user not yet registered at the GraphQL server, the response will be *null*:

```js
 {
    "data": {
      "user": "null"
    }
  }
```

New users will then have to finish the sign up process on a separate page

![Finish Sign Up Process](https://cdn.auth0.com/blog/graph/separatepage.gif)

Once the user enters his information and hits the sign up button, we can use the *createUser* mutation to register a new user at the GraphQL server:

```js

mutation {
  createUser(
    email: "new.user@email.com",
    emailSubscription: true,
    name: "New User"
    token: "<JWT>"
  ) {
    name
  }
}

```

and obtain its name:

```js

{
  "data": {
    "createUser": {
      "name": "New User"
    }
  }
}

```

Note that we also pass in the JWT obtained from Auth0 Lock to associate the new user with the Auth0 user id embedded in the token. If another token that includes the Auth0 user id will be supplied in subsequent requests to the GraphQL server, the request can be associated with the according user. Here, we can simply continue to include the JWT in the *Authorization* header after logging in. If we use the *user* query now:

```js

query {
  user {
    name
  }
}

```

we will obtain a valid response instead of *null*:

```js

{
  "data": {
    "user": {
      "name": "New User"
    }
  }
}

```

We can use the *user* query in the frontend application to show buttons for logout and creating new posts. 

An authenticated user can then create a new post by specifying a description and url for the image which will be used for the *createPost* that we saw above.

## AUTHORIZATION FOR GRAPHQL

One last thing that is missing is disallowing users that are not authenticated to create new posts. We can partly control that by hiding functionality in the frontend. However, it is really the responsibility of the GraphQL server to make sure that no unauthorized posts are created.

We can realize this on the server by defining a set of permission rules. These are the permissions we need for our application:

* Everyone can query posts
* Everyone can query users
* Everyone can create users
* Authenticated users can create posts
* Admins can delete posts
* Admins can delete users

Operations not listed are not allowed.

Then the GraphQL server can determine whether an incoming request is authorized by checking the permission list. For example, if the incoming request contains the *deletePost* mutation, the server would reject the deletion of the post as long as the request wasn't made by an admin.

On the other hand, if the request is authenticated and contains the *createPost* mutation, the server would grant the request permission, due to the *Authenticated users can create posts* rule.

## CONCLUSION

That's it! In this article we learned the basics of GraphQL by building an Instagram clone. We saw how to authenticate GraphQL requests using Auth0 and combine that with permission rules on the GraphQL server. To see how the application looks like, you can play around with [the hosted version of our Instagram clone](http://apollo-auth0.netlify.com).

To setup a GraphQL backend in less than 5 minutes, check out [Graphcool](https://graph.cool). Auth0 integration comes out-of-the-box and works nicely together with the advanced permission system.

![Setting up a GraphQL backend in 5 minutes](https://www.youtube.com/watch?v=wSkZFfuAToM)