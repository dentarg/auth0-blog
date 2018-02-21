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

**TL;DR:** A brief synopsis that includes link to a [github repo](http://www.github.com/).

---

## Dependencies

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

from datetime import date
from sqlalchemy import create_engine, Column, String, Integer, Date
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
    created_at = Column(Date)
    updated_at = Column(Date)
    last_updated_by = Column(String)

    def __init__(self, created_by):
        self.created_at = date.today()
        self.updated_at = date.today()
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
