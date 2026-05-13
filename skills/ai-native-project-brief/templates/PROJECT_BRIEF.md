# Project Brief

## Manager Summary

State what this project is, why it matters, current maturity, and the next manager-level decision. Keep this section short enough to read first.

## Why This Exists

- Problem:
- Target user or operator:
- Value:
- Non-goals:

## Project Evolution

This is the project's actual progression so far, not the future todo list.

```mermaid
timeline
    title Project Evolution
    Start : Problem identified
          : Initial experiment or prototype
    Build : Core workflow implemented
          : Main architecture choices made
    Current : Current working state
            : Next manager decision needed
```

## Current Product State

| Area | State | Evidence | Notes |
|---|---|---|---|
| Core workflow | Needs confirmation |  |  |
| Demo or runtime | Needs confirmation |  |  |
| Deployment | Needs confirmation |  |  |
| Documentation | Needs confirmation |  |  |

## Current Architecture

```mermaid
flowchart LR
    Owner["Human Owner / Manager"] --> Direction["Goals, priorities, decisions"]
    Direction --> Agents["AI Coding Agents"]
    Agents --> Repo["Repository"]
    Repo --> Product["Product / System"]
    Agents --> Brief["PROJECT_BRIEF.md"]
    Brief --> Owner
```

Manager-level explanation:

- Main components:
- Data or control flow:
- Runtime/deployment shape:
- Boundaries a new worker must respect:

## Operating Model

```mermaid
sequenceDiagram
    participant O as Owner
    participant A as AI Agent
    participant R as Repo
    participant V as Verification
    participant B as PROJECT_BRIEF.md

    O->>A: Direction, constraints, decisions
    A->>R: Inspect and implement
    A->>V: Run checks
    A->>B: Update manager-level context
    B-->>O: Current state, risks, next decisions
```

- How work starts:
- How decisions are made:
- How verification works:
- How this brief stays current:

## Key Decisions

| Date | Decision | Why It Mattered | Current Impact | Source |
|---|---|---|---|---|
| Needs confirmation |  |  |  |  |

## Workstreams

| Workstream | Current State | Owner / Agent Role | Next Step |
|---|---|---|---|
| Product | Needs confirmation |  |  |
| Architecture | Needs confirmation |  |  |
| Data | Needs confirmation |  |  |
| Automation | Needs confirmation |  |  |
| Deployment | Needs confirmation |  |  |
| Documentation | Needs confirmation |  |  |

## Dependencies And Access

| Dependency | Purpose | Location / Access Pattern | Risk |
|---|---|---|---|
| Needs confirmation |  |  |  |

## Verification And Quality Gates

| Check | Command / Evidence | When To Run | Pass Criteria |
|---|---|---|---|
| Needs confirmation |  |  |  |

## Risks And Watchpoints

| Risk | Why It Matters | Watch Signal | Mitigation |
|---|---|---|---|
| Needs confirmation |  |  |  |

## Next Human Decisions

These are decisions the AI agent should not silently make alone.

- Needs confirmation:

## New Worker Brief

Read this before touching code:

1. 
2. 
3. 

## Needs Confirmation

- 
