---
layout: post
title: Developing Web Apps with ASP.NET Core 2.0 and React - Part 1
description: "A practical tutorial showing how to setup and develop a modern Web application based on ASP.NET Core 2.0 and React."
longdescription: <A LONG DESCRIPTION OF THE POST BETWEEN 230 AND 320 CHARACTERS>
date: 2018-01-24 09:19
category: Technical Guide, Microsoft, ASP Net Core
author:
  name: "Andrea Chiarelli"
  url: "https://twitter.com/andychiare"
  mail: "andrea.chiarelli.ac@gmail.com"
  avatar: "https://pbs.twimg.com/profile_images/827888770510880769/nnvUxzSd_400x400.jpg"
design:
  bg_color: "#3A1C5D"
  image: https://cdn.auth0.com/blog/asp-net-core-tutorial/logo.png
tags:
- .net-core
- asp.net-core
- asp.net
- c#
- oauth
- openid-connect
- auth0
related:
- 2017-06-05-asp-dot-net-core-authentication-tutorial.markdown
- 2016-06-27-auth0-support-for-aspnet-core
---

**TL;DR:** In this series of posts, starting with this one, you will build a Web application based on ASP.NET Core 2.0 and React. To solve the identity management feature, you will integrate this stack with [Auth0](https://auth0.com/). In this first part of the series, you are going to use ASP.NET Core 2.0 to develop the APIs of your application. [The final code can be found in this GitHub repository](https://github.com/andychiare/netcore2-auth0).

---

## Setting Up the ASP.NET Core Application

The application that you are going to implement will allow users to browse an online bookstore. Following [the API-First Development approach](https://dzone.com/articles/an-api-first-development-approach-1), you will start building your application by creating the ASP.NET Core 2.0 Web API. To do that, you have two alternatives: first, you can create your application from Visual Studio; second, you can create your application from the command line.

### Creating the Project with Visual Studio

If you are using Visual Studio, you can create the project by choosing *ASP.NET Core Web App* project template, as shown in the following picture:

![Creating a ASP.NET Core Web App with Visual Studio](https://cdn.auth0.com/blog/dotnet-core-react/creating-project.png)

> If you don't have Visual Studio, [you can download it for free here](https://www.visualstudio.com/free-developer-offers/).

After selecting the *ASP.NET Core Web App* project template, you need to specify the type of ASP.NET application you want to build. In your case, you will select the *Web API* application type, as in the following picture:

![Creating ASP.NET Core 2 Web API](https://cdn.auth0.com/blog/dotnet-core-react/choosing-web-api.png)

Make sure you **do not** select any type of authentication, since you will integrate your application with [Auth0](https://auth0.com/).

### Creating the Project from the Command Line

If you prefer to use the command line, you can create your application by typing the following command:

```shell
dotnet new webapi -n API-Auth0
```

This will create an ASP.NET Web API directory, with your project inside, named `API-Auth0` in the current directory.

Whether you use Visual Studio or the command line, you will get the same result. That is, after following these steps, you will get a basic ASP.NET Core 2 Web API application.

### Creating the Books Controller on ASP.NET Core 2.0

Now that you have your project created, you can start refactoring it to provide the desired functionality. The first thing you will do is to remove the `ValuesController.cs` file under the `Controllers` directory. You won't need this controller in your application.

After removing it, you can create the `BooksController.cs` file, in this same directory, with the following code:

```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace APIAuth0.Controllers
{
    [Route("api/[controller]")]
    public class BooksController : Controller
    {
        [HttpGet]
        public IEnumerable<Book> Get()
        {
            var currentUser = HttpContext.User;
            var resultBookList = new Book[] {
                new Book { Author = "Ray Bradbury", Title = "Fahrenheit 451", AgeRestriction = false },
                new Book { Author = "Gabriel García Márquez", Title = "One Hundred years of Solitude", AgeRestriction = false },
                new Book { Author = "George Orwell", Title = "1984", AgeRestriction = false },
                new Book { Author = "Anais Nin", Title = "Delta of Venus", AgeRestriction = true }
            };

            return resultBookList;
        }

        public class Book
        {
            public string Author { get; set; }
            public string Title { get; set; }
            public bool AgeRestriction { get; set; }
        }
    }
}
```

Here, you have defined a Web API returning a list of books. For simplicity, you are storing the list of books in an array. In a real-world case, however, this list should be stored in a persistent database. The Web API's URL will be `/api/books` and any HTTP client can get the list of books by issuing a simple HTTP GET request:

```bash
# run the application in the background
dotnet run &

# issue a get request
curl -D - http://localhost:5000/api/books
```

Of course, you don't want that any client could access your bookstore without some proper authentication process. You want that only authorized clients could get the list of books managed by your application. That's where [Auth0](https://auth0.com/) can help you: it provides a set of identity solutions that integrate security into your application.

## Integrating ASP.NET Core 2.0 with Auth0

As the first step, you will need an Auth0 account. If don't have one yet, you can sign up for a <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">free account here</a>.

During the registration process, you will need to provide the *tenant domain name*, the service hosting region, and a few other details about your company and yourself. The domain name is quite important since it will determine the root part of the API endpoints exposed by [Auth0](https://auth0.com/) to your authorized clients. Once you provide a domain name, you cannot change it anymore. However, you can create as many tenants as needed. Once the registration phase is completed, [you can access your *Auth0* dashboard](https://manage.auth0.com/).

### Creating an Auth0 API

As you are creating a backend API that enables users to browse an online bookstore, you will need to create an [Auth0 API](https://auth0.com/docs/apis) to represent your backend. To do that, head to [the APIs section of the Auth0 dashboard](https://manage.auth0.com/#/apis) and click on the *Create API* button. After that, the dashboard will ask you for three things:

- the *Name* of your API, you can set it to *Online Bookstore*;
- an *Identifier* for your API, you can set it to `https://onlinebookstore.mycompany.com`;
- and the *Signing Algorithm*, you can choose *RS256* in this field;

![Securing an online bookstore with Auth0](https://cdn.auth0.com/blog/dotnet-core-react/creating-an-auth0-api.png)

When you complete this form, you can hit the *Create* button.

### Creating an Auth0 Client

Your goal is to control your API access by authorizing only trusted clients. To do that, you will also need a client configuration on Auth0. Usually, you would need to create a new client to represent your front-end app. The type of the front-end app would help you deciding the type of the Auth0 Client to create. However, as in this first part you will not create the front-end yet, you can use the client that was automatically created for your Auth0 API.

If you chose *Online Bookstore* as the name of your API, then [you will see a client called *Online Bookstore (Test Client)* in the Client section of the Auth0 dashboard](https://manage.auth0.com/#/clients). Click on this client and head over to the *Settings* tab. In this tab, you will see three properties that you will need:

- the *Domain* of your Auth0 tenant;
- the *Client ID* key;
- and the *Client Secret* key;

You will use these values soon enough.

### Configuring Auth0 on ASP.NET Core Apps

After creating the Auth0 API, you will have to modify your application in order to hand the identity management over to [Auth0](https://auth0.com/). As a first step, you will need to add an Auth0 section in the `appsettings.json` configuration file, as shown below:

```json
{
  "Logging": {
    "IncludeScopes": false,
    "Debug": {
      "LogLevel": {
        "Default": "Warning"
      }
    },
    "Console": {
      "LogLevel": {
        "Default": "Warning"
      }
    }
  },
  "Auth0": {
    "Authority": "<YOUR_AUTH0_DOMAIN>",
    "Audience": "<YOUR_AUTH0_AUDIENCE>"
  }
}
```

You will have to replace both `<YOUR_AUTH0_DOMAIN>` and `<YOUR_AUTH0_AUDIENCE>` with the values that you have defined in the previous sections. For example, if you defined your tenant domain to `https://dotnet2-react.auth0.com` that's what you will use in the place of the `<YOUR_AUTH0_DOMAIN>` placeholder. In the place of the `<YOUR_AUTH0_AUDIENCE>` placeholder, you will use the value that you defined for the *Identifier* of your Auth0 API (e.g. `https://onlinebookstore.mycompany.com`).

Then, you will have to change the `ConfigureServices()` method in the `Startup.cs` file, as follows:

```csharp
public void ConfigureServices(IServiceCollection services) {
	services.AddAuthentication(options =>
	{
		options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
		options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
	}).AddJwtBearer(options =>
	{
		options.Authority = Configuration["Auth0:Authority"];
		options.Audience = Configuration["Auth0:Audience"];
	});

	services.AddMvc();
}
```

As you can see, you have added the authentication service by specifying the [JWT](https://jwt.io/) bearer scheme and providing the authority and audience values taken from the *appsetting.json* configuration file.

After that, you will need to add an invocation to `app.UseAuthentication()` in the body of `Configure()` method, as follows:

```csharp
public void Configure(IApplicationBuilder app, IHostingEnvironment env)
{
	if (env.IsDevelopment())
	{
		app.UseDeveloperExceptionPage();
	}

	app.UseAuthentication();

	app.UseMvc();
}
```

After enabling authentication support, you can block public access to your API by adding the `Authorize` attribute to the endpoint in the `BooksController.cs` file:

```csharp
[HttpGet, Authorize]
public IEnumerable<Book> Get()
{
	var currentUser = HttpContext.User;
	var resultBookList = new Book[] {
		new Book { Author = "Ray Bradbury", Title = "Fahrenheit 451", AgeRestriction = false },
		new Book { Author = "Gabriel García Márquez", Title = "One Hundred years of Solitude", AgeRestriction = false },
		new Book { Author = "George Orwell", Title = "1984", AgeRestriction = false },
		new Book { Author = "Anais Nin", Title = "Delta of Venus", AgeRestriction = true }
	};

	return resultBookList;
}
```

Now, if you try to access the `/api/books` endpoint, you will get a 401 HTTP status code (which means that you are not authorized). You can verify it by using any HTTP client, such as a browser, [curl](https://curl.haxx.se/), or [Postman](https://www.getpostman.com/).

```bash
# run the application in the background
dotnet run &

# issue a get request
curl -D - http://localhost:5000/api/books
```

The last command will generate a response like the following one:

```bash
# HTTP/1.1 401 Unauthorized
# Date: Wed, 24 Jan 2018 16:28:09 GMT
# Server: Kestrel
# Content-Length: 0
# WWW-Authenticate: Bearer
```

## Testing the APIs with Postman

Let's take a look at how we can qualify our client as an authorized client. In order to get this result, we should exploit the *Client ID* and *Client Secret* we get during the client registration on *Auth0*'s dashboard. Let's use  [Postman](https://www.getpostman.com/) as a test client.

As a first step, we have to get an authorization token from the [Auth0](https://auth0.com/) authentication service. We can do it by sending a POST request to the */oauth/token* endpoint of the authority domain we get from *Auth0*. The following picture shows an example of such request sent via *Postman*:

![./xxxx-images/postman-auth-request.png](./xxxx-images/postman-auth-request.png)



As we can see, we are submitting a JSON object via HTTP POST containing the that identify our client as an authorized client. The response to this request will be something similar to the following:

```json
{
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlEwRXhOamMzUXpCRE9VSkZSRVJCUTBNME1UY3dRekl6TkRkQ1F6WTVRVGMzUXpBNFJrUkVOZyJ9.eyJpc3MiOiJodHRwczovL2FuZHljaGlhcmUuZXUuYXV0aDAuY29tLyIsInN1YiI6InFBUjBjckRGTWhXdTI2T2hmU2M5eTNIQ2pzU1RBUEdNQGNsaWVudHMiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjYzOTM5LyIsImlhdCI6MTUxNjYwNDI1NiwiZXhwIjoxNTE2NjkwNjU2LCJhenAiOiJxQVIwY3JERk1oV3UyNk9oZlNjOXkzSENqc1NUQVBHTSIsInNjb3BlIjoicHJvZmlsZSBvcGVuaWQiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMifQ.hCl8YtWte8w_3-5gwMW06UrrnNiaSccr03IEtS29x8-CXfrQNEocjircLfJ32ioIdV4vfs0i69NDWwiDe4vP6KdVcemotpmoI1QpLY0zJL5s1zRizLwmXJZ9Kh1mKd--D3Pt92eAqJsXk4EK2-A2c9NPixrp7A4L5FtWDcRyOHinODUstud9_iXsvVF503IytGRepfsCLEosd7KOdCkgg21Gva7mOYMhlJwbUUsasZoLfYhqZhKX0xvjrRVJyhRkP9AJgSdVGX3nohDj0BZ4z6iYGBwW6NFRYy9SPGblt1Cc1L1OMj6hibxVKB6U2kkNubCMM5O_IHz38WCpJmNFPA",
    "expires_in": 86400,
    "token_type": "Bearer"
}
```

Here we will find the access token, its type and its validity duration expressed in seconds.

Now we can use the access token we received from [Auth0](https://auth0.com/) to request the list of books, as shown by the following picture:

![./xxxx-images/bookstore-result.png](./xxxx-images/bookstore-result.png)

We will get the following response:

```json
[
    {
        "author": "Ray Bradbury",
        "title": "Fahrenheit 451",
        "ageRestriction": false
    },
    {
        "author": "Gabriel García Márquez",
        "title": "One Hundred years of Solitude",
        "ageRestriction": false
    },
    {
        "author": "George Orwell",
        "title": "1984",
        "ageRestriction": false
    },
    {
        "author": "Anais Nin",
        "title": "Delta of Venus",
        "ageRestriction": true
    }
]
```



## Creating Integration Tests as a Non Interactive Client

The test performed with *Postman* in previous section should only verify that the *Auth0* configuration data and the API implemented by our application work well together. This is a test performed on the fly that should not be persisted. In fact, the type of client we configured on *Auth0* dashboard was a non interactive client. This type of client is intended for server to server or unattended interaction. In general you should never store the *Client Secret* on the client side, since it could compromise the overall application security.

The implementation of the integration test may be a case where we can use the *Client Secret*, since this information will not be exposed to the client but remains in the development environment.

Let's start writing the integration tests by implementing a test that verifies that a request to obtain the book list without an access token fails:

```c#

        [Fact]
        public async Task UnAuthorizedAccess()
        {
            var response = await _client.GetAsync("/api/books");

            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }
```

This simple test verifies that such a request will receive a 401 Unauthorized HTTP status code.

Then let's verify that the configuration data we put in *appsetting.json* allow us to get a valid access token:

```c#
        [Fact]
        public async Task TestGetToken()
        {
            var auth0Client = new HttpClient();
            var bodyString = $@"{{""client_id"":""{_configuration["Auth0:ClientId"]}"", ""client_secret"":""{_configuration["Auth0:ClientSecret"]}"", ""audience"":""{_configuration["Auth0:Audience"]}"", ""grant_type"":""client_credentials""}}";
            var response = await auth0Client.PostAsync($"{_configuration["Auth0:Authority"]}oauth/token", new StringContent(bodyString, Encoding.UTF8, "application/json"));

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var responseString = await response.Content.ReadAsStringAsync();
            var responseJson = JObject.Parse(responseString);
            Assert.NotNull((string)responseJson["access_token"]);
            Assert.Equal("Bearer", (string)responseJson["token_type"]);
        }
```

Here we replicate through code the same request we made via *Postman*. The *Assert* clauses just verify that a not null token has been received and that the type of token is *Bearer*.

The last test ensures that a request with a valid access token get the list of books returned by the API:

```c#
        [Fact]
        public async Task GetBooks()
        {
            var token = await GetToken();

            var requestMessage = new HttpRequestMessage(HttpMethod.Get, "/api/books");
            requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var booksResponse = await _client.SendAsync(requestMessage);

            Assert.Equal(HttpStatusCode.OK, booksResponse.StatusCode);

            var bookResponseString = await booksResponse.Content.ReadAsStringAsync();
            var bookResponseJson = JArray.Parse(bookResponseString);
            Assert.Equal(4, bookResponseJson.Count);
        }
```

This code uses a method *GetToken()* that requests a valid token to [Auth0](https://auth0.com/) authentication endpoint:

```c#
       public async Task<string> GetToken()
        {
            var auth0Client = new HttpClient();
            string token = "";
            var bodyString = $@"{{""client_id"":""{_configuration["Auth0:ClientId"]}"", ""client_secret"":""{_configuration["Auth0:ClientSecret"]}"", ""audience"":""{_configuration["Auth0:Audience"]}"", ""grant_type"":""client_credentials""}}";
            var response = await auth0Client.PostAsync($"{_configuration["Auth0:Authority"]}oauth/token", new StringContent(bodyString, Encoding.UTF8, "application/json"));

            if (response.IsSuccessStatusCode)
            {
                var responseString = await response.Content.ReadAsStringAsync();
                var responseJson = JObject.Parse(responseString);
                token = (string)responseJson["access_token"];

            }

            return token;
        }
```

This test completes the validation of our Web API application with [Auth0](https://auth0.com/) services. You can download the full source code of the application from [GitHub](https://github.com/andychiare/netcore2-auth0).

## Summary

In this article, we have built a .NET Core 2 Web API application and we have integrated it with *Auth0* security services in order to expose the API only to trusted clients.

This is a first step in a series of articles that will show how to build a complete modern application that allows the user to browse a bookstore. In the next article we will build a single page application based on React that will interact with the API we have just built.
