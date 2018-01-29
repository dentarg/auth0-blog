---
layout: post
title: "What is Enterprise Mobile Management (EMM)?"
description: "Learn how enterprises are taking back control of managing, tracking and securing their employee's mobile devices."
longdescription: "Enterprise mobility management (EMM) is a security solution that helps IT take back control of the business-related applications and data living on employee devices without actually interfering with their personal apps. Learn more about EMM."
date: 2018-01-29 08:30
category: Growth, Security
is_non-tech: true
author:
  name: Martin Gontovnikas
  url: http://twitter.com/mgonto
  mail: gonto@auth0.com
  avatar: https://www.gravatar.com/avatar/df6c864847fba9687d962cb80b482764??s=60
design:
  bg_color: "#2B0050"
  image: https://cdn.auth0.com/blog/enterprise-mobile-management/logo.png
tags:
- enterprise
- mobile
- security
- emm
- 2fa
- single-sign-on
- sso
related:
 - 2017-12-04-ten-mobile-security-threats-and-what-you-can-do-to-fight-back
 - 2018-01-19-how-iam-can-help-your-enterprise-get-mobile
 - 2017-12-08-how-poor-identity-access-management-equals-security-breaches
---

**TL;DR:**  Learn how enterprises are taking back control of managing, tracking and securing their employee's mobile devices.


You probably don't realize it, but your colleagues and you have been leading a technology revolution against your company's IT department. The day you handed in your corporate-issued Blackberry and started using your personal devices to conduct business was the day you inadvertently declared war on IT.

![Source](https://cdn.auth0.com/blog/emm/it-war.png)

Before this revolt, IT enjoyed complete control your organization's devices, applications, and data, which made it easy to keep information secure and the systems working within the requirements of the enterprise. This all changed when employees took IT into their own hands, otherwise known as [Shadow IT](https://www.informationweek.com/cloud/shadow-it-its-much-worse-than-you-think/a/d-id/1321637?).

Your consumer-focused mobile applications were so easy to use and enhanced your productivity to a point where it made sense to start using these same applications for work. You set up Dropbox to share your team's confidential documents, you started collaborating in Google Docs, and you built presentations on Prezi.

![Source](https://cdn.auth0.com/blog/emm/Shadow-it-happens.jpeg)

While you didn't think twice about using these apps, IT had a big problem on its hands. Workers started using [hundreds](http://www.itmanagerdaily.com/study-a-majority-of-workplace-apps-are-shadow-it/) of unsanctioned apps and accessing them outside of the office on their mobile devices. This blitz on the enterprise grew into a major security liability. Something had to be done.


## The Rise of Enterprise Mobility Management (EMM)

IT had a unique challenge to solve: how could they secure and track the confidential information living on their employee's mobile devices without impeding on the flexibility and productivity that employees now relied on to conduct business?

Enterprise mobility management (EMM) emerged as the solution, with the idea of helping IT take back control of the business-related applications and data living on employee devices without actually interfering with their personal apps.

{% include tweet_quote.html quote_text="Simply put, it is a set of services and technologies that work together to secure company-owned applications and data on your employees’ mobile devices." %}

EMM is still in its infancy. Simply put, it is a set of services and technologies that work together to secure company-owned applications and data on your employees’ mobile devices. While the concept is straightforward, the complexities to achieve this goal require completely new technological approaches that continue to evolve.

![Source](https://cdn.auth0.com/blog/emm/emm-technical-challenges.jpeg)

The volume and variety of mobile applications, operating systems and device types that need to be considered create the challenge for building EMM solutions. David Johnson, a principal analyst at Forrester Research, [upped the ante ](https://www.computerworld.com/article/3230510/mobile-wireless/what-is-enterprise-mobility-management-emm.html) extending EMM beyond mobile management:

> *EMM used to be mainly about mobile device and application management, but now it’s more about enabling mobility more broadly – extending to Windows 10 and MacOS devices, identity and access management strategy, and how to design mobile engaging and productive mobile experiences for employees.*

With so many moving pieces, the definitions and expectations of EMM continue to evolve. In order to get a solid grasp on where EMM is and where it's heading, it's helpful to look at the four areas currently driving the EMM strategy.


## 4 Components of EMM

We apologize in advance for the onslaught of [acronyms](http://thecontextofthings.com/2014/02/06/whats-up-with-the-over-use-and-obsession-on-acronyms-in-american-business-and-professional-culture/), but the best way to define EMM is by explaining its core components: MDM, MAM, MCM, and MIM.

While EMM can manifest itself in different ways depending on your requirements, the technology suite is primarily focused on managing four important aspects of mobile:

1. **Device: **Mobile device management (MDM)
2. **Applications: **Mobile application management (MAM)
3. **Content: **Mobile content management (MCM)
4. **Identity: **Mobile identity management (MIM)

![https://cdn.auth0.com/blog/emm/emm-platform.png](https://cdn.auth0.com/blog/emm/emm-platform.png)

EMM is the comprehensive method of remotely managing devices, which is accomplished by incorporating the aforementioned four tools and strategies.


### 1. What is Mobile Device Management?

MDM is mistakenly used interchangeably with EMM. While MDM focuses on the device being secured, EMM encompasses both the device and the information which isn’t always stored in the device.

With MDM software, IT administrators can oversee mobile devices in the same way they manage your desktop computers in the office. They can remotely enroll the device and then track it, manage it and secure it based on the employee's profile and tasks. 

![Source](https://cdn.auth0.com/blog/emm/Mobile-Device-Management2.jpg)

The company can access your device to provision and configure Wi-Fi access, install and update apps, and fix any problems on the device. IT can also enforce security measures on the device such as locking out a device and wiping data.


### 2. What is Mobile Application Management?

MAM refers to the delivery and administration of the enterprise's software to the employee's device. While MDM focuses on device activation, provisioning, and troubleshooting, MAM tools deliver and manage all aspects of the mobile software (applications).

An important feature of MAM is providing the ability for IT to wipe company-owned apps and data remotely, without affecting the user's personal items. 

![Source](https://cdn.auth0.com/blog/emm/mam-diagram-app-level_desktop.png)

The admin can also blacklist or whitelist applications and control their access permissions, which helps combat sensitive data flowing through unsanctioned applications.

When combined with MDM, MAM solutions can help IT better understand employee usage of the enterprise applications with behavioral analytics.


### 3. What is Mobile Content Management?

MCM uses a set of technology tools that secure access and storage of confidential content by implementing an encrypted, managed container. 

Instead of storing important, company-owned content on personal apps like Dropbox or Google Drive, employees must adhere to the MCM policies for accessing and storing content and use the enterprise's preferred application. This not only keeps corporate content separate from personal but also gives IT the power to delete content from the device at will.

![Source](https://cdn.auth0.com/blog/emm/mobile-content-mgmt.jpg)

MCM is most effective when incorporated with MAM and MDM to ensure management of each level of the mobile enterprise. Identity management becomes the final component to keeping each level secure as it gives IT control over end-user access to specific apps, content, and sets of data.


### 4. What is Mobile Identity Management?

MIM is designed to ensure that only trusted devices and users can access enterprise data or applications. By authenticating the user’s identity and then tracking their activity, MIM gives IT the tools to manage access across devices and applications beyond the firewall.

Tools like [Auth0](https://auth0.com/), give administrators the ability to implement access security through:

* **Two-factor authentication:** [2FA](https://auth0.com/learn/two-factor-authentication/) provides an extra layer of security if a mobile device is lost or stolen. By asking for a second form of identification such as an SMS code; if credentials are ever compromised, the data is still secure.  
* **Behavioral Alerts:** Auth0 provides [custom tools](https://auth0.com/docs/anomaly-detection) to detect anomalies and stop unauthorized access. By tracking behavior and geography, MIM tools will alert IT of suspicious activity and attempts to log in.
* **SSO (single sign-on):** [SSO](https://auth0.com/docs/sso/current) allows users to use one set of credentials to access multiple applications. When enterprises use dozens of apps, SSO gives employees the convenience of access without tedious logins for every app. 

![Source](https://cdn.auth0.com/blog/emm/identity-mgmt.jpg)

Identity management is the glue that keeps MDM, MAM, and MCM secure. Each of these components serves a specific purpose within the EMM framework, but as they are incorporated into a cohesive system, enterprises are able to gain back control of their digital assets.


## How to Choose an EMM Provider

The technology suite of tools and services needed to deliver a complete EMM solution currently does not exist within one single vendor.

EMM is rapidly evolving, and there is a lack of industry standards and best practices. Like most IT initiatives, start your EMM vendor search by developing a set of objectives and requirements. Define your needs and research vendors based on individual capabilities.

Here are 5 questions to get you started:

1. **Do you offer application, content and identity management?** While most EMM products focus on device management, not all of them cover other aspects of mobile management. 
2. **Do you support the platforms and technologies that we use?** Some EMM providers only support certain operating systems and devices. Don't assume they cover everything you need.
3. **What is your security approach for device and data?** Ensure your vendors are using the most advanced encryption and [identity tools](https://auth0.com/security) that comply with your security policies. 
4. **Do you offer on-premise solutions?** While the growing trend is to provide SaaS, you may want the option to own the technology with an on-premise solution.
5. **Does the technology integrate with the current infrastructure?** If you have a complex infrastructure, you will want to make sure the EMM solution integrates with your system. 

Choosing the right vendors comes down to analyzing their capabilities within the core competencies of EMM. Take each component and evaluate providers on their capabilities to deliver on these elements.

According to Gartner's Magic Quadrant [report](https://www.air-watch.com/resources/analyst-reports) on EMM:

> There are diverse vendor approaches to managing the mobile lifecycle, with many focusing on identity and access, content security, and containment. To be classified as an EMM suite, Gartner requires inclusion of MDM, MAM and at least one of the following: MIM, MCM or containment technologies. The most advanced suites will include all five technologies.

![https://cdn.auth0.com/blog/emm/gartner-quadrant-report.png](https://cdn.auth0.com/blog/emm/gartner-quadrant-report.png)

While Gartner highlights vendors that try to incorporate several components, finding experts in each area might be a better way to go during the early stages of EMM. Niche providers that focus on one aspect of EMM often develop an expertise and can adapt quickly to the changing market.

Whether you choose an all-encompassing solution or create a suite of niche tools, partner with companies that have a vision for EMM and a roadmap for how their solutions will adapt as mobile matures.


## EMM Solutions Beyond Your Phone or Tablet

{% include tweet_quote.html quote_text="Enterprise mobility management is IT's answer to the employee revolution that forced companies to rethink their technology and data policies." %}

Enterprise mobility management is IT's answer to the employee revolution that forced companies to rethink their technology and data policies. EMM is not retaliation against employee mobility; it is actually the opposite. Companies want to keep their employees mobile and productive.

The future of EMM is going to be exciting as the definition of 'mobile device' expands to other connected devices, such as wearables and personal assistants. When [Alexa](https://en.wikipedia.org/wiki/Amazon_Alexa) starts helping people do their job, EMM will need to be ready.
