'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const { readShowcase, writeShowcase } = require('./build-showcase.cjs');
const root = path.resolve(__dirname, '..');
const showcase = readShowcase(path.join(root, 'assets/showcase.json'), path.join(root, 'assets/showcase.sample.json'));
const build = path.join(root, '.build');
const dist = path.join(root, 'dist');
fs.mkdirSync(build, { recursive: true });
fs.mkdirSync(dist, { recursive: true });
const elm = path.join(root, 'node_modules', '.bin', process.platform === 'win32' ? 'elm.cmd' : 'elm');
const result = spawnSync(elm, ['make', 'src/Cli.elm', '--optimize', '--output=.build/cli-core.js'], {
  cwd: root,
  env: { ...process.env, ELM_HOME: path.join(root, '.elm-cache') },
  stdio: 'inherit',
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

const core = fs.readFileSync(path.join(build, 'cli-core.js'), 'utf8');
const runtime = fs.readFileSync(path.join(root, 'cli', 'runtime.cjs'), 'utf8');
const output = '#!/usr/bin/env node\n' + core + '\n' + runtime + '\n';
const target = path.join(dist, 'sutra.js');
fs.writeFileSync(target, output, { mode: 0o755 });
console.log('Built dist/sutra.js: standalone Node 20+ CLI with the compiled Elm core.');

const browser = spawnSync(elm, ['make', 'src/Main.elm', '--optimize', '--output=dist/visualizer.js'], {
  cwd: root, env: { ...process.env, ELM_HOME: path.join(root, '.elm-cache') }, stdio: 'inherit',
});
if (browser.error) throw browser.error;
if (browser.status !== 0) process.exit(browser.status ?? 1);
console.log('Built index.html + dist/visualizer.js: offline Elm visualizer.');

writeShowcase(path.join(root, 'assets/showcase.js'), showcase);
