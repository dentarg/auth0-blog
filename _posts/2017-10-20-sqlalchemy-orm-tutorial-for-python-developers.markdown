---
layout: post
title: "SQLAlchemy ORM Tutorial for Python Developers"
description: "Let's learn how to use SQLAlchemy to persist and query data on Python applications."
date: 2017-10-20 08:00
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

**TL;DR:** In this article, we will learn how to use SQLAlchemy as the ORM (Object Relational Database) library to communicate with relational database engines. First, we will learn about some core concepts of SQLAlchemy (like engines and connection pools), then we will learn how to map Python classes and its relationships to database tables, and finally we will learn how to retrieve (query) data from these tables. [The code snippets used in this article can be found in this GitHub repository](https://github.com/auth0/node-jwks-rsa/releases/tag/1.2.1).

## SQLAlchemy Introduction

SQLAlchemy is a library that facilitates the communication between Python programs and databases. Most of the times, this library is used as an [Object Relational Mapper (ORM)](https://en.wikipedia.org/wiki/Object-relational_mapping) tool that translates Python classes to tables on relational databases and that automatically converts function calls to SQL statements. SQLAlchemy provides a standard interface that allows developers to create database-agnostic code to communicate with a wide variety of database engines.

As we will see in this article, SQLAlchemy relies on common design patterns (like [Object Pools](https://sourcemaking.com/design_patterns/object_pool)) to allow developers to easily create and ship enterprise-grade, production-ready applications. Besides that, with SQLAlchemy, boilerplate code to handle tasks like database connections is abstracted away to let developers focus on business logic.

Before diving in the ORM features provided by SQLAlchemy, we need to learn how the core works. The following sections will introduce important concepts that every Python developer needs to understand before dealing with SQLAlchemy applications.

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

Connection pooling is one of the most traditional implementations of the [object pool pattern](https://sourcemaking.com/design_patterns/object_pool). Object pools are used as caches of pre-initialized objects ready to use. That is, instead of spending time to create objects that are frequently needed (like connections to databases) the program fetches an existing object from the pool, uses it as desired, and puts back when done.

The main reason why programs take advantage of this design pattern is to improve performance. In the case of database connections, opening and maintaining a connection is expensive, time-consuming, and wastes resources. Besides that, this pattern allows easier management of the number of connections that an application might use simultaneously.

[There are various implementations of the connection pool pattern available on SQLAlchemy ](http://docs.sqlalchemy.org/en/rel_1_1/core/pooling.html#api-documentation-available-pool-implementations). For example, creating an `Engine` through the `create_engine()` function usually generates a [QueuePool](http://docs.sqlalchemy.org/en/rel_1_1/core/pooling.html#sqlalchemy.pool.QueuePool). This kind of pool comes configured with some reasonable defaults, like a maximum pool size of 5 connections.

As usually production-ready programs need to override these defaults (to fine-tune pools to their needs), most of the different implementations of connection pools provide a similar set of configuration options. The following list shows the most common options with their descriptions:

- `pool_size`: Sets the number of connections that the pool will handle.
- `max_overflow`: Specifies how many exceeding connections (relative to `pool_size`) the pool supports.
- `pool_recycle`: Configures the maximum age (in seconds) of connections in the pool.
- `pool_timeout`: Identifies how many seconds the program will wait before giving up on getting a connection from the pool.

[To learn more about connection pools on SQLAlchemy, check out the official documentation](http://docs.sqlalchemy.org/en/rel_1_1/core/pooling.html).

### SQLAlchemy Dialects

As SQLAlchemy is a facade that enables Python developers to create applications that communicate to different database engines through the same API, we need to make use of *Dialects*. Most of the popular relational databases available out there adhere to the SQL (Structured Query Language) standard, but they also introduce proprietary variations. These variations are the solely responsible for the existence of dialects.

For example, let's say that we want to fetch the first 10 rows of a table called `people`. If our data was being held by a Microsoft SQL Server database engine, SQLAlchemy would need to issue the following query:

```sql
SELECT TOP 10 * FROM people;
```

But, if our data was persisted on MySQL instance, then SQLAlchemy would need to issue:

```sql
SELECT * FROM people LIMIT 10;
```

Therefore, to know exactly what query to issue, SQLAlchemy needs to know the type of the database that it is dealing with. This is exactly what *Dialects* do, they make SQLAlchemy aware of the dialect it needs to talk.

On its core, SQLAlchemy includes the following list of dialects:

- [Firebird](http://docs.sqlalchemy.org/en/latest/dialects/firebird.html)
- [Microsoft SQL Server](http://docs.sqlalchemy.org/en/latest/dialects/mssql.html)
- [MySQL](http://docs.sqlalchemy.org/en/latest/dialects/mysql.html)
- [Oracle](http://docs.sqlalchemy.org/en/latest/dialects/oracle.html)
- [PostgreSQL](http://docs.sqlalchemy.org/en/latest/dialects/postgresql.html)
- [SQLite](http://docs.sqlalchemy.org/en/latest/dialects/sqlite.html)
- [Sybase](http://docs.sqlalchemy.org/en/latest/dialects/sybase.html)

Dialects for other database engines, like [Amazon Redshift](https://pypi.python.org/pypi/sqlalchemy-redshift), are supported as external projects, but can be easily installed. [Check out the official documentation on SQLAlchemy Dialects to learn more](http://docs.sqlalchemy.org/en/latest/dialects/).

## SQLAlchemy ORM

ORM, which stands for *Object Relational Mapper*, is the specialization of the [*Data Mapper* design pattern](https://martinfowler.com/eaaCatalog/dataMapper.html) that addresses relational databases like MySQL, Oracle, and PostgreSQL. As explained by Martin Fowler in the article, *Mappers* are responsible for moving data between objects and a database while keeping them independent of each other. As object-oriented programming languages and relational databases structure data on different ways, we need specialized code to translate from one schema to the other.

For example, on a programming language like Python we can create a `Product` class and an `Order` class to relate as many instances as needed from one class to another (i.e. `Product` can contain a list with instances of `Order` and vice-versa). Though, on relational databases we need three entities (tables), one to persist products, another one to persist orders, and a third one to relate (through foreign key) products and orders.

As we will see in the following sections, [SQLAlchemy ORM](http://docs.sqlalchemy.org/en/latest/orm/) is a great *Data Mapper* solution to translate Python classes into/from tables and to move data between instances of these classes and rows of these tables.

### SQLAlchemy Data Types

While using SQLAlchemy, we can rest assured that we will get support for the most common data types found on relational databases. [For example, booleans, dates, times, strings, and numeric values are a just a subset of the types that SQLAlchemy provides abstractions for](http://docs.sqlalchemy.org/en/latest/core/type_basics.html#generic-types). Besides these basic types, [SQLAlchemy includes support to a few vendor-specific types (like JSON)](http://docs.sqlalchemy.org/en/latest/core/type_basics.html#sql-standard-and-multiple-vendor-types) and also allows developers to [create custom types and redefine existing ones](http://docs.sqlalchemy.org/en/latest/core/custom_types.html).

To understand how we use SQLAlchemy data types to map properties of Python classes into columns on a relation database table, let's analyze the following example:

```python
class Product(Base):
    __tablename__ = 'products'
    id=Column(Integer, primary_key=True)
    title=Column('title', String(32))
    in_stock=Column('in_stock', Boolean)
    quantity=Column('quantity', Integer)
    price=Column('price', Numeric)
```

In the code snippet above, we are defining a class called `Product` that has 6 properties. Let's take a look at what these properties do:

- The `__tablename__` property tells to SQLAlchemy that rows of the `products` table must be mapped to this class.
- The `id` property identifies that this is the `primary_key` in the table and that its type is `Integer`.
- The `title` property indicates that a column in the table has the same name of the property and that its type is `String`.
- The `in_stock` property indicates that a column in the table has the same name of the property and that its type is `Boolean`.
- The `quantity` property indicates that a column in the table has the same name of the property and that its type is `Integer`.
- The `price` property indicates that a column in the table has the same name of the property and that its type is `Numeric`.

Seasoned developers will notice that (usually) relational databases do not have data types with these exact names. SQLAlchemy uses these types as generic representations to what databases support and use the dialect configured to understand what types they translate to. For example, on a PostgreSQL database, the title would be mapped to a `varchar` column.

### SQLAlchemy Relationship Patterns

Now that we know what ORM is and have look into data types, let's learn how do we use SQLAlchemy to map relationships between classes to relationships between tables. SQLAlchemy supports four types of relationships: [One To Many](http://docs.sqlalchemy.org/en/latest/orm/basic_relationships.html#one-to-many), [Many To One](http://docs.sqlalchemy.org/en/latest/orm/basic_relationships.html#many-to-one), [One To One](http://docs.sqlalchemy.org/en/latest/orm/basic_relationships.html#one-to-one), and [Many To Many](http://docs.sqlalchemy.org/en/latest/orm/basic_relationships.html#many-to-many).

> Note that this section will be an overview of all these types, but the on the *SQLAlchemy ORM in Practice* action we will do a hands on to practice mapping classes into tables and to learn how to insert, extract, and remove data from these tables.

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

### SQLAlchemy Sessions

Sessions, on SQLAlchemy ORM, are the implementation of the [Unit of Work](https://martinfowler.com/eaaCatalog/unitOfWork.html) design pattern. As explained by Martin Fowler, a Unit of Work is used to maintain a list of objects affected by a business transaction and to coordinate the writing out of these changes. This basically means that all changes tracked by Sessions (Units of Works) will be applied to the underlying database together, or none of them will. In other words, Sessions are used to guarantee the database consistency.

[The official SQLAlchemy ORM documentation about Sessions](http://docs.sqlalchemy.org/en/rel_1_1/orm/session_basics.html) gives a great explanation how changes are tracked, how to get sessions, and how to create ad-hoc sessions. However, in this article, we will use the most basic form of session creation:

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# create an engine
engine = create_engine('postgresql://dbuser:dbpassword@localhost:5431/sqlalchemy-orm-tutorial')

# create a configured "Session" class
Session = sessionmaker(bind=engine)

# create a Session
session = Session()
```

As we can see from the code snippet above, we only need one step to get sessions. We need to create a session factory that is bound to the SQLAlchemy engine. After that, we can just issue calls to this session factory to get our sessions.

## SQLAlchemy in Practice

Now that we got a better understanding of the most important pieces of SQLAlchemy, it's time to start practicing it. In the following sections, we will create a small project based on [`pipenv`](https://github.com/kennethreitz/pipenv)—a Python dependency manager—and add some classes to it. Then we will map these classes to tables persisted on a PostgreSQL database and learn how to query data.

### Starting the Tutorial Project

To create our tutorial project, we have to have Python installed on our machine and `pipenv` installed as a global Python package. The following commands will install `pipenv` and setup the project. These commands are dependent on Python, so be [sure to have it installed before proceeding](https://www.python.org/downloads/):

```bash
# install pipenv globally
pip install pipenv

# create a new directory for our project
mkdir sqlalchemy-tutorial

# change working directory to it
cd sqlalchemy-tutorial

# create a Python 3 project
pipenv --three
```

### Running PostgreSQL

To be able to practice our new skills and to learn how to query data on SQLAlchemy, we will need a database to to support our examples. As already mentioned, SQLAlchemy provides support for many different databases engines, but the instructions that follow will focus on PostgreSQL. There are many ways to get an instance of PostgreSQL. One of them is to use some cloud provider like [Heroku](https://www.heroku.com) or [ElephantSQL](https://www.elephantsql.com) (both of them have free tiers). Another possibility is to [install PostgreSQL locally on our current environment](https://wiki.postgresql.org/wiki/Detailed_installation_guides). A third option is to run a PostgreSQL instance inside a Docker container.

The third option is probably the best choice because it has the performance of an instance running locally, it's free forever, and because it's easy to create and destroy Docker instances. The only (small) disadvantage is that we need to [install Docker locally](https://docs.docker.com/engine/installation/).

After having Docker installed, we can create and destroy _dockerized_ PostgreSQL instances with the following commands:

```bash
# create a PostgreSQL instance
docker run --name sqlalchemy-orm-psql \
    -e POSTGRES_PASSWORD=dbpassword \
    -e POSTGRES_USER=dbuser \
    -e POSTGRES_DB=sqlalchemy-orm-tutorial \
    -p 5432:5432 \
    -d postgres

# stop instance
docker stop sqlalchemy-orm-psql

# destroy instance
docker rm sqlalchemy-orm-psql
```

The first command, the one that creates the PostgreSQL instance, contains a few parameters that are worth inspecting:

- `--name`: Defines the name of the Docker instance
- `-e POSTGRES_PASSWORD`: Defines the password to connect to PostgreSQL.
- `-e POSTGRES_USER`: Defines the user to connect to PostgreSQL.
- `-e POSTGRES_DB`: Defines the main (and only) database available in the PostgreSQL instance.
- `-p 5432:5432`: Defines that the local `5432` port will tunnel connections to the same port in the Docker instance.
- `-d postgres`: Defines that this Docker instance will be created based in the [official PostgreSQL repository](https://hub.docker.com/_/postgres/).

### Installing SQLAlchemy Dependencies

In this tutorial, we will need to install only two packages: `sqlalchemy` and `psycopg2`. The first dependency refers to SQLAlchemy itself and the second one, `psycopg2`, is the PostgreSQL driver that SQLAlchemy will use to communicate with the database. To install these dependencies, we will use `pipenv` as shown:

```bash
# install sqlalchemy and psycopg2
pipenv install sqlalchemy psycopg2
```

This command will download both libraries and make them available in our [Python virtual environment](https://github.com/kennethreitz/pipenv#basic-concepts).

### Mapping Classes with SQLAlchemy

After starting the _dockerized_ PostgreSQL instance and installing the Python dependencies, we can start mapping Python classes to database tables. In this tutorial we will map four simple classes that represent movies, actors, stuntmen, and contact details. The following diagram illustrates these entities' characteristics and their relations.

![Mapping Python classes with SQLAlchemy](https://cdn.auth0.com/blog/sqlalchemy-tutorial/class_diagram.jpg)

To start, we will create a file called `base.py` in the main directory of our project and add the following code to it:

```python
# coding=utf-8

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

engine = create_engine('postgresql://dbuser:dbpassword@localhost:5432/sqlalchemy-orm-tutorial')
Session = sessionmaker(bind=engine)

Base = declarative_base()
```

This code creates:

- a SQLAlchemy Engine that will interact with our _dockerized_ PostgreSQL database,
- a SQLAlchemy ORM session factory bound to this engine,
- and a base class for our classes definitions.

Now let's create and map the `Movie` class. To do this, let's create a new file called `movie.py` and add to it the following code:

```python
# coding=utf-8

from sqlalchemy import Column, String, Integer, Date

from .base import Base


class Movie(Base):
   __tablename__ = 'movies'

   id = Column(Integer, primary_key=True)
   title = Column(String)
   release_date = Column(Date)

   def __init__(self, title, release_date):
       self.title = title
       self.release_date = release_date
```

The definition of this class and its mapping characteristics is quite simple. We start by making this class extend the `Base` class defined in the `base.py` module and then we add four properties to it:

1. A `__tablename__` to indicate what is the name of the table that will support this class.
2. An `id` to represent the primary key in the table.
3. A `title` of type `String`.
4. A `release_date` of type `Date`.

The next class that we will create and map is the `Actor` class. Let's create a file called `actor.py` and add the following code to it:

```python
# coding=utf-8

from sqlalchemy import Column, String, Integer, Date

from .base import Base


class Actor(Base):
    __tablename__ = 'actors'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    birthday = Column(Date)

    def __init__(self, name, birthday):
        self.name = name
        self.birthday = birthday
```

The definition of this class is pretty similar to the previous one. The differences are that the `Actor` has a `name` instead of a `title`, a `birthday` instead of a `release_date`, and that it points to a table called `actors` instead of `movies`.

As many movies can have many actors and vice-versa, we will need to create a _Many To Many_ relationship between these two classes. Let's create this relationship by updating the `movie.py` file as follows:

```python
# coding=utf-8

from sqlalchemy import Column, String, Integer, Date, Table, ForeignKey
from sqlalchemy.orm import relationship

from .base import Base

movies_actors_association = Table(
    'movies_actors', Base.metadata,
    Column('movie_id', Integer, ForeignKey('movie.id')),
    Column('actor_id', Integer, ForeignKey('actor.id'))
)


class Movie(Base):
    __tablename__ = 'movies'

    id = Column(Integer, primary_key=True)
    title = Column(String)
    release_date = Column(Date)
    actors = relationship("Actor", secondary=movies_actors_association)

    def __init__(self, title, release_date):
        self.title = title
        self.release_date = release_date
        self.actors = []
```

The difference between this version and the previous one is that:

- we imported three new entities: `Table`, `ForeignKey`, and `relationship`;
- we created a `movies_actors_association` table that connects rows of `actors` and rows of `movies`;
- and we added the `actors` property to `Movie` and configured the `movies_actors_association` as the intermediary table.

### Persisting Data with SQLAlchemy

### Querying Data with SQLAlchemy ORM

{% include asides/python.markdown %}

## Next Steps
