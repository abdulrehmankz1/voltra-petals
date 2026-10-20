/* ================= grain: one generated duotone tile ================= */
/* light specks carry the texture on ink; dark specks are kept faint so paper stays as calm as the Figma noise */
export function grain(doc: Document, root: HTMLElement): void {
  try {
    const n = 180, c = doc.createElement('canvas'); c.width = c.height = n;
    const x = c.getContext('2d');
    // the original uses the context directly; a missing context throws into the same catch
    if (x === null) throw new Error('no 2d context');
    const img = x.createImageData(n, n), d = img.data;
    let s = 7; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < d.length; i += 4) { const v = rnd(); if (v > .58) { d[i] = d[i + 1] = d[i + 2] = 255; d[i + 3] = (v - .58) / .42 * 180; } else if (v < .4) { d[i] = d[i + 1] = d[i + 2] = 0; d[i + 3] = (.4 - v) / .4 * 72; } }
    x.putImageData(img, 0, 0);
    root.style.setProperty('--grain', `url(${c.toDataURL('image/png')})`);
  } catch { /* grain is decoration */ }
}
