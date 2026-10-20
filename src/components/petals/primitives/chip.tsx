import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

type ChipProps = {
  className?: string;
  // The reveal it joins: the hero's entrance (data-hero-in) or the scroll reveal (data-reveal).
  reveal: "hero" | "scroll";
  // The glyph in the round bud before the text.
  bud: ReactNode;
  children: ReactNode;
};

// A pill of text led by a glyph in a bud (.chip).
export function Chip({ className, reveal, bud, children }: ChipProps) {
  return (
    <p
      className={cx("chip", className)}
      data-hero-in={reveal === "hero" ? "" : undefined}
      data-reveal={reveal === "scroll" ? "" : undefined}
    >
      <span className="bud">{bud}</span> <span>{children}</span>
    </p>
  );
}
