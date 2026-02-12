---
title: "Bad patterns in Ruby - using private attr_accessor"
date: "2016-10-31"
description: "I'm working on an existing Rails application and there's one pattern I see repeating often that I hate. It's especially common in service objects. ruby..."
tags:
  - code-smell
  - pattern
  - ruby
---
I'm working on an existing Rails application and there's one pattern I see repeating often that I hate. It's especially common in service objects.

```ruby
class BuildAndroidPushNotification
  def initialize(claim_id, device_token)
    @claim = Claim.find claim_id
    @device_token = device_token
  end

  # many methods here
	
  private
	
  attr_accessor :claim, :device_token
  
  # other methods here
end
```

And inside the class there are methods that use those fields via accessors like:

```ruby
def pending_documents?
  DocumentRequest.where(claim_id: claim.id).pending.any?
end
```

So why I don't like this pattern? There's couple of reasons.

`@` in instance variables name has a purpose! Why would you want to resign from it only to save some time typing it. Is it really that hard?

`@thing` denotes that this `thing` comes from within the class. That's a really important information as Ruby is really dynamic and methods can come from different places. It saves you brain ticks 😉

It's the scope marker - you instantly see what's the scope for the `thing`. 

Also you see it's not a method call so it doesn't have any side effects. The least side effects you have in your code the better as it's easier to understand what influences what.


Usually `private` section is at the end of file while the initializer is on top. So either you need to open members dialog in RubyMine or read the whole file.

I even saw code like that:

```ruby
IDS.map do |id|
  @payout = Payout.find_by(backoffice_id: id)
  if payout.present? && is_a_pending_payoneer_payout?
    # other code around omitted for brevity
    create_new_payoneer_payout
  end
end
```

So basically here you have a function call (`map`) that modifies instance variable so it can be used in `create_new_payoneer_payout` <span title="Horror!">😱</span>

What's even worse. Not only you have a function that has side effects. It leaves the instance in a **dirty** state (as it doesn't clean the instance variable at the end).

To make it worse the data flow needs to be read from the code instead of being visible in a glimpse, here's a better version:

```ruby
IDS.each do |id|
  payout = Payout.find_by(backoffice_id: id)
  if payout.present? && is_a_pending_payoneer_payout?(payout)
    # other code around omitted for brevity
    create_new_payoneer_payout(payout)
  end
end
```

Now with a glimpse you can see that `is_a_pending_payoneer_payout?` and `create_new_payoneer_payout` take and operate on the payout.

What other bad practices have you found in the code you're working with? Let me know at [twitter](https://twitter.com/devonsteroids).

