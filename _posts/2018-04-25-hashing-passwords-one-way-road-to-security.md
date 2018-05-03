---
layout: post
title: "Hashing Passwords: One-Way Road to Security"
description: "A strong password storage strategy is critical to mitigating data breaches that put the reputation of any organization in danger. Hashing is the foundation of secure password storage."
longdescription: "A strong password storage strategy is critical to mitigating data breaches that could put the reputation of any organization in danger. Hashing is the foundation of secure password storage. When a database is breached, cleartext passwords let attackers gain access to user accounts right away. If the passwords are hashed, breaking in into user accounts is much more difficult."
date: 2018-04-25 8:30
category: Technical Guide, Security
design:
  image: https://cdn.auth0.com/blog/hashing-one-way-road-to-security/hashing.png
  bg_color: "#4B673E"
author:
  name: Dan Arias
  url: http://twitter.com/getDanArias
  mail: dan.arias@auth.com
  avatar: https://pbs.twimg.com/profile_images/918124318076256256/wMFapJ1C_400x400.jpg
tags:
  - hashing
  - salting
  - password-storage
  - security
  - hash
  - password
  - salt
  - digest
related:
  - 2018-05-03-adding-salt-to-hashing-a-better-way-to-store-passwords
  - 2017-02-24-sha-1-collision-attack
  - 2017-03-29-is-passwordless-authentication-more-secure-than-passwords
---

The gist of authentication is to provide users with a set of credentials, such a username and a password, and to verify that they provide the correct credentials whenever they want access to the application. Hence, we need a way to store these credentials in our database for future comparisons. However, storing passwords on the server side for authentication is a difficult task. Let's explore one of the mechanisms that make password storage secure and easier: hashing.  

## Storing Passwords is Risky and Complex

A simple approach to storing passwords is to create a table in our database that maps a username with a password. When a user logs in, the server gets a request for authentication with a payload that contains a username and a password. We look up the username in the table and compare the password provided with the password stored. A match gives the user access to the application.

The security strength and resilience of this model depends on _how_ the password is stored. The most basic, but also the least secure, password storage format is ***cleartext***.

As explained by [Dan Cornell from the Denim Group](https://denimgroup.com/resources/blog/2007/10/cleartext-vs-pl/), ***cleartext*** refers to "readable data transmitted or stored _in the clear_", for example, unencrypted. You may have also seen the terms ***plaintext*** and ***plain text***. What's the difference? According to Cornell, plaintext refers to data that will serve as the input to an encryption algorithm, while plain text refers to unformatted text, such as the content of a plain text file or `.txt`. It's important to know the distinction between these terms as we move forward.

Storing passwords in cleartext is the equivalent of writing them down in a piece of digital paper. If an attacker was to break into the database and steal the passwords table, the attacker could then access each user account. This problem is compounded by the fact that many users re-use or use variations of a single password, potentially allowing the attacker to access other services different from the one being compromised. That all sounds like a security nightmare!

The attack could come from within the organization. A rogue software engineer with access to the database could abuse that access power, retrieve the cleartext credentials, and access any account.

A more secure way to store a password is to transform it into data that cannot be converted back to the original password. This mechanism is known as ***hashing***. Let's learn more about the theory behind hashing, its benefits, and its limitations.

{% include tweet_quote.html quote_text="We must guard user accounts from both internal and external unauthorized access. Cleartext storage must never be an option for passwords. Hashing and salting should always be part of a password management strategy." %}


## What's Hashing About?

By dictionary definition, [hashing](https://en.wiktionary.org/wiki/hash) refers to "chopping something into small pieces" to make it look like a "confused mess". That definition closely applies to what hashing represents in computing.

In cryptography, a [hash function](https://en.wikipedia.org/wiki/Cryptographic_hash_function) is a mathematical algorithm that maps data of any size to a [bit string](http://www.gnu.org/software/mit-scheme/documentation/mit-scheme-ref/Bit-Strings.html) of a fixed size. We can refer to the function input as ***message*** or simply as input. The fixed-size string function output is known as the ***hash*** or the ***message digest***. As stated by [OWASP](https://www.owasp.org/index.php/Guide_to_Cryptography#Hashes), hash functions used in cryptography have the following key properties:

* It's easy and practical to compute the hash, but "difficult or impossible to re-generate the original input if only the hash value is known."
* It's difficult to create an initial input that would match a specific desired output.

Thus, in contrast to encryption, hashing is a one-way mechanism. The data that is hashed cannot be practically "unhashed".


<p style="text-align: center;">
  <img src="https://cdn.auth0.com/blog/hashing-one-way-road-to-security/encryption-flow.png" alt="The encryption flow can be reversed. It's two-way">
</p>

<p style="text-align: center;">
  <img src="https://cdn.auth0.com/blog/hashing-one-way-road-to-security/hash-flow.png" alt="The hashing flow cannot be reversed. It's one-way.">
</p>

Commonly used hashing algorithms include Message Digest (MDx) algorithms, such as [MD5](https://en.wikipedia.org/wiki/MD5), and [Secure Hash Algorithms (SHA)](https://en.wikipedia.org/wiki/Secure_Hash_Algorithms), such as SHA-1 and the SHA-2 family that includes the widely used SHA-256 algorithm. Later on, we are going to learn about the strength of these algorithms and how some of them have been deprecated or have fallen out of use due to security vulnerabilities.

In bitcoin, [integrity and block-chaining](https://en.bitcoin.it/wiki/How_bitcoin_works) use the [SHA-256 algorithm](https://en.wikipedia.org/wiki/SHA-2) as the underlying cryptographic hash function. Let's look at a hashing example using SHA-256:

Input: `python1990K0OL`

Hash (SHA-256): `3c9c93e0f8eb2161e5787f7cd3e4b67f8d98fbd80b7d237cc757583b06daa3e3`

Input: `python`

Hash (SHA-256): `98eadd540e6c0579a1bcbe375c8d1ae2863beacdfb9af803e5f4d6dd1f8926c2`


{% include tweet_quote.html quote_text="Understanding blockchains and cryptocurrency, such as bitcoin, is easier when you understand how cryptographic hash functions work." %}

Using SHA-256, we have transformed a random-size input into a fixed-size bit string. Notice how, despite the length difference between `python1990K0OL` and `python`, each input produces a hash of the same length. Using a [hexadecimal representation](http://mathworld.wolfram.com/Hexadecimal.html), each hash has 64 digits that represent a 256-bit long string; each hexadecimal digit represents 4 bits.

Outside of cryptography, hash functions are widely used but their properties and requirements are different and do not provide security. For example, [cyclic redundancy check (CRC)](https://en.wikipedia.org/wiki/Cyclic_redundancy_check) is a hash function used in network applications to detect errors but it is not pre-image resistant, which makes it unsuitable for use in security applications such as digital signatures.

Throughout this article, we are going to explore what are the required properties that make a hash function suitable for usage in cryptography. To start, we should know that even if we were to find the details on how the input to a cryptographic hash function gets computed into a hash, it would not be practical for us to reverse the hash back into the input. Why's that?

## Cryptographic Hash Functions are Practically Irreversible

Hash functions behave as one-way functions by using mathematical operations that are extremely difficult and cumbersome to revert such as the [modulo operator](https://en.wikipedia.org/wiki/Modulo_operation).

The modulo operator gives us the remainder of a division. For example, `5 mod 3` is `2` since the remainder of `5 / 3` is `2` using integer division. This operation is deterministic, given the same input always produces the same output: mathematically, `5 / 3` always results in `2`. However, an important characteristic of a modulo operation is that we cannot find the original [operands](https://en.wikipedia.org/wiki/Operand) given the result. In that sense, hash functions are irreversible.

Knowing that the result of a modulo operation is `2` only tells us that `x` divided by `y` has a reminder of `2` but it doesn't tell us anything about `x` and `y`. There is an infinite number of values that could be substituted for `x` and `y` for `x mod y` to return `2`:

```
7 mod 5 = 2
9 mod 7 = 2
2 mod 3 = 2
10 mod 8 = 2
...
```

When using a cryptographic hash function, we must not be able to find a ***pre-image*** by looking at a ***hash***. A pre-image is what we call a value that produces a certain specific hash when used as input to a hash function. Hence, a cryptographic hash function is designed to be resistant to [pre-image attacks](https://en.wikipedia.org/wiki/Preimage_attack); it must be ***pre-image resistant***. So if an attacker knows a hash, it is computationally infeasible to find any input that hashes to that given output. This property is what makes hashing one of the [foundations of bitcoin and blockchains](https://auth0.com/blog/an-introduction-to-ethereum-and-smart-contracts/).

> If you are curious about how a hash function works, this [Wikipedia article](https://en.wikipedia.org/wiki/SHA-2) provides all the details about how the Secure Hash Algorithm 2 (SHA-2) works.

## A Small Change Has a Big Impact

Another virtue of a secure hash function is that its output is not easy to predict. The hash for `dontpwnme4` would be very different than the hash of `dontpwnme5`, even though only the last character in the string changed and both strings would be adjacent in an alphabetically sorted list:

Input: `dontpwnme4`

Hash (SHA-256): `665ec59d7fb01f6070622780e744040239f0aaa993eae1d088bc4f0137d270ef`

Input: `dontpwnme5`

Hash (SHA-256): `7ae89eb10a765ec2459bee59ed1d3ed97dbb9f31ec5c7bd13d19380bc39f5288`

This property is known as the [avalanche effect](https://en.wikipedia.org/wiki/Avalanche_effect) and it has the desirable effect that if an input is changed slightly, the output is changed significantly.

Consequentially, there is no feasible way for us to determine what the hash of `dontpwnme6` would be based on the two previous hashes; the output is non-sequential.

## Using Cryptographic Hashing for More Secure Password Storage

The irreversible mathematical properties of hashing make it a phenomenal mechanism to conceal password at rest and in motion. Another critical property that makes hash functions suitable for password storage is that they are deterministic.

A ***deterministic*** function is a function that given the same input always produces the same output. This is vital for authentication since we need to have the guarantee that a given password will always produce the same hash; otherwise, it would be impossible to consistently verify user credentials with this technique.

To integrate hashing in the password storage workflow, when the user is created, instead of storing the password in cleartext, we hash the password and store the username and hash pair in the database table. When the user logs in, we hash the password sent and compare it to the hash connected with the provided username. If the hashed password and the stored hash match, we have a valid login. It's important to note that we never store the cleartext password in the process, we hash it and then forget it.

Whereas the transmission of the password should be encrypted, the password hash doesn't need to be encrypted at rest. When properly implemented, password hashing is cryptographically secure. This implementation would involve the use of a long salt to overcome the limitations of hash functions.

## Limitations of Hash Functions

Hashing seems pretty robust. But, in one of many scenarios, if an attacker breaks into the server and steals the password hashes, all that the attacker can see is random data that can't be reversed to cleartext due to the architecture of hash functions. An attacker would need to provide an input to the hash function to create a hash that could then be used for authentication, which could be done offline without raising any red flags on the server.

The attacker could then either steal the cleartext password from the user through [modern phishing and spoofing techniques](https://auth0.com/blog/the-new-trend-of-artisanal-spam/) or try a ***brute force attack*** where the attacker inputs random passwords into the hash function until a matching hash is found.

A brute-force attack is largely inefficient. Does the attacker have any other options?

Since hash functions are deterministic (the same function input always results in the same hash), if a couple of users were to use the same password, their hash would be identical. If a significant amount of people are mapped to the same hash that could be an indicator that the hash represents a commonly used password and allow the attacker to significantly narrow down the number of passwords to use to break in by brute force.

Additionally, through a ***rainbow table attack***, an attacker can use a large database of precomputed hashes to find the input of stolen password hashes. We can mitigate a rainbow table attack by boosting hashing with a procedure that adds unique random data to each input at the moment they are stored. This practice is known as [***adding salt to a hash***](https://auth0.com/blog/adding-salt-to-hashing-a-better-way-to-store-passwords/) and it produces ***salted password hashes***.

With a salt, the hash is not based on the value of the password alone. The input is made up of the password plus the salt. A rainbow table is built for a set of predicted passwords. If the hashing of those passwords doesn't include the salt, the rainbow table is useless. When the attacker gets a hold of the salt, the rainbow table now needs to be re-computed, which ideally would take a very long time, further mitigating this attack vector.

> _"The trick is to ensure the effort to “break” the hashing exceeds the value that the perpetrators will gain by doing so. None of this is about being “unhackable”; it’s about making the difficulty of doing so not worth the effort."_ - [Troy Hunt](https://twitter.com/troyhunt)

## No Need for Speed

According to [Jeff Atwood](https://blog.codinghorror.com/speed-hashing/), "hashes, when used for security, need to be slow." A cryptographic hash function used for password hashing needs to be slow to compute because a rapidly computed algorithm could make brute-force attacks more feasible, especially with the rapidly evolving power of modern hardware. We can achieve this by making the hash calculation slow by using a lot of internal iterations or by making the calculation memory intensive.

A slow cryptographic hash function hampers that process but doesn't bring it to a halt since the speed of the hash computation affects both well-intended and malicious users. It's important to achieve a good balance of speed and usability for hashing functions. A well-intended user won't have a noticeable performance impact when trying a single valid login.

## Collision Attacks Deprecate Hash Functions

Since hash functions can take an input of any size but produce hashes that are fixed-size strings, the set of all possible inputs is infinite while the set of all possible outputs is finite. This makes it possible for multiple inputs to map to the same hash. Therefore, even if we were able to reverse a hash, we would not know for sure that the result was the selected input. This is known as a collision and it's not a desirable effect.

A cryptographic collision occurs when two unique inputs produce the same hash. Consequently, a [***collision attack***](https://en.wikipedia.org/wiki/Collision_attack) is an attempt to find two pre-images that produce the same hash. The attacker could use this collision to fool systems that rely on hashed values by forging a valid hash using incorrect or malicious data. Therefore, cryptographic hash functions must also be resistant to a collision attack by making it very difficult for attackers to find these unique values.

{% include tweet_quote.html quote_text="Since inputs can be of infinite length but hashes are of a fixed length, collisions are possible. Despite a collision risk being statistically very low, collisions have been found in commonly used hash functions." %}

For simple hashing algorithms, a simple Google search will allow us to find tools that convert a hash back to its cleartext input. The [MD5](https://security.googleblog.com/2014/09/gradually-sunsetting-sha-1.html) algorithm and the [SHA1](https://security.googleblog.com/2017/02/announcing-first-sha1-collision.html) algorithm have been deemed unsafe to use and deprecated by Google due to the occurrence of cryptographic collisions.

Google recommends using stronger hashing algorithms such as SHA-256 and SHA-3. Other options commonly used in practice are `bcrypt`, `scrypt`, `PBKDF2`, among many others that you can [find in this list of cryptographic algorithms](https://en.wikipedia.org/wiki/List_of_algorithms#Cryptography). However, as we've explored earlier, hashing alone is not sufficient and should be combined with salts. Learn more about how [adding salt to hashing is a better way to store passwords.](https://auth0.com/blog/adding-salt-to-hashing-a-better-way-to-store-passwords/)

## Recap

Let's recap what we've learned through this article:

* The core purpose of hashing is to create a fingerprint of data to assess data integrity, not confidentiality. Confidentiality is gained through encryption.
* A hashing function takes arbitrary inputs and transforms them into outputs of a fixed length.
* To qualify as a cryptographic hash function, a hash function must be pre-image resistant and collision resistant.
* Due to rainbow tables, hashing alone is not sufficient to protect passwords for mass exploitation. To mitigate this attack vector, hashing must integrate the use of cryptographic salts.
* Not all cryptographic algorithms are suitable for the modern industry. At the time of this writing, MD5 and SHA-1 have been reported by Google as being vulnerable due to collisions. The SHA-2 family stands as a better option.

## Simplifying Password Management with Auth0

You can minimize the overhead of hashing, salting and password management through [Auth0](https://auth0.com/). We solve the most complex identity use cases with an extensible and easy to integrate platform that secures billions of logins every month.

Auth0 helps you prevent critical identity data from falling into the wrong hands. We never store passwords in cleartext. Passwords are always hashed and salted using [bcrypt](https://en.wikipedia.org/wiki/Bcrypt). Additionally, data at rest and in motion is always encrypted by using TLS with at least 128-bit AES encryption. We've built state-of-the-art security into our product, to protect your business and your users.

Make the internet safer, <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">sign up for a free Auth0 account</a> today.
