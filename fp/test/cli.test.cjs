'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { performance } = require('node:perf_hooks');
const root = path.resolve(__dirname, '..');
const cli = path.join(root, 'dist', 'sutra.js');
const programFile = path.join(__dirname, 'programs', 'examples.sutra');

function execute(args, input = '', options = {}) {
  const result = spawnSync(process.execPath, [options.cli ?? cli, ...args], {
    input, encoding: 'utf8', timeout: options.timeout ?? 20000,
    maxBuffer: 32 * 1024 * 1024, cwd: options.cwd ?? root,
  });
  if (result.error) throw result.error;
  assert.equal(result.signal, null, `CLI was killed: ${result.stderr}`);
  return result;
}

function batch(items, options) {
  const input = items.map(item => JSON.stringify(item)).join('\n') + '\n';
  const result = execute(['check'], input, options);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stderr, '', 'The public verifier must not emit a dev banner or diagnostics');
  const rows = result.stdout.trimEnd().split('\n').map(line => JSON.parse(line));
  assert.equal(rows.length, items.length);
  return rows;
}

function item(id, expr = '1 + 2', expect = '3', program = '', extra = {}) {
  return { id, program, tests: [{ expr, expect }], ...extra };
}

const sample = execute(['check'], fs.readFileSync(path.join(__dirname, 'check_sample.jsonl'), 'utf8'));
assert.equal(sample.status, 0, sample.stderr);
assert.equal(sample.stderr, '');
assert.equal(sample.stdout, fs.readFileSync(path.join(__dirname, 'check_sample.expected.jsonl'), 'utf8'));

const spec = batch([
  item('map', 'map double [1,2,3]', '[2, 4, 6]', 'double x = x * 2'),
  item('fact', 'fact 5', '120', 'fact n = if n <= 1 then 1 else n * fact (n - 1)'),
  item('foldr', 'foldr (\\x acc -> x : acc) [] [1,2]', '[1, 2]'),
  item('let', 'let y = 3 in y * y', '9'),
  item('filter', 'filter (\\x -> x > 1) [1,2,3]', '[2, 3]'),
  item('head', 'head []', '0'),
  item('loop', 'loop 1', '0', 'loop n = loop n'),
]);
assert.ok(spec.slice(0, 5).every(row => row.ok));
assert.match(spec[5].tests[0].error, /^runtime_error:/);
assert.equal(spec[6].tests[0].error, 'step_limit');
assert.equal(spec[6].tests[0].steps, 10000);

const examples = [
  ['map', 'map double [1, 2, 3, 4]', '[2, 4, 6, 8]'],
  ['filter', 'filter isEven [1, 2, 3, 4, 5, 6]', '[2, 4, 6]'],
  ['foldl', 'foldl add 0 [1, 2, 3, 4]', '10'],
  ['foldr', 'foldr prepend [] [1, 2, 3, 4]', '[1, 2, 3, 4]'],
  ['factorial', 'fact 5', '120'],
  ['let', 'let doubled = 3 * 2 in doubled + 1', '7'],
];
for (const [name, expression, expected] of examples) {
  const result = execute(['run', path.join(root, 'examples', name + '.sutra'), '--expr', expression]);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, expected + '\n');
}

const invalid = [
  null, [], 3, true, {}, { id: 'no-program', tests: [] },
  { id: 'program-number', program: 5, tests: [] },
  { id: 'tests-null', program: '', tests: null },
  { id: 'tests-object', program: '', tests: {} },
  { id: 'bad-test', program: '', tests: [null] },
  { id: 'bad-expect', program: '', tests: [{ expr: '1', expect: 1 }] },
  { id: 'bad-expr', program: '', tests: [{ expr: 1, expect: '1' }] },
  ...[-1, 0.5, '10', true, null].map(maxSteps => item(`steps-${maxSteps}`, '1', '1', '', { maxSteps })),
];
const invalidRows = batch(invalid);
for (let index = 0; index < invalidRows.length; index++) {
  const row = invalidRows[index];
  assert.equal(row.ok, false);
  assert.match(row.parse_error, /^bad_input:/);
  assert.equal(row.id, invalid[index]?.id ?? null);
  assert.equal('tests' in row, false);
}

const isolation = batch([
  item('defined', 'f 3', '3', 'f x = x'),
  item('not-defined', 'f 3', '3'),
  { id: 'all-tests', program: '', tests: [
    { expr: '[', expect: '0' }, { expr: '1', expect: '2' }, { expr: '4', expect: '4' },
  ] },
  { id: null, program: '', tests: [] },
  { id: 0, program: '', tests: [{ expr: '1', expect: '1' }], maxSteps: 0 },
  item(false, '1 + 2', '3', '', { extraMetadata: { ignored: true } }),
  item({ source: 'task', number: 3 }, 'True', 'True'),
  item(['tag', 2], '[1,2]', '[1, 2]'),
]);
assert.equal(isolation[0].ok, true);
assert.equal(isolation[1].tests[0].error, 'unbound: f');
assert.equal(isolation[2].ok, false);
assert.match(isolation[2].tests[0].error, /^parse_error:/);
assert.equal(isolation[2].tests[1].error, null);
assert.equal(isolation[2].tests[1].ok, false);
assert.equal(isolation[2].tests[2].ok, true);
assert.equal(isolation[3].ok, true);
assert.equal(isolation[4].ok, true);
assert.equal(isolation[5].id, false);
assert.deepEqual(isolation[6].id, { source: 'task', number: 3 });
assert.deepEqual(isolation[7].id, ['tag', 2]);

const lineCases = execute(['check'], '\n' + JSON.stringify(item('crlf')) + '\r\n' + JSON.stringify(item('eof')));
assert.equal(lineCases.status, 0, lineCases.stderr);
const lineRows = lineCases.stdout.trim().split('\n').map(JSON.parse);
assert.equal(lineRows.length, 3);
assert.match(lineRows[0].parse_error, /^bad_input:/);
assert.equal(lineRows[1].id, 'crlf');
assert.equal(lineRows[2].id, 'eof');
assert.equal(execute(['check']).stdout, '');

const oversized = execute(['check'], 'x'.repeat(1024 * 1024 + 1) + '\n' + JSON.stringify(item('after-large')) + '\n');
assert.equal(oversized.status, 0, oversized.stderr);
const oversizedRows = oversized.stdout.trim().split('\n').map(JSON.parse);
assert.match(oversizedRows[0].parse_error, /^bad_input: input line exceeds/);
assert.equal(oversizedRows[1].ok, true);

const unicode = batch([item('unicode', '1', '1', '-- ' + '🌱'.repeat(20000))]);
assert.equal(unicode[0].ok, true);

// Host-stack exhaustion must remain a failed item/test, followed by a healthy worker.
const deep = '('.repeat(12000) + '1' + ')'.repeat(12000);
const recovery = batch([
  { id: 'deep-expression', program: '', tests: [{ expr: deep, expect: '1' }, { expr: '8', expect: '8' }] },
  item('deep-program', 'solve', '1', 'solve = ' + deep),
  item('after-resource-failure'),
]);
assert.equal(recovery[0].tests[0].ok, false);
assert.match(recovery[0].tests[0].error, /^(runtime_error|parse_error):/);
assert.equal(recovery[0].tests[1].ok, true);
assert.equal(typeof recovery[1].parse_error, 'string');
assert.deepEqual(recovery[1].tests, []);
assert.equal(recovery[2].ok, true);

const timed = batch([
  item('wall-limit', 'loop 1', '0', 'loop x = loop x', { maxSteps: Number.MAX_SAFE_INTEGER }),
  item('after-wall-limit'),
]);
assert.match(timed[0].tests[0].error, /^runtime_error:.*5-second/);
assert.equal(timed[1].ok, true);

const run = execute(['run', programFile, '--expr', 'solve [1,2,3]']);
assert.equal(run.status, 0, run.stderr);
assert.equal(run.stdout, '12\n');
assert.equal(run.stderr, '');
const runError = execute(['run', programFile, '--expr', 'head []']);
assert.equal(runError.status, 1);
assert.equal(runError.stdout, '');
assert.match(runError.stderr, /^runtime_error:/);
assert.equal(execute(['run', programFile]).status, 2);
assert.equal(execute(['run', programFile, '--expr', '1', '--max-steps', '-1']).status, 2);
assert.equal(execute(['unknown']).status, 2);
assert.match(execute(['--help']).stdout, /^Usage:/);

const traceResult = execute(['trace', programFile, '--expr', 'map double [1,2,3]', '--json']);
assert.equal(traceResult.status, 0, traceResult.stderr);
assert.equal(traceResult.stderr, '');
const trace = JSON.parse(traceResult.stdout);
assert.equal(trace.value, '[2, 4, 6]');
assert.equal(trace.trace.length, trace.steps);
assert.deepEqual(trace.trace.map(row => row.step), Array.from({ length: trace.steps }, (_, i) => i + 1));
assert.equal(trace.trace.filter(row => row.rule === 'map_cons').length, 3);
for (let index = 1; index < trace.trace.length; index++) {
  assert.equal(trace.trace[index].before, trace.trace[index - 1].after);
}
const negativeTraceResult = execute(['trace', programFile, '--expr', 'double (-3)', '--json']);
assert.equal(negativeTraceResult.status, 0, negativeTraceResult.stderr);
const negativeTrace = JSON.parse(negativeTraceResult.stdout);
assert.equal(negativeTrace.initial, '(double (-3))');
assert.equal(negativeTrace.value, '-6');
assert.ok(batch(negativeTrace.trace.map((row, index) => item(index, row.after, '-6', 'double x = x * 2'))).every(row => row.ok));
const negativeBuiltin = JSON.parse(execute(['trace', programFile, '--expr', 'range (-2) 0', '--json']).stdout);
assert.equal(negativeBuiltin.initial, '((range (-2)) 0)');
assert.equal(negativeBuiltin.value, '[-2, -1, 0]');
const limitedTrace = execute(['trace', programFile, '--expr', 'loop 1', '--json', '--max-steps', '5']);
assert.equal(limitedTrace.status, 1);
assert.equal(JSON.parse(limitedTrace.stdout).error, 'step_limit');
assert.equal(JSON.parse(limitedTrace.stdout).trace.length, 5);
assert.match(execute(['trace', programFile, '--expr', 'fact 3']).stdout, /Value: 6/);

const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'sutra-cli-'));
try {
  const copied = path.join(temporary, 'sutra.js');
  fs.copyFileSync(cli, copied);
  assert.equal(batch([item('standalone')], { cli: copied, cwd: temporary })[0].ok, true);
} finally { fs.rmSync(temporary, { recursive: true, force: true }); }

const inputs = Array.from({ length: 1000 }, (_, id) => ({ id, program: 'double x = x * 2', tests: [
  { expr: 'map double [1,2,3]', expect: '[2, 4, 6]' },
  { expr: 'sum (range 1 10)', expect: '55' },
] }));
const started = performance.now();
const throughput = batch(inputs);
const elapsed = performance.now() - started;
assert.ok(throughput.every((row, id) => row.id === id && row.ok));
assert.ok(elapsed < 60000, `1000 public CLI items took ${elapsed}ms`);
console.log('PASS: exact fixtures, SPEC examples, schema/errors, line handling, resource recovery, run/trace, standalone artifact.');
console.log(`PASS: 1000 public JSONL items / 2000 tests in ${(elapsed / 1000).toFixed(3)}s.`);
