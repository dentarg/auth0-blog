---
layout: post
title: "Horizontal Scaling JSF Applications with Spring Session"
description: "JSF heavily depends on HTTP sessions, which is usually easier to scale vertically. Today we will see how we scale JSF horizontally with Spring Session."
date: 2017-05-09 08:00
category: Technical Guide, Java, Spring Boot
author:
  name: "Bruno Krebs"
  url: "https://twitter.com/brunoskrebs"
  mail: "bruno.krebs@auth0.com"
  avatar: "https://www.gravatar.com/avatar/76ea40cbf67675babe924eecf167b9b8?s=60"
design:
  bg_color: "#2E668D"
  image: "https://cdn2.auth0.com/blog/boot-faces/jsf-logo.png"
tags:
- spring-boot
- jsf
- java
related:
- 2017-05-09-developing-jsf-applications-with-spring-boot
- 2017-04-28-incrementally-changing-your-database-with-java-and-flyway
- 2016-09-20-securing-spring-boot-with-jwts
---

[Spring](https://spring.io/) is one of the most popular and reliable frameworks available for Java developers. Upon its core, many modules were implemented, like [Spring MVC](https://docs.spring.io/spring/docs/current/spring-framework-reference/html/mvc.html), [Spring Security](https://docs.spring.io/spring-security/site/docs/current/reference/html/), [Spring Data](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/), and so on. In this article we will see how to use [Spring Session](http://projects.spring.io/spring-session/) (one of these Spring modules) to scale [JavaServer Faces (JSF)](https://javaserverfaces.java.net/) applications horizontally.

## Horizontal vs Vertical Scaling

Before diving into how we use Spring Session to scale JavaServer Faces (JSF) applications, let's do a quick review on the differences between scaling applications vertically and horizontally.

Scaling an application vertically means adding more power to the machine that hosts the application. For example, let's say that we have an application running on a [`t2.medium` instance on AWS (which has 2 virtual cores and 4GiBs of RAM)](https://aws.amazon.com/ec2/instance-types/) that is having a hard time to process all requests. To scale this application vertically would mean choosing a more powerful instance, with more resources, to host it (e.g. using a `t2.xlarge` instance that has 4 virtual cores and 16GiBs of RAM).

This approach has one good advantage but three extremely important disadvantages. The upside is that it is *very* easy to scale it. It's just a matter of deploying the application to the new instance and we are good to go. The downside list is:

1. The host that supports our application is a single point of failure. This means that if it goes down our users won't have access to our application.
2. It is quite expensive to keep upgrading the instance type, no matter where we are hosting it.
3. There is a limit on how much power we can get from a single host.

Horizontal scalability, on the other hand, means adding more hosts to support an application. In the example above, instead of choosing a new instance type, we could create a second `t2.medium` instance and [load balance requests](https://en.wikipedia.org/wiki/Load_balancing_(computing)) between them.

The biggest disadvantage of this approach is that the complexity of scaling an application is higher, when compared to deploying an application on a more powerful machine. But, the advantages are:

1. We can scale it infinitely.
2. It is cheaper to add a second machine rather than replacing for one with twice the power.
3. We have no single point of failure.

As we can see, although scaling applications vertically mighty be easier, scaling them horizontally is much more interesting and improves the reliability of our system. That's why in this article we will see how we can use Spring Session to scale JSF applications horizontally.

## What is Spring Session

Spring Session is a module of the Spring Framework that aims on providing a common infrastructure for managing clustered sessions. This means that Spring Session abstracts the complexity of clustering HTTP sessions, making it easy to host applications scaled horizontally. Basically, what this modules does is to offload the storage of the session state into  external session stores (e.g. Redis or a regular database such as PostgreSQL).

## Scaling JSF with Spring Session

To see Spring Session in action, we are going to run two dockerized instances of a specific JSF application—i.e. we are going to use [Docker](https://www.docker.com/) to host our application instances. Each dockerized instance will run on a different port: instance *number one* will run on port `8081`; and instance *number two* will run on port `8082`.

The JSF application in this repository is not configured with Spring Session. After building the application and running it on Docker, we are going to make the adjustments needed to tie these two instances together with Spring Session. To seamlessly integrate these instances, making them look as a single application, we are going to use a dockerized NGINX instance configured as a load balancer.

To summarize, we are going to:

1. clone a GitHub repo that gives us a good start point
2. compile and package the JSF application in this repo
3. launch two dockerized instances of this application
4. check their behavior running as independent applications
5. refactor the application to use Spring Session
6. run Redis in a Docker container
7. and configure NGINX and launch everything to have a horizontally scaled JSF application

## JSF Application

To start, let's [clone this repository](https://github.com/auth0-blog/spring-boot-session). The JSF application inside this repository contains only a data table that lists products and that accepts drag & drop commands to reorder the items.

The list of products is instantiated in memory when a user access the application for the first time. When this user drags & drop an item, the new order is kept for the whole duration of the session. Different users can have different orders, as the reordering occurs inside an HTTP session. But, for the same user, no matter how many tabs of the application are opened on a web browser, the order will be always the same.

Every time a user reorders the data table, JSF shows a message distinguishing which instance of the application handled the request. Before using Spring Session and tying the two instances together, this message won't have that much value. But, when we have every piece in place, we will be able to see that different instances will act in the same HTTP session.

Enough talking, let's get our hands dirty. To clone the application and to run it in two different dockerized instances, let's issue the following commands:

> **Note** that you will have to have Docker properly installed in your development environment. To install it, [follow the instructions here](https://docs.docker.com/engine/installation/). Besides that you will need a [JDK (1.7 or higher)](http://www.oracle.com/technetwork/java/javase/downloads/index.html) and [Maven](https://maven.apache.org/install.html). Please, be sure to have everything properly installed before proceeding.

```bash
# clone repo
git clone https://github.com/auth0-blog/spring-boot-session.git

# access its main directory
cd spring-boot-session

# compile and package the application
mvn clean package
```

After issuing the three commands above, we will have our JSF application ready to run. You might want to run it in your own machine before dockerizing it. This step is not needed, but it is good to see the application before putting it inside a Docker instance. To do that issue `java -jar target/spring-session-0.1-SNAPSHOT.jar` and open `http://localhost:8080/index.jsf` in your web browser. Note that if you do run the application now and try to reorder the data table, you will see a message saying *Request handled by: default title*. When we dockerize this application, we will give different titles to both instances.

## Dockerizing the JSF Application

Now that we have our application compiled and packaged, we can proceed with the dockerizing step. The process of dockerizing a [Spring Boot](https://projects.spring.io/spring-boot/) application (the JSF application in this repo is based on Spring Boot) is quite simple. We just need to generate a Docker image with a JDK, add the packaged application to this image and then run it. You will find the `Dockerfile` with all these commands in the root directory of our application, but I show its contents below as well:

```dockerfile
FROM frolvlad/alpine-oraclejdk8:slim
VOLUME /tmp
ADD target/spring-session-0.1-SNAPSHOT.jar /app.jar
RUN sh -c 'touch /app.jar'
ENV JAVA_OPTS=""
ENTRYPOINT [ "sh", "-c", "java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -jar /app.jar" ]
```

The first line defines that the image will be generated from an image that contains JDK 1.8. After that we define a volume and add the packaged application to the image. The last command in this `Dockerfile` executes the JSF application.

To build and run the two dockerized instances of the JSF application, let's issue the following command from the root directory:

```bash
# build the dockerized application image
docker build -t without-spring-session .

# running instance number one
docker run -d -p 8081:8080 --name without-spring-session-1 -e "APPLICATION_TITLE=First instance" without-spring-session
# running instance number two
docker run -d -p 8082:8080 --name without-spring-session-2 -e "APPLICATION_TITLE=Second instance" without-spring-session
```

The first command builds the image naming it as `without-spring-session` to easily identify that it is an image with no Spring Session configured. After that we run two instances of this image. We define that the first instance being run will have its port `8080` tied to port `8081` in our development machine. And the second instance will have port `8080` tied to port `8082`. Note that we also define distinct values to the environment variable named `APPLICATION_TITLE`. This is the title that the JSF application shows in the *Request handled by* message when reordering the data table.

By opening `http://localhost:8081/index.jsf` on a tab of our web browser and `http://localhost:8082/index.jsf` on another tab, we can see that we have two distinct applications running apart. They do not share a common state (i.e. an HTTP session). This means that if we reorder the data table on instance *number one*, nothing will happen with instance *number two*. We can refresh the page an check that the second tab will have the data table unaltered.

## Integrating Spring Boot with Spring Session

Integrating Spring Boot with Spring Session is very easy. We have to take only four small steps. The first one is to add two dependencies to our project: Spring Session and a external session store (we will use [Redis](https://redis.io/) in this article). To add these dependencies, let's open the `pom.xml` file and add the following elements to the `<dependencies/>` element:

```xml
<dependencies>
  <!-- other dependencies -->
  <dependency>
    <groupId>org.springframework.session</groupId>
    <artifactId>spring-session</artifactId>
    <version>1.3.1.RELEASE</version>
  </dependency>
  <dependency>
    <groupId>org.springframework.session</groupId>
    <artifactId>spring-session-data-redis</artifactId>
    <version>1.3.1.RELEASE</version>
    <type>pom</type>
  </dependency>
</dependencies>
```

After that we need to tell our `Application` that we are going to use Spring Session with Redis to manage HTTP sessions. We do this by adding the `@EnableRedisHttpSession` annotation to the `Application` class.

```java
// ...
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisHttpSession;

@SpringBootApplication
@EnableRedisHttpSession
public class Application {
  // ...
}
```

Since HTTP session will be handled by an external session store (Redis), we will need to add the `Serializable` interface to everything that gets added to users' sessions— this interface tells the JVM that the classes that use it are subject to serialization over the network, to disk, etc. In this case, we have to update only the `Product` class.

```java
//...
import java.io.Serializable;

public class Product implements Serializable {
  // ...
}
```

Last step is to configure the Spring Session connection to Redis. This is done by adding the following properties to the `application.properties` file:

```bash
# ... other properties
spring.redis.host=172.17.0.1
spring.redis.password=secret
spring.redis.port=6379
```

The properties above point to a Redis instance running on `localhost:6379`, which doesn't exist yet. We will tackle that now.

## Dockerized Redis Instance

As we don't want to install Redis on our development machine, we are going to use Docker to run it. To do that we are going to create a `Dockerfile` in a new directory called `./redis`. The contents of this file will be:

```bash
FROM redis
ENV REDIS_PASSWORD secret
CMD ["sh", "-c", "exec redis-server --requirepass \"$REDIS_PASSWORD\""]
```

The file above starts by defining the [oficial Redis image](https://hub.docker.com/_/redis/) as the base for our own image, and then define `secret` as the password for connecting to Redis. To build and run this image, we can issue the following commands:

```bash
# create redis image
docker build -t spring-session-redis redis

# run redis
docker run -p 6379:6379 -d --name spring-session-redis spring-session-redis
```

Redis is now available to the Spring Session module that we've just configured in our JSF application. Therefore, we are ready to rebuild our JSF application, build the new Docker image (now with Spring Session), and then run both instances based on this new image.

> **Note** that the first command below removes the two instances created before. This is needed to release ports `8081` and `8082` on our development machine.

```bash
# remove previous instances
docker rm -f without-spring-session-1 without-spring-session-2

# compile and package the application
mvn clean package

# build the dockerized application image
docker build -t spring-session .

# running instance number one
docker run -d -p 8081:8080 --name spring-session-1 -e "APPLICATION_TITLE=First instance" spring-session
# running instance number two
docker run -d -p 8082:8080 --name spring-session-2 -e "APPLICATION_TITLE=Second instance" spring-session
```

After executing these commands, the last step that we will need to perform to tie everything together is to create an NGINX instance that behaves as a load balancer.

## Load Balancing with NGINX

To load balance requests between the two instances we will use the `Dockerfile` and the `nginx.conf` file that exist in the `./nginx` folder of the repository. The `Dockerfile` (contents below), simply enables the creation of an image based in the oficial NGINX image with a configuration defined in the `nginx.confg` file.

```bash
FROM nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

The `nginx.conf` file, configures NGINX to act as a load balancer that uses the round-robin algorithm to distribute HTTP requests between instances. As we can see through the contents below, this file defines an `upstream` that contains both instances, and then defines that any request should be redirected by one of these instances. By not explicitly defining any strategy in the `upstream` property, NGINX uses the default one (round-robin).

```bash
upstream my-app {
    server 172.17.0.1:8081 weight=1;
    server 172.17.0.1:8082 weight=1;
}

server {
    location / {
        proxy_pass http://my-app;
    }
}
```

To build and run the NGINX load balancer image, we can issue the following commands:

```bash
# build the dockerized NGINX load balancer
docker build -t spring-session-nginx nginx

# run load balancer
docker run -p 8080:80 -d --name spring-session-nginx spring-session-nginx
```

And Voila! We got our JSF application horizontally scaled with Spring Session handling HTTP sessions with the help of Redis. Now, whenever we issue an HTTP request to `http://localhost:8080`, we may get an answer from one instance or another. Just load this URL in your browser and reorder the data table a few times. You will see that sometimes one instance of our application will respond to the reordering event, sometimes the other instance will.

## Conclusion

Using Spring Session to handle HTTP sessions is an easy task. Spring Boot makes it even easier, requiring just a few small steps to configure everything in an application. The problem is that this kind of architecture is not frequently used and that there are few resources that teach us how to integrate all the moving pieces together. I hope that by making this article available, Java developers that use Spring and mainly those that use JSF (which heavily depends on HTTP session) will be able to scale their application without struggling so much.
