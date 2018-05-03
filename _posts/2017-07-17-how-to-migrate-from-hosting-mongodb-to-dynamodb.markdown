---
layout: post_extend
title: "From Hosting MongoDB to DynamoDB"
description: Migrate your storage where the grass is greener
date: 2017-07-17 09:23
is_extend: true
alias: /how-to-migrate-from-mongodb-to-dynamodb/
category: Product
canonical_url: true
author: 
  name: "Tomasz Janczuk"
  url: "https://twitter.com/tjanczuk"
  mail: "tomek@auth0.com"
  avatar: "https://s.gravatar.com/avatar/53f70144dc9d7c76455fa91f858d4cec?s=200"
design: 
  bg_color: "#3445dc"
  image: "https://cdn.auth0.com/blog/website-extend/blocks-graphic01.png"
tags: 
- extend

---

Persisting data is at the heart of the majority of web services today. The choice of a database system is one of the most important decisions you will make when selecting elements of your stack. Database technology, once selected, is one of the hardest to replace once the system is in production.

![Auth0 Extend](https://cdn.auth0.com/website/auth0-extend/images/landing-hero.svg)

This post is about ditching hosting MongoDB and moving to DynamoDB as part of our ongoing evolution of the [Auth0 Extend](https://auth0.com/extend/developers) product. I will cover the why and how, and share solutions to some of the challenges of this transition.

---

### What are the Data Needs of Auth0 Extend? 

[Auth0 Extend](https://auth0.com/extend/developers) is a managed service that can be integrated into a SaaS product to support authoring and execution of custom code that customers write to extend the SaaS platform.

> You can think of Auth0 Extend as a better alternative to webhooks: it is webhooks with authoring and serverless execution environment included.

Auth0 Extend uses storage to persist information about webtasks (their code, encrypted configuration, metadata), CRON jobs (their schedules, status, execution history), as well as NPM modules available in various environments (their status, build history, location of pre-built artifacts). In addition to basic CRUD operations, Auth0 Extend also implements a specialized queue semantics on top of persistent storage. In a distributed environment of our technology stack, achieving the desired guarantees requires the use of more advanced DB constructs.

### The MongoDB Honeymoon

Back in 2014, when we were starting the work on [Auth0 Webtasks](https://webtask.io), the serverless technology underlying the Auth0 Extend product, the choice of Mongo for the storage layer was a no-brainer. Mongo was already used with the  Auth0 identity product and we had started building in-house expertise of this technology.

The killer feature of Mongo at that early stage of development was the flexibility of the schema.

> Unless you are sending a space probe to Neptune and back, it is unlikely you are going to start a software project with a predetermined schema of your data.

Choosing a DB system that allows you to easily adjust the schema as the project evolves is key to enabling fast progress.

So Mongo it was. We kept adding collections, modifying schemas, optimizing indexes to efficiently manipulate the data, and we had a great time. Up until our Auth0 Extend platform stabilized and matured, the flexibility of Mongo was crucial in helping us quickly get to where we needed to be.

### Cracks in the Wall

At this point any self-respecting post on moving from Mongo to DynamoDB would show a smoking gun: pathetically poor performance numbers, horrible reliability data, evidence of leaking fake data to Russian hackers, or at least proof of some scandal. I am afraid I have to disappoint.

> MongoDB continues to work great for us. Features are more than sufficient, performance is more than adequate, and reliability is where we need it to be.

So what is the problem? Hosting your own Mongo creates jobs. Too many jobs.

In the early days of Auth0, we had experimented with a few SaaS providers offering hosted Mongo solutions. At the end of the day none allowed us to fully satisfy our requirements for locality of data, reliability, monitoring, and level of control needed to meet our SLAs. As a result we developed in-house capabilities necessary to maintain our own Mongo deployments on top of raw compute, either in AWS or on-premise. While this approach worked great for a limited number of deployments, it prevented us from quickly scaling out the Auth0 Extend offering to all AWS regions. Having to host our own Mongo instance in every AWS region was too much to handle for a small team.

At this point we made a tactical choice to revisit outsourcing the storage layer of our infrastructure and took a broader look at the available options.

> Our core competency in Auth0 Extend was extending SaaS platforms with custom code, not managing our storage.

Since AWS is the primary cloud provider we target, we started looking at managed storage options in AWS. DynamoDB quickly emerged as a potential candidate that would allow us to satisfy our global aspirations without hiring an army or breaking the bank. It is touted as being fast and reliable, and with recent additions of in-memory cache and auto-scaling, it became a very appealing target. The question remained: could we replicate the data access semantics we had with Mongo onto DynamoDB?

### MongoDB vs DynamoDB

No two database systems are created equal, even if both label themselves as *document storage* systems. Both MongoDB and DynamoDB allow you to store JSON-like data with almost arbitrary schema. There is even an AWS migration tool that helps perform an automatic, naive import of data from Mongo to DynamoDB.

> The key difference between Mongo and DynamoDB is that the latter is much more prescriptive in how you can efficiently index and access the data.

If you are looking for a storage system for transactional data, it is crucial that all database operations can be optimized to execute very efficiently. MongoDB offers much greater flexibility in indexing data for a variety of access modes compared to DynamoDB. As a result the main challenge in moving from Mongo to DynamoDB is in designing your indexing strategy in DynamoDB to support the desired access modes. It may not always be possible. In our case it was. The rest of this post will show a few of the tricks we used.

### DynamoDB Indexing in a Nutshell

If you are new to DynamoDB and undertaking data migration from another DB system like Mongo, I highly recommend you first read *through* the [DynamoDB Developer Guide](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html). Successfully migrating anything more complex than simple key/value pairs requires following the guidance in the developer's guide.

Storage in DynamoDB is organized into *tables*, with each table being an independent unit with its own indexes, capacity, and scalability configuration. DynamoDB tables are similar to MongoDB collections in that the data they hold is independent.

While DynamoDB allows storage of data with arbitrary schema, your ability to create indexes over that data is much more limited compared to Mongo:

* Each DynamoDB table must have a unique primary index. It is made up of one or two fields: a mandatory *partition key* (hash key) and an optional *sort key* (range key). The partition key dictates the placement of data within DynamoDB. For performance reasons it is recommended the values of the partition key are widely distributed. The sort key acts as a secondary key within a partition.

* Each DynamoDB table can have up to 5 *local secondary indexes*. These indexes must share the same partition key as the primary index of the table, but can have a different sort key. Local secondary indexes do not need to be unique.

* Each DynamoDB table can also have up to 5 *global secondary indexes*. The best way to think of the global secondary index is as a "peer table". A global secondary index contains the same documents as the primary table, and will eventually become consistent with the primary table. However, you are allowed to define entirely new partition and sort keys for the global secondary index.

DynamoDB supports three main ways to lookup data for reading or modification: the *getItem* operation retrieves a single item given its full primary key. The *query* operation retrieves a list of items based on an exact match of the partition key and optional filter conditions over the sort key or any other fields within the table. Lastly, the *scan* operation allows you more flexibility in expressing conditions over any of the fields, but is inefficient because it scans the entire contents of the table. Needless to say, *query* is your friend if you care about leveraging indexes for efficient lookup.

With these DynamoDB primitives in mind, let's have a look at a few examples of how we migrated away from Mongo constructs used in Auth0 Extend.

### Case 1: CRUD and List

In Auth0 Extend, webtasks are stored in a single MongoDB collection. Each webtask can be uniquely identified with a *{webtask_container},{webtask_name}* pair, which is unique within a deployment of the webtask technology. However, a single Mongo database was designed to support multiple deployments. Given that, to arrive at a unique identifier of a webtask within a single database, the *{deployment_key},{webtask_container},{webtask_name}* triplet must be used.

To support efficient execution and management of webtasks, the system must support the following operations:

* Efficient CRUD on a specific webtask.
* Listing of all webtasks in a given webtask container.

Supporting both scenarios in MongoDB is very simple. A single complex index on *{deployment_key},{webtask_container},{webtask_name}* supports both efficient CRUD of a specific webtask as well as listing of all webtasks within a specific container (in which case only the *{deployment_key},{webtask_contaier}* part of the index is used by the query), e.g.:

```javascript
// Read specific webtask
db.collection('webtasks').findOne({
  deployment_key: 'auth0',
  webtask_container: 'mycontainer',
  webtask_name: 'mywebtask'
}, ...);

// List all webtasks in a container
db.collection('webtasks').find({
  deployment_key: 'auth0',
  webtask_container: 'mycontainer'  
}, ...);
```

The challenge with migrating to DynamoDB is that a complex primary index in a DynamoDB table can only support up to two fields. Here is how you can still design an index that will efficiently support both CRUD and listing operations:

* The partition key is a compound string of the form `{deployment_key}/{webtask_container}`.
* The sort key is the `{webtask_name}`.

CRUD operations on a specific webtask specify the full primary key. List operations can be efficiently implemented with a DynamoDB's *query* operation that only specifies the partition key as part of its key condition. Doing so logically narrows down the results to webtasks with a specific *{deployment_key}* and *{webtask_container}*:

```javascript
// Read specific webtask
dynamodb.getItem({
  Key: {
    deployment_container: { S: 'auth0/mycontainer' },
    webtask_name: { S: 'mywebtask' }
  }
}, ...);

// List all webtasks in a container
dynamodb.query({
  ExpressionAttributeNames: {
    '#deployment_container': 'deployment_container'
  },
  ExpressionAttributeValues: {
    ':deployment_container': { S: 'auth0/mycontainer' }
  },
  KeyConditionExpression: '#deployment_container = :deployment_container',
}, ...);
```

The trick of composing the partition key of a DynamoDB table out of components that taken together make up the scope of a logical *list* operation proved to be a pattern we used extensively in other places to support efficient execution of the queries. Note that the *query* operation in DynamoDB, while requiring a strict match on the partition key, allows more flexible conditions to be expressed over the sort key. For example, in addition to exactly matching the partition key, you can also efficiently match on the prefix of the sort key.

### Case 2: Atomic Find and Update

The ability to atomically update a document that meets specific selection criteria is a construct that is fundamental to implementing many higher level operations in distributed systems. Within Auth0 Extend we relied on Mongo's *findOneAndUpdate* operation when implementing an exclusive job reservation in our CRON subsystem, as well as to detect conflicts when writing to webtask storage.

Consider how Mongo's *findOneAndUpdate* can be used to ensure that a document is only updated if its version in the database matches the version last read by the caller:

```javascript
// Update a document with new_data only if
// its version matches the expected_version
var expected_version;
var new_data;

db.collection('webtask_storage').findOneAndUpdate({
  // deployment_key, webtask_container, webtask_name
  // make up unique primary key
  deployment_key: 'auth0',
  webtask_container: 'mycontainer',
  webtask_name: 'mywebtask',
  // version is the current version of the document
  version: expected_version
}, {
  // set new data
  $set: { data: new_data },
  // update version
  $inc: { version: 1 }
}, (error, result) => {
  if (error) throw error;
  if (result && result.value) {
    // Update was successful
  }
  else {
    // Conflict detected - version has changed since last read
  }
});
```

DynamoDB's *UpdateItem* operation supports similar semantics with a combination of a *Key* clause to select the item to be updated using its primary key, and a *ConditionExpression* to ensure the item still has the expected version before it is updated:

```javascript
// Update a document with new_data only if
// its version matches the expected_version
var expected_version;
var new_data;

dynamodb.updateItem({
  // Select unique item using primary key
  Key: {
    deployment_container: { S: 'auth0/mycontainer' },
    webtask_name: { S: 'mywebtask' }
  },
  // Ensure it still has the expected version
  ConditionExpression: '#version = :version',
  // Set the new data if it does, and update version
  UpdateExpression: 'SET #data = :data ADD #version 1',
  // Definitions
  ExpressionAttributeNames: {
    '#version': 'version',
    '#data': 'data'
  },
  ExpressionAttributeValues: {
    ':version': { N: expected_version },
    ':data': new_data
  }
}, (error, result) => {
  if (error) {
    if (error.code === 'ConditionalCheckFailedException') {
      // Conflict detected - version has changed since last read
    }
    else {
      // Other error
      throw error;
    }
  }
  else {
    // Update was successful
  }
});
```

The *ConditionExpression* allows you to ensure a specific document in the table is in a required state before updating it atomically. A similar clause called *FilterExpression* can be specified for the *query* operation to narrow down the selected items beyond the selection done using the key attributes alone. The latter must be used with care though, since filter expressions are  evaluated in a brute-force manner for every item that matches the key condition.

### Case 3: CRON Jobs

Auth0 Extend supports scheduled jobs. Scheduled jobs are like regular webtasks, except they are invoked automatically by the Auth0 Extend runtime following a pre-configured schedule. Scheduled jobs are persisted in the database and must be efficiently accessed in the following scenarios:

* The management APIs perform basic CRUD and List operations on CRON jobs. CRUD operations require that CRON jobs are uniquely identified with a *{deployment_key},{webtask_container},{webtask_name}* primary key. List operations are scoped to *{deplyment_key},{webtask_container}* pairs.
* The CRON daemon must be able to identify the next job to run. Each CRON job has a *{next_available_at}* property that contains the EPOCH time when the job is scheduled to run next. To choose the next job to run, the daemon must select a CRON job with the smallest value of *{next_available_at}* that is also less or equal to *now*. This selection is performed at the scope of a specific *{deployment_key}*.

The Mongo implementation uses two indexes. One is a complex index on *{deployment_key},{webtask_container},{webtask_name}* which supports the CRUD and List operations: CRUD uses the full key to uniquely identify a CRON job, while List uses only the first two segments: *{deplyment_key},{webtask_container}*:

```javascript
// Read specific CRON job
db.collection('cron_jobs').findOne({
  deployment_key: 'auth0',
  webtask_container: 'mycontainer',
  webtask_name: 'mywebtask'
}, ...);

// List all CRON jobs in a container
db.collection('cron_jobs').find({
  deployment_key: 'auth0',
  webtask_container: 'mycontainer'  
}, ...);
```

The CRON daemon uses another index on *{deplyment_key},{next_available_at}* to efficiently pick the next job to run:

```javascript
// Select next CRON job to run
var now = Date.now();

db.collection('cron_jobs').findOne({
  deployment_key: 'auth0',
  next_available_at: { $lte: now }
}, null, {
  sort: { next_available_at: 1 }
}, ...);
```

Migrating this usage pattern to DynamoDB required some careful planning to efficiently support all operations.

The CRUD and List operations can be supported with a complex primary key consisting of *{deployment_key}* partition key and a composite sort key of the form *{webtask_container}/{webtask_name}*. CRUD operations can then fully specify all components of the primary key, while the List operation can specify the exact partition key along with a prefix condition on sort key:

```javascript
// Read specific CRON job
dynamodb.getItem({
  Key: {
    deployment_key: { S: 'auth0' },
    container_name: { S: 'mycontainer/mywebtask' }
  }
}, ...);

// List all CRON jobs in a container
dynamodb.query({
  ExpressionAttributeNames: {
    '#deployment_key': 'deployment_key',
    '#container_name': 'container_name'
  },
  ExpressionAttributeValues: {
    ':deployment_key': { S: 'auth0' },
    ':prefix': { S: 'mycontainer/' }
  },
  KeyConditionExpression: [
    '#deployment_key = :deployment_key',
    'begins_with(#container_name, :prefix)'
  ].join(' AND ')
}, ...);
```

Now why did we complicate the structure of the primary key compared to the pattern described in *Case 1* before? It was done so that we could efficiently support another index on the same table required by the daemeon to select the next job to run. Given that the partition key of the primary key is the value of *{deployment_key}*, we then created a *local secondary index* with the same partition key and the value of *{next_available_at}* as the sort key. Using that index (called *work_queue*) we can efficiently query for the next CRON job to run:

```javascript
var now = Date.now();

dynamodb.query({
  IndexName: 'work_queue',
  ExpressionAttributeNames: {
      '#deployment_key': 'deployment_key',
      '#next_available_at': 'next_available_at'
  },
  ExpressionAttributeValues: {
      ':deployment_key': { S: 'auth0' },
      ':now': { N: now }
  },
  KeyConditionExpression: [
    '#deployment_key = :deployment_key',
    '#next_available_at <= :now'
  ].join(' AND '),
  Limit: 1
}, ...);
```

The reason this works is that documents within a specific partition key are sorted using the index's sort key, so limiting the result set to one document will naturally return the entry the smallest *next_available_at* value.

A similar effect could have been accomplished with a global secondary index. The benefit of using a local secondary index instead of a global one is that global indexes are more expensive to maintain: every write to the table also requires a write to the global index, increasing the total cost of the operation.

If you like solving crosswords you will also like designing DynamoDB indexes, especially *local secondary indexes*.

## Aside: Securing Applications with Auth0

Are you building a [B2C](https://auth0.com/b2c-customer-identity-management), [B2B](https://auth0.com/b2b-enterprise-identity-management), or [B2E](https://auth0.com/b2e-identity-management-for-employees) tool? Auth0, can help you focus on what matters the most to you, the special features of your product. [Auth0](https://auth0.com/) can improve your product's security with state-of-the-art features like [passwordless](https://auth0.com/passwordless), [breached password surveillance](https://auth0.com/breached-passwords), and [multifactor authentication](https://auth0.com/multifactor-authentication).

[We offer a generous **free tier**](https://auth0.com/pricing) so you can get started with modern authentication.

### What's Next?

We successfully moved Auth0 Extend's data layer from MongoDB to DynamoDB. This enabled us to support our product in all AWS regions, something that would be much more difficult for us to sustain organizationally while self-hosting Mongo.

While we have achieved the "code complete, all tests passing" stage of the transition, we know it is just the beginning of the journey.

> There is a large distance separating writing software from running a service.

The work that lies ahead includes:

* Designing a robust cross-region failover mechanism.
* Stabilization and performance tuning of the new stack.  

To support these, we are looking forward to exploring DynamoDB streams, auto-scaling, and in-memory caching. Stay tuned for more technical posts related to this space. In the meantime, if you are looking for a backstage story on another technological revolution within our stack, check out [how we ditched Kafka to move to ZeroMQ](https://tomasz.janczuk.org/2015/09/from-kafka-to-zeromq-for-log-aggregation.html). 

