---
layout: post
title: "Create a Docker dashboard with Typescript, React and Socket.io"
description: Let's create a functioning web-based dashboard for Docker!
date: 2017-01-04 09:38
author: 
  name: Steve Hobbs
  url: https://stevescodingblog.co.uk
  mail: elkdanger@gmail.com
design: 
  bg_color: <A HEX BACKGROUND COLOR>
  image: <A PATH TO A 200x200 IMAGE>
tags: 
- reactjs
- typescript
- docker
- webpack
- node
- socket.io
---

In this article, we are going to use a few different technologies together to build something which, after a bit more elaboration, might actually be useful! We will be creating a web-based dashboard for a [Docker](https://www.docker.com/) installation using a number of different frameworks and technologies, both front-end and server-side, enabling some administrator to monitor running containers, start and stop existing containers, and create new containers based on existing Docker images. There is lots of scope for elaboration here, of course, but I'll leave that as an exercise for you, the reader. Hopefully this article will set you off on the right foot with a good overview of the relevant technologies, enabling you to add even more value to the product!

## The app

This is a quick preview of what the app looks like when it's finished. It's essentially a page that displays two lists of Docker containers; those that are currently running, and those that are stopped. It allows the user to start and stop these containers, as well as start a new container from an existing image by clicking the 'New container' button.

![Preview of the Docker dashboard app](http://i.imgur.com/jfWUxBY.png)

## The code

If you want to explore the finished product as a reference (finished as far as the article is concerned!) then you can [fork the code on Github.com](https://github.com/elkdanger/docker-dashboard).

## Technology stack

Let's have a look at exactly what we're going to be using, and why. I'll go through the prerequisites and what to install first in a bit.

* **Node** We will use this to write our server-side code in Javascript to run it on our machine, and serve up our website to our users
* **Docker** This uses container technology to reliably run apps and services on a machine. The app interfaces with the Docker daemon through the [Docker Remote API](https://docs.docker.com/engine/reference/api/docker_remote_api/). More on this later
* **Typescript** This allows us to add type safety to Javascript and allows us to use modern Javascript syntax in older browsers
* **React** Allows us to write the front-end of our application in isolated components in an immutable, state-driven way, mixing Html with Javascript
* **Socket.io** Provides us with a way to communicate in real-time with the server and other clients using WebSocket technology, gracefully degrading on older browsers

Peppered amongst the main technologies mentioned above are various libraries which also provide a lot of value during development time:

* **ExpressJS** Used to serve our web application
* **Webpack** To transpile our Typescript assests into normal Javascript
* **Bootstrap** To provide something decent looking - a problem I know all of us programmers endure!

There are a few more minor ones, but I will cover those as we come to them.

## Prerequisites

### Docker

As this is going to be a slick-looking dashboard for _Docker_, we need to make sure we have Docker installed (if you don't already).

Head to https://www.docker.com/ and download the latest version of the client for your operating system. If you've never heard of or used Docker before, don't worry about it too much, but it might be worth following through their [getting started tutorial for Mac](https://docs.docker.com/docker-for-mac/) or [Windows](https://docs.docker.com/docker-for-windows/) or [Linux](https://docs.docker.com/engine/installation/).

To make sure your Docker installation is up and running, open up a command prompt and type: `docker -v`. You should see some version information repeated back to you; mine says `Docker version 1.12.5, build 7392c3b`. If you can't see this or you get an error, follow through the installation docs again carefully to see if you missed anything.

Keep the command prompt open - you're going to need it!

### NodeJS

To write our app and serve the web interface to the user, we're going to use NodeJS. This has a number of libraries and frameworks which will make this job very easy for us.

I used Node version 6.3.1 to write this article, so I would urge you to use the same version or later if you can, as there are some language features that I'm using which may not be available in earlier versions of the framework.

You can [grab the 6.3.1 release](https://nodejs.org/en/download/releases/) from their website, or simply grab the [latest release](https://nodejs.org/en/download/) from their main downloads page. You can also use something like [NVM](https://github.com/creationix/nvm) if you want to mix and match your versions for different projects, which is something I can recommend doing.

Once you have Node installed, open up your command line and make sure it's available by typing:

`node -v`

It should repeat the correct version number back to you. Also check that NPM is available (it should have been installed by the NodeJS installer) by typing:

`npm -v`

It should ideally be version 3 or greater.

### Typescript

We will need to install the [Typescript](https://www.npmjs.com/package/typescript) compiler for our application to work; luckily we can do this through NPM. 

Now that we have NPM installed from the previous step, we can install Typescript using the following command:

`npm install -g typescript`

This will download the Typescript compiler using the node package manager and make the tools available on the command-line. To verify that your installation has worked, type:

`tsc -v`

Which should again echo a version number back to you (I'm using 2.0.10).

### Webpack

Finally, install [Webpack](https://www.NPMjs.com/package/webpack), which will allow us to package our Javascript assets together and will effectively run our Typescript compiler for us. Again, we can do this through NPM:

`npm install -g webpack`

This has installed webpack into our global package repository on our machine, giving us access to the 'webpack' tool, but we will _also_ need to install it into our project folder - which is what we're about to do next!

## Setting up the project

First of all, create a folder somewhere on your machine to house the development of your Docker dashboard, and navigate to it in your command line. We'll go through a number of steps to set this folder up for use before we start coding.

Next, initialise the NodeJS project by typing: `npm init`

This will ask you a number of questions about the project, none of which are terribly important for this demo, except that the name must be all lower-case and contain no spaces.

Once that has finished, you will be left with a `package.json` file in your project. This is the manifest file that describes your node project and all of its dependencies, and we'll be adding to this shortly.

## Creating the web server

Next, we'll get the basic web server up and running which will eventually serve our ReactJS app to the user.

Let's begin by installing [ExpressJS](http://expressjs.com/), which will enable us to get this done:

`npm install --save express`

Express is a framework that provides us with an API for handling incoming HTTP requests, and defining their responses. You can apply a number of view engines for serving web pages back to the user, along with a whole host of middleware for serving static files, handling cookies, and much more. Alas, we're simply going to use it to serve up a single Html file and some Javascript assets, but at least it makes that job easy!

Next, create the file `server.js` inside the root of your project, and add the code which will serve the Html file:

```javascript
let express = require('express')
let path = require('path')
let app = express()
let server = require('http').Server(app)

// Use the environment port if available, or default to 3000
let port = process.env.PORT || 3000

// Serve static files from /public
app.use(express.static('public'))

// Create an endpoint which just returns the index.html page
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')))

// Start the server
server.listen(port, () => console.log(`Server started on port ${port}`))

```

_You're going to see a lot of new ES6 syntax in this article, like `let`, `const`, arrow functions and a few other things. If you're not aware of modern Javascript syntax, it's worth having [a read up on some the new features](https://babeljs.io/learn-es2015/)!_

Next, create an `index.html` file in the root of the project with the following content:

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Docker Dashboard</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" type="text/css">
</head>

<body>

    <div id="app">
        Docker Dashboard!
    </div>
    
    <script src="https://code.jquery.com/jquery-2.2.4.min.js"
     integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44="
    crossorigin="anonymous"></script>

    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
</body>

</html>
```

This simply gives us a basic template for the front page of our app - we'll be adding to this later!

Finally, let's test it out to make sure it's all working so far. In the command line, type:

`node server.js`

The prompt should tell you that it has managed to start the site on port 3000. [Browse there now](http://localhost:3000) and make sure we can see our default index page. If not, check both the browser window and the console to see if Node has spat out any useful errors, and try again.

### Keeping a smooth development workflow

Right now when you make changes to the site you will be forced to stop and restart the node app to see your changes to NodeJS code take effect, or re-run the webpack command whenever you make a change to your React components. We can mitigate both of these by causing them to reload themselves whenever changes are made.

To automatically reload your NodeJS server-side changes, you can use a package called [nodemon](https://nodemon.io/). Install it using `npm install -g nodemon` and then start your node app using `nodemon server.js`. You'll notice that, as you make changes to your code, the app will automatically restart.

To handle the recompilation of your React components automatically, webpack has a 'watch' option that will cause it to re-run by itself. To do this, start webpack using `webpack --watch` and notice that your Javascript bundles will start recompiling automatically whenever you change your React components.

To have thes two things - nodemon and webpack - running together, you can either start them in two different console windows, or if you're using OSX or Linux you can run them from one console using this neat one-liner:

`nodemon server.js & webpack --watch`

**Note** This won't work on Windows systems, but luckily there is a package for that called [concurrently](https://www.npmjs.com/package/concurrently) that you can use to achieve the same affect:

```
npm install -g concurrently
concurrently "nodemon server.js" "webpack --watch"
```

Even better, you can put all of this into the node start script. Edit the 'scripts' node of the 'package.json' file to look like the following:

```javascript
...
"main": "index.js",
"scripts": {
"start": "concurrently \"nodemon server.js\" \"webpack --watch\""
},
"author": "",
...
```

And then whenever you want to start your app and have it automatically recompile everything, you can simply run `npm start`!

## Starting some React and Typescript

The main body of our client application is going to be constructed using React and Typescript, which means we need to spend a little more time setting up one or two more tools. Once we set up a workflow for compiling the first component, the rest will easily follow.

Firstly, let's have a look at how we're going to structure our React components.

```
app/
|--- components/
|    |--- app.tsx
|    |--- containerList.tsx
|    |--- dialogTrigger.tsx
|    |--- modal.tsx
|    |--- newContainerModal.tsx
|--- index.tsx
```

They will all be housed inside an 'app' folder, with the smaller components inside a 'components' subfolder. `index.tsx` is essentially an entry point into our client-side app; it binds the React components to the Html Dom.

`app.tsx` glues everything together - it arranges and communicates with the other components in order to present the interface to the user and allow them to interact with the application. Let's set the project up to start compiling `index.tsx`

Create the 'app' folder, and then the 'index.tsx' file inside of that, with the following contents:

```javascript
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { AppComponent } from './components/app'

ReactDOM.render(
    <AppComponent />,
    document.getElementById('app')
)
```

If you're using the excellent [Visual Studio Code](https://code.visualstudio.com/) you'll notice that it will immediately start throwing up intellisense issues, mainly because it doesn't know what 'react', 'react-dom' and our application component is. We're going to use Webpack and Typescript to fix that!

### Setting up Webpack

Webpack is the thing that is going to take all our .tsx files, work out their dependencies based on the imported files, run them through the Typescript compiler and then spit out one Javascript file that we can include on the main Html page. It does this primarily by referencing a configuration file in the root of our project, so let's create that next.

Create the file `webpack.config.js` in the root of your project, with the following contents:

```javascript
module.exports = {
    entry: "./app/index.tsx",
    output: {
        filename: "bundle.js",
        path: __dirname + "/public/js"
    },

    devtool: "source-map",

    resolve: {
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },

    module: {
        loaders: [
            { test: /\.tsx?$/, loader: "ts-loader" }
        ],

        preLoaders: [
            { test: /\.js$/, loader: "source-map-loader" }
        ]
    }
};
```

There's quite a bit in there, so let's go through it:

* The `entry` key tells Webpack to start processing files using the `/app/index.tsx` file
* The output key tells Webpack where to put the output files; in the `/public/js` folder with the name `bundle.js`
* The `devtool` key, along with the `source-map-loader` preloader in the `module` section, tells Webpack to generate source maps, which will come in very handy when trying to debug your Javascript app later
* The `resolve` key tells Webpack which extensions to pay attention to when resolving modules
* The `loaders` section tells Webpack what middleware to use when processing modules. Here we tell it that, whenever Webpack comes across a file with a .ts or .tsx extension, it should use the `ts-loader` tool. This is the tool that processes a Typescript file and turns it into regular Javascript.

There is a lot more you can do with Webpack, including automatically splitting out common modules into a `common.js` file, or including css files along with your Javascript, but what we have here is sufficient for our requirements.

To get this to work, we still need to install the `ts-loader` and `source-map-loader` packages:

`npm install --save-dev ts-loader source-map-loader`

We also need to install the React packages that we need:

`npm install --save-dev react react-dom`

Next, we need install Typescript into the project. We have already installed it globally in the first section of this article, so we can simply link it in:

`npm link typescript`

Typescript itself needs a configuration file, which lives in the `tsconfig.json` file in the root of the project. Create that now, with the following content:

```json
{
    "compilerOptions": {
        "outDir": "dist/",
        "sourceMap": true,
        "noImplicitAny": true,
        "module": "commonjs",
        "target": "es5",
        "jsx": "react"
    }
}
```

The main parts of this configuration are the `module`, `target` and `jsx` keys, which instruct Typescript how to output the correct code to load modules in the right way, and also how to deal with the React JSX syntax correctly (covered later).

Let's see what state our Webpack set up is in at the moment. From the command line, simply type `webpack` to start compilation.

It should give you some stats about compile times and sizes, along with a few errors:

```
ERROR in ./app/index.tsx
(1,24): error TS2307: Cannot find module 'react'.

ERROR in ./app/index.tsx
(2,27): error TS2307: Cannot find module 'react-dom'.

ERROR in ./app/index.tsx
(3,30): error TS2307: Cannot find module './components/app'.

ERROR in ./app/index.tsx
(6,5): error TS2602: JSX element implicitly has type 'any' because the global type 'JSX.Element' does not exist.

ERROR in ./app/index.tsx
Module not found: Error: Cannot resolve 'file' or 'directory' ./components/app in /Users/stevenhobbs/Dev/personal/docker-dashboard/app
 @ ./app/index.tsx 4:12-39
 ```

Essentially, it still doesn't know what 'react' is, so let's fix that now!

### Installing typings for React

Because we've told Webpack that we're going to handle the React and ReactDOM libraries ourselves, we need to tell Typescript what those things are. We do that using [Type Definition Files](https://github.com/DefinitelyTyped/DefinitelyTyped). As you can see from the Github repository, there are thousands of files, covering most of the Javascript frameworks you've heard of. This is how we get rich typing, compile-time hints and intellisense while writing Typescript files. Luckily, we can also install them using NPM.

To install them, use:

`npm install --save-dev @types/react @types/react-dom`

Now try running `webpack` again. This time we get just one error, telling us that the `./components/app` module is missing. Create a skeleton file for now so that we can get it compiling, and inspect the results. Create the file `app/components/app.tsx` with the following content:

```javascript
import * as React from 'react'

export class AppComponent extends React.Component<{}, {}> {
    render() {
        return (<h1>Docker Dashboard</h1>)
    }
}
```

At the moment it does nothing except print out 'Docker Dashboard' in a header tag, but it should at least compile. We'll flesh this out much more later on! For now though, you should be able to run the `webpack` command again now, and have it produce no errors.

To inspect what Webpack has created for us, find the `public/js` folder and open the `bundle.js` file. You'll see that, while it does look rather obtuse, you should be able to recognise elements of your program in there towards the very bottom, as normal Javascript that can run in the browser. It's also rather large, as it also includes the React libraries and it will include even more by the time we're finished!

The next thing to do is include this file in our Html page. Open `index.html` and put a script tag near the bottom, underneath the Bootstrap include:

```html
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>

    <!-- Add our bundle here -->
    <script src="/js/bundle.js"></script>
</body>
```

Now, you should be at the point where you can run the site using `node server.js`, browse to http://localhost:3000 and view the running website. If you can see 'Docker Dashboard' written using a large header font, then you've successfully managed to get your Webpack/Typescript/React workflow working! Congratulations!

Now let's flesh the actual application a bit more and add some real value..

## Creating the components

What we have now is a server-side application which acts as the backbone of our React app. Now that we have done all that setup and configuration, we can actually concentrate on creating the React components that will form the application's interface. Later on, we will tie the interface to the server using socket.io, but for now let's start with some React components.

To figure out what components we need, let's take another look at a screenshot of the application, this time with the individual React components highlighted:

![The Docker dashboard with components](http://i.imgur.com/1Qek2Fd.png)

* The DialogTrigger component displays a button which can trigger a Bootstrap modal dialog
* The ContainerItem component knows how to display a single Docker container, including some info about the container itself
* The ContainerList displays a number of ContainerItem components. There are two ContainerList components here - one for running containers, and one for stopped containers

One additional component which is not shown in that screenshot is the modal dialog for starting new containers:

![The Docker dashboard modal dialog component](http://i.imgur.com/3YJoSpn.png)

To start with, let's create the component to display a single container. Create a new file in /app/components called `containerListItem.tsx`, and give it the following content:

```javascript
import * as React from 'react'
import * as classNames from 'classnames'

export interface Container {
    id: string
    name: string
    image: string
    state: string
    status: string
}

export class ContainerListItem extends React.Component<Container, {}> {

    // Helper method for determining whether the container is running or not
    isRunning() {
        return this.props.state === 'running'
    }

    render() {
        const panelClass = this.isRunning() ? 'success' : 'default'
        const classes = classNames('panel', `panel-${panelClass}`)
        const buttonText = this.isRunning() ? 'Stop' : 'Start'

        return (
            <div className="col-sm-3">
                <div className={ classes }>
                    <div className="panel-heading">{ this.props.name }</div>
                    <div className="panel-body">
                        Status: {this.props.status}<br/>
                        Image: {this.props.image}
                    </div>
                    <div className="panel-footer">
                        <button className="btn btn-default">{buttonText}</button>
                    </div>
                </div>
            </div>
        )
    }
}
```

Here we have defined a component that can render a single container. We also declare an interface that has all of the properties about a container that we'd want to display, like its name, image and current status. We define the 'props' type of this component to be a Container, which means we can get access to all the container information through `this.props`.

The goal of this component is to not only display the current status of the component, but also to handle the start/stop button - this is something we'll flesh out later once we get into the socket.io goodness.

The other interesting this component can do, is slightly alter its appearance depending on whether the container is running or not. It has a green header when it's running, and a grey header when it's not. It does this by simply switching the Css class depending on the status. 

We'll need to install the `classnames` package for this to work, along with its Typescript reference typings. To do that, drop into the command line once more:

`npm install --save classnames`

`npm install --save-dev @types/classnames`

[Classnames](https://www.npmjs.com/package/classnames) is not strictly necessary, but does provide a handy API for conditionally concatenating CSS class names together, as we are doing here.

Next, let's create the ContainerItemList component, which is in charge of displaying a whole list of these components together. Create a new file in /app/components called `ContainerList` with the following content:

```javascript
import * as React from 'react'
import { Container, ContainerListItem } from './containerListItem'

export class ContainerListProps {
    containers: Container[]
    title?: string
}

export class ContainerList extends React.Component<ContainerListProps, {}> {
    render() {
        return (
            <div>
                <h3>{this.props.title}</h3>
                <p>{ this.props.containers.length == 0 ? "No containers to show" : "" }</p>
                <div className="row">
                    { this.props.containers.map(c => <ContainerListItem key={c.name} {...c} />) }
                </div>
            </div>
        )
    }
}
```

This one is a little simpler as it doesn't do too much except display a bunch of `ComponentListItem`s in a list. The properties for this component include an array of Containers to display, and a title for the list. If the list of containers is empty, we show a short message.

Otherwise, we use `map()` to convert the list of `Container` types into `ContainerListItem` components, using the [spread operator](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Spread_operator) (the `...c` part) to apply the properties on `Container` to the component. We also give it a key so that React can uniquely identify each container in the list; I'm using the name of the container, seeing as that will be unique in our domain (you can't create two Docker containers with the same name, running or not).

So now we have a component to render a container, and one to render a list of containers with a title, let's flesh out the App container a bit more.

### Displaying some containers

Back to `app.tsx`. First we need to import our new containers into the module:

```javascript
import { Container, ContainerListItem } from './containerListItem'
import { ContainerList } from './containerList'
```

Next, we'll create a couple of dummy containers just for the purpose of displaying something on screen; we'll swap this out later with real data from the Docker Remote API. Add this inside the AppComponent class, near the top:

```javascript
containers: Container[] = [
    {
        id: '1',
        name: 'test container',
        image: 'some image',
        state: 'running',
        status: 'Running'
    },
    {
        id: '2',
        name: 'another test container',
        image: 'some image',
        state: 'stopped',
        status: 'Running'
    }
]
```

Now we need to create some state for this application component. The state will simply tell us which components are running, and which are stopped. We'll use this state to populate the two lists of containers respectively.

To this end, create a new class `AppState` outside of the main application component to hold this state:

```javascript
class AppState {
    containers?: Container[]
    stoppedContainers?: Container[]
}
```

Now change the type of the state on `AppComponent` so that Typescript knows what properties are available on our state. Your `AppComponent` declaration should now look like this:

```javascript
export class AppComponent extends React.Component<{}, AppState> {
```

Then create a constructor inside `AppComponent` to initialise our state, including giving it our mocked-up containers. To do this, we use [lodash](https://lodash.com/docs/4.17.2) to partition our container list into two lists based on the container state. This means that we'll have to install lodash and the associated typings:

```
npm install --save lodash
npm install --save-dev @types/lodash
```

And then import the lodash library at the top of the file:

```javascript
import * as _ from 'lodash'
```

Lodash is a very handy utility library for performing all sorts of operations on lists, such as sorting, filtering - and in our case - partitioning!

Here's the constructor implementation:

```javascript
constructor() {
    super()

    const partitioned = _.partition(this.containers, c => c.state == 'running')

    this.state = {
        containers: partitioned[0],
        stoppedContainers: partitioned[1]
    }
}
```

Now in our state we should have two lists of containers - those that are running, and those that aren't.

Finally, let's replace the render method so that it takes our dummy containers and uses our components to represent them on the screen:

```javascript
render() {
    return (
        <div className="container">
            <h1 className="page-header">Docker Dashboard</h1>
            
            <ContainerList title="Running" containers={this.state.containers} />
            <ContainerList title="Stopped containers" containers={this.state.stoppedContainers} />
        </div>
    )
}
```

At this point you should have a basic dashboard setup with some dummy containers - let's have a look:

![A basic dashboard](http://i.imgur.com/faVfciE.png)

## Making things dynamic!

Let's have a look at the Docker and socket.io side of things now, and replace those dummy containers with some real data!

Firstly, install [dockerode](https://github.com/apocas/dockerode), a NodeJS library that enables us to interact with the Docker Remote API:

`npm install --save dockerode`

Next, install the libraries and associated typings for [socket.io](http://socket.io/) - we'll be using this both on the server-side _and_ the client, as a means of communicating between the two:

```
npm install --save socket.io
npm install --save-dev @types/socket.io @types/socket.io-client
```

Now, open `server.js` in the root of the project and import socket.io, binding it to the Express server that we've already created:

```javascript
let io = require('socket.io')(server)
```

We can also get a connection to the Docker Remote API at this point, through Dockerode. We need to connect to the API differently depending on whether we're on a Unix system or a Windows system, so let's house this logic in a new module called `dockerapi.js` in the root of the project:

```javascript
let Docker = require("dockerode");
let isWindows = process.platform === "win32";

let options = {};

if (isWindows) {
    options = {
        host: '127.0.0.1',
        port: 2375
    }
} else {
    options = {
        socketPath: '/var/run/docker.sock'
    }
}

module.exports = new Docker(options);
```

Now we can include this in our `server.js` file and get a handle to the API:

```javascript
let docker = require('./dockerapi')
```

We're going to provide the client with a few methods; getting a list of containers, starting a container, stopping a container, and running a new container from an exiting image. Let's start with the container list.

Firstly, we need to listen for connections. We can do this further down the `server.js` script, after we start the web server on the line that begins `server.listen(..)`

```javascript
io.on('connection', socket => {
    socket.on('containers.list', () => {
        refreshContainers()
    })
})
```
This starts socket.io listening for connections. A connection will be made when the React app starts; at least it will be when we put the code in a bit later on!

In order to send the list of Docker containers, we listen for the 'containers.list' message being sent from the socket that has connected to the server; in other words, the client app has requested the list of containers from the server. Let's go ahead and define the `refreshContainers()` method:

```javascript
function refreshContainers() {
    docker.listContainers({ all: true}, (err, containers) => {
        io.emit('containers.list', containers)
    })
}
```
Whenever we call `refreshContainers()`, the Docker API will be used to retrieve the list of all of the containers that exist on the current system (running or not), which will then send them all using the 'containers.list' message through socket.io. Notice though that we're sending the message through the main `io` object rather than through a specific socket - this means that _all of the clients_ currently connected will have their container lists refreshed. You will see why this becomes important later in the article.

Moving over to the main React component, we should now be able to start picking up messages through socket.io which indicate that we should display the container list. First, import the socket.io library and connect to the socket.io server:

```javascript
import * as io from 'socket.io-client'

let socket = io.connect()
```

Next, delete the mocked-up containers that we had put in before. Then change the constructor so that we react to the messages being passed to us from socket.io instead of using our mocked-up containers. We will also initialise the component state so that the containers are just empty lists; the component will populate them at some short time in the future when it has received the appropriate message. Here's what the constructor looks like now:

```javascript
constructor() {
    super()
    this.state = {
        containers: [],
        stoppedContainers: []
    }

    socket.on('containers.list', (containers: any) => {

        const partitioned = _.partition(containers, (c: any) => c.State == "running")

        this.setState({
            containers: partitioned[0].map(this.mapContainer),
            stoppedContainers: partitioned[1].map(this.mapContainer)
        })
    })
}
```

We listen for messages using `io.on()` and specify the message string. When our socket receives a message with this name, our handler function will be called. In this case, we handle it and receive a list of container objects down the wire. We then partition it into running and stopped containers (just as we did before) and then we set the state appropriately. Each container from the server is mapped to our client-side Container type using a function `mapContainer()`, which is shown here:

```javascript
mapContainer(container:any): Container {
    return {
        id: container.Id,
        name: _.chain(container.Names)
            .map((n: string) => n.substr(1))
            .join(", ")
            .value(),
        state: container.State,
        status: `${container.State} (${container.Status})`,
        image: container.Image
    }
}
```

This is where we extract out properties such as the name, image, status and so on. Any other properties that you want to include on the UI in the future, you will probably read inside this function.

So now we have the ability to react to socket.io messages coming down the wire, the next thing to do is cause the server to send us the container list! We do this by sending a 'containers.list' message to the server using `socket.emit`, which will send all the connections a similarly-titled message back with the container data. We can send this message from the `componentDidMount` event, which is called on our Component once it has been 'mounted' to the DOM:

```javascript
componentDidMount() {
    socket.emit('containers.list')
}
```

Right now, you should be able to start your app and have it display a list of the running and stopped Docker containers on your machine!

![My Docker containers](http://i.imgur.com/F1Llyk4.png)

## Starting containers

Being able to start and stop a container is merely an extension of what we've already accomplished. Let's have a look at how we can start a container when we click the 'Start' button.

### Wiring up the start button

The workflow we're going to implement looks like this:

1) We are going to handle the 'click' event of the start button from inside the React component
2) Inside the click event, we're going to send a message to the socket running on the server
3) The server will receive the message and tell Docker to start the appropriate container
4) When the container starts, the server will dispatch a message to all connections with a refreshed list of containers

Let's start with the button. Alter the button inside your `ContainerListItem` component so that it handles the click event using a method called `onActionButtonClick`:

```javascript
<button onClick={this.onActionButtonClick.bind(this)} 
    className="btn btn-default">{buttonText}</button>
```

Next create, the `onActionButtonClick` handler somewhere inside the same component:

```javascript
onActionButtonClick() {    
    socket.emit('container.start', { id: this.props.id })
}
```

Here we post the 'container.start' message to the socket along with the container id. Armed with this information, we'll be able to tell Docker which container to start. You might find that you'll get an issue here, because Typescript doesn't know what `socket` is yet. We can fix that by importing `socket.io-client` and connecting to the server socket. At the top of the file, then:

```javascript
import * as io from 'socket.io-client'

const socket = io.connect()
```

Now everything should be fine. To complete the feature, let's pop over to the server side and handle the incoming message. Open `server.js` and add the following somewhere inside your socket connection handler, alongside where you handle the 'containers.list' message:

```javascript
socket.on('container.start', args => {
    const container = docker.getContainer(args.id)

    if (container) {
        container.start((err, data) => refreshContainers())
    }
})
```

Here we simply get a container from Docker using the id that we get from the client. If the container is valid, we call `start` on it. Once start has completed, we call our `refreshContainers` method that we already have. This will cause socket.io to send our current list of containers to all the connected clients.

## Stopping containers

The functionality for stopping containers that are running is done in much the same way; we send a message through socket.io to the server with a 'containers.stop' message, the server stops the relevant container and then tells everyone to refresh their container list.

Once again, let's start on the component side of things. In the previous section, we added a handler for the 'start/stop' button which tells socket.io to send a message to start the container. Let's tweak that a bit so that we can use it for stopping containers too; we'll just send the right message or not depending on whether the container is currently running or not. So this handler now becomes:

```javascript
onActionButtonClick() {
    const evt = this.isRunning() ? 'container.stop' : 'container.start'
    socket.emit(evt, { id: this.props.id })
}
```

Next, we'll handle the message on the server. Add a handler for this alongside the one we added in the previous section for 'container.start':

```javascript
socket.on('container.stop', args => {
    const container = docker.getContainer(args.id)

    if (container) {
        container.stop((err, data) => refreshContainers())
    }
})
```

The code looks strikingly similar to the start code, except we _stop_ a container instead of starting it. If you run the app now, you should be able to start and stop your containers!

### Periodically refreshing container state

Before we head into the last section, now would be a good time to add a quick feature that will automatically refresh our container state. As awesome as our new Docker dashboard is, containers can be started, stopped, created and destroyed from a few different places outside of our app, such as the command line. It would be nice to reflect these changes in our app too.

A quick and easy way to achieve this is to simply read the container state every x seconds, then update our clients. We already have most of the tools to do this, so let's implement it!

Back in `server.js` in the server-side app, add a quick one-liner to send an updated list of Docker containers every 2 seconds. Put this outside of the `io.on('connection', ...` block:

```javascript
setInterval(refreshContainers, 2000)
```

Now, once your app is running, dive into the command line and stop one of your containers using `docker stop <container id or name>`, and you should see the container stop inside your dashboard too!

Furthermore, thanks to the power of socket.io, you should be able to open your dashboard in multiple browsers and _see them all update at the same time_. Go ahead and try browsing your dashboard on your mobile device too! 

## Starting brand new containers

In this final section, we're going to explore how we can start brand new containers from exiting Docker images. This will involve a couple of new React components, a [Bootstrap Modal popup](http://getbootstrap.com/javascript/#modals) and some more interaction with socket.io and the Docker API.

First, let's create the React components. There are 3 components involved:

* A 'modal' component, which is a generic component for creating any modal dialog
* A 'new container model' component, which is based upon the generic modal component for showing the new container-specific UI, as well as handling validation
* A 'dialog trigger' component which is used to show a modal dialog component on the screen.

### Creating a generic modal popup component

Let's start with the generic component, seeing as our modal for creating a new container will be based upon this one. We're making a generic component just as an exercise to show you how you can extend such a component for multiple uses. For example, later you might go on to create a dialog to accept an image name that will be pulled from the Docker hub - you could also base that modal upon this generic component.

Create a new file in the 'components' director called `modal.tsx`, and begin by importing the relevant modules:

```javascript
import * as React from 'react'
```

Next, define some properties that our modal can accept so that we can configure how it looks and works:

```javascript
interface ModalProperties {
    id: string
    title: string
    buttonText?: string
    onButtonClicked?: () => boolean|undefined
}
```

We must take an id and a title, but we can also accept some text for the button on the dialog and also a handler for the button click, so that we can define what happens when the user clicks the button. Remember that this component is designed to be used in a generic way - we don't actually know what the behaviour will be yet!

Now let's define the component itself:

```javascript
export default class Modal extends React.Component<ModalProperties, {}> {

    // Store the HTML element id of the modal popup
    modalElementId: string

    constructor(props: ModalProperties) {
        super(props)
        this.modalElementId = `#${this.props.id}`
    }

    onPrimaryButtonClick() {
        // Delegate to the generic button handler defined by the inheriting component
        if (this.props.onButtonClicked) {
            if (this.props.onButtonClicked() !== false) {

                // Use Bootstrap's jQuery API to hide the popup
                $(this.modalElementId).modal('hide')
            }
        }
    }

    render() {
        return (
            <div className="modal fade" id={ this.props.id }>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                            <h4 className="modal-title">{ this.props.title }</h4>
                        </div>
                        <div className="modal-body">
                            { this.props.children }
                        </div>
                        <div className="modal-footer">
                            <button type="button"
                                onClick={this.onPrimaryButtonClick.bind(this)}
                                className="btn btn-primary">{ this.props.buttonText || "Ok" }
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
```

The component definition itself is mostly straightforward - we just render out the appropriate Bootstrap markup for modal popups, but we pepper it with values, such as the component title. We also specify the client handler on the button as well as the button text. If the component doesn't specify what the button text should be, the default value "Ok" is used, using this line:

```javascript
{ this.props.buttonText || "Ok" }
```

Most importantly, the component called `this.props.children` for the modal body. You'll see why this important in the next section, but basically it allows us to render other components that are specified as children of this component. More on that later.

Also note the `onPrimaryButtonClick` handler; when the button is clicked, it delegates control to whatever is using this component, but it also inspects the return value from that call. If false is returned, it doesn't automatically close the dialog. This is useful for later when we don't want to close the dialog in the event that our input isn't valid.

One last thing before we move on; when this component compiles, you'll probably find that Typescript will complain that it can't find `$`, which is true since we haven't imported it. To fix this, we need to simply install the typings for jQuery so that it knows how to resolve that symbol. You will also need to install the types for Twitter Bootstrap, so that it knows what the bootstrap-specific methods and properties are.

In the command line, then:

```
npm install --save-dev @types/jquery @types/bootstrap
```

### Creating the 'new container' dialog

This dialog will be defined by creating a new dialog component and wrapping the content in the generic dialog component that we created in the last section, specifing some things like the title and what happens when the user clicks the button. Create a new file for the component called 'newContainerModal'.

Firstly, define our imports:

```javascript
import * as React from 'react'
import Modal from './modal'
import * as classNames from 'classnames'
```

Note that we're importing our generic modal as `Modal`, allowing us to make use of it in this new modal component - more on that shortly.

Now let's define some incoming properties, and some state for our new component:

```javascript
interface ModalProperties {
    id: string,
    onRunImage?: (name: string) => void
}

interface ModalState {
    imageName: string
    isValid: boolean
}
```

For the properties, we allow an id for the component to be set - this will make sense soon when we create our last component, the 'modal dialog trigger'. We also take a function that we can call when the name of an image to run has been entered.

For the state, we're going to record the name of the image that was entered, and also some basic form validation state using the `isValid` flag.

As a reminder, this is what this modal popup is going to look like; there's just one text field and one button:

![The Docker dashboard modal dialog component](http://i.imgur.com/3YJoSpn.png)

Let's fill out the component and have a look at its `render` method. Also note the constructor, where can initialise the component state to something default:

```javascript
export class NewContainerDialog extends React.Component<ModalProperties, ModalState> {

    constructor(props: ModalProperties) {
        super(props)

        this.state = {
            imageName: '',
            isValid: false
        }
    }

    render() {

        let inputClass = classNames({
            "form-group": true,
            "has-error": !this.state.isValid
        })

        return (
            <Modal id="newContainerModal" buttonText="Run" title="Create a new container" onButtonClicked={this.runImage.bind(this)}>
                <form className="form-horizontal">
                    <div className={inputClass}>
                        <label htmlFor="imageName" className="col-sm-3 control-label">Image name</label>
                        <div className="col-sm-9">
                            <input type="text" 
                                className="form-control" 
                                onChange={this.onImageNameChange.bind(this)}
                                id="imageName" 
                                placeholder="e.g mongodb:latest"/>
                        </div>
                    </div>
                </form>
            </Modal>
        )
    }
}
```

Hopefully now you can see how the component is constructing using the generic modal component we created earlier. In this configuration, the `Modal` component acts as a _higher-order component_, wrapping other components inside of it, instead of our new component _inheriting_ from it as we might have otherwise done.

The rest of the markup is fairly standard Bootstrap markup that defines a form field with a label. Three things to note, however:

* We apply a class to the `div` that wraps the form elements that is derived from our `isValid` state property; if the form isn't valid, the input box gets a nice red border, and the user can see they've done something wrong
* We specify a handler for the textbox's 'onChange' event, allowing us to handle and record what the user is typing in
* We specify a handler for the generic modal's button click - when the user clicks that button, our new component is going to handle the event and do something specific to our needs. We'll come back to this in a minute

Let's define that change handler now:

```javascript
onImageNameChange(e: any) {
    const name = e.target.value

    this.setState({
        imageName: name,
        isValid: name.length > 0
    })
}
```

All of the form behaviour is captured here. As the user is typing into the box, we record the input value into the `imageName` state property, and also determine whether or not it's valid; for now, it's good enough for the image name to have at least one character.

Next, we need to define what happens when the user clicks the button on the modal popup. This is done inside the `runImage` function:

```javascript
runImage() {
    if (this.state.isValid && this.props.onRunImage)
        this.props.onRunImage(this.state.imageName)
        
    return this.state.isValid
}
```

This should be fairly straightforward - we simply say that if the state of the component is valid, and the `onRunImage` handler has been defined, we call it with the name of the image that the user typed in. We also return a value which indicates to the generic modal component that it should close itself. This happens to just be the same thing is the value of the `isValid` flag.

That's it for this component - let's create a trigger component so that we can open it!

### Triggering the modal

This last component is going to represent the trigger - the thing the user will click on - that opens a modal popup. It's definition is actually very simple. Create a new component called 'dialogTrigger.tsx' and populate it with the following:

```javascript
import * as React from 'react'

export interface DialogTriggerProperties {
    id: string
    buttonText: string
}

export class DialogTrigger extends React.Component<DialogTriggerProperties, {}> {
    render() {
        const href = `#${this.props.id}`

        return (
            <a className="btn btn-primary" data-toggle="modal" href={ href }>{ this.props.buttonText }</a>
        )
    }
}
```

For the component properties, we take the id of the modal we want to trigger, and also the text that we want to show on the button. Then inside the render function, a standard Bootstrap link is displayed with button styling and the id of the modal to open. If you're not familiar with Bootstrap, note that the actual opening of the dialog is all done with the Bootstrap Javascript library - all we need to do is specify the `data-toggle="modal"` attribute and set the href attribute to the id of the modal we want to open.

## Tying it all together

Now that we have all of our modal components, we can put them all together. Head back to `app.tsx` and import all the components we just created:

```javascript
import { NewContainerDialog } from './newContainerModal'
import { DialogTrigger } from './dialogTrigger'
```

There's no need to import the generic Modal component, as that will be done by the `NewContainerDialog` component; we're not going to use it directly here.

Now, update the render function so that it contains our new components. For the trigger, place it under the header, and for the 'new container' dialog, it just needs to go on the page somewhere; Bootstrap will place it correctly once it has been opened:

```javascript
render() {
    return (
        <div className="container">
            <h1 className="page-header">Docker Dashboard</h1>
            <DialogTrigger id="newContainerModal" buttonText="New container" />
            <ContainerListComponent title="Running" containers={this.state.containers} />
            <ContainerListComponent title="Stopped containers" containers={this.state.stoppedContainers} />

            <NewContainerDialog id="newContainerModal" onRunImage={this.onRunImage.bind(this)} />
        </div>
    )
}
```

Note how the id property of `DialogTrigger` is the same as the id property of `NewContainerDialog` - this is necessary in order for the trigger to understand that this is the dialog it needs to trigger.

Also note how the `onRunImage` property of the dialog component is defined - let's create that now:

```javascript
onRunImage(name: String) {
    socket.emit('image.run', { name: name })
}
```

Very simply, it just sends the name of the image to the server inside a message called 'image.run'. We can define that now by heading over to `server.js` and handling a new message alongside where we've created the others:

```javascript
socket.on('image.run', args => {
    docker.createContainer({ Image: args.name }, (err, container) => {
        if (!err)
            container.start((err, data) => {
                if (err)
                    socket.emit('image.error', { message: err })
            })
        else
            socket.emit('image.error', { message: err })
    })
})
```

Here we call out to the Docker API and its convenient `createContainer` method, passing in the image name that the user typed in. _This will not pull new images from the Docker Hub_ - it will only start new containers from existing images that exist on the local system. However, it can certainly be done - I'll leave it as an exercise for you, the reader, to complete in your own time.

If we're able to create the container, we'll start it. Remember our timer that we created earlier? Once the container starts, that timer will pick up the new container and display it to all the clients that are connected!

Finally, if there is an error we can send an 'image.error' message back to the socket that sent the original 'image.run' message, which will be useful for the user so that they are aware that something didn't work as expected. Let's head back to the app component for the final piece of the puzzle. Inside the constructor of the `app.tsx` component:

```javascript
socket.on('image.error', (args: any) => {
    alert(args.message.json.message)
})
```

Here we simply throw an alert if Docker encounters an error running the image. Armed with your new-found React knowledge, I'm sure you can now come up with some fancy UI to make this a lot prettier!

## Wrapping up

By now you should have a useful but somewhat basic Docker dashboard, and hopefully the journey has been worth it! With all the socket.io goodness, be sure to play around with loading your app from multiple sources, like your desktop browser and mobile phone, and watch them all keep in sync!

Some things you could continue on with to make it a lot more useful, include:

* Using the Docker API to pull images instead of simply running them
* Using the Docker API to stream the container logs to the client through Socket.io
* Extending the container dialog form to include options for port mapping, volumes, container name and more!
* .. and more
