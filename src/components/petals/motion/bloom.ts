import { drawPetal, ell, GL, petalPath, rgrad, unitRipple } from "./canvas";
import type { Run } from "./runtime";
import { $, $maybe, clamp, context2d, EZ, f2, lerp, offsetIn, RAD, seg } from "./utils";

/* ================= canvas bloom scenes: the hero dawn and the closing bloom ================= */
type Mote = { u: number; x: number; sp: number; r: number; a: number; ph: number };
type Ring = { age: number; boost?: number };
/** parallax offsets per layer: far, glow, mid, near */
type Offsets = { fx: number; fy: number; gx: number; gy: number; mx: number; my: number; nx: number; ny: number };

export class Bloom {
  readonly cv: HTMLCanvasElement; readonly kind: string; readonly x: CanvasRenderingContext2D; readonly host: HTMLElement;
  p = { x: 0, y: 0, tx: 0, ty: 0 }; t0 = -1; started = false;
  visible = true; rips: Ring[] = []; nextRip = 0; flash = 0; lastNow = 0; lastDraw = 0;
  drawnOnce = false;
  motes: Mote[]; rings: Ring[]; nextRing: number;
  readonly glc: HTMLCanvasElement; readonly gl: HTMLDivElement; glState = '';
  // measured by measure() and sprites(); zero until the host has a size
  W = 0; H = 0; dpr = 1; top = 0; hh = 0; mode: 'horizon' | 'float' | 'close' = 'close';
  hx = 0; hy = 0; L = 0; s = 1; R = 0; Lg = 0; LO = 0; LI = 0; LL = 0; gs = 0;
  m = 0; sTop = 0; sH = 0; rTop = 0; rH = 0;
  surf: HTMLCanvasElement | null = null; rim: HTMLCanvasElement | null = null;
  private readonly run: Run; private readonly reduce: boolean; private readonly still: boolean;

  constructor(run: Run, cv: HTMLCanvasElement, kind: string) {
    this.run = run; this.reduce = run.reduce; this.still = run.still;
    this.cv = cv; this.kind = kind; this.x = context2d(cv, { alpha: true });
    this.host = cv.parentElement as HTMLElement;
    this.motes = Array.from({ length: 7 }, (_, i) => ({ u: i / 7 + Math.random() * .1, x: Math.random() - .5, sp: .35 + Math.random() * .5, r: .6 + Math.random() * 1.2, a: .22 + Math.random() * .4, ph: Math.random() * 6.28 }));
    this.rings = [{ age: 1.2 }, { age: 2.6 }]; this.nextRing = 4;
    /* the far layer: the blurred ghost bloom on its own element, turned by the compositor */
    const gl = document.createElement('div'); gl.className = 'bloom-ghost'; gl.setAttribute('aria-hidden', 'true');
    this.glc = document.createElement('canvas'); gl.appendChild(this.glc); this.host.insertBefore(gl, cv); this.gl = gl; this.glState = '';
    this.measure();
  }
  measure(): void {
    const W = this.host.clientWidth, Ht = this.host.clientHeight; if (!W || !Ht) return;
    this.W = W; this.H = Ht;
    const px = W * Ht;
    this.dpr = Math.min(window.devicePixelRatio || 1, px > 2.4e6 ? 1.15 : px > 1.4e6 ? 1.35 : 2);
    this.cacheTop();
    this.cv.width = Math.round(W * this.dpr); this.cv.height = Math.round(Ht * this.dpr);
    if (this.kind === 'hero') {
      const hero = $maybe('.hero'), hh = hero ? hero.offsetHeight : Ht; this.hh = hh;
      if (W >= 1024) { this.mode = 'horizon'; this.hx = W * (W >= 1600 ? .745 : .775); this.hy = hh * .9; this.L = Math.min(W * .31, hh * .52, 660); this.s = this.L / 480; this.R = 2600 * this.s; this.Lg = 760 * this.s; }
      else {
        const lead = $('.hero__lead'), ctas = $('.hero__ctas');
        const top = offsetIn(lead, this.host) + lead.offsetHeight, bot = offsetIn(ctas, this.host);
        this.mode = 'float'; this.hx = W / 2; this.hy = (top + bot) / 2 + 14;
        this.L = clamp(Math.min(W * .49, (bot - top) * .64), 120, 300);
        this.s = this.L / 260; this.R = 9000; this.Lg = this.L * 2.1;
      }
    } else {
      const s = W >= 768 ? Math.min(W / 1440, Ht / 960) : W / 390;
      this.mode = 'close'; this.hx = W / 2; this.hy = W >= 768 ? Ht * .933 : Ht * .9;
      if (W >= 768) { this.LO = 840 * s; this.LI = 560 * s; this.LL = 400 * s; this.s = s; } else { this.LO = 420 * s; this.LI = 284 * s; this.LL = 196 * s; this.s = s * .5; }
      this.L = this.LL; this.R = (W >= 768 ? 2600 : 720) * s; this.Lg = (W >= 768 ? 1120 : 560) * s;
    }
    this.sprites();
    if (!this.rips.length) this.seedRipples();
    /* resizing a canvas clears it: static modes (reduced motion, still) draw again right away */
    if ((this.reduce || this.still) && this.drawnOnce) this.run.requestAnimationFrame(now => this.frame(now, window.scrollY, window.innerHeight));
  }
  sprites(): void {
    const W = this.W, Ht = this.H, s = this.s, d = this.dpr, hx = this.hx, hy = this.hy;
    const mk = (w: number, h: number, q = d): [HTMLCanvasElement, CanvasRenderingContext2D] => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(w * q)); c.height = Math.max(1, Math.round(h * q)); const x = context2d(c); x.scale(q, q); return [c, x]; };
    /* sky: static, painted by CSS under the transparent canvas */
    const rg = (cx: number, cy: number, rx: number, ry: number, stops: string) => `radial-gradient(${f2(rx)}px ${f2(ry)}px at ${f2(cx)}px ${f2(cy)}px,${stops})`;
    if (this.kind === 'hero') { const hh = this.hh; this.host.style.backgroundImage = [rg(W * .8, hh * .3, W * .4, hh * .46, 'rgba(28,64,218,.14),rgba(28,64,218,0)'), rg(W * .16, -hh * .12, W * .62, hh * .55, 'rgba(15,35,143,.42),rgba(15,35,143,0)')].join(','); }
    else this.host.style.backgroundImage = [rg(W * .16, Ht * .2, W * .36, Ht * .34, 'rgba(15,35,143,.18),rgba(15,35,143,0)'), rg(W * .5, Ht, W * .62, Ht * .5, 'rgba(28,64,218,.4),rgba(15,35,143,.18) 55%,rgba(15,35,143,0)')].join(',');
    /* far: the ghost bloom, blurred once at low resolution (it is all blur) */
    const gb = this.kind === 'hero' ? 56 * s : 80 * s, Lg = this.Lg, pad = gb * 2.6, gs = 2 * (Lg + pad), q = .35;
    const gc = this.glc; gc.width = gc.height = Math.max(1, Math.ceil(gs * q));
    const gx = context2d(gc); gx.setTransform(q, 0, 0, q, 0, 0); gx.clearRect(0, 0, gs, gs);
    const off = gs * 3; gx.translate(gs / 2 - off, gs / 2); gx.shadowColor = this.kind === 'hero' ? 'rgba(47,107,255,.12)' : 'rgba(47,107,255,.08)'; gx.shadowBlur = gb * q; gx.shadowOffsetX = off * q; gx.fillStyle = '#000';
    for (let i = 0; i < 6; i++) { gx.save(); gx.rotate(((this.kind === 'hero' ? -90 : -60) + i * 60) * RAD); petalPath(gx, Lg); gx.fill(); gx.restore(); }
    this.gs = gs; this.gl.style.width = this.gl.style.height = f2(gs) + 'px'; this.glState = '';
    /* near: the calm surface below the horizon and its rim of light, each kept to the band where it has pixels */
    this.surf = this.rim = null;
    if (this.mode === 'float') return;
    const m = 40, R = this.R; this.m = m;
    const sTop = hy - 8, sH = Math.max(1, Ht + m - sTop); this.sTop = sTop; this.sH = sH;
    const [sc, sx] = mk(W + 2 * m, sH); this.surf = sc;
    sx.translate(m, -sTop);
    const sg = sx.createLinearGradient(0, hy, 0, hy + 88 * s); sg.addColorStop(0, 'rgba(12,13,18,.5)'); sg.addColorStop(.6, 'rgba(7,8,12,.9)'); sg.addColorStop(1, 'rgba(5,6,8,1)');
    sx.beginPath(); sx.arc(hx, hy + R, R, 0, Math.PI * 2); sx.fillStyle = sg; sx.fill();
    const far = Math.max(hx + m, W + m - hx), drop = R - Math.sqrt(Math.max(0, R * R - far * far)), rPad = 48 * s + 12;
    const rTop = hy - rPad, rH = Math.max(1, Math.min(Ht + m, hy + drop + rPad) - rTop); this.rTop = rTop; this.rH = rH;
    const [rc, rx] = mk(W + 2 * m, rH); this.rim = rc;
    rx.translate(m, -rTop);
    const rimArc = () => { rx.beginPath(); rx.arc(hx, hy + R, R, Math.PI, Math.PI * 2); };
    const glowG = rgrad(rx, hx, hy, Math.max(W * .62, 780 * s), [[0, 'rgba(188,208,255,.95)'], [.45, 'rgba(79,125,255,.38)'], [1, 'rgba(47,107,255,0)']]);
    rx.save(); rx.translate(-W * 4, 0); rx.shadowColor = 'rgba(111,147,255,.9)'; rx.shadowBlur = 16 * s * d; rx.shadowOffsetX = W * 4 * d; rimArc(); rx.lineWidth = 10 * s; rx.strokeStyle = glowG; rx.stroke(); rx.restore();
    rimArc(); rx.lineWidth = 1.5; rx.strokeStyle = rgrad(rx, hx, hy, Math.max(W * .55, 676 * s), [[0, 'rgba(255,255,255,1)'], [.4, 'rgba(188,208,255,.7)'], [1, 'rgba(47,107,255,0)']]); rx.stroke();
  }
  cacheTop(): void { let y = 0, n: HTMLElement | null = this.host; while (n) { y += n.offsetTop; n = n.offsetParent as HTMLElement | null; } this.top = y; }
  seedRipples(): void {
    this.rips = [];
    const base = this.kind === 'hero' ? [220, 420, 680, 1000, 1380] : [180, 340, 540, 820];
    for (const r of base) this.rips.push({ age: this.ageFor(r * this.s) });
    this.nextRip = 4;
  }
  ripR(age: number): number { return 150 * this.s * Math.pow(1.55, age / 4); }
  ageFor(rx: number): number { return 4 * Math.log(rx / (150 * this.s)) / Math.log(1.55); }
  play(now: number): void { if (this.t0 < 0) this.t0 = now; this.started = true; }
  intro(now: number): boolean { return this.started && now - this.t0 < 4200; }
  pointer(nx: number, ny: number): void { this.p.tx = clamp(nx, -1, 1); this.p.ty = clamp(ny, -1, 1); }
  tap(): void { this.rips.push({ age: this.ageFor(70 * this.s), boost: 1.6 }); this.flash = 1; this.rings.push({ age: 0, boost: 1.4 }); }
  frame(now: number, scrollY: number, vh: number): void {
    if (!this.W) return;
    const REDUCE = this.reduce, STILL = this.still;
    const x = this.x, d = this.dpr, W = this.W, Ht = this.H, hero = this.kind === 'hero';
    const dt = this.lastNow ? Math.min(.05, (now - this.lastNow) / 1000) : .016; this.lastNow = now;
    const t = REDUCE || STILL ? 99 : this.started ? (now - this.t0) / 1000 : 0;
    const clock = REDUCE || STILL ? 0 : now / 1000;
    const P = this.p; P.x += (P.tx - P.x) * Math.min(1, dt * 3.2); P.y += (P.ty - P.y) * Math.min(1, dt * 3.2);
    /* parallax from the chapter centre: far 0.3x, glow 0.6x, mid and near 1x */
    const rtop = this.top - scrollY;
    const dc = REDUCE || STILL ? 0 : (rtop + (hero ? this.hh : Ht) / 2) - vh / 2;
    const prog = REDUCE || STILL ? 0 : hero ? clamp(-rtop / this.hh, 0, 1) : clamp(1 - (rtop + Ht * .5) / vh, 0, 1);
    const pf = (k: number) => [-P.x * 26 * k, -P.y * 12 * k];
    const [fx, fy] = pf(.3), [gx, gy] = pf(.45), [mx, my] = pf(.6), [nx, ny] = pf(1);
    const farY = -.7 * dc, glowY = -.4 * dc;
    x.setTransform(d, 0, 0, d, 0, 0); x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1;
    x.clearRect(0, 0, W, Ht);
    const o: Offsets = { fx, fy: fy + farY, gx, gy: gy + glowY, mx, my, nx, ny };
    if (hero && this.mode === 'float') this.drawFloat(x, t, clock, dt, prog, o);
    else if (hero) this.drawHero(x, t, clock, dt, prog, o);
    else this.drawClose(x, t, clock, dt, prog, o);
  }
  /* the ghost layer: written only when its transform or opacity actually changes */
  ghostAt(k: number, o: Offsets, ang: number): void {
    const tx = this.hx + o.fx - this.gs / 2, ty = this.hy + o.fy - this.gs / 2;
    const st = `${f2(tx)},${f2(ty)},${(ang % (2 * Math.PI)).toFixed(4)},${k.toFixed(3)}`;
    if (st === this.glState) return; this.glState = st;
    this.gl.style.transform = `translate3d(${f2(tx)}px,${f2(ty)}px,0) rotate(${(ang % (2 * Math.PI)).toFixed(4)}rad)`;
    this.gl.style.opacity = k.toFixed(3);
  }
  ripples(x: CanvasRenderingContext2D, t: number, dt: number, o: Offsets, intro: number, alphaK: number): void {
    const s = this.s, hx = this.hx + o.nx, hy = this.hy + o.ny;
    if (!this.reduce && t > 1.4) { for (const rp of this.rips) rp.age += dt; this.nextRip -= dt; if (this.nextRip <= 0) { this.rips.push({ age: this.ageFor(150 * s) }); this.nextRip = 4; } }
    this.rips = this.rips.filter(rp => this.ripR(rp.age) < this.W * 2.2 + 2400 * s);
    const g = unitRipple(x);
    for (const rp of this.rips) {
      const rx = this.ripR(rp.age) * (.6 + .4 * intro), ry = rx * .17;
      let a = Math.min(.55, .5 * Math.pow(220 * s / rx, .8)) * intro * alphaK * (rp.boost || 1);
      a *= clamp(rp.age < .6 ? rp.age / .6 : 1, 0, 1);
      if (a < .004) continue;
      x.save(); x.translate(hx, hy + ry); x.scale(rx, rx); x.globalAlpha = Math.min(1, a); x.lineWidth = 1.25 / rx; x.strokeStyle = g;
      x.beginPath(); x.ellipse(0, -ry / rx, 1, ry / rx, 0, 0, Math.PI); x.stroke(); x.restore();
    }
  }
  surface(x: CanvasRenderingContext2D, o: Offsets, rimK: number): void {
    if (!this.surf) return;
    const m = this.m, W = this.W, d = this.dpr;
    x.drawImage(this.surf, -m + o.nx, this.sTop + o.ny, W + 2 * m, this.sH);
    if (rimK > 0 && this.rim) { /* the rim draws out from the heart to both edges */ const cx = this.hx + m, lo = cx * (1 - rimK), hi = cx + (W + 2 * m - cx) * rimK; if (hi - lo > 1) x.drawImage(this.rim, lo * d, 0, (hi - lo) * d, this.rim.height, lo - m + o.nx, this.rTop + o.ny, hi - lo, this.rH); }
  }
  heart(x: CanvasRenderingContext2D, cx: number, cy: number, k: number, s: number, flash: number): void {
    if (k <= 0) return;
    ell(x, cx, cy, 110 * s * k * (1 + flash * .5), 34 * s * k * (1 + flash * .3), GL.heart, clamp(k, 0, 1));
  }
  drawHero(x: CanvasRenderingContext2D, t: number, clock: number, dt: number, prog: number, o: Offsets): void {
    const REDUCE = this.reduce;
    const s = this.s, L = this.L, hx = this.hx, hy = this.hy;
    /* far: the dawn field and the turning ghost bloom, construction circles one per petal */
    const fieldK = EZ.quint(seg(t, 0, 1.6));
    this.ghostAt(fieldK, o, clock * 2 * Math.PI / 360);
    x.save(); x.translate(hx + o.fx, hy + o.fy); x.rotate(clock * 2 * Math.PI / 360); x.setLineDash([3 * s + 1, 7 * s + 2]); x.lineWidth = 1;
    x.strokeStyle = `rgba(142,174,255,${f2(.075 * fieldK)})`;
    for (let i = 0; i < 6; i++) { const k = EZ.quint(seg(t, i * .08, 1.6)); if (k <= 0) continue; const a = (-90 + 60 * i) * RAD; x.beginPath(); x.arc(L * Math.cos(a), L * Math.sin(a), L, a + Math.PI, a + Math.PI + k * Math.PI * 2); x.stroke(); }
    x.restore();
    /* glow: dawn climbs from under the horizon, then breathes; the light column grows from the heart */
    const dawnK = EZ.soft(seg(t, 0, 2.4)), breath = REDUCE ? 1 : .92 + .08 * Math.sin(clock * 2 * Math.PI / 12);
    const dy = (1 - dawnK) * 120 * s - prog * 50 * s;
    ell(x, hx + o.gx, hy + 40 * s + dy + o.gy, 740 * s * (1 + prog * .08), 580 * s * (1 + prog * .12), GL.dawnH, (.25 + .75 * dawnK) * breath * (1 + prog * .25));
    const colK = EZ.expo(seg(t, .9, 1.2)), cb = REDUCE ? 1 : .85 + .15 * Math.sin(clock * 2 * Math.PI / 6 + 1);
    if (colK > 0) { const ch = 360 * s * colK; ell(x, hx + o.gx + o.mx * .2 + this.p.x * 10, hy - ch + o.gy * .5, 72 * s, ch, GL.colH, cb * (1 + prog * .3)); }
    /* motes rising in the column */
    if (t > 1.6) this.drawMotes(x, t, clock, dt, (m) => [hx + o.gx + m.x * 110 * s + Math.sin(clock * .6 + m.ph) * 10 * s, hy - 60 * s - m.u * 560 * s], Math.max(s, .6));
    /* mid: petals unfurl from the stem in mirrored pairs, mark pair first, pivoting on the heart */
    const sway = REDUCE ? 0 : Math.sin(clock * 2 * Math.PI / 7) * 1.1 + this.p.x * 4;
    const open = prog * 9;
    const bud = EZ.expo(seg(t, .5, .9));
    const lL = EZ.expo(seg(t, 1.2, 1.4)), lR = EZ.expo(seg(t, 1.32, 1.4));
    const aL = -90 - 30 * lL - open + sway, aR = -90 + 30 * lR + open + sway;
    const hor = EZ.quint(seg(t, 1.6, 1.0)), ref = EZ.quint(seg(t, 1.72, 1.0));
    const sc = 1 + prog * .05;
    x.save(); x.translate(hx + o.mx, hy + o.my); x.scale(sc, sc);
    drawPetal(x, L * (.75 + .25 * ref), -aL, 'glass', ref * .9); /* reflections mirror the mark below the horizon */
    drawPetal(x, L * (.75 + .25 * ref), -aR, 'glass', ref * .9);
    drawPetal(x, L * (.72 + .28 * hor), lerp(-120, -180, hor) + sway * .3, 'hgl', hor);
    drawPetal(x, L * (.72 + .28 * hor), lerp(-60, 0, hor) + sway * .3, 'hgl', hor);
    drawPetal(x, L * bud, aL, 'lit', Math.min(1, bud * 1.4));
    drawPetal(x, L * bud, aR, 'lit', Math.min(1, bud * 1.4));
    x.restore();
    /* near: the calm surface, its rim drawn out from the heart, ripples, the heart flare and glints */
    this.surface(x, o, EZ.expo(seg(t, .3, 1.6)));
    this.ripples(x, t, dt, o, EZ.soft(seg(t, 1.4, 1.8)), 1);
    this.flash = Math.max(0, this.flash - dt * 1.6);
    const hk = EZ.spring(seg(t, 1.2, .6));
    this.heart(x, hx + o.mx, hy + o.ny, hk, s, this.flash + prog * .4);
    this.glints(x, t, clock, o, [[aL, L], [aR, L], [lerp(-120, -180, hor), L], [lerp(-60, 0, hor), L]]);
  }
  drawMotes(x: CanvasRenderingContext2D, t: number, clock: number, dt: number, at: (m: Mote) => number[], k: number): void {
    x.save(); x.globalCompositeOperation = 'lighter';
    for (const m of this.motes) {
      if (!this.reduce) m.u += dt * m.sp * .06; if (m.u > 1) { m.u = 0; m.x = Math.random() - .5; }
      const [xx, yy] = at(m);
      const a = Math.pow(Math.sin(m.u * Math.PI), 1.5) * m.a * clamp((t - 1.6) / 1.5, 0, 1); if (a < .02) continue;
      x.globalAlpha = a; x.fillStyle = 'rgba(188,208,255,.28)'; x.beginPath(); x.arc(xx, yy, m.r * 3 * k, 0, 6.283); x.fill(); x.fillStyle = '#E3EBFF'; x.beginPath(); x.arc(xx, yy, m.r * k, 0, 6.283); x.fill();
    }
    x.restore();
  }
  /* phones and tablets: the bloom floats in the dawn, a lit six-petal bloom inside a turning ring of glass */
  drawFloat(x: CanvasRenderingContext2D, t: number, clock: number, dt: number, prog: number, o: Offsets): void {
    const REDUCE = this.reduce;
    const s = this.s, L = this.L, hx = this.hx, hy = this.hy, turn = clock * 2 * Math.PI / 360;
    this.ghostAt(EZ.soft(seg(t, 0, 2)), o, turn);
    const dawnK = EZ.soft(seg(t, 0, 2.4)), breath = REDUCE ? 1 : .92 + .08 * Math.sin(clock * 2 * Math.PI / 12);
    ell(x, hx + o.gx, hy + L * .55 + (1 - dawnK) * 120 * s + o.gy, L * 2.3, L * 2, GL.dawnF, (.25 + .75 * dawnK) * breath * (1 + prog * .3));
    const colK = EZ.expo(seg(t, .9, 1.2));
    if (colK > 0) ell(x, hx + o.gx, hy - L * .9 * colK + o.gy * .5, L * .2, L * 1.1 * colK, GL.colF, 1);
    /* growth rings ripple out from the heart, one every 4 s */
    if (!REDUCE && t > 1.4) { for (const r of this.rings) r.age += dt; this.nextRing -= dt; if (this.nextRing <= 0) { this.rings.push({ age: 0 }); this.nextRing = 4; } }
    this.rings = this.rings.filter(r => r.age < 9);
    x.save(); x.lineWidth = 1;
    for (const r of this.rings) { const rr = L * (.35 + r.age * .32), a = Math.max(0, .2 * (1 - r.age / 9)) * (r.boost || 1) * EZ.soft(seg(t, 1.4, 1.6)) * clamp(r.age / .5, 0, 1); if (a < .005) continue; x.beginPath(); x.arc(hx + o.mx, hy + o.my, rr, 0, 6.2832); x.strokeStyle = `rgba(188,208,255,${f2(a)})`; x.stroke(); }
    x.restore();
    if (t > 1.6) this.drawMotes(x, t, clock, dt, (m) => [hx + o.gx + m.x * L * .7 + Math.sin(clock * .6 + m.ph) * 8, hy - m.u * L * 2.2], 1);
    const sway = REDUCE ? 0 : Math.sin(clock * 2 * Math.PI / 7) * 1.2 + this.p.x * 4;
    const sc = 1 + prog * .08;
    x.save(); x.translate(hx + o.mx, hy + o.my); x.scale(sc, sc);
    /* outer glass ring, turned 30 degrees, turning on the shared clock */
    x.save(); x.rotate(turn);
    const ok = EZ.expo(seg(t, .4, 1.8));
    for (const [a, al] of [[-90, 1], [-30, 1], [210, 1], [30, .55], [150, .55], [90, .4]]) drawPetal(x, L * 1.5 * (.2 + .8 * ok), a, 'bgl', ok * al);
    x.restore();
    /* the lit bloom: the mark pair first, then the horizon pair, then the lower pair */
    const mk = EZ.expo(seg(t, .5, 1.4)), hz = EZ.expo(seg(t, 1.0, 1.3)), lo = EZ.expo(seg(t, 1.3, 1.3));
    const open = prog * 6;
    drawPetal(x, L * (.4 + .6 * lo), 120 - 30 * (1 - lo) + sway * .4, 'lit', lo * .78);
    drawPetal(x, L * (.4 + .6 * lo), 60 + 30 * (1 - lo) + sway * .4, 'lit', lo * .78);
    drawPetal(x, L * (.5 + .5 * hz), 180 + 20 * (1 - hz) - open + sway * .6, 'lit', hz);
    drawPetal(x, L * (.5 + .5 * hz), 0 - 20 * (1 - hz) + open + sway * .6, 'lit', hz);
    drawPetal(x, L * mk, -90 - 30 * mk - open + sway, 'lit', Math.min(1, mk * 1.4));
    drawPetal(x, L * mk, -90 + 30 * mk + open + sway, 'lit', Math.min(1, mk * 1.4));
    x.restore();
    this.flash = Math.max(0, this.flash - dt * 1.6);
    const hk = EZ.spring(seg(t, 1.2, .6));
    if (hk > 0) { const hr = L * .5 * hk * (1 + this.flash * .4); ell(x, hx + o.mx, hy + o.my, hr, hr, GL.heartF, clamp(hk, 0, 1)); ell(x, hx + o.mx, hy + o.my, L * .9 * hk, 2.2, GL.lineF, clamp(hk, 0, 1)); }
    this.glints(x, t, clock, o, [[-120, L], [-60, L], [180, L], [0, L]]);
  }
  glints(x: CanvasRenderingContext2D, t: number, clock: number, o: Offsets, tips: [number, number][]): void {
    if (t < 2.4 || this.reduce) return;
    const s = this.s;
    const cyc = Math.floor(clock / 4), ph = (clock % 4) / 4;
    const i = cyc % tips.length, [a, L] = tips[i];
    const g = Math.sin(clamp(ph / .5, 0, 1) * Math.PI);
    if (g <= .01) return;
    const px = this.hx + o.mx + Math.cos(a * RAD) * L * .98, py = this.hy + o.my + Math.sin(a * RAD) * L * .98, gr = 22 * Math.max(s, .6);
    x.save(); x.globalCompositeOperation = 'lighter';
    ell(x, px, py, gr, gr, GL.glint, g);
    x.globalAlpha = g; x.strokeStyle = 'rgba(255,255,255,.75)'; x.lineWidth = 1; x.beginPath(); x.moveTo(px - 14 * g, py); x.lineTo(px + 14 * g, py); x.moveTo(px, py - 14 * g); x.lineTo(px, py + 14 * g); x.stroke();
    x.restore();
  }
  drawClose(x: CanvasRenderingContext2D, t: number, clock: number, dt: number, prog: number, o: Offsets): void {
    const REDUCE = this.reduce;
    const s = this.s, hx = this.hx, hy = this.hy, mob = this.W < 768;
    this.ghostAt(EZ.soft(seg(t, 0, 2)), o, clock * 2 * Math.PI / 360);
    const dawnK = EZ.soft(seg(t, 0, 2.4)), breath = REDUCE ? 1 : .93 + .07 * Math.sin(clock * 2 * Math.PI / 12);
    const k = mob ? .55 : 1, S = mob ? this.W / 390 : s;
    const dy = (1 - dawnK) * 160 * s * k;
    ell(x, hx + o.gx, hy + 40 * S * k + dy + o.gy, 840 * S * k, 620 * S * k, GL.dawnC, (.2 + .8 * dawnK) * breath);
    ell(x, hx + o.gx, hy + o.gy * .5, 1100 * S * k * (.6 + .4 * dawnK), 140 * S * k, GL.bandC, dawnK);
    const colK = EZ.expo(seg(t, 1.0, 1.4));
    if (colK > 0) ell(x, hx + o.gx, hy - 290 * S * k * colK, 80 * S * k, 320 * S * k * colK, GL.colC, 1);
    const sway = REDUCE ? 0 : Math.sin(clock * 2 * Math.PI / 9) * .8 + this.p.x * 3;
    const ring = (L: number, start: number, dur: number, key: string, angs: number[][]) => { const kk = EZ.expo(seg(t, start, dur)); if (kk <= 0) return; for (const [a, al] of angs) drawPetal(x, L * (.15 + .85 * kk), a + (1 - kk) * 18 * Math.sign(a + 90 || 1) + sway * (a < 0 && a > -180 ? 1 : .3), key, kk * al); };
    const RING = [[-90, 1], [-30, 1], [210, 1], [30, .35], [150, .35], [90, .35]];
    x.save(); x.translate(hx + o.mx, hy + o.my);
    ring(this.LO, .4, 1.8, 'bgl', RING);
    ring(this.LI, .6, 1.6, 'cgl', RING);
    ring(this.LL, .8, 1.4, 'lit', [[60, .35], [120, .35], [0, 1], [180, 1], [-60, 1], [240, 1]]);
    x.restore();
    ell(x, hx + o.mx, hy - 36 * S * k + o.my, 280 * S * k, 210 * S * k, GL.litC, EZ.soft(seg(t, 1, 1.2)));
    this.surface(x, o, EZ.expo(seg(t, .3, 1.6)));
    this.ripples(x, t, dt, o, EZ.soft(seg(t, 1.6, 1.8)), .9);
    this.flash = Math.max(0, this.flash - dt * 1.6);
    const hk = EZ.spring(seg(t, 1.4, .6));
    ell(x, hx + o.mx, hy + o.ny, 124 * S * k * hk * (1 + this.flash * .4), 38 * S * k * hk, GL.heartC, clamp(hk, 0, 1));
    const fk = EZ.expo(seg(t, 1.5, .8));
    if (fk > 0) ell(x, hx + o.mx, hy + o.ny, 460 * S * k * fk, 3 * S * k + 1, GL.flareC, 1);
    /* sparkles twinkle along the rim and petals */
    if (t > 2) { x.save(); x.globalCompositeOperation = 'lighter'; const pts = [[210, this.LO * .58], [-30, this.LO * .8], [180, this.LL], [0, this.LL], [-60, this.LL * .5]]; pts.forEach(([a, r], i) => { const tw = REDUCE ? .6 : Math.pow(Math.max(0, Math.sin(clock * (.7 + i * .17) + i * 2.1)), 6); if (tw < .03) return; const px = hx + o.mx + Math.cos(a * RAD) * r, py = hy + o.my + Math.sin(a * RAD) * r, sr = 16 * Math.max(S * k, .6); ell(x, px, py, sr, sr, GL.spark, tw); }); x.restore(); }
    /* drifting petals */
    const drift = (bx: number, by: number, L: number, ang: number, period: number, rate: number, alpha: number) => { const ph = REDUCE ? .3 : ((clock / period) % 1); const yy = by + ph * 120 * rate * S * k, aa = ang + ph * 20; const al = Math.sin(ph * Math.PI) * alpha * EZ.soft(seg(t, 1.8, 1.2)); if (al < .01) return; x.save(); x.translate(bx + o.mx * rate, yy + o.my * rate); drawPetal(x, L, aa, 'cgl', al); x.restore(); };
    const sx = this.W / (mob ? 390 : 1440);
    drift(this.W * (mob ? .86 : .93), (mob ? 360 : 436) * (mob ? sx : s), 60 * (mob ? sx * .7 : s), -66, 12, 1.2, .9);
    drift(this.W * (mob ? .12 : .14), (mob ? 330 : 428) * (mob ? sx : s), 40 * (mob ? sx * .7 : s), -116, 16, .6, .7);
  }
}
