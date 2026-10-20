import { compose, PF, PSK, ST } from "./paint";
import { context2d, f2, RAD, S32 } from "./utils";

/* ================= canvas helpers shared by the ghost blooms and the scenes ================= */
export function petalPath(x: CanvasRenderingContext2D, L: number): void { const h = L * S32; x.beginPath(); x.moveTo(0, 0); x.arc(L / 2, h, L, -2.0943951, -1.0471976); x.arc(L / 2, -h, L, 1.0471976, 2.0943951); x.closePath(); }

/* a blurred bloom (six petals) rendered once into a canvas, used as a far layer */
export function ghostCanvas(L: number, blur: number, color: string, start: number): HTMLCanvasElement {
  const pad = blur * 2.6, size = Math.ceil(2 * (L + pad)), c = document.createElement('canvas'), dpr = 1;
  c.width = c.height = size * dpr; c.style.width = c.style.height = size + 'px'; c.style.marginLeft = c.style.marginTop = -size / 2 + 'px';
  const x = context2d(c); x.scale(dpr, dpr);
  const off = size * 3;
  x.translate(size / 2 - off, size / 2); x.shadowColor = color; x.shadowBlur = blur; x.shadowOffsetX = off; x.fillStyle = '#000';
  for (let i = 0; i < 6; i++) { x.save(); x.rotate((start + i * 60) * RAD); petalPath(x, L); x.fill(); x.restore(); }
  c.setAttribute('aria-hidden', 'true');
  return c;
}

/* ================= canvas bloom scenes: paints ================= */
/* Cost model: the canvas is transparent over a CSS sky, the blurred ghost bloom turns on its own compositor layer,
   gradients and glow sprites are built once and reused, and the horizon sprites are blitted only where they have pixels.
   These caches are pure functions of constant inputs, so they are shared by every run. */
export type CStops = [number, string][];
type CanvasPaint = { f: CStops; s: CStops | null; w: number };
const CS: Record<string, CanvasPaint> = { /* composed canvas paints for the petal styles */ };
function canvasPaint(key: string): CanvasPaint { if (CS[key]) return CS[key]; const st = ST[key]; const f = compose(PF[st[0]][1], PF[st[0]][0]).map(([o, c, a]): [number, string] => [o, `rgba(${c.join(',')},${f2(a)})`]); const s = st[1] ? compose(PSK[st[1]], null).map(([o, c, a]): [number, string] => [o, `rgba(${c.join(',')},${f2(a)})`]) : null; return (CS[key] = { f, s, w: st[2] }); }
const GC = new WeakMap<CanvasRenderingContext2D, Map<CStops, Map<number, CanvasGradient>>>();
function lg(x: CanvasRenderingContext2D, L: number, stops: CStops): CanvasGradient {
  let byStops = GC.get(x); if (!byStops) GC.set(x, byStops = new Map());
  let byL = byStops.get(stops); if (!byL) byStops.set(stops, byL = new Map());
  const q = Math.round(L * 2) / 2; let g = byL.get(q);
  if (!g) { g = x.createLinearGradient(0, 0, q, 0); for (const [o, c] of stops) g.addColorStop(o, c); if (byL.size > 48) byL.clear(); byL.set(q, g); }
  return g;
}
export function drawPetal(x: CanvasRenderingContext2D, L: number, ang: number, key: string, alpha: number, scaleW?: number): void {
  if (L < 1 || alpha <= .002) return;
  const p = canvasPaint(key);
  x.save(); x.rotate(ang * RAD); if (scaleW && scaleW !== 1) x.scale(1, scaleW); x.globalAlpha = alpha; petalPath(x, L);
  x.fillStyle = lg(x, L, p.f); x.fill();
  if (p.s) { x.lineWidth = p.w; x.strokeStyle = lg(x, L, p.s); x.stroke(); }
  x.restore();
}
export function rgrad(x: CanvasRenderingContext2D, cx: number, cy: number, r: number, stops: CStops): CanvasGradient { const g = x.createRadialGradient(cx, cy, 0, cx, cy, r); for (const [o, c] of stops) g.addColorStop(o, c); return g; }
/* the soft glows of the scenes: each radial gradient is rendered once into a small sprite and stretched into place */
export const GL = {
  dawnH: [[0, 'rgba(244,247,255,.92)'], [.1, 'rgba(188,208,255,.68)'], [.3, 'rgba(79,125,255,.42)'], [.56, 'rgba(28,64,218,.17)'], [1, 'rgba(15,35,143,0)']],
  dawnF: [[0, 'rgba(244,247,255,.75)'], [.12, 'rgba(188,208,255,.5)'], [.34, 'rgba(79,125,255,.34)'], [.6, 'rgba(28,64,218,.14)'], [1, 'rgba(15,35,143,0)']],
  dawnC: [[0, 'rgba(244,247,255,.95)'], [.1, 'rgba(188,208,255,.72)'], [.3, 'rgba(79,125,255,.46)'], [.56, 'rgba(28,64,218,.18)'], [1, 'rgba(15,35,143,0)']],
  bandC: [[0, 'rgba(227,235,255,.6)'], [.4, 'rgba(142,174,255,.24)'], [1, 'rgba(47,107,255,0)']],
  colH: [[0, 'rgba(255,255,255,.16)'], [1, 'rgba(255,255,255,0)']],
  colF: [[0, 'rgba(255,255,255,.14)'], [1, 'rgba(255,255,255,0)']],
  colC: [[0, 'rgba(255,255,255,.12)'], [1, 'rgba(255,255,255,0)']],
  litC: [[0, 'rgba(255,255,255,.5)'], [.35, 'rgba(227,235,255,.22)'], [1, 'rgba(188,208,255,0)']],
  heart: [[0, 'rgba(255,255,255,1)'], [.35, 'rgba(227,235,255,.55)'], [1, 'rgba(142,174,255,0)']],
  heartF: [[0, 'rgba(255,255,255,.95)'], [.25, 'rgba(227,235,255,.55)'], [1, 'rgba(142,174,255,0)']],
  heartC: [[0, 'rgba(255,255,255,1)'], [.35, 'rgba(227,235,255,.6)'], [1, 'rgba(142,174,255,0)']],
  lineF: [[0, 'rgba(255,255,255,.8)'], [1, 'rgba(188,208,255,0)']],
  flareC: [[0, 'rgba(255,255,255,.9)'], [.5, 'rgba(188,208,255,.35)'], [1, 'rgba(142,174,255,0)']],
  glint: [[0, 'rgba(255,255,255,.9)'], [.3, 'rgba(188,208,255,.35)'], [1, 'rgba(142,174,255,0)']],
  spark: [[0, 'rgba(255,255,255,.95)'], [.3, 'rgba(188,208,255,.35)'], [1, 'rgba(142,174,255,0)']],
} satisfies Record<string, CStops>;
const SPR = new Map<CStops, HTMLCanvasElement>();
function glowSprite(stops: CStops): HTMLCanvasElement {
  let c = SPR.get(stops); if (c) return c;
  c = document.createElement('canvas'); c.width = c.height = 256;
  const x = context2d(c); x.fillStyle = rgrad(x, 128, 128, 128, stops); x.fillRect(0, 0, 256, 256);
  SPR.set(stops, c); return c;
}
export function ell(x: CanvasRenderingContext2D, cx: number, cy: number, rx: number, ry: number, stops: CStops, alpha: number): void { if (rx <= 0 || ry <= 0 || alpha <= 0) return; const a0 = x.globalAlpha; x.globalAlpha = Math.min(1, alpha); x.drawImage(glowSprite(stops), cx - rx, cy - ry, rx * 2, ry * 2); x.globalAlpha = a0; }
/* one ripple shape, scaled per ring: a unit gradient that fades from the bottom of the ellipse */
const RIPPLE: CStops = [[0, 'rgba(188,208,255,1)'], [.6, 'rgba(188,208,255,.35)'], [1, 'rgba(188,208,255,0)']];
const RG1 = new WeakMap<CanvasRenderingContext2D, CanvasGradient>();
export function unitRipple(x: CanvasRenderingContext2D): CanvasGradient { let g = RG1.get(x); if (!g) { g = rgrad(x, 0, 0, 1, RIPPLE); RG1.set(x, g); } return g; }
