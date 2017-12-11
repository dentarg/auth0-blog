---
layout: post
title: "Title Should be Less Than 56 characters"
description: "Description goes here and must be less than 156 characters."
date: 2017-12-20 8:30
category: Technical guide, Firebase, Angular
banner:
  text: "Auth0 makes it easy to add authentication to your application."
author:
  name: "Kim Maida"
  url: "https://twitter.com/KimMaida"
  mail: "kim.maida@auth0.com"
  avatar: "https://secure.gravatar.com/avatar/a208cda2b3b21dc8d7896507f5ff60fc"
design:
  image: https://cdn.auth0.com/blog/...
  bg_color: "#"
tags:
- firebase
- angular
- tokens
- angularfire2
- auth0
- centralized-login
related:
- date-postname
- date-postname
---

**TL;DR:** A brief synopsis that includes link to a [github repo](http://www.github.com/).

---

### Create New Angular Project

```bash
$ ng new angular-firebase --routing --skip-tests
```

### Install Dependencies

```bash
$ npm install auth0-js@latest firebase@latest angularfire2@latest --save
```

### Generate Components and Services

* `ng g module core`
* `ng g service core/api --no-spec`
* `ng g component core/header --is --no-spec`
* `ng g interface core/dog`
* `ng g module firebase`
* `ng g interface firebase/firebase-config`
* `ng g component firebase/comments --is --no-spec` (add `CommentsComponent` to the module's exports)
* `ng g component firebase/comments/comment-form --is --no-spec` (delete from exports)
* `ng g class comments/comment --no-spec` (change filename to `comment.model.ts`)
* `ng g module auth`
* `ng g service auth/auth --no-spec`
* `ng g guard auth/auth --no-spec`
* `ng g interface auth/auth-config`
* `ng g component callback --is --it --flat --no-spec`
* `ng g module dogs`
* `ng g component dogs/dogs --is --no-spec`
* `ng g module dog`
* `ng g component dog/dog --is --no-spec`