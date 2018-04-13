---
layout: post
title: "Symfony Tutorial: Building a Blog (Part 1)"
description: "Let's create a secure blog engine with Symfony."
longdescription: "Creating applications with Symfony is easy and can be scaled to be used in any requirement. The tools that it provides to create and maintain web applications is amazing and replaces repetitive tasks. Let's use Symfony to create a blog engine."
date: 2017-12-28 08:30
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
- authentication
- auth0
- php
related:
- 2018-01-04-creating-symfony-blog-part-2
- 2017-07-26-creating-your-first-symfony-app-and-adding-authentication
- 2016-06-23-creating-your-first-laravel-app-and-adding-authentication
---

**TL;DR:** Symfony is a PHP framework as well as a set of reusable PHP components and libraries. It uses the Model-View-Controller design pattern and can be scaled to be used in any requirement. It aims to speed up the creation and maintenance of web applications, replacing repetitive code. In this tutorial, I'll show you how to create your very own blog, with content stored in the database and authentication through Auth0. The finished code can be found at this [GitHub repository](https://github.com/auth0-blog/symfony-blog-part-1).

---

## Symfony Tutorial: Introduction

### What is Symfony?

[Symfony](https://symfony.com) is an Open Source PHP framework originally created by [Sensiolabs](https://sensiolabs.com/), an interactive agency. The [Symfony PHP framework](https://symfony.com) comes with a very large and active community. This framework has become very popular, mainly due to the vast number of reusable PHP components. These components are not limited to the framework itself but can be found throughout the PHP community, such as Drupal, WordPress, phpBB, and Laravel.

[Symfony Components](https://symfony.com/components) is a set of decoupled and reusable PHP libraries. They are becoming the standard foundation on which the best PHP applications are built on. You can use any of these components in your own applications independently from the Symfony Framework. Below you will find a list of some of the components that are used in this article as an example.

* [Asset](https://symfony.com/components/Asset) - Manages URL generation and versioning of web assets such as CSS stylesheets, JavaScript files and image files.
* [Config](https://symfony.com/components/Config) - Helps you find, load, combine, autofill and validate configuration values.
* [Console](https://symfony.com/components/Console) - Eases the creation of beautiful and testable command line interfaces.
* [Dotenv](https://symfony.com/components/Dotenv) - Parses `.env` files to make environment variables stored in them accessible via `getenv()`, `$_ENV` or `$_SERVER`.
* [Form](https://symfony.com/components/Form) - Provides tools to easy creating, processing and reusing HTML forms.
* [HttpKernel](https://symfony.com/components/HttpKernel) - Provides the building blocks to create flexible and fast HTTP-based frameworks.
* [Routing](https://symfony.com/components/Routing) - Maps an HTTP request to a set of configuration variables.
* [Security](https://symfony.com/components/Security) - Provides an infrastructure for sophisticated authorization systems.
* [Templating](https://symfony.com/components/Templating) - Provides all the tools needed to build any kind of template system.
* [Yaml](https://symfony.com/components/Yaml) - Loads and dumps YAML files.

### What Will We Build

In this article, we will be looking at how to install a new version of the Symfony PHP framework, along with making use of Doctrine to create two new database tables (`Author` and `BlogPosts`) in order to store our blog data in. Following this, we will be making use of Doctrine Migrations to pre-populate our newly created database tables with some dummy data to allow you to see the blog at work. Once the initial set up is complete, we will cover user authentication with Auth0 allowing users to create their own author entry in the database.

## Bootstrapping Symfony

### Installing Symfony

Install Symfony via [Composer](https://getcomposer.org/) with the following command:

```bash
composer create-project symfony/skeleton:4.0.5 blog
```

Once Composer has finished downloading all the required third-party libraries change directory into your project with: `cd blog`

### Install Doctrine bundle & various libraries

In order to communicate with the database and make use of other features, you need to install several third-party libraries. So run the following commands:

```bash
composer require symfony/orm-pack
composer require annotations
composer require validator
composer require template
composer require security-bundle
composer require --dev maker-bundle
```

### Update DotEnv File

In your root directory, there is a file called `.env`, you should see something similar to the following:

```yml
###> doctrine/doctrine-bundle ###
DATABASE_URL=mysql://{DATABASE_USER}:{DATABASE_PASSWORD}@{DATABASE_HOST}:{DATABASE_PORT}/{DATABASE_NAME}
###< doctrine/doctrine-bundle ###
```

Then you have to replace any of the values with the correct settings for your MySQL database. For example, `{DATABASE_HOST}` could be replaced by `127.0.0.1`. Don't have MySQL installed? [An easy way to bootstrap one is with this script, it just needs Docker installed on the host machine](https://gist.github.com/brunokrebs/af77f582f0e650a62a6f06e84cd06f91).

__NOTE__: The default database port is 3306, so if you haven't configured your MySQL database port, change the above `{DATABASE_PORT}` to `3306`.

If needed, run the following command `php bin/console doctrine:database:create`, which will create a database with the value of your database name.

### Create the Blog Controller

Create new `BlogController` by running the following command `php bin/console make:controller`

When it asks for `The class name of the controller to create`, type in: `BlogController`.

Once the command has finished running, you'll find a new file in `src/Controller` called `BlogController.php`, there should be an action similar to the following:

```php
/**
 * @Route("/blog", name="blog")
 */
public function index()
{
    return $this->render('blog/index.html.twig', [
        'controller_name' => 'BlogController',
    ]);
}
```

Replace the above with:

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

In order to see your blog in your web browser for the duration of this tutorial, you need to have Symfony's web server installed in your application. To do this run the following command:

```bash
composer require server --dev
```

Now that the basic configuration has been set up, let's run the following command:

```bash
php bin/console server:run
```

You will see something similar to: `[OK] Server listening on http://127.0.0.1:8000`. So paste this URL into your browser, you'll be shown a `Hello BlogController!` page.

### Creating a New Author Entity

Create new `Author` entity by running the following command:

```bash
php bin/console make:entity
```

When it asks for `The class name of the entity to create`, type in: `Author`.

Once the command has finished running, you'll find a new file in `src/Entity` called `Author.php`. Open this and configure it like so:

```php
<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Author
 *
 * @ORM\Table(name="author")
 * @ORM\Entity(repositoryClass="App\Repository\AuthorRepository")
 */
class Author
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255, unique=true)
     */
    private $name;

    /**
     * @var string
     *
     * @ORM\Column(name="title", type="string", length=255)
     */
    private $title;

    /**
     * @var string
     *
     * @ORM\Column(name="username", type="string", length=255, unique=true)
     */
    private $username;

    /**
     * @var string
     *
     * @ORM\Column(name="company", type="string", length=255)
     */
    private $company;

    /**
     * @var string
     *
     * @ORM\Column(name="short_bio", type="string", length=500)
     */
    private $shortBio;

    /**
     * @var string
     *
     * @ORM\Column(name="phone", type="string", length=255, nullable=true)
     */
    private $phone;

    /**
     * @var string
     *
     * @ORM\Column(name="facebook", type="string", length=255, nullable=true)
     */
    private $facebook;

    /**
     * @var string
     *
     * @ORM\Column(name="twitter", type="string", length=255, nullable=true)
     */
    private $twitter;

    /**
     * @var string
     *
     * @ORM\Column(name="github", type="string", length=255, nullable=true)
     */
    private $github;


    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set name
     *
     * @param string $name
     *
     * @return Author
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set title
     *
     * @param string $title
     *
     * @return Author
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * Get title
     *
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set username
     *
     * @param string $username
     *
     * @return Author
     */
    public function setUsername($username)
    {
        $this->username = $username;

        return $this;
    }

    /**
     * Get username
     *
     * @return string
     */
    public function getUsername()
    {
        return $this->username;
    }

    /**
     * Set company
     *
     * @param string $company
     *
     * @return Author
     */
    public function setCompany($company)
    {
        $this->company = $company;

        return $this;
    }

    /**
     * Get company
     *
     * @return string
     */
    public function getCompany()
    {
        return $this->company;
    }

    /**
     * Set shortBio
     *
     * @param string $shortBio
     *
     * @return Author
     */
    public function setShortBio($shortBio)
    {
        $this->shortBio = $shortBio;

        return $this;
    }

    /**
     * Get shortBio
     *
     * @return string
     */
    public function getShortBio()
    {
        return $this->shortBio;
    }

    /**
     * Set phone
     *
     * @param string $phone
     *
     * @return Author
     */
    public function setPhone($phone)
    {
        $this->phone = $phone;

        return $this;
    }

    /**
     * Get phone
     *
     * @return string
     */
    public function getPhone()
    {
        return $this->phone;
    }

    /**
     * Set facebook
     *
     * @param string $facebook
     *
     * @return Author
     */
    public function setFacebook($facebook)
    {
        $this->facebook = $facebook;

        return $this;
    }

    /**
     * Get facebook
     *
     * @return string
     */
    public function getFacebook()
    {
        return $this->facebook;
    }

    /**
     * Set twitter
     *
     * @param string $twitter
     *
     * @return Author
     */
    public function setTwitter($twitter)
    {
        $this->twitter = $twitter;

        return $this;
    }

    /**
     * Get twitter
     *
     * @return string
     */
    public function getTwitter()
    {
        return $this->twitter;
    }

    /**
     * Set github
     *
     * @param string $github
     *
     * @return Author
     */
    public function setGithub($github)
    {
        $this->github = $github;

        return $this;
    }

    /**
     * Get github
     *
     * @return string
     */
    public function getGithub()
    {
        return $this->github;
    }
}
```

{% include tweet_quote.html quote_text="Doctrine is a great tool to have around when developing with PHP and Symfony." %}

### Creating a New BlogPost Entity

Create new `BlogPost` entity by running the following command `php bin/console make:entity`

When it asks for `The class name of the entity to create`, type in: `BlogPost`.

Once the command has finished running, you'll find a new file in `src/Entity` called `BlogPost.php`. Open this and configure it like so:

```php
<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * BlogPost
 *
 * @ORM\Table(name="blog_post")
 * @ORM\Entity(repositoryClass="App\Repository\BlogPostRepository")
 * @ORM\HasLifecycleCallbacks
 */
class BlogPost
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="title", type="string", length=255)
     */
    private $title;

    /**
     * @var string
     *
     * @ORM\Column(name="slug", type="string", length=255, unique=true)
     */
    private $slug;

    /**
     * @var string
     *
     * @ORM\Column(name="description", type="string", length=2000)
     */
    private $description;

    /**
     * @var string
     *
     * @ORM\Column(name="body", type="text")
     */
    private $body;

    /**
     * @var Author
     *
     * @ORM\ManyToOne(targetEntity="Author")
     * @ORM\JoinColumn(name="author_id", referencedColumnName="id")
     */
    private $author;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="created_at", type="datetimetz")
     */
    private $createdAt;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="updated_at", type="datetime")
     */
    private $updatedAt;


    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set title
     *
     * @param string $title
     *
     * @return BlogPost
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * Get title
     *
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set slug
     *
     * @param string $slug
     *
     * @return BlogPost
     */
    public function setSlug($slug)
    {
        $this->slug = $slug;

        return $this;
    }

    /**
     * Get slug
     *
     * @return string
     */
    public function getSlug()
    {
        return $this->slug;
    }

    /**
     * Set description
     *
     * @param string $description
     *
     * @return BlogPost
     */
    public function setDescription($description)
    {
        $this->description = $description;

        return $this;
    }

    /**
     * Get description
     *
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set body
     *
     * @param string $body
     *
     * @return BlogPost
     */
    public function setBody($body)
    {
        $this->body = $body;

        return $this;
    }

    /**
     * Get body
     *
     * @return string
     */
    public function getBody()
    {
        return $this->body;
    }

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

    /**
     * Set createdAt
     *
     * @param \DateTime $createdAt
     *
     * @return BlogPost
     */
    public function setCreatedAt($createdAt)
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * Get createdAt
     *
     * @return \DateTime
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    /**
     * Set updatedAt
     *
     * @param \DateTime $updatedAt
     *
     * @return BlogPost
     */
    public function setUpdatedAt($updatedAt)
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    /**
     * Get updatedAt
     *
     * @return \DateTime
     */
    public function getUpdatedAt()
    {
        return $this->updatedAt;
    }

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
}
```

You may have noticed a `private $author;` property that links to the previous Entity we created. All this does is make sure the entity knows that `Author` has a [`ManyToOne` relationship](https://www.ibm.com/support/knowledgecenter/en/SSWU4L/Data/imc_Data/What_is_a_many-to-one_relationship.html) with `BlogPost`.

Although you have created these entities, your database still has no tables in there. Based off these entities, Doctrine can create the tables we've specified. In order to do this, all you have to do is run:

```bash
php bin/console doctrine:schema:update --force
```

### Install Doctrine-Fixtures

We want to just populate some data into the newly created tables as examples during the creation of the blog. So install [doctrine-fixtures](https://symfony.com/doc/master/bundles/DoctrineFixturesBundle/index.html).

```bash
composer require --dev doctrine/doctrine-fixtures-bundle
```

### Create Author and BlogPost Fixtures

Create a new file (and the directories the file is stored in) under `src/DataFixtures/ORM/Fixtures.php` and insert the following into the file:

```php
<?php

namespace App\DataFixtures\ORM;

use App\Entity\Author;
use App\Entity\BlogPost;
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

This is basically just a file that, when loaded, will create an author and a blog post, and will link the author to the blog post.

### Running Fixtures

Let's run the fixtures! `php bin/console doctrine:fixtures:load`

Now we have our entities, database, database tables, and some dummy data in the tables.

## Managing Identity with Symfony and Auth0

### Installing HWIOAuth Bundle

To make Symfony integrate with Auth0, we are going to use  [HWIOAuth Bundle](https://github.com/hwi/HWIOAuthBundle), an OAuth client that supports OAuth2.

First, we will set up all the configurations needed for this bundle.

So to begin we need to add the routes to your routing file: `config/routes.yaml`:

```yml
# ...
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

In order to get the `HWIOAuthBundle` to connect to Auth0, we need to create an Auth0 resource owner. Create a new file `src/Auth0ResourceOwner.php`:

```php
<?php

namespace App;

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
        $resolver->setNormalizer('audience', $normalizer);
    }
}
```

We're going to need API keys for Auth0, so <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">create your free account</a>. Once signed up:

- In the dashboard, click `Applications` on the left:
  * Create Application
  * Add a name
  * Choose _Regular Web Applications_ type
- Configure callback URL:
  * In the new Auth0 `Application`, go to the settings tab.
  * Find the text box labeled `Allowed Callback URLs`.
  * Paste the following in: `http://127.0.0.1:8000/auth0/callback`.
- Configure Auth0 Application to require usernames:
  * In the navigation bar find and click `Connections`
  * Then click `Database`
  * Click on `Username-Password-Authentication`
  * Toggle `Requires Username` to on.
- Go to the [Applications](https://manage.auth0.com/#/applications) section again and pick your `Application`.

Then in your `.env` file paste the following, but replace the brackets and their contents with the details found in your application:

```
AUTH0_CLIENT_ID=(Client ID on Auth0)
AUTH0_CLIENT_SECRET=(Client Secret on Auth0)
AUTH0_DOMAIN=(Domain on Auth0)
```

To use all of this, we need to create a new file in `config/packages` called `hwi_oauth.yaml` then populate this file with:

```
hwi_oauth:
    firewall_names: [secured_area]
    resource_owners:
        auth0:
            type:                oauth2
            class:               'App\Auth0ResourceOwner'
            client_id:           "%env(AUTH0_CLIENT_ID)%"
            client_secret:       "%env(AUTH0_CLIENT_SECRET)%"
            base_url:            "https://%env(AUTH0_DOMAIN)%"
            scope: "openid profile"
```

Finally, replace the contents of your `config/packages/security.yaml` file with:

```
security:
    providers:
        hwi:
            id: hwi_oauth.user.provider

    firewalls:
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
    access_control:
        - { path: ^/login, roles: IS_AUTHENTICATED_ANONYMOUSLY }
        - { path: ^/secured, roles: ROLE_OAUTH_USER }
```

The config above is setting up URLs/sections in your blog that require the user to be authenticated.

In order to install HWIOAuth Bundle, which uses a virtual package `php-http/client-implementation`, we need to install several third-party libraries. However, this can be easily done with this command:

```bash
composer require hwi/oauth-bundle php-http/guzzle6-adapter php-http/httplug-bundle
```

__NOTE__: You may have an issue if your version of PHP is too high. If you encounter an error similar to `overridden by "config.platform.php" version (5.5.9) does not satisfy that requirement`, remove the PHP requirement in config in `composer.json` so find and remove:

```
"platform": {
    "php": "5.5.9"
},
```

Now run `composer update`.

### Create the Author Page

The first thing we will want to do is create a new form. This is a class that allows us to validate the user's input, such as creating an author. So, in the `src/` path, create a new directory called `Form`.
Within that directory create a new file named `AuthorFormType.php`. Add the code below to your new file:

```php
<?php

namespace App\Form;

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
            'data_class' => 'App\Entity\Author'
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

Create new `AdminController` by running the following command `php bin/console make:controller`

When it asks for `The class name of the controller to create`, type in: `AdminController`.

Once the command has finished running, you'll find a new file in `src/Controller` called `AdminController.php`.

Open your new AdminController (`src/Controller/AdminController.php`), we need to make use the entity manager and the repositories for the entities in order to retrieve database data. At the top of this class, inject these services in the construct:

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

As you can see, there is a class declared here so we need to add it to the namespaces at the top of the file. Where it says:

```php
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
```

Add the following four below them:

```php
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Author;
use App\Form\AuthorFormType;
```

Great, in the entire controller we can call `blogPostRepository`, `authorRepository` or `entityManager` when needed. The first two are used for retrieving data from the database, whereas the third will be used for inserting, updating, or deleting data.

The three extra `use` classes on that list are:

* the `Request` class, this allows you to gather data, for example, if there are any parameters in a POST or GET request,
* the `Author` entity that maps objects to the database,
* the `AuthorFormType` that will specify the input values users can provide when creating a new Author;

In the same class, you should find a method called `index()` similar to the example below:

```php
/**
 * @Route("/admin", name="admin")
 */
public function index()
{
    return $this->render('admin/index.html.twig', [
        'controller_name' => 'AdminController',
    ]);
}
```

Replace the above method with the one shown below:

```php
/**
 * @Route("/admin/author/create", name="author_create")
 */
public function createAuthorAction(Request $request)
{
    if ($this->authorRepository->findOneByUsername($this->getUser()->getUserName())) {
        // Redirect to dashboard.
        $this->addFlash('error', 'Unable to create author, author already exists!');

        return $this->redirectToRoute('homepage');
    }

    $author = new Author();
    $author->setUsername($this->getUser()->getUserName());

    $form = $this->createForm(AuthorFormType::class, $author);
    $form->handleRequest($request);

    if ($form->isSubmitted() && $form->isValid()) {
        $this->entityManager->persist($author);
        $this->entityManager->flush($author);

        $request->getSession()->set('user_is_author', true);
        $this->addFlash('success', 'Congratulations! You are now an author.');

        return $this->redirectToRoute('homepage');
    }

    return $this->render('admin/create_author.html.twig', [
        'form' => $form->createView()
    ]);
}
```

The above code checks whether an author already exists for this user, whether the form has been submitted and whether it passes all validations, if it does it will then redirect the user to the index page.

__NOTE__: You may have noticed that it sets a session to `true` for `user_is_author` this will make sense when we reach the part that discusses and implements event listeners (next).

Finally, we want to pass the form into a template that the user will see. So, lets create a new template in `templates/admin/` called `create_author.html.twig`. In this template, paste the following:

{% highlight html %}
{% raw %}
{% extends 'base.html.twig' %}

{% block title %}{% endblock %}

{% block body %}
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
{% endraw %}
{% endhighlight %}

You can clear the cache in your Symfony application to see if everything is ok and there are no errors. Note that there is nothing to see yet, we just want to guarantee that the configuration is correct.

```bash
php bin/console cache:clear
```

### Including Bootstrap and Styles

As it is, this template will look very ugly in your browser. So let's create a new CSS file. `public/css/style.css`

Copy the contents of the file [found here](https://github.com/GregHolmes/symfony-blog-part-1/blob/master/public/css/style.css) into your new `style.css` file.

Now, it's time to include this file into the base template alongside with Bootstrap's CSS and Javascript files.

Open `templates/base.html.twig` and replace its contents with:

{% highlight html %}
{% raw %}
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <title>{% block title %}Welcome!{% endblock %}</title>
    {% block stylesheets %}{% endblock %}
    <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}" />
    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">

    <!-- jQuery library -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

    <!-- Latest compiled JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>

    <!-- Custom CSS File -->
    <script src="css/style.css"></script>
</head>
<body>
{% block body %}{% endblock %}
{% block javascripts %}{% endblock %}
</body>
</html>
{% endraw %}
{% endhighlight %}

This just includes your custom CSS file as well as Bootstrap's CSS and Javascript files into your page.

### Asking for "About Me" Information

Although a user is authenticated through Auth0, we don't really want them to access the rest of the author section until they've filled some basic "About me" details. So, what we want is to ensure that any `/author/` route they try to access, if they don't have an "Author" entry, redirects them to the form to write about themselves.

An event listener is, as the name states, a listener to specific programmed events which then run the predefined code once the conditions are met.

Let's create the `CheckIsAuthorListener.php` file in the `src/EventListener/Author` directory. In this file, let's place the following code:

```php
<?php

namespace App\EventListener\Author;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\HttpKernel\Event\FilterControllerEvent;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class CheckIsAuthorListener
{
    /** @var RouterInterface */
    protected $router;

    /** @var SessionInterface */
    protected $session;

    /** @var TokenStorageInterface */
    private $tokenStorage;

    /** @var EntityManagerInterface */
    private $entityManager;

    /**
     * @param RouterInterface $router
     * @param SessionInterface $session
     * @param TokenStorageInterface $tokenStorage
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(
        RouterInterface $router,
        SessionInterface $session,
        TokenStorageInterface $tokenStorage,
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

        $route = $this->router->generate('author_create');

        // Check we are not already attempting to create an author!
        if (0 === strpos($event->getRequest()->getPathInfo(), $route)) {
            return;
        }

        // Check if authenticated user has an author associated with them.
        if ($author = $this->entityManager
            ->getRepository('App:Author')
            ->findOneByUsername($user->getUsername())
        ) {
            $this->session->set('user_is_author', true);
        }

        if (!$author && $this->session->get('pending_user_is_author')) {
            $this->session->getFlashBag()->add(
                'warning',
                'Your author access is being set up, this may take up to 30 seconds. Please try again shortly.'
            );

            $route = $this->router->generate('homepage');
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

We now need to add this class as a service so that Symfony runs it on each controller request. In `config/services.yaml` add the following as the last item of `services`:

```yml
App\EventListener\Author\CheckIsAuthorListener:
    tags:
        - { name: kernel.event_listener, event: kernel.controller }
```

It's great setting up HWIOAuth Bundle and configuring Auth0 to allow users to log in, but we don't yet have anywhere in the Symfony installation to actually log in. So, for the time being, we're going to change the homepage action in the Blog Controller.

Open your `./templates/blog/index.html.twig` template defined in your BlogController indexAction and replace the contents with the following in:

{% highlight html %}
{% raw %}
{% extends 'base.html.twig' %}

{% block body %}
    <nav class="navbar navbar-default navbar-static-top">
        <div id="navbar" class="collapse navbar-collapse pull-right">
            <ul class="nav navbar-nav">
                {% if app.user %}
                    <li><a href="{{ path("author_create") }}">Admin</a></li>
                    <li><a href="{{ logout_url("secured_area") }}">Logout</a></li>
                {% else %}
                    <li class="active"><a href="/connect/auth0">Login</a></li>
                {% endif %}
            </ul>
        </div>
    </nav>
{% endblock %}
{% endraw %}
{% endhighlight %}

As you can see, now we provide a link so that unauthenticated users can log in. If they are logged in, two links are shown: one to log out and one to access the admin section.

{% include tweet_quote.html quote_text="Using Symfony and OAuth together is quite easy." %}

## Next Steps

In the next article, we will be covering installing Bootstrap, a framework, to make the blog nicer visually. We will also enhance our blog engine to allow visitors to:

* see a list of blog posts;
* read a specific blog post;
* and find out more about the author.

Authenticated authors will be able to:

* create a new blog post;
* see all of their own blog posts;
* delete their own blog posts from the system.
