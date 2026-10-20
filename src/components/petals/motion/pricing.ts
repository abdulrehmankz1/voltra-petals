import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Choreo } from "./choreo";
import { arcD, ellipse, petalD, sv } from "./paint";
import type { Run } from "./runtime";
import { $$, $maybe, clamp, EZ, f2, isDesk } from "./utils";

/* ================= 07 pricing: rings, aura and the ghost bloom behind Plus ================= */
/** the original's PRICE: the art is rebuilt by every buildPricing(); glyphs() adds the Plus petal once */
export type Price = {
  rings?: SVGPathElement[]; cons?: SVGPathElement;
  aura?: HTMLDivElement; bloom?: HTMLDivElement; glint?: HTMLDivElement;
  petal?: SVGGElement;
};

export function buildPricing(PRICE: Price): void {
  const svg = $maybe<SVGSVGElement>('[data-pricing-art]'), sec = $maybe('.pricing'), plus = $maybe('.plan--plus'); if (!svg || !sec || !plus) return;
  svg.textContent = '';
  $$('.p-lyr', sec).forEach(n => n.remove());
  const sr = sec.getBoundingClientRect(), pr = plus.getBoundingClientRect();
  const cx = pr.left - sr.left + pr.width / 2, cy = pr.top - sr.top + pr.height / 2;
  const k = isDesk() ? clamp(sr.width / 1440, .7, 1.2) : .62;
  svg.setAttribute('viewBox', `0 0 ${f2(sr.width)} ${f2(sr.height)}`);
  svg.style.cssText = `width:${f2(sr.width)}px;height:${f2(sr.height)}px`;
  const far = sv('g', { class: 'p-far' }, svg);
  PRICE.rings = [[300, .12], [420, .07]].map(([r, a]) => sv('path', { d: arcD(cx, cy, r * k, 180, 360), fill: 'none', stroke: '#2F6BFF', 'stroke-opacity': a, 'vector-effect': 'non-scaling-stroke' }, far));
  PRICE.cons = sv('path', { d: arcD(cx, cy, 360 * k, 180, 360), fill: 'none', stroke: '#2F6BFF', 'stroke-opacity': .22, 'stroke-dasharray': '3 7', 'vector-effect': 'non-scaling-stroke' }, far);
  /* aura, ghost bloom and glint each live on their own layer: the compositor breathes, turns and pulses them */
  let at: Element = svg;
  const lyr = (cls: string, x: number, y: number, w: number, h: number) => { const d = document.createElement('div'); d.className = 'p-lyr ' + cls; d.setAttribute('aria-hidden', 'true'); d.style.cssText = `left:${f2(x - w / 2)}px;top:${f2(y - h / 2)}px;width:${f2(w)}px;height:${f2(h)}px`; at.after(d); at = d; return d; };
  PRICE.aura = lyr('p-auraw', cx, cy + 16 * k, 880 * k, 744 * k);
  ellipse(sv('svg', { viewBox: '-1 -1 2 2', preserveAspectRatio: 'none', focusable: 'false' }, PRICE.aura), 0, 0, 1, 1, 'url(#rg-aura)');
  const R = 360 * k + 4;
  PRICE.bloom = lyr('p-bloomw', cx, cy, 2 * R, 2 * R);
  const bs = sv('svg', { viewBox: `${f2(-R)} ${f2(-R)} ${f2(2 * R)} ${f2(2 * R)}`, focusable: 'false' }, PRICE.bloom);
  for (let i = 0; i < 6; i++) sv('path', { d: petalD(360 * k), transform: `rotate(${-90 + 60 * i})`, fill: '#4F7DFF', 'fill-opacity': .05, stroke: '#2F6BFF', 'stroke-opacity': i === 0 ? .34 : i === 3 ? .06 : .18, 'vector-effect': 'non-scaling-stroke' }, bs);
  PRICE.glint = lyr('p-glintw', cx, cy - 360 * k, 52, 52);
  PRICE.glint.appendChild(document.createElement('i'));
}

/* ================= interactions: billing toggle (monthly $0, $6, $18; yearly $0, $5, $15 a month, billed yearly) ================= */
export function billing(run: Run): void {
  const { reduce, signal } = run;
  const bill = $maybe('[data-billing]');
  // what the original kept as `el._sw`: the swap still in flight on a price
  const swaps = new WeakMap<HTMLElement, gsap.core.Timeline>();
  if (bill) bill.addEventListener('change', () => {
    const checked = bill.querySelector<HTMLInputElement>('input:checked');
    const y = (checked as HTMLInputElement).value === 'y'; bill.classList.toggle('is-y', y);
    const note = $maybe('[data-billing-note]'); if (note) note.textContent = (y ? note.dataset.y : note.dataset.m) ?? null;
    /* every change swaps toward the option now checked: a swap still in flight is cancelled first, so quick
       toggling can never leave yearly prices under Monthly (or the reverse) */
    const swap = (el: HTMLElement, v: string | undefined, out: gsap.TweenVars, back: gsap.TweenVars) => {
      const sw = swaps.get(el); if (sw) { sw.kill(); swaps.delete(el); }
      if (reduce) { el.textContent = v ?? null; return; }
      if (el.textContent === v) { run.track(gsap.to(el, { yPercent: 0, opacity: 1, duration: .3, ease: EZ.soft, overwrite: true })); return; }
      swaps.set(el, run.track(gsap.timeline({ onComplete: () => { swaps.delete(el); } }).to(el, out).add(() => { el.textContent = v ?? null; }).to(el, back)));
    };
    $$('.price__num').forEach((n, i) => swap(n, y ? n.dataset.y : n.dataset.m, { yPercent: -110, opacity: 0, duration: .26, ease: 'power2.in', delay: i * .05 }, { startAt: { yPercent: 110 }, yPercent: 0, opacity: 1, duration: .7, ease: EZ.expo }));
    $$('.price__per').forEach(p => swap(p, y ? p.dataset.y : p.dataset.m, { opacity: 0, duration: .2 }, { opacity: 1, duration: .5, ease: EZ.soft }));
  }, { signal });
}

/* ================= choreography: 07 pricing, Plus rises first, Free and Pro open around it ================= */
export function pricingMotion(c: Choreo, PRICE: Price): void {
  const { run, once, idle } = c, { reduce } = run;
  const E = EZ.expo, Q = EZ.quint, S = EZ.soft, SP = 'back.out(2.2)';
  const psec = $maybe('.pricing');
  if (psec) {
    if (!reduce) {
      const plans = { free: $maybe('.plan--free'), plus: $maybe('.plan--plus'), pro: $maybe('.plan--pro') };
      const tl = gsap.timeline({ scrollTrigger: once($maybe('.plans', psec), 'top 78%') });
      tl.fromTo(plans.plus, { y: 48, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0, ease: Q }, 0)
        .fromTo([plans.free, plans.pro], { y: 64, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: Q, stagger: .06 }, .15)
        .fromTo($$('.ticks li', psec), { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: .4, ease: S, stagger: .03 }, .7)
        .fromTo($$('.plan__rule', psec), { scaleX: 0 }, { scaleX: 1, duration: .8, ease: E, stagger: .06 }, .5)
        .fromTo($$('.pg .pt__g', psec), { scale: 0, svgOrigin: '0 0' }, { scale: 1, duration: .8, ease: E, stagger: .05 }, .5);
      /* the art is read when the chapter arrives, so it is whichever buildPricing() drew last */
      const art = () => {
        const rings = PRICE.rings, cons = PRICE.cons; if (!rings || !cons) return;
        const paths = [...rings, cons], lens = paths.map(p => p.getTotalLength());
        paths.forEach((p, i) => run.track(gsap.fromTo(p, { strokeDasharray: lens[i], strokeDashoffset: lens[i] }, { strokeDashoffset: 0, duration: 1.6, ease: E, delay: .2 + i * .1, onComplete: () => { if (p === PRICE.cons) gsap.set(p, { strokeDasharray: '3 7', strokeDashoffset: 0 }); } })));
        run.track(gsap.fromTo(PRICE.bloom ?? null, { scale: .96, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.6, ease: S }));
        run.track(gsap.fromTo(PRICE.aura ?? null, { opacity: 0 }, { opacity: 1, duration: 1.4, ease: S, delay: .4 }));
        run.track(gsap.fromTo(PRICE.glint ?? null, { scale: 0 }, { scale: 1, duration: .5, ease: SP, delay: 1.4 }));
      };
      ScrollTrigger.create({ trigger: psec, start: 'top 70%', once: true, onEnter: art });
      if (PRICE.petal) gsap.fromTo(PRICE.petal, { y: 30 }, { y: -30, ease: 'none', scrollTrigger: { trigger: plans.plus, start: 'top bottom', end: 'bottom top', scrub: true } });
    }
    idle(psec);
  }
}
