---
layout: post
title: Monolith is the best 
tags:
- design
- architecture
- composition
- microservices
- monolith
---
Unless you have a specific need you need to solve you should never start with microservices. And there's only a few reasons to go with them in the first place. Those that come to my mind instantly are security, scalability, resource management.

Security - sometime you really need to have some strict boundaries between parts of your system - for example when you store sensitive data, or access sensitive part of the operating system. Qmail is a good example of that - it's a mail transfer agent (like Sendmail or Postfix). Because mail gets into users directories (at least in the old days) part of the system needs to run as root to access those files, but you don't want to run everything as root. Sendmail does that and it's a security nightmare. So Dan Bernstein decided to keep different parts under different processes and user ids and make them communicate only with simple commands via a named pipe (Unix thing). So even if you broke into the SMTP server and were able to exploit it and run arbitrary code you would not be able to read users emails or do any real harm. Also you would not be able to force other parts to do something nasty (because the communication protocol was very limited).

Resource management - boxes have a limited memory and CPU and some tasks are really hungry for them. The perfect example is any image processing - takes a lot of CPU and memory and in many systems is just an additional "thing". Similarly any packing/unpacking of archives, creation of thumbnails or previews, creation of PDFs, etc. In the current app I'm working on we moved image processing to a separate lambda because otherwise the system uses and needs very few resources. So instead of bumping up machine specs we went with lambda. Also this specific case was very easy to test out separate and the data flow was unidirectional - 

JIRA for many years was a monolith. It was built from different parts (plugins) but still was running as a single JVM process. It of course caused problems for people trying to scale it - as there were so many different things going inside JIRA and some were very CPU or memory intensive and you weren't able to spread them to different machines, etc.

