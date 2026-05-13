# AI Native Project Brief

Manager-facing project brief skill for AI-native projects.

AI coding agents can inspect and change code. The human project owner still needs a durable control document: why the project exists, how it evolved, what works now, what risks matter, what needs human decisions, and what a new worker must understand before touching the repo.

This repository installs a Codex/agent skill that creates and maintains a root-level `PROJECT_BRIEF.md` using Mermaid diagrams as the navigation layer.

## Install

```powershell
npx -y github:solyoungai-afk/AI-Native-Project-Brief
```

Install for one target:

```powershell
npx -y github:solyoungai-afk/AI-Native-Project-Brief -- --only codex
```

Preview without writing:

```powershell
npx -y github:solyoungai-afk/AI-Native-Project-Brief -- --dry-run
```

List supported targets:

```powershell
npx -y github:solyoungai-afk/AI-Native-Project-Brief -- --list
```

Uninstall from detected or selected targets:

```powershell
npx -y github:solyoungai-afk/AI-Native-Project-Brief -- --uninstall
```

## Usage

In an AI coding session, ask for one of these:

- "Create a project brief for this AI-native project."
- "Update `PROJECT_BRIEF.md` after this work."
- "Show the manager-facing project state with Mermaid."
- "After Superpowers brainstorming, create the project brief."

The skill should create or update:

```text
PROJECT_BRIEF.md
```

The brief is for the human manager or project owner, not only for code readers. It should explain project purpose, evolution, current product state, architecture, operating model, key decisions, dependencies, verification, risks, and next human decisions.

## Supported Install Targets

The installer delegates to `npx skills add/remove` for skill-compatible agents:

- Codex
- Cursor
- Windsurf
- Cline
- Continue
- GitHub Copilot
- Roo Code
- Kilo Code
- Augment Code
- Aider Desk
- Sourcegraph Amp
- Qwen Code
- OpenHands
- Warp
- Replit
- and other `skills` CLI profiles listed by `--list`

## Development

```powershell
npm test
node bin/install.js --list
node bin/install.js --dry-run --only codex
```
