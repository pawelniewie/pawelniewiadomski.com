---
title: "How to build BitBucket Cloud add-on in Rails &rarr; user interface"
date: "2016-06-01"
description: "Time to add some user interface :-) I'm adding new section into views/bitbucket/descriptor.json.ejb (I ommited the rest of the file for verbosity): json {..."
tags:
  - rails
  - ruby
  - cloud
  - add-on
series: "bitbucket-rails-add-on"
---
Time to add some user interface :-)


I'm adding new section into `views/bitbucket/descriptor.json.ejb` (I ommited the rest of the file for verbosity):

```json
{
	"modules": {
	  "webPanel": [
	    {
	      "url": "/stars?repoPath={repo_path}",
	      "name": {
	        "value": "Stars Web Panel"
	      },
	      "location": "org.bitbucket.repository.overview.informationPanel",
	      "key": "stars-web-panel"
	    }
	  ]
	}	
}

```

I need to set up a route, a controller and a view as well, lets name the controller `StarsController`, there's also simple `app/views/stars/show.html`. I'm going to omit those here for now as they are really simple.

And voila here we can finally see the add-on in BitBucket :-)

![](/images/2016/05/panel-loading.png)

But something's not right, it's not loading!

```
[Error] Refused to display 'https://cf462fda.ngrok.io/stars?repoPath=XXX' in a frame because it set 'X-Frame-Options' to 'SAMEORIGIN'.
```

Damn you `X-Frame-Options` ;-)

I solved that overriding Rails defaults in `config/application.rb`:

```ruby
config.action_dispatch.default_headers.merge!({'X-Frame-Options' => 'ALLOWALL'})
```

![](/images/2016/06/panel-loaded.png)

Now the last thing I need to add I calling back to my service to save starred repos. I will describe that in the last part.

[Get the source code](https://github.com/pawelniewie/bitbucket-rails-add-on/tree/tutorial/part-5)

