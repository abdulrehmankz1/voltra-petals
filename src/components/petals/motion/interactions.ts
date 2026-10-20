import { gsap } from "gsap";
import type Lenis from "lenis";
import type { Faq } from "./faq";
import { faqClicks } from "./faq";
import { type Feat, setFeature } from "./features";
import { menu } from "./menu";
import { billing } from "./pricing";
import type { Run } from "./runtime";
import { $$, $maybe, EZ, f2 } from "./utils";

/* ================= interactions ================= */
/** in-page links, feature rows, magnetic buttons, billing, the accordion, focus and the menu, in the original's order */
export function interactions(run: Run, lenis: Lenis | null, FEAT: Feat | null, faq: Faq): void {
  const { doc, reduce, signal } = run;
  // the menu is declared last in the original; its closeMenu is only called on click
  let closeMenu: (after?: () => void) => void = after => { if (after) after(); };

  /* in-page links: smooth to the target, below the nav, then hand keyboard focus to it */
  const navH = () => { const n = $maybe('[data-nav]'); return n ? n.offsetHeight : 0; };
  /* layout position, free of any transform still easing (the faq glides its rows with transforms) */
  const absTop = (el: HTMLElement) => { let y = 0, n: HTMLElement | null = el; while (n) { y += n.offsetTop; n = n.offsetParent as HTMLElement | null; } return y; };
  const go = (tgt: HTMLElement, h: string) => {
    if (tgt.classList.contains('qa')) faq.toggleQa(tgt, true); /* open first, so the target is measured where it will rest */
    const chapter = tgt.matches('main, main > section, main > .dawn, .footer');
    const off = h === '#top' || chapter ? 0 : -(navH() + 24);
    const y = Math.max(0, absTop(tgt) + off);
    if (lenis) lenis.scrollTo(y, { duration: reduce ? 0 : 1.4, easing: EZ.expo });
    else scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
    if (tgt.classList.contains('qa')) { const b = tgt.querySelector<HTMLElement>('.qa__btn'); if (b) b.focus({ preventScroll: true }); }
    else { if (!tgt.hasAttribute('tabindex') && !tgt.matches('a,button,input')) tgt.setAttribute('tabindex', '-1'); tgt.focus({ preventScroll: true }); }
  };
  doc.addEventListener('click', e => {
    const a = (e.target as Element).closest('a[href^="#"]'); if (!a) return;
    const h = a.getAttribute('href') ?? ''; if (h.length < 2) return;
    const tgt = doc.getElementById(h.slice(1)); if (!tgt) return;
    e.preventDefault();
    if (a.hasAttribute('data-menu-link')) closeMenu(() => go(tgt, h)); else go(tgt, h);
    try { if (h !== '#top') history.replaceState(null, '', h); } catch { /* sandboxed frames may refuse history writes */ }
  }, { signal });

  /* features: hovering a row lights its petal */
  $$('.flist__item').forEach((r, i) => r.addEventListener('pointerenter', () => setFeature(FEAT, i), { signal }));

  /* magnetic, lit buttons */
  if (!reduce && matchMedia('(pointer: fine)').matches) $$('[data-magnetic]').forEach(b => {
    const inner = b.querySelector<HTMLElement>('.btn__in'); const qx = gsap.quickTo(b, 'x', { duration: .6, ease: 'power3' }), qy = gsap.quickTo(b, 'y', { duration: .6, ease: 'power3' }); const ix = inner ? gsap.quickTo(inner, 'x', { duration: .6, ease: 'power3' }) : null, iy = inner ? gsap.quickTo(inner, 'y', { duration: .6, ease: 'power3' }) : null; let r: DOMRect | null = null;
    b.addEventListener('pointerenter', () => { r = b.getBoundingClientRect(); }, { signal });
    b.addEventListener('pointermove', e => { if (!r) r = b.getBoundingClientRect(); const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2); qx(dx * .22); qy(dy * .32); if (ix && iy) { ix(dx * .1); iy(dy * .12); } b.style.setProperty('--mx', f2(e.clientX - r.left) + 'px'); b.style.setProperty('--my', f2(e.clientY - r.top) + 'px'); }, { signal });
    b.addEventListener('pointerleave', () => { r = null; run.track(gsap.to(b, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1,.45)' })); if (inner) run.track(gsap.to(inner, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1,.45)' })); }, { signal });
  });

  billing(run);

  /* faq accordion */
  faqClicks(run, faq);

  /* keyboard focus never lands on something still waiting for its reveal: finish that reveal at once */
  doc.addEventListener('focusin', e => {
    for (let n = e.target as Element | null; n && n.nodeType === 1 && n !== doc.body; n = n.parentElement) {
      for (const tw of gsap.getTweensOf(n)) {
        let t: gsap.core.Tween | gsap.core.Timeline = tw; while (t.parent && t.parent !== gsap.globalTimeline) t = t.parent;
        const st = t.scrollTrigger; if (t.vars.repeat || (st && st.vars.scrub)) continue;
        if (t.progress() < 1) { t.progress(1); if (st && st.vars.once) st.kill(); }
      }
    }
  }, { signal });

  /* menu */
  closeMenu = menu(run, lenis).closeMenu;
}
