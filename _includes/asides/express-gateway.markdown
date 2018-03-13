### Aside: Configure Express Gateway to use Auth0 as system of record

Express Gateway and Auth0 play very well together when it comes to security.

Let's now configure Auth0 to work as our **system of record** for users and **issue JWTs** for them. If you don't already have an Auth0 account, <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">sign up for a free one now</a>.

From the [Auth0 management dashboard](https://manage.auth0.com/), click on the **APIs** menu item, and then on the **Create API** button. You will need to give your API a name and an identifier. The name can be anything you choose, so make it as descriptive as you want. The identifier will be used to identify your API, this field cannot be changed once set.

For our example, I'll name the API **billings** and identify it as `http://orders`. I'll also leave the signing algorithm as `RS256` and click on the **Create API** button.

![Creating billings API on Auth0](https://cdn.auth0.com/blog/express-gateway/create-auth0-api.png)

Now point your browser to `https://yourAPI.auth0.com/pem` (where `yourAPI` is the Auth0 domain that you chose when creating your account) and download the **public key** file. This is the key that we will
use to verify that the JSON Web Tokens (JWTs) issued by Auth0 are valid. Save it as `pubKey.pem` and place it in the same directory specified in `secretOrPublicKeyFile` parameter of the `jwt` policy (that is, in a directory called `key` in the project root).

The API Gateway has now been configured correctly to handle the scenarios.

### Enable JWT verification in Express Gateway

Express Gateway can be configured to validate tokens provided by Auth0 by installing the `JWT` policy in any of the
pipelines.

```yml
    policies:
      # Other policies
      - jwt:
        - action:
            secretOrPublicKeyFile: ./key/pubKey.pem
            checkCredentialExistence: false
```

### Test Drive

Start the gateway using `npm start` in the project root. Once running, let's try to issue a couple of requests to it:

```shell
$ curl http://localhost:8080
$ Unauthorized
```

You can see that the first request has been denied with `Unauthorized` status. That's because we didn't
provide any JWT with the request, so it didn't go through.

Now grab any HTTP client and let's configure it to start an OAuth 2.0 authorization process against our API hosted in Auth0. We can grab all the necessary parameters going on _Clients_ -> _billings (Test Client)_ -> _Settings_ -> _Advanced Settings_ -> _Endpoints_

In my case, I am going to use `curl`, but you can use the one you prefer:

```bash
curl --request POST \
  --url https://bkrebs.auth0.com/oauth/token \
  --header 'content-type: application/json' \
  --data '{
    "client_id":"my-client-id-copied-from-auth0-client",
    "client_secret":"my-super-secret-copied-from-auth0-client",
    "audience":"http://orders",
    "grant_type":"client_credentials"
}'
```

Now, by simply copying the `access_token` attribute from the response, we will be able to communicate with the API through Express Gateway (you can verify the returned token by using [JWT.io](https://jwt.io/#debugger)). This is the token to be used in order to access the protected resource. So, just try to issue requests making sure that the token is now sent as a `Bearer` Authorization to the endpoint. The response should hopefully be `200`.

```bash
export JWT="ey...the-rest-of-the-token"
curl -H "Authorization: Bearer "$JWT http://customers.company.com:8080
```
