import type { App } from "./app";
import { ellipse, petal, sv } from "./paint";
import type { Price } from "./pricing";
import { $$, $maybe, clamp, f2 } from "./utils";

/* ================= small glyphs: plans, allocation, footer and menu blooms ================= */
export function glyphs(APP: App, PRICE: Price): void {
  $$<SVGSVGElement>('[data-plan-glyph]').forEach(svg => { const g = sv('g', { class: 'pg' }, svg); if (svg.dataset.planGlyph === 'bud') { const t = sv('g', { transform: 'translate(24 37)' }, g); petal(t, 26, -97, 'glyl'); petal(t, 26, -83, 'gly'); } else { const t = sv('g', { transform: 'translate(24 24)' }, g); for (let i = 0; i < 6; i++) petal(t, 15, -90 + 60 * i, 'gly'); } });
  /* allocation: one tall petal over two low leaves and a ground line, as on the Figma screen */
  const al = $maybe<SVGSVGElement>('[data-alloc-glyph]'); if (al) { sv('path', { d: 'M-38 31H38', stroke: '#8EAEFF', 'stroke-opacity': .7, 'stroke-width': 1 }, al); const t = sv('g', { transform: 'translate(0 30)' }, al); petal(t, 32, -166, 'glyl'); petal(t, 32, -14, 'glyl'); petal(t, 64, -90, 'gly'); }
  /* analytics backdrop: two soft leaves behind the header, one rooted by the range pills, one across the top corner */
  const dec = $maybe<SVGSVGElement>('[data-an-deco]');
  if (dec) [[198, 242, 430, 78, 28, .7], [176, 34, 470, 98, 54, .55]].forEach(([x, y, ex, ey, hb, fo]) => {
    const L = Math.hypot(ex - x, ey - y), R = f2((L * L / 4 + hb * hb) / (2 * hb));
    sv('path', { d: `M${x} ${y}A${R} ${R} 0 0 1 ${ex} ${ey}A${R} ${R} 0 0 1 ${x} ${y}Z`, fill: 'url(#pf-pgl)', 'fill-opacity': fo, stroke: '#FFFFFF', 'stroke-opacity': .9, 'stroke-width': 1 }, dec);
  });
  /* footer and menu blooms turn as whole svg elements (their glows are round, so the turn reads the same) */
  const fb = $maybe<SVGSVGElement>('[data-footer-bloom]'); if (fb) { sv('circle', { r: 150, fill: 'url(#rg-blue)', class: 'f-glowc' }, fb); const pg = sv('g', {}, fb); for (let i = 0; i < 6; i++) petal(pg, 230, -90 + 60 * i, 'foot', 'fb'); sv('circle', { r: 26, fill: 'url(#rg-heart)', 'fill-opacity': .8 }, fb); }
  const mb = $maybe<SVGSVGElement>('[data-bloom-glyph="menu"]'); if (mb) { const pg = sv('g', {}, mb); for (let i = 0; i < 6; i++) petal(pg, 180, -90 + 60 * i, i === 2 || i === 3 ? 'cgl' : 'bgl'); sv('circle', { r: 60, fill: 'url(#rg-blue)' }, mb); }
  const pm = $maybe<SVGSVGElement>('[data-plus-mark]'); if (pm) {
    const hx = 214, hy = 124;
    ellipse(pm, hx, hy - 34, 120, 92, 'url(#rg-light)', { 'fill-opacity': .2 });
    [[46, 8, .34], [86, 15, .2]].forEach(([rx, ry, a]) => sv('path', { d: `M${hx - rx} ${hy}A${rx} ${ry} 0 0 0 ${hx + rx} ${hy}`, fill: 'none', stroke: '#fff', 'stroke-opacity': a }, pm));
    const t = sv('g', { transform: `translate(${hx} ${hy})` }, pm); for (const a of [-120, -60]) { petal(t, 150, a, 'pgout'); petal(t, 118, a, 'pgin'); }
    ellipse(pm, hx, hy, 40, 12, 'url(#rg-light)');
  }
  const pp = $maybe<SVGSVGElement>('[data-plus-petal]'); if (pp) { ellipse(pp, 416, 560, 260, 220, 'url(#rg-light)', { 'fill-opacity': .5 }); const t = sv('g', { transform: 'translate(376 640)' }, pp); const p = PRICE.petal = sv('g', { class: 'plus-petal' }, t); petal(p, 480, -90, 'pgout'); petal(p, 380, -90, 'pgin'); }
  /* the 30 day performance line: a seeded series from $22,954.21 (start) to $24,860.42 (today), drawn inside a lens
     whose tips are the first and last day; the fill sits between the line and the lower arc, the mark pins today */
  const ch = $maybe<SVGSVGElement>('[data-chart="a"]');
  if (ch) {
    const S = [3, 124], E = [331, 30], n = 31, P: [number, number][] = [];
    let r = 11; const rnd = () => (r = (r * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1), env = Math.sin(Math.PI * t) ** 1.2;
      const k = i === 0 ? 0 : i === n - 1 ? 1 : .72 * t + .28 * t * t + env * (.05 * Math.sin(27.6 * t + .4) + .018 * Math.sin(61 * t + 1.1) + (rnd() - .5) * .02);
      P.push([S[0] + (E[0] - S[0]) * t, S[1] + (E[1] - S[1]) * k]);
    }
    /* catmull-rom through the days, so the line bends smoothly instead of stepping */
    const at = (i: number) => P[clamp(i, 0, n - 1)];
    let d = `M${f2(P[0][0])} ${f2(P[0][1])}`;
    for (let i = 0; i < n - 1; i++) { const a0 = at(i - 1), a1 = at(i), a2 = at(i + 1), a3 = at(i + 2); d += `C${f2(a1[0] + (a2[0] - a0[0]) / 6)} ${f2(a1[1] + (a2[1] - a0[1]) / 6)} ${f2(a2[0] - (a3[0] - a1[0]) / 6)} ${f2(a2[1] - (a3[1] - a1[1]) / 6)} ${f2(a2[0])} ${f2(a2[1])}`; }
    const c = Math.hypot(E[0] - S[0], E[1] - S[1]), h = 40, R = f2((c * c / 4 + h * h) / (2 * h));
    const lensD = `M${S[0]} ${S[1]}A${R} ${R} 0 0 1 ${E[0]} ${E[1]}A${R} ${R} 0 0 1 ${S[0]} ${S[1]}Z`;
    sv('path', { d: lensD }, sv('clipPath', { id: 'chartLens' }, sv('defs', {}, ch)));
    APP.lens = sv('path', { d: lensD, fill: '#FFFFFF', 'fill-opacity': .42, stroke: '#8EAEFF', 'stroke-opacity': .6, 'stroke-width': 1 }, ch);
    APP.area = sv('path', { d: `${d}L${E[0]} 170L${S[0]} 170Z`, fill: 'url(#lg-chartf)', 'clip-path': 'url(#chartLens)' }, ch);
    APP.line = sv('path', { d, fill: 'none', stroke: 'url(#lg-chartl)', 'stroke-width': 2.25, 'stroke-linecap': 'round', class: 'chart__line' }, ch);
    sv('circle', { cx: S[0], cy: S[1], r: 3.5, fill: '#FFFFFF', stroke: '#8EAEFF', 'stroke-width': 1.5 }, ch);
    const pin = $maybe('[data-chart-pin]'); if (pin) { pin.style.left = E[0] + 'px'; pin.style.top = E[1] + 'px'; pin.classList.add('is-set'); APP.dot = pin; }
  }
}
