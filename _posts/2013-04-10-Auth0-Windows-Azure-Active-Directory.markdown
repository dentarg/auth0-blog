---
layout: post
title: "Why Windows Azure AD is important and how Auth0 works with it"
date: 2013-04-10 18:00
outdated: true
alias: /2013/04/10/Auth0-Windows-Azure-Active-Directory/
banner:
  text: "Build vs Buy: Guide to Evaluating Identity Management"
  action: "https://resources.auth0.com/build-vs-buy-evaluating-identity-management/"
  cta: "Download"
author:
  name: Matias Woloski
  mail: matias@auth0.com
  url: http://twitter.com/woloski
  avatar: https://secure.gravatar.com/avatar/0cd73f2f2f39709bd03646e9225cc3d3?s=60

description: "This week Microsoft announced the general availability of Windows Azure Active Directory (read ScottGu, Vittorio and Alex for the official word)."
category: Auth0-based Tutorial
related:
- 2013-04-16-Custom-Authentication-With-Auth0
- 2013-03-28-Auth0-Now-Available-In-The-Windows-Azure-Store
- 2013-06-04-introducing-db-connections
tags:
- announcements
- microsoft
---


This week Microsoft announced the general availability of Windows Azure Active Directory (read [ScottGu](http://weblogs.asp.net/scottgu/archive/2013/04/08/windows-azure-active-directory-general-availability-new-backup-service-web-site-monitoring-and-diagnostic-improvements.aspx), [Vittorio](http://www.cloudidentity.com/blog/2013/04/08/windows-azure-active-directory-reaches-general-availability/) and [Alex](http://blogs.msdn.com/b/windowsazure/archive/2013/04/08/windows-azure-active-directory-ready-for-production-with-over-265-billion-authentications-amp-2-5-million-organizations-served.aspx) for the official word). We are _very_ happy to see this milestone happening. We've been privileged to have been working with their team for quite some time now, and we think it is great news for the identity community. Congrats again on the release! This opens lots of opportunities for developers.

<!-- more -->

## Why we think Windows Azure AD is important

> Every app that creates a new user database contributes to Global Warming, and kills millions of kittens :-) -- the internet

This last release of Azure AD contributes greatly to the adoption of [more modern identity architectures](https://resources.auth0.com/build-vs-buy-evaluating-identity-management/). Hundreds of thousands of companies rely on Active Directory today. Azure AD brings you closer to the (not anymore) utopia of connnecting organizations seamlessly and securely.

But what exactly is Azure AD? It [is _not_ a Domain Controller](http://weblogs.asp.net/scottgu/archive/2013/04/08/windows-azure-active-directory-general-availability-new-backup-service-web-site-monitoring-and-diagnostic-improvements.aspx#10122132) in the cloud. It is more like a combination of AD and ADFS with a more modern API to query the directory. It runs on the cloud and it can run as a the primary user directory for an organization or synced against an on-premise AD and federated with ADFS (it won't save passwords in the cloud). Even more enticing is the fact that it is free!

## How does Auth0 work with Azure AD?

On our side, we've just completed the integration of Windows Azure AD in Auth0, and it is already enabled for our customers.

<p class="small-image">
  <a href="https://s3.amazonaws.com/blog.auth0.com/img/waad-auth0-diagram.png" target="_blank"><img src="https://s3.amazonaws.com/blog.auth0.com/img/waad-auth0-diagram.png" alt="Auth0 Windows Azure Active Directory Diagram"></a>
</p>

This means you can integrate your app with a single standard API and you will now enjoy easy access to Windows Azure AD and the rest of the identities we support: **Google Apps**, **on-premises Active Directory** **with** and **without** **ADFS**, user accounts stored in **SQL databases**, **Facebook**, **GitHub**, **LinkedIn**, **Twitter**, **PayPal**, etc.

<p class="small-image">
  <a href="https://s3.amazonaws.com/blog.auth0.com/img/waad-2.png" target="_blank"><img src="https://s3.amazonaws.com/blog.auth0.com/img/waad-2.png" alt="Windows Azure Active Directory configuration on Auth0 dashboard"></a>
</p>

In summary, with Auth0 you get:

<!-- more -->

###1. Support for ANY kind of app

Using [our SDK](http://docs.auth0.com), it is straight forward to connect with users on Windows Azure AD and requires just a few lines of code. We support:

* Any .NET app: ASP.NET MVC3, 4, WebApi, ServiceStack
* Any device: iOS, Android, Windows Phone, Windows 8
* Any Platform: Java, Node.js, Ruby, PHP, etc.

Here is an example for iOS:

    Auth0Client *client = [Auth0Client auth0:tenant clientId:clientId returnUrl:returnUrl connection:@"customer.onmicrosoft.com"];
    [client showInViewController:self allowsClose:NO withCompletionHandler:^(BOOL authenticated)


Auth0 uses a non-intrusive, standard, small footprint approach for identity integration that works with any identity provider. If you are working on a platform not listed above, take into account that anything that talks HTTP(s) can connect with Auth0.

###2. Sign up companies with the Provisioning Widget

If your app will accept users from **multiple** Azure AD domains, you will need to configure it for multitenancy (see the [tutorial by Microsoft](http://www.windowsazure.com/en-us/develop/net/tutorials/multitenant-apps-for-active-directory/))

We have simplified this process with the __Auth0 Provisioning Widget__. With just a couple lines of JavaScript code your app can signup users from any organization, using __any__ identity system: Azure AD, Google Apps, AD, etc.

This single line of code will display the __Auth0 Provisioning Widget__ on your app:

    window.Auth0.showProvisioning('/yourapp/callback')

Here is how it would look (you would probably fire this from the control panel of your app)

<p class="small-image">
  <a href="https://s3.amazonaws.com/blog.auth0.com/img/waad-provisioning.png" target="_blank"><img src="https://s3.amazonaws.com/blog.auth0.com/img/waad-provisioning.png" alt="Provisioning Widget to easily create connections with Windows Azure AD"></a>
</p>

This provides an easy way to add Single Sign On capability to your enterprise customers. You can also control the full user experience using the provisioning API instead of the widget.

###3. Query users from any provider

Once the organization/s have been provisioned through Auth0, you can query users of those organiztions through the __Auth0 Users API__. A very simple to use abstraction on a "Directory". Azure AD Graph API is of course different from Google Apps, or (on-premises) AD, or a Membership database. And [social logins](http://blog.auth0.com/2013/04/02/Auth0-Adds-Support-For-LinkedIn-PayPal-GitHub-Twitter-and-Facebook/) like LinkedIn, Google or Facebook; have no direct notion of a "Directory", but they do have equivalent concepts that bind people together (e.g. Friends, Contacts, Network).

This is Auth0 API explorer and we just did a `GET` on `/connections/yourganization2.onmicrosoft.com/users`. We keep the same API for every provider.

<p class="small-image">
  <a href="https://s3.amazonaws.com/blog.auth0.com/img/waad-api.png" target="_blank"><img src="https://s3.amazonaws.com/blog.auth0.com/img/waad-api.png" alt="Uniform Users API across providers"></a>
</p>

###4. Native support for SharePoint, RMS, CRM, WAMS

Auth0 is already integrated with [SharePoint](http://blog.auth0.com/2013/03/04/On-Premises-SharePoint-Federated-with-Office-365-and-Google/), MSCRM, [Rights Management](http://blog.auth0.com/2013/03/15/Integrating-Auth0-with-Rights-Management-Services/) and [Azure Mobile Services](http://blog.auth0.com/2013/03/17/Authenticate-Azure-Mobile-Services-apps-with-Everything-using-Auth0/).

Connecting these apps with Azure AD is fully automated and straight forward. It requires no customization, or specially complicated steps for configuration. Simple steps that get you up and running very quickly.

###5. Mobile and native apps SDKs

If you are you building a mobile app on iOS or Android or Windows based devices, then again; authenticating users in Azure AD is readily available:

<p class="small-image">
  <a href="https://s3.amazonaws.com/blog.auth0.com/img/waad-mobile.png" target="_blank"><img src="https://s3.amazonaws.com/blog.auth0.com/img/waad-mobile.png" alt="Mobile Authentication with Windows Azure AD"></a>
</p>

And if you enable the Azure Mobile Services add-on, we'll issue a token (JWT) compatible with it.

###6. Sign up from the Azure Store

We are part of the [Windows Azure Store](http://www.windowsazure.com/en-us/store/overview/). With a [few clicks](http://blog.auth0.com/2013/03/28/Auth0-Now-Available-In-The-Windows-Azure-Store/), you can have your own account, for free.

[Learn how to evaluate a modern identity management solution that fits your needs in this free eBook, Build vs Buy: Guide to Evaluating IAM.](https://resources.auth0.com/build-vs-buy-evaluating-identity-management/)
