---
layout: post
title: "Angular Testing In Depth: Components"
description: "Learn how to test Components in Angular. We will start with writing isolated tests for a component and finish with integration tests for the rendered component."
date: 2017-05-13 08:23
category: Technical Guide, Angular, Angular2
banner:
  text: "Auth0 makes it easy to add authentication to your Angular application."
author:
  name: "Gábor Soós"
  url: "https://twitter.com/blacksonic86"
  mail: "soos.gabor86@gmail.com"
  avatar: "https://secure.gravatar.com/avatar/9d2e715baab928f5bedb837bfcb70b2b"
design:
  image: https://github.com/blacksonic/articles/raw/master/img/angular-logo-small.png
  image_size: "75%"
  image_bg_color: "rgb(1, 70, 166)"
  bg_color: "rgb(1, 70, 166)"
  bg_merge: true
tags:
- angular2
- testing
- angular
- typescript
- jasmine
related:
- angular-2-ngmodules
- angular-2-testing-in-depth-services
- angular-testing-in-depth-http-services
---

<div class="alert alert-info alert-icon">
  <i class="icon-budicon-664"></i>
  <strong>Get the "Migrating an Angular 1 App to Angular 2 book" for Free.</strong> Spread the word and <a href="https://auth0.com/e-books/migrating-to-angular2">download it now!</a>
</div>

Components enables us to display content on our website. The compiler parses their templates and
displays it according to the given state. The business logic inside them can be tested with
traditional unit tests just like services. But what happens with the displayed HTML 
from the template and the interaction with other components? In this tutorial I'll show you
how to test the rendered components starting from isolated unit tests to fully integrated ones.

This article is the third part of a series in which
I share my experiences testing different building blocks of an Angular application.
It relies heavily on Dependency Injection based testing and it is recommended that you read
[the first part](https://auth0.com/blog/angular-2-testing-in-depth-services/)
if you are not familiar with the concepts.

- [Services](https://auth0.com/blog/angular-2-testing-in-depth-services/)
- [HTTP Services](https://auth0.com/blog/angular-testing-in-depth-http-services/)
- Components (this article)
- Pipes
- Routing

### The component under test

The component we will test is a login form. It doesn't directly access the Authentication service,
instead it just informs the parent component about the submission through an `Output` property.
The form consists of two fields: an email and a password field.
The email address can be preloaded through an `Input` property 
if it is passed down from the wrapping parent component.

<p align="center">
  <img src="https://github.com/blacksonic/articles/raw/master/img/angular-testing-components/login-form.png" alt="Angular Testing Framework"/>
</p>

The two fields are handled by a reactive form created on the component.
With reactive forms we can add validation to the fields and access their value without touching the DOM.
I've chosen reactive forms because they are more flexible and easier to test.

If you are not familiar with reactive forms, it is recommended to read 
[this part from the official documentation](https://angular.io/docs/ts/latest/guide/reactive-forms.html).

The `FormBuilder` is created inside the constructor and adds validation to the input fields.
When the `email` input changes, the `ngOnChanges` lifecycle hook passes it down to the field.
Setting the value on one of the forms control updates it's value also in the HTML input element.

```typescript
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'login-form',
  templateUrl: './login-form.template.html'
})
export class LoginFormComponent {

  private loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  @Input()
  email: string;

  @Output()
  submitted = new EventEmitter();

  ngOnChanges(change) {
    if (change.email) {
      this.loginForm.controls['email'].setValue(change.email.currentValue);
    }
  }

  onSubmit({ email, password }) {
    this.submitted.next({ email, password });
  }
}
```

The template only includes tags that are necessary for the form to function.
The value of the `formControlName` property will the reference name 
when we access our inputs inside the form controls.
With the `[formGroup]` property we fire up the form handling with the components `FormGroup` and
listen to form submissions with `(ngSubmit)`.
When we click on the submit button, Angular will catch the event and pass it to the `onSubmit` handler function.

```html
<form (ngSubmit)="onSubmit(loginForm.value)" [formGroup]="loginForm">
    <input type="text" formControlName="email" id="login-email">

    <input type="password" formControlName="password" id="login-password">

    <button type="submit">Login</button>
</form>
```

### Isolated tests

If we just want to focus on the business logic, we can treat and test it as a service.
The `Component` decorator extends the `Injectable` decorator, which means it can be created as a service.
We just have to pass the component to the `providers` array in the module dependencies.
When testing in isolation, the template never gets compiled.
It only gets the required dependencies through the constructor.

```typescript
import { LoginFormComponent } from './login-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestBed, inject, async } from '@angular/core/testing';
import { Component } from '@angular/core';

describe('Isolated', () => {
  let subject: LoginFormComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoginFormComponent],
      imports: [FormsModule, ReactiveFormsModule]
    });
  });
    
  beforeEach(inject([LoginFormComponent], (loginForm: LoginFormComponent) => {
    subject = loginForm;
  }));
    
  it('should send credentials on submit', () => {
    subject.submitted.subscribe(({ email, password }) => {
      expect(email).toEqual(expectedEmail);
      expect(password).toEqual(expectedPassword);
    });
    
    subject.onSubmit({ email: expectedEmail, password: expectedPassword });
  });
});
```

The test focuses on the method that is called when the form is submitted.
It only passes the given email and password to the `EventEmitter` after destructuring the input object.
We don't have to pass Jasmine's asynchronous `done` callback to the testcase,
because the `EventEmitter` acts synchronously.

Isolated tests are good when you want to focus on the component's logic.
Besides focus these tests have way better speed than any other solution.
The only downside is that it won't detect errors in the template 
nor check the interactions with other components.

### Shallow tests

If we want to detect errors also inside the template, but still focus on a single component,
shallow tests are the way to go.
The key difference compared to isolated tests is that here the component is compiled.

Inside the `beforeEach` block the component class moves to the `declarations` property instead of `providers`.
Before we can create an instance of the component, it has to be compiled.
The `compileComponents` method does the task asynchronously. It can't be synchronous,
because templates and styles can be referenced with relative urls 
and the fetching of these resources are asynchronous by nature.
We have to wait for these tasks to complete. We can do the waiting with the `async` helper function.
In the background `async` creates a new zone 
and waits until every asynchronous operation is finished within that zone.
This we don't have to fiddle with Jasmine's `done` callback.

```typescript
describe('Shallow', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginFormComponent],
      imports: [FormsModule, ReactiveFormsModule]
    });
    TestBed.compileComponents();
  }));
  
  it('should send credentials on submit', () => {
    let fixture = TestBed.createComponent(LoginFormComponent);
    let component: LoginFormComponent = fixture.componentInstance;
    let element = fixture.nativeElement;
    
    fixture.detectChanges();
    
    element.querySelector('#login-email').value = expectedEmail;
    element.querySelector('#login-email').dispatchEvent(new Event('input'));
    element.querySelector('#login-password').value = expectedPassword;
    element.querySelector('#login-password').dispatchEvent(new Event('input'));
    
    fixture.detectChanges();
    
    component.submitted.subscribe(({ email, password }) => {
      expect(email).toEqual(expectedEmail);
      expect(password).toEqual(expectedPassword);
    });
    
    element.querySelector('button[type="submit"]').click();
  });
});
```

With the `createComponent` method we will have access to the component instance(`componentInstance`) 
and the generated HTML fragment(`nativeElement`). We test the same thing as before,
what is emitted on the output at form submission. 
The big difference is that we fill the inputs and click the submit button.
Filling the inputs with valid data is necessary, 
because the form validation leaves the submit button disabled as long as the inputs contain invalid data.

To make it work we have to call the `detectChanges` method always. 
It does the synchronization of the component instance and the generated HTML.
Otherwise the component won't know that the input's value has changed.
When we modify an input, triggering the `input` event manually is also necessary, 
because this is the event what Angular listens for.

Also before doing anything inside the `nativeElement`, we have to call `detectCahnges` first.
It does the first round of property checks on the component and fills out the template based on it.

Finally we can use the native DOM methods and selectors on the `nativeElement` property.

With shallow tests we win the ability to test the templates also, but it comes with a price.
These tests run much slower by including the compilation step.

### Integration tests

The next step is to test the component through it's interactions with other components.
With integration tests not only the template, but inputs and outputs will also be tested.

The setup is very similar to shallow tests. We have to setup and compile components.
The difference is that have one more component that uses the login form component inside it's template.
The wrapper component passes down the predefined email address and listens for the submit event.

```typescript
describe('Integration', () => {
  @Component({
    selector: 'site',
    template: `<login-form [email]="email" (submitted)="onFormSubmit($event)"></login-form>`
  })
  class SiteComponent {
    email = expectedEmail;

    storedEmail: string;

    storedPassword: string;

    onFormSubmit({ email, password }) {
      this.storedEmail = email;
      this.storedPassword = password;
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginFormComponent, SiteComponent],
      imports: [FormsModule, ReactiveFormsModule]
    });
    TestBed.compileComponents();
  }));

  it('should send credentials on submit', () => {
    let fixture = TestBed.createComponent(SiteComponent);
    let component: SiteComponent = fixture.componentInstance;
    let element = fixture.nativeElement;

    fixture.detectChanges();

    expect(element.querySelector('#login-email').value).toEqual(expectedEmail);

    element.querySelector('#login-password').value = expectedPassword;
    element.querySelector('#login-password').dispatchEvent(new Event('input'));

    fixture.detectChanges();

    element.querySelector('button[type="submit"]').click();

    expect(component.storedEmail).toEqual(expectedEmail);
    expect(component.storedPassword).toEqual(expectedPassword);
  });
});
```

The modification of the input fields is the same, but the assertions are different.
This time we don't write assertions for the login form, but write it for the wrapper component.
This way we ensure the bindings are correct.

There is no considerable slowdown compared to shallow tests. It needs a bit more setup upfront, 
but we can test the interactions between the components.

### Summary

We have learnt three methods to test Angular components.
The first and fastest is testing the component in isolation.
It means we don't compile the template, just focus on the callable methods, like with a service.
If we want to test the template also, we will have to compile that component.
These are shallow tests. They are slower, but test more parts.
The last missing aspect is the interaction with other components. This can be tested with integration tests.
The extra element here is that we need to write a wrapper component around the component under test 
and observe it through the wrapping component.

Either type we choose, we have to find the right balance between speed and how deep we test the components.
It is optimal if we test business through isolation tests 
and add some shallow and integration tests to ensure interactions and the template to be valid.

To see the tests in action check out
[this GitHub repository](https://github.com/blacksonic/angular2-testing-ground "Angular testing ground").
