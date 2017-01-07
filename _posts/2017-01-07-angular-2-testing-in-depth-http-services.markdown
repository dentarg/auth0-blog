---
layout: post
title: "Angular 2 Testing In Depth: Http Services"
description: "Learn how to test Http services in Angular 2. We will start with writing tests for requests and finish with refactoring them to a cleaner format."
date: 2017-01-07 08:23
category: Technical Guide, Angular, Angular2
banner:
  text: "Auth0 makes it easy to add authentication to your AngularJS application."
author:
  name: "Gábor Soós"
  url: "https://twitter.com/blacksonic86"
  mail: "soos.gabor86@gmail.com"
  avatar: "https://secure.gravatar.com/avatar/9d2e715baab928f5bedb837bfcb70b2b"
design:
  image: https://cdn.auth0.com/blog/angular/logo.png
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
- angular-2-authentication
---

<div class="alert alert-info alert-icon">
  <i class="icon-budicon-664"></i>
  <strong>Get the "Migrating an Angular 1 App to Angular 2 book" for Free.</strong> Spread the word and <a href="https://auth0.com/e-books/migrating-to-angular2">download it now!</a>
</div>

Most of the time when we write a web application it has a backend.
The most straightforward way to communicate is to do it with Http requests.
These requests are crucial for the application,
so we need to test them as well.
More importantly these tests need to be isolated from the outside world.
In this article I will tell you how to test your requests properly in an elegant way.

This article is the second part of a series in which
I share my experiences testing different building blocks of an Angular 2 application.
It relies heavily on Dependency Injection based testing and
it is recommended to read [the first part](https://auth0.com/blog/angular-2-testing-in-depth-services/)
if someone is not familiar with the concepts.

- [Services](https://auth0.com/blog/angular-2-testing-in-depth-services/)
- Http Services (this article)
- Components
- Pipes
- Routing

### Testing the first request

<p align="center">
  <img src="https://github.com/blacksonic/articles/raw/master/img/angular2-testing-http-services/github-logo.png" alt="Angular 2 Testing Framework"/>
</p>

To get started we will test the a basic request, the GET request.
It will only call a parameterized url without body and additional headers.
The Github API has an endpoint for retrieving public profile information about users.
The profile information is returned in JSON format.

```typescript
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class GithubService {
  constructor(private http: Http) {}

  getProfile(userName: string) {
    return this.http
      .get(`https://api.github.com/users/${userName}`)
      .map((response: Response) => response.json());
  }
}
```

The ```getProfile``` method sends a GET request to the API and returns the response.
Every request made with the ```HttpModule``` returns an ```Observable```.
The returned value will always be a ```Response``` object, that can return the response body.
With the help of the ```json``` or ```text``` method we can transform the value of the Observable.

The first thing we have to do is to set up the test dependencies.
The ```Http``` dependency is required.
If we don't provide it, we will get this error message: ```No provider for Http!```.

```typescript
beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [GithubService],
    imports: [HttpModule]
  });
});
```

The problem with the real ```HttpModule``` is that we will and up sending real HTTP requests.
It is absolutely a bad idea in unit tests, because it breaks the isolation of the test with the outside world.
Under no circumstances will the result of the test be guaranteed.
For example the network goes down and the well crafted tests will no longer work.

Instead Angular has a built-in way to fake HTTP requests.

```typescript
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod } from '@angular/http';

...

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      GithubService,
      MockBackend,
      BaseRequestOptions,
      {
        provide: Http,
        useFactory: (mockBackend: MockBackend, defaultOptions: ResponseOptions) => {
          return new Http(mockBackend, defaultOptions);
        },
        deps: [MockBackend, BaseRequestOptions]
      }
    ]
  });
});
```

Instead providing ```Http``` as a module
it is better to use the factory provider and pass the ```MockBackend``` instance to the ```Http``` constructor.
This way the fake backend captures every request and can respond to them.

Before writing the first test it is also important to get an instance of the ```MockBackend```,
because without it we won't be able to respond to requests.

```typescript
beforeEach(inject([GithubService, MockBackend], (github, mockBackend) => {
  subject = github;
  backend = mockBackend;
}));
```

Let's write the first test that checks the result of the request.

```typescript
it('should get profile data of user', (done) => {
  let profileInfo = { login: 'sonic', id: 325, name: 'Tester' };
  backend.connections.subscribe((connection: MockConnection) => {
    let options = new ResponseOptions({ body: profileInfo });

    connection.mockRespond(new Response(options));
  });

  subject.getProfile('blacksonic').subscribe((response) => {
    expect(response).toEqual(profileInfo);
    done();
  });
});
```

Requests made are available through the ```connections``` property of the fake backend as an ```Observable```.
When it receives the request through the ```subscribe``` method we can respond with a JSON object.

In the example only the response body is set, but also the response status or headers can be set.

Another new element is the ```done``` callback passed in to the test function.
It is needed when writing asynchronous tests.
This way the test doesn't end when the execution of the function ends.
It will wait until the ```done``` callback is called.
Of course there is a timeout for hanging tests that doesn't call this the ```done``` method in a given interval.

HTTP requests are asynchronous by nature,
but the fake backend we use responds to them synchronously (calls the ```subscribe``` method synchronously).
You may wonder why make the test asynchronous then.

The answer is false positive tests.
If we comment out the response to the request, the test will still pass although we have an assertion.
The problem here is that the ```subscribe``` callback never gets executed if we don't respond to the request.

```typescript
it('should get profile data of user', () => {
  // backend.connections.subscribe...

  subject.getProfile('blacksonic').subscribe((response) => {
    expect(response).toEqual(profileInfo);
  });
});
```
### Checking the request

Until now we didn't make any assertions for the request.
For example what was the called url or what was the method of the request.
To make the test more strict we have to check these parameters.

```typescript
backend.connections.subscribe((connection: MockConnection) => {
  expect(connection.request.url).toEqual('https://api.github.com/users/blacksonic');
  expect(connection.request.method).toEqual(RequestMethod.Get);

  ...
});
```

On the ```MockConnection``` object resides the original ```Request``` object.
With it's```url``` and ```method``` property we can add the assertions easily.

### Digging deeper

GET requests are good for displaying data, but for sending other kind of requests are needed.
For example POST requests.
When modifying data stored on the server we need to restrict access to it.
It is usually done with a POST request on the login page.

<p align="center">
  <img src="https://github.com/blacksonic/articles/raw/master/img/angular2-testing-http-services/auth0-logo.png" alt="Angular 2 Testing Framework"/>
</p>

For authenticating users with different methods Auth0's service is a really good solution.
It has a feature to authenticate users based on username and password.
To demonstrate how to test POST requests we will send a request to the Auth0 API.
Now we won't be using their recommended package, because it would hide the actual request,
but for real world scenarios I would recommend using it.

```typescript
@Injectable()
export class Auth0Service {
  constructor(private http: Http) {}

  login(username: string, password: string) {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({ headers });

    return this.http
      .post(
        'https://blacksonic.eu.auth0.com.auth0.com/usernamepassword/login',
        { username, password, client_id: 'YOUR_CLIENT_ID' },
        options
      )
      .map((response: Response) => response.text());
  }
}
```

The main differences here to the previous example is that we are sending a JSON payload to the server
and putting additional headers onto it.
We don't have to manually ```JSON.stringify``` the payload, the request methods will take care of it.
The response will be in text format, this time we don't have to convert anything to JSON.

Let's look at the test, how we can check every detail.

```typescript
it('should be called with proper arguments', (done) => {
  backend.connections.subscribe((connection: MockConnection) => {
    expect(connection.request.url).toEqual('https://blacksonic.eu.auth0.com.auth0.com/usernamepassword/login');
    expect(connection.request.method).toEqual(RequestMethod.Post);
    expect(connection.request.headers.get('Content-Type')).toEqual('application/json');
    expect(connection.request.getBody()).toEqual(JSON.stringify(
      {
        username: 'blacksonic',
        password: 'secret',
        client_id: 'YOUR_CLIENT_ID'
      }, null, 2
    ));
    ...
  });

  subject.login('blacksonic', 'secret').subscribe((response) => {
    expect(response).toEqual('<form />');
    done();
  });
});
```

The headers are also available on the ```Request``` object and can be checked one-by-one.
The payload can be retrieved with the ```getBody``` method.
This method always returns the body converted to a string what will we see in the network traffic.
When we send JSON it will contain the output of the ```JSON.stringify``` method: printed with spaces and an indentation of two.

### Refactoring

The previous setups work but have multiple problems.

- Every service we test, the provider configuration will be the exactly the same
- The subscription to the outgoing connections respond the same immediately regardless of the url.
- The assertions are very verbose and hard to read

Those who tested their Http services in Angularjs also might remember how simple was the setup for these tests.
Angularjs provided convenience methods for setting expectations on requests.

Angular 2 doean't have these built-in functionalities,
but very similar one's are present in the [ngx-http-test](https://github.com/blacksonic/ngx-http-test) library.

It can solve the problems mentioned before.
Let's look at the test with it for the Github profile fetch.

```typescript
...
import { FakeBackend } from 'ngx-http-test';

describe('GithubServiceRefactored', () => {
  ...

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GithubService,
        FakeBackend.getProviders()
      ]
    });
  });

  beforeEach(inject([GithubService, FakeBackend], (github, fakeBackend) => {
    subject = github;
    backend = fakeBackend;
  }));

  it('should get profile data of user', (done) => {
    backend
      .expectGet('https://api.github.com/users/blacksonic')
      .respond(profileInfo);

    subject.getProfile('blacksonic').subscribe((response) => {
      expect(response).toEqual(profileInfo);
      done();
    });
  });
});

```

The setup becomes a function call to ```FakeBackend.getProviders()```.
Setting the expectation hides the subscription and gives more readable methods like the ```expectGET```.

The login test also becomes less verbose.

```typescript
it('should be called with proper arguments', (done) => {
  backend.expectPost(
    'https://blacksonic.eu.auth0.com.auth0.com/usernamepassword/login',
    {
      username: 'blacksonic',
      password: 'secret',
      client_id: 'YOUR_CLIENT_ID'
    },
    { 'Content-Type': 'application/json' }
  ).respond(responseForm);

  subject.login('blacksonic', 'secret').subscribe((response) => {
    expect(response).toEqual('</form>');
    done();
  });
});
```

### Conclusion: What we've learned about Angular 2 Http Testing

In this tutorial, we managed to:

- setup a test and fake the Http backend for a service
- write assertions for the request
- refactor the tests to more readable ones

Angular 2 has the tools to test HTTP requests, but still lacks the readable assertion methods which were present in Angularjs.
Until there are no such methods, the [ngx-http-test](https://github.com/blacksonic/ngx-http-test) library can be used.

To see the tests in action check out
[this GitHub repository](https://github.com/blacksonic/angular2-testing-ground "Angular 2 testing ground").
