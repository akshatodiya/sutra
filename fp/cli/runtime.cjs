/* Appended to the optimized Elm worker. JavaScript owns I/O and isolation only. */
(() => {
  'use strict';
  const fs = require('node:fs');
  const { once } = require('node:events');
  const { Worker, isMainThread, parentPort, workerData } = require('node:worker_threads');
  const INPUT_BYTES = 1024 * 1024;
  const REQUEST_MS = 5000;

  if (!isMainThread && workerData?.sutraElmWorker === true) {
    const app = module.exports.Elm.Cli.init();
    app.ports.responses.subscribe(message => parentPort.postMessage({ type: 'result', ...message }));
    parentPort.on('message', message => app.ports.requests.send(message));
    parentPort.postMessage({ type: 'ready' });
    return;
  }

  class Engine {
    constructor() {
      this.worker = null;
      this.ready = null;
      this.pending = null;
      this.sequence = 0;
    }

    ensureReady() {
      if (this.worker) return this.ready;
      const worker = new Worker(__filename, {
        workerData: { sutraElmWorker: true },
        resourceLimits: { maxOldGenerationSizeMb: 128, stackSizeMb: 4 },
      });
      this.worker = worker;
      this.ready = new Promise((resolve, reject) => {
        const timer = setTimeout(() => fail(new Error('Elm worker startup exceeded 5 seconds')), REQUEST_MS);
        const fail = error => {
          if (this.worker !== worker) return;
          clearTimeout(timer);
          this.worker = null;
          this.ready = null;
          if (this.pending) {
            clearTimeout(this.pending.timer);
            this.pending.reject(error);
            this.pending = null;
          }
          reject(error);
          worker.terminate().catch(() => {});
        };
        worker.on('error', error => fail(new Error(`interpreter resource failure: ${error.message}`)));
        worker.on('exit', code => {
          if (this.worker === worker) fail(new Error(`Elm worker stopped (exit ${code})`));
        });
        worker.on('message', message => {
          if (this.worker !== worker) return;
          if (message.type === 'ready') {
            clearTimeout(timer);
            resolve();
          } else if (message.type === 'result' && this.pending) {
            if (message.requestId !== this.pending.id) {
              fail(new Error('interpreter response identity mismatch'));
              return;
            }
            clearTimeout(this.pending.timer);
            const pending = this.pending;
            this.pending = null;
            pending.resolve(message.result);
          }
        });
      });
      return this.ready;
    }

    async request(mode, program, expr = '', maxSteps = 10000, trace = false) {
      await this.ensureReady();
      const worker = this.worker;
      const id = this.sequence++;
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          if (!this.pending || this.pending.id !== id) return;
          this.pending = null;
          this.worker = null;
          this.ready = null;
          worker.terminate().catch(() => {});
          reject(new Error('interpreter exceeded the 5-second resource limit; step count unavailable'));
        }, REQUEST_MS);
        this.pending = { id, resolve, reject, timer };
        try {
          worker.postMessage({ requestId: id, mode, program, expr, maxSteps, trace });
        } catch (error) {
          clearTimeout(timer);
          this.pending = null;
          reject(error);
        }
      });
    }

    async close() {
      const worker = this.worker;
      this.worker = null;
      this.ready = null;
      if (worker) await worker.terminate();
    }
  }

  const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  const idOf = value => isObject(value) && Object.hasOwn(value, 'id') ? value.id : null;
  const badInput = (id, message) => ({ id, ok: false, parse_error: `bad_input: ${message}` });
  const resourceError = error => `runtime_error: ${String(error.message ?? error).slice(0, 300)}`;

  function validate(item) {
    if (!isObject(item)) return 'expected a JSON object';
    if (!Object.hasOwn(item, 'id')) return 'missing id';
    if (typeof item.id === 'number' && !Number.isFinite(item.id)) return 'id must be finite';
    if (typeof item.program !== 'string') return 'program must be a string';
    if (!Array.isArray(item.tests)) return 'tests must be an array';
    if (Object.hasOwn(item, 'maxSteps') && (!Number.isSafeInteger(item.maxSteps) || item.maxSteps < 0)) {
      return 'maxSteps must be a nonnegative safe integer';
    }
    for (let index = 0; index < item.tests.length; index++) {
      const test = item.tests[index];
      if (!isObject(test) || typeof test.expr !== 'string' || typeof test.expect !== 'string') {
        return `test ${index} needs string expr and expect fields`;
      }
    }
    return null;
  }

  async function checkItem(engine, item) {
    const id = idOf(item);
    const invalid = validate(item);
    if (invalid) return badInput(id, invalid);
    let parsed;
    try {
      parsed = await engine.request('program', item.program);
    } catch (error) {
      return { id, ok: false, parse_error: `program resource failure: ${error.message}`, tests: [] };
    }
    if (parsed.parse_error !== null) return { id, ok: false, parse_error: parsed.parse_error, tests: [] };

    const tests = [];
    for (const test of item.tests) {
      let result;
      try {
        result = await engine.request('evaluate', item.program, test.expr, item.maxSteps ?? 10000);
      } catch (error) {
        result = { value: null, error: resourceError(error), steps: 0 };
      }
      if (result.parse_error) {
        result = { value: null, error: `parse_error: ${result.parse_error}`, steps: 0 };
      }
      tests.push({ expr: test.expr, ok: result.error === null && result.value === test.expect,
        value: result.value, error: result.error, steps: result.steps });
    }
    return { id, ok: tests.every(test => test.ok), parse_error: null, tests };
  }

  async function* inputLines() {
    process.stdin.setEncoding('utf8');
    let parts = [], bytes = 0, oversized = false;
    for await (const chunk of process.stdin) {
      let start = 0;
      while (start < chunk.length) {
        const newline = chunk.indexOf('\n', start);
        const end = newline < 0 ? chunk.length : newline;
        const part = chunk.slice(start, end);
        if (!oversized) {
          bytes += Buffer.byteLength(part, 'utf8');
          if (bytes > INPUT_BYTES) { oversized = true; parts = []; }
          else parts.push(part);
        }
        if (newline >= 0) {
          yield oversized ? null : parts.join('');
          parts = []; bytes = 0; oversized = false;
          start = newline + 1;
        } else break;
      }
    }
    if (oversized || parts.length) yield oversized ? null : parts.join('');
  }

  async function writeJson(value) {
    let text;
    try { text = JSON.stringify(value) + '\n'; }
    catch (_) { text = JSON.stringify(badInput(null, 'output exceeds JSON nesting limits')) + '\n'; }
    if (!process.stdout.write(text)) await once(process.stdout, 'drain');
  }

  async function check(engine) {
    for await (const line of inputLines()) {
      let result;
      if (line === null) result = badInput(null, 'input line exceeds 1 MiB');
      else {
        let item;
        try { item = JSON.parse(line); }
        catch (_) { result = badInput(null, 'invalid JSON'); }
        if (!result) {
          try { result = await checkItem(engine, item); }
          catch (error) { result = badInput(idOf(item), `could not process item: ${error.message}`); }
        }
      }
      await writeJson(result);
    }
  }

  function parseArgs(args) {
    if (!args.length || args[0] === '--help' || args[0] === '-h') return { mode: 'help' };
    const mode = args[0];
    if (mode === 'check' && args.length === 1) return { mode };
    if (!['run', 'trace'].includes(mode) || !args[1] || args[1].startsWith('--')) throw new Error('invalid command');
    const result = { mode, file: args[1], maxSteps: 10000, json: false };
    const seen = new Set();
    for (let index = 2; index < args.length; index++) {
      const option = args[index];
      if (seen.has(option)) throw new Error(`duplicate option: ${option}`);
      seen.add(option);
      if (option === '--expr' && index + 1 < args.length) result.expr = args[++index];
      else if (option === '--max-steps' && index + 1 < args.length) {
        const raw = args[++index];
        result.maxSteps = Number(raw);
        if (!/^\d+$/.test(raw) || !Number.isSafeInteger(result.maxSteps)) throw new Error('invalid --max-steps');
      } else if (option === '--json' && mode === 'trace') result.json = true;
      else throw new Error(`invalid option: ${option}`);
    }
    if (typeof result.expr !== 'string') throw new Error('missing --expr');
    return result;
  }

  const usage = 'Usage:\n  node sutra.js check < items.jsonl\n  node sutra.js run program.sutra --expr "solve [1,2,3]" [--max-steps N]\n  node sutra.js trace program.sutra --expr "solve [1,2,3]" [--json] [--max-steps N]\n';

  async function main() {
    if (Number(process.versions.node.split('.')[0]) < 20) throw new Error('Node 20+ is required');
    let args;
    try { args = parseArgs(process.argv.slice(2)); }
    catch (error) { process.stderr.write(`${error.message}\n${usage}`); process.exitCode = 2; return; }
    if (args.mode === 'help') { process.stdout.write(usage); return; }
    const engine = new Engine();
    try {
      if (args.mode === 'check') await check(engine);
      else {
        if (fs.statSync(args.file).size > INPUT_BYTES) throw new Error('program file exceeds 1 MiB');
        const program = fs.readFileSync(args.file, 'utf8');
        let result;
        try { result = await engine.request('evaluate', program, args.expr, args.maxSteps, args.mode === 'trace'); }
        catch (error) { result = { value: null, error: resourceError(error), steps: 0, initial: args.expr, trace: [] }; }
        if (result.parse_error) result = { value: null, error: `parse_error: ${result.parse_error}`, steps: 0, initial: args.expr, trace: [] };
        if (args.mode === 'run') {
          if (result.error) { process.stderr.write(result.error + '\n'); process.exitCode = 1; }
          else process.stdout.write(result.value + '\n');
        } else {
          const output = { value: result.value, error: result.error, steps: result.steps, initial: result.initial, trace: result.trace };
          if (args.json) await writeJson(output);
          else {
            process.stdout.write(`0: ${result.initial}\n`);
            for (const step of result.trace) process.stdout.write(`${step.step}: ${step.after} [${step.rule}]\n`);
            process.stdout.write(result.error ? `${result.error}\n` : `Value: ${result.value}\n`);
          }
          if (result.error) process.exitCode = 1;
        }
      }
    } finally { await engine.close(); }
  }

  process.stdout.on('error', error => {
    if (error.code === 'EPIPE') process.exit(0);
    process.stderr.write(`Output error: ${error.message}\n`); process.exit(1);
  });
  main().catch(error => { process.stderr.write(`sutra: ${error.message}\n`); process.exitCode = 1; });
})();
