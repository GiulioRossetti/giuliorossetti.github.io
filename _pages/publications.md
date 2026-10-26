---
layout: page
og_image: /assets/img/og/publications.png
permalink: /publications/
title: Publications
eyebrow: Research output
description: Journal articles, conference papers, book chapters and preprints, in reverse chronological order. Filter by type or search by title, author or venue.
years: [2027, 2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011]
nav: true
nav_order: 3
wide: true
---

<div class="pub-toolbar" role="search">
  <label class="search">
    <span class="sr-only">Search publications</span>
    <i class="fas fa-search" aria-hidden="true"></i>
    <input type="search" placeholder="Search title, author, venue…" data-pub-search autocomplete="off">
  </label>
  <div class="filter-group" role="group" aria-label="Filter by type">
    <button type="button" class="filter-btn" data-pub-type="all" aria-pressed="true">All</button>
    <button type="button" class="filter-btn" data-pub-type="journal" aria-pressed="false" style="--type-color: var(--navy)"><span class="dot"></span>Journals</button>
    <button type="button" class="filter-btn" data-pub-type="conference" aria-pressed="false" style="--type-color: var(--magenta)"><span class="dot"></span>Conferences</button>
    <button type="button" class="filter-btn" data-pub-type="book" aria-pressed="false" style="--type-color: var(--teal)"><span class="dot"></span>Books &amp; chapters</button>
    <button type="button" class="filter-btn" data-pub-type="preprint" aria-pressed="false" style="--type-color: var(--ochre)"><span class="dot"></span>Preprints</button>
  </div>
  <span class="pub-count" data-pub-count aria-live="polite"></span>
</div>

<nav class="year-nav" aria-label="Jump to year">
{%- for y in page.years %}<a href="#y{{ y }}">{{ y }}</a>{% endfor %}
<a href="https://scholar.google.com/citations?user={{ site.scholar_userid }}" target="_blank" rel="noopener">· Google Scholar ↗</a>
</nav>

<div class="publications" data-pub-filter-root>
{%- for y in page.years %}
  <section class="pub-year" id="y{{ y }}">
    <h2>{{ y }}</h2>
    <div>{% bibliography -f papers -q @*[year={{ y }}]* %}</div>
  </section>
{%- endfor %}
  <p class="no-results">No publications match your search.</p>
</div>
