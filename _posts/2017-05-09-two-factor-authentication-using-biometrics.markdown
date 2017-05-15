---
layout: post
title: "Two-Factor Authentication Using Biometrics"
description: "Learn how to integrate voice recognition into your 2FA solution."
date: 2017-05-16 08:30
category: Technical Guide, Identity, MFA
author:
  name: "João Angelo"
  url: "https://twitter.com/jmpangelo"
  mail: "joao.angelo@auth0.com"
  avatar: "https://s.gravatar.com/avatar/7747f8f5b58076f7bc52cc1bcc54bec5?s=200"
design:
  bg_color: "#000000"
  image: "https://cdn2.auth0.com/blog/voice-auth/logo.png"
tags:
- Authentication
- Multifactor
- Biometrics
related:
- 2016-11-30-different-ways-to-implement-multifactor
---

**TL;DR** You can replace the use of traditional multifactor possession factors (phone codes, special-purpose hardware) in 2FA implementations with the use of inherence factors (voice biometrics) by leveraging [Auth0](https://auth0.com/) extensibility points and voice recognition services (VoiceIt). Additionally, by integrating a communications platform (Twilio) you can let your users complete the voice authentication step through their own phones.

___

## Traditional Two-Factor Authentication

The majority of existing two-factor or multifactor authentication implementations rely on the users mobile phone to perform ownership-based checks.

These checks range from the use of codes delivered over SMS to push notifications or time-based one-time password (TOTP) applications. All the methods are a significant improvement over just username and password credentials and they are available to everyone that already has a phone; which is a huge audience.

Nonetheless, you can argue that these approaches are closer to a two-step authentication process rather than two-factor authentication because a users phone isn't really a possession factor at all. The ability to intercept SMS or knowledge of the cryptography keys used in association with TOTP or push notifications could allow an attacker to complete an authentication process without having to have the users phone.

Real possession factors like hardware-based tokens would increase security, but they are not as generally available or as a simple to use as a phone.

## Going Beyond Possession Factors

Inherence factors, usually referred to as biometrics, including fingerprint readers, retina scanners, or voice recognition can be used together with a knowledge factor like username and password credentials as suitable means to provide an effective 2FA solution.

Within the biometrics options, fingerprint readers and retina scanners are even less broadly available than the special purpose hardware-based tokens used as a possession factor. However, requirements for the voice recognition alternative are much less demanding. These requirements can be met with what's available right now to the majority of users, more specifically, audio capture and transmission services.

The support for audio capturing with the increased availability of voice recognition services available over HTTP-based APIs makes it really simple to implement a scenario like the one shown in the following demonstration.

The users provide their username and password credentials and then are asked to speak an authentication phrase that is processed for voice recognition in order to grant access to the client application that initiated the authentication process.

![Two-Factor Authentication Demonstration](https://cdn2.auth0.com/blog/voice-auth/authenticate-browser.gif)

## Theory

Before going into the technicalities of the implementation lets take a look at the requirements for a user to complete voice-based authentication.

A user must first complete a voice enrollment process before being able to authenticate using their voice. This is a one-time process where the user repeatedly records an authentication phrase until the voice recognition service has enough information to later process authentication requests with the required amount of confidence.

Having completed the enrollment process the user's voice can now be used during authentication requests. The authentication process is similar to the enrollment, the users says the authentication phrase they used for enrollment and the voice recognition service will use the available data to verify it.

The following diagram illustrates the flow taken during the enrollment and authentication processes.

![Enrollment and Authentication Flows](https://cdn2.auth0.com/blog/voice-auth/enroll_authenticate_diagram.png)

## Putting Theory to Practice

Now that we know, at a high-level, what it takes to have a voice authentication system, lets see how can we integrate this into the authentication process of an existing application that uses username and password credentials.

We're going to leverage two Auth0 extensibility points in order to streamline the process. Specifically, we'll configure a redirect rule, that after the successful completion of the first authentication factor will send the user to another web application responsible for the second authentication factor; voice authentication.

The second extensibility point used will be the implementation of a web application as an Auth0 extension which will enable the following:

* Automatic provisioning of the configuration required to call the Auth0 Management API from within the web application.
* Automatic creation of the redirect rule upon extension installation.
* Remove the need for a separate infrastructure to run the web application.

The last piece of the puzzle is the integration with a voice recognition service, which as long as the service exposes an HTTP-based API is also rather simple to accomplish. This happens to be the case for [VoiceIt](https://www.voiceit-tech.com/), the service used in this demo. VoiceIt requires the concept of a user, for which a voice enrollment has to be completed before voice authentication requests can be made.

Finally, it's a matter of putting the pieces together. Most of the code is boilerplate for integration of all the players. The most noteworthy parts that warrant a dedicated look are the ones referring to the transition between the different trust domains and how to ensure the security of these transitions, more specifically:

* Transitioning from the Auth0 authentication transaction to the voice application.
* Transitioning from the voice application back to the corresponding Auth0 authentication transaction.

Both transitions require the secure transmission of information between the two parties. A possible approach to accomplishing this is to use a signed JWT token, as this will provide both a way to encode information that can be easily included in a URL while at the same time ensuring that a malicious user cannot tamper with the information.

Given the reliance on a redirect rule and the fact that the token will need to be included in the URL itself, it's probably for the best if that token has a short expiry time and is also of single-use. The following implementation facilitates the single-use check by including a `jti` claim that can be used by the receiving application as means to ensure that it only accepts a given instance of the token once. Values of the `jti` claim for already used tokens are stored and validation of received tokens include a check against the already used identifiers.

```javascript
user.user_metadata = user.user_metadata || {};
var phoneNumber = user.phone_number || user.user_metadata.phone_number;

// Redirect the user to the extension
var claims = {
    sub: user.user_id,
    name: user.name,
    phone_number: phoneNumber,
    jti: crypto.randomBytes(16).toString("hex"),
    vit_id: user.app_metadata.vit_enrollment.id,
    vit_secret: user.app_metadata.vit_enrollment.secret,
    vit_lang: user.app_metadata.vit_enrollment.language,
    vit_enrolled: user.app_metadata.vit_enrollment.completed
};

var token = jwt.sign(claims, config.signingKey, { expiresIn: 60 });

context.redirect = { url: config.extensionUrl + "?token=" + token };

callback(null, user, context);
```

When the user completes voice authentication, either successfully or not, the second transition occurs and the information is returned back to Auth0. Transmission of this information relies again on a signed JWT token so that tampering can be prevented, however, token replay mitigation is now handled a bit differently.

During the first transmission, besides the token that the rule manualy included in the URL, Auth0 will automatically include a state parameter with a value that uniquely identifies the authentication transaction that is in progress; this same value needs to be returned to Auth0 when continuing the transaction. It's then possible to use the value of the state parameter as the value of a `nonce` claim within the token used during the second transaction as a way to ensure that a given token can only be used to continue a single authentication transaction.

```javascript
var token = context.request.query.token;
var state = context.request.query.state;

try {
    var payload = jwt.verify(token, config.signingKey, {
        algorithms: ["HS256"]
    });

    if (payload.sub !== user.user_id) {
        return callback(new UnauthorizedError("User mismatch."));
    }

    if (!payload.vit_authenticated) {
        return callback(new UnauthorizedError("User failed authentication."));
    }

    if (payload.nonce !== state) {
        return callback(new UnauthorizedError("Session and token mismatch."));
    }

    return callback(null, user, context);
} catch (error) {
    console.log(error);

    return callback(new UnauthorizedError("Unexpected failure."));
}
```

## Improving the UX

Authenticating the user using the computer's microphone is adequate for demonstration purposes or in enterprise environments.

For consumer facing services considering voice authentication, it's more difficult to make assumptions about what's available to the end-user. Adopting alternatives that impose fewer requirements and are overall simpler to use gives them a clear advantage. This is where [Twilio](https://www.twilio.com/) shines as it allows us to implement a full-blown voice authentication solution over the phone in no time.

### Leveraging Twilio for Phone-Based Voice Authentication

Much in the same way that current 2FA methods gained adoption by leveraging the broad availability of mobile phones you can do the same to streamline a voice authentication process.

By integrating the [Twilio](https://www.twilio.com/) communications platform, it's possible to automatically call the user when an authentication request comes in, ask them to provide their associated authentication phrase, record it and send it for verification.

For the user, the similarity to existing solutions that use the phone as a possession factor simplifies the users' transition from one approach to the other. Despite the reliance on phones, there is no strict association to a specific device. This allows the user to switch devices without having to worry about resetting existing multifactor authentication enrollments. The phone is only used as a way to obtain the actual authentication factor; the user's voice.

When the outgoing call is established, you need to associate it with the existing authentication session from the web application. You achieve this by including a token that maps to the correct session within the URL used to initiate the call. Mapping this to the Twilio API, you would use the following code:

```javascript
var client = twilio(accountSid, authToken);

client.calls.create({
  url: `/api/phone/receive-call/${token}`,
  to: userPhoneNumber,
  from: twilioOutgoingPhoneNumber
}, function (error, call) { /* (...) */ });
```

Then, on the handler for the `/api/phone/receive-call/:token` route you take advantage of the fact that you can set a single cookie in the HTTP response to a Twilio initiated request and then this cookie will be sent by Twilio on subsequent requests associated with the same combination of *To* and *From* numbers. Check the Twilio documentation to learn more about [how cookies work](https://support.twilio.com/hc/en-us/articles/223136287-How-do-Twilio-cookies-work-).

```javascript
// (...) Validate the received token

var twiml = new twilio.TwimlResponse();

twiml.say("You have initiated a Voice Authentication process.");

// Set a cookie to link the authentication session with the call
res.cookie("tw_cid", cid, { httpOnly: true, secure: true });

res.send(twiml.toString());
```

The end result, as shown next, is that the user interaction moves from the web application to the phone and the user can complete the request simply by answering a call and following the instructions.

![Two-Factor Authentication by Phone Demonstration](https://cdn2.auth0.com/blog/voice-auth/authenticate-phone.gif)

## Real-Time Call Progress Updates

Even though the authentication process now transitions from the web application into a call delivered to the users phone, the browser window for the application will need to stay open because the actual completion of the authentication process will have to be completed using it.

The continuation of the process in the web application can and should be done automatically when the call completes. A simple mechanism to accomplish this would be for the client browser-based application to poll the server-side backend that is managing the call. However, this would be inefficient and at the same time introduce artificial delays in the process.

A better alternative is for the server-side to continuously push state changes to the client application in real-time. Even though it sounds more complex than the previous alternative you can easily achieve this by integrating a service like [Pusher](https://pusher.com/).

![Two-Factor Authentication by Phone with Real-Time Progress Updates Demonstration](https://cdn2.auth0.com/blog/voice-auth/authenticate-phone-with-progress.gif)

In order to accomplish the previously illustrated functionality, on the server-side, you initialize a Pusher instance and then continuously push updates when certain call-related events occur:

```javascript
var pusher = new Pusher({
  appId: appId,
  cluster: cluster,
  key: key,
  secret: secret,
  encrypted: true
});

// (...)
pusher.trigger(`callprogress-${call.cpid}`, "update", { "step": 2, "seq": seq++ });

// (...)
pusher.trigger(`callprogress-${call.cpid}`, "update", { "step": 3, "seq": seq++ });
```

On thenclient-side you subscribe to the event stream and react accordingly. The only thing worth mentioning is that the server sends a sequence number with each update in order to allow the client to correctly process the progress updates even if the network fails to deliver them in order.

```javascript
var pusher = new Pusher(key, {
    cluster: cluster,
    encrypted: true
});

var channel = pusher.subscribe("callprogress-" + cpid);

channel.bind("update", function() { /* (...) */ });
```

## Test-Drive

All of the source code used as the basis for this article is available at: [Auth0 Voice Factor Extension](https://github.com/auth0/auth0-extension-voice-factor) repository. The easiest way for you to get started with it is to install it as an extension within your own Auth0 account; just follow the instructions contained in the repository [*README*](https://github.com/auth0/auth0-extension-voice-factor#install-as-auth0-extension) file.

If you don't yet have an Auth0 account don't worry, **you can [sign up](javascript:signup\(\)) for a free account today**. Besides the Auth0 account, a fully functional deployment also requires a [VoiceIt](https://www.voiceit-tech.com/) account used for processing all the voice enrollment and authentication requests.

Additionally, you can provide a [Twilio](https://www.twilio.com/) account if you want to enable the completion of the voice authentication requests through phone calls and a [Pusher](https://pusher.com/) account if you want to receive real-time progress information for those same calls.

# Conclusion

Biometric authentication may still be far from mainstream adoption and may even be overkill for most applications out there. However, this article shows that by leveraging Auth0 extensibility points coupled with a third-party voice authentication service, it's very simple to add an additional layer of security for applications that demand an additional level of security.

Another benefit of biometrics as second authentication factor is that it's less of a burden for end-users. No one likes the hassle of buying a new phone and getting locked out of online accounts due to multifactor authentication enrollments associated with the old phone that you may or may not have anymore.
