import './StatusPill.css';

type StatusPillProps = {
  value: string;
};

export function StatusPill({ value }: StatusPillProps) {
  return <span className={`status-pill status-${value.toLowerCase()}`}>{value}</span>;
}
