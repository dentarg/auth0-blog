---
layout: post
title: "Could your iPhone get stolen while it's unlocked?"
description: How to prevent criminals to mess with your accounts
category: Hot Topics, Security, Mobile
date: 2016-12-09 13:42
author:
  name: Eugene Kogan
  url: https://twitter.com/eugk
  mail: eugene.kogan@auth0.com
  avatar: https://s.gravatar.com/avatar/667b1c82b6cc2241ff176d50c65da603?s=200
design: 
  bg_color: "#333333"
  image: https://cdn.auth0.com/blog/could-your-iphone-get-stolen/logo.png
tags: 
- security
- iPhone
- apple
- iCloud
- iPad
related:
- how-the-biggest-attack-in-internet-was-perpetrated
- yahoo-confirms-data-breach-of-half-a-billion-user-accounts
- 2016-06-21-avoiding-password-reuse-attacks
---

Yes, definitely. It’s happened to a number of people I work with.

Imagine you’re walking down the street, checking Slack or Facebook, and someone on a bike rides by and grabs your phone. Guess what, your phone is unlocked and ready for the thief to start using it. The same thing can happen in a bar, the subway, or any other crowded place. Even Scotland Yard has started [using](http://www.bbc.com/news/uk-38183819) this technique (but that’s another matter).

![Getting robbed while phone is unlocked](https://cdn.auth0.com/blog/could-your-iphone-get-stolen/getting-robbed.jpeg)

The average iPhone thief doesn’t care about your data, he just wants to wipe the phone so he can resell it. This kind of crime is especially prevalent in countries like [Argentina](http://money.cnn.com/2016/09/14/technology/argentina-iphone-black-market/), where there’s a large black market for Apple products. You might be thinking that the thief still needs to disable Find My iPhone to release Apple’s [Activation Lock](https://support.apple.com/en-us/HT201365). That’s true, but if the phone itself is already unlocked, all he needs is your iCloud password.

Do you get your email on your phone? Is it the same email address that’s tied to your iCloud account? Well, guess where iCloud password reset emails used to go? Before a recent update to iOS, it was possible to reset someone’s iCloud password directly from their unlocked phone, simply by virtue having access to their email account. Even if you use Apple’s [two-factor authentication](https://support.apple.com/en-us/HT204915) (which you absolutely should), that works over SMS or push notifications, which also go to your phone.

Previous, there was nothing blocking a thief from stealing your phone while it was in use (and unlocked), resetting your iCloud password via your email account, disabling Find My iPhone, and finally wiping it to be resold. Thankfully, Apple appears to have quietly fixed this loophole by making it more difficult to reset an iCloud password. If you attempt it from your phone (even via Safari), it will ask you for your unlock PIN.

I used to recommend taking an additional precaution to mitigate this risk, but it’s not really necessary anymore (although it can’t hurt). If you follow these steps, the iCloud account settings will be completely unavailable until you disable “Restrictions” with an extra PIN that you’ll set below. Go to *Settings > General > Restrictions > Enable Restrictions > [create a PIN, enter it twice] > Accounts > Don’t Allow Changes*

Now that Apple has added the necessary security checks to the iCloud password reset process, my recommendations are simpler: enable two-factor authentication for iCloud, and choose a hard to guess, 6-digit (or longer) PIN on your iPhone. With Touch ID, you rarely have to type it anyway.

![Apple's two factor authentication](https://cdn.auth0.com/blog/could-your-iphone-get-stolen/apple-2-factor-auth.png)

**Kudos to Apple for making this improvement. I believe it will help keep people safer by discouraging iPhone muggings.**

Now, if you’re a bit more paranoid and want to really limit what someone can access if they snatch your phone while you’re in the middle of using it, there is one more thing you can do.

An [engineer](https://twitter.com/radekk) on my team at Auth0 told me about [Guided Access](https://support.apple.com/en-us/HT202612), an iOS feature that lets you temporarily restrict the phone to a single app, and can even limit the actions available to the user within an app. With Guided Access configured (*Settings > General > Accessibility > Guided Access*), you can press the home button three times to enable it at any time, within any app. Once it’s on, you’ll need the Guided Access PIN or Touch ID to exit the app. It’s that easy.

Imagine you’re reading the news on your iPhone on the subway. You can quickly enable Guided Access, and lock it down to that one app only. Then even if someone grabs your unlocked phone, they’ll be stuck in the news app forever! (No one wants to read the news for too long nowadays.) Sure, the thief can always power it off, but then the phone will be really locked and essentially useless to them, even for reselling.

Guided Access is intended for situations like when parents let their kids play with their iPhones (or iPads), but it’s actually quite powerful. You could even use it if you think Scotland Yard might be after you…