import type { ActivityHistoryPoint } from '../types/parentDashboardTypes';
import './ActivityHistoryChart.css';

type ActivityHistoryChartProps = {
  data: ActivityHistoryPoint[];
};

export function ActivityHistoryChart({ data }: ActivityHistoryChartProps) {
  const maxStudyTime = Math.max(...data.map((item) => item.studyTimeMinutes), 1);

  return (
    <section className="activity-chart card card-padding" data-testid="activity-history-chart">
      <div className="chart-header">
        <div>
          <h2 className="section-title">Activity history</h2>
          <p className="muted">Study time and accuracy over the last 7 days.</p>
        </div>
      </div>

      <div className="bar-chart" aria-label="Activity history chart">
        {data.map((item) => {
          const barHeight = Math.max((item.studyTimeMinutes / maxStudyTime) * 160, item.studyTimeMinutes > 0 ? 16 : 4);
          const label = formatDay(item.date);

          return (
            <div className="bar-column" key={item.date}>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ height: `${barHeight}px` }}
                  aria-label={`${label}: ${item.studyTimeMinutes} minutes`}
                />
              </div>
              <strong>{item.accuracy === null ? '—' : `${item.accuracy}%`}</strong>
              <span>{label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function formatDay(date: string) {
  return new Intl.DateTimeFormat('en', { weekday: 'short' }).format(new Date(`${date}T00:00:00`));
}
