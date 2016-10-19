---
layout: post
title: What kind of tests should I write as a software developer?
tags:
- software
- process
- agile
- testing
---
In over 16 years of my career as a software developer I wrote thousands of tests. Tests in C, C++, PHP, Python, Java, Ruby and not so much in JavaScript ;-)

As you can expect some projects were similar some were different. Small, large, complex, easy, API, libraries for customers, web sites, etc.

Also team sizes were different from a one person projects up to over one hundred people working on the code base. People located in the same place or in many places around the globe

In this time I realized my own approach to testing which I'm going to share with you.

But first I need to start with the iron triangle of software development:

[{% image_tag src="/media/2016/08/iron-triangle.jpg" width="572" %}](http://www.ambysoft.com/essays/brokenTriangle.html)

Read about it [here](http://www.brighthubpm.com/agile/50212-the-agile-triangle-value-quality-and-constraints/#imgn_0) and [here](https://www.projectsmart.co.uk/project-management-scope-triangle.php).

Now my philosophy is simple and driven by the triangle.

Producing each software costs money.  Each software can have different qualities. First quality is the cost. Scope is another one. Time it takes to develop it is next, and quality is meeting all those qualities in some sweet spot.

This is the context you operate in and what you do should follow it - the code you create and the tests you write.

Lets start with JIRA - this is a perfect example of a good developer practise as you would say. Because JIRA has thousands of tests. On each level - it has unit tests, functional tests, integration tests, front end tests. Those tests run on different OSes, databases, LDAPs, etc. If you would run them on one machine it would probably take a week to finish (or more).

Is it justified? I would say in most of the cases it is but not all. This is a complex software, very powerful, it can be customized a lot. It has also a lot of integration points that need to be functional. It's also a software that is crucial to customers, some of them have businesses built on JIRA. So anything goes wrong and you upset customers. That's why you want to make sure that with every release you still deliver.

Also JIRA is a desktop software so anything goes wrong and you need to release a new version and ask customers to upgrade which is a pain for them. Also you cannot monitor JIRA on customer premises, you don't have metrics, logs, db access, etc.

On the other hand there's a lot of tests that are too low level, so refactoring takes time and make's developers life miserable (sometimes).

Now lets imagine you're building an internal product that operates in SaaS model. You own the infrastructure, you even "own" customers because they work in the same office. You have all the monitoring and logging and tracking tools that you want. If anything breaks you will get an instant feedback. Your pipeline is simple and you can deploy a fix in minutes or hours (if it's a complex one). Would you want to follow the same testing regiment as in JIRA?

Well, maybe yes, if it was a system operating on real time data that has a monetary value, imagine day time trading, or if there was 10 000 people that will get stuck if the system broke.

In other cases? Probably not.

What if you work in a start up, just got another round of funding and you're still ahead of "stabilizing". Would you care about tests?

In that case I would say some smoke tests would be enough.

Or what if you were creating a new product that you're unsure of? Would you rather spend time writing tests or looking for customers?

I bet tests would be the last thing you would want to spend time on (except a few smoke tests).

Now you see the point. It all depends on the context and you cannot be fundamental about it. If you work in a team or with a product owner you want to discuss what kind of quality expectations there are and what you can do to deliver them (write tests or set up monitoring). You need to know and understand those constraints.

You need to be aware also that people are different and some are risk awerse (many developers) or risk aware (me for example). So it's also part of the context.

One thing for sure - always write regression tests. What I mean by that, if you released something and it was working fine and then some change broke it it means the code is fragile in this place.

In this case you need to make sure to cover the case that made the system fail to make sure that the problem you faced will not repeat. Well actually you want to decrease the risk, you cannot be 100% sure if it will not repeat.

It is for your sake, but mostly for your customers sake. It's really bad when your software breaks the same way few times in a row. That makes your customers loose trust in you. And trust is everything.

Also for all those TDD fundamentalists - [TDD is dead](http://david.heinemeierhansson.com/2014/tdd-is-dead-long-live-testing.html). I don't see value in it. And I don't know many people that see the value.

For the tests you should run. I see that most of the value is in functional tests. 

Unit tests are great when something is logically complex and you want to make sure that the algorithm works. But most of the time code is simple and you just want to make sure everything works fine together. So moving up and testing the system through different layers is what you want.

So my favorite are functional tests or BDD as some call them - for a web projects this means a browser emulating the user doing all the stuff he would do. I love them. They are usually easy to write (if you have a way to establish a state for the application, which you should BTW) and provide good value for your time.

They usually represent a real life scenario supported by business needs. So every product owner understands their value.

{% include newsletter.html %}

Thinking about tests there's also another aspect. It is the cost of maintenance. Every test you have means slower dev loop, more headache when you are revamping the functioning of the system. Changing they way it works not refactoring.

The other thing is what if your tests always pass? Do they bring any value? Initially you would say yes they are as they are making you feel confident. But think twice.

If you're making changes and tests always pass. Isn't that a sign that you have useless tests that don't catch anything? You feel more confident but actually you didn't make it safer. It's an illusion.

There's a great article on ["why most unit testing is waste"](http://rbcs-us.com/documents/Why-Most-Unit-Testing-is-Waste.pdf) by James O Coplien which I found writing this article. I strongly suggest you read it from top to bottom as the extension on this article. I focused mostly on business value and understanding the context. James goes into information theory and detailed evaluation on which tests are good or bad.

Despite the title James talks about all kinds of tests. We both agree that functional are the best. Something he advocates is recycling tests, I haven't tried this but I already see a point - the test base in long lived projects can grow so big it's a job itself to run it.

I'm copying his best practices here as I agree with them:


> * Keep regression tests around for up to a year — but most of those will be system-level tests rather than unit tests.
> * Keep unit tests that test key algorithms for which there is a broad, formal, independent oracle of correctness, and for which there is ascribable business value.
> * Except for the preceding case, if X has business value and you can test X with either a system test or a unit test, use a system
test — context is everything.
> * Design a test with more care than you design the code.
> * Turn most unit tests into assertions.
> * Throw away tests that haven’t failed in a year.
> * Testing can’t replace good development: a high test failure
rate suggests you should shorten development intervals, perhaps radically, and make sure your architecture and design regimens have teeth
> * If you find that individual functions being tested are trivial, double-check the way you incentivize developers’ performance. Rewarding coverage or other meaningless metrics can lead to rapid architecture decay.
> * Be humble about what tests can achieve. Tests don’t improve quality: developers do.

I would only extend on "turn most unit tests into assertions". James writes about it but in case you skip it - having assertions in your application is a good thing! I see developers rarely add assertions but they are really useful. Not only they protect the code, set the context right, but also are a great documentation. People used to say that unit tests are great because they document what your code does. Assertions are even better because they do it exactly in the place you look into first!

You can try out [solid_assert](https://github.com/jorgemanrubia/solid_assert)for that!