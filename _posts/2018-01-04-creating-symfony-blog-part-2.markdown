---
layout: post
title: "Symfony Tutorial: Building a Blog (Part 2)"
description: "Let's create a secure blog engine with Symfony."
longdescription: "Creating applications with Symfony is easy and can be scaled to be used in any requirement. The tools that it provides to create and maintain web applications is amazing and replaces repetitive tasks. Let's use Symfony to create a blog engine."
date: 2018-01-04 08:30
updated: 2018-02-27 13:15
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
- web-app
related:
- 2017-12-28-symfony-tutorial-building-a-blog-part-1
- 2017-07-26-creating-your-first-symfony-app-and-adding-authentication
- 2016-06-23-creating-your-first-laravel-app-and-adding-authentication
---

**TL;DR:** Symfony is a PHP framework as well as a set of reusable PHP components and libraries. It uses the Model-View-Controller design pattern and can be scaled to be used in any requirement. It aims to speed up the creation and maintenance of web applications, replacing repetitive code. In this part of the article, we will cover installing [Bootstrap, a UI framework for web applications](https://getbootstrap.com/), to make the blog engine look nicer visually. The final code can be found at this [repository](https://github.com/auth0-blog/symfony-blog-part-2).

---

## Symfony Tutorial: About Part 1 and Part 2

[In the first article](https://auth0.com/blog/symfony-tutorial-building-a-blog-part-1/), we:

* installed and configured a Symfony installation;
* created two new database tables: `author` and `blog_post`;
* allowed users to authenticate with [Auth0](https://auth0.com);
* and ensured that the authenticated users have `Author` instances associated before using the system.

In this part of the article, we will cover installing [Bootstrap, a UI framework for web applications](https://getbootstrap.com/), to make the blog engine look nicer visually. We will also enhance our blog engine to allow visitors to:

* see a list of blog posts;
* read a specific blog post;
* and find out more about authors.

Besides that, authenticated authors will be able to:

* create a new blog post;
* see all of their own blog posts;
* and delete their own blog posts from the system.

## Building the Blog Engine

### Before Starting

Make sure you have followed all instructions in the first part. However, if for some reason you lost the code created in the first part, or if you want to start here, [feel free to clone this GitHub repository](https://github.com/auth0-blog/symfony-blog-part-1). The following commands will set up the application for you:

```bash
git clone https://github.com/auth0-blog/symfony-blog-part-1
cd symfony-blog-part-1
```

Install our dependencies with the following command:

```bash
composer install
```

In the root directory is a file called `.env`. Update the following values with your Auth0 credentials:

```yml
AUTH0_CLIENT_ID={AUTH0_CLIENT_ID}
AUTH0_CLIENT_SECRET={AUTH0_CLIENT_SECRET}
AUTH0_DOMAIN={AUTH0_DOMAIN}
```

Note that you will have to replace the values above. [Check the first part to understand how to replace them](https://auth0.com/blog/symfony-tutorial-building-a-blog-part-1/).

__Pro Tip!__ If you do not have a MySQL database available, an easy way to bootstrap one is with Docker:

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

Lastly, if you haven't followed the first part of this series, you might need to issue the following commands to create the database tables and to populate them:

```bash
php bin/console doctrine:database:create
php bin/console doctrine:schema:update --force
php bin/console doctrine:fixtures:load
```

Running the following command, and then opening the URL in your browser, you should see how we left off in the first article.

```bash
php bin/console server:run
```

### Installing Bootstrap

In order to install [Bootstrap](https://getbootstrap.com/), we need [Symfony's Webpack Encore](https://github.com/symfony/webpack-encore), which is a simpler way to integrate [Webpack](https://webpack.js.org/) into your application.

__NOTE__ If you do not have [Yarn](https://yarnpkg.com), a Javascript package manager, installed, you will need to install and configure this first. So go to their [Installation](https://yarnpkg.com/lang/en/docs/install/) page and follow the instructions for installing and configuring Yarn first.

You can install [Symfony's Webpack Encore](https://github.com/symfony/webpack-encore) by running the following command:

```bash
composer require webpack-encore
```

In the root directory of the project, there will be 2 new files (`package.json`, `webpack.config.js`) and a new directory (`assets`).

Open `webpack.config.js`, this is just the file that contains all of the web pack configurations, and replace the contents with:

```JavaScript
var Encore = require('@symfony/webpack-encore');

Encore
    .setOutputPath('public/build/')
    .setPublicPath('/build')
    .cleanupOutputBeforeBuild()
    .addEntry('app', './assets/js/main.js')
    .addStyleEntry('global', './assets/css/global.scss')
    .enableSassLoader()
    .autoProvidejQuery()
    .enableSourceMaps(!Encore.isProduction());

module.exports = Encore.getWebpackConfig();
```

The configuration above uses two assets: `main.js` and `global.scss`. So in the directory `assets` in the project root, let's create two subdirectories: `js` and `css`. Inside these subdirectories, let's create the `main.js` and `global.scss` files. We will populate them further in the tutorial. After that, we will have the following substructure:

* `./assets/js/main.js`
* `./assets/css/global.scss`

Before we can compile our JavaScript and SCSS files to be used in our Symfony templates, we will need to install some dependencies. [`sass-loader`](https://github.com/webpack-contrib/sass-loader) and [`node-sass`](https://github.com/sass/node-sass) are libraries that load SASS/SCSS files and compile them to CSS. Let's install these dependencies by issuing the following codes:

```bash
yarn add sass-loader node-sass --dev
```

Now, we can compile our Javascript and CSS into assets to be used by Symfony by running this command, `yarn run encore dev --watch`.

Open the base twig template (which can be found at `./templates/base.html.twig`) and replace the contents with:

{% highlight html %}
{% raw %}
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <title>{% block title %}Welcome!{% endblock %}</title>
    {% block stylesheets %}
        <link rel="stylesheet" href="{{ asset('build/global.css') }}" />
    {% endblock %}
</head>
<body>
{% block body %}{% endblock %}
{% block javascripts %}
    <script src="{{ asset('build/app.js') }}"></script>
{% endblock %}
</body>
</html>
{% endraw %}
{% endhighlight %}

We've now included both compiled CSS and empty Javascript files into the base template to be used throughout our app!

In order to make use of Bootstrap we need to install jQuery, so run the command:

```bash
yarn add jquery --dev
```

Once installed, at the top of the empty `./assets/js/main.js` file, insert `var $ = require('jquery');`.

We want an app CSS asset file. Let's create the following file `assets/css/main.scss`. Then, in `assets/js/main.js` at the bottom paste the following: `require('../css/main.scss');`.

Let's move the contents of the CSS file we created in part 1 (`public/css/style.css`) into the new file we've created above (`assets/css/main.scss`).

Finally, in our `base.html.twig`, in the Stylesheets block, paste the following: `{% raw %}<link rel="stylesheet" href="{{ asset('build/app.css') }}">{% endraw %}`.

Now we need to install [`bootstrap-sass`](https://github.com/twbs/bootstrap-sass) with the following command: `yarn add bootstrap-sass --dev`. We need to import this into our Sass file. So in `./assets/css/global.scss`, let's insert the following lines:

```css
$brand-primary: darken(#428bca, 20%);
$icon-font-path: "~bootstrap-sass/assets/fonts/bootstrap/";
@import '~bootstrap-sass/assets/stylesheets/bootstrap';
```

Finally in your `main.js` file you need to require bootstrap-sass under your `var $ = require('jquery');` line:

```JavaScript
require('bootstrap-sass');
```

You've now set up Bootstrap to be used in your Symfony Blog.

{% include tweet_quote.html quote_text="Integrating Webpack, Symfony, and Bootstrap is really easy!" %}

### Showing Blog Posts

In `./src/Controller/BlogController.php`, we need to make use the entity manager and the repositories for the entities in order to retrieve database data. At the top of the `BlogController` class, we want to inject these services.

```php
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
    $this->blogPostRepository = $entityManager->getRepository('App:BlogPost');
    $this->authorRepository = $entityManager->getRepository('App:Author');
}
```

As you can see there is a class declared here so we need to add it to the namespaces at the top of the file. Where it says:

```php
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
```

Add: `use Doctrine\ORM\EntityManagerInterface;` above the two.

Great, in our entire controller we can call the `blogPostRepository`, `authorRepository` or `entityManager` when needed. The first two are used for retrieving data from the database, whereas the third will be used for inserting, updating, or deleting data (it can also be used for retrieving, but by setting up the construct this way, we will be reducing duplicate code).

Then replace the action below:

```php
/**
 * @Route("/", name="homepage")
 */
public function indexAction()
{
    return $this->render('blog/index.html.twig', [
        'controller_name' => 'BlogController',
    ]);
}
```

with:

```php
/**
 * @Route("/", name="homepage")
 * @Route("/entries", name="entries")
 */
public function entriesAction()
{
    return $this->render('blog/entries.html.twig', [
        'blogPosts' => $this->blogPostRepository->findAll()
    ]);
}
```

You now need to create a new template for this action, in `./templates/blog` create a new file called `entries.html.twig` and paste the following in:

{% highlight html %}
{% raw %}
{% extends "base.html.twig" %}

{% block title %}App:blog:entries{% endblock %}

{% block body %}

{% endblock %}
{% endraw %}
{% endhighlight %}

### Creating Blog Posts

Now that we have made a member restricted area of the site, let's allow the authenticated users to create a new blog post.

Create a new file called `./src/Form/EntryFormType.php` and paste in the following:

```php
<?php

namespace App\Form;

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
            'data_class' => 'App\Entity\BlogPost'
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

As you can see, the data class to be used is the entity `BlogPost`, and if you compare the fields in `buildForm` you'll notice the first argument of each, the name, matches the names of the properties in BlogPost entity.

A new controller method is needed, so add this function to your `AdminController` class:

```php
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
    if ($form->isSubmitted() && $form->isValid()) {
        $this->entityManager->persist($blogPost);
        $this->entityManager->flush($blogPost);

        $this->addFlash('success', 'Congratulations! Your post is created');

        return $this->redirectToRoute('admin_entries');
    }

    return $this->render('admin/entry_form.html.twig', [
        'form' => $form->createView()
    ]);
}
```

At the top, in the namespaces, we need to add the two new classes we're using: `BlogPost` and `EntryFormType` so paste:

```php
use App\Entity\BlogPost;
use App\Form\EntryFormType;
```

We now need the template, so create a new file called `./templates/admin/entry_form.html.twig` and insert the following code into it:

{% highlight html %}
{% raw %}
{% extends 'base.html.twig' %}

{% block title %}{% endblock %}

{% block body %}
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
{% endraw %}
{% endhighlight %}

Before we try to create a new entry, let's build the page that displays all of the authenticated users blog posts.

### Displaying Blog Posts Created by Authenticated Author

In your `AdminController`, we need to add a route on the controller itself. Because there will be conflicts of routes between the two controllers. So above `class AdminController extends Controller` add:

```php
/**
 * @Route("/admin")
 */
 ```

Also, find:

```php
/**
 * @Route("/admin/author/create", name="author_create")
 */
```

and change the route to:

```php
/**
 * @Route("/author/create", name="author_create")
 */
```

Now let's add a new method called `entriesAction()` and input the code below. All this will do is retrieve all of the blog posts by the authenticated user and pass those into the soon to be created template `entries.html.twig` to be displayed.

```php
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

    return $this->render('admin/entries.html.twig', [
        'blogPosts' => $blogPosts
    ]);
}
```

Time to create the template `./templates/admin/entries.html.twig` to store the following code in:

{% highlight html %}
{% raw %}
{% extends 'base.html.twig' %}

{% block title %}{% endblock %}

{% block body %}
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
{% endraw %}
{% endhighlight %}

As you can see in this template, there is a button to "Add entry" which will direct the user to create a new entry when clicked.

### Creating Delete Functionality for Author's Posts

Our next step is to delete the authenticated users blog posts on demand. So in `AdminController` create a new method with the following code:

```php
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
        $this->addFlash('error', 'Unable to remove entry!');

        return $this->redirectToRoute('admin_entries');
    }

    $this->entityManager->remove($blogPost);
    $this->entityManager->flush();

    $this->addFlash('success', 'Entry was deleted!');

    return $this->redirectToRoute('admin_entries');
}
```

This will check if the entryId passed in exists, check to ensure the authenticated user is the author of the article and then delete it.

There is no template needed for this, however, we still need somewhere in the templates to show the action. So in `./templates/admin/entries.html.twig` let's make some additions.

In the table headers, let's add a new column. This will this element change from:

```html
<thead>
    <th>Title</th>
    <th>Created At</th>
    <th>Updated At</th>
</thead>
```

to:

```html
<thead>
    <th>Title</th>
    <th>Created At</th>
    <th>Updated At</th>
    <th>Action</th>
</thead>
```

And in the for loop, add a new td, which will contain the delete button. We will change it from:

{% highlight html %}
{% raw %}
<td>{{ blogPost.title }}</td>
<td>{{ blogPost.createdAt|date('F j, Y') }}</td>
<td>{{ blogPost.updatedAt|date('F j, Y') }}</td>
{% endraw %}
{% endhighlight %}

to:

{% highlight html %}
{% raw %}
<td>{{ blogPost.title }}</td>
<td>{{ blogPost.createdAt|date('F j, Y') }}</td>
<td>{{ blogPost.updatedAt|date('F j, Y') }}</td>
<td><a class="btn btn-danger" href="{{ path('admin_delete_entry', {'entryId': blogPost.id}) }}">Delete</a></td>
{% endraw %}
{% endhighlight %}

### Add Pagination to Blog Posts List

We don't want to be loading all blog posts into the page, so let's add some pagination.

In the `./src/Controller/BlogController.php` find `entriesAction()` and within the empty brackets type in: `Request $request`

At the top of the controller we need to include this class so where it shows:

```php
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Doctrine\ORM\EntityManagerInterface;
```

Paste the following below those:

```php
use Symfony\Component\HttpFoundation\Request;
```

`Request` allows you to gather data, for example, if there are any parameters in a POST or GET request.

At the top of our BlogController class, let's add a blog post limit constant:

```php
/** @var integer */
const POST_LIMIT = 5;
```

We will want to default the page number to 1, but then make use of the object `$request` to find out if the user is on a different page number. So in the top of your `entriesAction` place the following:

```php
$page = 1;

if ($request->get('page')) {
    $page = $request->get('page');
}
```

This data is useless to us unless `BlogPostRepository` knows what to do with it. When we created the `BlogPost` entity, it also created a repository for us. This repository contains our methods for custom queries or more in-depth queries. So open: `./src/Repository/BlogPostRepository.php`

The first method we're going to need is to get all of the posts based on the page number and the limit previously set in the `BlogController`. The method below does exactly that. It retrieves the paginated number of blog posts.

```php
/**
 * @param int $page
 * @param int $limit
 *
 * @return array
 */
public function getAllPosts($page = 1, $limit = 5)
{
    $entityManager = $this->getEntityManager();
    $queryBuilder = $entityManager->createQueryBuilder();
    $queryBuilder
        ->select('bp')
        ->from('App:BlogPost', 'bp')
        ->orderBy('bp.id', 'DESC')
        ->setFirstResult($limit * ($page - 1))
        ->setMaxResults($limit);

    return $queryBuilder->getQuery()->getResult();
}
```

We're going to need another method in order to get the count of blog posts so that our pagination can know whether you're on the last page or not. So below the previously added method, add another:

```php
/**
 * @return array
 */
public function getPostCount()
{
    $entityManager = $this->getEntityManager();
    $queryBuilder = $entityManager->createQueryBuilder();
    $queryBuilder
        ->select('count(bp)')
        ->from('App:BlogPost', 'bp');

    return $queryBuilder->getQuery()->getSingleScalarResult();
}
```

Back in the `entriesAction` in your `BlogController` we're going to need to make use of those methods.

Your return previously looked like this:

```php
return $this->render('blog/entries.html.twig', [
    'blogPosts' => $this->blogPostRepository->findAll()
]);
```

Let's change it to call those methods and pass the data as well as the page number and post limit into the template:

```php
return $this->render('blog/entries.html.twig', [
    'blogPosts' => $this->blogPostRepository->getAllPosts($page, self::POST_LIMIT),
    'totalBlogPosts' => $this->blogPostRepository->getPostCount(),
    'page' => $page,
    'entryLimit' => self::POST_LIMIT
]);
```
Time to show your blog posts in a template file. Open `./templates/blog/entries.html.twig` then change the title to whatever you wish (I changed it to "Blog Posts"). Inside `{% raw %}{% block body %}{% endraw %}`, paste the following code:

{% highlight html %}
{% raw %}
<div class="container">
    <div class="blog-header">
        <h1 class="blog-title">Blog tutorial</h1>
        <p class="lead blog-description">A basic description of the blog, built in Symfony, styled in Bootstrap 3, secured by <a href="http://auth0.com">Auth0</a>.</p>
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
        </div>
    </div>
</div>
{% endraw %}
{% endhighlight %}

Now reload your browser, you'll see the previously shown blog post, and below that, you'll see disabled "Previous" and "Next" buttons, they're disabled because you're on page 1, and there is only 1 blog post.

> Quick tip, to start your application you can use `php bin/console server:run`

### Adding Navigation

We need to enable users to find their way through the blog. So time to add some navigation. Create a new file in `./templates/nav_bar.html.twig` and paste the following in:

{% highlight html %}
{% raw %}
<nav class="navbar navbar-default navbar-fixed-top">
    <div id="navbar" class="collapse navbar-collapse pull-right">
        <ul class="nav navbar-nav">
            {% if app.request.get('_route') not in ['homepage', 'entries'] %}
                <li><a href="{{ path("homepage") }}">Home</a></li>
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
{% endraw %}
{% endhighlight %}

Then include the file into the `./templates/base.html.twig` just below the `<body>` opening tag:

{% highlight html %}
{% raw %}
{% include 'nav_bar.html.twig' %}
{% endraw %}
{% endhighlight %}

### Showing Specific Blog Post

In the `BlogController` class, create a new action to display the details of a specific blog post. Paste the following code into your controller:

```php
/**
 * @Route("/entry/{slug}", name="entry")
 */
public function entryAction($slug)
{
    $blogPost = $this->blogPostRepository->findOneBySlug($slug);

    if (!$blogPost) {
        $this->addFlash('error', 'Unable to find entry!');

        return $this->redirectToRoute('entries');
    }

    return $this->render('blog/entry.html.twig', array(
        'blogPost' => $blogPost
    ));
}
```

In this action, you may have noticed that it checks if the blog post exists, if it doesn't it will set a "flash" session with an error message and redirect the user to the entries page to display the error.

Now, we need to output this data in the template. So create `./templates/blog/entry.html.twig` and paste the following content:

{% highlight html %}
{% raw %}
{% extends "base.html.twig" %}

{% block title %}App:blog:entry{% endblock %}

{% block body %}
<div class="container">
 <div class="blog-header">
     <h1 class="blog-title">Blog tutorial</h1>
     <p class="lead blog-description">A basic description of the blog, built in Symfony, styled in Bootstrap 3, secured by Auth0.</p>
 </div>

 <div class="row">
     <div class="col-sm-8 blog-main">
         <div class="blog-post">
             <h2 class="blog-post-title">{{ blogPost.title }}</h2>
             <p class="blog-post-meta">
                {{ blogPost.updatedAt|date('F j, Y') }} by <a href="{{ path('author', {'name': blogPost.author.username|url_encode }) }}">
                    {{ blogPost.author.name }}
                </a>
            </p>
             <h3>Description:</h3>
             <p>{{ blogPost.description|raw }}</p>

             <h3>Body:</h3>
             <p>{{ blogPost.body|raw }}</p>
         </div>
     </div>
 </div>
</div>
{% endblock %}
{% endraw %}
{% endhighlight %}

The above code simply outputs the details of the blog post, its title, when it was updated at, the author, description, and the body.

Our next problem is how to access this new page we've created. Back in your `./templates/blog/entries.html.twig` template, find `{% raw %}{{ firstParagraph|raw }}<br />{% endraw %}` and paste below:

{% highlight html %}{% raw %}<a href="{{ path('entry', {'slug': blogPost.slug}) }}">Read more</a>{% endraw %}{% endhighlight %}

Then you need to find `{% raw %}{{ blogPost.title }}{% endraw %}` and wrap this in `<a>` tags so it will look like:

{% highlight html %}
{% raw %}
<a href="{{ path('entry', {'slug': blogPost.slug}) }}">
    {{ blogPost.title }}
</a>
{% endraw %}
{% endhighlight %}

### Showing Author Details

Want to see more details about the author of the post? Let's create an `authorAction` in your `BlogController`. We're going to be doing something very similar to retrieving the single entry.
We'll be getting the name passed in via the URL, finding the author by name in the database. And then passing that data into the author template, as shown below:

```php
/**
 * @Route("/author/{name}", name="author")
 */
public function authorAction($name)
{
    $author = $this->authorRepository->findOneByUsername($name);

    if (!$author) {
        $this->addFlash('error', 'Unable to find author!');
        return $this->redirectToRoute('entries');
    }

    return $this->render('blog/author.html.twig', [
        'author' => $author
    ]);
}
```

Create the template `./templates/blog/author.html.twig`, we won't be doing anything special, just outputting the data the Author has:

{% highlight html %}
{% raw %}
{% extends "base.html.twig" %}

{% block title %}App:blog:author{% endblock %}

{% block body %}
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
{% endblock %}
{% endraw %}
{% endhighlight %}

We now need to have that author page linkable for people to access it. In: `./templates/blog/entries.html.twig` you will find:

{% highlight html %}
{% raw %}
{% if blogPost.author %}
    {{ blogPost.author.name }}
{% else %}
{% endraw %}
{% endhighlight %}

Let's make this a link as shown below:

{% highlight html %}
{% raw %}
{% if blogPost.author %}
    <a href="{{ path('author', {'name': blogPost.author.username|url_encode }) }}">
        {{ blogPost.author.name }}
    </a>
{% else %}
{% endraw %}
{% endhighlight %}

Now refresh your browser. You'll see the title has changed to a link, and there is now a "Read more" at the bottom of your article. Click one of those and you'll see your new page!
You will also see the author names have a link now.

{% include tweet_quote.html quote_text="Urray! I've just finished creating my own blog engine with Symfony and PHP!" %}

## Conclusion

Congratulations, you have just built yourself a functional blog engine from scratch with Symfony. This blog engine even enables visitors to sign up to become authors. This allows them to also contribute to your blog by posting articles of their own! Although this is just the basics of a blog, it is a strong stepping stone to making it as custom and feature filled as you wish.
