*Guest post by SteveALee of Opendirective.com*

Authentication of web apps is a big hairy problem and if you are not careful it will eat a large chunk of you developer time. 
Worse, if you don't get it right you're open to being hacked, which will take even more of your precious time, not to manage damaging your reputation.
One of the easiest ways to mitigate this is to outsource the work to Auth0 who provide an excellent and flexible solution along with some of the best documents and support in the business.
But, even when using Auth0 some scenareos are still complex to figure out and take time to get right. 
True to form, I picked one of these cases as my first attempt
This post is the story of my experience.

## The problem
I'm developing a set of open source components and commercial SaaS design to support the needs of people with cognitive disabilities or low digital literacy.
The initial components and product will provide simplified access to shared photographs and email. Google seemed like a natural choice for the initial underlying service. 
I've chosen a stack I'm happy with: [cyclejs](https://cycle.js.org/) for the a reactive SPA front end and [Microsoft Azure Functions](https://azure.microsoft.com/en-us/services/functions/) 
for a serverless backend APIs and more. Naturally, I chose Auth0 for authentication and authorization duties. 

My plan was that users will authenticate using Google and the code would then access the Picas and GMail APIs authorizing with the user credentials.

``` User Story: As a user I want to log in with my Google account so I can view my google photos in a simple viewer```

That seemed fairly straight forward after learning the basics of OAuth and OpenID flows. Then I read the various Google docs and ended up being confused.

## Getting nowhere very slowly

After attempteding a few spikes accessing the Google APIs directly from the SPA I ended up pulling my hair out. 
The Picasa API in particular is very flaky in how it handles CORS and authentication. I started to think that backend access was going to 
be the solution. The Google docs are often unclear on whether access is from client or backend and it's not clear how to pass tokens from client to backend.
And then what to do when tokens expire? The code will need to avoid having users keep loging in so a refresh toekne will be required and they are server side.

So, onto Plan B - use Auth0 do do all the heavy lifting. My hope was it would solve the technical issues relatively easily and also be flexible in the user experience of authetication and what services can be used.
And yes, this did eventually work out with Auth0 Lock easily providing the authentication UI. 
However, authorisation to the google APIs caused me much confusion and required help from support as I missed the important docs.

## Auth0 and AzureFunctions: making live easy

Without further ado, here's what you need to do to let a user sign in withGoogle via the Auth0 Lock and then access a Google API. 
I'll present some a links to important docs. But first, here's the flow we use.

* SPA displays the lock passing suitable options
* User logs in with Google, approving access to listed scopes (eg read emails)
* If required Auth0 creates a new Auth0 user linked to the google user
* SPA gets the auth0 user id_token and access_token
* SPA calls the backend HTTP endpoint to get a list of email etc. It passes the id_token 
* Backend AzureFunction uses the userid in the id_token to find out the user profile using the Auth0 admin API
* Backend extracts the google access_token from the users profile.
* Backend calls the GMail api and returns the results

In order for this to all work you need to have configured the following

* Auth0 web Client for the SPA
* Google API auth0 clientid for the SPA
* Auth0 non interactive client for the backend
* Auth0 API management API for backend access

The docs describing these are in links above

The SPA code is as follow (not I actually use the CycleJS integration but this imperative code should be easy to understand). 
For development server I simply installed npm package lite-serve configured to port 8000

```

```

The Azure Function code. This is a javascript HTTP Function and no dependenies need to be installed.

```

```

