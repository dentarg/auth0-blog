---
layout: post
title: "Azure Storage Introduction"
description: "In this article we will learn about the many ways that Microsoft Azure Storage enables us to store information."
date: 2017-11-01 08:00
category: Technical Guide, Microsoft, Azure
author:
  name: Víctor Moreno
  url: https://twitter.com/vmorenoz
  mail: victor.e.moreno@outlook.com
  avatar: https://pbs.twimg.com/profile_images/621531844719173632/ZgTus250_200x200.jpg
design:
  bg_color: "#134E69"
  image: https://cdn.auth0.com/blog/azure-storage/microsoft-azure-logo.png
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
- 2016-10-11-auth0-with-azure-documentdb
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

Azure Table Storage is a service that stores NoSQL data in the cloud. This storage type enables developers to store schema-less data in a key/value fashion. The main characteristics of Azure Table Storage are:

- Tables are independent of each other.
- Features like foreign keys, joins, and custom indexes don't exist.
- Table schemas are flexible. That is, it's not mandatory to have all fields on all records.

Each table on Azure Table Storage is composed of five main components:

- Entities: We can see these as rows (typical records) on relational databases.
- Partition keys: Strings that contain no more than 1 KB of data. They cover one or more entities in a table, grouping them into blocks of entities that share an ID.
- Row keys: Strings that contain no more than 1 KB of data. They are used to identify rows inside tables uniquely.
- Timestamps: Properties that store when entities were inserted or updated.
- Partitions: Collections of entities in a table. Partitions are identified by their partition key to group them like several tables but inside one object.

![Table Storage structure on Microsoft Azure Storage](https://cdn.auth0.com/blog/azure-storage/table-storage.png)

In the following sections, we will learn how to create tables on Azure Table Storage and how to add entities to them. To see other operations (like table removal or how to update entities), we can check [this Table Storage GitHub repository](https://github.com/vemoreno/TableStorageWithCsharp).

### Creating Tables on Azure Table Storage

In this section, we are going to learn how to create tables on Azure Table Storage. The following C# code snippet shows four easy steps to create a demo table:

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

The first step creates an instance of `StorageCredentials`. To do this, we just need to pass our `Account` name and account `Key`. This information can be retrieved as shown in the following screen:

![Retrieving account name and account key from Azure Storage](https://i.stack.imgur.com/6rIuv.png)

After that we create an instance of `CloudStorageAccount` passing the reference for the `StorageCredentials`. Then, in the third step, we call the `CreateCloudTableClient()` method of our `CloudStorageAccount` to create a new `CloudTableClient`.

Step four consists of using `CloudTableClient` to get a reference to a table called `Demo` and creating it on Azure Table Storage if it doesn't exist.

### Adding Entities to a Table on Azure Table Storage

Now that we know how to create tables on Azure Table Storage, let's learn how to use them to add new entities. In the following example, we use a class called `CustomerEntity`. [The implementation details of this class can be found here](https://github.com/vemoreno/TableStorageWithCsharp/blob/master/AzureTableStorage/AzureTableStorage/Models/MyTableEntity.cs).

```C#
public void AddEntity()
{
  // 1 - retrieve demo table reference from last sample
	CloudTable table = CreateDemoTable();

	// 2 - create an instance of CustomerEntity
	CustomerEntity customer = new CustomerEntity("Harp", "Walter");
	customer.Email = "walter@contoso.com";
	customer.PhoneNumber = "425-555-0101";

	// 3 - insert customer into demo table
	table.Execute(TableOperation.Insert(customer));
}
```

The process to create entities into Azure Table Storage, as we can see, is quite simple. The first step is to retrieve a reference to `CloudTable`. After that, we create a new `CustomerEntity`, with some arbitrary `Email` and `PhoneNumber`. Then, in the third and last step, we instruct `CloudTable` to execute an insert `TableOperation`, passing the customer instance that we just created.

## What is Azure Blob Storage?

Blob, an acronym to "Binary Large OBject", is a collection of binary data that can represent any type of file (like images, videos, documents, programs, etc). Microsoft Azure enables developers to store two types of blobs: *Block Blobs* and *Page Blobs*. In the following sections, we are going to learn about these types and how to store them into Microsoft Azure Storage accounts.

### Block Blobs

[Block Blobs](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-dotnet-how-to-use-blobs#blob-service-concepts) allow developers to handle big files with efficiency. Block Blobs main features on Azure Storage are:

- A single blob can be divided into many blocks, but can never exceed 50,000 blocks.
- Together, these blocks cannot exceed 200 GB.
- Each block can have a maximum size of 4MB.

![Block Blobs Structure on Azure Storage](https://cdn.auth0.com/blog/azure-storage/blob-storage.png)

### Page Blobs

[Page Blobs](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-dotnet-how-to-use-blobs#blob-service-concepts) perform incredibly well on random read/write operations. This characteristic makes Page Blobs the perfect solution for virtual machines and OS data disks. Page Blobs main features on Azure Storage are:

- Capacity of 1 TB of size.
- Compound by a collection of 512-byte pages optimized for random read and write operations.
- Each write operation alter several pages at the same time.

![Page Blobs Structure on Azure Storage](https://cdn.auth0.com/blog/azure-storage/page-blob.png)

### Using Azure Blob Storage

Both Page Blobs and Block Blobs share a concept called *containers*. Some features of containers, in this context, are:

- A container provides a grouping of a set of blobs.
- All blobs must be in a container.
- An account can contain an unlimited number of containers.
- A container can store an unlimited number of blobs. Note that the container name must be lowercase.

The following code snippets show how to create a new container, or how to get the reference to an existing container called `demo-container`:

```C#
public CloudBlobContainer CreateContainer()
{
  // Retrieve the storage account
	StorageCredentials Credentials = new StorageCredentials(this.Account, this.Key);

  // Create a CloudStorageAccount instance
	CloudStorageAccount storageAccount = new CloudStorageAccount(Credentials, false);

	// Create the blob client.
	CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

	// Retrieve a reference to a container.
	CloudBlobContainer container = blobClient.GetContainerReference("demo-container");

	// Create the container if it doesn't already exist.
	container.CreateIfNotExists();

  return container;
}
```

After creating the container, we can upload a blob to it, as shown in the following snippet:

```C#
public void UploadBlobToContainer()
{
  // Get the "demo-container" container reference
	CloudBlobContainer container = CreateContainer();

	// Retrieve reference to a blob called "myblob".
	CloudBlockBlob blockBlob = container.GetBlockBlobReference("myblob");

	// Create or overwrite the "myblob" blob with contents from a local file
	string fullPath = Path.GetDirectoryName(
    Path.GetDirectoryName(System.IO.Directory.GetCurrentDirectory())
  ) + "pin.png";

	using (var fileStream = System.IO.File.OpenRead(fullPath))
	{
		blockBlob.UploadFromStream(fileStream);
	}
}
```

To learn about other operations—like how to list, download, and delete blobs—take a look into this [GitHub repository](https://github.com/vemoreno/BlobStorageWithCsharp).

## What is Azure Queue Storage?

Microsoft Azure provides instant messaging on the cloud between applications through [Queue Storage](https://azure.microsoft.com/en-us/services/storage/queues/). Due to this service, we can process significant amounts of messages and get access to them from anywhere through HTTP/HTTPS calls. Some features of Queue Storage are:

- Messages can have a maximum size of 64 KB of data.
- Any queue can store millions of messages.
- Great for asynchronous processing.

![Queue Storage Structure on Azure Storage](https://cdn.auth0.com/blog/azure-storage/queue-storage.png)

The following code snippets show how to create a new Queue Storage, or how to get the reference to an existing container called `my-queue`:

```C#
public CloudQueue CreateQueue()
{
  // Retrieve the storage account
	StorageCredentials Credentials = new StorageCredentials(this.Account, this.Key);

  // Create a CloudStorageAccount instance
	CloudStorageAccount storageAccount = new CloudStorageAccount(Credentials, false);

	// Create a Queue Storage client
	CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

	// Retrieve a reference to a container
	CloudQueue queue = queueClient.GetQueueReference("my-queue");

	// Create the queue if it doesn't already exist
	queue.CreateIfNotExists();

  return queue
}
```

After creating the Queue Storage, we can insert messages into it, as shown in the following snippet:

```C#
public void InsertMessage()
{
	// Retrieve a reference to my-queue
	CloudQueue queue = CreateQueue();

	// Create a message and add it to the queue.
	CloudQueueMessage message = new CloudQueueMessage("Hello, World");
	queue.AddMessage(message);
}
```

To learn about other operations—like how to peek, change, and dequeue messages—take a look into this [GitHub repository](https://github.com/vemoreno/QueueStorageWithCsharp).

## What is Azure File Storage?

Another way of store information on Microsoft Azure is through File Storage. This service offers shared resources in the cloud. Applications executing locally, on virtual machines, or any other service inside Microsoft Azure can mount a shared resource of files in Azure.

File Storage is flexible and can be handled through the following clients:

- Azure Portal.
- PowerShell.
- API Rest.
- Azure Libraries with .Net and other frameworks.

With File Storage, it is possible to replace file systems based on typical servers hosted on-premises environments. File Storage is secure because it uses the Server Message Block (SMB) Protocol and Common Internet File (CIFS).

A "File Share" is an SMB space in Azure. All directories and files must be created in a parent share. An account can contain an unlimited number of shares, and a share can store an unlimited number of files, up to the 5 TB total capacity of the file share.

![File Storage Structure on Azure Store](https://cdn.auth0.com/blog/azure-storage/file-storage.png)

The following C# code snippet shows how to interact with File Storage on Azure Storage programmatically:

```C#
public void AccessFileStorage()
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

public void SetMaxSize()
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

To learn more about how to deal with File Storage on Azure—like how to access, copy, or manage shared files—take a look into this [GitHub repository](https://github.com/vemoreno/FileStorageWithCsharp).

## Aside: Securing .NET Applications with Auth0

One of the most complex features to implement in an application is [user authentication and identity management](https://auth0.com/user-management). [Security for authentication and identity](https://auth0.com/docs/security) is [an entire glossary](https://auth0.com/identity-glossary) unto itself.

![Auth0 hosted login screen](https://cdn2.auth0.com/blog/angular-aside/angular-aside-login.jpg)

If we need to implement a robust, highly customizable [identity and access management](https://auth0.com/learn/cloud-identity-access-management/) system quickly and easily for our .NET applications, Auth0 can help. As shown in this [quickstart ASP.NET Web API (OWIN) Authorization](https://auth0.com/docs/quickstart/backend/webapi-owin), we need to perform four simple steps. First, we create a Resource Server (API) in our Auth0 account.

![Create a Resource Server (API)](https://cdn2.auth0.com/docs/media/articles/api-auth/create-api.png)

Then we update the `web.config` file in our project with the correct Domain and API Identifier for our API, e.g.

```xml
<appSettings>
  <add key="Auth0Domain" value="bkrebs.auth0.com" />
  <add key="Auth0ApiIdentifier" value="https://bkrebs.auth0.com/api/v2/" />
</appSettings>
```

After that, we install two NuGet packages:

```bash
Install-Package Microsoft.Owin.Security.Jwt
Install-Package Auth0.OpenIdConnectSigningKeyResolver
```

And then we update the `Configuration` method of our `Startup` class to add a call to `UseJwtBearerAuthentication` passing in the configured `JwtBearerAuthenticationOptions`.

```C#
// Startup.cs

public void Configuration(IAppBuilder app)
{
    var domain = $"https://{ConfigurationManager.AppSettings["Auth0Domain"]}/";
    var apiIdentifier = ConfigurationManager.AppSettings["Auth0ApiIdentifier"];

    var keyResolver = new OpenIdConnectSigningKeyResolver(domain);
    app.UseJwtBearerAuthentication(
        new JwtBearerAuthenticationOptions
        {
            AuthenticationMode = AuthenticationMode.Active,
            TokenValidationParameters = new TokenValidationParameters()
            {
                ValidAudience = apiIdentifier,
                ValidIssuer = domain,
                IssuerSigningKeyResolver = (token, securityToken, identifier, parameters) => keyResolver.GetSigningKey(identifier)
            }
        });

    // Configure Web API
    WebApiConfig.Configure(app);
}
```

[The full set of instructions on how to use Auth0 to secure ASP.NET Web APIs (OWIN) can be found here](https://auth0.com/docs/quickstart/backend/webapi-owin). Auth0 also can be easily integrated with [ASP.NET Core Web API](https://auth0.com/docs/quickstart/backend/aspnet-core-webapi) and [a lot of other platforms and frameworks](https://auth0.com/docs).

## Frequently Asked Questions

As we can see, Azure Storage offers developers multiple ways to store information in the cloud. Now that we know a little bit more about Azure Storage, let's look into some frequently asked questions:

### When should we use Table Storage?

Table Storage is useful when we don't need to store data that are linked to each other, like tables on a relational database. Table Storage does support tables, but their schema is flexible and we cannot join different tables through queries. To achieve similar results, we need to this in memory.

### When should we use Blob Storage?

Block blobs are ideal for storing text or binary files, such as documents and media files. Append blobs are similar to block blobs in that they are made up of blocks. Though, as they are optimized for append operations, they are useful for logging scenarios.

Page blobs can have up to 1 TB of data and are more efficient for frequent read/write operations. Azure Virtual Machines use page blobs as their main storage.

### When should we use Queue Storage?

Queue Storage helps developers to create scalable applications that are less sensitive to individual component failure. If part of our architecture goes down, messages are buffered, and then naturally picked up by other message processing nodes, which maintains the integrity of workload.

### When should we use File Storage?

File Storage is a great way to share files in the cloud. It uses HTTPS and SMB to secure data at rest and in-transit and the access to Storage Account is restricted to users having access to Storage Account Key.
