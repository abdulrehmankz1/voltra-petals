import type { IconName } from "@/components/petals/brand/icon-artwork";
import type { Pair, SectionIntro, Triple } from "./types";

export const appIntro = {
  eyebrow: "The app",
  title: ["Numbers,", "softly held."],
  lede: "Balances, keys and the next sensible move, together on one calm screen.",
} satisfies SectionIntro;

// The three phones are one image to assistive tech; this is its whole description.
export const appStageLabel =
  "The Voltra app on three phones: the home screen with a total balance of $24,860.42, the analytics screen and the Voltra AI assistant suggesting a $1,480 rebalance from ETH to BTC.";

// ---------- shared by the screens ----------

export const statusTime = "9:41";

export const assistantName = "Voltra AI";

// The motion layer counts the whole dollars up from data-count-money; the cents stay put.
export const totalBalance = { label: "Total balance", count: 24860, whole: "$24,860", cents: ".42" } as const;

export type Trend = "up" | "down";

export type Holding = {
  name: string;
  ticker: string;
  amount: string;
  value: string;
  change: string;
  trend: Trend;
  // Share of the portfolio and its colour in the allocation legend.
  share: string;
  colour: string;
  // Coins with sprite artwork show their icon; the rest show a letter.
  badge: { icon: IconName } | { letter: string };
};

export const holdings: Triple<Holding> = [
  {
    name: "Bitcoin",
    ticker: "BTC",
    amount: "0.2841",
    value: "$18,204.10",
    change: "+1.8%",
    trend: "up",
    share: "73.2%",
    colour: "#1C40DA",
    badge: { icon: "btc" },
  },
  {
    name: "Ethereum",
    ticker: "ETH",
    amount: "1.62",
    value: "$5,120.66",
    change: "-0.6%",
    trend: "down",
    share: "20.6%",
    colour: "#4F7DFF",
    badge: { icon: "eth" },
  },
  {
    name: "Solana",
    ticker: "SOL",
    amount: "12.4",
    value: "$1,535.66",
    change: "+3.1%",
    trend: "up",
    share: "6.2%",
    colour: "#8EAEFF",
    badge: { letter: "S" },
  },
];

// Voltra AI's suggestion, read on the home screen and answered in the chat.
export const rebalance = {
  advice: "Your ETH share is 21%, above your 15% target. Moving $1,480 to BTC brings you back on plan.",
  feesNote: "ETH fees are 38% below average. A good window to rebalance.",
} as const;

// A suggestion chip under a message; the dark one is the primary action.
export type ActionChip = { label: string; dark?: true };

const rebalanceNow: ActionChip = { label: "Rebalance now", dark: true };
const explain: ActionChip = { label: "Explain" };

// The tab bar: two tabs either side of the centre mark; `current` is the screen's own tab.
export type TabId = "home" | "trend" | "card" | "apps";

export const tabs: Pair<Pair<TabId>> = [
  ["home", "trend"],
  ["card", "apps"],
];

// ---------- Analytics (phone a) ----------

export type Kpi = {
  label: string;
  value: string;
  // "/ 100" after the value.
  outOf?: string;
  valueTrend?: Trend;
  // A bar filled to a 0-1 ratio (the motion layer grows it), or a sub line.
  detail: { bar: string } | { sub: string; trend?: Trend };
};

export const analyticsScreen = {
  title: "Analytics",
  change: { amount: "+$1,906.21 (+8.3%)", period: "Last 30 days" },
  ranges: ["1D", "1W", "1M", "1Y", "All"],
  currentRange: "1M",
  axis: ["17 Sep", "2 Oct", "Today"],
  kpis: [
    { label: "Health", value: "82", outOf: "/ 100", detail: { bar: "0.82" } },
    { label: "Today", value: "+2.4%", valueTrend: "up", detail: { sub: "+$582.10" } },
    { label: "Best mover", value: "SOL", detail: { sub: "+3.1%", trend: "up" } },
  ] satisfies Triple<Kpi>,
  allocation: { label: "Allocation", count: "3 assets" },
  insight: rebalance.feesNote,
  tab: "trend" satisfies TabId,
} as const;

// ---------- Voltra AI (phone c) ----------

export type PreviewLeg = { side: string; amount: string; fiat: string };

export const aiScreen = {
  status: "Watching 43 networks",
  stamp: "Today 9:38",
  greeting: "Good evening, Alex. You’re up $582.10 today. Solana is your best mover at +3.1%.",
  question: "Am I still on plan?",
  preview: {
    legs: [
      { side: "Sell", amount: "0.4682 ETH", fiat: "$1,480.00" },
      { side: "Buy", amount: "0.0231 BTC", fiat: "$1,480.00" },
    ] satisfies Pair<PreviewLeg>,
    after: { label: "After rebalancing", status: "On plan" },
    // The allocation once rebalanced: bar widths (in %) and the legend.
    shares: [
      { ticker: "BTC", share: 79.2 },
      { ticker: "ETH", share: 14.6 },
      { ticker: "SOL", share: 6.2 },
    ],
  },
  chips: [rebalanceNow, explain, { label: "Remind me Friday" }] satisfies readonly ActionChip[],
  composer: "Ask Voltra anything",
} as const;

// ---------- Home (phone b) ----------

export const homeScreen = {
  user: { initials: "AM", greeting: "Good evening", name: "Alex Morgan" },
  change: { amount: "+$582.10 (2.4%)", period: "Today" },
  nextMove: {
    title: "Your next sensible move",
    when: "Now",
    bar: { label: "ETH share 20.6%", target: "Target 15%", ratio: "0.206" },
    chips: [rebalanceNow, explain] satisfies readonly ActionChip[],
  },
  keys: { title: "Your keys", detail: "3 shares safe · any 2 can sign", status: "Safe" },
  assets: { title: "Assets", more: "See all" },
  tab: "home" satisfies TabId,
} as const;

// The chip floating over the stage.
export const keysChip = { title: "Keys secured", detail: "Any two can sign" } as const;

// ---------- benefits under the stage ----------

export type Benefit = { icon: IconName; title: string; body: string };

export const benefits: Triple<Benefit> = [
  { icon: "wallet", title: "One calm total", body: "Every chain and token in one balance that moves with the market." },
  { icon: "lock", title: "Keys in view", body: "See which key shares are ready, and recover a lost phone with the other two." },
  {
    icon: "spark",
    title: "The next sensible move",
    body: "Voltra AI suggests one step at a time. Nothing moves until you approve.",
  },
];
