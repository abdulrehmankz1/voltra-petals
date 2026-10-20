import { statText, type Stat } from "@/content/proof";

// One figure. Screen readers get the final text once; the visual pair is a ghost that holds the width and the
// live number the motion layer counts up from its data-* hooks.
export function ProofStat({ stat }: { stat: Stat }) {
  const text = statText(stat);
  return (
    <li className="stat" data-reveal="">
      <span className="stat__num" aria-hidden="true">
        <span className="stat__size">{text}</span>
        <span
          className="stat__val"
          data-count={stat.count}
          data-decimals={stat.decimals}
          data-prefix={stat.prefix}
          data-suffix={stat.suffix}
        >
          {text}
        </span>
      </span>{" "}
      <span className="sr-only">{text}</span> <span className="stat__cap">{stat.label}</span>
    </li>
  );
}
