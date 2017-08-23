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

## What Are DTOs?

## DTOs and Spring Boot APIs

## ModelMapper Introduction

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
