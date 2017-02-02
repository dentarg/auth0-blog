---
layout: post
title: "An Introduction to Ethereum and Smart Contracts"
description: "Learn how Ethereum and its Turing-complete smart contracts can shape the future of secure transactions"
date: 2017-02-02 12:30
category: Technical Guide
author:
  name: Sebastián Peyrott
  url: https://twitter.com/speyrott?lang=en
  mail: speyrott@auth0.com
  avatar: https://en.gravatar.com/userimage/92476393/001c9ddc5ceb9829b6aaf24f5d28502a.png?size=200
design:
  bg_color: "#222228"
  image: https://cdn.auth0.com/blog/es6rundown/logo.png
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
- 2016-11-16-a-rundown-of-es6-features
- 2016-03-15-javascript-module-systems-showdown
- 2015-10-14-7-things-you-should-know-about-web-assembly
---

[Bitcoin]() took the world by suprise in the year 2009 and popularized the idea of decentralized secure monetary transactions. The concepts behind it, however, can be extended to much more than just digital currencies. [Ethereum]() attempts to do that, marrying the power of decentralized transactions with a Turing-complete contract system. Read on as we explore how it works!

{% include tweet_quote.html quote_text="Ethereum marries the power of decentralized transactions with Turing-complete contracts!" %}

-----

## Introduction: Bitcoin and the Double-Spending Problem
In 2009, someone, under the alias of Satoshi Nakamoto, released this [iconic Bitcoin whitepaper](https://bitcoin.org/bitcoin.pdf). Bitcoin was poised to solve a very specific problem: how can the [double-spending problem](https://en.wikipedia.org/wiki/Double-spending) be solved without a central authority acting as arbiter to each transaction?

To be fair, this problem had been in the [minds of researchers](http://eprint.iacr.org/2015/464.pdf) for [some time](http://ieeexplore.ieee.org/document/4268195/?reload=true) before Bitcoin was released. But where previous solution where of research quality, Bitcoin succeeded in bringing a working, production ready design to the masses.

> The earliest references to some of the concepts directly applied to Bitcoin are from the 1990s. In 2005, Nick Szabo, a computer scientist, introduced the concept of [Bitgold](http://unenumerated.blogspot.com/2005/12/bit-gold.html), a precursor to Bitcoin, sharing many of its concepts. The similarities between Bitgold and Bitcoin are sufficient that some people [have speculated he might be Satoshi Nakamoto](https://dave.liberty.me/who-is-satoshi-nakamoto/).

The double-spending problem is a specific case of [transaction processing](https://en.wikipedia.org/wiki/Transaction_processing). Transactions, by definition, must either happen or not. Additionally, some (but not all) transactions must provide the guarantee of happening before or after other transactions (in other words, they must be atomic). Atomicity gives rise to the notion of ordering: transactions either happen or not before or after other transactions. A lack of atomicity is precisely the problem of the double-spending problem: "spending", or sending money from spender A to receiver B, must happen at a specific point in time, and before and after any other transactions. If this were not the case, it would be possible to spend money more than once in separate but simultaneous transactions.

When it comes to everyday monetary operations, transactions are usually arbitrated by banks. When a user logs-in to his or her home-banking system and performs a wire-transfer, it is the bank that makes sure any past and future operations are consistent. Although the process might seem simple to outsiders, it is actually quite an involved process with [clearing procedures](https://en.wikipedia.org/wiki/Clearing_%28finance%29) and [settlement requirements](https://en.wikipedia.org/wiki/Settlement_%28finance%29). In fact, some of these procedures consider the chance of a double-spending situation and what to do in those cases. It should not come as a surprise that these quite involved processes, resulting in considerable but seemingly impossible to surmount delays, where the target of computer science researchers.

## The Blockchain
So, the main problem any transactional system appliead to finance must address is "how to order transactions when there is no central authority". Furthermore, there can be no doubts as to whether the sequence of past transactions is valid. For a monetary system to succeed, there can be no way any parties can modify previous transactions. In other words, a "vetting process" for past transactions must also be in place. This is precisely what the blockchain system in Bitcoin was designed to address. 

> If you are interested in reading about systems that must reach consensus and the problems they face, [the paper for The Byzantine Generals Problem](http://lamport.azurewebsites.net/pubs/byz.pdf) is a good start.

Although at this point the concept of what a blockchain is is murky, before getting into details about it, let's go over the problems the blockchain attempts to address.

### Validating Transactions
[Public-key cryptography](https://en.wikipedia.org/wiki/Public-key_cryptography) is a great tool to deal with one of the problems: validating transactions. Public-key cryptography relies on the asymmetrical mathematical complexity of a very specific set of problems. The asymmetry in public-key cryptography is embodied in the existance of two keys: a public and a private key. These keys are used in tandem for specific purposes. In particular:

- Data encrypted with the public-key can only be decrypted by using the private-key.
- Data signed with the private-key can be verified using the public-key.

The private-key cannot be derived from the public-key, but the public-key can be derived from the private-key. The public-key is meant to be safely shared and can usually be freely exposed to anyone.

Of interest for creating a verifiable set of transactions is the operation of signing data. Let's see how a very simple transaction can be verified through the use of public-key cryptography.

Let's say there is an account holder A who owns 50 coins. These coins weere sent to him as part of a previous transaction. Account holder A now wants to send these coins to account holder B. B, and anybody else who wants to scrutinize this transaction, must be able to verify that it was actually A who sent the coins to B. Furthermore, they must be able to see B redeemed them, and noone else. Obviously, they should also be able to find the exact point in time, relative to other transactions, in which this transaction took place. However, at this point we cannot do this. We can, fortunately, do everything else.

For our simple example, let's say the data in the transaction is just an identifier for the previous transaction (the one that gave A 50 coins in first place), the public-key of the current owner and the signature from the previous owner (confirming he or she sent those coins to A in first place): 

```json
{ 
    "previous-transaction-id": "FEDCBA987654321...",
    "owner-pubkey": "123456789ABCDEF...",
    "prev-owner-signature": "AABBCCDDEEFF112233..."
}
``` 

The number of coins of the current transaction is superfluous: it is simply the same amount as the previous transaction linked in it.

Proof that A is the owner of these coins is already there: his or her public-key is embedded in the transaction. Now whatever action is taken by A must be verified in some way. One way to do this would be to add information to the transaction and then produce a new signature. Since A wants to send money to B, the added information could simply be B's public-key. After creating this new transaction it could be signed using A's private-key. This proves A, and only A, was involved in the creating of this transaction. In other words, in JavaScript based pseudo-code:

```javascript
function aToB(privateKeyA, previousTransaction, publicKeyB) {
    const transaction = {
        "previous-transaction-id": hash(previousTransaction),
        "owner-pubkey": publicKeyB        
    };

    transaction["prev-owner-signature"] = sign(privateKeyA, transaction);
    
    return transaction;
}
```

An interesting thing to note is that we have defined transactions IDs as simply the hash of their binary representation. In other words, a transaction ID is simply its hash (using an, at this point, unspecified hashing algorithm). This is convenient for several reasons we will explain later on. For now, it is just one possible way of doing things.

Let's take the code apart and write it down step-by-step:

1. A new transaction is constructed pointing to the previous transaction (the one that holds A's 50 coins) and including B's public signature (new transaction = old transaction ID plus receiver's public key).
2. A signature is produced using the new transaction and the previous transaction owner's private key (A's private key).

That's it. The signature in the new transaction creates a verifiable link between the new transaction and the old one. The new transaction points to the old one explicitly and the new transaction's signature can only be generated by the holder of the private-key of the old transaction (the old transaction explicitly tells us who this is through the `owner-pubkey` field). So the old transaction holds the public-key of the one who can spend it, and the new transaction holds the public-key of the one who received it, along with the signature created with the spender's private-key.

If this seems hard to grasp at this point, think of it this way: it is all derived from this simple expression: *data signed with the private-key can be verified using the public-key*. There is nothing more to it. The spender simply signs data that says "I am the owner of transaction ID XXX, I hereby send every coin in it to B". B, and anybody else, can check that it was A, and only A, who wrote that. To do so, they need only access to A's public-key, which is available in the transaction itself. It is mathematically guaranteed that no key other than A's private-key can be used in tandem with A's public-key. So by simply having access to A's public-key anyone can see it was A who sent money to B. This makes B the rightful owner of that money. Of course, this is a simplification. There are two things we have not considered: who said those 50 coins where of A's property (or, in other words, did A just take ownership of some random transaction, is he or she the rightful owner?) and when exactly did A send the coins to B (was it before or after other transactions?).

> If you are interested in learning more about the math behind public-key cryptography, a simple introduction with code samples is available in chapter 7 of [The JWT Handbook]().

Before getting into the matter of ordering, let's first tackle the problem of *coin genesis*. We assumed A was the rightful owner of the 50 coins in our example because the transaction that gave A his or her coins was simply modeled like any other transaction: it had A's public-key in the owner field, and it did point to a previous transaction. So, who gave those coins to A? What's more, who gave the coins to that other person? We need only follow the transaction links. Each transaction points to the previous one in the *chain*, so where did those 50 coins come from? At some point that chain must end.

To understand how this works, it is best to consider an actual case, so let's see how Bitcoin handles it. Coins in Bitcoin were and are created in two different ways. First there is the unique *genesis block*. The genesis block is a special, hardcoded transaction that points to no other previous transaction. It is the first transaction in the system, has a specific amount of Bitcoins, and points to a public-key that belongs to Bitcoin creator Satoshi Nakamoto. Some of the coins in this transaction were sent to some addresses, but they never were really used that much. Most of the coins in Bitcoin come from another place: they are an *incentive*. As we will see in the next section about ordering transactions, the scheme employed to do this requires nodes in the network to contribute work in the form of computations. To create an incentive for more nodes to contribute computations, a certain amount of coins are awarded to contributing nodes when they successfully complete a task. This incentive essentially results in special transactions that give birth to new coins. These transactions are also ends to links of transactions, as well as the genesis block. Each coin in Bitcoin can be traced to either one of these incentives or the genesis block. Many cryptocurrency systems adopt this model of coin genesis, each with its own nuances and requirements for coin creation. In Bitcoin, per design, as more coins get created, less coins are awarded as incentive. Eventually, coin creation will cease.

### Ordering Transactions
The biggest contribution Bitcoin brought to existing cryptocurrency schemes was a decentralized way to make transactions atomic. Before Bitcoin, researchers proposed different schemes to achieve this. One of those schemes was a simple voting system. To better understand the magic of Bitcoin's approach, it is better to explore these attempts.

In a voting system, each transaction gets broadcast by the node performing it. So, to continue with the example of A sending 50 coins to B, A prepares a new transaction pointing to the one that gave him or her those 50 coins, then puts B's public-key in it and uses his or her own private-key (A's) to sign it. This transaction is then sent to each node known by A in the network. Let's say that in addition to A and B, there are three other nodes: C, D, E.

![A broadcasts the transaction]()

Now let's imagine A is in fact a malicious node. Although it appears A wants to send B 50 coins, at the same time A broadcasts this transaction, it also broadcasts a different one: A sends those same 50 coins to C.

```javascript
const aToB = { 
    "previous-transaction-id": "FEDCBA987654321...",
    "owner-pubkey": "123456789ABCDEF...", // B
    "prev-owner-signature": "..."
};

const aToC = { 
    "previous-transaction-id": "FEDCBA987654321...",
    "owner-pubkey": "00112233445566...", // C
    "prev-owner-signature": "..."
};
```

Note how `previous-transaction-id` points to the same transaction. `A` sends simultaneously this transaction to different nodes in the network. Who gets the 50 coins? Worse, if those 50 coins were sent in exchange for something, A might get goods from B and C although one of them won't get the coins.

Since this is a distributed network, each node should have some weight in the decision. Let's consider the voting system mentioned before. Each node should now cast a vote on whether to pick which transaction goes first.

| Node | Vote |
| ---- | ---- |
| A    | A to B |
| B    | A to B |
| C    | A to C |
| D    | A to C |
| E    | A to B |

Each node casts a vote and `A to B` gets picked as the transaction that should go first. Obviously, this invalidates the `A to C` transaction that points to the same coins as `A to B`. It would appear this solution works, but only superficially so. Let's see why.

First, let's consider the case A has colluded with some other node. Did E cast a random vote or was it in some way motivated by A to pick one transaction over the other? There is no real way to determine this.

Secondly, our model does not consider the speed of propagation of transactions. In a sufficiently large network of nodes, some nodes may see some transactions before others. This causes votes to be unbalanced. It is not possible to determine whether a future transaction might invalidate the ones that have arrived. Even more, it is not possible to determine whether the transaction that just arrived was made before or after some other transaction waiting for a vote. Unless transactions are seen by all nodes, votes can be unfair. Worse, some node could actively delay the propagation of a transaction.

Lastly, a malicious node could inject invalid transactions to cause a targeted denial of service. This could be used to favor certain transactions over others.

Votes do not fix these problems because they are inherent to the design of the system. Whatever is used to favor one transaction over the other cannot be left to choice. As long as a single node, or group of nodes, can, in some way, favor some transactions over others, the system cannot work. It is precisely this element that made the design of cryptocurrencies such a hard endeavor. A strike of genius was needed to overcome such a profound design issue.

> The problem of malicious nodes casting a vote in distributed systems is best known as [The Byzantine Generals Problem](http://research.microsoft.com/en-us/um/people/lamport/pubs/byz.pdf). Although there is mathematical proof that this problem can be overcome as long as there is a certain ratio of non-malicious nodes, this does not solve the problem for cryptocurrencies: nodes are cheap to add. Therefore, a different solution is necessary.

#### Physics to the Rescue
Whatever system is used to ensure some transactions are preferred over others, no node should be able to choose which of these are with 100% certainty. And there is only one way one can be sure this is the case: if it is a *physical impossibility* for the node to be able to do this. Nodes are cheap to add, so no matter how many nodes a malicious user controls, it should still be hard for him or her to use this to his or her advantage.

The answer is CPU power. What if ordering transactions required a certain amount of work, verifiable work, in such a way that it would be hard to perform initially, but cheap to verify. In a sense, cryptography works under the same principles: certain related operations are computationally infeasible to perform while others are cheap. Encrypting data is cheap next to brute-forcing the encryption key. Deriving the public-key from the private-key is cheap, while it is infeasible to do it the other way around. *Hashing data is cheap, while finding a hash with a specific set of requirements (by modifying the input data) is not.* And that is the main operation Bitcoin and other cryptocurrencies rely on to make sure no node can get ahead of others, on average. Let's see how this works.

First, let's define what a block is. A block is simply a group of transactions. Inside the block, these transactions are set in a specific order and fulfill the basic requirements of any transaction. In particular, an invalid transaction (such as one taking funds from an account with no funds) cannot be part of a block. In addition to the transactions, a block carries something called *proof-of-work*. The proof-of-work is data the allows any node to verify that the one who created this block performed a considerable amount of computational work. In other words, no node can create a valid block without performing an indefinite but considerable amount of work. We will see how this works later, but for now know that creating any block requires a certain amount of computing power and that any other node can check that that power has been spent by whomever created the block.

Now let's go back to our previous example of a malicious node, A, double-spending 50 coins by trying to create to two separate transactions at the same time, one sending money to B and the other to C. After A broadcasts both transactions to the network, every node working on creating blocks (which may include A) pick a number of transactions and order them in whichever way they prefer. These nodes will note that two incompatible transactions are part of the same block and will discard one. They are free to pick which one to discard. After placing these transactions in the order they chose, each node starts solving the puzzle of finding a hash for the block that fits the conditions set by the protocol. One simple condition could be "find a hash for this block with three leading zeroes". To iterate over possible solutions for this problem, the block contains a special variable field known as the "nonce". Each node must iterate as many times as necessary until they find the nonce that creates a block with a hash that fits the conditions set by the protocol (three leading zeroes). Since each change in the nonce basically results in a random output for a cryptographically secure hash function, finding the nonce is a game of chance and can only be sped up by increasing computation power. Even then, a less powerful node might find the right nonce before a more powerful node, due to the randomness of the problem.

This creates an interesting scenario because even if A is a malicious node and controls another node (for instance, E) any other node on the network still has a chance of finding a different valid block. In other words, this scheme makes it hard for malicious nodes to take control of the network.

Still, the case of a big number of malicious nodes colluding and sharing CPU power must be considered. In fact, an entity controlling a majority of the nodes (in terms of CPU power, not number) could exercise a double-spending attack by creating blocks faster than other nodes. Big enough networks rely on the difficulty of amassing CPU power. While in a voting system an attacker need only add nodes to the network (which is easy, as free access to the network is a design target), in a CPU power based scheme an attacker faces a physical limitation: getting access to more and more powerful hardware.

### Definition
At last we can attempt a full definition of what a blockchain is and how it works. A blockchain is a verifiable transaction database carrying an ordered list of all transactions that ever occurred. Transactions are stored in blocks. Block creation is a purposely computationally intensive task. The difficulty of creation of a valid block forces anyone to spend a certain amount of work. This ensures malicious users in a big enough network cannot easily outpass honest users. Each block in the network points to the previous block, effectively creating a chain. The longer a block has been in the blockchain (the farther it is from the last block), the lesser the probability it can ever be removed from it. In other words, the older the block, the more secure it is.

One important detail we left in previous paragraphs is what happens when two different nodes find different but still valid blocks at the same time. In a sense, this looks like the same problem transactions had: which one to pick. In contrast with transactions, the proof-of-work system required for each block lets us find a convenient solution: since each block requires a certain amount of work, it is only natural that the only valid blockchain is the one with most blocks in it. Think about it: if the proof-of-work system works because each block demands a certain amount of work (and time), the longest set of valid blocks is the *hardest* to break. If a malicious node or group of nodes were to attempt to create a different set of valid blocks, by always picking the longest blockchain, they would always have to redo a bigger number of blocks (because each node points to the previous one, changing one block forces a change in all blocks after it). This is also the reason malicious groups of nodes need to control over 50% of the computational power of the network to actually carry any attack. Less than that, and the rest of the network will create a longer blockchain faster.

Valid blocks that are valid but find their way into shorter *forks* of the blockchain are discarded if a longer version of the blockchain is computed by other nodes. The transactions in the discarded blocks are sent again to the pool of transactions awaiting inclusion into future blocks. This causes new transactions to remain in an *uncofirmed* state until they find their way into the longest possible blockchain. Nodes periodically receive newer versions of the blockchain from other nodes.

It is entirely possible for the network to be forked if a sufficiently large number of nodes gets disconnected at the same time from another part of the network. If this happens, each fork will continue creating blocks in isolation from the other. If the networks merge again in the future, the nodes will compare the different versions of the blockchains and pick the longer one. The fork with the greater computational power will always win. If the fork where to be sustained for a long enough period of time, a big number of transactions would be undone when the merge took place. It is for this reason that forks are problematic.

Forks can also be caused by a change in the protocol or the software running the nodes. These changes can result in nodes invalidating blocks that are considered valid by other nodes. The effect is identical to a network-related fork.

## Ethereum: a Programmable Blockchain
Although the concept of the blockchain was born out of the research into cryptocurrencies, they are much more powerful than just that. Blockchains essentially encode one thing: state transitions. Whenever someone sends a coin in Bitcoin to someone, the global state of the blockchain is changed. Moments before account A hold 50 coins, now account A is empty and account B holds 50 coins. Furthermore, the blockchain provides a cryptographically secure way of performing these state transitions. In other words, not only the state of the blockchain can be verified by any outside party, but any state transitions initiated by blockchain users can only be performed in a secure, verifiable manner.

All software systems deal in some way or another with state transitions. So what if we could generalize the state transitions inside a blockchain into any software we could think of. Are there any inherent limitations in the blockchain concept that would prevent state transitions from being something different than sending coins? The answer is no. Blockchains deal with reaching consensus for decentralized computations, it does not matter what those computations are. And this is exactly what the Ethereum network brings to the table: a blockchain that can perform any computation as part of a transaction.

It is easy to get lost in the world of cryptocurrencies and simple exchanges of value between two users, but there are many other applications where distributed, secure computations make sense. In fact, even Bitcoin allows for a limited form of computation as part of its transaction system. It is this system that allows for things like:

- Secure deposits that get returned to the payer if conditions are met (or not)
- Money that cannot be spent unless a certain [number of users agree to spending it](https://en.bitcoin.it/wiki/Multisignature)
- Money that can only be spent after producing external data that satisfies rules set in the script

Given a Turing-complete system for computations associated to a blockchain, many more applications are possible. This is Ethereum.

### Ether
Although Ethereum brings general computations to the blockchain, it still makes use of a "coin". Its coin is called "ether", and, as any coin, it is a number that can be stored into account addresses and can be spent or received as part of transactions or block generation. This begs the question "why is it necessary at all?".

A [Turing-complete language](https://en.wikipedia.org/wiki/Turing_completeness) is a language that, by definition, can perform any computation. In other words, if there is an algorithm for something, it can express it. Ethereum scripts, called *smart contracts*, can thus run any computation. Computations are run as part of a transaction. This means each node in the network must run computations. Any machine capable of running a Turing-complete language (i.e. a Turing machine) has one problem: the [halting problem](https://en.wikipedia.org/wiki/Halting_problem). The halting problem essentially states that no Turing machine can determine beforehand whether a program run in it will either terminate (halt) or run forever. In other words, the only way of finding out if a piece of code loops forever or not is by running that code. This poses a big problem for Ethereum: no single node can get caught up in an infinite loop running a program. Doing so would essentially stop the evolution of the blockchain and halt all transactions. But there is a way around that.

Since computation is costly, and it is in fact rewarded by giving nodes that produce blocks ether (like Bitcoin), what better way to limit computations than by requiring ether for running them. Thus Ethereum solves the problem of denial of service attacks through malicious (or bugged) scripts that run forever. Every time a script is run, the user requesting the script to run must set a limit of ether to spend in it. Ether is consumed by the script as it runs. This is ensured by the virtual machine that runs the scripts. If the script cannot complete before running out of ether, it is halted at that point. In Ethereum the ether assigned to an script as a limit is known as *gas* (as in gasoline).

As ether represents value, it can be converted to other coins. Exchanges exist to trade ether for other coins. This gives ether a [real money valuation](https://coinmarketcap.com/currencies/ethereum/), much like coins from Bitcoin.

### Smart Contracts
Smart contracts are the key element of Ethereum. In them any algorithm can be encoded. Smart contracts can carry arbitrary state and can perform any arbitrary computations. They are even able to call other smart contracts. This gives the scripting facilities of Ethereum tremendous flexibility.

Smart contracts are run by each node as part of the block creation process. Just like Bitcoin, block creation is the moment where transactions actually take place, in the sense that once a transaction takes place inside a block, global blockchain state is changed. Ordering affects state changes, and just like in Bitcoin, each node is free to choose the order of transactions inside a block. After doing so (and executing the transactions), a certain amount of work must be performed to create a valid block. In contrast to Bitcoin, Ethereum follows a different pattern for selecting which blocks get added to the valid blockchain. While in Bitcoin the longest chain of valid blocks is always the rightful blockchain, Ethereum follows a protocol called [GHOST](https://www.cryptocompare.com/coins/guides/what-is-the-ghost-protocol-for-ethereum/) (in fact a variation thereof). The GHOST protocol allows for stale blocks, blocks that were computed by other nodes but that would otherwise be discarded since others have computed newer blocks, to be integrated into the blockchain, reducing wasted computing power and increasing incentives for slower nodes. It also allows for faster confirmation of transactions: whereas in Bitcoin blocks are usually created every 10 minutes, in Ethereum blocks are created within seconds. [Much discussion](https://news.ycombinator.com/item?id=7553418) has gone into whether this protocol is an improvement over the much simpler "fastest longest chain" protocol in Bitcoin, however this discussion is out of scope for this article. For now this protocol appears to run with success in Ethereum.

An important aspect of how smart contracts work in Ethereum is that they have their own address in the blockchain. In other words, contract code is not carried inside each transaction that makes use of it. This would quickly become unwieldy. Instead, a node can create a special transaction that assigns an address to a contract. This transaction can also run code at the moment of creation. After this initial transaction, the contract becomes forever a part of the blockchain and its address never changes. Whenever a node wants to call any of the methods defined by the contract, it can send a message to the address for the contract, specifying data as input and the method that must be called. The contract will run as part of the creation of newer blocks up to the *gas limit* or completion. Contract methods can return a value or store data. This data is part of the state of the blockchain.

#### State
An interesting aspect of contracts being able to store data is how can that be handled in an efficient way. If state is mutated by contracts, and the nature of the blockchain ensures that state is always consistent across all nodes, then all nodes must have access to the whole state stored in the blockchain. Since the size of this storage in unlimited in principle, this raises questions with regards to how to handle this effectively as the network scales. In particular, how can smaller and less powerful nodes make use of the Ethereum network if they can't store the whole state? How can they perform computations? To solve this, Ethereum makes use of something called [Merkle Patricia Trees](https://easythereentropy.wordpress.com/2014/06/04/understanding-the-ethereum-trie/).

A Merkle Patricia Tree is a special kind of data structure that can store cryptographically authenticated data in the form of keys and values. A Merkle Patricia Tree with a certain group of keys and values can only be constructed in a single way. In other words, given the same set of keys and values, two Merkle Patricia Trees constructed independently will result in the same structure bit-by-bit. A special property of Merkle Patricia Trees is that the value of the root key (the first key in the tree) depends on the values of all sub-keys. This means that any change to the tree results in a completely different root key value. Changes to a leaf cause all keys leading to the root key through that branch to be recomputed. What we have described is in fact the "Merkle" part of the tree, the "Patricia" part comes from the nature keys are located in the tree. In Patricia trees the key of the node is actually its hash value (the hash of the data contained in it). Only leaf nodes can contain data. All other nodes are simply pathways to the leaves. These intermediary nodes are constructed using binary prefixes of the keys. In this way, two keys that share a binary prefix also share intermediary nodes. The Merkle Patricia Trees implemented in Ethereum have other optimizations that overcome inefficiencies inherent to the simple algorithm described here.

For our purposes, the Merkle aspect of the trees are what matter in Ethereum. Rather than keeping the whole tree inside a block, the hash of its root node (which is simply its key value) is embedded in the block. If some malicious node were to tamper with the state of the blockchain, it would become evident as soon as other nodes computed the hash of the root node using the tampered data. The resulting hash would simply not match with the one recorded in the block. At this point we should find ourselves asking a big question: why not simply take the hash of the data? Merkle Patricia Trees are used in Ethereum for a different, but very important reason: most of the time, nodes do not need a full copy of the whole state of the system. Rather, they want to have a partial view of the state, complete enough to perform any necessary computations for newer blocks or to read the state from some specific address. Since no computations usually require access to the whole state stored in the blockchain, downloading all state would be superfluous. In fact, if nodes had to do this, scalability would be a serious concern as the network expanded. To verify a partial piece of the state at a given point, a node need only download the data necessary for a branch of the tree and the hashes of its siblings. Any change in the data stored at a leaf would require a malicious node to be able to carry a [preimage attack](https://en.wikipedia.org/wiki/Preimage_attack) against the hashing algorithm of the tree (to find the values for the siblings that combined with the modified data produce the same root hash as the one stored in the block).

All of this allows efficient operations on the state of the blockchain, while at the same time keeping its actual (potentially huge) data separate from the block, still the center piece of the security scheme of the blockchain.

#### History
Much like Bitcoin, the blockchain can be used to find the state of the system at any point in time. This can be done by replaying each transaction from the very first block up to the point in question. However, in contrast to Bitcoin, most nodes do not keep a full copy of the data for every point in time. Ethereum allows for old data to be *pruned* from the blockchain. The blockchain remains consistent as long as the blocks are valid, and data is stored outside of the blocks, so technically it is not required to verify the proof of work chain. In contrast to Bitcoin, where to find the balance of an account a node must replay all transactions leading up to that point, Ethereum stores state by keeping the root hash of the Merkle Patricia Tree in each block. As long as the data for the last block (or any past blocks) is available, future operations can be performed in the Ethereum network. In other words, it is not necessary for the network to replay old transactions, since their result is already available. This would be akin to storing the balance of each account in each block in the Bitcoin network.

There are, however, nodes that store the whole copy of the historical state of the blockchain. This serves for historical and development purposes.

#### Solidity and a Sample Smart Contract
Smart contracts run on the Ethereum Virtual Machine, which in turn runs on each node. Though powerful, the Ethereum Virtual Machine works at a much too low level to be convenient to directly program (like most VMs). For this reason, several languages for writing contracts have been developed. Of these, the most popular one is [Solidity](https://solidity.readthedocs.io/en/develop/).

Solidity is a JavaScript-like language developed specifically for writing Ethereum Smart Contracts. The Solidity compiler turns this code into Ethereum Virutal Machine bytecode, which can then be sent to the Ethereum network as a transaction to be given its own address.

To better understand Solidity, let's take a look at one example.

```solidity
```

### Current and Potential Uses

## Aside: Linking Identities to Ethereum Addesses

## Conclusion
