---
layout: post
title: "Migrating a PHP 5 App to PHP 7 (Development Environment) - Part 1"
description: "Learn how to migrate a PHP 5 application to PHP 7: Setup and development environment."
date: 2017-01-20 8:30
category: Technical Guide, PHP, Migration
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
- 2016-11-07-migrating-an-angular-1-app-to-angular-2-part-1
- 2016-11-09-migrating-an-angular-1-app-to-angular-2-part-2
---


**TL;DR:** Many PHP applications are still running on PHP 5.x, not ready to take full advantage of the awesome features that PHP 7 offers. A lot of developers have not made the switch because of certain fears of compatibility issues, migration challenges and the strange awkward feeling that migrating will take away a big chunk of their time. In this tutorial, you'll learn how to upgrade your PHP 5 application to PHP 7 starting from upgrading your development environment. 

---

## PHP 5 and PHP 7

PHP 5 has been around for a very long time, over 10 years now. In fact, many production PHP apps are currently running on either PHP 5.2, 5.3 or 5.6. PHP 5 brought a lot of awesome features to PHP such as:

* Robust Support for Object oriented programming.
* Standard PHP Library (SPL)
* Closures.
* Namespaces.
* Magical methods for metaprogramming.
* MySQLi - improved MySQL extension.
* Cleaner Error handling.
* Better support for XML extensions.

Unfortunately, every thing that has a beginning must have an end. PHP 5.6 active support ended January 19, 2017. It will receive security support until December 31, 2018.

![Supported Release](https://cdn.auth0.com/blog/phpv/release.png)
_PHP 5 and 7 release and support duration_

PHP 7.0 was officially released on December 3, 2015 with a lot of new features and better performance benefits. It is twice as fast as PHP 5. A summary of the new features are highlighted below:

* Return and Scalar type declarations
* Better Unicode support
* Null Coalescing Operator
* Fatal errors conversion to Exceptions
* Generator Enhancement
* Anonymous Classes
* Secure random number generator
* Removal of deprecated features

and much more! If you aren't using any of the deprecated features in your PHP 5 app, then the transition to PHP 7 will be seamless. In the next post, I'll give a very detailed rundown of PHP 7 features, including the deprecated features.

## Upgrading your development environment to PHP 7

The first step to upgrading your application to use PHP 7 features is to migrate your development environment from PHP 5.x to PHP 7.x. We will cover how to upgrade your development environment to run PHP 7.x on Ubuntu, CentOs, Windows and Mac OS machines.

## Mac OS X

If you are a fan of [Homebrew](http://brew.sh), you can install PHP 7.0 via homebrew like so:

```bash

brew tap homebrew/dupes
brew tap homebrew/versions
brew tap homebrew/homebrew-php
brew unlink php56
brew install php70

```

> If you were using PHP 5.6, then you should unlink the old PHP by running `brew unlink php56` else unlink whatever version is present before you go ahead to install PHP 7.0.

Another option is to install it via `curl` on your terminal like so:

```bash

curl -s https://php-osx.liip.ch/install.sh | bash -s 7.0

```

## Windows

If you are fan of [WAMP](http://www.wampserver.com/en) or [XAMPP](https://www.apachefriends.org/download.html), then you can just download the latest versions of the software. It comes packaged with PHP 7.0.

![XAMPP download](https://cdn.auth0.com/blog/phpv/donwload.png)
_Download and install the last/latest version_

Another option is to download the PHP 7.0 distribution for windows from [http://windows.php.net/download#php-7.0](http://windows.php.net/download#php-7.0).


## Ubuntu

If you are running Ubuntu on your machine, especially around v14 and 15, you can install PHP 7.0 by running these commands:

```bash

sudo add-apt-repository ppa:ondrej/php-7.0
sudo apt-get update
sudo apt-get install php7.0

```

## Debian

If you are running Debian on your machine, especially around v6, v7 and v8, you can install PHP 7.0 by doing the following:

* Open up your `/etc/apt/sources.list` file, and make sure you have these commands below:

_If you are using a Jessie distribution_

```bash

deb http://packages.dotdeb.org jessie all
deb-src http://packages.dotdeb.org jessie all

```
_If you are using a Wheezy distribution_

```bash

deb http://packages.dotdeb.org wheezy all
deb-src http://packages.dotdeb.org wheezy all

```

* Fetch and Install the GnuPG key

```bash

wget https://www.dotdeb.org/dotdeb.gpg
sudo apt-key add dotdeb.gpg

```

* Install PHP 7.0

```bash

sudo apt-get update
sudo apt-get install php7.0

```

## CentOS / Red Hat Enterprise Linux

If you are running CentOS or Red Hat Enterprise Linux operating system on your machine, you can install PHP 7.0 by running the following commands on your terminal like so:

```bash

sudo yum update
rpm -Uvh https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
rpm -Uvh https://mirror.webtatic.com/yum/el7/webtatic-release.rpm
sudo yum install php70w
sudo yum install php70w-mysql
```

When you are done, run this command `php -v`, you should see something like this:

```bash

PHP 7.0.0 (cli) (built: Dec  2 2015 20:42:32) ( NTS )
Copyright (c) 1997-2015 The PHP Group
Zend Engine v3.0.0, Copyright (c) 1998-2015 Zend Technologies

```

## phpbrew

[PHPBrew](https://github.com/phpbrew/phpbrew) is a tool that you can use to build and install multiple versions of PHP on your machine. It can:

* Build PHP with different variants like PDO, MySQL, SQLite, debug etc
* Compile Apache PHP module and separate them by different versions.
* Switch versions very easily and is integrated with bash/zsh shell.
* Install & enable PHP extensions into current environment with ease.
* Install multiple PHP into system-wide environment.
* Detect path for Homebrew and MacPorts.

![phpbrew](https://raw.github.com/phpbrew/phpbrew/master/screenshots/01.png)
_phpbrew_

You can install it on your machine like so:

```bash

curl -L -O https://github.com/phpbrew/phpbrew/raw/master/phpbrew
chmod +x phpbrew

```

Then you can install it into your bin folder like so:

```bash

sudo mv phpbrew /usr/local/bin/phpbrew

```

**Note:** Make sure you have `/usr/local/bin` in your `$PATH` environment variable.

You can install PHP 7 by running the following commands:

```bash

phpbrew self-update
phpbrew install next as php-7.1.0
phpbrew use php-7.1.0

```

You can use phpbrew to install PHP 7.0 from GitHub like so:

```bash

phpbrew install github:php/php-src@PHP-7.0 as php-7.0.0

```

Most times, we use PHP with other extensions such as MySQL, PDO, OpenSSL etc. You can use **phpbrew** to build your PHP environment with various variants like so:

```bash

  phpbrew install 7.0.0 +mysql+mcrypt+openssl+debug+sqlite

```

This command above will build PHP with MySQL, mycrypt, OpenSSL, debug and SQLite.

## Vagrant

Vagrant provides a simple, elegant way to manage and provision Virtual Machines. The development environments that run on Vagrant are packaged via **Vagrant boxes**. Vagrant boxes are completely disposable. If something goes wrong, you can destroy and re-create the box in minutes! One of such boxes I recommend is **Laravel Homestead**.

### Laravel Homestead

Laravel Homestead is an official, pre-packaged Vagrant box that provides you a wonderful development environment without requiring you to install PHP, a web server, and any other server software on your local machine. Homestead runs on any Windows, Mac, or Linux system. It includes the following:

* Ubuntu 16.04
* Git
* PHP 7.1 (Latest version of PHP)
* Nginx
* MySQL
* MariaDB
* Sqlite3
* Postgres
* Composer
* Node (With Yarn, PM2, Bower, Grunt, and Gulp)
* Redis
* Memcached
* Beanstalkd

1. Install [VirtualBox 5.1](https://www.virtualbox.org/wiki/Downloads), or [VMWare](https://www.vmware.com), and [Vagrant](https://www.vagrantup.com/downloads.html). 

2. Now that you have Vagrant and VirtualBox or VMware installed, go ahead and download the Laravel Homestead box like so:

```bash

vagrant box add laravel/homestead

```

Follow the instructions on the [Laravel Homestead documentation](https://laravel.com/docs/5.3/homestead) to find out more about the installation process.

> I recommend Windows users to take a stab at using [Laragon](https://laragon.org). It provides an alternative but suitable and powerful environment like Laravel Homestead.

### php7dev

Another Vagrant image is **[php7dev](https://github.com/rlerdorf/php7dev)** by Rasmus Ledorf (Creator of PHP). It is a Debian 8 Vagrant image which is preconfigured for testing PHP apps and developing extensions across many versions of PHP. You can gloriously switch between PHP versions by using the `newphp` command. 

Follow the instructions on the [README](https://github.com/rlerdorf/php7dev) to find out how to install, configure and use.

## Valet

[Valet](https://github.com/laravel/valet) is a PHP development environment for Mac minimalists. It was built by [Taylor](https://twitter.com/taylorotwell) and [Adam Wathan](https://twitter.com/adamwathan) of the Laravel community. It is a fast blazing development environment that uses roughly 7MB of RAM. It requires Homebrew.

Laravel Valet configures Mac to use PHP's built-in web server in the background when your machine starts. With Valet, if you create a project folder called `auth0-php`, then you can just open `auth0-php.dev` in your browser and it will serve the contents of the folder automatically.

You can share whatever you are working on locally with someone in another part of the world by just running this command:

```bash

valet share

```

![Valet share](https://cdn.auth0.com/blog/valet/share.png)
_Valet uses Ngrok under the hood to share_

You can even serve a local site over encrypted TLS using HTTP/2 by invoking a command like so:

```bash

valet secure blog

```

where `blog` is the name of the site or project folder. Valet generates a Fresh local TLS certificate.

![Secure the Blog](https://cdn.auth0.com/blog/valet/share.png)
_Invoke the secure command_

![Secure Blog](https://cdn.auth0.com/blog/valet/secure.png)
_Site is served over https locally_

Very awesome! 

Out of the box, Valet supports [Laravel](https://laravel.com), [Lumen](https://lumen.laravel.com), [Symfony](https://symfony.com), [Zend](https://framework.zend.com), [CakePHP 3](https://cakephp.org), [Wordpress](https://wordpress.org), [Bedrock](https://roots.io/bedrock), [Craft](https://craftcms.com), [Statamic](https://statamic.com) and [Jigsaw](http://jigsaw.tighten.co). However, you can extend Valet with your own [custom drivers](https://laravel.com/docs/5.3/valet#custom-valet-drivers).

Follow the instructions on the [laravel valet documentation](https://laravel.com/docs/5.3/valet) to find out how to install and get started using it.

## Docker

### php7-dockerized

[php7-dockerized](https://github.com/hamptonpaulk/php7-dockerized) is a simple PHP 7 Docker and Compose environment that is bundled with Nginx and MySQL. Follow the instructions on [setting up a local PHP 7 development environment with docker and compose!](https://medium.com/code-school/setting-up-a-local-php7-development-environment-with-docker-compose-e9531baed291#.bezir0x7n).

### Laradock

[Laradock](https://github.com/laradock/laradock) is a docker PHP development environment that gives you a wonderful development environment without requiring you to install PHP 7, Nginx, MySQL, Redis, and any other software on your machines.

* Clone Laradock inside your project like so:

```bash

git clone https://github.com/Laradock/laradock.git

```

* Enter the laradock folder and run this command:

```bash

docker-compose up -d nginx mysql redis beanstalkd

```

* Open your `.env` file and set the following:

```bash

DB_HOST=mysql
REDIS_HOST=redis
QUEUE_HOST=beanstalkd

```

Follow the instructions on the [laradock documentation](https://github.com/laradock/laradock/blob/master/README.md) to find out how to install and configure it.

### phpdocker

[phpdocker.io](https://github.com/phpdocker-io/phpdocker.io) is a PHP and Docker generated environment. It supports PHP 7 up until 7.1 beta. Follow the instructions to set it up like so:

* Clone [https://github.com/phpdocker-io/phpdocker.io](https://github.com/phpdocker-io/phpdocker.io)
* Copy `app/config/parameters.yml.dist` into `app/config/parameters.yml`
* Run `composer install`
* Run `bower install`
* Run `php bin/console assets:install --symlink --relative`
* Run `docker-compose up -d`


## Conclusion

We have successfully covered various ways of setting up a PHP 7 development environment. The first step to migrating an app from a specific language version to another is ensuring that the development environment supports the new version. 

Do you have other ways of setting up PHP 7 development environments? Are you currently using an awesome tool to run your PHP 7 apps? Please let me know in the comments section.

In the next article, we'll go through all the features of PHP 7 that you can leverage when migrating your PHP 5 application!