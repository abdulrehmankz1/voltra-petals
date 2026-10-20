import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

type SectionProps = {
  className: string;
  id?: string;
  // Every section is named by its heading.
  labelledBy: string;
  // The chapter the motion layer tracks for the nav tone and the horizons (data-chapter).
  chapter?: string;
  children: ReactNode;
};

export function Section({ className, id, labelledBy, chapter, children }: SectionProps) {
  return (
    <section className={className} id={id} aria-labelledby={labelledBy} data-chapter={chapter}>
      {children}
    </section>
  );
}

// The page's centred content column.
export function Wrap({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx("wrap", className)}>{children}</div>;
}
