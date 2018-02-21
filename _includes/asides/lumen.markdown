## Aside: Securing Lumen APIs with Auth0

Securing Lumen APIs with Auth0 is very easy and brings a lot of great features to the table. With Auth0, we only have to write a few lines of code to get:

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

We're now ready to implement Auth0 authentication on our Lumen API.

### Dependencies and Setup

Install the Auth0 PHP SDK package via composer like so:

```bash
composer require auth0/auth0-php:~5.0
```

### JWT Verification Service

Create the JWT Middleware service in the `app/Http/Middleware` directory.

```php
// app/Http/Middleware/Auth0Middleware.php

<?php

namespace App\Http\Middleware;

use Closure;
use Auth0\SDK\JWTVerifier;

class Auth0Middleware
{
    /**
     * Run the request filter.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if(!$request->hasHeader('Authorization')) {
          return response()->json('Authorization Header not found', 401);
        }

        $token = $request->bearerToken();

        if($request->header('Authorization') == null || $token == null) {
          return response()->json('No token provided', 401);
        }

        $this->retrieveAndValidateToken($token);

        return $next($request);
    }

    public function retrieveAndValidateToken($token)
    {
        try {
            $verifier = new JWTVerifier([
              'supported_algs' => ['RS256'],
              'valid_audiences' => [$AUTH0_API_AUDIENCE'], e.g https://mylumenapi.com
              'authorized_iss' => [$AUTH0_DOMAIN'] // e.g https://kabiyesi.auth0.com/
            ]);

            $decoded = $verifier->verifyAndDecode($token);
        }
        catch(\Auth0\SDK\Exception\CoreException $e) {
            throw $e;
        };
    }

}
```


In the `retrieveAndValidateToken()` method, we created an instance of `JWTVerifier` to verify the token coming from the Authorization header. It checks the algorithm, the API audience, and the issuer to ensure the token is a valid one issued by Auth0.

Change the `$AUTH0_DOMAIN` variable to your Auth0 domain and set the `$AUTH0_API_AUDIENCE` to the **Identifier** you chose while creating the API from the Auth0 dashboard. Ensure that there is a trailing slash in `authorized_iss`'s value. An example is `https://kabiyesi.auth0.com/`.

> **Note:** To learn more about RS256 and JSON Web Key Set, read [Navigating RS256 and JWKS](https://auth0.com/blog/navigating-rs256-and-jwks/).

### Activate Auth0 JWT Middleware

Assign the middleware a short-hand key in `bootstrap/app.php` file's call to the `$app->routeMiddleware()` method. 

**Note:** By default, the `$app->routeMiddleware()` function is commented. Uncomment it and modify it to the code below.

```php
$app->routeMiddleware([
  'auth' => App\Http\Middleware\Auth0Middleware::class,
]);
```

### Secure API Routes

We can use the middleware `auth` key defined in the `routeMiddleware()` function in the route options array in the `routes/web.php` file.

```php
$router->group(['prefix' => 'api', 'middleware' => 'auth'], function () use ($router) {
  $router->get('/protected',  function (Request $request) {
    return response()->json(["message" => "Welcome to the dashboard. Access token is valid!"]);
  });

  $router->get('/private', function (Request $request) {
    return response()->json(["message" => "Access token is valid. Welcome to this private endpoint."]);
  });
});
```

```php
$router->get('/public', function (Request $request) {
  return response()->json(["message" => "Hello from a public endpoint! You don't need any token to access this URL..Yaaaay!"]);
});
```

We just secured the API `protected` and `private` endpoints with JWT. If a user accesses the endpoints without a valid access token or no token at all, it returns an error.

### More Resources

That's it! We have an authenticated Lumen API with protected routes. To learn more, check out the following resources:

* [Why You Should Always Use Access Tokens to Secure an API](https://auth0.com/blog/why-should-use-accesstokens-to-secure-an-api/)
* [Navigating RS256 and JWKS](https://auth0.com/blog/navigating-rs256-and-jwks/)
* [Access Token](https://auth0.com/docs/tokens/access-token)
* [Verify Access Tokens](https://auth0.com/docs/api-auth/tutorials/verify-access-token)
* [Call APIs from Client-side Web Apps](https://auth0.com/docs/api-auth/grant/implicit)
* [How to implement the Implicit Grant](https://auth0.com/docs/api-auth/tutorials/implicit-grant)
* [Auth0.js Documentation](https://auth0.com/docs/libraries/auth0js)
* [OpenID Standard Claims](https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims)