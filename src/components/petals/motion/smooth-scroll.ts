import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import type { Run } from "./runtime";

/* ---------- smooth scroll ---------- */
export type SmoothScroll = { lenis: Lenis | null; dispose(): void };

export function smoothScroll(run: Run): SmoothScroll {
  let lenis: Lenis | null = null;
  let tick: gsap.TickerCallback | null = null;
  // the original also checked window.Lenis (CDN); the npm import is always present
  if (!run.reduce) {
    const l = lenis = new Lenis({ lerp: .085, smoothWheel: true, wheelMultiplier: .95, touchMultiplier: 1.4 });
    l.on('scroll', ScrollTrigger.update);
    tick = t => l.raf(t * 1000);
    gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0);
  }
  return {
    lenis,
    dispose() {
      if (tick) gsap.ticker.remove(tick);
      // back to GSAP's defaults (500, 33) so a remount starts from the same global ticker state
      if (lenis) { gsap.ticker.lagSmoothing(500, 33); lenis.destroy(); }
    }
  };
}
