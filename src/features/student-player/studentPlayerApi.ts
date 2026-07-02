import type {
  AnswerSubmissionResponse,
  AssessmentAttemptResponse,
  StartAttemptRequest,
  StudentActivityPlayerResponse,
  SubmitAnswerRequest,
} from "./studentPlayerTypes";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Request failed with ${response.status}: ${body}`);
  }

  return response.json() as Promise<T>;
}

export function getStudentActivityPlayer(
  studentId: string,
  activityId: string,
): Promise<StudentActivityPlayerResponse> {
  return requestJson<StudentActivityPlayerResponse>(
    `/api/v1/students/${studentId}/activities/${activityId}/player`,
    { method: "GET" },
  );
}

export function startAssessmentAttempt(
  studentId: string,
  activityId: string,
  payload: StartAttemptRequest,
): Promise<AssessmentAttemptResponse> {
  return requestJson<AssessmentAttemptResponse>(
    `/api/v1/students/${studentId}/activities/${activityId}/attempts`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

export function submitAttemptAnswer(
  attemptId: string,
  payload: SubmitAnswerRequest,
): Promise<AnswerSubmissionResponse> {
  return requestJson<AnswerSubmissionResponse>(`/api/v1/attempts/${attemptId}/answers`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function completeAssessmentAttempt(attemptId: string): Promise<AssessmentAttemptResponse> {
  return requestJson<AssessmentAttemptResponse>(`/api/v1/attempts/${attemptId}/complete`, {
    method: "POST",
  });
}

export function getAssessmentAttempt(attemptId: string): Promise<AssessmentAttemptResponse> {
  return requestJson<AssessmentAttemptResponse>(`/api/v1/attempts/${attemptId}`, {
    method: "GET",
  });
}
