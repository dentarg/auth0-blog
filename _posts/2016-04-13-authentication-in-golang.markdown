---
layout: post
title: "Authentication in Golang with JWTs"
description: "Learn Go by building and authenticating a RESTful API with JSON Web Tokens (JWTs) and pick up some best practices along the way."
date: 2016-04-13 08:30
alias: /2016/04/13/authentication-in-golang/
category: Technical Guide, Backend, Golang
author:
  name: "Ado Kukic"
  url: "https://twitter.com/kukicadnan"
  mail: "ado@auth0.com"
  avatar: "https://s.gravatar.com/avatar/99c4080f412ccf46b9b564db7f482907?s=200"
design:
  bg_color: "#333333"
  image: "https://cdn.auth0.com/blog/go-auth/gopher-main.png"
tags:
- Go
- Golang
- Go-API
- Go-JWT
- Authentication-in-Go
- Go-and-React
related:
- 2015-11-10-introducing-angular2-jwt-a-library-for-angular2-authentication
- 2016-04-22-angularjs-authentication-screencast-series-part-3
- 2015-09-15-angular-2-series-part-2-domain-models-and-dependency-injection
---

---

**TL;DR** Go is an excellent choice for building fast and scalable API's. The `net/http` package provides most of what you need but augmented with the [Gorilla Toolkit](http://www.gorillatoolkit.org/), you'll have an API up and running in no time. Learn how to build and secure a Go API with JSON Web Tokens and consume it via a modern UI built with React. If you want to follow along with the tutorial or want a reference for later, check out the Github [repo](https://github.com/auth0-blog/auth0-golang-jwt) for the code we're going to write.

---

Golang or simply Go is a programming language developed by Google for building modern software. Go is a language designed to get stuff done efficiently and fast. The key benefits of Golang include:

* Strongly typed and garbage collected
* Blazing fast compile times
* Concurrency built-in
* Extensive standard library

Go makes every attempt to reduce both the amount of typing needed and complexity of its syntax. Variables can be declared and initialized easily with `:=` syntax, semicolons are unnecessary and there is no complex type hierarchy. Go is a highly opinionated language. The end result is clean, easy to understand and read as well as reason about code.

{% include tweet_quote.html quote_text="Go is highly opinionated. The end result is clean, easy to understand, read and reason about code." %}

## Golang Playground
In this tutorial, we will be building a RESTful API in Go so knowledge of the Go language is a prerequisite. It is out of the scope of this tutorial to cover the fundamentals of the Go programming language. If you are new to Go, check out the masterfully crafted [Tour of Go](https://tour.golang.org/welcome/1) which covers everything from the basics to advanced topics such as concurrency and then you’ll be ready to proceed with this tutorial. If you are already familiar with Go, on the other hand, let’s build an API!

## Building an API in Go

Go is well suited for developing RESTful API’s. The `net/http` standard library provides key methods for interacting via the http protocol. The app we are building today is called **“We R VR.”** The app allows virtual reality enthusiasts to provide feedback to developers on the games and experiences they are working on.

![We R VR App](http://cdn.auth0.com/blog/go-auth/app-page.png)

Idiomatic Go prefers small libraries over large frameworks and the use of the standard library whenever possible. We will adhere to these idioms as much possible to ensure that our code samples are applicable across the Go ecosystem. With that said, a couple of handy libraries such as `gorilla/mux` for routing and `dgrijalva/jwt-go` for JSON Web Tokens will be used to speed up development.

### Golang Frameworks

Before jumping into the code, I do want to point out that while idiomatic Go tends to shy away from large frameworks, it does not mean that no frameworks are written in Go. [Beego](http://beego.me/), [Gin Gionic](https://gin-gonic.github.io/gin/), [Echo](https://labstack.com/echo) and [Revel](https://revel.github.io/) are just some of the more traditional web/api frameworks available. Since the `net/http` standard package already provides so much functionality, these frameworks tend to be built on top of it or at least use parts of the `net/http` package, so learning any or all of them will not be time wasted as the skills will be applicable throughout your Go career.

### Getting Started

We will write our entire application in a file called `main.go`. The reason for this is so that we do not have to explicitly build the application every time we make changes to the code. We’ll simply run our application with the `go run` command from the terminal. With that said, let’s examine our initial setup:

```go
package main

// Import our dependencies. We'll use the standard HTTP library as well as the gorilla router for this app
import (
  "net/http"
  "github.com/gorilla/mux"
)

func main() {
  // Here we are instantiating the gorilla/mux router
  r := mux.NewRouter()

  // On the default page we will simply serve our static index page.
  r.Handle("/", http.FileServer(http.Dir("./views/")))
  // We will setup our server so we can serve static assest like images, css from the /static/{file} route
  r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("./static/"))))

  // Our application will run on port 3000. Here we declare the port and pass in our router.
  http.ListenAndServe(":3000", r)
}

```

Let's go ahead and create two folders in the same directory that our `main.go` file is in and name them `views` and `static`. In the `views` folder, create a new file called `index.html`. The `index.html` page can be really simple for now:

```
<!DOCTYPE html>
<head>
  <title>We R VR</title>
</head>
<body>
  <h1>Welcome to We R VR</h1>
</body>
```

Let's make sure our server runs by running `go run main.go` from our terminal. If you have never used the `gorilla/mux` package before, you will additionally need to run the `go get` command which will download any dependencies you have declared but do not already have downloaded and installed in the proper directory. Once the application is successfully running, navigate to `localhost:3000` in your browser. If all went well, you should just see the text **Welcome to We R VR** displayed on the page. Good work so far. Next, let's define our API.

### Defining the API

With the foundation in place, we’ll define our API routes. For our demo app, we’ll stick to `GET` and `POST` requests. In addition to defining the routes, we’ll also implement a handler function called `NotImplemented`, which will be the default handler for routes that we have not yet added functionality to. Let's add this additional code to our `main.go` file now.

```go
func main(){
  ...

  // Our API is going to consist of three routes
  // /status - which we will call to make sure that our API is up and running
  // /products - which will retrieve a list of products that the user can leave feedback on
  // /products/{slug}/feedback - which will capture user feedback on products
  r.Handle("/status", NotImplemented).Methods("GET")
  r.Handle("/products", NotImplemented).Methods("GET")
  r.Handle("/products/{slug}/feedback", NotImplemented).Methods("POST")

  ...
}

// Here we are implementing the NotImplemented handler. Whenever an API endpoint is hit
// we will simply return the message "Not Implemented"
var NotImplemented = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request){
  w.Write([]byte("Not Implemented"))
})

```

Our Go API is shaping up nicely. Let's run the server again and try to access each of the three routes. Each route will return a `200 OK` with the message **Not Implemented**. That's ok we're going to add the implementation next.

### Adding Functionality

We have our routes in place, but currently, they do nothing. Let’s change that. In this section, we will add the expected functionality to each of the routes.

```go
...

/* We will first create a new type called Product
   This type will contain information about VR experiences */
type Product struct {
    Id int
    Name string
    Slug string
    Description string
}

/* We will create our catalog of VR experiences and store them in a slice. */
var products = []Product{
  Product{Id: 1, Name: "Hover Shooters", Slug: "hover-shooters", Description : "Shoot your way to the top on 14 different hoverboards"},
  Product{Id: 2, Name: "Ocean Explorer", Slug: "ocean-explorer", Description : "Explore the depths of the sea in this one of a kind underwater experience"},
  Product{Id: 3, Name: "Dinosaur Park", Slug : "dinosaur-park", Description : "Go back 65 million years in the past and ride a T-Rex"},
  Product{Id: 4, Name: "Cars VR", Slug : "cars-vr", Description: "Get behind the wheel of the fastest cars in the world."},
  Product{Id: 5, Name: "Robin Hood", Slug: "robin-hood", Description : "Pick up the bow and arrow and master the art of archery"},
  Product{Id: 6, Name: "Real World VR", Slug: "real-world-vr", Description : "Explore the seven wonders of the world in VR"
}

/* The status handler will be invoked when the user calls the /status route
   It will simply return a string with the message "API is up and running" */
var StatusHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request){
  w.Write([]byte("API is up and running"))
})

/* The products handler will be called when the user makes a GET request to the /products endpoint.
   This handler will return a list of products available for users to review */
var ProductsHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request){
  // Here we are converting the slice of products to JSON
  payload, _ := json.Marshal(products)

  w.Header().Set("Content-Type", "application/json")
  w.Write([]byte(payload))
})

/* The feedback handler will add either positive or negative feedback to the product
   We would normally save this data to the database - but for this demo, we'll fake it
   so that as long as the request is successful and we can match a product to our catalog of products
   we'll return an OK status. */
var AddFeedbackHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request){
  var product Product
  vars := mux.Vars(r)
  slug := vars["slug"]

  for _, p := range products {
      if p.Slug == slug {
          product = p
      }
  }

  w.Header().Set("Content-Type", "application/json")
  if product.Slug != "" {
    payload, _ := json.Marshal(product)
    w.Write([]byte(payload))
  } else {
      w.Write([]byte("Product Not Found"))
  }
})

...

```

With our functions in place, let's go back to the routes and update them with the appropriate handler functions.

```go
...

func main(){
  ...
  r.Handle("/status", StatusHandler).Methods("GET")
  r.Handle("/products", ProductsHandler).Methods("GET")
  r.Handle("/products/{slug}/feedback", AddFeedbackHandler).Methods("POST")
  ...
}
...
```

### Handlers / Middleware

In Go, middleware is referred to as *handlers*. If you are not already familiar with middleware, it is abstracted code that runs before the intended code is executed. For example, you may have a logging middleware that logs information about each request. You wouldn't want to implement the logging code for each route individually, so you would write a middleware function that gets inserted before the main function of the route is called that would handle the logging.

{% include tweet_quote.html quote_text="In Go, middleware is referred to as handlers." %}

We will use custom handlers further down in the tutorial to secure our API, but for now, let's implement a global handler that will provide some logging information about our requests. We will use a prebuilt handler from the `gorilla/handlers` package. Let's look at the implementation below:

```go
package main

import(
  ...
  // Add the handlers package dependency
  "github.com/gorilla/handlers"
  ...
)

func main(){
  ...
  // Wrap the LoggingHandler function around our router so that the logger is called first on each route request
  http.ListenAndServe(":3000", handlers.LoggingHandler(os.Stdout, r))
}

...
```

With just two lines of code, we were able to add logging functionality to our application. Now every time a resource is requested, the terminal will display information such as the type of request, response code and the time it took to process the request. To learn about the different settings and options for this handler and other handlers in the `gorilla/handlers` package check out their [docs](http://www.gorillatoolkit.org/pkg/handlers).

#### Middleware Libraries

We've been sticking to `net/http` as much as possible for our implementation. I would be remiss to not mention the many options for handling middleware in Auth0. We've seen the pure implementation in Golang by wrapping the middleware function around the intended function. [Negroni](https://github.com/codegangsta/negroni) and [Alice](https://github.com/justinas/alice) are two excellent alternatives to handling middleware in Golang.

### Securing our Golang API with JSON Web Tokens

Let's secure our Golang API with JWT. We'll do this two ways. First, we'll do a simple demonstration of how JSON Web Tokens work with Golang. Second, we'll implement end to end authentication with Auth0 a little later in the tutorial.

For the basic example, we'll have a route that will generate a new JWT for us. We'll then add middleware to secure our existing endpoints.

```go
  ...
  func main(){
    ...
    r.Handle("/get-token", GetTokenHandler).Methods("GET")
    ...
  }
  /* Set up a global string for our secret */
  var mySigningKey = []byte("secret")

  /* Handlers */
  var GetTokenHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request){
      /* Create the token */
    token := jwt.New(jwt.SigningMethodHS256)

    /* Create a map to store our claims
    claims := token.Claims.(jwt.MapClaims)

    /* Set token claims */
    claims["admin"] = true
    claims["name"] = "Ado Kukic"
    claims["exp"] = time.Now().Add(time.Hour * 24).Unix()

    /* Sign the token with our secret */
    tokenString, _ := token.SignedString(mySigningKey)

    /* Finally, write the token to the browser window */
    w.Write([]byte(tokenString))
  })
```

The code above will allow us to generate tokens and add claims to those tokens. As this is a fairly simple example, we've hard-coded the claims as well as not required any authentication to get a token. We'll do this with Auth0 a little later in the tutorial. Now let's secure our API endpoints. The first thing we'll do is create a handler for verifying the token.

```go
/* Handlers */

...

var jwtMiddleware = jwtmiddleware.New(jwtmiddleware.Options{
  ValidationKeyGetter: func(token *jwt.Token) (interface{}, error) {
    return mySigningKey, nil
  },
  SigningMethod: jwt.SigningMethodHS256,
})
```

Next, we'll update our routes to use this new middleware.

```go

...

func main(){

  ...

  r.Handle("/status", NotImplemented).Methods("GET")
  /* We will add the middleware to our products and feedback routes. The status route will be publicly accessible */
  r.Handle("/products", jwtMiddleware.Handler(ProductsHandler)).Methods("GET")
  r.Handle("/products/{slug}/feedback", jwtMiddleware.Handler(AddFeedbackHandler)).Methods("POST")

  ...
}

...

```

With this code in place, let's build our application and navigate to `localhost:3000/products`. You will get a message saying **Required Authorization token not found**. Our middleware works! Navigate to `localhost:3000/get-token` and you will receive a token. Copy this token. For this next step, I recommend using [Postman](https://www.getpostman.com/) or a similar program that will allow you to add headers to your requests. Send a request to `localhost:3000/products` but add an **Authorization** header in the format of `Bearer {TOKEN-YOU-COPIED}`. You will see the list of products now. The `jwtMiddleware` verified the token and the `ProductsHandler` was called properly returning the list of products.

## Building the UI (with React)

An API is only as good as the frontend that consumes it. We will build our UI with React. We won’t go too deeply into programming with React, if you need a guide check out the official React [tutorial](https://facebook.github.io/react/docs/tutorial.html) and a great Intro to React [tutorial](https://scotch.io/tutorials/learning-react-getting-started-and-concepts) by [Ken Wheeler](https://github.com/kenwheeler). Our Golang API does not discriminate, so feel free to implement the UI with any front-end technology you are comfortable with.

{% include tweet_quote.html quote_text="An API is only as good as the frontend that consumes it." %}

### Getting Started with Front End

Before we can start working with React, we'll need to do some setup in our `index.html` file. We'll need to add in the correct libraries and hook into our `app.jsx` file which will contain our React code. Let's look at how we'll accomplish this.

```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>We R VR</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.23/browser.min.js"></script>

    <script src="http://fb.me/react-0.14.7.js"></script>
    <script src="https://fb.me/react-dom-0.14.7.js"></script>
    <script type="text/babel" src="static/js/app.jsx"></script>


    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet">
  </head>
  <body>
    <div class="container" id="app">

    </div>
  </body>
</html>
```

Let's go ahead and create the `app.jsx` file in our static directory. We will place the entirety of our React application in this file. We'll break our app into React components. Once our UI is complete, we will integrate our React frontend with our Go backend. We will additionally secure our application with Auth0.

<div class="try-banner">
    <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)" class="signup-button btn btn-success btn-lg" style="background-image: none; font-family: avenir-next-web,'Avenir Next','Helvetica Neue',Hevetica,sans-serif;">Try Auth0 for Free</a>
</div>

### Building React Components

Our application will allow the user to view and leave feedback on VR products. Users must be logged in before they can leave feedback. We will need to build four components. A main `App` component that will launch the application, a `Home` component that will be displayed for non-logged in users, a `LoggedIn` component that will be displayed when a user is authenticated and finally a `Product` component that will display the products available for review.

#### App Component

The main component that will kick off our React application will be the `app` component. Let's build it first:

```jsx
var App = React.createClass({
  componentWillMount: function() {
  },
  render: function() {
    
    if (this.loggedIn) {
      return (<LoggedIn />);
    } else {
      return (<Home />);
    }
  }
});
```

#### Home Component

The `Home` component will be displayed when a user does not have an `idToken` meaning they are not logged in.

```jsx
var Home = React.createClass({
  render: function() {
    return (
    <div className="container">
      <div className="col-xs-12 jumbotron text-center">
        <h1>We R VR</h1>
        <p>Provide valuable feedback to VR experience developers.</p>
        <a className="btn btn-primary btn-lg btn-login btn-block">Sign In</a>
      </div>
    </div>);
  }
});
```

For now, we'll just build the UI. We'll add in the sign in functionality soon.

![We R VR Login Page](http://cdn.auth0.com/blog/go-auth/login-page.png)

#### LoggedIn Component

The `LoggedIn` component will be displayed when a user does have an `idToken` meaning they are logged in.

```jsx
var LoggedIn = React.createClass({
  getInitialState: function() {
    return {
      products: []
    }
  },
  render: function() {
    return (
      <div className="col-lg-12">
        <span className="pull-right"><a onClick={this.logout}>Log out</a></span>
        <h2>Welcome to We R VR</h2>
        <p>Below you'll find the latest games that need feedback. Please provide honest feedback so developers can make the best games.</p>
        <div className="row">
          
        {this.state.products.map(function(product, i){
          return <Product key={i} product={product} />
        })}
        </div>
      </div>);
  }
});
```

#### Product Component

Finally, the `Product` component will contain information about the VR experience. We could further break this component down into multiple components, but for brevity, we'll keep it all in one component for the demo.

```jsx
var Product = React.createClass({
  upvote : function(){
  },
  downvote: function(){
  },
  getInitialState: function() {
    return {
      voted: null
    }
  },
  render : function(){
    return(
    <div className="col-xs-4">
      <div className="panel panel-default">
        <div className="panel-heading">{this.props.product.Name} <span className="pull-right">{this.state.voted}</span></div>
        <div className="panel-body">
          {this.props.product.Description}
        </div>
        <div className="panel-footer">
          <a onClick={this.upvote} className="btn btn-default">
            <span className="glyphicon glyphicon-thumbs-up"></span>
          </a>
          <a onClick={this.downvote} className="btn btn-default pull-right">
            <span className="glyphicon glyphicon-thumbs-down"></span>
          </a>
        </div>
      </div>
    </div>);
  }
})
```

#### Finalizing the UI

With our components in place, the last thing we'll need to do is tell our React app how to start. We'll do that like this:

```jsx
ReactDOM.render(<App />, document.getElementById('app'));
```

This code will tell React to look for a `div` with the id of `app` and if it finds it, insert our `App` component at that location. The `App` component will then load in the appropriate sub-components and React will do it's job managing state from then on.

With our UI finalized, let's add authentication in Golang and hook up our front end.

## Aside: Adding Authentication with Auth0

Adding user authentication will allow us to protect our API. Since our app deals with projects that are in active development, we don’t want any data to be publicly available. We will accomplish this in two parts. We will add authentication in Go and protect our API endpoints from being accessed without a valid `access_token` token. Next, we'll add a way for users to log in to our React app and get a token.

### Authentication in Golang

To start, let’s secure our API endpoints. We did this earlier with manual generation and verification of the JWT, but now we'll expand on the functionality here. We will utilize the [`auth0-community/auth0`](https://github.com/auth0-community/go-auth0) and [`square/go-jose.v2`](https://github.com/square/go-jose) libraries for dealing with the JWT. Our implementation is as follows:

```go
package main

import (
    "encoding/json"
    "fmt"
    "net/http"
    "os"

    "github.com/auth0-community/auth0"
    "github.com/gorilla/handlers"
    "github.com/gorilla/mux"
    jose "gopkg.in/square/go-jose.v2"
)

type Product struct {
    Id          int
    Name        string
    Slug        string
    Description string
}

var products = []Product{
    Product{Id: 1, Name: "Hover Shooters", Slug: "hover-shooters", Description: "Shoot your way to the top on 14 different hoverboards"},
    Product{Id: 2, Name: "Ocean Explorer", Slug: "ocean-explorer", Description: "Explore the depths of the sea in this one of a kind underwater experience"},
    Product{Id: 3, Name: "Dinosaur Park", Slug: "dinosaur-park", Description: "Go back 65 million years in the past and ride a T-Rex"},
    Product{Id: 4, Name: "Cars VR", Slug: "cars-vr", Description: "Get behind the wheel of the fastest cars in the world."},
    Product{Id: 5, Name: "Robin Hood", Slug: "robin-hood", Description: "Pick up the bow and arrow and master the art of archery"},
    Product{Id: 6, Name: "Real World VR", Slug: "real-world-vr", Description: "Explore the seven wonders of the world in VR"},
}

func main() {
    r := mux.NewRouter()

    r.Handle("/", http.FileServer(http.Dir("./views/")))
    r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("./static/"))))

    r.Handle("/products", authMiddleware(ProductsHandler)).Methods("GET")
    r.Handle("/products/{slug}/feedback", authMiddleware(AddFeedbackHandler)).Methods("POST")

    http.ListenAndServe(":3000", handlers.LoggingHandler(os.Stdout, r))
}

func authMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        secret := []byte("{YOUR-API-CLIENT-SECRET}")
        secretProvider := auth0.NewKeyProvider(secret)
        audience := []string{"{YOUR-AUTH0-API-AUDIENCE}"}

        configuration := auth0.NewConfiguration(secretProvider, audience, "https://{YOUR-AUTH0-DOMAIN}.auth0.com/", jose.HS256)
        validator := auth0.NewValidator(configuration)

        token, err := validator.ValidateRequest(r)

        if err != nil {
            fmt.Println(err)
            fmt.Println("Token is not valid:", token)
            w.WriteHeader(http.StatusUnauthorized)
            w.Write([]byte("Unauthorized"))
        } else {
            next.ServeHTTP(w, r)
        }
    })
}

var ProductsHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    payload, _ := json.Marshal(products)

    w.Header().Set("Content-Type", "application/json")
    w.Write([]byte(payload))
})

var AddFeedbackHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    var product Product
    vars := mux.Vars(r)
    slug := vars["slug"]

    for _, p := range products {
        if p.Slug == slug {
            product = p
        }
    }

    w.Header().Set("Content-Type", "application/json")
    if product.Slug != "" {
        payload, _ := json.Marshal(product)
        w.Write([]byte(payload))
    } else {
        w.Write([]byte("Product Not Found"))
    }
})
```

The major difference you'll notice is that we are no longer generating the token ourself. We have a new `authMiddleware` middleware function that will validate tokens coming from Auth0. If you haven't already, <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">sign up</a> for a free Auth0 account. Navigate to the [APIs](https://manage.auth0.com/#/apis) section and create a new API application by clicking the **Create API** button.

![Create We-R-VR API Application](https://cdn2.auth0.com/blog/go-auth/create-api-client.png)

Give your API a **name** and an **identifier**. The identifier you give the API will be the **audience** for the middleware we've written above. Change the **Signing Algorithm** to **HS256** and click the **Create** button to finalize the creation of the API application.

Once your application is created copy it's **secret** and **audience** fields and replace the accompanying placeholders in your `main.go` file. Notice that `/products` and `/products/{slug}/feedback` route are protected with the `authMiddleware` middleware function we've written. If you try to access these now without a proper `access_token`, you will get a `401 Unauthorized` error.

When you created the API application, another application was created that will allow your frontend to authenticate and get the appropriate keys. Find this application, change it's **application type** to **single page application** and copy its `Client ID` as you will need it later.

Next, we'll implement the login functionality on the frontend. Feel free to remove the `/get-token` route as it is no longer necessary. We will get the token from Auth0.

### Login with Auth0 and React

Next, we’ll implement the login system on the frontend that will allow users to log in and create accounts. We'll first need to add the required Auth0 libraries. Let's update the `index.html` file.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>We R VR</title>
    <script src="http://code.jquery.com/jquery-2.1.4.min.js"></script>
    <script src="https://cdn.auth0.com/js/auth0/9.0/auth0.min.js"></script>
    <script type="text/javascript" src="static/js/auth0-variables.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.23/browser.min.js"></script>

    <script src="http://fb.me/react-0.14.7.js"></script>
    <script src="https://fb.me/react-dom-0.14.7.js"></script>
    <script type="text/babel" src="static/js/app.jsx"></script>


    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet">
  </head>
  <body>
    <div class="container" id="app">

    </div>
  </body>
</html>
```

We'll additionally need to create a new file called `auth0-variables.js` which will store our Auth0 `AUTH0_CLIENT_ID`, `AUTH0_DOMAIN`, `AUTH0_CALLBACK_URL`, and `AUTH0_API_AUDIENCE`. You can get the `AUTH0_CLIENT_ID`, `AUTH0_DOMAIN`, and `AUTH0_API_AUDIENCE` from your Auth0 [management dashboard](https://manage.auth0.com) and the `AUTH0_CALLBACK_URL` will be the URL of your app. With the libraries in place, we'll update our React components to handle the login as well as make calls to our Go API. Let's update the components one by one.

#### App Component

The `App` component will be updated to create an instance of the Lock widget, capture and store the user token and add the correct authorization header to any requests to our Go API. Let's see what that code looks like below:

```jsx
var App = React.createClass({
  componentWillMount: function() {
    this.setupAjax();
    this.parseHash();
    this.setState();
  },
  // Add access_token if available with each XHR request to API
  setupAjax: function() {
    $.ajaxSetup({
      'beforeSend': function(xhr) {
        if (localStorage.getItem('access_token')) {
          xhr.setRequestHeader('Authorization',
                'Bearer ' + localStorage.getItem('access_token'));
        }
      }
    });
  },
  // Extract the access_token and id_token from Auth0 Callback after login
  parseHash: function(){
    this.auth0 = new auth0.WebAuth({
      domain:       AUTH0_DOMAIN,
      clientID:     AUTH0_CLIENT_ID
    });
    this.auth0.parseHash(window.location.hash, function(err, authResult) {
      if (err) {
        return console.log(err);
      }
      if(authResult !== null && authResult.accessToken !== null && authResult.idToken !== null){
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('profile', JSON.stringify(authResult.idTokenPayload));
    window.location = window.location.href.substr(0, window.location.href.indexOf('#'))
      }
    });
  },
  // Set user login state
  setState: function(){
    var idToken = localStorage.getItem('id_token');
    if(idToken){
      this.loggedIn = true;
    } else {
      this.loggedIn = false;
    }
  },
  render: function() {
    
    if (this.loggedIn) {
      return (<LoggedIn />);
    } else {
      return (<Home />);
    }
  }
});
```

#### Home Component

The updates to the `Home` component will add the functionality to allow a user to log in.

```jsx
var Home = React.createClass({
  // Clicking the login link will redirect the user to the Hosted Lock page 
  // where the user will provide their credentials and will then be redirected
  // back to the application
  authenticate: function(){
    this.webAuth = new auth0.WebAuth({
      domain:       AUTH0_DOMAIN,
      clientID:     AUTH0_CLIENT_ID,
      scope:        'openid profile',
      audience:     AUTH0_API_AUDIENCE,
      responseType: 'token id_token',
      redirectUri : AUTH0_CALLBACK_URL
    });
    this.webAuth.authorize();
  },
  render: function() {
    return (
    <div className="container">
      <div className="col-xs-12 jumbotron text-center">
        <h1>We R VR</h1>
        <p>Provide valuable feedback to VR experience developers.</p>
        <a onClick={this.authenticate} className="btn btn-primary btn-lg btn-login btn-block">Sign In</a>
      </div>
    </div>);
  }
});
```

![Hosted Lock login page](https://cdn2.auth0.com/blog/go-auth/hosted-lock.png)

#### LoggedIn Component

The `LoggedIn` component will be updated to pull in products to review from the Golang API.

```jsx
var LoggedIn = React.createClass({
  // If a user logs out we will remove their tokens and profile info
  logout : function(){
    localStorage.removeItem('id_token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('profile');
    location.reload();
  },
  getInitialState: function() {
    return {
      products: []
    }
  },
  // Once this components mounts, we will make a call to the API to get the product data
  componentDidMount: function() {
    this.serverRequest = $.get('http://localhost:3000/products', function (result) {
      this.setState({
        products: result,
      });
    }.bind(this));
  },

  render: function() {
    return (
      <div className="col-lg-12">
        <span className="pull-right"><a onClick={this.logout}>Log out</a></span>
        <h2>Welcome to We R VR</h2>
        <p>Below you'll find the latest games that need feedback. Please provide honest feedback so developers can make the best games.</p>
        <div className="row">
          
        {this.state.products.map(function(product, i){
          return <Product key={i} product={product} />
        })}

        </div>
      </div>);
  }
});
```

#### Product Component

Finally, the `Product` component will be updated to add functionality to vote on products. The result will be sent to the API and the Go API will ensure that the `POST` request is valid and the product voted on actually exists.

```jsx
var Product = React.createClass({
  // The upvote and downvote functions will send an API request to the backend
  // These calls too will send the access_token and be verified before a success response
  // is returned
  upvote : function(){
    var product = this.props.product;
    this.serverRequest = $.post('http://localhost:3000/products/' + product.Slug + '/feedback', {vote : 1}, function (result) {
      this.setState({voted: "Upvoted"})
    }.bind(this));
  },
  downvote: function(){
    var product = this.props.product;
    this.serverRequest = $.post('http://localhost:3000/products/' + product.Slug + '/feedback', {vote : -1}, function (result) {
      this.setState({voted: "Downvoted"})
    }.bind(this));
  },
  getInitialState: function() {
    return {
      voted: null
    }
  },
  render : function(){
    return(
    <div className="col-xs-4">
      <div className="panel panel-default">
        <div className="panel-heading">{this.props.product.Name} <span className="pull-right">{this.state.voted}</span></div>
        <div className="panel-body">
          {this.props.product.Description}
        </div>
        <div className="panel-footer">
          <a onClick={this.upvote} className="btn btn-default">
            <span className="glyphicon glyphicon-thumbs-up"></span>
          </a>
          <a onClick={this.downvote} className="btn btn-default pull-right">
            <span className="glyphicon glyphicon-thumbs-down"></span>
          </a>
        </div>
      </div>
    </div>);
  }
})
```

## Putting it All Together

With the API and UI complete, we are ready to test our application. Fire up the server by once again running `go run main.go`.  Navigate to `localhost:3000` and you should see the sign in page. Click on the sign in button, and you will be redirected to the hosted Lock login page. Log in and you will be redirected back to your application and will be in the logged-in view of the application and will be able to leave feedback on the different experiences.

![We-R-Vr application in action](https://cdn2.auth0.com/blog/go-auth/we-r-vr-final.png)

Let's take it one step further, and let's actually build and compile our application. Instead of writing `go run main.go`, execute the command `go build main.go` in your terminal window. You should see a new file appear in your directory. This will be a Unix or Windows executable file. Now you can run your application by simply executing `./main` in your directory and the web server will start.

## Conclusion

Today, we built and secured an API in Go. The use of handlers made our authentication in Golang simple and straightforward. We saw how we could chain multiple handlers together to create middleware in Go. Additionally, we built a UI in React to consume our Go API and saw how the interaction between the frontend and backend was facilitated. To conclude, Go is an excellent language for building scalable and highly performant API's.
