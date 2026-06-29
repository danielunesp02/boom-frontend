import './EmptyState.css';

type EmptyStateProps = {
  title: string;
  description: string;
  testId?: string;
};

export function EmptyState({ title, description, testId }: EmptyStateProps) {
  return (
    <section className="empty-state card card-padding" data-testid={testId}>
      <div className="empty-state-icon">✦</div>
      <h2>{title}</h2>
      <p>{description}</p>
    </section>
  );
}
