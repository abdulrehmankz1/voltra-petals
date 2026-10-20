import type { FaqEntry } from "@/content/faq";
import { cx } from "@/lib/cx";
import { ordinal } from "@/lib/ordinal";

// One question. The first ships open and the rest hidden; the accordion in the motion layer toggles is-open,
// aria-expanded and hidden from there.
export function FaqItem({ entry, index }: { entry: FaqEntry; index: number }) {
  const open = index === 0;
  const answerId = `qa${index + 1}`;
  const questionId = `${answerId}-b`;
  return (
    <div className={cx("qa", open && "is-open")}>
      <span className="qa__bg" aria-hidden="true" />{" "}
      <h3 className="qa__h">
        <button className="qa__btn" type="button" id={questionId} aria-expanded={open} aria-controls={answerId}>
          <span className="qa__ix">{ordinal(index)}</span>
          <span className="qa__q">{entry.question}</span>
          <span className="qa__tog" aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
      </h3>{" "}
      <div className="qa__panel" id={answerId} role="region" aria-labelledby={questionId} hidden={!open}>
        <p>{entry.answer}</p>
      </div>
    </div>
  );
}
