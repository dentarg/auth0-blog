---
layout: post
title: "Adding Salt to Hashing: A Better Way to Store Passwords"
description: "A salt is added to the hashing process to force their uniqueness, increase their complexity without increasing user requirements, and to mitigate password attacks like rainbow tables"
longdescription: "A salt is a fixed-length cryptographically-strong random value appended to passwords to prevent revealing identical password used across users, to increase the complexity of passwords without increasing the complexity of the password requirements, and to mitigate password attack vectors such as rainbow tables, dictionary, and brute-force attacks."
date: 2018-04-23 8:30
category: Security Authentication Breaches
design: 
  bg_color: "#4A4A4A"
  image: "https://cdn.auth0.com/blog/adding-salt-to-hashing-a-better-way-to-store-passwords/salt-logo.png"
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
related:
  - 2017-03-29-is-passwordless-authentication-more-secure-than-passwords
  - 2016-03-17-data-breach-response-planning-for-startups
---


Salting hashes sounds like one of the steps of a hash browns recipe, but in cryptography, the expression refers to adding random data to the input of a hash function, the **pre-image**, to guarantee a unique output, the **hash**, even when the inputs are the same. Consequently, the unique hash produced by adding the salt can protect us against different attack vectors, such as rainbow tables and dictionary attacks.

> **Note**: Never tell anyone registering for an account that their selected password is not unique. A system like that in place will allow hackers to crack passwords in record time! 

Hashed passwords are not unique to themselves due to the deterministic nature of hash function: when given the same input, the same output is always produced. If Alice and Bob both choose `dontpwnme4` as a password, their hash would be the same:


| **username**  | **hash**  |
|---|---|
| alice   | 4420d1918bbcf7686defdf9560bb5087d20076de5f77b7cb4c3b40bf46ec428b  |
| jason  | 695ddccd984217fe8d79858dc485b67d66489145afa78e8b27c1451b27cc7a2b  |
| mario  |cd5cb49b8b62fb8dca38ff2503798eae71bfb87b0ce3210cf0acac43a3f2883c   |
| teresa  |73fb51a0c9be7d988355706b18374e775b18707a8a03f7a61198eefc64b409e8   |
| bob  |4420d1918bbcf7686defdf9560bb5087d20076de5f77b7cb4c3b40bf46ec428b   |
| mike  | 77b177de23f81d37b5b4495046b227befa4546db63cfe6fe541fc4c3cd216eb9  |


As we can see, `alice` and `bob` have the same password as we can see that both share the same hash: `4420d1918bbcf7686defdf9560bb5087d20076de5f77b7cb4c3b40bf46ec428b`. 

The attacker can better predict the password that legitimate maps to that hash. Once the password is known, the same password can be used to access all the accounts that use that hash.

> Can you find what is `jason`'s password based on the hash `695ddccd984217fe8d79858dc485b67d66489145afa78e8b27c1451b27cc7a2b`?

## Attacking Unsalted Passwords

To start, the attacker could try a dictionary attack. Using a list of words with their pre-computed hash, the attacker easily compares the hashes from our table with every hash on the list. If a match is found, the password then can be deduced.

> Two _different_ hash functions can produce the same hash; however, the risk of this happening is extremely low.

Fortunately, despite choosing the same password, `alice` and `bob` chose a password that is not easily found in a dictionary: `dontpwnme4`. Our friend `mike`, on the other hand, chose `friendship` as his password which is a direct entry in the English dictionary. `mike` is at high risk of being breached through a dictionary attack; the risk for `alice` and `bob` is low. To come up with a password such as `dontpwnme4`, the attacker would more likely rely on a brute-force attack to create passwords randomly.

 Both dictionary attacks and brute-force attacks require the real-time computation of the hash. Since a good hash function is _slow_, this would take a lot of time. To circumvent this problem, the attacker may rely on a rainbow table.
 

A *rainbow table* can make the exploitation of unsalted passwords easier. A [rainbow table](https://en.wikipedia.org/wiki/Rainbow_table) is essentially a _pre-computed_ database of hashes. Dictionaries and random strings are run through a selected hash function and the pre-image/hash mapping is stored in a table. The attacker can then simply do a password reverse lookup by using the stolen hashes. 

The main difference between a rainbow table attack and a dictionary and brute-force attack is _pre-computation_. Rainbow table attacks are fast because the attacker doesn't have to spend any time computing any hashes. The trade-off for the speed gained is the immense amount of space required to host a rainbow table. We could say that a rainbow table attack is a pre-computed dictionary and/or brute-force attack.

Since time and space are limited, the attacker that designs and computes the rainbow table may want to process the most commonly used passwords first. Here is where `alice` and `bob` could be at a much higher risk if `dontpwnme4` is in that common-password list. Large common-password databases are created using frequency analysis across passwords collected from different publicly leaked breaches.

The strength of rainbow tables comes from volume not computation speed and the volume is huge! Each data breach adds to this volume. For a list of companies that have been breached visit the [pwned websites list of haveibeenpwned.com](https://haveibeenpwned.com/PwnedWebsites).
 
> _"There are often 'breaches' announced by attackers which in turn are exposed as hoaxes. There is a balance between making data searchable early and performing sufficient due diligence to establish the legitimacy of the breach."_ - [Troy Hunt](https://twitter.com/troyhunt)

Faster CPUs and GPUs, distributed computations and weak algorithms making cracking a password much easier. The industry trend is to move towards [passwordless authentication](https://auth0.com/passwordless).

## Mitigating Password Attacks with Salt

To mitigate the damage that a rainbow table or a dictionary attack could do, we salt the passwords. According to [OWASP Guideliness](https://www.owasp.org/index.php/Password_Storage_Cheat_Sheet#Use_a_cryptographically_strong_credential-specific_salt), a **salt** is a fixed-length cryptographically-strong random value that is added to the input of hash functions to create unique hashes for every input, regardless of the input not being unique. A salt makes a hash function look non-deterministic, which is good as we don't want to reveal password duplications through our hashing.

Let's say that we have password `farm1990M0O` and the salt `f1nd1ngn3m0`, we would hash `farm1990M0Of1nd1ngn3m0` to get `fd41f7e09acfa37391b87aa0a371b25fbb236b046742c0c6128c5c6701bebca4`. We can salt a password by either appending or prepending the salt to the password. `f1nd1ngn3m0farm1990M0O` is also valid. 

When another user chooses the same password, if we use the same salt, `f1nd1ngn3m0`, we just create a longer password. The hashes would be identical:


Password: `farm1990M0O`

Salt: `f1nd1ngn3m0`

Salted pre-image: `farm1990M0Of1nd1ngn3m0`

Hash (SHA-256): `b7d5f95f03261f201b78f7a133f50848f2389f032b4fec9be07f80b34ae89e09`


But, if we choose another salt for the same password, we get a different hash:



Password: `farm1990M0O`

Salt: `f1nd1ngd0ry`

Salted pre-image: `farm1990M0Of1nd1ngd0ry`

Hash (SHA-256): `2e083e890e38427799c41a89702d1a8dbc88b7ca3ff96ee96c651069f683b14e`

Each **unique salt** extends the password `farm1990M0O` and transforms it into a **unique password**.


In practice, we store the salt in cleartext along with the hash in our database. We would store `f1nd1ngn3m0` and `b7d5f95f03261f201b78f7a133f50848f2389f032b4fec9be07f80b34ae89e09` together so that when the user logs in, we can append the salt to the provided password, hash it, and then verify if the stored hash matches the computed hash. 

<p style="text-align: center;">
  <img src="https://cdn.auth0.com/blog/adding-salt-to-hashing-a-better-way-to-store-passwords/password-salt-flow.png" alt="Workflow that shows how salts fit in the process of hashing and authentication.">
</p>

Now we can see why it is very important that each pre-image is salted with unique random data:

1. If the attacker steals all the hashes and salts, they still need to have the password to be able to find a matching hash. This would require a brute-force, dictionary or rainbow table attack. 

2. If the salt is `f1nd1ngn3m0` for all passwords, we don't gain much other than hashing a much larger password with duplicate hashes still occurring. We may also force the attacker to have to recompute a rainbow table that salts every entry in the table. This would slow down the attacker, but not for too long. Modern hardware is capable of computing rainbow tables very fast!

3. When the salt is unique for hash, we inconvenience the attacker by now having to compute a rainbow table for each user hash. This creates a big bottleneck for the attacker. Ideally, we want the salt to be truly random and unpredictable to bring the attacker to a halt.

<p style="text-align: center;">
  <img src="https://cdn.auth0.com/blog/adding-salt-to-hashing-a-better-way-to-store-passwords/password-salt-example.png" alt="Example showing how using a salt with hashing produces unique hashes.">
</p>

While the attacker may be able to crack one password, cracking all passwords will be unfeasible. Regardless, when we experience a data breach, we may not be able to determine which passwords could have been cracked and therefore we must consider all passwords cracked and request all of our users to change their password.  


{% include tweet_quote.html quote_text="If someone breaches into our database, we'd have to react as if any given password was cracked, regardless of whether we used a salt or even a pepper." %}

## Generating a Good Random Salt

`f1nd1ngn3m0` seems pretty random, but is it a good salt? When we are adding salts to passwords, we need to add salts that are cryptographically strong and credential-specific.

Following [OWASP Guidelines](https://www.owasp.org/index.php/Password_Storage_Cheat_Sheet#Use_a_cryptographically_strong_credential-specific_salt), to properly implement credential-specific salts, we must:

> Generate a unique salt upon creation of each stored credential (not just per user or system-wide).

We've seen how a system-wide password is pointless to mitigate attacks. Additionally, we don't want to implement user-based salts because we want to hash and salt each password created for a user. That includes passwords created during registration or as the result of a password reset. If the user eventually cycles over the same password, we don't want to give away that the password has already been used.

> Use cryptographically-strong random data.

[Cryptographically strong or strong cryptography](https://en.wikipedia.org/wiki/Strong_cryptography) define a cryptographic system that is highly resistant to [cryptoanalysis](https://en.wikipedia.org/wiki/Cryptanalysis), which are efforts to crack down the secret patterns of the system to breach it. Showing that a cryptographic scheme is resistant to attacks is a complex process that requires a lot of time, extensive testing and reviews, and ideally community engagement. Due to this complexity, security experts recommend that [you don't roll your own cryptography](https://motherboard.vice.com/en_us/article/wnx8nq/why-you-dont-roll-your-own-crypto).

To create such cryptographically-strong random data, we may use a [cryptographically secure pseudorandom number generator](https://en.wikipedia.org/wiki/Cryptographically_secure_pseudorandom_number_generator)(CSPRNG) to gather unpredictable input from sources that we cannot observe, such as the Random Generator API of our operating system.

OWASP suggests [SecureRandom](https://docs.oracle.com/javase/6/docs/api/java/security/SecureRandom.html) as an example of cryptographically-strong random data.

> As storage permits, use a 32-byte or 64-byte salt (actual size dependent on protection function). 

A longer salt effectively increases the computational complexity of attacking passwords which in turn increases the candidate set exponentially. A longer salt also increases the space required to store rainbow tables while decreasing the possibility that such table exists in the wild.

> Scheme security does not depend on hiding, splitting, or otherwise obscuring the salt.

Simply put, *do not mess with the salt*. The salt doesn't need to be encrypted, for example. Salts are in place to prevent someone from cracking passwords at large and can be stored in cleartext in our database next to the hashes. However, we **do not want to make the salts readily accessible to the public**. For that reason, usernames are bad candidates to use as salts. 

{% include tweet_quote.html quote_text="Hashing salts are speed bumps in an attacker's road to breaching your data. It does not matter if they are visible and unencrypted, what matters is that they are in place." %}

Based on these guidelines, `f1nd1ngn3m0` is not being generated from an unpredictable source. In fact, the salt is a `1337` way of writing `findingnemo`, a popular animated movie, which could be part of a dictionary-brute-force strategy. `f1nd1ngn3m0` doesn't meet the length recommendation to be a salt: it's only 11 bytes long.

Our second salt, `f1nd1ngd0ry` suffers from the same weaknesses. I chose it based on it being the sequence to the "Finding Nemo" movie, "Finding Dory". Our human imagination to create randomness can only go so far so it's better to delegate that task to the machine. 

> How do we generate reliable random data to serve as salt?

As we can see, hashing and salting are very complex processes and the security of our systems greatly relies on their successful implementation. While these are no methods to create 100% secure systems, these are methods to create hardy and resilient systems. It's best to leave the creation, maintenance, and operation of such methods and systems to security experts. A misstep in your home-made security strategy may lead to extensive damage to your business, users, and reputation.


You'd want to rely on libraries such as `bcrypt` that hash and salt the password for you using strong cryptography. Additionally, you may use a security framework, such as [Spring Security](https://projects.spring.io/spring-security/) for the Java Ecosystem for example. These frameworks offer you abstractions that make the development of your applications safer but also [integrate with reliable identity providers](https://auth0.com/docs/quickstart/webapp/java-spring-security-mvc/01-login), such as Auth0, that make Identity and Access Management much easier.


## Simplifying Password Management with Auth0

You can minimize the overhead of hashing, salting and password management through [Auth0](https://auth0.com/). We solve the most complex identity use cases with an extensible and easy to integrate platform that secures billions of logins every month.

Auth0 helps you prevent critical identity data from falling into the wrong hands. We never store passwords in cleartext. Passwords are always hashed and salted using [bcrypt](https://en.wikipedia.org/wiki/Bcrypt). Additionally, data at rest and in motion is always encrypted by using TSL with at least 128-bit AES encryption. We've built state-of-the-art security into our product, to protect your business and your users.

Make the internet safer, <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">sign up for a free Auth0 account</a> today.
