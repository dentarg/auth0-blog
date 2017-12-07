---
layout: post
title: "Building a Symfony blog Part 2"
description: Learn how to create a blog in Symfony and authenticate.
date: 2017-12-06 16:20
category: Technical Guide, PHP, Symfony
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
- 2017-07-26-creating-your-first-symfony-app-and-adding-authentication
---

**TL;DR:** Symfony is a PHP framework as well as a set of reusable PHP components and libraries. It uses the Model-View-Controller design pattern, and can be scaled to be used in any requirement.  It aims to speed up the creation and maintenance of web applications, replacing repetitive code. In this tutorial, I'll show you how to create your very own blog, with the content stored in the database and authentication through Auth0. The finished code can be found at this [repository](https://github.com/GregHolmes/symfony-blog).

---

## About Part 1
## Building the Blog Engine
### Installing Bootstrap

In order to install Bootstrap we need Symfony's Webpack Encore, which is a simpler way to integrate Webpack into your application. You can install this by running the following command:

`yarn add @symfony/webpack-encore --dev`

You will see in your root directory of your project, 2 new files (`package.json`, `yarn.lock`) and a new directory (`node_modules`), if committing this to version control, you should add node_modules directory to .gitignore.

Create `webpack.config.js` in the root of the project, this is just the file that contains all of your web pack configurations.

Paste the following code into this file:

{% highlight javascript %}
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
{% endhighlight %}

Lets create a SCSS and Javascript file in our assets directory to be used in the configuration above, they can be left empty for now. We will populate them further in the tutorial.

* `assets/js/main.js`
* `assets/css/global.scss`

Running this command, `yarn run encore dev --watch`, will allow you to compile your javascript and CSS into assets to be used in your Symfony templates.

**NOTE** You may need extra packages installed, Encore will tell you these when you run the command above. Please do as Encore suggests to proceed. It will likely be to run this command: `yarn add sass-loader node-sass --dev`

**NOTE** When you put your code in production please run this command: `yarn run encore production`, It will not only compile the assets but also minify and optimize them.

Open your base twig template which can be found: `app/Resources/views/base.html.twig`

Find the following line (It should be line 6): `{% raw %}{% block stylesheets %}{% endblock %}{% endraw %}`. Within this block we need to include the global.css file. So it will look like:

{% highlight html %}
{% raw %}
{% block stylesheets %}
    <link rel="stylesheet" href="{{ asset('build/global.css') }}" />
{% endblock %}
{% endraw %}
{% endhighlight %}

Then in the same file find `{% raw %}{% block javascripts %}{% endblock %}{% endraw %}` and place the `app.js` include in between. So it will look like:

{% highlight html %}
{% raw %}
{% block javascripts %}
    <script src="{{ asset('build/app.js') }}"></script>
{% endblock %}
{% endraw %}
{% endhighlight %}

We've now included both our empty compiled CSS and Javascript files into our base template to be used throughout our app!

**NOTE** If you are running `yarn run encore dev --watch` (Which is advisable for the duration of this tutorial), you will need to open a second Terminal to run the other commands required.

In order to make use of Bootstrap we need to install jQuery, so in your second Terminal run: `yarn add jquery --dev`

Once installed at the top of your empty `assets/js/main.js` file, insert `var $ = require('jquery');`.

We want an app css assets file so, lets create the following file `assets/css/main.scss`
And in `assets/js/main.js` at the bottom paste the following: `require('../css/main.scss');`

Finally, in your `base.html.twig` In the Stylesheets block, paste the following: `{% raw %}<link rel="stylesheet" href="{{ asset('build/app.css') }}">{% endraw %}`

Now we need to install bootstrap-sass with the following command: `yarn add bootstrap-sass --dev`
We need to import this into our Sass file. So in `assets/css/global.scss` lets put in the following lines:

{% highlight javascript %}
// customize some Bootstrap variables
$brand-primary: darken(#428bca, 20%);

// the ~ allows you to reference things in node_modules
@import '~bootstrap-sass/assets/stylesheets/bootstrap';
{% endhighlight %}

There is a possibility your Webpack builds can reduce in speed. So a solution to this is to use the `resolveUrlLoader` by placing the following code into your `webpack.config.js`

{% highlight javascript %}
 .enableSassLoader(function(sassOptions) {}, {
     resolveUrlLoader: false
 })
{% endhighlight %}

We're going to want to override the path to icons by loading Bootstrap in your `global.scss` file:

{% highlight php %}
    $icon-font-path: "~bootstrap-sass/assets/fonts/bootstrap/";
{% endhighlight %}

Finally in your `main.js` file you need to require bootstrap-sass under your `var $ = require('jquery');` line

{% highlight javascript %}
// JS is equivalent to the normal "bootstrap" package
// no need to set this to a variable, just require it
require('bootstrap-sass');
{% endhighlight %}

You've now set up Bootstrap to be used in your Symfony Blog.

### Showing blog posts

Lets create our blog controller by running the following command: `php bin/console generate:controller`

If you follow the instructions as shown by the input, you'll find that you have a new Controller class in `src/AppBundle/Controllers` called BlogController, you'll also have 3 new templates in `src/AppBundle/Resources/views/`

<screenshot of new controller>

Lets delete the DefaultController as it's not needed, so delete the file `src/AppBundle/Controllers/DefaultController.php`

Open `src/AppBundle/Controllers/BlogController.php` and find the `entriesAction`

Configure the routing for this controller to be the index and give the action a service name. So above `public function entriesAction()` replace the annotation with:

{% highlight php %}
/**
 * @Route("/", name="index")
 * @Route("/entries", name="entries")
 */
{% endhighlight %}

This allows us to call the action by the service name, but also places the root route as displaying the entries.

We need to make use the entity manager and the repositories for the entities in order to retrieve database data. At the top of the BlogController class we want to inject these services.

{% highlight php %}
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
{% endhighlight %}

As you can see there is a class declared here so we need to add it to the namespaces at the top of the file. Where it says:

{% highlight php %}
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
{% endhighlight %}

Add: `use Doctrine\ORM\EntityManagerInterface;` above the two.

Great, in our entire controller we can call the blogPostRepository, authorRepository or entityManager as and when needed. The first 2 are used for retrieving data from the database, where as the third will be used for inserting, updating, or deleting data (It can also be used for retrieving but by setting up the construct this way, we will be reducing duplicate code)

Let us populate the entriesAction now:

{% highlight php %}
return $this->render('AppBundle:Blog:entries.html.twig', [
    'blogPosts' => $this->blogPostRepository->findAll()
]);
{% endhighlight %}

### Creating a blog post
### Displaying blog posts created by authenticated author
### Creating delete functionality for author's posts
### Add pagination to blog posts list.
### Showing specific blog post
### Showing author details

## Conclusion
