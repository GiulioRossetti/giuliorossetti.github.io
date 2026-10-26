---
layout: page
title: LLM-based Opinion Dynamics
description: SNA@KDD
eyebrow: Research topic · Generative AI
summary: "How populations of LLM agents form, exchange and change opinions when they debate in a network, and how they influence humans."
img: assets/img/research/llm-opinion.svg
illo: research-llm-opinion
importance: 1
category: Research Topics
---

Opinion dynamics models describe how individual views evolve through social interaction: agents meet, compare their positions and update them, giving rise to consensus, polarization or fragmentation at the population level.
Classic models encode these rules as simple numerical updates, as in bounded confidence.
Large Language Models change the picture. Agents can now *argue in natural language*, and their opinions emerge from what they read and write rather than from a predefined equation.

This line of work uses LLM agents as the units of opinion dynamics simulations, and asks two questions:
what collective behaviour emerges when LLMs discuss with each other, and what does it tell us about the models themselves and about their role in human debates?

**Agreement, drift and biases.**
LLM agents are not neutral discussants.
We have shown that their opinion changes depend on *selective agreement* rather than plain sycophancy, that mixing models with different built-in biases shapes the final outcome of a debate, and that populations of agents tend to *drift* towards specific positions regardless of their starting point.

**The role of the network.**
Who talks to whom matters.
We embed LLM agents in social networks with different structures and study how topology, homophily and community structure amplify or dampen agreement drift, comparing the results with classic bounded-confidence dynamics.

**Language as the medium of influence.**
Since opinions are exchanged as text, we can analyse *how* agents persuade each other, which arguments, rhetorical strategies and logical fallacies they use, and connect these findings to studies on LLM persuasion of human users.

## Objectives
- define reproducible protocols for opinion dynamics simulations among LLM agents;
- measure biases, sycophancy and agreement drift across models, prompts and network structures;
- compare language-driven dynamics with classic opinion dynamics models;
- assess the persuasive power of LLMs on humans and the factors that make people susceptible to it.

<div class="callout">
  This topic is part of the <a href="{{ '/projects/project-genai/' | relative_url }}">GenAI &amp; Social Twins</a> research line.
  The same agents can be deployed in <a href="https://y-not.social/" target="_blank" rel="noopener">YSocial</a> to study opinion dynamics on a simulated social media platform.
</div>

<div class="publications">
  <h2>Related publications</h2>
  {% bibliography -f papers -q @*[llmod=true]* %}
</div>
