---
layout: post
title: "The State of Biometric Identity in 2017"
description: "The good, the bad, and the future of Biometric Identity."
date: 2017-05-04 8:30
category: Growth, Identity, Biometrics
is_non-tech: true
author:
  name: Diego Poza
  url: https://twitter.com/diegopoza
  avatar: https://avatars3.githubusercontent.com/u/604869?v=3&s=200
  mail: diego.poza@auth0.com
design:
  image: https://cdn.auth0.com/blog/state-of-biometric-identity-2017/logo.png
  bg_color: "#9F5F5F"
related:
  - 2016-11-30-different-ways-to-implement-multifactor
  - 2015-12-17-json-web-token-signing-algorithms-overview
tags:
  - biometric-identity
  - multifactor-authentication
  - passwordless
  - multifactor
---

If we have any hope of a future with all-around passwordless, friction-free authentication, it will probably come at the hands of biometrics. 

A biometric identity is the unique physical features of your person that can be used to identify you. The classic example is fingerprints, which have been used to identify criminals since the 1800s. But now, much more than the fingerprint is used to identify people — for less sinister reasons than criminal identification. 

And the future only promises more innovation in the field of biometric authentication. From gait analysis to the way you use a computer, biometric authentication still has plenty of room to grow.

## Biometrics of today

There are a large number of biometric options available today, some more used than others. Here's a quick rundown of what's in place and how they're generally used.

## Widely Used

The most widely used biometrics are generally used by the government or large companies to verify your identity. One popular application of biometrics is in border security, where it is used as a way to confirm someone's identity in addition to their passport. Banks and hospitals are also big users of biometrics, in part because they secure large amounts of sensitive data. 

Of course, with facial and fingerprint recognition available in many smartphones and computers. Day-to-day, many consumers use biometric authentication habitually, whether it's unlocking one's phone or signing into an app.

Another huge use of biometrics is in law enforcement. While most people thankfully don't come up against this use, it is an extension of the government's ability to store large amounts of biometric data, which is important for its widespread adoption.

### Eyes: Iris or Retina Recognition

An individual may be identified by a scan of their eye, either looking for unique patterns in the iris or vein patterns in the retina. Both are unique to individuals and may be verified against a digital copy. The largest use of iris or retina recognition currently is by governments at border control or to verify benefits recipients. Smartphones with the capability to scan eyes have been released, but fingerprints remain much more common on personal devices.

![Retina recognition](https://cdn.auth0.com/blog/state-of-biometrics-2017/iris.png)

([source](http://www.iritech.com/blog/iris-biometric-safe/))

### Face Recognition

Face recognition is made possible by taking features of the face (ex the distance between eyes) and using those to match a face stored in a database. There are many methods of analysis currently in use for accurate facial recognition, and the field is still developing. Face recognition is widely used by the US and other governments, is available for device login, and is also used by cameras and social sites to identify faces in photographs.

### Fingerprint Recognition
One of the most widely known ways to identify and individual biometrically is with their fingerprint. Everywhere from police stations to border control to your iPhone, you can be identified by the ridges and valleys on the tips of your fingers. 

### Other Hand Recognitions
Fingerprints aren't the only unique features of the hand — anything from dimensions of fingers to vein patterns in the palm to a palmprint may be recorded and used to identify an individual. Other hand recognitions are not as common as fingerprints, but are gaining in popularity everywhere from the FBI to hospitals.

![Palm scan](https://cdn.auth0.com/blog/state-of-biometrics-2017/nyu-langone-patientsecure-palm-scan-620.jpg)

(Vein matching scan | [source](http://www.cbsnews.com/news/patientsecure-biometric-palm-scan-system-hospital-security/))

### DNA
DNA recognition is probably the only form of biometric authentication on this list that isn't easy to understand, because it relies on the isolation, copying and splitting of genetic markers in our DNA to identify us as an individual. Though widely used and very accurate, from court evidence to paternal testing to gene therapy, it doesn't have the immediacy needed to be used for something like border security.

## Emerging 

There are some biometric technologies that are still being refined and implemented, but are already available for use. Among these, voice recognition may be the most widely available, especially in the financial sector, although the development of voice technology still leaves much to be desired. 

It remains to be seen if these will become widely adopted, or pushed out of the way by newer technology. Either way, it's possible that you'll one day soon be able to be identified by the following:

### Typing Recognition
Already widely used by Norwegian financial firms, typing recognition identifies individual by their unique habits using a computer keyboard, from key pressure to rhythm of tapping. One company boasted a [99.7%](https://www.hottopics.ht/stories/consumer/dont-go-hacking-my-heart-10-startups-at-the-frontier-of-biometric-authentication/) success rate at distinguishing real and fake users. 

### Ear Recognition
You may not know that the human ear is unique to every individual, for we are born with more or less the ear shape we'll have for the rest of our lives. While the technology for highly accurate ear recognition exists and is theoretically ready to use, applications of ear recognition are being refined and tested, and are still not widespread. 

### Voice Recognition
From the sound of your voice to the cadence of your breath, voice recognition takes ~[100 datapoints](https://www.theguardian.com/technology/2016/feb/19/how-safe-is-voice-recognition-fingerprint-id-hsbc) from your speech to identify you as a unique individual. It is starting to be implemented in bank security and also by some governments.

## Biometrics of tomorrow

The future of biometrics is likely to try and move towards identifications that are easier and easier for users. Things like gait analysis don't take any real work on the part of the individual, like putting a finger or palm a scanner. They will rely on more powerful technological infrastructure becoming available in public areas, whether that's an easier way to read under-skin chips or better touchscreens for finger writing.

It is, of course, possible that these technologies won't be significantly better than the developments made in our current biometric authentication methods — but there's only one way to find out.

### Gait Analysis
An individual can be identified by a number of data points surrounding their gait, including speed and joint movements. Gait analysis is sometimes used for efficiency of motion in elite athletes, but people are still trying to figure out the best way to implement gait analysis for identification, and what the limits of its applications are. 

### Body Modifications (Bodymod)
While certainly not adopted by the masses, people like PayPal's Jonathan Leblanc have [talked](https://www.hottopics.ht/stories/consumer/dont-go-hacking-my-heart-10-startups-at-the-frontier-of-biometric-authentication/) about bodymod as a way to attach unique identification to a person, rather than relying on their underlying biological identity. Could embedding, injecting, or ingesting technology could be the future of authentication? He's not the only one that thinks so — a senior BuzzFeed reporter got a chip implanted in his hand and successfully purchased goods by connecting it to a mobile paying app. Radical? Yes, but also possible. 

![Gait analysis](https://cdn.auth0.com/blog/state-of-biometrics-2017/gait-analysis.png)

([source](https://www.buzzfeed.com/charliewarzel/yes-we-scan?utm_term=.ctLeR0e7ZZ#.hg09LO9Voo))

### Finger Writing
With repeated writing on a touch screen, computers can recognize a “signature” in your finger writing — your unique way of writing without a pen. This data could theoretically be stored and used in any number of ways. For example, instead of punching in a PIN number, you might write a phrase on a screen. Finger writing to date has been given an extremely high level of accuracy, with confidence up to [99.97%](http://resources.infosecinstitute.com/biometrics-todays-choice-future-authentication/#gref). 

### Computer Interaction
Like typing recognition, computer interaction relies on the unique way an individual interacts with a computer, from typing speed to common spelling mistakes. It is currently [being developed](http://resources.infosecinstitute.com/biometrics-todays-choice-future-authentication/#gref) at West Point, but there are definitely civilian applications for the tech — imagine if you just had to write a quick email to get through customs or to apply for a visa.

## Are biometrics safe?

Biometrics *are* safe. There are a lot of hyperbolic fears about people who are worried that if they have a cold voice recognition won't work, or that people will be cutting off fingers to get around fingerprint scanners. 

Well, remember those 100 datapoints that advanced voice recognition takes? They can determine you are you if you have a cold, and can even distinguish between voice imitators that sound so similar the human ear might confuse them for the same person. 

Biometric authentication checks aren't 100% foolproof, but it shouldn't be cause for concern. Unfortunately, there are weaknesses for every system. The weaknesses in biometric systems certainly aren't any higher than those in a username + password system, which we rely on now.

Let's put it this way — nobody is going to make a 3D printed version of your face to fool a scanner, unless you're an *extremely* powerful public figure. 

![3D Face Scan](https://cdn.auth0.com/blog/state-of-biometrics-2017/3d-face.png)

(Source: [The Memo](http://www.thememo.com/2017/03/02/how-secure-is-your-face-the-worrying-world-of-biometrics/)) 

If you are a powerful figure, you might want to avoid a total reliance on biometrics to configure a multifactor login with a complex, unique password and multiple devices involved in login.

Most people simply aren't going to be targets of biometric identity theft, especially as technology gets more sophisticated and takes more and more data into account when making identifications. As it is now, biometric authentication is probably better than having “1234567” or “0000” as your password, anyway.

## The bio-future

Biometric authentication clearly has a long way to go before we exhaust its possibilities. From government identification to healthcare to banking, from consumers unlocking their devices to evidence in a courtroom, where biometric authentication isn't the norm, it's likely to become the norm in the future. 

With more development, we could sharply reduce the use of passwords, identification documents, and PIN numbers. Biometrics are here to stay — and the best part is that once they're in place, you might never have to remember any passwords again.
