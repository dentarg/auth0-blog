---
layout: post_extend
title: Slash Webtasks Migrating to Node 8
description: "Slash Webtasks is moving to Node 8. See how to migrate your commands to ensure they keep running as expected."
longdescription: "Slash Webtasks is moving to Node 8. See how to migrate your commands to ensure they keep running as expected."
date: 2018-04-18 12:00
category: Technical, Webtasks
press_release: false
is_non-tech: false
canonical_url: true
author:
  name: "Bobby Johnson"
  url: "https://twitter.com/NotMyself"
  mail: "bobby.johnson@auth0.com"
  avatar: "https://cdn.auth0.com/website/blog/profiles/bobbyjohnson.png"
design:
  bg_color: "#3445DC"
  image: https://cdn.auth0.com/website/blog/extend/slash-webtasks-migrating-to-node-8/slash-webtasks-node8-logo.png
tags:
- webtasks
- slack
- node 8
related:
- 2016-10-19-slash-webtasks-all-your-chatops-belong-to-you
- 2016-09-14-build-a-serverless-slack-bot-with-webtask
- 2016-06-28-building-serverless-apps-with-webtask
---

Today we've shipped Node 8 support for Slash Webtasks! Slash Webtasks is an amazingly simple way to author custom Slack commands using Webtasks right from within Slack. The app was so popular that over 1300 teams have installed it and authored over 2500 Webtasks that can be called directly using the simple `/wt task_name` interface.

All newly created Slash Webtasks will be created in the new Node 8 environment. Teams can immediately start taking advantage of new features including full ES6 support and async/await.

However, what about existing Slash Webtasks? There are some actions that you can take to migrate and test your commands proactively. The migration process is simple, and this post will walk you through all you need to know.

## Detecting Slash Webtasks to Migrate

Every time the Slash Webtask command is executed on the legacy Node 4 environment, the system will display a warning message with instructions on how to migrate the task to the new Node 8 environment.

The webtask will continue to execute normally. The warning is to allow your team time to migrate your tasks to the new environment.

[![Execution Warning](https://cdn.auth0.com/website/blog/extend/slash-webtasks-migrating-to-node-8/slash-webtasks-execute-migrate.png)](https://cdn.auth0.com/website/blog/extend/slash-webtasks-migrating-to-node-8/slash-webtasks-execute-migrate.png)

In this example, I have executed a StackOverflow search inside Slack. The warning message is displayed along with steps to migrate. The search results are displayed below the warning.

To see a list of all the Slash Webtasks your team has created, use the `/wt ls` command. The list will mark tasks that need to be migrated with a **4 emoji**.

[![List Warning Display](https://cdn.auth0.com/website/blog/extend/slash-webtasks-migrating-to-node-8/slash-webtasks-list-migrate.png)](https://cdn.auth0.com/website/blog/extend/slash-webtasks-migrating-to-node-8/slash-webtasks-list-migrate.png)

In this example, the **eq** and **meetup** tasks have been successfully migrated, but the **stackoverflow** task is still executing on Node 4.

## Migrating a Slash Webtask

To migrate a task to Node 8, you must have permission to edit the existing task. Execute the command `/wt node8 {name}`. This will copy the task and all of it's associated data to the new Node 8 environment leaving the Node 4 version intact. 

**Note:** The Node 4 version can be executed using `/wt {name}` and the new Node 8 version with `/wt node8 {name}`.

[![Migrate a Task](https://cdn.auth0.com/website/blog/extend/slash-webtasks-migrating-to-node-8/slash-webtasks-migrate-task.png)](https://cdn.auth0.com/website/blog/extend/slash-webtasks-migrating-to-node-8/slash-webtasks-migrate-task.png)

In this example, the **stackoverflow** task has been successfully migrated. The task is immediately executed in the new environment after migration. If it succeeds normally, you can jump to the promotion process to make the Node 8 version the default.

## Testing a Slash Webtask

In the event that a task fails after being migrated to Node 8, it is fairly simple to troubleshoot and make adjustments. Use the command `/wt node8 edit {name}` to get a link to the webtask that opens in the editor on the Node 8 environment. You can now use all the tools available in the editor to troubleshoot the cause of the error.

See [Troubleshooting Webtasks: Using the Editor](https://auth0.com/blog/troubleshooting-webtasks-using-the-editor/) for detailed instructions.

[![Open Node 8 Editor](https://cdn.auth0.com/website/blog/extend/slash-webtasks-migrating-to-node-8/slash-webtasks-edit-node8.png)](https://cdn.auth0.com/website/blog/extend/slash-webtasks-migrating-to-node-8/slash-webtasks-edit-node8.png)

Once edited, you can run the webtask again using the command `/wt node8 {name}` to verify the issue is resolved.

**Note:** The most common issues encountered while migrating to the Node 8 environment are implicit Node module dependencies. 

Some older Node 4 based webtasks use Node modules that were preloaded to the execution environment's images. The Node 8 environment may not have these modules available. Simply add an explicit reference to any needed modules using the **NPM Modules** panel located in the **Wrench** menu.



## Promoting a Slash Webtask

Once you are satisfied that your webtask executes as expected in the Node 8 environment, you can use the command `/wt node8 promote {name}` to make the Node 8 version the default. This means that executing `/wt {name}` will now execute the Node 8 version of the webtask. The Node 4 version will no longer be available and will be removed completely once the migration is complete.

[![Promote Node 8 Webtask](https://cdn.auth0.com/website/blog/extend/slash-webtasks-migrating-to-node-8/slash-webtasks-promote-node8.png)](https://cdn.auth0.com/website/blog/extend/slash-webtasks-migrating-to-node-8/slash-webtasks-promote-node8.png)

It is that simple! Now repeat the process for each of your Node 4 based Webtasks and you will no longer have to worry about the April 30th end of life of Node 4.

## Migration Deadline

On April 30th, Node 4 will officially reach it's end of life. On that date, all remaining Slash Webtasks executing in the Node 4 environment will be automatically migrated. There is a chance this will cause your tasks to fail. Please migrate and test your tasks before this date.

## What About Webtask.io

Our free serverless sandbox [Webtask.io](https://webtask.io/) also currently runs on Node 4. Migration to Node 8 is next on our list and is coming **very** soon. Keep an eye on this blog for details.

## Summary

Migrating Slash Webtasks to Node 8 opens up a huge set of new features and capabilities. The process is fairly simple and painless. Your team can begin migrating your existing tasks today.

If you encounter any issues migrating your Slash Webtasks, please do not hesitate to contact us. You can file a support ticket on [Webtask.io](https://webtask.io) or join us in our [Slack](https://skynet.run.webtask.io/webtask-signup).
