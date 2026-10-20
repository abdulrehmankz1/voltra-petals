import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Horizons } from "./horizons";
import { arcD, ellipse, inner, petal, sv } from "./paint";
import type { Run } from "./runtime";
import { $, $$, $maybe, clamp, EZ, f2, isDesk } from "./utils";

/* ================= 06 how it works: one stem, three stages ================= */
type Pt = [number, number];

/** the original's HOW, emptied and refilled by every build */
export type HowArt = {
  arcY?: (x: number) => number;
  cons: SVGElement[]; halo: SVGEllipseElement; glows: SVGEllipseElement[]; column: SVGEllipseElement; dawn?: SVGEllipseElement;
  motes?: HTMLDivElement; stemGlow: SVGPathElement[]; stem: SVGPathElement;
  bud: SVGGElement[]; two: SVGGElement[]; bloom: SVGGElement[]; heart: SVGCircleElement; nodes: SVGGElement[]; stages: SVGGElement[];
  o: 'h' | 'v'; leaves?: SVGGElement[];
};

export type How = {
  art: HowArt | null;
  /** howSig: the layout the art was last built for */
  sig: string;
  build(): void;
  setup(): void;
  signature(): string;
  /** kills the timeline and its triggers (the original never needed to) */
  dispose(): void;
};

export function createHow(run: Run, hz: Horizons): How {
  let howST: ScrollTrigger | null = null, howPin: ScrollTrigger | null = null, howTL: gsap.core.Timeline | null = null;
  const how: How = { art: null, sig: '', build, setup, signature, dispose };

  function build(): void {
    const svg = $maybe<SVGSVGElement>('[data-how-art]'); if (!svg) return;
    const parent = svg.parentElement as HTMLElement;
    svg.textContent = '';
    $$('.h-motes', parent).forEach(n => n.remove());
    how.art = null;
    if (isDesk()) {
      svg.setAttribute('viewBox', '0 0 1440 920'); svg.removeAttribute('style');
      const P0: Pt = [-40, 628], P1: Pt = [480, 620], P2: Pt = [880, 590], P3: Pt = [1150, 468];
      const bz = (t: number, a: number, b: number, c: number, d: number) => (1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b + 3 * (1 - t) * t * t * c + t ** 3 * d;
      const onStem = (x: number): Pt => { let lo = 0, hi = 1; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (bz(m, P0[0], P1[0], P2[0], P3[0]) < x) lo = m; else hi = m; } const t = (lo + hi) / 2; return [x, bz(t, P0[1], P1[1], P2[1], P3[1])]; };
      const B = [onStem(144), onStem(630), P3], Ls = [118, 140, 150];
      const stem = `M${P0[0]} ${P0[1]}C${P1[0]} ${P1[1]} ${P2[0]} ${P2[1]} ${P3[0]} ${P3[1]}`;
      const cap = $maybe('.how .hz'), g = cap && hz.geom.get(cap), u = clamp(innerWidth * .0006944, .6, 1.2), left = (parent.clientWidth - 1440 * u) / 2;
      const arcY = (x: number) => g ? g.y(left + x * u) / u : -999;
      how.art = buildArt(svg, B, Ls, stem, 'h', arcY);
    } else {
      const list = $('[data-steps]'), rows = $$('.step', list); if (!rows.length) return;
      const x0 = 62, xs = 12, h = list.offsetHeight, off = [6, 10, -8];
      const B = rows.map((r, i): Pt => [x0, r.offsetTop + r.offsetHeight / 2 + off[i]]);
      svg.setAttribute('viewBox', `0 0 132 ${f2(h)}`);
      svg.style.cssText = `left:${list.offsetLeft}px;top:${list.offsetTop}px;width:132px;height:${f2(h)}px`;
      const [y1, y2, y3] = B.map(b => b[1]), F = f2;
      const stem = `M${x0} ${F(y1)}C${x0} ${F(y1 + 34)} ${xs} ${F(y1 + 22)} ${xs} ${F(y1 + 72)}C${xs} ${F(y1 + 112)} ${xs - 3} ${F(y2 - 84)} ${xs} ${F(y2 - 42)}C${xs} ${F(y2 - 12)} ${x0 - 28} ${F(y2)} ${x0} ${F(y2)}`
        + `M${xs} ${F(y2 - 42)}C${xs + 2} ${F(y2 + 20)} ${xs - 2} ${F(y3 - 88)} ${xs} ${F(y3 - 40)}C${xs} ${F(y3 - 10)} ${x0 - 28} ${F(y3)} ${x0} ${F(y3)}`
        + `M${xs} ${F(y3 - 40)}C${xs} ${F(y3 + 14)} ${xs - 2} ${F(y3 + 62)} ${xs + 4} ${F(Math.min(h, y3 + 104))}`;
      const art = how.art = buildArt(svg, B, [46, 52, 50], stem, 'v');
      art.leaves = [[xs, (y1 + y2) / 2 + 18, 204], [xs, (y2 + y3) / 2 + 22, 206], [xs + 1, y1 + 70, -26]].map(([lx, ly, a]) => { const g = sv('g', { transform: `translate(${F(lx)} ${F(ly)})` }, svg.querySelector('.h-mid')); petal(g, 17, a, 'pglb'); return g; });
    }
  }

  function buildArt(svg: SVGSVGElement, B: Pt[], Ls: number[], stem: string, o: 'h' | 'v', arcY?: (x: number) => number): HowArt {
    const far = sv('g', { class: 'h-far' }, svg), glow = sv('g', { class: 'h-glow' }, svg), mid = sv('g', { class: 'h-mid' }, svg), near = sv('g', { class: 'h-near' }, svg);
    const cons: SVGElement[] = B.map((b, i) => i < 2 ? sv('path', { d: arcD(b[0], b[1], Ls[i], -180, 0), fill: 'none', stroke: '#2F6BFF', 'stroke-opacity': .32, 'stroke-dasharray': '3 7', 'vector-effect': 'non-scaling-stroke' }, far) : sv('circle', { cx: b[0], cy: b[1], r: Ls[i], fill: 'none', stroke: '#2F6BFF', 'stroke-opacity': .32, 'stroke-dasharray': '3 7', 'vector-effect': 'non-scaling-stroke' }, far));
    const b3 = B[2];
    const halo = ellipse(glow, b3[0], b3[1], Ls[2] * 2, Ls[2] * 2, 'url(#rg-halo)');
    const glows = [ellipse(glow, B[0][0], B[0][1] - Ls[0] * .44, Ls[0] * .62, Ls[0] * .78, 'url(#rg-soft)'), ellipse(glow, B[1][0], B[1][1] - Ls[1] * .44, Ls[1] * .9, Ls[1] * .74, 'url(#rg-soft)')];
    let column: SVGEllipseElement, dawn: SVGEllipseElement | undefined, motes: HTMLDivElement | undefined;
    if (o === 'h' && arcY) {
      const ay = arcY(b3[0]);
      column = ellipse(glow, b3[0], (ay + b3[1]) / 2 - 20, 60, Math.max(160, (b3[1] - ay) / 2 + 40), 'url(#rg-col)');
      dawn = ellipse(glow, b3[0], ay - 6, 150, 70, 'url(#rg-hzd)');
      /* motes rise on their own elements (compositor transforms), in the art's 1440 x 920 frame */
      const mw = document.createElement('div'); mw.className = 'h-motes'; mw.setAttribute('aria-hidden', 'true');
      [[1132, 300, 2.5, .9], [1171, 246, 1.8, .75], [1146, 186, 3, .65], [1186, 140, 1.6, .55], [1124, 78, 2.2, .8], [1162, 36, 1.5, .6]].forEach(([x, y, r, a], i) => {
        const dk = y < arcY(x), R = r * 5, core = dk ? `rgba(227,235,255,${a})` : `rgba(79,125,255,${a})`, halo = f2(.55 * (dk ? .6 : 1)), e = f2(r / R * 100);
        const m = document.createElement('i'); m.className = 'h-mote';
        m.style.cssText = `left:${f2(x / 14.4)}%;top:${f2(y / 9.2)}%;width:calc(${f2(2 * R)}*var(--u));height:calc(${f2(2 * R)}*var(--u));margin:calc(${f2(-R)}*var(--u)) 0 0 calc(${f2(-R)}*var(--u));--dur:${6 + (i % 3)}s;--delay:${f2(-i * 1.3)}s;background:radial-gradient(closest-side,${core} 0 ${e}%,rgba(142,174,255,${halo}) ${f2(+e + 6)}%,rgba(142,174,255,0) 100%)`;
        mw.appendChild(m);
      });
      svg.after(mw); motes = mw;
    } else {
      column = ellipse(glow, b3[0] + 30, b3[1] - 40, 46, 90, 'url(#rg-col)');
    }
    const stemGlow = [[12, .1], [6, .16]].map(([w, a]) => sv('path', { d: stem, fill: 'none', stroke: '#4F7DFF', 'stroke-opacity': a, 'stroke-width': w, 'stroke-linecap': 'round' }, mid));
    const stemP = sv('path', { d: stem, fill: 'none', stroke: o === 'h' ? 'url(#lg-stem)' : 'url(#lg-stemv)', 'stroke-width': 1.75, 'stroke-linecap': 'round', 'vector-effect': 'non-scaling-stroke' }, mid);
    const stage = (b: Pt, cls: string) => sv('g', { class: 'h-stage ' + cls, transform: `translate(${f2(b[0])} ${f2(b[1])})` }, mid);
    const s1 = stage(B[0], 's1'), s2 = stage(B[1], 's2'), s3 = stage(b3, 's3');
    const bud = [petal(s1, Ls[0], -95, 'budb'), petal(s1, Ls[0], -85, 'budp')];
    const two = [petal(s2, Ls[1], -120, 'mark'), petal(s2, Ls[1], -60, 'mark')];
    const bloom = ([[60, 'pglb'], [120, 'pglb'], [0, 'on'], [180, 'on'], [-120, 'mark'], [-60, 'mark']] as const).map(([a, st]) => petal(s3, Ls[2], a, st));
    const heart = sv('circle', { r: o === 'h' ? 40 : 16, fill: 'url(#rg-heart)' }, s3);
    const nodes = B.slice(0, 2).map(b => { const g = sv('g', { class: 'h-node', transform: `translate(${f2(b[0])} ${f2(b[1])})` }, near); const s = sv('g', {}, g); sv('circle', { r: 18, fill: 'url(#rg-mote)' }, s); sv('circle', { r: 4.5, fill: '#fff', stroke: '#2F6BFF', 'stroke-width': 1.5, 'vector-effect': 'non-scaling-stroke' }, s); return g; });
    return { arcY, cons, halo, glows, column, dawn, motes, stemGlow, stem: stemP, bud, two, bloom, heart, nodes, stages: [s1, s2, s3], o };
  }

  /* the how it works timeline, rebuilt with its art */
  function setup(): void {
    const hsec = $maybe('.how'), HOW = how.art; if (!hsec || !HOW || !HOW.stem) return;
    if (howST) { howST.kill(true); howST = null; } if (howPin) { howPin.kill(true); howPin = null; } if (howTL) { howTL.kill(); howTL = null; }
    /* reduced motion: the stem, stages and steps are simply there */
    if (run.reduce) return;
    const E = EZ.expo, S = EZ.soft, SP = 'back.out(2.2)';
    const first = (n: Element) => n.firstChild as Element;
    const steps = $$('.step', hsec);
    const sl = HOW.stem.getTotalLength(), glowLen = HOW.stemGlow.map(p => p.getTotalLength());
    gsap.set(HOW.stem, { strokeDasharray: sl, strokeDashoffset: sl }); HOW.stemGlow.forEach((p, i) => gsap.set(p, { strokeDasharray: glowLen[i], strokeDashoffset: glowLen[i] }));
    gsap.set(HOW.cons, { opacity: 0 });
    gsap.set(HOW.bud.map(inner), { scale: .6, opacity: 0, svgOrigin: '0 0' });
    gsap.set(HOW.two, { rotation: -90, svgOrigin: '0 0' }); gsap.set(HOW.two.map(inner), { scale: .5, opacity: 0, svgOrigin: '0 0' });
    gsap.set(HOW.bloom.map(inner), { scale: 0, svgOrigin: '0 0' }); gsap.set(HOW.heart, { scale: 0, svgOrigin: '0 0' });
    gsap.set(HOW.nodes.map(first), { scale: 0, svgOrigin: '0 0' });
    gsap.set([HOW.halo, ...HOW.glows, HOW.column, HOW.dawn].filter(Boolean), { opacity: 0 });
    gsap.set(steps, { opacity: 0, y: 16 });
    const tl = gsap.timeline({ defaults: { ease: 'none' } });
    tl.to(HOW.stem, { strokeDashoffset: 0, duration: 2.4 }, 0).to(HOW.stemGlow, { strokeDashoffset: 0, duration: 2.4 }, 0);
    [.4, 1.3, 2.4].forEach((at, i) => tl.to(HOW.cons[i], { opacity: 1, duration: .8, ease: E }, at));
    if (HOW.leaves) { const lv = HOW.leaves.map(l => $('.pt__g', l)); gsap.set(lv, { scale: 0, svgOrigin: '0 0' }); [1.0, 1.9, .5].forEach((at, i) => tl.to(lv[i], { scale: 1, duration: .7, ease: E }, at)); }
    tl.to(HOW.bud.map(inner), { scale: 1, opacity: 1, duration: .9, ease: E, stagger: .06 }, .4)
      .to(first(HOW.nodes[0]), { scale: 1, duration: .5, ease: SP }, .4).to(HOW.glows[0], { opacity: 1, duration: 1.2, ease: S }, .4)
      .to(steps[0], { opacity: 1, y: 0, duration: .8, ease: E }, .6)
      .to(HOW.two.map(inner), { scale: 1, opacity: 1, duration: 1.2, ease: E }, 1.3)
      .to(HOW.two, { rotation: (i: number) => [-120, -60][i], duration: 1.2, ease: E }, 1.3)
      .to(first(HOW.nodes[1]), { scale: 1, duration: .5, ease: SP }, 1.3).to(HOW.glows[1], { opacity: 1, duration: 1.2, ease: S }, 1.3)
      .to(steps[1], { opacity: 1, y: 0, duration: .8, ease: E }, 1.5)
      .to(HOW.bloom.map(inner), { scale: 1, duration: 1.2, ease: E, stagger: .1 }, 2.4)
      .to(HOW.heart, { scale: 1, duration: .6, ease: SP }, 2.5)
      .to([HOW.halo, HOW.column, HOW.dawn].filter(Boolean), { opacity: 1, duration: 1.2, ease: S }, 2.5)
      .to(steps[2], { opacity: 1, y: 0, duration: .8, ease: E }, 2.6)
      .to({}, { duration: .5 });
    howTL = tl;
    if (HOW.o === 'h') {
      /* the pin refreshes first (its spacing moves every chapter below it); the stem starts drawing as the chapter
         rises into view, so there is no empty stage before the pin takes hold */
      const pin = howPin = ScrollTrigger.create({ trigger: hsec, start: 'top top', end: '+=150%', pin: $('.how__pin', hsec), anticipatePin: 1, invalidateOnRefresh: true, refreshPriority: 1 });
      howST = ScrollTrigger.create({ trigger: hsec, start: 'top 55%', end: () => pin.end, scrub: .7, animation: tl, invalidateOnRefresh: true });
    } else howST = ScrollTrigger.create({ trigger: $('.steps', hsec), start: 'top 80%', end: 'bottom 60%', scrub: .7, animation: tl });
  }

  function signature(): string { if (isDesk()) return 'h'; const rows = $$('.step'); return 'v' + rows.map(r => r.offsetHeight).join(',') + ':' + innerWidth; }

  function dispose(): void {
    if (howST) { howST.kill(); howST = null; } if (howPin) { howPin.kill(true); howPin = null; } if (howTL) { howTL.kill(); howTL = null; }
  }

  return how;
}
