import { apiRequest } from "../../lib/apiClient";
import type {
  StudentReviewQueueActionResponse,
  StudentReviewQueueItem,
} from "./studentReviewQueueTypes";

export async function fetchStudentReviewQueue(studentId: string): Promise<StudentReviewQueueItem[]> {
  return apiRequest<StudentReviewQueueItem[]>(`/api/v1/students/${studentId}/review-queue`);
}

export async function startStudentReview(
  studentId: string,
  reviewQueueId: string,
): Promise<StudentReviewQueueActionResponse> {
  return apiRequest<StudentReviewQueueActionResponse>(
    `/api/v1/students/${studentId}/review-queue/${reviewQueueId}/start`,
    { method: "POST" },
  );
}

export async function completeStudentReview(
  studentId: string,
  reviewQueueId: string,
): Promise<StudentReviewQueueActionResponse> {
  return apiRequest<StudentReviewQueueActionResponse>(
    `/api/v1/students/${studentId}/review-queue/${reviewQueueId}/complete`,
    { method: "POST" },
  );
}

export async function skipStudentReview(
  studentId: string,
  reviewQueueId: string,
): Promise<StudentReviewQueueActionResponse> {
  return apiRequest<StudentReviewQueueActionResponse>(
    `/api/v1/students/${studentId}/review-queue/${reviewQueueId}/skip`,
    { method: "POST" },
  );
}
