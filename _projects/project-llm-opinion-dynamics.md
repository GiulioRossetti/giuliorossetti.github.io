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
accent: genai
intro: |
  Opinion dynamics models describe how individual views evolve through social interaction, giving rise to **consensus, polarization or fragmentation**. Classic models encode these updates as simple numerical rules, as in bounded confidence.

  LLMs change the picture: agents can now **argue in natural language**, and their opinions emerge from what they read and write. We use LLM agents as the units of opinion dynamics simulations to understand what collective behaviour they produce, and what that reveals about the models and about their role in human debates.
glance:
  - label: Questions
    items: [Agreement drift, Sycophancy, Model biases, Persuasion]
  - label: Part of
    items:
      - {label: GenAI & Social Twins, url: /projects/project-genai/}
      - {label: Network Dynamics, url: /projects/project-dynamics/}
  - label: Simulate it in
    items:
      - {label: YSocial, url: "https://y-not.social/"}
highlights_title: What we found, and what we study
highlights:
  - icon: fas fa-balance-scale
    title: Agreement, drift and biases
    text: LLM agents are not neutral discussants. Their opinion changes follow selective agreement rather than plain sycophancy, mixing models with different biases shapes the outcome, and populations tend to drift towards specific positions.
  - icon: fas fa-project-diagram
    title: The role of the network
    text: Who talks to whom matters. We embed agents in networks with different topologies, homophily and community structure, and compare the results with classic bounded-confidence dynamics.
  - icon: fas fa-comments
    title: Language as influence
    text: Since opinions travel as text, we can analyse which arguments, rhetorical strategies and fallacies agents use, and link them to how LLMs persuade human users.
objectives:
  - Define reproducible protocols for opinion dynamics simulations among LLM agents.
  - Measure biases, sycophancy and agreement drift across models, prompts and network structures.
  - Compare language-driven dynamics with classic opinion dynamics models.
  - Assess the persuasive power of LLMs on humans and the factors that make people susceptible to it.
pubs_key: llmod
---
