---
layout: post
title: "Automatically Mapping DTO to Entity on Spring Boot APIs"
description: "Let's learn how ModelMapper can help us automate the mapping process of DTOs to entities Spring Boot APIs."
date: 2017-08-23 08:00
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
- dto
- modelmapper
related:
- 2017-08-18-integrating-spring-data-jpa-postgresql-liquibase
- 2017-08-10-implementing-jwt-authentication-on-spring-boot
- 2017-04-28-incrementally-changing-your-database-with-java-and-flyway
---

## What is a DTO?

DTO, which stands for Data Transfer Object, is a design pattern conceived to reduce the number of calls when working with remote interfaces. As [Martin Fowler defines in his blog](https://martinfowler.com/eaaCatalog/dataTransferObject.html), the main reason for using a Data Transfer Object is to batch up what would be multiple remote calls into a single one.

For example, lets say that we were communicating with a RESTful API that exposes our banking account data. In this situation, instead of issuing multiple requests to check the current status and latest transactions of our account, the bank could expose an endpoint that returned a DTO summarizing everything. As one of the most expensive operations in remote applications is the round-trip time between the client and the server, this coarse-grained interface can help improving performance by a great deal.

## DTOs and Spring Boot APIs

Another advantage of using DTOs on RESTful APIs written in Java (mainly on Spring Boot), is that they can help hiding implementation details of domain objects (aka. entities). Exposing entities through endpoints can become a security issue if we do not carefully handle what properties can be changed through what operations.

As an example, let's imagine a Java API that exposes user details and accepts user updates through two endpoints. The first endpoint would handle `GET` requests and return user data, and the second endpoint would accept `PUT` requests to update these details. If this application didn't take advantage of DTOs, all the properties of the user would be exposed in the first endpoint (e.g. password) and the second endpoint would have to be very selective on what properties would accept when updating a user (e.g. not everybody can update the roles of a user). To overcome this situation, DTOs can come in handy by exposing only what the first endpoint is intended to expose, and by helping the second endpoint to restrict what it accepts.

Throughout this article, we will take advantage of DTOs to help us handling situations like that. As we will see, this design pattern will introduce a few more classes to our application, but will improve its security.

## ModelMapper Introduction

To avoid having to write cumbersome/boilerplate code to map DTOs into entities and vice-versa, we are going to use a library called [ModelMapper](http://modelmapper.org/). The goal of ModelMapper is to make object mapping easy by automatically determining how one object model maps to another. This library is quite powerful and accepts a whole bunch of configurations to streamline the mapping process, but it also favor convention over configuration by providing a default behavior that fits most cases.

The [user manual of this library](http://modelmapper.org/user-manual/) is well written and can be a valuable resource if time comes where we need to tweak the mapping process. To give a little taste of what this library can do, let's say that we had a `User` like that:

```java
// assume getters and setters
class User {
  long id;
  String firstName;
  String lastName;
  String email;
  String password;
  String securitySocialNumber;
  boolean isAdmin;
}
```

And wanted to expose just the `id`, `firstName`, and `email`. By using ModelMapper we would have to create a DTO like this:

```java
// assume getters and setters
class UserDTO {
  long id;
  String firstName;
  String email;
}
```

And then call ModelMapper as follows:

```java
ModelMapper modelMapper = new ModelMapper();
// user here is a prepopulated User instance
UserDTO userDTO = modelMapper.map(user, UserDTO.class);
```

That is, only by defining the structure that we want to expose and by calling `modelMapper.map`, we achieve our goal and hide what is not meant to be exposed. One might argue that libraries like [Jackson](https://github.com/FasterXML/jackson) provide annotations to ignore some properties when serializing objects, but this solution restrict developers to a single way to express their entities. By using DTOs and ModelMapper, we can provide as many different versions (with different structures) of our entities as we want.

## What Will We Build?

From now on, we are going to focus on using DTOs to expose entities of a Spring Boot RESTful API. We are going to use ModelMapper to map from the entities that compose this API to DTOs, and vice-versa. As we don't want to spend too much time setting up a new project from the ground, we are going to take advantage of the QuestionMarks project that we stated building in the previous article. There is **no need** to read the full article, we will clone the [GitHub repository that supports the project](https://github.com/auth0-blog/questionmarks-server), and we are going to checkout a specific [Git tag](https://git-scm.com/book/en/v2/Git-Basics-Tagging) that will gives us a solid basis to focus on what we are interested on.

The idea behind QuestionMarks is that this application will enable users to practice and enhance their knowledge by answering a set of multiple choice questions. To provide a better organization, these questions will be grouped in different exams. For example, there could be an exam called *JavaScript Interview* that would hold a set of JavaScript related questions to help users to prepare for interviews. Of course, in this article we won't build the whole application as it would take a lot of time and would make the article huge, but we will be able to see the technologies aforementioned in action.

During the previous article, we have integrated Spring Data JPA, PostgreSQL, and Liquibase to manage the persistence layer. We haven't created any RESTful endpoint before, as we didn't have a good way to expose entities. That is the main goal of this article.

### Launching PostgreSQL

Before cloning the existing project, we need to setup a PostgreSQL instance to support our database operations and persistence. As stated in the previous article, Docker can be a great solution to launch applications without installing them on our development machine.

We do need Docker installed, but the process of installing it is quite simple ([for MacOS check this link](https://www.docker.com/docker-mac), [for Windows this link](https://www.docker.com/docker-windows), and [for Ubuntu this link](https://docs.docker.com/engine/installation/linux/ubuntu/)). Having Docker properly installed, we can run a dockerized instance of PostgreSQL as follows:

```bash
docker run --name questionmarks-psql \
    -p 5432:5432 \
    -e POSTGRES_DB=questionmarks \
    -e POSTGRES_PASSWORD=mysecretpassword \
    -d postgres
```

Note that if we do not want to launch PostgreSQL inside a Docker instance, or if we do have another PostgreSQL instance already available, we will need to guarantee that we have a database called `questionmarks` on it, and that the `postgres` user has `mysecretpassword` as password. Or, we can change these values in the `./src/main/resources/application.properties` file:

```properties
spring.datasource.url=jdbc:postgresql://localhost/questionmarks
spring.datasource.username=postgres
spring.datasource.password=mysecretpassword
spring.datasource.driver-class-name=org.postgresql.Driver
```

### Cloning QuestionMarks

Next step is to clone the [GitHub repository that supports QuestionMarks](https://github.com/auth0-blog/questionmarks-server), and checkout the specific tag for this article. We achieve that by issuing the following commands:

```bash
git clone https://github.com/auth0-blog/questionmarks-server.git
cd questionmarks-server
git checkout post-2
```

Since we haven't created any endpoints in the previous article, there wouldn't have a good reason to run the application now. Running it would do no harm, and Liquibase would create the tables structures to support the five entities already created. But waiting to run it after developing our endpoints will produce the same effect.

### Adding Dependencies

build.gradle

### Refactoring the Exam Entity

Exam.java

v0002.sql

### Creating DTOs

ExamCreationDTO.java

ExamUpdateDTO.java

ExamUT.java

### Automating DTO to Entity Mapping

DTO.java

DTOModelMapper.java

WebMvcConfig.java

ExamRepository.java

ExamRestController.java

## Aside: Securing Spring Boot APIs with Auth0

## Next Steps: Exception Handling and I18N
