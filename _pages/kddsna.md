---
layout: page
title: Team
eyebrow: SNA@KDD
og_image: /assets/img/og/team.png
permalink: /team/
description: The Social Network Analysis team at the KDD Lab (CNR-ISTI · University of Pisa · SNS), current members and alumni.
nav: true
nav_order: 5
wide: true
display_categories: [Senior Researchers, Assistant Professors, Postdoctoral Researchers, PhD Students, MSc/BSc]
---

{%- for category in page.display_categories %}
{%- assign members = site.team | where: "category", category | sort: "importance" -%}
{%- if members.size > 0 %}
<section class="team-group">
  <h2>{{ category }} <span class="count">{{ members.size }}</span></h2>
  <div class="team-grid">
  {%- for m in members %}
    <div class="card person{% if category == 'Senior Researchers' %} person--lead{% endif %}">
      {% include avatar.html m=m %}
      <div><div class="person-name">{{ m.title }}</div><div class="person-role">{{ m.description }}</div></div>
    </div>
  {%- endfor %}
  </div>
</section>
{%- endif %}
{%- endfor %}

{%- assign alumni = site.team | where: "category", "Alumni" | sort: "title" -%}
<section class="team-group">
  <h2>Alumni <span class="count">{{ alumni.size }}</span></h2>
  <ul class="alumni-list">
  {%- for m in alumni %}
    <li><span class="al-name">{{ m.title }}</span><span class="al-role">{{ m.description }}</span></li>
  {%- endfor %}
  </ul>
</section>

<div class="callout" style="margin-top:3rem">
<strong>Join us.</strong> We regularly host MSc theses, PhD students (Italian National PhD in AI for Society, University of Pisa) and visiting researchers. <a href="{{ '/#contact' | relative_url }}">Get in touch</a>.
</div>
