import { billing } from "@/content/plans";
import { spaced } from "@/lib/spaced";

// Monthly / yearly radio toggle and its note. Ships in the initial period; the motion layer moves the thumb, swaps
// the note between its data-m / data-y and every price's data-m / data-y.
export function Billing() {
  return (
    <>
      {/* A fieldset is not trimmed like a block, so the spaces at its edges are the original's. */}
      <fieldset className="billing" data-billing="">
        {" "}
        <legend className="sr-only">{billing.label}</legend>{" "}
        {spaced(
          billing.periods,
          (period) => period.id,
          (period) => (
            <label className="billing__opt">
              <input type="radio" name={billing.name} value={period.id} defaultChecked={period.id === billing.initial} />
              <span>{period.label}</span>
            </label>
          ),
        )}{" "}
        <span className="billing__thumb" aria-hidden="true" />{" "}
      </fieldset>{" "}
      <p className="pricing__note">
        <span data-billing-note="" data-m={billing.note.m} data-y={billing.note.y} aria-live="polite">
          {billing.note[billing.initial]}
        </span>
      </p>
    </>
  );
}
