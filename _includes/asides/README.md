# Auth0 Asides

Auth0 Aside includes may be used when:

* it is illogical to integrate Auth0 into the tutorial's main content
* tutorial has no application sample (is conceptual or is a technical announcement)

> ⚠ **IMPORTANT:** It is _strongly preferred_ that Auth0 be integrated into the main content of your post, or that Asides be specifically tailored to the app sample used in the tutorial. These generic Aside includes should be used _sparingly_.

## How to Use Asides in Posts

To include an Auth0 Aside in your post markdown, use the following syntax:

```
{% include asides/{technology}.markdown %}
```

## Requirements

Auth0 Asides **must**:

* have instructions on how to set up an Auth0 Client
* authenticate the app using centralized login
* have a supporting sample repo at [auth0-blog](https://github.com/auth0-blog)

Auth0 Asides **should**: 

* have one image, [such as the one here](https://cdn2.auth0.com/blog/angular-aside/angular-aside-login.jpg)
* show authentication of an API as well as a Client, if reasonable
* have links to supporting documentation or articles where users can find more information on Auth0 and how it works

## Maintenance

If you are the author of a generic Aside, you must **make sure** you keep the content and the supporting sample repo up-to-date.

## Author List (for contact)

When you create a new Aside, add a link to it here along with author's name so all writers know who to contact in case they need to use your Aside and have questions.

* [angular.markdown](https://github.com/auth0/blog/blob/master/_includes/asides/angular.markdown) - Kim