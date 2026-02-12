---
title: "Is unless in Ruby really a shortcut?"
date: "2016-12-06"
description: "I'm have mixed feelings about unless in Ruby. It's not I don't like it but sometimes I find it suboptimal. I feel that in some cases if !condition is much..."
tags:
  - rails
  - ruby
  - unless
---
I'm have mixed feelings about `unless` in Ruby. It's not I don't like it but sometimes I find it suboptimal. I feel that in some cases `if !condition` is much easier to process.

I'm not a native English speaker, although I've been using English for most of my life and I've been coding for almost the same amount of time each time I see `unless` I need to make an effort to process it.

It's not that I need to stop and think about it, but I feel the difference between `unless` and `if not`.

So we had this discussion about `unless` in our team recently and it looks like I'm not the only one.

Out of curiosity we decided to ran a simple survey in the company and see what's the general feeling about `unless`. 

16 people shared their experience out of which only 2 people were native speakers. You can guess already that for those two `unless` is as easy to comprehend as `if`. For the rest is basically 50/50.

### Whenever you see unless in code you:

{% image_tag src='media/2016/12/unless.png' width="572" %}

Excluding those two native speakers, would be 6, 1, 7. Charts bellow have them excluded.

### By years of using Ruby

#### Up to a year

{% image_tag src='media/2016/12/unless-less-1-year.png' width="572" %}

#### Up to three years

{% image_tag src='media/2016/12/unless-1-3-years.png' width="572" %}

### More than three years

{% image_tag src='media/2016/12/unless-3-years.png' width="572" %}

### Summary

The last chart for me is the most interesting. It may show that for my group `unless` comprehension didn't improve with the years of experience. Not sure what the reasons are.

I ran this survey out of curiosity, it was fun to watch results but they don't prove anything. 

Don't think I'm saying you should drop `unless`. I'm still using it but maybe it's not worth to enforce it as there are cases when `if not` might be actually better? Dunno, up to you. We haven't decided on anything yet.

How do you feel about unless? [Want to take part in the survey?](https://servicedesk-feedback.typeform.com/to/fTWSs2)