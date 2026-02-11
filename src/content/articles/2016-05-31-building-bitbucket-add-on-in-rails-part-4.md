---
title: "How to build BitBucket Cloud add-on in Rails &rarr; lifecycle"
date: "2016-05-31"
description: "Time to handle authentication between the service and BitBucket itself. I'm not going to go into details about authentication as it is well described..."
tags:
  - rails
  - ruby
  - cloud
  - add-on
series: "bitbucket-rails-add-on"
---
Time to handle authentication between the service and BitBucket itself.


I'm not going to go into [details about authentication](https://developer.atlassian.com/bitbucket/concepts/authentication.html) as it is well described already.

Just a reminder - to authenticate requests made by the add-on I need to obtain JWT when it is [installed by the user](https://developer.atlassian.com/bitbucket/concepts/authentication.html#sign-lifecycle).

I need to add additional routes to `config/routes.rb`:

```ruby
post '/installed', to: 'lifecycle#installed'
post '/uninstalled', to: 'lifecycle#uninstalled'
```

[Atlassian JWT authentication](https://github.com/MeisterLabs/atlassian-jwt-authentication) does the heavy lifting for me:

```ruby
class LifecycleController < ApplicationController
	include AtlassianJwtAuthentication::Filters
	
	before_action :on_add_on_installed, only: [:installed]
	before_action :on_add_on_uninstalled, only: [:uninstalled]

	def installed
		head(:no_content)
	end

	def uninstalled
		head(:no_content)
	end
end
```

Remove and install the add-on again and you will see that this time Rails will store the token for future use:

```console
Started POST "/installed" for 104.192.143.193 at 2016-05-31 21:31:13 +0200
Processing by LifecycleController#installed as */*
  Parameters: {"productType"=>"bitbucket", "principal"=>{"username"=>"pawelniewiadomski", "website"=>nil, "display_name"=>"Pawel Niewiadomski", "uuid"=>"{e503b860-9bee-4011-82d4-95a84c0f2743}", "links"=>{"self"=>{"href"=>"https://api.bitbucket.org/2.0/users/pawelniewiadomski"}, "html"=>{"href"=>"https://bitbucket.org/pawelniewiadomski/"}, "avatar"=>{"href"=>"https://bitbucket.org/account/pawelniewiadomski/avatar/32/"}}, "created_on"=>"2012-05-22T21:01:29.056667+00:00", "location"=>nil, "type"=>"user"}, "eventType"=>"installed", "baseUrl"=>"https://bitbucket.org", "publicKey"=>"MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCBFq+6Iq5J9AZzTZQfZEba9udHTIJToJnoDvWVHk8jKZIrMrVT1oJoAec84+nBhiO/8neqvbTlD7MeIb5aTDZo8YVhBKmQuEJ5RY56EakoR4x5oILsz/Ki5O4nGWSeTCCG1hj4heVsUi77umkYG5sZyHKNO+P+SwctTH1GEBDwswIDAQAB", "user"=>{"username"=>"pawelniewiadomski", "website"=>nil, "display_name"=>"Pawel Niewiadomski", "uuid"=>"{e503b860-9bee-4011-82d4-95a84c0f2743}", "links"=>{"self"=>{"href"=>"https://api.bitbucket.org/2.0/users/pawelniewiadomski"}, "html"=>{"href"=>"https://bitbucket.org/pawelniewiadomski/"}, "avatar"=>{"href"=>"https://bitbucket.org/account/pawelniewiadomski/avatar/32/"}}, "created_on"=>"2012-05-22T21:01:29.056667+00:00", "location"=>nil, "type"=>"user"}, "key"=>"stars.development", "baseApiUrl"=>"https://api.bitbucket.org", "clientKey"=>"connection:308533", "sharedSecret"=>"WOZ+mJsDKswFotc4yhdRyKoUdJc64KXbDG7Lm2BYCUw", "lifecycle"=>{"productType"=>"bitbucket", "principal"=>{"username"=>"pawelniewiadomski", "website"=>nil, "display_name"=>"Pawel Niewiadomski", "uuid"=>"{e503b860-9bee-4011-82d4-95a84c0f2743}", "links"=>{"self"=>{"href"=>"https://api.bitbucket.org/2.0/users/pawelniewiadomski"}, "html"=>{"href"=>"https://bitbucket.org/pawelniewiadomski/"}, "avatar"=>{"href"=>"https://bitbucket.org/account/pawelniewiadomski/avatar/32/"}}, "created_on"=>"2012-05-22T21:01:29.056667+00:00", "location"=>nil, "type"=>"user"}, "eventType"=>"installed", "baseUrl"=>"https://bitbucket.org", "publicKey"=>"MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCBFq+6Iq5J9AZzTZQfZEba9udHTIJToJnoDvWVHk8jKZIrMrVT1oJoAec84+nBhiO/8neqvbTlD7MeIb5aTDZo8YVhBKmQuEJ5RY56EakoR4x5oILsz/Ki5O4nGWSeTCCG1hj4heVsUi77umkYG5sZyHKNO+P+SwctTH1GEBDwswIDAQAB", "user"=>{"username"=>"pawelniewiadomski", "website"=>nil, "display_name"=>"Pawel Niewiadomski", "uuid"=>"{e503b860-9bee-4011-82d4-95a84c0f2743}", "links"=>{"self"=>{"href"=>"https://api.bitbucket.org/2.0/users/pawelniewiadomski"}, "html"=>{"href"=>"https://bitbucket.org/pawelniewiadomski/"}, "avatar"=>{"href"=>"https://bitbucket.org/account/pawelniewiadomski/avatar/32/"}}, "created_on"=>"2012-05-22T21:01:29.056667+00:00", "location"=>nil, "type"=>"user"}, "key"=>"stars.development", "baseApiUrl"=>"https://api.bitbucket.org", "clientKey"=>"connection:308533", "sharedSecret"=>"WOZ+mJsDKswFotc4yhdRyKoUdJc64KXbDG7Lm2BYCUw"}}
  JwtToken Load (25.9ms)  SELECT  "jwt_tokens".* FROM "jwt_tokens" WHERE "jwt_tokens"."client_key" = $1 AND "jwt_tokens"."addon_key" = $2 ORDER BY "jwt_tokens"."id" ASC LIMIT $3  [["client_key", "connection:308533"], ["addon_key", "stars.development"], ["LIMIT", 1]]
Unpermitted parameters: productType, principal, eventType, baseUrl, publicKey, user, key, baseApiUrl, sharedSecret, lifecycle
Unpermitted parameters: productType, principal, eventType, baseUrl, publicKey, user, baseApiUrl, clientKey, sharedSecret, lifecycle
   (0.1ms)  BEGIN
  SQL (6.0ms)  INSERT INTO "jwt_tokens" ("addon_key", "client_key", "shared_secret", "product_type") VALUES ($1, $2, $3, $4) RETURNING "id"  [["addon_key", "stars.development"], ["client_key", "connection:308533"], ["shared_secret", "WOZ+mJsDKswFotc4yhdRyKoUdJc64KXbDG7Lm2BYCUw"], ["product_type", "atlassian:bitbucket"]]
   (1.1ms)  COMMIT
Completed 204 No Content in 92ms (ActiveRecord: 69.2ms)
```

[Get the source code](https://github.com/pawelniewie/bitbucket-rails-add-on/tree/tutorial/part-4)

