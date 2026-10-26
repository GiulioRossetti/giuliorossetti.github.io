---
layout: page
title: GenAI & Social Twins
description: SNA@KDD
eyebrow: Research line
summary: "LLM cognition and biases, opinion dynamics among LLM agents, and LLM-powered digital twins of social media platforms such as YSocial."
img: assets/img/research/genai.svg
illo: research-genai
importance: 0
category: Research Lines
accent: genai
intro: |
  Large Language Models are becoming **participants in the social systems we study**: they write, recommend, moderate and persuade, and they increasingly interact with each other.

  This research line looks at generative AI through the lens of network and computational social science. We study LLMs as social and cognitive actors, and we use them to build **social twins**, simulated platforms where controlled experiments on online behaviour become possible.
glance:
  - label: Topics
    items: [LLM biases, Persuasion, Agent-based simulation, Recommender systems]
  - label: Explore
    items:
      - {label: LLM-based Opinion Dynamics, url: /projects/project-llm-opinion-dynamics/}
      - {label: Cognitive NetSci, url: /projects/project-cognetsci/}
      - {label: y-not.social, url: "https://y-not.social/"}
highlights_title: Two complementary directions
highlights:
  - icon: fas fa-brain
    title: LLMs as social and cognitive actors
    text: How LLMs represent knowledge and reproduce or amplify human biases, studied with free-association norms and forma mentis networks; how LLM agents agree, polarize or drift in debates, and when they persuade humans.
  - icon: fas fa-clone
    title: Social twins
    text: LLM-powered digital twins of online platforms, where synthetic users with personas, interests and memory post, comment and follow, enabling reproducible and ethically safe experiments on moderation and recommendation.
objectives:
  - Characterise the cognitive and social biases of LLMs and compare them with human behaviour.
  - Model opinion dynamics in populations of LLM agents and in hybrid human–AI networks.
  - Build open, reproducible social twins to evaluate the societal impact of platform design choices.
pubs_key: genai
---

<div class="ys-callout">
  <div class="ys-aurora" aria-hidden="true"><i></i><i></i><i></i></div>
  <div>
    <a class="ys-brand" href="https://y-not.social/" target="_blank" rel="noopener"><img src="{{ '/assets/img/ysocial/ysocial-logo.png' | relative_url }}" alt="YSocial logo" width="44" height="44"><span class="ys-wordmark">YSocial</span></a>
    <p>Our open-source <span class="ys-grad"><strong>social media digital twin</strong></span>: LLM-driven agents post, reply and react to a recommender system, in a controlled environment you can inspect and reproduce.</p>
    <div class="ys-ctas">
      <a class="ys-btn primary" href="https://y-not.social/" target="_blank" rel="noopener"><i class="fas fa-globe" aria-hidden="true"></i> y-not.social</a>
      <a class="ys-btn ghost" href="https://github.com/YSocialTwin" target="_blank" rel="noopener"><i class="fab fa-github" aria-hidden="true"></i> GitHub</a>
    </div>
  </div>
  {% include ysocial_feed.html %}
</div>
