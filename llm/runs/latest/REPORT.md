# Sutra: latest completed result

Validated 28 October 2026. Post-submission portfolio work; published submission unchanged.
Private Kaggle kernel: https://www.kaggle.com/code/akshatodiya/sutra
Cloud pipeline runtime: 53 minutes 37 seconds. All stages exited successfully.

| Model | Correct / answers | Pass rate |
|---|---:|---:|
| Qwen2.5-Coder-1.5B-Instruct base | 58 / 780 | 7.4% |
| Raw LoRA | 356 / 780 | 45.6% |
| Curated LoRA | 533 / 780 | 68.3% |

Curated minus raw: +22.7 percentage points, task-clustered 95% CI [+15.6, +30.1].
Curated is better on 30 tasks; raw on 3; 6 ties. The interval resamples the 39 paired
held-out tasks 10,000 times with seed 16, retaining all 20 answers per task.
AuditKIT's answer-independent error bars are not the claim interval.

Best-of-ten: base 34.5%, raw 74.9%, curated 89.0%. Curated minus raw is +14.1 points,
95% CI [+6.4, +23.1]. Selection uses the visible example and output agreement on
8 generated probe inputs, never hidden expected outputs. These estimates average
400 draws from each task's 20 existing answers, rather than a fresh generation run.

Each SFT set has 298 rows across 67 training tasks, with identical prompts, per-task
counts, formatting and hyperparameters. Training used 3 epochs / 114 updates,
fp32, answer-only loss, batch 2 x accumulation 4, learning rate 2e-4, length 1024,
LoRA r16 / alpha32 / dropout .05 on q/k/v/o projections, seed 16.

Checks passed: every cloud source hash matches local source and the preflight;
all 2,340 student outputs reverified identically with the Elm interpreter; all
298 curated SFT programs pass; SFT prompts belong only to the train bank; train
and eval families are disjoint; actual trainer arguments and masks match; both
adapter files are structurally complete; best-of-ten independently reproduced.
Actual package versions, job scripts, training checks and source hashes are retained.

Limitations: one training seed, 39 test tasks, a synthetic language and related task
style. Prompt clarification, answer-only loss and regenerated teacher data changed
together; this run cannot isolate the contribution of each change. The teacher's
recorded decoding differs from the student's. No training or selection used eval data.

Machine-readable counts, intervals, adapter hashes and checks: RESULTS.json.
Raw and curated adapters: train_eval/adapters/{raw,curated}/.
Only the latest result is retained; duplicate checkpoints/tokenizers/optimizer states
and the superseded failed-run note were removed. No new GPU job or Git commit made.

For PR review, generated dataset-card dash placeholders and server-log trailing spaces
were normalized to ASCII/clean whitespace. Programs, tests, scores, model files and
executed source hashes are unchanged.
