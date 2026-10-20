import { benefits, type Benefit } from "@/content/app";
import { spaced } from "@/lib/spaced";
import { Icon } from "../../primitives/icon";

// The three benefits under the stage.
export function Benefits() {
  return (
    <ul className="benefits">
      {spaced(
        benefits,
        (benefit) => benefit.title,
        (benefit) => (
          <BenefitItem benefit={benefit} />
        ),
      )}
    </ul>
  );
}

function BenefitItem({ benefit }: { benefit: Benefit }) {
  return (
    <li className="benefit" data-reveal="">
      <span className="benefit__rule" aria-hidden="true" />{" "}
      <span className="ibub" aria-hidden="true">
        <Icon name={benefit.icon} />
      </span>{" "}
      <div>
        <h3>{benefit.title}</h3>
        <p>{benefit.body}</p>
      </div>
    </li>
  );
}
