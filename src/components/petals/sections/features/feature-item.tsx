import type { Feature } from "@/content/features";
import { cx } from "@/lib/cx";
import { ordinal } from "@/lib/ordinal";

// One feature: its rule, number, copy and the key glyph the motion layer draws. The first ships active.
export function FeatureItem({ feature, index }: { feature: Feature; index: number }) {
  return (
    <li className={cx("flist__item", index === 0 && "is-active")} data-feature={index}>
      <span className="flist__rule" aria-hidden="true" /> <span className="flist__ix">{ordinal(index)}</span>{" "}
      <div className="flist__txt">
        <h3>{feature.title}</h3>
        <p>{feature.body}</p>
      </div>{" "}
      <svg className="flist__key" viewBox="-17 -17 34 34" aria-hidden="true" data-key-glyph={index} />
    </li>
  );
}
