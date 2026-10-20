import { getVoltraFree } from "./site";
import type { Link, Lines } from "./types";

export const hero = {
  chip: "Your AI-powered crypto wallet",
  title: ["Wealth that", "grows with you."] satisfies Lines,
  lede: "Voltra watches every chain, price and key you hold, then helps your portfolio grow at a pace you can live with.",
  primary: { label: getVoltraFree, href: "#get" } satisfies Link,
  secondary: { label: "See how it works", href: "#how" } satisfies Link,
} as const;
