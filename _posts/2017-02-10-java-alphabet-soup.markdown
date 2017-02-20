---
layout: post
title: "Java's Evolution - An Overview of How the Platform Evolves"
description: "This article provides an overall explanation about how Java evolves both as platform and as programming language. A nice infographic accompanies it to illustrate the idea."
date: 2017-02-10 12:14
category: Technical Guide, Java
author:
  name: "Bruno Krebs"
  url: "https://twitter.com/brunoskrebs"
  mail: "krebs.bruno@gmail.com"
  avatar: "https://www.gravatar.com/avatar/76ea40cbf67675babe924eecf167b9b8?s=60"
design:
  bg_color: <A HEX BACKGROUND COLOR>
  image: <A PATH TO A 200x200 IMAGE>
tags:
- java
- jre
- jdk
- jcp
- jsr
- jep
related:
- <ADD SOME RELATED POSTS FROM AUTH0'S BLOG>
---

In this article I'm going to explain how Java evolves over time. I'm going to define some important acronyms—like JDK, JRE, JSR, JEP, etc—and show how they interact together to compose one of the most used platforms in the world. In the end I'll provide an infographic that illustrate this process.

## Java Editions

Before diving into the details of how Java evolves, it's important to understand what its main pieces are. Java is distributed in three different editions: *Java Standard Edition* (Java SE), *Java Enterprise Edition* (Java EE) and *Java Micro Edition* (Java ME).

*Java Micro Edition* was created focusing applications running on embedded and mobile devices in the Internet of Things. This edition is not, by far, as popular as its siblings and will not be the focus of this article, although it also [evolves based on the same process](http://www.oracle.com/technetwork/java/javame/tech/jcp-jsp-140210.html).

*Java Standard Edition* and *Java Enterprise Edition* are [heavily used worldwide](http://www.tiobe.com/tiobe-index/). Together they are used in many different kinds of solutions like [web applications, applications servers, big data technologies and so on](http://javarevisited.blogspot.com.br/2014/12/where-does-java-used-in-real-world.html).

Both editions are composed of a large number of modules and it wouldn't be possible to provide a thorough explanation of the whole platform. Therefore, I'm going to briefly address its most important pieces.

### Java Standard Edition

The *Java Standard Edition* is the minimum requirement to run a Java application. This edition provides a solid basis to the *Java Enterprise Edition*, and as such I will start by defining its main components.

#### Java Virtual Machine (JVM)

The *Java Virtual Machine* (JVM) is responsible for supporting the execution of Java applications. This is the piece of the platform that makes the statement *write once run everywhere* true for Java. Each particular host operating system (Windows, Linux, Mac OS, etc) needs its own implementation of the JVM, otherwise it wouldn't be possible to run Java applications.

Let's take as an example an arbitrary application that needs to read files from the hosting system. If this application didn't run on an engine like the JVM, that abstracts tasks like IO operations, it would be necessary to write a different program to every single system targeted. This would make the release process slower and it would become harder to support and share this application.

One important concept to bare in mind is that the JVM is, before everything, a specification. Being a specification allows to different vendors to create their own implementation of the JVM. [Wikipedia has an up to date article that lists open source and proprietary JVMs](https://en.wikipedia.org/wiki/List_of_Java_virtual_machines), but the most important and used one are [Open JDK](http://openjdk.java.net/) (which is open source), [J9 from IBM](https://www.ibm.com/support/knowledgecenter/SSYKE2_8.0.0/com.ibm.java.lnx.80.doc/user/java_jvm.html) and [Oracle JVM](http://www.oracle.com/technetwork/java/javase/downloads/index-jsp-138363.html) (both proprietary).

#### Java Class Library (JCL)

The *Java Class Library* is a set of standard libraries that is available to any application running on the JVM. This set of libraries is composed of classes that allow programs to handle commons tasks like: network communication, collection manipulation, file operations, user interface creation, etc. This standard library is also known as the [Java Standard Edition API](https://docs.oracle.com/javase/8/docs/api/).

As of version 8 of Java, there were more than 4 thousand classes available to the applications running on the JVM. This makes a typical installation of Java consume a [large size on disk](http://www.oracle.com/technetwork/java/javase/windows-diskspace-140460.html).

Taking that into account Java 8 introduced a new feature called *[compact profiles](http://www.oracle.com/technetwork/java/embedded/resources/tech/compact-profiles-overview-2157132.html)*. These profiles allow system administrator to install smaller versions of the standard library, making available just a subset of the classes on a default environment.

Java 9 took a step further, under the [project Jigsaw](http://openjdk.java.net/projects/jigsaw/quick-start), by enabling deeper modularity in the standard stack. This project aimed at diving the stack into independent modules, allowing developers and system administrator to define application dependencies on a finer grain. The big difference between *compact profiles* and this modularity is that the profiles contain a predefined set of classes, which provided less flexibility.

#### Java Runtime Environment (JRE)

The *Java Runtime Environment* (JRE) is a set of tools that form an environment where [Java](https://www.java.com) applications run. Whenever a person wants to run a Java program, they must choose a vendor and install one of the versions available for their specific environment architecture (Linux x86, Linux x64, Mac OS X, Windows x64, etc). Installing it gives them access to a set of files (libraries, documentation, manuals, etc) and programs.

> Java has always been [extremely careful with backward compatibility](https://zeroturnaround.com/rebellabs/10-reasons-why-java-rocks-more-than-ever-part-9-backwards-compatibility/). Therefore, installing the latest version available is advised and will probably lead to better performance.

There are two files that are worth noting on a typical JRE installation. The first one is the `java` executable file. This file is responsible for bootstrapping the *JVM* that will run the application. The second one is the `rt.jar` file. This file contains all the runtime classes that comprises the *JCL*.

#### Java Development Kit (JDK)
The *Java Development Kit* (JDK)

## Java Community Process (JCP)
### JCP Membership
### JCP Member Roles
### JCP Members

## JDK Enhancement-Proposal (JEP)
Essentially, *JDK Enhancement-Proposals* (JEPs) are documents that proposes changes to future releases of the JDK. But there is more, JEP also defines a process on how these enhancements evolve and
### Structure of a JEP
### JEP Lifecycle
http://openjdk.java.net/jeps/1 Process states

![example of lifecycle](https://www.python.org/m/dev/peps/pep-0001/pep-0001-1.png)

## Java Specification Requests (JSR)
### Structure of a JSR
### JSR Lifecycle

## Advantages and Disadvantages of this Process

## Java Evolution Process Infographic

## Conclusion
