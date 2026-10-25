---
layout: page
title: Teaching
eyebrow: Courses
permalink: /teaching/
description: Courses I teach or have taught, from network science at the University of Pisa to PhD schools and outreach.
nav: true
nav_order: 6
wide: true
display_categories: [MSc, PhD, BSc, Other]
---

{%- for category in page.display_categories %}
{%- assign items = site.projects | where: "category", category | sort: "importance" -%}
{%- if items.size > 0 %}
<div class="section-head" style="margin-top:{% if forloop.first %}0{% else %}3.5rem{% endif %}"><div><div class="eyebrow">{{ category }}</div></div></div>
<div class="grid grid--3">
{%- for item in items %}
  {% include media_card.html item=item %}
{%- endfor %}
</div>
{%- endif %}
{%- endfor %}
