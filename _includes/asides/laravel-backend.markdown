## Aside: Securing Laravel APIs with Auth0

Securing Laravel APIs with Auth0 is very easy and brings a lot of great features to the table. With Auth0, we only have to write a few lines of code to get:

- A solid [identity management solution](https://auth0.com/user-management), including [single sign-on](https://auth0.com/docs/sso/single-sign-on)
- [User management](https://auth0.com/docs/user-profile)
- Support for [social identity providers (like Facebook, GitHub, Twitter, etc.)](https://auth0.com/docs/identityproviders)
- [Enterprise identity providers (Active Directory, LDAP, SAML, etc.)](https://auth0.com/enterprise)
- Our [own database of users](https://auth0.com/docs/connections/database/mysql)

### Sign Up for Auth0

You'll need an [Auth0](https://auth0.com) account to manage authentication. You can sign up for a <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">free account here</a>. Next, set up an Auth0 API.

### Set Up an API

Go to [**APIs**](https://manage.auth0.com/#/apis) in your Auth0 dashboard and click on the "Create API" button. Enter a name for the API. Set the **Identifier** to a URL(_existent or non-existent URL_). The **Signing Algorithm** should be `RS256`.

![Create API on Auth0 dashboard](https://cdn2.auth0.com/docs/media/articles/api-auth/create-api.png)
_Create API on Auth0 dashboard_

We're now ready to implement Auth0 authentication on our Laravel backend API.

### Dependencies and Setup

Install the `laravel-auth0` package via composer like so:

```bash
composer require auth0/login:"~5.0"
```

Generate the `laravel-auth0` package config file like so:

```bash
php artisan vendor:publish
```

After the file is generated, it will be located at `config/laravel-auth0.php`. Ensure you replace the placeholder values with the authentic values from the Auth0 Admin Dashboard. Double check your values with [laravel-auth0](https://github.com/auth0-samples/auth0-laravel-api-samples/blob/master/01-Authorization-RS256/config/laravel-auth0.php).

Your `.env` file should have the `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET` and `AUTH0_CALLBACK_URL` values like so:

```bash
AUTH0_DOMAIN=kabiyesi.auth0.com
AUTH0_CLIENT_ID=xxxxxxxxxxxxxxxxxx
AUTH0_CLIENT_SECRET=xxxxxxxxxxxxxxxxx
AUTH0_AUDIENCE=http://mylaravelapi.com
AUTH0_CALLBACK_URL=null
```

### Activate Provider and Facade

The `laravel-auth0` package comes with a provder called `LoginServiceProvider`. Add this to the list of application `providers`.

```php
// config/app.php
'providers' => array(
    // ...
    \Auth0\Login\LoginServiceProvider::class,
);
```

If you would like to use the `Auth0` Facade, add it to the list of `aliases`.

```
// config/app.php

'aliases' => array(
    // ...
    'Auth0' => \Auth0\Login\Facade\Auth0::class,
);
```

The user information can now be accessed with `Auth0::getUser()`. Finally, you need to bind a class that provides a user (your app model user) each time the user is logged in or an `access_token` is decoded. You can use the `Auth0UserRepository` provided by this package or you can build your own class.

To use `Auth0UserRepository`, add the following lines to your app's `AppServiceProvider`:

```php
// app/Providers/AppServiceProvider.php

public function register()
{

    $this->app->bind(
      \Auth0\Login\Contract\Auth0UserRepository::class, 
      \Auth0\Login\Repository\Auth0UserRepository::class
    );

}
```

### Configure Authentication Driver

The `laravel-auth0` package comes with an authentication driver called `auth0`. This driver defines a user structure that wraps the normalized user profile defined by Auth0. It doesn't actually persist the object but rather simply stores it in the session for future calls.

This is adequate for basic testing or if you don't have a requirement to persist the user. At any point you can call `Auth::check()` to determine if there is a user logged in and `Auth::user()` to retreive the wrapper with the user information.

Configure the driver in `config/auth.php` to use `auth0`.

```php
// app/config/auth.php

// ...
'providers' => [
    'users' => [
        'driver' => 'auth0'
    ],
],
```

### Secure API Routes

Your API routes are defined in `routes/api.php` for Laravel 5.3+ apps.

```php
// routes/api.php

<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/public', function (Request $request) {
  return response()->json(["message" => "Hello from a public endpoint! You don't need any token to access this URL..Yaaaay!"]);
});

Route::get('/wakanda', function (Request $request) {
  return response()->json(["message" => "Access token is valid. Welcome to this private endpoint. You need elevated scopes to access Vibranium."]);
})->middleware('auth:api');
```

Now, you can send a request to your protected endpoint which includes an `access_token`.

```bash
curl --request GET \
  --url http://localhost:8000/api/wakanda \
  --header 'authorization: Bearer <ACCESS TOKEN>'
```

Once a user hits the `api/wakanda` endpoint, a valid JWT `access_token` will be required before the resource can be released. With this in place, private routes can be secured.

### More Resources

That's it! We have an authenticated Laravel API with protected routes. To learn more, check out the following resources:

* [Why You Should Always Use Access Tokens to Secure an API](https://auth0.com/blog/why-should-use-accesstokens-to-secure-an-api/)
* [Laravel backend Quickstart](https://auth0.com/docs/quickstart/backend/laravel)
* [Navigating RS256 and JWKS](https://auth0.com/blog/navigating-rs256-and-jwks/)
* [Access Token](https://auth0.com/docs/tokens/access-token)
* [Verify Access Tokens](https://auth0.com/docs/api-auth/tutorials/verify-access-token)
* [Call APIs from Client-side Web Apps](https://auth0.com/docs/api-auth/grant/implicit)
* [How to implement the Implicit Grant](https://auth0.com/docs/api-auth/tutorials/implicit-grant)
* [Auth0.js Documentation](https://auth0.com/docs/libraries/auth0js)
* [OpenID Standard Claims](https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims)