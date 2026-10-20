import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Run } from "./runtime";
import { $, $$, $maybe } from "./utils";

/* ================= choreography: the nav ================= */
/* hides on the way down, returns on the way up, takes the tone of the chapter under it */
export function navMotion(run: Run): void {
  const { root, reduce } = run;
  const nav = $('[data-nav]');
  const toneSecs = $$('main > section, main > .dawn, .footer'); let toneRanges: [number, number, boolean][] = [];
  const measureTones = () => { toneRanges = toneSecs.map(el => { const r = el.getBoundingClientRect(); return [r.top + scrollY, r.bottom + scrollY, el.classList.contains('paper')]; }); };
  const setTone = (y: number) => { const p = y + 36; let light = false; for (const [a, b2, l] of toneRanges) if (p >= a && p < b2) { light = l; break; } nav.classList.toggle('is-light', light); root.classList.toggle('nav-light', light && nav.classList.contains('is-solid')); };
  const onRefresh = () => { measureTones(); setTone(scrollY); };
  ScrollTrigger.addEventListener('refresh', onRefresh);
  run.defer(() => ScrollTrigger.removeEventListener('refresh', onRefresh));
  measureTones();
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: self => { const y = self.scroll(); nav.classList.toggle('is-solid', y > 40); setTone(y); if (reduce) return; if (self.direction > 0 && y > 160) nav.classList.add('is-hidden'); else if (self.direction < 0) nav.classList.remove('is-hidden'); } });
  /* nav marks the chapter in view */
  [['#product', '.features'], ['#security', '.security'], ['#pricing', '.pricing'], ['#faq', '.faq']].forEach(([h, s]) => { const a = $maybe(`.nav__links a[href="${h}"]`), sec = $maybe(s); if (a && sec) ScrollTrigger.create({ trigger: sec, start: 'top 50%', end: 'bottom 50%', onToggle: self => a.classList.toggle('is-current', self.isActive) }); });
}
