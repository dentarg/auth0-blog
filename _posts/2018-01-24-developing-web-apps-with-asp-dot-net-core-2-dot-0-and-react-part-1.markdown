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

This will create an ASP.NET Web API directory, with your project inside, named *API-Auth0* in the current directory.

Whether you use Visual Studio or the command line, you will get the same result. That is, after following these steps, you will get a basic ASP.NET Core 2 Web API application.

Let's remove the *ValuesController.cs* file under the *Controllers* folder and add a new *BooksController.cs* file containing the following class definition:

```c#
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

Here we defined a Web API returning a list of books. For simplicity we stored the list of books in an array, but of course in a real world case the books should be stored in a database. The Web API's URL will look like */api/books* and any HTTP client can get the list of books running a HTTP GET request.

Of course we don't want that any client could access our bookstore. We'd like that only authorized clients could get the list of books managed by our application. [Auth0](https://auth0.com/) can help us: it provides us with a set of services that integrate security into our application.



## Configure API endpoint in Auth0 console

As a first step we need to signup for an [Auth0 account](https://auth0.com/signup). During the registration process you need to provide the *tenant domain name*, the service hosting region and other information. The domain name is quite important since it will determine the root part of the API endpoints exposed by [Auth0](https://auth0.com/)  to your authorized clients. Once you provide a name you cannot change it anymore. Once the registration phase is completed you will access your *Auth0* dashboard:

![./xxxx-images/Auth0-dashboard.png](./xxxx-images/Auth0-dashboard.png)



Our goal is to control our API access by authorizing only trusted clients. So we need to create a client configuration in order to obtain a few parameters that allow our Web API application to interact only with trusted clients. The *New Client* button in the dashboard let us to start this configuration. The first step asks us the name to assign to our client configuration and the type of client we want to setup, as shown by the following picture:

![./xxxx-images/auth0-create-client.png](./xxxx-images/auth0-create-client.png)



As we can see, [Auth0](https://auth0.com/)  allows to create configurations for several types of client: from mobile or desktop clients to Web applications. Since at this stage of the development we want just to test the Web API of our application, we will configure a *non interactive client*. A *non interactive client* is a type of client that do not requires a user interaction as it happens with a mobile or Web application. We will use this type of client since we will just test our API and create a couple of integration tests.

The choice of the client will generate a few data that we will see in the *Setting* section of the client configuration view:

![./xxxx-images/auth0-bookstore-client.png](./xxxx-images/auth0-bookstore-client.png)



The relevant part of the generated data consists of the *Domain Name*, the one we specified when signed up with *Auth0*, the *Client ID*, a string that identifies our client, and the *Client Secret*, a string shared between the client and the authorization server, corresponding to a password and to be kept private.



## Integrating with Auth0 authorization services

Having the configuration data from *Auth0*'s dashboard, we can modify our Web API application in order to integrate [Auth0](https://auth0.com/) security services. As a first step we add an *Auth0* section in *appsettings.json* configuration file, as shown below:

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
    "Authority": "YOUR_AUTH0_DOMAIN",
    "Audience": "APP_URL"
  }
}
```

In particular, we assign the *Domain* value to the *Authority* key and the application URL to the *Audience* key.

Then we change the *ConfigureServices()* method in *Startup.cs* file as follows:

```c#
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
As we can see, we added the authentication service by specifying the [JWT](https://jwt.io/) Bearer scheme and providing the authority and audience values taken from the *appsetting.json* configuration file.

Then we add *app.UseAuthentication()* invocation in the body of *Configure()* method, as follows:

```c#
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

After enabling authentication support, we can block public access to our API by simply adding the *Authorize* attribute to the endpoint:

```c#
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

Now, if we try to access the */api/books* API, we will get a 401 HTTP status code, that is an unauthorized response. We can verify it by using any HTTP client, such as a browser or [curl](https://curl.haxx.se/) or [Postman](https://www.getpostman.com/).

![Using Postman to issue requests to ASP.NET Core 2 Web API](https://cdn.auth0.com/blog/net-core-2/interacting-with-postman.png)

We get this result since [Auth0](https://auth0.com/) didn't recognize our client as an authorized client, since it didn't provide the required credentials.

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
