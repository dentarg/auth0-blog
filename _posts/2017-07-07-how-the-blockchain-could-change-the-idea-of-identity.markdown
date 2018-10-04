---
layout: post
title: "Opinion Piece: How the Blockchain Could Change The Idea of Identity"
description: "Better information and transaction storage could mean big things."
date: 2017-07-07 8:30
category: Growth, Identity
author:
  name: Diego Poza
  url: https://twitter.com/diegopoza
  avatar: https://avatars3.githubusercontent.com/u/604869?v=3&s=200
  mail: diego.poza@auth0.com
design:
  image: https://cdn.auth0.com/blog/blockchain/logo.png
  bg_color: "#75499A"
related:
  - 2017-03-06-an-introduction-to-ethereum-and-smart-contracts
  - 2016-11-30-different-ways-to-implement-multifactor
  - 2015-12-17-json-web-token-signing-algorithms-overview
tags:
  - blockhain
  - identity-management
  - identity
---

It's rare that a technological development that completely revolutionizes how we conceptualize the world comes along. That status is reserved for things like the printing press, germ theory, the steam engine, and the internet.

So when something is lumped in with this category, it's best to sit up and take notice — and that's where blockchain technology is at today. It's discussed as a revolutionary digital technology that could cause a monumental shift in the way we understand structures like nation states and the economy.

Since it's a huge step in the digital realm, it will affect our ideas of identity, which have become inextricable from our digital lives. Although we can't predict the future, exploring the possibilities of blockchain technology is too tempting to resist. [As experts in identity management, Auth0 is always thinking about where identity is going](https://auth0.com/user-management), and how we will get there.

From the power of an individual actor to the privatization of data, here are some ways that we could see blockchain change digital identity.

## The trust problem

A blockchain is a database of transactions, each of which can be verified (owing to the [computational intensity of the block-creation task and public-key cryptography](https://auth0.com/blog/an-introduction-to-ethereum-and-smart-contracts/)) by any third-party. No record can be modified retroactively, each one contains a link to the record that came before it, and most importantly, it's all peer-to-peer.

It is a decentralized system wherein all the devices together create a functioning service, rather than some central entity providing the base functionality.

First imagined by [Satoshi Nakamoto](https://en.wikipedia.org/wiki/Satoshi_Nakamoto) in 2008, the blockchain is most widely known as the technology behind digital currencies such as Bitcoin, but is also starting to be used for much more. [Walmart](https://www.nytimes.com/2017/03/04/business/dealbook/blockchain-ibm-bitcoin.html?_r=0), for example, has started to use a blockchain to keep track of products from manufacturing to sale.

Why adopt this novel technology for a standard practice? Because shipments require a lot of documentation (think customs), and if some of that documentation isn't immediately available, it slows the process of the container. That leads to inconveniences down the line, or even spoiled goods.

When a blockchain stores all the information for a container, everyone can trust the documentation is in place as soon as it arrives at a checkpoint.

Another example might be a manufacturer wants to keep track of a peanut butter order. In a blockchain, they could store all the steps it takes for that peanut butter to get from jar to store, in sequence.

The manufacturer could see the details of payment to the peanut farmer, then the details of payment to their shippers, then the details of purchase from their distributor. All of these would be recorded in a “chain” that represents the life of the peanut butter jar, but would also be connected to the parties involved.

![Tracking a record](https://cdn.auth0.com/blog/blockchain/factory-example.png)

So, if the factory wanted to go back to check where a bad batch of peanut butter came from, they would be able to quickly retrace the life of that jar of peanut butter to find out where it originated. Since each transaction stores unique information from each party that can't be retroactively changed, the peanut butter pipeline is a reliable source of information for the factory. This inability to make retroactive changes is what makes blockchain technology stand out from other systems.

## The double spending problem

Right now, most of the speculation surrounding blockchain's implications have been aimed at the financial industry, especially since cryptocurrencies are the most known uses of a blockchain system. Although we won't be focusing on fintech, addressing how blockchain could disrupt the financial world is a good starting point to understanding its potential impact.

Fintech discussion of blockchain centers on disrupting the role of banks and governments as agents that allow you to trust a financial transaction.

For example, if you wanted to send money overseas, you might use a transfer service available from your bank. You trust your bank to take the right funds from your account, and safely deposit them into someone else's account abroad. You trust that this transaction will happen only once and that the money will be deposited into the correct account.

If you were sending money overseas with a cryptocurrency like Bitcoin, the blockchain structure ensures that you are sending a one-time payment from your account to the account of another individual, eliminating the need for the bank.

The implication here is that the institutions that provide trust and validation will no longer be necessary to complete many basic tasks. This has a host of implications for things like the structure of the world economy, generating questions like: how will international economics be affected by secure exchange becoming independent from a government or a bank?

That's a difficult question that we can't answer yet. So, now that we've got an idea of the types of questions being asked about blockchain technologies, let's narrow our focus to identity.

## How blockchain could reshape the idea of identity

### Historically Verifiable Records

A blockchain can provide more than just a record of a financial transaction or a log of where a shipping container has been. It can theoretically store a variety of data, including property ownership, financial, intellectual property, and even medical data.

With this type of storage, keeping a historic record of the disparate parts of one's identity would be much easier. Digital identity would more closely model the complexity of someone's actual identity — all their spending habits, their rental history, permanent records of legally binding agreements in one place.

For example, you go to a bank to ask for a loan. That bank needs to check your financial history to qualify you for the loan. If your financial data was stored in a blockchain your potential lender could rely on [the work other financial institutions did](https://www.americanbanker.com/news/how-blockchain-fits-into-the-future-of-digital-identity) to keep your data to easily qualify you.

Think of it like using an app through Facebook: the app asks you to share your email, location, and friends to use the app. However, instead of Facebook, in this case it's parts of your blockchain-backed data. It could be used, for example, by a real estate agent to show a landlord you are a reliable tenant — just by allowing their server access to that part of your history.

On the other hand, this poses interesting questions for privacy. Although it is not necessary to store data on the blockchain for cases like the above (for example, you could store a hash), you still need to keep your data somewhere. If this data is ever exposed, whomever gets access to it can verify it is you who owns it by looking at the blockchain. In a sense, this gives people with access to your data all the tools they need to associate the data with you. As long as there is one copy of the data somewhere, you can never take it back, it will always be mapped back to you.

### Privatization

Since blockchains can store sensitive data, we might see a radical privatization of identity.

For example, individuals generally do not store all of their medical data themselves. In order to access that information, or to grant others to access that information, they have to go through large organizations (healthcare, hospitals), or small businesses (a local dentist, a pharmacy).

One reason we're willing to let banks and hospitals keep our sensitive information is that it's difficult to keep ourselves. An adult might have a mound of medical paperwork that is cumbersome to keep secure at home and to shlep around. Hospitals, on the other hand, are obliged to protect and organize our medical data, which saves us the hassle.

But in storing their information, these corporations may use their stored data as a representation of an individual for research, marketing — anything that could benefit from demographic data.

For example, if you apply for a loan, the bank collects information about you to verify you for that loan. In today's world, they can — and will — [share that information](https://www.fdic.gov/consumers/privacy/yourrights/) with telemarketers, the airlines, and other third parties who are trying to target you as a consumer.

Giving all of one's recordable data back to an individual would be a radical shift in the way that we can access and grant access to personal information about ourselves. It would also save us time and energy, since we wouldn't have to jump through bureaucratic hoops every time we wanted to recall a piece of information about ourselves, whether that's from the bank, government, or hospital. This identity would be shared with specific actors and backed with proofs-of-existence in a blockchain. Many blockchains already exist and could be used for this.

### Separation

Instead of centralizing all of their data, people could also decide to split their information into a number of different blockchain “identities” for different things. We call "identities" to the owners of specific transactions associated to a blockchain address.

For example, household spending could be a joint blockchain identity for a family, while each spouse also maintains a separate, personal blockchain identity for their own spending. There might be a separate identity for a trust fund or property inheritance and yet another identity for stock portfolios.

While people might feel comfortable keeping all of these things linked to one account, many individuals today already have separate accounts and identities for different functions.

For example, spouses might keep separate bank accounts, and family money might remain in a trust set up at a separate institution. Reliance on blockchains could eliminate the need for a central authority like a bank, and encourage people to further separate.

![Blockchain Separation](https://cdn.auth0.com/blog/blockchain/blockchain-flow.png)

Or, if you could transfer blockchain identities as part of your will, it might make sense to keep different properties, intellectual information, and financial information about high-value assets like jewelry or art in different identities.

### Verification

We often feel apprehensive if we're completing a transaction with a stranger, especially online. That's why sites like Etsy, Airbnb and Ebay give you access to reviews and ratings based on user history. Airbnb, shown below, even has an option for verification through the site, to build a sense of trust and legitimacy.

![Blockchain Verification](https://cdn.auth0.com/blog/blockchain/blockchain-verification.png)

But in a world of easily recorded public transactions, it could be enough to verify an exchange partner as “trustworthy” simply by being able to look at their transaction record through their blockchain history, or to have some sort of transaction score attached to it.

Just how much could we verify simply based on information encoded in blockchains? It depends on how and what we choose to store in the blockchain, but we are beginning to see that. For example, today people can prove they own a certain amount of money by simply signing a challenge with their private Bitcoin key. You can mathematically prove to anyone that you have enough money to enter a loan!

Imagine reapplying for a visa and having all your employment records, previous visa applications, passport information, and relevant personal history available to the application just through your authorization. Although you are the “keeper” of your identity, governments and other entities would be able to trust that data instantly, and you would not have to reach into their bureaucracy — our current centers of verification — to get it. This is by no means a solved problem with blockchain technology today, but it is a step forward. Data privacy, especially with blockchain technology is an evolving work in progress.

With the power and security of blockchains, it's possible that one day, we can use blockchain technology to build a source of trust for transactions and identity. But it would take a huge buy in from the top down to get us there, which means that the government and industry standards would be necessary to pave the way.

## Blockchain could mean big things

Although some speculations surrounding blockchain seems hyperbolic, the truth is that we have no idea of where this technology could take us. Just as communications companies [never imagined](https://hbr.org/2017/01/the-truth-about-blockchain) that TCP/IP development would one day be used for video chat, the blockchain future could be the realm of sci-fi today.

For authentication and identity management, there is a good chance blockchains will have an impact. Identity is all about proving things about someone, and blockchains augment private-key proofs with historical records. They are essentially verifiable ledgers that can store and link to any type of information.

What ways do you see blockchain changing identity — and how do you think that will affect the digital future?

## Aside: Securing Applications with Auth0

Are you building a [B2C](https://auth0.com/b2c-customer-identity-management), [B2B](https://auth0.com/b2b-enterprise-identity-management), or [B2E](https://auth0.com/b2e-identity-management-for-employees) tool? Auth0, can help you focus on what matters the most to you, the special features of your product. [Auth0](https://auth0.com/) can improve your product's security with state-of-the-art features like [passwordless](https://auth0.com/passwordless), [breached password surveillance](https://auth0.com/breached-passwords), and [multifactor authentication](https://auth0.com/multifactor-authentication).

[We offer a generous **free tier**](https://auth0.com/pricing) so you can get started with modern authentication.
