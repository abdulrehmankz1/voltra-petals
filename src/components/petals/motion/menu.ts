import { gsap } from "gsap";
import type Lenis from "lenis";
import type { Run } from "./runtime";
import { $, $$, $maybe, EZ } from "./utils";

/* ================= interactions: the menu ================= */
export type Menu = { closeMenu(after?: () => void): void };

export function menu(run: Run, lenis: Lenis | null): Menu {
  const { doc, reduce, signal } = run;
  const menuEl = $maybe('#menu'), openB = $maybe('[data-menu-open]'), closeB = $maybe('[data-menu-close]');
  let menuTl: gsap.core.Animation | null = null;
  function openMenu() {
    if (!menuEl || !openB) return; const r = openB.getBoundingClientRect(); const cx = r.left + r.width / 2, cy = r.top + r.height / 2; const dd = 2 * Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy)) + 40;
    menuEl.style.setProperty('--cx', cx + 'px'); menuEl.style.setProperty('--cy', cy + 'px'); menuEl.style.setProperty('--d', dd + 'px');
    menuEl.hidden = false; openB.setAttribute('aria-expanded', 'true'); if (lenis) lenis.stop(); doc.body.style.overflow = 'hidden';
    const disc = $('.menu__disc', menuEl), items = [$maybe('.menu__top', menuEl), ...$$('.menu__links li a', menuEl), $maybe('.menu__foot', menuEl)];
    if (!reduce) { if (menuTl) menuTl.kill(); const tl = run.track(gsap.timeline()); menuTl = tl; tl.fromTo(disc, { scale: 0 }, { scale: 1, duration: .9, ease: EZ.expo }).fromTo(items, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: .8, ease: EZ.expo, stagger: .06 }, .18).fromTo($maybe('.menu__bloom', menuEl), { opacity: 0, scale: .85, rotation: -20 }, { opacity: .55, scale: 1, rotation: 0, duration: 1.4, ease: EZ.expo }, .1); }
    else { if (menuTl) menuTl.kill(); gsap.set(disc, { scale: 1 }); menuTl = run.track(gsap.fromTo(menuEl, { opacity: 0 }, { opacity: 1, duration: .2 })); }
    run.setTimeout(() => { if (closeB) closeB.focus(); }, 60);
  }
  function closeMenu(after?: () => void) {
    if (!menuEl || !openB || menuEl.hidden) { if (after) after(); return; }
    const m = menuEl, b = openB;
    const done = () => { m.hidden = true; b.setAttribute('aria-expanded', 'false'); if (lenis) lenis.start(); doc.body.style.overflow = ''; b.focus({ preventScroll: true }); if (after) after(); };
    if (!reduce) { if (menuTl) menuTl.kill(); const tl = run.track(gsap.timeline({ onComplete: done })); menuTl = tl; tl.to($$('.menu__inner > *', m), { opacity: 0, duration: .25, ease: 'power1.in' }).to($('.menu__disc', m), { scale: 0, duration: .6, ease: EZ.quint }, .05).set($$('.menu__inner > *', m), { clearProps: 'opacity' }); }
    else { if (menuTl) menuTl.kill(); menuTl = run.track(gsap.to(m, { opacity: 0, duration: .2, onComplete: () => { gsap.set(m, { clearProps: 'opacity' }); done(); } })); }
  }
  if (openB) openB.addEventListener('click', openMenu, { signal });
  if (closeB) closeB.addEventListener('click', () => closeMenu(), { signal });
  if (menuEl) menuEl.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); if (e.key === 'Tab') { const f = $$('a[href],button', menuEl).filter(el => el.offsetParent !== null); const a = f[0], z = f[f.length - 1]; if (e.shiftKey && doc.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && doc.activeElement === z) { e.preventDefault(); a.focus(); } } }, { signal });
  addEventListener('resize', () => { if (menuEl && !menuEl.hidden && innerWidth >= 1024) closeMenu(); }, { signal });
  return { closeMenu };
}
