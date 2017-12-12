---
layout: post
title: "How Poor Identity Access Management Equals Security Breaches"
description: "Your Expensive Cybersecurity System Might Have a Gaping Hole"
date: 2017-12-08 08:30
category: Growth, Security
author:     
  name: Story Tweedie-Yates
  url: https://twitter.com/StoryYates
  avatar: https://pbs.twimg.com/profile_images/939046779500216320/eYk0uf-3_400x400.jpg
  mail: story.tweedie-yates@auth0.com
is_non-tech: true
design:
  image: https://cdn.auth0.com/blog/poor-iam/logo.png
  bg_color: "#660232"
tags:
- identity-management
- security
- iam
related:
- 2017-11-29-5-massive-benefits-of-identity-as-a-service-for-developers
- 2017-05-11-data-breaches-by-the-numbers
- 2017-11-10-4-security-measures-after-data-breach
---

Fort Knox, built in 1935, is the most secure place on Earth. The perimeter of the fort is guarded by almost every security measure you can think of including landmines, laser-guided guns, motion detectors, armed guards and a 25-inches-thick vault door made of a torch and drill-resistant material. It is a firewall on steroids!

![Fort Knox fun facts and the defense.](https://cdn.auth0.com/blog/poor-identity/fort-knox-secrets-fun-facts-and-the-defense.jpg)

While the perimeter security seems impenetrable, that is not what makes Fort Knox so undesirable to thieves. The major reason there has never even been a breach is due to Fort Knox's strict Identity Access Management (IAM) policy.

To ensure there is never a breach, no one person has access to the safe's combination. Rather, the code is distributed among a group of high-level officials that are never there at the same time. Even if a group of highly trained ninjas was able to somehow infiltrate the fortress, no one could access the gold there.

![Ninja hacking](https://cdn.auth0.com/blog/poor-identity/8dc30fc519280aac21a03d7a118f4b7a_600.jpg)

Companies need to strengthen their own Identity Access Management approach for similar reasons. Most cybercriminals are not hacking ninjas who try to break through your complex, super secure firewalls. They simply steal an employee's credentials and walk right in.

Here are 3 data breaches to some of the world's strongest cybersecurity systems that could have been prevented with stronger identity access management.

## 1. How the #1 Cyber Security Consultancy in the World Left a Key in the Door

Deloitte, one of the world’s largest accountancy firms with over $38 billion in revenue, has been ranked #1 in cybersecurity consulting by Gartner for 5 years in a row. And they just experienced a [major data breach due to poor Identity Access Management](https://www.theguardian.com/business/2017/sep/25/deloitte-hit-by-cyber-attack-revealing-clients-secret-emails).

As an accounting company with terabytes of sensitive financial and personal data, Deloitte has a robust, multi-layered security system. They have the resources to buy and implement every security measure available, yet the hackers were able to bypass it all with a simple password.

![Hacker guessing credentials.](https://cdn.auth0.com/blog/poor-identity/hacker-username-password-login-e1466154102580.jpg)

The hackers infiltrated the global email server through an administrator’s account that simply required a single password. According to [sources](https://www.theguardian.com/business/2017/sep/25/deloitte-hit-by-cyber-attack-revealing-clients-secret-emails), Deloitte did not use two-step verification. Once inside, they accessed confidential client emails and documents, including sensitive information of world governments.

Deloitte's lack of identity access management left them extremely vulnerable. They basically built a giant fortress around their data but left the keys in the door.

{% include tweet_quote.html quote_text="Not giving the right attention to identity access management can be very harmful to your company." %}

### Implement 2FA Everywhere

Millions of passwords are compromised every day. Even if you lose credentials through a phishing scheme or a lost device, [two-factor authentication (2FA)](https://auth0.com/learn/two-factor-authentication/) makes it really difficult for thieves to gain access.

Deloitte's data breach could have been easily prevented with 2FA, which is a standard Identity Access Management best practice used by companies of all sizes, including small businesses. When a password is compromised, two-factor authentication protects access by requiring a second set of information, such as an SMS code or a fingerprint.

![Multifactor authentication with fingerprint.](https://cdn.auth0.com/blog/poor-identity/tfa-what.png)

2FA is so effective, [experts believe](https://www.slideshare.net/cheapsslsecurity/vip-strong-authentication-no-passwords-infographic-by-symantec) that 80% of breaches, including Deloitte, could have been avoided if they had implemented 2FA. In the same way no one person has the complete code to Fort Knox's safe, the safety of your valuable data should not hinge on a single password.

While implementing 2FA for a large organization can seem like an overwhelming internal project, some of the biggest companies in the world are saving time and money by partnering with third-party Identity Access Management technologies like Auth0 that have 2FA [already built in](https://auth0.com/learn/two-factor-authentication/).

## 2. How Hackers Spent 229 Days Inside One of the Largest eCommerce Platforms

The most used eCommerce platform, eBay, suffered a devastating data breach when cybercriminals got into the company network using employee credentials. While any type of hack is worrisome, eBay's had an [extraordinary twist](https://www.alertlogic.com/blog/the-ebay-breach-in-review/) — the thieves remained in the system for over 7 months.

During that time, they had inside access to search for the most sensitive and valuable data within eBay's vast system and they hit the jackpot. The breach exposed the names, addresses, dates of birth, phone numbers and encrypted passwords of all of its 145 million users.

![ebay asking users to reset their password](https://cdn.auth0.com/blog/poor-identity/ebay-password.jpg)

Hackers obtained stolen credentials through an elaborate [social engineering](http://blog.trendmicro.com/social-engineering-attacks-rise-part-1-ebay-breach/) scheme, which could have been prevented with stronger Identity Access Management tools like 2FA and [password encryption](https://auth0.com/rules/encrypt-sensitive-data). But the more troubling aspect of this incident was that eBay did not detect the unauthorized users behind their firewall for 229 days.

### Track User Actions and Behaviors

One of the most important benefits of an Identity Access Management technology is the ability to track your user's behavior throughout the system. Seeing where your users are in the system gives you more insight into what applications and data they are accessing, but more importantly, it can alert you to any sudden changes in the behavior.

[Anomaly detection](https://auth0.com/docs/anomaly-detection) identifies suspicious activity such as a login from a new IP address or multiple failed password attempts. If the eBay hackers were accessing the system from an unauthorized IP address or displaying erratic behavior, user tracking would have flagged the occurrence much sooner.

![Anomaly detection on authentication](https://cdn.auth0.com/blog/poor-identity/unusual-activity.png)

In addition, the ability to track your users provides an audit trail. If there ever is a breach, you have the data to quickly identify how it happened and then work to troubleshoot and minimize the damage.

With a tool like Auth0, which was designed to track user behavior across applications, your IT team never has to worry about updating or building new Identity Access Management capabilities as your systems change and network expands.

## 3. How Hackers Tricked Top Movie Executives to Give Them Access

Sony Pictures Entertainment made an offensive movie about North Korea's leader, Kim Jong-un. Shortly after the movie release, Sony suffered a huge data breach, which [Fortune](https://www.cnbc.com/video/2015/06/26/inside-sonys-hack-of-the-century.html) called, *The Hack of the Century.*

While much of the hype and news around the hack was centered on possible North Korean involvement, what often gets missed is the way it happened. The hackers didn't beat the security system with advanced technology or a fancy decryption algorithm. They simply tricked Sony executives to give them their usernames and passwords.

The attackers sent [phishing emails](https://www.tripwire.com/state-of-security/latest-security-news/sony-hackers-used-phishing-emails-to-breach-company-networks/) in the form of Apple ID verifications. Each email led to a fake website that stole the executives' Apple credentials. They used the Apple passwords in conjunction with social media sites to guess their way into Sony's network.

![Legit or phishing scheme email?](https://cdn.auth0.com/blog/poor-identity/legit-or-scheme.png)

Once inside, the hackers used malware to disrupt the company's networks and steal over 100 terabytes of data, some of which was posted online for the world to see.

The Sony executives had no idea that they had been duped. In fact, a recent survey found that [97% of people](https://blog.returnpath.com/10-tips-on-how-to-identify-a-phishing-or-spoofing-email-v2/) can't identify a phishing email.

### Geolocation Tracking Flags Suspicious Logins

Hackers steal credentials all the time, which is why security-aware companies put additional measures in place to prevent unauthorized access when a password is stolen. One feature from Auth0 that could have flagged the Sony attack is geolocation tracking.

Auth0 provides an intuitive way to customize the login process by utilizing the [rules feature](https://auth0.com/university/1/4/how-to-use-auth0-s-rules-feature). You can configure logins to limit people by location by using geolocation data that is set per user. If the hackers were accessing the data from a different location, Sony would have been notified by the system.

As for phishing schemes, the first line of defense in strengthening your Identity Access Management is not always technology, it's [employee training and awareness](https://auth0.com/blog/4-security-measures-after-data-breach/). In [almost every](https://www.csoonline.com/article/3225471/security/please-dont-send-me-to-cybersecurity-training.html) data breach, there is some aspect of human error.

![Employee training and awareness about phishing schemes](https://cdn.auth0.com/blog/poor-identity/legit-or-scheme-2.png)

A strong Identity Access Management approach requires a mix of informed employees and the technology tools to initiate, track and manage user identities and their access permissions across your entire network.

{% include tweet_quote.html quote_text="A strong Identity Access Management approach requires a mix of informed employees and tools to initiate, track and manage user identities." %}

## Your Expensive Cybersecurity is only as Strong as Your Identity Access Management

Fort Knox has the most advanced weapons and security measures in the world guarding its gold. So why would the U.S. government take the extra step to create an identity access management layer to protect its $1 trillion?

When identity is compromised, advanced perimeter security is not enough.

Companies are going to spend over [_$100 billion_](https://www.forbes.com/sites/stevemorgan/2015/12/20/cybersecurity%E2%80%8B-%E2%80%8Bmarket-reaches-75-billion-in-2015%E2%80%8B%E2%80%8B-%E2%80%8Bexpected-to-reach-170-billion-by-2020/#3e459f3330d6) on cybersecurity this year to fortify their systems to be as strong as Fort Knox, but without a strong Identity Access Management strategy, they could be building a very strong fortress while forgetting to lock the door.

As your security perimeter grows well beyond the firewall, your Identity Access Management technology must adapt to new applications and security risks. Auth0 was built by security experts to anticipate these new user trends so your Identity Access Management technology is always updated to protect access, giving you the peace of mind to focus on your core business.
