---
layout: post
title: "Open Auth Standards: Your Secret to Success With the PSD2 Initiative"
description: "In the new world of open banking, secure APIs are just the beginning."
longdescription: "The Payment Services Directive for the European Union went into effect on January 13th, 2018 and third-party providers (TPPs) will finally be able to start handling finances for consumers, read this post to learn more about it."
date: 2018-03-02 12:30
category: Growth, Certifications
author:
  name: "Diego Poza"
  url: "https://twitter.com/diegopoza"
  mail: "diego.poza@auth0.com"
  avatar: "https://avatars3.githubusercontent.com/u/604869?v=3&s=200"
is_non-tech: true
design:
  image: https://cdn.auth0.com/blog/psd2-initiative/logo.png
  bg_color: "#3F3442"
  image_size: "70%"
tags:
- authentication
- auth
- standard
- auth-standards
- psd2
- oauth2
- openid
- banking
- financial
- api
related:
- 2018-02-07-oauth2-the-complete-guide
- 2017-02-23-we-are-now-open-id-certified
- 2018-01-26-security-predictions-for-2018-that-go-beyond-gdpr-compliance

---

Marc Andreessen famously said software is ["eating the world."](https://www.wsj.com/articles/SB10001424053111903480904576512250915629460) In a matter of months, it will take a bite out of one of the last remaining holdouts—European financial institutions. 

[PSD2](http://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32015L2366&from=EN), or the revised Payment Services Directive for the European Union, went into effect on January 13th, 2018. When that happens, third-party providers (TPPs) will finally be able to start handling finances for consumers. People may soon be making payments and overseeing their savings without ever interacting with an actual bank.

Banks will also no longer control access to their customers' accounts. Under PSD2, banks have to allow TPPs access (with customer consent), most likely through open APIs.

But these open APIs also pose new security risks. To compensate, banks will have to meet stringent standards to protect their customers' accounts.

Let's take a look at how banking will work under PSD2.

{% include tweet_quote.html quote_text="Banks need to meet the strongest standards to protect customers when using new APIs, learn about the European PSD2 initiative." %}

---

## The new face of Fintech
Right now, the financial industry has significant barriers to entry—the heavy regulations on bank infrastructure limit the number of newcomers. Once PSD2 is implemented, though, and banks have to open their APIs, [these barriers will be gone](https://www.evry.com/en/news/articles/psd2-the-directive-that-will-change-banking-as-we-know-it/). Any new provider can just build on top of the bank APIs.

![PSD2 initiative](https://cdn.auth0.com/blog/psd2/1-openapi.jpg)

> [Image source.](http://zanders.eu/en/latest-insights/how-open-banking-will-change-the-banking-landscape/)

Competition will increase—and not just because the sheer number of providers will grow. Customers will no longer have to stick with a single banking institution for all financial needs. This is because TPPs don't need to offer an extensive range of services—they can just connect with others through the open APIs. TPPs will likely focus on making more niche products that will make a slice of the banking [customers happy](https://www.zendesk.com/resources/why-companies-should-invest-in-the-customer-experience/). One way they'll now be able to facilitate this is through the collection of [behavioral user data](https://www.interana.com/blog/understanding-value-data/) that will help them cater to more specific user wants and needs. Customers will start cherry-picking the best providers of each service—making the field even more competitive.

## Meet the new players: AISP and PISP

PSD2 empowers two new types of payment service providers to handle finances. These providers, called AISPs and PISPs, will both have direct access to customer's bank accounts: AISPs serve as aggregators and PISPs initiate payments. 

### AISP
AISPs, or Account Information Service Providers, know everything about bank customers' accounts—for both individuals and businesses. AISPs may provide analytical tools to track and study transactions. Or, they might simply be a base where customers can view accounts from various banks in one place, like the service [Mint](https://www.mint.com/) provides in the U.S.

![AISP](https://cdn.auth0.com/blog/psd2/2-aisp.png)

> [Image source.](https://www2.deloitte.com/content/dam/Deloitte/lu/Documents/financial-services/Banking/lu-psd2-new-market-entrants-03032016.pdf)

Mint allows users to link bank accounts, credit cards, and investments to their application while providing budgeting tools, credit reports, and more.

![Mint](https://cdn.auth0.com/blog/psd2/3-mint.jpg)

### PISP
PISPs, or Payment Initiation Service Providers, instruct a customer's bank account to make payments. These direct payments will lead to much faster e-commerce. Compare to [credit card services](https://www.capco.com/insights/capco-blog/faster-e-commerce-accelerating-uk-payments-post-psd2), where requests have to go through the card company and payments reach the retailer a full day later at best.

![PISP](https://cdn.auth0.com/blog/psd2/4-pisp.png)

> [Image source.](https://www2.deloitte.com/content/dam/Deloitte/lu/Documents/financial-services/Banking/lu-psd2-new-market-entrants-03032016.pdf)

Some PISPS are actually in use already. Six Swedish banks banded together in 2012 to create [Swish](https://ecommercenews.eu/swedish-banks-want-use-swish-ecommerce/), a payment app that allows users to transfer money directly between accounts. Swish is now used by [over half](https://medium.com/@etiennebr/swish-the-secret-swedish-fintech-payment-company-created-by-nordic-banks-and-used-by-50-of-swedes-cfcf06f59d6f) of the Swedish population—proof that European consumers are ready to make the switch.

![Swish](https://cdn.auth0.com/blog/psd2/5-swish.jpg)

Other payment companies still rely on credit cards, but may consider extending their product after PSD2. Stripe (https://stripe.com/docs), for example, allows businesses to charge a customer's card, and deposits the money directly in the business' account. As of now, refunds still have to be approved and processed by the customer's bank—but that could soon change.

![Stripe](https://cdn.auth0.com/blog/psd2/6-stripe.png)

Facebook is another big contender in the payments market. [Facebook Payments](https://techcrunch.com/2017/01/12/what-facebooks-european-payment-license-could-mean-for-banks/) allows users to connect debit cards to make person to person payments over Facebook Chat. With Facebook's incredible user base, it could become a dominating PISP. They're licensed for payment services out of Ireland, so they already have a toe in Europe's payment waters. These kinds of moves are going to [blur the lines](https://techcrunch.com/2017/01/12/what-facebooks-european-payment-license-could-mean-for-banks/) between services as companies like Facebook start enabling things like one-click purchase. 

![Facebook Payments](https://cdn.auth0.com/blog/psd2/7-payments-in-messenger.png)

> [Image source.](https://techcrunch.com/2015/03/17/facebook-pay/)

## New security needs: OAuth 2.0 and OpenID Connect
Open APIs, however, do involve new security risks. Banks and other Account Servicing Payment Service Providers (ASPSPs) need to secure their APIs to prevent fraud. 

The PSD2, a technologically neutral document, doesn't specify exactly how open APIs should be secured. However, EU banks are likely to follow the Open Banking Standard set by the UK's Competition and Markets Authority (CMA). The CMA now requires the use of authorization framework OAuth 2.0 with the additional OpenID Connect authentication layer to protect UK bank open APIs.

### OAuth 2.0
[OAuth 2.0 is a popular authorization framework](https://auth0.com/blog/oauth2-the-complete-guide/) in which a user can authorize a TPP without revealing any credentials like account passwords. 

Essentially, the third-party application must ask the user for an [authorization grant](https://auth0.com/docs/protocols/oauth2), and use the authorization grant to receive an access token from the API. This access token can then be exchanged for a protected user resource, like bank account information.

![Authorization Grant](https://cdn.auth0.com/blog/psd2/8-oauth2.png)

### OpenID Connect
While OAuth 2.0 is great at providing authorization, it doesn't provide any [authentication](https://oauth.net/articles/authentication/). That is, while it allows users to give TPPs access to their bank accounts without giving them passwords, it does not allow TPPs to check who the user is. 

That authentication step is crucial—otherwise hackers could potentially grant a TPP access to someone else's account.

[OpenID Connect](https://connect2id.com/learn/openid-connect) is an authentication layer which sits on top of the OAuth 2.0 protocol. Before a user can grant the TPP authorization, their identity is checked by an identity provider (IdP). If the user is authenticated, the IdP gives the TPP an identity token and usually access tokens as well which can then be exchanged for user resources. The TPP still doesn't gain access to a user's credentials—that remains with the IdP.

## Stronger authentication requirements
OpenID Connect will allow banks and other ASPSPs to incorporate authentication, but that authentication can't be as simple as a password anymore.

PSD2 requires ASPSPs to use [Strong Customer Authentication](http://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32015L2366&from=EN) (SCA), essentially Multi-Factor Authentication (MFA), whenever a user, “accesses its payment account online; initiates an electronic payment transaction; carries out any action through a remote channel which may imply a risk of payment fraud or other abuses.” 

![Strong Customer Authentication](https://cdn.auth0.com/blog/psd2/9-SCAunderline.jpg)

The European Banking Authority (EBA) has authorized a few exemptions to this rule, such as when the user is only viewing the balance of a bank account, is performing a recurring transaction, or is paying a parking fare. However, most of the time ASPSPs will need to use SCA.

ASPSPs have an extra incentive to use SCA even when not required. In general, users must cover small losses from unauthorized payments due to lost, stolen, or misappropriated payment instruments (like a phone). Yet, if the ASPSP didn't have SCA, the user isn't liable and the provider must cover all losses.

## How can we help?

At Auth0, we're always looking for ways to make Identity Access Management (IAM) features quick and easy to implement, without sacrificing any security features. We're ready to provide you the API security needed post PSD2.

Auth0 is [OpenID Connect certified](https://auth0.com/blog/we-are-now-open-id-certified/). That means that our authentication and authorization protocols have achieved the high standards required by the UK and supported across the EU.

With Auth0, you can comply with the highest identity standards without making more work for yourself or sacrificing features. Check out the diagram below. When you have Auth0, we take care of the tough parts. Your API isn't involved until the last step. And we support a large number of [identity providers (i.e., Social, Enterprise, and Legal entities)](https://auth0.com/docs/identityproviders) allowing you to use the authentication provider you want.

![Identity Providers](https://cdn.auth0.com/blog/psd2/10-auth0.gif)

Auth0 is a leader in open identity standards—which is why organizations like [Bluetooth](https://auth0.com/blog/bluetooth-chooses-auth0-to-implement-standards-based-authentication/) and [Mozilla](https://auth0.com/blog/auth0-mozilla-partnership/) have recently made the switch.

We also support assorted [MFA implementations](https://auth0.com/docs/multifactor-authentication) to help you meet SCA requirements. You can choose push notifications or SMS as your “possession” channel, or integrate external MFA solutions like Google Authenticator or Duo Security into your Auth0 application. We offer ways to [customize your MFA](https://auth0.com/docs/multifactor-authentication/custom), too, such as changing the frequency of authentication requests or having heavier security if a user logs in from a new device.

To get started, check out this [tutorial](https://zsviews.wordpress.com/2017/05/22/psd2-open-banking-publishing-apis-using-azure-api-management-part-1/) which helps ASPSPs open their APIs and secure them using Auth0. 

Welcome to open banking!

{% include tweet_quote.html quote_text="Auth0 makes complying with PSD2 requirements much easier!" %}
