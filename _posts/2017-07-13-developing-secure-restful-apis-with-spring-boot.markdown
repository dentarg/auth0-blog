---
layout: post
title: "Securing RESTful APIs with Spring Boot"
description: "Let's learn the correct way to secure RESTful APIs based on Spring Boot."
date: 2017-07-13 18:23
category: Technical Guide, Java, Spring Boot
author:
  name: "Bruno Krebs"
  url: "https://twitter.com/brunoskrebs"
  mail: "bruno.krebs@auth0.com"
  avatar: "https://www.gravatar.com/avatar/76ea40cbf67675babe924eecf167b9b8?s=60"
design:
  bg_color: "#222228"
  image: https://cdn.auth0.com/blog/spring-boot-auth/logo.png
tags:
- spring-boot
- jwt
- java
- security
related:
- 2017-04-28-incrementally-changing-your-database-with-java-and-flyway
- 2017-03-30-java-platform-and-java-community-process-overview
- 2017-05-09-developing-jsf-applications-with-spring-boot
---

**TL;DR** In this blog post, we will learn how to handle authentication and authorization on *RESTful APIs* written with *Spring Boot*. We will clone, from *GitHub*, a simple *Spring Boot* application that exposes public endpoints, and then we will secure this endpoints with *Spring Security* and *JWTs*.

## Securing RESTful APIs with JWTs

*JSON Web Tokens*, commonly known as *JWTs*, is a technology for using tokens to authenticate subjects (users, other applications, etc) on applications. It has gained popularity over the recent years because it enables backends to rely on requests simply by validating the contents of these *JWTs*, without having to hold session data about users. This characteristic facilitates scalability while keeping the applications secure.

In authentication, when the user successfully logs in using their credentials, a *JSON Web Token* is returned and must be saved locally (typically in local storage, but cookies can be also used). Whenever the user wants to access a protected route or resource (an endpoint), the user agent must send the *JWT*, typically in the Authorization header using the Bearer schema, alongside with the request.

When a backend server receives a request with a *JWT*, the first thing to do is to validate the token. This consists of a series of steps, and if any of these fails then the request must be rejected. The following list shows the validation steps needed:

- Check that the JWT is well formed
- Check the signature
- Validate the standard claims
- Check the Client permissions (scopes)

We won't get into the nitty-gritty details about *JWTs* in this article but, if needed, head to [this resource to learn more about *JWTs*](https://auth0.com/docs/jwt) or to this [resource to learn more about *JWTs* validation](https://auth0.com/docs/api-auth/tutorials/verify-access-token).

## The RESTful Spring Boot API Overview

The *RESTful Spring Boot API* that we are going to secure is a task list manager. The task list is kept globally, which means that all users will see and interact with the same list. To clone and run this application, let's issue the following commands:

```bash
# clone the starter project
git clone https://github.com/auth0-blog/spring-boot-auth.git

cd spring-boot-auth

# run the unsecure RESTful API
gradle bootRun
```

If everything works as expected, our *RESTful Spring Boot API* will be up and running. To test it, we can use a tool like [*Postman*](https://www.getpostman.com/) or [*curl*](https://curl.haxx.se/) to issue request to the available endpoints:

```bash
# issue a GET request to see the (empty) list of tasks
curl http://localhost:8080/tasks

# issue a POST request to create a new task
curl -H "Content-Type: application/json" -X POST -d '{
    "description": "Buy some milk(shake)"
}'  http://localhost:8080/tasks

# issue a PUT request to update the recently created task
curl -H "Content-Type: application/json" -X PUT -d '{
    "description": "Buy some milk"
}'  http://localhost:8080/tasks/1

# issue a DELETE request to remove the existing task
curl -X DELETE http://localhost:8080/tasks/1
```

All the endpoints used in the commands above are defined in the `TaskController` class, which belongs to the `com.auth0.samples.authapi.task` package. Besides this class, this package contains two other classes:

- `Task`: which is the entity model that represents tasks in the application.
- `TaskRepository`: which is the class responsible for handling the persistence of instances of `Task`.

The persistence layer of our application is backed by an in-memory database called [*HSQLDB*](http://hsqldb.org/). We would typically use a production-ready database like *PostgreSQL* or *MySQL* on real applications but, for this tutorial, this in-memory database will be enough.

## Enabling User Registration on Spring Boot APIs

Now that we took a look at the endpoints that our *RESTful Spring Boot API* exposes, we are going to start securing it. The first step is to allow new users to register themselves. The classes that we will create in this feature will belong to a new package called `com.auth0.samples.authapi.user`. Let's create this package and add a new entity class called `ApplicationUser` to it:

```java
package com.auth0.samples.authapi.user;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class ApplicationUser {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	private String username;
	private String password;

	public long getId() {
		return id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
}
```

This entity contains three properties:

- the `id` that works as the primary identifier of an user instance in the application,
- the `username` that will be used by users to identify themselves,
- and the `password` which works as a passphrase to check the user identity.

To manage the persistence layer of this entity, we will create an interface called `ApplicationUserRepository`. This interface will be an extension of [`JpaRepository`](http://docs.spring.io/spring-data/jpa/docs/current/api/org/springframework/data/jpa/repository/JpaRepository.html)—which gives us access to some common methods like [`save`](http://docs.spring.io/spring-data/jpa/docs/current/api/org/springframework/data/jpa/repository/JpaRepository.html#save)—and will be created in the same package of the `User` class:

```java
package com.auth0.samples.authapi.user;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationUserRepository extends JpaRepository<ApplicationUser, Long> {
	ApplicationUser findByUsername(String username);
}
```

We have also added a method called `findByUsername` to this interface. This method will be used when we implement the authentication feature.

The endpoint that enables new users to register will be handled by a new [`@Controller` class](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/stereotype/Controller.html). We will call this controller as `UserController` and add it to the same package of the `User` class:

```java
package com.auth0.samples.authapi.user;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UserController {

	private ApplicationUserRepository applicationUserRepository;
	private BCryptPasswordEncoder bCryptPasswordEncoder;

	public UserController(ApplicationUserRepository applicationUserRepository,
						  BCryptPasswordEncoder bCryptPasswordEncoder) {
		this.applicationUserRepository = applicationUserRepository;
		this.bCryptPasswordEncoder = bCryptPasswordEncoder;
	}

	@PostMapping("/sign-up")
	public void signUp(@RequestBody ApplicationUser user) {
		user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
		applicationUserRepository.save(user);
	}
}
```

The implementation of the endpoint is quite simple. All it does is to encrypt the new user password (as holding it as plain text wouldn't be a good idea), and then save it to the database. The encrypt process is handled by an instance of [`BCryptPasswordEncoder`](https://docs.spring.io/spring-security/site/docs/current/apidocs/org/springframework/security/crypto/bcrypt/BCryptPasswordEncoder.html), which is a class that belongs to the *Spring Security* framework.

Right now we have two problems:

1. We didn't include the *Spring Security* framework as a dependency to our project.
2. There is no default instance of `BCryptPasswordEncoder` that can be injected in the `UserController` class.

The first problem we solve by adding the *Spring Security* framework dependency to the `./build.gradle` file:

```gradle
...

dependencies {
	...
	compile("org.springframework.boot:spring-boot-starter-security")
}
```

The second one, the missing `BCryptPasswordEncoder` instance, we solve by adding a `@Bean` definition in the `Application` class:

```java
package com.auth0.samples.authapi;

// ... other imports
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class Application {

	@Bean
	public BCryptPasswordEncoder bCryptPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}

	// ... main method definition
}
```

Running our application now, through the *IDE* or through `gradle bootRun`, will launch a version that already supports user registration:

```bash
# creates a new user in our API
curl -H "Content-Type: application/json" -X POST -d '{
    "username": "admin",
    "password": "password"
}' http://localhost:8080/users/sign-up
```

Unfortunately this is not enough. We do support user registration, but we lack support for user authentication and our endpoints are still available to the general public.

## User Authentication and Authorization on Spring Boot

To support both authentication and authorization in our application, we are going to create two filters and add them to the [*Spring Security Filter Chain*](http://docs.spring.io/spring-security/site/docs/current/reference/html/security-filter-chain.html). Alongside with these filters we will also have to create a custom implementation of [`UserDetailsService`](http://docs.spring.io/spring-security/site/docs/current/apidocs/org/springframework/security/core/userdetails/UserDetailsService.html), which is a class that helps *Spring Security* to load user-specific data. Besides that, to integrate these components in the security framework, we will extend the [`WebSecurityConfigurerAdapter`](http://docs.spring.io/spring-security/site/docs/current/apidocs/org/springframework/security/config/annotation/web/configuration/WebSecurityConfigurerAdapter.html) class.

### The Authentication Filter

Let's start by creating a new package called `com.auth0.samples.authapi.security`. On it, we will create our first filter, which is called `JWTAuthenticationFilter`:

```java
package com.auth0.samples.authapi.security;

import com.auth0.samples.authapi.user.ApplicationUser;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;

import static com.auth0.samples.authapi.security.SecurityConstants.EXPIRATION_TIME;
import static com.auth0.samples.authapi.security.SecurityConstants.HEADER_STRING;
import static com.auth0.samples.authapi.security.SecurityConstants.SECRET;
import static com.auth0.samples.authapi.security.SecurityConstants.TOKEN_PREFIX;

public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
	private AuthenticationManager authenticationManager;

	public JWTAuthenticationFilter(AuthenticationManager authenticationManager) {
		this.authenticationManager = authenticationManager;
	}

	@Override
	public Authentication attemptAuthentication(HttpServletRequest req,
												HttpServletResponse res) throws AuthenticationException {
		try {
			ApplicationUser creds = new ObjectMapper()
                    .readValue(req.getInputStream(), ApplicationUser.class);

			return authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(
							creds.getUsername(),
							creds.getPassword(),
							new ArrayList<>())
			);
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

	@Override
	protected void successfulAuthentication(HttpServletRequest req,
											HttpServletResponse res,
											FilterChain chain,
											Authentication auth) throws IOException, ServletException {

		String token = Jwts.builder()
				.setSubject(((User) auth.getPrincipal()).getUsername())
				.setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
				.signWith(SignatureAlgorithm.HS512, SECRET)
				.compact();
		res.addHeader(HEADER_STRING, TOKEN_PREFIX + " " + token);
	}
}
```

Note that our filter extends the [`UsernamePasswordAuthenticationFilter` class](http://docs.spring.io/spring-security/site/docs/current/apidocs/org/springframework/security/web/authentication/UsernamePasswordAuthenticationFilter.html). When we add a new filter to *Spring Security*, we can explicitly define where in the *filter chain* we want that filter, or we can let the framework figure it out by itself. By extending the filter provided within the Security framework

```bash
curl -i -H "Content-Type: application/json" -X POST -d '{
    "username": "admin",
    "password": "password"
}' http://localhost:8080/login

curl -H "Authorization: Bearer xxx.yyy.zzz" http://localhost:8080/tasks
```
