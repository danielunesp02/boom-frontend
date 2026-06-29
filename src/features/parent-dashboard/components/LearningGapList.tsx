import { StatusPill } from '../../../shared/components/StatusPill';
import type { LearningGap } from '../types/parentDashboardTypes';
import './LearningGapList.css';

type LearningGapListProps = {
  gaps: LearningGap[];
};

export function LearningGapList({ gaps }: LearningGapListProps) {
  return (
    <section className="gap-list card card-padding" data-testid="learning-gap-list">
      <h2 className="section-title">Attention areas</h2>
      <p className="muted">Topics that need continued practice.</p>

      <div className="gap-items">
        {gaps.map((gap) => (
          <article className="gap-item" key={gap.gapId}>
            <div className="gap-topline">
              <strong>{gap.skillName}</strong>
              <StatusPill value={gap.severity} />
            </div>
            <p>{gap.subjectName} · {gap.topicName}</p>
            <span>
              {gap.daysOpen} days open · {gap.practiceTimeMinutes} minutes of practice
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
