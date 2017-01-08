---
layout: post
title: Testing React Applications with Jest
description: Learn how to test React applications with the Jest JavaScript testing framework.
date: 2016-12-11 17:00
category: Technical Guide, React
banner:
  text: Painless JavaScript testing with Jest.
author:
  name: Joyce Echessa
  url: https://twitter.com/joyceechessa
  mail: jokhessa@gmail.com
  avatar: https://s.gravatar.com/avatar/f820da721cd1faa5ef4b5e14af3f1ed5
design:
  bg_color: rgb(59, 55, 56)
  bg_merge: true
  image: https://raw.githubusercontent.com/echessa/various_learning/d71b81b76687e35f9757840bde3c84e9be64b6ba/misc/jest_images/jest.png
  image_size: 100%
  image_bg_color: rgb(59, 55, 56)
tags: 
- react
- jest
- testing
related:
- bootstrapping-a-react-project
- logging-and-debugging-in-react-with-flux-replaying-your-users-actions
- adding-authentication-to-your-react-flux-app
- secure-your-react-and-redux-app-with-jwt-authentication
---

## Introduction

Writing tests is an integral part of application development. Testing results in software that has less bugs and that is easier to debug, build on and maintain. In this article, we'll look at how to test a React application using the Jest testing framework.

Jest is a JavaScript test runner [maintained by Facebook](https://github.com/facebook/jest). A test runner is software that looks for tests in your codebase, runs them and displays the results (usually on a CLI interface).

The following are some of the features that Jest offers.

 - **Performance** - Jest run tests in parallel processes thus minimizing test runtime.
 - **Mocking** - Jest allows you to [mock](http://stackoverflow.com/a/2666006/1380071) objects in your test files. It supports [function mocking](https://facebook.github.io/jest/docs/mock-functions.html#content), [manual mocking](https://facebook.github.io/jest/docs/manual-mocks.html#content) and [timer mocking](https://facebook.github.io/jest/docs/timer-mocks.html#content). You can mock specific objects or turn on automatic mocking with [automock](https://facebook.github.io/jest/docs/configuration.html#automock-boolean) which will mock every component/object that the component/object under test depends on.
 - **Snapshot testing** - When using Jest to test a React or React Native application, you can write a snapshot test that will save the output of a rendered component to file and compare the component's output to the snapshot on subsequent runs. This is useful in knowing when your component changes its behaviour.
 - **Code coverage support** - This is provided with Jest with no additional packages or configuration. 
 - **Test isolation and sandboxing** - With Jest, no two tests will ever conflict with each other, nor will there ever be a global or module local state that is going to cause trouble. Sandboxed test files and automatic global state resets for every test.
 - **Integrates with other testing libraries** - Jest works well with other testing libraries (e.g. Enzyme, chai).

Jest is a Node-based runner which means that it runs tests in a Node environment as opposed to a real browser. Tests are run within a fake DOM implementation (via [jsdom](https://github.com/tmpvar/jsdom)) on the command line.

You should note though that while Jest provides browser globals such as `window` by using jsdom, their behavior is only an approximation of their counterparts on a real browser. Jest is intended for unit testing an application's logic and components rather than for testing it for any DOM quirks it might encounter. For this, it is recommended that you use a separate tool for browser end-to-end tests. This is out of scope of this article.

## Setting up the Sample Project

Before looking at how tests are written, let's first look at the application we'll be testing. It can be downloaded [here](https://github.com/echessa/react-testing-with-jest). In the downloaded folder, you will find two projects, one named `starter` with no test files and the other named `completed` with the test files included. In this article, we'll start with the `starter` project and proceed to add tests to it.

The sample application is a simple countdown timer created in react. To run it, first navigate to the root of the starter project:

```sh
$ cd path/to/starter/CountdownTimer
```

Install the necessary libraries:

```sh
$ npm install
```

Run Webpack:

```sh
$ webpack
```

Then run the application with:

```sh
$ npm start
```

Navigate to [http://localhost:3000/](http://localhost:3000/) in you browser. You should see the following.

![React Countdown Timer](https://raw.githubusercontent.com/echessa/various_learning/d71b81b76687e35f9757840bde3c84e9be64b6ba/misc/jest_images/image_01.png)

You can set a time in seconds and start the countdown by clicking on the **Start Countdown** button.

The functionality of the countdown timer has been separated into three components stored in the `app/components` folder namely `Clock.jsx`, `Countdown.jsx` and `CountdownForm.jsx`.

The Clock component is responsible for rendering the clock face and formatting the user's input to an `MM:SS` format. The CountdownForm component contains a form that takes the user input and passes it to the Countdown component which starts decrementing the value every second, passing the current value to the Clock component for display.

Having looked at the sample application, we'll now proceed to writing tests for it.

## Writing Tests

Let's start by installing and configuring Jest.

Run the following command to install Jest and the `babel-jest` library which is a Jest plugin for Babel. The application uses Babel for transpiling JSX and ES6 so the plugin is needed for the tests to work.

```sh
$ npm install --save-dev jest babel-jest
```

With `babel-jest` added, Jest will be able to work with the Babel config file `.babelrc` to know which presets to run the code through. The sample application already has this file. You can see its contents below.

```json
{
    "presets": ["es2015", "react"]
}
```

The `react` preset is used to transform JSX into JavaScript and `es2015` is used to transform ES6 JavaScript to ES5.

With that done, we are now ready to write our first test.

Jest looks for tests to run using the following conventions:

 - Files with .test.js suffix.
 - Files with .spec.js suffix.
 - Files with .js suffix inside a folder named __tests__.
 
Other than `.js` files, it also automatically considers files and tests with the `jsx` extension.
 
For our project, we'll store the test files inside a __tests__ folder. In the `app` folder, create a folder named `__tests__`.

For the first test, we'll write a simple test that ensures that Jest was set up correctly and that it can run a test successfully.

Create a file inside the `app/__tests__` folder, name it `app.test.jsx` and add the following to the file.

```js
describe('App', () => {
    it('should be able to run tests', () => {
        expect(1 + 2).toEqual(3);
    });
});
```

To create a test, you place its code inside an `it()` or `test()` block, including a label for the test. You can optionally wrap your tests inside `describe()` blocks for logical grouping.

Jest comes with a built-in `expect()` global function for making assertions. The above test checks if the expression `1 + 2` is equal to `3`. [Read this](http://facebook.github.io/jest/docs/api.html#writing-assertions-with-expect) for a list of assertions that can be used with `expect()`

Next, modify the `test` property of the `package.json` file as shown.

```json
"test": "jest"
```

You can now run the added test with `npm test` and see the results in the Terminal.

![Jest Test Passed](https://raw.githubusercontent.com/echessa/various_learning/d71b81b76687e35f9757840bde3c84e9be64b6ba/misc/jest_images/image_02.png)

You can also run Jest in watch mode which will keep it running in the terminal and save you from having to start the tests yourself when you make changes to the code. For this use the `npm test -- --watch` command. Anything that is placed after the first `--` is passed to the underlying command, therefore `npm test -- --watch` is similar to `jest --watch`.

We only have one test so far, but as you go further into testing your application and add more tests, you might want to exclude some from running. Jest allows you to either exclude some tests from running or focus on specific tests. To exclude a test from being executed, use `xit()` instead of `it()`. To focus on a specific test without running other tests, use `fit()`.

Now that we know the application can run tests, let's move on to testing its components.

### Testing Components

In the `__tests__` folder, add another folder named `components` and inside that folder, add a file named `Clock.test.jsx`. Then add the following to the file.

```js
import React from 'react';
import ReactDOM from 'react-dom';
import Clock from 'Clock';

describe('Clock', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Clock/>, div);
    });
});
```

This test mounts a component and checks that it doesn't throw an exception during rendering.

If you run the test, it will fail with the error message `Cannot find module 'Clock' from 'Clock.test.jsx'`.

In the application we specify aliases for some files so that we don't have to write their full path every time we import them in another file. The aliases and the files they represent are specified in the `webpack.config.js` file.

```json
resolve: {
    root: __dirname,
    alias: {
        applicationStyles: 'app/styles/app.scss',
        Clock: 'app/components/Clock.jsx',
        Countdown: 'app/components/Countdown.jsx',
        CountdownForm: 'app/components/CountdownForm.jsx'
    },
    extensions: ['', '.js', '.jsx']
}
```

Other test runners like [karma](https://karma-runner.github.io/1.0/index.html) are able to pick up the application's setting from the Webpack config file, but this is not the case with Jest. Jest doesn't automatically work with Webpack. In the above case, Jest doesn't know how to resolve the aliases specified in the Webpack config file.

To solve this, you can either use a third party tool like [jest-webpack-alias](https://www.npmjs.com/package/jest-webpack-alias) or [babel-plugin-module-resolver](https://github.com/tleunen/babel-plugin-module-resolver), or you can add the aliases in Jest's configuration settings. I prefer the latter solution as it is easier to setup and it requires the least modification to the app. With this, Jest settings are separate from the app's settings thus incase I ever want to change the test runner used, I would just need to delete Jest settings from package.json (or from the Jest config file) and won't have to edit the Webpack config file and Babel config file.

You can define Jest's configuration settings either in the `package.json` or create a separate file for the settings and then add the `--config <path/to/config_file>` option to the `jest` command. In the spirit of [separation of concerns](https://en.wikipedia.org/wiki/Separation_of_concerns), we'll create a separate file. Create a file at the root of the project named `jest.config.js` and add the following to it.

```json
{
    "moduleFileExtensions": [
        "js",
        "jsx"
    ],
    "moduleNameMapper": {
        "Clock": "<rootDir>/app/components/Clock.jsx",
        "CountdownForm": "<rootDir>/app/components/CountdownForm.jsx",
        "Countdown": "<rootDir>/app/components/Countdown.jsx"
    }
}

```

`moduleFileExtensions` specifies an array of file extensions your modules use. By default it includes `["js", "json", "jsx", "node"]` (if you require modules without specifying a file extension, Jest looks for these extensions) so we don't really need the setting in the above file as `js` and `jsx` are included. I thought to include it so you know that it is necessary if your project consists of files with other extensions e.g. if you are using TypeScript, then you would include `["js", "jsx", "json", "ts", "tsx"]`.

In `moduleNameMapper`, we map different files to their respective aliases. `rootDir` is a special token that gets replaced by Jest with the root of the project. This is usually the folder where the `package.json` file is located, unless you specify a custom `rootDir` option in your configuration.

If you are interested in finding out other options that you can set for Jest, [check out the documentation](https://facebook.github.io/jest/docs/configuration.html).

In `package.json` modify the value of `test` as shown.

```json
"test": "jest --config jest.config.js"
```

Run the test again with `npm test` and it should now pass. We now know that the component tested renders without throwing an exception.

### Testing Business Logic

We've written a test that assures us that our component renders properly. This however is not an indicator that the component behaves as it should and produces correct output. To test for this, we'll test the component's functions and make sure they are doing what they should be doing.

For this we'll use the [Enzyme](http://airbnb.io/enzyme/) library to write the tests. Enzyme is a JavaScript Testing utility for React created by Airbnb that makes it easier to assert, manipulate, and traverse a React Component's output. It is unopinionated regarding which test runner or assertion library used, and is compatible with the major test runners and assertion libraries available.

To install Enzyme, run the following command:

```sh
$ npm install --save-dev enzyme react-addons-test-utils
```

Then modify `Clock.test.jsx` as shown.

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import Clock from 'Clock';

describe('Clock', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Clock/>, div);
    });

    describe('render', () => {
        it('should render the clock', () => {
            const clock = shallow(<Clock timeInSeconds={63}/>);
            const time = <span className="clock-text">01:03</span>;

            expect(clock.contains(time)).toEqual(true);
        });
    });

    describe('formatTime', () => {
        it('should format seconds', () => {
            const clock = shallow(<Clock/>);
            const seconds = 635;
            const expected = '10:35';
            const actual = clock.instance().formatTime(seconds);

            expect(actual).toBe(expected);
        });

        it('should format seconds when minutes or seconds are less than 10', () => {
            const clock = shallow(<Clock/>);
            const seconds = 65;
            const expected = '01:05';
            const actual = clock.instance().formatTime(seconds);

            expect(actual).toBe(expected);
        });
    });
});

```

The first test remains the same, but since we are using Enzyme you could simplify it by using `shallow()` or `mount()` to render it, like so:

```js
import { mount } from 'enzyme';

it('renders without crashing', () => {
    mount(<Clock/>);
});
```

The difference between `shallow()` and `mount()` is that `shallow()` tests components in isolation from the child components they render while `mount()` goes deeper and tests a componen't children. For `shallow()` this means that if the parent component renders another component that fails to render, then a `shallow()` rendering on the parent will still pass.

The remaining tests test the `Clock.jsx` `render()` and `formatTime()` finctions, placed in separate `describe` blocks.

The Clock component's `render()` function takes a props value of `timeInSeconds`, passes it to `formatTime()` and then displays the returned value inside a `<span>` with a `class` of `clock-text`. In the test with the `describe` label of `render`, we pass in the time in seconds to Clock and assert that the output is as expected.

The `formatTime` `describe` contains two tests. The first checks to see if the `formatTime()` function returns a formatted time if given a valid input and the second ensures that the function prefixes the minutes or seconds value with `0` if the value is less than `10`.

To call the component's function with Enzyme, we use `clock.instance().formatTime(seconds)`. `instance()` returns the instance of the component being rendered as the root node passed into `mount()` or `shallow()`.

Run the tests and they should all pass.

Next we'll add tests for the Countdown component.

Create a file named `Countdown.test.jsx` in the `app/__tests__/components` folder. Add the following to the file.

```js
import React from 'react';
import ReactDOM from'react-dom';
import TestUtils from 'react-addons-test-utils';

import Countdown from 'Countdown';

describe('Countdown', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Countdown/>, div);
    });

    describe('handleSetCountdownTime', () => {
        it('should set countdown time and start countdown', (done) => {
            const countdown = TestUtils.renderIntoDocument(<Countdown/>);
            countdown.handleSetCountdownTime(10);

            expect(countdown.state.count).toBe(10);
            expect(countdown.state.countdownStatus).toBe(1);

            setTimeout(() => {
                expect(countdown.state.count).toBe(9);
                done();
            }, 1001)
        });

        it('should never set countdown time to less than zero', (done) => {
            const countdown = TestUtils.renderIntoDocument(<Countdown/>);
            countdown.handleSetCountdownTime(1);

            setTimeout(() => {
                expect(countdown.state.count).toBe(0);
                done();
            }, 3000)
        });
    });
});
```

The first test is similar to what we had in `Clock.test.jsx`, it just checks that the Countdown component rendered okay. The rest of the tests test the `handleSetCountdownTime()` function of this component. This function is called when the form is submitted and is passed the number of seconds entered (if valid). It then uses this to set the component's state which consists of two values - the `count` and the `countdownStatus`. `componentDidUpdate()` checks if the `countdownStatus` was changed and if so calls the `tick()` function which starts decrementing the value of `count` every second.

In the above we use `TestUtils` to test the component. We could have used Enzyme functions here as well, but we wanted to showcase another great tool that makes testing React components easier. [Facebook recommends](https://facebook.github.io/react/docs/test-utils.html#overview) both Enzyme and TestUtils, so you can decide which you prefer; or you can use them both (in fact, when using Enzyme, you are essentially using TestUtils as well since Enzyme wraps around the `react-addons-test-utils` library).

With TestUtils, components are rendered with `TestUtils.renderIntoDocument()`.

The first test in the block ensures that the `countdownStatus` of the component is changed when a valid time is passed to `handleSetCountdownTime()` and that the `count` has been decremented by `1` after a second.

The second test ensures that `handleSetCountdownTime()` stops counting down at `0`.

### Testing Events

The last component remaining to test is CountdownForm. This contains a form that the user uses to enter the time to be count down. We'll test it to make sure that when a user submits the forms, the listener will call `onSetCountdownTime()` only if the input is valid.

Create a file named `CountdownForm.test.jsx` in the `app/__tests__/components` folder. Add the following to the file.

```js
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import CountdownForm from 'CountdownForm';

describe('CountdownForm', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<CountdownForm/>, div);
    });

    it('should call onSetCountdownTime if valid seconds entered', () => {
        const spy = jest.fn();
        const countdownForm = TestUtils.renderIntoDocument(<CountdownForm onSetCountdownTime={spy}/>);
        const form = TestUtils.findRenderedDOMComponentWithTag(countdownForm, 'form');

        countdownForm.refs.seconds.value = '109';
        TestUtils.Simulate.submit(form);

        expect(spy).toHaveBeenCalledWith(109);
    });

    it('should not call onSetCountdownTime if invalid seconds entered', () => {
        const spy = jest.fn();
        const countdownForm = TestUtils.renderIntoDocument(<CountdownForm onSetCountdownTime={spy}/>);
        const form = TestUtils.findRenderedDOMComponentWithTag(countdownForm, 'form');

        countdownForm.refs.seconds.value = '1H63';
        TestUtils.Simulate.submit(form);

        expect(spy).not.toHaveBeenCalled();
    });
});
```

In the above we use `TestUtils` to simulate the form `submit` event.

Jest comes with spy functionality that enables us to assert that functions are called (or not called) with specific arguments.

A test spy is a function that records arguments, return value, the value of `this` and exception thrown (if any) for all its calls. Test spies are useful to test both callbacks and how certain functions are used throughout the system under test. To create a spy in Jest, we use `const spy = jest.fn()`. This provides a function we can spy on and ensure that it is called correctly.

We then render the CountdownForm component and pass in the spy as the value of the `onSetCountdownTime` props. We then set the form's `seconds` value and simulate a submission. If the value for `seconds` is valid, the spy will be called, otherwise it won't.

Run the tests and everything should pass.

### Coverage Reporting

As mentioned earlier, Jest has an integrated coverage reporter that works well with ES6 and requires no further configuration. You can run it with `npm test -- --coverage`. Below you can see the coverage report of our tests.

![Jest Coverage Reporting](https://raw.githubusercontent.com/echessa/various_learning/d71b81b76687e35f9757840bde3c84e9be64b6ba/misc/jest_images/image_03.png)

### Snapshot Testing

Snapshot testing is another feature of Jest which automatically generates text snapshots of your components and saves them to disk so if the UI output changes later on, you will get notified without manually writing any assertions on the component output.

When running a snapshot test for the first time, Jest renders the component and saves the output as a JavaScript object. Each time the test is run again, Jest will compare its output to the saved snapshot and if the component's output is different from the snapshot, the test will fail. This may be an indicator that the component has a bug somewhere and you can go ahead and fix it until its output matches the snapshot, or you might have made the changes to the component on purpose and so it is the snapshot that will need updating. To update a snapshot you run jest with the `-u` flag.

With snapshot testing, you will always know when you accidentally change a component's behaviour and it also saves you from writing a lot of assertions that check if your components are behaving as expected.

We'll include one snapshot test for the Clock component in the sample app. You can include the snapshot test in the `Clock.test.js` file, but I prefer to have my snapshot tests in separate files.

Create a file named `Clock.snapshot.test.jsx` in the `app/__tests__/components` folder. Add the following to the file.

```js
import React from 'react';
import Clock from 'Clock';
import renderer from 'react-test-renderer';

describe('Clock component renders the clock correctly', () => {
  it('renders correctly', () => {
    const seconds = 63;
    const rendered = renderer.create(
      <Clock timeInSeconds={seconds}/>
    );

    expect(rendered.toJSON()).toMatchSnapshot();
  });
});
```

The above renders the Clock (with a value of 63 seconds passed into it) and saves the output to a file.

Before running the test, install the following package. It provides a React renderer that can be used to render React components to pure JavaScript objects.

```sh
$ npm install --save-dev react-test-renderer
```

Run your tests and the output will show that a snapshot has been added.

![Jest Snapshot Test](https://raw.githubusercontent.com/echessa/various_learning/d71b81b76687e35f9757840bde3c84e9be64b6ba/misc/jest_images/image_04.png)

When you look at your project, there will be a `__snapshots__` folder inside the `app/__tests__/components` folder with a file named `Clock.snapshot.test.jsx.snap` inside it. The following are its contents.

```
exports[`Clock component renders the clock correctly renders correctly 1`] = `
<div
  className="clock">
  <span
    className="clock-text">
    01:03
  </span>
</div>
`;
```

As you can see, it shows the expected result of having passed `63` to the Clock component.

With the snapshot test that we just added, we don't need the test in `Clock.test.jsx` that checks if the rendered output contains a `<span>` with a certain string in it.

You should include the `__snapshots__` folder in your versioning system to ensure that all team members have a correct snapshot to compare with.

## Aside: Using React with Auth0

If you are interested in using Auth0 in your React application for authentication, check out our [documentation](https://auth0.com/docs/quickstart/spa/react) which covers that and also take a look at [this article](https://davidwalsh.name/react-authentication).

## Conclusion

We've looked at how to use Jest as a test runner when testing a React application. For more on Jest, be sure to [check its documentation](https://facebook.github.io/jest/).