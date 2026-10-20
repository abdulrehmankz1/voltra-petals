import { hero } from "@/content/hero";
import { MarkGlyph } from "../../brand/mark";
import { ButtonLink } from "../../primitives/button";
import { Chip } from "../../primitives/chip";
import { Lines } from "../../primitives/heading";
import { Section } from "../../primitives/layout";

// 01 Hero. The entrance is choreographed by the motion layer through data-hero-in and data-lines="hero";
// .hero__space holds room for the bloom the dawn canvas draws between the lede and the calls to action.
export function Hero() {
  return (
    <Section className="hero" id="top" labelledBy="hero-title">
      <div className="wrap hero__copy">
        <Chip reveal="hero" bud={<MarkGlyph mono decorative />}>
          {hero.chip}
        </Chip>{" "}
        <h1 className="display h1" id="hero-title" data-lines="hero">
          <Lines lines={hero.title} />
        </h1>{" "}
        <p className="lead hero__lead" data-hero-in="">
          {hero.lede}
        </p>{" "}
        <div className="hero__space" aria-hidden="true" data-hero-space="" />{" "}
        <div className="ctas hero__ctas" data-hero-in="">
          <ButtonLink href={hero.primary.href} variant="light" className="hero__primary" magnetic>
            {hero.primary.label}
          </ButtonLink>{" "}
          <ButtonLink href={hero.secondary.href} variant="ghost" magnetic>
            {hero.secondary.label}
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
