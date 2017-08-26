---
layout: post
title: "Building an app with Nette and adding authentication"
description: Learn how to build your first Nette application and add authentication to it.
date: 2017-08-25 8:30
category: Technical Guide, PHP, Nette
author:
  name: Prosper Otemuyiwa
  url: https://twitter.com/unicodeveloper?lang=en
  avatar: https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200
  mail: prosper.otemuyiwa@auth0.com
design:
  bg_color: "#4A4A4A"
  image: https://cdn.auth0.com/blog/laravel-auth/logo.png
tags:
- laravel
- api
- jwts
- authentication
- web-app
- auth0
related:
- 2015-11-13-build-an-app-with-vuejs
- 2016-04-13-authentication-in-golang
- 2016-06-02-ruby-authentication-secure-rack-apps-with-jwt
---

---

**TL;DR:** L In this tutorial, I'll show you how easy it is to build a web application with Nette and add authentication to it. Check out the [repo](https://github.com/auth0/nette-auth0-got) to get the code.


**TL;DR:** Laravel is a great PHP framework. Currently, it is the most starred PHP project on [Github](https://github.com) and a lot of companies and people all over the world use it to build amazing applications. In this tutorial, I'll show you how easy it is to build a web application with Laravel and add authentication to it without breaking a sweat. Check out the [repo](https://github.com/auth0/laravel-auth0-got) to get the code.



---

**Nette** is a free, open-source PHP framework designed for building web applications. **Nette** is a set of decoupled and reusable PHP packages that will make your work easier. And **Nette** is also known as the quick and comfortable web development in PHP because it has the tools that allows you to bang out PHP applications rather quickly. **Nette** has a bundle of tools that makes it one of the popular PHP frameworks out there. These tools include:

* Tracy
* Latte
* Tester

* **Tracy:** is a library that helps you to log errors, dump variables, observe memory consumption and measure execution time of scripts and queries. After activating Tracy on your web application, a debugger bar shows up.

![Tracy debug bar](https://files.nette.org/git/tracy/tracy-bar.png)
_Tracy debug bar_

This tool also provides the `Debugger::dump()` function which dumps the content of a variable far better than `var_dump`. Logging with Tracy will involve invoking the `Debugger::log()` function. In production mode, Tracy automatically captures all errors and exceptions into a text log.

Another useful development magic Tracy offers is the debugger stopwatch with a precision of microseconds. Just call the `Debugger::timer()` function. For multiple measurements, you can write code like this:

```php
Debugger::timer('pdf-making');
// some code

Debugger::timer('excel-making');
// some code

$excelMakingElapsed = Debugger::timer('excel-making');
$pdfMakingElapsed = Debugger::timer('pdf-making');
```

Tracy also has an integration with [Firelogger](https://addons.mozilla.org/cs/firefox/addon/firelogger/). Understand more about how tracy works by visiting the [documentation](https://tracy.nette.org/) for more information.

* **Latte:** is a template engine for PHP. It has intuitive syntax and compiles templates to plain optimized PHP code.

```php
<ul n:if="$items">
{foreach $items as $item}
    <li id="item-{$iterator->counter}">{$item|capitalize}</li>
{/foreach}
</ul>
```

The best way to install Latte is via composer.

```bash
composer require latte/latte
```

And activate it by invoking it like:

```php
$latte = new Latte\Engine;

$latte->setTempDirectory('/path/to/tempdir');

$parameters['items'] = ['one', 'two', 'three'];

// render to output
$latte->render('template.latte', $parameters);
// or render to string
$html = $latte->renderToString('template.latte', $parameters);
```

Latte has a set of standard filters. You can call a filter by using thhe pipe symbol. Check out the code below:

```php
<h1>{$heading|upper}</h1>
<h1>{$heading|lower|capitalize}</h1>
<h1>{$heading|truncate:20,''}</h1>
``

You can add a custom filter by calling the `addFilter` function on Latte:

```php
$latte = new Latte\Engine;

$latte->addFilter('clear', function ($str) {
    return trim($str, 'Sd'); // eliminates Sd from the string
});
```

Then we can use it in a template like this:

```php
<p>{$sentence|clear}</p>
```

Understand more about how Latte works by visiting the [documentation](https://latte.nette.org) for more information.

* **Tester:** is a productive and enjoyable unit testing framework developed by the Nette team. It is used by the Nette framework for testing. It offers lots of Assertion helpers and annotations for TestCase methods. Understand more about how Tester works by visiting the [documentation](https://tester.nette.org) for more information.

**Nette**  has a [collection of plugins and extensions](https://componette.com) for easy use in your application. It also has an [active community](https://forum.nette.org).

We'll be building a simple character listing app with **Nette**. Our app will simply list **10 Game of Thrones characters** and their real names. Once we add authentication to the app, all logged-in users will have the privilege of knowing these celebrity characters personally.

**Note:** Check out how we built this small secure app with [Laravel](https://auth0.com/blog/creating-your-first-laravel-app-and-adding-authentication/).

## Let's get started

Nette utilizes [Composer](http://getcomposer.org/) to manage its dependencies. So, before using Nette, make sure you have Composer installed on your machine. We can install Nette by issuing the Composer `create-project` command in your terminal like so: `composer create-project nette/web-project GOT`.

If you are developing on a Mac OS X or Linux, you need to configure write privileges to the web server by doing `cd GOT && chmod -R a+rw temp log`.

## Explore Directory Structure

The app directory is the **bulk** of your Nette application. It houses the following directories:

![Nette Directory Structure](https://cdn.auth0.com/blog/loopback/nettedirectorystructure.png)

  * `config` - Contains all your configuration files such as database connection, session expirty time et.c
  * `presenters` - Contains all your presenter classes and templates
  * `router` - Contains configuration for your app URLs.

The other directories namely:

  * `log` contains your framework autoloading files and generated cache files
  * `temp` contains your app's configuration files.
  * `vendor` contains your database migrations and seeds.
  * `public` contains your assets(images, JavaScript, css etc).
  * `resources` contains your views and localization files.
  * `storage` contains all your compiled Blade templates, file caches and logs.
  * `tests` contains all your tests.
  * `vendor` contains your app dependencies.


## Setting Up The Controller

Open up your terminal and run the command below to create a `ListController`.

```bash
php artisan make:controller ListController
```

Open up `app/Http/Controllers/ListController.php` and configure it like so:

```php
<?php

namespace App\Http\Controllers;

class ListController extends Controller
{
    public function show()
    {
       $characters = [
         'Daenerys Targaryen' => 'Emilia Clarke',
         'Jon Snow'           => 'Kit Harington',
         'Arya Stark'         => 'Maisie Williams',
         'Melisandre'         => 'Carice van Houten',
         'Khal Drogo'         => 'Jason Momoa',
         'Tyrion Lannister'   => 'Peter Dinklage',
         'Ramsay Bolton'      => 'Iwan Rheon',
         'Petyr Baelish'      => 'Aidan Gillen',
         'Brienne of Tarth'   => 'Gwendoline Christie',
         'Lord Varys'         => 'Conleth Hill'
       ];

       return view('welcome')->withCharacters($characters);
    }
}
```

`view('welcome')->withCharacters($characters)` indicates that we are passing the `$characters` array to a view called `welcome.blade.php`. We'll create that view in the later part of this post.

## Setting Up The Model

Laravel Models are stored by default in the root of the `app` directory. The `User` model ships with the Laravel framework. Only the `User` model is needed in this application so we won't create any additional models. However, if you want to create more models, you can simply run the command below like so:

```bash
php artisan make:model <modelName>
```

where `<modelName>` represents the name of the Model you want to create.

## Setting Up The Routes

Open up `app/Http/routes.php` and configure it like so:

```php
/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', 'ListController@show');
```

Once a request hits the `/` route, it invokes the `show` method of the `ListController` and renders the returned value in the `welcome` view. We'll configure the `welcome` view later in this post.

## Setting Up Authentication

One fascinating thing about Laravel is that it comes with authentication out of the box. You just have to configure it. Next, open up your terminal and run this command like so:

```bash
php artisan make:auth
```

Be careful enough to only do this on fresh applications.

<img width="1008" alt="screen shot 2016-06-19 at 2 34 10 pm" src="https://cloud.githubusercontent.com/assets/2946769/16177617/f0ff3406-362a-11e6-9144-1393c8031f2b.png">

As you can see, some files have been copied into our application, the routes have also been updated. The route file has been populated with additional information like so:

<img width="658" alt="screen shot 2016-06-19 at 3 22 39 pm" src="https://cloud.githubusercontent.com/assets/2946769/16177907/d9f07318-3631-11e6-997c-48f35aeb7107.png">

`Route::auth()` is a method that cleanly encapsulates all the login and register routes.

Now, the views needed for authentication are in the `resources/views/auth` directory. The base layout for our application has also been configured in the `resources/views/layouts` directory. All of these views use the Bootstrap CSS framework, but you are free to customize them however you wish.

Open up your `welcome.blade.php` and configure it like so:

{% highlight html %}
@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-10 col-md-offset-1">
            <div class="panel panel-success">
                <div class="panel-heading">List of Game of Thrones Characters</div>

                    @if(Auth::check())
                      <!-- Table -->
                      <table class="table">
                          <tr>
                              <th>Character</th>
                              <th>Real Name</th>
                          </tr>
                          @foreach($characters as $key => $value)
                            <tr>
                              <td>{{ $key }}</td><td>{{ $value }}</td>
                            </tr>
                          @endforeach
                      </table>
                    @endif


            </div>
            @if(Auth::guest())
              <a href="/login" class="btn btn-info"> You need to login to see the list 😜😜 >></a>
            @endif
        </div>
    </div>
</div>
@endsection
{% endhighlight %}

Here, we are looping through the `$characters` array data passed from the `ListController` for appropriate rendering in the `welcome` view.

`Auth::check()` - You can check if a user is authenticated or not via this method from the `Auth` Facade. It returns true if a user is logged-in and false if a user is not. Check [here](https://laravel.com/docs/5.2/facades) to know how Facades work in Laravel.

`Auth::guest()` - This does the opposite of `Auth::check()`. It returns true if a user is not logged-in and false if a user is logged-in. Check [here](https://laravel.com/api/5.2/Illuminate/Auth/Guard.html) to see all the methods you can call on the `Auth` Facade.

Now that we have all the routes and views setup, your application should look like this:

_Landing Page_

![Landing Page](https://cdn.auth0.com/blog/laravel-auth/landing-page.png)

_Login Page_

![Login Page](https://cdn.auth0.com/blog/laravel-auth/login-page.png)

_Register Page_

![Register Page](https://cdn.auth0.com/blog/laravel-auth/register-page.png)

## Run Migrations

Migrations are like version control for your database, allowing a team to easily modify and share the application's database schema. In **Laravel**, they are placed in the `database/migrations` directory. Each migration file name contains a timestamp which allows **Laravel** to determine the order of the migrations.

Luckily for us, the user migration files comes by default with a fresh **Laravel** install. Check the `database/migrations` directory to ensure you have at least two migration files named `xxx_create_users_table.php` and `xxx_create_password_resets_table.php` where `xxx` represents the timestamp.

Now, run this command from your terminal:

```bash
php artisan migrate
```
The `users` and `password_resets` table will be created on running this command. Ensure the appropriate database name has been set in your `.env` file. The value should be assigned to this `DB_DATABASE` constant.

## Path Customization

Open up `AuthController.php` in `app/Http/Controllers/Auth` directory. There is a `$redirectTo` variable like so:

```php
/**
* Where to redirect users after login / registration.
*
* @var string
*/
protected $redirectTo = '/';
```
It can be configured to whatever route you want the user to be redirected to just after registration or login. In our case, the user should be redirected to the landing page, so we don't need to change anything.

Now, go ahead and register. It should register you successfully and log you in like so:

![Landing Page while authenticated](https://cdn.auth0.com/blog/laravel-auth/landing-authenticated.png)


## Using the Auth Middleware

Middlewares provide a convenient mechanism for filtering HTTP requests entering your application. For example, **Laravel** includes a middleware that verifies the user of your application is authenticated. If the user is not authenticated, the middleware will redirect the user to the login screen. However, if the user is authenticated, the middleware will allow the request to proceed further. The `app/Http/Middleware` directory contains several middleware.

Let's check out how the `auth` middleware works.

Add a new route to your `routes.php` file like so:

```php
Route::get('/got', [
  'middleware' => ['auth'],
  'uses' => function () {
   echo "You are allowed to view this page!";
}]);
```
Now, log out, then try to access that route, you will be redirected back to the `/login` route. The Laravel `auth` middleware intercepted the request, checked if the user was logged-in, discovered that the user was not logged-in, then redirected the user back to the `login` page.

## Aside: Using Auth0 with Laravel

**Auth0** issues [JSON Web Tokens](https://jwt.io/) on every login for your users. This means that you can have a solid [identity infrastructure](https://auth0.com/docs/identityproviders), including [single sign-on](https://auth0.com/docs/sso/single-sign-on), user management, support for social identity providers (Facebook, Github, Twitter, etc.), enterprise identity providers (Active Directory, LDAP, SAML, etc.) and your own database of users with just a few lines of code.

We can easily set up authentication in our Laravel apps by using the [Lock Widget](https://auth0.com/lock). If you don't already have an Auth0 account, [sign up](javascript:signup\(\)) for one now. Navigate to the Auth0 [management dashboard](https://manage.auth0.com/), select **Applications** from the navigational menu, then select the app you want to connect with **Laravel**.

### Step 1: Install and Configure Auth0 plugin

Follow the instructions [here](https://auth0.com/docs/quickstart/webapp/laravel) to configure the Auth0 plugin.

### Step 2: Register the callback

Head over to your Auth0 [dashboard](https://manage.auth0.com/#/applications/) and register a callback like so: `http://laravel-auth0.dev/auth0/callback` and logout URL `http://laravel-auth0.dev/logout`.

Open up your routes and add this:

```php
Route::get('/auth0/callback', function() {
   dd(Auth0::getUser());
});
```

### Step 3: Include Auth0's Lock Widget

Open up `welcome.blade.php` and configure it like so:

{% highlight php %}
@extends('layouts.app')

@section('content')
<script src="//cdn.auth0.com/js/lock/10.0/lock.min.js"></script>
<script type="text/javascript">

  var lock = new Auth0Lock('YOUR_AUTH0_CLIENT_ID', 'YOUR_AUTH0_DOMAIN');


  function signin() {
    lock.show({
        callbackURL: 'YOUR_AUTH0_CALLBACK_URL'
      , responseType: 'code'
      , authParams: {
        scope: 'openid email'  // Learn about scopes: https://auth0.com/docs/scopes
      }
    });
  }
</script>
<button onclick="window.signin();">Login</button>
@endsection
{% endhighlight %}

When the login button is clicked, the auth0 lock widget comes up:

![Auth0 Lock Widget](https://cdn.auth0.com/blog/laravel-auth/auth0-lock.png)


### Step 4: Configure & Use Lock Widget in Routes.php

Add this to your `routes.php` file:

```php
Route::get('/auth0/callback', function() {
   dd(Auth0::getUser());
});
```

Now, once a user registers, it stores the user information in your Auth0 dashboard. We can retrieve this info using the `Auth0::getUser()` method. We can also hook onto the onLogin event using `Auth0::onLogin(function(...))`.

![Access Token](https://cdn.auth0.com/blog/laravel-auth/access-token.png)


Access can be restricted with **Auth0 Middleware**, just add this `'auth0.jwt' => 'Auth0\Login\Middleware\Auth0JWTMiddleware'` in the `$routeMiddleware` array in `app/Http/Kernel.php`. Then use `auth0.jwt` middleware on your routes.

With Auth0, you can have all your users information stored without having to run your own database. You can configure the Lock UI, It provides powerful analytics about users signing up on your platform such as, the browser the user logged in with, the location, device, number of logins and more out of the box!

![User Information](https://cdn.auth0.com/blog/laravel-auth/user-information.png)

**Important API Security Note:** If you want to use Auth0 authentication to authorize _API requests_, note that you'll need to use [a different flow depending on your use case](https://auth0.com/docs/api-auth/which-oauth-flow-to-use). Auth0 `idToken` should only be used on the client-side. [Access tokens should be used to authorize APIs](https://auth0.com/blog/why-should-use-accesstokens-to-secure-an-api/). You can read more about [making API calls with Auth0 here](https://auth0.com/docs/apis).


## Wrapping Up

Well done! You have just built your first app with Laravel. Laravel is an awesome framework to work with. It focuses on simplicity, clarity and getting work done. As we saw in this tutorial, you can easily add authentication to your Laravel apps. This is designed to help you get started on building your own apps with Laravel. You can leverage the knowledge gained here to build bigger and better apps.
Please, let me know if you have any questions or observations in the comment section. 😊
