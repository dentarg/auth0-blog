---
layout: post
title: "The Complete Guide To Deploying JavaScript Applications - Part 2: Single Page Applications, Logging, SSL"
description: "Learn how to deploy JavaScript Single Page Applications on different platforms."
longdescription: "Deploying JavaScript Single Page Applications can be a hassle. Equip yourself with the knowledge required to move your applications from development to production on different platforms with this guide."
date: 2018-01-18 08:30
category: Technical guide, Frontend, JavaScript
design:
  bg_color: "#222228"
  image: https://cdn.auth0.com/blog/jsdeploy/logo.png
author:
  name: Prosper Otemuyiwa
  url: http://twitter.com/unicodeveloper?lang=en
  mail: prosper.otemuyiwa@auth0.com
  avatar: https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200
tags:
- javascript
- netlify
- heroku
- deployment
- monitoring
- logging
related:
- 2017-12-20-developing-npm-packages
- 2018-01-09-the-complete-guide-to-deploying-javascript-applications-part-1
- 2017-05-08-the-ultimate-guide-to-deploying-php-applications
---


**TL;DR:** Atwood's law states that _Any application that can be written in JavaScript, will eventually be written in JavaScript._  In 2018, eleven years after this law was proposed, JavaScript is now the [most popular language](https://insights.stackoverflow.com/survey/2017#technology-programming-languages) in the world. In the [first part](https://auth0.com/blog/the-complete-guide-to-deploying-javascript-applications-part-1) of this tutorial, we covered database and backend deployments. In the second and final part of this tutorial, I'll show you how to tie everything together by learning to deploy JavaScript Single Page Applications and static websites to different cloud platforms. This article is not about performance.

---

## Application Recap

The Single Page Application we will deploy in this tutorial can be found on [GitHub](https://github.com/auth0-blog/jsfrontend). The backend exists [here](https://github.com/auth0-blog/jsbackend).

Clone the [frontend repository](https://github.com/auth0-blog/jsfrontend) to your local machine. Run `npm install` and run it with the following command:

```bash
npm run dev
```

![JavaScript Meetups app](https://cdn.auth0.com/blog/jsdeploy/spasampleapp.png)
_Live App stuck_

The app should show a list of public meetups. When a user is logged-in, a list of private meetups should be shown. Unfortunately, neither of them shows on the screen. Why? We are not connected to a live backend. 

Open up `utils/meetup-api.js`. The `BASE_URL` constant is connected to a local server instance. Let's change the value to a backend URL. In the previous tutorial, we deployed our backend to several cloud platforms. All we need to do right now is choose one. 

Let's go with the Heroku backend URL which is, `https://meetupservice.herokuapp.com`. Replace the value of the `BASE_URL` constant with `https://meetupservice.herokuapp.com`.

Now, run the app again.

![JavaScript Public Meetups page](https://cdn.auth0.com/blog/jsdeploy/spapublicpage.png)
_Live App Working_

> **Note:** At this point, the private meetups page are not working because we haven't configured the right variables.

At this point, we are running the Single Page Application on our local machine. Let's make the app publicly accessible by deploying to the cloud.

## Netlify

Netlify is a powerful platform that allows you to easily push frontend code and have it deployed to the cloud within few minutes. And you can get started for free. It generates a secure publicly accessible URL after deployment.

It provides features such as:

- Instant Rollbacks
- Instant Cache Invalidation
- Atomic deploys
- Prerendering for Single Page Applications

and much more.

Every time a change is made and pushed to the GitHub repo, a fresh deploy happens automatically!

Let's go ahead and deploy our app.

- Create an account on [Netlify](https://netlify.com) if you don't have one.
- Create a new site from Git

  ![Create site from Git](https://cdn.auth0.com/blog/jsdeploy/ncreatesitefromgit.png)
  _Create site from Git_

- Connect to GitHub
  ![Choose GitHub](https://cdn.auth0.com/blog/jsdeploy/nchoosegithub.png)
  _Choose GitHub_

  ![Select Repo](https://cdn.auth0.com/blog/jsdeploy/nselectrepo.png)
  _Select Repo_

- Choose the branch, set the build command and the publish directory. In our case, the build command is `npm run build`, the publish directory is `dist`.
  ![Enter build commands](https://cdn.auth0.com/blog/jsdeploy/netliftyputbuildcommands.png)
  _Enter build commands_

- Deploy site.

  ![Site deploy in progress](https://cdn.auth0.com/blog/jsdeploy/sitedeployinprogress.png)

- Check out your deployed site. [Live Site](https://agitated-davinci-4df0c1.netlify.com/)

  ![Deployed Site](https://cdn.auth0.com/blog/jsdeploy/ndeployedsite.png)

Let's ensure everything works well. We are using Auth0 for authentication.

> [Auth0 offers a generous **free tier**](https://auth0.com/pricing) to get started with modern authentication.

Ensure Auth0 is configured properly.

- You need to have an account with [Auth0](https://auth0.com/signup).
- Go to your [Auth0 Dashboard](https://manage.auth0.com/#/) and click the "create a new application" button.
- Name your new app and select "Single Page Web Applications".
- In the Settings for your new Auth0 application, add your URL, in my case `https://agitated-davinci-4df0c1.netlify.com/callback` to the Allowed Callback URLs.
- Replace the **clientID** in the SPA with the *client id* from your Auth0 dashboard.  
- Replace `redirectUri` in the SPA with the Allowed callback URL from your Auth0 dashboard.
- Ensure the **Allowed Web Origins**, **Allowed Origins(CORS)** in your Auth0 dashboard is set to your live URL. In my case, `https://agitated-davinci-4df0c1.netlify.com`.
- Your `audience` should be the audience you set when you created the API for the backend.

**Very Important Note:**  Since our app is a single page client-side app, without a proper server configuration, the users will get a 404 error if they access `https://agitated-davinci-4df0c1.netlify.com/callback` directly in their browser. So, we have to fix that on Netlify with the following steps:

- Create a `_redirects` file in the root of the app. Add the code below to the `_redirects` file:

    ```bash
    /*    /index.html   200
    ```
- Modify the `build` command in your package.json's `script` section to the following:

```js
"scripts": {
    ...
    "build": "node build/build.js && mv _redirects dist"
  },
```
- Now, commit the new changes to GitHub. Once you commit, a deploy process will commence on Netlify. And the `_redirects` file will be moved to the `dist` folder on Netlify server. Netlify serves the content of the `dist` folder as the app, so our SPA routing will work fine!

Test the app again in the browser. [https://agitated-davinci-4df0c1.netlify.com](https://agitated-davinci-4df0c1.netlify.com)

Netlify is really powerful. It provides a lot of features out of the box such as:

- Hooks for triggering a build
- Asset optimization
- Webhooks for deploy notifications
- Domain Management

## Surge

Surge is a static web publishing platform designed especially for frontend developers. It's simple to use. You can publish your application without leaving the command line. Surge's free version offers the following:

- Unlimited publishing
- Custom domain
- Basic SSL

Simply install **Surge** via your terminal like so:

```bash
npm install --global surge
```

Now, follow these steps to deploy your app:

- Modify the `build` command in your package.json's `script` section to the following:

```js
"scripts": {
    ...
    "build": "node build/build.js && cp dist/index.html dist/200.html"
  },
```

_Surge's_ way of handling SPA client-side routing is providing a duplicate of your `index.html` as a `200.html` file in the root of the folder that gets deployed. The `200` page helps you re-route all requests to your client-side application, improving the usefulness of your URLs.

- Run the `surge` command in the terminal. Fill in your email and password. Also, specify the `dist` directory and press enter:

  ![Deploying via Surge](https://cdn.auth0.com/blog/jsdeploy/surge.png)

- Check out the URL it generates and visit your app. In my case, it is [http://sable-robin.surge.sh](http://sable-robin.surge.sh/).

**Very Important Note:** At this point, you will need to add this URL to the **Allowed Web Origins**, **Allowed Origins(CORS)**, and `http://<your-url.sh>/callback` to your **Allowed Callback URLs** in your Auth0 dashboard. Furthermore, you'll need to update your `src/auth/Auth.js` file. Replace the value of **redirectUri** with `http://<your-url.sh>/callback`.

Now, re-run the `npm run build` command to make a new build. Also, run the `surge` command but with some parameters like so:

```bash
surge dist/ <your-surge-url>
```

Your app will be updated. Everything should work fine now!

![Surge Live App](https://cdn.auth0.com/blog/jsdeploy/surgeliveapp.png)

## Google Firebase

[Google Firebase](https://firebase.google.com) is a great platform to host your static websites, progressive web apps and single page applications. Firebase hosting provides fast and secure hosting for your web app. With a single command, you can easily deploy web apps and static content to a global content-delivery network (CDN).

Firebase hosting offers the following:

- Apps Served over a secure connection
- Free SSL certificates
- Fast content delivery
- One-click rollbacks
- Free

Install the Firebase CLI on your machine like so:

```bash
npm i -g firebase-tools
```

Go ahead and run the login command:

```bash
firebase login
```

Authenticate with your Google account and give **Firebase CLI** the permissions it requests by clicking the **Allow** button.

Initialize a Firebase project in the app directory:

```bash
firebase init
```

- Choose `Hosting` as the Firebase CLI feature provided in the interactive widget.
- Select `Create a new project`.
- Head over to [https://console.firebase.google.com](https://console.firebase.google.com) to create a new project. Run `firebase init` again in the terminal. Go through the steps and choose the newly created project.
- Modify the `firebase.json` file that is currently in your root directory to:

```js
{
  "hosting": {
    "public": "dist",
    "rewrites": [ {
      "source": "**",
      "destination": "/index.html"
    } ],
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ]
  }
}
```

`public` is mapped to the `dist` folder. This ensures that the content of the `dist` folder is uploaded. The `rewrites` rule is to enable client-side routing for our app. 

- Run `firebase deploy`. 
- The project should be live now. Mine is [https://meetups-61634.firebaseapp.com/](https://meetups-61634.firebaseapp.com/).

**Very Important Note:** At this point, you will need to add this URL to the **Allowed Web Origins**, **Allowed Origins(CORS)**, and `http://<your-url.firebaseapp.com>/callback` to your **Allowed Callback URLs** in your Auth0 dashboard. Furthermore, you'll need to update your `src/auth/Auth.js` file. Replace the value of **redirectUri** with `http://<your-url.firebaseapp.com>/callback`.

- Now, run `npm run build` to rebuild the project.
- Run `firebase deploy` again to re-upload the new content.

Your app will be updated. Everything should work fine now!

![Firebase Live App](https://cdn.auth0.com/blog/jsdeploy/firebaseliveapp.png)


## Aerobatic

Aerobatic is a platform for deploying static websites and single page applications. It's not so popular but it is very powerful and provides a blazingly fast performance.

It offers the following:

- Continuous Delivery
- Plugins for redirects, password protection, http proxy, custom errors, etc
- Apps served over a secure connection
- Free 30-day trial
- Support for Jekyll, Hugo, Hexo, Yeoman, React, Angular, etc

Unfortunately, as at the time of this writing, Aerobatic doesn't support HTML5 pushState. There are claims that it does support client-side routing but I haven't found a complete example to back up this claim.


## Amazon S3

Amazon Web Services as we already know is an incredible cloud platform for hosting your web applications. Amazon S3 is a web service offered by Amazon Web Services (AWS) that provides storage through web services interfaces. You can also host a static website and Single Page Application on S3.

Let's follow the steps below to deploy our Single Page Application:

- Login to [Amazon AWS](console.aws.amazon.com)
- Head over to [S3](https://s3.console.aws.amazon.com/s3)
- Create a bucket.

  ![Create an S3 bucket](https://cdn.auth0.com/blog/jsdeploy/awscreatebucket.png)

- Go to **Properties** of the newly created bucket and enable **Static Web Hosting**. Add `index.html` to the _Index_ and _Error_ document. **Note:** Write down your URL endpoint.

  ![Enable Static Web hosting](https://cdn.auth0.com/blog/jsdeploy/awsenablestatichosting.png)
  _Enable Static Web hosting_

  ![S3 endpoint](https://cdn.auth0.com/blog/jsdeploy/s3endpoint.png)
  _Write down the S3 endpoint URL_

- Go to **Permissions > Bucket Policy** of the newly created bucket and add the policy below:

```bash
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AddPerm",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::<bucket-name>/*"
        }
    ]
}
```

Replace `<bucket-name>` with the name of your bucket. Let's break down the code above:

  - *Principal:* This is the who. Using a `*`, we're saying everyone. Literally, everyone.
  - *Action:* This is what the principal can do. We're saying everyone can perform a "get."
  - *Resource:* This is the which. Against which resources (objects) can the principal perform this action?

![Enable Static Web Hosting](https://cdn.auth0.com/blog/jsdeploy/awsenablestatichosting.png)

- Remember the endpoint URL you wrote down? You'll need it now to configure authentication for our app. At this point, you will need to add this URL to the **Allowed Web Origins**, **Allowed Origins(CORS)**, and `http://<your-url>/callback` to your **Allowed Callback URLs** in your Auth0 dashboard. Furthermore, you'll need to update your `src/auth/Auth.js` file. Replace the value of **redirectUri** with `http://<your-url>/callback`.

- Now run `npm run build` in your terminal to build the project.
- Go ahead and upload the files in the `dist` directory to your S3 bucket.

  ![Upload to S3](https://cdn.auth0.com/blog/jsdeploy/s3upload.png)

- Wait about a minute. Now check out the app via your S3 endpoint URL. [http://meetupservice.s3-website-us-east-1.amazonaws.com](http://meetupservice.s3-website-us-east-1.amazonaws.com/).

  ![Live App](https://cdn.auth0.com/blog/jsdeploy/s3liveapp.png)
  _Live App working fine!_


Let's take a break here! There are more platforms out there that we won't be able to cover such as _Heroku_, _Microsoft Azure_, _Google Cloud_, etc

There are several factors you consider before deploying JavaScript applications. Where do files such as Images, PDF, and Videos get stored? How do I set up monitoring and logging? How about SSL provisioning for my custom server? What if I don't want to set up my backend? Yeah, Serverless backends come in handy!

Let's briefly cover some of these questions posed above.

## Serverless Backend

You might have heard about _Serverless_ several times. It's a buzz word that's everywhere now. Serverless computing simply allows us to write functions as a service. No need for setting up servers yourself. There are tools and services that handle all the server provisioning for you. Basically, you run code without thinking about servers. Serverless offers you:

- Auto Scaling.
- Rapid deployment.
- Pay only for the compute time you consume.

Services such as [Webtask](https://webtask.io), [AWS Lambda](https://aws.amazon.com/lambda/), [IBM Cloud Functions](https://www.ibm.com/cloud/functions), [Google Cloud Functions](https://cloud.google.com/functions), and [Azure Functions](https://azure.microsoft.com/en-us/services/functions/) allow you run a serverless backend.

- [Webtask](https://webtask.io): Get started with [Webtask](https://webtask.io/docs/101).
- [AWS Lambda](https://aws.amazon.com/lambda/): Get started with [Lambda](https://docs.aws.amazon.com/lambda/latest/dg/getting-started.html). 
- [IBM Cloud Functions](https://www.ibm.com/cloud/functions): Get started with [IBM Cloud Functions](https://console.bluemix.net/docs/openwhisk/index.html#getting-started-with-cloud-functions).
- [Google Cloud Functions](https://cloud.google.com/functions): Get started with [Quickstarts](https://cloud.google.com/functions/docs/quickstarts).
- [Azure Functions](https://azure.microsoft.com/en-us/services/functions/): Get started with [Azure Functions documentation](https://docs.microsoft.com/en-us/azure/azure-functions/).

There is a [Serverless Application Framework](https://serverless.com/) that helps you build serverless architectures easily. It's powered by Serverless computing services such as Lambda, Azure Functions and IBM.

With the open-source CLI, you can get started on your machine ASAP!

![Serverless Framework](https://cdn.auth0.com/blog/jsdeploy/serverlessframework.png)

## Files Deployment

It's recommended that you use a dedicated service for handling files such as images, PDFs, documents and videos. As a developer, always offload these media assets to dedicated storage services. Services such as [Cloudinary](https://cloudinary.com), [Filestack](https://www.filestack.com), [Uploadcare](https://uploadcare.com), [Imgix](https://www.imgix.com) and [Fastly](https://www.fastly.com).

This is a feature by feature graphical comparison of the various services mentioned above with the features they offer.

![File Deployment Services](https://cdn.auth0.com/blog/jsdeploy/imagecomparison.png)

### Integrations

**Cloudinary** offers SDKs for different languages and frameworks, including [Ruby on Rails](https://github.com/cloudinary/cloudinary_gem), [PHP](https://github.com/cloudinary/cloudinary_php), [Angular](https://github.com/cloudinary/cloudinary_angular), [React](https://github.com/cloudinary/cloudinary-react), [JQuery](https://github.com/cloudinary/pkg-cloudinary-jquery), [Android](https://github.com/cloudinary/cloudinary_android), [iOS](https://github.com/cloudinary/cloudinary_ios), [Python](https://github.com/cloudinary/pycloudinary) and [JavaScript](https://github.com/cloudinary/cloudinary_js). Cloudinary also offers its services as add-ons or integrations on PaaS platforms, such as Heroku, Azure, EngineYard and AppFog.

**Fastly** does not provide any SDK. It simply operates via a query string URL API call.

**Imgix** offers SDKs for [Ruby on Rails](https://github.com/imgix/imgix-rails), [Python](https://github.com/imgix/imgix-python), [React](https://github.com/imgix/react-imgix), [PHP](https://github.com/imgix/imgix-php), [Node.js](https://github.com/imgix/imgix-core-js), [Go](https://github.com/parkr/imgix-go), [C#](https://github.com/raynjamin/Imgix-CSharp) and [Java](https://github.com/imgix/imgix-java).

**Uploadcare** offers SDKs for [Ruby](https://github.com/uploadcare/uploadcare-ruby), [Ruby on Rails](https://github.com/uploadcare/uploadcare-rails), [Python](https://github.com/uploadcare/pyuploadcare), [PHP](https://github.com/uploadcare/uploadcare-php), [Java](https://github.com/uploadcare/uploadcare-java), [Angular](https://github.com/uploadcare/angular-uploadcare), [Android](https://github.com/uploadcare/uploadcare-android), [iOS](https://github.com/uploadcare/uploadcare-ios), and [Meteor](https://atmospherejs.com/uploadcare/uploadcare-widget).

## Production Monitoring & Logging

After deploying your app, the next step is to set up logs and monitoring for the application. Performance monitoring and logging allow you understand everything going on in your app. User interactions, application errors, and issues. 

All these statistics offer you a better understanding of your app and userbase, which ultimately provides you and your team with better focus areas.

Fantastic monitoring and logging services you can integrate with your app are:

- **[LogRocket](https://logrocket.com)**
- **[New Relic](https://newrelic.com)**
- **[Google Analytics](https://analytics.google.com/analytics/web/)**

## SSL

Every website should be secured to protect users' private information. An SSL Certificate is required to be installed on the server where the website is hosted. SSL certificates allow web servers to encrypt their traffic, and also offer a mechanism to validate server identities to their visitors. An SSL Certificate needs to be purchased from a trusted Certificate Authority such as [GoDaddy](https://uk.godaddy.com/web-security/ssl-certificate), [RapidSSL](https://www.rapidssl.com), [Verisign](http://www.verisign.com), [Digicert](http://www.digicert.com), etc.

[SSLs](https://www.ssls.com/) aggregates several SSL providers and provides discounts on SSL purchase. However, [Let's Encrypt](https://letsencrypt.org) is a Certificate Authority that offers free SSL certificates.

![Let's Encrypt](https://letsencrypt.org/images/howitworks_challenge.png)

![Authorization - How It Works](https://letsencrypt.org/images/howitworks_authorization.png)

Check out [how to get started with Let's Encrypt.](https://letsencrypt.org/getting-started/)

{% include asides/javascript-at-auth0.markdown %}

## Conclusion

There is no way we can cover all the different options available for deploying JavaScript applications. JavaScript is a language that has evolved over the years, from simple fancy scripts to running on servers.

Hopefully, this guide covers a lot of your needs for deploying your JavaScript applications to all the major cloud providers.

> Auth0 provides the simplest and easiest to use [user interface tools to help administrators manage user identities](https://auth0.com/user-management) including password resets, creating and provisioning, blocking and deleting users.

How have you been handling your deployments? Please, let me know in the comments section below!
