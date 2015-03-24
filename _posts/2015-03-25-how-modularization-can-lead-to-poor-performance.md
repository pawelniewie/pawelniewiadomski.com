---
layout: post
title: How too much modularization can lead to poor performance
tags:
- java
- api
- performance
- modularization
---
I've been leading a team working on improving JIRA's performance for large customers for a few months. I think it's time to share some observations about the changes we did and the overall way to make applications fast. This will be the first post in the series in which I'm going to describe the landscape.

JIRA has more than 12 years so you can imagine many different patterns in the code, it is like geological eras laying one on top of the other. You can see all those different ways of crafting the code that were once popular. So you have simple POJOs, Smart Objects, Managers, Services, Web Actions, different templating systems (like Soy, Velocity and Webwork JSPs), you have two way to handle dependency injection PICO for internals and Spring for external plugins.

Now when I mention plugins you need to understand JIRA is a product with multiple extension points, you can do a lof of things with plugins, actually half of the product is built as plugins for it - so you understand how powerful the plugin system is.

There's a huge number of different APIs you can use to write a plugin. Because JIRA is so popular and so many customers built their own plugins there had to be an API for everything ;-)

And this is the first problem, that I'm going to discuss.

You see generic APIs lead to generic performance. Modularization and de-coupling is great. But imagine an action that uses multiple components to do its job, each of them queries the database, and say they are actually getting objects that are tight closely (for example all backed by tables that are sharing foreign keys).

Now the code is nice and simple to follow, but the performance is not - each of those separate components queries could be potentially replaced with one single JOIN. But that would be totally against this modularization, also this would probably be a specialized method that the plugin needs, so it should not land in the official API.

To make things worse because those APIs can be used by plugins and those plugins also do complex stuff there needs to be a lot of caching done because otherwise performance would be tragic.

So you see what I'm getting at - at some point modularization can be really expensive in terms of overall performance.

That's why I like the idea Ruby on Rails uses that encourages writing real queries against the database and discurages you from creating any managers/services. You see in Java you usually write a service that runs validation, inserting and updating, then you have some stupid POJOs that are written/read from the db. You need to have this mid layer.

In Rails contrary the idea is that the object that gets stored in the database handles all the validation, publishes events which can be consumed by other parts and so on, that gives you a way to escape away from this middle layer, so you can write queries whenever you like, real SQL (ok, not real, but via nice abstraction model).

I believe this approach scales better, now we'll have to figure our how to combine it with the existing code and persistence framework.

But in case you're starting from scratch you can try using [ActiveJDBC](http://javalite.io) which offers the same model for Java!
