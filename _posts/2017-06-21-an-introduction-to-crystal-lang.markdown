---
layout: post
title: "The Highs & Lows of Crystal - an intro to Crystal Lang"
description: "Crystal Language claims to be as fast as C and as easy to learn as Ruby.  Here, I put it to the test and give my 2 cents!"
date: 2017-06-21 15:54
category: Technical Guide
author:
  name: "Robin Percy"
  url: "https://twitter.com/rbin"
  mail: "robin@percy.pw"
  avatar: "https://secure.gravatar.com/avatar/685342d5e7f42c3ab8d251d7d4a53308?s=100&d=mm&r=g"
tags:
- Crystal Language
- Low-Level Programming
- Systems Programming
---


The Highs and Lows of Crystal  (An Introduction to the Language)
====================================

Crystal is a Statically-typed, compiled, systems programming language with the aims of being as fast as c/c++, and having a syntax as readable as Ruby.  This article is an introduction to the Crystal Language, through the eyes of a polyglot programmer.  Being a former programmer of both C and Ruby, I have been able to explore the ins-and-outs of Crystal with an objective mindset and give an unbiased opinion on its features; from it's low-level primitives to its familiar syntax, and everything inbetween.

I first came accross Crystal when I saw [@sferik](https://twitter.com/sferik)  giving a talk on it in Poland back in 2015.  [Video here.](https://www.youtube.com/watch?v=Ysm4IU4aWoQ)  It was a great talk, and sparked my interest to Crystal right there and then.  When I initially checked out Crystal, I thought it looked awesome but I was too busy with all the other languages I was using on a daily basis to be able to focus my time properly on it.

Alongside being too busy, I couldn't really see why I'd use Crystal instead of using C/Erlang/Go/Ruby - languages that I already knew.  What I can say with confidence now though; is that whilst those languages may all be able to achieve the same end-goal, they're all *better* in different ways entirely.

When I want to build distributed apps, like my *Fist/Bump Heartbeat Monitor* - I use Erlang/Elixir.  When I want to build an API backend I use Golang.  When I want to spend the day with my brains scattered, and most probably in tears - I use C.  For readibility and demonstrations, I use Ruby.  When it comes to writing low-level systems such as daemons and obtuse Kernels, while it would be most performant to turn to C, it'd also take me a **LONG** time to do anything and the aforementioned tears would be very-likely present.  This is where Crystal comes in.

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

The fact that you can use Ruby syntax highlighting natively for Crystal says everything!  Coming from Ruby to Crystal is a remarkably easy adaptation.  The fact is that you can actually copy and paste code from Ruby to Crystal and 90% of the time, it will run with no errors.  The creators of Crystal understand that Ruby is undoubtedly the most visually appealing language, and therefore built Crystal to take as much as possible from that.  You can even run Crystal programs using the `Ruby` shell command, since the syntax is valid for both languages!


## Binding C

One of the big selling points for Crystal is the ease of which you can call C libraries.  "Crystal allows you to bind to existing C libraries without writing a single line in C.  Additionally, it provides some conveniences like `out` and `to_unsafe` so writing bindings is as painless as possible."

Let's build a simple script in C; that says hi!  We'll then write a Crystal app to bind to our C library.  This is a great start point for anyone who wants to know about binding C in Crystal.

First off, let's create a project with Crystal's scaffolding tool:

	$ crystal init app sayhi_c

Then head into the directory `sayhi_c/src/sayhi_c` and let's create a file `sayhi.c` with the following contents:

~~~ c
#include <stdio.h>

void hi(const char * name){
  printf("Hi %s!\n", name);
}
~~~

Now we need to compile our C file into an object.  On Ubuntu or Mac using `gcc` we can run:

	$ gcc -c sayhi.c -o sayhi.o

Once we've got our object file, we can bind it from within our Crystal app.  Open up our `sayhi_c.cr` file, and have it reflect the following:

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

One of my favourite parts of *Golang* is the `goroutine` threading system.  Working in the Database industry, I got a real passion for concurrency &amp; parallelism and when looking to a new language, one of the first things I explore are the concurrency primitives.  In Crystal, we can use the `Spawn` functionality in a very similar way to Golang or Elixir/Erlang.

For a simple test, I wrote two quick scripts to test the Spawn functionality in Crystal alongside Ruby.  We all know that Ruby is **not** a great language for threading, so I'm interested to see how much better Crystal really is.  Let's take the following example in ***Ruby***:

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
sys		0m0.116s
~~~

I ran this little script on one of my ancient laptops that only has 2gb of RAM and a terrible, *terrible* processor.  Now, porting this script to ***Crystal***, we can write:

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

~~~bash
$ time crystal spawntest.cr

real	0m1.129s
user	0m0.952s
sys		0m0.276s
~~~

Hmmmm, very interesting indeed!  Well, seen as Crystal is a compiled language and meant to be used to build small binaries that are easily distributed, it'd be a good idea to compile this small script and use *that* data instead!  I compiled the script using the `--release` flag - this tells the Crystal compiler to optimise the programme.

~~~bash
$ crystal build --release spawntest.cr

$ time ./spawntest

real	0m0.008s
user	0m0.004s
sys		0m0.000s
~~~

As you can see, this result is markedly different.  Using the `--release` flag when building the Crystal executable cuts out a lot of bloating and optimises the executable to be as efficient as possible.  Obviously, the above test is a very naive use of the Spawn functionality, and unfortunately, I haven't had the opportunity to test in a load-heavy production environment. But soon I'll write another article benchmarking this in detail when I have a good usecase and get the chance to!


## Built-in Tooling in Crystal

One of the things I like most about Crystal is the excellent built-in tooling available.  When I look at new languages, especially relatively immature languages; it's always very reassuring when the language has extensive built-in tooling available to help developers stay productive &amp; happy!  In Crystal, there are a bunch of tools that make hacking around in the language super fun, but also help us to stay on the right track with semantics etc.

#### Testing

If you're coming from a Ruby/Rails background, I think you'll be ***very*** happy with the built-in testing framework that ships with Crystal.  It's rather reminiscent of *RSpec*, and will be really easy to use for anyone coming from that background.  Even if you're not from a Ruby/Rails background, it's a great testing tool and is super effective.

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

As you can see, this test looks *very* familiar to any Rubyists, and is becoming the more preferred syntax for application testing.

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

Crystal has a great inbuilt tool for generating documentation and formatting files.  The documentation that is generated is excellent - built in html/css and almost instantly ready to deploy.

To generate documentation for a project, from the project dir we can simply run:

	$ crystal doc

This will create a docs directory, with a doc/index.html entry point. All files inside the root src directory of the project from which we ran the command will be considered.

Alongside this, the inbuilt *Formatter* tool is a great feature of the language.  We can run the formatter over our project by running:

	$ crystal tool format

We can use this tool to unify code styles and to submit documentation improvements to Crystal itself.  The formatter is also very fast, so very little time is lost if you format the entire project's codebase instead of just a single file.

*Both of these features are very cool, and highly useful!*

## What I don't like

Like anything in this world, Crystal can't possibly be perfect!  There are two ***very*** small issues that I find with it...

As a Polyglot programmer, I've had to learn a bunch of different programming paradigms.  While this isn't a fault in Crystal, the fact that it's Object Orientated is pretty much the only thing I'm not too keen on in Crystal.  Other than that; being a relatively young &amp; immature language, there's often a lack of documentation available when you want to do something incredibly specific.

**Seeing this as an opportunity** instead of a foible - it's actually kind of cool, because this means we can write documentation ourselves and hack sample apps together to become early adopters and decent contributors in the Crystal community!


## Conclusion

I like it!  Although relatively immature, Crystal is a promising language with a growing dev community surrounding it.  In my previous article about Auth0 Lock / Iris Image Recognition, I mentioned the fact that it'd be better to use the pHash / Blockhash libraries for a production environment.  If I was to build this system, I would most definitely use Crystal to bind to those C libraries.  I know that I'd be getting fantasticly close-to-C speeds, and with the ease and joy of writing Crystal!

I am very much looking forward to seeing where this language goes.  I think the adoption rate will increase and I'm excited to see startups using it in production systems.  I am currently experimenting in building a Crystal library for the Auth0 API.  I will write another article on building an API client in Crystal when I'm finished.

I do hope this article has inspired you to give Crystal a try, and look forward to hearing your feedback if/when you do!  If you need any help and want to ask any questions, [reach out to me](mailto:robin@percy.pw) - I'm happy to help!

  ***[ - @rbin](http://twitter.com/rbin)***

<br />
## Handy Resources

 - [https://github.com/veelenga/awesome-crystal](https://github.com/veelenga/awesome-crystal) 
 - [https://play.crystal-lang.org/#/cr](https://play.crystal-lang.org/#/cr) 
 - [https://www.reddit.com/r/crystal_programming/](https://www.reddit.com/r/crystal_programming/) 
 - [http://kemalcr.com/](http://kemalcr.com/) 