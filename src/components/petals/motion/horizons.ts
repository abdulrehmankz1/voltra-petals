import { compose, ellipse, type Stop, sv } from "./paint";
import { $$, $maybe, clamp, f2, lerp } from "./utils";

/** the arc a horizon was drawn with (what the original kept as `el._g` on each [data-hz]) */
export type HzGeom = { R: number; ax: number; w: number; y(x: number): number };

export type Horizons = {
  /** the original's HZ: one entry per horizon, rebuilt with them */
  list: { el: HTMLElement; sec: Element }[];
  geom: WeakMap<Element, HzGeom>;
  /** hzSig and phzSig: the widths the horizons and the proof horizon were last drawn for */
  sig: string; proofSig: string;
};

export const createHorizons = (): Horizons => ({ list: [], geom: new WeakMap(), sig: '', proofSig: '' });

/* ================= 02 proof below 1024: the dawn rests on a horizon at the top of the numbers (Figma 390) ================= */
export function buildProofHz(hz: Horizons): void {
  const el = $maybe('[data-proof-hz]'); if (!el) return;
  const w = el.clientWidth, sig = String(w); if (!w || sig === hz.proofSig) return; hz.proofSig = sig;
  el.textContent = '';
  const H = 180, cx = w / 2, ay = 40, R = w * 1.52, ey = ay + R - Math.sqrt(R * R - (cx + 2) ** 2);
  const svg = sv('svg', { viewBox: `0 0 ${f2(w)} ${H}`, preserveAspectRatio: 'none', focusable: 'false' }, el);
  const defs = sv('defs', {}, svg);
  const stops = (g: SVGElement, st: Stop[]) => { st.forEach(([o, c, a]) => sv('stop', { offset: o, 'stop-color': c, 'stop-opacity': a }, g)); return `url(#${g.id})`; };
  const lin = (id: string, a: Record<string, string | number>, st: Stop[]) => stops(sv('linearGradient', Object.assign({ id }, a), defs), st);
  const rad = (id: string, st: Stop[]) => stops(sv('radialGradient', { id }, defs), st);
  /* dawn above the arc, a calm surface below it, the rim of light and the lens of dawn on its crown */
  ellipse(svg, cx, 52, Math.max(380, w * .62), 120, rad('phz-wide', [[0, '#2F6BFF', .32], [.55, '#1C40DA', .12], [1, '#1C40DA', 0]]));
  ellipse(svg, cx, 42, 150, 50, rad('phz-core', [[0, '#8EAEFF', .5], [1, '#8EAEFF', 0]]));
  const arc = `M-2 ${f2(ey)}A${f2(R)} ${f2(R)} 0 0 1 ${f2(w + 2)} ${f2(ey)}`;
  sv('path', { d: `${arc}L${f2(w + 2)} ${H}L-2 ${H}Z`, fill: lin('phz-surf', { x1: 0, y1: 0, x2: 0, y2: 1 }, [[0, '#111727', 1], [.5, '#0A0D16', 1], [1, '#050608', 1]]) }, svg);
  const rim = lin('phz-rim', { gradientUnits: 'userSpaceOnUse', x1: 0, y1: 0, x2: f2(w), y2: 0 }, [[0, '#4F7DFF', .1], [.36, '#BCD0FF', .5], [.5, '#E3EBFF', .9], [.64, '#BCD0FF', .5], [1, '#4F7DFF', .1]]);
  sv('path', { d: arc, fill: 'none', stroke: rim, 'stroke-width': 6, 'stroke-opacity': .16 }, svg);
  sv('path', { d: arc, fill: 'none', stroke: rim, 'stroke-width': 1.25 }, svg);
  ellipse(svg, cx, ay + 2, 96, 36, rad('phz-halo', [[0, '#BCD0FF', .5], [.6, '#4F7DFF', .14], [1, '#4F7DFF', 0]]));
  const lw = 56, lh = 15, lr = f2((lw * lw + lh * lh) / (2 * lh));
  sv('path', { d: `M${f2(cx - lw)} ${ay}A${lr} ${lr} 0 0 1 ${f2(cx + lw)} ${ay}A${lr} ${lr} 0 0 1 ${f2(cx - lw)} ${ay}Z`, fill: lin('phz-lens', { x1: 0, y1: 0, x2: 0, y2: 1 }, [[0, '#FFFFFF', 1], [.42, '#E3EBFF', 1], [.6, '#8EAEFF', 1], [1, '#4F7DFF', 1]]) }, svg);
}

/* ================= curved horizons: the cap of the previous chapter above an arc ================= */
const parentOf = (el: Element): HTMLElement => el.parentElement as HTMLElement;

export function buildHorizons(hz: Horizons): void {
  const sig = $$('[data-hz]').map(el => parentOf(el).clientWidth).join(','); if (sig === hz.sig) return; hz.sig = sig;
  const HZ = hz.list;
  HZ.length = 0;
  $$('[data-hz]').forEach(el => {
    const host = parentOf(el), sec = el.closest('section') || host, w = host.clientWidth, from = el.dataset.hz;
    const isClose = sec.classList.contains('close');
    const t = clamp((w - 390) / 1050, 0, 1);
    const R = w * lerp(1.64, 2.36, t), ax = w * (isClose ? .667 : .208);
    const yAt = (x: number) => R - Math.sqrt(Math.max(0, R * R - (x - ax) ** 2));
    const depth = Math.max(yAt(-2), yAt(w + 2));
    const hgt = Math.ceil(depth + 60);
    el.style.height = hgt + 'px';
    el.textContent = '';
    hz.geom.set(el, { R, ax, w, y: x => R - Math.sqrt(Math.max(0, R * R - (x - ax) ** 2)) });
    const svg = sv('svg', { viewBox: `0 0 ${w} ${hgt}`, preserveAspectRatio: 'none', 'aria-hidden': 'true' }, el);
    const yl = f2(yAt(-2)), yr = f2(yAt(w + 2));
    const fill = from === 'ink' ? '#050608' : '#F3F4F7';
    const id = 'hzg' + HZ.length;
    const g = sv('linearGradient', { id, x1: 0, y1: 0, x2: 1, y2: 0 }, sv('defs', {}, svg));
    const light = from === 'ink';
    const glowStops: Stop[] = isClose ? [[0, '#8EAEFF', .35], [.3, '#BCD0FF', .55], [.66, '#E3EBFF', .85], [1, '#BCD0FF', .3]] : light ? [[0, '#8EAEFF', .75], [.45, '#BCD0FF', .45], [.8, '#8EAEFF', .5], [1, '#BCD0FF', .1]] : [[0, '#8EAEFF', .06], [.34, '#8EAEFF', .22], [.68, '#BCD0FF', .8], [1, '#8EAEFF', .32]];
    compose(glowStops, null).forEach(([o, c, a]) => sv('stop', { offset: o, 'stop-color': `rgb(${c.join(',')})`, 'stop-opacity': f2(a) }, g));
    const rim = `M-2 ${yl}A${f2(R)} ${f2(R)} 0 0 1 ${w + 2} ${yr}`;
    const off = light ? 1 : -1; /* the glow sits on the light side of the seam */
    for (const [sw, a, dy] of [[34, .18, 10], [18, .3, 5], [8, .5, 2]]) sv('path', { d: rim, transform: `translate(0 ${dy * off})`, fill: 'none', stroke: `url(#${id})`, 'stroke-width': sw, 'stroke-opacity': a, 'stroke-linecap': 'round' }, svg);
    sv('path', { d: `M-2 -2L${w + 2} -2L${w + 2} ${yr}A${f2(R)} ${f2(R)} 0 0 0 -2 ${yl}Z`, fill }, svg);
    sv('path', { d: rim, fill: 'none', stroke: `url(#${id})`, 'stroke-width': 1.5 }, svg);
    HZ.push({ el, sec });
  });
}
