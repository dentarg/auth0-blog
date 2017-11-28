---
layout: post
title: "The Highs & Lows of Crystal - an Introduction to Crystal Lang"
description: "Crystal Language claims to be as fast as C and as easy to learn as Ruby.  Here, I put it to the test and give my 2 cents!"
date: 2017-08-23 15:54
category: Technical Guide, Backend, Crystal
author:
  name: "Robin Percy"
  url: "https://twitter.com/rbin"
  mail: "robin@percy.pw"
  avatar: "https://secure.gravatar.com/avatar/685342d5e7f42c3ab8d251d7d4a53308?s=100&d=mm&r=g"
design:
  bg_color: "#000000"
  image: https://cdn.auth0.com/blog/crystal-lang/logo.png
tags:
- Crystal Language
- Low-Level Programming
- Systems Programming
- Ruby on Rails
- C
related:
- 2017-11-02-building-your-first-crystal-app-with-jwt-authentication
- 2017-01-03-rails-5-with-auth0
- 2016-11-21-building-and-authenticating-nodejs-apps 
---

Crystal is a statically-typed, compiled, systems programming language with the aims of being as fast as c/c++, while having a syntax as readable as Ruby.  This article is an introduction to the Crystal Language, through the eyes of a polyglot programmer.  Being a former programmer of both C and Ruby, I have been able to explore the ins-and-outs of Crystal with an objective mindset and give an unbiased opinion on its features; from it's low-level primitives to its familiar syntax, and much in-between.

I first came across Crystal when I saw [@sferik](https://twitter.com/sferik)  giving a talk on it in Poland back in 2015.  [Video here.](https://www.youtube.com/watch?v=Ysm4IU4aWoQ)  It was a great talk, and sparked my interest to Crystal right there and then.  When I initially checked out Crystal, I thought it looked awesome but I was too busy with all the other languages I was using on a daily basis to be able to focus my time properly on it.

Alongside being too busy, I couldn't really see why I'd use Crystal instead of using C/Erlang/Go/Ruby - languages that I already knew.  What I can say with confidence now though; is that whilst those languages may all be able to achieve the same end-goal they're all *better* in their own, different ways entirely.

When I want to build distributed apps, like my *Fist/Bump Heartbeat Monitor* - I use Erlang/Elixir.  When I want to build an API backend I use Golang.  When I want to spend the day with my brains scattered, and most probably in tears - I use C.  For readibility and demonstrations, I use Ruby.  When it comes to writing low-level systems such as daemons and obtuse Kernels, while it would be most performant to turn to C - it'd also take me a **LONG** time to achieve relatively little and the aforementioned tears would be very-likely flowing.  *This is where Crystal comes in.*

Having a syntax *very* similar to Ruby means that the familiarity of Crystal is incredibly enticing.  Since the world is obsessed with web apps now, let's take a look at the code required to build a minimal web server in both Crystal and Ruby.

In **Ruby**, using *Sinatra*, the code is as follows:

~~~ ruby
require "sinatra"
 
set :logging, false
 
get "/" do
  content_type "text/plain"
  "Hello, Auth0!"
end
~~~

Now in **Crystal**, check out the equivalent code:

~~~ ruby
require "kemal"
 
logging false
 
get "/" do |ctx|
  ctx.response.content_type = "text/plain"
  "Hello, Auth0!"
end
 
Kemal.run
~~~

The fact that you can use Ruby syntax highlighting natively for Crystal says everything!  Coming from Ruby to Crystal is a remarkably easy adaptation.  The fact is; one copy and paste code from Ruby to Crystal and 90% of the time it will run with no errors.  The creators of Crystal understand that Ruby is undoubtedly the most visually appealing language, and therefore built Crystal to take as much influence as possible from a design perspective.  You can even run Crystal programs using the `Ruby` shell command and vice versa since the syntax is valid for both languages!


## Binding C

One of the big selling points for Crystal is the ease with which you can interface with C libraries.  "Crystal allows you to bind to existing C libraries without writing a single line in C.  Additionally, it provides some conveniences like `out` and `to_unsafe` so writing bindings is as painless as possible."

Let's build a simple script in C that says "hi!".  We'll then write a Crystal app to bind to our C library.  This is a great starting point for anyone who wants to know about binding C in Crystal.

First off, let's create a project with Crystal's scaffolding tool (I'll cover this feature later).  Run:

~~~ bash
$ crystal init app sayhi_c
~~~

Then head into the directory `sayhi_c/src/sayhi_c` and let's create a file `sayhi.c` with the following contents:

~~~ c
#include <stdio.h>

void hi(const char * name){
  printf("Hi %s!\n", name);
}
~~~

Now we need to compile our C file into an object.  On Ubuntu or Mac using `gcc` we can run:

~~~ bash
$ gcc -c sayhi.c -o sayhi.o
~~~

Using the `-o` flags allow us to create an Object filetype.  Once we've got our Object file, we can bind it from within our Crystal app.  Open up our `sayhi_c.cr` file, and have it reflect the following:

~~~ ruby
require "./sayhi_c/*"

@[Link(ldflags: "#{__DIR__}/sayhi_c/sayhi.o")]

lib Say
  fun hi(name : LibC::Char*) : Void
end


Say.hi("Auth0")
~~~ 

I'll mention now that there are no implicit type conversions except `to_unsafe` - [explained here](https://crystal-lang.org/docs/syntax_and_semantics/c_bindings/to_unsafe.html) when invoking a C function: you must pass the exact type that is expected.

Also worth noting at this point is that since we have built our C file into an object file, we can include it in the project directory and link from there.  When we want to link dynamic libraries or installed C packages, we can just link them without including a path.

So, if we build our project file and run it, we get the following:

~~~ bash
$ crystal build --release src/sayhi_c.cr

$ ./sayhi_c

 > Hi Auth0!
~~~

It's really easy to bind to C in Crystal, and is definitely one of the features that attracts me most to the language.  I'm really looking forward to writing a C binding for a useful library and being able to utilise this functionality in production!


## Concurrency Primitives

One of my favourite parts of *Golang* is the `goroutine` threading system.  Working in the Database industry, I got a real passion for concurrency &amp; parallelism and when looking to a new language, one of the first things I explore are the concurrency primitives.  In Crystal, we can use the `Spawn` functionality in a very similar way to `Goroutines` in Golang, `core.async` in Clojure, or the lightweight threading in Elixir/Erlang.

For a simple test, I wrote two quick scripts to test the Spawn functionality in Crystal alongside Ruby.  We all know that Ruby is **not** a great language for threading, so I'm interested to see how much better Crystal is in small experiments.  Let's take the following example in ***Ruby***:

~~~ ruby
1000.times.map do
  Thread.new do
    puts "Hello?"
  end
end.each(&:join)
~~~

Running this from terminal I got the following results:

~~~ bash
$ time ruby spawntest.rb

real	0m0.288s
user	0m0.132s
sys	0m0.116s
~~~

I ran this little script on one of my ancient laptops that runs only 2gb of RAM and a terrible, *terrible* processor.  Now, porting this script to ***Crystal***, we can write:

~~~ ruby
channel = Channel(String).new
1000.times do
  spawn {
    channel.send "Hello?"
  }
  puts channel.receive
end
~~~

Running this script with the `crystal` command, I got the following results:

~~~ bash
$ time crystal spawntest.cr

real	0m1.129s
user	0m0.952s
sys	0m0.276s
~~~

Hmmmm, very interesting indeed!  Well, seen as Crystal is a compiled language and meant to be used to build small binaries that are easily distributed, it'd be a good idea to compile this small script and use *that* data instead!  I compiled the script using the `--release` flag - this tells the Crystal compiler to optimise the bytecode.

~~~ bash
$ crystal build --release spawntest.cr

$ time ./spawntest

real	0m0.008s
user	0m0.004s
sys		0m0.000s
~~~

As you can see, this result is markedly different.  Using the `--release` flag when building the Crystal executable cuts out a lot of bloating and optimises the executable to be as efficient as possible.  Obviously, the above test is a very naive use of the Spawn functionality, and unfortunately, I haven't had the opportunity to test in a load-heavy production environment. But soon I fully intend to, and I'll write another article benchmarking this in detail when I have a good usecase and get the chance to!


## Built-in Tooling in Crystal

One of the things I like most about Crystal is the excellent built-in tooling available.  When I look at new languages, especially relatively immature languages; it's always very reassuring when the language has extensive built-in tooling available to help developers stay productive &amp; happy!  In Crystal, there are a bunch of tools that make hacking around in the language super fun, but also help us to stay on the right track with semantics etc.

#### Testing

If you're coming from a Ruby/Rails background, I think you'll be ***very*** happy with the built-in testing framework that ships with Crystal.  It's rather reminiscent of *RSpec*, and will be really easy to use for anyone coming from a similar background.  Even if you're not from a Ruby/Rails background, it's a great testing tool and is super effective.

Using the `Greeter` demo app from the Crystal docs, we could write our Specs as follows:

~~~ ruby
require "spec"
require "../lib/greeter" # demo greeter class

describe Greeter do
  describe "#shout" do
    it "returns upcased string" do
      Greeter.new.shout('hello auth0').should eq "HELLO AUTH0"
    end
  end

  describe ".hello" do
    it "returns a static Hello string" do
      Greeter.hello.should eq "Hello"
    end
  end
end
~~~

As you can see, this spec should look *very* familiar to any Rubyists, and is becoming the more preferred syntax for application testing across many languages - there being RSpec clone libraries across most languages now!

#### Project Scaffold

Much the same as Elixir having the `Mix` manager, and Erlang the `Rebar` manager, Crystal has it's own built-in project scaffolder &amp; package manager.  I'd recommend using this at all times to ensure sematics are followed.  We can use it with the following:

~~~ bash
$ crystal init lib my_cool_lib
      create  my_cool_lib/.gitignore
      create  my_cool_lib/LICENSE
      create  my_cool_lib/README.md
      create  my_cool_lib/.travis.yml
      create  my_cool_lib/shard.yml
      create  my_cool_lib/src/my_cool_lib.cr
      create  my_cool_lib/src/my_cool_lib/version.cr
      create  my_cool_lib/spec/spec_helper.cr
      create  my_cool_lib/spec/my_cool_lib_spec.cr
Initialized empty Git repository in ~/my_cool_lib/.git/
~~~

#### Sharding

No - not creating Database Shards (luckily)!  Shards are Crystal's packages distributed in the same way as Ruby Gems, Elixir Libs or Golang packages.  Each application we create contains a file in the root directory named `shard.yml`.  This file contains project details and external dependencies.  The `shard.yml` file in my `sayhi_c` app above looks like this:

~~~ yml
name: sayhi_c
version: 0.1.0

authors:
  - Robin Percy <robin@percy.pw>

targets:
  sayhi_c:
    main: src/sayhi_c.cr

crystal: 0.22.0

license: MIT
~~~

The app I built has no dependencies to use, but if we want to include external packages we can do so by adding them at the bottom of the file:

~~~ yml
dependencies:
  github:
    github: felipeelias/crystal-github
    version: ~> 0.1.0
~~~

#### Documentation & Formatting

Crystal has a great built-in tool for generating documentation and formatting files.  The documentation that is generated is excellent - built-in html/css and almost instantly ready to deploy.

To generate documentation, from the project root directory we can simply run:

~~~ bash
$ crystal doc
~~~

This will create a docs directory, with a doc/index.html entry point. All files inside the root src directory of the project from which we ran the command will be considered.

Alongside this, the built-in *Formatter* tool is a great feature of the language.  We can run the formatter over our project by running:

~~~ bash
$ crystal tool format
~~~

We can use this tool to unify code styles and to submit documentation improvements to Crystal itself.  The formatter is also very fast, so very little time is lost if you format the entire project's codebase instead of just a single file.

*Both of these features are very cool, and highly useful!*

## What I don't like

Like anything in this world, Crystal can't possibly be perfect!  There are two ***very*** small issues that I find with it...

As a Polyglot programmer, I've had to learn a bunch of different programming paradigms.  While this isn't a fault in Crystal, the fact that it's object orientated is pretty much the only thing I'm not too keen on in Crystal.  Other than that; being a relatively young &amp; immature language, there's often a lack of documentation available when you want to do something incredibly specific.

Seeing this as an opportunity instead of a foible - it's actually kind of cool, because this means we can write documentation ourselves and hack sample apps together to become early adopters and decent contributors in the Crystal community!


## Aside - Auth0 & JWTs in Crystal 

**Update:** - I have written about [securing a Crystal web app with Auth0 &amp; JWT's here.](https://auth0.com/blog/building-your-first-crystal-app-with-jwt-authentication/)

At the moment, there is no Crystal-Auth0 library to use for end-to-end application securing.  However, there *is* a JWT library available for Crystal already [here](https://github.com/greyblake/crystal-jwt).

One thing to note here is that the Crystal-JWT library does not yet support the `RS256` algorithm, which is the preffered algorithm and only supports the `HS256` algorithm.  When setting up your application in the Auth0 control panel, make sure to select the `HS256` algorithm to reflect this.

In my next series of articles, I will be writing specifically about using Auth0 in a ***NON-jwt*** context, and I'll make sure I demonstrate this in Crystal!

Of course, if you're looking to secure a Crystal-based web app, you can always simply use the [Auth0 Centralised Login](https://auth0.com/docs/hosted-pages/login).  The Centralised Login will allow you to have immediate drop-in user management functionality.

## Conclusion

**I really rather like it!**

Although relatively immature, Crystal is a promising language with a growing Dev community surrounding it.  In my previous article about Auth0 Lock / Iris Image Recognition, I mentioned the fact that it'd be better to use the pHash / Blockhash libraries for a production environment.  If I was to build that system, I would most definitely use Crystal to bind to those C libraries.  I know that I'd be getting fantastically close-to-C speeds, and with the ease and joy of writing Crystal!

I am very much looking forward to seeing where this language goes.  I think the adoption rate will rapidly increase and I'm excited to see startups using it in production systems.  I am currently experimenting in building a Crystal library for the Auth0 API.  I will write another article on building an API client in Crystal when I'm finished.

I do hope this article has inspired you to give Crystal a try, and look forward to hearing your feedback if/when you do!  If you need any help and want to ask questions, [reach out to me via email](mailto:robin@percy.pw) and [@rbin](http://twitter.com/rbin) on twitter, I'm happy to help!

## Handy Resources

 - [https://github.com/veelenga/awesome-crystal](https://github.com/veelenga/awesome-crystal) 
 - [https://play.crystal-lang.org/#/cr](https://play.crystal-lang.org/#/cr) 
 - [https://www.reddit.com/r/crystal_programming/](https://www.reddit.com/r/crystal_programming/) 
 - [http://kemalcr.com/](http://kemalcr.com/) 
