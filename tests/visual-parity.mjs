#!/usr/bin/env node
// Visual parity: original reference/Voltra_Petals_Website.html vs the Next.js port, shot by shot.
// Both pages run in identical browser contexts with a frozen, manually advanced clock (Playwright clock API),
// a seeded Math.random, a fixed 16 ms rAF grid, no pointer, the same scroll walk and the same settle time, so any
// pixel difference is a real rendering/behaviour difference. See tests/README-visual-parity.md.
//
// Usage:
//   node tests/visual-parity.mjs [--base http://localhost:3502] [--reference <url>] [--out tests/out/visual-parity]
//        [--viewports 1440x900,390x844] [--reduced-motion] [--self-check]
//        [--max-ratio 0.001] [--threshold 0.1] [--settle 2500] [--only hero-top,faq]
// Debug env: VP_EVAL='<js expression>' prints its value on each page before every shot; VP_ARGS adds Chromium flags.
// Exit: 0 all shots within --max-ratio, 1 a shot exceeds it, 2 a page failed to load (CDN/font/network) or crashed.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// ---------- CLI ----------
const argv = process.argv.slice(2);
const flag = (n) => argv.includes(n);
const opt = (n, d) => { const i = argv.indexOf(n); return i > -1 && argv[i + 1] !== undefined ? argv[i + 1] : d; };
const REF_URL = opt('--reference', pathToFileURL(path.join(ROOT, 'reference', 'Voltra_Petals_Website.html')).href); // any URL with the same markup
const SELF = flag('--self-check');
const BASE = SELF ? REF_URL : opt('--base', 'http://localhost:3502');
const RM = flag('--reduced-motion');
const OUT = path.resolve(ROOT, opt('--out', path.join('tests', 'out', 'visual-parity', `${SELF ? 'self' : 'port'}-${RM ? 'rm' : 'motion'}`)));
const MAX_RATIO = Number(opt('--max-ratio', '0.001')); // 0.1 % of pixels
const THRESHOLD = Number(opt('--threshold', '0.1')); // pixelmatch per-pixel colour threshold
const SETTLE = Number(opt('--settle', '2500')); // virtual ms after reaching each scroll position
const ONLY = opt('--only', '') ? new Set(opt('--only', '').split(',')) : null;
const VIEWPORTS = opt('--viewports', '1440x900,390x844').split(',').map((s) => {
  const [w, h] = s.toLowerCase().split('x').map(Number);
  return { w, h, mobile: w < 900 };
});
if (flag('--help') || VIEWPORTS.some((v) => !v.w || !v.h)) {
  console.log('usage: node tests/visual-parity.mjs [--base <url>] [--reference <url>] [--out dir] [--viewports 1440x900,390x844] [--reduced-motion] [--self-check] [--max-ratio 0.001] [--threshold 0.1] [--settle 2500] [--only ids]');
  process.exit(flag('--help') ? 0 : 2);
}

// ---------- determinism constants ----------
const T0 = new Date('2026-01-01T00:00:00Z').getTime(); // virtual epoch for Date.now / performance.now / rAF
const LOAD_T = 1000; // the clock is paused at T0 + LOAD_T while the page loads (scripts see this as "now")
const BOOT_MAX = 6000; // virtual ms allowed for the boot signal (html.js-ready + the scene canvases built, see openPage)
const INTRO_SHOT = 1500; // virtual ms after load for the mid-intro shot (hero bloom opening: heart spring 1.4-2.0 s, flare 1.5 s)
const INTRO_SETTLE = 4500; // virtual ms after the intro shot; Bloom.intro() is 4200 ms from play(now + 120) at boot
const STEP_PX = 0.5; // scroll walk step, fraction of viewport height
const STEP_MS = 100; // virtual ms per scroll step
const CSS_LOOP_T = 1500; // infinite CSS animations are paused at this phase (ms) on both pages
const SEED = 0x9E3779B9;

// Seeded Math.random, installed before any page script runs. Consumers in the Petals script: the Bloom scene motes
// (7 per scene, drawn in the constructor and re-drawn when a mote wraps). The grain uses its own fixed LCG (seed 7),
// so it needs nothing. The Bloom constructor calls cv.getContext('2d') on the [data-scene] canvas right before it draws
// the motes, so getContext on such a canvas re-seeds Math.random from the scene kind: the motes then do not depend on
// how many Math.random calls the framework (React/Next) made before the scene was built. window.__vpSeed(n) re-seeds
// both pages at the same virtual instant after boot, for the motes that wrap later.
const INIT_SCRIPT = `(() => {
  let s = ${SEED};
  const rnd = function () { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  Math.random = rnd;
  Object.defineProperty(window, '__vpSeed', { value: (n) => { s = n | 0; }, enumerable: false });
  const gc = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, opts) {
    const k = this.getAttribute && this.getAttribute('data-scene');
    if (k) { let h = ${SEED}; for (let i = 0; i < k.length; i++) h = Math.imul(h ^ k.charCodeAt(i), 16777619); s = h | 0; }
    return gc.call(this, type, opts);
  };
})();`;

// Runs after the clock's own init script. The fake performance.now and the fake rAF grid both carry the real ms
// that elapsed before install(), which varies with machine load, so frames landed on different virtual times run to
// run. Re-base performance.now on the fake Date.now and drive rAF from fake setTimeout on a fixed 16 ms grid.
// (The Bloom scenes read performance.now() for play()/frame time; GSAP's ticker and Lenis run off this rAF.)
const PERF_SCRIPT = `(() => {
  const T0 = ${T0};
  performance.now = () => Date.now() - T0;
  let queue = [], armed = false, seq = 0;
  const flush = () => {
    armed = false; const q = queue; queue = []; const t = performance.now();
    for (const [, cb] of q) { try { cb(t); } catch (e) { setTimeout(() => { throw e; }); } }
  };
  window.requestAnimationFrame = (cb) => {
    const h = ++seq; queue.push([h, cb]);
    if (!armed) { armed = true; setTimeout(flush, 16 - ((Date.now() - T0) % 16)); }
    return h;
  };
  window.cancelAnimationFrame = (h) => { queue = queue.filter((q) => q[0] !== h); };
})();`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- page lifecycle ----------
async function openPage(browser, url, vp) {
  const ctx = await browser.newContext({
    viewport: { width: vp.w, height: vp.h }, screen: { width: vp.w, height: vp.h },
    deviceScaleFactor: 1, isMobile: vp.mobile, hasTouch: vp.mobile,
    reducedMotion: RM ? 'reduce' : 'no-preference', colorScheme: 'dark',
    locale: 'en-GB', timezoneId: 'UTC',
  });
  const page = await ctx.newPage();
  const problems = [];
  page.on('requestfailed', (r) => problems.push(`request failed: ${r.url().slice(0, 120)} (${r.failure()?.errorText})`));
  page.on('response', (r) => { if (r.status() >= 400) problems.push(`HTTP ${r.status()}: ${r.url().slice(0, 120)}`); });
  page.on('pageerror', (e) => problems.push(`pageerror: ${String(e.message).slice(0, 200)}`));
  await page.addInitScript(INIT_SCRIPT);
  // Freeze time before navigation: from here on, time only moves through runFor().
  await page.clock.install({ time: T0 });
  await page.clock.pauseAt(T0 + LOAD_T);
  // Deterministic performance.now/rAF on top of the fake clock (see PERF_SCRIPT).
  await page.addInitScript(PERF_SCRIPT);
  await page.goto(url, { waitUntil: 'load', timeout: 90000 });
  try { await page.waitForLoadState('networkidle', { timeout: 30000 }); } catch { problems.push('network did not go idle in 30 s'); }
  // fonts.ready is a real promise (network), not a timer. The original runs fullRelayout() when it resolves.
  await page.evaluate(() => document.fonts.ready);
  const health = await page.evaluate(() => ({
    // /urbanist/i also accepts a self-hosted next/font face ("__Urbanist_xxxx") should the port switch to one.
    urbanist: [...document.fonts].some((f) => /urbanist/i.test(f.family) && f.status === 'loaded'),
    libs: { gsap: !!window.gsap, ScrollTrigger: !!window.ScrollTrigger, Lenis: !!window.Lenis },
  }));
  const fatal = [];
  if (!health.urbanist) fatal.push('Urbanist web font did not load (Google Fonts unreachable?)');
  // The reference loads GSAP/ScrollTrigger/Lenis from cdnjs/jsdelivr; without them it silently runs its no-GSAP path.
  if (url === REF_URL && url.startsWith('file:') && !(health.libs.gsap && health.libs.ScrollTrigger && health.libs.Lenis)) fatal.push(`reference CDN libraries missing: ${JSON.stringify(health.libs)}`);
  for (const p of problems) if (/cdnjs|jsdelivr|fonts\.g|_next\/static/.test(p)) fatal.push(p);

  // Boot: the original's boot() (at DOMContentLoaded, motion and reduced motion alike) builds the art, constructs one
  // Bloom per [data-scene] canvas (each inserts a .bloom-ghost sibling), calls hero.play(now + 120) and, with GSAP
  // present, adds html.js-ready. js-ready alone is no proof on the port (a root script may add it before hydration),
  // so both are required. A port whose motion script is missing never boots; that is recorded.
  let booted = false, t = 0;
  while (t < BOOT_MAX) {
    await page.clock.runFor(100); t += 100;
    if (await page.evaluate(() => document.documentElement.classList.contains('js-ready')
      && document.querySelectorAll('canvas[data-scene]').length > 0
      && document.querySelectorAll('.bloom-ghost').length >= document.querySelectorAll('canvas[data-scene]').length)) { booted = true; break; }
  }
  return { ctx, page, problems, fatal, booted, bootMs: booted ? t : null, elapsed: t };
}

// Same virtual instant on both pages and re-seeded Math.random. The grain tile is deterministic (fixed LCG), so it is
// left alone; a hash of --grain is recorded so a port that generates it differently shows up in the notes.
async function syncPages(pages, elapsed) {
  const target = Math.max(...elapsed);
  await Promise.all(pages.map((p, i) => (target > elapsed[i] ? p.clock.runFor(target - elapsed[i]) : null)));
  return Promise.all(pages.map((p) => p.evaluate((seed) => {
    window.__vpSeed(seed);
    const root = document.documentElement, g = root.style.getPropertyValue('--grain');
    let h = 0; for (let i = 0; i < g.length; i++) h = (Math.imul(h, 31) + g.charCodeAt(i)) | 0;
    return { grain: g ? `${g.length}:${(h >>> 0).toString(16)}` : null, js: root.classList.contains('js'), jsReady: root.classList.contains('js-ready'),
      reduce: root.classList.contains('reduce'), scenes: document.querySelectorAll('.bloom-ghost').length };
  }, SEED + 1)));
}

// Scroll positions derived from the reference layout (absolute values, reused unchanged on the target).
async function measurePositions(page, vp) {
  return page.evaluate(({ vh }) => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const top = (sel) => { const el = document.querySelector(sel); return el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : null; };
    const height = (sel) => { const el = document.querySelector(sel); return el ? el.offsetHeight : 0; };
    const max = document.documentElement.scrollHeight - window.innerHeight;
    // Pinned chapters: only 06 how (.how__pin, desktop >= 1024 px, horizontal layout, +=150 %); none in reduced motion.
    const pins = (window.ScrollTrigger ? window.ScrollTrigger.getAll() : []).filter((s) => s.pin)
      .map((s) => ({ id: s.pin.closest('section')?.id || s.pin.className, start: Math.round(s.start), end: Math.round(s.end) }));
    const pin = (id) => pins.find((p) => p.id === id);
    const shots = [];
    const add = (id, y, note) => { if (y !== null && !Number.isNaN(y)) shots.push({ id, y: Math.max(0, Math.min(max, Math.round(y))), note }); };
    // 01 hero (dawn canvas, scroll-driven prog = -top / hero height)
    add('hero-top', 0, 'hero + nav, intro settled');
    add('hero-exit', height('.hero') * 0.5, 'hero scrolled 50 % (bloom parallax, nav solid/hidden)');
    // 02 proof (reveal once at top 82 %, count-up, horizon scrub)
    const pr = top('.proof');
    add('proof-in', pr - vh * 0.75, 'proof top at 75 % vh (labels/stats/count-up fired)');
    add('proof', pr, 'proof top at 0');
    // 03 features (reveal at top 62 %, rows toggle the active feature at top/bottom 55 %)
    const ft = top('.features');
    add('features-in', ft - vh * 0.5, 'features top at 50 % vh (reveal)');
    add('features', ft, 'features top');
    add('features-list', top('.flist') - vh * 0.3, 'feature list at 30 % vh (active row)');
    add('features-b', ft + height('.features') - vh, 'features bottom at viewport bottom (last row active)');
    // 04 app (.app__stage scrub top 88 % -> top 22 %)
    const st = top('.app__stage');
    add('app', top('.app'), 'app top');
    add('app-stage-mid', st - vh * 0.55, 'app stage at 55 % vh (scrub mid)');
    add('app-stage', st - vh * 0.2, 'app stage at 20 % vh (scrub end)');
    add('app-b', top('.app') + height('.app') - vh, 'app bottom (benefits, bubbles)');
    // 05 security (keys timeline at top 72 %, then the is-looping CSS loop)
    add('security', top('.security'), 'security top');
    add('keys', top('.keys') - vh * 0.3, 'keys at 30 % vh (assembled, looping)');
    // 06 how: pinned stem/bloom scrub on desktop, plain scrub on the steps otherwise
    const hp = pin('how');
    if (hp) { add('how-in', hp.start - vh * 0.5, 'how rising (stem starts at top 55 %)'); for (const p of [0.1, 0.4, 0.7, 1]) add(`how-${Math.round(p * 100)}`, hp.start + (hp.end - hp.start) * p, `how pin ${p * 100}%`); }
    else { add('how', top('.how'), 'how top'); add('steps-mid', top('.steps') - vh * 0.5, 'steps at 50 % vh (scrub)'); add('steps', top('.steps') + height('.steps') - vh * 0.6, 'steps bottom at 60 % vh (scrub end)'); }
    // 07 pricing (plans timeline at top 78 %, plus-plan petal parallax)
    add('pricing', top('.pricing'), 'pricing top');
    add('plans', top('.plans') - vh * 0.15, 'plan cards at 15 % vh');
    // 08 faq (lens at top 82 %, items at top 85 %)
    add('faq', top('.faq'), 'faq top');
    add('faq-list', top('[data-faq]') - vh * 0.3, 'faq list at 30 % vh');
    // 09 close (bloom plays at top 70 %, words at top 62 %)
    const ct = top('.close');
    add('close-in', ct - vh * 0.5, 'close top at 50 % vh (bloom playing, words rising)');
    add('close', ct, 'close top');
    // 10 footer
    add('footer', max, 'bottom of page (.footer)');
    // keep walk order monotonic and ids unique
    shots.sort((a, b) => a.y - b.y);
    const uniq = [];
    for (const s of shots) {
      const prev = uniq[uniq.length - 1];
      if (prev && prev.y === s.y) prev.note += `; same position as ${s.id}`; else uniq.push(s);
    }
    return { shots: uniq, pins, max, height: document.documentElement.scrollHeight };
  }, { vh: vp.h });
}

// Scroll the way a user's native scroll does: window.scrollTo (instant) in steps, which Lenis picks up through its
// native-scroll listener (it resyncs animatedScroll and emits to ScrollTrigger), then advance virtual time.
async function scrollTo(page, y, vp) {
  for (;;) {
    const cur = await page.evaluate(() => Math.round(window.scrollY));
    if (Math.abs(cur - y) <= 1) break;
    const step = Math.round(vp.h * STEP_PX);
    const next = cur < y ? Math.min(y, cur + step) : Math.max(y, cur - step);
    // Wait for the real scroll event so ScrollTrigger/Lenis see it before virtual time moves (raced with a real timeout).
    await Promise.race([
      page.evaluate((n) => new Promise((res) => {
        window.addEventListener('scroll', () => res(), { once: true });
        window.scrollTo({ top: n, behavior: 'instant' });
      }), next),
      sleep(1000),
    ]);
    await page.clock.runFor(STEP_MS);
    const after = await page.evaluate(() => Math.round(window.scrollY));
    if (after === cur) break; // cannot scroll further (shorter document)
  }
  await page.clock.runFor(SETTLE);
}

// CSS animations/transitions run on real time, which the clock cannot freeze: finish the finite ones and pin
// the infinite loops (plan breath, vault pulse, ...) to one fixed phase, identically on both pages.
async function freezeCss(page) {
  await page.evaluate((loopT) => {
    for (const a of document.getAnimations()) {
      const timing = a.effect && a.effect.getComputedTiming ? a.effect.getComputedTiming() : null;
      if (timing && timing.iterations === Infinity) { a.pause(); a.currentTime = loopT; }
      else { try { a.finish(); } catch { a.cancel(); } }
    }
  }, CSS_LOOP_T);
}

// Composited layers (will-change, GSAP force3D) keep the raster offset of the moment they were first rasterised,
// which depends on real frame timing, so fractional transforms rasterise text differently run to run. Re-create
// those layers at their final position: drop will-change for a few real frames, then restore it, before the shot.
async function rerasterLayers(page) {
  await page.evaluate(() => {
    window.__vpWc = [];
    for (const el of document.querySelectorAll('*')) {
      if (getComputedStyle(el).willChange !== 'auto') { window.__vpWc.push([el, el.style.willChange]); el.style.willChange = 'auto'; }
    }
  });
  await sleep(120);
  await page.evaluate(() => { for (const [el, v] of window.__vpWc) el.style.willChange = v; delete window.__vpWc; });
  await sleep(120);
}

async function shoot(page, file) {
  await freezeCss(page);
  await rerasterLayers(page);
  if (process.env.VP_EVAL) console.log(path.relative(OUT, file).replace(/\\/g, '/'), JSON.stringify(await page.evaluate(process.env.VP_EVAL)));
  const buf = await page.screenshot({ path: file, animations: 'allow', caret: 'hide', scale: 'css' });
  return PNG.sync.read(buf);
}

function compare(a, b, diffFile) {
  const { width, height } = a;
  if (b.width !== width || b.height !== height) return { ratio: 1, pixels: width * height, note: `size ${width}x${height} vs ${b.width}x${b.height}` };
  const diff = new PNG({ width, height });
  const pixels = pixelmatch(a.data, b.data, diff.data, width, height, { threshold: THRESHOLD });
  fs.writeFileSync(diffFile, PNG.sync.write(diff));
  return { ratio: pixels / (width * height), pixels };
}

// ---------- run ----------
const t0 = Date.now();
fs.mkdirSync(OUT, { recursive: true });
// One raster thread: with several, tile raster order varies and glyph anti-aliasing differed by a few pixels run to run.
const browser = await chromium.launch({ args: ['--num-raster-threads=1', ...(process.env.VP_ARGS || '').split(' ').filter(Boolean)] });
const runs = [];
let fatalAny = false;
await Promise.all(VIEWPORTS.map(async (vp) => {
  const tag = `${vp.w}x${vp.h}${RM ? '-rm' : ''}`;
  const dir = path.join(OUT, tag);
  fs.mkdirSync(dir, { recursive: true });
  const run = { viewport: tag, reference: REF_URL, target: BASE, shots: [], notes: [] };
  runs.push(run);
  const [ref, tgt] = await Promise.all([openPage(browser, REF_URL, vp), openPage(browser, BASE, vp)]);
  run.boot = { reference: ref.bootMs, target: tgt.bootMs };
  if (!ref.booted) run.notes.push('reference did not boot (no js-ready + Bloom scenes)');
  if (!tgt.booted) run.notes.push('target did not boot (no js-ready + Bloom scenes): motion/art script missing or broken');
  run.problems = { reference: [...new Set(ref.problems)], target: [...new Set(tgt.problems)] };
  if (ref.fatal.length || tgt.fatal.length) {
    fatalAny = true;
    run.fatal = { reference: [...new Set(ref.fatal)], target: [...new Set(tgt.fatal)] };
    run.notes.push('FATAL: a page failed to load fully; comparison skipped');
    await Promise.all([ref.ctx.close(), tgt.ctx.close()]);
    return;
  }
  const pages = [ref.page, tgt.page];
  const [rs, ts] = await syncPages(pages, [ref.elapsed, tgt.elapsed]);
  run.state = { reference: rs, target: ts };
  if (rs.grain !== ts.grain) run.notes.push(`--grain tile differs: reference ${rs.grain}, target ${ts.grain}`);
  if (rs.scenes !== ts.scenes) run.notes.push(`Bloom scenes (.bloom-ghost): reference ${rs.scenes}, target ${ts.scenes}`);
  const elapsed = Math.max(ref.elapsed, tgt.elapsed);
  const record = (id, y, note, c, files, ry, ty) => {
    const row = { id, y, note, scrollY: { reference: ry, target: ty }, ratio: c.ratio, pixels: c.pixels, pass: c.ratio <= MAX_RATIO,
      files: Object.fromEntries(Object.entries(files).map(([k, f]) => [k, path.relative(OUT, f).replace(/\\/g, '/')])) };
    if (c.note) row.note += `; ${c.note}`;
    if (ry !== ty) row.note += `; scroll mismatch ${ry} vs ${ty}`;
    run.shots.push(row);
    console.log(`${tag.padEnd(12)} ${id.padEnd(16)} y=${String(y).padStart(6)}  ${(c.ratio * 100).toFixed(4).padStart(9)}%  ${row.pass ? 'ok' : 'DIFF'}`);
  };
  const shotPair = async (id, y, note) => {
    const [ry, ty] = await Promise.all(pages.map((p) => p.evaluate(() => Math.round(window.scrollY))));
    const files = { reference: path.join(dir, `${id}-ref.png`), target: path.join(dir, `${id}-target.png`), diff: path.join(dir, `${id}-diff.png`) };
    const [a, b] = await Promise.all([shoot(ref.page, files.reference), shoot(tgt.page, files.target)]);
    record(id, y, note, compare(a, b, files.diff), files, ry, ty);
  };

  // Hero intro, mid-flight (same virtual instant after load on both pages).
  if (elapsed < INTRO_SHOT) await Promise.all(pages.map((p) => p.clock.runFor(INTRO_SHOT - elapsed)));
  if (!ONLY || ONLY.has('hero-intro')) await shotPair('hero-intro', 0, `hero intro at ${Math.max(INTRO_SHOT, elapsed)} virtual ms after load`);
  await Promise.all(pages.map((p) => p.clock.runFor(INTRO_SETTLE)));

  const pos = await measurePositions(ref.page, vp);
  const tgtH = await tgt.page.evaluate(() => document.documentElement.scrollHeight);
  run.height = { reference: pos.height, target: tgtH };
  run.pins = pos.pins;
  if (pos.height !== tgtH) run.notes.push(`document height differs: reference ${pos.height}px, target ${tgtH}px (pin spacers or layout)`);
  for (const s of pos.shots) {
    if (ONLY && !ONLY.has(s.id)) continue;
    await Promise.all(pages.map((p) => scrollTo(p, s.y, vp)));
    await shotPair(s.id, s.y, s.note);
  }

  // Menu (only where the menu button is shown, < 1024 px): opened with a DOM click so no pointer ever moves.
  if (!ONLY || ONLY.has('menu-open')) {
    const visible = await ref.page.evaluate(() => { const b = document.querySelector('[data-menu-open]'); return !!b && getComputedStyle(b).display !== 'none'; });
    if (visible) {
      await Promise.all(pages.map((p) => p.evaluate(() => document.querySelector('[data-menu-open]')?.click())));
      await Promise.all(pages.map((p) => p.clock.runFor(SETTLE)));
      await shotPair('menu-open', pos.max, 'menu opened at the bottom of the page (disc wipe + links settled)');
    }
  }
  await Promise.all([ref.ctx.close(), tgt.ctx.close()]);
}));
await browser.close();

// ---------- report ----------
runs.sort((a, b) => a.viewport.localeCompare(b.viewport));
const failing = runs.flatMap((r) => r.shots.filter((s) => !s.pass).map((s) => `${r.viewport}/${s.id}`));
const summary = {
  date: new Date().toISOString(), reference: REF_URL, target: BASE, selfCheck: SELF, reducedMotion: RM,
  threshold: THRESHOLD, maxRatio: MAX_RATIO, settleMs: SETTLE, runtimeSec: Math.round((Date.now() - t0) / 1000),
  result: fatalAny ? 'ERROR' : failing.length ? 'FAIL' : 'PASS', failing, runs,
};
fs.writeFileSync(path.join(OUT, 'summary.json'), JSON.stringify(summary, null, 2));
const md = [
  `# Visual parity: ${summary.result}`, '',
  `- Reference: \`${REF_URL}\``, `- Target: \`${BASE}\`${SELF ? ' (self-check)' : ''}`,
  `- Reduced motion: ${RM}; pixelmatch threshold ${THRESHOLD}; fail above ${(MAX_RATIO * 100).toFixed(3)} % of pixels; settle ${SETTLE} virtual ms`,
  `- Run: ${summary.date}, ${summary.runtimeSec} s`, '',
];
for (const r of runs) {
  md.push(`## ${r.viewport}`, '');
  if (r.boot) md.push(`- Boot (virtual ms to js-ready + scenes): reference ${r.boot.reference ?? 'never'}, target ${r.boot.target ?? 'never'}`);
  if (r.state) md.push(`- State after boot: reference ${JSON.stringify(r.state.reference)}, target ${JSON.stringify(r.state.target)}`);
  if (r.height) md.push(`- Document height: reference ${r.height.reference}px, target ${r.height.target}px`);
  for (const n of r.notes) md.push(`- ${n}`);
  if (r.fatal) for (const [k, v] of Object.entries(r.fatal)) for (const p of v) md.push(`- ${k}: ${p}`);
  md.push('', '| Shot | scrollY | Mismatch | Pixels | Result | Note | Diff |', '|---|---:|---:|---:|---|---|---|');
  for (const s of r.shots) md.push(`| ${s.id} | ${s.y} | ${(s.ratio * 100).toFixed(4)} % | ${s.pixels} | ${s.pass ? 'PASS' : 'FAIL'} | ${s.note} | [diff](${s.files.diff}) |`);
  md.push('');
}
fs.writeFileSync(path.join(OUT, 'summary.md'), md.join('\n'));
console.log(`\n${summary.result}: ${failing.length} shot(s) over ${(MAX_RATIO * 100).toFixed(3)} %; ${summary.runtimeSec} s; report ${path.relative(ROOT, path.join(OUT, 'summary.md'))}`);
process.exit(fatalAny ? 2 : failing.length ? 1 : 0);
