---
title: "How to call services asynchronously in Ruby?"
date: "2016-08-29"
description: "That's a second part of the series where I present how to call multiple services at once in a different languages. It's not a production ready code but..."
tags:
  - ruby
  - threads
  - concurrency
series: "calling-services-asynchronously"
---
That's a second part of the series where I present how to call multiple services at once in a different languages. It's not a production ready code but something that can be a fun exercise. Would you want to know why it's not production ready?

In Ruby there's `timeout` which I initially thought would solve the case. I was impressed first when I noticed it. But later realized what a [piece of crap it is](http://jvns.ca/blog/2015/11/27/why-rubys-timeout-is-dangerous-and-thread-dot-raise-is-terrifying/).

So I'm not going to use it in my example. I initially went to look for a better `timeout`. I found two different libraries solving some of the problems with the original.

Found [frugal_timeout](https://github.com/ledestin/frugal_timeout) and [terminator](https://github.com/mikel/terminator) but they are useless for my example.

I then turned to [concurrent-ruby](https://github.com/ruby-concurrency/concurrent-ruby) and I felt at home. Because it's mostly Java API rewritten in Ruby ;-)

Check this out:

```ruby
require 'concurrent'

class AggregationService
  MAX_WAIT_TIME = 5

  include Dry::Monads::Either::Mixin

  def initialize(clients = nil)
    @clients = clients || [ClientA.new, ClientB.new]
    @pool = Concurrent::ThreadPoolExecutor.new({
      min_threads: @clients.size,
      max_threads: Concurrent.processor_count
    })
  end

  def results
    lock = Concurrent::CountDownLatch.new(@clients.size)

    futures = @clients.map do |client|
      Concurrent::Future.execute(executor: @pool) do
        begin
          client.data()
        ensure
          lock.count_down
        end
      end
    end

    lock.wait(MAX_WAIT_TIME)

    results = futures.select { |f| f.fulfilled? }.map(&:value)

    {
      results: results.select { |either| either.success? }.map { |r| r.right },
      errors: results.select { |either| either.failure? }.map { |l| l.left }
    }
  end
end
```

It looks really similar to [Java version](/2016/08/13/calling-serviceses-asynchronously-in-java/).

The biggest difference is that I'm using a `CountDownLatch` to make sure code waits for threads to finish (with a timeout). 

To spice things up I'm using `Either` from `dry-monads`.

Why `Either`? That's a great way to pass different data when the call succeeds or fails. It has also some fun methods and operators that let you combine different `Eithers` into another `Either`. 


```
HTTP/1.1 200 OK
Content-Length: 27
Content-Type: application/json
X-Content-Type-Options: nosniff

{
    "errors": [], 
    "results": [
        2
    ]
}

http http://localhost:4567  0.20s user 0.05s system 4% cpu 5.298 total
```

As you can see it will wait for the result up for 5 seconds and return anything it got during that time.

[Check the source code](https://github.com/pawelniewie/calling-services-asynchronously/tree/master/ruby) for details, it's a simple sinatra app.

