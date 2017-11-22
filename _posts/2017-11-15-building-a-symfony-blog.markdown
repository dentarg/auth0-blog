---
layout: post
title: "Building a Symfony blog"
description: In this tutorial we create an open blog in Symfony which allows users to sign up and become authors, using Auth0 to authenticate
date: 2017-11-15 15:49
category: key
author:
  name: Greg Holmes
  url: https://github.com/GregHolmes
  mail: iam@gregholmes.co.uk
design:
  bg_color: "#3B3B3B"
  image: https://cdn.auth0.com/blog/Symfony/Logo.png
tags:
- symfony
- bootstrap
- authentication
- web-app
- auth0
related:
-
---

**TL;DR:** Symfony is a PHP framework as well as a set of reusable PHP components and libraries. It uses the Model-View-Controller design pattern, and can be scaled to be used in any requirement.  It aims to speed up the creation and maintenance of web applications, replacing repetitive code. In this tutorial, I'll show you how to create your very own blog, with the content stored in the database and authentication through Auth0. The finished code can be found at this [repo](https://github.com/GregHolmes/symfony-blog).

---

## Introduction

### What is Symfony?

* TODO: Talk about Symfony

## Implementation of a basic Symfony blog

### Installing Symfony

Install symfony via composer with the following command: `composer create-project symfony/framework-standard-edition:"3.3.11" blog`

Once composer has finished downloading all the required third party libraries, it will ask you to input a number of parameters. Please just leave these empty, pressing return on each line.

Change directory into your project with: `cd blog`

* Create & Populate DotEnv file

In your root directory create file called `.env`
Paste the following into there:

```
    DATABASE_HOST={DATABASE_HOST}
    DATABASE_PORT=3306
    DATABASE_NAME={DATABASE_NAME}
    DATABASE_USER=root
    DATABASE_PASSWORD={DATABASE_PASSWORD}
```

Please replace any of the values with the correct settings for your database. So replace `{DATABASE_HOST}` for example with `localhost`.

Next. Lets find the `app/config/config.yml` file. Within there you'll find the following:

```
 # Doctrine Configuration
 doctrine:
     dbal:
        driver: pdo_mysql
        host: '%database_host%'
        port: '%database_port%'
        dbname: '%database_name%'
        user: '%database_user%'
        password: '%database_password%'
        charset: UTF8
```

We want to replace anything that is wrapped around `'%` and `%'` to contain the DotEnv configurations. So it will look like:

```
# Doctrine Configuration
doctrine:
    dbal:
        driver: pdo_mysql
        host: '%env(DATABASE_HOST)%'
        port: '%env(DATABASE_PORT)%'
        dbname: '%env(DATABASE_NAME)%'
        user: '%env(DATABASE_USER)%'
        password: '%env(DATABASE_PASSWORD)%'
        charset: UTF8
```

**NOTE** All this does is retrieve the database details from .env file rather than `app/config/parameters.yml`

Now need to just make some minor configuration changes so that Symfony knows to read from the .env file.

Edit the `bin/console`, `web/app_dev.php`, `web/app.php` files. Above `$kernel = new AppKernel($env, $debug)` in each file, paste the following:

```
    try {
        (new \Symfony\Component\Dotenv\Dotenv())->load(__DIR__.'/../.env');
    } catch (\Symfony\Component\Dotenv\Exception\PathException $e) {

    }
```

We now need to create the database, so run: `php bin/console doctrine:database:create`, which will create you a database with the name you put into the `.env` file.

* Create new Author entity `php bin/console doctrine:generate:entity` & Populate properties for Author

When it asks for the Entity shortcut name, type in: `AppBundle:Author`

Keep the default on `Configuration format`, but this next step we need to add all of the properties on our Author. Please refer to the image below for the entries required for an Author table:

<Insert image here>

* Create new BlogPost entity `php bin/console doctrine:generate:entity` & Populate properties for BlogPost

When it asks for the Entity shortcut name, type in: `AppBundle:BlogPost`

Keep the default on `Configuration format`, but this next step we need to add all of the properties on our BlogPost. Please refer to the image below for the entries required for a BlogPost table:

<Insert image here>

You may have noticed that we've added a created_at, updated_at and author. These fields all need some extra changes to be made in the entity file itself. So open `src/AppBundle/Entity/BlogPost.php`

Find `private $author;` and replace the annotation above this from:

```
    /**
     * @var int
     *
     * @ORM\Column(name="author", type="integer")
     */
```

to:

```
    /**
     * @var Author
     *
     * @ORM\ManyToOne(targetEntity="Author")
     * @ORM\JoinColumn(name="author_id", referencedColumnName="id")
     */
```

Next. Replace the Author getter and setter from:

```
    /**
     * Set author
     *
     * @param integer $author
     *
     * @return BlogPost
     */
    public function setAuthor($author)
    {
        $this->author = $author;

        return $this;
    }

    /**
     * Get author
     *
     * @return int
     */
    public function getAuthor()
    {
        return $this->author;
    }
```

to:

```
    /**
     * Set author
     *
     * @param Author $author
     *
     * @return BlogPost
     */
    public function setAuthor(Author $author)
    {
        $this->author = $author;

        return $this;
    }

    /**
     * Get author
     *
     * @return Author
     */
    public function getAuthor()
    {
        return $this->author;
    }
```

All we have done here is make sure the entity knows that Author has a ManyToOne relationship with BlogPost

At the bottom of your class, we want to make sure that mysql knows to populate and update the created_at and updated_at columns when a persist or update is made to the database. So paste the following at the bottom of the class:

```
    /**
     * @ORM\PrePersist
     */
    public function prePersist()
    {
        if (!$this->getCreatedAt()) {
            $this->setCreatedAt(new \DateTime());
        }

        if (!$this->getUpdatedAt()) {
            $this->setUpdatedAt(new \DateTime());
        }
    }

    /**
     * @ORM\PreUpdate
     */
    public function preUpdate()
    {
        $this->setUpdatedAt(new \DateTime());
    }
```

Now this is useless until you make sure that the class has lifecycle call backs so in the annotation above the class, you'll see:

```
/**
 * BlogPost
 *
 * @ORM\Table(name="blog_post")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\BlogPostRepository")
```

under `* @ORM\Entity()` add a new line and place this in there:

```
 * @ORM\HasLifecycleCallbacks
```

TODO: ADD tostring for both Author and BlogPost.

Our entities are all set up! But.. we don't have the database tables yet.

* Install Doctrine-migrations

Run: `composer require doctrine/doctrine-migrations-bundle "^1.0"`

In `app/AppKernel.php` under the method `registerBundles` in the `$bundles` array, add a new row and place the following in there:

`new Doctrine\Bundle\MigrationsBundle\DoctrineMigrationsBundle(),`


At the bottom of `app/config/config.yml` add:

```
doctrine_migrations:
    dir_name: "%kernel.root_dir%/DoctrineMigrations"
    namespace: Application\Migrations
    table_name: migration_versions
    name: Application Migrations
    organize_migrations: false # Version >=1.2 Possible values are: "BY_YEAR", "BY_YEAR_AND_MONTH", false
```

Run a migrations diff `php bin/console doctrine:migrations:diff`

This will generate a file in `app/DoctrineMigrations/` starting with `Version` then the date and time it was created. So for you, there'll only be the one file. This file contains the migration queries for creating the new mysql tables.

Migrate: `php bin/console doctrine:migrations:migrate`

* Install Doctrine-Fixtures

We want to just populate some data into your newly created tables as examples during the creation of the blog. So install doctrine-fixtures.

`composer require --dev doctrine/doctrine-fixtures-bundle`

In your `app/AppKernel.php` you want to add the bundle but specifically only for development or testing environments. So add this line `$bundles[] = new Doctrine\Bundle\FixturesBundle\DoctrineFixturesBundle();` as shown below.

```
    public function registerBundles()
    {
        // ...
        if (in_array($this->getEnvironment(), array('dev', 'test'), true)) {
            // ...
            $bundles[] = new Doctrine\Bundle\FixturesBundle\DoctrineFixturesBundle();
        }

        return $bundles;
    }
```

* Create basic entry for Author and BlogPost

Create a new file (and the directories the file is stored in) under `src/AppBundle/DataFixtures/ORM/Fixtures.php` and insert the following into the file:

```
<?php

namespace AppBundle\DataFixtures\ORM;

use AppBundle\Entity\Author;
use AppBundle\Entity\BlogPost;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;

class Fixtures extends Fixture
{
    public function load(ObjectManager $manager)
    {
        $author = new Author();
        $author
            ->setName('Joe Bloggs')
            ->setTitle('Developer')
            ->setUsername('auth0-username')
            ->setCompany('The Writing Company')
            ->setShortBio('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.')
            ->setPhone('070000000')
            ->setFacebook('joebloggs')
            ->setTwitter('joe.bloggs')
            ->setGithub('joe-bloggs');

        $manager->persist($author);

        $blogPost = new BlogPost();
        $blogPost
            ->setTitle('Your first blog post example')
            ->setSlug('first-post')
            ->setDescription('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.')
            ->setBody('Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32. The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.')
            ->setAuthor($author);
        $manager->persist($blogPost);
        $manager->flush();
    }
}
```

This is basically just a file that when loaded, will create an author, a blog post and link the author to the blog post.

* Run fixtures.

Lets run the fixtures! `php bin/console doctrine:fixtures:load`

Now we have our entities, database, database tables and some dummy data in the tables.

### Installing Bootstrap

In order to install Bootstrap we need Symfony's Webpack Encore, which is a simpler way to integrate Webpack into your application. You can install this by running the following command:

`yarn add @symfony/webpack-encore --dev`

You will see in your root directory of your project, 2 new files (`package.json`, `yarn.lock`) and a new directory (`node_modules`), if committing this to version control, you should add node_modules directory to .gitignore.

Create `webpack.config.js` in the root of the project, this is just the file that contains all of your web pack configurations.

Paste the following code into this file:

```
    // webpack.config.js
    var Encore = require('@symfony/webpack-encore');

    Encore
        // directory where all compiled assets will be stored
        .setOutputPath('web/build/')

        // what's the public path to this directory (relative to your project's document root dir)
        .setPublicPath('/build')

        // empty the outputPath dir before each build
        .cleanupOutputBeforeBuild()

        // will output as web/build/app.js
        .addEntry('app', './assets/js/main.js')

        // will output as web/build/global.css
        .addStyleEntry('global', './assets/css/global.scss')

        // allow sass/scss files to be processed
        .enableSassLoader()

        // allow legacy applications to use $/jQuery as a global variable
        .autoProvidejQuery()

        .enableSourceMaps(!Encore.isProduction())

        // create hashed filenames (e.g. app.abc123.css)
        // .enableVersioning()
    ;

    // export the final configuration
    module.exports = Encore.getWebpackConfig();
```

Lets create a SCSS and Javascript file in our assets directory to be used in the configuration above, they can be left empty for now. We will populate them further in the tutorial.

* `assets/js/main.js`
* `assets/css/global.scss`

Running this command, `yarn run encore dev --watch`, will allow you to compile your javascript and CSS into assets to be used in your Symfony templates.

**NOTE** You may need extra packages installed, Encore will tell you these when you run the command above. Please do as Encore suggests to proceed. It will likely be to run this command: `yarn add sass-loader node-sass --dev`

**NOTE** When you put your code in production please run this command: `yarn run encore production`, It will not only compile the assets but also minify and optimize them.

Open your base twig template which can be found: `app/Resources/views/base.html.twig`

Find the following line (It should be line 6): `{% block stylesheets %}{% endblock %}`.

Within this block we need to include the global.css file. So it will look like:

```
    {% block stylesheets %}
        <link rel="stylesheet" href="{{ asset('build/global.css') }}">
    {% endblock %}
```

Then in the same file find `{% block javascripts %}{% endblock %}` and place the `app.js` include in between. So it will look like:

```
    {% block javascripts %}
        <script src="{{ asset('build/app.js') }}"></script>
    {% endblock %}
```

We've now included both our empty compiled CSS and Javascript files into our base template to be used throughout our app!

**NOTE** If you are running `yarn run encore dev --watch` (Which is advisable for the duration of this tutorial), you will need to open a second Terminal to run the other commands required.

In order to make use of Bootstrap we need to install jQuery, so in your second Terminal run: `yarn add jquery --dev`

Once installed at the top of your empty `assets/js/main.js` file, insert `var $ = require('jquery');`.

We want an app css assets file so, lets create the following file `assets/css/main.scss`
And in `assets/js/main.js` at the bottom paste the following: `require('../css/main.scss');`

Finally, in your `base.html.twig` In the Stylesheets block, paste the following: `<link rel="stylesheet" href="{{ asset('build/app.css') }}">`

Now we need to install bootstrap-sass with the following command: `yarn add bootstrap-sass --dev`
We need to import this into our Sass file. So in `assets/css/global.scss` lets put in the following lines:

```
// customize some Bootstrap variables
$brand-primary: darken(#428bca, 20%);

// the ~ allows you to reference things in node_modules
@import '~bootstrap-sass/assets/stylesheets/bootstrap';
```

There is a possibility your Webpack builds can reduce in speed. So a solution to this is to use the `resolveUrlLoader` by placing the following code into your `webpack.config.js`

```
     .enableSassLoader(function(sassOptions) {}, {
         resolveUrlLoader: false
     })
```

We're going to want to override the path to icons by loading Bootstrap in your `global.scss` file:

```
    $icon-font-path: "~bootstrap-sass/assets/fonts/bootstrap/";
```

Finally in your `main.js` file you need to require bootstrap-sass under your `var $ = require('jquery');` line
```
    // JS is equivalent to the normal "bootstrap" package
    // no need to set this to a variable, just require it
    require('bootstrap-sass');
```

You've now set up Bootstrap to be used in your Symfony Blog.

### Showing blog posts

Lets create our blog controller by running the following command: `php bin/console generate:controller`

If you follow the instructions as shown by the input, you'll find that you have a new Controller class in `src/AppBundle/Controllers` called BlogController, you'll also have 3 new templates in `src/AppBundle/Resources/views/`

<screenshot of new controller>

Lets delete the DefaultController as it's not needed, so delete the file `src/AppBundle/Controllers/DefaultController.php`

Open `src/AppBundle/Controllers/BlogController.php` and find the `entriesAction`

### Showing all blog posts.

Configure the routing for this controller to be the index and give the action a service name. So above `public function entriesAction()` replace the annotation with:

```
    /**
     * @Route("/", name="index")
     * @Route("/entries", name="entries")
     */
```

This allows us to call the action by the service name, but also places the root route as displaying the entries.

We need to make use the entity manager and the repositories for the entities in order to retrieve database data. At the top of the BlogController class we want to inject these services.

```
    /** @var EntityManagerInterface */
    private $entityManager;

    /** @var \Doctrine\Common\Persistence\ObjectRepository */
    private $authorRepository;

    /** @var \Doctrine\Common\Persistence\ObjectRepository */
    private $blogPostRepository;

    /**
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
        $this->blogPostRepository = $entityManager->getRepository('AppBundle:BlogPost');
        $this->authorRepository = $entityManager->getRepository('AppBundle:Author');
    }
```

As you can see there is a class declared here so we need to add it to the namespaces at the top of the file. Where it says:

```
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
```

Add: `use Doctrine\ORM\EntityManagerInterface;` above the two.

Great, in our entire controller we can call the blogPostRepository, authorRepository or entityManager as and when needed. The first 2 are used for retrieving data from the database, where as the third will be used for inserting, updating, or deleting data (It can also be used for retrieving but by setting up the construct this way, we will be reducing duplicate code)

* Complete action

Let us populate the entriesAction now:

```
return $this->render('AppBundle:Blog:entries.html.twig', [
    'blogPosts' => $this->blogPostRepository->findAll()
]);
```

* Complete template

We need some styling. For this article, I've borrowed an example template from Bootstrap. You can find their examples here: https://getbootstrap.com/docs/3.3/getting-started/#examples

The CSS below, will need to be pasted into `assets/css/main.scss` (If you still have a terminal open with `yarn run encore dev --watch` it will auto compile these changes for you.

```
/*
 * Globals
 */

body {
  font-family: Georgia, "Times New Roman", Times, serif;
  color: #555;
}

h1, .h1,
h2, .h2,
h3, .h3,
h4, .h4,
h5, .h5,
h6, .h6 {
  margin-top: 0;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: normal;
  color: #333;
}


/*
 * Override Bootstrap's default container.
 */

@media (min-width: 1200px) {
  .container {
    width: 970px;
  }
}


/*
 * Masthead for nav
 */

.blog-masthead {
  background-color: #428bca;
  -webkit-box-shadow: inset 0 -2px 5px rgba(0,0,0,.1);
  box-shadow: inset 0 -2px 5px rgba(0,0,0,.1);
}

/* Nav links */
.blog-nav-item {
  position: relative;
  display: inline-block;
  padding: 10px;
  font-weight: 500;
  color: #cdddeb;
}
.blog-nav-item:hover,
.blog-nav-item:focus {
  color: #fff;
  text-decoration: none;
}

/* Active state gets a caret at the bottom */
.blog-nav {
  .active {
    color: #fff;
  }

  .active:after {
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 0;
    margin-left: -5px;
    vertical-align: middle;
    content: " ";
    border-right: 5px solid transparent;
    border-bottom: 5px solid;
    border-left: 5px solid transparent;
  }
}


/*
 * Blog name and description
 */

.blog-header {
  padding-top: 20px;
  padding-bottom: 20px;
}
.blog-title {
  margin-top: 30px;
  margin-bottom: 0;
  font-size: 60px;
  font-weight: normal;
}
.blog-description {
  font-size: 20px;
  color: #999;
}


/*
 * Main column and sidebar layout
 */

.blog-main {
  font-size: 18px;
  line-height: 1.5;
}

/* Sidebar modules for boxing content */
.sidebar-module {
  padding: 15px;
  margin: 0 -15px 15px;
}
.sidebar-module-inset {
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 4px;
}
.sidebar-module-inset p:last-child,
.sidebar-module-inset ul:last-child,
.sidebar-module-inset ol:last-child {
  margin-bottom: 0;
}

/* Pagination */
.pager {
  margin-bottom: 60px;
  text-align: left;
}
.pager > li > a {
  width: 140px;
  padding: 10px 20px;
  text-align: center;
  border-radius: 30px;
}

/*
 * Blog posts
 */
.blog-post {
  margin-bottom: 60px;
}
.blog-post-title {
  margin-bottom: 5px;
  font-size: 40px;
}
.blog-post-meta {
  margin-bottom: 20px;
  color: #999;
}


/*
 * Footer
 */
.blog-footer {
  padding: 40px 0;
  color: #999;
  text-align: center;
  background-color: #f9f9f9;
  border-top: 1px solid #e5e5e5;
}
.blog-footer p:last-child {
  margin-bottom: 0;
}
```

Time to show your blog posts in a template file. Open `src/AppBundle/Resources/views/Blog/entries.html.twig`

Change the title to whatever you wish, I changed it to `Blog posts` and inside `{% block body %}` paste the following code:

```
    <div class="container">
        <div class="blog-header">
            <h1 class="blog-title">Blog tutorial</h1>
            <p class="lead blog-description">A basic description of the blog, built in Symfony, styled in Bootstrap 3, secured by Auth0.</p>
        </div>

        <div class="row">
            <div class="col-sm-8 blog-main">
                {% for blogPost in blogPosts %}
                    {% set paragraphs = blogPost.description|split('</p>') %}
                    {% set firstParagraph = paragraphs|first ~ '</p>' %}
                    <div class="blog-post">
                        <h2 class="blog-post-title">
                            {{ blogPost.title }}
                        </h2>
                        <p class="blog-post-meta">
                            {{ blogPost.getUpdatedAt|date('F j, Y') }} by

                            {% if blogPost.author %}
                                {{ blogPost.author.name }}
                            {% else %}
                                Unknown Author
                            {% endif %}
                        </p>
                        {{ firstParagraph|raw }}<br />
                    </div>
                {% else %}
                    <div class="alert alert-danger" role="alert">
                        <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                        <span class="sr-only">Error:</span>
                        You have no blog articles. Please log in and create an article.
                    </div>
                {% endfor %}
            </div>
        </div>
    </div>
```

The above code is just the usual basic data you'll find on a blog post, the description of the post, the author's name and when it was created.

Lets start the symfony server so you can see your handy work! Run: `php bin/console server:start` and then open the URL in the green bar which for me was: `http://127.0.0.1:8000`

You should now be able to see a blog post!

* Show screenshot.

* Add pagination.

We don't want to be loading all blog posts into the page, so lets add some pagination.

In the `src/AppBundle/Controllers/BlogController.php` find `entriesAction()` and within the empty brackets type in: `Request $request`

At the top of the controller we need to include this class so where it shows:

```
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Doctrine\ORM\EntityManagerInterface;
```

Paste the following below those:

`use Symfony\Component\HttpFoundation\Request;`

Request allows you to gather data for example if there are any parameters in a POST or GET request.

At the top of our BlogController class, lets add a blog post limit constant:

```
    /** @var integer */
    const POST_LIMIT = 5;
```

We will want to default the page number to 1, but then make use of the object $request to find out if the user is on a different page number. So in the top of your `entriesAction` place the following:

```
    $page = 1;

    if ($request->get('page')) {
        $page = $request->get('page');
    }
```

This data is useless to us unless BlogPostRepository knows what to do with it. When we created the BlogPost entity, it also created a repository for us to have our methods for custom queries or more indepth queries. So open: `src/AppBundle/Repository/BlogPostRepository.php`

First method we're going to need is to get all of the posts, based off the page number and the limit previously set in the BlogController. The method below does exactly that. It retrieves the paginated number of blog posts.

```
    /**
     * @param int $page
     * @param int $limit
     *
     * @return array
     */
    public function getAllPosts($page = 1, $limit)
    {
        $entityManager = $this->getEntityManager();
        $queryBuilder = $entityManager->createQueryBuilder();
        $queryBuilder
            ->select('bp')
            ->from('AppBundle:BlogPost', 'bp')
            ->setFirstResult($limit * ($page - 1))
            ->setMaxResults($limit);

        return $queryBuilder->getQuery()->getResult();
    }
```

We're going to need another method in order to get the count of blog posts so that our pagination can know whether you're on the last page or not. So below the previously added method, add another:

```
    /**
     * @return array
     */
    public function getPostCount()
    {
        $entityManager = $this->getEntityManager();
        $queryBuilder = $entityManager->createQueryBuilder();
        $queryBuilder
            ->select('count(bp)')
            ->from('AppBundle:BlogPost', 'bp');

        return $queryBuilder->getQuery()->getSingleScalarResult();
    }
```

Back in the `entitiesAction` in your BlogController we're going to need to make use of those methods.

Your return previously looked like:

```
    return $this->render('AppBundle:Blog:entries.html.twig', [
        'blogPosts' => $this->blogPostRepository->findAll()
    ]);
```

Lets call those methods and pass the data aswell as the page number and post limit into the template:

```
    return $this->render('AppBundle:Blog:entries.html.twig', [
        'blogPosts' => $this->blogPostRepository->getAllPosts($page, self::POST_LIMIT),
        'totalBlogPosts' => $this->blogPostRepository->getPostCount(),
        'page' => $page,
        'entryLimit' => self::POST_LIMIT
    ]);
```

In your `entries.html.twig` template. Find `{% endfor %}`. Below this we want to add the pagination buttons. So lets put the following code there:

```
    {% set canPrevious = page > 1 %}
    {% set canNext = (page * entryLimit) < totalBlogPosts %}
    <nav>
        <ul class="pager">
            <li class="previous {% if canPrevious == false %}disabled{% endif %}">
                <a href="{% if canPrevious %}{{ path('entries', {'page': page - 1}) }}{% endif %}">
                    <span aria-hidden="true">&larr;</span> Older
                </a>
            </li>
            <li class="next {% if canNext == false %}disabled{% endif %}">
                <a href="{% if canNext %}{{ path('entries', {'page': page + 1}) }}{% endif %}">
                    Newer <span aria-hidden="true">&rarr;</span>
                </a>
            </li>
        </ul>
    </nav>
```

The above code determines whether the user can action a previous and/or a next page.

Now reload your browser, you'll see the previously shown blog post, but below that you'll see disabled "Previous" and "Next" buttons, they're disabled because you're on page 1, and there is only 1 blog post.

### Showing specific blog post

* Complete action

On the `entryAction`, lets add a service name to the action, so where it shows: `* @Route("/entry/{slug}")` lets add the name: `* @Route("/entry/{slug}", name="entry")`

Lets retrieve the blog post from the database by the given slug at the top of the method:

`$blogPost = $this->blogPostRepository->findOneBySlug($slug);`

We need to really make sure the blog post exists before passing data into and displaying the template. So lets now do a check:

```
    if (!$blogPost) {
        $this->addFlash('error','Unable to find entry!');

        return $this->redirectToRoute('entries');
    }
```

This will set a "flash" session with an error message and redirect the user to the entries page to display the error.

Next in the return's 2nd argument (the array), put in an entry: `'blogPost' => $blogPost` so your final action will look like:

```
     /**
      * @Route("/entry/{slug}", name="entry")
      */
     public function entryAction($slug)
     {
         $blogPost = $this->blogPostRepository->findOneBySlug($slug);

         if (!$blogPost) {
             $this->addFlash('error','Unable to find entry!');

             return $this->redirectToRoute('entries');
         }

         return $this->render('AppBundle:Blog:entry.html.twig', array(
             'blogPost' => $blogPost
         ));
     }
```

We now need to output this data in the template. So open `src/AppBundle/Resources/views/Blog/entry.html.twig`

Within `{% block body %}` we need to add some content:

```
    <div class="container">
        <div class="blog-header">
            <h1 class="blog-title">Blog tutorial</h1>
            <p class="lead blog-description">A basic description of the blog, built in Symfony, styled in Bootstrap 3, secured by Auth0.</p>
        </div>

        <div class="row">
            <div class="col-sm-8 blog-main">
                <div class="blog-post">
                    <h2 class="blog-post-title">{{ blogPost.title }}</h2>
                    <p class="blog-post-meta">{{ blogPost.updatedAt|date('F j, Y') }} by {{ blogPost.author.name }}</p>
                    <h3>Description:</h3>
                    <p>{{ blogPost.description|raw }}</p>

                    <h3>Body:</h3>
                    <p>{{ blogPost.body|raw }}</p>
                </div>
            </div>
        </div>
    </div>
```

The above code simply outputs the details of the blog post, its title, when it was updated at, the author, description and the body.

Our next problem is how to access this new page we've created. Back in your `entries.html.twig` template, find `{{ firstParagraph|raw }}<br />` and below paste:

`<a href="{{ path('entry', {'slug': blogPost.slug}) }}">Read more</a>`

Find: `{{ blogPost.title }}` and wrap this in `<a>` tags so it will look like:

```
    <a href="{{ path('entry', {'slug': blogPost.slug}) }}">
        {{ blogPost.title }}
    </a>
```

Now... refresh your browser, you'll see the title has changed to a link, and there is now a "Read more" at the bottom of your article. Click one of those and you'll see your new page!

* Show screenshot

### Showing author details

Want to see more details about the author of the post? Lets go to the `authorAction` in your controller. We're going to be doing something very similar to retrieving the single entry.
We'll be getting the name passed in via the URL, finding the author by name in the database. And then passing that data into the author template, as shown below:

```
    $author = $this->authorRepository->findOneByUsername($name);

    if (!$author) {
        $this->addFlash('error','Unable to remove author!');

        return $this->redirectToRoute('entries');
    }

    return $this->render('blog/author.html.twig', [
        'author' => $author
    ]);
```

At the top of the method in the annotations we also want to add the service name so: `* @Route("/author/{name}")` will become: `* @Route("/author/{name}", name="author")`

* Complete template

With the template, we won't be doing anything special, just outputting the data the Author has:

```
    <div class="container">
        <div class="blog-header">
            <h1 class="blog-title">Author</h1>
            <p class="lead blog-description">A brief look into the author.</p>
        </div>

        <div class="row">
            <div class="col-sm-8 blog-main">
                <div class="blog-post">
                    <h2 class="blog-post-title">{{ author.name|raw }}</h2>

                    <p>Title: {{ author.title|raw }}</p>
                    <p>Company: {{ author.company|raw }}</p>
                    <p>Short Biography: {{ author.shortBio|raw }}</p>
                    <ul>
                        {% if author.getPhone %}
                            <li>{{ author.phone }}</li>
                        {% endif %}
                        {% if author.getFacebook %}
                            <li>{{ author.facebook }}</li>
                        {% endif %}
                        {% if author.getTwitter %}
                            <li>{{ author.twitter }}</li>
                        {% endif %}
                        {% if author.getGithub %}
                            <li>{{ author.github }}</li>
                        {% endif %}
                    </ul>

                </div>
            </div>
        </div>
    </div>
```

We now need to have that author page linkable for people to access it. In: `src/AppBundle/Resources/views/Blog/entries.html.twig`

you will find:

```
    {% if blogPost.author %}
        {{ blogPost.author.name }}
    {% else %}
```

Lets make this a link as shown below:

```
    <a href="{{ path('author', {'name': blogPost.author.username|url_encode }) }}">
        {{ blogPost.author.name }}
    </a>
```

And in `src/AppBundle/Resources/views/Blog/entry.html.twig` you will find:

```
    <p class="blog-post-meta">{{ blogPost.updatedAt|date('F j, Y') }} by {{ blogPost.author.name }}</p>
```

So lets replace that with the following:

```
    <p class="blog-post-meta">
        {{ blogPost.updatedAt|date('F j, Y') }} by <a href="{{ path('author', {'name': blogPost.author.username|url_encode }) }}">
            {{ blogPost.author.name }}
        </a>
    </p>
```

Refresh your browser, you will see the author names have a link now.

* Show screenshot

## Advanced functionality with Auth0

### Installing HWIOAuth Bundle

* Install dependency

In order to install the HWIOAuth Bundle, which uses a virtual package php-http/client-implementation, we need to install several third party libraries, run this command: `composer require php-http/httplug-bundle php-http/curl-client guzzlehttp/psr7`

Once composer has finished, we need to enable this in our `app/AppKernel.php` in the `$bundles` array, add a new row placing the following in there:

`new Http\HttplugBundle\HttplugBundle(),`

The next steps can also be found here on Auth0's quickstart guide for Symfony: https://manage.auth0.com/#/clients/UvEW6YEoV3gyUyLZsKYzrwzSy41y7YX8/quickstart

* Install bundle

Open your `composer.json` file and add HWIOAuthBundle (As well as adding the minimum-stability and prefer-stable options:

```
"minimum-stability": "dev",
"prefer-stable": true,
"require": {
    ...
    "hwi/oauth-bundle": ">=0.6",
},
```

Now run `composer update`

Once completed, in `app/AppKernel.php` under the method `registerBundles` in the `$bundles` array, add a new row and place the following in there:

`new HWI\Bundle\OAuthBundle\HWIOAuthBundle(),`

We need to add the routes to your routing file: `app/config/routing.yml`

```
hwi_oauth_redirect:
    resource: "@HWIOAuthBundle/Resources/config/routing/redirect.xml"
    prefix:   /connect

hwi_oauth_login:
    resource: "@HWIOAuthBundle/Resources/config/routing/login.xml"
    prefix:   /login

auth0_login:
    path:    /auth0/callback

auth0_logout:
    path: /auth0/logout
```

* Configure bundle including dotenv & configs

In order to get the HWIOAuthBundle to connect to Auth0, we need to create an Auth0 resource owner. So create a new file `src/AppBundle/Auth0ResourceOwner.php`

```
<?php

namespace AppBundle;

use Symfony\Component\OptionsResolver\Options;
use Symfony\Component\OptionsResolver\OptionsResolver;

use HWI\Bundle\OAuthBundle\OAuth\ResourceOwner\GenericOAuth2ResourceOwner;

class Auth0ResourceOwner extends GenericOAuth2ResourceOwner
{
    /**
     * {@inheritdoc}
     */
    protected $paths = array(
        'identifier' => 'user_id',
        'nickname' => 'nickname',
        'realname' => 'name',
        'email' => 'email',
        'profilepicture' => 'picture',
    );

    /**
     * {@inheritdoc}
     */
    public function getAuthorizationUrl($redirectUri, array $extraParameters = array())
    {
        return parent::getAuthorizationUrl($redirectUri, array_merge(array(
            'audience' => $this->options['audience'],
        ), $extraParameters));
    }

    /**
     * {@inheritdoc}
     */
    protected function configureOptions(OptionsResolver $resolver)
    {
        parent::configureOptions($resolver);

        $resolver->setDefaults(array(
            'authorization_url' => '{base_url}/authorize',
            'access_token_url' => '{base_url}/oauth/token',
            'infos_url' => '{base_url}/userinfo',
            'audience' => '{base_url}/userinfo',
        ));

        $resolver->setRequired(array(
            'base_url',
        ));

        $normalizer = function (Options $options, $value) {
            return str_replace('{base_url}', $options['base_url'], $value);
        };

        $resolver->setNormalizer('authorization_url', $normalizer);
        $resolver->setNormalizer('access_token_url', $normalizer);
        $resolver->setNormalizer('infos_url', $normalizer);
    }
}
```

We're going to need API keys for Auth0, so go over to https://auth0.com/signup and follow the instructions on the page. Once signed up:

1 - In the dashboard, click `Clients` on the left.
* Create Client
* Add a name
* Choose regular web applications

2 - Configure callback url.
* In your Auth0 `Client` Under the settings tab.
* Find the text box labelled `Allowed Callback URLs`
* Paste the following in: `http://localhost:8000/auth0/callback`

3 - Configure Auth0 Client to require usernames
* In the navigation bar find and click `Connections`
* Then click `Database`
* Click on `Username-Password-Authentication`
* Toggle `Requires Username` to on.
* Add Login functionality.

* Go to `https://manage.auth0.com/#/clients`
* Pick your `Client`

Then in your `.env` file paste the following, but replace the brackets and their contents with the details found on the page you're on at Auth0

```
* AUTH0_CLIENT_ID: (Client ID on Auth0)
* AUTH0_CLIENT_SECRET: (Client Secret on Auth0)
* AUTH0_DOMAIN: (Domain on Auth0)
```

For this to all be used we need to add details to the config file at `app/config/config.yml` at the bottom paste the following:

```
hwi_oauth:
    firewall_names: [secured_area]
    resource_owners:
        auth0:
            type:                oauth2
            class:               'AppBundle\Auth0ResourceOwner'
            client_id:           "%env(AUTH0_CLIENT_ID)%"
            client_secret:       "%env(AUTH0_CLIENT_SECRET)%"
            base_url:            "https://%env(AUTH0_DOMAIN)%"
#            Uncomment this lines if you set audience in .env file
#            options:
#                audience:        "%env(AUTH0_AUDIENCE)%"
            scope: "openid profile"
```

Finally, replace the contents of your `app/config/security.yml` file with:

```
security:

    # https://symfony.com/doc/current/security.html#b-configuring-how-users-are-loaded
    providers:
        in_memory:
            memory: ~
        hwi:
            id: hwi_oauth.user.provider

    firewalls:
        # disables authentication for assets and the profiler, adapt it according to your needs
        dev:
            pattern: ^/(_(profiler|wdt)|css|images|js)/
            security: false
        secured_area:
            anonymous: ~
            oauth:
                resource_owners:
                    auth0: "/auth0/callback"
                login_path:        /login
                use_forward:       false
                failure_path:      /login

                oauth_user_provider:
                    service: hwi_oauth.user.provider
            logout:
                path:   /auth0/logout
                target: /
        main:
            anonymous: ~
            # activate different ways to authenticate

            # https://symfony.com/doc/current/security.html#a-configuring-how-your-users-will-authenticate
            #http_basic: ~

            # https://symfony.com/doc/current/security/form_login_setup.html
            #form_login: ~

    access_control:
        - { path: ^/login, roles: IS_AUTHENTICATED_ANONYMOUSLY }
        - { path: ^/admin, roles: ROLE_OAUTH_USER }
```

The config above is setting up urls/sections in your blog that require the user to be authenticated.

We now need somehow of authenticating. But we've also got another problem. In our blog, we can't navigate around. So once you've clicked on a blog post, you can't go anywhere else. So lets add a navigation bar at the top of the page, and to be included in all pages.
This allows us to show a log in button, as well as basic navigation.

Lets create a new file: `src/AppBundle/Resources/nav_bar.html.twig` and paste the following code in:

```
<nav class="navbar navbar-default navbar-fixed-top">
    <div id="navbar" class="collapse navbar-collapse pull-right">
        <ul class="nav navbar-nav">
            {% if app.request.get('_route') not in ['index', 'entries'] %}
                <li><a href="{{ path("index") }}">Home</a></li>
            {% endif %}
            {% if app.user %}
                <li><a href="{{ path("admin_index") }}">Admin</a></li>
                <li><a href="{{ logout_url("secured_area") }}">Logout</a></li>
            {% else %}
                <li class="active"><a href="/connect/auth0">Login</a></li>
            {% endif %}
        </ul>
    </div>
</nav>
```

This is great, but our code doesn't know this exists in our other templates. In each of our templates found in: `src/AppBundle/Resources/views/Blog/` under each `{% block body %}` add: `{% include 'AppBundle:includes:nav_bar.html.twig' %}`, If you reload your browser you'll then see a bar at the top with the Login link.

### Create an author page

* Create controller method

Lets create our admin blog controller by running the following command: `php bin/console generate:controller`

If you follow the instructions as shown by the input, you'll find that you have a new Controller class in `src/AppBundle/Controllers/` called AdminController, you'll also have 3 new templates in `src/AppBundle/Resources/views/Admin/`

<screenshot of new controller>

* Create the form

First thing we will want to do is create a new form. This is a class that allows us to validate the users input, such as creating an author. So in `src/AppBundle` create a new directory called `Form`
And within that directory create a new file named `AuthorFormType.php`. Below will be the code used in your new file:

```
<?php

namespace AppBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\NotBlank;

class AuthorFormType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        // Below is all of the inputs that the author will see when creating their new author access. Each one contains its own attributes where applicable, such as the field `name` being required.
        // Please note the naming of these form elements is the same naming as the entity. We will be passing in the Author entity so the form knows what the data is for.
        $builder
            ->add(
                'name',
                TextType::class,
                [
                    'constraints' => [new NotBlank()],
                    'attr' => ['class' => 'form-control']
                ]
            )
            ->add(
                'title',
                TextType::class,
                [
                    'constraints' => [new NotBlank()],
                    'attr' => ['class' => 'form-control']
                ]
            )
            ->add(
                'company',
                TextType::class,
                [
                    'constraints' => [new NotBlank()],
                    'attr' => ['class' => 'form-control']
                ]
            )
            ->add(
                'shortBio',
                TextareaType::class,
                [
                    'constraints' => [new NotBlank()],
                    'attr' => ['class' => 'form-control']
                ]
            )
            ->add(
                'phone',
                TextType::class,
                [
                    'attr' => ['class' => 'form-control'],
                    'required' => false
                ]
            )
            ->add(
                'facebook',
                TextType::class,
                [
                    'attr' => ['class' => 'form-control'],
                    'required' => false
                ]
            )
            ->add(
                'twitter',
                TextType::class,
                [
                    'attr' => ['class' => 'form-control'],
                    'required' => false
                ]
            )
            ->add(
                'github',
                TextType::class,
                [
                    'attr' => ['class' => 'form-control'],
                    'required' => false
                ]
            )
            ->add(
                'submit',
                SubmitType::class,
                [
                    'attr' => ['class' => 'form-control btn-primary pull-right'],
                    'label' => 'Become an author!'
                ]
            );
    }

    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => 'AppBundle\Entity\Author'
        ]);
    }

    /**
     * {@inheritdoc}
     */
    public function getName()
    {
        return 'author_form';
    }
}
```

Back in your new AdminController: `/src/AppBundle/Controller/AdminController.php` we need to make use the entity manager and the repositories for the entities in order to retrieve database data. At the top of the AdminController class we want to inject these services.

```
    /** @var EntityManagerInterface */
    private $entityManager;

    /** @var \Doctrine\Common\Persistence\ObjectRepository */
    private $authorRepository;

    /** @var \Doctrine\Common\Persistence\ObjectRepository */
    private $blogPostRepository;

    /**
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
        $this->blogPostRepository = $entityManager->getRepository('AppBundle:BlogPost');
        $this->authorRepository = $entityManager->getRepository('AppBundle:Author');
    }
```

As you can see there is a class declared here so we need to add it to the namespaces at the top of the file. Where it says:

```
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
```

Add: `use Doctrine\ORM\EntityManagerInterface;` above the two.

Great, in our entire controller we can call the blogPostRepository, authorRepository or entityManager as and when needed. The first 2 are used for retrieving data from the database, where as the third will be used for inserting, updating, or deleting data (It can also be used for retrieving but by setting up the construct this way, we will be reducing duplicate code)

In the AdminController you will find your new `createAuthorAction` method, lets change the annotation so that the method has a service name. So above the controller where you see `@Route` lets add the service name.
So it will look like:

`* @Route("/author/create", name="author_create")`

At the top of the controller we need to include this class so where it shows:

```
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Doctrine\ORM\EntityManagerInterface;
```

Paste the following below those:

`use Symfony\Component\HttpFoundation\Request;`

Request allows you to gather data for example if there are any parameters in a POST or GET request.

Then change `createAuthorAction()` to `createAuthorAction(Request $request)`

We want to make sure the user isn't trying to create themselves as duplicate authors for the same user. So at the top of the `createAuthorAction` lets run a query to check whether one already exists.
Paste the code below into the action, this retrieves the authenticated user with Auth0, checks their username with the authors table to see if one exists, if it does then redirect the user to the index page.

```
   // Check whether user already has an author.
   if ($this->authorRepository->findOneByUsername($this->getUser()->getUserName())) {
       // Redirect to dashboard.
       $this->addFlash('error','Unable to create author, author already exists!');

       return $this->redirectToRoute('entries');
   }
```

Below that we can now create an empty Author entity, create a new AuthorFormType object and pass the Author entity into the form.

```
    $author = new Author();
    $author->setUsername($this->getUser()->getUserName());

    // Use Author form.
    $form = $this->createForm(AuthorFormType::class, $author);
    $form->handleRequest($request);

    // Check is valid
    if ($form->isValid()) {
        $this->entityManager->persist($author);
        $this->entityManager->flush($author);

        $request->getSession()->set('user_is_author', true);
        $this->addFlash('success','Congratulations! You are now an author.');

        return $this->redirectToRoute('entries');
    }
```

We are using 2 new classes here, 1 is the entity Author and the other AuthorFormType class. So lets include these namespaces at the top of our file:

```
namespace AppBundle\Controller;
...
...
use AppBundle\Entity\Author;
use AppBundle\Form\AuthorFormType;
```

The above code will also check whether the form has been submitted, and whether it passes all validations, if it does it will then redirect the user to the index page.

**NOTE:** You may have noticed that it sets a session to true for `user_is_author` this will make sense when we reach the part that discusses and implements event listeners (next).

Finally, we want to pass the form into the template that the user will see. So at the bottom of the method lets change:

```
    return $this->render('AppBundle:Author:create_author.html.twig', array(
        // ...
    ));
```

to:

```
    return $this->render('AppBundle:Author:create_author.html.twig', array(
        'form' => $form->createView()
    ));
```

* Create template

In our template for this action, we just want the user to have all of the form fields displayed as their correct form elements, so in `create_author.html.twig` copy and paste the following:

```
{% extends '::base.html.twig' %}

{% block title %}{% endblock %}

{% block body %}
    {% include 'AppBundle:includes:nav_bar.html.twig' %}

    <div class="container">
        <div class="blog-header">
            <h2 class="blog-title">Creating your author</h2>
        </div>

        <div class="row">
            <div class="col-md-12 col-lg-12 col-xl-12">
                {% for label, messages in app.flashes %}
                    {% for message in messages %}
                        <div class="alert alert-{{ label }}" role="alert">
                            <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                            {{ message }}
                        </div>
                    {% endfor %}
                {% endfor %}
            </div>
            <div class="col-sm-12 blog-main">
                {{ form_start(form) }}
                <div class="col-md-12">
                    <div class="form-group col-md-4">
                        {{ form_row(form.name) }}
                    </div>
                    <div class="form-group col-md-4">
                        {{ form_row(form.title) }}
                    </div>
                    <div class="form-group col-md-4">
                        {{ form_row(form.company) }}
                    </div>
                    <div class="form-group col-md-12">
                        {{ form_row(form.shortBio) }}
                    </div>
                    <div class="form-group col-md-4">
                        {{ form_row(form.phone) }}
                    </div>
                    <div class="form-group col-md-4">
                        {{ form_row(form.facebook) }}
                    </div>
                    <div class="form-group col-md-4">
                        {{ form_row(form.twitter) }}
                    </div>
                    <div class="form-group col-md-4">
                        {{ form_row(form.github) }}
                    </div>
                    <div class="form-group col-md-4">
                        {{ form_row(form.shortBio) }}
                    </div>
                </div>
                <div class="form-group col-md-4 pull-right">
                    {{ form_row(form.submit) }}
                </div>
                {{ form_end(form) }}
            </div>
        </div>
    </div>
{% endblock %}
```

* show screenshot

### Creating event listener to ensure author exists before accessing further functionality

* Create event listener to redirect to author page..

Although a user is authenticated through Auth0, we don't really want them to be able to access the rest of the author section until they've created themself an Author entry in the database with some basic "About me" details. So what we want, is to ensure that any /author/ route they try to access, if they don't have an "Author" entry, we keep redirecting them to the form to create one.

An event listener is as it looks, a listener to specific programmed events which then run predefined code once the conditions are met.

Lets create the CheckIsAuthorListener.php file in `src/AppBundle/EventListener/` and place the following code in there:

```
<?php

namespace AppBundle\EventListener\Author;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Routing\Router;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpKernel\Event\FilterControllerEvent;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorage;

class CheckIsAuthorListener
{
    /** @var Router */
    protected $router;

    /** @var Session */
    protected $session;

    /** @var TokenStorage */
    private $tokenStorage;

    /** @var EntityManagerInterface */
    private $entityManager;

    /**
     * @param Router $router
     * @param Session $session
     * @param TokenStorage $tokenStorage
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(
        Router $router,
        Session $session,
        TokenStorage $tokenStorage,
        EntityManagerInterface $entityManager
    ) {
        $this->router = $router;
        $this->session = $session;
        $this->tokenStorage = $tokenStorage;
        $this->entityManager = $entityManager;
    }

    /**
     * On kernel.controller
     *
     * @param FilterControllerEvent $event
     *
     * @return void
     */
    public function onKernelController(FilterControllerEvent $event)
    {
        // Don't add to the flasher if the current path does not begin with /admin
        if (!preg_match('/^\/admin/i', $event->getRequest()->getPathInfo())) {
            return;
        }

        if (null === $user = $this->tokenStorage->getToken()->getUser()) {
            return;
        }

        // Use the session to exit this listener early, if the relevant checks have already been made
        if (true === $this->session->get('user_is_author')) {
            return;
        }

        $route = $this->router->generate('admin_author_create');

        // Check we are not already attempting to create an author!
        if (0 === strpos($event->getRequest()->getPathInfo(), $route)) {
            return;
        }

        // Check if authenticated user has an author associated with them.
        if ($author = $this->entityManager
                ->getRepository('AppBundle:Author')
                ->findOneByUsername($user->getUsername())
        ) {
            $this->session->set('user_is_author', true);
        }

        if (!$author && $this->session->get('pending_user_is_author')) {
            $this->session->getFlashBag()->add(
                'warning',
                'Your author access is being set up, this may take up to 30 seconds. Please try again shortly.'
            );

            $route = $this->router->generate('entries');
        } else {
            $this->session->getFlashBag()->add(
                'warning',
                'You cannot access the author section until you become an author. Please complete the form below to proceed.'
            );
        }

        $event->setController(function () use ($route) {
            return new RedirectResponse($route);
        });
    }
}
```

We now need to add this class as a service in order for it to be run by Symfony on each controller request so in `app/config/services.yml` add the following a the bottom of the file:

```
    AppBundle\EventListener\Author\CheckIsAuthorListener:
        tags:
            - { name: kernel.event_listener, event: kernel.controller }
```


### Creating a blog post

Now that we have made a member restricted area of the site, lets allow the authenticated users to create a new blog post.

Lets create a new file: `src/AppBundle/Form/EntryFormType.php` and paste the following into there:
```
<?php

namespace AppBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\NotBlank;

class EntryFormType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add(
                'title',
                TextType::class,
                [
                    'constraints' => [new NotBlank()],
                    'attr' => ['class' => 'form-control']
                ]
            )
            ->add(
                'slug',
                TextType::class,
                [
                    'constraints' => [new NotBlank()],
                    'attr' => ['class' => 'form-control']
                ]
            )
            ->add(
                'description',
                TextareaType::class,
                [
                    'constraints' => [new NotBlank()],
                    'attr' => ['class' => 'form-control']
                ]
            )
            ->add(
                'body',
                TextareaType::class,
                [
                    'constraints' => [new NotBlank()],
                    'attr' => ['class' => 'form-control']
                ]
            )
            ->add(
                'create',
                SubmitType::class,
                [
                    'attr' => ['class' => 'form-control btn-primary pull-right'],
                    'label' => 'Create!'
                ]
            );
    }

    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => 'AppBundle\Entity\BlogPost'
        ]);
    }

    /**
     * {@inheritdoc}
     */
    public function getName()
    {
        return 'author_form';
    }
}
```

As you can see, the data class to be used is the entity BlogPost, and if you compare the fields in `buildForm` you'll notice the first argument of each, the name, matches the names of the properties in BlogPost entity.

A new controller method is needed, so lets paste this into your AdminController:

```
    /**
     * @Route("/create-entry", name="admin_create_entry")
     *
     * @param Request $request
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function createEntryAction(Request $request)
    {
        $blogPost = new BlogPost();

        $author = $this->authorRepository->findOneByUsername($this->getUser()->getUserName());
        $blogPost->setAuthor($author);

        $form = $this->createForm(EntryFormType::class, $blogPost);
        $form->handleRequest($request);

        // Check is valid
        if ($form->isValid()) {
            $this->entityManager->persist($blogPost);
            $this->entityManager->flush($blogPost);

            $this->addFlash('success','Congratulations! Your post is created');

            return $this->redirectToRoute('admin_entries');
        }

        return $this->render('AppBundle:Author:entry_form.html.twig', [
            'form' => $form->createView()
        ]);
    }
```
We now need the template so create a new file: `src/AppBundle/Resources/views/Admin/entry_form.html.twig` And insert the following code into that new file:

```
{% extends '::base.html.twig' %}

{% block title %}{% endblock %}

{% block body %}
    {% include 'AppBundle:includes:nav_bar.html.twig' %}

    <div class="container">
        <div class="blog-header">
            <h2 class="blog-title"></h2>
        </div>

        <div class="row">
            <div class="col-sm-12 blog-main">
                {% for label, messages in app.flashes %}
                    {% for message in messages %}
                        <div class="bg-{{ label }}">
                            {{ message }}
                        </div>
                    {% endfor %}
                {% endfor %}

                {{ form_start(form) }}
                    <div class="col-md-12">
                        <div class="form-group col-md-4">
                            {{ form_row(form.title) }}
                        </div>
                        <div class="form-group col-md-4">
                            {{ form_row(form.slug) }}
                        </div>
                        <div class="form-group col-md-12">
                            {{ form_row(form.description) }}
                        </div>
                        <div class="form-group col-md-12">
                            {{ form_row(form.body) }}
                        </div>
                        <div class="form-group col-md-4 pull-right">
                            {{ form_widget(form.create) }}
                        </div>
                    </div>
                {{ form_end(form) }}
            </div>
        </div>
    </div>
{% endblock %}
```

Before we try to create a new entry, lets build the page that displays all of the authenticated users blog posts.

### Displaying blog posts created by authenticated author

In your AuthorController lets add a new method called `entriesAction()` and input the code below. All this will do is retrieve all of the blog posts by the authenticated user and pass those into the template `entries.html.twig` to be displayed.

```
    /**
     * @Route("/", name="admin_index")
     * @Route("/entries", name="admin_entries")
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function entriesAction()
    {
        $author = $this->authorRepository->findOneByUsername($this->getUser()->getUserName());

        $blogPosts = [];

        if ($author) {
            $blogPosts = $this->blogPostRepository->findByAuthor($author);
        }

        return $this->render('AppBundle:Author:entries.html.twig', [
            'blogPosts' => $blogPosts
        ]);
    }
```

Time to create the template `src/AppBundle/Resources/views/Author/entries.html.twig` to store the following code in:

```
{% extends '::base.html.twig' %}

{% block title %}

{% endblock %}

{% block body %}
    {% include 'AppBundle:includes:nav_bar.html.twig' %}

    <div class="container">
        <div class="blog-header">
            <h1 class="blog-title">Author admin</h1>
            <p class="lead blog-description"></p>
        </div>

        <div class="row">
            <div class="col-md-12 col-lg-12 col-xl-12">
                {% for label, messages in app.flashes %}
                    {% for message in messages %}
                        <div class="alert alert-{{ label }}" role="alert">
                            <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                            {{ message }}
                        </div>
                    {% endfor %}
                {% endfor %}
            </div>
            <div class="col-md-12 col-lg-12 col-xl-12">
                <a type="button" href="{{ path('admin_create_entry') }}" class="btn btn-primary pull-right">Add Entry</a>
            </div>
            <div class="col-sm-12 blog-main">
                <table class="table table-striped">
                    <thead>
                        <th>Title</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                    </thead>
                    {% for blogPost in blogPosts %}
                        <tr>
                            <td>{{ blogPost.title }}</td>
                            <td>{{ blogPost.createdAt|date('F j, Y') }}</td>
                            <td>{{ blogPost.updatedAt|date('F j, Y') }}</td>
                        </tr>
                    {% else %}
                        <tr>
                            <td colspan="5">No entries available</td>
                        </tr>
                    {% endfor %}
                </table>
            </div>
        </div>
    </div>
{% endblock %}
```

As you can see in this template, there is a button to "Add entry" which will direct the user to create a new entry when clicked.

### Creating delete functionality for author's posts

The final action for this article is to delete the authenticated users blog posts on demand. So in AdminController create a new method with the following code:

```
    /**
     * @Route("/delete-entry/{entryId}", name="admin_delete_entry")
     *
     * @param $entryId
     *
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     */
    public function deleteEntryAction($entryId)
    {
        $blogPost = $this->blogPostRepository->findOneById($entryId);
        $author = $this->authorRepository->findOneByUsername($this->getUser()->getUserName());

        if (!$blogPost || $author !== $blogPost->getAuthor()) {
            $this->addFlash('error','Unable to remove entry!');

            return $this->redirectToRoute('admin_entries');
        }

        $this->entityManager->remove($blogPost);
        $this->entityManager->flush();

        $this->addFlash('success','Entry was deleted!');

        return $this->redirectToRoute('admin_entries');
    }
```

This will check if the entryId passed in exists, check to ensure the authenticated user is the author of the article and then delete it.

There is no template needed for this, however we still need somewhere in the templates to show the action. So in `src/AppBundle/Resources/views/Author/entries.html.twig` lets make some additions.

In the table headers, lets add a new row, from:

```
    <thead>
        <th>Title</th>
        <th>Created At</th>
        <th>Updated At</th>
    </thead>
```

to:

```
    <thead>
        <th>Title</th>
        <th>Created At</th>
        <th>Updated At</th>
        <th>Action</th>
    </thead>
```

And in the for loop, add a new td, which will contain the delete button, from:

```
    <td>{{ blogPost.title }}</td>
    <td>{{ blogPost.createdAt|date('F j, Y') }}</td>
    <td>{{ blogPost.updatedAt|date('F j, Y') }}</td>
```

to:

```
    <td>{{ blogPost.title }}</td>
    <td>{{ blogPost.createdAt|date('F j, Y') }}</td>
    <td>{{ blogPost.updatedAt|date('F j, Y') }}</td>
    <td><a class="btn btn-danger" href="{{ path('admin_delete_entry', {'entryId': blogPost.id}) }}">Delete</a></td>
```

## Conclusion

* TODO: Write conclusion
