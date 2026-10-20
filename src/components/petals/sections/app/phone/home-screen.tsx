import { assistantName, holdings, homeScreen, rebalance, type Holding } from "@/content/app";
import { spaced } from "@/lib/spaced";
import { Icon } from "../../../primitives/icon";
import { ActionChips, AssistantAvatar, Balance, GlassButton, TabBar } from "./parts";

// Phone b, in front: greeting, balance, Voltra AI's next move, the key shares and the assets.
export function HomeScreen() {
  const { user, change, keys, assets, tab } = homeScreen;
  return (
    <>
      <div className="h-head">
        <span className="avatar">{user.initials}</span>{" "}
        <span className="h-head__t">
          <small>{user.greeting}</small>
          <b>{user.name}</b>
        </span>{" "}
        <GlassButton icon="scan" /> <GlassButton icon="bell" dot />
      </div>{" "}
      <Balance change={change} /> <NextMove />{" "}
      <div className="card keysc">
        <span className="keysc__ic">
          <Icon name="lock" />
        </span>{" "}
        <span className="keysc__t">
          <b>{keys.title}</b>
          <small>{keys.detail}</small>
        </span>{" "}
        <span className="safe">
          <i />
          {keys.status}
        </span>
      </div>{" "}
      <div className="card assets">
        <p className="assets__h">
          <b>{assets.title}</b>
          <span>{assets.more}</span>
        </p>{" "}
        {spaced(
          holdings,
          (holding) => holding.ticker,
          (holding) => (
            <AssetRow holding={holding} />
          ),
        )}
      </div>{" "}
      <TabBar current={tab} />
    </>
  );
}

// The next-move card: the suggestion, how far ETH sits from its target (the motion layer fills data-bar) and
// what to do about it. The lens behind it is static artwork; its gradient id is local to this card.
function NextMove() {
  const { title, when, bar, chips } = homeScreen.nextMove;
  return (
    <div className="card nm" data-nm="">
      <svg className="nm__lens" viewBox="0 0 350 120" preserveAspectRatio="none">
        <path d="M0 30 Q150 -30 300 30 Q150 90 0 30Z" transform="rotate(-8 150 30)" fill="url(#nmLens)" />
        <defs>
          <linearGradient id="nmLens" x1="0" x2="1">
            <stop offset="0" stopColor="#2F6BFF" stopOpacity=".16" />
            <stop offset=".55" stopColor="#8EAEFF" stopOpacity=".08" />
            <stop offset="1" stopColor="#BCD0FF" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>{" "}
      <div className="nm__top">
        <AssistantAvatar />{" "}
        <span className="nm__t">
          <small>{assistantName}</small>
          <b>{title}</b>
        </span>{" "}
        <span className="nm__now">{when}</span>
      </div>{" "}
      <p className="nm__msg">{rebalance.advice}</p>{" "}
      <div className="nm__bar">
        <p>
          <span>{bar.label}</span>
          <span>{bar.target}</span>
        </p>{" "}
        <span className="nm__track">
          <i data-bar={bar.ratio} />
          <b />
        </span>
      </div>{" "}
      <ActionChips chips={chips} />
    </div>
  );
}

function AssetRow({ holding }: { holding: Holding }) {
  const { badge } = holding;
  return (
    <p className="asset">
      {"icon" in badge ? (
        <span className="coin">
          <Icon name={badge.icon} />
        </span>
      ) : (
        <span className="coin coin--s">{badge.letter}</span>
      )}
      <span className="asset__n">
        <b>{holding.name}</b>
        <small>{`${holding.ticker} ${holding.amount}`}</small>
      </span>
      <span className="asset__v">
        <b>{holding.value}</b>
        <small className={holding.trend}>{holding.change}</small>
      </span>
    </p>
  );
}
