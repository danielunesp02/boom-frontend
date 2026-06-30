import { StatusPill } from '../../../shared/components/StatusPill';
import { useI18n } from '../../../shared/i18n/useI18n';
import type { SubjectPerformance } from '../types/parentDashboardTypes';
import './SubjectPerformancePanel.css';

type SubjectPerformancePanelProps = {
  subjects: SubjectPerformance[];
};

export function SubjectPerformancePanel({ subjects }: SubjectPerformancePanelProps) {
  const { t } = useI18n();

  return (
    <section className="subject-panel card card-padding" data-testid="subject-performance-panel">
      <h2 className="section-title">{t('subjectPerformance.title')}</h2>
      <p className="muted">{t('subjectPerformance.description')}</p>

      <div className="subject-list">
        {subjects.map((subject) => (
          <article className="subject-row" key={subject.subjectId}>
            <div>
              <strong>{subject.subjectName}</strong>
              <span>
                {subject.studyTimeMinutes} {t('dashboard.minutesShort')} · {subject.activeGapCount}{' '}
                {t('subjectPerformance.activeGaps')}
              </span>
            </div>

            <div className="subject-row-right">
              <strong>{subject.accuracy}%</strong>
              <StatusPill value={subject.trend} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
