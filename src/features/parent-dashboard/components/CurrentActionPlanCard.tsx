import { StatusPill } from '../../../shared/components/StatusPill';
import type { CurrentActionPlan } from '../types/parentDashboardTypes';
import './CurrentActionPlanCard.css';

type CurrentActionPlanCardProps = {
  actionPlan: CurrentActionPlan | null;
};

export function CurrentActionPlanCard({ actionPlan }: CurrentActionPlanCardProps) {
  if (!actionPlan) {
    return (
      <section className="action-plan card card-padding" data-testid="current-action-plan-empty">
        <h2 className="section-title">Current action plan</h2>
        <p className="muted">There is no active action plan right now.</p>
      </section>
    );
  }

  return (
    <section className="action-plan card card-padding" data-testid="current-action-plan-card">
      <div className="action-plan-header">
        <div>
          <h2 className="section-title">Current action plan</h2>
          <p className="muted">{actionPlan.targetSubject} · {actionPlan.targetTopic}</p>
        </div>
        <StatusPill value={actionPlan.priority} />
      </div>

      <h3>{actionPlan.title}</h3>
      <p>{actionPlan.description}</p>

      <div className="progress-block">
        <div>
          <span>Progress</span>
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
            <small>{item.expectedDurationMinutes} min · {item.status}</small>
          </li>
        ))}
      </ul>
    </section>
  );
}
