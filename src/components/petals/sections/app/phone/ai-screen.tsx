import { aiScreen, assistantName, rebalance } from "@/content/app";
import { spaced } from "@/lib/spaced";
import { Icon } from "../../../primitives/icon";
import { ActionChips, AssistantAvatar, GlassButton } from "./parts";

// Phone c: the conversation with Voltra AI. The motion layer reveals each bubble (data-bubble) in turn.
export function AiScreen() {
  const { status, stamp, greeting, question, chips, composer } = aiScreen;
  return (
    <>
      <div className="ai-head">
        <GlassButton icon="back" />{" "}
        <span className="ai-head__id">
          <AssistantAvatar />
          <span>
            <b>{assistantName}</b>
            <small>
              <i />
              {status}
            </small>
          </span>
        </span>{" "}
        <GlassButton icon="sliders" />
      </div>{" "}
      <div className="chat">
        <p className="chat__stamp">{stamp}</p>{" "}
        <p className="bub bub--ai" data-bubble="">
          {greeting}
        </p>{" "}
        <p className="bub bub--ai" data-bubble="">
          {rebalance.feesNote}
        </p>{" "}
        <p className="bub bub--me" data-bubble="">
          {question}
        </p>{" "}
        <div className="bub bub--ai bub--ans" data-bubble="">
          <p>{rebalance.advice}</p> <RebalancePreview />
        </div>{" "}
        <ActionChips chips={chips} bubble />
      </div>{" "}
      <div className="composer">
        <Icon name="plus" />
        <span>{composer}</span>
        <span className="composer__send">
          <Icon name="send" />
        </span>
      </div>
    </>
  );
}

// The answer's preview: the two legs of the trade, the outcome and the allocation it leaves.
function RebalancePreview() {
  const { legs, after, shares } = aiScreen.preview;
  return (
    <div className="pv">
      {spaced(
        legs,
        (leg) => leg.side,
        (leg) => (
          <p className="pv__row">
            <span>{leg.side}</span>
            <b>{leg.amount}</b>
            <span>{leg.fiat}</span>
          </p>
        ),
      )}{" "}
      <p className="pv__after">
        <span>{after.label}</span>
        <em>{after.status}</em>
      </p>{" "}
      <p className="pv__bar">
        {shares.map((share) => (
          <i key={share.ticker} style={{ "--w": String(share.share) }} />
        ))}
      </p>{" "}
      <p className="pv__leg">
        {shares.map((share) => (
          <span key={share.ticker}>
            <i />
            {`${share.ticker} ${share.share}%`}
          </span>
        ))}
      </p>
    </div>
  );
}
