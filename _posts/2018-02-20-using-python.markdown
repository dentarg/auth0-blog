---
layout: post
title: "Using Python, Flask, and Angular to Build Modern Apps"
description: "<A SHORT DESCRIPTION OF THE POST <= 200 CHARACTERS >"
longdescription: "<A LONG DESCRIPTION OF THE POST BETWEEN 230 AND 320 CHARACTERS>"
date: 2018-02-20 20:22
category: Technical Guide
press_release: <true|false (FOR FALSE YOU COULD ALSO REMOVE THIS LINE)>
is_non-tech: <true|false (FOR FALSE YOU COULD ALSO REMOVE THIS LINE)>
author:
  name: <YOUR NAME>
  url: <YOUR URL>
  mail: <YOUR MAIL>
  avatar: <LINK TO PROFILE PIC>
design:
  bg_color: <A HEX BACKGROUND COLOR>
  image: <A PATH TO A 200x200 IMAGE>
tags:
- foo
related:
- <ADD SOME RELATED POSTS FROM AUTH0'S BLOG>
---

**TL;DR:** A brief synopsis that includes link to a [GitHub repo](http://www.github.com/).

---

## Dependencies

This section is divided into two subsections to highlight what are the environment dependencies from the backend and the frontend perspective.

### Backend Dependencies

An up to date version of Python 3.

The [`pipenv`](https://github.com/pypa/pipenv) tool:

```bash
# depending on the environment, you will have to use
# pip3 instead of pip (just once)
pip install pipenv
```

PostgreSQL (could be on cloud, local, Dockerized, or whatever):

```bash
docker run --name online-exam-db \
    -p 5432:5432 \
    -e POSTGRES_DB=online-exam \
    -e POSTGRES_PASSWORD=0NLIN3-ex4m \
    -d postgres
```

### Frontend Dependencies

As you are going to use Angular to create your frontend application, you will need Node.js and NPM installed on your machine. You can install both tools simultaneously by downloading and executing an installer (choose one based on your operating system) from [the Node.js download page](https://nodejs.org/en/download/). Another alternative is to use a tool like [NVM](https://github.com/creationix/nvm) to manage multiple active `node` versions (on a development machine, this is probably the best option).

Whichever installation method you choose, make sure you are using an up to date version of Node.js (i.e. `>= 8`).

After properly installing both tools, you can use `npm` to install [the Angular CLI tool](https://github.com/angular/angular-cli). You will use this CLI (Command Line Interface) to bootstrap the frontend app, start a development server, and [to create Angular `components`, `services`, etc](https://github.com/angular/angular-cli#generating-components-directives-pipes-and-services). Use the following command to install Angular CLI:

```bash
npm install -g @angular/cli
```

## Bootstrapping the Python Application

```bash
mkdir online-exam

cd online-exam

git init

mkdir backend

cd backend

# initialize the virtual environment
pipenv --three
```

As you are a responsible developer and is using Git to backup your code, you will probably want to ignore some files. Therefore, create a file called `.gitignore` in the project root directory and copy [the rules from this URL](https://raw.githubusercontent.com/auth0-blog/online-exam/master/.gitignore) to it.

### Managing Entities with SQLAlchemy ORM

```bash
# install sqlalchemy and psycopg2 on the venv
pipenv install sqlalchemy psycopg2-binary

mkdir -p src/entities

touch src/__init__.py

touch src/entities/__init__.py

touch src/entities/entity.py
```

```python
# coding=utf-8

from datetime import datetime
from sqlalchemy import create_engine, Column, String, Integer, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

db_url = 'localhost:5432'
db_name = 'online-exam'
db_user = 'postgres'
db_password = '0NLIN3-ex4m'
engine = create_engine(f'postgresql://{db_user}:{db_password}@{db_url}/{db_name}')
Session = sessionmaker(bind=engine)

Base = declarative_base()


class Entity():
    id = Column(Integer, primary_key=True)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
    last_updated_by = Column(String)

    def __init__(self, created_by):
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
        self.last_updated_by = created_by
```

```bash
touch src/entities/exam.py
```

```python
# coding=utf-8

from sqlalchemy import Column, String

from .entity import Entity, Base


class Exam(Entity, Base):
    __tablename__ = 'exams'

    title = Column(String)
    description = Column(String)

    def __init__(self, title, description, created_by):
        Entity.__init__(self, created_by)
        self.title = title
        self.description = description
```

```bash
touch src/main.py
```

```python
# coding=utf-8

from .entities.entity import Session, engine, Base
from .entities.exam import Exam

# generate database schema
Base.metadata.create_all(engine)

# start session
session = Session()

# check for existing data
exams = session.query(Exam).all()

if len(exams) == 0:
    # create and persist dummy exam
    python_exam = Exam("SQLAlchemy Exam", "Test your knowledge about SQLAlchemy", "script")
    session.add(python_exam)
    session.commit()
    session.close()

    # reload exams
    exams = session.query(Exam).all()

# show existing exams
print('### Exams:')
for exam in exams:
    print(f'({exam.id}) {exam.title} - {exam.description}')
```

```bash
# activate virtual environment
pipenv shell

# run main module
python -m src.main
```

This might be a good time to save your progress:

```bash
git add . && git commit -m "adding SQLAlchemy and some entities"
```

### Managing HTTP Requests with Flask

```bash
pipenv install flask marshmallow
```

Update the `./src/entities/exam.py` file as such:

```python
# coding=utf-8

from marshmallow import Schema, fields

# ... other import statements ...

# ... Exam class definition ...

class ExamSchema(Schema):
    id = fields.Number()
    title = fields.Str()
    description = fields.Str()
    created_at = fields.DateTime()
    updated_at = fields.DateTime()
    last_updated_by = fields.Str()
```

Then, replace the contents of the `./src/main.py` file with the following code:

```python
# coding=utf-8

from flask import Flask, jsonify, request

from .entities.entity import Session, engine, Base
from .entities.exam import Exam, ExamSchema

# creating the Flask application
app = Flask(__name__)

# if needed, generate database schema
Base.metadata.create_all(engine)


@app.route('/exams')
def get_exams():
    # fetching from the database
    session = Session()
    exam_objects = session.query(Exam).all()

    # transforming into JSON-serializable objects
    schema = ExamSchema(many=True)
    exams = schema.dump(exam_objects)

    # serializing as JSON
    session.close()
    return jsonify(exams.data)


@app.route('/exams', methods=['POST'])
def add_exam():
    # mount exam object
    posted_exam = ExamSchema(only=('title', 'description'))\
        .load(request.get_json())

    exam = Exam(**posted_exam.data, created_by="HTTP post request")

    # persist exam
    session = Session()
    session.add(exam)
    session.commit()

    # return created exam
    new_exam = ExamSchema().dump(exam).data
    session.close()
    return jsonify(new_exam), 201
```

This creates a Flask application, based on SQLAlchemy and PostgreSQL, that is capable of accepting `POST` requests to create new instances of `exam` and capable of accepting `GET` requests to serialize these instances as a JSON array.

To easily run this application, you will create a script called `bootstrap.sh` in the `backend` directory with the following code:

```bash
#!/bin/bash
export FLASK_APP=./src/main.py
source $(pipenv --venv)/bin/activate
flask run -h 0.0.0.0
```

This script does three things:

1. it sets `./src/main.py` as the value of the `FLASK_APP` environment variable;
2. it activates the virtual environment;
3. and runs `flask` listening on all interfaces (`-h 0.0.0.0`).

Then, to test everything, you can use the following commands:

```bash
# make script executable
chmod u+x bootstrap.sh

# execute script in the background
./bootstrap.sh &

# create a new exam
curl -X POST -H 'Content-Type: application/json' -d '{
  "title": "Some Exam Title",
  "description": "The description of this exam."
}' http://0.0.0.0:5000/exams

# retrieve exams
curl http://0.0.0.0:5000/exams
```

Also, you can check the result of the `POST` request by browsing to [`http://0.0.0.0:5000/exams`](http://0.0.0.0:5000/exams).

As you have made some good progress, it's better to save everything:

```bash
git add . && git commit -m "integrating Flask RESTful endpoints and SQLAlchemy"
```

### Handling CORS on Flask Apps

As your Flask app will receive requests from an SPA (Single Page App), you will need to [allow CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) on it. If you don't do so, most browsers will block requests to your API because the backend does not explicitly allow *Cross-Origin Resource Sharing* (CORS).

Luckily, there is a Flask module called `flask-cors` that is easy to configure. So, to install this module, issue the following command in your `backend` directory:

```bash
pipenv install flask-cors
```

Then, update the `main.py` file to take advantage of this module:

```python
# coding=utf-8

from flask_cors import CORS
# ... other import statements ...

# creating the Flask application
app = Flask(__name__)
CORS(app)

# ... create_all(engine) and endpoint definitions ...
```

Without any further configuration, `flask-cors` allows CORS for all domains on all routes. During the development process, this configuration will be enough. However, in the future, you will probably want to be more restrictive. When the day comes, [check the official documentation of the `flask-cors` module](http://flask-cors.readthedocs.io/en/latest/#resource-specific-cors) to learn how to tweak these settings.

Now, before switching to Angular, you can save your progress and leave your Flask application up and running:

```bash
# commit your progress
git add . git commit -m "enabling CORS"

# run the Flask app in the background
./bootstrap.sh &
```

## Bootstrapping the Angular Application

To create your Angular application, you will use the `ng` tool (made available by the Angular CLI). So, move back to the project root directory and issue `ng new frontend`. This will create the basic structure of an Angular app. The following commands do this and commit the app untouched to you Git repository:

```bash
# change working directory to project root
cd ..

# run @angular/cli to bootstrap the Angular app
ng new frontend

# move working directory to your frontend app
cd frontend

# commit template Angular project
git add . && git commit -m "bootstrapping an Angular project"
```
