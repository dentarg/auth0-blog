---
layout: post
title: "Integrating Spring Data JPA, PostgreSQL and Liquibase"
description: "Let's learn how to integrate Spring Data JPA, PostgreSQL and Liquibase to manage our persistence layer."
date: 2017-08-18 16:46
category: Technical Guide, Java, Spring Boot
author:
  name: "Bruno Krebs"
  url: "https://twitter.com/brunoskrebs"
  mail: "bruno.krebs@auth0.com"
  avatar: "https://www.gravatar.com/avatar/76ea40cbf67675babe924eecf167b9b8?s=60"
design:
  bg_color: "#3F6426"
  image: https://cdn.auth0.com/blog/spring-boot-auth/logo.png
tags:
- spring-boot
- liquibase
- jpa
related:
- 2017-08-10-implementing-jwt-authentication-on-spring-boot
- 2017-04-28-incrementally-changing-your-database-with-java-and-flyway
- 2017-03-30-java-platform-and-java-community-process-overview
---

**TL;DR**: In this blog post, we are going to learn how to use Spring Data JPA along with Liquibase and PostgreSQL to manage the persistence layer of Spring Boot applications. We are also going to use Project Lombok to avoid writing some tedious boilerplate code that Java and JPA require.

Throughout this post we will create the basis of an application called *QuestionMarks*. The idea is that this application will enable users to practice and enhance their knowledge by answering a set of multiple choice questions. To provide a better organization, these questions will be organized in different exams. For example, there could be an exam called *JavaScript Interview* that would hold a set of JavaScript related questions to help users to prepare for interviews. Of course, in this article we won't build the whole application as it would take a lot of time and would make the article huge, but we will be able to see the technologies mentioned before in action and working together.

Before diving into the integration these technologies, let's take a look at the definition of them.

## What is Spring Data JPA?

[Spring Data JPA](https://projects.spring.io/spring-data-jpa/) is the Spring module that adds support and extends [JPA](http://docs.oracle.com/javaee/6/tutorial/doc/bnbpz.html). JPA (which stands for *Java Persistence API*) is a [Java specification](https://auth0.com/blog/java-platform-and-java-community-process-overview/) for accessing, persisting, and managing data between Java objects/classes and a relational databases (e.g. PostgreSQL, MySQL, SQLServer, etc). The process of mapping object-oriented entities to entity-relationship models is also know as ORM (Object-Relation Mapping) and JPA is the contract defined by the Java community to manage such mappings.

As JPA is just an specification, we will need an implementation to do the heavy work for us. [Hibernate](http://hibernate.org/) is the most popular implementation of the JPA specification, and actually the specification itself was created based on Hibernate. Besides that, when we import Spring Data JPA on Spring, we also get Hibernate by default. Therefore, there is no reason to search for another JPA implementation.

> For the sake of completeness, here is a list of existing Hibernate alternatives: [Oracle TopLink](http://www.oracle.com/technetwork/middleware/toplink/index-085257.html), [Apache OpenJPA](http://openjpa.apache.org/), [DataNucleus](http://www.datanucleus.org/), and [ObjectDB](http://www.objectdb.com/java/jpa).

## What is Liquibase?

[Liquibase](http://www.liquibase.org/) is a tool that help developers to source control the database. In other words, with Liquibase we can keep our database schema and data synced with our Java entities. This is achieved by creating, in our project, files that contain [changesets](http://www.liquibase.org/documentation/changeset.html) to be run on the database. These changesets are instructions to change/refactor the database. We will see Liquibase and its changesets in a while.

## What is PostgreSQL?

Probably [PostgreSQL](https://www.postgresql.org/) does not need presentations, but to keep things consistent here it is: PostgreSQL is a powerful, open source object-relational database system. It has more than 15 years of active development and a proven architecture that has earned it a strong reputation for reliability, data integrity, and correctness.

As a database server, its primary functions are to store data securely and return that data in response to requests from other software applications. It can handle workloads ranging from small single-machine applications to large internet-facing applications with many concurrent users.

### Launching a Dockerized PostgreSQL Instance

Since we are going to need a PostgreSQL server running locally to test the integration of the tools mentioned above, [Docker](https://www.docker.com/) might come in handy. Instead of installing PostgreSQL in our machine, let's use Docker to make this database disposable. Like this, if we need a newer version of PostgreSQL, or if we need a completely different database server, we won't need to struggle to update or uninstall PostgreSQL.

Of course we will need Docker installed on our development machine, but the process of installing it is really simple: [for MacOS check this link](https://www.docker.com/docker-mac), [for Windows this link](https://www.docker.com/docker-windows), and [for Ubuntu this link](https://docs.docker.com/engine/installation/linux/ubuntu/).

After having Docker installed on our machine, we can issue the following command to run a dockerized instance of PostgreSQL:

```bash
docker run --name questionmarks-psql \
    -p 5432:5432 \
    -e POSTGRES_DB=questionmarks \
    -e POSTGRES_PASSWORD=mysecretpassword \
    -d postgres
```

The command above achieves the following:

- Runs a Docker container that contains PostgreSQL and name it as `questionmarks-psql`.
- Defines that the `5432` local port must be bridged to the same port in the container.
- Defines that a database called `questionmarks` must be created in the PostgreSQL instance.
- Defines that the password for the `postgres` user is `mysecretpassword`.

Case we need to stop, restart, or remove this Docker container, we can issue the following commands:

```
docker stop questionmarks-psql

docker start questionmarks-psql

docker rm questionmarks-psql
```

## Bootstrapping a Spring Boot App

Next step is to bootstrap a Spring Boot application. We have two alternatives equally easy to do that. The first one is to use the [Spring Initilizr website](http://start.spring.io/) provided by Pivotal. The second options is to clone [this GitHub repository](https://github.com/auth0-blog/questionmarks-server) and check out the `part1` branch.

### Bootstrapping with Spring Initilizr

If we choose to bootstrap our application with [Spring Initilizr](http://start.spring.io/), we will need to fill the form available with the following values:

- Generate a **Gradle Project** with **Java** and Spring Boot **1.5.6**
- Project Metadata Group: **com**
- Project Metadata Artifact: **questionmarks**
- Selected Dependencies: let's leave this empty

Note that although this blog post will show the configuration for Gradle, we could easily use Maven. Just keep in mind that if we choose **Maven Project** the dependency configuration will be different. Besides that the Spring Boot version does *not* need to be *1.5.6*. The examples here must probably work with older and newer versions.

After that we just need to import the new Spring Boot project in our preferred IDE (Integrated Development Environment).

### Bootstrapping with GitHub

If we choose to bootstrap our application by cloning the [GitHub repository provided](https://github.com/auth0-blog/questionmarks-server), we will need to issue the following commands:

```bash
git clone https://github.com/auth0-blog/questionmarks-server.git
cd questionmarks-server
git checkout -b origin/part1
```

The three commands above will give us the same result of using the Spring Initilizr website (i.e. if we fill the website's form with the values shown above). After that we just need to import the new Spring Boot project in our preferred IDE (Integrated Development Environment).

## Importing Dependencies

Now that we have our basic Spring Boot application set, we can change our dependency management tool (Gradle) to import the tools that we will use. To do that, let's open the `./build.gradle` file and change it as follows:

```js
// everything else ...

dependencies {
  compileOnly('org.projectlombok:lombok:1.16.18')
  compile('org.springframework.boot:spring-boot-starter')
  compile('org.springframework.boot:spring-boot-starter-web')
  compile('org.springframework.boot:spring-boot-starter-data-jpa')
  compile('org.liquibase:liquibase-core')
  runtime('org.postgresql:postgresql:42.1.4')
  testCompile('org.springframework.boot:spring-boot-starter-test')
}
```

To summarize, the changes made in this file added:

- A compile only dependency to Project Lombok, which will make our code look cleaner.
- A compile dependency to [Spring Boot Web Starter](https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-web), which facilitates the development of RESTful APIs and also adds a transitive dependency to [Java Bean Validation](http://www.baeldung.com/javax-validation).
- A compile dependency to Spring Data JPA, which also gives us Hibernate.
- A compile dependency to Liquibase, which will help us managing the database.
- A runtime dependency to [PostgreSQL JDBC Driver](https://jdbc.postgresql.org/), which will enable Hibernate to communicate with the database.

## Mapping Entities with JPA

As we already have all the dependencies properly set on our application, let's start creating the entities (classes) that we want JPA/Hibernate to manage. We will create five entities. The first one will be called `Exam` and we will create it in a new package called `com.questionmarks.model` with the following code:

```java
// ./src/main/java/com/questionmark/model/Exam.java file

package com.questionmarks.model;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

@Data
@Entity
public class Exam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotNull
    private String title;

    @NotNull
    private String description;
}
```

This class, although quite small and simple, has some interesting characteristics. The main one, for those who are not familiar with Lombok, is the `@Data` annotation. As explained by [the documentation](https://projectlombok.org/features/Data), `@Data` is a convenient shortcut annotation that bundles the features of `@ToString`, `@EqualsAndHashCode`, `@Getter`, `@Setter` and `@RequiredArgsConstructor` together. In other words, `@Data` generates all the boilerplate that is normally associated with simple POJOs (Plain Old Java Objects) and beans: getters for all fields, setters for all non-final fields, and appropriate toString, equals and hashCode implementations that involve the fields of the class, and a constructor that initializes all final fields, as well as all non-final fields with no initializer that have been marked with `@NonNull`, in order to ensure the field is never null.

Besides this somewhat magical annotation, we also:

- added `@Entity` to mark this class is an entity that will be managed by JPA/Hibernate
- added `@Id` to indicate that the `id` property is the primary key of this entity.
- added `@GeneratedValue` with the `GenerationType.IDENTITY)` strategy to indicate that the primary key value will be assigned by the persistence provider (i.e. PostgreSQL)
- added `@NotNull` to both `title` and `description` properties to avoid persisting empty data for these fields.

Most of the annotations used in the `Exam` entity are going also to be used in the other entities, as they provide the basis for JPA/Hibernate to function. The next entity that we are going to create will be called `Question`. Let's create this class inside the `com.questionmark.model` package with the following code:

```java
// ./src/main/java/com/questionmark/model/Question.java file

package com.questionmarks.model;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

@Data
@Entity
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "exam_id")
    private Exam exam;

    private long order;

    @NotNull
    private String description;
}
```

Besides the annotations that we already covered while creating the `Exam` entity, `Question` makes use of two new annotations:

- `@ManyToOne` indicates to JPA/Hibernate that **Many** questions can exist **ToOne** exam.
- `@JoinColumn` indicates that there will be a column called `exam_id`, in the table that supports `Question`, to reference the exam that owns this question.

This basically means that an exam will have many questions and that there will be a *foreign key* in the `question` table that points to the `exam`. Soon we will create these tables and these relationships in our database with the help of Liquibase.

The third entity that we will map will be `Alternative`. As we are developing an application that provides multiple choice questions, we need to map these choices (alternatives) to make record which is the right one and also which alternative the user chose. Let's create the `Alternative` class in the `com.questionmark.model` package with the following code:

```java
// ./src/main/java/com/questionmarks/model/Alternative.java file

package com.questionmarks.model;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

@Data
@Entity
public class Alternative {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "question_id")
    private Question question;

    private long order;

    @NotNull
    private String description;

    private boolean correct;
}
```

This class doesn't use any new annotation, or any new feature. It simply uses the `@Data` annotation to avoid the boilerplate code, the JPA annotations to mark as a managed entity with a primary key, and the `@ManyToOne` along with `@JoinColumn` to indicate that many alternatives may exist to a single question.

Both the `Alternative` and `Question` entities have two properties in common. A text (`String`) property to hold the `description` of the alternative/question, and a numerical (`long`) order that defines on what order the alternative will be shown in the question, or the question will be shown in the exam. Besides that, `Alternative` has a `boolean` property called `correct` to indicate if it is the correct answer or not.

The fourth entity that we will create is going to be `User`. We will create this class in the `com.questionmarks.model` package with the following code:

```java
// ./src/main/java/com/questionmarks/model/User.java file

package com.questionmarks.model;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

@Data
@Entity
public class User {
    @Id
    private String id;
}
```

Contrastingly to the other entities that we have created, `User` does not have a numerical (`long`) id, but a textual (`String`) primary key. Besides that it doesn't have usual properties like email, name, and password. These unusual characteristics have an explanation. As we don't want to handle sensitive data and we don't want to waste valuable time trying to write authentication mechanisms, we are going to use [Auth0](https://auth0.com) to manage users for us. All we will have to do is to persist a unique id that will be sent for us through JWTs (JSON Web Tokens).

This approach will free us to focus on the core functionality while we rest assure that one of the most critical parts of our application (security and authentication) will be supported by a huge team of experts: Auth0!

Finally, the last entity that we will create will be called `Attempt`. This class will represent the attempts that users make to answer a question.

```java
// ./src/main/java/com/questionmarks/model/Attempt.java file

package com.questionmarks.model;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Data
@Entity
public class Attempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @NotNull
    @ManyToOne
    @JoinColumn (name = "alternative_id")
    private Alternative alternative;

    @NotNull
    private Date date;

    private boolean correct;
}
```

## Managing the Database Schema with Liquibase

## Aside: Securing Spring Boot Apps with Auth0

## Querying the Database
