import type { SectionIntro, Triple } from "./types";

export type Step = { title: string; body: string };

export const stepsIntro = {
  eyebrow: "How it works",
  title: ["Plant it.", "Watch it grow."],
} satisfies SectionIntro;

// Bud, two petals, full bloom: one stage of the stem per step.
export const steps: Triple<Step> = [
  { title: "Create your wallet", body: "Under two minutes, with your key split from the start." },
  { title: "Bring your assets", body: "Connect the wallets you already use, or buy with a card." },
  { title: "Let Voltra tend it", body: "Set targets and alerts. Voltra suggests the next move and you approve every one." },
];

// Visible prefix of the step number on mobile only (.m-only): "Step 01".
export const stepPrefix = "Step ";
