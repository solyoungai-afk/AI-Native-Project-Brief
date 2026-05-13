import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('package exposes the installer bin', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.name, 'ai-native-project-brief');
  assert.equal(pkg.bin['ai-native-project-brief'], './bin/install.js');
  assert.match(pkg.repository.url, /AI-Native-Project-Brief/);
});

test('installer lists supported providers', () => {
  const output = execFileSync(process.execPath, ['bin/install.js', '--list', '--no-color'], {
    cwd: repoRoot,
    encoding: 'utf8'
  });

  assert.match(output, /Codex CLI/);
  assert.match(output, /Cursor/);
  assert.match(output, /GitHub Copilot/);
  assert.match(output, /npx skills add/);
});

test('dry-run for codex prints skills add command without writing', () => {
  const output = execFileSync(process.execPath, ['bin/install.js', '--dry-run', '--only', 'codex', '--no-color'], {
    cwd: repoRoot,
    encoding: 'utf8'
  });

  assert.match(output, /would run: npx -y skills add solyoungai-afk\/AI-Native-Project-Brief -g -a codex -s ai-native-project-brief --yes/);
  assert.match(output, /installed codex/);
});

test('skill frontmatter and body target manager-facing project control', () => {
  const skill = read('skills/ai-native-project-brief/SKILL.md');

  assert.match(skill, /^---\nname: ai-native-project-brief/m);
  assert.match(skill, /Use when introducing, managing, onboarding, or re-orienting an AI-native software project/);
  assert.match(skill, /PROJECT_BRIEF\.md/);
  assert.match(skill, /Manager-Control Lens/);
  assert.match(skill, /Project Evolution/);
  assert.match(skill, /Next Human Decisions/);
});

test('brief template contains required sections and Mermaid diagrams', () => {
  const template = read('skills/ai-native-project-brief/templates/PROJECT_BRIEF.md');

  for (const heading of [
    'Manager Summary',
    'Why This Exists',
    'Project Evolution',
    'Current Product State',
    'Current Architecture',
    'Operating Model',
    'Key Decisions',
    'Dependencies And Access',
    'Verification And Quality Gates',
    'Risks And Watchpoints',
    'Next Human Decisions',
    'New Worker Brief'
  ]) {
    assert.match(template, new RegExp(`## ${heading}`));
  }

  assert.match(template, /```mermaid\n+timeline/);
  assert.match(template, /```mermaid\n+flowchart/);
  assert.match(template, /```mermaid\n+sequenceDiagram/);
});
