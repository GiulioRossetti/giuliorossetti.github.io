---
layout: page
permalink: /software/
title: Software
eyebrow: Open science
description: Open-source libraries developed with the SNA@KDD team, from network analysis toolkits to LLM-powered social twins and their analytics.
nav: true
nav_order: 4
wide: true
---

<div class="section-head"><div><div class="eyebrow">Social twins</div><h2>The YSocial ecosystem</h2><p>Simulate social platforms with LLM agents, then analyse what happened.</p></div></div>
<div class="grid grid--2 sw-grid sw-grid--twins">
{%- assign g = site.data.software | where: "group", "twins" -%}
{%- for sw in g %}
  {% include software_card.html sw=sw %}
{%- endfor %}
</div>

<div class="section-head" style="margin-top:3.5rem"><div><div class="eyebrow">Network science</div><h2>Network analysis libraries</h2><p>Python libraries for communities, diffusion and temporal networks, built on top of NetworkX.</p></div></div>
<div class="grid grid--3 sw-grid">
{%- assign g = site.data.software | where: "group", "net" -%}
{%- for sw in g %}
  {% include software_card.html sw=sw %}
{%- endfor %}
</div>

<div class="callout" style="margin-top:3rem">
More code, datasets and teaching material are on GitHub: <a href="https://github.com/{{ site.github_username }}">github.com/{{ site.github_username }}</a> · <a href="https://github.com/YSocialTwin">github.com/YSocialTwin</a> · <a href="https://github.com/sna-unipi">github.com/sna-unipi</a>
</div>
