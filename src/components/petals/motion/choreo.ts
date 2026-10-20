import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Run } from "./runtime";
import { EZ } from "./utils";

/* ================= choreography: the helpers every chapter shares ================= */
export type Choreo = {
  run: Run;
  /** reveals play once, from 'top 88%' unless told otherwise */
  once(trigger: Element | null, start?: string): ScrollTrigger.Vars;
  /** parallax layers from each chapter centre */
  para(el: Element | null, rate: number, trigger: HTMLElement | null): void;
  countTo(el: HTMLElement, dur: number, delay: number): gsap.core.Tween;
  money(el: HTMLElement, dur: number, delay: number): gsap.core.Tween;
  /** CSS loops only run while their chapter is on screen */
  idle(sec: Element): void;
};

export function createChoreo(run: Run): Choreo {
  const once = (trigger: Element | null, start?: string): ScrollTrigger.Vars => ({ trigger, start: start || 'top 88%', once: true });
  const para = (el: Element | null, rate: number, trigger: HTMLElement | null) => { if (run.reduce || !el || !trigger) return; const k = 1 - rate; gsap.fromTo(el, { y: () => -k * (innerHeight + trigger.offsetHeight) / 2 }, { y: () => k * (innerHeight + trigger.offsetHeight) / 2, ease: 'none', scrollTrigger: { trigger, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true } }); };
  function countTo(el: HTMLElement, dur: number, delay: number): gsap.core.Tween {
    const end = parseFloat(el.dataset.count ?? ''), dec = +(el.dataset.decimals || 0), pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
    const o = { v: 0 }; el.textContent = pre + (0).toFixed(dec) + suf;
    return gsap.to(o, { v: end, duration: dur, delay, ease: EZ.quint, onUpdate: () => { el.textContent = pre + o.v.toFixed(dec) + suf; } });
  }
  function money(el: HTMLElement, dur: number, delay: number): gsap.core.Tween { const end = +(el.dataset.countMoney ?? ''), o = { v: end * .82 }; return gsap.to(o, { v: end, duration: dur, delay, ease: EZ.expo, onUpdate: () => { el.textContent = '$' + Math.round(o.v).toLocaleString('en-GB'); } }); }
  const idle = (sec: Element) => { ScrollTrigger.create({ trigger: sec, start: 'top bottom', end: 'bottom top', onToggle: self => sec.classList.toggle('is-idle', !self.isActive) }); };
  return { run, once, para, countTo, money, idle };
}
