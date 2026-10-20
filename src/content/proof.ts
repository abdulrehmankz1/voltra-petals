import type { Triple } from "./types";

// A counted figure: the motion layer counts up to `count` (with `decimals` places) between prefix and suffix.
export type Stat = { count: string; decimals: number; prefix?: string; suffix?: string; label: string };

export const proofLabel = "Trusted at scale";

export const stats: Triple<Stat> = [
  { count: "1.8", decimals: 1, suffix: "M", label: "wallets created" },
  { count: "6.2", decimals: 1, prefix: "$", suffix: "B", label: "in assets secured" },
  { count: "43", decimals: 0, label: "networks in one view" },
];

// The figure as it reads once counted: "1.8M", "$6.2B", "43".
export const statText = (stat: Stat) => `${stat.prefix ?? ""}${stat.count}${stat.suffix ?? ""}`;
