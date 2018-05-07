---
layout: post
title: "Real-World Angular Series - Part 6: Reactive Forms and Custom Validation"
description: "Build and deploy a real-world app with MongoDB, Express, Angular, and Node (MEAN): reactive forms and custom validation."
date: 2017-07-13 8:30
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
- 2017-07-05-real-world-angular-series-part-3
- 2017-07-06-real-world-angular-series-part-4
- 2017-07-11-real-world-angular-series-part-5

---

<div class="alert alert-danger alert-icon">
  <i class="icon-budicon-487"></i>
  <strong>WARNING: This series of articles uses Angular 5 and RxJS 5.</strong> Please be aware that code changes are necessary to use Angular 6 and RxJS 6 with this tutorial. We are in the process of upgrading the series to latest versions. In the meantime, you can <a href="https://update.angular.io/">follow the update instructions here</a> for more information. Thank you for your patience!
</div>

**TL;DR:** This 8-part tutorial series covers building and deploying a full-stack JavaScript application from the ground up with hosted [MongoDB](https://www.mongodb.com/), [Express](https://expressjs.com/), [Angular (v2+)](https://angular.io), and [Node.js](https://nodejs.org) (MEAN stack). The completed code is available in the [mean-rsvp-auth0 GitHub repo](https://github.com/auth0-blog/mean-rsvp-auth0/) and a deployed sample app is available at [https://rsvp.kmaida.net](https://rsvp.kmaida.net).  **Part 6 of the tutorial series covers posting data with reactive forms and implementing custom validation.**

---

## Real-World Angular Series

You can view all sections of the tutorial series here:

1. [Real-World Angular Series - Part 1: MEAN Setup & Angular Architecture](https://auth0.com/blog/real-world-angular-series-part-1)
2. [Real-World Angular Series - Part 2: Authentication and Data Modeling](https://auth0.com/blog/real-world-angular-series-part-2)
3. [Real-World Angular Series - Part 3: Fetching and Displaying API Data](https://auth0.com/blog/real-world-angular-series-part-3)
4. [Real-World Angular Series - Part 4: Access Management, Admin, and Detail Pages](https://auth0.com/blog/real-world-angular-series-part-4)
5. [Real-World Angular Series - Part 5: Animation and Template-Driven Forms](https://auth0.com/blog/real-world-angular-series-part-5)
6. [Real-World Angular Series - Part 6: Reactive Forms and Custom Validation](https://auth0.com/blog/real-world-angular-series-part-6) (you are here!)
7. [Real-World Angular Series - Part 7: Relational Data and Token Renewal](https://auth0.com/blog/real-world-angular-series-part-7)
8. [Real-World Angular Series - Part 8: Lazy Loading, Production Deployment, SSL](https://auth0.com/blog/real-world-angular-series-part-8)

---

## Part 6: Reactive Forms and Custom Validation

The [fifth part of this tutorial](https://auth0.com/blog/real-world-angular-series-part-5) covered simple animation and using a template-driven form to add and update data.

The sixth installment in the series covers posting data with reactive forms and implementing custom validation in Angular.

1. <a href="#api-events" target="_self">API: Create, Update, and Delete Events</a>
2. <a href="#angular-events-api" target="_self">Angular: Add Event Admin Endpoints to API Service</a>
3. <a href="#angular-event-admin-pages" target="_self">Angular: Event Admin Components</a>
4. <a href="#angular-event-form-setup" target="_self">Angular: Reactive Event Form Setup</a>
5. <a href="#angular-custom-validation" target="_self">Angular: Custom Form Validation</a>
6. <a href="#angular-event-form" target="_self">Angular: Event Form</a>
7. <a href="#angular-group-validation" target="_self">Angular: Custom Form Group Validation</a>

---

## <span id="api-events"></span>API: Create, Update, and Delete Events

Let's pick up right where we left off [last time](https://auth0.com/blog/real-world-angular-series-part-5). Let's add the API endpoints our app's administrator needs in order to create, update, and delete events.

### POST New Event

In order to add a new event in our RSVP app, we'll create a new `/api/event/new` endpoint in the Node API.

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
  // POST a new event
  app.post('/api/event/new', jwtCheck, adminCheck, (req, res) => {
    Event.findOne({
      title: req.body.title,
      location: req.body.location,
      startDatetime: req.body.startDatetime}, (err, existingEvent) => {
      if (err) {
        return res.status(500).send({message: err.message});
      }
      if (existingEvent) {
        return res.status(409).send({message: 'You have already created an event with this title, location, and start date/time.'});
      }
      const event = new Event({
        title: req.body.title,
        location: req.body.location,
        startDatetime: req.body.startDatetime,
        endDatetime: req.body.endDatetime,
        description: req.body.description,
        viewPublic: req.body.viewPublic
      });
      event.save((err) => {
        if (err) {
          return res.status(500).send({message: err.message});
        }
        res.send(event);
      });
    });
  });

  ...
```

Only admin users should be able to add, update or delete events. This endpoint needs `jwtCheck` _and_ `adminCheck` middleware functions. Then we'll use the `find()` method to look for an event with the request's `title`, `location`, and `startDatetime`. If an event exists that matches all these fields, it's safe to say that we're trying to create a duplicate of an existing event and we should send an error.

If no `existingEvent` can be found, then we can create a `new Event()` with the data from the request body and `save()` it to MongoDB, handling errors if necessary and sending the new `event` data back in the response.

### PUT (Edit) Existing Event

Now add the following `PUT` route to edit events: `/api/event/:id`.

```js
// server/api.js
...
  // PUT (edit) an existing event
  app.put('/api/event/:id', jwtCheck, adminCheck, (req, res) => {
    Event.findById(req.params.id, (err, event) => {
      if (err) {
        return res.status(500).send({message: err.message});
      }
      if (!event) {
        return res.status(400).send({message: 'Event not found.'});
      }
      event.title = req.body.title;
      event.location = req.body.location;
      event.startDatetime = req.body.startDatetime;
      event.endDatetime = req.body.endDatetime;
      event.viewPublic = req.body.viewPublic;
      event.description = req.body.description;

      event.save(err => {
        if (err) {
          return res.status(500).send({message: err.message});
        }
        res.send(event);
      });
    });
  });

  ...
```

Again, we need the authentication and admin middleware to secure our route. We'll pass the event ID as a route parameter and use it to fetch the event with `findById()`. We'll handle errors, then update this event's properties with data sent with the `PUT` request. After updating, we'll `save()` our changes and handle any errors, sending the updated event data back in the response.

### DELETE an Event and its RSVPs

Our final events operation will be to delete events. In doing so, we'll also delete all the RSVPs associated with that event. There's no point in keeping them around if the event is gone.

Add the following `/api/event/:id` `DELETE` API route to the `api.js` file:

```js
// server/api.js
...
  // DELETE an event and all associated RSVPs
  app.delete('/api/event/:id', jwtCheck, adminCheck, (req, res) => {
    Event.findById(req.params.id, (err, event) => {
      if (err) {
        return res.status(500).send({message: err.message});
      }
      if (!event) {
        return res.status(400).send({message: 'Event not found.'});
      }
      Rsvp.find({eventId: req.params.id}, (err, rsvps) => {
        if (rsvps) {
          rsvps.forEach(rsvp => {
            rsvp.remove();
          });
        }
        event.remove(err => {
          if (err) {
            return res.status(500).send({message: err.message});
          }
          res.status(200).send({message: 'Event and RSVPs successfully deleted.'});
        });
      });
    });
  });

  ...
```

We'll pass the event ID as a route parameter, verify the user is authenticated and an admin, then `findById()` to fetch the event. If the event is found, we'll `find()` all RSVPs with an `eventId` property matching the event being deleted. We'll remove these associated RSVPs, and then remove the event and handle any errors. On successful deletion, a simple confirmation message is sent in the response.

---

## <span id="angular-events-api"></span>Angular: Add Event Admin Endpoints to API Service

We'll now add the corresponding methods to our `ApiService` to call the new API endpoints we just added.

Open the `api.service.ts` file and add these three methods:

```typescript
// src/app/core/api.service.ts
...
  // POST new event (admin only)
  postEvent$(event: EventModel): Observable<EventModel> {
    return this.http
      .post(`${ENV.BASE_API}event/new`, event, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .pipe(
        catchError((error) => this._handleError(error))
      );
  }

  // PUT existing event (admin only)
  editEvent$(id: string, event: EventModel): Observable<EventModel> {
    return this.http
      .put(`${ENV.BASE_API}event/${id}`, event, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .pipe(
        catchError((error) => this._handleError(error))
      );
  }

  // DELETE existing event and all associated RSVPs (admin only)
  deleteEvent$(id: string): Observable<any> {
    return this.http
      .delete(`${ENV.BASE_API}event/${id}`, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .pipe(
        catchError((error) => this._handleError(error))
      );
  }

  ...
```

The `POST` and `PUT` methods should be type `Observable<EventModel>`, since the stream will return the new or updated event. The `DELETE` method returns a JSON message, so we'll add a type annotation of `Observable<any>`. We'll then pass the appropriate event object and/or event ID as parameters to the call the API endpoints.

Now we're ready to make events admin API calls in our Angular application!

---

## <span id="angular-event-admin-pages"></span>Angular: Event Admin Components

We'll create three new components to support our event administration: a page to create events, a page to update or delete existing events, and an events form.

### Create Event Admin Components

Let's scaffold these components with the Angular CLI now:

```bash
$ ng g component pages/admin/create-event
$ ng g component pages/admin/update-event
$ ng g component pages/admin/event-form
```

> **Note:** Since only admins can create and update events, these components will live in the `src/app/pages/admin` folder.

### Add Event Admin Routes

Next, open the `app-routing.module.ts` file and add the following child routes like so:

```typescript
// src/app/app-routing.module.ts
...
import { CreateEventComponent } from './pages/admin/create-event/create-event.component';
import { UpdateEventComponent } from './pages/admin/update-event/update-event.component';

const routes: Routes = [
  ...,
  {
    path: 'admin',
    ...,
    children: [
      ...,
      {
        path: 'event/new',
        component: CreateEventComponent
      },
      {
        path: 'event/update/:id',
        component: UpdateEventComponent
      }
    ]
  },
  ...
```

We'll import the Create Event and Update Event components, then add them as children of the `admin` route. Their full paths will then be `/admin/event/new` and `/admin/event/update/:id`.

### Create Event Component

Our Create Event component is a simple container for the event form.

Open the `create-event.component.ts` file and add:

```typescript
// src/app/pages/admin/create-event/create-event.component.ts
...
import { Title } from '@angular/platform-browser';
...
export class CreateEventComponent implements OnInit {
  pageTitle = 'Create Event';

  constructor(private title: Title) { }

  ngOnInit() {
    this.title.setTitle(this.pageTitle);
  }

}
```

All we need to do in the class is set the title, which should feel quite familiar by now.

Now open the `create-event.component.html` template:

{% highlight html %}
{% raw %}
<!-- src/app/pages/admin/create-event/create-event.component.html -->
<h1 class="text-center">{{pageTitle}}</h1>

<app-event-form></app-event-form>
{% endraw %}
{% endhighlight %}

We'll set an `<h1>` title and then show the event form component.

### Update Event Component

We'll write some code for the Update Event component to get the appropriate event so we can pass it to the event form.

Open the `update-event.component.ts` and let's get started:

```typescript
// src/app/pages/admin/update-event/update-event.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from './../../../auth/auth.service';
import { ApiService } from './../../../core/api.service';
import { UtilsService } from './../../../core/utils.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { EventModel } from './../../../core/models/event.model';

@Component({
  selector: 'app-update-event',
  templateUrl: './update-event.component.html',
  styleUrls: ['./update-event.component.scss']
})
export class UpdateEventComponent implements OnInit, OnDestroy {
  pageTitle = 'Update Event';
  routeSub: Subscription;
  eventSub: Subscription;
  event: EventModel;
  loading: boolean;
  error: boolean;
  private _id: string;

  constructor(
    private route: ActivatedRoute,
    public auth: AuthService,
    private api: ApiService,
    public utils: UtilsService,
    private title: Title) { }

  ngOnInit() {
    this.title.setTitle(this.pageTitle);

    // Set event ID from route params and subscribe
    this.routeSub = this.route.params
      .subscribe(params => {
        this._id = params['id'];
        this._getEvent();
      });
  }

  private _getEvent() {
    this.loading = true;
    // GET event by ID
    this.eventSub = this.api
      .getEventById$(this._id)
      .subscribe(
        res => {
          this.event = res;
          this.loading = false;
        },
        err => {
          console.error(err);
          this.loading = false;
          this.error = true;
        }
      );
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.eventSub.unsubscribe();
  }

}
```

The Update Event component functions similarly to the Event component, using a route parameter to get the intended event ID. We'll import the usual for API subscriptions (`OnDestroy`, `ApiService`, `Subscription`, `EventModel`) and general component imports (`Title`, `AuthService`, `UtilsService`). We'll also need `ActivatedRoute` to get the event ID from the URL.

We'll subscribe to the `ActivatedRoute`'s `params` to get the event ID and set it as a local private property called `_id`. We can then use this ID to fetch the event from the API, managing the subscription the same way we have in previous components and unsubscribing in `ngOnDestroy()`.

Open the `update-event.component.html` template next and add the following:

{% highlight html %}
{% raw %}
<!-- src/app/pages/admin/update-event/update-event.component.html -->
<h1 class="text-center">{{pageTitle}}</h1>

<app-loading *ngIf="loading"></app-loading>

<ng-template [ngIf]="utils.isLoaded(loading)">
  <ng-template [ngIf]="event">
    <!-- Event form -->
    <app-event-form [event]="event"></app-event-form>
  </ng-template>

  <!-- Error loading event -->
  <p *ngIf="error" class="alert alert-danger">
    <strong>Error:</strong> Event data could not be retrieved. View <a routerLink="/admin" class="alert-link">Admin Events</a>.
  </p>
</ng-template>
{% endraw %}
{% endhighlight %}

If the event API call succeeded, we'll show the event form component, passing in the `[event]` data to prefill our edit form. If an error occurred, we'll show a message with a link back to the Admin page.

### Add Link to Header Component Template

Let's add a link to create a new event in the `header.component.html` template:

{% highlight html %}
<!-- src/app/header/header.component.html -->
...
      <li>
        <a
          *ngIf="auth.loggedIn && auth.isAdmin"
          routerLink="/admin/event/new"
          routerLinkActive="active">Create Event</a>
      </li>
...
{% endhighlight %}

Like the "Admin" link, the "Create Event" link should only show when the user is logged in and an admin.

---

## <span id="angular-event-form-setup"></span>Angular: Reactive Event Form Setup

We're now ready to start building our events form component. We used  a template-driven approach with our <a href="https://auth0.com/blog/real-world-angular-series-part-4#angular-rsvp-form">RSVP form</a>. The event form will be a _reactive_ form.

### Angular Reactive Forms

[Reactive forms](https://angular.io/guide/reactive-forms), or model-driven forms, build and implement form logic in the component class rather than the template. This enables direct control over creation and manipulation of form control objects with JavaScript. A tree of form controls is created in the class and then bound to native form elements in the template.

This approach gives us much more control over testing and validation. We can also execute dynamic logic whenever any value in the form has changed.

> **Note:** We won't cover testing in this tutorial series, but  you can learn more about it in this article and others like it: [Angular2 FormBuilder Unit Tests](https://medium.com/@paynoattn/angular2-formbuilder-unit-tests-9da5ef5dbbe5).

Reactive forms are synchronous. In addition, because the data model is generated in the component class, _all_ form controls are _always_ available. This differs from template-driven forms, which are asynchronous. Therefore, the controls in template-driven forms are not consistently available at all times.

Reactive forms yield lightweight templates, but can result in apparently complex component classes. The risk of indirection is higher for developers coming into a project. However, the gains include much more granular control, as well as the ability to implement robust, strongly customized validation—particularly when multiple form controls need to be validated as a group.

{% include tweet_quote.html quote_text="Angular reactive forms provide granular control and support robust custom validation." %}

### Event Form Requirements

Let's outline the requirements for our event form. This will help us plan our logic. It should also make it clear why a reactive approach is necessary. Our event form needs the following:

* Title field with simple validation
* Location field with simple validation
* A valid start date (e.g., `1/25/2018`) at least one day in the future
* A valid start time (e.g., `11:30 AM`)
* A valid end date in the future, later than or equal to the start date
* A valid end time, later than or equal to the start date + time
* Start / end dates and times should be able to be entered in any order while still validating appropriately with whatever information is currently available
* Option to make the event public or not
* Description field with simple max character validation

As you can see, the bulk of complex validation has to do with dates / times and comparing datetimes to _each other_ as well as the _current_ date. Implementing this kind of group validation would be incredibly difficult with a template-driven form.

However, reactive forms make this quite feasible. There are many moving parts involved though, so let's do a little bit of architectural planning as well. Here's what we'll need in order to implement our reactive form with group validation:

* `ReactiveFormsModule` in app module
* Regular expressions and strings-to-date function in `formUtils` factory to share between validators and component class
* Event form model (differs from existing API event model)
* Service providing validation configuration and messages for component class and template
* Date validator factory: correctly-formatted, valid date in the future
* Date range group validator factory: ensure end datetime is not before start datetime
* Build reactive form in component class, reacting to form changes to update validation errors
* Build form template

Let's get started!

### Import the Reactive Forms Module

The `ReactiveFormsModule` resides in `@angular/forms`, so all we need to do to add it to our project is open our `app.module.ts` file and make a couple small updates:

```typescript
// src/app/app.module.ts
...
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
...
@NgModule({
  ...,
  imports: [
    ...,
    ReactiveFormsModule
  ],
  ...
})
...
```

We'll import the `ReactiveFormsModule` and then add it to our NgModule's `imports` array. We can now take advantage of reactive forms in our components.

### Update Form Utilities Factory

Let's add the necessary regular expressions and strings-to-date function to our `formUtils.factory.ts`.

> **Note:** Why aren't we putting these in an event form _service_? It's because our validator functions won't be classes with constructor methods, but they also need to import and utilize these helpers. Therefore, a factory is the most straightforward solution.

```js
// src/app/core/forms/formUtils.factory.ts
...
// mm/dd/yyyy, m/d/yyyy
// https://regex101.com/r/7iSsmm/2
const DATE_REGEX = new RegExp(/^(\d{2}|\d)\/(\d{2}|\d)\/\d{4}$/);
// h:mm am/pm, hh:mm AM/PM
// https://regex101.com/r/j2Cfqd/1/
const TIME_REGEX = new RegExp(/^((1[0-2]|0?[1-9]):([0-5][0-9]) ([AaPp][Mm]))$/);

// Converts date + time strings to a Date object.
// Date and time parameters should have already
// been validated with DATE_REGEX and TIME_REGEX.
function stringsToDate(dateStr: string, timeStr: string) {
  if (!DATE_REGEX.test(dateStr) || !TIME_REGEX.test(timeStr)) {
    console.error('Cannot convert date/time to Date object.');
    return;
  }
  const date = new Date(dateStr);
  const timeArr = timeStr.split(/[\s:]+/); // https://regex101.com/r/H4dMvA/1
  let hour = parseInt(timeArr[0], 10);
  const min = parseInt(timeArr[1], 10);
  const pm = timeArr[2].toLowerCase() === 'pm';

  if (!pm && hour === 12) {
    hour = 0;
  }
  if (pm && hour < 12) {
    hour += 12;
  }
  date.setHours(hour);
  date.setMinutes(min);
  return date;
}

export { ..., DATE_REGEX, TIME_REGEX, stringsToDate };
```

The `TIME_REGEX` regular expression [matches date strings in the general format m/d/yyyy](https://regex101.com/r/7iSsmm/2). The `TIME_REGEX` regular expression [matches strings in the general format h:mm am/pm](https://regex101.com/r/j2Cfqd/1/).

> **Note:** Check out the links to see full explanations of these regular expressions and to enter your own test strings.

The `stringsToDate()` function accepts a `dateStr` string and `timeStr` string as parameters and returns a JavaScript `Date` in the user's local timezone. This function is needed because the user enters _strings_ in the event form, but we need to do _date_ comparisons for validation, as well as submit `startDatetime` and `endDatetime` as date objects.

When we call this function, we'll expect that the parameters have already been validated against the appropriate regular expressions. We'll do a quick check to make sure, log an error, and `return` just in case something went wrong.

Then we'll use the `dateStr` to create a new [JS date object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date). This date has no time set yet, so it will default to midnight. We'll need to use the `timeStr` to [set hours](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setHours) and [minutes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setMinutes). We can create an array from the `timeStr`, splitting [on colons and spaces](https://regex101.com/r/H4dMvA/1). This way, we can get hours, minutes, and AM/PM. Our array is all strings, so we'll use [`parseInt()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt) to cast the hours and minutes as numbers. AM/PM could be entered as uppercase _or_ lowercase, so we'll use the `toLowerCase()` string method and do a comparison to cast `pm` as a boolean.

The `setHours()` date method expects 24 hours (`0-24`), but we're working with a 12 hour string. We'll translate hours to the appropriate 24-hour time based on the `pm` boolean. Then we can `setHours()` and `setMinutes()` to create our full date object, which we'll return.

Finally, we need to `export` the new members we created so they can be imported by other files.

### Add Form Event Model

Our existing `EventModel` for sending and retrieving data from the API is _not_ exactly the same as the model we want for our event form. Recall that MongoDB stores `startDatetime` and `endDatetime` as dates. However, our form will have four separate fields with string values: `startDate`, `startTime`, `endDate`, and `endTime`. We'll use the `stringsToDate()` function we just created to convert these form control values to date objects before we _submit_ the form, but this means we need a different model for the form itself.

Open the `event.model.ts` file and make the following additions:

```typescript
// src/app/core/models/event.model.ts
class EventModel {
  ...
}

class FormEventModel {
  constructor(
    public title: string,
    public location: string,
    public startDate: string,
    public startTime: string,
    public endDate: string,
    public endTime: string,
    public viewPublic: boolean,
    public description?: string
  ) { }
}

export { EventModel, FormEventModel };
```

Instead of `export`ing the `EventModel` class directly, we'll move the `export` statement to the bottom. We'll also add a `FormEventModel` class. This differs from our `EventModel`: it has separate fields for start and end dates and times, all annotated with type `string`.

### Create Event Form Service

Now we'll create an event form service with the Angular CLI:

```bash
$ ng g service pages/admin/event-form/event-form
```

This scaffolds an `event-form.service.ts` file. Open it and add the following code:

```typescript
// src/app/pages/admin/event-form/event-form.service.ts
import { Injectable } from '@angular/core';

@Injectable()
export class EventFormService {
  validationMessages: any;
  // Set up errors object
  formErrors = {
    title: '',
    location: '',
    viewPublic: '',
    description: '',
    datesGroup: {
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
    }
  };
  // Min/maxlength validation
  textMin = 3;
  titleMax = 36;
  locMax = 200;
  dateMax = 10;
  timeMax = 8;
  descMax = 2000;
  // Formats
  dateFormat = 'm/d/yyyy';
  timeFormat = 'h:mm AM/PM';

  constructor() {
    this.validationMessages = {
      title: {
        required: `Title is <strong>required</strong>.`,
        minlength: `Title must be ${this.textMin} characters or more.`,
        maxlength: `Title must be ${this.titleMax} characters or less.`
      },
      location: {
        required: `Location is <strong>required</strong>.`,
        minlength: `Location must be ${this.textMin} characters or more.`,
        maxlength: `Location must be ${this.locMax} characters or less.`
      },
      startDate: {
        required: `Start date is <strong>required</strong>.`,
        maxlength: `Start date cannot be longer than ${this.dateMax} characters.`,
        pattern: `Start date must be in the format <strong>${this.dateFormat}</strong>.`,
        date: `Start date must be a <strong>valid date</strong> at least one day <strong>in the future</strong>.`
      },
      startTime: {
        required: `Start time is <strong>required</strong>.`,
        pattern: `Start time must be a <strong>valid time</strong> in the format <strong>${this.timeFormat}</strong>.`,
        maxlength: `Start time must be ${this.timeMax} characters or less.`
      },
      endDate: {
        required: `End date is <strong>required</strong>.`,
        maxlength: `End date cannot be longer than ${this.dateMax} characters.`,
        pattern: `End date must be in the format <strong>${this.dateFormat}</strong>.`,
        date: `End date must be a <strong>valid date</strong> at least one day <strong>in the future</strong>.`
      },
      endTime: {
        required: `End time is <strong>required</strong>.`,
        pattern: `End time must be a <strong>valid time</strong> in the format <strong>${this.timeFormat}</strong>.`,
        maxlength: `End time must be ${this.timeMax} characters or less.`
      },
      viewPublic: {
        required: `You must specify whether this event should be publicly listed.`
      },
      description: {
        maxlength: `Description must be ${this.descMax} characters or less.`
      }
    };
  }

}
```

We'll use an object to map our `validationMessages`. In our component class, we'll then update a `formErrors` object with the appropriate messages based on the results of validation. Let's also set up minimum and maximum field lengths. These will be used in the component class, in the template (for HTML5 validation), and in the validation error messages. We'll also create date and time format strings that can be used in the template as `placeholder` attributes and in the `validationMessages`.

After setting up the validation properties, we'll access these properties in the `constructor()` to set the `validationMessages` appropriately for each form control. Most of the validators are built-in (such as `required`, `pattern`, `minlength`, and `maxlength`). We'll create the _custom_ validator for `date` shortly. For now, we can set up a message indicating what this custom validator will check: that the date is valid and at least one day in the future.

---

## <span id="angular-custom-validation"></span>Angular: Custom Form Validation

Let's write some [custom validation](https://angular.io/docs/ts/latest/cookbook/form-validation.html#!#custom-validation) for our Event Form component. Custom validators are _functions_ of type `ValidatorFn`. A validator function returns another function which takes a form [control](https://angular.io/docs/ts/latest/api/forms/index/AbstractControl-class.html) as a parameter and either returns `null` if validation passes or shouldn't run yet, or an object with a key/value pair if validation fails. The returned object generally consists of the intended validator name and a boolean value of `true`, indicating that there _is_ an error, like this:

```js
// returned by validator for 'date' if value is invalid
{
  'date': true
}
```

> **Note:** You can check out the [Angular custom validation documentation](https://angular.io/guide/form-validation#custom-validation) for a simple custom validator example.

### Date Validator Requirements

We'll create a validator function that does the following:

* Validates that the string input reflects a _real_ date
* Validates that the date is in the future

Remember that our dates are going to be entered as strings like the following:

```text
5/25/2017
06/01/2017
```

Without relying on a third-party datepicker or [HTML5 date input elements that aren't widely supported by all browsers](http://caniuse.com/#feat=input-datetime), we want to be able to make sure the user can't enter something that _looks_ like a valid date but isn't, such as `2/31/2017`.

If we create a JS date based on this (`new Date('2/31/2017')`), we'll get a [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) object for March 3. This is a valid JavaScript date because of automatic conversion, but we _don't_ want to allow users to input things like `2/31/2017` and just assume they want the date converted. Therefore, simply using pattern validation and then creating a new JS date will not be sufficient for validating this field.

Fortunately, it's quite straightforward to construct the appropriate validation for what we want.

### Create Date Validator

Let's start by creating and exporting the validator function. Make a new file in the `src/app/core/forms` directory called `date.validator.ts`:

```typescript
// src/app/core/forms/date.validator.ts
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { DATE_REGEX } from './formUtils.factory';

export function dateValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    const dateStr = control.value;
    // First check for m/d/yyyy format
    // If pattern is wrong, don't validate yet
    if (!DATE_REGEX.test(dateStr)) {
      return null;
    }
    // Length of months (will update for leap years)
    const monthLengthArr = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
    // Object to return if date is invalid
    const invalidObj = { 'date': true };
    // Parse the date input to integers
    const dateArr = dateStr.split('/');
    const month = parseInt(dateArr[0], 10);
    const day = parseInt(dateArr[1], 10);
    const year = parseInt(dateArr[2], 10);
    // Today's date
    const now = new Date();

    // Validate year and month
    if (year < now.getFullYear() || year > 3000 || month === 0 || month > 12) {
      return invalidObj;
    }
    // Adjust for leap years
    if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
      monthLengthArr[1] = 29;
    }
    // Validate day
    if (!(day > 0 && day <= monthLengthArr[month - 1])) {
      return invalidObj;
    };
    // If date is properly formatted, check the date vs today to ensure future
    // This is done this way to account for new Date() shifting invalid
    // date strings. This way we know the string is a correct date first.
    const date = new Date(dateStr);
    if (date <= now) {
      return invalidObj;
    }
    return null;
  };
}
```

First we'll import the [`AbstractControl` class](https://angular.io/api/forms/AbstractControl) and `ValidatorFn` interface from `@angular/forms`. We'll also need the `DATE_REGEX` constant from our form utilities.

As mentioned above, the validator function returns another function which accesses the form `control`. This is how we'll get the input `value` that needs validation. We'll set a local `dateStr` constant to the `control.value`.

We'll use the [`test()` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test) to check if the `dateStr` matches the `DATE_REGEX`. If it doesn't, we should not proceed with validating the date string: it's not in the proper format yet. We'll return `null` and wait to validate until the value matches the pattern.

We'll set a `monthLengthArr` array with the number of days in each month, handling leap years later on. This lets us verify that the user hasn't entered an invalid day for any given month.

The `invalidObj` is what we'll return if validation fails. We'll also `split()` the `dateStr` on `'/'` to get an array containing the `month`, `day`, and `year`, which we'll parse as integers. We'll also create a new date representing `now` (today's date) for comparisons to ensure the form value is in the future.

Next we'll make sure the date has a valid year and month. If the year is less than `now`'s year, greater than `3000`, the month is `0`, or the month is greater than `12`, the date is invalid and we'll return the `invalidObj`.

Now we'll adjust for leap years and then validate the day. If the year is evenly divisible by `400` _or_ not evenly divisible by `100` but is evenly divisible by `4`, then it's a leap year. In this case, the number of days in February (`monthLengthArr[1]`) should be `29` instead of `28`. We can then validate that the inputted `day` is greater than `0` and less than or equal to the number of days in the specified `month`. If this is not true, we'll return the `invalidObj`.

If the code is still executing at this point, we can determine that the `dateStr` is a valid date. We can now create a JS date object (`date`) and compare it to `now`. If the inputted date is less than or equal to `now`, the date is in the past and we'll return the `invalidObj`. Otherwise, all validation has passed, so we'll return `null`.

We now have a `dateValidator` function that we can use in our reactive form to validate our date inputs!

> **Note:** In order to use custom validator functions with _template-driven_ forms, we would need to create a validation directive to attach the validator behavior to a form DOM element. You can read more about this in the [Angular custom validation documentation](https://angular.io/guide/form-validation#custom-validation). We don't need a directive to use the validator with a _reactive_ form because we'll associate the validator directly with the model rather than the template's input element.

---

## <span id="angular-event-form"></span>Angular: Event Form

We're now ready to start building our Event Form component.

> **Note:** We still need to create validation for comparing start and end dates and times as a group, but we'll address that after building the form.

### Event Form Class

Open the `event-form.component.ts` file and let's get started.

```typescript
// src/app/pages/admin/event-form/event-form.component.ts
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ApiService } from './../../../core/api.service';
import { EventModel, FormEventModel } from './../../../core/models/event.model';
import { DatePipe } from '@angular/common';
import { dateValidator } from './../../../core/forms/date.validator';
import { DATE_REGEX, TIME_REGEX, stringsToDate } from './../../../core/forms/formUtils.factory';
import { EventFormService } from './event-form.service';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
  providers: [ EventFormService ]
})
export class EventFormComponent implements OnInit, OnDestroy {
  @Input() event: EventModel;
  isEdit: boolean;
  // FormBuilder form
  eventForm: FormGroup;
  datesGroup: AbstractControl;
  // Model storing initial form values
  formEvent: FormEventModel;
  // Form validation and disabled logic
  formErrors: any;
  formChangeSub: Subscription;
  // Form submission
  submitEventObj: EventModel;
  submitEventSub: Subscription;
  error: boolean;
  submitting: boolean;
  submitBtnText: string;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private datePipe: DatePipe,
    public ef: EventFormService,
    private router: Router) { }

  ngOnInit() {
    this.formErrors = this.ef.formErrors;
    this.isEdit = !!this.event;
    this.submitBtnText = this.isEdit ? 'Update Event' : 'Create Event';
    // Set initial form data
    this.formEvent = this._setFormEvent();
    // Use FormBuilder to construct the form
    this._buildForm();
  }

  private _setFormEvent() {
    if (!this.isEdit) {
      // If creating a new event, create new
      // FormEventModel with default null data
      return new FormEventModel(null, null, null, null, null, null, null);
    } else {
      // If editing existing event, create new
      // FormEventModel from existing data
      // Transform datetimes:
      // https://angular.io/api/common/DatePipe
      // _shortDate: 1/7/2017
      // 'shortTime': 12:05 PM
      const _shortDate = 'M/d/yyyy';
      return new FormEventModel(
        this.event.title,
        this.event.location,
        this.datePipe.transform(this.event.startDatetime, _shortDate),
        this.datePipe.transform(this.event.startDatetime, 'shortTime'),
        this.datePipe.transform(this.event.endDatetime, _shortDate),
        this.datePipe.transform(this.event.endDatetime, 'shortTime'),
        this.event.viewPublic,
        this.event.description
      );
    }
  }

  private _buildForm() {
    this.eventForm = this.fb.group({
      title: [this.formEvent.title, [
        Validators.required,
        Validators.minLength(this.ef.textMin),
        Validators.maxLength(this.ef.titleMax)
      ]],
      location: [this.formEvent.location, [
        Validators.required,
        Validators.minLength(this.ef.textMin),
        Validators.maxLength(this.ef.locMax)
      ]],
      viewPublic: [this.formEvent.viewPublic,
        Validators.required
      ],
      description: [this.formEvent.description,
        Validators.maxLength(this.ef.descMax)
      ],
      datesGroup: this.fb.group({
        startDate: [this.formEvent.startDate, [
          Validators.required,
          Validators.maxLength(this.ef.dateMax),
          Validators.pattern(DATE_REGEX),
          dateValidator()
        ]],
        startTime: [this.formEvent.startTime, [
          Validators.required,
          Validators.maxLength(this.ef.timeMax),
          Validators.pattern(TIME_REGEX)
        ]],
        endDate: [this.formEvent.endDate, [
          Validators.required,
          Validators.maxLength(this.ef.dateMax),
          Validators.pattern(DATE_REGEX),
          dateValidator()
        ]],
        endTime: [this.formEvent.endTime, [
          Validators.required,
          Validators.maxLength(this.ef.timeMax),
          Validators.pattern(TIME_REGEX)
        ]]
      })
    });
    // Set local property to eventForm datesGroup control
    this.datesGroup = this.eventForm.get('datesGroup');

    // Subscribe to form value changes
    this.formChangeSub = this.eventForm
      .valueChanges
      .subscribe(data => this._onValueChanged());

    // If edit: mark fields dirty to trigger immediate
    // validation in case editing an event that is no
    // longer valid (for example, an event in the past)
    if (this.isEdit) {
      const _markDirty = group => {
        for (const i in group.controls) {
          if (group.controls.hasOwnProperty(i)) {
            group.controls[i].markAsDirty();
          }
        }
      };
      _markDirty(this.eventForm);
      _markDirty(this.datesGroup);
    }

    this._onValueChanged();
  }

  private _onValueChanged() {
    if (!this.eventForm) { return; }
    const _setErrMsgs = (control: AbstractControl, errorsObj: any, field: string) => {
      if (control && control.dirty && control.invalid) {
        const messages = this.ef.validationMessages[field];
        for (const key in control.errors) {
          if (control.errors.hasOwnProperty(key)) {
            errorsObj[field] += messages[key] + '<br>';
          }
        }
      }
    };

    // Check validation and set errors
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        if (field !== 'datesGroup') {
          // Set errors for fields not inside datesGroup
          // Clear previous error message (if any)
          this.formErrors[field] = '';
          _setErrMsgs(this.eventForm.get(field), this.formErrors, field);
        } else {
          // Set errors for fields inside datesGroup
          const datesGroupErrors = this.formErrors['datesGroup'];
          for (const dateField in datesGroupErrors) {
            if (datesGroupErrors.hasOwnProperty(dateField)) {
              // Clear previous error message (if any)
              datesGroupErrors[dateField] = '';
              _setErrMsgs(this.datesGroup.get(dateField), datesGroupErrors, dateField);
            }
          }
        }
      }
    }
  }

  private _getSubmitObj() {
    const startDate = this.datesGroup.get('startDate').value;
    const startTime = this.datesGroup.get('startTime').value;
    const endDate = this.datesGroup.get('endDate').value;
    const endTime = this.datesGroup.get('endTime').value;
    // Convert form startDate/startTime and endDate/endTime
    // to JS dates and populate a new EventModel for submission
    return new EventModel(
      this.eventForm.get('title').value,
      this.eventForm.get('location').value,
      stringsToDate(startDate, startTime),
      stringsToDate(endDate, endTime),
      this.eventForm.get('viewPublic').value,
      this.eventForm.get('description').value,
      this.event ? this.event._id : null
    );
  }

  onSubmit() {
    this.submitting = true;
    this.submitEventObj = this._getSubmitObj();

    if (!this.isEdit) {
      this.submitEventSub = this.api
        .postEvent$(this.submitEventObj)
        .subscribe(
          data => this._handleSubmitSuccess(data),
          err => this._handleSubmitError(err)
        );
    } else {
      this.submitEventSub = this.api
        .editEvent$(this.event._id, this.submitEventObj)
        .subscribe(
          data => this._handleSubmitSuccess(data),
          err => this._handleSubmitError(err)
        );
    }
  }

  private _handleSubmitSuccess(res) {
    this.error = false;
    this.submitting = false;
    // Redirect to event detail
    this.router.navigate(['/event', res._id]);
  }

  private _handleSubmitError(err) {
    console.error(err);
    this.submitting = false;
    this.error = true;
  }

  resetForm() {
    this.eventForm.reset();
  }

  ngOnDestroy() {
    if (this.submitEventSub) {
      this.submitEventSub.unsubscribe();
    }
    this.formChangeSub.unsubscribe();
  }

}
```

There's a substantial amount of code and logic here, so we'll tackle it piece by piece.

We'll import things as we need them, so we won't cover every import upfront. However, some of the significant functionality for our reactive form comes from the `@angular/forms` imports. These include [`FormGroup`](https://angular.io/api/forms/FormGroup), [`FormBuilder`](https://angular.io/api/forms/FormBuilder), `Validators`, and [`AbstractControl`](https://angular.io/api/forms/AbstractControl).

We'll import and provide an instance of the `EventFormService` in our `@Component()`'s `providers` array rather than in the app module.

> **Note:** `EventFormService` is only used by this component, so it doesn't need to be provided as an app-wide singleton. We only need one instance for the event form component.

Next let's set up our component class properties. If editing an existing event, we need the `@Input() event` and an `isEdit` flag. When we build our reactive form, the `eventForm` will be a [FormGroup](https://angular.io/api/forms/FormGroup). We'll also be creating a subgroup in the form for our `datesGroup`. We'll need to access this `datesGroup` [AbstractControl](https://angular.io/api/forms/AbstractControl) and its properties throughout the form, particularly for validating the dates and times as a group. Then we need properties to handle form validation and submission.

In our constructor, we'll need the reactive `FormBuilder` and our trusty API service to submit events to MongoDB. We'll also use `DatePipe` to transform any existing datetimes to date and time strings when editing an event. We'll use our `EventFormService`'s properties and ensure that they're publicly available to the template. Finally, we'll need `Router` to redirect the user to the event detail page when finished adding or editing an event.

The `ngOnInit()` method will set up our form component. We'll set the local `formErrors` property to the `formErrors` member from our event form service. Then we'll set `isEdit` based on whether an `event` input was passed to the component. The `submitBtnText` is dependent on whether we're updating or creating an event. We'll then use two private methods to set the `formEvent` and to build the form itself.

The private `_setFormEvent()` method returns a `new EventFormModel()` based on whether a new event is being created or an existing event is being updated. In `ngOnInit()`, we set the form's model (`formEvent`) to the model that this function returns. If not editing, the `EventFormModel` instance is created with `null` set for all required fields. If editing an event, we'll populate the `EventFormModel` with the inputted `event`. We'll use `DatePipe` to transform start and end datetimes to appropriately formatted strings.

Next we'll create the `_buildForm()` method:

```typescript
  private _buildForm() {
    this.eventForm = this.fb.group({
      title: [this.formEvent.title, [
        Validators.required,
        Validators.minLength(this.ef.textMin),
        Validators.maxLength(this.ef.titleMax)
      ]],
      location: [this.formEvent.location, [
        Validators.required,
        Validators.minLength(this.ef.textMin),
        Validators.maxLength(this.ef.locMax)
      ]],
      viewPublic: [this.formEvent.viewPublic,
        Validators.required
      ],
      description: [this.formEvent.description,
        Validators.maxLength(this.ef.descMax)
      ],
      datesGroup: this.fb.group({
        startDate: [this.formEvent.startDate, [
          Validators.required,
          Validators.maxLength(this.ef.dateMax),
          Validators.pattern(DATE_REGEX),
          dateValidator()
        ]],
        startTime: [this.formEvent.startTime, [
          Validators.required,
          Validators.maxLength(this.ef.timeMax),
          Validators.pattern(TIME_REGEX)
        ]],
        endDate: [this.formEvent.endDate, [
          Validators.required,
          Validators.maxLength(this.ef.dateMax),
          Validators.pattern(TIME_REGEX),
          dateValidator()
        ]],
        endTime: [this.formEvent.endTime, [
          Validators.required,
          Validators.maxLength(this.ef.timeMax),
          Validators.pattern(TIME_REGEX)
        ]]
      })
    });
    // Set local property to eventForm datesGroup control
    this.datesGroup = this.eventForm.get('datesGroup');

    // Subscribe to form value changes
    this.formChangeSub = this.eventForm
      .valueChanges
      .subscribe(data => this._onValueChanged());

    // If edit: mark fields dirty to trigger immediate
    // validation in case editing an event that is no
    // longer valid (for example, an event in the past)
    if (this.isEdit) {
      const _markDirty = group => {
        for (const i in group.controls) {
          if (group.controls.hasOwnProperty(i)) {
            group.controls[i].markAsDirty();
          }
        }
      };
      _markDirty(this.eventForm);
      _markDirty(this.datesGroup);
    }

    this._onValueChanged();
  }
```

The first thing we'll do in `_buildForm()` is create a [FormBuilder group](https://angular.io/api/forms/FormBuilder#members). This is our reactive form, and we'll use the `eventForm` property to interact with and respond to changes in the form itself. We'll pass a controls configuration object to the `group()` method.

Each field in our form is an object key with an array value. The first item in the array is the field's default value, which we'll populate with the corresponding properties from our `formEvent` model we created in previous steps. The second item in the array is _either_ a single validator or an array of validators. [`Validators`](https://angular.io/api/forms/Validators) are the [build-in validation methods](https://github.com/angular/angular/blob/master/packages/forms/src/validators.ts) for Angular forms, such as [`required`](https://github.com/angular/angular/blob/4.0.0/packages/forms/src/validators.ts#L68), [`minLength()`](https://github.com/angular/angular/blob/4.0.0/packages/forms/src/validators.ts#L89), [`pattern()`](https://github.com/angular/angular/blob/4.0.0/packages/forms/src/validators.ts#L116), etc. We'll use the properties from our `EventFormService` to set the appropriate min and max length validators, and also add `required` to mandatory fields.

> **Note:** We can also use custom validators, such as our `dateValidator()` that we created in the <a href="#angular-custom-validatation" target="_self">Angular: Custom Form Validation</a> section.

Notice that there is a `datesGroup` property in the form configuration object. This is another FormBuilder group. This group contains the fields for `startDate`, `startTime`, `endDate`, and `endTime`. We'll group them into their own control because we want to validate these fields _together_. The config object for this nested group should work the same. We'll add the necessary built-in validators. In addition, we'll add our custom `dateValidator()` to the validator arrays for `startDate` and `endDate`. We'll also validate `pattern`s using the `DATE_REGEX` and `TIME_REGEX` from our form utilities factory.

After building the form (`eventForm`), we'll set the Event Form component's `datesGroup` property to the nested group we created. We need to use the form's `get()` method in order to access the `datesGroup` form control safely.

We'll `subscribe()` to the event form's [`valueChanges` observable](https://angular.io/guide/reactive-forms#observe-control-changes). This stream updates whenever any value in the form is modified. We'll subscribe and handle changes with a private `_onValueChanged()` method that we'll create shortly.

There is a possibility that we can prefill the event form with data that is no longer considered valid. This may happen if we're _editing_ an event that occurred in the _past_. Simply relisting an event that's already over is not acceptable: we'd expect that the admin should want to change any expired dates first. Therefore, we want to validate the form before the admin user has even interacted with it. To do this, we'll check to see if `isEdit` and if so, we'll mark all fields as dirty. This will trigger validation to run. We'll iterate over the controls in our `eventForm` group and in the nested `datesGroup` and `markAsDirty()`.

Finally, we'll call the `_onValueChanged()` method so that it runs on initialization. This method looks like this:

```typescript
  private _onValueChanged() {
    if (!this.eventForm) { return; }
    const _setErrMsgs = (control: AbstractControl, errorsObj: any, field: string) => {
      if (control && control.dirty && control.invalid) {
        const messages = this.ef.validationMessages[field];
        for (const key in control.errors) {
          if (control.errors.hasOwnProperty(key)) {
            errorsObj[field] += messages[key] + '<br>';
          }
        }
      }
    };

    // Check validation and set errors
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        if (field !== 'datesGroup') {
          // Set errors for fields not inside datesGroup
          // Clear previous error message (if any)
          this.formErrors[field] = '';
          _setErrMsgs(this.eventForm.get(field), this.formErrors, field);
        } else {
          // Set errors for fields inside datesGroup
          const datesGroupErrors = this.formErrors['datesGroup'];
          for (const dateField in datesGroupErrors) {
            if (datesGroupErrors.hasOwnProperty(dateField)) {
              // Clear previous error message (if any)
              datesGroupErrors[dateField] = '';
              _setErrMsgs(this.datesGroup.get(dateField), datesGroupErrors, dateField);
            }
          }
        }
      }
    }
  }
```

Recall that our reactive form will handle validation and error messaging in the component class rather than in the template. In our `EventFormService`, we created an object called `FormErrors` with keys matching the form controls and values as empty strings. We created a local property from this object, which we'll now update to the current error state of our form whenever values have changed. We'll assess any errors from the form controls to map them to the `validationMessages` object in the event form service. Because `datesGroup` is nested, we'll need to do this for each of the `eventForm` and `datesGroup` form groups, so we'll abstract this logic to a `_setErrMsgs()` function.

We can then iterate over the `formErrors` object and set validation errors for any errors found on the form controls.

Before we can submit our form, we need to do a little bit of data preparation:

```typescript
  private _getSubmitObj() {
    const startDate = this.datesGroup.get('startDate').value;
    const startTime = this.datesGroup.get('startTime').value;
    const endDate = this.datesGroup.get('endDate').value;
    const endTime = this.datesGroup.get('endTime').value;
    // Convert form startDate/startTime and endDate/endTime
    // to JS dates and populate a new EventModel for submission
    return new EventModel(
      this.eventForm.get('title').value,
      this.eventForm.get('location').value,
      stringsToDate(startDate, startTime),
      stringsToDate(endDate, endTime),
      this.eventForm.get('viewPublic').value,
      this.eventForm.get('description').value,
      this.event ? this.event._id : null
    );
  }
```

Remember that our API expects an `EventModel`, but the data we currently have in our form is a `FormEventModel` with start and end dates/times separated as strings. In order to submit the data to the API, we'll need to create a `new EventModel()`. We'll use our `stringsToDate()` factory function to get JavaScript dates for `startDatetime` and `endDatetime`. We'll also add the event's ID if it has one.

Once we have the new `EventModel`, we can submit it to the API like so:

```typescript
  onSubmit() {
    this.submitting = true;
    this.submitEventObj = this._getSubmitObj();

    if (!this.isEdit) {
      this.submitEventSub = this.api
        .postEvent$(this.submitEventObj)
        .subscribe(
          data => this._handleSubmitSuccess(data),
          err => this._handleSubmitError(err)
        );
    } else {
      this.submitEventSub = this.api
        .editEvent$(this.event._id, this.submitEventObj)
        .subscribe(
          data => this._handleSubmitSuccess(data),
          err => this._handleSubmitError(err)
        );
    }
  }

  private _handleSubmitSuccess(res) {
    this.error = false;
    this.submitting = false;
    // Redirect to event detail
    this.router.navigate(['/event', res._id]);
  }

  private _handleSubmitError(err) {
    console.error(err);
    this.submitting = false;
    this.error = true;
  }
```

This should look familiar from our RSVP form component. We'll call the appropriate endpoint depending on whether `isEdit` is `true` or not. We'll then handle success or error. Our `_handleSubmitSuccess()` method will redirect the user to the newly created or updated event detail page.

Finally, we'll do a little housekeeping:

```typescript
  resetForm() {
    this.eventForm.reset();
  }

  ngOnDestroy() {
    if (this.submitEventSub) {
      this.submitEventSub.unsubscribe();
    }
    this.formChangeSub.unsubscribe();
  }
```

The `resetForm()` method will clear and reset the form to a pristine, untouched state. We'll add a button to the template that will call this method when clicked.

Finally, we'll do our usual cleanup of subscriptions in `ngOnDestroy()`.

> **Note:** We'll add the date group validation after we implement the event form template.

### Event Form Template

Our `event-form.component.html` template will be refreshingly straightforward. Open the file and add:

{% highlight html %}
<!-- src/app/pages/admin/event-form/event-form.component.html -->
<form [formGroup]="eventForm" (ngSubmit)="onSubmit()">
  <!-- Title -->
  <div class="form-group">
    <label for="title">Title</label>
    <input
      id="title"
      type="text"
      class="form-control"
      formControlName="title"
      [maxlength]="ef.titleMax">
    <div
      *ngIf="formErrors.title"
      class="small text-danger formErrors"
      [innerHTML]="formErrors.title">
    </div>
  </div>

  <!-- Location -->
  <div class="form-group">
    <label for="location">Location</label>
    <input
      id="location"
      type="text"
      class="form-control"
      formControlName="location"
      [maxlength]="ef.locMax">
    <div
      *ngIf="formErrors.location"
      class="small text-danger formErrors"
      [innerHTML]="formErrors.location">
    </div>
  </div>

  <div
    formGroupName="datesGroup"
    [ngClass]="{'has-danger': eventForm.get('datesGroup').errors}">
    <div class="row">
      <!-- Start date -->
      <div class="form-group col-sm-12 col-md-6">
        <label for="startDate">Start Date</label>
        <input
          id="startDate"
          type="text"
          class="form-control"
          formControlName="startDate"
          [placeholder]="ef.dateFormat"
          [maxlength]="ef.dateMax">
        <div
          *ngIf="formErrors.datesGroup.startDate"
          class="small text-danger formErrors"
          [innerHTML]="formErrors.datesGroup.startDate">
        </div>
      </div>

      <!-- Start time -->
      <div class="form-group col-sm-12 col-md-6">
        <label for="startTime">Start Time</label>
        <input
          id="startTime"
          type="text"
          class="form-control"
          formControlName="startTime"
          [placeholder]="ef.timeFormat"
          [maxlength]="ef.timeMax">
        <div
          *ngIf="formErrors.datesGroup.startTime"
          class="small text-danger formErrors"
          [innerHTML]="formErrors.datesGroup.startTime">
        </div>
      </div>
    </div>

    <div class="row">
      <!-- End date -->
      <div class="form-group col-sm-12 col-md-6">
        <label for="endDate">End Date</label>
        <input
          id="endDate"
          type="text"
          class="form-control"
          formControlName="endDate"
          [placeholder]="ef.dateFormat"
          [maxlength]="ef.dateMax">
        <div
          *ngIf="formErrors.datesGroup.endDate"
          class="small text-danger formErrors"
          [innerHTML]="formErrors.datesGroup.endDate">
        </div>
      </div>

      <!-- End time -->
      <div class="form-group col-sm-12 col-md-6">
        <label for="endTime">End Time</label>
        <input
          id="endTime"
          type="text"
          class="form-control"
          formControlName="endTime"
          [placeholder]="ef.timeFormat"
          [maxlength]="ef.timeMax">
        <div
          *ngIf="formErrors.datesGroup.endTime"
          class="small text-danger formErrors"
          [innerHTML]="formErrors.datesGroup.endTime">
        </div>
      </div>
    </div>

    <p *ngIf="eventForm.get('datesGroup').errors" class="alert alert-danger small">
      <strong>Dates/times out of range:</strong> Events cannot end before they begin. Please double-check the start and end dates and times.
    </p>
  </div>

  <!-- View Public -->
  <div class="form-group">
    <label class="label-inline-group">List event publicly?</label>
    <div class="form-check form-check-inline">
      <label class="form-check-label">
        <input
          id="viewPublic-yes"
          type="radio"
          class="form-check-input"
          [value]="true"
          formControlName="viewPublic"> Yes
      </label>
    </div>
    <div class="form-check form-check-inline">
      <label class="form-check-label">
        <input
          id="viewPublic-no"
          type="radio"
          class="form-check-input"
          [value]="false"
          formControlName="viewPublic"> No
      </label>
    </div>
    <div
      *ngIf="formErrors.viewPublic"
      class="small text-danger formErrors"
      [innerHTML]="formErrors.viewPublic">
    </div>
  </div>

  <!-- Description -->
  <div class="form-group">
    <label for="description">Description:</label>
    <textarea
      id="description"
      class="form-control"
      rows="3"
      formControlName="description"
      [maxlength]="ef.descMax"></textarea>
    <div
      *ngIf="formErrors.description"
      class="small text-danger formErrors"
      [innerHTML]="formErrors.description">
    </div>
  </div>

  <!-- Submit -->
  <div class="form-group">
    <button
      type="submit"
      class="btn btn-primary"
      [attr.disabled]="eventForm.invalid || submitting ? true : null"
      [innerText]="submitBtnText"></button>
      <!-- https://github.com/angular/angular/issues/11271#issuecomment-289806196 -->
    <app-submitting *ngIf="submitting"></app-submitting>
    <a
      *ngIf="!submitting"
      class="btn btn-link"
      (click)="resetForm()"
      tabindex="0">Reset Form</a>

    <!-- API submission error -->
    <p *ngIf="error" class="mt-3 alert alert-danger">
      <strong>Error:</strong> There was a problem submitting the event. Please try again.
    </p>
  </div>
</form>
{% endhighlight %}

Our `<form>` element has a `[formGroup]="eventForm"` directive that associates the event form with the form in our template. We'll also need the `(ngSubmit)="onSubmit()"` event to submit our form when the button is clicked.

In order to associate HTML input elements with our form model, we'll add [`formControlName` directive](https://angular.io/api/forms/FormControlName) to each input.

> **Note:** We're handling validation in the class for the most part, so why are we applying a `[maxlength]` to some inputs in the template? This is to allow HTML5 form elements to limit the number of characters the user can type in the browser.
>
>If we added the `novalidate` attribute to the `<form>` element, all _browser_ validation would be disabled: the user would see our maxlength error message if they typed too many characters, but they'd be able to keep typing. For an ideal user experience, we want to take advantage of both browser-based validation _and_ our dynamic Angular validation.

After each field, we'll add a `<div>` that uses NgIf to show when the `formErrors` object has errors populated for that field. We'll use the `[innerHTML]` attribute to render the error markup.

The inputs for our start and end dates and times need to be grouped inside a container with a [`formGroupName="datesGroup"` directive](https://angular.io/api/forms/FormGroupName). We'll also use the [NgClass directive](https://angular.io/api/common/NgClass) to set a Bootstrap class (`.has-danger`) on the group's inputs if the group validation produces an error.

> **Note:** We haven't built the custom date range validation yet, but we'll set up our template now to accommodate it.

Our inputs then need `formControlName`s matching the controls belonging to the nested `datesGroup` form group. We'll also add `[placeholder]` attributes with the `dateFormat` and `timeFormat` properties we created in the event form service. Then we'll add `[maxlength]` and error messages for the individual field validation.

At the bottom of this form group, we'll add a `<p>` element alert to handle showing the custom dates/times group validation that we'll create. This message will conditionally indicate when the dates are out of range.

The rest of the form fields should feel familiar and abide by the same rules as the first few that we created (i.e., `title` and `location`).

We want to disable our submit button if the form isn't valid. However, unlike template-driven forms, reactive forms [don't play nicely with a dynamic `[disabled]` directive](https://github.com/angular/angular/issues/11271). Instead, we'll use a dynamic _attribute_ (`[attr.disabled]`) on our submit button, setting it to `true` if the form is invalid or currently `submitting`. If the button should be enabled, we'll set it to `null` so that the `disabled` attribute is not activated.

During submission, we'll show our `submitting` component. We'll then display a "Reset Form" link. This needs to be an anchor tag rather than a `<button>` element so it doesn't interfere with the `(ngSubmit)` on the `<form>` element. When clicked, the link will execute our `resetForm()` method. We'll also add a `tabindex` so that Bootstrap treats it as a link even though it doesn't have an `href` attribute.

Finally, if an error has occurred, we'll show an alert recommending that the user try submitting the form again.

That's it for the form template!

---

## <span id="angular-group-validation"></span>Angular: Custom Form Group Validation

Now that we have our Event Form component class and template, let's implement the form group validation that we've mentioned a few times for verifying a date range for events.

### Validation Requirements

Let's review the requirements for this validation. We have four fields that we'll validate together: start date, start time, end date, and end time. Obviously, the start date+time and end date+time are tied to each other and should produce valid datetimes together. We then need to compare the start datetime and end datetime to make sure the user isn't creating an event that ends _before_ it begins.

We already have individual field-level validation to ensure that the dates and times are formatted correctly. We don't want the date range validation to run if the individual date fields in the `datesGroup` are invalid.

We want to be able to validate the date range with just dates, even if _times_ aren't available or valid yet. If the user enters a start date of `10/15/2018` and an end date of `10/14/2018`, we still need to show that these dates are out of range even if times haven't been entered yet. Therefore, as long as the start and end _dates_ are valid, we'll perform date range validation.

### Create Date Range Validator

Create a new file in the `src/app/core/forms` directory called `date-range.validator.ts` and add the following code:

```typescript
// src/app/core/forms/date-range.validator.ts
import { AbstractControl } from '@angular/forms';
import { stringsToDate } from './formUtils.factory';

export function dateRangeValidator(c: AbstractControl): {[key: string]: any} {
  // Get controls in group
  const startDateC = c.get('startDate');
  const startTimeC = c.get('startTime');
  const endDateC = c.get('endDate');
  const endTimeC = c.get('endTime');
  // Object to return if date is invalid
  const invalidObj = { 'dateRange': true };

  // If start and end dates are valid, can check range (with prefilled times)
  // Final check happens when all dates/times are valid
  if (startDateC.valid && endDateC.valid) {
    const checkStartTime = startTimeC.invalid ? '12:00 AM' : startTimeC.value;
    const checkEndTime = endTimeC.invalid ? '11:59 PM' : endTimeC.value;
    const startDatetime = stringsToDate(startDateC.value, checkStartTime);
    const endDatetime = stringsToDate(endDateC.value, checkEndTime);

    if (endDatetime >= startDatetime) {
      return null;
    } else {
      return invalidObj;
    }
  }
  return null;
}
```

We'll import `AbstractControl` and our `stringsToDate` factory.

The `dateRangeValidator()` function takes an `AbstractControl` as a parameter. This is the form group that we'll be validating. We can then use the `get()` method to set constants for the form controls for each of the fields in the group we're validating. Then we'll set a constant for the `invalidObj` that will be returned if the validation fails.

If the start and end dates are valid, we'll check the date range. If the start time is invalid or not available, we'll validate the datetime at `12:00 AM`. If the end time is invalid or not available, we'll validate the datetime at `11:59 PM`. This ensures that the user can enter same-day events without errors. We'll then get JavaScript `Date` objects by sending the dates and times as parameters to our `stringsToDate()` method.

Finally, we can compare the datetimes. If the end datetime is greater than or equal to the start datetime, the fields pass validation. Otherwise, we'll return our `invalidObj`.

If the start and end dates aren't valid, we won't perform date range validation, so we'll return `null`.

That's it for our date range validator function!

### Add Date Range Validator to Event Form Component

Now we'll add our `dateRangeValidator()` factory to the Event Form component class. Open the `event-form.component.ts` file:

```typescript
// src/app/pages/admin/event-form/event-form.component.ts
...
import { dateRangeValidator } from './../../../core/forms/date-range.validator';
...
  private _buildForm() {
    this.eventForm = this.fb.group({
      ...,
      datesGroup: this.fb.group({
        ...
      }, { validator: dateRangeValidator })
    });

...
```

First we'll import the `dateRangeValidator`. Then we'll set it in the [`extra` parameter map to our `datesGroup` FormBuilder `group()`](https://angular.io/api/forms/FormBuilder#members). The type annotation for `group()` is as follows:

```typescript
group(controlsConfig: {[key: string]: any}, extra?: {[key: string]: any})
```

Valid keys for the `extra?` parameter map are `validator` and `asyncValidator`. Here we'll use `{ validator: dateRangeValidator }`.

We already added the necessary markup to our template to support date group validation. Our date range validation should now work. Let's try it out!

> **Note:** Because date range is the only custom group validation, our template safely assumes that _any_ errors on the `datesGroup` control are the `dateRange` error.

Our validation should look and function like this:

<p align="center">
  <img src="https://cdn.auth0.com/blog/mean-series/datesGroup-validation.gif" alt="Angular custom group validation date range">
</p>

Angular's reactive forms are quite powerful. We've now explored how they give us plenty of flexibility to customize complex forms.

{% include tweet_quote.html quote_text="Angular reactive forms allow us to build group-level custom validation." %}

## Aside: Securing Applications with Auth0

Are you building a [B2C](https://auth0.com/b2c-customer-identity-management), [B2B](https://auth0.com/b2b-enterprise-identity-management), or [B2E](https://auth0.com/b2e-identity-management-for-employees) tool? Auth0 can help you focus on what matters the most to you, the special features of your product. [Auth0](https://auth0.com/) can improve your product's security with state-of-the-art features like [passwordless](https://auth0.com/passwordless), [breached password surveillance](https://auth0.com/breached-passwords), and [multifactor authentication](https://auth0.com/multifactor-authentication).

[We offer a generous **free tier**](https://auth0.com/pricing) so you can get started with modern authentication.

---

## Summary

In Part 6 of our Real-World Angular Series, we've covered reactive forms with custom validation. In the next part of the tutorial series, we'll delete events, list events a user has RSVPed to, and silently renew authentication tokens with Auth0.
