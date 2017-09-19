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

First and foremost, we will need to install some dependencies on our development machine. Basically, what we will need to install is [Python 3](https://docs.python.org/3/), [Pip (Python Package Index)](https://pypi.python.org/pypi/pip), and [Flask](http://flask.pocoo.org/). Fortunately, the process of installing these dependencies is quite simple.

### Installing Python 3

If we are using some recent version of a popular Linux distribution (like Ubuntu), chances are that we already have Python 3 installed on our computer. If we are running Windows, then [we will probably need to install Python 3](https://www.python.org/downloads/windows/), as this operational system does not ship with any version at all. When it comes to Macbooks, the scenario is that Python 2 comes installed by default and we have to [install Python 3 by ourselves](http://docs.python-guide.org/en/latest/starting/install3/osx/).

After installing Python 3 on our machine, we can check that we have everything set up as expected by running the following command:

```bash
python --version
# Python 3.6.2
```

Note that the command above might produce a different output in case we have a different Python version. What is important is that the output begins with `Python 3`, and not `Python 2`. If we get the latter, we can try issuing `python3 --version`. If this command produces the correct output, then we have to remember to replace all commands throughout the article.

### Installing Pip

[Pip, which stands for Python Package Index](https://pypi.python.org/pypi/pip), is the recommended tool for installing Python packages. While the [official installation page](https://pip.pypa.io/en/stable/installing/) states that `pip` is already installed if we're using Python 2 >= `2.7.9` or Python 3 >= `3.4`, installing Python through `apt` on Ubuntu doesn't install `pip`. Therefore, let's check if we do need to install `pip` separately, or if we already have it.

```bash
# we might need to change pip by pip3
pip --version
# pip 9.0.1 ...
```

If the command above produces an output similar to `pip 9.0.1 ...`, then we are good to go. Otherwise, we can follow the instructions [here to install Pip](https://pip.pypa.io/en/stable/installing/).

### Installing Flask

We already know what Flask is and its capabilities. Therefore, let's focus on installing it on our machine and testing to see if we can get a basic Flask application running. First step is to use `pip` to install Flask:

```bash
# we might need to change pip by pip3
pip install Flask
```

After installing the package, we will create a file called `hello.py` and add five lines of code to it. As we will use this file just to check if Flask was correctly installed, we don't need to nest it on a new directory.

```python
from flask import Flask
app = Flask(__name__)


@app.route("/")
def hello_world():
    return "Hello, World!"
```

These 5 lines of code are everything we need to handle HTTP requests and return a "Hello, World!" message. To run it, we need to export a environment variable called `FLASK_APP` and then execute `flask`:

```bash
# flask depends on this env variable to find the main file
export FLASK_APP=hello.py

# now we just need to ask flask to run
flask run

# * Serving Flask app "hello"
# * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
```

> On Ubuntu, we might need to edit the $PATH variable to be able to run flask directly. To do that, let's `touch ~/.bash_profile` and then `echo "export PATH=$PATH:~/.local/bin" >> ~/.bash_profile`.

After executing these commands, we can reach our application by opening a browser and navigating to `http://127.0.0.1:5000/` or by issuing `curl http://127.0.0.1:5000/`.

![Hello world with Flask](https://cdn.auth0.com/blog/python-restful/hello-world.jpg)

### Virtual Environments (virtualenv)

Although PyPA—the [Python Packaging Authority group](https://www.pypa.io/en/latest/)—recommends `pip` as the tool for installing Python packages, we will need to use another package to manage our project's dependencies. It's true that `pip` supports [package management through the `requirements.txt` file](https://pip.pypa.io/en/stable/user_guide/#requirements-files), but the tool lacks some features to be used on serious projects running on different production and development machines. Among its issues, the ones that cause more problems are:

- `pip` installs packages globally, making it hard to manage multiple versions of the same package on the same machine.
- `requirements.txt` need all dependencies and sub-dependencies listed explicitly, a manual process that is tedious and error-prone.

To solve these issues, we are going to use Pipenv. [Pipenv is a dependency manager](https://github.com/kennethreitz/pipenv) that isolates projects on private environments, allowing packages to be installed per project. If you’re familiar with NPM or Ruby’s bundler, it's similar in spirit to those tools.

```bash
pip install pipenv
```

Now, to start creating a serious Flask application, let's create a new folder that will hold our project source code. After that, we will use `pipenv` to start our project and manage our dependencies.

```bash
pipenv --three

pipenv install flask
```

The first command creates our virtual environment, where all our dependencies will be installed, and the second one will add Flask as our first dependency. If we check our current directory, we will see that two files are created after executing these commands:

1. `Pipfile`, a file that contains details about our project, like the Python version that we are using and the packages that our project needs.
2. `Pipenv.lock,` a file that contains exactly what version of each package that our project depends on, and its transitive dependencies.

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
