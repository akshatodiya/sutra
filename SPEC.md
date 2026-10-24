# Sutra — language and interpreter contract

Sutra is a tiny, pure, Haskell-like language. This file is the **shared contract** between the
interpreter (`fp/`) and the LLM pipeline (`llm/`), which verifies programs with the interpreter's CLI.
Any change must update both sides together.

## 1. Values

- Integers (arbitrary precision is not required; 53-bit safe integers are enough).
- Booleans: `True`, `False`.
- Lists of values: `[]`, `[1, 2, 3]`, nested lists allowed.
- Functions (lambdas and partially applied builtins / top-level definitions).

## 2. Syntax

A program is a sequence of top-level definitions, one per line (a definition may continue on
indented following lines). Comments start with `--`.

```haskell
-- top-level definitions; parameters are plain names
double x = x * 2
sumList xs = foldl (\acc x -> acc + x) 0 xs
evens xs = filter (\x -> x % 2 == 0) xs
solve xs = sumList (map double (evens xs))
```

Expressions:

| Form | Example |
|---|---|
| integer / boolean literal | `42`, `-3`, `True` |
| list literal | `[1, 2, 3]`, `[]` |
| variable | `xs` |
| application (left-assoc, juxtaposition) | `map double xs` |
| lambda | `\x -> x + 1`, `\acc x -> acc + x` |
| let | `let y = x * 2 in y + 1` |
| if | `if x > 0 then x else 0 - x` |
| cons | `x : xs` |
| parentheses | `(f x)` |
| binary operators | `+ - * / %` (integer; `/` truncates toward zero), `== /= < <= > >=`, `&&`, `\|\|` |

Operator precedence, high to low: application; `* / %`; `+ -`; `:` (right-assoc);
comparisons (non-assoc); `&&`; `||`. Unary minus only on literals (`-3`).

Top-level definitions may be recursive and mutually recursive. `let` is non-recursive.

## 3. Builtins

`map f xs`, `filter p xs`, `foldl f z xs`, `foldr f z xs`, `length xs`, `head xs`, `tail xs`,
`null xs`, `range a b` (inclusive `a..b`, empty if `a > b`), `reverse xs`, `sum xs`,
`max a b`, `min a b`, `not b`.

`head []`, `tail []`, division or modulo by zero are runtime errors.

## 4. Semantics

- Pure, deterministic, **call-by-value**, leftmost-innermost small-step reduction.
- One step = one reduction (beta, operator, builtin unfolding, `if`, `let`, definition unfolding).
- `map`, `filter`, `foldl`, `foldr` reduce **one element per step** so the visualizer can light
  up the list cell being processed (for example `map f [a, b, c]` steps to `f a : map f [b, c]`,
  then `f a` reduces, and so on). The exact unfolding is the interpreter's choice, but it must
  be element-by-element, not a single opaque step.
- Evaluation stops at a value, at a runtime error, or when `maxSteps` is reached
  (`step_limit` error). The default `maxSteps` is 10,000.

## 5. CLI contract (what `llm/` depends on)

Built output: `fp/dist/sutra.js`, run with Node 20+. No network, no global state between items.

### 5.1 Batch check (the verifier)

```bash
node fp/dist/sutra.js check < items.jsonl > results.jsonl
```

Each input line:

```json
{"id": "t17", "program": "solve xs = ...", "tests": [{"expr": "solve [1,2,3]", "expect": "4"}], "maxSteps": 10000}
```

`expect` is a Sutra value written in canonical form (see 5.3). Each output line, same order:

```json
{"id": "t17", "ok": true, "parse_error": null, "tests": [{"expr": "solve [1,2,3]", "ok": true, "value": "4", "error": null, "steps": 23}]}
```

- `parse_error`: a string if the program does not parse; then `ok` is false and `tests` is `[]`.
- Per test `error`: one of `null`, `"type_error: ..."`, `"runtime_error: ..."`, `"step_limit"`,
  `"unbound: <name>"`, `"parse_error: ..."` (for a malformed `expr`).
- Top-level `ok` is true only if the program parses and every test has `ok: true`.
- A malformed input line produces `{"id": <id or null>, "ok": false, "parse_error": "bad_input: ..."}`.
- The process must never crash on any input line, and must finish 1,000 items in well under a minute.

### 5.2 Single run and trace

```bash
node fp/dist/sutra.js run program.sutra --expr "solve [1,2,3]"         # prints the value
node fp/dist/sutra.js trace program.sutra --expr "solve [1,2,3]" --json # every step, for debugging
```

### 5.3 Canonical value form

Integers in decimal (`-3`), `True` / `False`, lists as `[1, 2, 3]` with `", "` separators and no
trailing spaces, nested lists the same way, empty list `[]`. Functions print as `<function>`.

## 6. Example tests the interpreter must pass

| Program | Expression | Value |
|---|---|---|
| `double x = x * 2` | `map double [1, 2, 3]` | `[2, 4, 6]` |
| `fact n = if n <= 1 then 1 else n * fact (n - 1)` | `fact 5` | `120` |
| — | `foldr (\x acc -> x : acc) [] [1, 2]` | `[1, 2]` |
| — | `let y = 3 in y * y` | `9` |
| — | `filter (\x -> x > 1) [1, 2, 3]` | `[2, 3]` |
| — | `head []` | error `runtime_error` |
| `loop n = loop n` | `loop 1` | error `step_limit` |
