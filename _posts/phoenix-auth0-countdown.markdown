---
layout: post
title: "A countdown in Phoenix"
description: "Simple countdown clock with Auth0 to authenticate to the site"
date: 2017-10-06 8:30
category: Auth0
banner:
  text: "Auth0 makes it easy to add authentication to your application."
author:
  name: Luke Oliff
  url: https://www.auth0.com
  avatar: https://avatars3.githubusercontent.com/u/956290?v=3&s=200
  mail: luke@lukeoliff.com
is_non-tech: false
design:
  image: https://ludu-assets.s3.amazonaws.com/course-icons/26/I5mCOcqaE6RHdfD3Q1Ta
  bg_color: "#798bce"
tags:
- authorization
- authentication
- external
related:
-
---
**TL;DR:**
Personally I've been stuck under a rock as a PHP developer. Fortunately for me, Elixir (like PHP) is a dynamically typed language. It builds on Erlang and with the Erlang VM. Almost immediately, you can be up and running. If your app compiles, it's already deployable. Phoenix is genuinely exciting to use and you can't escape it if you're looking for a familiar framework to build on, in Elixir.

TODO: Sentence about countdown (and why?)
TODO: Sentence about auth
TODO: Link to github repository
---

## Elixir
Personally I've been stuck under a rock as a PHP developer. I've missed plenty of cool languages while playing with PHP - and Elixir is no exception. Fortunately for me, Elixir (like PHP) is a dynamically typed language. My brain didn't have to work *too* hard to build something cool. Elixir builds on Erlang and leverages the Erlang VM. It's got a super small footprint and is suprisingly robust. Almost immediately, you can be up and running.

***It doesn't stop there.***

If your Elixir app compiles, it's already deployable and the how-to-guides come ready to talk you through to getting it online with Heroku.

> Elixir is a functional, concurrent, general-purpose programming language that runs on the Erlang virtual machine (BEAM). Elixir builds on top of Erlang and shares the same abstractions for building distributed, fault-tolerant applications.

## Phoenix

You can't escape Phoenix if you're looking for a framework to build on in Elixir. They portray themselves as a fresh approach to tried and true MVC development. Actually, I think they're wrong. Phoenix genuinely excited me just how well we can separate our concerns across an extremely well thought out, logical structure.

Phoenix is an MVC framework written in Elixir and will be welcoming and comfortable to use for anyone familiar with Rails or Django.

> Phoenix provides the best of both worlds - high developer productivity and high application performance. It also has some interesting new twists like channels for implementing realtime features and pre-compiled templates for blazing speed.

## What should we build?

With holiday season fast approaching and a growing family, we're now counting down the days to sit at home,, in-front of our (fake) fireplace and open some presents! :)

***So I thought why not?***

An application I can count down to my favourite events!

- https://days.to/until/easter
- http://www.xmasclock.com

## Getting ready

Lets install Elixir: http://elixir-lang.org/install.html

Now install Hex package: https://hexdocs.pm/mix/1.0.5/Mix.Tasks.Local.Hex.html

    $ mix local.hex

Phoenix needs at least Elixir 1.4 and Erlang 18 or later, run:

    $ elixir -v
    Erlang/OTP 19 [erts-8.3] [source] [64-bit] [smp:8:8] [async-threads:10] [hipe] [kernel-poll:false] [dtrace]

    Elixir 1.4.2

Now we can install Phoenix v1.3.0:

    $ mix archive.install https://github.com/phoenixframework/archives/blob/master/phx_new-1.3.0.ez

## Build it!

Now we can run the Pheonix build command.

    $ mix phx.new countdown

It will generate a skeleton application.

    * creating countdown/config/config.exs
    * creating countdown/config/dev.exs
    * creating countdown/config/prod.exs
    ...
    * creating countdown/assets/static/favicon.ico

When prompted, fetch and install dependencies.

> Phoenix uses Brunch.io for asset management. Brunch.io’s dependencies are installed via the node package manager, not mix. Phoenix will prompt us to install them at the end of the mix phx.new task. If we say “no” at that point, and if we don’t install those dependencies later with npm install, our application will raise errors when we try to start it, and our assets may not load properly. If we don’t want to use Brunch.io at all, we can simply pass --no-brunch to mix phx.new.

    Fetch and install dependencies? [Yn] Y

Where it will fetch and compile Elixir and NPM dependenices.

    * running mix deps.get
    * running mix deps.compile
    * running cd assets && npm install && node node_modules/brunch/bin/brunch build

And at the end it will give you some helpful info to check it's all working, running your application and even how to interact with your app inside IEx (Interactive Elixir).

    We are all set! Go into your application by running:

        $ cd countdown

    Then configure your database in config/dev.exs and run:

        $ mix ecto.create

    Start your Phoenix app with:

        $ mix phx.server

    You can also run your app inside IEx (Interactive Elixir) as:

        $ iex -S mix phx.server

So let's change directory and check we can run the application.

    $ cd countdown && mix phx.server

It shows us the compilation including any warnings or errors including deprecations or unused variables. Very cool.

    [info] Running CountdownWeb.Endpoint with Cowboy using http://localhost:4000
    Compiling 13 files (.ex)
    ..
    ==> mime
    Compiling 1 file (.ex)
    warning: String.strip/1 is deprecated, use String.trim/1
      lib/mime.ex:28
    ...
    [info] Sent 200 in 18ms

Now we can take a look our app by visiting http://localhost:4000. It should look something like...

![Phoenix app starter](../img/phoenix/phoenix_app-created.jpg)

## Our Phoenix application

So first thing is first, we need to be able to store the events we are going to countdown to. If you didn't run it yet, lets create the database now.

> Assuming you have postgres setup with user and password "postgress"

    $ mix ecto.create
    The database for Countdown.Repo has been created

Now comes the backbone of the application, the CRUD actions for our events. In order to achieve this, Phoenix supports us with four different generators.

> `mix phoenix.gen.html`
> Gen HTML creates: model, view, controllers, repository, templates, tests

> `mix phoenix.gen.channel`
> Gen Channel creates: channel and tests

> `mix phoenix.gen.json`
> Gen JSON, for APIs really, creates: model, view, controllers, repository, tests

> `mix phoenix.gen.model`
> Gen Model creates: model and repository

We use the first generator which creates all resources and actions for us - the same as rails generators. We need to declare the name as a collection, singular and plural, and next the field names with types.

    $ mix phx.gen.html Events Event events title due:datetime

We're pretty close to having a CRUD application ready to go!

    * creating lib/countdown_web/controllers/event_controller.ex
    * creating lib/countdown_web/templates/event/edit.html.eex
    ...
    * injecting test/countdown/events/events_test.exs

Go and edit `lib/countdown_web/router.ex` and place `resources "/events", EventController` inside the `CountdownWeb` scope.

```diff
   scope "/", CountdownWeb do
     pipe_through :browser # Use the default browser stack

     get "/", PageController, :index
+    resources "/events", EventController
   end
```

Now we can migrate our new model into the database.

    $ mix ecto.migrate
    Compiling 10 files (.ex)
    Generated countdown app
    [info] == Running Countdown.Repo.Migrations.CreateEvents.change/0 forward
    [info] create table events
    [info] == Migrated in 0.0s

Lets run our server, make sure it's still working.

    $ mix phx.server

So it's still running, but this time we can head to http://localhost:4000/events and see our new CRUD interfaces.

![Phoenix CRUD](../img/phoenix/phoenix_app-crud.jpg)

While we're here, lets add an event!

![Phoenix CRUD Added item](../img/phoenix/phoenix_app-added.jpg)

And you can see, it's already a fully featured CRUD application!

![Phoenix CRUD List](../img/phoenix/phoenix_app-list.jpg)

## Making our homepage

I really want to list our events on the homepage. We could list all events, but as we are going to count down I think it's important we only list future events. For this we're going to need a repository method to fetch events in the future. Lets give it a go...

Edit `lib/countdown/events/events.ex` which is our repository method for our events.

I think you'll find the query structure familiar if you've used Doctrine, Django ORM and SQL. We're going to be selecting `from` `Countdown.Events.Event` where `due` is greather than or equal to the current UTC timestamp.

    query = from e in Countdown.Events.Event,
           where: e.due >= ^DateTime.utc_now

> The docblock shows you how to run the method in IEx (interactive elixir) and the format of the response, usually a map from the a query.

```diff
   ...

   def list_events do
     Repo.all(Event)
   end
+
+   @doc """
+   Returns the list of future events.
+
+   ## Examples
+
+       iex> list_future_events()
+       [%Event{}, ...]
+
+   """
+   def list_future_events do
+     query = from e in Countdown.Events.Event,
+       where: e.due >= ^DateTime.utc_now
+     Repo.all(query)
+   end

   ...
```

We just need to add this to the controller and display some items on the homepage.

Edit our homepage controller at `lib/countdown_web/controllers/page_controller.ex`

```diff
   ...
   use CountdownWeb, :controller
+  alias Countdown.Events
 
   def index(conn, _params) do
+    events = Events.list_future_events()
-    render conn, "index.html"
+    render conn, "index.html", events: events
   end
   ...
```

Edit our homepage template at `lib/countdown_web/templates/page/index.html.eex` and add a very simple list of items - we'll come back and make this cooler later!

```diff
   <div class="jumbotron">
     <h2><%= gettext "Welcome to %{name}!", name: "Phoenix" %></h2>
     <p class="lead">A productive web framework that<br />does not compromise speed and maintainability.</p>
   </div>

+  <ul>
+  <%= for event <- @events do %>
+    <li><%= event.title %>, <%= event.due %></li>
+  <% end %>
+  </ul>
   ...
```

I've added Last Christmas in, so we can see our query working.

![Phoenix adding Christmas](../img/phoenix/phoenix_app-list-last-xmas.jpg)

Now we can see our list is limited to only events in the future. Perfect!

![Phoenix futute events list](../img/phoenix/phoenix_app-home-list.jpg)

TODO: Styling it.

## Login with Auth0
TODO: Setting up Auth0
TODO: JS based auth for events page
TODO: Server-side auth


# EVERYWHERE. More examples.
TODO: Links and citations.