import type { SectionIntro } from "./types";

export type Feature = { title: string; body: string };

export const featuresIntro = {
  eyebrow: "Voltra AI",
  title: ["Calm intelligence,", "in full bloom."],
  lede: "Voltra AI reads prices, fees and on-chain activity around the clock, then speaks plainly.",
} satisfies SectionIntro;

// One petal of the bloom opens per feature; the first ships open. Each key glyph is drawn by the motion layer.
export const features: readonly Feature[] = [
  { title: "Insight", body: "Plain-language nudges when something matters." },
  { title: "Security", body: "Your key, split three ways. Any two can sign." },
  { title: "Every chain", body: "Bitcoin, Ethereum, Solana and 40 more, side by side." },
  { title: "Fair swaps", body: "The best route and the full cost, before you confirm." },
];
