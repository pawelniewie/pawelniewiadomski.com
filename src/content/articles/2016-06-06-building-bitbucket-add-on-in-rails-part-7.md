---
title: "How to build BitBucket Cloud add-on in Rails &rarr; accessing BitBucket API from the server"
date: "2016-06-06"
description: "The last thing I want to mention is how to make a call to BitBucket REST API from the server. This is something I struggled for. Seems the official..."
tags:
  - rails
  - ruby
  - cloud
  - add-on
series: "bitbucket-rails-add-on"
---
The last thing I want to mention is how to make a call to BitBucket REST API from the server. This is something I struggled for. Seems the official documentation hasn't been updated and you need to figure it out on your own.



As the user already allowed the plugin to access his account it doesn't make sense to do an additional OAuth dance. So [BitBucket Cloud OAuth](https://developer.atlassian.com/bitbucket/concepts/oauth2.html) supports a special JWT Grant that you can use from the add-on to get the access token. 

Here's how I get the access token:

```ruby
def get_access_token
  unless current_jwt_auth
    raise 'Missing Authentication context'
  end

  # Expiry for the JWT token is 3 minutes from now
  issued_at = Time.now.utc.to_i
  expires_at = issued_at + 180

  jwt = JWT.encode({
                       iat: issued_at,
                       exp: expires_at,
                       iss: current_jwt_auth.addon_key,
                       sub: current_jwt_auth.client_key
                   }, current_jwt_auth.shared_secret)

  response = HTTParty.post("#{current_jwt_auth.base_url}/site/oauth2/access_token", {
      body: {grant_type: 'urn:bitbucket:oauth2:jwt'},
      headers: {
          'Content-Type' => 'application/x-www-form-urlencoded',
          'Authorization' => 'JWT ' + jwt
      }
  })

  if response.code == 200
    Response.new(200, response.parsed_response)
  else
    Response.new(response.code)
  end
end
```

You don't need `qsh` here. You need to use `application/x-www-form-urlencoded`, JSON is not allowed.

The returned token will not have a refresh token, to refresh it call `get_access_token` again with JWT token.

Once you get the access token you can call BitBucket REST API with `Authorization: Bearer token` as you would normally do with any OAuth 2.0 service.

I hope you enjoyed the tutorial. If you have any questions feel free to [contact me](https://twitter.com/devonsteroids).

[Get the source code](https://github.com/pawelniewie/bitbucket-rails-add-on/tree/tutorial/part-6)