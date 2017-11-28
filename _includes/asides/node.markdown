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

First, we need to create an API on our free Auth0 account. To do that, we have to go to the APIs section of the management dashboard and click on "Create API". On the dialog that appears, we can name our API as "Contacts API" (the name isn't really important) and identify it as https://contacts.mycompany.com (we will use this value later).

After creating it, we have to go to the "Scopes" tab of the API and define the desired scopes. For this sample, we will define two scopes: read:contacts and add:contacts. They will represent two different operations (read and add) over the same entity (contacts).

### Create the API

### Installing Auth0
