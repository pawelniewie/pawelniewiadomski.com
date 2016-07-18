---
layout: post
title: How to generate non predicable alphanumerical ids in Rails?
tags:
- ruby
- rails
- security
- obscurity
---
In many applications you generate ids that are visible to customers or used in links. Rails by default use sequential integers for that which is fine in many cases. Those are simple, fast, short and look good ;-)

But they have one disadvantage - if they are visible to outside someone can learn a lot about your business. For example if you're running a shop someone can guess how many orders you process, or number of items you offer or clients you have. Usually you want to avoid that.

You can fix that easily by switching to UUIDs, this is something Rails makes it [really easy to do](http://theworkaround.com/2015/06/12/using-uuids-in-rails.html).

You can have nice, non guessable identifiers like those:

```
id: 898f73bc-290c-4427-b75a-68f34464e188, title: The Raven
id: dd126f47-de45-4cbe-aa1c-8b052693498e, title: My Side of the Mountain
id: 479af9a8-c096-42e2-8a29-4a321cdd5f7c, title: The Giver
```

The only downside is that they are long and ugly, computers don't care but humans do. You probably don't want to show them to user.

Is there an alternative?

There are some nice gems you can use for that. As I need those in our application I made a research and here's a few that I found interesting.

# Hashids

The first one that draw my attentions is a project called [hashids](http://hashids.org). It's a set of libraries implementing the same algorithm.

You can get a lib for Ruby, Python, Java, Swift, or whatever else you like :-)

There's [hashid-rails](https://github.com/akinomaeni/hashid-rails) as well for simple integration.

Simply update `Gemfile` with

```ruby
gem 'hashid-rails', github: 'akinomaeni/hashid-rails'
```

Create `config/initializers/hashids.rb`

```ruby
hashids = Hashids.new()

Hashid::Rails.configure do |config|
  config.secret = Rails.application.secrets.secret_key_base
  config.length = 6
end
```

And update your model to return hashid instead of the sequential id (in case of JSON representation):

```ruby
class HashidExample < ApplicationRecord
    def as_json(options = {})
        super(options).merge(id: to_param)
    end
end
```

So let's see how this works:

```json
[
    {
        "created_at": "2016-07-15T20:34:17.722Z", 
        "id": "KpzRp6", 
        "title": "test", 
        "updated_at": "2016-07-15T20:34:17.722Z"
    }, 
    {
        "created_at": "2016-07-15T20:48:15.876Z", 
        "id": "XmXMp3", 
        "title": "another", 
        "updated_at": "2016-07-15T20:48:15.876Z"
    }
]
```

What's really nice about the library is that you can still refer objects by their old id. So there's an easy migration path.

What I have mixed feelings about is that hashids are not stored, so once you want to change settings (for example make them longer) you will break existing ones. So think carefully how large your database can get.

Other than that I like it, you can also encode multiple ids into one (in case you have complex keys and associations that you want to link to).