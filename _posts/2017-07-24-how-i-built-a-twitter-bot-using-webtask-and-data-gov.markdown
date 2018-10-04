---
layout: post
title: "How I Built a Twitter Bot Using Auth0 Webtasks and Data.gov"
description: Learn how to use Auth0 Webtasks to build a twitter bot that pulls data from Data.gov and does sentiment analysis
date: 2017-07-24 08:30
is_extend: true
category: Product
author: 
  name: "Daniel James"
  url: "https://twitter.com/thzinc"
  mail: "daniel@thzinc.com"
  avatar: "https://s.gravatar.com/avatar/eaeac922b9f3cc9fd18cb9629b9e79f6?s=80"
design: 
  bg_color: "#3445dc"
  image: "https://cdn.auth0.com/blog/website-extend/blocks-graphic01.png"
tags: 
- extend
---

# I built a Twitter bot using Auth0 Webtasks and Data.gov

I wanted to build something small, fun, and socially-engaging. I have been following [Darius Kazemi][kazemi-website] ([@TinySubversions][kazemi-twitter]) and the community of bot makers at [Botwiki][botwiki-website] ([@Botwikidotorg][botwiki-twitter]), and I decided a Twitter bot was the way to go. I have also been following the US Executive Order 13792 pretty closely. The order directs the US Department of Interior to review whether to downsize "certain national monuments" or sell their oil and mineral rights for profit. The Department has an open ["Opportunity for Public Comment."][docket] I thought this would be a good chance to tinker with lightweight sentiment analysis of the public comments.

I needed a good place to host my small project, and Auth0's free [Webtask.io][webtask-io] offering turned out to be a great fit! I didn't want to sacrifice my time on infrastructure and hosting when I wanted to focus on this bot idea. I got to attend Glenn Block's Auth0 Webtasks workshop at .NET Fringe this year, and he fired me up to do this.

The [Auth0 Webtask.io Editor][webtask-io-editor] is nice, but I have a set of development tools I like. I also wanted to import npm modules to handle the sentiment analysis and Twitter posting. The Auth0 Webtasks CLI is perfect for this.

```bash
# Install the CLI globally
npm i -g wt-cli
# Log in to my Webtask.io account
wt-init
```

Next, I needed to set up my project in a new folder

```bash
# Use source control always
git init
# Create a package.json and fill in the basics
npm init
# Install modules that I'll need for this bot
npm install --save twitter sentence-tokenizer sentiment md5 node-fetch
```

I prefer writing ES6, so I'll be adding `'use latest'` to the top of my scripts. I want to split my logic into a couple of different modules, so I'll use the CLI to bundle my scripts (`-b`). While I'm hacking, I also want to have automatically update my webtask when I save, so I'll have the CLI watch for changes (`-w`). Finally, I have some API keys that I don't want to hard-code, so I'll create a file called `.secrets` to hold on to those for me. (And add `.secrets` to `.gitignore` so it doesn't accidentally get committed!)

```bash
wt create -b -w --secrets-file .secrets .
```

The first of my secrets to go in the `.secrets` file is my Data.gov API key. (It's free and [easy to sign up][data-gov] for, and provides access to other US government data besides Regulations.gov.) Next, I created a new Twitter account called [@EO13792Bot][eo13792bot-twitter] and created a [Twitter app][twitter-apps] for it. I copied the Consumer Key and Secret, and the Access Token and Secret into the `.secrets` file.

There are four distinct parts to this webtask:

* [Regulations.gov API client][regulations-gov-api-client]
* [Text analyzer][text-analyzer]
* [Comment selector and formatter][comment-selector-and-formatter]
* [Tweeter][tweeter]

The Regulations.gov API client exports a function to get the latest comments for a given docket. ([DOI-2017-0002][docket], in this case.) After testing requests against the API, it was necessary to add a timeout to `fetch`.

Source: [quoter/src/regulations-gov-api.js][regulations-gov-api-client]

```javascript
export default (apiKey, docketId, count) => new Promise((resolve, reject) => {
    fetch(`${baseUrl}/documents.json?api_key=${apiKey}&dktid=${docketId}&dct=PS&sb=postedDate&so=DESC&rpp=${count}`)
        .then(response => response.json())
        .then(page => page.documents)
        .then(resolve);

    setTimeout(reject.bind(null, {
        type: 'source-api-timeout'
    }), 25000);
})
```

The text analyzer exports a function to analyze a single comment. I found sentences with the most "negative" sentiment analysis score were [subjectively] the most interesting. I decided to use the most "negative" sentence from a comment as its "pull quote" candidate for tweeting. The text analyzer also hashes the comment to only consider identical "form letter" comments once.

Source: [quoter/src/analyzer.js][text-analyzer]

```javascript
export default (commentText) => {
  // The Tokenizer has a notion of words describing itself. Not used here.
  const tokenizer = new Tokenizer('unused', 'unused');
  tokenizer.setEntry(commentText);

  const pullQuote = tokenizer.getSentences()
    // Score each sentence
    .map(sentence => ({
      sentence,
      score: sentiment(sentence).score,
    }))
    // Select a single sentence with the most negative score and the longest character length
    .reduce((min, curr) => {
      const last = min || curr;
      return last.score < curr.score
        ? last
        : (
          last.sentence.length < curr.sentence.length ? curr : last
        );
    });
  
  // Hash the comment for duplication checks
  const hash = md5(tokenizer.getTokens().join(' '));

  return {
    pullQuote,
    hash,
  };
};
```

The [comment selector and formatter][comment-selector-and-formatter] exports a function that ultimately returns a single comment to tweet. It gets the comments from the Regulations.gov API client and maps each comment through the text analyzer. It takes in a list of hashes from previous tweets to exclude those comments. It also ensures that the pull quote can fit into a tweet.

The tweeter is the main body of the webtask. It initializes the Twitter client, gets the list of hashes out of the webtask context storage, and calls the comment selector and formatter to pick its tweet. Once it successfully tweets, the hash is added to the list in context storage.

Source: [quoter/src/index.js][tweeter]

```javascript
module.exports = (ctx, cb) => {
  const docketId = 'DOI-2017-0002';
  const apiKey = ctx.secrets.REGULATIONS_GOV_API_KEY;
  const backlogCount = 500;

  // Set up Twitter API client
  const client = new Twitter({
    consumer_key: ctx.secrets.TWITTER_CONSUMER_KEY,
    consumer_secret: ctx.secrets.TWITTER_CONSUMER_SECRET,
    access_token_key: ctx.secrets.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: ctx.secrets.TWITTER_ACCESS_TOKEN_SECRET
  });

  // Get the context storage into `data`
  ctx.storage.get((error, data) => {
    const backlog = data || {};

    if (ctx.data.dump) {
      cb(null, backlog);
      return;
    }

    // Get a single comment to tweet
    getSingleComment(apiKey, docketId, backlogCount, backlog)
      // Then tweet it
      .then(document => {
        const status = `${document.tweet} ${document.targetUrl}`;
        return client.post('statuses/update', { status }).then(() => document);
      })
      // Then add the comment's hash to the context storage 
      .then(document => {
        backlog[document.hash] = true;
        backlog.lastError = null;
        // If something bad happened while saving to context storage, log it to STDERR and move on. No big deal.
        ctx.storage.set(backlog, console.error);
        return document;
      })
      // Then hit the webtask's callback and end this request
      .then(cb.bind(null, null))
      // If anything went wrong with the above, handle it
      .catch(err => {
        console.error('error', err);
        /* snip; Do some handling of specific errors */
      });
  })
}
```

Testing this work is as simple as hitting the webtask's endpoint in a browser. However, I wanted this to run on its own, checking for comments and tweeting every 10 minutes. I set up the webtask on a schedule with a simple change to the CLI command:

```bash
wt cron schedule -b --secrets-file .secrets 10m .
```

In order to make my code a little more usable by other developers and to save myself from having to remember all the switches for the CLI, I added two scripts to my `package.json` file. Also, I added `wt-cli` as a dev dependency.

Source: [quoter/package.json][package-file]

```json
"scripts": {
    "start": "wt create -w -b --secrets-file ../.secrets .",
    "publish": "wt cron schedule -b --secrets-file ../.secrets 10m ."
},
```

Now [@EO13792Bot][eo13792bot-twitter] is tweeting on its own! Following the bot has given me an insight into some of the 300,000 comments that people have made. And I'm ecstatic to spend my time hacking on my bot ideas and trust the infrastructure and hosting to Auth0!

I've made the source for [@EO13792Bot][eo13792bot-twitter] available on [GitHub][eo13792bot-website]. Take a peek!

[kazemi-website]: http://tinysubversions.com/
[kazemi-twitter]: https://twitter.com/tinysubversions
[botwiki-website]: https://botwiki.org/
[botwiki-twitter]: https://twitter.com/botwikidotorg
[docket]: https://www.regulations.gov/document?D=DOI-2017-0002-0001
[eo13792bot-website]: https://github.com/thzinc/eo13792bot
[eo13792bot-twitter]: https://twitter.com/eo13792bot
[twitter-apps]: https://apps.twitter.com/
[data-gov]: https://api.data.gov/signup/
[regulations-gov-api-client]: https://github.com/thzinc/eo13792bot/blob/master/quoter/src/regulations-gov-api.js
[text-analyzer]: https://github.com/thzinc/eo13792bot/blob/master/quoter/src/analyzer.js
[comment-selector-and-formatter]: https://github.com/thzinc/eo13792bot/blob/master/quoter/src/tweetUtils.js
[tweeter]: https://github.com/thzinc/eo13792bot/blob/master/quoter/src/index.js
[package-file]: https://github.com/thzinc/eo13792bot/blob/master/quoter/package.json
[webtask-io]: https://webtask.io/
[webtask-io-editor]: https://webtask.io/make
