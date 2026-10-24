'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const { spawnSync } = require('node:child_process');
const { validate, readShowcase, script } = require('../scripts/build-showcase.cjs');
const root = path.resolve(__dirname, '..');
const fixture = path.join(root, 'assets/showcase.sample.json');
const entries = JSON.parse(fs.readFileSync(fixture, 'utf8'));

assert.equal(entries.length, 2, 'The illustrative fixture has exactly two tasks');
assert.deepEqual(validate(entries), entries);
assert.deepEqual(validate([]), []);
assert.deepEqual(validate([{ task: '', expr: '', expect: '', answers: [] }]), [{ task: '', expr: '', expect: '', answers: [] }]);
for (const verdict of ['pass', 'parse_error', 'unbound', 'type_error', 'runtime_error', 'step_limit', 'wrong_answer']) {
  assert.equal(validate([{ task: 'Task', expr: '1', expect: '1', answers: [{ model: 'model', program: '', verdict }] }])[0].answers[0].verdict, verdict);
}
for (const value of [null, {}, 3, 'tasks', [null], [{}], [{ ...entries[0], expect: 2 }], [{ ...entries[0], answers: null }], [{ ...entries[0], answers: [null] }], [{ ...entries[0], answers: [{ model: 'base', program: 1, verdict: 'pass' }] }], [{ ...entries[0], answers: [{ model: 'base', program: '', verdict: 'unknown' }] }]]) {
  assert.throws(() => validate(value));
}
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'sutra-showcase-'));
try {
  const input = path.join(temporary, 'showcase.json');
  fs.writeFileSync(input, JSON.stringify(entries));
  assert.equal(readShowcase(input, fixture).isSample, true);
  const real = [{ ...entries[0], task: 'A real task', answers: [{ model: 'my model', program: '', verdict: 'parse_error' }] }];
  fs.writeFileSync(input, JSON.stringify(real));
  assert.equal(readShowcase(input, fixture).isSample, false);
  assert.deepEqual(readShowcase(input, fixture).entries, real);
  fs.writeFileSync(input, 'not JSON');
  assert.throws(() => readShowcase(input, fixture), SyntaxError);
} finally { fs.rmSync(temporary, { recursive: true, force: true }); }

const hostile = '</script><img src=x onerror="window.injected=true">\u2028\u2029';
const data = { entries: [{ task: hostile, expr: '1', expect: '1', answers: [{ model: 'base', program: hostile, verdict: 'parse_error' }] }], isSample: false };
const generated = script(data);
assert.ok(!generated.includes('<'));
assert.ok(!generated.includes('\u2028') && !generated.includes('\u2029'));
const sandbox = { window: {} };
vm.runInNewContext(generated, sandbox);
assert.equal(JSON.stringify(sandbox.window.SUTRA_SHOWCASE), JSON.stringify(data));
assert.equal(sandbox.window.injected, undefined);

// Check invented verdicts against the actual Elm verifier, rather than pretending
// that these programs were obtained from any model or training run.
const cases = entries.flatMap((entry, task) => entry.answers.map(answer => ({
  id: `${task}-${answer.model}`, program: answer.program, tests: [{ expr: entry.expr, expect: entry.expect }],
})));
const result = spawnSync(process.execPath, [path.join(root, 'dist/sutra.js'), 'check'], {
  cwd: root, input: cases.map(item => JSON.stringify(item)).join('\n') + '\n', encoding: 'utf8', timeout: 15000,
});
assert.equal(result.status, 0, result.stderr);
const rows = result.stdout.trim().split('\n').map(JSON.parse);
assert.equal(rows.length, cases.length);
const answers = entries.flatMap(entry => entry.answers);
rows.forEach((row, index) => {
  const reported = answers[index].verdict;
  if (reported === 'pass') assert.equal(row.ok, true, JSON.stringify(row));
  else if (reported === 'parse_error') { assert.equal(row.ok, false); assert.equal(typeof row.parse_error, 'string'); assert.ok(row.parse_error.length > 0); }
  else { assert.equal(row.ok, false); assert.equal(row.tests[0].ok, false); assert.equal(row.tests[0].error, null); }
});
console.log('PASS: showcase schema, all seven verdicts, sample labeling, real-data replacement, static script escaping, and six illustrative answers checked with Elm.');
