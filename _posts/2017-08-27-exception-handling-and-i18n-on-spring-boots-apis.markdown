---
layout: post
title: "Exception Handling and I18N on Spring Boots APIs"
description: "Let's learn how to properly handle exceptions on Spring Boot APIs while providing multi-language support (I18N) for the messages."
date: 2017-08-27 20:08
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
- i18n
- exception-handling
related:
- 2017-08-23-automatically-mapping-dto-to-entity-on-spring-boot-apis
- 2017-08-18-integrating-spring-data-jpa-postgresql-liquibase
- 2017-08-10-implementing-jwt-authentication-on-spring-boot
---

## What is a I18N?

I18N is a short name invented for the term internationalization. The number eighteen (18) refers to the number of characters between the first letter in the word, I, and the last one, N. Internationalization is the process of developing software that can be localized for multiple languages and cultures easily. For developers, internationalizing means abstracting all the texts that users can get from an application. This abstraction usually occurs by replacing these texts by unique codes that refer to them, and by organizing them by language. Whenever an user starts interacting with the application, they define the preferred language (automatically or manually) and the application starts providing messages according to the language informed.

For example, on a web browser like Firefox or Google Chrome, the menus and help messages that the user can see are shown accordingly to the main language set on the operational system. Although this default configuration is usually what the user expects, software providers normally add an option so the default language can be overwritten.

Throughout this article we are going to see how can we internationalize a Spring Boot API, even for occasions where errors (expected or not) occur in the application.

## What Will We Build?

As we don't want to spend too much time setting up a new project from the ground, we are going to take advantage of the QuestionMarks project that we started building in previous articles. There is **no need** to read all the articles, although it would be a good idea as they provide good Spring Boot techniques. We will clone the [GitHub repository that supports the project](https://github.com/auth0-blog/questionmarks-server), and we are going to checkout a specific [Git tag](https://git-scm.com/book/en/v2/Git-Basics-Tagging) that will give us a solid basis to focus on what we are interested on, I18N and exception handling.

### QuestionMarks Summary

The idea behind QuestionMarks is that the application will enable users to practice and enhance their knowledge by answering a set of multiple choice questions. To provide a better organization, these questions are grouped in different exams. For example, there could be an exam called *JavaScript Interview* that would hold a set of JavaScript related questions to help users to prepare for interviews. In this article we won't build the whole application as it would take a lot of time and would make the article huge, but we will be able to see the technologies aforementioned in action.

Throughout previous articles, we have integrated Spring Data JPA, PostgreSQL, and Liquibase to manage the persistence layer. Therefore, we will need to launch a PostgreSQL instance to support the application. We also created a nice feature that allow us to automatically map DTOs into entities while validating their data. The problem now is that if the data is not valid, or if an unexpected error occurs, our application will not provide user-friendly messages. To overcome this issue, we are going to enhance QuestionMarks to handle these errors and encapsulate (or replace) messages in a structured way.

### Launching PostgreSQL

Before cloning the existing project, we need to setup a PostgreSQL instance to support our database operations and the persistence layer. As stated in the first article, Docker can be a great solution to launch applications without installing them on our development machine.

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

## Implementing a Validator Utility

Check.java

RestException.java

application.properties

### Unit Testing Validator

## Creating the I18N Messages

messages.properties

messages_pt_BR.properties

## Globally Handling Exceptions on Spring Boot

RestMessage.java

RestExceptionHandler.java

ExamCreationDTO.java

ExamUpdateDTO.java

DTOModelMapper.java

## Aside: Securing Spring Boot Apps with Auth0

## Next Steps: Integration Testing on Spring Boot APIs
