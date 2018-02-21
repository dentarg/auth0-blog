---
layout: post
title: "Using Python, Flask, and Angular to Build Modern Web Apps - Part 1"
description: "In this series, you will learn how to create modern web applications with Python, Flask, and Angular."
longdescription: "In this series, you will learn how to create modern web applications with Python, Flask, and Angular. You will create an SPA and a backend API to expose exams and questions so users can test their knowledge regarding different technologies."
date: 2018-02-21 08:30
category: Technical Guide, Python
author:
  name: "Bruno Krebs"
  url: "https://twitter.com/brunoskrebs"
  mail: "bruno.krebs@gmail.com"
  avatar: "https://twitter.com/brunoskrebs/profile_image?size=original"
design:
  bg_color: "#4A4A4A"
  image: https://cdn.auth0.com/blog/python-restful/logo.png
tags:
- python
- flask
- sqlalchemy
- angular
- typescript
- auth0
related:
- 2017-09-28-developing-restful-apis-with-python-and-flask
- 2017-11-09-sqlalchemy-orm-tutorial-for-python-developers
---

**TL;DR:** In this series, you will learn how to create modern web applications with Python, Flask, and Angular. You will use this stack to build an SPA and a backend API to expose exams and questions so users can test their knowledge regarding different technologies. [In this GitHub repository](https://github.com/auth0-blog/online-exam/), you can find the final code created throughout the first part of the series.

---

## What You Will Build

In this series, you will use Python, Flask, and Angular to build a web application based on a modern architecture. With Angular, you will build a SPA (Single Page App) that allows users to browse through exams and questions. These users, when authenticated, will be able to test their knowledge regarding a specific topic by choosing one of the multiple choices that a question exposes. Then, when your users submit their answers, your backend will check if they are right or wrong, record the result, and send back this result to users.

As you are looking forward to build a modern web application, you will use Auth0 as [the identity management system of your app](https://auth0.com/learn/cloud-identity-access-management/). You will also persist all exams, questions, alternatives, and results on a database.

## Why Python, Flask, and Angular

[As StackOverflow recently analyzed](https://stackoverflow.blog/2017/09/06/incredible-growth-python/), Python is one of the fastest-growing programming languages, having surpassed even Java on the number of questions asked on the platform. Besides that, the language is also showing mass adoption on GitHub. On this platform, Python occupied [the second position on the number of pull requests opened in 2017](https://octoverse.github.com/).

When it comes to developing web applications with Python, you will have to choose between two popular frameworks: [Django](https://github.com/django/django) or [Flask](https://github.com/pallets/flask). Django is more mature and a little bit more popular than Flask. However, Flask has its strengths too. From the beginning, Flask was built to be scalable and simple to start with. Applications built with Flask are clearly lighter when compared to Django counterparts. As such, Python developers usually refer to Flask as a microframework.

For the frontend application, you will use Angular as this is one of the most popular frameworks around. To learn about advantages of this framework, [you can check this nice page on Rangle.io](https://angular-2-training-book.rangle.io/handout/why_angular_2.html). As stated by this page, Angular provides developers with the tools needed to build and structure large-scale JavaScript applications. Besides that, Angular has some big advantages over some alternatives. For example, Angular is built and supported by Google engineers. Alongside with these engineers, there are a huge community ready to help you with issues when the time comes.

As you can see, by choosing Python, Flask, and Angular to build web applications, you can rest assured that you will always be able to rely on great and thriving communities to support you.

{% include tweet_quote.html quote_text="Python, Flask, and Angular form a great stack to build modern web applications." %}

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
    python_exam = Exam("SQLAlchemy Exam", "Test your knowledge about SQLAlchemy.", "script")
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
  "title": "TypeScript Advanced Exam",
  "description": "Tricky questions about TypeScript."
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

As your Flask app will receive requests from an SPA, you will need to [allow CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) on it. If you don't do so, most browsers will block requests to your API because the backend does not explicitly allow *Cross-Origin Resource Sharing* (CORS).

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
git add . && git commit -m "enabling CORS"

# run the Flask app in the background
./bootstrap.sh &
```

## Bootstrapping the Angular Application

To create your Angular application, you will use the `ng` tool (made available by the Angular CLI). So, move back to the project root directory and issue `ng new frontend`. This will create the basic structure of an Angular app. The following snippet summarizes the commands to create your app and commit it untouched to you Git repository:

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

### Consuming Flask Endpoints with Angular

After that, the first thing you will do is to create a file called `env.ts` inside the `./frontend/src/app` directory with the following code:

```typescript
export const API_URL = 'http://localhost:5000';
```

For now, this TypeScript module simply exports a single constant (`API_URL`) that references your Flask backend application running locally. In the third part of this series, you will enhance this module to define different `API_URL` values depending on the environment.

Then, you can create a new directory called `exams` inside `./frontend/src/app` to hold files related to this entity. In this directory, you will create two files: `exam.model.ts` and `exams-api.service.ts`. The first file (`exam.model.ts`) will have a TypeScript class to represent exams:

```typescript
export class Exam {
  constructor(
    public title: string,
    public description: string,
    public _id?: number,
    public updatedAt?: Date,
    public createdAt?: Date,
    public lastUpdatedBy?: string,
  ) { }
}
```

And the `exams-api.service.ts` file will create a service that uses `HttpClient` to fetch exams from your Flask backend application:

```typescript
import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import {API_URL} from '../env';
import {Exam} from './exam.model';

@Injectable()
export class ExamsApiService {

  constructor(private http: HttpClient) {
  }

  private static _handleError(err: HttpErrorResponse | any) {
    return Observable.throw(err.message || 'Error: Unable to complete request.');
  }

  // GET list of public, future events
  getExams(): Observable<Exam[]> {
    return this.http
      .get(`${API_URL}/exams`)
      .catch(ExamsApiService._handleError);
  }
}
```

As this service depends on `HttpClient`, you will need to import `HttpClientModule` from Angular in your `AppModule` declaration. Besides that, you will have to register `ExamsApiService` as a `provider`. So, open the `./frontend/src/app/app.module.ts` file and replace its contents with this:

```typescript
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {ExamsApiService} from './exams/exams-api.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
  ],
  providers: [ExamsApiService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
```

Now, you will have to update the `./frontend/src/app/app.component.ts` file to use your new service to fetch data from your Flask app:

```typescript
import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {ExamsApiService} from './exams/exams-api.service';
import {Exam} from './exams/exam.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'app';
  examsListSubs: Subscription;
  examsList: Exam[];

  constructor(private examsApi: ExamsApiService) {
  }

  ngOnInit() {
    this.examsListSubs = this.examsApi
      .getExams()
      .subscribe(res => {
          this.examsList = res;
        },
        console.error
      );
  }

  ngOnDestroy() {
    this.examsListSubs.unsubscribe();
  }
}
```

And you will have to update its template (`app.component.html`) to show the exams fetched:

{% highlight html %}
{% raw %}
<div style="text-align:center">
  <h1>Exams</h1>
</div>
<h2>Here are the exams created so far: </h2>
<ul>
  <li *ngFor="let exam of examsList">
    {{exam.title}}
  </li>
</ul>
{% endraw %}
{% endhighlight %}

Now, you can run your Angular application (run `ng serve` on the `frontend` directory) to check if everything is working. After Angular finishes compiling your app, you can browse to [`http://localhost:4200`](http://localhost:4200). There, you will see a page similar to this:

![Using Angular to fetch data from a Flask application](https://cdn.auth0.com/blog/flask-angular/fetching-data.png)

Before moving on, don't forget to save your progress:

```bash
git add .
git commit -m "integrating Flask and Angular"
```

## Identity Management and Security with Auth0

Advantages of using Auth0

### Creating the Auth0 API

### Creating the Auth0 Client

## Conclusion and Next Steps

What we have done so far and what we will do in the next article.
