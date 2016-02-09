---
layout: post
title: Ansible vs Chef knife solo
tags:
- provisioning
- ansible
- chef
- servers
---
I&#39;ve been struggling with Ansible for some time. When I first got into building servers, provisioning, etc. I used chef knife solo. I enjoyed its modularization and&nbsp;plethora of modules available online.

I made couple of servers using it. But once I wanted more advanced features like encrypted vaults it kicked. I had to setup certificates (which I never did) and things got harder.

At the same time I played with Ansible which was new kid on the block. It had rough edges. I didn&#39;t like its approach - there wasn&#39;t any modules, you had to do anything by your own. I was duplicating stuff found on line.

But as the project move forward I now enjoy using it. Now you can also write your [own modules](http://docs.ansible.com/ansible/developing_modules.html). Also the core got more features so you can get a lot out of it.

If you didn&#39;t have a chance I think it&#39;s worth trying out. I think it&#39;s the one that will stick as it has a nice learning curve. You can start in minutes and then progress to more advanced topics.

Also with Ansible Tower (which I don&#39;t use) you should be able to scale to enterprise level.
