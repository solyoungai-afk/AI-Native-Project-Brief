#!/usr/bin/env node
'use strict';

const childProcess = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const REPO = 'solyoungai-afk/AI-Native-Project-Brief';
const SKILL = 'ai-native-project-brief';

const PROVIDERS = [
  { id: 'codex', label: 'Codex CLI', profile: 'codex', detect: 'command:codex' },
  { id: 'cursor', label: 'Cursor', profile: 'cursor', detect: 'command:cursor||macapp:Cursor' },
  { id: 'windsurf', label: 'Windsurf', profile: 'windsurf', detect: 'command:windsurf||macapp:Windsurf' },
  { id: 'cline', label: 'Cline', profile: 'cline', detect: 'vscode-ext:cline' },
  { id: 'continue', label: 'Continue', profile: 'continue', detect: 'vscode-ext:continue.continue||vscode-ext:continue' },
  { id: 'roo', label: 'Roo Code', profile: 'roo', detect: 'vscode-ext:roo||vscode-ext:rooveterinaryinc.roo-cline||cursor-ext:roo' },
  { id: 'kilo', label: 'Kilo Code', profile: 'kilo', detect: 'vscode-ext:kilocode' },
  { id: 'augment', label: 'Augment Code', profile: 'augment', detect: 'vscode-ext:augment||jetbrains-plugin:augment' },
  { id: 'copilot', label: 'GitHub Copilot', profile: 'github-copilot', detect: 'command:copilot', soft: true },
  { id: 'aider-desk', label: 'Aider Desk', profile: 'aider-desk', detect: 'command:aider' },
  { id: 'amp', label: 'Sourcegraph Amp', profile: 'amp', detect: 'command:amp' },
  { id: 'qwen', label: 'Qwen Code', profile: 'qwen-code', detect: 'command:qwen' },
  { id: 'openhands', label: 'OpenHands', profile: 'openhands', detect: 'command:openhands' },
  { id: 'warp', label: 'Warp', profile: 'warp', detect: 'command:warp' },
  { id: 'replit', label: 'Replit Agent', profile: 'replit', detect: 'command:replit' },
  { id: 'junie', label: 'JetBrains Junie', profile: 'junie', detect: 'jetbrains-plugin:junie', soft: true },
  { id: 'qoder', label: 'Qoder', profile: 'qoder', detect: 'dir:$HOME/.qoder', soft: true },
  { id: 'antigravity', label: 'Google Antigravity', profile: 'antigravity', detect: 'dir:$HOME/.gemini/antigravity', soft: true }
];

function parseArgs(argv) {
  const opts = {
    dryRun: false,
    list: false,
    help: false,
    uninstall: false,
    yes: false,
    noColor: false,
    skipFallback: false,
    only: []
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    switch (arg) {
      case '--':
        break;
      case '--dry-run':
        opts.dryRun = true;
        break;
      case '--list':
        opts.list = true;
        break;
      case '--help':
      case '-h':
        opts.help = true;
        break;
      case '--uninstall':
      case '-u':
        opts.uninstall = true;
        break;
      case '--yes':
      case '-y':
      case '--non-interactive':
        opts.yes = true;
        break;
      case '--no-color':
        opts.noColor = true;
        break;
      case '--skip-fallback':
        opts.skipFallback = true;
        break;
      case '--only': {
        const value = argv[++i];
        if (!value || value.startsWith('--')) die('--only requires an agent id');
        opts.only.push(value);
        break;
      }
      default:
        die(`unknown flag: ${arg}\nrun with --help for usage`);
    }
  }

  const known = new Set(PROVIDERS.map((p) => p.id));
  for (const id of opts.only) {
    if (!known.has(id)) die(`unknown agent: ${id}\nrun with --list for valid ids`);
  }

  return opts;
}

function die(message) {
  process.stderr.write(`ai-native-project-brief: ${message}\n`);
  process.exit(2);
}

function color(enabled) {
  const wrap = (code) => (text) => enabled ? `\x1b[${code}m${text}\x1b[0m` : text;
  return {
    title: wrap('36;1'),
    ok: wrap('32'),
    warn: wrap('33'),
    dim: wrap('2')
  };
}

function hasCommand(command) {
  try {
    const cmd = process.platform === 'win32' ? 'where' : 'sh';
    const args = process.platform === 'win32' ? [command] : ['-c', `command -v ${shellQuote(command)}`];
    return childProcess.spawnSync(cmd, args, { stdio: 'ignore' }).status === 0;
  } catch (_) {
    return false;
  }
}

function shellQuote(value) {
  return `'${String(value).replace(/'/g, `'\\''`)}'`;
}

function expandHome(value) {
  return value.replace(/^\$HOME/, os.homedir()).replace(/^~/, os.homedir());
}

function macAppPresent(name) {
  if (process.platform !== 'darwin') return false;
  return fs.existsSync(`/Applications/${name}.app`) ||
    fs.existsSync(path.join(os.homedir(), 'Applications', `${name}.app`));
}

function vscodeExtPresent(needle) {
  const roots = [
    path.join(os.homedir(), '.vscode/extensions'),
    path.join(os.homedir(), '.vscode-server/extensions'),
    path.join(os.homedir(), '.cursor/extensions'),
    path.join(os.homedir(), '.windsurf/extensions')
  ];
  const pattern = new RegExp(needle, 'i');
  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    try {
      if (fs.readdirSync(root).some((entry) => pattern.test(entry))) return true;
    } catch (_) {
      // Ignore unreadable extension roots.
    }
  }
  return false;
}

function cursorExtPresent(needle) {
  const root = path.join(os.homedir(), '.cursor/extensions');
  if (!fs.existsSync(root)) return false;
  const pattern = new RegExp(needle, 'i');
  try {
    return fs.readdirSync(root).some((entry) => pattern.test(entry));
  } catch (_) {
    return false;
  }
}

function jetbrainsPluginPresent(needle) {
  const roots = [
    path.join(os.homedir(), 'AppData/Roaming/JetBrains'),
    path.join(os.homedir(), 'Library/Application Support/JetBrains'),
    path.join(os.homedir(), '.local/share/JetBrains')
  ];
  const pattern = new RegExp(needle, 'i');
  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    const stack = [root];
    while (stack.length) {
      const current = stack.pop();
      let entries = [];
      try {
        entries = fs.readdirSync(current, { withFileTypes: true });
      } catch (_) {
        continue;
      }
      for (const entry of entries) {
        if (pattern.test(entry.name)) return true;
        if (entry.isDirectory()) stack.push(path.join(current, entry.name));
      }
    }
  }
  return false;
}

function detectOne(rule) {
  if (rule.startsWith('command:')) return hasCommand(rule.slice('command:'.length));
  if (rule.startsWith('dir:')) return fs.existsSync(expandHome(rule.slice('dir:'.length)));
  if (rule.startsWith('file:')) return fs.existsSync(expandHome(rule.slice('file:'.length)));
  if (rule.startsWith('macapp:')) return macAppPresent(rule.slice('macapp:'.length));
  if (rule.startsWith('vscode-ext:')) return vscodeExtPresent(rule.slice('vscode-ext:'.length));
  if (rule.startsWith('cursor-ext:')) return cursorExtPresent(rule.slice('cursor-ext:'.length));
  if (rule.startsWith('jetbrains-plugin:')) return jetbrainsPluginPresent(rule.slice('jetbrains-plugin:'.length));
  return false;
}

function detected(provider) {
  return provider.detect.split('||').some((rule) => detectOne(rule));
}

function runNpx(args, dryRun) {
  const display = `npx ${args.join(' ')}`;
  if (dryRun) {
    process.stdout.write(`  would run: ${display}\n`);
    return { status: 0 };
  }
  return childProcess.spawnSync('npx', args, { stdio: 'inherit', shell: process.platform === 'win32' });
}

function installProvider(provider, opts) {
  const args = ['-y', 'skills', 'add', REPO, '-g', '-a', provider.profile, '-s', SKILL, '--yes'];
  return runNpx(args, opts.dryRun);
}

function uninstallProvider(provider, opts) {
  const args = ['-y', 'skills', 'remove', SKILL, '-g', '-a', provider.profile, '--yes'];
  return runNpx(args, opts.dryRun);
}

function showList() {
  process.stdout.write('AI Native Project Brief provider matrix\n\n');
  process.stdout.write('ID             Agent                 Install mechanism\n');
  process.stdout.write('--             -----                 -----------------\n');
  for (const provider of PROVIDERS) {
    const suffix = provider.soft ? ' (soft)' : '';
    process.stdout.write(`${provider.id.padEnd(14)} ${provider.label.padEnd(21)} npx skills add (${provider.profile})${suffix}\n`);
  }
}

function showHelp() {
  process.stdout.write(`AI Native Project Brief installer

USAGE
  npx -y github:${REPO} -- [flags]
  node bin/install.js [flags]

FLAGS
  --dry-run             Print what would run, do nothing.
  --only <agent>        Install only for the named agent. Repeatable.
  --list                Print provider matrix and exit.
  --uninstall, -u       Remove the skill from detected or selected agents.
  --skip-fallback       Do not use the skills CLI auto-detect fallback.
  --non-interactive     Alias for --yes; kept for installer compatibility.
  --no-color            Disable ANSI color.
  -h, --help            Show this help.

EXAMPLES
  npx -y github:${REPO}
  npx -y github:${REPO} -- --only codex
  npx -y github:${REPO} -- --dry-run
  npx -y github:${REPO} -- --uninstall
`);
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const chalk = color(!opts.noColor && process.stdout.isTTY && !process.env.NO_COLOR);

  if (opts.help) {
    showHelp();
    return 0;
  }
  if (opts.list) {
    showList();
    return 0;
  }

  process.stdout.write(`${chalk.title('AI Native Project Brief installer')}\n`);
  process.stdout.write(`${chalk.dim(`  ${REPO}`)}\n`);
  if (opts.dryRun) process.stdout.write(`${chalk.dim('  dry run: no files will be written')}\n`);
  process.stdout.write('\n');

  const results = { installed: [], removed: [], skipped: [], failed: [], detected: 0 };
  const explicit = new Set(opts.only);

  for (const provider of PROVIDERS) {
    if (explicit.size && !explicit.has(provider.id)) continue;
    if (provider.soft && !explicit.has(provider.id)) continue;
    if (!explicit.has(provider.id) && !detected(provider)) continue;

    results.detected += 1;
    process.stdout.write(`-> ${provider.label}${opts.uninstall ? ' remove' : ' install'}\n`);
    const result = opts.uninstall ? uninstallProvider(provider, opts) : installProvider(provider, opts);
    if ((result.status || 0) === 0) {
      (opts.uninstall ? results.removed : results.installed).push(provider.id);
    } else {
      results.failed.push([provider.id, `skills CLI exited ${result.status}`]);
    }
    process.stdout.write('\n');
  }

  if (!opts.skipFallback && !explicit.size && results.detected === 0 && !opts.uninstall) {
    process.stdout.write('-> no known agents detected; using skills CLI auto-detect fallback\n');
    const result = runNpx(['-y', 'skills', 'add', REPO, '-g', '-s', SKILL, '--yes', '--all'], opts.dryRun);
    if ((result.status || 0) === 0) results.installed.push('skills-auto');
    else results.failed.push(['skills-auto', `skills CLI exited ${result.status}`]);
    process.stdout.write('\n');
  }

  process.stdout.write(`${chalk.title('Summary')}\n`);
  for (const id of results.installed) process.stdout.write(`${chalk.ok('  installed')} ${id}\n`);
  for (const id of results.removed) process.stdout.write(`${chalk.ok('  removed')} ${id}\n`);
  for (const [id, reason] of results.failed) process.stdout.write(`${chalk.warn('  failed')} ${id}: ${reason}\n`);
  if (!results.installed.length && !results.removed.length && !results.failed.length) {
    process.stdout.write('  nothing matched. Use --list or --only <agent>.\n');
  }
  process.stdout.write('\n');
  process.stdout.write('Use: ask your agent to create or update PROJECT_BRIEF.md for the project manager.\n');
  process.stdout.write(`Uninstall: npx -y github:${REPO} -- --uninstall\n`);

  return results.failed.length && !results.installed.length && !results.removed.length ? 1 : 0;
}

process.exit(main());
