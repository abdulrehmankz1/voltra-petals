import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Choreo } from "./choreo";
import { ellipse, inner, petal, petalD, sv } from "./paint";
import type { Run } from "./runtime";
import { $, $$, $maybe, EZ, f2, S32 } from "./utils";

/* ================= 08 faq: the lens window ================= */
export type Lens = {
  circles: SVGCircleElement[]; draw: SVGPathElement[]; light: SVGEllipseElement; glass: SVGPathElement;
  inner: SVGGElement[]; rim: SVGPathElement; points: SVGGElement[]; heart: SVGCircleElement;
};

export function lens(): Lens | null {
  const host = $maybe('[data-lens]'); if (!host) return null;
  /* back drawing, breathing light, glass and points, beating heart: four layers in the lens's own frame */
  const mk = (cls: string) => sv('svg', { class: cls, viewBox: '-240 -170 480 340', 'aria-hidden': 'true', focusable: 'false' }, host);
  const back = mk('l-back'), lightL = mk('l-lightL'), svg = mk('l-front'), heartL = mk('l-heartL');
  const R = 208, hw = R * S32, L = hw;
  const lensD = `M${f2(-hw)} 0A${R} ${R} 0 0 1 ${f2(hw)} 0A${R} ${R} 0 0 1 ${f2(-hw)} 0Z`;
  const defs = sv('defs', {}, svg); const cp = sv('clipPath', { id: 'lensClip' }, defs); sv('path', { d: lensD }, cp);
  const far = sv('g', { class: 'l-far' }, back);
  const circles = [[0, -R / 2], [0, R / 2]].map(([x, y]) => sv('circle', { cx: x, cy: y, r: R, fill: 'none', stroke: '#2F6BFF', 'stroke-opacity': .3, 'stroke-dasharray': '2 5', 'vector-effect': 'non-scaling-stroke' }, far));
  const draw = [0, 60, 120, 180, 240, 300].map(a => sv('path', { d: petalD(L), transform: `rotate(${a})`, fill: 'none', stroke: '#2F6BFF', 'stroke-opacity': .26, 'vector-effect': 'non-scaling-stroke' }, far));
  const light = ellipse(lightL, 0, 26, 230, 150, 'url(#rg-lenslight)', { class: 'l-light' });
  const mid = sv('g', { class: 'l-mid' }, svg);
  const glass = sv('path', { d: lensD, fill: 'url(#lg-lens)' }, mid);
  const inside = sv('g', { 'clip-path': 'url(#lensClip)' }, mid);
  const innerP = ([[60, 'ref'], [120, 'ref'], [0, 'hor'], [180, 'hor'], [240, 'mark'], [300, 'mark']] as const).map(([a, st]) => petal(inside, L, a, st));
  const rim = sv('path', { d: lensD, fill: 'none', stroke: '#2F6BFF', 'stroke-opacity': .5, 'stroke-width': 1.25, 'vector-effect': 'non-scaling-stroke' }, mid);
  const near = sv('g', { class: 'l-near' }, svg);
  const points = [[-hw, 0], [hw, 0], [0, -R / 2], [0, R / 2]].map(([x, y]) => { const g = sv('g', { transform: `translate(${f2(x)} ${f2(y)})` }, near); const s = sv('g', {}, g); sv('circle', { r: 10, fill: 'url(#rg-mote)' }, s); sv('circle', { r: 3.5, fill: '#2F6BFF' }, s); return s; });
  const heart = sv('circle', { r: 30, fill: 'url(#rg-heart)', class: 'l-heart' }, heartL);
  return { circles, draw, light, glass, inner: innerP, rim, points, heart };
}

/* ================= interactions: the accordion ================= */
export type Faq = { toggleQa(item: Element | null, force?: boolean): void };

/* faq: one answer open at a time; the layout changes once and positions glide back with transforms only */
export function createFaq(run: Run): Faq {
  const { reduce } = run;
  // what the original kept as `faq._t`: the pending refresh per accordion
  const pending = new WeakMap<Element, number>();
  function toggleQa(item: Element | null, force?: boolean): void {
    const faq = item && item.closest('[data-faq]'); if (!item || !faq) return;
    const items = $$('.qa', faq), willOpen = force === undefined ? !item.classList.contains('is-open') : force;
    if (willOpen === item.classList.contains('is-open')) return;
    const first = items.map(el => el.getBoundingClientRect().top);
    items.forEach(el => { const open = el === item ? willOpen : false; el.classList.toggle('is-open', open); $('.qa__btn', el).setAttribute('aria-expanded', String(open)); $('.qa__panel', el).hidden = !open; });
    if (!reduce) {
      items.forEach((el, i) => { const dy = first[i] - el.getBoundingClientRect().top; if (Math.abs(dy) > .5) run.track(gsap.fromTo(el, { y: dy }, { y: 0, duration: .55, ease: EZ.quint, clearProps: 'transform' })); });
      if (willOpen) run.track(gsap.fromTo(item.querySelector('.qa__panel p'), { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: .6, delay: .12, ease: EZ.expo }));
    }
    run.clearTimeout(pending.get(faq)); pending.set(faq, run.setTimeout(() => ScrollTrigger.refresh(), 620));
  }
  return { toggleQa };
}

/** faq accordion: one delegated listener on the list */
export function faqClicks(run: Run, faq: Faq): void {
  const list = $maybe('[data-faq]');
  if (list) list.addEventListener('click', e => { const btn = (e.target as Element).closest('.qa__btn'); if (btn) faq.toggleQa(btn.closest('.qa')); }, { signal: run.signal });
}

/* ================= choreography: 08 faq, the lens is built in front of you ================= */
export function faqMotion(c: Choreo, LENS: Lens | null): void {
  const { run, once, idle } = c, { reduce } = run;
  const E = EZ.expo, S = EZ.soft, SP = 'back.out(2.2)';
  const qsec = $maybe('.faq');
  if (qsec && LENS && LENS.glass) {
    if (!reduce) {
      const cl = LENS.circles.map(ci => ci.getTotalLength()), dl = LENS.draw.map(p => p.getTotalLength());
      LENS.circles.forEach((ci, i) => gsap.set(ci, { strokeDasharray: cl[i], strokeDashoffset: cl[i] }));
      LENS.draw.forEach((p, i) => gsap.set(p, { strokeDasharray: dl[i], strokeDashoffset: dl[i] }));
      const rl = LENS.rim.getTotalLength(); gsap.set(LENS.rim, { strokeDasharray: rl, strokeDashoffset: rl });
      gsap.set([LENS.glass, LENS.light], { opacity: 0 }); gsap.set(LENS.inner.map(inner), { opacity: 0, scale: .7, svgOrigin: '0 0' }); gsap.set(LENS.points, { scale: 0, svgOrigin: '0 0' }); gsap.set(LENS.heart, { scale: 0, svgOrigin: '0 0' });
      const tl = gsap.timeline({ scrollTrigger: once($maybe('[data-lens]'), 'top 82%'), onComplete: () => qsec.classList.add('is-looping') });
      tl.to(LENS.circles, { strokeDashoffset: 0, duration: 1.2, ease: E, stagger: .1 }, 0)
        .add(() => LENS.circles.forEach(ci => gsap.set(ci, { strokeDasharray: '2 5', strokeDashoffset: 0 })), 1.3)
        .to(LENS.draw, { strokeDashoffset: 0, duration: 1.0, ease: E, stagger: .08 }, .6)
        .to(LENS.points, { scale: 1, duration: .5, ease: SP, stagger: .06 }, .8)
        .to(LENS.glass, { opacity: 1, duration: .8, ease: S }, 1.0)
        .to(LENS.light, { opacity: 1, duration: 1.4, ease: S }, 1.0)
        .to(LENS.inner.map(inner), { opacity: 1, scale: 1, duration: .9, ease: E, stagger: .08 }, 1.2)
        .to(LENS.rim, { strokeDashoffset: 0, duration: 1.0, ease: E }, 1.4)
        .to(LENS.heart, { scale: 1, duration: .6, ease: SP }, 1.6);
      gsap.fromTo($$('.qa', qsec), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .8, ease: E, stagger: .06, clearProps: 'transform', scrollTrigger: once($maybe('[data-faq]'), 'top 85%') });
    }
    idle(qsec);
  }
}
