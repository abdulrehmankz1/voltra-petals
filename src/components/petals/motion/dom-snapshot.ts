/*
 * Snapshot of the server-rendered markup taken before the motion script touches it, so a cleanup can put the page
 * back exactly as React rendered it (Strict Mode remounts, HMR). The script mutates the page in place: the art it
 * draws into the svg hosts, the layers and canvases it inserts, the sprite gradients, the split close title, the
 * counters, billing and FAQ text, inline styles and custom properties, classes, aria/hidden/tabindex state and
 * canvas sizes. Restoring the original child-node lists (the same node objects) and attribute sets undoes all of it.
 */

type ElementSnap = { el: Element; attrs: Map<string, string>; kids: ChildNode[]; checked: boolean | null };
type AttrSnap = { el: Element; name: string; value: string | null };

export type DomSnapshot = { elements: ElementSnap[]; scoped: AttrSnap[] };

const SKIP_TAGS = new Set(['SCRIPT', 'NOSCRIPT', 'TEMPLATE', 'STYLE', 'LINK']);

// Page content rendered by app/page.tsx; framework nodes (scripts, the Next.js dev overlay and route announcer,
// which are custom elements) are left alone.
const isPageRoot = (el: Element): boolean => !SKIP_TAGS.has(el.tagName) && !el.localName.includes('-');

function snapElement(el: Element): ElementSnap {
  const attrs = new Map<string, string>();
  for (const a of Array.from(el.attributes)) attrs.set(a.name, a.value);
  // the billing radios: their checked state is a property, not an attribute
  const checked = el instanceof HTMLInputElement ? el.checked : null;
  return { el, attrs, kids: Array.from(el.childNodes), checked };
}

export function snapshotDom(d: Document): DomSnapshot {
  const elements: ElementSnap[] = [];
  for (const r of Array.from(d.body.children)) {
    if (!isPageRoot(r)) continue;
    elements.push(snapElement(r));
    for (const el of Array.from(r.querySelectorAll('*'))) elements.push(snapElement(el));
  }
  // <html> carries state from layout.tsx (js-ready, set before first paint) and the framework; only what the
  // script writes is restored: the class list (js, reduce, still, js-ready, nav-light; Lenis removes its own), the
  // --grain custom property and lang. <body> gets overflow:hidden while the menu is open.
  const root = d.documentElement, body = d.body;
  const scoped: AttrSnap[] = [
    { el: root, name: 'class', value: root.getAttribute('class') },
    { el: root, name: 'style', value: root.getAttribute('style') },
    { el: root, name: 'lang', value: root.getAttribute('lang') },
    { el: body, name: 'style', value: body.getAttribute('style') }
  ];
  return { elements, scoped };
}

const sameKids = (el: Element, kids: ChildNode[]): boolean => {
  const now = el.childNodes;
  if (now.length !== kids.length) return false;
  for (let i = 0; i < kids.length; i++) if (now[i] !== kids[i]) return false;
  return true;
};

export function restoreDom(s: DomSnapshot): void {
  for (const { el, kids } of s.elements) if (!sameKids(el, kids)) el.replaceChildren(...kids);
  for (const { el, attrs, checked } of s.elements) {
    for (const a of Array.from(el.attributes)) if (!attrs.has(a.name)) el.removeAttribute(a.name);
    attrs.forEach((v, k) => { if (el.getAttribute(k) !== v) el.setAttribute(k, v); });
    if (checked !== null && el instanceof HTMLInputElement) el.checked = checked;
    // drop GSAP's per-element cache (cached transforms) so a re-run parses the restored styles afresh
    Reflect.deleteProperty(el, '_gsap');
  }
  for (const { el, name, value } of s.scoped) {
    if (el.getAttribute(name) === value) continue;
    if (value === null) el.removeAttribute(name); else el.setAttribute(name, value);
  }
}
