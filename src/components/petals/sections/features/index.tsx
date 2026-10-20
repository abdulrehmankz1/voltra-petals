import { features, featuresIntro } from "@/content/features";
import { spaced } from "@/lib/spaced";
import { Horizon } from "../../primitives/backdrop";
import { SectionIntro } from "../../primitives/heading";
import { Section, Wrap } from "../../primitives/layout";
import { FeatureItem } from "./feature-item";

// 03 Features: paper rises over the dark like daylight; the bloom (data-features-art) opens one feature at a time
// as the list (data-flist) is scrolled.
export function Features() {
  return (
    <Section className="features paper" id="product" labelledBy="features-title" chapter="features">
      <Horizon from="ink" />{" "}
      <Wrap className="features__inner">
        <SectionIntro className="features__head" id="features-title" intro={featuresIntro} />{" "}
        <div className="features__art" aria-hidden="true" data-features-art="" />{" "}
        <ol className="flist" data-flist="">
          {spaced(
            features,
            (feature) => feature.title,
            (feature, index) => (
              <FeatureItem feature={feature} index={index} />
            ),
          )}
        </ol>
      </Wrap>
    </Section>
  );
}
