import { billing, priceCopy, type Plan } from "@/content/plans";
import { cx } from "@/lib/cx";
import { spaced } from "@/lib/spaced";
import { MarkGlyph } from "../../brand/mark";
import { ButtonLink } from "../../primitives/button";
import { Icon } from "../../primitives/icon";

export function PlanCard({ plan }: { plan: Plan }) {
  const nameId = `plan-${plan.id}`;
  return (
    <article className={cx("plan", `plan--${plan.id}`)} aria-labelledby={nameId}>
      {plan.featured && (
        <>
          <PetalTexture />{" "}
        </>
      )}
      <div className="plan__top">
        {plan.featured && (
          <>
            <p className="badge">
              <i />
              {plan.featured.badge}
            </p>{" "}
          </>
        )}
        <div className="plan__id">
          <PlanGlyph plan={plan} />{" "}
          <div>
            <h3 id={nameId}>{plan.name}</h3>
            <p>{plan.audience}</p>
          </div>
        </div>{" "}
        <PlanPrice price={plan.price} /> <span className="plan__rule" aria-hidden="true" />{" "}
        <ul className="ticks">
          {spaced(
            plan.features,
            (feature) => feature,
            (feature) => (
              <li>
                <Icon name="check" aria-hidden="true" />
                {feature}
              </li>
            ),
          )}
        </ul>
      </div>{" "}
      <ButtonLink href={plan.cta.href} variant={plan.button} size="block" magnetic>
        {plan.cta.label}
      </ButtonLink>
    </article>
  );
}

// Behind the featured plan: a petal and the mark, both drawn by the motion layer.
function PetalTexture() {
  return (
    <div className="plan__tex" aria-hidden="true">
      <svg viewBox="0 0 432 568" preserveAspectRatio="xMaxYMax slice" data-plus-petal="" />
      <svg className="plan__mark" viewBox="0 0 260 170" data-plus-mark="" />
    </div>
  );
}

// The featured plan wears the mono mark; the others a glyph the motion layer draws (data-plan-glyph).
function PlanGlyph({ plan }: { plan: Plan }) {
  if (plan.featured)
    return (
      <span className="plan__glyph plan__glyph--mark" aria-hidden="true">
        <MarkGlyph mono />
      </span>
    );
  return <svg className="plan__glyph" viewBox="0 0 48 48" aria-hidden="true" data-plan-glyph={plan.glyph} />;
}

// Ships the initial period's price; data-m / data-y hold both so the toggle can swap them. Paid plans add
// "billed yearly" to the yearly period text.
function PlanPrice({ price }: { price: Plan["price"] }) {
  const per = { m: priceCopy.per, y: price.m > 0 ? `${priceCopy.per}${priceCopy.billedYearly}` : priceCopy.per };
  return (
    <p className="price">
      <span className="price__amt">
        <span className="price__cur">{priceCopy.currency}</span>
        <span className="price__num" data-m={price.m} data-y={price.y}>
          {price[billing.initial]}
        </span>
      </span>
      <span className="price__per" data-m={per.m} data-y={per.y}>
        {per[billing.initial]}
      </span>
    </p>
  );
}
