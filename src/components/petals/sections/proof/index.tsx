import { proofLabel, stats } from "@/content/proof";
import { spaced } from "@/lib/spaced";
import { Section } from "../../primitives/layout";
import { ProofStat } from "./proof-stat";

// 02 Proof: the dawn's horizon (data-proof-hz) under three counted figures.
export function Proof() {
  return (
    <Section className="proof" labelledBy="proof-title" chapter="proof">
      <div className="proof__hz" aria-hidden="true" data-proof-hz="" />{" "}
      <div className="wrap proof__grid">
        <h2 className="eyebrow proof__label" id="proof-title" data-reveal="">
          {proofLabel}
        </h2>{" "}
        <ul className="stats">
          {spaced(
            stats,
            (stat) => stat.label,
            (stat) => (
              <ProofStat stat={stat} />
            ),
          )}
        </ul>
      </div>
    </Section>
  );
}
