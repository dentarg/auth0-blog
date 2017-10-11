---
layout: post
title: "Azure Storage Introduction"
description: "In this article we will learn about the multiple ways that Microsoft Azure Storage enables us to store information."
date: 2017-10-06 08:00
category: Technical Guide, Microsoft, Azure
author:
  name: Víctor Moreno
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

Azure Storage is the Microsoft solution for cloud storage. Their solution provides four different types of storage:

- [Table Storage](https://docs.microsoft.com/en-us/azure/cosmos-db/table-storage-how-to-use-dotnet)
- [Queue Storage](https://docs.microsoft.com/en-us/azure/storage/queues/storage-dotnet-how-to-use-queues)
- [Blob Storage](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-dotnet-how-to-use-blobs)
- [File Storage](https://docs.microsoft.com/en-us/azure/storage/files/storage-files-introduction)

Before diving into the details about each type, let's talk about *account storages*. An account storage provides a unique namespace for Azure Storage objects. Based on what customers use, Microsoft bills them through their account storages. Every account storage contains a subdomain that is used to access the different storage types. For example, if we had an account storage id called `storagesample` we would get the following subdomain:

- storagesample.blob.core.windows.net
- storagesample.table.core.windows.net
- storagesample.file.core.windows.net
- storagesample.queue.core.windows.net

## What is Azure Table Storage?

Azure Table Storage is a service that stores NoSQL data in the cloud. This storage type enables developers to store schemaless data in a key/value fashion. The main characteristics of Azure Table Storage are:

- Tables are independent from each other.
- Features like foreign keys, joins, and custom indexes don't exist.
- Table schemas are flexible. That is, it's not mandatory to have all fields on all records.

Each table on Azure Table Storage is composed of five main components:

- Entities: We can see these as rows (typical records) on relational databases.
- Partition keys: Strings that contain no more than 1 KB of data. They cover one or more entities in a table, grouping them as blocks of entities that share an ID.
- Row keys: Strings that contain no more than 1 KB of data. They are used to uniquely identify rows inside tables.
- Timestamps: Properties that store when entities were inserted or updated.
- Partitions: Collections of entities in a table. Partitions are identified by their partition key in order to group them like several tables, but inside one object.

![Table Storage structure on Microsoft Azure Storage](https://cdn.auth0.com/blog/azure-storage/table-storage.png)

In the following sections we will learn how to create tables on Azure Table Storage and how to add entities to them. To see other operations (like table removal or how to update entities), we can check [this Table Storage GitHub repository](https://github.com/vemoreno/TableStorageWithCsharp).

### Creating Tables on Azure Table Storage

In this section we are going to learn how to create tables on Azure Table Storage. The following C# code snippet shows four easy steps to create a demo table:

```C#
public CloudTable CreateDemoTable()
{
	// 1 - Retrieve the storage account
	StorageCredentials Credentials = new StorageCredentials(this.Account, this.Key);       

  // 2 - Create a CloudStorageAccount instance
	CloudStorageAccount storageAccount = new CloudStorageAccount(Credentials, false);

	// 3 - Create the table client.
	CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

	// 4 - Retrieve a reference to the table.
	CloudTable table = tableClient.GetTableReference("Demo");
  table.CreateIfNotExists();

  return table;
}
```

The first step creates an instance of `StorageCredentials`. To do this, we just need to pass our `Account` name and account `Key`. These information can be retrieved as shown in the following screen:

![Retrieving account name and account key from Azure Storage](https://i.stack.imgur.com/6rIuv.png)

After that we create an instance of `CloudStorageAccount` passing the reference for the `StorageCredentials`. Then, in the third step, we call the `CreateCloudTableClient()` method of our `CloudStorageAccount` to create a new `CloudTableClient`.

Step four consists of using `CloudTableClient` to get a reference to a table called `Demo` and creating it on Azure Table Storage if it doesn't exist.

### Adding Entities to a Table on Azure Table Storage

Now that we know how to create tables on Azure Table Storage, let's learn how to use them to add new entities. In the following example we use a class called `CustomerEntity`. [The implementation details of the `CustomerEntity` class can be found here](https://github.com/vemoreno/TableStorageWithCsharp/blob/master/AzureTableStorage/AzureTableStorage/Models/MyTableEntity.cs).

```C#
public void AddEntity()
{
  // 1 - retrieve demo table reference
	CloudTable table = CreateDemoTable();

	// 2 - create an instance of CustomerEntity
	CustomerEntity customer = new CustomerEntity("Harp", "Walter");
	customer.Email = "walter@contoso.com";
	customer.PhoneNumber = "425-555-0101";

	// 3 - insert customer into demo table
	table.Execute(TableOperation.Insert(customer));
}
```

## What is Azure Blob Storage?

Blob mean "Binary Large Object" and can represent any kind of file like images, videos, documents, programs, etc. Azure Storage supports two types of blobs: "Block blobs" and "Page blobs":

### Block Blobs

[Block Blobs](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-dotnet-how-to-use-blobs#blob-service-concepts) allow us to handle big files (blobs) with efficiency. Their main features are:

- A single blob can be divided into many blocks, but can never exceed 50,000 blocks.
- Together, these blocks cannot exceed 200 GB.
- Each block can have a maximum size of 4MB.

![Block Blobs Structure](http://bit.ly/2xHlWcg "Block Blobs Structure")

### Page Blobs

[Page Blobs](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-dotnet-how-to-use-blobs#blob-service-concepts) perform incredibly well on random read/write operations. This characteristic makes Page Blobs the perfect solution for virtual machines and OS data disks. Their main features are:

- Capacity of 1 TB of size.
- Compound by a collection of 512 bytes.
- Each write operation alter several pages at the same time.

![Page Blobs Structure](http://bit.ly/2fAyabL "Page Blobs Structure")

Both blobs share a concept called "container", some features of container are:

- A container provides a grouping of a set of blobs.
- All blobs must be in a container.
- An account can contain an unlimited number of containers.
- A container can store an unlimited number of blobs. Note that the container name must be lowercase.

Below you will find C# code fragments that show common operations on Azure Blob Storage, if you are interested to see all the operations (create containers, upload/ list/ download/ delete/ write blobs), I invite you to look into this project from GitHub dedicated to [Blob Storage](https://github.com/vemoreno/BlobStorageWithCsharp).

```C#
public void Create_container()
{
	// Retrieve storage account from connection string.
	StorageCredentials Credentials = new StorageCredentials(this.Account, this.Key);
	CloudStorageAccount storageAccount = new CloudStorageAccount(Credentials, false);

	// Create the blob client.
	CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

	// Retrieve a reference to a container.
	CloudBlobContainer container = blobClient.GetContainerReference("mycontainer");

	// Create the container if it doesn't already exist.
	container.CreateIfNotExists();
}

public void Upload_a_blob_into_a_container()
{
	// Retrieve storage account from connection string.
	StorageCredentials Credentials = new StorageCredentials(this.Account, this.Key);
	CloudStorageAccount storageAccount = new CloudStorageAccount(Credentials, false);

	// Create the blob client.
	CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

	// Retrieve reference to a previously created container.
	CloudBlobContainer container = blobClient.GetContainerReference("mycontainer");

	// Retrieve reference to a blob named "myblob".
	CloudBlockBlob blockBlob = container.GetBlockBlobReference("myblob");

	// Create or overwrite the "myblob" blob with contents from a local file.
	string fullPath= Path.GetDirectoryName(Path.GetDirectoryName(System.IO.Directory.GetCurrentDirectory())) + "pin.png";
	using (var fileStream = System.IO.File.OpenRead(fullPath))
	{
		blockBlob.UploadFromStream(fileStream);
	}
}
```
## What is Azure Queue Storage?

Microsoft Azure provide us instant messaging on the cloud between applications using Queue Storage. Thanks to this service we can process big amounts of messages and get access from anywhere through HTTP / HTTPS calls. Some features or Queue Storage are:

- Messages can have a maximum size of 64 Kb.
- Any queue can store millions of messages (the limit is our account storage).
- Asynchronous processing, using threads for run every queue.

![Queue Storage Structure](http://bit.ly/2yP7Ym3 "Queue Storage Structure")

Below you will find C# code fragments that show common operations on Azure Queue Storage, if you are interested to see all the operations (create/ delete queues, insert/ peek/ change/ dequeue/ get/ delete messages), I invite you to look into this project from GitHub dedicated to [Queue Storage](https://github.com/vemoreno/QueueStorageWithCsharp).

```C#
public void Create_a_Queue()
{
	// Retrieve storage account from connection string.
	StorageCredentials Credentials = new StorageCredentials(this.Account, this.Key);
	CloudStorageAccount storageAccount = new CloudStorageAccount(Credentials, false);

	// Create the queue client.
	CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

	// Retrieve a reference to a container.
	CloudQueue queue = queueClient.GetQueueReference("myqueue");

	// Create the queue if it doesn't already exist
	queue.CreateIfNotExists();
}

public void Insert_a_message_into_a_queue()
{
	// Retrieve storage account from connection string.
	StorageCredentials Credentials = new StorageCredentials(this.Account, this.Key);
	CloudStorageAccount storageAccount = new CloudStorageAccount(Credentials, false);

	// Create the queue client.
	CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

	// Retrieve a reference to a queue.
	CloudQueue queue = queueClient.GetQueueReference("myqueue");

	// Create the queue if it doesn't already exist.
	queue.CreateIfNotExists();

	// Create a message and add it to the queue.
	CloudQueueMessage message = new CloudQueueMessage("Hello, World");
	queue.AddMessage(message);
}
```
## What is Azure File Storage?

Another way of store information on Microsoft Azure is File Storage. It's a service offering shared resources on the Cloud. Applications executing locally, on virtual machines or any other service inside Microsoft Azure can mount a shared resource of files in Azure.
File Storage is flexible and can be handled through the following clients:

- Azure Portal.
- Power Shell.
- API Rest.
- Azure Libraries with .Net and other frameworks.

With File Storage is possible replace file systems based on typical servers hosted on-premises environments. File Storage is secure because use the Server Message Block (SMB) Protocol and Common Internet File (CIFS).
A "File Share" is an SMB space in Azure. All directories and files must be created in a parent share. An account can contain an unlimited number of shares, and a share can store an unlimited number of files, up to the 5 TB total capacity of the file share.

![File Storage Structure](http://bit.ly/2g0xtcp "File Storage Structure")

Below you will find C# code fragments that show common operations on Azure File Storage, if you are interested to see all the operations (set restrictions, access/ copy/ manage shared files), I invite you to look into this project from GitHub dedicated to [File Storage](https://github.com/vemoreno/FileStorageWithCsharp)

```C#
public void Access_the_file_share_programmatically()
{
	// Retrieve storage account from connection string.
	StorageCredentials Credentials = new StorageCredentials(this.Account, this.Key);
	CloudStorageAccount storageAccount = new CloudStorageAccount(Credentials, false);

	// Create a CloudFileClient object for credentialed access to File storage.
	CloudFileClient fileClient = storageAccount.CreateCloudFileClient();

	// Get a reference to the file share we created previously.
	CloudFileShare share = fileClient.GetShareReference("logs");

	// Ensure that the share exists.
	if (share.Exists())
	{
		// Get a reference to the root directory for the share.
		CloudFileDirectory rootDir = share.GetRootDirectoryReference();

		// Get a reference to the directory we created previously.
		CloudFileDirectory sampleDir = rootDir.GetDirectoryReference("CustomLogs");

		// Ensure that the directory exists.
		if (sampleDir.Exists())
		{
			// Get a reference to the file we created previously.
			CloudFile file = sampleDir.GetFileReference("Log1.txt");

			// Ensure that the file exists.
			if (file.Exists())
			{
				// Write the contents of the file to the console window.
				Console.WriteLine(file.DownloadTextAsync().Result);
			}
		}
	}
}

public void Set_the_maximum_size_for_a_file_share()
{
	// Parse the connection string for the storage account.
	StorageCredentials Credentials = new StorageCredentials(this.Account, this.Key);
	CloudStorageAccount storageAccount = new CloudStorageAccount(Credentials, false);

	// Create a CloudFileClient object for credentialed access to File storage.
	CloudFileClient fileClient = storageAccount.CreateCloudFileClient();

	// Get a reference to the file share we created previously.
	CloudFileShare share = fileClient.GetShareReference("logs");

	// Ensure that the share exists.
	if (share.Exists())
	{
		// Check current usage stats for the share.
		// Note that the ShareStats object is part of the protocol layer for the File service.
		Microsoft.WindowsAzure.Storage.File.Protocol.ShareStats stats = share.GetStats();
		Console.WriteLine("Current share usage: {0} GB", stats.Usage.ToString());

		// Specify the maximum size of the share, in GB.
		// This line sets the quota to be 10 GB greater than the current usage of the share.
		share.Properties.Quota = 10 + stats.Usage;
		share.SetProperties();

		// Now check the quota for the share. Call FetchAttributes() to populate the share's properties.
		share.FetchAttributes();
		Console.WriteLine("Current share quota: {0} GB", share.Properties.Quota);
	}
}
```
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
