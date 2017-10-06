---
layout: post
title: "4 ways to store inside Azure Storage"
description: "This article will teach you to know multiples ways to store information in the Microsoft Cloud"
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

Azure Storage is more than a lot of space to place files. The Microsoft cloud storage solution provides different types of storage on the cloud, like: 
[tables](https://docs.microsoft.com/en-us/azure/cosmos-db/table-storage-how-to-use-dotnet), 
[queues](https://docs.microsoft.com/en-us/azure/storage/queues/storage-dotnet-how-to-use-queues),
[blobs](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-dotnet-how-to-use-blobs), and 
[files](https://docs.microsoft.com/en-us/azure/storage/files/storage-files-introduction). 
Before talking about each type, it's necessary to talk about "account storage" as this is how Microsoft Azure organises accounts.

An account storage provides a unique namespace for Azure Storage objects, and Microsoft bills customers, based on what they use, through their account storages. Every account storage contains a subdomain that is used to access the different storage types:

- storagesample.blob.core.windows.net
- storagesample.table.core.windows.net
- storagesample.file.core.windows.net
- storagesample.queue.core.windows.net

## What is Azure Table Storage?

Azure Table Storage is a service that stores structured NoSQL data in the cloud, providing a key/attribute store with a schemaless design, these are it's main characteristics:

- Tables are independent of each other, because don't share an schema.
- Features like foreign keys, joins, and custom indexes don't exist.
- Table schemas are flexible. It's not mandatory to have all fields on all records.

Azure Table Storage are made of three main components:

- Entities: We can see them as rows or typical records in relational databases.
- Properties: All table storages must contains at least three properties:
  + Partition key: String type that contains no more than 1 KB. It covers one or more entities in the table, making blocks of entities and grouping them with an ID.
  + Row key: A string that contains no more than 1KB and that is used to uniquely identify one entity inside a table partitions.  
  + Timestamp: A property that stores the time when an entity was inserted or updated in the table.
- Partitions: They are a collection of entities in a table sharing the same partition key in order to group data like several tables, but inside one object.

![Table Storage Structure](http://bit.ly/2fYEqL8 "Table Storage Structure")

Below you will find fragments of code related to Azure Table Storage common operations with C#, if you are interested to see all the operations, I invite you to look into this project from GitHub dedicated to [Table Storage](https://github.com/vemoreno/TableStorageWithCsharp). 

```C#
public void Create_a_table()
{
	//Retrieve the storage account from the connection string.

	StorageCredentials Credentials = new StorageCredentials(this.Account, this.Key);            
	CloudStorageAccount storageAccount = new CloudStorageAccount(Credentials, false);

	// Create the table client.
	CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

	// Retrieve a reference to the table.
	CloudTable table = tableClient.GetTableReference("Demo");

	// Create the table if it doesn't exist.
	table.CreateIfNotExists();
	MessageBox.Show("Table created", "Entity", MessageBoxButtons.OK);
}

public void Add_an_entity_to_a_table()
{
	//Retrieve the storage account from the connection string.
	StorageCredentials Credentials = new StorageCredentials(this.Account, this.Key);
	CloudStorageAccount storageAccount = new CloudStorageAccount(Credentials, false);

	// Create the table client.
	CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

	// Create the CloudTable object that represents the "Demo" table.
	CloudTable table = tableClient.GetTableReference("Demo");

	// Create a new customer entity.
	CustomerEntity customer1 = new CustomerEntity("Harp", "Walter");
	customer1.Email = "Walter@contoso.com";
	customer1.PhoneNumber = "425-555-0101";

	// Create the TableOperation object that inserts the customer entity.
	TableOperation insertOperation = TableOperation.Insert(customer1);

	// Execute the insert operation.
	table.Execute(insertOperation);
	MessageBox.Show("Entity added", "Entity", MessageBoxButtons.OK);
}
```

## What is Azure Blob Storage?

Blob mean "Binary Large Object" and can represent any kind of file like images, videos, documents, programs, etc. Azure Storage supports two types of blobs: "Block blobs" and "Page blobs":

### Block Blobs 

Block Blobs allow us to handle big files (blobs) with efficiency. Their main features are:

- A single blob can be divided into many blocks, but can never exceed 50,000 blocks.
- Together, these blocks cannot exceed 200 GB.
- Each block can have a maximum size of 4MB.

![Block Blobs Structure](http://bit.ly/2xHlWcg "Block Blobs Structure")

### Page Blobs 

Page Blobs perform incredibly well on random read/write operations. This characteristic makes Page Blobs the perfect solution for virtual machines and OS data disks. Their main features are:

- Capacity of 1 TB of size.
- Compound by a collection of 512 bytes.
- Each write operation alter several pages at the same time.

![Page Blobs Structure](http://bit.ly/2fAyabL "Page Blobs Structure")

Both blobs share a concept called "container". A container is part of the name for every blob and group unlimited number of blobs. It can be like a folder in the windows system files, and example could be: 

storagesample.blob.core.windows.net/mycontainer/blob1.txt

The above link defines how the blob can be referenced by https protocol.

Below you will find fragments of code related to Azure Blob Storage common operations with C#, if you are interested to see all the operations, I invite you to look into this project from GitHub dedicated to [Blob Storage](https://github.com/vemoreno/BlobStorageWithCsharp)

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

Below you will find fragments of code related to Azure Queue Storage common operations with C#, if you are interested to see all the operations, I invite you to look into this project from GitHub dedicated to [Queue Storage](https://github.com/vemoreno/QueueStorageWithCsharp)

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

Below you will find fragments of code related to Azure File Storage common operations with C#, if you are interested to see all the operations, I invite you to look into this project from GitHub dedicated to [File Storage](https://github.com/vemoreno/FileStorageWithCsharp)

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