// about service worker and push notification
if (navigator.serviceWorker) {
  console.log('ServiceWorkers are supported');

  navigator.serviceWorker.register('https://auth0.com/blog/sw.js')
    .then(function (reg) {
        console.log('ServiceWorker registered');
        doesBrowserSupportNotifications();
      })
    .catch(function (error) {
        console.log('Failed to register ServiceWorker', error);
      });
}

var requestNotificationPermission = function () {

  if (Notification.requestPermission) {
    Notification.requestPermission(function (result) {
      console.log('Notification permission : ', result);
      if (result == 'granted') {
        registerForPush();
      }
    });
  } else {
    console.log('Notifications not supported by this browser.');
  }
};

function registerForPush() {
  navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {

    serviceWorkerRegistration.pushManager.getSubscription().then(
      function (pushSubscription) {
        // Check we have a subscription to unsubscribe
        if (pushSubscription) {
          console.warn('subscribed Notification');
          return;
        }

        subscribe(serviceWorkerRegistration);
      });
  });
}

function subscribe(serviceWorkerRegistration) {
  return serviceWorkerRegistration.pushManager.subscribe({
    userVisibleOnly: true,
  })
  .then(function (subscription) {
      fetch('https://auth0-marketing.run.webtask.io/blog-push-subscriptions?webtask_no_cache=1',
        {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({ 'registration_id': subscription.endpoint.substr(subscription.endpoint.lastIndexOf('/') + 1) }),
          })
        .then(function (res) {
          metricsLib.track('blog:notifications', { 'trackData': 'accepted' });
        })
        .catch(function (err) {
          console.err(err);
          return;
        });

    })
    .catch(function (error) {
        console.log('Subscription for Push failed', error);
      });
}

window.unsubscribePushNotification = function () {
  return navigator.serviceWorker.ready
    .then(function (serviceWorkerRegistration) {

      serviceWorkerRegistration.pushManager.getSubscription()
        .then(
          function (pushSubscription) {
            // Check we have a subscription to unsubscribe
            if (!pushSubscription) {
              console.warn('Unsubscribed Notification');
              return;
            }

            var subscriptionId = pushSubscription.endpoint.substr(pushSubscription.endpoint.lastIndexOf('/') + 1);

            // request to wt to remove subscription of db
            pushSubscription.unsubscribe()
              .then(function (successful) {
                fetch('https://auth0-marketing.run.webtask.io/blog-push-subscriptions/' + subscriptionId,
                  {
                    method: 'DELETE',
                  })
                  .then(function (res) { console.log('unsubscribe'); })
                  .catch(function (err) {
                    console.err(err);
                    return;
                  });
              }).catch(function (e) {
                console.log('Unsubscription error: ', e);
              });
          }).catch(function (e) {
              console.error('Error thrown while unsubscribing from push messaging.', e);
            });
    });
};

function doesBrowserSupportNotifications() {
  var supported = true;
  if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
    console.warn('Notifications aren\'t supported in Service Workers.');
    supported = false;
  }

  if (!Notification.requestPermission) {
    console.warn('Notifications are not supported by the browser');
    supported = false;
  }

  if (Notification.permission !== 'granted') {
    console.warn('The user has blocked notifications.');
    supported = false;
  }

  // Check if push messaging is supported
  if (!('PushManager' in window)) {
    console.warn('Push messaging isn\'t supported.');
    supported = false;
  }

  if (supported) {
    console.log('Everthing is fine you can continue');
  }
}

//  popup push subscription

$(document).ready(function ($) {
  var valActive;
  function conditionalScroll(scroll) {
    if (valActive) {
      var width = $(window).width();
      if (width > 991) {
        if (scroll > 520) {
          $('.pn-popup')
            .css(
              { 'position': 'fixed',
                'z-index': '1500',
              });

          $('.pn-popup').addClass('pn-is-visible');
          $('.pn-popup-container')
            .css(
              {
                'position': 'inherit',
                'top': '110px'
              });
        }else {
          $('.pn-popup')
            .css(
              {
                'position': 'static',
              });

          $('.pn-popup').addClass('pn-is-visible');

          $('.pn-popup-container')
            .css(
              {
                'position': 'absolute',
                'top': '130px'
              });
        }
      }
    }
  }

  var popupVisibility = function () {
    var scroll = $(window).scrollTop();
    conditionalScroll(scroll);

    $(window).scroll(function () {
      scroll = $(window).scrollTop();
      conditionalScroll(scroll);
    });
  };

  // delay open pupup
  function openPopup() {
    setTimeout(function () {
      popupVisibility();
    }, 30000);
  }

  subscriptionValidation = function () {
    if (navigator.serviceWorker === undefined) { return; }

    return navigator.serviceWorker.ready
      .then(function (serviceWorkerRegistration) {
        serviceWorkerRegistration.pushManager.getSubscription()
          .then(
            function (pushSubscription) {
              console.log(pushSubscription);

              // Check subsccription
              if (!pushSubscription && localStorage.getItem('pn-subscription') != 'false') {
                valActive = true;
                openPopup();
              }
            }
          );
      });
  };

  // popup buttons
  $('#push-allow').on('click', function (e) {
    $('.pn-popup').removeClass('pn-is-visible');
    valActive = false;
    requestNotificationPermission();
  });

  $('#push-block').on('click', function (e) {
    $('.pn-popup').removeClass('pn-is-visible');
    valActive = false;
    localStorage.setItem('pn-subscription', 'false');
    metricsLib.track('blog:notifications', { 'trackData': 'declined' });
  });

  subscriptionValidation();
});
