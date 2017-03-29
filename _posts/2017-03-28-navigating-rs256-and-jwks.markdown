---
layout: post
title: "Navigating RS256 and JWKS"
description: "Learn how to start using RS256 for signing your JWTs."
date: 2017-03-28 8:30
category: Technical Guide, Security, JWT
design:
  bg_color: "#222228"
  image: https://cdn.auth0.com/blog/jwtalgos/logo.png
  image_size: "100%"
  image_bg_color: "#222228"
author:
  name: Shawn Meyer
  url: https://twitter.com/sgmeyer
  avatar: https://s.gravatar.com/avatar/0b3b0a5bf530f8c3a1fdee5233979c81?s=200
  mail: sgmeyer@auth0.com
tags:
- jwt
- security
- token
- hs256
- rs256
related:
- 2015-03-31-critical-vulnerabilities-in-json-web-token-libraries
- 2015-12-17-json-web-token-signing-algorithms-overview
- 2016-11-21-building-and-authenticating-nodejs-apps
- 2017-02-23-brute-forcing-hs256-is-possible-the-important-of-using-strong-keys-to-sign-jwts
---

## TL;DR:

When signing your JWTs it is better to use an asymmetric signing algorithm.  Doing so will no longer require sharing a private key across many applications.  Using an algorithm like RS256 and the JWKS endpoint allows your applications to trust the JWTs signed by Auth0.

The code snippets below have been adapted from Auth0's [node-jwks-rsa](https://github.com/auth0/node-jwks-rsa) and [express-jwt](https://github.com/auth0/express-jwt).

Check out the sample [repository](https://github.com/sgmeyer/auth0-node-jwks-rs256).

## RS256 vs HS256

 When creating clients and resources servers (APIs) in Auth0, two algorithms are supported for signing JSON Web Tokens (JWTs): RS256 and HS256.  HS256 is the default for clients and RS256 is the default for APIs.  When building applications, it is important to understand the differences between these two algorithms.  To begin, HS256 generates a symmetric MAC and RS256 generates an asymmetric signature.  Simply put HS256 must share a secret with any client or API that wants to verify the JWT.  Like any other symmetric algorithm, the same secret is used for both signing and verifying the JWT.  This means there is no way to fully guarantee Auth0 generated the JWT as any client or API with the secret could generate a validly signed JWT.  On the other hand, RS256 generates an asymmetric signature,, which means a private key must be used to sign the JWT and a different public key must be used to verify the signature.  Unlike symmetric algorithms, using RS256 offers assurances that Auth0 is the signer of a JWT since Auth0 is the only party with the private key.

## Verifying RS256

Due to the symmetric nature of HS256 we favor the use of RS256 for signing your JWTs, especially for APIs with 3rd party clients.  However, this decision comes with some extra steps for verifying the signature of your JWTs.  Auth0 uses the [JWK](https://tools.ietf.org/html/rfc7517) specification to represent the cryptographic keys used for signing tokens.  This spec defines two high level data structures: JWKS and JWK.  Here are the definitions directly from the specification:

> JSON Web Key (JWK) 
>
> A JSON object that represents a cryptographic key.  The members of the object represent properties of the key, including its value. 

> JWK Set 
>
> A JSON object that represents a set of JWKs.  The JSON object MUST have a "keys" member, which is an array of JWKs. 

At the most basic level, the JWKS is a set of keys containing the public keys that should be used to verify any JWT issued by the authorization server.  Auth0 exposes a JWKS endpoint for each tenant, which is found at _https://your-tenant.auth0.com/.well-known/jwks.json_.  This endpoint will contain the JWK used to sign all Auth0 issued JWTs for this tenant.  Here is an example of the JWKS used by a demo tenant.

```
{
"keys": [
  {
    "alg": "RS256",
    "kty": "RSA",
    "use": "sig",
    "x5c": [
      "MIIC+DCCAeCgAwIBAgIJBIGjYW6hFpn2MA0GCSqGSIb3DQEBBQUAMCMxITAfBgNVBAMTGGN1c3RvbWVyLWRlbW9zLmF1dGgwLmNvbTAeFw0xNjExMjIyMjIyMDVaFw0zMDA4MDEyMjIyMDVaMCMxITAfBgNVBAMTGGN1c3RvbWVyLWRlbW9zLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMnjZc5bm/eGIHq09N9HKHahM7Y31P0ul+A2wwP4lSpIwFrWHzxw88/7Dwk9QMc+orGXX95R6av4GF+Es/nG3uK45ooMVMa/hYCh0Mtx3gnSuoTavQEkLzCvSwTqVwzZ+5noukWVqJuMKNwjL77GNcPLY7Xy2/skMCT5bR8UoWaufooQvYq6SyPcRAU4BtdquZRiBT4U5f+4pwNTxSvey7ki50yc1tG49Per/0zA4O6Tlpv8x7Red6m1bCNHt7+Z5nSl3RX/QYyAEUX1a28VcYmR41Osy+o2OUCXYdUAphDaHo4/8rbKTJhlu8jEcc1KoMXAKjgaVZtG/v5ltx6AXY0CAwEAAaMvMC0wDAYDVR0TBAUwAwEB/zAdBgNVHQ4EFgQUQxFG602h1cG+pnyvJoy9pGJJoCswDQYJKoZIhvcNAQEFBQADggEBAGvtCbzGNBUJPLICth3mLsX0Z4z8T8iu4tyoiuAshP/Ry/ZBnFnXmhD8vwgMZ2lTgUWwlrvlgN+fAtYKnwFO2G3BOCFw96Nm8So9sjTda9CCZ3dhoH57F/hVMBB0K6xhklAc0b5ZxUpCIN92v/w+xZoz1XQBHe8ZbRHaP1HpRM4M7DJk2G5cgUCyu3UBvYS41sHvzrxQ3z7vIePRA4WF4bEkfX12gvny0RsPkrbVMXX1Rj9t6V7QXrbPYBAO+43JvDGYawxYVvLhz+BJ45x50GFQmHszfY3BR9TPK8xmMmQwtIvLu1PMttNCs7niCYkSiUv2sc2mlq1i3IashGkkgmo="
    ],
    "n": "yeNlzlub94YgerT030codqEztjfU_S6X4DbDA_iVKkjAWtYfPHDzz_sPCT1Axz6isZdf3lHpq_gYX4Sz-cbe4rjmigxUxr-FgKHQy3HeCdK6hNq9ASQvMK9LBOpXDNn7mei6RZWom4wo3CMvvsY1w8tjtfLb-yQwJPltHxShZq5-ihC9irpLI9xEBTgG12q5lGIFPhTl_7inA1PFK97LuSLnTJzW0bj096v_TMDg7pOWm_zHtF53qbVsI0e3v5nmdKXdFf9BjIARRfVrbxVxiZHjU6zL6jY5QJdh1QCmENoejj_ytspMmGW7yMRxzUqgxcAqOBpVm0b-_mW3HoBdjQ",
    "e": "AQAB",
    "kid": "NjVBRjY5MDlCMUIwNzU4RTA2QzZFMDQ4QzQ2MDAyQjVDNjk1RTM2Qg",
    "x5t": "NjVBRjY5MDlCMUIwNzU4RTA2QzZFMDQ4QzQ2MDAyQjVDNjk1RTM2Qg"
  }
]}
```

**Note:** At the time of writing, Auth0 only supports a single JWK for signing, however it is important to assume this endpoint could contain multiple JWKs.  As an example, multiple keys can be found in the JWKS when rotating signing certificates.

The JWKS above contains a single key.  Each property in the key is defined by the JWK specification [RFC 7517 Section 4](https://tools.ietf.org/html/rfc7517#section-4).  We will use these properties to determine which key was used to sign the JWT.  Here is a quick breakdown of what each property represents:

* **alg:** is the algorithm for the key 
* **kty:** is the key type 
* **use:** is how the key was meant to be used.  For the example above `sig` represents `signature`. 
* **x5c:** is the x509 certificate chain 
* **e:**   is the exponent for a standard pem 
* **n:**   is the moduluos for a standard pem 
* **kid:** is the unique identifier for the key
* **x5t:** is the thumbprint of the x.509 cert (SHA-1 thumbprint) 

## Verifying a JWT using the JWKS endpoint

Now that we understand JWKS and the specific properties of each JWK let's put this together and verify a JWT signed by Auth0 with RS256.  In our example we are going to build a first party API for our ficticious company c0der.io.  The API will have a single endpoint returning metadata about our API, which requires a valid JWT.  Ideally your resource server would also validate necessary scopes, however, that is beyond this topic.  We will assume an API and client have been created and we will focus on what happens once our API recieves a request.

**Here are the steps for validating the JWT:**

1. Retrieve the JWKS and filter for potential signing keys.
2. Extract the JWT from the request's authorization header. 
3. Decode the JWT and grab the `kid` property from the header. 
4. Find the signing key in the filtered JWKS with a matching `kid` property. 
5. Using the `x5c` property build a certificate which will be used to verify the JWT signature. 
6. Ensure the JWT contains the expected audience, issuer, expiration, etc. 

> **Note:** There are many good libraries for verifying a JWT.  You can use the curated list to find one for your language at [JWT.io](https://jwt.io/#libraries-io).

Let's jump into some code and see this in action.

## Retrieving the JWK

The first thing we are going to do is grab the key set from the Auth0 JWKS endpoint.  Using `request` we can simply perform a `GET` to retrieve the JSON blob.

```javascript
/**
 * https://github.com/sgmeyer/auth0-node-jwks-rs256/blob/master/src/lib/JwksClient.js#L7-L28
 **/

export class JwksClient {
  constructor(options) {
    this.options = { strictSsl: true, ...options };
  }

  getJwks(cb) {
    request({
      uri: this.options.jwksUri,
      strictSsl: this.options.strictSsl,
      json: true
    }, (err, res) => {
      if (err || res.statusCode < 200 || res.statusCode >= 300) {
        if (res) {
          return cb(new JwksError(res.body && (res.body.message || res.body) || res.statusMessage || `Http Error ${res.statusCode}`));
        }
        return cb(err);
      }

      var jwks = res.body.keys;
      return cb(null, jwks);
    }); 
  }
}

```

After grabbing the JWKS we will filter out all the keys that are not intended for signing a JWT.  This step may seem unneccessary as the Auth0 JWKS endpoint typically contains a signle signing key, however it is good practice to assume multiple keys could be present (i.e. key rotation).

```javascript
export class JwksClient {
  constructor(options) { ... }

  getJwks(cb) { ... }

  /**
   * https://github.com/sgmeyer/auth0-node-jwks-rs256/blob/master/src/lib/JwksClient.js#L30-L58
   **/
  getSigningKeys(cb) {
    const callback = (err, keys) => {
      if (err) {
        return cb(err);
      }

      if (!keys || !keys.length) {
        return cb(new JwksError('The JWKS endpoint did not contain any keys'));
      }

      const signingKeys = keys
        .filter(key => key.use === 'sig' // JWK property `use` determines the JWK is for signing
                    && key.kty === 'RSA' // We are only supporting RSA (RS256)
                    && key.kid           // The `kid` must be present to be useful for later
                    && ((key.x5c && key.x5c.length) || (key.n && key.e)) // Has useful public keys
        ).map(key => {
          return { kid: key.kid, nbf: key.nbf, publicKey: certToPEM(key.x5c[0]) };
        });

      // If at least one signing key doesn't exist we have a problem... Kaboom.
      if (!signingKeys.length) {
        return cb(new JwksError('The JWKS endpoint did not contain any signing keys'));
      }

      // Returns all of the available signing keys.
      return cb(null, signingKeys);
    };

    this.getJwks(callback);
  }
}
```

Quick recap, we have retrieved the set of keys (JWKS) from Auth0 and we have filtered out all keys that are not intended for signing a JWT with the keytype of RSA.  As an additional measure, we filtered out any key missing a public key and a `kid` property.  This step is important as later we will need to use the `kid` property to find the exact key necessary to verify the JWT.

## Finding the exact signing key

Continuing with our example, we will add an additional method to `JwksClient` called `getSigningKey` taking a key identifier (`kid`) as an argument and return the expected key (JWK) used to sign the JWT.   If a JWK is not found, then an error must be thrown.  This means the JWT supplied with the request was signed with a key that is not supported by Auth0.  This should ultimately be treated as a 401 Unauthorized.  If a matching key is found, then that key will be passed as an argument to the callback.

```javascript
export class JwksClient {
  constructor(options) {
    this.options = { strictSsl: true, ...options };
  }

  getJwks(cb) { ... }

  getSigningKeys(cb) { ... }

  /**
   * https://github.com/sgmeyer/auth0-node-jwks-rs256/blob/master/src/lib/JwksClient.js#L67-L84
   **/
  getSigningKey = (kid, cb) => {
    const callback = (err, keys) => {
      if (err) {
        return cb(err);
      }

      const signingKey = keys.find(key => key.kid === kid);

      if (!signingKey) {
        var error = new SigningKeyNotFoundError(`Unable to find a signing key that matches '${kid}'`);
        return cb(error);
      }

      return cb(null, signingKey)
    };

    this.getSigningKeys(callback);
  }
```

So far we have built a client that can be used to retrieve the JWKS and fide the signing key using the value of the `kid` property.  At this point, we have neither verified the JWT nor extracted it from the request.  

> **Note:** As an optimization for production it would be wise to implement a caching mechanism for the JWKS or keys so that each request does not require a call to the JWKS endpoint.

## Creating a Signing Secret Wrapper

Before we move on to processing the JWT we want to create a quick wrapper for the `JwksClient` that returns a method that will eventually hand off the key we need to verify the JWT.  This class is a bit specific to the node async model, however it is necessary for the final step when we tie together the final middleware.

```javascript
/**
 * https://github.com/sgmeyer/auth0-node-jwks-rs256/blob/master/src/lib/expressJwtSecret.js#L4-L38
 **/
const handleSigningKeyError = (err, cb) => {
  // If we didn't find a match, can't provide a key.
  if (err && err.name === 'SigningKeyNotFoundError') {
    return cb(null);
  }

  // Any other error we will bubble up.
  if (err) {
    return cb(err);
  }
};

export default (options) => {
  if (options === null || options === undefined) {
    throw new ArgumentError('An options object must be provided when initializing expressJwtSecret');
  }

  const client = new JwksClient(options);
  const onError = handleSigningKeyError;

  return function secretProvider(req, header, payload, cb) {
    // Only RS256 is supported.
    if (!header || header.alg !== 'RS256') {
      return cb(null, null);
    }

    client.getSigningKey(header.kid, (err, key) => {
      if (err) {
        return onError(err, (newError) => cb(newError, null));
      }

      // Provide the key.
      return cb(null, key.publicKey || key.rsaPublicKey);
    });
  };
};
```

## Grabbing the JWT from the Request

Now we need to move on to extract the JWT from the request.  Most APIs expect the JWT is sent as a [Bearer Token](https://tools.ietf.org/html/rfc6750) in the authorization header or as a URL parameter.  Now we are going to start building an Express middleware that will extract the JWT, create a signing secret, and verify the token using the `jsonwebtoken` module.  We will start by creating a file called `expressJWt.js` and extract the JWT from the request.

```javascript
export default (options) => {

  var middleware = (req, res, next) => {
    // https://github.com/sgmeyer/auth0-node-jwks-rs256/blob/master/src/middleware/expressJwt.js#L12-L23
    var authHeader = req.headers.authorization;
    var parts = authHeader.split(' ');

    if (parts.length != 2) {
      throw new UnauthorizedError('credentials_required', { message: 'No authorization token was found' });
    }

    var scheme = parts[0];
    if(!/^Bearer$/i.test(scheme)) {

      throw new UnauthorizedError('credentials_bad_scheme', { message: 'Format is Authorization: Bearer [token]' });
    }
  }

  return middleware;
}

```

> **Note:** It is important to differentiate between verifying and decoding a token.  Decoding simply means to base64url decode the header and payload.  This step is not concerned with validating the signature, audience, expiration, etc.  Verifying the token is the process of ensuring the token's signature, but also the audience, expiration, etc are valid.

At this point the middleware is pretty boring.  It simply parses the authorization header for the format `Authorization: Bearer [token]`.  If the authorization header doesn't exist, is empty, or does not fit the format the we will throw an `UnauthorizedError` which later is treated as a `401 Unauthorized` response.  If the header does meet the criteria the JWT is pulled from the authorization header.

## Decoding the JWT 

Now that we have our hands on the JWT we need to decode the token.  This will be important later when we want to grab the `kid` property to find the key we need to verify the signature.  Recall we can decode the JWT as it is simply base 64 url encoded.  To do this we will use the `jsonwebtoken` node module.  If you are interested in learning more about how a JWT is constructed check out our [blog post](https://auth0.com/blog/brute-forcing-hs256-is-possible-the-importance-of-using-strong-keys-to-sign-jwts/).

```javascript
export default (options) => {

  var middleware = (req, res, next) => {
    ...

    // https://github.com/sgmeyer/auth0-node-jwks-rs256/blob/master/src/middleware/expressJwt.js#L25-L28
    var token = parts[1];

    // This could fail.  If it does handle as 401 as the token is invalid.
    var decodedToken = jwt.decode(token, {complete: true});
  }

  return middleware;
}

```

## Retrieving the Secret and Verifying the JWT

Now that we have the decoded token we have all the pieces we need to call get the JWKS and find the signing key.  First, we will use the `options.secret` to wrap our calls to `JwksClient` and assign it to `getSecret`.  Next, using the `jsonwebtoken` node module, we will verify the token.  Lastly, we will use `async.waterfall` to call `getSecret` and invoke `verifyToken` with the results of `getSecret`.  This will ultimately be used to verify the JWT.

```javascript
export default (options) => {

  var secretCallback = options.secret;

  var middleware = (req, res, next) => {
    ...

    // https://github.com/sgmeyer/auth0-node-jwks-rs256/blob/master/src/middleware/expressJwt.js#L30-L58
    if (decodedToken.header.alg !== 'RS256') {
      // we are only supporting RS256 so fail if this happens.
      return cb(null, null);
    }

    var tasks = [
      function getSecret(callback) {
        secretCallback(req, decodedToken.header, decodedToken.payload, callback);
      },
      function verifyToken(secret, callback) {
        jwt.verify(token, secret, options, function(err, decoded) {
          if (err) {
            callback(new UnauthorizedError('invalid_token', err));
          } else {
            callback(null, decoded);
          }
        });
      }
    ];

    async.waterfall(tasks, (err, result) => {
      if (err) { 
        return next(err); 
      }

      set(req, _requestProperty, result);
      next();
    });
  }

  return middleware;
}

```

## Calling our middleware

Now that we have all the pieces in place to validate an RS256 token, we need to configure the middleware and apply it to the route.

```javascript
/**
 * https://github.com/sgmeyer/auth0-node-jwks-rs256/blob/master/src/middleware/jwtCheck.js#L8-L17
 **/

import expressJwt from './expressJwt';
import expressJwtSecret from '../lib/expressJwtSecret';

export const jwtCheck = expressJwt({
  secret: expressJwtSecret({
    jwksUri: `https://your-tenant.auth0.com/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: 'https://api.c0der.io/v1/',
  issuer: `https://your-tenant.auth0.com/`,
  algorithms: ['RS256']
});

app.get('/meta', jwtCheck, api());

```

As you can see anytime we call the api's `/meta` endpoint a token will be verified.  This is where all of the pieces are pulled together.  Each time a request is made to `/meta` the JWT will be verified against the appropriate key in the JWKS.  Also, if the JWT passes signature verification the audience and issuer will be checked using `jsonwebtoken` module.

## Happy Coding

At this point we have seen an end to end sample for verifying a RS256 signed JWT.  This process not overly difficult, however it does add significant complexity as opposed to a symmetric algorithm like HS256.  Despite the added complexity it offers significant security benefits over HS256 and will surely pay off in the long run.  We highly recommend using RS256 as a means to sign your JWTs.

You can find the full sample on [GitHub](https://github.com/sgmeyer/auth0-node-jwks-rs256).
