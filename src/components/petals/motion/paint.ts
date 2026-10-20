import { $maybe, f2, NS, RAD } from "./utils";

/* ================= svg helpers and the shared paint library ================= */
export type Attrs = Record<string, string | number | boolean | null | undefined>;

export function sv<K extends keyof SVGElementTagNameMap>(tag: K, attrs?: Attrs | null, parent?: Node | null): SVGElementTagNameMap[K] {
  const n = document.createElementNS(NS, tag);
  if (attrs) for (const k in attrs) { const v = attrs[k]; if (v != null) n.setAttribute(k, String(v)); }
  if (parent) parent.appendChild(n);
  return n;
}
export const petalD = (L: number): string => { const l = f2(L); return `M0 0A${l} ${l} 0 0 1 ${l} 0A${l} ${l} 0 0 1 0 0Z`; };
export const pol = (r: number, a: number): [number, number] => [f2(r * Math.cos(a * RAD)), f2(r * Math.sin(a * RAD))];
export function arcD(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const p = [cx + r * Math.cos(a0 * RAD), cy + r * Math.sin(a0 * RAD)], q = [cx + r * Math.cos(a1 * RAD), cy + r * Math.sin(a1 * RAD)];
  return `M${f2(p[0])} ${f2(p[1])}A${f2(r)} ${f2(r)} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} ${a1 > a0 ? 1 : 0} ${f2(q[0])} ${f2(q[1])}`;
}

type Rgb = number[];
/** a gradient stop: offset, hex colour, alpha (1 when left out) */
export type Stop = [number, string, number?];
export type ComposedStop = [number, Rgb, number];
/** a flat underlay: hex colour and alpha */
type Base = [string, number];

const hexRgb = (h: string): Rgb => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
function over(c: Rgb, a: number, b: Rgb, ba: number): [Rgb, number] { const A = a + ba * (1 - a); if (A <= 0) return [c, 0]; return [c.map((v, i) => Math.round((v * a + b[i] * ba * (1 - a)) / A)), A]; }
/* composite each gradient stop over its flat underlay (the way the Figma petals stack a solid and a gradient) */
export function compose(stops: Stop[], base: Base | null): ComposedStop[] {
  return stops.map(([o, h, a = 1]) => { let c = hexRgb(h), al = a; if (base) [c, al] = over(c, a, hexRgb(base[0]), base[1]); return [o, c, al]; });
}

export const PF: Record<string, [Base | null, Stop[]]> = {
  lit: [['#1C40DA', 1], [[0, '#F4F7FF', 1], [.14, '#BCD0FF', .96], [.42, '#4F7DFF', .9], [1, '#1C40DA', .4]]],
  mark: [['#2F6BFF', 1], [[0, '#E3EBFF', 1], [.18, '#8EAEFF', .96], [.6, '#2F6BFF', .92], [1, '#1C40DA', 1]]],
  on: [['#4F7DFF', 1], [[0, '#E3EBFF', 1], [.45, '#8EAEFF', .9], [1, '#4F7DFF', .85]]],
  pgl: [['#FFFFFF', .55], [[0, '#E3EBFF', .95], [1, '#FFFFFF', .25]]],
  glass: [['#BCD0FF', .05], [[0, '#FFFFFF', .2], [.55, '#FFFFFF', .05], [1, '#FFFFFF', .01]]],
  hgl: [['#8EAEFF', .08], [[0, '#FFFFFF', .4], [.45, '#E3EBFF', .12], [1, '#FFFFFF', .03]]],
  bgl: [['#1C40DA', .07], [[0, '#E3EBFF', .46], [.22, '#8EAEFF', .24], [.55, '#2F6BFF', .1], [1, '#1C40DA', .03]]],
  cgl: [['#FFFFFF', .02], [[0, '#FFFFFF', .36], [.42, '#E3EBFF', .1], [1, '#FFFFFF', .02]]],
  budb: [['#BCD0FF', .6], [[0, '#FFFFFF', .95], [.45, '#E3EBFF', .85], [1, '#8EAEFF', .8]]],
  budp: [['#8EAEFF', 1], [[0, '#F4F7FF', 1], [.35, '#BCD0FF', .95], [1, '#4F7DFF', .95]]],
  pglb: [['#FFFFFF', .7], [[0, '#FFFFFF', .95], [.5, '#DCE6FF', .85], [1, '#8EAEFF', .6]]],
  dim: [['#BCD0FF', .03], [[0, '#FFFFFF', .14], [.6, '#FFFFFF', .04], [1, '#FFFFFF', .01]]],
  ref: [null, [[0, '#DCE6FF', .9], [1, '#FFFFFF', .3]]],
  hor: [null, [[0, '#BCD0FF', .85], [1, '#F1F5FF', .5]]],
  pgout: [null, [[0, '#FFFFFF', .3], [.5, '#E3EBFF', .13], [1, '#FFFFFF', .05]]],
  pgin: [null, [[0, '#FFFFFF', .46], [.45, '#E3EBFF', .18], [1, '#E3EBFF', 0]]],
  pglass: [['#FFFFFF', .36], [[0, '#FFFFFF', .9], [.55, '#E3EBFF', .62], [1, '#BCD0FF', .58]]],
  gly: [['#2F6BFF', 1], [[0, '#8EAEFF', 1], [1, '#1C40DA', 1]]],
  glyl: [['#8EAEFF', 1], [[0, '#E3EBFF', 1], [1, '#4F7DFF', 1]]],
  ghostd: [null, [[0, '#BCD0FF', .5], [.5, '#4F7DFF', .25], [1, '#2F6BFF', .06]]],
  footg: [['#FFFFFF', .015], [[0, '#BCD0FF', .3], [.5, '#4F7DFF', .1], [1, '#2F6BFF', .02]]],
};
export const PSK: Record<string, Stop[]> = {
  w95: [[0, '#FFFFFF', .95], [1, '#FFFFFF', .2]], w85: [[0, '#FFFFFF', .85], [1, '#FFFFFF', .12]], w55: [[0, '#FFFFFF', .55], [1, '#FFFFFF', .06]],
  w70: [[0, '#FFFFFF', .7], [1, '#FFFFFF', .08]], w72: [[0, '#FFFFFF', .72], [.5, '#BCD0FF', .2], [1, '#FFFFFF', .06]], w30: [[0, '#FFFFFF', .95], [1, '#FFFFFF', .3]],
  w85b: [[0, '#FFFFFF', .85], [1, '#FFFFFF', .08]], v40: [[0, '#2F6BFF', .4], [1, '#2F6BFF', .12]], v45: [[0, '#2F6BFF', .45], [1, '#2F6BFF', .15]],
  wv: [[0, '#FFFFFF', .9], [1, '#2F6BFF', .25]], wdim: [[0, '#FFFFFF', .55], [1, '#FFFFFF', .18]], pgout: [[0, '#FFFFFF', .95], [.6, '#FFFFFF', .4], [1, '#FFFFFF', .7]],
  pgin: [[0, '#FFFFFF', .6], [1, '#FFFFFF', 0]], pglass: [[0, '#FFFFFF', 1], [.6, '#BCD0FF', .8], [1, '#4F7DFF', .6]], v22: [[0, '#2F6BFF', .3], [1, '#2F6BFF', .1]],
  v30: [[0, '#2F6BFF', .34], [1, '#2F6BFF', .12]], foot: [[0, '#FFFFFF', .34], [1, '#FFFFFF', .05]],
};
/** a petal style: fill paint, stroke paint (or none) and stroke width */
export type Style = [string, string | null, number];
export const ST: Record<string, Style> = { lit: ['lit', 'w85', 1.25], mark: ['mark', 'w95', 1.25], on: ['on', 'w30', 1.25], pgl: ['pgl', 'v40', 1], glass: ['glass', 'w55', 1], hgl: ['hgl', 'w70', 1], bgl: ['bgl', 'w72', 1], cgl: ['cgl', 'w85b', 1], budb: ['budb', 'wv', 1], budp: ['budp', 'w30', 1.25], pglb: ['pglb', 'v45', 1], dim: ['dim', 'wdim', 1], ref: ['ref', 'v22', 1], hor: ['hor', 'v30', 1], pgout: ['pgout', 'pgout', 1.25], pgin: ['pgin', 'pgin', 1], pglass: ['pglass', 'pglass', 1.25], gly: ['gly', null, 0], glyl: ['glyl', null, 0], foot: ['footg', 'foot', 1] };
const RG: Record<string, Stop[]> = {
  halo: [[0, '#FFFFFF', 1], [.22, '#F1F5FF', .9], [.6, '#DCE6FF', .45], [1, '#DCE6FF', 0]],
  heart: [[0, '#FFFFFF', 1], [.4, '#FFFFFF', .6], [1, '#FFFFFF', 0]],
  heartd: [[0, '#FFFFFF', 1], [.3, '#E3EBFF', .6], [1, '#BCD0FF', 0]],
  node: [[0, '#FFFFFF', .75], [.4, '#BCD0FF', .3], [1, '#BCD0FF', 0]],
  soft: [[0, '#FFFFFF', .95], [.5, '#E3EBFF', .57], [1, '#E3EBFF', 0]],
  dawnd: [[0, '#8EAEFF', .2], [.55, '#2F6BFF', .07], [1, '#2F6BFF', 0]],
  dome: [[0, '#BCD0FF', .3], [.45, '#4F7DFF', .15], [1, '#1C40DA', 0]],
  aura: [[0, '#8EAEFF', .55], [.5, '#BCD0FF', .3], [1, '#DCE6FF', 0]],
  light: [[0, '#FFFFFF', .85], [.55, '#F4F7FF', .45], [1, '#F4F7FF', 0]],
  dawnl: [[0, '#FFFFFF', 1], [.16, '#E3EBFF', .95], [.42, '#BCD0FF', .62], [.72, '#8EAEFF', .22], [1, '#8EAEFF', 0]],
  col: [[0, '#FFFFFF', .7], [1, '#FFFFFF', 0]],
  blue: [[0, '#4F7DFF', .6], [.5, '#2F6BFF', .22], [1, '#2F6BFF', 0]],
  mote: [[0, '#8EAEFF', .55], [1, '#8EAEFF', 0]],
  hzd: [[0, '#8EAEFF', .55], [.5, '#4F7DFF', .2], [1, '#2F6BFF', 0]],
  lenslight: [[0, '#8EAEFF', .45], [.5, '#BCD0FF', .25], [1, '#DCE6FF', 0]],
  frost: [[0, '#FFFFFF', .7], [.6, '#F4F7FF', .35], [1, '#E3EBFF', .05]],
};

/** the shared gradients, written once into the sprite's <defs> */
export function paints(): void {
  const defs = $maybe<SVGDefsElement>('.sprite defs'); if (!defs) return;
  const stopEls = (g: SVGElement, st: ComposedStop[]) => st.forEach(([o, c, a]) => sv('stop', { offset: o, 'stop-color': `rgb(${c.join(',')})`, 'stop-opacity': f2(a) }, g));
  for (const k in PF) stopEls(sv('linearGradient', { id: 'pf-' + k, x1: 0, y1: .5, x2: 1, y2: .5 }, defs), compose(PF[k][1], PF[k][0]));
  for (const k in PSK) stopEls(sv('linearGradient', { id: 'ps-' + k, x1: 0, y1: .5, x2: 1, y2: .5 }, defs), compose(PSK[k], null));
  for (const k in RG) stopEls(sv('radialGradient', { id: 'rg-' + k, cx: .5, cy: .5, r: .5 }, defs), compose(RG[k], null));
  stopEls(sv('linearGradient', { id: 'lg-vstroke', x1: .5, y1: 0, x2: .5, y2: 1 }, defs), compose([[0, '#2F6BFF', .34], [.5, '#2F6BFF', .2], [1, '#2F6BFF', .04]], null));
  stopEls(sv('linearGradient', { id: 'lg-lens', x1: .5, y1: 0, x2: .5, y2: 1 }, defs), compose([[0, '#FFFFFF', .9], [.55, '#F1F5FF', .7], [1, '#DCE6FF', .55]], null));
  stopEls(sv('linearGradient', { id: 'lg-arc', x1: 0, y1: .5, x2: 1, y2: .5 }, defs), compose([[0, '#BCD0FF', .85], [.5, '#FFFFFF', 1], [1, '#BCD0FF', .85]], null));
  stopEls(sv('linearGradient', { id: 'lg-stem', x1: 0, y1: .5, x2: 1, y2: .5 }, defs), compose([[0, '#2F6BFF', 0], [.2, '#2F6BFF', .45], [1, '#1C40DA', .95]], null));
  stopEls(sv('linearGradient', { id: 'lg-stemv', x1: .5, y1: 0, x2: .5, y2: 1 }, defs), compose([[0, '#2F6BFF', .15], [.3, '#2F6BFF', .5], [1, '#1C40DA', .95]], null));
  stopEls(sv('linearGradient', { id: 'lg-halo', x1: .5, y1: 1, x2: .5, y2: 0 }, defs), compose([[0, '#FFFFFF', .92], [.5, '#FFFFFF', .5], [1, '#FFFFFF', .14]], null));
  stopEls(sv('linearGradient', { id: 'lg-halos', x1: .5, y1: 1, x2: .5, y2: 0 }, defs), compose([[0, '#FFFFFF', 1], [.6, '#FFFFFF', .7], [1, '#8EAEFF', .35]], null));
  stopEls(sv('linearGradient', { id: 'lg-level', gradientUnits: 'userSpaceOnUse', x1: -314, y1: 0, x2: 314, y2: 0 }, defs), compose([[0, '#8EAEFF', 0], [.5, '#E3EBFF', .75], [1, '#8EAEFF', 0]], null));
  stopEls(sv('linearGradient', { id: 'lg-chartf', x1: 0, y1: .5, x2: 1, y2: .5 }, defs), compose([[0, '#8EAEFF', .16], [.55, '#4F7DFF', .26], [1, '#2F6BFF', .42]], null));
  stopEls(sv('linearGradient', { id: 'lg-chartl', x1: 0, y1: .5, x2: 1, y2: .5 }, defs), compose([[0, '#8EAEFF', 1], [.4, '#4F7DFF', 1], [1, '#2F6BFF', 1]], null));
}

/** one petal: an outer <g> turned to its angle, an inner .pt__g that the motion scales, and the painted path */
export function petal(parent: Node, L: number, deg: number, st: string, cls?: string | null, extra?: Attrs): SVGGElement {
  const g = sv('g', { class: 'pt' + (cls ? ' ' + cls : ''), transform: `rotate(${f2(deg)})` }, parent);
  const gg = sv('g', { class: 'pt__g' }, g);
  const [f, s, w] = ST[st];
  sv('path', Object.assign({ d: petalD(L), fill: `url(#pf-${f})` }, s ? { stroke: `url(#ps-${s})`, 'stroke-width': w, 'vector-effect': 'non-scaling-stroke' } : {}, extra || {}), gg);
  return g;
}
/** the inner .pt__g of a petal (its first child) */
export const inner = (g: SVGGElement): SVGGElement => g.firstChild as SVGGElement;
export function layer(host: Node, vb: string, cls?: string): SVGSVGElement { return sv('svg', { viewBox: vb, class: 'lay ' + (cls || ''), 'aria-hidden': 'true', focusable: 'false', preserveAspectRatio: 'xMidYMid meet' }, host); }
export function ring(parent: Node, r: number, a: number, extra?: Attrs): SVGCircleElement { return sv('circle', Object.assign({ r: f2(r), fill: 'none', stroke: '#2F6BFF', 'stroke-opacity': a, 'vector-effect': 'non-scaling-stroke' }, extra || {}), parent); }
export function ellipse(parent: Node, cx: number, cy: number, rx: number, ry: number, fill: string, extra?: Attrs): SVGEllipseElement { return sv('ellipse', Object.assign({ cx: f2(cx), cy: f2(cy), rx: f2(rx), ry: f2(ry), fill }, extra || {}), parent); }
