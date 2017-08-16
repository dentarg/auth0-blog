---
layout: post
title: "Alternatives to Native Mobile App Development"
description: "A look at five frameworks for building cross-platform mobile applications and how they stack up against each other."
date: 2017-01-10 08:30
category: Mobile, Frameworks
author:
  name: "Ado Kukic"
  url: "https://twitter.com/kukicado"
  mail: "ado@auth0.com"
  avatar: "https://s.gravatar.com/avatar/99c4080f412ccf46b9b564db7f482907?s=200"
design:
  image: https://cdn.auth0.com/blog/alternatives-to-native-mobile-development/logo.png
  bg_color: "#003472"
tags:
- frameworks
- cross-platform
- xamarin
- ionic
- phonegap
- progressive-web-apps
- react-native
related:
- introduction-to-progressive-apps-part-one
- ionic-2-authentication-how-to-secure-your-mobile-app-with-jwt
- xamarin-authentication-and-cross-platform-app-development
---

---

**TL;DR** Mobile apps are here to stay. For a long time, mobile app development required extensive Objective-C or Java knowledge. Hybrid frameworks and transpilers existed, but paled in comparison to what could be accomplished building apps natively. In recent years, these frameworks have started catching up on features, functionality and performance. Today, we'll take a look at five promising frameworks for building cross-platform mobile applications.

---

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

Mobile applications present various user and identity challenges. Luckily, [Auth0](https://auth0.com) has your back. Our [identity solution is platform agnostic](https://auth0.com/user-management) and we have plenty of resources to get you up and running as quickly as possible. <a href="javascript:signup()">Sign up</a> for a free Auth0 account, and then follow any of these guides to get user authentication for your app in no time at all:

* **Ionic** - [Quickstart (Ionic)](https://auth0.com/docs/quickstart/native/ionic), [Quickstart (Ionic 2)](https://auth0.com/docs/quickstart/native/ionic2), [Tutorial](https://auth0.com/blog/ionic-2-authentication-how-to-secure-your-mobile-app-with-jwt/)
* **PhoneGap** - [Quickstart](https://auth0.com/docs/quickstart/native/phonegap)
* **Xamarin** - [Quickstart](https://auth0.com/docs/quickstart/native/xamarin), [Tutorial](https://auth0.com/blog/xamarin-authentication-and-cross-platform-app-development/)
* **React Native** - [Quickstart (iOS)](https://auth0.com/docs/quickstart/native/react-native-ios), [Quickstart (Android)](https://auth0.com/docs/quickstart/native/react-native-android)
* **Progressive Web Apps** - [Tutorial](https://auth0.com/blog/introduction-to-progressive-apps-part-one/)

> [Auth0 offers a generous **free tier**](https://auth0.com/pricing) so we can get started with modern authentication.

## Conclusion

Mobile application development is more accessible than ever. Whether you are a full-stack developer, aspiring engineer, or have decades of experience in the Microsoft ecosystem, you can build great mobile applications that can run on billions of devices today. There may not be clear a winner, each platform has pros and cons, but the important thing is you have a plethora of options. As the old adage goes, "use the right tool for the job". Hopefully you've learned more about native app alternatives and can make an informed decision about developing mobile applications.
