import type { RecentActivitySummary } from '../types/parentDashboardTypes';
import './RecentActivityTimeline.css';

type RecentActivityTimelineProps = {
  activities: RecentActivitySummary[];
};

export function RecentActivityTimeline({ activities }: RecentActivityTimelineProps) {
  return (
    <section className="timeline card card-padding" data-testid="recent-activity-timeline">
      <h2 className="section-title">Recent activity summaries</h2>
      <p className="muted">Parent-friendly summaries generated after each learning delivery.</p>

      <div className="timeline-list">
        {activities.map((activity) => (
          <article className="timeline-item" key={activity.activityId}>
            <div className="timeline-date">{formatDate(activity.date)}</div>
            <div>
              <strong>{activity.activityTitle}</strong>
              <span>{activity.subjectName} · {activity.accuracy}% · {activity.durationMinutes} min</span>
              <p>{activity.summaryText}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: '2-digit'
  }).format(new Date(`${date}T00:00:00`));
}
