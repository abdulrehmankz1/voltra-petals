import type { Href, Link } from "./types";

export const site = {
  name: "Voltra",
  tagline: "Wealth that grows with you.",
  // Accessible name of the lockup links in the nav, menu and footer.
  homeLabel: "Voltra home",
  homeHref: "#top" satisfies Href,
  skipLabel: "Skip to content",
  // Language of every top-level landmark (the original sets it on each, not only the root).
  lang: "en-GB",
} as const;

// The main call to action; " free" is dropped on the smallest screens in the nav (.no-xs).
export const getVoltra = { label: "Get Voltra", free: " free", href: "#get" } as const;

export const getVoltraFree = `${getVoltra.label}${getVoltra.free}`;

export const signIn = { label: "Sign in", href: "#get" } as const satisfies Link;

export const primaryNav: readonly Link[] = [
  { label: "Product", href: "#product" },
  { label: "Security", href: "#security" },
  { label: "Pricing", href: "#pricing" },
  { label: "Help", href: "#faq" },
];

export const navCopy = {
  label: "Main",
  menuLabel: "Menu",
  openMenu: "Open menu",
  closeMenu: "Close menu",
} as const;

export const footerCopy = {
  label: "Footer",
  // After the primary links, past a separator: the quiet links.
  quietLinks: [
    { label: "Privacy", href: "#privacy" },
    { label: "Terms", href: "#pricing" },
  ] satisfies readonly Link[],
  legal: ["© 2026 Voltra Ltd.", "Crypto assets are volatile and their value can go down as well as up."],
} as const;
