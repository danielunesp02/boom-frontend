import { useEffect, useState } from 'react';
import { EmptyState } from '../../../shared/components/EmptyState';
import { MetricCard } from '../../../shared/components/MetricCard';
import { useI18n } from '../../../shared/i18n/useI18n';
import { fetchParentDashboard } from '../api/parentDashboardApi';
import type { ParentDashboardResponse } from '../types/parentDashboardTypes';
import { ActivityHistoryChart } from '../components/ActivityHistoryChart';
import { SubjectPerformancePanel } from '../components/SubjectPerformancePanel';
import { LearningGapList } from '../components/LearningGapList';
import { CurrentActionPlanCard } from '../components/CurrentActionPlanCard';
import { RecentActivityTimeline } from '../components/RecentActivityTimeline';
import { DashboardHeader } from '../components/DashboardHeader';
import './ParentDashboardPage.css';

export function ParentDashboardPage() {
  const { t } = useI18n();
  const [dashboard, setDashboard] = useState<ParentDashboardResponse | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function loadDashboard() {
    setStatus('loading');
    setErrorMessage(null);

    try {
      const data = await fetchParentDashboard();
      setDashboard(data);
      setStatus('ready');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : t('errors.unexpected'));
    }
  }

  useEffect(() => {
    void loadDashboard();
  }, []);

  if (status === 'loading') {
    return (
      <div className="parent-dashboard">
        <DashboardHeader loading />
        <section className="dashboard-skeleton card" data-testid="dashboard-loading">
          {t('dashboard.loading')}
        </section>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="parent-dashboard">
        <DashboardHeader />
        <section className="dashboard-error card card-padding" data-testid="dashboard-error">
          <h2>{t('dashboard.errorTitle')}</h2>
          <p>{errorMessage}</p>
          <button type="button" onClick={loadDashboard}>
            {t('dashboard.tryAgain')}
          </button>
        </section>
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  if (dashboard.emptyState || dashboard.weeklySummary.completedActivities === 0) {
    return (
      <div className="parent-dashboard">
        <DashboardHeader student={dashboard.student} />
        <EmptyState
          title={dashboard.emptyState?.title ?? t('dashboard.noActivityTitle')}
          description={dashboard.emptyState?.description ?? t('dashboard.noActivityDescription')}
          testId="dashboard-empty-state"
        />
      </div>
    );
  }

  return (
    <div className="parent-dashboard" data-testid="parent-dashboard">
      <DashboardHeader student={dashboard.student} />

      <section className="grid-4" aria-label="Weekly summary">
        <MetricCard
          label={t('dashboard.completedActivities')}
          value={`${dashboard.weeklySummary.completedActivities}`}
          detail={t('dashboard.completedActivitiesDetail')}
          testId="metric-completed-activities"
        />
        <MetricCard
          label={t('dashboard.studyTime')}
          value={`${dashboard.weeklySummary.totalStudyTimeMinutes} ${t('dashboard.minutesShort')}`}
          detail={t('dashboard.studyTimeDetail')}
          testId="metric-study-time"
        />
        <MetricCard
          label={t('dashboard.averageAccuracy')}
          value={`${dashboard.weeklySummary.averageAccuracy}%`}
          detail={t('dashboard.averageAccuracyDetail')}
          testId="metric-average-accuracy"
        />
        <MetricCard
          label={t('dashboard.currentStreak')}
          value={`${dashboard.weeklySummary.currentStreakDays} ${t('dashboard.days')}`}
          detail={t('dashboard.currentStreakDetail')}
          testId="metric-current-streak"
        />
      </section>

      <section className="grid-2">
        <ActivityHistoryChart data={dashboard.activityHistory} />
        <CurrentActionPlanCard actionPlan={dashboard.currentActionPlan} />
      </section>

      <section className="grid-2">
        <SubjectPerformancePanel subjects={dashboard.subjectPerformance} />
        <LearningGapList gaps={dashboard.learningGaps} />
      </section>

      <RecentActivityTimeline activities={dashboard.recentActivitySummaries} />
    </div>
  );
}
