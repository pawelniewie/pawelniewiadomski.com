---
layout: post
title: How to clean your Address Book with Swift script?
tags:
- ruby
- fail
---

Fail:

```ruby
real_path = fixture_path.start_with? ('spec/fixtures/') ? fixture_path : "spec/fixtures/#{fixture_path}"
```

Works 

```ruby
real_path = fixture_path.start_with?('spec/fixtures/') ? fixture_path : "spec/fixtures/#{fixture_path}"
```

Or this works as well:

```ruby
real_path = (fixture_path.start_with? ('spec/fixtures/')) ? fixture_path : "spec/fixtures/#{fixture_path}"
```