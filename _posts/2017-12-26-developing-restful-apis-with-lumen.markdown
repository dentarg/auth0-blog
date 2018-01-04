---
layout: post
title: "Developing RESTful APIs with Lumen (A PHP Micro-framework)"
description: "Lumen is a PHP micro-framework built to deliver micro-services and blazing fast APIs. Learn how to build and secure RESTful APIs with Lumen"
longdescription: "Lumen is a PHP micro-framework built to deliver micro-services and blazing fast APIs. The creator of Laravel crafted a micro-framework off the giant full-stack web framework, Laravel. Learn how to build and secure RESTful APIs with Lumen"
date: 2017-12-26 8:30
category: Technical Guide, PHP, Lumen
banner:
  text: "Auth0 makes it easy to add authentication to your Angular application."
author:
  name: "Prosper Otemuyiwa"
  url: "https://twitter.com/unicodeveloper"
  mail: "prosper.otemuyiwa@auth0.com"
  avatar: "https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200"
design:
  image: https://cdn.auth0.com/blog/lumen/logo.png
  bg_color: "#5B1C14"
tags:
- lumen
- php
- micro-framework
- laravel
- authentication
- auth
- restful
- api
- rest
related:
- 2017-10-10-developing-web-apps-and-restful-apis-with-keystonejs
- 2017-09-07-developing-restful-apis-with-loopback
- 2017-08-10-implementing-jwt-authentication-on-spring-boot
---

**TL;DR:** In this tutorial, I'll show you how easy it is to build and secure an API with Lumen. Check out the [repo](https://github.com/auth0-blog/lumen-api-auth) to get the code.

---

**Lumen** is an open-source PHP based micro-framework created by [Taylor Otwell](https://twitter.com/taylorotwell) in 2015. Lumen is designed for building lightning fast micro-services and APIs. And it opts for maximum speed rather than flexibility in the bootstrapping process. The PHP micro-framework was born out of the need to have light Laravel installations that could be faster than existing PHP micro-frameworks such as [Slim](https://www.slimframework.com) and [Silex](https://silex.symfony.com).

{% include tweet_quote.html quote_text="Lumen is designed for building lightning fast micro-services and APIs." %}

## Lumen Features And Architecture

**Lumen** utilizes the [Illuminate components](https://github.com/illuminate) that power the [Laravel](https://github.com/laravel/laravel) framework. One amazing thing about the way Lumen was built is the fact that you can painlessly upgrade right into Laravel. One of such scenarios where an upgrade process is applicable is when you discover that you need more features out of the box that Lumen doesn't offer.

{% include tweet_quote.html quote_text="One amazing thing about the way Lumen was built is the fact that you can painlessly upgrade right into Laravel." %}

* **Routing**: Lumen provides routing out of the box via [Fast Route](https://github.com/nikic/FastRoute). _Fast Route_ is a library that provides a fast implementation of a regular expression based router.
* **Authentication**: Lumen does not support session state. However, incoming requests are authenticated via a stateless mechanism such as tokens.
* **Caching**: Lumen supports caching just like Laravel. In fact, there are no differences between using the cache in Lumen and Laravel. Cache drivers such as _Database_, _Memcached_, and _Redis_ are supported. You will need to install the `illuminate/redis` package via Composer before using a Redis cache with Lumen.
* **Errors and Logging**: Lumen ships with the [Monolog library](https://github.com/Seldaek/monolog), which provides support for various log handlers.
* **Queuing**: Lumen provides a queuing service that is similar to Laravel's. It provides a unified API across a variety of different queue back-ends.
* **Events**: Lumen's events provide a simple observer implementation, allowing you to subscribe and listen for events in your application.

The entire bootstrap process is located in a [single file](https://github.com/laravel/lumen/blob/master/bootstrap/app.php).

## Lumen Key Requirements

In order to use Lumen, you need to have the following tools installed on your machine.

* **PHP**: Make sure [PHP](http://php.net/manual/en/install.php) is installed on your machine. `PHP >= 7.0`. Furthermore, ensure that the following PHP extensions are installed. `OpenSSL`, `PDO` and `Mbstring`.
* **Composer**: Navigate to the [composer website](https://getcomposer.org/) and install it on your machine. Composer is needed to install Lumen's dependencies.
* You'll also need familiarity with database concepts, and working knowledge of PHP.

> **Note:** You'll need **MySQL** for this tutorial. Navigate to the [mysql website](https://www.mysql.com) and install the community server edition. If you are using a Mac, I'll recommend following these [instructions](https://gist.github.com/nrollr/3f57fc15ded7dddddcc4e82fe137b58e). To avoid micromanaging from the terminal, I'll also recommend installing a MySQL GUI, [Sequel Pro](https://sequelpro.com). 

## Building a Fast Authors API Rapidly With Lumen

At Auth0, we have a number of technical writers, otherwise known as authors. A directive has been given to developing an app to manage Auth0 authors. The frontend app will be built with ReactJS. However, it needs to pull data from a source and also push to it. Yes, we need an API!

This is what we need the API to do:

* Get all authors.
* Get one author.
* Add a new author.
* Edit an author.
* Delete an author.

Let's flesh out the possible endpoints for this API. Given some _authors_ resource, we'll have the following endpoints:

* Get all authors  - `GET /api/authors`
* Get one author   - `GET /api/authors/23`
* Create an author - `POST /api/authors`
* Edit an author   - `PUT /api/authors/23`
* Delete an author - `DELETE  /api/authors/23`

What will be the author attributes? Let's flesh it out like we did the endpoints.

* Author: `name`, `email`, `twitter`, `github`, `location`, and `latest_article_published`.

### Install Lumen

Run the following command in your terminal to create a new project with [Lumen](https://lumen.laravel.com):

```bash
composer create-project --prefer-dist laravel/lumen authors
```

`cd` into the newly created project.

```bash
cd authors
```

Now, run `php -S localhost:8000 -t public` to serve the project. Head over to your browser. You should see the index page like so:

![Authors - Index Page](https://cdn.auth0.com/blog/authors/lumen-index.png)
_Authors Index_

### Activate Eloquent and Facades

As I mentioned earlier, the entire bootstrap process is located in a [single file](https://github.com/laravel/lumen/blob/master/bootstrap/app.php). Open up the `bootstrap/app.php` and uncomment this line, `// app->withEloquent`. Once uncommented, Lumen hooks the [Eloquent ORM](https://github.com/illuminate/database/tree/master/Eloquent) with your database as configured in the `.env` file. 

> Make sure you set the right details for your database in the .env file.

In addition uncomment this line `//$app->withFacades();` . Once uncommented, we can make use of [Facades](https://laravel.com/docs/5.5/facades) in our project.

### Setup Database, Models and Migrations

At the time of this writing, Lumen supports four database systems: MySQL, Postgres, SQLite, and SQL Server. We are making use of MySQL in this tutorial. First, we'll create a migration for the Authors table.

> Migrations are like version control for your database, allowing your team to easily modify and share the application's database schema.

Run the command below in the terminal to create the `Authors` table migration:

```bash
php artisan make:migration create_authors_table
```

The new migration will be placed in your `database/migrations` directory. Each migration file name contains a timestamp which allows Lumen to determine the order of the migrations. Next, we'll modify the recently created migration to accommodate the `Authors` attributes.

Open up the migration file and modify it like so:

```php
<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAuthorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('authors', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('email');
            $table->string('github');
            $table->string('twitter');
            $table->string('location');
            $table->string('latest_article_published');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('authors');
    }
}
```

In the code above, we added the columns to the `authors` table.

Now, go ahead and run the migration like so:

```bash
php artisan migrate
```

Check your database. You should have the `authors` and `migrations` table present.

![Authors table](https://cdn.auth0.com/blog/authors/migration.png)


Let's create the `Author` model. Create an `app/Author.php` file and add the code below to it:

_app/Author.php_

```php
<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Author extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'github', 'twitter', 'location', 'latest_article_published'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [];
}
```

In the code above, we made the author attributes [mass assignable](https://laravel.com/docs/5.5/eloquent#mass-assignment).


### Set up Routes

Routing is straight-forward. Open up `routes/web.php` and modify it like so:

```php
<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
    return $router->app->version();
});

$router->group(['prefix' => 'api'], function () use ($router) {
  $router->get('authors',  ['uses' => 'AuthorController@showAllAuthors']);

  $router->get('authors/{id}', ['uses' => 'AuthorController@showOneAuthor']);

  $router->post('authors', ['uses' => 'AuthorController@create']);

  $router->delete('authors/{id}', ['uses' => 'AuthorController@delete']);

  $router->put('authors/{id}', ['uses' => 'AuthorController@update']);
});
```

In the code above, we have abstracted the functionality for each route into a controller,  `AuthorController`. Route groups allow you to share route attributes, such as middleware or namespaces, across a large number of routes without needing to define those attributes on each individual route. Therefore, every route will have a prefix of `/api`. Next, let's create the Author Controller.

### Set up Author Controller

Create a new file, `AuthorController.php` in `app/Http/Controllers` directory and add the following code to it like so:

```php
<?php

namespace App\Http\Controllers;

use App\Author;
use Illuminate\Http\Request;

class AuthorController extends Controller
{
    
    public function showAllAuthors()
    {
        return response()->json(Author::all());
    }

    public function showOneAuthor($id)
    {
        return response()->json(Author::find($id));
    }

    public function create(Request $request)
    {
        $author = Author::create($request->all());

        return response()->json($author, 201);
    }

    public function update($id, Request $request)
    {
        $author = Author::findOrFail($id);
        $author->update($request->all());

        return response()->json($author, 200);
    }

    public function delete($id)
    {
        Author::findOrFail($id)->delete();
        return response('Deleted Successfully', 200);
    }
}
```

Let's analyze the code above. First, we required the Author model, `use App\Author`. Moving forward, we invoked the necessary methods from the Author model for each controller method. We have five methods here. `showAllAuthors`, `showOneAuthor`, `create`, `update` and `delete`.

* `showAllAuthors` - /GET
* `showOneAuthor` - /GET
* `create` - /POST
* `update` - /PUT
* `delete` - /DELETE

For example, if you make a POST request to `/api/authors` API endpoint, the `create` function will be invoked.

- The `showAllAuthors` method checks for all the author resources.
- The `create` method creates a new author resource.
- The `showOneAuthor` method checks for a single author resource.
- The `update` method checks if an author resource exists and allows the resource to be updated.
- The `delete` method checks if an author resource exists and deletes it.

* `response()` is a global helper function that obtains an instance of the response factory. `response()->json()` simply returns the response in JSON format.
* `200` is an HTTP status code that indicates the request was successful.
* `201` is an HTTP status code that indicates a new resource has just been created.
* `findOrFail` method throws a `ModelNotFoundException` if no result is not found.


Finally, test the API routes with [Postman](https://www.getpostman.com/).

![Lumen GET operation](https://cdn.auth0.com/blog/lumen/getallauthors.png)
_Author GET operation_

![Lumen POST operation](https://cdn.auth0.com/blog/lumen/create-new-author.png)
_Author POST operation_

![Lumen PUT operation](https://cdn.auth0.com/blog/lumen/update-author.png)
_Author PUT operation_

![Lumen DELETE operation](https://cdn.auth0.com/blog/lumen/delete-author.png)
_Author DELETE operation_

Our API works. Awesome!

## Lumen API Validation

When developing applications, never trust the user. Always validate incoming data. In Lumen, it's very easy to validate your application's incoming data. Lumen provides access to the `$this->validate` helper method from within Route closures.

Open up the `AuthorController` file and add modify the `create` method like so:

```php
...
 public function create(Request $request)
    {
        $this->validate($request, [
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'location' => 'required|alpha'
        ]);

        $author = Author::create($request->all());

        return response()->json($author, 201);
    }
...
```

Test the API POST route with Postman.

![Lumen API Validation](https://cdn.auth0.com/blog/lumen/validation.png)

It validated the incoming requests and returned the appropriate error message. 

* _name_, _email_, and _location_ were required. In testing the API, _name_ and _email_ were not provided.
* _email_ was required to be in email format.
* _location_ was required to be entirely alphabetic characters, `alpha`. Nothing more. Numbers were provided as the value for _location_.

> **Note**: Always validate incoming data. Never trust your users!

Check out [a plethora of validation rules](https://laravel.com/docs/5.5/validation#available-validation-rules) that you can use with Lumen.

## Securing the Authors API with Auth0

Right now, anyone can make `GET` and `POST` requests to all of the endpoints present in our API. In a real-world scenario, we should restrict `POST`, `DELETE` and `PUT` requests to certain registered and authorized users.

We'll go ahead and secure some of these API endpoints with [JSON Web Tokens](https://jwt.io).

JSON Web Tokens, commonly known as JWTs, are tokens that are used to authenticate users on applications. This technology has gained popularity over the past few years because it enables backends to accept requests simply by validating the contents of these JWTs. That is, applications that use JWTs no longer have to hold cookies or other session data about their users. This characteristic facilitates scalability while keeping applications secure.

Whenever the user wants to access a protected route or resource (an endpoint), the user agent must send the JWT, usually in the _Authorization_ header using the [Bearer schema](http://self-issued.info/docs/draft-ietf-oauth-v2-bearer.html), along with the request.

When the API receives a request with a JWT, the first thing it does is to validate the token. This consists of a series of steps, and if any of these fails then, the request must be rejected. The following list shows the validation steps needed:

* Check that the JWT is well formed.
* Check the signature.
* Validate the standard claims.
* Check the Client permissions (scopes).

We will make use of Auth0 to issue our JSON Web Tokens. With Auth0, we have to write just a few lines of code to get a solid [identity management solution](https://auth0.com/docs/identityproviders), including [single sign-on](https://auth0.com/docs/sso/single-sign-on), [user management](https://auth0.com/docs/user-profile), support for [social identity providers (like Facebook, GitHub, Twitter, etc.)](https://auth0.com/docs/identityproviders), [enterprise (Active Directory, LDAP, SAML, etc.)](https://auth0.com/enterprise), and your [own database of users](https://auth0.com/docs/connections/database/mysql).

For starters, if you haven't done so yet, this is a good time to sign up for a <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">free Auth0 account</a>. Having an Auth0 account, the first thing that we must do is to [create a new API on the dashboard](https://manage.auth0.com/#/apis). An API is an entity that represents an external resource, capable of accepting and responding to protected resource requests made by clients.

> [Auth0 offers a generous **free tier**](https://auth0.com/pricing) to get started with modern authentication.

Login to your Auth0 [management dashboard](https://manage.auth0.com) and create a new API client.

Click on the APIs menu item and then the **Create API** button. You will need to give your API a name and an identifier. The name can be anything you choose, so make it as descriptive as you want.

The identifier will be used to identify your API, this field cannot be changed once set. For our example, I'll name the API, **Authors API**, and for the identifier, I'll set it as **https://authorsapi.com**. We'll leave the signing algorithm as **RS256** and click on the **Create API** button.

![New API to be created](https://cdn.auth0.com/blog/loopback/newapitobecreated.png)
_Create a New API_

![Authors API](https://cdn.auth0.com/blog/lumen/authorsapi.png)
_Creating the Authors API_

![Define the scopes](https://cdn.auth0.com/blog/lumen/authorscopes.png)
_You can define scopes in this section_

Head over to your terminal and install Auth0 PHP SDK:

```bash
composer require auth0/auth0-php:~5.0
```

Create a new middleware file, `Auth0Middleware.php` in the `app/Http/Middleware` directory. Add the following code to it like so:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Auth0\SDK\JWTVerifier;

class Auth0Middleware
{
    /**
     * Run the request filter.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if(!$request->hasHeader('Authorization')) {
          return response()->json('Authorization Header not found', 401);
        }

        $token = $request->bearerToken();

        if($request->header('Authorization') == null || $token == null) {
          return response()->json('No token provided', 401);
        }

        $this->retrieveAndValidateToken($token);
        
        return $next($request);
    }

    public function retrieveAndValidateToken($token)
    {
        try {
            $verifier = new JWTVerifier([
              'supported_algs' => ['RS256'],
              'valid_audiences' => ['AUTH0_API_AUDIENCE'],
              'authorized_iss' => ['AUTH0_DOMAIN']
            ]);

            $decoded = $verifier->verifyAndDecode($token);
        }
        catch(\Auth0\SDK\Exception\CoreException $e) {
            throw $e;
        };
    }

}
```

In the `retrieveAndValidateToken` method, we created an instance of `JWTVerifier` to verify the token coming from the Authorization header. It checks the algorithm, the API audience, and the issuer to ensure the token is a valid one issued by Auth0.

**Note:** Replace the `AUTH0_API_AUDIENCE` and `AUTH0_DOMAIN` placeholders with the API audience and Auth0 domain values from your Auth0 dashboard.

Now, we want to assign the newly created middleware to our routes. The first step is to assign the middleware a short-hand key in `bootstrap/app.php` file's call to the `$app->routeMiddleware()` method.

Go ahead and open up `bootstrap/app.php` and uncomment this line of code:

```php
...
// $app->routeMiddleware([
//     'auth' => App\Http\Middleware\Authenticate::class,
// ]);
...
```

Once uncommented, replace the `Authenticate::class` with `Auth0Middleware::class` like so:

```php
$app->routeMiddleware([
    'auth' => App\Http\Middleware\Auth0Middleware::class,
]);
```
Once the middleware has been defined in the HTTP kernel, as we have done above. We can now use the middleware key in the route options array in the `routes/web.php` file like so:

```php
...
$router->group(['prefix' => 'api', 'middleware' => 'auth'], function () use ($router) {
  $router->get('authors',  ['uses' => 'AuthorController@showAllAuthors']);

  $router->get('authors/{id}', ['uses' => 'AuthorController@showOneAuthor']);

  $router->post('authors', ['uses' => 'AuthorController@create']);

  $router->delete('authors/{id}', ['uses' => 'AuthorController@delete']);

  $router->put('authors/{id}', ['uses' => 'AuthorController@update']);
});
```

We just secured all the API endpoints with JWT. If a user accesses these API endpoint/route without a valid access token or no token at all, it returns an error. Try it out.

![Authorization Header not found](https://cdn.auth0.com/blog/lumen/authorizationheadernotfound.png)
_Accessing any endpoint without an authorization header_


![No token provided](https://cdn.auth0.com/blog/lumen/notokenfound.png)
_Accessing any endpoint without any token provided_


![Invalid token exception](https://cdn.auth0.com/blog/lumen/invalidtokenexception.png)
_Accessing any endpoint without a valid access token_


Now, let's test it with a valid access token. Head over to the `test` tab of your newly created API on your Auth0 dashboard.

Grab the Access token from the _Test_ tab

![Get the Access token](https://cdn.auth0.com/blog/lumen/obtaintoken.png)
_Grab the Access Token_

Now use this `access token` in Postman by sending it as an Authorization header to make a POST request to `api/people` endpoint.

![Accessing the endpoint securely](https://cdn.auth0.com/blog/keystonejs/authorizationbearer.png)
_Accessing the endpoint securely_

It validates the access token and successfully makes the POST request.

Wondering how to integrate the secure API with a frontend? Check out our amazing [React](https://auth0.com/blog/reactjs-authentication-tutorial/) and [Vue.js authentication tutorials](https://auth0.com/blog/vuejs2-authentication-tutorial/).


## Conclusion

Well done! You have learned how to build and secure a rest API with the powerful PHP micro-framework, Lumen, and JWT. Need to use PHP to build your API or micro-service? I'd bet on Lumen as the tool of choice for speed and ease of use.

In addition, Auth0 can help secure your **API** easily. Auth0 provides more than just username-password authentication. It provides features like [multifactor auth](https://auth0.com/multifactor-authentication), [breached password detection](https://auth0.com/breached-passwords), [anomaly detection](https://auth0.com/docs/anomaly-detection), [enterprise federation](https://auth0.com/docs/identityproviders), [single sign on (SSO)](https://auth0.com/docs/sso), and more. <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">Sign up</a> today so you can focus on building features unique to your app.

Please, let me know if you have any questions or observations in the comment section. 😊
