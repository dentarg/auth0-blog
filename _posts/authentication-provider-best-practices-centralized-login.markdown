---
layout: post
title: "Authentication Provider Best Practices: Centralized Login"
description: "Learn why centralized login is the most secure and flexible strategy when authenticating with a provider."
date: 2017-10-30 8:30
category: Technical guide, Centralized login, Angular
banner:
  text: "Auth0 makes it easy to add authentication to your application."
author:
  name: "Kim Maida"
  url: "https://twitter.com/KimMaida"
  mail: "kim.maida@auth0.com"
  avatar: "https://secure.gravatar.com/avatar/a208cda2b3b21dc8d7896507f5ff60fc"
design:
  image: https://cdn.auth0.com/blog/...
  bg_color: "#"
tags:
- login
- authentication
- best-practices
- security
- centralized-login
- angular
- mean
- node
- passwordless
related:
- 2017-10-19-oauth-2-best-practices-for-native-apps
---

**TL;DR:** Centralized login is the best practice strategy for authenticating with a provider. Learn why centralized login is the most secure and flexible approach. You can explore an authenticated MEAN stack application with Auth0 centralized login and passwordless at the [mean-messageboard GitHub repo here](https://www.github.com/auth0-blog/mean-messageboard).

---

## Introduction

High standards of security and ease of use have been set for modern authentication platforms and APIs. Users expect seamless logins that work across apps and entities without requiring them to log in over and over on the same device. Companies and developers expect robust security for their data and top-notch protection for their customers, preferably without incurring intensive implementation or maintenance overhead.

[Auth0](https://auth0.com)'s Identity and Access Management (IAM) platform strives to satisfy these needs. In doing so, we'll cover why using **centralized login** to authenticate your users is the most secure and easy-to-use approach for both developers and users.

### What is Centralized Login?

**Centralized login** refers to a [method of login hosted by the authentication provider](https://auth0.com/docs/hosted-pages/login) for your app or site. A link or button in your app triggers an authentication request and users are then presented with a login experience provided by the authentication provider. Because authentication is taking place on the same domain as the login, credentials are not sent across origins. Centralized login is the most _secure_ way to authenticate users, as well as the most _flexible_. We'll cover <a href="#why-use-centralized-login" target="_self">how and why</a> in much more detail below.

### What is Embedded Login?

**Embedded login** refers to a method of authentication wherein credentials are entered via an experience that is _embedded_ on a web app's domain or in a WebView (in the case of native apps). Credentials are then sent to the authentication provider for login. In a web app, this is a _cross-origin_ request. Embedded logins present a range of potential security and implementation challenges that cause issues for developers and users; as a matter of fact, [Google no longer supports an embedded approach when implementing OAuth](https://developers.googleblog.com/2016/08/modernizing-oauth-interactions-in-native-apps.html).

## A Tale of Two Companies

Let's begin with two hypothetical timelines from the perspective of tech teams at companies with imaginary products. These examples can help us visualize and relate to the challenges presented when implementing authentication in a way that doesn't afford enough flexibility.

### Company A

The engineering team at our first make-believe company (let's call them Company A) has produced the following timeline of sentiments:

* **Year 0**: We're building an online video streaming service. Login is performed using an embedded username and password form on the homepage.
* **Year 1**: We're doing great! People love our service. We're now developing an API so that third-party tools can upload videos to the service.
* **Year 2**: Due to high demand, we're building native mobile apps for Android and iOS. Users need to sign in every time they open the app.
* **Year 3**: We've been acquired by Google! However, our proprietary authentication does _not_ integrate easily with other systems. It's become a nightmare to overhaul authentication for our site, mobile apps, and APIs! 😩

### Company B

Now let's consider a second make-believe company called Company B. Their engineering team's timeline looks like this:

* **Year 0**: We're building an online photo storage and sharing service. Login is centralized and implemented with OAuth 2.0 and Google as a social Identity Provider (IdP).
* **Year 1**: We're doing great! People love our service. We're now developing an API so that third-party tools can upload photos to the service. API security and third-party authentication have been easy with OAuth.
* **Year 2**: Due to high demand, we're building native mobile apps for Android and iOS. We avoided authenticating our mobile apps in embedded WebView. This way, our users won't have to sign in again if they're already authenticated on their phone with another app that uses Google OAuth.
* **Year 3**: We've been acquired by Google! Integration was fast and easy! 🎉

These scenarios are simplified, but they still demonstrate a few of the advantages of starting with centralized login and [OAuth protocols](https://tools.ietf.org/html/draft-ietf-oauth-native-apps-12) from the beginning. Doing so helps you future-proof your applications, making it easy to grow and integrate with other systems.

## <span id="why-use-centralized-login"></span>Why Centralized Login is Best Practice

Centralized login has many advantages over an embedded login approach, including better security, improved Single Sign-On, simpler maintainability, native app implementation, and more. Let's explore these in more detail.

![Auth0 centralized login page](https://cdn.auth0.com/blog/resources/auth0-centralized-login.jpg)

{% include tweet_quote.html quote_text="Centralized login provides security, SSO, maintainability, best practice native app implementation, and more." %}

### Security

Centralized login is more secure than embedded login. Authentication takes place over the same domain, eliminating cross-origin requests. Cross-origin authentication is inherently more dangerous. Collecting user credentials in an application served from one origin and then sending them to another origin can present certain security vulnerabilities. [Phishing attacks](https://auth0.com/blog/all-you-need-to-know-about-the-google-docs-phishing-attack/) are more likely, as are [man-in-the-middle attacks](https://auth0.com/docs/security/common-threats#man-in-the-middle-mitm-attacks). Centralized login does not send information between origins, thereby negating cross-origin concerns.

Embedded user agents are unsafe for third parties, including the authorization server itself. If an embedded login is used, the app has access to both the authorization grant and the user's authentication credentials. As a consequence, this data is left vulnerable to recording or malicious use.

### Single Sign-On

Centralized login orchestrates [single sign-on](https://auth0.com/docs/sso/current) (SSO) between multiple apps while providing cookies from the same origin. Once a user has logged in using a centralized login, a cookie is created and stored. Any future calls to the authentication provider's authorization endpoint will then check the cookie. If the user has already signed on, the login page will not be shown again and the user will be logged in via SSO. On the other hand, embedded user agents don't share authentication state, meaning that they cannot be used for SSO.

### Easier to Implement and Maintain

Centralized login is easier to implement as well as maintain for app developers. Cross-origin authentication is inherently more dangerous, but centralized login mitigates this risk entirely. A centralized login page is already fully implemented, negating the need for the developer to build out the login UI if a custom UI is not required. The authorization server providing the centralized login page can also ensure a consistent and secure experience across all apps that utilize it.

### Best Practice on Native Mobile

The [OAuth 2.0 Best Current Practice for Native Apps RFC](https://www.rfc-editor.org/rfc/rfc8252.txt) requires that _only_ external user agents, such as centralized login, should be used for authenticating with OAuth 2.0 in native mobile applications. This is considered best practice for reasons cited above, including security and single sign-on. You can [read more about the OAuth 2.0 BCP for Native Apps here](https://auth0.com/blog/oauth-2-best-practices-for-native-apps/).

### User Experience

Centralized login has clear benefits for security and maintainability. It also provides a comfortable and consistent user experience that confers the benefits of SSO. With Auth0, the [centralized login](https://auth0.com/docs/hosted-pages/login) page is a [fully customizable UI](https://auth0.com/docs/hosted-pages/login#3-customization). In addition, Auth0's [CNAME](https://en.wikipedia.org/wiki/CNAME_record) functionality to persist the same domain across the centralized login page and the app is scheduled to launch before the end of 2017. Modern users are very familiar with being redirected to an authorization provider's login page to authenticate (e.g., Google or Facebook OAuth), in turn gaining the benefits of single sign-on and not being required to repeatedly log into other apps on the same device as long as they are using the same authentication provider.

## Aside: Centralized Login and Passwordless in a MEAN App with Auth0

Let's implement Auth0 centralized login and passwordless with a MEAN stack application that has been prepared for integration. This is a real-world message board application.

![Auth0 centralized login with email passwordless](https://cdn.auth0.com/blog/centralized-login/auth0_login_passwordless-email.jpg)

### Dependencies

First, make sure you have the following dependencies installed and set up according to their provided documentation:

* [Node.js with npm](https://nodejs.org)
* [Angular CLI](https://cli.angular.io)

You will also need to sign up for the following free accounts:

* [mLab](https://mlab.com/signup)
* [Auth0](https://auth0.com/signup)

To acquire and set up the MEAN app, you will need to clone the [mean-messageboard repository](https://github.com/auth0-blog/mean-messageboard) and install it by running `npm install` locally from its root directory.

### Create an mLab Mongo Database

Once you have created a [free mLab account](https://mlab.com/signup), create a new database with mLab.

1. Log into [mLab](https://mlab.com). In **MongoDB Deployments**, click the "Create new" button.
2. Select your desired Cloud Provider and Region.
3. Change the Plan to **Single-node** and select the free "Sandbox" option.
4. Scroll down and give your database a name, like `mean`.
5. Click the "Create new MongoDB deployment" button.

![mLab new MongoDB deployment](https://cdn.auth0.com/blog/mean-series/mLab-new-deployment.png)

The new database can now be selected from our deployments. It should look something like this:

![mLab MongoDB database](https://cdn.auth0.com/blog/mean-series/mLab-db.png)

We now need to add a user in order to connect to our database. Click on the database to edit it.

1. Select the **Users** tab and click the "Add database user" button.
2. Enter a database username and password in the modal. These credentials will be needed to read and write to the database with Node.
3. Make a note of the database's MongoDB URI. This should be in the format: `mongodb://<dbuser>:<dbpassword>@<ds111111>.mlab.com:<port>/<dbname>`.

![mLab MongoDB URI](https://cdn.auth0.com/blog/mean-series/mLab-uri.png)

Now we're ready to use our MongoDB database.

> **Note:** If you prefer, you can host MongoDB locally. [Follow these instructions](https://docs.mongodb.com/manual/installation/) to install MongoDB on your operating system.

### Set Up an Auth0 Client App

1. Go to your [**Auth0 Dashboard**](https://manage.auth0.com/#/) and click the "[Create a New Client](https://manage.auth0.com/#/clients/create)" button.
2. Give your new app a **name**, select **Single Page Web Applications**, then click the "Create" button.
3. In the **Settings** for your new Auth0 Client app, add `http://localhost:4200/callback, http://localhost:8085/callback` to the **Allowed Callback URLs**.
4. Add `http://localhost:4200, http://localhost:8085` to the **Allowed Web Origins**.
5. Add `http://localhost:4200, http://localhost:8085` to the **Allowed Origins (CORS)**.
6. Make sure that **Use Auth0 instead of the IdP to do Single Sign-On** is enabled.
7. At the bottom of the **Settings** section, click the "Show Advanced Settings" link. Choose the **OAuth** tab and verify that the **JsonWebToken Signature Algorithm** is set to `RS256`.
8. Click the "Save Changes" button.

### Set Up Auth0 Passwordless Login

1. Go to **Connections** -> [**Passwordless**](https://manage.auth0.com/#/connections/passwordless) and enable the **Email** toggle.
2. In the Email passwordless settings screen, add `{ "scope": "openid profile" }` to **Authentication Parameters**.
3. Click the "Save" button.
4. Click the **Apps** tab at the top of the window and find your newly-created Client. Toggle its switch on to enable it.
5. Click the "Save" button.
6. Go to [**Hosted Pages**](https://manage.auth0.com/#/login_page). Toggle on the **Customize Login Page** option. This will enable you to modify the provided template.
7. Using the **Default Templates** dropdown, switch to **Lock (Passwordless)**.
8. Click the "Save" button.

### Set Up an API in Auth0

Go to [**APIs**](https://manage.auth0.com/#/apis) in your Auth0 Dashboard and click on the "Create API" button. Enter a name for the API. Set the **Identifier** to `http://localhost:8085/api/`. The **Signing Algorithm** should be `RS256`.

### Add Database and Auth0 Configuration to App

Now we'll add our MongoDB database and Auth0 Client information to our MEAN app. We can do so with the following simple steps, starting from the root of our message board project:

1. Open the `server/config.js.sample` file. Replace `[AUTH0_DOMAIN]` with your Auth0 domain and replace `[MONGODB_URI]` with your complete mLab MongoDB URI. Then remove `.sample` from the file name.
2. Open the `src/app/auth/auth0-variables.ts.sample` file. Replace `[AUTH0_CLIENT]` and `[AUTH0_DOMAIN]` with your Auth0 Client ID and domain. Then remove `.sample` from the file name.

### Authentication Service

The Angular app's `src/auth/auth.service.ts` file uses [auth0.js](https://auth0.com/docs/libraries/auth0js/v8) to implement the centralized login page. The code looks like this, with functionality detailed in the comments:

```typescript
...

@Injectable()
export class AuthService {
  // Create Auth0 web auth instance
  private _auth0 = new auth0.WebAuth({
    clientID: AUTH_CONFIG.CLIENT_ID,
    domain: AUTH_CONFIG.CLIENT_DOMAIN,
    responseType: 'token id_token',
    redirectUri: AUTH_CONFIG.REDIRECT,
    audience: AUTH_CONFIG.AUDIENCE,
    scope: AUTH_CONFIG.SCOPE
  });
  userProfile: any;
  // Create a stream of logged in status to communicate throughout app
  loggedIn: boolean;
  loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);
  // Subscribe to token expiration stream
  refreshSub: Subscription;
  authStatePending = false;
  authError: any;

  constructor(private router: Router) {
    // If authenticated, set local profile property,
    // update login status, schedule renewal.
    // If not authenticated but there are still items
    // in localStorage, log out.
    const lsProfile = localStorage.getItem('profile');

    if (this.tokenValid) {
      this.userProfile = JSON.parse(lsProfile);
      this.setLoggedIn(true);
      this.scheduleRenewal();
    } else if (!this.tokenValid && lsProfile) {
      this.logout();
    }
  }

  setLoggedIn(value: boolean) {
    // Update login status subject
    this.loggedIn$.next(value);
    this.loggedIn = value;
  }

  login(redirect?: string) {
    // Set redirect after login
    const _redirect = redirect ? redirect : this.router.url;
    localStorage.setItem('authRedirect', _redirect);
    // Auth0 authorize request calls the centralized login page
    // User should then be prompted for their email and be
    // sent a passwordless code to enter in the login page
    this._auth0.authorize();
  }

  handleAuth() {
    this.authStatePending = window.location.hash ? true : false;
    // When user enters code at centralized login page, they
    // are redirected back to app; this method is called by
    // the root app component on load to parse the hash that
    // is returned from Auth0 centralized login.
    // When Auth0 hash parsed, execute _getProfile()
    this._auth0.parseHash(
      (err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          window.location.hash = '';
          this._getProfile(authResult);
        } else if (err) {
          this._clearRedirect();
          this.router.navigate(['/']);
          console.error(`Error authenticating: ${err.error}`);
          this.authStatePending = false;
          this.authError = {
            message: 'There was an error authenticating. Please try again.'
          };
        }
      }
    );
  }

  private _getProfile(authResult) {
    // Use access token to retrieve user's profile and set session
    this._auth0.client.userInfo(authResult.accessToken,
      (err, profile) => {
        if (profile) {
          this._setSession(authResult, profile);
          this._redirect();
        } else if (err) {
          console.warn(`Error retrieving profile: ${err.error}`);
        }
      }
    );
  }

  private _setSession(authResult, profile?) {
    // Set tokens and expiration in localStorage
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + Date.now());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    this.authError = undefined;
    // If initial login, set profile
    if (profile) {
      localStorage.setItem('profile', JSON.stringify(profile));
      this.userProfile = profile;
    }
    // Update login status in loggedIn$ stream
    this.setLoggedIn(true);
    this.authStatePending = false;
    // Schedule access token renewal
    this.scheduleRenewal();
  }

  private _redirect() {
    const redirect = localStorage.getItem('authRedirect');
    if (redirect && redirect.indexOf('#') > -1) {
      const redirectArr = redirect.split('#');
      const url = redirectArr[0];
      const fragment = redirectArr[1];
      this.router.navigate([url], { fragment: fragment });
    } else {
      this.router.navigate([redirect || '/']);
    }
  }

  private _clearRedirect() {
    // Remove redirect from localStorage
    localStorage.removeItem('authRedirect');
  }

  logout(noRedirect?: boolean) {
    // Ensure all auth items removed from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
    localStorage.removeItem('expires_at');
    this._clearRedirect();
    // Reset local properties, update loggedIn$ stream
    this.userProfile = undefined;
    this.setLoggedIn(false);
    this.authStatePending = false;
    // Unschedule access token renewal
    this.unscheduleRenewal();
    // Return to homepage
    if (noRedirect !== true) {
      this.router.navigate(['/']);
    }
  }

  get tokenValid(): boolean {
    // Check if current time is past access token's expiration
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return Date.now() < expiresAt;
  }

  renewToken() {
    // Acquire new tokens silently in an iFrame, causing no
    // disruption to the user's experience
    this._auth0.checkSession({},
      (err, authResult) => {
        if (authResult && authResult.accessToken) {
          this._setSession(authResult);
        } else if (err) {
          console.warn(`Could not renew token: ${err.errorDescription}`);
          // Log out without redirecting to clear auth data
          this.logout(true);
          // Log in again
          this.login();
        }
      }
    );
  }

  scheduleRenewal() {
    // If user isn't authenticated, do nothing
    if (!this.tokenValid) { return; }
    // Unsubscribe from previous expiration observable
    this.unscheduleRenewal();
    // Create and subscribe to expiration observable
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    const expiresIn$ = Observable.of(expiresAt).flatMap(
      expires => {
        const now = Date.now();
        // Use timer to track delay until expiration
        // to run the refresh at the proper time
        return Observable.timer(Math.max(1, expires - now));
      }
    );
    // Subscribe to expiresIn$ observable and renew token
    this.refreshSub = expiresIn$.subscribe(
      () => {
        this.renewToken();
        this.scheduleRenewal();
      }
    );
  }

  unscheduleRenewal() {
    if (this.refreshSub) {
      this.refreshSub.unsubscribe();
    }
  }

}
```

When the user clicks a "Log In" button in the app, the `login()` method is called. This sends an authentication request to our Auth0 centralized login page using our WebAuth instance (a constant named `_auth0` here) and the [auth0.js](https://github.com/auth0/auth0-js) `authorize()` method. Auth0, as the authentication provider, logs the user in and then redirects back to our app with the user's JSON Web Tokens and token expiration data in the browser URL hash. The app's `app.component.ts` class executes the authentication service's `handleAuth()` method to use the `parseHash()` method from auth0.js to extract the necessary data from the hash and utilize it in our app.

In addition, the `auth.service.ts` contains functionality to [silently renew tokens](https://auth0.com/docs/libraries/auth0js/v8#using-checksession-to-acquire-new-tokens) when they are about to expire. This ensures that the user does not unexpectedly lose access in the middle of a browser session.

### Try It Out

Try it out by running the following two commands from the project root:

```bash
$ ng serve
$ NODE_ENV=dev node server
```

You should now be able to run the app and authenticate. You should then also be able to post to the message board, sending your access token to the provided Node API.

We now have a real-world MEAN stack application with Auth0 centralized login and passwordless authentication! 

## Conclusion

Centralized login is the most secure and maintainable standards-based approach to logging in with an authentication provider. Unlike embedded login, it is safer from cross-origin attack vectors and poses no danger to the authorization server. Centralized login is [best current practice for native mobile apps](https://auth0.com/blog/oauth-2-best-practices-for-native-apps/), and OAuth providers like [Google no longer support embedded login strategies](https://developers.googleblog.com/2016/08/modernizing-oauth-interactions-in-native-apps.html).

{% include tweet_quote.html quote_text="Centralized login is safer from cross-origin attack vectors and poses no danger to the authorization server." %}

Auth0 provides a [secure, customizable centralized login strategy](https://auth0.com/docs/hosted-pages/login) that works with [social IdPs](https://auth0.com/docs/connections#social) (such as Google, Facebook, Twitter, etc.), [enterprise IdPs](https://auth0.com/docs/connections#enterprise) (such as Active Directory, ADFS, LDAP, etc.), custom [OAuth 2.0 integrations](https://auth0.com/docs/protocols/oauth2), [username/password databases](https://auth0.com/docs/connections#database-and-custom-connections), [passwordless authentication](https://auth0.com/docs/connections/passwordless) (with SMS, email, or TouchID), and more. You can [sign up for a free Auth0 account](https://auth0.com/signup) to try out these features and more to modernize your app's authentication and follow standards-based best practices.