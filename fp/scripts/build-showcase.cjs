'use strict';

const fs = require('node:fs');
const path = require('node:path');

const verdicts = new Set(['pass', 'parse_error', 'unbound', 'type_error', 'runtime_error', 'step_limit', 'wrong_answer']);

function validate(entries) {
  if (!Array.isArray(entries)) throw new Error('Showcase must be a JSON list of tasks.');
  function string(record, key, where) {
    if (typeof record?.[key] !== 'string') throw new Error(`${where}.${key} must be a string.`);
    return record[key];
  }
  return entries.map((entry, index) => {
    const where = `tasks[${index}]`;
    const task = string(entry, 'task', where);
    const expr = string(entry, 'expr', where);
    const expect = string(entry, 'expect', where);
    if (!Array.isArray(entry.answers)) throw new Error(`${where}.answers must be a list.`);
    const answers = entry.answers.map((answer, answerIndex) => {
      const location = `${where}.answers[${answerIndex}]`;
      const model = string(answer, 'model', location);
      const program = string(answer, 'program', location);
      const verdict = string(answer, 'verdict', location);
      if (!verdicts.has(verdict)) throw new Error(`${location}.verdict is unsupported: ${verdict}`);
      return { model, program, verdict };
    });
    return { task, expr, expect, answers };
  });
}

function readShowcase(input, sample) {
  const entries = validate(JSON.parse(fs.readFileSync(input, 'utf8')));
  const fixture = validate(JSON.parse(fs.readFileSync(sample, 'utf8')));
  return { entries, isSample: JSON.stringify(entries) === JSON.stringify(fixture) };
}

function script(data) {
  // Data stays data, including source containing HTML or JavaScript-looking strings.
  const json = JSON.stringify(data).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  return '// Generated from assets/showcase.json. Run npm run build:showcase to refresh.\nwindow.SUTRA_SHOWCASE = ' + json + ';\n';
}

function writeShowcase(target, data) {
  fs.writeFileSync(target, script(data));
  console.log(`Built assets/showcase.js: ${data.entries.length} tasks${data.isSample ? ' (illustrative sample)' : ''}.`);
}

if (require.main === module) {
  try {
    const assets = path.resolve(__dirname, '..', 'assets');
    writeShowcase(path.join(assets, 'showcase.js'), readShowcase(path.join(assets, 'showcase.json'), path.join(assets, 'showcase.sample.json')));
  } catch (error) {
    console.error('Showcase build failed: ' + error.message);
    process.exitCode = 1;
  }
}

module.exports = { validate, readShowcase, script, writeShowcase };
