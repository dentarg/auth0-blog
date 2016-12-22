---
layout: post
title: "Introduction to Progressive Web Apps (Instant Loading) - Part 2"
description: Progressive Web Apps are the future. Learn how to make your mobile web app native-like by making it work offline and load instantly.
date: 2016-12-22 08:30
category: Technical Guide, Architecture, Progressive Web Apps
design:
  bg_color: "#222228"
  image: https://cdn.auth0.com/blog/pwa/instant_loading_Logo.png
author:
  name: Prosper Otemuyiwa
  url: http://twitter.com/unicodeveloper?lang=en
  mail: prosper.otemuyiwa@auth0.com
  avatar: https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200
tags:
- pwa
- service-workers
- offline
related:
- 2016-12-19-introduction-to-progressive-apps-part-one
- 2015-10-30-creating-offline-first-web-apps-with-service-workers
- 2016-04-18-progressive-profiling

---

---

**TL;DR:** Web development has evolved significantly over the years allowing developers to deploy a website or web application and serve millions of people around the globe within minutes. With just a browser, a user can put in a URL and access a web application. With, **Progressive Web Apps**, developers can deliver amazing app-like experiences to users using modern web technologies. In the [first part of this tutorial](https://auth0.com/blog/introduction-to-progressive-apps-part-one) we set up our progressive web app, cached the pages and made it work partially offline. This time, we'll make it load instantly and work offline fully.

---

## Recap and Introduction to Part 2

In [Introduction to Progressive Web Apps (Offline First)](https://auth0.com/blog/introduction-to-progressive-apps-part-one), we discussed how a typical progressive web application should look like and also introduced the service worker. So far, we've cached the application shell. The `index` and `latest` pages of our web app now load offline. They also load faster on repeated visits. Towards the end of the first part of this tutorial, we were able to load the `latest` page offline but couldn't get dynamic data to display when the user is offline.

This tutorial will cover:

* Caching the App data on the `latest` page to be displayed to the user when offline
* Using `localStorage` to store the App data
* Flushing out old App data and fetching updated data when the user is connected to the internet


## Offline Storage

When building progressive web apps, there are various storage mechanisms to consider like so:

* **[IndexedDB](https://developer.mozilla.org/en/docs/Web/API/IndexedDB_API):** This is a transactional JavaScript based database system for client-side storage of data. This database employs the use of indexes to enable high performance searches of the data stored in it. IndexedDB exposes an asynchronous API that supposedly avoids blocking the DOM, but some research has shown that in some cases it is blocking. I recommend that you use libraries when working with IndexedDB because manipulating it in vanilla JavaScript can be very verbose and complex. Examples of good libraries are [localForage](https://mozilla.github.io/localForage), [idb](https://www.npmjs.com/package/idb) and [idb-keyval](https://www.npmjs.com/package/idb-keyval).

  ![IndexedDB Browser Support](https://cdn.auth0.com/blog/browser/indexeddbsupport)

  _IndexedDB browser support_
* **[Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache):** This is best for storing url addressable resources. Works with Service worker really well.
* **[PouchDB](https://pouchdb.com):** Open Source JavaScript database inspired by [CouchDB](http://couchdb.apache.org). It enables applications to store data locally while offline, then synchronize it with CouchDB and compatible servers when the application is back online, keeping the user's data in sync no matter where they next login. PouchDB supports all modern browsers, using IndexedDB under the hood and falling back to WebSQL where IndexedDB isn't supported. Supported in *Firefox 29+ (Including Firefox OS and Firefox for Android), Chrome 30+, Safari 5+, Internet Explorer 10+, Opera 21+, Android 4.0+, iOS 7.1+* and *Windows Phone 8+*.
* **[Web Storage e.g localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API):** It is synchronous and can block the DOM. The usage is capped at 5MB in most browsers. It has a simple API for storing data and it uses key-value pairs. 
  
  ![Web Storage Browser Support](https://cdn.auth0.com/blog/browser/webstorage.png)

  _Web Storage browser support_

* **[WebSQL](https://www.w3.org/TR/webdatabase):** This is a relational database solution for browsers. It has been deprecated and the [specification](https://www.w3.org/TR/webdatabase) is no longer maintained. So, browsers may not support it in the future.

![Quota for Mobile Storage](https://cdn.auth0.com/blog/quota/mobile.png)

_Mobile Storage Quota_

[Addy Osmani](https://twitter.com/addyosmani) has a comprehensive resource on [Offline storage for progressive web apps](https://medium.com/dev-channel/offline-storage-for-progressive-web-apps-70d52695513c#.j7e7w3m7g). You should really check it out!

According to PouchDB maintainer, [Nolan Lawson](https://twitter.com/nolanlawson), do well to ask yourself these questions when you are using a database:

* Is this database in-memory or on-disk(PouchDB, IndexedDB)?
* What needs to be stored on disk? What data should survive the application being closed or crashing?
* What needs to be indexed in order to perform fast queries? Can I use an in-memory index instead of going to disk?
* How should I structure my in-memory data relative to my database data? What’s my strategy for mapping between the two?
* What are the query needs of my app? Does a summary view really need to fetch the full data, or can it just fetch the little bit it needs? Can I lazy-load anything?

You can check out [how to think about databases](https://nolanlawson.com/2016/02/08/how-to-think-about-databases) to give you a broader knowledge on the subject matter.


## Let's Implement Instant Loading

For our web app, we'll use `localStorage` . I recommend that you don't use `localStorage` for production apps because of the limitations I highlighted earlier in this tutorial. The app we are building is a very simple one, so `localStorage` will work fine.

Open up your `js/latest.js` file. We will update the `fetchCommits` function to store the data it fetches from the Github API in `localStorage` like so:

```js


 function fetchCommits() {
    var url = 'https://api.github.com/repos/unicodeveloper/resources-i-like/commits';

    fetch(url)
    .then(function(fetchResponse){ 
      return fetchResponse.json();
    })
    .then(function(response) {
        console.log("Response from Github", response);

        var commitData = {};

        for (var i = 0; i < posData.length; i++) {
          commitData[posData[i]] = {
            message: response[i].commit.message,
            author: response[i].commit.author.name,
            time: response[i].commit.author.date,
            link: response[i].html_url
          };
        }

        localStorage.setItem('commitData', JSON.stringify(commitData));

        for (var i = 0; i < commitContainer.length; i++) {

          container.querySelector("" + commitContainer[i]).innerHTML = 
          "<h4> Message: " + response[i].commit.message + "</h4>" +
          "<h4> Author: " + response[i].commit.author.name + "</h4>" +
          "<h4> Time committed: " + (new Date(response[i].commit.author.date)).toUTCString() +  "</h4>" +
          "<h4>" + "<a href='" + response[i].html_url + "'>Click me to see more!</a>"  + "</h4>";

        }

        app.spinner.setAttribute('hidden', true); // hide spinner
    })
    .catch(function (error) {
      console.error(error);
    });
};

```

With this piece of code above, on first page load, the commit data will be stored in `localStorage`. Now let's write another function to retrieve the data from `localStorage` like so:

```js

  // Get the commits Data from the Web Storage
  function fetchCommitsFromLocalStorage(data) {
    var localData = JSON.parse(data);

    app.spinner.setAttribute('hidden', true); //hide spinner

    for (var i = 0; i < commitContainer.length; i++) {

      container.querySelector("" + commitContainer[i]).innerHTML = 
      "<h4> Message: " + localData[posData[i]].message + "</h4>" +
      "<h4> Author: " + localData[posData[i]].author + "</h4>" +
      "<h4> Time committed: " + (new Date(localData[posData[i]].time)).toUTCString() +  "</h4>" +
      "<h4>" + "<a href='" + localData[posData[i]].link + "'>Click me to see more!</a>"  + "</h4>";

    }
  };

```

This piece of code fetches data from `localStorage` and appends it to the DOM. 

Now, we need a conditional to know when to call the `fetchCommits` and `fetchCommitsFromLocalStorage` function. 

The updated `latest.js` file should look like so:

_latest.js_

```js

(function() {
  'use strict';

  var app = {
    spinner: document.querySelector('.loader')
  };

  var container = document.querySelector('.container');
  var commitContainer = ['.first', '.second', '.third', '.fourth', '.fifth'];
  var posData = ['first', 'second', 'third', 'fourth', 'fifth'];

  // Check that localStorage is both supported and available
  function storageAvailable(type) {
    try {
      var storage = window[type],
        x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    }
    catch(e) {
      return false;
    }
  }

  // Get Commit Data from Github API
  function fetchCommits() {
    var url = 'https://api.github.com/repos/unicodeveloper/resources-i-like/commits';

    fetch(url)
    .then(function(fetchResponse){ 
      return fetchResponse.json();
    })
    .then(function(response) {
        console.log("Response from Github", response);

        var commitData = {};

        for (var i = 0; i < posData.length; i++) {
          commitData[posData[i]] = {
            message: response[i].commit.message,
            author: response[i].commit.author.name,
            time: response[i].commit.author.date,
            link: response[i].html_url
          };
        }

        localStorage.setItem('commitData', JSON.stringify(commitData));

        for (var i = 0; i < commitContainer.length; i++) {

          container.querySelector("" + commitContainer[i]).innerHTML = 
          "<h4> Message: " + response[i].commit.message + "</h4>" +
          "<h4> Author: " + response[i].commit.author.name + "</h4>" +
          "<h4> Time committed: " + (new Date(response[i].commit.author.date)).toUTCString() +  "</h4>" +
          "<h4>" + "<a href='" + response[i].html_url + "'>Click me to see more!</a>"  + "</h4>";

        }

        app.spinner.setAttribute('hidden', true); // hide spinner
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  // Get the commits Data from the Web Storage
  function fetchCommitsFromLocalStorage(data) {
    var localData = JSON.parse(data);

    app.spinner.setAttribute('hidden', true); //hide spinner

    for (var i = 0; i < commitContainer.length; i++) {

      container.querySelector("" + commitContainer[i]).innerHTML = 
      "<h4> Message: " + localData[posData[i]].message + "</h4>" +
      "<h4> Author: " + localData[posData[i]].author + "</h4>" +
      "<h4> Time committed: " + (new Date(localData[posData[i]].time)).toUTCString() +  "</h4>" +
      "<h4>" + "<a href='" + localData[posData[i]].link + "'>Click me to see more!</a>"  + "</h4>";

    }
  };

  if (storageAvailable('localStorage')) {
    if (localStorage.getItem('commitData') === null) {
      /* The user is using the app for the first time, or the user has not
       * saved any commit data, so show the user some fake data.
       */
      fetchCommits();
      console.log("Fetch from API");
    } else {
      fetchCommitsFromLocalStorage(localStorage.getItem('commitData'));
      console.log("Fetch from Local Storage");
    }   
  }
  else {
    toast("We can't cache your app data yet..");
  }
})();

```

In the piece of code above, we are checking if the browser supports `localStorage` and if it does, we go ahead to check if the commit data has been cached. If it has not been cached, we fetch, display and cache the app's commit data.

Now, reload the browser again, make sure you do a hard, clear-cache, reload else we won't see the result of our code changes. 

Now, go offline and load the `latest` page. What happens?

Yaaay!! it loads the data without any problem.

![Load Dynamic Data Offline](https://cdn.auth0.com/blog/browser/pwacommits.png)

Check the **DevTools**, you'll see the data been stored in `localStorage`.

![Store Data Locally](https://cdn.auth0.com/blog/browser/data-stored-locally.png)
_Store Data Locally_

Just look at the speed at which it loads when the user is offline....OMG!!!

![Loads From Service Worker](https://cdn.auth0.com/blog/browser/load_from_service_worker.png)
_Loads from Service Worker when user is offline_


## Aside: Easy Authentication with Auth0

You can use [Auth0 Lock](https://auth0.com/docs/libraries/lock) for your progressive web app. With Lock, showing a login screen is as simple as including the **auth0-lock** library and then calling it in your app like so:

```js

// Initiating our Auth0Lock
var lock = new Auth0Lock(
  'YOUR_CLIENT_ID',
  'YOUR_AUTH0_DOMAIN'
);

// Listening for the authenticated event
lock.on("authenticated", function(authResult) {
  // Use the token in authResult to getProfile() and save it to localStorage
  lock.getProfile(authResult.idToken, function(error, profile) {
    if (error) {
      // Handle error
      return;
    }

    localStorage.setItem('idToken', authResult.idToken);
    localStorage.setItem('profile', JSON.stringify(profile));
  });
});

```

_Implementing Lock_

```js

document.getElementById('btn-login').addEventListener('click', function() {
  lock.show();
});

```

_Showing Lock_


![Auth0 Lock Screen](https://cdn.auth0.com/blog/nexthrone-auth0lock.png)

_Auth0 Lock Screen_

In the case of an offline-first app, authenticating the user against a remote database won't be possible when network connectivity is lost. However, with service workers, you have full control over which pages and scripts are loaded when the user is offline. This means you can configure your `offline.html` file to display a useful message stating the user needs to regain connectivity to login again instead of displaying the Lock login screen.

## Conclusion

In this article, we were able to make our app load instantly and work offline. We were able to cache our dynamic data and serve the user the cached data when offline. 

In the final part of this tutorial, we will cover how to enable push notifications, add web application manifest and our app to a user's homescreen.
