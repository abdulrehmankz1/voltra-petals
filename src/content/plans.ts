import type { ButtonVariant } from "@/components/petals/primitives/button";
import type { Link, Pair, SectionIntro, Triple } from "./types";

export type PlanId = "free" | "plus" | "pro";

// Billing period ids are the radio values and the data-m / data-y hooks the toggle swaps.
export type BillingPeriod = "m" | "y";

export type Plan = {
  id: PlanId;
  name: string;
  audience: string;
  // Monthly price in dollars when billed monthly / yearly.
  price: Record<BillingPeriod, number>;
  features: readonly string[];
  cta: Link;
  button: ButtonVariant;
  // The featured plan: the petal texture behind it, the badge and the colour mark in place of a drawn glyph.
  featured?: { badge: string };
  // The drawn glyph of the other plans (data-plan-glyph), painted by the motion layer.
  glyph?: "bud" | "bloom";
};

export const plansIntro = {
  eyebrow: "Pricing",
  title: ["Room to grow."],
  lede: "Start free and upgrade when your portfolio asks for more.",
} satisfies SectionIntro;

export const billing = {
  label: "Billing period",
  name: "billing",
  periods: [
    { id: "m", label: "Monthly" },
    { id: "y", label: "Yearly" },
  ] satisfies Pair<{ id: BillingPeriod; label: string }>,
  // Checked on load; the toggle in the motion layer switches it.
  initial: "m" satisfies BillingPeriod,
  note: { m: "Pay yearly and get two months free.", y: "Two months free on Plus and Pro." } satisfies Record<BillingPeriod, string>,
} as const;

export const comparePlans = { label: "Compare plans", href: "#plans" } as const satisfies Link;

export const priceCopy = { currency: "$", per: "per month", billedYearly: ", billed yearly" } as const;

export const plans: Triple<Plan> = [
  {
    id: "free",
    name: "Free",
    audience: "For getting started",
    price: { m: 0, y: 0 },
    features: ["Wallet for 43 networks", "Five price alerts", "Weekly AI summary"],
    cta: { label: "Get Voltra free", href: "#get" },
    button: "volt",
    glyph: "bud",
  },
  {
    id: "plus",
    name: "Plus",
    audience: "For active investors",
    price: { m: 6, y: 5 },
    features: ["Daily AI insights and nudges", "Unlimited alerts", "Swap fees from 0.25%"],
    cta: { label: "Try Plus free for 30 days", href: "#get" },
    button: "light",
    featured: { badge: "Most chosen" },
  },
  {
    id: "pro",
    name: "Pro",
    audience: "For serious portfolios",
    price: { m: 18, y: 15 },
    features: ["Tax reports in one click", "Risk score and stress tests", "Priority human support"],
    cta: { label: "Choose Pro", href: "#get" },
    button: "volt",
    glyph: "bloom",
  },
];
