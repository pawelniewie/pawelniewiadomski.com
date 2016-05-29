---
layout: post
title: How to build BitBucket Cloud add-on in Rails &rarr; add-on descriptor
tags:
- rails
- ruby
- cloud
- add-on
series: bitbucket-rails-add-on
---
In this part of the series I'm going to publish BitBucket Connect descriptor. This is a file that describes [how you want to integrate with BitBucket](https://developer.atlassian.com/bitbucket/concepts/connect_descriptor.html). 

{% include series.html %}

Edit `config/routes.rb` to add a new route that will serve the descriptor.

```ruby
Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  get '/bitbucket/descriptor', to: 'bitbucket#descriptor'
  
end
```

Lets create a controller that will serve it with `rails g controller bitbucket`

```ruby
class BitbucketController < ApplicationController

	def descriptor
		render :descriptor, locals: { 
			base_url: ApplicationController.renderer.defaults[:http_host]
		}
	end

end
```

In `Gemfile` uncomment `jbuilder`:

```ruby
gem 'jbuilder', '~> 2.0'
```

No it's time to create the descriptor view! You place it in `app/views/bitbucket/descriptor.json.erb`

```json
{
    "authentication": {
        "type": "jwt"
    }, 
    "baseUrl": "<%= base_url %>", 
    "contexts": [
        "personal"
    ], 
    "description": "Blah blah blah", 
    "key": "stars<%= "." + Rails.env unless Rails.env.production? %>",
    "name": "Stars for BitBucket", 
    "scopes": [
        "account", 
        "repository"
    ], 
    "vendor": {
        "name": "Pawel Niewiadomski", 
        "url": "https://pawelniewiadomski.com"
    }
}
```

<a name="descriptor"></a> Now you can test it out using [httpie](http://httpie.org):

```
$ http http://localhost:3000/bitbucket/descriptor
HTTP/1.1 200 OK
Cache-Control: max-age=0, private, must-revalidate
Content-Type: application/json; charset=utf-8
ETag: W/"f81cce01429e9936f12c0d77b1840d9c"
Transfer-Encoding: chunked
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-Request-Id: ea71011a-76dd-4ba2-9305-2e43cc09f625
X-Runtime: 0.301832
X-XSS-Protection: 1; mode=block

{
    "authentication": {
        "type": "jwt"
    }, 
    "baseUrl": "example.org", 
    "contexts": [
        "personal"
    ], 
    "description": "Blah blah blah", 
    "key": "stars.development", 
    "name": "Stars for BitBucket", 
    "scopes": [
        "account", 
        "repository"
    ], 
    "vendor": {
        "name": "Pawel Niewiadomski", 
        "url": "https://pawelniewiadomski.com"
    }
}
```

Now I'm ready to install it in BitBucket, that's something I'm going to cover in next part.

[Get the source code](https://github.com/pawelniewie/bitbucket-rails-add-on/tree/master/part-2)