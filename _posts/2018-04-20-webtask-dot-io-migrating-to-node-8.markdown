---
layout: post_extend
title: Webtask.io Migrating to Node 8
description: "Webtask.io is migrating to Node 8. Find out how that impacts your projects and how to prepare."
longdescription: "Webtask.io is migrating to Node 8. Find out how that impacts your projects and how to prepare. Migration tools are available directly in the editor and wt-cli."
date: 2018-04-20 12:00
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
  image: https://cdn.auth0.com/website/blog/extend/webtask-io-migrating-to-node-8/logo-webstask.io.png
tags:
- webtasks
- slack
- node 8
related:
- 2018-04-18-slash-webtasks-migrating-to-node-8
- 2016-09-14-build-a-serverless-slack-bot-with-webtask
- 2016-06-28-building-serverless-apps-with-webtask
---

**TL;DR:** Webtask.io is migrating to Node 8 on **May 15, 2018**! Learn how to easily migrate your projects with our new tools.

---

Today we've shipped Node 8 support for [Webtask.io](https://webtask.io)! Webtask.io is our free serverless sandbox that allows you to build applications without thinking about infrastructure. Over the last five years, Webtask.io has become very popular due to its ease of use and focus on quick HTTP response times. To date, 20,000+ developers have built their project using Webtask.io.

Luckily, we have also released some new tools to help make the migration process a snap. I will briefly describe them in this post and point you to other sources of detailed information.

## Why Node 8

Webtasks have been happily running on Node 4 for years. But Node 4 reaches it's end of life on April 30th, 2018 and will no longer be maintained or supported. The jump to Node 8 introduces a whole host of performance improvements and new features from both [Node 6](https://nodesource.com/blog/the-10-key-features-in-node-js-v6-lts-boron-after-you-upgrade) and [Node 8](https://nodesource.com/blog/five-fantastic-features-shipping-with-node-js-8-lts-carbon/).

- Full ES6 support
- Async/Await support
- Access to even more NPM modules

## Webtask.io Migration Tools

The next time users log in to [Webtask.io/make](https://webtask.io/make), they will be presented with a warning about the impending end of life of Node 4. We have added a **Switch to Node 8** button to the main menu that will begin the migration process. Clicking the button configures the editor to interact with the Node 8 environment.

- Navigate to [Webtask.io/make](https://webtask.io/make)
- Click the **Switch to Node 8** button

[![Import Node 4 Webtasks](https://cdn.auth0.com/website/blog/extend/webtask-io-migrating-to-node-8/node-8-import.png)](https://cdn.auth0.com/website/blog/extend/webtask-io-migrating-to-node-8/node-8-import.png)

The editor will switch to the Node 8 environment and the **Import From Node 4** dialog will be displayed. The import tool allows you to select a set of webtasks and both simulate and execute the import process that copies your webtask code, secrets, data and CRON schedules to the Node 8 environment.

**Note:** None of the actions available in the import tool are destructive. Your Node 4 webtasks will be left intact until you choose to complete the migration by clicking the **Permanently switch to Node 8** button. Completing the migration will cause all webtasks on the Node 4 environment to be permanently deleted.

For detailed instructions on the migration process, please review the [Webtask.io Migration Guide](https://github.com/auth0/wt-cli/wiki/Node8-webtask.io).


## WT-CLI Migration Tools.

After updating to the latest version of the wt-cli, any command a user issues using a Node 4 based profile will produce a warning about the impending end of life for Node 4. We have added a whole set of migration commands that will perform the migration process.

Starting the migration process with the CLI is easy:

- Update to the latest version of the CLI by executing `npm update -g wt-cli`
- Ensure you have been updated to  wt-cli@9.3 or later by executing `wt -v`
- Run the migration dry run by executing `wt profile migrate`

[![CLI Migrate Node 4 Webtasks](https://cdn.auth0.com/website/blog/extend/webtask-io-migrating-to-node-8/node-8-cli-migrate.png)](https://cdn.auth0.com/website/blog/extend/webtask-io-migrating-to-node-8/node-8-cli-migrate.png)

The wt-cli will run the dry run simulation and display the results for all webtasks in the Node 4 environment. Execute `wt profile migrate --yes` to perform the migration. The wt-cli will copy your webtask code, secrets, data and CRON schedules to the Node 8 environment.

**Note:** None of the migrate commands are destructive. Your Node 4 webtasks will be left intact until you choose to complete the migration by executing `wt init --finalize`. Completing the migration will cause all webtasks on the Node 4 environment to be permanently deleted.

For detailed instructions on the migration process, please review the [wt-cli Migration Guide](https://github.com/auth0/wt-cli/wiki/Node8---wt-cli).

## Node 4 Webtasks End of Life

On **May 15, 2018**, the Node 4 environment will be decommissioned. If you do nothing before this date, we will automatically migrate all your webtasks to Node 8. To avoid the possibility of breaking changes, we strongly recommend that you explicitly migrate and test your webtasks in Node 8 before that date.

## Enjoy Node 8!

This release represents months of work and testing by our team. We are excited to see what you build with Node 8 on Webtask.io. If you have any questions, you can find us on [webtask-chat.slack.com](https://webtask-chat.slack.com) (you can [join here](https://skynet.run.webtask.io/webtask-signup)).
