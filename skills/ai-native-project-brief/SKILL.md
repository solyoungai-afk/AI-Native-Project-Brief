---
name: ai-native-project-brief
description: Use when introducing, managing, onboarding, or re-orienting an AI-native software project; when a human owner needs manager-facing project control context; after brainstorming or project work changes history, architecture, risks, decisions, dependencies, verification, or next human decisions.
---

# AI Native Project Brief

## Purpose

Maintain a root-level `PROJECT_BRIEF.md` for the human project owner. In an AI-native project, coding agents can inspect implementation details; the manager needs control context: why the project exists, how it evolved, current state, operating model, risks, validation, dependencies, and decisions that require human judgment.

This skill is independent. It may be used after `superpowers:brainstorming`, but it does not modify or depend on Superpowers internals.

## Automatic Behavior

When this skill triggers, do not stop at advice or a suggested outline. Create or update `PROJECT_BRIEF.md` as part of the task unless the user explicitly says not to write files, the current workspace has no identifiable project root, or another owner-facing brief already exists and should be updated instead.

Do not require the user to say a special command such as "create project brief" during normal work. If the conversation or code changes reveal manager-level context, maintain the brief automatically before finishing.

## When To Use

Use when:

- A project needs an owner/manager-facing overview, not just code documentation.
- A new AI worker or human collaborator must understand the project fast.
- Superpowers brainstorming produced direction that should become durable project context.
- Work changed product scope, architecture, operations, deployment, risk, dependencies, or next decisions.
- The user asks for architecture, operating flow, project progress, AI-native project introduction, manager docs, or Mermaid-heavy explanation.

Do not use for narrow implementation comments, API reference docs, or function-level code explanation unless those details change manager-level control context.

## Required Output

Create or update this file at the project root:

```text
PROJECT_BRIEF.md
```

If the repo already has an equivalent owner-facing document, update it instead and add a root link if needed. Write in the project/user language. If the user is Korean, Korean is usually correct; keep paths, commands, identifiers, URLs, and quoted errors exact.

## Manager-Control Lens

Prefer content a human owner must know to direct future AI work:

- Project purpose and value.
- How the project has evolved so far.
- Current product state: working, partial, blocked, abandoned, unknown.
- Current architecture at system level.
- Human-manager and AI-agent operating model.
- Key decisions and why they matter now.
- Workstreams and ownership boundaries.
- External dependencies: APIs, accounts, databases, models, servers, costs.
- Verification commands and quality gates.
- Risks, watchpoints, brittle areas, and unresolved assumptions.
- Next decisions that AI should not make alone.
- First-read instructions for a new worker.

Avoid filling the brief with low-level implementation details unless they affect risk, operations, or future decisions.

## Mermaid Requirements

Mermaid is the navigation layer, not decoration. Use diagrams to make the project understandable at a glance.

Minimum diagrams for a substantial project:

- `timeline` for project evolution. This is what happened so far, not a future todo list.
- `flowchart` for current architecture or system boundaries.
- `sequenceDiagram` or `flowchart` for the operating model: human owner, AI agents, repo, verification, deployment, and the brief.

Add more only when useful:

- `erDiagram` for manager-relevant data model.
- `stateDiagram-v2` for lifecycle/state risks.
- `graph` or `flowchart` for dependencies, workstreams, or deployment.

Keep each diagram focused. If one diagram tries to explain history, architecture, and operations at once, split it.

## Automatic Maintenance Workflow

1. Find the project root and read existing orientation docs: `PROJECT_BRIEF.md`, `README.md`, `AGENTS.md`, `docs/`, recent commits, issue notes, deployment docs, and scripts.
2. Identify manager-control facts. Separate what is known from what is inferred.
3. Create or update `PROJECT_BRIEF.md` using the template shape below.
4. Use Mermaid for project evolution, current architecture, and operating model.
5. Mark unknown history or unclear ownership as `Needs confirmation`; do not invent.
6. After brainstorming, planning, implementation, deployment, verification, or repo restructuring, silently ask: "Would the project owner need to know this to direct future AI work?" If yes, update the brief without waiting for another prompt.
7. Before finishing, verify the file has required sections, at least the needed Mermaid diagrams, and no stale contradictions.

## Template Shape

Use this structure unless the repo already has a stronger equivalent:

```markdown
# Project Brief

## Manager Summary

## Why This Exists

## Project Evolution

## Current Product State

## Current Architecture

## Operating Model

## Key Decisions

## Workstreams

## Dependencies And Access

## Verification And Quality Gates

## Risks And Watchpoints

## Next Human Decisions

## New Worker Brief

## Needs Confirmation
```

Copy the full starter template from `templates/PROJECT_BRIEF.md` when creating a new file.

## Update Triggers

Update `PROJECT_BRIEF.md` when work changes:

- Product scope, user-facing behavior, supported workflow, or demo state.
- Architecture, data flow, deployment, runtime process, storage, or integration.
- Automation, agent workflow, verification, release process, or operating assumptions.
- Important dependency, credential location, server, cost surface, model, or vendor.
- Risk level, brittle area, known limitation, rollback path, or human decision needed.

Do not update for tiny internal refactors that do not affect manager-level context.

## Quality Gate

Before claiming the brief is ready, check:

- The brief answers "what must the human owner know to manage this project?"
- Project evolution describes past progression, not only future tasks.
- Current state distinguishes working, partial, blocked, and unknown.
- Architecture is understandable without reading source code.
- Verification commands are exact and current.
- Risks and next human decisions are explicit.
- Mermaid diagrams render plausibly and are not overloaded.
- Unknowns are labeled instead of guessed.

## Common Failures

| Failure | Fix |
|---|---|
| Code inventory only | Rewrite around purpose, state, decisions, risks, and operating model. |
| Future todo mislabeled as project progress | Use `timeline` for actual past/current evolution; put future choices in `Next Human Decisions`. |
| One giant diagram | Split into evolution, architecture, and operations. |
| AI-invented history | Mark as `Needs confirmation` and cite evidence when possible. |
| No update after major change | Update `PROJECT_BRIEF.md` in the same work session. |
| Waiting for a special user command | Treat manager-level context changes as an automatic update trigger. |
