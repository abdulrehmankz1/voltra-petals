import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Bloom } from "./bloom";
import type { Choreo } from "./choreo";
import { $$, $maybe, EZ } from "./utils";

/* ================= choreography: 09 close, the finale ================= */
export function closeMotion(c: Choreo, scenes: Bloom[]): void {
  const { run, once } = c, E = EZ.expo, S = EZ.soft;
  const csec = $maybe('.close');
  if (csec) {
    const sc = scenes.find(s => s.kind === 'close');
    ScrollTrigger.create({ trigger: csec, start: 'top 70%', once: true, onEnter: () => { if (sc) sc.play(performance.now()); } });
    if (!run.reduce) {
      const title = $maybe('[data-words]', csec);
      if (title) { const text = (title.textContent ?? '').trim(), words = text.split(/\s+/); title.setAttribute('aria-label', text); title.innerHTML = words.map(w => `<span class="w" aria-hidden="true"><span>${w}</span></span>`).join(' '); }
      const ins = $$('[data-close-in]', csec);
      const tl = gsap.timeline({ scrollTrigger: once(csec, 'top 62%') });
      tl.fromTo(ins[0] ?? null, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .8, ease: S }, 0)
        .fromTo(title ? $$('.w>span', title) : [], { yPercent: 110 }, { yPercent: 0, duration: 1.0, ease: E, stagger: .08 }, .2)
        .fromTo(ins.slice(1), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .8, ease: S, stagger: .1 }, 1.0);
    }
  }
}

/* ================= choreography: 10 footer, a quiet watermark bloom closes the story ================= */
export function footerMotion(c: Choreo): void {
  const { run, once, para, idle } = c, E = EZ.expo, S = EZ.soft;
  const foot = $maybe('.footer');
  if (foot) {
    if (!run.reduce) {
      const fb = $maybe('[data-footer-bloom]');
      const tl = gsap.timeline({ scrollTrigger: once(foot, 'top 90%') });
      if (fb) { const ps = $$('.fb .pt__g', fb); gsap.set(ps, { scale: 0, svgOrigin: '0 0' }); tl.to(ps, { scale: 1, duration: 1.2, ease: E, stagger: .06 }, 0); para(fb.parentElement, .9, foot); }
      tl.fromTo($$('[data-foot-in]', foot), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .6, ease: S, stagger: .08 }, .2)
        .fromTo($maybe('.footer__rule', foot), { scaleX: 0 }, { scaleX: 1, duration: .8, ease: E }, .3);
    }
    idle(foot);
  }
}
