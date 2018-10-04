---
layout: post
title: "Meltdown & Spectre: What Auth0 Customers Need to Know"
description: "Learn what you need to know about the Meltdown and Spectre vulnerabilities as an Auth0 customer, and as an individual as well."
longdescription: "Two microarchitecture vulnerabilities were disclosed to the public recently: Meltdown and Spectre. These vulnerabilities affect processors present in most modern computing devices, including personal computers, servers, cloud infrastructure, and mobile devices like phones and tablets. Learn what you need to know about these vulnerabilities as an Auth0 customer."
date: 2018-01-08 8:30
category: Security
is_non-tech: true
banner:
  text: "Auth0 makes it easy to add authentication to your application."
author:
  name: "Joan Pepin"
  url: "https://www.linkedin.com/in/joanpepin/"
  mail: "joan.pepin@auth0.com"
  avatar: "https://cdn.auth0.com/blog/meltdown-spectre/joanpepin.jpg"
design:
  image: https://cdn.auth0.com/blog/meltdown-spectre/logo.png
  bg_color: "#222228"
tags:
- meltdown
- spectre
- security
- vulnerabilities
- cpu
- exploits
related:
- 2017-12-08-how-poor-identity-access-management-equals-security-breaches
- 2017-11-03-how-to-protect-yourself-from-security-oversights
---

**TL;DR**: Two microarchitecture vulnerabilities were disclosed to the public recently: [Meltdown and Spectre](https://meltdownattack.com). These vulnerabilities affect processors present in most modern computing devices, including personal computers, servers, cloud infrastructure, and mobile devices like phones and tablets. Your operating systems and software should be updated immediately to protect against exploitation. Auth0 and other platform providers are also working to mitigate the risks posed by these vulnerabilities.

## What are Meltdown and Spectre?

[Two CPU microarchitecture vulnerabilities were discovered by Google’s Project Zero team](https://security.googleblog.com/2018/01/todays-cpu-vulnerability-what-you-need.html) and independently by other researchers: [Meltdown and Spectre](https://meltdownattack.com/).

The **Meltdown** vulnerability, [CVE-2017-5754](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2017-5754), can potentially allow hackers to bypass the hardware barrier between applications and kernel or host memory. A malicious application could therefore access the memory of other software, as well as the operating system. Any system running on an Intel processor manufactured since 1995 (except Intel Itanium and Intel Atom before 2013) is affected.

The **Spectre** vulnerability has two variants: [CVE-2017-5753](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2017-5753) and [CVE-2017-5715](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2017-5715). These vulnerabilities break isolation between separate applications. An attacker could potentially gain access to data that an application would usually keep safe and inaccessible in memory. Spectre affects all computing devices with modern processors manufactured by [Intel](https://www.intel.com/content/www/us/en/products/processors.html) or [AMD](http://www.amd.com/en-us/products/processors), or designed by [ARM](https://www.arm.com/products/processors)*.

*_ARM processors are the dominant computing platform for the vast majority of mobile devices, including phones and tablets from Apple, Google, Samsung, HTC, etc._

![Many Intel processors are affected by Meltdown and Spectre](https://cdn.auth0.com/blog/meltdown-spectre/ivybridge.jpg)

These vulnerabilities could potentially be exploited to steal sensitive data from your computer, such as passwords, financial details, and more—including information stored in apps like password managers or banking software. You can read the full [technical details of the report in Project Zero’s blog post here](https://googleprojectzero.blogspot.com/2018/01/reading-privileged-memory-with-side.html).

{% include tweet_quote.html quote_text="The Meltdown and Spectre  vulnerabilities could potentially be exploited to steal sensitive data from your computer, such as passwords, financial details, and more." %}

## Am I Affected?

Yes. The vulnerabilities are present on all devices with affected CPUs, including desktops, laptops, servers, cloud infrastructure, and mobile devices. However, operating system and software patches mitigate the risks posed by Meltdown and Spectre.

## What is Auth0 Doing to Protect Me?

Your security is of utmost importance to us at Auth0. Our engineering and security teams have made architectural and design decisions that significantly elevate and improve the security posture for all of our customers when faced with vulnerabilities, including Meltdown and Spectre. We closely monitored this situation and worked with our best-in-class vendors to ensure that all of our systems are patched and these vulnerabilities are mitigated. **All our servers and service providers have been patched and are no longer at risk.**

One of Auth0's service providers is Amazon Web Services (AWS). The AWS infrastructure that powers services like RDS, Elasticache, and Redshift was protected in advance of the Meltdown and Spectre disclosure, thereby immunizing a significant portion of Auth0’s infrastructure in advance as well. At this time, [all infrastructure that AWS provides to Auth0 has been patched](https://aws.amazon.com/security/security-bulletins/AWS-2018-013/) to mitigate potential risk from these vulnerabilities.

In addition, Auth0 has taken steps to ensure that, internally, we are up-to-date on all mitigation patches with regard to workstations as well as all devices used by personnel. To take similar precautions with your own computers, servers, and devices, please see the next section to learn what you can do to reduce your risk.

If you have any questions or encounter issues, please contact us at: **[notifications@auth0.com](mailto:notifications@auth0.com)**

## What Should I Do?

Auth0 worked with vendors to mitigate the risks posed by Meltdown and Spectre with regard to the Auth0 cloud and PSaaS appliance platforms. We actively coordinated with customers to make sure their environments were covered by the latest patches. We also ensured that our workstations and devices were properly updated with patches to protect against these vulnerabilities. However, you must _also_ take the necessary steps to protect your personal computers, servers, and other devices. This is a great opportunity to do a quick “Check for Updates” on all of your devices and applications and install anything that’s available. 

Install all **vendor-supplied operating system updates**, such as:

* [macOS 10.13.2, iOS 11.2, tvOS 11.2](https://support.apple.com/en-us/HT208394)
* [Microsoft Update KB4056890](https://support.microsoft.com/en-us/help/4056890/windows-10-update-kb4056890)
* [Android Security Bulletin January 2018](https://source.android.com/security/bulletin/2018-01-01)

Update **browser software**, such as:

* [Mozilla Firefox version 57.0.4](https://www.mozilla.org/en-US/security/advisories/mfsa2018-01/) or higher
* Microsoft Edge is patched in [Microsoft Update KB4056890](https://support.microsoft.com/en-us/help/4056890/windows-10-update-kb4056890)
* [Safari to be patched “in the coming days”](https://support.apple.com/en-us/HT208394)
* [Google Chrome version 64](https://support.google.com/faqs/answer/7622138#chrome) should be installed immediately when available on January 23; in the interim, [enable site isolation manually as described here now](https://support.google.com/chrome/answer/7623121)

Investigate this [list of Meltdown and Spectre Vulnerability Advisories, Patches, & Updates](https://www.bleepingcomputer.com/news/security/list-of-meltdown-and-spectre-vulnerability-advisories-patches-and-updates/).

{% include tweet_quote.html quote_text="To take steps to mitigate risks posed by Meltdown and Spectre, install all vendor-supplied OS updates and update your browser software to enable site isolation." %}
