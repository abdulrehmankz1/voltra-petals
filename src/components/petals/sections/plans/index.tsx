import { comparePlans, plans, plansIntro } from "@/content/plans";
import { spaced } from "@/lib/spaced";
import { TextLink } from "../../primitives/button";
import { SectionIntro } from "../../primitives/heading";
import { Section, Wrap } from "../../primitives/layout";
import { Billing } from "./billing";
import { PlanCard } from "./plan-card";

// 07 Pricing: the plans open around Plus like petals around a heart (data-plans); the petal art behind the
// section (data-pricing-art) is drawn by the motion layer. "Compare plans" sits in the aside from small screens
// up and under the plans on the smallest.
export function Plans() {
  return (
    <Section className="pricing paper" id="pricing" labelledBy="pricing-title" chapter="pricing">
      <svg className="pricing__art" aria-hidden="true" data-pricing-art="" />{" "}
      <Wrap>
        <div className="pricing__head">
          <SectionIntro className="pricing__intro" id="pricing-title" intro={plansIntro} />{" "}
          <div className="pricing__aside" data-reveal="">
            <Billing />{" "}
            <TextLink href={comparePlans.href} className="no-xs">
              {comparePlans.label}
            </TextLink>
          </div>
        </div>{" "}
        <div className="plans" id="plans" data-plans="">
          {spaced(
            plans,
            (plan) => plan.id,
            (plan) => (
              <PlanCard plan={plan} />
            ),
          )}
        </div>{" "}
        <p className="pricing__more xs-only">
          <TextLink href={comparePlans.href}>{comparePlans.label}</TextLink>
        </p>
      </Wrap>
    </Section>
  );
}
