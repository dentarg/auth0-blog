---
layout: post
title: "Migrating a PHP 5 App to PHP 7 (Tools & Implementation) - Part 3"
description: "Let's go through migrating a simple PHP 5 app to PHP 7"
date: 2017-02-09 8:30
category: Technical Guide, PHP, Tools
author:
  name: "Prosper Otemuyiwa"
  url: "http://twitter.com/unicodeveloper?lang=en"
  mail: "prosper.otemuyiwa@auth0.com"
  avatar: "https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200"
design:
  image: https://cdn.auth0.com/blog/migration/PHPlogo.png
  bg_color: "#312A4C"
tags:
- php5
- php7
- migrate
related:
- 2016-11-07-migrating-a-php5-app-to-7
- 2016-11-09-migrating-a-php5-app-to-7-part-2
---


**TL;DR:** Many PHP applications are still running on PHP 5.x, not ready to take full advantage of the awesome features that PHP 7 offers. A lot of developers have not made the switch because of certain fears of compatibility issues, migration challenges and the strange awkward feeling that migrating will take away a big chunk of their time. In the [first part of this tutorial](https://auth0.com/blog/migrating-a-php5-app-to-php7-part-one) we learned how to set up a PHP 7 development environment. In [the second part of this tutorial](https://auth0.com/blog/migrating-a-php5-app-to-php7-part-two), we discussed extensively about all the new features PHP 7 offers and the language constructs and features that have been either removed or deprecated. This time, we'll show you how you can leverage all the new PHP 7 features when migrating and also the tools that will help to make the process painless!

---

You need to be aware that for the most part, PHP 5.x code can run on PHP 7. In PHP 7, there are some backwards incompatible changes, so applications built with PHP 5.x that use functions and language constructs that have been removed or have the internal implementation changed drastically will spit out errors while trying to run on PHP 7. 

## Tools to Aid Migration

One of the most frustating part of our jobs as software developers is having to work on large old codebases. In a situation where you are tasked with migrating a large PHP 5.x application that has probably been in existence for about 10 years, how would you go about it?

The easiest and most obvious way of migrating is to initially clone the app on your local machine, install PHP 7 and run the app. You can walk through the errors and deperaction warnings shown in the terminal, and manually fix them step-by-step by incorporating PHP 7 features. This can be very challenging and time consuming. Why can't we automate this process?

Currently there is no tool out there that performs a 100% automatic conversion of your PHP 5.x codebase to PHP 7, but these tools below will help in making your migration painless.

### PHP 7 MAR

[php7mar](https://github.com/Alexia/php7mar) is a command-line tool that generates reports on PHP 5.x codebase based on PHP 7 compatibility. The reports contain line numbers, issues noted, and suggested fixes along with documentation links.

**Note:** The tool does not fix code. It only gives you reports about all the PHP files in your codebase. Happy fixing!

### PHP 7 Compatibility Checker

[php7cc](https://github.com/sstalle/php7cc) is a command-line tool designed to make migration from PHP 5.3 - 5.6 to PHP 7 really easy. php7cc reports:

* **Errors:** Fatal, Syntax, Notice. These are highlighted in red.
* **Warnings:** These are highlighted in yellow.

### Phan

[phan](https://github.com/etsy/phan) is a static analyzer for PHP that attempts to prove incorrectness rather than correctness. Phan looks for common issues and verifies type compatibility on various operations when type information is available or can be deduced. Phan checks for lots of things including PHP7/PHP5 backward compatibility.

### phpto7aid

[phpto7aid](https://github.com/gisostallenberg/php-to-7-aid) is a tool that is used to identify PHP 5 code that will not work in PHP 7. It tries to aid you as much as possible in resolving these issues, by either providing the exact solution or giving hints on how to solve the issue.

### PhpStorm PHP 7 Compatibility Inspection

[PhpStorm](https://www.jetbrains.com/phpstorm) is a very smart PHP IDE, developed by [Jetbrains](https://www.jetbrains.com). 

![PHPStorm](https://cdn.auth0.com/blog/php/phpstorm_debugging.png)
_Source: Jetbrains.com_

PhpStorm 10 comes with a *PHP 7 Compatibility Inspection* tool that can show you exactly what code is going to cause errors if you are running PHP7.

![PHP 7 Readiness](https://cdn.auth0.com/blog/php/PHP7-Readiness-Inline-2.png)
_Source: Jetbrains.com_

The image below shows a typical example of an application that has classes with names that are reserved in PHP 7. Selecting **Run Inspection By Name** option from the **Code** menu, and then selecting the **PHP 7 Compatibility** section will give you results like this one below:

![PHP 7 Readiness Results](https://cdn.auth0.com/blog/php/PHP7-Readiness-Results.png)
_Source: Jetbrains.com_

## Building a PHP5 App

We will build the first simple PHP 5 app very quickly. This is the scope of the app:

* A user will be able to register on the app.
* A user will be able to log into the app.
* A user will be assigned a random Star Wars Code Name.
* A user will be able to log out of the app.

Building this app will require us to set up a database to store the users, write our registration and login code and manage the users session. Now, we won't employ the use of any framework because we don't want any form of overhead. Ordinarily, building this app would take a lot of time and setup but there is a service we can use to eliminate the hassle. Oh, yeah, Auth0 to the rescue!

### Create and Configure Auth0 Client

First thing we'll need to do is <a href="javascript:signup()">sign up for a free Auth0 account</a> and configure a new client.

Now head over to [clients tab](https://manage.auth0.com/#/clients) and create a new one choosing 'Regular web Application' as the client type. Let's name it as something like 'Basic PHP WebApp'.

Now that we have our client created, we need to take note of three properties: `Domain`, `Client ID` and `Client Secret`. All of them can be found on the `Settings` tab of the client that we've just created.

The last configuration that we need to do, before updating our code, is to add `http://localhost:3000` as an `Allowed Callback URLs` on our Auth0 client.

### Build the App

Create a `composer.json` file in a new directory and add this to it like so:

```js

{
    "name": "basic php webapp",
    "description": "Basic sample for securing a WebApp with Auth0",
    "require": {
         "vlucas/phpdotenv": "2.3.0",
         "auth0/auth0-php": "~4.0"
    },
    "license": "MIT"
}

```
_composer.json_

All we need is the `phpdotenv` package for reading environment variables and the `auth0-php` package that makes it easy to use the Auth0 service.

Create a `public` folder inside the directory and add two files, `app.css` and `app.js` in it.

```css

body {
  font-family: "proxima-nova", sans-serif;
  text-align: center;
  font-size: 300%;
  font-weight: 100;
}
input[type=checkbox],
input[type=radio] {
  position: absolute;
  opacity: 0;
}
input[type=checkbox] + label,
input[type=radio] + label {
  display: inline-block;
}
input[type=checkbox] + label:before,
input[type=radio] + label:before {
  content: "";
  display: inline-block;
  vertical-align: -0.2em;
  width: 1em;
  height: 1em;
  border: 0.15em solid #0074d9;
  border-radius: 0.2em;
  margin-right: 0.3em;
  background-color: white;
}
input[type=radio] + label:before {
  border-radius: 50%;
}
input[type=radio]:checked + label:before,
input[type=checkbox]:checked + label:before {
  background-color: #0074d9;
  box-shadow: inset 0 0 0 0.15em white;
}
input[type=radio]:focus + label:before,
input[type=checkbox]:focus + label:before {
  outline: 0;
}
.btn {
  font-size: 140%;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: 0;
  background-color: #16214D;
  color: white;
}
.btn:hover {
  background-color: #44C7F4;
}
.btn:focus {
  outline: none !important;
}
.btn.btn-lg {
  padding: 20px 30px;
}
.btn:disabled {
  background-color: #333;
  color: #666;
}
h1,
h2,
h3 {
  font-weight: 100;
}
#logo img {
  width: 300px;
  margin-bottom: 60px;
}
.home-description {
  font-weight: 100;
  margin: 100px 0;
}
h2 {
  margin-top: 30px;
  margin-bottom: 40px;
  font-size: 200%;
}
label {
  font-size: 100%;
  font-weight: 300;
}
.btn-next {
  margin-top: 30px;
}
.answer {
  width: 70%;
  margin: auto;
  text-align: left;
  padding-left: 10%;
  margin-bottom: 20px;
}
.login-page .login-box {
  padding: 5px 0;
}

```

_app.css_

```js

$(document).ready(function() {

    var lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN, { auth: {
          redirectUrl: AUTH0_CALLBACK_URL
          , responseType: 'code'
          , params: {
              scope: 'openid'
          }
      }});

    $('.btn-login').click(function(e) {
      e.preventDefault();
      lock.show();
    });
});

```

_app.js_

Go ahead and create a `.htaccess` file inside the directory like so:

```bash

RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . index.php [L]

```

Create a `.env` file. This file will contain our Auth0 credentials.

```bash

AUTH0_DOMAIN='blahabababababa.auth0.com'
AUTH0_CLIENT_ID='xxxxxxxxx'
AUTH0_CLIENT_SECRET='xxxxxxxxx'
AUTH0_CALLBACK_URL='http://localhost:3000'

```

**Note:** Replace these values with the `client_id`, `client_secret` and `domain` from your Auth0 dashboard.

Add the value of `callback_url` to the **Allowed Callback URLs** in your *Settings* on the dashboard.

![Auth0 Dashboard showcasing Callback Url](https://cdn.auth0.com/blog/app/callbackurl.png)
_Auth0 dashboard: Allowed Callback Urls_

Also, do not forget to add the same value to the **Allowed Origins(CORS)** in your *Settings* on the dashboard.

![Auth0 Dashboard showcasing Allowed Origin Cors](https://cdn.auth0.com/blog/app/cors.png)
_Auth0 dashboard: Allowed Origin CORS_


We need a file to invoke the `dotenv` library and load the values that we have deposited in the `.env` file. Create a new file, *dotenv-loader.php* like so:

```php

<?php

  // Read .env
  try {
    $dotenv = new Dotenv\Dotenv(__DIR__);
    $dotenv->load();
  } catch(InvalidArgumentException $ex) {
    // Ignore if no dotenv
  }

```
_dotenv-loader.php_

Finally, let's create the `index.php` file where all our app logic will reside. Like I mentioned earlier, it's just a basic app so don't be worried about separation of concerns.

This is how the file should look like:

{% highlight html %}
<?php

// Require composer autoloader
require __DIR__ . '/vendor/autoload.php';

require __DIR__ . '/dotenv-loader.php';

use Auth0\SDK\API\Authentication;

$domain        = getenv('AUTH0_DOMAIN');
$client_id     = getenv('AUTH0_CLIENT_ID');
$client_secret = getenv('AUTH0_CLIENT_SECRET');
$redirect_uri  = getenv('AUTH0_CALLBACK_URL');

$auth0 = new Authentication($domain, $client_id);

$auth0Oauth = $auth0->get_oauth_client($client_secret, $redirect_uri, [
  'persist_id_token' => true,
  'persist_refresh_token' => true,
]);

$starWarsNames = ['Darth Vader', 'Ahsoka Tano', 'Kylo Ren', 'Obi-Wan Kenobi', 'R2-D2', 'Snoke'];

$userInfo = $auth0Oauth->getUser();

if (isset($_REQUEST['logout'])) {
    $auth0Oauth->logout();
    session_destroy();
    header("Location: /");
}

?>
<html>
    <head>
        <script src="http://code.jquery.com/jquery-3.0.0.min.js" type="text/javascript"></script>
        <script src="https://cdn.auth0.com/js/lock/10.0/lock.min.js"></script>

        <script type="text/javascript" src="//use.typekit.net/iws6ohy.js"></script>
        <script type="text/javascript">try{Typekit.load();}catch(e){}</script>

        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32">
 
        <!-- font awesome from BootstrapCDN -->
        <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet">
        <link href="//maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css" rel="stylesheet">

        <script>
          var AUTH0_CLIENT_ID = '<?php echo getenv("AUTH0_CLIENT_ID") ?>';
          var AUTH0_DOMAIN = '<?php echo getenv("AUTH0_DOMAIN") ?>';
          var AUTH0_CALLBACK_URL = '<?php echo getenv("AUTH0_CALLBACK_URL") ?>';
        </script>


        <script src="public/app.js"> </script>
        <link href="public/app.css" rel="stylesheet">



    </head>
    <body class="home">
        <div class="container">
            <div class="login-page clearfix">
              <?php if(!$userInfo): ?>
              <div class="login-box auth0-box before">
                <img src="https://cdn.auth0.com/blog/app/star_warsapp.png" />
                <p>Heard you don't want to migrate to PHP 7? Dare us!</p>
                <a class="btn btn-primary btn-login">SignIn</a>
              </div>
              <?php else: ?>
              <div class="logged-in-box auth0-box logged-in">
                <h1 id="logo">Star Wars Welcomes You to the Family!</h1>
                <img class="avatar" width="200" src="<?php echo $userInfo['picture'] ?>"/>

                <h2>Welcome <span class="nickname"><?php echo $userInfo['nickname'] ?></span></h2>
                <h2> Assigned Codename : <b><?php echo $starWarsNames[rand(0, 6)]; ?></b> </h2>
                <a class="btn btn-primary btn-lg" href="?logout">Logout</a>
              </div>
              <?php endif ?>
            </div>
        </div>
    </body>
</html>
{% endhighlight %}

Relax, let's analyze the code together.

```php

// Require composer autoloader
require __DIR__ . '/vendor/autoload.php';

require __DIR__ . '/dotenv-loader.php';

```

This is where we require the dotenv loader and composer autoloader. The autoloader makes it possible for us to import any class from the PHP packages installed in the app.

```php

use Auth0\SDK\API\Authentication;

$domain        = getenv('AUTH0_DOMAIN');
$client_id     = getenv('AUTH0_CLIENT_ID');
$client_secret = getenv('AUTH0_CLIENT_SECRET');
$redirect_uri  = getenv('AUTH0_CALLBACK_URL');

$auth0 = new Authentication($domain, $client_id);

$auth0Oauth = $auth0->get_oauth_client($client_secret, $redirect_uri, [
  'persist_id_token' => true,
  'persist_refresh_token' => true,
]);

$starWarsNames = ['Darth Vader', 'Ahsoka Tano', 'Kylo Ren', 'Obi-Wan Kenobi', 'R2-D2', 'Snoke'];

$userInfo = $auth0Oauth->getUser();

```

`Auth0\SDK\API\Authentication` is the Auth0 authentication class. It has the methods to retrieve a user's profile when logged in. `$domain`, `$client_id`, `$client_secret`, `$redirect_uri` are variables that will house the values gotten from the `.env` file with the aid of the `getenv` method.

Then, we moved on to instantiating the `Authentication` class.

The `$auth0->get_oauth_client()` method by default stores user information in the PHP session, and we also instructed it to save the `access_token` and `id_token`. 

`$starWarsNames` array contains some characters from Star Wars. Later in the code, a user will be assigned a random code name from this array.

`$auth0Oauth->getUser()` retrieves the user information.

```php

if (isset($_REQUEST['logout'])) {
    $auth0Oauth->logout();
    session_destroy();
    header("Location: /");
}

```

This checks if the user submitted a request to log out, clears the session and redirects the user back to the homepage.

{% highlight html %}
<script src="http://code.jquery.com/jquery-3.0.0.min.js" type="text/javascript"></script>
<script src="https://cdn.auth0.com/js/lock/10.0/lock.min.js"></script>
{% endhighlight %}

We are making use of [Auth0 Lock widget](https://auth0.com/docs/libraries/lock), and we also using jQuery to call the lock methods and handle button click event.

{% highlight html %}
<!-- font awesome from BootstrapCDN -->
<link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet">
<link href="//maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css" rel="stylesheet">
{% endhighlight %}


Pulled in bootstrap and font-awesome for beautification.

{% highlight html %}
<script>
  var AUTH0_CLIENT_ID = '<?php echo getenv("AUTH0_CLIENT_ID") ?>';
  var AUTH0_DOMAIN = '<?php echo getenv("AUTH0_DOMAIN") ?>';
  var AUTH0_CALLBACK_URL = '<?php echo getenv("AUTH0_CALLBACK_URL") ?>';
</script>
{% endhighlight %}

Here, we are feeding the Auth0 credentials to JavaScript variables.

{% highlight html %}
<div class="container">
    <div class="login-page clearfix">
      <?php if(!$userInfo): ?>
      <div class="login-box auth0-box before">
        <img src="https://cdn.auth0.com/blog/app/star_warsapp.png" />
        <p>Heard you don't want to migrate to PHP 7? Dare us!</p>
        <a class="btn btn-primary btn-login">SignIn</a>
      </div>
      <?php else: ?>
      <div class="logged-in-box auth0-box logged-in">
        <h1 id="logo">Star Wars Welcomes You to the Family!</h1>
        <img class="avatar" width="200" src="<?php echo $userInfo['picture'] ?>"/>

        <h2>Welcome <span class="nickname"><?php echo $userInfo['nickname'] ?></span></h2>
        <h2> Assigned Codename : <b><?php echo $starWarsNames[rand(0, 6)]; ?></b> </h2>
        <a class="btn btn-primary btn-lg" href="?logout">Logout</a>
      </div>
      <?php endif ?>
</div>
{% endhighlight %}

In the code above, if the `$userInfo` is not set, then it means the user has not logged in yet, so we display the signin button. If the user has signed in, then we grab the user's info and display it along with the `logout` button.

### Run The App

Go to your terminal and run `composer install` to install the dependencies. Next, run your PHP 5.x server. If your PHP server is accessible from the terminal, then you can run it via `php -S localhost:3000`.

Open your browser and test the app. The index page should look like this:

![Index](https://cdn.auth0.com/blog/app/header.png)
_Index Page_

Now, signup & signin.

![Signing In](https://cdn.auth0.com/blog/app/signin.png)
_Sign In_

When you are logged in, you should be assigned a Star Wars codename like so:

![Logged In](https://cdn.auth0.com/blog/app/loggedin.png)
_Logged In_

Our app is now running successfully on a PHP 5.x server. You can grab the [source code from Github](https://github.com/auth0-blog/starwars-phpapp) to ensure that everything works as expected.

### Migrating our PHP5 App to PHP7

We are currently running a PHP 5.x app. Let's migrate it to PHP 7. The good thing is that most times you might not have to change anything in the codebase. Let's see if that holds true for this app.

Upgrade your server to at least PHP 7.0.0 and run this app again.

![PHP 7 Server running](https://cdn.auth0.com/blog/app/php7status.png)
_PHP 7 Server running_

![Running on PHP 7](https://cdn.auth0.com/blog/app/php7_running_app.gif)
_App running on PHP 7 without any errors_


Awesome, now our first app is running on PHP 7 successfully!

## Work with Second App

The second PHP app we will go through is an API. It is a simple Chuck Norris API. It has been built already with PHP 5 in mind. 

Clone it from [Github](https://github.com/auth0-blog/basic-api) and run `composer install` to install all the dependencies. Then run the app on a PHP 5.x server. 

Open up [Postman](https://www.getpostman.com) and test the API like so:

Run `http://localhost:3000/jokes/categories` like so:

![Categories API](https://cdn.auth0.com/blog/app/categories.png)
_API showing categories_

Run `http://localhost:3000/jokes/random` like so:

![Random Jokes](https://cdn.auth0.com/blog/app/randomjokes.png)
_API showing random jokes_

The app is working fine, no errors!

### Use PHP 7 features in Second App

Let's refactor this app and integrate some PHP 7 features.

This is the directory structure of our API app at the moment:

```bash

----basic-api
  |
  ----src
  |  |
  |  ----Main.php
  |
  ----vendor
  |
  ----.gitignore
  |
  ----.htaccess
  |
  ----composer.json
  |
  ----composer.lock
  |
  ----index.php 
  |
  ----README.md

```

This is how our `Main.php` file looks like right now:

```php

<?php

namespace App;

use Exception;

class Main {

    public function getCategories() {
        return $this->getCategoryData();
    }

    private function getCategoryData() {
        return  [
            "explicit",
            "dev",
            "movie",
            "food",
            "celebrity",
            "science",
            "political",
            "sport",
            "religion",
            "animal",
            "music",
            "history",
            "travel",
            "career",
            "money",
            "fashion"
        ];
    }

    public function getRandomJokes($randomNumber) {

        if( !is_integer($randomNumber)) {
            throw new Exception("The random number should be an integer. Please try again.");
        }

        $jokes = [
          "Jon Skeet’s code doesn’t follow a coding convention. It is the coding convention.",
          "Jon Skeet can divide by Zero.",
          "Jon Skeet points to null, null quakes in fear.",
          "Jon Skeet is the traveling salesman. Only he knows the shortest route.",
          "When Jon pushes a value onto a stack, it stays pushed.",
          "Drivers think twice before they dare interrupt Jon’s code.",
          "Jon Skeet does not sleep…. He waits.",
          "Jon Skeet can stop an infinite loop just by thinking about it.",
          "Jon Skeet uses Visual Studio to burn CDs.",
          "Jon Skeet has the key to Open Source. He just doesn’t want to close it."
        ];

        return $jokes[$randomNumber];
    }
}

```

Let's start by adding PHP 7 return type declarations to the methods in this class like so:

```php

<?php

namespace App;

class Main {

    public function getCategories(): array {
        return $this->getCategoryData();
    }

    private function getCategoryData(): array {
        return  [
            "explicit",
            "dev",
            "movie",
            "food",
            "celebrity",
            "science",
            "political",
            "sport",
            "religion",
            "animal",
            "music",
            "history",
            "travel",
            "career",
            "money",
            "fashion"
        ];
    }

    public function getRandomJokes($randomNumber): string {

        if( !is_integer($randomNumber)) {
            throw new Exception("The random number should be an integer. Please try again.");
        }

        $jokes = [
          "Jon Skeet’s code doesn’t follow a coding convention. It is the coding convention.",
          "Jon Skeet can divide by Zero.",
          "Jon Skeet points to null, null quakes in fear.",
          "Jon Skeet is the traveling salesman. Only he knows the shortest route.",
          "When Jon pushes a value onto a stack, it stays pushed.",
          "Drivers think twice before they dare interrupt Jon’s code.",
          "Jon Skeet does not sleep…. He waits.",
          "Jon Skeet can stop an infinite loop just by thinking about it.",
          "Jon Skeet uses Visual Studio to burn CDs.",
          "Jon Skeet has the key to Open Source. He just doesn’t want to close it."
        ];

        return $jokes[$randomNumber];
    }
}

```

_PHP 7 Return Type Declarations added in Main.php_

Another PHP 7 feature we can add is *function parameter typehinting*. We have a method, `getRandomJokes($randomNumber)` that accepts a `$randomNumber` which is an integer. 

Let's refactor that method, `getRandomJokes()`. We'll eliminate the `if` condition and just typehint the `$randomNumber` parameter like so:

```php

public function getRandomJokes(int $randomNumber): string {

        $jokes = [
          "Jon Skeet’s code doesn’t follow a coding convention. It is the coding convention.",
          "Jon Skeet can divide by Zero.",
          "Jon Skeet points to null, null quakes in fear.",
          "Jon Skeet is the traveling salesman. Only he knows the shortest route.",
          "When Jon pushes a value onto a stack, it stays pushed.",
          "Drivers think twice before they dare interrupt Jon’s code.",
          "Jon Skeet does not sleep…. He waits.",
          "Jon Skeet can stop an infinite loop just by thinking about it.",
          "Jon Skeet uses Visual Studio to burn CDs.",
          "Jon Skeet has the key to Open Source. He just doesn’t want to close it."
        ];

        return $jokes[$randomNumber];
}

```

Now if you try to pass in a value asides an integer like so:

```php

$router->get('/jokes/random', function() use ($app){
  echo json_encode($app->getRandomJokes("dsdsds"));
});

```
_index.php_

PHP 7 will throw a Type Error like so:

![Type Error](https://cdn.auth0.com/blog/app/typeerror.png)
_PHP 7 TypeError_

We have been able to add some PHP 7 features. The app also runs on a PHP 7 server and everything just works fine!

The source code of the PHP 7 version of the API can be found on the [`php7 branch` on GitHub](https://github.com/auth0-blog/basic-api/tree/php7). 

## Performance

PHP 7 runs on the new Zend engine 3.0, thus making your apps see up to 2x faster performance and 50% better memory consumption than PHP 5.6. It also allows you to serve more concurrent users without adding any hardware.

[Rasmus Ledorf](https://twitter.com/rasmus), *Creator of PHP* and inventor of the SQL LIMIT clause did some benchmarking with a few popular PHP projects with the various versions of PHP from PHP 5.4 up until PHP 7.0 and also benchmarked against HHVM 3.6.1. 

Let's take a good look at the benchmarks. The test box specs Rasmus used are:

* Gigabyte Z87X-UD3H i7-4771 4 cores @ 3.50GHz w/ 16G of Ram @ 1600MHz
* Hyperthreading enabled for a total of 8 virtual cores
* Toshiba THNSNHH256GBST SSD
* Linux debian 3.16.0-4-amd64 #1 SMP Debian 3.16.7-ckt9-2 (2015-04-13) x86_64 GNU/Linux
* MySQL 5.6.24
* Nginx-1.6.2 + php-fpm for all tests unless indicated otherwise
* Quiet local 100Mbps network
* Siege benchmark tool run from a separate machine

![ZenCart 1.5.4](https://cdn.auth0.com/blog/benchmark/zencart.png)
_ZenCart 1.5.4_

![Moodle 2.9-dev](https://cdn.auth0.com/blog/benchmark/moodle.png)
_Moodle 2.9-dev_

![Cachet](https://cdn.auth0.com/blog/benchmark/cachet.png)
_Cachet_

![Traq 3.5.2](https://cdn.auth0.com/blog/benchmark/traq.png)
_Traq 3.5.2_

![Geeklog 2.1.0](https://cdn.auth0.com/blog/benchmark/geeklog.png)
_Geeklog 2.1.0_

![Wardrobe CMS 1.2.0](https://cdn.auth0.com/blog/benchmark/wardrobecms.png)
_Wardrobe CMS 1.2.0_

![Opencart 2.0.2.0](https://cdn.auth0.com/blog/benchmark/opencart.png)
_Opencart 2.0.2.0_

![MediaWiki 1.24.1](https://cdn.auth0.com/blog/benchmark/mediawiki.png)
_MediaWiki 1.24.1_

![phpBB 3.1.3](https://cdn.auth0.com/blog/benchmark/phpBB.png)
_phpBB 3.1.3_

![Wordpress 4.1.1](https://cdn.auth0.com/blog/benchmark/wordpress.png)
_Wordpress 4.1.1_

![Drupal 8](https://cdn.auth0.com/blog/benchmark/drupal.png)
_Drupal 8_

From the results above, you can see that we can make double the amount of requests in less time in PHP 7 than PHP 5.

These specs can be found in the `Speeding Up The Web With PHP 7` talk he gave at Fluent Conf, 2015.

Check out the following benchmarks:

* [php7-benchmarks](https://github.com/martin-helmich/php7-benchmarks)
* [php7 final version vs hhvm benchmark](https://kinsta.com/blog/the-definitive-php-7-final-version-hhvm-benchmark)
* [hhvm vs php7 performance show down - Wordpress, Nginx](http://blog.wpoven.com/2016/04/14/hhvm-vs-php-7-performance-showdown-wordpress-nginx)


## Conclusion

We have successfully covered how to upgrade your development and server environments from PHP 5 to PHP 7, gone through the features PHP 7 offers and also migrated two apps from PHP 5 to PHP 7. 

Woot! Woot! It's been quite a journey highlighting everything PHP 7 has to offer. PHP has grown tremendously over the years from a toy language to a full-blown fast and enterprise language.

The [PHP Manual](http://php.net/manual/en/index.php) and [RFC](https://wiki.php.net/RFC) documents remain the most complete go-to reference for any of the new PHP 7 features. You can always leverage them for more information.