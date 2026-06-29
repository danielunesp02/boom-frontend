import type { DashboardStudent } from '../types/parentDashboardTypes';
import './DashboardHeader.css';

type DashboardHeaderProps = {
  student?: DashboardStudent | null;
  loading?: boolean;
};

export function DashboardHeader({ student, loading = false }: DashboardHeaderProps) {
  return (
    <header className="dashboard-header">
      <div>
        <p className="eyebrow">Parent dashboard</p>
        <h1>{loading ? 'Loading student dashboard' : `${student?.displayName ?? 'Student'} progress`}</h1>
        <p className="muted">
          {student
            ? `${student.gradeLevel} · ${student.targetSchoolSystem}`
            : 'Learning history, performance and current action plan.'}
        </p>
      </div>

      <div className="student-selector" aria-label="Student selector">
        <span>Selected student</span>
        <strong>{student?.displayName ?? '—'}</strong>
      </div>
    </header>
  );
}
