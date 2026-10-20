import { closeCopy } from "@/content/close";
import { spaced } from "@/lib/spaced";
import { MarkGlyph } from "../../brand/mark";
import { Horizon, SceneCanvas } from "../../primitives/backdrop";
import { ButtonLink } from "../../primitives/button";
import { Icon } from "../../primitives/icon";
import { Section } from "../../primitives/layout";

// 09 Close: dawn rises behind the largest bloom on the page. The copy rises in with data-close-in; the title is
// revealed word by word (data-words).
export function Close() {
  const { eyebrow, title, lede, primary, secondary, platformsLabel, platforms } = closeCopy;
  return (
    <Section className="close ink" id="get" labelledBy="close-title" chapter="close">
      <SceneCanvas className="close__canvas" scene="close" /> <Horizon from="paper" />{" "}
      <div className="wrap close__copy">
        <p className="close__eyebrow" data-close-in="">
          <MarkGlyph decorative />
          <span className="eyebrow">{eyebrow}</span>
        </p>{" "}
        <h2 className="display close__title" id="close-title" data-words="">
          {title}
        </h2>{" "}
        <p className="lead close__lead" data-close-in="">
          {lede}
        </p>{" "}
        <div className="ctas ctas--center" data-close-in="">
          <ButtonLink href={primary.href} variant="light" magnetic>
            {primary.label}
          </ButtonLink>{" "}
          <ButtonLink href={secondary.href} variant="ghost" magnetic>
            {secondary.label}
          </ButtonLink>
        </div>{" "}
        <ul className="platforms" aria-label={platformsLabel} data-close-in="">
          {spaced(
            platforms,
            (platform) => platform.label,
            (platform) => (
              <li className="plat">
                <Icon name={platform.icon} aria-hidden="true" />
                {platform.label}
              </li>
            ),
          )}
        </ul>
      </div>
    </Section>
  );
}
