---
title: DevOps - What to Give a 💩 About
pubDatetime: 2019-02-24T17:00:00Z
author: Jordan Simonovski
description: What makes DevOps successful?
tags:
  - devops
  - organisation
  - operations
  - culture
featured: false
draft: false
---

_I'm making this a live document of sorts that I'll continue to update as my understanding of the philosophy continues to evolve. Maintaining this in listicle format to make it easy to write and ingest. Dont @ me._

As someone that maintains and sets up the infrastructure that an organisation _needs_, what do I need to give a 💩 about? (in no particular order)

## 1) Do You Understand the State of Everything in the Existence of Everything That You've Made?

Convoluted sub-title aside, what I'm trying to say is that we should give a 💩 about knowing exactly what we're running within the ecosystem that we maintain. i.e.:
- How many servers are we running?
- Where are they running?
- How are they running?
- Who owns it?
- Is it up-to-date?
- How much does it cost?

What gives us this kind of visibility is the investment in centralised observability.

## 2) Invest in Great Tooling

As most organisations begin to grow, the scripts that we once used to deploy our applications no longer fit the complexity of the ecosystem that we have gradually created over the years. 
Whether this is with a team setting up the tooling that allows development teams the flexibility to work within a more standardised platform, there needs to be a sense of complete ownership of the platform that the devs are interacting with.

## 3) Trimming the Fat

Focus on spending time identifying the infra that isn't being used or that isn't delivering value to the business, and get rid of it. Get into the habit of treating your infrastucture as ephemeral, and get rid of the things you no longer need. Your sanity managing all of that infra, your security engineer will be happier with a smaller threat landscape, and your AWS bill will remain maintainable.

## 4) What Are Our Feature Lead Times?

Is the complexity of our ecosystem impeding products' ability to deliver more features? How do we make this as effortless as possible without sacrificing stability and security?

## 5) How Comfortable Are Devs with Owning Their Apps End to End?

Give a 💩 about teams being comfortable with teams owning their applications end-to-end. This means, owning development, testing, deployments, maintenance, and on-call.

## 6) Is Reliability a Requirement?

Give a 💩 about making reliability a requirement. If your engineers are spending every morning fixing up an environment because it can't successfully recover, make some time to fix it before it becomes a much bigger problem.

## 7) Do We Have the Right Security Controls in Place?

One often forgotten thing to focus on in most organisations is making security the easy thing to do. If you're requiring developers to fill out some kind of spreadsheet and update data flow diagrams with every release they try to make, you're doing it wrong.
Invest in automating security controls like:
- container scanning
- port scanning
- dynamic/static code analysis
- put the right controls in place on the IAM roles devs are making for their apps.
- get a good secrets management solution in place

This is by far one of the hardest things to do in order to maintain operational efficacy as well as security in an organisation.