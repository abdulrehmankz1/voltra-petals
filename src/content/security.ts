import type { IconName } from "@/components/petals/brand/icon-artwork";
import type { SectionIntro, Triple } from "./types";

// Copy with a phrase that must not break across lines (.nw).
export type RichText = readonly (string | { nowrap: string })[];

// Copy that differs between small phones (.xs-only) and everything wider (.no-xs); both ship, the stylesheet shows one.
export type ResponsiveText<T = string> = { wide: T; xs: string };

export type KeyShareId = "phone" | "guard" | "kit";

// The chip on the illustration: an icon on desktop and another on mobile (k-dsk / k-mob), or the colour mark.
export type KeyShareGlyph = { desktop: IconName; mobile: IconName } | "mark";

export type KeyShare = {
  id: KeyShareId;
  glyph: KeyShareGlyph;
  state: string | ResponsiveText;
  title: string;
  body: ResponsiveText<string | RichText>;
};

export const securityIntro = {
  eyebrow: "Security",
  title: ["Three keys.", "One quiet promise."],
  lede: "Your phone, your recovery kit and the Voltra guardian each hold one share. Any two can sign; none can move funds alone.",
} satisfies SectionIntro;

// The note under the lede, hidden on the smallest screens.
export const custodyNote = "Self-custody by design. You hold your keys.";

export const keysFigure = {
  // "2 of 3": the motion layer counts the lit shares into data-keys-count.
  signing: 2,
  total: 3,
  label: "Keys to sign",
  // The illustration is hidden from assistive tech; this line says what it shows.
  srText: "Two of three keys are needed to sign.",
} as const;

export const keyShares: Triple<KeyShare> = [
  {
    id: "phone",
    glyph: { desktop: "phone", mobile: "scan" },
    state: "Signing",
    title: "Your phone",
    body: {
      wide: "Signs on your device, with your face or fingerprint.",
      xs: "One share lives on your phone, unlocked by your face or fingerprint.",
    },
  },
  {
    id: "guard",
    glyph: "mark",
    state: "Signing",
    title: "Voltra guardian",
    body: {
      wide: ["Checks every request and ", { nowrap: "co-signs" }, " what you approve."],
      xs: "A second share co-signs each move once it passes a risk check.",
    },
  },
  {
    id: "kit",
    glyph: { desktop: "cloud", mobile: "lock" },
    state: { wide: "In reserve", xs: "Standby" },
    title: "Recovery kit",
    body: {
      wide: "Rests encrypted in your own cloud, ready if you need it.",
      xs: "The third rests in your own cloud, ready if your phone is lost.",
    },
  },
];
