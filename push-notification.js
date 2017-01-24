// about service worker and push notification
if (navigator.serviceWorker) {
  navigator.serviceWorker.register('https://auth0.com/blog/sw.js');
}

var requestNotificationPermission = function () {

  if (Notification.requestPermission) {
    Notification.requestPermission(function (result) {
      if (result == 'granted') {
        registerForPush();
      }
    });
  }
};

function registerForPush() {
  navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {

    serviceWorkerRegistration.pushManager.getSubscription().then(
      function (pushSubscription) {
        // Check we have a subscription to unsubscribe
        if (pushSubscription) {
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
      fetch('https://auth0-marketing.run.webtask.io/pn-push-subscriptions/push-notification',
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
          return;
        });

    })
    .catch(function (error) {
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
              return;
            }

            var subscriptionId = pushSubscription.endpoint.substr(pushSubscription.endpoint.lastIndexOf('/') + 1);

            // request to wt to remove subscription of db
            pushSubscription.unsubscribe()
              .then(function (successful) {
                fetch('https://auth0-marketing.run.webtask.io/pn-push-subscriptions/push-notification/' + subscriptionId,
                  {
                    method: 'DELETE',
                  })
                  .then(function (res) { console.log('unsubscribe'); })
                  .catch(function (err) {
                    return;
                  });
              });
          });
    });
};

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
