---
title: "Ruby gotchas - trinary operator and a function call, or why white spaces matter"
date: "2016-06-17"
description: "I was refactoring code recently when I found this particular glitch in Ruby (excuse me - a feature 😉). The case was simple I wanted to clean some tests and..."
tags:
  - ruby
  - fail
  - gotcha
---
I was refactoring code recently when I found this particular glitch in Ruby (excuse me - a feature 😉). The case was simple I wanted to clean some tests and remove fixture path - it was usually the same so I decided to skip it, I didn't want to change all the code base so I decided to still allow it.

So the first-comes-to-my-mind solution was to use a trinary operator to check if the path has or has not the fixture prefix and act accordingly. That was my first attempt:

Fail:

```ruby
real_path = fixture_path.start_with? ('spec/fixtures/') ? fixture_path : "spec/fixtures/#{fixture_path}"
```

The space matched RubyMine's formatting rules that we use. To my surprise that didn't work! Why? It looks like a perfectly normal code. Isn't it?

In this case real_path will end up being a boolean `false`

Well guess what did work?

This works!

```ruby
real_path = fixture_path.start_with?('spec/fixtures/') ? fixture_path : "spec/fixtures/#{fixture_path}"
```

But this is realy fragile, so I wanted to find a more robust solution, and here it is:

```ruby
real_path = (fixture_path.start_with? ('spec/fixtures/')) ? fixture_path : "spec/fixtures/#{fixture_path}"
```

This way I enforced the function call.

Initially I though it doesn't make sense. But it actually does!

I think one of the points of Ruby is to be a great language for creating domain specific languages and in this context this is what you actually want. Remember you can drop brackets.

```ruby
connect_to_server use_https ? "https://#{server}" : "http://#{server}"
```

In case like this you actually want the trinary operator to be evaluated first, then the method to be executed. I can imagine also:

```ruby
connect_to_server ((use_https || force_https) && can_use_https) ? "https://#{server}" : "http://#{server}"
```

Just as an example.

There are even more gotchas in the language that I need to be aware so here's some reminder:

[Gotchas 1](http://blog.elpassion.com/ruby-gotchas/)

[Gotchas 2](https://docs.google.com/presentation/d/1cqdp89_kolr4q1YAQaB-6i5GXip8MHyve8MvQ_1r6_s/edit#slide=id.p)
