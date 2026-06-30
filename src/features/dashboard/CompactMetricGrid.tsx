import { CompactMetricCard } from "./CompactMetricCard";
import type { MetricSummary } from "./dashboardTypes";
import type { DashboardTranslations } from "./dashboardTranslations";
import "./dashboard.css";

type Props = {
  metrics: MetricSummary[];
  comparisonLabel?: string;
  translations: DashboardTranslations;
};

export function CompactMetricGrid({ metrics, comparisonLabel, translations }: Props) {
  return (
    <section className="compact-metric-section">
      <div className="compact-metric-section-header">
        <h2>{translations.sections.summary}</h2>
        {comparisonLabel && <span>{comparisonLabel}</span>}
      </div>

      <div className="compact-metric-grid">
        {metrics.map((metric) => (
          <CompactMetricCard key={metric.id} metric={metric} />
        ))}
      </div>
    </section>
  );
}
