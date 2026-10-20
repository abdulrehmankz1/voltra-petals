import { gsap } from "gsap";
import type { Choreo } from "./choreo";
import type { Horizons } from "./horizons";
import { $$, $maybe, EZ } from "./utils";

/* ================= choreography: generic reveals ================= */
/* the hero settles in CSS from its first frame; everything below waits for its chapter */
export function reveals(c: Choreo): void {
  const { run, once } = c, E = EZ.expo;
  if (!run.reduce) {
    $$('[data-reveal]').forEach(el => { if (el.closest('.proof')) return; gsap.fromTo(el, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .9, ease: E, scrollTrigger: once(el) }); });
    $$('[data-lines]').forEach(h => { if (h.dataset.lines === 'hero') return; const sp = $$('.line>span', h); gsap.fromTo(sp, { y: 0, yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: E, stagger: .09, scrollTrigger: once(h) }); });
  }
}

/* ================= choreography: 02 proof, numbers grow over the hero ripples ================= */
export function proofMotion(c: Choreo): void {
  const { run, once, countTo } = c, E = EZ.expo;
  const proof = $maybe('.proof');
  if (proof && !run.reduce) { const stats = $$('.stat', proof), lab = $maybe('.proof__label', proof); const tl = gsap.timeline({ scrollTrigger: once(proof, 'top 82%') }); tl.fromTo(lab, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .8, ease: E }); tl.fromTo(stats, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .9, ease: E, stagger: .12 }, .1); $$('[data-count]', proof).forEach((el, i) => tl.add(countTo(el, 1.6, 0), .2 + i * .12)); }
}

/* ================= choreography: horizons bow from flat to their full arc as each chapter enters ================= */
export function horizonsMotion(c: Choreo, hz: Horizons): void {
  hz.list.forEach(({ el, sec }) => { if (c.run.reduce) return; gsap.fromTo(el, { scaleY: .04 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'top bottom-=420', scrub: .4, invalidateOnRefresh: true } }); });
}
