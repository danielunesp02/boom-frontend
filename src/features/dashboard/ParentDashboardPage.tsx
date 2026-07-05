import { useEffect, useMemo, useState } from "react";
import "./dashboard.css";
import { getParentDashboard } from "./dashboardApi";
import type { DashboardPeriodPreset, ParentDashboard } from "./dashboardTypes";
import { getDashboardTranslations } from "./dashboardTranslations";

//import { useLocale } from "../../app/locale";

const PRESET_OPTIONS: DashboardPeriodPreset[] = [
  "LAST_7_DAYS",
  "LAST_30_DAYS",
  "LAST_90_DAYS",
  "CURRENT_MONTH",
  "CUSTOM",
];

function formatMinutes(minutes: number) {
  if (!minutes || minutes <= 0) return "0m";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining > 0 ? `${hours}h ${remaining}m` : `${hours}h`;
}

function formatDateLabel(value: string) {
  return value.slice(5);
}

function formatTrendLabel(trend: string) {
  switch (trend) {
    case "IMPROVING":
      return "Improving";
    case "STABLE":
      return "Stable";
    case "DECLINING":
      return "Declining";
    default:
      return trend;
  }
}

function formatItemStatus(status: string) {
  switch (status) {
    case "COMPLETED":
      return "Completed";
    case "IN_PROGRESS":
      return "In progress";
    case "PENDING":
      return "Pending";
    default:
      return status;
  }
}

function statusClass(status: string) {
  switch (status) {
    case "COMPLETED":
      return "status-completed";
    case "IN_PROGRESS":
      return "status-in-progress";
    case "PENDING":
      return "status-pending";
    default:
      return "";
  }
}

function trendClass(trend: string) {
  switch (trend) {
    case "IMPROVING":
      return "trend-improving";
    case "DECLINING":
      return "trend-declining";
    default:
      return "trend-stable";
  }
}

function presetLabel(preset: DashboardPeriodPreset) {
  switch (preset) {
    case "LAST_7_DAYS":
      return "Last 7 days";
    case "LAST_30_DAYS":
      return "Last 30 days";
    case "LAST_90_DAYS":
      return "Last 90 days";
    case "CURRENT_MONTH":
      return "Current month";
    case "CUSTOM":
      return "Custom range";
    default:
      return preset;
  }
}

export function ParentDashboardPage() {
  const locale = localStorage.getItem("boom.user.locale") ?? "en-US";
  const translations = getDashboardTranslations(locale);

  const [dashboard, setDashboard] = useState<ParentDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [periodPreset, setPeriodPreset] = useState<DashboardPeriodPreset>("LAST_30_DAYS");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const result = await getParentDashboard({
          periodPreset,
          startDate: periodPreset === "CUSTOM" ? startDate || undefined : undefined,
          endDate: periodPreset === "CUSTOM" ? endDate || undefined : undefined,
          locale,
        });

        if (!active) return;
        setDashboard(result);
      } catch (err) {
        if (!active) return;
        setError("Não foi possível carregar o dashboard");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [periodPreset, startDate, endDate, locale]);

  const maxStudyTime = useMemo(() => {
    if (!dashboard?.activityHistory?.length) return 1;
    return Math.max(
        ...dashboard.activityHistory.map((item) => item.studyTimeMinutes ?? 0),
        1,
    );
  }, [dashboard]);

  if (loading) {
    return (
        <main className="dashboard-page">
          <div className="dashboard-state-card">Loading dashboard...</div>
        </main>
    );
  }

  if (error || !dashboard) {
    return (
        <main className="dashboard-page">
          <div className="dashboard-state-card dashboard-state-error">
            {error ?? "Não foi possível carregar o dashboard"}
          </div>
        </main>
    );
  }

  return (
      <main className="dashboard-page">
        <header className="dashboard-header">
          <div>
            <span className="dashboard-eyebrow">Parent dashboard</span>
            <h1>{dashboard.student.displayName} progress</h1>
            <p className="dashboard-subtitle">
              {dashboard.student.gradeLevel} • {dashboard.student.targetSchoolSystem}
            </p>
          </div>

          <div className="dashboard-period-toolbar">
            <div className="dashboard-period-field">
              <label htmlFor="periodPreset">Period</label>
              <select
                  id="periodPreset"
                  value={periodPreset}
                  onChange={(event) => setPeriodPreset(event.target.value as DashboardPeriodPreset)}
              >
                {PRESET_OPTIONS.map((preset) => (
                    <option key={preset} value={preset}>
                      {presetLabel(preset)}
                    </option>
                ))}
              </select>
            </div>

            {periodPreset === "CUSTOM" && (
                <>
                  <div className="dashboard-period-field">
                    <label htmlFor="startDate">Start date</label>
                    <input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(event) => setStartDate(event.target.value)}
                    />
                  </div>

                  <div className="dashboard-period-field">
                    <label htmlFor="endDate">End date</label>
                    <input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(event) => setEndDate(event.target.value)}
                    />
                  </div>
                </>
            )}
          </div>
        </header>

        {dashboard.selectedPeriod && (
            <section className="dashboard-period-summary">
              <div>
                <strong>{dashboard.selectedPeriod.label}</strong>
              </div>
              <div>{dashboard.selectedPeriod.comparisonLabel}</div>
            </section>
        )}

        {dashboard.metrics?.length ? (
            <section className="summary-grid">
              {dashboard.metrics.map((metric) => (
                  <article key={metric.id} className="summary-card">
                    <div className="summary-card-header">
                      <span className="summary-card-label">{metric.label}</span>
                      <span className={`summary-trend summary-trend-${metric.trendDirection.toLowerCase()}`}>
                  {metric.trendLabel}
                </span>
                    </div>
                    <strong className="summary-card-value">{metric.value}</strong>
                    <span className="summary-card-helper">{metric.helperText}</span>
                  </article>
              ))}
            </section>
        ) : (
            <section className="summary-grid">
              <article className="summary-card">
                <span className="summary-card-label">Completed activities</span>
                <strong className="summary-card-value">{dashboard.weeklySummary.completedActivities}</strong>
              </article>
              <article className="summary-card">
                <span className="summary-card-label">Study time</span>
                <strong className="summary-card-value">
                  {formatMinutes(dashboard.weeklySummary.totalStudyTimeMinutes)}
                </strong>
              </article>
              <article className="summary-card">
                <span className="summary-card-label">Accuracy</span>
                <strong className="summary-card-value">{dashboard.weeklySummary.averageAccuracy}%</strong>
              </article>
              <article className="summary-card">
                <span className="summary-card-label">Current streak</span>
                <strong className="summary-card-value">{dashboard.weeklySummary.currentStreakDays}d</strong>
              </article>
            </section>
        )}

        <section className="dashboard-two-column">
          <article className="dashboard-card">
            <div className="card-header">
              <h2>{translations.sections.activityHistory}</h2>
              <span className="card-header-note">Study time + activities</span>
            </div>

            <div className="history-list">
              {dashboard.activityHistory.map((item) => {
                const width = Math.max((item.studyTimeMinutes / maxStudyTime) * 100, item.studyTimeMinutes > 0 ? 6 : 0);

                return (
                    <div key={item.date} className="history-row">
                      <div className="history-date">{formatDateLabel(item.date)}</div>

                      <div className="history-bar-area">
                        <div className="history-bar-track">
                          <div className="history-bar-fill" style={{ width: `${width}%` }} />
                          {item.completedActivities > 0 && (
                            <span
                              className="history-activity-badge"
                              title={`${item.completedActivities} completed activities`}
                            >
                              {item.completedActivities}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="history-stats">
                        <strong>{item.completedActivities} activities</strong>
                        <span>{formatMinutes(item.studyTimeMinutes)}</span>
                        <span>{item.accuracy != null ? `${item.accuracy}%` : "—"}</span>
                      </div>
                    </div>
                );
              })}
            </div>
          </article>

          <article className="dashboard-card">
            <div className="card-header">
              <h2>{translations.sections.subjectPerformance}</h2>
            </div>

            <div className="subject-performance-list">
              {dashboard.subjectPerformance.map((subject) => (
                  <div key={subject.subjectId} className="subject-performance-item">
                    <div className="subject-performance-top">
                      <strong>{subject.subjectName}</strong>
                      <span className={`subject-trend-chip ${trendClass(subject.trend)}`}>
                    {formatTrendLabel(subject.trend)}
                  </span>
                    </div>

                    <div className="subject-performance-metrics">
                      <span>{subject.accuracy}% accuracy</span>
                      <span>{formatMinutes(subject.studyTimeMinutes)}</span>
                      <span>{subject.activeGapCount} active gaps</span>
                    </div>
                  </div>
              ))}
            </div>
          </article>
        </section>

        <section className="dashboard-two-column">
          <article className="dashboard-card">
            <div className="card-header">
              <h2>{translations.sections.learningGaps}</h2>
            </div>

            <div className="gap-list">
              {dashboard.learningGaps.map((gap) => (
                  <div key={gap.gapId} className="gap-item">
                    <strong>
                      {gap.subjectName} • {gap.topicName}
                    </strong>
                    <span className="gap-skill">{gap.skillName}</span>
                    <p className="gap-meta">
                      {gap.severity} • {gap.status} • open for {gap.daysOpen} days •{" "}
                      {gap.practiceTimeMinutes}m practiced
                    </p>
                  </div>
              ))}
            </div>
          </article>

          <article className="dashboard-card">
            <div className="card-header">
              <h2>Recent activities</h2>
            </div>

            <div className="recent-activity-list">
              {dashboard.recentActivitySummaries.map((activity) => (
                  <div key={activity.activityId} className="recent-activity-item">
                    <div className="recent-activity-title-row">
                      <strong>{activity.activityTitle}</strong>
                      <span className="recent-activity-meta">
                    {activity.subjectName} • {activity.accuracy}% • {formatMinutes(activity.durationMinutes)}
                  </span>
                    </div>
                    <p>{activity.summaryText}</p>
                  </div>
              ))}
            </div>
          </article>
        </section>

        {dashboard.currentActionPlan && (
            <section className="dashboard-card action-plan-card">
              <div className="card-header">
                <h2>{dashboard.currentActionPlan.title}</h2>
              </div>

              <p className="action-plan-description">{dashboard.currentActionPlan.description}</p>

              <div className="action-plan-meta">
                <span>{dashboard.currentActionPlan.targetSubject}</span>
                <span>{dashboard.currentActionPlan.targetTopic}</span>
                <span>{dashboard.currentActionPlan.targetSkill}</span>
                <span>{dashboard.currentActionPlan.progressPercentage}% completed</span>
              </div>

              <div className="action-plan-progress">
                <div
                    className="action-plan-progress-fill"
                    style={{ width: `${dashboard.currentActionPlan.progressPercentage}%` }}
                />
              </div>

              <ul className="action-plan-list">
                {dashboard.currentActionPlan.items.map((item) => (
                    <li key={item.title} className="action-plan-item">
                      <div className="action-plan-item-main">
                        <strong>{item.title}</strong>
                        <span>{formatMinutes(item.expectedDurationMinutes)}</span>
                      </div>
                      <span className={`action-plan-status ${statusClass(item.status)}`}>
                  {formatItemStatus(item.status)}
                </span>
                    </li>
                ))}
              </ul>
            </section>
        )}
      </main>
  );
}