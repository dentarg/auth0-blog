---
layout: post
title: "Machine Learning for Everyone"
description: Learn the basics of predictive modeling behind one of the most-used machine learning models
date: 2016-12-06 12:00
category: Technical Guide, Data, Machine Learning
author:
  name: Pablo Casas
  url: https://twitter.com/datasciheroes
  mail: pablo.casas@auth0.com
  avatar: https://s.gravatar.com/avatar/759facc84628c0cc0746d347f217218e?s=80
design:
  bg_color: "#222228"
  image: https://cdn.auth0.com/blog/machine-learning-for-everyone/logo.png
tags:
- r
- rstats
- data-science
- data
- machine-learning
- random-forest
related:
- 2016-07-22-customer-data-is-king-four-ways-to-know-your-customers-better
- 2016-07-21-analysis-of-social-connection-data
---

We all know that machine learning is about handling data, but it also can be seen as:

> The art of finding order in data by browsing its inner information.


### Some background on predictive models

There are several types of predictive models. These models usually have several input columns and one target or outcome column, which is the variable to be predicted.

![Predictive Model Table](https://cdn.auth0.com/blog/machine-learning-1/predictive_model_table.png)

So basically, a **model performs mapping between inputs and an output**, finding-mysteriously, sometimes-the relationships between the input variables in order to predict any other variable.

As you may notice, it has some commonalities with a human being who `reads the environment => processes the information => and performs a certain action`.

## So what is this post about?

It's about becoming familiar with one of the most-used predictive models: **Random Forest** (<a href="https://www.stat.berkeley.edu/~breiman/RandomForests/cc_home.htm" target="blank">official algorithm site</a>), <a href="https://cran.r-project.org/web/packages/randomForest/randomForest.pdf" target="blank">implemented in R</a>, one of the most-used models due to its simplicity in tuning and robustness across many different types of data.

If you've never done a predictive model before and you want to, this may be a good starting point ;)
 
### Don't get lost in the forest!

![Random Forest Bear](https://cdn.auth0.com/blog/machine-learning-1/random_forest_bear.png)

The basic idea behind it is to build hundreds or even thousands of **simple and less-robust models** (aka <a href="https://en.wikipedia.org/wiki/Decision_tree_learning">decision trees</a>) in order to have a less-biased model.

**But how?**

Every 'tiny' branch of these decision tree models will see just part of the whole data to produce their humble predictions. So the final decision produced by the random forest model is the result of **voting by all the decision trees**. Just like democracy.

**And what is a decision tree?**

You're already familiar with **decision tree** outputs: they produce `IF-THEN` rules, such as, `If the user has more than five visits, he or she will probably use the app`.

![Decision Tree](https://cdn.auth0.com/blog/machine-learning-for-everyone/decision-tree.png)

### Putting all together...

If a random forest has `three trees` (but normally 500-plus) and a **new customer arrives**, then the prediction whether said customer will buy a certain product will be 'yes' if 'two trees' predict 'yes'.

![Random Forest](https://cdn.auth0.com/blog/machine-learning-1/random_forest.png)

> Having hundreds of opinions -_decision trees_- tends to produce a more accurate result on average -_random forest_-.

_But don't panic, all of the above is encapsulated in the data scientist._

With this model, you will not be able to easily know _how_ the model comes to assign a high or low probability to each input case. It acts more like a black box, similar to what is used for **deep learning** with neural networks, where every neuron contributes to the whole.

## Next post...

Will contain an example -based on real data- of how random forest **orders** the customers according to their likelihood of matching certain business condition. Also, it will **map around 20 variables into only two**, therefore, it can be seen by the analyst ;)

<div style="text-align:center"><img src="https://cdn.auth0.com/blog/machine-learning-1/next_post.png" alt="Next Post"></div>


## What language is convenient for learning machine learning?

Auth0 mainly uses <a href="https://www.r-project.org/" target='blank'>R software</a> to create **predictive models** as well as other data processes; for example:

* Finding relationships between app features: which impacts the **engineering area**.
* Finding **anomalies** or abnormal behavior: which leads to the development of <a href='https://auth0.com/docs/anomaly-detection' target='blank'> anomaly detection </a> features.
* Improving web browsing <a href='https://auth0.com/docs' target='blank'>docs</a>: based on <a href='https://en.wikipedia.org/wiki/Markov_chain'>markov chains</a> (likelihood of visiting `Page B being on Page C`)
* Reducing times for answering **support tickets** using deep learning (not with R but with <a href="https://keras.io/" target='blank'>Keras</a>)

If you want to develop your own data science projects, you could start with **R**. It has a **enormous community** from which you can learn (and teach). It's not always just a matter of complex algorithms, but also about having support when things don't go as expected. And this occurs **often** when you're doing new things.

<div style="text-align:center"><img src="https://cdn.auth0.com/blog/machine-learning-1/R_logo.png" alt="R Logo"></div>

### Finally, some numbers about community support

Despite the fact that R (and `Python` with `pandas` and `numpy`) has lots of packages, libraries, free books, and free courses, check these metrics: There are more than **160,000** questions in <a href="http://stackoverflow.com/questions/tagged/r">stackoverflow.com</a>, and another **~15,000** in <a href="http://stats.stackexchange.com/questions/tagged/r">stats.stackexchange.com</a> are tagged with **R**.