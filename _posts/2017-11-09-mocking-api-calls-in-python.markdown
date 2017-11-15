---
layout: post
title: "Mocking API calls in Python"
description: "Demonstrate testing of API requests in Python by mocking"
date: 2017-11-09 01:57
category: Technical guide
author:
  name: "O'Brian Kimokot"
  url: "https://twitter.com/O_BRIANKIM"
  mail: bkim19302@gmail.com
  avatar: "https://gravatar.com/avatar/00af6e085efbc34b55b184c779601fe2?s=200"
design:
  bg_color: "#0e2338"
  image: "https://cdn.auth0.com/blog/python-restful/logo.png"
tags:
- api
- python
- testing
---

## Introduction

Use of mocks to test enables continuous testing - of components; by mocking out external dependencies and APIs you can run your tests as often as you want without affecting those dependencies and without being affected by any unexpected changes or irregularities within them. Mocking also saves us on time and computing resources if we have to test HTTP requests that fetch a lot of data.

A mock is a fake object that you construct to look and act like real data. You swap it with the actual object and trick the system into thinking that the mock is the real deal.

### Setup

For this tutorial, we will require Python 3 installed and then set up a simple folder structure.

```sh
project/
├── users_test/
    └── test_users.py
    └── __init__.py
├── __init__.py
├── circle.yml
├── requirements.txt
├── users.py
```

We then create a virtual environment inside the `project` folder.

```sh
$ virtualenv -p python3 venv   # Create virtual environment
$ source venv/bin/activate # Activate virtual environment
```

We then install the required packages.

```sh
$ pip install nose2 requests
```

* The `nose2` library extends the built-in Python unittest module to make testing easier. You can use unittest or other third-party libraries such as pytest to achieve the same results.
* The `requests` library simplifies HTTP calls in Python.

For this tutorial, we will be communicating with a fake API on [JSONPlaceholder](http://jsonplaceholder.typicode.com/). 

To find tests, `nose2` looks for modules whose names start with `test`. In those modules, `nose2` will load tests from all `unittest.TestCase` subclasses, as well as functions whose names start with `test`.


### Test Driven Development(TDD)

TDD is an evolutionary approach to development which combines test-first development where we write a test before we write just enough production code to fulfill that test and refactoring. The main aim of TDD is the specification and not validation; it’s one way to think through our requirements before we write functional code. We will follow this approach and begin by writing a simple test to check our API's response's status code.

```python
# project/users_test/test_users.py
import unittest
from users import get_users

class BasicTests(unittest.TestCase):
    def test_request_response(self):
        response = get_users();

        # Assert that the request-response cycle completed successfully with status code 200.
        self.assertEqual(response.status_code, 200)

if __name__ == "__main__":
    unittest.main()
```

Running the test will fail with an error since we are missing the module we are trying to test.

<p align="center"><img src="https://cdn.auth0.com/blog/python-api-test/error_test.png" alt="Erroring Test"></p>

We then write the functionality to make it pass.

```python
# project/users.py

import requests

USERS_URL = 'http://jsonplaceholder.typicode.com/users'
def get_users():
    """Get list of users"""
    response = requests.get(USERS_URL)
    if response.ok:
        return response
    else:
        return None
```

We then run the tests again and this time, the result is:

<p align="center"><img src="https://cdn.auth0.com/blog/python-api-test/pass_test_no_mock.png" alt="Passing Test"></p>

Up to this point, we have managed to write and test our API by making real API requests during the tests.

## Utilizing Mocks

The code is working as expected because, until this point, the test is passing. Real world applications will mean the increased complexity of our application, more tests, and more API calls. If we wrote a thousand tests for our API calls and each takes a second to fetch 10kb of data, this will mean a very long time to run our tests and more computing and internet resources which eventually slows down the development process. In any case, our server breaks down, we will stop the development of our client application since we cannot test it. In this section, we will learn how to detach our programming logic from the actual external library by swapping the real request with a fake one that returns the same data. We explore different ways of using mocks in our tests.

### Using Decorators

The first method is the use of decorators.

```python
# project/users_test/test_users.py    
import unittest
from users import get_users
from unittest.mock import patch

class BasicTests(unittest.TestCase):
    @patch('users.requests.get')  # Mock 'requests' module 'get' method.
    def test_request_response(self, mock_get):
        mock_get.return_value.status_code = 200 # Mock status code of response.
        response = get_users()

        # Assert that the request-response cycle completed successfully.
        self.assertEqual(response.status_code, 200)


if __name__ == "__main__":
    unittest.main()
```

We then run the tests again with `nose2`:

<p align="center"><img src="https://cdn.auth0.com/blog/python-api-test/pass_mock_test_decorator.png" alt="Passing Test"></p>

The test passes without modifying our functions in any way.

#### Explanation

First, we imported the `patch()` function from the mock library. Next, we modified the test function with the `patch()` function as a decorator, passing in a reference to `users.requests.get`. In the function itself, we passed in a parameter `mock_get`, and then in the body of the test function, we added a line to set `mock_get.return_value.status_code = 200`.

So what actually happens when the test is run? We will first try to understand how the `requests` library works. When we call the `requests.get()` function, it makes an HTTP request and then returns an HTTP response in the form of a response object. The `get()` function itself communicates with the external server, which is why we need to target it. We need to make the mock to look and act like the `requests.get()` function.
When the test function is run, it finds the module where the requests library is declared, `users`, and replaces the targeted function, `requests.get()`, with a mock. The test also tells the mock to behave the way the function expects it to act. Looking at `get_users()`, we see that the success of the function depends on if our response has an `ok` property represented with `response.ok` which translates to a status code of 200. That is what the line `mock_get.return_value.status_code = 200` is doing. When the `status_code` property is called on the mock, it will return 200 just like the actual object. The `get_users()` function will return the response, which is the mock, and the test will pass because the mock response status code is 200.

### Using a Context Manager

In this example, we explicitly patch a function within a block of code, using a context manager. The `with` statement patches a function used by any code in the code block. When the code block ends, the original function is restored.

```python
# project/users_test/test_users.py   
... 
from unittest.mock import patch

class BasicTests(unittest.TestCase):
    def test_request_response(self):
        with patch('users.requests.get') as mock_get:
            # Configure the mock to return a response with status code 200.
            mock_get.return_value.status_code = 200

            # Call the function, which will send a request to the server.
            response = get_users()

        # Assert that the request-response cycle completed successfully.
        self.assertEqual(response.status_code, 200)
...
```

### Using a Patcher

Another way to patch a function is to use a patcher. We identify the source to patch and then we start using the mock. The patching does not stop until we explicitly tell the system to stop using the mock. This is more suitable when using the `setUp()` and `tearDown()` functions in tests where we can start the patcher in the `setup()` method and stop it in the `tearDown()` method.

```python
# project/users_test/test_users.py   
...
class BasicTests(unittest.TestCase):
    def test_request_response(self):
        mock_get_patcher = patch('users.requests.get')

        # Start patching 'requests.get'.
        mock_get = mock_get_patcher.start()

        # Configure the mock to return a response with status code 200.
        mock_get.return_value.status_code = 200

        # Call the service, which will send a request to the server.
        response = get_users()

        # Stop patching 'requests'.
        mock_get_patcher.stop()

        # Assert that the request-response cycle completed successfully.
        self.assertEqual(response.status_code, 200)
...
```

## Mocking the whole function behavior

In the previous examples, we have implemented a basic mock and tested a simple assertion. In this section, we focus on mocking the whole functionality of `get_users()`. When using `@patch()`, we provide it a path to the function we want to mock. The function is found and `patch()` creates a `Mock` object, and the real function is temporarily replaced with the mock. When `get_users()` is called by the test, the function uses the `mock_get` the same way it would use the real `get()` method. That means that it calls `mock_get` like a function and expects it to return a response object.

```python
# project/users_test/test_users.py   
...
from unittest.mock import patch, Mock

class BasicTests(unittest.TestCase):
    def test_request_response(self):
        mock_get_patcher = patch('users.requests.get')
        users = [{
            "id": 0,
            "first_name": "Dell",
            "last_name": "Norval",
            "phone": "994-979-3976"
        }]

        # Start patching 'requests.get'.
        mock_get = mock_get_patcher.start()

        # Configure the mock to return a response with status code 200 and a list of users.
        mock_get.return_value = Mock(status_code = 200)
        mock_get.return_value.json.return_value = users

        # Call the service, which will send a request to the server.
        response = get_users()

        # Stop patching 'requests'.
        mock_get_patcher.stop()

        # Assert that the request-response cycle completed successfully.
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), users)
...
```

#### Explanation

`get_users()` function that was patched with a mock returned a mock object response. Whenever the `return_value` is added to a mock, that mock is modified to be run as a function, and by default it returns another mock object. In this example, we made it more clear by explicitly declaring the Mock object, `mock_get.return_value = Mock(status_code=200)`. The `mock_get()` mirrors `requests.get()`, and `requests.get()` returns a response whereas `mock_get()` returns a `Mock`. The response object has a `status_code` property, so we added it to the Mock.
The response object also has a `json()` function, so we added it to the mock and appended it with a `return_value`, since it will be called like a function. The `json()` function returns a list of users. Notice that the test now includes an assertion that checks the value of `response.json()`. We want to ensure that the `get_users()` function returns a list of users, just like the actual server does. 

## Mocking third-party functions

The above example has been fairly straightforward. Envision a situation where we create a new function that calls `get_users()` and then filters the result to return only the user with a given ID. In such a case, we mock `get_users()` function directly. For `get_users()`, we know that it takes no parameters and that it returns a response with a `json()` function that returns a list of users. What we care most about is not its implementation details. but the fact that `get_users()` mock returns what the actual `get_users()` function would have returned.

```python
#project/users_test/test_users.py   
... 
@patch('users.get_users')
def test_get_one_user(self, mock_get_users):
    """Test for getting one user using their userID"""
    users = [
        {'phone': '514-794-6957', 'first_name': 'Brant', 'last_name': 'Mekhi', 'id': 0},
        {'phone': '772-370-0117', 'first_name': 'Thalia', 'last_name': 'Kenyatta', 'id': 1},
        {'phone': '176-290-7637', 'first_name': 'Destin', 'last_name': 'Soledad', 'id': 2}
        ]
    mock_get_users.return_value = Mock()
    mock_get_users.return_value.json.return_value = users
    user = get_user(2)
    self.assertEqual(user, users[2])
...
```

In the above snippet, we mock the functionality of `get_users()` which is used by `get_user(user_id)`. When we run our tests, our test passes successfully with the following implementation of `get_user(user_id)`.

```python
#project/users.py
...
def get_user(user_id):
    """Get a single user using their ID"""
    all_users = get_users().json()
    for user in all_users:
        if user['id'] == user_id:
            return user
...
```

<p align="center"><img src="https://cdn.auth0.com/blog/python-api-test/mock_whole_function.png" alt="Mock whole function"></p>

## Continuous integration with Circle CI

In the final step, we dive a bit into continuous integration and development by creating a workflow pipeline that will automate the process of running our tests. For this purpose, we will use [Circle CI](https://circleci.com) which requires some minor configurations like setting the branch to run our tests on. We will ensure that while using GitHub, we prevent pushing code to the master branch and only enable merging into the master branch after our tests have passed and this will be indicated by the status checks.


#### Creating a Circle CI configuration file

We first begin by creating a Circle CI configuration file.

```yaml
# circle.yml

machine:
  python:
    version: 3.5.2

dependencies:
  override:
    - pip install -r requirements.txt

test:
  override:
    - nose2 --verbose
```

Every time, we push our code, Circle CI will run our tests and show results. A green bar indicates success and all tests have passed.

<p align="center"><img src="https://cdn.auth0.com/blog/python-api-test/circle_ci_pass.png" alt="Circle CI Pass"></p>

The above will also be reflected in our repository. We make a pull request from `develop` to `master` branch and change our repository settings to protect our master branch and prevent merging to it unless out tests pass.

<p align="center"><img src="https://cdn.auth0.com/blog/python-api-test/github_branch_protect.png" alt="Github branch protect"></p>

To demonstrate this, we will intentionally make our tests fail. We can see the merge PR button disabled on our PR page

<p align="center"><img src="https://cdn.auth0.com/blog/python-api-test/github_circle_ci_fail.png" alt="Circle CI failing checks"></p>

After fixing our tests, the status check will pass and we can be able to merge our code.

<p align="center"><img src="https://cdn.auth0.com/blog/python-api-test/github_circle_ci_pass.png" alt="Circle CI passing checks"></p>

The above workflow can be very handy when developing real-world applications with different environments(staging, production) and use of a CI tool ensures that we can not deploy our applications with errors.

## Conclusion

Mocking of API calls is a very important concept while developing applications with several advantages including but not limited to faster development and saving of computing resources.
Use of continuous integration tools is a major boost to setting up efficient and smooth development environments using pipelines. This eliminates manual testing of applications and provides a uniform platform for testing of our applications. The complete code for this tutorial can be found on [Github](https://github.com/kimobrian/Python-API-Testing).