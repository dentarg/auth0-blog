---
layout: post
title: "Adding Authentication to Shiny Server in 4 Simple Steps"
description: "Learn how to add authentication to your free Shiny Server setup and secure your interactive R apps!"
date: 2016-12-09 6:00
category: Hot Topics
author:
  name: Sebastián Peyrott
  url: https://twitter.com/speyrott?lang=en
  mail: speyrott@auth0.com
  avatar: https://en.gravatar.com/userimage/92476393/001c9ddc5ceb9829b6aaf24f5d28502a.png?size=200
design:
  bg_color: "#004071"
  image: https://cdn.auth0.com/blog/navy-leak/logo.png
  image_size: "100%"
  image_bg_color: "#004071"
  blog_series: false
tags:
- shiny
- shiny-server
- authentication
- auth0
- proxy
- shiny-proxy
related:
- 2016-12-06-machine-learning-for-everyone
- 2016-07-22-customer-data-is-king-four-ways-to-know-your-customers-better
---

[Shiny Server](https://www.rstudio.com/products/shiny/) is a great tool to create visualizations and interactive documents for your R applications. It is also very popular. Unfortunately, the free version of Shiny Server does not support any form of authentication whatsoever. This precludes many common use cases such as taking your apps online, or limiting access to certain users inside your network. In this article we will show you how to add authentication to the free version of Shiny Server using Auth0. Read on! 

{% include tweet_quote.html quote_text="We will show you how to add authentication to the free version of Shiny Server!" %}

-----

## Introduction
So you know [Shiny Server](https://www.rstudio.com/products/shiny/). If not, ask your closest data scientist and watch him or her drool. Data scientists love to turn their powerful R analyses into visual, interactive applications. And Shiny is just the right tool for that. Take a look at some of the [demos]() in the product page.

![Shiny sample]()

Nifty, huh? Well, there's a catch. Shiny Server is currently available in [two versions](https://www.rstudio.com/products/shiny/shiny-server/): an open-source, limited edition; and a full-blown "pro" edition.

Fortunately, for many use cases, the open-source edition is more than enough. But Shiny is a web application and two very important things for any web app are missing from the open-source edition: SSL/TLS support and authentication. In other words, using the open-source edition for public facing apps or internal apps that require at least some access control is a no-go.

A [while ago](https://auth0.com/blog/adding-authentication-to-shiny-open-source-edition/) we explored the alternative of using an Apache server as a reverse-proxy for Shiny with an authentication module ([auth_openidc](https://github.com/pingidentity/mod_auth_openidc)). While this worked (somewhat), there were two problems with this approach: websocket support was not available (it is used internally by Shiny for better user experience) and connections timed-out after a certain amount of time.

However, not everything is bad about this approach. We just need to power it up a bit. So our own data scientist, Pablo Seibelt, took it upon himself to come up with a working solution: [shiny-auth0](https://github.com/auth0/shiny-auth0). Shiny-auth0 is a simple reverse proxy with authentication tuned-up for Shiny Server. It runs on node.js and makes use of Auth0 (through passport.js) for authentication, and http-proxy for full-blown proxy support. It is designed to run behind a fast nginx reverse-proxy, which can be found in most production environments. In other words, shiny-auth0 makes it a breeze to get authentication working with Shiny server without getting your hands dirty. So, let's get to work!

## Step 1: Get Shiny Server up and running
If you already have a working Shiny server setup with your apps, you can probably skip this step. For the purposes of giving a full working solution, in this step we will show you how to get a sample R app running on Shiny server, and how to find out the details we need to know about it for the next steps (hint: its IP address and port).

Shiny runs on Linux servers. We will assume a fairly common CentOS 7 / Red Hat Enterprise Linux 7 setup. If you are using other distros, read the official [Shiny docs](https://www.rstudio.com/products/shiny/download-server/) to perform the installation. Login to the console as root and type the following commands.

> A word of caution: if you are not comfortable using Linux, ask a sysadmin to install Shiny server for you. He or she can use these steps, or follow the installation guide from the official [Shiny docs](https://www.rstudio.com/products/shiny/download-server/).

```sh
# Enable the EPEL repository (extra packages for enterprise Linux)
sudo yum install epel-release
# Install R
sudo yum install R
# Run R as root 
sudo R
```

The following commands must be input inside the R shell.

```r
install.packages("digest")
# Install the R Shiny package
install.packages("shiny", repos='https://cran.rstudio.com/')
# Quit the shell, answer 'n' when asked to save
quit()
```

Now back in the command shell, run:

```sh
# Download Shiny server
curl -O https://download3.rstudio.org/centos5.9/x86_64/shiny-server-1.5.1.834-rh5-x86_64.rpm
# Install it
sudo yum install --nogpgcheck shiny-server-1.5.1.834-rh5-x86_64.rpm
# Start it using systemd (will run automatically during boot)
sudo systemctl start shiny-server
```

Shiny Server should now be active and running! By default, Shiny runs on port 3838. To check it, open a browser window and point it to: [https://localhost:3838](https://localhost:3838) on the same computer where you installed it. If you don't have access to a browser in that computer, find its IP address:

```sh
ip addr
```

Then use a browser in a different computer and point it to [https://<ip-address>:3838](https://<ip-address>:3838).

> If the computer running Shiny has a firewall setup, you will need to consult with your system administrator for the proper steps to access Shiny server.

![Shiny Hello World]()

## Step 2: Get Nginx Up and Running
Nginx is a powerful and popular HTTP server. It supports a ton of features and is very fast. We will use Nginx to perform SSL/TLS termination. In other words, Nginx will act as the public facing server, with full TLS support (a must for secure connections), and then forward all requests to our internal shiny-auth0 proxy server, which runs without TLS in our internal network (which is considered safe).

## Step 3: Setting up and Auth0 Account for shiny-auth0
Since authentication will be handled by Auth0, a free Auth0 account is required to work with shiny-auth0. Don't panic, it's as simple as signing-up and setting a few knobs here and there. Take a look:

## Step 4: Setting up shiny-auth0 for Shiny Server Authentication
Finally we'll get to see everything working together. Once this step is done you'll have a fully secured Shiny Server.

## Optional: Setting up autostart

## Conclusion
Shiny server is a great tool to visualize data using R. In spite of its limitations, the open-source version is really powerful. TLS/SSL support and authentication are essential for user facing apps, sometimes even inside private networks. Using Auth0, shiny-auth0 and nginx makes adding authentication and TLS support to Shiny Server Open Source Edition a breeze, even for people not versed in the arcana of Unix commands or programming. Leave us your thoughts in the comments section below, cheers! 
