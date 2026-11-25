"""Write fp/assets/showcase.json: for every eval task, the first sampled answer of each model and its verdict.

usage: python showcase.py runs/latest/train_eval   (needs verified_<model>.jsonl from verify.py)
"""
import json
import sys
from pathlib import Path

import verify

HERE = Path(__file__).resolve().parent
OUT = HERE.parent / "fp" / "assets" / "showcase.json"


def main(run_dir):
    base = next(f.stem.removeprefix("verified_") for f in Path(run_dir).glob("verified_*.jsonl")
                if f.stem not in ("verified_raw", "verified_curated"))
    MODELS = {"base": base, "raw": "raw", "curated": "curated"}
    first = {}
    for label, name in MODELS.items():
        for v in map(json.loads, open(Path(run_dir) / f"verified_{name}.jsonl")):
            first.setdefault((v["task_id"], label), v)
    entries = []
    for task_id, task in verify.TASKS.items():
        if task["split"] != "eval":
            continue
        t = task["tests"][0]
        entries.append({"task": task["task"], "expr": t["expr"], "expect": t["expect"],
                        "answers": [{"model": label, "program": first[(task_id, label)]["program"],
                                     "verdict": first[(task_id, label)]["error"] or "pass"} for label in MODELS]})
    OUT.write_text(json.dumps(entries, indent=1) + "\n")
    print(f"{len(entries)} tasks -> {OUT}")


if __name__ == "__main__":
    main(sys.argv[1])
