---
layout: post
title: "Is FaceID Really Secure?"
description: "Learn about the technology and security implications regarding Apple's FaceID."
date: 2017-10-16 8:30
category: Growth, Security, Identity
banner:
  text: "Auth0 makes it easy to add authentication to your iOS application."
author:
  name: "Diego Poza"
  url: "https://twitter.com/diegopoza"
  mail: "diego.poza@auth0.com"
  avatar: "https://avatars3.githubusercontent.com/u/604869?v=3&s=200"
is_non-tech: true
design:
  image: https://cdn.auth0.com/blog/faceid/Logo.png
  bg_color: "#653F8B"
tags:
- face-id
- authentication
- biometric-identity
- apple
- security
related:
- 2017-09-08-how-to-not-get-your-identity-stolen
- 2017-10-11-firebase-phone-authentication
- 2017-05-04-the-state-of-biometric-identity-in-2017
---

**TL;DR:** There's still lots to learn from FaceID, but Apple has set the tone for how other tech companies should address user privacy and security concerns. Read on to learn about the security and implications for FaceID.

---

## Is FaceID Really Secure?

When Apple unveiled the new iPhone X earlier this month, the shocking [price tag](http://www.businessinsider.com/apple-iphone-x-prices-around-the-world-2017-9) wasn't the only thing to get attention. On its list of [innovative features](https://www.wired.com/2017/09/everything-apple-announced-at-its-2017-iphone-event/), one has garnered more attention than the others.

We're talking about FaceID. It's part of the new era of biometric technology aimed at making device logins unique based on physical characteristics—in this case, FaceID lets users unlock their phones just by looking at them.

But despite the convenience it offers, users are wary. They get that biometrics are more sophisticated now but don't understand the long-term implications for their security and privacy. Because their face is their password, they want to know what companies are doing to safeguard against hacks.

With that in mind, what can you do to protect your users' information? And what can you do to educate them on how your system works? Here at Auth0, we live and breath security so here's a breakdown of what you can do.

## How Apple is Innovating Facial Recognition

Biometrics have become more sophisticated in a way that consumers are having a hard time understanding. They understand that a face or fingerprint scan verifies their identity—[30%] (http://www.b-secur.com/the-increasing-popularity-of-biometric-authentication/) of mobile phones use a fingerprint scanner to unlock them—but what isn't clear is how it works.

With the iPhone X, Apple is taking a stab at explaining how the tech works and how it protects users. At the unveiling, Apple went into detail about how the new feature works. They presented a demo of it in action and spoke to the concerns users have regarding things like privacy and security. They showed that they were aware of the concerns and indicated what they had done to protect their users.

The demo explained that the phone combines an infrared camera with a flood illuminator, proximity sensor, ambient light sensor, camera, and dot projector to let users unlock their phones, download apps, and make payments via Apple Pay.

![Apple presenting iPhone X with FaceID technology](https://cdn.auth0.com/blog/faceid/face.png)
_[Source](https://www.troyhunt.com/face-id-touch-id-pins-no-id-and-pragmatic-security/)_

This combination—called TrueDepth—is touted as the latest step to securing personal data. The thinking is, other than an identical twin, users' faces are all different. Meaning, even though they're a walking password, no one else has the power to unlock their phone and access the information stored within it.

The technology works by using deep learning and facial mapping to recognize the user's identity and then confirm it. Specifically:

1. When a user holds the phone up to their face, the flood illuminator auto detects their face—even in the dark.
2. Then the infrared camera logs an image of their face.
3. The dot projector kicks in and produces 30,000 invisible dots that represent their facial structure.
4. Finally, the infrared image and the dot pattern go through Apple's neural networks and create the mathematical equivalent of their face. This is the image the phone uses to compare against the one logged at setup.

For all of this to work, the user has to have their eyes open and looking at the camera.

Apple isn't the first tech company to use facial recognition on a mobile device. But unlike the others that have been fooled into unlocking based on [a picture of the user](http://www.businessinsider.com/samsung-galaxy-s8-facial-recognition-is-a-security-flaw-2017-4), Apple assures users that FaceID is harder to crack. The chance of one user looking at someone else's phone and unlocking it is one in a million.

## Manage Growing Pains to Optimize Safe Usability

Things that have users running to social media to vent their worries range from hacks like 3D face recognition to data used to track their every move. Let's take a closer look at the facts and weed out the fiction to see if these concerns do pose a real threat.

### 3D Facial Recognition

With facial recognition, the main concern is how easy it could be to fool facial recognition software. For example, how easy would it be for one user to hold up a picture of another user or wear a mask of someone else's face to get access?

The idea of printing 3D images of peoples faces and then using them to hack into their phones is strictly theoretical right now. No one has done it, but it might be possible to confuse a piece of hardware into thinking that a living, breathing person is looking into the camera. Users are worried that at some point in the near future, these printouts could be used to unlock phones and get access to personal information.

![Apple presenting 3D facial recognition for FaceID](https://cdn.auth0.com/blog/faceid/image.png)
_[Source](https://techcrunch.com/2017/09/12/face-id-is-replacing-touch-id-on-the-new-iphone-x/)_

Even though SR Labs in Berlin was able to make a plaster mold of someone's head to hack into Microsoft's Hello facial recognition system, TrueDepth makes tricking FaceID really hard. For starters, the sensors and camera capture the contour and shape of users' faces. After running their own tests, Apple is confident that it would be incredibly hard to replicate that experiment with FaceID.

To build trust in your users, take a similar approach and test user theories and concerns on your hardware. Then share the results with your users. In Apple's case, the tests offered clarification on just how complex TrueDepth is and what makes it so hard to beat. The more secure you can show your product to be, the more likely users are to entrust their security to you.

{% include tweet_quote.html quote_text="To build trust in your users, take a similar approach and test user theories and concerns on your hardware." %}

### Mass Public Scans to Identify People

People are constantly looking at their phones which makes it possible for mass scans to monitor them—if that were allowed. Users are concerned that if that happens, their profiles—including name, location, and habits—can be shared with other companies or authorities without their knowledge. This would [make them](https://www.wired.com/story/apples-faceid-could-be-a-powerful-tool-for-mass-spying/) “vulnerable to other facial-recognition systems with fewer security and privacy protections."

Meaning, if users are scanned while they're looking at their phone and then their name and location are shared with other businesses that don't have the same experience managing data as the original company, their data will be at risk in case of a breach or hack. No one wants to walk around with [anti-surveillance makeup](https://www.theatlantic.com/technology/archive/2014/07/makeup/374929/), so you have to find a way to show your users why their fears are unfounded.

You need to be clear about how you manage data so explain things like the following to your users:

* What triggers the camera. Do your users have to do something or are cameras on all the time?
* How the scanned data is stored. Will it be stored on servers or the device? Storage location gives a hint to how easy it is for people other than your users to access it.
* What the process is when governments, law enforcement, or other businesses ask for private information. Will you notify users and ask for permission or will you let them know after the fact that their information has been shared? Make this clear, so users know what to expect.

For Apple's part, they have to update their [transparency reports](https://www.wired.com/story/apples-faceid-could-be-a-powerful-tool-for-mass-spying/) and explain their policy in case they're asked to supply facial data or run scans. This keeps users informed on where their data can end up and flag potential concerns.

### Mass Surveillance by the Government to Track People

Platforms like Facebook that use facial recognition to tag people in pictures, don't control the [operating system that](https://www.wired.com/story/apples-faceid-could-be-a-powerful-tool-for-mass-spying/) "controls the cameras on phones, tablets, and laptops that stare at us every day." Companies like Apple control the devices. What makes the FaceID unique is that Apple controls the hardware, the operating system, and the features within it.

{% include tweet_quote.html quote_text="What makes the FaceID unique is that Apple controls the hardware, the operating system, and the features within it." %}

And because Apple has ownership, users are concerned that governments could issue an order asking Apple to dig into its data and share users' personal data with them. This already happens with [Upstream](https://www.wired.com/story/apples-faceid-could-be-a-powerful-tool-for-mass-spying/) in the States, where hundreds of millions of emails get tracked every year. In Australia, law-enforcement have the right to [monitor the browsing history](http://www.smh.com.au/technology/technology-news/data-retention-and-the-end-of-australians-digital-privacy-20150827-gj96kq.html) of people without asking for permission first. And UK intelligence agencies have access to email, social media messages, and web browsing messages.

![FaceID tool of mass surveillance](https://cdn.auth0.com/blog/faceid/tweet.png)

As a result of this surveillance, users are concerned that face recognition is another way to access more personal information. They're flocking to platforms like Twitter to voice their opinion and educate other users on the issues.

Apple has always put its user privacy first, and they need to continue to publicly assert that as their modus operandi.

A good example is Apple's recent software update that prevents advertisers from following Safari users as they browse the web. Advertisers won't be able to track the sites users visit and then show relevant ads. Advertisers aren't pleased because [14.9%](https://www.theguardian.com/technology/2017/sep/18/apple-stopping-ads-follow-you-around-internet-sabotage-advertising-industry-ios-11-and-macos-high-sierra-safari-internet) of people on the internet use Safari. But from Apple's perspective, they're ensuring that users can browse with a level of anonymity.

Even when pushed by law enforcement to release sensitive information [relevant to prosecution](https://gizmodo.com/apple-wont-turn-over-your-phones-data-to-police-if-your-1636197341), Apple hasn't buckled to pressure. For example, iOS 8 phones and beyond are encrypted in a way that Apple can't crack user password. And if they can't crack them, they can't give law enforcement any information from a user's phone even when presented with a search warrant.

Just like Apple, it's in your best interest to put user privacy first so you can boost your users' trust.

### Forced Phone Unlocking

Biometrics are the future of security but are [easy to crack](http://www.complex.com/life/2016/12/kid-buys-250-dollars-pokemon-items-with-moms-thumbprint). This was the problem with TouchID; users can be forced to give their fingerprint to confirm their identity. However, the major difference is it's easy to cover your hands but that isn't the case with a face.

For example, people crossing the US border have the right to refuse requests from customs agents to access their phones. Without a password, there's little authorities can do to unlock devices. People control access to their private information.

But with this new tech, a customs agent only needs to hold up the user's phone to their face to unlock it. Beyond closing their eyes or looking away, there isn't much users can do to refuse. When a face is a password, people can't hide it or withhold it.

In order to make face scans a viable, long-term solution, tech companies should follow Apple's lead and make it about more than just scanning a face. FaceID measures the facial contour and lighting and has a proximity sensor to capture the nuances of different faces. Adding complexities like varying the amount of time users have to look in the camera or requiring voice recognition can give them the power to decide whether or not to comply with law enforcement.

So even if someone holds a phone to your users' face, that alone won't unlock it. And their right to privacy remains intact.

## What a Secure Future Looks Like

With the growth of the Internet of Things, there's the expectation that everything will be available immediately. FaceID caters to this need for immediacy, but Apple and other tech companies have to address the issues that matter most to users.

Here are examples of what tech companies should consider as they innovate new products:

* **Don't lock users into [one password option](https://auth0.com/blog/is-passwordless-authentication-more-secure-than-passwords/).** Let them choose how they want to secure their data. For example, the iPhone 8 defaults to FaceID during setup, but users can press the home button five times to activate the PIN password option.
* **Use [2-factor authentication](https://auth0.com/learn/two-factor-authentication/).** Traditional 2-factor authentication uses a password paired with an auto-generated, random PIN. Biometric 2-factor authentication can instead use a face scan combined with a retinal scan or fingerprint to verify the user and add another layer of security. Since not all users take their data privacy [as seriously as they should](https://www.troyhunt.com/face-id-touch-id-pins-no-id-and-pragmatic-security/), companies can help by making 2-factor authentication mandatory.
* **Limit where face recognition can be used,** especially until the kinks are worked out. For example, use it to unlock phones but not to make payments. Someone other than the user accessing private messages is intrusive, but a stranger accessing private financial information is damaging.
* **Store face scans locally, on devices.** Meaning even if there's a request for scanned data, it isn't available to the company to share. For an added layer of protection, companies can [encrypt the data with a key](https://www.wired.com/story/apples-faceid-could-be-a-powerful-tool-for-mass-spying/) that they don't have access to. This leaves users with power and ownership of their data and helps companies protect user privacy.

{% include tweet_quote.html quote_text="Don't lock users into one password option. Use MFA. Limit where face recognition can be used." %}

## Taking the Next Step

The future is now, and biometrics are the reality. Continued innovation means biometrics not only protect valuable information but also offer ease and convenience. We're still in the early days of this type of tech, so there's still a lot to learn.

What's important is finding ways to protect data and boost user confidence. It doesn't matter how cutting edge new technology is, if users don't trust it, it doesn't do any good.

Users can see the value biometrics offers, so you can ensure a positive experience by being vocal about the strides being made to protect data, how that data is being used and what standards they can expect. The more open they are with users, the better it is for them in the long-term.

Getting users to read terms and condition is one option. Because they don't always do that, send occasional notifications to their phones letting them know what you're doing. Instead of giving them all the information at once, look at it as a kind of drip campaign to gradually educate them on what you're doing and how important it is for them to do their part.

Get in the habit of talking about security with them to help shape their actions and trust your innovations.

{% include asides/about-auth0.markdown %}
