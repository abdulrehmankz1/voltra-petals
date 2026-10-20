import { custodyNote, securityIntro } from "@/content/security";
import { Horizon } from "../../primitives/backdrop";
import { Chip } from "../../primitives/chip";
import { SectionIntro } from "../../primitives/heading";
import { Icon } from "../../primitives/icon";
import { Section } from "../../primitives/layout";
import { Keys } from "./keys";

// 05 Security: three petals, two lit; an arc closes between the two that sign. The inner wrap is the footer's
// Privacy target (#privacy).
export function Security() {
  return (
    <Section className="security ink" id="security" labelledBy="security-title" chapter="security">
      <Horizon from="paper" />{" "}
      <div className="wrap security__inner" id="privacy">
        <SectionIntro className="security__copy" id="security-title" intro={securityIntro}>
          <Chip className="chip--note no-xs" reveal="scroll" bud={<Icon name="lock" aria-hidden="true" />}>
            {custodyNote}
          </Chip>
        </SectionIntro>{" "}
        <Keys />
      </div>
    </Section>
  );
}
