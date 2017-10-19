---
layout: post
title: "WPA2 KRACK Attack: The WiFi Hack and What it Means"
description: "A new security vulnerability has been found in the WPA2 WiFi protocol.  We will look at the details of this, and how to mitigate it."
date: 2017-10-18 08:30
category: Hot Topics, Security
author:
  name: "Robin Percy"
  url: "https://twitter.com/rbin"
  mail: "robin.percy@auth0.com"
  avatar: "https://secure.gravatar.com/avatar/685342d5e7f42c3ab8d251d7d4a53308?s=100&d=mm&r=g"
design:
  bg_color: "#4F350B"
  image: https://cdn.auth0.com/blog/wpa2/wpa2-krack-attack.png
tags:
- wpa2
- krack
- krack-attack
- wifi
- wifi-hack
- wpa2-vulnerability
- key-reinstallation
- nonce-reuse
- key-reuse-attack
---

**TL;DR:**  A new security vulnerability has been found in WPA2 (the protocol that secures almost every modern WiFi connection).  The security weakness potentially allows a sinister agent, within range of the network, to hijack traffic and view any sensitive communication that is not encrypted.  In this article we'll take a look at the vulnerability, the risk it poses to you, and how to mitigate it.


## What is it?

*KRACK*.  Or *Key Reinstallation AttaCK*.  This is the name given to the latest security vulnerability found within the WPA2 protocol, which the majority of us use to secure our WiFi networks.  The weakness could potentially affect *any* device that secures WiFi with WPA2.  Once exploited, a malicious agent would be able to steal sensitive information such as bank account details, user account details and passwords, etc.  It may also be possible for the malicious agent to inject and manipulate data such as Ransomware or Malware.

Discovered by the security researcher [Mathy Vanhoef](https://twitter.com/vanhoefm), the KRACK vulnerability has cast a dark shadow over the *proven-secure* WPA2 protocol, the very protocol that hasn't been destabilised in over 14 years.  From a high level, the vulnerability allows a malicious agent to intercept a connection between a WiFi network and device.  The malicious agent can then force the reinstallation of an already in use encryption key, by manipulating and replaying the cryptographic handshake process that happens between the device and network.  Once exploited, a malicious agent can access any unencrypted information sent over that network connection.

When a user goes to join a WiFi network, be it on their laptop, tablet or phone, a 4-way-handshake (4 step process) is initiated in which a fresh session key is negotiated.

The 4 step process is reflected in the following image, with the `AP` being the *Access Point (Network)* and the `STA` representing the device:

![WiFi 4-way handshake process](https://cdn.auth0.com/blog/krack-attack/wifi-4-way-handshake.png)

After *step 3* in this process, the session key is installed and will be used to encrypt normal data frames.  The Access Point will retransmit step 3 of the handshake, however, if it does not receive an appropriate response or acknowledgement.  As a result of this, the client may receive step 3 multiple times, reinstalling the *same* session key each time, and thereby resetting both the *incremental transmit packet number (nonce)* and *receive replay counter* used by the data-confidentiality protocol.

Using the KRACK exploit, a malicious agent can force these *nonce* resets by replaying transmissions of step 3.  By forcing nonce reuse in this manner, the data-confidentiality protocol can be attacked.  Packets can be replayed, decrypted, and forged, leading to the theft of information, decryption of sensitive data and injection of malicious software.


## Who does it affect?

In short, the most vulnerable devices outed so far are *Android* and *Linux* devices due to the `wpa_supplicant` WiFi client that is commonly used.  That being said, this statement is taken directly from the vulnerability researcher, Mathy:

{% include tweet_quote.html quote_text="Any device that uses Wi-Fi is likely vulnerable to the KRACK vulnerability." %}

Unlike most vulnerabilities that are found in small or isolated components of systems, this vulnerability comes from within the WPA2 protocol itself.  The attack is against the 4-way handshake, and does not exploit access points themselves, but instead targets clients (devices such as laptops, tablets and phones).  This means that although a router may be updated and running the latest firmware, it is relatively unimportant, as whichever OS the connecting device is running on may be using the exploitable WPA2 protocol.

Although Windows, Mac and other brands are susceptible to this attack, as mentioned above, the most vulnerable are Linux based systems.  Quoting directly from the research paper, we can learn exactly why:

> " Our attack is especially catastrophic against version 2.4 and above of wpa_supplicant (the Wi-Fi client commonly used on Linux). Here, the client will install an all-zero encryption key instead of reinstalling the real key. 

> When the client now receives a retransmitted message 3 of the 4-way handshake, it will reinstall an all-zero key.  Because Android uses wpa_supplicant, Android 6.0 and above also contains this vulnerability. 

> Note that currently **50%** of Android devices are vulnerable to this exceptionally devastating variant of our attack. "

The reason this vulnerability could be particularly dangerous in a public WiFi situation is because among other things, the key reinstallation attacks allow a malicious agent to decrypt a TCP packet, learn the sequence number, and hijack the TCP stream to **inject arbitrary data**. This enables one of the most common attacks over Wi-Fi networks: injecting malicious data into an unencrypted HTTP connection.  Although a particular threat to public WiFi, of course, this is still a potential threat at home too.

Take a look below at the exploit being demonstrated in action, bypassing WPA2 against ***Android*** and ***Linux.***

<iframe width="800" height="450" src="https://www.youtube.com/embed/Oh4WURZoR98" frameborder="0"  allowfullscreen></iframe>


## What does this mean for you?

Well, hopefully, not too much.  As we'll see in the *mitigation* section below, vendors are responding well to this exploit and patches are already widely available.  However, that does not necessarily mean we are automatically safe.  The research paper was actually written back in May, but held privately for review, to give vendors a chance to patch software.  Since the paper was written, Mathy and his team have actually found an even easier way of exploiting the 4-way-handshake:

> With our novel attack technique, it is now trivial to exploit implementations that only accept encrypted retransmissions of message 3 of the 4-way handshake. In particular this means that attacking **macOS** and **OpenBSD** is significantly easier than discussed in the paper.

If you are a user of Android, Linux, Apple, Windows, OpenBSD, MediaTek, Linksys, and others, there is a good chance you may be affected by some variant of the attack.  Without wanting to make too many assumptions, I'm fairly sure that means pretty much all of us.  There is one caveat to this vulnerability though.  To exploit and manipulate the network connection, the malicious agent *would* need to be in range of the WiFi network.  This means that generally speaking, your home network is *relatively* safe, so long as your family and friends aren't avid hackers.  However, if you are a regular user of Public WiFi networks, it *could* be a much more bleak picture.

This vulnerability is also newly published, and there are (as of yet) no direct exploits available online for would-be malicious agents.  Because of this, and because Mathy will *not* release the code used to find and manipulate the vulnerability, the exploit would need to be entirely recreated by anyone who wished to use it maliciously.  That being said, the world is full of extraordinarily talented software engineers, and any one of them could use the research paper to reverse-engineer the exploit, and release their code at any time.

I am not intending to down-play this vulnerability, I fully understand how dangerous it could be, but it *is* being addressed and patched by vendors at a fantastic rate.  Another point to note here is that any network traffic with end-to-end encryption means a significant amount of the risk would be mitigated, as intercepted messages would not be able to be viewed so credentials and details could not be stolen.


## How to mitigate the situation

In this case, changing your WiFi network password or even swapping out your network router is not going to help.  The key to mitigating this vulnerability is ***patching your software.***  As I mentioned above, the vendor companies were informed of this vulnerability a few months ago, and most have been working away behind the scenes to release updates and patches.

For a full list of vendors who have already addressed this vulnerability, check out the [CERT Vulnerability Database](https://www.kb.cert.org/vuls/byvendor?searchview&Query=FIELD+Reference=228519&SearchOrder=4) page.  As you will note, some of the biggest named vendors released patches quietly days / weeks ago.

Yesterday: 

- [Cisco](https://tools.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-20171016-wpa)  released security patches,
- [Intel](https://security-center.intel.com/advisory.aspx?intelid=INTEL-SA-00101&languageid=en-fr) released security patches,
- [Netgear](https://kb.netgear.com/000049498/Security-Advisory-for-WPA-2-Vulnerabilities-PSV-2017-2826-PSV-2017-2836-PSV-2017-2837) released security patches and information,
- [Aruba](http://www.arubanetworks.com/assets/alert/ARUBA-PSA-2017-007.txt) released a security advisory.

For Linux based systems:

- [OpenBSD](https://marc.info/?l=openbsd-announce&m=148839684520133&w=2) released WPA2 patches,
- [Debian](https://www.debian.org/security/2017/dsa-3999) also released patches.
- [Ubuntu](https://askubuntu.com/a/965685) fixes have been issued.

***Microsoft*** announced that they have included security patches in their October batch of security updates.  ***Apple*** have announced that they will be releasing macOS patches in the coming days, once tested.  ***Google*** have stated that patches for Android and ChromeOS will be released as soon as possible.

For other vendors, the [WiFi Alliance are working to mitigate](https://www.wi-fi.org/news-events/newsroom/wi-fi-alliance-security-update).


## Conclusion

{% include tweet_quote.html quote_text="As with most security vulnerabilities, the most important thing to consider here is patching your software as soon as you can." %}

As with most large or small security vulnerabilities, the biggest thing to consider here is ***patching your software*** as soon as you can.  With new updates and patches being released on an almost hourly basis as the moment, keep an eye on your vendor to ensure you grab yours as soon as applicable.

This exploit has indeed come as a huge shock to the security industry.  Not only was WPA2 a mathematically *proven* technology, but it was also certified and trusted.  The fact that it has taken 14 years for this exploit to come to light is just as big a shock, though I believe we should be glad that it has.  And amicably too.

For all of the research I've done over the last couple of days, I cannot find any examples of this exploit being used in a malicious way, or in any past hacks.  As I mentioned above, and as one can see from the research paper, this is not a particularly easy vulnerability to exploit, however I can almost guarantee now that it's come to light, there will be many trying.  You can help to stop them succeeding by ensuring you update / patch your systems.

I think *thanks* are in order for [Mathy Vanhoef](https://twitter.com/vanhoefm).  Both for finding and researching this vulnerability, but for being incredibly mature and responsible in the way he diagnosed and reported it.

If you would like a detailed insight into the inner workings of this vulnerability, Mathy has released his findings in a [KRACK Vulnerability Research Paper](https://papers.mathyvanhoef.com/ccs2017.pdf).

Stay safe out there!

[ **- @rbin**](https://twitter.com/rbin)


**About Auth0**

Ensuring that one's hardware *and* software are both patched and kept updated to the latest version is the best way of avoiding security vulnerabilities.  Many of the most prevalent security concerns start with users and user credential management.  Happily, we can ensure our user management is as secure as possible.

Auth0, a global leader in Identity-as-a-Service (IDaaS), provides thousands of customers in every market sector with the only identity solution they need for their web, mobile, IoT, and internal applications. Its extensible platform seamlessly authenticates and secures more than 50M logins per day, making it loved by developers and trusted by global enterprises.

As a developer, you can [try Auth0 for free!](https://auth0.com/signup)  Sign up now to [get started](https://auth0.com/signup).

For more information, visit [https://auth0.com](https://auth0.com/) or follow [@auth0 on Twitter](https://twitter.com/auth0).
