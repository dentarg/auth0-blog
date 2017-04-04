---
layout: post
title: "Add SSO for Disqus on your WordPress Site with Auth0"
description: "Learn how utilize SSO for your Disqus WordPress plugin for your blog comments using Auth0 for authentication on the blog."
date: 2017-04-04 10:00
category: Technical Guide, Identity
author: 
  name: Carlos Mostek
  url: "https://twitter.com/mostekcm"
  mail: mostekcm@auth0.com
  avatar: "https://gravatar.com/avatar/8e5a8216a606127a787669d99de86ee2?s=200"
design: 
  bg_color: "#2e9fff"
  image: https://cdn.auth0.com/blog/auth0-disqus-wordpress-sso/logo.png
tags: 
  - Disqus
  - WordPress
  - SSO
  - Identity
related:
  - 2014-07-02-wordpress-single-sign-on
---

---

**TL;DR** [Disqus](https://disqus.com/) is a great tool for adding interactivity through conversation and comments to your blog.  Integrating it with your WordPress site is really simple. The downside to Disqus is that it requires another set of credentials before users can interact with your site. Today, we'll show how to eliminate the need for users to log in twice with Auth0 and Single Sign On (SSO) for a better user experience.

[WordPress](https://wordpress.org/) makes it easy to create blogs and other media sites. It is one of the leading CMS systems out there, and allows developers to create powerful websites that users can engage with. The default comment capability from WordPress can be greatly improved through the addition of the [Disqus WordPress Plugin](https://wordpress.org/plugins/disqus-comment-system/). Disqus provides a really nice interface for tracking and interacting with users through comments and reviews.  The one downfall to Disqus is that it requires users to have a separate login alongside their WordPress credentials. That’s where SSO comes in. With SSO enabled for your Disqus account, your WordPress user accounts will automatically integrate with Disqus, enabling users to comment without having to log into Disqus as well as WordPress.

---

## Configuring Auth0 for WordPress
There’s already plenty of good information for how to set up the WordPress plugin for Auth0.  Simply follow [these steps](https://auth0.com/docs/cms) and you'll have Auth0 integrated in no time.

Make sure you get to the point where the [Lock](https://www.google.com/url?q=https://auth0.com/lock&sa=D&ust=1487712650254000&usg=AFQjCNGgfaHnBtRJcZNxH4tVKkaV_vyeVA) widget is displayed when attempting to log in:

![Login Widget](https://cdn.auth0.com/blog/auth0-disqus-wordpress-sso/login-widget.png)

## Adding Disqus
To utilize Disqus, you need a Disqus account.  Signing up for an account will enable you to configure your applications to use Disqus. We’ll enable SSO for this primary account. Note, you can only configure one SSO domain, so if you have multiple sites, you may have to create a special account for each site.  I used my Auth0 email and set a password.  I then created this demo organization:

![Create New Disqus Site](https://cdn.auth0.com/blog/auth0-disqus-wordpress-sso/create-new-site.png)

With the settings updated, I clicked “Create Site”, then “Got it, let’s go”.  Finally, I chose “WordPress”, which got me to here:

![WordPress Plugin Install Instructions](https://cdn.auth0.com/blog/auth0-disqus-wordpress-sso/wordpress-plugin-install-instructions.png)

Let’s configure Disqus for our WordPress site. Switch over to WordPress and install the Disqus WordPress plugin, and once installed, activate it:

![Disqus Comment System Plugin](https://cdn.auth0.com/blog/auth0-disqus-wordpress-sso/disqus-comment-system-plugin.png)

Once activated, let’s finish setting up Disqus:

1. Go to the “Settings” for Disqus under “Comments->Disqus” in your admin section of WordPress.
1. Click Upgrade.
1. Enter your Disqus account credentials.
1. Choose the website that you configured earlier.

At this point you should be able to log into your site. Go to a blog post, and see the default comment section replaced with Disqus.  Notice that you have to log into Disqus to be able to comment (if you don’t have to log in, you were probably already logged into Disqus, try logging out using the dropdown).

![SSO Not Working](https://cdn.auth0.com/blog/auth0-disqus-wordpress-sso/sso-not-working.png)

## Request SSO Functionality
Disqus requires a special setting to allow you to enable SSO.  You will need to contact Disqus support to enable the functionality. You can do that here.

For “What are the details?”, here is a quick and easy message that you can just copy and paste:

```text
I have a WordPress site that I am integrating with Disqus and I would like to have SSO enabled for that site so users don’t also have to put in their Disqus password.

Thanks,
Carlos
```

![Request SSO Form](https://cdn.auth0.com/blog/auth0-disqus-wordpress-sso/request-sso.png)
￼
Unfortunately, you will have to wait 24-48 hours until they enable SSO functionality for your account. While you wait, they will send you some additional details on how to set up SSO. There is a lot of good reading here and I suggest you check it out. We will use the SSO on [WordPress example](https://help.disqus.com/customer/portal/articles/1148635-setting-up-sso-on-wordpress).

## Configuring SSO
Once you get the email that SSO has been enabled, you can continue this tutorial. We’re only a few steps away from having SSO functionality up and running. Let’s get to it.

### Configure the SSO domain
Go to [the SSO configuration page](https://disqus.com/api/sso/):

![SSO Config](https://cdn.auth0.com/blog/auth0-disqus-wordpress-sso/sso-config.png)

Here we will configure our SSO application. The information will be dependent on how you set up your application. In my case:

Enter Name: Disqus SSO Demo
Slug: mostekcm-disqus-sso-demo

### Configure your application
Go to [the registration page](http://disqus.com/api/applications/register/):

![Application Registration](https://cdn.auth0.com/blog/auth0-disqus-wordpress-sso/application-config.png)

### Grab your API keys
On this page, copy your Secret and Public Keys:

![Disqus Keys](https://cdn.auth0.com/blog/auth0-disqus-wordpress-sso/disqus-keys.png)

### Configure WordPress
Back in WordPress, go to Comments->Disqus->Plugin Settings (far right tab).
Scroll down to the advanced section and paste the secret and public keys:

![WordPress Plugin SSO Config](https://cdn.auth0.com/blog/auth0-disqus-wordpress-sso/wordpress-plugin-sso-config.png)

NOTE: Ensure that “Anyone can register” is set to true in General->Settings.

## Give it a try!
Once you log into WordPress, you should now see that you are logged into Disqus as well when you go to enter a comment:

![SSO is Working](https://cdn.auth0.com/blog/auth0-disqus-wordpress-sso/sso-works.png)

That’s it! You now have SSO functionality for your WordPress sites. Users signing up and logging in will no longer be required to enter a second set of credentials to leave comments on your site.

## Conclusion
Today we saw how you can easily improve the user experience on your WordPress website with Disqus, Auth0, and Single Sign On (SSO). Lowering the barrier to entry for your users is always a plus, and not forcing them to enter another set of credentials to interact with your site is a big win here. If you are running WordPress applications and using Disqus for comments, Auth0 can save time implementing SSO. Give it a try today.
