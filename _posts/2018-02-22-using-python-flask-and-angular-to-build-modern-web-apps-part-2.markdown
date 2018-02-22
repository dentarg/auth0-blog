---
layout: post
title: "Using Python, Flask, and Angular to Build Modern Web Apps - Part 2"
description: "In this series, you will learn how to create modern web applications with Python, Flask, and Angular."
longdescription: "In this series, you will learn how to create modern web applications with Python, Flask, and Angular. You will create a SPA and a backend API to expose exams and questions so users can test their knowledge regarding different technologies."
date: 2018-02-21 08:30
category: Technical Guide, Python
author:
  name: "Bruno Krebs"
  url: "https://twitter.com/brunoskrebs"
  mail: "bruno.krebs@gmail.com"
  avatar: "https://twitter.com/brunoskrebs/profile_image?size=original"
design:
  bg_color: "#4A4A4A"
  image: https://cdn.auth0.com/blog/python-restful/logo.png
tags:
- python
- flask
- sqlalchemy
- angular
- typescript
- auth0
related:
- 2017-09-28-developing-restful-apis-with-python-and-flask
- 2017-11-09-sqlalchemy-orm-tutorial-for-python-developers
---

**TL;DR:** In this series, you will learn how to create modern web applications with Python, Flask, and Angular. You will use this stack to build a SPA and a backend API to expose exams and questions so users can test their knowledge regarding different technologies. [In this GitHub repository](https://github.com/auth0-blog/online-exam/), you can find the final code created throughout the first part of the series.

---

## What You Will Build

In this series, you will use Python, Flask, and Angular to build a web application based on a modern architecture. With Angular, you will build a SPA (Single Page App) that allows users to browse through exams and questions. These users, when authenticated, will be able to test their knowledge regarding a specific topic by choosing one of the multiple choices that a question exposes. Then, when your users submit their answers, your backend will check if they are right or wrong, record the result, and send back this result to users.

In this part of the series, you will start by configuring Auth0 as the identity management system of your app. You will configure an Auth0 API to represent and secure your Flask application and you will configure an Auth0 Client to represent and secure your Angular SPA. After securing your app with Auth0, you are going to enhance the application to allow users to test their knowledge.

## Managing Identity with Auth0

Instead of investing time to develop rudimentary authetication mechanisms to manage the identity of your users, you are going to use Auth0. For startup projects like this one, [the free tier provided by Auth0](https://auth0.com/pricing) is more than enough. Besides being free, by choosing Auth0, you will get a modern, easy to use, and reliable service capable of integrating with tons of different social identity providers (e.g. Facebook, Google, Twitter, etc). Also, if you ever need to integrate with enterprise identity providers using protocols like [OpenID Connect](https://auth0.com/docs/protocols/oidc), [SAML](https://auth0.com/docs/protocols/saml), and [WS-Federation](https://auth0.com/docs/protocols/ws-fed), don't worry, Auth0 got you covered.

That is, Auth0 can help you focus on what matters the most to you, the special features of your product. In addition, Auth0 can improve your product's security with state-of-the-art features like [passwordless](https://auth0.com/passwordless), [breached password surveillance](https://auth0.com/breached-passwords), and [multifactor authentication](https://auth0.com/multifactor-authentication).

### Securing Flask Apps with Auth0

To integrate Auth0 into your Flask application, you will need to create an Auth0 API. If you haven't done so yet, you can <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">sign up for a free Auth0 account now</a>. After creating your account, head to [the APIs page on your Auth0 dashboard](https://manage.auth0.com/#/apis) and click on the *Create API* button. When clicked, this button will bring up a form where Auth0 will ask you for three properties. The following list summarizes these properties and how to fill them:

1. *Name*: This is a friendly name to remind you what this API is about. Here, you can enter something like "Online Exam".
2. *Identifier*: This is the logical identifier (a.k.a. audience) of your API. Usually, developers use an URL to represent their APIs. Although this is not mandatory, it is a good approach. So, in this field, enter something like `https://online-exam.digituz.com.br`.
3. *Signing Algorithm*: In this field, you will have to select between two strategies: `RS256` (the default one) and `HS256`. The best option is to stick with the default one (`RS256`). If you are curious, you can [check this thread to understand the difference between them](https://community.auth0.com/answers/6945/view).

When you finish filling up this form, you can hit the *Create* button. This will redirect you to a tab called *Quick Start* inside your new Auth0 API. Leave this page opened in your browser and head back to your Flask project (i.e. to the `backend`directory inside the project root).

Back in your Flask project, you will need to create a [Python decorator](https://realpython.com/blog/python/primer-on-python-decorators/) to wrap the endpoints that must be secured. To define this decorator, create a new file called `auth.py` inside the `./backend/src/` directory. Then, inside this file, paste the following code:

```python
import json
from flask import request, _request_ctx_stack
from functools import wraps
from jose import jwt
from urllib.request import urlopen


AUTH0_DOMAIN = 'bk-samples.auth0.com'
ALGORITHMS = ['RS256']
API_AUDIENCE = 'https://online-exam.digituz.com.br'


class AuthError(Exception):
    def __init__(self, error, status_code):
        self.error = error
        self.status_code = status_code


def get_token_auth_header():
    """Obtains the Access Token from the Authorization Header
    """
    auth = request.headers.get('Authorization', None)
    if not auth:
        raise AuthError({
            'code': 'authorization_header_missing',
            'description': 'Authorization header is expected.'
        }, 401)

    parts = auth.split()

    if parts[0].lower() != 'bearer':
        raise AuthError({
            'code': 'invalid_header',
            'description': 'Authorization header must start with "Bearer".'
        }, 401)

    elif len(parts) == 1:
        raise AuthError({
            'code': 'invalid_header',
            'description': 'Token not found.'
        }, 401)

    elif len(parts) > 2:
        raise AuthError({
            'code': 'invalid_header',
            'description': 'Authorization header must be bearer token.'
        }, 401)

    token = parts[1]
    return token


def requires_auth(f):
    """Determines if the Access Token is valid
    """

    @wraps(f)
    def decorated(*args, **kwargs):
        token = get_token_auth_header()
        jsonurl = urlopen(f'https://{AUTH0_DOMAIN}/.well-known/jwks.json')
        jwks = json.loads(jsonurl.read())
        unverified_header = jwt.get_unverified_header(token)
        rsa_key = {}
        for key in jwks['keys']:
            if key['kid'] == unverified_header['kid']:
                rsa_key = {
                    'kty': key['kty'],
                    'kid': key['kid'],
                    'use': key['use'],
                    'n': key['n'],
                    'e': key['e']
                }
        if rsa_key:
            try:
                payload = jwt.decode(
                    token,
                    rsa_key,
                    algorithms=ALGORITHMS,
                    audience=API_AUDIENCE,
                    issuer='https://' + AUTH0_DOMAIN + '/'
                )

            except jwt.ExpiredSignatureError:
                raise AuthError({
                    'code': 'token_expired',
                    'description': 'Token expired.'
                }, 401)

            except jwt.JWTClaimsError:
                raise AuthError({
                    'code': 'invalid_claims',
                    'description': 'Incorrect claims. Please, check the audience and issuer.'
                }, 401)
            except Exception:
                raise AuthError({
                    'code': 'invalid_header',
                    'description': 'Unable to parse authentication token.'
                }, 400)

            _request_ctx_stack.top.current_user = payload
            return f(*args, **kwargs)

        raise AuthError({
            'code': 'invalid_header',
            'description': 'Unable to find the appropriate key.'
        }, 400)

    return decorated
```

Although lengthy, this code is quite simple. Here is a list to explain what this new module does:

- First, it defines three constants: `AUTH0_DOMAIN`, `ALGORITHMS`, and `API_AUDIENCE`. Your project will use these constants to communicate with Auth0 to validate users (tokens). **Note that** you will have to replace the value of these constants with the details of your Auth0 account.
- Second, it defines a class called `AuthError`. This class exists to represent errors originated in this module.
- Third, it defines a function called `get_token_auth_header`. Your app will use this function to read `Authorization` headers to fetch their [access tokens](https://auth0.com/docs/tokens/access-token).
- Lastly, this module defines the `requires_auth` decorator. This decorator might look complex but, if you analyze carefully, you will see that all it does is to fetch the correct public key from Auth0 to validate tokens. Instead of sharing static public keys, Auth0 uses the JWK specification to represent the cryptographic keys used for signing tokens. [You can learn more about this subject here](https://auth0.com/blog/navigating-rs256-and-jwks/).

You probably noticed that the decorator that your created is using a module called `jwt` that is not available to your project. To install this dependency, issue the following command inside the `backend` directory:

```bash
pipenv install python-jose-cryptodome
```

Now, to use this decorator, you can update the `main.py` file as follows:

```python
# coding=utf-8

# ... other import statements ...
from .auth import AuthError, requires_auth

# ... create Flask app, schema generation ...

# ... get_exams implementation ...

@app.route('/exams', methods=['POST'])
@requires_auth
def add_exam():
    # ... implementation ...

@app.errorhandler(AuthError)
def handle_auth_error(ex):
    response = jsonify(ex.error)
    response.status_code = ex.status_code
    return response
```

Note that you are securing only the `add_exam` function (i.e. the endpoint that accepts `POST` requests). The endpoint that retrieves exams will remain public so visitors can see what exams your application contains. Another important feature added by the new version of this file is the `handle_auth_error` function. By using the `@app.errorhandler` decorator, you are configuring your Flask application to call this function when `AuthErrors` are raised. This error handler makes errors look nice and easier to fix as they simply return a JSON object with the details.

That's it! You Flask application is now secured with Auth0. To test it, you can issue the following commands:

```bash
# run the app in the background
./bootstrap &

# good to go, endpoint not secured
curl http://0.0.0.0:5000/exams

# unauthorized, endpoint secured and no bearer
curl -X POST -H 'Content-Type: application/json' -d '{
  "title": "TypeScript Advanced Exam",
  "description": "Tricky questions about TypeScript."
}' http://0.0.0.0:5000/exams
```

Now, to get an access token to test the secured endpoint, you will need to copy a command from your Auth0 API. So, head back to the page that you left opened, then click on the *Test* tab, and copy the first `curl` command showed there. The code snippet below shows how to use this command to fetch the access token and how to send it to your Flask application (replace the first command with the one you copied from your Auth0 API):

```bash
# retrieve token from Auth0
curl -X POST -H 'Content-Type: application/json' -d '{
    "client_id":"Rp4He7RGWAnMfY34SxwnWHpw7gjdOOPI","client_secret":"2cCS521K7k2Btc434VMBmIBTeLbRfw1tvEKw6l8DYt9OvIEYHUqgdZPioM_rBKsx","audience":"https://online-exam.digituz.com.br","grant_type":"client_credentials"
}' https://bk-samples.auth0.com/oauth/token

# copy token into env variable
JWT="aaa.bbb.ccc"

# create new exam
curl -X POST -H 'Content-Type: application/json' -H 'Authorization: Bearer '$JWT -d '{
  "title": "TypeScript Advanced Exam",
  "description": "Tricky questions about TypeScript."
}' http://0.0.0.0:5000/exams
```

Hurray! You have a Flask application secured with a modern identity management solution. Time to save your progress:

```bash
git add . && git commit -m "securing Flask with Auth0"
```

### Securing Angular Apps with Auth0

