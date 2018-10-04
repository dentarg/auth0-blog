---
layout: post
title: "Mission Possible: Reality for 7 GDPR Misconceptions"
description: "We demystify 7 common misconceptions about GDPR. Make sure you are informed about data protection and GDPR compliance requirements."
longdescription: "We've deciphered 7 recurring misconceptions from customers regarding GDPR and identity for the apps they build. Make sure you are aware of the reality and better informed around data protection and GDPR compliance requirements."
date: 2018-01-15 1:00
category: GDPR
is_non-tech: true
banner:
  text: "Auth0 makes it easy to add authentication to your application."
author:     
  name: Story Tweedie-Yates
  url: https://twitter.com/StoryYates
  avatar: https://pbs.twimg.com/profile_images/939046779500216320/eYk0uf-3_400x400.jpg
  mail: story.tweedie-yates@auth0.com
design:
  image: https://cdn2.auth0.com/blog/get-ready-for-gdpr/logo.png
  bg_color: "#222228"
tags:
- gdpr
- regulation
- security
- identity
- compliance
- data-protection
- identity
- iam
related:
- 2017-05-03-get-ready-for-gdpr
- 2017-08-07-gdpr-fight-against-fake-news
- 2018-01-17-jumpstart-identity-innovation-with-gdpr
---

 <div class="alert alert-info alert-icon">
  <i class="icon-budicon-500"></i>
  <strong>GDPR is around the corner. Are you Ready? Take our GDPR Readiness Assessment to find out. <a href="https://auth0.com/gdpr-assessment/tool-1">Start the survey</a>.</strong>
</div>

---

Did you feel like you had a clear direction for your business when it came to customer experience, acquisition, and the competitiveness of your services and apps... but then [GDPR](https://auth0.com/gdpr) came around and now everything has a giant question mark in front of it? If you are confused about how to move forward, you are not alone.

![GDPR - General Data Protection Regulation](https://cdn2.auth0.com/blog/get-ready-for-gdpr/gdpr-flag.png)
 
We've deciphered seven recurring misconceptions we hear from customers regarding GDPR and identity for the apps they build. Your mission here, should you choose to accept it, is simply to read the reality.

{% include tweet_quote.html quote_text="We've deciphered seven recurring misconceptions we hear from customers regarding GDPR and identity for the apps they build." %}
 
## Misconception #1: An identity vendor can make you GDPR compliant.

If we put all our user data in Auth0's platform, all things GDPR (not just Identity-related) are covered and your liability is now Auth0's liability.

### Reality:

No identity vendor can make you GDPR-compliant. Not even Auth0. 
As the entity controlling what happens to the personal information—collecting the data, providing notifications, and obtaining consent—you're ultimately responsible for compliance. Making sure that your vendors (like Auth0) are compliant is part of your GDPR requirement process, but vendor compliance doesn't shift your liability to the vendor.

{% include tweet_quote.html quote_text="No identity vendor can make you GDPR-compliant. Not even Auth0." %}

The relationship with an identity vendor is in terms of the two levels of data responsibility for GDPR compliance, classifying you as either a data owner or a data controller. 

If you're using Auth0, you're the data controller and we (Auth0) are the data processing providers. ([More on data controller/data processor responsibilities can be found here](https://www.gdpreu.org/the-regulation/key-concepts/data-controllers-and-processors/).)

An identity vendor like Auth0 can make your GDPR efforts easier by helping secure, track, and update consent at login, as well as gaining a consistent view of user identities. 
 
## Misconception #2: The best way for your users to stop receiving unwanted emails is to enact the [right to erasure](https://gdpr-info.eu/art-17-gdpr/). 

### Reality: 

GDPR makes it critical for you to understand what your customers really want.

There will be times when your customer really wants you to erase all their data. And times when they just want you to stop sending them email. And times when the customer really wants to stop receiving 3rd party 'partner' emails (spam) but wants to continue receiving useful emails from you.

If your customer wants to stop all marketing emails or just third-party emails, they can [enact the right to object](https://gdpr-info.eu/art-21-gdpr/). You'll stop the communications, but retain approved data.

The right to erasure is more complete. When you erase all of the data, the customer's opt-in/opt-out preferences also go away, which means that at some point in the future, they might give you personal information which could put them back into the pool of customers who regularly receive your emails—exactly what they might have been trying to avoid with 'erasure.'

Making the distinction between the right to erasure and the right to object clear for your customers can get them what they really want. 

Auth0 can help you easily track and provide granular consent options at sign-in to exclude marketing emails. For customers who want to change their consent after login, you'll need to decide where you would like to locate granular consent options within your application.
 
## Misconception #3: Social login will raise compliance issues by capturing too much customer information.

### Reality:

We've found that social logins reduce user friction and enable conversions. Under GDPR your can only request the information you need to provide your service, whether you get that information directly from the customer when they fill in the fields in your forms, or from Facebook, Twitter, or another social login. 

You can quickly review a social provider's external-facing web pages to learn what user information they provide at login and determine whether or not it's necessary for your business services. 

Here's what's available from some of the most popular providers accessed by our customers:

* [LinkedIn](https://developer.linkedin.com/docs/fields/basic-profile#)
* [Facebook](https://developers.facebook.com/docs/facebook-login/permissions#reference-public_profile)
* [Google](https://developers.google.com/identity/sign-in/web/reference#googleusergetbasicprofile)

Auth0 offers a simple checkbox to easily control the data you collect from social vendors like LinkedIn, Facebook, and Google, making it easier to comply with GDPR's 'data minimization' requirements.
 
## Misconception #4: If you have an on-premises deployment for identity, this will automatically help you achieve GDPR compliance.

### Reality: 

An on-premises deployment of identity for the apps you build will not automatically help you achieve GDPR compliance. What matters fundamentally is how that data is processed. For example: 

* If you have an on-premises deployment but you are still putting data into that on-premises device that is above and beyond what is required for the purposes of your business, you will still have a GDPR compliance issue.
* If your users' data is on-premises but it is stored across multiple instances and you don't know what is where, you might have difficulty gaining explicit consent for your users across all the apps they are accessing. You might have consent from one application but not the other. 

There is nothing innate to GDPR that says having an on-premises deployment will make you compliant. For more information about what it means to [process personal data, according to GDPR, see Article 4](https://gdpr-info.eu/art-4-gdpr/).

## Misconception #5: If you are using a cloud instance that is hosted in the EU for the purposes of processing EU users' personal data, this will help you comply with GDPR.

### Reality: 

Having a cloud instance in the EU will not help you comply with GDPR if that data is then being processed outside of the EU. 
The key is to pay attention to where the processing of the data is taking place, not where the data center is hosted. 
 
## Misconception #6: If you are already certified with privacy shield, you are ready for GDPR.

### Reality: 

[Privacy Shield Certification](https://www.privacyshield.gov/welcome) is a great start, but there are some significant differences between GDPR and privacy shield.

For example, you're going to need to do some additional work on the 'right to erasure' for foreign processing of EU residents' data as well as making sure you've met Data Protection Officer and breach notification requirements. Other differences include [fines](https://resources.auth0.com/whitepaper/gdpr-fine-determination/) and possible timing around responses to data 'subject access requests'.
  
## Misconception #7: Shouldn't my legal team be able to tell me exactly how I can achieve compliance?

### Reality: 

It is very possible that your legal team does not yet have an opinion on how to interpret the GDPR regulation. There are currently no court cases testing interpretation, ambiguities, or inconsistencies between GDPR and other regulations, or even an audit that can show you whether or not you are compliant. 
That being said, the best route is to regularly consult with your privacy officer and legal team so you can chart a path toward GDPR compliance together. 

The European Union (EU) also has an advisory body that provides expert advice on data protection matters. Official GDPR guidance from the Article 29 Working Party (WP29) can be found here, or get in touch with your legal counsel.

We've also found drawing on experts in the field to be extremely helpful.   

## Is your IAM ready for GDPR?

Mission Complete! Neither you nor this message will self-destruct. Now you're ready to take the GDPR identity assessment to see where you stack up and where you might need to make improvements on the path to [GDPR compliance](auth0.com/gdpr-assessment/).
 
What misconceptions have you heard? Do you have any questions you would like us to help with? Let us know in the comments below and help other people benefit from the reality!
