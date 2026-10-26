---
layout: page
eyebrow: Research line
summary: "Temporal network mining, dynamic community discovery and diffusion processes such as epidemics and opinion dynamics."
title: Network Dynamics
description: SNA@KDD
img: assets/img/research/dynamics.svg
illo: research-dynamics
importance: 2
category: Research Lines
accent: net
intro: |
  Relationships change, links are replaced, collaborations rise and fall: **the systems we study are constantly evolving**. Freezing a network in time helps describe it, but not to understand the dynamics that drive it.

  Temporal network mining works on timestamped interactions, from social exchanges to mobility traces and financial operations. Its goal is to uncover the relations between sequences of events in order to **describe and forecast** how time-evolving systems behave.
glance:
  - label: Data
    items: [Temporal networks, Interaction streams, Snapshot graphs]
  - label: Processes
    items: [Epidemics, Opinion dynamics, Information spreading]
  - label: Our libraries
    items:
      - {label: DyNetX, url: "https://dynetx.readthedocs.io"}
      - {label: NDlib, url: "https://ndlib.readthedocs.io"}
      - {label: CDlib, url: "https://cdlib.readthedocs.io"}
highlights_title: Three families of problems
highlights:
  - icon: fas fa-dot-circle
    title: Individual dynamics
    text: How local structures, nodes and edges, appear and disappear over time, as in link and node prediction.
  - icon: fas fa-object-group
    title: Collective dynamics
    text: How the mesoscale topology changes as local structures do, as in dynamic community discovery and frequent pattern mining.
  - icon: fas fa-broadcast-tower
    title: Diffusion processes
    text: How epidemics, opinions and information flow on top of static and evolving network structures.
objectives:
  - Define novel algorithms to study dynamic network topologies.
  - Model diffusive processes, such as epidemics and opinion dynamics, unfolding on complex topologies.
  - Understand the feedback loops between topological dynamics and diffusive processes.
pubs_key: dyn
---
