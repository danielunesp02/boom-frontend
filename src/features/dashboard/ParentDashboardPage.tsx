import { useEffect, useMemo, useState } from "react";
import { CompactMetricGrid } from "./CompactMetricGrid";
import { DashboardPeriodFilter, type DashboardPeriodState } from "./DashboardPeriodFilter";
import { getParentDashboard } from "./dashboardApi";
import type { ParentDashboard } from "./dashboardTypes";
import { enumLabel, getDashboardTranslations } from "./dashboardTranslations";
import "./dashboard.css";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function daysAgoIso(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}

function getStoredLocale() {
  return localStorage.getItem("boom.user.locale") ?? "pt-BR";
}

export function ParentDashboardPage() {
  const [locale, setLocale] = useState(getStoredLocale);
  const translations = getDashboardTranslations(locale);

  const [period, setPeriod] = useState<DashboardPeriodState>({
    periodPreset: "LAST_30_DAYS",
    startDate: daysAgoIso(29),
    endDate: todayIso(),
  });

  const [dashboard, setDashboard] = useState<ParentDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const requestKey = useMemo(
    () => `${locale}:${period.periodPreset}:${period.startDate}:${period.endDate}`,
    [locale, period.periodPreset, period.startDate, period.endDate],
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      const storedLocale = getStoredLocale();
      setLocale((current) => (current === storedLocale ? current : storedLocale));
    }, 400);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const data = await getParentDashboard({
          periodPreset: period.periodPreset,
          startDate: period.startDate,
          endDate: period.endDate,
          locale,
        });

        if (!cancelled) {
          setDashboard(data);
        }
      } catch (error) {
        console.error("Dashboard load failed", error);

        if (!cancelled) {
          setErrorMessage(translations.loadError);
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
  }, [requestKey, locale, period.periodPreset, period.startDate, period.endDate, translations.loadError]);

  return (
    <main className="dashboard-page">
      <header className="dashboard-filtered-header">
        <div>
          <span className="dashboard-eyebrow">{translations.pageEyebrow}</span>
          <h1>
            {dashboard?.student.displayName ?? "Student"} {translations.pageTitleSuffix}
          </h1>
          {dashboard?.selectedPeriod && <p>{dashboard.selectedPeriod.label}</p>}
        </div>

        <DashboardPeriodFilter value={period} onChange={setPeriod} translations={translations} />
      </header>

      {isLoading && <div className="dashboard-state-card">{translations.loading}</div>}
      {errorMessage && <div className="dashboard-state-card dashboard-state-error">{errorMessage}</div>}

      {dashboard && !isLoading && !errorMessage && (
        <>
          <CompactMetricGrid
            metrics={dashboard.metrics}
            comparisonLabel={dashboard.selectedPeriod.comparisonLabel}
            translations={translations}
          />

          <section className="dashboard-content-grid">
            <article className="dashboard-panel">
              <div className="panel-title-row">
                <h2>{translations.sections.activityHistory}</h2>
                <span>{translations.sections.activityHistorySubtitle}</span>
              </div>

              <div className="activity-chart">
                {dashboard.activityHistory.map((point) => {
                  const maxStudyTime = Math.max(
                    ...dashboard.activityHistory.map((item) => item.studyTimeMinutes),
                    1,
                  );

                  const barWidth = Math.max(
                    6,
                    Math.round((point.studyTimeMinutes / maxStudyTime) * 100),
                  );

                  return (
                    <div key={point.date} className="activity-chart-row">
                      <span className="activity-chart-date">{point.date.slice(5)}</span>

                      <div className="activity-chart-track">
                        <div
                          className="activity-chart-bar"
                          style={{ width: `${barWidth}%` }}
                          aria-label={`${point.studyTimeMinutes}${translations.activity.minutesSuffix}`}
                        />
                      </div>

                      <div className="activity-chart-value">
                        <strong>{point.completedActivities}</strong> {translations.activity.shortActivities} ·{" "}
                        {point.studyTimeMinutes}
                        {translations.activity.minutesSuffix}
                        {point.accuracy !== null && <small> · {point.accuracy}%</small>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>

            <article className="dashboard-panel">
              <h2>{translations.sections.subjectPerformance}</h2>
              <div className="subject-performance-list">
                {dashboard.subjectPerformance.map((subject) => (
                    <li className="subject-performance-item" key={subject.subjectId}>
                      <div className="subject-performance-main">
                        <strong>{subject.subjectName}</strong>
                        <span className="subject-performance-score">{subject.accuracy}%</span>
                      </div>

                      <div className="subject-performance-meta">
      <span>
        {subject.studyTimeMinutes}
        {translations.activity.minutesSuffix}
      </span>
                        <span>·</span>
                        <span>{enumLabel(translations, subject.trend)}</span>
                      </div>

                      <div className="subject-performance-gaps">
                        {subject.activeGapCount} {translations.labels.activeGaps}                      </div>
                    </li>
                ))}
              </div>
            </article>

            <article className="dashboard-panel">
              <h2>{translations.sections.learningGaps}</h2>
              <div className="gap-list">
                {dashboard.learningGaps.map((gap) => (
                  <div key={gap.gapId} className="gap-item">
                    <strong>{gap.subjectName} · {gap.topicName}</strong>
                    <span>{gap.skillName}</span>
                    <p>
                      {enumLabel(translations, gap.severity)} · {enumLabel(translations, gap.status)} ·{" "}
                      {translations.gaps.openFor} {gap.daysOpen} {translations.gaps.days} ·{" "}
                      {gap.practiceTimeMinutes}
                      {translations.activity.minutesSuffix} {translations.gaps.practiced}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            <article className="dashboard-panel">
              <h2>{translations.sections.recentActivities}</h2>
              <div className="recent-list">
                {dashboard.recentActivitySummaries.map((activity) => (
                  <div key={activity.activityId} className="recent-item">
                    <strong>{activity.activityTitle}</strong>
                    <span>
                      {activity.subjectName} · {activity.accuracy}% · {activity.durationMinutes}
                      {translations.activity.minutesSuffix}
                    </span>
                    <p>{activity.summaryText}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="dashboard-panel dashboard-panel-wide">
              <h2>{dashboard.currentActionPlan.title}</h2>
              <p>{dashboard.currentActionPlan.description}</p>

              <div className="action-plan-meta">
                <span>{dashboard.currentActionPlan.targetSubject}</span>
                <span>{dashboard.currentActionPlan.targetTopic}</span>
                <span>
                  {dashboard.currentActionPlan.progressPercentage}% {translations.actionPlan.completed}
                </span>
              </div>

              <ul>
                {dashboard.currentActionPlan.items.map((item) => (
                  <li key={item.title}>
                    {item.title} · {item.expectedDurationMinutes}
                    {translations.actionPlan.minutesSuffix} · {enumLabel(translations, item.status)}
                  </li>
                ))}
              </ul>
            </article>
          </section>
        </>
      )}
    </main>
  );
}
