---
layout: post
title: 
tags:
- infrastructure
- devops
- terraform
---
I just spent couple of hours moving my blog to CloudFront. It would have been simpler if not Terraform but now I have this set up right I decided to save you some time.

This blog was hosted on S3 for a long time, but I always had nginx proxy in front that would take care of SSL. I was using [let's encrypt](https://letsencrypt.org) for certificates. But after getting another email asking me to refresh the certificates I looked for an alternative.

Some time ago I was playing with the idea of moving everything to [Caddy server](https://caddyserver.com). Just to test it out as it has a built in support for let's encrypt, so I wouldn't have to deal with refreshing the certificates.

But I found a better way. I didn't know that before but **AWS offers free, automatically refreshed SSL certificates for services you host with them**. So instead of using let's encrypt with my own server I could switch to CloudFront and obtain a certificate from AWS. Thanks to that I wouldn't have to manage any server on my own <span title="Sweet">🍰</span>!

### So what's Terraform anyway and why did I use it?

I'm really keen on the concept of having a configuration driven infrastructure and Terraform is an tool that lets achieve that. It supports AWS, DigitalOcean and others. It's popular and widely used.

### Making it work

I had couple of issues trying to make Terraform work for me - first it was really hard to find how you can split everything into separate files. There are modules which you can use. But also you can just use separate files in the same directory and Terraform will concatenate them!

The other problem I had was I started with a one file that would try to set up services in different regions, and this is something Terraform currently struggles with. Lost some time trying to figure out why it is not working for me only to find [this bug](https://github.com/hashicorp/terraform/issues/3454). So I decided to have different regions in different and separate configurations.

Also while playing with Terraform I ended up creating two zones for `pawelniewiadomski.com` so I was hitting the wall with my head trying to understand why DNS doesn't get refreshed 😠 It was a result of pulling out region specific configuration to a separate directory (with a new state).

In the end I managed to move the site and here's [the configuration I used](https://github.com/pawelniewie/infrastructure/tree/moving-blog-to-cloud-front/us-west-2).

To apply it just run 

```
terraform apply -var-file=../terraform.tfvars
```

You need to set up you AWS credentials first in `terraform.tfvars`:

```ruby
access_key = "XXX"
secret_key = "YYY"
```

PS

If you don't want to go through all the hops you an use [GitHub Pages](https://pages.github.com) to host a static site as well.