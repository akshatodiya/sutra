"""Build a self-contained Kaggle job folder (job.py with requests/training data inlined + metadata).

usage:
  python kaggle/build.py teacher_gen   # teacher samples for train tasks + teacher score on eval tasks
  python kaggle/build.py teacher_repair  # failed teacher samples + interpreter feedback -> one repair attempt each
  python kaggle/build.py train_eval    # AlignTune SFT on data/sft/{raw,curated}, then SGLang eval of base/raw/curated
push: kaggle kernels push -p kaggle/jobs/<name> --accelerator NvidiaTeslaT4 -t <seconds>
"""
import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
LLM = HERE.parent
sys.path.insert(0, str(LLM))
import prompts  # noqa: E402

USER = "akshatodiya"
TEACHER = "Qwen/Qwen2.5-Coder-7B-Instruct"
STUDENT = "Qwen/Qwen2.5-Coder-1.5B-Instruct"
BASE = {"sglang": "sglang==0.5.4.post3",  # newest release that runs on a T4 with the native-op patch
        # AlignTune's full deps pull vLLM/xformers/PyICU; SFT + merge only need these (checked on a tiny Qwen2 run).
        "train_pip": "--no-deps aligntune==0.1.28 curatorkit==0.1.22 && pip install -q trl==1.7.1 peft==0.20.0 "
                     "torchao==0.18.0 sqlglot pypdf python-docx tensorboard", "ctx": 4096, "concurrency": 128,
        "server_flags": ["--attention-backend", "triton", "--sampling-backend", "pytorch", "--disable-cuda-graph",
                         "--disable-custom-all-reduce", "--max-running-requests", "128"]}
# max_steps=-1: without it AlignTune stops at 10 steps whatever num_epochs says.
# fp32 on a 15 GB T4 (no bf16): batch 2 x 4 accumulation keeps the effective batch at 8 for the 1.5B student.
HPARAMS = {"precision": "fp32", "num_epochs": 3, "max_steps": -1, "batch_size": 2, "gradient_accumulation_steps": 4,
           "learning_rate": 2e-4,
           "max_seq_length": 1024, "lora_r": 16, "lora_alpha": 32, "lora_dropout": 0.05, "seed": 16}


def tasks(split):
    return [json.loads(l) for l in open(LLM / "data" / f"tasks_{split}.jsonl")]


def reqs(split, n, temperature):
    return [{"id": f"{split}:{t['id']}", "meta": {"task_id": t["id"], "split": split}, "messages": prompts.messages(t),
             "n": n, "temperature": temperature, "max_tokens": 512} for t in tasks(split)]


def build(name, job, requests, train):
    d = HERE / "jobs" / name
    d.mkdir(parents=True, exist_ok=True)
    script = (HERE / "job.py.tmpl").read_text()
    for key, val in {"__JOB__": job, "__REQUESTS__": requests, "__TRAIN__": train}.items():
        text = json.dumps(val)
        assert "'''" not in text
        script = script.replace(key, text)
    (d / "job.py").write_text(script)
    slug = f"sutra-{name.replace('_', '-')}"
    meta = {"id": f"{USER}/{slug}", "title": slug, "code_file": "job.py", "language": "python", "kernel_type": "script",
            "is_private": True, "enable_gpu": True, "enable_internet": True, "dataset_sources": [],
            "competition_sources": [], "kernel_sources": []}
    (d / "kernel-metadata.json").write_text(json.dumps(meta, indent=1))
    print(f"built {d}: {len(requests)} requests, {sum(r['n'] for r in requests)} samples per model,"
          f" train sets {[f'{k}={len(v)}' for k, v in train.get('sets', {}).items()]}")


def main(name):
    if name == "teacher_gen":
        build(name, {**BASE, "models": [TEACHER], "tp": 2, "mem": 0.75},
              reqs("train", 24, 0.8) + reqs("eval", 8, 0.8), {})
    elif name == "teacher_repair":  # one interpreter-guided repair attempt per failed teacher sample
        by_id = {t["id"]: t for t in tasks("train")}
        failed = [v for v in map(json.loads, open(LLM / "runs" / "teacher_gen" / "verified.jsonl"))
                  if v["split"] == "train" and not v["ok"]]
        requests = [{"id": f"repair:{v['id']}", "meta": {"task_id": v["task_id"], "split": "train", "repair_of": v["id"]},
                     "messages": prompts.repair_messages(by_id[v["task_id"]], v["program"], v["check"]),
                     "n": 1, "temperature": 0.2, "max_tokens": 512} for v in failed]
        build(name, {**BASE, "models": [TEACHER], "tp": 2, "mem": 0.75}, requests, {})
    elif name == "train_eval":
        sets = {s: [json.loads(l) for l in open(LLM / "data" / "sft" / s / "sft_messages.jsonl")] for s in ("raw", "curated")}
        build(name, {**BASE, "models": [STUDENT], "tp": 1, "mem": 0.75}, reqs("eval", 20, 0.8),
              {"student": STUDENT, "hparams": HPARAMS, "sets": sets})
    else:
        sys.exit(f"unknown job {name}")


if __name__ == "__main__":
    main(sys.argv[1])
