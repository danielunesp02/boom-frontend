import { useI18n } from '../../../shared/i18n/useI18n';
import type { DashboardStudent } from '../types/parentDashboardTypes';
import './DashboardHeader.css';

type DashboardHeaderProps = {
  student?: DashboardStudent | null;
  loading?: boolean;
};

export function DashboardHeader({ student, loading = false }: DashboardHeaderProps) {
  const { t } = useI18n();

  return (
    <header className="dashboard-header">
      <div>
        <p className="eyebrow">{t('dashboard.parentDashboard')}</p>
        <h1>
          {loading
            ? t('dashboard.loadingTitle')
            : student?.displayName
              ? `${student.displayName} progress`
              : t('dashboard.titleFallback')}
        </h1>
        <p className="muted">
          {student
            ? `${student.gradeLevel} · ${student.targetSchoolSystem}`
            : t('dashboard.subtitleFallback')}
        </p>
      </div>

      <div className="student-selector" aria-label={t('app.selectedStudent')}>
        <span>{t('app.selectedStudent')}</span>
        <strong>{student?.displayName ?? '—'}</strong>
      </div>
    </header>
  );
}
