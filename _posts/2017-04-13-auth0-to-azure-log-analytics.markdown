---
layout: post
title: "Ship your Auth0 logs to Azure Log Analytics"
description: Learn about the main features of Azure Log Analytics and how you can integrate it with Auth0
date: 2017-04-13 08:30
category: Technical Guide, Microsoft, Log Analytics
banner:
  text: "Ship and analyze your Auth0 logs in Azure Log Analytics."
design:
  bg_color: "#0072C6"
  image: https://cdn2.auth0.com/blog/azure-logs-analytics/logo.png
author:
  name: Matías Quaranta
  url: http://twitter.com/ealsur
  mail: ealsur@hotmail.com
  avatar: https://s.gravatar.com/avatar/6b3f7d049c5109218dbefd86712da2d5?s=80
tags:
- azure
- logging
- analytics
related:
- 2017-03-10-using-serverless-azure-functions-with-auth0-and-google-apis
- 2017-01-05-azure-search-with-aspnetcore
- 2016-10-26-documentdb-with-aspnetcore
---

---

**TL;DR:** In this article, you will learn how to integrate Auth0 with Azure Log Analytics, ship your logs automatically, and analyze them later on your OMS Portal.

---

The need for logging is probably as old as computers, and its importance has grown hand in hand with the complexity of distributed architectures.

It is common nowadays for applications and platforms to span multiple servers, service instances, languages, and even technologies. Keeping the status and logs of every part becomes a _challenge_.

If you are an architect or in charge of the infrastructure of a platform, you might discover that each team is defining their own logging pipeline, different from the rest. This leads to a _disconnected scenario_ where _tracking a single problem_ across modules becomes a daunting and almost _impossible_ task.

You need a _single_, _reliable_, and _performant service_ where you can _store_ all your logs, no matter what their origin is, and query them afterward to _create knowledge_. This service needs to understand a _universal format_ that can be implemented by all of your teams, no matter what technology they use.

## Azure Log Analytics to the rescue

Azure Log Analytics is a [logging-as-a-service](https://azure.microsoft.com/services/log-analytics/) solution that can help you collect and analyze data from your cloud or on-premises sources. These sources can be anything from a local server, monitored by an [agent](https://docs.microsoft.com/azure/log-analytics/log-analytics-windows-agents), to a custom Web app written on Python running on Amazon Web Services, using the [HTTP DataCollector API](https://docs.microsoft.com/azure/log-analytics/log-analytics-data-collector-api). If you think about it, this actually covers any kind of hardware/OS monitoring in an enterprise and any software service in one solution. You could trace a problem originating in your OS and follow it across your different applications' logs, all in the same screen. Wouldn't that be _awesome_?

Log Analytics offers a powerful [querying engine](https://docs.microsoft.com/azure/log-analytics/log-analytics-log-searches) that indexes every attribute of your logs and lets you navigate through log records in a breeze.

![Azure Log Analytics queries](https://cdn.auth0.com/blog/azure-logs-analytics/oms6.png)

You can even [create custom dashboards](https://docs.microsoft.com/azure/log-analytics/log-analytics-dashboards) to summarize information.

![Azure Log Analytics custom dashboard](https://cdn.auth0.com/blog/azure-logs-analytics/oms9.png)

Creating alerts and webhooks that respond to log changes lets you take proactive actions and respond by triggering a custom flow of actions.

![Azure Log Analytics alerts and webhooks](https://cdn.auth0.com/blog/azure-logs-analytics/oms10.png)

Finally, the [pricing model](https://azure.microsoft.com/pricing/details/log-analytics/) is quite flexible. It even has a _free tier_ that holds your data for seven days with a 500MB daily collection limit. The price can scale as your volume of data increases following the cloud paradigm of _pay-as-you-go_.

## Integrating Auth0 with Log Analytics

As I mentioned in the previous section, Azure Log Analytics has an HTTP DataCollector API, which ingests logs using _JSON_. This widely used format lets you send logs from practically anywhere, including any piece of software you might be building (or have built).

Particularly, _Auth0_ handles your account's [logs](https://auth0.com/docs/logs) in the same format and exposes them through the [Management API](https://auth0.com/docs/api/management/v2#!/Logs/get_logs). These logs include the interactions your users have with your application, such as logins, and internal operations, such as grants or configuration changes.

To obtain and send these logs to Azure Log Analytics, we can use [extensions](https://auth0.com/docs/extensions) that run on a continuous schedule. In this article, we'll be using a [custom extension](https://github.com/ealsur/auth0-loganalytics-extension) that is already available to achieve it.

### Creating our Log Analytics service

We can _create_ a free service through the [Azure Portal](https://portal.azure.com/#create/Microsoft.LogAnalyticsOMS).

![Azure portal experience](https://cdn.auth0.com/blog/azure-logs-analytics/oms0.png)

Once it's provisioned, we'll be able to access the _OMS Portal_ through the newly created instance.

![Azure portal experience](https://cdn.auth0.com/blog/azure-logs-analytics/oms1.png)

In the OMS Portal, go to the _Settings charm_ on the top right menu and open the _Connected Sources_ section to obtain your _Workspace ID_ and _Workspace Key_.

![Setting charm](https://cdn.auth0.com/blog/azure-logs-analytics/oms2.png)

![Obtaining your Workspace credentials](https://cdn.auth0.com/blog/azure-logs-analytics/oms3.png)

### Configuring your Auth0 extension

In the [Auth0 Dashboard](https://manage.auth0.com/#/extensions), go to the _Extensions_ section and click on _CREATE EXTENSION_.

Enter the extension's Github repository: https://github.com/ealsur/auth0-loganalytics-extension

And provide the required information:

- LOGANALYTICS_WORKSPACEID: The Workspace ID you obtained in the OMS Portal.
- LOGANALYTICS_WORKSPACEKEY: The Workspace Key you obtained in the OMS Portal.
- LOGANALYTICS_NAMESPACE: A text identifier that will be used to group all log records coming from Auth0.
- LOGANALYTICS_APIVERSION: Optional parameter to specify the API version you want to use. It defaults to the latest.

Once those parameters are set, the extension will start shipping logs on the predefined schedule.

![Installed extensions](https://cdn.auth0.com/blog/azure-logs-analytics/oms4.png)

After a few minutes, you will be able to query and start obtaining information from your logs and create dashboards and alerts.

![Auth0 logs showing in Log Analytics](https://cdn.auth0.com/blog/azure-logs-analytics/oms7.png)

## Aside: Securing Applications with Auth0

Are you building a [B2C](https://auth0.com/b2c-customer-identity-management), [B2B](https://auth0.com/b2b-enterprise-identity-management), or [B2E](https://auth0.com/b2e-identity-management-for-employees) tool? Auth0, can help you focus on what matters the most to you, the special features of your product. [Auth0](https://auth0.com/) can improve your product's security with state-of-the-art features like [passwordless](https://auth0.com/passwordless), [breached password surveillance](https://auth0.com/breached-passwords), and [multifactor authentication](https://auth0.com/multifactor-authentication).

[We offer a generous **free tier**](https://auth0.com/pricing) so you can get started with modern authentication.

## Conclusion

Log Analytics is a very _flexible_ and _reliable_ service that can be used to store and query logs from not only your Auth0 account, but all your other applications, servers, and services, in _one place_, create awesome dashboards, and maintain alert flows that will let you visualize and maintain your entire company or product on check.
