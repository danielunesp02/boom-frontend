import { useI18n } from '../../../shared/i18n/useI18n';
import type { RecentActivitySummary } from '../types/parentDashboardTypes';
import './RecentActivityTimeline.css';

type RecentActivityTimelineProps = {
  activities: RecentActivitySummary[];
};

export function RecentActivityTimeline({ activities }: RecentActivityTimelineProps) {
  const { t, locale } = useI18n();

  return (
    <section className="timeline card card-padding" data-testid="recent-activity-timeline">
      <h2 className="section-title">{t('recentActivity.title')}</h2>
      <p className="muted">{t('recentActivity.description')}</p>

      <div className="timeline-list">
        {activities.map((activity) => (
          <article className="timeline-item" key={activity.activityId}>
            <div className="timeline-date">{formatDate(activity.date, locale)}</div>
            <div>
              <strong>{activity.activityTitle}</strong>
              <span>
                {activity.subjectName} · {activity.accuracy}% · {activity.durationMinutes}{' '}
                {t('dashboard.minutesShort')}
              </span>
              <p>{activity.summaryText}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function formatDate(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: '2-digit'
  }).format(new Date(`${date}T00:00:00`));
}
