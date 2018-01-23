## Aside: Securing Go APIs with Auth0

Securing Go APIs with Auth0 is really very easy. No sweating. No hitting of heads on the wall. Just straight-forward. With Auth0, we only have to write a few lines of code to get:

- A solid [identity management solution](https://auth0.com/user-management), including [single sign-on](https://auth0.com/docs/sso/single-sign-on)
- [User management](https://auth0.com/docs/user-profile)
- Support for [social identity providers (like Facebook, GitHub, Twitter, etc.)](https://auth0.com/docs/identityproviders)
- [Enterprise identity providers (Active Directory, LDAP, SAML, etc.)](https://auth0.com/enterprise)
- Our [own database of users](https://auth0.com/docs/connections/database/mysql)

### Sign Up for Auth0

You'll need an [Auth0](https://auth0.com) account to manage authentication. You can sign up for a <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">free account here</a>. Next, set up an Auth0 API.

### Set Up an API

1. Go to [**APIs**](https://manage.auth0.com/#/apis) in your Auth0 dashboard and click on the **Create API** button. Enter a name for the API. Set the **Identifier** to a URL(_existent or non-existent URL_). The **Signing Algorithm** should be `RS256`.

![Create API on Auth0 dashboard](https://cdn2.auth0.com/docs/media/articles/api-auth/create-api.png)
_Create API on Auth0 dashboard_

We're now ready to implement Auth0 authentication on our Go backend API.

### Dependencies and Setup

Install the following packages like so:

```bash
go get "gopkg.in/square/go-jose.v2"
go get "github.com/auth0-community/go-auth0"
go get "github.com/gorilla/mux"
```

### JWT Verification Service

```go
// main.go

const JWKS_URI = "{AUTH0_DOMAIN}/.well-known/jwks.json" // e.g https://kabiyesi.auth0.com
const AUTH0_API_ISSUER = "AUTH0_DOMAIN" // e.g https://kabiyesi.auth0.com

var AUTH0_API_AUDIENCE = []string{"API_AUDIENCE"} // e.g. https://api.mysite.com

func checkJwt(h http.Handler) http.Handler {
  return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    client := auth0.NewJWKClient(auth0.JWKClientOptions{URI: JWKS_URI})
    audience := AUTH0_API_AUDIENCE

    configuration := auth0.NewConfiguration(client, audience, AUTH0_API_ISSUER, jose.RS256)
    validator := auth0.NewValidator(configuration)

    token, err := validator.ValidateRequest(r)

    if err != nil {
      fmt.Println("Token is not valid or missing token")

      response := Response{
        Message: "Missing or invalid token.",
      }

      w.WriteHeader(http.StatusUnauthorized)
      json.NewEncoder(w).Encode(response)

    } else {
      h.ServeHTTP(w, r)
    }
  })
}
```

Change the `AUTH0_DOMAIN` variable to your Auth0 domain and set the `API_AUDIENCE` to the **Identifier** you chose while creating the API from the Auth0 dashboard.

> **Note:** To learn more about RS256 and JSON Web Key Set, read [Navigating RS256 and JWKS](https://auth0.com/blog/navigating-rs256-and-jwks/).

### Configure Scopes

The `checkJwt` middleware above verifies that the `access_token` included in the request is valid; however, it doesn't yet include any mechanism for checking that the token has the sufficient scope to access the requested resources.

Scopes provide a way for you to define which resources should be accessible by the user holding a given `access_token`. For example, you might choose to permit `read` access to a `messages` resource if a user has a **manager** access level, or a `write` access to that resource if they are an administrator.

To configure scopes in your Auth0 dashboard, navigate to your API and choose the **Scopes** tab. In this area you can apply any scopes you wish, including one called `read:messages`, which will be used in this example.

Let's extend our backend to check and ensure the `access_token` has the correct scope before returning a successful response.

```go
// main.go

func checkScope(r *http.Request, validator *auth0.JWTValidator, token *jwt.JSONWebToken) bool {
  claims := map[string]interface{}{}
  err := validator.Claims(r, token, &claims)

  if err != nil {
    fmt.Println(err)
    return false
  }

  if strings.Contains(claims["scope"].(string), "read:messages") {
    return true
  } else {
    return false
  }
}
```

Next, let's implement this `checkScope` function in our middleware.

```go
// main.go

func checkJwt(h http.Handler) http.Handler {
  return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    // Validate the access_token
    if err != nil {
      // Handle invalid token case
    } else {
      // Ensure the token has the correct scope
      result := checkScope(r, validator, token)
      if result == true {
        // If the token is valid and we have the right scope, we'll pass through the middleware
        h.ServeHTTP(w, r)
      } else {
        response := Response{
          Message: "You do not have the read:messages scope.",
      }
        w.WriteHeader(http.StatusUnauthorized)
        json.NewEncoder(w).Encode(response)
      }
    }
  })
}
```

### Configure Authenticated Routes

Then use it to secure your API endpoints like so:

```go
// main.go

func main() {
  r := mux.NewRouter()

  // This route is always accessible
  r.Handle("/api/public", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    response := Response{
      Message: "Hello from a public endpoint! You don't need to be authenticated to see this.",
    }
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(response)
  }))

  // This route is only accessible if the user has a valid access_token with the read:messages scope
  // We are wrapping the checkJwt middleware around the handler function which will check for a
  // valid token and scope.
  r.Handle("/api/private", checkJwt(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    response := Response{
      Message: "Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.",
    }
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(response)
  })))
}
```

Once a user hits the endpoint `/api/private`, a valid JWT `access_token` will be required and `read:messages` scope before the resource can be released.

### More Resources

That's it! We have an authenticated Go API with protected routes. To learn more, check out the following resources:

* [Why You Should Always Use Access Tokens to Secure an API](https://auth0.com/blog/why-should-use-accesstokens-to-secure-an-api/)
* [Navigating RS256 and JWKS](https://auth0.com/blog/navigating-rs256-and-jwks/)
* [Access Token](https://auth0.com/docs/tokens/access-token)
* [Verify Access Tokens](https://auth0.com/docs/api-auth/tutorials/verify-access-token)
* [Call APIs from Client-side Web Apps](https://auth0.com/docs/api-auth/grant/implicit)
* [How to implement the Implicit Grant](https://auth0.com/docs/api-auth/tutorials/implicit-grant)
* [Auth0.js Documentation](https://auth0.com/docs/libraries/auth0js)
* [OpenID Standard Claims](https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims)