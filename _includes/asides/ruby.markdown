## Aside: Securing Ruby APIs with Auth0

Securing Ruby APIs with Auth0 is not hard and brings a lot of great features to the table. With Auth0, we only have to write a few lines of code to get:

- A solid [identity management solution](https://auth0.com/user-management), including [single sign-on](https://auth0.com/docs/sso/single-sign-on)
- [User management](https://auth0.com/docs/user-profile)
- Support for [social identity providers (like Facebook, GitHub, Twitter, etc.)](https://auth0.com/docs/identityproviders)
- [Enterprise identity providers (Active Directory, LDAP, SAML, etc.)](https://auth0.com/enterprise)
- Our [own database of users](https://auth0.com/docs/connections/database/mysql)

### Sign Up for Auth0

You'll need an [Auth0](https://auth0.com) account to manage authentication. You can sign up for a <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">free account here</a>. Next, set up an Auth0 API.

### Set Up an API

1. Go to [**APIs**](https://manage.auth0.com/#/apis) in your Auth0 dashboard and click on the "Create API" button. Enter a name for the API. Set the **Identifier** to a URL(_existent or non-existent URL_). The **Signing Algorithm** should be `RS256`.

![Create API on Auth0 dashboard](https://cdn2.auth0.com/docs/media/articles/api-auth/create-api.png)
_Create API on Auth0 dashboard_

We're now ready to implement Auth0 authentication on our Ruby backend API.

### Dependencies and Setup

Install the following packages via bundler like so:

```bash
gem `jwt`
bundle install
```

### JWT Verification Service

```ruby

require 'net/http'
require 'uri'

class JsonWebToken
  def self.verify(token)
    JWT.decode(token, nil,
               true, # Verify the signature of this token
               algorithm: 'RS256',
               iss: 'AUTH0_DOMAIN',
               verify_iss: true,
               # AUTHO_API_AUDIENCE is the identifier for the API set up in the Auth0 dashboard
               aud: AUTHO_API_AUDIENCE,
               verify_aud: true) do |header|
      jwks_hash[header['kid']]
    end
  end

  def self.jwks_hash
    jwks_raw = Net::HTTP.get URI("https://{AUTH0_DOMAIN}/.well-known/jwks.json")
    jwks_keys = Array(JSON.parse(jwks_raw)['keys'])
    Hash[
      jwks_keys
      .map do |k|
        [
          k['kid'],
          OpenSSL::X509::Certificate.new(
            Base64.decode64(k['x5c'].first)
          ).public_key
        ]
      end
    ]
  end
end
```

Change the `AUTH0_DOMAIN` variable to your Auth0 domain and set the `AUTH0_API_AUDIENCE` to the **Identifier** you chose while creating the API from the Auth0 dashboard.

> **Note:** To learn more about RS256 and JSON Web Key Set, read [Navigating RS256 and JWKS](https://auth0.com/blog/navigating-rs256-and-jwks/).

### Configure Authenticated Routes

Then use it to secure your API endpoints like so:

```ruby
def authenticate!
  # Extract <token> from the 'Bearer <token>' value of the Authorization header
  supplied_token = String(request.env['HTTP_AUTHORIZATION']).slice(7..-1)

  @auth_payload, @auth_header = JsonWebToken.verify(supplied_token)

rescue JWT::DecodeError => e
  halt 401, json(error: e.class, message: e.message)
end

before do
  authenticate!
end

get '/restricted_resource' do
  json( message: 'Access Granted', allowed_scopes: String(@auth_payload['scope']).split(' ') )
end
```

Once a user hits the endpoint `/restricted_resource`, a valid JWT `access_token` will be required before the resource can be released. With this in place, private routes can be defined.

### Configure Scopes

To look for a particular `scope` in an `access_token`, provide an array of required scopes and check if they are present in the payload of the token.

In this example the `SCOPES` array for the given key `/restricted_resource` is intersected with the `scopes` contained in the payload of the `access_token` to determine if it contains one or more items from the array.

```ruby
SCOPES = {
  '/restricted_resource' => ['read:messages'],
  '/another_resource'    => ['some:scope', 'some:other_scope']
}

def authenticate!
  # Extract <token> from the 'Bearer <token>' value of the Authorization header
  supplied_token = String(request.env['HTTP_AUTHORIZATION']).slice(7..-1)

  @auth_payload, @auth_header = JsonWebToken.verify(supplied_token)

  halt 403, json(error: 'Forbidden', message: 'Insufficient scope') unless scope_included

rescue JWT::DecodeError => e
  halt 401, json(error: e.class, message: e.message)
end

def scope_included
  # The intersection of the scopes included in the given JWT and the ones in the SCOPES hash needed to access
  # the PATH_INFO, should contain at least one element
  (String(@auth_payload['scope']).split(' ') & (SCOPES[request.env['PATH_INFO']])).any?
end
```

With this configuration in place, only `access_tokens` which have a scope of `read:messages` will be allowed to access this endpoint.

### More Resources

That's it! We have an authenticated Ruby API with protected routes. To learn more, check out the following resources:

* [Why You Should Always Use Access Tokens to Secure an API](https://auth0.com/blog/why-should-use-accesstokens-to-secure-an-api/)
* [Navigating RS256 and JWKS](https://auth0.com/blog/navigating-rs256-and-jwks/)
* [Access Token](https://auth0.com/docs/tokens/access-token)
* [Verify Access Tokens](https://auth0.com/docs/api-auth/tutorials/verify-access-token)
* [Call APIs from Client-side Web Apps](https://auth0.com/docs/api-auth/grant/implicit)
* [How to implement the Implicit Grant](https://auth0.com/docs/api-auth/tutorials/implicit-grant)
* [Auth0.js Documentation](https://auth0.com/docs/libraries/auth0js)
* [OpenID Standard Claims](https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims)