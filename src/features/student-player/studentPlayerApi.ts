import type {
  AnswerSubmissionResponse,
  AssessmentAttemptResponse,
  StudentActivityPlayerResponse,
} from "./studentPlayerTypes";

const API_BASE_URL = "/api/v1";

type AssessmentAttemptRequest = {
  sourceChannel: "WEB" | "MOBILE" | "TABLET";
  locale: string;
};

type AnswerSubmissionRequest = {
  questionId: string;
  selectedOptionId: string;
  timeSpentSeconds: number;
};

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  return text ? (JSON.parse(text) as T) : ({} as T);
}

export async function getStudentActivityPlayer(
    studentId: string,
    activityId: string,
): Promise<StudentActivityPlayerResponse> {
  const response = await fetch(
      `${API_BASE_URL}/students/${studentId}/activities/${activityId}/player`,
      {
        method: "GET",
        credentials: "include",
      },
  );

  return parseJsonResponse<StudentActivityPlayerResponse>(response);
}

export async function startAssessmentAttempt(
    studentId: string,
    activityId: string,
    payload: AssessmentAttemptRequest,
): Promise<AssessmentAttemptResponse> {
  const response = await fetch(
      `${API_BASE_URL}/students/${studentId}/activities/${activityId}/attempts`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
  );

  return parseJsonResponse<AssessmentAttemptResponse>(response);
}

export async function getAssessmentAttempt(
    attemptId: string,
): Promise<AssessmentAttemptResponse> {
  const response = await fetch(`${API_BASE_URL}/attempts/${attemptId}`, {
    method: "GET",
    credentials: "include",
  });

  return parseJsonResponse<AssessmentAttemptResponse>(response);
}

export async function submitAttemptAnswer(
    attemptId: string,
    payload: AnswerSubmissionRequest,
): Promise<AnswerSubmissionResponse> {
  const response = await fetch(`${API_BASE_URL}/attempts/${attemptId}/answers`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseJsonResponse<AnswerSubmissionResponse>(response);
}

export async function completeAssessmentAttempt(
    attemptId: string,
): Promise<AssessmentAttemptResponse> {
  const response = await fetch(`${API_BASE_URL}/attempts/${attemptId}/complete`, {
    method: "POST",
    credentials: "include",
  });

  const completedAttempt = await parseJsonResponse<AssessmentAttemptResponse>(response);

  if (completedAttempt.status !== "COMPLETED") {
    throw new Error(
        `Attempt was not completed. Expected COMPLETED, received ${completedAttempt.status}`,
    );
  }

  return completedAttempt;
}

export async function completeReviewQueueItem(
    studentId: string,
    reviewQueueId: string,
): Promise<void> {
  const response = await fetch(
      `${API_BASE_URL}/students/${studentId}/review-queue/${reviewQueueId}/complete`,
      {
        method: "POST",
        credentials: "include",
      },
  );

  await parseJsonResponse<unknown>(response);
}
