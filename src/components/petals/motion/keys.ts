import { gsap } from "gsap";
import { ghostCanvas } from "./canvas";
import type { Choreo } from "./choreo";
import { arcD, ellipse, inner, petal, petalD, pol, sv } from "./paint";
import { $, $$, $maybe, EZ, f2, RAD } from "./utils";

/* ================= 05 security: three petals, two lit ================= */
export type Keys = {
  rings: SVGElement[]; dawn: SVGEllipseElement; kitL: SVGSVGElement; kit: SVGGElement;
  domes: SVGPathElement[]; arcs: SVGPathElement[]; lit: SVGGElement[]; lights: SVGPathElement[]; nodes: SVGGElement[];
  /** what the original kept as `_len` on each arc path and `_a` (its angle) on each lit petal, index for index */
  arcLen: number[]; litA: number[];
  flare?: SVGEllipseElement; arc?: SVGPathElement; heart?: SVGGElement;
  ghost?: HTMLDivElement; pulse?: HTMLSpanElement;
};

/* two drawings share one heart: at 1024 and up the signing petals open sideways under a wide arc (Figma 1440); below
   that they rise into a tulip with each key at its tip (Figma 390). Both are built once and CSS shows one of them. */
export function keys(): Keys | null {
  const svg = $maybe<SVGSVGElement>('[data-keys-art]'); if (!svg) return null;
  const L = 304, KIT = 90, AV: Record<string, [number, number]> = { d: [210, 330], m: [240, 300] };
  const k = $maybe('.keys__k');
  const far = sv('g', { class: 'k-far' }, svg);
  const rings: SVGElement[] = [[L + 72, .1], [L + 152, .065]].map(([r, a]) => sv('circle', { r, fill: 'none', stroke: '#fff', 'stroke-opacity': a, 'vector-effect': 'non-scaling-stroke' }, far));
  const glow = sv('g', { class: 'k-glow' }, svg);
  const dawn = ellipse(glow, 8, -330, 640, 250, 'url(#rg-dawnd)');
  const mid = sv('g', { class: 'k-mid' }, svg);
  /* the resting kit petal and the light rings breathe on their own layers, so the loop never repaints the diagram */
  const kl = (vb: string) => sv('svg', { class: 'k-layer ' + vb, viewBox: '-480 -480 960 960', 'aria-hidden': 'true', focusable: 'false' });
  const kitL = kl('k-kitL'); svg.parentNode?.insertBefore(kitL, svg);
  const kit = petal(kitL, L, KIT, 'dim', 'k-kit', { 'stroke-dasharray': '4 6' });
  const phases = [.34, .68, .84].map((f, i) => kl('k-lightL k-ph' + [1, 2, 0][i]));
  let after: Element = svg; for (const ph of phases) { after.after(ph); after = ph; }
  const halfW = (r: number) => Math.acos(r / (2 * L)) / RAD - 60;
  const KEYS: Keys = { rings, dawn, kitL, kit, domes: [], arcs: [], lit: [], lights: [], nodes: [], arcLen: [], litA: [] };
  for (const v in AV) {
    const [a0, a1] = AV[v], cls = 'k-v k-v--' + v, gG = sv('g', { class: cls }, glow), gM = sv('g', { class: cls }, mid);
    const p0 = pol(L, a0), p1 = pol(L, a1), arcPath = `M${p0[0]} ${p0[1]}A${L} ${L} 0 0 1 ${p1[0]} ${p1[1]}`, len = f2(L * (a1 - a0) * RAD);
    KEYS.domes.push(sv('path', { d: `M0 0L${p0[0]} ${p0[1]}A${L} ${L} 0 0 1 ${p1[0]} ${p1[1]}Z`, fill: 'url(#rg-dome)' }, gG));
    /* the 390 drawing adds a dashed orbit through the tips and a level line with soft ripples through the heart */
    if (v === 'm') KEYS.rings.push(sv('circle', { r: L, fill: 'none', stroke: '#fff', 'stroke-opacity': .24, 'stroke-dasharray': '2 7', 'vector-effect': 'non-scaling-stroke' }, gG), sv('path', { d: `M${-L - 10} 0H${L + 10}`, stroke: 'url(#lg-level)', 'stroke-width': 1.5 }, gG), ...[[150, 16, .5], [236, 32, .32], [322, 48, .2]].map(([rx, ry, a]) => sv('path', { d: `M${-rx} 0A${rx} ${ry} 0 0 0 ${rx} 0`, fill: 'none', stroke: 'url(#lg-level)', 'stroke-opacity': a, 'vector-effect': 'non-scaling-stroke' }, gG)));
    [[22, .1], [12, .16], [6, .3]].forEach(([w, a]) => { const p = sv('path', { d: arcPath, fill: 'none', stroke: '#8EAEFF', 'stroke-opacity': a, 'stroke-width': w, 'stroke-linecap': 'round', class: 'k-arcg' }, gM); KEYS.arcs.push(p); KEYS.arcLen.push(len); });
    const arc = sv('path', { d: arcPath, fill: 'none', stroke: 'url(#lg-arc)', 'stroke-width': 2, 'stroke-linecap': 'round' }, gM); KEYS.arcs.push(arc); KEYS.arcLen.push(len);
    for (const a of [a0, a1]) { const g = petal(gM, L, a, 'lit', 'k-lit'); const gg = inner(g); gg.insertBefore(sv('path', { d: petalD(L), fill: 'none', stroke: '#2F6BFF', 'stroke-opacity': .28, 'stroke-width': 16 }), gg.firstChild); KEYS.lit.push(g); KEYS.litA.push(a); }
    const pg = phases.map(ph => sv('g', { class: cls }, ph));
    for (const a of [a0, a1]) [[.34, .26], [.68, .18], [.84, .12]].forEach(([f, op], i) => { const r = f * L, h = halfW(r) - 1.2; KEYS.lights.push(sv('path', { d: arcD(0, 0, r, a - h, a + h), fill: 'none', stroke: '#fff', 'stroke-opacity': op, 'stroke-linecap': 'round', 'vector-effect': 'non-scaling-stroke', class: 'k-light' }, pg[i])); });
    for (const a of v === 'm' ? [a0, a1, 270] : [a0, a1]) { const [x, y] = pol(L, a); const g = sv('g', { class: 'k-node', transform: `translate(${x} ${y})` }, gM); const s = sv('g', {}, g); sv('circle', { r: a === 270 ? 34 : 24, fill: 'url(#rg-node)' }, s); sv('circle', { r: 5, fill: '#fff' }, s); KEYS.nodes.push(g); }
    if (v === 'm') KEYS.flare = ellipse(gM, 0, 0, 96, 15, 'url(#rg-heart)', { 'fill-opacity': .9 });
  }
  KEYS.arc = KEYS.arcs[0];
  { const [x, y] = pol(L, KIT); const g = sv('g', { class: 'k-node', transform: `translate(${x} ${y})` }, mid); const s = sv('g', {}, g); sv('circle', { r: 5, fill: '#050608', stroke: '#fff', 'stroke-opacity': .55, 'stroke-width': 1.25, 'vector-effect': 'non-scaling-stroke' }, s); KEYS.nodes.push(g); }
  const heart = KEYS.heart = sv('g', { class: 'k-heart' }, mid); sv('circle', { r: 64, fill: 'url(#rg-heartd)' }, heart); sv('circle', { r: 6, fill: '#fff' }, heart);
  /* ghost bloom turned 30 degrees, blurred once into a canvas and turned by the compositor */
  if (k) { const gw = document.createElement('div'); gw.className = 'k-ghostw'; gw.setAttribute('aria-hidden', 'true'); const gh = ghostCanvas(400, 64, 'rgba(47,107,255,.11)', -60); gh.classList.add('turn'); gw.appendChild(gh); k.insertBefore(gw, k.firstChild); KEYS.ghost = gw;
    const pulse = document.createElement('span'); pulse.className = 'pulse'; pulse.setAttribute('aria-hidden', 'true'); pulse.innerHTML = '<i></i>'; k.appendChild(pulse); KEYS.pulse = pulse; }
  return KEYS;
}

const first = (n: Element): Element => n.firstChild as Element;

/* ================= choreography: 05 security, the keys unfurl from one heart and an arc closes between the two that sign ================= */
export function securityMotion(c: Choreo, KEYS: Keys | null): void {
  const { run, once, para, idle } = c, { reduce } = run;
  const E = EZ.expo, Q = EZ.quint, S = EZ.soft, SP = 'back.out(2.2)';
  const ssec = $maybe('.security');
  if (ssec && KEYS && KEYS.arc) {
    if (!reduce) {
      KEYS.arcs.forEach((p, i) => gsap.set(p, { strokeDasharray: KEYS.arcLen[i], strokeDashoffset: KEYS.arcLen[i] }));
      gsap.set(KEYS.lit, { rotation: 270, svgOrigin: '0 0' }); gsap.set(KEYS.lit.map(inner), { scale: .2, svgOrigin: '0 0' });
      gsap.set(inner(KEYS.kit), { scale: .3, opacity: 0, svgOrigin: '0 0' });
      gsap.set(KEYS.nodes.map(first), { scale: 0, svgOrigin: '0 0' }); gsap.set($$('.kchip', ssec), { scale: 0 });
      gsap.set([...KEYS.domes, KEYS.flare, KEYS.dawn, ...KEYS.lights, $maybe('.keys__fig', ssec)].filter(Boolean), { opacity: 0 }); gsap.set(KEYS.rings, { scale: .94, opacity: 0, svgOrigin: '0 0' });
      gsap.set($$('.kcap', ssec), { opacity: 0, y: 12 });
      /* both drawings run the same score; the pair index (phone, guard) sets the stagger so the visible one keeps its rhythm */
      const pair = (i: number) => (i % 2) * .08;
      /* the chips keep a legible size on phones through a CSS counter-scale; tween to it, then hand back to CSS */
      const chipScale = () => { const ik = parseFloat(getComputedStyle($('.keys__k', ssec)).getPropertyValue('--ik')) || 1; return Math.max(1, .7 * ik); };
      const tl = gsap.timeline({ scrollTrigger: once($maybe('.keys', ssec), 'top 72%'), onComplete: () => ssec.classList.add('is-looping') });
      tl.to(KEYS.dawn, { opacity: 1, duration: 1.6, ease: S }, 0)
        .to(KEYS.rings, { scale: 1, opacity: 1, duration: 1.6, ease: S, stagger: .1 }, .2)
        .to(KEYS.lit, { rotation: (i: number) => KEYS.litA[i], duration: 1.4, ease: E, stagger: pair }, .4)
        .to(KEYS.lit.map(inner), { scale: 1, duration: 1.4, ease: E, stagger: pair }, .4)
        .to(inner(KEYS.kit), { scale: 1, opacity: 1, duration: 1.2, ease: E }, .8)
        .to(KEYS.nodes.map(first), { scale: 1, duration: .6, ease: SP, stagger: (i: number, _t: unknown, all: unknown[]) => i >= all.length - 2 ? .16 : pair(i) }, 1.4)
        .to($$('.kchip', ssec), { scale: () => chipScale(), duration: .6, ease: SP, stagger: .08, clearProps: 'transform' }, 1.4)
        .to(KEYS.lights, { opacity: 1, duration: .8, ease: S, stagger: (i: number) => (i % 6) * .04 }, 1.5)
        .to(KEYS.arcs, { strokeDashoffset: 0, duration: 1.0, ease: Q }, 1.6)
        .to([...KEYS.domes, KEYS.flare].filter(Boolean), { opacity: 1, duration: 1.6, ease: S }, 2.4)
        .to($maybe('.keys__fig', ssec), { opacity: 1, duration: .8, ease: E }, 2.4)
        .to($$('.kcap', ssec), { opacity: 1, y: 0, duration: .6, ease: S, stagger: .1 }, 2.6);
      const cnt = $maybe('[data-keys-count]', ssec); if (cnt) { const o = { v: 0 }; tl.to(o, { v: 2, duration: .8, ease: 'power2.out', onUpdate: () => { cnt.textContent = String(Math.round(o.v)); } }, 2.4); }
      if (KEYS.ghost) para(KEYS.ghost, .5, ssec);
    }
    idle(ssec);
  }
}
