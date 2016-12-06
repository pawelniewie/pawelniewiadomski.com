---
layout: post
title: Is unless in Ruby really a shortcut?
tags:
- rails
- ruby
- unless
---
I'm not a big fan of `unless` in Ruby. I don't like it in other languages as well. It's not that I find this construct flawed, I just don't like it. For me `if !condition` is much easier to process.

Different code style checkers by default encourage you to use `unless`. I'm not sure if that's a good idea. Not saying it's bad either. Up to you 🤔

You see, I'm not a native English speaker, although I've been using English for most of my life and I've been coding for almost the same amount of time each time I see `unless` I need to make an effort to process it.

I just find it harder to process it than `if`, only a bit harder though. It's not that I need to stop, but I feel the difference.

We had this discussion in our team and it looks like I'm not the only one. So I ran a simple survey in the company, got 16 results out of which only 2 people were native speakers. You can guess already that for those two `unless` is as easy to comprehend as `if`. For the rest is basically 50/50.

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

The last chart for me is the most interesting. It may show that for my group `unless` comprehension didn't improve with the years of experience.

I ran this survey out of curiosity, it was fun watching results but they don't prove anything. 

Please don't think I'm saying you should drop `unless`. But just think how to use the language and tools in the most efficient way for your team.

How do you feel about unless? [Want to take part in the survey?](https://servicedesk-feedback.typeform.com/to/fTWSs2)