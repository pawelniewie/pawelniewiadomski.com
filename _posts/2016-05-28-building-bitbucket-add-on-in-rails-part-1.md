---
layout: post
title: How to build BitBucket Cloud add-on in Rails, part 1
tags:
- rails
- ruby
- cloud
- add-on
series: bitbucket-rails-add-on
thumbnail: /media/2016/05/rails-github.png
---
{% image_tag src="/media/2016/05/rails-github.png" width="572" %}

In this series I'm going to document how to build a simple BitBucket add-on using Rails. I'm going to replicate GitHub's Star feature that I often use and miss on BitBucket.

This add-on will be created using Ruby on Rails! So let's start!

Time to bootstrap the project:

```
rails new -d postgresql --skip-action-mailer --skip-turbolinks --skip-test --api bitbucket-rails-add-on
```

You can run it with `rails server` but it does nothing.

Time to add [Atlassian Connect integration for Rails](https://github.com/MeisterLabs/atlassian-jwt-authentication):

```
gem 'atlassian-jwt-authentication', 
	git: 'https://github.com/MeisterLabs/atlassian-jwt-authentication.git', 
	branch: 'master',
	require: 'atlassian_jwt_authentication'
```

Create PostgreSQL databases with:

```
createuser bbs
createdb -O bbs bbs-dev
```

Edit `config/database.yml` and make sure you have development database configured:

```
development:
  <<: *default
  database: bbs-dev
  username: bbs
```

Run `bundle exec rails g atlassian_jwt_authentication:setup` to create required migrations. Then `rails db:migrate`

Now we're ready to start developing the add-on itself. I'll cover first steps in the next part.

[Get the source code](https://github.com/pawelniewie/bitbucket-rails-add-on/tree/master/part-1)

{% include series.html %}