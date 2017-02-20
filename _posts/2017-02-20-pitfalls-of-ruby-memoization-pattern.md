---
layout: post
title: Pitfalls of Ruby's memoization pattern
tags:
- ruby
- rails
---
`@something ||= calculate_it` is so common in Ruby code. You use it often to store something "heavier". But many times it leads to sub optimal performance. You'd expect the value to be cached no matter what. But reality is different as we recently learned in our code, run this and see:

```ruby
class AdvancedService
  def self.something_big
    @local_cache ||= begin
      puts "Here I am, surprised?"
      false
    end
  end
end

AdvancedService.something_big
AdvancedService.something_big
```

`||=` is so simple to write that often you don't give much thought to it. I'm guilty of this as well. The fix is simple for that:

```ruby
class AdvancedService
  def self.something_big
    return @local_cache if defined?(@local_cache)
    @local_cache ||= begin
      puts "Here I am, surprised?"
      false
    end
  end
end
```

How many of you remember about adding it there?

Now, what's still wrong with this code? There's a big problem there. You see that's a service.

Check it out:

```ruby
AdvancedService.something_big

2.times do 
  Thread.new do
    puts AdvancedService.something_big
  end
end
```

What happened here? As `AdvancedService` is shared between threads the initialization ran only once (sometimes it can run twice when you delete first line as there's no synchronization between threads). Is that OK?

Sometimes, but I guess not that often. I recently found a code that's supposed to cache this value for the current request. But guess what? It cached it for the whole application. As most of the servers you use with Ruby/Rails are multi-threaded this will be happily shared between all requests.

To solve it you can use `Thread.current[:local_cache]` (but remember [it's not thread-local but fiber-local](https://ruby-doc.org/core-2.2.0/Thread.html#5B-5D-method), WTF?).

But hey, remember, multi-threaded server - one that re-uses threads? So this fails if you want to have a per-request cache, but don't worry [there's a gem for that](https://github.com/steveklabnik/request_store) (and probably dozen more).

I personally cache as a last resort and only if I ran out of different options. But some architectures may require it. 

I remember a time when I was working on large Java application with a multitude of DAOs (data access objects) that were querying the database to get single pieces of information (each DAO is responsible for one table usually), the problem was that different parts of the application needed the same information over and over. On the other hand the data was request specific, didn't make sense to keep it always in memory. In cases like that per-request caching is the easiest and safest to use. 
