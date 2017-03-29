---
layout: post
title: "An Introduction to Ethereum and Smart Contracts: a Programmable Blockchain"
description: "Learn about verified, distributed computations in the cloud using Ethereum"
date: 2017-03-28 12:30
category: Technical Guide
author:
  name: Sebastián Peyrott
  url: https://twitter.com/speyrott?lang=en
  mail: speyrott@auth0.com
  avatar: https://en.gravatar.com/userimage/92476393/001c9ddc5ceb9829b6aaf24f5d28502a.png?size=200
design:
  bg_color: "#454A75"
  image: https://cdn.auth0.com/blog/Ethereum1/logo-2.png
  image_size: "100%"
tags:
- ethereum
- contracts
- contract 
- smart-contract
- smart-contracts
- bitcoin
- blockchain
- cryptocurrency
- cryptocurrencies
related:
- 2017-03-06-an-introduction-to-ethereum-and-smart-contracts
- build-a-serverless-slack-bot-with-webtask
---

[Bitcoin](https://www.bitcoin.com) took the world by suprise in the year 2009 and popularized the idea of decentralized secure monetary transactions. The concepts behind it, however, can be extended to much more than just digital currencies. [Ethereum](https://www.ethereum.org) attempts to do that, marrying the power of decentralized transactions with a Turing-complete contract system. In this post we will take a closer look at how Ethereum works and what makes it different from Bitcoin and other blockchains. Read on!

This is post 2 from a three-post series about Ethereum. [Read post 1 if you haven't done so.](https://auth0.com/blog/an-introduction-to-ethereum-and-smart-contracts/)

{% include tweet_quote.html quote_text="Ethereum marries the power of decentralized transactions with Turing-complete contracts!" %}

-----

## Introduction
In our [previous post](https://auth0.com/blog/an-introduction-to-ethereum-and-smart-contracts/), we took a closer look at what blockchains are and how they help in making distributed, verifiable transactions a possibility. Our main example was Bitcoin: the world's most popular cryptocurrency. Millions of dollars, in the form of bitcoins, are traded each day, making Bitcoin one of the most prominent examples of the viability of the blockchain concept.

Have you ever found yourself asking this question: "what would happen if the provider of this service or application disappeared?" If you have, then learning about Ethereum can make a big difference for you. Ethereum is a platform to run decentralized applications: applications that do not rely on any central server. In this post we will explore how Ethereum works and build a simple PoC application related to authentication.

### The Blockchain
A blockchain is a distributed, verifiable datastore. It works by marrying public-key cryptography with the nobel concept of the *proof-of-work*.

Each transaction in the blockchain is signed by the rightful owner of the resource being traded in the transaction. When new coins (resources) are created they are assigned to an owner. This owner, in turn, can prepare new transactions that send those coins to others by simply embedding the new owner's public key in the transaction and then signing the transaction with his or her private-key. In this way, a verifiable link of transactions is created; each new transaction, with a new owner, pointing to the previous transaction, with the previous owner.

To order these transactions and prevent the [double-spending problem](https://en.wikipedia.org/wiki/Double-spending), blockchains use the *proof-of-work*. The proof-of-work is a procedure that establishes a cost for grouping transactions in a certain order and adding them to the blockchain. These groups of transactions are called *blocks*. Each block points to a previous block in the chain, thus the name *blockchain*. By making blocks costly to make and making sure each new block points to the previous block, any potential attacker wanting to modify the history of transactions as represented by the blockchain must pay the cost of each block modified. Since blocks point to previous blocks, modifying an old block requires paying the cost for *all* blocks after it, making changes to old blocks very costly. A blockchain compounds the difficulty of modifying the blockchain by making the cost of creating blocks be of computational nature. In other words, to create new blocks, a certain amount of CPU power must be spent. Since CPU power is dependent on the advancement of technology, it is very hard for any single malicious entity to amass enough CPU power to outspend the rest of the network. A practical attack against a blockchain-based network usually requires a single entity controlling more than 50% of the combined CPU power of the network. The bigger the network, the harder it is to perform. 

But, as we saw in our first post in this series, blockchains are more than just that. Transactions, by their very nature, can do more than just send resources from owner A to owner B. In fact, the very act of doing so can be described as a very simple program: the sender produces a computation (transaction) that can only be performed if the receiver produces, at some point in the future, the right inputs. In the case of a standard monetary transaction, the right input would be the proof of ownership from the receiver. In other words, the receiver can only spend the coins he received if he proves he is the rightful owner of those coins. It may seem a bit contrived but it really isn't. When you perform a wire transfer, you prove you are the owner of an account through some sort of authentication procedure. For a home-banking system that could simply be a username and a password. At a bank, it would be your ID or debit-card. These procedures are usually hardwired into the system, but with blockchains it needn't be so.

In our first post we also took a cursory look at this. We first showed how Bitcoin transactions are in fact small programs that are intepreted by each node using a simple stack-based virtual-machine.

```
<sig> <pubKey> OP_DUP OP_HASH160 <pubKeyHash> OP_EQUALVERIFY OP_CHECKSIG
```

This virtual-machine, in the case of Bitcoin, is limited by design. It is not Turing-complete and can only perform a limited number of operations. Still, its flexibility opened up the possibility for many interesting uses. The small script above, a.k.a. smart contract, is the standard ["pay to pubkey hash" Bitcoin script](https://en.bitcoin.it/wiki/Transaction#Pay-to-PubkeyHash). It describes a small program that allows a sender to send coins to a receiver by verifying his identity with a public-key: the standard A to B monetary transaction, with ID cards substituted with public and private-keys. However, there's nothing preventing other uses, as long as you stick to the available operations supported by the virtual-machine. We took a look at a possible use in our previous post, where we created a perpetual-message system: immutable messages timestamped and forever embedded in the blockchain. The older they get, the harder it is for them to ever be changed. Nifty.

Now, we'll take a look at how Ethereum amplifies these concepts.

## Ethereum: a Programmable Blockchain
Although the concept of the blockchain was born out of the research into cryptocurrencies, they are much more powerful than just that. A blockchain essentially encodes one thing: state transitions. Whenever someone sends a coin in Bitcoin to someone else, the global state of the blockchain is changed. Moments before account A held 50 coins, now account A is empty and account B holds 50 coins. Furthermore, the blockchain provides a cryptographically secure way of performing these state transitions. In other words, not only the state of the blockchain can be verified by any outside party, but any state transitions initiated by blockchain users can only be performed in a secure, verifiable manner.

> An interesting way to think of a blockchain is as a never-halting computation: new instructions and data are fetched from a pool, the pool of unconfirmed transactions. Each result is recorded in the blockchain, which forms the state of the computation. Any single snapshot of the blockchain is the state of the computation at that point.

![Transactions as computations](https://cdn.auth0.com/blog/ethereum2/tx-as-computations-bunny.png)

All software systems deal in some way or another with state transitions. So what if we could generalize the state transitions inside a blockchain into any software we could think of. Are there any inherent limitations in the blockchain concept that would prevent state transitions from being something different than sending coins? The answer is no. Blockchains deal with reaching consensus for decentralized computations, it does not matter what those computations are. And this is exactly what the Ethereum network brings to the table: a blockchain that can perform any computation as part of a transaction.

![Transactions as general computations](https://cdn.auth0.com/blog/ethereum2/tx-as-generic-computations-2-bunny.png)

It is easy to get lost in the world of cryptocurrencies and simple exchanges of value between two users, but there are many other applications where distributed, secure computations make sense. It is this system that allows for things like:

- Secure deposits that get returned to the payer if conditions are met (or not)
- Money that cannot be spent unless a certain [number of users agree to spending it](https://en.bitcoin.it/wiki/Multisignature)
- Money that can only be spent after producing external data that satisfies rules set in the script

Given a Turing-complete system for computations associated to a blockchain, many more applications are possible. This is Ethereum.

[Take a look](http://dapps.ethercasts.com) at the things the community is working on to get a sense of the many useful ideas that can be run as decentralized applications.

### Ether
Although Ethereum brings general computations to the blockchain, it still makes use of a "coin". Its coin is called "ether", and, as any coin, it is a number that can be stored into account addresses and can be spent or received as part of transactions or block generation. To run certain transactions, users must spend Ether. But why is this the case?

A [Turing-complete language](https://en.wikipedia.org/wiki/Turing_completeness) is a language that, by definition, can perform any computation. In other words, if there is an algorithm for something, it can express it. Ethereum scripts, called *smart contracts*, can thus run any computation. Computations are run as part of a transaction. This means each node in the network must run computations. Any machine capable of running a Turing-complete language (i.e. a Turing machine) has one problem: the [halting problem](https://en.wikipedia.org/wiki/Halting_problem). The halting problem essentially states that no Turing machine can determine beforehand whether a program run in it will either terminate (halt) or run forever. In other words, the only way of finding out if a piece of code loops forever or not is by running that code. This poses a big problem for Ethereum: no single node can get caught up in an infinite loop running a program. Doing so would essentially stop the evolution of the blockchain and halt all transactions. But there is a way around that.

Since computation is costly, and it is in fact rewarded by giving nodes that produce blocks ether (like Bitcoin), what better way to limit computations than by requiring ether for running them. Thus Ethereum solves the problem of denial of service attacks through malicious (or bugged) scripts that run forever. Every time a script is run, the user requesting the script to run must set a limit of ether to spend in it. Ether is consumed by the script as it runs. This is ensured by the virtual machine that runs the scripts. If the script cannot complete before running out of ether, it is halted at that point. In Ethereum the ether assigned to an script as a limit is known as *gas* (as in gasoline).

As ether represents value, it can be converted to other coins. Exchanges exist to trade ether for other coins. This gives ether a [real money valuation](https://coinmarketcap.com/currencies/ethereum/), much like coins from Bitcoin.

### Smart Contracts
Smart contracts are the key element of Ethereum. In them any algorithm can be encoded. Smart contracts can carry arbitrary state and can perform any arbitrary computations. They are even able to call other smart contracts. This gives the scripting facilities of Ethereum tremendous flexibility.

Smart contracts are run by each node as part of the block creation process. Just like Bitcoin, block creation is the moment where transactions actually take place, in the sense that once a transaction takes place inside a block, global blockchain state is changed. Ordering affects state changes, and just like in Bitcoin, each node is free to choose the order of transactions inside a block. After doing so (and executing the transactions), a certain amount of work must be performed to create a valid block. In contrast to Bitcoin, Ethereum follows a different pattern for selecting which blocks get added to the valid blockchain. While in Bitcoin the longest chain of valid blocks is always the rightful blockchain, Ethereum follows a protocol called [GHOST](https://www.cryptocompare.com/coins/guides/what-is-the-ghost-protocol-for-ethereum/) (in fact a variation thereof). The GHOST protocol allows for stale blocks, blocks that were computed by other nodes but that would otherwise be discarded since others have computed newer blocks, to be integrated into the blockchain, reducing wasted computing power and increasing incentives for slower nodes. It also allows for faster confirmation of transactions: whereas in Bitcoin blocks are usually created every 10 minutes, in Ethereum blocks are created within seconds. [Much discussion](https://news.ycombinator.com/item?id=7553418) has gone into whether this protocol is an improvement over the much simpler "fastest longest chain" protocol in Bitcoin, however this discussion is out of scope for this article. For now this protocol appears to run with success in Ethereum.

An important aspect of how smart contracts work in Ethereum is that they have their own address in the blockchain. In other words, contract code is not carried inside each transaction that makes use of it. This would quickly become unwieldy. Instead, a node can create a special transaction that assigns an address to a contract. This transaction can also run code at the moment of creation. After this initial transaction, the contract becomes forever a part of the blockchain and its address never changes. Whenever a node wants to call any of the methods defined by the contract, it can send a message to the address for the contract, specifying data as input and the method that must be called. The contract will run as part of the creation of newer blocks up to the *gas limit* or completion. Contract methods can return a value or store data. This data is part of the state of the blockchain.

#### State
An interesting aspect of contracts being able to store data is how can that be handled in an efficient way. If state is mutated by contracts, and the nature of the blockchain ensures that state is always consistent across all nodes, then all nodes must have access to the whole state stored in the blockchain. Since the size of this storage in unlimited in principle, this raises questions with regards to how to handle this effectively as the network scales. In particular, how can smaller and less powerful nodes make use of the Ethereum network if they can't store the whole state? How can they perform computations? To solve this, Ethereum makes use of something called [Merkle Patricia Trees](https://easythereentropy.wordpress.com/2014/06/04/understanding-the-ethereum-trie/).

A Merkle Patricia Tree is a special kind of data structure that can store cryptographically authenticated data in the form of keys and values. A Merkle Patricia Tree with a certain group of keys and values can only be constructed in a single way. In other words, given the same set of keys and values, two Merkle Patricia Trees constructed independently will result in the same structure bit-by-bit. A special property of Merkle Patricia Trees is that the hash of the root node (the first node in the tree) depends on the hashes of all sub-nodes. This means that any change to the tree results in a completely different root hash value. Changes to a leaf node cause all hashes leading to the root hash through that and sister branches to be recomputed. What we have described is in fact the "Merkle" part of the tree, the "Patricia" part comes from the way keys are located in the tree. Patricia trees are [tries](https://en.wikipedia.org/wiki/Trie) where any node that is an only child is merged with its parent. They are also known as "radix trees" or "compact prefix trees". A trie is a tree structure that uses prefixes of the keys to decide where to put each node.

The Merkle Patricia Trees implemented in Ethereum have other optimizations that overcome inefficiencies inherent to the simple description presented here.

![Simplified Merkle Patricia Tree](https://cdn.auth0.com/blog/ethereum2/merkle-patricia-tree-bunny.png)

For our purposes, the Merkle aspect of the trees are what matter in Ethereum. Rather than keeping the whole tree inside a block, the hash of its root node is embedded in the block. If some malicious node were to tamper with the state of the blockchain, it would become evident as soon as other nodes computed the hash of the root node using the tampered data. The resulting hash would simply not match with the one recorded in the block. At this point we should find ourselves asking a big question: why not simply take the hash of the data? Merkle Patricia Trees are used in Ethereum for a different, but very important reason: most of the time, nodes do not need a full copy of the whole state of the system. Rather, they want to have a partial view of the state, complete enough to perform any necessary computations for newer blocks or to read the state from some specific address. Since no computations usually require access to the whole state stored in the blockchain, downloading all state would be superfluous. In fact, if nodes had to do this, scalability would be a serious concern as the network expanded. To verify a partial piece of the state at a given point, a node need only download the data necessary for a branch of the tree and the hashes of its siblings. Any change in the data stored at a leaf would require a malicious node to be able to carry a [preimage attack](https://en.wikipedia.org/wiki/Preimage_attack) against the hashing algorithm of the tree (to find the values for the siblings that combined with the modified data produce the same root hash as the one stored in the block).

![A Partial Simplified Merkle Tree](https://cdn.auth0.com/blog/ethereum2/partial-merkle-patricia-tree-bunny.png)

All of this allows efficient operations on the state of the blockchain, while at the same time keeping its actual (potentially huge) data separate from the block, still the center piece of the security scheme of the blockchain.

#### History
Much like Bitcoin, the blockchain can be used to find the state of the system at any point in time. This can be done by replaying each transaction from the very first block up to the point in question. However, in contrast to Bitcoin, most nodes do not keep a full copy of the data for every point in time. Ethereum allows for old data to be *pruned* from the blockchain. The blockchain remains consistent as long as the blocks are valid, and data is stored outside of the blocks, so technically it is not required to verify the proof-of-work chain. In contrast to Bitcoin, where to find the balance of an account a node must replay all transactions leading up to that point, Ethereum stores state by keeping the root hash of the Merkle Patricia Tree in each block. As long as the data for the last block (or any past blocks) is available, future operations can be performed in the Ethereum network. In other words, it is not necessary for the network to replay old transactions, since their result is already available. This would be akin to storing the balance of each account in each block in the Bitcoin network.

![Partial historical state in the blockchain](https://cdn.auth0.com/blog/ethereum2/state-prunning-bunny.png)

There are, however, nodes that store the whole copy of the historical state of the blockchain. This serves for historical and development purposes.

#### Solidity and a Sample Smart Contract
Smart contracts run on the Ethereum Virtual Machine, which in turn runs on each node. Though powerful, the Ethereum Virtual Machine works at a level too low to be convenient to directly program (like most VMs). For this reason, several languages for writing contracts have been developed. Of these, the most popular one is [Solidity](https://solidity.readthedocs.io/en/develop/).

Solidity is a JavaScript-like language developed specifically for writing Ethereum Smart Contracts. The Solidity compiler turns this code into Ethereum Virtual Machine bytecode, which can then be sent to the Ethereum network as a transaction to be given its own address.

To better understand Solidity, let's take a look at one example:

```solidity
pragma solidity ^0.4.2;

contract OwnerClaims {
  
    string constant public defaultKey = "default";

    mapping(address => mapping(string => string)) private owners;

    function setClaim(string key, string value) {
        owners[msg.sender][key] = value;
    }

    function getClaim(address owner, string key) constant returns (string) {
        return owners[owner][key];
    } 

    function setDefaultClaim(string value) {
        setClaim(defaultKey, value);
    }

    function getDefaultClaim() constant returns (string) {
        return getClaim(defaultKey);
    }

}
```

This is a simple owner claims contract. An owner claims contract is a contract that lets any address owner to record arbitrary key-value data. The nature of the blockchain certifies that the owner of certain address is the only one who can set claims in connection to that address. In other words, the owner claims contract allows anyone who wants to perform transactions with one of your addresses to know your claims. For instance, you can set a claim called "email", so that anyone that wants to perform a transaction with you can get your email address. This is useful, since an Ethereum address is not bound to an identity (or email address), only to its private-key.

The contract is as simple as possible. First there is the `contract` keyword that signals the beginning of a contract. Then comes `OwnerClaims`, the contract name. Inside the contract there are two types of elements: variables and functions.

Among variables there are two types as well: constants and writable variables. Constants are just that: they can never be changed. Writable variables, however, save state in the blockchain. It is these variables that encode the state saved in the blockchain, nothing more.

Functions are pieces of code that can either read or modify state. Read-only functions are also marked as `constant` in the code and do not require `gas` to run. On the other hand, functions that mutate state require `gas`, since state transitions must be encoded in new blocks of the blockchain (and these cost work to produce).

Values returned from functions are returned to the caller.

The `owners` variable in our contract is a [map](https://en.wikipedia.org/wiki/Associative_array), also known as associative array or dictionary. It matches a key to a value. In our case, the key is an `address`. Addresses in Ethereum are the identifiers of either normal accounts (usually managed by users) or other contracts. When an owner of an address decides to set a claim, it is this mapping from address to a claim that we are interested in. In fact, we are not simply mapping an address to a claim, but to a group of key-values that constitute a group of claims (in the form of another map). This is convenient because an address owner might want to make several details about himself known to others. In other words, address owners might want to make their email address and their cellphone number available. To do so, they might create two claims: one under the "email" key, and the other under the "phone" key.

The contract leaves to each owner to decide what entries to create, so the names of the keys are not known in advance. For this reason, a special "default" key is available, so any reader might know at least one claim if he doesn't know what keys are available. In truth, this key is also in place for a different reason: Solidity does not make it practical to return bulk data from functions. In other words, it is not easy to return all claims connected to an address in a single function call. In fact, the `mapping` type does not even have an iteration operation (although one can be coded if needed), so it is not possible to know what keys are inside a mapping. It is left as an exercise for the reader to find ways to improve this if needed.

### Current and Potential Uses
What we just saw with our simple example gave us a taste of what is possible with Ethereum. Do note it has nothing to do with exchanging money! Although ether is necessary to perform mutations on the network, our contract is strictly concerned with securely establishing a series of claims connected to an Ethereum address. Nothing more. Not only the result is mathematically verifiable (no other person other than the owner of the address can set claims), but is also very hard to erase: it is recorded in a globally distributed database with no central node!

Having access to a distributed, Turing-complete computing engine with verifiable semantics opens a world of possibilities. Let's take a look at interesting ideas already implemented or under implementation in Ethereum.

#### The Decentralized Autonomous Organization (DAO)
The DAO is, literally, an organization. It has members, it has a central authority (the owner), members can cast votes and the organization itself can perform any operations any other account could do. Members can create proposals, in the form of transactions, and voting members from the organization can cast votes to either approve the proposal or dismiss it. Proposals have a limit of time after which votes are counted and a decision is taken. The decision to perform or dismiss the proposal is carried by the contract of the DAO. In other words, no central authority can decide the fate of a proposal, and this is certified by the contract and the nature of the blockchain. The owner can be changed by a proposal. The only privilege the owner has is the ability to add or remove voting members.

In fact, the DAO we have just described is only one of the possible implementations. There are many improvements or modifications that can be performed to create whatever type of hierarchy. A Congress, a shareholder association, a democracy, these are all possibilities.

To learn more about DAOs, the main Ethereum website has a [whole area](https://www.ethereum.org/dao) dedicated to them.

#### A Central Bank or Your Own Coin
Although ether has real value and can be traded for other coins, other coin systems can be implemented on top of Ethereum. For instance, you could design your own coin with a central authority that can create money, authorize transactions or arbitrate disputes. Take a look at a possible implementation by following this [tutorial](https://www.ethereum.org/token).

#### A Crowdfunding System
Crowdfunding lets donors send money for a project that has not been completed or even started. In this way, funding for projects of different sizes is possible. The amount of money donated for the project is what usually decides the fate of the project. The usual problem with crowdfunding is the need for a central figure to hold founders responsible in case a project is not satisfactorily completed after funding, or to make sure all the money donated actually arrives at the hands of the founders. In other words, crowdfunding requires a considerable amount of trust to be placed in both the founder of a project and the central authority. But with Ethereum this needn't be so.

With Ethereum, it is possible to design a contract that takes a certain amount of money from donors and stores it in an account. The funds in this account can be kept away from the hands of the founders until they provide proof of their progress. When a certain milestone is achieved, the funds can be released. On the other hand, if the founders fail to provide proof of their progress in a reasonable timeframe, donated funds can be automatically returned to the donors. All of this logic of handling funds can be performed without trust in a central authority. Donors can be sure their money won't be spent until proof-of-work is provided, and they can be sure they will always get their money back otherwise. They can also be 100% certain each donor's money will go into the right hands.

An [example implementation of a crowdsale](https://www.ethereum.org/crowdsale) is available in the Ethereum page.

#### Prove That You Said Something in the Past
An interesting aspect of the blockchain is that its mere existence is proof that every transaction in it happened at some point in time. Although a certain variance in the timestamp of a transaction is expected (as it will get set by the node that creates the block that contains it), anything recorded in the blockchain happened at some point in the past. In fact, it is possible to assert it happened before or after other events also recorded or linked in some way to the blockchain. Since the blockchain allows for arbitrary state to be stored in it, it is possible to link an arbitrary message to an address. Anyone can confirm by looking at the blockchain that that message was produced at some point in the past by the owner of an address. All the owner needs to do is prove he is the owner of the address that produced the same message in the past. This can simply be done by performing a transaction using the same address as before.

Suppose you wrote a book. Before sending copies to your friends and editors, you decide to prove it was you who wrote it by storing its proof of existence in the blockchain. If your book gets plagiarized before getting published (by one of the editors, for instance), you can prove it was you who wrote it by showing you linked its hash to an Ethereum address. When anyone wants to confirm you own the address, you can show it to them through any transaction of their choice. The blockchain ensures any person in doubt can see the association between the hash of the book and your address, proving you had access to the full copy of the book at some point in the past.

#### Proof of Existence for Digital Assets
The concept of the previous example can be extended to a proof of the existence of anything that can be hashed. In other words, anything with a single digital representation can be hashed and stored in the blockchain, just like the arbitrary message from above. Later, any user can query whether the element was hashed and added to the blockchain.

[Here](https://chainy.info) is one working example of this concept.

There are many more examples of things that can be implemented with Ethereum, [check them out](http://dapps.ethercasts.com)!

## Aside: A Simple Login System using Ethereum
One of the cool things about Ethereum is that addresses are, by definition, systems to prove ownership. Whomever can perform operations with an Ethereum address is the rightful owner of that address. This is, of course, the consequence of the underlying public-key infrastructure used to verify transactions. We can exploit this to create a login system based on Ethereum addresses. Let's see how.

Any login system is mainly concerned with creating a unique identity that can be managed by whomever can pass a certain "login challenge". The login challenge is the method to prove that the same entity that created the account in the first place is the same entity doing operations now. Most systems rely on the classic username + password login challenge: a new user registers by choosing a unique username and a password, then, anytime the system requires proof that the user is in fact who he says he is, it can request the password for that username. This system works. But with Ethereum we already have a system for proving identities: public and private keys!

We'll design a simple contract that can be used by any user to validate his ownership of an address. The login process will be as follows:

1. A user accesses a website that requires him or her to login. When the user is not logged in, the website requests the user to enter his or her Ethereum address.
2. The backend for the website receives the address for the user and creates a challenge string and a JWT. Both of these are sent back to the user.
3. The user sends the challenge string to the `Login` contract and stores the JWT for later use locally.
4. The backend listens for login attempts using the challenge string at the Ethereum network. When an attempt with the challenge string for the right user is seen, it can assume the user has proved his or her identity. The only person that can send a message with an Ethereum address is the holder of the private key, and the only user that knows the challenge string is the user that received the challenge through the login website.
5. The user gets notified or polls the website backend for confirmation of his or her successful login. The user then proceeds to use the JWT issued in step 2 for accessing the website. Alternatively, a new JWT can be issued after a successful login.

To that end, this is the Ethereum contract we will use:

```solidity
pragma solidity ^0.4.2;

contract Login {
  
    event LoginAttempt(address sender, string challenge);

    function login(string challenge) {
        LoginAttempt(msg.sender, challenge);
    }

}
```

The contract is extremely simple. `Events` are special elements in Solidity that are mapped to a system in Ethereum that allows special data to be logged. Events are generally watched by clients monitoring the evolution of the blockchain. This allows actions to be taken by clients when events are created. In our case, whenever a user attempts to login, an event created with the challenge is broadcast. We only care about receiving a call from the rightful owner of the Ethereum address that was passed to the third party website. And, thanks to the way Ethereum works, we can be sure the sender was the one who performed the call.

In addition to the sender's address, the challenge is also broadcast. This means anyone watching the blockchain now knows the challenge. However, this cannot be used on its own to impersonate a user: a user can only interact with the backend through the session JWT. This means an attacker must know three pieces of information to impersonate a user: the Ethereum address, the challenge AND the JWT issued with the challenge. Since JWTs are signed, an attacker cannot create a valid JWT to impersonate an user, even with access to the challenge.

What follows is our backend code. First, let's see how to watch for Ethereum events:

```javascript
const LoginContract = require('./login_contract.js');

const loginContract = LoginContract.at(process.env.LOGIN_CONTRACT_ADDRESS || 
                      '0xf7b06365e9012592c8c136b71c7a2475c7a94d71');

// LoginAttempt is the name of the event that signals logins in the 
// Login contract. This is specified in the login.sol file.
const loginAttempt = loginContract.LoginAttempt();

const challenges = {};
const successfulLogins = {};

loginAttempt.watch((error, event) => {
    if(error) {
        console.log(error);
        return;
    }

    console.log(event);

    const sender = event.args.sender.toLowerCase();

    // If the challenge sent through Ethereum matches the one we generated,
    // mark the login attempt as valid, otherwise ignore it.
    if(challenges[sender] === event.args.challenge) {
        successfulLogins[sender] = true;
    }
});
```

The `login_contract.js` file contains what is needed to inter-operate with our contract. Let's take a look:

```javascript
// web3 is an Ethereum client library
const Web3 = require('web3');
const web3 = new Web3();

web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

// This file is generated by the Solidity compiler to easily interact with
// the contract using the web3 library.
const loginAbi = require('../solidity/build/contracts/Login.json').abi;
const LoginContract = web3.eth.contract(loginAbi);

module.exports = LoginContract;
```

[Web3](https://github.com/ethereum/web3.js/) is the official client library to interact with Ethereum nodes. An Ethereum node is what actually connects to the rest of the Ethereum network. It performs "mining" (block generation), transaction operations (create and send) and block verification.

The `Login.json` file is generated by the Solidity contract compiler, part of the standard Ethereum development tools. The Solidity compiler takes Solidity source code and turns it into Ethereum Virtual Machine bytecode and an interface description file that can be used by Web3 to interact with the contract once it is uploaded to the network.

And here are our HTTP endpoints:

```javascript
app.post('/login', (req, res) => {
    // All Ethereum addresses are 42 characters long
    if(!req.body.address || req.body.address.length !== 42) {
        res.sendStatus(400);
        return;
    }

    req.body.address = req.body.address.toLowerCase();

    const challenge = cuid();
    challenges[req.body.address] = challenge;

    const token = jwt.sign({ 
        address: req.body.address, 
        access: 'finishLogin'
    }, secret);

    res.json({
        challenge: challenge,
        jwt: token
    });
});

app.post('/finishLogin', validateJwt, (req, res) => {
    if(!req.jwt || !req.jwt.address || req.jwt.access !== 'finishLogin') {
        res.sendStatus(400);
        return;
    }

    if(successfulLogins[req.jwt.address]) {
        delete successfulLogins[req.jwt.address];
        delete challenges[req.jwt.address];

        const token = jwt.sign({ 
            address: req.jwt.address, 
            access: 'full'
        }, secret);

        res.json({
            jwt: token,
            address: req.jwt.address
        });
    } else {
        // HTTP Accepted (not completed)
        res.sendStatus(202);
    }
});

app.post('/apiTest', validateJwt, (req, res) => {
    if(req.jwt.access !== 'full') {
        res.sendStatus(401); //Unauthorized
        return;
    }

    res.json({
        message: 'It works!'
    });
});
```

The `/login` endpoint receives a login request carrying an Ethereum address for the user that wants to login. The user must be the owner of such Ethereum address. It generates a JWT and a challenge. The JWT can only be used to access the `/finishLogin` endpoint.

Before the user can call the `/finishLogin` endpoint he or she must prove his or her identity by making a call to the `login` method of the `Login` contract. The `login` method receives a single parameter: the challenge returned by the `/login` endpoint. He must perform this call using the same account address that was passed to the `/login` endpoint. He or she can use any Ethereum wallet or client to do this.

After making the call to the `login` method of the `Login` contract, the user can complete the login by using the `/finishLogin` endpoint. He or she must pass the JWT returned by the `/login` endpoint to it. If the login is successful, a new JWT with full access is returned. Otherwise, if the login is still pending, an accepted HTTP status (202) is returned signalling proper verification of the login request is still pending. If the JWT passed to `/finishLogin` is invalid, an unauthorized HTTP status code is returned (401).

After the `/finishLogin` endpoint is called and the login process is completed, the returned JWT can be used to access other parts of the API. In this case, the `/apiTest` endpoint is available. It simply returns "It works!" wrapped in a JSON object if the user is logged-in.

[Grab the full example.](https://github.com/auth0-blog/ethereum-login-sample)

### Running the Example
Building and deploying the example is not as straightforward as it may seem due to the nature of Ethereum and current development tools. Here are the steps we used to test the example above.

#### 1. Get an Ethereum node client
There are several Ethereum node clients. A popular one is [go-ethereum](https://github.com/ethereum/go-ethereum), a client written in Go. Download it and install it.

Ethereum, as other cryptocurrencies do, has different versions of the blockchain with different parameters. There are essentially two blockchains: the main official blockchain and a test blockchain. The main blockchain never undoes operations once they are confirmed. Since some operations require money, the main blockchain is not ideal for testing. The test blockchain, on the other hand, is much less strict about forks and changes. It is also simpler to mine "Ether", Ethereum's currency. 

We could use the test network for our example here. However, running a client node for any of the public networks is problematic for one reason: to be able to start doing transactions, the client must first *verify* all previous transactions in the blockchain. That means that bootstrapping a new client node takes quite a bit of time. Fortunately there is an alternative: we can create a new, pristine private Ethereum blockchain to run our tests. To do so, run go-ethereum using the following command line:

```sh
./geth --rpc --nat none --dev
```

#### 2. Create a new Ethereum account to mine some Ether
The `geth` command can also be used to interact with a running client. Launch an interactive console connected to the running client:

```sh
/geth attach ipc:/var/folders/ts/7xznj_p13xb7_5th3w6yjmjm0000gn/T/ethereum_dev_mode/geth.ipc
```

The IPC file mentioned in the command can be found in the output from running the node in our first step. Look for the line that reads:

```
IPC endpoint opened: /var/folders/ts/7xznj_p13xb7_5th3w6yjmjm0000gn/T/ethereum_dev_mode/geth.ipc
```

Now in the Geth console type:

```javascript
personal.newAccount()
```

After hitting `ENTER` a prompt will appear requesting a passphrase. This is the passphrase that will be used to perform any operations using this account. You can think of this as the passphrase required to decrypt the private-key used to sign Ethereum transactions. Do not leave the prompt empty, choose a simple passphrase for testing instead. A new Ethereum address will be returned by the function. If at any point you forget this address, you can list accounts by inspecting `personal.listAccounts` (it's a variable, not a function, so don't add `()` at the end).

> The `geth` console is a JavaScript interpreter.

#### 3. Start mining some Ether
Now it's time to add some Ether to our new account. Ether is required to perform operations in the Ethereum blockchain, so it is necessary to perform this step. Ether can be gathered in two ways: by receiving it from another account or by mining it. Since this is a private network, we will need to mine it. Don't worry, the private network is by default configured to be able to mine Ether easily. Let's do it:

```javascript
miner.setEtherbase(personal.listAccounts[0]) // Hit ENTER
miner.start() // Hit ENTER
```

Now wait a few seconds (or minutes depending on your hardware) and then confirm you have some Ether in your account:

```javascript
eth.getBalance(personal.listAccounts[0]) // Hit ENTER
```

#### 4. Compile and deploy our Login contract
To simplify the process of compiling and deploying contracts, we will use `truffle`. Truffle is a development framework for Ethereum, simplifying many common tasks. Install it:

```sh
npm install -g truffle
```

Before using truffle to deploy contracts, it is necessary to "unlock" our account in our Ethereum node client. Unlocking is the process of decrypting the private-key and holding it in memory using the passphrase used to create it. This allows any client libraries (such as Truffle) connecting to the node to make operations on behalf of the unlocked account. Go to the `geth` console and type:

```javascript
personal.unlockAccount(personal.listAccounts[0]) // Hit ENTER
```

Now switch to the `solidity` directory of our sample application. Edit the `truffle.js` file and set your newly created address as the `from` key. Then run:

```sh
truffle migrate
```

The `migrate` command compiles and deploys the contracts to the Ethereum network on behalf of the account set in `truffle.js`. As a result you will get the address of the newly deployed contract. Take note of it.

#### 5. Install an Ethereum wallet
Ethereum wallets are convenient interfaces for users to interact with the Ethereum network. Sending and receiving Ether, deploying contracts or making calls to them are all operations usually supported by wallets. Mist is the official Ethereum wallet. Download it and install it.

Once installed, we will need to tell Mist to connect to our private network rather than the public main or test networks. To do this, run Mist from the command line like so:

```sh
./Ethereum\ Wallet --rpc /var/folders/ts/7xznj_p13xb7_5th3w6yjmjm0000gn/T/ethereum_dev_mode/geth.ipc
```

The IPC file is the same file used by the `geth` console and can be gathered from the `geth` output logs.

#### 6. Tell the Ethereum wallet of the contract
Many contracts live in the Ethereum network. Wallets need to know a contract's address and interface before being able to interact with them. Let's tell Mist about our Login contract. Go to `Contracts -> Watch Contract` (top right, then bottom left).

![Watch contract](https://cdn.auth0.com/blog/ethereum2/watch-contract.png)

Complete the fields as follows:

- Name: Login
- Contract Address: <address of the contract as returned by Truffle migrate>
- JSON Interface: the abi from `Login.json`. For convenience it is pasted below. Copy and paste it in Mist.

```
[ { "constant": false, "inputs": [ { "name": "challenge", "type": "string" } ], "name": "login", "outputs": [], "payable": false, "type": "function" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "sender", "type": "address" }, { "indexed": false, "name": "challenge", "type": "string" } ], "name": "LoginAttempt", "type": "event" } ]
```

![Watch contract](https://cdn.auth0.com/blog/ethereum2/watch-contract-2.png)

As a test, now try to send some Ether to the contract: `Contracts -> Login -> Transfer Ether & Tokens`. Send `1 Ether` or any other amount less than your balance. You will need to provide the passphrase for your account.

![Send Ether](https://cdn.auth0.com/blog/ethereum2/send-ether.png)

#### 7. Deploy the backend
Go to the `backend` folder and run:

```sh
npm install
node app.js
```

#### 8. Serve the frontend
Go to the `frontend` folder and run:

```sh
npm install -g static-serve
static-serve
```

You may use any other simple static HTTP server such as Python's `SimpleHTTPServer`. If you do so, make sure to serve the app in port 9080. This is important due to CORS.

#### 9. Test everything together!
Open your browser at [http://localhost:9080](http://localhost:9080). Now attempt to login by putting your Ethereum address in the input field. A challenge text will be generated. Go to the Mist (Ethereum Wallet) and go to the Login contract. To the right you will see "WRITE TO CONTRACT". Select the `login` function and paste the challenge in the text fill that appears there. Then click on `Execute`. Input your passphrase and send the transaction.

Now switch back to the login page. After a few seconds the login will be completed and a welcome message will appear. Voilà!

<video width="600" controls src="https://cdn.auth0.com/blog/ethereum2/login.mp4">
</video>

This example shows how a typical Ethereum user can use his existing Ethereum account to login to any third party website supporting Ethereum. And all of this is done without a central server. Although authentication is not performed by the owner of the website, there is no central authority validating the user: it is the Ethereum network that does so.

[Grab the full example.](https://github.com/auth0-blog/ethereum-login-sample)

## Conclusion
We have taken a deeper look at Ethereum: a decentralized, blockchain-based framework for developing applications. Applications run on each node, and each state transition produced by them is validated and recorded by the blockchain. The power of the approach extends the concepts of Bitcoin to more than just monetary transactions or simple non-Turing complete contracts. The power of distributed apps is just beginning to be tapped. In the next post in the series we will take a look at an actual application developed on the Ethereum network: a two-factor authentication system for Ethereum users using a mobile validator application. Stay tuned!
