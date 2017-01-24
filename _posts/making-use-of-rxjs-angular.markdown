---
layout: post
title: "Making use of RxJS in Angular"
description: "Angular is built on the top of RxJS. It can be helpful for the app, too."
date: 2016-09-14 10:00
author:
  name: "Wojciech Kwiatek"
  url: "https://twitter.com/WojciechKwiatek"
  mail: "wojtek.kwiatek@gmail.com"
  avatar: "https://en.gravatar.com/userimage/102277541/a28d70be6ae2b9389db9ad815cab510e.png?size=200"
design:
  bg_color: "#171717"
  image: ""
tags:
- angular2
- angularjs
- rxjs
- functional
- async
related:
-
-
-

---

---

**TL;DR** Angular incorporates RxJS and uses it internally. We can make use of some RxJS goodies and introduce FRP to write more robust code.

---

If you're new to RxJS, I recommend reading [Understanding Reactive Programming and RxJS](https://auth0.com/blog/understanding-reactive-programming-and-rxjs/) before proceeding.

RxJS is all about streams, operators to modify them, and observables.

## Functional Reactive Programming
FRP has recently become a buzzword. To give you a deeper understanding on that topic, there is an awesome post from Andre Stalz -- [The introduction to Reactive Programming you've been missing](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754). What you should know from this comprehensive post? Reactive programming is actually programming with asynchronous data streams, such as RxJS streams. But where does the word *functional* come into play? Functional is about how we can modify these streams and create another. A stream can be used as an input to another stream. We have a bunch of operators in RxJS to do things like this. So, can we do some of FRP with RxJS? The short answer is: yes! And we'll do so with Angular.

## RxJS in Angular
When we want to start playing with RxJS in Angular, all we need to do is add operators we want to use. The RxJS itself is Angular dependency so it's ready to use.

### Passing observables to the view
We are about to start with some observables created ad hoc. Let's create an observable from the JavaScript array:

```ts
const items = Observable.of([1, 2, 3])
```

Now, we can use the created observable as component's property and pass it into the view. Angular introduced a new filter, which will be a perfect fit here. It's called `async`. Its purpose is to unwrap promises and observables. In the case of an observable it'll pass the last value of the observable:


```ts
import { Component } from '@angular/core'
import { Observable } from 'rxjs/Rx'

@Component({
  selector: 'my-app',
  template: `
    <ul>
      <li *ngFor="let item of items | async">
        {{ item }}
      </li>
    </ul>
  `
})
export class AppComponent {
  public items = Observable.of([1, 2, 3])
}
```

We should see a list of elements in the browser.

This is our *hello world* example to see how the `async` works and what can we use it for.

### Http
Angular relies on RxJS in some of the internal features. One of the most well-known services is *Http*. In Angular 1.x, *Http* was a promise-based service. In Angular, it's based on observables. This means that we can also make use of the `async` pipe here. Let's try to create a real-world example with service now. We want to fetch a list of repos authored by Auth0 on GitHub:

```ts
import { Injectable } from '@angular/core'
import { Http } from '@angular/http'
import { Observable } from 'rxjs/Rx'
import 'rxjs/add/operator/map'

@Injectable()
export class RepoService {
  constructor(private _http: Http) {}

  getReposForUser(user: string): Observable<any> {
    return this._http
      .get(`https://api.github.com/users/${user}/repos`)
      .map((res: any) => res.json())
  }
}
```

Here, we have the service, which exposes the `getReposForUser` method to make an http call. Note the return type of the method -- it's an `Observable<any>`. Now, we can add it into the module and use it in the component:

```ts
@Component({
  selector: 'my-app',
  template: `

  `,
})
export class AppComponent {
  public repos: Observable<any>

  constructor(repoService: RepoService) {
    this.repos = repoService.getReposForUser('auth0')
    console.log(this.repos)
  }
}
```

Something important has just happened. You can take a look into the *Network* tab of your developer tools in the browser. No call was made. Let's add the `for` loop with the `async` pipe:

```ts
@Component({
  selector: 'my-app',
  template: `
    <ul>
      <li *ngFor="let repo of repos | async">
        {{ repo.name }}
      </li>
    </ul>
  `,
})
export class AppComponent {
  public repos: Observable<any>

  constructor(repoService: RepoService) {
    this.repos = repoService.getReposForUser('auth0')
  }
}
```

Now the call for repositories is fired, and we can see that the list of repos has been fetched correctly. Why is that?

## Hot and cold observables
The `http.get` observable above is **cold**: that means each subscriber sees the same events from the beginning. It's independent of any other subscriber. It also means that if there's no subscriber, no value is emitted! See this one in action:

```ts
export class AppComponent {
  public repos: Observable<any>

  constructor(repoService: RepoService) {
    this.repos = repoService.getReposForUser('auth0')
    this.repos.subscribe()
    this.repos.subscribe()
  }
}
```

Now you'll be able to see three calls. You can now see one more thing -- `async` makes a subscription under the hood.

On the other hand, we have **hot** observables. The difference is, no matter how many subscribers there are, the observable starts just once. And we can make our observable hot, instead of cold, by using the `share` operator:

```ts
// ...
import 'rxjs/add/operator/share'

@Injectable()
export class RepoService {
  constructor(private http: Http) {}

  getReposForUser(user: string): Observable<any> {
    return this.http
      .get(`https://api.github.com/users/${user}/repos`)
      .map((res: any) => res.json())
      .share()
  }
}
```

Now you should see just one call. If you want to go deeper with the topic, here is the [Hot vs Cold Observables](http://medium.com/@benlesh/hot-vs-cold-observables-f8094ed53339) article by Ben Lesh.

## Programming the reactive way in Angular

### Handling events
We've covered how you've probably used RxJS observables for *Http* in Angular, even if you weren't aware of it. However, there are more things to do with streams, even if Angular doesn't require you to do so. Now we move on to the *on click* events. The traditional, imperative way of handling click events in Angular is as follows:

```ts
@Component({
  selector: 'my-app',
  template: `
    <button (click)="handleButtonClick(1)">
      Up Vote
    </button>
  `,
})
export class AppComponent {
  handleButtonClick(value: number) {
    console.log(value)
  }
}
```

We can create a stream of click events using RxJS `Subject`. *Subject* is the observer and observable at once. It means it can emit value (using `.next()`), and you can subscribe to it (using `subscribe`).

Here, you can see the same case achieved with functional approach using RxJS:

```ts
@Component({
  selector: 'my-app',
  template: `
    <button (click)="counter$.next(1)">
      Up Vote
    </button>
  `,
})
export class AppComponent {
  public counter$: Observable<number> = new Subject<number>()

  constructor() {
    this.counter$.subscribe(console.log.bind(console))
  }
}
```

It's not much different than the previous one, though. Let's try to add some more logic there. Like making sum of clicks and printing some text instead of just number.

```ts
@Component({
  selector: 'my-app',
  template: `
    <button (click)="counter$.next(1)">
      Up Vote
    </button>
  `,
})
export class AppComponent {
  public counter$: Observable<string> = new Subject<number>()
    .scan((acc: number, current: number): number => acc + current)
    .map((value: number): string => `Sum of clicks: ${value}`)

  constructor() {
    this.counter$.subscribe(console.log.bind(console))
  }
}
```

The key point is that *we define how the clicks stream will behave.* We say that we don't really need clicks but only the sum of them with some prepended text. And this sum will be our stream, not the pure click events. And we subscribe to the stream of summed values. In other words, *the key of functional programming is to make the code declarative, not imperative.*

### Communication between components
Let's briefly address communication between Angular components using an RxJS approach. It's actually about dumb components in the RxJS approach of an Angular world. Last time I described the [change detection of Angular](https://auth0.com/blog/understanding-angular-2-change-detection/) and what we can do with it to fine-tune the app. We'll add the component with `clicks$` stream as the input.

```ts
import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

@Component({
  selector: 'my-score',
  template: 'Summary: {{ score }}',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScoreComponent {
  @Input() public score: number
}
```

Note that the component has `ChangeDetectionStrategy.OnPush` turned on, so this means that we assume that the new reference will come as the input. The component accepts a numeric parameter, but there is no reference to streams. We can handle this with the `async` pipe:

```ts
@Component({
  selector: 'my-app',
  template: `
    <button (click)="counter$.next(1)">
      Up Vote
    </button>
    <my-score [score]="counter$ | async"></my-score>
  `,
})
export class AppComponent {
  public counter$: Observable<number> = new Subject<number>()
    .scan((acc: number, current: number): number => acc + current)
}
```

### Forms
Another place when you can use a power of RxJS are forms. We can use all of the knowledge that we have gained up to this point and see how we can create a reactive login form.

First, let's start with adding `ReactiveFormsModule` from `@angular/forms` to the module. Then we can make use of the reactive forms introduced in Angular. Here's how it can look:

```ts
import { FormBuilder, FormGroup } from '@angular/forms'

@Component({
  selector: 'my-app',
  template: `
    <form
      [formGroup]="loginForm"
    >
      <label>Login:</label>
      <input
        formControlName="login"
        type="text"
      >

      <label>Password:</label>
      <input
        formControlName="password"
        type="password"
      >

      <button type="submit">Submit</button>
    </form>
  `,
})
export class AppComponent implements OnInit {
  public loginForm: FormGroup

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      login: '',
      password: '',
    })
  }
}
```

We now have a few additional blocks:
- `formControlName` -- added to match names from templates to the appropriate fields in the controller
- `formBuilder.group` -- creates the form
- `[formGroup]` -- connects the template and the controller

We can now use the `valueChanges` observable:

```ts
// ...
    this.loginForm.valueChanges.subscribe(console.log.bind(console))
// ...
```

Now, each changed field will emit an event and will be logged to the console. This offers many possibilities since we can take advantage of any operator that RxJS provides. In this example, let's focus on submitting the form in a reactive way. We can put `(submit)` on the form:

```ts
@Component({
  selector: 'my-app',
  template: `
    <form
      [formGroup]="loginForm"
      (submit)="submit$.next()"
    >
    <!-- ... -->
  `
})
// ...
export class AppComponent {
  public loginForm: FormGroup
  private submit$: Observable<any> = new Subject()

// ...
```

We now have a stream of submit events and a stream of values. All that remains is to combine these streams. The resulting stream will emit the current state of the fields when the form is submitted. The desired behavior can be achieved by using the [withLatestFrom](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-withLatestFrom) operator of RxJS. The combined stream is as follows:

```ts
// ...
    this.submit$
      .withLatestFrom(this.loginForm.valueChanges, (_, values) => values)
      .subscribe(values => {
        console.log('submitted values', values)
      })
// ...
```

We now have combined streams, and the logic is consolidated. It can be written in a single line. Just to recap, here is the final code for the form component:

```ts
@Component({
  selector: 'my-app',
  template: `
    <form
      [formGroup]="loginForm"
      (submit)="submit$.next()"
    >
      <label>Login:</label>
      <input
        formControlName="login"
        type="text"
      >

      <label>Password:</label>
      <input
        formControlName="password"
        type="password"
      >

      <button type="submit">Submit</button>
    </form>
  `,
})
export class AppComponent {
  public loginForm: FormGroup
  private submit$: Observable<any> = new Subject()

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      login: '',
      password: '',
    })

    this.submit$
      .withLatestFrom(this.loginForm.valueChanges, (_, values) => values)
      .subscribe(values => {
        console.log('submitted values', values)
      })
  }
}
```

## Conclusion
Angular has a lot more features than meets the eye. RxJS is, in my personal opinion, one of the best of them. It can rocket the app to the next level in term of maintainability and clarity. The future is more declarative, less imperative code.

RxJS can appear intimidating at first, but once you’re familiar with its functionality and operators, it supplies many benefits (such as defining logic at the declaration time). All of this is to say, the code is easier to understand than imperative one. RxJS requires a different mode of thinking, but it is very worthwhile to learn and use.
