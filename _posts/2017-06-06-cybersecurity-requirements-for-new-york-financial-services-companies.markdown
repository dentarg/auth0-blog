---
layout: post
title: "Attention! New Regulation for New York Financial Companies"
description: "The New York State Department of Financial Services (DFS) has issued a new regulation that defines cybersecurity requirements for financial companies."
date: 2017-06-06 14:05
category: Growth, Industries
author:
  name: "Bruno Krebs"
  url: "https://twitter.com/brunoskrebs"
  mail: "bruno.krebs@auth0.com"
  avatar: "https://www.gravatar.com/avatar/76ea40cbf67675babe924eecf167b9b8?s=60"
design:
  bg_color: "#636363"
  image: https://cdn.auth0.com/blog/23-nycrr/logo.png
tags:
- security
- cybersecurity
- financial
- auth0
related:
- 2016-09-22-yahoo-confirms-data-breach-of-half-a-billion-user-accounts
- 2016-08-16-how-real-state-companies-can-implement-open-id-connect-with-auth0
- 2017-02-08-is-multifactor-authentication-the-best-way-to-secure-your-accounts-myths-and-reality
---

The New York State Department of Financial Services (DFS), the state's top banking regulator, proposed last year a set of cybersecurity requirements that must be implemented by banks, insurances and other services companies of the financial industry. This set of regulations, technically called [23 NYCRR 500](http://www.dfs.ny.gov/legal/regulations/adoptions/dfsrf500txt.pdf), aim on improving the overall security of information systems and data (nonpublic information) used by such companies.

The full document, detailing each requirement, [can be found on DFS's website](http://www.dfs.ny.gov/legal/regulations/adoptions/dfsrf500txt.pdf). Basically, it states that companies (referred as *Covered Entities* in the document) shall maintain a cybersecurity program designed to protect the confidentiality, integrity and availability of their systems. The regulation defines that this program must address topics like:

- *Cybersecurity Policy*, where companies must implement and maintain written policies,
approved by a Senior Officer, officializing the procedures that protect systems and nonpublic information.
- *Chief Information Security Officer*, where companies must designate a qualified individual
responsible for overseeing and implementing the program.
- *Penetration Testing and Vulnerability Assessments*, where companies must implement continuous monitoring, periodic penetration testing, and vulnerability assessments to validate the companies efforts.
- *Access Privileges*, where companies shall limit user access privileges to systems that provide access to nonpublic information.
- *Third Party Service Provider Security Policy*, where companies must define policies and
procedures designed to ensure the security of systems and nonpublic information that are accessible
to, or held by, Third Party Service Providers.
- *Multi-Factor Authentication*, where companies must define and use effective
controls to protect against unauthorized access.
- *Encryption of Nonpublic Information*, where companies must implement controls, like encryption, to protect nonpublic information held or transmitted.

The whole document includes a total of 18 topics (from where the excerpt above was extracted) with details about what financial companies must consider while implementing their cybersecurity programs. Besides these topics, the document also includes details about when the regulation becomes effective and details about transitional periods. [Another resource](http://www.dfs.ny.gov/about/cybersecurity.htm), also found on the DFS's website, summarizes the key dates as follows:

- *March 1, 2017*—the regulation becomes effective.
- *August 28, 2017*—transitional period of 180 days, where companies are required to be in compliance with requirements.
- *September 27, 2017*—30 day period for filing notices of exemption under the regulation.
- *February 15, 2018*—companies are required to submit the first regulation certification.
- *March 1, 2018*—transitional period ends for the requirements of sections 500.04(b), 500.05, 500.09, 500.12, and 500.14(b).
- *September 3, 2018*—transitional period ends for the requirements of sections 500.06, 500.08, 500.13, 500.14(a), and 500.15.
- *March 1, 2019*—transitional period end for the requirements of the other sections.

## Auth0 to the Rescue

As stated by this new regulation, companies of the financial industry that belongs to (or have branches in) the state of New York must define policies and procedures to ensure the security of systems and nonpublic information that are accessible by Third Party Service Providers. Auth0, as a security company that provides the best identity management solution possible, can help companies of this industry by providing, as a third party partner, identity and access management services based on the best security practices and tools available.

So, if you are a financial company, with a branch in the state of New York, we can help you to comply with the requirements defined in the **23 NYCRR 500** regulation. Over the years, we’ve defined a state of the art approach to security that layers protections throughout our entire application stack as well as regular security training and exercises for our workforce. Recently, we have released a [white paper](https://auth0.com/security) that details our approach to security so that suscribers can better understand how their data is protected.

Below, you can view the table of contents for the white paper. The whole document can be found [on the Auth0's security webpage](https://auth0.com/security).

```bash
- Introduction
- Dedicated Security Team
  |- People and Processes
  |- Background Checks
  |- Security Awareness
  |- Access Requests
  |- Security Policies
  |- Privacy
- Secure Product Development
  |- Specification Compliance
  |- Authentication Experts
  |- Code Review
  |- Development Tools
  |- Secret Management
  |- White Hat Program
  |- OWASP Compliance
  |- Deployment Process
- Third-Party Compliance
  |- SOC II Type 2
  |- External Security Assessments
- Infrastructure and Data Security
  |- Cloud Security
  |- Infrastructure as Code
  |- Network Security
  |- Security Monitoring
  |- Authentication
  |- Data Encryption
  |- Laptop and Mobile Device Security
- Disaster Recovery and Backup
  |- Business Continuity Plan
  |- Backup Strategy
- Vendor security
  |- Security Team Review
  |- Privacy Considerations
- Summary
```

One of the reliable and interesting services that Auth0 can provide to companies of the financial industry, is the easy-to-adopt [Multi-Factor Authentication (MFA) solution](https://auth0.com/docs/multifactor-authentication). Exactly as referenced by the regulation, this method provides an additional layer of security, decreasing the likelihood of unauthorized access, as it requires users to identify themselves through two or more of the following methods:

- *Knowledge*: Something the user knows (e.g. a password).
- *Possession*: Something the user has (e.g. a cell phone).
- *Inheritance*: Something the user is (e.g. a fingerprint or retina scan).

The upside of adopting the MFA solution ([or any other solution for that matter](https://auth0.com/b2b-enterprise-identity-management)) provided by Auth0, is that it helps companies getting up to speed real quickly while resting assured that they are relying on a partner that has security as the first goal.

If you work for a company in the financial industry, or for any other company that cares about security and data integrity, [check out some case studies to understand how companies all around the world have successfully implemented secure identity management in their applications](https://auth0.com/b2b-enterprise-identity-management). We are on a mission to [lower the number of data breaches, and we don't want you and your users to be another victim](https://auth0.com/blog/data-breaches-by-the-numbers/).
