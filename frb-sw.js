importScripts("https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js");

firebase.initializeApp({
  messagingSenderId: "480881558079"
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  const notificationTitle = "New article in Auth0 blog!";
  const notificationOptions = {
    body: " ",
    icon: "https://cdn.auth0.com/styleguide/components/1.0.8/media/logos/img/badge.png"
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

self.addEventListener("install", function(event) {
  self.skipWaiting();
});