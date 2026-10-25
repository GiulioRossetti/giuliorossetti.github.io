---
layout: page
permalink: /software/
title: Software
eyebrow: Open science
description: Open-source libraries and platforms developed with the SNA@KDD team, from network analysis toolkits to LLM-powered social twins.
nav: true
nav_order: 4
wide: true
---

<div class="grid grid--3">
{%- for sw in site.data.software %}
  {% include software_card.html sw=sw %}
{%- endfor %}
</div>

<div class="callout" style="margin-top:3rem">
More code, datasets and teaching material are on GitHub: <a href="https://github.com/{{ site.github_username }}">github.com/{{ site.github_username }}</a> · <a href="https://github.com/YSocialTwin">github.com/YSocialTwin</a> · <a href="https://github.com/sna-unipi">github.com/sna-unipi</a>
</div>
