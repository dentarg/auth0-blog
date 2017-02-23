---
layout: post
title: "Java Acronyms—How They Interact to Compose the Platform"
description: "This article provides an explanation of the most important Java acronyms and how they interact to compose one of the most used platforms in the world."
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
- java se
- java ee
related:
- <ADD SOME RELATED POSTS FROM AUTH0'S BLOG>
---

**TL;DR:** In this article I'm going to explain the most important Java acronyms and how they interact to make Java evolve over time. First I'm going to introduce how the platform is divided—explaining what are the differences between Java ME, *Java SE* and *Java EE*—and then I'm going to define some important acronyms like: *JDK*, *JRE*, *JCP*, *JSR*, *JEP*, etc. I will also provide a brief explanation of how most of these acronyms interact in the Java world.

## Java Editions

Before diving into Java acronyms, it's important to understand what are the main pieces of the platform. Java is distributed in three different editions: *Java Standard Edition* (Java SE), *Java Enterprise Edition* (Java EE) and *Java Micro Edition* (Java ME).

*Java Micro Edition* was created focusing applications running on embedded and mobile devices in the Internet of Things. This edition is not, by far, as popular as its siblings and will not be the focus of this article, although it shares many of the acronyms and processes in its evolution.

*Java Standard Edition* and *Java Enterprise Edition* are [heavily used worldwide](http://www.tiobe.com/tiobe-index/). Together they are used in many different kinds of solutions like [web applications, applications servers, big data technologies and so on](http://javarevisited.blogspot.com.br/2014/12/where-does-java-used-in-real-world.html).

Both editions are composed of a large number of modules and it wouldn't be possible to provide a thorough explanation of the whole platform. Therefore, I'm going to briefly address its most important pieces.

![Java Editions and their applicability](https://image.slidesharecdn.com/javaee7inaction-131107133348-phpapp01/95/gujavasc-java-ee-7-in-action-3-638.jpg?cb=1383831268)

## Java Standard Edition (Java SE)

The *Java Standard Edition* (Java SE) is the minimum requirement to run a Java application. This edition provides a solid basis to the *Java Enterprise Edition*, and as such I will start by defining some of its components.

### Java Virtual Machine (JVM)

The *Java Virtual Machine* (JVM) is responsible for supporting the execution of Java applications. This is the piece of the platform that makes the statement *write once run everywhere* true for Java. Each particular host operating system (Windows, Linux, Mac OS, etc) needs its own implementation of the *JVM*, otherwise it wouldn't be possible to run Java applications.

Let's take as an example an arbitrary application that needs to read files from the hosting system. If this application didn't run on an engine like the *JVM*, that abstracts tasks like IO operations, it would be necessary to write a different program to every single system targeted. This would make the release process slower and it would become harder to support and share this application.

One important concept to bare in mind is that the *JVM* is, before everything, a specification. Being a specification allows different vendors to create their own implementation of the *JVM*. [Wikipedia has an up to date article that lists open source and proprietary JVMs](https://en.wikipedia.org/wiki/List_of_Java_virtual_machines), but the most important and used ones are: [Open JDK](http://openjdk.java.net/) (which is open source), [J9 from IBM](https://www.ibm.com/support/knowledgecenter/SSYKE2_8.0.0/com.ibm.java.lnx.80.doc/user/java_jvm.html) and [Oracle JVM](http://www.oracle.com/technetwork/java/javase/downloads/index-jsp-138363.html) (both proprietary).

![JVMs are specific to each OS and architecture](https://i.snag.gy/JXYiOe.jpg)
_Java applications run on JVMs that are specific to each OS and architecture_

### Java Class Library (JCL)

The *Java Class Library* is a set of standard libraries that is available to any application running on the *JVM*. This set of libraries is composed of classes that allow programs to handle commons tasks like: network communication, collection manipulation, file operations, user interface creation, etc. This standard library is also known as the [Java Standard Edition API](https://docs.oracle.com/javase/8/docs/api/).

As of version 8 of Java, there were more than 4 thousand classes available to the applications running on the *JVM*. This makes a typical installation of Java consume a [large size on disk](http://www.oracle.com/technetwork/java/javase/windows-diskspace-140460.html).

> Java members, realizing that Java platform was getting to big addressed the issue by introducing a feature called [compact profiles on Java 8](http://www.oracle.com/technetwork/java/embedded/resources/tech/compact-profiles-overview-2157132.html) and by making the [whole API modular on Java 9](http://openjdk.java.net/projects/jigsaw/quick-start).

![Java SE API and some of its packages](https://i.snag.gy/JRFMOg.jpg)

### Java Runtime Environment (JRE)

The *Java Runtime Environment* (JRE) is a set of tools that form an environment where Java applications run. Whenever a person wants to run a Java program, they must choose a vendor and install one of the versions available for their specific environment architecture (Linux x86, Linux x64, Mac OS X, Windows x64, etc). Installing it gives them access to a set of files and programs.

> Java has always been [extremely careful with backward compatibility](https://zeroturnaround.com/rebellabs/10-reasons-why-java-rocks-more-than-ever-part-9-backwards-compatibility/). Therefore, installing the latest version available is advised and will probably lead to better performance.

There are two files that are worth noting on a typical *JRE* installation. The first one is the `java` executable file. This file is responsible for bootstrapping the *JVM* that will run the application. The second one is the `rt.jar` file. This file contains all the runtime classes that comprises the *JCL*.

### Java Development Kit (JDK)

The *Java Development Kit* (JDK) is an extension of the *JRE*. Alongside with the files and tools provided by the *JRE*, the *JDK* includes the compilers and tools (like JavaDoc, and Java Debugger) to create Java programs. For this reason, whenever one wants to develop its own Java application, they will need to install a *JDK*.

Nowadays, most of the tools distributed by JDK are not directly used by developers. Usually Java developers rely on third party tools (like [Apache Maven](https://maven.apache.org/) or [Gradle](https://gradle.org/)) that automate compile, build and distribution processes. Developers also rely on their IDEs (Integrated Development Environments) to build and debug their projects.

## Java Enterprise Edition (Java EE)

The *Java Enterprise Edition* (Java EE) was created to extend the *Java SE* by adding a set of specifications that define capabilities commonly used by enterprise applications. The latest version of this edition [contains over 40 specifications](https://en.wikipedia.org/wiki/Java_EE_version_history#Java_EE_7_.28June_12.2C_2013.29) that help developers to create applications that [communicate through web services](http://www.oracle.com/technetwork/java/javaee/tech/webservices-139501.html), [convert object-oriented data to entity relationship model](https://docs.oracle.com/javaee/7/tutorial/partpersist.htm), [handle transactional conversations](http://www.oracle.com/technetwork/java/javaee/jta/index.html) and [so on](http://www.oracle.com/technetwork/java/javaee/overview/index.html).

One great advantage of having an enterprise edition defined as specifications is that different vendors can develop application servers to support it. This leads to a richer environment where companies can choose the best vendor to support their operations.

### Java Enterprise Edition Vendors

As the time of writing there are [8 different vendors that certified their Java EE implementation](https://en.wikipedia.org/wiki/Java_Platform,_Enterprise_Edition#Certified_application_servers). Among these vendors, two of them are free and open-source: [GlassFish Server Open Source Edition](https://glassfish.java.net/) and [WildFly](http://wildfly.org/).

Oracle, the creator of *GlassFish*, and Red Hat, the creator of *WildFly*, also provides proprietary and paid versions of these application servers. *Oracle GlassFish Server* is the version supported by Oracle and *JBoss Enterprise Application Platform* is the version supported by Red Hat.

One may wonder why companies like Oracle and Red Hat make available two versions of their applications servers: one open-source and free and the other paid and proprietary. The biggest differences between these versions are that the paid ones usually have more performance and better support. Vendors invest a lot to make these versions run smoothly and to solve any issues that might occur as fast as possible.

### Java Enterprise Edition Features

As already stated, *Java EE* comes with a lot (more than 40) features based on *JSRs*. These features help companies to handle common needs like persistence, security, web interfaces, state validation and so on. The following list enumerates the most important and used features of *Java EE*:

- *Java Persistence API* (JPA)—a specification for accessing, persisting and managing data between Java objects and a relational database
- *JavaServer Faces* (JSF)—a specification for building component-based user interfaces for web applications
- *JavaServer Pages* (JSP)—a technology that helps software developers create dynamically generated web pages based on HTML
- *Java API for RESTful Web Services* (JAX-RS)—a spec that provides support in creating RESTful web services
- *Enterprise Java Beans* (EJB)—a specification for developing components that encapsulates business logic of an application
- *Context and Dependency Inject* (CDI)—a technology that allows developers to apply [inversion of control](https://en.wikipedia.org/wiki/Inversion_of_control) on Java applications

## Java Community Process (JCP)

The *Java Community Process* (JCP) is the process that formalizes and standardizes Java technologies. Interested parties, like developers and companies, cooperate in this process to evolve the platform. Most of the time, enhancements to any Java technology or introduction of new ones occur through *Java Specification Requests* (JSRs). But there are times that the platform evolves through *JDK Enhancement-Proposals* (JEPs).

As an example, let's consider the introduction of the Java API for RESTful Web Services (JAX-RS) specification on *Java SE*. To release this specification in *Java SE 5*, Sun Microsystems—the company that created Java—issued a *JSR* to the *JCP* program, [under the number 311](https://jcp.org/en/jsr/detail?id=311#orig). This request defined some details like:

- a description of the proposed specification
- the target platform
- why the need of a new specification
- and technologies that the specification relies on

After submitting this specification request, members of the *Executive Committee* (EC) analyzed it to decide if this request deserved attention or not. Since it was approved by the *EC*, Mark Hadley and Paul Sandoz—former employees of Sun Microsystems—were assigned as *Specification Leads* and kept working on it with the help of *Expert Group* members and *Contributors*.

All the different roles and the workflow involved to release any *JSR*, like the example above, are defined in the *JCP* program and are governed by the *EC*.

### Java Community Process Membership

To officially participate in any stage of a *JSR* or process in the *JCP*, an organization or individual has to sign a *Java Specification Participation Agreement* (JSPA), a *Associate Membership Agreement* (AMA) or a *Partner Membership Agreement* (PMA).

Any entity (human or organization) that signs one of these agreements gets categorized as one of the three types of *JCP Membership* available: Associate Member, Partner Member or Full Member. Each of these types qualify members to act on different roles in the process. The *JCP* provides a [very detailed explanation of how different kind of subjects (individuals, non-profit organizations or commercial organizations) become members](https://jcp.org/en/participation/overview) and [how they can contribute](https://jcp.org/aboutJava/communityprocess/final/jsr364/MembershipClasses_v7.pdf). But basically, the following rules apply:

- Associate Members can be *Contributors* to *JSRs' Expert Groups*, attend *JCP Member* events and vote in the annual *Executive Committee* elections for two Associate seats
- Partner Members can serve on the *Executive Committee*, attend to *JCP Member* events and vote in the annual *Executive Committee* elections
- Full Members can work on the *Executive Committee*, vote in the annual *Executive Committee* elections, work as *Contributors* to *JSRs* and lead these specifications.

![JCP members hierarchy](https://i.snag.gy/PDn6o7.jpg)

### Executive Committee (EC)

The *Executive Committee* (EC) plays a major role in the *JCP* program. Members of this group have to analyze, comment, vote and decided on the approval of all the *JSRs* submitted to the program. Besides being responsible for guiding the evolution of the entire platform, the *EC* and the whole *JCP* program are also responsible for the *JCP* program itself, keeping it in adherence to what the community expects from the program and its members.

Members of this committee are elected through [annual elections](https://jcp.org/en/participation/committee) and they are responsible for:

- reviewing and voting to approve or reject new *JSR* proposals
- reviewing and voting to approve or reject public review drafts
- deciding when *JSRs* should be withdrawn
- collaborating on revisions to the *JCP* program

### Specification Lead

The *Specification Lead* is usually the author of the specification or, like in the example of the *JAX-RS* spec, someone related to the organization that filed the request. *Spec Leads* main responsibility is to guide *Expert Group* members and the *Contributors* while developing a specification, but they also have to:

- provide the Reference Implementation for the *JSR*
- complete the *Technology Compatibility Kit* (TCK)—[a suite of tests that checks a particular a *JSR* for compliance](https://jcp.org/en/resources/tdk)
- update the *JSR* page on [jcp.org](https://jcp.org), providing documents like [Early Draft Review](https://www.jcp.org/en/jsr/stage?listBy=community), [Public Review](https://www.jcp.org/en/jsr/stage?listBy=public), [Proposed Final Draft](https://www.jcp.org/en/jsr/stage?listBy=proposed), etc

### Contributor

*Contributors* are an *Associate Member* (i.e. individuals that signed the *Associate Membership Agreement*) that helped the *Expert Group* and the *Specification Lead* to test and develop a *JSR*. This role is the first step to the *JCP* program. *Contributors* that provide great help on one or more *JSRs* have a good chance to be considered as candidates for future *Expert Groups* and/or to act as a *Specification Lead*.

## Java Specification Requests (JSR)

A *Java Specification Request* is the document that starts an enhancement on the Java platform. Whenever a member of the *JCP* program sees an opportunity to improve the platform, they create a *JSR* describing the opportunity and submit it to revision. The *EC*, and the whole community, then have from 2 to 4 weeks to analyze and comment on the *JSR*.

The length of this period is defined by the *JSR* submitter. After this period, starts a new stage called *JSR Approval Ballot* (JAB), where the member of the *EC* has 2 weeks to vote on it. To be approved, a *JSR* has to:

- receive at least 5 votes
- receive yes as the majority of the votes casted (absent votes are ignored)

When a *JSR* gets approved by the *EC*, the *Specification Leads* start forming an *Expert Group* and a team of *Contributors* to work on the specification. After having the whole crew defined, they start working on the *Early Draft Review* (EDR). Before this draft is reached, *JSR* access is only open to the *JCP* members working on the specification. But when the *EDR* is released, companies are allowed to specifically begin talking in press releases and other public venues about the *JSR*.

The idea of the *EDR* is to encourage the *EG* to feel comfortable going into review before the *Public Review*

> Most of the communication happens on email aliases and everything is open to the public.

Three types of *JSRs* exists nowadays:

- *JSRs* that propose enhancement to previously approved *JSRs*
- *JSRs* that propose new features to the platform
- Platform *JSRs* that hold a set of *JSRs* that may be part of the next major release (e.g. *Java SE 9* or *Java EE 9*)

## JDK Enhancement-Proposal (JEP)

Essentially, *JDK Enhancement-Proposals* (JEPs) are documents that proposes changes to future releases of the JDK. But there is more, JEP also defines a process on how these enhancements evolve and

![example of lifecycle](https://www.python.org/m/dev/peps/pep-0001/pep-0001-1.png)

## Conclusion

As you can see, the Java community has an addiction for acronyms, mainly those that start with the letter J. But alongside with this addiction, the community has also built an amazing environment, with crystal-clear rules, that enable Java to evolve.

The community,
