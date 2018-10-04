---
layout: post
title: "Developing RESTful APIs with Python and Flask"
description: "Let's learn how to develop RESTful APIs with Python and Flask."
date: 2017-09-28 15:29
category: Technical Guide, Python
author:
  name: "Bruno Krebs"
  url: "https://twitter.com/brunoskrebs"
  mail: "bruno.krebs@auth0.com"
  avatar: "https://www.gravatar.com/avatar/76ea40cbf67675babe924eecf167b9b8?s=60"
design:
  bg_color: "#4A4A4A"
  image: https://cdn.auth0.com/blog/python-restful/logo.png
tags:
- python
- flask
- restful
related:
- 2017-04-20-image-processing-in-python-with-pillow
---

**TL;DR:** Throughout this article, we are going to use Flask and Python to develop a RESTful API. We will start by creating an endpoint that returns static data (dictionaries). After, we are going to create a class with two specializations and a few endpoints to insert and retrieve instances of these classes. Finally, will take a look on how to run the API on a Docker container. [The final code developed throughout this article can be found in this GitHub repository](https://github.com/auth0-blog/flask-restful-apis). I hope you enjoy!

{% include tweet_quote.html quote_text="Flask allows Python developers to create lightweight RESTful APIs." %}

## Summary

This article is divided in the following sections:

1. <a href="#why-python" target="_self">Why Python?</a>
2. <a href="#why-flask" target="_self">Why Flask?</a>
3. <a href="#bootstrapping-flask" target="_self">Bootstrapping a Flask Application</a>
4. <a href="#restful-flask" target="_self">Creating a RESTful Endpoint with Flask</a>
5. <a href="#python-classes" target="_self">Mapping Models with Python Classes</a>
6. <a href="#marshmallow-serilization" target="_self">Serializing and Deserializing Objects with Marshmallow</a>
7. <a href="#flask-on-docker" target="_self">Dockerizing Flask Applications</a>
8. <a href="#securing-python-apis" target="_self">Securing Python APIs with Auth0</a>
9. <a href="#next-steps" target="_self">Next Steps</a>

## <span id="why-python"></span> Why Python?

Nowadays, choosing Python to develop applications is becoming a very popular choice. [As StackOverflow recently analyzed](https://stackoverflow.blog/2017/09/06/incredible-growth-python/), Python is one of the fastest-growing programming languages, having surpassed even Java on the number of questions asked on the platform. On GitHub, the language shows signs of mass adoption as well, occupying the third position on the number of [opened Pull Requests in 2016](https://octoverse.github.com/).

![Stack Overflow Trends showing Python growth](https://cdn.auth0.com/blog/python-restful/trends.jpg)

The huge community that is forming around Python is improving every aspect of the language. More and more open source libraries are being released to address many different subjects, like [Artificial Intelligence](https://github.com/aimacode/aima-python), [Machine Learning](https://github.com/rasbt/python-machine-learning-book), and [web development](https://github.com/pallets/flask). Besides the great support provided by the overall community, the [Python Software Foundation also provides excellent documentation](https://docs.python.org/3/) where new adopters can learn its essence fast.

## <span id="why-flask"></span> Why Flask?

When it comes to web development on Python, there are two frameworks that are widely used: [Django](https://github.com/django/django) and [Flask](https://github.com/pallets/flask). Django is older, more mature, and a little bit more popular. On GitHub, this framework has around 28k stars, 1.5k contributors, ~170 releases, and more than 11k forks. On StackOverflow, roughly 1.2% of questions asked in a given month are related to Django.

Flask, although less popular, is not far behind. On GitHub, Flask has almost 30k stars, ~445 contributors, ~21 releases, and almost 10k forks. On StackOverflow, up to 0.2% of questions asked in a given month are related to Flask.

Even though Django is older and having a slightly bigger community, Flask has its strengths. From the ground up, Flask was built with scalability and simplicity in mind. Flask applications are known for being lightweight, mainly when compared to their Django counterparts. Flask developers call it a microframework, where micro ([as explained here](http://flask.pocoo.org/docs/0.12/foreword/#what-does-micro-mean)) means that the goal is to keep the core simple but extensible. Flask won’t make many decisions for us, such as what database to use or what template engine to choose. Lastly, Flask also has [extensive documentation](http://flask.pocoo.org/docs/0.12/) that address everything that developers need to start.

Being lightweight, easy to adopt, well-documented, and popular, Flask is a very good option for developing RESTful APIs.

## <span id="bootstrapping-flask"></span> Bootstrapping a Flask Application

First and foremost, we will need to install some dependencies on our development machine. Basically, what we will need to install is [Python 3](https://docs.python.org/3/), [Pip (Python Package Index)](https://pypi.python.org/pypi/pip), and [Flask](http://flask.pocoo.org/). Fortunately, the process of installing these dependencies is quite simple.

### Installing Python 3

If we are using some recent version of a popular Linux distribution (like Ubuntu), chances are that we already have Python 3 installed on our computer. If we are running Windows, then [we will probably need to install Python 3](https://www.python.org/downloads/windows/), as this operating system does not ship with any version at all. Python 2 is installed by default on Mac OS and we have to [install Python 3 by ourselves](http://docs.python-guide.org/en/latest/starting/install3/osx/).

After installing Python 3 on our machine, we can check that we have everything set up as expected by running the following command:

```bash
python --version
# Python 3.6.2
```

Note that the command above might produce a different output in case we have a different Python version. What is important is that the output begins with `Python 3`, and not `Python 2`. If we get the latter, we can try issuing `python3 --version`. If this command produces the correct output, then we have to replace all commands throughout the article.

### Installing Pip

[Pip is the recommended tool for installing Python packages. While the [official installation page](https://pip.pypa.io/en/stable/installing/) states that `pip` is already installed if we're using Python 2 >= `2.7.9` or Python 3 >= `3.4`, installing Python through `apt` on Ubuntu doesn't install `pip`. Therefore, let's check if we do need to install `pip` separately, or if we already have it.

```bash
# we might need to change pip by pip3
pip --version
# pip 9.0.1 ... (python 3.X)
```

If the command above produces an output similar to `pip 9.0.1 ... (python 3.X)`, then we are good to go. If we get `pip 9.0.1 ... (python 2.X)`, then we can try replacing `pip` with `pip3`. If we are unable to find Pip for Python 3 on our machine, we can follow the instructions [here to install Pip](https://pip.pypa.io/en/stable/installing/).

### Installing Flask

We already know what Flask is and its capabilities. Therefore, let's focus on installing it on our machine and testing to see if we can get a basic Flask application running. The first step is to use `pip` to install Flask:

```bash
# we might need to replace pip with pip3
pip install Flask
```

After installing the package, we will create a file called `hello.py` and add five lines of code to it. As we will use this file just to check if Flask was correctly installed, we don't need to nest it in a new directory.

```python
from flask import Flask
app = Flask(__name__)


@app.route("/")
def hello_world():
  return "Hello, World!"
```

These 5 lines of code are everything we need to handle HTTP requests and return a "Hello, World!" message. To run it, we need to export an environment variable called `FLASK_APP` and then execute `flask`:

```bash
# flask depends on this env variable to find the main file
export FLASK_APP=hello.py

# now we just need to ask flask to run
flask run

# * Serving Flask app "hello"
# * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
```

> On Ubuntu, we might need to edit the `$PATH` variable to be able to run flask directly. To do that, let's `touch ~/.bash_aliases` and then `echo "export PATH=$PATH:~/.local/bin" >> ~/.bash_aliases`.

After executing these commands, we can reach our application by opening a browser and navigating to `http://127.0.0.1:5000/` or by issuing `curl http://127.0.0.1:5000/`.

![Hello world with Flask](https://cdn.auth0.com/blog/python-restful/hello-world.jpg)

### Virtual Environments (virtualenv)

Although PyPA—the [Python Packaging Authority group](https://www.pypa.io/en/latest/)—recommends `pip` as the tool for installing Python packages, we will need to use another package to manage our project's dependencies. It's true that `pip` supports [package management through the `requirements.txt` file](https://pip.pypa.io/en/stable/user_guide/#requirements-files), but the tool lacks some features to be used on serious projects running on different production and development machines. Among its issues, the ones that cause the most problems are:

- `pip` installs packages globally, making it hard to manage multiple versions of the same package on the same machine.
- `requirements.txt` need all dependencies and sub-dependencies listed explicitly, a manual process that is tedious and error-prone.

To solve these issues, we are going to use Pipenv. [Pipenv is a dependency manager](https://github.com/kennethreitz/pipenv) that isolates projects on private environments, allowing packages to be installed per project. If you’re familiar with NPM or Ruby’s bundler, it's similar in spirit to those tools.

```bash
pip install pipenv
```

Now, to start creating a serious Flask application, let's create a new directory that will hold our source code. In this article, we will create *Cashman*, a small RESTful API that allows users to manage incomes and expenses. Therefore, we will create a directory called `cashman-flask-project`. After that, we will use `pipenv` to start our project and manage our dependencies.

```bash
# create our project directory and move to it
mkdir cashman-flask-project && cd cashman-flask-project

# use pipenv to create a Python 3 (--three) virtualenv for our project
pipenv --three

# install flask a dependency on our project
pipenv install flask
```

The second command creates our virtual environment, where all our dependencies will be installed, and the third one will add Flask as our first dependency. If we check our project's directory, we will see that two files are created after executing these commands:

1. `Pipfile`, a file that contains details about our project, like the Python version that we are using and the packages that our project needs.
2. `Pipenv.lock,` a file that contains exactly what version of each package our project depends on, and its transitive dependencies.

### Python Modules

Like other mainstream programming languages, [Python also has the concept of modules](https://docs.python.org/3/tutorial/modules.html) to enable developers to organize source code according to subjects/functionalities. Similar to Java packages and C# namespaces, modules in Python are files organized in directories that can be imported by other Python scripts. To create a module on a Python application, we just need to create a folder and add an empty file called `__init__.py` to it.

Let's create our first module on our application. This is going to be our main module, with all our RESTful endpoints. Inside the directory that we created for our application, let's create another one with the same name, `cashman`. The main `cashman-flask-project` directory created before will hold metadata about our project, like what dependencies it has, while this new one will be our module with our Python scripts.

```bash
# create source code's root
mkdir cashman && cd cashman

# create an empty __init__.py file
touch __init__.py
```

Inside the main module, let's create a script called `index.py`. In this script, we will define the first endpoint of our application.

```python
from flask import Flask
app = Flask(__name__)


@app.route("/")
def hello_world():
  return "Hello, World!"
```

Just like in the previous example, our application simply returns a "Hello, world!" message. We will start improving it in a second, but first let's create an executable file called `bootstrap.sh` in the main directory of our application.

```bash
# move to the main directory
cd ..

# create the file
touch bootstrap.sh

# make it executable
chmod +x bootstrap.sh
```

The goal of this file is to facilitate the start up of our application. Its source code will be the following:

```sh
#!/bin/sh
export FLASK_APP=./cashman/index.py
source $(pipenv --venv)/bin/activate
flask run -h 0.0.0.0
```

The first command defines the main script to be executed by Flask, just like we did when we ran the "Hello, world!" application. The second one activates the virtual environment, created by `pipenv`, so our application can find and execute its dependencies. Lastly, we run our Flask application listening to all interfaces on the computer (`-h 0.0.0.0`).

To check that this script is working correctly, we can execute `./bootstrap.sh` now. This will give us a similar result to when we executed the "Hello, world!" application.

```bash
# * Serving Flask app "cashman.index"
# * Running on http://0.0.0.0:5000/ (Press CTRL+C to quit)
```

## <span id="restful-flask"></span> Creating a RESTful Endpoint with Flask

Now that we have our application structured, we can start defining some relevant endpoints. As mentioned before, the goal of our application is to help users to manage incomes and expenses. To get our feet wet, we will start by defining two endpoints to handle incomes. Let's replace the contents of the `./cashman/index.py` file with the following:

```python
from flask import Flask, jsonify, request

app = Flask(__name__)

incomes = [
  { 'description': 'salary', 'amount': 5000 }
]


@app.route('/incomes')
def get_incomes():
  return jsonify(incomes)


@app.route('/incomes', methods=['POST'])
def add_income():
  incomes.append(request.get_json())
  return '', 204
```

Since we are improving our application, we have removed the endpoint that returned "Hello, world!" to users. In its place, we defined an endpoint to handle HTTP `GET` request to return incomes, and another endpoint to handle HTTP `POST` requests to add new incomes. These endpoints are annotated with `@app.route` to define that they listen to requests on the `/incomes` endpoint. [Flask provides a great documentation on what exactly this does](http://flask.pocoo.org/docs/0.12/api/#flask.Flask.route).

Right now, we are manipulating incomes as [dictionaries](https://docs.python.org/3/tutorial/datastructures.html#dictionaries) to facilitate the process. We will soon create classes to represent incomes and expenses.

To interact with both endpoints that we have created, we can start our application and issue some HTTP requests:

```bash
# start the cashman application
./bootstrap.sh &

# get incomes
curl http://localhost:5000/incomes

# add new income
curl -X POST -H "Content-Type: application/json" -d '{
  "description": "lottery",
  "amount": 1000.0
}' http://localhost:5000/incomes

# check if lottery was added
curl localhost:5000/incomes
```

![Interacting with Flask endpoints](https://cdn.auth0.com/blog/python-restful/incomes.jpg)

## <span id="python-classes"></span> Mapping Models with Python Classes

Using dictionaries in a very simple use case like the one above is enough. However, for more complex applications that deal with different entities and have multiple business rules and validations, we might need to encapsulate our data into [Python classes](https://docs.python.org/3/tutorial/classes.html).

To learn the process of mapping entities (like incomes) as classes, we will refactor our application. The first thing that we will do is create a submodule to hold all our entities. Let's create a directory called `model` inside the `cashman` module and add an empty file called `__init__.py` on it.

```bash
# create model directory inside the cashman module
mkdir -p cashman/model

# initialize it as a module
touch cashman/model/__init__.py
```

### Mapping a Python Superclass

Inside this new module/directory, we will create three classes: `Transaction`, `Income`, `Expense`. The first class will be the base for the two others, and we will call it `Transaction`. Let's create a file called `transaction.py` in the `model` directory with the following code:

```python
import datetime as dt

from marshmallow import Schema, fields


class Transaction():
  def __init__(self, description, amount, type):
    self.description = description
    self.amount = amount
    self.created_at = dt.datetime.now()
    self.type = type

  def __repr__(self):
    return '<Transaction(name={self.description!r})>'.format(self=self)


class TransactionSchema(Schema):
  description = fields.Str()
  amount = fields.Number()
  created_at = fields.Date()
  type = fields.Str()
```

Note that besides the `Transaction` class, we also defined a `TransactionSchema`. We will use the latter to deserialize and serialize instances of `Transaction` from and to JSON objects. This class inherits from another superclass called `Schema` that is defined on a package yet to be installed.

```bash
# installing marshmallow as a project dependency
pipenv install marshmallow
```

[Marshmallow is a popular Python package](https://marshmallow.readthedocs.io/en/latest/) for converting complex datatypes, such as objects, to and from native Python datatypes. Basically, we can use this package to validate, serialize, and deserialize data. We won't dive into validation in this article, as it will be the subject of another one. Though, as mentioned, we will use `marshmallow` to serialize and deserialize entities through our endpoints.

### Mapping Income and Expense as Python Classes

To keep things more organized and meaningful, we won't expose the `Transaction` class on our endpoints. We will create two specializations to handle the requests: `Income` and `Expense`. Let's create a file called `income.py` inside the `model` module with the following code:

```python
from marshmallow import post_load

from .transaction import Transaction, TransactionSchema
from .transaction_type import TransactionType


class Income(Transaction):
  def __init__(self, description, amount):
    super(Income, self).__init__(description, amount, TransactionType.INCOME)

  def __repr__(self):
    return '<Income(name={self.description!r})>'.format(self=self)


class IncomeSchema(TransactionSchema):
  @post_load
  def make_income(self, data):
    return Income(**data)
```

The only value that this class adds for our application is that it hardcodes the type of the transaction. This type is a [Python enumerator](https://docs.python.org/3/library/enum.html), which we still have to create, that will help us filter transactions in the future. Let's create another file, called `transaction_type.py`, inside `model` to represent this enumerator:

```python
from enum import Enum


class TransactionType(Enum):
  INCOME = "INCOME"
  EXPENSE = "EXPENSE"
```

The code of the enumerator is quite simple. It just defines a class called `TransactionType` that inherits from `Enum` and that defines two types: `INCOME` and `EXPENSE`.

Lastly, let's create the class that represents expenses. To do that, let's add a new file called `expense.py` inside `model` with the following code:

```python
from marshmallow import post_load

from .transaction import Transaction, TransactionSchema
from .transaction_type import TransactionType


class Expense(Transaction):
  def __init__(self, description, amount):
    super(Expense, self).__init__(description, -abs(amount), TransactionType.EXPENSE)

  def __repr__(self):
    return '<Expense(name={self.description!r})>'.format(self=self)


class ExpenseSchema(TransactionSchema):
  @post_load
  def make_expense(self, data):
    return Expense(**data)
```

Similar to `Income`, this class hardcodes the type of the transaction, but now it passes `EXPENSE` to the superclass. What makes it different is that it forces the  `amount` passed to be negative. Therefore, no matter if the user sends a positive or a negative value, we will store it as negative to facilitate calculations.

## <span id="marshmallow-serilization"></span> Serializing and Deserializing Objects with Marshmallow

With the `Transaction` superclass and its specializations properly implemented, we can now enhance our endpoints to deal with these classes. Let's replace `./cashman/index.py` contents to:

```bash
from flask import Flask, jsonify, request

from cashman.model.expense import Expense, ExpenseSchema
from cashman.model.income import Income, IncomeSchema
from cashman.model.transaction_type import TransactionType

app = Flask(__name__)

transactions = [
  Income('Salary', 5000),
  Income('Dividends', 200),
  Expense('pizza', 50),
  Expense('Rock Concert', 100)
]


@app.route('/incomes')
def get_incomes():
  schema = IncomeSchema(many=True)
  incomes = schema.dump(
    filter(lambda t: t.type == TransactionType.INCOME, transactions)
  )
  return jsonify(incomes.data)


@app.route('/incomes', methods=['POST'])
def add_income():
  income = IncomeSchema().load(request.get_json())
  transactions.append(income.data)
  return "", 204


@app.route('/expenses')
def get_expenses():
  schema = ExpenseSchema(many=True)
  expenses = schema.dump(
      filter(lambda t: t.type == TransactionType.EXPENSE, transactions)
  )
  return jsonify(expenses.data)


@app.route('/expenses', methods=['POST'])
def add_expense():
  expense = ExpenseSchema().load(request.get_json())
  transactions.append(expense.data)
  return "", 204


if __name__ == "__main__":
    app.run()
```

The new version that we just implemented starts by redefining the `incomes` variable into a list of `Expenses` and `Incomes`, now called `transactions`. Besides that, we have also changed the implementation of both methods that deal with incomes. For the endpoint used to retrieve incomes, we defined an instance of `IncomeSchema` to produce JSON representation of incomes. We also used [`filter`](https://docs.python.org/3/library/functions.html#filter) to extract incomes only from the `transactions` list. In the end we send the array of JSON incomes back to users.

The endpoint responsible for accepting new incomes was also refactored. The change on this endpoint was the addition of `IncomeSchema` to load an instance of `Income` based on the JSON data sent by the user. As the `transactions` list deals with instances of `Transaction` and its subclasses, we just added the new `Income` in that list.

The other two endpoints responsible for dealing with expenses, `get_expenses` and `add_expense`, are almost copies of their `income` counterparts. The differences are:

- instead of dealing with instances of `Income`, we deal with instances of `Expense` to accept new expenses,
- and instead of filtering by `TransactionType.INCOME` we filter by `TransactionType.EXPENSE`, to send expenses back to the user.

This finishes the implementation of our API. If we run our Flask application now, we will be able to interact with the endpoints, as shown here:

```bash
# start the application
./bootstrap.sh &

# get expenses
curl http://localhost:5000/expenses

# add a new expense
curl -X POST -H "Content-Type: application/json" -d '{
    "amount": 20,
    "description": "lottery ticket"
}' http://localhost:5000/expenses

# get incomes
curl http://localhost:5000/incomes

# add a new income
curl -X POST -H "Content-Type: application/json" -d '{
    "amount": 300.0,
    "description": "loan payment"
}' http://localhost:5000/incomes
```

## <span id="flask-on-docker"></span> Dockerizing Flask Applications

As we are planning to eventually release our API in the cloud, we are going to create a `Dockerfile` to describe what is needed to run the application on a Docker container. We need to [install Docker on our development machine](https://docs.docker.com/engine/installation/) to test and run dockerized instances of our project. Defining a Docker recipe (`Dockerfile`) will help us run the API on different environments. That is, in the future, we will also install Docker and run our program on environments like [production](https://en.wikipedia.org/wiki/Deployment_environment#Production) and [staging](https://en.wikipedia.org/wiki/Deployment_environment#Staging).

Let's create the `Dockerfile` in the root directory of our project with the following code:

```bash
# Using lightweight alpine image
FROM python:3.6-alpine

# Installing packages
RUN apk update
RUN pip install --no-cache-dir pipenv

# Defining working directory and adding source code
WORKDIR /usr/src/app
COPY Pipfile Pipfile.lock bootstrap.sh ./
COPY cashman ./cashman

# Install API dependencies
RUN pipenv install

# Start app
EXPOSE 5000
ENTRYPOINT ["/usr/src/app/bootstrap.sh"]
```

The first item in the recipe defines that we are going to create our Docker container based on the default [Python 3 Docker image](https://hub.docker.com/_/python/). After that, we update APK and install `pipenv`. Having `pipenv`, we define the working directory that we will use in the image, and we copy the code needed to bootstrap and run the application. In the fourth step, we use `pipenv` to install all our Python dependencies. Lastly, we define that our image will communicate through port `5000` and that this image, when executed, needs to run the `bootstrap.sh` script to start Flask.

To create and run a Docker container based on the `Dockerfile` that we created, we can execute the following commands:

```bash
# build the image
docker build -t cashman .

# run a new docker container named cashman
docker run --name cashman \
    -d -p 5000:5000 \
    cashman

# fetch incomes from the dockerized instance
curl http://localhost:5000/incomes/
```

The `Dockerfile` is simple but effective, and using it is similarly easy. With these commands and this `Dockerfile`, we can run as many instances of our API as we need with no trouble. It's just a matter of defining another port on the host, or even another host.

{% include asides/python.markdown %}

## <span id="next-steps"></span> Next Steps

In this article we learned about the basic components needed to develop a well structured Flask application. We took a look on how to use `pipenv` to manage the dependencies of our API. After that, we installed and used Flask and Marshmallow to create endpoints capable of receiving and sending JSON responses. In the end we also took a look at how to dockerize the API, which will facilitate the release of the application to the cloud.

Although well structured, our API is not that useful yet. Among the things that we can improve, we are going to cover the following topics in the next article:

- Database persistence with SQLAlchemy
- Global Exception Handling
- Internationalization (i18n)
- Security with JWTs

Stay tuned!
