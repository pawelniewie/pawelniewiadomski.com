---
layout: post
title: How to change source for Active Model?
tags:
- rails
- ruby
- activerecord
---
The nice thing about Active Record scopes is that you not only can specify where conditions. I recently had a need to run a query against a model to discover previous and next elements. This can be easily achieved using window functions. The query can looks something like:

```sql
(select *, lag(id) over(order by position) as prev, lead(id) over(order by position) as next from itinerary_flights;
```

This query adds two additional columns that list ids of elements in order defined by `position` field.

I'm not going to go into window function details. There's a lot of great tutorials about them already.

So I stumbled for a minute how to change `ItineraryFlight` model to use this select as a source so I could use all other goodies I had defined there.

I guess by reading the introduction you already guessed how it can be done.

```ruby
scope :with_previous_and_next_flights, -> (itinerary_id) { from_previous_next_flights(itinerary_id) }
```

In my case I wanted to get only one row with additional fields so I passed the `itinerary_id`. I had this methods defined as well:

```ruby
def self.from_previous_next_flights(itinerary_id)
    from <<-SQL.strip_heredoc
      (select *, lag(id) over(order by position) as prev, lead(id) over(order by position) as next from itinerary_flights where itinerary_id=#{itinerary_id.to_i}) AS itinerary_flights
    SQL
end
```

The trick here was to use `AS itinerary_flights` at the end to match the table name so all other automatically generated conditions would still work.

With this simple trick you can easily use models with views, stored procedures, or dynamically created queries like in my case!

{% include newsletter.html %}