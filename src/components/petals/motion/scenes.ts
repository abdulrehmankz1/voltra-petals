import { Bloom } from "./bloom";
import type { Run } from "./runtime";
import { $$, $maybe } from "./utils";

declare global {
  // the original exposes its scenes for inspection (review captures)
  interface Window { __scenes?: Bloom[] }
}

/* ================= runtime: the canvas scenes and their one frame loop ================= */
export function initScenes(run: Run, scenes: Bloom[]): void {
  const { doc, reduce, still, signal } = run;
  $$<HTMLCanvasElement>('[data-scene]').forEach(cv => { try { const sc = new Bloom(run, cv, cv.dataset.scene ?? ''); scenes.push(sc); } catch { /* a scene that cannot start is left out */ } });
  /* a scene draws only while its chapter is on screen (checked every frame from cached positions) */
  const inView = (sc: Bloom, sy: number, vh: number) => { const top = sc.top - sy; return top < vh + 120 && top + sc.H > -120; };
  const hero = scenes.find(s => s.kind === 'hero'); if (hero) hero.play(performance.now() + 120);
  /* pointer: the bloom leans and its layers part */
  let lastInput = 0;
  if (!reduce && matchMedia('(pointer: fine)').matches) addEventListener('pointermove', e => { lastInput = performance.now(); for (const sc of scenes) { if (!sc.visible) continue; const r = sc.host.getBoundingClientRect(); sc.pointer((e.clientX - r.left) / r.width * 2 - 1, (e.clientY - r.top) / Math.min(r.height, innerHeight) * 2 - 1); } }, { passive: true, signal });
  scenes.forEach(sc => { const tgt = sc.kind === 'hero' ? $maybe('.hero') : sc.host; if (tgt) tgt.addEventListener('pointerdown', e => { if ((e.target as Element).closest('a,button')) return; lastInput = performance.now(); sc.tap(); }, { signal }); });
  /* at rest (no pointer or scroll for a moment, intro done) the slow loops are drawn at 30 fps; they move under a pixel a frame */
  let lastY = -1, lastScroll = 0;
  const loop = (now: number) => {
    const vh = innerHeight, sy = scrollY;
    if (sy !== lastY) { lastY = sy; lastScroll = now; }
    const busy = now - lastInput < 800 || now - lastScroll < 800;
    if (!doc.hidden) for (const sc of scenes) {
      sc.visible = inView(sc, sy, vh);
      if (sc.visible || !sc.drawnOnce) {
        if (sc.drawnOnce && !busy && !sc.intro(now) && now - sc.lastDraw < 30) continue;
        sc.frame(now, sy, vh); sc.drawnOnce = true; sc.lastDraw = now;
      }
    }
    if (reduce || still) return;
    run.requestAnimationFrame(loop);
  };
  run.requestAnimationFrame(loop);
  if (reduce || still) { /* one still frame per scene, redrawn on resize */ addEventListener('resize', () => run.requestAnimationFrame(t => scenes.forEach(sc => sc.frame(t, scrollY, innerHeight))), { signal }); }
}
