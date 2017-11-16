---
layout: post
title: "Spring 5, Embedded Tomcat 8, and Gradle: a Quick Tutorial"
description: "Let's learn how to use Gradle to structure and bootstrap a Spring 5 project running on an embedded Tomcat 8 instance."
date: 2017-11-16 09:48
category: Technical Guide, Java, Spring
author:
  name: "Bruno Krebs"
  url: "https://twitter.com/brunoskrebs"
  mail: "bruno.krebs@auth0.com"
  avatar: "https://www.gravatar.com/avatar/76ea40cbf67675babe924eecf167b9b8?s=60"
design:
  bg_color: "#1B1C20"
  image: https://cdn.auth0.com/blog/spring5-embedded/logo-spring-tomcat-gradle.png
tags:
- spring
- tomcat
- embedded
- java
- gradle
related:
- 2017-08-10-implementing-jwt-authentication-on-spring-boot
- 2017-04-28-incrementally-changing-your-database-with-java-and-flyway
- 2017-08-31-integrating-spring-data-jpa-postgresql-liquibase
---

**TL;DR:** In this article, we are going to learn how to use Gradle to structure a Spring 5 project with Tomcat 8 embedded. We will start from an empty directory and will analyze each step needed to create an application that is distributed as an über/fat jar. [This GitHub repository](https://github.com/auth0-blog/embedded-spring-5) contains a branch called `complete` with the final code that we will have after following the steps described here.

## Why Spring

[Spring](https://spring.io/) is [the most popular framework available for the Java platform](https://zeroturnaround.com/rebellabs/java-web-frameworks-index-by-rebellabs/). Developers using Spring can count on a huge, thriving community that is always ready to help. For example, [the framework contains more than 11k forks on GitHub](https://github.com/spring-projects/spring-framework) and [more than 120k questions asked on StackOverflow](https://stackoverflow.com/questions/tagged/spring) are related to it. Besides that, Spring provides extensive and up-to-date documentation that covers the inner workings of the framework.

As such, when starting a new Java project, Spring is an option that **must** be considered.

### Spring vs. Spring Boot

In the past, Spring was known for being hard to set up and for depending on huge configuration files. This was not a big problem as most of the applications out there were [monoliths](https://en.wikipedia.org/wiki/Monolithic_application). This kind of application usually supports many different areas and solves a wide variety of problems inside companies. Therefore, it was quite common to know companies that had only one or two applications to support their daily operations. In scenarios like that, having these huge configuration files and a hard process to set up a new project was not a problem.

However, this paradigm is getting outdated. Nowadays, many companies around the world are relying more on the [microservices architecture and its benefits](https://auth0.com/blog/an-introduction-to-microservices-part-1/). As this architecture relies on multiple applications, each one specialized in a particular subject, using a framework that is hard to setup was something that developers were starting to avoid. This is why the team responsible for Spring decided to create a new project called Spring Boot.

As described in [the official site of the Spring Boot framework](https://projects.spring.io/spring-boot/), this framework makes it easy to create stand-alone, production-grade Spring based applications that "just run". They decided to take an opinionated view of the Spring platform and third-party libraries so we can get started with minimal work.

## Why Embedded Tomcat 8

First of all, let's understand what _embedded_ means. For a long time, Java developers shipped their applications as `war` (Web ARchive) and `ear` (Enterprise ARchive) files. These files, after being bundled, were deployed on application servers (like Tomcat, WildFly, WebSphere, etc.) that were already up and running on production servers. For the last couple of years, developers around the world started changing this paradigm. Instead of shipping applications that had to be deployed on running servers, they started shipping applications that contain the server inside the bundle. That is, they started creating `jar` (Java ARchive) files that are executable and that starts the server programmatically.

What triggered this change is that the new approach has many advantages. For example:

1. To run a new instance of the application, it is just a matter of executing a single command.
2. All dependencies of the application are declared explicitly in the application code.
3. The responsibility for running the application isn’t spread across different teams.
4. The application is guaranteed to be run in the correct server version, mitigating issues.

Also, as this approach fits perfectly in the microservices architecture that is eating the software development world, it makes sense to embed application servers. That's why we will learn how to embed Tomcat 8, the most popular Java server, on Spring applications.

{% include tweet_quote.html quote_text="Embedding Tomcat 8 in Spring 5 apps is easy!" %}

## Why Gradle

When it comes to dependency management and build tools on Java projects, there are two mainstream solutions to choose from: [Gradle](https://gradle.org/) and [Maven](https://maven.apache.org/). Both solutions are supported by huge communities, are constantly being developed, and are stable and extensible. Besides that, both Maven and Gradle fetch dependencies on similar ways and from similar sources (usually from Maven repositories). In the end, choosing one solution or another is normally just a matter of taste or familiarity. There are certain [edge scenarios that one solution performs better than the other](https://www.journaldev.com/7971/gradle). However, in most cases, both solutions will attend all our needs.

In this article, we are going to use Gradle for one singular reason: brevity. Maven configuration files are usually too verbose (they are expressed on XML files). On the other hand, Gradle configuration files are expressed on [Groovy](http://groovy-lang.org/), a JVM dynamic programming language known for having a concise and tidy syntax.

## Creating the Project

Now that we understand why we chose to use Gradle, Spring 5, and an embedded Tomcat 8 server, let's see how to put all these pieces together. The first thing that we will do is to clone an empty Gradle project. After that, we will explore adding the Tomcat 8 dependency and how to bootstrap it programmatically. Lastly, we will see how to configure and secure a Spring 5 project that works as a RESTful API and that handles JSP (JavaServer Pages) files.

### Cloning the Gradle Project

There are multiple ways we can create a new Gradle project. For example, if we have Gradle installed on our machines, we could easily issue `gradle init` to get the basic files created for ourselves. However, to avoid having to install Gradle everywhere, we will clone a [GitHub repository](https://github.com/auth0-blog/spring5-app) that already contains these files. The following commands will clone the repository for us and create the main package:

```bash
# clone basic files
git clone https://github.com/auth0-blog/spring5-app.git

# change working directory to it
cd spring5-app

# create the main package
mkdir -p src/main/java/com/auth0/samples/
```

After executing the last command, we will have the `com.auth0.sample` package and all the Gradle files that we will need.

### Embedding Tomcat 8

To embed and bootstrap an instance of Tomcat 8, the first thing we need to do is to add it as a dependency to our project. We do that by adding a single line to the `dependencies` section of the `build.gradle` file, as shown below:

```groovy
// ...
dependencies {
    compile('org.apache.tomcat.embed:tomcat-embed-jasper:8.0.47')
}
```

After adding the Tomcat 8 dependency, we have to create a class called `Main` in the `com.auth0.samples` package to bootstrap the server:

```java
package com.auth0.samples;

import org.apache.catalina.startup.Tomcat;

import java.io.File;
import java.io.IOException;

public class Main {
    private static final int PORT = 8080;

    public static void main(String[] args) throws Exception {
        String appBase = ".";
        Tomcat tomcat = new Tomcat();
        tomcat.setBaseDir(createTempDir());
        tomcat.setPort(PORT);
        tomcat.getHost().setAppBase(appBase);
        tomcat.addWebapp("", appBase);
        tomcat.start();
        tomcat.getServer().await();
    }

    // based on AbstractEmbeddedServletContainerFactory
    private static String createTempDir() {
        try {
            File tempDir = File.createTempFile("tomcat.", "." + PORT);
            tempDir.delete();
            tempDir.mkdir();
            tempDir.deleteOnExit();
            return tempDir.getAbsolutePath();
        } catch (IOException ex) {
            throw new RuntimeException(
                    "Unable to create tempDir. java.io.tmpdir is set to " + System.getProperty("java.io.tmpdir"),
                    ex
            );
        }
    }
}
```

As we can see, running an instance of Tomcat 8 programmatically is quite easy. We just create a new instance of the `Tomcat` class, set a few properties on it, and call the `start()` method. Two things worth mentioning are:

1. The server port is hardcoded in the code above (`8080`).
2. Even though we won't use it, the latest version of Tomcat requires us to define a base directory. Therefore, we simply create a temporary directory (through the `createTempDir()` method) that is marked to be excluded when the JVM ends its execution.

### Bootstrapping Spring 5

Having the Tomcat 8 dependency configured and the code to initialize the server created, we can now focus on configuring Spring 5 in our project. The first step is to add the [`spring-webmvc`](https://docs.spring.io/spring/docs/current/spring-framework-reference/web.html) dependency. To do that, let's open the `build.gradle` file and add the following line to the `dependencies` section:

```groovy
// ...
dependencies {
    // ... tomcat dependency
    compile('org.springframework:spring-webmvc:5.0.1.RELEASE')
}
```

This is the only Spring dependency that we will need for the time being. We don't need to add [`spring-core`](https://docs.spring.io/spring/docs/current/spring-framework-reference/core.html) explicitly because `spring-webmvc` declares it as a transitive dependency. Gradle downloads this kind of dependency and makes it available in the scopes needed automatically.

The next step is to create the class that we will use to configure Spring 5 programmatically. We will call this class `SpringAppConfig` and create it in the `com.auth0.samples` package with the following code:

```java
package com.auth0.samples;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.WebApplicationInitializer;
import org.springframework.web.context.ContextLoaderListener;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import javax.servlet.ServletContext;
import javax.servlet.ServletRegistration;

@Configuration
@EnableWebMvc
@ComponentScan(basePackages = {"com.auth0.samples"})
public class SpringAppConfig implements WebApplicationInitializer {

    @Override
    public void onStartup(ServletContext container) {
        // Create the 'root' Spring application context
        AnnotationConfigWebApplicationContext rootContext = new AnnotationConfigWebApplicationContext();
        rootContext.register(SpringAppConfig.class);

        // Manage the lifecycle of the root application context
        container.addListener(new ContextLoaderListener(rootContext));

        // Create the dispatcher servlet's Spring application context
        AnnotationConfigWebApplicationContext dispatcherContext = new AnnotationConfigWebApplicationContext();

        // Register and map the dispatcher servlet
        ServletRegistration.Dynamic dispatcher = container
                .addServlet("dispatcher", new DispatcherServlet(dispatcherContext));
        dispatcher.setLoadOnStartup(1);
        dispatcher.addMapping("/");
    }
}
```

To better understand what this class does, let's take a look at its key concepts. First, let's analyze the three annotations that we added to the class:

- `@Configuration`: This annotation indicates that the class in question might create Spring beans programmatically. This annotation is required by the next one.
- `@EnableWebMvc`: This annotation, used alongside with `@Configuration`, [makes Spring import the configuration needed to work as a MVC framework](https://docs.spring.io/spring/docs/5.0.1.RELEASE/javadoc-api/org/springframework/web/servlet/config/annotation/WebMvcConfigurationSupport.html).
- `@ComponentScan`: This annotation makes Spring scan the packages configured (i.e., `com.auth0.samples`) to assemble Spring beans (like MVC controllers) for us.

The next important concept that we need to understand is the [`WebApplicationInitializer`](https://docs.spring.io/spring/docs/5.0.1.RELEASE/javadoc-api/org/springframework/web/WebApplicationInitializer.html) interface. Implementing this interface makes Spring automatically detect our configuration class and also makes any Servlet 3.0+ environment (like Tomcat 8) run it through the [`SpringServletContainerInitializer`](https://docs.spring.io/spring/docs/5.0.1.RELEASE/javadoc-api/org/springframework/web/SpringServletContainerInitializer.html) class. That is, we are capable of bootstrapping a Spring 5 context only by implementing this class.

The last important thing that we need to analyze is the implementation of the `onStartup` method. When Spring executes our `WebApplicationInitializer` extension, this is the method that it calls. In this method, we do two things. First, we start a Spring context that accepts annotated classes and register our main Spring configuration class on it. Like that, every other component that we define through annotations will be properly managed. Second, we register a `DispatcherServlet` instance to handle and dispatch incoming requests to the controllers that we create.

We now have a project that bootstraps a Spring 5 context automatically when started. To test it, let's create a new package called `com.auth0.samples.controller` and add to it a class named `HelloWorldController` with the following code:

```java
package com.auth0.samples.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/hello")
public class HelloWorldController {
    @GetMapping
    public String sayHello() {
        return "Hello from Spring 5 and embedded Tomcat 8!";
    }
}
```

The only way to run this project now is through an IDE. As we don't want to be dependent on IDEs, it is a good time to learn how to package the application in a single, executable `jar` file.

### Creating an Executable Distribution

To make Gradle package our application as an executable `jar` file (also called fat/über jar), we will take advantage of a popular Gradle plugin called [Shadow](http://imperceptiblethoughts.com/shadow/). This plugin is easy to use, well supported by the community, and has a great, thorough documentation. To configure it, let's replace the contents of the `build.gradle` file with the following code:

```groovy
group 'com.auth0.samples'
version '1.0-SNAPSHOT'

apply plugin: 'java'

// 1 - apply application and shadow plugins
apply plugin: 'application'
apply plugin: 'com.github.johnrengelman.shadow'

sourceCompatibility = 1.8
targetCompatibility = 1.8
mainClassName = 'com.auth0.samples.Main'

// 2 - define the dependency to the shadow plugin
buildscript {
    repositories {
        jcenter()
    }
    dependencies {
        classpath 'com.github.jengelman.gradle.plugins:shadow:2.0.1'
    }
}

// 3 - merge service descriptors
shadowJar {
    mergeServiceFiles()
}

repositories {
    jcenter()
}

dependencies {
    compile group: 'org.apache.tomcat.embed', name: 'tomcat-embed-jasper', version: '8.0.47'
    compile group: 'org.springframework', name: 'spring-webmvc', version: '5.0.1.RELEASE'
}
```

There are three things that we need to understand in the script above:

1. To use Shadow, we need to apply two plugins. The first one is the [`application`](https://docs.gradle.org/current/userguide/application_plugin.html) plugin, which adds useful tasks to package compiled Java classes (note that this plugin doesn't add dependencies to the package created). The second one is the Shadow plugin itself, which is responsible for defining the main class to be executed and also adds all runtime dependencies to the final `jar` file.
2. We need to declare the dependency to the Shadow plugin in the [buildscript block](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block) of our Gradle configuration file.
3. We need to configure the Shadow plugin to [merge service descriptor files](http://imperceptiblethoughts.com/shadow/#controlling_jar_content_merging). This is needed because the `SpringServletContainerInitializer` class mentioned before is a service declared in a service descriptor inside Spring 5. The servlet container (Tomcat 8 in our case) knows that it needs to execute this class due to this service descriptor.

The Shadow plugin, when correctly configured, adds a few [tasks](http://imperceptiblethoughts.com/shadow/#default_java_groovy_tasks) to our build configuration. Among them, there are two that we will use frequently:

```bash
# compile, package, and run the application
./gradlew runShadow

# compile and package the application
./gradlew shadowJar

# run the packaged application
java -jar build/libs/spring5-app-1.0-SNAPSHOT-all.jar
```

The `runShadow` does three things: it compiles our source code, packages our application on an executable fat/über `jar` file, and then executes this `jar`. The second one, `shadowJar`, is pretty similar but it does not execute the application. It simply prepares our application to be distributed. That is, it creates the executable `jar` file. The last command included in the code snippet above shows how to execute the fat/über `jar` without Gradle. Yes, after packaging the application, we don't need Gradle anymore.

Let's run the application now and issue a `GET` HTTP request to the endpoint created in the `HelloWorldController` class:

```bash
# run the application
./gradlew runShadow

# issue a GET request
curl localhost:8080/hello
```

The response to this request will be the message defined in the `sayHello` method of our controller: "Hello from Spring 5 and embedded Tomcat 8!".

### Supporting JSON Content on Spring 5

Without question, one of the most used message formats on applications today is [JSON](http://www.json.org/). RESTful APIs usually use this kind of message format to communicate with front-end clients written for a wide variety of devices (e.g. Android and iOS phones, web browsers, wearable devices, etc.). In Spring 5, adding support to JSON is very easy. It's just a matter of adding [Jackson](https://github.com/FasterXML/jackson) as a dependency and we are ready to start writing controllers that exchange JSON messages.

To see this in action, let's open the `build.gradle` file and add the following dependency:

```groovy
// ...
dependencies {
    // ... Tomcat 8 and Spring 5 dependencies
    compile group: 'com.fasterxml.jackson.core', name: 'jackson-databind', version: '2.9.2'
}
```

After that, let's create a new package called `model` inside the `com.auth0.samples` package and add a class called `Product` to it:

```java
package com.auth0.samples.model;

import java.math.BigDecimal;

public class Product {
    private String title;
    private BigDecimal price;

    public Product() { }

    public Product(String title, BigDecimal price) {
        this.title = title;
        this.price = price;
    }

    public String getTitle() {
        return title;
    }

    public BigDecimal getPrice() {
        return price;
    }
}
```

We will use this class to do two things: to send and accept JSON messages that contain product details. Let's create a new controller called `ProductController` in the `com.auth0.samples.controller` package to exchange products as JSON messages:

```java
package com.auth0.samples.controller;

import com.auth0.samples.model.Product;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final List<Product> products = new ArrayList<>();

    public ProductController() {
        products.add(new Product("Coca-cola", BigDecimal.valueOf(2.36)));
        products.add(new Product("Bread", BigDecimal.valueOf(1.7)));
    }

    @GetMapping
    public List<Product> getProducts() {
        return products;
    }

    @PostMapping
    public void addProduct(@RequestBody Product product) {
        products.add(product);
    }

    @DeleteMapping("/{index}")
    public void deleteProduct(@PathVariable int index) {
        products.remove(index);
    }
}
```

This class is quite simple; it's just a [Spring MVC `@RestController`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/bind/annotation/RestController.html) that exposes three methods/endpoints:

- `getProducts`: This endpoint, when hit by a HTTP `GET` request, sends all `products` in a JSON array.
- `addProduct`: This endpoint, when hit by a HTTP `POST` request, accepts new products as JSON messages.
- `deleteProduct`: This endpoint, when hit by a HTTP `DELETE` request, removes a product from the array of products based on the `index` sent by the user.

After creating this controller, we are ready to send and receive JSON messages. To test this new feature, let's start our application (`./gradlew runShadow`) and issue the following commands:

```bash
# get the array of products
curl localhost:8080/api/products

# remove product in the second position of the array
# (arrays are 0 indexed)
curl -X DELETE localhost:8080/api/products/1

# add a new product to the array
curl -X POST -H "Content-Type: application/json" -d '{
  "title": "Milk",
  "price": 0.95
}' localhost:8080/api/products
```

{% include tweet_quote.html quote_text="Spring 5 can be easily secured with JWTs." %}

### Securing Spring 5 Applications with Auth0

Another feature that serious applications cannot overlook is security. In modern applications, personal and sensitive data is being exchanged between clients and servers like never before. Luckily, with the help of [Auth0](https://auth0.com/), adding a production-ready security layer to a Spring 5 project is easy. We just need to use and configure an [open-source library](https://github.com/auth0/auth0-spring-security-api), provided by Auth0, which tightly integrates with Spring Security (the security module of Spring). Let's see how to do this now.

The first step is to open our `build.gradle` file and do four things: Add a new maven repository, add the Auth0 library dependency, add the `spring-security-config` library, and add the `spring-security-web` library:

```groovy
// ...

repositories {
    jcenter()
    maven {
        url 'http://repo.spring.io/milestone/'
    }
}

dependencies {
    // ... tomcat, spring, jackson
    compile('com.auth0:auth0-spring-security-api:1.0.0-rc.3') {
        exclude module: 'spring-security-config'
        exclude module: 'spring-security-core'
        exclude module: 'spring-security-web'
    }
    compile('org.springframework.security:spring-security-config:5.0.0.RC1')
    compile('org.springframework.security:spring-security-web:5.0.0.RC1')
}
```

Adding a new Maven repository was needed because we are going to use Spring Security 5, a version of this module that hasn't reached [General Availability](https://en.wikipedia.org/wiki/Software_release_life_cycle#General_availability_.28GA.29) yet. Besides that, we explicitly removed `spring-security-*` transitive dependencies from the Auth0 library because they reference the fourth version of Spring Security.

After changing our build file, we have to create a class to configure Spring Security and the Auth0 library. Let's call this class `WebSecurityConfig` and add it in the `com.auth0.samples` package:

```java
package com.auth0.samples;

import com.auth0.spring.security.api.JwtWebSecurityConfigurer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;

@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    private static final String TOKEN_AUDIENCE = "spring5";
    private static final String TOKEN_ISSUER = "https://bkrebs.auth0.com/";
    private static final String API_ENDPOINT = "/api/**";
    private static final String PUBLIC_URLS = "/**";

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        JwtWebSecurityConfigurer
                .forRS256(TOKEN_AUDIENCE, TOKEN_ISSUER)
                .configure(http)
                .authorizeRequests()
                .mvcMatchers(API_ENDPOINT).fullyAuthenticated()
                .mvcMatchers(PUBLIC_URLS).permitAll()
                .anyRequest().authenticated().and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
    }
}
```

This class contains four constants:

- `TOKEN_AUDIENCE` is the [JWT audience](https://tools.ietf.org/html/rfc7519#section-4.1.3) that we expect to see in JWT claims.
- `TOKEN_ISSUER` is the issuer that we expect to see on these JWTs.
- `API_ENDPOINT` is a regular expression that we use to restrict access to all URLs under `/api`.
- `PUBLIC_URLS` is a regular expression that we use to identify every other URL.

Besides these constants, the `WebSecurityConfig` class contains only one method. This method is used to fine-tune the Spring Security module to use Auth0 and to configure how different URLs must be treated. For example, `.mvcMatchers(API_ENDPOINT).fullyAuthenticated()` configures Spring Security to accept only authenticated requests (requests with JWTs) to URLs that start with `/api`.

The last thing we need to do is to create a class that extends the `AbstractSecurityWebApplicationInitializer` class provided by Spring Security. [This is needed to apply the `springSecurityFilterChain` filter for every URL in our application](https://docs.spring.io/spring-security/site/docs/current/reference/html/jc.html#abstractsecuritywebapplicationinitializer-with-spring-mvc). Therefore, let's call our class `SecurityWebApplicationInitializer` and add it in the `com.auth0.samples` package:

```java
package com.auth0.samples;

import org.springframework.security.web.context.AbstractSecurityWebApplicationInitializer;

public class SecurityWebApplicationInitializer extends AbstractSecurityWebApplicationInitializer {
}
```

Now we can restart our application (e.g. `./gradlew runShadow`) and issue requests as follows:

```bash
# issuing requests to unsecured endpoints
curl localhost:8080/hello

# issuing requests to secured endpoints
CLIENT_ID="d85mVhuL6EPYitTES37pA8rbi716IYCA"
CLIENT_SECRET="AeeFp-g5YGwxFOWwLVMdxialnxOnoyuwGXoE5kPiHs8kGJeC2FJ0BCj6xTLlNKkY"

JWT=$(curl -X POST -H 'content-type: application/json' -d '{
    "client_id": "'$CLIENT_ID'",
    "client_secret": "'$CLIENT_SECRET'",
    "audience":"spring5",
    "grant_type":"client_credentials"
}' https://bkrebs.auth0.com/oauth/token | jq .access_token)

curl -H "Authorization: Bearer "$JWT http://localhost:8080/products
```

As we can see in the code snippet above, issuing requests to unsecured endpoints has not changed. Besides that, we can see that issuing requests to secured endpoints now need an `Authorization` header with a JWT. In this case, we need to fetch a valid JWT from Auth0 (note that we use a command-line JSON processor called [`jq`](https://github.com/stedolan/jq) to extract the JWT to a bash variable). After that, we append this JWT to the `Authorization` of every request we issue to secured endpoints.

Another important thing that we need to note is that the commands above are using two bash variables: `CLIENT_ID` and `CLIENT_SECRET`. These variables were extracted from an API configured on a [free Auth0 account](https://auth0.com/pricing). To learn more about APIs and Auth0, take a look at [the official documentation](https://auth0.com/docs/quickstart/backend/java-spring-security/01-authorization).

## Conclusion

Throughout this article, we learned about some interesting topics like embedded application servers and how to configure a Spring 5 project to use one. We also learned how to create a Java executable file using a Gradle plugin called Shadow and how to add support to JSON messages on Spring 5. Lastly, we saw that configuring a security layer on a Spring 5 project is straightforward.

Having managed to address all these topics in a short article like that is proof that Spring 5 is becoming more like Spring Boot. Although Spring Boot is a few miles ahead when talking about ease of use, we can see that it's quite easy to bootstrap Spring 5 applications that support essential features like JSON messages and security.
