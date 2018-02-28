---
layout: post
title: "Auth0 Not Affected by SAML Vulnerabilities Identified by Duo Security"
description: "Duo Security announced the discovery of a new class of SAML response vulnerability affecting SSO. Auth0 is not vulnerable to this issue."
longdescription: "Duo Security announced the discovery SAML response vulnerabilities affecting SSO, allowing an authenticated attacker to impersonate another user. Auth0 as a Service Provider is not vulnerable, but developers should update other libraries if processing SAML responses in their own code."
date: 2018-02-28 8:30
category: Hot Topics, Security
is_non-tech: true
banner:
  text: "Auth0 makes it easy to add authentication to your application."
author:
  name: "Samuel Judson"
  url: "https://github.com/sjudson"
  mail: "samuel.judson@auth0.com"
  avatar: "https://cdn.auth0.com/blog/duo-saml-exploit/sam-judson.png"
design:
  image: https://cdn.auth0.com/blog/duo-saml-exploit/saml.png
  bg_color: "#222228"
tags:
- saml
- single-sign-on
- sso
- security
- vulnerabilities
- exploits
related:
- 2018-01-08-meltdown-and-spectre-what-auth0-customers-need-to-know
- 2017-12-08-how-poor-identity-access-management-equals-security-breaches
---

On February 27, 2018, [Duo Security](https://duo.com) announced the discovery of a new class of vulnerability affecting SAML-based single sign-on systems. This flaw can allow an authenticated attacker to fool SAML systems into logging in as a different user, even without knowledge of the victim’s password. Note that this type of attack can be prevented by Multi-Factor Authentication, even if software used is vulnerable. 

Malicious impersonation of this type can have a broad range of risks, including (but not limited to) compromising the victim as well as the system. An attacker could potentially impersonate a user with greater permissions, as well as elevate their own privileges.

Researchers from [Duo Labs](https://duo.com/labs), Duo’s security research team, identified several vendors affected by this class of vulnerability. You can read more information on SAML, details of the exploit, and affected vendors in Duo’s announcement here: [Duo Finds SAML Vulnerabilities Affecting Multiple Implementations](https://duo.com/blog/duo-finds-saml-vulnerabilities-affecting-multiple-implementations).

## Auth0 is Not Affected by the Vulnerability

As [cited in Duo’s disclosure](https://duo.com/blog/duo-finds-saml-vulnerabilities-affecting-multiple-implementations), all three of the following items are needed in order to enable this vulnerability:

1. SAML Responses contain strings that identify the authenticating user.
2. XML canonicalization (in most cases) will remove comments as part of signature validation, so adding comments to a SAML Response will not invalidate the signature.
3. XML text extraction may only return a substring of the text within an XML element when comments are present.

The library that Auth0 uses internally to parse SAML responses prevents the third requirement for exploitation. This prevents the vulnerability being exploited when  Auth0 is used as a SAML Service Provider (SP).

## Am I Affected?

Auth0 is not vulnerable to this issue, therefore, Auth0 customers do not need to take any action if using Auth0 as a SAML SP. However, if you are using Auth0 as a SAML Identity Provider (IdP) and are _processing SAML responses in your own code_, you will need to verify whether the libraries you are using are vulnerable as per [the original disclosure from Duo](https://duo.com/blog/duo-finds-saml-vulnerabilities-affecting-multiple-implementations). If you are using a vulnerable library, you must ensure that **any affected software is updated to patch the vulnerability**.

Auth0 provides the [passport-wsfed-saml2](https://github.com/auth0/passport-wsfed-saml2) Passport strategy as open-source software. This strategy is **not vulnerable** to this SAML security vulnerability reported by Duo. If you or your company are using this strategy, you do not need to take any additional action.

If you have any further questions or concerns, please [open a support ticket](https://support.auth0.com/) or [ask in our community forum](https://community.auth0.com/).
