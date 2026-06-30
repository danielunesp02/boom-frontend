import { StatusPill } from '../../../shared/components/StatusPill';
import { useI18n } from '../../../shared/i18n/useI18n';
import type { CurrentActionPlan } from '../types/parentDashboardTypes';
import './CurrentActionPlanCard.css';

type CurrentActionPlanCardProps = {
  actionPlan: CurrentActionPlan | null;
};

export function CurrentActionPlanCard({ actionPlan }: CurrentActionPlanCardProps) {
  const { t } = useI18n();

  if (!actionPlan) {
    return (
      <section className="action-plan card card-padding" data-testid="current-action-plan-empty">
        <h2 className="section-title">{t('actionPlan.title')}</h2>
        <p className="muted">{t('actionPlan.empty')}</p>
      </section>
    );
  }

  return (
    <section className="action-plan card card-padding" data-testid="current-action-plan-card">
      <div className="action-plan-header">
        <div>
          <h2 className="section-title">{t('actionPlan.title')}</h2>
          <p className="muted">{actionPlan.targetSubject} · {actionPlan.targetTopic}</p>
        </div>
        <StatusPill value={actionPlan.priority} />
      </div>

      <h3>{actionPlan.title}</h3>
      <p>{actionPlan.description}</p>

      <div className="progress-block">
        <div>
          <span>{t('actionPlan.progress')}</span>
          <strong>{actionPlan.progressPercentage}%</strong>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${actionPlan.progressPercentage}%` }} />
        </div>
      </div>

      <ul className="action-items">
        {actionPlan.items.map((item) => (
          <li key={item.title}>
            <span>{item.title}</span>
            <small>
              {item.expectedDurationMinutes} {t('dashboard.minutesShort')} · {item.status}
            </small>
          </li>
        ))}
      </ul>
    </section>
  );
}
