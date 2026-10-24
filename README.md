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

I fine-tuned Qwen2.5-Coder-1.5B-Instruct with LoRA (AlignTune) on 295 Sutra programs written by a
bigger model, served everything with SGLang, and scored with AuditKIT using the interpreter as the
metric. The test set is 39 tasks that the model never saw in training (38 task families that are not
in training at all). Each task has 6 or 7 tests, and each model answered every task 20 times at
temperature 0.8.

| Model | Pass rate | Gain over base, 95% CI |
|---|---:|---|
| Base model, no training | **7.9%** (62/780) | |
| Trained on raw data from the big model | **45.3%** (353/780) | +37.3 points [+26.8, +47.4] |
| Trained on checked (curated) data | **53.3%** (416/780) | +45.4 points [+34.0, +56.4] |

- **Curated beats raw by +8.1 points, 95% CI [+2.8, +13.2].** Both used the same number of rows per
  task, the same prompts, the same settings and the same seed. Curated is better on 24 tasks, raw on
  8, and 7 are a tie.
- **The small curated model is about as good as its 7B teacher.** On the 20 test tasks that the
  teacher also answered, the teacher gets 43.1%, the curated 1.5B model 49.2% and the raw one 38.0%.
  The difference with the teacher is +6.1 points, CI [-10.5, +22.4], so it is not a clear win. Also the
  teacher used SGLang's default sampling settings, so take this as a rough reference only.
- **Ten tries, one answer (job 6).** If the curated model gets 10 tries per task and the interpreter
  picks one, it goes from 53.3% to **80.0%** (gain +26.7 points, CI [+19.3, +34.3]). That is close to
  81.6%, the share of tasks where at least one of the 10 tries is right. No hidden test is used for
  picking. The raw model goes from 45.3% to 75.3%, so with ten tries the curated lead becomes +4.8
  points (CI [-2.4, +12.9], not significant). So curation matters most when the model gets one try.
- Most of what curation fixes is the language itself: parse errors go down from 200 to 138, and
  unknown names from 79 to 34.
- With a 0.5B model the picture is the same, just lower: base 1.0%, raw 30.1%, curated 35.8% (curated
  vs raw +5.6 points, CI [+0.3, +11.9]), and 73.5% for curated with ten tries. Outputs are in
  `llm/runs/train_eval_0.5b/`.
- The big model's data: 1,150 of its 1,632 programs (70.5%) pass all tests. The repair step fixes 164
  of the 456 failed ones (36.0%), and it solves 2 of the 4 training tasks where no first try was right.

AuditKIT prints a ± that treats every answer as independent. The 20 answers to one task are not
independent, so all intervals above resample whole tasks (bootstrap, 10,000 rounds).

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
   your request. Every request here sets these values itself.
4. **AlignTune `create_sft_trainer` stops after 10 steps** unless you pass `max_steps=-1`, whatever
   `num_epochs` says.
5. **AlignTune's dependencies** pull in vLLM, xformers and PyICU even for plain SFT. SFT and merging
   work with `--no-deps` plus eight small packages (see `llm/kaggle/build.py`).
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
python kaggle/build.py teacher_gen      # then: kaggle kernels push -p kaggle/jobs/teacher_gen --accelerator NvidiaTeslaT4
python verify.py runs/teacher_gen/outputs_Qwen2.5-Coder-7B-Instruct.jsonl runs/teacher_gen/verified.jsonl
python kaggle/build.py teacher_repair   # push, then verify the same way into runs/teacher_repair/verified.jsonl
python curate.py runs/teacher_gen/verified.jsonl runs/teacher_repair/verified.jsonl data/sft
python kaggle/build.py train_eval       # push; outputs land in runs/train_eval/
python evaluate.py runs/train_eval
python best_of_k.py runs/train_eval                     # ten tries -> one answer, no GPU needed
```

Each Kaggle job is one script with its prompts, data, settings and package versions inside it. The
exact script behind the numbers above is saved next to them as `llm/runs/train_eval/job.py`.

**Trained adapters.** `llm/runs/train_eval/adapters/{raw,curated}/` are the two LoRA adapters behind
the results (r = 16, on top of `Qwen/Qwen2.5-Coder-1.5B-Instruct`; the tokenizer is the base model's).
I loaded them again on a Mac and checked one greedy answer per test task: base 2.6%, raw 48.7%,
curated 59.0%, the same order as above.

```python
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel

base = "Qwen/Qwen2.5-Coder-1.5B-Instruct"
tok = AutoTokenizer.from_pretrained(base)
model = PeftModel.from_pretrained(AutoModelForCausalLM.from_pretrained(base), "llm/runs/train_eval/adapters/curated")
```

Prompts come from `llm/prompts.py` (`messages(task)`). Check the answers with `fp/dist/sutra.js check`.

## Limitations

- 39 test tasks is a small number. That is why every claim comes with an interval that resamples tasks.
- The training loss covers the whole chat, prompt included, because that is how AlignTune's chat
  path works. It is the same for raw and curated.
- The test families are new functions, but they use the same building blocks and task style as
  training.
- For ten tries, the fresh inputs come from each task's own input generator. In real use a person
  would give a few sample inputs instead. This result is computed from the 20 answers already
  generated per task.

## Prior work

None. Everything here was written during the hackathon (23 to 25 Oct 2026). Outside code is used only
as published packages (Elm, SGLang, the Lexsi toolkits, Qwen models).

## License

MIT, see [`LICENSE`](LICENSE).
