---
title: How I decided to manage my dot files with dotbot
layout: post
tags:
- shell
- linux
- process
---
I'm developing on macOS on a daily basis (as many of you). I have MacBook Pro mid 2014. But my machine started to feel a bit underpowered, especially when trying to run a few docker containers, RubyMine, Intellij IDEA and a dozen of other apps at the same time.

So I was eagerly waiting for a new MacBook Pro but then the disappointment happened - not only it is only a slightly improved version of the previous model but it also costs more. Sure touch bar and touch id are cool but not that cool, and USB-C everywhere, come on?! I'm not paying for that (at least not now, still considering 13 inch version for the future).

Also my kids are more into games nowadays, they are that age when Minecraft is no longer satisfying them, they want more and lets face it macOS isn't gamer beloved platform. I started to play occasionally as well (Call of Duty 2, anyone?)

So I was looking for alternatives and I found this [lovely spec](https://pcpartpicker.com/b/wbhypg) that could be a powerful workstation, run docker, Rails and other apps. Plus be a gaming monster. So far so good. I upped the spec a bit with 32GB RAM and more disk FTW!

Now I'm editing code on MBP but running it at the server. My first problem though was sharing my dot files.

I tried to use [homesick](https://github.com/technicalpickles/homesick) years before and actually had two repos with oh-my-zsh and jenv files. But I didn't grow a habit of making new ones, I preferred to keep everything on my Dropbox account, had a `Shell` directory there with everything I used. It was much simpler and easier.

But I thought I can do better, found [a nice summary of all the tools](https://dotfiles.github.io) people use and started going through them.

TL;DR - I evaluated a few (mostly looked at the documentation, played with some) and decided to use one of the simplest ones - [dotbot](https://github.com/anishathalye/dotbot).

If you're in a situation like me - thinking which one to choose here's my short summary, maybe it will save you some time.

`homesick` - dot files manager you can pull, push, etc. You manage one or few repos, you need to remember to push, pull, and link stuff. The idea is to use separate repos for different files, but you could eventually use a single one.

`vcsh`, `yadm` git wrappers similar to `homesick`, you keep the files in home (and not in some special directory. `yadm` has secret files support and alternative files support (for example separate files for Linux and macOS) which is nice, but still having to install something, etc. - too much hassle.

`antigen`, `antibody`, `antigen-hs`, etc. - plugin managers for oh-my-zsh and bash. Known to be slow, generally a bloatware. Overkill in my opinion.

`dotdrop`, `dotfiles` and `dotdrop` - the simplest idea ever - create a repo, put a script and your files into it, then check it out, run the script and you have everything linked into home dir. You manage it via git. 

From those `dotdrop` was the one that didn't require any dependencies, had the easiest script to run. One drawback is that there's `install.conf.yml` that you need to maintain. But thanks to that you can also add additional commands you want to run, mini provisioning system!

Also it has [some basic plugins](https://github.com/anishathalye/dotbot/wiki/Plugins) and a tutorial on having [dot files per machine](https://github.com/anishathalye/dotbot/wiki/Tips-and-Tricks) if you ever wanted that. Or [auto update](https://github.com/anishathalye/dotbot/wiki/Tips-and-Tricks#automatically-install-or-update-dotfiles-when-sshing-into-a-remote-machine-or-let-my-dotfiles-follow-me) the dotbot repo when you log in via ssh (haven't tried yet).

So far I'm happy with it. It is very easy to use, just:

```
git clone https://github.com/pawelniewie/dotfiles/
./install
```

The one drawback I found is that if you want to enforce the order of linking (I link first oh-my-zsh then some custom plugins into it) you need to have multiple `list` entries in your file, as each `list` is a hash and doesn't have an order when evaluated.

All your dependencies like oh-my-zsh or its plugins are just git submodules. Simplicity FTW!