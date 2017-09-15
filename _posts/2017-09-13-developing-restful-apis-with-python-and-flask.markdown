---
layout: post
title: "Developing RESTful APIs with Python and Flask"
description: "Let's learn how to develop RESTful APIs with Python and Flask."
date: 2017-09-13 15:29
category: Technical Guide, Python
author:
  name: "Bruno Krebs"
  url: "https://twitter.com/brunoskrebs"
  mail: "bruno.krebs@auth0.com"
  avatar: "https://www.gravatar.com/avatar/76ea40cbf67675babe924eecf167b9b8?s=60"
design:
  bg_color: "#3F6426"
  image: https://cdn.auth0.com/blog/spring-boot-auth/logo.png
tags:
- python
- flask
- restful
related:
- 2017-04-20-image-processing-in-python-with-pillow
---

TL;DR; Throughout this article, we are going to use Flask and Python to develop a RESTful API. We will start by creating an endpoint that returns static data (dictionaries). After, we are going to create a class with two specializations and a few more endpoints to insert and retrieve instances of these classes. In the end, will take a look on how to deploy the API to production. Hope you enjoy!

{% include tweet_quote.html quote_text="Flask allows Python developers to create lightweight RESTful APIs." %}

## Summary

This article is divided in the following sections:

1. Why Python?
2. Why Flask?
3. Bootstrapping a Flask Application
4. Creating a RESTful Endpoint with Flask
5. Mapping Models with Python Classes
6. Serializing and Deserializing Objects with Marshmallow
7. Deploying Flask to Production
8. Securing Python APIs with Auth0
9. Next Steps

## Why Python?

- Popular
- Great features
- Great documentation
- Good performance

## Why Flask?

Pretty much the same reasons for why choosing Python.

- Popular
- Lightweight
- Great features
- Great documentation
- Good performance

## Bootstrapping a Flask Application

### Virtual Environments (virtualenv)

> Note: Macbooks ship with Python 2. Installing Python 3 alongside with this version produces `python3` and `pip3` commands, and not `python` (which refers to Python 2) or `pip`.

```bash
pip3 install pipenv
pip3 install virtualenv
virtualenv env
```

## Creating a RESTful Endpoint with Flask

## Mapping Models with Python Classes

## Serializing and Deserializing Objects with Marshmallow

## Deploying Flask to Production

## Securing Python APIs with Auth0

## Next Steps
