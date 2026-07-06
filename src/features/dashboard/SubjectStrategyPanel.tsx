import { useEffect, useMemo, useState } from "react";
import {
  fetchSubjectLearningStrategies,
  updateSubjectLearningStrategy,
} from "./subjectLearningStrategiesApi";
import type {
  MethodologyCode,
  SubjectLearningStrategy,
} from "./subjectLearningStrategiesTypes";

interface SubjectStrategyPanelProps {
  studentId: string;
}

type LearningCurveChartType = "BAR" | "LINE";

const METHODOLOGY_OPTIONS: Array<{
  value: MethodologyCode;
  label: string;
  description: string;
}> = [
  {
    value: "LIGHT_REVIEW",
    label: "Light review",
    description: "Maintain knowledge with a lighter review rhythm.",
  },
  {
    value: "BALANCED",
    label: "Balanced",
    description: "Recommended default path for steady progress.",
  },
  {
    value: "INTENSIVE_REMEDIATION",
    label: "Intensive remediation",
    description: "Prioritize gaps, reassessment, and guided practice.",
  },
  {
    value: "EXAM_PREP",
    label: "Exam prep",
    description: "More aggressive targets and frequent mastery checks.",
  },
];

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function twelveWeeksFromTodayIso() {
  const date = new Date();
  date.setDate(date.getDate() + 7 * 11);
  return date.toISOString().slice(0, 10);
}

function score(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "—";
  }

  return `${Math.round(Number(value))}%`;
}

function methodologyLabel(value: string) {
  return METHODOLOGY_OPTIONS.find((option) => option.value === value)?.label ?? value;
}


function buildLinePoints(
  points: SubjectLearningStrategy["curvePoints"],
  key: "actualMasteryScore" | "expectedMasteryScore" | "highPerformanceScore",
  width: number,
  height: number,
) {
  if (!points.length) return "";

  const denominator = Math.max(points.length - 1, 1);

  return points
    .map((point, index) => {
      const rawValue = point[key];

      if (rawValue === null || rawValue === undefined) {
        return null;
      }

      const x = (index / denominator) * width;
      const y = height - (Math.max(0, Math.min(100, Number(rawValue))) / 100) * height;

      return `${x},${y}`;
    })
    .filter(Boolean)
    .join(" ");
}


export function SubjectStrategyPanel({ studentId }: SubjectStrategyPanelProps) {
  const [strategies, setStrategies] = useState<SubjectLearningStrategy[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [methodologyCode, setMethodologyCode] = useState<MethodologyCode>("BALANCED");
  const [initialAssessmentScore, setInitialAssessmentScore] = useState("0");
  const [weeklyStudyMinutesGoal, setWeeklyStudyMinutesGoal] = useState("120");
  const [targetDate, setTargetDate] = useState(twelveWeeksFromTodayIso());
  const [chartType, setChartType] = useState<LearningCurveChartType>("BAR");
  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  async function reload() {
    try {
      setStatus("loading");
      setError(null);
      const data = await fetchSubjectLearningStrategies(studentId);
      setStrategies(data);

      if (data.length > 0) {
        const selected = data.find((item) => item.subjectId === selectedSubjectId) ?? data[0];
        setSelectedSubjectId(selected.subjectId);
        setMethodologyCode(selected.methodologyCode);
        setInitialAssessmentScore(String(Math.round(selected.initialAssessmentScore ?? selected.currentMasteryScore ?? 0)));
        setWeeklyStudyMinutesGoal(String(selected.weeklyStudyMinutesGoal ?? 120));
        setTargetDate(selected.targetDate ?? twelveWeeksFromTodayIso());
      }

      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not load subject strategies.");
    }
  }

  useEffect(() => {
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId]);

  const selectedStrategy = useMemo(
    () => strategies.find((item) => item.subjectId === selectedSubjectId) ?? strategies[0],
    [selectedSubjectId, strategies],
  );

  const selectedOption = METHODOLOGY_OPTIONS.find((option) => option.value === methodologyCode);
  const chartWidth = 720;
  const chartHeight = 180;

  async function handleSubjectChange(subjectId: string) {
    const next = strategies.find((item) => item.subjectId === subjectId);
    setSelectedSubjectId(subjectId);

    if (!next) return;

    setMethodologyCode(next.methodologyCode);
    setInitialAssessmentScore(String(Math.round(next.initialAssessmentScore ?? next.currentMasteryScore ?? 0)));
    setWeeklyStudyMinutesGoal(String(next.weeklyStudyMinutesGoal ?? 120));
    setTargetDate(next.targetDate ?? twelveWeeksFromTodayIso());
  }

  async function handleSave() {
    if (!selectedSubjectId) return;

    try {
      setStatus("saving");
      setError(null);

      const updated = await updateSubjectLearningStrategy(studentId, {
        subjectId: selectedSubjectId,
        methodologyCode,
        initialAssessmentScore: Number(initialAssessmentScore),
        weeklyStudyMinutesGoal: Number(weeklyStudyMinutesGoal),
        curveStartDate: selectedStrategy?.curveStartDate ?? todayIso(),
        targetDate,
      });

      setStrategies((current) =>
        current.map((item) => (item.subjectId === updated.subjectId ? updated : item)),
      );
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not save subject strategy.");
    }
  }

  if (status === "loading") {
    return (
      <section className="dashboard-card subject-strategy-card">
        <div className="card-header">
          <div>
            <span className="dashboard-eyebrow">Adaptive strategy</span>
            <h2>Subject strategy</h2>
          </div>
        </div>
        <p className="subject-strategy-muted">Loading subject strategies...</p>
      </section>
    );
  }

  if (status === "error" && strategies.length === 0) {
    return (
      <section className="dashboard-card subject-strategy-card">
        <div className="card-header">
          <div>
            <span className="dashboard-eyebrow">Adaptive strategy</span>
            <h2>Subject strategy</h2>
          </div>
        </div>
        <p className="subject-strategy-error">{error}</p>
      </section>
    );
  }

  if (!selectedStrategy) {
    return null;
  }

  return (
    <section className="dashboard-card subject-strategy-card">
      <div className="card-header subject-strategy-header">
        <div>
          <span className="dashboard-eyebrow">Adaptive strategy</span>
          <h2>Subject strategy & learning curves</h2>
          <p className="subject-strategy-subtitle">
            Calibrate the methodology and compare actual progress against expected and high-performance curves.
          </p>
        </div>

        <div className="subject-strategy-status">
          {selectedStrategy.calibrationStatus}
        </div>
      </div>

      <div className="subject-strategy-grid">
        <label className="subject-strategy-field">
          <span>Subject</span>
          <select
            value={selectedSubjectId}
            onChange={(event) => void handleSubjectChange(event.target.value)}
          >
            {strategies.map((strategy) => (
              <option key={strategy.subjectId} value={strategy.subjectId}>
                {strategy.subjectName}
              </option>
            ))}
          </select>
        </label>

        <label className="subject-strategy-field">
          <span>Methodology</span>
          <select
            value={methodologyCode}
            onChange={(event) => setMethodologyCode(event.target.value as MethodologyCode)}
          >
            {METHODOLOGY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="subject-strategy-field">
          <span>Initial assessment</span>
          <input
            min="0"
            max="100"
            type="number"
            value={initialAssessmentScore}
            onChange={(event) => setInitialAssessmentScore(event.target.value)}
          />
        </label>

        <label className="subject-strategy-field">
          <span>Weekly goal</span>
          <input
            min="0"
            type="number"
            value={weeklyStudyMinutesGoal}
            onChange={(event) => setWeeklyStudyMinutesGoal(event.target.value)}
          />
        </label>

        <label className="subject-strategy-field">
          <span>Target date</span>
          <input
            type="date"
            value={targetDate}
            onChange={(event) => setTargetDate(event.target.value)}
          />
        </label>

        <button
          className="subject-strategy-save"
          type="button"
          onClick={() => void handleSave()}
          disabled={status === "saving"}
        >
          {status === "saving" ? "Saving..." : "Save strategy"}
        </button>
      </div>

      {selectedOption && (
        <p className="subject-strategy-mode-description">
          <strong>{selectedOption.label}:</strong> {selectedOption.description}
        </p>
      )}

      {error && <p className="subject-strategy-error">{error}</p>}

      <div className="subject-strategy-summary">
        <div>
          <span>Current</span>
          <strong>{score(selectedStrategy.currentMasteryScore)}</strong>
        </div>
        <div>
          <span>Expected target</span>
          <strong>{score(selectedStrategy.expectedMasteryScore)}</strong>
        </div>
        <div>
          <span>High-performance target</span>
          <strong>{score(selectedStrategy.highPerformanceTargetScore)}</strong>
        </div>
        <div>
          <span>Mode</span>
          <strong>{methodologyLabel(selectedStrategy.methodologyCode)}</strong>
        </div>
      </div>

      <div className="learning-curve-chart" aria-label="Learning curves">
        <div className="learning-curve-toolbar">
          <div className="learning-curve-legend">
            <span><i className="actual" /> Actual</span>
            <span><i className="expected" /> Expected</span>
            <span><i className="high" /> High-performance</span>
          </div>

          <label className="learning-curve-type-selector">
            <span>Chart type</span>
            <select
              value={chartType}
              onChange={(event) => setChartType(event.target.value as LearningCurveChartType)}
            >
              <option value="BAR">Bars</option>
              <option value="LINE">Line</option>
            </select>
          </label>
        </div>

        {chartType === "BAR" ? (
          <div className="learning-curve-plot">
            {selectedStrategy.curvePoints.map((point) => (
              <div className="learning-curve-week" key={`${point.pointDate}-${point.weekIndex}`}>
                <div className="learning-curve-bars">
                  <span
                    className="learning-curve-bar actual"
                    style={{ height: `${((point.actualMasteryScore ?? 0) / 100) * 100}%` }}
                    title={`Actual: ${score(point.actualMasteryScore)}`}
                  />
                  <span
                    className="learning-curve-bar expected"
                    style={{ height: `${(point.expectedMasteryScore / 100) * 100}%` }}
                    title={`Expected: ${score(point.expectedMasteryScore)}`}
                  />
                  <span
                    className="learning-curve-bar high"
                    style={{ height: `${(point.highPerformanceScore / 100) * 100}%` }}
                    title={`High-performance: ${score(point.highPerformanceScore)}`}
                  />
                </div>
                <span className="learning-curve-week-label">W{point.weekIndex + 1}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="learning-curve-line-wrapper">
            <svg
              className="learning-curve-line-chart"
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              role="img"
              aria-label="Line chart comparing actual, expected and high-performance mastery curves"
            >
              <line x1="0" y1="0" x2={chartWidth} y2="0" className="learning-curve-grid-line" />
              <line x1="0" y1={chartHeight / 2} x2={chartWidth} y2={chartHeight / 2} className="learning-curve-grid-line" />
              <line x1="0" y1={chartHeight} x2={chartWidth} y2={chartHeight} className="learning-curve-grid-line" />

              <polyline
                className="learning-curve-line actual"
                points={buildLinePoints(selectedStrategy.curvePoints, "actualMasteryScore", chartWidth, chartHeight)}
              />
              <polyline
                className="learning-curve-line expected"
                points={buildLinePoints(selectedStrategy.curvePoints, "expectedMasteryScore", chartWidth, chartHeight)}
              />
              <polyline
                className="learning-curve-line high"
                points={buildLinePoints(selectedStrategy.curvePoints, "highPerformanceScore", chartWidth, chartHeight)}
              />

              {selectedStrategy.curvePoints.map((point, index) => {
                const denominator = Math.max(selectedStrategy.curvePoints.length - 1, 1);
                const x = (index / denominator) * chartWidth;

                return (
                  <g key={`${point.pointDate}-${point.weekIndex}-points`}>
                    {point.actualMasteryScore !== null && point.actualMasteryScore !== undefined && (
                      <circle
                        className="learning-curve-dot actual"
                        cx={x}
                        cy={chartHeight - (Math.max(0, Math.min(100, Number(point.actualMasteryScore))) / 100) * chartHeight}
                        r="4"
                      />
                    )}
                    <circle
                      className="learning-curve-dot expected"
                      cx={x}
                      cy={chartHeight - (Math.max(0, Math.min(100, Number(point.expectedMasteryScore))) / 100) * chartHeight}
                      r="4"
                    />
                    <circle
                      className="learning-curve-dot high"
                      cx={x}
                      cy={chartHeight - (Math.max(0, Math.min(100, Number(point.highPerformanceScore))) / 100) * chartHeight}
                      r="4"
                    />
                  </g>
                );
              })}
            </svg>

            <div className="learning-curve-line-axis">
              {selectedStrategy.curvePoints.map((point) => (
                <span key={`${point.pointDate}-${point.weekIndex}-label`}>W{point.weekIndex + 1}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
