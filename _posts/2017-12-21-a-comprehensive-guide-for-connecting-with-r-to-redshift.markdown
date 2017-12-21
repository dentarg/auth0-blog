---
layout: post
title: "A comprehensive guide to connect to Amazon Redshift from R"
description: "A guide through the available drivers and tools to make your life easier when using Amazon Redshift from R and/or RStudio"
longdescription: "A guide through the available drivers and tools to make your life easier when using Amazon Redshift from R and/or RStudio. We examine RPostgreSQL, RPostgres, RJDBC and find out which one is better for each case. Then we also introduce redshiftTools which can help bulk upload data into your DataWarehouse."
date: 2017-12-21 12:00
category: Technical Guide, Data, R
author:
  name: Pablo Seibelt
  url: https://twitter.com/sicarul
  mail: pablo.seibelt@auth0.com
  avatar: https://secure.gravatar.com/avatar/bb9128fac91692ad4f46a785d772dd39?s=200
design:
  bg_color: "#1F5894"
  image: https://cdn.auth0.com/blog/r-to-redshift/logo.png
tags:
- r
- rstats
- data-science
- data
- redshift
- amazon-redshift
related:
- 2016-12-13-adding-authentication-to-shiny-server
- 2016-12-06-machine-learning-for-everyone
- 2017-01-27-machine-learning-for-everyone-part-2-abnormal-behavior
---


[Amazon Redshift](https://aws.amazon.com/redshift/) is one of the hottest databases for Data Warehousing right now, it's one of the most cost-effective solutions available, and allows for integration with many popular BI tools. Unfortunately, the status of the drivers compatibility is a little more shaky, but there is a way to make it work very nicely with [R](https://www.r-project.org/)!

{% include tweet_quote.html quote_text="The status of Redshift drivers compatibility with R is a little shaky, but there is a way to make it work fine." %}

First of all, let's go through the 3 options we have for connecting to Amazon Redshift. For all of the connections, we'll define these variables for connecting:


```r
dbname="dbname"
host='my-redshift-url.amazon.com'
port='5439'
user='myuser'
password='mypassword'
```

## RJDBC

This is the ["official" way to use Amazon Redshift with R](https://aws.amazon.com/blogs/big-data/connecting-r-with-amazon-redshift/), using the JDBC driver on [SQL Workbench/J](http://www.sql-workbench.net/) is the official way to connect to it according to the documentation, and this driver can be loaded like this:



```r
# Save the driver into a directory
dir.create('~/.redshiftTools')
download.file('http://s3.amazonaws.com/redshift-downloads/drivers/RedshiftJDBC41-1.1.9.1009.jar','~/.redshiftTools/redshift-driver.jar')
install.packages('RJDBC')
```


```r
suppressPackageStartupMessages(library(RJDBC))

# Use Redshift driver
driver <- JDBC("com.amazon.redshift.jdbc41.Driver", "~/.redshiftTools/redshift-driver.jar", identifier.quote="`")

# Create connection    
url <- sprintf("jdbc:redshift://%s:%s/%s?tcpKeepAlive=true&ssl=true&sslfactory=com.amazon.redshift.ssl.NonValidatingFactory", host, port, dbname)
jconn <- dbConnect(driver, url, user, password)
```

Of course you can change the url with the options you need for your particular setup. The first 3 lines you only need to run them once, they download Redshift's official JDBC driver and install the RJDBC package.

This package was the only one I found which supported transactions on Redshift (`BEGIN`, `COMMIT`, `ROLLBACK`) until recently, otherwise on other packages DDL operations will autocommit.

Until a few days ago since the writing of this blogpost, this was the recommended package for uploading data and inserting/deleting data, since you usually want be able to unite your operations which modify data into a single transaction.

This package has some big problems though, which I'll explain later on this post.

## RPostgreSQL

Amazon Redshift is mostly PostgreSQL compatible, so most PostgreSQL drivers work well. [RPostgreSQL](code.google.com/p/rpostgresql) is configured like this:



```r
install.packages('RPostgreSQL')
```

```r
library(RPostgreSQL)
drv <- dbDriver("PostgreSQL")
pconn_rsql <- dbConnect(drv,
                 host = host,
                 port = port,
                 user = user,
                 password = password,
                 dbname = dbname)
```

There are two major problems with this driver though: It [lacks SSL support](https://stackoverflow.com/questions/38942118/can-not-connect-postgresqlover-ssl-with-rpostgresql-on-windows), and you don't have transactions like you do with the official driver. In my humble opinion this is not a good option, even if you don't use SSL now, if your company requires it in the future you may need to change all your code to switch drivers. The good thing is this driver works fine with [dbplyr](http://dbplyr.tidyverse.org/).

{% include tweet_quote.html quote_text="The RPostgreSQL driver doesn't support SSL-secured Redshift clusters." %}

## RPostgres

This is another PostgreSQL library, that has much better support using the [libpq library](https://www.postgresql.org/docs/9.6/static/libpq.html), you'll probably need to install the postgresql development header libraries locally for this one to be installed succesfully. [Check out the official docs for installing instructions if you run into issues.](https://github.com/r-dbi/RPostgres)



```r
install.packages('RPostgres')
```

```r
library(RPostgres)
pconn_r <- dbConnect(RPostgres::Postgres(),
               host = host,
               port = port,
               user = user,
               password = password,
               dbname = dbname,
               sslmode='require')
```

RPostgres supports transactions, SSL and works fine with dbplyr.

## Gotchas With The Libraries

So, what are some gotchas with these libraries?. We'll run this in SQL Workbench/J to have some data to test:


```sql
create table sicatest (
  a varchar(100),
  b bigint,
  c date,
  d timestamp,
  e boolean
);
insert into sicatest values
('Hello', 1, '2017-10-01', '2017-10-01 20:00:00', TRUE);
insert into sicatest values
('Hello ñandu', 9223372036854775807, '2017-12-30', '2017-12-11 23:59:00', FALSE);
insert into sicatest values
('こんにちは', 9223372036854775807, '2017-12-30', '2017-12-11 23:59:00', NULL);
commit;
```

We deliberately added the Ñ letter from spanish, and こんにちは (Kon'nichiwa) which is hello in japanese to have some non-ascii stuff, and see if it's handled correctly.

So, let's start with RJDBC:


```r
suppressPackageStartupMessages(library(dplyr))
sicatest = dbGetQuery(jconn, 'select * from sicatest')
dplyr::glimpse(sicatest)
```

```
## Observations: 3
## Variables: 5
## $ a <chr> "こんにちは", "Hello ñandu", "Hello"
## $ b <dbl> 9223372036854775808, 9223372036854775808, 1
## $ c <chr> "2017-12-30", "2017-12-30", "2017-10-01"
## $ d <chr> "2017-12-11 23:59:00.000000", "2017-12-11 23:59:00.000000", ...
## $ e <chr> NA, "false", "true"
```

Well, that didn't go as expected, right? If you look closely, the table has the number `9223372036854775807`, but the query has returned `9223372036854775808` 😱. This happens because the numeric integer is automatically converted to a floating point numeric, which loses precision with big numbers.

Also unfortunately, it has returned dates and booleans as strings, which is incorrect, but we can work around that. Let's compare with `RPostgres`.



```r
sicatest2 = dbGetQuery(pconn_r, 'select * from sicatest')
glimpse(sicatest2)
```

```
## Observations: 3
## Variables: 5
## $ a <chr> "Hello ñandu", "Hello", "こんにちは"
## $ b <S3: integer64> 9223372036854775807, 1, 9223372036854775807
## $ c <date> 2017-12-30, 2017-10-01, 2017-12-30
## $ d <dttm> 2017-12-11 23:59:00, 2017-10-01 20:00:00, 2017-12-11 23:59:00
## $ e <lgl> FALSE, TRUE, NA
```
Well well, that's much better isn't it? the numbers aren't modified, they are of the correct type (int64), and it correctly guessed types `date`, `datetime` and `logical/boolean`! If integer64 is problematic in your case, you can also choose to convert bigint fields into other types, by using the `bigint` parameter when creating the connection.

Great stuff! I think this is the kind of library we want to work in a day-to-day basis. Also, you can use this same connection to explore data with dbplyr:


```r
sica_ref = tbl(pconn_r, 'sicatest')

r = select(sica_ref, d, a) %>%
  mutate(rank=min_rank(desc(d))) %>%
  filter(rank==1) %>%
  collect()
knitr::kable(r, format='markdown')
```



|d                   |a           | rank|
|:-------------------|:-----------|----:|
|2017-12-11 23:59:00 |Hello ñandu |    1|
|2017-12-11 23:59:00 |こんにちは  |    1|

Before, this library failed with transactions, so something like this failed, but now it works fine!


```r
dbExecute(pconn_r, "BEGIN")
dbExecute(pconn_r, "COMMENT on table sicatest is 'best table ever'")
dbExecute(pconn_r, "ROLLBACK")
```

That's why, for maximum efficiency with R + Redshift, I recommend to use `RPostgres`, as it's the best library available today.

{% include tweet_quote.html quote_text="For maximum efficiency with R + Redshift, we can use RPostgres." %}

Having said that, there's an additional tool which I'd like to introduce to you, which is the `redshiftTools` R Package, it'll add nicely to your toolkit and supports either RJDBC or RPostgres connections. This package is MIT licensed and it's source is available at [https://github.com/sicarul/redshiftTools](https://github.com/sicarul/redshiftTools).


```r
  install.packages(c('devtools', 'httr', 'aws.s3'))
  devtools::install_github("RcppCore/Rcpp")
  devtools::install_github("r-dbi/DBI")
  devtools::install_github("sicarul/redshiftTools")
```

After installing, you'll have 4 helpful functions to use, which are explained in full detail in [the package's README](https://github.com/sicarul/redshiftTools).

`rs_create_statement`: Generates the SQL statement to create a table based on the structure of a data.frame. It allows you to specify sort key, dist key and if you want to allow compression to be added or not.

`rs_replace_table`: Deletes all records in a table, then uploads the provided data frame into it. It runs as a transaction so the table is never empty to the other users.

`rs_upsert_table`: Deletes all records matching the provided keys from the uploaded dataset, and then inserts the rows from the dataset. If no keys are provided, it acts as a regular insert.

`rs_create_table`: This just runs *rs_create_statement* and then *rs_replace_table*, creating your table and uploading it.

This package is helpful because uploading data with inserts in Redshift is super slow, this is the recommended way of doing replaces and upserts [per the Redshift documentation](http://docs.aws.amazon.com/redshift/latest/dg/t_Loading-data-from-S3.html), which consists of generating various CSV files, uploading them to an S3 bucket and then calling a copy command on the Redshift server, all of that is handled by the package.

I hope this guide let's you unlock the full potential of R + Amazon Redshift, two great tools that work very well together when well configured. We use this methodology inside Auth0 and we think it's very useful for other organizations with similar infrastructure.

If you are interested in reading other posts about our work with Data @ Auth0, you may enjoy [Machine Learning for everyone](https://auth0.com/blog/machine-learning-for-everyone/) and [Adding Authentication to Shiny Server in 4 Simple Steps](https://auth0.com/blog/adding-authentication-to-shiny-server/).

{% include asides/market-basket-links-about.markdown %}
