---
layout: default
title: Easy sign ups for ServiceDesk
permalink: /atlassian/easy-sign-ups-for-servicedesk/
thumbnail: /media/easy-sign-ups/customer-portal.png
---
Easy sign ups for JIRA ServiceDesk
=============

Hi,
I'm really happy that you are evaluating [Easy sign ups](https://marketplace.atlassian.com/plugins/easy.social.sign-ups.servicedesk/server/overview)

You clicked the documentation link and I wonder what would you want to find here.

I tried to make this plugin self-explanatory but if I failed in that and you have any doubts or questions please [contact me](mailto:pawelniewiadomski@me.com) so I can answer them and also improve the plugin.

Cheers,
Pawel

## What's the purpose of this plugin?

If you use JIRA ServiceDesk as an open support and communication tool you may want to decide to speed up sign up process for your customers.

This plugin lets your customers sign up with their existing account from one of the services like Google, LinkedIn or GitHub.

Once enabled and configured the plugin will attach to JIRA ServiceDesk login page.

{% image_tag src="/media/easy-sign-ups/customer-portal.png" width="572" %}

## Supported Providers

Current the plugin supports following services Google (also Google Apps), Facebook, GitHub, LinkedIn, VK.

## Known limitations

This plugin doesn't support custom OpenID/OAuth2 providers. For every server you maintain you need register it with the services you want to use (to obtain OAuth2 client id and secret).

In case you want to change the address you host your JIRA ServiceDesk you will have to update each of the registrations.

There is no way for the user to set the password. If the user decides no to use his external account for JIRA ServiceDesk he will have to reset his password.

