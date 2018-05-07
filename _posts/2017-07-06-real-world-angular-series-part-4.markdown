---
layout: post
title: "Real-World Angular Series - Part 4: Access Management, Admin, and Detail Pages"
description: "Build and deploy a real-world app with MongoDB, Express, Angular, and Node (MEAN): access management, display admin data, and detail pages."
date: 2017-07-06 8:30
category: Technical guide, Angular, Angular 4
banner:
  text: "Auth0 makes it easy to add authentication to your Angular application."
author:
  name: "Kim Maida"
  url: "https://twitter.com/KimMaida"
  mail: "kim.maida@auth0.com"
  avatar: "https://en.gravatar.com/userimage/20807150/4c9e5bd34750ec1dcedd71cb40b4a9ba.png"
design:
  image: https://cdn.auth0.com/blog/angular/logo3.png
  bg_color: "#012C6C"
tags:
- javascript
- angular
- node
- mongodb
- express
- mean
related:
- 2017-06-28-real-world-angular-series-part-1
- 2017-06-29-real-world-angular-series-part-2
- 2017-07-05-real-world-angular-series-part-3

---

<div class="alert alert-danger alert-icon">
  <i class="icon-budicon-487"></i>
  <strong>WARNING: This series of articles uses Angular 5 and RxJS 5.</strong> Please be aware that code changes are necessary to use Angular 6 and RxJS 6 with this tutorial. We are in the process of upgrading the series to latest versions. In the meantime, you can <a href="https://update.angular.io/">follow the update instructions here</a> for more information. Thank you for your patience!
</div>

**TL;DR:** This 8-part tutorial series covers building and deploying a full-stack JavaScript application from the ground up with hosted [MongoDB](https://www.mongodb.com/), [Express](https://expressjs.com/), [Angular (v2+)](https://angular.io), and [Node.js](https://nodejs.org) (MEAN stack). The completed code is available in the [mean-rsvp-auth0 GitHub repo](https://github.com/auth0-blog/mean-rsvp-auth0/) and a deployed sample app is available at [https://rsvp.kmaida.net](https://rsvp.kmaida.net). **Part 4 of the tutorial series covers access management with Angular, displaying admin data, and setting up detail pages with tabs.**

---

## Real-World Angular Series

You can view all sections of the tutorial series here:

1. [Real-World Angular Series - Part 1: MEAN Setup & Angular Architecture](https://auth0.com/blog/real-world-angular-series-part-1)
2. [Real-World Angular Series - Part 2: Authentication and Data Modeling](https://auth0.com/blog/real-world-angular-series-part-2)
3. [Real-World Angular Series - Part 3: Fetching and Displaying API Data](https://auth0.com/blog/real-world-angular-series-part-3)
4. [Real-World Angular Series - Part 4: Access Management, Admin, and Detail Pages](https://auth0.com/blog/real-world-angular-series-part-4) (you are here!)
5. [Real-World Angular Series - Part 5: Animation and Template-Driven Forms](https://auth0.com/blog/real-world-angular-series-part-5)
6. [Real-World Angular Series - Part 6: Reactive Forms and Custom Validation](https://auth0.com/blog/real-world-angular-series-part-6)
7. [Real-World Angular Series - Part 7: Relational Data and Token Renewal](https://auth0.com/blog/real-world-angular-series-part-7)
8. [Real-World Angular Series - Part 8: Lazy Loading, Production Deployment, SSL](https://auth0.com/blog/real-world-angular-series-part-8)

---

## Part 4: Access Management, Admin, and Detail Pages

The [third part of this tutorial](https://auth0.com/blog/real-world-angular-series-part-3) covered fetching, filtering, and displaying API data.

The fourth installment in the series covers access management with Angular, displaying admin data, and setting up detail pages with tabs.

1. <a href="#angular-access-management" target="_self">Angular: Access Management</a>
2. <a href="#angular-admin-events" target="_self">Angular: Admin Component Event List</a>
3. <a href="#angular-event-component" target="_self">Angular: Event Component</a>
4. <a href="#angular-event-detail" target="_self">Angular: Event Detail Component</a>

---

## <span id="angular-access-management"></span>Angular: Access Management

In the <a href="https://auth0.com/blog/real-world-angular-series-part-2#admin-authorization">Admin Authorization</a> section of Part 2, we enabled administrative rights for a specific user login. In the <a href="https://auth0.com/blog/real-world-angular-series-part-3#api-events">API Events</a> section, we authorized an `/api/event/:id` API endpoint that required authentication and an `/api/events/admin` endpoint that required authentication _and_ admin access. We'll now take measures to protect authorized routes on the front end and manage access to components utilizing protected API routes.

### Route Guards

We'll implement two [route guards](https://angular.io/guide/router#milestone-5-route-guards) in our application. Route guards determine whether a user should be allowed to access a specific route or not. If the guard evaluates to `true`, navigation is allowed to complete. If the guard evaluates to `false`, the route is not activated and the user's attempted navigation does not take place. Multiple route guards can be used on a single route in a chaining fashion, meaning a user can be required to pass multiple checks before they're granted access to a route—similar to how we added multiple middleware functions to our Node API endpoints.

We have two levels of authorization for various routes that require guards:

1. Is the user authenticated?
2. Does the authenticated user have admin privileges?

{% include tweet_quote.html quote_text="Angular route guards determine whether a user is allowed to access a route." %}

### Redirecting To and From Login

There will be an important extra feature in our authentication route guard that will require some updates to our authentication service: _redirection to and from login_. When an unauthenticated user arrives at our app, we want to _limit_ disruptions to their experience as much as possible. This means that we'll surface links to authenticated routes in our _public_ event listing, and then prompt the user to log in when such links are clicked. After they authenticate, they'll be redirected to the protected route.

This reduces friction in the application because we're taking care not to redirect users back to a homepage. This would force them to try to find their own way back to the route they were originally trying to access. It also helps keep the user on track if they manually typed in a URL or clicked a link someone else sent them.

> **Note:** Route guards are for the _UI only_. They don't confer any security when it comes to accessing an _API_. However, we are enforcing authentication and authorization in our API (as you should do in _all_ your apps), so we can take advantage of guards to authenticate and redirect users as well as stop unauthorized navigation.

### Create an Authenticated Route Guard

Let's create a new route guard. The first thing we need to know is whether or not the user is logged in. We'll call this route guard `AuthGuard`.

Create a new guard file with the following command:

```bash
$ ng g guard auth/auth
```

Add the following code to your new `auth.guard.ts` file:

```typescript
// src/app/auth/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.auth.tokenValid) {
      return true;
    } else {
      // Send guarded route to redirect to after logging in
      this.auth.login(state.url);
      return false;
    }
  }

}
```

The boilerplate imports the [`CanActivate` interface](https://angular.io/api/router/CanActivate) to implement the logic declaring whether or not the user should be allowed access to the route. We also need both `ActivatedRouteSnapshot` and `RouterStateSnapshot` to gain access to route information for redirection. RxJS provides `Observable` for type annotation and finally, we need to add the `AuthService` to access its methods.

The logic in the `canActivate()` function is pretty straightforward. Route guards operate on returning `true` or `false` based on a condition that has to be fulfilled to permit navigation. Our condition is `auth.tokenValid` from our `AuthService`. If the user is authenticated with an unexpired token, we can return `true` and navigation continues.

However, if the user is not authenticated, we'll send the guarded route to the `auth.login()` method. This will allow us to redirect _after_ returning from the hosted Auth0 login, which is outside the application. We'll prompt the user to log in to continue with navigation and return `false` to ensure navigation cannot complete.

### Update Authentication Service to Manage Redirects

The route guard contains a URL to redirect to on successful authentication, so our `auth.service.ts` needs to utilize it. Let's make the necessary changes to this file:

```typescript
// src/app/auth/auth.service.ts
...
export class AuthService {
  ...
  login(redirect?: string) {
    // Set redirect after login
    const _redirect = redirect ? redirect : this.router.url;
    localStorage.setItem('authRedirect', _redirect);
    // Auth0 authorize request
    ...
  }

  handleAuth() {
    // When Auth0 hash parsed, get profile
    this._auth0.parseHash((err, authResult) => {
        ...
      } else if (err) {
        this._clearRedirect();
        this.router.navigate(['/']);
        console.error(`Error authenticating: ${err.error}`);
      }
    });
  }

  private _getProfile(authResult) {
    // Use access token to retrieve user's profile and set session
    this._auth0.client.userInfo(authResult.accessToken, (err, profile) => {
      if (profile) {
        ...
        this.router.navigate([localStorage.getItem('authRedirect') || '/']);
        this._clearRedirect();
      } else if (err) {
      ...
    });
  }

  ...

  private _clearRedirect() {
    // Remove redirect from localStorage
    localStorage.removeItem('authRedirect');
  }

  logout() {
    // Ensure all auth items removed from localStorage
    ...
    this._clearRedirect();
    // Reset local properties, update loggedIn$ stream
    ...
    // Return to homepage
    this.router.navigate(['/']);
  }

  ...
```

In the `login()` method, we'll now check for a `redirect` parameter. If there isn't one, this means the user initialized the `login()` method from the header link and not from the route guard. In this case, we'll set `_redirect` to the current URL so the user returns here after authenticating. We'll then set the `_redirect` in local storage.

If the hash is successfully parsed with the appropriate tokens in the `handleAuth()` function, we'll redirect the user in the `_getProfile()` method. If an error occurs, we'll clear the redirect (method declared further down in code), navigate to the homepage, and display the error in the console.

As mentioned above, the `_getProfile()` method will now navigate to the stored redirect URL (or as a failsafe, to the homepage). It will then clear the redirect from local storage to ensure no lingering data is left behind.

The `_clearRedirect()` method is simply a shortcut that removes the `authRedirect` item from local storage, since we do this several times throughout the service.

Finally, on `logout()` we'll clear the redirect. Since Home is the only component that does not require authentication to view, we'll navigate to the homepage.

### Create an Admin Route Guard

Now that we have our authentication guard and service updated, the admin guard will be simple by comparison. Create a new guard:

```bash
$ ng g guard auth/admin
```

Add the following code to the generated `admin.guard.ts` file:

```typescript
// src/app/auth/admin.guard.ts
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.auth.isAdmin) {
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }

}
```

The admin guard will run _after_ the authentication guard, so we'll get all the benefits of the authentication guard too (such as auth checking and redirection). All the admin guard needs to do is check if the authenticated user is an admin and if not, navigate to the homepage.

### Import Guards in Routing Module

Finally, in order to use our route guards, we need to import them in our `app-routing.module.ts`:

```typescript
// src/app/app-routing.module.ts
...
import { AuthGuard } from './auth/auth.guard';
import { AdminGuard } from './auth/admin.guard';

const routes: Routes = [
  ...
];

@NgModule({
  ...,
  providers: [
    AuthGuard,
    AdminGuard
  ],
  ...
})
...
```

We'll import our two route guards and then add them to the `providers` array.

We're now ready to guard routes. The next step is to create protected routes!

---

## <span id="angular-admin-events"></span>Angular: Admin Component Event List

We want an Admin component to display a list of all events, including past and private events (unlike the Home component, which only shows upcoming, public events). The Admin component also needs to be protected by both the authentication guard and the admin guard.

Let's create an Admin component with the CLI now:

```bash
$ ng g component pages/admin
```

### Admin Component Route

Now we'll add the Admin component to our routes in the `app-routing.module.ts` file:

```typescript
// src/app/app-routing.module.ts
...
import { AdminComponent } from './pages/admin/admin.component';

const routes: Routes = [
  ...,
  {
    path: 'admin',
    canActivate: [
      AuthGuard,
      AdminGuard
    ],
    children: [
      {
        path: '',
        component: AdminComponent
      }
    ]
  },
  ...
];

@NgModule({
  ...
})
...
```

Import the new `AdminComponent`. You'll notice we've set up this route a bit differently. The `/admin` route will eventually have other child routes, including pages to create and update events. We want all routes under the `admin` URL segment to be protected, so we'll add a `canActivate` array containing our two route guards, `AuthGuard` and `AdminGuard`. For now, we just have a root child route which uses the Admin component. We'll add the other children later.

### Add Admin Link in Navigation

Let's add a link to the Admin page in our off-canvas navigation. To do this, open the `header.component.html` template:

{% highlight html %}
<!-- src/app/header/header.component.html -->
<header id="header" class="header">
  ...
  <nav id="nav" class="nav" role="navigation">
    <ul class="nav-list">
      ...
      <li>
        <a
          *ngIf="auth.loggedIn && auth.isAdmin"
          routerLink="/admin"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: true }">Admin</a>
      </li>
    </ul>
  </nav>
</header>
{% endhighlight %}

We'll add an "Admin" link that only shows if the user is `auth.loggedIn` and `auth.isAdmin`. Because our `admin` route has children, we'll also add `exact: true` to the `[routerLinkActiveOptions]` directive to prevent the parent "Admin" link from being marked as active when any of its _children_ are active.

This link should now appear in the navigation when an admin user is logged in.

### Show All Events in Admin Component

Open the new `admin.component.ts` file:

```typescript
// src/app/pages/admin/admin.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from './../../auth/auth.service';
import { ApiService } from './../../core/api.service';
import { UtilsService } from './../../core/utils.service';
import { FilterSortService } from './../../core/filter-sort.service';
import { Subscription } from 'rxjs/Subscription';
import { EventModel } from './../../core/models/event.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  pageTitle = 'Admin';
  eventsSub: Subscription;
  eventList: EventModel[];
  filteredEvents: EventModel[];
  loading: boolean;
  error: boolean;
  query = '';

  constructor(
    private title: Title,
    public auth: AuthService,
    private api: ApiService,
    public utils: UtilsService,
    public fs: FilterSortService) { }

  ngOnInit() {
    this.title.setTitle(this.pageTitle);
    this._getEventList();
  }

  private _getEventList() {
    this.loading = true;
    // Get all (admin) events
    this.eventsSub = this.api
      .getAdminEvents$()
      .subscribe(
        res => {
          this.eventList = res;
          this.filteredEvents = res;
          this.loading = false;
        },
        err => {
          console.error(err);
          this.loading = false;
          this.error = true;
        }
      );
  }

  searchEvents() {
    this.filteredEvents = this.fs.search(this.eventList, this.query, '_id', 'mediumDate');
  }

  resetQuery() {
    this.query = '';
    this.filteredEvents = this.eventList;
  }

  ngOnDestroy() {
    this.eventsSub.unsubscribe();
  }

}
```

This is very similar to the Home component we set up in <a href="https://auth0.com/blog/real-world-angular-series-part-3#angular-home-events">Angular: Home Component Event List</a>. The only difference is that we'll import the Auth service. Other than that, we'll set the title, get the full admin events list, implement search functionality, and unsubscribe on destruction of the component.

### Admin Component Template

Before we create our template, let's add a couple of icons to our `assets` folder. Download this [calendar icon SVG](https://cdn.auth0.com/blog/mean-series/calendar.svg) and [eye icon SVG](https://cdn.auth0.com/blog/mean-series/eye.svg). Right-click the links and save both icons to your `src/assets/images` folder.

Now let's open our `admin.component.html` template:

{% highlight html %}
{% raw %}
<!-- src/app/pages/admin/admin.component.html -->
<h1 class="text-center">{{pageTitle}}</h1>
<app-loading *ngIf="loading"></app-loading>

<ng-template [ngIf]="utils.isLoaded(loading)">
  <p class="lead">Welcome, {{auth.userProfile?.name}}! You can create and administer events below.</p>

  <!-- Events -->
  <ng-template [ngIf]="eventList">
    <ng-template [ngIf]="eventList.length">
      <!-- Search events -->
      <section class="search input-group mb-3">
        <label class="input-group-addon" for="search">Search</label>
        <input
          id="search"
          type="text"
          class="form-control"
          [(ngModel)]="query"
          (keyup)="searchEvents()" />
        <span class="input-group-btn">
          <button
            class="btn btn-danger"
            (click)="resetQuery()"
            [disabled]="!query">&times;</button>
        </span>
      </section>

      <!-- No search results -->
      <p *ngIf="fs.noSearchResults(filteredEvents, query)" class="alert alert-warning">
        No events found for <em class="text-danger">{{query}}</em>, sorry!
      </p>

      <!-- Events listing -->
      <section class="list-group">
        <div
          *ngFor="let event of fs.orderByDate(filteredEvents, 'startDatetime')"
          class="list-group-item list-group-item-action flex-column align-items-start">
          <div class="d-flex w-100 justify-content-between">
            <a [routerLink]="['/event', event._id]">
              <h5 class="mb-1" [innerHTML]="event.title"></h5>
            </a>
            <div class="event-icons">
              <img
                *ngIf="!event.viewPublic"
                class="event-icon"
                title="Private"
                src="/assets/images/eye.svg">
              <img
                *ngIf="utils.eventPast(event.endDatetime)"
                class="event-icon"
                title="Event is over"
                src="/assets/images/calendar.svg">
            </div>
          </div>
          <p class="mb-1">
            <strong>Date:</strong> {{utils.eventDates(event.startDatetime, event.endDatetime)}}
          </p>
        </div>
      </section>
    </ng-template>

    <!-- No events available -->
    <p *ngIf="!eventList.length" class="alert alert-info">
      No events have been created yet.
    </p>
  </ng-template>

  <!-- Error loading events -->
  <p *ngIf="error" class="alert alert-danger">
    <strong>Oops!</strong> There was an error retrieving event data.
  </p>

</ng-template>
{% endraw %}
{% endhighlight %}

Again, this is very similar to our Home component's implementation. However, we'll start with a paragraph greeting our admin user. We're showing icons in our event list indicating if an event is in the past (with the calendar icon) or if it has `viewPublic: false`. Also, we're only linking the title of the event to its detail page instead of the entire list item because we'll be adding "Edit" and "Delete" buttons to each event later.

Now open `admin.component.scss` to add a few styles for our event icons:

```scss
/* src/app/pages/admin/admin.component.scss */
/*--------------------
    ADMIN COMPONENT
--------------------*/

.event-icon {
  display: inline-block;
  height: 16px;
  margin: 0 4px;
  width: 16px;
}
```

Because our Admin component and API route are protected, you'll have to log into the app with the admin user you specified in the <a href="https://auth0.com/blog/real-world-angular-series-part-2#admin-authorization">Admin Authorization</a> section of Part 2 in order to view the page. Once you're logged in, the Admin component should look something like this:

![Angular admin page](https://cdn.auth0.com/blog/mean-series/admin-list.jpg)

If unauthenticated users attempt to access this page, they'll be prompted to log in. If they are admin upon logging in, they'll be granted access. If they don't have admin rights, they'll be redirected to the homepage by our admin route guard. If a user logs out from this page, they'll also be redirected to the homepage. Try it out!

> **Security Note:** Even if a user was somehow able to circumvent the front end protection, the Node API would not return the events data without the correct admin role concealed in the access token.

That's all we'll do with the Admin page for now. Later on, we'll add links to _create_ and _update_ events.

---

## <span id="angular-event-component"></span>Angular: Event Component

In our Home and Admin components, we linked individual events by their IDs. Now it's time to create the event detail page that these links lead to.

```bash
$ ng g component pages/event
```

### Add Event Component to Routing Module

Let's add our Event component to our routing module. Open `app-routing.module.ts`:

```typescript
// src/app/app-routing.module.ts
...
import { EventComponent } from './pages/event/event.component';

...
  {
    path: 'event/:id',
    component: EventComponent,
    canActivate: [
      AuthGuard
    ]
  },
...
```

We'll import and add our `event/:id` route. The Event component requires authentication to access, so we'll also add `AuthGuard` to it. We can now access events in the browser by clicking on them from an event listing (from the Home or Admin pages).

### Create Event Detail and RSVP Components

Our Event component is going to have two tabs with child components: an Event Detail component and an RSVP component. The routed Event component will provide data to the child components via [input binding](https://angular.io/guide/component-interaction#pass-data-from-parent-to-child-with-input-binding), so we'll manage tab navigation with route parameters.

> **Note:** The other alternative would be to use [Resolve](https://angular.io/api/router/Resolve) in the parent route to fetch API data and then use [child routes](https://angular.io/guide/router#child-routing-component) that observe the parent's resolve data. However, we are avoiding route resolves for reasons cited earlier in this tutorial, such as the appearance of sluggish navigation. However, feel free to explore this approach on your own if you prefer.

Use the Angular CLI to generate components for the child components like so:

```bash
$ ng g component pages/event/event-detail
$ ng g component pages/event/rsvp
```

### Add Tab Utility to Service

We want to be able to support tabs in our application. Let's add a small tab-checking utility to our `utils.service.ts`:

```typescript
// src/app/core/utils.service.ts
...
  tabIs(currentTab: string, tab: string): boolean {
    // Check if current tab is tab name
    return currentTab === tab;
  }
...
```

We'll add a `tabIs()` method to return a `boolean` if the current tab matches another tab name. This is how we'll implement logic to apply classes and show or hide tab-dependent content.

### Event Component Class

Open the `event.component.ts` file and add the following code:

```typescript
// src/app/pages/event/event.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from './../../auth/auth.service';
import { ApiService } from './../../core/api.service';
import { UtilsService } from './../../core/utils.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { EventModel } from './../../core/models/event.model';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit, OnDestroy {
  pageTitle: string;
  id: string;
  routeSub: Subscription;
  tabSub: Subscription;
  eventSub: Subscription;
  event: EventModel;
  loading: boolean;
  error: boolean;
  tab: string;
  eventPast: boolean;

  constructor(
    private route: ActivatedRoute,
    public auth: AuthService,
    private api: ApiService,
    public utils: UtilsService,
    private title: Title) { }

  ngOnInit() {
    // Set event ID from route params and subscribe
    this.routeSub = this.route.params
      .subscribe(params => {
        this.id = params['id'];
        this._getEvent();
      });

    // Subscribe to query params to watch for tab changes
    this.tabSub = this.route.queryParams
      .subscribe(queryParams => {
        this.tab = queryParams['tab'] || 'details';
      });
  }

  private _getEvent() {
    this.loading = true;
    // GET event by ID
    this.eventSub = this.api
      .getEventById$(this.id)
      .subscribe(
        res => {
          this.event = res;
          this._setPageTitle(this.event.title);
          this.loading = false;
          this.eventPast = this.utils.eventPast(this.event.endDatetime);
        },
        err => {
          console.error(err);
          this.loading = false;
          this.error = true;
          this._setPageTitle('Event Details');
        }
      );
  }

  private _setPageTitle(title: string) {
    this.pageTitle = title;
    this.title.setTitle(title);
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.tabSub.unsubscribe();
    this.eventSub.unsubscribe();
  }

}
```

As always, first we'll add our imports. Let's dive right into the class, covering the imports as we go through the code.

This time, we won't set a `pageTitle` immediately. We first need to retrieve the event data from the API. We'll also grab the event's `id` by subscribing to the [`ActivatedRoute`](https://angular.io/api/router/ActivatedRoute) route parameters observable. We'll subscribe to the route's query parameters observable to set the `tab`. As usual, we'll get our event data from the API service, annotating results with the `EventModel` type. For this component and its children, we also want to know if the event is has already ended so we'll use an `eventPast` property to track this with the `eventPast()` method we added to our `UtilsService` in the <a href="https://auth0.com/blog/real-world-angular-series-part-3#angular-utility-service" target="_self">Angular: Create a Utility Service</a> section of Part 3.

> **Note:** Users should not RSVP to events in the past.

In our `ngOnInit()` method, we'll subscribe to the route params, set the local `id` property, and execute the method that fetches the event from the API (`_getEvent()`). Then we'll subscribe to the query params to set the `tab`. If there is no query parameter present, we'll default to the `details` tab.

In our `_getEvent()` method, we'll also set the `pageTitle` with the title of the retrieved event using a `_setPageTitle()` method. We'll also check to see if the event is in the past. If an error occurs, we'll set the page title to `Event Details`.

Finally, we'll unsubscribe from all three subscriptions when the component is destroyed.

### Event Component Template

Next, let's build out the `event.component.html` template file:

{% highlight html %}
{% raw %}
<!-- src/app/pages/event/event.component.html -->
<app-loading *ngIf="loading"></app-loading>

<ng-template [ngIf]="utils.isLoaded(loading)">
  <h1 class="text-center">{{pageTitle}}</h1>
  <!-- Event -->
  <ng-template [ngIf]="event">
    <!-- Event is over -->
    <p *ngIf="eventPast" class="alert alert-danger">
      <strong>This event is over.</strong>
    </p>

    <div class="card">
      <!-- Event tab navigation -->
      <div class="card-header">
        <ul class="nav nav-tabs card-header-tabs">
          <li class="nav-item">
            <a
              class="nav-link"
              [routerLink]="[]"
              [queryParams]="{tab: 'details'}"
              [ngClass]="{'active': utils.tabIs(tab, 'details')}">Details</a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              [routerLink]="[]"
              [queryParams]="{tab: 'rsvp'}"
              [ngClass]="{'active': utils.tabIs(tab, 'rsvp')}">RSVP</a>
          </li>
        </ul>
      </div>

      <!-- Event detail tab -->
      <app-event-detail
        *ngIf="utils.tabIs(tab, 'details')"
        [event]="event"></app-event-detail>

      <!-- Event RSVP tab -->
      <app-rsvp
        *ngIf="utils.tabIs(tab, 'rsvp')"></app-rsvp>
    </div>
  </ng-template>

  <!-- Error loading events -->
  <p *ngIf="error" class="alert alert-danger">
    <strong>Oops!</strong> There was an error retrieving information for this event.
  </p>
</ng-template>
{% endraw %}
{% endhighlight %}

Once the API call has been made and an event has been retrieved, we'll show an alert if the event is in the past. We'll then display our tabs in a [Bootstrap card component](https://v4-alpha.getbootstrap.com/components/card/). We'll use the [RouterLink directive](https://angular.io/api/router/RouterLink) with `[queryParams]` to set the tab, and update the `active` class accordingly.

Below the tab navigation, we'll load the Event Detail or RSVP component conditionally, passing in necessary data: the full `[event]` for Event Detail and `[eventId]` and `[eventPast]` for Rsvp.

### Aside: "Private" Events

Some of our events are set to `viewPublic: false`. If you recall, all this means is that these events don't show up in a public listing. They still appear in the Admin component listing and can also be direct-linked. If you're an admin and you have an event you'd like to share only with specific people, you can access the page through the Admin listing and email invitees the direct link, which might look something like this: `/event/590a642ef36d281a3dc29522`.

> **Note:** It's important to understand there is _no security_ conferred here. All events are still accessible to any authenticated user, we're just making it slightly more difficult for people to _discover_ certain events without a direct link. If you'd like to implement security to ensure that users need a real invitation code in order to view and/or RSVP to events, that would be a great feature to work through on your own after completing this tutorial series. Keep in mind this must be implemented both on the client _and_ server for proper security.

### Add Tab Support to Auth Redirection

Now that we have working tabs, we need to update our `AuthService` to support redirection with query parameters. In <a href="https://auth0.com/blog/real-world-angular-series-part-4#angular-access-management">Angular: Access Management</a>, we added support to redirect the user to a previous route after logging in. However, at that time, we did not set this up in a way that supported query parameters.

Let's update the `auth.service.ts` file to do so now:

```typescript
// src/app/core/auth/auth.service.ts
...
export class AuthService {
  ...
  private _getProfile(authResult) {
    // Use access token to retrieve user's profile and set session
    this._auth0.client.userInfo(authResult.accessToken, (err, profile) => {
      ...
      this._redirect();
      this._clearRedirect();
    });
  }

  ...

  private _redirect() {
    // Redirect with or without 'tab' query parameter
    // Note: does not support additional params besides 'tab'
    const fullRedirect = decodeURI(localStorage.getItem('authRedirect'));
    const redirectArr = fullRedirect.split('?tab=');
    const navArr = [redirectArr[0] || '/'];
    const tabObj = redirectArr[1] ? { queryParams: { tab: redirectArr[1] }} : null;

    if (!tabObj) {
      this.router.navigate(navArr);
    } else {
      this.router.navigate(navArr, tabObj);
    }
  }

...
```

Let's create a private function called `_redirect()`. This will assess the `authRedirect` string stored in local storage and split it into the appropriate Angular path and query parameters, if necessary. Then it will navigate to the route.

Now we're ready to implement our Event Detail and RSVP child components.

---

## <span id="angular-event-detail"></span>Angular: Event Detail Component

Our Event Detail component is the tab that will display the event information.

### Event Detail Component Class

Let's open the `event-detail.component.ts` that we created recently:

```typescript
// src/app/pages/event/event-detail/event-detail.component.ts
import { Component, Input } from '@angular/core';
import { AuthService } from './../../../auth/auth.service';
import { UtilsService } from './../../../core/utils.service';
import { EventModel } from './../../../core/models/event.model';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss']
})
export class EventDetailComponent {
  @Input() event: EventModel;

  constructor(
    public utils: UtilsService,
    public auth: AuthService) { }

}
```

This component class only has a few simple responsibilities. It needs to accept the `[event]` input passed in from the parent using the [`@Input` decorator](https://angular.io/guide/template-syntax#input-and-output-properties--input-and-output-). This data is one-way bound to the child component and can be used like any locally-declared property. We also need to make methods from `UtilsService` and `AuthService` available to the template. We do this by passing them as `public` to the constructor method.

### Event Detail Component Template

Let's add our template now in `event-detail.component.html`:

{% highlight html %}
{% raw %}
<!-- src/app/pages/event/event-detail/event-detail.component.html -->
<div class="card-block">
  <h2 class="card-title text-center">Event Details</h2>
</div>

<ul class="list-group list-group-flush">
  <li class="list-group-item">
    <strong>When:</strong>{{utils.eventDatesTimes(event.startDatetime, event.endDatetime)}}
  </li>
  <li class="list-group-item">
    <strong>Where:</strong>{{event.location}} (<a href="https://www.google.com/maps/dir//{{event.location}}" target="_blank">get directions</a>)
  </li>
</ul>

<p
  *ngIf="event.description"
  class="card-block lead"
  [innerHTML]="event.description"></p>

<div *ngIf="auth.isAdmin" class="card-footer text-right small">
  <a [routerLink]="['/admin/event/update', event._id]">Edit</a>
</div>
{% endraw %}
{% endhighlight %}

This child component lives inside the Event component and all it needs to do is show event information. In a [Bootstrap list group](https://v4-alpha.getbootstrap.com/components/card/#list-groups), we'll display the event dates and times and the `location`. In order to show the dates/times in a reader-friendly way, we'll use the `eventDatesTimes()` method from our utility service. The location should also be followed by a link to Google Maps so the user can get directions if needed. This can open in a new tab.

The event `description` is set with the `[innerHTML]` DOM property directive so that, [after automatic sanitization](https://angular.io/guide/security#sanitization-and-security-contexts), it will render safe markup if any is present.

Last, we'll add a link to edit the event if the user is an admin.

> **Note:** Right now, this "Edit" link won't go anywhere since we haven't created the Update Event component or route. We'll add the component later and then the link will function.

We're now finished with our Event Detail tab component! It should look something like this in the browser:

![Angular MEAN app - event detail component](https://cdn.auth0.com/blog/mean-series/event-details.jpg)

Now that we have our event details, we're ready to implement the logic to manage RSVPs next time.

## Aside: Securing Applications with Auth0

Are you building a [B2C](https://auth0.com/b2c-customer-identity-management), [B2B](https://auth0.com/b2b-enterprise-identity-management), or [B2E](https://auth0.com/b2e-identity-management-for-employees) tool? Auth0 can help you focus on what matters the most to you, the special features of your product. [Auth0](https://auth0.com/) can improve your product's security with state-of-the-art features like [passwordless](https://auth0.com/passwordless), [breached password surveillance](https://auth0.com/breached-passwords), and [multifactor authentication](https://auth0.com/multifactor-authentication).

[We offer a generous **free tier**](https://auth0.com/pricing) so you can get started with modern authentication.

---

## Summary

In Part 4 of our Real-World Angular Series, we've covered access management with Angular, displaying admin data, and setting up detail pages with tabs. In the next part of the tutorial series, we'll tackle simple animation as well as creating and updating data with a template-driven form.
