"""One prompt format for the teacher, the student and every eval condition (so comparisons are fair)."""
import re

CHEATSHEET = """Sutra is a tiny pure functional language (Haskell-like, call-by-value).
- Values: integers, True/False, lists like [1, 2, 3].
- Definitions: `name arg1 arg2 = expr`, one per line; may be recursive.
- Expressions: application `f x y`, lambda `\\x -> e` or `\\acc x -> e`, `let x = e in e`,
  `if c then a else b`, cons `x : xs`, operators + - * / % (integer), == /= < <= > >=, && ||.
- A minus sign in front works only on a number literal like `-3`; write `0 - x` to negate a variable.
- Builtins: map, filter, foldl, foldr, length, head, tail, null, range a b (inclusive), reverse, sum, max, min, not.
- There is no pattern matching, no where, no type signatures, no guards.

Example:
double x = x * 2
solve xs = foldl (\\acc x -> acc + x) 0 (map double (filter (\\x -> x > 0) xs))"""


def user_prompt(task):
    ex = task["tests"][0]
    return (f"{CHEATSHEET}\n\nTask: {task['task']}\n"
            f"Define `{task['signature']}` (you may add helper definitions).\n"
            f"Example: {ex['expr']} == {ex['expect']}\n"
            "Reply with only the Sutra program in one ```sutra code block.")


def messages(task):
    return [{"role": "user", "content": user_prompt(task)}]


def feedback(check):
    """What the interpreter said about a failed program, in one line."""
    if check.get("parse_error"):
        return f"It does not parse: {check['parse_error']}"
    t = next(t for t in check["tests"] if not t["ok"])
    got = t["error"] or f"got {t['value']}"
    return f"On `{t['expr']}` it {'failed with ' + got if t['error'] else got}, expected {t.get('expect', '?')}."


def repair_messages(task, program, check):
    return messages(task) + [
        {"role": "assistant", "content": f"```sutra\n{program}\n```"},
        {"role": "user", "content": f"The Sutra interpreter rejected this program. {feedback(check)} "
                                    "Fix it. Reply with only the corrected program in one ```sutra code block."}]


FENCE = re.compile(r"```[^\n]*\n(.*?)```", re.S)  # fence line may carry extra words ("```sutra code")


def extract_program(text):
    """The first fenced block if present, else the whole text."""
    m = FENCE.search(text or "")
    prog = m.group(1) if m else (text or "")
    return prog.strip()
