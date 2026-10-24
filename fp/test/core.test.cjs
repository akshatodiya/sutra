/* Fresh test harness for the Elm core. This is not the public JSONL CLI (step 2). */
'use strict';

const assert = require('node:assert/strict');
const { performance } = require('node:perf_hooks');
const { Elm } = require('../dist/test-worker.js');

const app = Elm.Worker.init();
const pending = new Map();
let nextId = 0;
app.ports.responses.subscribe(result => {
  const entry = pending.get(result.id);
  if (!entry) throw new Error(`Unexpected response: ${JSON.stringify(result)}`);
  pending.delete(result.id);
  clearTimeout(entry.timeout);
  entry.resolve(result);
});

function run(program, expr, options = {}) {
  const id = nextId++;
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(`Core did not respond to ${expr}`)), 10000);
    pending.set(id, { resolve, timeout });
    app.ports.requests.send({ id, program, expr, ...options });
  });
}

const cases = [];
function value(name, program, expr, expected, options) {
  cases.push({ name, program, expr, expected, options });
}
function error(name, program, expr, prefix, options) {
  cases.push({ name, program, expr, prefix, options });
}

value('SPEC: map double', 'double x = x * 2', 'map double [1, 2, 3]', '[2, 4, 6]');
value('SPEC: factorial', 'fact n = if n <= 1 then 1 else n * fact (n - 1)', 'fact 5', '120');
value('SPEC: foldr cons', '', 'foldr (\\x acc -> x : acc) [] [1, 2]', '[1, 2]');
value('SPEC: let', '', 'let y = 3 in y * y', '9');
value('SPEC: filter', '', 'filter (\\x -> x > 1) [1, 2, 3]', '[2, 3]');
error('SPEC: empty head', '', 'head []', 'runtime_error:');
error('SPEC: infinite recursion', 'loop n = loop n', 'loop 1', 'step_limit', { maxSteps: 10000 });

value('precedence and left-associative arithmetic', '', '20 - 6 / 2 * 3 + 2', '13');
value('application has highest precedence', 'double x = x * 2', 'double 3 + 4', '10');
value('right-associative cons', '', '1 : 2 : []', '[1, 2]');
value('addition binds tighter than cons', '', '1 + 2 : []', '[3]');
value('comparison before boolean conjunction', '', '1 < 2 && 3 <= 4 || False', 'True');
value('parenthesized comparison', '', '(1 < 2) == True', 'True');
value('negative literal in arithmetic', '', '10 - -3 * 2', '16');
value('negative function argument', 'double x = x * 2', 'double (-3)', '-6');
value('minus following a term is subtraction', '', '10-3', '7');
value('truncating division', '', '(-7) / 3', '-2');
value('negative divisor', '', '7 / (-3)', '-2');
value('negative remainder', '', '(-7) % 3', '-1');
value('negative zero is canonical zero', '', '-0', '0');
value('above signed 32-bit division', '', '8589934592 / 2', '4294967296');
value('safe integer literal', '', '9007199254740991', '9007199254740991');
value('nested canonical lists', '', '[[], [-3, True], [False, [2]]]', '[[], [-3, True], [False, [2]]]');
value('list items evaluate left to right', '', '[1 + 2, (\\x -> x * 2) 4]', '[3, 8]');
value('empty range', '', 'range 3 1', '[]');
value('inclusive range', '', 'range (-2) 2', '[-2, -1, 0, 1, 2]');
value('range near safe integer maximum', '', 'range 9007199254740989 9007199254740991', '[9007199254740989, 9007199254740990, 9007199254740991]');
value('length', '', 'length [[1], [], [2,3]]', '3');
value('tail', '', 'tail [1,2,3]', '[2, 3]');
value('null', '', 'null []', 'True');
value('reverse', '', 'reverse [1, 2, 3]', '[3, 2, 1]');
value('sum', '', 'sum [1, -2, 5]', '4');
value('empty sum', '', 'sum []', '0');
value('min/max/not', '', 'not (min 4 2 == max 1 3)', 'True');
value('partially applied builtin', '', 'let inc = map (\\x -> x + 1) in inc [1,2]', '[2, 3]');
value('partially applied definition', 'add x y = x + y', 'let add3 = add 3 in add3 4', '7');
value('higher-order function', 'twice f x = f (f x)\ninc x = x + 1', 'twice inc 3', '5');
value('lambda canonical value', '', '\\x -> x', '<function>');
value('builtin canonical value', '', 'map', '<function>');
value('lists may contain functions', '', '[map, (\\x -> x)]', '[<function>, <function>]');
value('closures produced by map', '', 'head (map (\\n -> \\x -> x + n) [2,3]) 5', '7');
value('foldl argument order', '', 'foldl (\\acc x -> acc - x) 0 [1,2,3]', '-6');
value('foldr argument order', '', 'foldr (\\x acc -> x - acc) 0 [1,2,3]', '2');
value('foldl empty', '', 'foldl (\\acc x -> acc + x) 7 []', '7');
value('foldr empty', '', 'foldr (\\x acc -> x + acc) 8 []', '8');
value('map empty', '', 'map (\\x -> x) []', '[]');
value('filter empty', '', 'filter (\\x -> True) []', '[]');
value('mutual recursion', 'even n = if n == 0 then True else odd (n - 1)\nodd n = if n == 0 then False else even (n - 1)', 'even 20', 'True');
value('forward reference', 'solve x = inc x\ninc x = x + 1', 'solve 5', '6');
value('nested let shadowing', '', 'let x = 2 in let x = x + 1 in x', '3');
value('let is non-recursive and sees outer binding', 'x = 10', 'let x = x + 1 in x', '11');
value('lexical capture in a closure', '', 'let y = 7 in let f = \\x -> y in let y = 99 in f 0', '7');
value('capture-avoiding beta substitution', 'y = 7\nmake x = \\y -> x', '(make (\\z -> y)) 99 0', '7');
value('global definitions keep lexical scope', 'x = 11\nf y = x + y\nsolve x = f 2', 'solve 100', '13');
value('local binding shadows builtin', '', 'let sum = \\x -> 99 in sum [1,2]', '99');
value('global definition shadows builtin', 'sum xs = 42', 'sum [1,2]', '42');
value('strict application with unused argument', 'ignore x = 1', 'ignore (1 + 2)', '1');
error('unused diverging argument still evaluates', 'ignore x = 1\nloop x = loop x', 'ignore (loop 0)', 'step_limit', { maxSteps: 25 });
value('if selects only one branch', '', 'if True then 5 else head []', '5');
value('short-circuit and', '', 'False && ghost', 'False');
value('short-circuit or', '', 'True || ghost', 'True');
value('structural list equality', '', '[1, [2,3]] == [1, [2,3]]', 'True');
value('list inequality', '', '[1,2] /= [1,3]', 'True');
value('continuation, tabs and comments', '-- comment\nsolve xs =\n\t sum (map\n    (\\x -> x * 2) xs) -- trailing\n', 'solve [1,2]', '6');
value('comments in an expression', '', '1 + -- skip\n 2', '3');
value('value at zero step budget', '', '[1, 2]', '[1, 2]', { maxSteps: 0 });
error('operation at zero budget', '', '1 + 2', 'step_limit', { maxSteps: 0 });

for (const [name, expr, prefix] of [
  ['tail empty', 'tail []', 'runtime_error:'],
  ['division zero', '1 / 0', 'runtime_error:'],
  ['modulo zero', '1 % 0', 'runtime_error:'],
  ['unbound name', 'missing', 'unbound: missing'],
  ['non-recursive let', 'let x = x in x', 'unbound: x'],
  ['apply an integer', '1 2', 'type_error:'],
  ['bad conditional', 'if 1 then 2 else 3', 'type_error:'],
  ['bad boolean operand', 'True && 1', 'type_error:'],
  ['bad arithmetic operand', 'True + 1', 'type_error:'],
  ['cons to non-list', '1 : 2', 'type_error:'],
  ['nonfunction map', 'map 1 []', 'type_error:'],
  ['nonlist map', 'map (\\x -> x) 3', 'type_error:'],
  ['nonboolean filter predicate', 'filter (\\x -> x) [1]', 'type_error:'],
  ['bad fold function', 'foldl 1 0 []', 'type_error:'],
  ['bad sum item', 'sum [1, True]', 'type_error:'],
  ['function equality', '(\\x -> x) == (\\x -> x)', 'type_error:'],
  ['incompatible equality', '1 == True', 'type_error:'],
  ['arithmetic overflow', '9007199254740991 + 1', 'runtime_error:'],
  ['bounded huge range', 'range 0 9007199254740991', 'runtime_error:'],
  ['out of range integer', '9007199254740992', 'parse_error:'],
  ['comparison chain', '1 < 2 < 3', 'parse_error:'],
  ['incomplete list', '[1, 2', 'parse_error:'],
  ['trailing list comma', '[1,]', 'parse_error:'],
  ['bad token', '1 @ 2', 'parse_error:'],
  ['unfinished lambda', '\\x ->', 'parse_error:'],
  ['empty lambda', '\\ -> 1', 'parse_error:'],
  ['unary minus on an expression', '-(1+2)', 'parse_error:'],
  ['missing else', 'if True then 1', 'parse_error:'],
  ['missing in', 'let x = 1', 'parse_error:'],
]) error(name, '', expr, prefix);
error('duplicate top-level definition', 'f x = x\nf y = y', 'f 1', 'parse_error:');
error('duplicate function parameter', 'f x x = x', 'f 1 2', 'parse_error:');
error('unattached continuation', '  solve x = x', 'solve 1', 'parse_error:');

async function main() {
  for (const test of cases) {
    const result = await run(test.program, test.expr, test.options);
    try {
      if (test.prefix) {
        assert.equal(typeof result.error, 'string');
        assert.ok(result.error.startsWith(test.prefix), JSON.stringify(result));
      } else {
        assert.equal(result.error, null, JSON.stringify(result));
        assert.equal(result.value, test.expected);
      }
      assert.ok(Number.isInteger(result.steps) && result.steps >= 0);
      assert.ok(result.steps <= (test.options?.maxSteps ?? 10000));
    } catch (error) {
      error.message = `${test.name}: ${error.message}`;
      throw error;
    }
  }

  const map = await run('double x = x * 2', 'map double [1,2,3]', { trace: true });
  assert.equal(map.trace.length, map.steps);
  assert.deepEqual(map.trace.filter(x => x.rule === 'map_cons').map(x => x.activity.items),
    [['1', '2', '3'], ['2', '3'], ['3']]);
  assert.equal(map.trace.filter(x => x.rule === 'map_empty').length, 1);
  const fold = await run('', 'foldl (\\acc x -> acc + x) 0 [1,2,3]', { trace: true });
  assert.deepEqual(fold.trace.filter(x => x.rule === 'foldl_cons').map(x => x.activity.accumulator), ['0', '1', '3']);
  const focus = await run('', '1 + 2 * 3', { trace: true });
  assert.deepEqual(focus.trace[0].focus, [1]);
  assert.equal(focus.trace[0].expression, '(1 + 6)');

  // An independent BigInt oracle checks signed division/remainder near the 53-bit boundary.
  let state = 20261024n;
  const limit = 9007199254740991n;
  const random = () => (state = (state * 6364136223846793005n + 1442695040888963407n) % (1n << 64n));
  for (let index = 0; index < 100; index++) {
    let a = index < 10 ? limit - BigInt(index) : random() % limit;
    let b = random() % 1000000007n + 1n;
    if (index % 2) a = -a;
    if (index % 3) b = -b;
    for (const [operator, expected] of [['/', a / b], ['%', a % b]]) {
      const result = await run('', `(${a}) ${operator} (${b})`);
      assert.equal(result.error, null, JSON.stringify(result));
      assert.equal(result.value, String(expected), `${a} ${operator} ${b}`);
    }
  }

  // Each request reparses a fresh program: the worker must not retain definitions between items.
  assert.equal((await run('f x = x', 'f 3')).value, '3');
  assert.equal((await run('', 'f 3')).error, 'unbound: f');

  const started = performance.now();
  for (let index = 0; index < 1000; index++) {
    const result = await run('solve xs = sum (map (\\x -> x * 2) xs)', 'solve [1,2,3]');
    assert.equal(result.error, null);
    assert.equal(result.value, '12');
  }
  const elapsed = performance.now() - started;
  assert.ok(elapsed < 60000, `1000 core requests took ${elapsed}ms`);
  console.log(`PASS: ${cases.length} language cases, small-step traces, 200 BigInt checks, item isolation.`);
  console.log(`PASS: 1000 fresh-program core requests in ${(elapsed / 1000).toFixed(3)}s (not yet the JSONL CLI).`);
}

main().catch(error => { console.error(error); process.exitCode = 1; });
