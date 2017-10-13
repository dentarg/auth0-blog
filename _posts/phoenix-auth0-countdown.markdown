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
Personally I've been stuck under a rock as a PHP developer. Fortunately for me, Elixir (like PHP) is a dynamically typed. It builds on Erlang and with the Erlang VM, almost immediately, you can be up and running. If your app compiles, it's already deployable.

- Sentence about countdown (and why?)
- Sentence about auth
- Link to github repository
---

## Elixir
Personally I've been stuck under a rock as a PHP developer. I've missed plenty of cool languages come (and go) while playing with PHP and Elixir is no exception. Fortunately for me, Elixir (like PHP) is a dynamically typed. My brain didn't have to work *too* hard to build something cool. Elixir builds on Erlang and leverages the Erlang VM. It's got a super small footprint and suprisingly robust, so almost immediately, you can be up and running. Phoenix is genuinely exciting to use and you can't escape it if you're looking for a familiar framework to build on in Elixir.

***It doesn't stop there.***

If your Elixir environment compiles, it's already deployable and the guides come ready to talk you to getting it online with Heroku.

> Elixir is a functional, concurrent, general-purpose programming language that runs on the Erlang virtual machine (BEAM). Elixir builds on top of Erlang and shares the same abstractions for building distributed, fault-tolerant applications.

## Phoenix

You can't escape Phoenix if you're looking for a framework to build on in Elixir. They portray themselves as a fresh approach to tried and true MVC development. Actually, I think they're wrong. Phoenix genuinely excited me just how well we can separate our concerns across an extremely well thought out, logical structure.

Phoenix is an MVC framework written in Elixir and will be welcoming and comfortable to use for anyone familiar with Rails or Django.

> Phoenix provides the best of both worlds - high developer productivity and high application performance. It also has some interesting new twists like channels for implementing realtime features and pre-compiled templates for blazing speed.

## My first Phoenix app

With holiday season fast approaching and a growing family, we're now counting down the days to sit at home in-front of our (fake) fireplace :)

***So I thought why not?***

An application I can count down to my favourite events!

`mix phx.new countdown`

    $ mix phx.new countdown
    * creating countdown/config/config.exs
    * creating countdown/config/dev.exs
    * creating countdown/config/prod.exs
    * creating countdown/config/prod.secret.exs
    * creating countdown/config/test.exs
    * creating countdown/lib/countdown/application.ex
    * creating countdown/lib/countdown.ex
    * creating countdown/lib/countdown_web/channels/user_socket.ex
    * creating countdown/lib/countdown_web/views/error_helpers.ex
    * creating countdown/lib/countdown_web/views/error_view.ex
    * creating countdown/lib/countdown_web/endpoint.ex
    * creating countdown/lib/countdown_web/router.ex
    * creating countdown/lib/countdown_web.ex
    * creating countdown/mix.exs
    * creating countdown/README.md
    * creating countdown/test/support/channel_case.ex
    * creating countdown/test/support/conn_case.ex
    * creating countdown/test/test_helper.exs
    * creating countdown/test/countdown_web/views/error_view_test.exs
    * creating countdown/lib/countdown_web/gettext.ex
    * creating countdown/priv/gettext/en/LC_MESSAGES/errors.po
    * creating countdown/priv/gettext/errors.pot
    * creating countdown/lib/countdown/repo.ex
    * creating countdown/priv/repo/seeds.exs
    * creating countdown/test/support/data_case.ex
    * creating countdown/lib/countdown_web/controllers/page_controller.ex
    * creating countdown/lib/countdown_web/templates/layout/app.html.eex
    * creating countdown/lib/countdown_web/templates/page/index.html.eex
    * creating countdown/lib/countdown_web/views/layout_view.ex
    * creating countdown/lib/countdown_web/views/page_view.ex
    * creating countdown/test/countdown_web/controllers/page_controller_test.exs
    * creating countdown/test/countdown_web/views/layout_view_test.exs
    * creating countdown/test/countdown_web/views/page_view_test.exs
    * creating countdown/.gitignore
    * creating countdown/assets/brunch-config.js
    * creating countdown/assets/css/app.css
    * creating countdown/assets/css/phoenix.css
    * creating countdown/assets/js/app.js
    * creating countdown/assets/js/socket.js
    * creating countdown/assets/package.json
    * creating countdown/assets/static/robots.txt
    * creating countdown/assets/static/images/phoenix.png
    * creating countdown/assets/static/favicon.ico

    Fetch and install dependencies? [Yn] Y
    * running mix deps.get
    * running mix deps.compile
    * running cd assets && npm install && node node_modules/brunch/bin/brunch build

    We are all set! Go into your application by running:

        $ cd countdown

    Then configure your database in config/dev.exs and run:

        $ mix ecto.create

    Start your Phoenix app with:

        $ mix phx.server

    You can also run your app inside IEx (Interactive Elixir) as:

        $ iex -S mix phx.server

`mix phx.server`

Works, yay

    $ mix phx.server
    Compiling 13 files (.ex)
    Generated countdown app
    [info] Running CountdownWeb.Endpoint with Cowboy using http://0.0.0.0:4000
    20:38:47 - info: compiled 6 files into 2 files, copied 3 in 855 ms
    [info] GET /
    [debug] Plug.Session could not verify incoming session cookie. This may happen when the session settings change or a stale cookie is sent.
    [debug] Processing with CountdownWeb.PageController.index/2
      Parameters: %{}
      Pipelines: [:browser]
    [info] Sent 200 in 18ms

## The countdowns
- Create CRUD
- Modify repo for future events for landing page
- Modify landing page for countdowns
- Frontendy-countdown-stuff

`mix ecto.create`

    $ mix ecto.create
    Compiling 10 files (.ex)
    Generated countdown app
    The database for Countdown.Repo has been created

`mix phx.gen.html Events Event events title due:datetime`

    $ mix phx.gen.html Events Event events title due:datetime
    * creating lib/countdown_web/controllers/event_controller.ex
    * creating lib/countdown_web/templates/event/edit.html.eex
    * creating lib/countdown_web/templates/event/form.html.eex
    * creating lib/countdown_web/templates/event/index.html.eex
    * creating lib/countdown_web/templates/event/new.html.eex
    * creating lib/countdown_web/templates/event/show.html.eex
    * creating lib/countdown_web/views/event_view.ex
    * creating test/countdown_web/controllers/event_controller_test.exs
    * creating lib/countdown/events/event.ex
    * creating priv/repo/migrations/20171011194308_create_events.exs
    * creating lib/countdown/events/events.ex
    * injecting lib/countdown/events/events.ex
    * creating test/countdown/events/events_test.exs
    * injecting test/countdown/events/events_test.exs

    Add the resource to your browser scope in lib/countdown_web/router.ex:

        resources "/events", EventController

    Remember to update your repository by running migrations:

        $ mix ecto.migrate

Now edit `./countdown/lib/countdown_web/router.ex` and place `resources "/events", EventController` inside the `CountdownWeb` scope.

      scope "/", CountdownWeb do
        pipe_through :browser # Use the default browser stack
        get "/", PageController, :index
    +   resources "/events", EventController
      end

`mix ecto.migrate`

    $ mix ecto.migrate
    [info] == Running Countdown.Repo.Migrations.CreateEvents.change/0 forward
    [info] create table events
    [info] == Migrated in 0.0s

`mix phx.server`

Still works, yay!

## Login with Auth0
- JS based auth for events page
- Server-side auth
