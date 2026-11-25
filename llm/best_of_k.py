"""Best-of-k with the interpreter as the judge: k samples from one model -> one answer, no hidden test used.

Of k sampled programs, keep those that pass the example shown in the prompt, run them on 8 fresh inputs
(outputs only, nothing to compare against) and pick the one whose outputs agree with the most others; fewer
reduction steps breaks ties. The pick is scored on the task's full tests, averaged over 400 random draws
of k of the 20 samples per task.

usage: python best_of_k.py runs/latest/train_eval
"""
import json
import random
import sys
from collections import Counter, defaultdict
from math import comb
from pathlib import Path

import tasks
import verify
from evaluate import task_bootstrap

K, PROBES, DRAWS = 10, 8, 400


def probes(task):
    """Fresh inputs from the task's own input maker (new seed); never paired with an expected output."""
    f = tasks.F[task["family"]]
    p = f["params"][int(task["id"].rsplit("_", 1)[1])]
    rng = random.Random(7)
    return [{"expr": tasks.test_for(lambda *a: 0, f["inputs"](rng, p))["expr"], "expect": ""} for _ in range(PROBES)]


def candidates(path):
    """task_id -> [(passes all tests, passes the prompt's example, outputs on the probes, steps)]"""
    rows = [json.loads(l) for l in open(path)]
    res = verify.check([{"id": v["id"], "program": v["program"],
                         "tests": verify.TASKS[v["task_id"]]["tests"][:1] + probes(verify.TASKS[v["task_id"]])}
                        for v in rows])
    by = defaultdict(list)
    for v, r in zip(rows, res):
        t = r.get("tests") or []
        by[v["task_id"]].append((v["ok"], bool(t) and t[0]["ok"],
                                 None if r.get("parse_error") else tuple(x["error"] or x["value"] for x in t[1:]),
                                 sum(x.get("steps") or 0 for x in t)))
    return by


def pick(sub):
    ok = [c for c in sub if c[1]] or sub
    votes = Counter(c[2] for c in ok)
    return min(ok, key=lambda c: (-votes[c[2]], c[3]))


def main(run_dir):
    mean = lambda d: 100 * sum(d.values()) / len(d)
    best = {}
    for f in sorted(Path(run_dir).glob("verified_*.jsonl")):
        name = f.stem.removeprefix("verified_")
        by = candidates(f)
        rng = random.Random(16)  # same draws for every model
        single = {t: sum(c[0] for c in cs) / len(cs) for t, cs in by.items()}
        best[name] = {t: sum(pick(rng.sample(cs, K))[0] for _ in range(DRAWS)) / DRAWS for t, cs in by.items()}
        ceiling = {t: 1 - comb(len(cs) - sum(c[0] for c in cs), K) / comb(len(cs), K) for t, cs in by.items()}
        lo, hi = task_bootstrap(single, best[name])
        print(f"{name}: pass@1 {mean(single):.1f}% -> best-of-{K} {mean(best[name]):.1f}% "
              f"(gain 95% CI [{100 * lo:+.1f}, {100 * hi:+.1f}]); any of {K} correct {mean(ceiling):.1f}%")
    if "raw" in best and "curated" in best:
        lo, hi = task_bootstrap(best["raw"], best["curated"])
        print(f"best-of-{K}, curated vs raw: {mean(best['curated']) - mean(best['raw']):+.1f} pts, "
              f"95% CI [{100 * lo:+.1f}, {100 * hi:+.1f}]")


if __name__ == "__main__":
    main(sys.argv[1])
