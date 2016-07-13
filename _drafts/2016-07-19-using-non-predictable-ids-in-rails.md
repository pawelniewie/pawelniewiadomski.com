---
layout: post
title: How to display Active Record validation errors according to Atlassian AUI?
tags:
- ruby
- rails
- security
- obscurity
---
In many applications you generate ID that are visible to customers or used in links. Rails by default use sequential integers for that which is fine in many cases. Those are simple, fast, short and look good ;-)

But they have one disadvantage - if they are visible to outside someone can learn a lot about your business. For example if you're running a shop someone can guess how many orders you process.




You can fix that easily by switching to UUIDs, this is something Rails makes it [really easy to do](http://theworkaround.com/2015/06/12/using-uuids-in-rails.html).

You can nice, non guessable identifiers like those:

```
id: 898f73bc-290c-4427-b75a-68f34464e188, title: The Raven
id: dd126f47-de45-4cbe-aa1c-8b052693498e, title: My Side of the Mountain
id: 479af9a8-c096-42e2-8a29-4a321cdd5f7c, title: The Giver
```

The only downside is that they are long and ugly, computers don't care but humans do. You probably don't want to show them to user.

Is there an alternative?

There are some nice gems you can use for that. As I need those in our application I made a research and here's a few that I found interesting.



