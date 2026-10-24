# Sutra — teaching a small local LLM a language that has no data

Submission for **Syntax Error 2026** (SDSLabs, IIT Roorkee), 23–25 Oct 2026. One project, entered in the
**Local LLM Track** (RadixArk × Lexsi Labs; problem statement
[*Data-scarce domains*](https://drive.google.com/file/d/1YW0tXd978clO88EzKQ67npqEQg3Bsmpk/view?usp=sharing)), the
**Functional Programming Track** (FP Launchpad;
[challenge 1](https://drive.google.com/file/d/1q_rEB_r3QcGYxAeya-4LW4rnNy4yBRgl/view?usp=sharing)) and
**Open Track – Development**.

Sutra is a tiny Haskell-like language made for this hackathon, so no training data for it exists anywhere.
With no data to learn from, one program becomes the source of truth: an interpreter written in Elm that runs
Sutra one reduction at a time. **One interpreter does six jobs:**

1. **Playground**: the FP-track visualizer that shows every reduction step.
2. **Data filter**: keeps only the teacher programs that pass their tests.
3. **Repair teacher**: sends its exact error back to the teacher for a fix.
4. **Curation ranker**: prefers programs that reduce in fewer steps, a signal only a small-step semantics gives.
5. **Grader**: AuditKIT's metric for every evaluated model.
6. **Test-time judge**: turns ten sampled answers into one, using only the example in the prompt.

Each job on its own is a known technique; together they turn a language with no data into a trained local model.

## Results

Qwen2.5-Coder-1.5B-Instruct, LoRA-tuned with AlignTune on 295 rows of teacher-written Sutra, served by SGLang,
scored by AuditKIT with the interpreter as the metric. 39 held-out tasks (38 families never seen in training),
20 samples per task at temperature 0.8, 6–7 tests per task.

| Model | Pass@1 | vs base, task-clustered 95% CI |
|---|---:|---|
| Base (no tuning) | **7.9%** (62/780) | — |
| Tuned on raw teacher data | **45.3%** (353/780) | +37.3 pts [+26.8, +47.4] |
| Tuned on curated data | **53.3%** (416/780) | +45.4 pts [+34.0, +56.4] |

- **Curated vs raw: +8.1 points, 95% CI [+2.8, +13.2]** (bootstrap over tasks, 10,000 resamples). Same rows
  per task, same prompts, hyperparameters and seed; curated is better on 24 tasks, raw on 8, 7 tie.
- **The curated 1.5B student matches its 7B teacher**: on the 20 held-out tasks the teacher also answered, the
  teacher scores 43.1% and the curated student 49.2% (difference +6.1 points, task-clustered 95% CI
  [-10.5, +22.4], so not a significant win), the raw student 38.0%. The teacher was sampled with SGLang's model
  defaults, so this is a reference, not a controlled comparison.
- **Ten samples, one answer (job 6)**: with 10 samples per task and the interpreter as judge, the curated
  student goes from 53.3% to **80.0%** (gain +26.7 points, CI [+19.3, +34.3]), close to the 81.6% of tasks
  where at least one of the 10 is correct. No hidden test is used. Raw goes from 45.3% to 75.3%, so with ten
  tries the curated lead shrinks to +4.8 points (CI [-2.4, +12.9], not significant): curation matters most
  when the model gets one try.
- Curation mostly fixes the language: parse errors fall from 200 to 138 and unbound names from 79 to 34.
- The same pipeline with a 0.5B student gives the same picture at a lower level: base 1.0%, raw 30.1%,
  curated 35.8% (curated vs raw +5.6 points, CI [+0.3, +11.9]), and 73.5% for the curated 0.5B with ten
  samples; outputs in `llm/runs/train_eval_0.5b/`.
- Teacher data: 1,150 of 1,632 programs (70.5%) pass all tests; interpreter-guided repair recovers 164 of the
  456 failures (36.0%), and solves 2 of the 4 training tasks where no original sample was correct.

AuditKIT's printed ± is a per-sample standard error; the intervals above resample tasks, because the 20 samples
of one task are not independent.

## How it works

```
68 training tasks (50 families) ── Qwen2.5-Coder-7B teacher on SGLang writes 24 programs per task
        │
        ▼
[2] Sutra interpreter (Elm) runs every program on 6–7 tests per task (random + edge cases)
        │                     └── [3] failed programs + the interpreter's exact error go back to the
        │                         teacher for one repair attempt, then are verified again
        ▼
CuratorKIT pipeline: InterpreterGate → ExactDeduplicator → [4] FewestSteps (≤ 8 programs per task,
        │            fewest reduction steps first) → MessagesExporter + provenance manifest
        ▼
AlignTune LoRA SFT of Qwen2.5-Coder-1.5B-Instruct on curated vs raw data (same size, same task mix)
        │            → AlignTune PEFTMerger
        ▼
SGLang serves base, raw and curated models → 39 held-out tasks (38 families never seen in training)
        │
        ▼
[5] AuditKIT scores the answers with the interpreter as its metric; task-clustered bootstrap for intervals
        │
        ▼
[6] best_of_k.py: 10 samples → keep those passing the prompt's example → most agreement on fresh inputs → 1 answer
```

The numbers in brackets are the interpreter's jobs from the list above; job 1 is the playground in `fp/`.

- **Raw** = the teacher's programs as generated, no verification, sampled to exactly the curated set's
  number of rows per task. **Curated** = verified, deduplicated, repaired, fewest-steps programs. Same prompt,
  answer format, hyperparameters and seed; the only difference is curation.
- **Interpreter-guided repair**: a failed program goes back to the teacher with what the interpreter said
  (e.g. *"On `solve [0, 2, 2]` it failed with unbound: solve, expected 0"*).
- **Trace-aware curation**: among correct programs the curator prefers those that reduce in fewer steps, a
  signal that comes from the language semantics, not from an LLM judge.
- **Interpreter as test-time judge**: of 10 samples, keep those that pass the example already in the prompt,
  run them on 8 fresh inputs from the task's input generator (no expected outputs), and return the one whose
  outputs agree with the most others, fewest steps breaking ties. This is AlphaCode's agreement idea with the
  Sutra interpreter as the executor.

## Tracks and requirements

| Track | Requirement | How it is met |
|---|---|---|
| Local LLM — *Data-scarce domains* | SGLang as the core inference engine; Lexsi toolkits across post-training | SGLang generates all teacher data and serves every evaluated model. CuratorKIT gates, deduplicates and exports the data; AlignTune trains and merges (and runs CuratorKIT's schema gate on load); AuditKIT scores and compares |
| Functional Programming — challenge 1 | Interpreter for a tiny Haskell-like language (numbers, lists, let, functions, map, fold), one reduction at a time, list cells lit during map/fold | `fp/`: parser, small-step call-by-value reducer and visualizer, all in Elm |
| Open Track – Development | — | the whole project |

## FP half: the Sutra playground

Open `fp/index.html` in a browser (no server, no network). Pick an example or write a program, then Step,
Back or Run: each reduction rewrites the expression in place, the rewritten term is highlighted, and during
`map`, `filter`, `foldl` and `foldr` the list is drawn as cells with the active one lit and the accumulator
shown. **Model answers** shows what the base, raw-trained and curated-trained models wrote for each
held-out task, with the interpreter's verdict, and loads any answer into the reducer to step through it.

The same Elm core runs as a Node CLI (`fp/dist/sutra.js check|run|trace`), which is the verifier used by the
LLM pipeline. Language definition: [`SPEC.md`](SPEC.md). Build and tests: [`fp/README.md`](fp/README.md).

## What we found in the toolkits

Using the toolkits end to end on free T4 GPUs surfaced problems that any team on similar hardware would hit:

1. **SGLang on a T4 (sm_75)**: `sgl-kernel` ships no sm_75 code (`no kernel image is available`), and SGLang
   0.5.10's RMSNorm needs a CUTLASS DSL that rejects sm_75. SGLang 0.5.4.post3 runs once every `CustomOp` is
   routed to its PyTorch `forward_native` (a 3-line patch in `llm/kaggle/job.py.tmpl`), with the Triton
   attention backend and custom all-reduce disabled.
2. **SGLang parallel sampling** (`n > 1`) exhausted request slots and killed the scheduler; one request per
   sample works.
3. **SGLang silently applies the model's `generation_config`** (repetition penalty, top-k, top-p) on top of
   the request; every request here sets them explicitly.
4. **AlignTune `create_sft_trainer` stops at 10 steps** unless `max_steps=-1` is passed, whatever
   `num_epochs` says.
5. **AlignTune's dependencies** pull vLLM, xformers and PyICU even for plain SFT; SFT + merge work with
   `--no-deps` plus eight small packages (`llm/kaggle/build.py`).
6. **AlignTune `PEFTMerger` + SGLang**: the merged `config.json` is written in the transformers-5 layout
   (`rope_parameters`), which SGLang's transformers 4.57 reads as `rope_theta = 10000` instead of 1,000,000,
   with no warning. The merged model then scored 1/220 on SGLang versus 48/88 for the same weights in
   transformers. Copying the base config back fixes it.

## Reproduce

```bash
cd fp && npm ci && npm run build && npm test            # interpreter, CLI and visualizer
cd ../llm && python3 -m venv .venv && .venv/bin/pip install kaggle curatorkit==0.1.22 auditkit==1.1.3
python tasks.py                                         # task bank → data/tasks_{train,eval}.jsonl
python kaggle/build.py teacher_gen      # then: kaggle kernels push -p kaggle/jobs/teacher_gen --accelerator NvidiaTeslaT4
python verify.py runs/teacher_gen/outputs_Qwen2.5-Coder-7B-Instruct.jsonl runs/teacher_gen/verified.jsonl
python kaggle/build.py teacher_repair   # push, then verify the same way into runs/teacher_repair/verified.jsonl
python curate.py runs/teacher_gen/verified.jsonl runs/teacher_repair/verified.jsonl data/sft
python kaggle/build.py train_eval       # push; outputs land in runs/train_eval/
python evaluate.py runs/train_eval
python best_of_k.py runs/train_eval                     # ten samples → one answer, no GPU needed
```

Each Kaggle job is one self-contained script with its prompts, data, hyperparameters and pins inlined; the
script that produced the reported numbers is saved next to them as `llm/runs/train_eval/job.py`.

**Trained adapters.** `llm/runs/train_eval/adapters/{raw,curated}/` are the two LoRA adapters behind the
results (r = 16, on `Qwen/Qwen2.5-Coder-1.5B-Instruct`; the tokenizer is the base model's):

```python
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel

base = "Qwen/Qwen2.5-Coder-1.5B-Instruct"
tok = AutoTokenizer.from_pretrained(base)
model = PeftModel.from_pretrained(AutoModelForCausalLM.from_pretrained(base), "llm/runs/train_eval/adapters/curated")
```

Prompts come from `llm/prompts.py` (`messages(task)`); check the answers with `fp/dist/sutra.js check`.

## Limitations

- 39 held-out tasks are small; intervals are task-clustered bootstraps and are reported with every claim.
- Training loss covers the whole conversation (prompt included), as AlignTune's conversational path does;
  it is the same for both conditions.
- Eval families are new functions but use the same primitives and task style as training.
- Best-of-10 draws its fresh inputs from each task's own input generator; in real use a person would
  supply a few sample inputs instead. It is computed from the 20 samples already generated per task.

## Prior work

None. Everything here was written during the hackathon (23–25 Oct 2026). Third-party code is only used as
published packages (Elm, SGLang, Lexsi toolkits, Qwen models).

## License

MIT, see [`LICENSE`](LICENSE).
