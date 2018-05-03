---
layout: post_extend
title: "Troubleshooting Webtasks: Using Debuggers"
description: "Learn how to troubleshoot webtasks from monitoring logs in the editor all the way to debugging locally using devtool and visual studio code."
longdescription: "The Webtasks technology that powers Auth0 Extend, Webtask.io and Auth0 Hooks is a very powerful system. Learn how to troubleshoot webtasks from monitoring logs in the editor all the way to debugging locally using devtool and visual studio code."
date: 2018-03-28 08:00
category: Extend, Techincal, Webtasks
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
  image: https://cdn.auth0.com/blog/troubleshooting-webtasks/logo.png
tags:
- extend
- webtasks
- debugging
related:
  - 2017-08-01-auth0-webtasks-the-quickest-of-all-quick-starts
  - 2018-03-14-troubleshooting-webtasks-using-the-editor
  - 2018-03-21-troubleshooting-webtasks-using-the-cli
---

**TL;DR:** In this series, we will learn how to troubleshoot webtasks from monitoring logs in the editor all the way to debugging locally using devtool and visual studio code.

The full list of posts in this series:

- [Troubleshooting Webtasks: Using the Editor](https://auth0.com/blog/troubleshooting-webtasks-using-the-editor/)
- [Troubleshooting Webtasks: Using the CLI](https://auth0.com/blog/troubleshooting-webtasks-using-the-cli/)
- [Troubleshooting Webtasks: Using Debuggers](https://auth0.com/blog/troubleshooting-webtasks-using-debuggers/)

This post covers how to get an IDE-like debugging experience using common tools, here are some shortcuts to help you locate the topics you are interested in quickly.

- <a href="#debugging-with-devtool" target="_self">Debugging locally with Devtool</a>
- <a href="#debugging-with-visual-studio-code" target="_self">Debugging locally with Visual Studio Code</a>

---


The Webtasks technology that powers [Auth0 Extend](https://auth0.com/extend/), [Webtask.io](https://webtask.io/) and [Auth0 Hooks](https://auth0.com/docs/hooks) is a very powerful system. It allows end users to provide the functionality they need by writing simple logic in JavaScript. That JavaScript is then securely sandboxed and executed with extremely low latency while protecting the security and performance of other customers and the technology itself.

Whether you are building a fun weekend project, ensuring your authorized users are members of a specific domain or offering your customers an easy way to customize your SaaS; the Webtasks technology allows you to accomplish your goals without placing the burden of hosting, monitoring or scaling on you or your users.

Even with a technology this powerful, you are going to run into issues at times. A service you depend on may go down. Or a bit of logic might not consider all the possible cases that can arise during execution.

When unexpected events happen, how do you go about troubleshooting the issues? In this series, I will show you the most common ways of troubleshooting a webtask. From simple test executions to full local debugging support, we will cover it all.

### Debugging a webtask locally

So far we have done quite a bit with logging, but there are times when nothing beats attaching a debugger and stepping through code while inspecting values and setting breakpoints. Now that we have a webtask running locally via the CLI, it is relatively simple to debug it. 

In addition to the `wt serve` command, there is the `wt debug` command. We will see two methods of debugging using the debug command that we can use on any platform.

#### <span id="debugging-with-devtool"></span>Debugging with Devtool

The most straightforward and quickest way to debug is using the standalone [Electron](https://electronjs.org/)-based debugger [Devtool](https://www.npmjs.com/package/devtool). Devtool is excellent because it can be installed right from NPM. Let's see how we can use it to debug the task.

- Execute the command `npm install -g devtool`
- Execute the command `wt debug -d=devtool task.js`

Devtool will pop up; we can drill down into the file explorer on the left to find our task.

- Click on the **Sources** tab.
- In the left-hand tree view, locate **task.js**.
- Click the **task.js** file.
- In the main editor view, set a breakpoint by clicking in the margin near line 19.

![Terminal Debug Devtool](https://cdn.auth0.com/website/blog/extend/troubleshooting-webtasks/terminal-debug-devtool.png)

Now that we have a breakpoint, we can test it out.

- Run the following command that is appropriate for your terminal

```bash
curl http://localhost:8080
```

```powershell
Invoke-RestMethod -Uri http://localhost:8080
```

![Terminal Debug Devtool Execute](https://cdn.auth0.com/website/blog/extend/troubleshooting-webtasks/terminal-debug-devtool-execute.png)

The debugger breaks on the breakpoint we set previously. Moreover, we can then step through debug, inspect variables and everything you would expect from a debugger!

Go stop the task from being served (`CTRL-C`) and Devtool automatically closes.


#### <span id="debugging-with-visual-studio-code"></span>Debugging with Visual Studio Code

If we are working on our webtask code locally, chances are we are using a text editor to do so. If your editor of choice happens to be [Visual Studio Code](https://code.visualstudio.com/), it is simple to wire up debugging directly in the editor.

Let's use Visual Studio Code to debug **task.js**.

- Execute the command `wt debug task.js`
- Open Visual Studio Code
- Open the folder where your task lives within Code
- Open **task.js** and add a breakpoint at line 19
- Press the **Debug** button
- Select **Add Configuration** via the Dropdown
- Select **Node.js: Attach**
- Ensure your `launch.json` looks like the example below

```javascript
{
    "version": "0.2.0",
    "configurations": [
    {
        "type": "node",
        "request": "attach",
        "name": "Attach",
        "port": 9229
    }
    ]
}
```
- Save the `launch.json` file
- In the Dropdown, select **Attach**
- Press the **Play** button

![Terminal Debug Code](https://cdn.auth0.com/website/blog/extend/troubleshooting-webtasks/terminal-debug-code.gif)

- Repeat the previous command from the terminal

We should see our breakpoint hit, and we can debug! Attaching is nice, but we are attaching to an already running node process in our terminal. It would be nice if Visual Studio Code would launch the process for us when we click to launch the debugger.

That is pretty easy to accomplish as well. Earlier, we created a `package.json` to reference our dependency on the **request** node module. Let's updated it to add a new run command.

- Open **package.json**
- Locate the **scripts** object
- Add the **debug** script as shown below
- Save the file

```javascript
{
  "name": "sample",
  "version": "1.0.0",
  "description": "",
  "main": "task.js",
  "scripts": {
    "debug": "wt debug task.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "request": "^2.83.0"
  }
}
```

**Note:** The new debug script executes the same command we were running in our terminal.

Now, we need to configure Visual Studio Code to run the NPM script and attach the debugger.

- Press the **Debug** button
- Select **Add Configuration** via the Dropdown
- Select **Node.js: Launch via NPM**
- Ensure your `launch.json` looks like the example below

```javascript
{
    "version": "0.2.0",
    "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch via NPM",
      "runtimeExecutable": "npm",
      "runtimeArgs": [
        "run-script",
        "debug"
      ],
      "port": 9229
    }
    ]
}
```
- Save the `launch.json` file
- In the Dropdown, select **Launch via NPM**
- Press the **Play** button

![Visual Studio Debug](https://cdn.auth0.com/website/blog/extend/troubleshooting-webtasks/visual-studio-code-debug.png)

We are now running and debugging entirely in Visual Studio Code. Notice that our console log statements are now being printed to the debug console view in Code.

# Summary

It was a long road, but we have now covered the ways to troubleshoot webtasks from a quick log logging in the editor all the way to full IDE like debugger support. In this post, we have covered the various techniques available to do some serious debugging of our Webtasks. 

These techniques work with all of the products using the Webtasks technology. Feel free to bookmark this post and reference it when you are working on your next project.