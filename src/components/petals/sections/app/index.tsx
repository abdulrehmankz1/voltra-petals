import { appIntro, appStageLabel, keysChip } from "@/content/app";
import { SectionIntro } from "../../primitives/heading";
import { Icon } from "../../primitives/icon";
import { Section, Wrap } from "../../primitives/layout";
import { Benefits } from "./benefits";
import { AiScreen } from "./phone/ai-screen";
import { AnalyticsScreen } from "./phone/analytics-screen";
import { HomeScreen } from "./phone/home-screen";
import { Phone } from "./phone/phone";

// 04 App: the phones open like petals from one horizon, then the screens come alive. The stage is one image to
// assistive tech; the motion layer scales its 880 x 1080 canvas (data-k) and draws the art behind the phones.
// The phones are in paint order: analytics and the assistant either side, home in front.
export function App() {
  return (
    <Section className="app paper" labelledBy="app-title" chapter="app">
      <Wrap className="app__inner">
        <SectionIntro className="app__head" id="app-title" intro={appIntro} />{" "}
        <div className="app__stage" data-app-stage="" role="img" aria-label={appStageLabel}>
          <div className="app__k" data-k="880x1080" aria-hidden="true">
            <div className="app__artw" data-app-artw="">
              <svg className="app__art" viewBox="0 0 880 1080" focusable="false" data-app-art="" />
            </div>{" "}
            <Phone id="a" screen="an">
              <AnalyticsScreen />
            </Phone>{" "}
            <Phone id="c" screen="ai">
              <AiScreen />
            </Phone>{" "}
            <Phone id="b" screen="home">
              <HomeScreen />
            </Phone>{" "}
            <p className="keys-chip">
              <span className="keys-chip__bud">
                <Icon name="lock" />
              </span>
              <span>
                <b>{keysChip.title}</b>
                <small>{keysChip.detail}</small>
              </span>
            </p>
          </div>
        </div>{" "}
        <Benefits />
      </Wrap>
    </Section>
  );
}
