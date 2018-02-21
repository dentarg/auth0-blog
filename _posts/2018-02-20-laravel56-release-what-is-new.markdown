---
layout: post
title: "Laravel 5.6 Release: What's New?"
description: "Laravel 5.6 has officially been released. What's new? What improvements were made? Learn how to build better PHP applications with this new release."
longdescription: "Laravel 5.6 is a major release to the framework. There are breaking changes and numerous bug fixes to Laravel. Learn notable additions to Laravel and how you can leverage them in your next project."
date: 2018-02-21 08:30
category: Hot Topics, Frameworks, Laravel
design:
  bg_color: "#4A4A4A"
  image: https://cdn.auth0.com/blog/logos/laravel.png
author:
  name: Prosper Otemuyiwa
  url: http://twitter.com/unicodeveloper
  mail: prosper.otemuyiwa@auth0.com
  avatar: https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200
tags:
- laravel
- web-app
- php
- auth0
- api
- laravel-56
- open-source
related:
- 2016-06-23-creating-your-first-laravel-app-and-adding-authentication
- 2017-12-26-developing-restful-apis-with-lumen
- 2017-05-08-the-ultimate-guide-to-deploying-php-applications
---

---

**TL;DR:** On Wednesday, February 7, 2018, **Laravel 5.6**, was released to the public. It's a major release to the most popular PHP framework on GitHub as of this writing. Furthermore, [Spark 6.0](https://spark.laravel.com) was also released alongside **Laravel 5.6**. According to the policy laid down by the Taylor and the core team, major Laravel framework releases are released every six months (February and August). In this article, I'll cover the new features in Laravel 5.6 and several other changes and deprecations.

---

Laravel is the most popular, open-source PHP framework as of this writing. It is designed for building web applications with an expressive and elegant syntax. With Laravel, application development is fast because it ships with a lot of features out of the box. Without further ado, let's dive right into **Laravel 5.6**.

## What's new in Laravel 5.6?

### 1. Support For Argon Password Hashing

Argon2, the recommended password hashing algorithm by the [Password Hashing Competition](http://password-hashing.net), is a modern algorithm for securely hashing passwords. And it comes in two distinct flavors, Argon 2i and Argon 2d. PHP 7.2 recently added support for Argon 2i password hashing. Therefore, [Michael Lundbol](https://github.com/morloderex) took the initiative to add support for Argon hashing in Laravel.

![Argon Password Hashing Support](https://cdn.auth0.com/blog/laravel56/argon.png)
_Initiative to add Argon Password Hashing_

The `bcrypt` driver is the default driver for password hashing in Laravel. However, Laravel 5.6 now supports `argon`.

![Config File for Hashing](https://cdn.auth0.com/blog/laravel56/argondriversupport.png)
_Config file for hashing_

**Note:** Laravel 5.6 ships with a [hashing config file](https://github.com/laravel/laravel/blob/develop/config/hashing.php) as displayed above.

### 2. Better Support For Dynamic Rate Limiting

One of the beautiful built-in features of Laravel is _API Rate Limiting_. Before now, Laravel's rate limiting configuration involved specifying a hard-coded number of requests on a group of routes. However, Laravel 5.6 adds icing to the cake by allowing you specify a maximum number of requests based on an authenticated User model attribute.

```php
Route::middleware('auth:api', 'throttle:rate_limit,1')->group(function () {
    Route::get('/users', function () {
        // do something awesome
    });
});
```

In the code above, the `rate_limit` parameter is an attribute of the `User` model in a Laravel 5.6 application.

### 3. Model Serialization on Steriods

Before now, there was a persistent bug on queued models. When queued models are finally processed, it's without their loaded relationships in place.

In Laravel 5.6, huge improvements have been made to ensure that relationships loaded on queued models are automatically re-loaded when the job is processed by the queue.

### 4. Improved Logging

There is a new [logging config](https://github.com/laravel/laravel/blob/develop/config/logging.php) file in Laravel 5.6. In this file, you can set up logging stacks that send log messages to various handlers.

Check out the example below:

```php
'channels' => [
  'stack' => [
      'driver' => 'stack',
      'channels' => ['syslog', 'slack'],
  ],

  'syslog' => [
      'driver' => 'syslog',
      'level' => 'debug',
  ],

  'slack' => [
      'driver' => 'slack',
      'url' => env('LOG_SLACK_WEBHOOK_URL'),
      'username' => 'Laravel Log',
      'emoji' => ':boom:',
      'level' => 'critical',
  ],
],
```

The `stack` driver allows you to combine multiple channels, in this case, `syslog` and `slack`, into a single log channel as shown above.

Furthermore, with the `tap` array on a channel's configuration, you can easily customize Monolog for an existing channel like so:

```php
'single' => [
    'driver' => 'single',
    'tap' => [App\Logging\CustomizeFormatter::class],
    'path' => storage_path('logs/laravel.log'),
    'level' => 'debug',
],
```

**Note:** Monolog is a library that sends your application logs to files, sockets, inboxes, databases and various web services. It's a comprehensive library with various log handlers.

Check out more [information on Logging in Laravel 5.6](https://laravel.com/docs/5.6/logging).

### 5. Single Server Task Scheduling

Before now, if your app ran on multiple servers and the task scheduler was active on those servers, then your scheduled tasks also executed multiple times. However, in Laravel 5.6, you can now schedule your task to execute on just a single server if your app runs on multiple servers.

{% include tweet_quote.html quote_text=" In Laravel 5.6, you can now schedule your task to execute on just a single server if your app runs on multiple servers." %}

```php
$schedule->command('launch:flasheavy')
         ->tuesdays()
         ->at('12:00')
         ->onOneServer();
```

### 6. Beautiful Error Reporting With Collision

[Collision](https://github.com/nunomaduro/collision) is an awesome package developed and maintained by [Nuno Maduro](https://twitter.com/enunomaduro). It is a detailed, beautiful and intuitive error handler for console/command-line PHP applications.

Laravel 5.6 now ships with Collision via the `dev` composer dependency. When working with your Laravel app via the command line, Collision provides an awesome error reporting interface like so:

![Collision Integration](https://cdn.auth0.com/blog/laravel56/collision.png)
_Collision Integration with Laravel 5.6_

### 7. Elevated Eloquent Date Formatting

Laravel 5.6 provides a subtle way to cast Eloquent date model attributes to a specific date format. All you need to do is to specify the desired date format in the `$casts` array.

{% include tweet_quote.html quote_text="Laravel 5.6 provides a subtle way to cast Eloquent date model attributes to a specific date format." %}

Now, you can customize the date model attributes like so:

```php
protected $casts = [
  'date_enrolled' => 'date:Y-m-d',
  'date_evicted' => 'datetime:Y-m-d H:00',
];
```

When the model is cast to JSON or array output, the attributes will be formatted to the date formats example provided above like so:

```bash
date_enrolled: 2005-02-19
date_evicted: 2018-02-20 8:30
```

### 8. Aliasing Blade Components For Easier Access

This feature is very handy. Accessing a blade component in a sub-directory is easier via aliasing. With the component method, you can alias `components.card` to `card` assuming the card component's directory is `resources/views/components/card.blade.php`.

```php
Blade::component('components.card', 'card');
```

Once it has been aliased, you can invoke the component like so:

```php
@card
  This is your Valentine card.
@card
```

### 9. Broadcasting Channel Classes

In Laravel 5.6, you can now generate broadcasting channel classes via the `make:channel` Artisan command. The generated channel class will be placed in the `App/Broadcasting` directory.

```bash
php artisan make:channel PurchaseChannel
```

Registering the channel is as easy as calling the `Broadcast::channel` method below in the `routes/channel.php` file:

```bash
use App\Broadcasting\PurchaseChannel;

Broadcast::channel('purchase.{purchase}', PurchaseChannel::class);
```

In the `PurchaseChannel` class, you can add the authorization logic in the `join` method. Before now, the authorization logic was placed in the channel authorization Closure.

```php
<?php

namespace App\Broadcasting;

use App\User;
use App\Purchase;

class PurchaseChannel
{

  ....

  /**
   * Authenticate the user's access to the channel.
   *
   * @param  \App\User  $user
   * @param  \App\Purchase $purchase
   * @return array|bool
   */
  public function join(User $user, Purchase $purchase)
  {
      return $user->id === $purchase->user_id;
  }
}
```
### 10. Daring Upgrade Of Symfony Components and Bootstrap

All the Symfony components used by Laravel 5.6 have been bumped to the `~4.0` release. Furthermore, all the front-end scaffolding of Laravel 5.6 and Spark 6.0 has been bumped to `v4`. 

I covered all the [major additions and deprecations of Bootstrap 4 in this article](https://auth0.com/blog/whats-new-in-bootstrap4).

## Deprecations and Other Updates

* Generating an API resource controller can now be done by using the `--api` switch when executing the `make:controller` command.
* Laravel 5.6 introduced helper methods, `Arr::wrap()`, `classes_uses_recursive()`, `Str::uuid()`, and `Str::orderedUuid()`, the latter generating a timestamp first UUID that's more easily and efficiently indexed by databases like MySQL.
* PHPUnit, upgraded to v7.
* Laravel Mix, upgraded to v2.
* The deprecated Artisan `optimize` command has been removed.
* Added support for customizing the mail message building in `ResetPassword::toMail()`.
* Add `policies()` method to `AuthServiceProvider` to retrieve all the policies defined by the provider.
* Two new blade directives have been added to the framework, `@csrf` and `@method`.
* Support for PostgreSQL comments was added. Furthermore, Laravel 5.6 now has better support for enumeration columns.

Check out other [Laravel 5.6 updates here](https://github.com/laravel/framework/releases/tag/v5.6.0).

## Upgrading to Laravel 5.6

Laravel 5.6 requires `PHP >= 7.1.3`. And the estimated upgrade time from Laravel `v5.5` is about ten to thirty minutes.

Check out this [comprehensive upgrade guide](https://laravel.com/docs/5.6/upgrade). However, if you don't want to be bothered about manually configuring and changing files for the upgrade, I recommend using [Laravel Shift - A service that provides automated, instant Laravel upgrade services by an army of thorough bots and friendly humans](https://laravelshift.com).

![Laravel Shift](https://cdn.auth0.com/blog/laravel56/laravelshift.png)
_Laravel Shift_

{% include asides/laravel-backend.markdown %}

## Conclusion

**Laravel 5.6** came loaded with new features and significant improvements. Another major release will be out by August and some of the features shipping with the next major release will be unleashed at [Laracon 2018](http://laracon.us). Get your tickets already!

Have you upgraded to Laravel v5.6 yet? What are your thoughts? Let me know in the comments section! 😊
