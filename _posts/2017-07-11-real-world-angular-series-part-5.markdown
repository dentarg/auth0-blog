---
layout: post
title: "Real-World Angular Series - Part 5: Animation and Template-Driven Forms"
description: "Build and deploy a real-world app with MongoDB, Express, Angular, and Node (MEAN): animation and template-driven forms."
date: 2017-07-11 8:30
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
- 2017-06-29-real-world-angular-series-part-2
- 2017-07-05-real-world-angular-series-part-3
- 2017-07-06-real-world-angular-series-part-4

---

<div class="alert alert-danger alert-icon">
  <i class="icon-budicon-487"></i>
  <strong>WARNING: This series of articles uses Angular 5 and RxJS 5.</strong> Please be aware that code changes are necessary to use Angular 6 and RxJS 6 with this tutorial. We are in the process of upgrading the series to latest versions. In the meantime, you can <a href="https://update.angular.io/">follow the update instructions here</a> for more information. Thank you for your patience!
</div>

**TL;DR:** This 8-part tutorial series covers building and deploying a full-stack JavaScript application from the ground up with hosted [MongoDB](https://www.mongodb.com/), [Express](https://expressjs.com/), [Angular (v2+)](https://angular.io), and [Node.js](https://nodejs.org) (MEAN stack). The completed code is available in the [mean-rsvp-auth0 GitHub repo](https://github.com/auth0-blog/mean-rsvp-auth0/) and a deployed sample app is available at [https://rsvp.kmaida.net](https://rsvp.kmaida.net).  **Part 5 of the tutorial series covers simple animation and using a template-driven form to add and update data.**

---

## Real-World Angular Series

You can view all sections of the tutorial series here:

1. [Real-World Angular Series - Part 1: MEAN Setup & Angular Architecture](https://auth0.com/blog/real-world-angular-series-part-1)
2. [Real-World Angular Series - Part 2: Authentication and Data Modeling](https://auth0.com/blog/real-world-angular-series-part-2)
3. [Real-World Angular Series - Part 3: Fetching and Displaying API Data](https://auth0.com/blog/real-world-angular-series-part-3)
4. [Real-World Angular Series - Part 4: Access Management, Admin, and Detail Pages](https://auth0.com/blog/real-world-angular-series-part-4)
5. [Real-World Angular Series - Part 5: Animation and Template-Driven Forms](https://auth0.com/blog/real-world-angular-series-part-5) (you are here!)
6. [Real-World Angular Series - Part 6: Reactive Forms and Custom Validation](https://auth0.com/blog/real-world-angular-series-part-6)
7. [Real-World Angular Series - Part 7: Relational Data and Token Renewal](https://auth0.com/blog/real-world-angular-series-part-7)
8. [Real-World Angular Series - Part 8: Lazy Loading, Production Deployment, SSL](https://auth0.com/blog/real-world-angular-series-part-8)

---

## Part 5: Animation and Template-Driven Forms

The [fourth part of this tutorial](https://auth0.com/blog/real-world-angular-series-part-4) covered access management with Angular, displaying admin data, and setting up detail pages with tabs.

The fifth installment in the series covers simple animation and using a template-driven form to add and update data.

1. <a href="#angular-rsvp" target="_self">Angular: RSVP Component</a>
2. <a href="#angular-animation" target="_self">Angular: Animation</a>
3. <a href="#api-rsvps" target="_self">API: Create and Update RSVPs</a>
4. <a href="#angular-rsvps-api" target="_self">Angular: Add RSVP Endpoints to API Service</a>
5. <a href="#angular-rsvp-form" target="_self">Angular: RSVP with Template-Driven Form</a>
6. <a href="#angular-rsvp-logic" target="_self">Angular: Finish RSVP Component Logic</a>

---

## <span id="angular-rsvp"></span>Angular: RSVP Component

Let's pick up right where we left off [last time](https://auth0.com/blog/real-world-angular-series-part-4). We'll add some basic functionality to our RSVP component to display existing RSVPs. Shortly, we'll create the RSVP form, which will be responsible for adding and updating RSVPs. At that time, we'll add quite a bit more logic to this component.

### Add Display Utilities to Service

Before we implement our RSVP component, let's add a few more utility methods to `UtilsService`. Open the `utils.service.ts` file and add the following:

```typescript
// src/app/core/utils.service.ts
...
  displayCount(guests: number): string {
    // Example usage:
    // {{displayCount(guests)}} attending this event
    const persons = guests === 1 ? ' person' : ' people';
    return guests + persons;
  }

  showPlusOnes(guests: number): string {
    // If bringing additional guest(s), show as "+n"
    if (guests) {
      return `+${guests}`;
    }
  }

  booleanToText(bool: boolean): string {
    // Change a boolean to 'Yes' or 'No' string
    return bool ? 'Yes' : 'No';
  }
  ...
```

These are very simple helper utilities to enhance display of data. The `displayCount()` method returns the number of people attending using the appropriate noun ("person" or "people"). The `showPlusOnes()` method returns a `+` with the number of guests if guests exist. Finally, `booleanToText()` converts a `true` or `false` value to a "Yes" or "No" string.

### Add Filter to Filter/Sort Service

We're also going to need to add a method to our `FilterSortService`. Open the `filter-sort.service.ts` file and add the following:

```typescript
// src/app/core/filter-sort.service.ts
  ...
  filter(array: any[], property: string, value: any) {
    // Return only items with specific key/value pair
    if (!property || value === undefined || !this._objArrayCheck(array)) {
      return array;
    }
    const filteredArray = array.filter(item => {
      for (const key in item) {
        if (item.hasOwnProperty(key)) {
          if (key === property && item[key] === value) {
            return true;
          }
        }
      }
    });
    return filteredArray;
  }
  ...
```

This is a straightforward filter for objects in arrays. It accepts an array, a property name, and a value. It then uses the [`filter()` array method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter?v=example) to return a new array with _only_ objects that contain the specified key/value pair.

We'll use this method in our RSVP component to separate the RSVPs into those who are attending and those who declined to attend.

### Add Inputs to RSVP Component in Event Template

In the next step, we'll set up our RSVP component class to support `@Input`s to utilize data from the parent Event component. To do so, we must first pass these inputs _into_ the RSVP component.

Open `event.component.html`:

{% highlight html %}
<!-- src/app/pages/event/event.component.html -->
...
      <!-- Event RSVP content -->
      <app-rsvp
        *ngIf="utils.tabIs(tab, 'rsvp')"
        [eventId]="event._id"
        [eventPast]="eventPast"></app-rsvp>
...
{% endhighlight %}

Add the `[eventId]` and `[eventPast]` attributes to the `<app-rsvp>` element to pass this data to the RSVP component, which we'll build out next.

### RSVP Component Class

Let's start our RSVP component by displaying RSVP information. In <a href="https://auth0.com/blog/real-world-angular-series-part-3#api-events">API: Fetching Events</a>, we established an endpoint to retrieve RSVPs from MongoDB by passing an event ID. An HTTP observable was added to our `ApiService` called `getRsvpsByEventId$()`.

Right now, we'll implement the following features in our RSVP component:

* A notice indicating whether the event is over
* The user's existing RSVP information, if they have responded to the event already
* A collapsible list of everyone who has RSVPed to the event, whether they are attending or not, and how many guests they're bringing
* If the user is an admin, comments should also be shown
* Display total number of attending guests (including additional people they're bringing)
* Display total number of responses that are not attending

As we implement this, we'll keep in mind the next set of features. Some of the logic we'll put in place will be future-facing to accommodate handling the form, which we'll build shortly as a separate child component.

* A template-driven RSVP form that can be canceled
* If user has already responded, they can edit their response
* If they have not responded yet, they can submit a new RSVP
* The RSVP list should update in response to new RSVPs or edits

Let's implement the first set of logic. Open the `rsvp.component.ts` file:

```typescript
// src/app/pages/event/rsvp/rsvp.component.ts
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AuthService } from './../../../auth/auth.service';
import { ApiService } from './../../../core/api.service';
import { UtilsService } from './../../../core/utils.service';
import { FilterSortService } from './../../../core/filter-sort.service';
import { RsvpModel } from './../../../core/models/rsvp.model';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-rsvp',
  templateUrl: './rsvp.component.html',
  styleUrls: ['./rsvp.component.scss']
})
export class RsvpComponent implements OnInit, OnDestroy {
  @Input() eventId: string;
  @Input() eventPast: boolean;
  rsvpsSub: Subscription;
  rsvps: RsvpModel[];
  loading: boolean;
  error: boolean;
  userRsvp: RsvpModel;
  totalAttending: number;
  footerTense: string;
  showAllRsvps = false;
  showRsvpsText = 'View All RSVPs';

  constructor(
    public auth: AuthService,
    private api: ApiService,
    public utils: UtilsService,
    public fs: FilterSortService) { }

  ngOnInit() {
    this.footerTense = !this.eventPast ? 'plan to attend this event.' : 'attended this event.';
    this._getRSVPs();
  }

  private _getRSVPs() {
    this.loading = true;
    // Get RSVPs by event ID
    this.rsvpsSub = this.api
      .getRsvpsByEventId$(this.eventId)
      .subscribe(
        res => {
          this.rsvps = res;
          this._updateRsvpState();
          this.loading = false;
        },
        err => {
          console.error(err);
          this.loading = false;
          this.error = true;
        }
      );
  }

  toggleShowRsvps() {
    this.showAllRsvps = !this.showAllRsvps;
    this.showRsvpsText = this.showAllRsvps ? 'Hide RSVPs' : 'Show All RSVPs';
  }

  private _updateRsvpState() {
    // @TODO: We will add more functionality here later
    this._setUserRsvpGetAttending();
  }

  private _setUserRsvpGetAttending() {
    // Iterate over RSVPs to get/set user's RSVP
    // and get total number of attending guests
    let guests = 0;
    const rsvpArr = this.rsvps.map(rsvp => {
      // If user has an existing RSVP
      if (rsvp.userId === this.auth.userProfile.sub) {
        this.userRsvp = rsvp;
      }
      // Count total number of attendees
      // + additional guests
      if (rsvp.attending) {
        guests++;
        if (rsvp.guests) {
          guests += rsvp.guests;
        }
      }
      return rsvp;
    });
    this.rsvps = rsvpArr;
    this.totalAttending = guests;
  }

  ngOnDestroy() {
    this.rsvpsSub.unsubscribe();
  }

}
```

For the RSVP tab, we don't need to know anything about the event except its ID and if it's in the past or not. We already get these inputs from the parent [Event component](https://auth0.com/blog/real-world-angular-series-part-4#angular-event-component). We'll set up the necessary properties to manage a subscription to RSVPs, store the user's RSVP (if they have one), keep track of the total number of planned attendees, present or past tense language in the footer, and a toggle for showing or hiding the list of all RSVPs.

The constructor will take arguments for the `AuthService` so we can conditionally display RSVP comments for admins, the `ApiService`, the `UtilsService` to access the utility methods we created above, and the `FilterSortService` to organize the RSVP list by guests who are attending versus not attending.

In our `ngOnInit()` method, we'll set the `footerTense` property to present or past tense based on whether the event is over or not. Then we'll `_getRSVPs()` from the API by the event ID, which was passed into the RSVP component as an input. The success method in the RSVPs subscription will call a private method called `_updateRsvpState()`. We'll discuss this below.

The next function we'll create toggles our list of all people who have RSVPed so far. The `toggleShowRsvps()` method toggles a boolean and sets the button text appropriately based on the state of the toggle.

The private `_updateRsvpState()` method just calls a `_setUserRsvpGetAttending()` method right now. Later, when we've implemented the RSVP form, we'll update `_updateRsvpState()` to specifically handle changes from form submissions. The purpose of this function is to respond to any changes in RSVP data. Once we have a form in place, this could happen three ways: on initial load, when a new RSVP is added, or when a user updates their existing RSVP.

The private `_setUserRsvpGetAttending()` method will, as the name implies, set the `userRsvp` and `totalAttending` properties based on the RSVP data currently available. We'll use the [`map()` array method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map?v=example) to return a new RSVPs array. We're taking this approach because when we implement the form, this will update the RSVP data. We'll check to see if the user's ID matches the `userId` property of any of the retrieved RSVPs. We'll also count the total number of people attending, including their additional guests.

Finally, we have our `ngOnDestroy()` where we'll unsubscribe from our RSVP API observable.

### RSVP Component Template

Let's write the markup for our RSVP component. Open `rsvp.component.html`:

{% highlight html %}
{% raw %}
<!-- src/app/pages/event/rsvp/rsvp.component.html -->
<div class="card-block">
  <h2 class="card-title text-center">RSVP</h2>
  <app-loading *ngIf="loading"></app-loading>
</div>

<ng-template [ngIf]="utils.isLoaded(loading)">
  <!-- Event is over -->
  <p *ngIf="eventPast" class="card-block lead">
    You cannot RSVP to an event that has already ended.
  </p>

  <ng-template [ngIf]="!eventPast && rsvps">
    <!-- User has RSVPed -->
    <ng-template [ngIf]="userRsvp">
      <p class="card-block lead">You responded to this event with the following information:</p>

      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          <strong>Name:</strong>{{userRsvp.name}}
        </li>
        <li class="list-group-item">
          <strong>Attending:</strong>{{utils.booleanToText(userRsvp.attending)}}
        </li>
        <li *ngIf="userRsvp.attending && userRsvp.guests" class="list-group-item">
          <strong>Additional Guests:</strong>{{userRsvp.guests}}
        </li>
        <li *ngIf="userRsvp.comments" class="list-group-item">
          <strong>Comments:</strong><span [innerHTML]="userRsvp.comments"></span>
        </li>
      </ul>
      <!-- @TODO: Toggle RSVP form (update existing) will go here -->
    </ng-template>

    <!-- No RSVP yet -->
    <div *ngIf="!userRsvp" class="card-block">
      <p class="lead">Fill out the form below to respond:</p>
      <!-- @TODO: RSVP form (add new RSVP) will go here -->
    </div>
  </ng-template>

  <!-- All RSVPs -->
  <div class="card-block text-right">
    <button (click)="toggleShowRsvps()" class="btn btn-link btn-sm">{{showRsvpsText}}</button>
  </div>

  <section class="allRsvps" *ngIf="showAllRsvps">
    <div class="card-block">
      <h3 class="card-title text-center">All RSVPs</h3>
      <p *ngIf="!rsvps.length" class="lead">There are currently no RSVPs for this event.</p>
    </div>

    <ul *ngIf="rsvps.length" class="list-group list-group-flush">
      <li class="list-group-item list-group-item-success justify-content-between">
        <strong>Attending</strong>
        <span class="badge badge-success badge-pill">{{totalAttending}}</span>
      </li>
      <li
        *ngFor="let rsvp of fs.filter(rsvps, 'attending', true)"
        class="list-group-item small">
        {{rsvp.name}} {{utils.showPlusOnes(rsvp.guests)}}
        <p *ngIf="auth.isAdmin && rsvp.comments" class="d-flex w-100">
          <em [innerHTML]="rsvp.comments"></em>
        </p>
      </li>
      <li class="list-group-item list-group-item-danger justify-content-between">
        <strong>Not Attending</strong>
        <span class="badge badge-danger badge-pill">{{fs.filter(rsvps, 'attending', false).length}}</span>
      </li>
      <li
        *ngFor="let rsvp of fs.filter(rsvps, 'attending', false)"
        class="list-group-item small">
        {{rsvp.name}}
        <p *ngIf="auth.isAdmin && rsvp.comments" class="d-flex w-100">
          <em [innerHTML]="rsvp.comments"></em>
        </p>
      </li>
    </ul>
  </section>

  <!-- Error loading RSVPs -->
  <div *ngIf="error" class="card-block">
    <p class="alert alert-danger">
      <strong>Oops!</strong> There was an error retrieving RSVPs for this event.
    </p>
  </div>
</ng-template>

<!-- Footer showing # of total attending guests -->
<div class="card-footer text-right">
  <small *ngIf="totalAttending >= 0" class="text-muted">{{utils.displayCount(totalAttending)}} {{footerTense}}</small>
</div>
{% endraw %}
{% endhighlight %}

This is a lot of code, but it's a straightforward implementation of the features we talked about before. If the event is over, we want to display an alert informing the user that they won't be able to RSVP. Once events have loaded, we'll display actions for the user. If they've RSVPed, we'll display their RSVP information. If they haven't RSVPed yet, we'll show them a message.

> **Note:** We'll add the RSVP form to both these sections shortly, after we create it.

Next we'll display a button to show or hide the list of all people who have RSVPed so far. This button uses the `toggleShowRsvps()` method and `showRsvpsText` property we created earlier.

If there are no RSVPs yet, we'll show a message saying so. If there are RSVPs, we'll show a list separated into sections for guests who are attending and guests who are not attending. We'll use our `FilterSortService`'s `filter()` method with the [`ngFor` directive](https://angular.io/guide/template-syntax#ngfor) to show these separately. We can then show `totalAttending` guests. For the count of declined guests, we don't need to do any additional math since this number is equivalent to the number of not-attending RSVPs. Comments will only show here if the user is an administrator.

If there was an error loading RSVPs, we'll show an alert like usual. Finally, the footer will display the total number of attendees (with a check to ensure `undefined` never shows) formatted into a present or past tense sentence based on if the event is over or not.

### RSVP Component Styles

Now open the `rsvp.component.scss` file and we'll add just a few styles to clean up our component:

```scss
/* src/app/pages/event/rsvp/rsvp.component.scss */
.list-group-item p:last-child {
  margin-bottom: 0;
}
.card-block.lead {
  margin-bottom: 0;
}
```

Our RSVP tab component should now look like this in the browser:

![Angular MEAN app RSVP component](https://cdn.auth0.com/blog/mean-series/event-rsvp-noForm.jpg)

---

## <span id="angular-animation"></span>Angular: Animation

This is looking pretty good, but our list of all RSVPs shows and hides quite abruptly. What if we want to animate that section so that it opens and closes more elegantly?

### Install Dependencies

Let's implement a simple animation. We'll start by adding the [Angular animations](https://angular.io/guide/animations) package in the root of our project folder:

```bash
$ npm install @angular/animations --save
```

We need to include the `BrowserAnimationsModule` in our `app.module.ts` file like so:

```typescript
// src/app/app.module.ts
...
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  ...
  imports: [
    ...,
    BrowserAnimationsModule
  ],
  ...
})
...
```

Import the module and then add it to the `imports` array in the NgModule.

Angular animations use the native [Web Animations API](https://w3c.github.io/web-animations/). To accommodate [browsers that don't support this API yet](http://caniuse.com/#feat=web-animation), we'll also want the [web animations polyfill](https://github.com/web-animations/web-animations-js).

> **Note:** You can test your browser's support for the WAAPI by visiting [this Codepen link](http://codepen.io/danwilson/pen/xGBKVq).

Let's add this to our project via CDN in the `index.html` file like so:

{% highlight html %}
<!-- src/index.html -->
...
<head>
  ...
  <script src="https://cdnjs.cloudflare.com/ajax/libs/web-animations/2.2.5/web-animations.min.js"></script>
</head>
...
{% endhighlight %}

Now we're ready to use Angular animations in our app!

### Create Expand/Collapse Animation

Animations in Angular are quite powerful, but we'll start with a basic standby: an expand/collapse sliding animation triggered by NgIf. We'll implement this in a way that allows us to reuse it across components if we wish.

Create a new blank file in the `src/app/core` folder called `expand-collapse.animation.ts`. This will be an animation factory that we'll export and be able to import into any component that needs it.

> **Note:** There are actually a few ways we could author this animation. It's entirely up to you to craft the animation in whatever way makes the most sense to _you_. Two options will be presented and both achieve the same thing:

```typescript
// src/app/core/expand-collapse.animation.ts
import { trigger, transition, style, animate, state } from '@angular/animations';

// OPTION 1:
export const expandCollapse = trigger('expandCollapse', [
  state('*', style({
    'overflow-y': 'hidden',
    'height': '*'
  })),
  state('void', style({
    'height': '0',
    'overflow-y': 'hidden'
  })),
  transition('* => void', animate('250ms ease-out')),
  transition('void => *', animate('250ms ease-in'))
]);
```

Alternatively, this could also be written like so:

```typescript
// src/app/core/expand-collapse.animation.ts
import { trigger, transition, style, animate, state } from '@angular/animations';

// OPTION 2:
export const expandCollapse = trigger('expandCollapse', [
  state('*', style({'overflow-y': 'hidden'})),
  state('void', style({'overflow-y': 'hidden'})),
  transition('* => void', [
    style({height: '*'}),
    animate('250ms ease-out', style({height: 0}))
  ]),
  transition('void => *', [
    style({height: 0}),
    animate('250ms ease-in', style({height: '*'}))
  ])
]);
```

This syntax is a departure from AngularJS's use of CSS classes for animation, but the strengths here are easily understandable once we know what we're looking at.

First, we need to import `trigger`, `transition`, `style`, `animate`, and `state`. The `trigger()` animation method accepts a name for the animation trigger and an array. The name will be how we'll apply this animation in our templates (i.e., `<div *ngIf="state" [@triggerName]>`).

### Angular Animation Methods

Let's talk briefly about the purpose of each of these methods:

* `trigger()`: accepts a name for the animation _trigger_ and an array of state and transition methods to configure the animation
* `state()`: accepts the name of the _state_ of the animation, such as `'active'` or `'inactive'`, and styles that should be applied conditionally when in that state
* `style()`: sets CSS styles and can be passed in to configure a state, transition, or animation
* `transition()`: accepts a string explaining which states are being transitioned and which direction the transition is going (i.e., `'active => inactive'`), and any styles or animations to configure the transition
* `animate()`: accepts a numeric duration in milliseconds, _or_ a CSS string specifying both the duration and easing (i.e., `250` or `'250ms ease-in'`)

> **Note:** Style, transition, and animation methods passed as arguments can be singular or grouped in an array.

Once we have an understanding of the above methods, hopefully it's clear that animations can be constructed in a variety of ways depending purely on how we prefer to compose them. As long as we understand the purpose of each method, we can easily interpret animations composed in different ways.

### Animating NgIf

Now that we know the methods used in the animation trigger, both approaches above should be understandably equivalent. However, there are a few special things to note in our `expandCollapse` animation: `*`/`void` and `height: '*'`.

When animating structural directives (such as NgIf), Angular provides the state and transition names for us.

> **Note:** This should feel somewhat familiar if you remember `.ng-enter` and `.ng-leave` in AngularJS.

* State `*`: element is present
* State `void`: element is removed
* Transition `void => *`: element is being added (alias: `:enter`)
* Transition `* => void`: element is being removed (alias: `:leave`)

Angular animation also now supports [automatic property calculation](https://angular.io/guide/animations#automatic-property-calculation)! Because Angular animations are now backed by JavaScript with the [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API), we no longer have to animate to an arbitrary `max-height` to accomodate animation of elements with dynamic dimensions. If an asterisk is used as a CSS property value, the value is _computed at runtime_ and plugged into the animation automatically.

### Notes on Animation

I personally prefer Option 1 for animations because I find it easier to read the two complete states that are being transitioned. However, Option 2 allows you to see exactly _which_ CSS properties are changing between states and what they're transitioning to and from. Pick an approach that makes the most sense to _you_.

In both approaches, note that `overflow-y: 'hidden'` is included in both states. This style is needed by the animation, so it's included in the animation JS rather than in CSS. Needing to remember to apply it with CSS whenever we add the animation somewhere would prove cumbersome and not very future-proof. It's safer to include all animation-supporting styles with the animation itself.

{% include tweet_quote.html quote_text="Animations in Angular are powerful and provide devs with authorship flexibility." %}

Hopefully you can see how animations like this can be expanded to support much more complexity. Check out the [Angular Animation docs](https://angular.io/guide/animations) for more examples and indepth documentation.

### Implement Animation in RSVP Component

Now that we have our animation, we need to implement it in a component. We exported it in a factory, so we can easily import it wherever necessary. Let's add it to our RSVP component.

Open `rsvp.component.ts` and make the following additions:

```js
// src/app/pages/event/rsvp/rsvp.component.ts
...
import { expandCollapse } from './../../../core/expand-collapse.animation';

@Component({
  ...,
  animations: [expandCollapse]
})
...
```

Next, open the `rsvp.component.html` template and add the animation trigger attribute:

{% highlight html %}
<!-- src/app/pages/event/rsvp/rsvp.component.html -->
...
  <!-- All RSVPs -->
  ...
  <section class="allRsvps" *ngIf="showAllRsvps" [@expandCollapse]>
    ...
{% endhighlight %}

Since we already have the toggle set up to show and hide the All RSVPs list, all we need to do here is add the `[@expandCollapse]` trigger to the hiding/showing element.

We should now see our animation in the browser when we click the button to toggle the RSVP list. Try it out!

> **Side Note:** Don't forget to run `ng lint` periodically to ensure that your code is error-free.

---

## <span id="api-rsvps"></span>API: Create and Update RSVPs

It's time to provide a way for users to add and update RSVPs. The first thing we'll need to do is create endpoints in our Node API.

### POST New RSVP

Open the server `api.js` file and add the following `/api/rsvp/new` endpoint:

```js
// server/api.js
...
/*
 |--------------------------------------
 | API Routes
 |--------------------------------------
 */
  ...
  // POST a new RSVP
  app.post('/api/rsvp/new', jwtCheck, (req, res) => {
    Rsvp.findOne({eventId: req.body.eventId, userId: req.body.userId}, (err, existingRsvp) => {
      if (err) {
        return res.status(500).send({message: err.message});
      }
      if (existingRsvp) {
        return res.status(409).send({message: 'You have already RSVPed to this event.'});
      }
      const rsvp = new Rsvp({
        userId: req.body.userId,
        name: req.body.name,
        eventId: req.body.eventId,
        attending: req.body.attending,
        guests: req.body.guests,
        comments: req.body.comments
      });
      rsvp.save((err) => {
        if (err) {
          return res.status(500).send({message: err.message});
        }
        res.send(rsvp);
      });
    });
  });

  ...
```

This `POST` endpoint requires authentication. We'll check to see if an RSVP already exists for the specified event and user. If so, it will output an error stating the user has already RSVPed. If not, we'll create a new `Rsvp` object with the data passed to the `POST` request in the `body`. We can then `save()` the new RSVP to MongoDB and send it to the front-end in the JSON response.

### PUT (Edit) Existing RSVP

Next add the following `/api/rsvp/:id` endpoint to edit existing RSVPs:

```js
// server/api.js
...
  // PUT (edit) an existing RSVP
  app.put('/api/rsvp/:id', jwtCheck, (req, res) => {
    Rsvp.findById(req.params.id, (err, rsvp) => {
      if (err) {
        return res.status(500).send({message: err.message});
      }
      if (!rsvp) {
        return res.status(400).send({message: 'RSVP not found.'});
      }
      if (rsvp.userId !== req.user.sub) {
        return res.status(401).send({message: 'You cannot edit someone else\'s RSVP.'});
      }
      rsvp.name = req.body.name;
      rsvp.attending = req.body.attending;
      rsvp.guests = req.body.guests;
      rsvp.comments = req.body.comments;

      rsvp.save(err => {
        if (err) {
          return res.status(500).send({message: err.message});
        }
        res.send(rsvp);
      });
    });
  });

  ...
```

This `PUT` endpoint also requires authentication. It uses `findById()` to get the existing RSVP from the database so it can be updated, accounting for errors if the RSVP cannot be found or if the `userId` in the RSVP doesn't match the authenticated user.

> **Note:** When adding entries to MongoDB through our API endpoints, you may notice `__v` properties appearing in your collection documents in MongoBooster or mLab. This is a [versionKey automatically set by mongoose](http://mongoosejs.com/docs/guide.html#versionKey).

We'll then update this RSVP's editable properties with data sent with the `PUT` request. These include `name`, `attending` status, number of additional `guests`, and `comments`. An existing RSVP's `userId` and `eventId` should _not_ be modified. After updating, we'll `save()` our changes and handle any errors, sending the updated RSVP data back in the response.

---

## <span id="angular-rsvps-api"></span>Angular: Add RSVP Endpoints to API Service

We'll now add the corresponding methods to our `ApiService` to call the new endpoints we just added.

Open the `api.service.ts` file and add these two methods:

```typescript
// src/app/core/api.service.ts
...
  // POST new RSVP (login required)
  postRsvp$(rsvp: RsvpModel): Observable<RsvpModel> {
    return this.http
      .post(`${ENV.BASE_API}rsvp/new`, rsvp, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .pipe(
        catchError((error) => this._handleError(error))
      );
  }

  // PUT existing RSVP (login required)
  editRsvp$(id: string, rsvp: RsvpModel): Observable<RsvpModel> {
    return this.http
      .put(`${ENV.BASE_API}rsvp/${id}`, rsvp, {
        headers: new HttpHeaders().set('Authorization', this._authHeader)
      })
      .pipe(
        catchError((error) => this._handleError(error))
      );

  ...
```

The `postRsvp$()` method takes an object of type `RsvpModel` as the new RSVP to add to the database. The `editRsvp$()` method takes the ID of the RSVP being edited and an object of type `RsvpModel` with the updated data.

We're now ready to add and edit RSVPs. Let's create an RSVP form component to implement this.

---

## <span id="angular-rsvp-form"></span>Angular: RSVP with Template-Driven Form

Now let's move on to our RSVP form. This form should handle users _adding_ or _updating_ RSVPs. It will be a child of our RSVP component. We'll use a [_template-driven_ form](https://angular.io/guide/forms#template-driven-forms).

> **Note:** Later on, we'll learn about _reactive forms_ when we build our events form.

Let's create the RSVP form component:

```bash
$ ng g component pages/event/rsvp/rsvp-form
```

### Add Form Component to RSVP Component

We need a way to access the form and we'll also need some data from the parent RSVP component. Let's reference our new component and add some support for showing and hiding it.

Open the `rsvp.component.ts` file:

```typescript
// src/app/pages/event/rsvp/rsvp.component.ts
...
export class RsvpComponent implements OnInit, OnDestroy {
  ...
  showEditForm = false;
  editBtnText = 'Edit My RSVP';

  ...

  toggleEditForm(setVal?: boolean) {
    this.showEditForm = setVal !== undefined ? setVal : !this.showEditForm;
    this.editBtnText = this.showEditForm ? 'Cancel Edit' : 'Edit RSVP';
  }

  onSubmitRsvp(e) {
    if (e.rsvp) {
      this.userRsvp = e.rsvp;
      // @TODO: update _updateRsvpState() method
      // to support 'changed' parameter:
      // this._updateRsvpState(true);
      this.toggleEditForm(false);
    }
  }

  ...
```

If the user has already RSVPed, we want to show a button that will toggle between their existing RSVP information and the form that allows them to edit their response. We'll create a few methods and properties to support this.

We'll also emit an event from our RSVP form component when a user has submitted the form. This will allow our RSVP component to react to changes the user has made via the form, updating things like the attendee count, the list of all RSVPs, and showing the create or edit versions of the form. We'll implement more functionality to support this later, after we've set up the form.

Next, open the `rsvp.component.html` file:

{% highlight html %}
{% raw %}
<!-- src/app/pages/event/rsvp/rsvp.component.html -->
...
    <!-- User has RSVPed -->
    <ng-template [ngIf]="userRsvp">
      ...
      <ul *ngIf="!showEditForm" class="list-group list-group-flush">
        ...
      </ul>

      <div class="card-block">
        <button
          class="btn btn-info"
          [ngClass]="{'btn-info': !showEditForm, 'btn-warning': showEditForm}"
          (click)="toggleEditForm()">{{editBtnText}}</button>

        <app-rsvp-form
          *ngIf="showEditForm"
          [eventId]="eventId"
          [rsvp]="userRsvp"
          (submitRsvp)="onSubmitRsvp($event)"></app-rsvp-form>
      </div>
    </ng-template>

    <!-- No RSVP yet -->
    <div *ngIf="!userRsvp" class="card-block">
      ...
      <app-rsvp-form
        [eventId]="eventId"
        (submitRsvp)="onSubmitRsvp($event)"></app-rsvp-form>
    </div>
  </ng-template>

  ...
{% endraw %}
{% endhighlight %}

If the user has an existing RSVP, we'll display a new `.card-block` element containing a button to toggle the RSVP form in edit mode. This form will be shown if the `showEditForm` property is `true`. It needs the `eventId` and user's `rsvp` data passed to it as inputs. It also will respond to a `(submitRsvp)` event that the form will emit, using the `onSubmitRsvp($event)` handler method we just created.

If the user does not have an existing RSVP yet, they will be shown the form to create a response. In this case, the only data we need to pass is the event ID. We'll respond to the `(submitRsvp)` event the same way as above.

### Create Form Utilities Factory

Before we build our RSVP form, let's create another utility factory. This factory will be specifically for form utilities. Create a new folder: `src/app/core/forms`. In this folder, make a new file called `formUtils.factory.ts` and add the following code:

```typescript
// src/app/core/forms/formUtils.factory.ts
// 0-9
// https://regex101.com/r/dU0eY6/1
const GUESTS_REGEX = new RegExp(/^[0-9]$/);

export { GUESTS_REGEX };
```

For now, all we need is a [regular expression matching integers from 0 to 9](https://regex101.com/r/dU0eY6/1). We'll add more to this form utilities factory later. This regex provides the validation pattern for the `guests` form field.

### Angular Template-Driven Forms

There are two ways to implement forms in Angular: [template-driven forms](https://angular.io/guide/forms#template-driven-forms) and [reactive (model-driven) forms](https://angular.io/guide/reactive-forms). We will cover both approaches in this tutorial series, starting with template-driven forms for the RSVP form component.

> **Note:** If you're already experienced with AngularJS, the template-driven approach will feel quite familiar.

As the name implies, _template-driven forms_ place much of the form's logic, validation, and messaging in the HTML template [declaratively](https://auth0.com/blog/glossary-of-modern-javascript-concepts/#imperative-declarative). They use the [NgModel form directive](https://angular.io/api/forms/NgModel) with [two-way binding syntax](https://angular.io/guide/template-syntax#two-way-binding---) to bind inputs in the template to a model in the component class.

> **Note:** If you need help remembering which order the square brackets and parentheses belong in two-way binding syntax, think "banana in a box": `[(...)]`

Template-driven forms yield rather heavy HTML templates, but lighter classes. They're advantageous in that they don't add a lot of business logic in the JavaScript. However, the manner in which your class can act upon them is more limited when compared with reactive forms.

{% include tweet_quote.html quote_text="Angular template-driven forms are declarative and closely resemble forms in AngularJS." %}

For our simple RSVP form component, a template-driven form is the ideal approach. The HTML is more transparent to the developer and we don't have particularly complex validation. Our class only needs to manage the necessary form model and submission endpoint depending on whether the user is creating or editing. We have one field that reacts to the value of another, which is easily implemented with a method that runs on the input's `change` event.

We've already imported the requisite `FormsModule` in [Part 3](https://auth0.com/blog/real-world-angular-series-part-3/#angular-home-events) when we created our Home event list with a search field.

> **Note:** The event form will need much more complex custom validation, so we'll utilize a _reactive_ form at that time.

### Create a Submitting Component

Similarly to how we created a loading component, we now want to create a simple submitting component. This will be a small spinner that can display at the end of a form while an API call is being made.

Let's scaffold this simple component like so:

```bash
$ ng g component core/forms/submitting --it --is --flat
```

Then open the `submitting.component.ts` file and add the following:

```typescript
// src/app/core/forms/submitting.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-submitting',
  template: `
    <img src="/assets/images/loading.svg">
  `,
  styles: [`
    :host {
      display: inline-block;
    }
    img {
      display: inline-block;
      margin: 4px 3px;
      width: 30px;
    }
  `]
})
export class SubmittingComponent {
}
```

We can now use this component for any forms with submitting states in our components.

### RSVP Form Component Class

Now let's add some logic to the `rsvp-form.component.ts` file:

```typescript
// src/app/pages/event/rsvp/rsvp-form/rsvp-form.component.ts
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from './../../../../auth/auth.service';
import { Subscription } from 'rxjs/Subscription';
import { ApiService } from './../../../../core/api.service';
import { RsvpModel } from './../../../../core/models/rsvp.model';
import { GUESTS_REGEX } from './../../../../core/forms/formUtils.factory';

@Component({
  selector: 'app-rsvp-form',
  templateUrl: './rsvp-form.component.html',
  styleUrls: ['./rsvp-form.component.scss']
})
export class RsvpFormComponent implements OnInit, OnDestroy {
  @Input() eventId: string;
  @Input() rsvp: RsvpModel;
  @Output() submitRsvp = new EventEmitter();
  GUESTS_REGEX = GUESTS_REGEX;
  isEdit: boolean;
  formRsvp: RsvpModel;
  submitRsvpSub: Subscription;
  submitting: boolean;
  error: boolean;

  constructor(
    private auth: AuthService,
    private api: ApiService) { }

  ngOnInit() {
    this.isEdit = !!this.rsvp;
    this._setFormRsvp();
  }

  private _setFormRsvp() {
    if (!this.isEdit) {
      // If creating a new RSVP,
      // create new RsvpModel with default data
      this.formRsvp = new RsvpModel(
        this.auth.userProfile.sub,
        this.auth.userProfile.name,
        this.eventId,
        null,
        0);
    } else {
      // If editing an existing RSVP,
      // create new RsvpModel from existing data
      this.formRsvp = new RsvpModel(
        this.rsvp.userId,
        this.rsvp.name,
        this.rsvp.eventId,
        this.rsvp.attending,
        this.rsvp.guests,
        this.rsvp.comments,
        this.rsvp._id
      );
    }
  }

  changeAttendanceSetGuests() {
    // If attendance changed to no, set guests: 0
    if (!this.formRsvp.attending) {
      this.formRsvp.guests = 0;
    }
  }

  onSubmit() {
    this.submitting = true;
    if (!this.isEdit) {
      this.submitRsvpSub = this.api
        .postRsvp$(this.formRsvp)
        .subscribe(
          data => this._handleSubmitSuccess(data),
          err => this._handleSubmitError(err)
        );
    } else {
      this.submitRsvpSub = this.api
        .editRsvp$(this.rsvp._id, this.formRsvp)
        .subscribe(
          data => this._handleSubmitSuccess(data),
          err => this._handleSubmitError(err)
        );
    }
  }

  private _handleSubmitSuccess(res) {
    const eventObj = {
      isEdit: this.isEdit,
      rsvp: res
    };
    this.submitRsvp.emit(eventObj);
    this.error = false;
    this.submitting = false;
  }

  private _handleSubmitError(err) {
    const eventObj = {
      isEdit: this.isEdit,
      error: err
    };
    this.submitRsvp.emit(eventObj);
    console.error(err);
    this.submitting = false;
    this.error = true;
  }

  ngOnDestroy() {
    if (this.submitRsvpSub) {
      this.submitRsvpSub.unsubscribe();
    }
  }

}
```

Let's break this down.

Our imports include the standard init and destroy lifecycle hooks, inputs, outputs, and `EventEmitter` to inform the parent component (RSVP component) when the form has been submitted. Then we need our `AuthService` to get some information about the user: we want to prepopulate their name from their profile. We also need to associate their ID with the RSVP. We need `Subscription` and the `ApiService` to send data to MongoDB, the `RsvpModel` to create instances of form data model, and the `GUESTS_REGEX` we just created in the form utilities factory.

Next we'll set up the RSVP form component's properties. We're receiving the `eventId` from the parent component. If the user already has an existing RSVP, that data will be sent as `rsvp` input. When we submit a new or updated RSVP to the API, we'll `@Output()` a `submitRsvp` [event](https://angular.io/api/core/EventEmitter). The `GUESTS_REGEX` we imported from the form utilities factory needs to be set as a local property so we can use it in our template. We need to know if the form `isEdit`. We also need to create a property to manage the `formRsvp` data, a `submitRsvpSub` subscription for the submission HTTP request, a property for the `submitting` state, and of course, an `error` property.

In our `ngOnInit()` method, we'll check to see whether or not an _existing_ RSVP was passed to the component as an input. If one exists, the form `isEdit`.

We can then use this information to build a `_setFormRsvp()` method, which is called on initialization. If the user does _not_ have an existing RSVP, we'll start our `formRsvp` by creating a new instance of the <a href="https://auth0.com/blog/real-world-angular-series-part-2#data-modeling">RSVP model we made much earlier</a>, setting the user's account, name, the event ID, a `null` attendance, and `0` additional guests. If `isEdit`, we'll populate the `formRsvp`'s `new RsvpModel()` with the data from their existing response, which they can then modify.

If the guest changes their attendance to say they aren't going to attend, we want to ensure that additional `guests` is set to `0`. Let's create a handler called `changeAttendanceSetGuests()` to manage this. This method will run when the user changes their `attending` value. If they are not attending, `guests` should be changed to `0`. This is useful in case they have previously said that they will be attending and added guests, but have now changed their mind.

The `onSubmit()` method executes when the form is submitted. The `submitting` state is set to `true`. Then the appropriate API endpoint (`postRsvp$` or `editRsvp$`) is called depending on whether the user is creating or editing an RSVP. Both endpoints can share the same success and error handlers, so we'll abstract them out to private methods.

The `_handleSubmitSuccess()` method sets up an `eventObj` that will be emitted in the `submitRsvp` event to the parent RSVP component. This object contains the edit state and the new or updated RSVP returned by the API. The `error` and `submitting` flags are turned off.

The `_handleSubmitError()` method is similar. It emits an `eventObj` that does not contain an RSVP, logs an error, turns off `submitting`, and sets `error` to `true`. We can then use these flags in the template to show loading icons or errors.

In the `ngOnDestroy()` method, we need to check to see if a `submitRsvpSub` exists and if so, unsubscribe from it. (If the user did not click on the "Submit" button in the form, the subscription was never created, and therefore cannot be unsubscribed.)

### RSVP Form Component Template

Time to implement the template for our RSVP form component. Open the `rsvp-form.component.html` file:

{% highlight html %}
<!-- src/app/pages/event/rsvp/rsvp-form/rsvp-form.component.html -->
<form (ngSubmit)="onSubmit()" #rsvpForm="ngForm">
  <!-- Name -->
  <div class="form-group">
    <label for="name">Name</label>
    <input
      id="name"
      name="name"
      type="text"
      class="form-control"
      minlength="3"
      maxlength="24"
      #name="ngModel"
      [(ngModel)]="formRsvp.name"
      required>
    <div
      *ngIf="name.errors && name.dirty"
      class="small text-danger formErrors">
      <div [hidden]="!name.errors.required">
        Name is <strong>required</strong>.
      </div>
      <div [hidden]="!name.errors.minlength">
        Name must be 3 characters or more.
      </div>
    </div>
  </div>

  <!-- Attending -->
  <div class="form-group">
    <label class="label-inline-group">Will you be attending?</label>
    <div class="form-check form-check-inline">
      <label class="form-check-label">
        <input
          id="attending-yes"
          name="attending"
          type="radio"
          class="form-check-input"
          (change)="changeAttendanceSetGuests()"
          [value]="true"
          [(ngModel)]="formRsvp.attending"
          required> Yes
      </label>
    </div>
    <div class="form-check form-check-inline">
      <label class="form-check-label">
        <input
          id="attending-no"
          name="attending"
          type="radio"
          class="form-check-input"
          (change)="changeAttendanceSetGuests()"
          [value]="false"
          [(ngModel)]="formRsvp.attending"
          required> No
      </label>
    </div>
  </div>

  <!-- Guests -->
  <div *ngIf="formRsvp.attending" class="formGuests form-group row">
    <label for="guests" class="col-12">Additional Guests:</label>
    <input
      id="guests"
      name="guests"
      type="number"
      class="form-control col-sm-12 col-md-3"
      maxlength="1"
      [pattern]="GUESTS_REGEX"
      step="1"
      min="0"
      max="9"
      #guests="ngModel"
      [(ngModel)]="formRsvp.guests">
    <div
      *ngIf="guests.errors && guests.dirty"
      class="col-12 small text-danger formErrors">
      <div [hidden]="!guests.errors.pattern">
        Additional Guests must be an integer from <strong>0-9</strong>.
      </div>
    </div>
  </div>

  <!-- Comments -->
  <div class="form-group">
    <label for="comments">Comments:</label>
    <textarea
      id="comments"
      name="comments"
      class="form-control"
      rows="2"
      maxlength="300"
      [(ngModel)]="formRsvp.comments"></textarea>
  </div>

  <!-- Submit -->
  <div class="form-group">
    <button
      type="submit"
      class="btn btn-primary"
      [disabled]="!rsvpForm.form.valid || submitting">Submit RSVP</button>
    <app-submitting *ngIf="submitting"></app-submitting>

    <!-- API submission error -->
    <p *ngIf="error" class="mt-3 alert alert-danger">
      <strong>Error:</strong> There was a problem submitting your response. Please try again.
    </p>
  </div>
</form>
{% endhighlight %}

This is where most of the magic of [template-driven forms](https://angular.io/guide/forms) happens. Let's take a step-by-step look.

First we have the `<form>` element. In response to an `(ngSubmit)` event, we'll call our `onSubmit()` method. The submission event is automatically triggered by a `<button>` element inside the form. Our form element also needs a [template reference variable](https://angular.io/guide/template-syntax#template-reference-variables--var-): `#rsvpForm="ngForm"`. This sets `rsvpForm` as a reference to the [NgForm directive](https://angular.io/api/forms/NgForm). It's how we'll be able to access properties of our form in the template, such as whether it is `valid` or not.

> **Note:** If we didn't want to access any properties of the form in the template, we wouldn't need to set this template reference variable. The reference provides _access_ to the directive for the template, but would _exist_ on any `<form>` element regardless of whether or not we accessed it.

We'll also be adding template reference variables to any fields that need [NgModel directive](https://angular.io/api/forms/NgModel) access in the template, such as for showing validation error messages.

> **Note:** If we wanted to access the [NgForm](https://angular.io/api/forms/NgForm) in the class, we could pass it as a parameter to the `onSubmit()` handler. This would give our handler access to all the properties of the form that the HTML accesses with the template reference variable `#rsvpForm`. However, this would only be available at the time of submission, unlike reactive forms, which have access to everything on _any_ form change. Regardless, our RSVP form is quite simple and the `formRsvp` property stores all the data we need for submission, so it isn't necessary to pass the form to the `onSubmit()` method.

The first element in our form is a `name` input. We want to validate `minlength`, `maxlength`, and `required` for this field. In order to register a control with the parent form, we'll also need a `name` attribute (`name="name"` in this case). We'll set a template reference variable of `#name="ngModel"`, which provides [NgModel directive](https://angular.io/api/forms/NgModel) access in the template so we can access the state of the control to show validation errors if necessary. To two-way bind the UI with `name` in our form model, we'll use `[(ngModel)]="formRsvp.name"`.

Using the `#name` reference, we can determine if there are currently any `errors` and if the field is `dirty` (the user has interacted with the field by entering or changing its input). If both are truthy, we'll show appropriate error messaging using the `[hidden]` attribute directive and conditional expressions.

> **Note:** We won't add an error message for `maxlength` because the HTML5 input element prevents values exceeding the specified maximum character length.

The next inputs are radio buttons indicating whether or not the user will be `attending` the event. We don't need a template reference variable or any validation messages for these because the form cannot be submitted if there are any errors (we'll disable submission) and the only validation here is `required`. We will, however, add a `(change)` event handler to each option in this radio group: our `changeAttendanceSetGuests()` method. We'll set the `[value]`s of our inputs using one-way binding syntax. This ensures that the values will be cast as booleans and not strings. Both inputs toggle `[(ngModel)]="formRsvp.attending"`.

The additional `guests` input is a number. It should validate to the "digit from 0-9" regular expression that we added in our form utilities factory. We'll use square brackets to one-way bind the validation `[pattern]="GUESTS_REGEX"`. We'll set the `maxlength`, `step`, `min`, and `max` attributes and add a `#guests` template reference variable so we can access state and errors. Then we'll two-way bind the NgModel.

If there's an error, we'll show instructions on what the pattern requirements are.

The `comments` input is an optional field that we'll show as a basic `<textarea>` with a maximum length.

For our submit button, we'll use one-way binding with the `[disabled]` attribute to disable the button if the RSVP form is not valid (using the `#rsvpForm` template reference variable declared on the `<form>` element) or if it's in a `submitting` state. We don't want the user to be able to submit an invalid form or spam the submit button if there's an API call already in progress. We'll show our `<app-submitting>` component if `submitting` is `true`.

The last thing we'll do is show an error if the `error` property is set to `true` by our error API subscription handler.

Now we have a form that enables creating and updating RSVPs. However, recall that the parent RSVP component actually handles the display and listings of an event's RSVPs. It also provides the user's RSVP _to_ the RSVP form component. We'll need to add our RSVP form component and some more logic to the parent component before our form can be used.

---

## <span id="angular-rsvp-logic"></span>Angular: Finish RSVP Component Logic

We now need to update the RSVP component to display the RSVP form and respond to the `submitRsvp` event that the <a href="#angular-rsvp-form" target="_self">RSVP form component</a> emits.

Let's do a quick recap of the logic we'd like to implement now that we have a form component:

* If user has not RSVPed yet, show form
* If user has existing RSVP, show button to edit their RSVP
* If user clicks "Edit" button, show RSVP form with current RSVP information prefilled
* When form emits the `submitRsvp` event, close form and update RSVP data to reflect any changes

### Update RSVP Component Class

Let's modify the RSVP component's class to display the RSVP form conditionally and update the RSVP data when a change has been made.

Open the `rsvp.component.ts` file and make the following changes:

```typescript
// src/app/pages/event/rsvp/rsvp.component.ts
...
export class RsvpComponent implements OnInit, OnDestroy {
  ...
  showEditForm: boolean;
  editBtnText: string;

  ...

  ngOnInit() {
    ...
    this.toggleEditForm(false);
  }

  ...

  toggleEditForm(setVal?: boolean) {
    this.showEditForm = setVal !== undefined ? setVal : !this.showEditForm;
    this.editBtnText = this.showEditForm ? 'Cancel Edit' : 'Edit My RSVP';
  }

  ...

  onSubmitRsvp(e) {
    if (e.rsvp) {
      this.userRsvp = e.rsvp;
      this._updateRsvpState(true);
      this.toggleEditForm(false);
    }
  }

  private _updateRsvpState(changed?: boolean) {
    // If RSVP matching user ID is already
    // in RSVP array, set as initial RSVP
    const _initialUserRsvp = this.rsvps.filter(rsvp => {
        return rsvp.userId === this.auth.userProfile.sub;
      })[0];

    // If user has not RSVPed before and has made
    // a change, push new RSVP to local RSVPs store
    if (!_initialUserRsvp && this.userRsvp && changed) {
      this.rsvps.push(this.userRsvp);
    }
    this._setUserRsvpGetAttending(changed);
  }

  private _setUserRsvpGetAttending(changed?: boolean) {
    // Iterate over RSVPs to get/set user's RSVP
    // and get total number of attending guests
    let guests = 0;
    const rsvpArr = this.rsvps.map(rsvp => {
      // If user has an existing RSVP
      if (rsvp.userId === this.auth.userProfile.sub) {
        if (changed) {
          // If user edited their RSVP, set with updated data
          rsvp = this.userRsvp;
        } else {
          // If no changes were made, set userRsvp property
          // (This applies on ngOnInit)
          this.userRsvp = rsvp;
        }
      }
      // Count total number of attendees
      // + additional guests
      ...
    });
    ...
  }

...
```

First, we'll add `showEditForm` and `editBtnText` properties to toggle the edit form when a user has an existing RSVP. We'll create a `toggleEditForm()` method to update these properties and call it in `ngOnInit()` to begin with the form closed.

Next we'll add a handler for the `submitRsvp` event that the RSVP form component emits. Our `_onSubmitRsvp()` method checks the event object for an `rsvp` property containing the updated RSVP. It sets the `userRsvp` property to the new RSVP. It then calls the `_updateRsvpState()` method, passing a new `changed` parameter that we'll add shortly. It also closes the edit form.

As mentioned, we'll add a parameter to our `_updateRsvpState()` method. The `changed` parameter lets the method know if the RSVP data has been updated after the component's initialization. This would happen if the user created or modified their RSVP. First we'll check to see if the user already has an existing RSVP in the `rsvps` data that was fetched from the API when the RSVP component was first loaded. This informs the `_updateRsvpState()` method whether the current `userRsvp` is brand new, or the user had an existing RSVP and is updating it.

> **Note:** The `userRsvp` property can potentially be set in the `_getRSVPs()` method on successful API call, _or_ by `onSubmit()` from the RSVP form. It is therefore not a reliable way to tell whether the user is _adding_ or _editing_ an RSVP. Thus, we need to check the initial array of RSVPs fetched from the API.

If the user did _not_ have an RSVP in the initial RSVPs retrieved from the API, they _do_ have a `userRsvp`, and `changed` is `true`, we can safely assume the `userRsvp` has just been newly created by form submission, so we should push it to the `rsvps` array.

Now we need to handle updating the array if the user _edited_ an existing RSVP. We'll do so in the `_setUserRsvpGetAttending()` method, which now also accepts a `changed` parameter. When we map the array and check for an existing RSVP with our user's ID, (`auth.userProfile.sub`), we can check to see if the RSVP was `changed`. If so, we'll update the user's corresponding RSVP in the array with the modified `userRsvp` data. If no changes were made (i.e., on initialization of the component), we'll set the `userRsvp` as we were doing previously. The rest of this method remains the same: it will calculate the number of attending guests and update the list of all RSVPs, now accounting for any changes the user may have made by adding or updating their RSVP.

### Update RSVP Component Template

Now let's make a few changes in the RSVP component template to display and toggle the RSVP form component.

Open the `rsvp.component.html` template:

{% highlight html %}
{% raw %}
<!-- src/app/pages/event/rsvp/rsvp.component.html -->
...
    <!-- User has RSVPed -->
    <ng-template [ngIf]="userRsvp">
      ...
      <div class="card-block">
        <button
          class="btn btn-info"
          [ngClass]="{'btn-info': !showEditForm, 'btn-warning': showEditForm}"
          (click)="toggleEditForm()">{{editBtnText}}</button>

        <app-rsvp-form
          *ngIf="showEditForm"
          [eventId]="eventId"
          [rsvp]="userRsvp"
          (submitRsvp)="onSubmitRsvp($event)"></app-rsvp-form>
      </div>
    </ng-template>

    <!-- No RSVP yet -->
    <div *ngIf="!userRsvp" class="card-block">
      ...
      <app-rsvp-form
        [eventId]="eventId"
        (submitRsvp)="onSubmitRsvp($event)"></app-rsvp-form>
    </div>

...
{% endraw %}
{% endhighlight %}

First we'll add a new `<div class="card-block">` to contain our editing RSVP form component and toggle. We'll pass the `[eventId]` and user `[rsvp]` and handle the `(submitRsvp)` event that the form component emits on submission.

If the user hasn't RSVPed yet, we'll show the RSVP form component and pass the `[eventId]` and handle the `(submitRsvp)` event. In this case, we don't have an existing RSVP to pass in.

Now we can add _and_ edit RSVPs! If we log in and select an event to RSVP to, it should look like this (with our name prefilled from our user profile):

![Angular RSVP app - add RSVP template-driven form](https://cdn.auth0.com/blog/mean-series/rsvp-form-new.jpg)

If we already have an RSVP, we can toggle the form open to modify our response. Doing so should look like this:

![Angular RSVP app - edit RSVP template-driven form](https://cdn.auth0.com/blog/mean-series/rsvp-form-edit.jpg)

Clicking the "Cancel Edit" button closes the form and returns to displaying our existing RSVP information.

As soon as we've added or updated an RSVP, we should be able to see any changes we made reflected in the guest count in the footer and the full list of RSVPs if we expand and view it.

## Aside: Securing Applications with Auth0

Are you building a [B2C](https://auth0.com/b2c-customer-identity-management), [B2B](https://auth0.com/b2b-enterprise-identity-management), or [B2E](https://auth0.com/b2e-identity-management-for-employees) tool? Auth0 can help you focus on what matters the most to you, the special features of your product. [Auth0](https://auth0.com/) can improve your product's security with state-of-the-art features like [passwordless](https://auth0.com/passwordless), [breached password surveillance](https://auth0.com/breached-passwords), and [multifactor authentication](https://auth0.com/multifactor-authentication).

[We offer a generous **free tier**](https://auth0.com/pricing) so you can get started with modern authentication.

---

## Summary

In Part 5 of our Real-World Angular Series, we've covered simple animation and using template-driven forms to add and edit data. In the next part of the tutorial series, we'll begin looking at more complex reactive forms.
