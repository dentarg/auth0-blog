---
layout: post
title: "Beyond React 16: Time Slicing and Suspense API"
description: "Learn what's coming to ReactJS. Get a sneak peek of the powerful features that will grace ReactJS soon."
longdescription: "Time Slicing, Suspense and the Fetcher API are new features and concepts that will land soonest in stable releases of ReactJS. Learn how they work."
date: 2018-03-06 08:30
category: Technical Guide, Frontend, React
design:
  bg_color: "#1A1A1A"
  image: https://cdn.auth0.com/blog/reactjs16/logo.png
author:
  name: Prosper Otemuyiwa
  url: https://twitter.com/unicodeveloper
  mail: prosper.otemuyiwa@auth0.com
  avatar: https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200
tags:
- react
- reactjs
- javascript
- reactfiber
- fiber
- frontend
- time-slicing
- suspense
- fetcher
- authentication
related:
- 2017-02-21-reactjs-authentication-tutorial
- 2017-01-24-optimizing-react
- 2018-02-06-developing-games-with-react-redux-and-svg-part-1
---

---

**TL;DR:** [ReactJS](https://reactjs.org) is a UI library that's a very powerful tool amongst frontend developers in building JavaScript applications. In this article, I'll introduce you to a few features coming to ReactJS.

---

ReactJS is a JavaScript library, built and maintained by Facebook. As of today, it powers so many popular web and mobile platforms such as Twitter, Airbnb, Lyft, Dropbox, Pinterest, Whatsapp and Instagram. The latest release of ReactJS which is _React 16_ ships with a lot of features such as `Error Boundaries`, `Custom DOM Attributes definition`, `Fragments as return types`, `Portals` and many others.

However, the ReactJS team is not slacking. They are hard at work looking for new ways to make React a highly performant library in UI component development. A sneak peek into new features coming to React was demoed by the _creator of Redux_ and _React core team member_, [Dan Abramov](https://twitter.com/dan_abramov) at **JSConf Iceland, 2018.** If you haven't watched Dan's talk, here is the [demo](https://www.facebook.com/react/videos/1552821821462886/).

## What's coming to ReactJS?

Making it easier for developers to build great user experiences using ReactJS has always been the goal of the ReactJS team. Building for great user experiences involves splitting the attention of developers into two distinct categories:

* **Computing Power**
* **Network Speed**

With these categories spelt out, you start asking the following questions:

- Are the users on a slow network? If so, how's the user experience? Can we (developers) control the loading states?
- Are the users on a low-end device (devices with low CPU power)? If so, is using the app still a memorable experience effectively?
- Are the users on a fast network? If so, is the experience seamless? No janky UI.
- Are the users on a high-end device (devices with high CPU power)? If so, is the rendering flawless?

These are valid questions that need answers. Let's explore how **Time Slicing** and **Suspense** in ReactJS can help deliver the best user experience for everyone.

## Time Slicing

In Dan's talk, he said: _"We’ve built a generic way to ensure that high-priority updates like user input don’t get blocked by rendering low-priority updates"_. What does this mean? The ReactJS team named this concept **Time Slicing**. Let me explain in simpler terms.

{% include tweet_quote.html quote_text="Dan Abramov: We’ve built a generic way to ensure that high-priority updates like user input don’t get blocked by rendering low-priority updates." %}

ReactJS is concerned about a device's CPU power. While rendering, ReactJS ensures that it doesn't block the thread thus causing the app to freeze. 

**Time-slicing** allows ReactJS, which now runs on _React Fiber_, to split computations of updates on children components into chunks during idle callbacks and rendering work is spread out over multiple frames. Now, during the process of asynchronous rendering, it ensures that if a user's device is very fast, updates within the app feel synchronous and if a user's device is slow, the app feels responsive. No freezing, No janky UI experience!

## Suspense

In Dan's talk, he said: "We have built a generic way for components to suspend rendering while they load asynchronous data". 

The simple definition of the **suspense** feature is that ReactJS can pause any state update until the data been fetched is ready to be rendered. In essence, ReactJS suspends the component tree while waiting for the data to be fetched completely. During the suspension, it goes ahead to handle other high-priority updates. 

{% include tweet_quote.html quote_text="Dan Abramov: We have built a generic way for components to suspend rendering while they load asynchronous data." %}

[Andrew Clark](https://twitter.com/acdlite), (author of the suspense feature), gave a practical breakdown of how the suspense feature works in the tweets below:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Here&#39;s how suspending works:<br><br>- in the render method, read a value from the cache.<br>- if the value is already cached, the render continues like normal<br>- if the value is not already cached, the cache *throws a promise*<br>- when the promise resolves, React retries where it left off</p>&mdash; Andrew Clark (@acdlite) <a href="https://twitter.com/acdlite/status/969171217356746752?ref_src=twsrc%5Etfw">March 1, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Dan used an API from `Future React` called `createFetcher` (_this name is likely to change_) in his demo to demonstrate how the **suspense** feature works. The `createFetcher` function is a basic cache system that allows React to suspend the data fetching request from within the render method. According to Andrew Clark, it's called the [simple-cache-provider](https://github.com/facebook/react/tree/master/packages/simple-cache-provider).

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">createFetcher from <a href="https://twitter.com/dan_abramov?ref_src=twsrc%5Etfw">@dan_abramov</a>&#39;s talk is this thing:<br><br>We&#39;re calling it simple-cache-provider (for now). It&#39;s a basic cache that works for 80% of use cases, and (when it&#39;s done) will serve as a reference implementation for Apollo, Relay, etc.<a href="https://t.co/elI6YFco0A">https://t.co/elI6YFco0A</a></p>&mdash; Andrew Clark (@acdlite) <a href="https://twitter.com/acdlite/status/969168681644179456?ref_src=twsrc%5Etfw">March 1, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

I'll borrow a practical example from the [React Apollo's team initial implementation](https://dev-blog.apollodata.com/a-first-look-at-async-react-apollo-10a82907b48e) to show you how suspense works. The React Apollo team imitated the **suspense** feature by suspending the result of a GraphQL query.

```js
const MOVIE_QUERY = gql`
  query GetMovie($id: Int!) {
    movie(id: $id) {
      id
      title
      overview
      poster_path
    }
  }
`;
function MovieInfo({ movie, clearActiveResult }) {
  return (
    <Query asyncMode query={MOVIE_QUERY} variables={{ id: movie.id }}>
      {({ data: { movie } }) => (
        <Fragment>
          <FullPoster movie={movie} />
          <h2>{movie.title}</h2>
          <div>{movie.overview}</div>
        </Fragment>
      )}
    </Query>
  );
}
```
_GraphQL query_

In the example above, there is an `asyncMode` prop attached to the `Query component` that allows for async rendering. The sample code below shows the render method in the `Query` component.

```js
....
if (loading) {
    if(this.props.asyncMode) {
        throw this.state.queryObservable!.result();
    }
}
Object.assign(data.data, this.previousData, currentResult.data);
```
_Query component render method_


If the `async` mode is turned on, rendering is suspended till data is fetched. In the example above, it throws a promise in async mode. During the suspension, a developer can now effectively control the loading states via using a component with a prop that has a time limit attached to it as shown below or through the `loading` API method from the `createFetcher`. 


```js
<Placeholder 
    delayMs={1000} 
    fallback={<Loadingsize="medium" color="blue" />}
```

**Note:** Dan Abramov mentioned that there is the concept of a loading API from the `simple-cache-provider`. It might land as a `Loading` component or the name might change in upcoming ReactJS releases.

> In React, if a component suspends, we keep rendering the siblings as deeply as we can. Suspend means "don't commit," not "don't reconcile." - **Andrew Clark**

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Did You Know™<br><br>React Suspense doesn&#39;t necessarily rely on async rendering. It works in sync mode, too. But the downside is that those &lt;Placeholder /&gt; components are immediately triggered, without any delay.<br><br>Those `delayMs` props illustrate why async rendering is so good for UX.</p>&mdash; Andrew Clark (@acdlite) <a href="https://twitter.com/acdlite/status/969318507966906368?ref_src=twsrc%5Etfw">March 1, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Did You Know™<br><br>You can suspend from inside of getDerivedStateFromProps. It “just works” because it’s part of React’s render phase.<br><br>You can also suspend inside a setState reducer (first argument).</p>&mdash; Andrew Clark (@acdlite) <a href="https://twitter.com/acdlite/status/969428655238557697?ref_src=twsrc%5Etfw">March 2, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>



Another use case is `Code splitting`. Code splitting is a concept used in improving performance by loading only the code a particular page needs in an application. `Code splitting` works well with the `suspense` feature.

```js
import { createFetcher } from 'React';

// dynamic imports
const moviePageFetcher = createFetcher(
    () => import('./MoviePage')
);

// get the MoviePage component
const moviePage = moviePageFetcher.read().default;

...
```

The code above loads the MoviePage component only when it is needed while taking advantage of the **suspense** feature via the `createFetcher` method.

{% include asides/react.markdown %}

## Conclusion

I'm overwhelmed by the engagement of React core team members with members of the JavaScript community in landing new features in React. Worthy of note is that the APIs mentioned in this article are experimental. This is an introduction to the features that are expected to land in React soon. I'm anxious. I can't wait for these APIs to be stable.

I'll be sure to cover these features in detail and any improvements made to them when they finally land in ReactJS.

What are your thoughts on these features? Let me know in the comments section! 😊
