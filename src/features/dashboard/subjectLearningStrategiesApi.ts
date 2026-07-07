import type {
  SubjectLearningStrategy,
  UpdateSubjectLearningStrategyRequest,
} from "./subjectLearningStrategiesTypes";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(body || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function fetchSubjectLearningStrategies(
  studentId: string,
): Promise<SubjectLearningStrategy[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/students/${studentId}/subject-learning-strategies`,
    { credentials: "include" },
  );

  return parseResponse<SubjectLearningStrategy[]>(response);
}

export async function updateSubjectLearningStrategy(
  studentId: string,
  request: UpdateSubjectLearningStrategyRequest,
): Promise<SubjectLearningStrategy> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/students/${studentId}/subject-learning-strategies`,
    {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    },
  );

  return parseResponse<SubjectLearningStrategy>(response);
}
