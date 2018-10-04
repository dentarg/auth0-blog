## Aside: Securing Node.js Applications with Auth0

Securing Node.js applications with Auth0 is easy and brings a lot of great features to the table. With [Auth0](https://auth0.com/), we only have to write a few lines of code to get solid [identity management solution](https://auth0.com/user-management), [single sign-on](https://auth0.com/docs/sso/single-sign-on), support for [social identity providers (like Facebook, GitHub, Twitter, etc.)](https://auth0.com/docs/identityproviders), and support for [enterprise identity providers (like Active Directory, LDAP, SAML, custom, etc.)](https://auth0.com/enterprise).

In the following sections, we are going to learn how to use Auth0 to secure Node.js APIs written with [Express](https://expressjs.com/).

### Creating the Express API

Let's start by defining our Node.js API. With Express and Node.js we can do this in two simple steps. The first one is to use [NPM](https://www.npmjs.com/) to install three dependencies: `npm i express body-parser cors`. The second one is to create a Node.js script with the following code:

```javascript
// importing dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// configuring Express
const app = express();
app.use(bodyParser.json());
app.use(cors());

// defining contacts array and endpoints to manipulate it
const contacts = [
    { name: 'Bruno Krebs', phone: '+555133334444' },
    { name: 'John Doe', phone: '+191843243223' }
];
app.get('/contacts', (req, res) => res.send(contacts));
app.post('/contacts', (req, res) => {
    contacts.push(req.body);
    res.send();
});

// starting Express
app.listen(3000, () => console.log('Example app listening on port 3000!'));
```

The code above creates the Express application and adds two middleware to it: `body-parser` to parse JSON requests, and `cors` to signal that the app accepts requests from any origin. The app also registers two endpoints on Express to deal with POST and GET requests. Both endpoints use the `contacts` array as some sort of in-memory database.

We can run and test our application by issuing `node index` in the project root and then by submitting requests to it. For example, with [cURL](https://curl.haxx.se/), we can send a GET request by issuing `curl localhost:3000/contacts`. This command will output the items in the `contacts` array.

### Registering the API at Auth0

After creating our application, we can focus on securing it. Let's start by registering an API on Auth0 to represent our app. To do this, let's head to [the API section of our management dashboard](https://manage.auth0.com/#/apis) (we can create a [free account](https://auth0.com/signup)) if needed) and click on "Create API". On the dialog that appears, we can name our API as "Contacts API" (the name isn't really important) and identify it as `https://contacts.mycompany.com/` (we will use this value later).

After creating it, we have to go to the "Scopes" tab of the API and define the desired scopes. For this sample, we will define two scopes: `read:contacts` and `add:contacts`. They will represent two different operations (read and add) over the same entity (contacts).

![Defining OAuth scopes in the new Auth0 API](https://cdn.auth0.com/blog/spring-boot-aside/defining-oauth-scopes.png)

### Securing Express with Auth0

Now that we have registered the API in our Auth0 account, let's secure the Express API with Auth0. Let's start by installing three dependencies with NPM: `npm i express-jwt jwks-rsa express-jwt-authz`. Then, let's create a file called `auth0.js` and use these dependencies:

```javascript
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const jwtAuthz = require('express-jwt-authz');

const tokenGuard = jwt({
  // Fetch the signing key based on the KID in the header and
  // the singing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

module.exports = function (scopes) {
  const scopesGuard = jwtAuthz(scopes || []);
  return function mid(req, res, next) {
    tokenGuard(req, res, (err) => {
      err ? res.status(500).send(err) : scopesGuard(req, res, next);
    });
  }
};
```

The goal of this script is to export an [Express middleware](http://expressjs.com/en/guide/using-middleware.html) that guarantees that requests have an `access_token` issued by a trust-worthy party, in this case Auth0. The middleware also accepts an array of scopes. When filtering requests, this middleware will check that these scopes exist in the `access_token`. Note that this script expects to find two environment variables:

- `AUTH0_AUDIENCE`: the identifier of our API (`https://contacts.mycompany.com/`)
- `AUTH0_DOMAIN`: our domain at Auth0 (in my case `bk-samples.auth0.com`)

We will set these variable soon, but it is important to understand that the domain variable defines how the middleware finds the signing keys.

After creating this middleware, we can update our `index.js` file to import and use it:

```javascript
// ... other requires
const auth0 = require('./auth0');

app.get('/contacts', auth0(['read:contacts']), (req, res) => res.send(contacts));
app.post('/contacts', auth0(['add:contacts']), (req, res) => {
  contacts.push(req.body);
  res.send();
});
```

In this case, we have replaced the previous definition of our endpoints to use the new middleware. We also restricted their access to users that contain the right combination of scopes. That is, to get contacts users must have the `read:contacts` scope and to create new records they must have the `add:contacts` scope.

Running the application now is slightly different, as we need to set the environment variables:

```
export AUTH0_DOMAIN=bk-samples.auth0.com
export AUTH0_AUDIENCE="https://contacts.mycompany.com/"
node index
```

Let's keep this API running before moving on.

### Creating an Auth0 Application

As the focus of this section is to secure Node.js applications with Auth0, [we are going to use a live Angular app that has a configurable Auth0 application](http://auth0.digituz.com.br/?clientID=ssII6Fu1qfFI4emuNeXeadMv8iTQn1hJ&domain=bk-samples.auth0.com&audience=https:%2F%2Fcontacts.mycompany.com%2F&scope=read:contacts). Before using this app, we need to create an Auth0 application that represents it. Let's head to the ["Applications" section of the management dashboard](https://manage.auth0.com/#/applications) and click on the "Create Application" button.

On the popup shown, let's set the name of this new application as "Contacts Application" and choose "Single Page Web App" as the application type. After hitting the "Create" button, we have to go to the "Settings" tab and set `http://auth0.digituz.com.br/callback` in the "Allowed Callback URLs" field.

Now we can save the application and head to [the sample Angular app secured with Auth0](http://auth0.digituz.com.br/?clientID=ssII6Fu1qfFI4emuNeXeadMv8iTQn1hJ&domain=bk-samples.auth0.com&audience=https:%2F%2Fcontacts.mycompany.com%2F&scope=read:contacts). To use this app, we need to set the correct values for four properties:

- `clientID`: We have to copy this value from the "Client ID" field of the "Settings" tab of "Contacts Application".
- `domain`: We can also copy this value from the "Settings" tab of "Contacts Application".
- `audience`: We have to set this property to meet the identifier of the "Contacts API" that we created earlier.
- `scope`: This property will define the `authority` that the `access_token` will get access to in the backend API. For example: `read:contacts` or both `read:contacts add:contacts`.

Then we can hit the "Sign In with Auth0" button.

![Using the Angular app with the configurable Auth0 application](https://cdn.auth0.com/blog/angular-generic-client/signing-in.png)

After signing in, we can use the application to submit requests to our secured Node.js API. For example, if we issue a GET request to `http://localhost:3000/contacts/`, the Angular app will include the `access_token` in the `Authorization` header and our API will respond with a list of contacts.

![Getting a response from a secure Node.js API](https://cdn.auth0.com/blog/node-aside/client-app-issuing-request.png)
