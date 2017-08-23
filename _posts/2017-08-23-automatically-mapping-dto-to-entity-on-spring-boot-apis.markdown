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

### Launching PostgreSQL

### Cloning QuestionMarks

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
