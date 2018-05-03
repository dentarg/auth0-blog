---
layout: post
title: "Ruby on Rails—Killer Workflow with Docker (Part 1)"
description: "Learn how to set up a killer dockerized workflow that will raise your productivity while developing Ruby on Rails applications."
longdescription: "In this series, you will learn how to set up a killer dockerized workflow that will raise your productivity while developing Ruby on Rails application. You will use tools like Docker, Docker Compose, Travis, and Heroku to set up an state-of-the-art workflow."
date: 2018-05-15 08:30
category: Technical Guide, Backend, Ruby On Rails
design:
  bg_color: "#333333"
  image: https://cdn.auth0.com/blog/logos/node.png
author:
  name: "Vijayabharathi Balasubramanian"
  url: "vijayabharathib"
  mail: "yajiv.vijay@gmail.com"
  avatar: "https://twitter.com/vijayabharathib/profile_image?size=original"
tags:
- ruby-on-rails
- docker
- ruby
- rails
- ci
- cd
- ci/cd
- continuous-integration
- continuous-delivery
- auth0
related:
- 2018-05-17-ruby-on-rails-killer-workflow-with-docker-part-1
- 2017-05-22-load-balancing-nodejs-applications-with-nginx-and-docker
- 2017-01-03-rails-5-with-auth0
---

**TL;DR:** In this article, you'll learn how to set up a dockerized Workflow to bootstrap a full-stack, database-driven application using Ruby on Rails with external identity management. It will help you convert ideas into testable MVPs ([Minimum Viable Products](https://en.wikipedia.org/wiki/Minimum_viable_product)) in no time. 

You will be able to build a small shelf and fill them with books in the process. You can have a look at the app [here](https://shelvedbooks.herokuapp.com/) and this [repository on GitHub](https://github.com/vijayabharathib/dockerized-rails-app) has the code and configuration of the finished product.

## Development Workflow

The objective is to optimize for developer happiness. Ruby on Rails fits the bill. You'll set up a workflow that makes it easy to configure, test, debug and deploy. Also, you will enter the world of [continuous delivery](https://en.wikipedia.org/wiki/Continuous_delivery) where commits are deployed automatically on successful test runs.

### Tech Stack

**1. Docker**

You need to get [Docker installed](https://docs.docker.com/install/). Use `docker -v` on a terminal to verify you have a working version of Docker. The one I have is `Docker version 17.12.0-ce, build c97c6d6`. You'll know more about Docker in a minute. Installing and getting to know Docker is a great investment of your time. You'll receive returns in multiples as you start to use Docker for all your projects.

**2. Docker Compose**

Next, you will need to install [Docker Compose](https://docs.docker.com/compose/install/). It will allow you to orchestrate multiple Docker services together. Try `docker-compose -v` to ensure a working version. Here is the result from my terminal: `docker-compose version 1.16.1, build 6d1ac21`.

**3. Free Tier Login Accounts**

* [GitHub]—to store your code in the cloud.
* [Travis]—to build and test your changes.
* [Heroku]—to deploy your app to cloud.
* [Auth0]—to manage the identity of your users.

None of them should cost you a dime while following this workflow!

**4. Git CLI** (Seriously?)

If you have not been using [Git CLI](https://git-scm.com/downloads), it's time already. Start [here](https://git-scm.com/book/en/v2/Getting-Started-The-Command-Line).

**5. What about Rails?**

That's the point. You *don't* need to install Ruby, Rails or Build Tools in your local environment. You'll instruct Docker to handle that.

## Docker - Up and Running

If you already know what Docker is and how is it helping developers, skip over to the _Finding The Right Docker Image_ section. If not, there is a first time for everything. Follow along.

Here is the problem. See if you recognize it. You started working on a new project that needed a certain environmental setup. You followed the guides to the letter and ran into issues launching the local application. No one else seems to have got the issue. **It works on their machine, but not on yours**. You consulted [Stack Overflow](https://stackoverflow.com/) trying to figure out what went wrong. Apply sequence of helpful answers to narrow down on the issue and finally reach the moment of truth.

You don't recognize that? Lucky you. For the rest of us, Docker solves the problem by allowing us to bundle our runtime environment in an image and share it around.

Just like your Git repository is a single version of truth for your code that you share with your team, a Docker image is a repository of your runtime environment that you can share with your team. 

Sometimes, it just boils down to having a simple text file named `Dockerfile` with a set of commands to get the right environment. Docker images are solved problems for you to build your solution on top of.

Let's say you need Ruby runtime on Ubuntu. Pull an Ubuntu image and install Ruby on top. Wait, isn't that what we do already? Yes. So, here is one better. How about pulling an image that already has Ruby on top of Ubuntu. Now we are talking? How about pulling an image that has Ruby and NodeJS on top of a Debian flavor? Sweet. From there onwards, the same image can be used across multiple projects as separate containers.

The bottom-line, pull an image and get down to business. Your business could be, finally, building that app. Tweaking configurations may not be a productive way to spend a whole evening, though that's exactly what you might end up doing in certain cases.

### Docker Vs Virtual OS

Now, think about other solutions that solve a similar problem. You might have used a *dual-boot* PC that runs both Windows and Linux. You would have switched between them when required.

Another solution is [VirtualBox](https://www.virtualbox.org/), which allows you to run entirely full-scale guest OS on top of your host OS.

These are not bad solutions. It is just that Docker is a leaner solution compared to these full-scale OS images if you just want to have a uniform runtime environment. Moreover, there is no automated way to configure each OS the same way, unless you do it manually, which may lead to different configurations at scale.

Compare that to a set of written instructions that can be version controlled. **Docker uses the instructions to pull in the necessary OS libraries to construct the runtime on top of your existing operating system**. Not too different from using a `package.json` or `Gemfile` to keep track of project dependencies.

The image with Ruby and Node that we'll be using is close to 300MB. You can explore for smaller images when you are done with this process. Imagine having to set up a virtual OS, which usually takes up more space.

Enough selling Docker. Time to get an image up and running.

### Finding The Right Docker Image

The right runtime environment for you may have been solved already. You just need to find it. If you only need Ruby, the [official Ruby image](https://store.docker.com/images/ruby) will do. If you need both Ruby and NodeJS, I found this [image by starefossen](https://hub.docker.com/r/starefossen/ruby-node/) useful.

This image uses the official Ruby image and builds NodeJS on top of it using commands from the official NodeJS image. So you get best of both worlds.

**Just a word of caution**, Docker is not a silver bullet. Our goal is to start a runtime as quickly as possible and move on to building our app. But if the repository is not maintained or updated to reflect latest ways to install NodeJS, then it might be broken. Look through the builds to ensure you have a working image.

### Giving Life to A Container

Hurray! Time to step into a terminal.

```bash
mkdir dockerized-rails-app
cd dockerized-rails-app
touch Dockerfile
```

In English, create a folder named `dockerized-rails-app`, `cd` into the directory, and create a file named `Dockerfile`. I can hear you say, "that doesn't need a terminal!". But, it's good to get comfortable living in the terminal.

Now, open your favorite text editor. [VSCode](https://code.visualstudio.com/) is the one I use. If you have VSCode, you can type `code .` on the terminal to open the folder in the editor. Fill in the following content within the `Dockerfile`:

```Dockerfile
FROM starefossen/ruby-node:2-8-stretch
```

That command says "pull the `ruby-node` image tagged `2-8-stretch`".

> **Tip**: Look into the [Docker Hub](https://hub.docker.com/r/starefossen/ruby-node/) and pick the right version from the list of tags that suit your needs.

Back to the terminal, it's time to build and run the container:

```bash
docker build -t auth0app .
docker run -it auth0app /bin/bash
```

The first command builds an image based on the instructions you've given in the `Dockerfile`. For now, `Dockerfile` just says, pull up the image from the repository. It would take minutes (or hours) depending on your connection. Total download size was close to 300MB for the first time.

The second command boots the image into a container, which is like giving life to the image. Can't help it, but it is identical to creating an object out of a class! The `-it` flag gives you an interactive terminal access *inside* the container. 

That should take you to the shell prompt that shows something in the lines of `root@abc123a1234b:/# `. That means you are inside the container, **with root access**. It is quite easy to expose your host root directory as a volume and it becomes editable within the container. *Just be careful what you command the prompt to do!* Even better, use `--user $(id -u):$(id -g)` flag while using `docker run` to force using current user instead of root.

Now run `ruby -v` inside the shell to get the Ruby version. Did you get `ruby 2.5.0...`? What about `node -v`? Did you get `v8.10`? 

Great! That's your own runtime environment with Ruby and Node pre-installed. Well done so far. Run `exit` to close the shell and come out of the container.

## Ruby on Rails Inside the Container

You'll shape different aspects of Rails project in this section. **This whole section is just one-off execution**. Once you are done with this, all else is normal application development workflow.

### Setting Up Dockerfile

Here is the new version of the `Dockerfile`:

```Dockerfile
FROM starefossen/ruby-node:2-8-stretch
RUN apt-get update -qq && \
    apt-get install -y nano build-essential libpq-dev && \
    gem install bundler
RUN mkdir /project
COPY Gemfile Gemfile.lock /project/
WORKDIR /project
RUN bundle install
COPY . /project
```

> **Tip**: Each command in the `Dockerfile` creates a layer. While layers created by commands such as `WORKDIR` as discarded towards final build, layers by `ADD`, `RUN` and `COPY` are retained and may increase the size of the final image. It is usually a [best practice](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/) to put most of those commands together in one line to avoid layers within the image. For example, `RUN apt-get update -qq && apt-get install -y nano build-essential libpq-dev` and so on. 

Here is what's going on:

1. Pull the Ruby + Node image from Docker hub.
2. Update the libraries within the image.
3. Install the `nano` editor, build tools, and library for Postgres.
4. Install Bundler which will update existing Bundler.
5. Create a folder for your project.
6. Copy `Gemfile` and `Gemfile.lock` from host to app folder.
7. Set the working directory to the app folder.
8. Run `bundle install` inside the project folder. This will install necessary gems inside the container.
9. Copy rest of the content from your host folder to container app folder.

Note that installing OS-specific tools and copying only `Gemfile` and `Gemfile.lock` to app folder before running `bundle install` has **tremendous advantage**. Changes to the other files within the application folder do not trigger `bundle install`. Only if the `Gemfile` or `Gemfile.lock` changes, `bundle install` will be triggered. Hang on for a while, we'll create the `Gemfile` and its lock file shortly.

If you think deeply enough, you'll understand that it will save hours. If thinking deeply hurts, just try moving the command `COPY . /project` line just above `bundle install`. Every time you make even a small change within app folder, the container has to be built with all the gems being installed from scratch. This hurts more!

### Stitch Services with Docker Compose

The `docker-compose.yml` file contains instructions that stitch multiple pieces together such as database container, application container, host folder where you store your application repository, environmental aspects such as volumes, and ports.

This is going to be a **database-driven application**. So, we need a way to persist data created in the environment. One way is to introduce a separate service for database layer that has its own volume (fancy name for storage space).

Create a `docker-compose.yml` file inside the folder. It looks like the one below:

```yml
version: '3.2'
volumes: 
  postgres-data:
services:
  db:
    image: postgres
    volumes: 
      - postgres-data:/var/lib/postgresql/data
  app:
    build:
      context: .
      dockerfile: Dockerfile
    command: bundle exec rails s -p 3000 -b '0.0.0.0'
    volumes:
      - .:/project
    ports:
      - "3000:3000"
    depends_on:
      - db
```

All right, another set of descriptions for instructions within the `docker-compose.yml` file:

1. The version tells Docker about the possible tokens used inside this YAML file. Be cautious using flags from other versions, they may not work in version `3.2`.
2. A standalone database container launched from official Postgres image.
3. Another service named `app` which is built based on the `Dockerfile` in the same folder.
4. The final command that needs to be run when launching the container.
5. A volume that maps local folder to the corresponding folder inside the container.
6. Instruction to open port `3000` and map it to port `3000` on the host.
7. An instruction to launch `db` service first as a dependency before launching `app` service.

### All-New Rails Project

Start by building the containers. For that you need to add two empty files to the **project root folder**:

1. an empty `Gemfile`
2. an empty `Gemfile.lock`.

Add just two lines to the `Gemfile`. It should look like:

```Gemfile
source 'https://rubygems.org'
gem 'rails', '~>5.2'
```

You'll be using the all new Rails 5.2. `Gemfile.lock` is auto-populated during the build process and it locks gem dependencies to particular versions. You don't ever have to touch that `Gemfile.lock` again. **Once those files are in place**, run this on your terminal:

```bash
docker-compose up --build
```

You will see that `step 1/nn: FROM starefossen/ruby-node:2-8-stretch` is available **instantly** as a layer (that is if you have already tried the initial `docker run` with a single line of `Dockerfile`).

That's Docker reusing the Ruby image downloaded earlier. The whole process that ran last time is saved for you. So it is only from the second line of code within the `Dockerfile` that matters now.

You'll see all the steps within the `Dockerfile` executed dutifully during the build process. Each of them creates a **layer** that you can recognize by their hash, that looks like `1adb3ee3e245`. 

Once build steps are over, you'll see `db` service being started first. And then the `app` service starts, but **stops** when trying to run `bundle exec rails s`, as we do not have `rails` gem within the environment yet. 

But the log on the terminal shows `man` page for Rails and shows you how to get started. Press `ctrl+c` to bring down the container if it is still running. You should be back at the terminal prompt. In there, run this command to create a new Rails project.

```bash
docker-compose run --user $(id -u):$(id -g) app rails new . --force --database=postgresql --skip-bundle
```

That should scaffold a new rails application in all its initial glory. As you can see, `postgresql` is the database of choice. Also, instructs the command to skip running `bundle install` after creating the project. 

Since the command creates all-new `Gemfile` with necessary gem dependencies detailed, you need to build the image again. So, there is no point in running automatic `bundle install` on the temporary container while scaffolding the application, as the gems downloaded will not be persisted. 

Usually, this is where you'll add or delete gems based on your project. If you wouldn't be using `coffee-script`, you can comment that line by prefixing a `#` in front of it. But leave them as they are now, for following this article.

You need to point the Rails app to the database container created by docker. This configuration will do that for you.

```yml
# config/database.yml

# ...
default: &default
  adapter: postgresql
  encoding: unicode
  host: db
  user: postgres
  port: 5432
  password:
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
# ... leave all else intact
```

Since the new rails project has updated `Gemfile`, you need to stop the running services and build the image again. The following commands should get you back up online: 

```bash
docker-compose down
docker-compose up --build
```

> **Note:** `docker-compose down` is usually executed from a new terminal but within the same project folder. This is because `docker-compose up` boots up the containers and shows the logs. It wouldn't quit until you press `Ctrl+C` or you run `docker-compose down` on a new terminal. In the course of this article, remember to use the terminal running `docker-compose up` for monitoring logs. All other commands can go into a new terminal. If you have a tabbed terminal, that would be very useful.

You'd have noticed that Docker reuses most of the layers created. It does not install updates or nano editor or build tools. Because there is no change in those layers. Very smart!

Docker build picks up from where changes happened. The only change is on `Gemfile`, hence, the line `COPY` within the `Dockerfile` kicks in and build starts from there on top of existing layers.

**Explore:** Docker starts to download and install all gems once again. There are ways to cache gems locally so that they do not need to be downloaded again. Some of the online solutions are a bit old and broken. You'll have to let me know when you find a solution. 

But the good news is, **Yay! You are on rails!**. Open your favorite browser and point it at [http://localhost:3000](http://localhost:3000) and you should see the whole world rejoicing at the sight of `Rails 5.2.0` and `Ruby 2.5`.

No? did you get `ActiveRecord: NoDatabaseError`? Well, that might happen. Create a database via this command on a new terminal (you should be within the root of the project directory and the container should already be running):

```
docker-compose exec app rails db:create
```

That should create a new database for development and also for test environments. Now open http://localhost:3000 again. You are ready to start celebrations!

![Docker and Ruby on Rails](https://cdn.auth0.com/blog/docker-ruby/you-are-own-rails.png)

**Remember to re-build the image again if you make changes to the `Gemfile`**. But if you have not changed the `Gemfile`, you don't have to build it, instead, just boot it up.

![Docker starting Rails server](https://cdn.auth0.com/blog/docker-ruby/starting_docker_container_local_server.gif)

### Own The Files

Based on the Docker settings and user groups, files generated may be owned by `root` user. In such cases, you may get **Permission denied** errors while trying to edit project files created by Rails. 

One way to find out is to run `ls -la` within the terminal to look at who owns the files. Another way is to try and edit one of the generated files. 

If they are owned by a user other than yourself, you will have to go down the `sudo` route to get them `chown`ed. Run this command on your terminal within the application folder:

```bash
sudo chown -R weeuser:weeuser .
``` 

Remember to use your user id instead of `weeuser` in the command above.

## Git It Up

A working configuration of a brand new Rails project is usually very easy. As you saw, it just took a simple `rails new` command within the container. But it has done so much work for you, so much that it warrants a Git commit.

```bash
git add --all
git commit -am "first working copy"
```

That adds all the files to the staging area and commits the changes with a readable comment.

If you look closely, you did not initiate a repository with `git init` as you'd normally do. Rails automatically initiated the repository. It has also generated a `.gitignore` file for you with pre-populated instructions as to which folders to ignore. This file ensures unnecessary folders and files, such as log files, are kept out of the repository.

Now create a new repository within [GitHub]. You might run into one of the [two hard things in Computer Science](https://martinfowler.com/bliki/TwoHardThings.html), so just give this name, `dockerized-rails-app`, it'll save you some time. **Create an empty** one, no need to create any `README.md` or `.gitignore` files on the GitHub server. They are already there on your local machine.

GitHub shows instructions to add an existing repository when you create a new one. Run these on your terminal to push your changes to GitHub. 

```bash
git remote add origin git@github.com:user_name/repo_name.git
git push -u origin master
```

Just ensure you use your own GitHub username and repository name in the command above. It is easier to copy the URL shown on GitHub.

Once `push` is complete, refresh GitHub repository page to see the files committed. Now that they are in the cloud, we can say it is much safer to play around with the local copy.

**From here onwards, we'll work on a branch named `staging` and move changes to `master` branch only when necessary.**

For that, follow these commands:

```bash
git checkout -b staging
git push -u origin staging
```

That creates a new branch and checks it out, then it pushes the branch to `origin` (which is another name for the Git repository on the GitHub side).

## Hot Reloading

### Precious Gems

[Guard](https://github.com/guard/guard) gem helps to watch for file changes and run appropriate commands based on which file has changed. There are plugins that allow you to take different actions for different files. For example, [guard-minitest](https://github.com/guard/guard-minitest) allows you to run tests when test files or app files change. Another example is [guard-livereload](https://github.com/guard/guard-livereload), which refreshes the page automatically when `.css`, `.js` or `.erb` files change. Foreman gem will be used to run multiple commands. [Rack-livereload](https://github.com/johnbintz/rack-livereload) is an option to enable livereload from middleware.

Ensure the `Gemfile` reflects guard gems necessary for watching file changes. This will help live-reloading and automated testing.

```Gemfile
# ... leave the rest untouched ...

group :test , :development do
  gem 'guard', '~>2.14.2',require:false
  gem 'guard-livereload','~>2.5.2', require: false
  gem 'guard-minitest', '~>2.4.6', require: false
  gem 'rack-livereload'
  gem 'foreman'
end 
```

Ensure you **do not remove** any existing gems in the process, just add this group right at the end of the `Gemfile`. Remember the usual drill to build the image to include these new gems. 

```bash
docker-compose up --build
```

### Initiate a Guardfile 

You need to set up `guard` to watch for file changes. Run the following command to get started. Docker build step in the previous section would have got a container running. You need to get into that container and access a command prompt (just like your terminal).

If you need to run any command inside a container that is already running, you can use `docker-compose exec` *on a new terminal*, but you should be in the same project folder. Here is how:

```bash
docker-compose exec --user $(id -u):$(id -g) app /bin/bash
```

That'd open a prompt within the container for you. Within the prompt, you can proceed to run further commands. The flag `--user $(id -u):$(id -g)` tells Docker to run the prompt as a normal user instead of root.

Start with initiating livereload plugin for Guard.

```bash
guard init livereload
```

That should create a `Guardfile` with instructions to watch for a list of extensions. Have a read through and you'll understand that the instructions target files that affect the rendered page such as `css`, `js`, or `erb`. 

> **Recap**: If plain Docker commands are run with root privileges, you can use `--user $(id -u):$(id -g)` flag to run commands as a normal user. If you already have files created with root access, you'll have to `chown` the files. 

Now that the `Guardfile` is ready, you can boot it up with this command. You can run this command on the same terminal on which you initiated `Guardfile`.

```bash
bundle exec guard -i
```

That should show `guard is now watching at /project`. It should also show that it is **waiting for the browser to connect**. You'll get there in a minute. 

Exit out of that prompt for now. You can use `Ctrl+C` to come out of `guard` and type `exit` to quit out of the terminal.

### Multiple Commands Using Foreman

Now that you have Guard, you are presented with a problem. The container needs to run `rails server` and also `guard` watcher.

But Docker allows only one command per service. Here comes `foreman` gem you've installed earlier, along with `guard`.

Foreman takes a `Procfile` with multiple commands and runs them all. With that capability, you can ask Docker to run just Foreman and it will take care of rest of the commands.

First stop is to set up a `Procfile.dev`. It looks like this:

```Procfile
web: bundle exec rails s -b '0.0.0.0'
guard: bundle exec guard -i
```

Next stop is to change the Docker service to start Foreman instead of the Rails server. The `docker-compose.yml` should look like this:

```yml
version: '3.2'
volumes: 
  postgres-data:
services:
  db:
    image: postgres
    volumes: 
      - postgres-data:/var/lib/postgresql/data
  app:
    build:
      context: .
      dockerfile: Dockerfile
    command: foreman start -f Procfile.dev -p 3000
    volumes:
      - .:/project
      - type: tmpfs
        target: /project/tmp/pids/
    ports:
      - "3000:3000"
      - "35729:35729"
    depends_on:
      - db
```

You'll notice three changes. One, the command has changed for `app` service. Now it is initiating Foreman.

You may also notice an additional port. Livereload server uses port `35729`. You just exposed it outside of the container. This will ensure the browser can talk to the livereload server. 

**Troubleshooting:** The third change, an additional volume `/project/tmp/pids/` is actually a workaround temporary files that may block Rails server.

Sometimes the container serving Rails app through `rails s` may not close and clean up properly if the container was not shut down properly. This is [an issue](https://github.com/docker/compose/issues/1393) faced by many. In such cases, you might see an error that looks like this:

```bash
app_1    | A server is already running. Check /project/tmp/pids/server.pid.
app_1    | => Booting Puma
#...
app_1    | Exiting
auth0railsapp_app_1 exited with code 1
```

Therein lies the clue. Rails server stores process id within the `tmp/pids/server.pid` file. You may need to **manually delete** that file and restart the services if you run into that error. 

But you don't want to delete the file manually, do you? The issue referenced earlier has several ideas to fix this. One among them is to introduce a temporary folder in the container instead of using the `tmp` folder from host OS. Adding a temporary volume to `docker-compose.yml` file will do this. Small, but useful change.

The second volume masks the `tmp` folder in the host OS so that all other `project` folders are available for the container except the `tmp`. When you run `docker-compose down`, this `tmp` folder within the container is wiped out.

Now that you know what those three changes are about, bring the service down using `Ctrl + C` first, then `docker-compose down` next and finally, reboot it through `docker-compose up`. 

One last piece of work. To empower browser to receive and apply changes when files are altered. You can do it in two ways:

1. Install LiveReload Browser Plugin
2. Insert Rack Middleware (Recommended)

The browser plugin option is browser dependent. But works without `rack-livereload` related middleware changes to development region. But middleware change will help you get live-reloading in any browser. Choose whichever option works for you.

### Livereload Browser Plugin

On to browser now. Install livereload extension on the browser from [here](http://livereload.com/extensions/#installing-sections). It has extensions for all major browsers.

Once you install the extension, you should be able to get the extension as an icon on the toolbar to make it accessible. When you click on the extension button, the container running services from `docker-compose.yml` should show `INFO - Browser connected.`. That means, **all pieces of the puzzle are now in place**.

![guard-connected-with-browser](https://cdn.auth0.com/blog/docker-ruby/guard-browser-plugin-connection.png)

Time to test it out. Also, time to get your own page on the screen.

### Enable Middleware LiveReload

If you are one of those front-end developers who install just about every possible browser, then the browser plugin option may not help. Your favorite browser may not even have a plugin.

In such cases, it is possible to ask the Rack middleware to inject the livereload script into the HTML being served from rails server.

You have already installed the necessary gem named `rack-livereload` in the previous section. You just have to add this configuration, right at the top of the file.

```rb
# in config/environments/development.rb file
Rails.application.configure do
  config.middleware.insert_after(ActionDispatch::Static, Rack::LiveReload)
#... leave all other configurations intact 
end
```

Since this is a change at middleware level, you need to stop the Docker services using `Ctrl+C` and start them again.

```bash
docker-compose down
docker-compose up
```

### First Rails Controller

Back on the terminal, run the following command to create a Controller along with an action named 'show'.

```bash
docker-compose exec --user $(id -u):$(id -g) app rails g controller Home show
```

> **Recap:** if you are getting *Permission denied* error at this stage. You can run the above command without `--user $(id -u):$(id -g)` and `chown` those files later as shown earlier in the article.

You can run as many such commands on your host terminal while leaving `docker-compose up` to serve rails app on a separate terminal. You only have to **restart** if you make major changes to the app such as adding database migrations or new gems.

Have a good look at that default Ruby on Rails page. Because **Yay! You are on Rails** is going bye bye and you'll replace it with most useful and comfy home page the internet has ever seen.

You can see Rails has added `get 'home/show'` by default within `config/routes.rb` file. Replace it with this now.

```
root 'home#show'
```

Now if you visit [http://localhost:3000](http://localhost:3000) on your browser, or reload it once, it should show the default HTML page created when you generated the controller.

Ensure that your container is up and running with all services. Especially the Guard one. Also, ensure browser is connected to the livereload server.

Final test if Guard is really worth all the effort. Open `app/views/home/show.html.erb`, edit it to add your heart's content and save it.

**Voilà!** By the time you go back to the browser, it should already have the new content. Now's the time you lose yourself in changing styles and watching them appear on the screen as you hit `save`!

![LiveReloading the browser](https://cdn.auth0.com/blog/docker-ruby/livereload.gif)

## Guard To Automate Tests

Guard gem can also help you run tests when you change your application files. In fact, it is smart enough to run only those tests that need to be executed based on the files you change. 

You have already included necessary `guard-minitest` gem to automate running tests on file changes, in **Precious Gems** section. You have also included the database necessary to run the tests within the `config/database.yml` file. When you ran `rails db:create` earlier, you would have noticed that a test database was also created. So, it just comes down to telling Guard to run tests when watched files change.

### Initiate Guard Minitest 

Just like what you've done to get livereload working, Guard needs to be initiated to watch for file changes to run tests when necessary.

```bash
docker-compose exec app guard init minitest
```

That should add additional instructions to `Guardfile`. Open the `Guardfile` in your editor and do these changes under `guard :minitest do` group:

1. **Comment** the default instructions 
2. **Un-comment** instructions generated for `Rails 4`.
3. **Change** the block to read like `guard :minitest, spring: "bin/rails test" do`. 

Using spring is optional, spring is a preloader that starts tests faster. So the tests should run without point 3 as well. Despite being on Rails 5, those commands should work just ok. 

You should be able to see **guard running all tests** when it starts. If it doesn't, stop the services using `docker-compose down` and reboot them via `docker-compose up`.

You should be able to see a failed test if you followed on to the instructions above.

```bash
guard_1  | 1 runs, 0 assertions, 0 failures, 1 errors, 0 skips

```

Remember changing the `config/routes.rb` file to point root at `home#show` action? That's what causing the issue now. Update the file `test/controllers/home_controller_test.rb` to reflect the changes made to the `config/routes.rb` file earlier. 

The test would have the auto-generated line `get home_show_url`, just change it to `get root_url`. 

```rb
  # test/controllers/home_controller_test.rb
  #...
  test "should get show" do
    get root_url
    assert_response :success
  end
  #...
```

Save the file and you should be able to see your tests being run by Guard. And this time, it should pass.

```bash
guard_1  | 1 runs, 1 assertions, 0 failures, 0 errors, 0 skips
```

![Unit tests automatically run by guard on file change](https://cdn.auth0.com/blog/docker-ruby/automatic-test-runs.gif)

Now that you are guarded against your own inadvertent changes, you can confidently change the application as long as you have tests to cover your changes.

**Remember to commit and push** changes.

```
git add --all
git commit -m "add livereload and automated test"
git push
```

Your code is now safe in the hands of [GitHub], you should be able to see `staging` branch was used by default. You need to leave `master` branch intact. In part 2, you will use `master` branch for production copy, where you'll raise pull requests from `staging` to `master`.

## Useful Commands

Docker grows on you pretty quickly, doesn't it? You may have had loving thoughts about running all future projects in Docker or run none at all. While that is all good, Docker also grows on your disk space.


I refer to [this](https://lebkowski.name/docker-volumes/) post for some clean up work. Be careful when you use the commands. It is better to go step by step.

Command | Description
------- | -----------
`docker system df` | List disk usage by docker
`docker ps -a` | List all containers
`docker images` | List of Docker images 
`docker rmi image_name` | Remove image by repository name
`docker rmi -f abcdef` | Remove image by ID
`docker rm name` | Remove Docker container by name
`docker rm abcdef` | Remove container by ID

But one last handy tip that will save a lot of keystrokes for you. Add an alias to `docker-compose` in your bash profile. You can do that by adding this line `alias dc='docker-compose'` as the last line in the file `~/.bashrc`. That allows you to run commands like this:

```bash
dc run --rm app /bin/bash
```

Another important difference to keep in mind, `docker-compose run` springs up a whole new container based on the `docker-compose.yml` and runs the command. But `docker-compose exec` runs the command inside the currently running container. Unless necessary, stick to `docker-compose exec` and run commands on already running containers.

## Conclusion

That brings us to the end of Part 1, where you have a **dockerized workflow that gives you both live-reloading and automated testing**. 

In part 2, you'll build core application functionality on top of this workflow with identity management. You'll also extend your workflow to enable **Continuous Testing** using [GitHub] and [Travis]. You'll also set up **Continuous Deployment** route to [Heroku]. You'll end it with an application running in production.


[GitHub]: https://github.com/
[Travis]: https://travis-ci.org/
[Heroku]: https://dashboard.heroku.com
[Auth0]: https://auth0.com/ 
