---
layout: post
title: "Introducing Custom Domains (Preview) with Auth0"
description: "Auth0 now provides your own custom domain for login with a central authorization server."
longdescription: "Using a central authorization server for login is standards-based and best practice for authentication providers. While Auth0 provides this capability out of the box, you may want your end users to stay in your domain. We are happy to announce that you can now configure your own custom domain in Auth0!"
date: 2018-01-16 8:30
category: Product, Custom Domains, Single Sign On
banner:
  text: "Auth0 makes it easy to add authentication to your application."
author:
  name: "Justin Hinerman"
  url: "https://www.linkedin.com/in/jhinerman"
  mail: "justin.hinerman@auth0.com"
  avatar: "https://cdn.auth0.com/blog/custom-domains/justin-hinerman.png"
design:
  image: https://cdn.auth0.com/blog/custom-domains/custom-domains-logo.png
  bg_color: "#222228"
tags:
- custom-domains
- single-sign-on
- features
related:
- 2017-12-12-authentication-provider-best-practices-centralized-login
---

## Introducing Custom Domains (Preview) with Auth0

Authenticating with a provider through a central authorization server provides you with a standards-based, maintainable, and secure login approach. This type of login also provides single sign-on benefits and a modern user experience. You can explore the[ benefits of this architecture further in this blog post](https://auth0.com/blog/authentication-provider-best-practices-centralized-login/). 

For those who are not familiar with the concept, you may have noticed that you are always redirected to [accounts.google.com](https://accounts.google.com) when you log into Google sites such as Gmail or Youtube. Google has a _central authorization server_ that is used across all of their applications and third party apps.

![Google central authorization server](https://cdn.auth0.com/website/cnames-diagrams/google.png)

Auth0 provides this same capability out of the box, allowing you to unify login for your own brand and products. Enabling a central authorization provider with Auth0 is easy and straightforward with simple configuration, and can be customized to suit your brand. 

Some of the feedback we've heard from customers, however, is that they prefer this experience to be served from their own domain, instead of `[your-account].auth0.com`. We are happy to announce that you can now **configure your own custom domain in Auth0. This feature is available in beta release now** for all paid customers ([for tenants tagged as Development](https://auth0.com/docs/dev-lifecycle/setting-up-env)), with a full release coming in Q1. Adding your own custom domain does not require any code changes. Simple configuration can be completed within your Auth0 dashboard.

{% include tweet_quote.html quote_text="We are happy to announce that you can now configure your own custom domain in Auth0. This feature is available in beta release now for all paid customers." %}

## How It Works

Go to your account settings, select Custom Domains, add your own domain, and follow the instructions.

![Auth0 custom domains tenant settings](https://cdn.auth0.com/blog/custom-domains/tenant-settings.png)

We have implemented two options for certificate management:

* **Self Managed Certificates**: TLS/SSL certificates are managed by you through a reverse proxy (such as AWS CloudFront). This option is available only for Enterprise customers and it allows you to manage your own TLS/SSL certificates through the proxy.
* **Auth0 Managed Certificates**: we will take care of the TLS/SSL certificate generation and renewal. This option is available for all paid customers.

Next, you must complete the verification process. In the case of self-managed certificates, you will need to create a [TXT record](http://help.dnsmadeeasy.com/managed-dns/records/txt-record/). If you’re using Auth0-managed certificates, the verification process is done via a CNAME record.

If you are using self-managed certificates, once you complete the verification process, you will be assigned an origin domain and a unique `cname-api-key` header value. Both of these will have to be configured with your reverse proxy (such as [CloudFront](https://aws.amazon.com/cloudfront/)). If you chose Auth0-managed certificates, no further action is necessary—your domain is ready to use!

Once configured, you can migrate your apps to [use your own custom domain](https://auth0.com/docs/custom-domains).

> **Note:** Your existing integrations using your `[your-account].auth0.com` domain will continue to work. Keep in mind that when you migrate applications to your custom domain, users will have to log in again since existing sessions will no longer be valid.

## Using Custom Domains with Auth0

[Atlassian](https://www.atlassian.com/) is an early-adoption Auth0 customer using a custom domain. Atlassian is consolidating all of their B2B and B2C products under a central authorization provider at [id.atlassian.com](https://id.atlassian.com). 

![Atlassian central authorization provider](https://cdn.auth0.com/website/cnames-diagrams/atlassian.png)

Other Auth0 customers currently using custom domains with a central authorization server include [AGL](https://www.agl.com.au/residential), [National Life Group](https://www.nationallife.com/), and [News UK](https://www.news.co.uk/).

![Custom domains with Auth0](https://cdn.auth0.com/blog/custom-domains/custom-domains-auth0.jpg)

With the launch of custom domains with Auth0, your users will benefit from a first-class login experience, while keeping your brand through a trustworthy domain.

{% include tweet_quote.html quote_text="With the launch of custom domains with Auth0, your users will benefit from a first-class login experience, while keeping your brand through a trustworthy domain." %}

For more information, check out our [Custom Domains documentation here](https://auth0.com/docs/custom-domains).