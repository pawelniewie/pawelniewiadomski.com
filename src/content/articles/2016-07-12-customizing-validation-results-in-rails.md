---
title: "How to display Active Record validation errors according to Atlassian AUI?"
date: "2016-07-12"
description: "Active record validations are a wonderful thing. Combined with Rails form helpers they make it easy to create forms for modifying models. Unfortunately..."
tags:
  - ruby
  - rails
  - validation
  - atlassian
  - aui
---
[Active record validations](http://guides.rubyonrails.org/active_record_validations.html) are a wonderful thing. Combined with Rails form helpers they make it easy to create forms for modifying models.

Unfortunately default error rendering is not compatible with Atlassian AUI. Fields get wrapped with `<div class=\"field_with_errors\">#{html_tag}</div>` which doesn't look good:

![](/images/2016/07/default-rails-form-error.png)

There's an easy way to fix it though.

Create a new file `config/initializers/active_view_base_field_error_proc.rb` and put this into it:

```ruby
ActionView::Base.field_error_proc = Proc.new do |html_tag, instance|
  if html_tag =~ /label/
    html_tag.html_safe
  else
    (html_tag + instance.error_message.map(&:capitalize).map { |em| "<div class=\"error\">#{em}</div>" }.join('').html_safe)
  end
end
```

`field_error_proc` is called for every field in the form so you want to skip it for labels. There's also `instance.object` that represents model in case you want to grab some properties from it.

![](/images/2016/07/customized-rails-form-error.png)

That looks much better!

PS

I wrote also [a series on writing a BitBucket Cloud add-on](/2016/05/28/building-bitbucket-add-on-in-rails-part-1/).
