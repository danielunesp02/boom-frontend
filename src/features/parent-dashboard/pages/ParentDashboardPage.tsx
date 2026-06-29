import { useEffect, useState } from 'react';
import { EmptyState } from '../../../shared/components/EmptyState';
import { MetricCard } from '../../../shared/components/MetricCard';
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
      setErrorMessage(error instanceof Error ? error.message : 'Unexpected dashboard error.');
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
          Loading dashboard...
        </section>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="parent-dashboard">
        <DashboardHeader />
        <section className="dashboard-error card card-padding" data-testid="dashboard-error">
          <h2>We could not load the dashboard</h2>
          <p>{errorMessage}</p>
          <button type="button" onClick={loadDashboard}>
            Try again
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
          title={dashboard.emptyState?.title ?? 'No learning activity yet'}
          description={
            dashboard.emptyState?.description ??
            'Once the student completes the first activity, this dashboard will show progress.'
          }
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
          label="Completed activities"
          value={`${dashboard.weeklySummary.completedActivities}`}
          detail="This week"
          testId="metric-completed-activities"
        />
        <MetricCard
          label="Study time"
          value={`${dashboard.weeklySummary.totalStudyTimeMinutes} min`}
          detail="Total focused time"
          testId="metric-study-time"
        />
        <MetricCard
          label="Average accuracy"
          value={`${dashboard.weeklySummary.averageAccuracy}%`}
          detail="Across completed activities"
          testId="metric-average-accuracy"
        />
        <MetricCard
          label="Current streak"
          value={`${dashboard.weeklySummary.currentStreakDays} days`}
          detail="Learning rhythm"
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
