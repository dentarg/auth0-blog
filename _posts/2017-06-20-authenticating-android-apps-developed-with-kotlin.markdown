---
layout: post
title: "Authenticating Android Apps Developed with Kotlin"
description: "Let's learn how to develop a simple, but secure, Android application with Kotlin."
date: 2017-06-20 09:45
category: Technical Guide, Mobile, Android
author:
  name: "Bruno Krebs"
  url: "https://twitter.com/brunoskrebs"
  mail: "bruno.krebs@auth0.com"
  avatar: "https://www.gravatar.com/avatar/76ea40cbf67675babe924eecf167b9b8?s=60"
design:
  bg_color: "#7370B3"
  image: https://cdn.auth0.com/blog/create-kotlin-app/logo.png
tags:
- android
- kotlin
- authentication
- security
related:
- 2016-02-08-how-to-authenticate-on-android-using-social-logins
- 2015-06-29-using-smartlock-on-android-in-3-simple-steps
---

**TL;DR:** On today's post we are going to learn how to create a simple Android application, written with Kotlin, and secure it with JWTs. We are going to use Auth0 to issue authentication tokens for us, and will use one of the `access_token` to communicate with an API. In the end, we will also talk about how we would handle tokens issued by a home made solution, instead of Auth0.

## Is Kotlin a Good Choice for Android Development?

Last May, at the Google I/O keynote, [the Android team announced first-class support for Kotlin](https://blog.jetbrains.com/kotlin/2017/05/kotlin-on-android-now-official/). So, yes, Kotlin is a very good choice for Android development. Otherwise the Android team would never make a move like that. Besides that, [for the last 4 years, Android Studio has been based on the IntelliJ Platform](https://blog.jetbrains.com/blog/2013/05/15/intellij-idea-is-the-base-for-android-studio-the-new-ide-for-android-developers/). For those who don't know, [IntelliJ](https://www.jetbrains.com/idea/) is a product from [JetBrains](https://www.jetbrains.com/), the same creator of the Kotlin programming language. As such, we can rest assured that, when choosing Kotlin for our next project, the development experience will be smooth.

## How Kotlin Differs From Java?

Kotlin is a whole new programming language with a different syntax. A Java developer won't have that much trouble when reading a project's source code written in Kotlin, but there are many differences, and many cool features that Java developers should learn before diving into Kotlin.

If you have never used Kotlin before, you can still follow this blog post along, as it won't have that much advanced subjects. But, for the sake of completeness, here it is a list of resources where you can learn more about Kotlin:

- [Kotlin Reference](https://kotlinlang.org/docs/reference/)—where the details of Kotlin's syntax are explained
- [Try Kotlin](https://try.kotlinlang.org)—where you can do some hands on practices to learn Kotlin.
- [Kotlin in Action](https://manning.com/books/kotlin-in-action)—if you want to dive deep into this new language

Besides that, be aware that JetBrains has been investing a lot on tools to help Java developers migrate to Kotlin. For example, IntelliJ and Android Studio 3.0 both are shipped with a tool that automatically translates Java source code to Kotlin.

## Developing an Android App with Kotlin

To start a new project, you can take advantage of the *Create New Project* wizard that comes with Android Studio. Its usage is quite simple, and just a few steps are needed, [as shown in this tutorial](https://kotlinlang.org/docs/tutorials/kotlin-android.html). But, to speed things up, we are going to [clone this repository](https://github.com/auth0-blog/kotlin-app) in our local machine.

```bash
git clone https://github.com/auth0-blog/kotlin-app.git
```

After that we are going to open it on Android Studio through the *Open an existing Android Studio project* option:

![Open an existing Android Studio project](https://cdn.auth0.com/blog/kotlin-android/open-project.png)

If it is the first time that you are using Android Studio, you will also need to install an Android emulator or, if you own an Android device, integrate it with the IDE. I had no trouble installing a new Android emulator locally through the IDE, and you probably won't either. But, for whatever reason, if you find yourself stuck, you can [check this resource to see if it helps](https://developer.android.com/training/basics/firstapp/running-app.html).

To guarantee that everything is working as expected, let's start the application as it is. This can be done through the *Run app* button (a green play button on the top of the IDE) and will launch the app on the chosen emulator (or on your own device) with a *Hello World!* message.

![Hello World with Kotlin](https://cdn.auth0.com/blog/kotlin-android/hello-world-kotlin-nexus.png)

## What Will We Build With Kotlin

As mentioned, we are going to build a simple application. This application will consist of three features:

1. A list of To Do items. This list will be fetched from a RESTful API that will be publicly available.
2. An input text and a button to allow users to add new items to the existing list. This will be available only to logged in users.
3. Sign in and sign up functionality provided by Auth0. We are going to get an `access_token` from Auth0 and will use it to interact with the endpoint that accepts new items.

### Booting Up the RESTful API

The RESTful API that we are going to use is an Express application that [can be found here](https://github.com/auth0-blog/nodejs-auth0/). Therefore, before starting developing the features mentioned with Kotlin, we are going to need to clone this repository.

```bash
git clone https://github.com/auth0-blog/nodejs-auth0/
cd nodejs-auth0
npm install
```

As our RESTful API will be protected by Auth0, we are going to [sign up](javascript:signup\(\)) for a new *free* account now (i.e. if we don't already have one). As Auth0 manages identity based on standards, like OAuth and OpenID Connect, we will follow the best practices and [create an API representation of our backend in the web-based management tool](https://manage.auth0.com/#/apis). On this page, let's click the *Create API* button and fill the form as shown below:

![Creating API Auth0](https://cdn.auth0.com/blog/kotlin-android/create-api-auth0.png)

The first field in this form, called *Name*, is just a friendly name in the tool and its value won't matter to us. The second field, *Identifier*, is the audience of our API. We are going to use this value when configuring our backend and also our Kotlin Android app. The last field, *Signing Algorithm*, defines how our tokens will be signed. *RS256* uses a private key to sign tokens and a public key to validate it. To learn more about how the signing process works, [take a look at this article](https://auth0.com/blog/navigating-rs256-and-jwks/).

Auth0 will also create a test client when we finish creating our API. If we head to the [*Clients*](https://manage.auth0.com/#/clients) menu we will see a client called *Kotlin To Do App (Test Client)*. Let's access this client to copy the *Domain* value from it.

![Test client created by Auth0](https://cdn.auth0.com/blog/kotlin-android/test-client.png)

With this value we will be able to run our RESTful API. In the root directory of the cloned repository, let's issue the following commands:

```bash
export AUTH0_AUDIENCE=kotlin-todo-app
export AUTH0_DOMAIN=krebshaus.auth0.com
export AUHT0_ALGORITHM=RS256

node index
```

Be aware that the values exported above refer to my own account at Auth0. Your value for the `AUTH0_DOMAIN` environment variable will diverge for sure. The other two values, `AUTH0_AUDIENCE` and `AUHT0_ALGORITHM`, will be the same as mine, if you didn't change anything while configuring the API.

After running the last command, `node index`, our RESTful API will be up and running. We can issue two simple requests to test it:

```bash
# get To Do items
curl http://localhost:8080
# which will result on: ["Feed the dogs","Mow the lawn","Buy pizza"]

# try to post a new item without an authorization token
curl -d 'new item' -X POST -v http://localhost:8080
# which will result on a 401 status code (unauthorized)
```

## Consuming the RESTful API with Kotlin

To start developing our Kotlin To Do application for Android, we are going to tackle the communication with the backend first. To interact with out RESTful API, we are going to need to make three changes in our project. First, we will need to add a dependency to [Volley](https://developer.android.com/training/volley/index.html). This can be achieved by changing the `./app/build.gradle` file like that:

```bash
apply plugin: 'com.android.application'
apply plugin: 'kotlin-android'

// ...

dependencies {
    // ...
    compile 'com.android.volley:volley:1.0.0'
}

// ...
```

The second change that we will need is to explicitly define that our Android app will use internet connection. This will be done by editing the `./app/src/main/AndroidManifest.xml` file as follows:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.auth0.samples.kotlinapp">

    <uses-permission android:name="android.permission.INTERNET" />

    <!-- ... -->

</manifest>
```

After defining the *Volley* dependency and that our app needs permission to use the internet, we will create an utility class that will handle all the interaction with our backend. We will define this class as a sibling to the `MainActivity` class, calling it `ToDoAPIUtils.kt`, with the following code:

```kotlin
package com.auth0.samples.kotlinapp

import android.app.Activity
import android.widget.ArrayAdapter
import android.widget.ListView
import android.widget.Toast
import com.android.volley.Request
import com.android.volley.RequestQueue
import com.android.volley.Response
import com.android.volley.toolbox.JsonArrayRequest
import org.json.JSONArray

val ENDPOINT = "http://10.0.2.2:8080/"

fun getItems(activity: Activity, queue: RequestQueue, listView: ListView) {
    val jsonArrayRequest = JsonArrayRequest(Request.Method.GET, ENDPOINT, null,
            Response.Listener<JSONArray> { response ->
                val list = ArrayList<String>()

                (0 until response.length()).mapTo(list) {
                    response[it].toString()
                }

                val adapter = ArrayAdapter(activity,
                        android.R.layout.simple_list_item_1, list)
                listView.adapter = adapter
            },
            Response.ErrorListener { error ->
                Toast.makeText(
                        activity.applicationContext,
                        error.toString(),
                        Toast.LENGTH_SHORT).show()
            }
    )
    //add getItems to queue
    queue.add(jsonArrayRequest)
}
```

This file will contain a single function (for now) that will issue `GET` requests to the backend and populate a `ListView` with the response. Note that in [Kotlin functions can be declared at top level in a file](https://kotlinlang.org/docs/reference/functions.html#function-scope), meaning you do not need to create a class to hold a function.

Another important aspect of the code above is that the `ENDPOINT` is hard-coded to `http://10.0.2.2:8080/`. If you are not using an emulator, you might need to change this value to the local `IP` address of your computer.

### Rendering To Do Items

As we already have the function that will retrieve items from our backend, we need now to use it to render them to the user. Since the list of items is publicly available, we are going to show it on the first view, the `activity_main.xml` layout that is referenced by the `MainActivity`. Let's define the contents of this file as follows:

```xml
<?xml version="1.0" encoding="utf-8"?>
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout android:orientation="vertical"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    xmlns:android="http://schemas.android.com/apk/res/android">

    <ListView xmlns:android="http://schemas.android.com/apk/res/android"
        android:id="@+id/list_todo"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content" />

</LinearLayout>
```

Afterwards, we will update the `MainActivity` with the following code:

```kotlin
package com.auth0.samples.kotlinapp

import android.os.Bundle
import android.support.v7.app.AppCompatActivity
import android.widget.ListView
import com.android.volley.toolbox.Volley

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // setting up a Volley RequestQueue
        val queue = Volley.newRequestQueue(this)

        // getting a reference for the ListView
        val listToDo = findViewById(R.id.list_todo) as ListView

        // passing the activity, the queue and the ListView to the function
        // that consumes the RESTful endpoint
        getItems(this, queue, listToDo)
    }
}
```

This is the last change that we need to make on our application to see the list of to-do items. Let's run the app on the emulator (or on our own device) to see it.

![To Do list running on Android](https://cdn.auth0.com/blog/kotlin-android/todo-list.png)

## Securing Kotlin App with Auth0

As we already rendered the public list of to-do items in our app, we are now going to work on the authentication layer. This will enable our users to log into our app (and sign up as well), which will generate two JWTs (JSON Web Tokens). The first JWT represents the user and is called `id_token`. The second JWT, `access_token`, will be used to communicate with the backend. This `access_token` will be validated by our backend to allow or deny users to add new items to the to-do list.

To integrate our app with Auth0, we need to add a dependency to [this open-source library](https://github.com/auth0/Auth0.Android). We do this by changing the `./app/build.gradle` file as follows:

```bash
// ...

android {
    // ...
    dataBinding {
        enabled = true
    }
}

dependencies {
    // ...
    kapt "com.android.databinding:compiler:3.0.0-alpha4"
    compile 'com.auth0.android:auth0:1.8.0'
}

// ...
```

Besides adding the new dependency, we have also configured our application to use [data binding](https://developer.android.com/topic/libraries/data-binding/index.html), which will be used to define when certain components must be rendered or hidden. The Auth0 library exposes an interface called `AuthCallback` that we will need to implement in order to handle the results of the sign-in and sign-up attempts. To define our own implementation we will create a file called `AuthenticationHandler.kt`, as a sibling to the `MainActivity` class, with the following source-code:

```kotlin
package com.auth0.samples.kotlinapp

import android.app.Dialog
import android.content.Context
import android.widget.Toast
import com.auth0.android.authentication.AuthenticationException
import com.auth0.android.provider.AuthCallback
import com.auth0.android.result.Credentials

class AuthenticationHandler(val context: Context) : AuthCallback {
    override fun onFailure(dialog: Dialog) {
        val text = "Ops, something went wrong!"
        Toast.makeText(context, text, Toast.LENGTH_SHORT).show()
    }

    override fun onFailure(exception: AuthenticationException) {
        val text = "Ops, something went wrong!"
        Toast.makeText(context, text, Toast.LENGTH_SHORT).show()
    }

    override fun onSuccess(credentials: Credentials) {
        CredentialsManager.saveCredentials(credentials)
    }
}
```

Nothing too special about our implementation. In the case of an error, we just render a [`Toast`](https://developer.android.com/guide/topics/ui/notifiers/toasts.html) message saying that "something went wrong". And when the sign-in or sign-up process succeeds, we save the credentials to the `CredentialsManager`. This manager is not part of the library provided by Auth0, we actually have to implement it.

The `CredentialsManager` will have two responsibilities: to hold the credentials of the logged-in user; and to provide a method to retrieve the `access_token` of the user. We will also create this class as a sibling to `MainActivity`, naming it as `CredentialsManager.kt`. This class will contain the following code:

```kotlin
package com.auth0.samples.kotlinapp

import android.content.Context
import com.auth0.android.result.Credentials

object CredentialsManager {
    private var context: Context? = null
    private val PREFERENCES_NAME = "auth0"
    private val ACCESS_TOKEN = "access_token"

    fun setContext(context: Context) {
        this.context = context
    }

    fun saveCredentials(credentials: Credentials) {
        val sp = context?.getSharedPreferences(
                PREFERENCES_NAME, Context.MODE_PRIVATE)

        sp!!.edit().putString(ACCESS_TOKEN, credentials.accessToken)
                .apply()
    }

    fun getAccessToken(): String {
        val sp = context?.getSharedPreferences(
                PREFERENCES_NAME, Context.MODE_PRIVATE)

        return sp!!.getString(ACCESS_TOKEN, null)
    }
}
```

Notice that we start the definition of this class with `object` instead of `class`. [This is the idiomatic way to define *singletons* in Kotlin](https://kotlinlang.org/docs/reference/object-declarations.html#object-declarations). As both exposed methods make use of a context, which will be always the same in our simple app, we have also added a method to set the context in the singleton.

After that, we will modify the `MainActivity` and its layout to add a button that, when clicked, starts the authentication process. Let's start by adding the authentication button in the `app/src/main/res/layout/activity_main.xml` file, which will end up as follows:

```xml
<?xml version="1.0" encoding="utf-8"?>
<layout xmlns:android="http://schemas.android.com/apk/res/android">

    <data>
        <import type="android.view.View" />
        <variable name="loggedIn" type="java.lang.Boolean" />
    </data>

    <LinearLayout android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:orientation="vertical">

        <Button android:id="@+id/login_button"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="Please, identify yourself."
            android:visibility="@{loggedIn ? View.GONE : View.VISIBLE}" />

        <ListView android:id="@+id/list_todo"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content" />

    </LinearLayout>
</layout>
```

> We would usually define labels and static texts in the `strings.xml` file. However, to simplify the tutorial, we will leave it defined in the layout file.

We had to change the main element on this file to `layout` to correctly define a `loggedIn` variable that will get bound later. This variable is used in this layout to hide the login button when the user is successfully identified. Its value will be managed (and bound) by the `MainActivity` class:

```kotlin
package com.auth0.samples.kotlinapp

import android.content.Intent
import android.databinding.DataBindingUtil
import android.os.Bundle
import android.support.v7.app.AppCompatActivity
import android.widget.ListView
import com.android.volley.toolbox.Volley
import com.auth0.android.Auth0
import com.auth0.android.provider.WebAuthProvider
import com.auth0.samples.kotlinapp.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {

    var binding: ActivityMainBinding? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        CredentialsManager.setContext(this)

        // setting up a Volley RequestQueue
        val queue = Volley.newRequestQueue(this)

        // referencing the binding object of the view
        binding = DataBindingUtil.setContentView(this, R.layout.activity_main)

        // loggedIn should be false by default to show the button
        binding?.loggedIn = false

        // getting a reference for the ListView
        val listToDo = findViewById(R.id.list_todo) as ListView

        // passing the activity, the queue and the ListView to the function
        // that consumes the RESTful endpoint
        getItems(this, queue, listToDo)

        // triggering the login method when the button is clicked
        val loginButton = findViewById(R.id.login_button)
        loginButton.setOnClickListener { login() }
    }

    // Auth0 triggers an intent on a successful login
    override fun onNewIntent(intent: Intent) {
        if (WebAuthProvider.resume(intent)) {
            binding?.loggedIn = true
            return
        }
        super.onNewIntent(intent)
    }

    private fun login() {
        WebAuthProvider.init(Auth0("qGJPenvnJsx7rA13KxYrSoB1FzleTg6S", "krebshaus.auth0.com"))
                .withScheme("demo")
                .withAudience("kotlin-todo-app")
                .start(this, AuthenticationHandler(this.applicationContext))
    }
}
```

The `onCreate` function was changed to get a reference to the binding object related to the layout, in order to initialize the `loggedIn` variable as false, and to set the listener to the `loginButton`. The login function, which is called when the user clicks on the login button, triggers the `WebAuthProvider` component provided by Auth0. This component has to be initialized with the *Client ID* of the *Kotlin To Do App (Test Client)* client and with our Auth0 domain. This is the same domain that we exported as an environment variable before running the backend application. We also configured the Auth0 component to:

- use a `demo` schema, which will help Android to trigger our app when a link starting with `demo://` is called
- use the `kotlin-todo-app` audience, which is the name of the API that we've created on Auth0 management tool.

To wrap the changes in our project, we need register a intent filter inside our main activity's tag and make this activity to be launched as a [single task](https://developer.android.com/guide/topics/manifest/activity-element.html). Let's open `./app/src/main/AndroidManifest.xml` and replace it with the following contents:

```xml

```

Before testing the integration with Auth0, we need to go back to [the *Clients* page in the management tool](https://manage.auth0.com/#/clients) and do two modifications. First, we have to configure the *Allowed Callback URLs* option of our client to accept `demo://krebshaus.auth0.com/android/com.auth0.samples.kotlinapp/callback` as the callback URL. Of course, `krebshaus.auth0.com` domain in this URL must be changed accordingly. Second, we have to change the *Client Type* to *Native* to enable [PKCE](https://auth0.com/docs/api-auth/tutorials/authorization-code-grant-pkce).

Running our app now will show the list of to-do items, and above it the login button saying *Please, Identify Yourself.*. If we click it, we will see the default sign-in & sign-up screen of Auth0.

![Auth0 authentication screen](https://cdn.auth0.com/blog/kotlin-android/auth0-authentication.png)
