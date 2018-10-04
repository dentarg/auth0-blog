---
layout: post
title: "Title Should be Less Than 56 characters"
description: "Description goes here and must be less than 156 characters."
longdescription: "Long description is used for meta tags, particularly for Google, and should be between 230-320 characters."
date: 2018-01-01 8:30
category: Technical guide, Thing, Thing2, PR, Press
(!CanRemoveIfFalse)press_release: true
(!CanRemoveIfFalse)is_non-tech: true
banner:
  text: "Auth0 makes it easy to add authentication to your ___ application."
author:
  name: "YOUR NAME"
  url: "https://twitter.com/YOUR_TWITTER"
  mail: "YOUR_EMAIL@auth0.com"
  avatar: "https://en.gravatar.com/userimage/YOUR_GRAVATAR"
design:
  image: https://cdn.auth0.com/blog/...
  bg_color: "#"
tags:
- hyphenated-tags
- 
related:
- date-postname
- date-postname
---

**TL;DR:** A brief synopsis that includes link to a [github repo](http://www.github.com/).

---

## Basic Markdown

### Image

```
![Image alt text](image path)
```

Center an image:

```
<p style="text-align: center;">
  <img src="source of the image / CDN link" alt="SEO/Accessibility friendly description of the image">
</p>
```

### Link

```
[Link text](http://url.goes.here)
```

### Blockquote (Quote)

```
> _"Sample quote from someone cool."_ —Someone Cool
```

### Blockquote (Note)

```
> **Note:** Blockquote note text
```

## Code Syntax Highlighting

### HTML

> **Note:** It's necessary to use curly brace tags instead of backticks when code samples mess up the Jekyll blog engine formatting:

```
{% highlight html %}
{% raw %}

{{use raw tag when curly braces are present}}

<link rel="stylesheet" src="or when external stylesheets are called, such as CDN Bootstrap">

{% endraw %}
{% endhighlight %}
```

### JavaScript

```js
js
```

```typescript
typescript
```

### CSS

```css
css
```

```scss
scss
```

### Text

```bash
$ bash
```

```text
text
```

## Warnings

```html
<div class="alert alert-danger alert-icon">
  <i class="icon-budicon-487"></i>
  <strong>This article is outdated.</strong> Some kind of warning about this article being out of date.
</div>
```

## Special Characters and Snippets

### Characters

* Em dash: `—` (don't use hyphens for this) - Mac shortcut: `Shift`+`Alt`+`-`
* Lambda: `λ`

### Within-article Target Links

HTML is required with a `target="_self"` because the blog programming will automatically open _all_ links in a new window unless this is specified. Markdown anchor links do not work.

```
<a href="#some-target" target="_self">Link to Target</a>

### <span id="#some-target"></span>Target
```

### Tweet Quote

```
{% include tweet_quote.html quote_text="Max tweet character length is 255." %}
```

## Copy-Paste Auth0 Login Setup for SPAs

> **Important Note:** Make sure this is updated to reflect the appropriate application type, allowed callback settings, and API identifier when pasting into a post.

![Auth0 login screen](https://cdn.auth0.com/blog/resources/auth0-centralized-login.jpg)

### Sign Up for Auth0

You'll need an [Auth0](https://auth0.com) account to manage authentication. You can <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">sign up for a free Auth0 account here</a>. Next, set up an Auth0 Client and API so Auth0 can interface with your app and API.

### Set Up an Application

1. Go to your [**Auth0 Dashboard**](https://manage.auth0.com/#/) and click the "[create a new application](https://manage.auth0.com/#/applications/create)" button. 
2. Name your new app, select "Single Page Web Applications," and click the "Create" button. 
3. In the **Settings** for your new Auth0 app, add `http://localhost:[PORT]` to the **Allowed Callback URLs**.
4. Click the "Save Changes" button.
5. If you'd like, you can [set up some social connections](https://manage.auth0.com/#/connections/social). You can then enable them for your app in the **Application** options under the **Connections** tab. The example shown in the screenshot above utilizes username/password database, Facebook, Google, and Twitter.

> **Note:** Under the **OAuth** tab of **Advanced Settings** (at the bottom of the **Settings** section) you should see that the **JsonWebToken Signature Algorithm** is set to `RS256`. This is  the default for new clients. If it is set to `HS256`, please change it to `RS256`. You can [read more about RS256 vs. HS256 JWT signing algorithms here](https://community.auth0.com/questions/6942/jwt-signing-algorithms-rs256-vs-hs256).

### Set Up an API

1. Go to [**APIs**](https://manage.auth0.com/#/apis) in your dashboard and click on the "Create API" button.
2. Enter a name for the API. Set the **Identifier** to your API's URL. In this example, this is `http://localhost:[PORT]/api/`. The **Signing Algorithm** should be `RS256`.
