import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { appMotion, buildAppArt, createApp } from "./app";
import type { Bloom } from "./bloom";
import { createChoreo } from "./choreo";
import { closeMotion, footerMotion } from "./close";
import { restoreDom, snapshotDom } from "./dom-snapshot";
import { createFaq, faqMotion, lens } from "./faq";
import { features, featuresMotion } from "./features";
import { glyphs } from "./glyphs";
import { grain } from "./grain";
import { buildHorizons, buildProofHz, createHorizons } from "./horizons";
import { createHow } from "./how";
import { interactions } from "./interactions";
import { keys, securityMotion } from "./keys";
import { navMotion } from "./nav";
import { paints } from "./paint";
import { buildPricing, type Price, pricingMotion } from "./pricing";
import { horizonsMotion, proofMotion, reveals } from "./reveals";
import { createRun } from "./runtime";
import { initScenes } from "./scenes";
import { type SmoothScroll, smoothScroll } from "./smooth-scroll";
import { $, $$, $maybe, clamp, f2, isDesk, isMob } from "./utils";

/** dispatched once the script runs; layout.tsx's head script then keeps js-ready (see there) */
export const MOTION_EVENT = 'petals:motion';

// ScrollTrigger's own default, put back on cleanup (the original narrows it for the page's lifetime)
const DEFAULT_REFRESH_EVENTS = 'visibilitychange,DOMContentLoaded,load,resize';

/**
 * The original page script (reference/Voltra_Petals_Website.html), run once per mount, statements in the original
 * order. Returns a cleanup that leaves the page exactly as React rendered it, so Strict Mode's mount, unmount, mount
 * gives the same page as a single production mount.
 */
export function startPetalsMotion(): () => void {
  const doc = document, root = doc.documentElement;
  // pristine markup, taken before anything below touches the DOM
  const snapshot = snapshotDom(doc);

  /* ?still renders every chapter composed, with no motion (review captures and print) */
  const STILL = /[?&]still\b/.test(location.search);
  let REDUCE = false; try { REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { /* no matchMedia: full motion */ }
  root.classList.add('js'); if (REDUCE) root.classList.add('reduce'); if (STILL) root.classList.add('still');
  if (!root.lang) root.lang = 'en-GB'; // the artifact host supplies the root element without a language
  // gsap and ScrollTrigger are bundled from npm (3.12.5); from the CDN, ScrollTrigger registered itself on load
  gsap.registerPlugin(ScrollTrigger);
  window.dispatchEvent(new Event(MOTION_EVENT));

  const { run, dispose: disposeRun } = createRun({ reduce: REDUCE, still: STILL });
  // every tween, timeline, quickTo, ScrollTrigger and matchMedia created synchronously below is recorded here;
  // the ones created later (event handlers, ScrollTrigger callbacks, relayouts) are tracked by the run
  const ctx = gsap.context(() => {});
  const scenes: Bloom[] = []; window.__scenes = scenes;
  const APP = createApp(), PRICE: Price = {}, hz = createHorizons(), how = createHow(run, hz);
  let smooth: SmoothScroll | null = null;
  let mm: gsap.MatchMedia | null = null;

  ctx.add(() => {
    grain(doc, root);
    paints();
    const FEAT = features();
    const KEYS = keys();
    const LENS = lens();
    glyphs(APP, PRICE);
    const faq = createFaq(run);

    /* ================= responsive measurements ================= */
    function scaleBoxes() {
      $$('[data-k]').forEach(k => { const [bw] = (k.dataset.k ?? '').split('x').map(Number); const box = k.parentElement as HTMLElement; const w = box.clientWidth; let base = bw; if (k.classList.contains('app__k')) base = isDesk() ? 880 : 390; k.style.setProperty('--k', String(f2(w / base * 1000) / 1000)); if (k.classList.contains('app__k')) { k.style.setProperty('--bw', base + 'px'); k.style.setProperty('--bh', (isDesk() ? 1080 : 760) + 'px'); } });
      const ks = $maybe('.keys__k'); if (ks) { const k = isDesk() ? (ks.parentElement as HTMLElement).clientWidth / 960 : Math.min(innerWidth, 560) / 390 * 140 / 304; ks.style.setProperty('--k', String(f2(k * 1000) / 1000)); ks.style.setProperty('--ik', String(f2(1 / k * 1000) / 1000)); }
      const fa = $maybe<SVGSVGElement>('[data-features-art] svg'); if (fa) { const host = $('[data-features-art]'); const scale = isDesk() ? fa.getBoundingClientRect().width / 1280 : clamp(innerWidth / 390, 1, 1.5) * .4375; if (!isDesk()) host.style.setProperty('--fa', String(f2(scale * 1000) / 1000)); const sc = isDesk() ? host.clientWidth / 1280 : scale; host.style.setProperty('--cs', String(f2(Math.max(1, (28 / 44) / sc) * 100) / 100)); host.style.setProperty('--ts', String(f2(Math.max(1, (12 / 13) / sc) * 100) / 100)); }
    }
    function relayout() { scaleBoxes(); buildHorizons(hz); buildProofHz(hz); buildAppArt(APP); const sig = how.signature(); if (sig !== how.sig) { how.sig = sig; how.build(); how.setup(); } scenes.forEach(sc => sc.measure()); }
    function fullRelayout() { relayout(); ScrollTrigger.refresh(); buildPricing(PRICE); scenes.forEach(sc => sc.cacheTop()); }

    /* ================= choreography ================= */
    function choreograph() {
      ScrollTrigger.config({ ignoreMobileResize: true, autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load' });
      run.defer(() => ScrollTrigger.config({ autoRefreshEvents: DEFAULT_REFRESH_EVENTS }));
      const sm = smooth = smoothScroll(run);
      interactions(run, sm.lenis, FEAT, faq);
      const m = mm = gsap.matchMedia();
      const c = createChoreo(run);

      /* 06 first: its pin moves every chapter below it, so it is created (and refreshed) before them */
      const hsec = $maybe('.how');
      if (hsec) { how.setup(); c.idle(hsec); }

      navMotion(run);
      reveals(c);
      proofMotion(c);
      horizonsMotion(c, hz);
      featuresMotion(c, FEAT);
      appMotion(c, APP, m);
      securityMotion(c, KEYS);
      pricingMotion(c, PRICE);
      faqMotion(c, LENS);
      closeMotion(c, scenes);
      footerMotion(c);

      /* CSS loops only run while their chapter is on screen */
      $$('main > section').forEach(sec => { if (sec.matches('.security,.how,.pricing,.faq')) return; c.idle(sec); });
      const cacheTops = () => { scenes.forEach(sc => sc.cacheTop()); };
      ScrollTrigger.addEventListener('refresh', cacheTops);
      run.defer(() => ScrollTrigger.removeEventListener('refresh', cacheTops));
      let rz: number | undefined, lastW = innerWidth;
      addEventListener('resize', () => { run.clearTimeout(rz); rz = run.setTimeout(() => { if (Math.abs(innerWidth - lastW) < 2 && isMob()) { scenes.forEach(sc => sc.cacheTop()); return; } lastW = innerWidth; fullRelayout(); }, 180); }, { signal: run.signal });
      if (doc.fonts) run.then(doc.fonts.ready, fullRelayout);
      afterLoad(fullRelayout);
    }

    // the original script ran before the window's load event; a component can mount after it
    function afterLoad(fn: () => void) {
      if (doc.readyState === 'complete') run.setTimeout(fn, 0);
      else addEventListener('load', fn, { signal: run.signal });
    }

    /* ================= boot ================= */
    // the original waits for DOMContentLoaded when still parsing; a mounted component always has the parsed page
    scaleBoxes(); buildHorizons(hz); buildProofHz(hz); buildAppArt(APP); how.sig = how.signature(); how.build(); buildPricing(PRICE);
    initScenes(run, scenes);
    if (!STILL) {
      /* below-the-fold reveals may start hidden only from here, once the script is running */
      root.classList.add('js-ready');
      try { choreograph(); } catch (e) { console.error(e); root.classList.remove('js-ready'); }
    } else { interactions(run, null, FEAT, faq); let rz: number | undefined; addEventListener('resize', () => { run.clearTimeout(rz); rz = run.setTimeout(() => { relayout(); buildPricing(PRICE); }, 160); }, { signal: run.signal }); if (doc.fonts) run.then(doc.fonts.ready, () => { relayout(); buildPricing(PRICE); }); }
  });

  return () => {
    // listeners, timeouts, frames (the scene loop), ScrollTrigger listeners and config, and the animations created after boot
    disposeRun();
    // Lenis (its ticker hook, lag smoothing, listeners and html classes)
    if (smooth) smooth.dispose();
    // the how timeline and pin (rebuilt by relayouts, outside any context)
    how.dispose();
    // matchMedia contexts (their triggers and sets), then every recorded tween/timeline/ScrollTrigger
    if (mm) mm.revert();
    ctx.revert();
    if (window.__scenes === scenes) delete window.__scenes;
    // art, layers, canvases, sprite gradients, split title, text, inline styles, attributes, root classes and --grain back to the server markup
    restoreDom(snapshot);
  };
}
