---
layout: post
title: "Brute Forcing HS256 is Possible: The Importance of Using Strong Keys in Signing JWTs"
description: "Cracking a JWT signed with weak keys is possible via brute force attacks. Learn how Auth0 protects against such attacks and alternative JWT signing methods provided."
date: 2017-03-23 08:30
category: Technical Guide, Security, JWT
design:
  bg_color: "#000000"
  image: https://jwt.io/img/pic_logo.svg
author:
  name: "Prosper Otemuyiwa"
  url: "http://twitter.com/unicodeveloper?lang=en"
  mail: "prosper.otemuyiwa@auth0.com"
  avatar: "https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200"
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
---

JSON Web Tokens are an open, industry standard [RFC 7519](https://tools.ietf.org/html/rfc7519) method for representing claims securely between two parties. They can be digitally signed or encrypted and there are several algorithms that can be employed in signing a JWT. In this article, we'll look at the two most common algorithms and discover how using weak keys can allow malicious parties to brute force the secret key from the JWT.

## What is a JSON Web Token?

A JSON Web Token encodes a series of claims in a JSON object. Some of these claims have specific meaning, while others are left to be interpreted by the users. These claims can be verified and trusted because it is digitally signed. Examples of these claims are `issuer (iss)`, `subject (sub)`, `audience (aud)`, `expiration time (exp)`, `not before (nbf)`, and `issued at (iat)`. JWTs can be signed using a secret (with HMAC algorithm) or a public/private key pair using RSA or Elliptic-Curve.

## Structure of a JSON Web Token

A signed, compact-serialized JWT consists of three main parts separated by a `.` namely:

* Header
* Payload
* Signature

A JWT comes in this structure, `aaaaaa.bbbbbb.ccccc`.  `aaaaaaa` represents the header, `bbbbb` represents the payload while `cccccc` represents the signature.

### Header

The header typically consists of two parts: the type of the token, which is JWT, and the hashing algorithm such as `HS256` or `RS256`. Example:

```js

{
  "alg": "HS256",
  "typ": "JWT"
}

```

Then, this JSON is Base64Url encoded to form the first part of the JWT.

### Payload

This part of the token carries the claims. An example of a payload can be found below:


```js

{
  "sub": "1234567890",
  "name": "John Doe",
  "manager": true
}

```

The payload is then `Base64Url` encoded to form the second part of the JWT.

### Signature

The last part of the token is the signature. The signature is composed from the signing of the encoded header, encoded payload, and a secret.

An example of a signature using the HMAC SHA256 (HS256) algorithm can be created like so:

```bash

HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret)

```

_A signed JWT_

![](https://cdn.auth0.com/content/jwt/encoded-jwt4.png)

## JWT Signing Algorithms

The most common algorithms for signing JWTs are:

* HMAC + SHA256 (HS256)
* RSASSA-PKCS1-v1_5 + SHA256 (RS256)
* ECDSA + P-256 + SHA256 ( ES256)

### HS256

Hash-based Message Authentication Code (HMAC) is an algorithm that combines a certain payload with a secret using a cryptographic hash function like `SHA-256`. The result is a code that can be used to verify a message only if both the generating and verifying parties know the secret. In other words, HMACs allow messages to be verified through shared secrets.

This is an example showcasing a HMAC-based signing algorithm:

```js

const encodedHeader = base64(utf8(JSON.stringify(header)));
const encodedPayload = base64(utf8(JSON.stringify(payload)));
const signature = base64(hmac(`${encodedHeader}.${encodedPayload}`, 
                              secret, sha256));
const jwt = `${encodedHeader}.${encodedPayload}.${signature}`;

```

An example of signing a JWT with the `HS256` algorithm using the `jsonwebtoken` JavaScript library can be found below:

```

var jwt = require('jsonwebtoken');

const payload = {
  sub: "1234567890",
  name: "John Doe",
  manager: true
};

const secretKey = 'secret';

const token = jwt.sign(payload, secretKey, { 
    algorithm: 'HS256',
    expiresIn: '10m' // if ommited, the token will not expire
});

```

### RS256

RSA is a public-key algorithm. Public-key algorithms generate split keys: one public key and one private key. 

For public-key signing algorithms:

```js

const encodedHeader = base64(utf8(JSON.stringify(header)));
const encodedPayload = base64(utf8(JSON.stringify(payload)));
const signature = base64(rsassa(`${encodedHeader}.${encodedPayload}`, 
                                privateKey, sha256));
const jwt = `${encodedHeader}.${encodedPayload}.${signature}`;

```

When signing and verifying JWTs signed with RS256, you deal with a public/private key pair rather than a shared secret. There are many ways to create RSA keys. OpenSSL is one of the most popular libraries for key creation and management:

```bash

# Generate a private key
openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048

# Derive the public key from the private key
openssl rsa -pubout -in private_key.pem -out public_key.pem

```

Both `PEM` files are simple text files. Their contents can be copied and pasted into your JavaScript source files and passed to the `jsonwebtoken` library.

```js

// You can get this from private_key.pem above.
const privateRsaKey = `<YOUR-PRIVATE-RSA-KEY>`; 

const signed = jwt.sign(payload, privateRsaKey, {
    algorithm: 'RS256',
    expiresIn: '5s'
});

```

```js

// You can get this from public_key.pem above.
const publicRsaKey = `<YOUR-PUBLIC-RSA-KEY>`;

const decoded = jwt.verify(signed, publicRsaKey, {
    // Never forget to make this explicit to prevent
    // signature stripping attacks.
    algorithms: ['RS256'], 
});

```

### ES256

ECDSA algorithms also make use of public keys. We can use OpenSSL to generate the key as well:

```bash

# Generate a private key (prime256v1 is the name of the parameters used
# to generate the key, this is the same as P-256 in the JWA spec). 
openssl ecparam -name prime256v1 -genkey -noout -out ecdsa_private_key.pem

# Derive the public key from the private key
openssl ec -in ecdsa_private_key.pem -pubout -out ecdsa_public_key.pem

```

If you open these files you will note that there is much less data in them. This is one of the benefits of ECDSA over RSA. The generated files are in PEM format as well, so simply pasting them in your source will suffice.

```js

// You can get this from private_key.pem above.
const privateEcdsaKey = `<YOUR-PRIVATE-ECDSA-KEY>`; 

const signed = jwt.sign(payload, privateEcdsaKey, {
    algorithm: 'ES256',
    expiresIn: '5s'
});

```

```js

// You can get this from public_key.pem above.
const publicEcdsaKey = `<YOUR-PUBLIC-ECDSA-KEY>`;

const decoded = jwt.verify(signed, publicEcdsaKey, {
    // Never forget to make this explicit to prevent
    // signature stripping attacks.
    algorithms: ['ES256'], 
});

```

> **Note:** These algorithm notes above are excerpts from the very comprehensive [Auth0 JWT book](https://auth0.com/e-books/jwt-handbook) written by [Sebastian Peyrott](https://twitter.com/speyrott). Download it for more information on signing and validating JWTs using these algorithms mentioned above.

## Brute Forcing a HS256 JSON Web Token

As secure as `HS256` is, especially when implemented the right way, brute-forcing a JSON web token signed with small and medium sized shared-secrets using **HS256** is still very possible. 

Recently, I came across a [tool](https://github.com/brendan-rius/c-jwt-cracker) written in C on GitHub. It is a multi-threaded JWT brute force cracker. With a huge computing power, this tool can find the secret key of a `HS256` **JSON Web token**.

*Please note the RFC7518 standard states that "A key of the same size as the hash output (for instance, 256 bits for "HS256") or larger MUST be used with this algorithm." Auth0 secret keys exceed this requirement making cracking via this or similar tools all but impossible.*

### Implementing a Brute Force Attack

I used a Mac computer to try out the brute force attack. First, make sure you have `openssl` installed. If it is not, install it with homebrew like so:

```bash

brew install openssl

```

Then run this command in the terminal like so:

```bash

make OPENSSL=/usr/local/opt/openssl/include OPENSSL_LIB=-L/usr/local/opt/openssl/lib

```

On Ubuntu, you can install `openssl` like so:

```bash

apt-get install libssl-dev

```

The specs of my MacBook are mentioned below:

* Processor 2.7 GHz Intel Core i5
* Memory 8GB 1867 MHz DDR3
* Graphics Intel Iris Graphics 6100 1536 MB

Go ahead and clone the `jwt-cracker` from [GitHub](https://github.com/brendan-rius/c-jwt-cracker). 

An example JWT signed with `HS256` and a secret, `Sn1f` is:

```bash

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.cAOIAifu3fykvhkHpbuhbvtH807-Z2rI1FS3vX1XMjE

```

Now, run the `jwt-cracker` from your terminal to crack the token like so:

```bash

time ./jwtcrack eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.cAOIAifu3fykvhkHpbuhbvtH807-Z2rI1FS3vX1XMjE

```

> **Note:** Make sure the `jwtcrack` script is executable by running `chmod a+x ./jwtcrack`

![Crack](https://cdn.auth0.com/blog/bruteforceattack/token.png)

It took about 6.16s on my laptop to crack the secret key.

With the help of [jwt.io](https://jwt.io), let's sign another token quickly, but with a secret, *secret*.

Run the cracker again with the new JWT like so:

```bash

time ./jwtcrack eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ

```

![Crack a new token](https://cdn.auth0.com/blog/bruteforceattack/anothertoken.png)
_Crack another token_

From the results shown above, it cracked the token and got our secret, which is actually *secret* in about 3273.51s.

### Security Concerns and Recommendation

Let's take another look at the keys we used to generate the tokens that were cracked easily. What are the key sizes? The first key, `Sn1f` is 32-bit.

> 1 character = 8 bits 

The second key, `secret` is 48-bit. This is simply too short to be a valid key. In fact, the [JSON Web Algorithms RFC 7518](https://tools.ietf.org/html/rfc7518#page-7) states that a key of the same size as the hash output (for instance, 256 bits for "HS256") or larger MUST be used with the HS256 algorithm.

I therefore recommend that anyone trying to generate a JSON Web token and signing them with HS256 to use a properly sized secret key. [Auth0](https://auth0.com) secret keys are 512 bits in length and not susceptible to this type of brute force attack. Additionally, Auth0 allows you to easily sign your JWTs with **RS256**.

## Using Auth0 to sign JWT with RS256

With [Auth0](https://auth0.com), you can easily generate JWTs for authentication and authorization. By default, we use HS256 to sign the JWTs generated, but we also allow customs to use RS256 if their use case calls for it. The [Auth0 Lock](https://auth0.com/docs/libraries/lock) library returns a signed JWT that you can store on the client side and use for future requests to your APIs.

In the vast majority of use cases you would never need to change the signing algorithm, but on the off chance that you do, let's see how to accomplish it with Auth0.

Create a client on the [dashboard](https://manage.auth0.com) like so:

![Create a client](https://cdn.auth0.com/blog/bruteforceattack/create_app.png)
_Create a client_

Go to settings like so:

![Settings Page](https://cdn.auth0.com/blog/bruteforceattack/settings.png)
_Settings Page_

Scroll down to *Show Advanced Settings* like so:

![Show Advanced Settings](https://cdn.auth0.com/blog/bruteforceattack/show_advanced_settings.png)
_Show Advanced settings_

Switching to **RS256** is as easy as selecting the option from the dropdown on the Auth0 dashboard like so:

![Switch to RS256](https://cdn.auth0.com/blog/bruteforceattack/switch_to_rs256.png)
_Default is HS256, Switching to RS256 is simple_


## Conclusion

JSON Web Tokens (JWTs) are lightweight and can easily be used across platforms and languages. They are a clever way to pass signed or encrypted information between applications. There are several [JWT libraries](https://jwt.io/#libraries-io) available for signing and verifying the tokens.

We have also been able to show that brute forcing of HS256 JWTs is certainly possible, when used with short and weak secret keys. Unfortunately, this is a limitation of most shared-key approaches. All cryptographic constructions, including HS256, are insecure if used with short keys, so ensure that implementations satisfy the standardized requirements.

As a rule of thumb, make sure to pick a shared-key as long as the length of the hash. For HS256 that would be a 256-bit key (or 32 bytes) minimum. Luckily, if you are an Auth0 customer you have nothing to worry about as we follow all the standards and best practices when generating secret keys.

