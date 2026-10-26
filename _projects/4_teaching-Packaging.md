---
layout: page
title: The Proper Python Developer
description: KDDlab's PhDs (2022)
img: assets/img/teaching/packaging.svg
illo: teaching-packaging
importance: 1
category: PhD
level: PhD
institution: "KDD Lab PhD students"
period: "2022"
status: past
order: 4
summary: "How to structure, test and publish a Python package with GitHub Actions."
where: "University of Pisa"
duration: "2 hours"
instructors: "Dr. Giulio Rossetti"
accent: twins
intro: |
  A short, practical course built around a <a href="https://github.com/GiulioRossetti/Python-Project-Template">template repository</a>: how to **structure a Python project** and use **GitHub Actions** to automatically build and publish it as a package on PyPI and Conda.

  The example package is deliberately simple, an object class, a container and a few functions to sort objects and convert them from and to JSON, so that the focus stays on the tooling.
glance:
  - label: Topics
    items: [Packaging, CI/CD, Testing, Documentation]
  - label: Resources
    items:
      - {label: Template repository, url: "https://github.com/GiulioRossetti/Python-Project-Template"}
      - {label: Wiki, url: "https://github.com/GiulioRossetti/Python-Project-Template/wiki"}
highlights_title: What the template includes
highlights:
  - icon: fas fa-rocket
    title: Automatic releases
    text: GitHub Actions that build and publish the package to PyPI and Conda when a release is created, or on demand.
  - icon: fas fa-shield-alt
    title: Code quality
    text: CodeQL analysis and a check for compliance with the Black code style on every push.
  - icon: fas fa-vial
    title: Tests
    text: A few pytest tests, with coverage configuration, to show how to test a package.
  - icon: fas fa-book
    title: Documentation
    text: A minimal Sphinx documentation ready for Read the Docs.
  - icon: fas fa-sliders-h
    title: Configuration
    text: Minimal setup.py, .gitignore and .coveragerc files explained step by step.
  - icon: fas fa-graduation-cap
    title: Crash course
    text: The repository wiki walks through each of the topics above.
---
