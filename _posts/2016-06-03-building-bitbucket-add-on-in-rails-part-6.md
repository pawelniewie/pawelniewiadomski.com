---
layout: post
title: How to build BitBucket Cloud add-on in Rails &rarr; accessing BitBucket API from JavaScript
tags:
- rails
- ruby
- cloud
- add-on
series: bitbucket-rails-add-on
---
There's only one major part missing in my app - calling back the service and storing results.

{% include series.html %}

{% include stars-for-bitbucket-on-marketplace.html %}

I added a new model called `Repo` that will be used to store stars:

```ruby
class CreateRepos < ActiveRecord::Migration[5.0]
  def change
    create_table :repos do |t|
      t.integer :jwt_token_id, null: false
      t.string :repo_name, null: false
    end

    add_foreign_key :repos, :jwt_tokens, on_delete: :cascade

    add_index(:repos, [:repo_name, :jwt_token_id], unique: true)
  end
end
```

Next I had to figure out how can I authenticate requests made from the iframe back to the server. Here's the full source code of the controller:

```ruby
class StarsController < ApplicationController

  include AtlassianJwtAuthentication

  # will respond with head(:unauthorized) if verification fails
  before_action only: [:show, :save] do |controller|
    controller.send(:verify_jwt, PluginKeyService::PLUGIN_KEY)
  end

  def show
    repo_name = params.permit(:repoPath)['repoPath']
    locals = {
        session_token: create_session_token
    }.merge! (Repo.number_of_stars(current_jwt_auth, repo_name))
    render :show, locals: locals
  end

  def save
    repo_name = params.permit(:repoPath)['repoPath']
    repo = Repo.find_or_initialize_by(repo_name: repo_name, jwt_token_id: current_jwt_auth.id)
    if repo.new_record?
      repo.save
      starred = true
    else
      repo.destroy
      starred = false
    end
    render json: {
        repo_name: repo_name,
        count: Repo.where(repo_name: repo_name).count,
        starred: starred
    }
  end

  private

  def create_session_token
    issued_at = Time.now.utc.to_i

    JWT.encode({
                   iss: current_jwt_auth.client_key,
                   iat: issued_at,
                   aud: [current_jwt_auth.addon_key]
               }, current_jwt_auth.shared_secret)
  end

end
```

I use `before_action` to make sure I can authenticate requests - so I know which tenant/user is trying to access the page.

In `show` you can see I'm passing a session token back to the view, this will be used to authenticate requests made from the view back to the server. 

`create_session_token` creates a similar token BitBucket would create to call the service. This one doesn't use expiration so please refer to `atlassian-jwt-authentication` for a safer way that includes expiration.

I intentionally decided to leave out the expiration - the feature is trivial and this is just a sample application.

In the view I take the token and use it when sending requests back:

```javascript
$.ajax('#{stars_url}', {
	headers: {
	  'Authorization': 'JWT ' + meta.token
	},
```

I hope you enjoyed the tutorial. If you have any questions feel free to [contact me](https://twitter.com/devonsteroids).

[Get the source code](https://github.com/pawelniewie/bitbucket-rails-add-on/tree/tutorial/part-6)