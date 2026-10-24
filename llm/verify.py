"""Verify model outputs with the Sutra interpreter (fp/dist/sutra.js check, SPEC.md §5.1).

Input: a Kaggle job's outputs.jsonl (one row per request, `outputs` = n samples).
Output: one row per sample with the extracted program, interpreter verdict and per-test results.

usage: python verify.py <outputs.jsonl> <verified.jsonl>
"""
import json
import subprocess
import sys
from pathlib import Path

import prompts

HERE = Path(__file__).resolve().parent
CLI = HERE.parent / "fp" / "dist" / "sutra.js"
TASKS = {json.loads(l)["id"]: json.loads(l)
         for split in ("train", "eval") for l in open(HERE / "data" / f"tasks_{split}.jsonl")}


def check(items, max_steps=10000):
    """Run the interpreter on [{id, program, tests}] and return results in the same order."""
    payload = "".join(json.dumps({**it, "maxSteps": max_steps}) + "\n" for it in items)
    out = subprocess.run(["node", str(CLI), "check"], input=payload, capture_output=True, text=True, timeout=600)
    if out.returncode != 0:
        raise RuntimeError(f"sutra check failed ({out.returncode}): {out.stderr[:500]}")
    rows = [json.loads(l) for l in out.stdout.splitlines() if l.strip()]
    if len(rows) != len(items) or any(r.get("id") != it["id"] for r, it in zip(rows, items)):
        raise RuntimeError("sutra check returned misaligned results")
    return rows


def first_error(res):
    if res.get("parse_error"):
        return "parse_error"
    for t in res.get("tests", []):
        if t.get("error"):
            return t["error"].split(":")[0]
        if not t.get("ok"):
            return "wrong_answer"
    return None


def main(src, dst):
    samples = []
    for row in map(json.loads, open(src)):
        if "error" in row:
            raise SystemExit(f"{src}: generation failed for {row['id']}: {row['error']} (incomplete run, not scoring it)")
        task = TASKS[row["meta"]["task_id"]]
        for k, text in enumerate(row.get("outputs", [])):
            samples.append({"id": f"{row['id']}#{k}", "task_id": task["id"], "split": task["split"],
                            "family": task["family"], "raw": text, "finish": (row.get("finish") or [None])[k],
                            "program": prompts.extract_program(text)})
    results = check([{"id": s["id"], "program": s["program"], "tests": TASKS[s["task_id"]]["tests"]} for s in samples])
    with open(dst, "w") as f:
        for s, r in zip(samples, results):
            s["ok"] = bool(r.get("ok"))
            s["error"] = first_error(r)
            s["steps"] = sum(t.get("steps") or 0 for t in r.get("tests", []))
            for t, ref in zip(r.get("tests", []), TASKS[s["task_id"]]["tests"]):
                t["expect"] = ref["expect"]
            s["check"] = r
            f.write(json.dumps(s) + "\n")
    by = {}
    for s in samples:
        by.setdefault(s["split"], []).append(s["ok"])
    for split, oks in by.items():
        print(f"{split}: {sum(oks)}/{len(oks)} samples verified ({100 * sum(oks) / len(oks):.1f}%)")


if __name__ == "__main__":
    main(*sys.argv[1:3])
