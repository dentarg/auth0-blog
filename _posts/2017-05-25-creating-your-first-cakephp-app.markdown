---
layout: post
title: "Creating your first CakePHP app and adding authentication"
description: Learn how to build your first CakePHP application and add authentication to it.
date: 2017-05-26 5:00
category: Technical Guide, PHP, CakePHP
author:
  name: Prosper Otemuyiwa
  url: https://twitter.com/unicodeveloper?lang=en
  avatar: https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200
  mail: prosper.otemuyiwa@auth0.com
design:
  bg_color: "#4A4A4A"
  image: https://cdn.auth0.com/blog/laravel-auth/logo.png
tags:
- cakephp
- api
- jwt
- authentication
- web-app
- auth0
related:
- 2016-06-23-creating-your-first-laravel-app-and-adding-authentication
- 2016-04-13-authentication-in-golang
- 2016-06-02-ruby-authentication-secure-rack-apps-with-jwt
---

---

**TL;DR:** CakePHP is a PHP framework that makes building web applications faster and simpler. It possesses a powerful scaffolding system that reduces development time when building simple or complex systems. Currently, [CakePHP](https://github.com/cakephp/cakephp) has over 7,000 stars on [Github](https://github.com) and a lot of organizations around the world use it to build great apps. In this tutorial, I'll show you how to build a web application with CakePHP and add authentication to it. Check out the [repo](https://github.com/auth0-blog/cakephp-auth0-got) to get the code.

---

**CakePHP** was developed by [Larry Masters](https://twitter.com/PhpNut). It emerged around 2005 as the first-ever PHP MVC framework. CakePHP has grown and evolved over the past decade as a prominent and go-to PHP framework in PHP userland. It is currently being maintained by the [CakePHP team](https://github.com/cakephp/cakephp/graphs/contributors). **CakePHP** ships with a lot of features out of the box, just like Laravel. These features include:

* A built-in ORM that combines the power of ActiveRecord and DataMapper patterns
* Caching
* Authentication
* Scaffolding
* Built-in Validation

In January, 2017, [**Oven**](https://github.com/CakeDC/oven) was released by the CakePHP team. Oven is a tool for installing CakePHP without breaking a sweat. Just recently, a few days ago to be precise, the CakePHP team tagged the latest release of the framework, *CakePHP 3.4.7*, otherwise known as Red Velvet. Tasty! It is a maintenance release for the 3.4 branch that fixes several issues submitted by developers. Checkout the [changelog here](https://github.com/cakephp/cakephp/compare/3.4.6...3.4.7).

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Oven - The easiest way to install CakePHP <a href="https://t.co/21ACYRzfov">pic.twitter.com/21ACYRzfov</a></p>&mdash; Larry E. Masters (@PhpNut) <a href="https://twitter.com/PhpNut/status/820026500510523393">January 13, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">We have officially released Oven for <a href="https://twitter.com/hashtag/CakePHP?src=hash">#CakePHP</a> You can get it here. <a href="https://t.co/VNpyrgtbnx">https://t.co/VNpyrgtbnx</a> Please let us know how you like it. <a href="https://t.co/nCalCwFEYO">pic.twitter.com/nCalCwFEYO</a></p>&mdash; Larry E. Masters (@PhpNut) <a href="https://twitter.com/PhpNut/status/821056232639315968">January 16, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

CakePHP also comes with a set of conventions to guide you in developing your application. It adopts the popular mantra that the Rails community is known for, *Convention over Configuration*.

{% include tweet_quote.html quote_text="Oven is a tool for installing CakePHP without breaking a sweat" %}

We'll be building a simple character listing app with **CakePHP 3.4**. Our app will simply list **10 Game of Thrones characters** and their real names. Once we add authentication to the app, all logged-in users will have the privilege of knowing these celebrity characters personally.


## Let's get started

CakePHP utilizes [Composer](http://getcomposer.org/) to manage its dependencies. So, before using CakePHP, make sure you have Composer installed on your machine. We can install CakePHP by issuing the Composer `create-project` command in your terminal:

```bash

composer create-project --prefer-dist cakephp/app got

```

or simply use **Oven**. In this tutorial, we'll use composer so that we can all get along easily. So go ahead and run the command above.

During the install, you might come across this error message:

![ext-int missing](https://cdn.auth0.com/blog/cakephpgot/intlmissing.png)
_intl extension missing from your system_

Fear not! You simply need to enable the `intl` PHP extension in your PHP configuration.

As a Mac user like me, you can:

* Install the `intl` extension via homebrew: `brew install php71-intl`. If you are uing a lesser version of PHP like 5.6, then it will be `brew install php56-intl`.
* Restart apache `sudo apachectl restart`.

As a Linux user, you can:

* Install the intl extension:`sudo apt-get install php71-intl`. Use `sudo yum install php71-intl` if you are on CentOS or Fedora.
* Restart apache:`sudo service apache2 restart`.

As a Window & Xampp user, you can:

* Open your `php.ini` file and change `;extension=php_intl.dll` to `extension=php_intl.dll`
* Copy all the `xampp/php/ic*.dll` files to `xampp/apache/bin`.
* Restart Apache server

Let's check out the directory structure of our newly scaffolded project, **got** .

## Explore Directory Structure

CakePHP applications follow the **Model-View-Controller** design pattern.

![Model View Controller Diagram](https://cdn.auth0.com/blog/laravel-auth/mvc-diagram.png)

*(Source: [Self Taught Coders](https://selftaughtcoders.com))*

In a nutshell,

  * **Models** query your database and returns the necessary data.
  * **Views** are pages that render data
  * **Controllers** handle user requests, retrieve data from the Models and pass them unto the views.

Read more about [MVC](http://www.tomdalling.com/blog/software-design/model-view-controller-explained/) here.

Let's checkout the directory structure of our CakePHP app. It contains the following directories and files:

* `bin` - contains all the CakePHP console executables.
* `config` - contains the configuration files CakePHP uses.
* `logs` - contains your application log files.
* `plugins` - contains your application plugins.
* `src` - contains your controllers, models, templates and views
* `tests` - contains all your test files
* `tmp` - temporary data is stored here. It also houses session information.
* `vendor` - contains the application dependencies. All the packages installed via composer.json reside here.
* `webroot` - contains all the files you want to be publicly reachable.
* `.htaccess`
* `composer.json` - composer file that houses the list and versions of PHP packages that your application depends on.
* `composer.lock` - composer file that locks down specific versions of installed PHP packages.
* `index.php`

## Setting Up The Controller

Open up your terminal and run the command below to create a `ListController`.

```bash
bin/cake bake controller List
```

The `bake` command generates a new controller with the `index`, `view`, `add`, `edit` and `delete` methods.

Open up `src/controller/ListController.php` and configure it like so:

```php
<?php

namespace App\Http\Controllers;

class ListController extends Controller
{
    public function index()
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

        $this->set(compact('characters'));
    }
}
```

Delete all other methods. We don't need it in this application.

`$this->set(compact('characters'))` indicates that the `characters` variable has been assigned to the view using the `set` method. It will hand down the query object collection to the view to be invoked with a foreach iteration. Let's create the view that will handle this controller.

## Setting Up The View

CakePHP views are just presentation-flavored fragments that fit inside an application’s layout. For most applications, they’re HTML mixed with PHP, but they may end up as XML, CSV, or even binary data.

CakePHP’s template files are stored in `src/Template` inside a folder named after the controller they correspond to (we’ll have to create a folder named ‘List’ in this case). Go ahead and create a `List` folder in `src/Template` directory. Next, create an `index.ctp` file and add this to it:

{% highlight html %}
{% raw %}
<div class="container">
    <div class="row">
        <div class="col-md-10 col-md-offset-1">
            <div class="panel panel-success">
                <div class="panel-heading">List of Game of Thrones Characters</div>


                      <!-- Table -->
                      <table class="table">
                          <tr>
                              <th>Character</th>
                              <th>Real Name</th>
                          </tr>
                          <?php foreach($characters as $key => $value): ?>
                            <tr>
                              <td><?= $key ?></td><td><?= $value ?></td>
                            </tr>
                          <?php endforeach; ?>
                      </table>



            </div>
        </div>
    </div>
</div>
{% endraw %}
{% endhighlight %}

## Setting Up The Model

Laravel Models are stored by default in the root of the `app` directory. The `User` model ships with the Laravel framework. Only the `User` model is needed in this application so we won't create any additional models. However, if you want to create more models, you can simply run the command below like so:

```bash
php artisan make:model <modelName>
```

where `<modelName>` represents the name of the Model you want to create.

## Setting Up The Routes

Open up `config/routes.php` and configure it like so:

```php
...
...
Router::scope('/', function (RouteBuilder $routes) {
    /**
     * Here, we are connecting '/' (base path) to a controller called 'Pages',
     * its action called 'display', and we pass a param to select the view file
     * to use (in this case, src/Template/Pages/home.ctp)...
     */

    $routes->connect('/', ['controller' => 'List', 'action' => 'index']);

    /**
     * Connect catchall routes for all controllers.
     *
     * Using the argument `DashedRoute`, the `fallbacks` method is a shortcut for
     *    `$routes->connect('/:controller', ['action' => 'index'], ['routeClass' => 'DashedRoute']);`
     *    `$routes->connect('/:controller/:action/*', [], ['routeClass' => 'DashedRoute']);`
     *
     * Any route class can be used with this method, such as:
     * - DashedRoute
     * - InflectedRoute
     * - Route
     * - Or your own route class
     *
     * You can remove these routes once you've connected the
     * routes you want in your application.
     */
    $routes->fallbacks(DashedRoute::class);
});
...
...
```

Delete the pages route. We don't need it.

Once a request hits the `/` route, it invokes the `index` method of the `ListController` and renders the returned value in the `index` view of the `List` template directory.

## Configuring the database

This application will require some info about users to be stored in the database since we intend setting up authentication. We'll set up the underlying MySQL database for our game of thrones app.

Open up **config/app** file, and scroll down to the `DataSources` key. Put in the username and password for accessing your MySQL database. Also, create a database called `got` and reference the name here:

```php
...
...
  /**
     * Connection information used by the ORM to connect
     * to your application's datastores.
     * Do not use periods in database name - it may lead to error.
     * See https://github.com/cakephp/cakephp/issues/6471 for details.
     * Drivers include Mysql Postgres Sqlite Sqlserver
     * See vendor\cakephp\cakephp\src\Database\Driver for complete list
     */
    'Datasources' => [
        'default' => [
            'className' => 'Cake\Database\Connection',
            'driver' => 'Cake\Database\Driver\Mysql',
            'persistent' => false,
            'host' => 'localhost',
            /**
             * CakePHP will use the default DB port based on the driver selected
             * MySQL on MAMP uses port 8889, MAMP users will want to uncomment
             * the following line and set the port accordingly
             */
            //'port' => 'non_standard_port_number',
            'username' => 'root',
            'password' => '',
            'database' => 'got',
            'encoding' => 'utf8',
            'timezone' => 'UTC',
            'flags' => [],
            'cacheMetadata' => true,
            'log' => false,

            /**
             * Set identifier quoting to true if you are using reserved words or
             * special characters in your table or column names. Enabling this
             * setting will result in queries built using the Query Builder having
             * identifiers quoted when creating SQL. It should be noted that this
             * decreases performance because each query needs to be traversed and
             * manipulated before being executed.
             */
            'quoteIdentifiers' => false,

            /**
             * During development, if using MySQL < 5.6, uncommenting the
             * following line could boost the speed at which schema metadata is
             * fetched from the database. It can also be set directly with the
             * mysql configuration directive 'innodb_stats_on_metadata = 0'
             * which is the recommended value in production environments
             */
            //'init' => ['SET GLOBAL innodb_stats_on_metadata = 0'],

            'url' => env('DATABASE_URL', null),
        ],
...
...
```

You can check if you are connected to the database by simply checking the default landing page that was shipped with the CakePHP installation:

![Connect to database](https://cdn.auth0.com/blog/cakephp/connect_to_database.png)
_Connected to database_

> Mac Users can use SequelPro to manager their database.

**Note:** You would have to refactor the route code to point back to the `Pages` controller.


## Setting Up Authentication

Authentication is the process of identifying users by provided credentials and ensuring that users are who they say they are. Let's set it up in our app. CakePHP provides different ways of authenticating users in your app:

* **FormAuthenticate** - User authentication via form POST data.
* **BasicAuthenticate** - User authentication via Basic HTTP authentication.
* **DigestAuthenticate** - User authentication via Digest HTTP authentication.

In our app, we'll use **FormAuthenticate**. Thankfully, CakePHP's `AuthComponent` supports it by default.

CakePHP doesn't have a full-fledged built-in auth system like Laravel. So, a developer has the option of using the `AuthComponent` and then configuring it with forms, views, controllers and models or pulling in ready made full-fledged auth plugins like the ones listed in [Friends of Cake GitHub repository](https://github.com/FriendsOfCake/awesome-cakephp#authentication-and-authorization).

![CakePHP issue about built-in auth](https://cdn.auth0.com/blog/cakephp/authissue.png)
_CakePHP built-in auth issue_

Go ahead and create the users table in the database:

```bash
CREATE TABLE users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    emailaddress VARCHAR(255),
    password VARCHAR(255),
    role VARCHAR(20),
    created DATETIME DEFAULT NULL,
    modified DATETIME DEFAULT NULL
);
```

> It is advisable to use a tool like PHPMyAdmin or SequelPro, so that you can just paste the query in the tool and run it rather than using the command line.

![Create users table](https://cdn.auth0.com/blog/cakephp/createuserstable.png)
_Create users table_

The next step is to create our `UsersTable` class. Open up `src/Model/Tables` directory and create a file, `UsersTable.php`. Now add this code to it:

```php
<?php

namespace App\Model\Table;

use Cake\ORM\Table;
use Cake\Validation\Validator;

class UsersTable extends Table
{

    public function validationDefault(Validator $validator)
    {
        return $validator
            ->notEmpty('emailaddress', 'An email address is required')
            ->notEmpty('password', 'A password is required');
    }

}
```

Next, create the `UsersController` using the bake command:

```bash
bin/cake bake controller Users
```








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
