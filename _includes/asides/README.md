# Auth0 Asides

Auth0 Aside includes may be used when:

* it is illogical to integrate Auth0 into the tutorial's main content
* tutorial has no application sample (is conceptual or is a technical announcement)
* business article doesn't require a tutorial aside, but does need information on Auth0 (in this case, use the [about-auth0.markdown](https://github.com/auth0/blog/blob/master/_includes/asides/about-auth0.markdown) aside)

> ⚠ **IMPORTANT:** It is _strongly preferred_ that Auth0 be integrated into the main content of your post, or that Asides be specifically tailored to the app sample used in the tutorial. These generic Aside includes should be used _sparingly_.

## How to Use Asides in Posts

To include an Auth0 Aside in your post markdown, use the following syntax:

<pre>
{% include asides/{technology}.markdown %}
</pre>

## Technical Aside Requirements

Technical Auth0 Asides **must**:

* have instructions on how to set up an Auth0 application
* authenticate the app using universal login page
* have a supporting sample repo at [auth0-blog](https://github.com/auth0-blog)

Technical Auth0 Asides **should**:

* have one image, [such as the one here](https://cdn2.auth0.com/blog/angular-aside/angular-aside-login.jpg)
* show authentication of an API as well as an Application, if reasonable
* have links to supporting documentation or articles where users can find more information on Auth0 and how it works

## Maintenance

If you are the author of a generic Aside, you must **make sure** you keep the content and the supporting sample repo up-to-date.

## Author List (for contact)

When you create a new Aside, add a link to it here along with author's name so all writers know who to contact in case they need to use your Aside and have questions.

### Non-Technical Aside

* [about-auth0.markdown](https://github.com/auth0/blog/blob/master/_includes/asides/about-auth0.markdown) - Jeana

### Market Basket Links Aside (semi-technical, but no code)

* [market-basket-links-about.markdown](https://github.com/auth0/blog/blob/master/_includes/asides/market-basket-links-about.markdown) - Bruno

### Technical Asides

* [angular.markdown](https://github.com/auth0/blog/blob/master/_includes/asides/angular.markdown) - Kim
* [javascript-at-auth0.markdown](https://github.com/auth0/blog/blob/master/_includes/asides/javascript-at-auth0.markdown) - Bruno & Sebastian
* [python.markdown](https://github.com/auth0/blog/blob/master/_includes/asides/python.markdown) - Bruno
* [go.markdown](https://github.com/auth0/blog/blob/master/_includes/asides/go.markdown) - Prosper
* [php.markdown](https://github.com/auth0/blog/blob/master/_includes/asides/php.markdown) - Prosper
* [ruby.markdown](https://github.com/auth0/blog/blob/master/_includes/asides/ruby.markdown) - Prosper
* [react.markdown](https://github.com/auth0/blog/blob/master/_includes/asides/react.markdown) - Bruno
* [vue.markdown](https://github.com/auth0/blog/blob/master/_includes/asides/vue.markdown) - Prosper
* [spring-boot.markdown](https://github.com/auth0/blog/blob/master/_includes/asides/spring-boot.markdown) - Bruno
