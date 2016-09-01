---
layout: post
title: How to clean your Address Book with Swift script?
tags:
- swift
- mac
- script
---
I have this problem that my Address Book is a mess :-( There are many entries that have an email only, no name, no anything, just a plain email.

What's even worse that some of those emails are duplicated or match people that already exists in my address book.

I decided to give it a stop and clean it a bit. I'm on holidays, what else would I be doing than cleaning my address book? ;-)

I thought it would be a good idea to: play with Xcode playgrounds, Swift and run this as a script!

So far it was a smooth ride, I read a few books on Swift before (without much coding). I found API for AddressBook and voila, I have a script that cleaned my address book.

What it does exactly?

It will take all the `first.last@something` emails. It will skip others.

It will try to locate an existing `first last` entry. If that's possible it will add the email there.

If there's no such entry it will update the existing entry and set proper names on it. So at least it looks more humane ;-)

The script is available as [gist](https://gist.github.com/pawelniewie/2148dc9ff0cbdfb189b4cea5a93baa39). Grab it!

{% gist pawelniewie/2148dc9ff0cbdfb189b4cea5a93baa39 %}

If you remove `ab.save()` from the end you can play safely with it as whatever you do will not be persisted.

You can add as many print lines as you want to make sure you know what you are doing.

You can download it and run as a script if you want too! I love that about Swift!

Who knows maybe it will become my scripting go to language? :-) 
