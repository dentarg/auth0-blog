---
layout: post
title: "Using Python, Flask, and Angular to Build Modern Web Apps - Part 3"
description: "In this series, you will learn how to create modern web applications with Python, Flask, and Angular."
longdescription: "In this series, you will learn how to create modern web applications with Python, Flask, and Angular. You will create a SPA and a backend API to expose exams and questions so users can test their knowledge regarding different technologies."
date: 2018-03-27 08:30
category: Technical Guide, Python
author:
  name: "Bruno Krebs"
  url: "https://twitter.com/brunoskrebs"
  mail: "bruno.krebs@gmail.com"
  avatar: "https://twitter.com/brunoskrebs/profile_image?size=original"
design:
  bg_color: "#4A4A4A"
  image: https://cdn.auth0.com/blog/python-flask-angular/logo.png
tags:
- python
- flask
- sqlalchemy
- angular
- typescript
- auth0
related:
- 2018-03-13-using-python-flask-and-angular-to-build-modern-apps-part-1
- 2018-03-15-using-python-flask-and-angular-to-build-modern-web-apps-part-2
- 2017-09-28-developing-restful-apis-with-python-and-flask
---

**TL;DR:** In this series, you will learn how to create modern web applications with Python, Flask, and Angular. You will use this stack to build a SPA and a backend API to expose exams and questions so users can test their knowledge regarding different technologies. [In this GitHub repository](https://github.com/auth0-blog/python-flask-angular-3/), you can find the final code created throughout the third part of the series (this one).

---

## What You Will Build

In this series, you will use Python, Flask, and Angular to build a web application based on a modern architecture. With Angular, you will build a SPA (Single Page App) that allows users to browse through exams and questions. These users, when authenticated, will be able to test their knowledge regarding a specific topic by choosing one of the multiple choices that a question exposes. Then, when your users submit their answers, your backend will check if they are right or wrong, record the result, and send back this result to users.

In this part of the series, you will start by installing and configuring [Angular Material](https://material.angular.io) to add a nice interface to your app with ease. Then, you will use Angular Material components like [Button](https://material.angular.io/components/button/overview), [Card](https://material.angular.io/components/card/overview), [Dialog](https://material.angular.io/components/dialog/overview), and [Toolbar](https://material.angular.io/components/tooltip/overview) to enhance the look and feel of your application.

After that, you will refactor both the frontend and the backend apps to support some more features like question management and question answering. Throughout the process, you will learn how you can take advantage of scopes to limit what some type of users can do. For example, although it might be a good idea to let the community help adding new exams and questions, you will want to restrict which users can update and delete existing ones.

{% include tweet_quote.html quote_text="I'm building modern webapps with Angular, Flask, and Python!" %}

## Installing and Configuring Angular Material

[The official website contains some good documentation on how to install, configure, and use Angular Material on Angular applications](https://material.angular.io/guide/getting-started). However, for newcomers, the information might look a little scattered. So, in this article, you are going to focus on what is needed to get up and running with this UI (User Interface) component framework as fast as possible.

So, the first thing you will need to do is to install some depedencies:

```bash
# make sure you move the cursor to the frontend directory
cd frontend

# install dependencies with NPM
npm i @angular/material @angular/cdk hammerjs
```

You will need the first two libraries in the command above, `@angular/material` and `@angular/cdk`, to use Angular Material in any application. [You will also install the third library, `hammerjs`, to add gesture support on your app](https://material.angular.io/guide/getting-started#step-5-gesture-support).

After installing these dependencies, you will need to update the `index.html` file. The new version of this file will add two other external dependencies ([the Roboto font](https://fonts.google.com/specimen/Roboto) and [Material Icons](https://material.io/icons/)) and will make Angular Material default style apply to all native elements on your app:

{% highlight html %}
{% raw %}
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Online Exams</title>
  <base href="/">

  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet">
</head>
<body>
  <section class="mat-typography">
    <app-root></app-root>
  </section>
</body>
</html>
{% endraw %}
{% endhighlight %}

Then, you will want to update the `styles.css` file to apply [an Angular Material theme (in this case Indigo Pink)](https://material.angular.io/guide/theming#using-a-pre-built-theme) and to remove the margin applied by browsers on the `body` element:

```css
@import "~@angular/material/prebuilt-themes/indigo-pink.css";

body {
    margin: 0;
}
```

Also, before moving into the process of adding Angular Material components, you will need to update the `main.ts` file to apply `hammer.js`:

```typescript
import 'hammerjs';

// ... everything else ...
```

With these changes in place, you have properly installed and configured Angular Material in your application. So, it's a good time to save your work:

```bash
git add . && git commit -m "installing and configuring Angular Material"
```

### Using Angular Material Components

Now that you finished configuring Angular Material, you can move forward and make use of the first components to build an appealing UI. More precisely, you will start by using the Toolbar and Button components to add a navigation bar to the top of your application.

To use these components, you will need to add them to your `AppModule`. So, open the `app.module.ts` file and update it as follows:

```typescript
import {MatToolbarModule, MatButtonModule} from '@angular/material';
// ... other imports ...

// ... const appRoutes

@NgModule({
  // ... declarations ...
  imports: [
    // ... other imports ...
    MatToolbarModule,
    MatButtonModule,
  ],
  // ... providers and boostrap ...
})
// ... export class AppModule ...
```

Then, you can refactor the `AppComponent` class to use these components. So, open the `app.component.ts` file and replace its code with the following one:

```typescript
import {Component, OnInit} from '@angular/core';
import * as Auth0 from 'auth0-web';

@Component({
  selector: 'app-root',
  template: `
    <mat-toolbar color="primary" class="mat-elevation-z10">
      <button mat-button>Online Exams</button>
      <button mat-button>About</button>
    
      <!-- This fills the remaining space of the current row -->
      <span class="fill-remaining-space"></span>
    
      <button mat-button (click)="signIn()" *ngIf="!authenticated">Sign In</button>
      <button mat-button (click)="signOut()" *ngIf="authenticated">Sign Out</button>
    </mat-toolbar>
    
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  authenticated = false;

  signIn = Auth0.signIn;
  signOut = Auth0.signOut;

  ngOnInit() {
    const self = this;
    Auth0.subscribe((authenticated) => (self.authenticated = authenticated));
  }
}
```

The new version of this file adds the `mat-toolbar` element to the top of the page with four buttons:

1. _Online Exams_: You will make this button redirect users to the home page.
2. _About_: You will create a view called _About_ and make this button redirect users there.
3. _Sign In_: You added this button to allow visitors to sign in into your application.
4. _Sign Out_: You added this button to allow users to close their current session.

What is interesting about these changes is that, since the `AppComponent` also defines where other views will appear (through the `router-outlet` element), the `mat-toolbar` element will be visible to all your views.

Note that you also made use of the Button component provided by the Angular Material framework by adding the `mat-button` directive to `button` elements. Besides that, you have added a `span` element to your toolbar that uses a class called `fill-remaining-space`. The goal of this class is to make this element fill all the unused space in the navbar. As you haven't defined the rules of this class yet, open the `app.component.css` file and add the following code to it:

```css
.fill-remaining-space {
  /* This fills the remaining space, by using flexbox.
     Every toolbar row uses a flexbox row layout. */
  flex: 1 1 auto;
}
```

Now, as you have moved the _Sign In_ and _Sign Out_ buttons to the `AppComponent`, you can remove them and the related code from the `ExamsComponent`. So, open the `exams.component.ts` file and replace its code with this:

{% highlight html %}
{% raw %}
import * as Auth0 from 'auth0-web';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {Exam} from './exam.model';
import {ExamsApiService} from './exams-api.service';

@Component({
  selector: 'exams',
  template: `
    <div>
      <button routerLink="/new-exam">New Exam</button>
      <ul>
        <li *ngFor="let exam of examsList">
          {{exam.title}}
        </li>
      </ul>
    </div>
  `
})
export class ExamsComponent implements OnInit, OnDestroy {
  examsListSubs: Subscription;
  examsList: Exam[];
  authenticated = false;

  constructor(private examsApi: ExamsApiService) { }

  ngOnInit() {
    this.examsListSubs = this.examsApi
      .getExams()
      .subscribe(res => {
          this.examsList = res;
        },
        console.error
      );
    const self = this;
    Auth0.subscribe((authenticated) => (self.authenticated = authenticated));
  }

  ngOnDestroy() {
    this.examsListSubs.unsubscribe();
  }
}
{% endraw %}
{% endhighlight %}

That's it! If you run your application now, you will see a nice _blueish_ navigation bar.

```bash
# not really needed, but if you want to see exams run the Flask app
cd ../backend
./bootstrap.sh &
cd ../frontend

# start the local development server
npm start
```

![Using Angular Material Navbar on Python, Flask, and Angular app.](https://cdn.auth0.com/blog/flask-angular/angular-material-navbar.png)

Before proceeding to the next section, save your work!

```bash
git add . && git commit -m "adding navbar to the Angular app"
```

{% include tweet_quote.html quote_text="Using Angular Material is easy and straightforward." %}

### Using Angular Material Cards

After adding a nice navigation bar to your Angular application, you can enhance the look and feel of the view that shows existing exams. In this view, you can use [the Card component](https://material.angular.io/components/card/overview) to show each exam in separately and some nice action buttons to enable users to add new exams and to start practicing their knwoledge.

To make these changes in your app, you will need to update the `app.module.ts` file as follows:

```typescript
import {
  MatToolbarModule, MatButtonModule, MatCardModule
} from '@angular/material';

// ... other imports and appRoutes defintion ...

@NgModule({
  // ... declarations ...
  imports: [
    // ... other imports ...
    MatCardModule,
  ],
  // ... providers and bootstrap ...
})
// ... export class AppModule ...
```

After that, you will have to change the `template` property of the `ExamsComponent` and add a style sheet (`styleUrls`) to it. So, open the `exams.component.ts` file and update it as follows:

{% highlight html %}
{% raw %}
// ... import statements ...

@Component({
  selector: 'exams',
  template: `
    <h2>Exams</h2>
    <p>Choose an exam and start studying.</p>
    <div class="exams">
      <mat-card class="example-card" *ngFor="let exam of examsList" class="mat-elevation-z5">
        <mat-card-content>
          <mat-card-title>{{exam.title}}</mat-card-title>
          <mat-card-subtitle>{{exam.description}}</mat-card-subtitle>
          <p>
            Etiam enim purus, vehicula nec dapibus quis, egestas eu quam.
            Nullam eleifend auctor leo, vitae rhoncus mi sodales vel.
            Aenean fermentum laoreet volutpat. Integer quam orci,
            molestie non nibh suscipit, faucibus euismod sapien.
          </p>
          <button mat-raised-button color="accent">Start Exam</button>
        </mat-card-content>
      </mat-card>
    </div>
    <button mat-fab color="primary" *ngIf="authenticated"
            class="new-exam" routerLink="/new-exam">
      <i class="material-icons">note_add</i>
    </button>
  `,
  styleUrls: ['exams.component.css'],
})
// ... export class ExamsComponent ...
{% endraw %}
{% endhighlight %}

In this version of the `ExamsComponent`, you are iterating over the `examsList`retrieved from the Flask application to create `mat-card` elements. Each of these elements is composed of a `mat-card-title` to show the exams titles and a `mat-card-subtitle` to show its descriptions. Also, you added a `p` element with some placeholder text to simulate the long description property of the exams. Soon, you will replace this placeholder with real data retrieved from the backend. Still on the `mat-card` elements, you are adding a pink action button (`<button mat-raised-button color="accent"`) that will enable users to start taking the exam in question.

Lastly, you are adding another action button, this time blue (`<button mat-fab color="primary" ...`), to enable authenticated users (`*ngIf="authenticated"`) to access the form where users can add new exams.

Now, to make your UI more appealing, you will need to create the `exams.component.css` file in the same directory of `exams.component.ts` and add the following code to it:

```css
div.exams {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 15px;
}

button.new-exam {
  position: fixed;
  bottom: 15px;
  right: 15px;
}

@media (max-width: 720px) {
  div.exams {
    grid-template-columns: 1fr;
  }
}
```

These CSS rules take advantage of [the Grid layout system](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout) to show two colums of exams on large devices and a single column on smaller ones (`max-width: 720px`). It also defines that the button to add new exams will stay fixed on the screen on the bottom right corner.

After refactoring the `ExamsComponent`, you will need to make a small change to the `AppComponent` to set a maximum width to your views and to make them appear in the middle of the screen on large devices. So, open the `app.component.ts` file and encapsulate the `<router-outlet></router-outlet>` element inside a new `div`:

{% highlight html %}
{% raw %}
<div class="view-container">
  <router-outlet></router-outlet>
</div>
{% endraw %}
{% endhighlight %}

Then, in the `app.component.css` file, add the following rule:

```css
/* ... other rules ... */

div.view-container {
  padding: 15px;
  margin: 0 auto;
  max-width: 940px;
}
```

Now, if you check your Angular application again (remember, you can always start it by simply issuing `npm start` in the `frontend` directory), you will see a screen similar to the following one:

![Using Angular Material Cards and CSS Grid layout to make beautiful and modern applications.](https://cdn.auth0.com/blog/flask-angular/exams-list.png)

In the screen, the user is signed in (hence, the _Sign Out_ button and the action button to add new exams) and there are three exams persistend on the backend.

Not bad, huh? Time to save your work:

```bash
git add . && git commit -m "using Angular Material Cards and CSS Grid layout to show exams"
```

## Handling Authorization Through Roles

Now that you enhanced the UI of your application, it's time to add more features like the possibility to update and remove existing exams.

So, open [the _Rules_ section on your Auth0 dashboard](https://manage.auth0.com/#/rules) and hit the _Create Rule_ button. Then, in the _Pick a rule template_ page, click on the _empty rule_ option. After that, Auth0 will redirect you to a form with two fields, one to input the name of the rule (you can call it _Online Exams Roles_) and one to input its source code.

After defining a name for your rule, paste the following code to it:

```javascript
// Set 'admin' role for bruno.krebs@auth0.com and 'user' for everyone else
// Save app_metadata to ID and access tokens
function (user, context, callback) {
  user.app_metadata = user.app_metadata || {};
  var addRolesToUser = (user, cb) => {
    if (user.email && user.email === 'bruno.krebs@auth0.com') {
      cb(null, ['admin']);
    } else {
      cb(null, ['user']);
    }
  };

  addRolesToUser(user, async (err, roles) => {
    if (err) return callback(err);

    try {
      user.app_metadata.roles = roles;
      await auth0.users.updateAppMetadata(user.user_id, user.app_metadata)
      const namespace = 'https://online-exams.com/roles';
      const userRoles = user.app_metadata.roles;
      context.idToken[namespace] = userRoles;
      context.accessToken[namespace] = userRoles;
      callback(null, user, context);
    } catch(err) {
      callback(err);
    }
  });
}
```

This rule is quite simple. It just checks the `email` address of the user that is authenticating and, if it is `bruno.krebs@auth0.com`, it sets the `admin` role to them. If it is not this email address, it sets `user` as the user's role. You will want to replace the email address used in the code snippet above with your own one.

> **Note:** The namespace identifier used above can be any non-Auth0 HTTP or HTTPS URL and does not have to point to an actual resource. Auth0 enforces this recommendation from OIDC regarding additional claims and will _silently exclude_ any claims that do not have a namespace. You can read more about [implementing custom claims with Auth0 here](https://auth0.com/docs/scopes/current#custom-claims).

## Conclusion and Next Steps
