---
layout: post_extend
title: Slash Webtasks Migrating to Node 8
description: "Slash Webtasks is moving to Node 8. See how to migrate your commands to ensure they keep running as expected."
longdescription: "A LONG DESCRIPTION OF THE POST BETWEEN 230 AND 320 CHARACTERS"
date: 2018-04-18 12:00
category: Technical, Webtasks
press_release: false
is_non-tech: false
author:
  name: "Bobby Johnson"
  url: "https://twitter.com/NotMyself"
  mail: "bobby.johnson@auth0.com"
  avatar: "https://cdn.auth0.com/website/blog/profiles/bobbyjohnson.png"
design:
  bg_color: "#3445DC"
  image: https://cdn.auth0.com/blog/slash-webtask-all-your-chatops-are-belong-to-you/logo-webtask-slack.png
tags:
- webtasks
- slack
- node 8
related:
- 2016-10-19-slash-webtasks-all-your-chatops-belong-to-you
- 2016-09-14-build-a-serverless-slack-bot-with-webtask
- 2016-06-28-building-serverless-apps-with-webtask
---

Back in October of 2016 we [introduced Slash Webtasks](https://auth0.com/blog/slash-webtasks-all-your-chatops-belong-to-you/), our powerful ChatOps app for Slack. Slash Webtasks is an amazingly simple way to author custom Slack commands using Webtasks right from within Slack. The app was so popular that over 1,000,000 teams have installed it and authored over 5,000,000 Webtasks that can be called directly using the simiple `/wt task_name` interface.

The underlying Webtask technology that Slash Webtasks run on is based on Node v4.9.1. The Node.js Foundation has updated their [release schedule](https://github.com/nodejs/Release#release-schedule) to show that the v4.x line is going to reach it's end of life on April 30th, 2018. That means there will be no more releases including security patches or bug fixes for the v4.x line.

With the end of life in mind, the team responsible for the Webtasks technology has been working to update the platform to a Active Long Term Support version of Node.js. Today, we are happy to announce that Slash Webtasks is the first product to be migrated to Node 8.

All newly created Slash Webtasks will be created in the new Node 8 environment. Teams can immediatly start taking advantage of new features and modules that rely on Node 8.

On April 30th, 2018 we will automatically migrate all Slash Webtasks to the new Node 8 environment. There are some actions that you can take to proactively migrate and test your commands. The manual migration process is simple and this post will walk you through all you need to know.

## Detecting Webtasks to Migrate

Starting now every time a Slash Webtask command is executed on the legacy Node 4 environment, the system will display a warning message about the pending Node 4 end of life and instructions on how to migrate the task to the new Node 8 environment.

The webtask will continue to execute normally, the warning is to allow your team time to migrate your tasks to the new environment.

[![Execution Warning](https://cdn.auth0.com/website/blog/extend/slash-webtasks-migrating-to-node-8/slash-webtasks-execute-migrate.png)](https://cdn.auth0.com/website/blog/extend/slash-webtasks-migrating-to-node-8/slash-webtasks-execute-migrate.png)

In this example, I have executed a StackOverflow search inside Slack. The warning message is displayed along with steps to migrate. The search results are displayed below the warning.

To see a list of all webtasks your team has created in Slack, use the `/wt ls` command. A list of all webtasks will be displayed. Webtasks that need to be migrated will have a **4 emoji** next to it.

[![List Warning Display](https://cdn.auth0.com/website/blog/extend/slash-webtasks-migrating-to-node-8/slash-webtasks-list-migrate.png)](https://cdn.auth0.com/website/blog/extend/slash-webtasks-migrating-to-node-8/slash-webtasks-list-migrate.png)

In this example, the **eq** and **meetup** tasks have be successfully migrated, but the **stackoverflow** task is still executing on Node 4.

## Migrating a Webtask

To migrate a task to Node 8, all you need to do is execute the command `/wt node8 {name}`. This will copy the webtask and all of it's associated data to the new Node 8 environment leaving the Node 4 version intact. 

**Note:** The Node 4 version can be executed using `/wt {name}` and the new Node 8 version with `/wt node8 {name}`.

[![Migrate a Task](https://cdn.auth0.com/website/blog/extend/slash-webtasks-migrating-to-node-8/slash-webtasks-migrate-task.png)](https://cdn.auth0.com/website/blog/extend/slash-webtasks-migrating-to-node-8/slash-webtasks-migrate-task.png)

In this example, the **stackoverflow** task has been successfully migrated. The task is immediately executed in the new environment after migration. If it succeeds normally, you can jump to the promition process to make the Node 8 version the default.

## Testing a Webtask

In the event that a webtask fails after being migrated to Node 8, it is fairly simple to troubleshoot and make adjustments. Use the command `/wt node8 edit {name}` to get a link to the webtask that opens in the editor on the Node 8 environment. You can now use all the tools available in the editor to troubleshoot the cause of the error.

See [Troubleshooting Webtasks: Using the Editor](https://auth0.com/blog/troubleshooting-webtasks-using-the-editor/) for detailed instructions.

[![Open Node 8 Editor](https://cdn.auth0.com/website/blog/extend/slash-webtasks-migrating-to-node-8/slash-webtasks-edit-node8.png)](https://cdn.auth0.com/website/blog/extend/slash-webtasks-migrating-to-node-8/slash-webtasks-edit-node8.png)

Once edited, you can run the webtask again using the command `/wt node8 {name}` to verify the issue is resolved.

**Note:** The most common issues encounted while migrating to the Node 8 environment are implicit node module dependencies. 

Some older Node 4 based webtasks use node modules that were preloaded to the execution environment's images. The Node 8 environment may not have these modules available. Simply add an explicit referrence to any needed modules using the **NPM Modules** panel located in the **Wrench** menu.



## Promoting a Webtask

Once you are satisfied that your webtask executes as expected in the Node 8 environment, you can use the command `/wt node8 promote {name}` to make the Node 8 version the default. This means that executing `/wt {name}` will now execute the Node 8 version of the webtask. The Node 4 version will no longer be avaiable and will be removed completely once the migration is complete.

[![Promote Node 8 Webtask](https://cdn.auth0.com/website/blog/extend/slash-webtasks-migrating-to-node-8/slash-webtasks-promote-node8.png)](https://cdn.auth0.com/website/blog/extend/slash-webtasks-migrating-to-node-8/slash-webtasks-promote-node8.png)

It is that simple! Now repeat the process for each of your Node 4 based Webtasks and you will no longer have to worry about the April 30th end of life of Node 4.

## What About Webtask.io

Our free Serverless platform [Webtask.io](https://webtask.io/) also currently runs on Node 4. Migration to Node 8 is next on our list and is coming soon. Keep an eye on this blog for details.

## Summary

Migrating Slash Webtasks to Node 8 opens up a huge set of new features and capibilites. The process is fairly simple and painless. On April 30th, the Webtasks team will migrate all remaining Node 4 Webtasks to the new Node 8 envoronment.

If you encounter any issues migrating your Webtasks, please do not hesitate to contact us. You can send a support ticket or join us in our Webtask User Slack.
