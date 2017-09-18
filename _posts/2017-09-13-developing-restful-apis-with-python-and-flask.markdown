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

**TL;DR;** Throughout this article, we are going to use Flask and Python to develop a RESTful API. We will start by creating an endpoint that returns static data (dictionaries). After, we are going to create a class with two specializations and a few endpoints to insert and retrieve instances of these classes. In the end, will take a look on how to run the API on a Docker container. Hope you enjoy!

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

Nowadays, choosing Python to develop applications is becoming a very popular choice. [As StackOverflow recently analyzed](https://stackoverflow.blog/2017/09/06/incredible-growth-python/), Python is one of the fastest-growing programming languages, having surpassed even Java on the number of questions asked on the platform. On GitHub, the language shows signs of mass adoption as well, featuring the third position on the number of [opened Pull Requests in 2016](https://octoverse.github.com/).

![Stack Overflow Trends showing Python growth](https://cdn.auth0.com/blog/python-restful/trends.jpg)

The huge community that is forming around Python, is improving every aspect of the language. More and more open source libraries are being released to address many different subjects, like [Artificial Intelligence](https://github.com/aimacode/aima-python), [Machine Learning](https://github.com/rasbt/python-machine-learning-book), and [web development](https://github.com/pallets/flask). Besides the great support provided by the overall community, the [Python Software Foundation also provides an excellent documentation](https://docs.python.org/3/) where new adopters can learn its essence fast.

## <span id="why-flask"></span> Why Flask?

When it comes to web development on Python, there are two frameworks that are widely used: [Django](https://github.com/django/django) and [Flask](https://github.com/pallets/flask). Django is older, more mature, and a little bit more popular. On GitHub, this framework has around 28k stars, 1.5k contributors, ~170 releases, and more than 11k forks. On StackOverflow, roughly 1.2% of questions asked on a specific month are related to Django.

Flask, although less popular, is not far behind. On GitHub, Flask has almost 30k stars, ~445 contributors, ~21 releases, and almost 10k forks. On StackOverflow, up to 0.2% of questions asked on a specific month are related to Flask.

Even though Django looks like a better choice, for being older and having a slightly bigger community, Flask has its strengths. From the ground up, Flask was thought with scalability and simplicity in mind. Flask applications are known for being lightweight, mainly when compared to its Django counterparts. Flask developers call it a microframework, where micro ([as explained here](http://flask.pocoo.org/docs/0.12/foreword/#what-does-micro-mean)) means that the goal is to keep the core simple but extensible. Flask won’t make many decisions for you, such as what database to use or what template engine to choose. Lastly, Flask also contains an [extensive documentation](http://flask.pocoo.org/docs/0.12/) that address almost everything that developers need to know.

Being lightweight, easy to adopt, with great documentation, and popular, makes Flask a very good option for developing RESTful APIs.

## <span id="bootstrapping-flask"></span> Bootstrapping a Flask Application

First and foremost, we will need to install some dependencies on our development machine. If we are using some recent version of a popular Linux distribution (like Ubuntu), chances are that we already have Python 3 installed on our computer. If we are running Windows, then [we will probably need to install Python 3](https://www.python.org/downloads/windows/), as this operational system does not ship with any version at all. When it comes to Macbooks, the scenario is that Python 2 comes installed by default and we have to [install Python 3 by ourselves](http://docs.python-guide.org/en/latest/starting/install3/osx/).

After installing Python 3 on our machine, we can check that we have everything set up as expected by running the following commands:

```bash
python --version
# Python 3.6.2

pip --version
# pip 9.0.1 from ...
```

Note that the commands above might produce different outputs in case we have a different Python version. What is important is that the `python` command is pointing to a Python 3 executable, and not Python 2. If `python` points to Python 2, we can try replacing `python` and `pip` by `python3` and `pip3`. If we need that, then we have to remember to replace all commands in this article to use the correct version.









```bash
pip3 install Flask
```

Note that Macbooks ship with Python 2 by default. Therefore, `pip` and `python` commands point to this version. Throughout this article, we are going to use Python 3, which might be executed with `pip3` and `python3` commands. To check Python and Pip versions, issue the following commands:

```bash

```

 It's just a matter of creating a single file, which we will call `hello.py`, and add five lines of code. After that, we just need to run Python passing this file as parameter and voilà!

```bash
# create the single file app on the current directory
touch hello.py

# add the Hello World app source code to the file
echo '
from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello_world():
    return "Hello, World!"
' >> hello.py

# run the file
python3 hello.py
```

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
