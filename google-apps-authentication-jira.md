---
layout: default
title: OpenID Authentication for JIRA/Confluence
permalink: /atlassian/google-apps-authentication-for-jira/
---
OpenID Authentication for JIRA/Confluence
=============

Hi,
I'm really happy that you are evaluating [OpenID Authentication](https://marketplace.atlassian.com/plugins/com.pawelniewiadomski.jira.jira-openid-authentication-plugin)

You clicked the documentation link and I wonder what would you want to find here.

I tried to make this plugin self-explanatory but if I failed in that and you have any doubts or questions please [contact me](mailto:pawelniewiadomski@me.com) so I can answer them and also improve the plugin.

Cheers,
Pawel

## FAQ

### I'm unable to use my custom OAuth 2 authentication provider

The custom OAuth authentication built into the plugin was created for Google Apps and may not work with some other implementations. If you want to use your own provider and it doesn't work out of the box please [contact me](mailto:pawelniewiadomski@me.com?Subject=OpenID%20Custom%20Provider) for support. I will happily fix the plugin to work with your provider.

### I'm getting HTTP/405 when authenticating with Google Apps

You probably didn't enable Google+ API in Google Developer Console.

### I'm getting SSL errors

There's couple of reasons you could get them:

- you're using a self signed certificate
- you're using a certificate signed by Certification Authoriting that isn't known for the Java version you use
- you're using 2048 bit certificate key which is only supported by latest Java 1.7 and 1.8 releases
