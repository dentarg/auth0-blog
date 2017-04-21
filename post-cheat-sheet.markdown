---
layout: post
title: "Title Should be Less Than 56 characters"
description: "Description goes here and must be less than 156 characters."
date: 2017-10-05 8:30
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

## Special Characters and Snippets

### Characters

* Em dash: `—` (don't use hyphens for this)
* Lambda: `λ`

### Within-article Target Links

```
<a href="#some-target" target="_self">Link to Target</a>

### <span id="#some-target"></span>Target
```

### Tweet Quote

```
{% include tweet_quote.html quote_text="Lorem ipsum dolor sit amet." %}
```

## Copy-Paste Auth0 Setup (Pipeline 2)

> **Important Note:** Make sure this is updated to reflect the appropriate application type, allowed callback / CORS settings, and API identifier when pasting into a post.

![Auth0 hosted login screen](https://cdn2.auth0.com/blog/angular-aside/angular-aside-login.jpg)

### Sign Up for Auth0

You'll need an [Auth0](https://auth0.com) account to manage authentication. You can sign up for a [free account here](javascript:signup\(\)). Next, set up an Auth0 Client and API so Auth0 can interface with your app and API.

### Set Up a Client App

1. Go to your [**Auth0 Dashboard**](https://manage.auth0.com/#/) and click the "[create a new client](https://manage.auth0.com/#/clients/create)" button. 
2. Name your new app and select "Single Page Web Applications". 
3. In the **Settings** for your new Auth0 client app, add `http://localhost:4200` to the **Allowed Callback URLs** and `http://localhost:4200` to the **Allowed Origins (CORS)**.
4. Scroll down to the bottom of the **Settings** section and click "Show Advanced Settings". Choose the **OAuth** tab and change the **JsonWebToken Signature Algorithm** to `RS256`.
5. If you'd like, you can [set up some social connections](https://manage.auth0.com/#/connections/social). You can then enable them for your app in the **Client** options under the **Connections** tab. The example shown in the screenshot above utilizes username/password database, Facebook, Google, and Twitter.

### Set Up an API

1. Under your account name in the upper right corner of your [**Auth0 Dashboard**](https://manage.auth0.com/#/), choose **Account Settings** from the dropdown, then select the [**Advanced**](https://manage.auth0.com/#/account/advanced) tab. Scroll down to the **Settings** section and turn on the toggle for **Enable APIs Section**. Now you will have a link to manage [APIs](https://manage.auth0.com/#/apis) in your dashboard left sidebar navigation.
2. Go to [**APIs**](https://manage.auth0.com/#/apis) in your dashboard and click on the "Create API" button. Enter a name for the API. Set the **Identifier** to your API endpoint URL. In this example, this is `http://localhost:3001/api/`. The **Signing Algorithm** should be `RS256`.