---
layout: post
title: "How Data Protection Manager (DPM) Works"
description: "DPM, a Microsoft tool, lets you back up various forms of enterprise data in real time."
date: 2017-09-29 8:30
category: Growth
banner:
  text: "Auth0 makes it easy to add authentication to your application."
author:
  name: Diego Poza
  url: https://twitter.com/diegopoza
  avatar: https://avatars3.githubusercontent.com/u/604869?v=3&s=200
  mail: diego.poza@auth0.com
is_non-tech: true
design:
  image: https://cdn.auth0.com/blog/dpm/logo.png
  bg_color: "#3B6DAA"
tags:
- legacy
- modernization
- digital transformation
related:
- 2017-07-21-the-role-of-identity-in-application-modernization
- 2017-07-14-getting-a-competitive-edge-with-a-microservices-based-architecture
- 2017-08-22-for-the-best-security-think-beyond-webhooks
---

After the February 1st, 2017 Gitlab incident, in which six hours of production data were accidentally deleted, the importance of making and maintaining adequate system [backups became very clear to the world](https://about.gitlab.com/2017/02/10/postmortem-of-database-outage-of-january-31/).

As we saw in that incident, a lot of companies make backups. What they seem to forget is that backups are just one part of the equation. It's equally important to consider how those backups will be accessed during an outage, whether it will be possible to restore them in a timely fashion, and what tests need to be consistently run to ensure adequate restore.

If you work within a Microsoft ecosystem, then Data Protection Manager (DPM) is a powerful option for creating and managing backups of all of your data.

### How DPM Works

You can configure DPM to back up your folders and volumes, create full system backups, initiate backups of workloads like SQL Server or Exchange, backup entire Hyper-V virtual machines, and more. Information can be backed up to disk, tape, or to the Microsoft Azure cloud:

- **Disk-based:** In DPM's disk-based protection, a copy of your data is generated, stored, and regularly refreshed on the DPM server. Separate copies are made and maintained for different data sources such as database instances or volumes from a server cluster.
- **Tape-based:** DPM also offers tape-based backups, and though it is mainly intended for long-term storage (where it's combined with disk-based backups for the short-term), you can back up your data primarily to tape.
- **Azure-based:** Whether you deploy DPM as a physical server or Azure virtual machine, you can back up your data to an Azure Recovery Services vault as an alternative to long term tape-based protection.

In the event of a disruption, DPM allows you to immediately restore all of that data.

### Best Use Case Scenarios for DPM

If you're a small business with just one office, or you're backing up volumes that are rarely on-premises, then a more simple, scaled-back solution like Azure Backup agent might be [right for you](https://docs.microsoft.com/en-us/azure/backup/backup-introduction-to-azure-backup). Azure Backup supports backups of both files and folders, but it won't back up VMs, applications, or workloads.

The following kinds of data and workloads can be backed up using DPM:

- Files
- Folders
- Volumes
- Hyper-V VM (Windows)
- Hyper-V VM (Linux)
- Microsoft SQL Server
- Microsoft Sharepoint
- Microsoft Exchange

([Source](https://docs.microsoft.com/en-us/azure/backup/backup-introduction-to-azure-backup))


Microsoft has also put out a slightly less scaled-back version of DPM, [called Azure Backup Server](https://4sysops.com/archives/microsoft-azure-backup-server-mabs-vs-data-protection-manager-dpm/). It's a available for free when you download Azure Backup. Azure Backup Server also offers backups of workloads and other data sources, with some key differences:

- Tape-based protection is only offered with DPM
- DPM allows redundant backups—where you can protect one DPM installation with another
- DPM will also perform recovery of Hyper-V replicas—Azure Backup Server will only do the backing up

Your choice of backup system should track with your needs:

- **I just need to backup files and folders**: Azure Backup agent
- **I need to back up more than files and folders:** Azure Backup Server
- **I need all-in-one management, tape-based protection, and better redundancy:** Data Protection Manager

### Aside: How We Do Backups at Auth0

We have designed Auth0 from the bottom-up to ensure that we can keep serving our customers in the event of any disruption or threat:

- **Infrastructure:** We use SaaS tools and hosts that offer redundancy, so an outage at a single data center or a single disk failing won't affect the continuity of our customers' services.
- **Personnel:** Our staff is distributed all around the world, capable of responding to any problem remotely, and all staff is cross-trained to ensure that there's always someone around that can respond to a threat.
- **Data Storage:** All critical data is stored in the cloud where it is subject to redundant backups. A rigorous testing schedule ensures that all of our backup procedures themselves are operating correctly.

The risk of system failure is always with us, which is why we've worked hard to mitigate that risk through these practices.

![How DPM works](https://cdn.auth0.com/blog/dpm/auth0.png)
