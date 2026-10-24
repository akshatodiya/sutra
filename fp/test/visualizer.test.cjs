'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { spawnSync } = require('node:child_process');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const artifacts = path.join(__dirname, 'artifacts');
fs.mkdirSync(artifacts, { recursive: true });

async function main() {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
    const errors = [], network = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => { if (/^https?:/.test(request.url())) network.push(request.url()); });
    await page.goto(pathToFileURL(path.join(root, 'index.html')).href);
    await page.getByRole('heading', { name: 'The reduction', exact: true }).waitFor();

    const counter = () => page.getByTestId('step-counter').getAttribute('data-step').then(Number);
    const current = () => page.getByTestId('current-expression').innerText();
    const activeIndex = () => page.locator('.list-cell[aria-current="step"]').first().getAttribute('data-cell-index').then(Number);
    async function step() {
      const before = await counter();
      await page.getByRole('button', { name: 'Step', exact: true }).click();
      await page.waitForFunction(old => {
        const node = document.querySelector('[data-testid="step-counter"]');
        return Number(node?.dataset.step) !== old || document.querySelector('[data-testid="error-panel"]');
      }, before);
    }
    async function reset() {
      await page.getByRole('button', { name: 'Reset', exact: true }).click();
      await page.waitForFunction(() => document.querySelector('[data-testid="step-counter"]')?.dataset.step === '0');
    }
    async function example(key) {
      await page.getByRole('combobox', { name: 'Example program' }).selectOption(key);
      await page.waitForFunction(expected => document.querySelector('#example-picker')?.value === expected &&
        document.querySelector('[data-testid="step-counter"]')?.dataset.step === '0', key);
      await page.getByRole('combobox', { name: 'Playback speed' }).selectOption('40');
    }
    async function custom(program, expr, limit = '10000') {
      await page.getByRole('textbox', { name: 'Program', exact: true }).fill(program);
      await page.getByRole('textbox', { name: 'Expression', exact: true }).fill(expr);
      await page.getByRole('spinbutton', { name: 'Maximum steps' }).fill(limit);
      await reset();
    }

    assert.equal(await counter(), 0);
    assert.equal(await page.getByRole('button', { name: 'Back', exact: true }).isDisabled(), true);
    assert.equal(await page.locator('#example-picker option:not([disabled])').count(), 6);
    await step();
    const first = await current();
    const highlight = await page.getByTestId('reduced-expression').innerText();
    assert.equal(await counter(), 1);
    await step();
    await page.getByRole('button', { name: 'Back', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('[data-testid="step-counter"]')?.dataset.step === '1');
    assert.equal(await current(), first);
    assert.equal(await page.getByTestId('reduced-expression').innerText(), highlight);
    await reset();
    assert.equal(await page.getByTestId('reduced-expression').count(), 0);

    // Arrow navigation follows playback, while native editors and modifier shortcuts are left alone.
    await page.getByRole('button', { name: 'Step', exact: true }).focus();
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(50);
    assert.equal(await counter(), 0);
    await page.keyboard.press('ArrowRight');
    await page.waitForFunction(() => document.querySelector('[data-testid="step-counter"]')?.dataset.step === '1');
    const keyboardSnapshot = await current();
    await page.keyboard.press('ArrowRight');
    await page.waitForFunction(() => document.querySelector('[data-testid="step-counter"]')?.dataset.step === '2');
    await page.keyboard.press('ArrowLeft');
    await page.waitForFunction(() => document.querySelector('[data-testid="step-counter"]')?.dataset.step === '1');
    assert.equal(await current(), keyboardSnapshot);
    assert.match(await page.getByRole('status').innerText(), /Paused/);
    assert.equal(await page.getByRole('button', { name: 'Step', exact: true }).getAttribute('aria-keyshortcuts'), 'ArrowRight');
    await page.getByRole('note', { name: 'Keyboard shortcuts' }).waitFor();
    for (const locator of [
      page.getByRole('textbox', { name: 'Program', exact: true }),
      page.getByRole('textbox', { name: 'Expression', exact: true }),
      page.getByRole('spinbutton', { name: 'Maximum steps' }),
      page.getByRole('combobox', { name: 'Playback speed' }),
    ]) {
      await locator.focus();
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(35);
      assert.equal(await counter(), 1, 'An editing arrow must not advance the interpreter');
    }
    await page.getByRole('combobox', { name: 'Example program' }).focus();
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(35);
    assert.notEqual(await counter(), 2, 'A dropdown arrow must not advance the interpreter');
    await example('map'); await step();
    await page.evaluate(() => {
      for (const modifier of ['ctrlKey', 'altKey', 'metaKey', 'shiftKey']) {
        document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', [modifier]: true, bubbles: true }));
      }
      const consumed = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true });
      consumed.preventDefault(); document.body.dispatchEvent(consumed);
      const editable = document.createElement('div');
      editable.contentEditable = 'true'; editable.textContent = 'test editor';
      editable.dataset.testid = 'editable-shortcut-test'; document.body.appendChild(editable); editable.focus();
    });
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(50);
    assert.equal(await counter(), 1, 'Modified, consumed and contenteditable keys must be ignored');
    await page.getByTestId('editable-shortcut-test').evaluate(node => node.remove());
    await reset();

    // Auto-run remains interruptible and resumes the same trace.
    await page.getByRole('combobox', { name: 'Playback speed' }).selectOption('40');
    await page.getByRole('button', { name: 'Run', exact: true }).click();
    await page.waitForFunction(() => Number(document.querySelector('[data-testid="step-counter"]')?.dataset.step) >= 2);
    await page.getByRole('button', { name: 'Pause', exact: true }).click();
    const paused = await counter();
    await page.waitForTimeout(160);
    assert.equal(await counter(), paused);
    await page.getByRole('button', { name: 'Run', exact: true }).click();
    await page.getByTestId('final-value').waitFor();
    assert.equal(await page.getByTestId('final-value').innerText(), '[2, 4, 6, 8]');
    assert.equal(await page.getByRole('button', { name: 'Step', exact: true }).isDisabled(), true);
    const completedSteps = await counter();
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(50);
    assert.equal(await counter(), completedSteps);


    // All browser examples agree with the public verifier, including reduction counts.
    const expected = { map: '[2, 4, 6, 8]', filter: '[2, 4, 6]', foldl: '10', foldr: '[1, 2, 3, 4]', factorial: '120', let: '7' };
    const cliItems = [], browserSteps = [];
    for (const [key, value] of Object.entries(expected)) {
      await example(key);
      const program = await page.getByRole('textbox', { name: 'Program', exact: true }).inputValue();
      const expr = await page.getByRole('textbox', { name: 'Expression', exact: true }).inputValue();
      cliItems.push({ id: key, program, tests: [{ expr, expect: value }] });
      await page.getByRole('button', { name: 'Run', exact: true }).click();
      await page.getByTestId('final-value').waitFor({ timeout: 10000 });
      assert.equal(await page.getByTestId('final-value').innerText(), value, key);
      browserSteps.push(await counter());
    }
    const cli = spawnSync(process.execPath, [path.join(root, 'dist/sutra.js'), 'check'], {
      input: cliItems.map(item => JSON.stringify(item)).join('\n') + '\n', encoding: 'utf8', timeout: 10000,
    });
    assert.equal(cli.status, 0, cli.stderr);
    const cliRows = cli.stdout.trim().split('\n').map(JSON.parse);
    assert.ok(cliRows.every(row => row.ok));
    assert.deepEqual(browserSteps, cliRows.map(row => row.tests[0].steps));

    // List-cell identity advances rather than just displaying an unrelated animation.
    await example('map');
    for (let index = 0; index < 15 && await page.locator('.list-cell[aria-current="step"]').count() === 0; index++) await step();
    assert.equal(await activeIndex(), 0);
    for (let index = 0; index < 10 && await activeIndex() === 0; index++) await step();
    assert.equal(await activeIndex(), 1);
    const mapSnapshot = { source: await current(), counter: await counter(), cell: await activeIndex() };
    await step();
    await page.getByRole('button', { name: 'Back', exact: true }).click();
    await page.waitForFunction(count => Number(document.querySelector('[data-testid="step-counter"]')?.dataset.step) === count, mapSnapshot.counter);
    assert.equal(await current(), mapSnapshot.source);
    assert.equal(await activeIndex(), mapSnapshot.cell);
    await page.mouse.move(10, 10);
    await page.screenshot({ path: path.join(artifacts, 'visualizer-desktop.png'), fullPage: true });

    for (const key of ['foldl', 'foldr']) {
      await example(key);
      const accumulators = [], combining = [];
      let foldScreenshotSaved = false;
      for (let index = 0; index < 100 && await page.getByTestId('final-value').count() === 0; index++) {
        await step();
        if (await page.getByTestId('accumulator').count()) {
          const accumulator = await page.getByTestId('accumulator').innerText();
          accumulators.push(accumulator);
          if (key === 'foldl' && accumulator === '6' && !foldScreenshotSaved) {
            await page.mouse.move(10, 10);
            await page.screenshot({ path: path.join(artifacts, 'visualizer-fold.png'), fullPage: true });
            foldScreenshotSaved = true;
          }
        }
        if (key === 'foldr' && (await page.getByTestId('list-activity').innerText()).includes('Combining from the right')) {
          combining.push(await activeIndex());
        }
      }
      if (key === 'foldl') for (const number of ['0', '1', '3', '6', '10']) assert.ok(accumulators.includes(number), `foldl missing ${number}: ${accumulators}`);
      else {
        for (const value of ['[]', '[4]', '[3, 4]', '[2, 3, 4]', '[1, 2, 3, 4]']) assert.ok(accumulators.includes(value), `foldr missing ${value}: ${accumulators}`);
        assert.deepEqual([...new Set(combining)], [3, 2, 1, 0]);
      }
      // The accumulator, expression and cell rewind together.
      await page.getByRole('button', { name: 'Back', exact: true }).click();
      await page.getByTestId('final-value').waitFor({ state: 'hidden' });
      assert.equal(await page.getByTestId('accumulator').count(), 1);
      await step();
      assert.equal(await page.getByTestId('final-value').innerText(), expected[key]);
    }

    // Large lists keep their actual current cell in the rendered window.
    await custom('identity x = x', 'map identity (range 1 45)');
    await page.getByRole('button', { name: 'Run', exact: true }).click();
    await page.waitForFunction(() => Number(document.querySelector('.list-cell[aria-current="step"]')?.dataset.cellIndex) >= 40, null, { timeout: 12000 });
    await page.getByRole('button', { name: 'Pause', exact: true }).click();
    assert.ok(await activeIndex() >= 40);
    assert.ok(await page.locator('.list-cell').count() <= 7);
    await page.setViewportSize({ width: 390, height: 844 });
    const activeBounds = await page.locator('.list-cell[aria-current="step"]').boundingBox();
    const listBounds = await page.getByRole('list', { name: 'Input list' }).boundingBox();
    assert.ok(activeBounds.x >= listBounds.x && activeBounds.x + activeBounds.width <= listBounds.x + listBounds.width, 'Active cell is clipped on mobile');
    await page.setViewportSize({ width: 1440, height: 1100 });

    await custom('solve =', 'solve');
    await page.getByTestId('error-panel').waitFor();
    assert.match(await page.getByTestId('error-panel').innerText(), /Parse error/);
    await custom('', 'True + 1');
    await step();
    assert.match(await page.getByTestId('error-panel').innerText(), /Type error/);
    await custom('', 'head []');
    await step(); await step();
    assert.match(await page.getByTestId('error-panel').innerText(), /Runtime error/);
    await custom('', 'missing');
    await step();
    assert.match(await page.getByTestId('error-panel').innerText(), /Unbound name/);
    await custom('loop x = loop x', 'loop 1', '3');
    await page.getByRole('button', { name: 'Run', exact: true }).click();
    await page.getByTestId('error-panel').waitFor();
    assert.match(await page.getByTestId('error-panel').innerText(), /step_limit/);
    assert.equal(await counter(), 3);
    await page.getByRole('button', { name: 'Back', exact: true }).click();
    await page.getByTestId('error-panel').waitFor({ state: 'hidden' });
    assert.equal(await counter(), 2);
    await custom('', '42', '0');
    assert.equal(await page.getByTestId('final-value').innerText(), '42');
    assert.equal(await counter(), 0);
    await custom('', '1', '-1');
    assert.match(await page.getByTestId('error-panel').innerText(), /input_error/);
    await custom('', '1 + 2');
    await step();
    assert.equal(await page.getByTestId('final-value').innerText(), '3');

    await page.getByRole('spinbutton', { name: 'Maximum steps' }).fill('10000');
    await example('map');
    await step(); await step(); await step(); await step();
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'Mobile page overflows horizontally');
    await page.getByRole('button', { name: 'Step', exact: true }).click();
    await page.mouse.move(5, 5);
    await page.screenshot({ path: path.join(artifacts, 'visualizer-mobile.png'), fullPage: true });
    assert.deepEqual(errors, [], 'Browser exceptions');
    assert.deepEqual(network, [], 'The visualizer must not request a remote resource');
    console.log('PASS: file:// page, six examples and CLI parity, step/back/reset/run/pause, real list cells and both fold accumulators.');
    console.log('PASS: safe arrow shortcuts, editor/modifier guards, parse/type/runtime/unbound/step-limit states, mobile layout and no network requests.');
    console.log(`Browser screenshots: ${artifacts}`);
  } finally { await browser.close(); }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
