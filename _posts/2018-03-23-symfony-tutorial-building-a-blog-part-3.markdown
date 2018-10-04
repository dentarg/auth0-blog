---
layout: post
title: "Symfony Tutorial: Building a Blog (Part 3)"
description: "Learn how to create and deploy a secure blog engine with Symfony."
longdescription: "Creating applications with Symfony is easy and can be scaled to be used in any requirement. The tools that it provides to create and maintain web applications is amazing and replaces repetitive tasks. In this series, you will use Symfony to create a production-ready blog engine and then you will deploy it to Heroku."
date: 2018-03-23 08:30
category: Technical Guide, PHP, Symfony
author:
  name: Greg Holmes
  url: https://github.com/GregHolmes
  mail: iam@gregholmes.co.uk
  avatar: "https://avatars0.githubusercontent.com/u/2411269?s=460&v=4"
design:
  bg_color: "#000000"
  image: https://cdn.auth0.com/blog/symfony-blog/logo.png
tags:
- symfony
- php
- auth0
- bootstrap
- authentication
- heroku
- travis-ci
- web-app
- continuous-integration
- continuous-delivery
related:
- 2017-12-28-symfony-tutorial-building-a-blog-part-1
- 2018-01-04-creating-symfony-blog-part-2
- 2017-05-08-the-ultimate-guide-to-deploying-php-applications
---

**TL;DR:** Symfony is a PHP framework as well as a set of reusable PHP components and libraries. It uses the Model-View-Controller design pattern and can be scaled to be used in any requirement. It aims to speed up the creation and maintenance of web applications, replacing repetitive code. In this part of the series, you will learn how to deploy the blog engine that you have created in the previous parts on Heroku. The final code can be found at this [repository](https://github.com/auth0-blog/symfony-blog-part-3).

---

## Symfony Tutorial: About Part 1 and Part 2

[In the first article](https://auth0.com/blog/symfony-tutorial-building-a-blog-part-1/), you:

* installed and configured a Symfony installation;
* created two entities (and their respective database tables): `Author` and `BlogPost`;
* allowed users to authenticate with [Auth0](https://auth0.com);
* and ensured that the authenticated users have `Author` instances associated with them before using the system.

[In the second article](https://auth0.com/blog/creating-symfony-blog-part-2/), you installed [Bootstrap, a UI framework for web applications](https://getbootstrap.com/), to make the blog engine look nicer visually. You also enhanced your blog engine to allow visitors to:

* see a list of blog posts;
* read a specific blog post;
* and find out more about authors.

Besides that, authenticated authors were able to:

* create a new blog post;
* see all of their own blog posts;
* and delete their own blog posts from the system.

In this third article, you will be learning about deploying to two different environments: `staging` and `production`. You will be carrying this out by using two services, [Heroku](https://www.heroku.com) and [Travis-CI](https://travis-ci.com/), which will allow you to:

* make code changes to the blog;
* deploy these changes automatically by committing them to GitHub;
* and almost instantly see their changes in production and/or staging environments;

## About Heroku

[Heroku](https://www.heroku.com) is a container-based cloud Platform as a Service (PaaS). Heroku is used to deploy, manage, and scale modern apps for developers. The service is very flexible, simple to use, and quick to start with. This allows developers to focus more on the product rather than spending too much time on the technology. Added to this, Heroku is fully managed, this further reduces the time developers need to spend on maintaining servers and the hardware of the infrastructure.

## About Travis CI

[Travis CI](https://travis-ci.org/) is a hosted and distributed continuous integration service. Travis CI allows you to build and test your software hosted on GitHub, allowing you to publicise projects comfortable in knowing that project is fully functional for others to use.

With Travis CI, there are two different sites to use. The [`travis-ci.org`](https://travis-ci.org/) site allows you test open-source projects (public repositories). Whereas [`travis-ci.com`](https://travis-ci.com/) allows you to test private projects but requires a fee dependent on the size of your project.

## Building the Blog Engine

### Before Starting

For this tutorial, you will need a GitHub account. So, if needed, head over to [sign up at GitHub](https://github.com/join?source=header-home) and complete the process.

Once signed up, go to the example repository for the [Symfony blog part 2](https://github.com/auth0-blog/symfony-blog-part-2) article and click on the "Fork" button that appears in the top right-hand corner of the browser. As shown in the example below:

![Forking a repository on GitHub](https://cdn.auth0.com/blog/symfony-part-3/fork-repository.png)

You will find that you now have a repository of the same name but under your account. Click the "Clone or download" button and copy the URL found in there.

Next, you will need to clone this repository for yourself, so run the following two commands. However, replace the URL with your own one:

```bash
git clone https://github.com/auth0-blog/symfony-blog-part-2
```

After cloning it, install the dependencies with the following command:

```bash
cd symfony-blog-part-2
composer install
```

In the root directory, you will find a file called `.env`. Update the following values with your Auth0 credentials:

```yml
AUTH0_CLIENT_ID={AUTH0_CLIENT_ID}
AUTH0_CLIENT_SECRET={AUTH0_CLIENT_SECRET}
AUTH0_DOMAIN={AUTH0_DOMAIN}
```

Note that you will have to replace the values above (`{AUTH0_CLIENT_ID}`, `{AUTH0_CLIENT_SECRET}`, and `{AUTH0_DOMAIN}`). [Check the first part to understand how to replace them](https://auth0.com/blog/symfony-tutorial-building-a-blog-part-1/).

__Pro Tip!__ You will need a MySQL database locally to test your application. So, if you do not have one, an easy way to bootstrap it is with Docker:

```bash
docker run --name symfony-blog-mysql \
    -p 3306:3306 \
    -e MYSQL_ROOT_PASSWORD=myextremellysecretpassword \
    -e MYSQL_DATABASE=symfony-blog \
    -e MYSQL_USER=symfony-blog-user \
    -e MYSQL_PASSWORD=mysecretpassword \
    -d mysql:5.7
```

Now that you have a database with some credentials, in your `.env` file, find:

```yaml
###> doctrine/doctrine-bundle ###
# Format described at http://docs.doctrine-project.org/projects/doctrine-dbal/en/latest/reference/configuration.html#connecting-using-a-url
# For an SQLite database, use: "sqlite:///%kernel.project_dir%/var/data.db"
# Configure your db driver and server_version in config/packages/doctrine.yaml
DATABASE_URL=mysql://db_user:db_password@127.0.0.1:3306/db_name
###< doctrine/doctrine-bundle ###
```

And change the following line: `DATABASE_URL=mysql://db_user:db_password@127.0.0.1:3306/db_name` to be correct. If you were to use the example details in the creation of the docker database, it would look like:

```yaml
DATABASE_URL=mysql://symfony-blog-user:mysecretpassword@127.0.0.1:3306/symfony-blog
```

Also, add a new line with the contents below (and replace `(Your database name)` with the name of your database):

```yaml
DATABASE_NAME=(Your database name)
```

If you haven't followed the first part of this series, you might need to issue the following commands to create the database tables and to populate them:

```bash
php bin/console doctrine:database:create
php bin/console doctrine:schema:update --force
php bin/console doctrine:fixtures:load
```

> If you get an error stating that `An exception occurred in driver: SQLSTATE[HY000] [2002] No such file or directory`, check your `.env` file and [replace `DATABASE_HOST=localhost` by `DATABASE_HOST=127.0.0.1`](https://stackoverflow.com/a/9251924/1232793).

> __NOTE:__ If you do not have [Yarn](https://yarnpkg.com) installed (a JavaScript package manager), you will need to install and configure this. So, go to their [installation](https://yarnpkg.com/lang/en/docs/install/) page and follow the instructions for installing and configuring Yarn first.

Lastly, you will need to install third-party libraries (used to make the blog look nicer visually) with the following command:

```bash
yarn install
yarn run encore dev
```

## Installing Dependencies

### Installing Heroku CLI

In order to use Heroku, you need to have an account. So, go to the [sign up page](https://signup.heroku.com/) and follow all instructions provided there.

Once your account has been created, you're going to need Heroku's Command Line Interface (CLI). Each operating system has a different method of installing the Heroku CLI. So, below is a list of the commands used to install this:

* on MacOS: `brew install heroku/brew/heroku`
* on Ubuntu Snap: `sudo snap install heroku --classic`
* on Debian / Ubuntu: `wget -qO- https://cli-assets.heroku.com/install-ubuntu.sh | sh`
* on Windows 64-bit: [Installer](https://cli-assets.heroku.com/heroku-cli/channels/stable/heroku-cli-x64.exe)
* on Windows 32-bit: [Installer](https://cli-assets.heroku.com/heroku-cli/channels/stable/heroku-cli-x86.exe)

Now that you have an account and have the CLI installed on your system, you're going to need to create a space on Heroku. Running the following command will do this:

> __NOTE:__ Please change the `space-name-here` to be the space name you wish. Otherwise, you will find that the space name `space-name-here` is already in use by someone else.

```bash
heroku apps:create space-name-here
```

![Creating a Heroku space](https://cdn.auth0.com/blog/symfony-part-3/create-heroku-space.png)

Great, you can now access your website. If you take the URL that's given to you as a result of your command above (similar to the previous image) and put it into your browser, you should see the example page as shown in the image below:

![Heroku space created](https://cdn.auth0.com/blog/symfony-part-3/heroku-space-browser.png)

Now that you have your space, you need to create your database. There are several different add-ons for Heroku in order to use a database in your package. However, although there are free plans, you still need to provide your card details. So, please, head over to [Heroku Verify](https://heroku.com/verify) to add your card details.

Once verified, you're going to add the [ClearDb add-on](https://elements.heroku.com/addons/cleardb) to your space. So, in the terminal, run the following command to add a database to support your blog engine:

```bash
heroku addons:add cleardb:ignite
```

When the command has finished running, you should see something similar to the image below:

![Creating a ClearDB database](https://cdn.auth0.com/blog/symfony-part-3/create-heroku-database.png)

Heroku stores the environment variables themselves. So, in order for your blog to use sensitive keys (such as the database credentials and Auth0 properties), you need to update these variables. Previously, you stored them in a `.env` file. Now, you will need to execute the following commands to populate Heroku with these variables:

```bash
heroku config:set APP_ENV=prod
heroku config:set SYMFONY_ENV=prod
heroku config:set AUTH0_CLIENT_ID=(Your Auth0 Client ID)
heroku config:set AUTH0_CLIENT_SECRET=(Your Auth0 client secret)
heroku config:set AUTH0_DOMAIN=(Your Auth0 Domain)
heroku config:set DATABASE_NAME=(Your database name, as shown by the heroku addons:add command)
```

**Note:** You will need to replace the values after `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`, and `AUTH0_DOMAIN` with the properties of your Auth0 application and `DATABASE_NAME` with the `CLEARDB_DATABASE_URL` provided by the Heroku CLI (something like `cleardb-regular-32216`).

### Installing Travis CI

[Travis CI](https://travis-ci.org/) can be installed via Ruby. If you have Ruby installed, please, make sure it is at least version `1.9.3` (2.0.0 recommended). You can check this by typing the following command in a terminal:

```bash
ruby -v
```

If Ruby isn't installed, it can be installed by one of the following methods, depending on your operating system:

* Mac OS X: `brew install ruby`
* Debian / Ubuntu: `sudo apt-get install ruby-full`
* Free bsd: `pkg install ruby`
* CentOS, Fedora, or RHEL: `sudo yum install ruby`

Now that you have Ruby, you will be able to install [Travis CI](https://travis-ci.org/) CLI with the following command:

```bash
gem install travis -v 1.8.8 --no-rdoc --no-ri
```

Once complete, the installation can be verified by checking the version with the following command:

```bash
travis version
```

Making use of [Travis CI](https://travis-ci.org/) requires a GitHub account. As you already created your account previously, you don't need to create another. So, head over to [Travis CI to sign up](https://travis-ci.org/).

Once your account is created, you should see [your profile page](https://travis-ci.org/profile/). This page contains the list of your GitHub repositories (you might need to click on the *Sync account* button). All you need to do is to turn on your specific repository.

![Turning Travis CI integration with GitHub on](https://cdn.auth0.com/blog/symfony-blog-engine-part-3/travis-ci-integration.png)

In order to run through the [Travis CI](https://travis-ci.org/) build, you need a `.env` file specially created to this service. So, in the root directory of your project, create a `.env.travis.dist` file and paste the following in:

```yml
DATABASE_URL=mysql://travis@127.0.0.1:3306/travisbuild
DATABASE_NAME=travisbuild
CLEARDB_DATABASE_URL=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
AUTH0_DOMAIN=
```

You have enabled your GitHub repository on [Travis CI](https://travis-ci.org/), but you still need to create a `.travis.yml` file so that [Travis CI](https://travis-ci.org/) knows what to do with your repository. So, create the file and put the following in:

```yml
language: php
sudo: false
services:
- mysql
cache:
  directories:
  - "$HOME/.composer/cache/files"
matrix:
  fast_finish: true
  include:
  - php: 7.1
env:
- SYMFONY_VERSION="4.0.*" DB=mysql
before-install:
- composer self-update
install:
- cp .env.travis.dist .env
- composer install
- php bin/console doctrine:database:create --env=test
- php bin/console doctrine:schema:create --env=test
notifications:
email:
deploy:
  provider: heroku
  api_key:
    secure:
  app:
```

There are 3 parts of this file where you need to input unique details:

* First, your e-mail address. Please, type in your own e-mail next to the line that starts with `email: `.
* Second, your secure `api_key` for [Heroku](https://www.heroku.com). If you run the following command, it'll put the encrypted [Heroku](https://www.heroku.com) API key for you:

```bash
travis encrypt $(heroku auth:token) --add deploy.api_key
```

* And finally, the app your [Heroku](https://www.heroku.com) refers to, this is your [Heroku](https://www.heroku.com) space id. So, please, type it in next to `app: ` which is at the bottom of the file.

## Configuring Symfony for Production

Now that you have set up and configured Heroku and [Travis CI](https://travis-ci.org/), you need to make some changes to your Symfony project to make it functional when hosted on [Heroku](https://www.heroku.com).

First, you will need to change your `composer.json` file. On this file, you need to add a compile command that will tell Heroku to update the schema of the database. Where it says:

```json
"auto-scripts": {
    "cache:clear": "symfony-cmd",
    "assets:install --symlink --relative %PUBLIC_DIR%": "symfony-cmd"
},
"post-install-cmd": [
    "@auto-scripts"
],
"post-update-cmd": [
    "@auto-scripts"
],
```

Add the compile entry at the bottom as shown below:

```json
"auto-scripts": {
    "cache:clear": "symfony-cmd",
    "assets:install --symlink --relative %PUBLIC_DIR%": "symfony-cmd"
},
"post-install-cmd": [
    "@auto-scripts"
],
"post-update-cmd": [
    "@auto-scripts"
],
"compile": [
    "php bin/console cache:warmup",
    "php bin/console doctrine:schema:update --force",
    "yarn install",
    "yarn run encore production"
]
```

After that, you need to exclude your *DataFixtures* from the services auto-wiring. So, open the `./config/services.yaml` file and find:

```yml
App\:
    resource: '../src/*'
    exclude: '../src/{Entity,Migrations,Tests,Kernel.php}'
```

In exclude, where it shows `{Entity,Repository,Tests}`, add `DataFixtures`. This will look like:

```yml
App\:
    resource: '../src/*'
    exclude: '../src/{Entity,Migrations,Tests,Kernel.php,DataFixtures}'
```

Your Doctrine configuration will be different in production than it is in development. So, in the `config/packages/doctrine.yaml` file, you should find something similar to:

```yml
doctrine:
    dbal:
        # configure these for your database server
        driver: 'pdo_mysql'
        server_version: '5.7'
        charset: utf8mb4

        # With Symfony 3.3, remove the `resolve:` prefix
        url: '%env(resolve:DATABASE_URL)%'
    orm:
        auto_generate_proxy_classes: '%kernel.debug%'
        naming_strategy: doctrine.orm.naming_strategy.underscore
        auto_mapping: true
        mappings:
            App:
                is_bundle: false
                type: annotation
                dir: '%kernel.project_dir%/src/Entity'
                prefix: 'App\Entity'
                alias: App
```

Replace this line:

 ```yaml
url: '%env(resolve:DATABASE_URL)%'
```

With:

```yaml
dbname: '%env(DATABASE_NAME)%'
```

Then, create a new file called `doctrine.yaml` in the `config/packages/dev` directory and paste the following configuration into it:

```yaml
doctrine:
    dbal:
        url: '%env(resolve:DATABASE_URL)%'
```

After that, open the `doctrine.yaml` file (it resides on `config/packages/prod`) and, under `Doctrine:`, add:

```yaml
dbal:
    url: '%env(resolve:CLEARDB_DATABASE_URL)%'
```

After update Doctrine configurations, you will need to install the Monolog Bundle to see Heroku's logs. This can be done by running the following command:

```bash
composer require logger
```

Now, alter the monolog configuration found in `config/packages/prod/monolog.yaml`. In this file, there will be something similar to:

```yml
monolog:
    handlers:
        main:
            type: fingers_crossed
            action_level: error
            handler: nested
            excluded_404s:
                # regex: exclude all 404 errors from the logs
                - ^/
        nested:
            type: stream
            path: "%kernel.logs_dir%/%kernel.environment%.log"
            level: debug
        console:
            type:   console
            process_psr_3_messages: false
            channels: ["!event", "!doctrine"]
```

Replace the line containing `path: "%kernel.logs_dir%/%kernel.environment%.log"` with:

```yml
path: 'php://stderr'
```

In order for `travis-ci` to run, it needs to be able to run tests. Although you are not using PHPUnit tests, you will need to install the package. So, run the following command:

```bash
composer require phpunit-bridge
```

With the new version of Symfony, Heroku doesn't know where the public directory is (it used to be `./web/` but moved to `./public/`). Therefore, to make Heroku aware of the public directory, you need to create a new file called `Procfile` in the root of your project directory. In this file add the following line:

```yml
web: vendor/bin/heroku-php-apache2 public/
```

Also, you will need a `.htaccess` file. So, run the following command:

```bash
composer require apache-pack
```

In order for Heroku to know what NPM packages to include in your new space, you need to specify which build packs to use. Note that Node.js is required to run `yarn` to build the styling of the blog.

```bash
heroku buildpacks:add heroku/nodejs
heroku buildpacks:add heroku/php
```

Heroku's spaces are hosted behind reverse proxies and load balancers which cause problems with your application. These reverse proxies may mask whether you're accessing the browser via HTTP or HTTPS for example. As a result of this, you need to add the following code in your `./public/index.php` file below the `$request = Request::createFromGlobals();` line:

```php
// tell Symfony about your reverse proxy
Request::setTrustedProxies(
    array($request->server->get('REMOTE_ADDR')),
    Request::HEADER_X_FORWARDED_ALL ^ Request::HEADER_X_FORWARDED_HOST
);
```

It's time to commit all of your changes to your forked repository. This can be done by the following commands:

```bash
git add .
git commit -m "Added file changes to prepare for pushing to production"
git push
```

In order to see your blog via the URL of your space hosted on Heroku, you will need to update your Auth0 Application to accept callbacks from this URL.

So, Head over to the [Auth0 Dashboard](https://manage.auth0.com/#/applications), choose your production application and carry out the following instructions:

* In the production Auth0 application, go to the settings tab.
* Find the text box labeled `Allowed Callback URLs`.
* The url you need to put in the text box is your space url, for example: `https://space-name-here.herokuapp.com/` followed by: `auth0/callback`. So it will look like: `https://space-name-here.herokuapp.com/auth0/callback`.
* Click the `Save Changes` button at the bottom of the page

You will now be able to read articles on your blog and authenticate as a writer.

## Instructions for Setting Up the Staging Environment

If you wish to make use of a staging environment for testing on, you are going to need to repeat some of the steps above. A staging environment allows you to make use of a direct replica of the production server, providing an environment for those with access to test new features before they're ready to be published for the public.

First, create your staging space on [Heroku](https://www.heroku.com) with the following command:

```bash
heroku apps:create space-name-here-staging
```

If previously you called your space `space-name-here`, then just append `-staging` to the end. This will facilitate differentiating what is staging and what is production.

Next, you are going to need to create a new database entry for this space. You can do this by running the following command:

> __NOTE:__ You may need to define your space name in this command, so change the `space-name-here-staging` to your space name below

```bash
heroku addons:add cleardb:ignite -a space-name-here-staging
```

Now, you need to change the `travis.yml` file. Where you previously had:

```yml
  app: space-name-here
```

You will need to replace this with branch specific configurations:

```yml
  app:
      master: space-name-here
      staging: space-name-here-staging
```

After that, you are going to need to create a staging area on Auth0, [log into your account here](https://manage.auth0.com/#/applications), then click the "Create Application" button. You can call it whatever you want. I would suggest calling it the same as your current application but append "-staging" to the end of it.

Once created, you need to make use of the Auth0 client Id, secret, and domain. You also need to make use of the database name returned to you when you ran the `cleardb:ignite` command. Replace the contents of the brackets in the examples below with these details. Then, run each of these commands:

```bash
heroku buildpacks:add heroku/nodejs -a space-name-here-staging
heroku buildpacks:add heroku/php -a space-name-here-staging
heroku config:set APP_ENV=staging -a space-name-here-staging
heroku config:set SYMFONY_ENV=staging -a space-name-here-staging
heroku config:set AUTH0_CLIENT_ID=(Your Auth0 Client ID) -a space-name-here-staging
heroku config:set AUTH0_CLIENT_SECRET=(Your Auth0 client secret) -a space-name-here-staging
heroku config:set AUTH0_DOMAIN=(Your Auth0 Domain) -a space-name-here-staging
heroku config:set DATABASE_NAME=(Your database name shown in the image above) -a space-name-here-staging
```

In the above commands, you've set the `SYMFONY_ENV` to `staging`. Now, you need some files in `config/packages/staging` to store your staging configurations. Create the `staging` directory under `./config/packages/` and, within that directory, create the `doctrine.yaml` file and paste the following in:

```yml
doctrine:
    dbal:
        url: '%env(resolve:CLEARDB_DATABASE_URL)%'
    orm:
        metadata_cache_driver:
            type: service
            id: doctrine.system_cache_provider
        query_cache_driver:
            type: service
            id: doctrine.system_cache_provider
        result_cache_driver:
            type: service
            id: doctrine.result_cache_provider

services:
    doctrine.result_cache_provider:
        class: Symfony\Component\Cache\DoctrineProvider
        public: false
        arguments:
            - '@doctrine.result_cache_pool'
    doctrine.system_cache_provider:
        class: Symfony\Component\Cache\DoctrineProvider
        public: false
        arguments:
            - '@doctrine.system_cache_pool'

framework:
    cache:
        pools:
            doctrine.result_cache_pool:
                adapter: cache.app
            doctrine.system_cache_pool:
                adapter: cache.system

```

Then, in the same directory, create the file `monolog.yaml` and paste the following in:

```yaml
monolog:
    handlers:
        main:
            type: fingers_crossed
            action_level: error
            handler: nested
            excluded_404s:
                # regex: exclude all 404 errors from the logs
                - ^/
        nested:
            type: stream
            path: 'php://stderr'
            level: debug
        console:
            type:   console
            process_psr_3_messages: false
            channels: ["!event", "!doctrine"]
```

Now that you have your environment set up, you need to run the following commands to create and deploy the staging branch:

```bash
git add .
git commit -m "Preparing the staging environment"
git checkout -b staging
git push --set-upstream origin staging
```

Time to add the staging URL to the allowed callback URLs for your staging application. Head over to the [Auth0 Dashboard](https://manage.auth0.com/#/applications), choose your staging application and carry out the following instructions:

* In the staging Auth0 application, go to the settings tab.
* Find the text box labelled `Allowed Callback URLs`.
* The URL you need to put in the text box is your space URL, for example: `https://space-name-here-staging.herokuapp.com/` followed by: `auth0/callback`. So it will look like: `https://space-name-here-staging.herokuapp.com/auth0/callback`.
* Click the `Save Changes` button at the bottom of the page

You will now be able to test your application on a staging environment. So, if you head over to your Heroku dashboard, you should see the build in progress or complete. After this build is completed, you can browse to the URL for your staging environment and you will see an exact duplicate of the production environment.

## Conclusion

The deployment process is a very broad subject. It can also be very daunting for someone who hasn't had any exposure to this part of development. Hopefully, this article will have given you a footstep into the world of deploying PHP applications.

With this article, you should have the foundation for creating, designing, and deploying the PHP application you always wanted!
