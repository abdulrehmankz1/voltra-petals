import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Choreo } from "./choreo";
import { inner, layer, petal, petalD, pol, ring, sv } from "./paint";
import { $, $$, $maybe, EZ } from "./utils";

/* ================= 03 features: the bloom as a specimen ================= */
const FA = [180, 120, 60, 0], FICON = ['i-spark', 'i-lock', 'i-apps', 'i-swap'];

export type Feat = {
  rings: SVGCircleElement[]; cons: SVGCircleElement; halo: SVGCircleElement;
  fps: SVGGElement[]; marks: SVGGElement[]; heart: SVGCircleElement; chips: SVGGElement[]; nums: SVGTextElement[];
  layers: { far: SVGSVGElement; glow: SVGSVGElement; mid: SVGSVGElement; near: SVGSVGElement };
  active?: number;
};

/** the original's FEAT: empty (null here) when the page has no features art */
export function features(): Feat | null {
  let FEAT: Feat | null = null;
  const host = $maybe('[data-features-art]');
  if (host) {
    const vb = '-640 -640 1280 1280';
    const far = layer(host, vb, 'f-far'), glow = layer(host, vb, 'f-glow'), mid = layer(host, vb, 'f-mid'), near = layer(host, vb, 'f-near');
    const rings = ([[420, .12], [500, .08], [580, .05]] as const).map(([r, a]) => ring(far, r, a));
    const cons = ring(far, 320, .22, { 'stroke-dasharray': '3 7' });
    const halo = sv('circle', { r: 440, fill: 'url(#rg-halo)' }, glow);
    const fps = FA.map((a, i) => { const g = sv('g', { class: 'fp' + (i ? '' : ' is-on'), transform: `rotate(${a})` }, mid); const gg = sv('g', { class: 'pt__g' }, g); sv('path', { d: petalD(320), fill: 'url(#pf-pgl)', stroke: 'url(#ps-v40)', 'vector-effect': 'non-scaling-stroke' }, gg); sv('path', { class: 'on', d: petalD(320), fill: 'url(#pf-on)', stroke: 'url(#ps-w30)', 'stroke-width': 1.25, 'vector-effect': 'non-scaling-stroke' }, gg); return g; });
    const marks = [240, 300].map(a => petal(mid, 320, a, 'mark', 'fm'));
    const heart = sv('circle', { r: 54, fill: 'url(#rg-heart)' }, mid);
    const chips = FA.map((a, i) => { const [x, y] = pol(160, a); const g = sv('g', { class: 'fchip' + (i ? '' : ' is-on'), transform: `translate(${x} ${y})` }, near); const s = sv('g', { class: 'fchip__s' }, g); const p = sv('g', { class: 'fchip__p' }, s); sv('circle', { r: 22, fill: '#fff', 'fill-opacity': .86, stroke: '#2F6BFF', 'stroke-opacity': .2, 'vector-effect': 'non-scaling-stroke' }, p); sv('circle', { class: 'on', r: 22, fill: '#fff' }, p); sv('use', { href: '#' + FICON[i], x: -11, y: -11, width: 22, height: 22, class: 'fchip__ic' }, p); return g; });
    const nums = FA.map((a, i) => { const [x, y] = pol(354, a); const g = sv('g', { transform: `translate(${x} ${y})` }, near); const s = sv('g', { class: 'fnum__s' }, g); const t = sv('text', { class: 'fnum' + (i ? '' : ' is-on'), 'text-anchor': 'middle', dy: '.36em' }, s); t.textContent = '0' + (i + 1); return t; });
    FEAT = { rings, cons, halo, fps, marks, heart, chips, nums, layers: { far, glow, mid, near } };
  }
  /* small keys on the mobile list: the feature's petal in its place in the bloom */
  $$<SVGSVGElement>('[data-key-glyph]').forEach(svg => { const k = +(svg.dataset.keyGlyph ?? ''); const g = sv('g', { class: 'kg' }, svg); for (const d of [0, 60, 120, 180, 240, 300]) { const on = d === FA[k], mk = d >= 240; sv('path', { d: petalD(15), transform: `rotate(${d})`, fill: on || mk ? '#2F6BFF' : '#050608', 'fill-opacity': on ? 1 : mk ? .26 : .12 }, g); } });
  return FEAT;
}

/* ================= interactions: hovering a row lights its petal ================= */
export function setFeature(FEAT: Feat | null, i: number): void {
  $$('.flist__item').forEach((r, j) => r.classList.toggle('is-active', j === i));
  (FEAT ? FEAT.fps : []).forEach((p, j) => p.classList.toggle('is-on', j === i));
  (FEAT ? FEAT.chips : []).forEach((p, j) => p.classList.toggle('is-on', j === i));
  (FEAT ? FEAT.nums : []).forEach((p, j) => p.classList.toggle('is-on', j === i));
  // (the original writes FEAT.active even when FEAT is its empty object; nothing reads it)
  if (FEAT) FEAT.active = i;
}

/* ================= choreography: 03 features ================= */
export function featuresMotion(c: Choreo, FEAT: Feat | null): void {
  const { run, once, para } = c, { reduce } = run;
  const E = EZ.expo, S = EZ.soft;
  const fsec = $maybe('.features');
  if (fsec && FEAT) {
    const rows = $$('.flist__item', fsec);
    rows.forEach((r, i) => ScrollTrigger.create({ trigger: r, start: 'top 55%', end: 'bottom 55%', onToggle: self => { if (self.isActive) setFeature(FEAT, i); } }));
    if (!reduce) {
      const L = FEAT.layers;
      para(L.far, .85, fsec); para(L.glow, .9, fsec);
      gsap.set(FEAT.fps.map(inner), { scale: 0, svgOrigin: '0 0' });
      gsap.set(FEAT.marks, { rotation: 270, svgOrigin: '0 0' }); gsap.set(FEAT.marks.map(inner), { scale: .25, svgOrigin: '0 0' });
      gsap.set(FEAT.chips.map(ch => $('.fchip__p', ch)), { scale: 0, svgOrigin: '0 0' });
      gsap.set(FEAT.nums, { opacity: 0 }); gsap.set(FEAT.rings, { opacity: 0, scale: .92, svgOrigin: '0 0' }); gsap.set([FEAT.halo, FEAT.cons], { opacity: 0 });
      const tl = gsap.timeline({ scrollTrigger: once(fsec, 'top 62%') });
      tl.to(FEAT.rings, { opacity: 1, scale: 1, duration: 1.6, ease: S, stagger: .08 }, .2)
        .to(FEAT.cons, { opacity: 1, duration: 1.2, ease: S }, .3)
        .to(FEAT.halo, { opacity: 1, duration: 1.6, ease: S }, .4)
        .to(FEAT.marks, { rotation: (i: number) => [240, 300][i], duration: 1.2, ease: E }, .6)
        .to(FEAT.marks.map(inner), { scale: 1, duration: 1.2, ease: E }, .6)
        .to(FEAT.fps.map(inner), { scale: 1, duration: .9, ease: E, stagger: .14 }, 1.0)
        .to(FEAT.chips.map(ch => $('.fchip__p', ch)), { scale: 1, duration: .5, ease: E, stagger: .14 }, 1.3)
        .to(FEAT.nums, { opacity: 1, duration: .6, ease: S, stagger: .1 }, 1.6);
      gsap.set($$('.flist__rule', fsec), { scaleX: 0 });
      gsap.fromTo(rows.map(r => Array.from(r.children)), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .8, ease: E, stagger: .02, scrollTrigger: once($('.flist', fsec), 'top 85%') });
      gsap.to($$('.flist__rule', fsec), { scaleX: 1, duration: .8, ease: E, stagger: .08, scrollTrigger: once($('.flist', fsec), 'top 85%') });
      /* the halo breathes on its own layer: the compositor fades it, nothing repaints */
      gsap.to(L.glow, { opacity: .82, duration: 3, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 3, scrollTrigger: { trigger: fsec, start: 'top 62%', toggleActions: 'play pause resume pause' } });
    }
  }
}
