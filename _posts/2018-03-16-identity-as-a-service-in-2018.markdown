---
layout: post
title: "Identity-as-a-Service in 2018: What's New?"
description: "Between GDPR, biometrics and the blockchain, 2018 promises to be a big year for identity."
longdescription: "Blockchain, with its immutable nature for data storage; Biometrics with Apple's Face ID at the front; and EU's with its new GDPR enforcement, are changing the landscape of identity. Keep reading for the breakdown of the top identity-as-a-service trends of 2018."
date: 2018-03-16 12:30
category: Hot Topics, Trends
is_non-tech: true
author:
  name: Martin Gontovnikas
  url: http://twitter.com/mgonto
  mail: gonto@auth0.com
  avatar: https://www.gravatar.com/avatar/df6c864847fba9687d962cb80b482764??s=60
design:
  image: https://cdn.auth0.com/blog/idaas-in-2018/logo.png
  bg_color: "#222228"
  image_size: "70%"
tags:
- identity
- identity-as-a-service
- identity-management
- idaas
- blockchain
- face-id
- gdpr
related:
- 2018-01-26-security-predictions-for-2018-that-go-beyond-gdpr-compliance
- 2018-02-02-3-ways-to-get-an-iam-budget-in-2018
- 2017-12-08-how-poor-identity-access-management-equals-security-breaches
---

The New Year is bringing with it a rapidly growing desire to keep individual identity safe—on a state and geopolitical level, as well as a personal level. 

We're seeing unprecedented new privacy controls with the impending enforcement of [GDPR](https://www.eugdpr.org/), the EU's massive regulatory attempt to secure and protect consumer data. With this comes new rights for the individual (e.g. the Right to Be Forgotten or the Right to Erasure).

The ways we conceive of and secure individual identity seems to be changing. New biometric technologies are transforming what we consider unique versus what might be replicable. 

And pushing the boundaries of the blockchain is creating new pathways for decentralizing consumer data from their current pools.

While all of these realms have the potential to bolster individual privacy, some have concerns about these strategies' efficacy and potential for widespread adoption.

Keep reading for the breakdown of the top identity-as-a-service trends of 2018.

{% include tweet_quote.html quote_text="Identity is a complex and changing topic, want to know what's new in 2018? Check it out!" %}

---

## Top Identity-as-a-Service Trends for 2018
### Blockchain/cryptocurrency
2017 was clearly an enormous year for bitcoin, Ethereum, and a range of cryptocurrencies. Although the technology remains divisive ([PwC](https://www.pwc.com/us/en/financial-services/publications/assets/pwc-cryptocurrency-evolution.pdf) calls cryptocurrencies one of the “greatest technological breakthroughs since the Internet,” while others describe them as a money-sucking “black holes”); it still highlights some incredible opportunities. 

![Ethereum](https://cdn.auth0.com/blog/idaas-2018/1-ethereum-price-fb.jpg)

> [Image source.](https://ethereumprice.org/wp-content/uploads/2017/12/ethereum-price-fb.jpg)

The decentralized nature of the blockchain avoids large, consolidated pools of data, which are ripe for hackers. 2018 will see entrepreneurs moving ahead with developing their own systems, built on advanced distributed ledger technology, and designed to give users more power over their individual information. 

Distributed ledgers can separate personal data, duplicate it thousands of times, and disperse it globally—but true ownership of the data remains with the individual. 

For example, individuals who use the startup [Civic](https://www.civic.com/) start by entering a range of personal data into Civic's app; Civic then verifies all of this through a government agency or other third party verification service. Once verified, Civic converts this data into a cryptographic hash.

After Civic creates a hash for this user, the company uploads it into its public blockchain. Next, when the user wants to authenticate on a new platform, she will input her data as requested, and the platform will route this information through Civic's special algorithm. If the algorithm reveals that the individual's information matches the hash in the blockchain, she is verified, and the platform can erase her data.  

No one knows how (or whether) the blockchain will definitely be used to manage identities going forward. Some argue that the distributed system actually offers more surface area for attacks; others sense that giving a user the power to manager all of his or her personal data would be too complicated and/or overwhelming to facilitate in the coming years. For more on the future of the blockchain + identity management, check out our [post dedicated to it](https://auth0.com/blog/how-the-blockchain-could-change-the-idea-of-identity/) and our guide to [Ethereum and smart contracts](https://auth0.com/blog/an-introduction-to-ethereum-and-smart-contracts-part-2/).

### Biometrics
Biometrics also made some important strides in 2017, including the launch of Apple’s iPhone X facial recognition feature. Although this [didn’t quite gain the traction](https://www.theguardian.com/technology/video/2017/sep/12/apple-iphone-x-facial-recognition-face-id-fail-launch-video) anticipated, the launch a sign of what's to come in 2018. 

![Face-id](https://cdn.auth0.com/blog/idaas-2018/2-face-id.jpg)

> [Image source.](http://s.newsweek.com/sites/www.newsweek.com/files/styles/embed-lg/public/2017/12/18/abababa.jpg)

In addition to more widely used biometrics for identity verification, such as iris or retina recognition, facial, fingerprint, hand, and DNA usage; emerging technologies that we'll see in the mainstream in 2018 include:

- Voice recognition. Auth0 already has a means of helping users [authenticate](https://auth0.com/blog/two-factor-authentication-using-biometrics/) via voice recognition with our partner, Twilio. With Twilio, the user automatically receives a call when an authentication request comes in. The call asks the user to provide his associated authentication phrase, then records and sends it for verification. This new approach has quickly gained traction, given how familiar users are with phone calls. 
- Typing recognition. While this has been slower to stick in U.S. markets, many financial firms in Norway have widely adopted the strategy. Typing recognition identifies individuals' unique habits, including key pressure and rhythm of tapping. One company boasted a [99.7%](https://www.hottopics.ht/stories/consumer/dont-go-hacking-my-heart-10-startups-at-the-frontier-of-biometric-authentication/) success rate at distinguishing real from fake users.

More, intriguing biometric technologies are rapidly improving for identification purposes. Here are a few, which we might not see widespread adoption of in 2018, but which could replace or be used in tandem with facial, voice, and typing recognition by 2020:

- Ear recognition. As strange as it may sound, each of us has a wholly unique ear shape, which doesn't change as we age.  While the technology for highly accurate ear recognition exists and is theoretically ready to use, applications of ear recognition are being refined and tested, and are still not widespread.
- Gait analysis. This involves identifying an individual via a number of data points, surrounding his or her gait, including speed and joint movements. Although gait movement doesn't take much effort on the part of the individual, for public IDaaS use, we still need more powerful technological infrastructure (e.g. under-skin chips). At the moment gait analysis is most popular with trainers, who us it to determine athletes' efficiency. 
- Body modifications (Bodymod). The idea of embedding, injecting, or ingesting technology seems [Matrix-like](https://clairedowler.files.wordpress.com/2013/07/worm.jpg) for many of us; perhaps that's why it has yet to really gain traction for identity purposes. Although radical, a few have tried it. Recently a senior BuzzFeed reporter [implanted a chip in his hand](https://www.buzzfeed.com/charliewarzel/yes-we-scan?utm_term=.rvybjNzVOX#.hgpyDE14O2) and successfully purchased goods by connecting it to a mobile paying app. 

![Implanted chip](https://cdn.auth0.com/blog/idaas-2018/3-implant.jpg)

> [Image source.](https://www.buzzfeed.com/charliewarzel/yes-we-scan?utm_term=.tfbvlW0ymZ#.ef3E3VXewz)

For more emerging biometrics technologies for identity, see [here](https://auth0.com/blog/the-state-of-biometric-identity-in-2017/).

Biometrics add another dimension to the identification process. More than multi-factor authentication, which usually involves a series steps, using alphanumeric characters, and requiring a user's smartphone; biometrics brings in an extra piece of information (e.g. a human body), over and above a piece of hardware. Adding these unique human factors makes identity theft far more complex for a hacker than simply stealing an individual's password.

### New data regulations in the EU
2018 will see a rush among European companies to comply with the EU’s [General Data Protection Regulation](https://www.eugdpr.org/) (GDPR). Officially adopted April 27th, 2016, GDPR becomes officially enforceable May 25th, 2018 and applies to all those in the EU who control data and/or undertake data processing.

![GDPR Compliance Checklist](https://cdn.auth0.com/blog/idaas-2018/4-gdpr-compliance-checklist.png)

> [Image source.](https://www.lepide.com/infographics/gdpr-compliance-checklist.png)

After May organizations found not to be in compliance (i.e. without adequate security measures in place for consumer data) could be fined up to 20 million euros or 4 percent of annual global turnover—whichever is higher. Despite these stiff punishments, a lot of European companies are still far from ready. Studies show that in Ireland, for example, [a quarter of organizations](https://www.independent.ie/business/technology/gdpr/almost-one-quarter-of-irish-firms-will-be-forced-to-close-if-subject-to-gdpr-fines-survey-36131915.html) would be forced to shut down if audited. Lots of companies still continue to transmit sensitive personal data through vulnerable email channels, for example. 

This opens even more possibilities for IDaaS providers in 2018. Strong, flexible identity management is essential to keeping user identities safe and allowing them to comply with the new GDPR rules like:

- A new Right To Data Portability;
- An extended Right To Be Forgotten (also called the Right to Erasure);
- An enhanced Subject Access Right - to be free and with a shorter time to reply.

Although an IDaaS provider, like Auth0, can't ensure your organization will be fully compliant, we and others have lots of tools that can help

## New Year, Big Moves in IDaaS
Demand from new regulations, paired with a lot of excitement and [funding](https://www.theverge.com/2017/4/18/15332742/us-border-biometric-exit-facial-recognition-scanning-homeland-security), pushing new technologies, like biometrics and distributed ledger opportunities, into the mainstream, has opened a lot of new avenues for IDaaS in 2018. Look for more people taking selfies to sign on, investors seeking out blockchain startups that focus on personal data security, and European companies panicking to meet their looming May deadline. And this could just be a start.

{% include tweet_quote.html quote_text="Blockchain, biometrics, data protection regulations. Which of these will define the trend for 2018 on identity?" %}
