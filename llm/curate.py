"""Build the raw and curated SFT sets from verified teacher samples with CuratorKIT.

curated: teacher samples + interpreter-guided repairs -> InterpreterGate (passes every test)
         -> ExactDeduplicator -> FewestSteps (<= K programs per task)
raw:     the original teacher samples with no verification, sampled to the same number of rows per task as curated

Both sets use the same prompt and the same answer format (the extracted program in a ```sutra block),
so the only difference between them is curation.

usage: python curate.py runs/latest/teacher_gen/verified.jsonl runs/latest/teacher_repair/verified.jsonl runs/latest/sft
"""
import json
import random
import sys
from pathlib import Path

from curatorkit.exporters.messages import MessagesExporter
from curatorkit.interfaces import BaseGate, BaseNormalizer, BaseReader
from curatorkit.manifest import DatasetCardGenerator, ProvenanceManifest, build_provenance, dataset_input
from curatorkit.normalizers.dedup import ExactDeduplicator
from curatorkit.pipeline import Pipeline
from curatorkit.schema import DataSample, RejectedSample

import prompts

HERE = Path(__file__).resolve().parent
TASKS = {json.loads(l)["id"]: json.loads(l) for l in open(HERE / "data" / "tasks_train.jsonl")}
K = 8
SEED = 20261024


def to_sample(row):
    return DataSample(id=row["id"], source_uri=f"teacher:{row['id']}", task_type="instruction_following",
                      instruction=prompts.user_prompt(TASKS[row["task_id"]]),
                      output=f"```sutra\n{row['program']}\n```",
                      metadata={"task_id": row["task_id"], "ok": row["ok"], "error": row["error"], "steps": row["steps"]})


class Rows(BaseReader):
    def __init__(self, rows):
        self.rows = rows

    def read(self):
        return [to_sample(r) for r in self.rows], []


class InterpreterGate(BaseGate):
    """Keeps a program only if the Sutra interpreter ran it and it passed every test of its task."""

    def run(self, samples):
        passed = [s for s in samples if s.metadata["ok"]]
        rejected = [RejectedSample(**s.model_dump(), rejection_reason=f"interpreter:{s.metadata['error']}",
                                   rejecting_step="InterpreterGate") for s in samples if not s.metadata["ok"]]
        return passed, rejected


class FewestSteps(BaseNormalizer):
    """Per task, keeps the K verified programs that reduce in the fewest interpreter steps."""

    def run(self, samples):
        by_task = {}
        for s in samples:
            by_task.setdefault(s.metadata["task_id"], []).append(s)
        return [s for group in by_task.values() for s in sorted(group, key=lambda s: s.metadata["steps"])[:K]]


class MatchTaskCounts(BaseNormalizer):
    """Samples, per task, as many rows as the curated set has for that task (same task mix in both sets)."""

    def __init__(self, counts):
        self.counts = counts

    def run(self, samples):
        rng, by_task = random.Random(SEED), {}
        for s in samples:
            by_task.setdefault(s.metadata["task_id"], []).append(s)
        return [s for t, c in sorted(self.counts.items()) for s in rng.sample(by_task[t], c)]


def build(name, steps, srcs, out, params):
    d = out / name
    d.mkdir(parents=True, exist_ok=True)
    result = Pipeline(steps + [MessagesExporter()], output_dir=d).run()
    manifest = ProvenanceManifest(result, name, d, provenance=build_provenance(
        "curate", inputs=[dataset_input(str(p)) for p in srcs], params=params))
    manifest.write()
    manifest.write_rejected_sidecar()
    DatasetCardGenerator().generate(manifest.build(), d, pipeline_name=f"sutra_{name}", write_readme=False)
    print(f"{name}: {len(result.passed)} rows -> {d / 'sft_messages.jsonl'}")
    return result.passed


def main(src, repair, out):
    src, repair, out = Path(src), Path(repair), Path(out)
    rows = [r for r in map(json.loads, open(src)) if r["split"] == "train"]
    repaired = [r for r in map(json.loads, open(repair)) if r["split"] == "train"]
    curated = build("curated", [Rows(rows + repaired), InterpreterGate(), ExactDeduplicator(), FewestSteps()],
                    [src, repair], out, {"k_per_task": K})
    counts = {}
    for s in curated:
        counts[s.metadata["task_id"]] = counts.get(s.metadata["task_id"], 0) + 1
    build("raw", [Rows(rows), MatchTaskCounts(counts)], [src], out, {"rows_per_task": counts, "seed": SEED})


if __name__ == "__main__":
    main(*sys.argv[1:4])
