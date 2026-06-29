import './MetricCard.css';

type MetricCardProps = {
  label: string;
  value: string;
  detail?: string;
  testId?: string;
};

export function MetricCard({ label, value, detail, testId }: MetricCardProps) {
  return (
    <section className="metric-card card card-padding" data-testid={testId}>
      <p>{label}</p>
      <strong>{value}</strong>
      {detail ? <span>{detail}</span> : null}
    </section>
  );
}
