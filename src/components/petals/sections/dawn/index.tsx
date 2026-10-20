import type { ReactNode } from "react";
import { SceneCanvas } from "../../primitives/backdrop";

// 01 Hero + 02 Proof share one dawn: the canvas runs under both, and its ripples carry the eye into the numbers.
export function Dawn({ children }: { children: ReactNode }) {
  return (
    <div className="dawn" data-dawn="">
      <SceneCanvas className="dawn__canvas" scene="hero" /> {children}
    </div>
  );
}
