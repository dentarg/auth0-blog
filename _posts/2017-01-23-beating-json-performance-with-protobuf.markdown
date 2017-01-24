---
layout: post
title: "Beating JSON performance with Protobuf"
description: "Protobuf, the binary format crafted by Google, surpasses JSON performance even on JavaScript environments like Node/V8 and web browsers."
date: 2017-01-23 11:46
category: Technical Guide, Architecture, Performance
author:
  name: "Bruno Krebs"
  url: "https://twitter.com/brunoskrebs"
  mail: "krebs.bruno@gmail.com"
  avatar: "https://www.gravatar.com/avatar/76ea40cbf67675babe924eecf167b9b8?s=60"
design:
  bg_color: <A HEX BACKGROUND COLOR>
  image: <A PATH TO A 200x200 IMAGE>
tags:
- protobuf
- protocol
- buffer
- json
- performance
- communication
- architecture
related:
- 2016-02-22-12-steps-to-a-faster-web-app
- 2015-09-04-an-introduction-to-microservices-part-1
- 2015-09-13-an-introduction-to-microservices-part-2-API-gateway
---

**TL;DR**

Protocol buffers, or Protobuf, is a binary format created by Google to serialize data between different services. Google made this protocol open source and now it provides support, out of the box, to the most common languages like JavaScript, Java, C#, Ruby and others. In our tests, it was demonstrated that this protocol performed up to **3 times faster** than JSON.

## What is Protobuf

[Protocol buffers](https://developers.google.com/protocol-buffers/docs/overview), usually referred as Protobuf, is a protocol developed by Google to allow serialization and deserialization of structured data. Google developed it with the goal to provide a better way, compared to XML, to make systems communicate. So their focused on making it simpler, smaller, faster and more maintainable then XML. But, as you will see in this article, this protocol even surpassed JSON with a better performance, better maintainability and smaller size.

### How does it differs from JSON?

It is important to note that, although [JSON](http://www.json.org/) and [Protobuf](https://developers.google.com/protocol-buffers/docs/overview) messages can be used interchangeably, these technologies were designed with different goals. JSON, which stands for JavaScript Object Notation, is simply a message format that arose from a subset of the JavaScript programming language. JSON messages are exchanged in text format and, nowadays, they are completely independent and supported by, virtually, all programming languages.

Protobuf, on the other hand, is more than a message format, it is also a set of rules and tools to define and exchange these messages. Google, the creator of this protocol, has made it open source and it provides tools to generate code for the most used programming languages around, like [JavaScript](https://developers.google.com/protocol-buffers/docs/reference/javascript-generated), [Java](https://developers.google.com/protocol-buffers/docs/javatutorial),
[PHP](https://developers.google.com/protocol-buffers/docs/reference/php-generated), [C#](https://developers.google.com/protocol-buffers/docs/csharptutorial),
[Ruby](https://developers.google.com/protocol-buffers/docs/reference/ruby-generated),
[Objective C](https://developers.google.com/protocol-buffers/docs/reference/objective-c-generated), [Python](https://developers.google.com/protocol-buffers/docs/pythontutorial), [C++](https://developers.google.com/protocol-buffers/docs/cpptutorial) and [Go](https://developers.google.com/protocol-buffers/docs/gotutorial). Besides that, Protobuf has more data types than JSON, like enumerates and methods, and is also heavily used on [RPCs (Remote Procedure Calls)](https://github.com/grpc).

## Is Protobuf Really faster than JSON?

There are several resources online that show that Protobuf performs better than JSON, XML and etc - like [this one](https://github.com/eishay/jvm-serializers/wiki) and [this one](https://maxondev.com/serialization-performance-comparison-c-net-formats-frameworks-xmldatacontractserializer-xmlserializer-binaryformatter-json-newtonsoft-servicestack-text/) -, but it is always important to check if this is the case for your own needs and environment. Here, at Auth0, I have developed a simple [Spring Boot application](https://github.com/brunokrebs/auth0-speed-test) to test a few scenarios and measure how JSON and Protobuf performed. Mostly I have tested serialization of both protocols to make two Java applications communicate and to make a JavaScript web application communicate to this backend.

>The main reason to create these two scenarios - Java to Java and JavaScript to Java - was to measure how this protocol would behave in an enterprise environment like Java and also on an environment where JSON is the native message format. That is, what I show here is data from an environment where JSON is built in and should perform extremely fast (JavaScript engines) and from an environment where JSON is not a first class citizen.

The short answer to the question is yes, Protobuf is faster than JSON. But this answer is not useful nor interesting without the data that I gathered on my experiments. Lets take a look at the details now.

### Test Sample

To support the measurements I have created three Protobuf messages: `Address`, to hold just the street and number; `Person`, to hold the name, a collection of addresses, a collection of mobile numbers and a collection of email addresses; `People`, to hold a collection of person messages. This messages were assembled together in an application with four RESTful endpoints:

1. A RESTful endpoint that accepted GET requests and returned a list of 50 thousand people in Protobuf format.
2. A RESTful endpoint that accepted GET requests and returned the same list of 50 thousand people, but in JSON format.
3. A RESTful endpoint that accepted POST requests with any number of people in Protobuf format.
4. A RESTful endpoint that accepted POST requests with any number of people in JSON format.

### JavaScript to Java communication



## Are There Any Other Advantages and Disadvantages?

## How Do We Use Protobuf?

### Protobuf Message Definition

### JavaScript

### Java

### Python

### Other Languages

## Conclusion
