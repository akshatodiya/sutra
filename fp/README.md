# Sutra — Elm interpreter and visualizer

An interpreter and step-by-step visualizer for Sutra, plus the Node CLI that the LLM pipeline uses as
its verifier.

The language core, public verifier and browser visualizer are written in **Elm**.
The Node CLI uses an Elm `Platform.worker`; JavaScript handles its I/O and isolation. The
browser uses the same parser/evaluator/printer through an Elm `Browser.element`.

## Build and test

Node 20+ is required. From this directory:

```sh
npm ci
npm run build
npm test
```

Elm is a pinned local development dependency, never a global installation. Its package cache is
`.elm-cache/` under this directory. Compiling needs the Elm packages once; the compiled app
and worker make no network calls. The CLI uses `elm/core` and `elm/json`; the visualizer adds
`elm/browser`, `elm/html`, `elm/time` and their standard transitive dependencies. Playwright is
a local development/test dependency only, never a runtime requirement.

## Visualizer

After `npm run build`, open **[index.html](index.html)** directly in a browser. On macOS, from
the project root:

```sh
open fp/index.html
```

The page loads only local `assets/style.css`, `dist/visualizer.js` and `assets/showcase.js`; it needs no server, account,
remote font, network request or Node process. The compiled files can be served statically too.

- Edit the program and expression or choose one of six examples: map, filter, foldl sum, foldr
  list construction, factorial, or a local let binding.
- **Step** (→) performs one reduction. **Back** (←) restores the earlier expression, highlighted term,
  list cell and accumulator together. Forward steps replay saved history deterministically.
  Arrow shortcuts apply outside text/editing controls; modified keys retain their native behavior.
  Manual stepping or rewinding pauses playback.
- **Run / Pause** animates reductions at the selected speed. Back, Step, Reset or editing pauses
  playback. Run stops on a value, error or step limit.
- **Reset** reparses the current editors and clears history. Editing invalidates the old trace;
  Step or Run starts from the edited source.
- The current expression highlights the replacement at the core reducer's actual focus path.
  The previous expression and reduction rule remain visible for comparison.
- List boxes follow actual map/filter/fold activity. A moving window keeps the current cell
  visible for longer lists. Foldl shows its running accumulator; foldr unfolds and then shows
  accumulator updates while combining from right to left.
- Parse, type, runtime, unbound-name and `step_limit` errors have visible messages. The interactive
  history budget is 0–10,000 reductions; a value can succeed at budget 0. This small-program
  interactive view runs the core in the page; the batch CLI has its separate worker resource guards.

Browser checks (optional development tooling; first command downloads the local test browser):

```sh
PLAYWRIGHT_BROWSERS_PATH=.playwright-browsers npx playwright install chromium --only-shell
npm run test:ui
```

The test opens the page with `file://`, checks controls/history and all six examples against the
public CLI, verifies both fold accumulators, error states and a large-list mobile viewport, and
asserts there were no HTTP(S) requests. It writes ignored QA images under `test/artifacts/`.
`npm test` remains the language/CLI regression gate; browser checks are explicit.

## Model answers

Choose **Model answers** next to Playground to compare answers by task. Each model card shows
its exact source and **reported verdict**. **Step through this answer** loads the program and
that task's expression into the existing Elm reducer, resets the trace and step budget, and
returns to the Playground. All verdicts can be inspected, including parse errors. Back, Step,
Run and Reset work as usual. Switching views pauses playback; the task selection is retained.
Editing the loaded program or expression clears its model attribution.

`assets/showcase.json` holds the real results: for each of the 39 held-out tasks, the first sampled
answer of the base, raw-trained and curated-trained 1.5B models, with the interpreter's verdict. It is
written by `llm/showcase.py` from the evaluation run. `assets/showcase.sample.json` is a made-up
two-task fixture used only by the tests; whenever it is shown, a visible sample banner says so.

After regenerating the data (`cd llm && python showcase.py runs/train_eval`), run from `fp/`:

```sh
npm run build:showcase
```

Reload `index.html`. No Elm recompile is needed for data-only changes. `npm run build` also
refreshes the showcase. Neither command overwrites the input JSON. The builder validates the
schema and all seven verdict names, and generates `assets/showcase.js`; the page reads this
local script without fetching JSON, so opening from disk works. The sample banner disappears
when the supplied entries differ from the fixture. Models and task counts are data driven.

The reported verdict is displayed unchanged. Playback evaluates **one supplied expression**;
its match/mismatch message compares the canonical final value with `expect`. This does not
re-grade a model's full test suite. Source is rendered as text and passed unchanged to the
Sutra parser, including malformed or empty programs. Empty datasets and invalid runtime data
have clear states, and the Playground remains usable.

After building, run the focused checks with the locally installed test browser:

```sh
npm run test:showcase
```

These check the JSON-to-script path, real-data replacement, sample verdicts against Elm,
exact source loading, successful/wrong/parse-error playback, task/history preservation,
all seven badges, empty/invalid data, mobile layout and zero remote requests. Browser
fixtures are injected into test pages; the tests do not replace the live showcase JSON.

## Screenshots

The screenshots below were captured from the built page in a real browser, opening `index.html`
with `file://`. They show the actual interpreter state.

![Desktop map trace with a highlighted rewrite and the active input cell](docs/screenshots/desktop.png)

[Fold accumulator preview](docs/screenshots/foldl.png) · [Mobile preview](docs/screenshots/mobile.png)

![Model answers view with the real base, raw and curated answers for one held-out task](docs/screenshots/showcase.png)

[Model answers on mobile](docs/screenshots/showcase-mobile.png)

## Runnable examples

The six browser examples also ship as plain `.sutra` files. From the project root:

```sh
node fp/dist/sutra.js run fp/examples/factorial.sutra --expr "fact 5"
# 120
```

| File in `fp/examples/` | Expression | Value |
|---|---|---|
| `map.sutra` | `map double [1, 2, 3, 4]` | `[2, 4, 6, 8]` |
| `filter.sutra` | `filter isEven [1, 2, 3, 4, 5, 6]` | `[2, 4, 6]` |
| `foldl.sutra` | `foldl add 0 [1, 2, 3, 4]` | `10` |
| `foldr.sutra` | `foldr prepend [] [1, 2, 3, 4]` | `[1, 2, 3, 4]` |
| `factorial.sutra` | `fact 5` | `120` |
| `let.sutra` | `let doubled = 3 * 2 in doubled + 1` | `7` |

## Verifier CLI

The build produces **`fp/dist/sutra.js`**, a standalone Node 20+ artifact. Once built, it can be
copied and run without `node_modules`, an Elm installation, the Elm cache, a server or network access.
From the project root:

```sh
node fp/dist/sutra.js check < fp/test/check_sample.jsonl > results.jsonl
node fp/dist/sutra.js run fp/test/programs/examples.sutra --expr "solve [1,2,3]"
node fp/dist/sutra.js trace fp/test/programs/examples.sutra --expr "map double [1,2,3]" --json
```

`test/check_sample.expected.jsonl` is the exact expected output for the sample stream. Successful
`run` prints just the canonical value. `trace --json` prints one object with `initial`, `trace`,
`value`, `error` and `steps`. Each trace event has a numbered step, `before`, `after`, a rule,
focus path into the previous AST, and optional list/fold activity. Plain `trace` prints readable
numbered rewrites. Both commands also accept `--max-steps N` (default 10,000).

`check` emits exactly one JSON object per input line, in order. Malformed JSON/schema lines are
`bad_input` results; program parse errors have an empty test list. Each test evaluates afresh
against the item's program. A wrong expected value has `ok: false` and `error: null`; it is not
an interpreter error. Expected values are compared to the canonical output string exactly.
Errors in one test do not skip later tests. Program definitions never carry between items.

Batch checking exits 0 after processing the stream; inspect each result's `ok`. Fatal I/O errors
exit nonzero. `run`/`trace` exit 1 on language/resource errors; invalid command usage exits 2.
Blank lines produce `bad_input` rather than being silently skipped; empty input produces no rows.
CRLF and an unterminated last line work. JSON IDs are echoed, including null and structured IDs.

### Verifier resource guards

The input reader discards an oversized line after 1 MiB, then resumes at the next newline. Elm
runs in a persistent isolated worker with a 128 MiB old-generation heap budget and 4 MiB stack;
each parsing/evaluation request has a 5-second wall guard. Language step limits remain per test.
These guards keep pathological source, excessive budgets or host-stack failures from terminating
the JSONL process. A failed worker is discarded; the failed request is not retried. The next
request receives a fresh worker. The Elm application's model is `()` and retains no definitions.

A parser resource failure is a program parse failure; an evaluation resource failure is a
per-test `runtime_error`. Normal reduction counts come from Elm. For externally interrupted
requests no verified count is available: `steps: 0` is a sentinel, and the error identifies the
resource failure. It must not be read as a successful zero-step evaluation. A trace interrupted
outside Elm cannot return its lost intermediate history. No API/runtime network calls or telemetry
are present.

## Files

| File | Purpose |
|---|---|
| `src/Sutra/Ast.elm` | AST, values and capture-avoiding substitution |
| `src/Sutra/Parser.elm` | Tokenizer, indentation-aware top-level definitions and precedence parser |
| `src/Sutra/Eval.elm` | Deterministic, leftmost-innermost call-by-value small-step reducer |
| `src/Sutra/Print.elm` | Canonical values and readable intermediate expressions |
| `src/Cli.elm` | Production Elm worker; parsing, evaluation and numbered reduction traces |
| `src/Main.elm` | Elm browser application, editors, playback, errors and responsive view |
| `src/Sutra/Session.elm` | Immutable trace/history and real list/fold activity tracking |
| `src/Sutra/ExpressionView.elm` | AST rendering with reduction-focus highlighting |
| `src/Sutra/Examples.elm` | The six fresh browser examples |
| `index.html`, `assets/style.css` | Local page entry point and stylesheet |
| `examples/*.sutra` | Six runnable demonstration programs |
| `docs/screenshots/` | Captured desktop, accumulator, mobile and model-answer previews |
| `cli/runtime.cjs` | Streaming JSONL/command I/O and isolated-worker supervision |
| `scripts/build.cjs` | Optimized Elm compilation and standalone artifact assembly |
| `test/Worker.elm` | Test-only Elm ports wrapper around the core |
| `test/core.test.cjs` | Language examples, semantic/error cases, reduction traces, arithmetic oracle and throughput checks |
| `test/cli.test.cjs` | Public contract, malformed/resource-failure recovery, run/trace and standalone/throughput checks |
| `test/visualizer.test.cjs` | Real-browser controls/history, semantic parity, fold/cell, error, offline and mobile checks |

The reducer's `step` returns the next AST, a rule name, a focus path into the previous AST, and
optional map/filter/fold activity (remaining cells and accumulator). The visualizer can use the
same core without reimplementing evaluation. `evaluate` defaults to the caller's 10,000-step budget
in the test worker. It retains only the current state; traces explicitly request each reduction.

## Design notes

**Small steps make the explanation real.** `Eval.step` returns one next AST, its rule and the
structural focus path. The CLI trace and browser use this reducer; the visualizer does not
simulate an animation over an unrelated answer. Arithmetic, beta substitution, local binding,
branch selection and definition unfolding are distinct reductions.

**List operations expose one cell at a time.** Their conceptual rewrites are:

```text
map f (x : xs)       → f x : map f xs
filter p (x : xs)    → if p x then x : filter p xs else filter p xs
foldl f z (x : xs)   → foldl f (f z x) xs
foldr f z (x : xs)   → f x (foldr f z xs)
```

Call-by-value evaluates each required argument before application. Foldl carries its updated
accumulator onward. Foldr first unfolds the list, then combines from the right. The visualizer
tracks the pending fold contexts so its cells and accumulator follow that actual order.

**Rewind restores a state.** An immutable history frame contains the expression, step count,
focus, list/fold state and error. Back moves the cursor to the earlier frame; it does not try
to invert substitution. Forward navigation can replay a saved frame. Editing or Reset creates
a fresh session, and timers advance only one reduction per tick.

**Names remain lexical.** Top-level definitions live in a dictionary and unfold on demand,
allowing recursion and mutual recursion. Applying a lambda substitutes its evaluated argument;
binders are renamed when needed to avoid capturing free variables. `let` is non-recursive.

**The Node boundary is transport.** Elm owns parsing and language evaluation. Node provides
JSONL framing, command/file I/O and resource isolation. The CLI worker keeps no program environment
between requests. Browser history is deliberate UI state; it is separate from batch verification.

## Decisions

The language is defined in [`SPEC.md`](../SPEC.md). These resolve details it leaves open:

- Top-level definitions begin at column one. Indented nonblank lines continue the previous
  definition; comments and blank lines are ignored. Duplicate definitions/parameters are parse
  errors. Names can contain letters, digits, underscores and apostrophes; a name starts with a
  letter or underscore. Keywords and boolean literals cannot be bound.
- Application is left-associative. `f -3` is subtraction, as is `x-3`; pass a negative literal as
  `f (-3)`. Unary minus is supported only on literals, not arbitrary expressions.
- Application evaluates the function and argument before beta reduction; `let` evaluates its
  non-recursive bound expression first. Definitions are unfolded on use, including mutual
  recursion. Lambda bodies are not evaluated until application. Substitution renames binders
  when necessary to prevent variable capture.
- `if` evaluates only its selected branch. `&&` and `||` short-circuit once their left operand
  is a boolean. Arithmetic is strict. `%` is the signed remainder paired with division that
  truncates toward zero: `-7 / 3 = -2` and `-7 % 3 = -1`.
- Integers use exact safe-range JavaScript numbers inside Elm (`Float` stores the numeric
  payload). All admitted values are integral and bounded by ±9,007,199,254,740,991. This avoids
  Elm's 32-bit integer-division path; tests use Node BigInt as an independent arithmetic oracle.
  Out-of-range literals are parse errors; out-of-range results are runtime errors.
- Equality is structural for matching integers, booleans and lists. Comparing functions or
  incompatible value types is a type error. Ordering operators require integers. Builtins are
  curried; top-level or local user bindings may shadow builtin names.
- `map`, `filter`, `foldl` and `foldr` unfold one input cell at a time. Beta/operator reductions
  are separate steps. Other finite builtins can take one builtin reduction. Ranges are inclusive;
  an empty range is `[]`. A range exceeding 10,000 cells reports a runtime resource error.
- Each parsed expression/definition is capped at 100,000 characters, and a reduction's expression traversal at 512
  levels. These are bounded-verifier resource errors, separate from the reduction step limit.

## Verification

`npm test` runs 99 language cases (including every `SPEC.md` example), small-step focus/activity checks, 200 signed-division/remainder
comparisons against an independent BigInt oracle, and cross-item definition isolation. The CLI
integration suite covers the exact sample fixture, malformed JSON/schema and line handling,
host-stack/wall-limit recovery, run/trace behavior, negative-argument trace round trips and
standalone copying; a 1,000-item stream (2,000 tests) completes in about 2 seconds.

`npm run test:ui` checks playback/rewind/reset, the six examples against the CLI (values and step
counts), cell progression and fold accumulators, every error category, keyboard navigation,
offline loading and the 390px mobile layout. `npm run test:showcase` checks the data build, all
seven verdict badges, loading an answer into the reducer, empty/invalid data and mobile rendering.

## Prior work

None reused. The source and tests in this directory were written fresh for Syntax Error 2026.
Elm and its standard packages are dependencies. Official API documentation was consulted; no
pre-existing interpreter or external code snippets were copied.
