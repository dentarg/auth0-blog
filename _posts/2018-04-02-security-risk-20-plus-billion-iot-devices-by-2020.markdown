---
layout: post
title: "Security Risk: 20+ Billion IoT Devices by 2020"
description: "Unprotected IoT devices can make it easy for bad guys to cause global damage—botnets increased 140% last year. Auth0 can help safeguard your IoT devices."
longdescription: "With more than 20+B connected devices predicted by 2020 and IoT botnets disabling hospitals in the UK and impacting services like Netflix and Github, the UK is advocating global standardization. Auth0 can help safeguard the IoT devices you currently have in use while you’re waiting for secure standards."
date: 2018-04-02 14:15
category: Hot Topics, Security, Breaches
is_non-tech: true
author:
  name: "Jenny O'Brien"
  url: "https://www.linkedin.com/in/jenny-o-brien-storyteller/"
  mail: "jennifer.obrien@auth0.com"
  avatar: "https://cdn.auth0.com/blog/avatars/jenny-obrien.png"
design:
  bg_color: "#22228"
  image: https://cdn.auth0.com/blog/security-risk-iot/logo.png
tags:
- IoT
- Botnet
- Mirai
- Reaper
- WannaCry
- Secure-By-Design
- IoT-authentication
related:
- 2018-02-27-8-ways-to-avoid-healthcare-breaches
- 2018-02-14-what-is-data-security
- 2018-03-22-cambridge-analytica-and-facebook
---

## Is the UK’s ‘Secure By Design’ the Answer? 

If 2017 was the year of the cyberattack, 2018 could be the year when IoT attacks make you feel like you’re living through a personal version of [Taken](https://www.youtube.com/watch?v=uPJVJBm9TPA&feature=youtu.be).

{% include tweet_quote.html quote_text="Unprotected IoT devices can make it easy bad guys to cause global damage — botnets increased 140% last year. Auth0 can help safeguard your IoT devices" %}

Accessing vulnerable IoT devices, cybercriminals can grab photos of your kid; drain your bank account; alter your health records; hold your coffee maker, thermostat or vehicle hostage; and stop your heart (if you have a pacemaker). 

On the business side, they can attack virtually every industry where rapid adoption of low-cost, easily-installed IoT devices has led Gartner analysts to predict that [more than 20 billion connected things](https://www.gartner.com/newsroom/id/3598917) will be in use by 2020.

## Yes, Your Wearable Could be Involved in a Global Threat

In addition to personal and business vulnerability where devices can be held hostage for ransom or more directly nefarious intent, unprotected IoT devices can provide easy ways for bad guys to cause global damage, as can the apps that support them. 

Just this week, [Under Armour announced that a data breach had affected 150 million users](https://www.cnbc.com/2018/03/29/under-armour-stock-falls-after-company-admits-data-breach.html) of its fitness and nutrition site, MyFitnessPal, which can sync with wearables like Fitbit, Misfit, and LumoLift, as well as IoT-linked scales and cardio machines. 

![MyFitnessPal Data Breach](https://cdn.auth0.com/blog/security-risk-iot/myfitnesspall-breach.png)

Using malware, they can gain control of the IoT devices and group them together to create a botnet with the IoT devices acting as “zombies” tasked with fulfilling the hackers’ desires. Dark Reading reported that [botnet controllers increased by 140% in 2017](https://www.darkreading.com/perimeter/iot-botnets-by-the-numbers/d/d-id/1330924).

What’s especially shocking about that rise is how fast these troubles can spread.

## How Minecraft Accidentally Inspired Network Takedowns

Starting in 2016, three guys in a dorm room created Mirai, an IoT botnet targeting devices with one of [60 popular default passwords](https://www.grahamcluley.com/mirai-botnet-password/), hijacking them without the owner’s knowledge.

Their exploits targeted French cloud computing company OVH, internet services company Dyn, and knocked out major platforms like Netflix, Amazon, Twitter, and Github.

While the FBI lay honeypot traps and worried Mirai was a sign of potential U.S. presidential election interference from Russia or China, Mirai’s creators realized they could also run a click-fraud scheme in addition to the original goal of [getting an advantage in the online game Minecraft](https://www.wired.com/story/mirai-botnet-minecraft-scam-brought-down-the-internet/).

Eventually, all three guys plead guilty, facing up to five years in prison, $250,000 each in fines, and five years of supervised release. 

When Netlab 360 stopped tracking Mirai last summer, [2.7 million devices had been influenced in less than a year](https://www.darkreading.com/perimeter/iot-botnets-by-the-numbers/d/d-id/1330924?image_number=5).

## Billions of Devices at Risk

If you’re still calmly sipping your coffee, you’re not paying attention. 

Satori, the IoT botnet that infected more than a quarter million devices within 12 hours of being spotted, [now has a version that can run on ARC processors](https://www.darkreading.com/vulnerabilities---threats/satori-botnet-malware-now-can-infect-even-more-iot-devices/d/d-id/1330875?). Why does that matter? More than [1.9 billion](https://www.synopsys.com/designware-ip/processor-solutions/arc-processors.html) ARC-based systems ship annually, making things run smoother in cars, industrial settings, homes, mobile, and IoT, including hearing aids and fitness bands. 

Reaper, an IoT botnet built from Mirai’s code, had already [infected a million networks](https://www.wired.com/story/reaper-iot-botnet-infected-million-networks/) by October of 2017. Rather than exploit a single vulnerability, Reaper is a multi-vector opportunist. Written for on-the-fly updates, the malware can run fresh attacks as soon as they become available. As of the first week of March, The Hindu reports that WiFi cameras have proven most vulnerable to Reaper, with a [nearly four-fold increase in attacks over a three-month period](http://www.thehindu.com/todays-paper/tp-miscellaneous/tp-others/iot-botnets-attack-multiple-vulnerabilities/article22938435.ece).

Meanwhile, attacks are growing in complexity and sophistication, with one of the most recent botnets, Hide N Seek, developing the ability to have devices communicate directly with each other in peer-to-peer communication, which means it can spread via web and internal networks.

Botnets are rapidly becoming more mature and automated. With [400K-device botnets available for rent online](https://www.bleepingcomputer.com/news/security/you-can-now-rent-a-mirai-botnet-of-400-000-bots/) and others being [given away as Christmas gifts](http://www.zdnet.com/article/satori-malware-code-given-away-for-christmas/), IT departments are feeling the heat.

## What’s A Breach Going to Cost your Organization?

So how likely is it that your company is going to get hit with an IoT breach?
In the U.S., a 2017 [Altman Vilandrie & Company survey](http://www.altvil.com/wp-content/uploads/2017/06/AVCo.-IoT-Security-White-Paper-June-2017.pdf) of 397 U.S. executives across 19 industries revealed that 48% of businesses had already suffered an IoT breach.

Okay, so you’re breached. What’s the impact?

Breaches in that survey were found to cost 13.4% of the total revenues for companies with revenues of under $5 million annually. Of larger companies with revenues of $5 billion or more, 44% reported losses of more than 20 million.

For a more global perspective, Cisco’s [2018 Annual Cybersecurity Report](https://www.cisco.com/c/dam/m/digital/elq-cmcglobal/witb/acr2018/acr2018final.pdf?dtid=odicdc000016&ccid=cc000160&oid=anrsc005679&ecid=8196&elqTrackId=686210143d34494fa27ff73da9690a5b&elqaid=9452&elqat=2) found that by the time victims added up lost revenues, customers, opportunities, and out-of-pocket costs more than 
50% of attacks results in damages of $500,000 or more. Nearly 40% of surveyed companies reported that attacks resulted in costs of more than a million. 

When [GDPR](https://auth0.com/gdpr) comes into force in May, breached companies serving EU customers could also find themselves faced with additional fines, as well as greater public outcry that they should have been prepared.

## Why the World is Not Ready

If we know all of this is happening why aren’t we better prepared?

The answer is two-part. One having to deal with corner-cutting that happens when technologies are rushed to market. The other has to do with clear gaps in cybersecurity readiness which caused Cisco’s report to label IoT a “serious threat vector.”

IT teams are strained with burgeoning cloud responsibilities while also managing the proliferation of IT devices. After surveying 3,600 international security officers and security operations managers and conducting tech partner research, Cisco’s report also concluded that: 

* 83% of devices in their partner sample displayed vulnerabilities
* IoT devices are called into action without security planning
* Organizations are unaware of the total the number of devices on their network
* Patching, a prime defense, happens slowly, if at all
* When patching does occur, the prior best-practice of patching within 30 days now only leaves you open to additional attacks.

Even when organizations do actively patch, they can run into troubles created by device design.

After [WannaCry](https://www.helpnetsecurity.com/2017/05/17/wannacry-iot/), spread globally via a combination of infected computers and IoT zombies to take down everything from hospitals in England and a telecom provider in Spain to computers in the Russian Ministry of Internal Affairs, IT departmartments all over the world were spurred into action. Patching did work for many of the Microsoft computers affected, but not for legacy IoT products that can’t be patched.

In a world where neither hackers nor botnets respect borders, no country offers safe haven, which is why the UK is suggesting a more global solution.

## UK Drafts Code of Best Practices, Calls for Input

“IoT security is a global challenge requiring global collaboration.” 
—UK Government’s [Secure by Design Report](https://www.gov.uk/government/uploads/system/uploads/attachment_data/file/686089/Secure_by_Design_Report_.pdf)

After researching serious global threats for several days, encountering the UK’s hope to create a “free, open, peaceful and secure cyberspace” proved remarkably soothing. Part of the conception of this cyberspace means that we’re all participating in a global digital economy. This is part of why the UK reached out to the public and private sectors and academia, and “like-minded countries” for ways to fight this IoT-driven threat. 

The UK government’s recent examinations and explorations of best practices could allow us to better protect ourselves. The [Secure by Design Report](https://www.gov.uk/government/uploads/system/uploads/attachment_data/file/686089/Secure_by_Design_Report_.pdf) makes it clear that no one country, organization, or individual can fix this situation by themselves. We’re going to have to do this together.

For businesses creating IoT devices and supporting apps, this will mean re-addressing the entire product life cycle with an emphasis on security. For organizations employing IoT devices, it will mean having a methodical approach to their security. Consumers, who are showing interest in purchasing an ever-increasing number of IoT devices, will be protected by security being built in into products from conception — “secure by design.”
The UK government is hoping the market will right itself, but given the urgency of the situation, they’ve also warned that they will consider regulatory action if change doesn’t happen naturally, noting that they will continue monitoring through the remainder of 2018.

In addition to outlining the gravity of mounting threats and suggesting best practices, the report also cites 5 key principles to help shift IoT thinking: Reducing burden (on consumers and others in the supply chain), Transparency, Measurability, Facilitating Dialogue, and Resilience.
With an emphasis on sharing best practices and encouraging dialogue, the UK government is seeking input from all areas of interest. To contribute to the conversation, send comments to [securebydesign@culture.gov.uk](mailto:securebydesign@culture.gov.uk) by the 25th April 2018.

## How Auth0 Can Help You Immediately Secure IoT

Justice from captured hackers is notoriously thin. Organizations and individuals currently receive little compensation for their losses and/or harm to their reputation. Remember those three guys that created Mirai? Together they paid only $750,000 in fines — and that money didn’t go to the victims.

{% include tweet_quote.html quote_text="Will the UK’s call for IoT standards help protect organizations from the rapid rise of botnets?" %}

Government efforts like the UK’s or even the one of multiple U.S. bills to secure the Internet of Things could lead to real change, but they’re going to take time. Meanwhile, the hackers are evolving their attacks at frightening rates. What can you do to protect yourself right now?

In the [UK’s literature review for IoT principles and best practices](https://www.gov.uk/government/uploads/system/uploads/attachment_data/file/686090/PETRAS_Literature_Review_of_Industry_Recommendations_and_International_Developments_on_IoT_Security.pdf), authentication was the first protective measure listed. Reliance on common credentials without encryption is part of what made it so easy for Mirai to sweep through all those IoT devices. Securing the devices you have now and devices coming online with well-encrypted (hashed and salted) passwords can provide a strong line of defense. [Multifactor authentication](https://auth0.com/multifactor-authentication) (MFA) also offers the possibility of securing devices with other factors like geographic location or time. 

Auth0 can help you put all of these things into use quickly and efficiently. We support IoT authentication with the most advanced password hashing algorithms. Our code is regularly submitted to independent penetration and black box testing and we also perform continuous vulnerability assessments. And because hackers are always evolving, we have a team of 12 engineers dedicated to full-time work on security, lead by Auth0 CISO Joan Pepin, former CISO for both Nike and Sumo Logic. 

If you’d like to learn more about how Auth0 can help you secure your IoT devices and streamline your identity solution, reach out to [sales@auth0.com](mailto:sales@auth0.com).

_Auth0, a global leader in Identity-as-a-Service (IDaaS), provides thousands of customers in every market sector with the only identity solution they need for their web, mobile, IoT, and internal applications. Its extensible platform seamlessly authenticates and secures more than 1.5B logins per month, making it loved by developers and trusted by global enterprises. The company's U.S. headquarters in Bellevue, WA, and additional offices in Buenos Aires, London, Tokyo, and Sydney, support its customers that are located in 70+ countries._
