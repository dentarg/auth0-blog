---
layout: post
title: "JavaScript for Microcontrollers and IoT: A Webserver"
description: "Up the ante using JavaScript to build a simple webserver with a microcontroller"
date: 2017-08-07 12:30
category: Technical Guide, IoT, JavaScript
author:
  name: Sebastián Peyrott
  url: https://twitter.com/speyrott?lang=en
  mail: speyrott@auth0.com
  avatar: https://en.gravatar.com/userimage/92476393/001c9ddc5ceb9829b6aaf24f5d28502a.png?size=200
design:
  bg_color: "#454A75"
  image: https://cdn.auth0.com/blog/iot-survey/logo-iot-survey3.png
  image_size: "100%"
tags:
- javascript
- microcontroller
- iot
- jerryscript
- internet-of-things
- photon
- particle
- particle-photon
- c
- c-language
- c-programming
- embedded
- embedded-javascript
- sensor
- sensor-hub
- web-server
- server
- http-server
- http
related:
- 2017-07-19-javascript-for-microcontrollers-and-iot-part-2
- 2017-06-21-javascript-for-microcontrollers-and-iot-part-1
---

In [our last post from the JavaScript for Microcontrollers and IoT series]() we talked about building a sensor hub. We succeeded, but our use of JavaScript remained small, in particular in contrast to the amout of C code that was necessary to write. In this post we take our sensor hub and expand it using JavaScript to act as a webserver in our local network. The webserver will display the readings from the sensors only for authenticated users. Will it be as easy as it looks? Read on to find out!

{% include tweet_quote.html quote_text="Make a webserver using JavaScript on a microcontroller!" %}

-----

## Introduction
In [our last post]() we finally used all the code we developed for the [first post]() for something useful. We created a small script that was in charge of reading values from sensors and then sending that information to different destinations. We sent the code to the cloud, to be handled by a [Webtask]() that in turn could do useful stuff with it (like sending an email when thresholds were exceeded), and we also sent the readings to a computer in the local network. However, there was no way for a user in the local network to simply take a look at the readings (unless they set up a webserver on a computer). We also came to the conclusion that the added complexity of setting up a JavaScript interpreter and then exposing the C API through it was simply not worth it for small scripts. Things could be different if the JavaScript code were bigger, or, in other words, if most of the development happened on the JavaScript side of things. So for this post we decided to run the experiment: let's write something bigger in JavaScript and see where that gets us.

## The Plan
We already have the sensor hub, so the next logical step is to have some way to see the readings from any smart device in the local network. One simple way to do that is to simply have a webpage served by the microcontroller. We could put the readings there!

Now, if you recall what we saw of the Particle API in previous posts, you may remember we did have TCP sockets and WiFi. That's great! However for this we are missing a key part of the puzzle: an HTTP server. But what we want to do should be simple enough, and luckily, HTTP is, for the most part, rather simple for small tasks like ours. Could be integrate a small HTTP server using JavaScript in our sensor-hub example? It turns out we can.

For our example we have decided to use [http-parser-js](), a JavaScript-only implementation of [Node's HTTP parser](). Node's HTTP parser is written in C, so we could actually use that instead, but the point of using JavaScript on a microcontroller is to write less error prone C code and more JavaScript. The JavaScript version should be simpler to use, as long as our interpreter is up to the task.

Using [http-parser-js]() we developed a small example that passes data from Particle's TCP API to the parser and then back to user-specified handlers, in the spirit of the rather simple Express library (although with a completely different, and much simpler API).

We also decided to add a small authentication screen to the sensor readings page. Since our example is only meant to run on the local network, as there is no SSL/TLS available on the Particle API yet, this is mostly for educational or testing purposes. For this we will use [auth0.js](), which let's us add authentication to a page with only a few lines of code.

An interesting side of adding authentication is actually having the microcontroller validate the credentials. Since [Auth0]() implements [OpenID Connect](), we will learn how to validate [JWT tokens]() on the microcontroller too! For this task we decided to use our clean-room implementation of [JWT HMAC signatures from the JWT Handbook](). Why? Because it has no external dependencies and it is very small. Of course, for production uses you should prefer a well tested library with better error handling and not an educational one. Still, this poses an interesting challenge for our interpreter of choice: [JerryScript]().

Some of the libraries we decided to use for this require [ECMAScript 2015](). [JerryScript](), the interepreter we have been using so far, only support ECMAScript 5.1, so we will also learn to use a transpiler and bundler to accomplish our mission. For this task we will be using [Rollup]() and [Babel](). Rollup produces very small code, and size is always important when working with microcontrollers.

To sum up:
- We will expand our JerryPhoton library to support inconming TCP connections (listening TCP sockets).
- We will parse HTTP requests using [http-parser-js]().
- We will write a small HTTP class that will read the HTTP request and dispatch it to the right handler.
- We will convert all the JavaScript code into a single bundle using only ECMAScript 5.1.
- We will embed an HTML web page inside our JavaScript code using Rollup and then serve it according to the HTTP request.
- We will validate JWTs to protect API endpoints using our educational, clean-room implementation of [HMAC signatures]() from the [JWT Handbook]().
- We will rely on [auth0.js]() to perform the authentication for us.

Looks like quite a ride, so buckle up!

## Implementation
### Incoming TCP Connections
The Particle API provides a convenient class to handle incoming TCP connections: [TCPServer](). Fortunately, `TCPServer` instances return `TCPClient` instances once the connection is established, so most of the hard work is already done in JerryPhoton (which provides a wrapper for `TCPClient` instances in JavaScriṕt). We just need to create a new JavaScript object to expose the functionality (`ṕhoton.TCPServer`) and include a single method in it: `available`.

This is simple enough:

```cpp
static jerry_value_t 
create_tcp_server(const jerry_value_t func,
                  const jerry_value_t thiz,
                  const jerry_value_t *args,
                  const jerry_length_t argscount) {
    jerry_value_t constructed = thiz;

    if(argscount != 1 || !jerry_value_is_number(*args)) {
        return jerry_create_error(JERRY_ERROR_COMMON,
            reinterpret_cast<const jerry_char_t*>("TCPServer: missing port"));
    }

    const uint16_t port = static_cast<uint16_t>(jerry_get_number_value(*args));

    // Construct object if new was not used to call this function
    {
        const jerry_value_t ownname = create_string("TCPServer");
        if(jerry_has_property(constructed, ownname)) {
            constructed = jerry_create_object();
        }
        jerry_release_value(ownname);
    }

    {
        const jerry_value_t name = create_string("available");
        const jerry_value_t func =
            jerry_create_external_function(tcp_server_available);
        
        jerry_set_property(constructed, name, func);
        
        jerry_release_value(func);
        jerry_release_value(name);
    }

    // Backing object
    TCPServer* server = new TCPServer(port);
    jerry_set_object_native_pointer(constructed, server, &server_native_info);

    return constructed;
}
```

And the `available` method:

```cpp
static jerry_value_t 
tcp_server_available(const jerry_value_t func,
                     const jerry_value_t thiz,
                     const jerry_value_t *args,
                     const jerry_length_t argscount) {
    TCPServer* server = NULL;
    const jerry_object_native_info_t *native_info = NULL;
    
    jerry_get_object_native_pointer(thiz, 
        reinterpret_cast<void**>(&server), &native_info);
    
    if(native_info != &server_native_info) {
        return jerry_create_error(JERRY_ERROR_TYPE,
            reinterpret_cast<const jerry_char_t*>(
                "TCPServer.available called with wrong this pointer"));
    }

    TCPClient* client = new TCPClient(server->available());
    jerry_value_t jsclient = jerry_create_object();

    build_tcp_client_object(jsclient, client);

    return jsclient;
}
```

> If you don't understand the signatures of these C++ functions read the [first post in this series, where we explore the integration of JerryScript on the Particle Photon]().

We can now use this object from within JavaScript like so:

```javascript
var server = photon.TCPServer(80);
while(true) {
    var client = server.available();
    if(client.connected()) {
        // Do something with the client
    }
}
```

### Transpiling and Bundling Code
Before starting to work with our JavaScript code, we need to set up a way to bundle everything in a single JavaScript file so we can easily include it in our project. We also need a transpiler to convert ECMAScript 2015 code to ECMAScript 5.1 code. Let's take a look at how to do that with [Rollup]() and [Babel]().

Rollup's main feature is to let you mix up JavaScript code with different module systems. In particular, Rollup was conceived to handle integration between CommonJS modules and ECMAScript 2015 modules seamlessly. There are other module bundlers that can do this, like [Webpack](), but Rollup is very simple to configure for minimum code size with the least possible amount of added support code in the resulting bundle. Our Rollup configuration is as follows:

```javascript
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import cjs from 'rollup-plugin-commonjs';
import strip from 'rollup-plugin-strip';
import html from 'rollup-plugin-html';
import uglify from 'rollup-plugin-uglify';
import { minify } from 'uglify-es';


export default {
  entry: './main.js',
  format: 'es',
  dest: './dist/main.bundle.js',
  useStrict: false,
  plugins: [
    html({
      include: '**/*.html',
      htmlMinifierOptions: {
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        conservativeCollapse: true,
        minifyJS: true
      }
    }),
    strip({
      debugger: true
    }),
    resolve(),
    cjs(),
    babel({
      exclude: 'node_modules/**', // only transpile our source code
      presets: ['es2015-rollup']
    }),
    uglify({}, minify)
  ],
};
```

As you can see we are using a number of plugins. These plugins give us the following functionality:

- **node-resolve**: let's us resolve packages from within `node_modules`.
- **babel**: converts ECMAScript 2015 code to ECMAScript 5.1 code. We are using the `es2015-rollup` babel preset that basically converts everything to ECMAScript 5.1 except the module declarations. These declarations are handled internally by Rollup.
- **commonjs**: handles `require` and `module.exports` usage from within modules.
- **strip**: removes the use of common debugging calls like `assert`. We do not want (to save space) nor have that functionality in our interpreter so we need to remove that.
- **html**: takes an HTML file and embeds it in the bundle inside a string. We will use this to integrate our webpage inside our bundle.
- **uglify**: space is everything: we need to keep the size of the bundle as small as possible, so [Uglify]() can help us to achieve that. Uglify does not support ECMAScript 2015 modules yet, so we need to use a specific minifier that can do that: that is what `uglify-es` provides.

With this pipeline we will get a single JavaScript file with all we need. If you want to take a look at how the resulting code compares to the original code, comment the `uglify` call in the `plugins` array. The resulting code is pretty readable and has very little added support code.

#### Wait, how are we going to upload this to the microcontroller?
Another thing we need is to find a way to get the bundle into the microcontroller. We will now be working with larger amounts of code, so we cannot use the simple upload functionality we developed in [post 1](). The upload functionality allowed us to dynamically run JavaScript code sent through a TCP socket. This was great, but to do so the code was first copied into RAM and then run from there. The Particle Photon does not have too much RAM, son we cannot waste it by keeping our script there. Fortunately there is way to embed our JavaScript bundle into the ROM!

The Particle API does not have a concept of a file or resource system, therefore anything that must be available to the C code in form of data must also be included in the code itself. Fortunately for us this is very easy to do with some minor shell scripting. Once we have the JavaScript bundle we can convert it to a C-array using `xxd`, a tool to produce textual binary dumps. `xxd` conveniently provides an option to produce C-arrays as output.

Here's the whole JavaScript source to JavaScript bundle to C-array pipeline:

```sh
cd js
echo 'Are npm packages installed?'
if [ ! -d node_modules ]; then
    echo 'Nope, installing npm packages.'
    npm install
fi
echo 'Yes, building JavaScript bundle using Rollup.'
node_modules/rollup/bin/rollup -c

cd dist
echo 'Putting JavaScript bundle into a C array.'
xxd -i main.bundle.js > ../../src/main.bundle.h
cd ../..

echo 'Making bundle C array static const.'
sed -i -e 's/^unsigned/static const/' src/main.bundle.h
```

The last command, `sed`, is necessary because we want to make sure our C-array gets stored in ROM and not in RAM. To tell the C compiler that, we need to make the array `static` and `const`. We also change the type from `unsigned char` to just `char`. This makes no difference for the data in it and matches the signature of the `jerryphoton::eval()` function.

### Integrating the HTTP Parser
The first library that we are goint to integrate is the HTTP parser ([http-parser-js]()). This library is a simple JavaScript-only HTTP parser meant to work as a drop-in replacement for Node.js's C-based parser. It provides the exact same JavaScript API. However, since this parser was written with Node in mind, certain minor adaptations must be performed before we can use it in JerryScript. We'll talk about them here.

The first and biggest change has to do with the use of Node's `Buffer` object. `Buffer` is a Node-specific object and we can't use it here. There are two ways we could fix this here: we can rely on JerryScript's limited support for ECMAScript 2015's `TypedArray`, or we can use JavaScript strings. After taking a look at the code that uses `Buffer` we decided to go the `String` route. Let's take a look at the code:

```javascript
HTTPParser.prototype.consumeLine = function () {
  var end = this.end,
      chunk = this.chunk;
  for (var i = this.offset; i < end; i++) {
    if (chunk[i] === 0x0a) { // \n
      var line = this.line + chunk.toString('ascii', this.offset, i);
      if (line.charAt(line.length - 1) === '\r') {
        line = line.substr(0, line.length - 1);
      }
      this.line = '';
      this.offset = i + 1;
      return line;
    }
  }
  //line split over multiple chunks
  this.line += chunk.toString('ascii', this.offset, this.end);
  this.offset = this.end;
};
```

Fortunately for us this is the only function where `Buffer` is used. The variable `chunk` is a `Buffer`. The methods used are array access (`chunk[i]`) and `chunk.toString('ascii', ...)`. These uses are very simple to adapt to `String`:

```javascript
HTTPParser.prototype.consumeLine = function () {
  var end = this.end,
      chunk = this.chunk;
  for (var i = this.offset; i < end; i++) {
    if (chunk.charCodeAt(i) === 0x0a) { // \n
      var line = this.line + chunk.substring(this.offset, i);
      if (line.charAt(line.length - 1) === '\r') {
        line = line.substr(0, line.length - 1);
      }
      this.line = '';
      this.offset = i + 1;
      return line;
    }
  }
  //line split over multiple chunks
  this.line += chunk.substring(this.offset, this.end);
  this.offset = this.end;
};
```

We use `chunk.charAt` and `chunk.substring`. This will work for our simple usage.

Since we performed modifications to `http-parser-js` we included it in our code rather than use the version from `node_modules`.

### The HTTP Class
To process HTTP requests we will write a simple JavaScript class that will use `http-praser-js` and then call a user-defined handler with the parsed request. Since we are using `Babel` we will write an ECMAScript 2015 class:

```javascript
export default class HTTP {
    constructor(tcpClient, handler) {
        this.client = tcpClient;
        
        this.parser = new HTTPParser('REQUEST');
        
        this.parser[HTTPParser.kOnHeadersComplete] = info => {
            handler(this, info.headers, info.method, info.url);
        };
    }

    process() {
        if(this.client.available() === 0) {
            return;
        }

        this.parser.execute(this.client.read());
    }

    isConnected() {
        return this.client.connected();
    }

    sendHtml(html) {
        sendResponse(this.client, 200, 'html', html);
    }

    sendJson(json) {
        sendResponse(this.client, 200, 'json', json);
    }

    send401() {
        sendResponse(this.client, 401);
    }

    close() {
        this.client.stop();
    }
}
```

The `HTTP` class takes a Particle `TCPClient` object and a JavaScript function as constructor parameters. When the `process` method is called, if an HTTP request is completely parsed, the handler will be called. If the HTTP request is not completely present in the `TCPClient` buffer, the state will be preserved for future calls (that is, one must call `process` repeatedly until the request is completely processed). The handler will receive the HTTP object, the headers, the name of the HTTP method and the full URL of the request.

The `HTTP` class also provides a couple of simple methods for sending responses: `sendHtml`, `sendJson` and `send401`. The `sendResponse` private function handles all the work:

```javascript
function sendResponse(client, status, type, data) {
    const msg = `HTTP/1.1 ${getStatus(status)}\r\n` + 
                `Server: Custom\r\n` + 
                getDataHeaders(type, data) +
                `Connection: Closed\r\n\r\n`;

    client.write(msg);
    
    if (data) {
        const chunkSize = 256;
        for(let bytes = 0; bytes < data.length; bytes += chunkSize) {
            const chunk = data.substr(bytes, chunkSize);
            
            for (let written = 0; written < chunk.length;) {
                written += client.write(chunk.substring(written));
                //photon.log.trace(written);
                photon.process();
            }
        }        
    }
}
```

You may have noticed that the part of this function that writes to the socket is a bit contrived. This is necessary to keep RAM usage withing acceptable levels. Since we will be using this function to send an HTML page to a browser, depending on the size of the HTML page, it may be necessary to create a very big buffer to send the data (data from the JavaScript side is copied in the C side). To keep this at reasonable levels, we send the data in chunks: one 256-byte chunk at a time. You can experiment with different sizes of chunks, but we found that for our simple usage, this worked without problems.

### The JWT Decoding and Verification Functions
As we mentioned before, we are going to use the basic JWT decoding and verification functions from the [JWT Handbook](). These functions are clean-room implementations of all the algorithms, down to `Base64` encoding. These functions were written for educational purposes and are not ideal from a performance and security point of view. However, they are very small and the code is clear enough to be easily debugged. 

> Disclaimer: do not use these functions in production, they were not tested in the wild and are only meant for educational purposes. Clarity of implementation was the main criteria used when they were written.

The clean room implementation of HMAC signatures used in the [JWT Handbook]() relies heavily on ECMAScript 2015 features. In particular, `TypedArray` classes are used everywhere. Fortunately for us JerryScript developers are already working on an implementation of typed arrays. However, at the time we wrote this, the implementations were incomplete. Nonetheless they are perfectly usable with a couple of adaptations. We also relied on ECMAScript 2015 new methods for `String`. These are also easy to replace. Let's take a look:

#### String
The only `String` method that was used from ECMAScript 2015 is `endsWith`. This method takes a string and checks whether the string used as `this` ends with the specified string. If it does, it returns `true`, otherwise it returns `false`.

JerryScript appears to be designed in such a way that changing the prototypes of built-in objects does not work correctly. Although this practice is frowned upon, it is sometimes useful. In this case we are trying to provide a polyfill, so it would certainly make sense to be able to do something like this. In any case, we can still provide free functions to do the same.

```javascript
export function endsWith(thiz, str) {
    var idx = thiz.indexOf(str);
    if(idx === -1) {
        return false;
    }
    return (idx + str.length) === thiz.length;
}
```

Unfortunately this means we must now find all uses of `endsWith` and change them. You can find this function in `utils.js`.

#### TypedArray
The [JWT Handbook]() examples make use of two unimplemented methods in JerryScript: `set` and `fill`. The `set` method provides a way to set the contents of a typed array with the elements from another array (either a common array or a typed array). The `fill` method, on the other hand, sets a number of elements all to the same value.

```javascript
export function fill(arr, elem) {
    for(var i = 0; i < arr.length; ++i) {
        arr[i] = elem;
    }
}

export function set(target, source, offset) {
    var off = offset ? offset : 0;
    for(var i = 0; (i < source.length) && ((i + off) < target.length); ++i) {
        target[i + off] = source[i];
    }
}
```

Just like what happened with `String`, JerryScript does not allow us to modify the prototype of the `TypedArray` object, thus it is necessary to provide free functions as polyfills and then change the code manually.

You can find these functions in `utils.js`.

#### Bugs
It would appear that the version of JerryScript that we used for this example has a bug in the implementation of `TypedArray.of`. For this reason, we repĺaced all uses of `TypedArray.of` for code like this:

```javascript
const h_ = new Uint32Array(8);
set(h_, [
    0x6a09e667,
    0xbb67ae85,
    0x3c6ef372,
    0xa54ff53a,
    0x510e527f,
    0x9b05688c,
    0x1f83d9ab,
    0x5be0cd19
]);
```

### The HTTP Request Handler
The main business logic of our application is the HTTP request handler, which ties all other parts together. The handler takes an HTTP request and dispatches it to the right functions to act according to the URL. All of this code is located in our `main.js` function. Let's take a look:

```javascript
import * as sensors from './sensors.js';
import HTTP from './http.js';
import page from './index.html';
import { jwtVerifyAndDecode } from './hs256.js';

// (...)

function handler(http, headers, method, url) {
    if(url.indexOf('/get-sensor-data') !== -1) {
        sendSensorData(http, headers);
    } else {
        http.sendHtml(page);
    }
}

const server = photon.TCPServer(80);
let httpClients = [];
setInterval(() => {
    httpClients.push(new HTTP(server.available(), handler));
    
    const connected = [];
    httpClients.forEach(client => {
        client.process();

        if(!client.isConnected()) {
            return;
        }

        connected.push(client);        
    });

    // Discard disconnected clients.
    httpClients = connected;
}, 0);
```

Here we see we have a function that gets repeatedly executed as fast as possible after giving the system some time to process other stuff. The function checks whether there is a new connection available, and if there is and it remains connected, it attempts to read data from it. This is done for all active connections, which are stored inside the `httpClients` array. All disconnected TCP connections are discarded after each loop (and collected by the garbage collector eventually). A new instance of the`HTTP` class is created for each new connection. The handler for HTTP requests is the `handler` function, which simply checks for one of two endpoints: the main page, and the endpoint that returns sensor data. The `page` variable is where the HTML file the serves as our main page is stored as a string.

Other functions from the `main.js` file:

```javascript
// Get this from https://manage.auth0.com/#/apis
const secret = 'test';
const audience = '/get-sensor-data';
const issuer = 'https://speyrott.auth0.com/';

sensors.startReports();

function validateJwt(headers) {
    try {
        const idx = headers.indexOf('ACCESS-TOKEN');
        if(idx === -1) {
            return false;
        }

        const decoded = jwtVerifyAndDecode(headers[idx + 1], secret);
        
        return decoded.valid && 
               decoded.payload.aud == audience &&
               decoded.payload.iss == issuer;
    } catch(e) {
        return false;
    }
    return false;
}

function sendSensorData(http, headers) {
    if(!validateJwt(headers)) {
        http.send401();
        http.close();
        return;
    }

    http.sendJson(JSON.stringify(sensors.getLastReport()));
}
```

### The Web Page
The web page is really simple. Of course you could make something much more pleasing from an aesthetic point of view. The page displays a text introduction, and then either a login button, or the report from the sensors in textual form. The web page periodically requests new sensor data using `XMLHttpRequest`. Let's see how it works.

> **DISCLAIMER**: since there is no SSL/TLS support on the Particle Photon this page is NOT secure. All tokens are sent in the clear. Do not use this example outside of your local network, or even inside your local network if you need to keep tokens secure.

```html
<!DOCTYPE html>
<html>

<head>
    <title>Local Sensors</title>
    <script src="https://cdn.auth0.com/js/auth0/8.8.0/auth0.min.js"></script>
</head>

<body>
    <p>Hello, this is your local sensors report</p>
    <p>BEWARE: this example should only be used on trusted networks! NO SSL/TLS IS IN PLACE, TOKENS TRAVEL IN THE CLEAR IN YOUR LOCAL NETWORK.</p>
    
    <button id="login-button" onclick="loginClicked()">Login</button>
    
    <div id="sensors-report">
        <p>
            <span style="font-weight: bold">Movement: </span>
            <span id="sensor-movement"></span>
        </p>
        <p>
            <span style="font-weight: bold">Flame: </span>
            <span id="sensor-flame"></span>
        </p>
        <p>
            <span style="font-weight: bold">Humidity: </span>
            <span id="sensor-humidity"></span>
        </p>
        <p>
            <span style="font-weight: bold">Temperature: </span>
            <span id="sensor-temperature"></span>
        </p>
        <p>
            <span style="font-weight: bold">Gas: </span>
            <span id="sensor-gas"></span>
        </p>
        <p>
            <span style="font-weight: bold">
                Time since last alarm in milliseconds: 
            </span>
            <span id="sensor-time-since-alarm"></span>
        </p>
    </div>

    <button id="logout-button" onclick="logoutClicked()">Logout</button>

    <!-- ... -->
</body>
</html>
```

The HTML page embeds a small script to do all its magic. The script checks whether the user has logged in previously and shows or hides the necessary elements according to that:

```javascript
const accessToken = localStorage.getItem('access_token');

// (...)

if(accessToken) {
    loginButton.style.display = 'none';
    logoutButton.style.display = 'block';
    report.style.display = 'block';

    if(!refreshInterval) {
        setInterval(refresh, 2000);
    }
} else {
    loginButton.style.display = 'block';
    logoutButton.style.display = 'none';
    report.style.display = 'none';

    if(refreshInterval) {
        clearInterval(refreshInterval);
    }
}
```

The `refresh` function gets the sensor data using the access token and then updates the DOM accordingly:

```javascript
function refresh() {
    httpGet('/get-sensor-data', accessToken).then(data => {
        try {
            const sensors = JSON.parse(data);
            
            sensorMovement.innerHTML = sensors.data.movement ?
                'detected' : 'undetected';
            
            sensorFlame.innerHTML = sensors.data.flame ? 
                'detected' : 'undetected';
            
            sensorHumidity.innerHTML = 
                sensors.data.humidity.toString() + '%';
            
            sensorTemperature.innerHTML = 
                sensors.data.temperature.toString() + ' Celsius';

            sensorGas.innerHTML = sensors.data.gas.toString();

            sensorTimeSinceAlarm.innerHTML = 
                sensors.timeSinceLastAlarmMs.toString() + 'ms';
        } catch(e) {
            console.log(e);
        }
    }).catch(status => {
        if(status === 401) {
            logoutClicked();
        }
    });
}
```

The `httpGet` function is a simple wrapper around `XMLHttpRequest`:

```javascript
function httpGet(url, accessToken) {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();            
        
        request.onreadystatechange = () => { 
            if(request.readyState !== XMLHttpRequest.DONE) {
                return;
            }

            if(request.status === 200) {
                resolve(request.responseText);
            } else {
                reject(request.status);
            }
        }
        
        request.open("GET", url, true);
        request.setRequestHeader('ACCESS-TOKEN', accessToken);
        request.send();
    });
}
```

And last but not least there's Auth0 authentication:

```javascript
// Get this from https://manage.auth0.com/#/clients
const auth0Client = new window.auth0.WebAuth({
    domain: "speyrott.auth0.com",
    clientID: "5OzskonPwTAikfl1pIexAZYPuJN65WmK"
});

function parseHash() {
    const re = /access_token=(.*?)&/;
    const match = re.exec(window.location);
    if(match) {
        localStorage.setItem('access_token', match[1]);
        document.location.href = '/';
    }
}

function loginClicked() {
    auth0Client.authorize({
        audience: '/get-sensor-data',
        scope: 'read:sensors',
        responseType: 'token id_token',
        redirectUri: 'http://192.168.1.134/'
    });
}

function logoutClicked() {
    localStorage.removeItem('access_token');
    window.location.reload();
}

parseHash();
```

By using the [auth0.js]() library, authentication and authorization is just a matter of calling `auth0client.authorize`. This will send the user to the Auth0 login page. After the user is authenticated, the authorization server will redirect the user back to our sensor site with the right access token for our API. This is what our `parseHash` function does: it gets the token from the URL and stores it in local storage.

To use Auth0 you will first need to perform a couple of simple steps, which we describe below.

#### Setting Up Auth0
To use Auth0 to authenticate, authorize and get an access token for our API we need to perform two steps: first we need to create a client (this identifies our client application to the authorization server), and second we need to create an API endpoint so that we can request access tokens for it. If you haven't signed up for Auth0, [sign up now](javascript:signup\(\)). You can use the free tier for this example!

##### Create a Client
1. Go to the [Auth0 dashboard]() and select [Clients](https://manage.auth0.com/#/clients).
2. Click on `Create Client`.
3. Choose a name and put it in the text field near the top.
4. Select `Regular Web Applications`.
5. Select `Settings`.
6. You will now see your `Auth0 Domain` and `Auth0 Client ID` on the screen. Take note of these and set them in both `index.html` and `main.js`.
7. Go down and find the `Allowed Callback URLs` field. Set the IP address of your Particle Photon there as an URL. Example: `http://192.168.1.134/`. You should make sure the Particle Photon gets assigned the same IP address always (most modern WiFi routers keep track of this).

##### Create an API endpoint
1. Go to the [Auth0 dashboard]() and select [APIs](https://manage.auth0.com/#/apis).
2. Click on `Create API`.
3. Choose a name. In the `Identifier` field put `/get-sensor-data`. This is what the access token will carry in the `aud` (audience) claim. For the algorithm pick `HS256`. Click on `Create`.
4. Go to `Settings` and take note of the `signing secret`. Set it in `main.js`.

That's it! Once you have done this Auth0 is ready to use.

### Finishing Touches
To be able to run this example another minor change was required with regards to post 2. We had to slightly increase the heap size for JerryScript. Fortunately, there still is some free RAM in the Photon. Heap size is now set to 42KB, you can see this in `Makefile.particle`. That's right, this whole example uses less than 42KB of RAM, and its running on JavaScript!

Another change that was necessary was to enable typed arrays and regular expressions in JerryScript. Typed arrays are used by the JWT libraries, and regular expressions by the HTTP parser. Even so, RAM use remains really low! You can see these changes in `custom.profile`, the JerryScript profile used for this example.

Let's see it in action!

<video width="600" controls src=""></video>

[Get the full code]() for this example. If you need help flashing the compiled firmware, [refer to the previous post]().

### Conclusion
In our previous post we managed to get something useful running on JavaScript but we didn't really develop a full fledged application. For this post, however, we upped the ante and managed to run our own webserver doing most of the work using only JavaScript. We handled connections, HTTP parsing, request dispatching, and JWT validation with HS256 (HMAC + SHA256). We also integrated a Node library (`http-parser-js`) and wrote all of our code using ECMAScript 2015 with modules. The result is over 1000 lines of JavaScript, or around 15KiB of minified JavaScript. This all runs on a 120MHz ARM CPU and uses less than 42KB of RAM!

The development experience was not without trouble. JerryScript remains rough in the edges for now. Some constructs are not handled correctly (for example, the common immediately invoked function expression appears to fail), typed arrays remain incomplete, and using polyfills by adding or changing methods in a prototype does not work as expected. These are all common patterns or tools in the JavaScript world, and there may be more small differences in behavior between it and the more powerful V8 or SpiderMonkey implementations.

So now that we have gone over the experience of developing something bigger using JavaScript, has it changed our opinion from the last post that JavaScript only makes sense for microcontrollers if you don't need to fall back to C often? To be honest, no, it has not changed. Using existing libraries has been tremendously helpful, but we still had to debug them and find out the very specific differences between JerryScript and other more common JavaScript engines. This took some time. We also estimate that the performance of doing HTTP parsing and JWT decoding and verification on an interpreter is much slower than doing them in C code. For our case it has not resulted in problems, but bigger codebases may struggle to be performant. Things may be different using a different JavaScript engine. What we have seen so far is very good, but not entirely production ready. Using JavaScript through JerryScript on the Particle Photon remains an interesting option for smaller teams or hobbyists.

In our next post we will take a look at the [ESP8266]() (finally) and [Espruino](), a different firmware that comes with an integrated JavaScript interpreter and most of its API already exposed through it. We will see if a different development environment results in a more "production-ready" experience. Until then, hack on!
