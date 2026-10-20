import { analyticsScreen, assistantName, holdings, type Holding, type Kpi } from "@/content/app";
import { cx } from "@/lib/cx";
import { spaced } from "@/lib/spaced";
import { MarkGlyph } from "../../../brand/mark";
import { Icon } from "../../../primitives/icon";
import { AssistantAvatar, Balance, GlassButton, TabBar } from "./parts";

// Phone a. The motion layer draws the decoration (data-an-deco), the 30 day chart (data-chart) with its pin, the
// KPI bar and the allocation bloom (data-alloc-glyph).
export function AnalyticsScreen() {
  const { title, change, ranges, currentRange, axis, kpis, allocation, insight, tab } = analyticsScreen;
  return (
    <>
      <svg className="an-deco" viewBox="0 0 390 440" data-an-deco="" />{" "}
      <div className="an-head">
        <b>{title}</b>
        <span className="an-head__btns">
          <GlassButton icon="sliders" />
          <GlassButton icon="bell" dot />
        </span>
      </div>{" "}
      <Balance className="bal--an" change={change} />{" "}
      <div className="range">
        {ranges.map((range) => (
          <span key={range} className={range === currentRange ? "on" : undefined}>
            {range}
          </span>
        ))}
      </div>{" "}
      <div className="chart">
        <svg viewBox="0 0 350 136" data-chart="a" />{" "}
        <span className="chart__pin" data-chart-pin="">
          <MarkGlyph />
        </span>{" "}
        <div className="chart__x">
          {axis.map((tick) => (
            <span key={tick}>{tick}</span>
          ))}
        </div>
      </div>{" "}
      <div className="card kpis">
        {spaced(
          kpis,
          (kpi) => kpi.label,
          (kpi) => (
            <KpiTile kpi={kpi} />
          ),
        )}
      </div>{" "}
      <div className="card alloc">
        <svg className="alloc__bloom" viewBox="-40 -40 80 80" data-alloc-glyph="" />{" "}
        <div className="alloc__body">
          <p className="alloc__h">
            <small>{allocation.label}</small>
            <span>{allocation.count}</span>
          </p>{" "}
          <ul className="alloc__legend">
            {spaced(
              holdings,
              (holding) => holding.ticker,
              (holding) => (
                <LegendRow holding={holding} />
              ),
            )}
          </ul>
        </div>
      </div>{" "}
      <div className="card ai-row">
        <AssistantAvatar />{" "}
        <p>
          <small>{assistantName}</small>
          {insight}
        </p>{" "}
        <span className="ai-row__go">
          <Icon name="arrow" />
        </span>
      </div>{" "}
      <TabBar current={tab} />
    </>
  );
}

// A KPI: its value (with "/ 100" where it is a score), then a bar the motion layer fills or a sub line.
function KpiTile({ kpi }: { kpi: Kpi }) {
  const { detail } = kpi;
  return (
    <div className="kpi">
      <small>{kpi.label}</small>
      <b className={kpi.valueTrend}>
        {kpi.outOf ? (
          <>
            {kpi.value} <i>{kpi.outOf}</i>
          </>
        ) : (
          kpi.value
        )}
      </b>
      {"bar" in detail ? (
        <span className="kpi__bar">
          <i data-bar={detail.bar} />
        </span>
      ) : (
        <span className={cx("kpi__sub", detail.trend)}>{detail.sub}</span>
      )}
    </div>
  );
}

function LegendRow({ holding }: { holding: Holding }) {
  return (
    <li>
      <i style={{ "--c": holding.colour }} />
      {holding.name}
      <span>{holding.value}</span>
      <b>{holding.share}</b>
    </li>
  );
}
