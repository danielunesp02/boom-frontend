import { useEffect, useMemo, useRef, useState } from "react";
import "../../styles/boomBrand.css";
import {
  completeAssessmentAttempt,
  completeReviewQueueItem,
  getStudentActivityPlayer,
  startAssessmentAttempt,
  submitAttemptAnswer,
} from "./studentPlayerApi";
import type {
  AnswerSubmissionResponse,
  AssessmentAttemptResponse,
  StudentActivityPlayerResponse,
  StudentPlayerOption,
  StudentPlayerQuestion,
} from "./studentPlayerTypes";
import "./studentPlayer.css";

type PlayerState = "loading" | "ready" | "error" | "completed";
type QuestionState = "selecting" | "submitting" | "submitted";

type StudentActivityPlayerPageProps = {
  studentId?: string;
  activityId?: string;
};

function getQueryParam(name: string) {
  return new URLSearchParams(window.location.search).get(name) ?? undefined;
}

function optionKey(questionId: string) {
  return `question:${questionId}`;
}

function formatComplexity(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function nowSeconds(startTime: number) {
  return Math.max(1, Math.round((Date.now() - startTime) / 1000));
}

function sourceChannelForViewport(): "WEB" | "MOBILE" | "TABLET" {
  const width = window.innerWidth;

  if (width <= 760) return "MOBILE";
  if (width <= 1100) return "TABLET";

  return "WEB";
}

export function StudentActivityPlayerPage(props: StudentActivityPlayerPageProps) {
  const studentId = props.studentId ?? getQueryParam("studentId");
  const activityId = props.activityId ?? getQueryParam("activityId");
  const reviewQueueId = getQueryParam("reviewQueueId");

  const [state, setState] = useState<PlayerState>("loading");
  const [questionState, setQuestionState] = useState<QuestionState>("selecting");
  const [player, setPlayer] = useState<StudentActivityPlayerResponse | null>(null);
  const [attempt, setAttempt] = useState<AssessmentAttemptResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, StudentPlayerOption>>({});
  const [answerResults, setAnswerResults] = useState<Record<string, AnswerSubmissionResponse>>({});
  const [showHint, setShowHint] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const questionStartedAtRef = useRef(Date.now());

  useEffect(() => {
    let active = true;

    async function load() {
      if (!studentId || !activityId) {
        setState("error");
        setError("Missing studentId or activityId.");
        return;
      }

      try {
        setState("loading");
        setQuestionState("selecting");
        setError(null);

        const result = await getStudentActivityPlayer(studentId, activityId);

        const startedAttempt = await startAssessmentAttempt(studentId, activityId, {
          sourceChannel: sourceChannelForViewport(),
          locale: localStorage.getItem("boom.user.locale") ?? "en-US",
        });

        if (!active) return;

        setPlayer(result);
        setAttempt(startedAttempt);
        setState("ready");
        questionStartedAtRef.current = Date.now();
      } catch (err) {
        if (!active) return;

        setState("error");
        setError(err instanceof Error ? err.message : "Could not load activity.");
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [studentId, activityId]);

  const currentQuestion = player?.questions[currentIndex];

  const answeredCount = useMemo(() => Object.keys(answerResults).length, [answerResults]);

  const progressPercentage = player?.questions.length
    ? Math.round((answeredCount / player.questions.length) * 100)
    : 0;

  function selectOption(question: StudentPlayerQuestion, option: StudentPlayerOption) {
    if (questionState !== "selecting") return;

    setSelectedOptions((current) => ({
      ...current,
      [optionKey(question.questionId)]: option,
    }));
  }

  async function checkAnswer() {
    if (!attempt || !currentQuestion) return;

    const selectedOption = selectedOptions[optionKey(currentQuestion.questionId)];

    if (!selectedOption) return;

    try {
      setQuestionState("submitting");
      setError(null);

      const response = await submitAttemptAnswer(attempt.attemptId, {
        questionId: currentQuestion.questionId,
        selectedOptionId: selectedOption.optionId,
        timeSpentSeconds: nowSeconds(questionStartedAtRef.current),
      });

      setAnswerResults((current) => ({
        ...current,
        [optionKey(currentQuestion.questionId)]: response,
      }));

      setQuestionState("submitted");
    } catch (err) {
      setQuestionState("selecting");
      setError(err instanceof Error ? err.message : "Could not submit answer.");
    }
  }
  async function goNext() {
    if (!player || !attempt) return;

    setShowHint(false);
    setError(null);

    if (currentIndex >= player.questions.length - 1) {
      try {
        setIsCompleting(true);

        const completed = await completeAssessmentAttempt(attempt.attemptId);

        if (completed.status !== "COMPLETED") {
          throw new Error(`Attempt was not completed. Current status: ${completed.status}`);
        }

        if (studentId && reviewQueueId) {
          await completeReviewQueueItem(studentId, reviewQueueId);
        }

        setAttempt(completed);
        setState("completed");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not complete attempt.");
      } finally {
        setIsCompleting(false);
      }

      return;
    }

    setCurrentIndex((current) => current + 1);
    setQuestionState("selecting");
    questionStartedAtRef.current = Date.now();
  }

  function goPrevious() {
    if (questionState === "submitting") return;

    setShowHint(false);
    setCurrentIndex((current) => Math.max(0, current - 1));
    setQuestionState("selecting");
    questionStartedAtRef.current = Date.now();
  }

  function restart() {
    window.location.reload();
  }

  function continueAfterCompletion() {
    if (studentId && reviewQueueId) {
      window.location.href = `/student/reviews?studentId=${studentId}`;
      return;
    }

    window.location.href = "/";
  }

  if (state === "loading") {
    return (
      <main className="student-player-page">
        <section className="student-player-state-card">
          <div className="student-player-logo-mark" aria-hidden="true">
            ✦
          </div>
          <div className="student-player-loader" />
          <h1>Loading activity...</h1>
          <p>Preparing your Boom learning session.</p>
        </section>
      </main>
    );
  }

  if (state === "error" || !player) {
    return (
      <main className="student-player-page">
        <section className="student-player-state-card student-player-error">
          <h1>We could not open this activity</h1>
          <p>{error ?? "Please try again."}</p>
        </section>
      </main>
    );
  }

  if (state === "completed") {
    return (
      <main className="student-player-page student-player-completed-page">
        <section className="student-player-result-card">
          <div className="student-player-result-badge">Great work</div>
          <h1>{player.student.displayName}, you completed the activity!</h1>
          <p>{player.aiCoach.completionPreview.message}</p>

          <div className="student-player-result-grid">
            <div>
              <span>Answered</span>
              <strong>
                {attempt?.answeredQuestions ?? answeredCount}/{player.questions.length}
              </strong>
            </div>
            <div>
              <span>Correct</span>
              <strong>{attempt?.correctAnswers ?? 0}</strong>
            </div>
            <div>
              <span>Accuracy</span>
              <strong>{Math.round(attempt?.accuracy ?? 0)}%</strong>
            </div>
          </div>

          <div className="student-player-result-actions">
            <button className="student-player-secondary-button" type="button" onClick={restart}>
              Review again
            </button>
            <button
              className="student-player-primary-button"
              type="button"
              onClick={continueAfterCompletion}
            >
              {reviewQueueId ? "Back to review queue" : "Continue"}
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (!currentQuestion) {
    return (
      <main className="student-player-page">
        <section className="student-player-state-card">
          <h1>No questions available</h1>
          <p>This activity does not have questions yet.</p>
        </section>
      </main>
    );
  }

  const selectedOption = selectedOptions[optionKey(currentQuestion.questionId)];
  const answerResult = answerResults[optionKey(currentQuestion.questionId)];
  const isLastQuestion = currentIndex === player.questions.length - 1;
  const submitted = questionState === "submitted";

  return (
    <main className="student-player-page">
      <section className="student-player-shell">
        <header className="student-player-header">
          <div>
            <span className="student-player-eyebrow">
              Boom Learning • {player.student.displayName}
            </span>
            <h1>{player.activity.title}</h1>
            <p>{player.activity.description}</p>
          </div>

          <div className="student-player-header-pill">
            {currentIndex + 1}/{player.questions.length}
          </div>
        </header>

        <div className="student-player-progress-track" aria-label="Activity progress">
          <div className="student-player-progress-fill" style={{ width: `${progressPercentage}%` }} />
        </div>

        <section className="student-player-coach-card">
          <div className="student-player-coach-avatar" aria-hidden="true">
            ✨
          </div>
          <div>
            <strong>{player.aiCoach.coachName}</strong>
            <p>
              {answerResult?.aiFeedback?.message ??
                (currentIndex === 0 ? player.aiCoach.introMessage.message : currentQuestion.hint.message)}
            </p>
          </div>
        </section>

        <section className={`student-player-question-card ${submitted ? "submitted" : ""}`}>
          <div className="student-player-question-meta">
            <span>Question {currentIndex + 1}</span>
            <span>{formatComplexity(currentQuestion.complexityLevel)}</span>
            {submitted && (
              <span className={answerResult?.correct ? "student-player-meta-correct" : "student-player-meta-incorrect"}>
                {answerResult?.correct ? "Correct" : "Review"}
              </span>
            )}
          </div>

          <h2>{currentQuestion.prompt}</h2>

          <div className="student-player-options-grid">
            {currentQuestion.options.map((option) => {
              const selected = selectedOption?.optionId === option.optionId;
              const submittedSelected = submitted && selected;
              const correct = submittedSelected && answerResult?.correct;
              const incorrect = submittedSelected && answerResult && !answerResult.correct;

              return (
                <button
                  key={option.optionId}
                  className={[
                    "student-player-option-card",
                    selected ? "selected" : "",
                    submitted ? "locked" : "",
                    correct ? "correct" : "",
                    incorrect ? "incorrect" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  type="button"
                  disabled={submitted || questionState === "submitting"}
                  onClick={() => selectOption(currentQuestion, option)}
                >
                  <span className="student-player-option-label">{option.label}</span>
                  <span className="student-player-option-text">{option.text}</span>
                </button>
              );
            })}
          </div>

          {showHint && !submitted && (
            <div className="student-player-hint-card">
              <strong>Hint</strong>
              <p>{currentQuestion.hint.message}</p>
            </div>
          )}

          {submitted && answerResult && (
            <div className={`student-player-feedback-card ${answerResult.correct ? "correct" : "incorrect"}`}>
              <strong>{answerResult.correct ? "Nice work!" : "Good try — let's learn from it."}</strong>
              <p>{answerResult.aiFeedback?.message}</p>
            </div>
          )}

          {error && <div className="student-player-inline-error">{error}</div>}
        </section>

        <footer className="student-player-footer">
          <button
            className="student-player-secondary-button"
            type="button"
            onClick={goPrevious}
            disabled={currentIndex === 0 || questionState === "submitting"}
          >
            Back
          </button>

          <button
            className="student-player-ghost-button"
            type="button"
            onClick={() => setShowHint((current) => !current)}
            disabled={submitted || questionState === "submitting"}
          >
            {showHint ? "Hide hint" : "Show hint"}
          </button>

          {!submitted ? (
            <button
              className="student-player-primary-button"
              type="button"
              disabled={!selectedOption || questionState === "submitting"}
              onClick={checkAnswer}
            >
              {questionState === "submitting" ? "Checking..." : "Check answer"}
            </button>
          ) : (
              <button
                  className="student-player-primary-button"
                  type="button"
                  onClick={goNext}
                  disabled={isCompleting}
              >
                {isCompleting ? "Finishing..." : isLastQuestion ? "Finish" : "Next"}
              </button>
          )}
        </footer>
      </section>
    </main>
  );
}

export default StudentActivityPlayerPage;
