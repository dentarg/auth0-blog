---
layout: post
title: "Implementing JWT Authentication on Spring Boot APIs"
description: "Let's learn the correct way to secure Spring Boot RESTful APIs with JWTs."
date: 2017-08-10 18:23
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
- jwt
- java
- security
- RESTful APIs
related:
- 2017-04-28-incrementally-changing-your-database-with-java-and-flyway
- 2017-03-30-java-platform-and-java-community-process-overview
- 2017-05-09-developing-jsf-applications-with-spring-boot
---

**TL;DR** In this blog post, we will learn how to handle authentication and authorization on *RESTful APIs* written with *Spring Boot*. We will clone, from *GitHub*, a simple Spring Boot application that exposes public endpoints, and then we will secure these endpoints with *Spring Security* and *JWTS*.

## Securing RESTful APIs with JWTs

*JSON Web Tokens*, commonly known as JWTs, are tokens that are used to authenticate users on applications. This technology has gained popularity over the past few years because it enables backends to accept requests simply by validating the contents of these JWTS. That is, applications that use JWTS no longer have to hold cookies or other session data about their users. This characteristic facilitates scalability while keeping applications secure.

During the authentication process, when a user successfully logs in using their credentials, a JSON Web Token is returned and must be saved locally (typically in local storage). Whenever the user wants to access a protected route or resource (an endpoint), the user agent must send the JWT, usually in the `Authorization` header using the [*Bearer schema*](http://self-issued.info/docs/draft-ietf-oauth-v2-bearer.html), along with the request.

When a backend server receives a request with a JWT, the first thing to do is to validate the token. This consists of a series of steps, and if any of these fails then, the request must be rejected. The following list shows the validation steps needed:

- Check that the JWT is well formed
- Check the signature
- Validate the standard claims
- Check the Client permissions (scopes)

We won't get into the nitty-gritty details about JWTS in this article but, if needed, [this resource can provide more about information about JWTS](https://auth0.com/docs/jwt) and this [resource about JWT validation](https://auth0.com/docs/api-auth/tutorials/verify-access-token).

## The RESTful Spring Boot API Overview

The RESTful Spring Boot API that we are going to secure is a task list manager. The task list is kept globally, which means that all users will see and interact with the same list. To clone and run this application, let's issue the following commands:

```bash
# clone the starter project
git clone https://github.com/auth0-blog/spring-boot-auth.git

cd spring-boot-auth

# run the unsecured RESTful API
gradle bootRun
```

If everything works as expected, our RESTful Spring Boot API will be up and running. To test it, we can use a tool like [Postman](https://www.getpostman.com/) or [curl](https://curl.haxx.se/) to issue request to the available endpoints:

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

- `Task`: the entity model that represents tasks in the application.
- `TaskRepository`: the class responsible for handling the persistence of `Tasks`.

The persistence layer of our application is backed by an in-memory database called [*HSQLDB*](http://hsqldb.org/). We would typically use a production-ready database like *PostgreSQL* or *MySQL* on real applications, but for this tutorial this in-memory database will be enough.

## Enabling User Registration on Spring Boot APIs

Now that we took a look at the endpoints that our RESTful Spring Boot API exposes, we are going to start securing it. The first step is to allow new users to register themselves. The classes that we will create in this feature will belong to a new package called `com.auth0.samples.authapi.user`. Let's create this package and add a new entity class called `ApplicationUser` to it:

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

This entity class contains three properties:

- the `id` that works as the primary identifier of a user instance in the application,
- the `username` that will be used by users to identify themselves,
- and the `password` to check the user identity.

To manage the persistence layer of this entity, we will create an interface called `ApplicationUserRepository`. This interface will be an extension of [`JpaRepository`](http://docs.spring.io/spring-data/jpa/docs/current/api/org/springframework/data/jpa/repository/JpaRepository.html)—which gives us access to some common methods like [`save`](http://docs.spring.io/spring-data/jpa/docs/current/api/org/springframework/data/jpa/repository/JpaRepository.html#save)—and will be created in the same package of the `ApplicationUser` class:

```java
package com.auth0.samples.authapi.user;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationUserRepository extends JpaRepository<ApplicationUser, Long> {
	ApplicationUser findByUsername(String username);
}
```

We have also added a method called `findByUsername` to this interface. This method will be used when we implement the authentication feature.

The endpoint that enables new users to register will be handled by a new [`@Controller` class](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/stereotype/Controller.html). We will call this controller `UserController` and add it to the same package as the `ApplicationUser` class:

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

The implementation of the endpoint is quite simple. All it does is encrypt the password of the new user (holding it as plain text wouldn't be a good idea) and then save it to the database. The encryption process is handled by an instance of [`BCryptPasswordEncoder`](https://docs.spring.io/spring-security/site/docs/current/apidocs/org/springframework/security/crypto/bcrypt/BCryptPasswordEncoder.html), which is a class that belongs to the Spring Security framework.

Right now we have two gaps in our application:

1. We didn't include the Spring Security framework as a dependency to our project.
2. There is no default instance of `BCryptPasswordEncoder` that can be injected in the `UserController` class.

The first problem we solve by adding the Spring Security framework dependency to the `./build.gradle` file:

```gradle
...

dependencies {
	...
	compile("org.springframework.boot:spring-boot-starter-security")
}
```

The second problem, the missing `BCryptPasswordEncoder` instance, we solve by implementing a method that generates an instance of `BCryptPasswordEncoder`. This method must be annotated with `@Bean` and we will add it in the `Application` class:

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

This ends the user registration feature, but we still lack support for user authentication and authorization. Let's tackle these features next.

## User Authentication and Authorization on Spring Boot

To support both authentication and authorization in our application, we are going to:

- implement an authentication filter to issue JWTS to users sending credentials,
- implement an authorization filter to validate requests containing JWTS,
- create a custom implementation of [`UserDetailsService`](http://docs.spring.io/spring-security/site/docs/current/apidocs/org/springframework/security/core/userdetails/UserDetailsService.html) to help Spring Security loading user-specific data in the framework,
- and extend the [`WebSecurityConfigurerAdapter`](http://docs.spring.io/spring-security/site/docs/current/apidocs/org/springframework/security/config/annotation/web/configuration/WebSecurityConfigurerAdapter.html) class to customize the security framework to our needs.

Before proceeding to the development of these filters and classes, let's create a new package called `com.auth0.samples.authapi.security`. This package will hold all the code related to our app's security.

### The Authentication Filter

The first element that we are going to create is the class responsible for the authentication process. We are going to call this class `JWTAuthenticationFilter`, and we will implement it with the following code:

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
				.signWith(SignatureAlgorithm.HS512, SECRET.getBytes())
				.compact();
		res.addHeader(HEADER_STRING, TOKEN_PREFIX + token);
	}
}
```

Note that the authentication filter that we created extends the [`UsernamePasswordAuthenticationFilter` class](http://docs.spring.io/spring-security/site/docs/current/apidocs/org/springframework/security/web/authentication/UsernamePasswordAuthenticationFilter.html). When we add a new filter to Spring Security, we can explicitly define where in the *filter chain* we want that filter, or we can let the framework figure it out by itself. By extending the filter provided within the security framework, Spring can automatically identify the best place to put it in the security chain.

Our custom authentication filter overwrites two methods of the base class:

- `attemptAuthentication`: where we parse the user's credentials and issue them to the [`AuthenticationManager`](https://docs.spring.io/spring-security/site/docs/current/apidocs/org/springframework/security/authentication/AuthenticationManager.html).
- `successfulAuthentication`: which is the method called when a user successfully logs in. We use this method to generate a JWT for this user.

Our IDE will probably complain about the code in this class for two reasons. First, because the code imports four constants from a class that we haven't created yet, `SecurityConstants`. Second, because this class generates JWTS with the help of a class called `Jwts`, which belongs to a library that we haven't added as dependency to our project.

Let's solve the missing dependency first. In the `./build.gradle` file, let's add the following line of code:

```gradle
...

dependencies {
	...
	compile("io.jsonwebtoken:jjwt:0.7.0")
}
```

This will add the [Java JWT: JSON Web Token for Java and Android library](https://github.com/jwtk/jjwt) to our project, and will solve the issue of the missing classes. Now we have to create the `SecurityConstants` class:

```java
package com.auth0.samples.authapi.security;

public class SecurityConstants {
	public static final String SECRET = "SecretKeyToGenJWTs";
	public static final long EXPIRATION_TIME = 864_000_000; // 10 days
	public static final String TOKEN_PREFIX = "Bearer ";
	public static final String HEADER_STRING = "Authorization";
	public static final String SIGN_UP_URL = "/users/sign-up";
}
```

This class contains all four constants referenced by the `JWTAuthenticationFilter` class, alongside a `SIGN_UP_URL` constant that will be used later.

### The Authorization Filter

As we have implemented the filter responsible for authenticating users, we now need to implement the filter responsible for user authorization. We create this filter as a new class, called `JWTAuthorizationFilter`, in the `com.auth0.samples.authapi.security` package:

```java
package com.auth0.samples.authapi.security;

import io.jsonwebtoken.Jwts;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;

import static com.auth0.samples.authapi.security.SecurityConstants.HEADER_STRING;
import static com.auth0.samples.authapi.security.SecurityConstants.SECRET;
import static com.auth0.samples.authapi.security.SecurityConstants.TOKEN_PREFIX;

public class JWTAuthorizationFilter extends BasicAuthenticationFilter {

	public JWTAuthorizationFilter(AuthenticationManager authManager) {
		super(authManager);
	}

	@Override
	protected void doFilterInternal(HttpServletRequest req,
									HttpServletResponse res,
									FilterChain chain) throws IOException, ServletException {
		String header = req.getHeader(HEADER_STRING);

		if (header == null || !header.startsWith(TOKEN_PREFIX)) {
			chain.doFilter(req, res);
			return;
		}

		UsernamePasswordAuthenticationToken authentication = getAuthentication(req);

		SecurityContextHolder.getContext().setAuthentication(authentication);
		chain.doFilter(req, res);
	}

	private UsernamePasswordAuthenticationToken getAuthentication(HttpServletRequest request) {
		String token = request.getHeader(HEADER_STRING);
		if (token != null) {
			// parse the token.
			String user = Jwts.parser()
					.setSigningKey(SECRET.getBytes())
					.parseClaimsJws(token.replace(TOKEN_PREFIX, ""))
					.getBody()
					.getSubject();

			if (user != null) {
				return new UsernamePasswordAuthenticationToken(user, null, new ArrayList<>());
			}
			return null;
		}
		return null;
	}
}
```

We have extended the [`BasicAuthenticationFilter`](https://docs.spring.io/spring-security/site/docs/current/apidocs/org/springframework/security/web/authentication/www/BasicAuthenticationFilter.html) to make Spring replace it in the *filter chain* with our custom implementation. The most important part of the filter that we've implemented is the private `getAuthentication` method. This method reads the JWT from the `Authorization` header, and then uses [`Jwts`](https://github.com/jwtk/jjwt/blob/master/src/main/java/io/jsonwebtoken/Jwts.java) to validate the token. If everything is in place, we set the user in the [`SecurityContext`](https://docs.spring.io/spring-security/site/docs/current/apidocs/org/springframework/security/core/context/SecurityContext.html) and allow the request to move on.

### Integrating the Security Filters on Spring Boot

Now that we have both security filters properly created, we have to configure them on the Spring Security filter chain. To do that, we are going to create a new class called `WebSecurity` in the `com.auth0.samples.authapi.security` package:

```java
package com.auth0.samples.authapi.security;

import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.context.annotation.Bean;

import static com.auth0.samples.authapi.security.SecurityConstants.SIGN_UP_URL;

@EnableWebSecurity
public class WebSecurity extends WebSecurityConfigurerAdapter {
	private UserDetailsService userDetailsService;
	private BCryptPasswordEncoder bCryptPasswordEncoder;

	public WebSecurity(UserDetailsService userDetailsService, BCryptPasswordEncoder bCryptPasswordEncoder) {
		this.userDetailsService = userDetailsService;
		this.bCryptPasswordEncoder = bCryptPasswordEncoder;
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.cors().and().csrf().disable().authorizeRequests()
				.antMatchers(HttpMethod.POST, SIGN_UP_URL).permitAll()
				.anyRequest().authenticated()
				.and()
				.addFilter(new JWTAuthenticationFilter(authenticationManager()))
				.addFilter(new JWTAuthorizationFilter(authenticationManager()))
				// this disables session creation on Spring Security
				.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
	}

	@Override
	public void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(userDetailsService).passwordEncoder(bCryptPasswordEncoder);
	}

  @Bean
  CorsConfigurationSource corsConfigurationSource() {
    final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", new CorsConfiguration().applyPermitDefaultValues());
    return source;
  }
}
```

We have annotated this class with `@EnableWebSecurity` and made it extend `WebSecurityConfigurerAdapter` to take advantage of the default [web security configuration provided by Spring Security](https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-security.html). This allows us to fine-tune the framework to our needs by defining three methods:

- `configure(HttpSecurity http)`: a method where we can define which resources are public and which are secured. In our case, we set the `SIGN_UP_URL` endpoint as being public and everything else as being secured. We also configure CORS (Cross-Origin Resource Sharing) support through `http.cors()` and we add a custom security filter in the Spring Security filter chain.
- `configure(AuthenticationManagerBuilder auth)`: a method where we defined a custom implementation of [`UserDetailsService`](https://docs.spring.io/spring-security/site/docs/current/apidocs/org/springframework/security/core/userdetails/UserDetailsService.html) to load user-specific data in the security framework. We have also used this method to set the encrypt method used by our application (`BCryptPasswordEncoder`).
- `corsConfigurationSource()`: a method where we can allow/restrict our CORS support. In our case we left it wide open by permitting requests from any source (`/**`).

Spring Security doesn't come with a concrete implementation of `UserDetailsService` that we could use out of the box with our in-memory database. Therefore, we create a new class called `UserDetailsServiceImpl` in the `com.auth0.samples.authapi.user` package to provide one:

```java
package com.auth0.samples.authapi.user;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import static java.util.Collections.emptyList;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
	private ApplicationUserRepository applicationUserRepository;

	public UserDetailsServiceImpl(ApplicationUserRepository applicationUserRepository) {
		this.applicationUserRepository = applicationUserRepository;
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		ApplicationUser applicationUser = applicationUserRepository.findByUsername(username);
		if (applicationUser == null) {
			throw new UsernameNotFoundException(username);
		}
		return new User(applicationUser.getUsername(), applicationUser.getPassword(), emptyList());
	}
}
```

The only method that we had to implement is `loadUserByUsername`. When a user tries to authenticate, this method receives the username, searches the database for a record containing it, and (if found) returns an instance of `User`. The properties of this instance (`username` and `password`) are then checked against the credentials passed by the user in the login request. This last process is executed outside this class, by the Spring Security framework.

We can now rest assured that our endpoints won't be publicly exposed and that we can support authentication and authorization with JWTS on Spring Boot properly. To check everything, let's run our application (through the IDE or through `gradle bootRun`) and issue the following requests:

```bash
# issues a GET request to retrieve tasks with no JWT
# HTTP 403 Forbidden status is expected
curl http://localhost:8080/tasks

# registers a new user
curl -H "Content-Type: application/json" -X POST -d '{
    "username": "admin",
    "password": "password"
}' http://localhost:8080/users/sign-up

# logs into the application (JWT is generated)
curl -i -H "Content-Type: application/json" -X POST -d '{
    "username": "admin",
    "password": "password"
}' http://localhost:8080/login

# issue a POST request, passing the JWT, to create a task
# remember to replace xxx.yyy.zzz with the JWT retrieved above
curl -H "Content-Type: application/json" \
-H "Authorization: Bearer xxx.yyy.zzz" \
-X POST -d '{
    "description": "Buy watermelon"
}'  http://localhost:8080/tasks

# issue a new GET request, passing the JWT
# remember to replace xxx.yyy.zzz with the JWT retrieved above
curl -H "Authorization: Bearer xxx.yyy.zzz" http://localhost:8080/tasks
```

{% include asides/spring-boot.markdown %}

## Conclusion

Securing RESTful Spring Boot API with JWTS is not a hard task. This article showed that by creating a couple of classes and extending a few others provided by Spring Security, we can protect our endpoints from unknown users, enable users to register themselves, and authenticate existing users based on JWTS.

Of course that for a production-ready application we would need a few more features, like password retrieval, but the article demystified the most sensible parts of dealing with JWTS to authorize requests on Spring Boot applications.
