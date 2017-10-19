## <span id="securing-python-apis"></span> Securing Python APIs with Auth0

Securing Python APIs with Auth0 is very easy and brings a lot of great features to the table. With Auth0, we only have to write a few lines of code to get:

- A solid [identity management solution](https://auth0.com/user-management), including [single sign-on](https://auth0.com/docs/sso/single-sign-on)
- [User management](https://auth0.com/docs/user-profile)
- Support for [social identity providers (like Facebook, GitHub, Twitter, etc.)](https://auth0.com/docs/identityproviders)
- [Enterprise identity providers (Active Directory, LDAP, SAML, etc.)](https://auth0.com/enterprise)
- Our [own database of users](https://auth0.com/docs/connections/database/mysql)

For example, to secure Python APIs written with Flask, we can simply create a `requires_auth` decorator:

```python
# Format error response and append status code

def get_token_auth_header():
    """Obtains the access token from the Authorization Header
    """
    auth = request.headers.get("Authorization", None)
    if not auth:
        raise AuthError({"code": "authorization_header_missing",
                        "description":
                            "Authorization header is expected"}, 401)

    parts = auth.split()

    if parts[0].lower() != "bearer":
        raise AuthError({"code": "invalid_header",
                        "description":
                            "Authorization header must start with"
                            " Bearer"}, 401)
    elif len(parts) == 1:
        raise AuthError({"code": "invalid_header",
                        "description": "Token not found"}, 401)
    elif len(parts) > 2:
        raise AuthError({"code": "invalid_header",
                        "description":
                            "Authorization header must be"
                            " Bearer token"}, 401)

    token = parts[1]
    return token

def requires_auth(f):
    """Determines if the access token is valid
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = get_token_auth_header()
        jsonurl = urlopen("https://"+AUTH0_DOMAIN+"/.well-known/jwks.json")
        jwks = json.loads(jsonurl.read())
        unverified_header = jwt.get_unverified_header(token)
        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == unverified_header["kid"]:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"]
                }
        if rsa_key:
            try:
                payload = jwt.decode(
                    token,
                    rsa_key,
                    algorithms=ALGORITHMS,
                    audience=API_AUDIENCE,
                    issuer="https://"+AUTH0_DOMAIN+"/"
                )
            except jwt.ExpiredSignatureError:
                raise AuthError({"code": "token_expired",
                                "description": "token is expired"}, 401)
            except jwt.JWTClaimsError:
                raise AuthError({"code": "invalid_claims",
                                "description":
                                    "incorrect claims,"
                                    "please check the audience and issuer"}, 401)
            except Exception:
                raise AuthError({"code": "invalid_header",
                                "description":
                                    "Unable to parse authentication"
                                    " token."}, 400)

            _app_ctx_stack.top.current_user = payload
            return f(*args, **kwargs)
        raise AuthError({"code": "invalid_header",
                        "description": "Unable to find appropriate key"}, 400)
    return decorated
```

Then use it in our endpoints:

```python
# Controllers API

# This doesn't need authentication
@app.route("/ping")
@cross_origin(headers=['Content-Type', 'Authorization'])
def ping():
    return "All good. You don't need to be authenticated to call this"

# This does need authentication
@app.route("/secured/ping")
@cross_origin(headers=['Content-Type', 'Authorization'])
@requires_auth
def secured_ping():
    return "All good. You only get this message if you're authenticated"
```

[To learn more about securing *Python APIs* with Auth0, take a look at this tutorial](https://auth0.com/docs/quickstart/backend/python). Alongside with tutorials for backend technologies (like Python, Java, and PHP), [the *Auth0 Docs* webpage also provides tutorials for *Mobile/Native apps* and *Single-Page applications*](https://auth0.com/docs).
