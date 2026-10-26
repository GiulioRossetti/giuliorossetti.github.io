---
layout: page
eyebrow: Research line
summary: "Dynamic, multilayer, higher-order and feature-rich network models, with algorithms and statistical validation for networked data."
title: Network Modeling
description: SNA@KDD
img: assets/img/research/netmod.svg
illo: research-netmod
importance: 1
category: Research Lines
accent: net
intro: |
  Networks describe countless real-world phenomena, from biological interactions to human behaviour, as **entities connected by relations**: users exchanging messages on a platform, for instance, become nodes linked by edges.

  Classic network science often treats social interactions as simple, static, pairwise graphs. That abstraction is useful, but too coarse for phenomena that are *dynamic*, *multi-resolution* and *not necessarily binary*. We develop **enriched network models** that capture this complexity, together with the algorithms and validation methods needed to use them.
glance:
  - label: Models
    items: [Dynamic, Multilayer, Higher-order, Feature-rich]
  - label: Tasks
    items: [Community discovery, Link prediction, Network embedding, Statistical validation]
  - label: Our libraries
    items:
      - {label: CDlib, url: "https://cdlib.readthedocs.io"}
      - {label: DyNetX, url: "https://dynetx.readthedocs.io"}
      - {label: NDlib, url: "https://ndlib.readthedocs.io"}
highlights_title: Beyond simple graphs
highlights_intro: Four complementary ways of enriching the network abstraction, often studied in isolation and increasingly combined in our work.
highlights:
  - icon: fas fa-history
    title: Dynamic networks
    text: Nodes and edges appear and vanish over time; models keep track of when interactions happen, not only whether they happen.
  - icon: fas fa-layer-group
    title: Multilayer networks
    text: The same actors connected by different kinds of relations, such as friendship, communication and collaboration, analysed jointly.
  - icon: fas fa-shapes
    title: Higher-order networks
    text: Hypergraphs and simplicial complexes capture group interactions that cannot be reduced to pairs.
  - icon: fas fa-tags
    title: Feature-rich networks
    text: Node and edge attributes, such as opinions, demographics or text, enter the model alongside the topology.
objectives:
  - Define enhanced network models that describe complex phenomena, fusing feature-rich, dynamic and higher-order representations.
  - Design novel algorithms to extract valuable knowledge from networked data.
  - Develop sound methodologies to statistically validate network models and algorithms.
pubs_key: net
---
