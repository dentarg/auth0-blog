---
layout: post
title: "Angular Testing In Depth: HTTP Services"
description: "Learn how to test HTTP services in Angular. We will start by writing tests for requests and finish by refactoring them to a cleaner format."
date: 2017-02-15 08:23
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
- angular-testing-in-depth-components
---

<div class="alert alert-info alert-icon">
  <i class="icon-budicon-664"></i>
  <strong>Get the "Migrating an Angular 1 App to Angular 2 book" for Free.</strong> Spread the word and <a href="https://auth0.com/e-books/migrating-to-angular2">download it now!</a>
</div>

When we write a web application, most of the time it has a backend.
The most straightforward way to communicate with the backend is with HTTP requests.
These requests are crucial for the application, so we need to test them.
More importantly, these tests need to be isolated from the outside world.
In this article I will show you how to test your requests properly and elegantly.

This article is the second part of a series in which
I share my experiences testing different building blocks of an Angular application.
It relies heavily on Dependency Injection based testing and
it is recommended that you read [the first part](https://auth0.com/blog/angular-2-testing-in-depth-services/)
if you are not familiar with the concepts.

- [Services](https://auth0.com/blog/angular-2-testing-in-depth-services/)
- HTTP Services (this article)
- [Components](https://auth0.com/blog/angular-testing-in-depth-components/)
- Pipes
- Routing

### Testing our first request

<p align="center">
  <img src="https://github.com/blacksonic/articles/raw/master/img/angular2-testing-http-services/github-logo.png" alt="Angular Testing Framework"/>
</p>

To get started we will test a basic request, the GET request.
It will call a parameterized url without a body or additional headers.
The [Github API](https://developer.github.com/v3/) has an endpoint for retrieving public profile information about users.
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
Every request made with the ```HttpModule``` returns an ```Observable.```
The returned value will always be a ```Response``` object, which can return the response body.
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

The problem with the real ```HttpModule``` is that we will end up sending real HTTP requests.
It is an absolutely terrible idea to do this with unit tests, because it breaks the test's isolation from the outside world.
Under no circumstances will the result of the test be guaranteed.
For example, the network can go down and our well-crafted tests will no longer work.

Instead, Angular has a built-in way to fake HTTP requests.

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
        useFactory: (mockBackend: MockBackend, defaultOptions: RequestOptions) => {
          return new Http(mockBackend, defaultOptions);
        },
        deps: [MockBackend, BaseRequestOptions]
      }
    ]
  });
});
```

Instead of providing ```Http``` as a module,
it is better to use the factory provider and pass the ```MockBackend``` instance to the ```Http``` constructor.
This way the fake backend captures every request and can respond accordingly.

Before writing the first test it is also important to get an instance of the ```MockBackend,```
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

Requests made are available through the ```connections``` property of the fake backend as an ```Observable.```
When it receives the request through the ```subscribe``` method we can respond with a JSON object.

In our example only the response body is set. In addition, you can set the status and the headers of the request.

Another new element is the ```done``` callback that is passed into the test function.
It is needed when writing asynchronous tests.
This way the test doesn't end when the execution of the function ends.
It will wait until the ```done``` callback is called.
Of course, there is a timeout for hanging tests that don't call this ```done``` method within a given interval.

HTTP requests are asynchronous by nature,
but the fake backend we use responds to them synchronously (it calls the ```subscribe``` method synchronously).
You may wonder what makes the test asynchronous, then.

The answer is false positive tests.
If we comment out the response to the request, the test will still pass, even though we have an assertion.
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

Until now we haven't made any assertions for the request.
For example, what was the called url, or what was the method of the request?
To make the test more strict we have to check these parameters.

```typescript
backend.connections.subscribe((connection: MockConnection) => {
  expect(connection.request.url).toEqual('https://api.github.com/users/blacksonic');
  expect(connection.request.method).toEqual(RequestMethod.Get);

  ...
});
```

The original ```Request``` object resides on the ```MockConnection``` object.
With its ```url``` and ```method``` property, we can add the assertions easily.

### Digging deeper

GET requests are good for retrieving data, but we'll make use of other HTTP verbs to send data.
One example is POST.
User authentication is a perfect fit for POST requests.
When modifying data stored on the server we need to restrict access to it.
This is usually done with a POST request on the login page.

<p align="center">
  <img src="https://github.com/blacksonic/articles/raw/master/img/angular2-testing-http-services/auth0-logo.png" alt="Angular Testing Framework"/>
</p>

Auth0 provides a good solution for handling user authentication.
It has a feature to authenticate users based on username and password.
To demonstrate how to test POST requests, we will send a request to the Auth0 API.
We won't be using their recommended package here, because it would abstract out the actual request,
but for real-world scenarios I would recommend using it.

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

The main difference between this example and the previous one is that here we are sending a JSON payload to the server
and appending additional headers onto it.
We don't have to manually ```JSON.stringify``` the payload --- the request methods will take care of it.
The response will be in text format, so this time we don't have to convert anything to JSON.

Let's look at the test to see how we can check every detail of the request.

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

The headers are also available on the ```Request``` object and can be checked one by one.
The payload can be retrieved with the ```getBody``` method.
This method always returns the body converted to a string, which will we see in the network traffic.
When we send JSON it will contain the output of the ```JSON.stringify``` method: printed with spaces and an indentation of two.

### Refactoring

The previous setup works, but it has multiple problems.

- For every service we test, the provider configuration will be exactly the same.
- The subscription to the outgoing connection responds the same immediately, regardless of the url.
- The assertions are verbose and hard to read.

Those who have tested their HTTP services in Angularjs may remember how simple the setup was for those tests.
Angularjs provided convenient methods for setting expectations on requests.

Angular doesn't have those built-in functionalities,
but very similar ones are present in the [ngx-http-test](https://github.com/blacksonic/ngx-http-test) library.

It can solve the problems mentioned earlier.
Let's look at the test with the library for the Github profile fetch.

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
Setting the expectation hides the subscription and gives more readable methods like ```expectGET```.

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

### Conclusion: What we've learned about Angular HTTP testing

In this tutorial, we managed to:

- setup tests and fake an HTTP backend
- write assertions for requests
- refactor the tests to be more readable

Angular has the tools to test HTTP requests, but still lacks the readable assertion methods that were present in Angularjs.
Until such methods are implemented, the [ngx-http-test](https://github.com/blacksonic/ngx-http-test) library can be used.

To see the tests in action check out
[this GitHub repository](https://github.com/blacksonic/angular-testing-ground "Angular testing ground").
