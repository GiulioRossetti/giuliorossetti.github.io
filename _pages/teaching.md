---
layout: page
title: Teaching
eyebrow: Courses
permalink: /teaching/
description: Network science and programming courses at the University of Pisa, PhD schools and outreach activities.
nav: true
nav_order: 6
wide: true
---

{%- assign courses = site.projects | where_exp: "c", "c.level" -%}
{%- assign current = courses | where: "status", "current" | sort: "order" -%}
{%- assign past = courses | where: "status", "past" | sort: "order" -%}

<div class="section-head"><div><div class="eyebrow">Now teaching</div><h2>Current courses</h2></div></div>

<div class="course-list">
{%- for c in current %}
  <article class="card course reveal">
    <div class="course__img"><img src="{{ c.img | relative_url }}" alt="" loading="lazy" width="800" height="350"></div>
    <div class="course__body">
      <div class="course__meta">
        <span class="level level--{{ c.level | downcase }}">{{ c.level }}</span>
        {%- if c.institution %}<span><i class="fas fa-university" aria-hidden="true"></i> {{ c.institution }}</span>{% endif %}
        {%- if c.period %}<span><i class="far fa-calendar" aria-hidden="true"></i> {{ c.period }}</span>{% endif %}
      </div>
      <h3>{{ c.title }}</h3>
      <p>{{ c.summary }}</p>
      <div class="course__links">
        <a class="btn btn--primary btn--sm" href="{{ c.url | relative_url }}">Course page <i class="fas fa-arrow-right" aria-hidden="true"></i></a>
        {%- if c.materials %}<a class="btn btn--ghost btn--sm" href="{{ c.materials }}" target="_blank" rel="noopener"><i class="fab fa-github" aria-hidden="true"></i> Materials</a>{% endif %}
      </div>
    </div>
  </article>
{%- endfor %}
</div>

<div class="section-head" style="margin-top:4rem"><div><div class="eyebrow">Archive</div><h2>Past teaching</h2><p>PhD courses, previous university courses and outreach.</p></div></div>

<div class="grid grid--3 course-past">
{%- for c in past %}
  {%- if c.link == false %}<div class="card media-card course-mini reveal">{% else %}<a class="card media-card course-mini reveal" href="{{ c.url | relative_url }}">{% endif %}
    <div class="media-card__img"><img src="{{ c.img | relative_url }}" alt="" loading="lazy"></div>
    <div class="media-card__body">
      <div class="course__meta"><span class="level level--{{ c.level | downcase }}">{{ c.level }}</span><span>{{ c.period }}</span></div>
      <h3>{{ c.title }}</h3>
      <p>{{ c.institution }}{% if c.summary %} · {{ c.summary }}{% endif %}</p>
    </div>
  {%- if c.link == false %}</div>{% else %}</a>{% endif %}
{%- endfor %}
</div>
