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

TL;DR; Throughout this article, we are going to use Flask and Python to develop a RESTful API. We will start by creating an endpoint that returns static data (dictionaries). After, we are going to create a class with two specializations and a few more endpoints to insert and retrieve instances of these classes. In the end, will take a look on how to run the API on a Docker container. Hope you enjoy!

{% include tweet_quote.html quote_text="Flask allows Python developers to create lightweight RESTful APIs." %}

## Summary

This article is divided in the following sections:

1. <a href="#why-python" target="self">Why Python?</a>
2. <a href="#why-flask" target="self">Why Flask?</a>
3. <a href="#bootstrapping-flask" target="self">Bootstrapping a Flask Application</a>
4. <a href="#restful-flask" target="self">Creating a RESTful Endpoint with Flask</a>
5. <a href="#python-classes" target="self">Mapping Models with Python Classes</a>
6. <a href="#marshmallow-serilization" target="self">Serializing and Deserializing Objects with Marshmallow</a>
7. <a href="#flask-on-docker" target="self">Dockerizing Flask Applications</a>
8. <a href="#securing-python-apis" target="self">Securing Python APIs with Auth0</a>
9. <a href="#next-steps" target="self">Next Steps</a>

## <span id="why-python"></span> Why Python?

- Popular
- Great features
- Great documentation
- Good performance

Starting to learn Python? https://docs.python.org/3/tutorial/index.html

## <span id="why-flask"></span> Why Flask?

Pretty much the same reasons for why choosing Python.

- Popular
- Lightweight
- Great features
- Great documentation
- Good performance

## <span id="bootstrapping-flask"></span> Bootstrapping a Flask Application

### Virtual Environments (virtualenv)

> Note: Macbooks ship with Python 2. Installing Python 3 alongside with this version produces `python3` and `pip3` commands, and not `python` (which refers to Python 2) or `pip`.

```bash
pip3 install pipenv
pip3 install virtualenv
virtualenv env
```

## <span id="restful-flask"></span> Creating a RESTful Endpoint with Flask

https://docs.python.org/3/tutorial/datastructures.html#dictionaries

## <span id="python-classes"></span> Mapping Models with Python Classes

https://docs.python.org/3/library/enum.html
https://docs.python.org/3/tutorial/classes.html

## <span id="marshmallow-serilization"></span> Serializing and Deserializing Objects with Marshmallow

## <span id="flask-on-docker"></span> Dockerizing Flask Applications

https://www.digitalocean.com/community/tutorials/how-to-serve-flask-applications-with-gunicorn-and-nginx-on-ubuntu-14-04

## <span id="securing-python-apis"></span> Securing Python APIs with Auth0

## <span id="next-steps"></span> Next Steps
