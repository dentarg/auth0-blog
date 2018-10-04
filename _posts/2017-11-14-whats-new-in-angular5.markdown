---
layout: post
title: "Angular 5 Release: What’s New?"
description: "Angular 5 brings some new features to the popular JavaScript framework for building mobile, desktop and web applications. Learn what's new in Angular!"
date: 2017-11-14 08:30
category: Technical Guide, Angular, Angular 5
design:
  bg_color: "#012C6C"
  image: https://cdn.auth0.com/blog/angular5/logo.png
author:
  name: Prosper Otemuyiwa
  url: http://twitter.com/unicodeveloper?lang=en
  mail: prosper.otemuyiwa@auth0.com
  avatar: https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200
tags:
- angular
- angular5
- javascript
- frontend
- authentication
related:
- 2017-09-20-rxjs-advanced-tutorial-with-angular-web-speech-part-1
- 2016-09-29-angular-2-authentication
- 2017-06-28-real-world-angular-series-part-1
---

---

**TL;DR:** Angular is an all-encompassing JavaScript framework that is frequently used by developers all over the world for building web, desktop, and mobile applications. In this article, I'll cover the new features in Angular 5 and several other changes and deprecations.

---

Angular is built and [maintained by Google.](https://developers.google.com/experts/all/technology/angular). It is a platform that combines declarative templates, dependency injection, end to end tooling, and integrated best practices to solve development challenges. Web platforms such as _Google Adwords_, _Google Fiber_, _Adsense_, and _Winc_ use Angular to build their user interfaces.

Angular 5 was announced to the world on November 1, 2017. The previous Angular version was 4.4.0. This release focused on making Angular smaller and faster to use. Let's go through the major changes in version 5.

## 1. Http Deprecated, HttpClient Here to Stay

Before version 4.3, the `@angular/http` module was used for making HTTP requests in Angular applications. The Angular team has now deprecated `Http` in version 5. The `HttpClient` API from `@angular/common/http` package that shipped in version 4.3 is now recommended for use in all apps. The `HttpClient` API features include:

* Typed, synchronous response body access, including support for JSON body types.
* JSON is an assumed default and no longer needs to be explicitly parsed.
* Interceptors allow middleware logic to be inserted into the pipeline.
* Immutable request/response objects.
* Progress events for both request upload and response download.
* Post-request verification & flush based testing framework.

```js
import { HttpClientModule } from '@angular/common/http';
```

## 2. Support for Multiple Export Alias in Angular 5

In Angular 5, you can now give multiple names to your components and directives while exporting. Exporting a component with multiple names can help your users migrate without breaking changes.

{% include tweet_quote.html quote_text="Exporting a component with multiple names can help your users migrate without breaking changes." %}


_Example Usage:_

```js
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  exportAs:'dashboard, logBoard'
})
export class AppComponent {
  title = 'app';
}
```

## 3. Internationalized Number, Date, and Currency Pipes

Angular 5 ships with new number, date, and currency pipes that increase standardization across browsers and eliminate the need for i18n polyfills. The pipes rely on the [CLDR](http://cldr.unicode.org) to provide extensive locale support and configurations for any locales you want to support. To use the old pipes, you will have to import the `DeprecatedI18NPipesModule` after the `CommonModule`.

```js
  import { NgModule } from '@angular/core';
  import { CommonModule, DeprecatedI18NPipesModule } from '@angular/common';

  @NgModule({
    imports: [
      CommonModule,
      // import deprecated module after
      DeprecatedI18NPipesModule
    ]
  })
  export class AppModule { }
```

## 4. Improved Decorator Support in Angular 5

Angular 5 now supports expression lowering in decorators for lambdas, and the value of `useValue`, `useFactory`, and `data` in object literals. Furthermore, a lambda can be used instead of a named function like so:

_In Angular 5_

```js
  Component({
    provider: [{provide: 'token', useFactory: () => null}]
  })
  export class MyClass {}
```

_Before Angular 5_

```js
  Component({
    provider: [{provide: 'token', useValue: calculated()}]
  })
  export class MyClass {}
```

## 5. Build Optimization

The Angular team focused on making Angular 5 faster, smaller and easier to use. In Angular 5, production builds created with the Angular CLI will now apply the build optimizer by default. The build optimizer removes Angular decorators from your app's runtime codes thereby reducing the size of your bundle and increasing the boot speed of your application. In addition, the build optimizer removes part of your application that is not needed during runtime via tree-shaking. This action leads to a decreased bundle size, and faster application speed.

{% include tweet_quote.html quote_text="In Angular 5, production builds created with the Angular CLI will now apply the build optimizer by default." %}

## 6. Angular Universal Transfer API

The Angular Universal team has added [Domino](https://github.com/fgnass/domino) to the `platform-server`. This simply means more DOM manipulations can happen out of the box within server-side contexts.

Furthermore, two modules, `ServerTransferStateModule` and `BrowserTransferModule` have   been added to Angular Universal. These modules allow you to generate information as part of your rendering with platform-server and then transfer it to the client side to avoid re-generation of the same information. In summary, it transfers state from the server which means developers do not need to make a second HTTP request once the application makes it to the client.

## 7. Faster Compiler in Angular 5

A lot of improvements have been made to the Angular compiler to make it faster. The Angular compiler now leverages TypeScript transforms. You can take advantage of it by running:

```bash
ng serve --aot
```

[Angular.io](https://angular.io) was used as a case study and the compiler pipeline saved 95% of the build time when an incremental AOT build was performed on it.

> **Note:** TypeScript transforms are a new feature introduced as part of TypeScript 2.3, that allows hooking into the standard TypeScript compilation pipeline.

## 8. Forms Validation in Angular 5

In Angular 5, forms now have the ability to decide when the validity and value of a field or form are updated via on `blur` or on `submit`, instead of every input event.

_Example Usage_

{% highlight html %}
{% raw %}
  <input name="nickName" ngModel [ngModelOptions]="{updateOn: 'blur'}">
{% endraw %}
{% endhighlight %}

_Another Example_

{% highlight html %}
{% raw %}
  <form [ngFormOptions]="{updateOn: 'submit'}">
{% endraw %}
{% endhighlight %}

In the case of Reactive forms, you can add the option like so:

```js
ngOnInit() {
  this.newUserForm = this.fb.group({
    userName: ['Bob', { updateOn: 'blur', validators: [Validators.required] }]
  });
}
```

## 9. Animations in Angular 5

In Angular 5, we have two new transition aliases, `:increment` and `:decrement`.

```js
...
animations: [
  trigger('bannerAnimation', [
   transition(":increment", group([
     query(':enter', [
       style({ left: '100%' }),
       animate('0.5s ease-out', style('*'))
     ]),
     query(':leave', [
       animate('0.5s ease-out', style({ left: '-100%' }))
     ])
   ])),
   transition(":decrement", group([
     query(':enter', [
       style({ left: '-100%' }),
       animate('0.5s ease-out', style('*'))
     ]),
     query(':leave', [
       animate('0.5s ease-out', style({ left: '100%' }))
     ])
   ])),
 ])
]
```

Animation queries now support negative limits, in which case elements are matched from the end rather than from the beginning like so:

```js
...
animations: [
 trigger(
   'myAnimation',
   [
     transition(
         '* => go',
         [
           query(
               '.item',
               [
                 style({opacity: 0}),
                 animate('1s', style({opacity: 1})),
               ],
               {limit: -3}),
        ]),
   ]),
]
...
```

## 10. New Router Lifecycle Events in Angular 5

Some new lifecycle events have been added to the router. The events are `GuardsCheckStart`, `ChildActivationStart`, `ActivationStart`, `GuardsCheckEnd`, `ResolveStart`, `ResolveEnd`, `ActivationEnd`, and `ChildActivationEnd`. With these events, developers can track the cycle of the router from the start of running guards through to completion of activation.

Furthermore, you can now configure the router to reload a page when it receives a request to navigate to the same URL.

```js
providers: [
  // ...
  RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })
]
```

## 11. Better Support for Service Workers in Angular 5

In Angular 5, we have better support for service workers via the [@angular/service-worker](https://github.com/angular/angular/tree/master/packages/service-worker) package. The service worker package is a conceptual derivative of the `@angular/service-worker` package that was maintained at [github.com/angular/mobile-toolkit](github.com/angular/mobile-toolkit), but has been rewritten to support use-cases across a much wider variety of applications.

> **Note:** Right now you will have to manually integrate the package because it's not fully integrated with the CLI v1.5 yet. It is available as beta in version 1.6 of the CLI.

## Deprecations and Other Updates

* `NgFor` has been removed as it was deprecated since v4. Use `NgForOf` instead. This does not impact the use of `*ngFor` in your templates.
* The compiler option `enableLegacyTemplate` is now disabled by default as the `<template>` element was deprecated since v4. Use `<ng-template>` instead. The option `enableLegacyTemplate` and the `<template>` element will both be removed in Angular v6.
* The method `ngGetContentSelectors()` has been removed as it was deprecated since v4. Use `ComponentFactory.ngContentSelectors` instead.
* `ReflectiveInjector` is now deprecated. Use `Injector.create` as a replacement.
* `NgProbeToken` has been removed from `@angular/platform-browser` as it was deprecated since v4. Import it from `@angular/core` instead.

Check out other [Angular 5 updates here](https://github.com/angular/angular/blob/master/CHANGELOG.md).

## Upgrading to Angular 5

The Angular team built a [nifty tool](https://angular-update-guide.firebaseapp.com/) to make upgrading as easy as possible.

![Angular 5 Upgrade](https://cdn.auth0.com/blog/angular5/upgrade.png)
_Angular 5 upgrade tool_

{% include asides/angular.markdown %}

## Conclusion

**Angular 5** came loaded with new features and significant improvements. It is smaller and faster. I am proud of what the Angular team achieved with this release.

Have you switched to Angular 5 yet? What are your thoughts? Did you notice any significant improvement? Let me know in the comments section! 😊
