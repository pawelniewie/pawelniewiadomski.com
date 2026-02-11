---
title: "JIRA boards - making cards get darker with time they stay in the same status"
date: "2016-06-22"
description: "Default cards coloring based on priority isn't that useful since you have ranking. On the other hand often you want to help move cards forward. In many..."
tags:
  - atlassian
  - jira
  - board
  - agile
---
Default cards coloring based on priority isn't that useful since you have ranking. On the other hand often you want to help move cards forward. In many teams cards get stuck at different stages like code review or testing. Here's a way how you can help those cards.

JIRA Software comes with a coloring scheme based on JQL queries. Thanks to that you can have any custom coloring scheme.

Open your board and select `Board` &rarr; `Configure`, then select `Card colors`, here's the default configuration, not that useful:

![](/images/2016/06/colors-on-board-1.png)

Change `Colors based on` to `Queries`

![](/images/2016/06/colors-on-board-2.png)

Then set up queries for different statuses:

![](/images/2016/06/colors-on-board-3.png)

Here's a script that will help you define all the queries:

```ruby
#!/usr/bin/env ruby

statuses = ['CODE REVIEW', 'COMPLIANCE CHECK', 'IN DEVELOPMENT']
times = ['-120m', '-360m', '-1d', '-2d', '-4d']

statuses.each do |status|
	times.reverse.each do |time|
		puts "status = \"#{status}\" and status changed to \"#{status}\" after #{time}"
	end
end
```

Colors that usually work well (RGB values which you can manually put into the color picker):

```
255 | 255 | 167	
255 | 255 | 0	
255 | 217 | 0	
255 | 170 | 0	
255 | 111 | 0	
227 | 0 | 0	
128 | 21 | 21	
```

Voila!