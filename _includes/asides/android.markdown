## Aside: Securing Android Apps with Auth0

Securing applications with Auth0 is very easy and brings a lot of great features to the table. With Auth0, we only have to write a few lines of code to get solid [identity management solution](https://auth0.com/user-management),
[single sign-on](https://auth0.com/docs/sso/single-sign-on), support for [social identity providers (like Facebook, GitHub, Twitter, etc.)](https://auth0.com/docs/identityproviders), and support for [enterprise identity providers (Active Directory, LDAP, SAML, custom, etc.)](https://auth0.com/enterprise).

In the following sections, we are going to learn how to use Auth0 to secure Android apps. As we will see, the process is simple and fast.

### Dependencies

To secure Android apps with Auth0, we just need to import the [Auth0.Android](https://github.com/auth0/Auth0.Android) library. This library is a toolkit that let us communicate with many of the basic Auth0 API functions in a neat way.

To import this library, we have to include the following dependency in our `build.gradle` file:

```groovy
dependencies {
    compile 'com.auth0.android:auth0:1.12.0'
}
```

After that, we need to open our app's `AndroidManifest.xml` file and add the following permission:

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

### Create an Auth0 Application

After importing the library and adding the permission, we need to register the application in our Auth0 dashboard. By the way, if we don't have an Auth0 account, this is a great time to <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">create a **free** one</a>.

In the Auth0 dashboard, we have to go to _Applications_ and then click on the _Create Application_ button. In the form that is shown, we have to define a name for the application and select the _Native_ type for it. After that, we can hit the _Create_ button. This will lead us to a screen similar to the following one:

![Android application on Auth0's dashboard](https://cdn2.auth0.com/docs/media/articles/angularjs/app_dashboard.png)

On this screen, we have to configure a callback URL. This is a URL in our Android app where Auth0 redirects the user after they have authenticated.

We need to whitelist the callback URL for our Android app in the _Allowed Callback URLs_ field in the _Settings_ page of our Auth0 application. If we do not set any callback URL, our users will see a mismatch error when they log in.

```bash
demo://bkrebs.auth0.com/android/OUR_APP_PACKAGE_NAME/callback
```

Let's not forget to replace OUR_APP_PACKAGE_NAME with our Android application's package name. We can find this name in the `applicationId` attribute of the `app/build.gradle` file.

### Set Credentials

Our Android application needs some details from Auth0 to communicate with it. We can get these details from the _Settings_ section for our Auth0 application in the [Auth0 dashboard](https://manage.auth0.com/#applications).

We need the following information:

- Client ID
- Domain

It's suggested that we do not hardcode these values as we may need to change them in the future. Instead, let's use String Resources, such as `@string/com_auth0_domain`, to define the values.

Let's edit our `res/values/strings.xml` file as follows:

```xml
<resources>
    <string name="com_auth0_client_id">2qu4Cxt4h2x9In7Cj0s7Zg5FxhKpjooK</string>
    <string name="com_auth0_domain">bkrebs.auth0.com</string>
</resources>
```

These values have to be replaced by those found in the _Settings_ section of our Auth0 application.

### Android Login

To implement the login functionality in our Android app, we need to add manifest placeholders required by the SDK. These placeholders are used internally to define an `intent-filter` that captures the authentication callback URL configured previously.

To add the manifest placeholders, let's add the next line:

```groovy
apply plugin: 'com.android.application'
android {
    compileSdkVersion 25
    buildToolsVersion "25.0.3"
    defaultConfig {
        applicationId "com.auth0.samples"
        minSdkVersion 15
        targetSdkVersion 25
        //...

        //---> Add the next line
        manifestPlaceholders = [auth0Domain: "@string/com_auth0_domain", auth0Scheme: "demo"]
        //<---
    }
}
```

After that, we have to run **Sync Project with Gradle Files** inside Android Studio or execute `./gradlew clean assembleDebug` from the command line.

### Start the Authentication Process

The [Auth0 login page](https://auth0.com/docs/hosted-pages/login) is the easiest way to set up authentication in our application. It's recommended using the Auth0 login page for the best experience, best security, and the fullest array of features.

Now we have to implement a method to start the authentication process. Let's call this method `login` and add it to our `MainActivity` class.

```java
private void login() {
    Auth0 auth0 = new Auth0(this);
    auth0.setOIDCConformant(true);
    WebAuthProvider.init(auth0)
                  .withScheme("demo")
                  .withAudience(String.format("https://%s/userinfo", getString(R.string.com_auth0_domain)))
                  .start(MainActivity.this, new AuthCallback() {
                      @Override
                      public void onFailure(@NonNull Dialog dialog) {
                        // Show error Dialog to user
                      }

                      @Override
                      public void onFailure(AuthenticationException exception) {
                        // Show error to user
                      }

                      @Override
                      public void onSuccess(@NonNull Credentials credentials) {
                          // Store credentials
                          // Navigate to your main activity
                      }
                });
}
```

As we can see, we had to create a new instance of the Auth0 class to hold user credentials. We can use a constructor that receives an Android Context if we have added the following String resources:

- `R.string.com_auth0_client_id`
- `R.string.com_auth0_domain`

If we prefer to hardcode the resources, we can use the constructor that receives both strings. Then, we can use the `WebAuthProvider` class to authenticate with any connection enabled on our application in the [Auth0 dashboard](https://manage.auth0.com/#applications).

After we call the `WebAuthProvider#start` function, the browser launches and shows the Auth0 login page. Once the user authenticates, the callback URL is called. The callback URL contains the final result of the authentication process.

### Capture the Result

After authentication, the browser redirects the user to our application with the authentication result. The SDK captures the result and parses it.

> We do not need to declare a specific `intent-filter` for our activity because we have defined the manifest placeholders with we Auth0 Domain and Scheme values.

The `AndroidManifest.xml` file should look like this:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.auth0.samples">
    <uses-permission android:name="android.permission.INTERNET" />
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:theme="@style/AppTheme">
        <activity android:name="com.auth0.samples.MainActivity">
          <intent-filter>
              <action android:name="android.intent.action.MAIN" />
              <category android:name="android.intent.category.LAUNCHER" />
          </intent-filter>
        </activity>
    </application>
</manifest>
```

That's it, we now have an Android application secured with Auth0. To learn more about this, we can check the [official documentation](https://auth0.com/docs/quickstart/native/android/). There, we will find more topics like [Session Handling](https://auth0.com/docs/quickstart/native/android/03-session-handling) and [Fetching User Profile](User Profile).
