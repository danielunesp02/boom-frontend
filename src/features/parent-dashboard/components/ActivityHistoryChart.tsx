import { useI18n } from '../../../shared/i18n/useI18n';
import type { ActivityHistoryPoint } from '../types/parentDashboardTypes';
import './ActivityHistoryChart.css';

type ActivityHistoryChartProps = {
  data: ActivityHistoryPoint[];
};

export function ActivityHistoryChart({ data }: ActivityHistoryChartProps) {
  const { t, locale } = useI18n();
  const maxStudyTime = Math.max(...data.map((item) => item.studyTimeMinutes), 1);

  return (
    <section className="activity-chart card card-padding" data-testid="activity-history-chart">
      <div className="chart-header">
        <div>
          <h2 className="section-title">{t('charts.activityHistory')}</h2>
          <p className="muted">{t('charts.activityHistoryDescription')}</p>
        </div>
      </div>

      <div className="bar-chart" aria-label={t('charts.activityHistory')}>
        {data.map((item) => {
          const barHeight = Math.max((item.studyTimeMinutes / maxStudyTime) * 160, item.studyTimeMinutes > 0 ? 16 : 4);
          const label = formatDay(item.date, locale);

          return (
            <div className="bar-column" key={item.date}>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ height: `${barHeight}px` }}
                  aria-label={`${label}: ${item.studyTimeMinutes} ${t('dashboard.minutesShort')}`}
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

function formatDay(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(new Date(`${date}T00:00:00`));
}
