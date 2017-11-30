---
layout: post
title: "RxJS Advanced Tutorial With Angular & Web Speech: Part 2"
description: "Build an app to learn about the power and flexibility of RxJS in Angular while exploring speech recognition with Web Speech API."
date: 2017-09-26 8:30
category: Technical Guide, Angular, Angular 4
banner:
  text: "Auth0 makes it easy to add authentication to your Angular application."
author:
  name: "Kim Maida"
  url: "https://twitter.com/KimMaida"
  mail: "kim.maida@auth0.com"
  avatar: "https://en.gravatar.com/userimage/20807150/4c9e5bd34750ec1dcedd71cb40b4a9ba.png"
design:
  image: https://cdn.auth0.com/blog/madlibs/Logo.png
  bg_color: "#222228"
tags:
- rxjs
- angular
- javascript
- web api
related:
- 2017-09-20-rxjs-advanced-tutorial-with-angular-web-speech-part-1
- 2017-06-28-real-world-angular-series-part-1
- 2017-02-13-making-use-of-rxjs-angular
---

**TL;DR:** In this 2-part tutorial series, we'll learn how to build a small app with some big concepts. We'll cover reactive programming with [Reactive Extensions (Rx*)](http://reactivex.io/), JS framework component interaction in [Angular](https://angular.io), and speech recognition with the [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API). The completed Madlibs app code can be found at [this GitHub repo](https://github.com/auth0-blog/madlibs).

---

This is **Part 2** of our 2-part tutorial. [RxJS Advanced Tutorial With Angular & Web Speech: Part 1](https://auth0.com/blog/rxjs-advanced-tutorial-with-angular-web-speech-part-1) covered the following:

* Introduction to reactive programming with Rx* and observables
* Setting up our Angular app
* Integrating the Annyang library for speech recognition support
* Implementing a form component allowing users to speak or type words to use in the madlib story

In Part 2, we will cover:

* Keyboard component fallback if user's browser does not support speech recognition
* Generating words by fetching them from an API
* RxJS operators to work with API requests
* Creating an observable for a Progress Bar component
* Displaying the user's madlib story
* Aside: authentication of an Angular app and Node API with Auth0

Let's pick up right where we left off.

## Angular App Keyboard Component

[Not all browsers support speech recognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition#Browser_compatibility). If we view our app right now in a browser that doesn't, we'll see nothing but a header. An app that doesn't work in most browsers isn't useful. Let's make a Keyboard component to use in place of the Listen component so users with unsupported browsers can still create a fun madlib using the Words Form component.

{% include tweet_quote.html quote_text="An app that doesn't work in most browsers isn't useful: implement fallbacks for browsers that don't support features." %}

Create another new component with the Angular CLI like so:

```bash
$ ng g component keyboard
```

### Keyboard Component Class

Open the `keyboard.component.ts` file and implement the following code:

```js
// src/app/keyboard/keyboard.component.ts
import { Component } from '@angular/core';
import { Words } from './../words';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss']
})
export class KeyboardComponent {
  nouns: string[] = new Words().array;
  verbs: string[] = new Words().array;
  adjs: string[] = new Words().array;

  constructor() { }

}
```

This is a very simple component that primarily consists of a template. It is, however, still going to be a parent component (with Words Form as a child), so we'll import the `Words` class and set up the `nouns`, `verbs`, and `adjs` arrays like we did in the Listen component. We can then pass these as inputs to the Words Form component.

### Keyboard Component Template

Let's open the `keyboard.component.html` file and add our template:

{% highlight html %}
<!-- src/app/keyboard/keyboard.component.html -->
<div class="alert alert-info mt-3">
  <h2 class="text-center mt-3">Type Words to Play</h2>

  <p>You may enter your own madlib words in the fields below. Here are some examples:</p>

  <ul>
    <li><strong>Noun:</strong> <em>"cat"</em> (person, place, or thing)</li>
    <li><strong>Verb:</strong> <em>"jumping"</em> (action, present tense), <em>"ran"</em> (action, past tense)</li>
    <li><strong>Adjective:</strong> <em>"flashy"</em> (describing word)</li>
  </ul>
</div>

<app-words-form
  [nouns]="nouns"
  [verbs]="verbs"
  [adjs]="adjs"></app-words-form>
{% endhighlight %}

This simply adds some instructions similar to the Listen component and displays the `WordsForm` component.

### Add Keyboard Component to App Component

Now let's display the Keyboard component instead of the Listen component if speech is not supported. Open the `app.component.html` template and make the following addition:

{% highlight html %}
<!-- src/app/app.component.html -->
<div class="container">
  <h1 class="text-center">Madlibs</h1>
  <app-listen *ngIf="speech.speechSupported"></app-listen>
  <app-keyboard *ngIf="!speech.speechSupported"></app-keyboard>
</div>
{% endhighlight %}

Now if speech recognition is not supported, the user will see the Keyboard component and can still enter words manually with the form. The app should look like this in a browser that doesn't support speech recognition:

![Angular RxJS speech not supported Madlibs app](https://cdn.auth0.com/blog/madlibs/ff-keyboard.jpg)

## Generate Words With Madlibs API

Now that we can speak and type words to generate a madlib, there's one more method we want to offer to users to create their custom story: automatic word generation using a prebuilt [Node API](https://github.com/kmaida/madlibs-api).

### Set Up Madlibs API

Clone the [madlibs-api](https://github.com/kmaida/madlibs-api) locally to a folder of your choosing. Then open a command prompt or terminal window in that folder and run the following commands:

```bash
$ npm install
$ node server
```

This will install the required dependencies and then run the API on `localhost:8084`. You should be able to visit the API in the browser at [http://localhost:8084/api](http://localhost:8084/api) to confirm it's working properly. You can then access its endpoints. Check out the [repository's README](https://github.com/kmaida/madlibs-api/blob/master/README.md) to see all the available endpoints. You can try them out in the browser to see what they return (for example, [http://localhost:8084/api/noun](http://localhost:8084/api/noun)). Take a minute to become familiar with the API and its endpoints and give some thought to how we might leverage the API in our application to generate arrays of the different parts of speech.

### Intended Functionality to Generate Words With API

Now that you have the madlibs API set up and running and you've familiarized yourself with how it works, let's consider what our intended functionality is.

Recall the specifics of what we're expecting the user to respond with based on our word arrays and the Words Form placeholders. In order to generate the appropriate words automatically, we'll need the following from the API:

* An array containing 5 nouns: 1 person, 2 places, and 2 things
* An array containing 5 verbs: 2 present tense and 3 past tense
* An array containing 5 adjectives

The API, however, does not return arrays, it returns single text strings. Also, we have different endpoints for people, places, things, present and past tenses, etc. How can we reconcile the API functionality with our requirements?

Luckily, we have RxJS available to us! Let's explore how we can use this powerful library to get exactly what we want from the API.

### Add HTTP to App Module

The first thing we need to do is add [Angular HTTP](https://angular.io/guide/http) to our App module. Open the `app.module.ts` file and add:

```js
// src/app/app.module.ts
...
import { HttpClientModule } from '@angular/common/http';
...

@NgModule({
  ...,
  imports: [
    ...,
    HttpClientModule
  ],
  ...
```

We'll import the `HttpClientModule` and add it to the NgModule's `imports` array, making the module available to our application.

### Add HTTP Requests to Madlibs Service

Now open the `madlibs.service.ts` file. We'll add our HTTP requests to this file.

```js
// src/app/madlibs.service.ts
...
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/zip';
import 'rxjs/add/observable/forkJoin';

@Injectable()
export class MadlibsService {
  ...
  private _API = 'http://localhost:8084/api/';

  constructor(private http: HttpClient) { }

  ...
  
  private _stringSuccessHandler(res: string): string {
    // Remove all double quotes from response
    // This is a product of receiving text response
    return res.replace(/"/g, '');
  }

  private _errorHandler(err: HttpErrorResponse | any) {
    const errorMsg = err.message || 'Error: Unable to complete request.';
    return Observable.throw(errorMsg);
  }  

  getNouns$() {
    const nounPerson$ = this.http
      .get(`${this._API}noun/person`, {responseType: 'text'})
      .map(this._stringSuccessHandler)
      .catch(this._errorHandler);

    const nounPlace$ = this.http
      .get(`${this._API}noun/place`, {responseType: 'text'})
      .map(this._stringSuccessHandler)
      .catch(this._errorHandler);

    const nounThing$ = this.http
      .get(`${this._API}noun/thing`, {responseType: 'text'})
      .map(this._stringSuccessHandler)
      .catch(this._errorHandler);

    return Observable.forkJoin([nounPerson$, nounPlace$, nounPlace$, nounThing$, nounThing$]);
  }

  getVerbs$() {
    const verbPresent$ = this.http
      .get(`${this._API}verb/present`, {responseType: 'text'})
      .map(this._stringSuccessHandler)
      .catch(this._errorHandler);

    const verbPast$ = this.http
      .get(`${this._API}verb/past`, {responseType: 'text'})
      .map(this._stringSuccessHandler)
      .catch(this._errorHandler);

    return Observable.forkJoin([verbPresent$, verbPresent$, verbPast$, verbPast$, verbPast$]);
  }

  getAdjs$() {
    const adj$ = this.http
      .get(`${this._API}adjective`, {responseType: 'text'})
      .map(this._stringSuccessHandler)
      .catch(this._errorHandler);

    return Observable.forkJoin([adj$, adj$, adj$, adj$, adj$]);
  }

  getWords$() {
    return Observable
      .zip(this.getNouns$(), this.getVerbs$(), this.getAdjs$())
      .map((res) => {
        return {
          nouns: res[0],
          verbs: res[1],
          adjs: res[2]
        };
      });
  }

}
```

Let's go over these additions step by step. First we'll add some new imports: `HttpClient` and `HttpErrorResponse` from Angular common, `Observable` from RxJS, and the `map` and `catch` RxJS operators.

Next we'll add some new properties: `_API` to store the API URI and a `words` object to store the words retrieved from the API.

We'll make `HttpClient` available to our component in the constructor.

Next we have our private `_stringSuccessHandler()`. This method takes a text HTTP response and strips the double quotes (`"`) that are automatically added to it, leaving just the word. We'll use this success handler with all of our API requests that return a text response.

The private `_errorHandler()` method cancels the observable with an error message in case something went wrong with the request.

#### Combining Observables With ForkJoin

Next, let's take a closer look at the `getNouns$()` method (and the two methods that follow it, `getVerbs$()` and `getAdjs$()`).

```js
  getNouns$() {
    const nounPerson$ = this.http
      .get(`${this._API}noun/person`, {responseType: 'text'})
      .map(this._stringSuccessHandler)
      .catch(this._errorHandler);

    const nounPlace$ = this.http
      .get(`${this._API}noun/place`, {responseType: 'text'})
      .map(this._stringSuccessHandler)
      .catch(this._errorHandler);

    const nounThing$ = this.http
      .get(`${this._API}noun/thing`, {responseType: 'text'})
      .map(this._stringSuccessHandler)
      .catch(this._errorHandler);

    return Observable.forkJoin([nounPerson$, nounPlace$, nounPlace$, nounThing$, nounThing$]);
  }
```

Notice that there are three HTTP requests declared as constants in the `getNouns$()` function: one each for retrieving a person, place, and thing. Each `GET` request expects a `responseType: 'text'`. Each [text request](https://angular.io/guide/http#requesting-non-json-data) is then `map`ped with our `_stringSuccessHandler` and has a `catch` method with our `_errorHandler` in case something went wrong. Recall that our app expects an _array_ of nouns that includes _one person_, _two places_, and _two things_. Now that we have `nounPerson$`, `nounPlace$`, and `nounThing$` observables set up, we can use the [RxJS combination operator `forkJoin`](https://www.learnrxjs.io/operators/combination/forkjoin.html) to execute all observables at the same time and then emit the last value from each one once they are all complete.

We'll `return Observable.forkJoin()`, passing in the array of observables we'd like to use in the expected order. If all requests are successful, subscribing to this observable will produce an array that looks like this:

```js
[person, place, place, thing, thing]
```

We'll use `forkJoin` again with our `getVerbs$()` method to return a stream that emits an array of verbs in the following tenses:

```js
[present, present, past, past, past]
```

To get adjectives, we'll `forkJoin` an adjective request five times, since all adjectives are the same, but each one requires its own request. This will result in:

```js
[adjective, adjective, adjective, adjective, adjective]
```

#### Combining Observables With Zip

Now we have observables for each of the three parts of speech our app expects: `getNouns$()`, `getVerbs$()`, and `getAdjs$()`. However, these are still separate streams. Ultimately, we _don't_ want to subscribe to three different observables and wait for each to emit independently.

Thanks again to RxJS, we can combine all three streams into a _single_ observable: `getWords$()`. The [`zip` combination operator](https://www.learnrxjs.io/operators/combination/zip.html) allows us to pass multiple observables as arguments. After _all_ the observables have emitted, the zipped observable emits the results in an array.

```js
  getWords$() {
    return Observable
      .zip(this.getNouns$(), this.getVerbs$(), this.getAdjs$())
      .map((res) => {
        return {
          nouns: res[0],
          verbs: res[1],
          adjs: res[2]
        };
      });
  }
```

Once we receive the resulting array that includes the zipped arrays from the nouns, verbs, and adjectives observables, we'll `map` the response to an easy-to-read object.

We can now subscribe to the `getWords$()` observable in components and receive an object that looks like this:

```js
{
  nouns: [person, place, place, thing, thing],
  verbs: [present, present, past, past, past],
  adjs: [adjective, adjective, adjective, adjective, adjective]
}
```

This is exactly what we want from the API when generating words, and it's easy to accomplish, thanks to RxJS.

{% include tweet_quote.html quote_text="RxJS operators like forkJoin and zip make it simple to combine HTTP request observables." %}

## Generate Words Component

Now that we've implemented the necessary methods to get nouns, verbs, and adjectives from the API, it's time to put them to use in our application.

Let's create a Generate Words component. This component will use the Madlibs service to set up a subscription to fetch the words from the API when the user clicks a button. It will then emit an event containing the API data so that other components (such as the Words Form component) can use that data.

Generate the new component:

```bash
$ ng g component generate-words
```

### Generate Words Component Class

Open the `generate-words.component.ts` file and add the following code:

```js
// src/app/generate-words/generate-words.component.ts
import { Component, Output, OnDestroy, EventEmitter } from '@angular/core';
import { MadlibsService } from './../madlibs.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-generate-words',
  templateUrl: './generate-words.component.html',
  styleUrls: ['./generate-words.component.scss']
})
export class GenerateWordsComponent implements OnDestroy {
  @Output() fetchedWords = new EventEmitter;
  wordsSub: Subscription;
  loading = false;
  generated = false;
  error = false;

  constructor(private ml: MadlibsService) { }

  fetchWords() {
    this.loading = true;
    this.generated = false;
    this.error = false;

    this.wordsSub = this.ml.getWords$()
      .subscribe(
        (res) => {
          this.loading = false;
          this.generated = true;
          this.error = false;
          this.fetchedWords.emit(res);
        },
        (err) => {
          this.loading = false;
          this.generated = false;
          this.error = true;
          console.warn(err);
        }
      );
  }

  ngOnDestroy() {
    if (this.wordsSub) {
      this.wordsSub.unsubscribe();
    }
  }
}
```

First we'll add some imports. The [`OnDestroy` lifecycle hook](https://angular.io/guide/lifecycle-hooks#ondestroy) is necessary to clean up subscriptions when the component is destroyed. `Output` and `EventEmitter` are needed to [emit an event from this component to a parent](https://angular.io/guide/component-interaction#parent-listens-for-child-event). Then we'll import our `MadlibsService` to get API data, as well as [`Subscription` from RxJS](http://reactivex.io/rxjs/class/es6/Subscription.js~Subscription.html).

We'll `implement` the `OnDestroy` lifecycle hook when we export our `GenerateWordsComponent` class.

We'll set up an `@Output() fetchedWords = new EventEmitter` property for a [parent component to listen for a child event](https://angular.io/guide/component-interaction#parent-listens-for-child-event). We also need a `wordsSub` subscription to the `getWords$()` observable, and three boolean properties so the UI can reflect the appropriate states of the app: `loading`, `generated`, and `error`.

We'll make `MadlibsService` available to the component in the constructor function.

The `fetchWords()` method will be executed when the user clicks a button to generate words via the API. When run, this function should indicate that the app is `loading`, words have not yet been `generated`, and there are currently no `error`s.

The `wordsSub` subscription should be set up as well. This subscribes to the `getWords$()` observable from the Madlibs service. On successful response, it updates the app states and emits the `fetchedWords` event with a payload containing the API response. If you recall from our code above, this is an object containing the noun, verb, and adjective arrays. If an error occurs, the app states reflect this and a warning is raised in the console.

Finally, in the `ngOnDestroy()` lifecycle function, we'll check to see if the `wordsSub` exists and `unsubscribe()` from it if so.

### Generate Words Component Template

Now open the `generate-words.component.html` template:

{% highlight html %}
<!-- src/app/generate-words/generate-words.component.html -->
<h2 class="text-center mt-3">Generate Words</h2>

<p>You may choose to generate all the necessary madlib words randomly. Doing so will replace any words you may have previously entered.</p>

<p>
  <button
    class="btn btn-primary btn-block"
    (click)="fetchWords()">
      <ng-template [ngIf]="!loading">Generate Words</ng-template>
      <ng-template [ngIf]="loading">Generating...</ng-template>
  </button>
</p>

<p *ngIf="generated" class="alert alert-success">
  <strong>Success!</strong> Madlib words have been generated. Please scroll down to view or edit your words.
</p>

<p *ngIf="error" class="alert alert-danger">
  <strong>Oops!</strong> An error occurred while trying to automatically generate words. Please try again or enter your own words!
</p>
{% endhighlight %}

This is a straightforward template that displays some copy informing the user that they can generate words from the API, but doing so will replace any words they may have already entered using speech recognition or the form.

It shows a button that executes the `fetchWords()` method when clicked and changes label depending on the `loading` state.

If data is successfully `generated` using the API, a "Success!" message is shown. Simultaneously (and behind the scenes), an event is emitted with the API data. If an `error` occurred, an error message is displayed.

## Update Listen and Keyboard Components

We now need to add our Generate Words component to both the Listen and Keyboard Components. We'll also need to add a little bit of functionality to these components so they can listen for the `fetchedWords` event and react to it by updating their local property data with the words from the API.

### Update Listen and Keyboard Component Classes

Open the `listen.component.ts` and `keyboard.component.ts` component classes and add the following method to each file:

```js
// src/app/listen/listen.component.ts
// src/app/keyboard/keyboard.component.ts
...
  onFetchedAPIWords(e) {
    this.nouns = e.nouns;
    this.verbs = e.verbs;
    this.adjs = e.adjs;
  }
  ...
```

This is the handler for the `fetchedWords` event. It takes the event payload and uses it to define the values of the local `nouns`, `verbs`, and `adjs` properties, thus updating all of these arrays to the data from the API.

### Update Listen Component Template

Open the `listen.component.html` template and at the top, add the `<app-generate-words>` element right inside the opening `<div>`:

{% highlight html %}
<!-- src/app/listen/listen.component.html -->
<div class="alert alert-info mt-3">
  <app-generate-words
    (fetchedWords)="onFetchedAPIWords($event)"></app-generate-words>
  ...
{% endhighlight %}

This element listens for the `(fetchedWords)` event and runs the `onFetchedAPIWords($event)` handler when the event is emitted, sending the `$event` data as a parameter.

If speech recognition is supported, the app should now look like this in the browser:

![Madlibs app with Generate Words component - speech recognition supported](https://cdn.auth0.com/blog/madlibs/generate-words-listen.jpg)

### Update Keyboard Component Template

Now open the `keyboard.component.html` template. Below the unordered list in the keyboard instructions, add the Generate Words component like so:

{% highlight html %}
<!-- src/app/keyboard/keyboard.component.html -->
...
  </ul>

  <app-generate-words
    (fetchedWords)="onFetchedAPIWords($event)"></app-generate-words>
</div>
...
{% endhighlight %}

Now both the Listen and Keyboard components support word generation with the API. Make sure the API is running locally.

If speech recognition is _not_ supported, the app should now look like this in the browser:

![Madlibs RxJS Angular app with Generate Words component - no speech recognition](https://cdn.auth0.com/blog/madlibs/generate-words-keyboard.jpg)

### Playing With the API

You (or the user) should now be able to click the "Generate Words" button whether speech recognition is supported or not. The form should populate with words retrieved from the API. If the user clicks the button again, new random words should be fetched and will overwrite any existing words.

In browsers that support speech recognition, the user should be able to delete API-generated words and then use the speech commands to fill them back in. In any browser, the user can edit or replace words manually by typing in the form.

## Progress Bar Component

The next component we're going to add is a bit of flair. It's a progress bar that we'll build with RxJS. Although it won't represent the app actually generating the madlib story (because that happens so quickly a progress indicator would be essentially pointless), it does lend a nice visual and helps us explore another feature of RxJS: creating timer observables.

We'll also call the API and fetch a pronoun while the progress bar is running, but again, with a server running on localhost, this happens so quickly the UI progress bar won't represent the API request and response speed.

> **Note:** If you deploy your Madlibs app to a server, a great exercise would be to modify the progress bar so that it _does_ actually represent the API request in some way.

The progress bar will appear after the user clicks the "Go!" button to generate their madlib. When we're finished, it will look like this in the browser:

![Madlibs Angular RxJS app progress bar](https://cdn.auth0.com/blog/madlibs/progress-bar.gif)

Let's go over the features of our Progress Bar component:

* Subscribe to the Madlibs service's `submit$` subject.
* Replace the submit ("Go!") button with a progress bar.
* Have a timer observable.
* Make an API request for a pronoun which should be stored in the Madlibs service so other components can make use of it.
* The timer observable's subscription should increment the UI to show a progress bar filling up.
* Once the progress bar reaches completion, the Madlib service should be notified so the app knows the madlib story is ready.

As you can see, several of these features rely on the Madlibs service, so let's make some updates there before we tackle the Progress Bar component itself.

### Add Features to the Madlibs Service

Open the `madlibs.service.ts` file:

```js
// src/app/madlibs.service.ts
...
export class MadlibsService {
  ...
  madlibReady = false;
  pronoun: any;

  ...

  setMadlibReady(val: boolean) {
    this.madlibReady = val;
  }

  setPronoun(obj) {
    this.pronoun = obj;
  }

  ...

  getPronoun$() {
    return this.http
      .get(`${this._API}pronoun/gendered`)
      .catch(this._errorHandler);
  }

}
```

First we'll add some new properties: `madlibReady` to indicate when the timer observable has completed, and the `pronoun` object acquired from the API.

We'll need a way for components to set the value of `madlibReady`, so we'll create a setter method called `setMadlibReady()` that accepts a boolean argument that updates the value of the `madlibReady` property.

We'll also need a way for components to set the value of `pronoun`, so we'll create another setter method called `setPronoun()`.

In this fashion, `madlibReady` and `pronoun` are data _stored_ in the Madlibs service, but set by other components. This way, they are accessible anywhere in the app.

Finally, we'll add a `getPronoun$()` HTTP request that returns an observable. This request fetches a pronoun object from our API, which can be accessed via subscription in our Progress Bar component. 

### Progress Bar Component Class

Now let's generate the new Progress Bar component with the Angular CLI:

```bash
$ ng g component progress-bar
```

Open the `progress-bar.component.ts` file:

```js
// src/app/progress-bar/progress-bar.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/takeUntil';
import { MadlibsService } from './../madlibs.service';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit, OnDestroy {
  progress = 0;
  progress$: Observable<number>;
  progressSub: Subscription;
  width: string;
  submitSub: Subscription;
  pronounSub: Subscription;

  constructor(private ml: MadlibsService) { }

  ngOnInit() {
    this._setupProgress();
    this._setupSubmit();
  }

  private _setupProgress() {
    this.progress$ = Observable
      .timer(0, 50)
      .takeUntil(Observable.timer(2850));
  }

  private _getPronoun() {
    this.pronounSub = this.ml.getPronoun$()
      .subscribe(res => this.ml.setPronoun(res));
  }

  private _setupSubmit() {
    this.submitSub = this.ml.submit$
      .subscribe(words => this._startProgress());
  }

  private _startProgress() {
    this._getPronoun();
    this.progressSub = this.progress$
      .subscribe(
        p => {
          this.progress = p * 2;
          this.width = this.progress + '%';
        },
        err => console.warn('Progress error:', err),
        () => this.ml.setMadlibReady(true)
      );
  }

  ngOnDestroy() {
    if (this.progressSub) {
      this.progressSub.unsubscribe();
    }
    if (this.pronounSub) {
      this.pronounSub.unsubscribe();
    }
    this.submitSub.unsubscribe();
  }

}
```

Let's go over this code step by step.

We'll need to import several things. Let's import `OnDestroy` so we can clean up subscriptions when the component is destroyed. We'll also need `Subscription` and `Observable` from RxJS. We'll use methods from `MadlibsService` so we'll import that as well.

Next we'll set up some properties. The `progress` property will be used to track the number (out of 100) that represents the status of the progress bar. The `progress$` property has a type annotation indicating that we'll use it as an observable that emits numbers. We'll then subscribe to this observable with `progressSub`. We'll also create a `width` string to store a style we can use to set width with CSS in the template for the progress bar. Finally, we need `submitSub` and `pronounSub` subscriptions.

We'll make the `MadlibsService` available to the component in our constructor function.

On initialization of the component (`ngOnInit()` lifecycle function), we'll `_setupProgress()` and `_setupSubmit()`.

#### Create Progress Observable

Let's take a closer look at the private `_setupProgress()` method:

```js
  private _setupProgress() {
    this.progress$ = Observable
      .timer(0, 50)
      .takeUntil(Observable.timer(2850));
  }
```

Here we're _creating_ a custom observable. This observable uses the [RxJS `timer` operator](http://reactivex.io/documentation/operators/timer.html). It emits the first value after `0` seconds, and then emits subsequent values every `50` milliseconds.

> **Note:** We want to emit values often to make the animation of our progress bar reasonably smooth in the browser.

The [RxJS `takeUntil` operator](http://reactivex.io/documentation/operators/takeuntil.html) discards any items emitted by our `timer` observable after a second observable (passed as a parameter) emits or terminates. This way, we can end our `timer` observable once a certain amount of time has elapsed. In this case, we'll run our first `timer` observable until a second one has run for `2850`ms. This way, the `progress$` observable runs for long enough to emit values from 0 to 49. We'll work with these values when we _subscribe_ to the `progress$` observable.

#### Get Pronoun and Set Up Submit

Let's review the next two functions.

The private `_getPronoun()` method sets up the `pronounSub` subscription. It uses the Madlibs service method `getPronoun$()`, subscribing to the returned observable. On emission of a value, the Madlibs service method `setPronoun()` is executed, storing the pronoun in the service for access throughout the application.

The private `_setupSubmit()` method sets up the `submitSub` subscription. It subscribes to the Madlibs service's `submit$` subject. On emission of a value (e.g., the words form has been submitted), a `_startProgress()` function is run.

#### Start Progress Bar

The `_startProgress()` function is executed when the user submits the form with their desired words for the madlib story. The method looks like this:

```js
  private _startProgress() {
    this._getPronoun();
    this.progressSub = this.progress$
      .subscribe(
        p => {
          this.progress = p * 2;
          this.width = this.progress + '%';
        },
        err => console.warn('Progress error:', err),
        () => this.ml.setMadlibReady(true)
      );
  }
```

While the progress bar is running, we want to execute `_getPronoun()` to fetch a pronoun from the API. Then we'll subscribe to our `progress$` observable with `progressSub`. This [subscription makes use of the `onNext`, `onError`, and `onCompleted` methods](http://reactivex.io/documentation/operators/subscribe.html).

When a value is successfully emitted, we'll set our `progress` property to the value multipled by `2`. Recall that the values emitted by `progress$` range from 0 to 49. Therefore, the `progress` property will iterate in such a manner:

```js
0, 2, 4, 6, ... 94, 96, 98
```

We also want to create a string value with a `%` symbol after it to style the width of the progress bar, so we'll set the `width` property appropriately.

If an error occurs, we'll log it to the console with a warning.

When the observable completes, we'll use the Madlibs service's `setMadlibReady()` setter method with an argument of `true`. This will update the service's `madlibReady` property, which is accessible throughout the app.

#### Unsubscribe On Destroy

Finally, we have our `ngOnDestroy()` lifecycle function. We'll check if the `progressSub` and `pronounSub` subscriptions exist. If so, we'll unsubscribe from them. They will only exist if the user submitted the words form, thus triggering the progress bar. We'll also unsubscribe from the `submitSub` subscription.

### Progress Bar Component Template

For markup and styling, we'll use the [Bootstrap v4 Progress Bar](https://v4-alpha.getbootstrap.com/components/progress/), so before we go much further, take a moment to familiarize yourself with its markup and customization.

Then open the `progress-bar.component.html` template and add the following markup:

{% highlight html %}
<!-- src/app/progress-bar/progress-bar.component.html -->
<div class="progress">
  <div
    class="progress-bar progress-bar-striped progress-bar-animated bg-success"
    role="progressbar"
    [style.width]="width"
    [attr.aria-valuenow]="progress"
    aria-valuemin="0"
    aria-valuemax="100">
  </div>
</div>
{% endhighlight %}

Most of the markup is standard Bootstrap CSS. However, we have a `[style.width]` attribute which is data bound to our component's `width` property: a string that consists of a number and percentage symbol. As this member is updated by our `progressSub` subscription, the width of the progress bar UI element will change dynamically. The `attr.aria-valuenow` attribute will also be updated with the `progress` property.

> **Note:** In Angular, the declarative data-bound attributes are _not_ HTML attributes. Instead, they're _properties_ of the DOM node. You can read more about this [shift in the mental model in the documentation here](https://angular.io/guide/template-syntax#html-attribute-vs-dom-property).

### Progress Bar Component Styles

Now we want to make sure our progress bar is the same height as our "Go!" button so it can fill the same space.

Open the `progress-bar.component.scss` file and add:

```scss
/* src/app/progress-bar/progress-bar.component.scss */
.progress-bar {
  font-size: 14px;
  height: 51px;
  line-height: 51px;
}
```

### Add Progress Bar to Words Form Component

Now we have our Progress Bar component. It's time to display it in the Words Form component at the right time. 

Open the `words-form.component.html` template:

{% highlight html %}
<!-- src/app/words-form/words-form.component.html -->
...
  <div class="row">
    <div class="col mt-3 mb-3">
      <button
        *ngIf="!generating"
        class="btn btn-block btn-lg btn-success"
        [disabled]="!wordsForm.form.valid">Go!</button>

      <app-progress-bar [hidden]="!generating"></app-progress-bar>
    </div>
  </div>
...
{% endhighlight %}

First we'll add `*ngIf="!generating"` to the "Go!" button. This will remove the button after clicking, allowing us to show the progress bar in its place.

Next we'll add our `<app-progress-bar>` element below the "Go!" button near the bottom of our template. We'll use the `[hidden]` binding to hide the Progress Bar component except when `generating` is true. 

Why aren't we using NgIf for the progress bar? NgIf doesn't load the component into the template at all until its expression is truthy. However, using `[hidden]` means the component initializes (but remains hidden) when the parent template loads. This will ensure the Progress Bar component is ready to go with the appropriate subscriptions already set up as soon as we might need to _display_ it. Because it subscribes to the `submit$` subject, if we used NgIf and therefore didn't load the component until after the user clicked the "Go!" button, the progress bar wouldn't initialize properly.

## Madlib Component

Our final component is the Madlib component. This component utilizes the user's words to create a silly, customized story.

Create the component with the Angular CLI like so:

```bash
$ ng g component madlib
```

We can now use the data we've stored in the Madlibs service to generate our story.

### Madlib Component Class

Open the `madlib.component.ts` file:

```js
// src/app/madlib/madlib.component.ts
import { Component } from '@angular/core';
import { MadlibsService } from './../madlibs.service';

@Component({
  selector: 'app-madlib',
  templateUrl: './madlib.component.html',
  styleUrls: ['./madlib.component.scss']
})
export class MadlibComponent {
  constructor(public ml: MadlibsService) { }

  aOrAn(word: string, beginSentence: boolean) {
    const startsWithVowel = ['a', 'e', 'i', 'o', 'u'].indexOf(word.charAt(0).toLowerCase()) !== -1;

    if (startsWithVowel) {
      return beginSentence ? 'An' : 'an';
    } else {
      return beginSentence ? 'A' : 'a';
    }
  }

}
```

This is a simple component. Most of the meat and potatoes will be in the template, which displays the actual story. We need to import the `MadlibsService` to gain access to the stored data. We'll make this available to our template publicly in the constructor function.

Then we need a simple `aOrAn()` method that returns different capitalizations of "a" or "an" depending on the word it precedes and whether or not it's at the beginning of a sentence. If the `word` argument starts with a vowel, we'll return "an". If not, we'll return "a". We'll also implement logic for sentence capitalization.

### Madlib Component Template

Now it's time to display the user's completed madlib. Open the `madlib.component.html` template file and add:

{% highlight html %}
{% raw %}
<!-- src/app/madlib/madlib.component.html -->
<div class="row">
  <div class="col">
    <div class="jumbotron lead">
      <p>{{aOrAn(ml.words.adjs[0], true)}} {{ml.words.adjs[0]}} {{ml.words.nouns[0]}} {{ml.words.verbs[2]}} to the {{ml.words.nouns[1]}}. There, {{ml.pronoun.normal}} decided that it would be a good idea to test {{ml.pronoun.possessive}} mettle by doing some {{ml.words.verbs[0]}} with {{aOrAn(ml.words.nouns[3], false)}} {{ml.words.nouns[3]}}. To {{ml.pronoun.possessive}} surprise, the results made {{ml.pronoun.third}} {{ml.words.adjs[1]}}.</p>

      <p>When the initial shock wore off, {{ml.pronoun.normal}} was {{ml.words.adjs[2]}} and {{ml.pronoun.normal}} {{ml.words.verbs[2]}}. It had been {{aOrAn(ml.words.adjs[3], false)}} {{ml.words.adjs[3]}} day, so {{ml.pronoun.normal}} left the {{ml.words.nouns[1]}} and {{ml.words.verbs[3]}} to the {{ml.words.adjs[4]}} {{ml.words.nouns[2]}} {{ml.pronoun.normal}} called home.</p>

      <p>After {{ml.words.verbs[1]}} for a little while, the {{ml.words.nouns[0]}} {{ml.words.verbs[4]}} and settled down for the night with {{ml.pronoun.possessive}} {{ml.words.nouns[4]}}.</p>
    </div>
  </div>
</div>

<div class="row">
  <div class="col mt-3 mb-3">
    <button
      class="btn btn-block btn-lg btn-primary"
      (click)="ml.setMadlibReady(false)">Play Again</button>
  </div>
</div>
{% endraw %}
{% endhighlight %}

This template displays the story text using the data stored in our Madlibs service, including the `words` and `pronoun` objects.

At the bottom, we'll display a "Play Again" button that executes the `setMadlibReady()` setter, setting `madlibReady` to `false`. This will hide the Madlib component and show the appropriate Listen or Keyboard component again so the user can enter new words to generate another variation of the story.

### Add Madlib Component to App Component

Now we need to add our Madlib component to our App component and conditionally hide it when we're showing the word entry components.

First we'll update the `app.component.ts` class:

```js
// src/app/app.component.ts
...
import { MadlibsService } from './madlibs.service';

export class AppComponent {
  constructor(
    public speech: SpeechService,
    public ml: MadlibsService) { }
}
```

We need to import the `MadlibsService` and make it available via the constructor so we can use its properties in our template.

Now open the `app.component.html` template and make the following updates:

{% highlight html %}
<!-- src/app/app.component.html -->
<div class="container">
  <h1 class="text-center">Madlibs</h1>

  <ng-template [ngIf]="!ml.madlibReady || !ml.pronoun">
    <app-listen *ngIf="speech.speechSupported"></app-listen>
    <app-keyboard *ngIf="!speech.speechSupported"></app-keyboard>
  </ng-template>

  <app-madlib *ngIf="ml.madlibReady && ml.pronoun"></app-madlib>
</div>
{% endhighlight %}

We'll wrap the Listen and Keyboard components in an `<ng-template>` with an `[ngIf]` directive and an expression that is true when the Madlibs service's properties `madlibReady` _or_ `pronoun` are falsey. Either of these would indicate that the madlib story is not ready.

We'll then add the `<app-madlib>` element and display it if both `madlibReady` and `pronoun` are truthy. This ensures we have all the data necessary to display a complete madlib story.

Try out your madlib! The Madlib component should look something like this in the browser:

![generated madlib story](https://cdn.auth0.com/blog/madlibs/madlib-story.jpg)

## Aside: Authenticate an Angular App and Node API with Auth0

We can protect our applications and APIs so that only authenticated users can access them. Let's explore how to do this with an Angular application and a Node API using [Auth0](https://auth0.com). You can clone this sample app and API from the [angular-auth0-aside repo on GitHub](https://github.com/auth0-blog/angular-auth0-aside), or as a bonus, you can try integrating these features into the Madlibs app that you've just built!

![Auth0 hosted login screen](https://cdn2.auth0.com/blog/angular-aside/angular-aside-login.jpg)

### Features

The [sample Angular application and API](https://github.com/auth0-blog/angular-auth0-aside) has the following features:

* Angular application generated with [Angular CLI](https://github.com/angular/angular-cli) and served at [http://localhost:4200](http://localhost:4200)
* Authentication with [auth0.js](https://auth0.com/docs/libraries/auth0js/v8) using a hosted [Lock](https://auth0.com/lock) instance
* Node server protected API route `http://localhost:3001/api/dragons` returns JSON data for authenticated `GET` requests
* Angular app fetches data from API once user is authenticated with Auth0
* Profile page requires authentication for access using route guards
* Authentication service uses a subject to propagate authentication status events to the entire app
* User profile is fetched on authentication and stored in authentication service
* Access token, ID token, profile, and token expiration are stored in local storage and removed upon logout

### Sign Up for Auth0

You'll need an [Auth0](https://auth0.com) account to manage authentication. You can sign up for a [free account here](https://auth0.com/signup). Next, set up an Auth0 client app and API so Auth0 can interface with an Angular app and Node API.

### Set Up a Client App

1. Go to your [**Auth0 Dashboard**](https://manage.auth0.com/#/) and click the "[create a new client](https://manage.auth0.com/#/clients/create)" button.
2. Name your new app and select "Single Page Web Applications".
3. In the **Settings** for your new Auth0 client app, add `http://localhost:4200/callback` to the **Allowed Callback URLs** and `http://localhost:4200` to the **Allowed Origins (CORS)**.
4. Scroll down to the bottom of the **Settings** section and click "Show Advanced Settings". Choose the **OAuth** tab and set the **JsonWebToken Signature Algorithm** to `RS256`.
5. If you'd like, you can [set up some social connections](https://manage.auth0.com/#/connections/social). You can then enable them for your app in the **Client** options under the **Connections** tab. The example shown in the screenshot above utilizes username/password database, Facebook, Google, and Twitter. For production, make sure you set up your own social keys and do not leave social connections set to use Auth0 dev keys.

### Set Up an API

1. Go to [**APIs**](https://manage.auth0.com/#/apis) in your Auth0 dashboard and click on the "Create API" button. Enter a name for the API. Set the **Identifier** to your API endpoint URL. In this example, this is `http://localhost:3001/api/`. The **Signing Algorithm** should be `RS256`.
2. You can consult the Node.js example under the **Quick Start** tab in your new API's settings. We'll implement our Node API in this fashion, using [Express](https://expressjs.com/), [express-jwt](https://github.com/auth0/express-jwt), and [jwks-rsa](https://github.com/auth0/node-jwks-rsa).

We're now ready to implement Auth0 authentication on both our Angular client and Node backend API.

### Dependencies and Setup

The Angular app utilizes the [Angular CLI](https://github.com/angular/angular-cli). Make sure you have the CLI installed globally:

```bash
$ npm install -g @angular/cli
```

Once you've cloned [the project](https://github.com/auth0-blog/angular-auth0-aside), install the Node dependencies for both the Angular app and the Node server by running the following commands in the root of your project folder:

```bash
$ npm install
$ cd server
$ npm install
```

The Node API is located in the [`/server` folder](https://github.com/auth0-blog/angular-auth0-aside/tree/master/server) at the root of our sample application.

Open the [`server.js` file](https://github.com/auth0-blog/angular-auth0-aside/blob/master/server/server.js):

```js
// server/server.js
...
// @TODO: change [CLIENT_DOMAIN] to your Auth0 domain name.
// @TODO: change [AUTH0_API_AUDIENCE] to your Auth0 API audience.
var CLIENT_DOMAIN = '[CLIENT_DOMAIN]'; // e.g., youraccount.auth0.com
var AUTH0_AUDIENCE = '[AUTH0_API_AUDIENCE]'; // http://localhost:3001/api/ in this example

var jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${CLIENT_DOMAIN}/.well-known/jwks.json`
    }),
    audience: AUTH0_AUDIENCE,
    issuer: `https://${CLIENT_DOMAIN}/`,
    algorithm: 'RS256'
});
...
//--- GET protected dragons route
app.get('/api/dragons', jwtCheck, function (req, res) {
  res.json(dragonsJson);
});
...
```

Change the `CLIENT_DOMAIN` variable to your Auth0 client domain and set the `AUTH0_AUDIENCE` to your audience (in this example, this is `http://localhost:3001/api/`). The `/api/dragons` route will be protected with [express-jwt](https://github.com/auth0/express-jwt) and [jwks-rsa](https://github.com/auth0/node-jwks-rsa).

> **Note:** To learn more about RS256 and JSON Web Key Set, read [Navigating RS256 and JWKS](https://auth0.com/blog/navigating-rs256-and-jwks/).

Our API is now protected, so let's make sure that our Angular application can also interface with Auth0. To do this, we'll activate the [`src/app/auth/auth0-variables.ts.example` file](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/auth/auth0-variables.ts.example) by deleting the `.example` from the file extension. Then open the file and change the `[CLIENT_ID]` and `[CLIENT_DOMAIN]` strings to your Auth0 information:

```js
// src/app/auth/auth0-variables.ts
...
export const AUTH_CONFIG: AuthConfig = {
  CLIENT_ID: '[CLIENT_ID]',
  CLIENT_DOMAIN: '[CLIENT_DOMAIN]',
  ...
```

Our app and API are now set up. They can be served by running `ng serve` from the root folder and `node server.js` from the `/server` folder.

With the Node API and Angular app running, let's take a look at how authentication is implemented.

### Authentication Service

Authentication logic on the front end is handled with an `AuthService` authentication service: [`src/app/auth/auth.service.ts` file](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/auth/auth.service.ts).

```js
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as auth0 from 'auth0-js';
import { AUTH_CONFIG } from './auth0-variables';
import { UserProfile } from './profile.model';

@Injectable()
export class AuthService {
  // Create Auth0 web auth instance
  // @TODO: Update AUTH_CONFIG and remove .example extension in src/app/auth/auth0-variables.ts.example
  auth0 = new auth0.WebAuth({
    clientID: AUTH_CONFIG.CLIENT_ID,
    domain: AUTH_CONFIG.CLIENT_DOMAIN,
    responseType: 'token id_token',
    redirectUri: AUTH_CONFIG.REDIRECT,
    audience: AUTH_CONFIG.AUDIENCE,
    scope: AUTH_CONFIG.SCOPE
  });
  userProfile: UserProfile;

  // Create a stream of logged in status to communicate throughout app
  loggedIn: boolean;
  loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);

  constructor(private router: Router) {
    // If authenticated, set local profile property and update login status subject
    if (this.authenticated) {
      this.userProfile = JSON.parse(localStorage.getItem('profile'));
      this.setLoggedIn(true);
    }
  }

  setLoggedIn(value: boolean) {
    // Update login status subject
    this.loggedIn$.next(value);
    this.loggedIn = value;
  }

  login() {
    // Auth0 authorize request
    this.auth0.authorize();
  }

  handleAuth() {
    // When Auth0 hash parsed, get profile
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this._getProfile(authResult);
        this.router.navigate(['/']);
      } else if (err) {
        this.router.navigate(['/']);
        console.error(`Error: ${err.error}`);
      }
    });
  }

  private _getProfile(authResult) {
    // Use access token to retrieve user's profile and set session
    this.auth0.client.userInfo(authResult.accessToken, (err, profile) => {
      this._setSession(authResult, profile);
    });
  }

  private _setSession(authResult, profile) {
    const expTime = authResult.expiresIn * 1000 + Date.now();
    // Save session data and update login status subject
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('profile', JSON.stringify(profile));
    localStorage.setItem('expires_at', JSON.stringify(expTime));
    this.userProfile = profile;
    this.setLoggedIn(true);
  }

  logout() {
    // Remove tokens and profile and update login status subject
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
    localStorage.removeItem('expires_at');
    this.userProfile = undefined;
    this.setLoggedIn(false);
  }

  get authenticated(): boolean {
    // Check if current date is greater than expiration
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return Date.now() < expiresAt;
  }

}
```

This service uses the config variables from `auth0-variables.ts` to instantiate an `auth0.js` WebAuth instance.

An [RxJS `BehaviorSubject`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/subjects/behaviorsubject.md) is used to provide a stream of authentication status events that you can subscribe to anywhere in the app.

The `login()` method authorizes the authentication request with Auth0 using your config variables. An Auth0 hosted Lock instance will be shown to the user and they can then log in.

> **Note:** If it's the user's first visit to our app _and_ our callback is on `localhost`, they'll also be presented with a consent screen where they can grant access to our API. A first party client on a non-localhost domain would be highly trusted, so the consent dialog would not be presented in this case. You can modify this by editing your [Auth0 Dashboard API](https://manage.auth0.com/#/apis) **Settings**. Look for the "Allow Skipping User Consent" toggle.

We'll receive `idToken`, `accessToken`, and `expiresIn` in the hash from Auth0 when returning to our app. The `handleAuth()` method uses Auth0's `parseHash()` method callback to get the user's profile (`_getProfile()`) and set the session (`_setSession()`) by saving the tokens, profile, and token expiration to local storage and updating the `loggedIn$` subject so that any subscribed components in the app are informed that the user is now authenticated.

> **Note:** The profile takes the shape of [`profile.model.ts`](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/auth/profile.model.ts) from the [OpenID standard claims](https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims).

The `handleAuth()` method can then be called in the [`app.component.ts` constructor](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/app.component.ts) like so:

```js
// src/app/app.component.ts
import { AuthService } from './auth/auth.service';
...
  constructor(private auth: AuthService) {
    // Check for authentication and handle if hash present
    auth.handleAuth();
  }
...
```

Finally, we have a `logout()` method that clears data from local storage and updates the `loggedIn$` subject. We also have an `authenticated` accessor to return current authentication status based on access token expiration.

Once [`AuthService` is provided in `app.module.ts`](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/app.module.ts#L32), its methods and properties can be used anywhere in our app, such as the [home component](https://github.com/auth0-blog/angular-auth0-aside/tree/master/src/app/home).

The [callback component](https://github.com/auth0-blog/angular-auth0-aside/tree/master/src/app/callback) is where the app is redirected after authentication. This component simply shows a loading message until hash parsing is completed and the Angular app redirects back to the home page.

### Making Authenticated API Requests

In order to make authenticated HTTP requests, we need to add a `Authorization` header with the access token in our [`api.service.ts` file](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/api.service.ts).

```js
// src/app/api.service.ts
...
  getDragons$(): Observable<any[]> {
    return this.http
      .get(`${this.baseUrl}dragons`, {
        headers: new HttpHeaders().set(
          'Authorization', `Bearer ${localStorage.getItem('access_token')}`
        )
      })
      .catch(this._handleError);
  }
...
```

### Final Touches: Route Guard and Profile Page

A [profile page component](https://github.com/auth0-blog/angular-auth0-aside/tree/master/src/app/profile) can show an authenticated user's profile information. However, we only want this component to be accessible if the user is logged in.

With an [authenticated API request and login/logout](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/home/home.component.ts) implemented, the final touch is to protect our profile route from unauthorized access. The [`auth.guard.ts` route guard](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/auth/auth.guard.ts) can check authentication and activate routes conditionally. The guard is implemented on specific routes of our choosing in the [`app-routing.module.ts` file](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/app-routing.module.ts) like so:

```js
// src/app/app-routing.module.ts
...
import { AuthGuard } from './auth/auth.guard';
...
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [
          AuthGuard
        ]
      },
...
```

### More Resources

That's it! We have an authenticated Node API and Angular application with login, logout, profile information, and protected routes. To learn more, check out the following resources:

* [Why You Should Always Use Access Tokens to Secure an API](https://auth0.com/blog/why-should-use-accesstokens-to-secure-an-api/)
* [Navigating RS256 and JWKS](https://auth0.com/blog/navigating-rs256-and-jwks/)
* [Access Token](https://auth0.com/docs/tokens/access-token)
* [Verify Access Tokens](https://auth0.com/docs/api-auth/tutorials/verify-access-token)
* [Call APIs from Client-side Web Apps](https://auth0.com/docs/api-auth/grant/implicit)
* [How to implement the Implicit Grant](https://auth0.com/docs/api-auth/tutorials/implicit-grant)
* [Auth0.js v8 Documentation](https://auth0.com/docs/libraries/auth0js/v8)
* [OpenID Standard Claims](https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims)

## Conclusion

We covered a lot while building a fun little app that generates madlibs. We were able to experience a rapidly-approaching future for web interactivity with the Web Speech API, and we learned about RxJS observables and component communication in Angular. Finally, we learned how to authenticate an Angular app and Node API with Auth0, which you can integrate into your Madlibs app if you wish as a little bit of homework.

Hopefully you now have a better understanding of Angular, speech recognition, and RxJS and are prepared to build your own more complex apps with these technologies!