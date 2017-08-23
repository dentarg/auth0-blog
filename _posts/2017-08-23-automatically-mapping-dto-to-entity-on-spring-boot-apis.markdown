---
layout: post
title: "Automatically Mapping DTO to Entity on Spring Boot APIs"
description: "Let's learn how ModelMapper can help us automate the mapping process of DTOs into entities Spring Boot APIs."
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

After that we just need to import the Spring Boot project in our preferred IDE (Integrated Development Environment).

### Adding Dependencies

Having the QuestionMarks project cloned and imported on our IDE, we can start evolving it to handle automatic mapping of DTOs. The first step we need to take is to add ModelMapper as a dependency in our `./build.gradle` file. We will also add a dependency to [`hibernate-java8` library](https://mvnrepository.com/artifact/org.hibernate/hibernate-java8). We will need this artifact to be able to map Java8-specific classes to columns on our database.

```gradle
// ... other definitions

dependencies {
	// ... other dependencies
  compile('org.modelmapper:modelmapper:1.1.0')
  compile('org.hibernate:hibernate-java8:5.1.0.Final')
}
```

### Refactoring the Exam Entity

To witness the real advantage of using DTOs, and to have a more meaningful example of the mapping process in action, we are going to refactor the `Exam` entity a little bit. We are going to add two date properties on it to keep track of when the exam was created and when it was last edited, and we are going to add a flag that indicates if it's published (available to the open public) or not. Let's open the `./src/main/java/com/questionmarks/model/Exam.java` file and add the following lines of code:

```java
// ... other imports
import java.time.LocalDateTime;

// ... annotations
public class Exam {
    // ... other properties

    @NotNull
    private LocalDateTime createdAt;

    @NotNull
    private LocalDateTime editedAt;

    @NotNull
    private boolean published;
}
```

Note that without the `hibernate-java8` library imported in the last section, JPA/Hibernate wouldn't be able to automatically map `LocalDateTime` to the database. Fortunately this library exists to help us, otherwise we would need to create our own converters.

We also have to add the new properties (as columns) to the PostgreSQL database that supports our application. Since in the last article we set up Liquibase to handle schema migrations, we just have to create a new file with the commands to add the new columns. We will call this file as `v0002.sql` and will add it to the `./src/main/resources/db/changelog/changes/` folder with the following content:

```sql
alter table exam
  add column created_at timestamp without time zone not null default now(),
  add column edited_at timestamp without time zone not null default now(),
  add column published boolean not null default false;
```

The next time that we run our application, Liquibase will read this file and run these commands to add three columns. The SQL commands will also populate these columns with some default values for any pre-existing records. Besides that, there is nothing else that we need to change to make JPA/Hibernate aware of the columns and capable of handling it.

### Creating DTOs

As we have changed the `Exam` entity to hold some sensitive properties that we don't want users to change directly, we are going to create two DTOs to better handle user requests. The first DTO will be responsible for the creation of new exams and, as such, will be called `ExamCreationDTO`. We will create this DTO class in a new package called `dto` inside the `com.questionmarks.model` package. This class will contain the following source code:

```java
package com.questionmarks.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Getter
@Setter
public class ExamCreationDTO {
    @NotNull
    private String title;

    @NotNull
    private String description;

    @JsonIgnore
    private final LocalDateTime createdAt = LocalDateTime.now();

    @JsonIgnore
    private final LocalDateTime editedAt = LocalDateTime.now();
}
```

Users willing to create new exams will need to send requests containing the structure defined in our new DTO. That is, they will need to send nothing more and nothing less then a `title` and a `description`. Both the `createdAt` and the `editedAt` properties are populated by the DTO itself. If any user tries to send values through these properties, our application will ignore them as they are marked with `@JsonIgnore`. Besides that, the `published` property that we've added to the `Exam` entity was completely hidden from the outside world, as the DTO didn't include it.

The second DTO that we will create will be responsible for the update of existing exams. We will call this DTO as `ExamUpdateDTO` and will include it in the `com.questionmarks.model.dto` package with the following code:

```java
package com.questionmarks.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Id;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Getter
@Setter
public class ExamUpdateDTO {
    @Id
    @NotNull
    private long id;

    @NotNull
    private String title;

    @NotNull
    private String description;

    @JsonIgnore
    private final LocalDateTime editedAt = LocalDateTime.now();
}
```

The difference from the other DTO is that this one includes the `id` property of the exam that it wants to update, and it doesn't have the `createdAt` property since it wouldn't make sense to update this field.

From the perspective of the DTOs this is pretty much what we need to be able to securely handle the creation and updates of exams. From now on we are going to focus on streamlining the process of mapping DTOs to entities to avoid having to manually manipulating these mappings.

But wait! Before proceeding to the next tasks, let's create a small unit test to guarantee that ModelMapper is in fact capable of mapping our DTOs to the `Exam` entity. Let's create a new package called `model` inside the `com.questionmarks` package that resides in the test code (in the `./src/test/java/com/questionmarks/` folder) and then create a class called `ExamUT` inside it with the following code:

```java
package com.questionmarks.model;

import com.questionmarks.model.dto.ExamCreationDTO;
import com.questionmarks.model.dto.ExamUpdateDTO;
import org.junit.Test;
import org.modelmapper.ModelMapper;

import static org.junit.Assert.assertEquals;

public class ExamUT {
    private static final ModelMapper modelMapper = new ModelMapper();

    @Test
    public void checkExamMapping() {
        ExamCreationDTO creation = new ExamCreationDTO();
        creation.setTitle("Testing title");
        creation.setDescription("Testing description");

        Exam exam = modelMapper.map(creation, Exam.class);
        assertEquals(creation.getTitle(), exam.getTitle());
        assertEquals(creation.getDescription(), exam.getDescription());
        assertEquals(creation.getCreatedAt(), exam.getCreatedAt());
        assertEquals(creation.getEditedAt(), exam.getEditedAt());

        ExamUpdateDTO update = new ExamUpdateDTO();
        update.setTitle("New title");
        update.setDescription("New description");

        modelMapper.map(update, exam);
        assertEquals(update.getTitle(), exam.getTitle());
        assertEquals(update.getDescription(), exam.getDescription());
        assertEquals(creation.getCreatedAt(), exam.getCreatedAt());
        assertEquals(update.getEditedAt(), exam.getEditedAt());
    }
}
```

The only `@Test` defined in this class creates an instance of `ExamCreationDTO` with a specific `title` and `description` and then uses an instance of `ModelMapper` to generate a new `Exam`. It then checks if this `Exam` contains the same `title`, `description`, `createdAt`, and `editedAt` values as the ones held by `ExamCreationDTO`.

Lastly, it creates an instance of `ExamUpdateDTO` and applies it to the `Exam` instance created before to checks if the `title`, `description`, and `editedAt` properties were updated and if the `createdAt` property remained unchanged. Running the tests now, through the IDE or through the `gradle test` command, should gives us a positive result. Therefore, we can now build the rest of the engine to map DTOs to entities.

### Automating DTO to Entity Mapping

DTO.java

DTOModelMapper.java

WebMvcConfig.java

ExamRepository.java

ExamRestController.java

## Aside: Securing Spring Boot APIs with Auth0

## Next Steps: Exception Handling and I18N
