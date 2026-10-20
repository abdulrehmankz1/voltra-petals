import { faqIntro, faqs } from "@/content/faq";
import { spaced } from "@/lib/spaced";
import { SectionIntro } from "../../primitives/heading";
import { Section } from "../../primitives/layout";
import { FaqItem } from "./faq-item";

// 08 FAQ: the lens (data-lens) is built in front of you; answers open softly (the accordion is data-faq).
export function Faq() {
  return (
    <Section className="faq paper" id="faq" labelledBy="faq-title" chapter="faq">
      <div className="wrap faq__grid">
        <SectionIntro className="faq__head" id="faq-title" intro={faqIntro}>
          <div className="faq__lens" aria-hidden="true" data-lens="" />
        </SectionIntro>{" "}
        <div className="qas" data-faq="">
          {spaced(
            faqs,
            (entry) => entry.question,
            (entry, index) => (
              <FaqItem entry={entry} index={index} />
            ),
          )}
        </div>
      </div>
    </Section>
  );
}
