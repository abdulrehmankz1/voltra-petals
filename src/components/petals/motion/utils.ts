/* ---------- utilities ---------- */
// 1:1 port of the original script's helpers (reference/Voltra_Petals_Website.html).

export const NS = 'http://www.w3.org/2000/svg', RAD = Math.PI / 180, S32 = Math.sqrt(3) / 2;

export const clamp = (v: number, a: number, b: number): number => (v < a ? a : v > b ? b : v);
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
export const f2 = (n: number): number => Math.round(n * 100) / 100;
export const seg = (t: number, s: number, d: number): number => clamp((t - s) / d, 0, 1);
// (the original also defines a smoothstep `smooth` that nothing calls)

export type Ease = (t: number) => number;

/** a CSS cubic-bezier as an easing function (Newton steps on x, then y) */
export function cubic(x1: number, y1: number, x2: number, y2: number): Ease {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx, cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const X = (t: number) => ((ax * t + bx) * t + cx) * t, Y = (t: number) => ((ay * t + by) * t + cy) * t, dX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return x => { if (x <= 0) return 0; if (x >= 1) return 1; let t = x; for (let i = 0; i < 8; i++) { const e = X(t) - x, d = dX(t); if (Math.abs(e) < 1e-5 || Math.abs(d) < 1e-6) break; t -= e / d; } return Y(clamp(t, 0, 1)); };
}

export const EZ = {
  expo: cubic(.16, 1, .3, 1), quint: cubic(.83, 0, .17, 1), soft: cubic(.33, 0, .2, 1),
  out: (t: number) => 1 - Math.pow(1 - t, 3),
  spring: (t: number) => { const c1 = 2.1, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }
} satisfies Record<string, Ease>;

export const isDesk = (): boolean => innerWidth >= 1024;
export const isMob = (): boolean => innerWidth < 600;

/** offsetTop summed up to (not including) an ancestor */
export function offsetIn(el: HTMLElement, anc: Element): number {
  let y = 0, n: Element | null = el;
  while (n && n !== anc) { y += (n as HTMLElement).offsetTop; n = (n as HTMLElement).offsetParent; }
  return y;
}

/*
 * DOM queries. The original's `$` returns null for a missing element; where it then checks for null, `$maybe` is
 * used. Where it would go on and fail with a TypeError, `$` throws a clear error instead.
 */
export function $maybe<T extends Element = HTMLElement>(s: string, c: ParentNode = document): T | null {
  return c.querySelector<T>(s);
}
export function $<T extends Element = HTMLElement>(s: string, c: ParentNode = document): T {
  const el = c.querySelector<T>(s);
  if (el === null) throw new Error('[petals-motion] required element not found: ' + s);
  return el;
}
export const $$ = <T extends Element = HTMLElement>(s: string, c: ParentNode = document): T[] =>
  Array.from(c.querySelectorAll<T>(s));

/** a 2d context; the original uses it directly, so a missing one throws where the original would */
export function context2d(cv: HTMLCanvasElement, opts?: CanvasRenderingContext2DSettings): CanvasRenderingContext2D {
  const c = cv.getContext('2d', opts);
  if (c === null) throw new Error('[petals-motion] no 2d context');
  return c;
}
