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
  assert.match(output, /maintain PROJECT_BRIEF\.md when manager-level project context changes/);
  assert.doesNotMatch(output, /ask your agent/i);
});

test('skill frontmatter and body target manager-facing project control', () => {
  const skill = read('skills/ai-native-project-brief/SKILL.md');

  assert.match(skill, /^---\nname: ai-native-project-brief/m);
  assert.match(skill, /Use when introducing, managing, onboarding, or re-orienting an AI-native software project/);
  assert.match(skill, /PROJECT_BRIEF\.md/);
  assert.match(skill, /Automatic Behavior/);
  assert.match(skill, /do not stop at advice or a suggested outline/i);
  assert.match(skill, /do not require the user to say a special command/i);
  assert.match(skill, /Manager-Control Lens/);
  assert.match(skill, /Project Evolution/);
  assert.match(skill, /Next Human Decisions/);
});

test('skill requires language-matched briefs', () => {
  const skill = read('skills/ai-native-project-brief/SKILL.md');

  assert.match(skill, /## Language Matching/);
  assert.match(skill, /Prefer the language of the current user request/);
  assert.match(skill, /Korean user prompts should produce Korean briefs/);
  assert.match(skill, /section headings, table headers, Mermaid titles/);
  assert.match(skill, /Do not leave starter-template English headings in a non-English brief/);
  assert.match(skill, /Keep paths, commands, identifiers, URLs/);
});

test('skill gives natural Korean heading guidance', () => {
  const skill = read('skills/ai-native-project-brief/SKILL.md');

  assert.match(skill, /natural project-management Korean rather than literal word-by-word translations/);
  assert.match(skill, /사람이 결정해야 할 사항/);
  assert.match(skill, /다음 작업자 안내/);
  assert.match(skill, /다음 사람 결정/);
  assert.match(skill, /새 작업자 브리프/);
});

test('README describes automatic behavior instead of command-style usage prompts', () => {
  const readme = read('README.md');

  assert.match(readme, /Automatic Project Brief Behavior/);
  assert.match(readme, /should create or update/);
  assert.match(readme, /should not need to remember a separate command/);
  assert.match(readme, /The output language follows the current user request first/);
  assert.match(readme, /Korean prompts should produce Korean prose/);
  assert.doesNotMatch(readme, /ask for one of these/i);
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

test('repo carries its own manager-facing PROJECT_BRIEF', () => {
  const brief = read('PROJECT_BRIEF.md');

  for (const heading of [
    'Manager Summary',
    'Project Evolution',
    'Current Architecture',
    'Operating Model',
    'Key Decisions',
    'Verification And Quality Gates',
    'Risks And Watchpoints',
    'Next Human Decisions'
  ]) {
    assert.match(brief, new RegExp(`## ${heading}`));
  }

  assert.match(brief, /```mermaid\n+timeline/);
  assert.match(brief, /```mermaid\n+flowchart/);
  assert.match(brief, /```mermaid\n+sequenceDiagram/);
  assert.match(brief, /automatic brief maintenance/i);
});
