import { StatusPill } from '../../../shared/components/StatusPill';
import type { SubjectPerformance } from '../types/parentDashboardTypes';
import './SubjectPerformancePanel.css';

type SubjectPerformancePanelProps = {
  subjects: SubjectPerformance[];
};

export function SubjectPerformancePanel({ subjects }: SubjectPerformancePanelProps) {
  return (
    <section className="subject-panel card card-padding" data-testid="subject-performance-panel">
      <h2 className="section-title">Performance by subject</h2>
      <p className="muted">Accuracy, study time and current trend.</p>

      <div className="subject-list">
        {subjects.map((subject) => (
          <article className="subject-row" key={subject.subjectId}>
            <div>
              <strong>{subject.subjectName}</strong>
              <span>{subject.studyTimeMinutes} minutes · {subject.activeGapCount} active gaps</span>
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
