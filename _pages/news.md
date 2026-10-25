---
layout: page
title: News
eyebrow: Updates
permalink: /news/
description: Papers, talks, events and other updates.
---

<ul class="news-list">
{%- assign news = site.news | reverse -%}
{%- for item in news %}
  <li><time datetime="{{ item.date | date_to_xmlschema }}">{{ item.date | date: "%b %Y" }}</time>
  <p>{% if item.inline %}{{ item.content | remove: '<p>' | remove: '</p>' | strip }}{% else %}<a href="{{ item.url | relative_url }}">{{ item.title }}</a>{% endif %}</p></li>
{%- endfor %}
</ul>
