---
layout: post
title: "Managing and Mitigating Security Vulnerabilities at Auth0"
description: "Learn how responsible disclosure of a cybersecurity vulnerability made the risk mitigation process safe for Auth0 customers and vendors."
longdescription: "Learn how Auth0 responded to a vulnerability discovered by Cinta Infinita to ultimately provide stronger security for all their customers and vendors. This blog dives into the responsible disclosure process and outcomes."
date: 2018-04-04 8:30
category: Security
is_non-tech: true
banner:
  text: "Auth0 makes it easy to add authentication to your application."
author:
  name: "Joan Pepin"
  url: "https://twitter.com/cloudciso_joan"
  mail: "joan.pepin@auth0.com"
  avatar: "https://cdn.auth0.com/blog/meltdown-spectre/joanpepin.jpg"
design:
  image: "https://cdn.auth0.com/blog/auth0-vuln/logo.png"
  bg_color: "#3F6426"
tags:
- security
- vulnerabilities
- auth0
- exploits
- mitigation
related:
- 2018-03-28-security-vs-convenience
- 2017-11-03-how-to-protect-yourself-from-security-oversights
---

On October 5, 2017, security company [Cinta Infinita](http://www.cintainfinita.com) contacted Auth0 to report a vulnerability in our Legacy Lock API ([CVE-2018-6873](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2018-6873)). Cinta Infinita discovered the issue while conducting independent research. In specific cases, Cinta Infinita was able to bypass password authentication when logging into Auth0’s Management Dashboard by forging an authentication token. After verifying the vulnerability, we responded immediately, pushing a patch to our cloud service within four hours of initial notification. Our engineers then worked around the clock to patch our Private SaaS Appliance customers over the following two weeks.
 
During our investigation it became clear that the vulnerability was a special case of a deeper structural problem. The attack exploited an underlying Cross Site Request Forgery (CSRF/XSRF) vulnerability ([CVE-2018-6874](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2018-6874)). CSRF vulnerabilities are a common structural flaw when embedding a login widget into a web application due to the nature of cross-origin authentication (one of the reasons we’ve been pushing for [Universal Login](https://auth0.com/blog/authentication-provider-best-practices-centralized-login/)).
 
To fully remediate this issue and protect our customers, we needed to make a significant change to our [Lock login widget](https://auth0.com/lock) and its [supporting library](https://auth0.com/docs/libraries/auth0js/). Unlike the fix for the special case discovered by Cinta Infinita, this issue could not be solved without forcing our customers to upgrade the libraries/SDKs on their end, a much more significant undertaking.
 
We worked with Cinta Infinita to allow us time to address the issue prior to their public release. Neither party wanted the vulnerability to be exposed for a lengthy period of time, so we agreed on an aggressive schedule that still provided ample opportunity for all of our customers to upgrade.
 
With Cinta Infinita’s support on the timing, we moved forward with a strategy to mitigate the vulnerabilities by rewriting the affected libraries and releasing new versions of our SDKs (auth0.js 9 and Lock 11). This was an all-hands-on deck effort that included our Engineering, Customer Success, and Security teams as well as many individuals from across Auth0. Our goal was to provide a seamless upgrade. We achieved that for customers who were on Lock 10 and auth0.js 8.

We launched a multi-touch communications plan to all customers announcing the deprecation and removal of the vulnerable endpoints, giving them notice to migrate to the new SDKs. Customers on Enterprise plans were contacted and given the opportunity to speak directly with the Security and Professional Services teams to work out individually tailored migration plans.

Understanding that the upgrade would be cumbersome for many customers, our Engineering team continued to work on the underlying issue and was able to develop a mitigation strategy that could be implemented on the server side. This strategy not only decreased the burden to our customers, it also significantly reduced the <a href="https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)_Prevention_Cheat_Sheet#Verifying_Same_Origin_with_Standard_Headers">severity rating of the API vulnerability</a>. This occurred three weeks before planned public disclosure.
 
With server-side mitigations in place for our Cloud Customers, users are now much better protected even prior to migrating to new software versions. Due to the heavily downgraded severity, we are able to provide customers with three additional months to upgrade, with the **vulnerable endpoints removal of service now taking place on July 16, 2018 instead of April 1, 2018**.

{% include tweet_quote.html quote_text="Due to the heavily downgraded severity, vulnerable endpoints removal of service now taking place on July 16, 2018." %}

Security is a top priority at Auth0, and we’ve invested heavily in building up our program over the last year.

* We have implemented a new Secure Software Development Lifecycle process that encompasses all new development efforts.
* All of our developers take part in regular secure development training.
* We have embedded Product Security engineers into the various engineering teams to focus on the internal code and processes, while building out our Application Security team to focus on external interfaces and component security.
* We perform regular penetration tests and code reviews executed by industry-leading third parties, as well as automated vulnerability and component security scans.

With these people, processes, and tools in place, a project to review and refactor our code base is already underway. This project will make the introduction of vulnerabilities even more unlikely in the future.

{% include tweet_quote.html quote_text="Security is a top priority at Auth0, and we’ve invested heavily in building up our program over the last year." %}

Vulnerabilities are a part of life in software development. We would like to thank Cinta Infinita, an excellent partner in this process. Cinta Infinita has worked responsibly with us to protect our customers. We encourage anyone to report potential vulnerabilities to us through our [Whitehat responsible disclosure program](https://auth0.com/whitehat). We take all such reports very seriously as part of our commitment to providing the best security for our customers.

Migration guides are available to help customers upgrade to [auth0.js version 9](https://auth0.com/docs/libraries/auth0js/v9/migration-guide) and [Lock version 11](https://auth0.com/docs/libraries/lock/v11/migration-guide).

If you have any questions or feedback, please reach out to us. You can contact your CSM, open a [support ticket](https://support.auth0.com/), or chat with us in the Auth0 community forum on the [deprecations roadmap topic](https://community.auth0.com/t/upgrade-reminder-changes-to-deprecation-roadmap/9552 ) and the [migrations FAQ topic](https://community.auth0.com/t/april-1st-migrations-deprecations-faq/9723).
