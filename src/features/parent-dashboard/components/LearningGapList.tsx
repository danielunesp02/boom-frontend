import { StatusPill } from '../../../shared/components/StatusPill';
import { useI18n } from '../../../shared/i18n/useI18n';
import type { LearningGap } from '../types/parentDashboardTypes';
import './LearningGapList.css';

type LearningGapListProps = {
  gaps: LearningGap[];
};

export function LearningGapList({ gaps }: LearningGapListProps) {
  const { t } = useI18n();

  return (
    <section className="gap-list card card-padding" data-testid="learning-gap-list">
      <h2 className="section-title">{t('gaps.title')}</h2>
      <p className="muted">{t('gaps.description')}</p>

      <div className="gap-items">
        {gaps.map((gap) => (
          <article className="gap-item" key={gap.gapId}>
            <div className="gap-topline">
              <strong>{gap.skillName}</strong>
              <StatusPill value={gap.severity} />
            </div>
            <p>{gap.subjectName} · {gap.topicName}</p>
            <span>
              {gap.daysOpen} {t('gaps.daysOpen')} · {gap.practiceTimeMinutes}{' '}
              {t('gaps.practiceMinutes')}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
