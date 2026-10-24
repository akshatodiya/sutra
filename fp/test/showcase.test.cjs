'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const url = pathToFileURL(path.join(root, 'index.html')).href;
const samples = JSON.parse(fs.readFileSync(path.join(root, 'assets/showcase.sample.json'), 'utf8'));
const live = JSON.parse(fs.readFileSync(path.join(root, 'assets/showcase.json'), 'utf8'));
const artifacts = path.join(__dirname, 'artifacts');
fs.mkdirSync(artifacts, { recursive: true });

async function main() {
  const browser = await chromium.launch({ headless: true });
  const errors = [], network = [];
  try {
    async function open(flags, viewport = { width: 1440, height: 1100 }) {
      const page = await browser.newPage({ viewport });
      page.setDefaultTimeout(7000);
      page.on('pageerror', error => errors.push(error.message));
      page.on('request', request => { if (/^https?:/.test(request.url())) network.push(request.url()); });
      if (flags !== undefined) await page.addInitScript(data => {
        Object.defineProperty(window, 'SUTRA_SHOWCASE', { get: () => data, set: () => {}, configurable: true });
      }, flags);
      await page.goto(url);
      await page.getByRole('heading', { name: 'The reduction', exact: true }).waitFor();
      return page;
    }
    async function rendered(page) {
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    }
    const modelView = async page => { await page.getByRole('button', { name: 'Model answers', exact: true }).click(); await rendered(page); };
    const playground = async page => { await page.getByRole('button', { name: 'Playground', exact: true }).click(); await rendered(page); };
    const inspect = async (page, model) => { await page.getByRole('button', { name: 'Inspect ' + model, exact: true }).click(); await rendered(page); };
    const counter = page => page.getByTestId('step-counter').getAttribute('data-step').then(Number);
    async function run(page, expected) {
      await page.getByRole('combobox', { name: 'Playback speed' }).selectOption('40');
      await rendered(page);
      await page.getByRole('button', { name: 'Run', exact: true }).click();
      await rendered(page);
      await page.getByTestId('final-value').waitFor();
      assert.equal(await page.getByTestId('final-value').innerText(), expected);
    }

    // First test the actual generated asset, so the fixture override cannot hide
    // a broken index/build connection. Real showcase data can replace it later.
    const actual = await open();
    await modelView(actual);
    assert.equal(await actual.getByRole('combobox', { name: 'Showcase task' }).locator('option').count(), live.length);
    if (live.length) assert.equal(await actual.getByTestId('showcase-expression').innerText(), live[0].expr);
    await actual.close();

    const page = await open({ entries: samples, isSample: true });
    await page.getByRole('combobox', { name: 'Example program' }).selectOption('filter');
    await rendered(page);
    await page.getByRole('combobox', { name: 'Playback speed' }).selectOption('40');
    await rendered(page);
    await modelView(page);
    await playground(page);
    assert.equal(await page.getByRole('combobox', { name: 'Example program' }).inputValue(), 'filter');
    assert.equal(await page.getByRole('combobox', { name: 'Playback speed' }).inputValue(), '40');
    await modelView(page);
    assert.match(await page.getByTestId('sample-notice').innerText(), /illustrative programs, not model results/);
    assert.equal(await page.getByTestId('model-card').count(), 3);
    assert.equal(await page.getByTestId('showcase-expression').innerText(), samples[0].expr);
    assert.equal(await page.getByTestId('showcase-expected').innerText(), '2');
    assert.deepEqual(await page.locator('[data-verdict]').evaluateAll(nodes => nodes.map(node => node.dataset.verdict)), ['wrong_answer', 'parse_error', 'pass']);
    for (const [index, answer] of samples[0].answers.entries()) {
      assert.equal(await page.getByTestId('model-card').nth(index).locator('pre code').innerText(), answer.program);
    }
    await page.mouse.move(5, 5);
    await page.screenshot({ path: path.join(artifacts, 'showcase-desktop.png'), fullPage: true });

    await inspect(page, 'base');
    assert.equal(await page.getByRole('textbox', { name: 'Program', exact: true }).inputValue(), samples[0].answers[0].program);
    assert.equal(await page.getByRole('textbox', { name: 'Expression', exact: true }).inputValue(), samples[0].expr);
    assert.equal(await counter(page), 0);
    assert.equal(await page.getByRole('combobox', { name: 'Example program' }).inputValue(), 'custom');
    assert.match(await page.getByTestId('answer-context').innerText(), /Wrong answer/);
    await run(page, '3');
    assert.match(await page.getByTestId('example-outcome').innerText(), /Does not match this example. Expected 2/);
    await modelView(page);
    await inspect(page, 'raw');
    assert.match(await page.getByTestId('error-panel').innerText(), /Parse error/);
    assert.equal(await page.getByRole('textbox', { name: 'Program', exact: true }).inputValue(), samples[0].answers[1].program);
    assert.equal(await counter(page), 0);
    await modelView(page);
    await inspect(page, 'curated');
    assert.equal(await page.getByTestId('error-panel').count(), 0);
    assert.equal(await counter(page), 0);
    await run(page, '2');
    assert.equal(await page.getByTestId('example-outcome').innerText(), 'Matches this example.');
    await page.getByRole('button', { name: 'Back', exact: true }).click();
    await rendered(page);
    assert.equal(await page.getByTestId('example-outcome').count(), 0);
    await page.getByRole('button', { name: 'Step', exact: true }).click();
    await rendered(page);
    assert.equal(await page.getByTestId('final-value').innerText(), '2');
    await page.getByRole('textbox', { name: 'Program', exact: true }).fill('solve xs = 42');
    await rendered(page);
    assert.equal(await page.getByTestId('answer-context').count(), 0, 'Edits must clear model attribution');

    await modelView(page);
    await page.getByRole('combobox', { name: 'Showcase task' }).selectOption('1');
    await rendered(page);
    assert.equal(await page.getByTestId('showcase-expression').innerText(), samples[1].expr);
    await inspect(page, 'curated');
    await page.getByRole('button', { name: 'Step', exact: true }).click();
    await rendered(page);
    assert.ok(await counter(page) > 0);
    await page.getByRole('button', { name: 'Back to model answers' }).click();
    await rendered(page);
    assert.equal(await page.getByRole('combobox', { name: 'Showcase task' }).inputValue(), '1');
    await playground(page);
    await run(page, '[3, 2, 1]');

    // Comparison view has no invisible timer or keyboard-driven reductions.
    await page.getByRole('textbox', { name: 'Program', exact: true }).fill('loop x = loop x');
    await rendered(page);
    await page.getByRole('textbox', { name: 'Expression', exact: true }).fill('loop 1');
    await rendered(page);
    await page.getByRole('button', { name: 'Run', exact: true }).click();
    await rendered(page);
    await page.waitForFunction(() => Number(document.querySelector('[data-testid="step-counter"]').dataset.step) >= 2);
    await modelView(page);
    await playground(page);
    await page.getByRole('button', { name: 'Run', exact: true }).waitFor();
    const paused = await counter(page);
    await modelView(page);
    await page.getByRole('button', { name: 'Model answers', exact: true }).focus();
    await page.keyboard.press('ArrowRight');
    // Wait across at least two timer intervals before returning.
    await page.waitForTimeout(130);
    await playground(page);
    assert.equal(await counter(page), paused);
    await page.getByRole('combobox', { name: 'Example program' }).selectOption('map');
    await rendered(page);
    await modelView(page);
    assert.equal(await page.getByRole('combobox', { name: 'Showcase task' }).inputValue(), '1', 'Example selection must preserve the dataset/task');

    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'Showcase overflows mobile');
    for (const card of await page.getByTestId('model-card').all()) {
      const bounds = await card.boundingBox();
      assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= 390);
    }
    await page.screenshot({ path: path.join(artifacts, 'showcase-mobile.png'), fullPage: true });
    await inspect(page, 'base');
    await page.getByRole('button', { name: 'Step', exact: true }).waitFor({ state: 'visible' });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'Loaded answer overflows mobile');
    await page.close();

    // Runtime data validation, every allowed badge, empty states, and text escaping.
    const verdicts = ['pass', 'parse_error', 'unbound', 'type_error', 'runtime_error', 'step_limit', 'wrong_answer'];
    const hostile = '<img src="https://example.invalid/image" onerror="window.injected=true">';
    const fixture = await open({ isSample: false, entries: [{ task: hostile, expr: '1', expect: '1', answers: verdicts.map(verdict => ({ model: verdict, program: hostile, verdict })) }] });
    await modelView(fixture);
    assert.equal(await fixture.getByTestId('sample-notice').count(), 0);
    assert.deepEqual(await fixture.locator('[data-verdict]').evaluateAll(nodes => nodes.map(node => node.dataset.verdict)), verdicts);
    assert.equal(await fixture.locator('img').count(), 0);
    assert.equal(await fixture.evaluate(() => window.injected), undefined);
    assert.equal(await fixture.getByTestId('model-card').first().locator('pre code').innerText(), hostile);
    await fixture.close();

    for (const flags of [{ entries: [], isSample: false }, { entries: [{ task: 'Empty task', expr: '1', expect: '1', answers: [] }], isSample: false }]) {
      const empty = await open(flags);
      await modelView(empty);
      assert.match(await empty.locator('.showcase-empty').innerText(), /[Nn]o model answers/);
      await empty.close();
    }
    const invalid = await open({ entries: [{ ...samples[0], answers: [{ model: 'base', program: '', verdict: 'invalid' }] }], isSample: false });
    await modelView(invalid);
    await invalid.getByRole('heading', { name: 'Could not load model answers' }).waitFor();
    await playground(invalid);
    await invalid.getByRole('button', { name: 'Step', exact: true }).click();
    await rendered(invalid);
    assert.equal(await counter(invalid), 1);
    await invalid.close();
    assert.deepEqual(errors, [], 'Browser exceptions');
    assert.deepEqual(network, [], 'Showcase must work without HTTP(S)');
    console.log('PASS: file:// data asset, two sample tasks, model cards/verdicts, exact code loading, parse errors, live example match/mismatch, task/history preservation, pause and keyboard guards.');
    console.log('PASS: mobile layout, all seven verdicts, empty/invalid data recovery, text escaping, and zero remote requests.');
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
