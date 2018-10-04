---
layout: post
title: "Real-World Angular Series - Part 3: Fetching and Displaying API Data"
description: "Build and deploy a real-world app with MongoDB, Express, Angular, and Node (MEAN): fetching, displaying, and filtering data."
date: 2017-07-05 8:30
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
- 2016-11-07-migrating-an-angular-1-app-to-angular-2-part-1

---

<div class="alert alert-danger alert-icon">
  <i class="icon-budicon-487"></i>
  <strong>WARNING: This series of articles uses Angular 5 and RxJS 5.</strong> Please be aware that code changes are necessary to use Angular 6 and RxJS 6 with this tutorial. We are in the process of upgrading the series to latest versions. In the meantime, you can <a href="https://update.angular.io/">follow the update instructions here</a> for more information. Thank you for your patience!
</div>

**TL;DR:** This 8-part tutorial series covers building and deploying a full-stack JavaScript application from the ground up with hosted [MongoDB](https://www.mongodb.com/), [Express](https://expressjs.com/), [Angular (v2+)](https://angular.io), and [Node.js](https://nodejs.org) (MEAN stack). The completed code is available in the [mean-rsvp-auth0 GitHub repo](https://github.com/auth0-blog/mean-rsvp-auth0/) and a deployed sample app is available at [https://rsvp.kmaida.net](https://rsvp.kmaida.net). **Part 3 of the tutorial series covers fetching data from MongoDB with a Node API and displaying and filtering it with Angular.**

---

## Real-World Angular Series

You can view all sections of the tutorial series here:

1. [Real-World Angular Series - Part 1: MEAN Setup & Angular Architecture](https://auth0.com/blog/real-world-angular-series-part-1)
2. [Real-World Angular Series - Part 2: Authentication and Data Modeling](https://auth0.com/blog/real-world-angular-series-part-2)
3. [Real-World Angular Series - Part 3: Fetching and Displaying API Data](https://auth0.com/blog/real-world-angular-series-part-3) (you are here!)
4. [Real-World Angular Series - Part 4: Access Management, Admin, and Detail Pages](https://auth0.com/blog/real-world-angular-series-part-4)
5. [Real-World Angular Series - Part 5: Animation and Template-Driven Forms](https://auth0.com/blog/real-world-angular-series-part-5)
6. [Real-World Angular Series - Part 6: Reactive Forms and Custom Validation](https://auth0.com/blog/real-world-angular-series-part-6)
7. [Real-World Angular Series - Part 7: Relational Data and Token Renewal](https://auth0.com/blog/real-world-angular-series-part-7)
8. [Real-World Angular Series - Part 8: Lazy Loading, Production Deployment, SSL](https://auth0.com/blog/real-world-angular-series-part-8)

---

## Part 3: Fetching and Displaying API Data

The [second part of this tutorial](https://auth0.com/blog/real-world-angular-series-part-2) covered authentication, authorization, feature planning, and data modeling.

The third installment in the series covers fetching data from MongoDB with a Node API and displaying and filtering the data with Angular.

1. <a href="#api-events" target="_self">API: Fetching Events</a>
2. <a href="#angular-api" target="_self">Angular: Fetching Events</a>
3. <a href="#angular-utility-service" target="_self">Angular: Create a Utility Service</a>
4. <a href="#angular-filterSort-service" target="_self">Angular: Create a Filter/Sort Service</a>
5. <a href="#angular-home-events" target="_self">Angular: Home Component Event List</a>

---

## <span id="api-events"></span>API: Fetching Events

Let's pick up right where we left off [last time](https://auth0.com/blog/real-world-angular-series-part-2). We have data in our database, so it's time to retrieve it with the API. We'll start by writing four endpoints that will get data from MongoDB:

* List of public events starting in the future
* List of all public and private events (admin access required)
* Event details (authentication required)
* List of RSVPs associated with an event (authentication required)

Open up the server `api.js` file and let's begin.

### GET Future Public Events

We'll start with an `/api/events` endpoint that retrieves all public events with a start date in the future from the `events` collection.

Recall that we already created and required our `Event` and `Rsvp` [mongoose schema](http://mongoosejs.com/docs/guide.html) in <a href="https://auth0.com/blog/real-world-angular-series-part-2#data-modeling">Part 2: Data Modeling</a>. We can now use those schema to execute [MongoDB collection methods](https://docs.mongodb.com/manual/reference/method/js-collection/) with [mongoose](http://mongoosejs.com/docs/queries.html).

Add the following code to the `API Routes` section of the `api.js` file:

```js
// server/api.js
...
/*
 |--------------------------------------
 | API Routes
 |--------------------------------------
 */

 const _eventListProjection = 'title startDatetime endDatetime viewPublic';

  // GET list of public events starting in the future
  app.get('/api/events', (req, res) => {
    Event.find({viewPublic: true, startDatetime: { $gte: new Date() }}, _eventListProjection, (err, events) => {
      let eventsArr = [];
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
  });

  ...
```

This endpoint does not require any authentication. We'll pass the `find()` query as `{viewPublic: true, startDatetime: { $gte: new Date() }` because we only want public events with a starting datetime [greater than or equal to](https://docs.mongodb.com/manual/reference/operator/query/gte/) now.

We also want to pass a [projection (see first example)](http://mongoosejs.com/docs/queries.html). Projections state which fields we want returned in the documents that match our query. If no projection is specified, all fields are returned. In our case, we don't need descriptions or locations in main event listings, so our projection will contain only the properties we _do_ want returned.

{% include tweet_quote.html quote_text="Projections can be used with mongoose to return specific MongoDB document properties." %}

In the callback, we'll handle errors and iterate over any results, pushing them to an array that will be returned. We want an empty array if there are no events, since a lack of event documents simply means none have been created yet. Pretty straightforward!

### GET All Public and Private Events

Next we'll create a similar endpoint that will return _all_ events: `/api/events/admin`. This time, we want authentication _and_ admin privileges before we'll send any data. We can implement this like so:

```js
// server/api.js
  ...
  // GET list of all events, public and private (admin only)
  app.get('/api/events/admin', jwtCheck, adminCheck, (req, res) => {
    Event.find({}, _eventListProjection, (err, events) => {
      let eventsArr = [];
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
  });

  ...
```

The code for this endpoint is very similar to the route fetching public events, but we'll include both the `jwtCheck` and `adminCheck` middleware. We won't add any parameters to the query object because we want to retrieve _all_ events in the database. We'll pass the same `_eventListProjection` to leave out locations and descriptions.

> **Note:** It's worthwhile to note that this endpoint is simply for admin display purposes. We want the admin to be able to see and interact with a _listing_ of public and private events. However, authenticated _users_ can still see private event details too, they just need to know the direct link and can't access them from a list.

### GET Event Details

Now we'll fetch an event by ID with an `/api/event/:id` endpoint:  

```js
// server/api.js
  ...
  // GET event by event ID
  app.get('/api/event/:id', jwtCheck, (req, res) => {
    Event.findById(req.params.id, (err, event) => {
      if (err) {
        return res.status(500).send({message: err.message});
      }
      if (!event) {
        return res.status(400).send({message: 'Event not found.'});
      }
      res.send(event);
    });
  });

  ...
```

This authorized endpoint needs to have a parameter passed to it when called. The parameter should be the event ID so we can use the `findById()` method. If no event is found matching the ID we passed, we'll send a bad request error. Otherwise, we'll return the event.

### GET RSVPs for an Event

Finally, we'll retrieve a list of all the RSVPs for a specific event: `/api/event/:eventId/rsvps`. RSVPs in our app are transparent to all authenticated users; many people want to know if their friends are attending the same events they are.

```js
// server/api.js
  ...
  // GET RSVPs by event ID
  app.get('/api/event/:eventId/rsvps', jwtCheck, (req, res) => {
    Rsvp.find({eventId: req.params.eventId}, (err, rsvps) => {
      let rsvpsArr = [];
      if (err) {
        return res.status(500).send({message: err.message});
      }
      if (rsvps) {
        rsvps.forEach(rsvp => {
          rsvpsArr.push(rsvp);
        });
      }
      res.send(rsvpsArr);
    });
  });

  ...
```

We'll find RSVPs by matching the `eventId`, which will be passed with the request as a parameter. We want to return an array whether or not there are RSVPs, since a lack of RSVPs does not indicate an error.

---

## <span id="angular-api"></span>Angular: Fetching Events

Now that we have API routes for fetching events, we need to access these routes in our Angular app so we can _display_ events data.

### Add HTTP Client Module to App Module

First we'll need to import the `HttpClientModule` in our App module. Open the `app.module.ts` file:

```typescript
...
import { HttpClientModule } from '@angular/common/http';
...
@NgModule({
  ...
  imports: [
    ...,
    HttpClientModule
  ],
  ...
})
...
```

Import `HttpClientModule` and include it in the `imports` array of the NgModule.

### Create API Service

Now we'll create an API service. Let's generate the service now:

```bash
$ ng g service core/api
```

This command creates a file called `api.service.ts` in the `src/app/core` folder. Open the service and add the following code:

```typescript
// src/app/core/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './../auth/auth.service';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import 'rxjs/add/observable/throw';
import { ENV } from './env.config';
import { EventModel } from './models/event.model';
import { RsvpModel } from './models/rsvp.model';

@Injectable()
export class ApiService {

  constructor(
    private http: HttpClient,
    private auth: AuthService) { }

  private get _authHeader(): string {
    return `Bearer ${localStorage.getItem('access_token')}`;
  }

  // GET list of public, future events
  getEvents$(): Observable<EventModel[]> {
    return this.http
      .get(`${ENV.BASE_API}events`)
      .pipe(
        catchError((error) => this._handleError(error))
      );
  }

  // GET all events - private and public (admin only)
  getAdminEvents$(): Observable<EventModel[]> {
    return this.http
      .get(`${ENV.BASE_API}events/admin`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .pipe(
        catchError((error) => this._handleError(error))
      );
  }

  // GET an event by ID (login required)
  getEventById$(id: string): Observable<EventModel> {
    return this.http
      .get(`${ENV.BASE_API}event/${id}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .pipe(
        catchError((error) => this._handleError(error))
      );
  }

  // GET RSVPs by event ID (login required)
  getRsvpsByEventId$(eventId: string): Observable<RsvpModel[]> {
    return this.http
      .get(`${ENV.BASE_API}event/${eventId}/rsvps`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .pipe(
        catchError((error) => this._handleError(error))
      );
  }

  private _handleError(err: HttpErrorResponse | any): Observable<any> {
    const errorMsg = err.message || 'Error: Unable to complete request.';
    if (err.message && err.message.indexOf('No JWT present') > -1) {
      this.auth.login();
    }
    return Observable.throw(errorMsg);
  }

}
```

We'll need to make unauthenticated _and_ authenticated requests, so we'll import `HttpClient` and `HttpHeaders` (to add the `Authorization` header with access token) along with `HttpErrorResponse`. We also need `AuthService` to prompt login if no JWT is found when attempting to make an authenticated request. We'll create streams with our API calls so we'll import `Observable`, as well as the pipeable `catchError` operator and the `throw` observable method from RxJS. We need `ENV` from our environment config to get the appropriate API URIs. Finally, in order to declare the types for our event streams, we need the models (`EventModel` and `RsvpModel`) we created earlier.

Once `HttpClient` and `AuthService` are added to the constructor, we can use the HTTP methods to create observables of API data. We expect to receive streams of type `EventModel[]` (an array of events) for our two event list endpoints, a single `EventModel` when retrieving event details by ID, and `RsvpModel[]` when retrieving all RSVPs for an event.

In order to make authenticated requests, we'll need to set an `Authorization` header using the access token stored in local storage from the authentication service we created in <a href="https://auth0.com/blog/real-world-angular-series-part-2#angular-auth">Angular: Basic Authentication</a> in Part 2. We'll create an accessor method called `_authHeader` to return the necessary `Authorization` value with the currently stored access token. The token may change if authentication is silently renewed _during_ a session (we'll implement silent token renewal much later), so we'll fetch it from local storage on each request to ensure its validity.

If we need to pass parameters to the request, such as with the `getEventById$(id)` and `getRsvpsByEventId$(eventId)` methods, we'll specify the arguments when calling the endpoint from our components. Our `HttpClient` methods (e.g., `get()`, `post()`, etc.) accept a parameter that uses an instance of `HttpHeaders().set()` to add authorization to that request. You can read more about this [in the Angular Http Docs here](https://angular.io/guide/http).

> **Note:** `HttpClient` is new as of Angular v4.3. If you are using a previous version of Angular, you should either upgrade or continue to use `Http` as per earlier documentation.

Finally, we'll handle errors. A successful API call returns the response as the body (in our case, this returns JSON). This does not require any mapping on our end as of Angular v4.3. A failed call checks the error message and prompts a fresh login if necessary, canceling the observable and producing an error if something else went wrong.

### Provide API Service in App Module

We want our API service to be available throughout our app, so let's provide it in our `app.module.ts`:

```typescript
// src/app/app.module.ts
...
import { ApiService } from './core/api.service';
...
@NgModule({
  ...
  providers: [
    ...,
    ApiService
  ],
  ...
})
...
```

We can now import the service in any of our components to use its methods.

### Create a Loading Component

Since we'll be making asynchronous API calls, it's ideal to also have a loading state. Alternatively, we could use [route resolve](https://angular.io/api/router/Resolve) to prevent routes from loading until the necessary API data has been returned, but this can give an app the appearance of sluggishness while navigating. Instead, we'll show a loading icon with a very simple component.

Generate the loading component like so:

```bash
$ ng g component core/loading --is --it --flat
```

We want this to be a single-file component, so we'll set a few [options with the Angular CLI](https://github.com/angular/angular-cli/wiki/generate-component#options):

* `--is`: alias for `--inline-styles`
* `--it`: alias for `--inline-template`
* `--flat`: do not generate a containing directory

Now let's grab a suitable loading image. You easily can make your own at [loading.io](https://loading.io/), or you can download this one:

<p align="center">
<a href="https://cdn.auth0.com/blog/mean-series/loading.svg" style="border-bottom: 0 none;">
<img alt="svg loading icon" src="https://cdn.auth0.com/blog/mean-series/loading.svg">
</a>
</p>

We'll create an `images` directory inside our `src/assets` folder and place the loading icon there.

Then we'll open our `loading.component.ts` and add the markup and a few simple styles:

```typescript
// src/app/core/loading.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  template: `
    <img src="/assets/images/loading.svg">
  `,
  styles: [`
    :host {
      display: block;
    }
    img {
      display: block;
      margin: 20px auto;
      width: 50px;
    }
  `]
})
export class LoadingComponent {
}
```

We can remove the `OnInit` functionality and the `constructor` function. The template is very simple: just the host element with an image. We can style the host element using the [special selector `:host`](https://angular.io/guide/component-styles#host). (The _host_ element is the component's custom element, `<app-loading>` in this case.)

{% include tweet_quote.html quote_text="Angular CLI supports scaffolding components in a variety of ways using flags." %}

### Add Loading Component to Callback Component

Let's replace the `Loading...` text in our callback component with our new loading component. Open the `callback.component.html` file and replace its contents with the following:

{% highlight html %}
<!-- src/app/pages/callback/callback.component.html -->
<app-loading></app-loading>
{% endhighlight %}

Now we'll see the spinner after the login redirect instead of plain text. We'll also use the loading component when making API calls across other components.

---

## <span id="angular-utility-service"></span>Angular: Create a Utility Service

Before we start building out our components, let's make a utility service that we can build on throughout development.

Run the following command to generate the boilerplate:

```bash
$ ng g service core/utils
```

We'll begin using this service to add an `isLoaded()` utility. Then we'll create methods to manage the display of event dates. Each event has a start datetime and an end datetime. Start and end dates for a single event may be different days _or_ the same day. We want a way to collapse same-day events into one date when displaying them in the UI. We also don't need to show times on the main listings, only on detail pages. Finally, we'll want a way to determine if an event already happened and is now in the past.

We'll import and take advantage of [Angular's built-in `DatePipe`](https://angular.io/api/common/DatePipe) to help us craft some helper methods:

```typescript
// src/app/core/utils.service.ts
import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

@Injectable()
export class UtilsService {

  constructor(private datePipe: DatePipe) { }

  isLoaded(loading: boolean): boolean {
    return loading === false;
  }

  eventDates(start, end): string {
    // Display single-day events as "Jan 7, 2018"
    // Display multi-day events as "Aug 12, 2017 - Aug 13, 2017"
    const startDate = this.datePipe.transform(start, 'mediumDate');
    const endDate = this.datePipe.transform(end, 'mediumDate');

    if (startDate === endDate) {
      return startDate;
    } else {
      return `${startDate} - ${endDate}`;
    }
  }

  eventDatesTimes(start, end): string {
    // Display single-day events as "1/7/2018, 5:30 PM - 7:30 PM"
    // Display multi-day events as "8/12/2017, 8:00 PM - 8/13/2017, 10:00 AM"
    const _shortDate = 'M/d/yyyy';
    const startDate = this.datePipe.transform(start, _shortDate);
    const startTime = this.datePipe.transform(start, 'shortTime');
    const endDate = this.datePipe.transform(end, _shortDate);
    const endTime = this.datePipe.transform(end, 'shortTime');

    if (startDate === endDate) {
      return `${startDate}, ${startTime} - ${endTime}`;
    } else {
      return `${startDate}, ${startTime} - ${endDate}, ${endTime}`;
    }
  }

  eventPast(eventEnd): boolean {
    // Check if event has already ended
    const now = new Date();
    const then = new Date(eventEnd.toString());
    return now >= then;
  }

}
```

First we need to import the `DatePipe` from `@angular/common`. We'll add it to the constructor function's parameters.

> **Note:** We also need to _provide_ `DatePipe` in our `app.module.ts` if we want to be able to use it here. We'll add it when we provide our `UtilsService`.

The `isLoaded()` method uses an expression to check if the `loading` argument strictly evaluates to `false`. We'll be using a `loading` property in each component to track the state of API calls. This lets us know if we've received some kind of response from the API endpoint, since `loading` would be `undefined` otherwise. This helps ensure that we don't reveal the wrong UI state in our templates.

The `eventDates()` method accepts start and end dates, then uses the date pipe to transform the dates into user-friendly strings. If the start and end dates are the same, only one date is returned. If they're different, the dates are returned as a range.

The `eventDatesTimes()` method does something very similar, but with times as well.

Lastly, the `eventPast()` method accepts an `eventEnd` parameter and compares it to the current datetime, outputting a boolean that informs us if the event has already ended.

### Provide Date Pipe and Utility Service in App Module

We can now import and provide the date pipe and our utility service in the app module. Open the `app.module.ts` file and make the following updates:

```typescript
// src/app/app.module.ts
...
import { DatePipe } from '@angular/common';
import { UtilsService } from './core/utils.service';
...
@NgModule({
  ...,
  providers: [
    ...,
    DatePipe,
    UtilsService
  ],
  ...
})
...
```

We're now ready to use our new utilities in components. We'll add more methods to this handy service as we need them throughout development.

---

## <span id="angular-filterSort-service"></span>Angular: Create a Filter/Sort Service

Our app is going to need several different ways to organize arrays of data. In AngularJS, we would have used built-in filters for this, such as `filter` and `orderBy`. Angular (v2+) uses [pipes](https://angular.io/guide/pipes) to transform data, but no longer provides out-of-the-box pipes for filtering or sorting [for reasons cited here](https://angular.io/guide/pipes#appendix-no-filterpipe-or-orderbypipe).

Due to the performance and minification impacts of this choice, we will _not_ create custom pipes to implement filtering or sorting functionality. This would simply re-introduce the same problems the Angular team was attempting to solve by removing these filters. Instead, the appropriate approach is to use _services_.

Throughout the development of our app, we'll add additional methods for searching, filtering, and sorting. For now, we'll start with three: searching (`search()` and `noSearchResults()`) and sorting by date (`orderByDate()`).

Run the following command to generate a service with the Angular CLI:

```bash
$ ng g service core/filter-sort
```

Open the new `filter-sort.service.ts` file and add:

```typescript
// src/app/core/filter-sort.service.ts
import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

@Injectable()
export class FilterSortService {

  constructor(private datePipe: DatePipe) { }

  private _objArrayCheck(array: any[]): boolean {
    // Checks if the first item in the array is an object
    // (assumes same-shape for all array items)
    // Necessary because some arrays passed in may have
    // models that don't match {[key: string]: any}[]
    // This check prevents uncaught reference errors
    const item0 = array[0];
    const check = !!(array.length && item0 !== null && Object.prototype.toString.call(item0) === '[object Object]');
    return check;
  }

  search(array: any[], query: string, excludeProps?: string|string[], dateFormat?: string) {
    // Match query to strings and Date objects / ISO UTC strings
    // Optionally exclude properties from being searched
    // If matching dates, can optionally pass in date format string
    if (!query || !this._objArrayCheck(array)) {
      return array;
    }
    const lQuery = query.toLowerCase();
    const isoDateRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/; // ISO UTC
    const dateF = dateFormat ? dateFormat : 'medium';
    const filteredArray = array.filter(item => {
      for (const key in item) {
        if (item.hasOwnProperty(key)) {
          if (!excludeProps || excludeProps.indexOf(key) === -1) {
            const thisVal = item[key];
            if (
              // Value is a string and NOT a UTC date
              typeof thisVal === 'string' &&
              !thisVal.match(isoDateRegex) &&
              thisVal.toLowerCase().indexOf(lQuery) !== -1
            ) {
              return true;
            } else if (
              // Value is a Date object or UTC string
              (thisVal instanceof Date || thisVal.toString().match(isoDateRegex)) &&
              // https://angular.io/api/common/DatePipe
              // Matching date format string passed in as param (or default to 'medium')
              this.datePipe.transform(thisVal, dateF).toLowerCase().indexOf(lQuery) !== -1
            ) {
              return true;
            }
          }
        }
      }
    });
    return filteredArray;
  }

  noSearchResults(arr: any[], query: string): boolean {
    // Check if array searched by query returned any results
    return !!(!arr.length && query);
  }

  orderByDate(array: any[], prop: string, reverse?: boolean) {
    // Order an array of objects by a date property
    // Default: ascending (1992->2017 | Jan->Dec)
    if (!prop || !this._objArrayCheck(array)) {
      return array;
    }
    const sortedArray = array.sort((a, b) => {
      const dateA = new Date(a[prop]).getTime();
      const dateB = new Date(b[prop]).getTime();
      return !reverse ? dateA - dateB : dateB - dateA;
    });
    return sortedArray;
  }

}
```

First we need to import the `DatePipe` from `@angular/common`. We'll add it to the constructor function's parameters.

> **Note:** We already _provided_ `DatePipe` in our `app.module.ts` when we implemented our `UtilsService`.

Then we'll create a private `_objArrayCheck()` method to ensure that the array we're trying to search or sort contains objects. If it doesn't, uncaught reference errors will be produced, so we'd like a way to prevent this.

The `search()` method accepts the array of objects to be filtered, a `query` to search for, any optional properties we want to _exclude_ from searching (either a single property string or an array of properties), and optionally, a date format string.

The `dateFormat` should be one of the formats from the [Angular DatePipe](https://angular.io/api/common/DatePipe). This allows users to search for dates that are much less readable in the raw data. The developer can determine which format they want to be able to query. For example, if UTC date strings or JavaScript Date objects are transformed, the user can query for `Jan` and receive results with a value that is actually `2017-01-07T15:00:00.000Z` in the data.

> **Note:** It's advisable to match the `dateFormat` to any date pipe used in the _display_ of the data being searched. That way, users can see the way dates are displayed in your listing and this can inform the way they structure their query.

If the query is falsey, we'll return the unfiltered array. Otherwise, we'll set the query to lowercase, since our search should be case-insensitive (we'll do the same to the values we're querying). Since UTC dates are recognized as strings and not Dates in JavaScript, we'll use a regular expression to differentiate them from other strings. If no `dateFormat` parameter is passed in, we'll default to `medium` (e.g., `Sep 3, 2010, 12:05:08 PM` for US).

Next, we'll filter the array using the [`filter()` array method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter?v=example). We'll iterate over each property in each object in the array, first making sure that the object contains the property with the [`hasOwnProperty()` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty). If the key doesn't match anything passed in `excludeProps`, we'll check the value for matches to the query.

This is done differently for various value types. The search handles strings, JavaScript Date objects, and UTC strings. If we want to ensure that the search doesn't query certain properties, we'll make sure to pass them in as `excludedProps` when calling the method in our components.

> **Note:** We won't search properties with values that are any other types because our RSVP app doesn't need this. If you'd like to see a more robust implementation that handles strings, numbers, booleans, and dates, please check out [this filter-sort service Gist on GitHub](https://gist.github.com/kmaida/49dadc4c6c44116727ee859e21a32a46#file-filter-sort-service-ts).

The `noSearchResults()` method simply accepts an array and a query and returns `true` if the array is empty and a query is present.

Our `orderByDate()` method accepts an array of objects, the property containing the date value we want to sort by, and an optional `reverse` argument to change the sort order from ascending to descending.

If no property is passed, the array is returned unsorted.

> **Note:** As written, this method expects an array of _objects_ because this is how our data is structured in the RSVP app. An array of dates will not be sorted. You can easily update this method to support more robust array sorting if needed for other apps.

We can then use the [`sort()` array method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort?v=example) to re-order the array by date timestamp.

### Provide FilterSort Service in App Module

Now we'll import and provide the `FilterSortService` in the app module. Open the `app.module.ts` file and make the following updates:

```typescript
// src/app/app.module.ts
...
import { FilterSortService } from './core/filter-sort.service';
...
@NgModule({
  ...,
  providers: [
    ...,
    FilterSortService
  ],
  ...
})
...
```

We can now search as well as sort our event arrays by date in our components.

---

## <span id="angular-home-events"></span>Angular: Home Component Event List

Our components should get and display lists of events. We've already created the API endpoints to return this data and implemented an API service to fetch it. Now we need to subscribe to and display it in our components.

### Add Forms Module to App Module

The first thing we'll need to do is add the `FormsModule` to our App module to allow us to use [NgModel](https://angular.io/api/forms/NgModel) in our templates for the search form field. Open the `app.module.ts` file:

```typescript
// src/app/app.module.ts
...
import { FormsModule } from '@angular/forms';
...
@NgModule({
  ...,
  imports: [
    ...,
    FormsModule
  ],
  ...
})
...
```

Import `FormsModule` and add it to the `imports` array in the NgModule.

### Show Public Events in Home Component

Let's update our Home component to show the public upcoming events list. Open `home.component.ts`:

```typescript
// src/app/pages/home/home.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ApiService } from './../../core/api.service';
import { UtilsService } from './../../core/utils.service';
import { FilterSortService } from './../../core/filter-sort.service';
import { Subscription } from 'rxjs/Subscription';
import { EventModel } from './../../core/models/event.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  pageTitle = 'Events';
  eventListSub: Subscription;
  eventList: EventModel[];
  filteredEvents: EventModel[];
  loading: boolean;
  error: boolean;
  query: '';

  constructor(
    private title: Title,
    public utils: UtilsService,
    private api: ApiService,
    public fs: FilterSortService) { }

  ngOnInit() {
    this.title.setTitle(this.pageTitle);
    this._getEventList();
  }

  private _getEventList() {
    this.loading = true;
    // Get future, public events
    this.eventListSub = this.api
      .getEvents$()
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
    this.eventListSub.unsubscribe();
  }

}
```

When we use subscriptions in our components, we should always take care to unsubscribe from them in the [`OnDestroy` lifecycle hook](https://angular.io/guide/lifecycle-hooks#ondestroy), so we'll import `OnDestroy` and ensure that our `HomeComponent` class `implements` it and also has an `ngOnDestroy()` method.

We'll also import our API, utilities, and filter/sort services, as well as `Subscription` and the `EventModel`. We'll change the `pageTitle` to `Events` and declare properties for the event list API call subscription, event list results, and filtered events (for search results), which should have a type matching an array of `EventModel`s. In order to handle loading state and errors, we'll need a `loading` property and an `error` property to inform our UI what to display. Finally, we need a member to store our search `query`.

The `eventListSub` subscription is called in our `ngOnInit()` lifecycle hook using a private `_getEventList()` method. In this method, we'll set `loading` to `true` while we make the API call. Then we'll subscribe to the `api.getEvents$()` observable from our API service. When we receive items in the stream, we'll use that response to set the local `eventList` property and the initial `filteredEvents`. We'll also set `loading` to `false` and handle errors.

The `searchEvents()` method calls the `search()` method from our filter/sort service and passes the appropriate parameters to it. We don't want the search to check the event `_id` so we'll pass that as `excludeProps`. Our events are going to be displayed in the template with the `mediumDate` date format, so we'll also pass that to the `search()` method.

We want to be able to reset the query with a button in the template, so the `resetQuery()` method sets the `query` property to an empty string and resets the `filteredEvents` array back to the initial `eventList` acquired in the API call.

Finally, we'll unsubscribe from `eventListSub` in the `ngOnDestroy()` lifecycle method.

### Home Component Template

Now open the `home.component.html` template:

{% highlight html %}
{% raw %}
<!-- src/app/pages/home/home.component.html -->
<h1 class="text-center">{{pageTitle}}</h1>
<app-loading *ngIf="loading"></app-loading>

<ng-template [ngIf]="utils.isLoaded(loading)">
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
        <a
          *ngFor="let event of fs.orderByDate(filteredEvents, 'startDatetime')"
          [routerLink]="['/event', event._id]"
          class="list-group-item list-group-item-action flex-column align-items-start">
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1" [innerHTML]="event.title"></h5>
            <small>{{utils.eventDates(event.startDatetime, event.endDatetime)}}</small>
          </div>
        </a>
      </section>
    </ng-template>

    <!-- No upcoming public events available -->
    <p *ngIf="!eventList.length" class="alert alert-info">
      No upcoming public events available.
    </p>
  </ng-template>

  <!-- Error loading events -->
  <p *ngIf="error" class="alert alert-danger">
    <strong>Oops!</strong> There was an error retrieving event data.
  </p>

</ng-template>
{% endraw %}
{% endhighlight %}

In the template, we'll use the [structural directive NgIf](https://angular.io/guide/structural-directives#ngif-case-study) to dynamically load only the parts of the UI that should be revealed at a particular state of the component. The `<app-loading>` component shows if the `loading` property is `true`, and the event list or error should show if `loading` is `false` (but not `undefined`).

> **Note:** Sometimes we're using a custom element template directive `<ng-template [ngIf]>` and sometimes we're using the `*ngIf` attribute directive. The `<ng-template>` approach does _not_ create a container element in our markup, so we'll use this approach when we simply want `if` logic but no extra elements cluttering up our template. If we already have an element anyway, then we'll use the `*ngIf` attribute.

If event data was successfully retrieved and there _are_ events present in the event array, we want to show a search form and the event list, which can be filtered on the fly. The search input is two-way bound to the `query` using the [`[(ngModel)]` directive](https://angular.io/api/forms/NgModel). This means that changes to the `query` will be kept in sync whether they came from the UI or the class. We then have a button that can be used to `resetQuery()`.

If the user searches for a term that produces no results in the filtered array, we'll show a warning. We can check for search results by passing the `filteredEvents` and `query` to our filter/sort service's `noSearchResults()` method.

We'll use our `sortByDate()` method from the filter/sort service to display events ordered by their `startDatetime`. We'll iterate over the `filteredEvents` array with the [NgFor directive](https://angular.io/guide/structural-directives#inside-ngfor) to display the event title, location, and dates. We'll also link to each event's detail page using the [RouterLink directive](https://angular.io/api/router/RouterLink) and the event's `_id`. (We'll create this detail page a little later.)

If event data was retrieved but no events were returned in the array from the API, we'll show a message saying that there are no upcoming, public events available.

Last, if there was an error retrieving data from the API, we'll show a message. The console should also log the error message.

Our public events homepage should look something like this now:

![Angular RSVP homepage with events](https://cdn.auth0.com/blog/mean-series/home-events.jpg)

If we type in a search query that returns no matches, we'll see the following:

![Angular RSVP homepage with no search results](https://cdn.auth0.com/blog/mean-series/home-no-search-results.jpg)

If there are no events available in the database, the homepage should show this message:

![Angular RSVP homepage with no events](https://cdn.auth0.com/blog/mean-series/home-events-none.jpg)

When an error occurs fetching events data, the homepage should look like this:

![Angular RSVP homepage with events](https://cdn.auth0.com/blog/mean-series/home-error.jpg)

> **Note:** We can easily test API errors by stopping the Node API server in the terminal and reloading the Angular application in the browser. Without the API accessible, it will show an error.

## Aside: Securing Applications with Auth0

Are you building a [B2C](https://auth0.com/b2c-customer-identity-management), [B2B](https://auth0.com/b2b-enterprise-identity-management), or [B2E](https://auth0.com/b2e-identity-management-for-employees) tool? Auth0 can help you focus on what matters the most to you, the special features of your product. [Auth0](https://auth0.com/) can improve your product's security with state-of-the-art features like [passwordless](https://auth0.com/passwordless), [breached password surveillance](https://auth0.com/breached-passwords), and [multifactor authentication](https://auth0.com/multifactor-authentication).

[We offer a generous **free tier**](https://auth0.com/pricing) so you can get started with modern authentication.

---

## Summary

In Part 3 of our Real-World Angular Series, we've covered fetching data from the database with a Node API and manipulating and displaying the data in Angular. In the next part of the tutorial series, we'll tackle access management, displaying the admin events list, and developing an event details page with tabbed child components.
