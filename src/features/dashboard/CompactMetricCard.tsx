import type { MetricSummary, TrendDirection } from "./dashboardTypes";
import "./dashboard.css";

type Props = {
  metric: MetricSummary;
};

const trendSymbol: Record<TrendDirection, string> = {
  UP: "↑",
  DOWN: "↓",
  STABLE: "→",
};

export function CompactMetricCard({ metric }: Props) {
  const trendClass = {
    UP: "trend-up",
    DOWN: "trend-down",
    STABLE: "trend-stable",
  }[metric.trendDirection];

  return (
    <article className="compact-metric-card">
      <div className="compact-metric-header">
        <span className="compact-metric-label">{metric.label}</span>
        <span className={`compact-trend-pill ${trendClass}`}>
          <span aria-hidden="true">{trendSymbol[metric.trendDirection]}</span>
          {metric.trendLabel}
        </span>
      </div>

      <div className="compact-metric-value">{metric.value}</div>
      <p className="compact-metric-helper">{metric.helperText}</p>
    </article>
  );
}
