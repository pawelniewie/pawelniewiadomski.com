---
title: "Making specs better and other links"
date: "2017-01-06"
description: "Today couple of links that hopefully will make specs better. Here's two in one - a nice blog post about using metadata in your specs to drive different..."
tags:
  - pack
  - links
thumbnail: "/images/2017/test_sign.jpg"
series: "monday-link-pack"
---
![](/images/2017/test_sign.jpg)

Today couple of links that hopefully will make specs better.

Here's two in one - [a nice blog post](https://semaphoreci.com/community/tutorials/using-rspec-metadata) about using metadata in your specs to drive different behavior like cleaning a database, plus a good example of setting up database cleaner.

Ever wondered how to test Rails generators in your gem? Here's [a good article](https://rossta.net/blog/testing-rails-generators.html) on this topic.

Using database cleaner? You should probably [consider using deletion strategy](http://sevenseacat.net/2015/02/01/use_database_cleaners_deletion_strategy.html). But you mileage may vary - in our project it didn't yield any performance gains.

And here's some interesting alternative to database cleaner - [database flusher](https://github.com/ebeigarts/database_flusher/). Author claims it to be faster, haven't checked it out yet.

[Here's a small speed up for Rails 5](https://gist.github.com/printercu/23bce83879eaaf8161410324ad56b235) (if you haven't upgraded yet to 5.0.2). Seems template views are recompiled in tests every request, that sounds slow!

[Using rspec parts in your code](http://zverok.github.io/blog/2016-09-02-rspec-tricks.html) - I like the idea of using matchers for better `case ... when` but mocking and other unholy tricks - that's 💩