---
layout: post
title: Developing Web Apps with ASP.NET Core 2.0 and React - Part 1
description: "A practical tutorial showing how to setup and develop a modern Web application based on ASP.NET Core 2.0 and React."
longdescription: "In this series of posts, starting with this one, you will build a Web application based on ASP.NET Core 2.0 and React. To solve the identity management feature, you will integrate this stack with Auth0. In this first part of the series, you are going to use ASP.NET Core 2.0 to develop the APIs of your application."
date: 2018-02-15 09:19
category: Technical Guide, Microsoft, ASP Net Core
author:
  name: "Andrea Chiarelli"
  url: "https://twitter.com/andychiare"
  mail: "andrea.chiarelli.ac@gmail.com"
  avatar: "https://pbs.twimg.com/profile_images/827888770510880769/nnvUxzSd_400x400.jpg"
design:
  bg_color: "#2B1743"
  image: https://cdn.auth0.com/blog/webapps-aspnet2-react/logo.png
tags:
- .net-core
- asp.net-core
- asp.net
- csharp
- oauth
- openid-connect
- auth0
related:
- 2017-12-07-securing-asp-dot-net-core-2-applications-with-jwts
- 2018-02-20-developing-web-apps-with-asp-dot-net-core-2-dot-0-and-react-part-2
- 2018-02-06-developing-games-with-react-redux-and-svg-part-1
---

**TL;DR:** In this series of posts, starting with this one, you will build a Web application based on ASP.NET Core 2.0 and React. To solve the identity management feature, you will integrate this stack with [Auth0](https://auth0.com/). In this first part of the series, you are going to use ASP.NET Core 2.0 to develop the APIs of your application. [The final code can be found in this GitHub repository](https://github.com/andychiare/netcore2-auth0).

{% include tweet_quote.html quote_text="Learn how easy it is to create a modern web application with ASP.NET Core 2.0 and React" %}

---

## Setting Up the ASP.NET Core Application

The application that you are going to implement will allow users to browse an online bookstore. Following [the API-First Development approach](https://dzone.com/articles/an-api-first-development-approach-1), you will start building your application by creating the ASP.NET Core 2.0 Web API. To do that, you have two alternatives: first, you can create your application from Visual Studio; second, you can create your application from the command line.

### Creating the Project with Visual Studio

If you are using Visual Studio, you can create the project by choosing *ASP.NET Core Web App* project template, as shown in the following picture:

![Creating an ASP.NET Core Web App with Visual Studio](https://cdn.auth0.com/blog/dotnet-core-react/creating-project.png)

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

During the registration process, you will need to provide the *tenant domain name*, the service hosting region, and a few other details about your company and yourself. The domain name is quite important since it will determine the root part of the API endpoints exposed by [Auth0](https://auth0.com/) to your authorized clients. Once you provide a domain name, you cannot change it anymore. However, you can create as many tenants as needed. Once the registration phase is completed, [you can access your Auth0 dashboard](https://manage.auth0.com/).

### Creating an Auth0 API

As you are creating a backend API that enables users to browse an online bookstore, you will need to create an [Auth0 API](https://auth0.com/docs/apis) to represent your backend. To do that, head to [the APIs section of the Auth0 dashboard](https://manage.auth0.com/#/apis) and click on the *Create API* button. After that, the dashboard will ask you for three things:

- the *Name* of your API, you can set it to *Online Bookstore*;
- an *Identifier* for your API, you can set it to `https://onlinebookstore.mycompany.com`;
- and the *Signing Algorithm*, you can choose *RS256* in this field;

![Securing an online bookstore with Auth0](https://cdn.auth0.com/blog/dotnet-core-react/creating-an-auth0-api.png)

When you complete this form, you can hit the *Create* button.

### Creating an Auth0 Application

Your goal is to control your API access by authorizing only trusted clients. To do that, you will also need an application configuration on Auth0. Usually, you would need to create a new application to represent your front-end app. The type of the front-end app would help you decide the type of the Auth0 Application to create. However, as in this first part you will not create the front-end yet, you can use the application that was automatically created for your Auth0 API.

If you chose *Online Bookstore* as the name of your API, then [you will see an application called *Online Bookstore (Test Application)* in the Application section of the Auth0 dashboard](https://manage.auth0.com/#/applications). Click on this application and head over to the *Settings* tab. In this tab, you will see three properties that you will need:

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
using Microsoft.AspNetCore.Authentication.JwtBearer;

// ... other using statements
// ... namespace definition
// ... class definition
// ... etc

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

// ... etc
```

As you can see, you have added the authentication service by specifying the [JWT](https://jwt.io/) bearer scheme and providing the authority and audience values taken from the `appsetting.json` configuration file.

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

### Getting an Access Token

Now that you have secured your endpoints with Auth0, you will learn how to authenticate a machine to machine application to be able to get the list of books again. You can use any HTTP client, but in this section, you will see how to achieve that by using `curl`.

The first step is to get an authorization token from Auth0. You can do that by issuing a POST request to [the `/oauth/token` endpoint](https://auth0.com/docs/api/authentication#authorization-code) of your Auth0 domain, as follows:

```bash
AUTH0_CLIENT_ID=<YOUR_AUTH0_CLIENT_ID>
AUTH0_CLIENT_SECRET=<YOUR_AUTH0_CLIENT_SECRET>
AUTH0_AUDIENCE=<YOUR_AUTH0_AUDIENCE>
AUTH0_DOMAIN=<YOUR_AUTH0_DOMAIN>

curl -X POST -H 'content-type: application/json' -d '{
    "client_id": "'$AUTH0_CLIENT_ID'",
    "client_secret": "'$AUTH0_CLIENT_SECRET'",
    "audience": "'$AUTH0_AUDIENCE'",
    "grant_type":"client_credentials"
}' https://$AUTH0_DOMAIN/oauth/token
```

Note that you will have to replace `<YOUR_AUTH0_CLIENT_ID>`, `<YOUR_AUTH0_CLIENT_SECRET>`, `<YOUR_AUTH0_AUDIENCE>`, and `<YOUR_AUTH0_DOMAIN>` in the commands above with the values corresponding to the Auth0 API and Application that you have created before.

The response to this request will be something similar to the following:

```json
{
    "access_token": "eyJ0eXAiO...pJmNFPA",
    "expires_in": 86400,
    "token_type": "Bearer"
}
```

Now, you can use the `access_token` you have received from [Auth0](https://auth0.com/) to request the list of books, as follows:

```bash
ACCESS_TOKEN=eyJ0eXAiO...pJmNFPA

curl -H 'Authorization: Bearer '$ACCESS_TOKEN -D - http://localhost:5000/api/books
```

This request will generate the following response:

```bash
# HTTP/1.1 200 OK
# Date: Wed, 24 Jan 2018 17:35:26 GMT
# Content-Type: application/json; charset=utf-8
# Server: Kestrel
# Transfer-Encoding: chunked

# [{"author":"Ray Bradbury","title":"Fahrenheit 451","ageRestriction":false},{"author":"Gabriel García Márquez","title":"One Hundred years of Solitude","ageRestriction":false},{"author":"George Orwell","title":"1984","ageRestriction":false},{"author":"Anais Nin","title":"Delta of Venus","ageRestriction":true}]
```

{% include tweet_quote.html quote_text="Adding identity management to an ASP.NET Core 2.0 is really easy with Auth0." %}

### Creating Integration Tests as a Machine to Machine Applications

The test performed with `curl` in the previous section should only verify that the Auth0 configuration data and that the API implemented by our application work well together. This is a test performed on the fly that should not be persisted. In fact, the type of application that Auth0 automatically created was _Machine to Machine Application_. This type of application is intended for a server to server or unattended interaction. You **must never** store the *Client Secret* on the client side, since it will compromise the application security.

The implementation of the integration test may be a case where you can use the *Client Secret* since this information will not be exposed to the client but remains in the development environment.

Now, it's time to write an integration test that verifies that a request to obtain the book list without an access token fails:

```csharp
[Fact]
public async Task UnAuthorizedAccess()
{
    var response = await _client.GetAsync("/api/books");

    Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
}
```

This simple test verifies that such a request will receive a 401 Unauthorized HTTP status code. After that, you can verify that the configuration data you put in the `appsetting.json` file allows you to get a valid access token:

{% highlight csharp %}
{% raw %}
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
{% endraw %}
{% endhighlight %}

Here, you have replicated through the code the same request you made via `curl`. The `Assert` clauses just verify that a non-null token has been received and that the type of token is *Bearer*.

The last test ensures that a request with a valid access token will get the list of books returned by the API:

```csharp
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

This code uses a method called `GetToken()` that requests a valid token to [Auth0](https://auth0.com/) authentication endpoint:

{% highlight csharp %}
{% raw %}
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
{% endraw %}
{% endhighlight %}

This test completes the validation of your ASP.NET Core 2.0 application with [Auth0](https://auth0.com/). If needed, you can download the full source code of the application from [GitHub](https://github.com/andychiare/netcore2-auth0).

## Summary

In this article, you have built an ASP.NET Core 2 Web API application and you have integrated it with Auth0 in order to expose the API only to trusted clients.

This is the first step in a series of articles that will show how to build a complete modern application. This application will be based on the ASP.NET Core API that you have just created and in a React Single Page Application. [In the next article](https://auth0.com/blog/developing-web-apps-with-asp-dot-net-core-2-dot-0-and-react-part-2/), you will build this Single Page Application to allow users to browse the bookstore. Stay tuned.
