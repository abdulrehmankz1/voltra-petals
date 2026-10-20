import { stepPrefix, steps, stepsIntro, type Step as StepContent } from "@/content/steps";
import { ordinal } from "@/lib/ordinal";
import { spaced } from "@/lib/spaced";
import { Horizon } from "../../primitives/backdrop";
import { SectionIntro } from "../../primitives/heading";
import { Section } from "../../primitives/layout";

// 06 How it works: one stem draws through three stages, bud, two petals, full bloom. The motion layer pins the
// chapter (data-how-pin), draws the stem (data-how-art) and lights each step (data-step) in turn.
export function Steps() {
  return (
    <Section className="how paper" id="how" labelledBy="how-title" chapter="how">
      <div className="how__pin" data-how-pin="">
        <Horizon from="ink" /> <svg className="how__art" aria-hidden="true" data-how-art="" />{" "}
        <SectionIntro className="wrap how__head" id="how-title" intro={stepsIntro} />{" "}
        <ol className="steps" data-steps="">
          {spaced(
            steps,
            (step) => step.title,
            (step, index) => (
              <Step step={step} index={index} />
            ),
          )}
        </ol>
      </div>
    </Section>
  );
}

// One step: its number ("Step 01" on mobile), heading and body.
function Step({ step, index }: { step: StepContent; index: number }) {
  return (
    <li className="step" data-step={index}>
      <span className="step__ix">
        <span className="m-only">{stepPrefix}</span>
        {ordinal(index)}
      </span>
      <h3>{step.title}</h3>
      <p>{step.body}</p>
    </li>
  );
}
