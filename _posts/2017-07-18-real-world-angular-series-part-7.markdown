---
layout: post
title: "Real-World Angular Series - Part 7: Relational Data and Token Renewal"
description: "Build and deploy a real-world app with MongoDB, Express, Angular, and Node (MEAN): relational data and auth token renewal."
date: 2017-07-18 8:30
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
- 2017-07-06-real-world-angular-series-part-4
- 2017-07-11-real-world-angular-series-part-5
- 2017-07-13-real-world-angular-series-part-6

---

<div class="alert alert-danger alert-icon">
  <i class="icon-budicon-487"></i>
  <strong>WARNING: This series of articles uses Angular 5 and RxJS 5.</strong> Please be aware that code changes are necessary to use Angular 6 and RxJS 6 with this tutorial. We are in the process of upgrading the series to latest versions. In the meantime, you can <a href="https://update.angular.io/">follow the update instructions here</a> for more information. Thank you for your patience!
</div>

**TL;DR:** This 8-part tutorial series covers building and deploying a full-stack JavaScript application from the ground up with hosted [MongoDB](https://www.mongodb.com/), [Express](https://expressjs.com/), [Angular (v2+)](https://angular.io), and [Node.js](https://nodejs.org) (MEAN stack). The completed code is available in the [mean-rsvp-auth0 GitHub repo](https://github.com/auth0-blog/mean-rsvp-auth0/) and a deployed sample app is available at [https://rsvp.kmaida.net](https://rsvp.kmaida.net).  **Part 7 of the tutorial series covers deleting data, retrieving relational data from MongoDB, and renewing authentication tokens.**

---

## Real-World Angular Series

You can view all sections of the tutorial series here:

1. [Real-World Angular Series - Part 1: MEAN Setup & Angular Architecture](https://auth0.com/blog/real-world-angular-series-part-1)
2. [Real-World Angular Series - Part 2: Authentication and Data Modeling](https://auth0.com/blog/real-world-angular-series-part-2)
3. [Real-World Angular Series - Part 3: Fetching and Displaying API Data](https://auth0.com/blog/real-world-angular-series-part-3)
4. [Real-World Angular Series - Part 4: Access Management, Admin, and Detail Pages](https://auth0.com/blog/real-world-angular-series-part-4)
5. [Real-World Angular Series - Part 5: Animation and Template-Driven Forms](https://auth0.com/blog/real-world-angular-series-part-5)
6. [Real-World Angular Series - Part 6: Reactive Forms and Custom Validation](https://auth0.com/blog/real-world-angular-series-part-6)
7. [Real-World Angular Series - Part 7: Relational Data and Token Renewal](https://auth0.com/blog/real-world-angular-series-part-7) (you are here!)
8. [Real-World Angular Series - Part 8: Lazy Loading, Production Deployment, SSL](https://auth0.com/blog/real-world-angular-series-part-8)

---

## Part 7: Relational Data and Token Renewal

The [sixth part of this tutorial](https://auth0.com/blog/real-world-angular-series-part-6) covered reactive forms with custom validation.

The seventh installment in the series covers deleting events, retrieving relational data from MongoDB to list events a user has RSVPed to, and silently renewing authentication tokens.

1. <a href="#angular-delete-event" target="_self">Angular: Delete Event</a>
2. <a href="#angular-admin-event-links" target="_self">Angular: Admin Event Links</a>
3. <a href="#api-user-events" target="_self">API: Get Events User Has RSVPed To</a>
4. <a href="#angular-user-events" target="_self">Angular: Add User's Events Endpoint to API Service</a>
5. <a href="#angular-my-rsvps" target="_self">Angular: My RSVPs (Profile)</a>
6. <a href="#renew-auth" target="_self">Angular: Renew Tokens with Auth0</a>

---

## <span id="angular-delete-event"></span>Angular: Delete Event

Let's pick up right where we left off [last time](https://auth0.com/blog/real-world-angular-series-part-7). Our app's administrator can now create and update events. We also need to be able to _delete_ events. We already added a `DELETE` <a href="https://auth0.com/blog/real-world-angular-series-part-6#api-events">API route in Part 6</a>. Now let's call this endpoint in our Angular app. We'll do so in our Update Event component.

We want to make deleting an event slightly more involved than simply clicking a button. We also want to avoid showing the user a modal or pop-up message making them confirm their action. To delete an event, we'll have the user confirm the _title_ of the event by entering it into a text field.

> **Note:** This is how [GitHub](https://github.com) has users confirm deletion of repositories.

We don't want to confuse users about what they should be entering as a title by showing them both the update and delete forms at the same time, so we'll add tabs to the Update Event component.

### Add Tabs to Update Event Component Class

The code necessary to add tabs is minimal. There are no initial data calls necessary to delete events, so our tabs for updating events will be less involved compared to the tabs for viewing an event's details vs. displaying RSVPs.

Open the `update-event.component.ts` file:

```typescript
// src/app/pages/admin/update-event/update-event.component.ts
...
export class UpdateEventComponent implements OnInit, OnDestroy {
  ...
  tabSub: Subscription;
  tab: string;

  ngOnInit() {
    ...
    // Subscribe to query params to watch for tab changes
    this.tabSub = this.route.queryParams
      .subscribe(queryParams => {
        this.tab = queryParams['tab'] || 'edit';
      });
  }

  ...

  ngOnDestroy() {
    ...
    this.tabSub.unsubscribe();
  }

}
```

We already have all the imports necessary to add tabs to our component class. We'll add properties for a `tabSub` subscription and `tab` string to store the name of the current tab.

In `ngOnInit()`, we'll add a subscribtion to `queryParams` to set the local `tab` property to the contents of the `tab` query parameter (or `'edit'` if no parameter is available).

Finally, we'll unsubscribe from the `tabSub` in the `ngOnDestroy()` lifecycle method.

### Add Tabs to Update Event Component Template

Let's add the markup necessary to display tabs and dynamic content in our Update Event component template. Open the `update-event.component.html` file:

{% highlight html %}
<!-- src/app/pages/admin/update-event/update-event.component.html -->
...
<ng-template [ngIf]="utils.isLoaded(loading)">
  <div *ngIf="event" class="card">
    <div class="card-header">
      <ul class="nav nav-tabs card-header-tabs">
        <li class="nav-item">
          <a
            class="nav-link"
            [routerLink]="[]"
            [queryParams]="{tab: 'edit'}"
            [ngClass]="{'active': utils.tabIs(tab, 'edit')}">Edit</a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            [routerLink]="[]"
            [queryParams]="{tab: 'delete'}"
            [ngClass]="{'active': utils.tabIs(tab, 'delete')}">Delete</a>
        </li>
      </ul>
    </div>

    <div class="card-block">
      <!-- Edit event form -->
      <app-event-form
        *ngIf="utils.tabIs(tab, 'edit')"
        [event]="event"></app-event-form>

      <!-- Delete event -->
      <app-delete-event
        *ngIf="utils.tabIs(tab, 'delete')"
        [event]="event"></app-delete-event>
    </div>

  </div>

  <!-- Error loading event -->
  ...
</ng-template>
{% endhighlight %}

We can change our `<ng-template [ngIf]="event">` to `<div *ngIf="event" class="card">` because this element should now render in the page as a container. Then we'll add the necessary markup to create tabs in a card header element. We'll set up the `routerLink`s with query parameters and `[ngClass]` to apply a conditional `active` class for the current tab. Our two tabs will be called "Edit" and "Delete".

Next we'll add a `.card-block` element containing our conditional tab content. We'll show the `<app-event-form>` component if the active tab is `edit`. We'll show an `<app-delete-event>` component if the `delete` tab is active. We'll also pass the `[event]` to the Delete Event component, which we'll create next.

Once we have tabs in place, our Update Event component should like this by default:

![Angular tabs with Bootstrap update event reactive form](https://cdn.auth0.com/blog/mean-series/update-event.jpg)

### Create Delete Event Component

Let's generate our Delete Event component:

```bash
$ ng g component pages/admin/update-event/delete-event
```

This is a child component of Update Event and provides the content for the `delete` tab.

### Delete Event Component Class

Open the `delete-event.component.ts` and let's add some functionality:

```typescript
// src/app/pages/admin/update-event/delete-event/delete-event.component.ts
import { Component, OnDestroy, Input } from '@angular/core';
import { EventModel } from './../../../../core/models/event.model';
import { Subscription } from 'rxjs/Subscription';
import { ApiService } from './../../../../core/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-event',
  templateUrl: './delete-event.component.html',
  styleUrls: ['./delete-event.component.scss']
})
export class DeleteEventComponent implements OnDestroy {
  @Input() event: EventModel;
  confirmDelete: string;
  deleteSub: Subscription;
  submitting: boolean;
  error: boolean;

  constructor(
    private api: ApiService,
    private router: Router) { }

  removeEvent() {
    this.submitting = true;
    // DELETE event by ID
    this.deleteSub = this.api
      .deleteEvent$(this.event._id)
      .subscribe(
        res => {
          this.submitting = false;
          this.error = false;
          console.log(res.message);
          // If successfully deleted event, redirect to Admin
          this.router.navigate(['/admin']);
        },
        err => {
          console.error(err);
          this.submitting = false;
          this.error = true;
        }
      );
  }

  ngOnDestroy() {
    if (this.deleteSub) {
      this.deleteSub.unsubscribe();
    }
  }

}
```

We'll import `OnDestroy` and `Input`, as well as `EventModel`, `Subscription`, `ApiService`, and `Router` (to redirect after the event has been deleted).

Our parent Update Event component sends the `event` as an `@Input()`. We expect this to have the shape `EventModel`. We'll set a local `confirmDelete` property to store the string that the user types that needs to match to the event's title to confirm deletion. We also need a `deleteSub` subscription, and of course, our standard `submitting` and `error` states.

We'll add the API service and `Router` to the constructor. We actually don't need `ngOnInit()` in this component, so you'll notice we've removed the method and all references to the `OnInit` lifecycle hook.

Our `removeEvent()` method will be called from a button that is only enabled once the user has successfully inputted the event's full title in a text field. We'll send the event's `_id` to our `deleteEvent$()` API observable. If the event is successfully deleted, we'll need to redirect to the Admin page since there will no longer be any event data available in the Update Event component.

In the `ngOnDestroy()` method, we'll check if the subscription exists, since it is only created when the user clicks the button to delete the event. If it is present, we'll unsubscribe.

### Delete Event Component Template

Now open the `delete-event.component.html` template and add the following code:

{% highlight html %}
<!-- src/app/pages/admin/update-event/delete-event.component/delete-event.component.html -->
<p class="lead">
  You are deleting the "<strong [innerHTML]="event.title"></strong>" event.
</p>

<p class="text-danger">
  Deleting this event will also remove all associated RSVPs. Please proceed with caution!
</p>

<div class="form-group">
  <label for="deleteEvent">Confirm event title:</label>
  <input
    type="text"
    id="deleteEvent"
    class="form-control"
    name="deleteEvent"
    [(ngModel)]="confirmDelete">
</div>

<!-- Delete button -->
<p>
  <button
    class="btn btn-danger"
    (click)="removeEvent()"
    [disabled]="confirmDelete !== event.title || submitting">Delete Event</button>
  <app-submitting *ngIf="submitting"></app-submitting>
</p>

<!-- Error deleting event -->
<p *ngIf="error" class="alert alert-danger">
  <strong>Oops!</strong> There was an error deleting this event. Please try again.
</p>
{% endhighlight %}

We'll need to show the name of the event so the admin can confirm the title without too much hassle. Next we'll display some cautionary information.

Then we'll create an extremely simple form. This form is unlike those we created for RSVPing and creating events. In fact, we don't even need true validation. We can handle everything we need with a simple `[(ngModel)]` directive and a comparison expression.

> **Note:** If you prefer, you may implement a template-driven form here. You can even create a custom validator. However, for the sake of ease and simplicity, this tutorial won't take that approach.

We'll use `[(ngModel)]` to set up two-way binding between the input field and our `confirmDelete` property. Our delete button will call the `removeEvent()` method when clicked, but will be disabled if the value of `confirmDelete` is not an exact match to the `event.title`. As usual, we'll disable the button and display our `<app-submitting>` loading component if the API call is in progress.

Finally, if something went wrong deleting the event, we'll show an error.

Our Update Event component now looks like this when the Delete tab is active:

![Angular delete event](https://cdn.auth0.com/blog/mean-series/delete-event.jpg)

---

## <span id="angular-admin-event-links"></span>Angular: Admin Event Links

Now that the functionality for CRUD (Create Read Update Delete) is complete, let's add a couple more buttons to the Admin page to facilitate access to these features.

### Add "Create" Link to Admin Page

Let's add a button to the Admin page that links to the Create Event component page. Open the `admin.component.html` template file and add a paragraph tag with a link:

{% highlight html %}
<!-- src/app/pages/admin/admin.component.html -->
...
<ng-template [ngIf]="utils.isLoaded(loading)">
  ...
  <p>
    <a
      class="btn btn-success btn-block"
      routerLink="/admin/event/new">+ Create New Event</a>
  </p>
  ...
{% endhighlight %}

This link simply leads to the Create Event page.

### Add "Edit" and "Delete" Links to Admin Events List

Now let's add a link to each event in the Admin component that will take us straight to the Delete tab for that event. In the `admin.component.html` template file, update the following:

{% highlight html %}
<!-- src/app/pages/admin/admin.component.html -->
...
      <!-- Events listing -->
      <section class="list-group">
        <div
          *ngFor="let event of fs.orderByDate(filteredEvents, 'startDatetime')"
          class="list-group-item list-group-item-action flex-column align-items-start">
          ...
          <p class="mb-1">
            <a
              class="btn btn-info btn-sm"
              [routerLink]="['/admin/event/update', event._id]">Edit</a>
            <a
              class="btn btn-danger btn-sm"
              [routerLink]="['/admin/event/update', event._id]"
              [queryParams]="{tab: 'delete'}">Delete</a>
          </p>
        </div>
      </section>
...
{% endhighlight %}

Let's add an "Edit" and a "Delete" button. The "Edit" button can lead to the Update Event component on its default tab. The "Delete" link should have `[queryParams]` set to the `delete` tab.

Our Admin page should now look something like this:

![Angular admin page](https://cdn.auth0.com/blog/mean-series/admin-final.jpg)

> **Side Note:** Recall that we already added an "Edit" link to our [Event Details component](https://auth0.com/blog/real-world-angular-series-part-4#angular-event-detail). This link should now be active as well.

---

## <span id="api-user-events"></span>API: Get Events User Has RSVPed To

Our application is still missing an important feature: a page where the user can collectively view all their RSVPs for upcoming events.

In order to achieve this, we need to get the list of a user's RSVPs and then find all the events that match the RSVP's `eventId`. MongoDB is not a relational database, but we can use [comparison query operators](https://docs.mongodb.com/manual/reference/operator/query-comparison/) to do this.

Open the server `api.js` file and add the following route:

```js
// server/api.js
...
/*
 |--------------------------------------
 | API Routes
 |--------------------------------------
 */
  ...
  // GET list of upcoming events user has RSVPed to
  app.get('/api/events/:userId', jwtCheck, (req, res) => {
    Rsvp.find({userId: req.params.userId}, 'eventId', (err, rsvps) => {
      const _eventIdsArr = rsvps.map(rsvp => rsvp.eventId);
      const _rsvpEventsProjection = 'title startDatetime endDatetime';
      let eventsArr = [];

      if (err) {
        return res.status(500).send({message: err.message});
      }
      if (rsvps) {
        Event.find(
          {_id: {$in: _eventIdsArr}, startDatetime: { $gte: new Date() }},
          _rsvpEventsProjection, (err, events) => {
          if (err) {
            return res.status(500).send({message: err.message});
          }
          if (events) {
            events.forEach(event => {
              eventsArr.push(event);
            });
          }
          res.send(eventsArr);
        });
      }
    });
  });

  ...
```

We'll first use `find()` to get all RSVPs with a `userId` matching the user ID passed as a parameter to the route. We'll send a projection of `eventId`, which means that the returned results will only contain this single key/value. We'll then create an array of event IDs (`_eventIdsArr`) using the Array `.map()` method to get just the ID strings. We can then use this array to `find()` _only_ events that have `_id`s matching items in the array.

The only properties we'll need for display of the event list in the My RSVPs component are `title`, `startDatetime`, and `endDatetime`. We'll create a projection for these called `_rsvpEventsProjection`.

After handling errors for retrieving RSVPs, we can then `find()` events with an `_id` present in the `_eventIdsArr`. This is done using the [MongoDB `$in` comparison query operator](https://docs.mongodb.com/manual/reference/operator/query/in/). We only want _upcoming_ events, so we'll indicate that `startDatetime` should be [greater than or equal to (`$gte`)](https://docs.mongodb.com/manual/reference/operator/query/gte/) the current datetime. We'll then pass the `_rsvpEventsProjection` we just created to get back only the properties we need.

{% include tweet_quote.html quote_text="We can use MongoDB comparison query operators to retrieve relational data." %}

After handling errors for retrieving events, we'll push any results found to an array and `send()` the array.

We're now ready to use our `/api/events/:userId` endpoint to get a list of upcoming events that the user has RSVPed to.

---

## <span id="angular-user-events"></span>Angular: Add User's Events Endpoint to API Service

Let's add our new API endpoint to our API service. Open the `api.service.ts` file and add this method:

```typescript
// src/app/core/api.service.ts
...
  // GET all events a specific user has RSVPed to (login required)
  getUserEvents$(userId: string): Observable<EventModel[]> {
    return this.http
      .get(`${ENV.BASE_API}events/${userId}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .pipe(
        catchError((error) => this._handleError(error))
      );
  }

...
```

---

## <span id="angular-my-rsvps"></span>Angular: My RSVPs (Profile)

We now have an API endpoint providing a list of upcoming events a user has responded to. Let's make a My RSVPs (profile) component to display this information to the authenticated user.

### Create My RSVPs Component

First we'll generate our new component. Run the following command:

```bash
$ ng g component pages/my-rsvps
```

We now have our My RSVPs component scaffolded.

### Update App Routing Module

The My RSVPs component is a routed component, so let's add it to our `app-routing.module.ts`:

```typescript
// src/app/core/app-routing.module.ts
...
import { MyRsvpsComponent } from './pages/my-rsvps/my-rsvps.component';

const routes: Routes = [
  ...,
  {
    path: 'my-rsvps',
    component: MyRsvpsComponent,
    canActivate: [
      AuthGuard
    ]
  },
  ...
];
...
```

The user must be authenticated in order to have a user ID and stored RSVPs, so we'll implement `AuthGuard` for this route.

### Add Capitalize Utility to Service

We're going to display the identity provider (IdP) that the user is currently logged in with. In order to display this from the data given by the user's ID, we'll create a small utility method that capitalizes the first letter of a string.

Open the `utils.service.ts` file and add this method:

```typescript
// src/app/core/utils.service.ts
...
  capitalize(str: string): string {
    // Capitalize first letter of string
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
...
```

### My RSVPs Component Class

Let's implement our My RSVPs component class. Open the `my-rsvps.component.ts` file and add:

```typescript
// src/app/pages/my-rsvps/my-rsvps.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from './../../auth/auth.service';
import { ApiService } from './../../core/api.service';
import { UtilsService } from './../../core/utils.service';
import { FilterSortService } from './../../core/filter-sort.service';
import { Subscription } from 'rxjs/Subscription';
import { EventModel } from './../../core/models/event.model';

@Component({
  selector: 'app-my-rsvps',
  templateUrl: './my-rsvps.component.html',
  styleUrls: ['./my-rsvps.component.scss']
})
export class MyRsvpsComponent implements OnInit, OnDestroy {
  pageTitle = 'My RSVPs';
  eventListSub: Subscription;
  eventList: EventModel[];
  loading: boolean;
  error: boolean;
  userIdp: string;

  constructor(
    private title: Title,
    public auth: AuthService,
    private api: ApiService,
    public fs: FilterSortService,
    public utils: UtilsService) { }

  ngOnInit() {
    this.title.setTitle(this.pageTitle);
    this.userIdp = this._getIdp;
    this._getEventList();
  }

  private _getEventList() {
    this.loading = true;
    // Get events user has RSVPed to
    this.eventListSub = this.api
      .getUserEvents$(this.auth.userProfile.sub)
      .subscribe(
        res => {
          this.eventList = res;
          this.loading = false;
        },
        err => {
          console.error(err);
          this.loading = false;
          this.error = true;
        }
      );
  }

  private get _getIdp(): string {
    const sub = this.auth.userProfile.sub.split('|')[0];
    let idp = sub;

    if (sub === 'auth0') {
      idp = 'Username/Password';
    } else if (idp === 'google-oauth2') {
      idp = 'Google';
    } else {
      idp = this.utils.capitalize(sub);
    }
    return idp;
  }

  ngOnDestroy() {
    this.eventListSub.unsubscribe();
  }

}
```

We'll use our standard imports for routed components with an API call, as well as the `FilterSortService` to order the events by date. Then we'll add our standard properties to manage page title, the event list subscription, etc. We'll also add a `userIdp` property.

In our `ngOnInit()` method, we'll set the page title and `_getEventList()`, which subscribes to the `getUserEvents$()` observable we created earlier, passing the user's ID (the `auth.userProfile.sub` property) to the API endpoint.

Our `_getIdp()` accessor gets the identity provider from the user's account ID. The `userProfile.sub` account IDs look something like this:

```bash
google-oauth2|23C94879435023998476321
twitter|34B23492010786950049439
auth0|09C3764109863877665210
```

They are strings with the identity provider followed by a pipe `|` and then a string of alphanumeric characters. In order to display the user's IdP in a friendly way, we'll `split()` on the pipe and then treat the IdP to make it more readable, if necessary.

Finally, we'll unsubscribe from our API observable in the `ngOnDestroy()` method.

### My RSVPs Component Template

Open the `my-rsvps.component.html` template file:

{% highlight html %}
{% raw %}
<!-- src/app/pages/my-rsvps/my-rsvps.component.html -->
<h1 class="text-center">{{pageTitle}}</h1>
<p class="lead" *ngIf="auth.loggedIn">
  Hello, <strong [innerHTML]="auth.userProfile.name"></strong>! You logged in with {{userIdp}}.
  <ng-template [ngIf]="auth.isAdmin">
    You may <a routerLink="/admin">create and administer events</a>.
  </ng-template>
</p>

<app-loading *ngIf="loading"></app-loading>

<ng-template [ngIf]="utils.isLoaded(loading)">
  <ng-template [ngIf]="eventList">
    <!-- Event list retrieved but no RSVPs yet -->
    <p *ngIf="!eventList.length" class="lead">
      You have not RSVPed to any events yet. Check out the <a routerLink="/">homepage</a> to see a list of upcoming events.
    </p>

    <ng-template [ngIf]="eventList.length">
      <p class="lead">You have <strong>RSVPed</strong> for the following upcoming events:</p>

      <!-- Events listing -->
      <div class="list-group">
        <a
          *ngFor="let event of fs.orderByDate(eventList, 'startDatetime')"
          [routerLink]="['/event', event._id]"
          [queryParams]="{tab: 'rsvp'}"
          class="list-group-item list-group-item-action flex-column align-items-start">
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1" [innerHTML]="event.title"></h5>
            <small>{{utils.eventDates(event.startDatetime, event.endDatetime)}}</small>
          </div>
          <small class="mb-1">Click to view or update this RSVP</small>
        </a>
      </div>
    </ng-template>
  </ng-template>

  <!-- Error loading events -->
  <p *ngIf="error" class="alert alert-danger">
    <strong>Oops!</strong> There was an error getting your RSVP data.
  </p>
</ng-template>
{% endraw %}
{% endhighlight %}

We'll ensure the user is logged in, welcome them by name, and display the IdP they logged in with. If the user has admin privileges, we'll show a message with a link to the Admin page where they can create and administer events.

We'll then check whether data has been loaded from the API. If the user hasn't RSVPed to any events yet, we'll show a message letting them know to check out the events listed on the homepage.

If events are present, we'll show a listing with titles, dates, and links to each event's RSVP tab. This way the user can easily view or update their RSVP.

Last, we'll show an error if there was a problem retrieving data from the API.

The My RSVPs component should now look like this in the browser:

![Angular app - My RSVPs page component](https://cdn.auth0.com/blog/mean-series/my-rsvps.jpg)

### Update Header Component

We have a route for our My RSVPs component, but no links to it in the application. Let's add some in our `header.component.html`:

{% highlight html %}
{% raw %}
<!-- src/app/header/header.component.html -->
<header id="header" class="header">
  ...
      <span *ngIf="auth.loggedIn">
        <a routerLink="/my-rsvps">{{auth.userProfile?.name}}</a>
  ...     
  <nav id="nav" class="nav" role="navigation">
    <ul class="nav-list">
      ...
      <li>
        <a
          *ngIf="auth.loggedIn"
          routerLink="/my-rsvps"
          routerLinkActive="active">My RSVPs</a>
      </li>
      ...
    </ul>
  </nav>
...
{% endraw %}
{% endhighlight %}

We'll link the authenticated user's name to the `/my-rsvps` route. We'll also add a link in the navigation sidebar. This link should only appear if the user is logged in.

---

## <span id="renew-auth"></span>Angular: Renew Token with Auth0

You may have noticed throughout development that your access token periodically expires if the same session is left open for longer than two hours. This can result in unexpected loss of access to the API, or the UI still displaying elements that aren't actually accessible to unauthenticated users.

In order to prevent session disruption, we're going to implement automatic authentication renewal with Auth0. The [auth0.js library](https://auth0.com/docs/libraries/auth0js/v8) has a method for performing silent authentication to [acquire new tokens](https://auth0.com/docs/libraries/auth0js/v8#using-checksession-to-acquire-new-tokens).

> **Important Note:** If you are using [Auth0 social connections](https://manage.auth0.com/#/connections/social) in your app, please make sure that you have set the connections up to use your _own_ client app keys. If you're using Auth0 dev keys, token renewal will always return `login_required`. Each social connection's details has a link with explicit instructions on how to acquire your own key for the particular IdP.

Token renewal with silent authentication will _not_ reload our app or redirect users to the hosted Auth0 login page. The renewal will take place behind the scenes in an iframe, preventing disruption of the user experience.

### Update Auth Service to Support Token Renewal

Now we'll make updates to our `AuthService` to support scheduled, silent token renewal.

Open the `auth.service.ts` file and let's get started:

```typescript
// src/app/core/auth/auth.service.ts
...
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { mergeMap } from 'rxjs/operators';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/timer';

@Injectable()
export class AuthService {
  ...
  // Subscribe to token expiration stream
  refreshSub: Subscription;

  constructor(private router: Router) {
    // If authenticated, set local profile property,
    // admin status, update login status, schedule renewal.
    // If not authenticated but there are still items
    // in localStorage, log out.
    ...
    if (this.tokenValid) {
      ...
      this.scheduleRenewal();
    } else if ...
  }

  ...

  private _setSession(authResult, profile?) {
    // Set tokens and expiration in localStorage
    ...
    // If initial login, set profile and admin information
    if (profile) {
      localStorage.setItem('profile', JSON.stringify(profile));
      this.userProfile = profile;
      this.isAdmin = this._checkAdmin(profile);
      localStorage.setItem('isAdmin', this.isAdmin.toString());
    }
    // Update login status in loggedIn$ stream
    ...
    // Schedule access token renewal
    this.scheduleRenewal();
  }

  ...

  logout(noRedirect?: boolean) {
    ...
    // Unschedule access token renewal
    this.unscheduleRenewal();
    // Return to homepage
    if (noRedirect !== true) {
      this.router.navigate(['/']);
    }
  }

  ...

  renewToken() {
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
    const expiresIn$ = Observable.of(expiresAt).pipe(
      mergeMap(
        expires => {
          const now = Date.now();
          // Use timer to track delay until expiration
          // to run the refresh at the proper time
          return Observable.timer(Math.max(1, expires - now));
        }
      )
    );

    this.refreshSub = expiresIn$
      .subscribe(
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

First we'll import `Observable`, `Subscription` and to support creating an observable token expiration timer. We'll then need to import the `mergeMap` operator from RxJS along with `of` and `timer` observable methods.

We'll declare a new property for a subscription to a token expiration stream we'll create shortly. This property is called `refreshSub` and has a type of `Subscription`.

In the `constructor()` method, we already check to see if the user already has a valid token with `this.tokenValid`. This accounts for persistent login and can occur if the user leaves our app and then returns before their access token has expired. In this case, we also want to schedule a renewal of their access token. This will be implemented with a new `scheduleRenewal()` method, so let's call this function in the constructor.

Next, we'll update the `_setSession()` method. We'll make the `profile` argument optional by adding a question mark. We'll do this because we'll be calling this method when tokens have been successfully renewed with silent authentication, but the same user is logging in so we won't need to set all the profile information again. It will simply persist from the previous session. We can then wrap anything related to setting profile data in an `if` statement that checks to see if a `profile` argument has been passed to the method. We also need to call `scheduleRenewal()` to restart the expiration timer when a new token has been retrieved.

The `logout()` method will now support an optional argument: `noRedirect`. This way, we can call `logout()` _without_ being redirected back to the homepage. This is useful if our silent authentication encounters an error. In such a case, we want the app to clean up all existing authentication data before prompting the user to log in again. We'll check that the `noRedirect` parameter is not equal to `true` before redirecting.

Now we'll create three new methods to implement token renewal. The first method is `renewToken()`:

```typescript
  renewToken() {
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
```

This method uses [auth0.js to acquire new tokens](https://auth0.com/docs/libraries/auth0js/v8#using-checksession-to-acquire-new-tokens) using the `checkSession()` method on our existing `_auth0` web auth instance. This approach uses [`postMessage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) under the hood to implement cross-origin communication between our parent app and the silent authentication taking place in an iframe. On successful acquisition of a new access token, we'll call `_setSession()` to start a new session. If an error occurs, we'll execute `logout(true)` (without redirection) to quietly clear authentication data, then we'll prompt the user to log in again.

> **Note:** As written, the hosted login redirect will happen automatically without forewarning the user. Keep in mind that this _only_ occurs if silent authentication _fails_ for some reason. If you'd like to notify the user _before_ automatically prompting them to log in again or give them a choice to stay logged out and return to the homepage, you should do so here.

The next new method is `scheduleRenewal()`:

```typescript
  scheduleRenewal() {
    // If user isn't authenticated, do nothing
    if (!this.tokenValid) { return; }
    // Unsubscribe from previous expiration observable
    this.unscheduleRenewal();
    // Create and subscribe to expiration observable
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    const expiresIn$ = Observable.of(expiresAt).pipe(
      mergeMap(
        expires => {
          const now = Date.now();
          // Use timer to track delay until expiration
          // to run the refresh at the proper time
          return Observable.timer(Math.max(1, expires - now));
        }
      )
    );

    this.refreshSub = expiresIn$
      .subscribe(
        () => {
          this.renewToken();
          this.scheduleRenewal();
        }
      );
  }
```

If the user is authenticated, we'll do a cleanup check and then create an observable called `expiresIn$`. We'll use the [`mergeMap()` RxJS operator](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-mergeMap) to flatten the stream. We'll then utilize an [`Observable.timer()`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/timer.md) that produces a value (`0`) when the current access token expires.

Then we'll subscribe to the `expiresIn$` observable. As declared with our properties earlier, this subscription is called `refreshSub`. When the `0` value is produced indicating the token is expired, we'll call `renewToken()` and `scheduleRenewal()` to set the session and reset the timer with the fresh token's expiration countdown.

The final new method is `unscheduleRenewal()`:

```typescript
  unscheduleRenewal() {
    if (this.refreshSub) {
      this.refreshSub.unsubscribe();
    }
  }
```

This method simply checks for the existence of a `refreshSub` subscription and unsubscribes from it. The method is called on logout, or if we need to subscribe to a new token expiration observable (`expiresIn$`).

{% include tweet_quote.html quote_text="Using Auth0, we can silently renew JSON Web Tokens with ease." %}

### Update Auth0 Client Settings

In order to avoid getting a `403 Forbidden` error when silently renewing authentication, we need to make sure our Auth0 Client's allowed origin settings are updated.

Go to your [Auth0 Dashboard Clients](https://manage.auth0.com/#/clients/) section and select your app's Client. In the **Allowed Web Origins**, add `http://localhost:4200` and `http://localhost:8083` to the list. Save your changes. This enables both our Angular server and Node server domains to be used with [web message response mode](https://auth0.com/docs/protocols/oauth2#how-response-mode-works).

> **Note:** Recall that we are using the `loggedIn` property to track authentication state in templates (rather than `auth.tokenValid`). This is ideal because `loggedIn` is updated on the fly as the state changes. We also won't get a flash of a logged-out state during a successful token renewal.

### Test Token Expiration and Renewal

For testing, you can change the access token expiration time in your [Auth0 Dashboard APIs](https://manage.auth0.com/#/apis). Select the API you set up for this application. You can then change the **Token Expiration For Browser Flows (Seconds)** value. It is `7200` seconds by default (2 hours). For testing token renewal, you can change this value to something much shorter. Test it out with the setting at `20` seconds. If you open your browser's Network panel, your login should be persisted and you should see activity (a call to the `authorize` endpoint) every 20 seconds indicating successful silent token renewal.

<p align="center">
<img alt="Auth0 dashboard APIs change token expiration" src="https://cdn.auth0.com/blog/mean-series/auth0-dash-token-expiration.png">
</p>

> **Note:** Make sure to change the token expiration back once you're finished testing your renewal implementation.

## Aside: Securing Applications with Auth0

Are you building a [B2C](https://auth0.com/b2c-customer-identity-management), [B2B](https://auth0.com/b2b-enterprise-identity-management), or [B2E](https://auth0.com/b2e-identity-management-for-employees) tool? Auth0 can help you focus on what matters the most to you, the special features of your product. [Auth0](https://auth0.com/) can improve your product's security with state-of-the-art features like [passwordless](https://auth0.com/passwordless), [breached password surveillance](https://auth0.com/breached-passwords), and [multifactor authentication](https://auth0.com/multifactor-authentication).

[We offer a generous **free tier**](https://auth0.com/pricing) so you can get started with modern authentication.

---

## Summary

In Part 7 of our Real-World Angular Series, we've covered deleting events, listing events a user has RSVPed to, and silent renewal of authentication tokens. In the final part of the tutorial series, we'll cover NgModule refactoring, lazy loading, and production deployment with SSL.
