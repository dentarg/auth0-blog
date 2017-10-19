---
layout: post
title: "SQLAlchemy ORM Tutorial for Python Developers"
description: "Let's learn how to use SQLAlchemy to persist and query data on Python applications."
date: 2017-10-17 09:03
category: Technical Guide, Python, SQLAlchemy
author:
  name: "Bruno Krebs"
  url: "https://twitter.com/brunoskrebs"
  mail: "bruno.krebs@auth0.com"
  avatar: "https://www.gravatar.com/avatar/76ea40cbf67675babe924eecf167b9b8?s=60"
design:
  bg_color: "#563FB8"
  image: https://cdn.auth0.com/blog/graphic-cards-use-case/logo.png
tags:
- python
- sqlalchemy
- orm
- object-relational-mapping
- sql
- flask
- persistence
- data
- database
- auth0
related:
- 2017-09-28-developing-restful-apis-with-python-and-flask
- 2017-04-20-image-processing-in-python-with-pillow
---

## SQLAlchemy Introduction

### Python DBAPI

The [Python DBAPI (acronym for DataBase API)](https://www.python.org/dev/peps/pep-0249/) was created to specify how Python modules that interact with databases should expose their interfaces. Although we won't interact with this API directly—we will use SQLAlchemy as a facade to it—it's good to know that it defines how common functions like `connect`, `close`, `commit`, and `rollback` must behave. This means that, whenever we use a Python module that adheres to the specification, we can rest assured that we will find these functions and that they will behave as expected.

In this article, we are going to install and use the most popular PostgreSQL DBAPI implementation available: [`psycopg`](http://initd.org/psycopg/). [There are other Python drivers that communicate with PostgreSQL](https://wiki.python.org/moin/PostgreSQL) as well, but `psycopg` is the best candidate since it fully implements the DBAPI specification and has a great support from the community.

To better understand the DBAPI specification, what functions it requires, and how these functions behave, take a look [into the Python Enhancement Proposal that introduced it](https://www.python.org/dev/peps/pep-0249/). Also, to learn about what other database engines we can use (like MySQL or Oracle), [take a look at the official list of database interfaces available](https://wiki.python.org/moin/DatabaseInterfaces).

### SQLAlchemy Engines

Whenever we want to use SQLAlchemy to interact with a database, we need to create an *Engine*. Engines, on SQLAlchemy, are used to manage two important factors: *Pools* and *Dialects*. The following two sections will provide an explanation of what these two concepts are, but for now it suffices to say that SQLAlchemy uses them to interact with DBAPI functions.

To create an engine and start interacting with databases, we have to import the `create_engine` function from the `sqlalchemy` library and issue a call to it:

```python
from sqlalchemy import create_engine
engine = create_engine('postgresql://dbuser:dbpassword@localhost:5431/sqlalchemy-orm-tutorial')
```

This example creates a PostgreSQL engine to communicate with an instance running locally on port `5432` (the default one). It also defines that it will use `dbuser` and `dbpassword` as the credentials to interact with the `sqlalchemy-orm-tutorial` database. Note that, creating an engine does *not* connect to the database instantly. This process is postponed to when it's really needed (like when we submit a query, or when create/update a row in a table).

Since SQLAlchemy relies on the DBAPI specification to interact with databases, the most common database management systems available are supported. PostgreSQL, MySQL, Oracle, Microsoft SQL Server, and SQLite are all examples of engines that we can use along side with SQLAlchemy. [To learn more about the options available to create SQLAlchemy engines, take a look into the official documentation](http://docs.sqlalchemy.org/en/rel_1_1/core/engines.html).

### SQLAlchemy Connection Pools

http://docs.sqlalchemy.org/en/rel_1_1/core/pooling.html

QueuePool

Characteristics: none of them "pre create" connections

- pool_size
- max_overflow
- pool_recycle
- pool_timeout

### SQLAlchemy Dialects

### SQLAlchemy Sessions

http://docs.sqlalchemy.org/en/rel_1_1/orm/session_basics.html

Keep in mind, the Session is just a workspace for your objects, local to a particular database connection - if you think of an application thread as a guest at a dinner party, the Session is the guest’s plate and the objects it holds are the food (and the database…the kitchen?)!

The Session begins in an essentially stateless form. Once queries are issued or other objects are persisted with it, it requests a connection resource from an Engine that is associated either with the Session itself or with the mapped Table objects being operated upon. This connection represents an ongoing transaction, which remains in effect until the Session is instructed to commit or roll back its pending state.

## SQLAlchemy ORM

### SQLAlchemy Data Types

### SQLAlchemy Relationship Patterns

SQLAlchemy supports four types of relationship between classes: [One To Many](http://docs.sqlalchemy.org/en/latest/orm/basic_relationships.html#one-to-many), [Many To One](http://docs.sqlalchemy.org/en/latest/orm/basic_relationships.html#many-to-one), [One To One](http://docs.sqlalchemy.org/en/latest/orm/basic_relationships.html#one-to-one), and [Many To Many](http://docs.sqlalchemy.org/en/latest/orm/basic_relationships.html#many-to-many).

The first type, *One To Many*, is used to mark that an instance of a class can be associated with many instances of another class. For example, on a blog engine, an instance of the `Article` class could be associated with many instances of the `Comment` class. In this case, we would map the mentioned classes and its relation as follows:

```python
class Article(Base):
    __tablename__ = 'articles'
    id = Column(Integer, primary_key=True)
    comments = relationship("Comment")


class Comment(Base):
    __tablename__ = 'comments'
    id = Column(Integer, primary_key=True)
    article_id = Column(Integer, ForeignKey('article.id'))
```

The second type, *Many To One*, refers to the same relationship describe above but from the other perspective. To give a different example, let's say that we want to map the relationship between instances of `Tire` to an instance of a `Car`. As many tires belong to one car and this car contains many tires, we would map this relation as follows:

```python
class Tire(Base):
    __tablename__ = 'tires'
    id = Column(Integer, primary_key=True)
    car_id = Column(Integer, ForeignKey('car.id'))
    car = relationship("Car")


class Car(Base):
    __tablename__ = 'cars'
    id = Column(Integer, primary_key=True)
```

The third type, *One To One*, refers to relationships where an instance of a particular class may only be associated with one instance of another class, and vice versa. As an example, consider the relationship between a `Person` and a `MobilePhone`. Usually, one person possesses one mobile phone and this mobile phone belongs to this person only. To map this relationship on SQLAlchemy, we would create the following code:

```python
class Person(Base):
    __tablename__ = 'people'
    id = Column(Integer, primary_key=True)
    mobile_phone = relationship("Mobile", uselist=False, back_populates="person")

class MobilePhone(Base):
    __tablename__ = 'mobile_phones'
    id = Column(Integer, primary_key=True)
    person_id = Column(Integer, ForeignKey('person.id'))
    person = relationship("People", back_populates="mobile_phone")
```

In this example, we pass two extra parameters to the `relationship` function. The first one, `uselist=False`, makes SQLAlchemy understand that `mobile_phone` will hold only a single instance and not an array (multiple) of instances. The second one, `back_populates`, instructs SQLAlchemy to populate the other side of the mapping. The [official Relationships API documentation](http://docs.sqlalchemy.org/en/latest/orm/relationship_api.html) provides a complete explanation of these parameters and also covers other parameters not mentioned here.

The last type supported by SQLAlchemy, *Many To Many*, is used when instances of a particular class can have zero or more associations to instances of another class. For example, let's say that we are mapping the relationship of instances of `Student` and instances of `Class` in a system that manages a school. As many students can participate in many classes, we would map the relationship as follows:

```python
students_classes_association = Table('students_classes', Base.metadata,
    Column('student_id', Integer, ForeignKey('student.id')),
    Column('class_id', Integer, ForeignKey('class.id'))
)

class Student(Base):
    __tablename__ = 'students'
    id = Column(Integer, primary_key=True)
    classes = relationship("Class", secondary=students_classes_association)

class Class(Base):
    __tablename__ = 'classes'
    id = Column(Integer, primary_key=True)
```

In this case, we had to create a helper table to persist the association between instances of `Student` and instances of `Class`, as this wouldn't be possible without an extra table. Note that, to make SQLAlchemy aware of the helper table, we passed it in the `secondary` parameter of the `relationship` function.

The above code snippets show just a subset of the mapping options available on SQLAlchemy. In the following sections, we are going to take a deeper look into each one of the available relationship patterns. Besides that, [the official documentation is a great reference to learn more about relationship patterns on SQLAlchemy](http://docs.sqlalchemy.org/en/latest/orm/basic_relationships.html).

## SQLAlchemy in Practice

### What Will We Build

### Cloning Project

### Running PostgreSQL

### Installing SQLAlchemy Dependencies

### Mapping Classes with SQLAlchemy

### Persisting Data with SQLAlchemy

### Querying Data with SQLAlchemy

## Securing Python APIs with Auth0

## Next Steps
