---
layout: post
title: "Build Robust Apps with Mithril and Auth0"
description: "Mithril is a small, fast JavaScript framework for building Single Page Applications, and can be learned in just 10 minutes."
longdescription: Mithril positions itself as a compact but powerful modern client-side JavaScript framework. In this tutorial, we are going to use Mithril to build a fairly complex web interface to store data about conferences and authenticate it with Auth0. 
date: 2018-03-20 8:30
category: Technical Guide, Frontend, JavaScript
banner:
  text: "Auth0 makes it easy to add authentication to your Single Page Application."
author:
  name: "Dan Arias"
  url: "https://twitter.com/getDanArias"
  mail: ""
  avatar: "https://pbs.twimg.com/profile_images/918124318076256256/wMFapJ1C_400x400.jpg"
design:
  image: https://cdn.auth0.com/blog/mithril/logo.png
  bg_color: "#222228"
tags:
- mithril
- javascript
- framework
- single-page-app
- spa
related:
- 2018-02-07-oauth2-the-complete-guide
- 2018-01-09-the-complete-guide-to-deploying-javascript-applications-part-1
- 2018-02-06-developing-games-with-react-redux-and-svg-part-1
---

**TL;DR:** Mithril positions itself as a compact but powerful modern client-side JavaScript framework. Its API is engineered to allow developers to build large single page applications while keeping a very small footprint. With a size of under 8kb as a gzip, Mithril delivers speed and performance without any compromise on functionality. Out of the box, Mithril offers flexible routing and XHR utilities. [Benchmarks](https://mithril.js.org/index.html#what-is-mithril?) provided by the developers of the project show that Mithril is smaller and performs better than the three leading mainstream frameworks: React, Angular, and Vue. In this tutorial, we are going to use Mithril to build a fairly complex web interface to store data about conferences and authenticate it with [Auth0](https://auth0.com). The final code can be found at the [Mithril-Sample-App GitHub repo](https://github.com/getDanArias/Mithril-Sample-App) and a [live demo is here](https://conference-tracker-95127.firebaseapp.com/#!/conferences).

---

> If you need a quick refresher on Mithril, please visit the [Mithril official guide here](https://mithril.js.org/index.html). It truly only takes 10 minutes to become productive with Mithril.

# Building an Interface with Mithril

We are ready to put Mithril to the test. Understanding the core fundamentals of how Mithril works will let us rapidly prototype the application that we want to build. The first question that we need to answer is: what are we actually going to build?

## Conference Tracker: Requirements

We are going to create an application that allows the user to track the opening dates of conferences along with the deadlines for Call For Papers for the conferences, if available. A Call For Papers gives speakers the chance to submit a request to speak at a conference.

The following use cases define our application requirements:

* User has access to a form to enter conference data.
* User can save conference data.
* User can mark a conference as favorite.
* Optionally, user can mark if interested in "Call for Papers" and input a deadline for submission.
* User can see a countdown for conference opening day and CFP deadline, if opted in.

Our interface will fulfill these requirements as defined in the following outline:

* The interface will offer three views:
    * Saved conferences.
    * Saved conferences with Call For Papers.
    * Form to enter conference data.
* Each conference data is presented through a card.
    * A conference card has an icon to mark it as favorite.
    * A CFP card has an icon to mark it as complete.
* The user will navigate to each view through a tabbed navigation bar that has buttons to represent each view.
* The navigation bar is always present.
* Since we want to protect user data from unauthorized usage, we are going to create an authentication landing page that will use Auth0 to grant or deny user access to the application.
* The interface will provide login and logout buttons.

Since Mithril makes it very easy to work in terms of components, we are going to use a component based architecture to create our application. Each element of the UI will be represented through a component. We are going to create reusable components as much as we can. Before we proceed in designing a prototype of the application, let's first define what the user data looks like.

## Defining the Application Data Model

Our data model needs to be able to answer the following questions based on the requirements:

* What is the name of the conference?
* Where is the conference?
* When is the conference?
* Is this a favorite conference?
* Was a Call For Papers entered for the conference?
* What is the deadline for the CFP if entered?
* Has the CFP submission been completed if entered?

Our core unit of data in this application is then going to be a conference object that has properties that provide separate answers for each of the previous questions. The default state of the conference object is as follows:

```javascript
const conference = {
  name: "",
  location: "",
  date: "",
  favorite: false,
  CFP: false,
  CFPDate: "",
  CFPCompleted: false
}
```

We are going to create a form that will collect data to replace the default values in the conference object. Upon absence of that data, the default object values will prevail. How we organize our interface to present the data model is what we are going to explore next.

## Planning and Designing the Interface

Defining well what we are going to build will allow us to build it much faster &mdash; especially with a very easy to use, uncomplicated tool such as Mithril! Think of the process we are following as creating blueprints that we are going to hand to our construction team to build everything up with JSX and Mithril.

There is a great article from the React community titled ["Thinking in React"](https://reactjs.org/docs/thinking-in-react.html). The concepts taught in the article can be applied to any language, framework or tool that is used to create interfaces.

The key premise from the article is that we are going to treat each element of our interface as a discrete component. What do we mean by that? The interface is built by composing or assembling these components, much like we use bricks to build a house or ingredients to bring a recipe to life.

It's interesting to bring up the cooking analogy. The core difference here between cooking and building an interface is that we do not mutate or lose our components upon composition. At any time, we can extract a button and replace it with something else. With cooking, the ingredients are often mutated permanently and their initial state is forever lost.

To be able to "Think in Components", we need a wireframe that we can slice into components. Here you go:

<p style="text-align: center;">
  <img src="https://raw.githubusercontent.com/getDanArias/conference-tracker-assets/master/finalview.png" alt="Final Mithril app view preview">
</p>

At first glance, we can get a clear idea of how this interface could be "componentized." But before we slice it up into components, let's agree that the whole interface needs to be contained within a top-level component. We are going to call that component `App` and it is the component that we will `m.mount()` or `m.render()` into `root`.

Let's start creating a component tree:

```bash
   |-- App
```

Let's populate that tree, from the top to the bottom, with well-defined components:

`MainStage`:

<p style="text-align: center;">
  <img src="https://raw.githubusercontent.com/getDanArias/conference-tracker-assets/master/mainStage.png" alt="The main stage of the application">
</p>

`NavBar`:

<p style="text-align: center;">
  <img src="https://raw.githubusercontent.com/getDanArias/conference-tracker-assets/master/navBar.png" alt="The navigation bar of the application">
</p>

`NavButton`:

<p style="text-align: center;">
  <img src="https://raw.githubusercontent.com/getDanArias/conference-tracker-assets/master/navbutton1.png" alt="A navigation button of the application with a microphone icon">
</p>

<p style="text-align: center;">
  <img src="https://raw.githubusercontent.com/getDanArias/conference-tracker-assets/master/navbutton2.png" alt="A navigation button of the application with a group of people as an icon">
</p>

<p style="text-align: center;">
  <img src="https://raw.githubusercontent.com/getDanArias/conference-tracker-assets/master/navbutton3.png" alt="A navigation button of the application with a notepad icon">
</p>


For each of the `NavButton` icons, we are going to use icons from the [FontAwesome](https://fontawesome.com/) library.

`MainStage` is a layout component that should receive a Conference View component bundle which is made up of:

* `StageBanner`: Holds the view title and a signout button.
* `CardContainer`: Holds a stack of cards that have conference information.

`StageBanner`:

<p style="text-align: center;">
  <img src="https://raw.githubusercontent.com/getDanArias/conference-tracker-assets/master/stagebanner.png" alt="A banner in the main stage of the application">
</p>

`CardContainer`:

<p style="text-align: center;">
  <img src="https://raw.githubusercontent.com/getDanArias/conference-tracker-assets/master/cardcontainer.png" alt="A container that has cards holding information about conferences">
</p>


`StageBanner` holds the view title and a logout button.

Within `CardContainer`, it is easy to see that we have a stack of cards holding conference information. The number of cards that we may have there can range from zero to infinity. Therefore, `CardContainer` needs to be a scrollable container.

Let's visualize what a `ConferenceCard` looks like:

`ConferenceCard`:

<p style="text-align: center;">
  <img src="https://raw.githubusercontent.com/getDanArias/conference-tracker-assets/master/card1.png" alt="A card holding conference sample data">
</p>

<p style="text-align: center;">
  <img src="https://raw.githubusercontent.com/getDanArias/conference-tracker-assets/master/card2.png" alt="A card holding conference sample data">
</p>

<p style="text-align: center;">
  <img src="https://raw.githubusercontent.com/getDanArias/conference-tracker-assets/master/card3.png" alt="A card holding conference sample data">
</p>

<p style="text-align: center;">
  <img src="https://raw.githubusercontent.com/getDanArias/conference-tracker-assets/master/card4.png" alt="A card holding conference sample data">
</p>

Note that the elements of `CardContainer` may be different for the CFP View or that we may not even use it for the Entry Form View. We are using Conference View as a starting template on what the common architectural theme of a view is.

It would be a good idea to divide a `ConferenceCard` into four sections. Each section will hold a piece of information about the conference. Let's call each section a `ConferenceField`.

Our final component tree looks like this:

```bash
   |-- App
   |   |-- MainStage
   |   |   |-- StageBanner
   |   |   |   |-- StageTitle
   |   |   |   |-- LogoutButton
   |   |   |-- CardContainer
   |   |   |   |-- ConferenceCard
   |   |   |   |   |-- ConferenceField
   |   |   |   |   |-- ConferenceField
   |   |   |   |   |-- ConferenceField
   |   |   |   |   |-- ConferenceField
   |   |   |   |-- ...
   |   |-- NavBar
   |   |   |-- NavButton
   |   |   |-- NavButton
   |   |   |-- NavButton
```

We have completely dissected Conference View into components and created a tree that gives as the component architecture we need to follow to build it. Let's finally do that now!


## Setting up the Project

Create a folder in your system called `conference-tracker`. This folder will be our project folder.

Within `conference-tracker` create the following file structure including folders and files:

```bash
conference-tracker
   |-- src
   |   |-- components
   |   |-- services
   |   |-- store
   |   |-- index.css
   |   |-- index.jsx
   |-- .babelrc
   |-- index.html
   |-- webpack.config.js
```

Let's have a brief overview of the Project Structure:

Project working files are placed under the `src` folder. Within the `src` folder, files are organized according to their function in the context of the application. This ideal is represented through the following subfolders and files:

* `components`: It contains all the components that are used to build the application interface. Within this folder, components are categorized and grouped in folders that represent their common functionality, such as `ui` and `layout`.

* `services`: It contains business logic that may need to be shared across more than one component. Instead of packing extensive logic within a component, that logic should be made a service and imported by the component that needs it.
* `store`: It holds mock data but may as well hold constructs that manage the state of the application built with libraries such as `rxjs` or `redux`.

* `index.js`: It's the entry point of the application. The core logic of the application such as the `m.route`, `m.render` or `m.mount` reside here. The interface is composed from the different components and rendered here.

* `index.css`: It holds application-wide styling. Feel free to modify the styling or extend it.

> We are going to focus on building the JavaScript and Mithril layer of the application and not the CSS and layout layer. Please copy and paste the final `index.css` code for the application from the [completed sample app repository available here](https://github.com/getDanArias/Mithril-Sample-App/blob/master/src/index.css).

In the root folder, we also find these key files:

* `index.html`: It's the core template for the application where our composed interface will be rendered. The hook in `index.html` where the interface is attached is `<div id="app">`. Our JavaScript logic is bundled by Webpack and made available to `index.html` through `<script src="/bundle.js">`.

* `.babelrc`: It holds all the Babel configuration that allows us to transpile modern JS and JSX into browser compatible JS.

* `webpack.config.js`: It holds the webpack configuration. For deeper information on what's going on here, feel free to explore the [Webpack docs](https://webpack.js.org/).

We are done creating our file structure foundation. Now, let's make this a Node project by running `yarn init` or `npm init` at the root folder `conference-tracker`. Answer the questions at your discretion and note that we now have a `package.json` present in our directory.


Replace the code of `package.json` with the following:

```json
{
  "name": "conference-tracker",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "devDependencies": {
    "babel-cli": "^6.26.0",
    "babel-plugin-transform-react-jsx": "^6.24.1",
    "babel-preset-es2015": "^6.24.1",
    "babel-preset-stage-1": "^6.24.1",
    "babel-core": "^6.26.0",
    "babel-loader": "^7.1.3",
    "clean-webpack-plugin": "^0.1.18",
    "css-loader": "^0.28.10",
    "file-loader": "^1.1.10",
    "html-webpack-plugin": "^3.0.4",
    "style-loader": "^0.20.2",
    "webpack": "^4.0.1",
    "webpack-cli": "^2.0.9",
    "webpack-dev-server": "^3.1.0"
  },
  "dependencies": {
    "auth0-js": "^9.3.1",
    "mithril": "^1.1.6"
  },
  "scripts": {
    "start": "webpack-dev-server --open",
    "build": "webpack --config webpack.config.js"
  }
}
```

Now, run `yarn` or `npm install` to install the required project dependencies. Feel free to visit the repos of each dependency to learn more about what each one is doing. Most of the `devDependencies` are there to make Webpack transpile JSX to JS and load our stylesheets. For this tutorial, we are going to skip using SCSS.

Next, open `webpack.config.js` and paste the following Webpack logic:

```javascript
const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  entry: './src/index.jsx',
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./dist"
  },
  plugins: [
    new CleanWebpackPlugin(["dist"]),
    new HtmlWebpackPlugin({
      template: "./index.html",
      filename: "index.html",
      inject: "body"
    })
  ],
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [{
      test: /\.jsx$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      }
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      }
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }]
  }
};
```

I am not going to go over the Webpack logic in detail but it helps us serve our project and get browser live reloading as well. For a deeper explanation on the different parts of our configuration file, I encourage you to visit the [Webpack documentation site](https://webpack.js.org/).

We need to configure Babel to do the transpilation. Open `.babelrc` and paste this:

```json
{
  "presets": ["es2015", "stage-1"],
  "plugins": [
    ["transform-react-jsx", {
      "pragma": "m"
    }]
  ]
}
```

> Defining ` "pragma": "m"` within the Babel `plugins` is critical to help Mithril work with JSX. As described in the [Babel documentation for `pragma`](https://babeljs.io/docs/plugins/transform-react-jsx/#pragma), `pragma` is a `string` that defaults to `React.createElement`; therefore, we need to replace it with our `m` function to compile JSX expressions.

Next in the agenda, we are going to scaffold the `index.html`. Open it up and paste the following:

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <script defer src="https://use.fontawesome.com/releases/v5.0.8/js/all.js"></script>
    <title>Conference Tracker</title>
</head>

<body>
    <div id="app"></div>
    <script src="/bundle.js"></script>
</body>

</html>
```

A few things to note in here:

* `bundle.js` will be created by Webpack after it processes all of our JSX and JS files.
* We are bringing FontAwesome in through a CDN call. FontAwesome will provide us with well-designed icons to enhance our interface.

The last item to scaffold is `index.jsx`. It's very important that the extension is `.jsx` and not `.js` so that our IDE, editor and any tooling can treat it as a JSX file. Paste the following in the file:

```jsx
const m = require("mithril");
const root = document.getElementById("app");

m.render(root, "So it begins!");
```

We are not doing a lot yet. We are just testing that Mithril works by rendering a greeting in the browser. It's time to test this! Are you ready? Run the following command in your terminal:

yarn:
```bash
yarn start
```

npm:
```bash
npm start
```

If you are seeing `So it begins!` in the screen, congratulations! You've gotten Mithril, JSX, and Webpack up and running!

The moment that you were probably very much waiting for is finally here! It's time to build the interface! It's time to code!

## Creating the Mock Data

It's always much easier to build an interface when there's real data to model and present in the screen instead of using random mythical strings or whatever names come to mind.

Go to the `store` folder, create a file named `data.js`, and open it.

In this file, we are going to create a mock array of conference objects and export a function that would let anything on the application request that mock data:

```js
// src/store/data.js

const CONFERENCES = [{
    name: "auth0 conf",
    location: "Orlando, FL",
    date: "06/30/2018",
    favorite: true,
    CFP: true,
    CFPDate: "04/20/2018",
    CFPCompleted: false
  },
  {
    name: "Mithril conf",
    location: "Boston, MA",
    date: "05/10/2018",
    favorite: true,
    CFP: false,
    CFPDate: "",
    CFPCompleted: false
  },
  {
    name: "ngSurf",
    location: "San Diego, CA",
    date: "04/26/2018",
    favorite: true,
    CFP: true,
    CFPDate: "03/15/2018",
    CFPCompleted: true
  },
  {
    name: "MySQL Conf",
    location: "Miami, FL",
    date: "03/17/2018",
    favorite: false,
    CFP: false,
    CFPDate: "",
    CFPCompleted: false
  }
];

const getMockData = () => CONFERENCES;

export default getMockData;
```

Sweet! We have a central point that can hydrate our interface with data when needed. Up next, let's start organizing components.

## Organizing the Components

Let's revise our component tree:

```bash
   |-- App
   |   |-- MainStage
   |   |   |-- StageBanner
   |   |   |   |-- StageTitle
   |   |   |   |-- LogoutButton
   |   |   |-- CardContainer
   |   |   |   |-- ConferenceCard
   |   |   |   |   |-- ConferenceField
   |   |   |   |   |-- ConferenceField
   |   |   |   |   |-- ConferenceField
   |   |   |   |   |-- ConferenceField
   |   |   |   |-- ...
   |   |-- NavBar
   |   |   |-- NavButton
   |   |   |-- NavButton
   |   |   |-- NavButton
```

It looks like the first component that we should build is `App`. But before we do that, let's agree that we are not going to just dump components into the `components` folder. Let's create  categories to hold our components. Looking at the component tree and the designs, we have two core types of components:

* `ui`: These are components that either visually present the interface or the user interacts with.

* `layout`: These are components that help organize how `ui` components are positioned or configured within a view.

Let's also agree to have a third category for `cards` which are very specialized components that hold conference data. These are components that will be hydrated with mock data; therefore, they may be a bit more complex to build.

Go ahead and create a folder for each category under the `components` folder.

The file structure may look like this now:

```bash
   |-- .babelrc
   |-- index.html
   |-- package.json
   |-- src
   |   |-- components
   |   |   |-- cards
   |   |   |-- layout
   |   |   |-- ui
   |   |-- index.css
   |   |-- index.jsx
   |   |-- services
   |   |-- store
   |   |   |-- data.js
   |-- webpack.config.js
   |-- yarn.lock
```

> `yarn.lock` is created by yarn to lock your dependencies.

With this mental plan on how we are going to organize and store components, let's go ahead and create `App`!

## Creating an App Component with Mithril and JSX

`App` is a `layout` component; therefore, create `App.jsx` under the `components/layout`.

The first step that we need to take on every component file is to bring Mithril into its module context. We do that by starting every file with the following line:

```js
const m = require('mithril');
```

If this line is absent from any component file, the build process will break and all the Mithril custom logic will be missing.

Open `App.jsx` and bring Mithril in. Once that's done, let's create the skeleton of the `App` component:

```jsx
// src/components/layout/App.jsx

const m = require('mithril');

const App = {
  view: ({ children }) =>
    <div class="App">
      {children}
    </div>
};

export default App;
```

Look at the arguments of `view` and note something peculiar: `{ children }`. Recall that every component `view` function gets `vnode` as its argument. `vnode` has two properties of interest: `attrs` for the component attributes and `children` for its content.

Since `App` is a layout component, we only care about the generic content it needs to render, the `children` property of `vnode`. Thus, to save us time and typing, we use JavaScript destructuring to extract the `children` property right from the function argument. It's quite a nice JavaScript feature!

Using JSX, we are able to run JavaScript simple expressions within JSX tags by wrapping them in curly braces. Let's test that `App` is in fact rendering its content.

Let's go to `index.jsx`, import `App`, and let's render a string within it:

```jsx
// src/index.jsx

const m = require("mithril");
const root = document.getElementById("app");

import App from './components/layout/App.jsx';

m.render(root, <App>Hello from within App!</App>);
```

The browser should now display the string!

Looking at our component tree:

```bash
   |-- App
   |   |-- MainStage
   |   |   |-- StageBanner
   |   |   |   |-- StageTitle
   |   |   |   |-- LogoutButton
   |   |   |-- CardContainer
   |   |   |   |-- ConferenceCard
   |   |   |   |   |-- ConferenceField
   |   |   |   |   |-- ConferenceField
   |   |   |   |   |-- ConferenceField
   |   |   |   |   |-- ConferenceField
   |   |   |   |-- ...
   |   |-- NavBar
   |   |   |-- NavButton
   |   |   |-- NavButton
   |   |   |-- NavButton
```

We need to build `MainStage` and `NavBar` next as they are part of the core interface template that will be present in all views. Let's do that next!

## Creating the Core Interface Template

Since we are using Webpack as our build tool and bundler, we need to make Webpack aware that `index.css` exists. We do so by importing it into `index.jsx`, which is Webpack's entry point.

```js
// src/index.jsx

const m = require("mithril");
const root = document.getElementById("app");

// Styles
import "./index.css";

import App from './components/layout/App.jsx';

m.render(root, <App>Hello from within App!</App>);
```

From now on, our components will have access to all the styling that was copied and pasted [from the final version of this sample application](https://github.com/getDanArias/Mithril-Sample-App/blob/master/src/index.css) into our local `index.css`.


Let's now create `NavBar`.

Under `components/layout`, create `NavBar.jsx` with the following code:

```jsx
// src/components/layout/NavBar.jsx

const m = require("mithril");


const NavBar = {
  view: () =>
    <div class="nav-bar">
    </div>
};

export default NavBar;
```

Now, in that same folder, create `MainStage.jsx` with this code:

```jsx
// src/components/layout/MainStage.jsx

const m = require("mithril");

const MainStage = {
  view: (vnode) =>
    <div class="main-stage">
      {vnode.children}
    </div>
};

export default MainStage;
```

With both `MainStage` and `NavBar` created, let's import and add them to our `App` component:

```jsx
// src/components/layout/App.jsx

const m = require('mithril');

import MainStage from './MainStage.jsx';
import NavBar from './NavBar.jsx';

const App = {
  view: ({ children }) =>
    <div class="App">
      <MainStage>
        {children}
      </MainStage>
      <NavBar />
    </div>
};

export default App;
```

> When importing components with `.jsx` file extensions, it's critical that we always include that extension in the import. Leaving the extension out will make the build tools or IDE look for a `.js` file instead.


Congratulations! We've build the core interface template. Wasn't it easy? We owe this fast success to the intense planning that we did and to the power of CSS Flexbox as defined in our CSS classes!

Next, let's complete the construction of `NavBar`.

## Building a Navigation Bar with Mithril

The core container of the navigation bar is there but it's missing what makes it interactive, the `NavButton` components. Let's go ahead and build that component now.

Under `components/ui` create `NavButton.jsx` and add the following code:

```jsx
// src/components/ui/NavButton.jsx

const m = require("mithril");

const NavButton = {
  view: ({ attrs }) =>
    <a class="nav-button" href={`#!/${attrs.path}`}>
      {attrs.icon}
    </a>
};

export default NavButton;
```

Using JavaScript destructuring again, we get `attrs` from the passed `vnode` object. `NavButton` is nothing more than a simple `<a>` element. `NavButton` depends on two external properties that are passed to it through attributes: `path` and `icon`. These attributes must be defined when the component is used within the template of another component.

Making `path` and `icon` external data allows us to make `NavButton` a resilient and reusable component. We configure it by passing whatever path we want it to take us to when clicked and we pass it an icon to be used as link label.

Back in `NavBar.jsx`, let's import and integrate `NavButton` into it:

```jsx
// src/components/layout/NavBar.jsx

const m = require("mithril");

import NavButton from '../ui/NavButton.jsx';

const NavBar = {
  view: () =>
    <div class="nav-bar">
      <NavButton path={`cfp`} icon={<i class="fas fa-microphone"/>} />
      <NavButton path={`conferences`} icon={<i class="fas fa-users"/>} />
      <NavButton path={`entry`} icon={<i class="fas fa-edit"/>} />
    </div>
};

export default NavBar;
```

We are nesting three `NavButton` components within the `NavBar` container. We pass them the desired route paths that are going to be eventually configured to navigate between views. We also pass each component a FontAwesome icon for a polished modern interface look.

Guess what? We are done with the creation of the navigation bar. For the rest of the project, we are not going to have to come back and open any `NavBar` or `NavButton`. Component architecture is truly amazing!

Let's take a peek again at the component tree to figure out what we need to build next:

```bash
   |-- App
   |   |-- MainStage
   |   |   |-- StageBanner
   |   |   |   |-- StageTitle
   |   |   |   |-- LogoutButton
   |   |   |-- CardContainer
   |   |   |   |-- ConferenceCard
   |   |   |   |   |-- ConferenceField
   |   |   |   |   |-- ConferenceField
   |   |   |   |   |-- ConferenceField
   |   |   |   |   |-- ConferenceField
   |   |   |   |-- ...
   |   |-- NavBar
   |   |   |-- NavButton
   |   |   |-- NavButton
   |   |   |-- NavButton
```

We should focus next on building `StageBanner` and `CardContainer` to be used within `MainStage`.

## Creating a Nested View Container

Under `components/ui` create `StageBanner.jsx` and jumpstart it with the following code:

```jsx
// src/components/ui/StageBanner.jsx

const m = require('mithril');

const StageBanner = {
  view: ({ attrs }) =>
    <div class="stage-banner">
    </div>
};

export default StageBanner;
```

`StageBanner` hosts `StageTitle` and `LogoutButton`. Instead of leaving the creation of these two components for later, let's go ahead and create them now so that there's something that we can see within `StageBanner`.

Let's create `StageTitle` first. Under `component/ui`, create `StageTitle.jsx` and start it with this:

```jsx
// src/components/ui/StageTitle.jsx

const m = require("mithril");

const StageTitle = {
  view: ({ attrs }) =>
    <div class="stage-title">{attrs.title}</div>
};

export default StageTitle;
```

Next, let's create `LogoutButton.jsx` under the same folder:

```jsx
// src/components/ui/LogoutButton.jsx

const m = require("mithril");

const LogoutButton = {
  view: ({ attrs }) =>
    <div onclick={attrs.action}>
      <i class="fas fa-sign-out-alt"/>
    </div>
};

export default LogoutButton;
```

Notice that up till now we haven't done anything with Mithril directly other than including its import within each JSX Component file. The framework has been running under the hood through JSX and staying out of our way to rapid development.

Within `LogoutButton`, we are doing something rather interesting: we are adding an event listener to its container element. The callback function to handle the `onclick` event comes from an external source. This is brilliant. It makes the button reusable not just within this application but within any other applications we could make. `LogoutButton` is a great candidate for a component library!

In our case, `onclick` within `LogoutButton` will receive a function from the Auth0 API that will trigger Auth0's logout function. We will learn more about [Auth0 authentication](https://auth0.com/docs/api/authentication) later.

With `StageTitle` and `LogoutButton` now defined, let's go ahead and add them to `StageBanner`:

```jsx
// src/components/ui/StageBanner.jsx

const m = require('mithril');

import StageTitle from './StageTitle.jsx';
import LogoutButton from './LogoutButton.jsx';

const StageBanner = {
  view: ({ attrs }) =>
    <div class="stage-banner">
      <StageTitle title={attrs.title} />
      <LogoutButton action={attrs.action} />
    </div>
};

export default StageBanner;
```

If you look at the browser, you'll see that we still have that message "Hello from within App!" that we used earlier for testing. We need to wrap `StageBanner` within `App` instead, making `StageBanner` the direct child of `MainStage` as defined within the `App` component.

Back into `index.jsx` make the following update that imports `StageBanner` and integrates it within a view wrapped by `App` that is being distributed through the function `ConferenceView`:

```jsx
// src/index.jsx

const m = require("mithril");
const root = document.getElementById("app");

// Components
import StageBanner from './components/ui/StageBanner.jsx';

// Styles
import "./index.css";

import App from './components/layout/App.jsx';

const ConferenceView = () =>
  <App>
    <StageBanner action={() => console.log(`Logging out!`)} title="Conferences" />,
  </App>;

m.render(root, ConferenceView());
```

Having a view component bundle returned by a function will make our code very readable, clean, and easy to maintain. Instead of embedding all that JSX code as a second argument to `m.render()`, we simply call a function that returns the bundle. It also allows us to easily reference the `ConferenceView` from anywhere within the `index.jsx` file.

Since Auth0 still has not been integrated with the application, we are passing a dummy function now as `action` to `StageBanner` who in turn will pass this `action` to `LogoutButton` that is part of its view definition.

> If you have worked with React before, this is the same process as passing down props to hydrate component tree nodes with data.

Our interface is looking more complete. Notice how fast we have been developing without having to go too much in depth on what is happening in the code. Again, that's possible thanks to the pragmatic architecture of Mithril and its full integration with JSX. So far, it feels more like we are writing HTML than JavaScript. Easy!

Now, let's create `CardContainer.jsx` under `components/layout`:

```jsx
// src/components/layout/CardContainer.jsx

const m = require("mithril");

const CardContainer = {
  view: ({ children }) => {
    return (
      <div class="card-container">
        {children}
      </div>
    )
  }
};

export default CardContainer;
```


This is a simple layout component that we are going to use to wrap the cards in a `flex` box and control their overflow through vertical scrolling.

Let's revisit `index.jsx` and add `CardContainer` to `ConferenceView`:

```jsx
// src/index.jsx

const m = require("mithril");
const root = document.getElementById("app");

// Components
import StageBanner from './components/ui/StageBanner.jsx';
import CardContainer from './components/layout/CardContainer.jsx';

// Styles
import "./index.css";

import App from './components/layout/App.jsx';

const ConferenceView = () =>
  <App>
    <StageBanner action={() => console.log(`Logging out!`)} title="Conferences" />
    <CardContainer>
    </CardContainer>
  </App>;

m.render(root, ConferenceView());
```

There is no visible change in the browser right now because `CardContainer` is empty. Our next step is to create the `ConferenceCard` component, import mock data into `index.jsx`, and map the conference objects array into `ConferenceCard`'s within `CardContainer`.

## Repeating Component Templates in Mithril

To start, let's create `ConferenceCard.jsx` under `components/cards`:

```jsx
// src/components/cards/ConferenceCard.jsx

const m = require("mithril");

const ConferenceCard = {
  view: ({ attrs }) =>
    <div class="conference-card">
    </div>
};

export default ConferenceCard;
```

To further flesh out the template of `ConferenceCard`, let's look at what a conference data object looks like to understand what attributes we need to set on `ConferenceCard`:

```js
{
  name: "Auth0 conf",
  location: "Orlando, FL",
  date: "06/30/2018",
  favorite: true,
  CFP: true,
  CFPDate: "04/20/2018",
  CFPCompleted: false
}
```

It looks like we would need to have our JSX component accept attributes such as `name`, `location`, `date`, `favorite`... pretty much every property! Instead of polluting the JSX object with a bunch of attributes, let's have it accept a single `conference` attribute. Then, we'll have logic within `ConferenceCard` handle the extraction and proper presentation of the conference data.

For now, let's just display the `name`, `location`, and `date`:

```jsx
// src/components/cards/ConferenceCard.jsx

const m = require("mithril");

const ConferenceCard = {
  view: ({ attrs }) =>
    <div class="conference-card">
      <span>{attrs.conference.name}</span>
      <span>{attrs.conference.location}</span>
      <span>{attrs.conference.date}</span>
    </div>
};

export default ConferenceCard;
```

We cannot display the whole object as `{attrs.conference}` since we cannot display the object in that form in the DOM. If we were to do that, we'd get an error in the console saying that the component is `undefined`:

```bash
Uncaught TypeError: Cannot read property 'view' of undefined
```

Whenever you see that error in the console, it means that something is wrong or broken inside a component's `view` function. It doesn't give much detail though, so we'd have to trace the stack, use breakpoints or offer an educated guess as to what component may be throwing the error.

Let's head back to `index.jsx` where we are going to import and instantiate the mock data:

```jsx
// src/index.jsx

const m = require("mithril");
const root = document.getElementById("app");

// Components
import StageBanner from './components/ui/StageBanner.jsx';
import CardContainer from './components/layout/CardContainer.jsx';

// Styles
import "./index.css";

// Mock data
import getMockData from './store/data';
const CONFERENCES = getMockData();

import App from './components/layout/App.jsx';

const ConferenceView = () =>
  <App>
    <StageBanner action={() => console.log(`Logging out!`)} title="Conferences" />
    <CardContainer>
    </CardContainer>
  </App>;

m.render(root, ConferenceView());
```

Now that we have data live in `CONFERENCES`, let's import `ConferenceCard` and map `CONFERENCES` into instances of it from within `CardContainer`:


```jsx
// src/index.jsx

// ...

// Components
// ...
import ConferenceCard from './components/cards/ConferenceCard.jsx';

// ...

const ConferenceView = (conferences) =>
  <App>
    <StageBanner action={() => console.log(`Logging out!`)} title="Conferences" />
    <CardContainer>
      {
        conferences
          .map((conference) => <ConferenceCard conference={conference}/>)
      }
    </CardContainer>
  </App>;

m.render(root, ConferenceView(CONFERENCES));
```

We don't want to use `CONFERENCES` directly inside the view template; thus, we pass it as argument to `ConferenceView`. This would allow us to change the mock data at any time without any problem, which in turn makes testing much easier as well!

 We now have a nice set of cards stacked up in the browser. Great job! Next, let's organize the data within the `ConferenceCard` template.

 The final structure of the `ConferenceCard` must look like this:

 <p style="text-align: center;">
  <img src="https://raw.githubusercontent.com/getDanArias/conference-tracker-assets/master/card1.png" alt="A card holding conference sample data">
</p>

 We spoke earlier about dividing the card into four sections and using each section to show a piece of information.

 We foresee that `name` and `location` will take the most space; hence, combining `name` and `location` as a string, and placing that string within a flexible row next to the star icon, will work well. From all pieces of information, the star icon is the one that occupies the least amount of space and has a constant width.

 The conference data and the countdown timer would also have a fairly consistent width and they will live in harmony on a flexible row just below name/location and star.

 Let's organize our data as such using two containers:

 ```jsx
 // src/components/cards/ConferenceCard.jsx

const m = require("mithril");

const ConferenceCard = {
  view: ({ attrs }) =>
    <div class="conference-card">
      <div class="conference-fields">
        <span>{attrs.conference.name} @ {attrs.conference.location}</span>
        <i class="fas fa-star" />
      </div>
      <div class="conference-fields">
        <span>{attrs.conference.date}</span>
        <span>{`19 d 20 hr 45 m`}</span>
      </div>
    </div>
};

export default ConferenceCard;
 ```

 We are using `<div>` with attribute class `conference-fields` to wrap our data elements. The containers behave as rows since the parent container is a `flex` box with `flex-direction` set to `column`.

Notice that we are sort of repeating ourselves a lot when creating the `<span>` string containers. To solve that, let's create a `ConferenceField` reusable component that is responsible for presenting conference data properties.

 Under `components/cards` create `ConferenceField.jsx`:

 ```jsx
// src/components/cards/ConferenceField.jsx

const m = require("mithril");

const ConferenceField = {
  view: ({ attrs }) =>
    <div class="conference-field">
      {attrs.fieldValue}
    </div >
};

export default ConferenceField;
 ```

 Let's integrate `ConferenceField` with `ConferenceCard`:

 ```jsx
// src/components/cards/ConferenceCard.jsx

const m = require("mithril");

import ConferenceField from './ConferenceField.jsx';

const ConferenceCard = {
  view: ({ attrs }) =>
    <div class="conference-card">
      <div class="conference-fields">
        <ConferenceField fieldValue={`${attrs.conference.name} @ ${attrs.conference.location}`} />
        <ConferenceField fieldValue={
          <i class="fas fa-star" />
        } />
      </div>
      <div class="conference-fields">
        <ConferenceField fieldValue={attrs.conference.date} />
        <ConferenceField fieldValue={`19 d 20 hr 45 m`} />
      </div>
    </div>
};

export default ConferenceCard;
 ```

 `ConferenceView` is looking pretty close to the final look it needs to have. We are ready to create the other two additional views our application needs, but in order to display them, we'll need to use the Mithril router.

 ## Using the Mithril Router

 Up to this point, we have only worked with one view. To make a Single Page Application, we need to include routing so that we can go from view to view at will.

 Open `NavButton.jsx` and take a look at the structure of the `href` attribute in the `<a>` tag. The link, or hypertext reference, always starts with a _hashbang_, which is a common convention used in Single Page Applications to tell the server that the path after the _hashbang_ is a route path.

 The Mithril router can be configured to use a different convention for routing, but for simplicity, we are going to stick to the _hashbang_ convention.

 Now that we are planning to have more than a single screen in our application, we need to use something different to render and auto-redraw the application. We are going to use `m.route()`.

 `m.route()` is similar to `m.mount()` except that it also has URL awareness that lets Mithril know what to do if there is a URL change accompanied by a `#!`.

 Let's set up the router and create a route for `ConferenceView`:

 ```jsx
 m.route(root, "/conferences", {
  "/conferences": {
    view: () => ConferenceView(CONFERENCES)
  }
});
 ```

 Let's dissect what `m.route()` is doing.

 The signature of `m.route()` is as follows:

 ```js
 m.route(root, defaultRoute, routes)
 ```

`root` is a DOM element that will be the parent node to the subtree. It will host the views interchangeably.

`defaultRoute` is a string that indicates what route should the router redirect to if the current URL doesn't match any defined routes.

`routes` is an object whose keys are string that represent a route path and its values are either components or something called a [RouteResolver](https://mithril.js.org/route.html#routeresolver). For this application, we are going to use anonymous components to render the routes.

Our first defined route has `"/conferences"` as key and takes a component that has no name definition (hence the name _anonymous_ component) to render our view. Recall that in Mithril a component is simply an object that has a `view` property with a function as its value.

Let's replace `m.render()` with this router configuration in `index.jsx`:

```jsx
// src/index.jsx

// ...

m.route(root, "/conferences", {
  "/conferences": {
    view: () => ConferenceView(CONFERENCES)
  }
});
```

Nothing else in `index.jsx` changes. The application is rendering as before in the browser. However, we now have the power to add more views.

> As a fun experiment, click on the navigation buttons and notice that the application doesn't break! All undefined routes are redirected to `#!/conferences`.

Let's now add a `CFPView` to our application to host a template for the Call for Papers conference data. Add the following view function in `index.jsx`:

```jsx
// src/index.jsx

// ...

const CFPView = (conferences) =>
  <App>
    <StageBanner action={() => console.log(`Logging out!`)} title="Call for Papers" />
    <CardContainer>
    </CardContainer>
  </App>;

m.route(root, "/conferences", {
  "/conferences": {
    view: () => ConferenceView(CONFERENCES)
  }
});
```

And now, let's create a route that takes us to that view and carefully select the path defined for that view in `NavBar`:

```jsx
// src/index.jsx

// ...

const CFPView = (conferences) =>
  <App>
    <StageBanner action={() => console.log(`Logging out!`)} title="Call for Papers" />
    <CardContainer>
    </CardContainer>
  </App>;

m.route(root, "/conferences", {
  "/conferences": {
    view: () => ConferenceView(CONFERENCES)
  },
  "/cfp": {
    view: () => CFPView(CONFERENCES)
  }
});
```

Click on the leftmost navigation button (the one with the microphone icon) and you will be taken to our `CFPView`! Congratulations! We've enable routing in our Single Page Application.

For now, let's leave the `CardContainer` in `CFPView` empty. Let's create a view and route for the entry form next:

```jsx
// src/index.jsx

// ...

const CFPView = (conferences) =>
  <App>
    <StageBanner action={() => console.log(`Logging out!`)} title="Call for Papers" />
    <CardContainer>
    </CardContainer>
  </App>;

const FormView = () =>
  <App>
    <StageBanner action={() => console.log(`Logging out!`)} title="Add Conference" />
    <CardContainer>
    </CardContainer>
  </App>;

m.route(root, "/conferences", {
  "/conferences": {
    view: () => ConferenceView(CONFERENCES)
  },
  "/cfp": {
    view: () => CFPView(CONFERENCES)
  },
  "/entry": {
    view: () => FormView()
  }
});
```

Well done! We now have all three views working! Before we move on to fleshing out our new views with content, we should improve our code by making the core interface only render once. What does this mean?

Looking at our views, we see the same code being repeated. We also have different instances of the `App` component and we are mounting each one independently. That's not necessary. The only part of the core interface template that changes is the content of the `MainStage` component within the `App`. So, here's a better layout plan!

* We are going to render `App` once.
* Once `App` is rendered and its template is available in the DOM, we are going to extract the DOM element that represents `MainStage` (that's the `<div>` with the class `main-stage`) and use it as the `root` for `m.route()`.
* Then, we are going to use the same strategy that we used before: using anonymous components to render our components upon each route match.

What are the benefits of this refactoring?

* We increase performance by only redrawing the parts that have changed.
* If we need to change the core interface template, we can do so without having to open and update each view. It increases the maintainability of our code.

Let's approach this refactoring step by step.

First, let's go back to `index.jsx` and replace `m.route()` with an `m.render()`:


```jsx
// src/index.jsx

// ...

m.render(root, <App />);
```

We are just rendering `App` and nothing else. Right now, our views are gone and navigation is missing.

All this action is now going to take place within the `App` component by using one of its lifecycle methods.

## Mithril Lifecycle Methods

By scanning the [Mithril docs](https://mithril.js.org/lifecycle-methods.html), we can learn that components and virtual nodes can have lifecycle methods that are called at various points during the lifetime of a DOM element.

All lifecycle methods get _vnode_ as their first argument and they are only called as a side effect of `m.render()`.

```jsx
m.render(root, <App />);
```

The above code triggers the lifecycle methods of `App`. The one _hook_ (another name for lifecycle methods) that we need for our use case of getting the `MainStage` template from within `App` is `oncreate()`. Why's that?

We should not grab a DOM element before it is rendered, in doing so we would get an `undefined` result. We need to wait until the `App` template is rendered in the DOM and available to be queried.

`oncreate()` is activated after a DOM element is created and attached to the document. It is guaranteed to run at the end of the render cycle which makes it a safe spot to get layout values or elements.

Lifecycle methods are properties of the component definition object. They are at the same level of the `view` property. Let's open `App.jsx` and add the `oncreate` hook:

```jsx
// src/components/layout/App.jsx

const m = require('mithril');

import MainStage from './MainStage.jsx';
import NavBar from './NavBar.jsx';

const App = {
  oncreate: (vnode) => {

  },
  view: ({ children }) =>
    <div class="App">
      <MainStage>
        {children}
      </MainStage>
      <NavBar />
    </div>
};

export default App;
```

Now, let's grab the DOM element that represent the `MainStage` component template:

```jsx
// src/components/layout/App.jsx

// ...

const App = {
  oncreate: (vnode) => {
    const mainStage = vnode.dom.querySelector(".main-stage");

  },
  view: ({ children }) =>
    <div class="App">
      <MainStage>
        {children}
      </MainStage>
      <NavBar />
    </div>
};

export default App;
```

Getting _vnode_ as an argument is super handy because we can just query the `App` component template to get an element within it instead of having to query the global `document` object.

Next, we are going to use `mainStage` as the element where we will attach our route subtrees:

```jsx
// src/components/layout/App.jsx

// ...

const App = {
  oncreate: (vnode) => {
    const mainStage = vnode.dom.querySelector(".main-stage");

    m.route(mainStage, "/conferences", {
      "/conferences": {
        view: () => ConferenceView(CONFERENCES)
      },
      "/cfp": {
        view: () => CFPView(CONFERENCES)
      },
      "/entry": {
        view: () => FormView()
      }
    });
  },
  view: ({ children }) =>
    <div class="App">
      <MainStage>
        {children}
      </MainStage>
      <NavBar />
    </div>
};

export default App;
```

Looking at the browser, nothing has changed, but opening up the developer's console will show some errors, including:

```bash
Uncaught ReferenceError: CFPView is not defined
```

That is because our views were defined in `index.jsx`. To solve this problem, we have to bring that code into `App.jsx`. Cut the function definitions for `ConferenceView`, `CFPView`, and `FormView` from `index.jsx`, and paste them in `App.jsx`:

```jsx
// src/components/layout/App.jsx

// ...

const ConferenceView = (conferences) =>
  <App>
    <StageBanner action={() => console.log(`Logging out!`)} title="Conferences" />
    <CardContainer>
      {
        conferences
          .map((conference) => <ConferenceCard conference={conference}/>)
      }
    </CardContainer>
  </App>;

const CFPView = (conferences) =>
  <App>
    <StageBanner action={() => console.log(`Logging out!`)} title="Call for Papers" />
    <CardContainer>
    </CardContainer>
  </App>;

const FormView = () =>
  <App>
    <StageBanner action={() => console.log(`Logging out!`)} title="Add Conference" />
    <CardContainer>
    </CardContainer>
  </App>;

const App = {
  oncreate: (vnode) => {
    const mainStage = vnode.dom.querySelector(".main-stage");

    m.route(mainStage, "/conferences", {
      "/conferences": {
        view: () => ConferenceView(CONFERENCES)
      },
      "/cfp": {
        view: () => CFPView(CONFERENCES)
      },
      "/entry": {
        view: () => FormView()
      }
    });
  },
  view: ({ children }) =>
    <div class="App">
      <MainStage>
        {children}
      </MainStage>
      <NavBar />
    </div>
};

export default App;
```

However, we still have undefined values. We need to migrate everything missing from `index.jsx` into `App.jsx` and adjust their import paths.

Super important! Before we do this, we need to comment out the `m.render()` in `index.jsx` to prevent an infinite condition from being triggered. I'll explain why this would happen in a moment.

This is the complete `App.jsx` file so far:

```jsx
// src/components/layout/App.jsx

const m = require('mithril');

import MainStage from './MainStage.jsx';
import NavBar from './NavBar.jsx';

// Components
import StageBanner from '../../components/ui/StageBanner.jsx';
import CardContainer from '../../components/layout/CardContainer.jsx';
import ConferenceCard from '../../components/cards/ConferenceCard.jsx';

// Mock data
import getMockData from '../../store/data';
const CONFERENCES = getMockData();

const ConferenceView = (conferences) =>
  <App>
    <StageBanner action={() => console.log(`Logging out!`)} title="Conferences" />
    <CardContainer>
      {
        conferences
          .map((conference) => <ConferenceCard conference={conference}/>)
      }
    </CardContainer>
  </App>;

const CFPView = (conferences) =>
  <App>
    <StageBanner action={() => console.log(`Logging out!`)} title="Call for Papers" />
    <CardContainer>
    </CardContainer>
  </App>;

const FormView = () =>
  <App>
    <StageBanner action={() => console.log(`Logging out!`)} title="Add Conference" />
    <CardContainer>
    </CardContainer>
  </App>;

const App = {
  oncreate: (vnode) => {
    const mainStage = vnode.dom.querySelector(".main-stage");

    m.route(mainStage, "/conferences", {
      "/conferences": {
        view: () => ConferenceView(CONFERENCES)
      },
      "/cfp": {
        view: () => CFPView(CONFERENCES)
      },
      "/entry": {
        view: () => FormView()
      }
    });
  },
  view: ({ children }) =>
    <div class="App">
      <MainStage>
        {children}
      </MainStage>
      <NavBar />
    </div>
};

export default App;
```

The problem that we have with this setup is that we still have `App` defined as part of our view templates. If we were to load the application as it is in the browser, our code would go into an infinite loop in which `App` keeps calling back to itself through the router. To prevent that and fulfill our goal of redrawing only components that change, we need to remove `App` from every view function.

We can only return one thing from a function. If we remove `App` from the views, how are we going to return the two components that were nested within it? We are going to return an array that contains those components!

Here's the updated code:

```jsx
// src/components/layout/App.jsx

const m = require('mithril');

import MainStage from './MainStage.jsx';
import NavBar from './NavBar.jsx';

// Components
import StageBanner from '../../components/ui/StageBanner.jsx';
import CardContainer from '../../components/layout/CardContainer.jsx';
import ConferenceCard from '../../components/cards/ConferenceCard.jsx';

// Mock data
import getMockData from '../../store/data';
const CONFERENCES = getMockData();

const ConferenceView = (conferences) => [
  <StageBanner action={() => console.log(`Logging out!`)} title="Conferences" />,
  <CardContainer>
    {
      conferences
        .map((conference) => <ConferenceCard conference={conference} />)
    }
  </CardContainer>
];

const CFPView = (conferences) => [
  <StageBanner action={() => console.log(`Logging out!`)} title="Call for Papers" />,
  <CardContainer>
  </CardContainer>
];

const FormView = () => [
  <StageBanner action={() => console.log(`Logging out!`)} title="Add Conference" />,
  <CardContainer>
  </CardContainer>
];

const App = {
  oncreate: (vnode) => {
    const mainStage = vnode.dom.querySelector(".main-stage");

    m.route(mainStage, "/conferences", {
      "/conferences": {
        view: () => ConferenceView(CONFERENCES)
      },
      "/cfp": {
        view: () => CFPView(CONFERENCES)
      },
      "/entry": {
        view: () => FormView()
      }
    });
  },
  view: ({ children }) =>
    <div class="App">
      <MainStage>
        {children}
      </MainStage>
      <NavBar />
    </div>
};

export default App;
```

The components would be rendered and attached to the DOM in the order in which they appear in the array. With this fix in place, it is now safe to uncomment `m.render()` in `index.jsx` and refresh your browser.

Our application is back! We've done a magnificent job at not just refactoring but at applying the principles and architecture of Mithril correctly.

Look how compact our `index.jsx` looks now:

```jsx
// src/index.jsx

const m = require("mithril");
const root = document.getElementById("app");

// Styles
import "./index.css";

import App from './components/layout/App.jsx';

m.render(root, <App />);

```

> The entry point to the application should be compact. It should only bootstrap the application and nothing else.

We should feel very proud of what we have accomplished here. We didn't just learn how to use the router but also how to embed a Mithril router at a specific DOM node, which can enable us to create nested routes in an application. We also learned how to provide a default layout to all the routes in an application. That's pretty nice!

Let's finish this up! We still have some work to do. We need to flesh out the `CFPView` and the `FormView`. That should not take too long, though!

## Adding Content to Existing Views

`CFPView` should only present conference objects that have the `CFP` property set to `true`. The presentational difference between a `ConferenceCard` and a `CFPCard` is minor: the star icon is a check mark icon in `CFPCard`. However, the logic wired into the component may different. To abide to the UNIX philosophy, let's create a `CFPCard` component.

Under `components/cards` create `CFPCard.jsx`:

```jsx
// src/components/cards/CFPCard.jsx

// src/components/cards/CFPCard.jsx

const m = require("mithril");
import ConferenceField from './ConferenceField.jsx';

const CFPCard = {
  view: ({ attrs }) =>
    <div class="conference-card">
      <div class="conference-fields">
        <ConferenceField fieldValue={`${attrs.conference.name} @ ${attrs.conference.location}`} />
        <ConferenceField fieldValue={
          <i class="fas fa-check-circle" />
        } />
      </div>
      <div class="conference-fields">
        <ConferenceField fieldValue={attrs.conference.CFPDate} />
        <ConferenceField fieldValue={`19 d 20 hr 45 m`} />
      </div>
    </div>
};

export default CFPCard;
```

Now, in `App.jsx`, let's add a function that first filters the conference by the `CFP` property and then maps the results into a `CFPCard`.

First, in the `// Components` section at the top of `App.jsx`, import `CFPCard`:

```jsx
// src/components/layout/App.jsx

// ...

// Components
import CFPCard from '../../components/cards/CFPCard.jsx';

// ...
```

Now let's add the desired logic:

```jsx
// src/components/layout/App.jsx

// ...

const CFPView = (conferences) => [
  <StageBanner action={() => console.log(`Logging out!`)} title="Call for Papers" />,
  <CardContainer>
    {
      conferences
        .filter(conference => conference.CFP)
        .map(conferenceWithCFP => <CFPCard cfp={true} conference={conferenceWithCFP} />)
    }
  </CardContainer>
];

// ...
```

In your browser, visit the CFP View and you'll only see two conferences being shown with the date of the CFP deadline and not the conference opening date.

Didn't I tell you this step was going to be quick? We are done with the `CFPView` at this time. Next, let's create the form!

## Creating Forms in Mithril

We need to create a component that provides a template to enter conference data and saves it into our mock data array.

The plan is simple. We are going to create an `EntryForm` component that will render the form and handle its submission.

First, we are going to create a reusable `UIButton` component to use as the form submission button. Later on, we are going to use `UIButton` again in our authentication view.

Under `components/ui` create `UIButton.jsx`:

```jsx
// src/components/ui/UIButton.jsx

const m = require("mithril");

const UIButton = {
  view: ({ attrs }) =>
    <div onclick={attrs.action} class="ui-button">
      <span>{attrs.buttonName}</span>
    </div>
};

export default UIButton;
```

`UIButton` follows a similar design pattern as `LogoutButton`.


Now, under `components` create `EntryForm.jsx`:

```jsx
// src/components/EntryForm.jsx

const m = require('mithril');
import UIButton from './ui/UIButton.jsx';

const EntryForm = {
  view: (vnode) =>
    <form name="entry-form" id="entry-form">
      <label for="conf-name">
        {`Conference Name`}
      </label>
      <input id="conf-name" type="text" name="name" />
      <label for="location">
        {`Location`}
      </label>
      <input id="location" type="text" name="location" />
      <label for="date">
        {`Date`}
      </label>
      <input id="date" type="text" name="date" />
      <label class="form-question">
        {`Submitting paper?`}
        <label for="yes-cfp">Yes</label>
        <input value={true} type="radio" id="yes-cfp" name="CFP" />
        <label for="no-cfp">No</label>
        <input value={false} type="radio" id="no-cfp" name="CFP" />
      </label>
      <label for="cfp">
        {`Call for Papers Deadline`}
      </label>,
      <input id="cfp" type="text" name="CFPDate" />
      <UIButton action={() => console.log(`Saving...`)} buttonName="SAVE" />
    </form>
};

export default EntryForm;
```

Next, let's include `EntryForm` into our `FormView` in `App.jsx`:

```jsx
// src/components/layout/App.jsx

// ...

import EntryForm from '../../components/EntryForm.jsx';

// ...

const FormView = () => [
  <StageBanner action={() => console.log(`Logging out!`)} title="Add Conference" />,
  <CardContainer>
    <EntryForm />
  </CardContainer>
];

// ...
```

Depending on your screen size or device, the form content may overflow but that is handled gracefully by `CardContainer`. Despite the form not being a stack of cards itself, it makes sense to use `CardContainer` here. Perhaps, we should rename `CardContainer` to something more generic in a future refactor. I'd leave that up to you!

Now, it would be ideal if we only saw the "Call for Papers Deadline" template when we've answered "Yes" to the "Submitting paper?" question. In order to achieve that, we'll use one of the best features that any framework can provide us: state management.

Let's learn how we can add that dynamic interaction to `EntryForm` through Mithril state management.

## Managing State with Mithril

What is state management? The answer to that question deserves a blog post of its own. In a nutshell, state is an object used to determine how a component should behave or render. State can hold data to present in the component template or variables that are evaluated to decide whether to render certain parts of the component template.

From the [Mithril docs](https://mithril.js.org/components.html#state), we learn that in Mithril, like all virtual DOM nodes, component _vnode_'s can have state. The state of a component can be accessed in three different ways:

* **At initialization**: When using POJO ([Plain Old JavaScript Object](https://en.wikipedia.org/wiki/Plain_old_Java_object)), the component object is the prototype for each component instance. Any property defined on the component object will be accessible as a property of `vnode.state`. This makes data initialization very simple!

* **Via `nvode.state`**: State may be accessed through the `vnode.state` property, which is available to all lifecycle methods as well as the `view` function of a component.

* **Via the `this` keyword**: State may be accessed via the [`this` keyword](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) that is available to all lifecycle methods as well as the `view` function.

Our plan is to track the state of the CFP question. We are going to create a state property that tracks if the CFP question has been answered. The initial value of this property would be `false`. We'll achieve this through a combination of setting up the state at initialization and through `vnode.state`.

Let create a property in the `EntryForm` component called `data` that will hold our desired state properties:

```jsx
// src/components/EntryForm.jsx

// ...

const EntryForm = {
  data: {
    CFP: false
  },
  // view: (vnode) => { ... }

};

// ...
```

In the code above, `data` is a property of the `EntryForm` component's state object.

Next, within our form, we are going to change that state property when a radio button is clicked:

```jsx
// src/components/EntryForm.jsx

// ...

const EntryForm = {
  data: {
    CFP: false
  },
  view: (vnode) =>
    <form name="entry-form" id="entry-form">
      {/* ... */}
      <label class="form-question">
        {`Submitting paper?`}
        <label for="yes-cfp">Yes</label>
         <input value={true} type="radio" id="yes-cfp" name="CFP"
          onclick={() => {
            vnode.state.CFP = true;
          }} />
        <label for="no-cfp">No</label>
         <input value={false} type="radio" id="no-cfp" name="CFP"
          onclick={() => {
            vnode.state.CFP = false;
          }} />
      </label>
      <label for="cfp">
        {`Call for Papers Deadline`}
      </label>
      <input id="cfp" type="text" name="CFPDate" />
      <UIButton action={() => console.log(`Saving...`)} buttonName="SAVE" />
    </form>
};

export default EntryForm;
```

What we've done is to create local UI state. Local UI state governs what a local template should look like based on certain events or actions triggered by the user. It doesn't modify or control application-wide state that is used across components. In our current application, the conference mock data is application state.

Now, we have to display the "Call for Papers Deadline" label and input conditionally depending on the local UI state. The state value of the `vnode.state.CFP` property will control this rendering task:

```jsx
// src/components/EntryForm.jsx

// ...

const EntryForm = {
  data: {
    CFP: false
  },
  view: (vnode) =>
    <form name="entry-form" id="entry-form">
      {/* ... */}
      <label class="form-question">
        {`Submitting paper?`}
        <label for="yes-cfp">Yes</label>
        <input value={true} type="radio" id="yes-cfp" name="CFP"
          onclick={() => {
            vnode.state.CFP = true;
          }} />
        <label for="no-cfp">No</label>
        <input value={false} type="radio" id="no-cfp" name="CFP"
          onclick={() => {
            vnode.state.CFP = false;
          }} />
      </label>
       {
        vnode.state.CFP ?
          [
            <label for="cfp">
              {`Call for Papers Deadline`}
            </label>,
            <input id="cfp" type="text" name="CFPDate" />
          ] :
          null
      }
      <UIButton action={() => console.log(`Saving...`)} buttonName="SAVE" />
    </form>
};

export default EntryForm;
```

In the browser, the "Call for Papers Deadline" label and input are now gone. Click "Yes" as an answer to "Submitting paper?" and they show up. Click "No" again and they are gone!

We've learned how to use state management to control the elements that are presented within our templates. There are many more uses to application state management such as storing data from XHR requests or holding form data; anything that answers the question "What should happen here?" can be part of state.

Alright, let's move on to entering new conference data through our form and updating our mock data object.

## Handling Forms in Mithril

Right now, pressing the "Save" button only prints "Saving..." to the console. What we really want to do here is this: when we click save, any data that we have entered in the form gets saved into our mock data conferences object. We are not going to add any form validators here; the subject is so complex that it could be a blog post of its own. We are going to assume, for now, that the data entered is always valid.

Let's visit `EntryForm.jsx` and add the following form handling function:

```jsx
// src/components/EntryForm.jsx

// ...

const entryFormHandler = (formDOM) => {

  const formData = new FormData(formDOM);
  const newEntry = {};

  entryForm.reset();
};

// ...
```

We start by assuming that we are going to get the DOM representation of the form. We'll get this through `vnode.dom` which would represent the complete template of `EntryForm`. Next, we create an instance of `FormData` to get easy access to all of the _named_ inputs of the form. Then, we start a blank `newEntry` object that we'll use to compose our mock data entry.

Let's now iterate through the entries of `formData` to populate properties of our `newEntry` object dynamically:


```jsx
// src/components/EntryForm.jsx

// ...

const entryFormHandler = (formDOM) => {

  const formData = new FormData(formDOM);
  const newEntry = {};

  Array.from(formData.entries()).map((entryValue) => {
    const key = entryValue[0];
    const value = entryValue[1];

    switch (value) {
      case "false":
        newEntry[key] = false;
        break;
      case "true":
        newEntry[key] = true;
        break;
      default:
        newEntry[key] = value;
        break;
    }

  });

  entryForm.reset();
};

// ...
```

If the value of one of the properties is the string "true" or "false", we'll convert that value into an actual `boolean`; otherwise, we'd always be storing a string that would appear as true during boolean evaluations.

Notice that some properties of the conference data object are not specified in the form as part of the input. Those properties are `favorite` and `CFPCompleted`. The user will specify those properties later by interacting with the conference object through a `ConferenceCard` or a `CFPCard`.

Let's provide `newEntry` with default values for those two properties:

```jsx
// src/components/EntryForm.jsx

// ...

const entryFormHandler = (formDOM) => {

  const formData = new FormData(formDOM);
  const newEntry = {};

  Array.from(formData.entries()).map((entryValue) => {
    const key = entryValue[0];
    const value = entryValue[1];

    switch (value) {
      case "false":
        newEntry[key] = false;
        break;
      case "true":
        newEntry[key] = true;
        break;
      default:
        newEntry[key] = value;
        break;
    }

  });

  newEntry["favorite"] = false;
  newEntry["CFPCompleted"] = newEntry.CFP ? false : "null";

  entryForm.reset();
};

// ...
```

We also have included all along, at the end of the function, a mechanism to reset the form.

Before we can test our form, we need to wire `entryFormHandler` with our form's `UIButton` as follows:

```jsx
<UIButton action={() => entryFormHandler(vnode.dom)} buttonName="SAVE" />
```

Alright, go ahead and test the form in the browser. If you want, add a `console.log(newEntry);` just above `entryForm.reset()` to log the data that has been entered before the form is cleared.

The last thing that we need to do in this section is to add `newEntry` to the mock data object!

We need to create a function to add elements to the `CONFERNECES` array guarded in `data.js`. Open that file, `data.js`, and update it as follows:

```js
// src/store/data.js

// ...

exports.getMockData = () => CONFERENCES;
exports.setMockData = (conference) => CONFERENCES.push(conference);
```

This change will break the `import` from `data.js` in `App.jsx`. Let's open `App.jsx` and update the `getMockData` import to this:

```jsx
// src/components/layout/App.jsx

// ...

import {getMockData} from '../../store/data';

// ...
```

Since there is no default export in `data.js` any longer, we need to specify exactly what is that we want to import out of that module.

Next, back in `EntryForm.jsx`, let's import the `setMockData` function from `data.js` and integrate it with the logic of our form handler:

```jsx
// src/components/EntryForm.jsx

// ...

import {setMockData} from "../store/data";

const entryFormHandler = (formDOM) => {

  const formData = new FormData(formDOM);
  const newEntry = {};

  Array.from(formData.entries()).map((entryValue) => {
    const key = entryValue[0];
    const value = entryValue[1];

  switch (value) {
      case "false":
        newEntry[key] = false;
        break;
      case "true":
        newEntry[key] = true;
        break;
      default:
        newEntry[key] = value;
        break;
    }

  });

  newEntry["favorite"] = false;
  newEntry["CFPCompleted"] = newEntry.CFP ? false : "null";

  // We'll push new conference data from here
  setMockData(newEntry);

  entryForm.reset();
};

// ...
```

The form is now ready to start adding cards to our conference views. Fill out the form, save it, and then head to the Conference View to see if it's there.

It sure is there! If you answered "Yes" to the CFP question, there will be a conference card added to the CFP View as well. If you answered "No", no card should have been added there...

## Creating a Countdown Component

As promised, we are going to give the user the ability to see the time until the conference opening date and CFP deadline.

We are going to create a `CountDownField` that extends `ConferenceField` through composition and not inheritance. The logic for the countdown implementation is borrowed from the article ["How To - JavaScript Countdown Timer"](https://www.w3schools.com/howto/howto_js_countdown.asp).

Under `components/cards` create `CountDownField.jsx`. This component is interesting because we are going to create it through an ES6 JavaScript class and not a JavaScript object. Using a `class` makes it much easier to handle and manage data encapsulation for each instance of the component.

Add this code to your `CountDownField.jsx` file:

```js
// src/components/cards/CountDownField.jsx

const m = require("mithril");

import ConferenceField from "./ConferenceField.jsx";

export default class CountDownField {
  constructor(vnode) {
    this.deadline = vnode.attrs.fieldValue;
    this.countDownDate = new Date(this.deadline).getTime();
    this.timeLeft = this.getTimeLeft();
    this.distance = this.countDownDate - new Date().getTime();
  }

  view() {
    return <ConferenceField fieldValue={this.timeLeft} />;
  }

  getTimeLeft() {
    const now = new Date().getTime();
    this.distance = this.countDownDate - now;

    const days = Math.floor(this.distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((this.distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((this.distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((this.distance % (1000 * 60)) / 1000);

    return days + "d " + hours + "h "
      + minutes + "m " + seconds + "s ";
  }

  countdown() {

    const countDownInterval = setInterval(() => {

      this.timeLeft = this.getTimeLeft();

      m.redraw();

      if (this.distance < 0) {
        clearInterval(countDownInterval);
        this.timeLeft = "EXPIRED";
      }
    }, 1000);
  }

  oninit(vnode) {
    this.countdown(vnode.attrs.fieldValue);

    if (this.distance < 0) {
      this.timeLeft = "EXPIRED";
    }
  }
}
```

A lot is going on in `CountDownField` but it isn't difficult to understand.

In the `constructor()`, we initialize all the instance variables. These variables are accessible to all the class methods through the life of the class. Each instance of `CountDownField` gets its unique set of class variables.

This time around, `view` is declared as a class method. Its role is the same as before: it returns the template to render in the DOM.

`getTimeLeft()` calculates the time that is left from right now to the deadline of the event.

`countdown()` uses `setInterval()` as the engine of the countdown timer. Remember that in Mithril, the auto-draw system is not triggered by `setInterval`. To update the view in the browser, we _must_ call `m.redraw()` manually at each iteration of `setInterval`.

Finally, `oninit`, a lifecycle method, is used to call `countdown()` and start the counter. It receives whatever value we specified as the value of the `fieldValue` attribute in the JSX instance of `CountDownField`.  If the deadline has already passed, we show an "EXPIRED" message.

Let's now integrate this field into `ConferenceCard` and `CFPCard`. We just have to import `CountDownField` in each file and replace the second `ConferenceField` in the bottom row with a `CountDownField` instance.

In `ConferenceCard.jsx`:

```jsx
// src/components/cards/ConferenceCard.jsx

// ...
import CountDownField from "./CountDownField.jsx";

const ConferenceCard = {
  view: ({ attrs }) =>
    <div class="conference-card">
      {/* ... */}
      <div class="conference-fields">
        <ConferenceField fieldValue={attrs.conference.date} />
        <CountDownField fieldValue={attrs.conference.date} />
      </div>
    </div>
};

export default ConferenceCard;
```

In `CFPCard.jsx`:

```jsx
// src/components/cards/CFPCard.jsx

// ...
import CountDownField from "./CountDownField.jsx";

const CFPCard = {
  view: ({ attrs }) =>
    <div class="conference-card">
       {/* ... */}
      <div class="conference-fields">
        <ConferenceField fieldValue={attrs.conference.CFPDate} />
        <CountDownField fieldValue={attrs.conference.CFPDate} />
      </div>
    </div>
};

export default CFPCard;
```

That's it! In the browser, you now can see time counters going down for each conference entry. It looks really cool.

## Mithril Challenge

As a challenge, I leave you with the task to toggle the `favorite` and `CFPCompleted` properties of `ConferenceCard` and `CFPCard` by tapping the star or check mark icons. We learned about Mithril state management while handling the presence of form fields. What we've learned from that should come in handy! The mock data storage would need to be updated with the new values for `favorite` and `CFPCompleted`.

The application can also be extended to communicate with an API to load and save data. That is also a fun exercise I leave to you! I recommend taking a look at [webtask.io](https://webtask.io/) to create serverless endpoints easily.

Functionality-wise, the application is complete at this point. What we can do optionally is to add Auth0 as our authentication layer. I recommend that you tag along to the next section as we are going to learn how to implement route guards with Mithril to prevent unauthorized access to the application. One last push! It's going to be fun!

## Authenticating Users with Auth0

The last feature we want to add to our Conference Tracker app is [Auth0 authentication](https://auth0.com). Integrating Auth0 authentication in our app is super easy thanks to Auth0's [Universal Login](https://auth0.com/docs/hosted-pages/login).

Auth0's universal login is the most secure way to easily authenticate users for your applications. We do not have to create any additional components or interface elements to create a login page. Auth0 provides you a login page whenever something (or someone) triggers an authentication request.

<p align=center">
  <img src="https://cdn2.auth0.com/blog/angular-aside/angular-aside-login.jpg" alt="Mithril app with Auth0 JWT authentication">
</p>


To get started, if you have not done so already, you need to [sign up for an Auth0 account](https://auth0.com/signup). Once signed up, you are going to create a tenant to host different clients.

To set up a client, follow these easy steps:

1. In the Auth0 Dashboard click on "New Client".

2. Give the client a name.

3. Choose "Single Page Web Applications" as the client type.

4. Choose "React" as the web app technology since it has a similar architecture to Mithril.

5. In the guide, scroll down to "Create an Authentication Service" and notice the configuration values within the `Auth` class.

6. Create a new file called `auth0-variables.js` under the `services` folder.

7. Within `auth0-variables.js` create and export an object with properties that map to the Auth0 web configuration data:

```javascript
// src/services/auth0-variables.js

const AUTH0 = {
  CLIENTID: '<your client id>',
  DOMAIN: '<your domain>',
  CALLBACKURL: '<your callback URL>',
  AUDIENCE: 'https://<your domain>/userinfo'
};

export default AUTH0;
```

> The audience is a parameter set during authorization, and it contains the unique identifier of the target API. This is how you tell Auth0 for which API to issue an Access Token, which is the intended audience of this token. If you do not want to access a custom API, then by setting the audience to `https://<your domain>/userinfo`, you can use the opaque Access Token to retrieve the user's profile.

8. As an important step, add `auth0-variables.js` to the `.gitignore` file so that it's never committed to source control.

9. Back in the Auth0 Dashboard, click on `Settings` under the client's name and scroll down till you find "Allowed Callback URLs".

10. Paste your desired callback URL here. That URL may be your localhost address where the project is being run locally. Make sure that you save the settings.

> Don't forget to add this same URL to the `CALLBACKURL` property of the Auth0 configuration object in step 7.


Next, we are going to create `auth.js` under `services` to host Auth0's authentication mechanisms:


```js
// auth.js

import auth0 from 'auth0-js';
import AUTH0_DATA from './auth0-variables';

export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: AUTH0_DATA.DOMAIN,
    clientID: AUTH0_DATA.CLIENTID,
    redirectUri: AUTH0_DATA.CALLBACKURL,
    audience: AUTH0_DATA.AUDIENCE,
    responseType: 'token id_token',
    scope: 'openid profile email'
  });

  login() {
    this.auth0.authorize();
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        m.route.set('/conferences');
      } else if (err) {
        m.route.set('/auth');
        console.log(err);
      }
    });
  }

  setSession(authResult) {
    // Set the time that the Access Token will expire at
    let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    // navigate to the home route
    m.route.set('/conferences');
  }

  logout() {
    // Clear Access Token and ID Token from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    // navigate to the default route
    m.route.set('/auth');
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // Access Token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }
}
```

Note how we are navigating to a route called `/auth` when logging out. That route doesn't exist yet in our application. We are going to create a `WelcomeView` function to match that route in `App.jsx` and create that route within `m.route()`.

First, let's create `WelcomeView`. This view relies on `UIButton`; therefore, we need to import that component as well:

```jsx
// src/components/layout/App.jsx

import UIButton from '../../components/ui/UIButton.jsx';

// ...

const WelcomeView = () => [
  <h1 class="app-title">Conference Tracker</h1>,
  <h2 class="app-greeting">Welcome</h2>,
  <span class="app-description">Track conferences and CFP dates.</span>,
  <div class="login-button">
    <UIButton action={() => console.log(`Logging in...`)} buttonName="LOGIN" />
  </div>
];


// ...
```

Let's create its route now:


```jsx
// src/components/layout/App.jsx

import UIButton from '../../components/ui/UIButton.jsx';

// ...

const WelcomeView = () => [
  <h1 class="app-title">Conference Tracker</h1>,
  <h2 class="app-greeting">Welcome</h2>,
  <span class="app-description">Track conferences and CFP dates.</span>,
  <div class="login-button">
    <UIButton action={() => console.log(`Logging in...`)} buttonName="LOGIN" />
  </div>
];

// ...

const App = {
  oncreate: (vnode) => {
    const mainStage = vnode.dom.querySelector(".main-stage");

    m.route(mainStage, "/conferences", {
      "/auth": {
        view: () => WelcomeView()
      },
      "/conferences": {
        view: () => ConferenceView(CONFERENCES)
      },
      "/cfp": {
        view: () => CFPView(CONFERENCES)
      },
      "/entry": {
        view: () => FormView()
      }
    });
  },
  // ...
};


// ...
```

The only way we can access `/auth` right now is by navigating directly to it by entering `http://localhost:8080/#!/auth` in the browser.

We'll need to wire Auth0's `login()` into the `UIButton` that represents the login button.

Let's import our `Auth` service class to `App.jsx`:

```jsx
// src/components/layout/App.jsx

// Services
import Auth from '../../services/auth.js';
const auth = new Auth();

// ...

const WelcomeView = () => [
  <h1 class="app-title">Conference Tracker</h1>,
  <h2 class="app-greeting">Welcome</h2>,
  <span class="app-description">Track conferences and CFP dates.</span>,
  <div class="login-button">
    <UIButton action={() => console.log(`Logging in...`)} buttonName="LOGIN" />
  </div>
];

// ...
```

And, let's update the `action` callback function attribute of `WelcomeView`'s `UIButton` to run `auth.login()` upon execution:

```jsx
// src/components/layout/App.jsx

// Services
import Auth from '../../services/auth.js';
const auth = new Auth();

// ...

const WelcomeView = () => [
  <h1 class="app-title">Conference Tracker</h1>,
  <h2 class="app-greeting">Welcome</h2>,
  <span class="app-description">Track conferences and CFP dates.</span>,
  <div class="login-button">
    <UIButton action={() => auth.login()} buttonName="LOGIN" />
  </div>
];

// ...
```

Before testing it, be sure that your `CALLBACKURL` in `auth0-variables.js` has been whitelisted in the Client Settings in the Auth0 dashboard and that it's set up to `http://localhost:8080/#!/conferences`. This callback URL is for development usage only. For production, you'd need to use something else, for example, your Firebase or GitHub pages base URL.

Let's click the "LOGIN" button. Auth0's Universal Login page should have come up! Enter your credentials or sign up if you have not yet created any user for your Auth0 client. Once that's done, Auth0 will redirect you to `http://localhost:8080/#!/conferences` effectively.


Next, let's wire Auth0's `logout()` function with our `LogoutButton`. To do so, we need to change the `StageBanner` `action` attribute of each view: `ConferenceView`, `CFPView`, and `FormView` from:

```js
action={() => console.log(`Logging out!`)}
```

to

```js
action={() => auth.logout()}
```

For example, the updated `FormView` looks like this:

```js
const FormView = () => [
  <StageBanner action={() => auth.logout()} title="Add Conference" />,
  <CardContainer>
    <EntryForm />
  </CardContainer>
];
```

Once every view has been updated, test the logout button for each. Every time you log out, you should be taken to `http://localhost:8080/#!/auth`. Now, notice that even after logging out, we can still access any part of the application. We are going to limit that next by creating route guards!

## Creating Route Guards to Integrate with Authentication

Authentication is integrated into a Single Page Application by creating route guards in the router configuration. A route guard is a mechanism that checks if a condition is true before rendering the route. In this case, the condition that needs to be `true` is that the user has been authenticated through Auth0.

To run logic before a top-level component in a route is initialized, we use the `onmatch` hook available for each route object. Auth0 already provides a method that we can use to check such condition: `isAuthenticated()`.

Let's update our router configuration on `App.jsx`.

First, let's make `/auth` the default route. This would force anyone visiting the page to be prompted to log in first. We need this because we want the `WelcomeView` to be our gatekeeper. If a user is not authenticated and attempts to visit any one route, the router will redirect them to `/auth` always.


```jsx
// src/components/layout/App.jsx

// ...

const App = {
  oncreate: (vnode) => {
    const mainStage = vnode.dom.querySelector(".main-stage");

    m.route(mainStage, "/auth", {
      "/auth": {
        view: () => WelcomeView()
      },
      "/conferences": {
        view: () => ConferenceView(CONFERENCES)
      },
      "/cfp": {
        view: () => CFPView(CONFERENCES)
      },
      "/entry": {
        view: () => FormView()
      }
    });
  },
  view: ({ children }) =>
    <div class="App">
      <MainStage>
        {children}
      </MainStage>
      <NavBar />
    </div>
};

export default App;
```

Next, let's modify the `"/conferences"` route to use `onmatch` instead of `view` to render the route's template:

```jsx
// src/components/layout/App.jsx

// ...

const App = {
  oncreate: (vnode) => {
    const mainStage = vnode.dom.querySelector(".main-stage");

    m.route(mainStage, "/auth", {
      "/auth": {
        view: () => WelcomeView()
      },
      "/conferences": {
        onmatch: () =>
          auth.isAuthenticated() ?
            ({view: () => ConferenceView(CONFERENCES)}) :
            m.route.set("/auth")

      },
      "/cfp": {
        view: () => CFPView(CONFERENCES)
      },
      "/entry": {
        view: () => FormView()
      }
    });
  },
  view: ({ children }) =>
    <div class="App">
      <MainStage>
        {children}
      </MainStage>
      <NavBar />
    </div>
};

export default App;
```

When `"/conferences"` is requested by the browser, `onmatch` logic will be run. If the user is authenticated with Auth0, we'd return an anonymous component that will help us render our view as we did before. On the other hand, if the user is _not_ authenticated with Auth0, we redirect the user to `"/auth"` by using the `m.route.set()` method.

Ensure that you are logged out of the application. Refresh the browser and go to `http://localhost:8080/#!/auth`. Try to visit the Conferences view. Nothing will happen as you are being redirected to the Welcome view. Now, click on the CFP or entry form view... they work! That's expected since we have not protected them. Let's do that now:


```jsx
// src/components/layout/App.jsx

// ...

const App = {
  oncreate: (vnode) => {
    const mainStage = vnode.dom.querySelector(".main-stage");

    m.route(mainStage, "/auth", {
      "/auth": {
        view: () => WelcomeView()
      },
      "/conferences": {
        onmatch: () =>
          auth.isAuthenticated() ?
            ({view: () => ConferenceView(CONFERENCES)}) :
            m.route.set("/auth")

      },
      "/cfp": {
        onmatch: () =>
          auth.isAuthenticated() ?
            ({view: () => CFPView(CONFERENCES)}) :
            m.route.set("/auth")
      },
      "/entry": {
        onmatch: () =>
          auth.isAuthenticated() ?
            ({view: () => FormView()}) :
            m.route.set("/auth")
      }
    });
  },
  view: ({ children }) =>
    <div class="App">
      <MainStage>
        {children}
      </MainStage>
      <NavBar />
    </div>
};

export default App;
```

Once again, ensure that you are logged out. Try visiting any route other than `/auth` and you won't go anywhere. To access any of the application views you have to be authorized. Try logging in now and see if you can access any of our three views...

Did it work? It shouldn't. Despite logging in, we are not letting AUth0 store our session authentication token. For that, we have to run `auth.handleAuthentication();` before our `m.route()`:

```jsx
// src/components/layout/App.jsx

// ...

const App = {
  oncreate: (vnode) => {
    const mainStage = vnode.dom.querySelector(".main-stage");

    // *** ADDING THIS HERE  ***
    auth.handleAuthentication();
    // *** IS VERY IMPORTANT ***

    m.route(mainStage, "/auth", {
      "/auth": {
        view: () => WelcomeView()
      },
      "/conferences": {
        onmatch: () =>
          auth.isAuthenticated() ?
            ({view: () => ConferenceView(CONFERENCES)}) :
            m.route.set("/auth")

      },
      "/cfp": {
        onmatch: () =>
          auth.isAuthenticated() ?
            ({view: () => CFPView(CONFERENCES)}) :
            m.route.set("/auth")
      },
      "/entry": {
        onmatch: () =>
          auth.isAuthenticated() ?
            ({view: () => FormView()}) :
            m.route.set("/auth")
      }
    });
  },
  view: ({ children }) =>
    <div class="App">
      <MainStage>
        {children}
      </MainStage>
      <NavBar />
    </div>
};

export default App;
```

Why do we need to do that?

`auth.handleAuthentication()` sets our authentication token and its expiration locally. When we log in, we are taken to Auth0's Universal Login page. Upon proper authentication, we are taken back to our app's Conference view.

What happens here is that the whole `App` has to be rendered again; therefore, `App`'s lifecycle function `oncreate()` will be run again. By placing `auth.handleAuthentication();` within its body, right before `m.route()` gets called, we ensure that the authentication token is set before our route guards are run. When a guarded route is matched, `auth.isAuthenticated()` is going to run, return true, and our protected view will then be rendered.

This concludes our project! We've done it. We built a functional, sleek, and secure application using the powers of Mithril and Auth0 combined.

## Conclusion

Look how powerful Auth0 is! With very simple configuration and very little code, we achieved a great milestone: allowing only registered users to access the application and requiring them to log in. There is a lot more that we can do with Auth0! Discover all the [possibilities for authentication here](https://auth0.com/docs/api/authentication).

We also got a chance to build a fairly complex application very easily by using Mithril as our framework. My favorite part of using Mithril has been on how easily it integrates with JSX, making it very transparent to use, and how simple, yet powerful, its router is! There's so much more that Mithril can do! We've just scratched the surface. Feel free to visit the [Mithril docs](https://mithril.js.org/api.html) to explore its API. What could have we done better throughout this application? Please let me know in the comments below. I also want to know what have you liked the most about Mithril?

Now that you understand Mithril, learning other frameworks such as [React](https://auth0.com/blog/reactjs-authentication-tutorial/) or [Inferno](https://auth0.com/blog/learn-about-inferno-js-build-and-authenticate-an-app/) would be a breeze. Happy coding!
