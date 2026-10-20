import { gsap } from "gsap";
import type { Choreo } from "./choreo";
import { arcD, ellipse, inner, petal, petalD, sv } from "./paint";
import { $, $$, $maybe, EZ, f2, isDesk } from "./utils";

/* ================= 04 app: halo, dawn and ripples under the phones ================= */
/**
 * The original's APP object. buildAppArt() rebuilds the art when the layout crosses 1024 and replaces far/glow/rip/
 * eng (cups only below 1024: above it the old cups stay referenced); glyphs() adds the chart parts once.
 */
export type App = {
  cups?: SVGGElement[];
  far?: SVGGElement; glow?: SVGGElement; rip?: SVGGElement; bw?: number; bh?: number; eng?: SVGSVGElement | null;
  lens?: SVGPathElement; area?: SVGPathElement; line?: SVGPathElement; dot?: HTMLElement;
  /** appSig: 'd' or 'm', the layout the art was last built for */
  sig: string;
};

export const createApp = (): App => ({ sig: '' });

export function buildAppArt(APP: App): void {
  const svg = $maybe<SVGSVGElement>('[data-app-art]'); if (!svg) return;
  const sig = isDesk() ? 'd' : 'm'; if (sig === APP.sig) return; APP.sig = sig;
  const wrap = svg.parentElement as HTMLElement;
  svg.textContent = '';
  $$('.app__eng,.app__art--front', wrap).forEach(n => n.remove());
  const desk = isDesk(), bw = desk ? 880 : 390, bh = desk ? 1080 : 760;
  svg.setAttribute('viewBox', `0 0 ${bw} ${bh}`);
  /* glow and ripples sit on a second svg, so the engraved bloom between the two can turn on its own layer */
  const front = sv('svg', { class: 'app__art app__art--front', viewBox: `0 0 ${bw} ${bh}`, 'aria-hidden': 'true', focusable: 'false' });
  const cx = bw / 2, hy = desk ? 958 : 659;
  const far = sv('g', { class: 'a-far' }, svg);
  let eng: SVGSVGElement | null = null;
  if (desk) {
    ([[420, .12], [500, .08], [580, .05]] as const).forEach(([r, a]) => sv('circle', { cx: 924, cy: -410, r, fill: 'none', stroke: '#2F6BFF', 'stroke-opacity': a, 'vector-effect': 'non-scaling-stroke' }, far));
    const halo = [cx, 500, 430], R = halo[2] + 4;
    sv('circle', { cx: halo[0], cy: halo[1], r: halo[2], fill: 'url(#lg-halo)', stroke: 'url(#lg-halos)', 'stroke-width': 1.5, 'vector-effect': 'non-scaling-stroke' }, far);
    eng = sv('svg', { class: 'app__eng', viewBox: `${-R} ${-R} ${2 * R} ${2 * R}`, 'aria-hidden': 'true', focusable: 'false' });
    eng.style.cssText = `left:${halo[0] - R}px;top:${halo[1] - R}px;width:${2 * R}px;height:${2 * R}px`;
    for (let i = 0; i < 6; i++) sv('path', { d: petalD(halo[2]), transform: `rotate(${-90 + i * 60})`, fill: 'none', stroke: '#2F6BFF', 'stroke-opacity': .16, 'vector-effect': 'non-scaling-stroke' }, eng);
    wrap.appendChild(eng);
  } else {
    ellipse(far, cx, 340, 330, 380, 'url(#rg-frost)', { 'fill-opacity': .55 });
    ([[300, .12], [390, .08], [480, .05]] as const).forEach(([r, a]) => sv('path', { d: arcD(cx, 631, r, 180, 360), fill: 'none', stroke: '#2F6BFF', 'stroke-opacity': a, 'vector-effect': 'non-scaling-stroke' }, far));
  }
  wrap.appendChild(front);
  const glow = sv('g', { class: 'a-glow' }, front);
  if (desk) ellipse(glow, cx, 640, 300, 440, 'url(#rg-light)');
  if (!desk) APP.cups = [-120, -60].map(a => { const g = petal(glow, 380, a, 'pglass', 'a-cup'); g.setAttribute('transform', `translate(${cx} 631) rotate(${a})`); return g; });
  ellipse(glow, cx, hy, desk ? 500 : 300, desk ? 110 : 120, 'url(#rg-dawnl)', { class: 'a-dawn' });
  if (!desk) ellipse(glow, cx, hy - 2, 120, 16, 'url(#rg-heart)');
  const rip = sv('g', { class: 'a-rip' }, front);
  (desk ? [[150, .6], [290, .42], [450, .28], [640, .16]] : [[160, .34], [240, .22], [330, .13]]).forEach(([rx, a]) => { const ry = rx * (desk ? .12 : .16); sv('path', { d: `M${f2(cx + rx)} ${hy}A${rx} ${f2(ry)} 0 0 1 ${f2(cx - rx)} ${hy}`, fill: 'none', stroke: '#4F7DFF', 'stroke-opacity': a, 'stroke-width': 1.25, 'vector-effect': 'non-scaling-stroke' }, rip); });
  Object.assign(APP, { far, glow, rip, bw, bh, eng });
}

/* ================= choreography: 04 app, the phones open like petals from one horizon ================= */
export function appMotion(c: Choreo, APP: App, mm: gsap.MatchMedia): void {
  const { run, once, para, money } = c, { reduce } = run;
  const E = EZ.expo, Q = EZ.quint, S = EZ.soft, SP = 'back.out(2.2)';
  const asec = $maybe('.app');
  if (asec && !reduce) {
    const pa = $maybe('[data-phone="a"]'), pb = $maybe('[data-phone="b"]'), pc = $maybe('[data-phone="c"]');
    mm.add({ d: '(min-width:1024px)', m: '(max-width:1023px)' }, ctx => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: $('.app__stage'), start: 'top 88%', end: 'top 22%', scrub: .9 } });
      if (ctx.conditions && ctx.conditions.d) {
        tl.fromTo(pb, { y: 80 }, { y: 0, ease: Q, duration: 1.2 }, 0)
          .fromTo(pa, { x: 205, rotation: 8, opacity: 0 }, { x: 0, rotation: 0, opacity: 1, ease: Q, duration: 1.4 }, .3)
          .fromTo(pc, { x: -205, rotation: -8, opacity: 0 }, { x: 0, rotation: 0, opacity: 1, ease: Q, duration: 1.4 }, .3);
      } else {
        tl.fromTo(pa, { y: 90 }, { y: 0, ease: Q, duration: 1.2 }, 0)
          .fromTo(pc, { x: 120, opacity: 0 }, { x: 0, opacity: 1, ease: Q, duration: 1.3 }, .25);
        if (APP.cups) tl.fromTo(APP.cups.map(inner), { scale: .4, opacity: 0, svgOrigin: '0 0' }, { scale: 1, opacity: 1, ease: E, duration: 1.2 }, .1);
      }
      return () => gsap.set([pa, pb, pc], { clearProps: 'all' });
    });
    const tl = gsap.timeline({ scrollTrigger: once($('.app__stage'), 'top 62%') });
    $$('[data-count-money]', asec).forEach(el => tl.add(money(el, 1.2, 0), .8));
    const nm = $maybe('[data-nm]', asec); if (nm) tl.fromTo(nm, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .9, ease: E }, .9);
    $$('[data-bar]', asec).forEach(b => tl.fromTo(b, { scaleX: 0 }, { scaleX: +(b.dataset.bar ?? ''), duration: 1.2, ease: E }, 1.1));
    if (APP.line) {
      const len = APP.line.getTotalLength ? APP.line.getTotalLength() : 600; gsap.set(APP.line, { strokeDasharray: len, strokeDashoffset: len });
      tl.fromTo(APP.lens ?? null, { opacity: 0 }, { opacity: 1, duration: .9, ease: S }, .8).to(APP.line, { strokeDashoffset: 0, duration: 1.6, ease: E }, 1.0).fromTo(APP.area ?? null, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: S }, 1.5);
      if (APP.dot) tl.fromTo(APP.dot, { scale: 0 }, { scale: 1, duration: .5, ease: SP }, 2.0);
    }
    tl.fromTo($$('[data-bubble]', asec), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .5, ease: S, stagger: .4 }, 1.2);
    tl.fromTo($maybe('.keys-chip', asec), { opacity: 0, y: 12, scale: .94 }, { opacity: 1, y: 0, scale: 1, duration: .8, ease: E }, 1.6);
    /* the benefit rows show from 600 px up (the 390 frame leaves them out); on phones they keep their composed state */
    const bl = $maybe('.benefits', asec);
    if (bl && bl.offsetParent) {
      gsap.set($$('.benefit__rule', asec), { scaleX: 0 });
      gsap.to($$('.benefit__rule', asec), { scaleX: 1, duration: .8, ease: E, stagger: .08, scrollTrigger: once(bl, 'top 86%') });
      gsap.fromTo($$('.ibub', asec), { scale: .4, opacity: 0 }, { scale: 1, opacity: 1, duration: .6, ease: SP, stagger: .08, delay: .3, scrollTrigger: once(bl, 'top 86%') });
    }
    if (APP.far) {
      para($maybe('.app__artw'), .9, asec);
      gsap.fromTo([APP.far, APP.eng].filter(Boolean), { opacity: 0 }, { opacity: 1, duration: 1.2, ease: S, scrollTrigger: once(asec, 'top 75%') });
      gsap.fromTo(APP.glow ?? null, { opacity: 0 }, { opacity: 1, duration: 2, ease: S, scrollTrigger: once(asec, 'top 75%') });
      const bw = APP.bw ?? 0;
      gsap.fromTo(APP.rip ? Array.from(APP.rip.children) : [], { opacity: 0, scale: .6, svgOrigin: `${bw / 2} ${bw > 400 ? 958 : 659}` }, { opacity: 1, scale: 1, duration: 1.8, ease: S, stagger: .12, delay: .5, scrollTrigger: once($('.app__stage'), 'top 70%') });
    }
  }
}
