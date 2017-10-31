---
layout: post
title: "Spring 5, Embedded Tomcat 8, and Gradle: a Quick Tutorial"
description: "Let's learn how to use Gradle to structure and bootstrap a Spring 5 project running on an embedded Tomcat 8 instance."
date: 2017-10-30 09:48
category: Technical Guide, Java, Spring
author:
  name: "Bruno Krebs"
  url: "https://twitter.com/brunoskrebs"
  mail: "bruno.krebs@auth0.com"
  avatar: "https://www.gravatar.com/avatar/76ea40cbf67675babe924eecf167b9b8?s=60"
design:
  bg_color: "#3F6426"
  image: https://cdn.auth0.com/blog/spring-boot-auth/logo.png
tags:
- spring
- tomcat
- embedded
- java
- gradle
related:
- 2017-08-10-implementing-jwt-authentication-on-spring-boot
- 2017-04-28-incrementally-changing-your-database-with-java-and-flyway
---

**TL;DR:** In this article, we are going to learn how to use Gradle to structure a Spring 5 project with Tomcat 8 embedded. We will start from an empty directory and will analyze each step needed to create an application that is distributed as an über/fat jar. [This GitHub repository](https://github.com/auth0-blog/embedded-spring-5) is what we will get after following the steps describe here.

## Why Spring 5

[Spring](https://spring.io/) is [the most popular framework available for the Java platform](https://zeroturnaround.com/rebellabs/java-web-frameworks-index-by-rebellabs/). As such, developers using Spring can count on a huge, thriving community. [The framework contains more than 11k forks on GitHub](https://github.com/spring-projects/spring-framework) and [more than 120k question asked on StackOverflow](https://stackoverflow.com/questions/tagged/spring) are related to it.

This framework enables developers to easily create robust Java enterprise applications.

### Spring vs Spring Boot

## Why Embedded Tomcat 8

## Why Gradle

## Creating the Project

### Generating a Gradle Project

talk about installing Gradle
talk about gradle wrapper

```bash
git clone https://github.com/auth0-blog/spring5-app.git
cd spring5-app
mkdir -p src/main/java/com/auth0/samples/
```

### Embedding Tomcat 8

```groovy
// ...
dependencies {
    compile group: 'org.apache.tomcat.embed', name: 'tomcat-embed-jasper', version: '8.0.47'
}
```

create new file `Main` in the `com.auth0.samples` package:

```java
package com.auth0.samples;

import org.apache.catalina.startup.Tomcat;

import java.io.File;
import java.io.IOException;

public class Main {
    private static final int PORT = getPort();

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

    private static int getPort() {
        String port = System.getenv("PORT");
        if (port != null) {
            return Integer.valueOf(port);
        }
        return 8080;
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

### Bootstrapping Spring 5

```groovy
// ...
dependencies {
    compile group: 'org.apache.tomcat.embed', name: 'tomcat-embed-jasper', version: '8.0.47'
    compile group: 'org.springframework', name: 'spring-webmvc', version: '5.0.1.RELEASE'
}
```

create new file `SpringAppConfig` in the `com.auth0.samples` package:

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

Create new package `com.auth0.samples.controller` and add new class `HelloWorldController`:

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

**Talk about WebApplicationInitializer and SpringServletContainerInitializer**

### Supporting JSON Content on Spring 5

```groovy
// ...
dependencies {
    // ... Tomcat 8 and Spring 5 dependencies
    compile group: 'com.fasterxml.jackson.core', name: 'jackson-databind', version: '2.9.2'
}
```

Create `com.auth0.samples.model` package and add a `Product` class to it:

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

Create a new controller called `ProductController` in the `com.auth0.samples.controller` package:

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
@RequestMapping("/products")
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

### Creating an Executable Distribution

```groovy
group 'com.auth0.samples'
version '1.0-SNAPSHOT'

apply plugin: 'java'
apply plugin: 'application'
apply plugin: 'com.github.johnrengelman.shadow'

sourceCompatibility = 1.8
targetCompatibility = 1.8
mainClassName = 'com.auth0.samples.Main'

buildscript {
    repositories {
        jcenter()
    }
    dependencies {
        classpath 'com.github.jengelman.gradle.plugins:shadow:2.0.1'
    }
}

shadowJar {
    mergeServiceFiles()
}

repositories {
    jcenter()
}

dependencies {
    compile group: 'org.apache.tomcat.embed', name: 'tomcat-embed-jasper', version: '8.0.47'
    compile group: 'org.springframework', name: 'spring-webmvc', version: '5.0.1.RELEASE'
    compile group: 'com.fasterxml.jackson.core', name: 'jackson-databind', version: '2.9.2'
}
```

```bash
./gradlew runShadow

./gradlew shadowJar
java -jar build/libs/spring5-app-1.0-SNAPSHOT-all.jar
```

```bash
curl localhost:8080/products

curl -X DELETE localhost:8080/products/1

curl -X POST -H "Content-Type: application/json" -d '{
  "title": "Milk",
  "price": 0.95
}' localhost:8080/products
```

### Securing Spring 5 Applications with Auth0

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

Create a class called `WebSecurityConfig` in the `com.auth0.samples` package:

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
    private static final String HELLO_WORLD_ENDPOINT = "/hello";

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        JwtWebSecurityConfigurer
                .forRS256(TOKEN_AUDIENCE, TOKEN_ISSUER)
                .configure(http)
                .authorizeRequests()
                .antMatchers(HELLO_WORLD_ENDPOINT).permitAll()
                .anyRequest().authenticated().and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
    }
}
```

Create a class called `SecurityWebApplicationInitializer` in the `com.auth0.samples` package:

```java
package com.auth0.samples;

import org.springframework.security.web.context.AbstractSecurityWebApplicationInitializer;

public class SecurityWebApplicationInitializer extends AbstractSecurityWebApplicationInitializer {
}
```

```bash
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

## Conclusion
