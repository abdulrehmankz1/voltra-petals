import { statusTime } from "@/content/app";

// The four signal bars, then the battery outline and its charge.
const SIGNAL = [
  { x: "0", y: "8", height: "4" },
  { x: "5", y: "5.4", height: "6.6" },
  { x: "10", y: "2.8", height: "9.2" },
  { x: "15", y: "0", height: "12" },
] as const;

// iOS status bar: clock, signal and battery.
export function StatusBar() {
  return (
    <div className="sbar">
      <span>{statusTime}</span>
      <svg className="sbar__ic" viewBox="0 0 66 12">
        {SIGNAL.map((bar) => (
          <rect key={bar.x} {...bar} width="3" rx="1" />
        ))}
        <rect x="40.5" y=".5" width="23" height="11" rx="3.5" fill="none" stroke="currentColor" strokeOpacity=".4" />
        <rect x="42.5" y="2.5" width="16" height="7" rx="2" />
      </svg>
    </div>
  );
}
