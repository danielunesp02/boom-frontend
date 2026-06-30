import { apiRequest } from "../../lib/apiClient";
import type { DashboardPeriodPreset, ParentDashboard } from "./dashboardTypes";

export type DashboardQuery = {
  periodPreset: DashboardPeriodPreset;
  startDate?: string;
  endDate?: string;
  locale?: string;
};

export function getParentDashboard(query: DashboardQuery): Promise<ParentDashboard> {
  const params = new URLSearchParams();
  params.set("periodPreset", query.periodPreset);

  if (query.periodPreset === "CUSTOM" && query.startDate && query.endDate) {
    params.set("startDate", query.startDate);
    params.set("endDate", query.endDate);
  }

  return apiRequest<ParentDashboard>(`/api/v1/parents/dashboard?${params.toString()}`, {
    headers: {
      ...(query.locale ? { "X-Boom-Locale": query.locale, "Accept-Language": query.locale } : {}),
    },
  });
}
