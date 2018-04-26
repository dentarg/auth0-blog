## Aside: Authenticate an AngularJS App with Auth0

We can protect our applications and APIs so that only authenticated users can access them. Let's explore how to do this with an Angular application using [Auth0](https://auth0.com). You can clone this sample app from the [repo on GitHub](https://github.com/auth0-samples/auth0-angularjs-samples/blob/master/01-Login).

![Auth0 login screen](https://cdn.auth0.com/blog/resources/auth0-centralized-login.jpg)

### Sign Up for Auth0

You'll need an [Auth0](https://auth0.com) account to manage authentication. You can sign up for a <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">free account here</a>. Next, set up an Auth0 application and API so Auth0 can interface with an Angular app and Node API.

### Set Up an Auth0 Application

1. Go to your [**Auth0 Dashboard**](https://manage.auth0.com/#/) and click the "[create a new application](https://manage.auth0.com/#/applications/create)" button.
2. Name your new app and select "Single Page Web Applications".
3. In the **Settings** for your new Auth0 app, add `http://localhost:3000/callback` to the **Allowed Callback URLs**. Click the "Save Changes" button.
4. If you'd like, you can [set up some social connections](https://manage.auth0.com/#/connections/social). You can then enable them for your app in the **Application** options under the **Connections** tab. The example shown in the screenshot above utilizes username/password database, Facebook, Google, and Twitter. For production, make sure you set up your own social keys and do not leave social connections set to use Auth0 dev keys.

> **Note:** Under the **OAuth** tab of **Advanced Settings** (at the bottom of the **Settings** section) you should see that the **JsonWebToken Signature Algorithm** is set to `RS256`. This is  the default for new applications. If it is set to `HS256`, please change it to `RS256`. You can [read more about RS256 vs. HS256 JWT signing algorithms here](https://community.auth0.com/questions/6942/jwt-signing-algorithms-rs256-vs-hs256).

### Dependencies and Setup

Once you've cloned [the project](https://github.com/auth0-samples/auth0-angularjs-samples/blob/master/01-Login), install the dependencies for both the AngularJS app and the Node server by running the following commands in the root of your project folder:

```bash
$ npm install
```

Start the app via the express server with:

```bash
$ npm start
```


Find the [`auth0-variables.js.example` file](https://github.com/auth0-samples/auth0-angularjs-samples/blob/master/01-Login/auth0-variables.js.example) and **remove** the `.example` extension from the filename. Then open the file:

```js
var AUTH0_CLIENT_ID='{CLIENT_ID}'; 
var AUTH0_DOMAIN='{DOMAIN}'; 
var AUTH0_CALLBACK_URL='http://localhost:3000/callback';
```

Change the `AUTH0_DOMAIN` identifier to your Auth0 application domain.

> **Note:** To learn more about RS256 and JSON Web Key Set, read [Navigating RS256 and JWKS](https://auth0.com/blog/navigating-rs256-and-jwks/).

Change the  `AUTH0_CLIENT_ID` to your Auth0 information.

let's take a look at how authentication is implemented.

### Authentication Service

Authentication logic on the front end is handled with an `AuthService` authentication service: [`src/app/auth/auth.service.js` file](https://github.com/auth0-samples/auth0-angularjs-samples/blob/master/01-Login/app/auth/auth.service.js).

```js
(function () {

  'use strict';

  angular
    .module('app')
    .service('authService', authService);

  authService.$inject = ['$state', 'angularAuth0', '$timeout'];

  function authService($state, angularAuth0, $timeout) {

    function login() {
      angularAuth0.authorize();
    }
    
    function handleAuthentication() {
      angularAuth0.parseHash(function(err, authResult) {
        if (authResult && authResult.accessToken && authResult.idToken) {
          setSession(authResult);
          $state.go('home');
        } else if (err) {
          $timeout(function() {
            $state.go('home');
          });
          console.log(err);
          alert('Error: ' + err.error + '. Check the console for further details.');
        }
      });
    }

    function setSession(authResult) {
      // Set the time that the access token will expire at
      let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
      localStorage.setItem('access_token', authResult.accessToken);
      localStorage.setItem('id_token', authResult.idToken);
      localStorage.setItem('expires_at', expiresAt);
    }
    
    function logout() {
      // Remove tokens and expiry time from localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('id_token');
      localStorage.removeItem('expires_at');
      $state.go('home');
    }
    
    function isAuthenticated() {
      // Check whether the current time is past the 
      // access token's expiry time
      let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
      return new Date().getTime() < expiresAt;
    }

    return {
      login: login,
      handleAuthentication: handleAuthentication,
      logout: logout,
      isAuthenticated: isAuthenticated
    }
  }
})();
```

The `login()` method authorizes the authentication request with Auth0 using your config variables. A login page will be shown to the user and they can then log in.

* **handleAuthentication:** looks for the result of authentication in the URL hash. Then, the result is processed with the parseHash method from auth0.js
* **setSession:** sets the user's Access Token and ID Token, and the Access Token's expiry time
* **logout:** removes the user's tokens and expiry time from browser storage
* **isAuthenticated:** checks whether the expiry time for the user's Access Token has passed

> **Note:** If it's the user's first visit to our app _and_ our callback is on `localhost`, they'll also be presented with a consent screen where they can grant access to our API. A first party client on a non-localhost domain would be highly trusted, so the consent dialog would not be presented in this case. You can modify this by editing your [Auth0 Dashboard API](https://manage.auth0.com/#/apis) **Settings**. Look for the "Allow Skipping User Consent" toggle.

### Login Control

Provide a component with controls for the user to log in and log out.

_app/navbar/navbar.html_

{% highlight html %}
{% raw %}
<nav class="navbar navbar-default">
  <div class="container-fluid">
    <div class="navbar-header">
      <a class="navbar-brand" href="#">Auth0 - AngularJS</a>
      <button
        class="btn btn-primary btn-margin"
        ui-sref="home">
          Home
      </button>
      <button
        class="btn btn-primary btn-margin"
        ng-if="!vm.auth.isAuthenticated()"
        ng-click="vm.auth.login()">
          Log In
      </button>
      <button
        class="btn btn-primary btn-margin"
        ng-if="vm.auth.isAuthenticated()"
        ng-click="vm.auth.logout()">
          Log Out
      </button>
    </div>
  </div>
</nav>
{% endraw %}
{% endhighlight %}

### Directive

```js
// app/navbar/navbar.directive.js

(function() {
  
  'use strict';
  
  angular
    .module('app')
    .directive('navbar', navbar);
    
  function navbar() {
    return {
      templateUrl: 'app/navbar/navbar.html',
      controller: navbarController,
      controllerAs: 'vm'
    }
  }

  navbarController.$inject = ['authService'];
    
  function navbarController(authService) {
    var vm = this;
    vm.auth = authService;
  }
  
})();
```

Depending on whether the user is authenticated or not, they see the Log Out or Log In button. The `ng-click` events on the buttons make calls to the `authService` service to let the user log in or out. When the user clicks **Log In**, they are redirected to the login page.


### Callback Component

The [callback component](https://github.com/auth0-samples/auth0-angularjs-samples/tree/master/01-Login/app/callback) is where the app is redirected after authentication. This component simply shows a loading message until the login process is completed. After the session is set up, the users are redirected to the `/home` route.

```js
// app/callback/callback.controller.js

(function () {

  'use strict';

  angular
    .module('app')
    .controller('CallbackController', callbackController);

  function callbackController() {}

})();
```


_app/callback/callback.html_

{% highlight html %}
{% raw %}
<div class="loading">
  <img src="assets/loading.svg" alt="loading">
</div>
{% endraw %}
{% endhighlight %}

### Process Authentication Result

When a user authenticates at the login page, they are redirected to your application. Their URL contains a hash fragment with their authentication information. The `handleAuthentication` method in the `authService` service processes the hash.

Call the `handleAuthentication` method in your app's run block. The method processess the authentication hash while your app loads.

```js
// app/app.run.js

(function () {

  'use strict';

  angular
    .module('app')
    .run(run);

  run.$inject = ['authService'];
    
  function run(authService) {
    // Handle the authentication
    // result in the hash
    authService.handleAuthentication();
  }

})();
```

### More Resources

That's it! We have an authenticated AngularJS application with login, logout, and protected routes. To learn more, check out the following resources:

* [Why You Should Always Use Access Tokens to Secure an API](https://auth0.com/blog/why-should-use-accesstokens-to-secure-an-api/)
* [Navigating RS256 and JWKS](https://auth0.com/blog/navigating-rs256-and-jwks/)
* [Access Token](https://auth0.com/docs/tokens/access-token)
* [Verify Access Tokens](https://auth0.com/docs/api-auth/tutorials/verify-access-token)
* [Call APIs from Client-side Web Apps](https://auth0.com/docs/api-auth/grant/implicit)
* [How to implement the Implicit Grant](https://auth0.com/docs/api-auth/tutorials/implicit-grant)
* [Auth0.js Documentation](https://auth0.com/docs/libraries/auth0js)
* [OpenID Standard Claims](https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims)
