# Sutra: teaching a small local LLM a language that has no data

This is my project for **Syntax Error 2026** (SDSLabs, IIT Roorkee, 23 to 25 Oct 2026). It is one project
for three tracks:

- **Local LLM Track** (RadixArk x Lexsi Labs), problem statement
  [*Data-scarce domains*](https://drive.google.com/file/d/1YW0tXd978clO88EzKQ67npqEQg3Bsmpk/view?usp=sharing)
- **Functional Programming Track** (FP Launchpad),
  [challenge 1](https://drive.google.com/file/d/1q_rEB_r3QcGYxAeya-4LW4rnNy4yBRgl/view?usp=sharing)
- **Open Track (Development)**

## The idea

I made a tiny Haskell-like language called Sutra during the hackathon. Because it is new, there is no
training data for it anywhere on the internet. So how do you teach a small local model to write it?

My answer: if there is no data, let one program be the judge of what is correct. I wrote an interpreter
for Sutra in Elm. It runs a program one small step at a time. **That one interpreter does six jobs:**

1. **Playground**: the FP track visualizer. You can see every step of a program running.
2. **Data filter**: a bigger model writes Sutra programs, and the interpreter keeps only the ones that
   pass their tests.
3. **Repair teacher**: if a program fails, the exact error goes back to the bigger model so it can fix it.
4. **Ranker**: among correct programs, it prefers the ones that finish in fewer steps. Only a
   step-by-step interpreter can give this signal.
5. **Grader**: it scores every model at the end.
6. **Test-time judge**: from ten answers by the small model, it picks one, using only the example
   that is already in the prompt.

None of these jobs is new on its own. Putting all six on one interpreter is what makes a language with
zero data trainable.

## Results

These are the latest portfolio results, completed on 28 October after submission.
The published hackathon submission remains unchanged. Full counts and validation are in
[`llm/runs/latest/REPORT.md`](llm/runs/latest/REPORT.md).

I fine-tuned Qwen2.5-Coder-1.5B-Instruct with LoRA (AlignTune) on 298 Sutra programs per set,
served everything with SGLang, and scored with AuditKIT using the interpreter as the metric.
The test set is 39 tasks from 38 families absent from training. Each task has 6 or 7 tests,
and each model answered every task 20 times at temperature 0.8.

| Model | Pass rate | Gain over base, 95% CI |
|---|---:|---|
| Base model, no training | **7.4%** (58/780) | |
| Trained on raw data from the big model | **45.6%** (356/780) | +38.2 points [+28.2, +48.2] |
| Trained on checked (curated) data | **68.3%** (533/780) | +60.9 points [+51.5, +69.9] |

- **Curated beats raw by +22.7 points, 95% CI [+15.6, +30.1].** Both used the same number of rows
  per task, prompts, answer format, hyperparameters and seed. Curated is better on 30 tasks, raw
  on 3, with 6 ties. Both sets contain 298 rows across 67 of the 68 training tasks.
- **Ten tries, one answer (job 6).** The interpreter selects from ten curated-model answers using
  the visible example and output agreement, reaching **89.0%** from 68.3% (gain +20.7 points,
  CI [+14.1, +27.7]). No hidden expected output is used to select. Raw reaches 74.9%, giving
  curated a +14.1-point lead, CI [+6.4, +23.1]. These estimates average 400 draws from each task's
  20 saved answers. The chance that at least one of ten curated answers is correct is 92.2%.
- Curated has fewer parse errors than raw (51 vs 126) and fewer unknown-name errors (36 vs 129).
- The teacher produces 1,161 passing training programs out of 1,632 (71.1%). Interpreter-guided
  repair fixes 176 of the 471 failed programs (37.4%).

All 2,340 student verdicts and all 298 curated training programs were rechecked locally with
identical results. AuditKIT prints a ± that treats every answer as independent. The 20 answers
to one task are correlated, so all intervals above resample whole tasks (10,000 bootstrap rounds,
seed 16). The complete cloud pipeline took 53 minutes 37 seconds.

## How it works

1. **Tasks.** 68 training tasks (50 families) and 39 test tasks (38 other families), each with a
   Python reference answer and 6 or 7 tests (random inputs plus edge cases like empty lists and
   negative numbers). See `llm/tasks.py`.
2. **Teacher writes code.** Qwen2.5-Coder-7B-Instruct on SGLang writes 24 programs for each training
   task.
3. **Interpreter checks (job 2).** Every program is run on all its tests.
4. **Repair (job 3).** Failed programs go back to the teacher once, with the interpreter's exact
   message, for example *"On `solve [0, 2, 2]` it failed with unbound: solve, expected 0"*. The fixed
   programs are checked again.
5. **Curation (job 4).** A CuratorKIT pipeline: keep only checked programs, remove exact duplicates,
   keep at most 8 per task with the fewest steps first, then export chat rows with a provenance
   manifest and dataset card.
6. **Raw set for comparison.** The teacher's programs as they came, without checking, with exactly
   the same number of rows per task as the curated set.
7. **Training.** AlignTune LoRA fine-tuning of Qwen2.5-Coder-1.5B-Instruct on each set, then
   AlignTune's PEFTMerger.
8. **Testing (job 5).** SGLang serves base, raw and curated models on the 39 test tasks, and AuditKIT
   scores the answers with the interpreter as its metric.
9. **Ten tries, one answer (job 6).** `llm/best_of_k.py` takes 10 answers, keeps the ones that pass
   the example in the prompt, runs them on 8 fresh inputs (no expected answers, only outputs) and
   returns the one whose outputs agree with the most others. Fewer steps breaks a tie. This is the
   agreement idea from AlphaCode, with the Sutra interpreter doing the running.

Job 1, the playground, is in `fp/`.

## Tracks and what each one asks for

| Track | What it asks | How this project does it |
|---|---|---|
| Local LLM, *Data-scarce domains* | SGLang as the main inference engine; Lexsi toolkits across post-training | SGLang makes all the teacher data and serves every model that is tested. CuratorKIT checks, removes duplicates and exports the data; AlignTune trains and merges (and runs CuratorKIT's schema check when it loads data); AuditKIT scores and compares |
| Functional Programming, challenge 1 | An interpreter for a tiny Haskell-like language (numbers, lists, let, functions, map, fold) that goes one step at a time, rewrites the expression in place, and lights up the list cell being used in map or fold | `fp/`: parser, step-by-step interpreter and visualizer, all in Elm |
| Open Track (Development) | | The whole project |

## The FP part: Sutra playground

Open `fp/index.html` in any browser. No server and no internet needed. Pick an example or write your
own program, then press Step, Back or Run. Every step rewrites the expression and the changed part is
shown in yellow. When `map`, `filter`, `foldl` or `foldr` is running, the list is drawn as boxes, the
current box is lit, and folds show the running total. The **Model answers** tab shows what the base,
raw and curated models wrote for each test task, with the interpreter's result, and you can run any of
those answers step by step.

The same Elm code also runs as a Node command line tool (`fp/dist/sutra.js check|run|trace`). That is
the checker the LLM pipeline uses. Language details: [`SPEC.md`](SPEC.md). Build and tests:
[`fp/README.md`](fp/README.md).

## Problems I found in the toolkits

Running all the toolkits end to end on free T4 GPUs showed some problems that anyone on similar
hardware will hit:

1. **SGLang on a T4 (sm_75)**: `sgl-kernel` has no sm_75 code (`no kernel image is available`), and
   SGLang 0.5.10's RMSNorm needs a CUTLASS DSL that does not accept sm_75. SGLang 0.5.4.post3 works if
   every `CustomOp` is sent to its PyTorch `forward_native` path (a 3-line patch in
   `llm/kaggle/job.py.tmpl`), with the Triton attention backend and custom all-reduce turned off.
2. **SGLang parallel sampling** (`n > 1`) used up the request slots and killed the scheduler. One
   request per sample works.
3. **SGLang quietly adds the model's `generation_config`** (repetition penalty, top-k, top-p) on top of
   your request. Student requests set these values explicitly. The teacher retains its recorded
   decoding settings, which differ from the student's, so it is only a rough reference.
4. **AlignTune computes a step budget when `max_steps` is omitted**, with a minimum of 10
   optimizer steps. Passing `max_steps=-1` lets `num_epochs` control training.
5. **AlignTune's dependencies** pull in vLLM, xformers and PyICU even for plain SFT. SFT and merging
   work with `--no-deps` and explicit SFT/merge dependencies (see `llm/kaggle/build.py`).
6. **AlignTune `PEFTMerger` with SGLang**: the merged `config.json` is written in the transformers-5
   format (`rope_parameters`). SGLang's transformers 4.57 then reads `rope_theta` as 10,000 instead of
   1,000,000, without any warning. The merged model scored 1/220 on SGLang but 48/88 with the same
   weights in transformers. Copying the base model's config back fixes it.

## How to run it again

```bash
cd fp && npm ci && npm run build && npm test            # interpreter, CLI and visualizer
cd ../llm && python3 -m venv .venv && .venv/bin/pip install kaggle curatorkit==0.1.22 auditkit==1.1.3
python tasks.py                                         # task bank -> data/tasks_{train,eval}.jsonl
export KAGGLE_USERNAME=<your Kaggle username>
python kaggle/build.py latest                           # builds the complete current pipeline
# Ask before launching the GPU job:
kaggle kernels push -p kaggle/jobs/latest --accelerator NvidiaTeslaT4 -t 5400
# Download cloud output to a temporary folder, validate it, then replace runs/latest/.
python evaluate.py runs/latest/train_eval
python best_of_k.py runs/latest/train_eval
```

Each Kaggle job is one script with its prompts, data, settings and package versions inside it. The
exact script behind the numbers above is saved next to them as `llm/runs/latest/train_eval/job.py`.

**Trained adapters.** `llm/runs/latest/train_eval/adapters/{raw,curated}/` are the two LoRA adapters behind
the results (r = 16, on top of `Qwen/Qwen2.5-Coder-1.5B-Instruct`; the tokenizer is the base model's).
Their hashes and completed GPU training checks are recorded in `llm/runs/latest/RESULTS.json`.

```python
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel

base = "Qwen/Qwen2.5-Coder-1.5B-Instruct"
tok = AutoTokenizer.from_pretrained(base)
model = PeftModel.from_pretrained(AutoModelForCausalLM.from_pretrained(base), "llm/runs/latest/train_eval/adapters/curated")
```

Prompts come from `llm/prompts.py` (`messages(task)`). Check the answers with `fp/dist/sutra.js check`.

## Limitations

- 39 test tasks is a small number. That is why every claim comes with an interval that resamples tasks.
- Both current sets use answer-only loss. Relative to the submitted run, prompt clarification,
  loss masking and regenerated stochastic teacher data changed together; their individual effects
  have not been isolated. Training uses one seed.
- The test families are new functions, but they use the same building blocks and task style as
  training.
- For ten tries, the fresh inputs come from each task's own input generator. In real use a person
  would give a few sample inputs instead. This result is computed from the 20 answers already
  generated per task.

## Prior work

No project code predates the hackathon. The submitted core was written on 23 to 25 October 2026;
the latest local experiments and portfolio improvements were made afterwards and are labeled above.
Outside code is used as published packages (Elm, SGLang, the Lexsi toolkits, Qwen models).

## License

MIT, see [`LICENSE`](LICENSE).
