---
layout: page
title: Research
eyebrow: Research agenda
permalink: /research/
description: Understanding and simulating networked societies, from the structure of social interactions to LLM agents inhabiting digital twins of online platforms.
nav: true
nav_order: 2
wide: true
---

<div class="grid grid--4" style="margin-bottom:3.5rem">
{%- for pl in site.data.profile.pillars %}
  <article class="card pillar pillar--{{ pl.key }} reveal">
    <span class="pillar-num">0{{ forloop.index }}</span>
    <div class="pillar-icon"><i class="{{ pl.icon }}" aria-hidden="true"></i></div>
    <h3>{{ pl.title }}</h3>
    <p>{{ pl.text }}</p>
  </article>
{%- endfor %}
</div>

<div class="section-head">
  <div>
    <div class="eyebrow">Research lines</div>
    <h2>What the SNA@KDD team works on</h2>
    <p>Each line collects objectives, collaborations and related publications.</p>
  </div>
</div>

<div class="grid grid--3">
{%- assign lines = site.projects | where: "category", "Research Lines" | sort: "importance" -%}
{%- for item in lines %}
  {% include media_card.html item=item kicker="Research line" %}
{%- endfor %}
</div>

<div class="section-head" style="margin-top:4.5rem">
  <div>
    <div class="eyebrow">Funding</div>
    <h2>National &amp; international projects</h2>
    <p>Our research is framed within nationally and internationally funded projects and research infrastructures.</p>
  </div>
</div>

<div class="grid grid--3">
{%- assign funded = site.projects | where: "category", "National & International" | sort: "importance" -%}
{%- for item in funded %}
  {% include media_card.html item=item %}
{%- endfor %}
</div>
