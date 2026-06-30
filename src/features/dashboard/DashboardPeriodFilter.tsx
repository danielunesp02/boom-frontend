import type { DashboardPeriodPreset } from "./dashboardTypes";
import type { DashboardTranslations } from "./dashboardTranslations";
import "./dashboard.css";

export type DashboardPeriodState = {
  periodPreset: DashboardPeriodPreset;
  startDate: string;
  endDate: string;
};

type Props = {
  value: DashboardPeriodState;
  onChange: (value: DashboardPeriodState) => void;
  translations: DashboardTranslations;
};

const presetValues: DashboardPeriodPreset[] = [
  "LAST_7_DAYS",
  "LAST_30_DAYS",
  "LAST_90_DAYS",
  "CURRENT_MONTH",
  "CUSTOM",
];

export function DashboardPeriodFilter({ value, onChange, translations }: Props) {
  const isCustom = value.periodPreset === "CUSTOM";

  return (
    <section className="dashboard-period-filter" aria-label={translations.period.ariaLabel}>
      <div>
        <label className="dashboard-period-label" htmlFor="dashboard-period">
          {translations.period.label}
        </label>
        <select
          id="dashboard-period"
          value={value.periodPreset}
          onChange={(event) =>
            onChange({
              ...value,
              periodPreset: event.target.value as DashboardPeriodPreset,
            })
          }
        >
          {presetValues.map((preset) => (
            <option key={preset} value={preset}>
              {translations.period.presets[preset]}
            </option>
          ))}
        </select>
      </div>

      {isCustom && (
        <div className="dashboard-custom-range">
          <label>
            {translations.period.start}
            <input
              type="date"
              value={value.startDate}
              onChange={(event) => onChange({ ...value, startDate: event.target.value })}
            />
          </label>

          <label>
            {translations.period.end}
            <input
              type="date"
              value={value.endDate}
              onChange={(event) => onChange({ ...value, endDate: event.target.value })}
            />
          </label>
        </div>
      )}
    </section>
  );
}
