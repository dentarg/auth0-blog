function getBrowserName() {
  var userAgent = navigator.userAgent;
  var browserName = (userAgent.match(/opera|chrome|safari|firefox/i) || [])[0];
  var appName = navigator.appName;

  if (appName === "Microsoft Internet Explorer") {
    browserName = "IE";
    return browserName;
  }

  if (navigator.appVersion.indexOf("Edge") > -1) {
    browserName = "Edge";
    return browserName;
  }

  if (browserName === "Chrome") {
    var opr = userAgent.match(/\bOPR/i);
    if (opr !== null) {
      browserName = "Opera";
      return browserName;
    }

    return browserName;
  } else {
    return browserName;
  }
}


firebase.initializeApp({
  messagingSenderId: "480881558079"
});

const messaging = firebase.messaging();


if (navigator.serviceWorker) {
	navigator.serviceWorker
		.register("./frb-sw.js")
		.then(function(registration) {
			//return subscriptionValidation();
			messaging.useServiceWorker(registration);
			if (!isTokenSentToServer() && window.localStorage.getItem("pn-subscription") != "false") {
				valActive = true;
        openPopup();
      }
		});
}else{
	subscriptionValidationSafari();
}

function subscriptionValidation() {
	if (navigator.serviceWorker === undefined) {
		return;
	}

	return navigator.serviceWorker.ready.then(function(
		serviceWorkerRegistration
	) {
		serviceWorkerRegistration.pushManager
			.getSubscription()
			.then(function(pushSubscription) {
				// Check subscription
				if (!pushSubscription) {
					return serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly: true })
				  .then(function (subscription) {
						return subscription;
					})
				}

				return pushSubscription;
			})
			.then(function(pushSubscription) {
					var subscriptionId = pushSubscription.endpoint.substr(
							pushSubscription.endpoint.lastIndexOf("/") + 1);

					getPopupUI(subscriptionId);
			});
	});
}

// [START receive_message]
// - a message is received while the app has focus
messaging.onMessage(function(payload) {
	pushMessage(payload);
});
// [END receive_message]

function getPopupUI(subscriptionId) {
	var oldToken = subscriptionId || '';

	messaging
		.getToken()
		.then(function(currentToken) {
			if (currentToken) {
				sendTokenToServer(currentToken, oldToken);
			} else {
				// Show permission UI.
				if (!isTokenSentToServer() && localStorage.getItem("pn-subscription") != "false") {
					valActive = true;
					openPopup();
				}
				setTokenSentToServer(false);
			}
		})
		.catch(function(err) {
			console.log("An error occurred while retrieving token. ", err);
			setTokenSentToServer(false);
		});
}

function sendTokenToServer(currentToken, oldToken) {
  if (!isTokenSentToServer()) {
		fetch(
			"https://auth0-marketing.run.webtask.io/pn-push-subscriptions/push-notification/update",
			{
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json"
				},
				method: "POST",
				body: JSON.stringify({
					currentToken: currentToken,
					oldToken: oldToken
				})
			}
		)
		.then(function(res) {
			setTokenSentToServer(true);
			metricsLib.track("blog:notifications:" + browser, {
				trackData: "accepted"
			});
		})
		.catch(function(err) {
			return;
		});
  }
};

function isTokenSentToServer() {
	return window.localStorage.getItem("sentToServer") == 1;
}

function setTokenSentToServer(sent) {
	window.localStorage.setItem("sentToServer", sent ? 1 : 0);
}

function requestPermission() {
	messaging
		.requestPermission()
		.then(function() {
			subscriptionValidation();
		})
		.catch(function(err) {
			console.log("Unable to get permission to notify.", err);
		});
}


function fetchDeleteToken(token) {
  return fetch(
    "https://auth0-marketing.run.webtask.io/pn-push-subscriptions/push-notification/" +
      token,
    {
      method: "DELETE"
    }
  );
}

function deleteToken() {
	// Delete Instance ID token.
	messaging
		.getToken()
		.then(function(currentToken) {
			messaging
				.deleteToken(currentToken)
				.then(function() {
					setTokenSentToServer(false);
					fetchDeleteToken(currentToken).then(function(res) {
            console.log("Token deleted.");
          });
				})
		})
		.catch(function(err) {
			console.log("Error retrieving Instance ID token. ", err);
		});
};

window.unsubscribePushNotification = function() {
	return navigator.serviceWorker.ready.then(function(
		serviceWorkerRegistration
	) {
		serviceWorkerRegistration.pushManager
			.getSubscription()
			.then(function(pushSubscription) {
				// Check we have a subscription to unsubscribe
				if (!pushSubscription) {
					return;
				}
				var subscriptionId = pushSubscription.endpoint.substr(
					pushSubscription.endpoint.lastIndexOf("/") + 1
				);
				// request to wt to remove subscription of db
				pushSubscription.unsubscribe().then(function() {return deleteToken();});
			});
	});
};
	
// push notification whene the site is focus
function pushMessage(payload) {
	var notification = new Notification(payload.notification.title, {
		body: payload.notification.body,
		icon: payload.notification.icon,
		click_action: payload.notification.click_action
	});
}



function subscriptionValidationSafari() {
  if ("safari" in window && "pushNotification" in window.safari) {
    if (
      !localStorage.getItem("permissionAllow") &&
      localStorage.getItem("pn-subscription") != "false"
    ) {
      valActive = true;
      return openPopup();
    }
  }
};

 function pnSafari() {
  if ("safari" in window && "pushNotification" in window.safari) {
    var permissionData = window.safari.pushNotification.permission(
      "web.com.auth0"
    );
    checkRemotePermission(permissionData);
  }
};

function checkRemotePermission(permissionData) {
  if (permissionData.permission === "default") {
    window.safari.pushNotification.requestPermission(
      "https://safari-web-service.herokuapp.com", // The web service URL.
      "web.com.auth0.website", // The Website Push ID.
      {}, // Data that you choose to send to your server to help you identify the user.
      checkRemotePermission // The callback function.
    );
  } else if (permissionData.permission === "denied") {
    localStorage.setItem("pn-subscription", "false");
    metricsLib.track("blog:notifications:" + browser, {
      trackData: "declined"
    });
  } else if (permissionData.permission === "granted") {
    localStorage.setItem("permissionAllow", "true");
    metricsLib.track("blog:notifications:" + browser, {
      trackData: "accepted"
    });
  }
}

function popupVisibility() {
  var scroll = $(window).scrollTop();
  conditionalScroll(scroll);

  $(window).scroll(function() {
    scroll = $(window).scrollTop();
    conditionalScroll(scroll);
  });
}

// delay open pupup
function openPopup() {
  setTimeout(function() {
    popupVisibility();
  }, 30000);
}


//  UI popup push subscription

var browser = getBrowserName();
var valActive;
function conditionalScroll(scroll) {
	if (valActive) {
		var width = $(window).width();
		if (width > 991) {
			if (scroll > 520) {
				$(".pn-popup").css({
					position: "fixed",
					"z-index": "1500"
				});

				$(".pn-popup").addClass("pn-is-visible");
				$(".pn-popup-container").css({
					position: "inherit",
					top: "110px"
				});
			} else {
				$(".pn-popup").css({
					position: "static"
				});

				$(".pn-popup").addClass("pn-is-visible");

				$(".pn-popup-container").css({
					position: "absolute",
					top: "180px"
				});
			}
		}
	}
}

  // popup buttons
$("#push-allow").on("click", function(e) {
	$(".pn-popup").removeClass("pn-is-visible");
	valActive = false;
	if ("safari" in window && "pushNotification" in window.safari) {
		pnSafari();
	} else {
		requestPermission();
	}
});

$("#push-block").on("click", function(e) {
	$(".pn-popup").removeClass("pn-is-visible");
	valActive = false;
	localStorage.setItem("pn-subscription", "false");
	metricsLib.track("blog:notifications:" + browser, {
		trackData: "declined"
	});
});
 

