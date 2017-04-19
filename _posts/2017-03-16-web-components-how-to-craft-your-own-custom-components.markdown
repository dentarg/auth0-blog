---
layout: post
title: "Web Components: How To Craft Your Own Custom Components"
description: "Learn how to make web components and leverage them in your applications today."
date: 2017-03-16 8:30
category: Technical Guide, Frontend, Web Components
author:
  name: "Prosper Otemuyiwa"
  url: "https://twitter.com/unicodeveloper"
  mail: "prosper.otemuyiwa@gmail.com"
  avatar: "https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200"
design:
  bg_color: "#7A5EAC"
  image: https://cdn.auth0.com/blog/webcomponents/webcomponentslogo.png
tags:
- polymer
- web-components
- javascript
related:
- 2016-10-05-build-your-first-app-with-polymer-and-web-components
- 2017-01-19-building-and-securing-a-koa-and-angular2-app-with-jwt
---

---

**TL;DR** The introduction of *Web Components* have given developers super powers. With *Web Components*, web designers and developers are no longer limited to the existing HTML tags that existing browser vendors provide. Developers now have the ability to create new custom HTML tags, enhance existing HTML tags or extend components that developers around the world have created. In this article, I'll show you how to use and create custom web components for your apps.

---

Web components allow for reusability and the ability to associate JS behaviour with your markup. Developers can search for existing components created by other developers on the [web components registry](https://www.webcomponents.org). In the absence of suitable existing custom elements, developers can create theirs and make it available for others by publishing it to the registry. 

## What are Web Components?

Web components are a set of web platform APIs that allow you to create new custom, reusable, encapsulated HTML tags to use in web pages and web apps. They are reusable widgets that are built on the Web Component standards. Web Components work across modern browsers and can be used with any JavaScript library or framework that utilizes HTML.

There are some sets of rules and specifications that you need to follow to develop web components. These specifications are classified into four categories:

* Custom Elements
* Shadow DOM
* HTML Imports
* HTML Template

We'll talk about these specifications in the latter part of this post. But let's quickly learn how to use web components.

## How to use Web Components

The first step is to browse the [element registry](https://www.webcomponents.org). Check for the components that you are interested in, then go through the README to know how to import it and use in your web applications.

The web component registry has two main sections: 

* [elements](https://www.webcomponents.org/elements): These are custom elements in the registry.
* [collections](https://www.webcomponents.org/collections): These are sets of custom elements. An example is the [awesome-chart-elements collection](https://www.webcomponents.org/collection/StartPolymer/awesome-chart-elements) that contains eight awesome elements for working with charts in a web app.

An example web component you can install is [juicy-ace-editor](https://www.webcomponents.org/element/Juicy/juicy-ace-editor). You can install it by following these processes:

Make sure you have [bower](https://bower.io) installed, else run:

```bash
npm install -g bower
```

Now install the `ace-editor` component like so:

```bash
bower install juicy-ace-editor --save
```

Create an `index.html` file and import the `juicy-ace-editor` component like this:

```js
<link rel="import" href="bower_components/juicy-ace-editor/juicy-ace-editor.html">
```

and place the component on the page like this:

```js
 <juicy-ace-editor theme="ace/theme/monokai" mode="ace/mode/javascript"></juicy-ace-editor>
```

This is an example of the component in the `index.html` file.

{% highlight html %}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <script src="bower_components/webcomponentsjs/webcomponents.min.js"></script>
    <link rel="import" href="bower_components/juicy-ace-editor/juicy-ace-editor.html">
    <style type="text/css">
      #editor-container {
        position: absolute;
        top:  0px;
        left: 280px;
        bottom: 0px;
        right: 0px;
        background: white;
      }
    </style>
</head>
<body>
    <juicy-ace-editor id="editor-container" theme="ace/theme/monokai" mode="ace/mode/javascript">
    var User          = require('./controllers/user.server.controller'),
        Notification  = require('./controllers/notification.server.controller');

        module.exports = function(app) {

          app.get('/api',  User.welcome);

          app.post('/api/users',           User.createNewUser);
          app.delete('/api/user/:user_id', User.deleteOneUser);

          app.post('/api/notify', Notification.notifyUsers);
        };
    </juicy-ace-editor>
</body>
</html>
{% endhighlight %}

In the code above, we referenced a script:

{% highlight html %}
    <script src="bower_components/webcomponentsjs/webcomponents.min.js"></script>
{% endhighlight %}


The `Webcomponentjs` file is the Web components' polyfill for browsers that don't support web components yet.

When you check out your browser, this is how your page will look like:

![Webcomponent Juicy Editor](https://cdn.auth0.com/blog/webcomponent/editor.png)

Follow the [documentation here](https://github.com/juicy/juicy-ace-editor) to install and run it in your web browser.

It is that simple. Now we have a code editor in our browser by just importing a *Web Component*. Whoop! Whoop!

Now, let's go through the *Web Components* specifications in order to know how to create a custom component, starting from `Custom Elements`.

## How to create Web Components

### Custom Elements

This is a web component specification that defines how to craft and use new types of DOM elements. There are some ground rules on how to name and define your custom elements. They are:

* The name of your custom element must contain a **dash (-)**. For example, `<file-reader>`, and `<skype-login>` are valid names for custom elements, while `<skype_login>`, and `<skypelogin>` are not. This is necessary in order to allow the HTML parser differentiate between a custom element and an inbuilt HTML element.

* A custom element can't be registered more than once. A `DOMException` error will be thrown if you do so.
* A custom element can't be self-closing. For example, you can't write a custom element like this: `<skype-login />`. It should always be written like this: `<skype-login></skype-login>`.

A custom element can be created using the `customElements.define()` browser API method and a class that extends `HTMLElement` in JavaScript like so:

```js

class FileBag extends HTMLElement {
  // Define behavior here
}

window.customElements.define('file-bag', FileBag);

```

Another option is to use an anonymous class like so:

```js
window.customElements.define('file-bag', class extends HTMLElement {
  // Define behaviour here
});
```

With this already defined, you can now use the custom element in a web page like so:

{% highlight html %}
  <file-bag></file-bag>
{% endhighlight %}

You can define properties on a customElement. For instance, let's add an attribute called `open` to our `<file-bag>` element. This can be achieved like so:

```js
class FileBag extends HTMLElement {
  // Set the "open" property
  set open(option) {
    this.setAttribute("open", option);
  }

  // Get the "open" property
  get open() {
    return this.hasAttribute("open");
  }

}
```

> **this** refers to the DOM element itself. So in this example, **this** refers to `<file-bag>`.

Once you have done this, you can now use the custom element in your browser like this:

{% highlight html %}
  <file-bag open="true"></file-bag>
{% endhighlight %}

**Note:** You can also define a constructor in the class, but you have to call the `super()` method just before adding any other piece of code.

There are lifecycle hooks that custom elements can define during their existence. These hooks are:

* **constructor():** Here, you can attach event listeners and initialize state.
* **connectedCallback():** Called whenever the custom element is inserted into the DOM.
* **disconnectedCallback():** Called whenever the custom element is removed from the DOM.
* **attributeChangedCallback(attrName, oldVal, newVal):** Called whenever an attribute is added, removed or updated. Only attributes listed in the **observedAttributes** property are affected.
* **adoptedCallback():** Called whenever the custom element has been moved into a new document.

You can reference the [custom element specification](https://w3c.github.io/webcomponents/spec/custom) for a lot more information.

### Shadow DOM

This is a powerful API to combine with custom elements. It provides encapsulation by hiding DOM subtrees under shadow roots. You can use **Shadow DOM** in a custom element like so:

```js
window.customElements.define('file-bag', class extends HTMLElement {
  constructor() {
    super();
    var shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = `<strong>Shadow dom super powers for the win!</strong>`;
  }
});
```

So when you call `<file-bag><p>This is a file bag </p></file-bag>` in the browser, it will be rendered like so:

{% highlight html %}
  <file-bag>
    <strong>Shadow dom super powers for the win!</strong>
  </file-bag>
{% endhighlight %}

The main idea behind *Shadow DOM* is to mask all of the markup behind a custom element in the shadows. If you inspect the element in the browser, you won't see any of the markup apart from the attributes of the element. They are hidden under shadow roots. Browser vendors have been using *Shadow DOM* for years to natively implement elements such as `<input>`, `<audio>`, `<video>` and many others. Another benefit is that all the styling and scripts inside the custom element won't accidentally leak out and affect anything else on the page. 

You can reference the [shadow DOM specification](https://w3c.github.io/webcomponents/spec/shadow/) for a lot more information.

### HTML Imports

HTML Imports are a way to include and reuse HTML documents in other HTML documents. The `import` keyword is assigned to the `rel` attribute of the `link` element like so:

```js
<link rel="import" href="/imports/file-reader.html">
```

You can reference the [HTML Imports](https://w3c.github.io/webcomponents/spec/imports) for a lot more information.

### HTML Template
This is a web component specification that defines how to declare pieces of markup at page load.

The `<template>` tag is placed within the web component. You can write HTML and CSS code within this tag to define how you want the component to be presented in the browser.

You can reference the [HTML Template](https://html.spec.whatwg.org/multipage/webappapis.html#scripting) specification for a very detailed information on templating.

## Build a Vimeo Embed Web Component

We'll build a web component that will allow users embed vimeo videos into their apps easily. Let's get started.

Create a new HTML file, `video-embed.html`. Define the HTML Template markup like so:

{% highlight html %}

<!-- Defines element markup -->
<template>
    <style>
        .vimeo {
            background-color: #000;
            margin-bottom: 30px;
            position: relative;
            padding-top: 56.25%;
            overflow: hidden;
            cursor: pointer;
        }
        .vimeo img {
            width: 100%;
            top: -16.82%;
            left: 0;
            opacity: 0.7;
        }
        .vimeo .play-button {
            width: 90px;
            height: 60px;
            background-color: #333;
            box-shadow: 0 0 30px rgba( 0,0,0,0.6 );
            z-index: 1;
            opacity: 0.8;
            border-radius: 6px;
        }
        .vimeo .play-button:before {
            content: "";
            border-style: solid;
            border-width: 15px 0 15px 26.0px;
            border-color: transparent transparent transparent #fff;
        }
        .vimeo img,
        .vimeo .play-button {
            cursor: pointer;
        }
        .vimeo img,
        .vimeo iframe,
        .vimeo .play-button,
        .vimeo .play-button:before {
            position: absolute;
        }
        .vimeo .play-button,
        .vimeo .play-button:before {
            top: 50%;
            left: 50%;
            transform: translate3d( -50%, -50%, 0 );
        }
        .vimeo iframe {
            height: 100%;
            width: 100%;
            top: 0;
            left: 0;
        }
    </style>
    <div class="vimeo">
        <div class="play-button"></div>
    </div>
</template>

{% endhighlight %}

We have also added CSS style to the `template` tag to define the styling of the `vimeo-embed` component.

The next step is to actually create the custom element. Now add a `<script>` tag just after the `<template>` tag and create it like so:


{% highlight html %}

<script>
(function(window, document, undefined) {

    // Refers to the "importer", which is index.html
    var thatDoc = document;

    // Refers to the "importee", which is vimeo-embed.html
    var thisDoc = (thatDoc._currentScript || thatDoc.currentScript).ownerDocument;

    // Gets content from <template>.
    var template = thisDoc.querySelector( 'template' ).content;

    // Shim Shadow DOM styles if needed
    if (window.ShadowDOMPolyfill) {
        WebComponents.ShadowCSS.shimStyling(template, 'vimeo');
    }

    class VimeoEmbed extends HTMLElement {

        constructor() {
            super();
        }

        connectedCallback() {
            var shadowRoot = this.attachShadow({mode:'open'});  

            // Adds a template clone into shadow root.
            var clone = thatDoc.importNode( template, true );
            shadowRoot.appendChild(clone);

            // get the value of the "embed" attribute
            var embed = this.getAttribute("embed");
            
            var video = shadowRoot.querySelector( ".vimeo" );
            this.createAndPlay(embed, video);
        }

        createAndPlay(embedID, videoElem) {
            videoElem.addEventListener( "click", function() {

                var iframe = document.createElement( "iframe" );

                iframe.setAttribute( "frameborder", "0" );
                iframe.setAttribute( "allowfullscreen", "" );
                iframe.setAttribute( "webkitallowfullscreen", "" );
                iframe.setAttribute( "mozallowfullscreen", "" );
                iframe.setAttribute( "src", "https://player.vimeo.com/video/" + embedID + "?autoplay=1" );
                iframe.setAttribute( "width", "640");
                iframe.setAttribute( "height", "360");

                this.innerHTML = "";
                this.appendChild( iframe );
            });
        }
    }
    window.customElements.define('vimeo-embed', VimeoEmbed);
})(window, document);
</script>

{% endhighlight %}

We have the `constructor`, `connectedCallback` and `createAndPlay` method. In the constructor, we called the `super()` method to have access to the methods and properties of `HTMLElement`. 

The `connectedCallback` method is a lifecycle hook that our custom element provides. So, we have deferred the work of setting up the shadow root, getting the value of the embed attribute and also calling the `createAndPlay` in this hook. As I mentioned earlier, this method is called whenever the custom element is inserted into the DOM.

In the `createAndPlay` method, we simply added a `click` eventlistener and used JavaScript to create an iframe and set the required attributes.

Finally we called `window.customElements.define('vimeo-embed', VimeoEmbed);` to attach the `VimeoEmbed` class to `vimeo-embed` custom tag.

### HTML Import

Create an `index.html` file. Go ahead and import the `vimeo-embed.html` file in it like so:

{% highlight html %}

<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>Vimeo Embed</title>
    <script src="./bower_components/webcomponentsjs/webcomponents.min.js"></script>
    <link rel="import" href="vimeo-embed.html">
    <style type="text/css">
        .wrapper {
            max-width: 680px;
            margin: 60px auto 100px;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <vimeo-embed embed="203909195"></vimeo-embed>
    </div>   
</body>
</html>

{% endhighlight %}

Oh, you can see the `webcomponentsjs` polyfill referenced in the *script* tag. How did we get that?

Install it via bower like this:

```bash
bower install webcomponentsjs --save
```

### Browser View

From your terminal, run a local server, e.g [http-server](https://www.npmjs.com/package/http-server) to serve up the web page.

Your web page should display the component like so:

![Loading the Web Component](https://cdn.auth0.com/blog/webcomponent/load.png)
_Load Web Component_

Once you click the play button, the video should autoplay:

![Click and Play Video](https://cdn.auth0.com/blog/webcomponent/click.png)
_Video should autoplay_

Inspect the page with Chrome DevTools, check out the `<video-embed>` tag:

![Video embed tag](https://cdn.auth0.com/blog/webcomponent/videoembed.png)
_video embed tag_

Check out the Shadow DOM below:

![Shadow Dom](https://cdn.auth0.com/blog/webcomponent/shadowroot.png)
_Shadow Dom_

Now that we have a fully functional vimeo embed web component, let's package it and submit to the registry.

## Submit To The Web Component Registry

There is a list of [requirements](https://www.webcomponents.org/publish) to adhere to before submitting your component to the registry. Follow the instructions below:

* Add an open source [license](https://github.com/auth0-blog/vimeo-embed/blob/master/LICENSE).
* Add a [README](https://github.com/auth0-blog/vimeo-embed/blob/master/README.md) and include a [demo](https://github.com/auth0-blog/vimeo-embed/tree/master/demo).
* Tag a release.

Go ahead and [publish](https://www.webcomponents.org/publish)

![Publish the Web Component](https://cdn.auth0.com/blog/webcomponent/publish.png)

Now, your component should be visible in the registry.

![Visible in the component registry](https://cdn.auth0.com/blog/webcomponent/latestpublished.png)

Yaay!

## Browser Support for Web Components

Google Chrome is leading the pack of browsers with stable support for Web Components in their web and mobile browsers. Take a look at the browser support matrix below:

![Web component browser support](https://cdn.auth0.com/blog/webcomponent/browsersupport.png)
_Source: webcomponentjs_

To be safe, it is recommended to use [webcomponentsjs](https://github.com/webcomponents/webcomponentsjs), to provide support for many browsers.

We used `webcomponentsjs` during the course of building our own custom element. [webcomponentsjs](https://github.com/webcomponents/webcomponentsjs) is a suite of polyfills supporting the [Web Components](http://webcomponents.org). These polyfills are intended to work in the latest version of browsers. 

**Note:** Web Components capabilities are disabled by default in Firefox. To enable them, go to the `about:config` page and dismiss any warning that appears. Then search for the preference called **dom.webcomponents.enabled**, and set it to true.

## Tools for Building Web Components

There are libraries available that make it easier to build web components. Some of these libaries are:

* [Bosonic](https://bosonic.github.io) 
* [Polymer](https://www.polymer-project.org) 
* [SkateJS](https://github.com/skatejs/skatejs)
* [X-Tag](https://x-tag.github.io)

 All the libraries highlighted here offer tools to cut down boilerplate code and make creating new components easier. **Polymer** and **Bosonic** also offer a library of ready made Web Components, but Polymer remains the most widely used amongst developers. Check out this [awesome tutorial on building apps with Polymer and Web components](https://auth0.com/blog/build-your-first-app-with-polymer-and-web-components).

## Aside: Easy Authentication with Auth0
You can use [Auth0 Lock](https://auth0.com/docs/libraries/lock) for authentication in your web apps. With Lock, showing a login screen is as simple as including the **auth0-lock** library and then calling it in your app like so:

```js

// Initiating our Auth0Lock
var lock = new Auth0Lock(
  'YOUR_CLIENT_ID',
  'YOUR_AUTH0_DOMAIN'
);

// Listening for the authenticated event
lock.on("authenticated", function(authResult) {
  // Use the token in authResult to getProfile() and save it to localStorage
  lock.getProfile(authResult.idToken, function(error, profile) {
    if (error) {
      // Handle error
      return;
    }

    localStorage.setItem('idToken', authResult.idToken);
    localStorage.setItem('profile', JSON.stringify(profile));
  });
});

```

**Note:** If you have an API for your application, the API should _always_ be secured. The [`id_token` should not be used to secure an API](https://auth0.com/blog/why-should-use-accesstokens-to-secure-an-api); instead use an `access_token` with the appropriate configuration. You can read about how to [implement API authentication with Auth0](https://auth0.com/docs/apis) with [implicit grant](https://auth0.com/docs/api-auth/tutorials/implicit-grant).


_Implementing Lock_

```js

document.getElementById('btn-login').addEventListener('click', function() {
  lock.show();
});

```

_Showing Lock_


![Auth0 Lock Screen](https://cdn.auth0.com/blog/nexthrone-auth0lock.png)

_Auth0 Lock Screen_

You can also use the [custom auth0-lock polymer web component](https://github.com/epilith/auth0-lock) for login like so:

{% highlight html %}

<auth0-lock autoLogin="true" 
            domain="AUTH0_DOMAIN"
            clientId="AUTH0_CLIENTID"
            profile="{{profile}}"></auth0-lock>

<script>
    var firebaseRequest = {
        api: "api", // This defaults to the first active addon if any or you can specify this
        scope: "openid profile"         // default: openid
    };

    document.querySelector('auth0-lock').addEventListener('logged-in', function (profile) {
        console.log(profile);

        // try to get delegated access to Firebase
        document.querySelector('auth0-lock').delegate(firebaseRequest, function (result) {
            console.log(result)
        });
    });
</script>

{% endhighlight %}

## Conclusion
Web components have a lot more benefits than meets the eye. Web Components allow for less code, modular code and more reuse in our apps.

In my opinion, the major selling point of **Web components** is reusability and simplicity of use. The more high quality components developers submit to the [registry](https://www.webcomponents.org), the more a plethora of better tools will be available to the community for building better and beautiful web apps in less time!

Have you been using *Web Components* for a while? Do you think **Web Components** are the future for web app development? Are they just another hipster technology? I'll like to know your thoughts in the comment section.
