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
---

Large Language Models are rapidly becoming *participants* in the social systems we study: they write, recommend, moderate, persuade and, increasingly, interact with each other.
This research line looks at generative AI through the lens of network and computational social science, along two complementary directions.

**LLMs as social and cognitive actors.**
We investigate how LLMs represent knowledge and reproduce (or amplify) human biases, using cognitive network science tools such as free-association norms and *forma mentis* networks; we study how LLM agents agree, polarize or drift when they debate each other, and under which conditions they can persuade humans.

**Social Twins.**
We design LLM-powered *digital twins* of online platforms in which synthetic users, each with a persona, interests and memory, post, comment, follow and react to a recommender system.
Social twins make it possible to run controlled, reproducible and ethically safe experiments on recommender systems, content moderation and information spread that would be impossible on real platforms.

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

## Objectives
- characterise the cognitive and social biases of LLMs and compare them with human behaviour;
- model opinion dynamics in populations of LLM agents and in hybrid human–AI networks;
- build open, reproducible social twins to evaluate the societal impact of platform design choices.

<div class="publications">
  <h2>Related publications</h2>
  {% bibliography -f papers -q @*[genai=true]* %}
</div>
