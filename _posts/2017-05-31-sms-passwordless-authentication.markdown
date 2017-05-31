---
layout: post
title: "SMS Passwordless Authentication"
description: Learn how phone number authentication works and how you can implement it easily with Auth0!
date: 2017-05-31 08:30
category: Technical Guide, Identity, Passwordless
design:
  bg_color: "#001D3F"
  image: https://cdn.auth0.com/blog/PasswordlessLogo.png
author:
  name: Prosper Otemuyiwa
  url: http://twitter.com/unicodeveloper?lang=en
  mail: prosper.otemuyiwa@auth0.com
  avatar: https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200
tags:
- passwordless
- authentication
- SMS
related:
- 2016-04-21-facebook-account-kit-passwordless-authentication
- 2016-05-14-how-passwordless-sms-authentication-can-improve-your-app
- 2016-09-09-analysis-of-passwordless-connections

---

---

**TL;DR:** Passwordless is not a new concept in the world of authentication. Platforms like Slack and Whatsapp already adopt this form of authentication. There are different forms of strategy that requires authentication without passwords. However, there are different forms of passwordless authentication. In this article, you'll get to understand how SMS passwordless authentication works and build an app alongside. Check out the [repo](https://github.com/auth0-blog/swapart) to get the code.


---

## What is SMS Passwordless Authentication?

SMS Passwordless authentication is a type of authentication where users do not need to login with passwords. This form of authentication totally makes passwords obsolete. With this form of authentication, users are presented with the option of logging in simply via a one time unique code that is delivered via text message.

## Benefits of Passwordless Authentication

Without much ado, passwordless authentication helps:

* **Improve User Experience:** The faster users can sign up and use your service, the more users your app tends to attract. Users dread having to fill out forms and go through a rigorous registration process. Imagine eliminating that extra five minutes of asking users to remember their grandmother's maiden name as a security question. Passwordless authentication helps improve user experience in this regard!

* **Increase Security:** [59%](https://auth0.com/blog/2015/09/30/auth0-passwordless-email-authentication-and-sms-login-without-passwords/) of internet users admit to using the same password for multiple accounts. Once an attacker gets hold of one account's password, he or she can compromise other accounts that use the same password. However, once you go passwordless, there are no passwords to be hacked.

## How Does SMS Passwordless Authentication Work?

Let's take a look at how SMS passwordless authentication actually works. Check out the process below:

* The user is asked to enter a valid phone number.

	![](https://cdn.auth0.com/blog/sms-authentication/sms-lock.png)

	_User enters a valid phone number_

* A unique onetime code is then sent to the phone number.

	![Onetime code is received](https://cdn.auth0.com/blog/sms-authentication/auth0-sms.png)

	_One time code is received_

* Once the user enters this code into your application, your app validates that the code is correct and that the phone number exists and belongs to a user, a session is initiated, and the user is logged in.

	![SMS Confirmation](https://cdn.auth0.com/blog/sms-authentication/sms-confirmation.png)

	_In Auth0's case, the user has five minutes to input the code into the app & get logged-in_


Take a look at Auth0's onetime code via SMS implementation below:

![Authentication with a onetime code via SMS](https://cdn.auth0.com/docs/media/articles/connections/passwordless/passwordless-create-user-flow.png)

If the phone number matches an existing user, Auth0 just authenticates the user like so:

![Authenticates user](https://cdn.auth0.com/docs/media/articles/connections/passwordless/passwordless-authenticated-flow.png)

Other forms of passwordless authentication are:

* Authentication with a magic link via email
* Authentication with a onetime code via e-mail
* Authentication with fingerprint. Auth0 supports [TouchID](https://auth0.com/docs/libraries/lock-ios/v1/touchid-authentication)

Check out this [excellent article](https://auth0.com/blog/how-passwordless-authentication-works/) to have an in-depth understanding of how these other forms of passwordless authentication work!

## Aside: Phone Number / SMS Passwordless Authentication with Auth0

With Auth0, SMS passwordless authentication otherwise known as phone number authentication is dead simple to implement. There are diagrams earlier in this post that already show the SMS passwordless authentication flow using Auth0. The Passwordless API is an efficient [API implementation](https://auth0.com/docs/api/authentication#passwordless) of passwordless authentication.

We'll build an application that allows you login via your mobile phone number. Let's get started.

Create an `index.html` file in your directory and add this piece of code to it:

{% highlight html %}
{% raw %}

<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <script src="//use.typekit.net/iws6ohy.js"></script>
    <script>try{Typekit.load();}catch(e){}</script>

    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- font awesome from BootstrapCDN -->
    <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css" rel="stylesheet">
    <link href="//maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet">
    <link href="app.css" rel="stylesheet">

    <script src="auth0-variables.js"> </script>
  </head>
  <body class="home">
    <div class="container">
      <div class="login-page clearfix">
        <div class="login-box auth0-box before">
          <img class="logo" src="https://i.cloudup.com/StzWWrY34s.png" />
          <h3>Auth0 Passwordless Example</h3>
          <p>Login with SMS</p>
          <div class="alert alert-warning">Don't forget to add your page's origin <strong><script type="text/javascript">document.write(location.origin)</script></strong> to your App's <strong>Allowed Origins (CORS)</strong> in the <a target="_blank" href="https://manage.auth0.com">Auth0 dashboard</a>, unless it is already in the list of <strong>Allowed Callback URLs.</strong></div>
          <a ng-click="login()" class="btn btn-primary btn-lg btn-login btn-block">SignIn</a>
        </div>
        <div class="logged-in-box auth0-box logged-in" style="display: none;">
          <h1 id="logo"><img src="auth0_logo_final_blue_RGB.png" /></h1>
          <img class="avatar"/>
          <h2>Welcome <span class="nickname"></span></h2>
        </div>
      </div>
    </div>
    <script src="http://code.jquery.com/jquery-2.1.1.min.js"></script>
    <script src="https://cdn.auth0.com/js/lock-passwordless-1.0.min.js"></script>
    <script type="text/javascript">
      $(document).ready(function() {
        $('.btn-login').click(function(e) {
          e.preventDefault();

          // Initialize Passwordless Lock instance
          var lock = new Auth0LockPasswordless(
            // All these properties are set in auth0-variables.js
            AUTH0_CLIENT_ID,
            AUTH0_DOMAIN
          );

          var appearanceOpts = {
            autoclose: true
          };

          // Open the lock in SMS mode with the ability to handle the authentication in page
          lock.sms(appearanceOpts,function (err, profile, id_token, access_token, state, refresh_token) {
            if (!err){
              // Save the JWT token.
              localStorage.setItem('userToken', id_token);
              console.log('profile',profile);
              $('.login-box').hide();
              $('.logged-in-box').show();
              $('.nickname').text(profile.name);
              $('.avatar').attr('src', profile.picture);
            }
          });
        });
      });
    </script>
  </body>
</html>

{% endraw %}
{% endhighlight %}

If you don't have an Auth0 account: <a href="javascript:signup()">Sign up for free</a>.

Now, create a JavaScript file, `auth0-variables.js`. We'll add auth0 variables to this file

```js
var AUTH0_CLIENT_ID='CLIENT_ID';
var AUTH0_DOMAIN='AUTH0_DOMAIN';
```

Create an `app.css` file and add the [code here](https://github.com/auth0-blog/swapart/blob/master/app.css) to it.

Run your app. The landing page should look like this:

![Landing Page](https://cdn.auth0.com/blog/swapart/landingpage.png)
_Landing Page_

When you click on **Signin**, you should see this:

![Signin](https://cdn.auth0.com/blog/swapart/login.png)
_Signin Page_

* On the [Auth0 dashboard](https://manage.auth0.com), click on the red `Create Client` button to create a new app like so:

	![Create client](https://cdn.auth0.com/blog/swapart/createclient.png)
	_Create client_

* Head over to the [Passwordless Connections](https://manage.auth0.com/#/connections/passwordless) side of the dashboard and enable SMS option. It should show something similar to the image below:

	![Enable Swapart App](https://cdn.auth0.com/blog/enableEmailOne.png)
	_Enable Swapart App_

* The next page will show you a page to fill in your `Twilio SID` and `Twilio Auth Token` and the `From number`.
* Head over to Twilio, sign up and get the `SID` and `Auth Token` values, then add them to the Auth0 page and save.
* Head over to your settings tab for the `Swapart` app and copy your `client_id` and `domain`
* Open up `auth0-variables.js` in your code and replace the `AUTH0_CLIENT_ID` and `AUTH0_DOMAIN` values with your real Auth0 keys.
* Make sure you add your app URL to the **Allowed Origins(CORS)** in the Auth0 dashboard. Your app has to run on a server. `http-server` and `nginx` are good options.

Let's try our app. Click the Login button and put your phone number.

![Login with Phone Number](https://cdn.auth0.com/blog/swapart/loginwithphonenumber.png)
_Login with Phone Number_

<div align="center">
	<img src="https://cdn.auth0.com/blog/swapart/codefromauth0.png" width=400 height=400 />
</div>
_Code from Auth0 delivered to your Phone_

![Enter the code](https://cdn.auth0.com/blog/swapart/code.png)
_Enter code from Phone number_

![Logged In](https://cdn.auth0.com/blog/swapart/loggedin.png)
_Submit and be logged in_

![Under the hood](https://cdn.auth0.com/blog/swapart/underthehoodetails.png)
_Check out the token saved in the localStorage_

You can go further and use the token to determine the `logged-in` and `logged-out` auth status of a user.

## Conclusion

There is no doubt that passwords have become more susceptible to being compromised in recent years. [Passwordless](https://auth0.com/passwordless/) authentication aims to eliminate authentication vulnerabilities. This recent [analysis of passwordless connections](https://auth0.com/blog/analysis-of-passwordless-connections/) shows that passwordless adoption is increasing. Passwordless authentication is also very useful and gaining ground in the IoT world. It's easier, friendlier, and faster to be authenticated into an IoT device via Touch ID, push notification, or even a onetime passcode than with traditional means. If you really care about security, you should look into passwordless authentication!

{% include tweet_quote.html quote_text="If you care about security, you should look into passwordless authentication" %}
