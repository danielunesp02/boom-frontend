import { apiRequest } from "../../lib/apiClient";
import type {
  SubjectLearningStrategy,
  UpdateSubjectLearningStrategyRequest,
} from "./subjectLearningStrategiesTypes";

export async function fetchSubjectLearningStrategies(
  studentId: string,
): Promise<SubjectLearningStrategy[]> {
  return apiRequest<SubjectLearningStrategy[]>(
    `/api/v1/students/${studentId}/subject-learning-strategies`,
  );
}

export async function updateSubjectLearningStrategy(
  studentId: string,
  request: UpdateSubjectLearningStrategyRequest,
): Promise<SubjectLearningStrategy> {
  return apiRequest<SubjectLearningStrategy>(
    `/api/v1/students/${studentId}/subject-learning-strategies`,
    {
      method: "PUT",
      body: JSON.stringify(request),
    },
  );
}
