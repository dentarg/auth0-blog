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

```bash
# good to go, endpoint not secured
curl http://0.0.0.0:5000/exams

# unauthorized, endpoint secured and no bearer
curl -X POST -H 'Content-Type: application/json' -d '{
  "title": "TypeScript Advanced Exam",
  "description": "Tricky questions about TypeScript."
}' http://0.0.0.0:5000/exams

# retrieve token from Auth0
curl -X POST -H 'Content-Type: application/json' -d '{
    "client_id":"Rp4He7RGWAnMfY26SxwnWHpw7gjdTZZG","client_secret":"2kCZ621Q7t1Ptc434VMBmLBTeLbRfw1tvEKw6l9DYt9OvIEYHUqgdZPurM_rKBsx","audience":"https://online-exam.digituz.com.br","grant_type":"client_credentials"
}' https://bk-samples.auth0.com/oauth/token

# copy token into env variable
JWT="aaa.bbb.ccc"

# create new exam
curl -X POST -H 'Content-Type: application/json' -H 'Authorization: Bearer '$JWT -d '{
  "title": "TypeScript Advanced Exam",
  "description": "Tricky questions about TypeScript."
}' http://0.0.0.0:5000/exams
```

### Securing Angular Apps with Auth0

