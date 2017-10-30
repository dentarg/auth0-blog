---
layout: post
title: "Are Your Security Questions As Safe As You Think?"
description: "They safeguard your account, but they're not exactly all they're cracked up to be."
date: 2017-10-30 17:06
category: Growth, Security
author:
  name: Martin Gontovnikas
  url: http://twitter.com/mgonto
  mail: gonto@auth0.com
  avatar: https://www.gravatar.com/avatar/df6c864847fba9687d962cb80b482764??s=60
is_non-tech: true
design:
  bg_color: "#5A010C"
  image: "https://cdn.auth0.com/blog/security-questions/logo.png"
tags:
- identity
- management
- security
related:
- 2016-12-29-2017-budget-planning
- 2017-10-27-where-video-game-authentication-falls-short-and-how-gamers-can-stay-safe
- 2017-10-13-how-do-i-modernize-my-legacy-system
---

You set up your security questions when you sign up (sometimes) and totally forget about them. Then, one day, you inevitably forget your password and find yourself robotically entering your place of birth, your dog's name, and your mom's birthday to get access to your account.

Bang, boom, and you're back in with your security questions and a quick password reset.

But hold on—dog's name, birthplace... are these questions really secure? Or are questions that are supposed to safeguard your account really a point of weakness?

Much like passwords, security questions are something that could, in theory, be very secure. But when you start putting people in the position of handling hundreds of accounts, keeping security questions, well, secure can become a daunting task.

## How Easy is it to Hack a Security Question?

As with passwords, there are basically two ways that a hacker can nab the answers to your security questions: a breach or a guess.

### Breaches

Unfortunately, breaches are more common that anyone would like, and there's only so much you can do on an individual level to keep your info from getting stolen in a breach.

Yes, breaches happen, and sometimes your security questions get stolen. But that doesn't make them inherently less secure than passwords, phone numbers, and your biometric data (which can be stolen), or SMS or other 2-factor authentication messages, which can be intercepted or go to a compromised account.

Breaches are a mark against security questions, but they're also a threat to many other forms of authentication. At best, security questions are no more hackable than passwords, at worst they're both vulnerable.

### Guesses

While you're probably not doing something as egregious as putting “answer” as the answer to all your security questions, picking easy to remember answers can lead you to having your questions easily guessed.

* **Generic answers:** depending on where you are, that “unique” piece of information about you could get you into some statistical trouble. Google reports that “a single guess an attacker would have a [19.7%](https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/43783.pdf) success rate at guessing English-speaking users’ answers” to a question about their favorite food. If you're from South Korea, a hacker would get your birthplace 39% of the time with just ten guesses. Hackers can crowdsource information and use other database tools, which can add up to a compromise of your security.

* **Searchable answers:** if the information is on your LinkedIn, your Facebook, or Twitter feed or other social media platform, it's not a good answer to a security question. Some of these, like hometown, are generally available and obvious. But things like favorite team or athlete, where you met your spouse (alma mater, hometown, etc.), and favorite vacation spot can be just as easily guessed from a quick scroll through your profile.

![Common questions are easy to guess.](https://cdn.auth0.com/blog/security-question/challenge.png)

If you're using an easy-to-guess answer, then you security questions are not safe. The caveat is that this isn't an inherent problem with security questions—if your answers are unique, then you're ok.


## How Can We Make Security Questions as Safe as Possible?

In a perfect world, security questions would be a lot safer than they are now. To ensure that your answers are as safe as possible:

* **Make every answer completely unique, and not guessable.** Leave behind your hometown and your mother's maiden name. Instead, use a mix of letters, numbers, and characters to create random answers to every security question.

![Use a mix of letters, numbers, and characters to create random answers](https://cdn.auth0.com/blog/security-question/mix-of-letters.png)

* **Make your own questions.** If you are given the option to make your own security question, take the opportunity to make a question that only you will be able to figure out the answer to. Microsoft found that when the most generic questions were used, [hackers could guess their way into an account 15%](https://www.microsoft.com/en-us/research/publication/its-no-secret-measuring-the-security-and-reliability-of-authentication-via-secret-questions/?from=http%3A%2F%2Fresearch.microsoft.com%2Fpubs%2F79594%2Foakland09.pdf) of the time—and that's without knowing personal info about the account owner.
* **Never duplicate an answer to a security question.** Although you may be asked to provide the answers to nearly identical questions across multiple accounts, don't use the same answers, or variations on one answer.

### How You Can Implement These Changes in Your Own Accounts

If you read the above and thought *there's no way I'll be able to remember all of that!* then you're not alone. Most people couldn't remember a completely unique set of security question answers to every single account they have.

* **Use a password manager.** We've talked about these before, but password managers allow you to store passwords and other account information securely. So when you make a bunch of unique security question answers, you can recall them through the manager instead of having to remember every one yourself.
* **Set up 2-factor authentication.** Don't rely on security questions to keep yourself safe—connect multiple ways of identifying yourself to your account, including a recovery email and phone. Double check what options are available for your accounts, and keep your info up to date.
* **Clean up your social media.** While certain things will have to stay, taking your hometown off of Facebook isn't going to affect your quality of experience on that social network. If you know you might still have generic security question answers floating around, consider taking that type of information down—nobody who knows you will miss it.

![Clean up personal information that no one cares about.](https://cdn.auth0.com/blog/security-question/clean-up.png)

* **Work backwards.** Yes, changing all your security question answers is a daunting task. Start with the most important accounts (banking, primary email) and update your security questions on those first. Set up a password manager and make sure that you note the answers. Then, chip away at your less important accounts.

## Security Questions: Safe After All?

At the end of the day, security questions have their up and downsides, like every other security measure. No technology is going to promise perfect safety for anyone, but we can mitigate the risk of being hacked by taking practical measures to protect ourselves.

Security questions aren't bad in theory; it's in practice that they start to come with strings attached. But this is something you can guard yourself against.

If you're taking security questions seriously, make them unique and don't reuse them. Reset them if you think your account may have been compromised. And whatever you do, just stop using your mother's maiden name, ok?
