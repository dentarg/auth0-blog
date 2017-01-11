---
layout: post
title: "How to create a custom create-react-app script"
description: "Create React App (CRA) is a very good tool for creating react apps from the CLI without build configuration. Learn how to create a custom script that works with create-react-app"
date: 2017-01-10 08:30
category: React, Frameworks
author:
  name: "Prosper Otemuyiwa"
  url: "https://twitter.com/unicodeveloper"
  mail: "prosper.otemuyiwa@auth0.com"
  avatar: "https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200"
design:
  image: https://cdn.auth0.com/blog/alternatives-to-native-mobile-development/logo.png
  bg_color: "#003472"
tags:
- create-react-app
- script
- react
- react-native
related:
- introduction-to-progressive-apps-part-one
- bootstrapping-a-react-project
- secure-your-react-and-redux-app-with-jwt-authentication
- adding-authentication-to-your-react-flux-app
---

---

**TL;DR** There are several tools available for developers to aid the building of various types of websites and applications. One of such is [**Create React App(CRA)**](https://github.com/facebookincubator/create-react-app), the CLI tool that helps JavaScript developers create **React** apps with no build configuration. As awesome as **CRA** is, developers still need a way of tweaking, adding special scripts and modules that doesn't come bundled with **CRA**. Today, I'll teach you how to create your own custom create-react-app scripts that you and your team harbor!
---

Many developers already use [create-react-app](https://github.com/facebookincubator/create-react-app) to build their React applications, but like I mentioned earlier, developers are still screaming for more configurations! Some are interested in having support for:

* PostCSS
* CSS Modules
* LESS
* SASS
* ES7
* MobX
* Server Rendering

..and a lot more out of the box!

A lot of developers, including JavaScript newbies create *React* apps from scratch daily, so the *CRA* team at facebook built the *create-react-app* tool to make the process of creating such apps less tedious and error-prone.

As a developer that needs support for some of the technologies I highighted earlier, one way of going about it is running `npm run eject`. This command copies all the config files and dependencies right into your project, then you can manually configure your app with all sorts of tools to satisfaction.

One major challenge developers might face with *eject* is not been able to enjoy the future features of *CRA* . Another challenge with *eject* would be ineffecient synchronised setup across React developers working in team. One great way of solving this later challenge is publishing a fork of `react-scripts` for your team, then all your developers can just run `create-react-app my-app --scripts-version mycompany-react-scripts` and have the same setup across board. Let's talk how to accomplish that!


## Create a Fork

Open up your GitHub repo and fork the [create-react-app repo](https://github.com/facebookincubator/create-react-app)

![Creating a fork of create-react-app](https://cdn.auth0.com/blog/cra/fork.png)
_Creating a fork of create-react-app_

Inside the `packages` directory, there is a folder called `react-scripts`. The `react-scripts` folder contains scripts for building, testing and starting your app. In fact, this is where we can tweak, configure and add new scripts and templates.


## Tweak the Configuration

Clone the directory and open up the `react-scripts/scripts/init.js` in your code editor. Let's add some few console messages and probably warning like so:


```js

......
......
console.log(chalk.red('VERY IMPORTANT:'));
console.log('Create a .env file at the root of your project with REACT_APP_EMPLOYEE_ID and REACT_APP_POSITION_ID');
console.log('  You can find these values in the company dashboard under application settings.');
console.log('  https://company.bamboohr.com/settings');
console.log();
.......
```

![Block to add important message](https://cdn.auth0.com/blog/cra/important-messages.png)
_Add the important message during installation here_

![Important Message added to Installation process](https://cdn.auth0.com/blog/cra/added_message.png)
_Added important message to show during installation_


**Now, Let's change templates**

Open up `react-scripts/template/src` directory. Open `App.js` and replace it with this:

```js

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  getEnvValues() {
    if (!process.env.REACT_APP_EMPLOYEE_ID || !process.env.REACT_APP_POSITION_ID) {
      throw new Error('Please define `REACT_APP_EMPLOYEE_ID` and `REACT_APP_POSITION_ID` in your .env file');
    }

    const employeeID = process.env.REACT_APP_EMPLOYEE_ID
    const position = process.env.REACT_APP_POSITION_ID;

    return { employeeID, position };
  }

  render() {
    
    const { employeeID, position } = this.getEnvValues();

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to Unicode Labs</h2>
        </div>
        <p className="App-intro">
           <b> Employee ID: { employeeID } </b><br/><br/>
           <b> Position: { position } </b>
        </p>
      </div>
    );
  }
}

export default App;

```

Now, go to `react-scripts/template/public` directory. Open the `index.html` file and change the value of the `<title>` tag to `Unicode Labs`.

You can also change the favicon to your company's favicon. You can change as many things as you want and add custom components that your team uses frequently.

Create a `.env.example` in the `react-scripts/template` directory contains the following:

```bash

REACT_APP_EMPLOYEE_ID='44566'
REACT_APP_POSITION_ID='ENGR'

``

A user will have to rename it to `.env` once the create-react-app finish installing the react-scripts. You should add this instruction to the `README` file.

**Note:** *CRA* already includes support for custom env variables if you're open to prefixing their names with **REACT_APP**.

That's all we need!

## Publish react-scripts to NPM

Before publishing to npm, we need to change the `name` key of the `package.json` file in `react-scripts` directory to `unicodelabs-react-scripts`.

Change the `description` key to `Unicodelabs Configuration and scripts for Create React App.`. Also, point the `repository` key to the right location. In my case, it is `unicodelabs/create-react-app`.

Now, `cd` to the `react-scripts` directory from your terminal like so:

![react-scripts directory](https://cdn.auth0.com/blog/cra/react-scripts-directory.png)
_Change into this directory on your terminal_

You need to login to npm like so:

![Npm Login](https://cdn.auth0.com/blog/cra/npmlogin.png)
_Log into Npm_

Go ahead and publish

![Publish](https://cdn.auth0.com/blog/cra/publish.png)
_Published unicodelabs-react-scripts to npm_

## Test 

Head over to your terminal and run `create-react-app test-app --scripts-version unicodelabs-react-scripts`. In your own case it would be `yourname-react-scripts`, where `yourname` is your company name or whatever name you choose to give it.

*CRA* would install it and then you will see a notice like so:

![Important Warning](https://cdn.auth0.com/blog/cra/important-warning.png)
_Important Warning_

Remember, when we put this message in the code earlier? Awesome!

Now, `cd` into the `test-app` directory, rename the `.env.example` to `.env` and run `npm start` command.

Your app will be up with the new template like so:

![New template showing up](https://cdn.auth0.com/blog/cra/result.png)

**Note**: If you have yarn installed, then create-react-app would install your app using Yarn.


## Aside: Using create-react-app with Auth0

Authentication is a very key part of various applications. Auth0 helps you to:

* Add authentication through more traditional username/password databases.
* Add support for linking different user accounts with the same user.
* Support for generating signed Json Web Tokens to call your APIs and flow the user identity securely.
* Analytics of how, when and where users are logging in.
* Pull data from other sources and add it to the user profile, through [JavaScript rules](https://docs.auth0.com/rules).
* Achieve [SSO(Single Sign On)](https://auth0.com/docs/sso) seamlessly.

**Auth0** has its own fork of `react-scripts` which means you can install an Auth0-powered React app with a single command like so:

```bash
create-react-app my-app --scripts-version auth0-react-scripts
```

Once it is done installing, go ahead and:
* Grab your *Client id* and *Auth0 domain* from the [Auth0 dashboard](https://manage.auth0.com). 
* Create a *.env* file in the root of the `my-app` project and add *client id* and *Auth0 domain* values to **REACT_APP_AUTH0_CLIENT_ID** and **REACT_APP_AUTH0_DOMAIN** respectively.
* Run the app.

![Welcome Screen](https://cdn.auth0.com/blog/cra/welcomepage.png)
_Welcome Screen_

![Login Screen](https://cdn.auth0.com/blog/cra/loginscreen.png)
_Login Screen_

![Logged In State](https://cdn.auth0.com/blog/cra/loggedin.png)
_Logged In_


Viola! You now have a fresh React app with full authentication powered by Auth0 ready for use. 

[Sign up](javascript:signup\(\)) for a free account today and enjoy fast, seamless, and hassle-free authentication in your apps.












In all sincerity, it's obvious that the *CRA* team at facebook can't cater for every single JavaScript developer's need, so one idea

Two mobile platforms dominate the landscape; Apple's iOS and Google's Android. Combined, these two platforms make up [99%](http://www.idc.com/promo/smartphone-market-share/) of all mobile devices. Between the two platforms, over 4.2 million mobile apps have been released in categories such as gaming, education, business, music, and more.

Android is based on Java while iOS runs on Objective-C and Swift: two fundamentally different frameworks for developers to target. For a long time, companies wishing to develop mobile apps had to have two teams, one dedicated to iOS development and the other to Android. Hybrid or cross-platform frameworks and transpilers have gained popularity as they allow developers to target multiple platforms with a single code base, reducing cost and development time.

Today we will take a look at alternatives to building native mobile applications. We will look at various frameworks and approaches to bringing your app to the small screen and the pros and cons of each. Without further ado, let's jump right in.

## Ionic

![Ionic](https://cdn.auth0.com/blog/alternatives-to-native-mobile-development/ionic-logo.png)

[Ionic](https://ionicframework.com/) is perhaps the most widely known cross-platform mobile framework. It allows developers to build iOS and Android applications with web technologies such as HTML, CSS, and JavaScript. Ionic is built on top of [Cordova](https://cordova.apache.org/) which enables access to various device features such as geolocation, push notifications, camera, and others. Ionic 1.x utilizes [Angular 1.x](https://angularjs.org/), while Ionic 2, the latest version of the framework, utilizes [Angular 2+](https://angular.io/).

In addition to the framework, Ionic boasts an entire ecosystem to get developers up and running as quickly as possible. [Ionic Cloud](https://ionic.io/cloud) gives developers various tools to manage, deploy, and scale their Ionic applications. [Ionic Creator](https://ionic.io/products/creator) is a visual editor that allows developers to rapidly prototype and build mobile applications via drag and drop. Finally, [Ionic View](http://view.ionic.io/) is a free iOS and Android app that allows developers to easily share their Ionic app with users, testers, and clients without having to deploy the application to any app store. Developers simply invite users via the Ionic View app, and once an invite has been accepted the user can download and run the developers app inside of Ionic View as if the app was installed on their phone.

{% include tweet_quote.html quote_text="Ionic enables the development of mobile apps built with web technologies like HTML, CSS, and JS." %}

### Pros 
* Build mobile apps with familiar web technologies such as HTML, CSS, and JavaScript.
* Ionic View allows you to share your Ionic app without requiring a user to download it.
* Target iOS and Android devices with a single code base.

### Cons 
* Ionic apps use [WebView](https://developer.android.com/reference/android/webkit/WebView.html), which means the app is for all intents and purposes a web application, so performance can be slow compared to native applications.
* Ionic requires deep knowledge of Angular to get the most out of the framework.
* Not suitable for complex mobile applications such as games or graphics intensive programs.

## PhoneGap / Cordova

![PhoneGap](https://cdn.auth0.com/blog/alternatives-to-native-mobile-development/phonegap-logo.png)

[PhoneGap](http://phonegap.com/) is very similar to Ionic in many respects. It too allows developers to build cross-platform mobile applications with web technologies and is built on top of Cordova. PhoneGap is not tied to any specific JavaScript framework, so developers have more choice in how they build their applications. PhoneGap boasts an ecosystem comprised of a desktop app, mobile app, and a cloud service called [PhoneGap Build](https://build.phonegap.com/) for building and deploying an application.

There is often confusion in the developer community regarding PhoneGap and Cordova. PhoneGap was originally founded by [Nitobi](https://www.crunchbase.com/organization/nitobi-software#/entity). In 2011, [Adobe](https://adobe.com) acquired Nitobi and the PhoneGap brand. Adobe then donated a version of PhoneGap, renamed Cordova, to the [Apache Foundation](https://www.apache.org/), but kept the PhoneGap brand and product. Cordova can be seen as the engine that powers PhoneGap, amongst other hybrid frameworks. PhoneGap adds additional features and functionality on top of Cordova.

{% include tweet_quote.html quote_text="Cordova allows you to build cross-platform mobile apps with web technologies of your choice." %}

### Pros 
* Build cross-platform mobile apps with web technologies of your choice.
* PhoneGap build allows you to compile your PhoneGap apps into iOS and Android apps without having to install any additional SDKs.
* Extensive third-party plugin library offering integrations such as mobile payments, testing frameworks, and more.

### Cons 
* PhoneGap, like Ionic, uses WebView which results in performance challenges.
* Lack of standard UI library.
* Not suitable for complex mobile applications such as games or graphics intensive programs.

## Xamarin

![Xamarin](https://cdn.auth0.com/blog/alternatives-to-native-mobile-development/xamarin-logo.png)

[Xamarin](https://www.xamarin.com/) comes from [Microsoft](https://microsoft.com) and takes a unique approach to cross-platform app development. Xamarin applications are written entirely in C#. Xamarin then compiles the C# code into native iOS and Android distributions. The underlying layer on which Xamarin is built on top of is [Mono](http://www.mono-project.com/) and this enables cross-platform development. The benefit of building applications with Xamarin compared to Cordova-based frameworks is that apps built with Xamarin make use each platform's native API's. This means that Xamarin apps compile down to native iOS and Android applications and behave as such.

Xamarin is not a code once, run everywhere solution. While you can achieve a high level of code shareability, you will more than likely need to write specific code for iOS and Android versions of your app. With Xamarin, you will not be able to use native open-source libraries that are available for iOS and Android, but you can make use of many .Net libraries. Finally, getting access to the latest native APIs can be slow since the Xamarin developers will have to implement them into the framework after they are released.

{% include tweet_quote.html quote_text="Xamarin allows you to build cross-platform iOS and Android applications in C-Sharp." %}

### Pros
* Developers already familiar with the Microsoft ecosystem will feel right at home with Xamarin and its use of C#.
* Xamarin apps have access to all of the native capabilities of both iOS and Android.
* Performance of Xamarin apps is comparable to that of natively written applications.

### Cons
* Although you can achieve code shareability, you will occasionally need to write platform specific code.
* You will need to understand iOS and Android APIs to be able to get the most of out the platform.
* The licensing model can be difficult to navigate with certain features locked behind Professional and Enterprise licenses.

## React Native

![React Native](https://cdn.auth0.com/blog/alternatives-to-native-mobile-development/react-native-logo.png)

[React Native](https://facebook.github.io/react-native/) comes to us from [Facebook](https://facebook.com) and presents a framework for building cross-platform mobile applications with [React](https://facebook.github.io/react/). React Native is comparable to Xamarin, wherein apps created with React Native are indistinguishable from native iOS and Android apps written in Objective-C or Java. 

React Native combines the easy to learn syntax of React but also enables developers to write Objective-C, Swift, or Java when needed for additional performance or tuning. This means that developers can use existing native libraries in their React Native apps. React Native also comes with many UI components such as buttons, sliders, and modals that allow developers to get up and running quickly.

{% include tweet_quote.html quote_text="React allows developers to build native iOS and Android apps with React and JavaScript." %}

### Pros 
* Since React Native apps run native APIs, the performance is comparable to true native apps.
* You can use native libraries and write Objective-C, Swift, or Java if needed to further optimize performance.
* The standard UI component library is extensive and provides many features out-of-the-box.

### Cons  
* Requires extensive knowledge of React.
* Depending on use case, you may end up writing a lot of native code and then plugging it into React Native, which means you'll need Objective-C or Java knowledge.
* While React and React Native are open source projects, Facebook has faced criticism of its BSD+Patents licensing model.

## Progressive Web Apps

![Progressive Web Apps](https://cdn.auth0.com/blog/alternatives-to-native-mobile-development/pwa-intro.png)

[Progressive Web Apps](https://developers.google.com/web/progressive-web-apps/) aim to make web applications behave like their native counterparts. This project comes to us from [Google](https://google.com) and presents a very interesting proposition. Progressive Web Apps aim to be reliable, fast, and engaging. This means that apps should load fast, present an engaging and fluid user experience, and support native features like push notifications or offline access. The PWA spec will add new features and functionality over time. Developers can then choose how many features they wish to implement, possibly making PWA the most flexible way to reach mobile users.

Progressive Web Apps are unique for two major reasons. While they can be "installed" on a user's homescreen, they are not delivered through the App Store or Google Play. Instead, when a user visits a PWA, they are presented with an option to add it to their homescreen. This is interesting because it gives the developer the power to deliver and update their applications without forcing the user to do anything. In addition, Progressive Web Apps can be scraped and indexed by search engines. This significantly increases discoverability and opens doors for deeper integrations in the future.

{% include tweet_quote.html quote_text="Progressive Web Apps allow developers to add mobile features to existing web applications." %}

### Pros
* No need for separate code base. Your web application is your mobile application.
* App will be indexed and discoverable through search engines.
* App does not need to go through the App Store or Google Play to be "installed" on a user's mobile device.

### Cons 
* Limited support for PWA on iOS.
* Lack of access to many native APIs.
* App won't be accessible through App Store or Google Play.

## Authentication with Hybrid App Frameworks

Mobile applications present various user and identity challenges. Luckily, [Auth0](https://auth0.com) has your back. Our identity solution is platform agnostic and we have plenty of resources to get you up and running as quickly as possible. <a href="javascript:signup()">Sign up</a> for a free Auth0 account, and then follow any of these guides to get user authentication for your app in no time at all:

* **Ionic** - [Quickstart (Ionic)](https://auth0.com/docs/quickstart/native/ionic), [Quickstart (Ionic 2)](https://auth0.com/docs/quickstart/native/ionic2), [Tutorial](https://auth0.com/blog/ionic-2-authentication-how-to-secure-your-mobile-app-with-jwt/)
* **PhoneGap** - [Quickstart](https://auth0.com/docs/quickstart/native/phonegap)
* **Xamarin** - [Quickstart](https://auth0.com/docs/quickstart/native/xamarin), [Tutorial](https://auth0.com/blog/xamarin-authentication-and-cross-platform-app-development/)
* **React Native** - [Quickstart (iOS)](https://auth0.com/docs/quickstart/native/react-native-ios), [Quickstart (Android)](https://auth0.com/docs/quickstart/native/react-native-android)
* **Progressive Web Apps** - [Tutorial](https://auth0.com/blog/introduction-to-progressive-apps-part-one/)

## Conclusion

Mobile application development is more accessible than ever. Whether you are a full-stack developer, aspiring engineer, or have decades of experience in the Microsoft ecosystem, you can build great mobile applications that can run on billions of devices today. There may not be clear a winner, each platform has pros and cons, but the important thing is you have a plethora of options. As the old adage goes, "use the right tool for the job". Hopefully you've learned more about native app alternatives and can make an informed decision about developing mobile applications.