---
layout: post
title: How to set a default queue name for all jobs in Rails?
tags:
- rails
- ruby
- shoryuken
- activejob
---
I'm working on a gem for sharing [common Rails](http://github.com/pawelniewie/rails-commons) code between my apps. I just added there a first job and hit a problem - the job from the gem was using `default` queue which doesn't exist. 

Well I knew I will have this problem but I didn't expect that figuring out how to change the default name will take me so much time.

I use [shoryuken](https://github.com/phstc/shoryuken) for running jobs, the configuration looks like this:

```yaml
aws:
  access_key_id: <%= ENV["AWS_ACCESS_KEY_ID"] %>
  secret_access_key: <%= ENV["AWS_SECRET_ACCESS_KEY"] %>
  region: "us-east-1"
  receive_message:
    wait_time_seconds: 10
concurrency: 2
delay: 10
queues:
  - 'customer-feedback'
  - 'customer-feedback-mailer'
```

As you can see there's no `default` queue. It's not a problem as I can use `queue_as` in `ApplicationJob`. But the job from the gem cannot extend `ApplicationJob`. Also it must not have a hard coded name either.

I expected there should be a way in Rails to set the default queue name for all jobs and there is but it was really difficult to find it.

The documentation mentioned `config.active_job.default_queue_name` and looking at the code it should be picked up. But as I found out the default is picked up too early before the application can override it.

{% include newsletter.html %}

The most interesting code is in `ActiveJob::QueueName`

```ruby
included do
  class_attribute :queue_name, instance_accessor: false
  class_attribute :queue_name_delimiter, instance_accessor: false

  self.queue_name = default_queue_name
  self.queue_name_delimiter = "_" # set default delimiter to '_'
end

# Returns the name of the queue the job will be run on.
def queue_name
  if @queue_name.is_a?(Proc)
    @queue_name = self.class.queue_name_from_part(instance_exec(&@queue_name))
  end
  @queue_name
end
```

As you can see when included into `ActiveJob::Base` it will establish `queue_name` class attribute. You can check `class_attribute` documentation - it's a very interesting method - you can propagate value from a parent class to all sub classes, and allow subclasses to override the value. Propagation happens even after objects were created provided the subclass didn't override.

Playing with it I discovered you can use following code to override queue name:

```ruby
config.active_job.queue_name = 'customer-feedback'
``` 

That worked (almost), as there's no `customer-feedback` queue. I use prefixed queue names:

```ruby
config.active_job.queue_name_prefix = Rails.env
```

So the real name of the queue should be something like `development_customer-feedback`.

As you noticed above `queue_name` method will take the name as is when it's a string, but will calculate it when it's `Proc`, so simple change fixed this:

```ruby
config.active_job.queue_name = Proc.new { 'customer-feedback' }
```

Now all jobs can use a proper queue, even without an explicit `queue_as`.

PS 

You can also set a queue and other attributes when executing the queue:

```ruby
VideoJob.set(
  queue: :some_queue, 
  wait: 5.minutes
).perform_later(Video.last)
```