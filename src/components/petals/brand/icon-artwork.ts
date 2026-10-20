// Artwork of the 24px interface icons, verbatim from the original sprite, in sprite order. Each becomes symbol
// `#i-<name>`. Every icon is drawn with one pen (no fill, currentColor stroke); what varies is its weight and
// whether it rounds caps and joins. Single-path icons carry the pen on the path; the others group their shapes
// under it, and a shape can round its own caps (the wallet's lines).

export type Pen = { width: "1.6" | "1.7" | "1.8"; cap?: true; join?: true };

export type IconShape =
  | { d: string; cap?: true }
  | { rect: { x: number; y: number; width: number; height: number; rx: number } }
  | { circle: { cx: number; cy: number; r: number } }
  | { ellipse: { cx: number; cy: number; rx: number; ry: number } };

export type IconArtwork =
  | { pen: Pen; d: string }
  // `dot`: a filled circle after the group (the android's speaker).
  | { pen: Pen; group: readonly IconShape[]; dot?: { cx: number; cy: number; r: number } };

const ROUND = { width: "1.6", cap: true, join: true } as const satisfies Pen;
const CAPPED = { width: "1.6", cap: true } as const satisfies Pen;
const JOINED = { width: "1.6", join: true } as const satisfies Pen;
const PLAIN = { width: "1.6" } as const satisfies Pen;

export const ICON_ARTWORK = {
  arrow: { pen: ROUND, d: "M5 12h13.5M13 6.5l5.5 5.5-5.5 5.5" },
  spark: { pen: JOINED, d: "M12 3.5c.7 4.3 2.3 6.4 6.5 7.5-4.2 1.1-5.8 3.2-6.5 7.5-.7-4.3-2.3-6.4-6.5-7.5 4.2-1.1 5.8-3.2 6.5-7.5Z" },
  lock: {
    pen: ROUND,
    group: [{ rect: { x: 5, y: 10.5, width: 14, height: 9.5, rx: 3 } }, { d: "M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5M12 14.5v1.6" }],
  },
  apps: {
    pen: PLAIN,
    group: [
      { circle: { cx: 8, cy: 8, r: 3 } },
      { circle: { cx: 16, cy: 8, r: 3 } },
      { circle: { cx: 8, cy: 16, r: 3 } },
      { circle: { cx: 16, cy: 16, r: 3 } },
    ],
  },
  swap: { pen: ROUND, d: "M8.5 18.5V5.5M5 9l3.5-3.5L12 9M15.5 5.5v13M12 15l3.5 3.5L19 15" },
  wallet: {
    pen: JOINED,
    group: [
      { rect: { x: 3.5, y: 6, width: 17, height: 13, rx: 3.2 } },
      { d: "M3.5 9.5h17", cap: true },
      { d: "M15.5 14h1.6", cap: true },
    ],
  },
  phone: { pen: ROUND, group: [{ d: "M10 3h4a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Z" }, { d: "M11 18h2" }] },
  android: {
    pen: ROUND,
    group: [{ d: "M10 3h4a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Z" }],
    dot: { cx: 12, cy: 5.9, r: 1 },
  },
  globe: {
    pen: PLAIN,
    group: [{ circle: { cx: 12, cy: 12, r: 8.5 } }, { ellipse: { cx: 12, cy: 12, rx: 3.6, ry: 8.5 } }, { d: "M3.5 12h17" }],
  },
  cloud: { pen: JOINED, d: "M16.8 18H7.6a3.4 3.4 0 0 1 0-6.8 4.6 4.6 0 0 1 9.54-.79A3.8 3.8 0 0 1 16.8 18Z" },
  check: { pen: { width: "1.7", cap: true, join: true }, d: "M7.6 12.3l3.1 3 5.8-6" },
  home: { pen: JOINED, d: "M4.5 10.6 12 4.5l7.5 6.1v7.9a1.5 1.5 0 0 1-1.5 1.5h-3.6v-5.2H9.6V20H6a1.5 1.5 0 0 1-1.5-1.5Z" },
  trend: { pen: ROUND, d: "M3.5 16.5l5.5-5.5 4 4 7.5-7.5M15 7.5h5.5V13" },
  card: { pen: CAPPED, group: [{ rect: { x: 3.5, y: 6, width: 17, height: 12.5, rx: 3 } }, { d: "M3.5 10.5h17M7 15h3" }] },
  scan: {
    pen: CAPPED,
    d: "M4 8.5V7a3 3 0 0 1 3-3h1.5M15.5 4H17a3 3 0 0 1 3 3v1.5M20 15.5V17a3 3 0 0 1-3 3h-1.5M8.5 20H7a3 3 0 0 1-3-3v-1.5M7.5 12h9",
  },
  bell: { pen: ROUND, d: "M6.5 16.5v-5a5.5 5.5 0 0 1 11 0v5l1.5 1.8H5Zm3.6 3.2a2 2 0 0 0 3.8 0" },
  sliders: {
    pen: CAPPED,
    group: [{ d: "M4 8h9M18 8h2M4 16h3M11 16h9" }, { circle: { cx: 15.5, cy: 8, r: 2.3 } }, { circle: { cx: 8.5, cy: 16, r: 2.3 } }],
  },
  send: { pen: { width: "1.8", cap: true, join: true }, d: "M7 17 17 7M9.5 7H17v7.5" },
  back: { pen: ROUND, d: "M14.5 5.5 8 12l6.5 6.5" },
  plus: { pen: CAPPED, d: "M12 5.5v13M5.5 12h13" },
  btc: {
    pen: ROUND,
    d: "M8.5 6.5h5a2.75 2.75 0 0 1 0 5.5h-5Zm0 5.5h6a2.75 2.75 0 0 1 0 5.5h-6ZM8.5 6.5v11M10.5 4.5v2M13 4.5v2M10.5 17.5v2M13 17.5v2",
  },
  eth: { pen: JOINED, d: "M12 3.5 6.8 12 12 15l5.2-3Zm-5.2 10L12 20.5l5.2-7L12 16.5Z" },
  menu: { pen: CAPPED, d: "M4 9h16M4 15h16" },
  close: { pen: CAPPED, d: "M6 6l12 12M18 6 6 18" },
} as const satisfies Record<string, IconArtwork>;

export type IconName = keyof typeof ICON_ARTWORK;

// Sprite order (object key order).
export const ICON_NAMES = Object.keys(ICON_ARTWORK) as IconName[];

export const iconId = (name: IconName) => `i-${name}`;
