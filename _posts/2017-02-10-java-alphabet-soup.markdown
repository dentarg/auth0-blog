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

**TL:DR:** In this article I'm going to explain how Java evolves over time. I'm going to define some important acronyms—like JDK, JRE, JSR, JEP and JCP—and show how they interact together to compose one of the most used platforms in the world. In the end I'll provide a infographic that illustrate this process.

## Java Platform

Before diving into the details of how Java evolves, its important to understand what are the its main pieces. The platform is composed of many different parts and each part has a large number of details. It is not the focus of this article to provide a thorough explanation of the whole platform, which would require hundreds of articles. Therefore, we are going to briefly address only the most important pieces, that are:

- the **Java Virtual Machine** (JVM): the engine responsible for running Java applications
- the **Java Class Library** (JCL): a set of libraries available at runtime for all Java application
- the **Java Runtime Environment** (JRE): the engine that contains everything for a Java application to be bootstrapped
- the **Java Development Kit** (JDK): a set of tools to develop, debug and run Java applications
- the **Java Programming Language**: the concurrent, class-based, object-oriented programming language that is used in most of the applications that run on the JVM

### Java Virtual Machine (JVM)

The *Java Virtual Machine* (JVM) is responsible for supporting the execution of Java applications. This is the piece of the platform that makes the statement *write once run everywhere* true for Java. Each particular host operating system (Windows, Linux, Mac OS, etc) needs to have its own implementation of the JVM, otherwise it wouldn't be possible to run Java applications.

Let's take as an example an arbitrary application that needs to read files from the hosting system. If this application didn't run on an engine like the JVM, that abstracts tasks IO operations, it would be necessary to write or at least compile the program to every single system targeted. This would make the release process slower and it would become harder to share this application.

### Java Class Library (JCL)



### Java Runtime Environment (JRE)

The *Java Runtime Environment* (JRE) is a set of tools that form an environment where [Java](https://www.java.com) applications run. Whenever a person wants to run a Java program, they must install one of the versions available for their specific environment architecture (Linux x86, Linux x64, Mac OS X, Windows x64, etc). Installing it gives them access to a set of files (libraries, documentation, manuals, etc) and programs.

> Java has always been [extremely careful with backward compatibility](https://zeroturnaround.com/rebellabs/10-reasons-why-java-rocks-more-than-ever-part-9-backwards-compatibility/). Therefore, installing the latest version available is advised and will probably lead to better performance.

There are two files that are worth noting on a typical JRE installation. The first one is the `java` executable file. This file is responsible for bootstrapping the *Java Virtual Machine* that will run the application. The second one is the `rt.jar` file. This file contains all the runtime classes that comprises the [Java Standard Edition
API](https://docs.oracle.com/javase/8/docs/api/).

### Java Development Kit (JDK)
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
