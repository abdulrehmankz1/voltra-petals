import type { ReactNode } from "react";

// Hero and proof share one dawn: the canvas runs under both
export function Dawn({ children }: { children: ReactNode }) {
  return (
    <div className="dawn" data-dawn="">
      <canvas className="dawn__canvas" data-scene="hero" aria-hidden="true" />
      {" "}
      {children}
    </div>
  );
}
