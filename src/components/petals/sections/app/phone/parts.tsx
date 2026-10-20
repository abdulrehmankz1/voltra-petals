import { tabs, totalBalance, type ActionChip, type TabId } from "@/content/app";
import { cx } from "@/lib/cx";
import { spaced } from "@/lib/spaced";
import type { IconName } from "../../../brand/icon-artwork";
import { MarkGlyph } from "../../../brand/mark";
import { Icon } from "../../../primitives/icon";

// Pieces shared by the three screens. The phones sit inside the stage's hidden layer, so none of these carry
// accessibility attributes of their own.

// A round glass button in a screen header; `dot` marks unread (the bell).
export function GlassButton({ icon, dot }: { icon: IconName; dot?: boolean }) {
  return (
    <span className={cx("gbtn", dot && "gbtn--dot")}>
      <Icon name={icon} />
    </span>
  );
}

// The assistant's avatar: the mono mark in a bud.
export function AssistantAvatar() {
  return (
    <span className="vavatar">
      <MarkGlyph mono />
    </span>
  );
}

// The total balance (counted up by the motion layer) and its change over a period.
export function Balance({ className, change }: { className?: string; change: { amount: string; period: string } }) {
  return (
    <div className={cx("bal", className)}>
      <small>{totalBalance.label}</small>{" "}
      <p className="bal__v">
        <span data-count-money={totalBalance.count}>{totalBalance.whole}</span>
        <span className="bal__c">{totalBalance.cents}</span>
      </p>{" "}
      <p className="bal__d">
        <span className="pill-up">{change.amount}</span>
        <span>{change.period}</span>
      </p>
    </div>
  );
}

// Suggestion chips under a message; `bubble` makes the row one of the chat's revealed bubbles.
export function ActionChips({ chips, bubble }: { chips: readonly ActionChip[]; bubble?: boolean }) {
  return (
    <p className="chips" data-bubble={bubble ? "" : undefined}>
      {chips.map((chip) => (
        <span key={chip.label} className={cx("chipb", chip.dark && "chipb--dark")}>
          {chip.label}
        </span>
      ))}
    </p>
  );
}

// Bottom tab bar: two tabs, the mark in the centre, two tabs; the screen's own tab is lit.
export function TabBar({ current }: { current: TabId }) {
  const [left, right] = tabs;
  const tab = (id: TabId) => (
    <span className={id === current ? "on" : undefined}>
      <Icon name={id} />
    </span>
  );
  const side = (ids: readonly TabId[]) => spaced(ids, (id) => id, tab);
  return (
    <div className="tabbar">
      {side(left)}{" "}
      <span className="tabbar__mark">
        <MarkGlyph mono />
      </span>{" "}
      {side(right)}
    </div>
  );
}
