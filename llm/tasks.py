"""Task bank for Sutra: small list/number problems with Python reference solutions.

Each family is a template with parameters. A task = (family, params) -> description, a Python
reference `ref`, and seeded test inputs. Expected outputs come from the Python reference, so they
never depend on the teacher. Train and eval use DISJOINT families, so eval measures whether the
model learned Sutra, not memorised a task.

usage: python tasks.py  -> writes data/tasks_train.jsonl and data/tasks_eval.jsonl
"""
import json
import random
from pathlib import Path

HERE = Path(__file__).parent
SEED = 20261024
N_TESTS = 4


def canon(v):
    """SPEC.md §5.3 canonical value form."""
    if isinstance(v, bool):
        return "True" if v else "False"
    if isinstance(v, int):
        return str(v)
    if isinstance(v, list):
        return "[" + ", ".join(canon(x) for x in v) + "]"
    raise TypeError(v)


def rand_list(rng, lo=-9, hi=20, n=(0, 8)):
    return [rng.randint(lo, hi) for _ in range(rng.randint(*n))]


def pos_list(rng, n=(1, 8)):
    return [rng.randint(1, 20) for _ in range(rng.randint(*n))]


def tdiv(a, b):  # SPEC: integer division truncates toward zero
    q = abs(a) // abs(b)
    return q if (a >= 0) == (b >= 0) else -q


def tmod(a, b):  # remainder consistent with truncating division
    return a - b * tdiv(a, b)


# Each family: name -> (description template, params list, reference builder, input maker, split)
# ref(params) returns a Python function of the inputs; inputs(rng, params) returns a list of args.
F = {}


def fam(name, split, desc, params, ref, inputs):
    F[name] = dict(split=split, desc=desc, params=params, ref=ref, inputs=inputs)


L = lambda rng, p: [rand_list(rng)]
P = lambda rng, p: [pos_list(rng)]
N = lambda rng, p: [rng.randint(0, 10)]
LK = lambda rng, p: [rand_list(rng), rng.randint(-3, 10)]
Z = lambda rng, p: [rand_list(rng, -2, 2)]
# Fixed edge cases appended after the random tests (the first test, shown in the prompt, stays the same):
# empty lists, all-negative lists and negative odd numbers catch programs that only pass the random tests.
EDGES = {L: [[[]], [[-3, -1]], [[-7, 2, -5, 8, 0]]], P: [[[7]], [[3, 9, 1]]], N: [[0], [1]],
         LK: [[[], 2], [[-3, -1, 4], -1], [[5, 5, 0], 5]], Z: [[[]], [[0, 0, -1]]]}

# ---- train families ----
fam("scale", "train", "Multiply every element of the list xs by {k}.", [{"k": k} for k in (2, 3, 5, -1, 10)],
    lambda p: lambda xs: [x * p["k"] for x in xs], L)
fam("shift", "train", "Add {k} to every element of the list xs.", [{"k": k} for k in (1, 4, -2, 7)],
    lambda p: lambda xs: [x + p["k"] for x in xs], L)
fam("sum", "train", "Return the sum of the list xs.", [{}], lambda p: lambda xs: sum(xs), L)
fam("product", "train", "Return the product of the list xs (1 for an empty list).", [{}],
    lambda p: lambda xs: __import__("math").prod(xs), lambda rng, p: [rand_list(rng, -3, 5, (0, 5))])
fam("count_gt", "train", "Count how many elements of xs are greater than {k}.", [{"k": k} for k in (0, 3, 10)],
    lambda p: lambda xs: sum(1 for x in xs if x > p["k"]), L)
fam("keep_lt", "train", "Keep only the elements of xs that are less than {k}, in order.", [{"k": k} for k in (0, 5, 12)],
    lambda p: lambda xs: [x for x in xs if x < p["k"]], L)
fam("keep_mult", "train", "Keep only the elements of xs that are divisible by {k}, in order.", [{"k": k} for k in (2, 3, 5)],
    lambda p: lambda xs: [x for x in xs if tmod(x, p["k"]) == 0], L)
fam("squares", "train", "Return the list of squares of the elements of xs.", [{}], lambda p: lambda xs: [x * x for x in xs], L)
fam("sum_squares", "train", "Return the sum of the squares of the elements of xs.", [{}],
    lambda p: lambda xs: sum(x * x for x in xs), L)
fam("maximum", "train", "Return the largest element of the non-empty list xs.", [{}], lambda p: lambda xs: max(xs), P)
fam("minimum", "train", "Return the smallest element of the non-empty list xs.", [{}], lambda p: lambda xs: min(xs), P)
fam("len", "train", "Return the number of elements in xs.", [{}], lambda p: lambda xs: len(xs), L)
fam("rev", "train", "Return xs reversed.", [{}], lambda p: lambda xs: xs[::-1], L)
fam("last", "train", "Return the last element of the non-empty list xs.", [{}], lambda p: lambda xs: xs[-1], P)
fam("range_sum", "train", "Return the sum of all integers from 1 to n (0 when n is 0).", [{}],
    lambda p: lambda n: n * (n + 1) // 2, N)
fam("range_list", "train", "Return the list of integers from {k} to n inclusive (empty if n < {k}).",
    [{"k": k} for k in (0, 1, 3)], lambda p: lambda n: list(range(p["k"], n + 1)), N)
fam("factorial", "train", "Return n factorial (1 when n is 0).", [{}], lambda p: lambda n: __import__("math").factorial(n), N)
fam("evens_sum", "train", "Return the sum of the even elements of xs.", [{}], lambda p: lambda xs: sum(x for x in xs if tmod(x, 2) == 0), L)
fam("odds_count", "train", "Count the odd elements of xs.", [{}], lambda p: lambda xs: sum(1 for x in xs if tmod(x, 2) != 0), L)
fam("all_pos", "train", "Return True if every element of xs is positive, otherwise False.", [{}],
    lambda p: lambda xs: all(x > 0 for x in xs), L)
fam("any_eq", "train", "Return True if some element of xs equals {k}, otherwise False.", [{"k": k} for k in (0, 5)],
    lambda p: lambda xs: any(x == p["k"] for x in xs), L)
fam("abs_all", "train", "Replace every element of xs by its absolute value.", [{}], lambda p: lambda xs: [abs(x) for x in xs], L)
fam("clamp", "train", "Replace every element of xs greater than {k} by {k}.", [{"k": k} for k in (5, 10)],
    lambda p: lambda xs: [min(x, p["k"]) for x in xs], L)
fam("prefix_sums", "train", "Return the running (prefix) sums of xs, e.g. [1, 2, 3] -> [1, 3, 6].", [{}],
    lambda p: lambda xs: [sum(xs[: i + 1]) for i in range(len(xs))], L)
fam("count_eq_arg", "train", "Given xs and k, count how many elements of xs equal k.", [{}],
    lambda p: lambda xs, k: sum(1 for x in xs if x == k), LK)
fam("add_k_arg", "train", "Given xs and k, add k to every element of xs.", [{}], lambda p: lambda xs, k: [x + k for x in xs], LK)
fam("take_gt_arg", "train", "Given xs and k, keep the elements of xs greater than k, in order.", [{}],
    lambda p: lambda xs, k: [x for x in xs if x > k], LK)
fam("double_evens", "train", "Double the even elements of xs and leave the odd ones unchanged.", [{}],
    lambda p: lambda xs: [x * 2 if tmod(x, 2) == 0 else x for x in xs], L)
fam("sum_pos", "train", "Return the sum of the positive elements of xs.", [{}], lambda p: lambda xs: sum(x for x in xs if x > 0), L)
fam("pow2", "train", "Return 2 raised to the power n.", [{}], lambda p: lambda n: 2 ** n, N)

# ---- eval families (never seen in training) ----
fam("mean_floor", "eval", "Return the sum of the non-empty list xs divided by its length (integer division).", [{}],
    lambda p: lambda xs: tdiv(sum(xs), len(xs)), P)
fam("count_between", "eval", "Count elements of xs that are at least {a} and at most {b}.", [{"a": 0, "b": 9}, {"a": 3, "b": 6}],
    lambda p: lambda xs: sum(1 for x in xs if p["a"] <= x <= p["b"]), L)
fam("square_odds", "eval", "Square the odd elements of xs and drop the even ones.", [{}],
    lambda p: lambda xs: [x * x for x in xs if tmod(x, 2) != 0], L)
fam("max_minus_min", "eval", "Return the largest element minus the smallest element of the non-empty list xs.", [{}],
    lambda p: lambda xs: max(xs) - min(xs), P)
fam("sum_range_sq", "eval", "Return the sum of the squares of the integers from 1 to n.", [{}],
    lambda p: lambda n: sum(i * i for i in range(1, n + 1)), N)
fam("neg_count", "eval", "Count the negative elements of xs.", [{}], lambda p: lambda xs: sum(1 for x in xs if x < 0), L)
fam("triple_sum", "eval", "Multiply every element of xs by 3 and return the sum.", [{}], lambda p: lambda xs: sum(3 * x for x in xs), L)
fam("none_gt_arg", "eval", "Given xs and k, return True if no element of xs is greater than k.", [{}],
    lambda p: lambda xs, k: not any(x > k for x in xs), LK)
fam("evens_then_rev", "eval", "Keep the even elements of xs and return them in reverse order.", [{}],
    lambda p: lambda xs: [x for x in xs if tmod(x, 2) == 0][::-1], L)
fam("fib", "eval", "Return the n-th Fibonacci number, with fib 0 = 0 and fib 1 = 1.", [{}],
    lambda p: lambda n: (lambda f: f(f, n))(lambda f, m: m if m < 2 else f(f, m - 1) + f(f, m - 2)), N)

# ---- second batch (appended so the tests of the tasks above stay byte-identical) ----
fam("cubes", "train", "Return the list of cubes of the elements of xs.", [{}], lambda p: lambda xs: [x ** 3 for x in xs], L)
fam("sum_odds", "train", "Return the sum of the odd elements of xs.", [{}], lambda p: lambda xs: sum(x for x in xs if tmod(x, 2) != 0), L)
fam("max_or_zero", "train", "Return the largest element of xs, or 0 if xs is empty.", [{}], lambda p: lambda xs: max(xs) if xs else 0, L)
fam("first_or_zero", "train", "Return the first element of xs, or 0 if xs is empty.", [{}], lambda p: lambda xs: xs[0] if xs else 0, L)
fam("first_plus_last", "train", "Return the first element plus the last element of the non-empty list xs.", [{}],
    lambda p: lambda xs: xs[0] + xs[-1], P)
fam("twice_sum", "train", "Return twice the sum of xs.", [{}], lambda p: lambda xs: 2 * sum(xs), L)
fam("count_div", "train", "Count the elements of xs that are divisible by {k}.", [{"k": k} for k in (4, 7)],
    lambda p: lambda xs: sum(1 for x in xs if tmod(x, p["k"]) == 0), L)
fam("neg_to_zero", "train", "Replace every negative element of xs by 0.", [{}], lambda p: lambda xs: [max(x, 0) for x in xs], L)
fam("inc_pos", "train", "Add 1 to the positive elements of xs and leave the others unchanged.", [{}],
    lambda p: lambda xs: [x + 1 if x > 0 else x for x in xs], L)
fam("sign", "train", "Replace each element of xs by 1 if it is positive, -1 if it is negative and 0 if it is zero.", [{}],
    lambda p: lambda xs: [(x > 0) - (x < 0) for x in xs], L)
fam("mul_k_arg", "train", "Given xs and k, multiply every element of xs by k.", [{}], lambda p: lambda xs, k: [x * k for x in xs], LK)
fam("remove_k_arg", "train", "Given xs and k, remove every element equal to k.", [{}], lambda p: lambda xs, k: [x for x in xs if x != k], LK)
fam("count_ge_arg", "train", "Given xs and k, count the elements of xs that are at least k.", [{}],
    lambda p: lambda xs, k: sum(1 for x in xs if x >= k), LK)
fam("evens_upto", "train", "Return the list of even numbers from 0 to n inclusive.", [{}], lambda p: lambda n: list(range(0, n + 1, 2)), N)
fam("odd_sum_upto", "train", "Return the sum of the odd numbers from 1 to n.", [{}], lambda p: lambda n: sum(range(1, n + 1, 2)), N)
fam("countdown", "train", "Return the list of integers from n down to 1 (empty when n is 0).", [{}],
    lambda p: lambda n: list(range(n, 0, -1)), N)
fam("squares_upto", "train", "Return the list of squares of the integers from 1 to n.", [{}],
    lambda p: lambda n: [i * i for i in range(1, n + 1)], N)
fam("min_plus_max", "train", "Return the smallest plus the largest element of the non-empty list xs.", [{}],
    lambda p: lambda xs: min(xs) + max(xs), P)
fam("all_even", "train", "Return True if every element of xs is even, otherwise False.", [{}],
    lambda p: lambda xs: all(tmod(x, 2) == 0 for x in xs), L)
fam("has_neg", "train", "Return True if some element of xs is negative, otherwise False.", [{}],
    lambda p: lambda xs: any(x < 0 for x in xs), L)

fam("pos_squares", "eval", "Square the positive elements of xs and drop the others.", [{}],
    lambda p: lambda xs: [x * x for x in xs if x > 0], L)
fam("count_odd_pos", "eval", "Count the elements of xs that are both odd and positive.", [{}],
    lambda p: lambda xs: sum(1 for x in xs if x > 0 and tmod(x, 2) != 0), L)
fam("double_keep_big", "eval", "Double every element of xs, then keep only the results greater than 10.", [{}],
    lambda p: lambda xs: [2 * x for x in xs if 2 * x > 10], L)
fam("odds_upto", "eval", "Return the list of odd numbers from 1 to n inclusive.", [{}], lambda p: lambda n: list(range(1, n + 1, 2)), N)
fam("max_abs", "eval", "Return the largest absolute value among the elements of xs, or 0 if xs is empty.", [{}],
    lambda p: lambda xs: max((abs(x) for x in xs), default=0), L)
fam("count_ne_arg", "eval", "Given xs and k, count the elements of xs that are not equal to k.", [{}],
    lambda p: lambda xs, k: sum(1 for x in xs if x != k), LK)
fam("last_minus_first", "eval", "Return the last element minus the first element of the non-empty list xs.", [{}],
    lambda p: lambda xs: xs[-1] - xs[0], P)
fam("sum_abs", "eval", "Return the sum of the absolute values of the elements of xs.", [{}], lambda p: lambda xs: sum(abs(x) for x in xs), L)
fam("triangular", "eval", "Return the list [1, 1 + 2, 1 + 2 + 3, ...] up to 1 + 2 + ... + n (empty when n is 0).", [{}],
    lambda p: lambda n: [i * (i + 1) // 2 for i in range(1, n + 1)], N)

# ---- third batch: more held-out eval families (appended; earlier tasks unchanged) ----
fam("halve_evens", "eval", "Divide every even element of xs by 2 and leave the odd ones unchanged.", [{}],
    lambda p: lambda xs: [tdiv(x, 2) if tmod(x, 2) == 0 else x for x in xs], L)
fam("sum_gt_arg", "eval", "Given xs and k, return the sum of the elements of xs that are greater than k.", [{}],
    lambda p: lambda xs, k: sum(x for x in xs if x > k), LK)
fam("cube_sum", "eval", "Return the sum of the cubes of the elements of xs.", [{}], lambda p: lambda xs: sum(x ** 3 for x in xs), L)
fam("count_zero", "eval", "Count how many elements of xs are equal to 0.", [{}], lambda p: lambda xs: sum(1 for x in xs if x == 0), Z)
fam("sq_minus_one", "eval", "Replace every element x of xs by x * x - 1.", [{}], lambda p: lambda xs: [x * x - 1 for x in xs], L)
fam("all_lt_arg", "eval", "Given xs and k, return True if every element of xs is less than k.", [{}],
    lambda p: lambda xs, k: all(x < k for x in xs), LK)
fam("evens_sq_sum", "eval", "Return the sum of the squares of the even elements of xs.", [{}],
    lambda p: lambda xs: sum(x * x for x in xs if tmod(x, 2) == 0), L)
fam("mult3_upto", "eval", "Return the list of multiples of 3 from 3 to n inclusive.", [{}],
    lambda p: lambda n: list(range(3, n + 1, 3)), N)
fam("pow3", "eval", "Return 3 raised to the power n.", [{}], lambda p: lambda n: 3 ** n, N)
fam("sum_double_odds", "eval", "Double the odd elements of xs and return the sum of all elements afterwards.", [{}],
    lambda p: lambda xs: sum(2 * x if tmod(x, 2) != 0 else x for x in xs), L)
fam("drop_first", "eval", "Return xs without its first element (the empty list stays empty).", [{}], lambda p: lambda xs: xs[1:], L)
fam("count_lt_arg", "eval", "Given xs and k, count the elements of xs that are less than k.", [{}],
    lambda p: lambda xs, k: sum(1 for x in xs if x < k), LK)
fam("clamp_low", "eval", "Replace every element of xs that is less than 3 by 3.", [{}], lambda p: lambda xs: [max(x, 3) for x in xs], L)
fam("sum_range_cubes", "eval", "Return the sum of the cubes of the integers from 1 to n.", [{}],
    lambda p: lambda n: sum(i ** 3 for i in range(1, n + 1)), N)
fam("double_list", "eval", "Return xs followed by xs again (the list concatenated with itself).", [{}],
    lambda p: lambda xs: xs + xs, L)
fam("pos_count_arg_scaled", "eval", "Given xs and k, multiply every positive element of xs by k and drop the others.", [{}],
    lambda p: lambda xs, k: [x * k for x in xs if x > 0], LK)
fam("min_or_zero", "eval", "Return the smallest element of xs, or 0 if xs is empty.", [{}], lambda p: lambda xs: min(xs) if xs else 0, L)
fam("abs_diff_first", "eval", "Return the list of absolute differences between each element of xs and the first element "
    "(empty for an empty list).", [{}], lambda p: lambda xs: [abs(x - xs[0]) for x in xs] if xs else [], L)
fam("sum_index_upto", "eval", "Return the sum of i * i - i for i from 1 to n.", [{}],
    lambda p: lambda n: sum(i * i - i for i in range(1, n + 1)), N)


def test_for(ref, args):
    expr = "solve " + " ".join(f"({canon(a)})" if isinstance(a, int) and a < 0 else canon(a) for a in args)
    return {"expr": expr, "expect": canon(ref(*args))}


def build():
    rng = random.Random(SEED)
    out = {"train": [], "eval": []}
    for name, f in F.items():
        for pi, p in enumerate(f["params"]):
            ref = f["ref"](p)
            tests, seen = [], set()
            for _ in range(40):
                args = f["inputs"](rng, p)
                key = json.dumps(args)
                if key in seen:
                    continue
                seen.add(key)
                tests.append(test_for(ref, args))
                if len(tests) == N_TESTS:
                    break
            for args in EDGES.get(f["inputs"], []):
                if json.dumps(args) not in seen:
                    seen.add(json.dumps(args))
                    tests.append(test_for(ref, args))
            sample = f["inputs"](random.Random(0), p)
            sig = "solve xs k" if len(sample) == 2 else ("solve xs" if isinstance(sample[0], list) else "solve n")
            out[f["split"]].append({
                "id": f"{name}_{pi}", "family": name, "split": f["split"],
                "task": f["desc"].format(**p), "signature": sig, "tests": tests,
            })
    (HERE / "data").mkdir(exist_ok=True)
    for split, rows in out.items():
        with open(HERE / "data" / f"tasks_{split}.jsonl", "w") as fh:
            for r in rows:
                fh.write(json.dumps(r) + "\n")
        print(split, len(rows), "tasks,", len({r["family"] for r in rows}), "families")


if __name__ == "__main__":
    build()
