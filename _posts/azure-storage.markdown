
---
layout: post
title: "Introduction to Azure Storage"
description: "This article will help you to know multiples ways to Storage information in the Microsoft Cloud"
date: 2017-09-12 12:30
category: Technical Guide, Microsoft, Azure
author:
  name: Victor Moreno
  url: https://twitter.com/vmorenoz
  mail: victor.e.moreno@outlook.com
  avatar: https://pbs.twimg.com/profile_images/621531844719173632/ZgTus250_200x200.jpg
design:
  bg_color: "#0072C6"
  image: https://cdn2.auth0.com/blog/azure-logs-analytics/logo.png
tags:
- azure
- storage
- azure-storage
- blob
- blob-storage
- table
- table-storage
- queue
- queue-storage
- file
- file-storage
related:
- 2017-01-05-azure-search-with-aspnetcore
- 2017-04-13-auth0-to-azure-log-analytics
---

## What is Azure Storage?

Azure Storage is more than a lot of space to place files. The Microsoft cloud storage solution provides different types of storage on the cloud, like: tables, queues, blobs, and files. Before talking about each type, it's necessary to talk about "account storage" as this is how Microsoft Azure organises accounts.

An account storage provides a unique namespace for Azure Storage objects, through our account we'll be billed depending of the use. Every account storage gives us "urls" for access all the objects such as: tables, queues, blobs or files. And example would be:

- [https://storagesample.blob.core.windows.net](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-dotnet-how-to-use-blobs)

- [https://storagesample.table.core.windows.net](https://docs.microsoft.com/en-us/azure/cosmos-db/table-storage-how-to-use-dotnet)

- [https://storagesample.file.core.windows.net](https://docs.microsoft.com/en-us/azure/storage/files/storage-files-introduction)

- [https://storagesample.queue.core.windows.net](https://docs.microsoft.com/en-us/azure/storage/queues/storage-dotnet-how-to-use-queues)

## Talking about Table Storage

Table Storage is not a relational database, but an alternative to it, these are his main characteristics:

- The tables are independent of each other, because don't share an scheme.

- Features like foreign keys, joins, and custom indexes don't exist.

- It's not mandatory to hava all the columns filled.

Table Storages are made of three main components:

- Entities: We can see them as rows or typical records in relational databases.

- Properties: All table storages must contains at least three properties:
  + Partition key: String type and no greater than 1 KB, it covers one or more entities in the table, making blocks of entities and grouping them with an ID.
  + Row key: String type and no greater than 1 KB, identify uniquely one entity inside of the table partitions.  
  + Time stamp: Store the time when an entity was inserted or updated in the table.

- Partitions: They are a collection of entities in a table sharing the same partition key.

![Table Storage Structure](http://bit.ly/2fYEqL8 "Table Storage Structure")

I invite you to look into this project from GitHub dedicated to [Table Storage](https://github.com/vemoreno/TableStorageWithCsharp). It will help you to manage data in Table Storage with Microsoft Azure using C# .Net: 

- create/delete tables

- add/remove/get/update/query entities

This <a href="https://www.youtube.com/watch?v=Iac8otwKi6k" target="_blank">VIDEO</a> show you how it's working from Visual Studio directly to Microsoft Azure using and account storage.

## Talking about Blob Storage

Blobs mean "Binary Large Objects" and can represent any kind of file like images, videos, documents, programs, etc. Azure Storage supports two types of blobs: "Block blobs" and "Page blobs":

### Block blobs 

They allow us to handle blobs with big size efficiently, their main features are:
- A single blob can be divided into many blocks, but never exceed 50,000 blocks.

- Together, these blocks cannot exceed 200 GB.

- Blocks can have a maximum size of 4 MB.

![Block Blobs Structure](http://bit.ly/2xHlWcg "Block Blobs Structure")

### Page blobs 

They allow us to make optimized random read/write operations. Virtual machines and OS data disks uses Page blobs, their main features are:

- Capacity of 1 TB of size.

- Compound by a collection of 512 bytes.

- Each write operation alter several pages at the same time.

![Page Blobs Structure](http://bit.ly/2fAyabL "Page Blobs Structure")

Both blobs share a concept called "container". A container is part of the name for every blob and group unlimited number of blobs. It can be like a folder in the windows system files, and example could be: 

[https://storagesample.blob.core.windows.net/mycontainer/blob1.txt](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-dotnet-how-to-use-blobs)

The above link defines how the blob can be referenced by https protocol.

I invite you to look into this project from GitHub dedicated to [Blob Storage](https://github.com/vemoreno/BlobStorageWithCsharp). It will help you to manage data with Blob Storage with Microsoft Azure using C# .Net: 

-	create containers. 

-	upload/list/download/delete/write blobs.

## Talking about Queue Storage

Microsoft Azure provide us instant messaging on the cloud between applications using Queue Storage. Thanks to this service we can process big amounts of messages and get access from anywhere through HTTP / HTTPS calls. Some features or Queue Storage are:

- Messages can have a maximum size of 64 Kb. 

- Any queue can store millions of messages (the limit is our account storage).

- Asynchronous processing, using threads for run every queue.

![Queue Storage Structure](http://bit.ly/2yP7Ym3 "Queue Storage Structure")

I invite you to look into this project from GitHub dedicated to [Queue Storage](https://github.com/vemoreno/QueueStorageWithCsharp). It will help you to manage data with Queue Storage with Microsoft Azure using C# .Net: 

- create/delete queues

- insert/peek/change/dequeue/get/delete messages.

## Talking about File Storage

Another way of store information on Microsoft Azure is File Storage. It's a service offering shared resources on the Cloud. Applications executing locally, on virtual machines or any other service inside Microsoft Azure can mount a shared resource of files in Azure. 
File Storage is flexible and can be handled through the following clients:

- Azure Portal.

- Power Shell.

- API Rest.

- Azure Libraries with .Net and other frameworks.

With File Storage is possible replace file systems based on typical servers hosted on-premises environments. File Storage is secure because use the Server Message Block (SMB) Protocol and Common Internet File (CIFS).
A "File Share" is an SMB space in Azure. All directories and files must be created in a parent share. An account can contain an unlimited number of shares, and a share can store an unlimited number of files, up to the 5 TB total capacity of the file share. 

![File Storage Structure](http://bit.ly/2g0xtcp "File Storage Structure")

I invite you to look into this project from GitHub dedicated to [File Storage](https://github.com/vemoreno/FileStorageWithCsharp). It will help you to manage data with File Storage with Microsoft Azure using C# .Net: 

- Set restrictions

- Access/copy/manage shared files.

## Aside: Securing XYZ Applications with Auth0

This section will be filled with more information.

## Some conclusions about Azure Storage

As we can see, Azure Storage offer us multiples ways to store information on the cloud, now we are going to answer some questions in order to clarify the opportunities for our projects and necessities:

+ When should we use Table Storage?

Table Storage is useful when we don't need to store data that are linked to each other, like tables on a relational database. Table Storage does support tables, but their schema is flexible and we cannot join different tables to get a specific result.

+ When should we use Blob Storage?

Block blobs are ideal for storing text or binary files, such as documents and media files. Append blobs are similar to block blobs in that they are made up of blocks, but they are optimized for append operations, so they are useful for logging scenarios. 
Page blobs can be up to 1 TB in size, and are more efficient for frequent read/write operations. Azure Virtual Machines use page blobs as OS and data disks. 

+ When should we use Queue Storage?

Queue Storage helps to make our applications scalable and less sensitive to individual component failure. If part of our architecture goes down, messages are buffered, and then naturally picked up by other message processing nodes, which maintains the integrity of workload.

+ When should we use File Storage?

File Storage helps to access our file repositories on the cloud safety, avoiding to use file systems based on typical servers. It uses HTTPS and SMB for securing data in transit and the access to Storage Account is restricted to users having access to Storage Account Key or SAS to ensure security of your data at all stages data lifecycle.
