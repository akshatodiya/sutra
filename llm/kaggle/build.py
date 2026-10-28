"""Build private Kaggle jobs; `latest` runs generation through scoring in one session.

usage: KAGGLE_USERNAME=... python kaggle/build.py latest
push (ask first): kaggle kernels push -p kaggle/jobs/latest --accelerator NvidiaTeslaT4 -t 5400
The legacy teacher_gen, teacher_repair and train_eval builders remain available.
"""
import ast
import base64
import hashlib
import json
import os
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
LLM = HERE.parent
sys.path.insert(0, str(LLM))
import prompts

TEACHER = "Qwen/Qwen2.5-Coder-7B-Instruct"
STUDENT = "Qwen/Qwen2.5-Coder-1.5B-Instruct"
BASE = {
    "sglang": "sglang==0.5.4.post3 torch==2.8.0 transformers==4.57.1 sgl-kernel==0.3.16.post4 "
              "flashinfer-python==0.5.0 datasets==4.8.5 pyarrow==26.0.0",
    # Reuse the submitted training versions, independently of Kaggle image updates.
    "train_pip": "--no-deps aligntune==0.1.28 curatorkit==0.1.22 && pip install -q "
                 "--extra-index-url https://download.pytorch.org/whl/cu128 torch==2.11.0+cu128 "
                 "transformers==5.16.1 accelerate==1.14.0 datasets==4.8.5 trl==1.7.1 peft==0.20.0 "
                 "torchao==0.18.0 sqlglot pypdf python-docx tensorboard",
    "ctx": 4096, "concurrency": 128,
    "server_flags": ["--attention-backend", "triton", "--sampling-backend", "pytorch", "--disable-cuda-graph",
                     "--disable-custom-all-reduce", "--max-running-requests", "128"],
}
# None makes AlignTune calculate a step budget with a minimum of 10; -1 lets epochs control training.
# fp32 on T4 (no bf16); effective batch = 2 x 4 = 8 for the 1.5B student.
HPARAMS = {"precision": "fp32", "num_epochs": 3, "max_steps": -1, "batch_size": 2, "gradient_accumulation_steps": 4,
           "learning_rate": 2e-4, "max_seq_length": 1024, "lora_r": 16, "lora_alpha": 32, "lora_dropout": 0.05,
           "seed": 16, "assistant_only_loss": True}


def tasks(split):
    return [json.loads(l) for l in (LLM / "data" / f"tasks_{split}.jsonl").read_text().splitlines()]


def reqs(split, n, temperature):
    return [{"id": f"{split}:{t['id']}", "meta": {"task_id": t["id"], "split": split}, "messages": prompts.messages(t),
             "n": n, "temperature": temperature, "max_tokens": 512} for t in tasks(split)]


def render(template, values):
    # Replace the whole string literal: even a model answer containing triple quotes stays data.
    for key, val in values.items():
        template = template.replace("r'''__" + key + "__'''", repr(json.dumps(val)))
    ast.parse(template)
    return template


def write_job(name, script):
    d = HERE / "jobs" / name
    d.mkdir(parents=True, exist_ok=True)
    (d / "job.py").write_text(script)
    slug = "sutra" if name == "latest" else f"sutra-{name.replace('_', '-')}"
    meta = {"id": f"{os.environ['KAGGLE_USERNAME']}/{slug}", "title": "Sutra" if name == "latest" else slug, "code_file": "job.py", "language": "python",
            "kernel_type": "script", "is_private": True, "enable_gpu": True, "enable_internet": True,
            "dataset_sources": [], "competition_sources": [], "kernel_sources": []}
    (d / "kernel-metadata.json").write_text(json.dumps(meta, indent=1))
    print(f"built {d}")


def build(name, job, requests, train):
    write_job(name, render((HERE / "job.py.tmpl").read_text(), {"JOB": job, "REQUESTS": requests, "TRAIN": train}))


def archived(name, key):
    """Read literal settings, never execute an archived GPU job."""
    tree = ast.parse((LLM / "runs" / "latest" / name / "job.py").read_text())
    node = next(n for n in tree.body if isinstance(n, ast.Assign) and isinstance(n.targets[0], ast.Name)
                and n.targets[0].id == key)
    return json.loads(ast.literal_eval(node.value.args[0]))


def latest():
    def plan(stage):
        rows = archived(stage, "REQUESTS")
        for row in rows:
            old = row["messages"][0]["content"]
            row["messages"][0]["content"] = prompts.CHEATSHEET + "\n\nTask: " + old.split("\n\nTask: ", 1)[1]
        return rows

    root = LLM.parent
    paths = ["llm/prompts.py", "llm/tasks.py", "llm/verify.py", "llm/curate.py", "llm/evaluate.py", "llm/best_of_k.py",
             "llm/data/tasks_train.jsonl", "llm/data/tasks_eval.jsonl", "fp/dist/sutra.js", "llm/kaggle/job.py.tmpl"]
    files = {p: (root / p).read_text() for p in paths}
    teacher = {**BASE, "models": [TEACHER], "tp": 2, "mem": 0.75,
               "sampling": {"top_p": 0.8, "top_k": 20, "repetition_penalty": 1.1}}
    jobs = {
        "teacher_gen": {**teacher, "server_seeds": {TEACHER.split("/")[-1]: 890407709}},
        "teacher_repair": {**teacher, "server_seeds": {TEACHER.split("/")[-1]: 851035473}},
        "train_eval": {**BASE, "models": [STUDENT], "tp": 1, "mem": 0.75,
                       "sampling": {"top_p": 1.0, "top_k": -1, "repetition_penalty": 1.0},
                       "server_seeds": {STUDENT.split("/")[-1]: 469132208, "raw": 500784887, "curated": 476297148}},
    }
    bundle = {"files": files, "hashes": {p: hashlib.sha256(s.encode()).hexdigest() for p, s in files.items()},
              "jobs": jobs, "teacher_requests": plan("teacher_gen"), "eval_requests": plan("train_eval"),
              "student": STUDENT, "hparams": HPARAMS, "max_seconds": 5400}
    payload = base64.b64encode(json.dumps(bundle).encode()).decode()
    script = (HERE / "pipeline.py.tmpl").read_text().replace("__BUNDLE__", payload)
    ast.parse(script)
    write_job("latest", script)


def main(name):
    if name == "latest":
        latest()
    elif name == "teacher_gen":
        build(name, {**BASE, "models": [TEACHER], "tp": 2, "mem": 0.75},
              reqs("train", 24, 0.8) + reqs("eval", 8, 0.8), {})
    elif name == "teacher_repair":
        by_id = {t["id"]: t for t in tasks("train")}
        failed = [v for v in map(json.loads, (LLM / "runs/latest/teacher_gen/verified.jsonl").open())
                  if v["split"] == "train" and not v["ok"]]
        requests = [{"id": f"repair:{v['id']}", "meta": {"task_id": v["task_id"], "split": "train", "repair_of": v["id"]},
                     "messages": prompts.repair_messages(by_id[v["task_id"]], v["program"], v["check"]),
                     "n": 1, "temperature": 0.2, "max_tokens": 512} for v in failed]
        build(name, {**BASE, "models": [TEACHER], "tp": 2, "mem": 0.75}, requests, {})
    elif name == "train_eval":
        sets = {s: [json.loads(l) for l in (LLM / "runs/latest/sft" / s / "sft_messages.jsonl").open()] for s in ("raw", "curated")}
        build(name, {**BASE, "models": [STUDENT], "tp": 1, "mem": 0.75}, reqs("eval", 20, 0.8),
              {"student": STUDENT, "hparams": HPARAMS, "sets": sets})
    else:
        sys.exit(f"unknown job {name}")


if __name__ == "__main__":
    main(sys.argv[1])
