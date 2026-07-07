import { useEffect, useMemo, useState } from "react";
import {
  completeStudentReview,
  fetchStudentReviewQueue,
  skipStudentReview,
  startStudentReview,
} from "./studentReviewQueueApi";
import type { StudentReviewQueueItem } from "./studentReviewQueueTypes";
import "./studentReviewQueue.css";

const DEMO_STUDENT_ID = "485e0ca5-5606-4ceb-9b5a-c021d7a4baea";

function resolveStudentId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("studentId") ?? localStorage.getItem("boom.student.id") ?? DEMO_STUDENT_ID;
}

function label(value: string | null | undefined) {
  return value ? value.replaceAll("_", " ") : "—";
}

function formatDate(date: string | null) {
  if (!date) return "No date";
  return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function priorityRank(item: StudentReviewQueueItem) {
  const statusRank: Record<string, number> = {
    CRITICAL_OVERDUE: 1,
    OVERDUE: 2,
    DUE: 3,
    SCHEDULED: 4,
  };

  const priority: Record<string, number> = {
    CRITICAL: 1,
    HIGH: 2,
    MEDIUM: 3,
    LOW: 4,
  };

  return (statusRank[item.status] ?? 5) * 10 + (priority[item.priority] ?? 5);
}

export function StudentReviewQueuePage() {
  const studentId = useMemo(resolveStudentId, []);
  const [items, setItems] = useState<StudentReviewQueueItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<StudentReviewQueueItem | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error" | "saving">("loading");
  const [error, setError] = useState<string | null>(null);

  async function loadQueue() {
    try {
      setStatus("loading");
      setError(null);
      const data = await fetchStudentReviewQueue(studentId);
      const sorted = [...data].sort((a, b) => priorityRank(a) - priorityRank(b));
      setItems(sorted);
      setSelectedItem(sorted[0] ?? null);
      setStatus("ready");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not load review queue.");
    }
  }

  useEffect(() => {
    void loadQueue();
  }, [studentId]);

  async function handleStart(item: StudentReviewQueueItem) {
    try {
      setStatus("saving");
      const result = await startStudentReview(studentId, item.reviewQueueId);
      setSelectedItem(result.item);
      setStatus("ready");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not start review.");
    }
  }

  async function handleComplete(item: StudentReviewQueueItem) {
    try {
      setStatus("saving");
      await completeStudentReview(studentId, item.reviewQueueId);
      await loadQueue();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not complete review.");
    }
  }

  async function handleSkip(item: StudentReviewQueueItem) {
    try {
      setStatus("saving");
      await skipStudentReview(studentId, item.reviewQueueId);
      await loadQueue();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not skip review.");
    }
  }

  if (status === "loading") {
    return (
      <main className="student-review-page">
        <section className="student-review-state">Loading review queue...</section>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="student-review-page">
        <section className="student-review-state student-review-error">
          <h1>Review queue</h1>
          <p>{error}</p>
          <button type="button" onClick={() => void loadQueue()}>
            Try again
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="student-review-page">
      <header className="student-review-header">
        <div>
          <span className="student-review-eyebrow">Today's review</span>
          <h1>Review queue</h1>
          <p>Start with overdue and high-priority skills before moving to new content.</p>
        </div>

        <a className="student-review-dashboard-link" href="/">
          Back to dashboard
        </a>
      </header>

      {items.length === 0 ? (
        <section className="student-review-empty">
          <h2>No reviews due right now</h2>
          <p>Great job. New reviews will appear here when Boom schedules them.</p>
        </section>
      ) : (
        <section className="student-review-layout">
          <div className="student-review-list">
            {items.map((item) => (
              <article
                key={item.reviewQueueId}
                className={`student-review-item ${
                  selectedItem?.reviewQueueId === item.reviewQueueId ? "selected" : ""
                }`}
              >
                <button type="button" onClick={() => setSelectedItem(item)}>
                  <span className={`student-review-status status-${item.status.toLowerCase()}`}>
                    {label(item.status)}
                  </span>
                  <strong>{item.skillName}</strong>
                  <small>
                    {item.subjectName} · {item.topicName}
                  </small>
                  <span>
                    {label(item.reviewType)} · {item.estimatedMinutes} min
                  </span>
                </button>
              </article>
            ))}
          </div>

          {selectedItem && (
            <section className="student-review-detail">
              <div className="student-review-detail-top">
                <div>
                  <span className={`student-review-status status-${selectedItem.status.toLowerCase()}`}>
                    {label(selectedItem.status)}
                  </span>
                  <h2>{selectedItem.skillName}</h2>
                  <p>
                    {selectedItem.subjectName} · {selectedItem.topicName}
                  </p>
                </div>

                <span className={`student-review-priority priority-${selectedItem.priority.toLowerCase()}`}>
                  {selectedItem.priority}
                </span>
              </div>

              <div className="student-review-detail-grid">
                <div>
                  <span>Review type</span>
                  <strong>{label(selectedItem.reviewType)}</strong>
                </div>
                <div>
                  <span>Scheduled</span>
                  <strong>{formatDate(selectedItem.scheduledFor)}</strong>
                </div>
                <div>
                  <span>Accuracy</span>
                  <strong>
                    {selectedItem.accuracy === null ? "—" : `${Math.round(selectedItem.accuracy)}%`}
                  </strong>
                </div>
                <div>
                  <span>Estimated time</span>
                  <strong>{selectedItem.estimatedMinutes} min</strong>
                </div>
              </div>

              {selectedItem.requiresReassessment && (
                <p className="student-review-warning">
                  Boom recommends a quick reassessment before continuing this skill.
                </p>
              )}

              <p className="student-review-reason">Reason: {label(selectedItem.reason)}</p>

              <div className="student-review-actions">
                <button
                  type="button"
                  onClick={() => void handleStart(selectedItem)}
                  disabled={status === "saving"}
                >
                  Start review
                </button>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => void handleComplete(selectedItem)}
                  disabled={status === "saving"}
                >
                  Mark completed
                </button>
                <button
                  type="button"
                  className="ghost"
                  onClick={() => void handleSkip(selectedItem)}
                  disabled={status === "saving"}
                >
                  Skip
                </button>
              </div>
            </section>
          )}
        </section>
      )}
    </main>
  );
}
