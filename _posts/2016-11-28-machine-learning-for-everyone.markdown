---
layout: post
title: “Machine Learning for Everyone“
description: Learn the basics of predictive modelling behind one of the most used machine learning models
date: 2016-11-28 09:00
alias: /2016/11/28/machine-learning-for-everyone/
category: Data, Machine Learning
author:
  name: Pablo Casas
  url: https://twitter.com/datasciheroes
  mail: pablo.casas@auth0.com
  avatar: https://s.gravatar.com/avatar/759facc84628c0cc0746d347f217218e?s=80
design:
  bg_color: "#428bca"
  image_bg_color: "#408dd2"
  image: https://cdn.auth0.com/blog/machine-learning-1/random_forest.png
  image_size: "70%"
tags:
- r
- rstats
- data-science
- data
- machine-learning
- random-forest
---


### About Machine Learning

We all know that is about handling data, but it also can be seen as:

> The art of finding order in data browsing its inner information.


#### Some background on predictive models

There are several types of predictive models. These models usually have several input columns, and one target or outcome column, which is the variable to predict.

<img src="https://cdn.auth0.com/blog/machine-learning-1/predictive_model_table.png" width="500px">

So basically a **model does a mapping between inputs and an output**, finding -mysteriously sometimes- the relationships between the input variable in order to predict any other.

<br>

As you may notice, there is some common points with a human being who: `reads the environment => process the information => and does certain action`.

### So what is this post about?

It's about getting in touch with one of the most used predictive models: **Random Forest** (<a href="https://www.stat.berkeley.edu/~breiman/RandomForests/cc_home.htm" target="blank">official algorithm's site</a>), <a href="https://cran.r-project.org/web/packages/randomForest/randomForest.pdf" target="blank">implemented in R</a>, one of the most used models due to its simplicity in tuning and robustness across many different types of data.

If you never did a predictive model before, and you want to, this may be a good starting point ;)

<br>
 
#### Don't get lost in the forest!

<img src="https://cdn.auth0.com/blog/machine-learning-1/random_forest_bear.png" width="300px">

Basic idea behind it is to build hundreds/thousands of **less-robust and simple models** (aka <a href="https://en.wikipedia.org/wiki/Decision_tree_learning">decision trees</a>), in order to have a less-biased model.

**But how?**

Every 'tiny' of these decision tree models will see just a part from the whole data, producing theirs humble predictions. So the final decision produced by random forest is the **voting of all the others decision trees**. Just like democracy.

**And what is a decision tree?**

You're already familiar with **decision tree** output, they produce `IF-THEN` rules, like: `If the user has more than 5 visits probably she/he will use the app`.

<img src="https://cdn.auth0.com/blog/machine-learning-1/decision_tree.png" width="300px">

<br>

#### Putting all together...

If random forest has `3 trees` (but normally +500), and a **new customer arrives**, then the prediction regarding if some customer is gonna buy certain product will be `yes! she/he will buy it!` if `2 trees` said `yes`.

<img src="https://cdn.auth0.com/blog/machine-learning-1/random_forest.png" width="600px">

<br>

> Having hundreds of opinions -_decision trees_- tend to produce a more accurate truth in average -_random forest_-.


<br>

_But don't panic, all of the above is encapsulated to the data scientist._

With this model you will not be able to easily know _how_ the model leads to assign a high or low probability to each input case. They act more like a black-box, like what is used in **Deep Learning** with neural networks, where every neuron contributes to a whole.

<br>

### Next post...

Will contain an example -based on real data- on how random forest **orders** the customers according to their likelihood of matching certain business condition. Also, it will **maps around 20 variables into only 2**, therefore it can be seen by the analyst ;)

<img src="https://cdn.auth0.com/blog/machine-learning-1/next_post.png" width="100px">

<br>

### What language is convenient to learn Machine Learning?

Auth0 mainly use <a href="https://www.r-project.org/" target='blank'>R software</a> to create **predictive models** as well as other data processes, for example:

* Finding relationships between app features: which impact on **engineering area**.
* Finding **anomalies** or abnormal behavior: which leads to the development of <a href='https://auth0.com/docs/anomaly-detection' target='blank'> anomaly detection </a> feature.
* Improving web browsing <a href='https://auth0.com/docs' target='blank'>docs</a>: based on <a href='https://en.wikipedia.org/wiki/Markov_chain'>markov chains</a> (likelihood of visiting `Page B being on Page C`)
* Reducing times in answering **support tickets** using Deep Learning (not with R, but: <a href="https://keras.io/" target='blank'>Keras</a>)

If you want to do your own data science projects, you could start with **R**. It has a **enormous community** from which you can learn (and teach). It's not always just a matter of complex algorithms, but to have support when things don't go as expected. And this occurs **often** when doing new things.

<img src="https://cdn.auth0.com/blog/machine-learning-1/R_logo.png" width="100px">

#### Finally, some numbers about Community Support
Despite the fact R (and `Python` with `pandas` and `numpy`) has lots of packages, libraries, free books and free courses, check these metrics: There are more than **160.000** questions in <a href="http://stackoverflow.com/questions/tagged/r">stackoverflow.com</a> and others **~15.000** in <a href="http://stats.stackexchange.com/questions/tagged/r">stats.stackexchange.com</a> tagged with **R**.

<br>
