---
layout: post
title: "Securing ASP.NET Core 2.0 Applications with JWTs"
description: "A practical tutorial showing how to use JSON Web Tokens in ASP.NET Core 2 applications."
date: 2017-12-07 08:30
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
related:
- 2016-06-27-auth0-support-for-aspnet-core
- 2016-06-03-add-auth-to-native-desktop-csharp-apps-with-jwt
- 2017-06-05-asp-dot-net-core-authentication-tutorial.markdown
alias: /securing-dot-net-core-2-applications-with-jwts/
alternate_locale_ja: jp-securing-asp-dot-net-core-2-applications-with-jwts
---

<div class="alert alert-success alert-icon">
  <strong>Heads up!</strong> This article refers to version <strong>2.0</strong> of the ASP.NET Core platform. If you are looking for instructions on how to secure ASP.NET Core <strong>1.0</strong>, please refer to the <a href="/blog/asp-dot-net-core-authentication-tutorial/">ASP.NET Core Authentication Tutorial</a> article. Have fun!
</div>

**TL;DR:** Unlike the previous version, ASP.NET Core 2 provides native support to JSON Web Tokens. This allows us to integrate this technology in ASP.NET applications in an easier way. In this article, we will take a look at how to enable JWTs when creating a Web API application based on ASP.NET Core 2. [The final code can be found in this GitHub repository](https://github.com/andychiare/netcore2-jwt).

## A Quick Introduction to JWTs

*JSON Web Tokens*, often shortened with JWTs, are gathering more and more popularity in the Web environment. [It is an open standard that allows transmitting data between parties as a JSON object in a compact and secure way](https://auth0.com/docs/jwt). They are usually used in authentication and information exchange scenarios, since the data transmitted between a source and a target are digitally signed so that they can be easily verified and trusted.

The JWTs are structured in three sections:

- the `Header`: this is a JSON object containing meta-information about the type of JWT and hash algorithm used to encrypt the data.
- the `Payload`: even this is a JSON object containing the actual data shared between source and target; these data are coded in *claims*, that is statements about an entity, typically the user.
- the `Signature`: this section allows to verify the integrity of the data, since it represents a digital signature based on the previous two sections.

The three sections of a JWT are combined together into a sequence of [Base64 strings](https://en.wikipedia.org/wiki/Base64) separated by dots so that the data can be easily sent around in HTTP-based environments. When used in authentication, JWT technology allows a client to store session data on its side and to provide the token to the server whenever it tries to access a protected resource. Usually, the token is sent to the server in the `Authorization` HTTP header using the [Bearer schema](https://swagger.io/docs/specification/authentication/bearer-authentication/), and it should contain all the information that allows to grant or deny access to the resource.

Of course, this is a very quick overview of JWT, just to have a common terminology and a basic idea of what the technology is. You can find more information in [Introduction to JSON Web Tokens](https://jwt.io/introduction/).

{% include tweet_quote.html quote_text="JSON Web Tokens are a compact and self-contained way for securely transmitting information between parties as a JSON object." %}

## Securing ASP.NET Core 2.0 Applications with JWTs

Let's take a look at how to set up a [ASP.NET Core 2 application](https://www.microsoft.com/net/) with JWT support by creating a Web API application. You can create it by using Visual Studio or via command line. In the first case you should choose the *ASP.NET Core Web Application* project template, as shown in the following picture:

![Creating ASP.NET Core 2 project on Visual Studio](https://cdn.auth0.com/blog/net-core-2/creating-project.png)

Then you need to select the type of ASP.NET application, that in our case will be *Web API*, as we can see in the following picture:

![Creating ASP.NET Core 2 Web API](https://cdn.auth0.com/blog/net-core-2/creating-project-web-api.png)

For simplicity, we have not enabled any type of authentication since we want to focus on JWT management.

If you prefer to create your application from command line, you can do so through the following command:

```shell
dotnet new webapi -n JWT
```

This will create an ASP.NET Web API project named JWT in the current folder.

![Creating ASP.NET Core 2 project with dotnet cli](https://cdn.auth0.com/blog/net-core-2/creating-app-through0-cli.png)

Regardless the way you have created your project, you will get in the folder the files defining the classes to setup a basic ASP.NET Core 2 Web API application.

First of all, we change the body of `ConfigureServices` method in `Startup.cs` in order to configure support for JWT-based authentication. The following is the resulting implementation of `ConfigureServices`:

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace JWT
{
  public class Startup
  {
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void ConfigureServices(IServiceCollection services)
    {
      services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
          options.TokenValidationParameters = new TokenValidationParameters
          {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = Configuration["Jwt:Issuer"],
            ValidAudience = Configuration["Jwt:Issuer"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Jwt:Key"]))
          };
        });

      services.AddMvc();
    }
  }
}
```

Here we register JWT authentication schema by using `AddAuthentication` method and specifying `JwtBearerDefaults.AuthenticationScheme`. Then we configure the authentication schema with options for JWT bearer. In particular, we specify which parameters must be taken into account in order to consider valid a JSON Web Token. Our code is saying that to consider a token valid we must:

1. validate the server that created that token (`ValidateIssuer = true`);
2. ensure that the recipient of the token is authorized to receive it (`ValidateAudience = true`);
3. check that the token is not expired and that the signing key of the issuer is valid (`ValidateLifetime = true`);
4. verify that the key used to sign the incoming token is part of a list of trusted keys (`ValidateIssuerSigningKey = true`).

In addition, we specify the values for the issuer, the audience and the signing key. We can store these values in the `appsettings.json` file to make them accessible via `Configuration` object:

```js
//appsettings.json
{
// ...
  "Jwt": {
    "Key": "veryVerySecretKey",
    "Issuer": "http://localhost:63939/"
  }
}
```

This step configures the JWT-based authentication service. In order to make the authentication service available to the application, we need to create the `Configure` method in the `Startup` class to invoke `app.UseAuthentication()`:

```csharp
// other methods
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

This change completes the configuration of our application to support JWT-based authentication.

## ASP.NET Core 1.0 vs ASP.NET Core 2.0

If you already knew [how ASP.NET Core 1.x supported JWT](https://auth0.com/blog/asp-dot-net-core-authentication-tutorial/), you can find that it has been made easier.

First of all, in previous version of ASP.NET Core you needed to install a few external packages. Now it is no longer needed since JSON Web Tokens are natively supported.

In addition, the configuration steps have been simplified as a consequence of the overall authentication system. In fact, while in ASP.NET Core 1.0 we had a middleware for each authentication schema we would support, ASP.NET Core 2.0 uses a single middleware handing all authentication and each authentication schema is registered as a service.

This allows us to create a more compact and cleaner code.

## Securing ASP.NET Core 2.0 Endpoints with JWTs

Once we have enabled JWT-based authentication, let's create a simple Web API to return a list of books when invoked with an HTTP `GET` request. This API will be held by a new class called `BooksController` in the `Controllers` namespace:

```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace JWT.Controllers
{
  [Route("api/[controller]")]
  public class BooksController : Controller
  {
    [HttpGet, Authorize]
    public IEnumerable<Book> Get()
    {
      var currentUser = HttpContext.User;
      var resultBookList = new Book[] {
        new Book { Author = "Ray Bradbury",Title = "Fahrenheit 451" },
        new Book { Author = "Gabriel García Márquez", Title = "One Hundred years of Solitude" },
        new Book { Author = "George Orwell", Title = "1984" },
        new Book { Author = "Anais Nin", Title = "Delta of Venus" }
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

As we can see, the API simply returns an array of books. However, as we marked the API with the `Authorize` attribute, requests to this endpoint will trigger the validation check of the token passed with the HTTP request.

If we run the application (through our IDE or the `dotnet run` command) and make a GET request to the `/api/books` endpoint, we will get a `401` HTTP status code as a response. You can try it by running the `UnAuthorizedAccess` test in the `Test` project attached to the [project's source code](https://github.com/andychiare/netcore2-jwt) or by using a generic HTTP client such as [curl](https://curl.haxx.se/) or [Postman](https://www.getpostman.com/).

![Using Postman to issue requests to ASP.NET Core 2 web API](https://cdn.auth0.com/blog/net-core-2/interacting-with-postman.png)

Of course, this result is due to the lack of the token, so that the access to the API has been denied.

## Creating JWT on Authentication

Let's add an authentication API to our application so that user can authenticate to get new JWTs. To do that, let's create a controller called `TokenController` in the `Controllers` namespace with the following code:

```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace JWT.Controllers
{
  [Route("api/[controller]")]
  public class TokenController : Controller
  {
    private IConfiguration _config;

    public TokenController(IConfiguration config)
    {
      _config = config;
    }

    [AllowAnonymous]
    [HttpPost]
    public IActionResult CreateToken([FromBody]LoginModel login)
    {
      IActionResult response = Unauthorized();
      var user = Authenticate(login);

      if (user != null)
      {
        var tokenString = BuildToken(user);
        response = Ok(new { token = tokenString });
      }

      return response;
    }

    private string BuildToken(UserModel user)
    {
     	var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
     	var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

     	var token = new JwtSecurityToken(_config["Jwt:Issuer"],
     	  _config["Jwt:Issuer"],
     	  expires: DateTime.Now.AddMinutes(30),
     	  signingCredentials: creds);

     	return new JwtSecurityTokenHandler().WriteToken(token);
     }

     private UserModel Authenticate(LoginModel login)
     {
     	UserModel user = null;

     	if (login.Username == "mario" && login.Password == "secret")
     	{
     		user = new UserModel { Name = "Mario Rossi", Email = "mario.rossi@domain.com"};
     	}
     	return user;
     }

    public class LoginModel
    {
      public string Username { get; set; }
      public string Password { get; set; }
    }

    private class UserModel
    {
      public string Name { get; set; }
      public string Email { get; set; }
      public DateTime Birthdate { get; set; }
    }
  }
}
```

The first thing to notice is the presence of `AllowAnonymous` attribute. This is very important, since this must be a public API, that is an API that anyone can access to get a new token after providing his credentials.

The API responds to an HTTP `POST` request and expects an object containing username and password (a `LoginModel` object).

The `Authenticate` method verifies that the provided username and password are the expected ones and returns a `UserModel` object representing the user. Of course, this is a trivial implementation of the authentication process. A production-ready implementation should be more accurate as all we know.

If the `Authentication` method returns a user, that is the provided credentials are valid, the API generates a new token via the `BuildToken` method. And this is the most interesting part: here we create a JSON Web Token by using the `JwtSecurityToken` class. We pass a few parameters to the class constructor, such as the issuer, the audience (in our case both are the same), the expiration date and time and the signature. Finally, the `BuildToken` method returns the token as a string, by converting it through the `WriteToken` method of the `JwtSecurityTokenHandler` class.

## Authenticating to Access the APIs

Now we can test the two APIs we created.

First, let's get a JWT by making an HTTP POST request to `/api/token` endpoint and passing the following JSON in the request body:

```json
{"username": "mario", "password": "secret"}
```

This can be easily done with Postman or any HTTP client. For example, with `curl` this would be the command:

```bash
curl -X POST -H 'Content-Type: application/json' \
  -d '{"username": "mario", "password": "secret"}' \
  0:5000/api/token
```

As a response we will obtain a JSON like the following:

```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJNYXJpbyBSb3NzaSIsImVtYWlsIjoibWFyaW8ucm9zc2lAZG9tYWluLmNvbSIsImJpcnRoZGF0ZSI6IjE5ODMtMDktMjMiLCJqdGkiOiJmZjQ0YmVjOC03ZDBkLTQ3ZTEtOWJjZC03MTY4NmQ5Nzk3NzkiLCJleHAiOjE1MTIzMjIxNjgsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NjM5MzkvIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo2MzkzOS8ifQ.9qyvnhDna3gEiGcd_ngsXZisciNOy55RjBP4ENSGfYI"
}
```

If we look at the value of the token, we will notice the three parts separated by a dot, as discussed at the beginning of this article.

Now we will try again to request the list of books, as in the previous section. However, this time we will provide the token as an authentication HTTP header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJNYXJpbyBSb3NzaSIsImVtYWlsIjoibWFyaW8ucm9zc2lAZG9tYWluLmNvbSIsImJpcnRoZGF0ZSI6IjE5ODMtMDktMjMiLCJqdGkiOiJmZjQ0YmVjOC03ZDBkLTQ3ZTEtOWJjZC03MTY4NmQ5Nzk3NzkiLCJleHAiOjE1MTIzMjIxNjgsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NjM5MzkvIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo2MzkzOS8ifQ.9qyvnhDna3gEiGcd_ngsXZisciNOy55RjBP4ENSGfYI
```

Again, this can be easily done with Postman or any HTTP client. In `curl`, this would be the command:

```bash
curl -H 'Authorization: Bearer '$JWT 0:5000/api/books
```

Of course, `JWT` env variable must be set with the token received while signing in: `JWT="eyJhbG..."`.

This time we will get the list of books.

## Handling JWT Claims on ASP.NET Core 2.0

When introducing JWTs, we said that a token may contain some data called *claims*. These are usually information about the user that can be useful when authorizing the access to a resource. Claims could be, for example, user's e-mail, gender, role, city, or any other information useful to discriminate users while accessing to resources. We can add claims in a JWT so that they will be available while checking authorization to access a resource. Let's explore in practice how to manage claims in our ASP.NET Core 2 application.

Suppose that our list contains books not suitable for everyone. For example, it contains a book subject to age restrictions. We should include in the JWT returned after the authentication, an information about the user's age. To do that, let's update the `BuildToken` method of `TokenController` as follows:

```csharp
private string BuildToken(UserModel user)
{

	var claims = new[] {
		new Claim(JwtRegisteredClaimNames.Sub, user.Name),
		new Claim(JwtRegisteredClaimNames.Email, user.Email),
		new Claim(JwtRegisteredClaimNames.Birthdate, user.Birthdate.ToString("yyyy-MM-dd")),
		new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
	};

	var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
	var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

	var token = new JwtSecurityToken(_config["Jwt:Issuer"],
	  _config["Jwt:Issuer"],
	  claims,
	  expires: DateTime.Now.AddMinutes(30),
	  signingCredentials: creds);

	return new JwtSecurityTokenHandler().WriteToken(token);
}
```

The main differences with respect to the previous version concern the definition of the `claims` variable. It is an array of `Claims` instances, each created from a key and a value. The keys are values of a structure (`JwtRegisteredClaimNames`) that provides names for public [standardized claims](https://tools.ietf.org/html/rfc7519#section-4). We created claims for the user's name, email, birthday and for a unique identifier associated to the JWT.

This `claims` array is then passed to the `JwtSecurityToken` constructor so that it will be included in the JWT sent to the client.

Now, let's take a look at how to change the API code in order to take into account the user's age when returning the list of books:

```csharp
[Route("api/[controller]")]
public class BooksController : Controller
{
  [HttpGet, Authorize]
  public IEnumerable<Book> Get()
  {
    var currentUser = HttpContext.User;
    int userAge = 0;
    var resultBookList = new Book[] {
      new Book { Author = "Ray Bradbury", Title = "Fahrenheit 451", AgeRestriction = false },
      new Book { Author = "Gabriel García Márquez", Title = "One Hundred years of Solitude", AgeRestriction = false },
      new Book { Author = "George Orwell", Title = "1984", AgeRestriction = false },
      new Book { Author = "Anais Nin", Title = "Delta of Venus", AgeRestriction = true }
    };

    if (currentUser.HasClaim(c => c.Type == ClaimTypes.DateOfBirth))
    {
      DateTime birthDate = DateTime.Parse(currentUser.Claims.FirstOrDefault(c => c.Type == ClaimTypes.DateOfBirth).Value);
      userAge = DateTime.Today.Year - birthDate.Year;
    }

    if (userAge < 18)
    {
      resultBookList = resultBookList.Where(b => !b.AgeRestriction).ToArray();
    }

    return resultBookList;
  }

  public class Book
  {
    public string Author { get; set; }
    public string Title { get; set; }
    public bool AgeRestriction { get; set; }
  }
}
```

We added the `AgeRestriction` property to the Book class. It is a boolean value that indicates if a book is subject to age restrictions or not.

When a request is received, we check if a claim `DateOfBirth` is associated with the current user. In case of affirmative, we calculate the user's age. Then, if the user is under 18, the list will contain only the books without age restrictions, else the whole list will be returned.

You can test this new scenario by running the tests `GetBooksWithoutAgeRestrictions` and `GetBooksWithAgeRestrictions` included in the [project's source code](https://github.com/andychiare/netcore2-jwt) or by issue the following `curl` commands:

```bash
# signing in
curl -X POST -H 'Content-Type: application/json' -d '{username: "mary", password: "barbie"}' 0:5000/api/token

# setting JWT variable (replace AAA.BBB.CCC with token received)
JWT="AAA.BBB.CCC"

# getting books
curl -H 'Authorization: Bearer '$JWT 0:5000/api/books
```

The last command will now send a list containing all books but the restricted one: *Delta of Venus*.

{% include tweet_quote.html quote_text="Just learnt how to secure ASP.NET Core 2.0 apis." %}

## Enabling Cross-Origin Requests (CORS) in ASP.NET Core 2.0

More often than not, we will want to specify that our API accepts requests coming from other origins (other domains). When issuing AJAX requests, browsers make preflights to check if a server accepts requests from the domain hosting the web app. If the response for these preflights don't contain at least the `Access-Control-Allow-Origin` header specifying that accepts requests from the original domain, browsers won't proceed with the real requests (to improve security).

To include support for CORS (and add this header alongside with a few more), we need to make two more changes in the `Startup` class. First, we need to add:

```csharp
services.AddCors(options =>
{
  options.AddPolicy("CorsPolicy",
      builder => builder.AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials()
  .Build());
});
```

as the last invocation in the `ConfigureServices` method. Second, we need to add:

```bash
app.UseCors("CorsPolicy");
```

Note that this basically makes our API accept requests from any origin. To make it more secure, we can change the `AllowAnyOrigin` with `WithOrigins` and define a specific origin (e.g. `https://mydomain.com`).

## Aside: Securing ASP.NET Core 2.0 with Auth0

Securing ASP.NET Core 2.0 applications with Auth0 is easy and brings a lot of great features to the table. With [Auth0](https://auth0.com/), we only have to write a few lines of code to get solid [identity management solution](https://auth0.com/user-management), [single sign-on](https://auth0.com/docs/sso/single-sign-on), support for [social identity providers (like Facebook, GitHub, Twitter, etc.)](https://auth0.com/docs/identityproviders), and support for [enterprise identity providers (like Active Directory, LDAP, SAML, custom, etc.)](https://auth0.com/enterprise).

With ASP.NET Core 2.0, we just need [to create an API in our Auth0 Management Dashboard](https://auth0.com/docs/apis) and change two things on our code. To create an API, we need to <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">sign up for a free Auth0 account</a>. After that, we need to go to [the API section of the dashboard](https://manage.auth0.com/#/apis) and click on "Create API". On the dialog shown, we can set the _Name_ of our API as "Books", the _Identifier_ as "http://books.mycompany.com", and leave the _Signing Algorithm_ as "RS256".

![Creating API on Auth0](https://cdn.auth0.com/blog/net-core-2/creating-api-on-auth0.png)

After that, we have to replace the call to `services.AddAuthentication` in the `Startup` to:

```csharp
string domain = $"https://{Configuration["Auth0:Domain"]}/";
services.AddAuthentication(options =>
{
  options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
  options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
  options.Authority = domain;
  options.Audience = Configuration["Auth0:Audience"];
});
```

And add the following element to `appsettings.json`:

```json
{
  "Logging": {
    // ...
  },
  "Auth0": {
    "Domain": "bk-samples.auth0.com",
    "Audience": "http://books.mycompany.com"
  }
}
```

**Note** that the domain in this case **have to be changed** to the domain that we specified when creating our Auth0 account.

### Testing the Integration

That's it. This is all we need to secure our ASP.NET Core 2.0 API with Auth0. However, to test this integration [we need a client to communicate with our application](https://auth0.com/docs/applications). As the focus of this article is ASP.NET Core 2.0, we will use [a generic web application that is secured with a configurable Auth0 application](http://auth0.digituz.com.br/). All we need to configure in this application are the `clientID`, `domain`, and `audience` properties.

To get the `clientID` and `domain` properties, we need to create a new Application in the management dashboard. [In the Applications section](https://manage.auth0.com/#/applications), we can click on "Create Application", name it as "Book Application" on the dialog shown, and choose "Single Page Web Applications" as the type. After creating the application, we have to go to the "Settings" tab and add `http://auth0.digituz.com.br` in the "Allowed Callback URLs" field and hit "Save" (ctrl/command + s). In this same tab, we can fetch both properties that we are interested in (`Client ID` and `Domain`) and then add to the generic application. There, we can also set the audience to be the identifier of our API (i.e. `http://books.mycompany.com`). Now we can hit "Sign In with Auth0" to authenticate ourselves.

![Testing integration with Auth0](https://cdn.auth0.com/blog/net-core-2/testing-auth0-integration.png)

After authenticating, we can use the web app to issue requests to the API (e.g. `http://localhost:5000/api/books`). As this web app automatically adds the `access_token` generated in the authentication process in the `Authorization` header, our API checks its validity and sends us the list of books.

![Issuing request to the API](https://cdn.auth0.com/blog/net-core-2/issuing-requests-api-auth0.png)

## Summary

In this article, we had an overview of the JSON Web Token technology and introduced how to use it in ASP.NET Core 2. While developing a simple Web API application, we saw how to configure support for JWT authentication and how to create tokens on authentication. We also described how to insert claims into a JWT and how to use them while authorizing the access to a resource.

In conclusion, we experienced how easy it is to manage JSON Web Tokens in ASP.NET Core 2 applications.
