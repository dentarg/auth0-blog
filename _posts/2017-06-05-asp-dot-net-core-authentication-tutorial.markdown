---
layout: post
title: "ASP.NET Core Authentication Tutorial"
description: "Learn how to handle authentication on ASP.NET Core applications"
date: 2017-06-05 9:00
category: Technical Guide, Microsoft, ASP Net Core
author:
  name: "Bruno Krebs"
  url: "https://twitter.com/brunoskrebs"
  mail: "bruno.krebs@auth0.com"
  avatar: "https://www.gravatar.com/avatar/76ea40cbf67675babe924eecf167b9b8?s=60"
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
---

**TL;DR:** ASP.NET Core, the rewritten, cross-platform, and open source version of ASP.NET framework is gaining popularity for being easy to use and for having great performance when compared to modern solutions like Java, Go and Node.js. In this article we are going to use ASP.NET Core to create a simple RESTful API that handles grocery lists and then we are going to add authentication to secure this API.

{% include tweet_quote.html quote_text="Creating secure RESTful APIs with ASP.NET Core is a piece of cake." %}

## What is ASP.NET Core

ASP.NET Core is an open source redesign of the popular ASP.NET framework. This new version was developed to support modern cloud based applications, such as web applications, Internet of Things (IoT) devices, and mobile backends. There are a few differences between ASP.NET Core and its predecessor, the first big one is that the new version is cross-platform and can run on Windows, Mac and Linux. Another big difference is that [ASP.NET Core is fully open source and available on GitHub](https://github.com/aspnet/home).

## ASP.NET Core vs ASP.NET Framework

As mentioned, ASP.NET Core is a new framework and, as such, it has much less support and libraries available than its predecessor. [Microsoft has written a good article](https://docs.microsoft.com/en-us/dotnet/standard/choosing-core-framework-server) where it exposes when to use the new framework and when to use the old one. Basically, it says that developers should keep using the older version when they depend on third-party .NET libraries or NuGet packages that are not available for .NET Core, or when they are extending existing .NET applications.

This article also highlights that the following use cases are better fitted with .NET Core:

- When cross-platform support is needed.
- When microservices are the chosen architecture.
- When the application will be dockerized (deployed on Docker containers).
- When performance is a big priority (the article says that ASP.NET Core outperforms ASP.NET by a factor of 10).

{% include tweet_quote.html quote_text="ASP.NET Core outperforms ASP.NET by a factor of 10" %}

## Installing .NET Core

The process to install .NET Core and to start developing applications depends on what platform we are going to use (i.e. Windows, Mac, or Linux). As I use Mac, I will show instructions on how to install it in this platform, but if you use [Windows](https://www.microsoft.com/net/core#windowsvs2017) or [Linux](https://www.microsoft.com/net/core#linuxredhat), please follow the instructions on [Microsoft's web page](https://www.microsoft.com/net/core) before moving along.

.NET Core, on a Mac OS device, depends on the latest version of OpenSSL. To install it we will use [Homebrew](http://brew.sh/). If you already have Homebrew installed locally, just issue the following commands. If you don't, please install it first.

```bash
# updating brew references
brew update

# making sure openssl is already install
brew install openssl

# updating OpenSSL version
mkdir -p /usr/local/lib
ln -s /usr/local/opt/openssl/lib/libcrypto.1.0.0.dylib /usr/local/lib/
ln -s /usr/local/opt/openssl/lib/libssl.1.0.0.dylib /usr/local/lib/
```

After updating OpenSSL locally, you will have to [download the .NET Core SDK and install it](Download .NET Core SDK). Having the SDK installed, you can check if everything is in place by issuing the following command:

```bash
dotnet --info

# command output (example)
#.NET Command Line Tools (1.0.4)

#Product Information:
# Version:            1.0.4
# Commit SHA-1 hash:  af1e6684fd

#Runtime Environment:
# OS Name:     Mac OS X
# OS Version:  10.12
# OS Platform: Darwin
# RID:         osx.10.12-x64
# Base Path:   /usr/local/share/dotnet/sdk/1.0.4
```

## Creating the ASP.NET Core App

To bootstrap an ASP.NET Core application, we are going to create a new folder called `dotnet-grocery-list`, and use `dotnet` CLI (command line interface) to assemble the project structure. To do so, let's issue the following commands:

```bash
mkdir dotnet-grocery-list
cd dotnet-grocery-list
dotnet new mvc
```

This process, which shall take just a few seconds, will produce a structure that contains the following directories and files (a few resources were omitted for the sake of brevity):

```bash
|- Controllers
  |- HomeController.cs
|- Views
  |- ...
|- wwwroot
  |- ...
|- appsettings.json
|- Program.cs
|- Startup.cs
```

During this article we are going to focus basically on the `Controllers` directory, where we will create RESTful controllers, and on the `Startup.cs` class, which is responsible for starting our API and configuring the services that we are going to use.

## Creating the Grocery List API

Whenever a user wants to manage their grocery list, they will issue HTTP requests to our API. These HTTP requests are going to be handled by a new controller that we are going to create. To persist the grocery list items, this controller will interact with a database. Therefore we are going to need three new classes: `GroceryListContext`, which will act as the persistence layer; `GroceryItem`, which will be the model that represents the items in our application; and `GroceryListController`, which will handle the HTTP requests issued by users.

### Creating the Grocery Item Model

Our model will be quite simple, it will contain only an `Id`, which will be used to identify it, and a `Description`. Let's start by creating a `Models` directory in the root path of our application, and then let's create a file called `GroceryItem.cs` on it. This new file will contain the following code:

```csharp
namespace dotnet_grocery_list.Models
{
  public class GroceryItem
  {
    public long Id { get; set; }
    public string Description { get; set; }
  }
}
```

### Adding a Persistence Layer

As mentioned, we will use an in-memory database to persist our grocery list's items. Therefore, let's start by adding the `Microsoft.EntityFrameworkCore.InMemory` package to our project by issuing the following command:

```bash
dotnet add package Microsoft.EntityFrameworkCore.InMemory
```

After that we will create the `GroceryListContext` class, which will handle the persistence features. This class will be created in the same `Models` directory, and will have the following code:

```csharp
using Microsoft.EntityFrameworkCore;

namespace dotnet_grocery_list.Models
{
  public class GroceryListContext : DbContext
  {
    public GroceryListContext(DbContextOptions<GroceryListContext> options)
        : base(options)
    {
    }

    public DbSet<GroceryItem> GroceryList { get; set; }
  }
}
```

### Handling HTTP Requests

Handling HTTP requests with ASP.NET Core is a piece of cake. As we will see in the source code of the `GroceryListController` class, there are four attributes that we can add to methods that handle HTTP requests:

* `HttpGet` to handle HTTP GET requests.
* `HttpPost` to handle HTTP POST requests.
* `HttpDelete` to handle HTTP DELETE requests.
* `HttpPut` to handle HTTP PUT requests.

We won't use the last attribute (`HttpPut`) in this article, but it is useful when a method is supposed to handle updates in models. For example, if we were going to enable users to update a grocery item, we would add the `HttpPut` attribute to the method responsible for the update.

Another useful attribute is `FromBody`. This attribute is used to automatically deserialize method parameters from the body part of a HTTP request. In this article we are going to use this attribute to automatically transform a `GroceryItem` from JSON to an object instance.

Now that we have a better understanding of what ASP.NET Core offers us, let's create the `GroceryListController` class. This class will be create in the `GroceryListController.cs` file in the `Controllers` directory, and will contain the following source code:

```csharp
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using dotnet_grocery_list.Models;
using System.Linq;

namespace dotnet_grocery_list.Controllers
{
  [Route("api/[controller]")]
  public class GroceryListController : Controller
  {
    private readonly GroceryListContext _context;

    public GroceryListController(GroceryListContext context)
    {
      _context = context;

      if (_context.GroceryList.Count() == 0)
      {
        _context.GroceryList.Add(new GroceryItem { Description = "Item1" });
        _context.SaveChanges();
      }
    }     

    [HttpGet]
    public IEnumerable<GroceryItem> GetAll()
    {
      return _context.GroceryList.ToList();
    }

    [HttpGet("{id}", Name = "GetGroceryItem")]
    public IActionResult GetById(long id)
    {
      var item = _context.GroceryList.FirstOrDefault(t => t.Id == id);
      if (item == null)
      {
        return NotFound();
      }
      return new ObjectResult(item);
    }

    [HttpPost]
    public IActionResult Create([FromBody] GroceryItem item)
    {
      if (item == null)
      {
        return BadRequest();
      }

      _context.GroceryList.Add(item);
      _context.SaveChanges();

      return CreatedAtRoute("GetGroceryItem", new { id = item.Id }, item);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(long id)
    {
      var item = _context.GroceryList.First(t => t.Id == id);
      if (item == null)
      {
        return NotFound();
      }

      _context.GroceryList.Remove(item);
      _context.SaveChanges();
      return new NoContentResult();
    }
  }
}
```

The last step that we need to perform to finish our (unauthenticated) grocery list application, is to configure the `GroceryListContext` to use the in-memory database package that we have added to our project. To do so, let's open the `Startup.cs` file in the root directory of our application and change the `ConfigureServices` method as follows:

```csharp
//... other using statements
using dotnet_grocery_list.Models;
using Microsoft.EntityFrameworkCore;

namespace dotnet_grocery_list
{
  public class Startup
  {
    //... everything else

    public void ConfigureServices(IServiceCollection services)
    {
      // Configures GroceryListContext to use in-memory database
      services.AddDbContext<GroceryListContext>(opt => opt.UseInMemoryDatabase());
      // Add framework services.
      services.AddMvc();
    }
  }
}
```

Having everything in place, we can now use the RESTful API to save new grocery items to our list, get the whole list, and delete existing items through their ids. The following commands show how to interact with the API by using [curl](https://curl.haxx.se/).

```bash
# get all items from the grocery list
curl http://localhost:5000/api/grocerylist

# add `buy some milk` to the list
curl -H "Content-Type: application/json" -X POST -d '{
    "description": "buy some milk"
}'  http://localhost:5000/api/grocerylist

# delete item with id 1
curl -X DELETE http://localhost:5000/api/grocerylist/1
```

The full source code of this application can be found in the [`master` branch of this GitHub repository](https://github.com/auth0-blog/dotnet-core-auth).

## Adding Authentication to ASP.NET Core

To secure our ASP.NET Core application, we are going to rely on JWTs (JSON Web Tokens). JSON Web Token (JWT) is an [open standard](https://tools.ietf.org/html/rfc7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. The technology is becoming a de facto standard for securing microservices and backends for mobile applications and for SPA (Single Page Applications). Using JWTs to authenticate requests makes easier to create stateless applications and therefore to scale this applications horizontally. [If you want to learn more about JWTs, take a look at this resource](https://auth0.com/docs/jwt).

To secure our application, we are going to start by installing three packages:

```bash
dotnet add package JWT -v 3.0.0-beta4
dotnet add package Microsoft.AspNetCore.Identity.EntityFrameworkCore
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
```

The first package, called [JWT](https://github.com/jwt-dotnet/jwt), will be used to issue JWTs to users signing in. The second one is the default package for handling [Identity in ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/security/authentication/identity) applications, and will be integrated with our authentication solution. And the last package, JwtBearer, also provided by Microsoft, will be used to validate the tokens issued.

### Configuring JWT Properties

To start integrating these packages in our application, we will create three properties in the `appsettings.json` file:

```json
{
  "Logging": "... log configuration",
  "JWTSettings": {
    "SecretKey": "jwts-are-awesome",
    "Issuer": "dotnet_grocery_list",
    "Audience": "GroceryListAPI"
  }
}
```

The first property, `SecretKey`, is used to sign the tokens that our application will create, and also to validate tokens received. The `Issuer` and `Audience` properties will be included in all tokens that we issue, and when we receive a token we will assure that this token contains these two claims (`iss` for `Issuer` and `aud` for `Audience`). Like that we can guarantee that the token was indeed issued for our grocery list application.

To access these properties in our application, we are going to create a class called `JWTSettings` in a new file in the root directory of our application:

```csharp
namespace dotnet_grocery_list {
  public class JWTSettings
  {
    public string SecretKey { get; set; }
    public string Issuer { get; set; }
    public string Audience { get; set; }
  }
}
```

As we can see, this class has the exact same properties added to the `appsettings.json` file. To load the properties from the JSON file in an instance of this new class, add the following code as the first line of the `ConfigureServices` method of the `Startup` class:

```csharp
services.Configure<JWTSettings>(Configuration.GetSection("JWTSettings"));
```

### Enabling User Registration

The next step is to create a class that will enable users to register in our application. This class will be created in a new file called `AccountController.cs` in the `Controller` directory, and will contain the following code:

```csharp
using System.Collections.Generic;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using dotnet_grocery_list.Models;
using System.Linq;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using System.Collections;
using JWT;
using JWT.Serializers;
using JWT.Algorithms;
using Microsoft.Extensions.Options;
using System;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace dotnet_grocery_list.Controllers
{
  [Route("api/[controller]")]
  public class AccountController : Controller
  {
    private readonly UserManager<IdentityUser> _userManager;
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly JWTSettings _options;

    public AccountController(
      UserManager<IdentityUser> userManager,
      SignInManager<IdentityUser> signInManager,
      IOptions<JWTSettings> optionsAccessor)
    {
      _userManager = userManager;
      _signInManager = signInManager;
      _options = optionsAccessor.Value;
    }

    [HttpPost]
    public async Task<IActionResult> Register([FromBody] Credentials Credentials)
    {
      if (ModelState.IsValid)
      {
        var user = new IdentityUser { UserName = Credentials.Email, Email = Credentials.Email };
        var result = await _userManager.CreateAsync(user, Credentials.Password);
        if (result.Succeeded)
        {
          await _signInManager.SignInAsync(user, isPersistent: false);
          return new JsonResult(  new Dictionary<string, object>
          {
            { "access_token", GetAccessToken(Credentials.Email) },
            { "id_token", GetIdToken(user) }
          });
        }
        return Errors(result);

      }
      return Error("Unexpected error");
    }

    private string GetIdToken(IdentityUser user) {
      var payload = new Dictionary<string, object>
      {
        { "id", user.Id },
        { "sub", user.Email },
        { "email", user.Email },
        { "emailConfirmed", user.EmailConfirmed },
      };
      return GetToken(payload);
    }

    private string GetAccessToken(string Email) {
      var payload = new Dictionary<string, object>
      {
        { "sub", Email },
        { "email", Email }
      };
      return GetToken(payload);
    }

    private string GetToken(Dictionary<string, object> payload) {
      var secret = _options.SecretKey;

      payload.Add("iss", _options.Issuer);
      payload.Add("aud", _options.Audience);
      payload.Add("nbf", ConvertToUnixTimestamp(DateTime.Now));
      payload.Add("iat", ConvertToUnixTimestamp(DateTime.Now));
      payload.Add("exp", ConvertToUnixTimestamp(DateTime.Now.AddDays(7)));
      IJwtAlgorithm algorithm = new HMACSHA256Algorithm();
      IJsonSerializer serializer = new JsonNetSerializer();
      IBase64UrlEncoder urlEncoder = new JwtBase64UrlEncoder();
      IJwtEncoder encoder = new JwtEncoder(algorithm, serializer, urlEncoder);

      return encoder.Encode(payload, secret);
    }

    private JsonResult Errors(IdentityResult result)
    {
      var items = result.Errors
          .Select(x => x.Description)
          .ToArray();
      return new JsonResult(items) {StatusCode = 400};
    }

    private JsonResult Error(string message)
    {
      return new JsonResult(message) {StatusCode = 400};
    }

    private static double ConvertToUnixTimestamp(DateTime date)
    {
      DateTime origin = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
      TimeSpan diff = date.ToUniversalTime() - origin;
      return Math.Floor(diff.TotalSeconds);
    }
  }
}
```

This class, for the time being, contains only one public method, `Register`, which accepts HTTP POST requests with `Credentials` in the body. Besides this public method, it contains the following private methods:

* `ConvertToUnixTimestamp`—which is used to fill `iat` (issued at), `nbf` (not before), and `exp` (expiration) claims in the JWTs generated. These claims are used to validate if the token is indeed valid and are expected to contain a time represented in seconds passed after 1970.
* `Errors` and `Error`—which are used to send error messages as JSON.
* `GetToken`—a method that receives a set of key values pairs and generates a JWT adding all the values received alongside with the `iss`, `aud`, `nbf`, `iat`, and `exp` claims.
* `GetIdToken` and `GetAccessToken`—which are the methods that generate the `access_token` and the `id_token` for users. If you are wondering [what is the difference between these two tokens and when to use one or another, take a look here](https://auth0.com/blog/why-should-use-accesstokens-to-secure-an-api/).

The `Credentials` class accepted by the `Register` method, has not been created yet, so let's do it now. Let's create a new file called `Credentials.cs` in the `Models` directory and add the following code to it:

```csharp
using System.ComponentModel.DataAnnotations;

namespace dotnet_grocery_list.Models
{
  public class Credentials {
    [Required]
    [EmailAddress]
    [Display(Name = "Email")]
    public string Email { get; set; }

    [Required]
    [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
    [DataType(DataType.Password)]
    [Display(Name = "Password")]
    public string Password { get; set; }
  }
}
```

Whenever users successfully register themselves in our application, their credentials get persisted to the database. To enable this feature, we need to create a class that will act as the persistence layer. This class will be created in a new file called `UserDbContext.cs`, in the `Models` directory, with the following code:

```csharp
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace dotnet_grocery_list.Models
{
  public class UserDbContext : IdentityDbContext<IdentityUser>
  {
    public UserDbContext(DbContextOptions<UserDbContext> options)
            : base(options)
    {
      Database.EnsureCreated();
    }
  }
}
```

And then we need to make two changes in the add the `Startup` class. First we need to add two lines, with the `using` statements, as the first two lines of the `ConfigureServices`. And then we need to configure our app to use the identity framework:

```csharp
// ... other imports
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace dotnet_grocery_list
{
  public class Startup
  {
    // ... everything else

    public void ConfigureServices(IServiceCollection services)
    {
      services.AddEntityFramework()
              .AddDbContext<UserDbContext>(opt => opt.UseInMemoryDatabase());

      services.AddIdentity<IdentityUser, IdentityRole>()
              .AddEntityFrameworkStores<UserDbContext>();
      // ... everything else in this method
    }

    public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
    {
      // ... everything else
      app.UseIdentity();

      // app.UseMvc...
    }
    // ... rest of the class
  }
}
```

After updating our application as explained above, we are now able to handle user registration. To check if everything is working as expected, let's start our application (which can be done through our IDE or through the `dotnet run` command), and issue the following HTTP POST request:

```bash
curl -H "Content-Type: application/json" -X POST -d '{
    "email": "someuser@somewhere.com",
    "password": "123456#User"
}'  http://localhost:5000/api/account
```

> Note that the password must contain at least one number, one lowercase character, one uppercase character, one non alphanumeric character, and at least six characters. Just like the example above.

If we managed to update our application accordingly, the answer to our request will be a JSON object with two properties: `access_token` and `id_token`.

### Enabling Users to Sign In

Now that our users are already able to create accounts on our ASP.NET Core application, we need to add a feature for the existing users to sign in. The sign in process is quite similar to the registration process, the difference is that when a user signs in, it won't be registered in the database. Its credentials are going to be used to query the database to see if a user with the email and password combination exists, and if it does, the `access_token` and `id_token` will be generated and sent back.

To enable this feature, we are going to add the following method to the `AccountController` class recently created:

```csharp
[HttpPost("sign-in")]
public async Task<IActionResult> SignIn([FromBody] Credentials Credentials)
{
  if (ModelState.IsValid)
  {
    var result = await _signInManager.PasswordSignInAsync(Credentials.Email, Credentials.Password, false, false);
    if (result.Succeeded)
    {
      var user = await _userManager.FindByEmailAsync(Credentials.Email);
      return new JsonResult(  new Dictionary<string, object>
      {
        { "access_token", GetAccessToken(Credentials.Email) },
        { "id_token", GetIdToken(user) }
      });
    }
    return new JsonResult("Unable to sign in") { StatusCode = 401 };
  }
  return Error("Unexpected error");
}
```

To sign in into the application, we just need to issue an HTTP POST similar to the registration one. The difference is the endpoint URL, that now contains a `sign-in` suffix:

```bash
curl -H "Content-Type: application/json" -X POST -d '{
    "email": "someuser@somewhere.com",
    "password": "123456#User"
}'  http://localhost:5000/api/account/sign-in
```

### Protecting ASP.NET Core API

Even though we have created the two endpoints to enable users to register and to sign in, our grocery list application API is still publicly available. To secure all endpoints exposed by the `GroceryListController` class, we just need to add the `Authorize` attribute to this class, like shown below:

```csharp
// ... other using statements
using Microsoft.AspNetCore.Authorization;

namespace DotNetCoreAuth.Controllers
{
  [Authorize]
  [Route("api/[controller]")]
  public class GroceryListController : Controller
  {
    // ... rest of the class
  }
}
```

If we start the application now, and issue an HTTP GET request to any endpoint of the `GroceryListController` class, we will get a 404 (Not Found) response from the server. You would probably expect a 401 (Unauthorized) answer, but 404 was sent back because when a user is not logged in they are redirect to a login web page. This web page is not provided by default by ASP.NET Core, and therefore the request ends up being answered with a 404 response.

To circumvent this behavior, we can configure the Identity framework in the `ConfigureServices` method of the `Startup` class as follows:

```csharp
// ... other using statements
using System.Net;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace DotNetCoreAuth
{
    public class Startup
    {
        // ... everything else

        public void ConfigureServices(IServiceCollection services)
        {
            // ... other statements

            services.Configure<IdentityOptions>(options =>
            {
                // avoid redirecting REST clients on 401
                options.Cookies.ApplicationCookie.Events = new CookieAuthenticationEvents
                {
                    OnRedirectToLogin = ctx =>
                    {
                        ctx.Response.StatusCode = (int) HttpStatusCode.Unauthorized;
                        return Task.FromResult(0);
                    }
                };
            });

            services.AddMvc();
        }

        // ... Configure method
    }
}
```

Although we have secured our precious endpoints, we are not ready yet. Even if we send the `access_token` in a HTTP request, we are still going to get a 401 answer, because we have not configured our application to validate JWTs. Let's tackle this issue now.

### Validating JWTs with ASP.NET Core

To make our ASP.NET Core application validate the tokens issued by our register and sign in features, we are going to add just a few lines of code to the `Configure` method of the `Startup` class. Below is the full source code of this method after adding the lines that validate JWTs:

```csharp
// ... other using statements
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.IdentityModel.Tokens;
using System.Net;
using System.Text;

namespace dotnet_grocery_list
{
  public class Startup
  {
    // ... rest of the class

    public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
    {
      loggerFactory.AddConsole(Configuration.GetSection("Logging"));
      loggerFactory.AddDebug();

      app.UseExceptionHandler();
      app.UseIdentity();

      // secretKey contains a secret passphrase only your server knows
      var secretKey = Configuration.GetSection("JWTSettings:SecretKey").Value;
      var issuer = Configuration.GetSection("JWTSettings:Issuer").Value;
      var audience = Configuration.GetSection("JWTSettings:Audience").Value;
      var signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secretKey));
      var tokenValidationParameters = new TokenValidationParameters
      {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = signingKey,

        // Validate the JWT Issuer (iss) claim
        ValidateIssuer = true,
        ValidIssuer = issuer,

        // Validate the JWT Audience (aud) claim
        ValidateAudience = true,
        ValidAudience = audience
      };
      app.UseJwtBearerAuthentication(new JwtBearerOptions
      {
        TokenValidationParameters = tokenValidationParameters
      });

      app.UseCookieAuthentication(new CookieAuthenticationOptions
      {
        AutomaticAuthenticate = false,
        AutomaticChallenge = false
      });


      app.UseMvc();
    }
  }
}
```

As you can see, we first have loaded the same configuration properties used to generate tokens, and then added a `UseJwtBearerAuthentication` call passing a `JwtBearerOptions` with these properties. With that we are now able to validate JWTs and enable (or block) users carrying these tokens to access the grocery list API. To test the endpoint with `curl`, you can issue the following commands:

```bash
# Issuing POST request to register new user and using `jq` to extract the access_token.
# The extracted access_token ends up in the ACCESS_TOKEN env variable
ACCESS_TOKEN="$(curl -H "Content-Type: application/json" -X POST -d '{
    "email": "bruno.krebs@auth0.com",
    "password": "123#Bruno"
}'  http://localhost:5000/api/account | jq -r '.access_token')"

# Just showing the ACCESS_TOKEN contents
echo $ACCESS_TOKEN

# Passing the ACCESS_TOKEN as a Authorization header and quering the list of groceries
curl -H "Authorization: Bearer $ACCESS_TOKEN" http://localhost:5000/api/grocerylist
```

> Note that we have used `jq` to extract the `access_token` generated, and then saved it in the `ACCESS_TOKEN` environment variable. `jq` is a lightweight and flexible command-line JSON processor, and [its web page with instructions on how to install and use can be found here](https://stedolan.github.io/jq/).

If you need a reference for a ASP.NET Core application with authentication fully implemented, you can take a look at the [`auth` branch of this GitHub repository](https://github.com/auth0-blog/dotnet-core-auth/tree/auth).

{% include tweet_quote.html quote_text="Creating secure RESTful APIs with ASP.NET Core is a piece of cake." %}

## Aside: Securing ASP.NET Core with Auth0

In the following sections, we will see how to use authorization features of OAuth 2.0 to limit access to our ASP.NET Core applications. To learn more about OAuth 2.0, we can refer to [the API authorization documentation](https://auth0.com/docs/api-auth).

The very first thing we need is to create our own Auth0 account. Luckily, <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">Auth0 has a free tier that supports 7,000 free active users & unlimited logins</a>!

### Create a Resource Server (API)

After creating the account, we need to register our application in [the APIs section of the Auth0 dashboard](https://manage.auth0.com/#/apis). On this section, let's click "Create API". Then we have to provide a name ("Contacts API") and an identifier (`https://contacts.mycompany.com/`) to our API. We will use the identifier as an audience when configuring clients that will fetch `access_tokens`. For the signing algorithm, let's select _RS256_.

![Registering applications as APIs on Auth0](https://cdn.auth0.com/blog/asides/contacts-api.png)

### Installing Dependencies

To use tokens with ASP.NET Core applications, we need to use the JWT middleware. This middleware is provided by the [`Microsoft.AspNetCore.Authentication.JwtBearer`](https://www.nuget.org/packages/Microsoft.AspNetCore.Authentication.JwtBearer/1.1.3) package. To install this package, let's use the `dotnet` command:

```bash
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer --version 1.1.3
```

### Configuration

As requested when creating it, our API will use _RS256_ as the algorithm for signing tokens. Since _RS256_ uses a private/public key pair, it verifies the tokens against the public key for our Auth0 account. The ASP.NET Core JWT middleware will handle downloading the JSON Web Key Set (JWKS) file containing the public key for us, and will use that to verify the `access_token` signature.

To add the JWT middleware to our application's middleware pipeline, let's go to the `Configure` method of our `Startup` class and add a call to `UseJwtBearerAuthentication`. This call will pass in an instance of `JwtBearerOptions` configured with our Auth0 properties. The `JwtBearerOptions` needs to specify our Auth0 API Identifier as the `Audience`, and the full path to our Auth0 domain as the `Authority`:

```csharp
// Startup.cs

public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
{
    loggerFactory.AddConsole(Configuration.GetSection("Logging"));
    loggerFactory.AddDebug();

    var options = new JwtBearerOptions
    {
        Audience = "https://contacts.mycompany.com/",
        Authority = "https://bk-samples.auth0.com/"
    };
    app.UseJwtBearerAuthentication(options);

    app.UseMvc();
}
```

The JWT middleware integrates with the standard ASP.NET Core [Authentication](https://docs.microsoft.com/en-us/aspnet/core/security/authentication/) and [Authorization](https://docs.microsoft.com/en-us/aspnet/core/security/authorization/) mechanisms. Therefore, to secure an endpoint we only need to decorate our controller action with the `[Authorize]` attribute:

```csharp
// Controllers/ContactsController.cs

[Route("[controller]")]
public class ContactsController : Controller
{
    [Authorize]
    [HttpGet]
    [Route("")]
    public List<Team> GetContacts()
    {
        List<Team>
    }
    [HttpGet]
    public IEnumerable<Contact> GetContacts()
    {
      return _context.ContactList.ToList();
    }
}
```

### Creating an Auth0 Client

As the focus of this section is to secure ASP.NET Core with Auth0, [we are going to use a live Angular app that has a configurable Auth0 client](http://auth0.digituz.com.br/). Before using this app, we need to create an Auth0 Client that represents it. Let's head to the ["Clients" section of the management dashboard](https://manage.auth0.com/#/clients) and click on the "Create Client" button to create this client.

On the popup shown, let's set the name of this new client as "Contacts Client" and choose "Single Page Web App" as the client type. After hitting the "Create" button, we have to go to the "Settings" tab of this client and add `http://auth0.digituz.com.br/callback` to the "Allowed Callback URLs" field.

Now we can save the client and head to [the sample Angular app secured with Auth0](http://auth0.digituz.com.br/). To use this app, we need to set the correct values for four properties:

- `clientID`: We have to copy this value from the "Client ID" field of the "Settings" tab of "Contacts Client".
- `domain`: We can also copy this value from the "Settings" tab of "Contacts Client".
- `audience`: We have to set this property to meet the identifier of the API that we created earlier (`https://contacts.mycompany.com/`).
- `scope`: This property will define the `authority` that the `access_token` will get access to in the backend API. For example: `read:contacts` or both `read:contacts add:contacts`.

Then we can hit the "Sign In with Auth0" button.

![Using the Angular app with the configurable Auth0 Client](https://cdn.auth0.com/blog/angular-generic-client/signing-in.png)

After signing in, we can use the application to submit requests to our secured Node.js API. For example, if we issue a GET request to `http://localhost:5000/contacts`, the Angular app will include the `access_token` in the `Authorization` header and our API will respond with a list of contacts.

## Conclusion

Developing RESTful APIs with ASP.NET Core is easy and can lead to loosely coupled architectures with great performance and scalability. Also, the authentication feature was easy to implement and, with Auth0, can be easily enhanced. With these upsides, alongside with the fact that the whole .NET Core technology is open source and cross platform, we can expect an exponential growth on the interest for this framework, which will result on  rich set of open source packages and a thriving community. Therefore, it is a good time to to learn ASP.NET Core and to start writing application with this solution.
