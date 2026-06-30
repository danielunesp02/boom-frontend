import { useEffect, useMemo, useState } from "react";
import { CompactMetricGrid } from "./CompactMetricGrid";
import { DashboardPeriodFilter, type DashboardPeriodState } from "./DashboardPeriodFilter";
import { getParentDashboard } from "./dashboardApi";
import type { ParentDashboard } from "./dashboardTypes";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function daysAgoIso(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}

/**
 * Example only.
 *
 * Copy the period state, filter, API query and CompactMetricGrid
 * into the existing ParentDashboardPage instead of replacing the page blindly.
 */
export function ParentDashboardPeriodExample() {
  const [period, setPeriod] = useState<DashboardPeriodState>({
    periodPreset: "LAST_30_DAYS",
    startDate: daysAgoIso(29),
    endDate: todayIso(),
  });

  const [dashboard, setDashboard] = useState<ParentDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const requestKey = useMemo(
    () => `${period.periodPreset}:${period.startDate}:${period.endDate}`,
    [period],
  );

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      setIsLoading(true);

      try {
        const data = await getParentDashboard({
          periodPreset: period.periodPreset,
          startDate: period.startDate,
          endDate: period.endDate,
          locale: localStorage.getItem("boom.user.locale") ?? "pt-BR",
        });

        if (!cancelled) {
          setDashboard(data);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [requestKey, period]);

  return (
    <>
      <DashboardPeriodFilter value={period} onChange={setPeriod} />

      {isLoading && <div>Loading...</div>}

      {dashboard && (
        <CompactMetricGrid
          metrics={dashboard.metrics}
          comparisonLabel={dashboard.selectedPeriod.comparisonLabel}
        />
      )}
    </>
  );
}
