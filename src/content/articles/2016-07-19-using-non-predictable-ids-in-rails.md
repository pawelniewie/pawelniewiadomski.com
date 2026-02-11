---
title: "How to generate non predicable alphanumerical ids in Rails?"
date: "2016-07-19"
description: "In many applications you generate ids that are visible to customers or used in links. Rails by default uses sequential integers for that which is fine most..."
tags:
  - ruby
  - rails
  - security
  - obscurity
---
In many applications you generate ids that are visible to customers or used in links. Rails by default uses sequential integers for that which is fine most of the time. Those are integers so they are fast, short and look good ;-)

But they have one disadvantage - if they are visible externally someone can learn a lot about your business. For example if you're running a shop someone can guess how many orders you process, or number of items you offer or clients you have. Probably you want to avoid that.

You can fix that easily by switching to UUIDs, this is something Rails makes it [really easy to do](http://theworkaround.com/2015/06/12/using-uuids-in-rails.html).

You can have nice, non guessable identifiers like those:

```
id: 898f73bc-290c-4427-b75a-68f34464e188, title: The Raven
id: dd126f47-de45-4cbe-aa1c-8b052693498e, title: My Side of the Mountain
id: 479af9a8-c096-42e2-8a29-4a321cdd5f7c, title: The Giver
```

The only downside is that they are long and ugly, computers don't care but humans do. You probably don't want to show them to user.

Is there an alternative?

Yes, there is. As I need non-predictable, human readable ids in our application I made a research and here's a few gems that I found interesting.

## Hashids

The first one that draw my attentions is a project called [hashids](http://hashids.org). It's a set of libraries implementing the same algorithm in many languages.

You can get a lib for Ruby, Python, Java, Swift, or whatever else you like :-)

There's [hashid-rails](https://github.com/akinomaeni/hashid-rails) as well for simple integration with Rails.

Simply update `Gemfile` with

```ruby
gem 'hashid-rails', github: 'akinomaeni/hashid-rails'
```

Create `config/initializers/hashids.rb`

```ruby
hashids = Hashids.new()

Hashid::Rails.configure do |config|
  config.secret = Rails.application.secrets.secret_key_base # some secret id
  config.length = 6 # length of the generated ids
end
```

And update your model to return hashid instead of the sequential id (here's for JSON representation):

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

I have mixed feelings about one things though &rarr; hashids are not stored, so once you want to change settings (for example make them longer) you will break existing ones. So think carefully how large your database can get.

Other than that I like the gem. You can also encode multiple ids into one (in case you have complex keys and associations that you want to link to).

## Uniqify

An alternative solution is to add a unique token to each model and store it in the database. There's a simple solution for that as well - [uniqify](https://github.com/Openbay/uniquify).

To add it to your project, update `Gemfile`

```ruby
gem 'uniquify', github: 'Openbay/uniquify'
```

Prepare a migration:

````ruby
add_column :uniqify_examples, :token, :string, null: false
add_index :uniqify_examples, :token, unique: true
```

In your model:

```ruby
class UniqifyExample < ApplicationRecord
    uniquify :token, :length => 6

    def as_json(options = {})
        super(options).reject{|k,v| k == "id"} # to hide id from JSON representation
    end
end
```

What nice about this library is that you can have multiple tokens in the same model (in case you want that):

```ruby
uniquify :token, :another, :length => 6
```

You can specify length, and allowed characters. Token gets persisted so you can change to format as you go.

## random\_unique\_id

There's another very similar gem called [random\_unique\_id](https://github.com/pupeno/random_unique_id). I tested it out but didn't like it.

There are two limitations - I doesn't work out of the box with model hierarchy introduced by Rails (all models subclassing `ApplicationRecord` by default). You need to change your model and extend `ActiveRecord::Base`.

Also you can only have one unique field per model which is fine most of the time. But we are going to use multiple tokens for some models.

## Or just use math (update 2016-07-19)

[Kari Ikonen](https://github.com/kikonen) was so kind to mention that there is another way - mathematical one!

You can use multiplicative inverses to create obfuscated integers.

It's really cheap and easy to do, and you can read more about it at [Eric Lippert's blog](https://ericlippert.com/2013/11/14/a-practical-use-of-multiplicative-inverses/).

## How long should be the token?

That Depends on the character set that you will use. Generally all libraries use something like 62 possibilities for each character:

`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`

> 5 chars in base 62 will give you 62^5 unique IDs = 916,132,832 (~1 billion) At 10k IDs per day you will be ok for 91k+ days

> 6 chars in base 62 will give you 62^6 unique IDs = 56,800,235,584 (56+ billion) At 10k IDs per day you will be ok for 5+ million days

> -- from [StackOverflow](http://stackoverflow.com/a/9543797)

## Other approaches?

[Instagram come up with an interesting approach](http://instagram-engineering.tumblr.com/post/10853187575/sharding-ids-at-instagram) that helps them generate unique ids and at the same time shard data. If you're going to be huge like them it's worth considering. I'd love to have problems like that ;-)

## Final thoughts

I think `uniqify` and `hashids` are both two interesting gems you can try to use. I'm not sure yet which one we're going to choose. Will update the article once we have a decision.

I also prepared [a small project](https://github.com/pawelniewie/non-predictable-ids) you can play with. Run:

`bundle install`

`rails s`

`brew install httpie`

Then you can play with it:

`http http://localhost:3000/hashids title=test`

`http http://localhost:3000/hashids`

`http http://localhost:3000/hashids/1`


`http http://localhost:3000/rids title=another`

`http http://localhost:3000/rids`


`http http://localhost:3000/uniqifies title=hurra`

`http http://localhost:3000/uniqifies`
