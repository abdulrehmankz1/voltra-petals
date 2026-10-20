import type { IconName } from "@/components/petals/brand/icon-artwork";
import { getVoltraFree, site } from "./site";
import type { Link } from "./types";

export type Platform = { icon: IconName; label: string };

export const closeCopy = {
  eyebrow: site.name,
  title: "Let your wealth bloom.",
  lede: "Free to start, on mobile and web.",
  primary: { label: getVoltraFree, href: "#pricing" } satisfies Link,
  secondary: { label: "See how it works", href: "#how" } satisfies Link,
  platformsLabel: "Platforms",
  platforms: [
    { icon: "phone", label: "For iPhone" },
    { icon: "android", label: "For Android" },
    { icon: "globe", label: "On the web" },
  ] satisfies readonly Platform[],
} as const;
