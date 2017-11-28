---
layout: post
title: "Add Authentication To Your iOS Apps with Centralized Login"
description: "In this tutorial we implement centralized logins for iOS both manually and using the Auth0 SDK."
date: 2017-11-22 12:30
category: Technical Guide, iOS, Mobile
author:
  name: Sebastián Peyrott
  url: https://twitter.com/speyrott?lang=en
  mail: speyrott@auth0.com
  avatar: https://en.gravatar.com/userimage/92476393/001c9ddc5ceb9829b6aaf24f5d28502a.png?size=200
design:
  bg_color: "#222228"
  image: https://cdn.auth0.com/blog/centralized_login_ios/logo.png
  image_size: "100%"
tags:
- ios
- swift
- login
- centralized
- centralized-login
- hosted-login
- sfauthenticationsession
- oauth2
- embedded-login
- native
- mobile
- sso
- auth0
- auth0-lock
- lock
related:
- 2017-10-19-oauth-2-best-practices-for-native-apps
- 2016-10-04-compare-mvvm-and-viper-architectures
---

In this post, we will take a look at the recommended approach to performing authentication in native iOS apps. We will use Auth0's Centralized Login feature to increase security and follow [OAuth2](https://tools.ietf.org/html/rfc6749) and its [recommended practices](https://auth0.com/blog/oauth-2-best-practices-for-native-apps/) on iOS. We will also learn how to use the new [SFAuthenticationSession](https://developer.apple.com/documentation/safariservices/sfauthenticationsession) class from iOS 11. Read on!

{% include tweet_quote.html quote_text="Increase security for your iOS apps using Auth0's Centralized Login!" %}

-----

## Introduction
When a user needs to be authenticated in a mobile app there are essentially two options: an *internal* (embedded) login screen, or an *external* login screen.

Embedded login screens have been the norm for a long time. Starting with the usual username/password login screen from Facebook, to modern ones that allow you to login by using a cell phone number and SMS or emails. The are two issues with this approach:

- Login credentials are seen and managed (and even stored in some cases) by the application. This means that any security issue affecting a single application can compromise those credentials.
- Implementing single sign-on solutions is impractical due to the necessary isolation requirements of mobile operating systems.

The main advantage of embedded login screens is the seamless integration with the rest of the application. There is no screen-switching or extra delays related to switching applications to perform logins.

![Internal Login Screen](https://cdn.auth0.com/blog/centralized-login/Embedded-Login.png)

External login screens, on the other hand, work by delegating the job of authenticating a user to a different application. The main advantages of this approach are:

- A specialized, secure, and OS sanctioned (i.e. with special privileges and behavior) can take care of the sensitive part of the authentication flow: handling credentials.
- Multiple applications can delegate authentication to the same external application, allowing single-sign-on solutions to be implemented with ease.

The main disadvantage is, of course, that delegating authentication to a separate app is not as seamless as an embedded login flow.

When it comes to iOS, the external app that handles authentication is usually Safari. By having Safari access an authentication server, login credentials are managed by it. Apple, and other OS manufacturers, put special attention to the way web browsers handle this information, and development is focused on making this secure. By making the web browser the external app that handles authentication and credentials, security for all native applications is increased.

![External Login Screen](https://cdn.auth0.com/blog/centralized-login/Centralized-Login.png)

But can we do anything to improve the user experience when using external logins? At Auth0 we developed [Centralized Logins](https://auth0.com/docs/hosted-pages/login) to give our users the best of both worlds. Centralized Logins allow developers to customize the login screen that is served by Auth0 when used as an authentication server. Of course, in case developers don't want to customize the login screen, they can use the default [Auth0 Lock](https://auth0.com/docs/libraries/lock/v10) screen that supports a lot of functionality with minimal coding. In other words, it can even result in less time spent developing this feature for your app!

Before taking a look at how to use this for our iOS apps, we will take a brief look at how this works in the context of [OAuth2](https://tools.ietf.org/html/rfc6749). OAuth2 is one of the industry-standard technologies implemented by [Auth0](https://auth0.com/).

## OAuth2 for Native Mobile Apps
[OAuth2](https://tools.ietf.org/html/rfc6749) is an *authorization* framework. In practice, OAuth2 can be seen as a protocol for clients to gain access to protected resources managed by different parties.

On the other hand, *authentication* is the process of confirming the truth of a user's credentials. In simpler terms, letting an application know the identity of the user interacting with it and validating that identity.

Authorization is more general than authentication, thus OAuth2, an authorization framework, can also be used for authentication purposes. However, since OAuth2 is designed with a bigger scope in mind, to use it for authentication it is necessary to specify with greater detail certain operations. This is what [OpenID Connect](http://openid.net/specs/openid-connect-core-1_0.html), a protocol built on top of OAuth2, does for authentication.

When it comes to mobile apps, many applications require the user to identify themselves, or to *authenticate*. Nowadays, it is very common to delegate that functionality to third-party identity providers such as Facebook, Twitter or Google. This is known as *social login* in some circles, but it can be used with any identity provider supported by the authentication system. Each identity provider provides their own authentication and account access process. Some of them, like Google, rely on OAuth2. Others may choose different protocols.

Mobile apps have been, for a long time, designing their own authentication and authorization screens. All of these screens must conform to the authentication and authorization process of the identity provider. For example, if Facebook requires a user to authorize a third party application to learn their full name, e-mail address and profile picture, a consent screen must be displayed. This process is entirely controlled by the identity provider.

For web applications, this process has always been handled by the web browser. Web browsers allow identity providers and services to communicate with each other, while at the same time temporarily controlling each step of the authentication/authorization process. Mobile apps, by virtue of preferring native login screens, have strayed from this path. It is for this reason that the [IETF has drafted a document](https://www.rfc-editor.org/rfc/rfc8252.txt) detailing the advantages of also having mobile apps use the web-browser for authorization.

In essence, a native application can delegate the authentication/authorization steps to an authorization server through the web browser. Web browsers on all mobile platforms provide ways for the results of these operations to be sent back to the application that requested them. Furthermore, web browsers are fully prepared by the OS vendor to handle these operations securely. 

[Auth0, which fully conforms to the OpenID Connect specification](https://auth0.com/blog/we-are-now-open-id-certified/), provides an authorization server capable of authenticating and authorizing users through many identity providers using mobile web browsers. The next sections in this post will detail how to implement this for iOS apps both hitting OpenID Connect endpoints manually and using the Auth0 SDK. Additionally, we will also see how to customize the different screens that are displayed by the web browser during the process, improving the UI/UX integration with the rest of the applications.

## Add Authentication To Your iOS App
For [our example](https://github.com/auth0-blog/centralized-login-ios), we will implement two iOS apps using Swift. Our applications will use Auth0 as the authorization server. Auth0 allows clients to login using different identity providers and many more features (such as passwordless logins, classical username + password, etc.) One application will interact with the authorization server directly by following the usual OpenID Connect process for authentication. It will use Safari as the application handling the credentials and the login flow. The other application will use the Auth0 for iOS library to further simplify our code. This library can interact with Safari for us, making things even easier! Both applications fully implement the recommended procedure for mobile authentication, it is up to you to pick whatever you prefer for your own apps.

### Setting Up Auth0
Since our example will use Auth0 as the authorization server, it is first necessary to set some things up. Fortunately, this is very easy. First, <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">sign up</a> for an Auth0 account if you don't have one already. Then go to the [dashboard](http://manage.auth0.com/) and create a new client. Clients let you create specific settings for each application that interacts with your Auth0 account. To create a client follow these steps:

1. Open the [dashboard] and go to the [clients section](https://manage.auth0.com/#/clients).
2. Click `+ CREATE CLIENT` in the top right corner.
3. Set a name, select `Native` and click on `Create`.
4. Go to `Settings` and put the right value in the `Allowed Callback URLs` field.
  - For our first example, the right value for the `Allowed Callbacks URLs` field is: `auth0test1://test`.
  - For our second example, the right value for the `Allowed Callbacks URLs` field is: 

```
Auth0.Centralized-Login-Test-2://speyrott.auth0.com/ios/Auth0.Centralized-Login-Test-2/callback
```

5. Don't forget to click `SAVE CHANGES` at the bottom of the page once you are done.

You are free to create as many clients as you want to run separate tests with separate mobile apps. We created two different clients, one for each sample app.

Take note of the values of the `Domain` and `Client ID` fields in the `Settings` tab of each client. These values must be configured in each mobile app's code.

### Setting Up Xcode
Now let's create a simple sample project.

1. Open Xcode and click `Create a new Xcode project`.
2. Select `iOS` and `Single View App`.
3. Complete the details in the next page and select `Swift` as the programming language.
4. Pick a directory for the project and select `Create`.

### Calling OpenID Connect/OAuth2 Endpoints Directly
Before getting our hands dirty with code, let's take a short overview of how authentication and authorization work in the context of OpenID Connect and OAuth2 for mobile apps. The following endpoints are accessed using HTTP requests. Parameters are passed as part of the URL.

#### The `/authorize` Endpoint
The common OpenID Connect procedure for logins begins by sending an HTTP `GET` request to a special endpoint in the authorization server: the `/authorize` endpoint. This endpoint takes a series of parameters that tell the authorization server what type of request is being made, along with what details the client is requesting the server to provide after a successful authorization flow. This also tells the authorization server what type of authentication and authorization is required before moving forward. 

The following arguments are required to be passed to the `/authorize` endpoint:

- `response_type`: the type of information that will be returned to the client after the authorization flow is complete. For mobile apps this should always be `code`.
- `client_id`: a unique ID that tells the authorization server what client (i.e. what "application") is using the endpoint. When it comes to Auth0, you can get this from the [dashboard](http://manage.auth0.com/) in your client's settings.
- `redirect_uri`: the URL to which the authorization server will redirect the web browser after authentication is complete. Mobile apps can receive information through specially crafted URLs. We will use this to send the results of the authorization flow to our native mobile app. This parameter is optional, and it is usually set in the client configuration in the authorization server, rather than passed in this call.
- `code_challenge_method`: this must always be `S256`. This tells the authorization server what method is used to generate the authorization code that will be returned.
- `code_challenge`: a challenge that the authorization server will use to generate the authorization code that is returned after a successful authorization flow. We will see how to generate this challenge below.
- `scope`: scopes tell the authorization server what kind of data you are requesting access to. For our purposes this parameter is not very important, but for other applications it is. For example, for Facebook logins, this parameter tells Facebook what kind of access you are requesting to a user's account (email address, friends list, automatic posts, etc.). We will set this argument to `openid profile id_token`.

It is also a very good idea to use the `state` argument: the `state` argument contains a value that is returned by the `/authorize` call when doing the redirect with the results. This response is handled by a special handler in our application which can be activated by anyone that constructs a URL with the correct URL scheme. By using the `state` parameter, malicious calls made to this handler can be checked by comparing the value of the `state` parameter received with the one sent in the `/authorize` call. If these don't match, then the request is bogus and should be ignored. For non-native apps, like regular web apps, this prevents [CSRF attacks](https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)).

Although it is possible to call `/authorize` without the `code_challenge` and `code_challenge_method` parameters, this is not recommended. These parameters tell the authorization server that the returned code must be generated using [Proof Key for Code Exchange (PKCE)](https://tools.ietf.org/html/rfc7636), a method that improves security for mobile applications by making it harder to use returned codes intercepted by other applications running on the same device. For mobile applications, it is always a good idea to use PKCE.

All of these parameters are passed as part of the URL.

That's it! When our mobile app tells Safari to access the `/authorize` endpoint using these parameters, Auth0 will let the user login using any of the methods enabled for your client in the Auth0 dashboard. For example, if the client has Facebook logins and username + password logins enabled, both of these options will be displayed in the Safari window. If the user picks Facebook, Auth0 will redirect the user to Facebook to login and authorize the access to the requested data from the user, such as his email and profile picture. After Facebook validates the user's credentials and the user authorizes the app to access the requested data, Facebook will redirect back to Auth0, and Auth0 will redirect to the URL specified in `redirect_uri` with the authorization code.

This authorization code can be used to make further calls to the authorization server. In particular, the code can be exchanged for an access token which will allow us to do other things, like get user profile information, and call other APIs.

Using the web browser for this part of the authorization flow is great for improving the user experience! For example, if the user had picked Facebook and they were not logged-in, they could use Safari password autocomplete to make things easier. On the other hand, if they were already logged in using Safari, there would be no need for the user to type their credentials! It is easy to find many different ways in which the user experience is improved by using the web browser as the central login hub for all mobile apps. This is what we call *Centralized Login*.

#### The `/oauth/token` endpoint
Now that the user has authenticated and completed the initial authorization flow, it is time to turn the authorization code into something useful. For this, we will interact with the `/oauth/token` endpoint. The `/oauth/token` endpoint can be used to request the authorization server to issue new access tokens that the client can use. To request new tokens, the client must provide either a token (usually a refresh token), or a one-time authorization code. As you can imagine, this one-time authorization code is what we got from the `/authorize` endpoint above. The type of token returned will depend on the parameters that were used in the original `/authorize` call. In other words, we cannot request tokens of broader authorization requirements using the `/oauth/token` endpoint. Doing so would require *authorization*, which is the domain of `/authorize`. In contrast with the `/authorize` endpoint, this endpoint requires a HTTP `POST` request and all parameters are passed in the body encoded as a JSON object.

The `/oauth/token` endpoint requires the following parameters:

- `grant_type`: must be `authorization_code` for PKCE code exchanges like the ones used for mobile apps.
- `client_id`: our mobile app's client ID, the same ID passed to `/authorize`.
- `code`: the code returned by a successful call to `/authorize`.
- `code_verifier`: a special code generated by the mobile app before calling `/authorize`. This is part of the PKCE mechanism we will explain below.
- `redirect_uri`: this must match the URL sent in the same parameter for the `/authorize` call.

That's it! If the call to the `/oauth/token` endpoint succeeds the result will at least include an access token. Optionally, and according to the request made to `/authorize` before, the response to this call may also include a refresh token and an ID token.

> Wow, so many types of tokens! Want to know what they are used for? Check the ["Tokens" doc at Auth0](https://auth0.com/docs/tokens).

Once we have our token or tokens, we have logged in!

#### The Code
For our example, we are going to add a button to login/logout and a simple label. Of course, common mobile apps are more complex. We will skip how to do this in this tutorial because that is out of scope, but if you are new to iOS development, do [check Apple's docs](https://developer.apple.com/library/content/referencelibrary/GettingStarted/DevelopiOSAppsSwift/BuildABasicUI.html#//apple_ref/doc/uid/TP40015214-CH5-SW1).

This is how it should look for our sample:

![Base Application](https://cdn.auth0.com/blog/centralized-login/Storyboard.png)

For our login button, we will add a handler in the view controller that will open our specially crafted URL to the `/authorize` endpoint. All of the authorization code is in a separate class: `AuthorizationServer`:

```swift
@IBAction func buttonClick(_ sender: Any) {
    let appDelegate = UIApplication.shared.delegate as! AppDelegate
    if appDelegate.tokens == nil {
        appDelegate.authServer.authorize(viewController: self, useSfAuthSession: sfAuthSessionSwitch.isOn, handler: { (success) in
            if !success {
                //TODO: show error
                self.updateUI()
            }
            if self.sfAuthSessionSwitch.isOn {
                self.checkState()
            }
        })
    } else {
        appDelegate.logout()
        updateUI()
    }
}
```

The `authorize` function is simple enough:

```swift
func authorize(viewController: UIViewController, useSfAuthSession: Bool, handler: @escaping (Bool) -> Void) {
    guard let challenge = generateCodeChallenge() else {
        // TODO: handle error
        handler(false)
        return
    }

    savedState = generateRandomBytes()
    
    var urlComp = URLComponents(string: domain + "/authorize")!

    urlComp.queryItems = [
        URLQueryItem(name: "response_type", value: "code"),
        URLQueryItem(name: "client_id", value: clientId),
        URLQueryItem(name: "code_challenge_method", value: "S256"),
        URLQueryItem(name: "code_challenge", value: challenge),
        URLQueryItem(name: "state", value: savedState),
        URLQueryItem(name: "scope", value: "id_token profile"),
        URLQueryItem(name: "redirect_uri", value: "auth0test1://test"),
    ]
    
    if useSfAuthSession {
        sfAuthSession = SFAuthenticationSession(url: urlComp.url!, callbackURLScheme: "auth0test1", completionHandler: { (url, error) in
            guard error == nil else {
                return handler(false)
            }
            
            handler(url != nil && self.parseAuthorizeRedirectUrl(url: url!))
        })
        sfAuthSession?.start()
    } else {
        sfSafariViewController = SFSafariViewController(url: urlComp.url!)
        viewController.present(sfSafariViewController!, animated: true)
        handler(true)
    }
}
```

The `authorize` function first generates the code challenge and then constructs the URL for the request. The `redirect_uri` has a special scheme: `auth0test`. iOS allows URL schemes to be associated with specific applications. This way, when a URL containing that scheme is opened by Safari, control can be passed to that application instead. This is the mechanism used by `/authorize` to send back to our application the results of the operation. We must tell `/authorize` to what URL it needs to make the redirection. We also need to enable which URLs are valid in the Auth0 dashboard. You can find this in the client settings as shown before (Dashboard -> Clients -> [Client Name] -> Allowed Callback URLs).

Our code also allows for two mechanisms: either by opening the URL as any other URL using `UIApplication.open`, or by relying on the newer `SFAuthenticationSession` class. The `SFAuthenticationSession` class provides a callback that is called after the redirect is performed by the authorization server. This callback carries the URL, so it is very convenient. No other steps or handlers are required. In contrast, by using the older `UIApplication.open` method, we must set a special handler for our URL schemes in our main application delegate:

```swift
@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    // (...)

    func application(_ app: UIApplication, open url: URL, options: [UIApplicationOpenURLOptionsKey : Any] = [:]) -> Bool {
        return authServer.parseAuthorizeRedirectUrl(url: url)
    }
```

iOS calls our application when any URL using the `auth0test` URL scheme is opened. To claim this URL for our application, it must be configured in the `Info.plist` file of our bundle.

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLName</key>
    <string>com.auth0.centralizedlogintest1</string>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>auth0test1</string>
    </array>
  </dict>
</array>
```

The `parseAuthorizedRedirectUrl` method is simple enough as well:

```swift
func parseAuthorizeRedirectUrl(url: URL) -> Bool {
    guard let urlComp = URLComponents(url: url, resolvingAgainstBaseURL: false) else {
        sfSafariViewController?.dismiss(animated: true, completion: nil)
        return false
    }
    
    if urlComp.queryItems == nil {
        sfSafariViewController?.dismiss(animated: true, completion: nil)
        return false
    }
    
    for item in urlComp.queryItems! {
        if item.name == "code" {
            receivedCode = item.value
        } else if item.name == "state" {
            receivedState = item.value
        }
    }
    
    sfSafariViewController?.dismiss(animated: true, completion: nil)
    
    return receivedCode != nil && receivedState != nil
}
```

The `code` and `state` elements are returned as part of the redirect URL. By parsing it we can access them. If these elements are not present, the URL is invalid and an error has occurred. Inspect the URL to get information about the error.

Once we have the `code` and `state` parameters we are ready to exchange them for an access token! Our view controller calls the `getToken` method from our `AuthorizationServer` class to do this:

```swift
func getToken(handler: @escaping (Tokens?) -> Void) {
    if receivedCode == nil || codeVerifier == nil || savedState != receivedState {
        handler(nil)
        return
    }
    
    let urlComp = URLComponents(string: domain + "/oauth/token")!
    
    let body = [
        "grant_type": "authorization_code",
        "client_id": clientId,
        "code": receivedCode,
        "code_verifier": codeVerifier,
        "redirect_uri": "auth0test1://test",
    ]
    
    var request = URLRequest(url: urlComp.url!)
    request.httpMethod = "POST"
    request.httpBody = try? JSONSerialization.data(withJSONObject: body)
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    
    let task = URLSession.shared.dataTask(with: request) {
        (data, response, error) in
        if(error != nil || data == nil) {
            // TODO: handle error
            handler(nil)
            return
        }
        
        guard let json = try? JSONSerialization.jsonObject(with: data!) as? [String: Any],
              let accessToken = json!["access_token"] as? String
        else {
            handler(nil)
            return
        }
        
        handler(Tokens(accessToken: accessToken,
                        idToken: json!["id_token"] as? String,
                        refreshToken: json!["refresh_token"] as? String))
    }
    
    task.resume()
}
```

In this case, all parameters are sent in the body as a JSON object and the HTTP request uses the `POST` method. The `code_verifier` parameter is a value that was generated before calling the `/authorize` endpoint. By sending the `code_verifier` parameter, the authorization server knows that the caller can only be the one that originally called `/authorize` in the first place. In other words, intercepting the response from `/authorize` is not enough to get an access token. Do note that the URL passed in `redirect_uri` must match the one passed to `/authorize`. This parameter is not used to perform a redirect by this endpoint as all data is returned as part of the response body, it is only used to match this request with the one performed for `/authorize`.

According to the scopes requested in our previous `/authorize` call, we will get an access token that will allow us to request the user's profile. To do this, our view controller finally calls the `getProfile` function from `AuthorizationServer`:

```swift
func getProfile(accessToken: String, handler: @escaping (Profile?) -> Void) {
    let urlComp = URLComponents(string: domain + "/userinfo")!
    
    let urlSessionConfig = URLSessionConfiguration.default;
    urlSessionConfig.httpAdditionalHeaders = [
        AnyHashable("Authorization"): "Bearer " + accessToken
    ]
    let urlSession = URLSession(configuration: urlSessionConfig)
    let task = urlSession.dataTask(with: urlComp.url!) {
        (data, response, error) in
        if(error != nil || data == nil) {
            // TODO: handle error
            handler(nil)
            return
        }
        
        guard let json = try? JSONSerialization.jsonObject(with: data!) as? [String: String] else {
            handler(nil)
            // TODO: handle error
            return
        }

        let result = Profile(name: json?["name"], email: json?["email"])
        handler(result)
    }
    
    task.resume()
}
```

The `getProfile` function makes an HTTP `GET` request to the `/userinfo` endpoint. This endpoint requires a valid access token to operate. This is the token we got in the call to `/oauth/token`. The token must be passed to the `/userinfo` endpoint as part of the HTTP headers. The special header that is used for this purpose is the `Authorization` header. The token must be used in this header by prepending the word `Bearer` along with a single space. In other words, our authorization header will look like

```
Authorization: Bearer the_access_token
```

Where `the_access_token` is the access token returned by the call to `/oauth/token`.

The results of the call to the `/userinfo` endpoint are returned in the body of the response as a JSON object. The members of the object change according to the information stored about the user. In general, you can assume `name` and `email` will be available.

And this is it! Once you have this information, you can update the UI with it or do all the stuff required by the logic of your application. There are other things that can be done by following these same steps. For example, you may request access to other APIs instead of the `/userinfo` API. You can even set up your [custom APIs from your backend](https://manage.auth0.com/#/apis) so you can get access tokens for them using these steps.

<video src="https://cdn.auth0.com/blog/centralized-login/test1.mp4" controls></video>

The experience when using `SFAuthenticationSession` is slightly different:

<video src="https://cdn.auth0.com/blog/centralized-login/test1sfauthsession.mp4" controls></video>

#### The PKCE Code Challenge
One of the missing pieces of the puzzle is how to generate the [PKCE code challenge](https://tools.ietf.org/html/rfc7636). As said before, the PKCE code challenge improves the security of our application by reducing the chances a successful man-in-the-middle attack can be performed. Any interceptors need both the `code challenge` and the `code verifier` to get a valid access token. The `code verifier` can be used to generate a `code challenge` but not the other way around, so the only application that can use both is the one that generated the `code verifier` in the first place. And, as it turns out, there are mathematical functions that provide precisely this capability: one-way functions. Of these, hash functions are used in computer science to solve problems such as this.

PKCE uses `SHA-256` to generate two values: the `code verifier` and the `code challenge`. The `code verifier` is simply a group of 43 or more random octets. A good, cryptographically secure random number generator must be used for this task. In practice, 32 random bytes are chosen and then Base64-URL encoded into 43 characters of random data. This allows the code verifier to be used as part of HTTP requests in the URL.

The `code challenge`, in turn, is generated by taking the `SHA-256` digest of the `code verifier`. This challenge is also Base64-URL encoded afterwards.

In other words, to generate a valid PKCE `code verifier` and `code challenge`:

```swift
func base64UrlEncode(_ data: Data) -> String {
    var b64 = data.base64EncodedString()
    b64 = b64.replacingOccurrences(of: "=", with: "")
    b64 = b64.replacingOccurrences(of: "+", with: "-")
    b64 = b64.replacingOccurrences(of: "/", with: "_")
    return b64
}

func generateRandomBytes() -> String? {
    var keyData = Data(count: 32)
    let result = keyData.withUnsafeMutableBytes {
        (mutableBytes: UnsafeMutablePointer<UInt8>) -> Int32 in
        SecRandomCopyBytes(kSecRandomDefault, keyData.count, mutableBytes)
    }
    if result == errSecSuccess {
        return base64UrlEncode(keyData)
    } else {
        // TODO: handle error
        return nil
    }
}

class AuthorizationServer {
  
  //(...)
  
  private func generateCodeChallenge() -> String? {
      codeVerifier = generateRandomBytes()
      guard codeVerifier != nil else {
          return nil
      }
      return base64UrlEncode(sha256(string: codeVerifier!))
  }
}
```

In this code, `codeVerifier` is a variable from the `AuthorizationServer` class. The result of this function is first passed to the `/authorize` endpoint. Later on, the `code verifier` is passed to the `/oauth/token` endpoint. The authorization server can easily correlate both requests by computing the `SHA-256` digest of the `code verifier`. If this value matched the `code challenge` sent to the `/authorize` endpoint, then these requests are correlated and coming from the same entity: the one that knows the `code verifier`.

### A Simpler Approach: Using the Auth0 SDK for iOS
Although the steps shown before are somewhat simple, there is an even easier way to do them! Auth0 provides a [Swift library](https://github.com/auth0/Auth0.swift) that can be used to interact with these endpoints in a simpler way. Let's take a look.

We will start from the same basic clean template as before: a single page iOS application with a label and a button that reads `Login`. When this button is pressed, the following code is executed:

```swift
@IBAction func buttonClicked(_ sender: Any) {
  if profile != nil {
      profile = nil
      updateUI()
  } else {
      Auth0
          .webAuth(clientId: clientId, domain: domain)
          .scope("openid token profile")
          .start { result in
              
              switch result {
              
              case .success(let credentials):
                  Auth0
                      .authentication(clientId: clientId, domain: domain)
                      .userInfo(withAccessToken: credentials.accessToken!)
                      .start { result in
              
                          switch result {
                          
                          case .success(let profile):
                              self.profile = profile
                          
                          case .failure(let error):
                              print("Failed with \(error)")
                              self.profile = nil
                          }
                          
                          self.updateUI()
                  }
              
              case .failure(let error):
                  self.profile = nil
                  print("Failed with \(error)")
              }
              
              self.updateUI()
      }
  }
}
```

To use this library simply call `Auth0.webAuth` and pass the right `clientId` and `domain` parameters. You can then proceed to set the right scope or other settings by chaining calls. Finally, call `start` to start the authorization process. This will display the authorization URL in Safari. Once this is completed, the callback passed to `start` will be called with the access token and other credentials. That's right! All the PKCE stuff and the call to `/oauth/token` is handled automagically by the library, no need to do that manually anymore!

Once the credentials are in your possession you can get the user's information by calling:

```swift
Auth0.authentication(clientId: clientId, domain: domain)
     .userInfo(withAccessToken: credentials.accessToken!)
     .start { result in //(...) }
```

The access token passed to this call is the one returned by the `webAuth` operation from before. Piece of cake!

The [Auth0.swift library](https://github.com/auth0/Auth0.swift) internally uses the same method to communicate between Safari and the application: URL schemes. This means that the right callback URL must be set in the client settings for your app in the Auth0 dashboard. The format of this URL, however, is much more specific:

```
{YOUR_BUNDLE_IDENTIFIER}://${YOUR_AUTH0_DOMAIN}/ios/{YOUR_BUNDLE_IDENTIFIER}/callback
```

In our example this looks like:

```
Auth0.Centralized-Login-Test-2://speyrott.auth0.com/ios/Auth0.Centralized-Login-Test-2/callback
```

On iOS versions older than 11, the [Auth0.swift library](https://github.com/auth0/Auth0.swift) still requires the URL scheme to be configured manually as we did for our "manual endpoints" example in the `Info.plist` file:

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleTypeRole</key>
    <string>None</string>
    <key>CFBundleURLName</key>
    <string>auth0</string>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
    </array>
  </dict>
</array>
```

The right handler in the `AppDelegate` must also be set:

```swift
func application(_ app: UIApplication, open url: URL, options: [UIApplicationOpenURLOptionsKey : Any]) -> Bool {
  return Auth0.resumeAuth(url, options: options)
}
```

In any case, this is still much easier than hitting the endpoints manually.

<video src="https://cdn.auth0.com/blog/centralized-login/test2.mp4" controls></video>

[Get the full code](https://github.com/auth0-blog/centralized-login-ios)!

### A Note About Credentials
The credentials returned by the call to `/oauth/token` or `Auth0.webAuth` (i.e. the access token and the refresh token) must be stored safely. In other words, do not put these elements in insecure storage like `NSUserDefaults`. iOS provides a [keychain](https://developer.apple.com/library/content/samplecode/GenericKeychain/Introduction/Intro.html#//apple_ref/doc/uid/DTS40007797-Intro-DontLinkElementID_2) that can be used for these purposes. The safety of your app depends on the safety of the access and refresh tokens! Consider these as sensitive as user passwords.

### Customization of the Centralized Login Page
As we said before, a big part of the user experience is the login view of our mobile app. This is, usually, one of the first things the users see. Therefore, we must make sure it fits with the rest of the application. The centralized login feature allows this too!

We've seen in our example that using Safari to open the URL for the `/authorize` endpoint results in a login page that gets displayed. This login page is hosted by the authorization server. In contrast, in legacy native mobile applications, the login page or view would be an internal part of the application and completely managed by it.

The Auth0 authorization server allows you to modify the login page served by it to your taste. To do this, open the [dashboard and navigate to the `Hosted Pages` section](https://manage.auth0.com/#/login_page). If you enable the `Customize Login Page` switch you will be presented by a text editor right below. This is the HTML page that is served when the authorization server needs a user to authenticate themself.

By default, Auth0 uses the [Auth0 Lock library](https://auth0.com/docs/libraries/lock/v10). The Auth0 Lock library is a convenience library for displaying login pages and popups. This library supports all of the different login features that Auth0 provides, including social logins, username/password signup and login, etc. Of course, you are free to use your own, completely custom, login page. In general, Auth0 Lock is a great choice and can be [customized to your taste](https://auth0.com/docs/libraries/lock/v10/ui-customization).

For our example, we will simply change the logo and the default color scheme to a different one for our `Centralized Login Test 1` application. The `Centralized Login Test 2` application will remain with the default login page.

We have edited the default script in the default HTML page to look like this:

```html
 <script>
  // Decode utf8 characters properly
  var config = JSON.parse(decodeURIComponent(escape(window.atob('@@config@@'))));
  config.extraParams = config.extraParams || {};
  var connection = config.connection;
  var prompt = config.prompt;
  var languageDictionary;
  var language;
  
  if (config.dict && config.dict.signin && config.dict.signin.title) {
    languageDictionary = { title: config.dict.signin.title };
  } else if (typeof config.dict === 'string') {
    language = config.dict;
  }
  var loginHint = config.extraParams.login_hint;
  
  var logo;
  var color;
  if(config.clientID === 'iV2lnrgSBw64uzf1x0MN3svQTYQYcBl2') {
    logo = 'https://upload.wikimedia.org/wikipedia/commons/5/54/Emojione_1F60E.svg'
    color = 'green'
  }
  
  var lock = new Auth0Lock(config.clientID, config.auth0Domain, {
    auth: {
      redirectUrl: config.callbackURL,
      responseType: (config.internalOptions || {}).response_type ||
        config.callbackOnLocationHash ? 'token' : 'code',
      params: config.internalOptions
    },
    assetsUrl:  config.assetsUrl,
    allowedConnections: connection ? [connection] : null,
    rememberLastLogin: !prompt,
    language: language,
    languageDictionary: languageDictionary,
    theme: {
      logo: logo,
      primaryColor: color
    },
    prefill: loginHint ? { email: loginHint, username: loginHint } : null,
    closable: false,
    // uncomment if you want small buttons for social providers
    // socialButtonStyle: 'small'
  });

  lock.show();
 </script>
```

Notice the `if(config.clientID === 'iV2lnrgSBw64uzf1x0MN3svQTYQYcBl2')` statement. When this client ID is used to login, we simply change the logo and color scheme used by Auth0 Lock:

```javascript
var logo;
var color;
if(config.clientID === 'iV2lnrgSBw64uzf1x0MN3svQTYQYcBl2') {
  logo = 'https://upload.wikimedia.org/wikipedia/commons/5/54/Emojione_1F60E.svg'
  color = 'green'
}
```

Here is the result:

![Customized Auth0 Lock](https://cdn.auth0.com/blog/centralized-login/Customization.png)

If you are planning to support more than one social login option, or you are planning to enable more login options in the future, we strongly advice that you use Auth0 Lock. Removing Auth0 Lock implies handling each social login provider manually or with the help of a library such as [Auth0.js](https://github.com/auth0/auth0.js) but allows for 100% custom code.

## Conclusion
Centralized logins are safer than embedded login widgets or pages. Relying on the OS's browser allows special security features to be used for your application to prevent credentials theft, and also allows password managers and single sign-on solutions to work across different applications. Furthermore, centralized login pages can be customized for a better user experience and to match the design guidelines of your application. [Auth0 Lock](https://auth0.com/docs/libraries/lock/v10) can be used as the solution for centralized logins by having the authorization server use it during authentication, further reducing the amount of work that needs to be done for custom and 100% functional login solution. On the iOS side, the [Auth0.swift](https://github.com/auth0/Auth0.swift) library makes it a breeze to support as many social login providers and login options as required, all with just a few lines of non-invasive code! <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">Sign up for a free Auth0 account</a> today and start working on your iOS apps by focusing on what matters: the logic, not the login widget.

