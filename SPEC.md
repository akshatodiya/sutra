# Sutra: the language and the interpreter CLI

Sutra is a very small, pure language that looks like Haskell. This file says what the language is and
how the interpreter's command line works. The interpreter is in `fp/`. The LLM pipeline in `llm/` uses
its `check` command to test programs, so if anything here changes, both sides must change together.

## 1. Values

- Integers. 53-bit safe integers are enough, big numbers are not needed.
- Booleans: `True`, `False`.
- Lists: `[]`, `[1, 2, 3]`. Lists inside lists are allowed.
- Functions: lambdas, and builtins or definitions that have got only some of their arguments.

## 2. Syntax

A program is a list of top-level definitions, one per line. A definition can continue on the next
lines if those lines are indented. Comments start with `--`.

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
| number or boolean | `42`, `-3`, `True` |
| list | `[1, 2, 3]`, `[]` |
| variable | `xs` |
| function call (just write the arguments after it) | `map double xs` |
| lambda | `\x -> x + 1`, `\acc x -> acc + x` |
| let | `let y = x * 2 in y + 1` |
| if | `if x > 0 then x else 0 - x` |
| cons (add to the front of a list) | `x : xs` |
| brackets | `(f x)` |
| operators | `+ - * / %` (whole numbers; `/` rounds toward zero), `== /= < <= > >=`, `&&`, `\|\|` |

Which operator binds first, from strongest to weakest: function call; `* / %`; `+ -`; `:` (groups
to the right); comparisons; `&&`; `||`. A minus sign in front only works on a number (`-3`).

Top-level definitions can call themselves and each other. `let` cannot refer to itself.

## 3. Builtins

`map f xs`, `filter p xs`, `foldl f z xs`, `foldr f z xs`, `length xs`, `head xs`, `tail xs`,
`null xs`, `range a b` (from `a` to `b`, both included, empty if `a > b`), `reverse xs`, `sum xs`,
`max a b`, `min a b`, `not b`.

`head []`, `tail []` and dividing by zero (with `/` or `%`) are runtime errors.

## 4. How a program runs

- No side effects, same result every time, arguments are worked out before a function is called
  (call-by-value). At each step the leftmost innermost part that can be simplified is simplified.
- One step does one thing: call a lambda, do one operator, open up one builtin or definition, pick
  one side of an `if`, or put in one `let` value.
- `map`, `filter`, `foldl` and `foldr` handle **one list element per step**, so the visualizer can
  light up the list cell being worked on. For example `map f [a, b, c]` becomes `f a : map f [b, c]`,
  then `f a` is worked out, and so on. The exact way of opening it up is up to the interpreter, but it
  has to go element by element, not in one hidden jump.
- Running stops at a value, at a runtime error, or when `maxSteps` is reached (error `step_limit`).
  The default `maxSteps` is 10,000.

## 5. Command line (what `llm/` uses)

The build gives `fp/dist/sutra.js`, which runs with Node 20 or newer. It makes no network calls and
keeps nothing from one item to the next.

### 5.1 Batch check (the verifier)

```bash
node fp/dist/sutra.js check < items.jsonl > results.jsonl
```

Each input line:

```json
{"id": "t17", "program": "solve xs = ...", "tests": [{"expr": "solve [1,2,3]", "expect": "4"}], "maxSteps": 10000}
```

`expect` is a Sutra value written in the standard form from 5.3. Each output line, in the same order:

```json
{"id": "t17", "ok": true, "parse_error": null, "tests": [{"expr": "solve [1,2,3]", "ok": true, "value": "4", "error": null, "steps": 23}]}
```

- `parse_error` is a string if the program does not parse. Then `ok` is false and `tests` is `[]`.
- The `error` of a test is one of: `null`, `"type_error: ..."`, `"runtime_error: ..."`, `"step_limit"`,
  `"unbound: <name>"`, or `"parse_error: ..."` (when the test's `expr` itself is broken).
- The top-level `ok` is true only when the program parses and every test has `ok: true`.
- A broken input line gives `{"id": <id or null>, "ok": false, "parse_error": "bad_input: ..."}`.
- The process must never crash on any input line, and 1,000 items must finish in well under a minute.

### 5.2 Run and trace one program

```bash
node fp/dist/sutra.js run program.sutra --expr "solve [1,2,3]"         # prints the value
node fp/dist/sutra.js trace program.sutra --expr "solve [1,2,3]" --json # every step, for debugging
```

### 5.3 Standard way to print values

Integers in decimal (`-3`), `True` / `False`, lists like `[1, 2, 3]` with `", "` between items and
no extra spaces at the end, lists inside lists the same way, and the empty list as `[]`. Functions
print as `<function>`.

## 6. Examples the interpreter must pass

| Program | Expression | Value |
|---|---|---|
| `double x = x * 2` | `map double [1, 2, 3]` | `[2, 4, 6]` |
| `fact n = if n <= 1 then 1 else n * fact (n - 1)` | `fact 5` | `120` |
| (none) | `foldr (\x acc -> x : acc) [] [1, 2]` | `[1, 2]` |
| (none) | `let y = 3 in y * y` | `9` |
| (none) | `filter (\x -> x > 1) [1, 2, 3]` | `[2, 3]` |
| (none) | `head []` | error `runtime_error` |
| `loop n = loop n` | `loop 1` | error `step_limit` |
