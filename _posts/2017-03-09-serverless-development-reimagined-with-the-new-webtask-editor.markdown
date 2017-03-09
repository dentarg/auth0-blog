---
layout: post
title: "Serverless development reimagined with the new Webtask Editor"
description: We've just shipped a brand new editor for Webtask to go from 0 to code in seconds!
date: 2017-03-09 16:02
category: Technical Guide, Serverless, Webtask
author: 
  name: Javier Centurion
  mail: javier.centurion@auth0.com
  url: https://twitter.com/jcenturion86
  avatar: https://s.gravatar.com/avatar/a5878db74baa36ad0ae9cda759f9f2f8.jpg?s=60
design:
  bg_color: "#5F3237"
  image: "https://cdn.auth0.com/blog/webtask/logo.png"
tags:
- Serverless
- Webtask
- Webtask.io
- Function-as-a-Service
- faas
- Webtask-Editor
related:
- 2016-06-09-what-is-serverless
- 2015-10-07-extensibility-through-code-using-webtasks
---
## Serverless Development Reimagined with the New Webtask Editor

If you are building serverless applications, then you want to get from zero to code in seconds. We've just shipped a brand new editor for Webtask which makes this desire a reality!

The Webtask Editor is a rich online environment for creating, editing and testing your Webtasks. In addition, it allows you to manage secrets, configure github two-way sync, view realtime logs, and more. It makes serverless development a breeze and you _never have to leave the browser or install anything to use it_. And with our out-of-the-box support for over 1000+ [Node modules](https://webtask.io/docs/modules?utm_source=auth0.com&utm_medium=blog&utm_campaign=webtask_editor_launch), you can get a lot of work done.

Let’s take a quick walkthrough of the experience.

## Creating a New Webtask
With the new editor, getting started can't get any easier. Just head to [webtask.io/make](https://webtask.io/make?utm_source=auth0.com&utm_medium=blog&utm_campaign=webtask_editor_launch), log in with your preferred credentials, and you'll be on your way. 

![Webtask Editor](https://cdn.auth0.com/webtask/assets/images/screenshot.png)

From the popup dialog, you will see a few options:

- *Webtask*: this creates an empty webtask.
- *Cron*: this creates an empty scheduled webtask. 
- *Pick a template*: start coding based on selecting from a library of templates.
- *Import from GitHub*: import your code from a Github repo to a webtask.

### Webtask
Selecting "Webtask" will put you right into the editor where you can start authoring a new task.

![Create a Webtask](https://cdn.auth0.com/webtask/assets/images/new-webtask.gif)

### Cron
Cron tasks are great for executing a task on a schedule, such as checking a Twitter feed for mentions. When you create a new cron task, you will see two panes. The left pane is the scheduler where you specify the schedule for your task and the right pane is where you put the code for your task. 

![Create a Cron with Auth0 Webtask](https://cdn.auth0.com/webtask/assets/images/new-cron.gif)

For more info about cron, check [this document](https://webtask.io/docs/cron).

### Templates
Templates let you choose from a selection of starter code that you can use for building your tasks. We've included templates for integrating Webtask with common services like [Stripe](https://stripe.com), [Slack](https://slack.com), [Sendgrid](https://sendgrid.com), [Github](https://github.com), [Twilio](https://twilio.com), [Facebook](https://facebook.com), and many more. 

![Webtask Templates](https://cdn.auth0.com/webtask/assets/images/templates.gif)

### Importing from GitHub
If you have existing Webtasks in a repo, you can import them directly into Webtask by pointing to the repo.

## Editor Features
Now let's take a look at some of the awesome editor features.

### Runner and Logs
We've designed the new editor to streamline your development and allow you to iterate fast. To help with testing, the editor comes with an intergrated runner. In the runner you can set different HTTP methods, parameters, headers, etc. To help with debugging, we've added a realtime logs viewer that lets you view you tasks console output while it is executing.

![Webtask runner and logs](https://cdn.auth0.com/webtask/assets/images/runner.gif)

### Secrets Management
If your tasks are talking to other authenticated services, you don't want to store credentials in the code. You can define new secure secrets right in the editor, which are then accessible from the code via the `context` object.

![Secrets management](https://cdn.auth0.com/webtask/assets/images/secrets.gif)

### GitHub Integration
To take your experience up a notch, we've baked in Github integration support. This allows you to sync your webtask with a file in a Github repo. You can enable this to work bi-directionally, such that commits and pull requests to the repo result in the task automatically being deployed and any changes in the editor result in commits to the repo. You can also bind multiple tasks to different branches of the same repo, thus having dev, test, and prod versions of your tasks. It's super powerful!

![GitHub integration with Webtask](https://cdn.auth0.com/webtask/assets/images/github-integration.gif)

### Task Management
Press `CMD + P` or click on the list or on the "Webtasks" icon and you'll see a list of all your tasks. From the list, you can switch to a different task, open a task in a different window, or even delete tasks. You can type into the search bar to filter the list of displayed tasks.

![Webtask Quicksearch](https://cdn.auth0.com/webtask/assets/images/quicksearch.gif)

### Shortcuts
The new editor has tons of shortcuts for common actions within the editor as well as additional features like beautifying your code. You can see the list of shortcuts by clicking on the Shortcuts icon in the upper right corner.

![Webtask shortcuts](https://cdn.auth0.com/webtask/assets/images/shortcuts.gif)

### CLI Support
If you like using our [CLI](https://webtask.io/cli?utm_source=auth0.com&utm_medium=blog&utm_campaign=webtask_editor_launch), we've got you covered. You can go right from the shell to the editor with the `edit` command, i.e. `wt edit mytask`.

![Webtask CLI support](https://cdn.auth0.com/webtask/assets/images/from-cli.gif)

## Go Try It! 
The new Webtask Editor is an amazing tool for serverless development. It will let you instantly go from idea => code => running. Not only do you get a rich browser-based authoring experience, but you get a tool to secure, test, and debug your code. Go get started playing with the Webtask editor now: [webtask.io/make](https://webtask.io/make?utm_source=auth0.com&utm_medium=blog&utm_campaign=webtask_editor_launch). Also check out our documentation at [webtask.io/docs/editor](https://webtask.io/docs/editor?utm_source=auth0.com&utm_medium=blog&utm_campaign=webtask_editor_launch).
