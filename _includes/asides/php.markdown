## Aside: Securing PHP APIs with Auth0

Securing PHP APIs with Auth0 is very easy and brings a lot of great features to the table. With Auth0, we only have to write a few lines of code to get:

- A solid [identity management solution](https://auth0.com/user-management), including [single sign-on](https://auth0.com/docs/sso/single-sign-on)
- [User management](https://auth0.com/docs/user-profile)
- Support for [social identity providers (like Facebook, GitHub, Twitter, etc.)](https://auth0.com/docs/identityproviders)
- [Enterprise identity providers (Active Directory, LDAP, SAML, etc.)](https://auth0.com/enterprise)
- Our [own database of users](https://auth0.com/docs/connections/database/mysql)

### Sign Up for Auth0

You'll need an [Auth0](https://auth0.com) account to manage authentication. You can sign up for a <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">free account here</a>. Next, set up an Auth0 API.

### Set Up an API

1. Go to [**APIs**](https://manage.auth0.com/#/apis) in your Auth0 dashboard and click on the "Create API" button. Enter a name for the API. Set the **Identifier** to a URL(_existent or non-existent URL_). The **Signing Algorithm** should be `RS256`.
2. You can consult the PHP example under the **Quick Start** tab in your new API's settings. We'll implement our PHP API in this fashion, using [Auth0 PHP SDK](https://github.com/auth0/auth0-PHP).

![Create API on Auth0 dashboard](https://cdn2.auth0.com/docs/media/articles/api-auth/create-api.png)
_Create API on Auth0 dashboard_

We're now ready to implement Auth0 authentication on our PHP backend API.

### Dependencies and Setup

Install the following packages via composer like so:

```bash
composer require bramus/router:dev-master auth0/auth0-php:~5.0
```

### JWT Verification Service

```php
<?php

namespace App;

use Auth0\SDK\JWTVerifier;

class Main {

  protected $token;
  protected $tokenInfo;

  public function setCurrentToken($token) {

      try {
        $verifier = new JWTVerifier([
          'supported_algs' => ['RS256'],
          'valid_audiences' => [$AUTH0_API_AUDIENCE],
          'authorized_iss' => [$AUTH0_DOMAIN]
        ]);

        $this->token = $token;
        $this->tokenInfo = $verifier->verifyAndDecode($token);
      }
      catch(\Auth0\SDK\Exception\CoreException $e) {
        throw $e;
      }
  }

  public function privatePing() {
      return [
          "status" => "ok",
          "message" => "Hello from a private endpoint! You do need to be authenticated to see this."
      ];
  }

}
```

Change the `$AUTH0_DOMAIN` variable to your Auth0 domain and set the `$AUTH0_API_AUDIENCE` to the **Identifier** you chose while creating the API from the Auth0 dashboard.

> **Note:** To learn more about RS256 and JSON Web Key Set, read [Navigating RS256 and JWKS](https://auth0.com/blog/navigating-rs256-and-jwks/).

### Configure Authenticated Routes

Then use it to secure your API endpoints like so:

```php
// Require composer autoloader
require __DIR__ . '/vendor/autoload.php';

// Read .env
try {
  $dotenv = new Dotenv\Dotenv(__DIR__);
  $dotenv->load();
} catch(InvalidArgumentException $ex) {
  // Ignore if no dotenv
}

$app = new \App\Main();

// Create Router instance
$router = new \Bramus\Router\Router();

// Activate CORS
function sendCorsHeaders() {
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Headers: Authorization");
  header("Access-Control-Allow-Methods: GET,HEAD,PUT,PATCH,POST,DELETE");
}

$router->options('/.*', function() {
    sendCorsHeaders();
});

sendCorsHeaders();

// Check JWT on /secured routes
$router->before('GET', '/api/private/.*', function() use ($app) {

  $requestHeaders = apache_request_headers();

  if (!isset($requestHeaders['authorization']) && !isset($requestHeaders['Authorization'])) {
      header('HTTP/1.0 401 Unauthorized');
      echo "No token provided.";
      exit();
  }

  $authorizationHeader = isset($requestHeaders['authorization']) ?? $requestHeaders['Authorization']; // PHP 7 null coalescing operator is used here

  if ($authorizationHeader == null) {
    header('HTTP/1.0 401 Unauthorized');
    echo "No authorization header sent";
    exit();
  }

  $authorizationHeader = str_replace('bearer ', '', $authorizationHeader);
  $token = str_replace('Bearer ', '', $authorizationHeader);

  try {
      $app->setCurrentToken($token);
  }
  catch(\Auth0\SDK\Exception\CoreException $e) {
    header('HTTP/1.0 401 Unauthorized');
    echo $e;
    exit();
  }

});
```

Once a user hits any endpoint which includes `api/private`, a valid JWT `access_token` will be required before the resource can be released. With this in place, private routes can be defined. For example,

```php
$router->get('/api/private/ping', function() use ($app){
    echo json_encode($app->privatePing());
});
```

### More Resources

That's it! We have an authenticated PHP API with protected routes. To learn more, check out the following resources:

* [Why You Should Always Use Access Tokens to Secure an API](https://auth0.com/blog/why-should-use-accesstokens-to-secure-an-api/)
* [Navigating RS256 and JWKS](https://auth0.com/blog/navigating-rs256-and-jwks/)
* [Access Token](https://auth0.com/docs/tokens/access-token)
* [Verify Access Tokens](https://auth0.com/docs/api-auth/tutorials/verify-access-token)
* [Call APIs from Client-side Web Apps](https://auth0.com/docs/api-auth/grant/implicit)
* [How to implement the Implicit Grant](https://auth0.com/docs/api-auth/tutorials/implicit-grant)
* [Auth0.js Documentation](https://auth0.com/docs/libraries/auth0js)
* [OpenID Standard Claims](https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims)