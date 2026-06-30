import { useEffect, useState } from "react";
import { CompactMetricGrid } from "./CompactMetricGrid";
import { DashboardPeriodFilter, type DashboardPeriodState } from "./DashboardPeriodFilter";
import { getParentDashboard } from "./dashboardApi";
import type { ParentDashboard } from "./dashboardTypes";
import { getDashboardTranslations } from "./dashboardTranslations";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function daysAgoIso(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}

export function ParentDashboardPeriodExample() {
  const locale = localStorage.getItem("boom.user.locale") ?? "pt-BR";
  const translations = getDashboardTranslations(locale);

  const [period, setPeriod] = useState<DashboardPeriodState>({
    periodPreset: "LAST_30_DAYS",
    startDate: daysAgoIso(29),
    endDate: todayIso(),
  });

  const [dashboard, setDashboard] = useState<ParentDashboard | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      const data = await getParentDashboard({
        periodPreset: period.periodPreset,
        startDate: period.startDate,
        endDate: period.endDate,
        locale,
      });

      if (!cancelled) {
        setDashboard(data);
      }
    }

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [period.periodPreset, period.startDate, period.endDate, locale]);

  return (
    <main className="dashboard-page">
      <DashboardPeriodFilter value={period} onChange={setPeriod} translations={translations} />

      {dashboard && (
        <CompactMetricGrid
          metrics={dashboard.metrics}
          comparisonLabel={dashboard.selectedPeriod.comparisonLabel}
          translations={translations}
        />
      )}
    </main>
  );
}
