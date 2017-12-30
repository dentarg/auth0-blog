---
layout: post
title: "B2C Company Leverages User Experience Through Single Sign-On"
description: "Learn how a B2C Company implemented Single Sign-On to provide seamless integration between different e-commerce portals."
longdescription: "Learn how a B2C Company implemented Single Sign-On to provide seamless integration between different e-commerce portals."
date: 2017-12-29 20:10
category: Technical Guide, Identity, Single Sign-On
author:
  name: "Bruno Krebs"
  url: "https://twitter.com/brunoskrebs"
  mail: "bruno.krebs@gmail.com"
  avatar: "https://twitter.com/brunoskrebs/profile_image?size=original"
design:
  image: https://cdn.auth0.com/blog/iam/logo.png
  bg_color: "#0D346C"
tags:
- b2c
- sso
- identity
- auth0
- user-experience
- ux
related:
- 2017-12-18-retail-analytics-past-present-and-future
---

**TL;DR:** In this article, we will learn how a B2C company easily implemented Single Sign-On to provide seamless integration between different e-commerce portals. The first thing we will do is to bootstrap two instances of an application to simulate these portals. Then, we will secure these instances with Auth0 and will add Single Sign-On to show that it take only a few minutes to achieve our goal. The final code can be found in this GitHub repository.

## Single Sign-On Advantages

## Simulating B2C Portals

To simulate the B2C portals and to focus on the Single Sign-On integration process, we are going to clone a GitHub repository that contains two applications: one simple RESTful API written in JavaScript that runs on Node.js; and one client side application written with React.

To clone the GitHub repository, we can issue the following command:

```bash
# clone the repository in the current directory
git clone https://github.com/auth0-blog/react-b2c-sso.git
```

### Running the Backend Instances

After cloning this repository, we are going to install its dependencies and then we are going to bootstrap the two backend instances to support our portals:

```bash
# install backend dependencies
npm i

# define port to run the first backend
export REACT_APP_REST_PORT=3001

# run the first backend instance
npm start &

# define port to run the second backend
export REACT_APP_REST_PORT=4001

# run the second backend instance
npm start &
```

Note that we are using an environment variable called `REACT_APP_REST_PORT` to define on what port our backend instances will run. Besides defining on what port the backend runs, this variable is also used to define what is the type of the backend. The backend instance running on port `3001` will return products used at home. The backend running on port `4001` will return products used by kids.

Let's check if both backend instances are running properly:

```bash
# retrieve products used at home
curl localhost:3001/products

# retrieve products used by kids
curl localhost:4001
```

## Securing the Portals with Auth0

## Conclusion
